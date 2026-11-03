import * as THREE from 'three';
import { useMemo } from 'react';
import { Builder, arch, board, chair, column, ledger, table, type V3 } from '../builder';
import { FACE, Static, TexPlane, coffers, shell } from '../common';
import { drawTexture, textTexture } from '../textures';
import { paintVietnam } from '../vietnam';
import { cssVar } from '../../theme';
import { SceneAnchors } from '../anchors';
import { FrontDoor } from './Exterior';

const Y = 0;
const HALL_COLS_Z = [-20, -26, -32, -38, -44, -50];

function buildFloor1(b: Builder) {
  shell(b, Y, { frontDoor: true, ceiling: false });
  // lobby ceiling (lower) and hall ceiling (coffered)
  b.box('white', [26, 0.3, 15.4], [0, 7.15, -8.3], { edges: false });
  b.box('white', [26, 0.3, 42], [0, 9.15, -37], { edges: false });
  coffers(b, 9.0, -12, 12, -17, -57, 3);
  // partition lobby | hall with a wide arch (opening 10 x 7)
  b.box('stone1', [8, 9, 0.5], [-9, 4.5, -16], { edges: false });
  b.box('stone1', [8, 9, 0.5], [9, 4.5, -16], { edges: false });
  b.extrude('stone2', arch(10, 7, 0.5), 0.6, [0, 0, -16.3]);
  b.box('stone1', [10, 2, 0.5], [0, 8.0, -16], { edges: false });
  b.box('stone2', [26, 0.4, 0.7], [0, 7.2, -15.9]);
  // lobby: reception desk (faces +z) at (-5, 0, -11)
  b.at([-5, 0, -11], 0, (d) => {
    d.box('stone2', [5, 1.1, 1.0], [0, 0.55, 0]);
    d.box('navy', [5.2, 0.08, 1.15], [0, 1.14, 0]);
    d.box('cyan', [5.0, 0.06, 0.02], [0, 0.9, 0.51], { edges: false });
    d.box('wood', [4.6, 0.75, 0.6], [0, 0.375, -0.9]);
    chair(d, [-1, 0, -1.6], Math.PI);
    chair(d, [1, 0, -1.6], Math.PI);
    ledger(d, [-1.2, 1.18, 0], false, 'blue');
    ledger(d, [1.3, 1.18, 0.1], false, 'navy', 0.3);
    d.box('steel', [0.12, 0.3, 0.12], [0.2, 1.33, 0]); // bell
  });
  // lobby: notice board (left wall)
  board(b, [-12.75, 2.5, -6], 3.2, 2.0, Math.PI / 2, 'paper');
  // lobby: globe on a stand at (5.5, 0, -6)
  b.at([5.5, 0, -6], 0, (g) => {
    g.cyl('steel', 0.45, 0.55, 0.1, [0, 0.05, 0], 16);
    g.cyl('steel', 0.05, 0.05, 0.9, [0, 0.5, 0], 8);
    g.sphere('blue', 0.7, [0, 1.6, 0], 24, { edges: false });
    g.torus('navy', 0.78, 0.03, [0, 1.6, 0], { rot: [0, Math.PI / 2, 0.4] });
    // meridians / parallels as ink
    const pts: V3[] = [];
    for (let i = 0; i < 6; i++) {
      const a0 = (i / 6) * Math.PI;
      for (let k = 0; k < 24; k++) {
        const t0 = (k / 24) * Math.PI * 2,
          t1 = ((k + 1) / 24) * Math.PI * 2;
        const p = (t: number): V3 => [0.705 * Math.cos(t) * Math.cos(a0), 1.6 + 0.705 * Math.sin(t), 0.705 * Math.cos(t) * Math.sin(a0)];
        pts.push(p(t0), p(t1));
      }
    }
    for (const lat of [-0.5, 0, 0.5]) {
      const r = 0.705 * Math.cos(lat),
        y = 1.6 + 0.705 * Math.sin(lat);
      for (let k = 0; k < 24; k++) {
        const t0 = (k / 24) * Math.PI * 2,
          t1 = ((k + 1) / 24) * Math.PI * 2;
        pts.push([r * Math.cos(t0), y, r * Math.sin(t0)], [r * Math.cos(t1), y, r * Math.sin(t1)]);
      }
    }
    g.lines(pts);
  });
  // lobby: wall map frame (right wall) — the map itself is a texture
  board(b, [12.75, 3.2, -9], 2.6, 4.4, -Math.PI / 2, 'paper');
  // benches in lobby
  for (const z of [-4, -12.5]) b.box('stone2', [2.4, 0.45, 0.6], [9, 0.225, z]);

  // hall columns
  for (const z of HALL_COLS_Z) {
    column(b, [-7, 0, z], 9, 0.45);
    column(b, [7, 0, z], 9, 0.45);
  }
  // aisle carpet
  b.box('blue', [3, 0.02, 40], [0, 0.01, -37], { edges: false });
  b.box('navy', [3.2, 0.015, 40], [0, 0.005, -37], { edges: false });

  // five plinths of the World Bank Group (z -22.6)
  [-3.2, -1.6, 0, 1.6, 3.2].forEach((x, i) => {
    b.box('stone2', [1.0, 1.0, 1.0], [x, 0.5, -22.6]);
    b.box(i === 0 ? 'navy' : 'blue', [0.6, 0.6, 0.6], [x, 1.3, -22.6], { rot: [0, Math.PI / 4, 0] });
  });

  // long counters with glass screens (left side) z -19..-37 — three teller windows
  b.at([-10.4, 0, -28], 0, (c) => {
    c.box('stone2', [1.3, 1.15, 18], [0, 0.575, 0]);
    c.box('navy', [1.45, 0.08, 18.1], [0, 1.19, 0]);
    for (const z of [-6, 0, 6]) {
      c.box('glass', [0.05, 1.3, 3.6], [0.1, 1.9, z], { edges: false });
      c.box('steel', [0.08, 1.35, 0.08], [0.1, 1.9, z - 1.8]);
      c.box('steel', [0.08, 1.35, 0.08], [0.1, 1.9, z + 1.8]);
      c.box('steel', [0.1, 0.08, 3.7], [0.1, 2.58, z]);
      c.box('cyan', [0.02, 0.24, 1.4], [0.66, 0.85, z], { edges: false });
    }
    for (const z of [-3, 3]) c.box('steel', [0.1, 1.4, 0.1], [0.1, 1.9, z]);
  });

  // archive wall with ledgers (right wall) z -19..-31
  b.at([12.3, 0, -25], 0, (a) => {
    a.box('wood', [0.6, 5.2, 12], [0, 2.6, 0], { edges: false });
    for (let s = 0; s < 6; s++) {
      const y = 0.35 + s * 0.82;
      a.box('stone2', [0.7, 0.06, 12], [-0.05, y, 0]);
      for (let k = 0; k < 34; k++) {
        const z = -5.8 + k * 0.345;
        const key = (k + s) % 5 === 0 ? 'blue' : (k + s) % 7 === 0 ? 'cyan' : 'navy';
        ledger(a, [-0.2, y + 0.03, z], true, key, Math.PI / 2);
      }
    }
    a.box('stone2', [0.75, 0.15, 12.2], [-0.05, 5.25, 0]);
    // rolling ladder
    a.box('steel', [0.05, 5.4, 0.05], [-0.9, 2.7, -2.2], { rot: [0, 0, 0.15] });
    a.box('steel', [0.05, 5.4, 0.05], [-0.9, 2.7, -1.6], { rot: [0, 0, 0.15] });
  });

  // dais at the far left with lectern and governors' chairs
  b.at([-6.5, 0, -52.5], 0, (d) => {
    d.box('stone2', [6, 0.4, 4], [0, 0.2, 0]);
    d.box('stone1', [5.4, 0.2, 3.4], [0, 0.5, 0]);
    d.box('navy', [4, 3.6, 0.1], [0, 2.4, -1.9]); // backdrop
    d.box('cyan', [4, 0.08, 0.02], [0, 1.0, -1.84], { edges: false });
    d.box('wood', [0.8, 1.2, 0.6], [0, 1.2, 1.0]); // lectern
    d.box('navy', [0.9, 0.06, 0.7], [0, 1.82, 1.0], { rot: [-0.25, 0, 0] });
    for (const x of [-1.5, 0, 1.5]) chair(d, [x, 0.6, -0.9]);
    d.box('steel', [0.05, 2.6, 0.05], [2.4, 1.9, -1.2]); // flag pole
    d.box('blue', [0.9, 0.6, 0.02], [2.85, 2.9, -1.2], { edges: false });
  });

  // treasury counter + vault door (right far)
  b.at([9.4, 0, -46.5], 0, (t) => {
    t.box('stone2', [1.3, 1.15, 6], [0, 0.575, 0]);
    t.box('navy', [1.45, 0.08, 6.1], [0, 1.19, 0]);
    for (let i = 0; i < 4; i++) t.box('navy', [0.5, 0.25, 0.35], [0, 1.36 + 0.26 * (i % 2), -1.6 + i * 0.5]);
    for (let i = 0; i < 3; i++) t.box('blue', [0.45, 0.22, 0.32], [0.1, 1.35, 1.0 + i * 0.4]);
    t.box('steel', [0.05, 1.1, 6], [-0.66, 1.8, 0], { edges: false });
  });
  b.at([12.7, 0, -46.5], -Math.PI / 2, (v) => {
    v.cyl('steel', 1.6, 1.6, 0.3, [0, 2.0, 0.15], 32, { rot: [Math.PI / 2, 0, 0], edges: 50 });
    v.cyl('stone2', 1.25, 1.25, 0.35, [0, 2.0, 0.2], 32, { rot: [Math.PI / 2, 0, 0], edges: 50 });
    v.torus('navy', 0.5, 0.06, [0, 2.0, 0.42]);
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      v.box('navy', [0.08, 0.7, 0.08], [Math.cos(a) * 0.3, 2.0 + Math.sin(a) * 0.3, 0.45], { rot: [0, 0, a] });
    }
  });

  // loan desk (centre right) at (8, 0, -36.5)
  b.at([8, 0, -36.5], 0, (l) => {
    table(l, [0, 0, 0], 2.6, 1.3, 0.78, 0, 'wood');
    l.box('navy', [2.6, 0.7, 0.05], [0, 0.4, 0.62], { edges: false });
    chair(l, [0, 0, -1.0]);
    chair(l, [-0.6, 0, 1.1], Math.PI);
    chair(l, [0.6, 0, 1.1], Math.PI);
    ledger(l, [-0.6, 0.82, 0], false, 'blue');
    for (let i = 0; i < 5; i++) l.box('paper', [0.42, 0.02, 0.3], [0.6, 0.83 + i * 0.022, 0.05], { edges: i === 4 ? 25 : false });
    l.box('navy', [0.8, 0.18, 0.06], [0, 0.95, 0.5], { rot: [-0.4, 0, 0] }); // nameplate
  });

  // stamp table (left, between the column rows z -38 / -44) at (-9.8, 0, -41)
  b.at([-9.8, 0, -41], Math.PI / 2, (s) => {
    table(s, [0, 0, 0], 2.2, 1.2, 0.85, 0, 'stone2');
    for (let i = 0; i < 4; i++) {
      const x = -0.7 + i * 0.45;
      s.cyl('navy', 0.07, 0.09, 0.12, [x, 0.95, -0.25], 10);
      s.sphere('steel', 0.06, [x, 1.07, -0.25], 8);
    }
    s.box('blue', [0.5, 0.03, 0.35], [0.6, 0.9, -0.3]); // ink pad
    for (let i = 0; i < 3; i++) s.box('paper', [0.42, 0.01, 0.3], [-0.4 + i * 0.5, 0.89, 0.25], { rot: [0, 0.2 * i - 0.2, 0] });
    s.cyl('bad', 0.08, 0.08, 0.01, [0.1, 0.9, 0.28], 16, { edges: false }); // red seal
  });
}

export function Floor1() {
  const map = useMemo(
    () =>
      drawTexture(512, 880, (ctx, w, h) => {
        paintVietnam(ctx, w, h, { fill: cssVar('--surface-2'), stroke: cssVar('--wb-navy'), water: cssVar('--page') });
        ctx.fillStyle = cssVar('--wb-navy');
        ctx.font = `600 40px ${cssVar('--font-title')}`;
        ctx.textAlign = 'left';
        ctx.fillText('VIỆT NAM', 24, h - 40);
      }),
    [],
  );
  const notice = useMemo(
    () =>
      drawTexture(640, 400, (ctx, w, h) => {
        ctx.fillStyle = cssVar('--surface');
        ctx.fillRect(0, 0, w, h);
        const cards: [number, number, number, number][] = [
          [30, 30, 170, 150],
          [230, 40, 180, 120],
          [440, 30, 170, 170],
          [40, 220, 200, 150],
          [270, 200, 150, 170],
          [450, 230, 160, 130],
        ];
        cards.forEach(([x, y, cw, ch], i) => {
          ctx.fillStyle = cssVar('--page');
          ctx.fillRect(x, y, cw, ch);
          ctx.strokeStyle = cssVar('--wb-navy');
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, cw, ch);
          ctx.fillStyle = cssVar(i % 2 ? '--wb-blue' : '--wb-cyan');
          ctx.beginPath();
          ctx.arc(x + cw / 2, y + 10, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = cssVar('--muted');
          for (let l = 0; l < 4; l++) ctx.fillRect(x + 14, y + 36 + l * 24, cw - 28 - (l % 2) * 30, 6);
        });
      }),
    [],
  );
  const plinthLabels = useMemo(
    () =>
      ['IBRD', 'IDA', 'IFC', 'MIGA', 'ICSID'].map((t) =>
        textTexture([t], { w: 256, h: 96, bg: '--page', fg: '--wb-navy', size: 46 }),
      ),
    [],
  );
  const counterSigns = useMemo(
    () => ['IPF', 'DPF', 'PforR'].map((t) => textTexture([t], { w: 256, h: 96, bg: '--wb-navy', fg: '--page', size: 50 })),
    [],
  );
  const lobbySign = useMemo(
    () =>
      textTexture(['BANKING HALL'], {
        w: 1024,
        h: 128,
        bg: '--stone-2',
        fg: '--wb-navy',
        size: 64,
      }),
    [],
  );
  void THREE;
  return (
    <group name="f1">
      <Static build={buildFloor1} />
      <FrontDoor />
      <TexPlane tex={map} position={[12.68, 3.2, -9]} rotation={FACE.west} size={[2.6, 4.4]} />
      <TexPlane tex={notice} position={[-12.68, 2.5, -6]} rotation={FACE.east} size={[3.2, 2.0]} />
      <TexPlane tex={lobbySign} position={[0, 7.6, -15.68]} rotation={FACE.south} size={[6, 0.75]} />
      {plinthLabels.map((t, i) => (
        <TexPlane key={i} tex={t} position={[-3.2 + i * 1.6, 0.6, -22.09]} size={[0.8, 0.3]} />
      ))}
      {counterSigns.map((t, i) => (
        <TexPlane key={i} tex={t} position={[-9.73, 2.25, -34 + i * 6]} rotation={FACE.east} size={[1.0, 0.38]} />
      ))}
      <SceneAnchors scene="f1-rationale-1" at={{ globe: [5.5, 1.6, -6] }} />
      <SceneAnchors scene="f1-rationale-2" at={{ map: [12.6, 3.2, -9] }} />
      <SceneAnchors scene="f1-problem" at={{ board: [-12.6, 2.5, -6] }} />
      <SceneAnchors scene="f1-objectives" at={{ desk: [-5, 1.2, -11] }} />
      <SceneAnchors scene="f1-scope" at={{ map: [12.6, 3.2, -9] }} />
      <SceneAnchors
        scene="f1-wbg"
        at={{ ibrd: [-3.2, 1.6, -22.6], ida: [-1.6, 1.6, -22.6], ifc: [0, 1.6, -22.6], miga: [1.6, 1.6, -22.6], icsid: [3.2, 1.6, -22.6] }}
      />
      <SceneAnchors scene="f1-what" at={{ dais: [-6.5, 1.5, -52] }} />
      <SceneAnchors scene="f1-gov" at={{ lectern: [-6.5, 1.8, -51.5], chairs: [-6.5, 1.2, -53.4] }} />
      <SceneAnchors scene="f1-history-1" at={{ archive: [12, 2.5, -25] }} />
      <SceneAnchors scene="f1-history-2" at={{ archive: [12, 2.5, -25] }} />
      <SceneAnchors scene="f1-funds" at={{ vault: [12.4, 2.0, -46.5], counter: [9.4, 1.3, -46.5] }} />
      <SceneAnchors scene="f1-instruments" at={{ ipf: [-9.8, 1.9, -34], dpf: [-9.8, 1.9, -28], pforr: [-9.8, 1.9, -22] }} />
      <SceneAnchors scene="f1-terms" at={{ desk: [8, 0.9, -36.5] }} />
      <SceneAnchors scene="f1-voting" at={{ stamps: [-9.55, 1.0, -41.2] }} />
      <SceneAnchors scene="f1-safeguards" at={{ stamps: [-9.55, 1.0, -41.2] }} />
    </group>
  );
}


