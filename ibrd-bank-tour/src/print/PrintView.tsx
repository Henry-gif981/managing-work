import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SCENES, SEGMENTS } from '../scenes';
import { CONTENT } from '../content';
import { FocusContext } from '../primitives/focus';
import { LiteBackdrop, liteSetOf } from '../lite/LiteBackdrop';
import { REFERENCES } from '../data/references';
import { COVER } from '../data/cover';
import type { CalloutSpec } from '../content/types';

interface BeatPage {
  kind: 'beat';
  scene: number;
  beat: number;
}
type Page = { kind: 'toc' } | BeatPage | { kind: 'refs'; from: number; to: number };

const REFS_PER_PAGE = 14;

function buildPages(): Page[] {
  const pages: Page[] = [{ kind: 'toc' }];
  SCENES.forEach((s, i) => {
    const n = CONTENT[s.id]?.beats.length ?? 0;
    for (let b = 0; b < n; b++) pages.push({ kind: 'beat', scene: i, beat: b });
  });
  for (let i = 0; i < REFERENCES.length; i += REFS_PER_PAGE) pages.push({ kind: 'refs', from: i, to: Math.min(REFERENCES.length, i + REFS_PER_PAGE) });
  return pages;
}

const pretty = (anchor: string) => anchor.split(':').pop()!.replace(/-/g, ' ');

/**
 * Static stand-in for 3D callouts: a leader from the DOM element to a labelled marker in the free band
 * (left band for centre layouts, right band for right-banded layouts). Only centre layouts keep such a band free.
 */
function PrintCallouts({ callouts, pageRef }: { callouts: CalloutSpec[]; pageRef: React.RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<{ d: string; mx: number; my: number; label: string; right: boolean }[]>([]);
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const centre = page.querySelector('.k-centre');
    if (!centre) return setGeo([]);
    const right = centre.classList.contains('k-centre-r');
    const pr = page.getBoundingClientRect();
    const s = pr.width / 1920;
    const out: typeof geo = [];
    callouts.forEach((c, i) => {
      const el = page.querySelector(c.from) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x0 = ((right ? r.right : r.left) - pr.left) / s;
      const y0 = (r.top + r.height / 2 - pr.top) / s;
      const mx = right ? 1700 : 210;
      const my = Math.min(900, Math.max(200, y0 + 90 + i * 70));
      const cx = (x0 + mx) / 2;
      out.push({ d: `M${x0},${y0} C${cx},${y0} ${cx},${my} ${mx},${my}`, mx, my, label: c.label ?? pretty(c.to), right });
    });
    setGeo(out);
  }, [callouts, pageRef]);
  if (!geo.length) return null;
  return (
    <svg className="callouts print-callouts" width={1920} height={1080} viewBox="0 0 1920 1080">
      {geo.map((g, i) => (
        <g key={i}>
          <path className="halo" d={g.d} />
          <path d={g.d} />
          <g transform={`translate(${g.mx},${g.my})`}>
            <circle className="pin-ring" r={11} />
            <circle className="pin-dot" r={5} />
            <text x={g.right ? -16 : 16} y={-14} textAnchor={g.right ? 'end' : 'start'}>
              {g.label}
            </text>
            <text className="print-prop" x={g.right ? -16 : 16} y={26} textAnchor={g.right ? 'end' : 'start'}>
              3D prop in the tour
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

function BeatPageView({ p, n, total }: { p: BeatPage; n: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const s = SCENES[p.scene];
  const c = CONTENT[s.id];
  const beat = c.beats[p.beat];
  const View = c.View;
  return (
    <section className="page" ref={ref} data-scene={s.id} data-beat={p.beat + 1}>
      <LiteBackdrop set={liteSetOf(s)} />
      <div className="page-veil" />
      <FocusContext.Provider value={new Set(beat?.focus ?? [])}>
        <div className="scene-layer">
          <View sceneId={s.id} beat={p.beat} print />
        </div>
      </FocusContext.Provider>
      {beat?.callouts?.length ? <PrintCallouts callouts={beat.callouts} pageRef={ref} /> : null}
      <header className="page-head">
        <b>{s.title}</b> · {s.sectionRef} · beat {p.beat + 1}/{c.beats.length}
        {beat?.source ? ` · Source: ${beat.source}` : beat?.label ? ` · ${beat.label}` : ''}
      </header>
      <footer className="page-foot">
        Group 6 – IBRD in Vietnam | {n}/{total}
      </footer>
    </section>
  );
}

function TocPage({ pages, total }: { pages: Page[]; total: number }) {
  const firstPage = (sceneIdx: number) => pages.findIndex((q) => q.kind === 'beat' && q.scene === sceneIdx) + 1;
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
                  s.segment !== g.id || firstPage(i) === 0 ? null : (
                    <li key={s.id}>
                      <span>{s.title}</span>
                      <b>{firstPage(i)}</b>
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
      <footer className="page-foot">Group 6 – IBRD in Vietnam | 1/{total}</footer>
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

/** ?print=1 — a contents page, every beat of every scene as a static 1920x1080 page, then the references. No WebGL. */
export default function PrintView() {
  const pages = buildPages();
  const total = pages.length;
  const beatsCount = pages.filter((p) => p.kind === 'beat').length;
  useEffect(() => {
    document.documentElement.classList.add('print-mode');
    const fit = () => document.documentElement.style.setProperty('--pz', String(Math.min(1, (window.innerWidth - 40) / 1920)));
    fit();
    window.addEventListener('resize', fit);
    // signal for export-pdf / tests once fonts are ready
    document.fonts?.ready.then(() => Object.assign(window, { __printReady: total, __printBeats: beatsCount }));
    return () => window.removeEventListener('resize', fit);
  }, [total, beatsCount]);
  return (
    <div className="print-root">
      <div className="print-bar">
        Print preview · {total} pages: contents, {beatsCount} beats, references · use Print → Save as PDF (background graphics on)
        <a href={location.pathname + location.hash}>Back to the tour (P)</a>
      </div>
      {pages.map((p, k) =>
        p.kind === 'toc' ? (
          <TocPage key={k} pages={pages} total={total} />
        ) : p.kind === 'refs' ? (
          <RefsPage key={k} from={p.from} to={p.to} n={k + 1} total={total} />
        ) : (
          <BeatPageView key={k} p={p} n={k + 1} total={total} />
        ),
      )}
    </div>
  );
}
