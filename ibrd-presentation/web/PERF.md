# PERF.md — measured performance

Measured 2026-10-27 08:30 UTC by `npm run perf` (Playwright + CDP, production build served by `vite preview`).

> **Environment caveat.** This cloud container has no GPU. Chromium renders WebGL with **SwiftShader on the CPU**, so the
> frame times below are a pessimistic floor; a consumer GPU is typically one to two orders of magnitude faster for this
> scene size. The budgets (bytes, triangles, draw calls, textures, memory) do not depend on the GPU and are exact.

## Bundle (gzip -9)

| File | Raw KB | Gzip KB |
|---|---|---|
| three-C1E6klC1.js | 507.8 | 128.7 |
| main-DV9NSOop.js | 288.6 | 75.5 |
| charts-swcyP9uv.js | 36.6 | 11.7 |
| engine-aKaVeqau.js | 23.4 | 9.1 |
| main-BSNGsod0.css | 43.7 | 7.8 |
| app-WrBhBMSq.js | 12.6 | 5.1 |
| render-CcA5kovH.js | 12.1 | 4.6 |
| read-D1DyXi7G.js | 4.8 | 2.1 |
| drawer-isTqS_8t.js | 2.9 | 1.4 |
| read-CynCpd4E.css | 4.3 | 1.3 |
| specimen-4DdV4hBE.css | 39.3 | 1.3 |
| print-DJrqWZxq.js | 2.4 | 1.2 |
| specimen-C3U_TD9Q.js | 2.5 | 1.2 |
| modulepreload-polyfill-B5Qt9EMX.js | 0.7 | 0.4 |

3D code (Three.js + engine, loaded lazily with `import()`): **137.8 KB gzip** (budget ≤ 600 KB).

## First load

| View | Transferred | By type (KB) | DOMContentLoaded | First contentful paint | Ready (fonts loaded, shown) |
|---|---|---|---|---|---|
| stage | 1198 KB | html 2, woff2 173, css 44, js 885, png 61, webp 35 | 50 ms | 3944 ms | 7413 ms |
| reading mode | 561 KB | html 2, woff2 173, css 48, js 334, webp 5 | 54 ms | 172 ms | 703 ms |

## Frame times on 3D sections (preset Full, 1920×1080, SwiftShader)

| Section | Object | Triangles | Draw calls | Avg frame | p95 | FPS |
|---|---|---|---|---|---|---|
| 1 | globe | 16793 | 17 | 375.8 ms | 783.4 ms | 2.7 |
| 16 | tiers | 14057 | 22 | 358.9 ms | 1216.6 ms | 2.8 |
| 19 | trio | 5769 | 33 | 313.6 ms | 666.6 ms | 3.2 |
| 28 | ring | 10201 | 25 | 346.8 ms | 633.3 ms | 2.9 |
| 53 | pylon | 9675 | 14 | 329.1 ms | 783.3 ms | 3 |
| 70 | pylon | 9675 | 7 | 1171.4 ms | 2666.5 ms | 0.9 |
| 80 | bridge | 10791 | 39 | 235.1 ms | 416.7 ms | 4.3 |
| 103 | compass | 4653 | 17 | 266.9 ms | 433.4 ms | 3.7 |
| 119 | coin | 3785 | 20 | 309.8 ms | 1000 ms | 3.2 |

Baseline with 3D switched off (section 70, same page, nothing animating in WebGL): avg 384.1 ms, 2.6 FPS — this is the cost of software compositing in this container, not of the 3D scene.

CPU throttled 4× (section 53, pylon): avg 243.7 ms, p95 600 ms, 4.1 FPS. Preset after the run: **light** (auto-downgrade fired: frame time > 24 ms for ~3 s; the "Chế độ nhẹ" chip appeared).

## Memory across 3 full passes (preset Light, every section visited)

| Pass | JS heap | DOM nodes | GL geometries | GL textures | Live rigs |
|---|---|---|---|---|---|
| 1 | 6.1 MB | 495 | 28 | 7 | 1 |
| 2 | 6.3 MB | 495 | 28 | 7 | 1 |
| 3 | 6.4 MB | 495 | 28 | 7 | 1 |

## Behaviour checks

- Render loop sleeps on a 2D section: **yes**
- prefers-reduced-motion: loop stops after the entrance (no idle rotation, dust, breathing): **yes**
- No WebGL (`--disable-webgl`): Three.js loaded: no; static still shown: **yes** (qa/no-webgl-s16.jpg)
- Page errors during the run: none


## Lighthouse — reading mode (production build, mobile preset, simulated throttling)

| Category | Score |
|---|---|
| performance | **92–96** (two runs) |
| accessibility | **100** |
| best-practices | **100** |

| Metric | Value |
|---|---|
| First Contentful Paint | 1.9 s |
| Largest Contentful Paint | 2.6 s |
| Total Blocking Time | 40 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 1.9 s |

First run was Performance 77 (TBT 840 ms); reading mode now builds the first 12 sections at once and appends the rest in idle chunks, draws engravings only when they scroll into view, and uses content-visibility. Report: qa/lighthouse-read.json.
