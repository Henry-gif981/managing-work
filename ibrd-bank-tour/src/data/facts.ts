/**
 * Every number shown in the tour lives here, with its source in the paper.
 * Components read facts by id (see src/primitives/Fact.tsx); never hard-code a number in content.
 * `npm run check-facts` validates this file and runs the assertions in src/data/checks.ts.
 */
export interface Fact {
  id: string;
  value: number | string;
  unit?: string;
  /** e.g. "Table 10 / Section 3.2.2 / p. 36" */
  source: string;
  note?: string;
}

export const FACTS: Fact[] = [
  // filled by the content prompts
];

const byId = new Map(FACTS.map((f) => [f.id, f]));

export function fact(id: string): Fact {
  const f = byId.get(id);
  if (!f) throw new Error(`[facts] unknown fact "${id}"`);
  return f;
}

export function factValue(id: string): number {
  const v = fact(id).value;
  if (typeof v !== 'number') throw new Error(`[facts] "${id}" is not numeric`);
  return v;
}
