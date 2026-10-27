#!/usr/bin/env node
// Performance + robustness measurements with Playwright/CDP against the production build (vite preview):
//  bundle sizes (gzip), first-load transfer, frame times on 3D sections (normal and CPU throttled 4×),
//  memory/geometry counts across three full passes of the deck, reduced motion, no-WebGL, presets.
// Writes PERF.md. The cloud container has no GPU: WebGL runs on SwiftShader (CPU), so absolute FPS here is a
// floor, not what a consumer GPU delivers; budgets (triangles, draw calls, textures, bytes) are exact.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { loadPlaywright } from './lib-playwright.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:4179';
const PASSES = Number(process.env.PASSES || 3);
const { chromium } = await loadPlaywright();
const R = { date: new Date().toISOString().slice(0, 16).replace('T', ' ') };

// ---------------------------------------------------------------- bundle
const dist = path.join(root, 'dist/assets');
const files = fs.readdirSync(dist).filter((f) => /\.(js|css)$/.test(f));
R.bundle = files.map((f) => { const b = fs.readFileSync(path.join(dist, f)); return { f, kb: +(b.length / 1024).toFixed(1), gz: +(zlib.gzipSync(b, { level: 9 }).length / 1024).toFixed(1) }; }).sort((a, b) => b.gz - a.gz);
const threeJs = R.bundle.filter((b) => /three|engine|objects|materials/.test(b.f));
R.threeGz = +threeJs.reduce((a, b) => a + b.gz, 0).toFixed(1);

const GPU_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
async function frameStats(page, ms) {
  return page.evaluate((ms) => new Promise((res) => { const t = []; let last = performance.now(); const end = last + ms;
    const f = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(f); else { t.sort((a, b) => a - b); const avg = t.reduce((a, b) => a + b, 0) / t.length; res({ frames: t.length, avgMs: +avg.toFixed(1), p95Ms: +t[Math.floor(t.length * 0.95)].toFixed(1), fps: +(1000 / avg).toFixed(1) }); } };
    requestAnimationFrame(f); }), ms);
}
const b = await chromium.launch({ args: GPU_ARGS });

// ---------------------------------------------------------------- first load (reading mode has no WebGL)
for (const [label, url] of [['stage', '/#/1'], ['reading mode', '/#read']]) {
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  const p = await ctx.newPage();
  let bytes = 0; const types = {};
  p.on('response', async (r) => { try { const len = Number(r.headers()['content-length'] || (await r.body()).length); bytes += len; const u = r.url().split('?')[0]; const t = /\.[a-z0-9]{2,5}$/.test(u) ? u.split('.').pop() : 'html'; types[t] = (types[t] || 0) + len; } catch { /* ignore */ } });
  const t0 = Date.now();
  await p.goto(BASE + url, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => document.body.classList.contains('ready'), null, { timeout: 60000 });
  const timing = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const fcp = performance.getEntriesByName('first-contentful-paint')[0]; return { dcl: Math.round(n.domContentLoadedEventEnd), fcp: fcp ? Math.round(fcp.startTime) : null }; });
  R[label] = { kb: +(bytes / 1024).toFixed(0), byType: Object.fromEntries(Object.entries(types).map(([k, v]) => [k, +(v / 1024).toFixed(0)])), readyMs: Date.now() - t0, ...timing };
  await ctx.close();
}

// ---------------------------------------------------------------- frame times on 3D sections
const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
await page.goto(`${BASE}/?steps=all&preset=full#/1`);
await page.waitForFunction(() => window.__deck && window.__deck.three, null, { timeout: 180000 });
const deck = await page.evaluate(() => window.__deckData.slides.map((s) => ({ n: s.n, obj: s.obj, kind: s.hero3d })));
const threeSlides = deck.filter((s) => s.obj);
R.fps = [];
for (const s of [1, 16, 19, 28, 53, 70, 80, 103, 119]) {
  await page.evaluate((n) => window.__deck.go(n, 0), s);
  await page.waitForTimeout(1500);
  const f = await frameStats(page, 3000);
  const st = await page.evaluate(() => window.__deck.three.stats());
  R.fps.push({ n: s, kind: st.current, tris: st.triangles, calls: st.drawCalls, ...f });
}
// baseline: the same 1920×1080 page with 3D switched off (cost of the software compositor alone)
await page.evaluate(() => { window.__deck.setThree(false); window.__deck.go(70, 0); }); await page.waitForTimeout(1200);
R.baseline2D = await frameStats(page, 3000);
await page.evaluate(() => window.__deck.setThree(true)); await page.waitForTimeout(800);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.evaluate(() => window.__deck.go(53, 0)); await page.waitForTimeout(1500);
R.throttled = await frameStats(page, 4000);
R.throttledPreset = await page.evaluate(() => window.__deck.state.preset);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

// ---------------------------------------------------------------- memory across passes
await page.evaluate(() => window.__deck.setPreset('light'));
R.memory = [];
const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
for (let pass = 1; pass <= PASSES; pass++) {
  for (const s of deck) { await page.evaluate((n) => window.__deck.go(n, 0), s.n); await page.waitForTimeout(s.obj ? 260 : 25); }
  await page.evaluate(() => window.__deck.go(1, 0)); await page.waitForTimeout(800);
  await cdp.send('HeapProfiler.collectGarbage');
  const m = await metrics(); const st = await page.evaluate(() => window.__deck.three.stats());
  R.memory.push({ pass, heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1), nodes: m.Nodes, glGeometries: st.geometries, glTextures: st.textures, rigs: st.rigs.length });
}
// render on demand: loop must sleep on a 2D section
await page.evaluate(() => window.__deck.go(4, 0)); await page.waitForTimeout(1200);
R.sleepsOn2D = !(await page.evaluate(() => window.__deck.three.stats().running));
await page.close();

// ---------------------------------------------------------------- reduced motion, no WebGL, static preset
const rm = await b.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
await rm.goto(`${BASE}/?steps=all#/1`); await rm.waitForFunction(() => window.__deck && window.__deck.three, null, { timeout: 180000 });
await rm.waitForTimeout(2500);
R.reducedMotionLoopStops = !(await rm.evaluate(() => window.__deck.three.stats().running));
await rm.close();
const nb = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
const ng = await nb.newPage({ viewport: { width: 1920, height: 1080 } });
await ng.goto(`${BASE}/?steps=all#/16`); await ng.waitForFunction(() => window.__deck, null, { timeout: 60000 }); await ng.waitForTimeout(1000);
R.noWebGL = await ng.evaluate(() => { const img = document.querySelector('#l-fallback .fb-wrap.is-current img'); return { threeLoaded: !!window.__deck.three, fallbackShown: !!img && img.complete && img.naturalWidth > 0 && getComputedStyle(document.getElementById('l-fallback')).display !== 'none' }; });
await ng.screenshot({ path: path.join(root, 'qa/no-webgl-s16.jpg'), type: 'jpeg', quality: 70 });
await nb.close();
await b.close();
R.errors = errs;

// ---------------------------------------------------------------- report
const L = [];
L.push('# PERF.md — measured performance', '', `Measured ${R.date} UTC by \`npm run perf\` (Playwright + CDP, production build served by \`vite preview\`).`, '',
  '> **Environment caveat.** This cloud container has no GPU. Chromium renders WebGL with **SwiftShader on the CPU**, so the',
  '> frame times below are a pessimistic floor; a consumer GPU is typically one to two orders of magnitude faster for this',
  '> scene size. The budgets (bytes, triangles, draw calls, textures, memory) do not depend on the GPU and are exact.', '');
L.push('## Bundle (gzip -9)', '', '| File | Raw KB | Gzip KB |', '|---|---|---|', ...R.bundle.map((x) => `| ${x.f} | ${x.kb} | ${x.gz} |`), '',
  `3D code (Three.js + engine, loaded lazily with \`import()\`): **${R.threeGz} KB gzip** (budget ≤ 600 KB).`, '');
L.push('## First load', '', '| View | Transferred | By type (KB) | DOMContentLoaded | First contentful paint | Ready (fonts loaded, shown) |', '|---|---|---|---|---|---|',
  ...['stage', 'reading mode'].map((k) => `| ${k} | ${R[k].kb} KB | ${Object.entries(R[k].byType).map(([a, v]) => `${a} ${v}`).join(', ')} | ${R[k].dcl} ms | ${R[k].fcp} ms | ${R[k].readyMs} ms |`), '');
L.push('## Frame times on 3D sections (preset Full, 1920×1080, SwiftShader)', '', '| Section | Object | Triangles | Draw calls | Avg frame | p95 | FPS |', '|---|---|---|---|---|---|---|',
  ...R.fps.map((f) => `| ${f.n} | ${f.kind} | ${f.tris} | ${f.calls} | ${f.avgMs} ms | ${f.p95Ms} ms | ${f.fps} |`), '',
  `Baseline with 3D switched off (section 70, same page, nothing animating in WebGL): avg ${R.baseline2D.avgMs} ms, ${R.baseline2D.fps} FPS — this is the cost of software compositing in this container, not of the 3D scene.`, '',
  `CPU throttled 4× (section 53, pylon): avg ${R.throttled.avgMs} ms, p95 ${R.throttled.p95Ms} ms, ${R.throttled.fps} FPS. Preset after the run: **${R.throttledPreset}**` +
  (R.throttledPreset === 'light' ? ' (auto-downgrade fired: frame time > 24 ms for ~3 s; the "Chế độ nhẹ" chip appeared).' : '.'), '');
L.push(`## Memory across ${PASSES} full passes (preset Light, every section visited)`, '', '| Pass | JS heap | DOM nodes | GL geometries | GL textures | Live rigs |', '|---|---|---|---|---|---|',
  ...R.memory.map((m) => `| ${m.pass} | ${m.heapMB} MB | ${m.nodes} | ${m.glGeometries} | ${m.glTextures} | ${m.rigs} |`), '');
L.push('## Behaviour checks', '', `- Render loop sleeps on a 2D section: **${R.sleepsOn2D ? 'yes' : 'NO'}**`, `- prefers-reduced-motion: loop stops after the entrance (no idle rotation, dust, breathing): **${R.reducedMotionLoopStops ? 'yes' : 'NO'}**`,
  `- No WebGL (\`--disable-webgl\`): Three.js loaded: ${R.noWebGL.threeLoaded ? 'yes (unexpected)' : 'no'}; static still shown: **${R.noWebGL.fallbackShown ? 'yes' : 'NO'}** (qa/no-webgl-s16.jpg)`,
  `- Page errors during the run: ${R.errors.length ? R.errors.join('; ') : 'none'}`, '');
fs.writeFileSync(path.join(root, 'PERF.md'), L.join('\n') + '\n');
fs.writeFileSync(path.join(root, 'qa/perf.json'), JSON.stringify(R, null, 1));
console.log(L.join('\n'));
