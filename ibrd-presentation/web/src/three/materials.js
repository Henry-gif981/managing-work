// "Stone + gold" material system (DESIGN-3D.md §2). All textures are procedural (canvas noise), no image files.
import * as THREE from 'three';

// ---------------------------------------------------------------- value noise / FBM
function makeNoise(seed = 1944) {
  const p = new Uint8Array(512);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const perm = Array.from({ length: 256 }, (_, i) => i).sort(() => rnd() - 0.5);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const val = new Float32Array(256).map(() => rnd());
  const fade = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const a = val[p[(p[xi & 255] + yi) & 255]], b = val[p[(p[(xi + 1) & 255] + yi) & 255]];
    const c = val[p[(p[xi & 255] + yi + 1) & 255]], d = val[p[(p[(xi + 1) & 255] + yi + 1) & 255]];
    const u = fade(xf), v = fade(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}
const noise = makeNoise();
const fbm = (x, y, o = 5) => { let a = 0.5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * noise(x * f, y * f); f *= 2.03; a *= 0.5; } return s; };

// Marble: colour (veins + grain), roughness (veins rougher), bump (veins recessed)
export function marbleTextures(size = 512, tint = [206, 202, 194], vein = [92, 88, 84]) {
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = size; return c; };
  const col = mk(), rough = mk();
  const cc = col.getContext('2d'), rc = rough.getContext('2d');
  const ci = cc.createImageData(size, size), ri = rc.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const w = fbm(u * 4, v * 4, 5);
    const veinA = Math.pow(Math.abs(Math.sin((u * 3 + v * 7 + w * 6.5) * Math.PI)), 0.22);
    const veinB = Math.pow(Math.abs(Math.sin((u * 9 - v * 2 + fbm(u * 8 + 3, v * 8, 4) * 5) * Math.PI)), 0.5);
    const vv = Math.min(veinA, 0.55 + 0.45 * veinB);
    const grain = (noise(x * 0.9, y * 0.9) - 0.5) * 16;
    const cloud = (fbm(u * 2 + 9, v * 2, 4) - 0.5) * 22;
    const i = (y * size + x) * 4;
    for (let k = 0; k < 3; k++) ci.data[i + k] = Math.max(0, Math.min(255, vein[k] + (tint[k] - vein[k]) * vv + grain + cloud));
    ci.data[i + 3] = 255;
    const r = 120 + (1 - vv) * 90 + grain * 2;
    ri.data[i] = ri.data[i + 1] = ri.data[i + 2] = Math.max(0, Math.min(255, r)); ri.data[i + 3] = 255;
  }
  cc.putImageData(ci, 0, 0); rc.putImageData(ri, 0, 0);
  const map = new THREE.CanvasTexture(col); map.colorSpace = THREE.SRGBColorSpace;
  const rmap = new THREE.CanvasTexture(rough);
  for (const t of [map, rmap]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; }
  return { map, rmap };
}

export function radialTexture(stops, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createMaterials(quality) {
  const size = quality === 'light' ? 256 : 512;
  const light = marbleTextures(size);
  const dark = marbleTextures(size, [150, 147, 142], [70, 67, 64]);
  const marble = new THREE.MeshPhysicalMaterial({ map: light.map, roughnessMap: light.rmap, roughness: 0.55, bumpMap: light.rmap, bumpScale: 0.6,
    clearcoat: 0.25, clearcoatRoughness: 0.4, color: 0xffffff, envMapIntensity: 0.28 });
  const marbleDark = new THREE.MeshPhysicalMaterial({ map: dark.map, roughnessMap: dark.rmap, roughness: 0.62, bumpMap: dark.rmap, bumpScale: 0.6,
    clearcoat: 0.18, clearcoatRoughness: 0.5, envMapIntensity: 0.22 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xE0B252, metalness: 1, roughness: 0.28, envMapIntensity: 1.25 });
  const goldGlow = new THREE.MeshStandardMaterial({ color: 0xFFC86B, emissive: 0xFFA22E, emissiveIntensity: 3.2, metalness: 0.4, roughness: 0.35 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9AA3AD, metalness: 0.85, roughness: 0.38, envMapIntensity: 0.9 });
  const wax = new THREE.MeshPhysicalMaterial({ color: 0x8E2A22, roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xEDE3C8, roughness: 0.85, metalness: 0 });
  const water = new THREE.MeshStandardMaterial({ color: 0x2F4C66, metalness: 0.3, roughness: 0.22, envMapIntensity: 0.9 });
  const glowTex = radialTexture([[0, 'rgba(255,214,140,1)'], [0.25, 'rgba(255,170,70,.55)'], [0.6, 'rgba(255,140,40,.12)'], [1, 'rgba(255,120,30,0)']]);
  const shadowTex = radialTexture([[0, 'rgba(0,0,0,.72)'], [0.45, 'rgba(0,0,0,.42)'], [1, 'rgba(0,0,0,0)']]);
  const dustTex = radialTexture([[0, 'rgba(255,240,210,1)'], [0.4, 'rgba(255,230,190,.35)'], [1, 'rgba(255,230,190,0)']], 64);
  return { marble, marbleDark, gold, goldGlow, steel, wax, paper, water, glowTex, shadowTex, dustTex,
    textures: [light.map, light.rmap, dark.map, dark.rmap, glowTex, shadowTex, dustTex] };
}
