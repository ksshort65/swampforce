"""SwampForce brand set. The owner's eagle art is used as supplied (scaled only; never redrawn).
Run: /workspace/.venv/bin/python /workspace/brand/src/brand.py"""
import math, random, os
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

B = Path("/workspace/brand"); SRC = Path("/workspace/_incoming-from-user")
ANTON = str(B / "src/Anton-Regular.ttf")
ROBOTO = "/usr/share/fonts/truetype/sand-box/google/Roboto/Roboto-VariableFont_wdth,wght.ttf"
RED, RED_DK, NAVY, OFFW, BLACK = (166, 30, 34), (110, 18, 22), (11, 31, 74), (242, 237, 227), (17, 17, 17)
DPI = (300, 300)
random.seed(7); np.random.seed(7)

EAGLE = Image.open(SRC / "logo-eagle.png").convert("RGBA")
EAGLE = EAGLE.crop(EAGLE.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())


def fit(im, h=None, w=None):
    if h: return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def distress(alpha, amount=0.10, scale=1.0, seed=1):
    """Worn-print texture: knock small irregular specks out of an alpha mask."""
    rng = np.random.default_rng(seed)
    w, h = alpha.size
    n = rng.random((max(1, int(h / (6 * scale))), max(1, int(w / (6 * scale)))))
    noise = Image.fromarray((n * 255).astype("uint8")).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2 * scale))
    fine = Image.fromarray((rng.random((h, w)) * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.8 * scale))
    a = np.asarray(noise, dtype=np.float32) * 0.7 + np.asarray(fine, dtype=np.float32) * 0.3
    cut = np.percentile(a, 100 - amount * 100)
    mask = (a < cut).astype(np.float32)
    return Image.fromarray((np.asarray(alpha, dtype=np.float32) * mask).astype("uint8"))


def text_layer(text, font, fill, outline=None, stroke=0, tracking=0):
    """Render text (with optional outline) on a transparent canvas, trimmed."""
    tmp = ImageDraw.Draw(Image.new("L", (10, 10)))
    widths = [tmp.textlength(c, font=font) for c in text]
    W = int(sum(widths) + tracking * (len(text) - 1) + 4 * stroke + 40)
    asc, desc = font.getmetrics()
    H = asc + desc + 4 * stroke + 40
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    x = 20 + 2 * stroke
    for c, cw in zip(text, widths):
        d.text((x, 20 + 2 * stroke), c, font=font, fill=fill, stroke_width=stroke, stroke_fill=outline or fill)
        x += cw + tracking
    return im.crop(im.getchannel("A").getbbox())


def wordmark_anton(height, fill=OFFW, outline=RED_DK, worn=True, text="SWAMPFORCE", seed=3, stretch=1.42):
    """Tall condensed caps (Anton, stretched vertically to match the owner's reference), thin dark-red outline, light wear."""
    f = ImageFont.truetype(ANTON, 1000)
    t = text_layer(text, f, fill + (255,), outline + (255,), stroke=24, tracking=30)
    t = t.resize((t.width, int(t.height * stretch)), Image.LANCZOS)
    t = fit(t, h=height)
    if worn:
        t.putalpha(distress(t.getchannel("A"), 0.035, scale=height / 300, seed=seed))
    return t


def wordmark_site(height, color=BLACK, tm=True):
    """The existing site wordmark: heavy uppercase sans, wide tracking (as in the site header), black lettering."""
    f = ImageFont.truetype(ROBOTO, 1000); f.set_variation_by_axes([800, 100])
    t = text_layer("SWAMP FORCE", f, color + (255,), tracking=100)
    if tm:
        ft = ImageFont.truetype(ROBOTO, 330); ft.set_variation_by_axes([700, 100])
        s = text_layer("\u2122", ft, color + (255,))
        c = Image.new("RGBA", (t.width + s.width + 40, t.height), (0, 0, 0, 0)); c.paste(t, (0, 0)); c.paste(s, (t.width + 40, 0), s); t = c
    return fit(t, h=height)


def save(im, name, dpi=True):
    p = B / name
    im.save(p, dpi=DPI if dpi else None, optimize=True)
    pv = im.copy(); pv.thumbnail((800, 800), Image.LANCZOS)
    pv.save(B / "previews" / (p.stem + "-800.png"), optimize=True)
    return p


def trim(im, pad=0):
    bb = im.getchannel("A").point(lambda a: 255 if a > 4 else 0).getbbox()
    im = im.crop(bb)
    if pad:
        c = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0)); c.paste(im, (pad, pad)); im = c
    return im


# ───────── horizontal lockups ─────────
def lockup(word, width=4500, dark=False):
    eh = 1600
    eg = fit(EAGLE, h=eh)
    wm = fit(word, h=int(eh * (0.30 if not dark else 0.20)))
    x = int(eg.width * 0.81); y = int(eh * (0.22 if not dark else 0.27))
    W = max(x + wm.width, eg.width); H = eh
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    c.paste(eg, (0, 0), eg)
    c.alpha_composite(wm, (x, y))
    c = trim(c, pad=40)
    return fit(c, w=width)


# ───────── circle stamp ─────────
def arc_text(canvas, text, font, color, cx, cy, r, top=True, tracking=0.0, stretch=1.0):
    d = ImageDraw.Draw(Image.new("L", (10, 10)))
    widths = [d.textlength(ch, font=font) + tracking for ch in text]
    total = sum(widths) - tracking
    ang_total = total / r
    a = (-math.pi / 2 - ang_total / 2) if top else (math.pi / 2 + ang_total / 2)
    asc, desc = font.getmetrics()
    for ch, w in zip(text, widths):
        mid = a + ((w - tracking) / 2) / r * (1 if top else -1)
        if ch != " ":
            g = Image.new("RGBA", (int(w + 80), asc + desc + 80), (0, 0, 0, 0))
            ImageDraw.Draw(g).text((40, 40), ch, font=font, fill=color)
            g = g.crop(g.getchannel("A").getbbox())  # centre the glyph itself on the band
            g = g.resize((g.width, int(g.height * stretch)), Image.LANCZOS)
            deg = -math.degrees(mid) - 90 if top else -math.degrees(mid) + 90
            g = g.rotate(deg, resample=Image.BICUBIC, expand=True)
            # baseline radius: top text sits outside-in, bottom text inside-out
            rr = r
            x = cx + rr * math.cos(mid) - g.width / 2; y = cy + rr * math.sin(mid) - g.height / 2
            canvas.alpha_composite(g, (int(x), int(y)))
        a += (w / r) * (1 if top else -1)


def star(d, cx, cy, R, color):
    pts = []
    for i in range(10):
        rr = R if i % 2 == 0 else R * 0.42
        t = -math.pi / 2 + i * math.pi / 5
        pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
    d.polygon(pts, fill=color)


def stamp(mode="color", S=4500):
    ring = RED if mode in ("color", "red") else NAVY
    txt = RED if mode in ("color", "red") else NAVY
    c = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    cx = cy = S // 2
    R1, R2, R3 = 2200, 2090, 1560
    d.ellipse([cx - R1, cy - R1, cx + R1, cy + R1], outline=ring + (255,), width=70)
    d.ellipse([cx - R2, cy - R2, cx + R2, cy + R2], outline=ring + (255,), width=26)
    d.ellipse([cx - R3, cy - R3, cx + R3, cy + R3], outline=ring + (255,), width=26)
    f = ImageFont.truetype(ANTON, 330)
    band_mid = (R2 + R3) / 2
    asc, desc = f.getmetrics()
    arc_text(c, "SWAMP FORCE", f, txt + (255,), cx, cy, band_mid, top=True, tracking=40, stretch=1.25)
    arc_text(c, "WE THE PEOPLE", f, txt + (255,), cx, cy, band_mid, top=False, tracking=30, stretch=1.25)
    for sx in (cx - band_mid, cx + band_mid):
        star(d, sx, cy, 120, txt + (255,))
    # worn texture on rings + lettering only; the owner's eagle art is left untouched
    c.putalpha(distress(c.getchannel("A"), 0.035, scale=3.0, seed=11 if mode == "color" else 12))
    inner = int(R3 * 2 * 0.80)
    eg = EAGLE.copy() if mode == "color" else one_color(EAGLE, txt)
    eg = fit(eg, h=inner) if eg.height >= eg.width else fit(eg, w=inner)
    c.alpha_composite(eg, (cx - eg.width // 2 + int(inner * 0.02), cy - eg.height // 2 + 10))
    return c


def one_color(im, color, cut=150):
    """Single-ink eagle: dark tones print, light tones (stripes, stars, head feathers) drop out; a threshold of the owner's art, not a redraw."""
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32)
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    a = np.asarray(im.getchannel("A"), dtype=np.float32)
    ink = np.clip((cut + 20 - lum) / 40, 0, 1) * a
    out = Image.new("RGBA", im.size, color + (0,))
    out.putalpha(Image.fromarray(ink.astype("uint8")))
    return out


if __name__ == "__main__":
    out = {}
    if os.environ.get("ONLY") == "stamp":
        for m, n in (("color", "swampforce-stamp-color-4500.png"), ("red", "swampforce-stamp-red-4500.png"), ("navy", "swampforce-stamp-navy-4500.png")):
            save(stamp(m), n)
        raise SystemExit
    # lockups
    L_light = lockup(wordmark_anton(900, OFFW, RED_DK)); out["lockup-light"] = save(L_light, "swampforce-lockup-light-4500.png")
    L_dark = lockup(wordmark_site(700), dark=True); out["lockup-dark"] = save(L_dark, "swampforce-lockup-dark-4500.png")
    wm_light = fit(trim(wordmark_anton(900, OFFW, RED_DK), 30), w=4500); out["wm-light"] = save(wm_light, "swampforce-wordmark-light-4500.png")
    wm_black = fit(trim(wordmark_site(700), 30), w=4500); out["wm-black"] = save(wm_black, "swampforce-wordmark-black-4500.png")
    # stamps
    if os.environ.get("ONLY") == "lockup": raise SystemExit
    if os.environ.get("ONLY") == "stamp": pass
    for m, n in (("color", "swampforce-stamp-color-4500.png"), ("red", "swampforce-stamp-red-4500.png"), ("navy", "swampforce-stamp-navy-4500.png")):
        out["stamp-" + m] = save(stamp(m), n)
    print("\n".join(f"{k}: {v}" for k, v in out.items()))
