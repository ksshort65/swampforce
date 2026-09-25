"""Bumper stickers, secondary marks (existing site icon + black wordmark), SVGs, web assets, og image, favicons, contact sheet."""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.varLib.instancer import instantiateVariableFont
import brand as b

B = b.B; PV = B / "previews"
WEB = Path("/workspace/site-from-checkpoint/public_html/assets/brand"); WEB.mkdir(parents=True, exist_ok=True)
SITE = WEB.parent.parent
NAVY_SITE = (7, 21, 40)
out = {}


def ld(n): return Image.open(B / n).convert("RGBA")


# ───────── bumper stickers 11.5 x 3 in @300dpi = 3450 x 900 ─────────
def bumper_stamp():
    W, H = 3450, 900
    c = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    st = b.fit(ld("swampforce-stamp-color-4500.png"), h=800)
    c.alpha_composite(st, (60, 50))
    f = b.ImageFont.truetype(b.ANTON, 400)
    t = b.text_layer("SWAMPFORCE.COM", f, b.NAVY + (255,), tracking=12)
    t = t.resize((t.width, int(t.height * 1.2)))
    t = b.fit(t, w=min(W - 60 - 800 - 180, t.width)) if t.width > W - 1040 else t
    if t.height > 420: t = b.fit(t, h=420)
    x = 60 + 800 + 90 + (W - 950 - 90 - t.width) // 2
    c.alpha_composite(t, (x, (H - t.height) // 2 - 40))
    d = ImageDraw.Draw(c); ul = (H + t.height) // 2 + 10
    d.rectangle([x, ul, x + t.width, ul + 22], fill=b.RED)
    return c


def bumper_lockup():
    W, H = 3450, 900
    c = Image.new("RGBA", (W, H), NAVY_SITE + (255,))
    eg = b.fit(b.EAGLE, h=830)
    c.alpha_composite(eg, (70, 30))
    x0 = 70 + int(eg.width * 0.92)
    wm = b.wordmark_anton(500, b.OFFW, b.RED_DK)
    if wm.width > W - x0 - 90: wm = b.fit(wm, w=W - x0 - 90)
    c.alpha_composite(wm, (x0, 110))
    f = b.ImageFont.truetype(b.ANTON, 200)
    t = b.text_layer("SWAMPFORCE.COM", f, b.OFFW + (255,), tracking=14)
    t = b.fit(t, w=int(wm.width * 0.62))
    c.alpha_composite(t, (x0 + wm.width - t.width, 110 + wm.height + 70))
    d = ImageDraw.Draw(c); d.rectangle([x0, 110 + wm.height + 30, x0 + wm.width - t.width - 50, 110 + wm.height + 44], fill=b.RED)
    d.rectangle([0, H - 36, W, H], fill=b.RED)
    return c


out["bumper-lockup"] = b.save(bumper_lockup().convert("RGB"), "swampforce-bumper-lockup-11.5x3in.png")
out["bumper-stamp"] = b.save(bumper_stamp().convert("RGB"), "swampforce-bumper-stamp-11.5x3in.png")

# ───────── secondary mark: the site's existing flag icon (assets/favicon.svg) ─────────
ICON_SVG = (SITE / "assets" / "favicon.svg").read_text(encoding="utf-8")
(B / "swampforce-icon-flag.svg").write_text(ICON_SVG, encoding="utf-8")
S = 4500; k = S / 32
ic = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(ic)
d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(4 * k), fill=(11, 31, 58, 255))
for y, col in ((6, (255, 255, 255)), (13.5, (155, 28, 28)), (21, (255, 255, 255))):
    d.rectangle([int(4 * k), int(y * k), int(28 * k), int((y + 5) * k)], fill=col + (255,))
out["icon-flag"] = b.save(ic, "swampforce-icon-flag-4500.png")


# ───────── black wordmark as SVG (text converted to outlines) ─────────
def wordmark_svg(path, color="#111111"):
    tt = TTFont(b.ROBOTO)
    tt = instantiateVariableFont(tt, {"wght": 800, "wdth": 100})
    gs = tt.getGlyphSet(); cmap = tt.getBestCmap(); hmtx = tt["hmtx"]
    upm = tt["head"].unitsPerEm; track = 0.1 * upm
    x = 0; paths = []
    for ch in "SWAMP FORCE":
        gn = cmap[ord(ch)]
        pen = SVGPathPen(gs); gs[gn].draw(pen)
        if pen.getCommands(): paths.append(f'<path transform="translate({x:.0f} 0)" d="{pen.getCommands()}"/>')
        x += hmtx[gn][0] + track
    # trademark, small and raised as on the site
    gn = cmap[0x2122]; pen = SVGPathPen(gs); gs[gn].draw(pen)
    paths.append(f'<path transform="translate({x + 0.02 * upm:.0f} {0.28 * upm:.0f}) scale(0.45)" d="{pen.getCommands()}"/>')
    x += hmtx[gn][0] * 0.45 + 0.02 * upm
    cap = tt["OS/2"].sCapHeight
    top = 0.9 * upm
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 {-top:.0f} {x + 40:.0f} {top + 40:.0f}" role="img" aria-label="Swamp Force">'
           f'<g fill="{color}" transform="scale(1 -1)">{"".join(p.replace("translate(", "translate(") for p in paths)}</g></svg>')
    # flip: glyph y-up -> svg y-down
    svg = svg.replace('transform="scale(1 -1)"', 'transform="scale(1,-1)"')
    Path(path).write_text(svg, encoding="utf-8")


wordmark_svg(B / "swampforce-wordmark-black.svg")
out["wordmark-black-svg"] = B / "swampforce-wordmark-black.svg"
out["icon-flag-svg"] = B / "swampforce-icon-flag.svg"


# ───────── web assets ─────────
def web(im, stem, max_w, q=82, max_kb=150):
    im = im.copy(); im.thumbnail((max_w, max_w * 4), Image.LANCZOS)
    for qq in (q, 76, 70, 62, 55):
        im.save(WEB / f"{stem}.webp", "WEBP", quality=qq, method=6)
        if (WEB / f"{stem}.webp").stat().st_size < max_kb * 1024: break
    pal = im
    im.save(WEB / f"{stem}.png", optimize=True)
    if (WEB / f"{stem}.png").stat().st_size > max_kb * 1024:  # quantize PNG fallback to stay light
        im.quantize(colors=128, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(WEB / f"{stem}.png", optimize=True)
    if (WEB / f"{stem}.png").stat().st_size > max_kb * 1024:
        im.quantize(colors=64, method=Image.Quantize.FASTOCTREE).save(WEB / f"{stem}.png", optimize=True)
    return im.size


sizes = {}
sizes["lockup-hero"] = web(ld("swampforce-lockup-light-4500.png"), "lockup-light", 1100)
sizes["eagle-hero"] = web(b.EAGLE, "eagle-hero", 520)
sizes["stamp"] = web(ld("swampforce-stamp-color-4500.png"), "stamp", 480)
head = Image.open(b.SRC / "logo-eagle.png").convert("RGBA").crop((500, 170, 880, 550))
sizes["eagle-head"] = web(head, "eagle-head", 128)
sizes["icon-flag"] = None

# og:image 1200x630, new stamp centred on navy
og = Image.new("RGB", (1200, 630), NAVY_SITE)
g = ImageDraw.Draw(og)
for i in range(630):  # soft vertical gradient to the site's navy-2
    t = i / 629; g.line([(0, i), (1200, i)], fill=tuple(int(a + (c - a) * t) for a, c in zip(NAVY_SITE, (12, 35, 64))))
disc = Image.new("RGBA", (560, 560), (0, 0, 0, 0)); ImageDraw.Draw(disc).ellipse([0, 0, 559, 559], fill=(250, 248, 243, 255))
og.paste(disc, (320, 35), disc)
st = b.fit(ld("swampforce-stamp-color-4500.png"), h=540)
og.paste(st, (330, 45), st)
g.rectangle([0, 622, 1200, 630], fill=b.RED)
og.save(SITE / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)
og.save(B / "swampforce-og-1200x630.jpg", "JPEG", quality=90)

# favicons from the eagle head (full art is too detailed at 32px)
def fav(size):
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = Image.new("L", (size * 4, size * 4), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1], radius=size * 4 // 6, fill=255)
    bg = Image.new("RGBA", (size, size), (11, 31, 74, 255)); bg.putalpha(m.resize((size, size), Image.LANCZOS))
    hd = Image.open(b.SRC / "logo-eagle.png").convert("RGBA").crop((515, 172, 865, 522)).resize((size, size), Image.LANCZOS)
    bg.alpha_composite(hd)
    return bg


fav(32).save(SITE / "favicon-32.png", optimize=True)
fav(180).convert("RGB").save(SITE / "apple-touch-icon.png", optimize=True)
fav(512).save(B / "swampforce-favicon-eagle-512.png", optimize=True)
fav(32).save(B / "swampforce-favicon-32.png"); fav(180).save(B / "swampforce-apple-touch-180.png")

# ───────── contact sheet ─────────
def tile(name, bg, label, w=760, h=520):
    t = Image.new("RGB", (w, h), bg)
    im = ld(name) if not name.endswith(".jpg") else Image.open(B / name).convert("RGBA")
    im.thumbnail((w - 60, h - 110), Image.LANCZOS)
    t.paste(im, ((w - im.width) // 2, (h - 60 - im.height) // 2 + 10), im)
    d = ImageDraw.Draw(t); f = ImageFont.truetype(b.ROBOTO, 24)
    d.rectangle([0, h - 56, w, h], fill=(245, 245, 245)); d.text((18, h - 44), label, fill=(20, 20, 20), font=f)
    return t


tiles = [("swampforce-lockup-light-4500.png", (15, 15, 15), "Lockup, light text: dark shirts"),
         ("swampforce-lockup-dark-4500.png", (250, 250, 247), "Lockup, black site wordmark: light products"),
         ("swampforce-stamp-color-4500.png", (250, 250, 247), "Stamp, full color: stickers, small spots"),
         ("swampforce-stamp-red-4500.png", (250, 250, 247), "Stamp, one-color red: mug bottoms, embroidery"),
         ("swampforce-stamp-navy-4500.png", (236, 232, 222), "Stamp, one-color navy"),
         ("swampforce-bumper-lockup-11.5x3in.png", (200, 200, 200), "Bumper sticker, lockup (11.5 x 3 in)"),
         ("swampforce-bumper-stamp-11.5x3in.png", (200, 200, 200), "Bumper sticker, stamp (11.5 x 3 in)"),
         ("swampforce-brush-black-4500.png", (250, 250, 247), "Owner's brush logo, black: light products"),
         ("swampforce-brush-white-4500.png", (22, 26, 34), "Owner's brush logo, white ink: dark products"),
         ("swampforce-wordmark-black-4500.png", (250, 250, 247), "Existing site wordmark, black (secondary)"),
         ("swampforce-icon-flag-4500.png", (250, 250, 247), "Existing site icon (secondary / tiny sizes)")]
cols = 3; rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * 780 + 20, rows * 540 + 110), (228, 226, 220))
d = ImageDraw.Draw(sheet); d.text((24, 30), "SwampForce brand set", fill=(11, 31, 74), font=ImageFont.truetype(b.ANTON, 50))
for i, (n, bg, lab) in enumerate(tiles):
    sheet.paste(tile(n, bg, lab), (20 + (i % cols) * 780, 100 + (i // cols) * 540))
sheet.save(B / "swampforce-contact-sheet.png", optimize=True)
out["contact"] = B / "swampforce-contact-sheet.png"

for k2, v in out.items(): print(k2, v)
for f in sorted(WEB.iterdir()): print(f.name, f.stat().st_size // 1024, "KB")
print(sizes)
