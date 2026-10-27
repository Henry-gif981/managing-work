#!/usr/bin/env node
// Visual + layout QA. Every section at 1920×1080, 1440×900 and 390×844 (letterboxed stage), all bullets shown,
// 3D in the static preset (pre-rendered stills — same slots as the live canvas). Checks:
//  console errors · text leaving the stage · clipped text boxes · text overlapping engravings or the 3D slot ·
//  citation hit areas. Screenshots: qa/1920/sNNN.jpg (all), qa/1440 and qa/390 (samples).
import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const { chromium } = await loadPlaywright();
const deck = JSON.parse(fs.readFileSync(path.join(root, 'src/data/deck.json'), 'utf8'));
import { SLOTS, slotOf } from '../src/deck/render.js';
const issues = []; const consoleErr = [];
const browser = await chromium.launch();
const VIEWS = [{ w: 1920, h: 1080, all: true }, { w: 1440, h: 900, all: false }, { w: 390, h: 844, all: false }];
const SAMPLE = [1, 2, 4, 5, 13, 17, 19, 26, 28, 59, 66, 81, 98, 104, 111, 117, 119];
for (const v of VIEWS) {
  const dir = path.join(root, 'qa', String(v.w)); fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: v.w, height: v.h } });
  page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(`${v.w}: ${m.text()}`); });
  page.on('pageerror', (e) => consoleErr.push(`${v.w}: pageerror ${e.message}`));
  await page.goto(`${BASE}/?steps=all&preset=static#/1`);
  await page.waitForFunction(() => window.__deck && document.body.classList.contains('ready'), null, { timeout: 60000 });
  const list = v.all ? deck.slides.map((s) => s.n) : SAMPLE;
  for (const n of list) {
    await page.evaluate((n) => { window.__deck.go(n, 99); document.body.classList.remove('show-chrome'); }, n);
    await page.waitForTimeout(v.all ? 380 : 450);
    if (v.w === 1920) {
      const s = deck.slides[n - 1];
      const slot = slotOf(s) ? SLOTS[slotOf(s)] : null;
      const res = await page.evaluate((slot) => {
        const out = [];
        const cur = document.querySelector('#l-content .slide.is-current');
        const R = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; };
        // union of the rendered text lines (not the block box)
        const TR = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter((q) => q.width > 1);
          if (!rs.length) return R(el); const x = Math.min(...rs.map((q) => q.left)), y = Math.min(...rs.map((q) => q.top)), r = Math.max(...rs.map((q) => q.right)), b = Math.max(...rs.map((q) => q.bottom)); return { x, y, r, b, w: r - x, h: b - y }; };
        const texts = [...cur.querySelectorAll('h1, p, li, .cert, .stamp, .tframe, .rail .stn, .line .stn, .chartbox, .mini-stamp, .foot, blockquote, .ref, .idx a, .cgroup, .ctitle, .univ, .course, .runner, .by, .qline, .credits p, .tk-sub, .tk-sub2')].filter((e) => e.offsetParent !== null);
        for (const e of texts) {
          const r = R(e);
          if (r.x < -1 || r.y < -1 || r.r > 1921 || r.b > 1081) out.push(`leaves stage: <${e.tagName.toLowerCase()} class="${e.className}"> ${JSON.stringify([r.x | 0, r.y | 0, r.r | 0, r.b | 0])} “${e.textContent.trim().slice(0, 40)}”`);
          if (e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflow !== 'visible') out.push(`clipped text: ${e.className} “${e.textContent.trim().slice(0, 40)}”`);
        }
        const leaf = texts.filter((e) => !e.querySelector('li, p, .stn') && !e.matches('.ref'));
        const arts = [...cur.querySelectorAll('.art')].map(R);
        for (const e of leaf) {
          const r = TR(e);
          for (const a of arts) { const ix = Math.min(r.r, a.r) - Math.max(r.x, a.x), iy = Math.min(r.b, a.b) - Math.max(r.y, a.y); if (ix > 6 && iy > 6) out.push(`text over engraving: “${e.textContent.trim().slice(0, 40)}” (${ix | 0}×${iy | 0}px)`); }
          if (slot) { const sx = slot.cx - slot.w / 2, sy = slot.cy - slot.h / 2, sr = slot.cx + slot.w / 2, sb = slot.cy + slot.h / 2;
            const ix = Math.min(r.r, sr) - Math.max(r.x, sx), iy = Math.min(r.b, sb) - Math.max(r.y, sy);
            if (ix > 8 && iy > 8 && !e.closest('.carousel-names') && !e.matches('.runner')) out.push(`text inside 3D slot: “${e.textContent.trim().slice(0, 40)}” (${ix | 0}×${iy | 0}px)`); }
        }
        // overlapping sibling text blocks (bullets vs stamps, etc.)
        for (let i = 0; i < leaf.length; i++) for (let j = i + 1; j < leaf.length; j++) {
          const a = TR(leaf[i]), b = TR(leaf[j]); if (leaf[i].contains(leaf[j]) || leaf[j].contains(leaf[i])) continue;
          const ix = Math.min(a.r, b.r) - Math.max(a.x, b.x), iy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
          if (ix > 10 && iy > 10) out.push(`text blocks overlap: “${leaf[i].textContent.trim().slice(0, 30)}” × “${leaf[j].textContent.trim().slice(0, 30)}”`);
        }
        for (const a of cur.querySelectorAll('a.cite')) { const r = R(a); if (r.h < 30 || r.w < 20) out.push(`small citation hit area ${r.w | 0}×${r.h | 0} for [${a.textContent}]`); }
        return out;
      }, slot);
      res.forEach((r) => issues.push(`s${n}: ${r}`));
    }
    await page.screenshot({ path: path.join(dir, `s${String(n).padStart(3, '0')}.jpg`), type: 'jpeg', quality: 70 });
  }
  await page.close();
}
await browser.close();
const lines = ['# qa (layout)', '', `Viewports: 1920×1080 (all ${deck.slides.length} sections), 1440×900 and 390×844 (${SAMPLE.length} samples). 3D preset: static stills.`, '',
  `## Console errors (${consoleErr.length})`, ...consoleErr.map((e) => `- ${e}`), '', `## Layout issues (${issues.length})`, ...issues.map((e) => `- ${e}`), '', `Result: ${issues.length + consoleErr.length ? 'FAIL' : 'PASS'}`];
fs.writeFileSync(path.join(root, 'qa/qa-layout.md'), lines.join('\n') + '\n');
console.log(lines.slice(0, 3).join('\n')); console.log(consoleErr.slice(0, 10).join('\n')); console.log(issues.slice(0, 60).join('\n')); console.log(lines[lines.length - 1]);
process.exit(issues.length + consoleErr.length ? 1 : 0);
