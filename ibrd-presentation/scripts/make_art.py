#!/usr/bin/env python3
"""Draw the deck's illustrations (new, original line art) and backgrounds.

Every motif is generated here as SVG in an engraving manner (ink outlines +
parallel hatching), then rasterised with cairosvg to transparent PNG at 2x.
Nothing is traced or copied from the style reference.

Outputs: assets/svg/*.svg, assets/png/*.png, assets/png/bg-paper.jpg, bg-wash.jpg
"""
import math, random, pathlib, io
import cairosvg
import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SVG = ROOT / "assets/svg"; PNG = ROOT / "assets/png"
SVG.mkdir(parents=True, exist_ok=True); PNG.mkdir(parents=True, exist_ok=True)
INK = "#2E4257"
RED = "#B4432F"
rnd = random.Random(1944)  # deterministic


class Doc:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.defs, self.body, self.nclip = [], [], 0

    def add(self, s):
        self.body.append(s)

    def hatch(self, path_d, angle=45, gap=7, width=1.1, opacity=1.0):
        """Parallel hatching clipped to a path."""
        self.nclip += 1
        cid = f"c{self.nclip}"
        self.defs.append(f'<clipPath id="{cid}"><path d="{path_d}"/></clipPath>')
        diag = math.hypot(self.w, self.h)
        a = math.radians(angle)
        dx, dy = math.cos(a), math.sin(a)
        nx, ny = -dy, dx
        cx, cy = self.w / 2, self.h / 2
        lines = []
        k = -diag
        while k < diag:
            x0, y0 = cx + nx * k - dx * diag, cy + ny * k - dy * diag
            x1, y1 = cx + nx * k + dx * diag, cy + ny * k + dy * diag
            lines.append(f"M{x0:.1f} {y0:.1f}L{x1:.1f} {y1:.1f}")
            k += gap
        self.add(f'<g clip-path="url(#{cid})" stroke="{INK}" stroke-width="{width}" opacity="{opacity}" fill="none">'
                 f'<path d="{"".join(lines)}"/></g>')

    def stroke(self, d, w=2.2, fill="none", color=INK, extra=""):
        self.add(f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>')

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}">'
                f'<defs>{"".join(self.defs)}</defs>{"".join(self.body)}</svg>')


def rect(x, y, w, h):
    return f"M{x} {y}H{x+w}V{y+h}H{x}Z"


def poly(pts):
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"


def save(name, doc, scale=2):
    s = doc.svg()
    (SVG / f"{name}.svg").write_text(s, encoding="utf-8")
    png = cairosvg.svg2png(bytestring=s.encode(), output_width=doc.w * scale, output_height=doc.h * scale)
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    im = im.quantize(colors=64, method=Image.FASTOCTREE).convert("RGBA") if False else im
    im.save(PNG / f"{name}.png", optimize=True)
    print("art", name, im.size)


# ---------------------------------------------------------------- bank
def bank():
    d = Doc(900, 640)
    # steps
    for i, (x, w) in enumerate([(60, 780), (85, 730), (110, 680)]):
        y = 590 - i * 22
        d.stroke(rect(x, y, w, 22))
        d.hatch(rect(x, y + 12, w, 10), angle=0, gap=4, width=0.9)
    # stylobate top y=546; columns
    top, base = 250, 546
    d.stroke(rect(130, 230, 640, 22))  # architrave
    d.hatch(rect(130, 241, 640, 11), angle=0, gap=3.5, width=0.8)
    d.stroke(rect(118, 205, 664, 25))  # frieze/cornice
    for k in range(16):
        d.stroke(rect(134 + k * 40, 210, 14, 15), w=1.2)  # triglyph blocks
    # pediment
    ped = [(100, 205), (450, 70), (800, 205)]
    d.stroke(poly(ped), w=2.6)
    inner = [(150, 196), (450, 92), (750, 196)]
    d.stroke(poly(inner), w=1.6)
    d.hatch(poly(inner), angle=-35, gap=6, width=0.9, opacity=0.9)
    # emblem in tympanum (coin)
    d.add(f'<circle cx="450" cy="160" r="26" fill="#F4ECD8" stroke="{INK}" stroke-width="2"/>')
    d.add(f'<circle cx="450" cy="160" r="19" fill="none" stroke="{INK}" stroke-width="1.2"/>')
    d.stroke("M450 146V174M441 151C441 146 459 146 459 152C459 158 441 160 441 166C441 172 459 172 459 167", w=1.6)
    # acroteria
    d.stroke("M450 70L450 52M440 58L460 58", w=2)
    # columns
    n = 8
    for i in range(n):
        cx = 165 + i * (570 / (n - 1))
        w = 38
        col = rect(cx - w / 2, top, w, base - top)
        d.stroke(rect(cx - w / 2 - 7, top, w + 14, 10), w=1.6)  # capital
        d.stroke(rect(cx - w / 2 - 6, base - 10, w + 12, 10), w=1.6)  # base
        d.stroke(rect(cx - w / 2, top + 10, w, base - top - 20), w=1.8)
        for f in range(1, 5):
            fx = cx - w / 2 + f * w / 5
            d.stroke(f"M{fx:.1f} {top+14}V{base-14}", w=0.9)
        d.hatch(rect(cx + w / 2 - 12, top + 10, 12, base - top - 20), angle=90, gap=3.2, width=0.9)
    # dark interior between columns
    d.hatch(rect(150, 262, 600, 274), angle=75, gap=9, width=0.6, opacity=0.55)
    save("bank", d)


# ---------------------------------------------------------------- globe
def globe():
    d = Doc(700, 820)
    cx, cy, r = 350, 360, 270
    d.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#F4ECD8" stroke="{INK}" stroke-width="3"/>')
    # meridians
    for k in [0.2, 0.45, 0.7, 0.92]:
        d.add(f'<ellipse cx="{cx}" cy="{cy}" rx="{r*k:.1f}" ry="{r}" fill="none" stroke="{INK}" stroke-width="1.1"/>')
    d.stroke(f"M{cx} {cy-r}V{cy+r}", w=1.1)
    for lat in [-60, -35, -12, 12, 35, 60]:
        y = cy + r * math.sin(math.radians(lat))
        half = r * math.cos(math.radians(lat))
        d.add(f'<ellipse cx="{cx}" cy="{y:.1f}" rx="{half:.1f}" ry="{half*0.12:.1f}" fill="none" stroke="{INK}" stroke-width="1"/>')
    # stylised land masses (free shapes)
    lands = [
        [(250, 190), (330, 170), (380, 200), (360, 260), (300, 300), (270, 360), (230, 330), (215, 260)],
        [(390, 300), (470, 280), (520, 330), (500, 420), (450, 470), (410, 430), (400, 360)],
        [(190, 420), (250, 410), (280, 470), (250, 540), (205, 520), (180, 470)],
        [(440, 150), (500, 140), (540, 180), (510, 210), (460, 200)],
    ]
    clip = f"M{cx-r} {cy}A{r} {r} 0 1 0 {cx+r} {cy}A{r} {r} 0 1 0 {cx-r} {cy}Z"
    for L in lands:
        pts = []
        for i in range(len(L)):
            (x0, y0), (x1, y1) = L[i], L[(i + 1) % len(L)]
            pts.append((x0, y0)); pts.append(((x0 + x1) / 2 + rnd.uniform(-9, 9), (y0 + y1) / 2 + rnd.uniform(-9, 9)))
        p = poly(pts)
        d.stroke(p, w=1.8, fill="#E8DDC2")
        d.hatch(p, angle=30, gap=5, width=0.9)
    # shading crescent
    d.hatch(f"M{cx+60} {cy-r+8}A{r} {r} 0 0 1 {cx+60} {cy+r-8}A{r*0.8} {r} 0 0 0 {cx+60} {cy-r+8}Z", angle=-60, gap=6, width=0.9, opacity=0.8)
    # meridian ring + stand
    d.add(f'<path d="M{cx-r-28} {cy+40}A{r+30} {r+30} 0 1 1 {cx+r+28} {cy+40}" fill="none" stroke="{INK}" stroke-width="5"/>')
    d.stroke(f"M{cx} {cy+r+28}V{cy+r+120}", w=6)
    d.stroke(f"M{cx-120} {cy+r+150}Q{cx} {cy+r+95} {cx+120} {cy+r+150}Z", w=3, fill="#E8DDC2")
    d.hatch(f"M{cx-120} {cy+r+150}Q{cx} {cy+r+95} {cx+120} {cy+r+150}Z", angle=0, gap=5, width=0.9)
    save("globe", d)


# ---------------------------------------------------------------- pylon
def pylon():
    d = Doc(760, 900)
    cx = 380
    # catenary cables
    for y0, sag in [(170, 70), (260, 80), (350, 90)]:
        for side in (-1, 1):
            xa = cx + side * 190
            xb = cx + side * 380
            d.stroke(f"M{xa} {y0+40}Q{(xa+xb)/2} {y0+40+sag} {xb} {y0+40+sag*0.6}", w=1.6)
    # legs
    legs = [(cx - 40, 60), (cx - 150, 860), (cx + 150, 860), (cx + 40, 60)]
    d.stroke(f"M{cx-40} 60L{cx-150} 860M{cx+40} 60L{cx+150} 860", w=3.2)
    # bracing
    ys = list(range(80, 860, 60))
    for a, b in zip(ys, ys[1:]):
        wa = 40 + (a - 60) * 110 / 800
        wb = 40 + (b - 60) * 110 / 800
        d.stroke(f"M{cx-wa:.1f} {a}L{cx+wb:.1f} {b}M{cx+wa:.1f} {a}L{cx-wb:.1f} {b}M{cx-wb:.1f} {b}H{cx+wb:.1f}", w=1.3)
    # crossarms with insulators
    for y, span in [(170, 190), (260, 170), (350, 150)]:
        d.stroke(poly([(cx - span, y), (cx + span, y), (cx + span - 20, y + 16), (cx - span + 20, y + 16)]), w=2.2, fill="#F4ECD8")
        d.hatch(poly([(cx - span, y), (cx + span, y), (cx + span - 20, y + 16), (cx - span + 20, y + 16)]), angle=60, gap=5, width=0.9)
        for side in (-1, 1):
            x = cx + side * (span - 10)
            d.stroke(f"M{x} {y+16}V{y+40}", w=1.8)
            for k in range(4):
                d.add(f'<ellipse cx="{x}" cy="{y+20+k*6}" rx="7" ry="2.5" fill="#F4ECD8" stroke="{INK}" stroke-width="1.2"/>')
    # peak
    d.stroke(f"M{cx-40} 60L{cx} 20L{cx+40} 60", w=2.4)
    # ground
    d.stroke(f"M{cx-300} 862Q{cx} 850 {cx+300} 862", w=2)
    d.hatch(f"M{cx-300} 862Q{cx} 850 {cx+300} 862V880H{cx-300}Z", angle=0, gap=4, width=0.8)
    save("pylon", d)


# ---------------------------------------------------------------- coastal city
def coast():
    d = Doc(1100, 560)
    # sea
    sea = "M0 360H1100V560H0Z"
    for i in range(9):
        y = 372 + i * 20
        path = "M0 %d" % y + "".join(f"Q{x+25} {y-6+rnd.uniform(-2,2):.1f} {x+50} {y}" for x in range(0, 1100, 50))
        d.stroke(path, w=1.1)
    # shoreline / embankment
    d.stroke("M0 352H1100", w=2.6)
    d.stroke(rect(0, 340, 1100, 14), w=1.6)
    d.hatch(rect(0, 340, 1100, 14), angle=90, gap=6, width=0.9)
    # buildings
    x = 30
    while x < 1050:
        w = rnd.choice([60, 70, 90, 110])
        h = rnd.choice([90, 120, 150, 190, 230])
        y = 340 - h
        d.stroke(rect(x, y, w, h), w=1.8, fill="#F4ECD8")
        if rnd.random() < 0.5:
            d.stroke(poly([(x - 4, y), (x + w / 2, y - 28), (x + w + 4, y)]), w=1.6, fill="#F4ECD8")
        for wy in range(y + 14, 330, 26):
            for wx in range(x + 10, x + w - 12, 18):
                d.stroke(rect(wx, wy, 8, 12), w=0.9)
        d.hatch(rect(x + w - 14, y, 14, h), angle=90, gap=3, width=0.8)
        x += w + rnd.choice([6, 10, 14])
    # outfall pipe into the sea
    pipe = "M640 346H860Q880 346 880 366V420"
    d.stroke(pipe, w=14, color=INK)
    d.stroke(pipe, w=9, color="#F4ECD8")
    for k in range(4):
        d.stroke(f"M{690+k*45} 337V355", w=2)
    d.stroke("M866 420H894", w=3)
    for k in range(5):
        d.stroke(f"M{872+k*5} 426Q{870+k*6} 448 {862+k*10} 462", w=1)
    # sun
    d.add(f'<circle cx="980" cy="70" r="34" fill="none" stroke="{INK}" stroke-width="1.8"/>')
    for k in range(16):
        a = k * math.pi / 8
        d.stroke(f"M{980+44*math.cos(a):.1f} {70+44*math.sin(a):.1f}L{980+58*math.cos(a):.1f} {70+58*math.sin(a):.1f}", w=1.2)
    save("coast", d)


# ---------------------------------------------------------------- ledger + coins
def ledger():
    d = Doc(900, 600)
    # open book
    left = "M80 140Q260 100 440 150V520Q260 470 80 510Z"
    right = "M460 150Q640 100 820 140V510Q640 470 460 520Z"
    for p in (left, right):
        d.stroke(p, w=2.4, fill="#F4ECD8")
    d.stroke("M440 150Q450 160 460 150V520Q450 532 440 520Z", w=2)
    for i in range(12):
        y = 180 + i * 26
        d.stroke(f"M110 {y-4+i*0.0:.1f}Q260 {y-34+i*1.6:.1f} 420 {y+2:.1f}", w=0.9)
        d.stroke(f"M480 {y+2:.1f}Q640 {y-34+i*1.6:.1f} 790 {y-4:.1f}", w=0.9)
    for xx in (180, 330, 560, 700):
        d.stroke(f"M{xx} 150V490", w=0.8)
    # ink squiggles (illegible entries)
    for i in range(10):
        y = 196 + i * 26
        for x0 in (120, 495):
            s = f"M{x0} {y}" + "".join(f"q4 -{rnd.uniform(3,7):.1f} 8 0" for _ in range(rnd.randint(5, 9)))
            d.stroke(s, w=1)
    d.hatch("M80 510Q260 470 440 520L440 530Q260 480 80 520Z", angle=0, gap=3, width=0.8)
    # coin stack
    for i in range(7):
        y = 520 - i * 16
        d.add(f'<ellipse cx="760" cy="{y}" rx="70" ry="20" fill="#E8DDC2" stroke="{INK}" stroke-width="1.8"/>')
        d.hatch(f"M690 {y}V{y+10}A70 20 0 0 0 830 {y+10}V{y}A70 20 0 0 1 690 {y}Z", angle=90, gap=3, width=0.8)
    d.add(f'<ellipse cx="760" cy="424" rx="50" ry="13" fill="none" stroke="{INK}" stroke-width="1.2"/>')
    # loose coin
    d.add(f'<circle cx="640" cy="560" r="30" fill="#E8DDC2" stroke="{INK}" stroke-width="1.8"/>')
    d.add(f'<circle cx="640" cy="560" r="22" fill="none" stroke="{INK}" stroke-width="1.1"/>')
    d.hatch("M610 560A30 30 0 0 0 670 560Z", angle=45, gap=4, width=0.8)
    save("ledger", d)


# ---------------------------------------------------------------- compass rose
def compass():
    d = Doc(600, 600)
    c = 300
    for r, w in [(270, 2.2), (250, 1.1), (200, 1.1)]:
        d.add(f'<circle cx="{c}" cy="{c}" r="{r}" fill="none" stroke="{INK}" stroke-width="{w}"/>')
    for k in range(72):
        a = k * math.pi / 36
        r0 = 250 if k % 2 else 240
        d.stroke(f"M{c+r0*math.cos(a):.1f} {c+r0*math.sin(a):.1f}L{c+270*math.cos(a):.1f} {c+270*math.sin(a):.1f}", w=1)
    for k, L in [(0, 230), (1, 150), (2, 230), (3, 150), (4, 230), (5, 150), (6, 230), (7, 150)]:
        a = k * math.pi / 4 - math.pi / 2
        for side in (-1, 1):
            b = a + side * math.radians(10 if L > 200 else 14)
            tip = (c + L * math.cos(a), c + L * math.sin(a))
            mid = (c + 38 * math.cos(b), c + 38 * math.sin(b))
            p = poly([(c, c), mid, tip])
            d.stroke(p, w=1.5, fill="#F4ECD8")
            if side == 1:
                d.hatch(p, angle=math.degrees(a) + 90, gap=3.5, width=0.8)
    d.add(f'<circle cx="{c}" cy="{c}" r="12" fill="{RED}" stroke="{INK}" stroke-width="1.5"/>')
    d.add(f'<text x="{c}" y="{c-200}" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="{INK}">N</text>')
    save("compass", d)


# ---------------------------------------------------------------- decree scroll
def scroll():
    d = Doc(640, 760)
    body = "M120 90H520V660H120Z"
    d.stroke(body, w=2.2, fill="#F4ECD8")
    for y, flip in [(70, 1), (680, -1)]:
        d.stroke(f"M90 {y}H550Q575 {y} 575 {y+20*flip}Q575 {y+40*flip} 550 {y+40*flip}H90Q65 {y+40*flip} 65 {y+20*flip}Q65 {y} 90 {y}Z", w=2.2, fill="#E8DDC2")
        d.hatch(f"M90 {y}H550Q575 {y} 575 {y+20*flip}Q575 {y+40*flip} 550 {y+40*flip}H90Q65 {y+40*flip} 65 {y+20*flip}Q65 {y} 90 {y}Z", angle=90, gap=4, width=0.8)
    d.stroke("M200 160H440", w=2.2)
    d.stroke("M240 190H400", w=1.4)
    for i in range(14):
        y = 240 + i * 24
        w = 300 if i % 5 != 4 else 180
        s = f"M170 {y}" + "".join(f"q5 -{rnd.uniform(2,5):.1f} 10 0" for _ in range(w // 10))
        d.stroke(s, w=0.9)
    # seal
    d.add(f'<circle cx="430" cy="600" r="44" fill="none" stroke="{RED}" stroke-width="3"/>')
    d.add(f'<circle cx="430" cy="600" r="34" fill="none" stroke="{RED}" stroke-width="1.4"/>')
    for k in range(5):
        a = -math.pi / 2 + k * 2 * math.pi / 5
        b = a + math.pi / 5
        d.stroke(f"M430 600L{430+26*math.cos(a):.1f} {600+26*math.sin(a):.1f}L{430+11*math.cos(b):.1f} {600+11*math.sin(b):.1f}", w=1.3, color=RED)
    d.stroke("M160 600q20 -18 40 0t40 0", w=1.6)
    save("scroll", d)


# ---------------------------------------------------------------- bridge
def bridge():
    d = Doc(1000, 420)
    d.stroke("M0 150H1000", w=2.4)
    d.stroke("M0 164H1000", w=1.6)
    d.hatch(rect(0, 150, 1000, 14), angle=0, gap=3.5, width=0.8)
    for k in range(40):
        d.stroke(f"M{k*25+12} 118V150", w=1.2)
    d.stroke("M0 118H1000", w=1.6)
    for x0, x1 in [(40, 340), (350, 650), (660, 960)]:
        d.stroke(f"M{x0} 400Q{(x0+x1)/2} 175 {x1} 400", w=2.4)
        d.hatch(f"M{x0} 400Q{(x0+x1)/2} 175 {x1} 400V400H{x0}Z" if False else f"M{x0} 164H{x1}V400Q{(x0+x1)/2} 175 {x0} 400Z", angle=0, gap=6, width=0.7, opacity=0.6)
    for x in (340, 650):
        d.stroke(rect(x, 164, 10, 236), w=1.8, fill="#E8DDC2")
    for i in range(5):
        y = 345 + i * 13
        path = f"M0 {y}" + "".join(f"Q{x+20} {y-5} {x+40} {y}" for x in range(0, 1000, 40))
        d.stroke(path, w=1)
    save("bridge", d)


# ---------------------------------------------------------------- dots + backgrounds
def dot():
    d = Doc(200, 200)
    d.add(f'<circle cx="100" cy="100" r="92" fill="{RED}"/>')
    d.add(f'<circle cx="100" cy="100" r="58" fill="#C25A45" opacity="0.6"/>')
    d.add(f'<path d="M60 70Q100 40 140 70" fill="none" stroke="#D9826D" stroke-width="7" opacity="0.7"/>')
    save("dot", d, scale=1)


def blobs(h, w, seed, scale):
    r = np.random.default_rng(seed)
    small = r.random((h // scale + 2, w // scale + 2))
    im = Image.fromarray((small * 255).astype("uint8")).resize((w, h), Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(scale / 2))
    return np.asarray(im).astype(float) / 255


def backgrounds():
    W, H = 1920, 1080
    grain = np.random.default_rng(7).normal(0, 1, (H, W))
    # paper
    base = np.array([0xF4, 0xEC, 0xD8], float)
    stain = blobs(H, W, 3, 160)
    tone = base[None, None, :] - (stain[..., None] - 0.5) * np.array([10, 12, 16]) - grain[..., None] * 2.2
    yy, xx = np.mgrid[0:H, 0:W]
    vign = ((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2
    tone -= vign[..., None] * np.array([6, 8, 12])
    Image.fromarray(np.clip(tone, 0, 255).astype("uint8")).save(PNG / "bg-paper.jpg", quality=86)
    # watercolor wash (mean ~#4E637A; never lighter than ~#5A6F86)
    dark = np.array([0x42, 0x56, 0x6C], float); light = np.array([0x5C, 0x71, 0x88], float)
    f = 0.55 * blobs(H, W, 11, 240) + 0.3 * blobs(H, W, 12, 90) + 0.15 * blobs(H, W, 13, 30)
    f = (f - f.min()) / (f.max() - f.min())
    edge = blobs(H, W, 14, 60)
    f = np.where(np.abs(f - 0.5) < 0.012, f - 0.25 * edge, f)  # pigment edges
    tone = dark + (light - dark) * f[..., None] - grain[..., None] * 2.5
    Image.fromarray(np.clip(tone, 0, 255).astype("uint8")).save(PNG / "bg-wash.jpg", quality=86)
    print("backgrounds ok")


if __name__ == "__main__":
    for fn in (bank, globe, pylon, coast, ledger, compass, scroll, bridge, dot):
        fn()
    backgrounds()
