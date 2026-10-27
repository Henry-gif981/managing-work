# IBRD and its Development Project Financing Activities in Vietnam — presentation

Project Finance · Group 6 · NEU, Investment Economics 65.
Deck built from the group paper `src/Bản sao của IBRD - NHÓM 6 (2).pdf` (the only source of truth) in the style of
`src/Mãu IBRD final.jpg` (style only — no image or text reused).

| File | What it is |
|---|---|
| `IBRD-Presentation.pptx` | **Main deck**: 123 visible slides + 85 hidden source-card pages, PowerPoint Morph transitions, native (editable) tables and charts, clickable citations |
| `IBRD-Presentation.pdf` | Back-up PDF of the visible slides (rendered with LibreOffice — no transitions, no hidden cards) |
| `fonts/` | Cormorant Garamond + Be Vietnam Pro (TTF) and their SIL OFL 1.1 licences |
| `DESIGN.md` | Design tokens taken from the style reference (colours, type, grid, motion) |
| `SLIDES.md` | Every slide: kind, paper section/pages, content, Morph object names, transition length |
| `CITATIONS.md` | [n] → slides citing it → locators from the paper → status; author–year mapping table |
| `ISSUES.md` | Points for the group to decide (lecturer name, numbering, mapping, figures to confirm, arithmetic check) |
| `content/content-ibrd.md` | The paper extracted to text, section by section, paragraph by paragraph, with page numbers |
| `content/deck.yaml` | The single slide plan (bullets, tables, charts, notes ids) the deck is generated from |
| `qa/` | One rendered image per visible slide (LibreOffice) used for visual checking |

## 1. Install the fonts first (every presenting computer)

The deck uses **Cormorant Garamond** (titles) and **Be Vietnam Pro** (text). Without them PowerPoint substitutes a
serif/sans (the theme carries Garamond- and Calibri-class PANOSE hints), which changes line breaks.

- **Windows:** open `fonts/`, select all `.ttf` files → right-click → **Install for all users**. Restart PowerPoint.
- **macOS:** double-click each `.ttf` → **Install Font** (Font Book). Restart PowerPoint.
- **Embed them in the file (recommended, after installing):** PowerPoint for Windows → *File → Options → Save →
  ☑ Embed fonts in the file → ◉ Embed all characters* → save. On Mac: *PowerPoint → Preferences → Save → Embed fonts*.
  This could not be done safely by the build script (python-pptx cannot write PowerPoint's embedded-font format),
  so the delivered file does **not** contain embedded fonts.

## 2. Presenting

- **Morph needs PowerPoint 2019, PowerPoint 2021/2024 or Microsoft 365 (Windows or Mac).** Keynote, Google Slides,
  LibreOffice and PowerPoint 2016 show a plain **fade** instead (the file carries a fade fallback, so it opens cleanly).
- `F5` start from the beginning · `Shift+F5` from the current slide · `→`/`Space`/click next · `←` previous ·
  type a number + `Enter` to jump to that slide · `B`/`W` black/white screen · `Ctrl+L` laser pointer · `Esc` end.
- **Citations:** every number such as **[33]**, **[44; 41; 37]** or **[33, Annex 3, para. 21]** is clickable — each
  number separately. It opens that source's card (full reference, URL, what the slide cites it for with the paper's
  sentence, locator and paper section). On the card click **← Back** to return to the slide you came from, or
  **Index of sources** for the grid of all 58 sources. Author–year citations in table/figure source lines
  (e.g. *World Bank (2022a, Annex 3, Table 3.2, p. 49)*) are clickable too.
- Source cards are **hidden slides**: plain `F5` never shows them; hyperlinks still open them in Slide Show.
- Agenda (slide 2): each part is clickable and jumps to its chapter opener.
- Speaker notes hold the paper's **full text** for each slide, verbatim, with page and paragraph numbers.

**Quick link test (1 minute):** open the deck in PowerPoint → go to slide 33 → `Shift+F5` → click the red **21** in
"US$731.25 million [21]" → card [21] appears → click **← Back** → you are on slide 33 again → click **Index of
sources** from any card to see the index.

## 3. Rebuild and checks

```bash
pip install python-pptx fonttools cairosvg pyyaml pillow lxml numpy   # once
scripts/build-all            # extract → draw art → build pptx → checks → docs → PDF + qa/ images
SKIP_RENDER=1 scripts/build-all   # same without LibreOffice
```

Individual checks (each exits non-zero on error; reports also in `build/*.txt`):

| Script | Checks |
|---|---|
| `scripts/check-links` | every [n] is its own run with a working link to the right card; no dead links; every card hidden with Back + Index; cited set = paper's cited set |
| `scripts/verify-content` | every number/code/name on a slide exists in the paper section it comes from; all 199 paragraphs in notes verbatim; all 21 tables and 8 figures present; no drafting marks |
| `scripts/audit-pptx` | fonts and sizes per run (title ≥ 36, bullets ≥ 24/20, cells ≥ 14, nothing < 12), glyph coverage, off-slide shapes, text overflow, duplicate names, Morph pairing, autofit off, transition XML |

To edit content: change `content/slides.part.yaml` (slides), `content/tables.part.yaml` (tables) or
`content/charts.part.yaml` (charts) and run `scripts/build-all`. Slides, notes, source cards, SLIDES.md and
CITATIONS.md are regenerated together, so they stay in sync.

## 4. Known limits

- Morph animation and embedded fonts can only be verified in real PowerPoint; the checks here validate the XML
  (Morph + fade fallback, namespaces) and render with LibreOffice, which shows no transitions.
- No source excerpts: the build environment could not reach any source website, so cards show citation details from
  the paper only (labelled on each card).
- Lecturer line on slide 1 is a deliberate placeholder — see ISSUES.md §1.
