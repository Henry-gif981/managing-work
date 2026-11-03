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
