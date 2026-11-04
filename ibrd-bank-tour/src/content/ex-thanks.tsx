import type { Beat } from './types';
import { Card } from '../primitives/ScenePanel';
import { COVER } from '../data/cover';

export const beats: Beat[] = [{ label: 'Thank you · the door opens to daylight', source: 'Cover page · p. 1' }];

export default function View() {
  return (
    <div className="thanks">
      <Card tone="dark">
        <div className="kicker">{COVER.group} · {COVER.className}</div>
        <div className="h1 thanks-h">Thank you</div>
        <p className="thanks-p">
          Thank you to our lecturer, <b>{COVER.lecturer}</b>, and to everyone listening.
        </p>
        <ul className="thanks-members">
          {COVER.members.map((m) => (
            <li key={m.id}>
              {m.name} <span>{m.id}</span>
            </li>
          ))}
        </ul>
        <div className="k-source">
          {COVER.university} – {COVER.school} · {COVER.place}
        </div>
      </Card>
    </div>
  );
}
