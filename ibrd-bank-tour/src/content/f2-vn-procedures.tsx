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
const diagram = (
  <div className="card lanes" id="lanes">
    <Lane id="lane-wb" title="World Bank project cycle" tone="var(--wb-blue)" items={TABLE4.map((s) => s.stage.replace(/^\d\.\s/, ''))} />
    <div id="joint" className="lane-joint">
      <span>Delays often arise where the two systems meet</span>
    </div>
    <Lane
      id="lane-vn"
      title="Vietnam's domestic procedures"
      tone="var(--wb-navy)"
      items={['Approval of the project proposal', 'Investment decision', 'Allocation of counterpart funds', 'On-lending agreements (local projects)']}
    />
  </div>
);
const p = scene('f2-vn-procedures', [
  {
    layout: 'centre',
    kicker: 'Section 2.1.1',
    title: 'Two systems side by side',
    source: 'Section 2.1.1 · p. 23',
    centre: diagram,
    callouts: [{ from: '#lane-vn', to: a('desk'), label: 'Domestic approvals' }],
  },
]);
export const beats = p.beats;
export default p.View;
