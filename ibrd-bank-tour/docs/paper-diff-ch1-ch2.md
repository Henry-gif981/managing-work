# Paper diff: Introduction, Chapter 1, Chapter 2 (_9 → _10)

Method: `pdftotext -layout` of both versions, split into sentences and compared with `difflib.SequenceMatcher` (US$ and USD treated as equal). "Applied" means the tour now follows the _10 text, summarised under the new Floors 1-2 content policy.

| # | Where | Change in the _10 paper | Status |
|---|---|---|---|
| 1 | whole text | "US$" → "USD" | **applied**: facts print "USD …" on every floor |
| 2 | Intro 3.2 | "TEP, 2015–2021" / "CCSEP, 2017–2024": dash style only | omitted on purpose (scene `f1-objectives` removed) |
| 3 | Intro 5 | "Content scope :" → "Content scope:" (punctuation) | omitted on purpose (scene `f1-scope` removed) |
| 4 | Intro 6 | list bullets removed | applied (no visible change) |
| 5 | 1.1.2 | "Table 1" → "Table 1.1.1"; cell line breaks | **applied** (label, p. 14) |
| 6 | 1.3.1 | removed: "A few large shareholders appoint their own Executive Director, while most member countries are grouped into constituencies…" | **applied** (replaced by #7) |
| 7 | 1.3.1 | NEW: 189 members but 25 seats; six largest shareholders (US, Japan, China, Germany, France, UK) and Saudi Arabia have their own seats; constituencies with an Alternate Executive Director; Vietnam in a ten-country constituency (Brunei Darussalam, Fiji, Indonesia, Lao PDR, Malaysia, Nepal, Singapore, Thailand, Tonga, Viet Nam), represented as of November 2026 by John Patrick Antonysamy with Alternate Nakhafi Hassan (both Malaysia) | **applied**: new `f1-gov` beats 2-5 with ten country chips, Viet Nam in cyan |
| 8 | 1.3.2 | unchanged in _10 | omitted on purpose (scene `f1-voting` removed per update brief; facts 0.21%, 15-16%, 85% removed) |
| 9 | 1.4.1 | heading shortened to "Three main instruments"; "Table 2" → "Table 1.4.1"; instrument column now "IPF / DPF / PforR"; "USD 500 million" | **applied** |
| 10 | 1.4.1 | "…which Section 2.1.3 examines in practice" removed | **applied** |
| 11 | 1.4.2 | "IBRD Flexible Loan (IFL)" → "IBRD Flexible Loan"; "IFL" → "IBRD Flexible Loan" | **applied** |
| 12 | 1.4.2 | "LIBOR" → "the London Interbank Offered Rate (LIBOR)" | **applied** |
| 13 | 1.4.2 | "Table 3" → "Table 1.4.2"; Source column removed; source line "Authors' compilation from [18; 19; 20; 21; 22]"; the "as at October 2026" note dropped | **applied** |
| 14 | 1.4.2 | removed: TEP 26/10, CCSEP IBRD 29/10 and IDA 25/5 examples; removed "This links loan terms directly to the implementation problems discussed in Chapter 3" | **applied** (beat removed, sentence removed) |
| 15 | 1.4.3 | "OP 4.12" → "Operational Policy (OP) 4.12" | **applied** |
| 16 | 1.4.3 | removed "This is why TEP and CCSEP… followed the Safeguard Policies" | **applied** |
| 17 | 1.4.3 | the ten ESSs moved from a list into NEW Table 1.4.3 (Standard / Title), source [24] | **applied** (centre DataTable, ESS5 focus beat) |
| 18 | 1.4.3 | PPSD sentence without "as CCSEP did"; TEP sentence removed | **applied** |
| 19 | 1.4.3 | closing: "…projects can face delays or the cancellation of some contracts [57; 60]" | **applied** |
| 20 | 2.1 | "a fixed sequence of steps" → "specific mechanisms"; "This section examines mechanisms in turns…" | **applied** (`f2-cycle` beat 1 uses the fix-list text) |
| 21 | 2.1.1 | "Table 4" → "Table 2.1.1" | **applied** |
| 22 | 2.1.1 | TEP 2019 / CCSEP 2022 restructuring sentences → "Both projects examined in Chapter 3 were restructured during implementation." | applied in spirit: `f2-cycle` beat 8 uses the fix-list wording ("Projects can be restructured when scope, costs, or timing change.") |
| 23 | 2.1.1 | "(see Section 3.1.4)" removed; "Delays often arise at the joint…" → "where the two systems meet"; CCSEP 5.5-month example removed | **applied** (`f2-vn-procedures` caption) |
| 24 | 2.1.2 | "Table 5" → "Table 2.1.2"; "CCSEP used all four methods…" removed | **applied** |
| 25 | 2.1.2 | counterpart paragraph rewritten generically: typical costs, withdrawals conditional on domestic approvals [36], on-lending debt [36]; TEP/CCSEP examples removed | **applied** (single beat, fix-list text) |
| 26 | 2.1.3 | IPF: "(IPF)" spelled out; TEP example removed; DPF "(DPF)" spelled; "Vietnam's first IBRD loan" instead of the amount | **applied** |
| 27 | 2.1.3 | PforR: "(PforR)", "(DLIs)", "The Independent Evaluation Group (IEG)" spelled out | **applied** |
| 28 | 2.2.1 | TEP EIRR 31.4% removed; CCSEP example → "A project covering several cities, for example, may prepare an ESIA for each city…"; IEG sentence about "a transmission project in Vietnam" | **applied** (fix-list texts; beat 4 keeps the group's sentence naming TEP, as instructed) |
| 29 | 2.2.2 | ASA rewritten: three channels without 2023 amounts (USD 991m, 26/68/6% removed); RAS "customized technical advice"; Vietnam paragraph without PPIAF USD 350,000 | **applied** (proportional bar and its facts removed) |
| 30 | 2.2.3 | M&E text rewritten; CCSEP indicators, TEP PPAR ratings and CCSEP downgrade/re-rating replaced by generic sentences | **applied** |
| 31 | 2.3.1 | NPT boards, CCSEP PMUs and the Phan Rang 10/12 figures removed; "In one urban project, most PMUs were carried over…" [57] | **applied** |
| 32 | 2.3.2 | "TEP shows the cumulative effect" → "Skills also build up across projects"; "NPT's regional boards" → "the power transmission utility's regional boards"; Nha Trang → "one coastal city" | **applied** |
| 33 | 2.3.3 | old Table 6 (cases) → NEW Table 2.3.1 "Typical institutional reform activities in IBRD-financed projects", source [36; 41; 46; 58]; USD 5.50m / 0.24m and Component 4 sentences replaced by the generic counterpart sentence [46; 63] | **applied** (TOC lists the table as "Institutional reform activities in the two case studies"; the table caption itself was used) |
| 34 | 2.4 | "Table 7" → "Table 2.4.1"; source "Authors' compilation of Sections 2.1-2.3"; cell "a utility's asset management system" | **applied** |
| 35 | 2.4 | "The evidence in Chapter 3 shows…" → "In the projects reviewed in this study…"; "training stops at setup" → "reforms take effect only late"; "Chapter 3 tests this argument…" removed | **applied** |

Introduction 1.1, 3, 4 and 5 are unchanged in the _10 text except for punctuation, but their scenes were removed per the update brief (see `docs/update-log.md`).
