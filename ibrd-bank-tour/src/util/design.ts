import { useEffect, useState } from 'react';

export const DESIGN_W = 1920;
export const DESIGN_H = 1080;

export interface DesignBox {
  s: number;
  ox: number;
  oy: number;
}

export const designBox: DesignBox = { s: 1, ox: 0, oy: 0 };

function compute(): DesignBox {
  const w = window.innerWidth,
    h = window.innerHeight;
  const s = Math.min(w / DESIGN_W, h / DESIGN_H);
  return { s, ox: (w - DESIGN_W * s) / 2, oy: (h - DESIGN_H * s) / 2 };
}

/** Root scale factor: the 1920x1080 design layer is scaled to fit any window (letterboxed). */
export function useDesignScale() {
  const [box, setBox] = useState(compute);
  useEffect(() => {
    const on = () => {
      const b = compute();
      Object.assign(designBox, b);
      document.documentElement.style.setProperty('--scale', String(b.s));
      setBox(b);
    };
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return box;
}

/** Convert window (client) pixels to design pixels. */
export function toDesign(x: number, y: number): [number, number] {
  return [(x - designBox.ox) / designBox.s, (y - designBox.oy) / designBox.s];
}
