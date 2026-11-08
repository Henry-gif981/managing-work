import { useEffect, useMemo, useState } from 'react';
import { SCENES, SEGMENTS, type Scene } from '../scenes';
import { beatCount } from '../content';
import { useEdits, visibleBeats } from '../edit/store';
import { useTour } from '../state/store';
import { PARAMS } from '../util/params';
import { perf } from '../three/refs';
import { displayFor, world } from '../three/world';

const fmt = (sec: number) => {
  const s = Math.max(0, Math.round(Math.abs(sec)));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function totalSeconds(coreOnly: boolean) {
  return SCENES.reduce((a, s) => a + (coreOnly && s.optional ? 0 : s.targetSeconds), 0);
}

/* ------------------------------------------------------------------ */
export function Tracker() {
  const index = useTour((s) => s.index);
  const beat = useTour((s) => s.beat);
  const coreOnly = useTour((s) => s.coreOnly);
  const goto = useTour((s) => s.goto);
  const segs = useMemo(
    () =>
      SEGMENTS.map((g) => {
        const idx = SCENES.map((s, i) => (s.segment === g.id ? i : -1)).filter((i) => i >= 0);
        return { ...g, first: idx[0], count: idx.length, idx };
      }),
    [],
  );
  const cur = SCENES[index];
  const edits = useEdits((st) => st.edits);
  const editing = useEdits((st) => st.editing);
  const v = visibleBeats(cur.id, beatCount(cur.id), edits, editing);
  const B = Math.max(1, v.length);
  const frac = (Math.max(0, v.indexOf(beat)) + 1) / B;
  return (
    <nav className="tracker" aria-label="Tour progress">
      {segs.map((g) => {
        const active = g.id === cur.segment;
        const pos = g.idx.indexOf(index);
        const fill = index > g.idx[g.idx.length - 1] ? 1 : pos >= 0 ? (pos + frac) / g.count : 0;
        return (
          <button
            key={g.id}
            className={'seg' + (active ? ' active' : '') + (fill >= 1 ? ' done' : '')}
            style={{ flexGrow: g.count }}
            onClick={() => goto(g.first, 0)}
            title={`${g.label} · ${g.count} scenes`}
          >
            <span className="seg-fill" style={{ width: `${fill * 100}%` }} />
            <span className="seg-ticks">
              {g.idx.map((i) => (
                <i
                  key={i}
                  className={(SCENES[i].optional ? 'opt' : '') + (coreOnly && SCENES[i].optional ? ' dim' : '') + (i === index ? ' cur' : '')}
                />
              ))}
            </span>
            {active && pos >= 0 && <span className="pin" style={{ left: `${((pos + 0.5) / g.count) * 100}%` }} />}
            <span className="seg-label">{g.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
export function FloorIndicator() {
  const index = useTour((s) => s.index);
  const s = SCENES[index];
  const [liftFloor, setLiftFloor] = useState<string | null>(null);
  // during lift scenes, follow the cabin display
  useEffect(() => {
    if (s.kind !== 'lift') {
      setLiftFloor(null);
      return;
    }
    const t = setInterval(() => setLiftFloor(world.lift.display), 120);
    return () => clearInterval(t);
  }, [s.kind]);
  const lit = s.kind === 'lift' ? (liftFloor ?? world.lift.display) : s.floor === 0 ? 'G' : String(s.floor);
  void displayFor;
  return (
    <div className="floors" aria-label="Floor">
      {['3', '2', '1', 'G'].map((f) => (
        <div key={f} className={'floor' + (f === lit ? ' lit' : '')}>
          {f}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function SceneInfo() {
  const index = useTour((s) => s.index);
  const s: Scene = SCENES[index];
  const ref = s.sectionRef === '—' ? '' : s.sectionRef.startsWith('Section') || /^(Chapter|Introduction|Conclusion|References|Title)/.test(s.sectionRef) ? s.sectionRef : `Section ${s.sectionRef}`;
  return (
    <div className="scene-info">
      <div className="si-title">
        {s.title}
        {ref && <span className="si-ref"> · {ref}</span>}
      </div>
      <div className="si-obj">
        <b>OBJECTIVE</b> {s.objective}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function Counter() {
  const index = useTour((s) => s.index);
  const beat = useTour((s) => s.beat);
  const coreOnly = useTour((s) => s.coreOnly);
  const timerStart = useTour((s) => s.timerStart);
  const resetTimer = useTour((s) => s.resetTimer);
  const next = useTour((s) => s.next);
  const prev = useTour((s) => s.prev);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);
  const s = SCENES[index];
  const edits = useEdits((st) => st.edits);
  const editing = useEdits((st) => st.editing);
  // hidden beats (edit mode) are not counted; in edit mode they are counted and marked
  const v = visibleBeats(s.id, beatCount(s.id), edits, editing);
  const B = v.length;
  const pos = v.indexOf(beat);
  const hiddenHere = editing && !!edits[`hide:${s.id}:${beat}`];
  const elapsed = (now - timerStart) / 1000;
  const total = totalSeconds(coreOnly);
  let plan: string | null = null;
  if (PARAMS.plan) {
    let before = 0;
    for (let i = 0; i < index; i++) if (!(coreOnly && SCENES[i].optional)) before += SCENES[i].targetSeconds;
    const within = B > 0 ? (Math.max(0, pos) / B) * s.targetSeconds : 0;
    const expected = ((before + within) / total) * PARAMS.plan * 60;
    const d = elapsed - expected;
    plan = d >= 0 ? `+${fmt(d)} behind` : `-${fmt(d)} ahead`;
  }
  return (
    <div className="counter">
      <button className="nav-arrow" onClick={prev} aria-label="Previous">
        ‹
      </button>
      <button className="nav-arrow" onClick={next} aria-label="Next">
        ›
      </button>
      <div className="ct-main">
        scene {index + 1} / {SCENES.length} · beat {B ? pos + 1 : '–'} / {B}
        {hiddenHere && <b className="ct-hidden"> · hidden</b>}
      </div>
      <button className="ct-time" onClick={resetTimer} title="Click to reset the timer">
        {fmt(elapsed)}
        {plan && <span className={plan.includes('behind') ? 'behind' : 'ahead'}> {plan}</span>}
        <span className="ct-total">
          {' '}
          · {coreOnly ? 'core path' : 'full tour'} ≈ {Math.round(total / 60)} min
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function LiftCard() {
  const text = useTour((s) => s.liftCard);
  if (!text) return null;
  const [floor, chapter, ...rest] = text.split(' · ');
  return (
    <div className="lift-card" role="status">
      <div className="lc-kicker">
        {floor} · {chapter}
      </div>
      <div className="lc-title">{rest.join(' · ')}</div>
    </div>
  );
}

export function Toasts() {
  const toasts = useTour((s) => s.toasts);
  const dismiss = useTour((s) => s.dismissToast);
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span>{t.text}</span>
          {t.action && (
            <button
              onClick={() => {
                t.action!.run();
                dismiss(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
          {t.secondary && (
            <button
              className="ghost"
              onClick={() => {
                t.secondary!.run();
                dismiss(t.id);
              }}
            >
              {t.secondary.label}
            </button>
          )}
          {!t.action && (
            <button className="ghost" onClick={() => dismiss(t.id)}>
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function DevHud() {
  const dev = useTour((s) => s.dev);
  const lite = useTour((s) => s.lite);
  const [, tick] = useState(0);
  useEffect(() => {
    if (!dev) return;
    const t = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, [dev]);
  if (!dev) return null;
  const over = perf.calls > 150 || perf.tris > 300_000;
  return (
    <div className={'dev-hud' + (over ? ' over' : '')}>
      <b>DEV</b> {lite ? 'lite mode' : `${perf.calls} draw calls · ${(perf.tris / 1000).toFixed(1)}k tris · ${perf.fps.toFixed(0)} fps`}
      <div className="dev-help">drag look · shift-drag pan · wheel/W/S move · Q/E down/up · [ ] fov · K copy pose</div>
    </div>
  );
}

export function Hud() {
  return (
    <div className="hud">
      <Tracker />
      <FloorIndicator />
      <SceneInfo />
      <Counter />
      <LiftCard />
      <DevHud />
    </div>
  );
}
