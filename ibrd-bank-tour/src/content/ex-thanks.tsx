import type { Beat } from './types';
import { ScenePanel, Card, Title, Caption } from '../primitives/ScenePanel';

export const beats: Beat[] = [{ label: 'Doors open to daylight' }];

export default function View() {
  return (
    <ScenePanel
      bottom={
        <Card tone="dark">
          <Title level={1}>Thank you</Title>
          <Caption>
            <span className="tbd">TBD</span> Group 6 · Questions welcome
          </Caption>
        </Card>
      }
    />
  );
}
