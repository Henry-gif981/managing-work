# Coverage audit: Introduction, Chapter 1, Chapter 2

Method: I read each subsection of the paper (extracted with `pdftotext -layout`, tables checked against the rasterised pages) paragraph by paragraph, and listed every substantive claim, table, list, example and number. I then checked each one against the scene modules in `src/content/`. Beat ids are `scene#beat` (1-based, as in the URL hash).
Numbers come from `src/data/facts.ts`, tables and lists from `src/data/tables.ts`, and citations from `src/data/references.ts` (all 64 entries).

| Paper section (pages) | Scene | Beats | Tables / lists / figures included | Coverage |
|---|---|---|---|---|
| Cover (p. 1) | `ext-facade` | #1 | title, subtitle, NEU – School of Advanced Education Programs, course, Group 6 with all 5 names and IDs, class, lecturer, Hanoi 2026 | 100% |
| Introduction 1.1 (p. 4) | `f1-rationale-1` | #1 needs vs resources, MDBs · #2 stable capital, 2008 crisis and COVID-19, catalytic role · #3 beyond finance, shared challenges | – | 100% |
| Introduction 1.2 (pp. 4-5) | `f1-rationale-2` | #1 timeline 2007 · Dec 2009 · Jul 2017 · 2018 / IDA18 · Jul 2026 [1-4] · #2 cost ladder IDA < IBRD < commercial, capital markets [5], middle path · #3 Pham Binh Minh / MPI [6], appraisal and standards, closing sentence | timeline (5 milestones), cost ladder | 100% |
| Introduction 2 (pp. 5-6) | `f1-problem` | #1 problem paragraph · #2 the four questions | numbered list (4) | 100% |
| Introduction 3.1 (p. 6) | `f1-objectives` | #1 funding side / lending side (IPF, DPF, PforR, guarantees) · #2 project cycle (6 stages), co-financiers, quality | – | 100% |
| Introduction 3.2 (pp. 6-7) | `f1-objectives` | #3 TEP (2015–2021, US$231.25m counterpart) and CCSEP (2017–2024) [61; 63; 64] + Note · #4 Binh Duong / waterways [7; 8], four criteria, difficulties, lessons | – | 100% |
| Introduction 4 (pp. 7-8) | `f1-method` | #1 qualitative approach, WB sources · #2 Government / MoF / MPI (merged 2025), legal regulations · #3 case-study comparison with 4 criteria · #4 cross-checks, ICR Sep 2025, IEG Jan 2026 [57; 60; 63; 64] · #5 limitations and mitigation | criteria chips (4) | 100% |
| Introduction 5 (p. 8) | `f1-scope` | #1 subject, content scope · #2 spatial, time (2014–present, after 2017) | – | 100% |
| Introduction 6 (p. 9) | `f1-structure` | #1 three chapters as clickable floors + Conclusion/References | floor list (3 + exit) | 100% |
| Chapter 1 heading | `f1-ch1-title` | #1 sign + 1.1-1.4 list | subsection list | 100% |
| 1.1.1 (p. 10) | `f1-what` | #1 definition, 189 members, 5 institutions, World Bank [9], not profit-maximising · #2 role, mission, jobs · #3 borrowers, government guarantee, eligibility, IDA→IBRD | – | 100% |
| 1.1.2 (pp. 10-12) | `f1-wbg` | #1 five institutions paragraph · #2-#6 Table 1 rows IBRD, IDA, IFC, MIGA, ICSID · #7 IBRD/IDA · #8 IBRD/IFC · #9 MIGA/ICSID · #10 main public channel | **Table 1** (5 rows × 5 columns, source line [9; 10]) | 100% |
| 1.2 (pp. 12-13) | `f1-history-1`, `f1-history-2` | h1#1 four stages · h1#2 Bretton Woods Jul 1944, 1946, US$250m to France 1947 [11], first bonds · h1#3 Marshall Plan 1948 [10] · h1#4 1950s-1970s, IFC 1956, IDA 1960, McNamara [10] · h2#1 1980s-1990s structural adjustment, 1990s governance · h2#2 21st century, 2008/COVID, 2013 goals, mission [10] · h2#3 more than 80 years, same model | 4-stage timeline | 100% |
| 1.3.1 (p. 13) | `f1-gov` | #1 Board of Governors · #2 Board of Executive Directors (25 + President, constituencies, weighted votes) · #3 President, five-year renewable term, tie-break, Ajay Banga 2 June 2023 [12] · #4 summary sentence | three-tier diagram | 100% |
| 1.3.2 (pp. 14-15) | `f1-voting` | #1 IMF membership, shares, callable capital · #2 one share one vote, basic + share votes · #3 US 15-16%, Japan…UK, 85% and veto, 2008-2010 reforms · #4 Vietnam 0.21% (June 2026) [13], constituency | vote equation, hero number 0.21% | 100% |
| 1.3.3 (pp. 15-16) | `f1-funds` | #1 two sources, paid-in · #2 callable never called, equity, 2018 increase [14] · #3 bonds, investors, AAA · #4 sustainable/green bonds [15], repayments, net income, hybrid capital, shareholder guarantees · #5 IBRD vs IDA | IBRD/IDA comparison | 100% |
| 1.4 intro + 1.4.1 (pp. 16-17) | `f1-instruments` | #1 three instruments, IFL, E&S/procurement rules · #2 IPF [16], TEP and CCSEP used IPF · #3 DPF, prior actions [16], US$500m Dec 2009, signed 30 Dec 2009 [2] · #4 PforR 2012, third instrument since 1944 [17], DLIs [16] · #5 inputs / reforms / results | **Table 2** (3 rows × 4 columns, source [16; 17]) | 100% |
| 1.4.2 (pp. 17-18) | `f1-terms` | #1 IFL [18], three cost parts · #2 interest rate: LIBOR→SOFR, spread, pricing group, 2021 suspension [19] · #3 final maturity 2014 30→35, 50 years [20; 21] · #4 average maturity 18→20 [20] · #5 Short Maturity Loan Oct 2024, 7-year, 20 bps [22] · #6 front-end fee · #7 commitment fee · #8 borrower choices TEP 26/10 [23], CCSEP IBRD 29/10, IDA 25/5 · #9 commitment-fee consequence | **Table 3** (6 rows, sources per row, October 2026 note) | 100% |
| 1.4.3 (pp. 19-20) | `f1-safeguards` | #1 rules mainly for IPF, ESF 4 Aug 2016 / 1 Oct 2018 [24] · #2 Safeguard Policies, OP 4.12, ~7 years [25], TEP/CCSEP before 2018 · #3 the ten ESSs [24] · #4 ESS5 highlighted · #5 Procurement Framework 1 July 2016 [26], PPSD, TEP 2014 · #6 stricter than domestic, Nha Trang | **ESS list** (10 items; ESS5 focus glow) | 100% |
| lift-1-2 | `lift-1-2` | ride card "FLOOR 2 · CHAPTER 2 · HOW THE IBRD SUPPORTS PROJECT FINANCING" | – | – |
| Chapter 2 heading | `f2-ch2-title` | #1 sign + 2.1-2.4 list | subsection list | 100% |
| 2.1 intro + 2.1.1 (pp. 21-22) | `f2-cycle` | #1 fixed sequence, six-stage cycle [27], roles · #2-#7 Table 4 stages 1-6 · #8 restructuring TEP 2019 (+2 years), CCSEP 2022 (~US$45.6m cancelled) | **Table 4** (6 rows × 4 columns, source [27]) | 100% |
| 2.1.1 Vietnam paragraph (p. 22) | `f2-vn-procedures` | #1 two-lane diagram with the four domestic procedures · #2 joint delays, CCSEP ~5.5 months | two-lane diagram | 100% |
| 2.1.2 (pp. 22-23) | `f2-disbursement` | #1 four methods [28; 29] · #2-#5 Table 5 rows · #6 documents, minimum value, deadline up to 4 months [28], CCSEP used all four | **Table 5** (4 rows × 3 columns, source [28; 29]) | 100% |
| 2.1.2 counterpart (p. 23) | `f2-counterpart` | #1 counterpart funding, CCSEP uses · #2 TEP 231.25 / 731.25 [30] stacked bar + Note · #3 binding constraint, July 2019, no disbursement 2017-2018, on-lending debt | stacked bar | 100% |
| 2.1.3 IPF (pp. 23-24) | `f2-ipf` | #1 components, results framework, agency · #2 TEP three components, NPT boards, land/bidding delays | – | 100% |
| 2.1.3 DPF (p. 24) | `f2-dpf` | #1 policy matrix, prior actions, PIR · #2 PIR 1 US$500m Dec 2009 (first of two) [2], PIR 2 May 2011 87.3 + 262.7 [31], reforms [32; 33] · #3 power-sector DPF 2010 200 + 111.8 [34] | three operation cards (stat cards) | 100% |
| 2.1.3 PforR + closing (p. 24) | `f2-pforr` | #1 DLIs, verification, own systems · #2 IEG on DLIs [35] · #3 three instruments, IPF in Vietnam, risk shift | instrument chips | 100% |
| 2.2 intro + 2.2.1 (pp. 24-25) | `f2-prep` | #1 technical support vs commercial loan · #2 task team, EIRR 31.4% · #3 ESIA per city, RPF for all four [36], Preparation Advance [37] · #4 IEG on TEP smart-grid | EIRR hero number | 100% |
| 2.2.2 (pp. 25-26) | `f2-asa` | #1 ASA definition and outputs [38] · #2 2023 US$991m, 26/68/6 [39] · #3 RAS [38], middle/high-income [40] · #4 PIR policy dialogue [2], PPIAF US$350,000, GIZ, Decree 80/2014/ND-CP | proportional bar 26 / 68 / 6 | 100% |
| 2.2.3 (p. 26) | `f2-me` | #1 results framework, CCSEP three indicators (290,000 / 256,000 / 100%) · #2 three M&E levels [27] · #3 TEP PPAR ratings [41] · #4 CCSEP 2022 downgrade → ICR → IEG [63, p. iii; 64, p. 18] · #5 limits, attribution, M&E modest [63, p. 18; 64, p. 16] | numbered list (3 levels), rating chips | 100% |
| 2.3 intro + 2.3.1 (p. 27) | `f2-training-pmu` | #1 three levels · #2 PMUs, TEP three boards, CCSEP one PMU per province · #3 Open Learning Campus [42] · #4 staff retention, Phan Rang 10/12, weak PMU capacity | 10/12 stat | 100% |
| 2.3.2 (pp. 27-28) | `f2-training-knowledge` | #1 learning by doing · #2 2014 MOOC [43], e-procurement certification [44] · #3 TEP cumulative skills [41], Nha Trang safeguards | – | 100% |
| 2.3.3 (pp. 28-29) | `f2-institutional` | #1 institutions not individuals · #2-#6 Table 6 rows · #7 DPF at national level [2] · #8 TEP US$5.50m of 5.74m from NPT, US$0.24m IBRD (bar chart) · #9 CCSEP Component 4, late reforms, closing sentence | **Table 6** (5 rows × 3 columns), bar chart | 100% |
| 2.4 (p. 29) | `f2-three-forms` | #1 one package · #2-#4 Table 7 rows · #5-#7 the three reinforcement statements | **Table 7** (3 rows × 4 columns) | 100% |
| 2.4 closing (pp. 29-30) | `f2-package` | #1 dependence on the borrower, three constraints · #2 combination, bridge to Chapter 3 | constraint chips | 100% |
| lift-2-3 | `lift-2-3` | ride card "FLOOR 3 · CHAPTER 3 · THE IBRD AND SELECTED PROJECTS IN VIETNAM" | – | – |

**Result: Introduction, Chapter 1 and Chapter 2 are covered 100%.**

Every paragraph, all seven tables (1-7) with all their rows and columns, the ten ESSs, the four research questions, the three M&E levels and every Vietnam / TEP / CCSEP example appear on screen, with their `[n]` citations as clickable superscripts.

Notes and remarks:

- Sentences are shortened in places, but no claim is dropped. Each beat stays within about 90 words of body text (`npm run audit-content`).
- The only number shown in these chapters that comes from outside Chapters 1-2 is TEP's IBRD loan (USD 500.00 million, Section 3.2.2). It is used to complete the counterpart bar and is flagged on screen (see `docs/paper-inconsistencies.md`).
- Optional flags are unchanged and set: `f1-history-1`, `f1-history-2`, `f1-voting`, `f2-vn-procedures`, `f2-asa`, `f2-institutional`.
