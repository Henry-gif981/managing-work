import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE5 } from '../data/tables';

const a = (n: string) => `anchor:f2-disbursement:${n}`;
const table = (
  <DataTable
    id="t5"
    width={1380}
    columns={[
      { key: 'method', label: 'Method', width: 280 },
      { key: 'how', label: 'How it works' },
      { key: 'use', label: 'Typical use', width: 360 },
    ]}
    rows={TABLE5.map((r) => ({ id: r.id, cells: { method: <b>{r.method}</b>, how: r.how, use: r.use } }))}
    caption={<R t="Table 5. IBRD disbursement methods for investment projects. Source: Authors' compilation from [28; 29]." />}
  />
);
const T = 'Table 5 · Disbursement methods';
const PROPS: Record<string, string> = { advance: 'cabinets', reimb: 'ledgers', direct: 'scales', special: 'papers' };
const row = (i: number) => ({
  layout: 'centre' as const,
  title: T,
  label: TABLE5[i].method,
  source: i < 2 ? 'Section 2.1.2 · Table 5 · p. 22' : 'Section 2.1.2 · Table 5 · pp. 22-23',
  centre: table,
  focus: [`t5-${TABLE5[i].id}`],
  callouts: [{ from: `#t5-${TABLE5[i].id}-method`, to: a(PROPS[TABLE5[i].id]), label: TABLE5[i].method }],
});
const p = scene('f2-disbursement', [
  {
    layout: 'centre',
    title: T,
    label: 'Four methods',
    source: 'Section 2.1.2 · p. 22',
    centre: table,
    callouts: [{ from: '.k-head', to: a('desk'), label: 'Finance desk' }],
    body: `Once a loan is effective, the IBRD releases funds through **{disb-methods|n} disbursement methods**, set out in each project's disbursement letter [28; 29].`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  {
    layout: 'centre',
    title: 'Documents, minimums and deadlines',
    label: 'Rules for withdrawals',
    source: 'Section 2.1.2 · p. 23',
    centre: table,
    focus: ['t5'],
    callouts: [{ from: '.k-head', to: a('ledgers'), label: 'Statements of expenditure' }],
    body: `Each withdrawal must be supported by documents such as statements of expenditure or interim financial reports. The Bank also sets a minimum value for applications and a disbursement deadline, up to {disb-deadline} after the closing date [28]. **CCSEP used all four methods**, with a designated account for each province (see Section 3.3.2).`,
  },
]);
export const beats = p.beats;
export default p.View;
