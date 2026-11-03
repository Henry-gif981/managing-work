import type { Beat, SceneViewProps } from './types';
import { sceneById } from '../scenes';
import { ScenePanel, Card, Title, Caption } from '../primitives/ScenePanel';

/** Placeholder content: title, section ref and "TBD" per beat. Replace per scene later. */
export function makePlaceholder(sceneId: string, n = 3, zone: 'left' | 'right' | 'centre' = 'left') {
  const beats: Beat[] = Array.from({ length: n }, (_, i) => ({ label: `Beat ${i + 1} · TBD` }));
  function View({ beat }: SceneViewProps) {
    const s = sceneById(sceneId)!;
    const card = (
      <Card>
        <Title kicker={s.sectionRef}>{s.title}</Title>
        <p style={{ margin: 0 }}>
          <span className="tbd">TBD</span>
        </p>
        {n > 0 && (
          <ul className="beat-list">
            {beats.map((b, i) => (
              <li key={i} className={i === beat ? 'on' : ''}>
                {b.label}
              </li>
            ))}
          </ul>
        )}
        <Caption>Content for {s.id} will be added from the paper.</Caption>
      </Card>
    );
    return <ScenePanel {...{ [zone]: card }} />;
  }
  return { beats, View };
}
