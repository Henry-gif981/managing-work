# DESIGN.md — IBRD deck (Group 6, Project Finance)

Style reference: `src/Mãu IBRD final.jpg` (a 10-slide deck about I. M. Sechenov).
**Only the style is borrowed.** No image or text from the reference is reused; every illustration
in this deck is drawn new for the IBRD topic (`assets/svg/*.svg` → `assets/png/*.png`, 2×, transparent).

## 1. What the reference does (observed)

| Trait | Observation in the reference | How it is translated here |
|---|---|---|
| Two grounds | Warm cream paper slides alternate with dusty blue-grey watercolor slides | `paper` (cream, content) and `wash` (blue-grey watercolor: cover, chapter openers, closing) |
| Display type | Very tall, thin, condensed display capitals; script/italic accent line | **Cormorant Garamond** (Regular, set in caps with wide tracking for titles; *Italic* for accents) |
| Body type | Small, plain sans in muted navy | **Be Vietnam Pro** (Regular / **Bold** for lead phrases) |
| Illustration | Monochrome 19th-century engravings in ink-blue, cut out, overlapping the text | New line-art "engravings" in ink-blue with hatching: classical bank, globe, pylon, coastal city with outfall pipe, ledger and coins, decree scroll, compass rose |
| Accent | Red blood-cell dots scattered at the edges | Red dots `!!dot1..3` that slide between slides with Morph |
| Giant words | A chapter word set across the whole slide behind an image ("ОТКРЫТИЯ") | Chapter openers set one giant word (INTRO, BANK, SUPPORT, CASES, TEP, CCSEP, CONCLUSION, SOURCES) that shrinks into the section tag on the next slide |
| Texture | Faint pale engravings tiled in the paper background | Faint blueprint motif (compass + meridians) printed into the paper background at 6% opacity |

## 2. Tokens

### Color (hex, no alpha)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `paper` | `#F4ECD8` | content background | — |
| `paper-deep` | `#E8DDC2` | cards, table header band | navy on it 7.65:1 |
| `ink` | `#2E4257` | titles, body text, line art | on paper 8.77:1 (AAA) |
| `ink-soft` | `#4B5A69` | captions, Source lines | on paper 6.01:1 (AA) |
| `wash` | `#4E637A` (mean of watercolor) | cover / chapter-opener ground | paper text on it 5.26:1 (AA); lightest blotch `#5A6F86` 4.4:1 (≥3:1 for large display text) |
| `mist` | `#DCE3EA` | alternate table rows, chart gridlines | navy on it 7.98:1 |
| `dot` | `#B4432F` | decorative red dots, chart highlight | 4.71:1 on paper |
| `link` | `#A33224` | citation numbers [n] (underlined) | 5.87:1 on paper (AA) |
| chart series | `#2E4257`, `#7F93A8`, `#C9B48A`, `#B4432F`, `#B9C6D2` | in that order; series also differ by position/labels, never by color alone | |

Theme mapping (`ppt/theme`): dk1 `2E4257`, lt1 `F4ECD8`, dk2 `4E637A`, lt2 `E8DDC2`, accent1 `2E4257`, accent2 `7F93A8`, accent3 `C9B48A`, accent4 `B4432F`, accent5 `B9C6D2`, accent6 `4B5A69`, hlink `A33224`, folHlink `7A2A1F`.

### Type
| Role | Font | Size (13.333 × 7.5 in slide) |
|---|---|---|
| Giant chapter word | Cormorant Garamond Regular, caps, tracking +6 pt | 150–230 pt |
| Slide title | Cormorant Garamond Regular, caps | 40 pt (min 36) |
| Accent line / quote | Cormorant Garamond *Italic* | 28–32 pt |
| Section tag (`!!section`) | Be Vietnam Pro Bold, caps, tracking +3 pt | 14 pt |
| Bullet level 1 | Be Vietnam Pro, lead phrase **Bold** | 24 pt (min 24) |
| Bullet level 2 | Be Vietnam Pro | 20 pt (min 20) |
| Card heading / body | Be Vietnam Pro Bold 22 / Regular 20 | |
| Big numbers | Cormorant Garamond Bold | 54–66 pt |
| Table cells | Be Vietnam Pro | 14–16 pt (min 14) |
| Source / caption | Be Vietnam Pro *Italic* | 12–13 pt (min 12) |
| Citation [n] | inherits the run size, never < 14 pt, color `link`, underlined | |

Only two families are used (+ their italic). Theme fonts: major = Cormorant Garamond, minor = Be Vietnam Pro.
Both are OFL (files + licences in `fonts/`). Every glyph used in the deck (Vietnamese diacritics, – ≈ ≥ ’ “ ” …) is checked
against each font's cmap by `scripts/audit-pptx`.

### Layout grid
- Slide 13.333 × 7.5 in, margins 0.6 in left/right, 0.45 in top, 0.5 in bottom.
- Section tag at (0.6, 0.38); title baseline band 0.65–1.45 in; body from 1.75 in.
- Content column: 7.9 in text + 4.1 in illustration/number column, or full 12.1 in for tables/charts.
- Gaps: 0.3 in between blocks; cards 0.3 in apart.
- Footer: slide number (bottom-right, 12 pt, `ink-soft`) and on content slides nothing else.

### Motion (PowerPoint Morph)
- Every content slide: `p159:morph option="byObject"`, fallback `fade`.
- Same section: 600 ms; into a chapter opener / out of it: 1100 ms.
- Persistent named objects: `!!bg`, `!!section`, `!!title`, `!!dot1..3`, `!!compass`, `!!art`, `!!card1..n`, `!!num1..n`, `!!tbl`, `!!chart`.
- Source-card slides: no Morph (fade, 200 ms) so they open and close instantly.

## 3. Anti-patterns avoided
- No accent bars or stripes under titles; no emoji; no gradients except the painted watercolor ground.
- No centered body text; no text below 12 pt; no autofit/shrink-on-overflow.
- Nothing copied from the reference deck (portrait, anatomy plates, Cyrillic titles).
