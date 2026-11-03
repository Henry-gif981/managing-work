// Dev helper: find a camera pose that puts a set of 3D anchors inside a screen band
// (e.g. the strip left of a centred table) so callout lines end on visible props.
// usage: node scripts/frame-props.mjs '{"anchors":[[x,y,z],...],"band":[90,300],"room":{"x":[-12.5,12.5],"z":[-57,-1],"y":[1.5,3.4]},"avoid":[[x,z,r],...],"fov":50,"dist":[3,10]}'
import * as THREE from 'three';
const o = JSON.parse(process.argv[2]);
const W = 1920, H = 1080;
const cam = new THREE.PerspectiveCamera(o.fov ?? 50, W / H, 0.1, 400);
const A = o.anchors.map((a) => new THREE.Vector3(...a));
const c = A.reduce((s, v) => s.add(v), new THREE.Vector3()).multiplyScalar(1 / A.length);
const bandX = o.band, bandY = o.bandY ?? [160, 980];
const want = (bandX[0] + bandX[1]) / 2;
const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
const halfW = halfH * (W / H);
let best = null;
const rnd = (a, b) => a + Math.random() * (b - a);
for (let k = 0; k < 60000; k++) {
  const p = new THREE.Vector3(rnd(...o.room.x), rnd(...o.room.y), rnd(...o.room.z));
  const d = p.distanceTo(c);
  if (d < o.dist[0] || d > o.dist[1]) continue;
  if ((o.avoid ?? []).some(([x, z, r]) => Math.hypot(p.x - x, p.z - z) < r)) continue;
  // yaw so the centroid lands at `want`; slight downward pitch towards the centroid
  const dir = c.clone().sub(p);
  const yaw0 = Math.atan2(dir.x, -dir.z);
  const ndc = (want / W) * 2 - 1;
  const off = Math.atan(ndc * halfW);
  const horiz = Math.hypot(dir.x, dir.z);
  const pitch = Math.atan2(dir.y, horiz) * (o.pitchFollow ?? 0.6);
  const yaw = yaw0 - off;
  const f = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
  const t = p.clone().addScaledVector(f, 8);
  cam.position.copy(p);
  cam.lookAt(t);
  cam.updateMatrixWorld();
  let ok = true, spread = 0;
  const pts = A.map((a) => {
    const q = a.clone().project(cam);
    return [((q.x + 1) / 2) * W, ((1 - q.y) / 2) * H, q.z];
  });
  for (const [x, y, z] of pts) if (z > 1 || x < bandX[0] || x > bandX[1] || y < bandY[0] || y > bandY[1]) ok = false;
  if (!ok) continue;
  const ys = pts.map((q) => q[1]);
  spread = Math.max(...ys) - Math.min(...ys);
  const score = -Math.abs(d - (o.prefer ?? 6)) + Math.min(spread, 500) / 300;
  if (!best || score > best.score) best = { score, p, t, pts };
}
if (!best) { console.log('no pose found'); process.exit(1); }
const r = (n) => Math.round(n * 100) / 100;
console.log(JSON.stringify({ pos: [r(best.p.x), r(best.p.y), r(best.p.z)], target: [r(best.t.x), r(best.t.y), r(best.t.z)], fov: o.fov ?? 50 }));
console.log(best.pts.map((q) => q.slice(0, 2).map(Math.round).join(',')).join('  '));
