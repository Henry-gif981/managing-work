"""Xuất toàn bộ BCTC hợp nhất Hòa Phát 2024 (67 trang scan) thành WebP và sinh js/hp_pages.js.

Khóa là số trang in "tr.N" như trên chip nguồn; trang PDF = N + 1 (trang PDF 1 là bìa, khóa 0).
Mỗi trang có ảnh lớn (đọc được số ở lightbox) và ảnh thu nhỏ (lưới Phụ lục 4). Trang bảng nằm ngang được xoay lại.
Chạy: python3 tools/build_hp_pages.py   (cần pdftoppm và Pillow; PDF ở assets/hpg_bctc_2024.pdf)
"""
import os, subprocess, tempfile, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, "assets", "hpg_bctc_2024.pdf")
NPAGES = 67
# trang in nằm ngang (xác định bằng OSD của tesseract, đã xem lại từng ảnh)
ROTATE = {16, 17, 18, 19, 20, 31, 32, 33, 34, 35, 41, 45, 48, 51, 54, 55}
FULL_W, THUMB_W = 1000, 180


def out(n, kind):
    return os.path.join(ROOT, "assets", "hp-%s%02d.webp" % (kind, n))


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
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(out(n, "p"), "WEBP", quality=50, method=6)
            im.resize((THUMB_W, round(im.height * THUMB_W / im.width)), Image.LANCZOS).save(out(n, "t"), "WEBP", quality=45, method=6)

full = ['  %d: "assets/hp-p%02d.webp"' % (n, n) for n in range(NPAGES)]
thumb = ['  %d: "assets/hp-t%02d.webp"' % (n, n) for n in range(NPAGES)]
open(os.path.join(ROOT, "js", "hp_pages.js"), "w", encoding="utf-8").write(
    "/* Sinh bởi tools/build_hp_pages.py: trang in BCTC hợp nhất Hòa Phát 2024 → ảnh trang (trang PDF = trang in + 1). */\n"
    "window.HP_PAGES = {\n" + ",\n".join(full) + "\n};\n"
    "window.HP_THUMBS = {\n" + ",\n".join(thumb) + "\n};\n")
total = sum(os.path.getsize(out(n, k)) for n in range(NPAGES) for k in "pt")
print(NPAGES, "trang,", round(total / 1e6, 2), "MB")
