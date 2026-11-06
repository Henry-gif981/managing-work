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
const row = (i: number) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Table 3.1.1 · TEP and SAHEP',
  label: TABLE8[i].ind,
  source: 'Section 3.1.3 · Table 3.1.1 · p. 31',
  centre: table,
  focus: [`t8-${TABLE8[i].id}`],
  callouts: [{ from: `#t8-${TABLE8[i].id}-sahep`, to: a('documents'), label: TABLE8[i].ind.replace(/ \(million USD\)/, '') }],
});
const p = scene('f3-sahep', [
  {
    title: 'SAHEP: a near-graduation comparison',
    layout: 'left',
    source: 'Section 3.1.3 · p. 31',
    callouts: [{ from: '.k-card .h2', to: a('documents'), label: 'SAHEP documents' }],
    body: `The **Support for Autonomous Higher Education Project (SAHEP, {sahep-id})** was approved by the Board on {sahep-approval} and financed through an IDA credit of {sahep-sdr}, equivalent to {sahep-ida} at appraisal. Its total estimated cost was {sahep-total}, including {sahep-counterpart} of counterpart financing.

It sought to improve the research, teaching and institutional capacity of selected autonomous universities and strengthen national higher-education management [48].`,
  },
  {
    title: 'What the comparison shows',
    layout: 'left',
    source: 'Section 3.1.3 · pp. 31-32',
    body: `SAHEP illustrates the late IDA pipeline. It is **not evidence that IDA disbursements stopped in July 2017**, or that SAHEP was necessarily the final IDA-approved project, and its education outputs cannot be compared directly with TEP's network indicators.

The comparison is **institutional**: in 2017 an IDA credit was approved for university and governance investments, whereas TEP had already used an IBRD loan for a large network-investment program in 2014.`,
  },
  ...TABLE8.map((_, i) => row(i)),
]);
export const beats = p.beats;
export default p.View;
