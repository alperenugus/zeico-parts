"""Build the static GitHub Pages copy of the storefront from public/.

GitHub Pages serves the site from /<repo>/ and has no Functions, so this:
  - prefixes root-relative /assets/ paths with the repo base path,
  - adds en/index.html (Cloudflare does this with a _redirects rewrite),
  - points live inventory requests at the Cloudflare deployment,
  - leaves out the admin panel and Cloudflare-only config files.

Usage: python3 scripts/build-gh-pages.py [--base /zeico-parts/] [--api https://zeico-parts.pages.dev] [--out dist-gh]
"""
import argparse
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {'admin', '_headers', '_redirects'}
TEXT = {'.html', '.js', '.css', '.xml', '.txt'}

ap = argparse.ArgumentParser()
ap.add_argument('--base', default='/zeico-parts/')
ap.add_argument('--api', default='https://zeico-parts.pages.dev')
ap.add_argument('--out', default='dist-gh')
args = ap.parse_args()

src, out = ROOT / 'public', ROOT / args.out
if out.exists():
    shutil.rmtree(out)
shutil.copytree(src, out, ignore=lambda d, names: [n for n in names if Path(d) == src and n in SKIP])

# "/assets/..." not preceded by a host name (keeps https://www.zeicoparts.com/assets/... intact).
asset_path = re.compile(r'(?<![\w.])/assets/')
config = f"<script>window.ZEICO_BASE = '{args.base}'; window.ZEICO_API = '{args.api}';</script>\n  "

for f in out.rglob('*'):
    if f.suffix in TEXT:
        s = asset_path.sub(args.base + 'assets/', f.read_text(encoding='utf-8'))
        if f.name == 'index.html':
            s = s.replace('<script src="', config + '<script src="', 1)
        f.write_text(s, encoding='utf-8')

(out / 'en').mkdir()
shutil.copy(out / 'index.html', out / 'en' / 'index.html')
(out / '.nojekyll').touch()
print(f'Built {out} (base {args.base}, api {args.api})')
