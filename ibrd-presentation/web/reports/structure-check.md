# Structure check

Main deck walk: 82 presses for 33 slides.

| Check | Result | Detail |
|---|---|---|
| main deck order = deck.config.yml (33 slides) | PASS | 1 5 7 11 14 18 19 23 27 28 32 42 44 46 54 56 59 65 70 73 77 80 89 91 92 99 103 104 106 107 108 109 119 |
| main deck ends on 119 (Thank you), → stops there | PASS | 119 · "33 / 33" |
| clicks per slide match deck.config.yml | PASS | total clicks 50 |
| presses to walk the main deck ≤ 100 | PASS | 82 presses (reveals + slide changes) |
| ← lands on the previous slide fully revealed | PASS | 14.2 |
| End (main) → 119 | PASS |  |
| Home (main) → 1 | PASS |  |
| A → Appendix divider | PASS | Appendix 1 / 88 |
| End (appendix) → last appendix slide | PASS | 118 |
| Home (appendix) → divider | PASS |  |
| M → back to the main slide that was left (59, same reveal) | PASS | 59.1 |
| keys 1–8 jump to the parts of the main deck / appendix | PASS | {"1":"1","2":"11","3":"27","4":"46","5":"77","6":"103","7":"106","8":"appendix"} |
| #/47 → appendix slide 47 | PASS | Appendix 34 / 88 |
| #/92 → main deck 92 (chart) | PASS | 25 / 33 |
| #/92-table → appendix table copy | PASS | Appendix 69 / 88 |
| #/5.2 → slide 5 at reveal 2 | PASS | 5.2 |
| appendix shows everything (no reveal steps) | PASS |  |
| Detail links hidden until the toolbar shows | PASS | opacity 0 → 1 |
| Detail → opens the appendix slide; Back to main returns | PASS | 88 → 89 |
| every configured Detail link is rendered | PASS | 5→47 / 7→3,4,6,8,9,10 / 14→13 / 19→21 / 23→24 / 28→29 / 32→31 / 42→41 / 44→43 / 54→55 / 56→58 / 59→60 / 65→64 / 70→71 / 77→78 / 80→84 / 89→87,88 / 91→97,98 / 92→92-table / 99→98 |
| Overview: main deck by part + collapsed appendix | PASS | {"main":33,"appx":88} |
| Overview tile opens its slide (60) | PASS |  |
| Contents: part entry opens its first slide (77) | PASS |  |
| ?steps=all shows a main slide fully at once | PASS |  |
| all 119 original sections + appendix-only slides reachable | PASS | 119 + 2 |
| clock off by default (C does nothing) | PASS |  |
| clock with ?clock=1: runs, first mark (slide 7, 2:00) marked early | PASS | {"on":true,"t":"00:01","first":"early"} |
| text: only sections 1, 7, 32, 42, 92 differ from the baseline | PASS | 1, 7, 32, 42, 92 |
| text: 92-table is identical to the old 92 | PASS |  |
| no console errors or warnings | PASS |  |
