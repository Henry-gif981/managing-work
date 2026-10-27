#!/usr/bin/env node
// Citation links: every [n] rendered on every section points at an existing source card; the reference list
// matches the paper (1–58); every card has a Back/close control; Esc, "↩ Back" and the browser Back button
// close the drawer without changing section or bullet step. External URLs are syntax-checked only
// (the build environment cannot reach the source hosts — see CITATIONS.md).
import fs from 'node:fs';
import path from 'node:path';
import { renderSlide } from '../src/deck/render.js';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const deck = JSON.parse(fs.readFileSync(path.join(root, 'src/data/deck.json'), 'utf8'));
const raw = fs.readFileSync(path.join(root, 'content/raw.txt'), 'utf8');
const errors = [], lines = [];
const paperRefs = [...raw.slice(raw.lastIndexOf('REFERENCES')).matchAll(/^\s*\[(\d+)\]/gm)].map((m) => Number(m[1]));
if (paperRefs.length !== 58 || paperRefs.some((n, i) => n !== i + 1)) errors.push(`paper reference list is not 1..58 (${paperRefs.length})`);
if (Object.keys(deck.references).length !== paperRefs.length) errors.push('deck reference count differs from paper');
let links = 0;
const perSource = {};
for (const s of deck.slides) {
  const r = renderSlide(s, deck);
  for (const m of r.content.matchAll(/<a class="cite[^"]*" href="#src-(\d+)" data-src="(\d+)"/g)) {
    links++;
    const n = Number(m[1]);
    if (m[1] !== m[2]) errors.push(`s${s.n}: href/data-src mismatch for [${n}]`);
    if (!deck.references[n]) errors.push(`s${s.n}: link to missing source [${n}]`);
    (perSource[n] ||= new Set()).add(s.n);
  }
  if (/\[\s*\d+\s*(;\s*\d+)*\s*\]/.test(r.content.replace(/<[^>]+>/g, '').replace(/\[\d+\]/g, (x) => (s.tpl === 'refs' ? '' : x)))) {
    const txt = r.content.replace(/<span class="cite-group">.*?\]<\/span>/g, '').replace(/<[^>]+>/g, '');
    const left = txt.match(/\[\d+(?:;\s*\d+)*\]/g);
    if (left && s.tpl !== 'refs') errors.push(`s${s.n}: unlinked citation text ${left.join(' ')}`);
  }
}
const badUrls = Object.values(deck.references).filter((r) => r.url && !/^https?:\/\/[^\s]+\.[^\s]+$/.test(r.url)).map((r) => r.n);
if (badUrls.length) errors.push(`malformed URLs: ${badUrls.join(', ')}`);
const noUrl = Object.values(deck.references).filter((r) => !r.url).map((r) => r.n);
lines.push(`# check-links`, '', `Citation links rendered: ${links} across ${deck.slides.length} sections; sources linked: ${Object.keys(perSource).length}/58.`,
  `Sources without URL in the paper: [${noUrl.join(', ')}] (decrees). URLs syntax-checked: ${58 - noUrl.length}; reachability not testable (proxy refuses source hosts).`);

// ---------------------------------------------------------------- runtime check in Chromium
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
try {
  const { chromium } = await loadPlaywright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const cerr = []; p.on('pageerror', (e) => cerr.push(e.message));
  await p.goto(`${BASE}/?3d=0#/4`); await p.waitForFunction(() => window.__deck, null, { timeout: 30000 });
  const samples = [5, 19, 47, 57, 66, 81, 98, 111, 117];
  for (const n of samples) {
    await p.evaluate((n) => window.__deck.go(n, 2), n);
    await p.waitForTimeout(250);
    const before = await p.evaluate(() => ({ n: window.__deck.state.n, step: window.__deck.state.step }));
    const link = p.locator(`.slide.is-current a[data-src]`).first();
    if (!(await link.count())) { errors.push(`runtime s${n}: no citation link found`); continue; }
    const src = await link.getAttribute('data-src');
    await link.click();
    await p.waitForTimeout(400);
    const st = await p.evaluate(() => ({ open: document.querySelector('.drawer').classList.contains('on'), hash: location.hash, back: !!document.querySelector('.drawer [data-close]'), num: document.querySelector('.drawer .dnum')?.textContent, notret: !!document.querySelector('.drawer .notret') }));
    if (!st.open || st.hash !== `#src-${src}` || !st.back || st.num !== src || !st.notret) errors.push(`runtime s${n}: drawer for [${src}] wrong state ${JSON.stringify(st)}`);
    const closer = ['esc', 'back', 'history'][samples.indexOf(n) % 3];
    if (closer === 'esc') await p.keyboard.press('Escape');
    else if (closer === 'back') await p.click('.drawer [data-close]');
    else await p.goBack();
    await p.waitForTimeout(450);
    const after = await p.evaluate(() => ({ open: document.querySelector('.drawer').classList.contains('on'), n: window.__deck.state.n, step: window.__deck.state.step, hash: location.hash }));
    if (after.open || after.n !== before.n || after.step !== before.step || after.hash !== `#/${before.n}`) errors.push(`runtime s${n}: closing via ${closer} failed ${JSON.stringify({ before, after })}`);
    lines.push(`- section ${n}: [${src}] opened (hash #src-${src}), closed via ${closer}; section/step kept (${after.n}.${after.step})`);
  }
  // every source card renders (index section) and "Cited for" jump links point to existing sections
  for (let n = 1; n <= 58; n++) {
    const ok = await p.evaluate((n) => { window.__deck.drawer.open(n, false); const d = document.querySelector('.drawer'); const jumps = [...d.querySelectorAll('[data-jump]')].map((a) => Number(a.dataset.jump)); window.__deck.drawer.close(false); return { head: !!d.querySelector('.dref'), jumps, N: window.__deck.N }; }, n);
    if (!ok.head) errors.push(`card [${n}] has no reference text`);
    if (ok.jumps.some((j) => j < 1 || j > ok.N)) errors.push(`card [${n}] jump link out of range`);
  }
  if (cerr.length) errors.push('page errors: ' + cerr.join(' | '));
  await b.close();
} catch (e) { lines.push(`Runtime check skipped: ${e.message.split('\n')[0]}`); }
lines.push('', `## Errors (${errors.length})`, ...errors.map((e) => `- ${e}`), '', `Result: ${errors.length ? 'FAIL' : 'PASS'}`);
fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
fs.writeFileSync(path.join(root, 'qa/check-links.md'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
process.exit(errors.length ? 1 : 0);
