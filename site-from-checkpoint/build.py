#!/usr/bin/env python3
"""Swamp Force — visual-first static build (Namecheap). Data loaders reused from v2data.py (site-v2)."""
from __future__ import annotations

import csv, html, json, re, shutil, zipfile
from collections import Counter, defaultdict
from pathlib import Path
from types import SimpleNamespace

import v2data as V

ROOT = Path("/workspace")
SITE = ROOT / "site-from-checkpoint"
OUT = SITE / "public_html"
ZIP = ROOT / "swampforce-from-checkpoint.zip"
LAW = ROOT / "lawfare"
TS = ROOT / "term-split"
AUDIT = ROOT / "checkpoint-review"
e = html.escape
OK = V.OK
DOMAIN = "https://swampforce.com"


def ico(name: str) -> str:
    paths = {
        "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
        "scale": '<path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zm14 0-3 7a4 4 0 0 0 6 0l-3-7zM8 21h8"/>',
        "book": '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
        "capitol": '<path d="M3 21h18M5 21V11M9 21V11M15 21V11M19 21V11M3 11h18L12 5zM12 5V2"/>',
        "cart": '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11L21 7H6.2"/>',
        "file": '<path d="M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6"/>',
        "print": '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/>',
        "down": '<path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/>',
        "chev": '<path d="m6 9 6 6 6-6"/>',
        "quote": '<path d="M5 7h5v5c0 3-2 5-5 6M14 7h5v5c0 3-2 5-5 6"/>',
        "eye": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    }
    return (f'<svg class="i" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" '
            f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths[name]}</svg>')

EVIDENCE_MENU = [("fake-news.html", "Fake News Exposed", "{total} claim | record cases"),
                 ("democrats.html", "Democrats", "Party ledger"),
                 ("republicans.html", "Republicans", "Party ledger"),
                 ("january-6.html", "J6", "The caption vs. the charge"),
                 ("lawfare.html", "Lawfare", "10 dockets, key rulings")]
JOURNAL_MENU = [("journal.html", "Journal essays", "30-second reads, the record, our view"),
                ("foreword.html", "The Republic", "Foreword: who the hire works for"),
                ("congress.html", "Congress", "The purse, the debt, the members"),
                ("border.html", "The Border", "Encounters by fiscal year"),
                ("remedy.html", "The Remedy", "Courts, statutes, accountability")]
LAW_MENU = [("brief.html", "Staff brief", "Two-page PDF + HTML"),
            ("appendix.html", "Evidence appendix", "Every case, every citation"),
            ("about.html", "Methodology", "How evidence is ranked"),
            ("downloads.html", "Downloads", "CSV · Excel · PDF")]

# Watch sections are data-driven (see watch.py): a section appears here only when its source files exist.
import watch as W
WATCH_ACTIVE = W.active()
WATCH_MENU = [(sec.slug, sec.title, sec.menu_desc) for sec in WATCH_ACTIVE if sec.in_menu]


def drop(label, icon, items, active):
    act = any(h == active for h, _, _ in items)
    links = "".join(f'<a href="{h}"{" class=active" if h == active else ""}><strong>{e(t)}</strong><span>{e(d)}</span></a>'
                    for h, t, d in items)
    return (f'<details class="nav-drop{" has-active" if act else ""}"><summary>{ico(icon)}{e(label)}{ico("chev")}</summary>'
            f'<div class="menu">{links}</div></details>')


def nav(active):
    def a(h, label, icon):
        return f'<a href="{h}"{" class=active" if h == active else ""}>{ico(icon)}{e(label)}</a>'
    return (drop("Evidence", "search", EVIDENCE_MENU, active) + a("scorecard.html", "Midterms", "chart")
            + a("betrayal.html", "The Betrayal", "scale")
            + f'<a href="opinion.html" class="nav-op{" active" if active == "opinion.html" else ""}">{ico("quote")}Opinion</a>'
            + drop("Journal", "book", JOURNAL_MENU, active)
            + (drop("Watch", "eye", WATCH_MENU, active) if WATCH_MENU else "")
            + drop("For Lawmakers", "capitol", LAW_MENU, active))


BRAND_ART = ('<picture class="brand-eagle"><source srcset="assets/brand/eagle-mark.webp" type="image/webp"><img src="assets/brand/eagle-mark.png" alt="" width="103" height="120"></picture>'
             '<picture class="brand-head"><source srcset="assets/brand/eagle-head.webp" type="image/webp"><img src="assets/brand/eagle-head.png" alt="" width="128" height="128"></picture>')
STAMP_PIC = ('<picture><source srcset="assets/brand/stamp.webp" type="image/webp"><img src="assets/brand/stamp.png" alt="Swamp Force stamp" width="480" height="480" loading="lazy"></picture>')


def page(fname, title, desc, body, *, charts=None, extra_js="", flush=False, serious=False):
    chart_js = ""
    if charts:
        chart_js = ('<script src="assets/vendor/chart.umd.min.js" defer></script>\n'
                    f'<script>window.SF_CHARTS={json.dumps(charts, ensure_ascii=False)};</script>\n')
    extra = f'<script src="{extra_js}" defer></script>' if extra_js else ""
    canon = f"{DOMAIN}/" if fname == "index.html" else f"{DOMAIN}/{fname}"
    shop_foot = "" if (serious or fname == "store.html") else (
        '<div class="foot-shop"><div><strong>Wear the record.</strong> Every purchase funds this project: the research, '
        'the hosting, the brief.</div><a class="btn" href="store.html">' + ico("cart") + ' Visit the store</a></div>')
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canon}">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png" sizes="180x180">
<meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{DOMAIN}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Swamp Force stamp: the eagle, SWAMP FORCE, WE THE PEOPLE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@SwampForce">
<meta name="theme-color" content="#071528">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="{'serious' if serious else ''}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="mast">
    <a class="brand" href="index.html" aria-label="SwampForce home">{BRAND_ART}<span class="brand-mark" aria-hidden="true"></span><span class="brand-word">SwampForce<sup>™</sup></span></a>
    <p class="kicker">Vote the file. Not the feeling.</p>
    <div class="mast-actions">
      <a class="shop-btn" href="store.html">{ico("cart")}<span>Shop</span></a>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    </div>
  </div>
  <nav class="nav-row" id="site-nav" aria-label="Primary">{nav(fname)}</nav>
</header>
<main id="main" class="main{' flush' if flush else ''}">
{body}
</main>
<footer class="site-footer">
  <div class="footer-inner">
    {shop_foot}
    <div class="foot-grid{' five' if WATCH_MENU else ''}">
      <div><a class="foot-stamp" href="store.html" aria-label="Swamp Force store">{STAMP_PIC}</a><p class="foot-brand">Swamp Force™</p>
        <p>A government-source journal. Compare the action to the speech. Opinion is always labeled
        <span class="op-tag">Opinion</span>.</p>
        <p>© 2026 Renee Stewart · <a href="mailto:editor@swampforce.com">editor@swampforce.com</a> · <a href="https://x.com/SwampForce" rel="noopener">@SwampForce</a></p></div>
      <div><p class="foot-h">Evidence</p><a href="fake-news.html">Fake News Exposed</a><a href="democrats.html">Democrats</a><a href="republicans.html">Republicans</a><a href="january-6.html">J6</a><a href="lawfare.html">Lawfare</a>{'<a href="unsupported.html">Unsupported claims</a>' if UNSUP else ''}</div>
      <div><p class="foot-h">Read</p><a href="journal.html">Journal</a><a href="scorecard.html">Midterm scorecard</a><a href="betrayal.html">The Betrayal</a><a href="opinion.html">Opinion</a><a href="foreword.html">The Republic</a><a href="congress.html">Congress</a><a href="border.html">The Border</a><a href="remedy.html">The Remedy</a></div>
      {('<div><p class="foot-h">Watch</p>' + "".join(f'<a href="{h}">{e(t)}</a>' for h, t, _ in WATCH_MENU) + '</div>') if WATCH_MENU else ''}
      <div><p class="foot-h">For lawmakers</p><a href="brief.html">Staff brief</a><a href="appendix.html">Evidence appendix</a><a href="about.html">Methodology</a><a href="downloads.html">Downloads</a><a href="store.html">Store</a></div>
    </div>
  </div>
</footer>
{chart_js}<script src="assets/app.js" defer></script>
{extra}
</body>
</html>
"""

PROOF_ORDER = ["Official record", "Original transcript/video", "Outlet's own correction", "Fact-check only"]
PROOF_LABEL = {"Official record": "Official record", "Original transcript/video": "Transcript / video",
               "Outlet's own correction": "Outlet's own correction", "Fact-check only": "Independent fact-check"}
PROOF_CLS = {"Official record": "official", "Original transcript/video": "transcript",
             "Outlet's own correction": "outlet", "Fact-check only": "factcheck"}


def proof_badge(p):
    return f'<span class="proof {PROOF_CLS.get(p, "factcheck")}">{e(PROOF_LABEL.get(p, p or "Record"))}</span>'


def ev_badge(ev):
    if ev == "Proven false":
        return '<span class="badge proven">Proven false</span>'
    if ev == "Rated misleading":
        return '<span class="badge misleading">Rated misleading</span>'
    return ""


def src_link(url, label=None):
    if not url:
        return ""
    return f'<a class="src" href="{e(url)}" target="_blank" rel="noopener">{e(label or V.domain(url))} ↗</a>'


def tile(num, label, sub="", accent=False, count=None, prefix="", suffix="", decimals=0, src=None, dark=False):
    cls = "stat-tile" if dark else "stat"
    data = ""
    if count is not None:
        data = f' data-count="{count}" data-prefix="{e(prefix)}" data-suffix="{e(suffix)}" data-decimals="{decimals}"'
    s = f'<div class="sub">{sub}</div>' if sub else ""
    src_html = f'<div class="tile-src">{src}</div>' if src else ""
    return (f'<div class="{cls}{" accent" if accent else ""}"><div class="num"{data}>{e(num)}</div>'
            f'<div class="lbl">{e(label)}</div>{s}{src_html}</div>')


def shop_strip(text="Carry the record with you."):
    return (f'<aside class="shop-strip"><div><strong>{e(text)}</strong> Purchases fund the research and keep this site online.</div>'
            f'<a class="btn" href="store.html">{ico("cart")} Shop Swamp Force</a></aside>')


def clean_note(s):
    s = re.sub(r"/workspace/lawfare/sources/([\w.-]+\.pdf)", r"lawfare-docs/\1", s or "")
    s = re.sub(r"/workspace/\S+", "", s)
    return s


def linkify(s):
    s = e(clean_note(s))
    s = re.sub(r"(https?://[^\s;,<)]+)", lambda m: f'<a href="{m.group(1)}" target="_blank" rel="noopener">{V.domain(m.group(1))} ↗</a>', s)
    s = re.sub(r"(?<![/\w])(lawfare-docs/[\w.-]+\.pdf)", r'<a href="\1">court PDF ↗</a>', s)
    return s


def case_card(c):
    short = c["claim"] if len(c["claim"]) <= 170 else c["claim"][:167].rsplit(" ", 1)[0] + "…"
    search = " ".join([c["claim"], c["notes"], c["who"], c["method"], c["id"], c["tag"]])
    links = " ".join(x for x in [src_link(c.get("primary"), "Primary source"), src_link(c.get("truth_url"), "The record")] if x)
    dates = ""
    if c.get("began") or c.get("ended"):
        dates = f'<p class="meta-line"><b>Began</b> {e(c.get("began") or "—")} · <b>Ended</b> {e(c.get("ended") or "—")}</p>'
    return f"""<article class="frame case" id="case-{e(c['id'])}" data-case="{e(c['id'])}" data-method="{e(c['method'])}" data-evidence="{e(c['evidence'])}" data-proof="{e(c['proof'])}" data-term="{e(c['term'])}" data-search="{e(search)}">
<button type="button" class="frame-head" data-frame-toggle aria-expanded="false">
<span class="case-id">#{e(c['id'])}</span><span class="frame-tag">{e(short)}</span>
<span class="frame-meta">{ev_badge(c['evidence'])}{proof_badge(c['proof'])}<span class="chip ghost">{e(c['method'])}</span></span>
<span class="flip-hint">See the record {ico("chev")}</span></button>
<div class="frame-body"><div class="frame-cols">
<div class="frame-col claim-side"><h3>What they said</h3><p>{e(c['claim'])}</p>{dates}
<p class="meta-line"><b>Pushed by</b> {e(c['who'] or '—')}</p><p class="meta-line"><b>How long it ran</b> {e(c['duration'] or '—')}</p></div>
<div class="frame-col truth-side"><h3>What the record shows</h3><p>{e(c['notes'] or 'See the linked record.')}</p>
<p class="meta-line"><b>Correction</b> {e(c['corrvis'] or '—')}</p></div></div>
<div class="frame-foot">{proof_badge(c['proof'])} {links} <a class="cite" href="#case-{e(c['id'])}" data-cite>Link to this case</a></div></div>
</article>"""


def frame_simple(tag, claim, truth, url, verdict_label="On the record", claim_h="The caption", truth_h="The file", row=None):
    row = row or {}
    fact, _, view = truth.partition("Our view:")
    view_html = f'<p class="opinion-inline"><span class="op-tag">Our view</span> {e(view.strip())}</p>' if view.strip() else ""
    links = src_link(url, row.get("_src_label", "Source")) + "".join(" " + src_link(u, l) for l, u in row.get("_extra", []))
    return f"""<article class="frame open"><div class="frame-head static"><span class="frame-tag">{e(tag)}</span>
<span class="frame-meta"><span class="badge proven">{e(verdict_label)}</span></span></div>
<div class="frame-body"><div class="frame-cols"><div class="frame-col claim-side"><h3>{e(claim_h)}</h3><p>{e(claim)}</p></div>
<div class="frame-col truth-side"><h3>{e(truth_h)}</h3><p>{e(fact.strip())}</p>{view_html}</div></div>
<div class="frame-foot">{links}</div></div></article>"""

# ───── data ─────
cases = V.load_catalog()
verified = V.load_verified()


def _apply_site_fixes(rows):
    """Apply /workspace/checkpoint-review/site-apply.json: 'cut it' entries are never rendered; rows this site renders
    take their corrected text from watch-data/site-apply-overlay.json (written from the entry's fix instructions)."""
    sa = json.loads((AUDIT / "site-apply.json").read_text(encoding="utf-8"))
    ov = json.loads((SITE / "watch-data" / "site-apply-overlay.json").read_text(encoding="utf-8"))["rows"]
    cut = {x["id"] for x in sa["entries"] if "cut it" in (x.get("verdict") or "")}
    out = []
    for r in rows:
        if r["Item_No"] in cut:
            continue
        o = ov.get(r["Item_No"])
        if o:
            r = dict(r)
            for k in ("Text", "Best_Source_URL", "Attributed_To"):
                if o.get(k):
                    r[k] = o[k]
            r["_src_label"] = o.get("source_label", "Source")
            r["_extra"] = o.get("extra_links", [])
            r["_applied"] = o["entry"]
        out.append(r)
    SITE_APPLY.update(entries=len(sa["entries"]), cut=len(cut), overlay=len(ov), rows_after=len(out))
    return out


SITE_APPLY = {}
verified = _apply_site_fixes(verified)
VROW = {r["Item_No"]: r for r in verified}
ST = V.stats(cases)
EVIDENCE_MENU[0] = (EVIDENCE_MENU[0][0], EVIDENCE_MENU[0][1], EVIDENCE_MENU[0][2].format(total=ST["total"]))
CID = {c["id"] for c in cases}
CONGRESS_N = json.loads((TS / "congress-count.json").read_text())["count"]
corr = Counter()
for c in cases:
    cv = (c["corrvis"] or "").lower()
    if cv.startswith("never"): corr["Never corrected by the pusher"] += 1
    elif "editor" in cv: corr["Editor's note"] += 1
    elif "legal" in cv or "settle" in cv: corr["After legal threat / settlement"] += 1
    elif "on-air" in cv or "on air" in cv: corr["On-air correction"] += 1
    elif cv.startswith("appended"): corr["Appended correction line"] += 1
    elif cv: corr["Not recorded"] += 1
# "Never corrected" splits into rows a fact-check later addressed and rows with no fact-check on file.
NC_FC = sum(1 for c in cases if (c["corrvis"] or "").lower().startswith("never") and "fact-check" in (c["corrvis"] or "").lower())
NC_NOFC = corr["Never corrected by the pusher"] - NC_FC

# ───── unsupported claims (optional input) ─────
# If /workspace/reverify/unsupported-final.csv exists and has rows, the site gains an "Unsupported claims" page
# (unsupported.html), a CSV copy in downloads/, and links to both. If the file is absent or empty, none of it is
# built and no link, heading or placeholder appears anywhere. Column names are matched loosely (see _col).
import os
UNSUP_SRC = Path(os.environ.get("SWAMP_UNSUPPORTED_CSV", str(ROOT / "reverify" / "unsupported-final.csv")))  # env override is for testing only
_CASE = {c["id"]: c for c in cases}


def _col(row, *names):
    low = {(k or "").strip().lower(): (v or "").strip() for k, v in row.items()}
    for n in names:
        if low.get(n.lower()):
            return low[n.lower()]
    return ""


UNSUP_EXTRA = SITE / "watch-data" / "unsupported-extra.csv"  # claims from the watch pages rated Unsupported


def load_unsupported():
    out = []
    rows = []
    for src in (UNSUP_SRC, UNSUP_EXTRA):
        if src.exists():
            with open(src, encoding="utf-8-sig", newline="") as fh:
                rows += list(csv.DictReader(fh))
    if True:
        for r in rows:
            iid = _col(r, "Item_ID", "ID", "Item_No", "Case_ID")
            cat = _CASE.get(iid, {})
            claim = _col(r, "Claim") or cat.get("claim", "")
            if not claim:
                continue
            reason = _col(r, "Reason", "Why_Unsupported", "Unsupported_Reason", "Verification_Note", "Note", "Notes", "Flag")
            urls = [u for u in re.findall(r"https?://[^\s;,|]+", " ".join(
                _col(r, k) for k in ("Verification_Source_URL", "Source_URL", "Truth_Source_URL", "Primary_Source_URL", "URL", "URLs")))]
            out.append({"id": iid, "claim": claim.split("\n")[0], "who": _col(r, "Who_Pushed_It", "Who") or cat.get("who", ""),
                        "reason": reason, "urls": list(dict.fromkeys(urls)), "checked": _col(r, "Checked", "Date_Checked", "Source_Loaded", "Date"),
                        "in_catalog": iid in _CASE})
    return out


UNSUP = load_unsupported()
if UNSUP:
    EVIDENCE_MENU.append(("unsupported.html", "Unsupported claims", f"{len(UNSUP)} claim{'s' if len(UNSUP) != 1 else ''} we could not support"))
methods = Counter(c["method"] for c in cases if c["method"])
TOP_METHODS = [m for m, _ in methods.most_common(8)]


def url_of(item):
    return (VROW.get(item, {}).get("Best_Source_URL") or "").strip()

SRC = {
    "bls22": ("BLS CPI release, July 13, 2022", url_of("660")),
    "bls11": ("BLS CPI release, Oct 19, 2011", url_of("656")),
    "bls26": ("BLS CPI release, Sep 11, 2026", url_of("748")),
    "cbp": ("CBP enforcement statistics", url_of("625")),
    "treas": ("Treasury, Debt to the Penny (Sep 17, 2026)", url_of("756")),
    "cbo": ("CBO Budget & Economic Outlook, Feb 2026", url_of("820")),
    "ers": ("USDA ERS farm income forecast, Sep 3, 2026", url_of("405")),
    "nyc": ("NYC Comptroller, asylum-seeker services", url_of("684")),
    "ssi": ("SSA Monthly Statistical Snapshot, Dec 2025", url_of("497")),
    "ssa": ("SSA Monthly Statistical Snapshot, Jul 2026", url_of("505")),
    "cms": ("CMS 2026 Part B fact sheet", url_of("507")),
    "fns": ("USDA FNS SNAP data", url_of("499")),
}
for k, (n, u) in SRC.items():
    assert u.startswith("http"), (k, u)


def S(key):
    n, u = SRC[key]
    return src_link(u, n)


def chart_card(cid, title, sub="", tall=False):
    return (f'<div class="chart-card"><h3>{e(title)}</h3>{f"<p class=sub>{e(sub)}</p>" if sub else ""}'
            f'<div class="chart-wrap{" tall" if tall else ""}"><canvas id="{cid}" role="img" aria-label="{e(title)}"></canvas></div></div>')


def explore_card(href, img, title, text, chips):
    ch = "".join(f'<span class="chip">{e(c)}</span>' for c in chips)
    return (f'<a class="card" href="{href}"><div class="card-media" style="background-image:url(\'{img}\')"></div>'
            f'<div class="card-body"><h3>{e(title)}</h3><p>{e(text)}</p><div class="chip-row">{ch}</div></div></a>')


def charts_evidence():
    return [
        {"id": "chart-evidence", "type": "doughnut", "labels": ["Proven false", "Rated misleading"],
         "data": [ST["proven"], ST["misleading"]], "colors": ["#166534", "#b45309"],
         "link": {"key": "evidence", "values": ["Proven false", "Rated misleading"]}},
        {"id": "chart-proof", "type": "bar", "horizontal": True,
         "labels": [PROOF_LABEL[p] for p in PROOF_ORDER],
         "data": [sum(1 for c in cases if c["proof"] == p) for p in PROOF_ORDER],
         "colors": ["#14532d", "#1e3a5f", "#7c2d12", "#57534e"], "link": {"key": "proof", "values": PROOF_ORDER}},
        {"id": "chart-term", "type": "bar", "labels": ["First term (2017–21)", "2021 – present"],
         "data": [ST["first"], ST["later"]], "colors": ["#0c2340", "#b91c1c"], "link": {"key": "term", "values": ["first", "later"]}},
        {"id": "chart-methods", "type": "bar", "horizontal": True, "labels": TOP_METHODS,
         "data": [methods[m] for m in TOP_METHODS], "colors": ["#b91c1c"], "link": {"key": "method", "values": TOP_METHODS}},
    ]


def build_home():
    import midterms as M
    nc = corr["Never corrected by the pusher"]
    tiles = "".join([
        tile(str(ST["total"]), "Documented cases", accent=True, count=ST["total"], dark=True),
        tile(str(ST["proven"]), "Proven false", count=ST["proven"], dark=True),
        tile(str(ST["official"]), "Settled by the official record", count=ST["official"], dark=True),
        tile(str(nc), "Never corrected by whoever pushed it", count=nc, dark=True),
        tile(str(CONGRESS_N), "Pushed by sitting members of Congress", count=CONGRESS_N, dark=True),
    ])
    picks = [c for c in cases if c["proof"] == "Official record" and c["evidence"] == "Proven false"][:3]
    body = f"""
<section class="hero" style="background-image:url('images/hero-eagle.jpg')">
 <div class="hero-inner">
  <picture class="hero-lockup"><source srcset="assets/brand/lockup-light.webp" type="image/webp"><img src="assets/brand/lockup-light.png" alt="SwampForce" width="1100" height="583" fetchpriority="high"></picture>
  <p class="hero-kicker">The record, not the rerun</p>
  <h1>Vote the file.<br>Not the feeling.</h1>
  <p class="dek">{ST['total']} claims about a president. Each one checked against the record that settled it.</p>
  <div class="hero-ctas">
   <a class="btn" href="scorecard.html">{ico("chart")} Midterm scorecard: helped &amp; hurt</a>
   <a class="btn ghost" href="fake-news.html">{ico("search")} Flip through the cases</a>
   <a class="btn ghost" href="brief.html">{ico("capitol")} For lawmakers: staff brief</a>
  </div>
  <div class="stat-rail">{tiles}</div>
 </div>
</section>
<div class="wrap">
<a class="mt-home" href="scorecard.html">
 <span class="mt-home-k">Midterm scorecard</span>
 <span class="mt-home-h">Who ran Congress. What it cost.</span>
 <span class="mt-home-bars">
  <span class="mt-hb gop"><b>${M.T['R']:.2f}T</b> Republican control</span>
  <span class="mt-hb dem"><b>${M.T['D']:.2f}T</b> Democratic control</span>
  <span class="mt-hb split"><b>${M.T['S']:.2f}T</b> Split Congress</span>
 </span>
 <span class="mt-home-go">Helped and hurt, party by party →</span>
</a>
<section class="lawmaker-band">
 <div class="lb-copy"><p class="section-label light">For lawmakers &amp; staff</p>
  <h2>A two-page brief. A full evidence appendix. Every citation ranked.</h2>
  <p>Written for a hearing room. Each case is ranked by the strength of its proof, from the official record down to an independent fact-check.</p>
  <div class="lb-ctas"><a class="btn" href="docs/swampforce-brief.pdf">{ico("down")} Staff brief (PDF)</a>
  <a class="btn ghost" href="appendix.html">{ico("file")} Evidence appendix</a>
  <a class="btn ghost" href="about.html">How evidence is ranked</a></div></div>
 <a class="lb-doc" href="brief.html"><img src="images/brief-p1.jpg" alt="First page of the Swamp Force staff brief" loading="lazy"></a>
</section>
<section class="section-pad">
 <p class="section-label">The evidence at a glance</p>
 <h2 class="section-title">Tap any bar to open those cases.</h2>
 <div class="chart-grid">
  {chart_card("chart-evidence", "Verdict", "How each claim was rated")}
  {chart_card("chart-proof", "Strength of proof", "Strongest proof first")}
  {chart_card("chart-term", "When it ran", "Cases by period")}
  {chart_card("chart-methods", "How it was done", "Most common methods", tall=True)}
 </div>
</section>
<section class="section-pad">
 <p class="section-label">Flip a case</p>
 <h2 class="section-title">What they said. What the record shows.</h2>
 <div class="ledger">{"".join(case_card(c) for c in picks)}</div>
 <p class="center"><a class="btn navy" href="fake-news.html">See all {ST['total']} cases</a></p>
</section>
<section class="section-pad">
 <p class="section-label">Explore</p>
 <h2 class="section-title">Pick a door.</h2>
 <div class="cards">
  {explore_card("fake-news.html", "images/chamber.jpg", "Fake News Exposed", f"{ST['total']} claims, each set against the record that corrected it.", ["Proven false", "Filter + search"])}
  {explore_card("scorecard.html", "images/capitol.jpg", "Midterm Scorecard", "Helped and hurt under Republican, Democratic and split control, with the debt added under each.", ["Helped · Hurt", "Debt by control"])}
  {explore_card("betrayal.html", "images/flag-wave.jpg", "The Great American Betrayal", "How a narrative gets built, and why the correction never catches up.", ["Opinion labeled"])}
  {explore_card("january-6.html", "images/chamber.jpg", "J6", "What the television said, set against the charging statute.", ["§ 2383"])}
  {explore_card("lawfare.html", "images/capitol.jpg", "Lawfare", "Ten dockets, their key rulings, and the court PDFs.", ["Court record"])}
  {explore_card("border.html", "images/card-eagle.jpg", "The Border", "CBP encounters by fiscal year, from CBP's own table.", ["Chart"])}
 </div>
</section>
<section class="spine">
 <div class="spine-copy"><p class="opinion-label">Our view · Opinion</p>
  <h2>The Great American Betrayal</h2>
  <p>Free elections assume citizens can give informed consent. Push false claims, amplify them, and leave them standing after the record corrects them, and that consent is poisoned.</p>
  <p class="spine-fact"><b>On the record:</b> {nc} of {ST['total']} cases were never corrected by whoever pushed them.</p>
  <a class="btn" href="opinion.html#the-great-american-betrayal">Read the argument</a></div>
 <div class="spine-media" style="background-image:url('images/flag-wave.jpg')"></div>
</section>
<section class="merch-band">
 <div class="mb-inner">
  <p class="section-label light">The Swamp Force store</p>
  <h2>Wear the file.</h2>
  <p>Readers keep this project running. Every store purchase pays for the research, the hosting, and the brief that goes to Congress.</p>
  <a class="btn big" href="store.html">{ico("cart")} Shop the store</a>
 </div>
 <picture class="mb-stamp"><source srcset="assets/brand/stamp.webp" type="image/webp"><img src="assets/brand/stamp.png" alt="Swamp Force stamp: WE THE PEOPLE" width="480" height="480" loading="lazy"></picture>
</section>
</div>
"""
    return page("index.html", "Swamp Force — Vote the file. Not the feeling.",
                f"{ST['total']} documented claims about President Trump, each checked against the record. Staff brief and evidence appendix for lawmakers.",
                body, charts=charts_evidence(), flush=True)


def build_fake_news():
    nc = corr["Never corrected by the pusher"]
    opts = "".join(f'<option value="{e(m)}">{e(m)}</option>' for m in sorted(methods))
    def chip(k, v, label):
        return f'<button type="button" class="chip btnchip" data-chip-filter="{k}" data-chip-value="{e(v)}">{e(label)}</button>'
    chips_ev = chip("evidence", "Proven false", "Proven false") + chip("evidence", "Rated misleading", "Rated misleading")
    chips_pr = "".join(chip("proof", p, PROOF_LABEL[p]) for p in PROOF_ORDER)
    chips_t = chip("term", "first", "First term") + chip("term", "later", "2021 – present")
    chips_m = "".join(chip("method", m, m) for m in TOP_METHODS)
    body = f"""
<section class="band-hero">
 <div class="wrap">
  <p class="hero-kicker">Fake News Exposed</p>
  <h1>What they said. What the record shows.</h1>
  <p class="dek">{ST['total']} claims about President Trump or his administration, each later corrected, retracted, settled, or shown false or misleading by the record. Tap a card to see the record.</p>
  <div class="stat-rail four">
   {tile(str(ST['total']), "Cases", accent=True, count=ST['total'], dark=True)}
   {tile(str(ST['proven']), "Proven false", count=ST['proven'], dark=True)}
   {tile(str(ST['misleading']), "Rated misleading", count=ST['misleading'], dark=True)}
   {tile(str(nc), "Never corrected by the pusher", count=nc, dark=True)}
  </div>
 </div>
</section>
<div class="wrap">
<details class="chart-drawer" id="chart-drawer" open><summary>{ico("chart")} The charts: tap a bar to filter</summary>
 <div class="chart-grid">
  {chart_card("chart-proof", "Strength of proof", "Tap a bar to filter")}
  {chart_card("chart-evidence", "Verdict", "Tap to filter")}
  {chart_card("chart-methods", "Top methods", "Tap to filter", tall=True)}
 </div>
</details>
<div class="filters" id="filters">
 <div class="filter-top">
  <label class="grow">Search<input type="search" id="q" placeholder="Search a name, outlet, word…" autocomplete="off"></label>
  <label>Method<select id="filter-method"><option value="">All methods</option>{opts}</select></label>
  <select id="filter-evidence" hidden aria-hidden="true"><option value=""></option><option>Proven false</option><option>Rated misleading</option></select>
  <select id="filter-proof" hidden aria-hidden="true"><option value=""></option>{"".join(f'<option value="{e(p)}">{e(p)}</option>' for p in PROOF_ORDER)}</select>
  <select id="filter-term" hidden aria-hidden="true"><option value=""></option><option value="first">first</option><option value="later">later</option></select>
 </div>
 <div class="chip-bar"><span class="chip-lbl">Verdict</span>{chips_ev}<span class="chip-lbl">Proof</span>{chips_pr}<span class="chip-lbl">Period</span>{chips_t}</div>
 <div class="chip-bar"><span class="chip-lbl">Method</span>{chips_m}</div>
 <p class="result-line"><span id="result-count">{ST['total']} of {ST['total']} cases</span>
  <button type="button" class="linkbtn" id="clear-filters">Clear filters</button>
  <button type="button" class="linkbtn" id="expand-all">Open all</button></p>
</div>
<div class="ledger" id="ledger">
{"".join(case_card(c) for c in cases)}
</div>
<p class="empty-note" id="empty-note" hidden>No cases match those filters.</p>
<section class="reader-path">
 <p class="section-label">Read more</p>
 <p>Why do these claims stick after they are corrected? <a href="betrayal.html">The Great American Betrayal</a> covers the research.
 Need citations? The <a href="appendix.html">evidence appendix</a> lists every case with its sources, and the spreadsheets are on <a href="downloads.html">Downloads</a>.</p>
 {f'<p>Claims that were reviewed and could not be supported by a primary source are kept apart on <a href="unsupported.html">Unsupported claims</a> ({len(UNSUP)}).</p>' if UNSUP else ''}
</section>
{shop_strip("Know the record? Wear it.")}
</div>
"""
    return page("fake-news.html", "Fake News Exposed · Swamp Force",
                f"{ST['total']} claims about President Trump set against the record that corrected them. Filter by method, verdict, proof and period.",
                body, charts=charts_evidence(), flush=True)


ENC = [("FY2021", 1956519), ("FY2022", 2766582), ("FY2023", 3201144), ("FY2024", 2901142), ("FY2025", 691906)]


def under(title, why="Being checked against the official source. A number appears here once it is confirmed."):
    return f'<div class="score-mod under"><h3>{e(title)}</h3><p><span class="chip gold">Under review</span> {e(why)}</p></div>'


def room(rid, title, control, intro, content, active=False):
    return (f'<section class="tab-panel room{" active" if active else ""}" id="tab-{rid}" aria-label="{e(title)}">'
            f'<div class="room-head"><div><h2 id="{rid}">{e(title)}</h2><p class="control">{e(control)}</p></div><p class="room-intro">{e(intro)}</p></div>'
            f'{content}</section>')


def scorecard_charts():
    return [
        {"id": "sc-enc-dem", "type": "bar", "labels": [l for l, _ in ENC[:4]], "data": [v for _, v in ENC[:4]], "colors": ["#1e3a8a"], "fmt": "int"},
        {"id": "sc-sw", "type": "doughnut", "labels": ["Southwest land border", "All other CBP areas"], "data": [8.73, 2.10],
         "colors": ["#b91c1c", "#0c2340"], "fmt": "m"},
        {"id": "sc-nyc", "type": "bar", "labels": ["FY2023", "FY2024", "FY2025"], "data": [1.41, 3.70, 3.02], "colors": ["#1e3a8a"], "fmt": "b"},
        {"id": "sc-cbo", "type": "bar", "labels": ["Receipts", "Outlays", "Deficit"], "data": [5.6, 7.4, 1.9],
         "colors": ["#166534", "#b91c1c", "#92400e"], "fmt": "t"},
        {"id": "sc-interest", "type": "bar", "labels": ["FY2025", "FY2026"], "data": [970, 1039], "colors": ["#0c2340", "#b91c1c"], "fmt": "bn"},
        {"id": "sc-cpi", "type": "bar", "labels": ["Sep 2011 (Obama)", "Jun 2022 (Biden)", "Aug 2026 (Trump, latest)"], "data": [3.9, 9.1, 3.4],
         "colors": ["#64748b", "#b91c1c", "#0c2340"], "fmt": "pct"},
        {"id": "sc-enc-all", "type": "bar", "labels": [l for l, _ in ENC], "data": [v for _, v in ENC],
         "colors": ["#1e3a8a", "#1e3a8a", "#1e3a8a", "#1e3a8a", "#b91c1c"], "fmt": "int"},
        {"id": "sc-farm", "type": "groupbar", "labels": ["Cost to farm", "Government payments", "Net farm income"],
         "datasets": [{"label": "2025", "data": [471.6, 27.9, 162.7], "color": "#94a3b8"},
                      {"label": "2026 forecast", "data": [492.8, 47.4, 158.4], "color": "#0c2340"}], "fmt": "b"},
        {"id": "sc-checks", "type": "bar", "horizontal": True,
         "labels": ["Retired worker, avg (Jul 2026)", "SSI max, one person (2026)", "SSI avg (Dec 2025)", "SNAP, avg household (FY2026)",
                    "Medicare Part B premium (2026)", "SNAP, avg person (FY2026)"],
         "data": [2086, 994, 715, 352, 202.90, 190], "colors": ["#0c2340", "#475569", "#475569", "#92400e", "#b91c1c", "#92400e"], "fmt": "usd"},
    ]


def frames_oval():
    out = []
    for n in ["169", "170", "171", "173", "174", "180", "181", "183", "177", "192"]:
        r = VROW.get(n)
        if not r or r["Verdict"] not in OK:
            continue
        claim, truth = V.parse_claim_truth(r["Text"])
        if not truth:
            m = re.match(r"(.*?):\s*(.*)$", r["Text"], re.S)
            claim, truth = (m.group(1), m.group(2)) if m else (r["Text"], "")
        out.append(frame_simple("On the record", claim, truth, (r.get("Best_Source_URL") or "").strip()))
    return "".join(out)


def build_scorecard():
    import midterms as M
    vs = W.stamp() if hasattr(W, "stamp") else ""
    gop = f"""
{M.column("R", vs)}
<p class="period-note"><b>Now:</b> Republicans have held the House, the Senate and the White House since January 2025. FY2026 is the first full budget year under that control. CBO projections:</p>
<div class="tile-grid">
 {tile("$1.9T", "Projected deficit, FY2026", "CBO, February 2026.", accent=True, count=1.9, prefix="$", suffix="T", decimals=1, src=S("cbo"))}
 {tile("$1.039T", "Net interest, FY2026", "Up from $970 billion in FY2025.", count=1.039, prefix="$", suffix="T", decimals=3, src=S("cbo"))}
</div>
<div class="chart-grid">
 {chart_card("sc-cbo", "FY2026 budget, CBO projection", "Trillions of dollars")}
 {chart_card("sc-interest", "Net interest on the debt", "Billions of dollars")}
</div>
"""
    dem = f"""
{M.column("D", vs)}
<p class="period-note"><b>Who held power:</b> Democrats held both chambers 1993–95, 2007–11 and 2021–23. In 2007–09 the president was a Republican (Bush); Republicans took the House in January 2023. Border costs are under Compare.</p>
"""
    split = f"""
{M.column("S", vs)}
<div class="tile-grid">
 {tile("3.9%", "Inflation peak, September 2011", "Obama White House, Republican House, Democratic Senate.", accent=True, count=3.9, suffix="%", decimals=1, src=S("bls11"))}
</div>
<p class="period-note">Split means each party held one chamber. The 107th Congress (2001–03) is scored as split: the Senate changed hands in June 2001.</p>
"""
    oval = f"""
<div class="subtabs tabs" role="tablist">
 <button type="button" class="active" data-tab="desk-four">Four Ovals</button>
 <button type="button" data-tab="desk-trump1">Trump 1 (FY2017–20)</button>
 <button type="button" data-tab="desk-trump2">Trump 2 (FY2025–)</button>
</div>
<div class="tab-panel active" id="desk-four">
 <div class="chart-grid">
  {chart_card("sc-cpi", "12-month inflation readings", "Sep 2011 and Jun 2022 are those terms' peaks. Aug 2026 is the latest reading, not a peak.")}
  {chart_card("sc-enc-all", "CBP encounters, FY2021–25", "The White House changed hands during FY2025 (red)")}
 </div>
 <p class="period-note">Sources: {S("bls11")} · {S("bls22")} · {S("bls26")} · {S("cbp")}</p>
 <div class="chart-grid">{chart_card("mt-pres", "Debt added by president", "Trillions of dollars, inauguration to inauguration (Treasury)")}</div>
 <p class="period-note">{M.e(M.pres_note())} <a href="{M.TREAS_PENNY}" target="_blank" rel="noopener">Debt to the Penny ↗</a> · <a href="{M.TREAS_HIST}" target="_blank" rel="noopener">Treasury history ↗</a>. Congress, not the president, passes the budget: see who held it under Compare.</p>
</div>
<div class="tab-panel" id="desk-trump1">{under("Trump first-term scorecard figures")}</div>
<div class="tab-panel" id="desk-trump2">
 <div class="tile-grid">
  {tile("691,906", "CBP encounters, FY2025", "Nationwide.", accent=True, count=691906, src=S("cbp"))}
  {tile("237,538", "Southwest Border Patrol, FY2025", "Lowest since 1970.", count=237538, src=S("cbp"))}
  {tile("3.4%", "Inflation, August 2026", "12-month CPI, latest reading.", count=3.4, suffix="%", decimals=1, src=S("bls26"))}
 </div>
</div>
<h3 class="strip-h">His words, in full</h3>
<p class="strip-dek">Each caption next to the full transcript or official file.</p>
<div class="ledger">{frames_oval()}</div>
"""
    compare = f"""
<h3 class="strip-h">Helped and hurt, side by side</h3>
<p class="strip-dek">Tap a box to open that column. ▲ helped · ▼ hurt. Each line is a law or an official number.</p>
{M.compare_grid()}
<div class="chart-grid">
 {chart_card("mt-debt-all", "Who added the $40.09 trillion", "Debt added while each arrangement held Congress, 1857 to Sep 17, 2026 (trillions)")}
 {chart_card("mt-debt-rate", "Debt added per year of control, since 1993", "Trillions of dollars a year")}
</div>
<p class="period-note">How it is counted: the change in total federal debt over each two-year Congress, credited to whoever held both chambers (split if they differed). Treasury annual history before 1993 (straight-line between year-ends), Treasury daily Debt to the Penny after. 2008–09 (the crash) fell under Democratic control; 2020 (COVID) under split control. <a href="{M.TREAS_HIST}" target="_blank" rel="noopener">Treasury history ↗</a> · <a href="{M.TREAS_PENNY}" target="_blank" rel="noopener">Debt to the Penny ↗</a> · <a href="{M.PARTYDIV}" target="_blank" rel="noopener">Senate party divisions ↗</a> · <a href="{M.HOUSEDIV}" target="_blank" rel="noopener">House party divisions ↗</a></p>
<h3 class="strip-h" id="border-harm">Border harm</h3>
<p class="strip-dek">What the border cost at home. Each figure has its full record in one place; tap to open it.</p>
<div class="mt-ptrs">{M.border_html()}</div>
<h3 class="strip-h" id="three-jobs">Three jobs</h3>
<p class="strip-dek">Read the last line first. That is today. Then read up to see who opened it.</p>
{M.eras_html()}
<div class="chart-grid">{chart_card("mt-mfg", "Manufacturing jobs gained or lost, by president", "Thousands, January to January (BLS). *Trump II through Aug 2026, preliminary")}</div>
<p class="period-note"><a href="{M.BLS_MFG}" target="_blank" rel="noopener">BLS manufacturing employment ↗</a> · <a href="{M.CBP_HIST}" target="_blank" rel="noopener">CBP apprehensions FY1960–2019 ↗</a></p>
<h3 class="strip-h">Both parties, same failure</h3>
<ul class="mt-shared">{"".join(f'<li><a href="{h}">{M.e(t)} →</a></li>' for t, h in M.SHARED)}</ul>
<aside class="jr-view"><p><span class="op-tag">Our view</span> <span class="jr-view-who">The owner, in the owner’s words</span></p><p class="jr-view-txt">{M.e(" ".join(M.OUR_VIEW))}</p></aside>
<h3 class="strip-h">The household ledger</h3>
<div class="tile-grid">
 {tile("$158.4B", "Net farm income, 2026 forecast", "Down $4.3B, even though government payments rose $19.5B.", count=158.4, prefix="$", suffix="B", decimals=1, src=S("ers"))}
 {tile("$2,086", "Average retired-worker check", "July 2026. Paid for with FICA.", count=2086, prefix="$", src=S("ssa"))}
 {tile("$202.90", "Medicare Part B premium", "Standard monthly premium, 2026.", count=202.90, prefix="$", decimals=2, src=S("cms"))}
</div>
<div class="chart-grid">
 {chart_card("sc-farm", "The farm ledger", "USDA ERS, billions of dollars, 2025 vs. 2026 forecast", tall=True)}
 {chart_card("sc-checks", "Monthly amounts, side by side", "Dollars per month", tall=True)}
</div>
<p class="period-note">Sources: {S("ssa")} · {S("ssi")} · {S("cms")} · {S("fns")}. SSI is need-based and separate from the earned Social Security check.</p>
"""
    tabs = [("gop", "Republicans"), ("dem", "Democrats"), ("split", "Split"), ("compare", "Compare"), ("oval", "The Oval")]
    tabbar = "".join(f'<button type="button" data-tab="tab-{r}" class="{"active" if i == 0 else ""}">{e(l)}</button>' for i, (r, l) in enumerate(tabs))
    body = f"""
<section class="band-hero">
 <div class="wrap">
  <p class="hero-kicker">Midterm scorecard · Helped and hurt</p>
  <h1>Who ran Congress. What it cost.</h1>
  <p class="dek">Congress holds the purse. Here is what each party passed when it held both chambers, what a split Congress passed, and the debt added under each. Every line opens its record.</p>
  <div class="stat-rail four">
   {tile(f"${M.T['R']:.2f}T", "Added under Republican control", count=round(M.T['R'], 2), prefix="$", suffix="T", decimals=2, dark=True)}
   {tile(f"${M.T['D']:.2f}T", "Added under Democratic control", count=round(M.T['D'], 2), prefix="$", suffix="T", decimals=2, dark=True)}
   {tile(f"${M.T['S']:.2f}T", "Added under a split Congress", count=round(M.T['S'], 2), prefix="$", suffix="T", decimals=2, dark=True)}
   {tile("$40.09T", "Total debt, Sep 17, 2026", count=40.09, prefix="$", suffix="T", decimals=2, dark=True, accent=True)}
  </div>
  <p class="hero-note">Since 1857. Sum of Treasury figures by who held both chambers. <a href="#compare">How it is counted</a></p>
 </div>
</section>
<div class="wrap">
<div class="room-tabs"><div class="tabs sticky-tabs" role="tablist">{tabbar}</div>
{room("gop", "Republicans", "Both chambers: " + M.PERIODS["R"], "What they passed. What it cost.", gop, True)}
{room("dem", "Democrats", "Both chambers: " + M.PERIODS["D"], "What they passed. What it cost.", dem)}
{room("split", "Split Congress", "One chamber each: " + M.PERIODS["S"], "Neither could pass a bill alone. They still spent.", split)}
{room("compare", "Compare", "All three, side by side", "Helped, hurt, debt, the border and three jobs.", compare)}
{room("oval", "The Oval", "Four presidents, compared", "Four presidents. Trump 1 and Trump 2.", oval)}
</div>
{shop_strip("Take the scorecard off the screen.")}
</div>
"""
    return page("scorecard.html", "Midterm Scorecard: Helped and Hurt · Swamp Force",
                "What Republicans, Democrats and split Congresses passed, what it cost, and the debt added under each. Every line opens its record.",
                body, charts=[c for c in scorecard_charts() if c["id"] not in ("sc-enc-dem", "sc-sw", "sc-nyc")] + M.charts() + [M.pres_chart()], flush=True)


EXPL = V.EXPLAINER_TITLES


def parse_header():
    text = (TS / "page-header.txt").read_text(encoding="utf-8")
    # Correction-visibility sentence: always recomputed from the catalog (page-header.txt may lag behind).
    text, n_sub = re.subn(
        r"In this site's (audit|review) of \d+ cases, \d+ were never corrected by the original pusher "
        r"\((?:fact-checked only|\d+ fact-checked only; \d+ with no fact-check on file)\); "
        r"\d+ carried an appended correction line; \d+ used an editor's note; \d+ followed a legal threat or settlement; "
        r"and \d+ ran an on-air correction\.",
        lambda m: (f"In this site's {m.group(1)} of {ST['total']} cases, {corr['Never corrected by the pusher']} were never corrected "
                   f"by the original pusher ({NC_FC} fact-checked only; {NC_NOFC} with no fact-check on file); {corr['Appended correction line']} carried an appended correction line; "
                   f"{corr.get('Editor' + chr(39) + 's note', 0)} used an editor's note; {corr['After legal threat / settlement']} followed a legal threat or "
                   f"settlement; and {corr['On-air correction']} ran an on-air correction."), text)
    assert n_sub == 1, "correction-visibility sentence not found in page-header.txt"
    title_re = re.compile(r"^(" + "|".join(re.escape(t) for t in EXPL) + r")\s*$", re.M)
    parts = title_re.split(text)
    secs, i = [], 1
    while i < len(parts):
        secs.append((parts[i].strip(), parts[i + 1] if i + 1 < len(parts) else ""))
        i += 2
    return secs


def render_block(body, pointer=False):
    out = []
    for block in re.split(r"\n\s*\n", body.strip()):
        block = block.strip()
        if not block:
            continue
        if block.startswith("Our view:") and pointer:
            post = next((q for q in OPINION_POSTS if q.get("origin_match") and q["origin_match"] in block), None)
            href = f"opinion.html#{post['slug']}" if post else "opinion.html"
            label = f"“{post['title']}”" if post else "the Opinion page"
            out.append(f'<p class="op-pointer"><span class="op-tag">Opinion</span> The site owner\'s view on this section is on the Opinion page: <a href="{href}">{e(label)}</a>.</p>')
            continue
        if block.startswith("Our view:"):
            out.append(f'<div class="opinion"><p class="opinion-label">Our view · Opinion</p><p>{e(block[9:].strip())}</p></div>')
            continue
        lines = block.split("\n")
        if lines[0].startswith("- "):
            out.append("<ul>" + "".join(f"<li>{e(l[2:])}</li>" for l in lines if l.startswith("- ")) + "</ul>")
        elif len(lines) > 1 and all(l.startswith("- ") for l in lines[1:]):
            out.append(f"<p>{e(lines[0])}</p><ul>" + "".join(f"<li>{e(l[2:])}</li>" for l in lines[1:]) + "</ul>")
        else:
            out.append(f"<p>{e(block)}</p>")
    return "".join(out)


def build_betrayal():
    secs = parse_header()
    betrayal = ""
    reads = []
    for raw, body in secs:
        nice = EXPL.get(raw, raw.title())
        if nice == "The Great American Betrayal":
            betrayal = body
            continue
        sid = re.sub(r"[^a-z0-9]+", "-", nice.lower()).strip("-")
        first = re.split(r"(?<=[.!?])\s", body.strip(), maxsplit=1)[0]
        op = '<span class="op-tag">Contains opinion</span>' if "Our view:" in body else ""
        op = '<span class="op-tag">Opinion: see Opinion page</span>' if "Our view:" in body else ""
        reads.append(f'<details class="read-card" id="{sid}"><summary><span class="rc-title">{e(nice)}</span>{op}'
                     f'<span class="rc-dek">{e(first[:200])}</span><span class="rc-cta">Read</span></summary>'
                     f'<div class="rc-body">{render_block(body, pointer=True)}</div></details>')
    labels = list(corr.keys())
    charts = [{"id": "chart-corr", "type": "doughnut", "labels": labels, "data": [corr[k] for k in labels],
               "colors": ["#b91c1c", "#0c2340", "#475569", "#92400e", "#166534", "#cbd5e1"]},
              charts_evidence()[1]]
    nc = corr["Never corrected by the pusher"]
    body = f"""
<section class="hero short" style="background-image:url('images/flag-wave.jpg')">
 <div class="hero-inner">
  <p class="hero-kicker">The narrative spine</p>
  <h1>The Great American Betrayal</h1>
  <p class="dek">How a narrative gets built, why the correction never catches it, and what that does to a self-governing people.</p>
  <div class="stat-rail four">
   {tile(str(ST['total']), "Documented cases", count=ST['total'], dark=True, accent=True)}
   {tile(str(nc), "Never corrected by the pusher", count=nc, dark=True)}
   {tile(str(CONGRESS_N), "Pushed by members of Congress", count=CONGRESS_N, dark=True)}
   {tile(str(ST['official']), "Settled by the official record", count=ST['official'], dark=True)}
  </div>
 </div>
</section>
<div class="wrap">
<p class="legend"><span class="fact-tag">Fact</span> The case counts, the research and the law cited below are documented.
<span class="op-tag">Opinion</span> The site owner's argument is on the <a href="opinion.html">Opinion page</a>, kept apart from the evidence here.</p>
<div class="chart-grid">
 {chart_card("chart-corr", "When a claim proved wrong, how was it corrected?", f"All {ST['total']} cases")}
 {chart_card("chart-proof", "What settled it", "Tap a bar to see those cases")}
</div>
<aside class="op-pointer big"><span class="op-tag">Opinion</span> <b>The argument.</b> The site owner's argument, “The Great American Betrayal,” is on the <a href="opinion.html#the-great-american-betrayal">Opinion page</a>. This page keeps the evidence it rests on.</aside>
<section class="section-pad">
 <p class="section-label">Reader path</p>
 <h2 class="section-title">How a narrative is built</h2>
 <p class="section-dek">Tap a section to read it in full. Citations are inline.</p>
 <div class="read-list">{"".join(reads)}</div>
</section>
<section class="reader-path"><p>Judge for yourself: <a class="btn navy sm" href="fake-news.html">Open the {ST['total']} cases</a> <a class="btn ghost-dark sm" href="brief.html">Staff brief</a></p></section>
</div>
"""
    return page("betrayal.html", "The Great American Betrayal · Swamp Force",
                "How a narrative is built and why the correction never catches it. Research cited inline; opinion is labeled.",
                body, charts=charts, flush=True)


_STOP = set("that this with from were have been will they their them than then what when which would could should about after before into over under only just also said says trump biden".split())


def _same_claim(a, b):
    """True when two claim texts share enough content words to be the same incident."""
    wa = {w for w in re.findall(r"[a-z0-9]{4,}", a.lower()) if w not in _STOP}
    wb = {w for w in re.findall(r"[a-z0-9]{4,}", b.lower()) if w not in _STOP}
    return bool(wa and wb) and len(wa & wb) >= 2


def party_page(fname, title, page_name, dek):
    items = [r for r in verified if r["Page"] == page_name and r["Verdict"] in OK]
    full, short = [], []
    for r in items:
        claim, truth = V.parse_claim_truth(r.get("Text") or "")
        tag = (r.get("Attributed_To") or "").strip() or "On the record"
        cid = V.cat_id_from_dup(r.get("Duplicate_Of_Item_ID") or "")
        if cid and cid in CID and not _same_claim(claim, _CASE[cid].get("claim", "")):
            cid = None  # the checkpoint's duplicate ID points to an unrelated case; show the row in full instead
        if cid and cid in CID:
            short.append(f'<a class="short-link" href="fake-news.html#case-{e(cid)}"><strong>{e(tag)}</strong>'
                         f'<span>{e(claim[:170])}{"…" if len(claim) > 170 else ""}</span><em>Open case #{e(cid)} →</em></a>')
        else:
            full.append(frame_simple(tag, claim, truth or "See the linked record.", (r.get("Best_Source_URL") or "").strip(),
                                     claim_h="The claim", truth_h="The record", row=r))
    body = f"""
<section class="band-hero slim"><div class="wrap"><p class="hero-kicker">Evidence · Party ledger</p><h1>{e(title)}</h1>
<p class="dek">{e(dek)}</p>
<div class="stat-rail three">{tile(str(len(items)), "Rows on the record", count=len(items), dark=True, accent=True)}
{tile(str(len(full)), "Claim | record frames", count=len(full), dark=True)}{tile(str(len(short)), "Also in Fake News Exposed", count=len(short), dark=True)}</div></div></section>
<div class="wrap">
{('<h2 class="section-title top">Claim | record</h2><div class="ledger">' + "".join(full) + '</div>') if full else ''}
{('<h2 class="section-title top">Also documented in Fake News Exposed</h2><div class="short-grid">' + "".join(short) + '</div>') if short else ''}
{shop_strip()}
</div>"""
    return page(fname, f"{title} ledger · Swamp Force", dek, body, flush=True), len(items)


def build_j6():
    keys = ("january 6", "jan. 6", "jan 6", "2383", "insurrection", "ellipse", "fight like hell", "peacefully and patriotically")
    seen, frames = set(), []
    for r in verified:
        if r["Verdict"] not in OK or not r["Page"].startswith(("Fake News", "Scorecard · Frames", "Scorecard · Fake News")):
            continue
        blob = " ".join([r.get("Text") or "", r.get("Attributed_To") or ""]).lower()
        if not any(k in blob for k in keys):
            continue
        claim, truth = V.parse_claim_truth(r.get("Text") or "")
        url = (r.get("Best_Source_URL") or "").strip()
        if not truth or claim[:60].lower() in seen or "cookielaw" in url:
            continue
        seen.add(claim[:60].lower())
        frames.append(frame_simple((r.get("Attributed_To") or "January 6")[:90], claim, truth, url, row=r))
    cat = [c for c in cases if any(k in (c["claim"] + " " + c["notes"]).lower() for k in keys)]
    body = f"""
<section class="band-hero slim"><div class="wrap"><p class="hero-kicker">Evidence · J6</p>
<h1>The caption was not the charge.</h1>
<p class="dek">What the country was told, set against the charging record.</p>
<div class="stat-rail three">
 {tile("~1,583", "People federally charged over January 6", dark=True, accent=True)}
 {tile("0", "Charged under 18 U.S.C. § 2383 (insurrection)", dark=True)}
 {tile(str(len(cat)), "Related cases in Fake News Exposed", count=len(cat), dark=True)}
</div></div></section>
<div class="wrap">
<div class="j6-note"><strong>Read this carefully.</strong> The U.S. Attorney's Office for D.C. reported about 1,583 people federally charged over January 6.
None was charged under 18 U.S.C. § 2383, the insurrection statute. That does not mean nothing was charged: prosecutors used other statutes, including assault, obstruction and trespass.
The Ellipse speech contains both "fight like hell" and "peacefully and patriotically."</div>
<div class="ledger">{"".join(frames)}</div>
<h2 class="section-title top">Related cases</h2>
<div class="ledger">{"".join(case_card(c) for c in cat)}</div>
{shop_strip()}
</div>"""
    return page("january-6.html", "J6: The caption was not the charge · Swamp Force",
                "January 6: what the country was told versus the charging record, including 18 U.S.C. § 2383.", body, flush=True)


PDF_NAMES = {"cannon-dismissal": "U.S. v. Trump (S.D. Fla.), dismissal order", "chutkan-dismissal": "U.S. v. Trump (D.D.C.), dismissal order",
             "fischer-v-united-states": "Fischer v. United States (U.S. 2024)", "ga-coa-willis": "Georgia Court of Appeals, Willis disqualification",
             "ga-nolle-pros": "Georgia, nolle prosequi", "maine-bellows-modified": "Maine Secretary of State ballot decision (modified)",
             "ny-1st-dept-civil-fraud": "N.Y. Appellate Division, civil fraud decision", "trump-v-anderson": "Trump v. Anderson (U.S. 2024)",
             "trump-v-united-states-immunity": "Trump v. United States (U.S. 2024), immunity"}


def build_lawfare():
    with (LAW / "lawfare-docket-tracker.csv").open(encoding="utf-8-sig") as fh:
        dockets = list(csv.DictReader(fh))
    with (LAW / "lawfare-rulings.csv").open(encoding="utf-8-sig") as fh:
        rulings = list(csv.DictReader(fh))
    by = defaultdict(list)
    for r in rulings:
        by[r.get("Case") or ""].append(r)
    cards, index = [], []
    for i, c in enumerate(dockets, 1):
        name = c.get("Case_Name") or ""
        aid = f"docket-{i}"
        index.append(f'<li><a href="#{aid}">{e(name)}</a></li>')
        lis = "".join(
            f'<li><span class="r-date">{e(r.get("Date") or "")}</span> <span class="r-court">{e(r.get("Court") or "")}</span>'
            f'<div>{e(r.get("Ruling summary") or "")}</div>'
            + (f'<div>{linkify(r.get("Opinion URL") or "")}</div>' if r.get("Opinion URL") else "") + "</li>"
            for r in by.get(name, []))
        cards.append(f"""<article class="law-card" id="{aid}"><p class="law-no">Docket {i} of {len(dockets)}</p><h2>{e(name)}</h2>
<div class="status-box"><strong>Status:</strong> {e(c.get("Current_Status") or "—")}</div>
<dl class="law-meta"><dt>Court</dt><dd>{e(c.get("Court") or "—")}</dd><dt>Docket</dt><dd>{e(c.get("Docket_Number") or "—")}</dd>
<dt>Official docket</dt><dd>{linkify(c.get("Official_Docket_URL") or "—")}</dd><dt>Brought by</dt><dd>{e(c.get("Brought_By") or "—")}</dd>
<dt>Filed</dt><dd>{e(c.get("Filed_Date") or "—")}</dd><dt>Charges / claims</dt><dd>{e(c.get("Charges_or_Claims") or "—")}</dd></dl>
<p><strong>Outcome.</strong> {e(c.get("Outcome_Summary") or "—")}</p>
<details class="law-more"><summary>Key rulings, documented issues &amp; sources</summary>
<ol class="timeline">{lis or "<li>See the tracker PDF.</li>"}</ol>
<p><strong>Documented issues.</strong> {e(clean_note(c.get("Documented_Issues") or "—"))}</p>
<p class="law-src"><strong>Sources.</strong> {linkify(c.get("Sources") or "—")}</p></details></article>""")
    pdfs = sorted((OUT / "lawfare-docs").glob("*.pdf"))
    pdf_list = "".join(f'<li><a href="lawfare-docs/{p.name}">{e(PDF_NAMES.get(p.stem, p.stem))}</a> <span class="muted">PDF · {p.stat().st_size // 1024} KB</span></li>' for p in pdfs)
    body = f"""
<header class="doc-head"><p class="doc-kicker">Evidence · Court record</p><h1>Lawfare docket tracker</h1>
<p class="doc-lede">{len(dockets)} cases brought against Donald J. Trump: the court, docket number, current status, key rulings and the primary documents. Facts come from court filings and official dockets. The site owner's opinion is at the end, labeled.</p>
<div class="doc-actions"><a class="btn navy sm" href="downloads/lawfare-tracker.pdf">{ico("down")} Tracker (PDF)</a>
<a class="btn ghost-dark sm" href="downloads/lawfare-docket-tracker.csv">CSV</a><a class="btn ghost-dark sm" href="downloads/lawfare-docket-tracker.xlsx">Excel</a>
<a class="btn ghost-dark sm" href="downloads/lawfare-rulings.csv">Rulings CSV</a><button type="button" class="btn ghost-dark sm" data-print>{ico("print")} Print</button></div></header>
<div class="doc-grid"><nav class="doc-toc" aria-label="Dockets"><p class="foot-h">Dockets</p><ol>{"".join(index)}</ol>
<p class="foot-h">Court opinions (PDF)</p><ul>{pdf_list}</ul></nav>
<div class="doc-body">{"".join(cards)}
<section class="opinion"><p class="opinion-label">Our view · Opinion</p>
<p>The owner of swampforce.com believes these cases were lawfare: civil, criminal and ballot processes used to hobble Donald Trump's campaign. That is an opinion about motive. It appears here, labeled, so no one mistakes it for the court record above.</p></section>
</div></div>"""
    return page("lawfare.html", "Lawfare docket tracker · Swamp Force",
                "Ten cases against Donald J. Trump: courts, dockets, status, key rulings and primary court documents.", body, serious=True), len(dockets)


def rank_table():
    desc = {"Official record": "A court or DOJ finding, inspector general, FEC, government data, or a settlement.",
            "Original transcript/video": "The full transcript or unedited video shows the claim was wrong.",
            "Outlet's own correction": "The outlet that ran the claim corrected or retracted it, or appended a note.",
            "Fact-check only": "An independent fact-checker rated it false or misleading. No stronger proof is on file."}
    rows = []
    for i, p in enumerate(PROOF_ORDER, 1):
        n = sum(1 for c in cases if c["proof"] == p)
        pct = round(100 * n / ST["total"])
        rows.append(f'<tr><td class="rank">{i}</td><td>{proof_badge(p)}</td><td>{e(desc[p])}</td><td class="num">{n}</td>'
                    f'<td class="barcell"><div class="bar-track"><div class="bar-fill" data-pct="{pct}"></div></div><span class="pct">{pct}%</span></td></tr>')
    return ('<div class="table-wrap"><table class="rank-table"><thead><tr><th>Rank</th><th>Proof</th><th>What it means</th><th>Cases</th><th>Share</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table></div>')


def build_brief():
    nc = corr["Never corrected by the pusher"]
    body = f"""
<header class="doc-head"><p class="doc-kicker">For lawmakers &amp; staff</p><h1>Documented Deception of American Voters</h1>
<p class="doc-lede">A two-page staff brief and a case-by-case evidence appendix built from {ST['total']} documented cases: {ST['first']} from the first term and {ST['later']} from 2021 to the present.
{ST['proven']} are proven false and {ST['misleading']} are rated misleading. {ST['official']} are settled by the official record.</p>
<div class="doc-actions"><a class="btn navy" href="docs/swampforce-brief.pdf">{ico("down")} Staff brief (PDF, 2 pages)</a>
<a class="btn ghost-dark" href="docs/staff-brief.html">Brief (HTML)</a><a class="btn ghost-dark" href="appendix.html">{ico("file")} Evidence appendix</a>
<button type="button" class="btn ghost-dark" data-print>{ico("print")} Print this page</button></div></header>
<div class="brief-grid">
 <a class="doc-thumb" href="docs/swampforce-brief.pdf"><img src="images/brief-p1.jpg" alt="Staff brief, page 1" loading="lazy"><span>Brief · page 1</span></a>
 <a class="doc-thumb" href="docs/swampforce-brief.pdf"><img src="images/brief-p2.jpg" alt="Staff brief, page 2" loading="lazy"><span>Brief · page 2</span></a>
 <a class="doc-thumb" href="docs/swampforce-evidence-appendix.pdf"><img src="images/appendix-p1.jpg" alt="Evidence appendix, first page" loading="lazy"><span>Evidence appendix</span></a>
</div>
<section class="doc-section"><h2>Key findings</h2>
<ul class="findings">
<li><b>{ST['total']}</b> claims about President Trump or his administration were later corrected, retracted or settled, or shown false or misleading by the record.</li>
<li><b>{nc}</b> were never corrected by whoever pushed them. A later fact-check addressed {NC_FC} of them; the other {NC_NOFC} have no fact-check on file, only the official record.</li>
<li><b>{CONGRESS_N}</b> were pushed by a sitting Representative, Senator, Speaker or party leader.</li>
<li><b>{ST['official']}</b> are settled by the official record: a court, the DOJ, an inspector general, the FEC or government data.</li>
</ul></section>
<section class="doc-section"><h2>How the evidence is ranked</h2>
<p>Each case carries one proof rank, set by the strongest documentation on file. Rank 1 is the strongest.</p>
{rank_table()}
<p class="muted small">Full rules: <a href="about.html">Methodology</a>.</p></section>
<section class="doc-section"><h2>Citing this record</h2>
<p>Every case has a permanent address: <code>swampforce.com/fake-news.html#case-ID</code>. The appendix lists the primary source and the correcting record for each case, and the spreadsheets on <a href="downloads.html">Downloads</a> include every URL.</p>
<p>Suggested citation: <em>Swamp Force, "Documented Deception of American Voters," staff brief and evidence appendix, September 2026, swampforce.com/brief.html.</em></p></section>
<section class="doc-section"><h2>The law in brief</h2>
<p>The First Amendment protects much false speech: <a href="{LAWSRC['alvarez']}" target="_blank" rel="noopener"><em>United States v. Alvarez</em></a> (2012) struck down the Stolen Valor Act, and the plurality wrote that "falsity alone may not suffice to bring the speech outside the First Amendment." A public official suing over a falsehood about official conduct must prove "actual malice," meaning knowledge of falsity or reckless disregard of the truth (<a href="{LAWSRC['sullivan']}" target="_blank" rel="noopener"><em>New York Times Co. v. Sullivan</em></a>, 1964).
The Speech or Debate Clause (<a href="{LAWSRC['art1']}" target="_blank" rel="noopener">art. I, § 6</a>) protects legislative acts. It did not cover a senator's private publication of the Pentagon Papers (<a href="{LAWSRC['gravel']}" target="_blank" rel="noopener"><em>Gravel v. United States</em></a>, 1972) or a senator's newsletters and press release (<a href="{LAWSRC['hutchinson']}" target="_blank" rel="noopener"><em>Hutchinson v. Proxmire</em></a>, 1979). Each House may discipline its own members (<a href="{LAWSRC['art1']}" target="_blank" rel="noopener">art. I, § 5</a>).</p>
<div class="opinion"><p class="opinion-label">Our view · Opinion</p><p>Congress writes its own rules, and it should police its own members' false public statements. The full argument is in <a href="opinion.html#the-great-american-betrayal">The Great American Betrayal</a>.</p></div></section>
<section class="doc-section"><h2>Contact</h2><p>Editor: <a href="mailto:editor@swampforce.com">editor@swampforce.com</a>. Staff requests for spreadsheets or specific case files are welcome.</p></section>
"""
    return page("brief.html", "Staff brief for lawmakers · Swamp Force",
                f"Two-page staff brief and evidence appendix: {ST['total']} documented cases, each ranked by the strength of its proof.", body, serious=True)


def build_appendix():
    groups = "".join(f'<li>{proof_badge(p)} <b>{sum(1 for c in cases if c["proof"] == p)}</b> cases</li>' for p in PROOF_ORDER)
    srt = sorted(cases, key=lambda c: (PROOF_ORDER.index(c["proof"]) if c["proof"] in PROOF_ORDER else 9, int(c["id"])))
    rows = "".join(
        f'<tr><td><a href="fake-news.html#case-{e(c["id"])}">#{e(c["id"])}</a></td><td>{e(c["claim"][:240])}{"…" if len(c["claim"]) > 240 else ""}</td>'
        f'<td>{ev_badge(c["evidence"])}</td><td>{proof_badge(c["proof"])}</td>'
        f'<td class="srcs">{src_link(c.get("truth_url"), "Record")} {src_link(c.get("primary"), "Primary")}</td></tr>' for c in srt)
    body = f"""
<header class="doc-head"><p class="doc-kicker">For lawmakers &amp; staff</p><h1>Evidence appendix</h1>
<p class="doc-lede">All {ST['total']} cases, sorted by strength of proof (official record first). Each lists the correcting record and, where available, the primary source.</p>
<div class="doc-actions"><a class="btn navy" href="docs/swampforce-evidence-appendix.pdf">{ico("down")} Appendix (PDF)</a>
<a class="btn ghost-dark" href="docs/evidence-appendix.html">Printable HTML</a><a class="btn ghost-dark" href="downloads.html">Spreadsheets</a>
<button type="button" class="btn ghost-dark" data-print>{ico("print")} Print</button></div>
<ul class="inline-list">{groups}</ul></header>
<div class="table-wrap"><table class="appendix-table"><thead><tr><th>Case</th><th>Claim</th><th>Verdict</th><th>Proof</th><th>Sources</th></tr></thead><tbody>{rows}</tbody></table></div>
"""
    return page("appendix.html", "Evidence appendix · Swamp Force",
                f"All {ST['total']} documented cases ranked by strength of proof, with the correcting record and primary source.", body, serious=True)


def _balance():
    import balance as BAL
    n = lambda pg: sum(1 for r in verified if r["Page"] == pg and r["Verdict"] in OK)
    res = BAL.compute(cases, [("Democrat", n("Democrats Ledger")), ("Republican", n("Republicans Ledger"))])
    (SITE / "balance-report.md").write_text(BAL.report_md(res, "Sep 24, 2026"), encoding="utf-8")
    by, outlets, labels = BAL.tables(res)
    BALANCE_STATS.update({g: dict(c) for g, c in by.items()})
    return BAL.about_block(res, e)


BALANCE_STATS = {}


def build_about():
    balance_html = _balance()
    body = f"""
<header class="doc-head"><p class="doc-kicker">For lawmakers &amp; staff</p><h1>Methodology</h1>
<p class="doc-lede">What gets in, how proof is ranked, and how fact and opinion are kept apart.</p>
<div class="doc-actions"><button type="button" class="btn ghost-dark sm" data-print>{ico("print")} Print</button></div></header>
<section class="doc-section"><h2>1. What gets in (Fake News Exposed)</h2><ul>
<li>A claim about President Trump or his administration that is unfavorable to him or them.</li>
<li><b>Proven false:</b> the claim was corrected, retracted or settled; a court, the DOJ, an inspector general or the FEC found it false; or a major fact-checker rated it False, Mostly False, Pants on Fire or Four Pinocchios.</li>
<li><b>Rated misleading:</b> rated misleading, missing context or Three Pinocchios (or equivalent).</li>
<li>Unproven claims are left out.{f' Claims that were reviewed and could not be supported are listed separately on <a href="unsupported.html">Unsupported claims</a>.' if UNSUP else ''}</li></ul></section>
<section class="doc-section"><h2>2. How proof is ranked</h2>{rank_table()}</section>
<section class="doc-section"><h2>3. Correction visibility</h2><p>Each case records how, or whether, the original pusher corrected it:</p><ul>
{"".join(f"<li><b>{v}</b> · {e(k)}</li>" for k, v in corr.most_common())}</ul></section>
<section class="doc-section"><h2>4. Party ledgers and J6</h2><p>A party-ledger row appears only after both its claim and its record are confirmed. A row that duplicates a Fake News case links to that case instead of repeating it.</p></section>
<section class="doc-section"><h2>5. Scorecard</h2><p>Every figure comes from an official source (BLS, CBP, Treasury, CBO, USDA, SSA, CMS, a city comptroller) and is tagged with who held power at the time. Until a figure is confirmed against its source, it is marked <span class="chip gold">Under review</span> and shows no number.</p></section>
<section class="doc-section"><h2>6. Fact and opinion</h2><p>Opinion appears only on the <a href="opinion.html">Opinion page</a> and in blocks labeled <span class="op-tag">Opinion</span> or "Our view." Everything else is sourced on the page.</p></section>
<section class="doc-section"><h2>7. Corrections</h2><p>Found an error? Email <a href="mailto:editor@swampforce.com">editor@swampforce.com</a> with the case number and the source. Confirmed errors are fixed and noted.</p></section>
{balance_html}
<section class="doc-section"><h2>About</h2><p>Swamp Force™ is a government-source journal edited by Renee Stewart. © 2026.</p></section>
"""
    return page("about.html", "Methodology · Swamp Force", "Inclusion rules, proof ranking and correction visibility for the Swamp Force record.", body, serious=True)


def build_downloads():
    def item(t, d, links):
        return f'<div class="dl-item"><h3>{e(t)}</h3><p>{e(d)}</p><div class="dl-btns">' + "".join(f'<a class="btn {c} sm" href="{h}">{e(l)}</a>' for h, l, c in links) + "</div></div>"
    body = f"""
<header class="doc-head"><p class="doc-kicker">For lawmakers &amp; staff</p><h1>Downloads</h1>
<p class="doc-lede">The full record in formats staff can sort, filter and cite.</p></header>
<div class="dl-grid">
{item("Staff brief", "Two pages, September 2026.", [("docs/swampforce-brief.pdf", "PDF", "navy"), ("docs/staff-brief.html", "HTML", "ghost-dark")])}
{item("Evidence appendix", f"All {ST['total']} cases with sources.", [("docs/swampforce-evidence-appendix.pdf", "PDF", "navy"), ("docs/evidence-appendix.html", "HTML", "ghost-dark")])}
{item(f"First term ({ST['first']} cases)", "2017–2021 catalog.", [("downloads/first-term-trump-admin-media-deception.csv", "CSV", "navy"), ("downloads/first-term-trump-admin-media-deception.xlsx", "Excel", "ghost-dark"), ("downloads/first-term-media-deception.zip", "ZIP", "ghost-dark")])}
{item(f"2021 to present ({ST['later']} cases)", "Later / second-term catalog.", [("downloads/later-second-term-trump-admin-media-deception.csv", "CSV", "navy"), ("downloads/later-second-term-trump-admin-media-deception.xlsx", "Excel", "ghost-dark"), ("downloads/later-second-term-media-deception.zip", "ZIP", "ghost-dark")])}
{item("Lawfare tracker", "Ten dockets and key rulings.", [("downloads/lawfare-tracker.pdf", "PDF", "navy"), ("downloads/lawfare-docket-tracker.csv", "CSV", "ghost-dark"), ("downloads/lawfare-docket-tracker.xlsx", "Excel", "ghost-dark"), ("downloads/lawfare-rulings.csv", "Rulings", "ghost-dark")])}
{item(f"Unsupported claims ({len(UNSUP)})", "Reviewed and could not be supported; kept apart from the cases.", [("unsupported.html", "Page", "navy"), ("downloads/unsupported-claims.csv", "CSV", "ghost-dark")]) if UNSUP else ""}
</div>"""
    return page("downloads.html", "Downloads · Swamp Force", "CSV, Excel and PDF downloads of the Swamp Force record.", body, serious=True)


def build_store():
    body = f"""
<section class="store-hero">
 <div class="wrap sh-inner">
  <div><p class="hero-kicker">The Swamp Force store</p><h1>Wear the file.</h1>
  <p class="dek">Official Swamp Force merch. <b>Every purchase funds this project:</b> the research, the hosting, and the brief that goes to Congress.</p>
  <p class="store-trust">Secure checkout by Printify · Printed and shipped on demand</p></div>
  <picture class="sh-stamp"><source srcset="assets/brand/stamp.webp" type="image/webp"><img src="assets/brand/stamp.png" alt="Swamp Force stamp: WE THE PEOPLE" width="480" height="480"></picture>
 </div>
</section>
<div class="wrap">
<section id="store-live" class="store-live" hidden>
 <p class="center"><a class="btn big" id="store-open-btn" href="store.html" target="_blank" rel="noopener">{ico("cart")} Open the full store</a></p>
 <div class="store-frame-wrap"><iframe id="store-frame" title="Swamp Force store" loading="lazy"></iframe></div>
 <p class="muted small center">Checkout is handled securely by Printify. If the store does not load above, use the button to open it in a new tab.</p>
</section>
<section id="store-placeholder" class="store-soon">
 <h2>The shop opens soon.</h2>
 <p>Want to know the day it opens? Email us and you'll hear first.</p>
 <p><a class="btn big" id="notify-btn" href="mailto:editor@swampforce.com?subject=Notify%20me%20when%20the%20Swamp%20Force%20store%20opens">Notify me when it opens</a></p>
 <p class="muted small">Products and prices will appear here when the store opens.</p>
</section>
<section class="why-buy">
 <div><h3>Funds the record</h3><p>Merch sales pay for the research, the hosting and the staff brief.</p></div>
 <div><h3>Reader-supported</h3><p>Readers keep this project running. The store is how they do it.</p></div>
 <div><h3>Starts a conversation</h3><p>Wear it, and people ask. Point them to the record, and the record points to its sources.</p></div>
</section>
</div>"""
    return page("store.html", "Store · Swamp Force", "Official Swamp Force merch. Every purchase funds the project.", body,
                extra_js="assets/store.js", flush=True)


def hub_head(kicker, title, dek, img):
    return (f'<section class="hero short" style="background-image:url(\'{img}\')"><div class="hero-inner"><p class="hero-kicker">{e(kicker)}</p>'
            f'<h1>{e(title)}</h1><p class="dek">{e(dek)}</p></div></section>')


def build_foreword():
    body = hub_head("Journal · The Republic", "They forgot who they work for.", "The people are the employer. The 535 are the hire.", "images/capitol.jpg") + f"""
<div class="wrap narrow">
<div class="opinion big"><p class="opinion-label">Foreword · Opinion</p>
<p>The Constitution does not open with Congress. It opens with three words: We the People. The people are the employer, and the 535 are the hire.</p>
<p>This journal prints the record. No network, no manufactured drama. Government sources only. Compare the action to the speech. That is the first step.</p>
<p><strong>Vote the file. Not the feeling.</strong></p></div>
<div class="fact-box"><p class="fact-tag">On the record</p>
<p>The Preamble: "We the People of the United States … do ordain and establish this Constitution for the United States of America." {src_link("https://constitution.congress.gov/constitution/preamble/", "Constitution Annotated")}</p>
<p>The oath of office, 5 U.S.C. § 3331, requires every member to support and defend the Constitution "without any mental reservation or purpose of evasion." {src_link("https://www.law.cornell.edu/uscode/text/5/3331", "5 U.S.C. § 3331")}</p></div>
<div class="cards">{explore_card("fake-news.html", "images/chamber.jpg", "Start with the evidence", f"{ST['total']} cases, each against the record.", ["Evidence"])}
{explore_card("betrayal.html", "images/flag-wave.jpg", "The Great American Betrayal", "The argument, with the research inline.", ["Opinion labeled"])}</div>
{shop_strip()}</div>"""
    return page("foreword.html", "The Republic: Foreword · Swamp Force", "The people are the employer. The foreword to the Swamp Force journal.", body, flush=True)


def build_congress():
    body = hub_head("Journal · Congress", "The hire holds the purse.", "Article I gives Congress the power of the purse. These are the books it keeps.", "images/chamber.jpg") + f"""
<div class="wrap">
<div class="tile-grid">
 {tile("$40.09T", "National debt", "Sep 17, 2026.", accent=True, count=40.09, prefix="$", suffix="T", decimals=2, src=S("treas"))}
 {tile("$1.9T", "Projected deficit, FY2026", "CBO, Feb 2026.", count=1.9, prefix="$", suffix="T", decimals=1, src=S("cbo"))}
 {tile("$1.039T", "Net interest, FY2026", "Up from $970B in FY2025.", count=1.039, prefix="$", suffix="T", decimals=3, src=S("cbo"))}
 {tile(str(CONGRESS_N), "False claims pushed by sitting members", f"Of the {ST['total']} documented cases.", count=CONGRESS_N, src='<a class="src" href="fake-news.html">Fake News Exposed</a>')}
</div>
<div class="chart-grid">{chart_card("sc-cbo", "FY2026 budget, CBO projection", "Trillions of dollars")}{chart_card("sc-interest", "Net interest on the debt", "Billions of dollars")}</div>
<div class="fact-box"><p class="fact-tag">On the record</p><p>The Speech or Debate Clause (<a href="{LAWSRC['art1']}" target="_blank" rel="noopener">art. I, § 6</a>) protects legislative acts. It did not cover a senator's private publication of the Pentagon Papers (<a href="{LAWSRC['gravel']}" target="_blank" rel="noopener"><em>Gravel v. United States</em></a>, 1972) or a senator's newsletters and press release (<a href="{LAWSRC['hutchinson']}" target="_blank" rel="noopener"><em>Hutchinson v. Proxmire</em></a>, 1979). Each House may punish its members and, with a two-thirds vote, expel one (<a href="{LAWSRC['art1']}" target="_blank" rel="noopener">art. I, § 5</a>); the House has <a href="{LAWSRC['discipline']}" target="_blank" rel="noopener">expelled {HOUSE_DISCIPLINE['expelled']} members and censured {HOUSE_DISCIPLINE['censured']}</a> in its history.
On June 21, 2023, the House <a href="{LAWSRC['hres521']}" target="_blank" rel="noopener">censured Rep. Adam Schiff</a> (H. Res. 521), <a href="{LAWSRC['roll283']}" target="_blank" rel="noopener">213–209, with 6 voting present</a>.</p></div>
<p class="center"><a class="btn navy" href="scorecard.html">Open the full scorecard</a></p>
{shop_strip()}</div>"""
    charts = [c for c in scorecard_charts() if c["id"] in ("sc-cbo", "sc-interest")]
    return page("congress.html", "Congress · Swamp Force", "The purse, the debt, and the members: official figures.", body, charts=charts, flush=True)


def build_border():
    body = hub_head("Journal · The Border", "The door, by the numbers.", "CBP records an encounter when it meets a person who is not making a lawful entry.", "images/card-eagle.jpg") + f"""
<div class="wrap">
<div class="tile-grid">
 {tile("10.83M", "Nationwide encounters, FY2021–24", "", accent=True, count=10.83, suffix="M", decimals=2, src=S("cbp"))}
 {tile("8.73M", "Southwest land border, FY2021–24", "", count=8.73, suffix="M", decimals=2, src=S("cbp"))}
 {tile("691,906", "Nationwide encounters, FY2025", "", count=691906, src=S("cbp"))}
 {tile("237,538", "Southwest Border Patrol, FY2025", "Lowest since 1970.", count=237538, src=S("cbp"))}
</div>
<div class="chart-grid">{chart_card("sc-enc-all", "CBP encounters by fiscal year", "The White House changed hands during FY2025 (red)", tall=True)}
{chart_card("sc-nyc", "New York City asylum-seeker spending", "Billions, city fiscal years 2023–25")}</div>
<p class="period-note">CBP annual totals, FY2021–24: 1,956,519 · 2,766,582 · 3,201,144 · 2,901,142. NYC figures: {S("nyc")}.</p>
{shop_strip()}</div>"""
    charts = [c for c in scorecard_charts() if c["id"] in ("sc-enc-all", "sc-nyc")]
    return page("border.html", "The Border · Swamp Force", "CBP encounters by fiscal year and downstream city costs, from official tables.", body, charts=charts, flush=True)


def build_remedy(law_n):
    body = hub_head("Journal · The Remedy", "The remedy is in the charter.", "Courts, statutes, and what accountability should become.", "images/capitol.jpg") + f"""
<div class="wrap">
<div class="cards">
 {explore_card("lawfare.html", "images/capitol.jpg", "The court record", f"{law_n} dockets, their key rulings, and the opinions as PDFs.", ["Court record"])}
 {explore_card("january-6.html", "images/chamber.jpg", "The statute not charged", "18 U.S.C. § 2383 against the charging record.", ["J6"])}
 {explore_card("brief.html", "images/card-eagle.jpg", "Staff brief", "For members and staff: findings, proof ranking, citations.", ["For lawmakers"])}
</div>
<div class="fact-box"><p class="fact-tag">On the record</p><p>Under Article V, two-thirds of both Houses, or a convention called on the application of two-thirds of the states, may propose amendments; three-fourths of the states ratify. {src_link("https://constitution.congress.gov/constitution/article-5/", "Article V")}
Under Article I, § 5, each House may discipline and expel its members. {src_link("https://constitution.congress.gov/constitution/article-1/", "Article I")}</p></div>
<div class="opinion"><p class="opinion-label">Our view · Opinion</p><p>Deliberately deceiving voters at scale should be treated as a crime against self-government. Until the law catches up, the remedy is the vote, cast on the record. <a href="opinion.html#the-great-american-betrayal">Read the argument →</a></p></div>
{shop_strip()}</div>"""
    return page("remedy.html", "The Remedy · Swamp Force", "Courts, statutes and accountability.", body, flush=True)


# ───── primary sources for the law and history lines (verified Sep 24, 2026) ─────
LAWSRC = {
    "art1": "https://constitution.congress.gov/constitution/article-1/",
    "alvarez": "https://tile.loc.gov/storage-services/service/ll/usrep/usrep567/usrep567709/usrep567709.pdf",
    "sullivan": "https://tile.loc.gov/storage-services/service/ll/usrep/usrep376/usrep376254/usrep376254.pdf",
    "gravel": "https://tile.loc.gov/storage-services/service/ll/usrep/usrep408/usrep408606/usrep408606.pdf",
    "hutchinson": "https://tile.loc.gov/storage-services/service/ll/usrep/usrep443/usrep443111/usrep443111.pdf",
    "hres521": "https://www.govinfo.gov/content/pkg/BILLS-118hres521eh/html/BILLS-118hres521eh.htm",
    "roll283": "https://clerk.house.gov/Votes/2023283",
    "discipline": "https://history.house.gov/Institution/Discipline/Expulsion-Censure-Reprimand/",
    "origins": "https://archive.org/details/originsoftotalit0000aren_q7i2",
    "ideology": "https://doi.org/10.1017/S0034670500001510",
    "truthpol": "https://www.newyorker.com/magazine/1967/02/25/truth-and-politics",
    "lying": "https://www.nybooks.com/articles/1971/11/18/lying-in-politics-reflections-on-the-pentagon-pape/",
    "errera": "https://www.nybooks.com/articles/1978/10/26/hannah-arendt-from-an-interview/",
}
# Counts from the House Historian's list (LAWSRC["discipline"]), checked Sep 24, 2026. Update if the House acts again.
HOUSE_DISCIPLINE = {"expelled": 6, "censured": 29}


# ───── opinion ─────
# The owner's opinion posts. To add one: append a dict (newest first is automatic, by date).
#   slug: anchor id · title · date: YYYY-MM-DD · body: paragraphs, links as [text](url)
#   sources: (label, url) for every factual statement in the body (official record, court filing,
#            government data, transcript/video, or the site's own case catalog). No unsourced facts.
#   origin: where the text first ran · origin_match: text that identifies its old "Our view" block
# Wording follows /workspace/term-split/page-header.txt ("Our view" blocks and the Great American Betrayal
# section). The Arendt quotations, the Alvarez/Sullivan and Speech or Debate lines, and the 2023 censure were
# restored on Sep 24, 2026 against primary sources (SRC above), with wording corrected to match those sources.
OPINION_POSTS = [
    {
        "slug": "the-great-american-betrayal",
        "title": "The Great American Betrayal",
        "date": "2026-09-24",
        "body": [
            "Deliberately deceiving voters at scale should be treated as a crime against self-government. It is a betrayal of the "
            "republic, because free elections assume that citizens can give informed consent. When false claims are pushed, amplified, "
            "and [left standing long after the record has corrected them](fake-news.html), that consent is poisoned.",
            "Hannah Arendt named what is at stake. In [The Origins of Totalitarianism](" + LAWSRC["origins"] + ") (enlarged 2nd ed., 1958; the "
            "passage is from \u201cIdeology and Terror,\u201d [first published in 1953](" + LAWSRC["ideology"] + ")) she wrote: \u201cThe ideal "
            "subject of totalitarian rule is not the convinced Nazi or the convinced Communist, but people for whom the distinction between "
            "fact and fiction (i.e., the reality of experience) and the distinction between true and false (i.e., the standards of thought) "
            "no longer exist.\u201d In [\u201cTruth and Politics\u201d](" + LAWSRC["truthpol"] + ") (The New Yorker, 1967) she argued that factual "
            "truth is the ground political opinion stands on: \u201cFreedom of opinion is a farce unless factual information is guaranteed "
            "and the facts themselves are not in dispute.\u201d Factual truth, she wrote, \u201cis always in danger of being maneuvered out of "
            "the world not only for a time but, potentially, forever.\u201d In [\u201cLying in Politics\u201d](" + LAWSRC["lying"] + ") (1971), "
            "reflecting on the Pentagon Papers, she found that the policy of lying was \u201cchiefly if not exclusively destined for domestic "
            "consumption, for propaganda at home and especially for the purpose of deceiving Congress.\u201d In a 1974 interview with Roger "
            "Errera, [published in The New York Review of Books in 1978](" + LAWSRC["errera"] + "), she warned: \u201ca people that no longer can "
            "believe anything cannot make up its mind. It is deprived not only of its capacity to act but also of its capacity to think and "
            "to judge.\u201d",
            "Current U.S. law protects much false speech. In [United States v. Alvarez](" + LAWSRC["alvarez"] + ") (2012) the Supreme Court "
            "struck down the Stolen Valor Act, and the plurality wrote that \u201cfalsity alone may not suffice to bring the speech outside "
            "the First Amendment.\u201d Under [New York Times Co. v. Sullivan](" + LAWSRC["sullivan"] + ") (1964), a public official suing over "
            "a falsehood about official conduct must prove \u201cactual malice\u201d: that the statement was made \u201cwith knowledge that it "
            "was false or with reckless disregard of whether it was false or not.\u201d This section is not a claim about what the courts "
            "already punish. It is an argument about what accountability should become: if a free people cannot tell fact from fiction, "
            "they cannot govern themselves.",
            "Congress, which [writes the rules for itself](" + LAWSRC["art1"] + "), has betrayed voters by refusing to police its own members' "
            "false statements. In this record alone, [{congress} cases](fake-news.html) were pushed by a sitting Representative, Senator, "
            "Speaker, or party leader in the House or Senate. The Speech or Debate Clause ([art. I, \u00a7 6](" + LAWSRC["art1"] + ")) protects "
            "legislative acts, but not everything a member does in public. In [Gravel v. United States](" + LAWSRC["gravel"] + ") (1972) the Court "
            "held that a senator's private publication of the Pentagon Papers \u201cwas in no way essential to the deliberations of the "
            "Senate\u201d and was not protected. In [Hutchinson v. Proxmire](" + LAWSRC["hutchinson"] + ") (1979) it held that \u201cneither the "
            "newsletters nor the press release was \u2018essential to the deliberations of the Senate\u2019\u201d; the Clause did not shield them.",
            "Even so, the House rarely uses its own discipline. Its historians list [{expelled} expulsions and {censures} censures](" + LAWSRC["discipline"] + ") "
            "in its entire history. On June 21, 2023, the House [censured Rep. Adam Schiff](" + LAWSRC["hres521"] + ") over Russia-related claims "
            "(H. Res. 521), [213\u2013209 with 6 present](" + LAWSRC["roll283"] + "): every yea was Republican and every nay was Democrat. That is a "
            "rarely used tool applied along party lines, not a standing accuracy rule.",
        ],
        "sources": [
            ("Fake News Exposed: the {total} cases, each linked to its official record, transcript or video, correction, or fact-check", "fake-news.html"),
            ("U.S. Constitution, Article I, \u00a7\u00a7 5\u20136: each House determines its rules and may punish its members; Speech or Debate Clause (Constitution Annotated)", LAWSRC["art1"]),
            ("Hannah Arendt, The Origins of Totalitarianism, 2nd enlarged ed. (Meridian, 1958), Internet Archive record", LAWSRC["origins"]),
            ("Hannah Arendt, \u201cIdeology and Terror: A Novel Form of Government,\u201d The Review of Politics 15(3), July 1953", LAWSRC["ideology"]),
            ("Hannah Arendt, \u201cTruth and Politics,\u201d The New Yorker, Feb. 25, 1967", LAWSRC["truthpol"]),
            ("Hannah Arendt, \u201cLying in Politics: Reflections on the Pentagon Papers,\u201d The New York Review of Books, Nov. 18, 1971", LAWSRC["lying"]),
            ("Hannah Arendt, interview with Roger Errera (1974), The New York Review of Books, Oct. 26, 1978", LAWSRC["errera"]),
            ("United States v. Alvarez, 567 U.S. 709 (2012), U.S. Reports (Library of Congress)", LAWSRC["alvarez"]),
            ("New York Times Co. v. Sullivan, 376 U.S. 254 (1964), U.S. Reports (Library of Congress)", LAWSRC["sullivan"]),
            ("Gravel v. United States, 408 U.S. 606 (1972), U.S. Reports (Library of Congress)", LAWSRC["gravel"]),
            ("Hutchinson v. Proxmire, 443 U.S. 111 (1979), U.S. Reports (Library of Congress)", LAWSRC["hutchinson"]),
            ("Office of the House Historian: Members expelled, censured, or reprimanded", LAWSRC["discipline"]),
            ("H. Res. 521 (118th Congress), as agreed to June 21, 2023 (GovInfo)", LAWSRC["hres521"]),
            ("Clerk of the House, Roll Call 283 (June 21, 2023): 213 yea (all R), 209 nay (all D), 6 present", LAWSRC["roll283"]),
        ],
        "origin": "The Great American Betrayal",
        "origin_match": "Deliberately deceiving voters at scale",
    },
    {
        "slug": "not-a-string-of-honest-mistakes",
        "title": "Not a string of honest mistakes",
        "date": "2026-09-24",
        "body": [
            "Taken together with [the documented cases](fake-news.html), the owner of this site believes these repeated methods of "
            "deception were not a string of honest mistakes. They look like an intentional effort to sway voters against Donald Trump "
            "and his administration.",
        ],
        "sources": [
            ("Fake News Exposed: the {total} cases, each linked to its official record, transcript or video, correction, or fact-check", "fake-news.html"),
        ],
        "origin": "The Great American Betrayal: Who's in the newsroom",
        "origin_match": "not a string of honest mistakes",
    },
    {
        "slug": "opinion-dressed-as-news",
        "title": "Opinion dressed as news",
        "date": "2026-09-24",
        "body": ["Americans are no longer given the news. They are given hate-filled opinion dressed as news."],
        "sources": [],
        "origin": "The Great American Betrayal: When news became opinion",
        "origin_match": "hate-filled opinion dressed as news",
    },
    {
        "slug": "the-same-evidence-for-everyone",
        "title": "The same evidence for everyone",
        "date": "2026-09-24",
        "body": [
            "In my opinion, the damage to the nation is universal, done by everyone holding a microphone, regardless of party or network. "
            "As Hannah Arendt warned, a people fed constant lies ends up not knowing what the truth is. That is why this site holds "
            "everyone to the same evidence.",
            # Verified quotation already used above (Errera interview), same source and wording.
            "Her words, from a 1974 interview with Roger Errera [published in The New York Review of Books in 1978](" + LAWSRC["errera"] + "): "
            "\u201ca people that no longer can believe anything cannot make up its mind. It is deprived not only of its capacity to act but "
            "also of its capacity to think and to judge.\u201d",
        ],
        "sources": [
            ("Hannah Arendt, interview with Roger Errera (1974), The New York Review of Books, Oct. 26, 1978", LAWSRC["errera"]),
        ],
    },
]


def op_inline(text):
    text = (text.replace("{congress}", str(CONGRESS_N)).replace("{total}", str(ST["total"]))
            .replace("{censures}", str(HOUSE_DISCIPLINE["censured"])).replace("{expelled}", str(HOUSE_DISCIPLINE["expelled"])))
    def link(m):
        label, href = m.group(1), m.group(2)
        ext = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
        return f'<a href="{href}"{ext}>{label}</a>'
    return re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link, e(text))


def op_date(d):
    import datetime as _dt
    x = _dt.date.fromisoformat(d)
    return f"{x:%b} {x.day}, {x.year}"


def build_opinion():
    posts = sorted(OPINION_POSTS, key=lambda q: q["date"], reverse=True)
    cards = []
    for q in posts:
        paras = "".join(f"<p>{op_inline(t)}</p>" for t in q["body"])
        if q["sources"]:
            src = "".join(f'<li>{op_inline(f"[{lbl}]({u})")}</li>' for lbl, u in q["sources"])
            src = f'<p class="foot-h">Facts in this piece link to</p><ul>{src}</ul>'
        else:
            src = '<p class="foot-h">No factual claims: opinion only</p>'
        origin = (f'<p class="op-origin">First ran in <a href="betrayal.html">{e(q["origin"])}</a>.</p>' if q.get("origin") else "")
        cards.append(f'<article class="op-card" id="{e(q["slug"])}"><div class="op-meta"><span class="op-tag">Opinion</span>'
                     f'<time datetime="{e(q["date"])}">{op_date(q["date"])}</time></div><h2>{e(q["title"])}</h2>{paras}'
                     f'<footer class="op-src">{src}{origin}</footer></article>')
    body = f"""
<header class="doc-head op-head"><p class="op-flag">{ico("quote")} Opinion</p><h1>Opinion</h1>
<p class="doc-lede">The site owner's arguments, kept apart from the evidence. The cases and their records are on <a href="fake-news.html">Fake News Exposed</a> and <a href="betrayal.html">The Great American Betrayal</a>.</p></header>
<div class="op-banner" role="note"><b>Opinion.</b> The facts cited here are sourced to the record; the conclusions are the author's.</div>
<div class="op-list">{"".join(cards)}</div>
<section class="reader-path"><p>Judge for yourself: <a class="btn navy sm" href="fake-news.html">Open the {ST['total']} cases</a> <a class="btn ghost-dark sm" href="betrayal.html">The evidence spine</a> <a class="btn ghost-dark sm" href="about.html">Methodology</a></p></section>
"""
    return page("opinion.html", "Opinion · Swamp Force",
                "Opinion: the site owner's arguments, labeled and kept apart from the evidence. Facts cited are linked to the record.",
                body, serious=True)


def build_unsupported():
    cards = []
    for u in UNSUP:
        if u["id"] and u["in_catalog"]:
            ref = f'<a href="fake-news.html#case-{e(u["id"])}">Case {e(u["id"])}</a> · under review'
        elif u["id"]:
            ref = f"Formerly case {e(u['id'])}"
        else:
            ref = ""
        links = " ".join(f'<a href="{e(x)}" target="_blank" rel="noopener">Source {i}</a>' for i, x in enumerate(u["urls"], 1))
        anchor = f' id="unsupported-{e(u["id"])}"' if u["id"] else ""
        meta = f"<span>{ref}</span>" if ref else ""
        checked = f' <span>Checked {e(u["checked"])}</span>' if u["checked"] else ""
        parts = [f'<article class="unsup-card"{anchor}><p class="unsup-meta"><span class="unsup-tag">Unsupported</span>{meta}</p>',
                 f'<h2>{e(u["claim"])}</h2>']
        if u["who"]:
            parts.append(f'<p class="unsup-who"><b>Pushed by</b> {e(u["who"])}</p>')
        if u["reason"]:
            parts.append(f'<p><b>Why it is unsupported</b> {e(u["reason"])}</p>')
        if links or checked:
            parts.append(f'<p class="unsup-src">{links}{checked}</p>')
        cards.append("".join(parts) + "</article>")
    body = f"""
<header class="doc-head"><p class="doc-kicker">Evidence</p><h1>Unsupported claims</h1>
<p class="doc-lede">{len(UNSUP)} claim{'s were' if len(UNSUP) != 1 else ' was'} reviewed and could not be tied to a primary source. {'They are' if len(UNSUP) != 1 else 'It is'} kept apart from the {ST['total']} documented cases on <a href="fake-news.html">Fake News Exposed</a>.</p>
<div class="doc-actions"><a class="btn ghost-dark sm" href="downloads/unsupported-claims.csv">{ico("down")} CSV</a><button type="button" class="btn ghost-dark sm" data-print>{ico("print")} Print</button></div></header>
<div class="unsup-list">{"".join(cards)}</div>
<section class="reader-path"><p>How claims are judged: <a class="btn ghost-dark sm" href="about.html">Methodology</a> <a class="btn navy sm" href="fake-news.html">The {ST['total']} documented cases</a></p></section>
"""
    return page("unsupported.html", "Unsupported claims · Swamp Force",
                f"{len(UNSUP)} claims reviewed by Swamp Force that could not be supported by a primary source.", body, serious=True)


def build_404():
    body = '<div class="wrap narrow center" style="padding:80px 0"><h1 class="section-title">Page not found</h1><p>That page has moved or no longer exists.</p><p><a class="btn" href="index.html">Home</a> <a class="btn navy" href="fake-news.html">The cases</a></p></div>'
    return page("404.html", "Not found · Swamp Force", "Page not found.", body, flush=True)


def essay_redirects():
    text = (AUDIT / "repo" / "ESSAYS.md").read_text(encoding="utf-8")
    target = {"The Republic": "foreword.html", "The Tape": "fake-news.html", "The Media": "fake-news.html", "Congress": "congress.html",
              "The Border": "border.html", "The Remedy": "remedy.html", "Democrats": "democrats.html", "Republicans": "republicans.html",
              "The Parties": "index.html"}
    d = {m.group(1): target.get(m.group(2).strip(), "index.html")
         for m in re.finditer(r"- Slug: (\S+)\n- Series: ([^\n]+)", text)}
    d.update({"the-media-ledger": "fake-news.html", "the-democrat-ledger": "democrats.html", "the-republican-ledger": "republicans.html",
              "the-caption-was-not-the-charge": "january-6.html", "the-hire-is-the-country": "lawfare.html", "a-war-on-americans": "lawfare.html"})
    import journal  # converted essays: /dispatch/<slug>.html -> their new journal page
    d.update(journal.REDIRECTS)
    return d


def _clean_paths(t):
    t = re.sub(r"file:///workspace/lawfare/sources/([\w.-]+)", lambda m: f"{DOMAIN}/lawfare-docs/{m.group(1)}", t)
    t = re.sub(r"/workspace/lawfare/sources/([\w.-]+)", lambda m: f"{DOMAIN}/lawfare-docs/{m.group(1)}", t)
    return t.replace("/workspace/lawfare/sources/", f"{DOMAIN}/lawfare-docs/")


def sanitize_lawfare_downloads():
    import zipfile, io
    for name in ["lawfare-docket-tracker.csv", "lawfare-rulings.csv"]:
        f = OUT / "downloads" / name
        f.write_text(_clean_paths(f.read_text(encoding="utf-8-sig")), encoding="utf-8-sig")
    x = OUT / "downloads" / "lawfare-docket-tracker.xlsx"
    buf = io.BytesIO()
    with zipfile.ZipFile(x) as zin, zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zout:
        for it in zin.infolist():
            data = zin.read(it.filename)
            if it.filename.endswith(".xml"):
                data = _clean_paths(data.decode("utf-8")).encode("utf-8")
            zout.writestr(it, data)
    x.write_bytes(buf.getvalue())



def write_infra(pages):
    red = essay_redirects()
    L = ["Options -Indexes", "DirectoryIndex index.html", "ErrorDocument 404 /404.html", "AddDefaultCharset UTF-8", "",
         "<IfModule mod_alias.c>", "Redirect 301 /explainer.html /betrayal.html", "Redirect 301 /archive.html /index.html",
         "Redirect 301 /pump.html /scorecard.html", "Redirect 301 /midterms.html /scorecard.html", "Redirect 301 /pending.html /index.html", "Redirect 301 /republic.html /foreword.html"]
    for slug, tgt in sorted(red.items()):
        L.append(f"Redirect 301 /dispatch/{slug}.html /{tgt}")
    L += ["RedirectMatch 301 ^/dispatch/?$ /index.html", "</IfModule>", "",
          "<IfModule mod_rewrite.c>", "RewriteEngine On", "RewriteCond %{REQUEST_FILENAME} !-f", "RewriteCond %{REQUEST_FILENAME} !-d",
          "RewriteCond %{REQUEST_FILENAME}.html -f", "RewriteRule ^([^.]+)$ $1.html [L]", "</IfModule>", "",
          "<IfModule mod_expires.c>", "ExpiresActive On", 'ExpiresByType text/css "access plus 7 days"',
          'ExpiresByType application/javascript "access plus 7 days"', 'ExpiresByType image/jpeg "access plus 30 days"',
          'ExpiresByType image/png "access plus 30 days"', "</IfModule>",
          "<IfModule mod_deflate.c>", "AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml", "</IfModule>", ""]
    (OUT / ".htaccess").write_text("\n".join(L), encoding="utf-8")
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n", encoding="utf-8")
    urls = "".join(f"<url><loc>{DOMAIN}/{'' if p == 'index.html' else p}</loc><lastmod>2026-09-24</lastmod></url>\n" for p in pages if p != "404.html")
    (OUT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n', encoding="utf-8")
    return len(red)


def ensure_assets():
    for sub in ["assets", "data", "docs", "downloads", "images", "lawfare-docs"]:
        (OUT / sub).mkdir(parents=True, exist_ok=True)
    for name in ["first-term-trump-admin-media-deception.csv", "first-term-trump-admin-media-deception.xlsx",
                 "later-second-term-trump-admin-media-deception.csv", "later-second-term-trump-admin-media-deception.xlsx"]:
        shutil.copy2(TS / name, OUT / "downloads" / name)
    for name in ["lawfare-docket-tracker.csv", "lawfare-docket-tracker.xlsx", "lawfare-rulings.csv", "lawfare-tracker.pdf"]:
        shutil.copy2(LAW / name, OUT / "downloads" / name)
    for src in sorted((LAW / "sources").glob("*.pdf")):  # court PDFs linked from the Lawfare page
        shutil.copy2(src, OUT / "lawfare-docs" / src.name)
    sanitize_lawfare_downloads()
    (OUT / "downloads" / "README.txt").unlink(missing_ok=True)
    for stem, files in [("first-term-media-deception", ["first-term-trump-admin-media-deception.csv", "first-term-trump-admin-media-deception.xlsx"]),
                        ("later-second-term-media-deception", ["later-second-term-trump-admin-media-deception.csv", "later-second-term-trump-admin-media-deception.xlsx"])]:
        with zipfile.ZipFile(OUT / "downloads" / f"{stem}.zip", "w", zipfile.ZIP_DEFLATED) as z:
            for f in files:
                z.write(OUT / "downloads" / f, f)
    for name in ["swampforce-brief.pdf", "swampforce-evidence-appendix.pdf"]:
        shutil.copy2(ROOT / "brief" / name, OUT / "docs" / name)
    # HTML twins of the PDFs (regenerated by /workspace/brief/build_*.py); main() relabels "audit" -> "review" in the brief copy
    shutil.copy2(ROOT / "brief" / "swampforce-brief.html", OUT / "docs" / "staff-brief.html")
    shutil.copy2(ROOT / "brief" / "swampforce-evidence-appendix.html", OUT / "docs" / "evidence-appendix.html")


def main():
    ensure_assets()
    dem_html, dem_n = party_page("democrats.html", "Democrats", "Democrats Ledger", "Claims Democratic officials made, set against the record.")
    gop_html, gop_n = party_page("republicans.html", "Republicans", "Republicans Ledger", "Claims Republican officials made, set against the record.")
    law_html, law_n = build_lawfare()
    pages = {
        "index.html": build_home(), "fake-news.html": build_fake_news(), "scorecard.html": build_scorecard(),
        "betrayal.html": build_betrayal(), "democrats.html": dem_html, "republicans.html": gop_html,
        "january-6.html": build_j6(), "lawfare.html": law_html, "brief.html": build_brief(), "appendix.html": build_appendix(),
        "about.html": build_about(), "downloads.html": build_downloads(), "store.html": build_store(),
        "foreword.html": build_foreword(), "congress.html": build_congress(), "border.html": build_border(),
        "remedy.html": build_remedy(law_n), "opinion.html": build_opinion(), "404.html": build_404(),
    }
    if UNSUP:
        pages = {**{k: v for k, v in pages.items() if k != "404.html"}, "unsupported.html": build_unsupported(), "404.html": pages["404.html"]}
        with open(OUT / "downloads" / "unsupported-claims.csv", "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh)
            w.writerow(["Item_ID", "Claim", "Who_Pushed_It", "Reason", "Source_URLs", "Checked"])
            for u in UNSUP:
                w.writerow([u["id"], u["claim"], u["who"], u["reason"], " ".join(u["urls"]), u["checked"]])
    else:
        (OUT / "unsupported.html").unlink(missing_ok=True)
        (OUT / "downloads" / "unsupported-claims.csv").unlink(missing_ok=True)
    # Watch sections (watch.py): built only when their inputs exist; stale pages are removed otherwise
    H = SimpleNamespace(page=page, tile=tile, chart_card=chart_card, src_link=src_link, ico=ico)
    watch_stats = {}
    for sec in W.SECTIONS:
        if sec in WATCH_ACTIVE:
            html_out, st = sec.builder(H)
            pages = {**{k: v for k, v in pages.items() if k != "404.html"}, sec.slug: html_out, "404.html": pages["404.html"]}
            watch_stats[sec.slug] = st
        else:
            (OUT / sec.slug).unlink(missing_ok=True)
            watch_stats[sec.slug] = {"skipped": True, "missing": sec.missing()}
    pages["404.html"] = re.sub(r'(href|src)="(?!https?:|mailto:|#|/)', r'\1="/', pages["404.html"])
    for old in ["explainer.html", "pump.html", "pending.html", "republic.html"]:
        (OUT / old).unlink(missing_ok=True)
    for name, h in pages.items():
        h = h.replace("In this site&#x27;s audit of", "In this site&#x27;s review of")
        (OUT / name).write_text(h, encoding="utf-8")
    sb = OUT / "docs" / "staff-brief.html"
    if sb.exists():
        sb.write_text(sb.read_text(encoding="utf-8").replace("<b>Evidence audit:</b>", "<b>Evidence review:</b>"), encoding="utf-8")
    (OUT / "data" / "cases.json").write_text(json.dumps(
        [{k: c[k] for k in ("id", "claim", "evidence", "proof", "method", "term", "truth_url", "primary", "notes", "who")} for c in cases],
        ensure_ascii=False, indent=1), encoding="utf-8")
    n_red = write_infra(list(pages))
    meta = {"pages": list(pages), "stats": ST, "corr": dict(corr), "never_split": {"fact_checked_only": NC_FC, "no_fact_check": NC_NOFC}, "congress": CONGRESS_N, "dem_rows": dem_n, "gop_rows": gop_n, "balance": BALANCE_STATS,
            "lawfare": law_n, "redirects": n_red, "top_methods": TOP_METHODS, "unsupported": len(UNSUP),
            "watch": watch_stats, "planned_sections": W.planned_status(), "site_apply": SITE_APPLY}
    (SITE / "build-summary.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main()
