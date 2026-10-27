# CREDITS.md

## Content
All text, numbers, tables, figure data and citations: Group 6 (Đặng Việt Hoàng, Trần Lan Quyên, Đào Bảo Bình,
Nguyễn Anh Đức, Lê Thị Yến Nhi), *IBRD and its Development Project Financing Activities in Vietnam*, Project
Finance, National Economics University, Hanoi, 2026 (`paper/IBRD - NHÓM 6(1).pdf`).

## Typefaces — SIL Open Font License 1.1 (licence files next to the fonts in `public/assets/fonts/*/OFL.txt`)
| Face | Designer | Package |
|---|---|---|
| Cormorant, Cormorant SC | Christian Thalmann (Catharsis Fonts) | `@fontsource/cormorant`, `@fontsource/cormorant-sc` |
| Be Vietnam Pro | Lâm Bảo, Tony Le, ViệtAnh Nguyễn | `@fontsource/be-vietnam-pro` |
| IBM Plex Mono; IBM Plex Sans (symbol subset "IBRD Sym": ≈ ≥ ≤ ↩ → ← ↑ ↓) | Mike Abbink, Bold Monday / IBM | `@fontsource/ibm-plex-mono`, `@ibm/plex-sans` |
Font-specimen candidates (not used by the deck): Playfair Display, Source Serif 4, Newsreader, IBM Plex Sans, Fraunces (all OFL).

## Map data
Vietnam silhouette (decorative only, simplified, mainland ring, no borders or routes): **Natural Earth** 1:50m
Admin 0 – Countries, **public domain**, via the `world-atlas` npm package (ISC licence) and `topojson-client` (ISC).

## Graphics and 3D
Every engraving, pattern, stamp, seal, chart and 3D object was made for this deck in code (SVG generators in
`src/art/`, procedural Three.js geometry in `src/three/`). Paper, watercolour, marble and grain textures are
generated from procedural noise. Environment lighting: Three.js `RoomEnvironment` (procedural; no HDRI file).
No logo of the World Bank, IBRD or NEU is used; no external image, model or HDRI is used.

## Software
Three.js (MIT), Vite (MIT), js-yaml (MIT), Playwright (Apache-2.0, QA only), fontTools (MIT, QA only), Pillow /
NumPy (texture generation), poppler `pdftotext` (extraction).

## Style references
`paper/Mẫu IBRD final.jpg` (2D) and `paper/Mẫu 3d.jpg` (3D) were supplied by the group and studied for style only;
nothing from them is reproduced.
