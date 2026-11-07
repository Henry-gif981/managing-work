import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE1 } from '../data/tables';

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

const p = scene('f1-wbg', [
  {
    kicker: 'Section 1.1.2',
    title: 'Five institutions, one goal',
    source: 'Section 1.1.2 · p. 13',
    callouts: [{ from: '.k-card', to: a('ibrd'), label: 'IBRD' }],
    body: `The World Bank Group has **five institutions** working towards one goal. The IBRD, founded in {ibrd-founded}, is the **oldest and the largest development bank**; with IDA it forms the World Bank in the narrow sense.`,
  },
  {
    layout: 'centre',
    kicker: 'Section 1.1.2',
    title: 'Table 1.1.1 · The five institutions',
    label: 'Key differences',
    source: 'Section 1.1.2 · Table 1.1.1 · p. 14',
    centre: table,
    callouts: [{ from: '#t1', to: a('icsid') }],
    aside: (
      <div className="k-keydiff">
        <div className="k-keydiff-h">Key differences</div>
        <ul>
          <li><b>IBRD vs IDA:</b> market-based interest rates vs much cheaper, donor-funded terms.</li>
          <li><b>IBRD vs IFC:</b> governments or government-guaranteed bodies vs private companies without a guarantee.</li>
          <li><b>MIGA and ICSID do not lend:</b> they reduce investors' risks and settle disputes.</li>
        </ul>
        <p className="k-keydiff-f">In this structure, the IBRD is <b>the main channel for public financing to middle-income countries</b>.</p>
      </div>
    ),
  },
]);
export const beats = p.beats;
export default p.View;
