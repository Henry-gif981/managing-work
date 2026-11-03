import { SCENES } from '../scenes';
import { useTour } from './store';

/** "#scene-id/beat" with a 1-based beat. "#scene-id" means beat 1. */
export function parseHash(h: string): { index: number; beat: number } | null {
  const m = h.replace(/^#/, '').split('/');
  if (!m[0]) return null;
  const index = SCENES.findIndex((s) => s.id === m[0]);
  if (index < 0) return null;
  const b = m[1] ? parseInt(m[1], 10) : 1;
  return { index, beat: Number.isFinite(b) ? Math.max(0, b - 1) : 0 };
}

export function formatHash(index: number, beat: number) {
  return `#${SCENES[index].id}/${beat + 1}`;
}

export function initHashSync() {
  const p = parseHash(location.hash);
  if (p) useTour.getState().goto(p.index, p.beat, 'jump');
  else useTour.getState().goto(0, 0, 'jump');

  let last = '';
  useTour.subscribe((s) => {
    const h = formatHash(s.index, s.beat);
    if (h !== last && h !== location.hash) {
      last = h;
      history.replaceState(null, '', location.pathname + location.search + h);
    }
  });
  window.addEventListener('hashchange', () => {
    const q = parseHash(location.hash);
    const s = useTour.getState();
    if (q && (q.index !== s.index || q.beat !== s.beat)) s.goto(q.index, q.beat, 'jump');
  });
}
