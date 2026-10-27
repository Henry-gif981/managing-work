# PERF.md — measured performance

Measured 2026-10-27 08:25 UTC by `npm run perf` (Playwright + CDP, production build served by `vite preview`).

> **Environment caveat.** This cloud container has no GPU. Chromium renders WebGL with **SwiftShader on the CPU**, so the
> frame times below are a pessimistic floor; a consumer GPU is typically one to two orders of magnitude faster for this
> scene size. The budgets (bytes, triangles, draw calls, textures, memory) do not depend on the GPU and are exact.

## Bundle (gzip -9)

| File | Raw KB | Gzip KB |
|---|---|---|
| three-C1E6klC1.js | 507.8 | 128.7 |
| main-DcTKPnON.js | 288.6 | 75.5 |
| charts-swcyP9uv.js | 36.6 | 11.7 |
| engine-aKaVeqau.js | 23.4 | 9.1 |
| main-BSNGsod0.css | 43.7 | 7.8 |
| app-BaU8lU8F.js | 12.6 | 5.1 |
| render-CcA5kovH.js | 12.1 | 4.6 |
| read-ARzJ1Eq1.js | 4.3 | 1.8 |
| drawer-isTqS_8t.js | 2.9 | 1.4 |
| read-DgDlzPNw.css | 4.3 | 1.3 |
| specimen-4DdV4hBE.css | 39.3 | 1.3 |
| specimen-C3U_TD9Q.js | 2.5 | 1.2 |
| print-BXBYrt-w.js | 2.1 | 1.1 |
| modulepreload-polyfill-B5Qt9EMX.js | 0.7 | 0.4 |

3D code (Three.js + engine, loaded lazily with `import()`): **137.8 KB gzip** (budget ≤ 600 KB).

## First load

| View | Transferred | By type (KB) | DOMContentLoaded | First contentful paint | Ready (fonts loaded, shown) |
|---|---|---|---|---|---|
| stage | 1198 KB | 1:417 2, woff2 173, js 885, css 44, png 61, webp 35 | 65 ms | 3952 ms | 7091 ms |
| reading mode | 666 KB | 1:417 2, woff2 279, js 333, css 48, webp 5 | 75 ms | 520 ms | 2159 ms |

## Frame times on 3D sections (preset Full, 1920×1080, SwiftShader)

| Section | Object | Triangles | Draw calls | Avg frame | p95 | FPS |
|---|---|---|---|---|---|---|
| 1 | globe | 16793 | 17 | 498.7 ms | 616.6 ms | 2 |
| 16 | tiers | 14057 | 22 | 401.5 ms | 1550 ms | 2.5 |
| 19 | trio | 5769 | 33 | 294.6 ms | 716.7 ms | 3.4 |
| 28 | ring | 10201 | 25 | 308.8 ms | 683.2 ms | 3.2 |
| 53 | pylon | 9675 | 14 | 445.7 ms | 1333.3 ms | 2.2 |
| 71 | null | 37 | 0 | 637 ms | 1266.6 ms | 1.6 |
| 79 | null | 37 | 0 | 368.9 ms | 616.6 ms | 2.7 |
| 103 | compass | 4653 | 17 | 215.6 ms | 783.3 ms | 4.6 |
| 119 | coin | 3785 | 20 | 236.9 ms | 633.3 ms | 4.2 |

CPU throttled 4× (section 53, pylon): avg 316.4 ms, p95 999.9 ms, 3.2 FPS. Preset after the run: **light** (auto-downgrade fired: frame time > 24 ms for ~3 s; the "Chế độ nhẹ" chip appeared).

## Memory across 3 full passes (preset Light, every section visited)

| Pass | JS heap | DOM nodes | GL geometries | GL textures | Live rigs |
|---|---|---|---|---|---|
| 1 | 6 MB | 495 | 28 | 7 | 1 |
| 2 | 6.2 MB | 495 | 28 | 7 | 1 |
| 3 | 6.3 MB | 495 | 28 | 7 | 1 |

## Behaviour checks

- Render loop sleeps on a 2D section: **yes**
- prefers-reduced-motion: loop stops after the entrance (no idle rotation, dust, breathing): **yes**
- No WebGL (`--disable-webgl`): Three.js loaded: no; static still shown: **yes** (qa/no-webgl-s16.jpg)
- Page errors during the run: none

