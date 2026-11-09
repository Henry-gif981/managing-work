import { scene, FocusItem, R, detail } from './kit';
import { Chip } from '../primitives/bits';
import { F } from '../primitives/Fact';

const a = (n: string) => `anchor:f3-tep-assess:${n}`;
const DOORS = [
  { id: 'rel', name: 'Relevance', text: 'A sovereign IBRD investment loan combining high-voltage capital expenditure with technology modernization and targeted institutional development (3.2.6), aimed at capacity, efficiency and reliability (3.2.1).' },
  { id: 'eff', name: 'Effectiveness', text: 'Strongest achievements in physical outputs and improved operating indicators (3.2.6); outcome rated highly satisfactory because the principal objectives were substantially achieved (3.2.5).' },
  { id: 'efc', name: 'Efficiency', text: 'A useful reduction in measured capital costs versus the appraisal budget (3.2.6), weighed against the lengthy smart-grid preparation and the large gap between commitment and disbursement.' },
  { id: 'sus', name: 'Sustainability', text: 'Capacity-building costs concentrated on the counterpart side; continuing sector-wide network constraints; dependence on tariffs and timely investment (3.2.5-3.2.6).' },
];
const doors = (
  <div className="doors" id="doors">
    <ol className="door-list">
      {DOORS.map((d) => (
        <FocusItem key={d.id} id={`door-${d.id}`}>
          <div className="door-name">{d.name}</div>
          <div className="door-text">{d.text}</div>
        </FocusItem>
      ))}
    </ol>
    <div className="card door-ratings">
      <div className="kicker">
        TEP · IEG PPAR ratings <R t="[41]" />
      </div>
      <div className="chips">
        <Chip tone="good">
          Outcome: <F id="tep-ppar-outcome" />
        </Chip>
        <Chip tone="good">
          Bank performance: <F id="tep-ppar-bank" />
        </Chip>
        <Chip tone="navy">
          M&E quality: <F id="tep-ppar-me" />
        </Chip>
      </div>
    </div>
  </div>
);
const door = (i: number) => ({
  layout: 'centre' as const,
  title: 'Four criteria',
  label: DOORS[i].name,
  source: 'Sections 3.2.1-3.2.6 · pp. 33-43; ratings Section 2.2.3 · p. 25',
  centre: doors,
  focus: [`door-${DOORS[i].id}`],
  callouts: [{ from: `#door-${DOORS[i].id}`, to: a(['transformer', 'transformer', 'cash', 'gauge'][i]), label: DOORS[i].name }],
});
const p = scene('f3-tep-assess', [
  {
    title: 'What TEP shows',
    kicker: 'Section 3.2.6',
    source: 'Section 3.2.6 · p. 43',
    callouts: [{ from: '.k-card .h2', to: a('transformer'), label: 'Strengths' }],
    body: `TEP demonstrates how IBRD financing combined infrastructure investment, technological modernization and institutional development [41].`,
  },
  // criteria detail (Full content: Details mode, key V)
  ...detail({
    title: 'Weighed against',
    kicker: 'Section 3.2.6',
    source: 'Section 3.2.6 · p. 43',
    body: `These strengths should be weighed against:

- the lengthy **smart-grid preparation** process
- the large difference between **loan commitment and final disbursement**
- the concentration of **capacity-building costs on the counterpart side**
- continuing **sector-wide network constraints**`,
  }, ...DOORS.map((_, i) => door(i))),
  {
    layout: 'centre',
    title: 'IEG Ratings',
    label: 'IEG Ratings',
    source: 'Section 2.2.3 · p. 25; Section 3.2.5 · p. 42',
    centre: doors,
    body: `Overall, the Independent Evaluation Group rated the project's outcome as Highly Satisfactory, reflecting its strong achievements despite implementation challenges [41].`,
  },
  ...detail({
    title: 'Three conclusions',
    kicker: 'Section 3.2.6',
    source: 'Section 3.2.6 · p. 43',
    body: `For the research question, {tep-conclusions|n} conclusions follow:

1. IBRD participation **existed alongside IDA before the 2017 graduation** and cannot be treated as a purely post-IDA arrangement.
2. The financing mechanism should be evaluated using **both approved and disbursed funds**, with borrower expenditure shown separately.
3. Successful outputs do **not** establish that all later improvements in Vietnam's transmission system, or the integration of a specific quantity of renewable generation, were caused by TEP.`,
  }),
  {
    title: 'Towards the Second Case',
    kicker: 'Section 3.2.6',
    source: 'Section 3.2.6 · p. 43',
    callouts: [{ from: '.k-card .h2', to: 'anchor:f3-tep-assess:ccsep', label: 'CCSEP' }],
    body: `Now, let's continue our museum tour with the Coastal Cities Sustainable Environment Project, which applied a different financing structure in the urban and environmental sector.`,
  },
]);
export const beats = p.beats;
export default p.View;
