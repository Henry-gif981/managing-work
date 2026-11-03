import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE1 } from '../data/tables';

const S = 'Section 1.1.2 · Table 1 · p. 11';
const a = (n: string) => `anchor:f1-wbg:${n}`;

const table = (
  <DataTable
    id="t1"
    width={1440}
    columns={[
      { key: 'inst', label: 'Institution', width: 120 },
      { key: 'year', label: 'Year\u00a0founded', width: 175 },
      { key: 'clients', label: 'Main clients' },
      { key: 'act', label: 'Main activities' },
      { key: 'funds', label: 'Source of funds' },
    ]}
    rows={TABLE1.map((r) => ({
      id: r.id,
      cells: { inst: <b>{r.inst}</b>, year: <R t={r.year} />, clients: r.clients, act: r.act, funds: r.funds },
    }))}
    caption={<R t="Table 1. The five institutions of the World Bank Group. Source: Authors' compilation from [9] and [10]." />}
  />
);

const row = (id: string, label: string) => ({
  layout: 'centre' as const,
  title: 'Table 1 · The five institutions',
  source: S,
  label,
  centre: table,
  focus: [`t1-${id}`],
  callouts: [{ from: `#t1-${id}-inst`, to: a(id), label }],
});

const p = scene('f1-wbg', [
  {
    title: 'Five institutions, one goal',
    source: 'Section 1.1.2 · pp. 10-11',
    callouts: [{ from: '.k-card .h2', to: a('ibrd'), label: 'IBRD' }],
    body: `The World Bank Group consists of five institutions. Each has its own role, but they work together toward the same goal. The IBRD is the oldest member, founded in {ibrd-founded}, and the largest development bank in the world. Together with IDA, it forms the World Bank in the narrow sense.

The IBRD aims to reduce poverty in middle-income and creditworthy poorer countries, while IDA focuses on the world's poorest countries. IFC and MIGA focus on the private sector; ICSID deals with investment disputes.`,
  },
  row('ibrd', 'IBRD'),
  row('ida', 'IDA'),
  row('ifc', 'IFC'),
  row('miga', 'MIGA'),
  row('icsid', 'ICSID'),
  {
    layout: 'centre',
    title: 'Key differences · IBRD / IDA',
    label: 'IBRD vs IDA',
    source: 'Section 1.1.2 · p. 11',
    centre: table,
    focus: ['t1-ibrd-funds', 't1-ida-funds'],
    callouts: [{ from: '#t1-ida-inst', to: a('ida'), label: 'IDA' }],
    body: `The key difference between the IBRD and IDA lies in the type of borrower and the cost of funds. IBRD loans carry **market-based interest rates**, while IDA offers **much cheaper terms** because it is funded by donors.`,
  },
  {
    layout: 'centre',
    title: 'Key differences · IBRD / IFC',
    label: 'IBRD vs IFC',
    source: 'Section 1.1.2 · p. 11',
    centre: table,
    focus: ['t1-ibrd-clients', 't1-ifc-clients'],
    callouts: [{ from: '#t1-ifc-inst', to: a('ifc'), label: 'IFC' }],
    body: `The IBRD and IFC differ mainly in their clients. The IBRD lends to **governments or to entities guaranteed by governments**, while IFC invests directly in **private companies without a government guarantee**.`,
  },
  {
    layout: 'centre',
    title: 'Key differences · MIGA / ICSID',
    label: 'MIGA and ICSID',
    source: 'Section 1.1.2 · pp. 11-12',
    centre: table,
    focus: ['t1-miga-act', 't1-icsid-act'],
    callouts: [{ from: '#t1-miga-inst', to: a('miga'), label: 'MIGA' }],
    body: `MIGA and ICSID do not provide finance directly. Instead, they reduce risks for investors and help settle disputes, which makes the investment climate more attractive.`,
  },
  {
    title: 'The main public channel',
    source: 'Section 1.1.2 · p. 12',
    callouts: [{ from: '.k-card .h2', to: a('ibrd'), label: 'IBRD' }],
    body: `In this structure, the IBRD acts as **the main channel for public financing to middle-income countries**.

This is why it is especially important for Vietnam today.`,
  },
]);
export const beats = p.beats;
export default p.View;
