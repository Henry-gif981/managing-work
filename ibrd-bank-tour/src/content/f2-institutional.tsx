import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { TABLE6 } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f2-institutional:${n}`;
const table = (
  <DataTable
    id="t6"
    width={1400}
    columns={[
      { key: 'project', label: 'Project', width: 140 },
      { key: 'activity', label: 'Reform activity' },
      { key: 'position', label: 'Position at the latest report' },
    ]}
    rows={TABLE6.map((r) => ({ id: r.id, cells: { project: <b>{r.project}</b>, activity: r.activity, position: <R t={r.position} /> } }))}
    caption={<R t="Table 6. Institutional reform activities in the two case studies. Source: Authors' synthesis of Sections 3.2.3, 3.3.3 and 3.3.4." />}
  />
);
const row = (i: number) => ({
  layout: 'centre' as const,
  title: 'Table 6 · Institutional reform',
  label: `${TABLE6[i].project}: ${TABLE6[i].activity}`,
  source: 'Section 2.3.3 · Table 6 · p. 28',
  centre: table,
  camera: `f2-institutional-${TABLE6[i].id}`,
  focus: [`t6-${TABLE6[i].id}`],
  callouts: [{ from: `#t6-${TABLE6[i].id}-project`, to: a(TABLE6[i].id), label: TABLE6[i].activity.split(',')[0] }],
});
const cb = (
  <Chart
    id="c-cb"
    kind="bar"
    width={600}
    height={380}
    categories={['NPT', 'IBRD']}
    series={[{ name: 'TEP capacity building, actual cost', values: [factValue('tep-cb-npt'), factValue('tep-cb-ibrd')], color: 'var(--series-2)' }]}
    max={6}
    format={(v) => v.toFixed(2)}
    caption={<R t="TEP capacity-building component, actual cost {tep-cb-actual} (US$ million)." />}
  />
);
const p = scene('f2-institutional', [
  {
    title: 'Changing how institutions run',
    source: 'Section 2.3.3 · p. 28',
    callouts: [{ from: '.k-card .h2', to: a('ccsep-psmu'), label: 'Institutions' }],
    body: `The third level targets **institutions rather than individuals**. Here, IBRD projects include components that change how a sector agency or utility is run.`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  row(4),
  {
    title: 'The same goal at national level',
    source: 'Section 2.3.3 · p. 28',
    body: `**Development Policy Financing** pursues the same goal at national level. The Public Investment Reform series, for example, supported measures to strengthen how public investment projects are selected and implemented [2].`,
  },
  {
    title: 'Who pays for reform',
    source: 'Section 2.3.3 · pp. 28-29',
    side: cb,
    camera: 'f2-institutional-cb',
    focus: ['c-cb-c0'],
    callouts: [{ from: '#c-cb-0-0', to: a('tep-asset'), label: 'NPT' }],
    body: `Institutional reform depends heavily on the **borrower's own commitment**. In TEP, {tep-cb-npt} of the capacity-building component's {tep-cb-actual} actual cost came from NPT, and only {tep-cb-ibrd} from the IBRD (see Section 3.2.2).`,
  },
  {
    title: 'The borrower must sustain it',
    source: 'Section 2.3.3 · p. 29',
    callouts: [{ from: '.k-card .h2', to: a('ccsep-contracts'), label: 'Service contracts' }],
    body: `In CCSEP, the whole of **Component {ccsep-component-4|n}** was financed by counterpart funds, and several reforms, such as performance-based service contracts, took effect only late in the project (see Sections 3.3.3 and 3.3.4).

**The IBRD can design and advise on reform, but the borrower must fund and sustain it.**`,
  },
]);
export const beats = p.beats;
export default p.View;
