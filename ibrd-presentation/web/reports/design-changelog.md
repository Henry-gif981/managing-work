# Design pass — changelog

Scope: appearance, layout and display only. No word, number, unit, citation, title or section was changed,
added, hidden, merged or reordered (119 → 119). The palette (navy, cream, gold, brick) and the Cormorant +
Be Vietnam Pro pairing are unchanged. No content file (`content/*.yaml`, `content-ibrd.md`, `src/data/deck.json`)
was edited and no field was added to them.

## Result

| Target | Before | After |
|---|---|---|
| Text nodes below WCAG (4.5:1, or 3:1 for ≥ 40 px / ≥ 32 px bold), real background | 453 on 35 sections | **0** |
| Wash sections with a failure | 34 / 34 | 0 / 34 |
| Occupancy, content sections (60 px grid cells touched by text and blocks) | 40.5 % | **51.5 %** (target ≥ 48) |
| Bottom empty, content sections | 28.3 % | **14.8 %** (target < 15) |
| Content sections with ≥ 30 % empty at the bottom | 54 | **2** (target ≤ 10; both are quote sections) |
| Content spilling out of its zone or off the stage | — | 0 |
| Decorative brick dots | ~3 per section | 0 |
| Section text identical before/after (innerText at `?steps=all`) | | 118 / 119 identical; section 85 gains the two chart labels below |
| Console errors / warnings | 0 | 0 |
| `npm run check` (content, links, fonts) and `npm run qa` (layout) | PASS | PASS |

The only text difference: on section 85 (Figure 7) the Quy Nhon column now shows the two labels the brief asked
for, **5.1** (IBRD) and **5.2** (counterpart). Both values are the ones already in `content/charts.yaml`; no number
was computed.

Per template: `reports/metrics-compare.md`. Per section: `reports/metrics-before.csv`, `reports/metrics-after.csv`.
Per text node: `reports/contrast-before.csv`, `reports/contrast-after.csv`. Screenshots: `screenshots/before`,
`screenshots/after`; side by side for 14 sections plus the 3D cover: `reports/before-after.html`.

### Method (scripts/measure.mjs + scripts/measure-analyse.py)

Each section is opened at 1920×1080 with `?steps=all&preset=static&3d=0`, `__deck.go(n)`, 1 s wait, screenshot.
A second screenshot with all content text made transparent gives the real background; each text node's colour
(× its opacity) is blended over the pixels under its glyph boxes and the 10th-percentile ratio is kept, so the
lighter patches of a texture count. The running head and the counter are judged for contrast and size but kept
out of the layout metrics. "Before" was re-measured with the final script on the original code (commit 0cc2754,
served from a worktree), so both columns use the same definitions. The baseline matches the one given in the
brief (bottom empty 28–29 %, 54/109, 34/34 wash). Occupancy reads higher than the brief's 32 % because cards,
table frames and chart boxes count as blocks; the same definition is used on both sides.

## Group 1 — contrast

- The **wash** ground (34 sections) is now dark navy-slate `#2B3A4A`. The watercolour shows only through a 90 %
  veil and its engraved patterns are at half strength, so text never sits on a busy patch. Cream cards keep
  their colours.
- Text roles on dark grounds are tokens: `--on-dark`, `--on-dark-soft`, `--on-dark-accent`, `--art-on-dark`.
- Citation numbers: `--cite-on-light` (brick) on cream, `--cite-on-dark` (`#F8BBAD`) on wash/night and on the
  solid column ribbons; brackets and locators follow the same light/dark rule.
- Brick quote mark on a dark ground uses `--brick-light` (≥ 3:1 for its size).
- Chart numbers on a hatched fill sit on a small cream plate.
- Counter 26 px, ≥ 4.5:1 on every section. Kicker 26 px / 600, section code 20 px.
- Reading mode: the takeaway sentence was 14 px grey; now a 23 px band (this is where the "14 px" in the brief
  came from — on stage it was already 34 px, but with too little contrast on wash).

## Group 2 — space

- Content templates (`hero, cards, agenda, grid, compare, table, timeline, stats, process, chart, quote, refs,
  index, credits`) now lay out as a three-row grid (`src/styles/flow.css`): **head / zone / takeaway band**. The
  zone takes all free height and centres its content; blocks grow into it (capped so short content does not
  balloon). No more fixed `top:` offsets inside sections; longer or shorter text reflows.
- hero: bullets 38 px (31 px when the list is long), text column ~62 %, engraving in a fixed frame at full
  zone height with a slightly heavier line. The clipped giant words on hero sections (LOAN, CYCLE, TEP,
  CCSEP …) are removed (the brief's default when they cannot sit cleanly).
- stats: numbers 118 px (80 / 62 px for long values or four stamps), labels 26 px, bullets 32 px.
- cards 40 / 30 px (28 px in four- and five-card rows), compare 32 px, table text ≥ 22 px with the frame across
  the full width and rows centred, sources ≥ 20 px.
- chart: plot | bullets at 1.75 : 1, plot fills the box, bullets 32 px.
- quote: 80 px (68 / 60 px as the quotation gets longer), centred vertically; compass/seal at 35 % opacity.
- Corner ornaments sit beside the title, clear of the content zone.

## Group 3 — takeaway band

- The existing field **`foot`** of a section in `content/deck.yaml` is shown as a band at the bottom of the
  zone: Cormorant italic 600, 34 px, cream card with a brick (cream ground) or gold (wash) bar.
- No `foot` → no band. Adding a `foot:` line to any content section later makes the band appear by itself.
  Currently sections 14, 15, 33, 44, 74, 81, 83, 88, 96, 101 carry one.

## Group 4 — decoration and grounds

- Brick dots removed (code and CSS).
- Giant words: opacity tokens `--giant-op-paper` .20, `--giant-op-dark` .12, `--giant-op-night` .38; the cover
  word IBRD stays solid (it is the title). They stay in the background layer and never overlap text.
- Ground roles:

| Ground | Used for | Sections |
|---|---|---|
| cream (`paper`) | reading: hero, tables, stats, cards, charts, refs, credits | 68 |
| navy-slate (`wash`, formerly grey-blue) | emphasis inside chapters: agenda, compare, process, stats, timeline, index | 34 |
| night navy | cover, chapter openers, 3D galleries, cycle, thank-you | 17 |

- Kicker 26 px weight 600 (small caps of Cormorant lose their hairlines at 24 px / 500).
- Citation links: thinner solid underline at 45 % of the link colour; dotted only for "mapping inferred".
- Chapter openers: the section numbers of the part are small tags (the " · " separators are still in the text).
- The slate column ribbon on the navy ground has a gold underline so it does not dissolve into the ground.
- Kerning check: no letter-spaced words exist in the text. Spaced letters seen in PDF text extraction come from
  CSS letter-spacing on small caps (running head, cover lines); kept, with the running head tightened to .14em.

## Group 5 — cover

- Two columns on one grid: IBRD word over the title on the left, globe over the group block on the right. All
  four letters are clear in full 3D (`reports/cover-3d-after.png`). New 3D slot `cover` and its still
  `public/fallbacks/globe-cover.webp`.
- Title 70 px; group block 22 px in the soft tone, label 28 px.
- Lecturer line: the dashed warning style is drawn only while `meta.lecturer` contains a `[...]` placeholder
  and `DESIGN.showPlaceholderWarning` is true (`src/deck/design-config.js`). Writing the real name in
  `content/deck.yaml` turns it into a normal line automatically.

## Group 6 — charts

- Any series whose name starts with "IBRD" is **teal** `#2C6E6A` in every chart (Figures 1 and 7). Brick no
  longer encodes data; the line chart is slate.
- Stacked segments too thin for an inside label get an outside label with a short leader, spaced so labels
  never collide (Figure 7, Quy Nhon: 5.1 and 5.2). Every segment of every chart is now labelled.
- Hatch sits on a light slate tint so even a very short hatched bar shows; bars have a 4 px visual floor (the
  label always prints the data value). "Capacity building" (Figure 2) is now visible.
- Chart text ≥ 21 viewBox units (≥ 20 px on stage), captions 22 px, sources 20 px.

## Group 7 — display and effects

- Auto-light chip: 18 px, bottom-left (above the toolbar when it is shown), fades after 4 s, hidden in
  fullscreen. The downgrade logic is unchanged.
- **3D leak test** (full 3D, `__deck.go(14)` then `__deck.go(56)` after the cover): **not reproduced** — no rig,
  0 draw calls, during and after the transition (`reports/display-check.json`, `reports/leak-check-*.png`).
- `?lite=1`: no WebGL engine, no stroke-draw entrance, no textures; layout and colours unchanged.
  `prefers-reduced-motion` honoured (no draw animation, 1 ms transitions). `?preset=` and `?3d=` unchanged.
- Frame: at 1920×1080, 1366×768 and 1280×720 the stage stays 16:9, centred, letterbox symmetric in one colour
  (`rgb(5, 8, 15)`). The uneven black edges in the brief's screenshots came from the capture, not the page.

## Cannot be fixed without touching content

- **Dense tables:** none. Every table fits at ≥ 22 px.
- **Captions too long:** none overflow at ≥ 20 px.
- **Sections that stay airy because they hold little text:** quotes 45 and 108 (29–32 % empty below the
  centred quotation), timelines 5, 47, 98 (one short line per station), compare 107. Filling them would need
  more text or fewer, larger elements: a content decision.
- **Galleries (night, 3D):** layout unchanged (the 3D slot is fixed); 104 has three bullets beside a large
  empty 3D area.

## Changing it later (tokens)

All values live in `src/styles/tokens.css`; layout rules in `src/styles/flow.css`; per-section exceptions go in
`src/styles/overrides.css` (empty now, one rule per line with the reason).

- Grounds: `--wash`, `--wash-veil` (texture strength), `--wash-pattern`; text on dark: `--on-dark*`.
- Citations: `--cite-on-light`, `--cite-on-dark`, `--cite-underline`, `--fs-cite`.
- Type: `--fs-title`, `--fs-bullet`, `--fs-bullet-hero`, `--fs-bullet-side`, `--fs-card-h/-b/-b-dense`,
  `--fs-stat/-long/-xlong/-label`, `--fs-table/-dense`, `--fs-caption`, `--fs-source`, `--fs-takeaway`,
  `--fs-quote/-long/-xlong`, `--fs-ref`.
- Layout: `--flow-top`, `--flow-bottom`, `--flow-gap`, `--zone-gap`, `--hero-cols`, `--art-max-h`.
- Decoration: `--giant-op-paper`, `--giant-op-dark`, `--giant-op-night`.
- Cover warning: `src/deck/design-config.js` → `showPlaceholderWarning`.
- Re-measure after any change: `TAG=after node scripts/measure.mjs` (dev server running), then
  `python3 scripts/make-before-after.py`; display checks: `node scripts/verify-display.mjs`.
