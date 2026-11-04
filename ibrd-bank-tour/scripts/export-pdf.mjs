// npm run export-pdf  ->  dist/ibrd-bank-tour.pdf  (one 1920x1080 page per beat, backgrounds on)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

const url = ensureSingleBuild(true);
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url + '?print=1');
await page.waitForFunction(() => window.__printReady > 0, null, { timeout: 60000 });
const pages = await page.evaluate(() => window.__printReady);
const beats = await page.evaluate(() => window.__printBeats);
await page.emulateMedia({ media: 'print' });
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const out = path.join(ROOT, 'dist', 'ibrd-bank-tour.pdf');
await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true, width: '1920px', height: '1080px' });
await browser.close();
const pdf = fs.readFileSync(out, 'latin1');
const count = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`wrote ${path.relative(ROOT, out)}: ${count} PDF pages = 1 contents + ${beats} beats + ${pages - beats - 1} reference pages`);
if (errors.length) console.error('console errors:\n' + errors.join('\n'));
if (count !== pages || errors.length) process.exit(1);
