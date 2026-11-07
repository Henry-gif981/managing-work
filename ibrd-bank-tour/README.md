# IBRD Bank Tour

An interactive 3D "bank tour" for **Group 6 (NEU)**, built around the paper *The IBRD and its development project financing activities in Vietnam*.
You walk in through the front door. Floor 1 holds the Introduction and Chapter 1, Floor 2 holds Chapter 2, and Floor 3 holds Chapter 3, with TEP on the left, CCSEP on the right and the executive office at the far end. The Conclusion plays as the lift rides down, and the Thank-You is at the exit door.

**Status (paper _10):** 59 scenes (`f1-wbg` has 2 beats: the intro and the whole table with one summary card; `f1-terms` has 1 beat with the whole table). Floors 1-2 show the **key ideas** of the paper (one idea per beat, about 25-50 words; see *Floors 1-2 content policy* below), and Floor 3 shows the full content: Introduction and Chapter 1 (Floor 1), Chapter 2 (Floor 2), Chapter 3 (Floor 3: context at the entrance, TEP on the left half, CCSEP on the right half, evaluation in the executive office), the Conclusion on the lift ride down, and the exit (reference wall and thank-you). What changed in the _10 update: `docs/update-log.md`, `docs/paper-diff-ch1-ch2.md`, `docs/paper-diff-ch3.md`. Coverage audits: `docs/coverage-ch1-ch2.md` (key-idea coverage) and `docs/coverage-ch3-conclusion.md`. Inconsistencies: `docs/paper-inconsistencies.md`.

## Run

```bash
npm install
npm run dev            # http://localhost:5173 (dev overlay on by default in dev)
npm run build          # dist/ (normal multi-file build)
npm run build:single   # dist-single/index.html — ONE file, opens from file:// offline
npm run capture-bg     # src/assets/print-bg/<scene>.jpg — 3D end-pose background per scene (for print)
npm run export-pdf     # dist/ibrd-bank-tour.pdf — one page per scene (runs capture-bg first if images are missing)
npm run check-lines    # leader lines vs text, every beat at 1920x1080 and 1366x768 → docs/line-overlaps.md
npm run check-print    # print pages: contrast, footer zone, clipping, backgrounds, references, font sizes → docs/print-check.md
npm run test:shots     # docs/screens/NN-<scene>[-bN].png — first and last beat of every scene
                       #   options: --only=id,id  --segments=intro,ch1  --all-beats
                       #   also reports content that is clipped or reaches into the HUD margins
npm run test:smoke     # opens the single file from file://, walks with keys, fails on console errors
npm run check-facts    # validates src/data/facts.ts and runs src/data/checks.ts (arithmetic + table row counts)
npm run audit-content  # unknown fact ids, citations not in the reference list, beats over ~90 words
npm run docs:scenes    # regenerates docs/scene-list.md
```

**For the presentation**, copy `dist-single/index.html` to the laptop and double-click it in Chrome. It needs no server and no network. Fonts, code and styles are all inlined.

`test:shots`, `test:smoke` and `export-pdf` use Playwright. They use the project's copy if there is one, otherwise the global install (`NODE_PATH`). They never run `playwright install`.

## How to present

| Key | Action |
| --- | --- |
| → · Space · PageDown | next beat, or the next scene when the beats are used up |
| ← · PageUp | previous beat or scene (going back skips transit scenes: door, lift-up) |
| Home · End | first / last |
| F | fullscreen |
| R | references panel (searchable; `<Cite n>` opens it at that entry) |
| N | presenter notes (EN talk track + VI cue, from `src/data/notes.ts`) |
| G | scene grid: jump to any scene |
| C | **Core path** on/off: optional scenes are skipped and dimmed on the tracker (nothing is removed) |
| L | Lite mode on/off (static illustrated backgrounds, same content and keys) |
| P | print preview (`?print=1`), P or Esc to come back |
| D | dev mode (free-fly camera, perf counters, anchor dots) |
| Esc | close panels |

You can also use the on-screen ‹ › arrows at the bottom right, or swipe on a touch screen. The mouse wheel does not navigate.

- **Position in the URL:** `#scene-id/beat`, with beat 1-based. A refresh comes back to the same place, and you can bookmark any beat, e.g. `index.html#f3-tep-outputs/2`.
- **Timer:** shown at the bottom right. Click it to reset (do this when the talk starts).
- **Plan:** add `?plan=<minutes>` (e.g. `index.html?plan=45`) and the HUD shows `+1:20 behind` or `-0:40 ahead` against a schedule spread over the scenes' `targetSeconds`. There is no default plan.
- **Tour length:** "full tour ≈ X min" is the sum of `targetSeconds`. With Core path on it shows the core-path length.

Other URL flags: `?tags=1` shows the small grey source tags ("Source · Section x · p. n"), which are hidden by default (`SHOW_SOURCE_TAGS` in `src/config.ts`). `?lite=1` starts in Lite mode. `?shot=1` is for screenshots (instant tweens, no auto-advance, no fps watchdog). `?noauto=1` stops the door and lift-up scenes from auto-advancing. `?dev=0` turns the dev overlay off in `npm run dev`.

## Tuning cameras (dev mode)

1. Go to the scene and press **D**.
2. Fly the camera: drag to look, shift-drag (or right-drag) to pan, wheel or W / S to move forward and back, Q / E to go down and up, `[` `]` to change the fov.
3. Press **K**. The pose is copied to the clipboard (and logged to the console) as a literal, e.g. `'f1-what': { pos: [-1, 2.5, -42.5], target: [-6.5, 1.8, -52.5], fov: 50 },`.
4. Paste it into `src/camera/waypoints.ts`. Waypoints can also set `ease` and `duration`.
5. Press **D** again and the camera glides back to the scene pose.

While dev mode is on, the anchors of the current scene show as orange dots with their names, and the top right shows draw calls, triangles and fps. The box turns red over budget (150 calls / 300k triangles).

A beat can use its own camera: `{ camera: 'some-waypoint-id' }` in its beat entry.

## Editing content later

- **Scene list:** `src/scenes.ts` holds the ordered list, ids, kind, floor, segment, title, sectionRef, objective, targetSeconds and optional. It never stores beat counts.
- **Scene content:** `src/content/<scene-id>.tsx` exports `beats: Beat[]` and a default `View({ beat })`. **The beat count is `beats.length`.** Placeholders call `makePlaceholder(id, 3)`; replace the whole file when real content arrives. `src/content/f3-tep-outputs.tsx` is the worked example (table, focus, callout).
- **Beat fields:** `label`, `focus: [ids]` (focused elements glow and everything else dims to 35%), `callouts: [{ from: '#dom-id', to: 'anchor:scene:name', label }]`, `camera`.
- **Primitives** (`src/primitives/`):
  - `ScenePanel` with `left`, `centre`, `right` and `bottom` zones, plus `Card`, `Title` and `Caption`
  - `DataTable`, with ids `table-row`, `table-row-col` and `table-col-<key>`
  - `Chart`, with kinds `bar`, `grouped`, `stacked`, `hbar-target` and `line`, and ids `chart-series-cat`, `chart-s<k>` and `chart-c<j>`
  - `Stat`, `Chip`, `Timeline`, `Note`, `Cite` and `Callout`
- **Numbers:** `src/data/facts.ts` holds `{ id, value, unit, source }`. Render one with `<F id="…" />`. Add arithmetic assertions to `src/data/checks.ts`, then run `npm run check-facts`.
- **References:** `src/data/references.ts`, numbered as in the paper.
- **Presenter notes:** `src/data/notes.ts`, per scene `{ presenter, en, vi, beats: [{ en, vi }] }`.
- **Anchors:** every scene has `anchor:<id>:centre`, `:left` and `:right`, made automatically from its waypoint, plus named prop anchors declared in the room files with `<SceneAnchors scene="…" at={{ name: [x, y, z] }} />`. Look one up with `getAnchor(name)`.
- **Palette:** everything is in `src/tokens.css`. The 3D code reads the same CSS variables through `src/theme.ts`.

## Content conventions (Floors 1-2)

- **Scene modules** use the kit in `src/content/kit.tsx`: `scene(id, slides)` returns `{ beats, View }`. A slide has:
  - `source` (shown on every beat as "Source · Section 1.3.2 · p. 14", and in the print header)
  - `layout`: `left` / `right` text card, `centre` for a table, chart or diagram, or `title`
  - `body`, a rich-text template of at most ~90 words
  - optional `aside`, `side` (the opposite zone) and `centre` nodes
  - `focus` and `callouts`
- **Rich text template** (`R`):
  - `{fact-id}` renders a fact with its unit, `{fact-id|n}` the value only
  - `[3]`, `[1; 2]` and `[63, p. iii; 64, p. 18]` render as clickable citations
  - `**bold**`, blank lines between paragraphs, `- ` bullets and `1. ` numbered lists
- **Numbers:** every number is a fact in `src/data/facts.ts` (`id`, `value`, `unit`, `source`, optional `digits`). Display rules are in `src/primitives/Fact.tsx`. Identifiers that are not quantities stay as text: student IDs (`src/data/cover.ts`), report numbers, "OP 4.12".
- **Tables and lists** (Tables 1-7, the ten ESSs) are plain data in `src/data/tables.ts`. `check-facts` counts their rows.
- **Table beats:**
  - The table sits in the centre zone (x 400-1848). The 400 px band on the left stays free for the 3D prop that the beat's callout points to.
  - Each table beat focuses one row and draws a callout to a prop.
  - Table beats automatically use the waypoint `<scene>-table` (or a per-row waypoint set in the slide's `camera`).
  - `node scripts/frame-props.mjs '{...}'` searches for a camera pose that puts given anchors inside a screen band. That is how the `*-table` waypoints were found.
- **Objectives** come from `src/data/objectives.ts`. **Presenter notes and per-scene `targetSeconds`** come from `src/data/notes.ts`, and `scenes.ts` reads both.

## Architecture

```
src/scenes.ts            scene list (59)            src/content/*.tsx   beats + View per scene
src/state/store.ts       zustand: position, modes   src/state/keys.ts   keyboard + swipe
src/state/hash.ts        #scene/beat sync           src/director.ts     navigation -> gsap timelines
src/camera/waypoints.ts  camera poses               src/camera/rig.ts   camera state (pos + quaternion slerp)
src/three/Stage.tsx      Canvas, zones, lights, perf, lite watchdog
src/three/rooms/*        Exterior, Floor1, Floor2, Floor3, ExitHall, Lift (procedural)
src/three/builder.ts     merges primitives per material + one ink LineSegments per room
src/hud/*                tracker, floor indicator, scene info, counter, panels
src/primitives/*         content building blocks, focus, callouts
src/lite/LiteBackdrop    static SVG per area (Lite + Print)     src/print/PrintView   ?print=1
```

## Decisions (made without asking)

- **Repository layout:** the project sits in `./ibrd-bank-tour` inside the existing git repository and is committed on that repository's working branch. A nested `git init` would not be pushable, so there isn't one. There is one commit per phase.
- **Palette over the older wording.** Where the brief mentioned brass, gold, cream paper or "warm" light (lift cabin, HUD frame, door spill, daylight), I followed the later *Visual style* section instead: brushed steel (#A9B8C6) with navy/cyan accents, a navy and white HUD, and white-cyan spill and daylight. The finance-desk and executive scales are steel too.
- **Ground floor:** the lift display shows G, 1, 2, 3. The entrance and lobby are "Floor 1" (as the brief says) and **G is the exit hall**, a separate level below (y = -10) reached only by the ride down. The exit door opens to daylight there.
- **Building layout:** the lift is at the back of every floor, so Floor 3's context area is by the lift (its entrance) and the executive office is at the front of the building, above the portico.
- **Transit scenes:** `ext-door`, `lift-1-2` and `lift-2-3` have 0 beats. Arriving forwards plays the animation and then auto-advances to the next scene. Pressing → during it skips ahead. Going backwards skips over them. Jumping to one replays it from the previous scene's state.
- **Lift-down:** 5 beats. The display reads 3 → 2 → 1 → G, one floor per beat, and beat 5 opens the doors on the exit hall. Its content uses the frosted-glass card style on the right, standing in for the cabin's glass panel.
- **Camera:** tweens slerp orientation (quaternions) instead of interpolating look-at targets, so wide turns never flip. Moving between levels without the lift (backwards, or jumps from the grid, tracker or hash) uses a short white fade cut instead of flying through floor slabs.
- **Performance:** each room is merged into roughly one mesh per material plus one `LineSegments` for all ink outlines (`EdgesGeometry`). Floors outside the current zone are hidden. Measured in `test:shots`: at most 68 draw calls and about 21k triangles in any pose, against a budget of 150 / 300k. DPR is capped at 1.5, there is no post-processing, and tone mapping is off so the palette renders as specified.
- **Labels in 3D:** canvas textures, redrawn once the fonts have loaded.
- **Callouts:** drawn below the content cards, starting at the card edge nearest the prop and routed around every line of text (straight, elbow or gutter detour), with a white halo and a pin at the prop. When no route is free, the callout becomes a numbered pin on the card and on the prop. `npm run check-lines` measures this on every beat and fails on any overlap. Hidden in Lite mode. `?legacylines=1` measures the old geometry (for the before/after count only).
- **Lite mode:** 3D is the default and the tour **never switches to Lite by itself** on low fps: it only shows a toast "Switch to Lite mode? (L)". Lite starts only when WebGL is not available (or the context is lost), when you press **L**, or with `?lite=1`. Pressing L remembers the choice in `localStorage` (`ibrd-tour-lite`) for the next visit.
- **Print mode:** one page per scene (see *Print / PDF*). Scenes with 0 beats print no page.
- **Fonts:** latin and vietnamese subsets of Playfair Display 700, Cormorant Garamond 400/600 italic and Open Sans 400/600/700, woff2 only (the woff fallbacks are stripped at build time).
- **HUD sizes:** HUD text is smaller (15–20 px at design size) than the 28 / 26 / 24 px minimums, which apply to slide content. The HUD stays inside the reserved margins (top 84, bottom 72, left 72, right 48) and content zones start inside them.
- **Titles:** scene titles are readable versions of the TOC headings, and objectives are "TBD" until the content arrives.

## Retuning colours

Every colour is a CSS variable in `src/tokens.css`. The DOM uses them directly, and the 3D materials read the same variables through `src/theme.ts`, so changing a value retunes both.
- `--wb-navy`, `--wb-blue` and `--wb-cyan` are the main palette, and `--surface` / `--surface-2` are the card backgrounds.
- `--warn`, `--bad` and `--good` carry meaning. The Nha Trang pin uses `--bad`.
- `--stone-*`, `--steel`, `--marble` and `--ground` are the 3D materials.
- `--accent-tep` / `--accent-ccsep` are the half-room accent lights, and `--spill` is the door light and daylight.
- Chart series follow `--series-1..4` (navy, blue, cyan, warn).

## Print / PDF

Open `?print=1` (or press **P**). The order is: cover, contents (built from the final page numbers), **one page per scene**, then the references. There is no WebGL and no HUD.
- **Page grid (1920×1080):** a header band (cyan section chip and navy title), a **main area** with the scene's tables, charts and diagrams (each printed once, complete, in its final state, no focus glow), then the **text cards**.
- **Cards:** a CSS grid with equal column width and equal row height (2-4 columns, 24 px gap). One beat is one card, with the cyan chip, title and body (20 px); the source tag is only shown with `?tags=1`.
- **Safe margins:** 60 px left and right, 40 px top, 110 px bottom. The bottom 110 px are the footer zone ("Group 6 – IBRD in Vietnam | page/total").
- **No clutter:** no numbered pins, legends, leader lines, tab strips, buttons or hints.
- **Background:** the scene's 3D end pose (`src/assets/print-bg/<scene>.jpg`, made by `npm run capture-bg`) under a 55% white scrim, with cards and the main area at 96% white.
- **Colours:** text is navy or ink on white cards. Dark cards (chapter titles, Thank You) keep white text.
- **Overflow:** a scene that does not fit continues on extra pages with whole cards, never smaller fonts (`docs/print-overflow.md`).
- **References:** paginated by measured height, all 64 exactly once.
- `npm run capture-bg`: exposure ≤ 1.0, retried 15% darker while an image has more than 25% of pixels above luminance 245 or a mean above 0.90 (`docs/capture-exposure.md`).
- `npm run export-pdf` writes `dist/ibrd-bank-tour.pdf` (currently **95 pages**). It runs `capture-bg` first if the images are missing.
- `npm run check-print` checks text contrast (≥ 4.5:1 against the rendered page), the footer zone and page edges, clipped boxes, backgrounds, references [1]..[64] and minimum font sizes, writes `docs/print-check.md`, and fails on any problem.

## Floors 1-2 content policy (update _10)

- One key idea per beat, about 25-50 words, key terms in **bold**, the paper's [n] citations kept.
- Abbreviations are spelled out at first use in each scene, and amounts are written "USD …".
- No case-study names or numbers on Floors 1-2 (TEP, CCSEP, NPT, Nha Trang, Phan Rang, 231.25, 31.4%, 290,000 …): the wording is generic. The single exception is `f2-prep` beat 4, which keeps one sentence naming TEP because the Chapter 2 fix list asks for it.
- Removed scenes: `f1-rationale-1`, `f1-objectives`, `f1-method`, `f1-scope`, `f1-voting`. The Introduction is now `f1-rationale-2`, `f1-problem` and `f1-structure`.
- Scenes 23-32 (`f2-cycle` … `f2-me`) follow "Fix chap 2.pdf" word for word.
- Each beat has a cyan label chip, a navy title and the paragraphs. Tables keep the paper's rows and columns with short cell text.
- Presenter `targetSeconds` is about 20 s per beat.

## Decisions for the content of Floor 3, the Conclusion and the exit

- **Room layout:** TEP sits on the left half and CCSEP on the right. TEP tables and charts are centred with the prop band on the **left**; CCSEP tables use `band: 'right'` (layout `.k-centre-r`), so their props sit in the right band. Either way the camera turns toward the half being discussed.
- **Prop cameras:** a table or chart beat without a dedicated waypoint uses `<floor>-prop[R]-<anchor>`. This is a pose solved by `scripts/frame-props.mjs`, so the beat's first callout always ends on a visible prop.
- **Anchors:**
  - TEP outputs use `anchor:f3-tep-outputs:new-lines`, `:rehab-lines`, `:transformer-capacity`, `:smartgrid-500kv` and `:smartgrid-220kv`.
  - The CCSEP city callouts point at the four map pins.
  - The Nha Trang pin is its own mesh and turns red (`--bad`, enlarged) only in `f3-ccsep-nhatrang`.
- **Figures from images:**
  - Values that appear only as data labels in the paper's figures (Figure 4: 2016/2017/2018/2020; Figure 7: city segments) were read from the page images and marked as such in `facts.ts`.
  - Figure 8's adjusted bars are drawn only where the text states a value.
  - Figure 5 (a pie in the paper) is drawn as a stacked bar.
- **Fact formatting:** `{id|2}` shows a fact with 2 decimals, matching the paper's tables (625.00, 500.00).
- **Conclusion:** the brief asks for exactly 5 lift-down beats (display 3 → 2 → 1 → G → G doors open), one per part of the Conclusion. Parts 1.2 and 3 run past ~90 words, so the glass panel switches to two columns for them rather than adding beats.
- **TEP assessment:** the four criteria (Relevance, Effectiveness, Efficiency, Sustainability) are shown as four doors holding the paper's remarks. The only ratings shown are the PPAR's overall ones, because the paper gives none per criterion (a `<Note>` says so).
- **Exit:** `ex-sources` is a searchable, scrollable wall of all 64 references (the same data as the R panel); the print version points to the reference pages. `ex-thanks` uses the cover data, and the exit door opens on its beat.

## Decisions for the content of Floors 1-2

- **Callouts and centring:** to give every table beat a callout to a *visible* prop, tables are centred in the area to the right of a 400 px prop band, not on the exact screen centre. Table beats switch to a dedicated camera.
- **Props:**
  - `f1-instruments` uses the three teller counters labelled IPF / DPF / PforR (Table 1.4.1 has three rows).
  - The loan desk keeps its paper stack and ledger; the Table 1.4.2 props (rate board, calendar, clock, coin stack) were removed in update 3 together with the per-row beats.
  - Also new: an INFORMATION counter (`f1-what`), a hanging "CHAPTER 1 · OVERVIEW OF THE IBRD" sign, era plates on the archive wall (1944-1950s … 2000-present), ten stamps on the safeguards table (ESS5 in cyan), a "CHAPTER 2 · …" sign on Floor 2, and letter-of-credit papers on the finance desk.
  - Table 2.1.1's six stages map to the six chairs around the round table.
- **Prose:** text is in English and sentences are shortened, never changed in meaning. Where the paper's wording is a range or qualitative ("around 15-16 percent", the IDA / IBRD / commercial cost ranking), the tour keeps it so and invents no figure.
- **Cost comparison:** the cost comparison in Introduction 1.2 is drawn as a qualitative "cost ladder", because the paper gives no numbers there.
- **TEP counterpart chart:** removed in the _10 update (no case numbers on Floor 2).
- **Notes:** the presenter notes only restate the paper.

## Engine changes (made for this content; no behaviour removed)

- `Beat.source` was added (`src/content/types.ts`). The print header shows it.
- `scenes.ts` reads `objective` from `src/data/objectives.ts` and `targetSeconds` from `src/data/notes.ts` (falling back to the list value).
- `<Cite>` accepts a `label` (e.g. "63, p. iii; 64, p. 18").
- `Fact` has optional `digits`, and `formatFact()` handles units.
- `test:shots` captures the first and last beat, adds the `--segments` and `--all-beats` options, and flags clipped content and content in the HUD margins.
- CSS for the content kit lives in `src/app.css` (`.k-*`, plus the lanes, tiers and proportion-bar styles).
- `scripts/audit-content.ts` and `scripts/frame-props.mjs` are new.
- No engine bugs needed fixing for this work.
- Added for Chapter 3:
  - `Chart` takes an optional `min` (line charts; Figure 4 starts at 2.0% as in the paper).
  - The `kit` slide has `band` and automatic per-prop cameras.
  - `{id|2}` fixed-decimal templates.
  - SDR units in `formatFact`.
  - The print view has a contents page, reference pages and static callouts.

## Engine changes in the _10 update (needed fixes only)

- `src/primitives/Callout.tsx` rewritten: text-aware routing (obstacles are the client rects of every text line and HUD box), layer below the cards, halo and pin, numbered-pin fallback (`CalloutPinsTop`). The geometry is published on `window.__calloutGeo` for `check-lines`.
- `?capture=1` (implies `?shot=1` and `?noauto=1`) hides the content and the HUD, for `capture-bg`.
- Lite mode: no automatic switch, toast only, choice remembered in `localStorage`.
- The print view was rewritten (`src/print/PrintView.tsx`). The kit attaches its slides to each `View` so print can lay out every beat at once.
- `formatFact` prints "USD" everywhere instead of "US$".
- Print backgrounds live in `src/assets/print-bg/` and not in `public/`, because Vite can only embed imported files in the single-file build.
- `scripts/browser.mjs` launches Chromium with real WebGL through SwiftShader (`--use-gl=angle --use-angle=swiftshader`).

## Known limitations

- The props are procedural and simple. They read as what they are but are not detailed models.
- Headless screenshots use software GL (SwiftShader), so they are slow (~10 s per scene). On a real GPU the tour runs far faster.
- `export-pdf` and the shots rebuild `dist-single/` first.
