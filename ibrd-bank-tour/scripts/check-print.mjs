// npm run check-print — checks every page of the print view (?print=1) and writes docs/print-check.md.
//  1. contrast: each text node's colour against the rendered page with all text hidden (mean of the pixels under
//     its rectangle); fails below 4.5:1
//  2. text inside the footer zone (bottom 110 px, except the footer itself) or outside the page edge
//  3. a card / sheet / list box whose scrollHeight exceeds its height (clipped content)
//  4. 3D background images (cover and scene pages): blank or nearly uniform (SD <= 6), or overexposed
//     (> 25% of pixels above luminance 245, or mean luminance > 0.90)
//  5. references: the printed set is exactly [1]..[N], each once, in order
//  6. font sizes: card body >= 20 px, table cells >= 18 px, any other text >= 14 px (citations excepted)
// Exits non-zero on any failure.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

// --file=<path>: check another single-file HTML (e.g. a saved file with edits) instead of dist-single
const fileArg = (process.argv.find((a) => a.startsWith('--file=')) ?? '').slice(7);
const url = fileArg ? pathToFileURL(path.resolve(fileArg)).href : ensureSingleBuild(process.argv.includes('--build'));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1960, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url + '?print=1');
await page.waitForFunction(() => window.__printReady > 0, null, { timeout: 180000 });
await page.waitForTimeout(500);

const meta = await page.evaluate(() => ({ total: document.querySelectorAll('section.page').length, nRefs: window.__printRefCount ?? null }));
const fails = { contrast: [], footer: [], clip: [], background: [], refs: [], font: [] };
let textCount = 0;
let minContrast = 99;

const HIDE = `section.page *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}
section.page svg text, section.page svg tspan{fill:transparent!important;stroke:transparent!important}`;

const handles = await page.$$('section.page');
for (let i = 0; i < handles.length; i++) {
  const h = handles[i];
  await h.scrollIntoViewIfNeeded();
  // text geometry, colours, font sizes, clipping, background statistics
  const info = await h.evaluate((sec) => {
    const box = sec.getBoundingClientRect();
    const zoom = box.width / 1920;
    const label = `${sec.dataset.kind}${sec.dataset.scene ? ':' + sec.dataset.scene : ''}`;
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const v = m[1].split(',').map((x) => parseFloat(x));
      return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 };
    };
    const texts = [];
    const walk = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode())) {
      const t = n.textContent.replace(/\s+/g, ' ').trim();
      if (!t) continue;
      const el = n.parentElement;
      if (!el || el.closest('title, style, script')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      let op = 1;
      for (let a = el; a && a !== sec; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity || '1');
      if (op < 0.05) continue;
      const svg = !!el.closest('svg');
      const col = parse(svg ? cs.fill : cs.color);
      if (!col || col.a * op < 0.05) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const rects = [...range.getClientRects()]
        .filter((r) => r.width > 1 && r.height > 1)
        .map((r) => ({ x: (r.left - box.left) / zoom, y: (r.top - box.top) / zoom, w: r.width / zoom, h: r.height / zoom }));
      if (!rects.length) continue;
      texts.push({
        t: t.slice(0, 60),
        col: { ...col, a: col.a * op },
        rects,
        fs: parseFloat(cs.fontSize),
        svg,
        foot: !!el.closest('.page-foot'),
        cite: !!el.closest('.cite, sup'),
        body: !!el.closest('.pc-body') && !el.closest('.dt, .chip, .stat-label, .k-stats, svg'),
        cell: !!el.closest('td, th'),
      });
    }
    const clipped = [...sec.querySelectorAll('.pcard, .sheet, .toc-inner, .refs-inner, .p-cover, .thanks-card')]
      .filter((e) => e.scrollHeight > e.clientHeight + 1)
      .map((e) => `${e.className.split(' ')[0]} (${e.scrollHeight} > ${e.clientHeight}): ${e.textContent.slice(0, 50)}`);
    let bg = null;
    const img = sec.querySelector('img.page-bg');
    if (img) {
      if (!img.complete || img.naturalWidth < 100) bg = { missing: true };
      else {
        const c = document.createElement('canvas');
        c.width = 480;
        c.height = 270;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, 480, 270);
        const d = g.getImageData(0, 0, 480, 270).data;
        let s = 0, s2 = 0, hi = 0, k = 0;
        for (let q = 0; q < d.length; q += 4) {
          const y = 0.2126 * d[q] + 0.7152 * d[q + 1] + 0.0722 * d[q + 2];
          s += y; s2 += y * y; k++; if (y > 245) hi++;
        }
        const m = s / k;
        bg = { mean: m / 255, sd: Math.sqrt(Math.max(0, s2 / k - m * m)), hi: hi / k };
      }
    }
    const refs = sec.dataset.kind === 'refs' ? [...sec.querySelectorAll('.refs-print li')].map((li) => Number(li.dataset.n)) : [];
    return { label, texts, clipped, bg, refs, isBgPage: sec.dataset.kind === 'scene' || sec.dataset.kind === 'cover' };
  });
  // background without text
  await page.addStyleTag({ content: HIDE }).then((s) => s.evaluate((n) => n.setAttribute('data-hide', '1')));
  const png = await h.screenshot({ type: 'png' });
  await page.evaluate(() => document.querySelectorAll('style[data-hide]').forEach((s) => s.remove()));
  const contrasts = await page.evaluate(
    async ({ b64, texts }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      const sx = img.naturalWidth / 1920;
      const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      const L = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);
      return texts.map((t) => {
        let worst = 99;
        for (const r of t.rects) {
          const x = Math.max(0, Math.floor(r.x * sx)), y = Math.max(0, Math.floor(r.y * sx));
          const w = Math.max(1, Math.min(c.width - x, Math.ceil(r.w * sx))), hh = Math.max(1, Math.min(c.height - y, Math.ceil(r.h * sx)));
          if (w <= 0 || hh <= 0 || x >= c.width || y >= c.height) continue;
          const d = g.getImageData(x, y, w, hh).data;
          let R = 0, G = 0, B = 0, k = 0;
          for (let q = 0; q < d.length; q += 4) { R += d[q]; G += d[q + 1]; B += d[q + 2]; k++; }
          R /= k; G /= k; B /= k;
          const a = t.col.a;
          const fr = t.col.r * a + R * (1 - a), fg = t.col.g * a + G * (1 - a), fb = t.col.b * a + B * (1 - a);
          const l1 = L(fr, fg, fb), l2 = L(R, G, B);
          worst = Math.min(worst, (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
        }
        return worst;
      });
    },
    { b64: png.toString('base64'), texts: info.texts },
  );
  const where = `p. ${i + 1} (${info.label})`;
  info.texts.forEach((t, k) => {
    textCount++;
    const cr = contrasts[k];
    if (cr < 99) minContrast = Math.min(minContrast, cr);
    if (cr < 4.5) fails.contrast.push(`${where}: ${cr.toFixed(2)}:1 · "${t.t}"`);
    for (const r of t.rects) {
      if (r.x < -0.5 || r.y < -0.5 || r.x + r.w > 1920.5 || r.y + r.h > 1080.5) { fails.footer.push(`${where}: outside the page edge · "${t.t}"`); break; }
      if (!t.foot && r.y + r.h > 970.5) { fails.footer.push(`${where}: in the footer zone (bottom ${Math.round(r.y + r.h)} px) · "${t.t}"`); break; }
    }
    if (!t.cite && !t.svg) {
      if (t.body && t.fs < 19.5) fails.font.push(`${where}: card body ${t.fs}px · "${t.t}"`);
      else if (t.cell && t.fs < 17.5) fails.font.push(`${where}: table text ${t.fs}px · "${t.t}"`);
      else if (t.fs < 13.5) fails.font.push(`${where}: ${t.fs}px · "${t.t}"`);
    }
  });
  for (const c of info.clipped) fails.clip.push(`${where}: ${c}`);
  if (info.isBgPage) {
    const b = info.bg;
    if (!b || b.missing) fails.background.push(`${where}: no 3D background image`);
    else {
      if (b.sd <= 6) fails.background.push(`${where}: blank or nearly uniform (SD ${b.sd.toFixed(1)})`);
      if (b.hi > 0.25 || b.mean > 0.9) fails.background.push(`${where}: overexposed (${(b.hi * 100).toFixed(1)}% > 245, mean ${b.mean.toFixed(3)})`);
    }
  }
  if (info.refs.length) fails.refs.push(...info.refs.map((n) => ({ n, p: i + 1 })));
  process.stdout.write(`\rchecked page ${i + 1}/${handles.length}`);
}
process.stdout.write('\n');
await browser.close();

// references: exactly [1]..[N] once, in order
const N = meta.nRefs;
const got = fails.refs.map((x) => x.n);
const refPages = [...new Set(fails.refs.map((x) => x.p))];
fails.refs = [];
const want = Array.from({ length: N }, (_, k) => k + 1);
if (got.join(',') !== want.join(',')) {
  const missing = want.filter((n) => !got.includes(n));
  const dup = got.filter((n, k) => got.indexOf(n) !== k);
  fails.refs.push(`printed ${got.length} entries; missing: ${missing.join(', ') || 'none'}; duplicated: ${dup.join(', ') || 'none'}; in order: ${got.every((n, k) => k === 0 || n > got[k - 1])}`);
}
if (errors.length) fails.clip.push(...errors.map((e) => `console error: ${e}`));

const titles = {
  contrast: '1. Text contrast ≥ 4.5:1',
  footer: '2. No text in the footer zone or outside the page',
  clip: '3. No clipped card, sheet or list (scrollHeight ≤ height)',
  background: '4. 3D backgrounds not blank, uniform or overexposed',
  refs: `5. References [1]..[${N}] exactly once, in order`,
  font: '6. Font sizes (body ≥ 20, tables ≥ 18, other ≥ 14 px)',
};
const totalFails = Object.values(fails).reduce((a, x) => a + x.length, 0);
let md = `# Print check (npm run check-print)\n\n${meta.total} pages, ${textCount} text nodes checked. Lowest contrast found: ${minContrast.toFixed(2)}:1. References printed on pages ${refPages[0]}–${refPages[refPages.length - 1]} (${got.length} entries).\n\n**Result: ${totalFails ? `${totalFails} failure(s)` : 'no failures'}.**\n\n| Check | Result |\n|---|---|\n`;
for (const [k, t] of Object.entries(titles)) md += `| ${t} | ${fails[k].length ? `✗ ${fails[k].length}` : '✓'} |\n`;
for (const [k, t] of Object.entries(titles)) if (fails[k].length) md += `\n## ${t}\n\n${fails[k].slice(0, 200).map((x) => `- ${x}`).join('\n')}\n`;
if (!fileArg) fs.writeFileSync(path.join(ROOT, 'docs', 'print-check.md'), md);
for (const [k, t] of Object.entries(titles)) console.log(`${fails[k].length ? '✗' : '✓'} ${t}${fails[k].length ? `: ${fails[k].length}` : ''}`);
for (const [k] of Object.entries(titles)) for (const x of fails[k].slice(0, 12)) console.log('   ', x);
console.log(`${meta.total} pages · ${totalFails} failure(s) · docs/print-check.md`);
process.exit(totalFails ? 1 : 0);
