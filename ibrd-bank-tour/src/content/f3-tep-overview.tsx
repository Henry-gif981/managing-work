import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE10 } from '../data/tables';

const a = (n: string) => `anchor:f3-tep-overview:${n}`;
const mk = (rows: typeof TABLE10, id: string) => (
  <DataTable
    id={id}
    width={1300}
    columns={[
      { key: 'item', label: 'Item', width: 520 },
      { key: 'info', label: 'Verified information' },
    ]}
    rows={rows.map((r) => ({ id: r.id, cells: { item: <b>{r.item}</b>, info: <R t={r.info} /> } }))}
    caption={<R t="Table 10. TEP: basic project profile and implementation milestones. Source: Authors’ compilation from [45, Project Data Sheet; 46, pp. 1–3, 49; 41, pp. v–vi]." />}
  />
);
const tab = mk(TABLE10, 't10');
const row = (id: string, anchor: string, label: string, body?: string) => ({
  layout: 'centre' as const,
  title: 'Table 10 · TEP profile and milestones',
  label,
  source: 'Section 3.2.1 · Table 10 · p. 36',
  centre: tab,
  focus: [`t10-${id}`],
  callouts: [{ from: `#t10-${id}-item`, to: a(anchor), label }],
  body,
});
const p = scene('f3-tep-overview', [
  {
    title: 'The Transmission Efficiency Project',
    kicker: 'Section 3.2.1 · Case study 1 · energy',
    source: 'Section 3.2.1 · p. 35',
    callouts: [{ from: '.k-card .h2', to: a('transformer'), label: 'TEP' }],
    body: `The **Transmission Efficiency Project (TEP; {tep-id}; loan {tep-loan-no})** was approved on {tep-approval} and became effective on {tep-effective}. The original closing date of {tep-closing-orig} was extended to {tep-closed}.

Its formal development objective was **to improve the capacity, efficiency and reliability of electricity transmission services** in selected parts of Vietnam's network. TEP was financed using Investment Project Financing (IPF), rather than a development-policy or results-based instrument [45; 46; 41].`,
  },
  {
    title: 'Who did what, and where',
    kicker: 'Section 3.2.1',
    source: 'Section 3.2.1 · p. 35',
    callouts: [{ from: '.k-card .h2', to: a('pylons'), label: '220-kV and 500-kV' }],
    body: `The **Socialist Republic of Vietnam** was the borrower. The **National Power Transmission Corporation (NPT)**, a subsidiary of Vietnam Electricity (EVN), was the implementing entity, through its northern, central and southern regional project management boards. The **Ministry of Industry and Trade** was responsible for sector policy and technical approvals.

The program covered **220-kV and 500-kV lines and substations** in the greater Hanoi region, the greater Ho Chi Minh City and Mekong Delta areas, and central Vietnam [45; 41].`,
  },
  {
    title: 'The planned envelope',
    kicker: 'Section 3.2.1',
    source: 'Section 3.2.1 · p. 36',
    callouts: [{ from: '.k-card .h2', to: a('cash'), label: 'US$731.25 million' }],
    body: `At appraisal, the overall project cost was estimated at **{tep-total}**, including a **{tep-ibrd} IBRD loan** and **{tep-counterpart} in borrower resources**.

These amounts describe the planned financing envelope, not the amount drawn from the IBRD or spent on physical works. The loan also included a **{tep-fee} front-end fee**, so the figure for investment components alone must not be equated with the complete financing total [45; 46].`,
  },
  row('name', 'transformer', 'Project name / ID'),
  row('dates', 'substation', 'Approval / effectiveness'),
  row('closing', 'substation', 'Original / actual closing'),
  row('ibrd', 'cash', 'Appraisal IBRD loan'),
  row('actual', 'cash', 'Actual cost at closing'),
]);
export const beats = p.beats;
export default p.View;
