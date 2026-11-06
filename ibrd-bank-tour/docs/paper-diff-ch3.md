# Paper diff: Chapter 3, Conclusion, References (_9 → _10)

Method: both versions were extracted with `pdftotext -layout`, split into sentences and compared with `difflib.SequenceMatcher`. US$ and USD were treated as the same, and page-number lines were ignored.

## Real content differences

| # | Where | _9 | _10 | Action |
|---|---|---|---|---|
| 1 | Section 3.3.2, CCSEP restructuring | "The cancellations took effect on 23 November 2022, and the restructuring was completed on 20 February 2023" | same sentence | **Already on screen** (`f3-ccsep-cities`, "The 2022 restructuring" beat, fact `restructure-done`). Nothing to add. |

No other sentence in Chapter 3 or the Conclusion changed in content.

## Formatting-only differences (left as they are)

- **Table and figure numbers:**
  - Tables 8-20 became Tables 3.1.1-3.3.4.
  - Figures 1-8 became Figures 3.2.1-3.2.4 and 3.3.1-3.3.4, as listed in the new TABLE OF FIGURES.
  - These labels are updated in every source tag, caption and table title.
- **Page numbers:** the printed pages moved (Chapter 3 starts on p. 30, the Conclusion on p. 58, the References on p. 60). Every Floor 3 source tag and fact source now uses the new printed pages: the TOC page of its section, and for table and figure beats the TABLE OF FIGURES page.
- **Dashes:** en dashes became hyphens (e.g. "36–37%" → "36-37%", "pp. 8–10" → "pp. 8-10"). The values are unchanged.
- **Table layout:** cell line breaks and column header wrapping differ; the cell text is the same.
- **References:** the same 64 entries. [14] now reads "USD 13b" instead of "US$13b"; [23] and [62] have a hyphen instead of an en dash. The R panel and the exit wall now load the _10 list.
