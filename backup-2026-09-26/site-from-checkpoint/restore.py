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
        '263 cases in the catalog (129 verified, 131 still being checked, 3 set aside); national debt $40.07T (Treasury, Debt to the Penny, Sep 24, 2026).</p>')
RESTORED = {}

def norm(t):
    t = H.unescape(re.sub(r"<[^>]+>", " ", t)).lower()
    t = re.sub(r"[\u2018\u2019\u201c\u201d'\"`]", "", t); t = re.sub(r"[^a-z0-9$%. ]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()

def sh(t):
    w = t.split(); return {" ".join(w[i:i + 3]) for i in range(max(len(w) - 2, 1))}

def fix_numbers(s):
    import midterms as _M  # one set of debt-by-Congress numbers (1857 to today)
    s = re.sub(r"\$10\.96 \+ \$12\.65 \+ \$16\.48 = \$40\.09", f"${_M.T['R']:.2f} + ${_M.T['D']:.2f} + ${_M.T['S']:.2f} = ${_M.T_ALL:.2f}", s)
    s = re.sub(r"\$40\.09(\s*T\b|\s*trillion)", r"$40.07\1", s)
    s = s.replace("Sep 17, 2026", "Sep 24, 2026").replace("September 17, 2026", "September 24, 2026")
    # a 3-digit catalog count that is not today's → today's catalog figure
    s = re.sub(r"\b(?!(?:263|260|129|131)\b)(\d{3})( (?:documented )?(?:cases|claims))\b", r"263\2", s)
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

SHORT = {
 "a-barcode-is-not-a-lock": [
  "August 2020: Democrats told the country the Postal Service was being dismantled so a ballot would die in a bin. November 12, 2020: CISA called the contest ‘the most secure in American history.’",
  "The ‘most secure’ sentence was about voting systems: paper backups so a hacked tally can be checked. That is a claim about machines, not the mail.",
  "CISA did not audit the kitchen. It issued a press release about the tabulator.",
  "The Intelligent Mail barcode is a routing mark so a sorter knows which bin. Tracking is not identity.",
  "August 2026: USPS finalized a rule with a federal portal and two unique barcodes per mail voter."],
 "clean-hands": [
  "The method is a sentence cut just short of the Supreme Court’s incitement test: they do not say ‘torch the precinct.’ They say create a crowd.",
  "June 23, 2018, Maxine Waters: “you get out and you create a crowd and you push back on them.” February 9, 2020, Ayanna Pressley: “we will bring the fire.”",
  "June 1, 2020, Kamala Harris urged donors to a bail fund for protesters in Minnesota. July 9, 2020, Nancy Pelosi on a toppled statue: “People will do what they do.”",
  "The unrest of May 26 to June 8, 2020 was classified a catastrophe across more than twenty states; the Insurance Information Institute put insured losses at one to two billion dollars.",
  "The Member keeps clean hands. The city pays."],
 "it-does-not-fit": [
  "Medicare for All: about $32 trillion to $34 trillion in extra federal spending over ten years (Urban Institute); at least $32.6 trillion (Mercatus); $25 trillion to $35 trillion (CRFB).",
  "CBO, fiscal 2026: the Treasury takes in $5.6 trillion, spends $7.4 trillion; the hole is $1.9 trillion.",
  "Debt held by the public is 101 percent of GDP, heading to 120 percent by 2036; net interest goes from $1.0 trillion to $2.1 trillion.",
  "$34 trillion over ten years is $3.4 trillion every year, on top of the $7.4 trillion they already cannot pay.",
  "Congress has never sent a scored Medicare-for-all bill to the President."],
 "the-check-they-will-not-write": [
  "The advocates’ own number is $10 trillion to $16 trillion (Darity: $10–12 trillion at Brookings, 2020; $16 trillion ‘the floor,’ 2026).",
  "H.R. 40 has been introduced since 1989. It does not pay anyone. It studies. Ninety-six cosponsors in 2025.",
  "California’s task force put up to $1.2 million per person on the table; the 2024 budget set aside $12 million for ‘reparations legislation,’ not payments.",
  "The Treasury takes in $5.6 trillion in fiscal 2026 and runs a $1.9 trillion deficit.",
  "The pattern is the product: commission, headline, no check."],
 "what-they-are-protecting": [
  "USAID contracts, FY2023: about $6.8 billion obligated; Chemonics took the largest share, more than $1 billion.",
  "Federal lobbying: a record $4.4 billion in 2024, more than $5 billion in 2025.",
  "STOCK Act: a $200 late fee and no member prosecuted for insider trading under it.",
  "In fiscal 2023 the U.S. disbursed $71.9 billion in foreign aid; USAID moved about $43.8 billion (Pew).",
  "Open Society Foundations: $1.2 billion in 2024 expenditures. That is private money, not USAID. They protect the tap, the lobby, and the ticker."],
}


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
                         f'<h1>{H.escape(title)}</h1><p class="byline">SwampForce Editor</p>'
                         + (f'<ul class="jr-short-pts">' + "".join(f"<li>{H.escape(x)}</li>" for x in SHORT[slug]) + '</ul>'
                            f'<details class="jr-full"><summary>Read full essay</summary><div class="jr-full-body">{body}</div></details>' if slug in SHORT else body) +
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
