import type { Fact } from './facts';
import { TABLE1, TABLE2, TABLE3, ESS } from './tables';

/**
 * Arithmetic and structure assertions over facts and table data.
 * Each check returns true, or a string describing the failure.
 */
export interface Check {
  name: string;
  run: (f: (id: string) => number, all: Fact[]) => true | string;
}

export const near = (a: number, b: number, tol = 0.0051) => Math.abs(a - b) <= tol || `${+a.toFixed(4)} != ${b}`;
const count = (n: number, want: number) => n === want || `${n} != ${want}`;

export const CHECKS: Check[] = [
  // structure
  { name: 'Table 1 has 5 rows (five WBG institutions)', run: (f) => count(TABLE1.length, f('table1-rows')) },
  { name: 'Table 1 rows = WBG institutions in the text', run: (f) => count(TABLE1.length, f('wbg-count')) },
  { name: 'Table 2 has 3 rows (three instruments)', run: (f) => count(TABLE2.length, f('table2-rows')) },
  { name: 'Table 2 rows = instruments in the text', run: (f) => count(TABLE2.length, f('instruments')) },
  { name: 'Table 3 has 6 rows', run: (f) => count(TABLE3.length, f('table3-rows')) },
  { name: 'ESS list has exactly 10 items', run: (f) => count(ESS.length, f('ess-count')) },
  // arithmetic
  { name: 'ASA funding shares 26 + 68 + 6 = 100', run: (f) => near(f('asa-admin') + f('asa-trust') + f('asa-ras'), 100) },
  { name: 'PIR 2: 87.3 + 262.7 = 350', run: (f) => near(f('pir2-ibrd') + f('pir2-ida'), 350) },
  { name: 'Power-sector DPF: 200 + 111.8 = 311.8', run: (f) => near(f('psr-ibrd') + f('psr-ida'), 311.8) },
  { name: 'TEP: counterpart 231.25 + IBRD 500.00 = total 731.25', run: (f) => near(f('tep-counterpart') + f('tep-ibrd'), f('tep-total')) },
  { name: 'TEP capacity building: NPT 5.50 + IBRD 0.24 = actual 5.74', run: (f) => near(f('tep-cb-npt') + f('tep-cb-ibrd'), f('tep-cb-actual')) },
  { name: 'Maturity reform raised final maturity (30 -> 35) and average maturity (18 -> 20)', run: (f) => (f('final-mat-new') > f('final-mat-old') && f('avg-mat-new') > f('avg-mat-old')) || 'not increasing' },
  { name: 'Average maturity limit <= final maturity limit', run: (f) => f('avg-mat-new') <= f('final-mat-new') || 'avg > final' },
  { name: 'TEP 26-year maturity within the 35-year IFL limit', run: (f) => f('tep-maturity') <= f('final-mat-new') || 'exceeds' },
  { name: 'CCSEP IBRD 29-year maturity within the 35-year IFL limit', run: (f) => f('ccsep-ibrd-maturity') <= f('final-mat-new') || 'exceeds' },
  { name: 'Grace periods shorter than maturities', run: (f) => (f('tep-grace') < f('tep-maturity') && f('ccsep-ibrd-grace') < f('ccsep-ibrd-maturity') && f('ccsep-ida-grace') < f('ccsep-ida-maturity')) || 'grace >= maturity' },
  { name: '"More than 80 years": 2026 - 1944 >= 80', run: (f) => 2026 - f('ibrd-founded') >= f('ibrd-age') || 'age' },
  { name: 'IFC (1956) and IDA (1960) founded in the 1950s-1970s stage', run: (f) => (f('ifc-founded') >= 1950 && f('ida-founded') < 1980) || 'dates' },
  { name: 'PforR (2012) introduced after the IBRD (1944)', run: (f) => f('pforr-year') > f('ibrd-founded') || 'dates' },
  { name: 'Vietnam IBRD-eligible (2007) before first IBRD loan (2009) and IDA graduation (2017)', run: (f) => (f('vn-ibrd-eligible') < 2009 && 2009 < f('scope-graduation')) || 'order' },
  { name: 'Phan Rang PMU: 10 of 12 staff from other ODA units (10 <= 12)', run: (f) => f('phanrang-from-oda') <= f('phanrang-staff') || '10 > 12' },
  { name: 'CCSEP: sewer connections (256,000) <= direct beneficiaries (290,000)', run: (f) => f('ccsep-sewer') <= f('ccsep-beneficiaries') || 'more connections than beneficiaries' },
  { name: 'TEP counterpart share of the planned cost is about 31.6%', run: (f) => near((f('tep-counterpart') / f('tep-total')) * 100, 31.6, 0.05) },
  { name: 'Lift card / Table 4: six project-cycle stages', run: (f) => count(f('cycle-stages'), 6) },
  { name: 'Four disbursement methods', run: (f) => count(f('disb-methods'), 4) },
];
