import type { Fact } from './facts';
import { TABLE1, TABLE2, TABLE3, TABLE4, TABLE5, TABLE6, TABLE7, TABLE8, TABLE9, TABLE10, TABLE11, TABLE12, TABLE13, TABLE14, TABLE15, TABLE16, TABLE17, TABLE18, TABLE19, TABLE20, FIGURES, ESS, RECS } from './tables';

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
  { name: 'Table 4 has 6 stages (six-stage project cycle)', run: (f) => count(TABLE4.length, f('cycle-stages')) },
  { name: 'Table 5 has 4 rows (four disbursement methods)', run: (f) => count(TABLE5.length, f('disb-methods')) },
  { name: 'Table 6 has 5 rows', run: (f) => count(TABLE6.length, f('table6-rows')) },
  { name: 'Table 7 has 3 rows', run: (f) => count(TABLE7.length, f('table7-rows')) },
  { name: 'ESS list has exactly 10 items', run: (f) => count(ESS.length, f('ess-count')) },
  // arithmetic
  { name: 'TEP: counterpart 231.25 + IBRD 500.00 = total 731.25', run: (f) => near(f('tep-counterpart') + f('tep-ibrd'), f('tep-total')) },
  { name: 'Maturity reform raised final maturity (30 -> 35) and average maturity (18 -> 20)', run: (f) => (f('final-mat-new') > f('final-mat-old') && f('avg-mat-new') > f('avg-mat-old')) || 'not increasing' },
  { name: 'Average maturity limit <= final maturity limit', run: (f) => f('avg-mat-new') <= f('final-mat-new') || 'avg > final' },
  { name: 'TEP 26-year maturity within the 35-year IFL limit', run: (f) => f('tep-maturity') <= f('final-mat-new') || 'exceeds' },
  { name: 'CCSEP IBRD 29-year maturity within the 35-year IFL limit', run: (f) => f('ccsep-ibrd-maturity') <= f('final-mat-new') || 'exceeds' },
  { name: 'Grace periods shorter than maturities', run: (f) => (f('tep-grace') < f('tep-maturity') && f('ccsep-ibrd-grace') < f('ccsep-ibrd-maturity') && f('ccsep-ida-grace') < f('ccsep-ida-maturity')) || 'grace >= maturity' },
  { name: '"More than 80 years": 2026 - 1944 >= 80', run: (f) => 2026 - f('ibrd-founded') >= f('ibrd-age') || 'age' },
  { name: 'IFC (1956) and IDA (1960) founded in the 1950s-1970s stage', run: (f) => (f('ifc-founded') >= 1950 && f('ida-founded') < 1980) || 'dates' },
  { name: 'PforR (2012) introduced after the IBRD (1944)', run: (f) => f('pforr-year') > f('ibrd-founded') || 'dates' },
  { name: 'Phan Rang PMU: 10 of 12 staff from other ODA units (10 <= 12)', run: (f) => f('phanrang-from-oda') <= f('phanrang-staff') || '10 > 12' },
  { name: 'CCSEP: sewer connections (256,000) <= direct beneficiaries (290,000)', run: (f) => f('ccsep-sewer') <= f('ccsep-beneficiaries') || 'more connections than beneficiaries' },
  { name: 'TEP counterpart share of the planned cost is about 31.6%', run: (f) => near((f('tep-counterpart') / f('tep-total')) * 100, 31.6, 0.05) },
  { name: 'Phan Rang PMU: 2 of 12 staff were new (12 - 10)', run: (f) => count(f('phanrang-staff') - f('phanrang-from-oda'), 2) },

  // ================= Chapter 3 =================
  { name: 'Table 8 has 7 rows', run: (f) => count(TABLE8.length, f('table8-rows')) },
  { name: 'Table 9 has 6 milestones (incl. Decree 242/2025/ND-CP)', run: (f) => count(TABLE9.length, f('table9-rows')) || 'rows' },
  { name: 'Table 10 has 9 rows', run: (f) => count(TABLE10.length, f('table10-rows')) },
  { name: 'Table 13 has 5 rows', run: (f) => count(TABLE13.length, f('table13-rows')) },
  { name: 'Table 15 has 5 rows', run: (f) => count(TABLE15.length, f('table15-rows')) },
  { name: 'Table 16 has 7 rows', run: (f) => count(TABLE16.length, f('table16-rows')) },
  { name: 'Table 17 has 6 rows', run: (f) => count(TABLE17.length, f('table17-rows')) },
  { name: 'Table 18 has 5 rows', run: (f) => count(TABLE18.length, f('table18-rows')) },
  { name: 'Table 19 has 5 rows', run: (f) => count(TABLE19.length, f('table19-rows')) },
  { name: 'Table 20 has 5 rows', run: (f) => count(TABLE20.length, f('table20-rows')) },
  { name: 'Six recommendations', run: (f) => count(RECS.length, f('recs-count')) },
  { name: 'SAHEP: 155.00 + 19.60 = 174.60', run: (f) => near(f('sahep-ida') + f('sahep-counterpart'), f('sahep-total')) },
  { name: 'TEP Table 11: 731.25 - 517.53 = 213.72', run: (f) => near(f('tep-total') - f('tep-actual-total'), f('tep-cost-cut')) },
  { name: 'TEP: 213.72 / 731.25 ≈ 29.2%', run: (f) => near((f('tep-cost-cut') / f('tep-total')) * 100, f('tep-cost-cut-pct'), 0.05) },
  { name: 'TEP: 517.53 / 731.25 ≈ 70.77%', run: (f) => near((f('tep-actual-total') / f('tep-total')) * 100, f('tep-total-pct'), 0.005) },
  { name: 'TEP: 500.00 - 318.53 = 181.47', run: (f) => near(f('tep-ibrd') - f('tep-ibrd-disb'), f('tep-gap')) },
  { name: 'TEP: 181.47 / 500 = 36.3%', run: (f) => near((f('tep-gap') / f('tep-ibrd')) * 100, f('tep-gap-pct'), 0.05) },
  { name: 'TEP: 318.53 / 500 = 63.7%', run: (f) => near((f('tep-ibrd-disb') / f('tep-ibrd')) * 100, f('tep-ibrd-disb-pct'), 0.05) },
  { name: 'TEP: 289.03 + 28.01 + 0.24 + 1.25 = 318.53', run: (f) => near(f('tep-c1-ibrd-act') + f('tep-c2-ibrd-act') + f('tep-c3-ibrd-act') + f('tep-fee'), f('tep-ibrd-disb')) },
  { name: 'TEP Table 12 appraisal IBRD: 429.45 + 55.00 + 14.30 + 1.25 = 500.00', run: (f) => near(f('tep-c1-ibrd-app') + f('tep-c2-ibrd-app') + f('tep-c3-ibrd-app') + f('tep-fee'), f('tep-ibrd')) },
  { name: 'TEP Table 11 appraisal: 625 + 80 + 25 + 1.25 = 731.25', run: (f) => near(f('tep-c1-app') + f('tep-c2-app') + f('tep-c3-app') + f('tep-fee'), f('tep-total')) },
  { name: 'TEP Table 11 actual: 464.53 + 46.01 + 5.74 + 1.25 = 517.53', run: (f) => near(f('tep-c1-act') + f('tep-c2-act') + f('tep-c3-act') + f('tep-fee'), f('tep-actual-total')) },
  { name: 'TEP Table 11 %: 74.32 / 57.51 / 22.96', run: (f) => [['tep-c1-act', 'tep-c1-app', 'tep-c1-pct'], ['tep-c2-act', 'tep-c2-app', 'tep-c2-pct'], ['tep-c3-act', 'tep-c3-app', 'tep-c3-pct']].every(([a, b, c]) => Math.abs((f(a) / f(b)) * 100 - f(c)) < 0.006) || 'percent mismatch' },
  { name: 'TEP counterpart actual ≈ 517.53 - 318.53 = 199.00', run: (f) => near(f('tep-actual-total') - f('tep-ibrd-disb'), f('tep-counterpart-final')) },
  { name: 'TEP Table 13 costs: 2.24 + 0.20 + 0.30 + 3.00 = 5.74 (capacity building actual)', run: (f) => near(f('tep-ams-cost') + f('tep-tariff-cost') + f('tep-ifrs-cost') + f('tep-lab-cost'), f('tep-c3-act')) },
  { name: 'TEP Table 14 %: 981/920, 261/120, 4263/3950, 5/5, 10/11', run: (f) => TABLE14.every((r) => Math.abs((f(r.actual) / f(r.target)) * 100 - f(r.pct)) < 0.051) || 'percent mismatch' },
  { name: 'TEP 52.6% re-estimated EIRR > 31.4% appraisal EIRR', run: (f) => f('eirr-icr') > f('eirr-pad') || 'order' },
  { name: 'CCSEP: 46.0 + 190.2 = 236.2', run: (f) => near(f('ccsep-ibrd') + f('ccsep-ida'), f('ccsep-wb')) },
  { name: 'CCSEP: 236.2 + 37.4 = 273.6', run: (f) => near(f('ccsep-wb') + f('ccsep-cp'), f('ccsep-total')) },
  { name: 'CCSEP shares 16.8 + 69.5 + 13.7 = 100', run: (f) => near(f('ccsep-ibrd-pct') + f('ccsep-ida-pct') + f('ccsep-cp-pct'), 100) },
  { name: 'CCSEP: 236.2 / 273.6 ≈ 86.3%', run: (f) => near((f('ccsep-wb') / f('ccsep-total')) * 100, f('ccsep-wb-pct'), 0.05) },
  { name: 'Table 18: 140.7 + 31.2 + 25.1 + 11.7 = 208.7', run: (f) => near(f('c1-base') + f('c2-base') + f('c3-base') + f('c4-base'), f('base-total')) },
  { name: 'Table 18 columns: IDA 140.7 + 3.4 = 144.1; counterpart 21.7 + 11.7 = 33.4', run: (f) => (near(f('c1-base') + f('c3-ida'), f('base-ida')) === true && near(f('c3-cp') + f('c4-base'), f('base-cp')) === true) || 'column sums' },
  { name: 'Table 18: 144.1 + 31.2 + 33.4 = 208.7', run: (f) => near(f('base-ida') + f('base-ibrd') + f('base-cp'), f('base-total')) },
  { name: 'Table 18 note: 208.7 + 37.9 + 22.3 + 4.8 ≈ 273.6 (PAD rounding)', run: (f) => near(f('base-total') + f('contingencies') + f('vat') + f('cap-fees'), f('ccsep-total'), 0.11) },
  { name: 'Table 19: 156.4 + 34.2 = 190.6', run: (f) => near(f('adj-ida') + f('adj-ibrd'), f('adj-wb')) },
  { name: 'Table 19: 190.6 + 50.0 = 240.6', run: (f) => near(f('adj-wb') + f('adj-cp'), f('adj-total')) },
  { name: 'Table 19 changes: -11.8 + -33.8 = -45.6; 240.6 - 273.6 = -33.0', run: (f) => (near(f('chg-ibrd') + f('chg-ida'), f('chg-wb')) === true && near(f('adj-total') - f('ccsep-total'), f('chg-total')) === true) || 'changes' },
  { name: 'Table 19 at closing: 127.4 + 19.5 = 146.9', run: (f) => near(f('close-ida') + f('close-ibrd'), f('close-wb')) },
  { name: 'Table 19 at closing: 146.9 + 43.4 vs 190.2 (paper rounding note)', run: (f) => near(f('close-wb') + f('close-cp'), f('close-total'), 0.11) },
  { name: 'Restructuring: 11.8 + about 34 ≈ about 45.6', run: (f) => near(f('cancel-ibrd') + f('cancel-ida'), -f('chg-wb'), 0.25) },
  { name: 'CCSEP by late 2022: 16.47 + 68.34 ≈ 84.8', run: (f) => near(f('disb-ibrd-2022') + f('disb-ida-2022'), f('disb-2022'), 0.02) },
  { name: 'CCSEP: 84.8 / 236.2 ≈ 36%', run: (f) => near((f('disb-2022') / f('ccsep-wb')) * 100, f('disb-2022-pct'), 0.5) },
  { name: 'CCSEP: 146.9 / 236.2 ≈ 62%', run: (f) => near((f('close-wb') / f('ccsep-wb')) * 100, f('close-pct'), 0.5) },
  { name: 'Table 20: 273,704 / 290,000 ≈ 94%', run: (f) => near((f('kpi-ben') / f('kpi-ben-target')) * 100, f('kpi-ben-pct'), 0.5) },
  { name: 'Table 20: 228,080 / 256,000 ≈ 89%', run: (f) => near((f('kpi-sewer') / f('kpi-sewer-target')) * 100, f('kpi-sewer-pct'), 0.5) },
  { name: 'Nha Trang: 138 / 469 ≈ 29%', run: (f) => near((f('nt-comp') / f('nt-hh')) * 100, f('nt-comp-pct'), 0.5) },
  { name: 'Figure 7: city stacks = city totals (±0.1 rounding)', run: (f) => FIGURES.fig7.every((c) => Math.abs(f(c.grant) + f(c.lent) + f(c.ibrd) + f(c.cp) - f(c.total)) <= 0.11) || 'stack mismatch' },
  { name: 'Figure 7: IBRD by city sums to 46.0', run: (f) => near(FIGURES.fig7.reduce((a, c) => a + f(c.ibrd), 0), f('ccsep-ibrd'), 0.01) },
  { name: 'Figure 7: IDA (granted + lent) by city sums to 190.2', run: (f) => near(FIGURES.fig7.reduce((a, c) => a + f(c.grant) + f(c.lent), 0), f('ccsep-ida'), 0.01) },
  { name: 'Figure 7 on-grant shares match Figure 6 (80/80/70/50%)', run: (f) => FIGURES.fig7.every((c) => Math.abs((f(c.grant) / (f(c.grant) + f(c.lent))) * 100 - f(`ongrant-${c.id}`)) < 0.6) || 'share mismatch' },
  { name: 'On-lent ≈ IBRD 46.0 + IDA on-lent (Figure 7) ≈ 101.8', run: (f) => near(f('ccsep-ibrd') + FIGURES.fig7.reduce((a, c) => a + f(c.lent), 0), f('onlend-total'), 0.11) },
  { name: 'On-granted ≈ 49.1% and on-lent ≈ 37.2% of 273.6', run: (f) => (near((FIGURES.fig7.reduce((a, c) => a + f(c.grant), 0) / f('ccsep-total')) * 100, f('ongrant-total-pct'), 0.1) === true && near((f('onlend-total') / f('ccsep-total')) * 100, f('onlend-total-pct'), 0.1) === true) || 'shares' },
  { name: 'City allocations 87.9 + 72.0 + 58.4 + 55.3 = 273.6', run: (f) => near(f('city-pr') + f('city-nt') + f('city-dh') + f('city-qn'), f('ccsep-total'), 0.01) },
  { name: 'Charts plot the table values: Figure 2 = Table 11, Figure 3 = Table 14, Figure 1 totals = Table 12', run: () => {
      const ok = FIGURES.fig2.appraisal.join() === TABLE11.slice(0, 3).map((r) => r.app).join() && FIGURES.fig2.actual.join() === TABLE11.slice(0, 3).map((r) => r.act).join()
        && FIGURES.fig3.values.join() === TABLE14.map((r) => r.pct).join()
        && FIGURES.fig1.ibrd.join() === [TABLE12[4].appI, TABLE12[4].actI].join() && FIGURES.fig1.totals.join() === [TABLE12[4].appT, TABLE12[4].actT].join()
        && FIGURES.fig5.parts.join() === [TABLE19[1].app, TABLE19[2].app, TABLE19[3].app].join();
      return ok || 'chart data do not reference the table facts';
    } },
  { name: 'Figure 1: IBRD + borrower = total for appraisal and actual', run: (f) => FIGURES.fig1.ibrd.every((id, i) => Math.abs(f(id) + f(FIGURES.fig1.borrower[i]) - f(FIGURES.fig1.totals[i])) < 0.006) || 'stack mismatch' },
  { name: 'CCSEP closing extended by 18 months (31 Dec 2022 -> 30 Jun 2024)', run: (f) => count(f('ccsep-extension'), 18) },
  { name: 'Phan Rang 1,400 of 1,586 plans and Nha Trang 160 of 585 (approved <= total)', run: (f) => (f('pr-plans-approved') <= f('pr-plans') && f('nt-plans-approved') <= f('nt-plans')) || 'order' },
];
