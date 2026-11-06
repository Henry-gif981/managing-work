import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE1 } from '../data/tables';

const S = 'Section 1.1.2 · Table 1.1.1 · p. 14';
const a = (n: string) => `anchor:f1-wbg:${n}`;

const table = (
  <DataTable
    id="t1"
    width={1440}
    columns={[
      { key: 'inst', label: 'Institution', width: 120 },
      { key: 'year', label: 'Year founded', width: 175 },
      { key: 'clients', label: 'Main clients' },
      { key: 'act', label: 'Main activities' },
      { key: 'funds', label: 'Source of funds' },
    ]}
    rows={TABLE1.map((r) => ({
      id: r.id,
      cells: { inst: <b>{r.inst}</b>, year: <R t={r.year} />, clients: r.clients, act: r.act, funds: r.funds },
    }))}
    caption={<R t="Table 1.1.1. The five institutions of the World Bank Group. Source: Authors' compilation from [9] and [10]." />}
  />
);

const row = (id: string, label: string) => ({
  layout: 'centre' as const,
  kicker: 'Section 1.1.2',
  title: 'Table 1.1.1 · The five institutions',
  source: S,
  label,
  centre: table,
  focus: [`t1-${id}`],
  callouts: [{ from: `#t1-${id}`, to: a(id), label }],
});

const p = scene('f1-wbg', [
  {
    kicker: 'Section 1.1.2',
    title: 'Five institutions, one goal',
    source: 'Section 1.1.2 · p. 13',
    callouts: [{ from: '.k-card', to: a('ibrd'), label: 'IBRD' }],
    body: `The World Bank Group has **five institutions** working towards one goal. The IBRD, founded in {ibrd-founded}, is the **oldest and the largest development bank**; with IDA it forms the World Bank in the narrow sense.`,
  },
  row('ibrd', 'IBRD'),
  row('ida', 'IDA'),
  row('ifc', 'IFC'),
  row('miga', 'MIGA'),
  row('icsid', 'ICSID'),
  {
    layout: 'centre',
    kicker: 'Section 1.1.2',
    title: 'Key differences · IBRD / IDA',
    label: 'IBRD vs IDA',
    source: 'Section 1.1.2 · p. 14',
    centre: table,
    focus: ['t1-ibrd-funds', 't1-ida-funds'],
    callouts: [{ from: '#t1-ida', to: a('ida'), label: 'IDA' }],
    body: `IBRD loans carry **market-based interest rates**; IDA, funded by donors, offers **much cheaper terms**.`,
  },
  {
    layout: 'centre',
    kicker: 'Section 1.1.2',
    title: 'Key differences · IBRD / IFC',
    label: 'IBRD vs IFC',
    source: 'Section 1.1.2 · p. 14',
    centre: table,
    focus: ['t1-ibrd-clients', 't1-ifc-clients'],
    callouts: [{ from: '#t1-ifc', to: a('ifc'), label: 'IFC' }],
    body: `The IBRD lends to **governments** or government-guaranteed bodies; IFC invests in **private companies** without a guarantee.`,
  },
  {
    layout: 'centre',
    kicker: 'Section 1.1.2',
    title: 'Key differences · MIGA / ICSID',
    label: 'MIGA and ICSID',
    source: 'Section 1.1.2 · p. 14',
    centre: table,
    focus: ['t1-miga-act', 't1-icsid-act'],
    callouts: [{ from: '#t1-miga', to: a('miga'), label: 'MIGA' }],
    body: `MIGA and ICSID **do not lend**: they reduce investors' risks and settle disputes, making the investment climate more attractive.`,
  },
  {
    kicker: 'Section 1.1.2',
    title: 'The main public channel',
    source: 'Section 1.1.2 · p. 14',
    callouts: [{ from: '.k-card', to: a('ibrd'), label: 'IBRD' }],
    body: `In this structure, the IBRD is **the main channel for public financing to middle-income countries**, which is why it matters so much for Vietnam today.`,
  },
]);
export const beats = p.beats;
export default p.View;
