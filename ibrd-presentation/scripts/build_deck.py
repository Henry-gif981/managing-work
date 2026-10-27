#!/usr/bin/env python3
"""Build IBRD-Presentation.pptx from content/deck.yaml + content/content-ibrd.md.

python-pptx for structure, plus direct XML for: Morph transitions (p159),
per-number citation hyperlinks (ppaction://hlinksldjump), "last slide viewed"
Back buttons, hidden source-card slides (show="0"), decorative flags, theme.
"""
import copy, re, sys, pathlib, json, datetime
from lxml import etree
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION, XL_LABEL_POSITION
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from pptx.oxml.ns import qn

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import deckkit as K

ROOT = K.ROOT
OUT = ROOT / "IBRD-Presentation.pptx"
ART = ROOT / "assets/png"
BUILD_INFO = ROOT / "build/build-info.json"

# ---------------------------------------------------------------- tokens
C = {
    "paper": "F4ECD8", "paper_deep": "E8DDC2", "ink": "2E4257", "ink_soft": "4B5A69",
    "wash": "4E637A", "mist": "DCE3EA", "dot": "B4432F", "link": "A33224",
}
SERIES = ["2E4257", "7F93A8", "C9B48A", "B4432F", "B9C6D2"]
W, H = 13.333, 7.5
ML, MR = 0.6, 0.6
CW = W - ML - MR
TOP = 1.72      # body top
BOT = 6.88      # body bottom
D, B = K.DISPLAY, K.BODY
SZ = {"title": 40, "b1": 24, "b2": 20, "card_h": 22, "card_b": 20, "cell": 16, "cell_min": 14,
      "src": 12, "tag": 14, "ref": 13}

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
    "p14": "http://schemas.microsoft.com/office/powerpoint/2010/main",
    "p159": "http://schemas.microsoft.com/office/powerpoint/2015/09/main",
}

WARN = []
# Fallback hints: both OFL fonts ship with an empty PANOSE; give PowerPoint Garamond-class / Calibri-class codes so a
# machine without the fonts substitutes a serif (Georgia/Times) for titles and a sans (Calibri/Arial) for body text.
PANOSE = {"Cormorant Garamond": ("02020404030301010803", "18"), "Be Vietnam Pro": ("020F0502020204030204", "34")}


def fallback_hint(rPr):
    lat = rPr.find(qn("a:latin"))
    if lat is not None and lat.get("typeface") in PANOSE:
        lat.set("panose", PANOSE[lat.get("typeface")][0])
        lat.set("pitchFamily", PANOSE[lat.get("typeface")][1])


def rgb(h):
    return RGBColor.from_string(h)


# ================================================================ presentation
class Deck:
    def __init__(self):
        self.prs = Presentation()
        self.prs.slide_width = Inches(W)
        self.prs.slide_height = Inches(H)
        self._theme()
        self._layouts()
        self.L = {n: l for n, l in ((l.name, l) for l in self.prs.slide_layouts)}
        self.cite_runs = []     # (run_rPr element, slide, n, locator, ay_status, context_text)
        self.slide_links = []   # (rPr or cNvPr, slide, target_key, kind)
        self.meta = []          # per visible content slide: dict
        self.paper = K.load_paper()

    # ------------------------------------------------ theme / master
    def _theme(self):
        master = self.prs.slide_master
        tpart = master.part.part_related_by(RT.THEME)
        x = etree.fromstring(tpart.blob)
        a = NS["a"]
        x.find(f".//{{{a}}}fontScheme").set("name", "IBRD Group 6")
        for tag, face in (("majorFont", D), ("minorFont", B)):
            lat = x.find(f".//{{{a}}}{tag}/{{{a}}}latin")
            lat.set("typeface", face)
            lat.set("panose", PANOSE[face][0])
            lat.set("pitchFamily", PANOSE[face][1])
            lat.set("charset", "0")
        cs = x.find(f".//{{{a}}}clrScheme")
        cs.set("name", "IBRD Paper & Wash")
        cmap = {"dk1": C["ink"], "lt1": C["paper"], "dk2": C["wash"], "lt2": C["paper_deep"],
                "accent1": SERIES[0], "accent2": SERIES[1], "accent3": SERIES[2], "accent4": SERIES[3],
                "accent5": SERIES[4], "accent6": C["ink_soft"], "hlink": C["link"], "folHlink": "7A2A1F"}
        for k, v in cmap.items():
            el = cs.find(f"{{{a}}}{k}")
            for ch in list(el):
                el.remove(ch)
            etree.SubElement(el, f"{{{a}}}srgbClr").set("val", v)
        x.set("name", "IBRD Group 6")
        tpart._blob = etree.tostring(x, xml_declaration=True, encoding="UTF-8", standalone=True)
        # master background = paper colour; title/body styles use theme fonts, no autofit
        m = master._element
        csld = m.find(qn("p:cSld"))
        bg = csld.find(qn("p:bg"))
        if bg is None:
            bg = etree.SubElement(csld, qn("p:bg"))
            csld.remove(bg)
            csld.insert(0, bg)
        for ch in list(bg):
            bg.remove(ch)
        bgPr = etree.SubElement(bg, qn("p:bgPr"))
        sf = etree.SubElement(bgPr, qn("a:solidFill"))
        etree.SubElement(sf, qn("a:srgbClr")).set("val", C["paper"])
        etree.SubElement(bgPr, qn("a:effectLst"))
        for lvl in m.iter(qn("a:defRPr")):
            if lvl.find(qn("a:solidFill")) is None:
                pass
        ts = m.find(f".//{{{NS['p']}}}titleStyle")
        r0 = ts.find(f".//{{{a}}}lvl1pPr/{{{a}}}defRPr")
        r0.set("sz", "4000")
        for sp in m.iter(qn("a:bodyPr")):
            for ch in list(sp):
                if ch.tag in (qn("a:normAutofit"), qn("a:spAutoFit")):
                    sp.remove(ch)
            if sp.find(qn("a:noAutofit")) is None:
                sp.append(etree.Element(qn("a:noAutofit")))

    def _layouts(self):
        """Scale layout placeholders to 16:9, rename the layouts we use, disable autofit."""
        sx = W / 10.0
        names = {"Title Slide": "IBRD Cover", "Title and Content": "IBRD Title and Bullets",
                 "Section Header": "IBRD Chapter Opener", "Title Only": "IBRD Title Only", "Blank": "IBRD Blank"}
        parts = [self.prs.slide_master] + list(self.prs.slide_layouts)
        for lay in parts:
            el = lay._element
            for off in el.iter(qn("a:off")):
                off.set("x", str(int(int(off.get("x")) * sx)))
            for ext in el.iter(qn("a:ext")):
                if ext.get("cx") is not None:
                    ext.set("cx", str(int(int(ext.get("cx")) * sx)))
            for bp in el.iter(qn("a:bodyPr")):
                for ch in list(bp):
                    if ch.tag in (qn("a:normAutofit"), qn("a:spAutoFit")):
                        bp.remove(ch)
                if bp.find(qn("a:noAutofit")) is None:
                    bp.append(etree.Element(qn("a:noAutofit")))
            if lay is not self.prs.slide_master:
                csld = el.find(qn("p:cSld"))
                if csld.get("name") in names:
                    csld.set("name", names[csld.get("name")])

    # ------------------------------------------------ slide creation
    def new_slide(self, layout):
        s = self.prs.slides.add_slide(self.L[layout])
        # drop date/footer/slide-number placeholders copied from layout (we draw our own number)
        for ph in list(s.placeholders):
            if ph.placeholder_format.idx in (10, 11, 12):
                ph._element.getparent().remove(ph._element)
        return s


# ================================================================ primitives
def set_name(shape, name, descr=None, decorative=False):
    cNvPr = shape._element.find(".//" + qn("p:cNvPr"))
    if cNvPr is None:
        cNvPr = shape._element.find(".//" + qn("p:nvGraphicFramePr") + "/" + qn("p:cNvPr"))
    cNvPr.set("name", name)
    if descr is not None:
        cNvPr.set("descr", descr)
    if decorative:
        cNvPr.set("descr", "")
        ext = etree.SubElement(etree.SubElement(cNvPr, qn("a:extLst")), qn("a:ext"))
        ext.set("uri", "{C183D7F6-B498-43B3-948B-1728B52AA6E4}")
        dec = etree.SubElement(ext, "{http://schemas.microsoft.com/office/drawing/2017/decorative}decorative",
                               nsmap={"adec": "http://schemas.microsoft.com/office/drawing/2017/decorative"})
        dec.set("val", "1")
    return shape


def tf_setup(tf, inset=0.0, anchor=MSO_ANCHOR.TOP, wrap=True):
    tf.word_wrap = wrap
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = Inches(inset)
    tf.margin_top = tf.margin_bottom = Inches(0.02)
    tf.vertical_anchor = anchor


def para_fmt(p, size, align=PP_ALIGN.LEFT, after=0, line=K.LINE):
    p.alignment = align
    p.line_spacing = Pt(size * line)
    p.space_after = Pt(after)
    p.space_before = Pt(0)


from fontTools.ttLib import TTFont as _TT
_BVP = set(_TT(str(K.FONTS / "BeVietnamPro-Regular.ttf"))["cmap"].getBestCmap())


def glyph_split(text, face):
    """Characters Be Vietnam Pro lacks (arrows) are set in Cormorant Garamond, the deck's other family."""
    if face != B:
        return [(text, face)]
    out = []
    for ch in text:
        f = B if (ord(ch) in _BVP or ch in "\n") else D
        if out and out[-1][1] == f:
            out[-1] = (out[-1][0] + ch, f)
        else:
            out.append((ch, f))
    return out


def add_runs(deck, slide, p, text, face, size, color, bold=False, italic=False, caps=False, spc=None,
             link_color=None):
    """Add markup text as runs; citation numbers become separately linked runs."""
    segs = []
    for sg in (K.tokenize(text) if isinstance(text, str) else text):
        if sg["cite"]:
            segs.append((sg, face))
        else:
            for piece, f2 in glyph_split(sg["text"], face):
                segs.append((dict(sg, text=piece), f2))
    for sg, fface in segs:
        r = p.add_run()
        r.text = sg["text"]
        f = r.font
        f.name = fface
        f.size = Pt(size)
        f.bold = bool(sg.get("bold") or bold)
        f.italic = italic
        f.color.rgb = rgb(color)
        rPr = r._r.get_or_add_rPr()
        fallback_hint(rPr)
        if caps:
            rPr.set("cap", "all")
        if spc:
            rPr.set("spc", str(int(spc * 100)))
        if sg["cite"]:
            f.color.rgb = rgb(link_color or C["link"])
            f.underline = True
            if size < 14:
                f.size = Pt(14)
            deck.cite_runs.append({"rPr": rPr, "slide": slide, "n": sg["cite"],
                                   "locator": sg.get("locator", ""), "ay": sg.get("ay"), "context": text})
    return p


def textbox(deck, slide, x, y, w, h, paras, face=None, size=18, color=None, name=None, align=PP_ALIGN.LEFT,
            anchor=MSO_ANCHOR.TOP, bold=False, italic=False, caps=False, spc=None, after=0, line=K.LINE):
    face = face or B
    color = color or C["ink"]
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf_setup(tf, anchor=anchor)
    if isinstance(paras, str):
        paras = [paras]
    for i, t in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para_fmt(p, size, align, after, line)
        add_runs(deck, slide, p, t, face, size, color, bold, italic, caps, spc)
    if name:
        set_name(tb, name)
    return tb


def picture(slide, path, x, y, w=None, h=None, name=None, descr="", decorative=False):
    pic = slide.shapes.add_picture(str(path), Inches(x), Inches(y),
                                   Inches(w) if w else None, Inches(h) if h else None)
    if name:
        set_name(pic, name, descr, decorative)
    return pic


def fit_picture(slide, path, x, y, w, h, name, descr="", decorative=False, align="center"):
    from PIL import Image
    im = Image.open(path)
    r = im.width / im.height
    if w / h > r:
        pw, ph = h * r, h
    else:
        pw, ph = w, w / r
    px = x + (w - pw) / 2 if align == "center" else (x + w - pw if align == "right" else x)
    py = y + (h - ph) / 2
    return picture(slide, path, px, py, pw, ph, name, descr, decorative)


def rect(slide, x, y, w, h, fill=None, line=None, name=None, shape=MSO_SHAPE.RECTANGLE, line_w=0.75):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill:
        s.fill.solid()
        s.fill.fore_color.rgb = rgb(fill)
    else:
        s.fill.background()
    if line:
        s.line.color.rgb = rgb(line)
        s.line.width = Pt(line_w)
    else:
        s.line.fill.background()
    s.shadow.inherit = False
    if name:
        set_name(s, name)
    tf_setup(s.text_frame)
    return s


# ================================================================ chrome
def chrome(deck, slide, idx, sec_key, dark=False, divider=False):
    """Background, compass, three red dots, section tag — the persistent Morph objects."""
    sec = K.load_deck()["sections"][sec_key]
    bg = ART / ("bg-wash.jpg" if dark else "bg-paper.jpg")
    picture(slide, bg, 0, 0, W, H, "!!bg", decorative=True)
    # compass: rotates from slide to slide
    if divider:
        cp = picture(slide, ART / "compass.png", 9.6, 3.9, 3.2, 3.2, "!!compass", decorative=True)
    else:
        cp = picture(slide, ART / "compass.png", 12.08, 0.2, 0.95, 0.95, "!!compass", decorative=True)
    cp.rotation = (idx * 23) % 360
    _set_alpha(cp, 35 if dark else 55)
    # dots slide along the margins
    import random
    r = random.Random(idx * 7919)
    spots = [
        (r.uniform(10.6, 11.6), r.uniform(0.18, 0.5), 0.34),            # top right, left of compass
        (r.uniform(0.12, 0.42), r.uniform(6.95, 7.12), 0.26),           # bottom left corner
        (r.uniform(12.9, 13.05), r.uniform(2.6, 5.2), 0.22),            # right edge
    ]
    if divider:
        spots = [(r.uniform(1.0, 3.0), r.uniform(0.5, 1.0), 0.55), (r.uniform(8.0, 9.0), r.uniform(6.6, 6.9), 0.36),
                 (r.uniform(12.2, 12.7), r.uniform(1.0, 2.0), 0.28)]
    for k, (x, y, d) in enumerate(spots, 1):
        picture(slide, ART / "dot.png", x, y, d, d, f"!!dot{k}", decorative=True)
    send_to_back(slide, ["!!bg", "!!compass", "!!dot1", "!!dot2", "!!dot3"])
    return sec


def send_to_back(slide, names):
    """Move decorative shapes to the bottom of the z-order (placeholders added by the layout come first)."""
    tree = slide.shapes._spTree
    els = []
    for nm in names:
        for el in tree:
            c = el.find(".//" + qn("p:cNvPr"))
            if c is not None and c.get("name") == nm:
                els.append(el)
    for k, el in enumerate(els):
        tree.remove(el)
        tree.insert(2 + k, el)  # after nvGrpSpPr, grpSpPr


def _set_alpha(pic, alpha_pct):
    blip = pic._element.find(".//" + qn("a:blip"))
    am = etree.SubElement(blip, qn("a:alphaModFix"))
    am.set("amt", str(int(alpha_pct * 1000)))


def section_tag(deck, slide, label, dark=False):
    return textbox(deck, slide, ML, 0.30, 9.6, 0.32, label, B, SZ["tag"], C["paper"] if dark else C["ink_soft"],
                   name="!!section", bold=True, spc=2.5)


def title_ph(deck, slide, text, x=ML, y=0.62, w=11.3, h=0.78, size=SZ["title"], color=None, align=PP_ALIGN.LEFT,
             italic=False, caps=False, anchor=MSO_ANCHOR.TOP):
    t = slide.shapes.title
    t.left, t.top, t.width, t.height = Inches(x), Inches(y), Inches(w), Inches(h)
    tf = t.text_frame
    tf_setup(tf, anchor=anchor)
    p = tf.paragraphs[0]
    para_fmt(p, size, align, 0, 1.0)
    add_runs(deck, slide, p, text, D, size, color or C["ink"], italic=italic, caps=caps)
    set_name(t, "!!title")
    # measure
    lines = K.text_lines(text, w, D, size)
    if lines * size / 72 > h + 0.01:
        WARN.append(f"title overflow: {text!r}")
    return t


def ref_line(deck, slide, s):
    pages = s.get("_pages", "")
    txt = f"Paper § {s['ref']}" + (f" · p. {pages}" if pages else "")
    return textbox(deck, slide, ML, 1.32, 9.0, 0.28, txt, B, SZ["ref"], C["ink_soft"], name="!!ref", italic=True)


def slide_number(deck, slide, n, dark=False):
    tb = slide.shapes.add_textbox(Inches(W - 1.45), Inches(H - 0.42), Inches(0.95), Inches(0.3))
    tf = tb.text_frame
    tf_setup(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    fld = etree.SubElement(p._p, qn("a:fld"))
    fld.set("id", "{B6F15528-21DE-4FAA-801E-634DDDAF4B2B}")
    fld.set("type", "slidenum")
    rPr = etree.SubElement(fld, qn("a:rPr"))
    rPr.set("lang", "en-US")
    rPr.set("sz", "1200")
    sf = etree.SubElement(rPr, qn("a:solidFill"))
    etree.SubElement(sf, qn("a:srgbClr")).set("val", C["paper"] if dark else C["ink_soft"])
    etree.SubElement(rPr, qn("a:latin")).set("typeface", B)
    etree.SubElement(fld, qn("a:t")).text = str(n)
    set_name(tb, "Slide number")
    return tb


# ================================================================ bullets
def bullets_box(deck, slide, x, y, w, h, items, size=SZ["b1"], name="!!body", placeholder=None, color=None):
    """items: str | {t, sub:[...]} ; level-1 24pt, level-2 20pt; returns used height (in)."""
    color = color or C["ink"]
    if placeholder is not None:
        shp = placeholder
        shp.left, shp.top, shp.width, shp.height = Inches(x), Inches(y), Inches(w), Inches(h)
    else:
        shp = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = shp.text_frame
    tf_setup(tf)
    first = True
    used = 0.0
    for it in items:
        lvls = [(it, 0)] if isinstance(it, str) else [(it["t"], 0)] + [(s2, 1) for s2 in it.get("sub", [])]
        for text, lvl in lvls:
            sz = size if lvl == 0 else SZ["b2"]
            p = tf.paragraphs[0] if first else tf.add_paragraph()
            first = False
            para_fmt(p, sz, after=10 if lvl == 0 else 6)
            ind = 0.34 + 0.4 * lvl
            pPr = p._p.get_or_add_pPr()
            pPr.set("marL", str(int(Inches(ind))))
            pPr.set("indent", str(int(-Inches(0.34))))
            pPr.set("lvl", str(lvl))
            for tag in ("a:buNone", "a:buChar", "a:buClr", "a:buSzPct", "a:buFont"):
                for e in pPr.findall(qn(tag)):
                    pPr.remove(e)
            bc = etree.SubElement(pPr, qn("a:buClr"))
            etree.SubElement(bc, qn("a:srgbClr")).set("val", C["dot"])
            etree.SubElement(pPr, qn("a:buSzPct")).set("val", "70000")
            bf = etree.SubElement(pPr, qn("a:buFont"))
            bf.set("typeface", D)
            etree.SubElement(pPr, qn("a:buChar")).set("char", "●" if lvl == 0 else "–")
            add_runs(deck, slide, p, text, B, sz, color)
            used += K.text_lines(text, w - ind, B, sz) * sz * K.LINE / 72 + (10 if lvl == 0 else 6) / 72
    set_name(shp, name)
    if used > h + 0.02:
        WARN.append(f"bullets overflow ({used:.2f}in > {h:.2f}in) on slide '{slide_title(slide)}'")
    return used


def slide_title(slide):
    try:
        return slide.shapes.title.text_frame.text
    except Exception:
        return "?"


# ================================================================ cards
def cards(deck, slide, x, y, w, h_avail, cards_, cols, dark=False):
    gap = 0.3
    cw = (w - gap * (cols - 1)) / cols
    rows = [cards_[i:i + cols] for i in range(0, len(cards_), cols)]
    pad = 0.22
    heights = []
    for row in rows:
        hh = 0
        for c in row:
            hh = max(hh, card_height(c, cw - 2 * pad))
        heights.append(hh + 2 * pad)
    total = sum(heights) + gap * (len(rows) - 1)
    if total > h_avail + 0.02:
        WARN.append(f"cards overflow ({total:.2f} > {h_avail:.2f}) on '{slide_title(slide)}'")
    cy = y
    k = 0
    for row, rh in zip(rows, heights):
        for j, c in enumerate(row):
            k += 1
            cx = x + j * (cw + gap)
            box = rect(slide, cx, cy, cw, rh, fill=C["paper_deep"], line=None, name=f"!!card{k}")
            tf = box.text_frame
            tf_setup(tf, inset=pad)
            tf.margin_top = tf.margin_bottom = Inches(pad)
            p = tf.paragraphs[0]
            para_fmt(p, SZ["card_h"], after=6)
            add_runs(deck, slide, p, c["h"], B, SZ["card_h"], C["ink"], bold=True)
            p2 = tf.add_paragraph()
            para_fmt(p2, SZ["card_b"])
            add_runs(deck, slide, p2, c["b"], B, SZ["card_b"], C["ink"])
        cy += rh + gap
    return total


def card_height(c, inner_w):
    return (K.text_lines(c["h"], inner_w, B, SZ["card_h"], bold=True) * SZ["card_h"] * K.LINE + 6
            + K.text_lines(c["b"], inner_w, B, SZ["card_b"]) * SZ["card_b"] * K.LINE) / 72 + 0.04


# ================================================================ tables
def table_shape(deck, slide, tkey, x, y, w, h_avail, cols=None, rows=None, extra_rows=None, name="!!tbl"):
    T = K.load_deck()["tables"][tkey]
    cols = cols or list(range(len(T["header"])))
    r0, r1 = rows or (0, len(T["rows"]))
    ridx = list(range(r0, r1)) + list(extra_rows or [])
    short = T.get("short", {})

    def cell(ri, ci):
        key = f"{ri},{ci}"
        return short.get(key, T["rows"][ri][ci])

    hdr = [T["header"][c] for c in cols]
    body = [[cell(ri, c) for c in cols] for ri in ridx]
    # column widths proportional to content length (min share)
    lens = []
    for j in range(len(cols)):
        L = max([len(K.plain_text(hdr[j]))] + [len(K.plain_text(r[j])) for r in body])
        lens.append(max(L, 8) ** 0.85)
    tot = sum(lens)
    widths = [w * l / tot for l in lens]
    mins = []
    for j in range(len(cols)):
        words = re.findall(r"\S+", " ".join([K.plain_text(hdr[j])] + [K.plain_text(r[j]) for r in body]))
        mins.append(max(K.text_width_in(wd, B, 16, bold=True) for wd in words) + 0.22)
    for _ in range(5):
        short_ = [j for j in range(len(cols)) if widths[j] < mins[j]]
        if not short_:
            break
        need = sum(mins[j] - widths[j] for j in short_)
        rich = [j for j in range(len(cols)) if j not in short_]
        pool = sum(widths[j] - mins[j] for j in rich)
        for j in short_:
            widths[j] = mins[j]
        for j in rich:
            widths[j] -= need * (widths[j] - mins[j]) / pool
    for size in (16, 15, 14):
        pad = 0.08
        rh = []
        for rr, bold in [(hdr, True)] + [(r, False) for r in body]:
            hmax = 0
            for j, t in enumerate(rr):
                n = K.text_lines(t, widths[j] - 2 * pad, B, size, bold=bold)
                hmax = max(hmax, n * size * K.LINE / 72)
            rh.append(hmax * 1.08 + 2 * 0.06 + 0.05)
        if sum(rh) <= h_avail:
            break
    else:
        WARN.append(f"table {tkey} too tall ({sum(rh):.2f} > {h_avail:.2f}) on '{slide_title(slide)}'")
    gf = slide.shapes.add_table(len(rh), len(cols), Inches(x), Inches(y), Inches(w), Inches(sum(rh)))
    tbl = gf.table
    # plain style, our own fills
    tblPr = tbl._tbl.tblPr
    sid = tblPr.find(qn("a:tableStyleId"))
    if sid is None:
        sid = etree.SubElement(tblPr, qn("a:tableStyleId"))
    sid.text = "{5940675A-B579-460E-94D1-54222C63F5DA}"
    tblPr.set("firstRow", "1")
    tblPr.set("bandRow", "0")
    for j, cw in enumerate(widths):
        tbl.columns[j].width = Inches(cw)
    for i, hh in enumerate(rh):
        tbl.rows[i].height = Inches(hh)
    for i, rr in enumerate([hdr] + body):
        for j, t in enumerate(rr):
            c = tbl.cell(i, j)
            c.margin_left = c.margin_right = Inches(0.08)
            c.margin_top = c.margin_bottom = Inches(0.06)
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.fill.solid()
            c.fill.fore_color.rgb = rgb(C["paper_deep"] if i == 0 else (C["paper"] if i % 2 else "EFE6CF"))
            tf = c.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            para_fmt(p, size)
            last_total = (i == len(rh) - 1 and re.match(r"(?i)^total", K.plain_text(rr[0])))
            add_runs(deck, slide, p, t, B, size, C["ink"], bold=(i == 0 or bool(last_total)))
            _cell_borders(c)
    set_name(gf, name, descr=f"{T['caption']}. Editable table, {len(body)} rows.")
    return T, sum(rh), size


def _cell_borders(c):
    tcPr = c._tc.get_or_add_tcPr()
    for tag in ("a:lnL", "a:lnR", "a:lnT", "a:lnB"):
        ln = etree.SubElement(tcPr, qn(tag))
        ln.set("w", "6350" if tag in ("a:lnT", "a:lnB") else "0")
        if tag in ("a:lnT", "a:lnB"):
            sf = etree.SubElement(ln, qn("a:solidFill"))
            etree.SubElement(sf, qn("a:srgbClr")).set("val", "9AA6B2")
        else:
            etree.SubElement(ln, qn("a:noFill"))
    # schema order: lnL lnR lnT lnB ... fill  -> move fill after borders
    fills = [e for e in tcPr if e.tag in (qn("a:solidFill"), qn("a:noFill")) and e.getparent() is tcPr]
    for f in fills:
        tcPr.remove(f)
        tcPr.append(f)


def caption_and_source(deck, slide, caption, source, x, y, w, note=None, name_cap=None):
    """Caption above (14pt italic display) is optional; Source line below (12pt)."""
    h = 0
    paras = [source] + ([note] if note else [])
    hh = K.block_height_in(paras, w, B, SZ["src"], 2, italic=True)
    nm = "Source line"
    existing = {s_.name for s_ in slide.shapes}
    k = 2
    while nm in existing:
        nm = f"Source line {k}"; k += 1
    textbox(deck, slide, x, y, w, hh + 0.04, paras, B, SZ["src"], C["ink_soft"], italic=True, after=2,
            name=nm)
    return hh


# ================================================================ charts
def chart_shape(deck, slide, key, x, y, w, h, name="!!chart"):
    ch = K.all_charts()[key]
    t = ch["type"]
    cd = CategoryChartData(number_format=ch.get("number_format", "General"))
    cd.categories = ch["categories"]
    for s in ch["series"]:
        cd.add_series(s["name"], s["values"])
    ctype = {"bar_stacked": XL_CHART_TYPE.COLUMN_STACKED, "bar_clustered": XL_CHART_TYPE.COLUMN_CLUSTERED,
             "bar_horizontal": XL_CHART_TYPE.BAR_CLUSTERED, "bar_horizontal_stacked100": XL_CHART_TYPE.BAR_STACKED_100,
             "line": XL_CHART_TYPE.LINE_MARKERS, "doughnut": XL_CHART_TYPE.DOUGHNUT}[t]
    gf = slide.shapes.add_chart(ctype, Inches(x), Inches(y), Inches(w), Inches(h), cd)
    chart = gf.chart
    chart.font.name = B
    chart.font.size = Pt(13)
    chart.font.color.rgb = rgb(C["ink"])
    chart.has_title = True
    chart.chart_title.text_frame.text = re.sub(r"^Figure \d+\.\s*", lambda m: m.group(0), ch["caption"])
    tp = chart.chart_title.text_frame.paragraphs[0]
    for r in tp.runs:
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.name = B
        r.font.color.rgb = rgb(C["ink"])
    multi = len(ch["series"]) > 1 or t == "doughnut"
    chart.has_legend = multi
    if multi:
        chart.legend.position = XL_LEGEND_POSITION.BOTTOM
        chart.legend.include_in_layout = False
        chart.legend.font.size = Pt(13)
        chart.legend.font.name = B
    plot = chart.plots[0]
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.font.size = Pt(12)
    dl.font.name = B
    dl.number_format = ch.get("number_format", "General")
    dl.number_format_is_linked = False
    if t in ("bar_clustered", "bar_horizontal"):
        dl.position = XL_LABEL_POSITION.OUTSIDE_END
    elif t == "line":
        dl.position = XL_LABEL_POSITION.ABOVE
    elif t in ("bar_stacked", "bar_horizontal_stacked100"):
        dl.position = XL_LABEL_POSITION.CENTER
    if t == "doughnut":
        dl.show_category_name = False
        dl.show_percentage = False
        for i, pt in enumerate(plot.series[0].points):
            pt.format.fill.solid()
            pt.format.fill.fore_color.rgb = rgb(SERIES[i % len(SERIES)])
    else:
        if hasattr(plot, "gap_width"):
            plot.gap_width = 60
        if t in ("bar_stacked", "bar_horizontal_stacked100"):
            plot.overlap = 100
        for i, s in enumerate(plot.series):
            col = SERIES[i % len(SERIES)]
            if t == "line":
                s.format.line.color.rgb = rgb(col)
                s.format.line.width = Pt(2.5)
                s.marker.format.fill.solid()
                s.marker.format.fill.fore_color.rgb = rgb(C["dot"])
                s.smooth = False
            else:
                s.format.fill.solid()
                s.format.fill.fore_color.rgb = rgb(col)
            # white labels on dark fills inside stacks
            if t in ("bar_stacked", "bar_horizontal_stacked100") and col in ("2E4257", "B4432F", "7F93A8"):
                s.data_labels.font.color.rgb = rgb("FFFFFF") if col != "7F93A8" else rgb(C["ink"])
                s.data_labels.font.size = Pt(12)
                s.data_labels.number_format = ch.get("number_format", "General")
                s.data_labels.number_format_is_linked = False
                s.data_labels.position = XL_LABEL_POSITION.CENTER
        va = chart.value_axis
        va.has_major_gridlines = True
        va.major_gridlines.format.line.color.rgb = rgb("CFC6B0")
        va.format.line.fill.background()
        va.tick_labels.font.size = Pt(12)
        va.tick_labels.font.name = B
        ca = chart.category_axis
        ca.tick_labels.font.size = Pt(12 if t != "bar_horizontal_stacked100" else 13)
        ca.tick_labels.font.name = B
        ca.format.line.color.rgb = rgb(C["ink_soft"])
        if t == "line":
            va.minimum_scale = 2.0
            va.maximum_scale = 2.7
        else:
            va.minimum_scale = 0
        if t == "bar_horizontal_stacked100":
            for s in plot.series:
                s.invert_if_negative = False
        if t in ("bar_horizontal",):
            va.maximum_scale = 250
            ca.reverse_order = True
        if t == "bar_horizontal_stacked100":
            ca.reverse_order = True
    data_desc = "; ".join(f"{s['name']}: " + ", ".join(f"{c} {v if v is not None else 'n/a'}"
                                                         for c, v in zip(ch["categories"], s["values"]))
                          for s in ch["series"])
    set_name(gf, name, descr=f"{ch['caption']}. Native chart. {data_desc}")
    return ch


# ================================================================ transitions
def set_transition(slide, kind, dur_ms):
    sld = slide._element
    for old in sld.findall(qn("p:transition")):
        sld.remove(old)
    for old in sld.findall(f"{{{NS['mc']}}}AlternateContent"):
        sld.remove(old)
    if kind == "none":
        return
    if kind == "morph":
        xml = (f'<mc:AlternateContent xmlns:mc="{NS["mc"]}" xmlns:p="{NS["p"]}">'
               f'<mc:Choice xmlns:p159="{NS["p159"]}" xmlns:p14="{NS["p14"]}" Requires="p159">'
               f'<p:transition spd="slow" p14:dur="{dur_ms}"><p159:morph option="byObject"/></p:transition>'
               f'</mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback>'
               f'</mc:AlternateContent>')
    else:  # quick fade
        xml = (f'<mc:AlternateContent xmlns:mc="{NS["mc"]}" xmlns:p="{NS["p"]}">'
               f'<mc:Choice xmlns:p14="{NS["p14"]}" Requires="p14">'
               f'<p:transition spd="fast" p14:dur="{dur_ms}"><p:fade/></p:transition>'
               f'</mc:Choice><mc:Fallback><p:transition spd="fast"><p:fade/></p:transition></mc:Fallback>'
               f'</mc:AlternateContent>')
    el = etree.fromstring(xml)
    # insert after clrMapOvr (before timing/extLst)
    clr = sld.find(qn("p:clrMapOvr"))
    idx = list(sld).index(clr) + 1 if clr is not None else len(sld)
    sld.insert(idx, el)


# ================================================================ notes
def notes_for(s):
    """Verbatim notes from the paper (drafting marks removed) + figure/table basis."""
    P = K.load_paper()["sections"]
    out, pages, secs = [], set(), []
    for kind, sid, item in K.resolve_notes(s.get("notes", [])):
        if kind == "para":
            if sid not in secs:
                secs.append(sid)
                out.append(f"— Paper {P[sid]['title']} —")
            out.append(f"[p. {item['page']}, ¶{item['n']}] " + K.strip_draft(item["text"]))
            pages.add(item["page"])
        elif kind == "heading":
            out.append(f"— Paper {P[sid]['title']} (p. {P[sid]['page']}) —")
            pages.add(P[sid]["page"])
        elif kind == "table":
            T = K.load_deck()["tables"][sid]
            pages.add(T["page"])
            out.append(f"[p. {T['page']}] {T['caption']} (full table, all cells verbatim)")
            out.append(" | ".join(T["header"]))
            for r in T["rows"]:
                out.append(" | ".join(K.plain_text(c) for c in r))
            out.append(K.plain_text(T["source"]))
            if T.get("note"):
                out.append(K.plain_text(T["note"]))
            if T.get("short"):
                out.append("Shortened on the slide: " + "; ".join(
                    f"row {int(k.split(',')[0])+1}, column '{T['header'][int(k.split(',')[1])]}'" for k in T["short"]))
        elif kind == "chart":
            ch = K.all_charts()[sid]
            out.append(f"{ch['caption']}")
            if ch.get("basis"):
                out.append("Chart data basis: " + ch["basis"])
            if ch.get("source"):
                out.append(K.plain_text(ch["source"]))
    return "\n\n".join(out), sorted(pages)


def pages_str(pages):
    if not pages:
        return ""
    return str(pages[0]) if len(pages) == 1 else f"{pages[0]}–{pages[-1]}"


# ================================================================ slide kinds
def build_cover(deck, s, idx):
    m = K.load_deck()["meta"]
    sl = deck.new_slide("IBRD Cover")
    chrome(deck, sl, idx, "cover", dark=True, divider=True)
    # remove subtitle placeholder: we lay out text boxes for the cover block
    for ph in list(sl.placeholders):
        if ph.placeholder_format.idx == 1:
            ph._element.getparent().remove(ph._element)
    textbox(deck, sl, ML, 0.42, 9, 0.32, f"{m['university'].upper()} · {m['faculty']} · {m['course'].upper()}",
            B, 14, C["paper"], bold=True, spc=2.5, name="!!section")
    t = sl.shapes.title
    t.left, t.top, t.width, t.height = Inches(ML), Inches(0.9), Inches(8.6), Inches(2.3)
    tf = t.text_frame
    tf_setup(tf)
    p = tf.paragraphs[0]
    para_fmt(p, 150, line=0.95)
    add_runs(deck, sl, p, "IBRD", D, 150, C["paper"], spc=6)
    set_name(t, "!!title")
    textbox(deck, sl, ML, 3.05, 8.4, 1.2, "and its Development Project Financing Activities in Vietnam",
            D, 34, C["paper"], italic=True, name="!!subtitle")
    textbox(deck, sl, ML, 4.35, 6.2, 0.36, m["group"].upper(), B, 16, C["paper"], bold=True, spc=2)
    textbox(deck, sl, ML, 4.72, 6.2, 1.7, m["members"], B, 16, C["paper"])
    textbox(deck, sl, 5.4, 4.72, 4.4, 0.36, "Class: " + m["class"], B, 16, C["paper"])
    lb = rect(sl, 5.4, 5.2, 4.2, 0.46, fill=None, line="F2C9BE", line_w=1.5, name="Lecturer placeholder")
    tf = lb.text_frame
    tf_setup(tf, inset=0.1, anchor=MSO_ANCHOR.MIDDLE)
    para_fmt(tf.paragraphs[0], 16)
    add_runs(deck, sl, tf.paragraphs[0], m["lecturer"], B, 16, "FFE2DA", bold=True)
    textbox(deck, sl, 5.4, 5.85, 4.4, 0.36, m["place"], B, 16, C["paper"])
    fit_picture(sl, ART / "bank.png", 9.0, 0.5, 4.1, 3.0, "!!art", descr="Engraving-style line drawing of a classical bank building (original illustration)")
    slide_number(deck, sl, idx, dark=True)
    return sl


def build_agenda(deck, s, idx, divider_slides):
    sl = deck.new_slide("IBRD Title Only")
    chrome(deck, sl, idx, "cover")
    section_tag(deck, sl, "IBRD · GROUP 6")
    title_ph(deck, sl, s["title"])
    y = TOP
    for k, it in enumerate(s["items"], 1):
        box = rect(sl, ML, y, CW - 4.3, 0.86, fill=C["paper_deep"], name=f"!!card{k}")
        tf = box.text_frame
        tf_setup(tf, inset=0.25, anchor=MSO_ANCHOR.MIDDLE)
        p = tf.paragraphs[0]
        para_fmt(p, 24)
        add_runs(deck, sl, p, f"{k:02d}  ", D, 30, C["dot"], bold=True)
        add_runs(deck, sl, p, it["h"] + " — ", B, 22, C["ink"], bold=True)
        add_runs(deck, sl, p, it["b"], B, 20, C["ink"])
        deck.slide_links.append((box, sl, ("divider", k - 1), "shape"))
        y += 0.98
    fit_picture(sl, ART / "globe.png", 8.9, 1.6, 3.9, 4.9, "!!art", descr="Engraving-style globe (original illustration)")
    textbox(deck, sl, ML, 6.62, 8, 0.3, "Click a part to jump to its opening slide.", B, 12, C["ink_soft"], italic=True)
    slide_number(deck, sl, idx)
    return sl


def build_divider(deck, s, idx):
    sec = K.load_deck()["sections"][s["section"]]
    sl = deck.new_slide("IBRD Chapter Opener")
    chrome(deck, sl, idx, s["section"], dark=True, divider=True)
    word = sec["giant"]
    size = 220 if len(word) <= 5 else (170 if len(word) <= 7 else 128)
    while K.text_width_in(word, D, size, spc=6) > CW and size > 90:
        size -= 6
    textbox(deck, sl, ML - 0.1, 0.55, CW + 0.2, size / 72 * 1.05, word, D, size, C["paper"], name="!!section",
            spc=6, line=0.95)
    # text placeholder for the chapter label
    body = [ph for ph in sl.placeholders if ph.placeholder_format.idx == 1]
    tsize = 40
    nl = K.text_lines(s["title"].upper(), 8.4, D, tsize)
    th = nl * tsize * 1.0 / 72 + 0.1
    ty = 6.1 - th
    title_ph(deck, sl, s["title"], x=ML, y=ty, w=8.4, h=th, size=tsize, color=C["paper"])
    if body:
        b = body[0]
        b.left, b.top, b.width, b.height = Inches(ML), Inches(6.2), Inches(8.4), Inches(0.5)
        tf = b.text_frame
        tf_setup(tf)
        p = tf.paragraphs[0]
        para_fmt(p, 24)
        pPr = p._p.get_or_add_pPr()
        etree.SubElement(pPr, qn("a:buNone"))
        add_runs(deck, sl, p, s["sub"], D, 26, "F2E6CC", italic=True)
        set_name(b, "!!sub")
    fit_picture(sl, ART / f"{s['art']}.png", 9.3, 3.3, 3.6, 3.6, "!!art", descr="Original engraving-style illustration",
                align="center")
    slide_number(deck, sl, idx, dark=True)
    return sl


def content_base(deck, s, idx, layout="IBRD Title Only"):
    sec = K.load_deck()["sections"][s["section"]]
    sl = deck.new_slide(layout)
    chrome(deck, sl, idx, s["section"])
    section_tag(deck, sl, sec["giant"] + "  ·  " + sec["label"].split("·", 1)[-1].strip() if "·" in sec["label"] else sec["giant"])
    title_ph(deck, sl, s["title"])
    if s.get("ref"):
        ref_line(deck, sl, s)
    return sl


def lead_line(deck, sl, text, y=TOP, w=CW):
    h = K.text_lines(text, w, D, 26, italic=True) * 26 * K.LINE / 72
    textbox(deck, sl, ML, y, w, h + 0.05, text, D, 26, C["ink"], italic=True, name="!!lead")
    return h + 0.2


def build_bullets(deck, s, idx):
    sl = content_base(deck, s, idx, "IBRD Title and Bullets")
    body = [ph for ph in sl.placeholders if ph.placeholder_format.idx == 1][0]
    tw = 8.7
    bullets_box(deck, sl, ML, TOP + 0.05, tw, BOT - TOP - 0.05, s["bullets"], placeholder=body)
    fit_picture(sl, ART / f"{s['art']}.png", 9.65, 2.0, 3.1, 4.5, "!!art",
                descr="Original engraving-style illustration (decorative)", decorative=True)
    return sl


def build_cards(deck, s, idx):
    sl = content_base(deck, s, idx)
    y = TOP
    if s.get("lead"):
        y += lead_line(deck, sl, s["lead"])
    cards(deck, sl, ML, y, CW, BOT - y, s["cards"], s["cols"])
    return sl


def build_bignums(deck, s, idx):
    sl = content_base(deck, s, idx, "IBRD Title and Bullets")
    n = len(s["nums"])
    gap = 0.3
    cw = (CW - gap * (n - 1)) / n
    for k, it in enumerate(s["nums"], 1):
        x = ML + (k - 1) * (cw + gap)
        size = 60 if len(it["v"]) <= 8 else 48
        textbox(deck, sl, x, TOP - 0.05, cw, size / 72 + 0.08, it["v"], D, size, C["ink"], bold=True, name=f"!!num{k}", line=1.0)
        lh = K.text_lines(it["l"], cw, B, 16) * 16 * K.LINE / 72
        textbox(deck, sl, x, TOP + 0.82, cw, lh + 0.05, it["l"], B, 16, C["ink_soft"], name=f"!!numl{k}")
    body = [ph for ph in sl.placeholders if ph.placeholder_format.idx == 1][0]
    lmax = max(K.text_lines(it["l"], cw, B, 16) for it in s["nums"]) * 16 * K.LINE / 72
    y = TOP + 0.82 + lmax + 0.18
    bullets_box(deck, sl, ML, y, CW, BOT - y, s["bullets"], placeholder=body)
    return sl


def build_timeline(deck, s, idx):
    sl = content_base(deck, s, idx)
    items = s["items"]
    n = len(items)
    rows = [items] if n <= 5 else [items[:3], items[3:]]
    y0 = TOP + (0.75 if len(rows) == 1 else 0.35)
    k = 0
    for ri, row in enumerate(rows):
        cw = CW / (len(row) if len(rows) == 1 else 3)
        rect(sl, ML, y0 + 0.62, CW, 0.03, fill=C["ink"], name="!!axis" if ri == 0 else "Axis 2")
        hmax = 0
        for j, it in enumerate(row):
            k += 1
            x = ML + j * cw
            dsz = 30
            while K.text_width_in(it["d"], D, dsz, bold=True) > cw - 0.4 and dsz > 20:
                dsz -= 2
            textbox(deck, sl, x, y0 - 0.05, cw - 0.3, 0.6, it["d"], D, dsz, C["ink"], bold=True, name=f"Date {k}")
            rect(sl, x + 0.02, y0 + 0.5, 0.26, 0.26, fill=C["dot"], shape=MSO_SHAPE.OVAL, name=f"!!tick{k}" if k <= 5 else f"Tick {k}")
            h = K.text_lines(it["t"], cw - 0.3, B, 20) * 20 * K.LINE / 72
            hmax = max(hmax, h)
            textbox(deck, sl, x, y0 + 1.0, cw - 0.3, h + 0.05, it["t"], B, 20, C["ink"], name=f"Event {k}")
        y0 += 1.0 + hmax + 0.35
    if y0 - 0.35 > BOT + 0.02:
        WARN.append(f"timeline overflow on '{s['title']}'")
    return sl


def build_flow(deck, s, idx):
    sl = content_base(deck, s, idx)
    st = s["steps"]
    n = len(st)
    gap = 0.45
    cw = (CW - gap * (n - 1)) / n
    pad = 0.18
    hmax = max(card_height(c, cw - 2 * pad) for c in st) + 2 * pad
    for k, c in enumerate(st, 1):
        x = ML + (k - 1) * (cw + gap)
        box = rect(sl, x, TOP, cw, hmax, fill=C["paper_deep"] if c["h"] != "IBRD" else C["mist"], name=f"!!card{k}")
        tf = box.text_frame
        tf_setup(tf, inset=pad)
        tf.margin_top = tf.margin_bottom = Inches(pad)
        p = tf.paragraphs[0]
        para_fmt(p, SZ["card_h"], after=6)
        add_runs(deck, sl, p, c["h"], B, SZ["card_h"], C["ink"], bold=True)
        p2 = tf.add_paragraph()
        para_fmt(p2, SZ["card_b"])
        add_runs(deck, sl, p2, c["b"], B, SZ["card_b"], C["ink"])
        if k < n:
            ar = sl.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(x + cw + 0.07), Inches(TOP + hmax / 2 - 0.15),
                                     Inches(gap - 0.14), Inches(0.3))
            ar.fill.solid(); ar.fill.fore_color.rgb = rgb(C["dot"]); ar.line.fill.background()
            set_name(ar, f"Arrow {k}", descr="")
    body_y = TOP + hmax + 0.35
    bullets_box(deck, sl, ML, body_y, CW, BOT - body_y, s["bullets"])
    return sl


def build_cycle(deck, s, idx):
    import math
    sl = content_base(deck, s, idx)
    lead_w = 4.1
    lh = K.text_lines(s["lead"], lead_w, D, 28, italic=True) * 28 * K.LINE / 72
    textbox(deck, sl, ML, TOP + 0.3, lead_w, lh + 0.1, s["lead"], D, 28, C["ink"], italic=True, name="!!lead")
    cx, cy, R = 8.95, 4.15, 1.85
    ring = rect(sl, cx - R, cy - R, 2 * R, 2 * R, fill=None, line=C["ink_soft"], shape=MSO_SHAPE.OVAL, name="!!ring", line_w=1.25)
    fit_picture(sl, ART / "compass.png", cx - 0.9, cy - 0.9, 1.8, 1.8, "!!art", decorative=True)
    for k, label in enumerate(s["steps"], 1):
        a = -math.pi / 2 + (k - 1) * 2 * math.pi / 6
        px, py = cx + R * math.cos(a), cy + R * math.sin(a)
        c = rect(sl, px - 0.28, py - 0.28, 0.56, 0.56, fill=C["dot"], shape=MSO_SHAPE.OVAL, name=f"Stage marker {k}")
        tf = c.text_frame
        tf_setup(tf, anchor=MSO_ANCHOR.MIDDLE)
        para_fmt(tf.paragraphs[0], 20, PP_ALIGN.CENTER)
        add_runs(deck, sl, tf.paragraphs[0], str(k), D, 22, "FFFFFF", bold=True)
        lw = 2.2
        right = math.cos(a) > 0.2
        left = math.cos(a) < -0.2
        if not (right or left):
            lw = 3.4
        lx = px + 0.38 if right else (px - 0.38 - lw if left else px - lw / 2)
        ly = py - 0.3 if (right or left) else (py - 0.95 if math.sin(a) < 0 else py + 0.35)
        al = PP_ALIGN.LEFT if right else (PP_ALIGN.RIGHT if left else PP_ALIGN.CENTER)
        lh_ = K.text_lines(label, lw, B, 20, bold=True) * 20 * K.LINE / 72 + 0.06
        if not (right or left) and math.sin(a) < 0:
            ly = py - 0.35 - lh_
        textbox(deck, sl, lx, ly, lw, lh_, label, B, 20, C["ink"], bold=True, align=al, name=f"Stage {k}")
    return sl


def build_grid(deck, s, idx):
    sl = content_base(deck, s, idx)
    y = TOP
    if s.get("lead"):
        y += lead_line(deck, sl, s["lead"])
    items = s["items"]
    gap = 0.3
    cw = (CW - gap) / 2
    rows = (len(items) + 1) // 2
    pairs = [(items[r], items[r + rows] if r + rows < len(items) else None) for r in range(rows)]
    for r, (a, b_) in enumerate(pairs):
        hh = 0
        for c, it in enumerate((a, b_)):
            if it is None:
                continue
            code, rest = it.split(":", 1)
            txt = f"**{code}:**{rest}"
            h = K.text_lines(txt, cw, B, 20) * 20 * K.LINE / 72 + 0.04
            hh = max(hh, h)
            textbox(deck, sl, ML + c * (cw + gap), y, cw, h, txt, B, 20, C["ink"], name=f"Standard {r + 1 + c * rows}")
        y += hh + 0.14
    if y > BOT + 0.02:
        WARN.append(f"grid overflow on '{s['title']}'")
    return sl


def build_table(deck, s, idx):
    sl = content_base(deck, s, idx)
    T = K.load_deck()["tables"][s["table"]]
    y = TOP
    if s.get("lead"):
        y += lead_line(deck, sl, s["lead"])
    cap_h = 0.36
    textbox(deck, sl, ML, y, CW, cap_h, T["caption"], B, 14, C["ink_soft"], bold=True, name="Table caption")
    y += cap_h + 0.04
    note = T.get("note") if s.get("show_note") else None
    src_h = K.block_height_in([T["source"]] + ([note] if note else []), CW, B, SZ["src"], 2, italic=True)
    _, th, _ = table_shape(deck, sl, s["table"], ML, y, CW, BOT - y - src_h - 0.12, s.get("cols"), s.get("rows"),
                           s.get("extra_rows"))
    caption_and_source(deck, sl, None, T["source"], ML, y + th + 0.1, CW, note=note)
    return sl


def build_table_chart(deck, s, idx):
    sl = content_base(deck, s, idx)
    T = K.load_deck()["tables"][s["table"]]
    tw = 6.2
    y = TOP
    textbox(deck, sl, ML, y, tw, 0.6, T["caption"], B, 14, C["ink_soft"], bold=True, name="Table caption")
    y += 0.62
    src_h = K.block_height_in([T["source"]], tw, B, SZ["src"], 2, italic=True)
    _, th, _ = table_shape(deck, sl, s["table"], ML, y, tw, BOT - y - src_h - 0.15, s.get("cols"), s.get("rows"))
    caption_and_source(deck, sl, None, T["source"], ML, y + th + 0.1, tw)
    ch = K.all_charts()[s["chart"]]
    cx = ML + tw + 0.35
    cwid = W - MR - cx
    src = ch.get("source", "")
    sh = K.block_height_in([src], cwid, B, SZ["src"], 2, italic=True)
    chart_shape(deck, sl, s["chart"], cx, TOP, cwid, BOT - TOP - sh - 0.12)
    caption_and_source(deck, sl, None, src, cx, BOT - sh, cwid)
    return sl


def build_table_nums(deck, s, idx):
    sl = content_base(deck, s, idx)
    T = K.load_deck()["tables"][s["table"]]
    tw = 7.6
    y = TOP
    textbox(deck, sl, ML, y, tw, 0.36, T["caption"], B, 14, C["ink_soft"], bold=True, name="Table caption")
    y += 0.42
    src_h = K.block_height_in([T["source"]], tw, B, SZ["src"], 2, italic=True)
    _, th, _ = table_shape(deck, sl, s["table"], ML, y, tw, BOT - y - src_h - 0.15, s.get("cols"), s.get("rows"))
    caption_and_source(deck, sl, None, T["source"], ML, y + th + 0.1, tw)
    x = ML + tw + 0.45
    w = W - MR - x
    yy = TOP
    for k, it in enumerate(s["nums"], 1):
        textbox(deck, sl, x, yy, w, 0.86, it["v"], D, 56, C["ink"], bold=True, name=f"!!num{k}", line=1.0)
        lh = K.text_lines(it["l"], w, B, 16) * 16 * K.LINE / 72
        textbox(deck, sl, x, yy + 0.82, w, lh + 0.05, it["l"], B, 16, C["ink_soft"], name=f"!!numl{k}")
        yy += 0.82 + lh + 0.3
    return sl


def build_chart(deck, s, idx):
    sl = content_base(deck, s, idx, "IBRD Title and Bullets")
    body = [ph for ph in sl.placeholders if ph.placeholder_format.idx == 1][0]
    bw = 5.55
    bullets_box(deck, sl, ML, TOP + 0.05, bw, BOT - TOP - 0.05, s["bullets"], placeholder=body)
    ch = K.all_charts()[s["chart"]]
    cx = ML + bw + 0.35
    cwid = W - MR - cx
    src = ch.get("source", "")
    sh = K.block_height_in([src], cwid, B, SZ["src"], 2, italic=True)
    chart_shape(deck, sl, s["chart"], cx, TOP, cwid, BOT - TOP - sh - 0.12)
    caption_and_source(deck, sl, None, src, cx, BOT - sh, cwid)
    return sl


def build_chart_image(deck, s, idx):
    sl = content_base(deck, s, idx, "IBRD Title and Bullets")
    ch = K.all_charts()[s["chart"]]
    img = K.all_charts()[s["image"]]
    body = [ph for ph in sl.placeholders if ph.placeholder_format.idx == 1][0]
    bh = 1.62
    bullets_box(deck, sl, ML, BOT - bh, CW, bh, s["bullets"], placeholder=body)
    top_h = BOT - bh - TOP - 0.15
    cwid = 6.1
    src = ch.get("source", "")
    chart_shape(deck, sl, s["chart"], ML, TOP, cwid, top_h - 0.3)
    caption_and_source(deck, sl, None, src + " Adjusted values for Dong Hoi and Nha Trang are not stated in the paper’s text.",
                       ML, TOP + top_h - 0.28, cwid)
    x = ML + cwid + 0.35
    w = (W - MR - x - 0.2) / 2
    textbox(deck, sl, x, TOP, W - MR - x, 0.34, img["caption"], B, 13, C["ink_soft"], italic=True, name="Image caption")
    for k, f in enumerate(img["files"]):
        fit_picture(sl, ART / f, x + k * (w + 0.2), TOP + 0.4, w, top_h - 0.45, f"!!img{k+1}",
                    descr=f"Original Figure 8 from the paper ({'plan' if k == 0 else 'adjusted'}), reproduced as an image because its bars carry no value labels")
    return sl


# ------------------------------------------------ back matter
def build_references(deck, idx_start):
    """Paginate full reference list (verbatim, drafting marks removed); returns slides."""
    refs = K.load_paper()["refs"]
    entries = []
    for n in sorted(refs):
        text, url = K.ref_parts(n)
        entries.append((n, text, url))
    col_w = (CW - 0.4) / 2
    size = 13
    avail = BOT - TOP + 0.1
    pages, cur, cur_h, col = [], [[], []], 0.0, 0
    for n, text, url in entries:
        h = K.block_height_in([f"[{n}] {text} {url or ''}"], col_w, B, size, 5)
        if cur_h + h > avail:
            if col == 0:
                col, cur_h = 1, 0.0
            else:
                pages.append(cur)
                cur, cur_h, col = [[], []], 0.0, 0
        cur[col].append((n, text, url))
        cur_h += h
    pages.append(cur)
    slides = []
    for pi, page in enumerate(pages, 1):
        idx = idx_start + pi - 1
        sl = deck.new_slide("IBRD Title Only")
        chrome(deck, sl, idx, "refs")
        section_tag(deck, sl, "SOURCES  ·  REFERENCES")
        title_ph(deck, sl, f"References ({pi}/{len(pages)})")
        for ci, colitems in enumerate(page):
            x = ML + ci * (col_w + 0.4)
            tb = sl.shapes.add_textbox(Inches(x), Inches(TOP - 0.15), Inches(col_w), Inches(avail))
            tf = tb.text_frame
            tf_setup(tf)
            for k, (n, text, url) in enumerate(colitems):
                p = tf.paragraphs[0] if k == 0 else tf.add_paragraph()
                para_fmt(p, size, after=5)
                add_runs(deck, sl, p, f"[{n}]", B, 14, C["ink"], bold=True)
                add_runs(deck, sl, p, " ", B, size, C["ink"])
                r = p.add_run()
                r.text = text
                _font(r, B, size, C["ink"])
                if url:
                    r2 = p.add_run()
                    r2.text = " " + url
                    _font(r2, B, size, C["wash"])
                    r2.hyperlink.address = url
            set_name(tb, f"!!refs{ci+1}")
        slide_number(deck, sl, idx)
        slides.append(sl)
    return slides


def _font(r, face, size, color, bold=False, italic=False):
    r.font.name = face
    fallback_hint(r._r.get_or_add_rPr())
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = rgb(color)


def build_index(deck, idx):
    sl = deck.new_slide("IBRD Title Only")
    chrome(deck, sl, idx, "refs")
    section_tag(deck, sl, "SOURCES  ·  INDEX")
    title_ph(deck, sl, "Index of sources")
    refs = K.load_paper()["refs"]
    ns = sorted(refs)
    cols = 10
    cw = CW / cols
    rows = (len(ns) + cols - 1) // cols
    rh = (BOT - TOP - 0.1) / rows
    textbox(deck, sl, ML, TOP - 0.2, CW, 0.32, "Click a number to open its source card; the card's “Back” button returns to the slide you came from.",
            B, 13, C["ink_soft"], italic=True, name="Index hint")
    for k, n in enumerate(ns):
        r, c = divmod(k, cols)
        x = ML + c * cw
        y = TOP + 0.15 + r * rh
        box = rect(sl, x + 0.04, y, cw - 0.08, rh - 0.1, fill=C["paper_deep"], name=f"Index {n}")
        tf = box.text_frame
        tf_setup(tf, inset=0.03, anchor=MSO_ANCHOR.MIDDLE)
        p = tf.paragraphs[0]
        para_fmt(p, 16, PP_ALIGN.CENTER)
        add_runs(deck, sl, p, f"[{n}]", B, 16, C["ink"], bold=True)
        p2 = tf.add_paragraph()
        para_fmt(p2, 12, PP_ALIGN.CENTER)
        r2 = p2.add_run()
        r2.text = short_label(n)
        _font(r2, B, 12, C["ink_soft"])
        deck.slide_links.append((box, sl, ("card", n), "shape"))
    slide_number(deck, sl, idx)
    return sl


def short_label(n):
    text, _ = K.ref_parts(n)
    m = re.match(r"(.+?)\.?\s*\((\d{4}|n\.d\.)", text)
    if not m:
        return ""
    a = m.group(1)
    a = {"International Bank for Reconstruction and Development": "IBRD",
         "Independent Evaluation Group": "IEG", "Government of Vietnam": "Gov. VN",
         "World Bank Group Archives": "WBG Archives", "World Bank Accountability Mechanism": "WB Acc.",
         "World Bank Treasury": "WB Treasury", "World Bank Group": "WBG", "World Bank": "WB",
         "Asian Development Bank": "ADB", "Inspection Panel": "Insp. Panel", "Viet Nam News": "VN News"}.get(a, a.split(",")[0])
    return f"{a} {m.group(2)}"


def build_credits(deck, idx):
    sl = deck.new_slide("IBRD Title Only")
    chrome(deck, sl, idx, "refs")
    section_tag(deck, sl, "SOURCES  ·  CREDITS")
    title_ph(deck, sl, "Credits")
    items = [
        "**Content:** Group 6, “IBRD and its Development Project Financing Activities in Vietnam” (Project Finance, NEU, Investment Economics 65). All figures, names and citations are taken from the paper.",
        "**Illustrations:** bank, globe, pylon, coastal city, bridge, ledger and coins, decree scroll, compass rose and red dots are original line drawings made for this deck (scripts/make_art.py, SVG → PNG). Paper and watercolor grounds are generated textures.",
        "**Charts:** rebuilt as native PowerPoint charts from numbers printed in the paper's tables, text or figure labels. Figure 8's two original images are reproduced from the paper because their bars carry no labels.",
        "**Fonts:** Cormorant Garamond (Christian Thalmann, Catharsis Fonts) and Be Vietnam Pro (Lâm Bảo, Tony Le, ViệtAnh Nguyễn), both SIL Open Font License 1.1 (fonts/).",
        "**Style reference:** layout mood only (cream paper, blue watercolor, engravings, red dots) from a third-party slide design; no image or text reused.",
    ]
    textbox(deck, sl, ML, TOP - 0.1, 8.7, BOT - TOP + 0.1, items, B, 15, C["ink"], name="Credits text", after=9)
    hh = K.block_height_in(items, 8.7, B, 15, 9)
    if hh > BOT - TOP + 0.1:
        WARN.append(f"credits overflow {hh:.2f}")
    fit_picture(sl, ART / "scroll.png", 9.7, 1.9, 3.0, 4.6, "!!art", decorative=True)
    slide_number(deck, sl, idx)
    return sl


def build_thanks(deck, idx):
    sl = deck.new_slide("IBRD Chapter Opener")
    chrome(deck, sl, idx, "refs", dark=True, divider=True)
    for ph in list(sl.placeholders):
        if ph.placeholder_format.idx == 1:
            ph._element.getparent().remove(ph._element)
    textbox(deck, sl, ML, 0.55, 11, 0.4, "IBRD · GROUP 6 · PROJECT FINANCE", B, 14, C["paper"], bold=True, spc=2.5, name="!!section")
    title_ph(deck, sl, "Thank you", x=ML, y=2.0, w=9.0, h=1.9, size=130, color=C["paper"], italic=True)
    for r in sl.shapes.title.text_frame.paragraphs[0].runs:
        r._r.get_or_add_rPr().set("cap", "none")
    textbox(deck, sl, ML, 4.2, 8.5, 0.9, "for your attention", D, 40, "F2E6CC", italic=True, name="!!subtitle")
    fit_picture(sl, ART / "globe.png", 9.4, 1.2, 3.4, 5.2, "!!art", descr="Original engraving-style globe", decorative=True)
    slide_number(deck, sl, idx, dark=True)
    return sl


# ------------------------------------------------ source cards
def build_cards_for_sources(deck, usages, first_idx):
    """usages: {n: [entry...]} -> creates hidden card slides; returns {n: [slides]}, page map."""
    refs = K.load_paper()["refs"]
    result = {}
    page_of = {}  # (n, content_slide_id) -> card slide
    idx = first_idx
    left_w = 4.3
    right_x = ML + left_w + 0.45
    right_w = W - MR - right_x
    avail = BOT - TOP - 0.2
    for n in sorted(refs):
        entries = usages.get(n, [])
        # paginate entries
        pages, cur, cur_h = [], [], 0.0
        for e in entries:
            h = entry_height(e, right_w)
            if cur and cur_h + h > avail:
                pages.append(cur)
                cur, cur_h = [], 0.0
            cur.append(e)
            cur_h += h
        pages.append(cur)
        slides = []
        for pi, page in enumerate(pages, 1):
            sl = deck.new_slide("IBRD Title Only")
            sl._element.set("show", "0")
            picture(sl, ART / "bg-paper.jpg", 0, 0, W, H, "Background", decorative=True)
            send_to_back(sl, ["Background"])
            section_tag(deck, sl, "SOURCE CARD" + (f"  ·  PAGE {pi}/{len(pages)}" if len(pages) > 1 else ""))
            text, url = K.ref_parts(n)
            title_ph(deck, sl, f"[{n}]", w=3.0, h=0.95, size=60)
            # left column: full reference
            y = 1.65
            rh = K.block_height_in([text], left_w, B, 15) + 0.05
            textbox(deck, sl, ML, y, left_w, rh, text, B, 15, C["ink"], name="Reference text")
            y += rh + 0.12
            if url:
                uh = K.text_lines(url, left_w, B, 12) * 12 * K.LINE / 72 + 0.05
                tb = textbox(deck, sl, ML, y, left_w, uh, "", B, 12, C["wash"], name="Reference URL")
                p = tb.text_frame.paragraphs[0]
                r = p.add_run(); r.text = url; _font(r, B, 12, C["wash"]); r.hyperlink.address = url
                y += uh + 0.12
            else:
                textbox(deck, sl, ML, y, left_w, 0.3, "No URL given in the paper.", B, 12, C["ink_soft"], italic=True)
                y += 0.4
            status = ("Source text not retrieved – shown: citation details from the paper only. "
                      "(Source sites were unreachable from the build environment; no excerpt is quoted.)")
            sh = K.block_height_in([status], left_w - 0.3, B, 12, italic=True) + 0.3
            box = rect(sl, ML, y, left_w, sh, fill=C["mist"], name="Status label")
            tf = box.text_frame; tf_setup(tf, inset=0.15, anchor=MSO_ANCHOR.MIDDLE)
            para_fmt(tf.paragraphs[0], 12)
            add_runs(deck, sl, tf.paragraphs[0], status, B, 12, C["ink"], italic=True)
            y += sh + 0.12
            inferred = sorted({e["ay_text"] for e in entries if e.get("ay") == "inferred"})
            if inferred:
                msg = "Mapping inferred – to be confirmed: " + "; ".join(inferred) + " → [" + str(n) + "]"
                ih = K.block_height_in([msg], left_w - 0.3, B, 12) + 0.3
                if y + ih < BOT - 0.6:
                    b2 = rect(sl, ML, y, left_w, ih, fill=None, line=C["dot"], name="Inferred label", line_w=1.25)
                    tf = b2.text_frame; tf_setup(tf, inset=0.15, anchor=MSO_ANCHOR.MIDDLE)
                    para_fmt(tf.paragraphs[0], 12)
                    add_runs(deck, sl, tf.paragraphs[0], msg, B, 12, C["link"], bold=True)
                    y += ih + 0.12
            locs = sorted({e["locator"] for e in entries if e["locator"] and not e.get("ay")})
            loc_txt = "Locators used in the paper: " + ("; ".join(locs) if locs else "Locator not given in the paper")
            lh = K.block_height_in([loc_txt], left_w, B, 12) + 0.05
            if y + lh < BOT - 0.55:
                textbox(deck, sl, ML, y, left_w, lh, loc_txt, B, 12, C["ink_soft"], name="Locators")
            # right column: cited for
            textbox(deck, sl, right_x, 0.6, right_w, 0.62, "Cited for", D, 34, C["ink"], name="Cited for heading")
            if not entries:
                textbox(deck, sl, right_x, TOP, right_w, 0.8,
                        "Not cited in the body text. The paper lists this source in its References only.",
                        B, 16, C["ink"], italic=True, name="Not cited")
            ry = TOP - 0.25
            for e in page:
                ry = draw_entry(deck, sl, e, right_x, ry, right_w)
                page_of[(n, e["slide_key"])] = sl
            # buttons
            back = rect(sl, ML, BOT - 0.3, 1.6, 0.5, fill=C["ink"], shape=MSO_SHAPE.ROUNDED_RECTANGLE, name="Back button")
            tf = back.text_frame; tf_setup(tf, anchor=MSO_ANCHOR.MIDDLE)
            para_fmt(tf.paragraphs[0], 16, PP_ALIGN.CENTER)
            add_runs(deck, sl, tf.paragraphs[0], "← Back", B, 16, C["paper"], bold=True)
            _shape_action(back, "ppaction://hlinkshowjump?jump=lastslideviewed")
            ib = rect(sl, ML + 1.8, BOT - 0.3, 2.3, 0.5, fill=None, line=C["ink"], shape=MSO_SHAPE.ROUNDED_RECTANGLE,
                      name="Index button", line_w=1.25)
            tf = ib.text_frame; tf_setup(tf, anchor=MSO_ANCHOR.MIDDLE)
            para_fmt(tf.paragraphs[0], 16, PP_ALIGN.CENTER)
            r = tf.paragraphs[0].add_run(); r.text = "Index of sources"; _font(r, B, 16, C["ink"], bold=True)
            deck.slide_links.append((ib, sl, ("index", None), "shape"))
            if len(pages) > 1:
                if pi < len(pages):
                    nb = rect(sl, W - MR - 3.6, BOT - 0.3, 1.7, 0.5, fill=None, line=C["ink"],
                              shape=MSO_SHAPE.ROUNDED_RECTANGLE, name="Next page button", line_w=1.25)
                    tf = nb.text_frame; tf_setup(tf, anchor=MSO_ANCHOR.MIDDLE)
                    para_fmt(tf.paragraphs[0], 14, PP_ALIGN.CENTER)
                    add_runs(deck, sl, tf.paragraphs[0], "Next page →", B, 14, C["ink"], bold=True)
                    deck.slide_links.append((nb, sl, ("cardpage", (n, pi + 1)), "shape"))
                if pi > 1:
                    pb = rect(sl, W - MR - 1.7, BOT - 0.3, 1.7, 0.5, fill=None, line=C["ink"],
                              shape=MSO_SHAPE.ROUNDED_RECTANGLE, name="Previous page button", line_w=1.25)
                    tf = pb.text_frame; tf_setup(tf, anchor=MSO_ANCHOR.MIDDLE)
                    para_fmt(tf.paragraphs[0], 14, PP_ALIGN.CENTER)
                    add_runs(deck, sl, tf.paragraphs[0], "← Previous", B, 14, C["ink"], bold=True)
                    deck.slide_links.append((pb, sl, ("cardpage", (n, pi - 1)), "shape"))
            set_transition(sl, "none", 0)
            sl.notes_slide.notes_text_frame.text = (
                f"Source card for [{n}] (hidden slide; reached by clicking [{n}] on a slide). "
                f"Press the Back button (or Backspace in Slide Show) to return.\n\n{refs[n]}")
            slides.append(sl)
            idx += 1
        result[n] = slides
    return result, page_of


def entry_lines(e):
    head = f"Slide {e['slide_no']} · {e['paper_where']} · Locator: {e['locator'] or 'not given in the paper'}"
    quote = "“" + e["quote"] + "”"
    return head, quote


def entry_height(e, w):
    head, quote = entry_lines(e)
    return (K.text_lines(head, w, B, 14, bold=True) * 14 * K.LINE + 3
            + K.text_lines(quote, w, B, 14, italic=True) * 14 * K.LINE + 10) / 72 + 0.05


def draw_entry(deck, sl, e, x, y, w):
    head, quote = entry_lines(e)
    h = entry_height(e, w)
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf_setup(tf)
    p = tf.paragraphs[0]
    para_fmt(p, 14, after=3)
    r = p.add_run(); r.text = f"Slide {e['slide_no']}"; _font(r, B, 14, C["link"], bold=True); r.font.underline = True
    deck.slide_links.append((r._r.get_or_add_rPr(), sl, ("slide", e["slide_key"]), "run"))
    r = p.add_run(); r.text = f" · {e['paper_where']} · Locator: {e['locator'] or 'not given in the paper'}"
    _font(r, B, 14, C["ink"], bold=True)
    p2 = tf.add_paragraph()
    para_fmt(p2, 14, after=10)
    r = p2.add_run(); r.text = "“" + e["quote"] + "”"; _font(r, B, 14, C["ink_soft"], italic=True)
    nm = f"Cited for: slide {e['slide_no']}"
    existing = {s_.name for s_ in sl.shapes}
    k = 2
    while nm in existing:
        nm = f"Cited for: slide {e['slide_no']} ({k})"; k += 1
    set_name(tb, nm)
    return y + h


def _shape_action(shape, action, rid=""):
    cNvPr = shape._element.find(".//" + qn("p:cNvPr"))
    for old in cNvPr.findall(qn("a:hlinkClick")):
        cNvPr.remove(old)
    h = etree.Element(qn("a:hlinkClick"))
    h.set(qn("r:id"), rid)
    h.set("action", action)
    # hlinkClick must precede extLst in cNvPr
    ext = cNvPr.find(qn("a:extLst"))
    if ext is not None:
        ext.addprevious(h)
    else:
        cNvPr.append(h)


def _run_action(rPr, rid, action="ppaction://hlinksldjump"):
    for old in rPr.findall(qn("a:hlinkClick")):
        rPr.remove(old)
    h = etree.Element(qn("a:hlinkClick"))
    h.set(qn("r:id"), rid)
    h.set("action", action)
    # order: ... latin ea cs sym hlinkClick ...
    after = None
    for tag in ("a:sym", "a:cs", "a:ea", "a:latin"):
        after = rPr.find(qn(tag))
        if after is not None:
            break
    if after is not None:
        after.addnext(h)
    else:
        ext = rPr.find(qn("a:extLst"))
        if ext is not None:
            ext.addprevious(h)
        else:
            rPr.append(h)


# ================================================================ usage collection
SENT_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z“\"(])")


def paper_sentences_with(n, paras):
    """Sentences (verbatim) in given paragraphs whose citation brackets include n."""
    out = []
    for sid, p in paras:
        for sent in SENT_SPLIT.split(K.strip_draft(p["text"])):
            for m in K.CIT.finditer(sent):
                grp = K.parse_citation_group(m.group(1))
                if grp:
                    for (num, loc) in grp:
                        if num == n:
                            out.append((sid, p, sent, loc))
    return out


def collect_usages(deck, slide_records):
    """Build card entries from the citation runs actually placed on visible slides."""
    usages = {}
    seen = set()
    P = K.load_paper()["sections"]
    for c in deck.cite_runs:
        sl = c["slide"]
        rec = slide_records.get(id(sl))
        if rec is None:
            continue  # citation on a card/back-matter slide (none expected)
        n = c["n"]
        key = (n, rec["key"], c["locator"] if c.get("ay") else "")
        if key in seen:
            continue
        seen.add(key)
        paras = [(sid, item) for kind, sid, item in K.resolve_notes(rec["notes"]) if kind == "para"]
        found = paper_sentences_with(n, paras)
        entry = {"slide_no": rec["no"], "slide_key": rec["key"], "ay": c.get("ay"), "ay_text": c["locator"] if c.get("ay") else ""}
        if c.get("ay"):
            entry["locator"] = c["locator"]
            entry["paper_where"] = (f"Table/figure source line (§ {rec['ref']})"
                                    if rec["kind"] in ("table", "table_chart", "table_nums", "chart", "chart_image")
                                    else f"Author–year citation in the text (§ {rec['ref']})")
            entry["quote"] = K.plain_text(c["context"])
        elif found:
            sid, p, sent, loc = found[0]
            entry["locator"] = loc
            entry["paper_where"] = f"Section {P[sid]['title'].split(' ')[0].rstrip('.')}, paragraph {p['n']} (p. {p['page']})"
            entry["quote"] = sent
        else:
            # citation printed in a table/figure source line, or in a list item — show the slide text
            entry["locator"] = c["locator"]
            entry["paper_where"] = f"Paper § {rec['ref']}"
            entry["quote"] = K.plain_text(c["context"])
            entry["from_slide_text"] = True
        usages.setdefault(n, []).append(entry)
    return usages


# ================================================================ main
def main():
    deck = Deck()
    data = K.load_deck()
    slides_spec = data["slides"]
    divider_slides, records, built = [], {}, []
    idx = 0
    pending_agenda = None
    for s in slides_spec:
        kind = s["kind"]
        if kind in ("references", "index", "credits", "thanks"):
            continue
        idx += 1
        notes, pages = notes_for(s)
        s["_pages"] = pages_str(pages)
        fn = {"cover": build_cover, "divider": build_divider, "bullets": build_bullets, "cards": build_cards,
              "bignums": build_bignums, "timeline": build_timeline, "flow": build_flow, "cycle": build_cycle,
              "grid": build_grid, "table": build_table, "table_chart": build_table_chart,
              "table_nums": build_table_nums, "chart": build_chart, "chart_image": build_chart_image}.get(kind)
        if kind == "agenda":
            sl = build_agenda(deck, s, idx, divider_slides)
        else:
            sl = fn(deck, s, idx)
        if kind == "divider":
            divider_slides.append(sl)
        if kind not in ("cover", "divider", "agenda"):
            slide_number(deck, sl, idx)
        if kind == "cover":
            m = data["meta"]
            notes = ("Cover (paper p. 1): " + " / ".join([m["university"], m["faculty"], m["course"], m["title"], m["group"]]
                     + m["members"] + ["Class: " + m["class"], m["lecturer"], m["place"]])
                     + "\n\nLecturer line deliberately left as a placeholder — see ISSUES.md.")
        head = f"Slide {idx} · {s.get('title', kind)}" + (f" · Paper § {s['ref']}" if s.get("ref") else "") + \
               (f" · p. {s['_pages']}" if s.get("_pages") else "")
        sl.notes_slide.notes_text_frame.text = head + "\n\n" + notes
        records[id(sl)] = {"no": idx, "key": f"s{idx}", "notes": s.get("notes", []), "ref": s.get("ref", kind),
                           "kind": kind, "section": s["section"], "title": s.get("title", kind), "slide": sl}
        built.append((s, sl))
    # back matter
    ref_slides = build_references(deck, idx + 1)
    for sl in ref_slides:
        idx += 1
        records[id(sl)] = {"no": idx, "key": f"s{idx}", "notes": [], "ref": "References", "kind": "references",
                           "section": "refs", "title": "References", "slide": sl}
        sl.notes_slide.notes_text_frame.text = (f"Slide {idx} · References (paper pp. 64–69), listed in full; "
                                                "drafting marks removed (see ISSUES.md). Each [n] opens its source card.")
        built.append(({"kind": "references", "section": "refs"}, sl))
    idx += 1
    index_slide = build_index(deck, idx)
    index_slide.notes_slide.notes_text_frame.text = f"Slide {idx} · Index of sources: click a number to open its card."
    records[id(index_slide)] = {"no": idx, "key": f"s{idx}", "notes": [], "ref": "Index", "kind": "index",
                                "section": "refs", "title": "Index of sources", "slide": index_slide}
    built.append(({"kind": "index", "section": "refs"}, index_slide))
    idx += 1
    cr = build_credits(deck, idx)
    cr.notes_slide.notes_text_frame.text = f"Slide {idx} · Credits."
    records[id(cr)] = {"no": idx, "key": f"s{idx}", "notes": [], "ref": "Credits", "kind": "credits",
                       "section": "refs", "title": "Credits", "slide": cr}
    built.append(({"kind": "credits", "section": "refs"}, cr))
    idx += 1
    th = build_thanks(deck, idx)
    th.notes_slide.notes_text_frame.text = f"Slide {idx} · Closing slide."
    records[id(th)] = {"no": idx, "key": f"s{idx}", "notes": [], "ref": "Thanks", "kind": "thanks",
                       "section": "refs", "title": "Thank you", "slide": th}
    built.append(({"kind": "thanks", "section": "refs"}, th))
    n_visible = idx

    # source cards (only body citations count for "Cited for"; reference-list numbers just link)
    content_records = {k: v for k, v in records.items() if v["kind"] not in ("references", "index", "credits", "thanks")}
    usages = collect_usages(deck, content_records)
    card_map, page_of = build_cards_for_sources(deck, usages, idx + 1)

    # reference list numbers -> link to their card (add as cite runs after the fact)

    # wire citation runs on content slides
    key_to_slide = {v["key"]: v["slide"] for v in records.values()}
    for c in deck.cite_runs:
        rec = records.get(id(c["slide"]))
        if rec is None:
            continue
        target = page_of.get((c["n"], rec["key"])) or card_map[c["n"]][0]
        rid = c["slide"].part.relate_to(target.part, RT.SLIDE)
        _run_action(c["rPr"], rid)
    # wire other slide links
    for el, sl, (kind, val), how in deck.slide_links:
        if kind == "card":
            target = card_map[val][0]
        elif kind == "cardpage":
            target = card_map[val[0]][val[1] - 1]
        elif kind == "slide":
            target = key_to_slide[val]
        elif kind == "index":
            target = index_slide
        elif kind == "divider":
            target = divider_slides[val]
        rid = sl.part.relate_to(target.part, RT.SLIDE)
        if how == "shape":
            _shape_action(el, "ppaction://hlinksldjump", rid)
        else:
            _run_action(el, rid)

    # transitions: Morph everywhere on visible slides; long between chapters
    prev_section = None
    for s, sl in built:
        sec = s["section"]
        big = s["kind"] in ("divider", "cover", "thanks") or (prev_section is not None and sec != prev_section)
        set_transition(sl, "morph", 1100 if big else 600)
        prev_section = sec

    deck.prs.core_properties.title = data["meta"]["title"]
    deck.prs.core_properties.author = "Group 6 — " + ", ".join(m.split(" - ")[0] for m in data["meta"]["members"])
    deck.prs.core_properties.subject = "Project Finance — NEU Investment Economics 65"
    deck.prs.core_properties.keywords = "IBRD; World Bank; Vietnam; project finance; TEP; CCSEP"
    deck.prs.save(OUT)
    BUILD_INFO.parent.mkdir(exist_ok=True)
    info = {
        "built": datetime.datetime.now().isoformat(timespec="seconds"),
        "visible_slides": n_visible,
        "card_slides": sum(len(v) for v in card_map.values()),
        "slides": [{"no": v["no"], "title": v["title"], "kind": v["kind"], "section": v["section"], "ref": v["ref"],
                    "notes": v["notes"]} for v in sorted(records.values(), key=lambda r: r["no"])],
        "usages": {str(k): [{kk: vv for kk, vv in e.items()} for e in v] for k, v in usages.items()},
        "card_pages": {str(k): len(v) for k, v in card_map.items()},
        "warnings": WARN,
    }
    BUILD_INFO.write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"saved {OUT.name}: {n_visible} visible + {info['card_slides']} hidden card slides")
    for w in WARN:
        print("WARN", w)


if __name__ == "__main__":
    main()
