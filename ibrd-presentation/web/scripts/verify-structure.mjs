#!/usr/bin/env node
// Structure checks for the 20-minute deck (reports/structure-check.json + .md, screenshots/main, screenshots/appendix):
//  walk the main deck with → only (order, clicks per slide, stop at the end), ← lands fully revealed, keys
//  A / M / Home / End / 1–8, #/n hashes, Detail → links and Back to main, Overview and Contents, ?steps=all,
//  every original section reachable, the clock (?clock=1), and the text of all 119 sections against a baseline.
// Usage: node scripts/verify-structure.mjs [baseline-text.json]   (dev server on BASE, default http://127.0.0.1:5179)
import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const deck = JSON.parse(fs.readFileSync(path.join(root, 'src/data/deck.json'), 'utf8'));
const ST = deck.structure;
const baseline = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : null;
const expectedClicks = Object.fromEntries(deck.slides.filter((s) => s.stepPlan).map((s) => [s.key, s.stepPlan.clicks]));
const R = { checks: [], walk: null, text: null, errors: [] };
const check = (name, ok, info = '') => { R.checks.push({ name, ok: !!ok, info }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? ' — ' + info : ''}`); };

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => R.errors.push(String(e)));
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) R.errors.push(m.text()); });
const st = () => page.evaluate(() => ({ key: window.__deck.state.key, step: window.__deck.state.step, set: window.__deck.state.set, counter: document.querySelector('.counter').textContent }));
const open = async (q, hash = '') => { await page.goto(`${BASE}/${q}${hash}`); await page.waitForFunction(() => window.__deck); await page.evaluate(() => { localStorage.clear(); }); };

// ---- 1. walk the main deck with the keyboard only
await open('?preset=static&3d=0&steps=step', '#/1');
await page.reload(); await page.waitForFunction(() => window.__deck);
const order = []; const clicks = {}; let presses = 0; let cur = await st();
order.push(cur.key); clicks[cur.key] = 0;
for (let i = 0; i < 300; i++) {
  await page.keyboard.press('ArrowRight');
  const nx = await st();
  if (nx.key === cur.key && nx.step === cur.step) break; // end of the deck: → does nothing
  presses++;
  if (nx.key === cur.key) clicks[cur.key]++; else { order.push(nx.key); clicks[nx.key] = 0; }
  cur = nx;
}
const endState = await st();
R.walk = { order, presses, clicks };
check('main deck order = deck.config.yml (33 slides)', JSON.stringify(order) === JSON.stringify(ST.mainKeys), order.join(' '));
check('main deck ends on 119 (Thank you), → stops there', endState.key === '119' && endState.counter === `${ST.mainKeys.length} / ${ST.mainKeys.length}`, `${endState.key} · "${endState.counter}"`);
const wrong = ST.mainKeys.filter((k) => clicks[k] !== expectedClicks[k]);
check('clicks per slide match deck.config.yml', !wrong.length, wrong.map((k) => `${k}: ${clicks[k]}≠${expectedClicks[k]}`).join(', ') || `total clicks ${Object.values(clicks).reduce((a, b) => a + b, 0)}`);
check('presses to walk the main deck ≤ 100', presses <= 100, `${presses} presses (reveals + slide changes)`);
// ← from the first reveal of a slide lands on the previous slide fully revealed
await page.evaluate(() => window.__deck.go(18, 0));
await page.keyboard.press('ArrowLeft');
const back = await st();
check('← lands on the previous slide fully revealed', back.key === '14' && back.step === expectedClicks['14'], `${back.key}.${back.step}`);

// ---- 2. keys
const key = async (k) => { await page.keyboard.press(k); await page.waitForTimeout(60); return st(); };
await page.evaluate(() => window.__deck.go(59, 1));
let s = await key('End'); check('End (main) → 119', s.key === '119');
s = await key('Home'); check('Home (main) → 1', s.key === '1');
await page.evaluate(() => window.__deck.go(59, 1));
s = await key('a'); check('A → Appendix divider', s.key === 'appendix' && s.set === 'appx' && s.counter === `Appendix 1 / ${ST.appendixKeys.length}`, s.counter);
s = await key('End'); check('End (appendix) → last appendix slide', s.key === ST.appendixKeys.at(-1), s.key);
s = await key('Home'); check('Home (appendix) → divider', s.key === 'appendix');
s = await key('m'); check('M → back to the main slide that was left (59, same reveal)', s.key === '59' && s.step === 1, `${s.key}.${s.step}`);
const digits = {};
for (let d = 1; d <= 8; d++) { await page.evaluate(() => window.__deck.go(1)); digits[d] = (await key(String(d))).key; }
const wantDigits = { ...Object.fromEntries(ST.main.map((p, i) => [i + 1, p.keys[0]])), 8: 'appendix' };
check('keys 1–8 jump to the parts of the main deck / appendix', JSON.stringify(digits) === JSON.stringify(wantDigits), JSON.stringify(digits));

// ---- 3. hashes (original IDs) open the right deck and counter
const hashes = {};
for (const h of ['47', '92', '92-table', 'appendix', '5.2', '111']) {
  await page.goto(`${BASE}/?preset=static&3d=0&steps=step#/${h}`); await page.waitForFunction(() => window.__deck);
  hashes[h] = await st();
}
check('#/47 → appendix slide 47', hashes['47'].key === '47' && hashes['47'].set === 'appx' && hashes['47'].counter.startsWith('Appendix'), hashes['47'].counter);
check('#/92 → main deck 92 (chart)', hashes['92'].key === '92' && hashes['92'].counter === `${ST.mainKeys.indexOf('92') + 1} / ${ST.mainKeys.length}`, hashes['92'].counter);
check('#/92-table → appendix table copy', hashes['92-table'].key === '92-table' && hashes['92-table'].set === 'appx', hashes['92-table'].counter);
check('#/5.2 → slide 5 at reveal 2', hashes['5.2'].key === '5' && hashes['5.2'].step === 2, `${hashes['5.2'].key}.${hashes['5.2'].step}`);
check('appendix shows everything (no reveal steps)', hashes['111'].step === 0 && await page.evaluate(() => !document.querySelector('section.slide.is-current.stepping')));

// ---- 4. Detail → links and Back to main
await page.goto(`${BASE}/?preset=static&3d=0&steps=step#/5`); await page.waitForFunction(() => window.__deck);
const hiddenBefore = await page.evaluate(() => { document.body.classList.remove('show-chrome'); return getComputedStyle(document.querySelector('.detail')).opacity; });
await page.mouse.move(800, 500); await page.waitForTimeout(400);
const shownAfter = await page.evaluate(() => getComputedStyle(document.querySelector('.detail')).opacity);
check('Detail links hidden until the toolbar shows', hiddenBefore === '0' && Number(shownAfter) > 0.9, `opacity ${hiddenBefore} → ${shownAfter}`);
const allDetails = [];
for (const [from, to] of Object.entries(ST.details)) {
  await page.evaluate((k) => window.__deck.go(k), from); await page.mouse.move(800 + Math.random() * 20, 500); await page.waitForTimeout(80);
  const labels = await page.$$eval('.detail button', (b) => b.map((x) => x.dataset.detail));
  allDetails.push(`${from}→${labels.join(',')}`);
  if (JSON.stringify(labels) !== JSON.stringify(to)) check(`Detail links on ${from}`, false, labels.join(','));
}
await page.evaluate(() => window.__deck.go(89)); await page.mouse.move(820, 520); await page.waitForTimeout(100);
await page.click('.detail button[data-detail="88"]');
const inD = await st();
await page.evaluate(() => document.body.classList.remove('show-chrome'));
await page.click('.backmain');
const backD = await st();
check('Detail → opens the appendix slide; Back to main returns', inD.key === '88' && backD.key === '89', `${inD.key} → ${backD.key}`);
check('every configured Detail link is rendered', allDetails.length === Object.keys(ST.details).length, allDetails.join(' | '));

// ---- 5. Overview and Contents
await page.keyboard.press('g'); await page.waitForTimeout(200);
const ov = await page.evaluate(() => ({ main: document.querySelectorAll('.overview > .ov-grid button').length, appx: document.querySelectorAll('.overview .ov-appx button').length }));
check('Overview: main deck by part + collapsed appendix', ov.main === ST.mainKeys.length && ov.appx === ST.appendixKeys.length, JSON.stringify(ov));
await page.evaluate(() => document.querySelector('.overview .ov-appx').open = true);
await page.click('.overview .ov-appx button[data-goto="60"]');
check('Overview tile opens its slide (60)', (await st()).key === '60');
await page.evaluate(() => window.__deck.go(1)); await page.mouse.move(700, 700); await page.waitForTimeout(100);
await page.click('[data-act="toc"]');
await page.click('.toc-menu > button[data-goto="77"]');
check('Contents: part entry opens its first slide (77)', (await st()).key === '77');

// ---- 6. ?steps=all and every original section reachable
await page.goto(`${BASE}/?preset=static&3d=0&steps=all#/14`); await page.waitForFunction(() => window.__deck);
check('?steps=all shows a main slide fully at once', await page.evaluate(() => !document.querySelector('section.slide.is-current.stepping') && window.__deck.state.step === 0));
const unreachable = [];
for (const k of [...deck.slides.map((x) => x.key), 'appendix', '92-table']) {
  const r = await page.evaluate((k) => { window.__deck.go(k); return window.__deck.state.key; }, k);
  if (r !== k) unreachable.push(k);
}
check('all 119 original sections + appendix-only slides reachable', !unreachable.length, unreachable.join(', ') || `${deck.slides.length} + 2`);

// ---- 7. clock (off by default; ?clock=1 for rehearsal)
await page.goto(`${BASE}/?preset=static&3d=0#/1`); await page.waitForFunction(() => window.__deck);
await page.keyboard.press('c');
check('clock off by default (C does nothing)', await page.evaluate(() => !document.querySelector('.clock').classList.contains('on')));
await page.goto(`${BASE}/?preset=static&3d=0&clock=1#/1`); await page.waitForFunction(() => window.__deck);
await page.keyboard.press('c'); await page.waitForTimeout(1200);
await page.evaluate(() => window.__deck.go(11));
const clk = await page.evaluate(() => ({ on: document.querySelector('.clock').classList.contains('on'), t: document.querySelector('.clock .t').textContent, first: document.querySelector('.clock i').className }));
check('clock with ?clock=1: runs, first mark (slide 7, 2:00) marked early', clk.on && clk.t !== '00:00' && clk.first === 'early', JSON.stringify(clk));

// ---- 8. text of the 119 original sections (+ the table copy) and screenshots
await page.goto(`${BASE}/?preset=static&3d=0&steps=all#/1`); await page.waitForFunction(() => window.__deck && document.fonts.status === 'loaded');
await page.addStyleTag({ content: '.chrome { display: none !important; }' });
await page.mouse.move(0, 0);
const text = {};
const shotDir = { main: path.join(root, 'screenshots/main'), appx: path.join(root, 'screenshots/appendix') };
for (const d of Object.values(shotDir)) fs.mkdirSync(d, { recursive: true });
const APPX_SHOTS = ['appendix', '2', '13', '21', '41', '47', '58', '64', '84', '92-table', '98', '100', '111'];
for (const k of [...deck.slides.map((x) => x.key), '92-table', 'appendix']) {
  await page.evaluate((k) => window.__deck.go(k), k);
  const main = ST.mainKeys.includes(k);
  const shoot = main || APPX_SHOTS.includes(k);
  await page.waitForTimeout(shoot ? 1000 : 120);
  text[k] = await page.evaluate(() => document.querySelector('section.slide.is-current').innerText);
  if (main) await page.screenshot({ path: path.join(shotDir.main, `${String(ST.mainKeys.indexOf(k) + 1).padStart(2, '0')}.png`) });
  else if (APPX_SHOTS.includes(k)) await page.screenshot({ path: path.join(shotDir.appx, `${k}.png`) });
}
fs.writeFileSync(path.join(root, 'reports/text-structure.json'), JSON.stringify(text, null, 1));
if (baseline) {
  const diffs = Object.keys(baseline).filter((k) => baseline[k] !== text[k]);
  const copyOk = baseline['92'] === text['92-table'];
  R.text = { changed: diffs, tableCopyIdentical: copyOk };
  const allowed = ['1', '7', '32', '42', '92'];
  check('text: only sections 1, 7, 32, 42, 92 differ from the baseline', diffs.every((k) => allowed.includes(k)), diffs.join(', ') || 'none');
  check('text: 92-table is identical to the old 92', copyOk);
  R.text.detail = Object.fromEntries(diffs.map((k) => {
    const a = baseline[k].split('\n'), b = text[k].split('\n');
    return [k, { removed: a.filter((l) => !b.includes(l)), added: b.filter((l) => !a.includes(l)) }];
  }));
}
check('no console errors or warnings', !R.errors.length, R.errors.slice(0, 3).join(' | '));
await browser.close();
fs.writeFileSync(path.join(root, 'reports/structure-check.json'), JSON.stringify(R, null, 1));
const md = ['# Structure check', '', `Main deck walk: ${R.walk.presses} presses for ${order.length} slides.`, '', '| Check | Result | Detail |', '|---|---|---|',
  ...R.checks.map((c) => `| ${c.name} | ${c.ok ? 'PASS' : '**FAIL**'} | ${String(c.info).replace(/\|/g, '/')} |`)];
fs.writeFileSync(path.join(root, 'reports/structure-check.md'), md.join('\n') + '\n');
const failed = R.checks.filter((c) => !c.ok).length;
console.log(`\n${R.checks.length - failed}/${R.checks.length} checks passed`);
process.exit(failed ? 1 : 0);
