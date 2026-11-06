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
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  if (only.length && !only.includes(s.id)) continue;
  const last = Math.max(0, s.beats - 1);
  const seq = await page.evaluate(([i, b]) => { window.__tour.getState().goto(i, b, 'jump'); return window.__tour.getState().navSeq; }, [i, last]);
  await page.waitForFunction((q) => window.__tourSettled === q, seq, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(400);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  // uniformity test on the WebGL canvas (preserveDrawingBuffer is on in capture mode)
  const stat = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return { sd: 0 };
    const t = document.createElement('canvas');
    t.width = 192; t.height = 108;
    const g = t.getContext('2d');
    g.drawImage(c, 0, 0, 192, 108);
    const d = g.getImageData(0, 0, 192, 108).data;
    let s = 0, s2 = 0, n = 0;
    for (let k = 0; k < d.length; k += 4) { const y = 0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]; s += y; s2 += y * y; n++; }
    const m = s / n;
    return { mean: m, sd: Math.sqrt(s2 / n - m * m) };
  });
  const file = path.join(out, `${s.id}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality });
  const kb = Math.round(fs.statSync(file).size / 1024);
  const ok = stat.sd > 6;
  if (!ok) bad.push(s.id);
  console.log(`${ok ? '✓' : '✗'} ${s.id.padEnd(24)} sd ${stat.sd.toFixed(1)}  ${kb} KB`);
}
await browser.close();
if (errors.length) console.error(errors.join('\n'));
if (bad.length) { console.error('blank or uniform backgrounds:', bad.join(', ')); process.exit(1); }
