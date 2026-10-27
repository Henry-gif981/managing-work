# ISSUES.md — points for the group to decide (nothing here was "fixed" in the content)

Source checked: `paper/IBRD - NHÓM 6(1).pdf` (69 pages). The website shows the paper as written; drafting notes are
simply not displayed. Each item says what the site does now.

## 1. Lecturer name, drafting notes, stray "|"

| Where | Text in the PDF | What the site does |
|---|---|---|
| Cover, p. 1 | `Lecturer : Phạm Thu Vân` | Shown as the highlighted placeholder **"Lecturer: [TO BE CONFIRMED]"** as instructed (also in the notes and print). **Note:** this new PDF now prints the name, and the old draft note "( quên mất tên cô r…)" is gone. To show it, change `meta.lecturer` in `content/deck.yaml` (one line) and run `npm run build`. |
| References [2], [12], [18], [21], [28], [29], [31], [32], [39], [46], [57] | `( lỗi )` | Removed from the References sections and source cards. |
| Reference [42] | `World Bank(lỗi )` | Removed (entry ends "… (P131558). World Bank"). |
| Reference [27] | `( check )` | Removed. |
| Reference [21] | `( check 3.4.1 )` | Removed — see item 8. |
| References [48]–[54], [56] | trailing `|` | Removed. These eight decree entries have **no URL** in the paper; their cards say so. |

`scripts/verify-content` fails the build if any of these strings reaches the stage.

## 2. Table / figure numbering

- In this PDF the tables run **1–21 sequentially** and figures 1–8. The overlap mentioned in the brief ("Table 1–9 and
  8–21", a duplicate "Table 8") was **not found in this version**; only one Table 8 exists (3.1.3, TEP vs SAHEP).
- **Table 17 (3.3.1) and Table 20 (3.3.3) are identical** (title, rows, source). The site shows Table 17 as a table
  (section 78) and keeps Table 20 verbatim in that section's notes and in reading mode, so the same timeline is not
  presented twice on stage.
- **Cross-references to tables that do not exist:** 3.3.3 ¶1 "(Table 3.3.1.1)" (means Table 17/20); 3.3.4 ¶2
  "As Table 3.3.3.1 shows" (means Table 21). Kept verbatim in the notes.
- Tables 18, 19, 21 use decimal commas / dot thousands (140,7; 86,33%; 290.000) while the rest uses decimal points.
  Cells are shown exactly as printed.
- **Figure 8** has no data labels; the text gives adjusted totals only for Quy Nhon (33.2) and Phan Rang–Thap Cham
  (97.9). The site does not chart Figure 8 (no estimated bars); section 87 states the printed numbers.

## 3. Table of contents vs body

- TOC lists 3.4.1–3.4.3 but there is **no "3.4" heading** in the body. The site labels the part
  "Achievements, limitations, recommendations · Sections 3.4.1 – 3.4.3".
- **1.3.3 "Source of funds…"** is in the body (p. 15) but missing from the TOC (shown as section 18).
- Introduction §6 names Chapter 3 "Case Studies of IBRD in Vietnam"; the chapter heading is "The IBRD and selected
  projects in Vietnam".

## 4. Introduction vs body

- Objectives 3.2 and Methodology describe **one** case (TEP); the body has **two** (TEP and CCSEP).
- Objective 3.2 calls TEP "a completed project fully financed by an IBRD loan", while 3.2.1 gives USD 231.25 million
  of borrower resources at appraisal (≈199.00 at closing). Section 8 shows the wording "described as fully financed".
- Methodology refers to "the four criteria set out in Section 3.2" (= Introduction §3.2, reads like Chapter 3.2).

## 5. TEP loan number

"IBRD loan **8417-VN**" (3.2.1, Tables 8 and 10) vs reference [41] "(**IBRD-84170**)". Both shown as printed.

## 6. Author–year citations not in the numbered list

Linked only when the mapping is unique; otherwise the source card shows **"Mapping inferred – to be confirmed"**
(dashed underline on stage). Full table with reasons in CITATIONS.md.

| Text in paper | Linked to | Confidence |
|---|---|---|
| Wes (2023) · Gelb et al. (2016) · World Bank Treasury (2020) · IBRD (2025) | [14] · [15] · [17] · [19] | certain |
| Government of Viet Nam (2013 … 2026) | [48]–[54] | certain |
| World Bank Treasury (n.d.-a) — fees | [16] | **inferred** |
| World Bank Treasury (n.d.-b) — Short Maturity Loan | [20] | **inferred** |
| World Bank (2014b) — maturity extension | [18] | **inferred** (no 2014a exists) |
| World Bank (2014) / (2014, Project Data Sheet) | [44] | **inferred** ([18], [21] are also World Bank 2014) |
| World Bank (2017) — Table 8 | [47] | **inferred** ([27], [33] are also 2017) |
| World Bank (2017, Annex 2, Table 2.1) — Table 18 note | [33] | **inferred** |
| World Bank (2022a, …) | [41] | **inferred** |
| World Bank (2022b, pp. 2-3) | [42] | **inferred** — [42] is authored by IEG |
| World Bank (2022c) — Table 6 | [43] | **inferred** (by elimination) |
| World Bank (2023, …) | [37] | **inferred** — [37] is IEG 2023 |
| World Bank, n.d.-c — ISRs (2.2.3) | [25] | **inferred, weakest** |
| "Source: projects.worldbank.org" (Tables 17–21, Figures 5–8) | not linked | not a numbered reference |

## 7. Figures that need your confirmation (shown as printed)

- **Decree 119/2026/ND-CP**: Table 9 "Issued 3 Apr 2026; **effective 1 Jan 2026**" — effective before issuance.
- **Transmission loss 2022**: 2.54% (IEG Table 2.3) vs 2.50% (IEG executive summary) — the paper explains this.
- **~USD 160 million cancelled vs USD 181.47 million gap** (TEP) — the paper says they are different concepts.
- **Figure 4** data for 2016 (2.36), 2017 (2.45), 2018 (2.44), 2020 (2.23) exist only as labels on the paper's figure;
  the chart uses them and says so in its data basis.

## 8. Reference [21] and the "check 3.4.1" note

[21] (World Bank 2014 press release on TEP) supports "26-year maturity with a 10-year grace period" (1.4.2, 3.4.1)
and NPT's US$231.25 million (2.1.2). The author's note suggests these were not verified; the site shows them with
[21] as printed. The source could not be opened from the build environment.

## 9. Arithmetic re-checked (Python, rounded)

| Check | Computed | Paper | Verdict |
|---|---|---|---|
| 318.53 / 500 | 63.71% | 63.7% | đã kiểm, khớp |
| 500 − 318.53 | 181.47 (36.29%) | 181.47 (36.3%) | đã kiểm, khớp |
| 731.25 − 517.53 | 213.72 (29.23%) | 213.72 (29.2%) | đã kiểm, khớp |
| 517.53 − 318.53 | 199.00 | ≈199.00 | đã kiểm, khớp |
| Table 11 totals | 731.25 / 517.53 | same | đã kiểm, khớp |
| Table 11 % column | 74.32 / 57.51 / 22.96 / 70.77 | 74.30 / 57.50 / 22.96 / 70.77 | **two rows differ by 0.01–0.02 pp** |
| Table 12 IBRD columns | 500.00 / 318.53 | same | đã kiểm, khớp |
| Table 13: 2.24 + 0.20 + 0.30 + 3.00 | 5.74 | 5.74 | đã kiểm, khớp |
| Table 14 % | 106.6 / 217.5 / 107.9 / 100.0 / 90.9 | same | đã kiểm, khớp |
| CCSEP 236.2 + 37.4; 46 + 190.2 | 273.6; 236.2 | same | đã kiểm, khớp |
| CCSEP shares | 86.33 / 16.81 / 69.52 / 13.67 | same | đã kiểm, khớp |
| Table 18 columns | 208.7 / 144.1 / 31.2 / 33.4 | same | đã kiểm, khớp |
| Table 18 note: 208.7 + 37.9 + 22.3 + 4.8 | **273.7** | 273.6 | rounding (paper says so) |
| Table 19 sums, differences, shares | 190.6 / 240.6 / 45.6 / 11.8 / 33.8 / −12.6 / 33; 79.22 / 14.21 / 65.00 / 20.78 | same | đã kiểm, khớp |
| 11.8 + "approximately 34" cancelled | 45.8 | "about US$45.6 million" (= 236.2 − 190.6) | consistent (34 is rounded 33.8) |
| 16.47 + 68.34; ÷ 236.2 | 84.81; 35.9% | ≈84.8; 36% | đã kiểm, khớp |
| Table 21 ratios | 64.0 / 38.0 / 19.9 / 60 | 64 / 38 / 20 / 60 | đã kiểm, khớp |
| Figure 7 labels per city | 58.4 / 72.0 / **88.0** / 55.3 | 58.4 / 72.0 / 87.9 / 55.3 | **Phan Rang labels sum to 88.0** |
| Figure 7 counterpart / IBRD labels | **37.5** / 46.0 | 37.4 / 46 | rounding / khớp |
| On-lent: 46 + IDA on-lent 55.8 | 101.8 (37.21%) | 101.8 (37.2%) | đã kiểm, khớp |
| IDA on-lent share 55.8 / 190.2 | **29.3%** | "about 29.4%" | minor |
| On-granted 134.4 / 273.6 | 49.1% | 49.1% | đã kiểm, khớp |
| SAHEP 155 + 19.60 | 174.60 | 174.60 | đã kiểm, khớp |
| ASA 26 + 68 + 6 | 100% | — | đã kiểm, khớp |
| Front-end fee 0.25% × 500 | 1.25 | 1.25 | đã kiểm, khớp |

## 10. Other observations

- [5] and [6] are **never cited in the body**; their cards say "Not cited in the body text".
- Reference [42] has only a generic URL (`https://ieg.worldbankgroup.org`).
- **No source excerpt could be verified**: every source host was refused by the network proxy (curl CONNECT 403;
  WebFetch `getaddrinfo ENOTFOUND`, tested on worldbank.org and cgdev.org). All cards show citation details only.
- `scripts/verify-content` lists 6 capitalised words that are paraphrases (e.g. "Graduates" for "graduated",
  "AAA-rated" for "AAA credit rating"); see `qa/verify-content.md`.
