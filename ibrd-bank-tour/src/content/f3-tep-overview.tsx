import { scene, R, detail } from './kit';
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
    caption={<R t="Table 3.2.1. TEP: basic project profile and implementation milestones. Source: Authors’ compilation from [45, Project Data Sheet; 46, pp. 1–3, 49; 41, pp. v–vi]." />}
  />
);
const tab = mk(TABLE10, 't10');
const row = (id: string, anchor: string, label: string, body?: string) => ({
  layout: 'centre' as const,
  title: 'Table 3.2.1 · TEP profile and milestones',
  label,
  source: 'Section 3.2.1 · Table 3.2.1 · p. 34',
  centre: tab,
  focus: [`t10-${id}`],
  callouts: [{ from: `#t10-${id}-item`, to: a(anchor), label }],
  body,
});
const p = scene('f3-tep-overview', [
  {
    title: 'The Transmission Efficiency Project',
    kicker: 'Section 3.2.1 · Case study 1 · energy',
    source: 'Section 3.2.1 · p. 33',
    callouts: [{ from: '.k-card .h2', to: a('transformer'), label: 'TEP' }],
    body: `The Transmission Efficiency Project, or TEP, was approved in 2014. Its objective was to improve the capacity, efficiency and reliability of electricity transmission in selected areas of Vietnam [45; 46; 41].`,
  },
  {
    title: 'Who did what, and where',
    kicker: 'Section 3.2.1',
    source: 'Section 3.2.1 · p. 33',
    callouts: [{ from: '.k-card .h2', to: a('pylons'), label: '220-kV and 500-kV' }],
    body: `The Government of Vietnam was the borrower, while NPT, a subsidiary of EVN, implemented the project. It mainly focused on 220-kV and 500-kV transmission infrastructure [45; 41].`,
  },
  // detail beats (out of the main flow; Details mode, key V): the planned envelope (now told in scene 41) and Table 3.2.1
  ...detail({
    title: 'The planned envelope',
    kicker: 'Section 3.2.1',
    source: 'Section 3.2.1 · p. 34',
    callouts: [{ from: '.k-card .h2', to: a('cash'), label: 'US$731.25 million' }],
    body: `At appraisal, the overall project cost was estimated at **{tep-total}**, including a **{tep-ibrd} IBRD loan** and **{tep-counterpart} in borrower resources**.

These amounts describe the planned financing envelope, not the amount drawn from the IBRD or spent on physical works. The loan also included a **{tep-fee} front-end fee**, so the figure for investment components alone must not be equated with the complete financing total [45; 46].`,
  },
  row('name', 'transformer', 'Project name / ID'),
  row('dates', 'substation', 'Approval / effectiveness'),
  row('closing', 'substation', 'Original / actual closing'),
  row('ibrd', 'cash', 'Appraisal IBRD loan'),
  row('actual', 'cash', 'Actual cost at closing')),
]);
export const beats = p.beats;
export default p.View;
