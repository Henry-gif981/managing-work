"""Xuất BCTC riêng (công ty mẹ) năm 2024 của Hòa Phát (40 trang scan) thành WebP và sinh js/hp_pages.js.

Khóa là số trang in "tr.N" như trên chip nguồn; trang PDF = N + 1 (trang PDF 1 là bìa, khóa 0).
Mỗi trang một ảnh đọc được số ở lightbox. Trang bảng nằm ngang (trang in 21, 24, 27, 29) được xoay lại.
Chạy: python3 tools/build_hp_pages.py   (cần pdftoppm và Pillow; PDF ở assets/hpg_bctc_rieng_2024.pdf)
"""
import os, subprocess, tempfile, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, "assets", "hpg_bctc_rieng_2024.pdf")
NPAGES = 40
# trang in nằm ngang (đã xem lại từng ảnh)
ROTATE = {21, 24, 27, 29}
FULL_W = 1000


def out(n):
    return os.path.join(ROOT, "assets", "hp-p%02d.webp" % n)


if os.path.exists(PDF):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-r", "130", "-gray", "-png", PDF, os.path.join(tmp, "p")], check=True)
        files = sorted(glob.glob(os.path.join(tmp, "p-*.png")))
        assert len(files) == NPAGES, len(files)
        for i, f in enumerate(files):
            n = i  # trang PDF i+1 = trang in i
            im = Image.open(f).convert("L")
            if n in ROTATE:
                im = im.rotate(-90, expand=True)
            w = FULL_W if im.width <= im.height else int(FULL_W * 1.4)
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(out(n), "WEBP", quality=50, method=6)

full = ['  %d: "assets/hp-p%02d.webp"' % (n, n) for n in range(NPAGES)]
open(os.path.join(ROOT, "js", "hp_pages.js"), "w", encoding="utf-8").write(
    "/* Sinh bởi tools/build_hp_pages.py: trang in BCTC riêng Hòa Phát 2024 → ảnh trang (trang PDF = trang in + 1). */\n"
    "window.HP_PAGES = {\n" + ",\n".join(full) + "\n};\n")
total = sum(os.path.getsize(out(n)) for n in range(NPAGES))
print(NPAGES, "trang,", round(total / 1e6, 2), "MB")
