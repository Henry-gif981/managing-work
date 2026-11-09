// npm run test:shots [-- --only=f1-what,f2-cycle] [-- --build]
// Screenshots the END pose (last beat, transitions finished) of every scene to docs/screens/.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

const url = ensureSingleBuild(true);
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean);
const segs = (process.argv.find((a) => a.startsWith('--segments=')) ?? '').slice(11).split(',').filter(Boolean);
// --all-beats: every beat; default: first and last beat (one shot when equal)
const allBeats = process.argv.includes('--all-beats');
const out = path.join(ROOT, 'docs', 'screens');
fs.mkdirSync(out, { recursive: true });

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url + '?shot=1#ext-facade/1');
await page.waitForFunction(() => window.__tour && document.fonts.status === 'loaded', null, { timeout: 30000 });
// Details mode: detail beats (out of the main flow) are reachable too, so every beat is checked
await page.evaluate(() => window.__edit?.store.getState().setDetails(true));
const ids = await page.evaluate(() => window.__scenes);
const report = [];
for (let i = 0; i < ids.length; i++) {
  const { id, beats, segment } = ids[i];
  if (only.length && !only.includes(id)) continue;
  if (segs.length && !segs.includes(segment)) continue;
  const lastB = Math.max(0, beats - 1);
  const list = allBeats ? [...Array(Math.max(1, beats)).keys()] : [...new Set([0, lastB])];
  for (const last of list) {
  await page.evaluate(([i, b]) => window.__tour.getState().goto(i, b, 'jump'), [i, last]);
  await page.waitForFunction((seq) => window.__tourSettled === seq, await page.evaluate(() => window.__tour.getState().navSeq), { timeout: 20000 });
  await page.waitForTimeout(900); // entry animations of DOM content
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const suffix = list.length > 1 ? `-b${last + 1}` : '';
  const file = path.join(out, `${String(i + 1).padStart(2, '0')}-${id}${suffix}.png`);
  await page.screenshot({ path: file });
  const perf = await page.evaluate(() => window.__perf && { ...window.__perf });
  const overflow = await page.evaluate(() => {
    // content clipped by its card, or reaching into the HUD safe margins
    const out = [];
    for (const el of document.querySelectorAll('.scene-layer .card, .scene-layer .dt-wrap, .scene-layer .chart')) {
      if (el.scrollHeight > el.clientHeight + 2) out.push('clipped ' + el.className);
      const r = el.getBoundingClientRect();
      const s = Math.min(innerWidth / 1920, innerHeight / 1080);
      const oy = (innerHeight - 1080 * s) / 2;
      if ((r.top - oy) / s < 84 - 1 || (r.bottom - oy) / s > 1080 - 72 + 1) out.push('in HUD margin ' + el.className);
    }
    return out;
  });
  report.push({ i: i + 1, id, beat: last + 1, beats, ...perf, overflow });
  console.log(`${String(i + 1).padStart(2)} ${(id + suffix).padEnd(28)} beats ${beats}  ${perf ? `${perf.calls} calls ${(perf.tris / 1000).toFixed(0)}k tris` : ''}${overflow.length ? '  ⚠ ' + overflow.join('; ') : ''}`);
  }
}
await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
const over = report.filter((r) => r.calls > 150 || r.tris > 300000);
if (over.length) console.warn('OVER BUDGET:', over.map((r) => r.id).join(', '));
if (errors.length) {
  console.error('console errors:\n' + [...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(`\n${report.length} screenshots in docs/screens, no console errors.`);
