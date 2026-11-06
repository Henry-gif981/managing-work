import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { SCENES, SEGMENTS } from '../scenes';
import { CONTENT } from '../content';
import { FocusContext } from '../primitives/focus';
import { LiteBackdrop, liteSetOf } from '../lite/LiteBackdrop';
import { REFERENCES } from '../data/references';
import { COVER } from '../data/cover';
import { R, type Slide } from '../content/kit';
import type { CalloutSpec } from '../content/types';

/**
 * ?print=1 (update part 6): cover (ext-facade), contents, ONE page per scene, references.
 * - Background: the scene's 3D render (src/assets/print-bg/<id>.jpg, made by `npm run capture-bg`);
 *   falls back to the lite illustration only if an image is missing.
 * - Every beat of the scene at once: shared tables/charts/diagrams ("exhibits") once, then one card per beat.
 * - Callouts become numbered pins: a badge on the related row/element and a legend naming the 3D prop.
 * - A scene that does not fit is split over more pages; the split is logged in window.__printOverflow.
 */
const BG = import.meta.glob('../assets/print-bg/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
const bgOf = (id: string) => BG[`../assets/print-bg/${id}.jpg`];

const REFS_PER_PAGE = 16;
const NO_FOCUS = new Set<string>();
const pretty = (anchor: string) => anchor.split(':').pop()!.replace(/-/g, ' ');

type ScenePage = { kind: 'scene'; scene: number; part: number; parts: number };
type Page = { kind: 'cover' } | { kind: 'toc' } | ScenePage | { kind: 'refs'; from: number; to: number };

const printable = SCENES.map((s, i) => ({ s, i })).filter(({ s }) => s.id !== 'ext-facade' && (CONTENT[s.id]?.beats.length ?? 0) > 0);

function slidesOf(id: string): Slide[] | null {
  const v = CONTENT[id]?.View as unknown as { slides?: Slide[] };
  return v?.slides ?? null;
}

/** Split a scene's slides into `parts` consecutive groups. */
function chunk<T>(a: T[], parts: number, k: number): T[] {
  const n = Math.ceil(a.length / parts);
  return a.slice(k * n, (k + 1) * n);
}

function Pin({ n }: { n: number }) {
  return <span className="ppin">{n}</span>;
}

/** Adds pin badges next to the elements the callouts start from (table rows, chart bars, chips...). */
function usePinBadges(root: React.RefObject<HTMLElement | null>, pins: { n: number; spec: CalloutSpec }[]) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const added: HTMLElement[] = [];
    for (const { n, spec } of pins) {
      if (spec.from.startsWith('.k-')) continue; // card-level callouts: the pin sits on the beat card title
      const el = page.querySelector(spec.from) as HTMLElement | null;
      if (!el) continue;
      const target = (el.tagName === 'TR' ? el.querySelector('td, th') : el) as HTMLElement | null;
      if (!target || target.querySelector(`.ppin[data-n="${n}"]`)) continue;
      const b = document.createElement('span');
      b.className = 'ppin';
      b.dataset.n = String(n);
      b.textContent = String(n);
      if (target instanceof SVGElement) continue;
      target.prepend(b);
      added.push(b);
    }
    return () => added.forEach((b) => b.remove());
  }, [root, pins]);
}

function SceneSheet({ p, n, total, onOverflow }: { p: ScenePage; n: number; total: number; onOverflow: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const s = SCENES[p.scene];
  const c = CONTENT[s.id];
  const slides = slidesOf(s.id);
  // numbered pins across the whole scene (stable numbering across split pages)
  const allPins: { n: number; spec: CalloutSpec; slide: number }[] = [];
  let k = 0;
  if (slides) slides.forEach((sl, i) => sl.callouts?.forEach((spec) => allPins.push({ n: ++k, spec, slide: i })));
  else c.beats.forEach((b, i) => b.callouts?.forEach((spec) => allPins.push({ n: ++k, spec, slide: i })));
  const mine = slides ? chunk(slides.map((sl, i) => ({ sl, i })), p.parts, p.part) : [];
  const pinsHere = allPins.filter((x) => !slides || mine.some((m) => m.i === x.slide));
  usePinBadges(ref, pinsHere);
  useLayoutEffect(() => {
    const el = ref.current?.querySelector('.sheet') as HTMLElement | null;
    if (el && el.scrollHeight > el.clientHeight + 2) onOverflow(s.id);
  });
  // exhibits: shared centre/side nodes (tables, charts, timelines), once each, in order of first use
  const exhibits: ReactNode[] = [];
  if (slides)
    for (const { sl } of mine) for (const node of [sl.centre, sl.side]) if (node && !exhibits.includes(node)) exhibits.push(node);
  const bg = bgOf(s.id);
  return (
    <section className="page scene-page" ref={ref} data-scene={s.id}>
      {bg ? <img className="page-bg" src={bg} alt="" /> : <LiteBackdrop set={liteSetOf(s)} />}
      <FocusContext.Provider value={NO_FOCUS}>
        <div className="sheet">
          <header className="sheet-head">
            <span className="kicker">{s.sectionRef}</span>
            <h2>{s.title}</h2>
            {p.parts > 1 && <span className="sheet-part">part {p.part + 1}/{p.parts}</span>}
          </header>
          {slides ? (
            <>
              {exhibits.length > 0 && (
                <div className="exhibits">
                  {exhibits.map((x, i) => (
                    <div className="exhibit" key={i}>
                      {x}
                    </div>
                  ))}
                </div>
              )}
              <div className="beat-grid">
                {mine.map(({ sl, i }) => {
                  const pins = allPins.filter((x) => x.slide === i);
                  if (!sl.body && !sl.aside && !(sl.layout === 'title')) return null;
                  return (
                    <div className="beat-card" key={i}>
                      <div className="bc-head">
                        <span className="bc-n">{i + 1}</span>
                        <b>{sl.title ?? s.title}</b>
                        {pins.map((x) => (
                          <Pin key={x.n} n={x.n} />
                        ))}
                      </div>
                      {sl.body && <R t={sl.body} />}
                      {sl.aside}
                      <div className="bc-src">{sl.source}</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="sheet-view">
              <c.View sceneId={s.id} beat={c.beats.length - 1} print />
            </div>
          )}
          {pinsHere.length > 0 && (
            <div className="pin-legend">
              {pinsHere.map((x) => (
                <span key={x.n}>
                  <Pin n={x.n} /> {x.spec.label ?? pretty(x.spec.to)} <i>→ 3D prop: {pretty(x.spec.to)}</i>
                </span>
              ))}
            </div>
          )}
          {!slides && (
            <div className="bc-src">
              Source · {c.beats.map((b) => b.source).filter((v, i, a) => v && a.indexOf(v) === i).join(' · ')}
            </div>
          )}
        </div>
      </FocusContext.Provider>
      <footer className="page-foot">
        Group 6 – IBRD in Vietnam | {n}/{total}
      </footer>
    </section>
  );
}

function CoverPage({ total }: { total: number }) {
  const c = CONTENT['ext-facade'];
  const bg = bgOf('ext-facade');
  return (
    <section className="page cover-page">
      {bg && <img className="page-bg" src={bg} alt="" />}
      <div className="scene-layer">
        <c.View sceneId="ext-facade" beat={0} print />
      </div>
      <footer className="page-foot">Group 6 – IBRD in Vietnam | 1/{total}</footer>
    </section>
  );
}

function TocPage({ pages, total }: { pages: Page[]; total: number }) {
  const first = (i: number) => pages.findIndex((q) => q.kind === 'scene' && q.scene === i) + 1;
  const refsPage = pages.findIndex((q) => q.kind === 'refs') + 1;
  return (
    <section className="page toc-page">
      <div className="toc-inner">
        <div className="kicker">
          {COVER.university} – {COVER.school} · {COVER.group}
        </div>
        <div className="h1 toc-title">{COVER.title}</div>
        <div className="toc-cols">
          {SEGMENTS.map((g) => (
            <div key={g.id} className="toc-seg">
              <h4>{g.label}</h4>
              <ol>
                {SCENES.map((s, i) =>
                  s.segment !== g.id || first(i) === 0 ? null : (
                    <li key={s.id}>
                      <span>{s.title}</span>
                      <b>{first(i)}</b>
                    </li>
                  ),
                )}
              </ol>
            </div>
          ))}
          <div className="toc-seg">
            <h4>References</h4>
            <ol>
              <li>
                <span>All {REFERENCES.length} references</span>
                <b>{refsPage}</b>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <footer className="page-foot">Group 6 – IBRD in Vietnam | 2/{total}</footer>
    </section>
  );
}

function RefsPage({ from, to, n, total }: { from: number; to: number; n: number; total: number }) {
  return (
    <section className="page refs-page">
      <div className="refs-inner">
        <div className="h2">References {from === 0 ? '' : '(continued)'}</div>
        <ol className="refs-print">
          {REFERENCES.slice(from, to).map((r) => (
            <li key={r.n}>
              <b>[{r.n}]</b>
              <span>
                {r.text}
                {r.url && <span className="refs-url"> {r.url}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <footer className="page-foot">
        Group 6 – IBRD in Vietnam | {n}/{total}
      </footer>
    </section>
  );
}

export default function PrintView() {
  // parts per scene: starts at 1; a page that overflows asks for one more part (at most 4)
  const [parts, setParts] = useState<Record<string, number>>({});
  const [stable, setStable] = useState(0);
  const pages: Page[] = [{ kind: 'cover' }, { kind: 'toc' }];
  for (const { s, i } of printable) {
    const np = parts[s.id] ?? 1;
    for (let k = 0; k < np; k++) pages.push({ kind: 'scene', scene: i, part: k, parts: np });
  }
  for (let i = 0; i < REFERENCES.length; i += REFS_PER_PAGE) pages.push({ kind: 'refs', from: i, to: Math.min(REFERENCES.length, i + REFS_PER_PAGE) });
  const total = pages.length;
  const pending = useRef<Set<string>>(new Set());
  const onOverflow = (id: string) => pending.current.add(id);
  useLayoutEffect(() => {
    if (!pending.current.size) return;
    const next = { ...parts };
    let changed = false;
    for (const id of pending.current) {
      const cur = next[id] ?? 1;
      if (cur < 4 && slidesOf(id)) {
        next[id] = cur + 1;
        changed = true;
      }
    }
    pending.current.clear();
    if (changed) setParts(next);
  });
  useEffect(() => {
    document.documentElement.classList.add('print-mode');
    const fit = () => document.documentElement.style.setProperty('--pz', String(Math.min(1, (window.innerWidth - 40) / 1920)));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  // ready once fonts are loaded and the split has settled for two passes
  useEffect(() => {
    const t = setTimeout(() => setStable((x) => x + 1), 400);
    return () => clearTimeout(t);
  }, [parts]);
  useEffect(() => {
    if (!stable) return;
    document.fonts?.ready.then(() =>
      setTimeout(
        () =>
          Object.assign(window, {
            __printReady: total,
            __printScenes: printable.length,
            __printOverflow: Object.entries(parts).filter(([, v]) => v > 1).map(([id, v]) => `${id} (${v} pages)`),
          }),
        300,
      ),
    );
  }, [stable, total, parts]);
  return (
    <div className="print-root">
      <div className="print-bar">
        Print preview · {total} pages: cover, contents, {printable.length} scenes, references · Print → Save as PDF (background graphics on)
        <a href={location.pathname + location.hash}>Back to the tour (P)</a>
      </div>
      {pages.map((p, k) => (
        <Fragment key={k}>
          {p.kind === 'cover' ? (
            <CoverPage total={total} />
          ) : p.kind === 'toc' ? (
            <TocPage pages={pages} total={total} />
          ) : p.kind === 'refs' ? (
            <RefsPage from={p.from} to={p.to} n={k + 1} total={total} />
          ) : (
            <SceneSheet p={p} n={k + 1} total={total} onOverflow={onOverflow} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
