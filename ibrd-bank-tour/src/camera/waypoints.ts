/**
 * Camera waypoints. Tune with dev mode (D): fly, then press K to copy the current
 * pose as a literal like the ones below, and paste it here.
 *
 * World layout (metres): front facade at z = 0, building goes to -z.
 *   G (exit hall) y = -10 · Floor 1 y = 0 · Floor 2 y = 10 · Floor 3 y = 20
 *   Lift cabin at x = 0, z = -60, doors face +z.
 */
export type V3 = [number, number, number];
export interface Waypoint {
  pos: V3;
  target: V3;
  fov?: number;
  ease?: string;
  duration?: number;
}

export const DEFAULT_FOV = 50;
export const DEFAULT_DURATION = 1.8;
export const DEFAULT_EASE = 'power2.inOut';

/** Inside the lift cabin, looking at the doors, for a cabin floor height y. */
export function cabinPose(y: number): Waypoint {
  return { pos: [0, y + 1.65, -61.35], target: [0, y + 1.8, -57], fov: 55 };
}

export const WAYPOINTS: Record<string, Waypoint> = {
  // ---------------- exterior ----------------
  'ext-facade': { pos: [0, 2.2, 31], target: [0, 6.2, 0], fov: 50 },
  'ext-door-mid': { pos: [0, 1.9, 1.2], target: [0, 1.9, -10], fov: 72 },
  'ext-door': { pos: [0, 1.8, -3.6], target: [0, 1.9, -14], fov: 50 },

  // ---------------- floor 1 · lobby (introduction) ----------------
  'f1-rationale-1': { pos: [1.2, 2.0, -1.8], target: [5.5, 1.5, -6.4] },
  'f1-rationale-2': { pos: [4.2, 2.3, -6.0], target: [12.7, 3.0, -9.4] },
  'f1-problem': { pos: [-5.6, 2.1, -4.6], target: [-12.7, 2.4, -6.4] },
  'f1-objectives': { pos: [-1.4, 2.3, -4.4], target: [-5.0, 1.2, -11.0] },
  'f1-method': { pos: [-7.4, 2.0, -2.2], target: [-12.7, 2.3, -6.2] },
  'f1-scope': { pos: [2.2, 2.0, -12.6], target: [12.7, 3.1, -9.0] },
  'f1-structure': { pos: [0, 2.5, -3.2], target: [0, 3.0, -30], fov: 55 },

  // ---------------- floor 1 · banking hall (chapter 1) ----------------
  'f1-ch1-title': { pos: [0, 3.6, -15.2], target: [0, 4.0, -50], fov: 55 },
  'f1-what': { pos: [-1.0, 2.5, -42.5], target: [-6.5, 1.8, -52.5] },
  'f1-wbg': { pos: [0, 2.5, -16.6], target: [0, 1.2, -22.6] },
  'f1-history-1': { pos: [6.0, 2.2, -21.0], target: [12.5, 2.2, -26.0] },
  'f1-history-2': { pos: [7.0, 2.0, -33.0], target: [12.5, 2.2, -26.0] },
  'f1-gov': { pos: [-2.6, 3.0, -46.0], target: [-6.5, 2.0, -53.0] },
  'f1-voting': { pos: [-4.4, 2.1, -39.0], target: [-8.5, 0.9, -43.5] },
  'f1-funds': { pos: [3.4, 2.1, -40.0], target: [10.0, 1.6, -46.5] },
  'f1-instruments': { pos: [-4.0, 2.1, -24.0], target: [-10.5, 1.5, -30.0] },
  'f1-terms': { pos: [4.0, 2.0, -31.4], target: [8.0, 0.9, -36.5] },
  'f1-safeguards': { pos: [-5.0, 2.3, -47.6], target: [-8.5, 0.9, -43.0] },
  'lift-1-2': cabinPose(10),

  // ---------------- floor 2 · operations floor (chapter 2) ----------------
  'f2-ch2-title': { pos: [0, 12.6, -54.5], target: [0, 12.0, -20], fov: 55 },
  'f2-cycle': { pos: [2.6, 12.7, -36.2], target: [0, 10.8, -30] },
  'f2-vn-procedures': { pos: [-4.0, 12.1, -37.4], target: [-8.0, 11.0, -42.5] },
  'f2-disbursement': { pos: [-5.4, 11.9, -38.8], target: [-8.6, 11.1, -42.3] },
  'f2-counterpart': { pos: [-4.4, 12.1, -46.6], target: [-8.0, 10.9, -42.0] },
  'f2-ipf': { pos: [-3.2, 12.1, -26.8], target: [0, 10.9, -30.5] },
  'f2-dpf': { pos: [3.6, 12.1, -27.4], target: [0, 10.9, -30.5] },
  'f2-pforr': { pos: [0, 12.4, -25.4], target: [0, 10.8, -31.0] },
  'f2-prep': { pos: [3.4, 12.1, -42.0], target: [7.5, 10.9, -46.5] },
  'f2-asa': { pos: [5.0, 12.1, -28.0], target: [12.5, 11.8, -31.0] },
  'f2-me': { pos: [5.0, 12.1, -16.0], target: [12.6, 12.4, -12.0] },
  'f2-training-pmu': { pos: [-3.0, 12.5, -8.8], target: [-10.0, 11.0, -12.5] },
  'f2-training-knowledge': { pos: [-6.4, 12.1, -14.2], target: [-12.7, 12.2, -11.5] },
  'f2-institutional': { pos: [6.0, 14.6, -20.0], target: [-2.0, 10.5, -34.0], fov: 55 },
  'f2-three-forms': { pos: [0, 13.6, -8.0], target: [0, 11.0, -34.0], fov: 55 },
  'f2-package': { pos: [-6.0, 14.6, -52.0], target: [3.0, 10.5, -24.0], fov: 55 },
  'lift-2-3': cabinPose(20),

  // ---------------- floor 3 · context ----------------
  'f3-ch3-title': { pos: [0, 22.6, -55.0], target: [0, 22.0, -20], fov: 55 },
  'f3-1993': { pos: [-5.4, 22.1, -50.0], target: [-12.6, 22.5, -52.0] },
  'f3-ida-graduation': { pos: [-6.6, 22.0, -44.6], target: [-6.6, 21.1, -50.2] },
  'f3-sahep': { pos: [5.4, 22.1, -50.0], target: [12.6, 22.5, -52.0] },
  'f3-legal': { pos: [6.6, 22.0, -44.6], target: [6.6, 21.1, -50.2] },

  // ---------------- floor 3 · TEP (left half) ----------------
  'f3-tep-overview': { pos: [-1.0, 23.6, -46.5], target: [-7.0, 21.5, -32.0], fov: 55 },
  'f3-tep-cost': { pos: [-0.4, 22.1, -38.4], target: [-4.0, 20.6, -42.0] },
  'f3-tep-financing': { pos: [-2.4, 22.3, -46.4], target: [-6.5, 20.8, -41.0] },
  'f3-tep-impl': { pos: [-0.4, 22.1, -31.6], target: [-4.2, 21.0, -27.5] },
  'f3-tep-outputs': { pos: [1.5, 22.6, -31.5], target: [-2.0, 21.2, -38.5] },
  'f3-tep-outcomes': { pos: [-1.0, 22.5, -32.0], target: [-8.0, 23.0, -25.0] },
  'f3-tep-gap': { pos: [-6.4, 22.4, -30.0], target: [-12.6, 22.4, -32.5] },
  'f3-tep-assess': { pos: [-2.0, 24.0, -20.0], target: [-7.0, 21.0, -36.0], fov: 55 },

  // ---------------- floor 3 · CCSEP (right half) ----------------
  'f3-ccsep-overview': { pos: [1.0, 23.6, -46.5], target: [7.0, 21.5, -32.0], fov: 55 },
  'f3-ccsep-structure': { pos: [1.4, 22.1, -36.4], target: [6.0, 20.8, -40.5] },
  'f3-ccsep-cities': { pos: [4.0, 23.0, -30.0], target: [12.6, 23.2, -30.0] },
  'f3-ccsep-impl': { pos: [5.0, 22.4, -38.2], target: [10.0, 20.8, -33.5] },
  'f3-ccsep-results': { pos: [2.0, 22.5, -30.2], target: [6.0, 20.9, -25.0] },
  'f3-ccsep-nhatrang': { pos: [9.0, 22.2, -29.4], target: [12.6, 21.9, -28.8] },

  // ---------------- floor 3 · executive office (evaluation) ----------------
  'f3-eval-achievements': { pos: [0, 22.8, -16.6], target: [0, 21.0, -6.0], fov: 55 },
  'f3-eval-limitations': { pos: [-3.6, 22.3, -10.0], target: [0.5, 20.9, -5.5] },
  'f3-recs-1': { pos: [3.0, 22.0, -9.6], target: [0.8, 20.9, -6.5] },
  'f3-recs-2': { pos: [0, 22.4, -2.0], target: [0, 21.0, -10.0] },

  // ---------------- conclusion (lift ride down) ----------------
  'lift-down': cabinPose(-10),

  // ---------------- G · exit hall ----------------
  'ex-sources': { pos: [-2.0, -8.2, -46.0], target: [-7.7, -7.9, -41.0] },
  'ex-thanks': { pos: [0, -8.2, -45.0], target: [0, -7.3, -29.0], fov: 52 },
};

export function waypoint(id: string): Waypoint {
  return WAYPOINTS[id] ?? WAYPOINTS['ext-facade'];
}
