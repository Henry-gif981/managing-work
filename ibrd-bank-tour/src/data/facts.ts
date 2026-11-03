/**
 * Every number shown in the tour lives here, with its source in the paper.
 * Components read facts by id (src/primitives/Fact.tsx, or {id} in kit templates); never retype a number.
 * `npm run check-facts` validates this file and runs the assertions in src/data/checks.ts.
 *
 * Units: 'US$ million' | 'US$ billion' | 'US$' | '%' | 'year' (calendar year) | any word ('years', 'days', 'bps'...).
 */
export interface Fact {
  id: string;
  value: number | string;
  unit?: string;
  /** e.g. "Table 10 / Section 3.2.2 / p. 36" */
  source: string;
  note?: string;
  /** fixed decimals for display, e.g. 2 for "5.50" */
  digits?: number;
}

const f = (id: string, value: number | string, unit: string | undefined, source: string, note?: string): Fact => ({ id, value, unit, source, note });

export const FACTS: Fact[] = [
  // ---------------- Introduction ----------------
  f('crisis-2008', 2008, 'year', 'Introduction 1.1 / p. 4'),
  f('vn-ibrd-eligible', 2007, 'year', 'Introduction 1.2 / p. 5'),
  f('pir1-ibrd', 500, 'US$ million', 'Introduction 1.2 / p. 5; Section 1.4.1 / p. 16; Section 2.1.3 / p. 24'),
  f('pir1-approved', 'December 2009', undefined, 'Introduction 1.2 / p. 5; Section 1.4.1 / p. 16'),
  f('vn-ida-graduation', 'July 2017', undefined, 'Introduction 1.2 / p. 5'),
  f('vn-ibrd-from', 2018, 'year', 'Introduction 1.2 / p. 5'),
  f('ida18-period', 'FY18-20', undefined, 'Introduction 1.2 / p. 5'),
  f('vn-umic', 'July 2026', undefined, 'Introduction 1.2 / p. 5'),
  f('rq-count', 4, undefined, 'Introduction 2 / p. 6'),
  f('tep-period', '2015–2021', undefined, 'Introduction 3.2 / p. 6'),
  f('ccsep-period', '2017–2024', undefined, 'Introduction 3.2 / p. 7'),
  f('criteria-count', 4, undefined, 'Introduction 3.2 / p. 7; Introduction 4 / p. 7'),
  f('mpi-merger', 2025, 'year', 'Introduction 4 / p. 7'),
  f('ccsep-icr-date', 'September 2025', undefined, 'Introduction 4 / p. 7'),
  f('ccsep-ieg-date', 'January 2026', undefined, 'Introduction 4 / p. 7'),
  f('scope-start', 2014, 'year', 'Introduction 5 / p. 8'),
  f('scope-graduation', 2017, 'year', 'Introduction 5 / p. 8'),
  f('chapters', 3, undefined, 'Introduction 6 / p. 9'),

  // ---------------- 1.1 What is the IBRD ----------------
  f('ibrd-members', 189, undefined, 'Section 1.1.1 / p. 10'),
  f('wbg-count', 5, undefined, 'Section 1.1.1 / p. 10; Section 1.1.2 / p. 10'),
  f('ibrd-founded', 1944, 'year', 'Table 1 / Section 1.1.2 / p. 11'),
  f('ida-founded', 1960, 'year', 'Table 1 / Section 1.1.2 / p. 11'),
  f('ifc-founded', 1956, 'year', 'Table 1 / Section 1.1.2 / p. 11'),
  f('miga-founded', 1988, 'year', 'Table 1 / Section 1.1.2 / p. 11'),
  f('icsid-founded', 1966, 'year', 'Table 1 / Section 1.1.2 / p. 11'),
  f('table1-rows', 5, undefined, 'Table 1 / Section 1.1.2 / p. 11'),

  // ---------------- 1.2 History ----------------
  f('stages-count', 4, undefined, 'Section 1.2 / p. 12'),
  f('bretton-woods', 'July 1944', undefined, 'Section 1.2 / p. 12'),
  f('ibrd-ops', 1946, 'year', 'Section 1.2 / p. 12'),
  f('first-loan', 250, 'US$ million', 'Section 1.2 / p. 12'),
  f('first-loan-year', 1947, 'year', 'Section 1.2 / p. 12'),
  f('marshall-plan', 1948, 'year', 'Section 1.2 / p. 12'),
  f('stage1', '1944-1950s', undefined, 'Section 1.2 / p. 12'),
  f('stage2', '1950s-1970s', undefined, 'Section 1.2 / p. 12'),
  f('stage3', '1980s-1990s', undefined, 'Section 1.2 / p. 12'),
  f('stage4', '2000-present', undefined, 'Section 1.2 / p. 13'),
  f('mcnamara-from', 'late 1960s', undefined, 'Section 1.2 / p. 12'),
  f('debt-crisis', '1980s', undefined, 'Section 1.2 / p. 12'),
  f('governance-decade', '1990s', undefined, 'Section 1.2 / p. 13'),
  f('wbg-goals-year', 2013, 'year', 'Section 1.2 / p. 13'),
  f('wbg-goals-count', 2, undefined, 'Section 1.2 / p. 13'),
  f('ibrd-age', 80, 'years', 'Section 1.2 / p. 13', 'paper: "After more than 80 years"'),

  // ---------------- 1.3 Organisation ----------------
  f('eds', 25, undefined, 'Section 1.3.1 / p. 13'),
  f('president-term', 5, 'years', 'Section 1.3.1 / p. 13', 'paper: "a five-year term"'),
  f('banga-start', '2 June 2023', undefined, 'Section 1.3.1 / p. 13'),
  f('us-votes', '15-16', '%', 'Section 1.3.2 / p. 14', 'paper: "around 15-16 percent"'),
  f('supermajority', 85, '%', 'Section 1.3.2 / p. 15'),
  f('voting-reform', '2008-2010', undefined, 'Section 1.3.2 / p. 15'),
  f('vn-votes', 0.21, '%', 'Section 1.3.2 / p. 15', 'paper: "0.21 percent of IBRD votes"'),
  f('vn-votes-date', 'June 2026', undefined, 'Section 1.3.2 / p. 15'),
  f('capital-increase', 2018, 'year', 'Section 1.3.3 / p. 15'),

  // ---------------- 1.4 Instruments and terms ----------------
  f('instruments', 3, undefined, 'Section 1.4 / p. 16; Table 2 / p. 17'),
  f('table2-rows', 3, undefined, 'Table 2 / Section 1.4.1 / p. 17'),
  f('pir1-signed', '30 December 2009', undefined, 'Section 1.4.1 / p. 16'),
  f('pforr-year', 2012, 'year', 'Section 1.4.1 / p. 17'),
  f('pforr-rank', 'third', undefined, 'Section 1.4.1 / p. 17', 'paper: "only the third financing instrument approved by the Bank\'s Board since 1944"'),
  f('ifl-parts', 3, undefined, 'Section 1.4.2 / p. 17'),
  f('fixed-spread-end', 2021, 'year', 'Section 1.4.2 / p. 18'),
  f('maturity-reform', 2014, 'year', 'Section 1.4.2 / p. 18'),
  f('final-mat-old', 30, 'years', 'Section 1.4.2 / p. 18'),
  f('final-mat-new', 35, 'years', 'Section 1.4.2 / p. 18; Table 3 / p. 18'),
  f('avg-mat-old', 18, 'years', 'Section 1.4.2 / p. 18'),
  f('avg-mat-new', 20, 'years', 'Section 1.4.2 / p. 18; Table 3 / p. 18'),
  f('final-mat-max', 50, 'years', 'Section 1.4.2 / p. 18; Table 3 / p. 18'),
  f('sml-date', 'October 2024', undefined, 'Section 1.4.2 / p. 18'),
  f('sml-maturity', 7, 'years', 'Section 1.4.2 / p. 18; Table 3 / p. 18', 'paper: "7-year final maturity"'),
  f('sml-discount', 20, 'bps', 'Section 1.4.2 / p. 18; Table 3 / p. 18', 'paper: "20-basis-point discount on the spread"'),
  f('front-end-fee', 0.25, '%', 'Table 3 / Section 1.4.2 / p. 18'),
  f('commitment-fee', 0.25, '%', 'Table 3 / Section 1.4.2 / p. 18'),
  f('commitment-fee-start', 60, 'days', 'Table 3 / Section 1.4.2 / p. 18'),
  f('terms-as-at', 'October 2026', undefined, 'Table 3 note / Section 1.4.2 / p. 18'),
  f('table3-rows', 6, undefined, 'Table 3 / Section 1.4.2 / p. 18'),
  f('tep-maturity', 26, 'years', 'Section 1.4.2 / p. 18'),
  f('tep-grace', 10, 'years', 'Section 1.4.2 / p. 18'),
  f('ccsep-ibrd-maturity', 29, 'years', 'Section 1.4.2 / p. 18'),
  f('ccsep-ibrd-grace', 10, 'years', 'Section 1.4.2 / p. 18'),
  f('ccsep-ida-maturity', 25, 'years', 'Section 1.4.2 / p. 18'),
  f('ccsep-ida-grace', 5, 'years', 'Section 1.4.2 / p. 18'),

  // ---------------- 1.4.3 Safeguards ----------------
  f('esf-approved', '4 August 2016', undefined, 'Section 1.4.3 / p. 19'),
  f('esf-applies', '1 October 2018', undefined, 'Section 1.4.3 / p. 19'),
  f('esf-parallel', 7, 'years', 'Section 1.4.3 / p. 19', 'paper: "about seven years"'),
  f('esf-cutoff', 2018, 'year', 'Section 1.4.3 / p. 19', 'paper: "both prepared before 2018"'),
  f('ess-count', 10, undefined, 'Section 1.4.3 / p. 19'),
  f('proc-framework', '1 July 2016', undefined, 'Section 1.4.3 / p. 19'),
  f('tep-approved', 2014, 'year', 'Section 1.4.3 / p. 20'),

  // ---------------- 2.1 Financial support ----------------
  f('cycle-stages', 6, undefined, 'Section 2.1.1 / p. 21; Table 4 / p. 21-22'),
  f('tep-restructured', 2019, 'year', 'Section 2.1.1 / p. 22'),
  f('tep-extension', 2, 'years', 'Section 2.1.1 / p. 22', 'paper: "extended by two years"'),
  f('ccsep-restructured', 2022, 'year', 'Section 2.1.1 / p. 22'),
  f('ccsep-cancelled', 45.6, 'US$ million', 'Section 2.1.1 / p. 22', 'paper: "about US$45.6 million"'),
  f('ccsep-delay', 5.5, 'months', 'Section 2.1.1 / p. 22', 'paper: "about five and a half months later than planned"'),
  f('disb-methods', 4, undefined, 'Section 2.1.2 / p. 22; Table 5 / p. 22-23'),
  f('disb-deadline', 4, 'months', 'Section 2.1.2 / p. 23', 'paper: "up to four months after the closing date"'),
  f('tep-counterpart', 231.25, 'US$ million', 'Introduction 3.2 / p. 6; Section 2.1.2 / p. 23'),
  f('tep-total', 731.25, 'US$ million', 'Section 2.1.2 / p. 23'),
  f('tep-ibrd', 500, 'US$ million', 'Section 3.2.2 / p. 36', 'Chapter 2 gives only the counterpart and total; the IBRD amount (USD 500.00 million) is stated in Section 3.2.2'),
  f('ccsep-budget-start', 'July 2019', undefined, 'Section 2.1.2 / p. 23'),
  f('ccsep-no-disb', '2017 and 2018', undefined, 'Section 2.1.2 / p. 23'),
  f('tep-components', 3, undefined, 'Section 2.1.3 / p. 23'),
  f('pir-ops', 2, undefined, 'Section 2.1.3 / p. 24', 'paper: "the first of two single-tranche operations"'),
  f('pir2-approved', 'May 2011', undefined, 'Section 2.1.3 / p. 24'),
  f('pir2-ibrd', 87.3, 'US$ million', 'Section 2.1.3 / p. 24'),
  f('pir2-ida', 262.7, 'US$ million', 'Section 2.1.3 / p. 24'),
  f('psr-year', 2010, 'year', 'Section 2.1.3 / p. 24'),
  f('psr-ibrd', 200, 'US$ million', 'Section 2.1.3 / p. 24'),
  f('psr-ida', 111.8, 'US$ million', 'Section 2.1.3 / p. 24'),

  // ---------------- 2.2 Technical support ----------------
  f('tep-eirr', 31.4, '%', 'Section 2.2.1 / p. 25'),
  f('ccsep-cities', 4, undefined, 'Section 2.2.1 / p. 25'),
  f('asa-funding-ways', 3, undefined, 'Section 2.2.2 / p. 25'),
  f('asa-year', 2023, 'year', 'Section 2.2.2 / p. 25'),
  f('asa-total', 991, 'US$ million', 'Section 2.2.2 / p. 25'),
  f('asa-admin', 26, '%', 'Section 2.2.2 / p. 25'),
  f('asa-trust', 68, '%', 'Section 2.2.2 / p. 25'),
  f('asa-ras', 6, '%', 'Section 2.2.2 / p. 25'),
  f('ppiaf', 350000, 'US$', 'Section 2.2.2 / p. 26'),
  f('decree-80', '80/2014/ND-CP', undefined, 'Section 2.2.2 / p. 26'),
  f('ccsep-beneficiaries', 290000, undefined, 'Section 2.2.3 / p. 26', 'paper: "about 290,000 direct beneficiaries"'),
  f('ccsep-sewer', 256000, undefined, 'Section 2.2.3 / p. 26'),
  f('ccsep-cost-recovery', 100, '%', 'Section 2.2.3 / p. 26'),
  f('ccsep-indicators', 3, undefined, 'Section 2.2.3 / p. 26'),
  f('me-levels', 3, undefined, 'Section 2.2.3 / p. 26'),
  f('tep-ppar-outcome', 'highly satisfactory', undefined, 'Section 2.2.3 / p. 26'),
  f('tep-ppar-bank', 'satisfactory', undefined, 'Section 2.2.3 / p. 26'),
  f('tep-ppar-me', 'substantial', undefined, 'Section 2.2.3 / p. 26'),
  f('ccsep-downgrade-year', 2022, 'year', 'Section 2.2.3 / p. 26'),
  f('ccsep-2022-rating', 'moderately unsatisfactory', undefined, 'Section 2.2.3 / p. 26'),
  f('ccsep-icr-outcome', 'moderately satisfactory', undefined, 'Section 2.2.3 / p. 26'),
  f('ccsep-ieg-outcome', 'satisfactory', undefined, 'Section 2.2.3 / p. 26'),
  f('ccsep-me-quality', 'modest', undefined, 'Section 2.2.3 / p. 26'),

  // ---------------- 2.3 Training ----------------
  f('training-levels', 3, undefined, 'Section 2.3 / p. 27'),
  f('tep-boards', 3, undefined, 'Section 2.3.1 / p. 27', 'paper: "northern, central and southern project management boards"'),
  f('phanrang-from-oda', 10, undefined, 'Section 2.3.1 / p. 27'),
  f('phanrang-staff', 12, undefined, 'Section 2.3.1 / p. 27'),
  f('mooc-year', 2014, 'year', 'Section 2.3.2 / p. 27'),
  f('table6-rows', 5, undefined, 'Table 6 / Section 2.3.3 / p. 28'),
  f('ccsep-contracts', 14, undefined, 'Table 6 / Section 2.3.3 / p. 28'),
  f('ccsep-contracts-check', 'late 2022', undefined, 'Table 6 / Section 2.3.3 / p. 28'),
  f('ccsep-closing', 2024, 'year', 'Table 6 / Section 2.3.3 / p. 28'),
  { ...f('tep-cb-npt', 5.5, 'US$ million', 'Section 2.3.3 / p. 28', 'paper: "US$5.50 million"'), digits: 2 },
  f('tep-cb-actual', 5.74, 'US$ million', 'Section 2.3.3 / p. 28'),
  f('tep-cb-ibrd', 0.24, 'US$ million', 'Section 2.3.3 / p. 29'),
  f('ccsep-component-4', 4, undefined, 'Section 2.3.3 / p. 29'),

  // ---------------- 2.4 Overall ----------------
  f('support-forms', 3, undefined, 'Section 2.4 / p. 29'),
  f('table7-rows', 3, undefined, 'Table 7 / Section 2.4 / p. 29'),
  f('reinforce-ways', 3, undefined, 'Section 2.4 / p. 29'),
];

const byId = new Map(FACTS.map((x) => [x.id, x]));

export function fact(id: string): Fact {
  const x = byId.get(id);
  if (!x) throw new Error(`[facts] unknown fact "${id}"`);
  return x;
}

export function factValue(id: string): number {
  const v = fact(id).value;
  if (typeof v !== 'number') throw new Error(`[facts] "${id}" is not numeric`);
  return v;
}
