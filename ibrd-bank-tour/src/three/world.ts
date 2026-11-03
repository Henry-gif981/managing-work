/**
 * Mutable animation state shared by the Director (gsap) and the 3D components (useFrame).
 * Nothing in here triggers React renders; components read it every frame.
 */
export const world = {
  /** front double door 0 closed .. 1 open (≈100°) */
  door: { open: 0, spill: 0 },
  lift: {
    /** cabin floor height */
    y: 0,
    /** cabin doors 0 open .. 1 closed */
    doors: 0,
    display: '1',
    /** light streak intensity 0..1 and direction (+1 up, -1 down) */
    streak: 0,
    dir: 1,
  },
  exit: { open: 0, daylight: 0 },
  /** set by dev free-fly: the rig must not write the camera */
  devFly: false,
};

export const LEVEL_Y = { G: -10, 1: 0, 2: 10, 3: 20 } as const;
export function displayFor(y: number): string {
  if (y < -5) return 'G';
  if (y < 5) return '1';
  if (y < 15) return '2';
  return '3';
}

/** Lift geometry (shared by every floor). Cabin doors face +Z. */
export const LIFT = { x: 0, z: -60, w: 4, d: 4, h: 3.2, doorZ: -58 };
