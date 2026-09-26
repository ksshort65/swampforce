"""'Unverified claims, accusations and deceptions' page: the catalog cases still being checked, grouped by who pushed them,
plus SuperGrok research leads not already in the catalog. Uses only existing data."""
import re
GROUPS = ["Republican", "Democratic", "News outlets", "Campaigns", "Social media"]
DEM = r"harris|biden|obama|favreau|villaraigosa|pelosi|schiff|newsom|democrat|\(d-|, d-|sen\. (chuck )?schumer|clinton|warren|sanders|aoc|ocasio|swalwell|nadler|waters|hochul|walz|pritzker|whitmer|jean-pierre|psaki|kirby|mayorkas|garland|fauci|karine|jeffries|klain|buttigieg|booker|howard dean|schumer|durbin|el-sayed|carville|baldwin|jayapal|goldman"
REP = r"republican|\(r-|, r-|gop|trump campaign|mcconnell|mccarthy|johnson \(r|desantis|vance|rnc"
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
TITLE = "Unverified claims, accusations and deceptions"
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
    return f"""<section class="band-hero"><div class="wrap"><p class="hero-kicker">Still being checked</p><h1>{e(TITLE)}</h1><p class="dek">{e(CAPTION)}</p></div></section>
<div class="wrap">{_bars(cat, ld, "", ver_counts(cases))}{period_block(cases)}{altered_block(cases)}{wapo_block()}
<p class="period-note">Grouped by the first-named source in the catalog’s “Who pushed it” field. The catalog holds 252 cases: 118 verified, 131 still being checked, 3 set aside. None of the items below has passed our check yet.</p>
<h2 class="strip-h">In the catalog, still being checked ({sum(cat.values())})</h2>{"".join(sec)}
<h2 class="strip-h" id="uv-leads">Found by our research, not yet in the catalog ({len(lds)})</h2>
<p class="period-note">Research leads, not yet in the catalog and not yet checked against an official record. Sources: every saved SuperGrok batch (2015–16, 2017–20, 2021–24 and 2025–26 blocks, the overnight Sep 26 pass, the 2025–26 raw list, and the full SuperGrok conversation: per-period lists, ‘Needs a link’ items and named on-air cases). Items marked HOLD, NEEDS QUOTE LINK or NEEDS SUPERGROK are listed here. Duplicates of catalog cases and of each other were removed.</p>{"".join(lsec)}
<h2 class="strip-h" id="uv-altered">Altered quotes: words changed, cut or rearranged ({len(alt)})</h2>
<ul class="uv-list">{"".join(f'<li><span class="uv-nv">Not yet verified</span> <b>{e(g)}</b> · {e(p or "Undated")} · {e(t)}</li>' for g, t, p in alt)}</ul>
<h2 class="strip-h" id="uv-research-verified">Checked by our research, catalog entry pending ({len(rv)})</h2>
<p class="period-note">These passed a research check against an official record but are not yet in the 252-case catalog, so they are not in its totals.</p>
<ul class="uv-list">{"".join(f'<li><span class="uv-nv" style="background:#fee2e2;color:#991b1b">Proven false/misleading (research) · catalog entry pending</span> <b>{e(g)}</b> · {e(p or "Undated")} · {e(t)}</li>' for g, t, p in rv)}</ul></div>"""

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

def wapo_block():
    """Washington Post Fact Checker tally, shown separately; not part of any SwampForce or SuperGrok count."""
    import json
    spec = {"id": "chart-wapo-tally", "type": "bar", "labels": ["2017", "2018", "Late 2019", "Full term"], "data": [2000, 5700, 15000, 30573],
            "fmt": "int", "colors": ["#94a3b8"], "tips": [["About 2,000"], ["About 5,700"], ["15,000+"], ["30,573"]]}
    return ('<div class="chart-card uv-card" id="uv-wapo"><h3>Washington Post count of Trump false or misleading claims, not verified by SwampForce</h3>'
            '<p class="sub">Cumulative by year. The Post kept a full count only for Trump. Repeats count every time, so many entries are the same claim said again. Source: Washington Post Fact Checker. Not included in any count on this site.</p>'
            '<div class="chart-wrap"><canvas id="chart-wapo-tally" role="img" aria-label="Washington Post cumulative tally"></canvas></div></div>'
            f'<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec)}]);</script>')
