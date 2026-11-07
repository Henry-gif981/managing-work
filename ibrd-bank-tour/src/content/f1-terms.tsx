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
]);
export const beats = p.beats;
export default p.View;
