#!/usr/bin/env node
// Font audit on the real rendered deck (Chromium, 1920×1080, every section, all bullets shown):
//  - every family/size/weight actually used (computed style of each text node's element)
//  - text below the stage minimums (titles ≥ 56, bullets ≥ 30 / 26, table cells ≥ 22, captions ≥ 18, citations ≥ 20)
//  - characters missing from the font that is supposed to render them (fontTools cmaps, qa/font-cmaps.json)
//  - fallback faces in use, and layout shift while the fonts load
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
execFileSync('python3', [path.join(root, 'scripts/font-cmaps.py')], { stdio: 'ignore' });
const cmaps = Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(path.join(root, 'qa/font-cmaps.json'), 'utf8'))).map(([k, v]) => [k, new Set(v)]));
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.addInitScript(() => {
  window.__cls = 0;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto(`${BASE}/?3d=0&steps=all#/1`);
await page.waitForFunction(() => window.__deck && document.body.classList.contains('ready'), null, { timeout: 60000 });
await page.waitForTimeout(800);
const cls = await page.evaluate(() => window.__cls);
const N = await page.evaluate(() => window.__deck.N);
const used = new Map(); const small = []; const missing = new Map(); const fallbacks = new Set();
const MIN = (cls, el) => cls; // placeholder for readability below
for (let n = 1; n <= N; n++) {
  await page.evaluate((n) => window.__deck.go(n, 99), n);
  await page.waitForTimeout(60);
  const items = await page.evaluate(() => {
    const out = [];
    const root = document.querySelector('#l-content .slide.is-current');
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const t = w.currentNode; const txt = t.textContent.replace(/\s+/g, ' ').trim(); if (!txt) continue;
      const el = t.parentElement; if (el.closest('svg')) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const role = el.closest('h1.title') ? 'title' : el.closest('.cite-group, a.cite') ? 'cite' : el.closest('ul.bullets ul') ? 'bullet2' : el.closest('ul.bullets') ? 'bullet' :
        el.closest('.tbl td, .tbl th') ? 'table' : el.closest('.src, .tnote, .cap, .runner, .ref, .by, .credits, .idx, .idx-note') ? 'caption' : 'other';
      out.push({ txt, fam: cs.fontFamily, size: parseFloat(cs.fontSize), weight: cs.fontWeight, style: cs.fontStyle, role, tag: el.tagName.toLowerCase() + '.' + [...el.classList].join('.') });
    }
    return out;
  });
  for (const it of items) {
    const fams = it.fam.split(',').map((f) => f.trim().replace(/^['"]|['"]$/g, ''));
    const primary = fams.find((f) => f !== 'IBRD Sym' && cmaps[f]) || fams[0];
    const key = `${primary} ${it.weight}${it.style === 'italic' ? ' italic' : ''} · ${it.size}px`;
    used.set(key, (used.get(key) || 0) + 1);
    if (!cmaps[primary]) fallbacks.add(`${it.fam} (s${n} ${it.tag})`);
    const min = { title: 56, bullet: 30, bullet2: 26, table: 22, cite: 18, caption: 18, other: 18 }[it.role];
    if (it.size < min - 0.01) small.push(`s${n} ${it.role} ${it.size}px < ${min}: “${it.txt.slice(0, 50)}” (${it.tag})`);
    for (const ch of it.txt) {
      const cp = ch.codePointAt(0); if (cp < 33) continue;
      const ok = cmaps[primary]?.has(cp) || (fams.includes('IBRD Sym') && cmaps['IBRD Sym'].has(cp));
      if (!ok) missing.set(`${ch} U+${cp.toString(16).toUpperCase()} in ${primary}`, `s${n}`);
    }
  }
}
await browser.close();
const lines = ['# audit-fonts', '', `Sections audited: ${N} at 1920×1080 (all bullets shown). Layout shift while loading fonts (CLS): ${cls.toFixed(4)}.`, '', '## Faces and sizes in use (text nodes)', '', '| Face · size | Text nodes |', '|---|---|',
  ...[...used.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`),
  '', `## Below the size minimums (${small.length})`, ...small.slice(0, 80).map((s) => `- ${s}`),
  '', `## Characters missing from their font (${missing.size})`, ...[...missing].map(([k, v]) => `- ${k} (first on ${v})`),
  '', `## Fallback / unexpected families (${fallbacks.size})`, ...[...fallbacks].slice(0, 30).map((f) => `- ${f}`)];
const fail = small.length + missing.size + fallbacks.size > 0 || cls > 0.01;
lines.push('', `Result: ${fail ? 'FAIL' : 'PASS'}`);
fs.writeFileSync(path.join(root, 'qa/audit-fonts.md'), lines.join('\n') + '\n');
console.log(lines.slice(0, 3).join('\n'));
console.log(`faces/sizes: ${used.size}; below minimum: ${small.length}; missing glyphs: ${missing.size}; fallbacks: ${fallbacks.size}`);
console.log(small.slice(0, 25).join('\n')); console.log([...missing.keys()].slice(0, 20).join('\n')); console.log([...fallbacks].slice(0, 10).join('\n'));
console.log(lines[lines.length - 1]);
process.exit(fail ? 1 : 0);
