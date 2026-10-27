# IBRD in Vietnam — web presentation (Group 6, Project Finance, NEU)

A big-screen presentation website for the report **"IBRD and its Development Project Financing Activities in
Vietnam"**. 119 sections on a fixed 1920×1080 stage, every number and citation taken from the paper, every `[n]`
clickable, a "certificate and ledger" 2D world (engravings, guilloche, stamps, seals) and procedural stone-and-gold
3D objects rendered on one lazily loaded WebGL canvas.

## Run it (one command)

```bash
npm install          # once
npm start            # builds the content + site, serves dist/ and opens http://127.0.0.1:4179
```

Development with live reload: `npm run dev` (http://127.0.0.1:5179). The QA scripts below expect the dev server.

## Presenting

| Key | Action |
|---|---|
| → · Space · PageDown | next bullet, then next section |
| ← · PageUp | back |
| Home / End | first / last section |
| 1 – 9 | jump: Intro · Ch 1 · Ch 2 · Ch 3 · TEP · CCSEP · 3.4 · Conclusion · References |
| G | overview grid (click any section) |
| N | speaker notes: the verbatim paper text for the section |
| T | 3D on / off |
| S | step-by-step / show everything |
| F | fullscreen |
| R | reading mode (continuous scroll, full text) |
| Esc | close the notes / overview / source card |
| ? | key help |

The toolbar appears when the mouse moves (it and the cursor hide after 3 s): **Từng bước | Hiện hết** (bullet
reveal), **3D đầy đủ | 3D nhẹ | Ảnh tĩnh** (3D preset), Notes, Overview, Read, Fullscreen. On phones and tablets,
swipe left/right. The address bar follows the section (`#/57`), so a link opens on that section.

**Citations.** Every red number is its own link. Clicking opens the source card on the right without leaving the
section or losing the bullet step; Esc, "↩ Back" or the browser Back button close it (`#src-33` while open). Cards
give the reference exactly as in the paper, the sentences that cite it (each links to its section), the locator
printed in the paper, and the paper section. Dashed underline = author–year citation whose mapping is inferred.

**3D.** "3D đầy đủ" (dust, glow sprites, DPR ≤ 1.5), "3D nhẹ" (no dust/glow, DPR 1, fewer segments), "Ảnh tĩnh"
(pre-rendered stills, no WebGL). If frames are slower than 24 ms for ~3 s the deck switches to Light by itself and
shows the "Chế độ nhẹ" chip (click it to go back to Full). Without WebGL, with `prefers-reduced-motion`, or in
print, the stills in `public/fallbacks/` are used.

## Modes

- **Reading mode** — `#read` (or the Read button): every section as a responsive document with all bullets, tables,
  charts and the full verbatim text. No WebGL is loaded.
- **Print / PDF** — `?print=1` renders every section on its own 1920×1080 page with all bullets and the 3D stills.
  `npm run pdf` writes `IBRD-Presentation-web.pdf`.

## Content pipeline (single source)

```
paper/IBRD - NHÓM 6(1).pdf ──pdftotext -layout──▶ content/raw.txt ──scripts/extract_content.py──▶ content/content-ibrd.md
content/deck.yaml (sections, bullets) + content/tables.yaml (verbatim tables) + content/charts.yaml (figure data)
        └──scripts/build-content.mjs──▶ src/data/deck.json  ◀── stage, notes, reading mode and print all read this
```

`npm run content` re-extracts from the PDF and regenerates `SLIDES.md` and `CITATIONS.md`. To change the lecturer
line, edit `meta.lecturer` in `content/deck.yaml`.

## Checks

| Command | What it proves | Report |
|---|---|---|
| `node scripts/verify-content.mjs` | every number, year, code, decree and capitalised name on stage exists in the paper; all 199 paragraphs, 21 tables, 8 figures covered; bullet rules; drafting notes hidden; template rhythm | `qa/verify-content.md` |
| `node scripts/check-links.mjs` | 310 citation links → valid cards; 1–58 match the paper; drawer opens/closes via Esc, Back button and browser Back without moving | `qa/check-links.md` |
| `node scripts/audit-fonts.mjs` | computed faces and sizes on all sections, sizes ≥ minimums, no missing glyphs (fontTools cmaps), no fallback faces, CLS 0 | `qa/audit-fonts.md` |
| `node scripts/qa.mjs` | all sections at 1920×1080, samples at 1440×900 and 390×844: no console errors, nothing leaves the stage or is clipped, no text over engravings or the 3D slot; screenshots | `qa/qa-layout.md`, `qa/1920/`, `qa/1440/`, `qa/390/` |
| `npm run perf` (on `npm run build && npx vite preview`) | bundle sizes, first load, frame times, CPU-throttled run, memory over 3 passes, reduced motion, no-WebGL | `PERF.md` |
| `npm run fallbacks` | re-renders the 3D stills with the live scene | `public/fallbacks/*.webp` |

## Files

`DESIGN.md` (2D tokens, fonts, motifs, templates) · `DESIGN-3D.md` (what the 3D reference teaches) · `SLIDES.md`
(section plan) · `CITATIONS.md` (citation map) · `ISSUES.md` (points for the group) · `PERF.md` · `CREDITS.md`.
Code: `src/deck/` (engine, templates, drawer, reading, print), `src/art/` (engravings, charts, map silhouette),
`src/three/` (renderer, materials, procedural objects), `scripts/` (pipeline and checks).
