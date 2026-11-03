import * as THREE from 'three';

/** Read a CSS custom property from :root (tokens.css). */
export function cssVar(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const cache = new Map<string, THREE.Color>();
/** THREE.Color from a token name such as '--wb-navy'. Falls back to magenta so a typo is obvious. */
export function tokenColor(name: string): THREE.Color {
  const hit = cache.get(name);
  if (hit) return hit.clone();
  const v = cssVar(name) || '#ff00ff';
  const c = new THREE.Color(v);
  cache.set(name, c);
  return c.clone();
}

export function tokenHex(name: string): string {
  return '#' + tokenColor(name).getHexString();
}

export function clearTokenCache() {
  cache.clear();
}
