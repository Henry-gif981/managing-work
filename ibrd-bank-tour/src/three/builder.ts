import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { inkMaterial, mat, type MatKey } from './materials';

export type V3 = [number, number, number];

export interface PartOpts {
  rot?: V3;
  scale?: V3;
  /** outline threshold angle in degrees; false disables outlines */
  edges?: number | false;
}

/**
 * Accumulates primitive geometry by material key and merges it on build():
 * one Mesh per material + one LineSegments for all ink outlines.
 * This keeps a whole furnished room near ~10 draw calls.
 */
export class Builder {
  private parts = new Map<MatKey, THREE.BufferGeometry[]>();
  private edges: THREE.BufferGeometry[] = [];
  /** stack of group transforms (for building props in local space) */
  private stack: THREE.Matrix4[] = [new THREE.Matrix4()];

  push(pos: V3, rotY = 0, scale = 1) {
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(...pos),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
      new THREE.Vector3(scale, scale, scale),
    );
    this.stack.push(this.top().clone().multiply(m));
    return this;
  }
  pop() {
    if (this.stack.length > 1) this.stack.pop();
    return this;
  }
  /** Run fn with a local transform. */
  at(pos: V3, rotY: number, fn: (b: Builder) => void, scale = 1) {
    this.push(pos, rotY, scale);
    fn(this);
    this.pop();
    return this;
  }
  private top() {
    return this.stack[this.stack.length - 1];
  }

  add(key: MatKey, geom: THREE.BufferGeometry, pos: V3, o: PartOpts = {}) {
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(...pos),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...(o.rot ?? [0, 0, 0]))),
      new THREE.Vector3(...(o.scale ?? [1, 1, 1])),
    );
    m.premultiply(this.top());
    let g = geom.index ? geom.toNonIndexed() : geom.clone();
    // keep only shared attributes so everything merges
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    if (!g.attributes.uv) {
      const n = g.attributes.position.count;
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
    }
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(m);
    (this.parts.get(key) ?? this.parts.set(key, []).get(key)!).push(g);
    if (o.edges !== false && key !== 'glass' && key !== 'spill' && key !== 'cyanGlow' && key !== 'warnGlow') {
      const e = new THREE.EdgesGeometry(geom, o.edges ?? 25);
      e.applyMatrix4(m);
      this.edges.push(e);
    }
    geom.dispose();
    return this;
  }

  box(key: MatKey, size: V3, pos: V3, o?: PartOpts) {
    return this.add(key, new THREE.BoxGeometry(...size), pos, o);
  }
  cyl(key: MatKey, rTop: number, rBot: number, h: number, pos: V3, segs = 16, o?: PartOpts) {
    return this.add(key, new THREE.CylinderGeometry(rTop, rBot, h, segs), pos, o);
  }
  sphere(key: MatKey, r: number, pos: V3, segs = 16, o?: PartOpts) {
    return this.add(key, new THREE.SphereGeometry(r, segs, Math.max(6, segs / 2)), pos, { edges: 60, ...o });
  }
  cone(key: MatKey, r: number, h: number, pos: V3, segs = 12, o?: PartOpts) {
    return this.add(key, new THREE.ConeGeometry(r, h, segs), pos, o);
  }
  torus(key: MatKey, r: number, tube: number, pos: V3, o?: PartOpts) {
    return this.add(key, new THREE.TorusGeometry(r, tube, 6, 24), pos, { edges: 70, ...o });
  }
  plane(key: MatKey, w: number, h: number, pos: V3, o?: PartOpts) {
    return this.add(key, new THREE.PlaneGeometry(w, h), pos, o);
  }
  /** Extrude a 2D shape (in XY) along +Z by depth. */
  extrude(key: MatKey, shape: THREE.Shape, depth: number, pos: V3, o?: PartOpts) {
    return this.add(key, new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 10 }), pos, o);
  }
  /** Thin "ink only" line segments (e.g. drawings on a board). Points are pairs. */
  lines(points: V3[]) {
    const g = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p)));
    g.applyMatrix4(this.top());
    this.edges.push(g);
    return this;
  }

  build(): THREE.Group {
    const group = new THREE.Group();
    for (const [key, geoms] of this.parts) {
      const merged = mergeGeometries(geoms, false);
      geoms.forEach((g) => g.dispose());
      if (!merged) continue;
      merged.computeBoundingSphere();
      const mesh = new THREE.Mesh(merged, mat(key));
      mesh.name = 'merged:' + key;
      if (key === 'glass') mesh.renderOrder = 2;
      group.add(mesh);
    }
    if (this.edges.length) {
      const merged = mergeGeometries(
        this.edges.map((e) => {
          for (const n of Object.keys(e.attributes)) if (n !== 'position') e.deleteAttribute(n);
          return e.index ? e.toNonIndexed() : e;
        }),
        false,
      );
      if (merged) {
        const lines = new THREE.LineSegments(merged, inkMaterial());
        lines.name = 'ink';
        group.add(lines);
      }
    }
    this.parts.clear();
    this.edges = [];
    return group;
  }
}

/* ---------- reusable prop helpers (all in local space via b.at) ---------- */

/** Fluted column: base, shaft, capital. */
export function column(b: Builder, pos: V3, h: number, r = 0.45, key: MatKey = 'stone1') {
  b.at(pos, 0, (c) => {
    c.box('stone2', [r * 2.6, 0.3, r * 2.6], [0, 0.15, 0]);
    c.cyl(key, r * 1.15, r * 1.25, 0.25, [0, 0.42, 0], 20);
    c.cyl(key, r * 0.92, r, h - 1.1, [0, 0.55 + (h - 1.1) / 2, 0], 16, { edges: 20 });
    c.cyl(key, r * 1.25, r * 0.95, 0.3, [0, h - 0.4, 0], 20);
    c.box('stone2', [r * 2.7, 0.25, r * 2.7], [0, h - 0.12, 0]);
  });
}

export function arch(width: number, height: number, thickness = 0.4) {
  const s = new THREE.Shape();
  const r = width / 2;
  s.moveTo(-r - thickness, 0);
  s.lineTo(-r - thickness, height - r);
  s.absarc(0, height - r, r + thickness, Math.PI, 0, true);
  s.lineTo(r + thickness, 0);
  s.lineTo(r, 0);
  s.lineTo(r, height - r);
  s.absarc(0, height - r, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  return s;
}

/** Arched window outline shape (solid). */
export function archShape(width: number, height: number) {
  const s = new THREE.Shape();
  const r = width / 2;
  s.moveTo(-r, 0);
  s.lineTo(-r, height - r);
  s.absarc(0, height - r, r, Math.PI, 0, true);
  s.lineTo(r, 0);
  s.lineTo(-r, 0);
  return s;
}

/** Simple desk / table. */
export function table(b: Builder, pos: V3, w: number, d: number, h = 0.78, rotY = 0, top: MatKey = 'wood') {
  b.at(pos, rotY, (t) => {
    t.box(top, [w, 0.07, d], [0, h, 0]);
    const lx = w / 2 - 0.08,
      lz = d / 2 - 0.08;
    for (const [x, z] of [
      [lx, lz],
      [-lx, lz],
      [lx, -lz],
      [-lx, -lz],
    ])
      t.box('steel', [0.06, h, 0.06], [x, h / 2, z], { edges: false });
  });
}

export function chair(b: Builder, pos: V3, rotY = 0) {
  b.at(pos, rotY, (c) => {
    c.box('navy', [0.45, 0.06, 0.45], [0, 0.46, 0]);
    c.box('navy', [0.45, 0.5, 0.05], [0, 0.72, -0.2]);
    for (const [x, z] of [
      [0.19, 0.19],
      [-0.19, 0.19],
      [0.19, -0.19],
      [-0.19, -0.19],
    ])
      c.box('steel', [0.04, 0.46, 0.04], [x, 0.23, z], { edges: false });
  });
}

/** A ledger book lying or standing. */
export function ledger(b: Builder, pos: V3, standing = true, key: MatKey = 'navy', rotY = 0) {
  b.at(pos, rotY, (l) => {
    if (standing) {
      l.box(key, [0.09, 0.42, 0.3], [0, 0.21, 0]);
      l.box('paper', [0.08, 0.38, 0.02], [0, 0.21, 0.15], { edges: false });
    } else {
      l.box(key, [0.42, 0.07, 0.3], [0, 0.035, 0]);
      l.box('paper', [0.4, 0.05, 0.28], [0.01, 0.035, 0], { edges: false });
    }
  });
}

/** Balance scales. */
export function scales(b: Builder, pos: V3, s = 1) {
  b.at(
    pos,
    0,
    (k) => {
      k.cyl('steel', 0.22, 0.28, 0.08, [0, 0.04, 0], 16);
      k.cyl('steel', 0.03, 0.03, 0.9, [0, 0.5, 0], 8);
      k.box('steel', [1.0, 0.04, 0.04], [0, 0.95, 0]);
      for (const x of [-0.48, 0.48]) {
        k.lines([
          [x, 0.95, 0],
          [x - 0.14, 0.62, 0],
          [x, 0.95, 0],
          [x + 0.14, 0.62, 0],
        ]);
        k.cyl('blue', 0.18, 0.12, 0.05, [x, 0.6, 0], 16);
      }
      k.sphere('cyan', 0.05, [0, 1.0, 0], 10);
    },
    s,
  );
}

/** Notice / display board with a frame; content can be a texture plane added separately. */
export function board(b: Builder, pos: V3, w: number, h: number, rotY = 0, face: MatKey = 'paper') {
  b.at(pos, rotY, (k) => {
    k.box('navy', [w + 0.16, h + 0.16, 0.06], [0, 0, 0]);
    k.box(face, [w, h, 0.02], [0, 0, 0.04], { edges: false });
  });
}

/** Simple lattice pylon. */
export function pylon(b: Builder, pos: V3, h: number, arms: number, key: MatKey = 'steel') {
  b.at(pos, 0, (p) => {
    const w0 = h * 0.18,
      w1 = h * 0.05;
    const legs: [number, number][] = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    const pts: V3[] = [];
    for (const [sx, sz] of legs) {
      pts.push([sx * w0, 0, sz * w0], [sx * w1, h, sz * w1]);
    }
    // cross bracing
    const levels = 5;
    for (let i = 0; i < levels; i++) {
      const y0 = (h * i) / levels,
        y1 = (h * (i + 1)) / levels;
      const wa = w0 + (w1 - w0) * (i / levels),
        wb = w0 + (w1 - w0) * ((i + 1) / levels);
      for (const s of [1, -1]) {
        pts.push([-wa, y0, s * wa], [wb, y1, s * wb], [wa, y0, s * wa], [-wb, y1, s * wb]);
        pts.push([s * wa, y0, -wa], [s * wb, y1, wb], [s * wa, y0, wa], [s * wb, y1, -wb]);
      }
    }
    p.lines(pts);
    for (const [sx, sz] of legs)
      p.add(key, new THREE.CylinderGeometry(0.025, 0.035, h * 1.003, 4), [((w0 + w1) / 2) * sx, h / 2, ((w0 + w1) / 2) * sz], {
        rot: [sz * Math.atan((w0 - w1) / h), 0, -sx * Math.atan((w0 - w1) / h)],
        edges: false,
      });
    for (let a = 0; a < arms; a++) {
      const y = h * (0.62 + a * 0.15);
      const len = h * (0.42 - a * 0.08);
      p.box(key, [len, 0.05, 0.05], [0, y, 0]);
      for (const x of [-len / 2, len / 2]) p.cyl('navy', 0.025, 0.025, 0.14, [x, y - 0.09, 0], 6, { edges: false });
    }
  });
}

/** Little gable house. */
export function house(b: Builder, pos: V3, s = 1, rotY = 0, roof: MatKey = 'blue') {
  b.at(
    pos,
    rotY,
    (h) => {
      h.box('white', [0.5, 0.36, 0.42], [0, 0.18, 0]);
      const r = new THREE.Shape();
      r.moveTo(-0.3, 0);
      r.lineTo(0, 0.22);
      r.lineTo(0.3, 0);
      r.lineTo(-0.3, 0);
      h.extrude(roof, r, 0.48, [0, 0.36, -0.24]);
      h.box('navy', [0.1, 0.16, 0.01], [0.1, 0.08, 0.215], { edges: false });
    },
    s,
  );
}
