import { scene, R } from './kit';
import { Timeline } from '../primitives/bits';

const tl = (
  <div className="card" style={{ width: 1100 }}>
    <Timeline
      id="resume"
      items={[
        { id: 'oct93', date: 'Oct 1993', label: <R t="World Bank resumes lending with two IDA credits [47]" /> },
        { id: 'y94', date: '1994', label: <R t="Hanoi office opens" /> },
      ]}
    />
  </div>
);
const p = scene('f3-1993', [
  {
    layout: 'centre',
    title: 'Lending resumes in 1993',
    source: 'Section 3.1.1 · p. 30',
    centre: tl,
  },
  {
    title: 'Beyond capital: IDA or IBRD?',
    source: 'Section 3.1.1 · p. 30',
    body: `"World Bank financing" is an umbrella term. The project documents show whether the money is IDA or IBRD.`,
  },
]);
export const beats = p.beats;
export default p.View;
