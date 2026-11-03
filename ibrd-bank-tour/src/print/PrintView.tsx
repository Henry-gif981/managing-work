import { useEffect } from 'react';
import { SCENES } from '../scenes';
import { CONTENT } from '../content';
import { FocusContext } from '../primitives/focus';
import { LiteBackdrop, liteSetOf } from '../lite/LiteBackdrop';

interface Page {
  scene: number;
  beat: number;
}

/** ?print=1 — every beat of every scene as a static 1920x1080 page. No WebGL. */
export default function PrintView() {
  const pages: Page[] = [];
  SCENES.forEach((s, i) => {
    const n = CONTENT[s.id]?.beats.length ?? 0;
    for (let b = 0; b < n; b++) pages.push({ scene: i, beat: b });
  });
  useEffect(() => {
    document.documentElement.classList.add('print-mode');
    const fit = () => document.documentElement.style.setProperty('--pz', String(Math.min(1, (window.innerWidth - 40) / 1920)));
    fit();
    window.addEventListener('resize', fit);
    // signal for export-pdf / tests once fonts are ready
    document.fonts?.ready.then(() => ((window as unknown as { __printReady: number }).__printReady = pages.length));
    return () => window.removeEventListener('resize', fit);
  }, [pages.length]);
  return (
    <div className="print-root">
      <div className="print-bar">
        Print preview · {pages.length} pages (one per beat) · use the browser's Print → Save as PDF (background graphics on)
        <a href={location.pathname + location.hash}>Back to the tour (P)</a>
      </div>
      {pages.map((p, k) => {
        const s = SCENES[p.scene];
        const c = CONTENT[s.id];
        const beat = c.beats[p.beat];
        const View = c.View;
        return (
          <section className="page" key={k} data-scene={s.id} data-beat={p.beat + 1}>
            <LiteBackdrop set={liteSetOf(s)} />
            <div className="page-veil" />
            <FocusContext.Provider value={new Set(beat?.focus ?? [])}>
              <div className="scene-layer">
                <View sceneId={s.id} beat={p.beat} print />
              </div>
            </FocusContext.Provider>
            <header className="page-head">
              <b>{s.title}</b> · {s.sectionRef} · beat {p.beat + 1}/{c.beats.length}
              {beat?.source ? ` · ${beat.source}` : beat?.label ? ` · ${beat.label}` : ''}
            </header>
            <footer className="page-foot">
              Group 6 – IBRD in Vietnam | {k + 1}/{pages.length}
            </footer>
          </section>
        );
      })}
    </div>
  );
}
