import { create } from 'zustand';
import { SCENES, type Scene } from '../scenes';
import { beatCount } from '../content';
import { visibleBeats } from '../edit/store';
import { PARAMS } from '../util/params';

export type NavMode = 'step' | 'jump';

export interface Toast {
  id: number;
  text: string;
  action?: { label: string; run: () => void };
  secondary?: { label: string; run: () => void };
  ttl?: number;
}

interface TourState {
  index: number;
  beat: number;
  dir: 1 | -1;
  mode: NavMode;
  /** increments on every navigation so the Director can react */
  navSeq: number;
  /** scene whose 3D zone was last fully reached (for visibility unions) */
  settledIndex: number;
  maxIndex: number;
  coreOnly: boolean;
  lite: boolean;
  dev: boolean;
  panel: null | 'refs' | 'notes' | 'grid';
  refsFocus: number | null;
  timerStart: number;
  liftCard: string | null;
  toasts: Toast[];
  fade: boolean;

  next: () => void;
  prev: () => void;
  goto: (index: number, beat?: number, mode?: NavMode) => void;
  gotoId: (id: string, beat?: number) => void;
  home: () => void;
  end: () => void;
  toggleCore: () => void;
  setLite: (v: boolean) => void;
  toggleDev: () => void;
  openPanel: (p: TourState['panel']) => void;
  togglePanel: (p: NonNullable<TourState['panel']>) => void;
  openRef: (n: number) => void;
  resetTimer: () => void;
  settle: (index: number) => void;
  setLiftCard: (t: string | null) => void;
  toast: (t: Omit<Toast, 'id'>) => number;
  dismissToast: (id: number) => void;
  setFade: (v: boolean) => void;
}

export const isTransit = (s: Scene) => (s.kind === 'door' || s.kind === 'lift') && beatCount(s.id) === 0;

function eligible(i: number, coreOnly: boolean) {
  const s = SCENES[i];
  return !!s && !(coreOnly && s.optional);
}

export function nextIndex(from: number, coreOnly: boolean): number | null {
  for (let i = from + 1; i < SCENES.length; i++) if (eligible(i, coreOnly)) return i;
  return null;
}
export function prevIndex(from: number, coreOnly: boolean): number | null {
  // going back never lands on a transit scene: their animation only makes sense forwards
  for (let i = from - 1; i >= 0; i--) if (eligible(i, coreOnly) && !isTransit(SCENES[i])) return i;
  return null;
}
/** beats of scene i the presentation shows (hidden beats skipped outside edit mode) */
const vis = (i: number) => visibleBeats(SCENES[i].id, beatCount(SCENES[i].id));
const lastBeat = (i: number) => {
  const v = vis(i);
  return v.length ? v[v.length - 1] : 0;
};
const firstBeat = (i: number) => vis(i)[0] ?? 0;
/** nearest shown beat to b (forwards first) */
const nearestBeat = (i: number, b: number) => {
  const v = vis(i);
  if (!v.length) return 0;
  return v.find((x) => x >= b) ?? v[v.length - 1];
};

let toastSeq = 1;

const LITE_KEY = 'ibrd-tour-lite';
/** An explicit choice made with L is remembered per browser. */
function storedLite(): boolean {
  if (PARAMS.print || PARAMS.shot) return false;
  try {
    return localStorage.getItem(LITE_KEY) === '1';
  } catch {
    return false;
  }
}
export function rememberLite(v: boolean) {
  try {
    localStorage.setItem(LITE_KEY, v ? '1' : '0');
  } catch {
    /* storage unavailable: the choice lasts for this page only */
  }
}

export const useTour = create<TourState>((set, get) => ({
  index: 0,
  beat: 0,
  dir: 1,
  mode: 'jump',
  navSeq: 0,
  settledIndex: 0,
  maxIndex: 0,
  coreOnly: false,
  lite: PARAMS.lite || storedLite(),
  dev: false,
  panel: null,
  refsFocus: null,
  timerStart: Date.now(),
  liftCard: null,
  toasts: [],
  fade: false,

  next: () => {
    const { index, beat, coreOnly } = get();
    const nb = vis(index).find((b) => b > beat);
    if (nb !== undefined) return set((s) => ({ beat: nb, dir: 1, mode: 'step', navSeq: s.navSeq + 1 }));
    const j = nextIndex(index, coreOnly);
    if (j === null) return;
    set((s) => ({ index: j, beat: firstBeat(j), dir: 1, mode: 'step', navSeq: s.navSeq + 1, maxIndex: Math.max(s.maxIndex, j) }));
  },
  prev: () => {
    const { index, beat, coreOnly } = get();
    const pb = [...vis(index)].reverse().find((b) => b < beat);
    if (pb !== undefined) return set((s) => ({ beat: pb, dir: -1, mode: 'step', navSeq: s.navSeq + 1 }));
    const j = prevIndex(index, coreOnly);
    if (j === null) return;
    set((s) => ({ index: j, beat: lastBeat(j), dir: -1, mode: 'step', navSeq: s.navSeq + 1 }));
  },
  goto: (index, beat = 0, mode = 'jump') => {
    const i = Math.max(0, Math.min(SCENES.length - 1, index));
    const b = nearestBeat(i, Math.max(0, beat));
    set((s) => ({
      index: i,
      beat: b,
      dir: i >= s.index ? 1 : -1,
      mode,
      navSeq: s.navSeq + 1,
      maxIndex: Math.max(s.maxIndex, i),
      panel: s.panel === 'grid' ? null : s.panel,
    }));
  },
  gotoId: (id, beat = 0) => {
    const i = SCENES.findIndex((s) => s.id === id);
    if (i >= 0) get().goto(i, beat);
  },
  home: () => get().goto(0, 0),
  end: () => get().goto(SCENES.length - 1, lastBeat(SCENES.length - 1)),
  toggleCore: () => set((s) => ({ coreOnly: !s.coreOnly })),
  setLite: (v) => set({ lite: v }),
  toggleDev: () => set((s) => ({ dev: !s.dev })),
  openPanel: (p) => set({ panel: p }),
  togglePanel: (p) => set((s) => ({ panel: s.panel === p ? null : p, refsFocus: null })),
  openRef: (n) => set({ panel: 'refs', refsFocus: n }),
  resetTimer: () => set({ timerStart: Date.now() }),
  settle: (index) => set({ settledIndex: index }),
  setLiftCard: (t) => set({ liftCard: t }),
  toast: (t) => {
    const id = toastSeq++;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    if (t.ttl) setTimeout(() => get().dismissToast(id), t.ttl);
    return id;
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setFade: (v) => set({ fade: v }),
}));

export const currentScene = () => SCENES[useTour.getState().index];
