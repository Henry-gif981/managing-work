#!/usr/bin/env python3
"""Analyse reports/measure-<tag>.json (from scripts/measure.mjs).

Contrast: each text node's colour (alpha x cumulative opacity) is blended over the real background pixels
sampled under its glyph boxes in the text-hidden screenshot; the ratio reported is the 10th percentile over
those pixels (textured grounds are judged by their lighter/darker patches, not their average).
Thresholds: 4.5:1, or 3:1 for large text (>= 40px, or >= 32px at weight >= 700).
Outputs: reports/metrics-<tag>.csv, reports/contrast-<tag>.csv, reports/text-<tag>.json, summary on stdout.
"""
import csv, json, re, sys
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parent.parent
tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
data = json.loads((root / 'reports' / f'measure-{tag}.json').read_text())
NONCONTENT = {'cover', 'chapter', 'thanks'}


def parse(c):
    v = [float(x) for x in re.findall(r'[\d.]+', c)]
    return (v + [1.0])[:4] if len(v) >= 3 else [0, 0, 0, 0]


def lum(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def large(t):
    return t['size'] >= 40 or (t['size'] >= 32 and t['weight'] >= 700)


metrics, contrast, texts = [], [], {}
for s in data['slides']:
    bg = np.asarray(Image.open(s['bg']).convert('RGB')).astype(float)
    H, W = bg.shape[:2]
    grid = np.zeros((18, 32), bool)
    bottom = 0
    fails, minsize, chrome_min = 0, 999, 999
    for t in s['texts']:
        r, g, b, a = parse(t['color'])
        a *= t['opacity']
        px = []
        for bx in t['boxes']:
            x0, y0 = max(0, int(bx['x'])), max(0, int(bx['y']))
            x1, y1 = min(W, int(bx['x'] + bx['w'])), min(H, int(bx['y'] + bx['h']))
            if x1 <= x0 or y1 <= y0:
                continue
            px.append(bg[y0:y1:2, x0:x1:2].reshape(-1, 3))
            if t.get('chrome'):
                continue
            grid[max(0, y0 // 60):min(18, (y1 - 1) // 60 + 1), max(0, x0 // 60):min(32, (x1 - 1) // 60 + 1)] = True
            bottom = max(bottom, y1)
        if not px:
            continue
        p = np.concatenate(px)
        fg = a * np.array([r, g, b]) + (1 - a) * p
        lf, lb = lum(fg), lum(p)
        ratio = (np.maximum(lf, lb) + 0.05) / (np.minimum(lf, lb) + 0.05)
        worst = float(np.percentile(ratio, 10))
        need = 3.0 if large(t) else 4.5
        ok = worst >= need
        fails += not ok
        if t.get('chrome'):
            chrome_min = min(chrome_min, t['size'])
        else:
            minsize = min(minsize, t['size'])
        bgc = np.median(p, axis=0).astype(int)
        contrast.append([s['n'], s['tpl'], s['tone'], ('[chrome] ' if t.get('chrome') else '') + t['el'], t['text'], round(t['size'], 1), t['weight'],
                         t['color'], round(t['opacity'], 2), '#%02x%02x%02x' % tuple(bgc), round(worst, 2), need, 'ok' if ok else 'FAIL'])
    for bk in s['blocks']:
        x0, y0, x1, y1 = int(bk['x']), int(bk['y']), int(bk['x'] + bk['w']), int(bk['y'] + bk['h'])
        grid[max(0, y0 // 60):min(18, max(0, (y1 - 1) // 60 + 1)), max(0, x0 // 60):min(32, max(0, (x1 - 1) // 60 + 1))] = True
        bottom = max(bottom, min(1080, y1))
    words = len(s['text'].split())
    texts[s['n']] = s['text']
    metrics.append(dict(n=s['n'], tpl=s['tpl'], tone=s['tone'], content=s['tpl'] not in NONCONTENT, words=words,
                        occupancy=round(grid.mean() * 100, 1), bottom_empty=round((1080 - bottom) / 1080 * 100, 1),
                        min_font=round(minsize, 1) if minsize < 999 else '', chrome_min_font=round(chrome_min, 1) if chrome_min < 999 else '', contrast_fails=fails))

out = root / 'reports'
with open(out / f'metrics-{tag}.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(metrics[0].keys()))
    w.writeheader(); w.writerows(metrics)
with open(out / f'contrast-{tag}.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['slide', 'tpl', 'tone', 'element', 'text', 'font_px', 'weight', 'color', 'opacity', 'bg_median', 'ratio_p10', 'needed', 'result'])
    w.writerows(contrast)
(out / f'text-{tag}.json').write_text(json.dumps(texts, ensure_ascii=False, indent=1))

C = [m for m in metrics if m['content']]
avg = lambda xs: sum(xs) / len(xs) if xs else 0
print(f"[{tag}] sections {len(metrics)} (content {len(C)})")
print(f"  occupancy avg (content) {avg([m['occupancy'] for m in C]):.1f}%  | bottom empty avg {avg([m['bottom_empty'] for m in C]):.1f}%"
      f"  | content sections with bottom empty >= 30%: {sum(m['bottom_empty'] >= 30 for m in C)}/{len(C)}")
fs = [m for m in metrics if m['contrast_fails']]
print(f"  sections with >= 1 contrast failure: {len(fs)}  (wash: {sum(m['tone']=='wash' for m in fs)}/{sum(m['tone']=='wash' for m in metrics)})"
      f"  | failing text nodes: {sum(m['contrast_fails'] for m in metrics)}")
fails = [c for c in contrast if c[-1] == 'FAIL']
if fails:
    rs = sorted(c[10] for c in fails)
    print(f"  failing ratios: worst {rs[0]}, median {rs[len(rs)//2]}")
print('  by template:')
by = {}
for m in metrics:
    by.setdefault(m['tpl'], []).append(m)
for k, ms in sorted(by.items()):
    print(f"   {k:9s} n={len(ms):2d} words {avg([m['words'] for m in ms]):5.0f}  occ {avg([m['occupancy'] for m in ms]):5.1f}%  bottom {avg([m['bottom_empty'] for m in ms]):5.1f}%"
          f"  minfont {min([m['min_font'] or 99 for m in ms]):4.0f}  fails {sum(m['contrast_fails'] for m in ms)}")
