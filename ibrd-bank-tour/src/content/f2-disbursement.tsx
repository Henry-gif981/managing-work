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
    caption={<R t="Table 2.1.2. IBRD disbursement methods for investment projects. Source: Authors' compilation from [28; 29]." />}
  />
);
const T = 'Table 2.1.2 · Disbursement methods';
const PROPS: Record<string, string> = { advance: 'cabinets', reimb: 'ledgers', direct: 'scales', special: 'papers' };
const row = (i: number) => ({
  layout: 'centre' as const,
  kicker: 'Section 2.1.2',
  title: T,
  label: TABLE5[i].method,
  source: 'Section 2.1.2 · Table 2.1.2 · p. 23',
  centre: table,
  focus: [`t5-${TABLE5[i].id}`],
  callouts: [{ from: `#t5-${TABLE5[i].id}`, to: a(PROPS[TABLE5[i].id]), label: TABLE5[i].method }],
});
const p = scene('f2-disbursement', [
  {
    layout: 'centre',
    kicker: 'Section 2.1.2',
    title: T,
    label: 'Four methods',
    source: 'Section 2.1.2 · p. 23',
    centre: table,
    callouts: [{ from: '#t5', to: a('desk'), label: 'Finance desk' }],
    body: `Once a loan is effective, the IBRD releases funds through **four disbursement methods**, set out in each project's disbursement letter [28; 29].`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  {
    layout: 'centre',
    kicker: 'Section 2.1.2',
    title: 'Documents, minimums and deadlines',
    label: 'Rules for withdrawals',
    source: 'Section 2.1.2 · p. 23',
    centre: table,
    focus: ['t5'],
    callouts: [{ from: '#t5', to: a('ledgers'), label: 'Supporting documents' }],
    body: `Each fund withdrawal requires supporting documents, minimum application value, and disbursement deadline (often up to 4 months) [28].`,
  },
]);
export const beats = p.beats;
export default p.View;
