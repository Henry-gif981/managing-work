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
      { key: 'inst', label: 'Instrument', width: 300 },
      { key: 'what', label: 'What it finances' },
      { key: 'against', label: 'Disbursed against' },
      { key: 'suited', label: 'Best suited to' },
    ]}
    rows={TABLE2.map((r) => ({ id: r.id, cells: { inst: <b>{r.inst}</b>, what: r.what, against: r.against, suited: r.suited } }))}
    caption={<R t="Table 2. The IBRD's three lending instruments. Source: Authors' compilation from [16; 17]." />}
  />
);
const T = 'Table 2 · Three lending instruments';
const p = scene('f1-instruments', [
  {
    title: 'Three instruments, one loan product',
    kicker: 'Section 1.4',
    source: 'Section 1.4 · p. 16',
    callouts: [{ from: '.k-card .h2', to: a('dpf'), label: 'Lending counters' }],
    body: `The IBRD lends through **three instruments**, each defined by what it finances and what triggers disbursement.

A single loan product, the **IBRD Flexible Loan**, sets the price and repayment terms. Environmental, social and procurement rules then govern how the money may be spent.`,
  },
  {
    layout: 'centre',
    title: T,
    label: 'IPF',
    source: 'Section 1.4.1 · Table 2 · pp. 16-17',
    centre: table,
    focus: ['t2-ipf'],
    callouts: [{ from: '#t2-ipf-inst', to: a('ipf'), label: 'IPF' }],
    body: `IPF is the IBRD's traditional instrument. It finances a ring-fenced set of project activities such as civil works, equipment and consulting services; money is disbursed as the borrower incurs eligible project expenditures [16]. IPF suits physical infrastructure with a clear scope and timetable. **Both case studies in Chapter 3, TEP and CCSEP, were financed through IPF.**`,
  },
  {
    layout: 'centre',
    title: T,
    label: 'DPF',
    source: 'Section 1.4.1 · Table 2 · pp. 16-17',
    centre: table,
    focus: ['t2-dpf'],
    callouts: [{ from: '#t2-dpf-inst', to: a('dpf'), label: 'DPF' }],
    body: `DPF supports a set of policy and institutional reforms rather than a project. The borrower must complete agreed "prior actions" before the Board approves the loan; funds then go to the general budget and are not traced to specific expenditures [16]. **Vietnam's first IBRD loan was a DPF operation:** a {pir1-ibrd} Public Investment Reform loan approved in {pir1-approved} and signed on {pir1-signed} [2].`,
  },
  {
    layout: 'centre',
    title: T,
    label: 'PforR',
    source: 'Section 1.4.1 · Table 2 · p. 17',
    centre: table,
    focus: ['t2-pforr'],
    callouts: [{ from: '#t2-pforr-inst', to: a('pforr'), label: 'PforR' }],
    body: `PforR was introduced in {pforr-year}. It was only the {pforr-rank} financing instrument approved by the Bank's Board since {ibrd-founded} [17]. PforR supports a government's own program and uses the country's own systems. Disbursement depends on the **verified achievement of Disbursement-Linked Indicators (DLIs)**, not on individual expenditures [16].`,
  },
  {
    layout: 'centre',
    title: 'What the IBRD "buys"',
    label: 'Inputs, reforms, results',
    source: 'Section 1.4.1 · p. 17',
    centre: table,
    focus: ['t2-col-against'],
    callouts: [{ from: '#t2-dpf-against', to: a('dpf') }],
    aside: (
      <div className="chips">
        <Chip tone="navy">IPF → inputs</Chip>
        <Chip tone="cyan">DPF → reforms</Chip>
        <Chip tone="warn">PforR → results</Chip>
      </div>
    ),
    body: `The key difference lies in what the IBRD "buys" with each loan: under IPF, it pays for **inputs**; under DPF, for **reforms**; under PforR, for **results**. This choice shapes the borrower's obligations, which Section 2.1.3 examines in practice.`,
  },
]);
export const beats = p.beats;
export default p.View;
