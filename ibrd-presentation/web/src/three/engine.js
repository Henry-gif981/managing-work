// One WebGL canvas for the whole deck. Renders on demand: frames run only while something moves
// (enter/exit, parallax easing, idle motion, breathing glow); otherwise the loop sleeps.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMaterials } from './materials.js';
import { buildObject } from './objects.js';
import { SLOTS, slotOf } from '../deck/render.js';

const FOV = 32;
const CAM_Z = 10;
const WORLD_H = 2 * CAM_Z * Math.tan((FOV / 2) * Math.PI / 180);
const K = WORLD_H / 1080; // world units per stage pixel
const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function createEngine(canvas, opts = {}) {
  let preset = opts.preset || 'full';
  const reduced = !!opts.reduced;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.capture });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1920 / 1080, 0.1, 60);
  camera.position.set(0, 0, CAM_Z);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environmentIntensity = 0.7;
  scene.environment = envRT.texture;

  // key (warm, top-left), rim (cold, behind-right), very weak fill
  const key = new THREE.DirectionalLight(0xFFEFD6, 3.6); key.position.set(-6, 7, 4.5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8FB4FF, 2.6); rim.position.set(6, 3, -7); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xB8CCFF, 1.0); rim2.position.set(-6, 1, -5); scene.add(rim2);
  const fill = new THREE.HemisphereLight(0xC9D6EA, 0x0A0F1A, 0.06); scene.add(fill);
  scene.fog = new THREE.FogExp2(0x070D18, 0.035);

  let M = createMaterials(preset);
  const rigs = new Map(); // kind -> rig
  let current = null; // rig on stage
  const leaving = new Set();
  let pointer = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  let t0 = performance.now(), last = t0, running = false, lastInteraction = t0, visible = true;
  const frameTimes = [];
  let downgraded = false;

  // dust: a few slow points in the key light (full preset only)
  const dustGeo = new THREE.BufferGeometry();
  const DUST = 110;
  const dpos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) { dpos[i * 3] = (Math.random() - 0.5) * 9; dpos[i * 3 + 1] = (Math.random() - 0.5) * 5.5; dpos[i * 3 + 2] = Math.random() * 3 - 1; }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ map: M.dustTex, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  scene.add(dust);

  // ------------------------------------------------------------------ rigs (built for current ±1 kinds, disposed otherwise)
  function cloneMaterials(group) {
    const cache = new Map();
    group.traverse((o) => {
      if (!o.material) return;
      if (!cache.has(o.material)) { const m = o.material.clone(); m.userData.baseOpacity = o.material.opacity ?? 1; cache.set(o.material, m); }
      o.material = cache.get(o.material);
    });
    return [...cache.values()];
  }
  function getRig(kind) {
    if (rigs.has(kind)) return rigs.get(kind);
    const obj = buildObject(kind, M, preset);
    const holder = new THREE.Group(); holder.add(obj.group);
    holder.rotation.x = 0.1; // low camera: show the plinth top like the reference
    const mats = cloneMaterials(holder);
    const box = new THREE.Box3().setFromObject(obj.group); const sz = box.getSize(new THREE.Vector3());
    const rig = { kind, obj, holder, mats, width: obj.width || Math.max(sz.x, sz.z * 0.8) / sz.y, op: 0, from: null, to: null, tStart: 0, dur: 1, state: 'idle', phase: Math.random() * 6 };
    obj.glows.forEach((g) => { g.visible = preset === 'full'; });
    rigs.set(kind, rig);
    return rig;
  }
  function disposeRig(rig) {
    scene.remove(rig.holder);
    rig.holder.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    rig.mats.forEach((m) => m.dispose());
    rigs.delete(rig.kind);
  }
  function setOpacity(rig, op) {
    rig.op = op;
    const fading = op < 0.999;
    for (const m of rig.mats) {
      const base = m.userData.baseOpacity ?? 1;
      const wasT = m.transparent;
      m.transparent = fading || m.blending === THREE.AdditiveBlending || base < 1 || !!m.map && m.map === M.shadowTex;
      m.opacity = base * op;
      if (wasT !== m.transparent) m.needsUpdate = true;
    }
    rig.holder.visible = op > 0.002;
  }
  function slotTransform(slot, rig) {
    const S = SLOTS[slot];
    const w = rig.width || 1; // object width when its height is 1
    const s = Math.min(S.h, S.w / w) * K * 0.88; // margin for perspective and tilt
    return { x: (S.cx - 960) * K, y: -(S.cy - 540) * K, s };
  }

  // ------------------------------------------------------------------ public: show a section
  let lastKinds = [];
  function show(slide, st = {}) {
    if (!visible) return;
    const slot = slotOf(slide);
    const kind = slot ? slide.hero3d : null;
    const now = performance.now();
    lastInteraction = now;
    if (current && current.kind !== kind) {
      const r = current; leaving.add(r);
      r.state = 'exit'; r.tStart = now; r.dur = reduced ? 200 : 300;
      r.from = { x: r.holder.position.x, y: r.holder.position.y, s: r.holder.scale.x, op: r.op };
      r.to = { x: r.from.x + (reduced ? 0 : 60 * K), y: r.from.y, s: r.from.s, op: 0 };
      current = null;
    }
    if (kind) {
      const rig = getRig(kind);
      const tr = slotTransform(slot, rig);
      if (!rig.holder.parent) scene.add(rig.holder);
      leaving.delete(rig);
      if (current !== rig) {
        rig.state = 'enter'; rig.tStart = now; rig.dur = reduced ? 200 : 450;
        rig.from = { x: tr.x, y: tr.y - (reduced ? 0 : 40 * K), s: tr.s, op: rig.state === 'exit' ? rig.op : 0 };
        rig.to = { ...tr, op: 1 };
        setOpacity(rig, 0);
        rig.holder.position.set(rig.from.x, rig.from.y, 0); rig.holder.scale.setScalar(tr.s);
        current = rig;
      } else if (Math.abs(rig.holder.position.x - tr.x) > 1e-4 || Math.abs(rig.holder.scale.x - tr.s) > 1e-4) {
        rig.state = 'move'; rig.tStart = now; rig.dur = reduced ? 1 : 450;
        rig.from = { x: rig.holder.position.x, y: rig.holder.position.y, s: rig.holder.scale.x, op: rig.op };
        rig.to = { ...tr, op: 1 };
      }
      if (rig.obj.carousel && rig.obj.select) rig.obj.select(st.carousel || 0);
      if (rig.obj.ring && rig.obj.select) rig.obj.select(st.stepping && st.step > 0 ? st.step - 1 : -1);
    }
    // keep rigs only for the kinds of current ±1 sections (others are disposed)
    const deck = window.__deckData;
    if (deck) {
      const n = slide.n; const want = new Set();
      for (const m of [n - 1, n, n + 1]) { const s = deck.slides[m - 1]; if (s && slotOf(s)) want.add(s.hero3d); }
      lastKinds = [...want];
      for (const [k, r] of rigs) if (!want.has(k) && r !== current && !leaving.has(r)) disposeRig(r);
    }
    kick();
  }
  function hide() {
    if (current) show({ n: 0, tpl: 'none' }, {});
    visible = false;
    renderer.clear();
  }

  // ------------------------------------------------------------------ frame loop (on demand)
  function kick() { visible = true; if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    frameTimes.push(now - last); if (frameTimes.length > 180) frameTimes.shift();
    last = now;
    const t = (now - t0) / 1000;
    let active = false;
    // transitions
    for (const r of [...leaving, current].filter(Boolean)) {
      if (r.state === 'idle') continue;
      const p = ease((now - r.tStart) / r.dur);
      r.holder.position.x = r.from.x + (r.to.x - r.from.x) * p;
      r.holder.position.y = r.from.y + (r.to.y - r.from.y) * p;
      r.holder.scale.setScalar(r.from.s + (r.to.s - r.from.s) * p);
      setOpacity(r, r.from.op + (r.to.op - r.from.op) * p);
      if (p >= 1) { if (r.state === 'exit') { leaving.delete(r); scene.remove(r.holder); if (!lastKinds.includes(r.kind)) disposeRig(r); } r.state = 'idle'; }
      else active = true;
    }
    // parallax (2–4°) and idle motion
    const idleMotion = !reduced;
    const tx = pointer.y * 0.05, ty = pointer.x * 0.07;
    tilt.x += (tx - tilt.x) * 0.06; tilt.y += (ty - tilt.y) * 0.06;
    if (Math.abs(tx - tilt.x) + Math.abs(ty - tilt.y) > 1e-4) active = true;
    if (current) {
      const idle = idleMotion ? Math.sin(t * 0.25 + current.phase) * 0.22 : 0;
      current.holder.rotation.y = idle + tilt.y;
      current.holder.rotation.x = 0.1 + tilt.x;
      const moved = current.obj.update?.(idleMotion ? t : 0, { dt, reduced });
      if (moved) active = true;
      if (preset === 'full' && !reduced) {
        const b = 0.92 + Math.sin(t * (Math.PI * 2 / 6)) * 0.08; // 6 s breathing
        current.obj.glows.forEach((g) => { g.material.opacity = (g.userData.base ?? 0.85) * b * current.op; });
      }
      if (idleMotion) active = true;
    }
    dust.visible = preset === 'full' && !reduced && !!current;
    if (dust.visible) { const a = dustGeo.attributes.position.array; for (let i = 0; i < DUST; i++) { a[i * 3 + 1] += dt * 0.04; if (a[i * 3 + 1] > 2.9) a[i * 3 + 1] = -2.9; a[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.01; } dustGeo.attributes.position.needsUpdate = true; }
    renderer.render(scene, camera);
    // auto-downgrade: frame time > 24 ms for ~3 s
    if (!downgraded && preset === 'full' && frameTimes.length >= 90) {
      const recent = frameTimes.slice(-90); const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
      if (avg > 24) { downgraded = true; opts.onDowngrade?.(); }
    }
    const anyVisible = !!current || leaving.size > 0;
    if ((active || leaving.size) && anyVisible) requestAnimationFrame(frame);
    else { running = false; if (!anyVisible) renderer.clear(); }
  }

  // ------------------------------------------------------------------ settings
  let scale = 1;
  function resize(s) {
    scale = s || scale;
    const cap = preset === 'light' ? 1.0 : 1.5;
    const pr = Math.min(scale * (window.devicePixelRatio || 1), cap);
    renderer.setPixelRatio(1);
    renderer.setSize(Math.round(1920 * pr), Math.round(1080 * pr), false);
    kick();
  }
  function setPreset(p) {
    if (p === preset) { kick(); return; }
    preset = p;
    for (const r of [...rigs.values()]) disposeRig(r);
    current = null; leaving.clear();
    M.textures.forEach((t) => t.dispose());
    M = createMaterials(preset);
    dust.material.map = M.dustTex;
    resize();
    const s = window.__deck ? window.__deckData.slides[window.__deck.state.n - 1] : null;
    if (s) show(s, { step: window.__deck.state.step, carousel: 0, stepping: window.__deck.state.stepMode !== 'all' });
  }
  return {
    show, hide, resize, setPreset,
    pointer(x, y) { pointer = { x, y }; if (current) kick(); },
    stats() {
      let geos = 0, tris = 0;
      scene.traverse((o) => { if (o.geometry) { geos++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } });
      const ft = frameTimes.slice(-60); const avg = ft.length ? ft.reduce((a, b) => a + b, 0) / ft.length : 0;
      return { rigs: [...rigs.keys()], current: current?.kind || null, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, sceneGeometries: geos, triangles: Math.round(tris), drawCalls: renderer.info.render.calls, avgFrameMs: +avg.toFixed(2), running, preset };
    },
    renderer, scene, camera,
  };
}
