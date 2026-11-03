import type { ReactNode } from 'react';
import { useFocus } from './focus';
import { useTour } from '../state/store';

export function Stat({ id, value, unit, label, tone }: { id?: string; value: ReactNode; unit?: ReactNode; label?: ReactNode; tone?: 'good' | 'bad' | 'warn' }) {
  const cls = useFocus(id);
  return (
    <div id={id} className={`stat ${tone ?? ''} ${id ? cls : ''}`}>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {label && <div className="caption">{label}</div>}
    </div>
  );
}

export function Chip({ id, tone, children }: { id?: string; tone?: 'navy' | 'cyan' | 'warn' | 'bad' | 'good'; children: ReactNode }) {
  const cls = useFocus(id);
  return (
    <span id={id} className={`chip ${tone ?? ''} ${id ? cls : ''}`}>
      {children}
    </span>
  );
}

export interface TimelineItem {
  id: string;
  date: ReactNode;
  label: ReactNode;
}
export function Timeline({ id, items }: { id: string; items: TimelineItem[] }) {
  return (
    <div className="timeline" id={id}>
      {items.map((it) => (
        <TlItem key={it.id} id={`${id}-${it.id}`} tid={id} it={it} />
      ))}
    </div>
  );
}
function TlItem({ id, tid, it }: { id: string; tid: string; it: TimelineItem }) {
  const cls = useFocus(id, tid);
  return (
    <div id={id} className={`tl-item ${cls}`}>
      <div className="tl-date">{it.date}</div>
      <div className="tl-label">{it.label}</div>
    </div>
  );
}

/** Footnote for inconsistencies or caveats in the paper. */
export function Note({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="note" id={id}>
      <b>Note · </b>
      {children}
    </div>
  );
}

/** Superscript citation [n]; opens the references panel at entry n. */
export function Cite({ n }: { n: number | number[] }) {
  const open = useTour((s) => s.openRef);
  const list = Array.isArray(n) ? n : [n];
  return (
    <button className="cite" onClick={() => open(list[0])} title="Open reference">
      [{list.join('; ')}]
    </button>
  );
}
