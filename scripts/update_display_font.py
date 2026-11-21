"""Refresh the Chinese display-font subset (dist/assets/cn-display.woff2).

Run after `node build.mjs` whenever new Chinese characters appear on the site:

    python scripts/update_display_font.py path/to/NotoSerifSC[wght].ttf

The source font is Noto Serif SC (variable, SIL OFL), available from
https://github.com/google/fonts/tree/main/ofl/notoserifsc
Existing glyphs are kept; only characters used in dist/**/*.html are added.
"""
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

site = Path(__file__).resolve().parents[1] / 'dist'
target = site / 'assets' / 'cn-display.woff2'
source = Path(sys.argv[1]) if len(sys.argv) > 1 else None

used = set()
for page in site.rglob('*.html'):
    text = re.sub(r'<[^>]+>', ' ', page.read_text(encoding='utf-8'))
    used.update(ord(c) for c in text if ord(c) >= 0x2e80)
with TTFont(target) as previous:
    existing = set(previous.getBestCmap())
missing = used - existing
print('Characters on site:', len(used), '| missing from subset:', len(missing))
if missing:
    if not source:
        sys.exit('Missing glyphs: ' + ''.join(sorted(map(chr, missing))) + '\nPass the Noto Serif SC source font path.')
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.name_IDs = ['*']
    with TTFont(source) as font:
        available = set(font.getBestCmap())
        glyphs = subset.Subsetter(options=options)
        glyphs.populate(unicodes=existing | (missing & available))
        glyphs.subset(font)
        font.flavor = 'woff2'
        font.save(target)
    print('Added:', ''.join(sorted(map(chr, missing & available))))
print('Display font size:', target.stat().st_size, 'bytes')
