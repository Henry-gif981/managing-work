#!/usr/bin/env python3
"""Extract the paper into content/content-ibrd.md.

Input : content/raw.txt  (pdftotext -layout output of the PDF; \f = page break)
        content/deck.yaml (tables: transcribed cell-by-cell, used to replace the
                           garbled layout tables)
Output: content/content-ibrd.md — one '## [id] heading' per section, each
        paragraph prefixed with '<!-- p:N page:P -->' so slides can pull
        exact paragraphs into speaker notes and citation cards.

Prose is reflowed verbatim; only extraction artefacts are fixed (zero-width
spaces, line joins). Drafting notes such as "( lỗi )" are KEPT here (this is
the faithful extraction) and are stripped later by build/verify scripts.
"""
import re, sys, yaml, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "content/raw.txt"
DECK = ROOT / "content/deck.yaml"
OUT = ROOT / "content/content-ibrd.md"

# (id, regex matching the heading's first line in the layout text, title)
HEADINGS = [
    ("cover", None, "Cover page"),
    ("intro", r"^\s+INTRODUCTION\s*$", "INTRODUCTION"),
    ("intro-1", r"^1 Rationale for the Research", "1 Rationale for the Research"),
    ("intro-1.1", r"^1\.1 The role of multilateral", "1.1 The role of multilateral development finance for developing economies"),
    ("intro-1.2", r"^1\.2 Why the IBRD matters", "1.2 Why the IBRD matters for Vietnam after its shift from concessional IDA lending to IBRD lending"),
    ("intro-2", r"^2\. Research Problem", "2. Research Problem and Questions"),
    ("intro-3", r"^3\. Research Objectives", "3. Research Objectives"),
    ("intro-3.1", r"^3\.1\. To analyze", "3.1. To analyze the mechanisms of IBRD involvement in project financing"),
    ("intro-3.2", r"^3\.2\. To evaluate", "3.2. To evaluate practical implementations through selected case studies in Vietnam"),
    ("intro-4", r"^4\. Research Methodology", "4. Research Methodology"),
    ("intro-5", r"^5\. Research scope", "5. Research scope"),
    ("intro-6", r"^6\. Structure of the paper", "6. Structure of the paper"),
    ("ch1", r"^CHAPTER 1: OVERVIEW", "CHAPTER 1: OVERVIEW OF THE IBRD"),
    ("1.1", r"^1\.1\. What is the IBRD", "1.1. What is the IBRD?"),
    ("1.1.1", r"^1\.1\.1\. Definition", "1.1.1. Definition, mission, and eligible borrowers"),
    ("1.1.2", r"^1\.1\.2\. Position", "1.1.2. Position within the World Bank Group; distinguishing IBRD, IDA, IFC, MIGA, and ICSID"),
    ("1.2", r"^1\.2\. History", "1.2. History and development"),
    ("1.3", r"^1\.3\. Organizational", "1.3. Organizational structure"),
    ("1.3.1", r"^1\.3\.1\. Board", "1.3.1. Board of Governors, Board of Executive Directors, President"),
    ("1.3.2", r"^1\.3\.2\. Voting", "1.3.2. Voting power based on shareholding and membership"),
    ("1.3.3", r"^1\.3\.3\. Source of funds", "1.3.3. Source of funds: paid-in capital and bond issuance on capital markets"),
    ("1.4", r"^1\.4\. Financing instruments", "1.4. Financing instruments and loan conditions"),
    ("1.4.1", r"^1\.4\.1\. Three main", "1.4.1. Three main instruments: Investment Project Financing (IPF), Development Policy Financing (DPF) and Program-for-Results (PforR)"),
    ("1.4.2", r"^1\.4\.2\. Loan terms", "1.4.2. Loan terms: interest rates, maturities and fees"),
    ("1.4.3", r"^1\.4\.3\. Safeguard", "1.4.3. Safeguard and procurement requirements (Environmental and Social Framework)"),
    ("ch2", r"^CHAPTER 2\. HOW", "CHAPTER 2. HOW THE IBRD SUPPORTS PROJECT FINANCING"),
    ("2.1", r"^2\.1\. Financial support", "2.1. Financial support"),
    ("2.1.1", r"^2\.1\.1\. The project cycle", "2.1.1. The project cycle: identification, preparation, appraisal, negotiation, approval, implementation and evaluation"),
    ("2.1.2", r"^2\.1\.2\. Disbursement", "2.1.2. Disbursement mechanisms and counterpart funding requirements"),
    ("2.1.3", r"^2\.1\.3\. How each", "2.1.3. How each instrument works in practice: IPF (structure and disbursement), DPF (promoting policy reforms), PforR (linking funding to results)"),
    ("2.2", r"^2\.2\. Technical support", "2.2. Technical support"),
    ("2.2.1", r"^2\.2\.1\. Project preparation", "2.2.1. Project preparation and feasibility studies"),
    ("2.2.2", r"^2\.2\.2\. Analytical", "2.2.2. Analytical and Advisory Services (ASA) for policy formulation"),
    ("2.2.3", r"^2\.2\.3\. Monitoring", "2.2.3. Monitoring and evaluation (M&E) frameworks"),
    ("2.3", r"^2\.3\. Training", "2.3. Training and Capacity Building"),
    ("2.3.1", r"^2\.3\.1\. Human", "2.3.1. Human resource development for project management units (PMUs)"),
    ("2.3.2", r"^2\.3\.2\. Knowledge", "2.3.2. Knowledge transfer in procurement and environmental safeguards"),
    ("2.3.3", r"^2\.3\.3\. Strengthening", "2.3.3. Strengthening institutional governance in beneficiary sectors"),
    ("2.4", r"^2\.4\. Overall", "2.4. Overall assessment"),
    ("ch3", r"^CHAPTER 3\. THE IBRD", "CHAPTER 3. THE IBRD AND SELECTED PROJECTS IN VIETNAM"),
    ("3.1", r"^3\.1\. Context", "3.1. Context of Vietnam-World Bank Relations"),
    ("3.1.1", r"^3\.1\.1\. Resumption", "3.1.1. Resumption of the partnership in 1993"),
    ("3.1.2", r"^3\.1\.2\. IDA graduation", "3.1.2. IDA graduation in July 2017 and the transition to IBRD lending"),
    ("3.1.3", r"^3\.1\.3\. Comparison", "3.1.3. Comparison with a late IDA-financed project: SAHEP (2017)"),
    ("3.1.4", r"^3\.1\.4\. Legal", "3.1.4. Legal framework governing ODA and concessional external loans"),
    ("3.2", r"^3\.2\. Case study 1", "3.2. Case study 1: Transmission Efficiency Project (TEP), energy sector"),
    ("3.2.1", r"^3\.2\.1\. Project overview", "3.2.1. Project overview"),
    ("3.2.2", r"^3\.2\.2\. Project components", "3.2.2. Project components and financial structure"),
    ("3.2.3", r"^3\.2\.3\. Project implementation", "3.2.3. Project implementation: technical support and capacity building"),
    ("3.2.4", r"^3\.2\.4\. Results", "3.2.4. Results and project outcomes"),
    ("3.2.5", r"^3\.2\.5\. Implementation", "3.2.5. Implementation challenges and financing limitations"),
    ("3.2.6", r"^3\.2\.6\. Overall", "3.2.6. Overall assessment of the TEP case"),
    ("3.3", r"^3\.3\. Case study 2", "3.3. Case study 2: Coastal Cities Sustainable Environment Project (CCSEP), urban and environment sector"),
    ("3.3.1", r"^3\.3\.1\. Project overview", "3.3.1. Project overview"),
    ("3.3.2", r"^3\.3\.2\. Project components", "3.3.2. Project components and financial structure"),
    ("3.3.3", r"^3\.3\.3\. Project implementation", "3.3.3. Project implementation"),
    ("3.3.4", r"^3\.3\.4\. Results", "3.3.4. Results and challenges"),
    ("3.4.1", r"^3\.4\.1\. Achievements", "3.4.1. Achievements: financial mobilization, higher technical and management standards"),
    ("3.4.2", r"^3\.4\.2\. Limitations", "3.4.2. Limitations: slow disbursement, procedural complexity, counterpart funding, gaps between WB safeguards and domestic regulations"),
    ("3.4.3", r"^3\.4\.3\. Recommendations", "3.4.3. Recommendations for Vietnam"),
    ("concl", r"^\s+CONCLUSION\s*$", "CONCLUSION"),
    ("concl-1", r"^1\. Summary of findings", "1. Summary of findings"),
    ("concl-1.1", r"^1\.1\. Synthesizing", "1.1. Synthesizing the three pillars of IBRD support: finance, technical support and training"),
    ("concl-1.2", r"^1\.2\. Re-evaluating", "1.2. Re-evaluating project impacts from the case studies"),
    ("concl-2", r"^2\. Significance", "2. Significance of the paper"),
    ("concl-3", r"^3\. Limitations of the research", "3. Limitations of the research"),
    ("concl-4", r"^4\. Directions", "4. Directions for further research"),
    ("refs", r"^\s+REFERENCES\s*$", "REFERENCES"),
]
CONT_HEAD = {  # 2nd lines of headings that wrap in the PDF
    "1.1.2": "MIGA, and ICSID", "1.4.1": "Policy Financing (DPF)", "1.4.3": "Framework)",
    "2.1.1": "approval, implementation", "2.1.3": "DPF (promoting", "intro-1.2": "lending to IBRD lending",
    "3.3": "urban and environment sector", "3.4.1": "standards", "3.4.2": "gaps between WB",
    "concl-1.1": "training",
}
FORCED_PARA_STARTS = ("Procurement follows a separate framework",)
CAPTION = re.compile(r"^\s*(Table|Figure) (\d+)\. ")


def load_pages():
    pages = RAW.read_text(encoding="utf-8").split("\f")
    lines = []
    for pno, pg in enumerate(pages, start=1):
        for ln in pg.split("\n"):
            lines.append((pno, ln.replace("​", "").rstrip()))
    return lines


def main():
    deck = yaml.safe_load(DECK.read_text(encoding="utf-8"))
    tables = deck["tables"]
    charts = deck["charts"]
    lines = load_pages()
    # body starts at the INTRODUCTION heading after the TOC (page >= 4)
    out = ["# IBRD and its Development Project Financing Activities in Vietnam",
           "", "Extracted from `src/Bản sao của IBRD - NHÓM 6 (2).pdf` by `scripts/extract_content.py`.",
           "Paragraph markers: `<!-- p:N page:P -->` (paragraph N of the section, PDF page P).",
           "Tables are transcribed cell by cell from the PDF (rows split across pages re-joined).",
           "Drafting notes left by the authors (e.g. \"( lỗi )\", \"( check )\", trailing \"|\") are kept here verbatim",
           "and are NOT shown on slides or in speaker notes (see ISSUES.md).", ""]
    # cover block (pages 1)
    cover = [l for p, l in lines if p == 1 and l.strip()]
    out += ["## [cover] Cover page", "<!-- page:1 -->", ""] + ["    " + c.strip() for c in cover] + [""]

    heads = list(HEADINGS[1:])
    hi = 0
    cur = None
    para = []
    para_page = None
    pcount = 0
    i = 0
    skip_until_source = None
    pending_block = None
    started = False

    def flush():
        nonlocal para, pcount
        if para:
            txt = " ".join(s.strip() for s in para)
            txt = re.sub(r"\s+", " ", txt).strip()
            txt = re.sub(r"^(\d+)\.(?=[A-Z])", r"\1. ", txt)  # "10.ESS10" -> "10. ESS10"
            # join words split by hyphen at line end inside prose, e.g. "Program-for-Res ults" never occurs in prose
            pcount += 1
            out.append(f"<!-- p:{pcount} page:{para_page} -->")
            out.append(txt)
            out.append("")
        para = []

    while i < len(lines):
        pno, ln = lines[i]
        if pno < 4:
            i += 1
            continue
        # heading?
        if hi < len(heads) and heads[hi][1] and re.search(heads[hi][1], ln):
            hid, _, title = heads[hi]
            flush()
            if hid == "refs":
                break
            out.append(f"## [{hid}] {title}")
            out.append(f"<!-- page:{pno} -->")
            out.append("")
            cur = hid
            pcount = 0
            started = True
            hi += 1
            i += 1
            if hid in CONT_HEAD and CONT_HEAD[hid] in lines[i][1]:
                i += 1
            continue
        if not started:
            i += 1
            continue
        m = CAPTION.match(ln)
        if m:
            flush()
            kind, num = m.group(1), m.group(2)
            key = ("T" if kind == "Table" else "F") + num
            # consume block until Source line (+ continuation) or Note line for T3
            j = i
            while j < len(lines):
                l2 = lines[j][1]
                if l2.strip().startswith("Source:") or (key == "T3" and l2.strip().startswith("Note:")):
                    while not (lines[j][1].rstrip().endswith(".") or lines[j][1].rstrip().endswith("projects.worldbank.org")):
                        j += 1
                    break
                j += 1
            if key.startswith("T"):
                t = tables[key]
                out.append(f"<!-- table:{key} page:{t['page']} -->")
                out.append(f"**{t['caption']}**")
                out.append("")
                out.append("| " + " | ".join(t["header"]) + " |")
                out.append("|" + "---|" * len(t["header"]))
                for r in t["rows"]:
                    out.append("| " + " | ".join(strip_ay(c) for c in r) + " |")
                out.append("")
                out.append("*" + strip_ay(t["source"]) + "*")
                out.append("")
            else:
                c = charts[key]
                out.append(f"<!-- figure:{key} page:{pno} -->")
                out.append(f"**{c['caption']}** *(chart image in the PDF; data rebuilt in deck.yaml → charts.{key})*")
                out.append("")
                out.append("*" + strip_ay(c["source"]) + "*")
                out.append("")
            i = j + 1
            continue
        s = ln.strip()
        if not s:
            i += 1
            continue
        # Table 18 note paragraph
        is_new = False
        lead = len(ln) - len(ln.lstrip())
        if s.startswith(FORCED_PARA_STARTS):
            is_new = True  # paragraph that follows a list without punctuation
        elif re.match(r"^\d{1,2}\.\s?[A-Z]", s) and lead <= 4 and cur not in ("concl",):
            is_new = True  # numbered list item
        elif re.match(r"^-\s", s):
            is_new = True
        elif s.startswith("Note:"):
            is_new = True
        elif lead >= 4 and para and re.search(r"[.:\]\)”\"]$", para[-1].strip()):
            is_new = True
        elif lead >= 5 and not para:
            is_new = True
        if is_new:
            flush()
            para_page = pno
        if not para:
            para_page = pno
        para.append(s)
        i += 1
    flush()
    # references
    out.append("## [refs] REFERENCES")
    out.append("<!-- page:64 -->")
    out.append("")
    ref_lines = [l for p, l in lines if p >= 64]
    text = "\n".join(ref_lines)
    text = text[text.index("[1]"):]
    refs = re.split(r"\n\s*(?=\[\d+\]\s)", "\n" + text)
    for r in refs:
        r = re.sub(r"\s+", " ", r).strip()
        if not r:
            continue
        # re-join URLs broken across lines ("...docum entdetail" -> "...documentdetail")
        r = fix_ref(r)
        out.append(r)
        out.append("")
    OUT.write_text("\n".join(out), encoding="utf-8")
    print("wrote", OUT)


def fix_ref(r):
    m = re.search(r"(https?://\S.*)$", r)
    if m:
        url = m.group(1)
        tail = ""
        # trailing draft marker after url? (none observed) keep as-is
        url = url.replace(" ", "")
        r = r[: m.start()] + url + tail
    return r


def strip_ay(s):
    return re.sub(r"\{\{ay:([^|}]*)\|[^}]*\}\}", r"\1", s)


if __name__ == "__main__":
    main()
