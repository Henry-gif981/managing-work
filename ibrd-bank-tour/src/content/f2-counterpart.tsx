import { scene, R } from './kit';
import { Chart } from '../primitives/Chart';
import { Note } from '../primitives/bits';
import { factValue } from '../data/facts';
import { formatFact } from '../primitives/Fact';
import { fact } from '../data/facts';

const a = (n: string) => `anchor:f2-counterpart:${n}`;
const chart = (
  <Chart
    id="c-tep"
    kind="stacked"
    width={700}
    height={430}
    categories={['TEP planned cost']}
    series={[
      { name: 'IBRD loan (Section 3.2.2)', values: [factValue('tep-ibrd')], color: 'var(--series-2)' },
      { name: 'NPT counterpart', values: [factValue('tep-counterpart')], color: 'var(--series-4)' },
    ]}
    max={800}
    format={(v) => `${v}`}
    caption={<R t={`US$ million. Total planned: {tep-total}; NPT counterpart {tep-counterpart} [30].`} />}
  />
);
const p = scene('f2-counterpart', [
  {
    title: 'The borrower pays a share',
    source: 'Section 2.1.2 · p. 23',
    callouts: [{ from: '.k-card .h2', to: a('ledgers'), label: 'Counterpart funds' }],
    body: `The IBRD rarely finances the whole project. The borrower contributes **counterpart funding**, which typically covers costs the Bank does not finance.

In CCSEP, counterpart funds paid for land compensation, resettlement, project staff salaries, operating costs and training (see Section 3.3.2).`,
  },
  {
    title: 'TEP: who paid for what',
    source: 'Section 2.1.2 · p. 23 (IBRD amount: Section 3.2.2 · p. 36)',
    side: chart,
    focus: ['c-tep-s1'],
    callouts: [{ from: '#c-tep-1-0', to: a('ledgers'), label: 'NPT' }],
    body: `In TEP, NPT provided {tep-counterpart} of the planned {tep-total} [30].`,
    aside: (
      <Note>
        <R t={`Chapter 2 states only the counterpart and the total. The IBRD loan of ${formatFact(fact('tep-ibrd'))} shown in the bar is from Section 3.2.2 (p. 36).`} />
      </Note>
    ),
  },
  {
    title: 'The binding constraint',
    source: 'Section 2.1.2 · p. 23',
    callouts: [{ from: '.k-card .h2', to: a('scales'), label: 'Money available, not used' }],
    body: `Counterpart funding is often the **binding constraint on disbursement**. In CCSEP, provincial budget allocations began only in {ccsep-budget-start}, so there was no disbursement in {ccsep-no-disb} (see Section 3.3.3). In such cases, IBRD money is available but cannot be used.

Where loans are **on-lent to provinces**, local governments also take on real debt obligations, which adds to their caution.`,
  },
]);
export const beats = p.beats;
export default p.View;
