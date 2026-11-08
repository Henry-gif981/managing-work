import type { Beat, SceneViewProps } from './types';
import { R, SourceTag } from './kit';
import { useEdits } from '../edit/store';

/**
 * Conclusion, shown on the cabin's glass panel while the lift rides down (patch 7: three beats, one short line each).
 * Display: beat 1 = 3, 2 = 2, 3 = 1. The lift stops at Floor 1; → then goes straight to the exit (scene 58),
 * where the exit door opens to daylight. Limitations and further research were removed (patch 7).
 */
interface Part {
  floor: string;
  kicker: string;
  title: string;
  source: string;
  body: string;
}
export const PARTS: Part[] = [
  {
    floor: '3',
    kicker: 'Conclusion 1.1 · Summary of findings',
    title: 'The three pillars of IBRD support',
    source: 'Conclusion 1.1 · p. 58',
    body: `Finance, technical support and training work as one package.`,
  },
  {
    floor: '2',
    kicker: 'Conclusion 1.2 · Summary of findings',
    title: 'Re-evaluating project impacts',
    source: 'Conclusion 1.2 · p. 58',
    body: `In both cases the binding constraints were domestic, not IBRD money [63; 64].`,
  },
  {
    floor: '1',
    kicker: 'Conclusion 2',
    title: 'Significance of the paper',
    source: 'Conclusion 2 · p. 58',
    body: `One framework, two Vietnamese projects: planned vs actual money, IBRD vs IDA vs counterpart funds.`,
  },
];

export const beats: Beat[] = PARTS.map((p) => ({ label: `${p.floor} · ${p.title}`, source: p.source }));

export default function View({ beat }: SceneViewProps) {
  const bi = Math.min(beat, PARTS.length - 1);
  const edits = useEdits((st) => st.edits);
  const orig = PARTS[bi];
  const p = { ...orig, title: edits[`s:lift-down:${bi}:title`] ?? orig.title, body: edits[`s:lift-down:${bi}:body`] ?? orig.body };
  const long = p.body.length > 700;
  return (
    <div className="glass-panel">
      <div className="card glass enter" key={beat}>
        <div className="glass-head">
          <span className="glass-floor">{p.floor.split(' ')[0]}</span>
          <div>
            <div className="kicker">{p.kicker}</div>
            <div className="h2" data-edit={`s:lift-down:${bi}:title`} data-edit-raw={orig.title} data-edit-label={`Conclusion · part ${bi + 1} · title`}>
              {p.title}
            </div>
          </div>
        </div>
        <div className={long ? 'glass-cols' : ''}>
          <R t={p.body} edit={{ key: `s:lift-down:${bi}:body`, raw: orig.body, label: `Conclusion · part ${bi + 1} · text` }} />
        </div>
        <ol className="glass-steps">
          {PARTS.map((q, i) => (
            <li key={i} className={i === beat ? 'on' : i < beat ? 'done' : ''}>
              <b>{q.floor.split(' ')[0]}</b> {q.title}
            </li>
          ))}
        </ol>
        <SourceTag s={p.source} />
      </div>
    </div>
  );
}
