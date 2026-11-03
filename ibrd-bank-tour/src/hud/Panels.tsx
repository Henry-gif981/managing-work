import { useEffect, useMemo, useRef, useState } from 'react';
import { REFERENCES } from '../data/references';
import { NOTES } from '../data/notes';
import { SCENES, SEGMENTS } from '../scenes';
import { beatCount } from '../content';
import { useTour } from '../state/store';

export function ReferencesPanel() {
  const focus = useTour((s) => s.refsFocus);
  const close = useTour((s) => s.openPanel);
  const [q, setQ] = useState('');
  const body = useRef<HTMLDivElement>(null);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return REFERENCES.filter((r) => !t || r.text.toLowerCase().includes(t) || String(r.n) === t);
  }, [q]);
  useEffect(() => {
    if (focus == null) return;
    body.current?.querySelector(`[data-n="${focus}"]`)?.scrollIntoView({ block: 'center' });
  }, [focus, list]);
  return (
    <aside className="panel" aria-label="References">
      <header>
        <h3>References</h3>
        <button onClick={() => close(null)} aria-label="Close">
          ×
        </button>
      </header>
      <input placeholder="Search references…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
      <div className="body" ref={body}>
        {list.length === 0 && <div className="empty">{REFERENCES.length ? 'No match.' : 'The reference list will be added with the content.'}</div>}
        {list.map((r) => (
          <div key={r.n} data-n={r.n} className={'ref' + (r.n === focus ? ' hit' : '')}>
            <b>[{r.n}]</b>
            <span>
              {r.text}
              {r.url && <span className="caption"> {r.url}</span>}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function NotesPanel() {
  const index = useTour((s) => s.index);
  const beat = useTour((s) => s.beat);
  const close = useTour((s) => s.openPanel);
  const s = SCENES[index];
  const n = NOTES[s.id];
  const b = n?.beats?.[beat];
  return (
    <aside className="panel" aria-label="Presenter notes">
      <header>
        <h3>Notes · {s.id}</h3>
        <button onClick={() => close(null)} aria-label="Close">
          ×
        </button>
      </header>
      <div className="body">
        {n?.presenter && <div className="kicker">Presenter: {n.presenter}</div>}
        {!n && <div className="empty">No presenter notes for this scene yet (src/data/notes.ts).</div>}
        {n?.en && <div className="notes-en">{n.en}</div>}
        {b?.en && <div className="notes-en" style={{ marginTop: 14 }}>▸ {b.en}</div>}
        {(n?.vi || b?.vi) && (
          <div className="notes-vi">
            {n?.vi}
            {b?.vi && <div>▸ {b.vi}</div>}
          </div>
        )}
      </div>
    </aside>
  );
}

export function SceneGrid() {
  const index = useTour((s) => s.index);
  const coreOnly = useTour((s) => s.coreOnly);
  const goto = useTour((s) => s.goto);
  return (
    <div className="grid-panel" role="dialog" aria-label="Scene grid">
      <h3>Jump to a scene (G / Esc to close)</h3>
      {SEGMENTS.map((g) => (
        <div className="grid-seg" key={g.id}>
          <h4>{g.label}</h4>
          <div className="grid-row">
            {SCENES.map((s, i) =>
              s.segment !== g.id ? null : (
                <button key={s.id} className={'grid-cell' + (i === index ? ' cur' : '') + (coreOnly && s.optional ? ' dim' : '')} onClick={() => goto(i, 0)}>
                  <small>
                    {i + 1}. {s.id} · {beatCount(s.id)} beats{s.optional ? ' · optional' : ''}
                  </small>
                  {s.title}
                </button>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Panels() {
  const panel = useTour((s) => s.panel);
  if (panel === 'refs') return <ReferencesPanel />;
  if (panel === 'notes') return <NotesPanel />;
  if (panel === 'grid') return <SceneGrid />;
  return null;
}
