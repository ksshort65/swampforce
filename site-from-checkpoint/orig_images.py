"""Restore the owner's original Grok Build images (Sep 26, 2026). Source files: image-src/grok/ (exact copies of
/workspace/compare/original/GrokBuild-original-site/preview/images/), usage map: image-src/grok/usage.json (which original
page showed which image). Applied to every generated page by build.py; only adds images, never removes content."""
import json, re, shutil, html
from pathlib import Path
SITE = Path(__file__).parent
SRC = SITE / "image-src" / "grok"
USAGE = json.load(open(SRC / "usage.json"))
def _alt(f, a=""):
    return html.escape(a or f.rsplit(".", 1)[0].replace("chart-", "Chart: ").replace("essay-", "").replace("-", " "), quote=True)
def _uniq(items):
    seen, out = set(), []
    for f, a, h in items:
        if f not in seen:
            seen.add(f); out.append((f, a, h))
    return out
ESSAY = {k.split("/")[1][:-5]: _uniq(v) for k, v in USAGE.items() if k.startswith("dispatch/")}
ALL = sorted(p.name for p in SRC.glob("*.jpg")) + ["logo.png"]
USED = {f for v in USAGE.values() for f, _, _ in v}
UNUSED = [f for f in ALL if f not in USED and f.endswith(".jpg") and not f.startswith(("blog-", "essay-"))]

ORPHANS = ["a-barcode-is-not-a-lock", "clean-hands", "it-does-not-fit", "that-is-not-why-they-are-elected", "the-check-they-will-not-write", "what-they-are-protecting"]

def copy_all(out):
    d = Path(out) / "images"; d.mkdir(parents=True, exist_ok=True)
    for f in ALL:
        shutil.copy2(SRC / f, d / f)  # exact originals (capitol.jpg / chamber.jpg / logo.png swapped back to the original files)

def _grid(items, title):
    cells = "".join(f'<a class="sf-orig-cell" href="{html.escape(h or "images/" + f)}"><img src="images/{f}" alt="{_alt(f, a)}" loading="lazy"></a>' for f, a, h in items)
    return f'<section class="sf-orig"><div class="wrap"><p class="tap-hint">{title}</p><div class="sf-orig-grid">{cells}</div></div></section>'

def _j(h):  # dispatch/<slug>.html -> journal-<slug>.html
    m = re.match(r"(?:dispatch/)?([\w-]+)\.html", h or "")
    return f"journal-{m.group(1)}.html" if m and h.startswith("dispatch/") else h

def apply(name, h):
    # journal essay pages: the original essay image(s) right under the title
    m = re.match(r"journal-([\w-]+)\.html$", name)
    if m and m.group(1) in ESSAY and "</h1>" in h:
        figs = "".join(f'<figure class="sf-orig-fig"><img src="images/{f}" alt="{_alt(f, a)}" loading="lazy"></figure>' for f, a, _ in ESSAY[m.group(1)])
        if figs:
            i = h.index("</h1>") + 5
            h = h[:i] + figs + h[i:]
    # journal cards anywhere: the essay's original image on its card
    def card(mm):
        slug = mm.group(2)
        if slug in ESSAY:
            f = ESSAY[slug][0][0]
            return mm.group(0) + f'<img class="jr-hub-img" src="images/{f}" alt="" loading="lazy">'
        return mm.group(0)
    h = re.sub(r'(<a class="jr-hub-card" href="journal-([\w-]+)\.html">)', card, h)
    # essays that no longer have their own page: their original images go on the Journal hub
    if name == "journal.html" and "</h1>" in h:
        orphans = _uniq([x for slug in ORPHANS for x in ESSAY.get(slug, []) if x[0].startswith("essay-")])
        if orphans:
            k = h.index("</section>", h.index("<h1")) + 10 if "</section>" in h[h.index("<h1"):] else h.index("</h1>") + 5
            h = h[:k] + _grid([(f, a, "") for f, a, _ in orphans], "Images from original essays that are not on the site yet.") + h[k:]
    # homepage and scorecard: the original page's images, placed under the charts band / hero
    if name in ("index.html", "scorecard.html"):
        items = _uniq([(f, a, _j(x)) for f, a, x in USAGE[name] if not (name == "index.html" and f == "chamber.jpg")])
        if name == "scorecard.html":
            items = _uniq(items + [(f, a, "") for f, a, _ in USAGE["pump.html"]] + [(f, "", "") for f in UNUSED])
        g = _grid(items, "From the original SwampForce build. Tap an image to open it." if name == "scorecard.html" else "From the original SwampForce build. Tap an image for the story.")
        k = h.find('<section class="sf-charts-first">')
        if k != -1:
            k = h.index("</section>", k) + 10
        else:
            k = h.index("</section>", h.index("<h1")) + 10
        h = h[:k] + g + h[k:]
    return h

def report(current_journals):
    have = {s for s in ESSAY}
    return sorted(s for s in current_journals if s not in have)
