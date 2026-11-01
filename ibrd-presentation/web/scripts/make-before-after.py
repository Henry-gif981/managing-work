#!/usr/bin/env python3
"""reports/before-after.html (+ the metrics table in reports/metrics-compare.md) from the two measurement passes."""
import csv, json
from pathlib import Path
root = Path(__file__).resolve().parent.parent
R = root / 'reports'
load = lambda t: {int(r['n']): r for r in csv.DictReader(open(R / f'metrics-{t}.csv'))}
B, A = load('before'), load('after')
tb, ta = json.loads((R / 'text-before.json').read_text()), json.loads((R / 'text-after.json').read_text())
SAMPLES = [1, 2, 14, 17, 22, 30, 56, 58, 59, 85, 99, 106, 108, 113]
avg = lambda xs: sum(xs) / len(xs) if xs else 0

rows = {}
for n, b in B.items():
    rows.setdefault(b['tpl'], []).append((b, A[n]))
lines = ['| Template | n | words (b→a) | occupancy % (b→a) | bottom empty % (b→a) | text below contrast (b→a) |', '|---|---|---|---|---|---|']
for tpl, ps in sorted(rows.items()):
    f = lambda k, i: avg([float(p[i][k]) for p in ps])
    s = lambda k, i: sum(int(p[i][k]) for p in ps)
    lines.append(f"| {tpl} | {len(ps)} | {f('words',0):.0f} → {f('words',1):.0f} | {f('occupancy',0):.1f} → {f('occupancy',1):.1f} | {f('bottom_empty',0):.1f} → {f('bottom_empty',1):.1f} | {s('contrast_fails',0)} → {s('contrast_fails',1)} |")
C = [n for n in B if B[n]['content'] == 'True']
tot = (f"| **content sections** | {len(C)} | | **{avg([float(B[n]['occupancy']) for n in C]):.1f} → {avg([float(A[n]['occupancy']) for n in C]):.1f}** | "
       f"**{avg([float(B[n]['bottom_empty']) for n in C]):.1f} → {avg([float(A[n]['bottom_empty']) for n in C]):.1f}** | "
       f"**{sum(int(B[n]['contrast_fails']) for n in B)} → {sum(int(A[n]['contrast_fails']) for n in A)}** (all 119) |")
lines.append(tot)
e30 = lambda M: sum(1 for n in C if float(M[n]['bottom_empty']) >= 30)
diff = [n for n in tb if tb[n] != ta[n]]
md = '\n'.join(lines) + f"\n\nContent sections with bottom empty ≥ 30 %: {e30(B)} → {e30(A)}. Sections: {len(B)} → {len(A)}. Sections whose text differs: {diff or 'none'}.\n"
(R / 'metrics-compare.md').write_text(md)

def table_html():
    out = ['<table><thead><tr>' + ''.join(f'<th>{h}</th>' for h in ['Template', 'n', 'Words', 'Occupancy %', 'Bottom empty %', 'Contrast failures']) + '</tr></thead><tbody>']
    for l in lines[2:]:
        cells = [c.strip().replace('**', '') for c in l.strip('|').split('|')]
        out.append('<tr>' + ''.join(f'<td>{c}</td>' for c in cells) + '</tr>')
    return ''.join(out) + '</tbody></table>'

cards = []
cards.append('<figure><figcaption><b>1 · Cover, full 3D</b> — globe moved off the IBRD word</figcaption><div class="pair"><img src="cover-3d-before.png" alt="before"><img src="cover-3d-after.png" alt="after"></div></figure>')
for n in SAMPLES:
    b, a = B[n], A[n]
    cap = f"<b>{n} · {b['tpl']}</b> ({b['tone']}) — occupancy {b['occupancy']}→{a['occupancy']} %, bottom empty {b['bottom_empty']}→{a['bottom_empty']} %, contrast failures {b['contrast_fails']}→{a['contrast_fails']}"
    cards.append(f'<figure><figcaption>{cap}</figcaption><div class="pair"><img loading="lazy" src="../screenshots/before/s{n:03d}.png" alt="section {n} before"><img loading="lazy" src="../screenshots/after/s{n:03d}.png" alt="section {n} after"></div></figure>')
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Before / after</title><style>
:root {{ --bg:#F4EEDF; --ink:#23292F; --soft:#4A5D6E; --line:#d8ccb0; }}
body {{ margin:0; padding:32px 16px 64px; background:var(--bg); color:var(--ink); font:16px/1.5 system-ui, sans-serif; }}
main {{ max-width:1600px; margin:0 auto; }} h1 {{ font-weight:600; margin:0 0 4px; }} p {{ color:var(--soft); }}
table {{ border-collapse:collapse; width:100%; margin:16px 0 32px; font-variant-numeric:tabular-nums; background:#fff8ea; }}
th, td {{ border-bottom:1px solid var(--line); padding:6px 10px; text-align:left; }} th {{ background:#2F4458; color:#fff8ea; }}
figure {{ margin:0 0 36px; }} figcaption {{ margin-bottom:8px; }}
.pair {{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }} .pair img {{ width:100%; display:block; border:1px solid var(--line); }}
.lbl {{ display:grid; grid-template-columns:1fr 1fr; gap:12px; font-weight:600; color:var(--soft); position:sticky; top:0; background:var(--bg); padding:6px 0; }}
@media (max-width:800px) {{ .pair, .lbl {{ grid-template-columns:1fr; }} }}
</style></head><body><main>
<h1>IBRD deck — design pass, before / after</h1>
<p>Same conditions both sides: 1920×1080, <code>?steps=all&amp;preset=static&amp;3d=0</code>, 1 s after each jump (cover row: full 3D). Text of every section is identical before and after, except the two outside chart labels added on section 85 (5.1 and 5.2, values from charts.yaml). Sections: {len(B)} → {len(A)}.</p>
{table_html()}
<p>Content sections with bottom empty ≥ 30 %: {e30(B)} → {e30(A)}.</p>
<div class="lbl"><span>Before</span><span>After</span></div>
{''.join(cards)}
</main></body></html>"""
(R / 'before-after.html').write_text(html)
print(md)
