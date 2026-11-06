# Coverage audit: Chapter 3, Conclusion, References

> Updated for the _10 paper: table and figure labels use the new numbering (Tables 3.1.1-3.3.4, Figures 3.2.1-3.3.4) and the beats' source tags use the new printed pages (Chapter 3 pp. 30-57, Conclusion pp. 58-59, References p. 60 onwards). The page numbers in the first column below are the _9 PDF pages. Content unchanged: Floor 3 still shows the full text (see `docs/paper-diff-ch3.md`).

Method: same as `docs/coverage-ch1-ch2.md`.

- **Text:** every paragraph of the extracted text (`pdftotext -layout`) was listed claim by claim and matched to beats.
- **Tables:** checked cell by cell against `src/data/tables.ts`.
- **Figures:** where the text does not state all values, they were read from the rasterised page images (`pdftoppm`, pp. 38, 41, 43, 49, 50, 52, 54).
- **Numbers:** 462 facts with sources in `src/data/facts.ts`. `npm run check-facts` runs 89 assertions, none failing.
- **Beat ids:** `scene#beat` (1-based).

| Paper section (PDF pages) | Scene | Beats | Tables / figures / lists | Coverage |
|---|---|---|---|---|
| Ch. 3 heading, 3.1 intro (p. 31) | `f3-ch3-title` | #1 sign + 3.1-3.4 list · #2 USD, appraisal vs closing amounts [45; 46; 41] | subsection list | 100% |
| 3.1.1 (p. 31) | `f3-1993` | #1 Oct 1993, two IDA credits (~70, 158.5), Hanoi office 1994, Đổi Mới [47] · #2 two decades, umbrella term "World Bank financing" | 2-item timeline | 100% |
| 3.1.2 (pp. 31-32) | `f3-ida-graduation` | #1 1 July 2017, IDA18 SDR 1.593 bn (~US$2.3 bn) [3] · #2 market-based pricing comparison · #3 TEP approved 7 Aug 2014 [45; 46] · #4 shift in lending mix, July 2026 reclassification [4] | 4-milestone timeline, terms comparison | 100% |
| 3.1.3 (pp. 32-33) | `f3-sahep` | #1 SAHEP P156849, 15 May 2017, SDR 114.3 m = US$155 m, 174.60, 19.60 [48] · #2 late IDA pipeline, institutional comparison · #3-#9 one row each | **Table 3.1.1** (7 rows × 3 columns) | 100% |
| 3.1.4 (pp. 33-35) | `f3-legal` | #1 two systems · #2 Decrees 38/2013 → 16/2016 → 56/2020, 114/2021 + 20/2023 [49-53] · #3 Decree 242/2025 + 119/2026, transitional rules [54; 55] · #4-#9 one milestone each · #10 ESF, TEP Category B [24; 45] · #11 bridge to the cases | **Table 3.1.2** as a timeline (6 entries incl. 242/2025 and 119/2026) | 100% |
| 3.2.1 (pp. 35-36) | `f3-tep-overview` | #1 P131558, IBRD-84170, IPF, dates, objective · #2 borrower, NPT, three boards, MoIT, 220/500-kV, regions · #3 731.25 = 500.00 + 231.25, US$1.25 m fee · #4-#8 key Table 3.2.1 rows | **Table 3.2.1** (all 9 rows shown on every table beat) | 100% |
| 3.2.2 cost (pp. 36-38) | `f3-tep-cost` | #1 Components 1 and 2 · #2 625 / 80 / 25 · #3-#7 Table 3.2.2 rows · #8-#10 Figure 3.2.2 bars · #11 bridge to Table 3.2.3 | **Table 3.2.2** (5 rows: 74.32 / 57.51 / 22.96 / 100.00 / 70.77), **Figure 3.2.2** grouped bars | 100% |
| 3.2.2 financing (pp. 37-38) | `f3-tep-financing` | #1-#5 Table 3.2.3 rows · #6 Figure 3.2.1 (500.00 vs 318.53 = 63.7%) · #7 289.03 + 28.01 + 0.24 + 1.25, NPT paid 5.50 of 5.74 [46] · #8 contractual disciplines [41] | **Table 3.2.3** (5 × 5), **Figure 3.2.1** stacked bars | 100% |
| 3.2.3 (pp. 39-40) | `f3-tep-impl` | #1 four strands · #2 AMS, counterpart-funded strands, cancellation · #3-#7 Table 3.2.4 rows · #8 learning platform, no trainee count [41] · #9 technology transfer, ~4 years | **Table 3.2.4** (5 rows) | 100% |
| 3.2.4 outputs (pp. 41-42) | `f3-tep-outputs` | #1 outputs, Ninh Binh · #2-#6 one bar each with callouts to new-lines, rehab-lines, transformer-capacity, smartgrid-500kv, smartgrid-220kv · #7 capacity +80% / +85.6%, 184.50 / 200.86 / 211.47 TWh | **Table 3.2.5** + **Figure 3.2.3** (horizontal bars, 100% target line) | 100% |
| 3.2.4 outcomes (pp. 42-44) | `f3-tep-outcomes` | #1 O&M 0.87 → 0.67 (target 0.83), unserved 4,875 → 817 MWh · #2-#6 Table 3.2.6 rows · #7 Figure 3.2.4 + 2.50% vs 2.54% Note · #8 losses, faults 42 → 29 and 135 → 159 · #9 renewables, Quang Ngai-Quy Nhon, Thuong Kon Tum · #10 EIRR 52.6% vs 31.4%, ENPV ~1,089 at 10% | **Table 3.2.6** (5 rows), **Figure 3.2.4** line 2015-2022 | 100% |
| 3.2.5 (pp. 44-45) | `f3-tep-gap` | #1 318.53 = 63.7%, 181.47 (36.3%), 517.53, 213.72, 231.25 → ~199.00 · #2 causes, ~160 cancellation = different concept · #3-#9 Table 3.2.7 rows · #10 schedule, ~4 years, 2019 restructuring, 2 years late, highly satisfactory · #11 ~2,500 households / 80 relocated, unresolved cases · #12 tariffs and investment | **Table 3.2.7** (7 rows) | 100% |
| 3.2.6 (p. 46) | `f3-tep-assess` | #1 strengths · #2 the four counterweights · #3-#6 the four criteria as doors · #7 ratings + Note · #8 three conclusions · #9 bridge to CCSEP | four "doors", PPAR rating chips | 100% |
| 3.3.1 (pp. 47-48) | `f3-ccsep-overview` | #1 ~10% treated, 771 m / 27% [36] · #2 P156143, April 2017, CCESP 2007-2014, four cities (4 pins) · #3 dates, 273.6, actors, provinces · #4-#7 Table 3.3.1 rows · #8 objective, Decree 80/2014, 290,000 / 256,000 / 100% | **Table 3.3.1** (6 rows) | 100% |
| 3.3.2 structure (pp. 49-51) | `f3-ccsep-structure` | #1 IPF, 273.6 = 236.2 (86.3%) + 37.4 (13.7%), 46.0 + 190.2 · #2-#4 Figure 3.3.1 parts · #5 IBRD and IDA terms · #6 Figure 3.3.2 · #7 49.1 / 37.2 / 13.7%, 29.4%, ~101.8, Binh Dinh · #8-#9 Components 1-4 and their sources · #10-#14 Table 3.3.2 rows · #15 base vs total cost note | **Figure 3.3.1** (stacked bar; the paper draws a pie), **Figure 3.3.2** (100% bars), **Table 3.3.2** (5 × 5 + note) | 100% |
| 3.3.2 cities and restructuring (pp. 51-54) | `f3-ccsep-cities` | #1 city allocations, IBRD by city · #2-#5 Figure 3.3.3 per city with callouts to the 4 pins · #6 designated accounts, four methods, three withdrawal conditions · #7 11.8 + ~34 (SDR 25.592 m), dates, NT-2.1 / NT-2.2 · #8-#12 Table 3.3.3 rows · #13 adjusted vs actual, Quy Nhon / Phan Rang · #14 Figure 3.3.4 + Note | **Figure 3.3.3** (stacked by city), **Table 3.3.3** (5 × 7), **Figure 3.3.4** (see gap below) | 100% of text and tables; Figure 3.3.4 partly (see gaps) |
| 3.3.3 (pp. 54-57) | `f3-ccsep-impl` | #1 18 Jan 2018 vs 3 Aug 2017, +18 months · #2 PAD 212.3, 16.47 + 68.34 ≈ 84.8 = 36% (bar) · #3 160.9 m signed, ~45%, 31 Oct 2022, 146.9 ≈ 62% · #4 Category A, OP 4.12, ratings · #5 delay causes · #6 1,486 / 329, Ngoc Hiep, 160/585, one third rejected, −35% / −43% · #7 Phan Rang 1,400/1,586 · #8 PMUs 10/12, PPIAF US$350,000, GIZ, 14 / 4 / 4 · #9 the Bank's advice · #10 PSMUs, late contracts, all 14 · #11 one bottleneck · #12 IBRD 16.8% / 14.2% | proportional bar | 100% |
| 3.3.4 results (pp. 56-58) | `f3-ccsep-results` | #1 ICR 12 Sep 2025, ICRR 23 Jan 2026, ratings, EIRR ~17.2% · #2-#6 Table 3.3.4 rows (callouts to houses, pipes, tank, road, bridge) · #7 ICR vs Annex 1 Note (288,030 / 242,406; revised targets) · #8 Nha Trang ~36-37% · #9 57.43%, 146.9 ≈ 62%, IBRD 19.5 of 46 · #10 climate resilience · #11 Nha Trang 30% embankments, 4.21 km · #12 institutions, 14 contracts for 1-3 years | **Table 3.3.4** (5 rows) | 100% |
| 3.3.4 Nha Trang (pp. 58-59) | `f3-ccsep-nhatrang` | #1 585 / 160, NT-2.1 / NT-2.2 · #2 138/469 (29%), 215, land ha, "technical reasons" + Note 464 · #3 complaint, 31 residents, 27 Aug 2023 · #4 222 / 19 / 18, revocation, Board 5 Feb 2024 · #5 dispute resolution, 2 Mar 2025 / 7 Aug 2025, report 16 Apr 2026 · #6 findings, Action Plan 3 Sep 2026 · #7 three causes, Bank standards vs local rules. The Nha Trang pin turns red (--bad) in this scene. | stat cards | 100% |
| 3.4 intro + 3.4.1 (p. 60) | `f3-eval-achievements` | #1 the package · #2 financial mobilization · #3 technical standards · #4 management standards | stat cards | 100% |
| 3.4.2 (pp. 61-62) | `f3-eval-limitations` | #1 slow disbursement · #2 procedural complexity · #3 counterpart funding · #4 safeguard gaps | chips | 100% |
| 3.4.3 (pp. 62-63) | `f3-recs-1`, `f3-recs-2` | r1#1 UMIC 2026 [4] · r1#2-#4 recommendations 1-3 · r2#1-#3 recommendations 4-6 | list of six | 100% |
| Conclusion 1.1-4 (pp. 64-65) | `lift-down` | #1 1.1 (floor 3) · #2 1.2 (floor 2) · #3 2 (floor 1) · #4 3 (G) · #5 4 (G, doors open) | glass panel | 100% |
| References (pp. 66-73) | `ex-sources` + R panel + PDF reference pages | #1 all 64 entries, searchable | – | 100% |
| Cover (p. 1) | `ex-thanks` | #1 thank-you, lecturer, 5 members with IDs; the door opens to daylight | – | 100% |

## Result

Chapter 3, the Conclusion and the References are covered **100% for text, tables and stated numbers**. Every figure is rebuilt as SVG except one gap:

- **Figure 3.3.4, adjusted bars for Dong Hoi and Nha Trang.** The paper's text gives adjusted totals only for Quy Nhon (33.2) and Phan Rang-Thap Cham (97.9), and the figure has no data labels. Plotting the other two bars would mean estimating from bar heights, which the content rules forbid. The tour therefore shows the plan bars for all four cities and the two stated adjusted values, with a visible `<Note>`. This is logged in `docs/paper-inconsistencies.md`.

## Remarks

- **Figure 3.2.4** values for 2016, 2017, 2018 and 2020 (2.36, 2.45, 2.44, 2.23) and all **Figure 3.3.3** segment values come from the data labels printed in the paper's figures. Their sources in `facts.ts` say so.
- **Figure 3.3.1** is a pie in the paper. It is redrawn as a single stacked bar with the same three values and shares.
- **Over-long beats:** the paper's Conclusion has 5 parts and the brief asks for exactly 5 lift-down beats. Beats 2 and 4 exceed ~90 words, so they use a two-column glass panel instead of extra beats (decision in the README).
- **Optional flags** are still set on `f3-1993`, `f3-legal` and `f3-ccsep-cities`. Nothing was removed.
