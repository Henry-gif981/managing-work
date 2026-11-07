import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Builder, board, column } from '../builder';
import { FACE, Static, TexPlane } from '../common';
import { textTexture } from '../textures';
import { world, captureLook } from '../world';
import { tokenColor } from '../../theme';
import { SceneAnchors } from '../anchors';

const Y = -10;
const X = 8; // half width
const Z0 = -58,
  Z1 = -30; // back (lift) .. front (exit door)
const DOOR_W = 2.2,
  DOOR_H = 5.2;

function buildExit(b: Builder) {
  const len = Z1 - Z0,
    zc = (Z0 + Z1) / 2,
    h = 8;
  b.box('marble', [X * 2, 0.3, len], [0, Y - 0.15, zc], { edges: false });
  const grid: [number, number, number][] = [];
  for (let x = -X + 2; x < X; x += 2) grid.push([x, Y + 0.005, Z0], [x, Y + 0.005, Z1]);
  for (let z = Z0 + 2; z < Z1; z += 2) grid.push([-X, Y + 0.005, z], [X, Y + 0.005, z]);
  b.lines(grid);
  b.box('white', [X * 2, 0.3, len], [0, Y + h + 0.15, zc], { edges: false });
  b.box('stone1', [0.4, h, len], [-X - 0.2, Y + h / 2, zc], { edges: false });
  b.box('stone1', [0.4, h, len], [X + 0.2, Y + h / 2, zc], { edges: false });
  // back wall with lift opening
  b.box('stone1', [X - 2.2, h, 0.4], [(X + 2.2) / 2, Y + h / 2, Z0 - 0.2], { edges: false });
  b.box('stone1', [X - 2.2, h, 0.4], [-(X + 2.2) / 2, Y + h / 2, Z0 - 0.2], { edges: false });
  b.box('stone1', [4.4, h - 3.6, 0.4], [0, Y + 3.6 + (h - 3.6) / 2, Z0 - 0.2], { edges: false });
  b.box('steel', [4.9, 0.3, 0.3], [0, Y + 3.75, Z0 + 0.05]);
  // front wall with the big exit door opening
  b.box('stone1', [X - DOOR_W, h, 0.5], [(X + DOOR_W) / 2, Y + h / 2, Z1 + 0.25], { edges: false });
  b.box('stone1', [X - DOOR_W, h, 0.5], [-(X + DOOR_W) / 2, Y + h / 2, Z1 + 0.25], { edges: false });
  b.box('stone1', [DOOR_W * 2, h - DOOR_H, 0.5], [0, Y + DOOR_H + (h - DOOR_H) / 2, Z1 + 0.25], { edges: false });
  b.box('stone2', [DOOR_W * 2 + 0.8, 0.5, 0.7], [0, Y + DOOR_H + 0.25, Z1 + 0.1]);
  b.box('stone2', [0.4, DOOR_H, 0.7], [-DOOR_W - 0.2, Y + DOOR_H / 2, Z1 + 0.1]);
  b.box('stone2', [0.4, DOOR_H, 0.7], [DOOR_W + 0.2, Y + DOOR_H / 2, Z1 + 0.1]);
  // columns and cornice
  for (const z of [-52, -45, -38]) {
    column(b, [-5.5, Y, z], 8, 0.4);
    column(b, [5.5, Y, z], 8, 0.4);
  }
  b.box('stone2', [0.5, 0.35, len], [-X + 0.2, Y + h - 0.3, zc]);
  b.box('stone2', [0.5, 0.35, len], [X - 0.2, Y + h - 0.3, zc]);
  // carpet runner to the door
  b.box('blue', [2.6, 0.02, len - 1], [0, Y + 0.01, zc], { edges: false });
  // sources board (left wall) and plaque (right)
  board(b, [-X + 0.06, Y + 2.6, -41], 4.4, 2.8, Math.PI / 2, 'paper');
  board(b, [X - 0.06, Y + 2.6, -41], 3.0, 1.6, -Math.PI / 2, 'paper');
  // benches
  for (const z of [-48, -36]) {
    b.box('stone2', [0.6, 0.45, 2.4], [-6.6, Y + 0.225, z]);
    b.box('stone2', [0.6, 0.45, 2.4], [6.6, Y + 0.225, z]);
  }
  // outside: daylight steps (seen through the door)
  b.box('ground', [30, 0.2, 30], [0, Y - 0.1, Z1 + 15.5], { edges: false });
}

function ExitDoor() {
  const left = useRef<THREE.Group>(null!);
  const right = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const panel = useMemo(() => {
    const b = new Builder();
    b.box('navy', [DOOR_W, DOOR_H, 0.14], [DOOR_W / 2, DOOR_H / 2, 0]);
    for (const y of [1.3, 3.7]) b.box('blue', [DOOR_W - 0.5, 1.7, 0.04], [DOOR_W / 2, y, -0.08]);
    b.box('steel', [0.1, 0.6, 0.1], [DOOR_W - 0.25, 2.5, -0.12]);
    return b.build();
  }, []);
  const panelR = useMemo(() => panel.clone(), [panel]);
  const dayMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: tokenColor('--spill'), toneMapped: false }),
    [],
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: tokenColor('--spill'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );
  useFrame(() => {
    const a = world.exit.open * THREE.MathUtils.degToRad(100);
    left.current.rotation.y = -a;
    right.current.rotation.y = a;
    glowMat.opacity = world.exit.daylight * 0.28 * captureLook.light;
    glow.current.visible = world.exit.daylight > 0.01;
    light.current.intensity = world.exit.daylight * 60 * captureLook.light;
  });
  return (
    <group>
      {/* daylight backdrop beyond the door */}
      <mesh position={[0, Y + 6, Z1 + 6]} rotation={[0, Math.PI, 0]} material={dayMat}>
        <planeGeometry args={[40, 20]} />
      </mesh>
      <group ref={left} position={[-DOOR_W, Y, Z1 + 0.25]}>
        <primitive object={panel} />
      </group>
      <group ref={right} position={[DOOR_W, Y, Z1 + 0.25]} scale={[-1, 1, 1]}>
        <primitive object={panelR} />
      </group>
      {/* light shaft on the floor */}
      <mesh ref={glow} position={[0, Y + 0.03, Z1 - 4]} rotation={[-Math.PI / 2, 0, 0]} material={glowMat} renderOrder={3}>
        <planeGeometry args={[4.6, 8]} />
      </mesh>
      <pointLight ref={light} position={[0, Y + 3, Z1 - 1.5]} color={tokenColor('--spill')} intensity={0} distance={22} decay={1.2} />
    </group>
  );
}

export function ExitHall() {
  const sources = useMemo(
    () => textTexture(['SOURCES'], { w: 512, h: 128, bg: '--wb-navy', fg: '--page', size: 64 }),
    [],
  );
  const exit = useMemo(() => textTexture(['EXIT'], { w: 256, h: 96, bg: '--wb-navy', fg: '--page', size: 56 }), []);
  return (
    <group name="g">
      <Static build={buildExit} />
      <ExitDoor />
      <TexPlane tex={sources} position={[-X + 0.12, Y + 4.4, -41]} rotation={FACE.east} size={[2.4, 0.6]} />
      <TexPlane tex={exit} position={[0, Y + 6.2, Z1 - 0.02]} rotation={FACE.north} size={[1.4, 0.52]} />
      <SceneAnchors scene="ex-sources" at={{ board: [-X + 0.2, Y + 2.6, -41] }} />
      <SceneAnchors scene="ex-thanks" at={{ door: [0, Y + 2.6, Z1] }} />
    </group>
  );
}
