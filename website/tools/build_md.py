"""Chuyển content/*.md (phần nhóm tự viết) thành js/md.js để trang đọc được cả khi mở bằng file://.
Chạy: python3 website/tools/build_md.py"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ["phan_mo_dau", "phu_luc_1"]


def inline(t):
    t = html.escape(t)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)


def block(lines):
    out, para, items, rows = [], [], [], []

    def flush():
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para.clear()
        if items:
            out.append("<ul>" + "".join("<li>" + inline(i) + "</li>" for i in items) + "</ul>")
            items.clear()
        if rows:
            body = [r for r in rows if not re.match(r"^\|[\s:|-]+\|$", r)]
            cells = [[c.strip() for c in r.strip("|").split("|")] for r in body]
            head, rest = cells[0], cells[1:]
            out.append('<div class="table-wrap"><table class="cmp"><thead><tr>' + "".join("<th>" + inline(c) + "</th>" for c in head) +
                       "</tr></thead><tbody>" + "".join("<tr>" + "".join("<td>" + inline(c) + "</td>" for c in r) + "</tr>" for r in rest) + "</tbody></table></div>")
            rows.clear()

    for ln in lines:
        s = ln.strip()
        if not s:
            flush()
        elif s.startswith("|"):
            rows.append(s)
        elif s.startswith("- "):
            items.append(s[2:])
        else:
            para.append(s)
    flush()
    return "".join(out)


def parse(text):
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    secs = []
    for part in re.split(r"^## ", text, flags=re.M)[1:]:
        head, _, body = part.partition("\n")
        secs.append({"h": head.strip(), "html": block(body.splitlines())})
    return secs


data = {}
for name in FILES:
    p = os.path.join(ROOT, "content", name + ".md")
    data[name] = parse(open(p, encoding="utf-8").read()) if os.path.exists(p) else None
out = os.path.join(ROOT, "js", "md.js")
open(out, "w", encoding="utf-8").write(
    "/* Sinh tự động từ content/*.md bởi tools/build_md.py. Không sửa tay. */\nwindow.MD = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
print(out)
