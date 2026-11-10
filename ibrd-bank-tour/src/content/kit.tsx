/**
 * Content kit: rich-text templates + standard beat layouts used by the scene modules.
 *
 * Rich text template syntax (see R):
 *   {fact-id}      -> fact value with unit (src/data/facts.ts)      {fact-id|n} -> value only, {fact-id|2} -> value with 2 decimals
 *   [3] [1; 2]     -> <Cite> superscripts (opens the references panel)  [63, p. iii; 64, p. 18] keeps the page text
 *   **bold**       -> emphasis
 *   blank line     -> new paragraph;  lines "- x" -> bullet list;  lines "1. x" -> numbered list
 */
import { Fragment, type ReactNode } from 'react';
import type { Beat, SceneViewProps } from './types';
import { sceneById } from '../scenes';
import { F } from '../primitives/Fact';
import { Cite } from '../primitives/bits';
import { useFocus } from '../primitives/focus';
import { WAYPOINTS } from '../camera/waypoints';
import { SHOW_SOURCE_TAGS } from '../config';
import { useEdits } from '../edit/store';

const TOKEN = /(\{[a-z0-9.-]+(?:\|(?:n|\d))?\}|\[\d[^\]]*\]|\*\*[^*]+\*\*)/g;

function inline(text: string, key = ''): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const k = `${key}-${i}`;
    if (!part) return null;
    if (part.startsWith('{')) {
      const [id, mod] = part.slice(1, -1).split('|');
      if (mod && /^\d$/.test(mod)) return <F key={k} id={id} fixed={Number(mod)} />;
      return <F key={k} id={id} unit={mod !== 'n'} />;
    }
    if (part.startsWith('[')) {
      const label = part.slice(1, -1);
      const nums = label.split(';').map((x) => parseInt(x, 10)).filter((x) => !Number.isNaN(x));
      return <Cite key={k} n={nums} label={/[a-z]/i.test(label) ? label : undefined} />;
    }
    if (part.startsWith('**')) return <b key={k}>{inline(part.slice(2, -2), k)}</b>;
    return <Fragment key={k}>{part}</Fragment>;
  });
}

/** Render a rich text template. `edit` makes it editable in edit mode (key, original template, label). */
export function R({ t, className, edit }: { t: string; className?: string; edit?: { key: string; raw: string; label?: string } }) {
  const blocks = t.trim().split(/\n\s*\n/);
  return (
    <div className={'rich ' + (className ?? '')} data-edit={edit?.key} data-edit-raw={edit?.raw} data-edit-label={edit?.label}>
      {blocks.map((b, i) => {
        const lines = b.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.every((l) => l.startsWith('- ')))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2), `${i}.${j}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\.\s/.test(l)))
          return (
            <ol key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\.\s/, ''), `${i}.${j}`)}</li>
              ))}
            </ol>
          );
        return <p key={i}>{inline(lines.join(' '), String(i))}</p>;
      })}
    </div>
  );
}

/** Count body words of a template (facts/cites count as one word). */
export function wordCount(t?: string) {
  if (!t) return 0;
  return t
    .replace(/\[\d[^\]]*\]/g, '')
    .replace(/[*{}|]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

export type Layout = 'left' | 'right' | 'centre' | 'title';

export interface Slide extends Beat {
  /** "Section 1.3.2 · p. 14" */
  source: string;
  layout?: Layout;
  kicker?: string;
  title?: string;
  /** rich text template, at most ~90 words */
  body?: string;
  /** extra node under the body (stats, chips, list, small chart) */
  aside?: ReactNode;
  /** centre element for layout 'centre' (table / chart / diagram). Reuse the same element across beats to keep it mounted. */
  centre?: ReactNode;
  /** optional node in the opposite side zone */
  side?: ReactNode;
  /** for layout 'centre': which side keeps the 400 px band free for the 3D prop (default 'left') */
  band?: 'left' | 'right';
}

/** Source tag under a card; rendered only when SHOW_SOURCE_TAGS is on (?tags=1). */
export function SourceTag({ s }: { s: string }) {
  return SHOW_SOURCE_TAGS ? <div className="k-source">Source · {s}</div> : null;
}

/** A slide with the browser edits (edit mode) applied to its title, kicker and body. */
export function editedSlide(sceneId: string, i: number, sl: Slide, edits: Record<string, string>): Slide {
  const k = `s:${sceneId}:${i}:`;
  if (!(k + 'title' in edits) && !(k + 'kicker' in edits) && !(k + 'body' in edits)) return sl;
  return { ...sl, title: edits[k + 'title'] ?? sl.title, kicker: edits[k + 'kicker'] ?? sl.kicker, body: edits[k + 'body'] ?? sl.body };
}

/** Build a scene's { beats, View } from slides. */
export function scene(sceneId: string, slides: Slide[]) {
  // table / chart beats use the scene's "-table" waypoint when it exists (props framed beside the table)
  const tableCam = WAYPOINTS[`${sceneId}-table`] ? `${sceneId}-table` : undefined;
  // otherwise: a per-prop waypoint "<floor>-prop[R]-<anchor name>" framing the prop of the beat's first callout
  const floor = sceneId.split('-')[0];
  const propCam = (sl: Slide) => {
    const name = sl.callouts?.[0]?.to.split(':').pop();
    const id = name && `${floor}-prop${sl.band === 'right' ? 'R' : ''}-${name}`;
    return id && WAYPOINTS[id] ? id : undefined;
  };
  const beats: Beat[] = slides.map((sl) => ({
    label: sl.label ?? sl.title,
    focus: sl.focus,
    callouts: sl.callouts,
    camera: sl.camera ?? (sl.layout === 'centre' ? tableCam ?? propCam(sl) : undefined),
    source: sl.source,
    detail: sl.detail,
  }));
  function View({ beat }: SceneViewProps) {
    const s = sceneById(sceneId)!;
    const bi = Math.min(beat, slides.length - 1);
    const edits = useEdits((st) => st.edits);
    const sl = editedSlide(sceneId, bi, slides[bi], edits);
    const ed = (field: 'title' | 'kicker' | 'body', raw: string) => ({ 'data-edit': `s:${sceneId}:${bi}:${field}`, 'data-edit-raw': raw, 'data-edit-label': `${sceneId} · beat ${bi + 1} · ${field}` });
    const orig = slides[bi];
    const edKey = (field: 'body') => ({ key: `s:${sceneId}:${bi}:${field}`, raw: orig.body ?? '', label: `${sceneId} · beat ${bi + 1} · text` });
    const layout = sl.layout ?? 'left';
    const kicker = sl.kicker ?? s.sectionRef;
    if (layout === 'centre') {
      return (
        <div className={'k-centre' + (sl.band === 'right' ? ' k-centre-r' : '')}>
          <div className="k-head">
            <span className="kicker" {...ed('kicker', orig.kicker ?? s.sectionRef)}>{kicker}</span>
            <span className="k-title" {...ed('title', orig.title ?? s.title)}>{sl.title ?? s.title}</span>
          </div>
          {sl.centre}
          {(sl.body || sl.aside) && (
            <div className="card k-caption enter" key={beat}>
              {sl.body && <R t={sl.body} edit={edKey('body')} />}
              {sl.aside}
              <SourceTag s={sl.source} />
            </div>
          )}
          {!sl.body && !sl.aside && <SourceTag s={sl.source} />}
        </div>
      );
    }
    if (layout === 'title') {
      return (
        <div className="k-titlecard">
          <div className="card dark enter" key={beat}>
            <div className="kicker" {...ed('kicker', orig.kicker ?? s.sectionRef)}>{kicker}</div>
            <div className="h1" {...ed('title', orig.title ?? s.title)}>{sl.title ?? s.title}</div>
            {sl.body && <R t={sl.body} edit={edKey('body')} />}
            {sl.aside}
            <SourceTag s={sl.source} />
          </div>
        </div>
      );
    }
    return (
      <>
        <div className={`k-card k-${layout}`}>
          <div className="card">
            <div className="kicker" {...ed('kicker', orig.kicker ?? s.sectionRef)}>{kicker}</div>
            <div className="h2" {...ed('title', orig.title ?? s.title)}>{sl.title ?? s.title}</div>
            <div className="enter" key={beat}>
              {sl.body && <R t={sl.body} edit={edKey('body')} />}
              {sl.aside}
            </div>
            <SourceTag s={sl.source} />
          </div>
        </div>
        {sl.side && <div className={`k-side k-side-${layout === 'left' ? 'right' : 'left'} enter`}>{sl.side}</div>}
      </>
    );
  }
  // the print view lays all slides of a scene out on one page
  (View as unknown as { slides: Slide[] }).slides = slides;
  return { beats, View };
}

/** Mark slides as "detail": out of the main flow, kept for Details mode (key V). */
export const detail = (...slides: Slide[]): Slide[] => slides.map((sl) => ({ ...sl, detail: true }));

/** Keep only the first slide in the main flow; the others become detail slides (Details mode, key V). */
export const firstOnly = (slides: Slide[]): Slide[] => [slides[0], ...detail(...slides.slice(1))];

/** Keep only the given beats (1-based) in the main flow; the others become detail slides (key V). */
export const keepBeats = (keep: number[], slides: Slide[]): Slide[] => slides.map((sl, i) => (keep.includes(i + 1) ? sl : { ...sl, detail: true }));

/** A list item that can be focused by id (e.g. the ten ESSs). */
export function FocusItem({ id, children }: { id: string; children: ReactNode }) {
  const cls = useFocus(id);
  return (
    <li id={id} className={cls}>
      {children}
    </li>
  );
}

/** Small proportional (100%) bar: parts sum to 100. */
export function ProportionBar({ id, parts }: { id: string; parts: { id: string; label: ReactNode; value: number; color: string; text?: string }[] }) {
  return (
    <div className="pbar" id={id}>
      <div className="pbar-track">
        {parts.map((p, i) => (
          <PBarPart key={p.id} p={p} delay={i * 0.15} />
        ))}
      </div>
    </div>
  );
}
function PBarPart({ p, delay }: { p: { id: string; label: ReactNode; value: number; color: string; text?: string }; delay: number }) {
  const cls = useFocus(p.id);
  return (
    <div id={p.id} className={`pbar-part ${cls}`} style={{ flexGrow: p.value, background: p.color, color: p.text ?? 'var(--page)', animationDelay: `${delay}s` }}>
      <b>{p.value}%</b>
      <span>{p.label}</span>
    </div>
  );
}

/** A grid of hero numbers. */
export function StatRow({ children }: { children: ReactNode }) {
  return <div className="k-stats">{children}</div>;
}
