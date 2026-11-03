import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Builder } from '../builder';
import { Static } from '../common';
import { drawTexture } from '../textures';
import { LIFT, world } from '../world';
import { cssVar, tokenColor } from '../../theme';
import { REDUCED_MOTION } from '../../util/params';
import { SceneAnchors } from '../anchors';

const { x: LX, z: LZ, w: W, d: D, h: H } = LIFT;
const DOOR_HALF = 1.05;

function buildShaft(b: Builder) {
  const y0 = -10.6,
    y1 = 30,
    hh = y1 - y0,
    yc = (y0 + y1) / 2;
  b.box('stone2', [0.3, hh, D + 1.2], [LX - W / 2 - 0.85, yc, LZ], { edges: false });
  b.box('stone2', [0.3, hh, D + 1.2], [LX + W / 2 + 0.85, yc, LZ], { edges: false });
  b.box('stone2', [W + 2, hh, 0.3], [LX, yc, LZ - D / 2 - 0.85], { edges: false });
  // guide rails
  for (const sx of [-1, 1]) b.box('steel', [0.12, hh, 0.12], [LX + sx * (W / 2 + 0.55), yc, LZ], { edges: false });
  // floor-level marks inside the shaft
  const pts: [number, number, number][] = [];
  for (const y of [-10, 0, 10, 20]) {
    for (const sx of [-1, 1]) pts.push([LX + sx * (W / 2 + 0.69), y, LZ - 2.4], [LX + sx * (W / 2 + 0.69), y, LZ + 2.0]);
  }
  b.lines(pts);
  // bottom pit
  b.box('stone2', [W + 2, 0.3, D + 1.2], [LX, y0, LZ], { edges: false });
}

function buildCabin(b: Builder) {
  // local space: cabin floor at y = 0, centre x = 0, z = 0 (cabin centre)
  b.box('marble', [W, 0.15, D], [0, -0.075, 0]);
  b.box('navy', [W - 0.6, 0.01, D - 0.6], [0, 0.005, 0], { edges: false });
  b.box('steel', [W, 0.15, D], [0, H + 0.075, 0]);
  b.box('spill', [W - 1, 0.02, D - 1], [0, H - 0.01, 0], { edges: false }); // ceiling light
  // back wall (steel) with a navy stripe and handrail
  b.box('steel', [W, H, 0.1], [0, H / 2, -D / 2 + 0.05]);
  b.box('navy', [W, 0.25, 0.02], [0, 1.0, -D / 2 + 0.11], { edges: false });
  b.box('cyan', [W, 0.05, 0.02], [0, 1.16, -D / 2 + 0.11], { edges: false });
  b.cyl('steel', 0.03, 0.03, W - 0.4, [0, 0.95, -D / 2 + 0.2], 8, { rot: [0, 0, Math.PI / 2] });
  // side walls: glass with steel frames (light streaks visible through them)
  for (const sx of [-1, 1]) {
    b.box('glass', [0.03, H - 0.2, D - 0.2], [sx * (W / 2 - 0.02), H / 2, 0], { edges: false });
    b.box('steel', [0.1, H, 0.12], [sx * (W / 2 - 0.05), H / 2, -D / 2 + 0.06]);
    b.box('steel', [0.1, H, 0.12], [sx * (W / 2 - 0.05), H / 2, D / 2 - 0.06]);
    b.box('steel', [0.1, 0.12, D], [sx * (W / 2 - 0.05), H - 0.06, 0]);
    b.box('steel', [0.1, 0.25, D], [sx * (W / 2 - 0.05), 0.12, 0]);
    b.cyl('steel', 0.03, 0.03, D - 0.6, [sx * (W / 2 - 0.15), 0.95, 0], 8, { rot: [Math.PI / 2, 0, 0] });
  }
  // front wall pieces either side of the door, and header with display
  const side = W / 2 - DOOR_HALF;
  b.box('steel', [side, H, 0.12], [-(DOOR_HALF + side / 2), H / 2, D / 2 - 0.06]);
  b.box('steel', [side, H, 0.12], [DOOR_HALF + side / 2, H / 2, D / 2 - 0.06]);
  b.box('steel', [DOOR_HALF * 2, H - 2.6, 0.12], [0, 2.6 + (H - 2.6) / 2, D / 2 - 0.06]);
  b.box('navy', [0.9, 0.42, 0.04], [0, 2.92, D / 2 - 0.14], { edges: 20 });
  b.box('navy', [0.9, 0.42, 0.04], [0, 2.92, D / 2 + 0.02], { edges: 20 });
  // call panel
  b.box('navy', [0.18, 0.5, 0.03], [DOOR_HALF + 0.35, 1.3, D / 2 - 0.13]);
  for (let i = 0; i < 4; i++) b.cyl('cyan', 0.03, 0.03, 0.02, [DOOR_HALF + 0.35, 1.13 + i * 0.11, D / 2 - 0.15], 10, { rot: [Math.PI / 2, 0, 0], edges: false });
}

function DoorPanel() {
  const g = useMemo(() => {
    const b = new Builder();
    b.box('steel', [DOOR_HALF + 0.04, 2.6, 0.06], [0, 1.3, 0]);
    b.box('stone2', [0.02, 2.2, 0.01], [DOOR_HALF / 2 - 0.05, 1.3, 0.035], { edges: false });
    b.box('cyan', [DOOR_HALF + 0.04, 0.04, 0.01], [0, 1.0, 0.035], { edges: false });
    return b.build();
  }, []);
  return <primitive object={g} />;
}

export function Lift() {
  const cabin = useRef<THREE.Group>(null!);
  const left = useRef<THREE.Group>(null!);
  const right = useRef<THREE.Group>(null!);
  const streaks = useRef<THREE.Group>(null!);
  const shown = useRef('');
  const display = useMemo(() => {
    const state = { text: '1' };
    const tex = drawTexture(256, 120, (ctx, w, h) => {
      ctx.fillStyle = cssVar('--wb-navy');
      ctx.fillRect(0, 0, w, h);
      ctx.font = `700 64px ${cssVar('--font-body')}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      const floors = ['G', '1', '2', '3'];
      floors.forEach((f, i) => {
        const x = 32 + i * 64;
        ctx.fillStyle = f === state.text ? cssVar('--wb-cyan') : 'rgba(255,255,255,0.22)';
        ctx.fillText(f, x, h / 2 + 4);
      });
    });
    return { tex, state };
  }, []);
  const redraw = useMemo(() => {
    // re-run the painter by re-creating content on the same canvas
    return (t: string) => {
      display.state.text = t;
      const img = display.tex.image as HTMLCanvasElement;
      const ctx = img.getContext('2d')!;
      ctx.fillStyle = cssVar('--wb-navy');
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.font = `700 64px ${cssVar('--font-body')}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ['G', '1', '2', '3'].forEach((f, i) => {
        ctx.fillStyle = f === t ? cssVar('--wb-cyan') : 'rgba(255,255,255,0.22)';
        ctx.fillText(f, 32 + i * 64, img.height / 2 + 4);
      });
      display.tex.needsUpdate = true;
    };
  }, [display]);
  const dispMat = useMemo(() => new THREE.MeshBasicMaterial({ map: display.tex, toneMapped: false }), [display]);
  const streakData = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: (i % 2 ? 1 : -1) * (W / 2 + 0.45),
        z: LZ - 1.6 + ((i * 0.37) % 1) * 3.4,
        off: (i * 2.31) % 12,
        len: 0.8 + ((i * 0.53) % 1) * 1.6,
      })),
    [],
  );
  const streakMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: tokenColor('--wb-cyan'),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  const streakGeo = useMemo(() => new THREE.BoxGeometry(0.05, 1, 0.05), []);

  useFrame((state) => {
    const L = world.lift;
    cabin.current.position.set(LX, L.y, LZ);
    const open = (1 - L.doors) * (DOOR_HALF - 0.02);
    left.current.position.set(-DOOR_HALF / 2 - open, 0, D / 2 - 0.2);
    right.current.position.set(DOOR_HALF / 2 + open, 0, D / 2 - 0.2);
    if (shown.current !== L.display) {
      shown.current = L.display;
      redraw(L.display);
    }
    const on = L.streak > 0.01 && !REDUCED_MOTION;
    streaks.current.visible = on;
    if (on) {
      streakMat.opacity = L.streak * 0.9;
      const t = state.clock.elapsedTime;
      streaks.current.children.forEach((c, i) => {
        const d = streakData[i];
        // streaks run opposite to travel: going up, light slides down
        let y = (((d.off - t * 9 * L.dir) % 12) + 12) % 12;
        c.position.set(d.x, L.y + y - 4, d.z);
        c.scale.set(1, d.len, 1);
      });
    }
  });

  return (
    <group name="lift">
      <Static build={buildShaft} />
      <group ref={cabin}>
        <Static build={buildCabin} />
        <group ref={left}>
          <DoorPanel />
        </group>
        <group ref={right}>
          <DoorPanel />
        </group>
        <mesh material={dispMat} position={[0, 2.92, D / 2 - 0.165]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.84, 0.38]} />
        </mesh>
        <SceneAnchors scene="lift-down" at={{ display: [0, 2.92, D / 2 - 0.2], glass: [-W / 2 + 0.1, 1.6, -0.4] }} />
        <mesh material={dispMat} position={[0, 2.92, D / 2 + 0.045]}>
          <planeGeometry args={[0.84, 0.38]} />
        </mesh>
      </group>
      <group ref={streaks}>
        {streakData.map((_, i) => (
          <mesh key={i} geometry={streakGeo} material={streakMat} />
        ))}
      </group>
    </group>
  );
}
