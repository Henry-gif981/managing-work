import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTour } from '../state/store';
import { world } from './world';
import { cam, targetOf } from '../camera/rig';
import { returnToScene } from '../director';
import { SCENES } from '../scenes';

const r = (n: number) => Math.round(n * 100) / 100;

/** Dev free-fly camera: drag = look, shift+drag = pan, wheel / W S = forward, Q E = down/up, [ ] = fov, K = copy pose. */
export function DevFly() {
  const dev = useTour((s) => s.dev);
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const wasDev = useRef(false);

  useEffect(() => {
    world.devFly = dev;
    if (!dev) {
      if (!wasDev.current) return;
      wasDev.current = false;
      // hand the camera back to the director from wherever we flew to
      cam.pos.copy(camera.position);
      cam.quat.copy(camera.quaternion);
      cam.fov = (camera as THREE.PerspectiveCamera).fov;
      returnToScene();
      return;
    }
    wasDev.current = true;
    euler.current.setFromQuaternion(camera.quaternion);
    const el = gl.domElement;
    let drag: { x: number; y: number; pan: boolean } | null = null;
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, pan: e.shiftKey || e.button === 2 };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      if (drag.pan) {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
        camera.position.addScaledVector(right, -dx * 0.01).addScaledVector(up, dy * 0.01);
      } else {
        euler.current.y -= dx * 0.004;
        euler.current.x = THREE.MathUtils.clamp(euler.current.x - dy * 0.004, -1.5, 1.5);
        camera.quaternion.setFromEuler(euler.current);
      }
    };
    const up = () => (drag = null);
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(f, -e.deltaY * 0.01);
    };
    const kd = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);
      const c = camera as THREE.PerspectiveCamera;
      if (k === '[' || k === ']') {
        c.fov = THREE.MathUtils.clamp(c.fov + (k === ']' ? 2 : -2), 20, 90);
        c.updateProjectionMatrix();
      }
      if (k === 'k') {
        const t = targetOf(c.position, c.quaternion);
        const id = SCENES[useTour.getState().index].camera;
        const lit = `'${id}': { pos: [${r(c.position.x)}, ${r(c.position.y)}, ${r(c.position.z)}], target: [${r(t.x)}, ${r(t.y)}, ${r(t.z)}], fov: ${Math.round(c.fov)} },`;
        navigator.clipboard?.writeText(lit).catch(() => {});
        console.log(lit);
        useTour.getState().toast({ text: 'Copied waypoint: ' + lit, ttl: 4000 });
      }
    };
    const ku = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const ctx = (e: Event) => e.preventDefault();
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('contextmenu', ctx);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('contextmenu', ctx);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      keys.current.clear();
    };
  }, [dev, camera, gl]);

  useFrame((_, dt) => {
    if (!dev) return;
    const k = keys.current;
    const speed = (k.has('shift') ? 12 : 4) * dt;
    const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    if (k.has('w')) camera.position.addScaledVector(f, speed);
    if (k.has('s')) camera.position.addScaledVector(f, -speed);
    if (k.has('q')) camera.position.y -= speed;
    if (k.has('e')) camera.position.y += speed;
  });
  return null;
}
