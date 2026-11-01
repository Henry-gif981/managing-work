// Display checks for the design pass (reports/display-check.json):
//  1. the stage keeps 16:9, is centred and letterboxed symmetrically in one colour at 1920x1080, 1366x768, 1280x720
//  2. full 3D: after the cover, jumping to sections 14 and 56 leaves no 3D object on screen
//  3. ?lite=1 loads no WebGL engine; prefers-reduced-motion is honoured (no draw animation running)
import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const { chromium } = await loadPlaywright();
const out = { viewports: [], leak: null, lite: null, reducedMotion: null, errors: [] };
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

for (const [w, h] of [[1920, 1080], [1366, 768], [1280, 720]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => out.errors.push(String(e)));
  await p.goto(`${BASE}/?steps=all&preset=static&3d=0#/14`);
  await p.waitForFunction(() => window.__deck);
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const s = document.getElementById('stage').getBoundingClientRect();
    return { left: s.left, top: s.top, right: innerWidth - s.right, bottom: innerHeight - s.bottom, ratio: s.width / s.height, bg: getComputedStyle(document.body).backgroundColor, vbg: getComputedStyle(document.getElementById('viewport')).backgroundColor };
  });
  const round = (v) => Math.round(v * 100) / 100;
  out.viewports.push({ viewport: `${w}x${h}`, ratio: round(r.ratio), margins: [round(r.left), round(r.top), round(r.right), round(r.bottom)].join(' / '),
    symmetric: Math.abs(r.left - r.right) < 1 && Math.abs(r.top - r.bottom) < 1, ratioOk: Math.abs(r.ratio - 16 / 9) < 0.01, letterbox: r.vbg !== 'rgba(0, 0, 0, 0)' ? r.vbg : r.bg });
  await p.close();
}

{
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => out.errors.push(String(e)));
  await p.goto(`${BASE}/?capture=1&preset=full#/1`); // capture: still frames so "running" settles under SwiftShader
  await p.waitForFunction(() => window.__deck && window.__deck.three, null, { timeout: 120000 });
  await p.waitForFunction(() => !window.__deck.three.stats().running, null, { timeout: 60000 });
  const res = {};
  for (const n of [14, 56]) {
    await p.evaluate((k) => window.__deck.go(k), n);
    await p.waitForTimeout(400);
    const mid = await p.evaluate(() => window.__deck.three.stats());
    await p.waitForFunction(() => !window.__deck.three.stats().running, null, { timeout: 60000 });
    const end = await p.evaluate(() => window.__deck.three.stats());
    res[n] = { during: { current: mid.current, drawCalls: mid.drawCalls }, after: { current: end.current, drawCalls: end.drawCalls } };
    await p.screenshot({ path: path.join(root, `reports/leak-check-${n}.png`) });
  }
  out.leak = { ...res, reproduced: Object.values(res).some((r) => r.after.current || r.after.drawCalls > 0) };
  await p.close();
}

{
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`${BASE}/?lite=1#/1`);
  await p.waitForFunction(() => window.__deck);
  await p.waitForTimeout(1500);
  out.lite = await p.evaluate(() => ({ engine: !!window.__deck.three, bodyLite: document.body.classList.contains('lite'), preset: window.__deck.state.preset }));
  await p.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/?preset=static#/4`);
  await p.waitForFunction(() => window.__deck);
  await p.waitForTimeout(800);
  out.reducedMotion = await p.evaluate(() => ({ drawAnimation: [...document.querySelectorAll('.is-current .draw .stroke')].slice(0, 1).map((e) => getComputedStyle(e).animationName)[0] || 'none',
    slideTransition: getComputedStyle(document.querySelector('section.slide.is-current')).transitionDuration }));
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(root, 'reports/display-check.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
