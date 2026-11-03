import type { Beat } from './types';
import { Card } from '../primitives/ScenePanel';
import { COVER } from '../data/cover';

export const beats: Beat[] = [{ label: 'Title', source: 'Cover page · p. 1' }];

export default function View() {
  return (
    <div className="k-card k-left" style={{ width: 860 }}>
      <Card className="cover">
        <div className="kicker">
          {COVER.university} – {COVER.school}
        </div>
        <div className="caption" style={{ marginTop: 6 }}>
          {COVER.course}
        </div>
        <div className="h1" style={{ fontSize: 50 }}>
          {COVER.title}
        </div>
        <p className="cover-sub">{COVER.subtitle}</p>
        <div className="cover-grid">
          <b>{COVER.group}</b>
          <ul>
            {COVER.members.map((m) => (
              <li key={m.id}>
                {m.name} – {m.id}
              </li>
            ))}
          </ul>
          <b>Class</b>
          <span>{COVER.className}</span>
          <b>Lecturer</b>
          <span>{COVER.lecturer}</span>
        </div>
        <div className="k-source">
          {COVER.place} · <span className="cover-hint">Press → to enter</span>
        </div>
      </Card>
    </div>
  );
}
