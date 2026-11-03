import type * as THREE from 'three';

/** Live references to the R3F camera/renderer, for DOM-side projection (callouts). */
export const threeRefs: { camera: THREE.PerspectiveCamera | null; gl: THREE.WebGLRenderer | null } = {
  camera: null,
  gl: null,
};

/** Perf counters, written by <Perf/> every frame, read by the dev HUD. */
export const perf = { calls: 0, tris: 0, fps: 0 };
