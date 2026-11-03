/** Rough outline of Vietnam (lon, lat). Good enough for a wall map silhouette. */
export const VN_OUTLINE: [number, number][] = [
  [102.1, 22.4], [103.0, 22.6], [104.1, 22.8], [105.3, 23.3], [106.7, 22.9], [107.4, 22.6], [108.0, 21.6],
  [107.0, 21.0], [106.6, 20.4], [105.9, 19.6], [105.7, 18.9], [106.4, 18.1], [106.75, 17.5], [107.2, 16.8],
  [108.2, 16.1], [108.8, 15.4], [109.0, 14.8], [109.3, 13.8], [109.4, 13.0], [109.25, 12.3], [109.15, 11.8],
  [109.05, 11.55], [108.6, 11.1], [108.0, 10.7], [107.1, 10.4], [106.7, 10.0], [106.4, 9.5], [105.6, 8.9],
  [104.9, 8.6], [104.8, 9.6], [104.5, 10.4], [105.1, 10.9], [106.1, 11.0], [106.4, 11.7], [107.5, 12.3],
  [107.6, 13.5], [107.5, 14.6], [107.6, 15.3], [107.2, 15.9], [106.7, 16.4], [106.0, 17.3], [105.6, 18.1],
  [105.0, 18.7], [104.0, 19.3], [104.5, 19.9], [104.0, 20.3], [103.4, 20.6], [102.9, 21.2], [102.1, 21.7],
];

export const VN_BOUNDS = { lon0: 101.6, lon1: 110.2, lat0: 8.2, lat1: 23.6 };

export const CCSEP_CITIES: { id: string; name: string; lon: number; lat: number }[] = [
  { id: 'dong-hoi', name: 'Dong Hoi', lon: 106.6, lat: 17.47 },
  { id: 'quy-nhon', name: 'Quy Nhon', lon: 109.22, lat: 13.77 },
  { id: 'nha-trang', name: 'Nha Trang', lon: 109.19, lat: 12.24 },
  { id: 'phan-rang', name: 'Phan Rang-Thap Cham', lon: 108.99, lat: 11.56 },
];

/** Map lon/lat to 0..1 (u right, v up) inside VN_BOUNDS. */
export function project(lon: number, lat: number): [number, number] {
  const b = VN_BOUNDS;
  return [(lon - b.lon0) / (b.lon1 - b.lon0), (lat - b.lat0) / (b.lat1 - b.lat0)];
}

export function paintVietnam(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: { fill: string; stroke: string; water?: string },
) {
  if (colors.water) {
    ctx.fillStyle = colors.water;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.beginPath();
  VN_OUTLINE.forEach(([lon, lat], i) => {
    const [u, v] = project(lon, lat);
    const x = u * w,
      y = (1 - v) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = colors.fill;
  ctx.fill();
  ctx.lineWidth = Math.max(2, w / 200);
  ctx.strokeStyle = colors.stroke;
  ctx.stroke();
}
