// Design measurement pass (reports/design-changelog.md §Method).
// For every section at 1920×1080 with ?steps=all&preset=static&3d=0: screenshot, innerText, text nodes
// (size, colour, opacity, boxes), graphic blocks; a second screenshot with content text made transparent
// gives the real background under each glyph box for WCAG contrast. Analysis: scripts/measure-analyse.py.
// Usage: TAG=before|after node scripts/measure.mjs   (dev server on BASE, default http://127.0.0.1:5179)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TAG = process.env.TAG || 'before';
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const shots = path.join(root, 'screenshots', TAG);
const bgDir = path.join(root, 'screenshots', `.bg-${TAG}`);
const reports = path.join(root, 'reports');
for (const d of [shots, bgDir, reports]) fs.mkdirSync(d, { recursive: true });

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(`${BASE}/?steps=all&preset=static&3d=0`);
await page.waitForFunction(() => window.__deck && document.fonts.status === 'loaded');
// presenter toolbar is chrome, not slide: keep it out of every shot so before/after match
await page.addStyleTag({ content: '.chrome { display: none !important; }' });
const N = await page.evaluate(() => window.__deck.N);
const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;

const data = [];
for (let n = 1; n <= N; n++) {
  if (only && !only.includes(n)) continue;
  await page.evaluate((k) => window.__deck.go(k), n);
  await page.waitForTimeout(1000);
  const file = path.join(shots, `s${String(n).padStart(3, '0')}.png`);
  await page.screenshot({ path: file });
  const m = await page.evaluate(() => {
    const sec = document.querySelector('section.slide.is-current');
    const stage = document.querySelector('#stage');
    const sr = stage.getBoundingClientRect();
    const scale = sr.width / 1920;
    const rel = (r) => ({ x: (r.left - sr.left) / scale, y: (r.top - sr.top) / scale, w: r.width / scale, h: r.height / scale });
    const opac = (el) => { let o = 1; for (let e = el; e && e !== document.documentElement; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
    const label = (el) => { const parts = []; for (let e = el; e && e !== sec; e = e.parentElement) parts.unshift(e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : '')); return parts.slice(-3).join('>'); };
    const texts = [];
    const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!t.textContent.trim()) continue;
      const el = t.parentElement;
      if (el.closest('.art,[aria-hidden="true"]')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const rg = document.createRange(); rg.selectNodeContents(t);
      const boxes = [...rg.getClientRects()].map(rel).filter((b) => b.w > 1 && b.h > 1);
      if (!boxes.length) continue;
      texts.push({ chrome: !!el.closest('.runner'), el: label(el), text: t.textContent.trim().slice(0, 60), size: parseFloat(cs.fontSize) * scale / scale, weight: Number(cs.fontWeight) || 400,
        color: el instanceof SVGElement ? cs.fill : cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color && !/rgba\(0, 0, 0, 0\)/.test(cs.webkitTextFillColor) ? cs.webkitTextFillColor : cs.color, opacity: opac(el), boxes });
    }
    // slide counter: chrome, judged for contrast and size only
    const ctr = document.querySelector('.counter');
    if (ctr && ctr.textContent.trim()) { const cs = getComputedStyle(ctr); texts.push({ chrome: true, el: 'counter', text: ctr.textContent.trim(), size: parseFloat(cs.fontSize), weight: Number(cs.fontWeight) || 400, color: cs.color, opacity: opac(ctr), boxes: [rel(ctr.getBoundingClientRect())] }); }
    // graphic blocks: charts, tables, cards and stamps (decorative engravings and 3D stills excluded)
    const blocks = [...sec.querySelectorAll('table, .chartbox, .cert, .stamp, .mini-stamp, .col, .stn .card, .qbox, .refcols, .idx, svg:not(.art svg)')]
      .filter((e) => !e.closest('.art,[aria-hidden="true"]')).map((e) => ({ el: label(e), ...rel(e.getBoundingClientRect()) })).filter((b) => b.w > 2 && b.h > 2);
    return { tpl: [...sec.classList].find((c) => c.startsWith('tpl-')).slice(4), tone: ['paper', 'wash', 'night'].find((c) => sec.classList.contains(c)),
      text: sec.innerText, texts, blocks };
  });
  // background pass: hide content text (keep layout), screenshot again
  await page.addStyleTag({ content: 'section.slide.is-current, section.slide.is-current *, .counter { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; } section.slide.is-current svg text, section.slide.is-current svg tspan { fill: transparent !important; stroke: transparent !important; }' }).then((h) => page.evaluate(() => document.querySelectorAll('style').length));
  await page.waitForTimeout(60);
  const bg = path.join(bgDir, `s${String(n).padStart(3, '0')}.png`);
  await page.screenshot({ path: bg });
  await page.evaluate(() => document.querySelectorAll('style').forEach((s) => { if (s.textContent.startsWith('section.slide.is-current, section.slide.is-current *')) s.remove(); }));
  data.push({ n, shot: file, bg, ...m });
  if (n % 20 === 0) console.log(`  ${n}/${N}`);
}
await browser.close();
fs.writeFileSync(path.join(reports, `measure-${TAG}.json`), JSON.stringify({ N, errors, slides: data }, null, 1));
console.log(`measured ${data.length} sections, console errors/warnings: ${errors.length}`);
execFileSync('python3', [path.join(root, 'scripts/measure-analyse.py'), TAG], { stdio: 'inherit' });
