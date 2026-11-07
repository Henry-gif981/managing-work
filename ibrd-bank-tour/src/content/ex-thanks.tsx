import type { Beat } from './types';
import { COVER } from '../data/cover';

export const beats: Beat[] = [{ label: 'Thank you · the door opens to daylight', source: 'Cover page · p. 1' }];

/** Dark navy card (92% opaque), white text, student IDs in light cyan (#47C4EB); same card live and in print. */
export function ThanksCard() {
  return (
    <div className="thanks-card">
      <div className="thanks-h">Thank you for listening</div>
      <div className="thanks-group">
        {COVER.group} · {COVER.className}
      </div>
      <ul className="thanks-members">
        {COVER.members.map((m) => (
          <li key={m.id}>
            <span className="thanks-name">{m.name}</span> <span className="thanks-id">{m.id}</span>
          </li>
        ))}
      </ul>
      <div className="thanks-lect">Lecturer · {COVER.lecturer}</div>
      <div className="thanks-foot">
        {COVER.university} – {COVER.school} · {COVER.place}
      </div>
    </div>
  );
}

export default function View() {
  return (
    <div className="thanks">
      <ThanksCard />
    </div>
  );
}
