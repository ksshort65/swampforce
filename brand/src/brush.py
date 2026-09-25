"""Owner's brush-stroke 'SWAMP FORCE' (gator eye in the O): white background removed, upscaled for print. Look unchanged."""
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw, ImageChops
SRC = Path("/workspace/swamp-force/print-ready/SWAMP-FORCE-LOGO.png"); B = Path("/workspace/brand")
W = 4500
g = Image.open(SRC).convert("L")
# ink amount = darkness; white paper (>=245) -> fully transparent
a = np.asarray(g, dtype=np.float32)
ink = np.clip((248 - a) / (248 - 20), 0, 1)
alpha = Image.fromarray((ink * 255).astype("uint8"))
bb = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
pad = 20
bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(g.width, bb[2] + pad), min(g.height, bb[3] + pad))
alpha = alpha.crop(bb); gc = g.crop(bb)
s = W / alpha.width; H = round(alpha.height * s)
# upscale, then a gentle S-curve for clean edges (keeps the brush texture)
up = alpha.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
u = np.asarray(up, dtype=np.float32) / 255
u = np.clip((u - 0.5) * 1.8 + 0.5, 0, 1)
A = Image.fromarray((u * 255).astype("uint8"))

# the eye's light iris (enclosed by ink) is found by flood fill and kept opaque in the white-ink version
light = (np.asarray(g, dtype=np.uint8) > 120).astype("uint8") * 255
L = Image.fromarray(light)
iris = Image.new("L", g.size, 0)
for seed in ((556, 375), (585, 375), (548, 382), (592, 382)):
    if L.getpixel(seed) == 255:
        m = L.copy(); ImageDraw.floodfill(m, seed, 128)
        region = m.point(lambda v: 255 if v == 128 else 0)
        if region.getbbox() and (region.getbbox()[2] - region.getbbox()[0]) < 120:
            iris = ImageChops.lighter(iris, region)
iris = iris.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(5))  # close over the slit pupil
print("iris bbox", iris.getbbox())
iris = iris.crop(bb).resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2))

black = Image.new("RGBA", (W, H), (17, 17, 17, 0)); black.putalpha(A)
black.save(B / "swampforce-brush-black-4500.png", dpi=(300, 300), optimize=True)
# white ink for dark products; the eye keeps its light iris and dark slit as in the original
white = Image.new("RGBA", (W, H), (255, 255, 255, 0)); white.putalpha(A)
eye_rgb = gc.resize((W, H), Image.LANCZOS).convert("RGBA")
eye_rgb.putalpha(iris)
white.alpha_composite(eye_rgb)
white.save(B / "swampforce-brush-white-4500.png", dpi=(300, 300), optimize=True)
for n in ("swampforce-brush-black-4500.png", "swampforce-brush-white-4500.png"):
    im = Image.open(B / n); im.thumbnail((800, 800), Image.LANCZOS); im.save(B / "previews" / n.replace(".png", "-800.png"), optimize=True)
# traced SVG (vtracer, black only), from a 2x clean upscale
try:
    import sys; sys.path.insert(0, "/workspace/journal-pilot/.venv/lib/python3.13/site-packages")
    import vtracer
    tmp = B / "src" / "_brush_trace_in.png"
    bw = Image.new("RGB", (W // 2, H // 2), "white"); m2 = A.resize((W // 2, H // 2), Image.LANCZOS).point(lambda v: 255 if v > 110 else 0)
    bw.paste((0, 0, 0), mask=m2); bw.save(tmp)
    vtracer.convert_image_to_svg_py(str(tmp), str(B / "swampforce-brush-black.svg"), colormode="binary", filter_speckle=2, corner_threshold=60,
                                    length_threshold=3.0, splice_threshold=45, path_precision=2, mode="spline")
    tmp.unlink()
    sv = (B / "swampforce-brush-black.svg").read_text()
    sv = sv.replace(f'width="{W // 2}" height="{H // 2}">', f'viewBox="0 0 {W // 2} {H // 2}" width="{W // 2}" height="{H // 2}">', 1)
    (B / "swampforce-brush-black.svg").write_text(sv)
    print("svg ok")
except Exception as ex:
    print("svg skipped:", ex)
print(W, H)
