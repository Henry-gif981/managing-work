"""Shared helpers: paper parsing, markup/citation parsing, text measurement.

Used by build_deck.py, verify-content, audit-pptx and check-links so that all
of them read the paper and the slide plan the same way.
"""
import re, pathlib, functools
import yaml
from PIL import ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT_MD = ROOT / "content/content-ibrd.md"
DECK_YAML = ROOT / "content/deck.yaml"
FONTS = ROOT / "fonts"

FONT_FILES = {
    ("Cormorant Garamond", False, False): "CormorantGaramond-Regular.ttf",
    ("Cormorant Garamond", True, False): "CormorantGaramond-Bold.ttf",
    ("Cormorant Garamond", False, True): "CormorantGaramond-Italic.ttf",
    ("Cormorant Garamond", True, True): "CormorantGaramond-Bold.ttf",
    ("Be Vietnam Pro", False, False): "BeVietnamPro-Regular.ttf",
    ("Be Vietnam Pro", True, False): "BeVietnamPro-Bold.ttf",
    ("Be Vietnam Pro", False, True): "BeVietnamPro-Italic.ttf",
    ("Be Vietnam Pro", True, True): "BeVietnamPro-BoldItalic.ttf",
}
DISPLAY = "Cormorant Garamond"
BODY = "Be Vietnam Pro"

# Drafting notes left in the paper by its authors — never shown on slides/notes.
DRAFT_PATTERNS = [
    r"\s*\(\s*lỗi\s*\)", r"\s*\(\s*check(?:\s+3\.4\.1)?\s*\)", r"\s*\|\s*$",
    r"\s*\(\s*quên mất tên cô r…\s*\)",
]


def strip_draft(s):
    for p in DRAFT_PATTERNS:
        s = re.sub(p, "", s)
    return s.strip()


# ------------------------------------------------------------------ paper
@functools.lru_cache(None)
def load_paper():
    """Return dict: sections{id: {title, page, paras:[{n,page,text}], tables[], figures[]}}, refs{n: text}."""
    t = CONTENT_MD.read_text(encoding="utf-8")
    sections, order = {}, []
    for m in re.finditer(r"^## \[([^\]]+)\] (.*)$", t, re.M):
        sid, title = m.group(1), m.group(2)
        body = t[m.end():]
        nxt = re.search(r"^## \[", body, re.M)
        body = body[: nxt.start()] if nxt else body
        pg = re.search(r"<!-- page:(\d+) -->", body)
        paras = [{"n": int(a), "page": int(b), "text": c.strip()}
                 for a, b, c in re.findall(r"<!-- p:(\d+) page:(\d+) -->\n(.+)", body)]
        tables = re.findall(r"<!-- table:(\w+)", body)
        figs = re.findall(r"<!-- figure:(\w+)", body)
        sections[sid] = {"id": sid, "title": title, "page": int(pg.group(1)) if pg else None,
                         "paras": paras, "tables": tables, "figures": figs, "raw": body}
        order.append(sid)
    refs = {}
    rb = sections["refs"]["raw"]
    for m in re.finditer(r"^\[(\d+)\]\s*(.+)$", rb, re.M):
        refs[int(m.group(1))] = m.group(2).replace("​", "").strip()
    return {"sections": sections, "order": order, "refs": refs}


def ref_parts(n):
    """(clean reference text without URL, url or None) — drafting marks removed."""
    raw = load_paper()["refs"][n]
    m = re.search(r"(https?://\S+)\s*$", raw)
    url = m.group(1) if m else None
    text = raw[: m.start()] if m else raw
    return strip_draft(text), url


@functools.lru_cache(None)
def load_deck():
    return yaml.safe_load(DECK_YAML.read_text(encoding="utf-8"))


def all_charts():
    d = load_deck()
    c = dict(d["charts"])
    c.update(d.get("extra_charts", {}))
    return c


def resolve_notes(spec):
    """'3.2.4' | '3.2.4#2-3' | 'T14' | 'F3' -> list of (kind, sid, item)."""
    P = load_paper()["sections"]
    out = []
    for s in spec:
        if re.fullmatch(r"T\d+", s):
            out.append(("table", s, None)); continue
        if s in all_charts() and s not in P:
            out.append(("chart", s, None)); continue
        if "#" in s:
            sid, rng = s.split("#")
            a, _, b = rng.partition("-")
            a, b = int(a), int(b or a)
            for p in P[sid]["paras"]:
                if a <= p["n"] <= b:
                    out.append(("para", sid, p))
        else:
            sid = s
            if not P[sid]["paras"]:
                out.append(("heading", sid, None))
            for p in P[sid]["paras"]:
                out.append(("para", sid, p))
    return out


# ------------------------------------------------------------------ markup
CIT = re.compile(r"\[(\d+[^\[\]]*)\]")
AY = re.compile(r"\{\{ay:([^|}]+)\|(\d+)\|(\w+)\}\}")
BOLD = re.compile(r"\*\*(.+?)\*\*")


def parse_citation_group(inner, keep_sep=False):
    """'44; 41; 37' -> [(44,''),(41,''),(37,'')]; '37, pp. ix–xi, 17' -> [(37,'pp. ix–xi, 17')].

    With keep_sep=True each item is (n, locator, separator-before) so the paper's
    exact punctuation ("[26;27]" vs "[44; 41]") is preserved.
    """
    out = []
    pieces = re.split(r"(\s*;\s*)", inner)
    sep = ""
    for i, part in enumerate(pieces):
        if i % 2:
            sep = part
            continue
        m = re.match(r"(\d+)\s*(?:,\s*(.*))?$", part.strip())
        if not m:
            return None
        item = (int(m.group(1)), (m.group(2) or "").strip())
        out.append(item + (sep,) if keep_sep else item)
    return out


def tokenize(text):
    """Split markup into segments: dict(text, bold, cite=n|None, ay=status|None, locator).

    Citation numbers become their own segments so each is separately clickable;
    brackets, separators and locators stay plain text.
    """
    segs = []

    def plain(s, bold):
        if s:
            segs.append({"text": s, "bold": bold, "cite": None})

    def walk(s, bold):
        pos = 0
        pat = re.compile(CIT.pattern + "|" + AY.pattern)
        for m in pat.finditer(s):
            plain(s[pos:m.start()], bold)
            if m.group(1) is not None:
                grp = parse_citation_group(m.group(1), keep_sep=True)
                if grp is None:
                    plain(m.group(0), bold)
                else:
                    plain("[", bold)
                    for i, (n, loc, sep) in enumerate(grp):
                        if i:
                            plain(sep, bold)
                        segs.append({"text": str(n), "bold": bold, "cite": n, "locator": loc, "ay": None})
                        if loc:
                            plain(", " + loc, bold)
                    plain("]", bold)
            else:
                segs.append({"text": m.group(2), "bold": bold, "cite": int(m.group(3)), "ay": m.group(4), "locator": m.group(2)})
            pos = m.end()
        plain(s[pos:], bold)

    pos = 0
    for m in BOLD.finditer(text):
        walk(text[pos:m.start()], False)
        walk(m.group(1), True)
        pos = m.end()
    walk(text[pos:], False)
    return segs


def plain_text(text):
    return "".join(s["text"] for s in tokenize(text))


def citations_in(text):
    return [(s["cite"], s.get("locator", ""), s.get("ay")) for s in tokenize(text) if s["cite"]]


# ------------------------------------------------------------------ measuring
@functools.lru_cache(None)
def font(face, size_pt, bold=False, italic=False):
    f = FONT_FILES[(face, bool(bold), bool(italic))]
    return ImageFont.truetype(str(FONTS / f), size=int(round(size_pt * 10)))  # 10 px per pt


def text_width_in(s, face, size, bold=False, italic=False, spc=0):
    """Width in inches (spc = extra letter spacing in pt)."""
    w = font(face, size, bold, italic).getlength(s) / 10.0  # pt
    return (w + spc * len(s)) / 72.0


def wrap_segments(segs, width_in, face, size, spc=0):
    """Greedy word wrap over styled segments; returns number of lines."""
    words = []
    for sg in segs:
        for piece in re.split(r"(\s+)", sg["text"]):
            if piece:
                words.append((piece, sg.get("bold", False), sg.get("italic", False)))
    lines, cur = 1, 0.0
    for w, b, it in words:
        wl = text_width_in(w, face, size, b, it, spc)
        if w.isspace():
            cur += wl
            continue
        if wl > width_in:  # unbreakable token (URL) wraps by character
            if cur > 0:
                lines += 1
            full = int(wl // width_in)
            lines += full
            cur = wl - full * width_in
            continue
        if cur + wl > width_in and cur > 0:
            lines += 1
            cur = wl
        else:
            cur += wl
    return lines


def text_lines(text, width_in, face, size, bold=False, italic=False, spc=0):
    segs = tokenize(text) if isinstance(text, str) else text
    for s in segs:
        s["bold"] = s.get("bold") or bold
        s["italic"] = italic
    return wrap_segments(segs, width_in, face, size, spc)


LINE = 1.2  # line spacing factor used everywhere (exact spacing = LINE * size)


def block_height_in(paras, width_in, face, size, space_after_pt=0, bold=False, italic=False):
    h = 0.0
    for p in paras:
        n = text_lines(p, width_in, face, size, bold, italic)
        h += n * size * LINE / 72 + space_after_pt / 72
    return h
