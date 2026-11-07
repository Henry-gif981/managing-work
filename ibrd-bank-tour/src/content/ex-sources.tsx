import { useMemo, useState } from 'react';
import { SourceTag } from './kit';
import type { Beat, SceneViewProps } from './types';
import { REFERENCES } from '../data/references';
import { Card, Title } from '../primitives/ScenePanel';
import { useTour } from '../state/store';

export const beats: Beat[] = [{ label: 'Reference wall', source: 'References · pp. 60-66' }];

/** Reference wall: all 64 entries, scrollable and searchable (same data as the R panel). */
export default function View({ print }: SceneViewProps) {
  const [q, setQ] = useState('');
  const openRef = useTour((s) => s.openRef);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return REFERENCES.filter((r) => !t || r.text.toLowerCase().includes(t) || String(r.n) === t || (r.url ?? '').toLowerCase().includes(t));
  }, [q]);
  return (
    <div className="k-card k-right refwall">
      <Card>
        <Title kicker="References">Sources · {REFERENCES.length} references</Title>
        {print ? (
          <p className="caption">All {REFERENCES.length} references are printed in full on the reference pages at the end of this document.</p>
        ) : (
          <input className="refwall-search" placeholder="Search author, year, title, decree…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
        )}
        <ol className="refwall-list">
          {(print ? REFERENCES.slice(0, 5) : list).map((r) => (
            <li key={r.n}>
              <button onClick={() => openRef(r.n)} title="Open in the references panel">
                [{r.n}]
              </button>{' '}
              {r.text}
            </li>
          ))}
          {!print && list.length === 0 && <li className="caption">No match.</li>}
        </ol>
        <SourceTag s={'References · pp. 60-66'} />
      </Card>
    </div>
  );
}
