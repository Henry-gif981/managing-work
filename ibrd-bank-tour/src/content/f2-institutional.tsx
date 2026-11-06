import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE6 } from '../data/tables';

const a = (n: string) => `anchor:f2-institutional:${n}`;
const table = (
  <DataTable
    id="t6"
    width={1400}
    columns={[
      { key: 'area', label: 'Reform area', width: 250 },
      { key: 'activity', label: 'Typical activity' },
      { key: 'purpose', label: 'Purpose' },
    ]}
    rows={TABLE6.map((r) => ({ id: r.id, cells: { area: <b>{r.area}</b>, activity: r.activity, purpose: r.purpose } }))}
    caption={<R t="Table 2.3.1. Typical institutional reform activities in IBRD-financed projects. Source: Authors' compilation from [36; 41; 46; 58]." />}
  />
);
const PROP: Record<string, string> = { asset: 'tep-asset', pricing: 'tep-tariff', reporting: 'ccsep-tariff', delivery: 'ccsep-psmu' };
const row = (i: number) => ({
  layout: 'centre' as const,
  kicker: 'Section 2.3.3',
  title: 'Table 2.3.1 · Typical institutional reforms',
  label: TABLE6[i].area,
  source: 'Section 2.3.3 · Table 2.3.1 · p. 27',
  centre: table,
  camera: `f2-institutional-${PROP[TABLE6[i].id]}`,
  focus: [`t6-${TABLE6[i].id}`],
  callouts: [{ from: `#t6-${TABLE6[i].id}`, to: a(PROP[TABLE6[i].id]), label: TABLE6[i].area }],
});
const p = scene('f2-institutional', [
  {
    title: 'Changing how institutions run',
    kicker: 'Section 2.3.3',
    source: 'Section 2.3.3 · p. 27',
    callouts: [{ from: '.k-card', to: a('ccsep-psmu'), label: 'Institutions' }],
    body: `The third level targets **institutions rather than individuals**: IBRD projects include components that change how a **sector agency or utility** is run.`,
  },
  ...TABLE6.map((_, i) => row(i)),
  {
    title: 'The same goal at national level',
    kicker: 'Section 2.3.3',
    source: 'Section 2.3.3 · p. 27',
    body: `**Development Policy Financing (DPF)** pursues the same goal nationally: the **Public Investment Reform** series strengthened how public investment projects are selected and implemented [2].`,
  },
  {
    title: 'The borrower must sustain it',
    kicker: 'Section 2.3.3',
    source: 'Section 2.3.3 · p. 28',
    callouts: [{ from: '.k-card', to: a('ccsep-contracts'), label: 'Reforms' }],
    body: `In two IBRD-supported projects in Vietnam, almost all of the capacity-building and reform work was paid for from **counterpart funds**, and some reforms, such as performance-based service contracts, took effect only late in the project [46; 63]. **The IBRD can design and advise on reform, but the borrower must fund and sustain it.**`,
  },
]);
export const beats = p.beats;
export default p.View;
