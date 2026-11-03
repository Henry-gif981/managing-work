import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { getAnchor, anchors } from '../three/anchors';
import { threeRefs } from '../three/refs';
import { toDesign, DESIGN_W, DESIGN_H } from '../util/design';
import { useTour } from '../state/store';
import { SCENES } from '../scenes';
import type { CalloutSpec } from '../content/types';

interface Reg {
  key: number;
  spec: CalloutSpec;
}
const useCallouts = create<{ list: Reg[]; add: (r: Reg) => void; remove: (k: number) => void }>((set) => ({
  list: [],
  add: (r) => set((s) => ({ list: [...s.list, r] })),
  remove: (k) => set((s) => ({ list: s.list.filter((r) => r.key !== k) })),
}));
let seq = 1;

/** <Callout from="#cell-id" to="anchor:scene:name" /> — leader line from a DOM element to a 3D anchor. */
export function Callout(spec: CalloutSpec) {
  useEffect(() => {
    const key = seq++;
    useCallouts.getState().add({ key, spec });
    return () => useCallouts.getState().remove(key);
  }, [spec.from, spec.to, spec.label]);
  return null;
}

// safe area (design px): leader lines are clamped inside it
const SAFE = { l: 72, t: 84, r: DESIGN_W - 48, b: DESIGN_H - 72 };
const v = new THREE.Vector3();

interface Geo {
  d: string;
  end: [number, number];
  off: boolean;
  angle: number;
}

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

function compute(spec: CalloutSpec): Geo | null {
  const el = document.querySelector(spec.from) as HTMLElement | null;
  const p = project(spec.to);
  if (!el || !p) return null;
  const r = el.getBoundingClientRect();
  const [x0, y0] = toDesign(r.left, r.top);
  const [x1, y1] = toDesign(r.right, r.bottom);
  const cx = (x0 + x1) / 2,
    cy = (y0 + y1) / 2;
  let ex = p.x,
    ey = p.y;
  let off = p.behind || ex < SAFE.l || ex > SAFE.r || ey < SAFE.t || ey > SAFE.b;
  if (off) {
    // clamp to the safe-area edge along the ray from the element centre
    let dx = ex - cx,
      dy = ey - cy;
    if (p.behind) {
      dx *= 1000;
      dy *= 1000;
    }
    const tx = dx > 0 ? (SAFE.r - 16 - cx) / dx : dx < 0 ? (SAFE.l + 16 - cx) / dx : Infinity;
    const ty = dy > 0 ? (SAFE.b - 16 - cy) / dy : dy < 0 ? (SAFE.t + 16 - cy) / dy : Infinity;
    const t = Math.max(0, Math.min(tx, ty, 1));
    ex = cx + dx * t;
    ey = cy + dy * t;
  }
  // start on the element edge facing the anchor
  const horiz = Math.abs(ex - cx) / (x1 - x0 + 1) > Math.abs(ey - cy) / (y1 - y0 + 1);
  const sx = horiz ? (ex > cx ? x1 : x0) : Math.min(Math.max(ex, x0 + 12), x1 - 12);
  const sy = horiz ? Math.min(Math.max(ey, y0 + 8), y1 - 8) : ey > cy ? y1 : y0;
  const mx = horiz ? (sx + ex) / 2 : sx,
    my = horiz ? sy : (sy + ey) / 2;
  const d = `M${sx},${sy} Q${mx},${my} ${ex},${ey}`;
  const angle = Math.atan2(ey - my, ex - mx);
  return { d, end: [ex, ey], off, angle };
}

/** SVG overlay drawing every registered callout, re-projected every frame. */
export function CalloutLayer() {
  const list = useCallouts((s) => s.list);
  const lite = useTour((s) => s.lite);
  const dev = useTour((s) => s.dev);
  const index = useTour((s) => s.index);
  const svg = useRef<SVGSVGElement>(null);
  const [, force] = useState(0);
  useEffect(() => {
    if (lite) return;
    let raf = 0;
    const loop = () => {
      const root = svg.current;
      if (root) {
        list.forEach((r) => {
          const g = root.querySelector(`[data-k="${r.key}"]`) as SVGGElement | null;
          if (!g) return;
          const geo = compute(r.spec);
          g.style.display = geo ? '' : 'none';
          if (!geo) return;
          g.querySelectorAll('path').forEach((p) => p.setAttribute('d', geo.d));
          const [ex, ey] = geo.end;
          const pin = g.querySelector('.pin-g') as SVGGElement;
          const arrow = g.querySelector('.arrow') as SVGPathElement;
          pin.style.display = geo.off ? 'none' : '';
          arrow.style.display = geo.off ? '' : 'none';
          pin.setAttribute('transform', `translate(${ex},${ey})`);
          arrow.setAttribute('transform', `translate(${ex},${ey}) rotate(${(geo.angle * 180) / Math.PI})`);
          const label = g.querySelector('text');
          if (label) {
            label.setAttribute('x', String(ex + 16));
            label.setAttribute('y', String(ey - 14));
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
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [list, lite, dev, index]);
  useEffect(() => force((n) => n + 1), [list]);
  if (lite) return null;
  return (
    <svg ref={svg} className="callouts" width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
      {list.map((r) => (
        <g key={r.key} data-k={r.key} style={{ display: 'none' }}>
          <path className="halo" />
          <path />
          <g className="pin-g">
            <circle className="pin-ring" r={11} />
            <circle className="pin-dot" r={5} />
          </g>
          <path className="arrow" d="M0,0 L-16,-9 L-16,9 Z" />
          {r.spec.label && <text>{r.spec.label}</text>}
        </g>
      ))}
      {dev && <g className="dev-anchors" />}
    </svg>
  );
}
