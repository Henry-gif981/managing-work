"""Đóng gói website thành MỘT file HTML (CSS, JS, số liệu, ảnh báo cáo gốc đều nhúng sẵn).
Chạy: python3 website/tools/build_single.py  →  website/nhom2-thuyet-trinh.html"""
import base64, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

html = rd("index.html")
css = rd("css/style.css")
scripts = {k: rd("js/" + k) for k in ("data.js", "content.js", "viz.js", "main.js")}

def b64(m):
    path = os.path.join(ROOT, m.group(0))
    return "data:image/jpeg;base64," + base64.b64encode(open(path, "rb").read()).decode()

for k in scripts:
    assert "</script" not in scripts[k]
    scripts[k] = re.sub(r"assets/[a-z0-9-]+\.jpg", b64, scripts[k])

html = html.replace('<link rel="stylesheet" href="css/style.css">', "<style>\n" + css + "\n</style>")
for k, v in scripts.items():
    tag = '<script src="js/%s"></script>' % k
    assert tag in html, tag
    html = html.replace(tag, "<script>\n" + v + "\n</script>")
assert "assets/" not in html and 'src="js/' not in html
out = os.path.join(ROOT, "nhom2-thuyet-trinh.html")
open(out, "w", encoding="utf-8").write(html)
print(out, round(len(html) / 1e6, 2), "MB")
