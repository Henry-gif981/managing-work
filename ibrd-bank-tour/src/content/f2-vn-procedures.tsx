import { scene } from './kit';
import { useFocus } from '../primitives/focus';
import { TABLE4 } from '../data/tables';

const a = (n: string) => `anchor:f2-vn-procedures:${n}`;
function Lane({ id, title, items, tone }: { id: string; title: string; items: string[]; tone: string }) {
  const cls = useFocus(id);
  return (
    <div id={id} className={`lane ${cls}`}>
      <div className="lane-title" style={{ background: tone }}>
        {title}
      </div>
      <div className="lane-steps">
        {items.map((t, i) => (
          <div key={i} className="lane-step">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
function Joint() {
  const cls = useFocus('joint');
  return (
    <div id="joint" className={`lane-joint ${cls}`}>
      <span>Delays often arise at the joint between the two systems</span>
    </div>
  );
}
const diagram = (
  <div className="card lanes" id="lanes">
    <Lane id="lane-wb" title="World Bank project cycle" tone="var(--wb-blue)" items={TABLE4.map((s) => s.stage.replace(/^\d\.\s/, ''))} />
    <Joint />
    <Lane
      id="lane-vn"
      title="Vietnam’s domestic procedures"
      tone="var(--wb-navy)"
      items={['Approval of the project proposal', 'Investment decision', 'Allocation of counterpart funds', 'On-lending agreements (local projects)']}
    />
  </div>
);
const p = scene('f2-vn-procedures', [
  {
    layout: 'centre',
    title: 'Two systems side by side',
    source: 'Section 2.1.1 · p. 22',
    centre: diagram,
    callouts: [{ from: '#lane-vn', to: a('desk'), label: 'Domestic approvals' }],
    body: `In Vietnam, each stage also runs alongside domestic procedures: approval of the project proposal, the investment decision, the allocation of counterpart funds and, for local projects, on-lending agreements (see Section 3.1.4).`,
  },
  {
    layout: 'centre',
    title: 'Where delays arise',
    source: 'Section 2.1.1 · p. 22',
    centre: diagram,
    focus: ['joint'],
    callouts: [{ from: '#joint', to: a('desk'), label: 'Delay' }],
    body: `Delays often arise at the joint between the two systems. **CCSEP**, for example, became effective about **{ccsep-delay|n} months** later than planned (see Section 3.3.3).`,
  },
]);
export const beats = p.beats;
export default p.View;
