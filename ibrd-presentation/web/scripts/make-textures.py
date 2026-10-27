#!/usr/bin/env python3
"""Procedural static textures (no external images):
  public/assets/textures/paper.webp  cream laid paper with faint fibres and foxing
  public/assets/textures/wash.webp   blue-grey watercolour wash with pooled edges (the 2D reference's second ground)
  public/assets/textures/grain.png   256 px tileable film grain for the 3D gallery (used at ~3% opacity)
Generated once at build time, so no blend modes or filters run in the browser.
"""
import pathlib
import numpy as np
from PIL import Image, ImageFilter

OUT = pathlib.Path(__file__).resolve().parent.parent / "public/assets/textures"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1920, 1080
rng = np.random.default_rng(1944)


def fbm(w, h, octaves=6, base=4, persistence=0.55):
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        gw, gh = base * 2 ** o, max(2, int(base * 2 ** o * h / w))
        g = rng.random((gh + 1, gw + 1)).astype(np.float32)
        img = Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * (np.asarray(img, np.float32) / 255.0)
        tot += amp
        amp *= persistence
    return acc / tot


def save(arr, name, quality=72):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(OUT / name, quality=quality, method=6)


# paper -------------------------------------------------------------------------------------
n = fbm(W, H, 6, 3)
fib = np.asarray(Image.fromarray((rng.random((H, W)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255
base = np.array([251, 242, 222], np.float32)            # --paper
shade = (n - 0.5) * 10 + (fib - 0.5) * 5
y, x = np.mgrid[0:H, 0:W]
vign = ((x / W - 0.5) ** 2 + (y / H - 0.5) ** 2) * 16    # slightly darker edges, like an old sheet
paper = base[None, None, :] + shade[..., None] - vign[..., None] * np.array([1.0, 1.25, 1.9])
fox = fbm(W, H, 4, 6)
paper -= (np.clip(fox - 0.72, 0, 1) * 60)[..., None] * np.array([0.2, 0.45, 0.9])   # faint warm foxing
save(paper, "paper.webp", 70)

# watercolour wash ----------------------------------------------------------------------------
m = fbm(W, H, 7, 2, 0.6)
pool = np.abs(np.sin(m * 9.0)) ** 6                       # darker pooled rims where pigment dried
c_light = np.array([172, 181, 188], np.float32)           # #ACB5BC
c_mid = np.array([139, 152, 160], np.float32)             # #8B98A0
c_deep = np.array([110, 125, 136], np.float32)
t = np.clip((m - 0.3) * 1.6, 0, 1)[..., None]
wash = c_light * (1 - t) + c_mid * t
wash = wash * (1 - 0.25 * pool[..., None]) + c_deep * (0.25 * pool[..., None])
wash += ((fib - 0.5) * 6)[..., None]
save(wash, "wash.webp", 70)

# grain ---------------------------------------------------------------------------------------
g = rng.normal(128, 38, (256, 256)).clip(0, 255).astype(np.uint8)
Image.fromarray(g, "L").save(OUT / "grain.png", optimize=True)
for f in sorted(OUT.iterdir()):
    print(f"{f.name}: {f.stat().st_size // 1024} KB")
