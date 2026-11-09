import { scene, R, detail } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE13 } from '../data/tables';

const a = (n: string) => `anchor:f3-tep-impl:${n}`;
const table = (
  <DataTable
    id="t13"
    width={1300}
    columns={[
      { key: 'ws', label: 'Workstream', width: 380 },
      { key: 'purpose', label: 'Original purpose' },
      { key: 'pos', label: 'Position by project closing' },
    ]}
    rows={TABLE13.map((r) => ({ id: r.id, cells: { ws: <b>{r.ws}</b>, purpose: r.purpose, pos: <R t={r.pos} /> } }))}
    caption={<R t="Table 3.2.4. Selected institutional and digital systems activities under TEP. Source: Authors’ synthesis of [46, Annex 3, Table 3.2, p. 49; 56, pp. 2–3]." />}
  />
);
const ANCH: Record<string, string> = { ams: 'drafting', tariff: 'cash', ifrs: 'drafting', lab: 'transformer', info: 'substation' };
const row = (i: number, body?: string) => ({
  layout: 'centre' as const,
  title: 'Table 3.2.4 · Institutional and digital systems',
  label: TABLE13[i].ws,
  source: 'Section 3.2.3 · Table 3.2.4 · p. 37',
  centre: table,
  focus: [`t13-${TABLE13[i].id}`],
  callouts: [{ from: `#t13-${TABLE13[i].id}-ws`, to: a(ANCH[TABLE13[i].id]), label: TABLE13[i].ws.split(' (')[0] }],
  body,
});
const p = scene('f3-tep-impl', [
  {
    title: 'Component 3: Four Strands',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 37',
    callouts: [{ from: '.k-card .h2', to: a('drafting'), label: 'Capacity building' }],
    body: `The capacity-building component focused on four areas: asset management, transmission tariffs, financial reporting and laboratory improvements [45; 46; 41].`,
  },
  {
    title: 'What the IBRD Actually Funded',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 37',
    callouts: [{ from: '.k-card .h2', to: a('drafting'), label: 'AMS' }],
    body: `However, IBRD financing was mainly concentrated on the Asset Management System, or AMS. Other institutional activities were largely financed by NPT and EVN [46, Annex 3; 56, pp. 2-3].`,
  },
  row(0, `The AMS became operational and helped NPT improve maintenance planning, investment decisions and asset management [46, Annex 3].`),
  // tariff, IFRS, laboratory and information-system rows: already named in beat 1; Table 3.2.4 stays in Details
  ...detail(row(1), row(2), row(3), row(4)),
  {
    title: 'A Learning Platform',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 38',
    body: `The project also strengthened NPT's experience in procurement, contract management, monitoring and environmental safeguards [41, pp. ix-x, 15-16].`,
  },
  // technology-transfer difficulties are explained in scene 45 (challenges): detail beat
  ...detail({
    title: 'Technology transfer: friction and learning',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 38 (duration: Section 3.2.5 · p. 42)',
    body: `Technology transfer was a significant source of friction as well as learning. The selection of **smart-grid technology**, approval of national technical arrangements and assessment of the implications of temporarily disconnecting substations took much longer than planned (roughly {smartgrid-years}, Section 3.2.5).

IEG concluded that more thorough advance preparation and regulatory coordination would have reduced the need to extend the project [41, pp. x-xi].`,
  }),
]);
export const beats = p.beats;
export default p.View;
