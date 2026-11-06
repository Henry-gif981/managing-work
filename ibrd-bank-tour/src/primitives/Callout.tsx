import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { getAnchor, anchors } from '../three/anchors';
import { threeRefs } from '../three/refs';
import { toDesign, DESIGN_W, DESIGN_H } from '../util/design';
import { useTour } from '../state/store';
import { SCENES } from '../scenes';
import type { CalloutSpec } from '../content/types';

/**
 * Leader lines from a DOM element to a projected 3D anchor.
 *
 * Rules (update part 5):
 *  1. The SVG layer sits BELOW the content cards and above the 3D canvas.
 *  2. A line starts on the nearest EDGE of its source element (a text card's inner `.card`, a table row's
 *     outer edge = the table edge), never at its centre.
 *  3. It is routed as a straight line, an elbow or a three-segment detour that avoids every text rectangle,
 *     card and HUD element (4 px padding). The shortest clear route wins.
 *  4. If no route is clear, the beat shows numbered pins (1, 2, 3) on the element and at the prop instead.
 * The geometry of every frame is published on window.__calloutGeo for `npm run check-lines`.
 */
interface Reg {
  key: number;
  spec: CalloutSpec;
  index: number;
}
const useCallouts = create<{ list: Reg[]; add: (r: Reg) => void; remove: (k: number) => void }>((set) => ({
  list: [],
  add: (r) => set((s) => ({ list: [...s.list, r] })),
  remove: (k) => set((s) => ({ list: s.list.filter((r) => r.key !== k) })),
}));
let seq = 1;

export function Callout(spec: CalloutSpec & { index?: number }) {
  useEffect(() => {
    const key = seq++;
    useCallouts.getState().add({ key, spec, index: spec.index ?? 0 });
    return () => useCallouts.getState().remove(key);
  }, [spec.from, spec.to, spec.label, spec.index]);
  return null;
}

const SAFE = { l: 72, t: 84, r: DESIGN_W - 48, b: DESIGN_H - 72 };
const LEGACY = typeof location !== 'undefined' && new URLSearchParams(location.search).get('legacylines') === '1';
const PAD = 4;
type Pt = [number, number];
interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
export interface CalloutGeo {
  from: string;
  to: string;
  mode: 'line' | 'pins' | 'hidden';
  points: Pt[];
  start?: Pt;
  end: Pt;
  off: boolean;
  label?: string;
  n: number;
}

const v = new THREE.Vector3();
function project(name: string): { x: number; y: number; behind: boolean } | null {
  const a = getAnchor(name);
  const c = threeRefs.camera;
  if (!a || !c) return null;
  a.getWorldPosition(v);
  const camSpace = v.clone().applyMatrix4(c.matrixWorldInverse);
  const behind = camSpace.z > 0;
  v.project(c);
  if (behind) {
    v.x = -v.x;
    v.y = -v.y;
  }
  const [x, y] = toDesign(((v.x + 1) / 2) * window.innerWidth, ((1 - v.y) / 2) * window.innerHeight);
  return { x, y, behind };
}

function toDesignRect(r: DOMRect): Rect {
  const [x0, y0] = toDesign(r.left, r.top);
  const [x1, y1] = toDesign(r.right, r.bottom);
  return { x0, y0, x1, y1 };
}

/** The element a line is attached to: a text card's inner .card, otherwise the element itself. */
export function sourceElement(sel: string): HTMLElement | null {
  const el = document.querySelector(sel) as HTMLElement | null;
  if (!el) return null;
  if (el.classList.contains('k-card') || el.classList.contains('k-titlecard')) return (el.querySelector(':scope > .card') as HTMLElement) ?? el;
  // a table row: attach to the table's outer edges horizontally (row rect already spans the table width)
  return el;
}

/** Obstacles: text rectangles in the design layer (excluding the source element and the callout layer), cards and HUD boxes. */
function collectObstacles(source: HTMLElement | null): Rect[] {
  const root = document.querySelector('.design');
  if (!root) return [];
  const out: Rect[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      if (!p || !n.textContent || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (p.closest('svg.callouts')) return NodeFilter.FILTER_REJECT;
      if (source && source.contains(p)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    range.selectNodeContents(n);
    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 1 || r.height < 1) continue;
      const d = toDesignRect(r);
      out.push({ x0: d.x0 - PAD, y0: d.y0 - PAD, x1: d.x1 + PAD, y1: d.y1 + PAD });
    }
  }
  for (const el of Array.from(root.querySelectorAll('.hud .tracker, .hud .floors, .hud .scene-info, .hud .counter, .hud .dev-hud, .toast, .panel, .grid-panel'))) {
    const d = toDesignRect(el.getBoundingClientRect());
    if (d.x1 - d.x0 > 1) out.push({ x0: d.x0 - PAD, y0: d.y0 - PAD, x1: d.x1 + PAD, y1: d.y1 + PAD });
  }
  return out;
}

/** Liang-Barsky: does segment a-b intersect rectangle r? */
function segHits(a: Pt, b: Pt, r: Rect): boolean {
  let t0 = 0,
    t1 = 1;
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  const p = [-dx, dx, -dy, dy];
  const q = [a[0] - r.x0, r.x1 - a[0], a[1] - r.y0, r.y1 - a[1]];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const t = q[i] / p[i];
      if (p[i] < 0) {
        if (t > t1) return false;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return false;
        if (t < t1) t1 = t;
      }
    }
  }
  return true;
}
const clear = (pts: Pt[], obs: Rect[]) => {
  for (let i = 0; i < pts.length - 1; i++) for (const r of obs) if (segHits(pts[i], pts[i + 1], r)) return false;
  return true;
};
const length = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const clampN = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Candidate routes from the source rect to the target point; returns the shortest clear one. */
function route(src: Rect, T: Pt, obs: Rect[]): Pt[] | null {
  const G = 8; // start just outside the element edge
  const starts: Pt[] = [
    [src.x0 - G, clampN(T[1], src.y0 + 10, src.y1 - 10)],
    [src.x1 + G, clampN(T[1], src.y0 + 10, src.y1 - 10)],
    [clampN(T[0], src.x0 + 14, src.x1 - 14), src.y0 - G],
    [clampN(T[0], src.x0 + 14, src.x1 - 14), src.y1 + G],
  ];
  const cands: Pt[][] = [];
  for (const S of starts) {
    cands.push([S, T]);
    cands.push([S, [T[0], S[1]], T]);
    cands.push([S, [S[0], T[1]], T]);
    // detours through horizontal and vertical gutters
    const ys = [SAFE.t + 14, SAFE.b - 14, src.y0 - 30, src.y1 + 30, T[1] - 40, T[1] + 40];
    const xs = [SAFE.l + 14, SAFE.r - 14, src.x0 - 40, src.x1 + 40, T[0] - 40, T[0] + 40];
    for (const y of ys) cands.push([S, [S[0], y], [T[0], y], T]);
    for (const x of xs) cands.push([S, [x, S[1]], [x, T[1]], T]);
  }
  let best: Pt[] | null = null,
    bestL = Infinity;
  for (const c of cands) {
    // the start must leave the element outward (not run back across it)
    if (c.some(([x, y]) => x < SAFE.l - 1 || x > SAFE.r + 1 || y < SAFE.t - 1 || y > SAFE.b + 1)) continue;
    if (!clear(c, [...obs, { x0: src.x0 + 1, y0: src.y0 + 1, x1: src.x1 - 1, y1: src.y1 - 1 }])) continue;
    const L = length(c);
    if (L < bestL) {
      bestL = L;
      best = c;
    }
  }
  return best;
}

/** Path with rounded corners through the points. */
function pathOf(pts: Pt[]): string {
  if (pts.length === 2) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1],
      [cx, cy] = pts[i],
      [nx, ny] = pts[i + 1];
    const r = Math.min(18, Math.hypot(cx - px, cy - py) / 2, Math.hypot(nx - cx, ny - cy) / 2);
    const a: Pt = [cx - (Math.sign(cx - px) * r || 0), cy - (Math.sign(cy - py) * r || 0)];
    const b: Pt = [cx + (Math.sign(nx - cx) * r || 0), cy + (Math.sign(ny - cy) * r || 0)];
    d += ` L${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0]},${last[1]}`;
}

let obsCache: { key: string; t: number; obs: Map<string, Rect[]> } = { key: '', t: 0, obs: new Map() };

function compute(spec: CalloutSpec, n: number, navKey: string): CalloutGeo | null {
  const el = sourceElement(spec.from);
  const p = project(spec.to);
  if (!el || !p) return null;
  const src = toDesignRect(el.getBoundingClientRect());
  const now = performance.now();
  if (obsCache.key !== navKey || now - obsCache.t > 400) obsCache = { key: navKey, t: now, obs: new Map() };
  let obs = obsCache.obs.get(spec.from);
  if (!obs) {
    obs = collectObstacles(el);
    obsCache.obs.set(spec.from, obs);
  }
  let T: Pt = [p.x, p.y];
  const off = p.behind || T[0] < SAFE.l || T[0] > SAFE.r || T[1] < SAFE.t || T[1] > SAFE.b;
  if (off) {
    const cx = (src.x0 + src.x1) / 2,
      cy = (src.y0 + src.y1) / 2;
    let dx = T[0] - cx,
      dy = T[1] - cy;
    if (p.behind) {
      dx *= 1000;
      dy *= 1000;
    }
    const tx = dx > 0 ? (SAFE.r - 20 - cx) / dx : dx < 0 ? (SAFE.l + 20 - cx) / dx : Infinity;
    const ty = dy > 0 ? (SAFE.b - 20 - cy) / dy : dy < 0 ? (SAFE.t + 20 - cy) / dy : Infinity;
    const t = Math.max(0, Math.min(tx, ty, 1));
    T = [cx + dx * t, cy + dy * t];
  }
  if (LEGACY) {
    // measurement only (?legacylines=1): the pre-update geometry, a curve from the element edge facing the anchor
    const cx = (src.x0 + src.x1) / 2,
      cy = (src.y0 + src.y1) / 2;
    const horiz = Math.abs(T[0] - cx) / (src.x1 - src.x0 + 1) > Math.abs(T[1] - cy) / (src.y1 - src.y0 + 1);
    const sx = horiz ? (T[0] > cx ? src.x1 : src.x0) : Math.min(Math.max(T[0], src.x0 + 12), src.x1 - 12);
    const sy = horiz ? Math.min(Math.max(T[1], src.y0 + 8), src.y1 - 8) : T[1] > cy ? src.y1 : src.y0;
    const mx = horiz ? (sx + T[0]) / 2 : sx,
      my = horiz ? sy : (sy + T[1]) / 2;
    const pts: Pt[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      pts.push([(1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * T[0], (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * T[1]]);
    }
    return { from: spec.from, to: spec.to, mode: 'line', points: pts, end: T, off, label: spec.label, n };
  }
  const inside = T[0] > src.x0 && T[0] < src.x1 && T[1] > src.y0 && T[1] < src.y1;
  const pts = inside ? null : route(src, T, obs);
  if (!pts) {
    // fallback: numbered pins on the element and at the prop
    return { from: spec.from, to: spec.to, mode: 'pins', points: [], start: [src.x1 - 4, src.y0 + 4], end: T, off, label: spec.label, n };
  }
  return { from: spec.from, to: spec.to, mode: 'line', points: pts, end: T, off, label: spec.label, n };
}

/** SVG layer drawing every registered callout, re-projected every frame. Rendered BELOW the content cards. */
export function CalloutLayer() {
  const list = useCallouts((s) => s.list);
  const lite = useTour((s) => s.lite);
  const dev = useTour((s) => s.dev);
  const index = useTour((s) => s.index);
  const navSeq = useTour((s) => s.navSeq);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (lite) return;
    let raf = 0;
    const loop = () => {
      const root = svg.current;
      const geos: CalloutGeo[] = [];
      if (root) {
        list.forEach((r, i) => {
          const g = root.querySelector(`[data-k="${r.key}"]`) as SVGGElement | null;
          if (!g) return;
          const geo = compute(r.spec, i + 1, String(navSeq));
          g.style.display = geo ? '' : 'none';
          if (!geo) return;
          geos.push(geo);
          const line = g.querySelector('.cl-line') as SVGGElement;
          const pins = g.querySelector('.cl-pins') as SVGGElement;
          const [ex, ey] = geo.end;
          if (geo.mode === 'line') {
            line.style.display = '';
            pins.style.display = 'none';
            const d = pathOf(geo.points);
            line.querySelectorAll('path.lp').forEach((p) => p.setAttribute('d', d));
            const pin = line.querySelector('.pin-g') as SVGGElement;
            const arrow = line.querySelector('.arrow') as SVGPathElement;
            const pr = geo.points[geo.points.length - 2];
            pin.style.display = geo.off ? 'none' : '';
            arrow.style.display = geo.off ? '' : 'none';
            pin.setAttribute('transform', `translate(${ex},${ey})`);
            arrow.setAttribute('transform', `translate(${ex},${ey}) rotate(${(Math.atan2(ey - pr[1], ex - pr[0]) * 180) / Math.PI})`);
            const label = line.querySelector('text');
            if (label) {
              const leftSide = ex > DESIGN_W - 300;
              label.setAttribute('x', String(leftSide ? ex - 16 : ex + 16));
              label.setAttribute('text-anchor', leftSide ? 'end' : 'start');
              label.setAttribute('y', String(ey - 14));
            }
          } else {
            // numbered pins are drawn by <CalloutPinsTop/> above the content
            line.style.display = 'none';
            pins.style.display = 'none';
          }
        });
        if (dev) {
          const prefix = `anchor:${SCENES[index].id}:`;
          const dots = root.querySelector('.dev-anchors') as SVGGElement | null;
          if (dots) {
            let html = '';
            for (const name of anchors.keys()) {
              if (!name.startsWith(prefix)) continue;
              const p = project(name);
              if (!p || p.behind) continue;
              html += `<circle class="dev-anchor" cx="${p.x}" cy="${p.y}" r="6"/><text class="dev-anchor-label" x="${p.x + 9}" y="${p.y - 8}">${name.slice(prefix.length)}</text>`;
            }
            dots.innerHTML = html;
          }
        }
      }
      (window as unknown as { __calloutGeo: CalloutGeo[] }).__calloutGeo = geos;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      (window as unknown as { __calloutGeo: CalloutGeo[] }).__calloutGeo = [];
    };
  }, [list, lite, dev, index, navSeq]);
  if (lite) return null;
  return (
    <svg ref={svg} className="callouts" width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
      {list.map((r, i) => (
        <g key={r.key} data-k={r.key} style={{ display: 'none' }}>
          <g className="cl-line">
            <path className="lp halo" />
            <path className="lp" />
            <g className="pin-g">
              <circle className="pin-ring" r={11} />
              <circle className="pin-dot" r={5} />
            </g>
            <path className="arrow" d="M0,0 L-16,-9 L-16,9 Z" />
            {r.spec.label && <text>{r.spec.label}</text>}
          </g>
          <g className="cl-pins" style={{ display: 'none' }}>
            {(['np-src', 'np-dst'] as const).map((c) => (
              <g key={c} className={`num-pin ${c}`}>
                <circle r={15} />
                <text y={6} textAnchor="middle">
                  {i + 1}
                </text>
              </g>
            ))}
          </g>
        </g>
      ))}
      {dev && <g className="dev-anchors" />}
    </svg>
  );
}

/** Numbered pins for beats whose line could not be routed; drawn ABOVE the content so the element pin is visible. */
export function CalloutPinsTop() {
  const lite = useTour((s) => s.lite);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (lite) return;
    let raf = 0;
    const loop = () => {
      const root = svg.current;
      if (root) {
        const geos = ((window as unknown as { __calloutGeo?: CalloutGeo[] }).__calloutGeo ?? []).filter((g) => g.mode === 'pins');
        root.innerHTML = geos
          .map((g) =>
            [g.start!, g.end]
              .map(([x, y]) => `<g class="num-pin" transform="translate(${x},${y})"><circle r="15"/><text y="6" text-anchor="middle">${g.n}</text></g>`)
              .join(''),
          )
          .join('');
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [lite]);
  if (lite) return null;
  return <svg ref={svg} className="callouts callouts-top" width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`} />;
}
