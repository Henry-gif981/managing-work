"""Xuất các trang BCTC hợp nhất Hòa Phát 2024 được chip nguồn trích dẫn thành WebP và sinh js/hp_pages.js.

Số trang trên chip là trang in; trang PDF = trang in + 1. Trang bảng nằm ngang được xoay lại.
Chạy: python3 tools/build_hp_pages.py   (cần pdftoppm và Pillow; PDF ở assets/hpg_bctc_2024.pdf)
"""
import os, re, subprocess, tempfile, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, "assets", "hpg_bctc_2024.pdf")
ROTATE = {41, 55}  # trang in nằm ngang (thuyết minh 11, thuyết minh 26)

src = "".join(open(os.path.join(ROOT, p), encoding="utf-8").read() for p in ("js/viz.js", "js/content.js", "index.html"))
pages = sorted({int(n) for chunk in re.findall(r'Hòa Phát tr\.[^"<]*', src) for n in re.findall(r'tr\.(\d+)', chunk)})

if os.path.exists(PDF):
    with tempfile.TemporaryDirectory() as tmp:
        for n in pages:
            subprocess.run(["pdftoppm", "-r", "130", "-f", str(n + 1), "-l", str(n + 1), "-png", PDF, os.path.join(tmp, "p%d" % n)], check=True)
            im = Image.open(glob.glob(os.path.join(tmp, "p%d-*.png" % n))[0]).convert("L")
            if n in ROTATE:
                im = im.rotate(-90, expand=True)
            im.save(os.path.join(ROOT, "assets", "hp-p%02d.webp" % n), "WEBP", quality=55, method=6)

lines = ['  %d: "assets/hp-p%02d.webp"' % (n, n) for n in pages if os.path.exists(os.path.join(ROOT, "assets", "hp-p%02d.webp" % n))]
open(os.path.join(ROOT, "js", "hp_pages.js"), "w", encoding="utf-8").write(
    "/* Sinh bởi tools/build_hp_pages.py: trang in BCTC hợp nhất Hòa Phát 2024 → ảnh trang (trang PDF = trang in + 1). */\n"
    "window.HP_PAGES = {\n" + ",\n".join(lines) + "\n};\n")
print(len(lines), "trang:", pages)
