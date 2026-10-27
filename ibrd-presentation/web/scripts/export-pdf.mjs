#!/usr/bin/env node
// Backup PDF: one 1920×1080 page per section, every bullet shown, 3D replaced by its still.  npm run pdf
import path from 'node:path';
import fs from 'node:fs';
import { loadPlaywright } from './lib-playwright.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:5179';
const OUT = process.env.OUT || path.join(root, 'IBRD-Presentation-web.pdf');
const { chromium } = await loadPlaywright();
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(`${BASE}/?print=1`);
await p.waitForFunction(() => window.__printReady, null, { timeout: 180000 });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: OUT, width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await b.close();
console.log(`PDF written: ${path.relative(root, OUT)} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB)`);
