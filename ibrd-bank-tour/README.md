# IBRD Bank Tour

An interactive 3D "bank tour" for **Group 6 (NEU)**, built around the paper *The IBRD and its development project financing activities in Vietnam*.
You walk in through the front door. Floor 1 holds the Introduction and Chapter 1, Floor 2 holds Chapter 2, and Floor 3 holds Chapter 3, with TEP on the left, CCSEP on the right and the executive office at the far end. The Conclusion plays as the lift rides down, and the Thank-You is at the exit door.

This version is the **engine and 3D shell**. Every one of the 64 scenes exists with placeholder content (title, section reference, "TBD", 3 beats). The real content of the paper is added later in `src/content/` and `src/data/`.

## Run

```bash
npm install
npm run dev            # http://localhost:5173 (dev overlay on by default in dev)
npm run build          # dist/ (normal multi-file build)
npm run build:single   # dist-single/index.html — ONE file, opens from file:// offline
npm run export-pdf     # dist/ibrd-bank-tour.pdf — one 1920x1080 page per beat
npm run test:shots     # docs/screens/NN-<scene>.png — end pose of every scene
npm run test:smoke     # opens the single file from file://, walks with keys, fails on console errors
npm run check-facts    # validates src/data/facts.ts and runs src/data/checks.ts
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

Other URL flags: `?lite=1` starts in Lite mode. `?shot=1` is for screenshots (instant tweens, no auto-advance, no fps watchdog). `?noauto=1` stops the door and lift-up scenes from auto-advancing. `?dev=0` turns the dev overlay off in `npm run dev`.

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

## Architecture

```
src/scenes.ts            scene list (64)            src/content/*.tsx   beats + View per scene
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
- **Callouts:** hidden in Lite and Print mode (there is no 3D projection there). The tables and charts carry the meaning on their own.
- **Lite mode:** the toast offers Lite mode after 3 s of average fps below 24 (it starts watching 5 s after load) and switches by itself after 8 s. WebGL failure or context loss switches immediately.
- **Print mode:** one page per beat. Scenes with 0 beats print no page. The header names the scene, section and beat, and the footer reads "Group 6 – IBRD in Vietnam | n/N".
- **Fonts:** latin and vietnamese subsets of Playfair Display 700, Cormorant Garamond 400/600 italic and Open Sans 400/600/700, woff2 only (the woff fallbacks are stripped at build time).
- **HUD sizes:** HUD text is smaller (15–20 px at design size) than the 28 / 26 / 24 px minimums, which apply to slide content. The HUD stays inside the reserved margins (top 84, bottom 72, left 72, right 48) and content zones start inside them.
- **Titles:** scene titles are readable versions of the TOC headings, and objectives are "TBD" until the content arrives.

## Known limitations

- The props are procedural and simple. They read as what they are but are not detailed models.
- Headless screenshots use software GL (SwiftShader), so they are slow (~10 s per scene). On a real GPU the tour runs far faster.
- `export-pdf` and the shots rebuild `dist-single/` first.
