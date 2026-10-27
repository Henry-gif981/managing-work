#!/usr/bin/env node
// One self-contained HTML file (opens by double-click, no server, no network): JS, CSS, fonts, textures and
// the 3D stills are all inlined.   npm run standalone  →  IBRD-Presentation.html
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist-standalone');
execSync('node scripts/build-content.mjs', { cwd: root, stdio: 'inherit' });
execSync(`npx vite build --outDir "${out}" --emptyOutDir`, { cwd: root, stdio: 'inherit', env: { ...process.env, STANDALONE: '1' } });
let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const MIME = { woff2: 'font/woff2', webp: 'image/webp', png: 'image/png' };
const dataURI = (rel) => { const f = path.join(root, 'public', rel); return `data:${MIME[rel.split('.').pop()]};base64,${fs.readFileSync(f).toString('base64')}`; };
let n = 0;
html = html.replace(/url\((['"]?)(?:\.{1,2}\/|\/)*(assets\/[^)'"]+)\1\)/g, (_, q, rel) => { n++; return `url(${dataURI(rel)})`; });
html = html.replace(/<link rel="preload"[^>]*>\s*/g, '');
const stills = Object.fromEntries(fs.readdirSync(path.join(root, 'public/fallbacks')).filter((f) => f.endsWith('.webp')).map((f) => [`fallbacks/${f}`, dataURI(`fallbacks/${f}`)]));
html = html.replace('<script type="module"', `<script>window.__IBRD_INLINE=${JSON.stringify(stills)};</script>\n<script type="module"`);
const left = html.match(/(?:src|href)="\.?\/?assets\/[^"]+"/g);
if (left) throw new Error('external references left: ' + left.join(', '));
const file = path.join(root, 'IBRD-Presentation.html');
fs.writeFileSync(file, html);
console.log(`standalone: ${path.relative(root, file)} — ${(fs.statSync(file).size / 1048576).toFixed(1)} MB, ${n} url() assets + ${Object.keys(stills).length} 3D stills inlined`);
