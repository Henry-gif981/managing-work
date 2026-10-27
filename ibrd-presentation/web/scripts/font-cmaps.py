#!/usr/bin/env python3
"""Write qa/font-cmaps.json: the Unicode code points each deck family really contains (fontTools), merged over
the self-hosted subset files, so audit-fonts can report characters that would fall back to another font."""
import glob, json, pathlib, re
from fontTools.ttLib import TTFont
root = pathlib.Path(__file__).resolve().parent.parent
css = (root / 'src/styles/fonts.css').read_text()
fam = {}
for block in css.split('@font-face')[1:]:
    m = re.search(r"font-family: '([^']+)'", block); u = re.search(r"url\(([^)]+)\)", block)
    if not m or not u: continue
    f = root / 'public' / u.group(1).lstrip('/')
    fam.setdefault(m.group(1), set()).update(TTFont(f).getBestCmap().keys())
(root / 'qa').mkdir(exist_ok=True)
(root / 'qa/font-cmaps.json').write_text(json.dumps({k: sorted(v) for k, v in fam.items()}))
print({k: len(v) for k, v in fam.items()})
