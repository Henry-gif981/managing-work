// npm run capture-bg [-- --only=id] — 3D backgrounds for the print/PDF view.
// Loads ?capture=1 (HUD and content hidden), goes to each scene's END pose (last beat), waits for a settled frame
// and saves a 1920x1080 JPEG to src/assets/print-bg/<scene-id>.jpg (embedded in the single-file build).
// Fails if an image is blank or almost uniform.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

const url = ensureSingleBuild(process.argv.includes('--build'));
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean);
const quality = Number((process.argv.find((a) => a.startsWith('--quality=')) ?? '--quality=82').slice(10));
const out = path.join(ROOT, 'src', 'assets', 'print-bg');
fs.mkdirSync(out, { recursive: true });
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url + '?capture=1#ext-facade/1');
await page.waitForFunction(() => window.__tour && window.__scenes, null, { timeout: 60000 });
const scenes = await page.evaluate(() => window.__scenes);
let bad = [];
const overexposed = [];
const log = [];
// statistics of the WebGL canvas (preserveDrawingBuffer is on in capture mode), Rec. 709 luminance on 0-255
function measure() {
  const c = document.querySelector('canvas');
  if (!c) return { sd: 0, hi: 1, mean: 1 };
  const t = document.createElement('canvas');
  t.width = 480; t.height = 270;
  const g = t.getContext('2d');
  g.drawImage(c, 0, 0, 480, 270);
  const d = g.getImageData(0, 0, 480, 270).data;
  let s = 0, s2 = 0, n = 0, hi = 0;
  for (let k = 0; k < d.length; k += 4) { const y = 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]; s += y; s2 += y * y; n++; if (y > 245) hi++; }
  const m = s / n;
  return { mean: m / 255, sd: Math.sqrt(Math.max(0, s2 / n - m * m)), hi: hi / n };
}
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  if (only.length && !only.includes(s.id)) continue;
  const last = Math.max(0, s.beats - 1);
  const seq = await page.evaluate(([i, b]) => { window.__tour.getState().goto(i, b, 'jump'); return window.__tour.getState().navSeq; }, [i, last]);
  await page.waitForFunction((q) => window.__tourSettled === q, seq, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(400);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  // exposure loop: start at 1.0; reject if > 25% of pixels are above luminance 245 or the mean is above 0.90,
  // then lower exposure and light intensity by 15% and retry (at most 4 retries)
  let e = 1, stat, tries = 0;
  for (;;) {
    await page.evaluate((x) => window.__capture?.set(x), e);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
    stat = await page.evaluate(measure);
    if ((stat.hi <= 0.25 && stat.mean <= 0.9) || tries >= 4) break;
    e = +(e * 0.85).toFixed(4);
    tries++;
  }
  const file = path.join(out, `${s.id}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality });
  const kb = Math.round(fs.statSync(file).size / 1024);
  const uniform = stat.sd <= 6;
  const over = stat.hi > 0.25 || stat.mean > 0.9;
  if (uniform) bad.push(s.id);
  if (over) overexposed.push(s.id);
  log.push({ id: s.id, exposure: e, tries: tries + 1, hi: stat.hi, mean: stat.mean, sd: stat.sd });
  console.log(`${uniform || over ? '✗' : '✓'} ${s.id.padEnd(24)} exposure ${e.toFixed(3)} (${tries + 1} tr${tries ? 'ies' : 'y'})  >245: ${(stat.hi * 100).toFixed(1)}%  mean ${stat.mean.toFixed(3)}  sd ${stat.sd.toFixed(1)}  ${kb} KB`);
}
await browser.close();
if (errors.length) console.error(errors.join('\n'));
if (!only.length) {
  const rows = log.map((r) => `| \`${r.id}\` | ${r.exposure.toFixed(3)} | ${r.tries} | ${(r.hi * 100).toFixed(1)}% | ${r.mean.toFixed(3)} | ${r.sd.toFixed(1)} |`).join('\n');
  fs.writeFileSync(path.join(ROOT, 'docs', 'capture-exposure.md'), `# Print background exposure (npm run capture-bg)\n\nEach scene starts at exposure 1.0 (linear tone mapping, no post-processing). An image is rejected if more than 25% of its pixels are above luminance 245 or its mean luminance is above 0.90; exposure and the exit-hall light are then lowered by 15% and the image is captured again (at most 4 retries).\n\n| Scene | Final exposure | Tries | Pixels > 245 | Mean luminance | SD |\n|---|---|---|---|---|---|\n${rows}\n`);
}
if (bad.length) console.error('blank or uniform backgrounds:', bad.join(', '));
if (overexposed.length) console.error('still overexposed after 4 retries:', overexposed.join(', '));
if (bad.length || overexposed.length) process.exit(1);
