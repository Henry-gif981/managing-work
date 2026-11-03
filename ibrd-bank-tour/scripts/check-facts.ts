import { FACTS } from '../src/data/facts';
import { CHECKS } from '../src/data/checks';

let failed = 0;
const ids = new Set<string>();
for (const f of FACTS) {
  if (ids.has(f.id)) {
    console.error(`✗ duplicate fact id: ${f.id}`);
    failed++;
  }
  ids.add(f.id);
  if (!f.source || !f.source.trim()) {
    console.error(`✗ fact ${f.id} has no source`);
    failed++;
  }
}
const num = (id: string) => {
  const f = FACTS.find((x) => x.id === id);
  if (!f) throw new Error(`unknown fact ${id}`);
  if (typeof f.value !== 'number') throw new Error(`fact ${id} is not numeric`);
  return f.value;
};
for (const c of CHECKS) {
  try {
    const r = c.run(num, FACTS);
    if (r === true) console.log(`✓ ${c.name}`);
    else {
      console.error(`✗ ${c.name}: ${r}`);
      failed++;
    }
  } catch (e) {
    console.error(`✗ ${c.name}: ${(e as Error).message}`);
    failed++;
  }
}
console.log(`\n${FACTS.length} facts, ${CHECKS.length} checks, ${failed} failure(s).`);
process.exit(failed ? 1 : 0);
