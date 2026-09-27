"""'Unverified claims, accusations and deceptions' page: the catalog cases still being checked, grouped by who pushed them,
plus SuperGrok research leads not already in the catalog. Uses only existing data."""
import re
GROUPS = ["Republican", "Democratic", "News outlets", "Campaigns", "Social media"]
DEM = r"harris|biden|obama|favreau|villaraigosa|pelosi|schiff|newsom|democrat|\(d-|, d-|sen\. (chuck )?schumer|clinton|warren|sanders|aoc|ocasio|swalwell|nadler|waters|hochul|walz|pritzker|whitmer|jean-pierre|psaki|kirby|mayorkas|garland|fauci|karine|jeffries|klain|buttigieg|booker|howard dean|schumer|durbin|el-sayed|carville|baldwin|jayapal|goldman"
REP = r"^donald trump|^sean spicer|^kash patel|republican|\(r-|, r-|gop|trump campaign|mcconnell|mccarthy|johnson \(r|desantis|vance|rnc"
CAMP = r"campaign|super pac|\bpac\b|\bad\b|advert"
SOC = r"viral|brian tyler cohen|threads|social (media|post)|tiktok|facebook|instagram|reddit|influencer|x user|twitter user|activist"
def group(who):
    w = re.split(r";| and other| \(and ", (who or "").lower())[0]  # the first-named source decides the group
    if re.search(CAMP, w) and not re.search(r"campaign reporter|on the campaign", w): return "Campaigns"
    if re.search(r"^(the )?(washington post|new york times|cnn|nbc|abc|cbs|msnbc|reuters|associated press|bloomberg|time\b)", w): return "News outlets"
    if re.search(SOC, w): return "Social media"
    if re.search(r"^paramount|harpercollins", w): return "News outlets"
    if re.search(DEM, w): return "Democratic"
    if re.search(REP, w): return "Republican"
    return "News outlets"

import json, html as _h
from pathlib import Path
e = lambda s: _h.escape(s or "", quote=True)
CAPTION = "Not yet proven, but already out there shaping public opinion."
TITLE = "Not Yet Verified"
RAW = Path("/workspace/_project-state/supergrok-2025-26-raw.md")
SLUG = {"Republican": "rep", "Democratic": "dem", "News outlets": "news", "Campaigns": "camp", "Social media": "social"}

def catalog_items(cases):
    return [c for c in cases if c["status"] != "Verified by SwampForce"]

def leads(cases):
    """SuperGrok 2025-26 batch (pasted Sep 26, 2026) plus one lead from the Sep 25 notes; dropped if already in the catalog."""
    cl = " ".join(((c.get("claim") or "") + " " + (c.get("notes") or "")).lower() for c in cases)
    out = []
    gmap = {"R": "Republican", "D": "Democratic", "Outlets": "News outlets"}
    for line in RAW.read_text(encoding="utf-8").splitlines()[1:]:
        if ":" not in line: continue
        g, body = line.split(":", 1)
        for it in [s.strip().rstrip(".") for s in body.split(";") if s.strip()]:
            q = re.findall(r'"([^"]+)"', it); key = (q[0] if q else it.split("(")[0]).lower().strip()
            if key and key in cl:
                continue  # already in the 252-case catalog
            out.append((gmap[g.strip()], it))
    out.append(("Republican", "FBI Director Patel, Sep 15, 2026: FBI \u201cstopped 1,100 criminal perpetrators\u201d from terrorist attacks (written statement: 1,097 disruptions)"))
    return out

def _bars(cat, ld, prefix="", ver=None):
    ver = ver or {}
    mx = max([ver.get(g, 0) for g in GROUPS] + [cat.get(g, 0) for g in GROUPS] + [ld.get(g, 0) for g in GROUPS] + [1])
    rows = []
    for g in GROUPS:
        a, b = cat.get(g, 0), ld.get(g, 0)
        v = ver.get(g, 0)
        rows.append(f'<div class="uv-row"><span class="uv-lbl">{e(g)}</span><div class="uv-bars">'
                    f'<a class="uv-bar uv-ver" href="fake-news.html" style="width:{max(v / mx * 100, 1.5):.1f}%" title="{v} proven false/misleading: debunked, record on the Fake News page"><b>{v}</b></a>'
                    f'<a class="uv-bar uv-cat" href="{prefix}#uv-{SLUG[g]}" style="width:{max(a / mx * 100, 1.5):.1f}%" title="{a} not yet verified (still out there), in the catalog"><b>{a}</b></a>'
                    f'<a class="uv-bar uv-lead" href="{prefix}#uv-leads-{SLUG[g]}" style="width:{max(b / mx * 100, 1.5):.1f}%" title="{b} not yet verified (still out there), found by our research"><b>{b}</b></a></div></div>')
    return (f'<div class="chart-card uv-card"><h3>{e(TITLE)}</h3><p class="sub">{e(CAPTION)}</p>'
            f'<p class="uv-key"><span class="uv-sw uv-ver"></span> Proven false/misleading, with the record ({sum(ver.values())}) <span class="uv-sw uv-cat"></span> Not yet verified (still out there), in the catalog ({sum(cat.values())}) '
            f'<span class="uv-sw uv-lead"></span> Not yet verified (still out there), found by our research ({sum(ld.values())})</p>{"".join(rows)}'
            f'<p class="tap-hint">Tap a bar to see those items. Debunked claims link to the record; every other item is labeled Not yet verified.</p></div>')

def counts(cases):
    from collections import Counter
    return Counter(group(c["who"]) for c in catalog_items(cases)), Counter(g for g, _, _ in all_leads(cases)[0])

def ver_counts(cases):
    from collections import Counter
    return Counter(group(c["who"]) for c in cases if str(c.get("status", "")).lower().startswith("verified"))

def home_block(cases):
    cat, ld = counts(cases)
    return f'<a class="chart-link" href="unverified.html" style="display:block;color:inherit;text-decoration:none;margin-bottom:12px">{_bars(cat, ld, "unverified.html", ver_counts(cases))}</a>'.replace('<a class="uv-bar', '<span class="uv-bar').replace('</b></a>', '</b></span>')

def body(cases):
    cat, ld = counts(cases)
    items = catalog_items(cases); lds = [(g, t) for g, t, _ in all_leads(cases)[0]]; rv = all_leads(cases)[1]; alt = all_leads(cases)[2]
    sec = []
    for g in GROUPS:
        its = [c for c in items if group(c["who"]) == g]
        li = "".join(f'<li><span class="uv-nv">Not yet verified (still out there)</span> <a href="fake-news.html#case-{c["id"]}">{e(c["claim"])}</a> <span class="muted">— {e(c["who"])}</span></li>' for c in its)
        sec.append(f'<h3 class="strip-h" id="uv-{SLUG[g]}">{e(g)}: {len(its)} in the catalog</h3>' +
                   (f'<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See all {len(its)}</span><span class="sf-opened">Hide the list</span></summary><ul class="uv-list">{li}</ul></details>' if its else '<p class="muted">None in the catalog.</p>'))
    lsec = []
    for g in GROUPS:
        its = [t for gg, t in lds if gg == g]
        li = "".join(f'<li><span class="uv-nv">Not yet verified (still out there)</span> {e(t)}</li>' for t in its)
        lsec.append(f'<h3 class="strip-h" id="uv-leads-{SLUG[g]}">{e(g)}: {len(its)} found by our research</h3>' +
                    (f'<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See all {len(its)}</span><span class="sf-opened">Hide the list</span></summary><ul class="uv-list">{li}</ul></details>' if its else '<p class="muted">None yet.</p>'))
    top, _n = nyv_top(cases)
    return f"""<section class="band-hero"><div class="wrap"><p class="hero-kicker">Still being checked</p><h1>{e(TITLE)}</h1><p class="dek">{e(CAPTION)}</p></div></section>
<div class="wrap">{top}
<p class="period-note">Grouped by the first-named source. Catalog claims still being checked, research leads, claims reviewed and not tied to a primary record (formerly the Unsupported claims page; <a href="downloads/unsupported-claims.csv">CSV</a>), and items flagged on other pages. None has passed our check yet.</p>
{period_block(cases)}
<p class="fact-line">Media claims, one-sided checking, the Social Media Weapon and altered quotes: <a href="betrayal.html#betrayal-charts">The Great American Betrayal →</a></p>
</div>"""

# ---- all saved SuperGrok verification batches (Sep 26, 2026) ----
PS = Path("/workspace/_project-state")
BATCHES = ["verify-2015-16-block.md", "verify-2017-20-block.md", "verify-2021-24-block.md", "verify-2025-26-block.md", "verify-overnight-2026-09-26.md"]
PERIODS = ["2015–16", "2017–18", "2019–20", "2021–22", "2023–24", "2025–26"]
_R = r"\b(trump|vance|patel|hegseth|noem|leavitt|spicer|nunes|gingrich|gop|republican|rnc|bondi|rubio|musk)\b"

def _grp(who):
    w = who.lower()
    if re.search(r"\b(fox|cnn|msnbc|nbc|abc|cbs|nyt|new york times|washington post|ap|reuters|politico|newsweek)\b", w): return "News outlets"
    if re.search(_R, w): return "Republican"
    if re.search(DEM, w): return "Democratic"
    return group(who)

def period(text, default=None):
    m = re.search(r"\b(20(1[5-9]|2[0-6]))\b", text) or re.search(r"\b\d{1,2}/\d{1,2}/(20(1[5-9]|2[0-6]))\b", text)
    y = int(m.group(1)) if m else default
    if not y: return None
    return PERIODS[min(max((y - 2015) // 2, 0), 5)]

def batch_items():
    """(who, text, verdict, default_year) from every saved batch, parsed per file format."""
    out = []
    for f in BATCHES:
        p = PS / f
        if not p.exists(): continue
        t = p.read_text(encoding="utf-8"); dy = {"verify-2015-16-block.md": 2015, "verify-2017-20-block.md": 2017, "verify-2021-24-block.md": 2021}.get(f, 2025)
        if f == "verify-2015-16-block.md":
            for m in re.finditer(r"^## \d+\. (.+?)\n.*?\*\*Verdict: ([^*]+)\*\*(.*?)(?=^## |\Z)", t, re.S | re.M):
                q = re.search(r"\*\*Quote found:\*\* (“[^”]+”)", m.group(3))
                out.append((m.group(1).split("—")[0].strip(), m.group(1) + (": " + q.group(1) if q else ""), m.group(2), dy))
        elif f == "verify-overnight-2026-09-26.md":
            for m in re.finditer(r"^- (R\d+(?:\+R\d+)? .+?) — ((?:HOLD|NEEDS)[^\n]*)", t, re.M):
                who = re.sub(r"^R\d+(?:\+R\d+)? ", "", m.group(1))
                out.append((who.split(" ")[0].split("/")[0], who, m.group(2), dy))
        else:
            for line in t.splitlines():
                c = [x.strip() for x in line.split("|")]
                if len(c) < 4 or not re.search(r"VERIFIED|HOLD|NEEDS|WRONG|FALSE|MISLEADING", c[2]) or c[1].startswith("Case"): continue
                first = re.sub(r"^\d+\.\s*", "", c[1])
                if not re.search(r"[A-Z][a-z]+", first) or re.search(r"^(GAO|OMB|CBO)\b", first): continue
                who = re.split(r"[,:]", first)[0]
                quote = c[3] if len(c) > 3 else ""
                out.append((who, first + (": " + quote[:220] if quote.startswith("“") or quote.startswith('"') else ""), c[2].replace("**", ""), dy))
    return out

def batch_leads(cases):
    """Deduped against the catalog, the 2025-26 raw leads and each other. Returns (not_yet, research_verified)."""
    cl = " ".join(((c.get("claim") or "") + " " + (c.get("notes") or "")).lower() for c in cases)
    raw = " ".join(t.lower() for _, t in leads(cases))
    seen, nyv, rv = set(), [], []
    for who, text, verdict, dy in batch_items():
        q = re.findall(r"[“\"]([^”\"]{12,})[”\"]", text)
        key = (q[0] if q else text).lower().strip()[:60]
        k2 = re.sub(r"[^a-z0-9]", "", key)
        if not k2 or k2 in seen or key in cl or key in raw: continue
        seen.add(k2)
        item = (_grp(who), text, period(text, dy))
        (rv if re.match(r"\s*(VERIFIED(?!-RECORD, NEEDS)|WRONG)", verdict) else nyv).append(item)
    return nyv, rv

_AL = {}
def all_leads(cases):
    k = len(cases)
    if k in _AL: return _AL[k]
    nyv, rv = batch_leads(cases)
    base = [(g, t, period(t, 2025)) for g, t in leads(cases)] + nyv
    taken = [t for _, t, _ in base] + [t for _, t, _ in rv]
    sh = share_leads(cases, taken)
    _AL[k] = (base + [(g, t, p) for g, t, p, kind in sh if kind != "altered"], rv, [(g, t, p) for g, t, p, kind in sh if kind == "altered"])
    return _AL[k]

def period_block(cases):
    from collections import Counter
    lds = all_leads(cases)[0]
    pc = Counter(period((c.get("claim") or "") + " " + (c.get("notes") or "")) or "Undated" for c in catalog_items(cases))
    pl = Counter(p or "Undated" for _, _, p in lds)
    keys = PERIODS + (["Undated"] if pc.get("Undated") or pl.get("Undated") else [])
    mx = max([pc.get(k, 0) + pl.get(k, 0) for k in keys] + [1]); rows = []
    for k in keys:
        a, b = pc.get(k, 0), pl.get(k, 0)
        rows.append(f'<div class="uv-row"><span class="uv-lbl">{e(k)}</span><div class="uv-bars" style="flex-direction:row;gap:0">'
                    f'<a class="uv-bar uv-cat" href="#uv-dem" style="width:{max(a / mx * 100, 1.5):.1f}%;border-radius:5px 0 0 5px" title="{a} not yet verified, in the catalog"><b>{a}</b></a>'
                    f'<a class="uv-bar uv-lead" href="#uv-leads" style="width:{max(b / mx * 100, 1.5):.1f}%;border-radius:0 5px 5px 0" title="{b} not yet verified, research leads"><b>{b}</b></a></div></div>')
    return (f'<div class="chart-card uv-card"><h3>Not yet verified, by two-year period</h3><p class="sub">Year taken from the claim or its notes; items with no year in the text are counted as undated.</p>'
            f'<p class="uv-key"><span class="uv-sw uv-cat"></span> In the catalog <span class="uv-sw uv-lead"></span> Research leads</p>{"".join(rows)}</div>')

# ---- the owner's full SuperGrok conversation (share-5064108b, saved Sep 26, 2026) ----
SHARE = Path("/workspace/_grok-share2/share-5064108b.md")
SEG = [(200, "2015–16"), (315, "2017–18"), (359, "2019–20"), (435, "2021–22"), (477, "2023–24"), (555, "2025–26"), (731, "onair"), (975, "altered"), (1124, None)]

def share_items():
    """(group, text, period, kind) for every case SuperGrok listed: per-period lists, 'Needs a link' items, named on-air cases, altered quotes."""
    if not SHARE.exists(): return []
    L = SHARE.read_text(encoding="utf-8").splitlines(); out = []; grp = None
    for i, l in enumerate(L):
        seg = None
        for (a, s), (b, _) in zip(SEG, SEG[1:]):
            if a <= i < b: seg = s
        if not seg: continue
        if l.startswith("#"):
            h = l.lower()
            grp = ("Republican" if "republican" in h else "Democratic" if "democratic" in h else
                   "News outlets" if re.search(r"news|network|host|anchor|outlet", h) else grp)
            continue
        kind = "altered" if seg == "altered" else "onair" if seg == "onair" else "period"
        if l.startswith("Needs a link"):
            if l.startswith("Needs a link:") or "(not counted" in l:
                out.append((grp or "News outlets", l.split(":", 1)[1].strip()[:260], seg if seg[0] == "2" else None, "needs-link"))
            continue
        m = re.match(r"^(\d+\.\s+)?([A-Z][\w.’'&/ -]{1,60}?)[ ,].{0,140}?(\((R|D|Republican|Democratic|Democrat)\b|Date:|Network/show:|Outlet:)", l)
        if not m: continue
        who = m.group(2).strip()
        g = grp or "News outlets"
        if re.search(r"\((R|Republican)\b", l[:120]): g = "Republican"
        elif re.search(r"\((D|Democratic|Democrat)\b", l[:120]): g = "Democratic"
        per = seg if seg[0] == "2" else period(l, 2025)
        out.append((g, re.sub(r"^\d+\.\s+", "", l)[:300], per, kind))
    return out

def share_leads(cases, taken):
    """Deduped against the catalog, the verify-* batches, the raw 2025-26 list and each other."""
    cl = " ".join(((c.get("claim") or "") + " " + (c.get("notes") or "")).lower() for c in cases)
    def keyset(t):
        q = re.findall(r"[“\"]([^”\"]{14,})[”\"]", t)
        return [re.sub(r"[^a-z0-9]", "", x.lower())[:40] for x in q]
    tk = {k for t in taken for k in keyset(t)}
    norm_cl = re.sub(r"[^a-z0-9]", "", cl)
    out, seen = [], set()
    for g, t, p, kind in share_items():
        ks = keyset(t); base = re.sub(r"[^a-z0-9]", "", t.lower())[:70]
        if base in seen or any(k in tk or k in norm_cl for k in ks if len(k) >= 20): continue
        seen.add(base); tk |= set(ks); out.append((g, t, p, kind))
    return out

def altered_block(cases):
    from collections import Counter
    alt = all_leads(cases)[2]
    c = Counter({"News outlets": "Networks"}.get(g, g) for g, _, _ in alt)
    keys = ["Networks", "Democratic", "Republican"]; mx = max([c.get(k, 0) for k in keys] + [1])
    rows = "".join(f'<div class="uv-row"><span class="uv-lbl">{k}</span><div class="uv-bars"><a class="uv-bar uv-lead" href="#uv-altered" style="width:{max(c.get(k, 0) / mx * 100, 1.5):.1f}%" title="{c.get(k, 0)} altered-quote cases, not yet verified"><b>{c.get(k, 0)}</b></a></div></div>' for k in keys)
    return f'<div class="chart-card uv-card"><h3>Altered quotes</h3><p class="sub">Words changed, cut or rearranged so a person seemed to say something else. Not yet verified. Tap a bar for the list.</p>{rows}</div>'

def onesided_block():
    return ('<div class="chart-card uv-card" id="uv-one-sided"><h3>One-sided checking.</h3>'
            '<p class="sub"><b>Only one side is being checked. That gap shapes public opinion.</b> The Washington Post kept a full false-claim count only for Trump; we found no major fact-checker keeping a matching count of false claims made about him.</p>'
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
            '<a href="#uv-wapo" style="display:block;background:#0c2340;color:#fff;border-radius:10px;padding:14px;text-decoration:none"><div style="font-size:1.6rem;font-weight:800">30,573</div><div style="font-family:var(--sans);font-size:.8rem">Claims BY Trump counted (Washington Post)</div></a>'
            '<div style="background:#e5e7eb;color:#374151;border-radius:10px;padding:14px"><div style="font-size:1.6rem;font-weight:800">None found</div><div style="font-family:var(--sans);font-size:.8rem">Claims ABOUT Trump counted by major fact-checkers</div></div></div></div>')

def flawed_block():
    """Round 23, /workspace/_project-state/supergrok-leads-2026-09-25.md: DHS v. LWV (26A308), 11:40 AM–11:40 PM ET, Sep 25, 2026."""
    import json
    NV = '<span class="uv-nv">Not yet verified (SuperGrok sample)</span>'
    posts = [("Democracy Docket", "11:44 AM ET", "897,777 views", "https://x.com/DemocracyDocket/status/2103510843866423348"),
             ("Marc Elias", "11:48 AM ET", "426,517 views", "https://x.com/i/status/2103511976391606444"),
             ("Marc Elias (Texas post)", "4:23 PM ET", "no view count", "https://x.com/i/status/2103581122085224570"),
             ("Rep. Ilhan Omar", "3:41 PM ET", "452,005 views", "https://x.com/i/status/2103570490518323329"),
             ("@ncvpa", "Sep 25", "11 views", None)]
    li = "".join(f'<li>{NV} <b>{e(w)}</b> · {e(t)} · {e(v)}' + (f' · <a href="{u}" target="_blank" rel="noopener">Post ↗</a>' if u else " · link not given") + "</li>" for w, t, v, u in posts)
    spec = {"id": "chart-flawed", "type": "bar", "labels": ["Called the Court’s ruling “flawed”", "Called the SAVE database “flawed”"], "data": [0, 5],
            "colors": ["#94a3b8", "#b91c1c"], "fmt": "int", "hrefs": ["uv-flawed-list", "uv-flawed-list"]}
    return ('<div class="chart-card uv-card" id="uv-flawed"><h3>The Social Media Weapon: “flawed”</h3>'
            '<p class="sub">Posts on DHS v. LWV (26A308), 11:40 AM–11:40 PM ET, Sep 25, 2026. Not yet verified (SuperGrok sample). Tap a bar for the posts.</p>'
            '<div class="chart-wrap"><canvas id="chart-flawed" role="img" aria-label="Posts calling the ruling or the SAVE database flawed"></canvas></div>'
            '<p class="period-note"><b>Checked against the order:</b> Democracy Docket said the order lets the administration “initiate voter roll purges” (Elias: “registration purges”). '
            'The Court’s order says the NVRA’s 90-day moratorium “limits the potential impact” and allows “individualized inquiries”; the dissent says it is “too late for States to use SAVE for systematic voter-list maintenance” before the election.</p>'
            f'<details class="sf-fold" id="uv-flawed-list"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See the 5 posts</span><span class="sf-opened">Hide</span></summary><ul class="uv-list">{li}</ul></details>'
            f'<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec, ensure_ascii=False)}]);</script></div>')

def wapo_block():
    """Washington Post Fact Checker tally, shown separately; not part of any SwampForce or SuperGrok count."""
    import json
    spec = {"id": "chart-wapo-tally", "type": "bar", "labels": ["2017", "2018", "Late 2019", "Full term"], "data": [2000, 5700, 15000, 30573],
            "fmt": "int", "colors": ["#94a3b8"], "tips": [["About 2,000"], ["About 5,700"], ["15,000+"], ["30,573"]]}
    return ('<div class="chart-card uv-card" id="uv-wapo"><h3>Washington Post count of Trump false or misleading claims, not verified by SwampForce</h3>'
            '<p class="sub">Cumulative by year. The Post kept a full count only for Trump. Repeats count every time, so many entries are the same claim said again. Source: Washington Post Fact Checker. Not included in any count on this site.</p>'
            '<div class="chart-wrap"><canvas id="chart-wapo-tally" role="img" aria-label="Washington Post cumulative tally"></canvas></div></div>'
            f'<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec)}]);</script>')

NETS = [("CNN", r"\bcnn\b"), ("MSNBC", r"msnbc"), ("NBC", r"\bnbc\b"), ("ABC", r"\babc\b"), ("CBS", r"\bcbs\b"), ("Fox News", r"\bfox\b"),
        ("New York Times", r"new york times|\bnyt\b"), ("Washington Post", r"washington post"), ("AP", r"associated press|\bap\b"), ("Reuters", r"reuters"),
        ("Bloomberg", r"bloomberg"), ("Politico", r"politico"), ("NPR", r"\bnpr\b"), ("BuzzFeed", r"buzzfeed"), ("Newsweek", r"newsweek"), ("Time", r"\btime\b magazine|^time\b")]

def _net(t):
    t = t.lower()
    for n, rx in NETS:
        if re.search(rx, t): return n
    return None

def media_block(cases):
    from collections import Counter
    NO = "News outlets"
    ver = sum(1 for c in cases if str(c.get("status", "")).lower().startswith("verified") and group(c["who"]) == NO)
    cat = [c for c in catalog_items(cases) if group(c["who"]) == NO]
    lds, _, alt = all_leads(cases)
    ld = [t for g, t, _ in lds if g == NO]; al = [t for g, t, _ in alt if g == NO]
    bars = [("Proven false/misleading", ver, "uv-ver", "fake-news.html"), ("Not yet verified · catalog", len(cat), "uv-cat", "#uv-news"),
            ("Not yet verified · research leads", len(ld), "uv-lead", "#uv-leads-news"), ("Not yet verified · altered quotes", len(al), "uv-lead", "#uv-altered")]
    mx = max([b[1] for b in bars] + [1])
    rows = "".join(f'<div class="uv-row" style="grid-template-columns:210px 1fr"><span class="uv-lbl">{e(l)}</span><div class="uv-bars"><a class="uv-bar {c}" href="{h}" style="width:{max(n / mx * 100, 1.5):.1f}%" title="{n}"><b>{n}</b></a></div></div>' for l, n, c, h in bars)
    nets = Counter(n for n in [_net(c["who"]) for c in cat] + [_net(t) for t in ld + al] if n)
    nrows = ""
    if nets:
        nm = max(nets.values())
        nrows = '<h4 style="margin:12px 0 4px;font-family:var(--sans);font-size:.85rem">Not yet verified, by network</h4>' + "".join(
            f'<div class="uv-row"><span class="uv-lbl">{e(n)}</span><div class="uv-bars"><a class="uv-bar uv-cat" href="#uv-news" style="width:{max(v / nm * 100, 3):.1f}%" title="{v} not yet verified"><b>{v}</b></a></div></div>'
            for n, v in nets.most_common())
    MEDIA_NUMS.update(verified=ver, catalog=len(cat), leads=len(ld), altered=len(al), nets=dict(nets.most_common()))
    return (f'<div class="chart-card uv-card" id="uv-media"><h3>Media claims: how much is unverified</h3><p class="sub">What the news says, but no one has proven.</p>'
            f'{rows}{nrows}<p class="period-note">Our fact-checker vetting rejected <a href="factcheckers.html#fc-cnn-facts-first-cnn-fact-checks">CNN Facts First</a> and <a href="factcheckers.html#fc-pbs-newshour-fact-checks">PBS NewsHour fact checks</a> as independent confirmation: neither is an IFCN signatory, and we located no fact-check methodology or corrections policy for either.</p><p class="tap-hint">Network = first outlet named in the “Who pushed it” field or the lead. Tap a bar for the list.</p></div>')
MEDIA_NUMS = {}


# ---- Merged "Not Yet Verified" page (Sep 26, 2026): unsupported.html folded in; one chart of every not-yet-verified item ----
UNSUP = []  # set by build.py
NYV_LABEL = "Not yet verified, but already shaping public opinion"
# Items flagged "Not yet verified" on other pages (who said it, when, source, home page). Detail stays on the home page.
SITE_ITEMS = [
    ("Republican", "More than 150 bank reports (SARs) on Biden family transactions", "House Oversight Committee (then minority)", "May 25, 2022",
     "https://oversight.house.gov/release/comer-probes-hunter-bidens-suspicious-foreign-business-transactions-flagged-by-u-s-banks/", "biden-family.html#biden-bank-reports"),
    ("Republican", "Over $24M to the Biden family from foreign sources", "House Oversight Committee majority (bank memos)", "2023–2024", "", "biden-family.html#biden-bank-reports"),
    ("Republican", "Foreign-government hotel profits given to Treasury: $151,470 (2017), $191,538 (2018), $10,577 (2020)", "Trump Organization (as reported in the news)", "2017–2020", "", "biden-family.html"),
    ("Republican", "Mar-a-Lago is \u201cworth a billion dollars \u2014 or more\u201d", "Donald Trump (news coverage)", "2023", "", "lawfare.html"),
    ("News outlets", "Congress pay unchanged since 2009; leaders $193,400; Speaker $223,500", "Widely reported figures (the House Clerk page confirms only the $174,000 base salary)", "", "", "accountability-trading.html"),
    ("News outlets", "Colorado Secretary of State registration postcards reached deceased people and noncitizens (2020)", "CBS4 Denver; Breitbart", "Sep 27, 2020",
     "https://www.breitbart.com/politics/2020/09/27/colorado-secretary-state-encourages-non-citizens-deceased-register-vote/", "voters.html#co-eric-postcards"),
    ("News outlets", "About 30,000 noncitizens were mailed registration postcards (2022)", "AP; Fox News (from the office's statements)", "Oct 10, 2022",
     "https://www.foxnews.com/politics/colorado-secretary-state-says-accidentally-sent-30000-voter-registration-notices-noncitizens", "voters.html#co-eric-postcards"),
]

def nyv_items(cases):
    out = {g: [] for g in GROUPS}
    for c in catalog_items(cases):
        out[group(c["who"])].append(f'<b>{e(c["claim"])}</b> <span class="muted">· {e(c["who"])}</span> · <a href="fake-news.html#case-{e(c["id"])}">Case {e(c["id"])} →</a>')
    for g, t, p in all_leads(cases)[0]:
        out[g].append(f'{e(t)}' + (f' <span class="muted">· {e(p)}</span>' if p else "") + ' · <span class="muted">Research lead</span>')
    for u in UNSUP:
        anc = f' id="unsupported-{e(u["id"])}"' if u["id"] else ""
        links = " ".join(f'<a href="{e(x)}" target="_blank" rel="noopener">Source {i} ↗</a>' for i, x in enumerate(u["urls"], 1))
        why = f'<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">Why it is unproven</span><span class="sf-opened">Hide</span></summary><p>{e(u["reason"])}</p></details>' if u["reason"] else ""
        out[group(u["who"])].append(f'<span{anc}></span><b>{e(u["claim"])}</b> <span class="muted">· {e(u["who"])}' + (f' · checked {e(u["checked"])}' if u["checked"] else "") + f'</span> {links}{why}')
    for g, t, who, when, src, home in SITE_ITEMS:
        out[g].append(f'<b>{e(t)}</b> <span class="muted">· {e(who)}' + (f' · {e(when)}' if when else "") + '</span>'
                      + (f' <a href="{e(src)}" target="_blank" rel="noopener">Source ↗</a>' if src else "") + f' · <a href="{e(home)}">Details →</a>')
    return out

def nyv_top(cases):
    items = nyv_items(cases)
    n = {g: len(items[g]) for g in GROUPS}; tot = sum(n.values()); mx = max(list(n.values()) + [1])
    colors = {"Republican": "#dc2626", "Democratic": "#2563eb", "News outlets": "#a3a3a3", "Campaigns": "#a855f7", "Social media": "#f59e0b"}
    rows = "".join(f'<div class="uv-row"><span class="uv-lbl">{e(g)}</span><div class="uv-bars"><a class="uv-bar" href="#nyv-{SLUG[g]}" style="width:{max(n[g] / mx * 100, 3):.1f}%;background:{colors[g]}"><b>{n[g]}</b></a></div></div>' for g in GROUPS)
    big = (f'<div class="tile-grid nyv-big"><div class="stat"><div class="num">{tot}</div><div class="lbl">Not yet verified</div></div>'
           + "".join(f'<a class="stat" href="#nyv-{SLUG[g]}" style="text-decoration:none"><div class="num">{n[g]}</div><div class="lbl">{e(g)}</div></a>' for g in GROUPS) + '</div>')
    chart = (f'<div class="chart-card nyv-chart"><h3>Not yet verified, by who said it</h3><p class="sub">{e(CAPTION)}</p>{rows}'
             '<p class="sf-tap-note">\U0001F446 Tap the chart to see the evidence behind it.</p></div>')
    secs = "".join(f'<section class="nyv-group" id="nyv-{SLUG[g]}"><h2 class="strip-h">{e(g)}: {n[g]}</h2>'
                   + (f'<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See all {n[g]}</span><span class="sf-opened">Hide</span></summary><ul class="uv-list">'
                      + "".join(f'<li><span class="uv-nv">{NYV_LABEL}</span> {it}</li>' for it in items[g]) + '</ul></details>' if items[g] else '<p class="muted">None yet.</p>')
                   + '</section>' for g in GROUPS)
    return big + chart + secs, n
