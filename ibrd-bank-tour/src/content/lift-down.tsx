import type { Beat, SceneViewProps } from './types';
import { ScenePanel, Card, Title, Caption } from '../primitives/ScenePanel';

// Conclusion, shown on the cabin's glass panel while the lift rides down 3 -> 2 -> 1 -> G.
export const beats: Beat[] = [
  { label: 'Floor 3 · Summary of findings: the three pillars (Conclusion 1.1)' },
  { label: 'Floor 2 · Re-evaluating project impacts (Conclusion 1.2)' },
  { label: 'Floor 1 · Significance of the paper (Conclusion 2)' },
  { label: 'G · Limitations of the research (Conclusion 3)' },
  { label: 'Doors open · Directions for further research (Conclusion 4)' },
];

export default function View({ beat }: SceneViewProps) {
  return (
    <ScenePanel
      animKey={beat}
      right={
        <Card tone="glass">
          <Title kicker="Conclusion">{(beats[beat]?.label ?? '').split(' · ').slice(1).join(' · ')}</Title>
          <p style={{ margin: 0 }}>
            <span className="tbd">TBD</span>
          </p>
          <ul className="beat-list">
            {beats.map((b, i) => (
              <li key={i} className={i === beat ? 'on' : ''}>
                {(b.label ?? '').split(' · ')[0]}
              </li>
            ))}
          </ul>
          <Caption>Lift display counts down one floor per beat.</Caption>
        </Card>
      }
    />
  );
}
