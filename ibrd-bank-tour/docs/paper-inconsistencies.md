# Paper inconsistencies and clarifications (Introduction, Chapters 1-2)

`npm run check-facts` runs 31 checks over `src/data/facts.ts` and `src/data/tables.ts`; **none fail**.
The items below are not arithmetic failures. They are places where the paper needs a clarification on screen, or where a number shown in Chapters 1-2 comes from elsewhere in the paper.

| # | Where | What the paper says | How the tour shows it |
|---|---|---|---|
| 1 | Introduction 3.2 (p. 6) vs Section 1.4.3 (p. 20) | TEP is dated "2015–2021" in 3.2; Section 1.4.3 says "TEP, approved in 2014". | Both are shown as written. A `<Note>` on `f1-objectives` beat 3 explains that one is the approval year and the other the implementation period. |
| 2 | Section 2.1.2 (p. 23) | Gives only "NPT provided US$231.25 million of the planned US$731.25 million". The IBRD amount is not stated in Chapter 2. | The stacked bar on `f2-counterpart` also uses the IBRD loan of USD 500.00 million from Section 3.2.2 (p. 36), and a `<Note>` says so. `check-facts` verifies 231.25 + 500.00 = 731.25. |
| 3 | Table 3 note (p. 18) | "Terms are reviewed annually and may change; figures are as at October 2026." | Shown in the Table 3 caption. |
| 4 | Section 2.2.3 (p. 26) | The last sentence ("…can have weak results frameworks") has no full stop. | Typographic only; the tour adds the full stop. |
| 5 | Section 1.3.2 (p. 14) | "around 15-16 percent" is a range, not a single value. | Stored as the string fact `us-votes` = "15-16" with unit %, and shown as "around 15-16%". |
| 6 | Introduction 1.2 (p. 5) | The cost comparison of IDA credits, IBRD loans and commercial loans is qualitative, with no figures. | The "cost ladder" on `f1-rationale-2` uses no numbers, only the paper's ranking. |

## Chapter 3, Conclusion (added with the Chapter 3 content)

`npm run check-facts` now runs 89 checks (Chapters 1-3), and **none fail**. Some relations hold only within the paper's own rounding, so the check uses a tolerance; those cases are listed below and shown on screen where it matters.

| # | Where | What the paper says | How the tour handles it |
|---|---|---|---|
| 7 | Figure 4 note (p. 43) | The IEG executive summary gives 2.50% for 2022 transmission losses, while IEG Table 2.3 gives 2.54%. | The chart and Table 15 use 2.54%. A `<Note>` on `f3-tep-outcomes` beat 7 shows both. |
| 8 | Figure 4 (p. 43) | The values for 2016, 2017, 2018 and 2020 appear only as data labels in the figure. | Read from the page image (2.36, 2.45, 2.44, 2.23). The fact sources say "read from the page image". |
| 9 | Table 19 (p. 53) | At closing, 146.9 (WB) + 43.4 (counterpart) = 190.3, but the table gives a total of 190.2. | The paper's rounding; checked with a ±0.1 tolerance. The table shows the paper's values. |
| 10 | Table 18 note (p. 51) | Base cost 208.7 + contingencies 37.9 + VAT 22.3 + capitalized fees 4.8 = 273.7, against a total of 273.6. | The paper says "minor differences in totals are due to rounding in the PAD". Checked with a ±0.1 tolerance; the note text is shown on screen. |
| 11 | Section 3.3.2 (p. 52) vs Table 19 | The text gives the IDA cancellation as "approximately USD 34 million"; Table 19 gives a change of −33.8. 11.8 + 34 = 45.8, against "about 45.6". | Both values are shown as written. The check uses a ±0.25 tolerance, and "approximately" is kept on screen. |
| 12 | Figure 7 (p. 52) | Each city's stacked segments sum to its total within ±0.1. Dong Hoi: 28.7 + 7.2 + 14.3 + 8.2 = 58.4 ✓. Nha Trang: 72.0 ✓. Phan Rang: 52.1 + 13 + 10.2 + 12.7 = 88.0 against 87.9. Quy Nhon: 55.3 ✓. | ±0.1 rounding; the figure plots the paper's labels. |
| 13 | Figure 8 (p. 54) | Adjusted city totals are stated in the text only for Quy Nhon (33.2) and Phan Rang-Thap Cham (97.9). The figure has no data labels. | Only those two adjusted bars are drawn ("n/s" for the others), with a visible `<Note>`. Not estimated. |
| 14 | Figure 5 (p. 49) | Drawn as a pie chart in the paper. | Redrawn as a stacked bar with the same values and shares (16.8 / 69.5 / 13.7%). |
| 15 | Section 3.3.4 (p. 58) | Nha Trang affected households: 469 (ICR/IEG) against "about 464" (Management Response). | Both shown; a `<Note>` on `f3-ccsep-nhatrang` beat 2. |
| 16 | Section 3.2.5 (p. 44) | The 181.47 gap between commitment and disbursement against "approximately USD 160 million" of savings cancelled (IEG). | The paper itself explains these are different accounting concepts; both are shown in Table 16. |
| 17 | Section 3.2.6 | The paper gives no separate rating per evaluation criterion for TEP. | The four "doors" group the paper's remarks under the four criteria. The ratings shown are the PPAR's overall ratings, with a `<Note>`. |
| 18 | Conclusion 1.2 (p. 64) | "required more counterpart funding than planned (USD 43.4 million against USD 37.4 million)": 43.4 is actual spending at closing (Table 19), against a planned 37.4. | Shown as written. |
