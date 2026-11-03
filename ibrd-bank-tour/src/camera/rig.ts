import * as THREE from 'three';
import { DEFAULT_DURATION, DEFAULT_EASE, DEFAULT_FOV, type Waypoint } from './waypoints';
import { MOTION } from '../util/params';

/**
 * Camera state written by the Director and applied to the R3F camera every frame.
 * Orientation is a quaternion so tweens slerp the view direction (no lookAt flips).
 */
export const cam = {
  pos: new THREE.Vector3(0, 2.2, 31),
  quat: new THREE.Quaternion(),
  fov: DEFAULT_FOV,
};

const tmpM = new THREE.Matrix4();
const UP = new THREE.Vector3(0, 1, 0);

export function quatFor(pos: THREE.Vector3, target: THREE.Vector3) {
  tmpM.lookAt(pos, target, UP);
  return new THREE.Quaternion().setFromRotationMatrix(tmpM);
}

export function setCam(wp: Waypoint) {
  cam.pos.set(...wp.pos);
  cam.quat.copy(quatFor(cam.pos, new THREE.Vector3(...wp.target)));
  cam.fov = wp.fov ?? DEFAULT_FOV;
}

export interface CamTweenOpts {
  duration?: number;
  ease?: string;
  /** extra fov added at the middle of the move (door dolly 50 -> 72 -> 50) */
  fovPeak?: number;
}

/** Add a camera move to a timeline. Start pose is captured when the tween starts. */
export function camTo(tl: gsap.core.Timeline, wp: Waypoint, at: number | string | undefined, o: CamTweenOpts = {}) {
  const p = { t: 0 };
  let p0 = new THREE.Vector3(),
    q0 = new THREE.Quaternion(),
    f0 = DEFAULT_FOV;
  const p1 = new THREE.Vector3(...wp.pos);
  const q1 = quatFor(p1, new THREE.Vector3(...wp.target));
  const f1 = wp.fov ?? DEFAULT_FOV;
  const duration = (o.duration ?? wp.duration ?? DEFAULT_DURATION) * MOTION;
  tl.to(
    p,
    {
      t: 1,
      duration,
      ease: o.ease ?? wp.ease ?? DEFAULT_EASE,
      onStart: () => {
        p0 = cam.pos.clone();
        q0 = cam.quat.clone();
        f0 = cam.fov;
      },
      onUpdate: () => {
        const e = p.t;
        cam.pos.lerpVectors(p0, p1, e);
        cam.quat.slerpQuaternions(q0, q1, e);
        cam.fov = f0 + (f1 - f0) * e + (o.fovPeak ?? 0) * Math.sin(Math.PI * e);
      },
    },
    at,
  );
  return tl;
}

/** Forward-looking target 10 m ahead, for dev export. */
export function targetOf(pos: THREE.Vector3, quat: THREE.Quaternion, dist = 8) {
  const f = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);
  return pos.clone().addScaledVector(f, dist);
}
