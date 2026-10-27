// Procedural hero objects (DESIGN-3D.md §3). Generic symbols only — no statues, figures, logos or text.
// Every builder returns { group, glows, update(t, ctx), select?(i) } normalised to height 1, centred at the origin.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { VN_POINTS, VN_W, VN_H } from '../art/vietnam.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const mesh = (g, m, cast = true) => { const o = new THREE.Mesh(g, m); o.castShadow = cast; return o; };

function lathe(profile, m, seg = 64) { return mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg), m); }
function plinth(M, r = 1, h = 0.32) {
  const g = new THREE.Group();
  g.add(lathe([[0, 0], [r * 1.08, 0], [r * 1.08, h * 0.28], [r * 1.0, h * 0.34], [r * 0.96, h * 0.62], [r * 1.02, h * 0.7], [r * 1.02, h], [0, h]], M.marbleDark));
  const top = mesh(new THREE.CircleGeometry(r * 1.0, 64), new THREE.MeshStandardMaterial({ color: 0xD9D3C6, roughness: 0.4, metalness: 0, envMapIntensity: 0.5 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; g.add(top);
  return g;
}
function contactShadow(M, r) {
  const m = new THREE.MeshBasicMaterial({ map: M.shadowTex, transparent: true, depthWrite: false, opacity: 0.9 });
  const s = mesh(new THREE.PlaneGeometry(r * 3.2, r * 1.6), m, false);
  s.rotation.x = -Math.PI / 2; s.position.y = -0.001; s.renderOrder = -1;
  return s;
}
function glow(M, size, pos, strength = 1) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: M.glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 * strength }));
  sp.scale.set(size, size, 1); sp.position.copy(pos); sp.userData.base = 0.85 * strength;
  return sp;
}
// merge the static mesh children of a group that share a material (draw calls: pylon 222 → ~10)
function mergeStatic(group, keep = new Set()) {
  const byMat = new Map();
  for (const o of [...group.children]) {
    if (!o.isMesh || keep.has(o) || o.material.map === undefined && false) continue;
    if (!byMat.has(o.material)) byMat.set(o.material, []);
    byMat.get(o.material).push(o);
  }
  for (const [mat, list] of byMat) {
    if (list.length < 3) continue;
    const geos = list.map((m) => { m.updateMatrix(); let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); g.applyMatrix4(m.matrix);
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); return g; });
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    list.forEach((m) => { group.remove(m); m.geometry.dispose(); });
    geos.forEach((g) => g.dispose());
    group.add(new THREE.Mesh(merged, mat));
  }
  return group;
}
function normalize(group, height = 1) {
  const box = new THREE.Box3().setFromObject(group);
  const s = height / (box.max.y - box.min.y);
  const inner = new THREE.Group(); inner.add(group);
  group.scale.setScalar(s);
  const c = box.getCenter(new THREE.Vector3());
  group.position.set(-c.x * s, -(box.min.y * s) - height / 2, -c.z * s);
  return inner;
}
// kintsugi seams: wandering curves on a sphere surface
function seams(M, radius, center, n = 5, seed = 7) {
  let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const out = [];
  for (let k = 0; k < n; k++) {
    let th = rnd() * Math.PI * 2, ph = 0.7 + rnd() * 1.7; const pts = []; const dth = 0.16 + rnd() * 0.08, dph = (rnd() - 0.5) * 0.12;
    for (let i = 0; i < 9; i++) { th += dth + (rnd() - 0.5) * 0.05; ph += dph + (rnd() - 0.5) * 0.06; pts.push(V(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)).multiplyScalar(radius * 1.003).add(center)); }
    out.push(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, radius * 0.014, 6), M.goldGlow, false));
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ objects
const B = {};
B.globe = (M, q) => {
  const g = new THREE.Group();
  const R = 1;
  const ball = mesh(new THREE.SphereGeometry(R, q.seg * 2, q.seg), M.marble); ball.position.y = 1.85; g.add(ball);
  const ring = (rx, ry, rz, r = R * 1.012, t = 0.018) => { const m = mesh(new THREE.TorusGeometry(r, t, 8, q.seg * 2), M.gold); m.rotation.set(rx, ry, rz); m.position.y = 1.85; return m; };
  g.add(ring(Math.PI / 2, 0, 0, R * 1.012, 0.022));
  g.add(ring(0, 0, 0.4)); g.add(ring(0, Math.PI / 3, 0.4)); g.add(ring(0, -Math.PI / 3, 0.4));
  const meridian = mesh(new THREE.TorusGeometry(R * 1.18, 0.035, 10, q.seg * 2, Math.PI * 1.25), M.gold);
  meridian.rotation.z = -Math.PI * 0.12 - 0.4; meridian.position.y = 1.85; g.add(meridian);
  const axis = mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.7, 12), M.gold); axis.position.y = 1.85; axis.rotation.z = 0.4; g.add(axis);
  const neck = lathe([[0, 0], [0.42, 0], [0.42, 0.1], [0.16, 0.22], [0.12, 0.5], [0.22, 0.62], [0, 0.66]], M.marbleDark, q.seg); neck.position.y = 0.32; g.add(neck);
  const sm = seams(M, R, V(0, 1.85, 0), 4);
  sm.forEach((m) => g.add(m));
  g.add(plinth(M, 1.05)); g.add(contactShadow(M, 1.2));
  const glows = [glow(M, 1.1, V(0.55, 2.2, 0.75), 0.6)];
  glows.forEach((s) => g.add(s));
  const root = normalize(g);
  return { group: root, glows, update(t) { ball.rotation.y = t * 0.12; sm.forEach((m) => { m.rotation.y = t * 0.12; m.position.set(0, 0, 0); }); } };
};
B.temple = (M, q) => {
  const g = new THREE.Group();
  const step = (w, d, h, y) => { const m = mesh(new THREE.BoxGeometry(w, h, d), M.marble); m.position.y = y + h / 2; g.add(m); return y + h; };
  let y = step(4.3, 2.2, 0.16, 0.32); y = step(4.0, 1.95, 0.16, y); y = step(3.7, 1.7, 0.16, y);
  const colH = 2.1;
  for (let i = 0; i < 6; i++) {
    const x = -1.55 + i * 0.62;
    const col = mesh(new THREE.CylinderGeometry(0.15, 0.17, colH, q.seg, 1), M.marble); col.position.set(x, y + colH / 2, 0.55); g.add(col);
    const cap = mesh(new THREE.BoxGeometry(0.42, 0.1, 0.42), M.marble); cap.position.set(x, y + colH + 0.05, 0.55); g.add(cap);
    const base = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.08, q.seg), M.marble); base.position.set(x, y + 0.04, 0.55); g.add(base);
    const col2 = col.clone(); col2.position.z = -0.45; g.add(col2);
  }
  const wall = mesh(new THREE.BoxGeometry(3.3, colH, 0.6), M.marbleDark); wall.position.set(0, y + colH / 2, -0.1); g.add(wall);
  y += colH + 0.1;
  const arch = mesh(new THREE.BoxGeometry(3.9, 0.36, 1.6), M.marble); arch.position.y = y + 0.18; g.add(arch);
  const frieze = mesh(new THREE.BoxGeometry(3.92, 0.05, 1.62), M.goldGlow); frieze.position.y = y + 0.3; g.add(frieze);
  y += 0.36;
  const tri = new THREE.Shape(); tri.moveTo(-2.05, 0); tri.lineTo(2.05, 0); tri.lineTo(0, 0.85); tri.closePath();
  const ped = mesh(new THREE.ExtrudeGeometry(tri, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 }), M.marble);
  ped.position.set(0, y, -0.75); g.add(ped);
  const acro = mesh(new THREE.SphereGeometry(0.11, 16, 12), M.gold); acro.position.set(0, y + 0.92, 0.0); g.add(acro);
  const disc = mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 32), M.gold); disc.position.set(0, y + 0.36, 0.78); g.add(disc);
  g.add(plinth(M, 2.35)); g.add(contactShadow(M, 2.6));
  mergeStatic(g);
  const glows = [glow(M, 0.55, V(0, y + 0.36, 0.85), 0.45), glow(M, 1.6, V(0, y - 0.08, 0.9), 0.18)];
  glows.forEach((s) => g.add(s));
  return { group: normalize(g), glows, update() {} };
};
B.tiers = (M, q) => {
  const g = new THREE.Group();
  const tier = (r, h, y) => { g.add(lathe([[0, 0], [r, 0], [r, h], [0, h]], M.marble, q.seg)); const t = g.children[g.children.length - 1]; t.position.y = y;
    const band = mesh(new THREE.TorusGeometry(r * 1.005, 0.025, 8, q.seg * 2), M.gold); band.rotation.x = Math.PI / 2; band.position.y = y + h - 0.03; g.add(band); return y + h; };
  let y = tier(1.5, 0.5, 0.32); y = tier(1.12, 0.5, y); y = tier(0.76, 0.5, y);
  const sphere = mesh(new THREE.SphereGeometry(0.46, q.seg * 2, q.seg), M.gold); sphere.position.y = y + 0.46; g.add(sphere);
  const core = mesh(new THREE.TorusGeometry(0.5, 0.02, 8, 64), M.goldGlow); core.position.y = y + 0.46; core.rotation.x = Math.PI / 2.3; g.add(core);
  for (let i = 0; i < 6; i++) { const c = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 32), M.gold); c.position.set(-1.05 + (i % 2) * 0.03, 0.85 + i * 0.065, 1.25); g.add(c); }
  const roll = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.9, 24), M.paper); roll.rotation.z = Math.PI / 2; roll.position.set(0.95, 0.94, 1.15); g.add(roll);
  const seal = mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.05, 20), M.wax); seal.rotation.x = Math.PI / 2; seal.position.set(0.95, 0.94, 1.27); g.add(seal);
  const rib = mesh(new THREE.TorusGeometry(0.115, 0.012, 6, 24), M.gold); rib.rotation.y = Math.PI / 2; rib.position.set(1.15, 0.94, 1.15); g.add(rib);
  g.add(plinth(M, 1.7)); g.add(contactShadow(M, 1.9));
  const glows = [glow(M, 1.6, V(0, y + 0.46, 0.2), 0.75)];
  glows.forEach((s) => g.add(s));
  return { group: normalize(g), glows, update(t) { sphere.rotation.y = t * 0.2; core.rotation.z = t * 0.15; } };
};
function itemIPF(M, q) { // a built asset: stone block with gold rebar seams
  const g = new THREE.Group();
  const block = mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3, 1, 1, 1), M.marble); block.position.y = 1.0; block.rotation.y = 0.6; g.add(block);
  const seamM = M.goldGlow;
  [[0.651, 0, 0], [-0.651, 0, 0], [0, 0, 0.651]].forEach(([x, , z], i) => { const s = mesh(new THREE.BoxGeometry(i < 2 ? 0.02 : 1.32, 1.32, i < 2 ? 1.32 : 0.02), seamM, false); s.position.set(x * 0.2, 1.0, z * 0.2); s.rotation.y = 0.6; g.add(s); });
  const beam = mesh(new THREE.BoxGeometry(1.8, 0.12, 0.3), M.gold); beam.position.set(0, 1.72, 0); beam.rotation.y = 0.6; g.add(beam);
  g.add(plinth(M, 0.95, 0.3));
  return { g, glowAt: V(0, 1.0, 0.7) };
}
function itemDPF(M, q) { // a policy decree: scroll on a lectern with a wax seal
  const g = new THREE.Group();
  const post = mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.0, q.seg), M.marble); post.position.y = 0.8; g.add(post);
  const desk = mesh(new THREE.BoxGeometry(1.4, 0.08, 0.9), M.marble); desk.position.y = 1.35; desk.rotation.x = -0.35; g.add(desk);
  const sheet = mesh(new THREE.BoxGeometry(1.2, 0.02, 0.78), M.paper); sheet.position.set(0, 1.41, 0.02); sheet.rotation.x = -0.35; g.add(sheet);
  [-0.6, 0.6].forEach((x) => { const r = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.86, 20), M.paper); r.rotation.x = Math.PI / 2; r.position.set(x, 1.45, 0.02); r.rotation.z = 0; g.add(r);
    const cap = mesh(new THREE.SphereGeometry(0.06, 12, 8), M.gold); cap.position.set(x, 1.45, 0.46); g.add(cap); });
  const seal = mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.05, 24), M.wax); seal.position.set(0.2, 1.47, 0.18); seal.rotation.x = -0.35; g.add(seal);
  const ribbon = mesh(new THREE.BoxGeometry(0.06, 0.02, 0.5), M.goldGlow); ribbon.position.set(0.2, 1.42, 0.45); ribbon.rotation.x = -0.9; g.add(ribbon);
  g.add(plinth(M, 0.95, 0.3));
  return { g, glowAt: V(0.2, 1.5, 0.3) };
}
function itemPforR(M, q) { // a verified result: gold medal on a stone stand
  const g = new THREE.Group();
  const stand = mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), M.marble); stand.position.y = 0.55; g.add(stand);
  const medal = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, q.seg * 2), M.gold); medal.rotation.x = Math.PI / 2; medal.position.y = 1.45; g.add(medal);
  const rim = mesh(new THREE.TorusGeometry(0.55, 0.05, 10, q.seg * 2), M.gold); rim.position.y = 1.45; g.add(rim);
  const star = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.16 : 0.36; i ? star.lineTo(Math.cos(a) * r, Math.sin(a) * r) : star.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const st = mesh(new THREE.ExtrudeGeometry(star, { depth: 0.04, bevelEnabled: false }), M.goldGlow); st.position.set(0, 1.45, 0.06); g.add(st);
  [-0.18, 0.18].forEach((x, i) => { const r = mesh(new THREE.BoxGeometry(0.16, 0.6, 0.02), M.wax); r.position.set(x, 0.98, 0.05); r.rotation.z = i ? -0.25 : 0.25; g.add(r); });
  g.add(plinth(M, 0.95, 0.3));
  return { g, glowAt: V(0, 1.45, 0.3) };
}
B.trio = (M, q) => {
  const root = new THREE.Group();
  const items = [itemIPF(M, q), itemDPF(M, q), itemPforR(M, q)].map(({ g, glowAt }) => {
    const wrap = new THREE.Group(); wrap.add(g); g.add(contactShadow(M, 1.0));
    const gl = glow(M, 1.0, glowAt, 0.7); g.add(gl);
    const n = normalize(wrap, 1); root.add(n); n.userData.glow = gl; return n;
  });
  let sel = 0, cur = 0;
  const R = 1.3;
  const place = (k) => items.forEach((it, i) => {
    const d = i - k;
    it.position.set(Math.sign(d) * Math.min(1, Math.abs(d)) * 0.95 + Math.sign(d) * Math.max(0, Math.abs(d) - 1) * 0.62, -0.18 * Math.min(1, Math.abs(d)), -Math.min(2, Math.abs(d)) * 0.9);
    const s = 1 - Math.min(1, Math.abs(d)) * 0.3; it.scale.setScalar(s);
    it.userData.glow.material.opacity = 0.75 * Math.max(0, 1 - Math.abs(i - k));
    it.traverse((o) => { if (o.isMesh && o.material.userData.dimBase === undefined && o.material !== M.goldGlow) { /* shared materials stay shared */ } });
  });
  place(0);
  return { group: root, glows: items.map((i) => i.userData.glow), carousel: true, width: 2.6,
    select(i) { sel = i; },
    update(t, ctx) { cur += (sel - cur) * Math.min(1, ctx.dt * 6); place(cur); items.forEach((it, i) => { it.rotation.y = i === Math.round(cur) ? Math.sin(t * 0.4) * 0.25 : 0; }); return Math.abs(sel - cur) > 0.002; } };
};
B.ring = (M, q) => {
  const g = new THREE.Group();
  const caps = [];
  const R = 1.55;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const ped = new THREE.Group();
    ped.add(lathe([[0, 0], [0.36, 0], [0.36, 0.08], [0.28, 0.14], [0.24, 0.95], [0.32, 1.02], [0.32, 1.1], [0, 1.1]], M.marble, q.seg));
    const capM = new THREE.MeshStandardMaterial({ color: 0xE0B252, emissive: 0xFFAA33, emissiveIntensity: 0, metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
    const cap = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, q.seg), capM); cap.position.y = 1.13; ped.add(cap);
    const orb = mesh(new THREE.SphereGeometry(0.14, 20, 14), capM); orb.position.y = 1.3; ped.add(orb);
    ped.position.set(Math.sin(a) * R, 0.32, Math.cos(a) * R);
    g.add(ped); caps.push(capM);
  }
  const hub = mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.12, q.seg * 2), M.gold); hub.position.y = 0.38; g.add(hub);
  const hubRing = mesh(new THREE.TorusGeometry(R, 0.02, 6, q.seg * 3), M.goldGlow); hubRing.rotation.x = Math.PI / 2; hubRing.position.y = 0.34; g.add(hubRing);
  g.add(plinth(M, 2.1, 0.3)); g.add(contactShadow(M, 2.3));
  const spin = new THREE.Group(); spin.add(g);
  const root = normalize(spin);
  let sel = -1, rot = 0, target = 0;
  const glowSp = glow(M, 0.9, V(0, 0.55, 0.5), 0.0); root.add(glowSp);
  return { group: root, glows: [glowSp], ring: true,
    select(i) { sel = i; target = i >= 0 ? -(i / 6) * Math.PI * 2 : target; },
    update(t, ctx) {
      rot += (target - rot) * Math.min(1, ctx.dt * 4); g.rotation.y = rot;
      caps.forEach((m, i) => { const on = i === sel; m.emissiveIntensity += ((on ? 2.4 : 0) - m.emissiveIntensity) * Math.min(1, ctx.dt * 5); });
      glowSp.material.opacity = sel >= 0 ? 0.6 : 0;
      return Math.abs(target - rot) > 0.001;
    } };
};
B.pylon = (M, q) => {
  const g = new THREE.Group();
  const bar = (a, b, r, m = M.steel) => { const d = b.clone().sub(a); const len = d.length(); const c = mesh(new THREE.CylinderGeometry(r, r, len, 6), m, false); c.position.copy(a).add(b).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); g.add(c); return c; };
  const H = 6, base = 1.0, topW = 0.28;
  const legs = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  const at = (y, sx, sz) => { const w = base + (topW - base) * (y / H); return V(sx * w, y + 0.32, sz * w); };
  legs.forEach(([sx, sz]) => { const foot = mesh(new THREE.BoxGeometry(0.42, 0.5, 0.42), M.marble); foot.position.copy(at(0, sx, sz)); foot.position.y = 0.55; g.add(foot); bar(at(0.3, sx, sz), at(H, sx, sz), 0.035); });
  const levels = 12;
  for (let i = 0; i < levels; i++) {
    const y0 = 0.3 + (i / levels) * (H - 0.3), y1 = 0.3 + ((i + 1) / levels) * (H - 0.3);
    for (let k = 0; k < 4; k++) { const [ax, az] = legs[k], [bx, bz] = legs[(k + 1) % 4];
      bar(at(y0, ax, az), at(y1, bx, bz), 0.012); bar(at(y0, bx, bz), at(y1, ax, az), 0.012); bar(at(y1, ax, az), at(y1, bx, bz), 0.014); }
  }
  const glows = [];
  const insM = M.goldGlow;
  const arms = [[H * 0.62, 2.0], [H * 0.78, 1.7], [H * 0.93, 1.35]];
  arms.forEach(([y, w]) => {
    for (const sz of [-1, 1]) { bar(V(-w, y + 0.32, sz * 0.14), V(w, y + 0.32, sz * 0.14), 0.03); }
    bar(V(-w, y + 0.32, 0), at(y - 0.5, -1, 0), 0.02); bar(V(w, y + 0.32, 0), at(y - 0.5, 1, 0), 0.02);
    for (const sx of [-1, 1]) {
      const x = sx * (w - 0.12);
      for (let k = 0; k < 7; k++) { const d = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.022, 14), insM, false); d.position.set(x, y + 0.26 - k * 0.07, 0); g.add(d); }
      const gl = glow(M, 0.55, V(x, y + 0.05, 0.08), 0.65); g.add(gl); glows.push(gl);
      const curve = new THREE.CatmullRomCurve3([V(x, y - 0.25, -4), V(x, y - 0.55, -2), V(x, y - 0.2, 0), V(x, y - 0.55, 2), V(x, y - 0.25, 4.5)]);
      g.add(mesh(new THREE.TubeGeometry(curve, 40, 0.012, 5), M.steel, false));
    }
  });
  const peak = mesh(new THREE.ConeGeometry(0.12, 0.5, 12), M.gold); peak.position.y = H + 0.6; g.add(peak);
  mergeStatic(g);
  g.add(plinth(M, 1.65, 0.3)); g.add(contactShadow(M, 1.9));
  return { group: normalize(g), glows, update() {} };
};
B.bridge = (M, q) => {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-3, 0); shape.lineTo(-3, 2.1); shape.lineTo(3, 2.1); shape.lineTo(3, 0); shape.lineTo(2.1, 0);
  shape.absarc(0, 0, 2.1, 0, Math.PI, false); shape.lineTo(-3, 0);
  const deck = mesh(new THREE.ExtrudeGeometry(shape, { depth: 1.1, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, curveSegments: q.seg }), M.marble);
  deck.position.set(0, 0.5, -0.55); g.add(deck);
  const archLine = mesh(new THREE.TorusGeometry(2.1, 0.035, 8, q.seg * 2, Math.PI), M.goldGlow); archLine.position.set(0, 0.5, 0.6); g.add(archLine);
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI; const v = mesh(new THREE.BoxGeometry(0.05, 0.32, 0.04), M.marbleDark); v.position.set(Math.cos(a) * 2.27, 0.5 + Math.sin(a) * 2.27, 0.58); v.rotation.z = a - Math.PI / 2; g.add(v); }
  const rail = mesh(new THREE.BoxGeometry(6.1, 0.14, 1.2), M.marbleDark); rail.position.set(0, 2.67, 0); g.add(rail);
  for (let i = 0; i < 13; i++) { const p = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.36, 8), M.marble); p.position.set(-2.9 + i * 0.48, 2.92, 0.5); g.add(p); }
  const rtop = mesh(new THREE.BoxGeometry(6.1, 0.07, 0.12), M.gold); rtop.position.set(0, 3.12, 0.5); g.add(rtop);
  const culvert = mesh(new THREE.TorusGeometry(0.42, 0.1, 10, 32, Math.PI), M.marbleDark); culvert.position.set(0, 0.5, 0.62); g.add(culvert);
  const waves = [];
  for (let r = 0; r < 4; r++) {
    const pts = []; for (let i = 0; i <= 60; i++) { const x = -3.4 + i * (6.8 / 60); pts.push(V(x, 0.48 + Math.sin(x * 2.2 + r) * 0.07, 0.9 - r * 0.45)); }
    const crest = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.018, 5), M.goldGlow, false); g.add(crest); waves.push(crest);
  }
  const water = mesh(new THREE.PlaneGeometry(7, 2.6, 60, 20), M.water, false); water.rotation.x = -Math.PI / 2; water.position.set(0, 0.42, -0.2); g.add(water);
  const wpos = water.geometry.attributes.position; const w0 = wpos.array.slice();
  g.add(plinth(M, 3.3, 0.3)); g.add(contactShadow(M, 3.4));
  const glows = [glow(M, 1.2, V(0, 0.9, 0.7), 0.55)]; glows.forEach((s) => g.add(s));
  return { group: normalize(g), glows, update(t) {
    for (let i = 0; i < wpos.count; i++) wpos.array[i * 3 + 2] = w0[i * 3 + 2] + Math.sin(w0[i * 3] * 2.2 + t * 0.9) * 0.035;
    wpos.needsUpdate = true; waves.forEach((w, i) => { w.position.x = Math.sin(t * 0.5 + i) * 0.06; });
  } };
};
B.compass = (M, q) => {
  const g = new THREE.Group();
  const base = lathe([[0, 0], [1.35, 0], [1.35, 0.22], [1.15, 0.32], [1.05, 0.6], [0, 0.6]], M.marble, q.seg); base.position.y = 0.32; g.add(base);
  const dial = new THREE.Group(); dial.position.y = 1.0; dial.rotation.x = -Math.PI / 2 + 0.55; g.add(dial);
  const bezel = mesh(new THREE.TorusGeometry(1.25, 0.11, 16, q.seg * 2), M.gold); dial.add(bezel);
  const face = mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.08, q.seg * 2), M.marble); face.rotation.x = Math.PI / 2; dial.add(face);
  for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; const t = mesh(new THREE.BoxGeometry(0.012, i % 9 ? 0.06 : 0.14, 0.01), M.gold, false); t.position.set(Math.sin(a) * 1.08, Math.cos(a) * 1.08, 0.05); t.rotation.z = -a; dial.add(t); }
  const rose = new THREE.Group(); dial.add(rose);
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? 0.55 : 0.98; const s = new THREE.Shape(); s.moveTo(0, r); s.lineTo(0.1, 0.12); s.lineTo(0, 0); s.lineTo(-0.1, 0.12); s.closePath();
    const m = mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 1 }), i % 2 ? M.marbleDark : M.gold);
    m.rotation.z = (i / 8) * Math.PI * 2; m.position.z = 0.05; rose.add(m);
  }
  // Vietnam silhouette (Natural Earth, decorative) as a glowing inlay on the face
  const vs = new THREE.Shape(); const k = 0.9 / VN_H;
  VN_POINTS.forEach(([x, y], i) => { const px = (x - VN_W / 2) * k, py = (VN_H / 2 - y) * k; i ? vs.lineTo(px, py) : vs.moveTo(px, py); });
  const vn = mesh(new THREE.ExtrudeGeometry(vs, { depth: 0.035, bevelEnabled: false }), M.goldGlow, false); vn.position.set(0.48, -0.05, 0.06); vn.scale.setScalar(0.62); dial.add(vn);
  mergeStatic(dial);
  const needle = new THREE.Group(); dial.add(needle);
  const nd = new THREE.Shape(); nd.moveTo(0, 0.92); nd.lineTo(0.07, 0); nd.lineTo(0, -0.92); nd.lineTo(-0.07, 0); nd.closePath();
  const ndm = mesh(new THREE.ExtrudeGeometry(nd, { depth: 0.03, bevelEnabled: false }), M.goldGlow); ndm.position.z = 0.12; needle.add(ndm);
  const pin = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16), M.gold); pin.rotation.x = Math.PI / 2; pin.position.z = 0.14; needle.add(pin);
  g.add(plinth(M, 1.5, 0.32)); g.add(contactShadow(M, 1.7));
  const glows = [glow(M, 1.0, V(0, 1.15, 0.3), 0.55)]; glows.forEach((s) => g.add(s));
  return { group: normalize(g), glows, update(t) { needle.rotation.z = Math.sin(t * 0.35) * 0.35 - 0.25; rose.rotation.z = t * 0.04; } };
};
B.coin = (M, q) => {
  const g = new THREE.Group();
  const stand = lathe([[0, 0], [0.75, 0], [0.75, 0.15], [0.3, 0.25], [0.22, 0.6], [0.4, 0.68], [0, 0.7]], M.marble, q.seg); stand.position.y = 0.32; g.add(stand);
  const coin = new THREE.Group(); coin.position.y = 1.85; g.add(coin);
  const body = mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.12, q.seg * 2), M.gold); body.rotation.x = Math.PI / 2; coin.add(body);
  const rim = mesh(new THREE.TorusGeometry(0.85, 0.06, 12, q.seg * 2), M.gold); coin.add(rim);
  const inner = mesh(new THREE.TorusGeometry(0.6, 0.025, 8, q.seg * 2), M.goldGlow); inner.position.z = 0.07; coin.add(inner);
  const inner2 = inner.clone(); inner2.position.z = -0.07; coin.add(inner2);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const r = mesh(new THREE.BoxGeometry(0.02, 0.36, 0.02), M.goldGlow, false); r.position.set(Math.sin(a) * 0.3, Math.cos(a) * 0.3, 0.07); r.rotation.z = -a; coin.add(r); }
  g.add(plinth(M, 0.95, 0.3)); g.add(contactShadow(M, 1.1));
  const glows = [glow(M, 1.6, V(0, 1.85, 0.2), 0.6)]; glows.forEach((s) => g.add(s));
  return { group: normalize(g), glows, update(t) { coin.rotation.y = t * 0.6; } };
};

export function buildObject(kind, M, quality) {
  const q = { seg: quality === 'light' ? 20 : 40 };
  const f = B[kind] || B.globe;
  return f(M, q);
}
export const OBJECT_KINDS = Object.keys(B);
