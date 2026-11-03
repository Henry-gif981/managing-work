import type { Beat } from './types';
import { ScenePanel, Card, Title, Caption } from '../primitives/ScenePanel';

export const beats: Beat[] = [{ label: 'Title' }];

export default function View() {
  return (
    <ScenePanel
      left={
        <Card>
          <div className="kicker">Project Finance · Group 6 · NEU</div>
          <Title level={1}>The IBRD and its development project financing activities in Vietnam</Title>
          <p style={{ margin: '0 0 12px' }}>
            <span className="tbd">TBD</span> presenters, class, lecturer
          </p>
          <Caption>Press → or Space to walk in.</Caption>
        </Card>
      }
    />
  );
}
