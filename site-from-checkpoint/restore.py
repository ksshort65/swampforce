"""Restore Grok Build (original edition) content that the current site lacks, verbatim.
Source: /workspace/compare/original/.../upload-as-is (copied to image-src/original-site/ for reproducibility).
Only blocks whose wording is not already on the matching current page are restored, folded behind 'Read more'.
Figures that compete with the site's single number set are updated in place (noted in the fold)."""
import re, shutil, html as H
from pathlib import Path
from bs4 import BeautifulSoup
ROOT = Path(__file__).parent / "image-src" / "original-site"
NEW5 = ["a-barcode-is-not-a-lock", "clean-hands", "it-does-not-fit", "the-check-they-will-not-write", "what-they-are-protecting"]
MAP = {"index.html": ["index.html"], "pump.html": ["gas-gap.html"], "about.html": ["about.html"], "foreword.html": ["foreword.html"]}
SC_TABS = {"gop": "tab-gop", "dem": "tab-dem", "split": "tab-split", "oval": "tab-oval", "compare": "tab-compare"}
NOTE = ('<p class="period-note">From the original edition, restored as written. Figures that changed since are shown at today’s values: '
        '252 cases in the catalog (118 verified, 131 still being checked, 3 set aside); national debt $40.07T (Treasury, Debt to the Penny, Sep 24, 2026).</p>')
RESTORED = {}

def norm(t):
    t = H.unescape(re.sub(r"<[^>]+>", " ", t)).lower()
    t = re.sub(r"[\u2018\u2019\u201c\u201d'\"`]", "", t); t = re.sub(r"[^a-z0-9$%. ]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()

def sh(t):
    w = t.split(); return {" ".join(w[i:i + 3]) for i in range(max(len(w) - 2, 1))}

def fix_numbers(s):
    s = re.sub(r"\$40\.09(\s*T\b|\s*trillion)", r"$40.07\1", s)
    s = s.replace("Sep 17, 2026", "Sep 24, 2026").replace("September 17, 2026", "September 24, 2026")
    # a 3-digit catalog count that is not today's → today's catalog figure
    s = re.sub(r"\b(?!(?:252|249|118|131)\b)(\d{3})( (?:documented )?(?:cases|claims))\b", r"252\2", s)
    return s

def fix_links(s):
    s = re.sub(r'(src|href)="/images/', r'\1="images/', s)
    s = re.sub(r'href="/?dispatch/([a-z0-9-]+)\.html"', lambda m: f'href="journal-{m.group(1)}.html"', s)
    s = re.sub(r'href="(?:\.\./)?dispatch/', 'href="journal-', s)
    s = s.replace('href="/pump.html"', 'href="gas-gap.html"').replace('href="pump.html"', 'href="gas-gap.html"')
    s = s.replace('href="/archive.html"', 'href="journal.html"').replace('href="archive.html"', 'href="journal.html"')
    s = re.sub(r'href="/([a-z0-9-]*\.html)"', r'href="\1"', s).replace('href="/"', 'href="index.html"')
    s = s.replace('rel="noreferrer"', 'rel="noopener noreferrer"')
    s = s.replace("journal-that-is-not-why-they-are-elected.html", "journal-they-forgot-who-they-work-for.html")
    s = re.sub(r'href="(?:/?scorecard\.html)?#(gop|dem|split|oval|compare)-(?:charts|read)"', r'href="scorecard.html#\1"', s)
    return s

def clean(s):
    s = re.sub(r"\s(?:style)=\"[^\"]*\"", "", s) if False else s
    return fix_numbers(fix_links(s))

def blocks(node):
    out = []
    for ch in node.children:
        if not getattr(ch, "name", None):
            if str(ch).strip(): out.append(str(ch))
            continue
        if ch.name in ("script", "style", "nav", "header", "footer"):
            continue
        txt = ch.get_text(" ", strip=True)
        if re.search(r"©|copyright|all rights reserved", txt, re.I):
            continue
        if ch.name in ("div", "section", "article") and len(txt) > 700 and ch.find(["p", "h2", "h3", "div"]):
            out.extend(blocks(ch))
        else:
            out.append(str(ch))
    return out

STATS = {"added": 0, "skipped": 0}
_SITE = None
SEEN = set()

def site_shingles():
    """Whole current site: every page (incl. collapsed text) and data files, minus anything this module restored."""
    global _SITE
    if _SITE is None:
        out = Path("/workspace/_gh-backup-work/site-from-checkpoint/public_html"); S = set(); IMGS = set()  # last published build (restored folds carry <!--RS--> markers and are stripped)
        for f in list(out.glob("*.html")) + list(out.glob("docs/*.html")):
            if f.name[8:-5] in NEW5: continue
            t = f.read_text(encoding="utf-8", errors="ignore")
            t = re.sub(r'<!--RS-->.*?<!--/RS-->', " ", t, flags=re.S)
            t = re.sub(r'<section class="wrap"><h2 class="strip-h">From the original edition</h2>.*?</section>', " ", t, flags=re.S)
            IMGS |= set(re.findall(r'images/([\w.-]+)', t)); S |= sh(norm(t))
        for f in list(out.glob("data/*")) + list(out.glob("assets/*.js")):
            if f.suffix in (".csv", ".json", ".js", ".txt"):
                S |= sh(norm(f.read_text(encoding="utf-8", errors="ignore")))
        _SITE = (S, IMGS)
    return _SITE

_REV = None
def reviewed():
    """Every row of checkpoint-review/site-apply.json was reviewed (cut, or corrected on the site): its old wording never comes back."""
    global _REV
    if _REV is None:
        import json
        p = Path("/workspace/checkpoint-review/site-apply.json")
        _REV = []
        if p.exists():
            for x in json.loads(p.read_text(encoding="utf-8"))["entries"]:
                t = x.get("old_text") or ""
                t = t.split("|", 1)[-1].split(":", 1)[-1] if "TRUTH:" in t else t
                ss = sh(norm(t))
                if len(ss) >= 4: _REV.append(ss)
    return _REV

def missing_blocks(node, cur_text=None):
    S, IMGS = site_shingles(); keep = []
    for b in blocks(node):
        t = norm(b)
        imgs = re.findall(r'src="/?images/([^"]+)"', b)
        if len(t.split()) < 4 and not imgs:
            continue
        s = sh(t); key = t[:200]
        cov = len(s & S) / max(len(s), 1)
        new_img = [i for i in imgs if i not in IMGS]
        links = re.findall(r'href="(https?://[^"]+)"', b)
        if any(len(s & r) >= 0.3 * min(len(s), len(r)) for r in reviewed()):
            STATS["reviewed_cut"] = STATS.get("reviewed_cut", 0) + 1; continue
        if key in SEEN or (cov >= 0.35 and not new_img):
            STATS["skipped"] += 1; continue
        SEEN.add(key); STATS["added"] += 1; keep.append(b)
    return keep

def fold(title, bl, fid):
    if not bl: return ""
    return (f'<!--RS--><details class="sf-fold sf-orig-restored" id="{fid}"><summary class="btn sm sf-fold-btn"><span class="sf-closed">Read more: {H.escape(title)}</span>'
            f'<span class="sf-opened">Hide</span></summary><div class="orig-restored">{NOTE}{clean("".join(bl))}</div></details><!--/RS-->')

def _soup(name):
    return BeautifulSoup((ROOT / name).read_text(encoding="utf-8"), "html.parser")

def copy_images(out):
    d = Path(out) / "images"; d.mkdir(exist_ok=True)
    for f in (ROOT / "images").iterdir():
        if not (d / f.name).exists(): shutil.copy2(f, d / f.name)

def essay(slug):
    s = _soup(f"dispatch/{slug}.html")
    title = s.h1.get_text(" ", strip=True) if s.h1 else slug.replace("-", " ").capitalize()
    main = s.find("main")
    body = clean("".join(missing_blocks(main)))
    hero = ""
    img = s.find("img")
    if img and img.get("src"):
        hero = f'<figure class="sf-orig-fig"><img src="{fix_links("src=\"" + img["src"] + "\"")[5:-1]}" alt="{H.escape(img.get("alt", ""))}" loading="lazy"></figure>'
    desc = (s.find("meta", attrs={"name": "description"}) or {}).get("content", "") if s.find("meta", attrs={"name": "description"}) else ""
    RESTORED[slug] = title
    return title, desc, (f'<article class="doc-body jr-essay wrap"><p class="hero-kicker"><a href="journal.html">Journal</a> · From the original edition</p>'
                         f'<h1>{H.escape(title)}</h1><p class="byline">SwampForce Editor</p>{body}'
                         f'<p class="period-note"><a href="journal.html">← All journal essays</a></p></article>')

def apply(name, h):
    cur = h
    extra = []
    for orig, targets in MAP.items():
        if name in targets:
            _s = _soup(orig); m = _s.find("main") or _s.body
            extra.append(fold("from the original " + orig.replace(".html", "").replace("index", "front page"), missing_blocks(m, cur), f"orig-{orig[:-5]}"))
    if name.startswith("journal-") and name[8:-5] not in NEW5:
        p = ROOT / "dispatch" / (name[8:-5] + ".html")
        if not p.exists() and name == "journal-they-forgot-who-they-work-for.html":
            p = ROOT / "dispatch" / "that-is-not-why-they-are-elected.html"
        if p.exists():
            m = BeautifulSoup(p.read_text(encoding="utf-8"), "html.parser").find("main")
            extra.append(fold("more from the original edition of this essay", missing_blocks(m, cur), "orig-essay"))
    if name == "scorecard.html":
        s = _soup("scorecard.html")
        for key, tab in SC_TABS.items():
            bl = []
            for suf in ("charts", "read"):
                n = s.find(id=f"{key}-{suf}")
                if n: bl += missing_blocks(n, cur)
            f = fold("the original edition’s notes for this tab", bl, f"orig-{key}")
            if f:
                m = re.search(rf'<section class="tab-panel[^"]*" id="{tab}"', h)
                if m:
                    depth, i = 1, m.end()
                    while depth:
                        a, b = h.find("<section", i), h.find("</section>", i)
                        if 0 <= a < b: depth += 1; i = a + 8
                        else: depth -= 1; i = b + 10
                    h = h[:i - 10] + f + h[i - 10:]
        # anything outside the panels
        m = s.find("main")
        for n in m.find_all(id=re.compile(r"-(charts|read)$")): n.decompose()
        extra.append(fold("more from the original scorecard", missing_blocks(m, cur), "orig-scorecard"))
    if name == "journal.html" and RESTORED:
        extra.append('<section class="wrap"><h2 class="strip-h">From the original edition</h2><ul class="uv-list">' +
                     "".join(f'<li><a href="journal-{k}.html">{H.escape(v)}</a></li>' for k, v in RESTORED.items()) + "</ul></section>")
    add = "".join(x for x in extra if x)
    if add:
        k = h.rfind("</main>")
        h = h[:k] + f'<div class="wrap">{add}</div>' + h[k:] if k > 0 else h.replace("</body>", add + "</body>", 1)
    return h
