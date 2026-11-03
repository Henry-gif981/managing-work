import { useMemo } from 'react';
import { Builder, board, chair, column, ledger, scales, table } from '../builder';
import { FACE, Static, TexPlane, shell } from '../common';
import { drawTexture, textTexture } from '../textures';
import { cssVar } from '../../theme';
import { SceneAnchors } from '../anchors';

const Y = 10;

function buildFloor2(b: Builder) {
  shell(b, Y);
  for (const z of [-20, -32, -44]) {
    column(b, [-6.5, Y, z], 9, 0.42);
    column(b, [6.5, Y, z], 9, 0.42);
  }
  // aisle carpet
  b.box('blue', [2.6, 0.02, 56], [0, Y + 0.01, -29.5], { edges: false });

  // round table with six chairs (0, -30)
  b.at([0, Y, -30], 0, (t) => {
    t.cyl('wood', 1.6, 1.6, 0.08, [0, 0.78, 0], 32, { edges: 40 });
    t.cyl('steel', 0.12, 0.12, 0.74, [0, 0.37, 0], 10);
    t.cyl('steel', 0.5, 0.6, 0.06, [0, 0.03, 0], 16);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      chair(t, [Math.sin(a) * 2.1, 0, Math.cos(a) * 2.1], a + Math.PI);
    }
    // three dossiers: IPF / DPF / PforR
    (['navy', 'blue', 'cyan'] as const).forEach((k, i) => {
      const a = ((i - 1) * Math.PI) / 3.2;
      t.box(k, [0.45, 0.08, 0.32], [Math.sin(a) * 0.8, 0.86, Math.cos(a) * 0.8], { rot: [0, a, 0] });
    });
    t.cyl('steel', 0.18, 0.22, 0.25, [0, 0.95, 0], 12);
  });

  // finance desk with ledgers and scales (-8, -42.5)
  b.at([-8.4, Y, -42.5], 0, (d) => {
    d.box('wood', [1.6, 0.85, 4.2], [0, 0.425, 0]);
    d.box('navy', [1.75, 0.07, 4.35], [0, 0.88, 0]);
    chair(d, [-1.2, 0, 0], Math.PI / 2);
    for (let i = 0; i < 4; i++) ledger(d, [0.1, 0.92 + i * 0.075, -1.4], false, i % 2 ? 'blue' : 'navy', 0.1 * i);
    for (let i = 0; i < 3; i++) ledger(d, [0.2, 0.92 + i * 0.075, 1.3], false, i % 2 ? 'cyan' : 'navy', -0.15 * i);
    scales(d, [0.1, 0.92, 0.1], 0.75);
    // letter of credit / documents (special commitment)
    for (let i = 0; i < 4; i++) d.box('paper', [0.32, 0.012, 0.42], [0.35, 0.93 + i * 0.014, -0.65], { rot: [0, 0.1 * i, 0], edges: i === 3 ? 25 : false });
    d.box('cyan', [0.3, 0.01, 0.06], [0.35, 0.99, -0.5], { edges: false });
  });
  // filing cabinets behind finance desk
  for (let i = 0; i < 4; i++)
    b.at([-12.45, Y, -45 + i * 1.1], 0, (c) => {
      c.box('steel', [0.7, 1.4, 1.0], [0, 0.7, 0]);
      for (let k = 0; k < 3; k++) c.box('stone2', [0.02, 0.32, 0.6], [0.36, 0.3 + k * 0.42, 0], { edges: false });
    });

  // library alcove (right wall) z -36..-24
  b.at([12.25, Y, -30], 0, (l) => {
    l.box('stone2', [0.3, 6, 13], [0.25, 3, 0], { edges: false });
    for (const z of [-6.4, -2.15, 2.15, 6.4]) l.box('wood', [0.9, 5.2, 0.12], [-0.2, 2.6, z]);
    for (let s = 0; s < 6; s++) {
      const y = 0.25 + s * 0.85;
      l.box('wood', [0.85, 0.06, 12.8], [-0.2, y, 0]);
      for (let k = 0; k < 40; k++) {
        const z = -6.2 + k * 0.31;
        if (Math.abs(z + 2.15) < 0.12 || Math.abs(z - 2.15) < 0.12) continue;
        const key = (k * 3 + s) % 4 === 0 ? 'blue' : (k + s) % 5 === 0 ? 'cyan' : (k + s) % 3 === 0 ? 'white' : 'navy';
        const h = 0.5 + ((k * 7 + s * 3) % 5) * 0.05;
        l.box(key, [0.5, h, 0.22], [-0.3, y + 0.03 + h / 2, z], { edges: 30 });
      }
    }
  });
  // reading chair + lamp
  chair(b, [9.6, Y, -28.5], -Math.PI / 2);
  b.cyl('steel', 0.03, 0.03, 1.6, [9.6, Y + 0.8, -27.2], 6);
  b.cone('cyan', 0.25, 0.3, [9.6, Y + 1.7, -27.2], 12);

  // plans table (feasibility studies) at (7.5, -46.5)
  b.at([7.6, Y, -46.6], 0, (p) => {
    table(p, [0, 0, 0], 2.8, 1.6, 0.9, 0, 'stone2');
    p.box('paper', [1.8, 0.01, 1.1], [-0.2, 0.94, 0], { rot: [0, 0.08, 0] });
    p.lines([
      [-0.9, 0.95, -0.3],
      [0.5, 0.95, -0.3],
      [-0.9, 0.95, 0.1],
      [0.3, 0.95, 0.1],
      [-0.5, 0.95, -0.5],
      [-0.5, 0.95, 0.5],
    ]);
    for (let i = 0; i < 4; i++) p.cyl(i % 2 ? 'paper' : 'cyan', 0.06, 0.06, 1.2, [1.0, 0.99 + 0.12 * (i % 2), -0.45 + i * 0.25], 10, { rot: [Math.PI / 2, 0, 0] });
  });

  // classroom corner (left front): blackboard on left wall, school desks facing it
  board(b, [-12.75, Y + 2.2, -11.5], 4.6, 1.9, Math.PI / 2, 'navy');
  b.box('steel', [0.25, 0.06, 4.6], [-12.6, Y + 1.2, -11.5]);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const x = -9.6 + r * 1.6,
        z = -13.3 + c * 1.6;
      b.at([x, Y, z], -Math.PI / 2, (d) => {
        d.box('wood', [1.0, 0.05, 0.6], [0, 0.74, 0]);
        d.box('steel', [0.9, 0.5, 0.03], [0, 0.45, 0.28], { edges: false });
        d.box('steel', [0.04, 0.72, 0.6], [-0.46, 0.36, 0], { edges: false });
        d.box('steel', [0.04, 0.72, 0.6], [0.46, 0.36, 0], { edges: false });
        chair(d, [0, 0, -0.65]);
      });
    }
  table(b, [-11.3, Y, -15.2], 1.5, 0.8, 0.8, Math.PI / 2, 'wood'); // teacher's desk

  // M&E board on right wall front (z -12)
  board(b, [12.75, Y + 2.4, -12], 3.6, 2.2, -Math.PI / 2, 'paper');
}

export function Floor2() {
  const me = useMemo(
    () =>
      drawTexture(720, 440, (ctx, w, h) => {
        ctx.fillStyle = cssVar('--page');
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = cssVar('--wb-navy');
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, 40);
        ctx.lineTo(60, h - 60);
        ctx.lineTo(w - 40, h - 60);
        ctx.stroke();
        const vals = [0.3, 0.45, 0.4, 0.62, 0.7, 0.85];
        vals.forEach((v, i) => {
          ctx.fillStyle = cssVar(i === vals.length - 1 ? '--wb-cyan' : '--wb-blue');
          const bh = v * (h - 120);
          ctx.fillRect(90 + i * 100, h - 60 - bh, 60, bh);
        });
        ctx.setLineDash([12, 8]);
        ctx.strokeStyle = cssVar('--warn');
        ctx.beginPath();
        ctx.moveTo(60, 80);
        ctx.lineTo(w - 40, 80);
        ctx.stroke();
      }),
    [],
  );
  const sign = useMemo(
    () => textTexture(['OPERATIONS FLOOR'], { w: 1024, h: 128, bg: '--stone-2', fg: '--wb-navy', size: 60 }),
    [],
  );
  const ch2Sign = useMemo(
    () =>
      textTexture(['CHAPTER 2 · HOW THE IBRD SUPPORTS PROJECT FINANCING'], { w: 2048, h: 192, bg: '--wb-navy', fg: '--page', size: 76, underline: true }),
    [],
  );
  const lib = useMemo(() => textTexture(['LIBRARY'], { w: 512, h: 128, bg: '--wb-navy', fg: '--page', size: 64 }), []);
  return (
    <group name="f2">
      <Static build={buildFloor2} />
      <TexPlane tex={me} position={[12.69, Y + 2.4, -12]} rotation={FACE.west} size={[3.6, 2.2]} />
      <TexPlane tex={sign} position={[0, Y + 7.4, -0.79]} rotation={FACE.north} size={[6, 0.75]} />
      <TexPlane tex={lib} position={[12.0, Y + 5.6, -30]} rotation={FACE.west} size={[2.4, 0.6]} />
      <TexPlane tex={ch2Sign} position={[-3.6, Y + 5.4, -40]} rotation={FACE.north} size={[5.4, 0.52]} />
      <SceneAnchors scene="f2-ch2-title" at={{ sign: [-3.6, Y + 5.4, -40] }} />
      <SceneAnchors scene="f2-cycle" at={{ table: [0, Y + 0.9, -30], 'stage-1': [0.0, Y + 0.85, -27.9], 'stage-2': [1.82, Y + 0.85, -28.95], 'stage-3': [1.82, Y + 0.85, -31.05], 'stage-4': [0.0, Y + 0.85, -32.1], 'stage-5': [-1.82, Y + 0.85, -31.05], 'stage-6': [-1.82, Y + 0.85, -28.95] }} />
      <SceneAnchors
        scene="f2-disbursement"
        at={{ desk: [-8.4, Y + 0.95, -42.5], cabinets: [-12.1, Y + 1.0, -43.4], ledgers: [-8.3, Y + 1.1, -43.9], scales: [-8.3, Y + 1.5, -42.4], papers: [-8.05, Y + 0.97, -43.15] }}
      />
      <SceneAnchors scene="f2-counterpart" at={{ scales: [-8.3, Y + 1.5, -42.4] }} />
      <SceneAnchors
        scene="f2-institutional"
        at={{ 'tep-asset': [-12.1, Y + 1.0, -43.4], 'tep-tariff': [-8.3, Y + 1.5, -42.4], 'ccsep-psmu': [0, Y + 0.95, -30], 'ccsep-tariff': [-8.3, Y + 1.1, -43.9], 'ccsep-contracts': [7.4, Y + 1.0, -46.6] }}
      />
      <SceneAnchors scene="f2-three-forms" at={{ prep: [7.4, Y + 1.0, -46.6], impl: [-8.4, Y + 1.0, -42.5], after: [12.6, Y + 2.4, -12] }} />
      <SceneAnchors scene="f2-pforr" at={{ table: [0, Y + 0.95, -30] }} />
      <SceneAnchors scene="f2-package" at={{ table: [0, Y + 0.95, -30], lift: [0, Y + 2.0, -58.2] }} />
      <SceneAnchors scene="f2-ipf" at={{ dossier: [-0.5, Y + 0.95, -29.3] }} />
      <SceneAnchors scene="f2-dpf" at={{ dossier: [0, Y + 0.95, -29.2] }} />
      <SceneAnchors scene="f2-pforr" at={{ dossier: [0.5, Y + 0.95, -29.3] }} />
      <SceneAnchors scene="f2-vn-procedures" at={{ desk: [-8.4, Y + 1.0, -42.5] }} />
      <SceneAnchors scene="f2-disbursement" at={{ scales: [-8.3, Y + 1.6, -42.4] }} />
      <SceneAnchors scene="f2-counterpart" at={{ ledgers: [-8.2, Y + 1.1, -41.2] }} />
      <SceneAnchors scene="f2-prep" at={{ plans: [7.4, Y + 1.0, -46.6] }} />
      <SceneAnchors scene="f2-asa" at={{ library: [12, Y + 2.6, -30] }} />
      <SceneAnchors scene="f2-me" at={{ board: [12.6, Y + 2.4, -12] }} />
      <SceneAnchors scene="f2-training-pmu" at={{ desks: [-8, Y + 0.8, -11.7] }} />
      <SceneAnchors scene="f2-training-knowledge" at={{ blackboard: [-12.6, Y + 2.2, -11.5] }} />
    </group>
  );
}
