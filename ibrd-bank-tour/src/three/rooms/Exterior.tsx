import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Builder, archShape, column, type V3 } from '../builder';
import { Static, TexPlane } from '../common';
import { mat, ownMat } from '../materials';
import { textTexture } from '../textures';
import { world } from '../world';
import { tokenColor } from '../../theme';
import { useTour } from '../../state/store';
import { SCENES } from '../../scenes';
import { SceneAnchors } from '../anchors';

const COLS = [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5];
const WING_X = [-19.5, 19.5];
const WIN_ROWS = [1.0, 4.9, 8.6]; // floor 1, 2, 3 window sill heights
const WIN_X = [-3.6, 0, 3.6];

function buildExterior(b: Builder) {
  // ground (pale blue-white) — below the steps
  b.box('ground', [220, 0.2, 220], [0, -1.1, -40], { edges: false });
  // pavement in front
  b.box('stone1', [30, 0.06, 14], [0, -0.98, 13], { edges: false });
  b.lines(
    Array.from({ length: 14 }, (_, i) => [
      [-15 + i * 2.3, -0.94, 6.3] as V3,
      [-15 + i * 2.3, -0.94, 20] as V3,
    ]).flat(),
  );
  // 5 steps (stylobate + 4 risers)
  for (let i = 0; i < 5; i++) {
    const top = -0.2 * i;
    const front = 4.6 + 0.45 * i;
    const w = 20 + i * 0.8;
    b.box('stone1', [w, top + 1.0, front], [0, (top - 1.0) / 2, front / 2 - 0.6]);
  }
  // columns
  for (const x of COLS) column(b, [x, 0, 3.2], 9, 0.5);
  // entablature: architrave, frieze, cornice
  b.box('stone1', [19, 0.6, 1.6], [0, 9.3, 3.2]);
  b.box('stone2', [19, 0.7, 1.4], [0, 9.95, 3.1]);
  b.box('stone1', [19.8, 0.35, 1.9], [0, 10.47, 3.2]);
  // frieze triglyph ink
  b.lines(
    Array.from({ length: 19 }, (_, i) => {
      const x = -9 + i;
      return [
        [x, 9.62, 3.81] as V3,
        [x, 10.28, 3.81] as V3,
      ];
    }).flat(),
  );
  // portico ceiling & side returns
  b.box('stone1', [19, 0.3, 3.6], [0, 9.0, 1.5], { edges: false });
  // pediment
  const ped = new THREE.Shape();
  ped.moveTo(-9.9, 0);
  ped.lineTo(0, 3.3);
  ped.lineTo(9.9, 0);
  ped.lineTo(-9.9, 0);
  b.extrude('stone1', ped, 1.6, [0, 10.64, 2.4]);
  const tym = new THREE.Shape();
  tym.moveTo(-8.6, 0);
  tym.lineTo(0, 2.6);
  tym.lineTo(8.6, 0);
  tym.lineTo(-8.6, 0);
  b.extrude('stone2', tym, 0.1, [0, 10.85, 3.95]);
  // roof behind pediment
  b.box('stone2', [28.4, 0.5, 30], [0, 13.2, -14.4], { edges: false });
  // central block (front wall z -0.6..0) with door opening 3.2 x 5.2
  b.box('stone1', [12.4, 13, 0.6], [-7.8, 6.5, -0.3], { edges: false });
  b.box('stone1', [12.4, 13, 0.6], [7.8, 6.5, -0.3], { edges: false });
  b.box('stone1', [3.2, 7.8, 0.6], [0, 5.2 + 3.9, -0.3], { edges: false });
  // door surround
  b.box('stone2', [0.45, 5.6, 0.2], [-1.82, 2.8, 0.05]);
  b.box('stone2', [0.45, 5.6, 0.2], [1.82, 2.8, 0.05]);
  b.box('stone2', [4.1, 0.6, 0.3], [0, 5.5, 0.1]);
  b.box('navy', [3.0, 0.7, 0.05], [0, 6.4, 0.02]);
  // central block side walls (seen at an angle)
  b.box('stone1', [0.6, 13, 30], [-14, 6.5, -15.3], { edges: false });
  b.box('stone1', [0.6, 13, 30], [14, 6.5, -15.3], { edges: false });
  b.box('stone2', [28.6, 0.4, 0.8], [0, 12.9, -0.2]);
  // wings
  for (const wx of WING_X) {
    b.box('stone1', [11, 12, 26], [wx, 6.0, -14.5], { edges: false });
    b.box('stone2', [11.4, 0.5, 0.7], [wx, 12.1, -1.4]);
    b.box('stone2', [11.2, 0.4, 0.3], [wx, 0.2, -1.4]);
    // floor bands
    for (const y of [4.3, 8.0]) b.box('stone2', [11.1, 0.2, 0.2], [wx, y, -1.42]);
    // window frames (arched) per row
    for (const y of WIN_ROWS)
      for (const dx of WIN_X) {
        b.extrude('stone2', archShape(1.7, 2.9), 0.15, [wx + dx, y - 0.15, -1.58]);
        b.box('stone2', [2.0, 0.18, 0.4], [wx + dx, y - 0.2, -1.4]);
      }
    // ink outline of the wing
    b.lines([
      [wx - 5.5, -1, -1.49],
      [wx - 5.5, 12.3, -1.49],
      [wx + 5.5, -1, -1.49],
      [wx + 5.5, 12.3, -1.49],
      [wx - 5.5, 12.35, -1.49],
      [wx + 5.5, 12.35, -1.49],
    ]);
  }
  // wing bases go down to the ground
  for (const wx of WING_X) b.box('stone2', [11, 1.0, 26], [wx, -0.5, -14.5], { edges: false });
  // central block base below floor level
  b.box('stone2', [28.6, 1.0, 0.6], [0, -0.5, -0.3], { edges: false });
}

/** Glass of one window row. */
function windowRowGeometry(y: number) {
  const geoms: THREE.BufferGeometry[] = [];
  for (const wx of WING_X)
    for (const dx of WIN_X) {
      const g = new THREE.ShapeGeometry(archShape(1.45, 2.65));
      g.translate(wx + dx, y, -1.45);
      geoms.push(g.toNonIndexed());
    }
  // merge manually (tiny)
  const pos: number[] = [];
  for (const g of geoms) pos.push(...(g.attributes.position.array as Float32Array));
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.computeVertexNormals();
  return out;
}

function Windows() {
  const maxIndex = useTour((s) => s.maxIndex);
  const index = useTour((s) => s.index);
  const reached = Math.max(maxIndex, index);
  const rows = useMemo(
    () =>
      WIN_ROWS.map((y) => {
        const m = ownMat('--wb-navy', { emissive: tokenColor('--spill'), emissiveIntensity: 0 });
        return { geom: windowRowGeometry(y), m };
      }),
    [],
  );
  const lit = [1, 2, 3].map((f) => SCENES.some((s, i) => i <= reached && s.floor === f && s.kind === 'room'));
  rows.forEach((r, i) => {
    r.m.color = lit[i] ? tokenColor('--wb-cyan') : tokenColor('--wb-blue').multiplyScalar(0.55);
    r.m.emissiveIntensity = lit[i] ? 0.85 : 0;
  });
  return (
    <>
      {rows.map((r, i) => (
        <mesh key={i} geometry={r.geom} material={r.m} />
      ))}
    </>
  );
}

/** Two hinged door panels + spill light. Drives off world.door. */
export function FrontDoor() {
  const left = useRef<THREE.Group>(null!);
  const right = useRef<THREE.Group>(null!);
  const spill = useRef<THREE.Mesh>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const panel = useMemo(() => {
    const b = new Builder();
    b.box('navy', [1.6, 5.2, 0.12], [0.8, 2.6, 0]);
    for (const y of [1.3, 3.6]) b.box('blue', [1.2, 1.6, 0.04], [0.8, y, 0.07]);
    b.box('steel', [0.08, 0.5, 0.08], [1.45, 2.5, 0.12]);
    return b.build();
  }, []);
  const panelR = useMemo(() => panel.clone(), [panel]);
  const spillMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: tokenColor('--spill'), transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const spillGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.6, 0);
    s.lineTo(1.6, 0);
    s.lineTo(3.2, 4.2);
    s.lineTo(-3.2, 4.2);
    s.lineTo(-1.6, 0);
    const g = new THREE.ShapeGeometry(s);
    g.rotateX(-Math.PI / 2);
    g.scale(1, 1, -1);
    return g;
  }, []);
  useFrame(() => {
    const a = world.door.open * THREE.MathUtils.degToRad(100);
    left.current.rotation.y = a;
    right.current.rotation.y = -a;
    spillMat.opacity = world.door.spill * 0.55;
    spill.current.visible = world.door.spill > 0.01;
    light.current.intensity = world.door.spill * 30;
  });
  return (
    <group>
      <group ref={left} position={[-1.6, 0, -0.3]}>
        <primitive object={panel} />
      </group>
      <group ref={right} position={[1.6, 0, -0.3]} scale={[-1, 1, 1]}>
        <primitive object={panelR} />
      </group>
      <mesh ref={spill} geometry={spillGeo} material={spillMat} position={[0, 0.02, 0]} renderOrder={3} />
      <pointLight ref={light} position={[0, 2.6, 1.5]} color={tokenColor('--spill')} intensity={0} distance={12} decay={1.5} />
    </group>
  );
}

export function Exterior() {
  const sign = useMemo(() => textTexture(['IBRD'], { w: 512, h: 128, bg: '--wb-navy', fg: '--page', size: 76 }), []);
  const frieze = useMemo(
    () =>
      textTexture(['INTERNATIONAL BANK FOR RECONSTRUCTION AND DEVELOPMENT'], {
        w: 2048,
        h: 96,
        bg: '--stone-2',
        fg: '--wb-navy',
        size: 54,
      }),
    [],
  );
  void mat;
  return (
    <group name="exterior">
      <Static build={buildExterior} />
      <Windows />
      <TexPlane tex={sign} position={[0, 6.4, 0.06]} size={[2.9, 0.68]} />
      <TexPlane tex={frieze} position={[0, 9.95, 3.81]} size={[17, 0.62]} />
      <SceneAnchors
        scene="ext-facade"
        at={{ pediment: [0, 11.8, 4], door: [0, 2.6, 0.2], 'wing-left': [-19.5, 6, -1.4], 'wing-right': [19.5, 6, -1.4] }}
      />
    </group>
  );
}
