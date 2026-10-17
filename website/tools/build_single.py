"""Đóng gói website thành MỘT file HTML tự chứa (CSS, JS, số liệu, ảnh WebP nhúng base64).
Chạy: python3 website/tools/build_single.py  →  website/nhom2-thuyet-trinh.html"""
import base64, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
subprocess.run([sys.executable, os.path.join(ROOT, "tools", "build_md.py")], check=True)
rd = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

html = rd("index.html")
css = rd("css/style.css")
SCRIPTS = ("data.js", "content.js", "md.js", "review.js", "viz.js", "hp_pages.js", "main.js")
scripts = {k: rd("js/" + k) for k in SCRIPTS}
MIME = {"webp": "image/webp", "jpg": "image/jpeg", "png": "image/png"}
ASSET = re.compile(r"assets/[a-z0-9-]+\.(webp|jpg|png)")


def b64(m):
    path = os.path.join(ROOT, m.group(0))
    return "data:%s;base64,%s" % (MIME[m.group(1)], base64.b64encode(open(path, "rb").read()).decode())


for k in scripts:
    assert "</script" not in scripts[k]
    scripts[k] = ASSET.sub(b64, scripts[k])
html = ASSET.sub(b64, html)

html, n = re.subn(r'<link[^>]*href="css/style.css"[^>]*/?>', lambda m: "<style>\n" + css + "\n</style>", html)
assert n == 1
for k, v in scripts.items():
    tag = '<script src="js/%s"></script>' % k
    assert tag in html, tag
    html = html.replace(tag, "<script>\n" + v + "\n</script>")
assert "assets/" not in html and 'src="js/' not in html
out = os.path.join(ROOT, "nhom2-thuyet-trinh.html")
open(out, "w", encoding="utf-8").write(html)
print(out, round(len(html) / 1e6, 2), "MB")
