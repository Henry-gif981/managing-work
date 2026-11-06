import * as THREE from 'three';
import { Component, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTour } from '../state/store';
import { SCENES, type Scene } from '../scenes';
import { cam } from '../camera/rig';
import { WAYPOINTS } from '../camera/waypoints';
import { world } from './world';
import { skyTexture } from './textures';
import { tokenColor } from '../theme';
import { Exterior } from './rooms/Exterior';
import { Floor1 } from './rooms/Floor1';
import { Floor2 } from './rooms/Floor2';
import { Floor3 } from './rooms/Floor3';
import { ExitHall } from './rooms/ExitHall';
import { Lift } from './rooms/Lift';
import { createAnchor, anchorName, anchors } from './anchors';
import { DevFly } from './DevFly';
import { perf, threeRefs } from './refs';
import { PARAMS } from '../util/params';

type Zone = 'exterior' | 'f1' | 'f2' | 'f3' | 'g' | 'lift';

export function zonesOf(s: Scene): Zone[] {
  if (s.id === 'lift-1-2') return ['f1', 'f2', 'lift'];
  if (s.id === 'lift-2-3') return ['f2', 'f3', 'lift'];
  switch (s.segment) {
    case 'entrance':
      return ['exterior', 'f1'];
    case 'intro':
      return ['exterior', 'f1', 'lift'];
    case 'ch1':
      return ['f1', 'lift'];
    case 'ch2':
      return ['f2', 'lift'];
    case 'conclusion':
      return ['f3', 'g', 'lift'];
    case 'exit':
      return ['g', 'lift'];
    default:
      return ['f3', 'lift'];
  }
}

function CameraApplier() {
  const { camera, gl } = useThree();
  useEffect(() => {
    threeRefs.camera = camera as THREE.PerspectiveCamera;
    threeRefs.gl = gl;
  }, [camera, gl]);
  useFrame(() => {
    const c = camera as THREE.PerspectiveCamera;
    if (!world.devFly) {
      c.position.copy(cam.pos);
      c.quaternion.copy(cam.quat);
      if (Math.abs(c.fov - cam.fov) > 1e-3) {
        c.fov = cam.fov;
        c.updateProjectionMatrix();
      }
    }
  }, -1);
  return null;
}

/** Counts draw calls / triangles / fps; triggers the lite-mode watchdog. */
function Perf() {
  const { gl } = useThree();
  const acc = useRef({ frames: 0, t0: performance.now(), lowSince: 0, asked: false, start: performance.now() });
  useEffect(() => {
    gl.info.autoReset = false;
  }, [gl]);
  useFrame(() => {
    perf.calls = gl.info.render.calls;
    perf.tris = gl.info.render.triangles;
    gl.info.reset();
    const a = acc.current;
    a.frames++;
    const now = performance.now();
    if (now - a.t0 >= 1000) {
      perf.fps = (a.frames * 1000) / (now - a.t0);
      a.frames = 0;
      a.t0 = now;
      // watchdog: average fps < 24 for 3 s => offer lite mode
      if (!PARAMS.shot && !a.asked && now - a.start > 5000 && document.visibilityState === 'visible') {
        if (perf.fps < 24) {
          if (!a.lowSince) a.lowSince = now;
          if (now - a.lowSince >= 3000) {
            a.asked = true;
            offerLite();
          }
        } else a.lowSince = 0;
      }
    }
  });
  return null;
}

function offerLite() {
  // Never switches by itself: only a hint. Lite mode starts with L, ?lite=1, or when WebGL is unavailable.
  const st = useTour.getState();
  if (st.lite) return;
  st.toast({ text: 'The 3D view is running slowly. Switch to Lite mode? (L)', ttl: 6000 });
}

/** centre / left / right anchors for every scene, derived from its waypoint. */
function AutoAnchors() {
  const group = useMemo(() => {
    const g = new THREE.Group();
    for (const s of SCENES) {
      const wp = WAYPOINTS[s.camera];
      if (!wp) continue;
      const p = new THREE.Vector3(...wp.pos),
        t = new THREE.Vector3(...wp.target);
      const dir = t.clone().sub(p);
      const dist = dir.length();
      dir.normalize();
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      const k = dist * 0.42;
      const add = (n: string, v: THREE.Vector3) => {
        if (!anchors.has(anchorName(s.id, n))) g.add(createAnchor(anchorName(s.id, n), [v.x, v.y, v.z]));
      };
      add('centre', t);
      add('left', t.clone().addScaledVector(right, -k));
      add('right', t.clone().addScaledVector(right, k));
    }
    return g;
  }, []);
  return <primitive object={group} />;
}

function Zones() {
  const index = useTour((s) => s.index);
  const settled = useTour((s) => s.settledIndex);
  const vis = new Set<Zone>([...zonesOf(SCENES[index]), ...zonesOf(SCENES[settled])]);
  const refs = useRef<Record<string, THREE.Group | null>>({});
  useEffect(() => {
    for (const [k, g] of Object.entries(refs.current)) if (g) g.visible = vis.has(k as Zone);
  });
  const reg = (k: Zone) => (g: THREE.Group | null) => {
    refs.current[k] = g;
    if (g) g.visible = vis.has(k);
  };
  return (
    <>
      <group ref={reg('exterior')}>
        <Exterior />
      </group>
      <group ref={reg('f1')}>
        <Floor1 />
      </group>
      <group ref={reg('f2')}>
        <Floor2 />
      </group>
      <group ref={reg('f3')}>
        <Floor3 />
      </group>
      <group ref={reg('g')}>
        <ExitHall />
      </group>
      <group ref={reg('lift')}>
        <Lift />
      </group>
    </>
  );
}

function Scenery() {
  const sky = useMemo(() => skyTexture(), []);
  const { scene } = useThree();
  useEffect(() => {
    scene.background = sky;
  }, [scene, sky]);
  return (
    <>
      <hemisphereLight args={[tokenColor('--light-ambient'), tokenColor('--stone-2'), 1.5]} />
      <ambientLight color={tokenColor('--light-ambient')} intensity={0.35} />
      <directionalLight color={tokenColor('--light-key')} intensity={1.9} position={[-9, 20, 14]} />
    </>
  );
}

class GLBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.warn('[stage] 3D failed, switching to lite mode', e);
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Stage() {
  const setLite = useTour((s) => s.setLite);
  return (
    <GLBoundary onFail={() => setLite(true)}>
      <Canvas
        className="stage-canvas"
        dpr={[1, 1.5]}
        flat
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: PARAMS.shot }}
        camera={{ fov: 50, near: 0.1, far: 400, position: [0, 2.2, 31] }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setLite(true);
          });
        }}
      >
        <Scenery />
        <CameraApplier />
        <Zones />
        <AutoAnchors />
        <Perf />
        <DevFly />
      </Canvas>
    </GLBoundary>
  );
}
