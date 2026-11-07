import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { SCENES, SEGMENTS } from '../scenes';
import { CONTENT } from '../content';
import { FocusContext } from '../primitives/focus';
import { REFERENCES } from '../data/references';
import { COVER } from '../data/cover';
import { R, type Slide } from '../content/kit';
import { PARTS } from '../content/lift-down';
import { FLOORS } from '../content/f1-structure';
import { ThanksCard } from '../content/ex-thanks';

/**
 * ?print=1 (update 2: calm print layout). Order: cover, contents, one page per scene, references.
 * Page grid (1920x1080): header band; MAIN area (tables, charts, diagrams: complete, final state, no focus);
 * a CSS grid of TEXT CARDS (equal column width, equal row height, one beat = one card, never split).
 * Safe margins 60 / 40 / 110 px (the bottom 110 px are the footer zone). No pins, legends, leader lines,
 * tab strips, buttons or hints. A scene whose cards do not fit moves its last cards to an extra page (logged).
 * References are paginated by measured height.
 */
const BG = import.meta.glob('../assets/print-bg/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
const bgOf = (id: string) => BG[`../assets/print-bg/${id}.jpg`];
const NO_FOCUS = new Set<string>();
/** Resolves once the print fonts are really loaded (fonts load lazily, so document.fonts.ready alone is too early). */
const fontsLoaded = () =>
  Promise.all(
    ['400 20px "Open Sans"', '600 20px "Open Sans"', '700 20px "Open Sans"', 'italic 400 18px "Cormorant Garamond"', '700 32px "Playfair Display"'].map((f) =>
      document.fonts?.load(f).catch(() => null),
    ),
  )
    .then(() => document.fonts?.ready)
    .then(() => new Promise((r) => setTimeout(r, 50)));

type PCard = { label: string; title: ReactNode; body: ReactNode; source: string; dark?: boolean };
type PSpec = { main: ReactNode[]; cards: PCard[]; special?: 'thanks' | 'sources' };

type ScenePage = { kind: 'scene'; scene: number; part: number; parts: number; from: number; to: number; exFrom: number; exTo: number };
type Split = { ex: number; cards: number };
type Page = { kind: 'cover' } | { kind: 'toc' } | ScenePage | { kind: 'refs'; from: number; to: number; first: boolean };

const printable = SCENES.map((s, i) => ({ s, i })).filter(({ s }) => s.id !== 'ext-facade' && (CONTENT[s.id]?.beats.length ?? 0) > 0);

function slidesOf(id: string): Slide[] | null {
  const v = CONTENT[id]?.View as unknown as { slides?: Slide[] };
  return v?.slides ?? null;
}

/** What a scene prints: its exhibits (once each, in order of first use) and one card per beat. */
function specOf(id: string): PSpec {
  const s = SCENES.find((x) => x.id === id)!;
  if (id === 'ex-thanks') return { main: [], cards: [], special: 'thanks' };
  if (id === 'ex-sources') return { main: [], cards: [], special: 'sources' };
  if (id === 'lift-down')
    return {
      main: [],
      cards: PARTS.map((p) => ({ label: p.kicker, title: p.title, body: <R t={p.body} />, source: p.source })),
    };
  if (id === 'f1-structure')
    return {
      main: [],
      cards: [
        {
          label: 'Introduction 6',
          title: 'Structure of the paper',
          body: (
            <>
              <R t="Besides the Introduction, Conclusion and References, the paper has **three chapters**. In the tour each chapter is a floor." />
              <ul className="p-floors">
                {FLOORS.map((f) => (
                  <li key={f.id}>
                    <b>{f.floor}</b> {f.label}
                  </li>
                ))}
              </ul>
            </>
          ),
          source: 'Introduction 6 · p. 12',
        },
      ],
    };
  const slides = slidesOf(id);
  if (!slides) {
    const c = CONTENT[id];
    return { main: [], cards: c.beats.map((b) => ({ label: s.sectionRef, title: b.label ?? s.title, body: null, source: b.source ?? '' })) };
  }
  // exhibits once each: the same component (and id) used by several beats is kept in its LAST (final) state,
  // at the position of its first use
  const main: ReactNode[] = [];
  let anon = 0;
  const keyOf = (node: ReactNode) => {
    const el = node as { type?: unknown; props?: { id?: string; className?: string } };
    const t = el?.type as { name?: string } | string | undefined;
    // plain DOM elements without an id are distinct exhibits; components (and ids) identify the same exhibit
    if (typeof t === 'string' || !t) return el?.props?.id ? `${String(t)}#${el.props.id}` : `anon-${anon++}`;
    return `${t.name ?? 'component'}#${el?.props?.id ?? ''}`;
  };
  const at = new Map<string, number>();
  for (const sl of slides)
    for (const node of [sl.centre, sl.side]) {
      if (!node || main.includes(node)) continue;
      const k = keyOf(node);
      if (at.has(k)) main[at.get(k)!] = node;
      else {
        at.set(k, main.length);
        main.push(node);
      }
    }
  const cards: PCard[] = [];
  for (const sl of slides) {
    if (!sl.body && !sl.aside && sl.layout !== 'title') continue;
    const sharedTitle = sl.layout === 'centre' && sl.label;
    cards.push({
      label: sl.kicker ?? s.sectionRef,
      title: (sharedTitle ? sl.label : sl.title) ?? s.title,
      body: (
        <>
          {sl.body && <R t={sl.body} />}
          {sl.aside}
        </>
      ),
      source: sl.source,
      dark: sl.layout === 'title',
    });
  }
  return { main, cards };
}

const SPECS: Record<string, PSpec> = Object.fromEntries(printable.map(({ s }) => [s.id, specOf(s.id)]));

/** 2-4 equal columns, chosen from the number of cards (first choice; the others are tried if it does not fit). */
function colChoices(n: number): number[] {
  const pref = n <= 2 ? 2 : n === 3 ? 3 : n === 4 ? 4 : n <= 6 ? 3 : n <= 8 ? 4 : n === 9 ? 3 : 4;
  return [pref, ...[4, 3, 2].filter((c) => c !== pref && (c <= Math.max(2, n) || c === 2))];
}

function Card({ c }: { c: PCard }) {
  return (
    <article className={'pcard' + (c.dark ? ' dark' : '')}>
      <h3 className="pc-title">
        <span className="pc-label">{c.label}</span> {c.title}
      </h3>
      <div className="pc-body">{c.body}</div>
      {c.source && <div className="pc-src">Source · {c.source}</div>}
    </article>
  );
}

function Foot({ n, total }: { n: number; total: number }) {
  return (
    <footer className="page-foot">
      Group 6 – IBRD in Vietnam | {n}/{total}
    </footer>
  );
}

function Backdrop({ id }: { id: string }) {
  const bg = bgOf(id);
  return (
    <>
      {bg && <img className="page-bg" src={bg} alt="" />}
      <div className="page-scrim" />
    </>
  );
}

function SceneSheet({
  p,
  n,
  total,
  refPages,
  onFit,
}: {
  p: ScenePage;
  n: number;
  total: number;
  refPages: string;
  onFit: (id: string, part: number, ok: boolean) => void;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const s = SCENES[p.scene];
  const spec = SPECS[s.id];
  const cards = spec.cards.slice(p.from, p.to);
  const main = spec.main.slice(p.exFrom, p.exTo);
  useLayoutEffect(() => {
    const sh = sheet.current;
    if (!sh || spec.special) return;
    const fits = () => sh.scrollHeight <= sh.clientHeight + 1 && [...sh.querySelectorAll<HTMLElement>('.pcard')].every((c) => c.scrollHeight <= c.clientHeight + 1);
    const g = grid.current;
    let ok = fits();
    if (g) {
      const choices = colChoices(cards.length);
      ok = false;
      for (const c of choices) {
        g.style.gridTemplateColumns = `repeat(${c}, minmax(0, 1fr))`;
        if (fits()) {
          ok = true;
          g.dataset.cols = String(c);
          break;
        }
      }
      if (!ok) g.style.gridTemplateColumns = `repeat(${choices[0]}, minmax(0, 1fr))`;
    }
    onFit(s.id, p.part, ok);
  });
  return (
    <section className="page scene-page" data-kind="scene" data-scene={s.id} data-part={p.part}>
      <Backdrop id={s.id} />
      <FocusContext.Provider value={NO_FOCUS}>
        {spec.special === 'thanks' ? (
          <div className="p-thanks">
            <ThanksCard />
          </div>
        ) : (
          <div className="sheet" ref={sheet}>
            <header className="sheet-head">
              <span className="sh-label">{s.sectionRef}</span>
              <h2>{s.title}</h2>
              {p.part > 0 && <span className="sh-cont">(continued)</span>}
            </header>
            {main.length > 0 && (
              <div className="p-main">
                {main.map((x, i) => (
                  <div className="p-exhibit" key={i}>
                    {x}
                  </div>
                ))}
              </div>
            )}
            {spec.special === 'sources' ? (
              <div className="p-cards" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <Card
                  c={{
                    label: 'References',
                    title: `Sources · ${REFERENCES.length} references`,
                    body: (
                      <div className="rich">
                        <p>
                          All {REFERENCES.length} references of the paper, [1] to [{REFERENCES.length}], are printed in full on pages {refPages} of this
                          document, in the paper's order.
                        </p>
                      </div>
                    ),
                    source: 'References · pp. 60-66',
                  }}
                />
              </div>
            ) : (
              cards.length > 0 && (
                <div className="p-cards" ref={grid}>
                  {cards.map((c, i) => (
                    <Card c={c} key={p.from + i} />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </FocusContext.Provider>
      <Foot n={n} total={total} />
    </section>
  );
}

function CoverPage({ total }: { total: number }) {
  return (
    <section className="page cover-page" data-kind="cover" data-scene="ext-facade">
      <Backdrop id="ext-facade" />
      <div className="p-cover">
        <div className="pc-label">
          {COVER.university} – {COVER.school}
        </div>
        <div className="p-cover-course">{COVER.course}</div>
        <h1>{COVER.title}</h1>
        <p className="p-cover-sub">{COVER.subtitle}</p>
        <div className="p-cover-grid">
          <b>{COVER.group}</b>
          <ul>
            {COVER.members.map((m) => (
              <li key={m.id}>
                {m.name} – {m.id}
              </li>
            ))}
          </ul>
          <b>Class</b>
          <span>{COVER.className}</span>
          <b>Lecturer</b>
          <span>{COVER.lecturer}</span>
        </div>
        <div className="p-cover-place">{COVER.place}</div>
      </div>
      <Foot n={1} total={total} />
    </section>
  );
}

function TocPage({ pages, total }: { pages: Page[]; total: number }) {
  const first = (i: number) => pages.findIndex((q) => q.kind === 'scene' && q.scene === i) + 1;
  const refsFirst = pages.findIndex((q) => q.kind === 'refs') + 1;
  const refsLast = pages.length;
  return (
    <section className="page toc-page" data-kind="toc">
      <div className="toc-inner">
        <div className="pc-label">
          {COVER.university} – {COVER.school} · {COVER.group}
        </div>
        <h1 className="toc-title">{COVER.title}</h1>
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
                <b>
                  {refsFirst}–{refsLast}
                </b>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <Foot n={2} total={total} />
    </section>
  );
}

function RefItem({ i }: { i: number }) {
  const r = REFERENCES[i];
  return (
    <li data-n={r.n}>
      <b>[{r.n}]</b>
      <span>
        {r.text}
        {r.url && <span className="refs-url"> {r.url}</span>}
      </span>
    </li>
  );
}

function RefsPage({ from, to, first, n, total }: { from: number; to: number; first: boolean; n: number; total: number }) {
  return (
    <section className="page refs-page" data-kind="refs">
      <div className="refs-inner">
        <h2 className="refs-h">References{first ? '' : ' (continued)'}</h2>
        <ol className="refs-print">
          {REFERENCES.slice(from, to).map((_, k) => (
            <RefItem key={from + k} i={from + k} />
          ))}
        </ol>
      </div>
      <Foot n={n} total={total} />
    </section>
  );
}

/** Hidden copy of the reference list at print width: measures each entry and packs whole entries into pages. */
function RefsMeasure({ onSplit }: { onSplit: (s: [number, number][]) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let dead = false;
    fontsLoaded().then(() => {
      if (dead || !ref.current) return;
      const box = ref.current;
      const head = box.querySelector('.refs-h') as HTMLElement;
      const items = [...box.querySelectorAll<HTMLElement>('.refs-print li')];
      // refs-inner: top 60, bottom 110 (footer zone) -> 910 px, minus the heading, minus a safety margin
      const avail = 1080 - 60 - 110 - head.offsetHeight - 24;
      const out: [number, number][] = [];
      let start = 0;
      let used = 0;
      items.forEach((li, i) => {
        const h = li.offsetHeight;
        if (used + h > avail && i > start) {
          out.push([start, i]);
          start = i;
          used = 0;
        }
        used += h;
      });
      out.push([start, items.length]);
      onSplit(out);
    });
    return () => {
      dead = true;
    };
  }, [onSplit]);
  return (
    <div className="refs-measure page refs-page" ref={ref} aria-hidden>
      <div className="refs-inner">
        <h2 className="refs-h">References (continued)</h2>
        <ol className="refs-print">
          {REFERENCES.map((_, i) => (
            <RefItem key={i} i={i} />
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * Hidden measuring pass: every exhibit inside a full-width main panel, and every card at the column widths
 * of a 2-, 3- and 4-column grid. plan() packs each scene greedily from these heights: exhibits first, then as many
 * cards as fit (all card rows take the height of the page's tallest card). The rendered pages are then checked
 * again and a page that still does not fit moves its last card on (onFit).
 */
const CONTENT_W = 1800;
const GAP = 24;
const COLS = [2, 3, 4];
type Heights = { head: number; panel: (from: number, to: number) => number; card: Record<number, number[]> };

function packScene(h: Heights, nEx: number, nCards: number): Split[] {
  const avail = 1080 - 40 - 110 - h.head - GAP;
  const out: Split[] = [];
  let e = 0;
  let c = 0;
  while (e < nEx || c < nCards) {
    let used = 0;
    let ex = 0;
    // exhibits (one panel; measured for this exact range, so side-by-side exhibits count once), at least one
    while (e + ex < nEx) {
      const hh = h.panel(e, e + ex + 1);
      if (ex && hh > avail) break;
      used = hh;
      ex++;
    }
    const left = avail - used - (ex ? GAP : 0);
    // the most cards that fit with any column count
    let best = 0;
    for (const cols of COLS) {
      let k = 0;
      for (let t = 1; c + t <= nCards; t++) {
        const rowH = Math.max(...h.card[cols].slice(c, c + t));
        const rows = Math.ceil(t / cols);
        if (rows * rowH + (rows - 1) * GAP <= left) k = t;
        else break;
      }
      best = Math.max(best, k);
    }
    if (!ex && !best && c < nCards) best = 1; // a card taller than a page still gets its own page
    out.push({ ex, cards: best });
    e += ex;
    c += best;
  }
  return out.length ? out : [{ ex: 0, cards: 0 }];
}

function Measure({ onPlan }: { onPlan: (p: Record<string, Split[]>) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let dead = false;
    fontsLoaded().then(() =>
      requestAnimationFrame(() => {
        if (dead || !ref.current) return;
        const box = ref.current;
        const head = (box.querySelector('.sheet-head') as HTMLElement).offsetHeight;
        const plan: Record<string, Split[]> = {};
        for (const { s } of printable) {
          const spec = SPECS[s.id];
          if (spec.special) continue;
          const el = box.querySelector(`[data-m="${s.id}"]`) as HTMLElement;
          const panels = new Map<string, number>();
          el.querySelectorAll<HTMLElement>('.p-main[data-range]').forEach((x) => panels.set(x.dataset.range!, x.offsetHeight));
          const panel = (f: number, t: number) => panels.get(`${f}-${t}`) ?? 9999;
          const card: Record<number, number[]> = {};
          for (const cols of COLS) card[cols] = [...el.querySelectorAll<HTMLElement>(`[data-cols="${cols}"] > .pcard`)].map((x) => x.offsetHeight + 1);
          plan[s.id] = packScene({ head, panel, card }, spec.main.length, spec.cards.length);
        }
        onPlan(plan);
      }),
    );
    return () => {
      dead = true;
    };
  }, [onPlan]);
  return (
    <div className="print-measure" ref={ref} aria-hidden>
      <FocusContext.Provider value={NO_FOCUS}>
        <header className="sheet-head">
          <span className="sh-label">Section 1.1</span>
          <h2>Measure</h2>
        </header>
        {printable.map(({ s }) => {
          const spec = SPECS[s.id];
          if (spec.special) return null;
          return (
            <div key={s.id} data-m={s.id}>
              {spec.main.flatMap((_, f) =>
                spec.main.slice(f).map((__, k) => (
                  <div className="p-main" key={`${f}-${f + k + 1}`} data-range={`${f}-${f + k + 1}`}>
                    {spec.main.slice(f, f + k + 1).map((x, i) => (
                      <div className="p-exhibit" key={i}>
                        {x}
                      </div>
                    ))}
                  </div>
                )),
              )}
              {COLS.map((cols) => (
                <div key={cols} data-cols={cols} className="m-cards" style={{ width: (CONTENT_W - GAP * (cols - 1)) / cols }}>
                  {spec.cards.map((c, i) => (
                    <Card c={c} key={i} />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </FocusContext.Provider>
    </div>
  );
}

export default function PrintView() {
  // cards per page for each scene (starts with all cards on one page)
  const [counts, setCounts] = useState<Record<string, Split[]> | null>(null);
  const [refSplit, setRefSplit] = useState<[number, number][] | null>(null);
  const [rev, setRev] = useState(0);
  const pending = useRef<Map<string, boolean>>(new Map());
  const stuck = useRef<Set<string>>(new Set());

  const pages: Page[] = [{ kind: 'cover' }, { kind: 'toc' }];
  for (const { s, i } of counts ? printable : []) {
    const spec = SPECS[s.id];
    const cs = counts![s.id] ?? [{ ex: spec.main.length, cards: spec.cards.length }];
    let from = 0;
    let ex = 0;
    cs.forEach((c, k) => {
      pages.push({ kind: 'scene', scene: i, part: k, parts: cs.length, from, to: from + c.cards, exFrom: ex, exTo: ex + c.ex });
      from += c.cards;
      ex += c.ex;
    });
  }
  if (refSplit) refSplit.forEach(([from, to], k) => pages.push({ kind: 'refs', from, to, first: k === 0 }));
  const total = pages.length;
  const refsFirst = pages.findIndex((q) => q.kind === 'refs') + 1;
  const refPages = refsFirst ? `${refsFirst}–${total}` : '…';

  const onFit = (id: string, part: number, ok: boolean) => {
    if (!ok) pending.current.set(`${id}|${part}`, ok);
  };
  // a page that does not fit moves its last card to the next page of the same scene
  useLayoutEffect(() => {
    if (!pending.current.size || !counts) return;
    const next = { ...counts };
    let changed = false;
    for (const key of pending.current.keys()) {
      const [id, ps] = key.split('|');
      const part = Number(ps);
      const spec = SPECS[id];
      const cs = (next[id] ?? [{ ex: spec.main.length, cards: spec.cards.length }]).map((x) => ({ ...x }));
      const cur = cs[part];
      if (part + 1 >= cs.length) cs.push({ ex: 0, cards: 0 });
      const nxt = cs[part + 1];
      // move the last card to the next page; when only exhibits are left, move the last exhibit
      if (cur.cards > (cur.ex ? 0 : 1)) {
        cur.cards--;
        nxt.cards++;
      } else if (cur.ex > 1) {
        // the exhibit moves together with this page's cards, so the order stays: exhibits first, then cards
        cur.ex--;
        nxt.ex++;
        nxt.cards += cur.cards;
        cur.cards = 0;
      } else {
        stuck.current.add(`${id} (page ${part + 1})`);
        if (!nxt.ex && !nxt.cards) cs.pop();
        continue;
      }
      next[id] = cs;
      changed = true;
    }
    pending.current.clear();
    if (changed) setCounts(next);
  });

  useEffect(() => {
    document.documentElement.classList.add('print-mode');
    const fit = () => document.documentElement.style.setProperty('--pz', String(Math.min(1, (window.innerWidth - 40) / 1920)));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  // settled: refs measured and no pagination change for 700 ms
  useEffect(() => {
    if (!refSplit || !counts) return;
    const t = setTimeout(() => setRev((x) => x + 1), 700);
    return () => clearTimeout(t);
  }, [counts, refSplit]);
  useEffect(() => {
    if (!rev) return;
    document.fonts?.ready.then(() =>
      Object.assign(window, {
        __printReady: total,
        __printScenes: printable.length,
        __printOverflow: Object.entries(counts ?? {})
          .filter(([, v]) => v.length > 1)
          .map(([id, v]) => `${id} (${v.length} pages)`),
        __printStuck: [...stuck.current],
        __printRefCount: REFERENCES.length,
      }),
    );
  }, [rev, total, counts]);

  return (
    <div className="print-root">
      <div className="print-bar">
        Print preview · {total} pages · Print → Save as PDF (background graphics on)
        <a href={location.pathname + location.hash}>Back to the tour (P)</a>
      </div>
      {!refSplit && <RefsMeasure onSplit={setRefSplit} />}
      {!counts && <Measure onPlan={setCounts} />}
      {pages.map((p, k) => (
        <Fragment key={k}>
          {p.kind === 'cover' ? (
            <CoverPage total={total} />
          ) : p.kind === 'toc' ? (
            <TocPage pages={pages} total={total} />
          ) : p.kind === 'refs' ? (
            <RefsPage from={p.from} to={p.to} first={p.first} n={k + 1} total={total} />
          ) : (
            <SceneSheet p={p} n={k + 1} total={total} refPages={refPages} onFit={onFit} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
