# DESIGN.md — 2D system: "the certificate and ledger of a 1944 institution"

Sources studied: `paper/Mẫu IBRD final.jpg` (2D style only) and `paper/Mẫu 3d.jpg` (3D style only, see
DESIGN-3D.md). Nothing from either image is copied: no portrait, anatomy plate, statue, title, word or logo. What is
borrowed is the *grammar*: cream paper alternating with blue-grey watercolour, thin display capitals at giant size,
cut-out engraved line art laid over the giant word, a few brick-red dots, generous empty paper.

## 1. What the 2D reference actually does (observed)

| Observation in `Mẫu IBRD final.jpg` | Rule adopted here |
|---|---|
| Two grounds only: warm cream paper and a blue-grey watercolour wash; slides alternate between them | `paper` and `wash` grounds alternate; a third ground, `night`, belongs to the 3D gallery sections |
| Display capitals 3–5× the body size, very thin strokes, set tight, often bleeding off a slide edge | Giant word in Cormorant 300–400, 220–420 px, tracking −0.01em, allowed to bleed |
| A cut-out engraving (portrait, anatomy, building) overlaps the giant word, never the body copy | Hero engraving sits *on* the giant word in a reserved zone; body copy has its own clear column |
| Line art is monochrome ink, hatched, with paper showing through | Engravings drawn as SVG strokes + hatching in `ink`/`slate`, no fills except paper |
| Faint anatomical/botanical sketches as a background texture | Background layer of guilloche rosettes, ledger rules and a latitude/longitude grid at 6–10% opacity |
| Small red circles scattered (blood cells) | Brick-red dots, max 3–5 per section, never on text |
| Body text small, slate-blue, left aligned, in a single column | Bullets in Be Vietnam Pro, slate ink, left aligned, max ~60 characters per line |
| Bold keyword runs inside the body text | Every bullet opens with a bold key phrase |

## 2. Tokens (CSS custom properties, `src/styles/tokens.css`)

Colours were sampled from the reference (Pillow median-cut) and tuned for projection contrast.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | `#FBF2DE` | cream ground (sampled #FBF2DE) | — |
| `--paper-2` | `#F1E5C8` | card fill, table zebra | — |
| `--paper-edge` | `#E2D3AE` | deckled paper edge, rules | — |
| `--wash` | `#8B98A0` | watercolour ground (sampled #8B98A0) | — |
| `--wash-light` | `#ACB5BC` | wash highlights (sampled #ACB5BC) | — |
| `--wash-deep` | `#5F6E79` | wash shadows | — |
| `--ink` | `#23292F` | body text on paper | 13.2:1 on paper |
| `--slate` | `#2F4458` | titles, giant word on paper | 9.0:1 on paper |
| `--slate-soft` | `#4A5D6E` | secondary text on paper | 6.1:1 on paper |
| `--brick` | `#A13D2D` | citation links, dots, wax seal | 5.9:1 on paper |
| `--ochre` | `#A87A2A` | rosette/seal accents (sparingly) | decorative |
| `--night` | `#070D18` | 3D gallery ground (sampled #070D18–#0A111E) | — |
| `--night-2` | `#101A2B` | gallery panels | — |
| `--mist` | `#DCE3EC` | text on night | 15.0:1 on night |
| `--mist-soft` | `#AEB9C7` | secondary text on night | 9.8:1 on night |
| `--brick-light` | `#E8826E` | citation links on night | 7.3:1 on night |
| `--gold` | `#C9A24A` / `--gold-hi` `#F2D27A` | gilded rules on night, 3D cores | decorative |
| `--silver` | gradient `#F4F7FB → #B7C2D0 → #6A7890 → #A9B6C6` | giant metallic word in 3D sections | decorative |
| On `wash` ground text uses `--paper` (`#FBF2DE` on `#5F6E79` panel = 4.7:1) or sits on a cream card | | |

Spacing: 8 px base grid; stage margins 96 px (left/right) × 72 px (top/bottom); column gap 64 px.
Radius: 2 px (paper does not have rounded corners); cards use a double rule frame instead of radius.
Motion: 320 ms enter, 260 ms exit, `cubic-bezier(.2,.7,.2,1)`; bullets slide 18 px + fade; no morph/FLIP.

## 3. Typography (decided on `/specimen`, screenshots in `qa/specimen/`)

Candidates rendered in Chromium on cream and night boards at 1920×1080, all self-hosted (`public/assets/fonts/`):

| Pair | Verdict |
|---|---|
| A · Playfair Display / Source Serif 4 / Be Vietnam Pro | Strong, but Playfair's heavy hairline contrast reads "fashion magazine" rather than "bond certificate"; at 60 px its title weight crowds the bullets |
| B · Newsreader / IBM Plex Sans | Clean and very legible; display too "newspaper", giant letters lack the engraved elegance of the reference |
| **C · Cormorant SC + Cormorant / Be Vietnam Pro** | **Chosen.** Cormorant's thin Garamond capitals are the closest match to the reference's thin display and to the lettering of old share certificates; Cormorant SC gives true engraved small caps for eyebrows; Be Vietnam Pro was designed for Vietnamese, so stacked diacritics (ặ ễ ữ ợ) sit cleanly and read from the back of a room |
| D · Fraunces / IBM Plex Sans | Too soft/quirky for a 1944 institution |
| (Libre Caslon Text) | Rejected: no Vietnamese glyphs (fontTools cmap: 30 code points missing) |

Roles:

| Role | Face | Size on 1920 stage |
|---|---|---|
| Giant word (paper) | Cormorant 300, `--slate` | 220–420 px |
| Giant word (3D gallery) | Cormorant 300, `--silver` gradient text | 260–460 px |
| Section title | Cormorant 500 | 60–76 px (min 56) |
| Eyebrow / chapter label | Cormorant SC 500, letter-spacing 0.22em | 24 px |
| Bullet level 1 | Be Vietnam Pro 400, key phrase 600 | 31 px / line-height 1.32 |
| Bullet level 2 | Be Vietnam Pro 400 | 26 px |
| Table cells | Be Vietnam Pro 400, `tabular-nums lining-nums` | 22–24 px |
| Caption / "Source:" | Be Vietnam Pro 400 italic | 18–19 px |
| Big numbers (stamps) | Cormorant 500, `lining-nums` | 72–140 px |
| Quote | Cormorant 500 italic | 54–64 px |
| Project/loan codes (P131558, 8417-VN, 80/2014/ND-CP) | IBM Plex Mono 500 | inherits |
| Citation numbers [n] | Be Vietnam Pro 600, `--brick`, underlined | 22 px, hit area ≥ 34×34 px |

Secondary font: IBM Plex Mono only. A 2 KB glyph-fallback subset ("IBRD Sym", cut from IBM Plex Sans with
`pyftsubset`) supplies ≈ ≥ ≤ ↩ → ← ↑ ↓, which the fontsource subsets of the text faces do not contain; it is routed by
`unicode-range`, so it never replaces a letter. Every face is OFL (licences next to the files).
Loading: `font-display: swap`, the four critical files are preloaded, fallback faces (`Georgia`, `Arial`) get
`size-adjust`/`ascent-override` so the swap does not shift layout; the deck waits for `document.fonts.ready` before
showing the first section.

## 4. Motif library (`src/art/`, all hand-built SVG, no filters)

1. **Grounds**: guilloche rosette (parametric hypotrochoid curves, the banknote device), ledger paper (blue rules +
   red margin line), latitude/longitude graticule, watercolour wash (one static WebP generated at build time from
   procedural noise — no runtime blend modes).
2. **Print details**: certificate frame (double rule + corner rosettes), corner ornaments, title ribbon, perforated
   stamp edge (for number tiles), tilted round seal (rubber stamp), red wax seal, double rules, Roman numerals for
   chapters. Text on stamps/seals is limited to strings printed in the paper ("1944", "AAA", "IBRD", "P131558", …).
3. **Hero engravings** (one per main part, stroke + hatching): antique globe with coins (Intro); neoclassical
   institution (generic, not a real building), 1944 → today timeline, engraved map graticule (1.1–1.2); scales,
   vault, bond with coupons, round table (1.3); ledger, gears, approval stamp, magnifier, helmet + wrench, lecture
   hall (1.4, Ch 2); 500-kV pylon and substation over the giant "TEP"; coastline with waves, treatment plant,
   bridge, harbour over "CCSEP"; great compass and a Vietnam silhouette (motif only, Natural Earth data) for the
   recommendations and conclusion.
4. **Number stamps**: big figures in perforated stamp frames or round seals — only numbers printed in the paper.
5. **Line-draw entrance**: engravings draw their strokes (`stroke-dashoffset`, 900 ms) on entry; off in reduced
   motion and in "static" preset.

## 5. Templates (13) and rhythm

`cover`, `chapter` (chapter opener, night gallery), `hero` (title + bullets + hero engraving), `cards`
(certificate cards in 2–4 columns), `compare` (two-column ledger: IBRD vs IDA, loan vs credit, strengths vs
weaknesses), `table` (table inside a certificate frame, row-by-row highlight on step), `timeline` (rail with dated
stations), `stats` (big numbers in stamps + bullets), `process` (6-station "railway line" for the project cycle and
the funding chain), `chart` (one quiet engraved chart + bullets), `gallery` (night, 3D hero + giant metallic word +
bullets in a side column), `quote` (a verbatim sentence of the paper), `thanks`; plus utility layouts `refs` and
`index`.

Rhythm rules enforced by `scripts/verify-content`: no three consecutive sections share a template; grounds
alternate paper/wash/night so that no more than three paper sections run in a row; dense sections (tables) are
followed by an airy one; every section has at least one graphic element beyond text; at most three decoration layers
overlap (ground pattern, hero engraving, accents).

## 6. Accessibility

Contrast ratios above are computed (WCAG relative luminance). Text never sits directly on the watercolour texture:
on `wash` slides the copy is on a cream card or on the `wash-deep` panel. Engravings and 3D never overlap bullets,
tables, citation links or buttons (layout reserves the zones; the QA script checks bounding boxes).
`prefers-reduced-motion` disables slide/fade offsets, line drawing, idle rotation and particles.
