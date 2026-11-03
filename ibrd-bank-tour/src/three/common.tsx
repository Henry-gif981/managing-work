import * as THREE from 'three';
import { useMemo } from 'react';
import { Builder, type V3 } from './builder';

export const ROOM = { x0: -13, x1: 13, zFront: -0.6, zBack: -58, h: 9 };

/** Floor, ceiling, side walls, back wall with the lift opening. */
export function shell(b: Builder, y: number, o: { h?: number; frontDoor?: boolean; ceiling?: boolean } = {}) {
  const h = o.h ?? ROOM.h;
  const { x0, x1, zFront, zBack } = ROOM;
  const len = zFront - zBack;
  const zc = (zFront + zBack) / 2;
  const w = x1 - x0;
  // floor slab (marble) with an ink grid of tiles
  b.box('marble', [w, 0.3, len], [0, y - 0.15, zc], { edges: false });
  const pts: V3[] = [];
  for (let x = x0 + 2; x < x1; x += 2) pts.push([x, y + 0.005, zFront], [x, y + 0.005, zBack]);
  for (let z = zFront - 2; z > zBack; z -= 2) pts.push([x0, y + 0.005, z], [x1, y + 0.005, z]);
  b.lines(pts);
  // skirting
  b.box('stone2', [0.12, 0.3, len], [x0 + 0.06, y + 0.15, zc]);
  b.box('stone2', [0.12, 0.3, len], [x1 - 0.06, y + 0.15, zc]);
  // side walls
  b.box('stone1', [0.4, h, len], [x0 - 0.2, y + h / 2, zc], { edges: false });
  b.box('stone1', [0.4, h, len], [x1 + 0.2, y + h / 2, zc], { edges: false });
  // pilasters on side walls every 6 m
  for (let z = zFront - 4; z > zBack + 1; z -= 6) {
    b.box('stone2', [0.25, h, 0.7], [x0 + 0.12, y + h / 2, z]);
    b.box('stone2', [0.25, h, 0.7], [x1 - 0.12, y + h / 2, z]);
  }
  // cornice
  b.box('stone2', [0.5, 0.35, len], [x0 + 0.2, y + h - 0.3, zc]);
  b.box('stone2', [0.5, 0.35, len], [x1 - 0.2, y + h - 0.3, zc]);
  // back wall with lift opening (x -2.2..2.2, h 3.6)
  const lw = 2.2,
    lh = 3.6;
  b.box('stone1', [x1 - lw, h, 0.4], [(x1 + lw) / 2, y + h / 2, zBack - 0.2], { edges: false });
  b.box('stone1', [x1 - lw, h, 0.4], [-(x1 + lw) / 2, y + h / 2, zBack - 0.2], { edges: false });
  b.box('stone1', [lw * 2, h - lh, 0.4], [0, y + lh + (h - lh) / 2, zBack - 0.2], { edges: false });
  // steel lift portal + floor sign plate
  b.box('steel', [0.25, lh, 0.3], [-lw - 0.12, y + lh / 2, zBack + 0.05]);
  b.box('steel', [0.25, lh, 0.3], [lw + 0.12, y + lh / 2, zBack + 0.05]);
  b.box('steel', [lw * 2 + 0.5, 0.3, 0.3], [0, y + lh + 0.15, zBack + 0.05]);
  b.box('navy', [1.2, 0.5, 0.05], [0, y + lh + 0.65, zBack + 0.02]);
  // front wall
  if (o.frontDoor) {
    const dw = 1.6,
      dh = 5.2;
    b.box('stone1', [x1 - dw, h, 0.3], [(x1 + dw) / 2, y + h / 2, zFront - 0.15], { edges: false });
    b.box('stone1', [x1 - dw, h, 0.3], [-(x1 + dw) / 2, y + h / 2, zFront - 0.15], { edges: false });
    b.box('stone1', [dw * 2, h - dh, 0.3], [0, y + dh + (h - dh) / 2, zFront - 0.15], { edges: false });
    b.box('stone2', [dw * 2 + 0.6, 0.35, 0.4], [0, y + dh + 0.17, zFront - 0.2]);
  } else {
    b.box('stone1', [w, h, 0.3], [0, y + h / 2, zFront - 0.15], { edges: false });
  }
  // wall/floor and wall/ceiling ink lines
  b.lines([
    [x0, y + 0.01, zFront],
    [x0, y + 0.01, zBack],
    [x1, y + 0.01, zFront],
    [x1, y + 0.01, zBack],
    [x0, y + 0.01, zBack],
    [x1, y + 0.01, zBack],
  ]);
  if (o.ceiling !== false) {
    b.box('white', [w, 0.3, len], [0, y + h + 0.15, zc], { edges: false });
  }
}

/** Coffered ceiling grid under a ceiling at height y. */
export function coffers(b: Builder, y: number, x0: number, x1: number, z0: number, z1: number, step = 3) {
  for (let x = x0; x <= x1 + 0.01; x += step) b.box('stone2', [0.3, 0.4, Math.abs(z1 - z0)], [x, y - 0.2, (z0 + z1) / 2]);
  for (let z = z0; z >= z1 - 0.01; z -= step) b.box('stone2', [Math.abs(x1 - x0), 0.4, 0.3], [(x0 + x1) / 2, y - 0.2, z]);
}

/** Merge everything a builder function adds into a single static group. */
export function Static({ build }: { build: (b: Builder) => void }) {
  const group = useMemo(() => {
    const b = new Builder();
    build(b);
    return b.build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <primitive object={group} />;
}

const planeGeo = new THREE.PlaneGeometry(1, 1);
/** Textured plane (labels, maps, boards). One draw call each: keep them few. */
export function TexPlane({
  tex,
  position,
  rotation = [0, 0, 0],
  size,
  transparent = false,
}: {
  tex: THREE.Texture;
  position: V3;
  rotation?: V3;
  size: [number, number];
  transparent?: boolean;
}) {
  const m = useMemo(() => new THREE.MeshBasicMaterial({ map: tex, transparent, toneMapped: false }), [tex, transparent]);
  return <mesh geometry={planeGeo} material={m} position={position} rotation={rotation} scale={[size[0], size[1], 1]} />;
}

export const FACE = {
  /** plane faces +x (mounted on the left wall) */
  east: [0, Math.PI / 2, 0] as V3,
  /** plane faces -x (mounted on the right wall) */
  west: [0, -Math.PI / 2, 0] as V3,
  /** faces +z (towards the front door) */
  south: [0, 0, 0] as V3,
  /** faces -z (towards the lift) */
  north: [0, Math.PI, 0] as V3,
};
