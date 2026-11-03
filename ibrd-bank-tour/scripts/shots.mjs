// npm run test:shots [-- --only=f1-what,f2-cycle] [-- --build]
// Screenshots the END pose (last beat, transitions finished) of every scene to docs/screens/.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

const url = ensureSingleBuild(true);
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean);
const out = path.join(ROOT, 'docs', 'screens');
fs.mkdirSync(out, { recursive: true });

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url + '?shot=1#ext-facade/1');
await page.waitForFunction(() => window.__tour && document.fonts.status === 'loaded', null, { timeout: 30000 });
const ids = await page.evaluate(() => window.__scenes);
const report = [];
for (let i = 0; i < ids.length; i++) {
  const { id, beats } = ids[i];
  if (only.length && !only.includes(id)) continue;
  const last = Math.max(0, beats - 1);
  await page.evaluate(([i, b]) => window.__tour.getState().goto(i, b, 'jump'), [i, last]);
  await page.waitForFunction((seq) => window.__tourSettled === seq, await page.evaluate(() => window.__tour.getState().navSeq), { timeout: 20000 });
  await page.waitForTimeout(900); // entry animations of DOM content
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const file = path.join(out, `${String(i + 1).padStart(2, '0')}-${id}.png`);
  await page.screenshot({ path: file });
  const perf = await page.evaluate(() => window.__perf && { ...window.__perf });
  report.push({ i: i + 1, id, beats, ...perf });
  console.log(`${String(i + 1).padStart(2)} ${id.padEnd(24)} beats ${beats}  ${perf ? `${perf.calls} calls ${(perf.tris / 1000).toFixed(0)}k tris` : ''}`);
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
