// npm run export-pdf -> dist/ibrd-bank-tour.pdf (1920x1080 pages, backgrounds on)
// = capture-bg (only if images are missing) + print. Verifies: page count = cover + contents + scenes
// (+ logged overflow pages) + references; every scene page has a non-blank background image; no clipped text.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

const bgDir = path.join(ROOT, 'src', 'assets', 'print-bg');
const have = fs.existsSync(bgDir) ? fs.readdirSync(bgDir).filter((f) => f.endsWith('.jpg')).length : 0;
if (have < 50) {
  console.log('print backgrounds missing: running capture-bg…');
  ensureSingleBuild(true);
  execSync('node scripts/capture-bg.mjs', { cwd: ROOT, stdio: 'inherit' });
}
const url = ensureSingleBuild(true);
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url + '?print=1');
await page.waitForFunction(() => window.__printReady > 0, null, { timeout: 120000 });
// wait until the overflow splitting has settled
let last = -1;
for (let k = 0; k < 20; k++) {
  const n = await page.evaluate(() => window.__printReady);
  if (n === last) break;
  last = n;
  await page.waitForTimeout(1500);
}
const info = await page.evaluate(() => {
  const pages = [...document.querySelectorAll('section.page')];
  const scenePages = pages.filter((p) => p.classList.contains('scene-page'));
  const noBg = scenePages.filter((p) => { const img = p.querySelector('img.page-bg'); return !img || !img.complete || img.naturalWidth < 100; }).map((p) => p.dataset.scene);
  const clipped = scenePages.filter((p) => [...p.querySelectorAll('.sheet, .pcard')].some((s) => s.scrollHeight > s.clientHeight + 1)).map((p) => `${p.dataset.scene} (part ${Number(p.dataset.part) + 1})`);
  return { total: pages.length, scenes: window.__printScenes, overflow: window.__printOverflow, stuck: window.__printStuck, noBg, clipped, refs: pages.filter((p) => p.dataset.kind === 'refs').length };
});
await page.emulateMedia({ media: 'print' });
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const out = path.join(ROOT, 'dist', 'ibrd-bank-tour.pdf');
await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true, width: '1920px', height: '1080px' });
await browser.close();
const pdf = fs.readFileSync(out, 'latin1');
const count = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
const extra = info.total - (2 + info.scenes + info.refs);
console.log(`wrote ${path.relative(ROOT, out)}: ${count} PDF pages = cover + contents + ${info.scenes} scenes + ${extra} extra scene page(s) + ${info.refs} reference pages (${Math.round(fs.statSync(out).size / 1e6)} MB)`);
console.log('overflow scenes:', info.overflow.length ? info.overflow.join(', ') : 'none');
let fail = false;
if (count !== info.total) { console.error(`✗ PDF has ${count} pages, the print view ${info.total}`); fail = true; }
if (info.noBg.length) { console.error('✗ scene pages without a background image:', info.noBg.join(', ')); fail = true; }
if (info.clipped.length) { console.error('✗ clipped scene pages:', info.clipped.join(', ')); fail = true; }
if (errors.length) { console.error('console errors:\n' + errors.join('\n')); fail = true; }
fs.writeFileSync(
  path.join(ROOT, 'docs', 'print-overflow.md'),
  `# Print overflow\n\nScenes whose exhibits and cards do not fit one 1920x1080 page at the minimum font sizes (body 20 px, tables 18-19 px), so they continue on extra pages (written by \`npm run export-pdf\`). Cards are never shrunk and a beat is never split; whole cards (or whole exhibits) move to the next page.\n\n${info.overflow.length ? info.overflow.map((x) => `- ${x}`).join('\n') : '- none'}\n\nPages that still could not be made to fit: ${info.stuck?.length ? info.stuck.join(', ') : 'none'}.\n\nTotal: ${count} pages = cover + contents + ${info.scenes} scenes + ${extra} extra scene page(s) + ${info.refs} reference pages.\n`,
);
process.exit(fail ? 1 : 0);
