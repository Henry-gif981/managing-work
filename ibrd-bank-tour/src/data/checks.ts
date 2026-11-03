import type { Fact } from './facts';

/**
 * Arithmetic assertions over facts, e.g. components summing to a total.
 * Each check returns true, or a string describing the failure.
 *   { name: 'TEP cost adds up', run: (f) => near(f('tep-ibrd') + f('tep-counterpart'), f('tep-total')) }
 */
export interface Check {
  name: string;
  run: (f: (id: string) => number, all: Fact[]) => true | string;
}

export const near = (a: number, b: number, tol = 0.051) => Math.abs(a - b) <= tol || `${a} != ${b}`;

export const CHECKS: Check[] = [
  // filled by the content prompts
];
