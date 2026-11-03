import * as THREE from 'three';
import { cssVar } from '../theme';

export interface TextTexOpts {
  w?: number;
  h?: number;
  bg?: string; // token name or css colour
  fg?: string;
  font?: string; // css font shorthand without size
  size?: number;
  align?: CanvasTextAlign;
  underline?: boolean;
}

const col = (v: string) => (v.startsWith('--') ? cssVar(v) : v);

/** Canvas texture with one or more lines of text. Redraws once fonts are ready. */
export function textTexture(lines: string[], o: TextTexOpts = {}) {
  const w = o.w ?? 512,
    h = o.h ?? 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const draw = () => {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    if (o.bg) {
      ctx.fillStyle = col(o.bg);
      ctx.fillRect(0, 0, w, h);
    }
    const size = o.size ?? Math.floor(h / (lines.length + 1));
    ctx.fillStyle = col(o.fg ?? '--wb-navy');
    ctx.font = `${size}px ${o.font ?? "'Playfair Display', Georgia, serif"}`;
    ctx.textAlign = o.align ?? 'center';
    ctx.textBaseline = 'middle';
    const x = ctx.textAlign === 'center' ? w / 2 : 24;
    const lh = size * 1.25;
    const y0 = h / 2 - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, y0 + i * lh));
    if (o.underline) {
      ctx.fillStyle = col('--wb-cyan');
      ctx.fillRect(w / 2 - w * 0.08, y0 + (lines.length - 1) * lh + size * 0.75, w * 0.16, Math.max(3, size * 0.08));
    }
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts?.ready) document.fonts.ready.then(draw);
  return tex;
}

/** Canvas texture drawn by a callback (maps, timelines...). */
export function drawTexture(w: number, h: number, paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const draw = () => {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    paint(ctx, w, h);
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts?.ready) document.fonts.ready.then(draw);
  return tex;
}

/** Vertical sky gradient: cyan top -> white horizon. */
export function skyTexture() {
  return drawTexture(4, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, cssVar('--sky-top'));
    g.addColorStop(0.62, cssVar('--sky-horizon'));
    g.addColorStop(1, cssVar('--sky-horizon'));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}
