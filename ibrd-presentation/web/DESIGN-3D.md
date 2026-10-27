# DESIGN-3D.md — what `paper/Mẫu 3d.jpg` teaches, and how it is rebuilt

Only the *style* of the reference is used. No statue, bust, human figure, subject, layout, word or logo is copied,
and no human figure of any kind is modelled (not historical figures, not Ajay Banga). All objects are generic
symbols of finance and infrastructure built from procedural geometry in Three.js.

## 1. Features extracted from the reference

| # | Observed in the reference | Rebuilt as |
|---|---|---|
| 1 | One cut-out object stands in the middle of the page; a giant display word sits *behind* it and is partly hidden | DOM giant word under a transparent WebGL canvas; the object covers 20–40% of the word, measured by projecting the object's bounding box onto the word's box |
| 2 | Marble with veins and fine grain | `MeshPhysicalMaterial` with a procedural FBM vein texture (canvas → `CanvasTexture`), varying roughness map, faint normal map from the same noise, film grain overlay |
| 3 | A glowing gold core / crack (kintsugi) inside the stone | Emissive gold inlay meshes (bands, seams, cores) + one additive glow sprite per core, breathing very slowly (period 6 s, amplitude 8%) |
| 4 | Solid metallic gold objects that mirror their surroundings | `MeshStandardMaterial` metalness 1, roughness 0.28, env map from `RoomEnvironment` (PMREM, no HDRI download) |
| 5 | Strong key light from top-left; cold rim light behind; black vignette towards edges | Directional key (warm white, top-left, intensity 3.2), directional rim (#8FB4FF, behind-right, 2.4), hemisphere fill (0.15); CSS vignette over the canvas |
| 6 | A bright round plinth / disc under the object with a soft elliptical shadow | Lathe-turned plinth with a bright top face; contact shadow baked into a radial-gradient texture on a plane (no shadow maps) |
| 7 | Metallic silver/blue-grey gradient lettering | Giant word uses the `--silver` CSS gradient (Cormorant 300) |
| 8 | An arc carousel of several objects, the centre one largest and brightest, side ones dimmer | Carousel for IPF/DPF/PforR (1.4) and the six-stage project-cycle ring (Ch 2): items on an arc, selected item scale 1, others 0.62 and 45% brightness |
| 9 | Some objects half-sunk in darkness | Rim light only on secondary objects; fog (`FogExp2` night colour) swallows the far side |
| 10 | Deep navy-black ground (#01050D–#0D1320 sampled), cinematic, sparse | Night gallery ground `#070D18` with a radial spotlight gradient behind the object |
| 11 | Dust / film feel | ≤ 120 dust points drifting slowly in the key light; 3% film grain (static tiled PNG shifted per frame by CSS, not a shader pass) |

## 2. Material system "stone + gold"

| Material | Settings |
|---|---|
| `marble` | colour from vein texture (base #D9D6CF, veins #6E6A66), roughness 0.42–0.62 (map), clearcoat 0.25, clearcoatRoughness 0.4, normalScale 0.18 |
| `marbleDark` | base #8F8C88 for plinths and secondary objects |
| `gold` | colour #E0B252, metalness 1, roughness 0.28, envMapIntensity 1.1 |
| `goldGlow` | colour #FFC86B, emissive #FFAA33 × 2.2, toneMapped true; paired with additive sprite |
| `steel` | colour #9AA3AD, metalness 0.85, roughness 0.38 (pylon lattice) |
| `wax` | colour #8E2A22, roughness 0.55, clearcoat 0.6 (seal on the bond scroll) |
| `water` | colour #2F4C66, metalness 0.2, roughness 0.15, transmission 0 (stylised stone waves have a gold crest line) |

Renderer: ACES Filmic tone mapping, exposure 1.05, `SRGBColorSpace` output, physically correct lights,
DPR ≤ 1.5, antialias on desktop. Camera FOV 32°, low angle (≈ 8° below object centre) like the reference.

## 3. Hero object per main part (exactly one)

| Part | Hero object (procedural) | Giant word behind |
|---|---|---|
| Cover / Introduction | Stone globe (sphere + raised continents-free graticule) with gold meridian and equator bands, on a turned plinth | IBRD |
| 1.1–1.2 What is the IBRD, history | Generic neoclassical institution: stepped stylobate, six fluted columns, entablature, pediment; gold acroterion and frieze line | 1944 |
| 1.3 Organisation, voting, funds | Three-tier stone pedestal (Board of Governors / Board of Executive Directors / President, tiers unlabeled in 3D) carrying a gold sphere; a stack of gold coins and a rolled bond with a red wax seal at its foot | AAA |
| 1.4 Instruments and loan terms | Arc carousel of three symbols: IPF = stone block with gold rebar seams (a built asset), DPF = scroll on a lectern with wax seal (a policy decree), PforR = gold medal on a stone stand (a verified result); centre item follows the step | IPF · DPF · PforR |
| Chapter 2 Project financing support | Ring of six stone pedestals (project cycle); the pedestal of the current stage lights gold and the ring rotates to bring it forward | CYCLE |
| 3.1 Vietnam–World Bank context | (shares the Ch 3 opener) stone globe tilted to show the region, gold graticule | 1993 |
| 3.2 TEP | High-voltage pylon: stone legs, steel lattice, gold glowing insulator strings, catenary wires leaving the frame | TEP |
| 3.3 CCSEP | Stone arch bridge over stylised stone waves with gold crest lines; a culvert mouth under the arch | CCSEP |
| 3.4 / Conclusion | Large gold compass (bezel, rose, needle) turning slowly on a stone base; optional extruded Vietnam silhouette in the bezel (Natural Earth 1:50m via `world-atlas`, simplified) | LESSONS |
| Thanks | Gold coin spinning on a small stone stand | THANK YOU |

Giant words are taken from the paper's own vocabulary (IBRD, 1944, AAA, IPF/DPF/PforR, cycle, 1993, TEP, CCSEP,
lessons); "Thank you" is the only presentational phrase. Nothing printed on an object carries text, numbers, dates or codes not in the paper; the objects carry none at all.

## 4. Composition and light/dark rhythm

* Night gallery (dark ground, spotlight, full-size object): cover, chapter openers (Intro, Ch 1, Ch 2, Ch 3, TEP,
  CCSEP, Conclusion), 1.4 instrument carousel, 2.1.1 project-cycle ring, TEP "commitment vs disbursement", CCSEP
  "blended package", recommendations, thanks.
* Cream sections that are text-dense keep the hero object small (medallion slot, 260–360 px) with a warm rim light,
  or rely on the 2D engraving when the layout has no free zone.
* Safe zones: every template declares the rectangle the object may occupy; the object is scaled/offset to fit it,
  never over bullets, tables, [n] links or controls. The canvas has `pointer-events: none`; only the carousel strip
  receives pointer events.

## 5. Interaction and motion

* Pointer parallax: object yaw/pitch 2–4° toward the pointer, eased (k = 0.06/frame).
* Idle: rotation 0.05 rad/s after 2 s without input.
* Section change: old object slides 60 px and fades out (300 ms), new object rises 40 px and fades in (450 ms);
  no morphing between objects.
* Render on demand: a frame is drawn only while something animates (enter/exit, parallax easing, idle rotation,
  breathing glow); when the presenter stops interacting and idle motion is off the loop sleeps.
* `T` toggles 3D; presets **Full** (dust, glow, grain, DPR 1.5), **Light** (no dust/grain, DPR 1, fewer segments),
  **Static** (pre-rendered transparent WebP from `scripts/render-fallbacks`). Auto-downgrade to Light when frame
  time > 24 ms for 3 s, with a "Chế độ nhẹ" chip that can switch back.
* `prefers-reduced-motion`: no idle rotation, breathing, dust or parallax; transitions become plain fades.

## 6. Budgets

One WebGL canvas for the whole deck; scenes built only for the current section ±1 and disposed when they leave the
window; ≤ 150k triangles per scene (the pylon, the heaviest, is ~38k); ≤ 40 draw calls; textures ≤ 1024² generated
procedurally; Three.js lazily imported (dynamic `import()`), code-split from the 2D deck.
