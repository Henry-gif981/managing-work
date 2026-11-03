// npm run docs:scenes -> docs/scene-list.md
import fs from 'node:fs';
import { SCENES, SEGMENTS } from '../src/scenes';

function beats(id: string): string {
  const src = fs.readFileSync(`src/content/${id}.tsx`, 'utf8');
  const m = src.match(/makePlaceholder\('[^']+',\s*(\d+)/);
  if (m) return m[1];
  const block = src.match(/export const beats[^=]*=\s*\[([\s\S]*?)\];\s*\n/);
  if (!block) return src.includes('beats: Beat[] = []') ? '0' : '?';
  const body = block[1];
  // one top-level object per beat: indented "  {" lines, or inline "{ label" for one-liners
  const n = body.includes('\n') ? (body.match(/^ {2}\{/gm) || []).length : (body.match(/\{\s*label/g) || []).length;
  return String(n);
}
const seg = Object.fromEntries(SEGMENTS.map((s) => [s.id, s.label]));
let md = `# Scene list\n\nGenerated from \`src/scenes.ts\` by \`npm run docs:scenes\`. Beats are computed from \`src/content/<id>.tsx\`.\n\n`;
md += `| # | id | kind | floor | segment | section | optional | target s | beats |\n|---|---|---|---|---|---|---|---|---|\n`;
let total = 0,
  core = 0;
SCENES.forEach((s, i) => {
  total += s.targetSeconds;
  if (!s.optional) core += s.targetSeconds;
  md += `| ${i + 1} | \`${s.id}\` | ${s.kind} | ${s.floor === 0 ? 'G' : s.floor} | ${seg[s.segment]} | ${s.sectionRef} | ${s.optional ? 'yes' : ''} | ${s.targetSeconds} | ${beats(s.id)} |\n`;
});
md += `\nFull tour ≈ ${Math.round(total / 60)} min (${total} s) · core path ≈ ${Math.round(core / 60)} min (${core} s).\n`;
fs.writeFileSync('docs/scene-list.md', md);
console.log(`docs/scene-list.md: ${SCENES.length} scenes`);
