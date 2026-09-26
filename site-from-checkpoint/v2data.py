#!/usr/bin/env python3
"""Swamp Force from-checkpoint — static rebuild from checkpoint IA + verified data only."""
from __future__ import annotations

import csv
import html
import json
import re
import shutil
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path("/workspace")
TS = ROOT / "term-split"
AUDIT = ROOT / "checkpoint-review"
LAW = ROOT / "lawfare"
BRIEF = ROOT / "brief"
SITE = ROOT / "site-from-checkpoint"
OUT = SITE / "public_html"
ZIP = ROOT / "swampforce-from-checkpoint.zip"

e = html.escape
OK = {"Verified", "Verified with correction needed"}

JOURNAL = [
    ("The Republic", "republic.html", "They forgot who they work for."),
    ("Fake News Exposed", "fake-news.html", "Caption versus the file."),
    ("Democrats", "democrats.html", "Party ledger — verified rows."),
    ("Republicans", "republicans.html", "Party ledger — verified rows."),
    ("Congress", "congress.html", "Purse, recess, unread bills."),
    ("The Border", "border.html", "Encounters, FEMA, missing children."),
    ("The Remedy", "remedy.html", "Judges and the statute."),
]

SCORE_TABS = [
    ("gop", "Republicans", "Bills they passed. Debt they added."),
    ("dem", "Democrats", "Bills they passed. The border they opened."),
    ("split", "Split", "One chamber each. Largest slice of the debt."),
    ("oval", "The Oval", "Four presidents. Trump 1 and Trump 2."),
    ("compare", "Side by side", "Helped and hurt on one page."),
]

# Map audit scorecard pages into rooms (best-effort)
ROOM_PAGES = {
    "gop": ["Scorecard · LEDGER", "Scorecard · MAJORITY", "Scorecard · RECORD", "Scorecard · FAILURE",
            "Scorecard · LAWS", "Scorecard · PAPERS", "Scorecard · Hoaxes", "Scorecard · PARTY_SPEND",
            "Scorecard · TAX_MOVES", "Scorecard · LEG_BRANCH", "Scorecard · HEARING_ABSENCE"],
    "dem": ["Scorecard · BORDER", "Scorecard · BORDER_MOVE", "Scorecard · BORDER_HARM", "Scorecard · ALIENS",
            "Scorecard · BENEFITS", "Scorecard · Hoaxes", "Scorecard · Frames", "Scorecard · Fake News"],
    "split": ["Scorecard · DEBT_TALLY", "Scorecard · DEBT_WHY", "Scorecard · Debt", "Scorecard · DEBT_BY_OVAL",
              "Scorecard · CAPACITY", "Scorecard · FUNNEL", "Scorecard · THE_LOSS", "Scorecard · DRIVERS"],
    "oval": ["Scorecard · OVAL", "Scorecard · OVAL_NOW", "Scorecard · OVAL_RECORD", "Scorecard · TRUMP_TERMS",
             "Scorecard · OBAMA_TERMS", "Scorecard · CHARTS", "Scorecard · WAR"],
    "compare": ["Scorecard · PRICES", "Scorecard · Prices", "Scorecard · CPI_PEAK", "Scorecard · FARM",
                "Scorecard · WORKER", "Scorecard · Frames", "Scorecard · Fake News", "Scorecard · CHARTS"],
}

PROOF_MAP = {
    "Official record": ("Official record", "official"),
    "Original transcript/video": ("Transcript / video", "transcript"),
    "Outlet's own correction": ("Outlet correction", "outlet"),
    "Fact-check only": ("Second fact-check", "factcheck"),
}

EXPLAINER_TITLES = {
    "HOW A NARRATIVE IS BUILT: THE PSYCHOLOGY BEHIND THE HEADLINES":
        "How a Narrative Is Built",
    "WHAT PSYCHOLOGICAL WARFARE IS": "What Psychological Warfare Is",
    "THE SCIENCE BEHIND IT": "The Science Behind It",
    "WHY YOU NEVER SAW THE CORRECTION": "Why You Never Saw the Correction",
    "GASLIGHTING": "Gaslighting",
    "THE METHODS, AND THE RESEARCH THAT NAMED THEM": "The Methods",
    "WHY POLITICIANS AND NETWORKS DO IT": "Why Politicians and Networks Do It",
    "WHO PAID FOR IT, AND WHY": "Who Paid for It, and Why",
    "WHY THE HOSTILITY RUNS SO DEEP": "Why the Hostility Runs So Deep",
    "WHEN NEWS BECAME OPINION": "When News Became Opinion",
    "WHO'S IN THE NEWSROOM": "Who's in the Newsroom",
    "THE GREAT AMERICAN BETRAYAL": "The Great American Betrayal",
    "WHY IT MATTERS": "Why It Matters",
}


def domain(url: str) -> str:
    try:
        return urlparse(url).netloc.replace("www.", "") or url
    except Exception:
        return url


def load_catalog() -> list[dict]:
    rows = []
    for key, label, base in [
        ("first", "First term (2017–2021)", "first-term-trump-admin-media-deception"),
        ("later", "Later / second term (2021–present)", "later-second-term-trump-admin-media-deception"),
    ]:
        with (TS / f"{base}.csv").open(encoding="utf-8-sig") as fh:
            for r in csv.DictReader(fh):
                claim = r["Claim"]
                began = ended = ""
                m = re.search(r"\n\s*Began:\s*(.*?)\s*\|\s*Ended:\s*(.*)$", claim, re.S)
                if m:
                    began, ended = m.group(1).strip(), m.group(2).strip()
                    claim = claim[: m.start()].strip()
                rows.append({
                    "id": r["Item_ID"].strip(),
                    "claim": claim,
                    "began": began,
                    "ended": ended,
                    "truth_url": (r["Truth_Source_URL"] or "").strip(),
                    "who": r["Who_Pushed_It"] or "",
                    "duration": r["Approximate_Duration"] or "",
                    "method": (r["Deception_Form"] or "").replace('"', ""),
                    "tag": r["Category_Tag"] or "",
                    "notes": r["Notes"] or "",
                    "evidence": r.get("Evidence_Level") or "",
                    "proof": r.get("Proof_Basis") or "",
                    "corrvis": r.get("Correction_Visibility") or "",
                    "primary": (r.get("Primary_Source_URL") or "").strip(),
                    "term": key,
                    "term_label": label,
                })
    rows.sort(key=lambda x: int(x["id"]) if str(x["id"]).isdigit() else 0)
    return rows


def load_verified() -> list[dict]:
    with (AUDIT / "verified-items.csv").open(encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))


def parse_claim_truth(text: str) -> tuple[str, str]:
    text = (text or "").strip()
    m = re.match(r"CLAIM:\s*(.*?)\s*\|\s*TRUTH:\s*(.*)$", text, re.S | re.I)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    m = re.match(r"CAPTION:\s*(.*?)\s*\|\s*SOLD:\s*(.*)$", text, re.S | re.I)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return text, ""


def cat_id_from_dup(dup: str) -> str | None:
    m = re.match(r"^(FT|LT)-(\d+)$", (dup or "").strip(), re.I)
    return m.group(2) if m else None


def stats(cases: list[dict]) -> dict:
    return {
        "total": len(cases),
        "proven": sum(1 for c in cases if c["evidence"] == "Proven false"),
        "misleading": sum(1 for c in cases if c["evidence"] == "Rated misleading"),
        "official": sum(1 for c in cases if c["proof"] == "Official record"),
        "transcript": sum(1 for c in cases if c["proof"] == "Original transcript/video"),
        "outlet": sum(1 for c in cases if c["proof"] == "Outlet's own correction"),
        "factcheck": sum(1 for c in cases if c["proof"] == "Fact-check only"),
        "never": sum(1 for c in cases if (c["corrvis"] or "").startswith("Never corrected")),
        "first": sum(1 for c in cases if c["term"] == "first"),
        "later": sum(1 for c in cases if c["term"] == "later"),
    }


def nav_html(active: str) -> str:
    parts = []
    # Journal dropdowns (static pages for series hubs)
    for name, href, _dek in JOURNAL:
        cls = " active" if active == href else ""
        parts.append(f'<a class="{cls.strip()}" href="{href}">{e(name)}</a>')
    extras = [
        ("january-6.html", "J6"),
        ("scorecard.html", "Scorecard"),
        ("pump.html", "Pump"),
        ("foreword.html", "Foreword"),
        ("lawfare.html", "Lawfare"),
        ("explainer.html", "Explainer"),
        ("brief.html", "Brief"),
        ("store.html", "Store"),
        ("downloads.html", "Downloads"),
        ("about.html", "About"),
    ]
    for href, label in extras:
        cls = " active" if active == href else ""
        parts.append(f'<a class="{cls.strip()}" href="{href}">{e(label)}</a>')
    return "".join(parts)


def page(title: str, desc: str, active: str, body: str, extra_js: str = "") -> str:
    scripts = '<script src="assets/app.js" defer></script>'
    if extra_js:
        scripts += f'\n<script src="{extra_js}" defer></script>'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="mast">
    <a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"></span> Swamp Force™</a>
    <p class="kicker">Vote the file. Not the feeling.</p>
  </div>
  <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="nav-row" id="site-nav" aria-label="Primary">{nav_html(active)}</nav>
</header>
<main id="main" class="main">
{body}
</main>
<footer class="site-footer">
  <div class="footer-inner">
    <p><strong>Swamp Force™</strong> — a government-source journal. Compare the action to the speech.
    Opinion is labeled <span class="badge" style="background:#b45309;color:#fff">Opinion</span>.
    Author: SwampForce Editor · © 2026 · editor@swampforce.com</p>
    <p><a href="about.html">Methodology</a> · <a href="fake-news.html">Fake News</a> ·
    <a href="scorecard.html">Scorecard</a> · <a href="store.html">Store</a> ·
    <a href="downloads.html">Downloads</a></p>
    <p class="footer-note">Phase A static rebuild of the Sep 23, 2026 checkpoint (c60dc5d).
    Unverified checkpoint numbers are not shown. Evidence ranks: official record → transcript/video → outlet correction → fact-check.</p>
  </div>
</footer>
{scripts}
</body>
</html>
"""


def proof_badge(proof: str) -> str:
    label, cls = PROOF_MAP.get(proof, (proof or "Record", "factcheck"))
    return f'<span class="proof {cls}">{e(label)}</span>'


def ev_badge(ev: str) -> str:
    if ev == "Proven false":
        return '<span class="badge proven">Proven false</span>'
    if ev == "Rated misleading":
        return '<span class="badge misleading">Rated misleading</span>'
    return f'<span class="badge">{e(ev)}</span>' if ev else ""


def frame_case(c: dict) -> str:
    links = []
    if c.get("primary"):
        links.append(f'<a href="{e(c["primary"])}" target="_blank" rel="noopener">Primary · {e(domain(c["primary"]))}</a>')
    if c.get("truth_url"):
        links.append(f'<a href="{e(c["truth_url"])}" target="_blank" rel="noopener">Record · {e(domain(c["truth_url"]))}</a>')
    dates = ""
    if c.get("began") or c.get("ended"):
        dates = f'<p style="font-size:.85rem;color:#555;margin-top:8px">Began: {e(c.get("began") or "—")} · Ended: {e(c.get("ended") or "—")}</p>'
    search = " ".join([c["claim"], c["notes"], c["who"], c["method"], c["id"]])
    short = c["claim"][:100] + ("…" if len(c["claim"]) > 100 else "")
    return f"""
<article class="frame" id="case-{e(c['id'])}" data-case="{e(c['id'])}"
  data-method="{e(c['method'])}" data-evidence="{e(c['evidence'])}"
  data-proof="{e(c['proof'])}" data-term="{e(c['term'])}" data-search="{e(search)}">
  <button type="button" class="frame-head" data-frame-toggle aria-expanded="false">
    <span class="frame-tag">#{e(c['id'])} · {e(short)}</span>
    <span class="frame-meta">{ev_badge(c['evidence'])} {proof_badge(c['proof'])} <span>{e(c['method'])}</span></span>
  </button>
  <div class="frame-body">
    <div class="frame-cols">
      <div class="frame-col claim-side"><h3>Claim</h3><p>{e(c['claim'])}</p>{dates}
        <p style="font-size:.85rem;margin-top:8px">Who: {e(c['who'] or '—')}<br>Duration: {e(c['duration'] or '—')}</p></div>
      <div class="frame-col truth-side"><h3>Truth / record</h3><p>{e(c['notes'] or 'See linked record.')}</p></div>
    </div>
    <div class="frame-foot">{proof_badge(c['proof'])}<span style="color:#555">{e(c['corrvis'])}</span>{" · ".join(links)}</div>
  </div>
</article>"""


def ledger_rows(verified: list[dict], page_name: str, catalog_ids: set[str]) -> tuple[str, dict]:
    items = [r for r in verified if r["Page"] == page_name and r["Verdict"] in OK]
    skipped = sum(1 for r in verified if r["Page"] == page_name and r["Verdict"] not in OK)
    full = short = 0
    parts = []
    for r in items:
        claim, truth = parse_claim_truth(r.get("Text") or "")
        tag = (r.get("Attributed_To") or "").strip() or f"Item {r.get('Item_No')}"
        dup = r.get("Duplicate_Of_Item_ID") or ""
        cid = cat_id_from_dup(dup)
        url = (r.get("Best_Source_URL") or "").strip()
        fix = (r.get("Fix_Needed") or "").strip()
        if cid and cid in catalog_ids:
            short += 1
            parts.append(
                f'<div class="short-link"><strong>{e(tag)}</strong> — {e(claim[:160])}{"…" if len(claim)>160 else ""}'
                f'<br><a href="fake-news.html#case-{e(cid)}">See catalog case #{e(cid)}</a>'
                f' <span style="color:#666">(deduped from {e(dup)})</span></div>'
            )
            continue
        full += 1
        corr = f'<p style="font-size:.85rem;color:#7c2d12">Correction applied: {e(fix)}</p>' if fix else ""
        link = f'<a href="{e(url)}" target="_blank" rel="noopener">Proof · {e(domain(url))}</a>' if url else ""
        parts.append(f"""
<article class="frame open">
  <div class="frame-head" style="cursor:default"><span class="frame-tag">{e(tag)}</span>
    <span class="frame-meta"><span class="badge proven">{e(r['Verdict'])}</span></span></div>
  <div class="frame-body" style="display:block">
    <div class="frame-cols">
      <div class="frame-col claim-side"><h3>Claim</h3><p>{e(claim)}</p></div>
      <div class="frame-col truth-side"><h3>Truth</h3><p>{e(truth or 'See linked record.')}</p>{corr}</div>
    </div>
    <div class="frame-foot">{link}</div>
  </div>
</article>""")
    counts = {"full": full, "short": short, "skipped": skipped, "verified": len(items)}
    return "\n".join(parts) or '<div class="placeholder"><h2>No verified rows yet</h2></div>', counts


def build_home(st: dict, dem_n: int, gop_n: int, law_n: int, score_n: int) -> str:
    body = f"""
<div class="uc">Phase A static rebuild of the Sep 23, 2026 checkpoint journal.
Verified catalog and dockets are live. Unverified scorecard modules stay Under review — we do not invent numbers.</div>
<section class="cover">
  <p class="kicker-lg">Swamp Force™ · swampforce.com</p>
  <h1>Vote the file. Not the feeling.</h1>
  <p>{e("The people are the employer. This journal prints the official record. No network. No manufactured drama.")}
br>
  Government sources only. Compare the action to the speech.</p>
</section>
<div class="stats">
  <div class="stat accent"><div class="num">{st['total']}</div><div class="lbl">Verified Fake News cases</div></div>
  <div class="stat"><div class="num">{st['proven']}</div><div class="lbl">Proven false</div></div>
  <div class="stat"><div class="num">{st['misleading']}</div><div class="lbl">Rated misleading</div></div>
  <div class="stat"><div class="num">{st['official']}</div><div class="lbl">Official-record proof</div></div>
  <div class="stat"><div class="num">{score_n}</div><div class="lbl">Verified scorecard figures</div></div>
</div>
<div class="cards">
  <a class="card" href="fake-news.html"><h2>Fake News Exposed</h2><p>{st['total']} claim|truth cases from the living catalog.</p></a>
  <a class="card" href="democrats.html"><h2>Democrats ledger</h2><p>{dem_n} verified rows (short-linked when already in catalog).</p></a>
  <a class="card" href="republicans.html"><h2>Republicans ledger</h2><p>{gop_n} verified rows — separate from the media catalog.</p></a>
  <a class="card" href="january-6.html"><h2>J6</h2><p>§2383 wording: zero 2383 ≠ nothing charged.</p></a>
  <a class="card" href="scorecard.html"><h2>Scorecard</h2><p>GOP / Dem / Split / Oval / Compare — verified figures only.</p></a>
  <a class="card" href="lawfare.html"><h2>Lawfare</h2><p>{law_n} dockets from the lawfare package.</p></a>
  <a class="card" href="pump.html"><h2>Pump</h2><p>Charts vs Read — under construction from checkpoint pump.ts.</p></a>
  <a class="card" href="store.html"><h2>Store</h2><p>Printify Pop-Up merch (checkout on Printify).</p></a>
  <a class="card" href="brief.html"><h2>Brief</h2><p>Lawmakers' brief + evidence appendix PDFs.</p></a>
  <a class="card" href="explainer.html"><h2>Explainer</h2><p>How a narrative is built — Opinion labeled.</p></a>
  <a class="card" href="foreword.html"><h2>Foreword</h2><p>Editorial frame for the journal.</p></a>
  <a class="card" href="downloads.html"><h2>Downloads</h2><p>CSV / Excel / PDFs.</p></a>
</div>
"""
    return page("Swamp Force — Vote the file. Not the feeling.",
                "Swamp Force journal: verified Fake News catalog, party ledgers, scorecard, lawfare.",
                "index.html", body)


def build_fake_news(cases: list[dict], st: dict) -> str:
    methods = sorted({c["method"] for c in cases if c["method"]})
    opts = "".join(f'<option value="{e(m)}">{e(m)}</option>' for m in methods)
    frames = "\n".join(frame_case(c) for c in cases)
    body = f"""
<header class="page-hero">
  <p class="section-label">Fake News Exposed · living catalog</p>
  <h1>Claim vs. the file</h1>
  <p class="lede">All {st['total']} verified catalog cases as expandable claim|truth rows.
  Checkpoint MEDIA_LIES rows appear only when the audit marked them Verified (and are not duplicated here if already in the catalog).</p>
</header>
<div class="filters">
  <label>Search<input type="search" id="q" placeholder="Search claims, outlets, notes…" autocomplete="off"></label>
  <div class="filter-grid">
    <label>Method<select id="filter-method"><option value="">All</option>{opts}</select></label>
    <label>Evidence<select id="filter-evidence"><option value="">All</option>
      <option>Proven false</option><option>Rated misleading</option></select></label>
    <label>Proof<select id="filter-proof"><option value="">All</option>
      <option value="Official record">Official record</option>
      <option value="Original transcript/video">Transcript / video</option>
      <option value="Outlet's own correction">Outlet correction</option>
      <option value="Fact-check only">Second fact-check</option></select></label>
    <label>Term<select id="filter-term"><option value="">All</option>
      <option value="first">First term</option><option value="later">Later / second</option></select></label>
  </div>
  <p style="margin:10px 0 0;font-size:.9rem"><span id="result-count">{st['total']} of {st['total']} cases</span>
  · <button type="button" class="btn" id="clear-filters" style="padding:4px 10px">Clear</button></p>
</div>
{frames}
"""
    return page("Fake News Exposed · Swamp Force", f"{st['total']} verified claim|truth cases.", "fake-news.html", body)


def build_party(title: str, page_name: str, verified: list[dict], catalog_ids: set[str], active: str) -> tuple[str, dict]:
    html_body, counts = ledger_rows(verified, page_name, catalog_ids)
    body = f"""
<header class="page-hero">
  <p class="section-label">Journal · {e(title)}</p>
  <h1>{e(title)} ledger</h1>
  <p class="lede">Verified rows from the Sep 23 checkpoint ledgers.ts. Party statements — different category from the Trump-admin Fake News catalog.</p>
</header>
<div class="party-note">Dedup: incidents already in Fake News are short-linked.
Included: {counts['verified']} verified ({counts['full']} full, {counts['short']} short). Skipped unverified: {counts['skipped']}.</div>
{html_body}
"""
    return page(f"{title} ledger · Swamp Force", f"Verified {title} ledger rows.", active, body), counts


def build_series_stub(name: str, href: str, dek: str, note: str) -> str:
    body = f"""
<header class="page-hero">
  <p class="section-label">Journal · {e(name)}</p>
  <h1>{e(name)}</h1>
  <p class="lede">{e(dek)}</p>
</header>
<div class="uc">{e(note)}</div>
<div class="panel"><h2>Coming from the checkpoint dispatch corpus</h2>
<p>Essay bodies from content.ts remain mostly Unverified in the audit. This hub is wired for nav fidelity; verified figures will land here as the audit clears them. See <a href="scorecard.html">Scorecard</a> and <a href="fake-news.html">Fake News</a> for live verified data.</p>
<p><a class="btn" href="index.html">Home</a> <a class="btn secondary" href="foreword.html">Foreword</a></p></div>
"""
    return page(f"{name} · Swamp Force", dek, href, body)


def build_j6(verified: list[dict], cases: list[dict]) -> str:
    keys = ("january 6", "jan. 6", "jan 6", "§2383", "2383", "insurrection", "ellipse",
            "proud boys", "sicknick", "fight like hell", "peacefully and patriotically")
    items = []
    for r in verified:
        if r["Verdict"] not in OK:
            continue
        blob = " ".join([r.get("Text") or "", r.get("Page") or "", r.get("Attributed_To") or "", r.get("Notes") or ""]).lower()
        if any(k in blob for k in keys):
            items.append(r)
    seen = set()
    frames = []
    for r in items:
        claim, truth = parse_claim_truth(r.get("Text") or "")
        key = claim[:90].lower()
        if key in seen:
            continue
        seen.add(key)
        url = (r.get("Best_Source_URL") or "").strip()
        link = f'<a href="{e(url)}" target="_blank" rel="noopener">Proof · {e(domain(url))}</a>' if url else ""
        frames.append(f"""
<article class="frame open"><div class="frame-head" style="cursor:default">
  <span class="frame-tag">{e((r.get('Attributed_To') or r.get('Page') or '')[:90])}</span>
  <span class="frame-meta"><span class="badge proven">{e(r['Verdict'])}</span></span></div>
  <div class="frame-body" style="display:block"><div class="frame-cols">
    <div class="frame-col claim-side"><h3>Claim / caption</h3><p>{e(claim)}</p></div>
    <div class="frame-col truth-side"><h3>Record</h3><p>{e(truth or claim)}</p></div>
  </div><div class="frame-foot">{link}</div></div></article>""")
    cat = [c for c in cases if any(k in (c["claim"] + c["notes"]).lower() for k in keys)]
    links = "".join(f'<li><a href="fake-news.html#case-{e(c["id"])}">#{e(c["id"])}</a> — {e(c["claim"][:110])}…</li>' for c in cat[:40])
    body = f"""
<header class="page-hero">
  <p class="section-label">J6</p>
  <h1>The caption was not the charge</h1>
  <p class="lede">Verified checkpoint items and related catalog cases about January 6.</p>
</header>
<div class="j6-note"><strong>Wording note.</strong> USAO-DC reported on the order of ~1,583 people federally charged in connection with January 6.
18 U.S.C. § 2383 is the insurrection statute. <em>Zero charges under §2383 is not the same as “nothing was charged.”</em>
Thousands of cases were filed on other statutes. Rows below address the television caption versus that charging statute.</div>
{"".join(frames)}
<section class="panel"><h2>Related Fake News catalog cases</h2>
<ul>{links or "<li>None matched.</li>"}</ul></section>
"""
    return page("J6 · Swamp Force", "January 6 verified record items; careful §2383 wording.", "january-6.html", body)


def build_lawfare() -> tuple[str, int]:
    with (LAW / "lawfare-docket-tracker.csv").open(encoding="utf-8-sig") as fh:
        cases = list(csv.DictReader(fh))
    with (LAW / "lawfare-rulings.csv").open(encoding="utf-8-sig") as fh:
        rulings = list(csv.DictReader(fh))
    by = defaultdict(list)
    for r in rulings:
        by[r.get("Case") or ""].append(r)
    cards = []
    for c in cases:
        name = c.get("Case_Name") or ""
        status = c.get("Current_Status") or ""
        matched = by.get(name) or []
        if not matched:
            for k, v in by.items():
                if k and (k in name or name[:40] in k):
                    matched = v
                    break
        tl = ""
        if matched:
            lis = []
            for r in matched:
                link = ""
                if r.get("Opinion URL"):
                    link = f'<div><a href="{e(r["Opinion URL"])}" target="_blank" rel="noopener">Opinion / filing</a></div>'
                lis.append(f'<li><span class="r-date">{e(r.get("Date") or "")}</span> {e(r.get("Court") or "")}'
                           f'<div>{e(r.get("Ruling summary") or "")}</div>{link}</li>')
            tl = f'<ol class="timeline">{"".join(lis)}</ol>'
        docket = c.get("Official_Docket_URL") or ""
        docket_a = f'<a href="{e(docket)}" target="_blank" rel="noopener">Official docket</a>' if docket else ""
        cards.append(f"""
<article class="law-card"><h2>{e(name)}</h2>
<div class="law-meta">
  <div><strong>Court:</strong> {e(c.get("Court") or "—")}</div>
  <div><strong>Docket:</strong> {e(c.get("Docket_Number") or "—")} {docket_a}</div>
  <div><strong>Brought by:</strong> {e(c.get("Brought_By") or "—")}</div>
  <div><strong>Filed:</strong> {e(c.get("Filed_Date") or "—")}</div>
  <div><strong>Charges / claims:</strong> {e(c.get("Charges_or_Claims") or "—")}</div>
</div>
<div class="status-box"><strong>Status:</strong> {e(status)}</div>
<p><strong>Outcome:</strong> {e(c.get("Outcome_Summary") or "—")}</p>
<p><strong>Documented issues:</strong> {e(c.get("Documented_Issues") or "—")}</p>
<h3 style="font-family:var(--sans);font-size:.85rem;color:#7f1d1d;text-transform:uppercase">Key rulings</h3>
{tl or "<p>See CSV / PDF package.</p>"}
<p style="font-size:.8rem;color:#666;font-family:var(--sans)"><strong>Sources:</strong> {e(c.get("Sources") or "—")}</p>
</article>""")
    body = f"""
<header class="page-hero">
  <p class="section-label">Lawfare</p>
  <h1>Docket tracker</h1>
  <p class="lede">Cases and key rulings from the lawfare package (Sep 24, 2026). No invented dockets.
  Site-owner opinion only in the labeled block.</p>
</header>
<p style="font-family:var(--sans);font-size:.9rem">Downloads:
  <a href="downloads/lawfare-docket-tracker.csv">CSV</a> ·
  <a href="downloads/lawfare-docket-tracker.xlsx">Excel</a> ·
  <a href="downloads/lawfare-rulings.csv">Rulings</a> ·
  <a href="downloads/lawfare-tracker.pdf">PDF</a></p>
{"".join(cards)}
<section class="opinion"><p class="opinion-label">Our view · Opinion</p>
<p>The owner of swampforce.com believes these cases were <strong>lawfare</strong> — civil, criminal, and ballot processes used to hobble Donald Trump’s campaign.
That is an opinion about motive. It is stated here so it is not confused with the court record above.</p></section>
"""
    return page("Lawfare · Swamp Force", "Verified lawfare docket tracker.", "lawfare.html", body), len(cases)


def build_scorecard(verified: list[dict]) -> tuple[str, int]:
    by_page = defaultdict(list)
    for r in verified:
        if r["Page"].startswith("Scorecard") and r["Verdict"] in OK:
            by_page[r["Page"]].append(r)
    total_v = sum(len(v) for v in by_page.values())
    # all scorecard pages seen in audit (verified or not)
    all_pages = sorted({r["Page"] for r in verified if r["Page"].startswith("Scorecard")})

    def module_html(page_key: str) -> str:
        items = by_page.get(page_key) or []
        label = page_key.replace("Scorecard · ", "").replace("Scorecard · ", "")
        if not items:
            return f'<section class="score-mod under"><h2>{e(label)}</h2><p><strong>Under review.</strong> Checkpoint figures for this module are not yet verified.</p></section>'
        rows = []
        for it in items:
            claim, truth = parse_claim_truth(it.get("Text") or "")
            url = (it.get("Best_Source_URL") or "").strip()
            link = f' <a href="{e(url)}" target="_blank" rel="noopener">source</a>' if url else ""
            rows.append(f'<div class="score-item"><div><strong>{e(claim)}</strong></div>'
                        f'{f"<div style=color:#166534>{e(truth)}</div>" if truth else ""}'
                        f'<div style="font-size:.8rem;color:#666">{e(it["Verdict"])}{link}</div></div>')
        return f'<section class="score-mod"><h2>{e(label)} · {len(items)} verified</h2>{"".join(rows)}</section>'

    panels = []
    for rid, label, dek in SCORE_TABS:
        pages = ROOM_PAGES.get(rid, [])
        # also include any verified pages not mapped
        mods = [module_html(p) for p in pages]
        # add verified pages that match room loosely and weren't listed
        panels.append(f'<div class="tab-panel{" active" if rid=="gop" else ""}" id="tab-{rid}">'
                      f'<p class="lede">{e(dek)}</p>{"".join(mods) if mods else "<p>Under review.</p>"}</div>')

    # Orphan verified modules not in any room list
    mapped = {p for ps in ROOM_PAGES.values() for p in ps}
    orphans = [p for p in by_page if p not in mapped]
    orphan_html = "".join(module_html(p) for p in orphans)

    tabs = "".join(
        f'<button type="button" data-tab="tab-{rid}" class="{"active" if rid=="gop" else ""}">{e(label)}</button>'
        for rid, label, _ in SCORE_TABS
    )
    body = f"""
<header class="page-hero">
  <p class="section-label">Midterm scorecard · SCORE_UPDATED checkpoint</p>
  <h1>Scorecard</h1>
  <p class="lede">Rooms from the checkpoint (GOP / Dem / Split / Oval / Compare).
  Only audit-Verified figures are printed. Everything else is Under review.</p>
</header>
<div class="uc">{total_v} verified scorecard figures included. Unverified modules show Under review — no invented numbers.</div>
<div class="tabs">{tabs}</div>
{"".join(panels)}
<section class="panel"><h2>Other verified modules</h2>{orphan_html or "<p>None.</p>"}</section>
<details class="panel"><summary>All scorecard pages in audit ({len(all_pages)})</summary>
<ul>{"".join(f"<li>{e(p)} — {len(by_page.get(p, []))} verified</li>" for p in all_pages)}</ul></details>
"""
    return page("Scorecard · Swamp Force", "Checkpoint scorecard rooms; verified figures only.", "scorecard.html", body), total_v


def build_explainer() -> str:
    text = (TS / "page-header.txt").read_text(encoding="utf-8")
    title_re = re.compile(r"^(" + "|".join(re.escape(t) for t in EXPLAINER_TITLES) + r")\s*$", re.M)
    parts = title_re.split(text)
    sections = []
    toc = []
    i = 1
    while i < len(parts):
        raw = parts[i].strip()
        body = parts[i + 1] if i + 1 < len(parts) else ""
        i += 2
        nice = EXPLAINER_TITLES.get(raw, raw.title())
        sid = re.sub(r"[^a-z0-9]+", "-", nice.lower()).strip("-")
        toc.append(f'<li><a href="#{sid}">{e(nice)}</a></li>')
        chunks = re.split(r"(Our view:\s*)", body)
        html_parts = []
        j = 0
        while j < len(chunks):
            chunk = chunks[j]
            if chunk.strip().startswith("Our view:"):
                j += 1
                opin = (chunks[j] if j < len(chunks) else "").strip()
                html_parts.append(
                    f'<div class="opinion"><p class="opinion-label">Our view · Opinion</p>'
                    f'<p>{e(opin).replace(chr(10)+chr(10), "</p><p>")}</p></div>'
                )
            else:
                for block in re.split(r"\n\n+", chunk.strip()):
                    block = block.strip()
                    if not block:
                        continue
                    if block.startswith("- "):
                        items = "".join(f"<li>{e(line[2:])}</li>" for line in block.split("\n") if line.startswith("- "))
                        html_parts.append(f"<ul>{items}</ul>")
                    else:
                        html_parts.append(f"<p>{e(block).replace(chr(10), '<br>')}</p>")
            j += 1
        sections.append(f'<section class="explainer-section" id="{sid}"><h2>{e(nice)}</h2>{"".join(html_parts)}</section>')
    body = f"""
<header class="page-hero"><p class="section-label">Explainer</p>
<h1>How a narrative is built</h1>
<p class="lede">Psychology, methods, incentives. Opinion blocks labeled.</p></header>
<nav class="toc"><strong>On this page</strong><ol>{"".join(toc)}</ol></nav>
{"".join(sections)}
"""
    return page("Explainer · Swamp Force", "How a narrative is built.", "explainer.html", body)


def build_foreword() -> str:
    body = """
<header class="page-hero"><p class="section-label">Foreword</p>
<h1>Foreword</h1>
<p class="lede">Editorial frame for the Swamp Force journal — from the checkpoint masthead.</p></header>
<section class="panel">
<p>The people are the employer. This journal prints the official record. No network. No manufactured drama.</p>
<p>Government sources only. Compare the action to the speech. That is the first step.</p>
<p><strong>Vote the file. Not the feeling.</strong></p>
</section>
<div class="opinion"><p class="opinion-label">Opinion</p>
<p>This foreword is the site owner's framing for why the journal exists. Case evidence lives on Fake News, ledgers, Lawfare, and the Scorecard — with sources.</p></div>
"""
    return page("Foreword · Swamp Force", "Editorial frame for Swamp Force.", "foreword.html", body)


def build_pump() -> str:
    body = """
<header class="page-hero"><p class="section-label">Pump</p>
<h1>Pump — Charts vs Read</h1>
<p class="lede">Checkpoint pump.ts (EIA / FRED gas funnel). Charts and Read hashes.</p></header>
<div class="uc">Pump numeric series remain under audit. No invented EIA/FRED figures on this page yet.</div>
<div class="tabs">
  <button type="button" class="active" data-tab="tab-charts">Charts</button>
  <button type="button" data-tab="tab-read">Read</button>
</div>
<div class="tab-panel active" id="tab-charts"><div class="placeholder"><h2>Charts — under review</h2>
<p>Verified pump figures will render here after the audit clears pump.ts series.</p></div></div>
<div class="tab-panel" id="tab-read"><div class="panel"><h2>Read</h2>
<p>Narrative companion to the pump charts. Pending verified copy from the checkpoint.</p></div></div>
"""
    return page("Pump · Swamp Force", "Pump charts vs read — under review.", "pump.html", body)


def build_store() -> str:
    body = """
<header class="page-hero"><p class="section-label">Store</p>
<h1>Swamp Force Store</h1>
<p class="lede">Official merch via Printify Pop-Up. Checkout stays on Printify.
No products or prices are listed on this page until the pop-up URL is set.</p></header>
<div id="store-placeholder" class="placeholder">
  <h2>Shop opens soon</h2>
  <p>Set <code>PRINTIFY_POPUP_URL</code> in <code>assets/store.js</code> to your Printify Pop-Up URL.
  Until then, this page shows no products and no prices.</p>
  <p><a class="btn" href="index.html">Back to home</a></p>
</div>
<div id="store-live" hidden>
  <p>You will check out on Printify’s secure pop-up.</p>
  <p><a class="btn secondary" id="store-open-btn" href="#" target="_blank" rel="noopener">Open Swamp Force shop</a></p>
</div>
"""
    return page("Store · Swamp Force", "Swamp Force merch via Printify Pop-Up.", "store.html", body, extra_js="assets/store.js")


def build_brief(st: dict) -> str:
    body = f"""
<header class="page-hero"><h1>Lawmakers' brief</h1>
<p class="lede">Two-page brief + evidence appendix from the {st['total']}-case record.</p></header>
<section class="panel"><h2>Documented Deception of American Voters</h2>
<p>Based on {st['total']} cases ({st['first']} first term; {st['later']} later / second term).
Proven false {st['proven']}; Rated misleading {st['misleading']}.
Official record {st['official']}; Never corrected by original pusher {st['never']}.</p></section>
<div class="dl-grid">
  <div class="dl-item"><h3>Policy brief (PDF)</h3><p>Two-page brief. September 2026.</p>
    <a class="btn" href="docs/swampforce-brief.pdf">Download brief</a></div>
  <div class="dl-item"><h3>Evidence appendix (PDF)</h3><p>Full case-by-case evidence.</p>
    <a class="btn secondary" href="docs/swampforce-evidence-appendix.pdf">Download appendix</a></div>
</div>
"""
    return page("Brief · Swamp Force", "Lawmakers brief and appendix.", "brief.html", body)


def build_downloads(st: dict) -> str:
    body = f"""
<header class="page-hero"><h1>Downloads</h1>
<p class="lede">Catalog spreadsheets, lawfare package, brief PDFs.</p></header>
<section class="panel"><h2>Case catalog</h2><div class="dl-grid">
  <div class="dl-item"><h3>First term ({st['first']})</h3>
    <a class="btn" href="downloads/first-term-trump-admin-media-deception.csv">CSV</a>
    <a class="btn" href="downloads/first-term-trump-admin-media-deception.xlsx">Excel</a>
    <a class="btn secondary" href="downloads/first-term-media-deception.zip">ZIP</a></div>
  <div class="dl-item"><h3>Later / second ({st['later']})</h3>
    <a class="btn" href="downloads/later-second-term-trump-admin-media-deception.csv">CSV</a>
    <a class="btn" href="downloads/later-second-term-trump-admin-media-deception.xlsx">Excel</a>
    <a class="btn secondary" href="downloads/later-second-term-media-deception.zip">ZIP</a></div>
</div></section>
<section class="panel"><h2>Lawfare</h2><div class="dl-grid">
  <div class="dl-item"><h3>Tracker</h3>
    <a class="btn" href="downloads/lawfare-docket-tracker.csv">CSV</a>
    <a class="btn" href="downloads/lawfare-docket-tracker.xlsx">Excel</a>
    <a class="btn" href="downloads/lawfare-rulings.csv">Rulings</a>
    <a class="btn secondary" href="downloads/lawfare-tracker.pdf">PDF</a></div>
</div></section>
<section class="panel"><h2>Brief</h2>
  <a class="btn" href="docs/swampforce-brief.pdf">Brief PDF</a>
  <a class="btn secondary" href="docs/swampforce-evidence-appendix.pdf">Appendix PDF</a>
</section>
"""
    return page("Downloads · Swamp Force", "CSV, Excel, PDF downloads.", "downloads.html", body)


def build_about(st: dict) -> str:
    body = f"""
<header class="page-hero"><h1>About &amp; methodology</h1>
<p class="lede">Inclusion rules, evidence ranks, and how this Phase A rebuild maps to the checkpoint.</p></header>
<section class="panel"><h2>Inclusion (Fake News catalog)</h2>
<ul>
<li>Claim about President Trump or his administration, unfavorable to him or them.</li>
<li><strong>Proven false</strong> — correction, retraction, settlement, court/DOJ/IG/FEC finding, or major fact-checker False / Mostly False / Pants on Fire / Four Pinocchios.</li>
<li><strong>Rated misleading</strong> — misleading / missing context / Three Pinocchios (or equivalent).</li>
<li>Unproven claims excluded. Opinion labeled.</li>
</ul></section>
<section class="panel"><h2>Party ledgers &amp; scorecard</h2>
<ul>
<li>Dem/GOP pages: checkpoint ledger rows only when audit = Verified or Verified with correction needed.</li>
<li>Duplicates of catalog cases are short-linked.</li>
<li>Scorecard: verified figures only; else Under review.</li>
</ul>
<p style="font-family:var(--sans);font-size:.92rem">Current catalog: {st['total']} cases · Proven false {st['proven']} · Official record {st['official']} · Never corrected by pusher {st['never']}.</p>
</section>
<section class="panel"><h2>Blueprint</h2>
<p>Static rebuild of GitHub <code>ksshort65/swampforce</code> @ <code>c60dc5d</code> (Sep 23, 2026 10:01 PM MT).
Not the broken midterm-only Grok Build landing page.</p></section>
"""
    return page("About · Swamp Force", "Methodology.", "about.html", body)


def build_pending() -> str:
    # Do not add candidates to catalog — list only
    path = AUDIT / "candidates-ready.md"
    note = path.read_text(encoding="utf-8") if path.exists() else "See checkpoint-review/candidates-ready.md"
    # Keep as preformatted summary without inventing
    body = f"""
<header class="page-hero"><h1>Pending review</h1>
<p class="lede">Seven catalog candidates are ready for user approval. They are <strong>not</strong> in the live catalog yet.</p></header>
<div class="uc">Do not treat these as published Fake News rows until approved.</div>
<section class="panel"><pre style="white-space:pre-wrap;font-family:var(--sans);font-size:.85rem">{e(note[:6000])}</pre></section>
"""
    return page("Pending review · Swamp Force", "Catalog candidates awaiting approval.", "pending.html", body)


def write_sitemap(meta: dict) -> None:
    text = f"""# Swamp Force from-checkpoint — SITE MAP

Blueprint: GitHub ksshort65/swampforce @ c60dc5d (Sep 23, 2026 10:01 PM MT).
IA: `checkpoint-review/site-idea.md`. This is **not** the broken live midterm-only Grok Build page.

## Nav (checkpoint + ship extras)

| Control | Page | Status |
|---------|------|--------|
| Home / cover + kicker | index.html | Live |
| The Republic | republic.html | Hub stub (essays pending verified) |
| Fake News Exposed | fake-news.html | Live — **{meta['catalog']}** catalog cases |
| Democrats | democrats.html | Live — {meta['dem_full']} full + {meta['dem_short']} short; skipped {meta['dem_skip']} |
| Republicans | republicans.html | Live — {meta['gop_full']} full + {meta['gop_short']} short; skipped {meta['gop_skip']} |
| Congress | congress.html | Hub stub |
| The Border | border.html | Hub stub |
| The Remedy | remedy.html | Hub stub |
| J6 | january-6.html | Live — verified items + careful §2383 note |
| Scorecard | scorecard.html | Live rooms; **{meta['score_verified']}** verified figures; rest Under review |
| Pump | pump.html | Skeleton (Charts/Read) — numbers under review |
| Foreword | foreword.html | Live (masthead frame) |
| Lawfare | lawfare.html | Live — **{meta['lawfare']}** dockets |
| Explainer | explainer.html | Live from page-header.txt |
| Brief | brief.html + docs/ | Live |
| Store | store.html | Live — PRINTIFY_POPUP_URL empty → Shop opens soon |
| Downloads | downloads.html | Live |
| About | about.html | Live |
| Pending candidates | pending.html | Listed only — **not** in catalog |

## Hard rules
- No invented stats/quotes/sources
- term-split CSVs not edited
- /workspace/site/ not touched
- Opinion only in labeled blocks
- Dedup Fake News ↔ party pages via short links

## Store hook
Edit `public_html/assets/store.js`:
```js
var PRINTIFY_POPUP_URL = "https://…";
```

## Still pending
1. Paste Printify Pop-Up URL
2. Clear remaining scorecard / pump / dispatch essays through audit
3. User approve 7 catalog candidates before merge
4. Epstein July 2025 memo archive before promoting those rows
5. Selective dispatch essays once Verified
"""
    (SITE / "SITE-MAP.md").write_text(text, encoding="utf-8")


def ensure_assets() -> None:
    (OUT / "assets").mkdir(parents=True, exist_ok=True)
    (OUT / "data").mkdir(exist_ok=True)
    (OUT / "docs").mkdir(exist_ok=True)
    (OUT / "downloads").mkdir(exist_ok=True)
    for name in ["swampforce-brief.pdf", "swampforce-evidence-appendix.pdf"]:
        src = BRIEF / name
        if src.exists():
            shutil.copy2(src, OUT / "docs" / name)
    # appendix may be named differently
    alt = BRIEF / "swampforce-evidence-appendix.pdf"
    if not (OUT / "docs" / "swampforce-evidence-appendix.pdf").exists() and alt.exists():
        shutil.copy2(alt, OUT / "docs" / "swampforce-evidence-appendix.pdf")
    for name in [
        "first-term-trump-admin-media-deception.csv",
        "first-term-trump-admin-media-deception.xlsx",
        "later-second-term-trump-admin-media-deception.csv",
        "later-second-term-trump-admin-media-deception.xlsx",
    ]:
        src = TS / name
        if src.exists():
            shutil.copy2(src, OUT / "downloads" / name)
    for name in [
        "lawfare-docket-tracker.csv", "lawfare-docket-tracker.xlsx",
        "lawfare-rulings.csv", "lawfare-tracker.pdf", "README.txt",
    ]:
        src = LAW / name
        if src.exists():
            shutil.copy2(src, OUT / "downloads" / name)
    for stem, files in [
        ("first-term-media-deception", [
            "first-term-trump-admin-media-deception.csv",
            "first-term-trump-admin-media-deception.xlsx",
        ]),
        ("later-second-term-media-deception", [
            "later-second-term-trump-admin-media-deception.csv",
            "later-second-term-trump-admin-media-deception.xlsx",
        ]),
    ]:
        zpath = OUT / "downloads" / f"{stem}.zip"
        with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
            for f in files:
                fp = OUT / "downloads" / f
                if fp.exists():
                    z.write(fp, f)


def make_zip() -> int:
    if ZIP.exists():
        ZIP.unlink()
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for path in sorted(OUT.rglob("*")):
            if path.is_file():
                z.write(path, path.relative_to(OUT))
    return ZIP.stat().st_size


def main() -> None:
    ensure_assets()
    cases = load_catalog()
    verified = load_verified()
    st = stats(cases)
    catalog_ids = {c["id"] for c in cases}

    dem_html, dem_c = build_party("Democrats", "Democrats Ledger", verified, catalog_ids, "democrats.html")
    gop_html, gop_c = build_party("Republicans", "Republicans Ledger", verified, catalog_ids, "republicans.html")
    law_html, law_n = build_lawfare()
    score_html, score_n = build_scorecard(verified)

    pages = {
        "index.html": build_home(st, dem_c["verified"], gop_c["verified"], law_n, score_n),
        "fake-news.html": build_fake_news(cases, st),
        "democrats.html": dem_html,
        "republicans.html": gop_html,
        "january-6.html": build_j6(verified, cases),
        "lawfare.html": law_html,
        "scorecard.html": score_html,
        "explainer.html": build_explainer(),
        "foreword.html": build_foreword(),
        "pump.html": build_pump(),
        "brief.html": build_brief(st),
        "downloads.html": build_downloads(st),
        "about.html": build_about(st),
        "store.html": build_store(),
        "pending.html": build_pending(),
        "republic.html": build_series_stub("The Republic", "republic.html", "They forgot who they work for.",
            "Dispatch essays under audit — hub only for Phase A."),
        "congress.html": build_series_stub("Congress", "congress.html", "Purse, recess, unread bills.",
            "Congress dispatch essays pending verified extraction."),
        "border.html": build_series_stub("The Border", "border.html", "Encounters, FEMA, missing children.",
            "Border essays pending verified extraction; see Scorecard border modules for verified figures."),
        "remedy.html": build_series_stub("The Remedy", "remedy.html", "Judges and the statute.",
            "Remedy essays pending verified extraction."),
    }
    for name, content in pages.items():
        (OUT / name).write_text(content, encoding="utf-8")
        print("wrote", name, len(content))

    (OUT / "data" / "cases.json").write_text(
        json.dumps([{k: c[k] for k in ("id", "claim", "evidence", "proof", "method", "term", "truth_url", "primary", "notes", "who")} for c in cases],
                   ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    meta = {
        "catalog": st["total"],
        "dem_full": dem_c["full"], "dem_short": dem_c["short"], "dem_skip": dem_c["skipped"],
        "gop_full": gop_c["full"], "gop_short": gop_c["short"], "gop_skip": gop_c["skipped"],
        "lawfare": law_n, "score_verified": score_n,
    }
    write_sitemap(meta)
    size = make_zip()
    summary = {"pages": list(pages), "meta": meta, "zip": str(ZIP), "zip_bytes": size, "stats": st}
    (SITE / "build-summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
