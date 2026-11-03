import * as THREE from 'three';
import { tokenColor } from '../theme';

/** Material keys. Each maps to ONE shared material, so a merged room is ~1 draw call per key. */
export type MatKey =
  | 'stone1'
  | 'stone2'
  | 'steel'
  | 'marble'
  | 'ground'
  | 'navy'
  | 'blue'
  | 'cyan'
  | 'warn'
  | 'bad'
  | 'good'
  | 'wood'
  | 'paper'
  | 'white'
  | 'glass'
  | 'cyanGlow'
  | 'warnGlow'
  | 'spill'
  | 'windowOff';

const TOKEN: Record<MatKey, string> = {
  stone1: '--stone-1',
  stone2: '--stone-2',
  steel: '--steel',
  marble: '--marble',
  ground: '--ground',
  navy: '--wb-navy',
  blue: '--wb-blue',
  cyan: '--wb-cyan',
  warn: '--warn',
  bad: '--bad',
  good: '--good',
  wood: '--wood',
  paper: '--paper',
  white: '--page',
  glass: '--glass',
  cyanGlow: '--wb-cyan',
  warnGlow: '--warn',
  spill: '--spill',
  windowOff: '--stone-2',
};

let gradient: THREE.DataTexture | null = null;
/** 4-step toon ramp, kept bright so the stone reads pale. */
export function toonGradient() {
  if (gradient) return gradient;
  const steps = [150, 200, 235, 255];
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => data.set([v, v, v, 255], i * 4));
  gradient = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

const cache = new Map<string, THREE.Material>();

export function mat(key: MatKey): THREE.Material {
  const hit = cache.get(key);
  if (hit) return hit;
  const color = tokenColor(TOKEN[key]);
  let m: THREE.Material;
  if (key === 'glass') {
    m = new THREE.MeshToonMaterial({
      color,
      gradientMap: toonGradient(),
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  } else if (key === 'cyanGlow' || key === 'warnGlow' || key === 'spill') {
    m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
  } else {
    m = new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() });
  }
  m.name = key;
  cache.set(key, m);
  return m;
}

let ink: THREE.LineBasicMaterial | null = null;
export function inkMaterial() {
  if (!ink) {
    ink = new THREE.LineBasicMaterial({ color: tokenColor('--ink-line'), transparent: true, opacity: 0.75 });
    ink.name = 'ink';
  }
  return ink;
}

/** A private (non-shared) toon material, for animated or per-instance colours. */
export function ownMat(token: string, opts: Partial<THREE.MeshToonMaterialParameters> = {}) {
  return new THREE.MeshToonMaterial({ color: tokenColor(token), gradientMap: toonGradient(), ...opts });
}
