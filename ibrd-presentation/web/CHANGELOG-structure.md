# CHANGELOG — structure pass (20-minute deck)

A **main deck of 33 slides** for the 20-minute talk, every other slide kept in an **appendix** (nothing deleted),
reveal clicks regrouped to speaking pace, and the few text edits that were explicitly requested. Look, colours and
fonts are unchanged. Everything structural comes from one file: **`content/deck.config.yml`**.

Repo in brief (start of the pass): Vite project in `ibrd-presentation/web`; content in `content/deck.yaml` (+ tables,
charts, verbatim paper in `content-ibrd.md`), compiled by `scripts/build-content.mjs` into `src/data/deck.json`;
slides are templates (`src/deck/render.js`), the engine is `src/deck/app.js` (hash `#/n.step`, keys, overview,
contents, notes, drawer, 3D), print/PDF in `src/deck/print.js`; `IBRD-Presentation.html` is only a build output.

## Result

| Condition | Status |
|---|---|
| Main deck = 33 slides in the configured order, counter "k / 33", ends on Thank you (119), → stops there | PASS |
| Appendix holds all 86 other originals + the table copy of 92 + the divider (88), counter "Appendix k / 88" | PASS |
| All 119 original sections reachable (and `appendix`, `92-table`) | PASS |
| Clicks per main slide = the requested numbers (total 50; walk = 82 presses) | PASS |
| Keys A, M, Home, End, 1–8; `#/n` and `#/n.step` with original IDs; Detail → links; Overview; Contents | PASS |
| `?steps=all`, `?preset=static&3d=0`, `?only=n` (print), S, N, G, F, T, R, Esc, ? unchanged | PASS |
| Text: only sections 1, 7, 32, 42, 92 differ; the table copy `92-table` is identical to the old 92 | PASS |
| Backup PDFs: `exports/main-deck.pdf` 33 pages, `exports/appendix.pdf` 88 pages (16:9, every reveal shown) | PASS |
| Build, `npm run check`, `npm run qa`, no console errors | PASS |

All checks: `node scripts/verify-structure.mjs reports/text-pre-structure.json` → **30/30** (`reports/structure-check.md`).
Screenshots: `screenshots/main/01.png … 33.png` (position in the main deck), `screenshots/appendix/` (13 slides).

## (a) Main deck, in order (33 slides)

| # | ID | Part | Template | Title | Clicks before → after |
|---|---|---|---|---|---|
| 1 | 1 | Introduction | cover | Cover | 0 → 0 |
| 2 | 5 | Introduction | timeline | Vietnam's shift from IDA to IBRD | 5 → 2 |
| 3 | 7 | Introduction | cards | Research problem and four questions | 4 → 2 |
| 4 | 11 | Chapter 1 · Overview of the IBRD | chapter | Overview of the IBRD | 0 → 0 |
| 5 | 14 | Chapter 1 · Overview of the IBRD | compare | How the IBRD differs | 7 → 2 |
| 6 | 18 | Chapter 1 · Overview of the IBRD | process | Where the money comes from | 6 → 2 |
| 7 | 19 | Chapter 1 · Overview of the IBRD | gallery | Three lending instruments | 3 → 3 |
| 8 | 23 | Chapter 1 · Overview of the IBRD | stats | Loan terms: long maturities | 7 → 1 |
| 9 | 27 | Chapter 2 · How the IBRD supports project financing | chapter | How the IBRD supports project financing | 0 → 0 |
| 10 | 28 | Chapter 2 · How the IBRD supports project financing | cycle | The six-stage project cycle | 6 → 1 |
| 11 | 32 | Chapter 2 · How the IBRD supports project financing | hero | Counterpart funding as the binding constraint | 5 → 3 |
| 12 | 42 | Chapter 2 · How the IBRD supports project financing | stats | Reform depends on the borrower | 6 → 2 |
| 13 | 44 | Chapter 2 · How the IBRD supports project financing | cards | How the three forms reinforce one another | 4 → 2 |
| 14 | 46 | Chapter 3 · Case study 1 · TEP | chapter | The IBRD and selected projects in Vietnam | 0 → 0 |
| 15 | 54 | Chapter 3 · Case study 1 · TEP | hero | TEP: project overview | 5 → 2 |
| 16 | 56 | Chapter 3 · Case study 1 · TEP | stats | The planned financing envelope | 6 → 1 |
| 17 | 59 | Chapter 3 · Case study 1 · TEP | chart | Appraisal vs closing, in two pictures | 2 → 2 |
| 18 | 65 | Chapter 3 · Case study 1 · TEP | chart | Output achievement (%) | 3 → 1 |
| 19 | 70 | Chapter 3 · Case study 1 · TEP | gallery | Commitment vs disbursement | 7 → 2 |
| 20 | 73 | Chapter 3 · Case study 1 · TEP | compare | TEP: overall assessment | 6 → 2 |
| 21 | 77 | Chapter 3 · Case study 2 · CCSEP | hero | CCSEP: project overview | 5 → 2 |
| 22 | 80 | Chapter 3 · Case study 2 · CCSEP | gallery | A blended financing package | 7 → 2 |
| 23 | 89 | Chapter 3 · Case study 2 · CCSEP | stats | Slow start, slow disbursement | 6 → 2 |
| 24 | 91 | Chapter 3 · Case study 2 · CCSEP | stats | Resettlement: the main bottleneck | 6 → 2 |
| 25 | 92 | Chapter 3 · Case study 2 · CCSEP | chart | Key performance indicators at 31/10/2022 | 0 → 1 |
| 26 | 99 | Chapter 3 · Case study 2 · CCSEP | cards | Three direct causes | 3 → 3 |
| 27 | 103 | Chapter 3 · Achievements, limitations, recommendations | gallery | Recommendations (1/2) | 3 → 2 |
| 28 | 104 | Chapter 3 · Achievements, limitations, recommendations | gallery | Recommendations (2/2) | 3 → 2 |
| 29 | 106 | Conclusion | cards | Three pillars, one package | 3 → 1 |
| 30 | 107 | Conclusion | compare | What the two cases show | 4 → 2 |
| 31 | 108 | Conclusion | quote | Quote | 0 → 0 |
| 32 | 109 | Conclusion | compare | Significance and limitations | 6 → 1 |
| 33 | 119 | Conclusion | thanks | Thank you | 0 → 0 |

Reveal clicks on the main deck: **128 → 50**. Presses to walk the whole main deck with → (reveals + 32 slide changes): **82** (target ≤ 100).

## (b) Appendix → group

The appendix opens with an **Appendix** divider (ID `appendix`) that links to each group; then 87 slides in their original order. Counter: "Appendix k / 88".

| Group (label from the existing chapter labels) | Parts | Slides (IDs) |
|---|---|---|
| Introduction | cover, intro | 2, 3, 4, 6, 8, 9, 10 |
| Chapter 1 | ch1a, ch1b, ch1c | 12, 13, 15, 16, 17, 20, 21, 22, 24, 25, 26 |
| Chapter 2 · How the IBRD supports project financing | ch2 | 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 45 |
| Chapter 3 · Case study 1 · TEP | ch3, tep | 47, 48, 49, 50, 51, 52, 53, 55, 57, 58, 60, 61, 62, 63, 64, 66, 67, 68, 69, 71, 72, 74 |
| Chapter 3 · Case study 2 · CCSEP | ccsep | 75, 76, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 90, 92-table, 93, 94, 95, 96, 97, 98 |
| Recommendations and conclusion | lessons, concl | 100, 101, 102, 105, 110 |
| References and sources | back | 111, 112, 113, 114, 115, 116, 117, 118 |
## (c) Reveal steps — how they were grouped

The number of clicks for every main slide is in `deck.config.yml` (`clicks`). Grouping never changes an element or its
order, only which elements appear together (`src/deck/render.js`, `stepGroups`):

- **compare** (14, 73, 107, 109): one column per click (14's takeaway comes with the second column). 109 asked for 1
  click: both columns at once.
- **stats** (23, 42, 56, 89, 91) and **gallery with stamps** (70, 80): click 1 = all stamps, click 2 = all bullets;
  23 and 56 (1 click) show stamps and bullets together.
- **timeline / process**: 5 = milestones 1–2 / 3–5; 18 = stations 1–2 / stations 3–4 + bullets (explicit `groups`);
  28 (cycle) all six stages in one click.
- **cards**: 7 = Q1–Q2 / Q3–Q4 + the new method/preview line; 44 = the three cards / the takeaway; 99 = one cause
  per click; 106 = all at once.
- **59**: the two figures became reveal steps: click 1 = Figure 1 + the "IBRD at closing" bullet, click 2 = Figure 2
  + the "Capacity building" bullet (explicit `groups: [[3, 1], [4, 2]]`). Charts on other slides are now reveal steps
  too, but they only matter on the main deck (65, 92: one click shows the chart).
- **hero** 32 (3 clicks: 1 / 2 / 2 bullets), 54 and 77 (2 / 3 bullets); **gallery** 19 keeps IPF / DPF / PforR,
  103 and 104 = 1 / 2 bullets.
- Every requested count was met exactly; nothing had to be approximated.
- The appendix always shows everything; **S** (step / show all) works as before.

## (d) Text changes (old → new)

| Slide | Old | New | Note |
|---|---|---|---|
| 1 | `Lecturer: [TO BE CONFIRMED]` (dashed placeholder box) | `Lecturer: ThS. Phạm Thu Vân` (normal cover line; the warning box disappears by itself) | The paper's cover reads "Lecturer : Phạm Thu Vân" — **without "ThS."**; the title was added as requested. |
| 7 | — | Band with the last click: "Method: qualitative, mainly secondary data · Scope: Vietnam, 2014 to the present · Cases: TEP and CCSEP" / "Preview: the binding constraints lie mainly on the domestic side, not in the availability of IBRD money." | **Needs the group's approval**: rephrases sections 9, 10 and 108. Field `extra` in deck.yaml. |
| 32 | — | small line "TEP and CCSEP are introduced in Chapter 3." | Field `note` in deck.yaml. |
| 42 | — | small line "TEP and CCSEP are introduced in Chapter 3." | Field `note` in deck.yaml. |
| 92 (main) | Table 21 (caption, 5 rows × 4 columns, source) | Chart "Actual as % of PAD target": Direct beneficiaries 64%, People with access to sewer connections 38%, Cost recovery level 98%, Roads (km) 20%, Bridges 60%; dashed "Target (PAD)" line at 100%; lowest bar (Roads, 20%) in ochre; "Source: projects.worldbank.org"; same title | Values and names are read from the table's "Ratio" column at build time (no retyping). One click. |
| 92-table (appendix) | — | exact copy of the old slide 92 (table, number formats as printed) | New ID `92-table`. |

New navigation text outside the slides (not part of any slide's text): "Detail → …" links, "← Back to main · k / 33",
the counter "k / 33" / "Appendix k / M", toolbar buttons "Appendix" and "Main", the help lines, and the Appendix
divider (title "Appendix" + one card per group with its slide range).

## (e) "Detail →" links

Shown at the right, just above the toolbar, only while the toolbar is visible (mouse moved) or on hover; clicking
opens the appendix slide and remembers the main slide; **← Back to main** (bottom-left in the appendix) or **M**
returns to it at the same reveal.

| Main slide | → Appendix |
|---|---|
| 5 | 47 |
| 7 | 3, 4, 6, 8, 9, 10 |
| 14 | 13 |
| 19 | 21 |
| 23 | 24 |
| 28 | 29 |
| 32 | 31 |
| 42 | 41 |
| 44 | 43 |
| 54 | 55 |
| 56 | 58 |
| 59 | 60 |
| 65 | 64 |
| 70 | 71 |
| 77 | 78 |
| 80 | 84 |
| 89 | 87, 88 |
| 91 | 97, 98 |
| 92 | 92-table |
| 99 | 98 |

## (f) Content problems SEEN BUT NOT FIXED (for the group when the content is final)

- **Chapter openers 11, 27, 46 — "In this part" labels** are generated from the section codes of the slides that
  follow, so they show the paper's numbering gaps: 11 lists only "1.1.1 · 1.1.2 · 1.2" (1.3 and 1.4 sit in other
  parts); 27 lists "2.2 · 2.2.2 · 2.2.3 · 2.3 · 2.3.2" (no 2.2.1 / 2.3.1 labels on slides); 46 lists
  "3.1.1 · 3.1 · 3.1.3 · 3.1.4" (one slide is labelled "3.1" between 3.1.1 and 3.1.3).
- **Number formats mixed**: Tables 18, 19 and 21 use decimal commas / dot thousands (140,7; 86,33%; 290.000; 4,38),
  the rest decimal points. On slide 92's chart the ratios are whole percentages, so the conflict is only in the
  appendix table (kept as printed).
- **Table 21 ratios vs its own columns**: Roads 4,38 / 22 = 19.9% (printed 20%); Direct beneficiaries 185.559 /
  290.000 = 64.0%; consistent otherwise.
- **Table 17 and Table 20 are identical** (3.3.1 and 3.3.3); text cross-references "Table 3.3.1.1" and
  "Table 3.3.3.1" point to tables that do not exist under those numbers.
- **Figure 7**: Phan Rang–Thap Cham labels sum to 88.0 while the total is printed 87.9; counterpart labels sum to
  37.5 (printed 37.4).
- **Table 11 % column**: two rows differ from the computed value by 0.01–0.02 pp (74.30 vs 74.32; 57.50 vs 57.51).
- **TEP loan number**: "8417-VN" (3.2.1, Tables 8, 10) vs "IBRD-84170" in reference [41].
- **Introduction vs body**: the methodology and objective 3.2 describe one case (TEP), the body has two; objective
  3.2 calls TEP "fully financed by an IBRD loan" while 3.2.1 shows US$231.25 million of borrower funds. The new
  slide-7 line says "Cases: TEP and CCSEP" (as in the body).
- **Decree 119/2026/ND-CP**: "issued 3 Apr 2026; effective 1 Jan 2026" (effective before issue).
- **Transmission loss 2022**: 2.54% (Table 2.3) vs 2.50% (IEG summary) — explained in the paper.
- **IDA on-lent share**: 55.8 / 190.2 = 29.3%, printed "about 29.4%".
- **References**: [5] and [6] never cited in the body; [42] has only a generic URL; several author–year citations
  map to a numbered reference only by inference (see CITATIONS.md); "Source: projects.worldbank.org" is not a
  numbered reference.
- **TOC vs body**: no "3.4" heading in the body; "1.3.3" missing from the paper's TOC; Chapter 3 named differently in
  Introduction §6.
- **Lecturer title**: the paper has no "ThS." (see (d)).

## (g) Changing the structure later

Edit **`content/deck.config.yml`**, then `npm run build` (or just `node scripts/build-content.mjs` with the dev server):

- **Add / remove / reorder a main slide**: add, delete or move a `{id: N, clicks: K}` line under a part. Whatever is
  not in `main` is in the appendix automatically, in original order and in its group. The build fails if an ID does
  not exist or appears twice, or if any of the 119 sections ends up unreachable.
- **Change the pace**: edit `clicks`. Optional `groups` lists which of the template's original reveal steps appear
  together on each click (numbers as the template counts them: cards/bullets/stations in order; on chart slides the
  figures come after the bullets). Without `groups` the rule in (c) applies.
- **Parts and keys 1–7**: the `main` parts, in order (8 = appendix). Their labels feed Contents and Overview.
- **Detail → links**: `details: {main ID: [appendix IDs]}`.
- **Appendix groups**: `appendix.groups` maps paper parts to the divider's groups.
- **Appendix-only copies**: `extra` (`92-table` = copy of 92 placed after 92).
- **92 as a chart**: `variant: chart` on its main entry; remove it to show the table on the main deck again.
- **Clock**: `clock.enabled: true` (or open the deck with `?clock=1` for a rehearsal), key **C**; marks and tolerance
  are in the same block. Dots: green = within ±30 s, blue = early, orange = late (checked when leaving slides 7, 23,
  44, 73, 99, and on reaching 119).
- **Text edits** stay in `content/deck.yaml` (`meta.lecturer`, slide 7 `extra`, slides 32/42 `note`).
- **Backup PDFs**: `npm run pdf:decks` → `exports/main-deck.pdf`, `exports/appendix.pdf` (page counts checked);
  `npm run pdf` still prints all 119 originals; `npm run standalone` rebuilds the single-file HTML.
- **Checks**: `npm run structure:check` (= `node scripts/verify-structure.mjs`; pass a baseline text JSON to compare).
