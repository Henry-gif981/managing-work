#!/usr/bin/env node
// Backup PDFs for the talk: exports/main-deck.pdf (the main deck, every reveal shown) and exports/appendix.pdf.
// Checks the page count of each against deck.config.yml.   npm run pdf:decks   (dev server running, or BASE=file:///…/IBRD-Presentation.html)
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const deck = JSON.parse(fs.readFileSync(path.join(root, 'src/data/deck.json'), 'utf8'));
fs.mkdirSync(path.join(root, 'exports'), { recursive: true });
let ok = true;
for (const [set, file, want] of [['main', 'main-deck.pdf', deck.structure.mainKeys.length], ['appendix', 'appendix.pdf', deck.structure.appendixKeys.length]]) {
  const out = path.join(root, 'exports', file);
  execFileSync('node', [path.join(root, 'scripts/export-pdf.mjs')], { stdio: 'inherit', env: { ...process.env, SET: set, OUT: out } });
  const pages = Number(execFileSync('pdfinfo', [out]).toString().match(/Pages:\s+(\d+)/)[1]);
  console.log(`${file}: ${pages} pages (expected ${want}) ${pages === want ? 'OK' : 'MISMATCH'}`);
  ok &&= pages === want;
}
process.exit(ok ? 0 : 1);
