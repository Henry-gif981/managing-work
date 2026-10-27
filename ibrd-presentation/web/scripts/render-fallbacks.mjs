#!/usr/bin/env node
// Render a transparent still of every hero object in every slot it uses, with the same scene, camera and
// lights as the live deck, into public/fallbacks/<object>-<slot>.webp. Used for the "Ảnh tĩnh" preset,
// for browsers without WebGL and for print/PDF.   Usage: npm run fallbacks  (needs the dev server or BASE=url)
import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright } from './lib-playwright.mjs';
const { chromium } = await loadPlaywright();

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const deck = JSON.parse(fs.readFileSync(path.join(root, 'src/data/deck.json'), 'utf8'));
import { SLOTS, slotOf } from "../src/deck/render.js";
const jobs = new Map();
for (const s of deck.slides) if (slotOf(s)) { const k = `${s.hero3d}-${slotOf(s)}`; if (!jobs.has(k)) jobs.set(k, s.n); }
const out = path.join(root, 'public/fallbacks');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto(`${BASE}/?capture=1&steps=all&preset=full#/1`);
await page.waitForFunction(() => window.__deck && window.__deck.three, null, { timeout: 120000 });
for (const [key, n] of jobs) {
  const [kind, slot] = key.split('-');
  await page.evaluate((n) => window.__deck.go(n, 0), n);
  await page.waitForFunction(() => { const st = window.__deck.three.stats(); return !st.running && st.current; }, null, { timeout: 60000 });
  await page.waitForTimeout(2500);
  const S = SLOTS[slot];
  const data = await page.evaluate(({ S }) => {
    const gl = document.getElementById('gl');
    const k = gl.width / 1920;
    const w = S.w, h = S.h;
    const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    c.getContext('2d').drawImage(gl, (S.cx - w / 2) * k, (S.cy - h / 2) * k, w * k, h * k, 0, 0, c.width, c.height);
    return c.toDataURL('image/webp', 0.86);
  }, { S });
  const file = path.join(out, `${key}.webp`);
  fs.writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  console.log(`${key}.webp  ${(fs.statSync(file).size / 1024).toFixed(0)} KB  (section ${n})`);
}
await browser.close();
