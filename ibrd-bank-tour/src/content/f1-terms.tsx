import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE3 } from '../data/tables';

const a = (n: string) => `anchor:f1-terms:${n}`;
const table = (
  <DataTable
    id="t3"
    width={1300}
    columns={[
      { key: 'term', label: 'Term', width: 320 },
      { key: 'set', label: 'Current setting' },
    ]}
    rows={TABLE3.map((r) => ({ id: r.id, cells: { term: r.term, set: <R t={r.set} /> } }))}
    caption={<R t="Table 1.4.2. Main terms of the IBRD Flexible Loan. Source: Authors' compilation from [18; 19; 20; 21; 22]." />}
  />
);
const T = 'Table 1.4.2 · IBRD Flexible Loan';
const S = 'Section 1.4.2 · Table 1.4.2 · p. 19';
const row = (id: string, prop: string, label: string, body: string, source = S) => ({
  layout: 'centre' as const,
  kicker: 'Section 1.4.2',
  title: T,
  label,
  source,
  centre: table,
  focus: [`t3-${id}`],
  callouts: [{ from: `#t3-${id}`, to: a(prop), label }],
  body,
});

const p = scene('f1-terms', [
  {
    layout: 'centre',
    kicker: 'Section 1.4.2',
    title: T,
    label: 'The IBRD Flexible Loan',
    source: S,
    centre: table,
    callouts: [{ from: '.k-head', to: a('desk'), label: 'Loan desk' }],
    body: `The **IBRD Flexible Loan** is the main product for middle-income governments. Its cost has **three parts**: an interest rate, a front-end fee and a commitment fee [18].`,
  },
  row('rate', 'rate', 'Interest rate', `Rate = reference rate + spread. The **London Interbank Offered Rate (LIBOR)** has given way to the **Secured Overnight Financing Rate (SOFR)**; since {fixed-spread-end} new loans carry a **variable spread** [19].`),
  row('final', 'contract', 'Final maturity', `In {maturity-reform} the maximum final maturity rose from {final-mat-old} to **{final-mat-new}**; some projects can reach **{final-mat-max}** [20; 21].`),
  row('avg', 'calendar', 'Average maturity', `The maximum average maturity rose from {avg-mat-old} to **{avg-mat-new}** in the same reform [20].`),
  row('sml', 'clock', 'Short Maturity Loan', `Since {sml-date}, a **Short Maturity Loan** offers a {sml-maturity|n}-year final maturity with a {sml-discount} spread discount [22].`),
  row('front', 'coins', 'Front-end fee', `A one-off **front-end fee** of {front-end-fee} of the committed amount [18].`),
  row('commit', 'ledger', 'Commitment fee', `A **commitment fee** of {commitment-fee} a year on the undisbursed balance, from {commitment-fee-start} after signing [18].`),
  row(
    'commit',
    'ledger',
    'Why the commitment fee matters',
    `Because it is charged on undisbursed balances, **slow disbursement raises the effective cost of the loan**.`,
    'Section 1.4.2 · p. 20',
  ),
]);
export const beats = p.beats;
export default p.View;
