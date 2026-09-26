"""Interactive charts for numeric sections that have none. Uses ONLY numbers already in the page's own tables/tiles.
One template: a Chart.js card at the top of the section; clicking a bar jumps to (and opens) the source row.
The section's existing content stays, folded behind 'Read more'."""
import re, json, html as H
NUM = re.compile(r"^[~≈<>]?\s*(-?)\$?\s*(\d[\d,]*(?:\.\d+)?)\s*(%|K|M|B|T|million|billion|trillion)?\+?$", re.I)
SCALE = {"k": 1e3, "m": 1e6, "million": 1e6, "b": 1e9, "billion": 1e9, "t": 1e12, "trillion": 1e12}
COUNT = [0]

def txt(s):
    return H.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))).strip()

def parse(cell):
    t = txt(cell).replace("\u2212", "-")
    m = NUM.match(t)
    if not m or len(t) > 22:
        return None
    v = float(m.group(2).replace(",", "")) * (-1 if m.group(1) else 1)
    u = (m.group(3) or "").lower()
    usd = "$" in t
    if u == "%":
        return v, "pct"
    if u in SCALE:
        v *= SCALE[u]; usd = usd or u in ("b", "t", "billion", "trillion")
    if not usd and not u and 1900 <= v <= 2100 and float(v).is_integer():
        return None  # a year, not a quantity
    return v, ("usd" if usd else "int")

def pick_fmt(vals, kind):
    if kind == "pct":
        return vals, "pct"
    if kind == "usd":
        mx = max(abs(v) for v in vals)
        if mx >= 1e12: return [round(v / 1e12, 2) for v in vals], "t"
        if mx >= 1e9: return [round(v / 1e9, 2) for v in vals], "bn"
        if mx >= 1e6: return [round(v / 1e6, 1) for v in vals], "usdm"
        return vals, "usd"
    return vals, "int"

def table_series(tbl, sid):
    """First numeric column (not the label column) with >= 2 values of one kind."""
    heads = [txt(c) for c in re.findall(r"<th\b[^>]*>(.*?)</th>", tbl.split("</thead>")[0], re.S)] if "</thead>" in tbl else []
    rows = re.findall(r"<tr\b[^>]*>(.*?)</tr>", tbl.split("</thead>")[-1], re.S)
    cells = [re.findall(r"<t[dh]\b[^>]*>(.*?)</t[dh]>", r, re.S) for r in rows]
    cells = [c for c in cells if len(c) >= 2]
    if len(cells) < 2:
        return None
    ncol = max(len(c) for c in cells)
    for j in range(1, ncol):
        if heads and j < len(heads) and re.search(r"year|date|rank|#|page|zip", heads[j], re.I):
            continue
        got = [(i, parse(c[j])) for i, c in enumerate(cells) if j < len(c)]
        got = [(i, p) for i, p in got if p]
        kinds = {p[1] for _, p in got}
        if len(got) >= 2 and len(kinds) == 1 and len(got) >= 0.5 * len(cells) and len(got) <= 30:
            kind = kinds.pop()
            vals, fmt = pick_fmt([p[0] for _, p in got], kind)
            labels = [txt(cells[i][0])[:38] or f"Row {i+1}" for i, _ in got]
            title = heads[j] if heads and j < len(heads) and heads[j] else "Value"
            return {"rows": [i for i, _ in got], "labels": labels, "data": vals, "fmt": fmt, "title": title}
    return None

def card(cid, title, sub, n):
    tall = " tall" if n > 8 else ""
    return (f'<div class="chart-card ac-card"><h3>{H.escape(title)}</h3><p class=sub>{H.escape(sub)}</p>'
            f'<div class="chart-wrap{tall}"><canvas id="{cid}" role="img" aria-label="{H.escape(title)}"></canvas></div></div>')

def spec(cid, s, hrefs):
    return {"id": cid, "type": "bar", "horizontal": True, "labels": s["labels"], "data": s["data"],
            "fmt": s["fmt"], "colors": ["#0c2340"], "hrefs": hrefs}

def _chart_table(h, start, end, sid, specs, fold=True):
    """Chart the first chartable table in h[start:end]; returns new h or None."""
    seg = h[start:end]
    for tm in re.finditer(r"<table\b.*?</table>", seg, re.S):
        s = table_series(tm.group(0), sid)
        if not s:
            continue
        COUNT[0] += 1
        cid = f"ac-{sid}"
        tbl = tm.group(0); k = [0]; rowset = set(s["rows"])
        body_start = tbl.find("</thead>") + 8 if "</thead>" in tbl else 0
        def tag(m):
            i = k[0]; k[0] += 1
            if len(re.findall(r"<t[dh]\b", m.group(0))) < 2:
                k[0] -= 1; return m.group(0)
            return m.group(0).replace("<tr", f'<tr id="{cid}-r{i}"', 1) if i in rowset else m.group(0)
        new_tbl = tbl[:body_start] + re.sub(r"<tr\b[^>]*>.*?</tr>", tag, tbl[body_start:], flags=re.S)
        seg = seg[:tm.start()] + new_tbl + seg[tm.end():]
        specs.append(spec(cid, s, [f"{cid}-r{i}" for i in s["rows"]]))
        c = card(cid, s["title"], "From the table in this section · hover for values, tap a bar for the row", len(s["data"]))
        return c, seg
    return None

def apply(name, h):
    specs = []
    # 1) doc sections / tab panels / glance sections with a table but no chart
    out, pos = [], 0
    for m in re.finditer(r'<section class="(?:doc-section|tab-panel room[^"]*|lf-glance)"[^>]*\bid="([^"]+)"[^>]*>', h):
        if m.start() < pos:
            continue
        # matching </section>
        depth, i = 1, m.end()
        while depth:
            a, b = h.find("<section", i), h.find("</section>", i)
            if b < 0: break
            if 0 <= a < b: depth += 1; i = a + 8
            else: depth -= 1; i = b + 10
        end = i - 10
        inner = h[m.end():end]
        if "<canvas" in inner or "<svg" in inner or "<table" not in inner:
            continue
        r = _chart_table(h, m.end(), end, m.group(1), specs)
        if not r:
            continue
        c, seg = r
        hm = re.search(r"</h2>", seg)
        cut = hm.end() if hm and hm.start() < 600 else 0
        folded = seg[cut:]
        seg = seg[:cut] + c + f'<details class="sf-fold ac-fold"><summary>Read more</summary>{folded}</details>'
        out.append(h[pos:m.end()]); out.append(seg); pos = end
    out.append(h[pos:]); h = "".join(out)
    # 2) journal essays: tables in the article body (no sections)
    if name.startswith("journal-") and "<canvas" not in h:
        for n, tm in enumerate(list(re.finditer(r'(?:<div class="table-wrap">)?<table\b.*?</table>(?:</div>)?', h, re.S))[:3]):
            pass
        j = 0
        while True:
            tm = re.search(r'(?:<div class="table-wrap">)?<table\b(?![^>]*data-ac).*?</table>(?:</div>)?', h, re.S)
            if not tm or j > 3: break
            r = _chart_table(h, tm.start(), tm.end(), f"{name[8:-5]}-{j}", specs)
            blk = h[tm.start():tm.end()].replace("<table", "<table data-ac", 1)
            if r:
                c, seg = r
                blk = c + '<details class="sf-fold ac-fold"><summary>Read more</summary>' + seg.replace("<table", "<table data-ac", 1) + "</details>"
            h = h[:tm.start()] + blk + h[tm.end():]; j += 1
        h = h.replace("<table data-ac", "<table")
    if specs:
        js = f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat({json.dumps(specs, ensure_ascii=False)});</script>\n"
        if "chart.umd.min.js" not in h:
            js = '<script src="assets/vendor/chart.umd.min.js" defer></script>\n' + js
        h = h.replace("</body>", js + "</body>", 1)
    if "window.SF_CHARTS" in h and "chart.umd.min.js" not in h:
        h = h.replace("</body>", '<script src="assets/vendor/chart.umd.min.js" defer></script>\n</body>', 1)
    return h
