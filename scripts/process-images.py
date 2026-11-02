#!/usr/bin/env python3
"""Generate responsive WebP sizes + one JPEG fallback for every JPG in a folder.

Usage:
    pip install pillow
    python3 scripts/process-images.py path/to/source-jpgs public/media

Writes  <name>-<width>.webp  (480 / 960 / 1600, never upscaled)
and     <name>-<min(width,960)>.jpg
then merges the sizes into src/media-manifest.json.
"""
import glob, json, os, sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
manifest_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'media-manifest.json')
manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
os.makedirs(out, exist_ok=True)

for f in sorted(glob.glob(os.path.join(src, '*.jpg')) + glob.glob(os.path.join(src, '*.jpeg'))):
    name = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert('RGB')
    w, h = im.size
    widths = sorted({min(w, x) for x in (480, 960, 1600)})
    for tw in widths:
        r = im if tw == w else im.resize((tw, round(h * tw / w)), Image.LANCZOS)
        r.save(os.path.join(out, f'{name}-{tw}.webp'), 'WEBP', quality=76, method=6)
    fw = min(w, 960)
    r = im if fw == w else im.resize((fw, round(h * fw / w)), Image.LANCZOS)
    r.save(os.path.join(out, f'{name}-{fw}.jpg'), 'JPEG', quality=78, optimize=True, progressive=True)
    manifest[name] = {'w': w, 'h': h, 'widths': widths, 'fallback': fw}
    print('processed', name, widths)

json.dump(manifest, open(manifest_path, 'w'), indent=1)
print('manifest updated:', os.path.abspath(manifest_path))
