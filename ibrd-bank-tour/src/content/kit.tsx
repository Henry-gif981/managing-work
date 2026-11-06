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

/** Render a rich text template. */
export function R({ t, className }: { t: string; className?: string }) {
  const blocks = t.trim().split(/\n\s*\n/);
  return (
    <div className={'rich ' + (className ?? '')}>
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

function SourceTag({ s }: { s: string }) {
  return <div className="k-source">Source · {s}</div>;
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
  }));
  function View({ beat }: SceneViewProps) {
    const s = sceneById(sceneId)!;
    const sl = slides[Math.min(beat, slides.length - 1)];
    const layout = sl.layout ?? 'left';
    const kicker = sl.kicker ?? s.sectionRef;
    if (layout === 'centre') {
      return (
        <div className={'k-centre' + (sl.band === 'right' ? ' k-centre-r' : '')}>
          <div className="k-head">
            <span className="kicker">{kicker}</span>
            <span className="k-title">{sl.title ?? s.title}</span>
          </div>
          {sl.centre}
          {(sl.body || sl.aside) && (
            <div className="card k-caption enter" key={beat}>
              {sl.body && <R t={sl.body} />}
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
            <div className="kicker">{kicker}</div>
            <div className="h1">{sl.title ?? s.title}</div>
            {sl.body && <R t={sl.body} />}
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
            <div className="kicker">{kicker}</div>
            <div className="h2">{sl.title ?? s.title}</div>
            <div className="enter" key={beat}>
              {sl.body && <R t={sl.body} />}
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
