import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chip } from '../primitives/bits';
import { TABLE2 } from '../data/tables';

const a = (n: string) => `anchor:f1-instruments:${n}`;
const table = (
  <DataTable
    id="t2"
    width={1440}
    columns={[
      { key: 'inst', label: 'Instrument', width: 160 },
      { key: 'what', label: 'What it finances' },
      { key: 'against', label: 'Disbursed against' },
      { key: 'suited', label: 'Best suited to' },
    ]}
    rows={TABLE2.map((r) => ({ id: r.id, cells: { inst: <b>{r.inst}</b>, what: r.what, against: r.against, suited: r.suited } }))}
    caption={<R t="Table 1.4.1. The IBRD's three lending instruments. Source: Authors' compilation from [16; 17]." />}
  />
);
const T = 'Table 1.4.1 · Three lending instruments';
const p = scene('f1-instruments', [
  {
    kicker: 'Section 1.4',
    title: 'Three instruments, one loan',
    source: 'Section 1.4 · p. 18',
    callouts: [{ from: '.k-card', to: a('dpf'), label: 'Lending counters' }],
    body: `The IBRD lends through **three instruments**, defined by what they finance and what triggers payment. One product, the **IBRD Flexible Loan**, sets price and repayment; environmental, social and procurement rules govern spending.`,
  },
  {
    layout: 'centre',
    kicker: 'Section 1.4.1',
    title: T,
    label: 'What the IBRD "buys"',
    source: 'Section 1.4.1 · Table 1.4.1 · pp. 18-19',
    centre: table,
    callouts: [{ from: '#t2', to: a('pforr'), label: 'Lending counters' }],
    aside: (
      <div className="k-buys">
        <div className="k-buys-a">
          <div className="k-keydiff-h">What the IBRD "buys"</div>
          <div className="chips">
            <Chip tone="navy">IPF → inputs</Chip>
            <Chip tone="cyan">DPF → reforms</Chip>
            <Chip tone="warn">PforR → results</Chip>
          </div>
          <p>This choice shapes the borrower's obligations.</p>
        </div>
        <R
          className="k-buys-b"
          t={`- **Investment Project Financing (IPF)** pays for project works, goods and services as costs are incurred; it suits infrastructure with a clear scope [16].
- **Development Policy Financing (DPF)** supports reforms: after agreed prior actions, money goes to the budget [16]. Vietnam's first IBRD loan, {pir1-ibrd} in {pir1-approved}, was a DPF [2].
- **Program-for-Results (PforR)**, introduced in {pforr-year}, funds a government's own program and pays on verified **Disbursement-Linked Indicators (DLIs)** [16; 17].`}
        />
      </div>
    ),
  },
]);
export const beats = p.beats;
export default p.View;
