import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE8 } from '../data/tables';

const a = (n: string) => `anchor:f3-sahep:${n}`;
const table = (
  <DataTable
    id="t8"
    width={1380}
    columns={[
      { key: 'ind', label: 'Indicator', width: 430 },
      { key: 'tep', label: 'Transmission Efficiency Project (TEP)' },
      { key: 'sahep', label: 'Support for Autonomous Higher Education Project (SAHEP)' },
    ]}
    rows={TABLE8.map((r) => ({ id: r.id, cells: { ind: <b>{r.ind}</b>, tep: <R t={r.tep} />, sahep: <R t={r.sahep} /> } }))}
    caption={<R t="Table 3.1.1. Selected project financing characteristics at appraisal: TEP and SAHEP. Source: Authors’ compilation from the project appraisal documents [45; 48]." />}
  />
);
const p = scene('f3-sahep', [
  {
    layout: 'centre',
    band: 'right',
    title: 'SAHEP: a near-graduation comparison',
    label: 'SAHEP: a near-graduation comparison',
    source: 'Section 3.1.3 · Table 3.1.1 · pp. 31-32',
    centre: table,
    callouts: [{ from: '.k-head', to: a('documents'), label: 'SAHEP documents' }],
    body: `An institutional comparison, not a comparison of outputs.`,
  },
]);
export const beats = p.beats;
export default p.View;
