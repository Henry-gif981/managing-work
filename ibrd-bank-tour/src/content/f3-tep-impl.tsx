import { scene, R } from './kit';
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
    caption={<R t="Table 13. Selected institutional and digital systems activities under TEP. Source: Authors’ synthesis of [46, Annex 3, Table 3.2, p. 49; 56, pp. 2–3]." />}
  />
);
const ANCH: Record<string, string> = { ams: 'drafting', tariff: 'cash', ifrs: 'drafting', lab: 'transformer', info: 'substation' };
const row = (i: number) => ({
  layout: 'centre' as const,
  title: 'Table 13 · Institutional and digital systems',
  label: TABLE13[i].ws,
  source: 'Section 3.2.3 · Table 13 · p. 40',
  centre: table,
  focus: [`t13-${TABLE13[i].id}`],
  callouts: [{ from: `#t13-${TABLE13[i].id}-ws`, to: a(ANCH[TABLE13[i].id]), label: TABLE13[i].ws.split(' (')[0] }],
});
const p = scene('f3-tep-impl', [
  {
    title: 'Component 3: four strands',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 39',
    callouts: [{ from: '.k-card .h2', to: a('drafting'), label: 'Capacity building' }],
    body: `The third component was meant to strengthen NPT's transition towards a more capable and commercially sustainable transmission utility. At design it comprised {tep-strands|n} strands:

- an **asset management system (AMS)**
- assistance on **cost-reflective transmission tariffs**
- better **financial reporting under IFRS**
- improvements to the **electrical testing laboratory**

The financing and implementation experience was considerably narrower than this list suggests [45; 46; 41].`,
  },
  {
    title: 'What the IBRD actually funded',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 39',
    callouts: [{ from: '.k-card .h2', to: a('drafting'), label: 'AMS' }],
    body: `The IBRD contribution ultimately concentrated on the **AMS**, which became fully operational and informs investment and maintenance decisions by weighing costs, benefits and technical risks.

The tariff, IFRS and laboratory activities were largely carried out with **NPT/EVN resources**; an envisaged upgrade of the operations and equipment information system was **cancelled**, and the metering/data-system activity was funded by the counterpart. These are substantive changes to the original division of responsibilities, not evidence that all activities were completed with IBRD money [46, Annex 3; 56, pp. 2-3].`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  row(4),
  {
    title: 'A learning platform',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 40',
    body: `TEP also served as a learning platform for regional project management boards. IEG's {ieg-field-year} field assessment reported capabilities in procurement, contract administration, financial management, quality assurance, monitoring and reporting, and safeguards.

These gains came partly through TEP and partly through earlier World Bank and other donor operations. The evaluation gives **no training-participant count** and no statistically identified contribution of TEP to staff skills, so reporting an invented number of trainees would be inappropriate [41, pp. ix-x, 15-16].`,
  },
  {
    title: 'Technology transfer: friction and learning',
    kicker: 'Section 3.2.3',
    source: 'Section 3.2.3 · p. 40 (duration: Section 3.2.5 · p. 45)',
    body: `Technology transfer was a significant source of friction as well as learning. The selection of **smart-grid technology**, approval of national technical arrangements and assessment of the implications of temporarily disconnecting substations took much longer than planned (roughly {smartgrid-years}, Section 3.2.5).

IEG concluded that more thorough advance preparation and regulatory coordination would have reduced the need to extend the project [41, pp. x-xi].`,
  },
]);
export const beats = p.beats;
export default p.View;
