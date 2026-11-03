// npm run audit-content — static checks over src/content/*.tsx and src/data/tables.ts:
//  * every {fact-id} / <F id="..."> refers to an existing fact
//  * every body template stays within ~90 words (warn at > 90)
//  * every [n] citation points to an existing reference
import fs from 'node:fs';
import path from 'node:path';
import { FACTS } from '../src/data/facts';
import { REFERENCES } from '../src/data/references';

const ids = new Set(FACTS.map((f) => f.id));
const refs = new Set(REFERENCES.map((r) => r.n));
let errors = 0,
  warns = 0;
const used = new Set<string>();
const files = ['src/data/tables.ts', ...fs.readdirSync('src/content').filter((f) => f.endsWith('.tsx') && f !== 'kit.tsx').map((f) => path.join('src/content', f))];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/\{([a-z][a-z0-9.-]*)(\|(?:n|\d))?\}/g)) {
    // skip JSX expressions like {r.inst} and object literals
    if (m[1].includes('.')) continue;
    const before = src.slice(Math.max(0, m.index! - 1), m.index!);
    if (before === '$') continue;
    if (!ids.has(m[1])) {
      // JSX identifiers such as {table} are not facts: only flag kebab-case ids
      if (m[1].includes('-')) {
        console.error(`✗ ${file}: unknown fact {${m[1]}}`);
        errors++;
      }
      continue;
    }
    used.add(m[1]);
  }
  for (const m of src.matchAll(/<F id="([^"]+)"/g)) {
    if (!ids.has(m[1])) {
      console.error(`✗ ${file}: unknown fact <F id="${m[1]}">`);
      errors++;
    } else used.add(m[1]);
  }
  for (const m of src.matchAll(/(?<![\w\])])\[(\d[^\]\n]*)\]/g)) {
    if (!/^\d+(,\s*p\.\s*[\w-]+)?(;\s*\d+(,\s*p\.\s*[\w-]+)?)*$/.test(m[1])) continue;
    for (const part of m[1].split(';')) {
      const n = parseInt(part, 10);
      if (!refs.has(n)) {
        console.error(`✗ ${file}: citation [${n}] not in references`);
        errors++;
      }
    }
  }
  for (const m of src.matchAll(/body:\s*`([\s\S]*?)`/g)) {
    const words = m[1]
      .replace(/\[\d[^\]]*\]/g, '')
      .replace(/[*{}|]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[A-Za-z0-9]/.test(w)).length;
    if (words > 90) {
      console.warn(`! ${file}: body with ${words} words (> 90): "${m[1].slice(0, 50).replace(/\n/g, ' ')}…"`);
      warns++;
    }
  }
}
const unused = FACTS.filter((f) => !used.has(f.id)).map((f) => f.id);
console.log(`\n${files.length} files · ${used.size}/${FACTS.length} facts used · ${errors} error(s) · ${warns} warning(s)`);
if (unused.length) console.log('facts not referenced by content (yet):', unused.join(', '));
process.exit(errors ? 1 : 0);
