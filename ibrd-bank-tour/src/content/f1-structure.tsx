import type { Beat } from './types';
import { Card, Title } from '../primitives/ScenePanel';
import { useTour } from '../state/store';
import { R } from './kit';

export const beats: Beat[] = [
  {
    label: 'Three chapters as three floors',
    source: 'Introduction 6 · p. 12',
    callouts: [{ from: '#struct-f1', to: 'anchor:f1-structure:hall', label: 'Floor 1' }],
  },
];

const FLOORS = [
  { id: 'struct-f3', floor: 'Floor 3', label: 'Chapter 3: The IBRD and selected projects in Vietnam', goto: 'f3-ch3-title' },
  { id: 'struct-f2', floor: 'Floor 2', label: 'Chapter 2: How the IBRD supports project financing', goto: 'f2-ch2-title' },
  { id: 'struct-f1', floor: 'Floor 1', label: 'Chapter 1: Overview of the IBRD', goto: 'f1-ch1-title' },
  { id: 'struct-exit', floor: 'Lift down · Exit', label: 'Conclusion and references', goto: 'lift-down' },
];

export default function View() {
  const gotoId = useTour((s) => s.gotoId);
  return (
    <div className="k-card k-left">
      <Card>
        <div className="kicker">Introduction 6</div>
        <Title>Structure of the paper</Title>
        <R t="Besides the Introduction, Conclusion and References, the paper has **three chapters**. Here each chapter is a floor: click one to go there." />
        <div className="floor-stack">
          {FLOORS.map((f) => (
            <button key={f.id} id={f.id} className="floor-btn" onClick={() => gotoId(f.goto)}>
              <b>{f.floor}</b>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
        <div className="k-source">Source · Introduction 6 · p. 12</div>
      </Card>
    </div>
  );
}
