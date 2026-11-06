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
  'f1-rationale-2': { pos: [5.6, 2.4, -11.2], target: [12.7, 3.0, -10.6] },
  'f1-problem': { pos: [-5.0, 2.2, -4.4], target: [-12.7, 2.4, -8.6] },
  'f1-structure': { pos: [0, 2.5, -3.2], target: [0, 3.0, -30], fov: 55 },

  // ---------------- floor 1 · banking hall (chapter 1) ----------------
  'f1-ch1-title': { pos: [0, 3.6, -15.2], target: [0, 4.0, -50], fov: 55 },
  'f1-what': { pos: [0.6, 2.4, -14.4], target: [5.6, 1.4, -19.4] },
  'f1-wbg': { pos: [-2.8, 2.7, -16.4], target: [1.4, 1.1, -22.6] },
  'f1-history-1': { pos: [6.0, 2.2, -21.0], target: [12.5, 2.2, -26.0] },
  'f1-history-2': { pos: [7.0, 2.0, -33.0], target: [12.5, 2.2, -26.0] },
  'f1-gov': { pos: [-2.6, 3.0, -46.0], target: [-6.5, 2.0, -53.0] },
  'f1-funds': { pos: [4.4, 3.4, -47.4], target: [11.2, 1.7, -46.4] },
  'f1-instruments': { pos: [-1.0, 2.4, -29.0], target: [-10.4, 1.7, -28.6], fov: 55 },
  'f1-wbg-table': { pos: [5.84, 2.75, -22.57], target: [-0.83, 1.82, -26.88] },
  'f1-instruments-table': { pos: [-9.3, 3.46, -18.04], target: [-5.37, 2.72, -24.97] },
  'f1-terms-table': { pos: [2.28, 1.64, -29.85], target: [9.86, 1.35, -32.4] },
  'f1-safeguards-table': { pos: [-4.24, 2.91, -41.63], target: [-11.38, 1.37, -44.89] },
  'f1-terms': { pos: [4.0, 2.0, -31.4], target: [8.0, 0.9, -36.5] },
  'f1-safeguards': { pos: [-4.2, 2.2, -42.8], target: [-9.8, 0.9, -40.6] },
  'lift-1-2': cabinPose(10),

  // ---------------- floor 2 · operations floor (chapter 2) ----------------
  'f2-ch2-title': { pos: [0, 12.6, -54.5], target: [10, 13.4, -20], fov: 55 },
  'f2-cycle': { pos: [2.6, 12.7, -36.2], target: [0, 10.8, -30] },
  'f2-vn-procedures': { pos: [-4.0, 12.1, -37.4], target: [-8.0, 11.0, -42.5] },
  'f2-disbursement': { pos: [-5.4, 11.9, -38.8], target: [-8.6, 11.1, -42.3] },
  'f2-counterpart': { pos: [-3.43, 13.2, -44.17], target: [-9.84, 11.5, -39.7] },
  'f2-ipf': { pos: [-3.2, 12.1, -26.8], target: [0, 10.9, -30.5] },
  'f2-dpf': { pos: [-2.73, 12.4, -34.34], target: [1.34, 11.23, -27.55] },
  'f2-pforr': { pos: [0, 12.4, -25.4], target: [0, 10.8, -31.0] },
  'f2-prep': { pos: [1.54, 12.02, -45.82], target: [9.36, 11.2, -47.28] },
  'f2-asa': { pos: [5.0, 12.1, -28.0], target: [12.5, 11.8, -31.0] },
  'f2-me': { pos: [5.0, 12.1, -16.0], target: [12.6, 12.4, -12.0] },
  'f2-training-pmu': { pos: [-3.0, 12.5, -8.8], target: [-10.0, 11.0, -12.5] },
  'f2-training-knowledge': { pos: [-6.4, 12.1, -14.2], target: [-12.7, 12.2, -11.5] },
  'f2-institutional': { pos: [6.0, 14.6, -20.0], target: [-2.0, 10.5, -34.0], fov: 55 },
  'f2-three-forms': { pos: [0, 13.6, -8.0], target: [0, 11.0, -34.0], fov: 55 },
  'f2-package': { pos: [-6.0, 14.6, -52.0], target: [3.0, 10.5, -24.0], fov: 55 },
  // ---- Floor 2 table / diagram beats: props framed in the band left of the table (scripts/frame-props.mjs)
  'f2-cycle-s1': { pos: [0.54, 13.6, -33.2], target: [-4.17, 11.35, -27.14] },
  'f2-cycle-s2': { pos: [-0.08, 12.68, -34.34], target: [-1.8, 11.2, -26.67] },
  'f2-cycle-s3': { pos: [2.12, 13.36, -36.49], target: [-2.34, 11.31, -30.17] },
  'f2-cycle-s4': { pos: [2.39, 13.64, -27.36], target: [3.1, 11.35, -34.99] },
  'f2-cycle-s5': { pos: [-5.44, 12.64, -35.49], target: [-4.46, 11.19, -27.68] },
  'f2-cycle-restructure': { pos: [-4.16, 12.52, -36.32], target: [0.7, 11.17, -30.1] },
  'f2-cycle-s6': { pos: [1.37, 12.59, -33.73], target: [-5.81, 11.18, -30.49] },
  'f2-disbursement-table': { pos: [0.2, 13.06, -44.78], target: [-7.18, 12.08, -47.72] },
  'f2-vn-procedures-table': { pos: [-8.9, 12.3, -36.66], target: [-4.11, 11.26, -42.99] },
  'f2-asa-table': { pos: [6.23, 12.65, -28.36], target: [13.9, 12.61, -26.1] },
  'f2-institutional-tep-asset': { pos: [0.46, 11.82, -42.28], target: [-5.87, 11.52, -47.16] },
  'f2-institutional-tep-tariff': { pos: [0.46, 11.82, -42.28], target: [-5.87, 11.52, -47.16] },
  'f2-institutional-ccsep-psmu': { pos: [3.95, 13.5, -26.27], target: [2.03, 11.42, -33.75] },
  'f2-institutional-ccsep-tariff': { pos: [0.46, 11.82, -42.28], target: [-5.87, 11.52, -47.16] },
  'f2-institutional-ccsep-contracts': { pos: [2.6, 13.26, -43.8], target: [10.38, 11.42, -43.53] },
  'f2-institutional-cb': { pos: [-10.01, 13.81, -38.53], target: [-13.39, 11.5, -45.4] },
  'f2-three-forms-prep': { pos: [1.7, 12.82, -46.15], target: [8.66, 11.35, -42.49] },
  'f2-three-forms-impl': { pos: [-2.71, 12.56, -41.41], target: [-8.48, 11.3, -46.81] },
  'f2-three-forms-after': { pos: [7.49, 11.75, -8.92], target: [15.48, 12.27, -8.76] },
  'lift-2-3': cabinPose(20),

  // ---------------- floor 3 · context ----------------
  'f3-ch3-title': { pos: [0, 22.6, -55.0], target: [0, 22.0, -20], fov: 55 },
  'f3-1993': { pos: [-5.4, 22.1, -50.0], target: [-12.6, 22.5, -52.0] },
  'f3-ida-graduation': { pos: [-6.6, 22.0, -44.6], target: [-6.6, 21.1, -50.2] },
  'f3-sahep': { pos: [5.4, 22.1, -50.0], target: [12.6, 22.5, -52.0] },
  'f3-legal': { pos: [6.6, 22.0, -44.6], target: [6.6, 21.1, -50.2] },

  'f3-ida-graduation-table': { pos: [-10.9, 22.75, -46.38], target: [-3.23, 21.01, -47.84] },
  'f3-sahep-table': { pos: [9.14, 22.4, -47.85], target: [9.89, 22.56, -55.81] },
  'f3-legal-table': { pos: [2.45, 21.93, -46.28], target: [4.6, 20.86, -53.91] },
  // ---------------- floor 3 · TEP (left half) ----------------
  'f3-tep-overview': { pos: [-1.0, 23.6, -46.5], target: [-7.0, 21.5, -32.0], fov: 55 },
  'f3-tep-cost': { pos: [-0.4, 22.1, -38.4], target: [-4.0, 20.6, -42.0] },
  'f3-tep-financing': { pos: [-0.5, 22.6, -47.5], target: [-5.0, 20.8, -41.5] },
  'f3-tep-impl': { pos: [-0.4, 22.1, -31.6], target: [-4.2, 21.0, -27.5] },
  'f3-tep-outputs': { pos: [1.5, 22.6, -31.5], target: [-2.0, 21.2, -38.5] },
  'f3-tep-outcomes': { pos: [-1.0, 22.5, -32.0], target: [-8.0, 23.0, -25.0] },
  'f3-tep-gap': { pos: [-6.4, 22.4, -30.0], target: [-12.6, 22.4, -32.5] },
  'f3-tep-assess': { pos: [-2.0, 24.0, -20.0], target: [-7.0, 21.0, -36.0], fov: 55 },

  // ---- per-prop cameras for TEP table/chart beats (prop in the left band; scripts/frame-props.mjs)
  'f3-prop-transformer': { pos: [-2.48, 23.31, -41.69], target: [-9.68, 22.04, -38.46] },
  'f3-prop-transformer-capacity': { pos: [-10.5, 22.48, -31.89], target: [-2.76, 21.83, -33.82] },
  'f3-prop-pylons': { pos: [-6.32, 22.06, -30.34], target: [-12.46, 23.51, -25.42] },
  'f3-prop-infra': { pos: [-7.64, 22.65, -19.82], target: [-6.84, 23.8, -27.7] },
  'f3-prop-new-lines': { pos: [-4.04, 23.77, -24.45], target: [-10.05, 24.38, -29.69] },
  'f3-prop-pylon-500': { pos: [-5.4, 23.98, -21.39], target: [-7.99, 24.44, -28.95] },
  'f3-prop-rehab-lines': { pos: [-10.82, 23.7, -30.55], target: [-11.92, 23.63, -22.63] },
  'f3-prop-pylon-220': { pos: [-7.53, 23.48, -17.21], target: [-2.21, 23.27, -23.17] },
  'f3-prop-substation': { pos: [-8.56, 22.69, -47.44], target: [-13.77, 21.58, -41.47] },
  'f3-prop-smartgrid': { pos: [-4.42, 23.82, -39.13], target: [-8.83, 21.81, -45.49] },
  'f3-prop-smartgrid-500kv': { pos: [-5.75, 21.92, -45.76], target: [-13.62, 21.35, -44.43] },
  'f3-prop-smartgrid-220kv': { pos: [-10.41, 22.1, -47.79], target: [-13.13, 21.4, -40.3] },
  'f3-prop-cash': { pos: [1.24, 23.09, -38.78], target: [-2.13, 21.45, -45.85] },
  'f3-prop-capacity': { pos: [-1.9, 22.24, -33.29], target: [-8.39, 21.39, -28.69] },
  'f3-prop-drafting': { pos: [-7.69, 23.06, -32.65], target: [-7.64, 21.6, -24.78] },
  'f3-prop-gauge': { pos: [-8.25, 21.85, -37.3], target: [-15.93, 22.26, -35.08] },
  // ---------------- floor 3 · CCSEP (right half) ----------------
  'f3-ccsep-overview': { pos: [1.0, 23.6, -46.5], target: [7.0, 21.5, -32.0], fov: 55 },
  'f3-ccsep-structure': { pos: [1.4, 22.1, -36.4], target: [6.0, 20.8, -40.5] },
  'f3-ccsep-cities': { pos: [4.0, 23.0, -30.0], target: [12.6, 23.2, -30.0] },
  'f3-ccsep-impl': { pos: [5.0, 22.4, -38.2], target: [10.0, 20.8, -33.5] },
  'f3-ccsep-results': { pos: [2.0, 22.5, -30.2], target: [6.0, 20.9, -25.0] },
  'f3-ccsep-nhatrang': { pos: [7.6, 22.4, -31.6], target: [12.6, 22.0, -28.6] },

  // ---- per-prop cameras for CCSEP table/chart beats (prop in the right band)
  'f3-propR-map': { pos: [5.65, 22.77, -29.15], target: [11.86, 23.06, -34.19] },
  'f3-propR-pipes': { pos: [8.82, 23.65, -46.02], target: [9.67, 21.81, -38.28] },
  'f3-propR-tank': { pos: [4.85, 23.02, -37.12], target: [12.75, 21.82, -36.7] },
  'f3-propR-bridge': { pos: [7.02, 23.39, -30.82], target: [10, 21.71, -23.58] },
  'f3-propR-road': { pos: [4.53, 22.08, -32.02], target: [9.43, 21.24, -25.75] },
  'f3-propR-houses': { pos: [6.2, 22.8, -17.35], target: [7.83, 21.31, -25.04] },
  'f3-propR-documents': { pos: [7.48, 22.98, -48.89], target: [10.61, 22.7, -56.25] },
  'f3-propR-dong-hoi': { pos: [7.02, 22.76, -34.16], target: [14.92, 23.45, -33.11] },
  'f3-propR-quy-nhon': { pos: [8.35, 23.21, -23.07], target: [8.79, 22.68, -31.04] },
  'f3-propR-nha-trang': { pos: [5.51, 22.25, -30.19], target: [13.01, 21.99, -32.98] },
  'f3-propR-phan-rang': { pos: [5.49, 22.88, -29.36], target: [12.53, 22.01, -33.07] },
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
