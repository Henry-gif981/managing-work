// One-off generator for placeholder content modules. Never overwrites an existing file.
import fs from 'node:fs';
import path from 'node:path';
const src = fs.readFileSync('src/scenes.ts', 'utf8');
const ids = [...src.matchAll(/^\s*\['([a-z0-9-]+)', '(exterior|door|room|lift|exit)'/gm)].map((m) => m[1]);
const special = new Set(['ext-facade', 'ext-door', 'lift-1-2', 'lift-2-3', 'lift-down', 'ex-thanks', 'f3-tep-outputs']);
let n = 0;
for (const id of ids) {
  const file = path.join('src/content', `${id}.tsx`);
  if (fs.existsSync(file) || special.has(id)) continue;
  fs.writeFileSync(
    file,
    `import { makePlaceholder } from './_placeholder';\n\n// TODO(content): replace with the real content of ${id}.\nconst p = makePlaceholder('${id}', 3);\nexport const beats = p.beats;\nexport default p.View;\n`,
  );
  n++;
}
console.log(`generated ${n} placeholder modules for ${ids.length} scenes`);
