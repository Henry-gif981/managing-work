// node scripts/print-preview.mjs <outdir> [page numbers...] — screenshots print pages (1-based) for a visual check.
import path from 'node:path';
import { ensureSingleBuild, launch } from './browser.mjs';

const [out, ...nums] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const url = ensureSingleBuild(process.argv.includes('--build'));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1960, height: 1100 } });
page.on('pageerror', (e) => console.error('pageerror', String(e)));
await page.goto(url + '?print=1');
await page.waitForFunction(() => window.__printReady > 0, null, { timeout: 180000 });
const info = await page.evaluate(() => ({
  total: window.__printReady,
  overflow: window.__printOverflow,
  stuck: window.__printStuck,
  ids: [...document.querySelectorAll('section.page')].map((p, i) => `${i + 1}:${p.dataset.kind}${p.dataset.scene ? ':' + p.dataset.scene : ''}`),
}));
console.log(JSON.stringify(info));
const els = await page.$$('section.page');
for (const n of nums.map(Number)) if (els[n - 1]) await els[n - 1].screenshot({ path: path.join(out, `p${String(n).padStart(2, '0')}.png`) });
await browser.close();
