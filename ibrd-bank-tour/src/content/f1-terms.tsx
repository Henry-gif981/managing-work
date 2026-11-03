import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Stat, Note, Cite } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE3 } from '../data/tables';

const a = (n: string) => `anchor:f1-terms:${n}`;
const table = (
  <DataTable
    id="t3"
    width={1300}
    columns={[
      { key: 'term', label: 'Term', width: 300 },
      { key: 'set', label: 'Current setting' },
      { key: 'src', label: 'Source', width: 140 },
    ]}
    rows={TABLE3.map((r) => ({ id: r.id, cells: { term: r.term, set: <R t={r.set} />, src: <R t={r.src} /> } }))}
    caption={<R t="Table 3. Main terms of the IBRD Flexible Loan. Note: terms are reviewed annually and may change; figures are as at {terms-as-at}." />}
  />
);
const T = 'Table 3 · IBRD Flexible Loan';
const S = 'Section 1.4.2 · Table 3 · p. 18';
const row = (id: string, prop: string, label: string, body: string, source = S) => ({
  layout: 'centre' as const,
  title: T,
  label,
  source,
  centre: table,
  focus: [`t3-${id}`],
  callouts: [{ from: `#t3-${id}-term`, to: a(prop), label }],
  body,
});

const p = scene('f1-terms', [
  {
    layout: 'centre',
    title: T,
    label: 'The IBRD Flexible Loan',
    source: 'Section 1.4.2 · p. 17',
    centre: table,
    callouts: [{ from: '.k-head', to: a('desk'), label: 'Loan desk' }],
    body: `The IBRD Flexible Loan (IFL) is the Bank's leading loan product for public-sector borrowers in middle-income countries [18]. Its cost reflects the IBRD's AAA credit rating and has {ifl-parts|n} parts: an **interest rate**, a **front-end fee** and a **commitment fee** [18].`,
  },
  row(
    'rate',
    'rate',
    'Interest rate',
    `The interest rate = market reference rate + spread. The reference rate was LIBOR until its phase-out; US dollar loans now use the Secured Overnight Financing Rate (**SOFR**). The spread combines a contractual lending spread and a maturity premium, which rises with average maturity and depends on the borrower's **pricing group**, set by income level [19]. The fixed-spread option was suspended in {fixed-spread-end}, so new loans carry a variable spread [19].`,
    'Section 1.4.2 · pp. 17-18',
  ),
  row(
    'final',
    'contract',
    'Final maturity',
    `Maturities are long by market standards. In {maturity-reform}, the maximum final maturity of a standard IFL was extended from {final-mat-old} to {final-mat-new} [20]. For some projects, the final maturity can now reach {final-mat-max} [21].`,
  ),
  row('avg', 'calendar', 'Average maturity', `In the same {maturity-reform} change, the maximum average maturity was extended from {avg-mat-old} to {avg-mat-new} [20].`),
  row('sml', 'clock', 'Short Maturity Loan', `In {sml-date}, the IBRD added a **Short Maturity Loan** with a {sml-maturity|n}-year final maturity and a {sml-discount} discount on the spread [22].`),
  row('front', 'coins', 'Front-end fee', `The front-end fee is {front-end-fee} of the committed amount, charged once [18].`),
  row('commit', 'ledger', 'Commitment fee', `The commitment fee is {commitment-fee} a year on the undisbursed balance, charged from {commitment-fee-start} after signing [18].`),
  {
    title: 'Borrower choices',
    source: 'Section 1.4.2 · p. 18',
    callouts: [{ from: '#st-tep', to: a('contract'), label: 'Loan agreement' }],
    side: (
      <div className="card k-stats terms-stats">
        <Stat id="st-tep" value={<><F id="tep-maturity" unit={false} />/<F id="tep-grace" unit={false} /></>} label={<>TEP: maturity / grace (years) <Cite n={23} /></>} />
        <Stat id="st-ccsep-ibrd" value={<><F id="ccsep-ibrd-maturity" unit={false} />/<F id="ccsep-ibrd-grace" unit={false} /></>} label="CCSEP IBRD loan: maturity / grace (years)" />
        <Stat id="st-ccsep-ida" value={<><F id="ccsep-ida-maturity" unit={false} />/<F id="ccsep-ida-grace" unit={false} /></>} label="CCSEP IDA credit: maturity / grace (years)" />
      </div>
    ),
    body: `Within these limits, the borrower chooses the currency, the grace period and the repayment schedule.

TEP had a {tep-maturity} maturity with a {tep-grace} grace period [23]. CCSEP's IBRD loan had a {ccsep-ibrd-maturity} maturity with a {ccsep-ibrd-grace} grace period, while its IDA credit carried {ccsep-ida-maturity} with a {ccsep-ida-grace} grace period (see Section 3.3.2).`,
  },
  row(
    'commit',
    'ledger',
    'Why the commitment fee matters',
    `The commitment fee has a practical consequence. Because it is charged on undisbursed balances, **slow disbursement raises the effective cost of the loan**. This links loan terms directly to the implementation problems discussed in Chapter 3.`,
    'Section 1.4.2 · p. 18',
  ),
]);
export const beats = p.beats;
export default p.View;
void Note;
