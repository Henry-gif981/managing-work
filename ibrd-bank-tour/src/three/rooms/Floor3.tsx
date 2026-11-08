import * as THREE from 'three';
import { useMemo } from 'react';
import { Builder, board, chair, house, pylon, scales, table, type V3 } from '../builder';
import { FACE, Static, TexPlane, shell } from '../common';
import { drawTexture, textTexture } from '../textures';
import { CCSEP_CITIES, paintVietnam, project } from '../vietnam';
import { cssVar, tokenColor } from '../../theme';
import { SceneAnchors } from '../anchors';
import { ownMat } from '../materials';
import { useTour } from '../../state/store';
import { SCENES } from '../../scenes';

const Y = 20;
/** CCSEP map wall: centre and size; faces -x on the right wall. */
const MAP = { x: 12.68, y: Y + 3.2, z: -30, w: 3.2, h: 5.6 };
export function mapPoint(lon: number, lat: number): V3 {
  const [u, v] = project(lon, lat);
  return [MAP.x - 0.06, MAP.y + (v - 0.5) * MAP.h, MAP.z + (u - 0.5) * MAP.w];
}

function buildFloor3(b: Builder) {
  shell(b, Y);
  // central aisle
  b.box('blue', [3, 0.02, 44], [0, Y + 0.01, -36], { edges: false });
  // half accents: warm inlay on the TEP side, aqua on CCSEP side
  b.box('warn', [0.12, 0.02, 26], [-2.2, Y + 0.012, -31], { edges: false });
  b.box('cyan', [0.12, 0.02, 26], [2.2, Y + 0.012, -31], { edges: false });

  // ---------- context area (entrance, z -58..-46) ----------
  // wall of documents on both side walls
  for (const sx of [-1, 1])
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 6; c++) {
        const z = -56.2 + c * 1.45,
          y = Y + 1.3 + r * 1.35;
        b.box('navy', [0.05, 1.12, 0.9], [sx * 12.95, y, z], { edges: 25 });
        b.box('paper', [0.03, 0.98, 0.76], [sx * 12.92, y, z], { edges: false });
      }
  // timeline strip: two low display rails flanking the aisle at z -50.2
  for (const sx of [-1, 1]) {
    b.box('stone2', [8.4, 1.0, 0.35], [sx * 6.8, Y + 0.5, -50.4]);
    b.box('navy', [8.6, 0.08, 0.5], [sx * 6.8, Y + 1.04, -50.4]);
  }

  // ---------- TEP (left half) ----------
  // transformer at (-6, -36.5)
  b.at([-6, Y, -36.5], 0, (t) => {
    t.box('stone2', [2.4, 0.3, 1.8], [0, 0.15, 0]);
    t.box('steel', [1.7, 1.7, 1.2], [0, 1.15, 0]);
    for (let i = 0; i < 7; i++) t.box('steel', [0.04, 1.4, 0.35], [-0.72 + i * 0.24, 1.1, 0.78]);
    for (let i = 0; i < 7; i++) t.box('steel', [0.04, 1.4, 0.35], [-0.72 + i * 0.24, 1.1, -0.78]);
    t.box('warn', [1.72, 0.12, 1.22], [0, 1.95, 0]);
    for (const x of [-0.5, 0, 0.5]) {
      t.cyl('white', 0.07, 0.11, 0.7, [x, 2.35, 0], 10);
      for (let k = 0; k < 3; k++) t.cyl('white', 0.14, 0.14, 0.04, [x, 2.15 + k * 0.2, 0], 10, { edges: false });
      t.sphere('navy', 0.06, [x, 2.73, 0], 8);
    }
    t.box('navy', [0.5, 0.35, 0.02], [0.4, 1.2, 0.61], { edges: false }); // rating plate
  });
  // pylons 500 kV (tall) and 220 kV, wires between
  pylon(b, [-10.4, Y, -25.5], 6.4, 3);
  pylon(b, [-6.4, Y, -23.6], 4.4, 2);
  const wire: V3[] = [];
  for (const dy of [0, 0.96]) {
    const a: V3 = [-10.4 + 1.3, Y + 6.4 * 0.62 + dy, -25.5],
      c: V3 = [-6.4 + 0.9, Y + 4.4 * 0.62 + dy * 0.66, -23.6];
    // sagging wire, 8 segments
    for (let i = 0; i < 8; i++) {
      const p = (t: number): V3 => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t - Math.sin(Math.PI * t) * 0.35, a[2] + (c[2] - a[2]) * t];
      wire.push(p(i / 8), p((i + 1) / 8));
    }
  }
  b.lines(wire);
  // substation models on a plinth table (-9.5, -41)
  b.at([-9.6, Y, -41.2], 0, (s) => {
    table(s, [0, 0, 0], 3.2, 2.0, 0.85, 0, 'stone2');
    s.box('marble', [3.0, 0.04, 1.8], [0, 0.9, 0], { edges: false });
    for (let i = 0; i < 3; i++) {
      s.box('steel', [0.4, 0.35, 0.3], [-1.0 + i * 0.75, 1.1, -0.3]);
      s.box('warn', [0.42, 0.05, 0.32], [-1.0 + i * 0.75, 1.3, -0.3], { edges: false });
    }
    for (let i = 0; i < 5; i++) s.cyl('white', 0.03, 0.03, 0.4, [-1.2 + i * 0.6, 1.12, 0.45], 6);
    const fence: V3[] = [];
    const fx = 1.4,
      fz = 0.8,
      fy = 0.92,
      fh = 0.2;
    for (const [x0, z0, x1, z1] of [
      [-fx, -fz, fx, -fz],
      [fx, -fz, fx, fz],
      [fx, fz, -fx, fz],
      [-fx, fz, -fx, -fz],
    ]) {
      fence.push([x0, fy + fh, z0], [x1, fy + fh, z1]);
      for (let k = 0; k <= 6; k++) {
        const t = k / 6;
        const x = x0 + (x1 - x0) * t,
          z = z0 + (z1 - z0) * t;
        fence.push([x, fy, z], [x, fy + fh, z]);
      }
    }
    s.lines(fence);
  });
  // drafting table (-4.2, -27.5) with tilted board and stool
  b.at([-4.4, Y, -27.4], 0.3, (d) => {
    d.box('steel', [0.06, 0.95, 0.06], [-0.6, 0.48, 0]);
    d.box('steel', [0.06, 0.95, 0.06], [0.6, 0.48, 0]);
    d.box('steel', [1.3, 0.05, 0.06], [0, 0.2, 0]);
    d.box('wood', [1.5, 0.04, 1.0], [0, 1.05, 0], { rot: [0.45, 0, 0] });
    d.box('paper', [1.2, 0.01, 0.8], [0, 1.08, 0.01], { rot: [0.45, 0, 0], edges: false });
    d.box('navy', [1.3, 0.03, 0.04], [0, 1.1, 0.15], { rot: [0.45, 0, 0] }); // T-square
    d.cyl('navy', 0.22, 0.22, 0.05, [0, 0.7, 0.8], 14);
    d.cyl('steel', 0.03, 0.03, 0.7, [0, 0.35, 0.8], 6);
  });
  // gauge on the left wall (-12.6, -32.5)
  b.at([-12.72, Y + 2.4, -32.5], Math.PI / 2, (g) => {
    g.cyl('steel', 0.75, 0.75, 0.12, [0, 0, 0.06], 32, { rot: [Math.PI / 2, 0, 0], edges: 50 });
    g.cyl('white', 0.64, 0.64, 0.04, [0, 0, 0.13], 32, { rot: [Math.PI / 2, 0, 0], edges: false });
    // warn arc (last quarter of the dial)
    const arc = new THREE.Shape();
    arc.absarc(0, 0, 0.6, -0.35, 0.75, false);
    arc.absarc(0, 0, 0.5, 0.75, -0.35, true);
    g.extrude('warn', arc, 0.01, [0, 0, 0.155], { edges: false });
    const ticks: V3[] = [];
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * 1.25 - (i / 10) * Math.PI * 1.5;
      ticks.push([Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0.16], [Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0.16]);
    }
    g.lines(ticks);
    g.box('navy', [0.04, 0.5, 0.02], [0.12, 0.18, 0.17], { rot: [0, 0, -0.55] }); // needle
    g.sphere('navy', 0.05, [0, 0, 0.17], 8);
  });
  // stack of cash bags (-4, -42)
  b.at([-3.9, Y, -42.1], 0, (c) => {
    const bags: [number, number, number][] = [
      [0, 0, 0],
      [0.62, 0, 0.1],
      [-0.6, 0, 0.05],
      [0.3, 0, -0.55],
      [-0.3, 0, -0.5],
      [0.3, 0.55, -0.2],
      [-0.3, 0.55, -0.15],
      [0, 1.05, -0.2],
    ];
    bags.forEach(([x, y, z], i) => {
      c.add(i % 3 === 0 ? 'blue' : 'navy', new THREE.SphereGeometry(0.34, 14, 10), [x, y + 0.3, z], { scale: [1, 0.85, 1], edges: 70 });
      c.cyl('steel', 0.06, 0.1, 0.12, [x, y + 0.63, z], 8);
      c.cyl('warn', 0.07, 0.07, 0.03, [x, y + 0.58, z], 8, { edges: false });
    });
  });

  // ---------- CCSEP (right half) ----------
  // sewer pipes (6, -40.5)
  b.at([6.2, Y, -40.6], 0, (p) => {
    p.box('stone2', [0.3, 0.3, 3.6], [-0.9, 0.15, 0]);
    p.box('stone2', [0.3, 0.3, 3.6], [0.9, 0.15, 0]);
    const pipe = (x: number, y: number, r: number, key: 'steel' | 'blue' | 'stone2') => {
      p.cyl(key, r, r, 4.2, [x, y, 0], 20, { rot: [Math.PI / 2, 0, 0], edges: 50 });
      p.cyl('navy', r * 0.75, r * 0.75, 0.02, [x, y, 2.11], 20, { rot: [Math.PI / 2, 0, 0], edges: false });
      p.torus('cyan', r * 0.98, 0.04, [x, y, 1.5]);
    };
    pipe(-0.45, 0.72, 0.42, 'stone2');
    pipe(0.45, 0.72, 0.42, 'stone2');
    pipe(0, 1.45, 0.42, 'steel');
  });
  // treatment tank (10, -33.5)
  b.at([10.0, Y, -33.5], 0, (t) => {
    t.cyl('stone2', 1.7, 1.75, 1.5, [0, 0.75, 0], 32, { edges: 40 });
    t.cyl('steel', 1.8, 1.8, 0.1, [0, 1.52, 0], 32, { edges: 40 });
    t.cyl('cyan', 1.6, 1.6, 0.02, [0, 1.4, 0], 32, { edges: false });
    t.box('steel', [3.4, 0.06, 0.25], [0, 1.62, 0]); // bridge scraper
    t.cyl('steel', 0.12, 0.12, 0.5, [0, 1.85, 0], 8);
    const ladder: V3[] = [];
    for (let k = 0; k < 6; k++) ladder.push([1.76, 0.2 + k * 0.25, -0.2], [1.76, 0.2 + k * 0.25, 0.2]);
    ladder.push([1.76, 0, -0.2], [1.76, 1.6, -0.2], [1.76, 0, 0.2], [1.76, 1.6, 0.2]);
    t.lines(ladder);
  });
  // bridge and road model table (6, -25) + small houses
  b.at([6.0, Y, -25.0], 0, (m) => {
    table(m, [0, 0, 0], 3.6, 2.2, 0.85, 0, 'stone2');
    m.box('cyan', [3.4, 0.03, 0.5], [0, 0.89, 0.2], { edges: false }); // river
    m.box('marble', [1.6, 0.04, 2.0], [-0.95, 0.9, 0], { edges: false });
    m.box('marble', [1.2, 0.04, 2.0], [1.15, 0.9, 0], { edges: false });
    m.box('navy', [0.3, 0.02, 2.0], [-0.6, 0.93, 0], { edges: false }); // road
    m.box('navy', [3.4, 0.02, 0.26], [0, 0.93, -0.65], { edges: false }); // road
    m.extrude('steel', archBridge(), 0.32, [0.0, 0.9, 0.04]);
    m.box('white', [1.4, 0.04, 0.34], [0.0, 1.13, 0.2]);
    house(m, [-1.3, 0.91, 0.65], 0.9, 0.2);
    house(m, [-0.9, 0.91, -0.25], 0.8, -0.1, 'navy');
    house(m, [1.2, 0.91, 0.7], 0.9, 0.4);
    house(m, [1.4, 0.91, -0.25], 0.75, 0, 'navy');
    m.cyl('good', 0.12, 0.12, 0.3, [-1.5, 1.05, -0.3], 8);
    m.cone('good', 0.2, 0.4, [-1.5, 1.35, -0.3], 8);
  });
  // more houses (coastal neighbourhood) on a low plinth near the map
  b.box('stone2', [2.2, 0.4, 3.0], [10.6, Y + 0.2, -21.8]);
  for (let i = 0; i < 5; i++) house(b, [10.0 + (i % 2) * 1.0, Y + 0.4, -23 + i * 0.6], 1.3, i * 0.4, i % 2 ? 'navy' : 'blue');
  // map wall frame
  board(b, [MAP.x + 0.06, MAP.y, MAP.z], MAP.w, MAP.h, -Math.PI / 2, 'paper');
  // pins: Dong Hoi, Quy Nhon, Nha Trang, Phan Rang-Thap Cham
  for (const c of CCSEP_CITIES) {
    const [x, y, z] = mapPoint(c.lon, c.lat);
    b.cyl('steel', 0.015, 0.015, 0.25, [x - 0.12, y, z], 6, { rot: [0, 0, Math.PI / 2], edges: false });
    // the Nha Trang pin head is a separate mesh (it turns red in f3-ccsep-nhatrang)
    if (c.id !== 'nha-trang') b.sphere('warn', 0.09, [x - 0.26, y, z], 12);
  }

  // ---------- executive office (front, z -14..0) ----------
  b.box('stone1', [10, 9, 0.4], [-8, Y + 4.5, -14], { edges: false });
  b.box('stone1', [10, 9, 0.4], [8, Y + 4.5, -14], { edges: false });
  b.box('stone1', [6, 5, 0.4], [0, Y + 6.5, -14], { edges: false });
  b.box('stone2', [6.4, 0.3, 0.6], [0, Y + 4.0, -14]);
  b.box('steel', [0.2, 4, 0.5], [-3.0, Y + 2, -14]);
  b.box('steel', [0.2, 4, 0.5], [3.0, Y + 2, -14]);
  b.box('glass', [2.6, 3.8, 0.04], [-4.4, Y + 1.9, -13.6], { edges: false, rot: [0, -1.2, 0] });
  b.box('glass', [2.6, 3.8, 0.04], [4.4, Y + 1.9, -13.6], { edges: false, rot: [0, 1.2, 0] });
  // carpet
  b.box('navy', [10, 0.02, 10], [0, Y + 0.01, -7], { edges: false });
  // long table with chairs
  b.at([0, Y, -6.8], 0, (t) => {
    t.box('wood', [1.8, 0.08, 6.4], [0, 0.8, 0]);
    t.box('stone2', [1.2, 0.76, 5.6], [0, 0.38, 0], { edges: false });
    for (let i = 0; i < 4; i++) {
      chair(t, [-1.3, 0, -2.4 + i * 1.6], Math.PI / 2);
      chair(t, [1.3, 0, -2.4 + i * 1.6], -Math.PI / 2);
    }
    chair(t, [0, 0, -3.8], 0);
    // papers in front of each seat
    for (let i = 0; i < 4; i++) {
      t.box('paper', [0.35, 0.01, 0.45], [-0.55, 0.85, -2.4 + i * 1.6], { edges: false });
      t.box('paper', [0.35, 0.01, 0.45], [0.55, 0.85, -2.4 + i * 1.6], { edges: false });
    }
  });
  // compass (two legs + head) on the table at (0.8, -6.5)
  b.at([0.55, Y + 0.84, -6.4], 0.5, (c) => {
    c.cyl('steel', 0.02, 0.005, 0.7, [-0.14, 0.32, 0], 6, { rot: [0, 0, -0.42] });
    c.cyl('steel', 0.02, 0.005, 0.7, [0.14, 0.32, 0], 6, { rot: [0, 0, 0.42] });
    c.cyl('navy', 0.06, 0.06, 0.08, [0, 0.66, 0], 10, { rot: [Math.PI / 2, 0, 0] });
    c.cyl('navy', 0.015, 0.015, 0.16, [0, 0.76, 0], 6);
    c.torus('steel', 0.42, 0.01, [0, 0.005, 0], { rot: [Math.PI / 2, 0, 0], edges: false });
  });
  scales(b, [-0.4, Y + 0.84, -8.4], 0.75);
  // front windows of the office (big glass with steel mullions)
  for (const x of [-9, -4.5, 4.5, 9]) {
    b.box('glass', [3.2, 5, 0.05], [x, Y + 3.2, -0.82], { edges: false });
    b.box('steel', [3.4, 0.12, 0.12], [x, Y + 0.7, -0.8]);
    b.box('steel', [3.4, 0.12, 0.12], [x, Y + 5.7, -0.8]);
    b.box('steel', [0.1, 5, 0.1], [x, Y + 3.2, -0.8]);
  }
  for (const x of [-9, -4.5, 4.5, 9]) b.box('spill', [3.2, 5, 0.02], [x, Y + 3.2, -0.86], { edges: false });
}

const PINS: Record<string, V3> = Object.fromEntries(CCSEP_CITIES.map((c) => [c.id, ((p: V3) => [p[0] - 0.26, p[1], p[2]] as V3)(mapPoint(c.lon, c.lat))]));

function archBridge() {
  const s = new THREE.Shape();
  s.moveTo(-0.7, 0);
  s.quadraticCurveTo(0, 0.5, 0.7, 0);
  s.lineTo(0.62, 0);
  s.quadraticCurveTo(0, 0.38, -0.62, 0);
  s.lineTo(-0.7, 0);
  return s;
}

/** Nha Trang pin head: warn orange, red (--bad) while the Nha Trang scene is shown. */
function NhaTrangPin() {
  const index = useTour((s) => s.index);
  const nt = CCSEP_CITIES.find((c) => c.id === 'nha-trang')!;
  const [x, y, z] = mapPoint(nt.lon, nt.lat);
  const red = SCENES[index]?.id === 'f3-ccsep-nhatrang';
  const m = useMemo(() => ({ warn: ownMat('--warn'), bad: ownMat('--bad', { emissive: tokenColor('--bad'), emissiveIntensity: 0.35 }) }), []);
  return (
    <mesh position={[x - 0.26, y, z]} material={red ? m.bad : m.warn} scale={red ? 1.6 : 1}>
      <sphereGeometry args={[0.09, 16, 12]} />
    </mesh>
  );
}

export function Floor3() {
  const map = useMemo(
    () =>
      drawTexture(512, 896, (ctx, w, h) => {
        paintVietnam(ctx, w, h, { fill: cssVar('--surface-2'), stroke: cssVar('--wb-navy'), water: cssVar('--page') });
        ctx.font = `600 26px ${cssVar('--font-body')}`;
        ctx.fillStyle = cssVar('--wb-navy');
        for (const c of CCSEP_CITIES) {
          const [u, v] = project(c.lon, c.lat);
          const x = u * w,
            y = (1 - v) * h;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.textAlign = 'right';
          ctx.fillText(c.name, x - 14, y + 9);
        }
      }),
    [],
  );
  const timeline = useMemo(
    () =>
      drawTexture(1536, 96, (ctx, w, h) => {
        ctx.fillStyle = cssVar('--wb-navy');
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = cssVar('--wb-cyan');
        ctx.fillRect(0, h / 2 - 3, w, 6);
        const years = ['1993', '2007', '2009', '2017', '2018', '2026'];
        ctx.font = `700 40px ${cssVar('--font-body')}`;
        ctx.textAlign = 'center';
        years.forEach((y, i) => {
          const x = 110 + i * ((w - 220) / (years.length - 1));
          ctx.fillStyle = cssVar('--wb-cyan');
          ctx.beginPath();
          ctx.arc(x, h / 2, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = cssVar('--page');
          ctx.fillText(y, x + (i % 2 ? 0 : 0), i % 2 ? h - 6 : 36);
        });
      }),
    [],
  );
  const tepSign = useMemo(
    () =>
      textTexture(['TRANSMISSION EFFICIENCY PROJECT · TEP'], { w: 1536, h: 128, bg: '--wb-navy', fg: '--page', size: 58 }),
    [],
  );
  const ccsepSign = useMemo(
    () =>
      textTexture(['COASTAL CITIES SUSTAINABLE ENVIRONMENT · CCSEP'], {
        w: 1536,
        h: 128,
        bg: '--wb-navy',
        fg: '--page',
        size: 56,
      }),
    [],
  );
  const office = useMemo(
    () => textTexture(['EXECUTIVE OFFICE'], { w: 1024, h: 128, bg: '--stone-2', fg: '--wb-navy', size: 62 }),
    [],
  );
  const tepAccent = tokenColor('--accent-tep');
  const ccsepAccent = tokenColor('--accent-ccsep');
  const nt = CCSEP_CITIES.find((c) => c.id === 'nha-trang')!;
  void nt;
  return (
    <group name="f3">
      <Static build={buildFloor3} />
      <TexPlane tex={map} position={[MAP.x - 0.01, MAP.y, MAP.z]} rotation={FACE.west} size={[MAP.w, MAP.h]} />
      <TexPlane tex={timeline} position={[-6.8, Y + 0.6, -50.22]} rotation={FACE.south} size={[8.2, 0.52]} />
      <TexPlane tex={timeline} position={[6.8, Y + 0.6, -50.22]} rotation={FACE.south} size={[8.2, 0.52]} />
      <TexPlane tex={tepSign} position={[-12.75, Y + 6.6, -33]} rotation={FACE.east} size={[9, 0.75]} />
      <TexPlane tex={ccsepSign} position={[12.75, Y + 6.6, -33]} rotation={FACE.west} size={[9, 0.75]} />
      <TexPlane tex={office} position={[0, Y + 7.2, -13.78]} rotation={FACE.north} size={[5, 0.62]} />
      <TexPlane tex={office} position={[0, Y + 7.2, -14.22]} rotation={FACE.south} size={[5, 0.62]} />
      {/* accent lighting: warm TEP half, aqua CCSEP half */}
      <pointLight position={[-7, Y + 5, -33]} color={tepAccent} intensity={22} distance={16} decay={1.4} />
      <pointLight position={[7, Y + 5, -33]} color={ccsepAccent} intensity={22} distance={16} decay={1.4} />
      <SceneAnchors scene="f3-1993" at={{ documents: [-12.8, Y + 2.6, -52.6] }} />
      <SceneAnchors scene="f3-ida-graduation" at={{ timeline: [-6.8, Y + 0.6, -50.2], tep: [-6, Y + 1.6, -36.5] }} />
      <SceneAnchors scene="f3-sahep" at={{ documents: [12.8, Y + 2.6, -52.6] }} />
      <SceneAnchors scene="f3-legal" at={{ timeline: [6.8, Y + 0.6, -50.2] }} />
      <SceneAnchors scene="f3-tep-overview" at={{ transformer: [-6, Y + 1.6, -36.5], pylons: [-8.4, Y + 4, -24.5], substation: [-9.6, Y + 1.2, -41.2], cash: [-3.9, Y + 0.9, -42.1], drafting: [-4.4, Y + 1.1, -27.4] }} />
      <SceneAnchors scene="f3-tep-cost" at={{ infra: [-10.4, Y + 4.2, -25.5], smartgrid: [-9.85, Y + 1.15, -41.5], capacity: [-4.4, Y + 1.1, -27.4], cash: [-3.9, Y + 0.9, -42.1] }} />
      <SceneAnchors scene="f3-tep-financing" at={{ infra: [-10.4, Y + 4.2, -25.5], smartgrid: [-9.85, Y + 1.15, -41.5], capacity: [-4.4, Y + 1.1, -27.4], cash: [-3.9, Y + 0.9, -42.1] }} />
      <SceneAnchors scene="f3-tep-impl" at={{ drafting: [-4.4, Y + 1.1, -27.4], cash: [-3.9, Y + 0.9, -42.1], transformer: [-6, Y + 1.6, -36.5], substation: [-9.6, Y + 1.2, -41.2] }} />
      <SceneAnchors
        scene="f3-tep-outputs"
        at={{
          'new-lines': [-10.4, Y + 4.6, -25.5],
          'rehab-lines': [-8.2, Y + 3.6, -24.6],
          'transformer-capacity': [-6, Y + 1.6, -36.5],
          'smartgrid-500kv': [-10.6, Y + 1.15, -41.5],
          'smartgrid-220kv': [-9.1, Y + 1.15, -41.5],
        }}
      />
      <SceneAnchors scene="f3-tep-outcomes" at={{ transformer: [-6, Y + 1.6, -36.5], substation: [-9.6, Y + 1.2, -41.2], 'pylon-220': [-6.4, Y + 3.2, -23.6], 'pylon-500': [-10.4, Y + 4.6, -25.5], gauge: [-12.6, Y + 2.4, -32.5] }} />
      <SceneAnchors scene="f3-tep-gap" at={{ cash: [-3.9, Y + 0.9, -42.1], substation: [-9.6, Y + 1.2, -41.2], gauge: [-12.6, Y + 2.4, -32.5] }} />
      <SceneAnchors scene="f3-tep-assess" at={{ transformer: [-6, Y + 1.6, -36.5], pylons: [-8.4, Y + 4, -24.5], cash: [-3.9, Y + 0.9, -42.1], gauge: [-12.6, Y + 2.4, -32.5], ccsep: [6.2, Y + 1.2, -40.6] }} />
      <NhaTrangPin />
      <SceneAnchors scene="f3-ccsep-overview" at={{ ...PINS, map: [MAP.x - 0.1, MAP.y, MAP.z], pipes: [6.2, Y + 1.2, -40.6], tank: [10, Y + 1.4, -33.5], houses: [10.5, Y + 0.8, -21.8] }} />
      <SceneAnchors scene="f3-ccsep-structure" at={{ pipes: [6.2, Y + 1.2, -40.6], tank: [10, Y + 1.4, -33.5], bridge: [6, Y + 1.1, -24.8], houses: [10.5, Y + 0.8, -21.8], 'nha-trang': PINS['nha-trang'] }} />
      <SceneAnchors scene="f3-ccsep-cities" at={PINS} />
      <SceneAnchors scene="f3-ccsep-impl" at={{ tank: [10, Y + 1.4, -33.5], bridge: [6, Y + 1.1, -24.8], 'nha-trang': PINS['nha-trang'], 'phan-rang': PINS['phan-rang'] }} />
      <SceneAnchors
        scene="f3-ccsep-results"
        at={{ houses: [10.5, Y + 0.8, -21.8], pipes: [6.2, Y + 1.2, -40.6], tank: [10, Y + 1.4, -33.5], road: [5.2, Y + 0.95, -25.65], bridge: [6, Y + 1.15, -24.8], 'nha-trang': PINS['nha-trang'] }}
      />
      <SceneAnchors scene="f3-ccsep-nhatrang" at={{ pin: PINS['nha-trang'], houses: [10.5, Y + 0.8, -21.8] }} />
      <SceneAnchors scene="f3-eval-achievements" at={{ table: [0, Y + 0.9, -6.8], compass: [0.55, Y + 1.2, -6.4], scales: [-0.4, Y + 1.5, -8.4] }} />
      <SceneAnchors scene="f3-eval-limitations" at={{ scales: [-0.4, Y + 1.5, -8.4], compass: [0.55, Y + 1.2, -6.4] }} />
      <SceneAnchors scene="f3-recs-1" at={{ compass: [0.55, Y + 1.2, -6.4], scales: [-0.4, Y + 1.5, -8.4] }} />
      <SceneAnchors scene="f3-recs-2" at={{ table: [0, Y + 0.9, -6.8], compass: [0.55, Y + 1.2, -6.4] }} />
    </group>
  );
}
