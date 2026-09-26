"""Two linked interactive charts at the top of lawfare.html. Data: lawfare_grid ROWS/EXTRA (the docket tracker) and the
site's own claim catalog. No new research; missing facts read 'Not yet documented'."""
import re, json, html
import lawfare_grid as LG, unverified as UV
e = lambda s: html.escape(s, quote=True)
ND = "Not yet documented"
GROUPS = ["Republican", "Democratic", "News outlets", "Campaigns", "Social media"]
GCOL = {"Republican": "#b91c1c", "Democratic": "#1d4ed8", "News outlets": "#0c2340", "Campaigns": "#7c3aed", "Social media": "#d97706"}
KEYS = {1: r"civil fraud|engoron|letitia james|\$?464|\$?355 ?million|fraud trial",
        2: r"hush|bragg|34 (?:felony )?counts|stormy|daniels|manhattan (?:criminal|case|trial)|convicted felon|merchan",
        3: r"classified documents|mar-a-lago|documents case|cannon|\braid\b",
        4: r"chutkan|jan(?:uary|\.)? 6 (?:indictment|case|charges)|election interference case|jack smith",
        5: r"georgia (?:case|indictment|rico)|fulton|fani willis|\bwillis\b|raffensperger",
        6: r"section 3|14th amendment|insurrection clause|off the ballot|ballot ban",
        7: r"e\.? jean carroll|\bcarroll\b",
        8: r"immunity ruling|presidential immunity|trump v\.? united states",
        9: r"\bfischer\b|obstruction (?:charge|statute)|1512",
        10: r"january 6(?:th)? committee|jan\. 6 committee|select committee|criminal referral"}

def _t(x):
    return x[0] if isinstance(x, tuple) else (x[0][0] if isinstance(x, list) and x else ND)

def section(cases):
    labels, vals, cols, tips, hrefs = [], [], [], [], []
    for i, (label, badge, cells) in LG.ROWS.items():
        ex = LG.EXTRA.get(i, {})
        allc = {**cells, **ex}
        labels.append(label[:34]); vals.append(len(allc) + (1 if badge else 0) - (1 if 0 in allc and badge else 0))
        cols.append("#b91c1c" if badge == "Unusual" else "#0c2340" if badge == "Usual" else "#94a3b8")
        tips.append([f"Handled: {badge or ND}", f"Charges: {_t(allc[1]) if 1 in allc else ND}",
                     f"Outcome: {_t(allc[5]) if 5 in allc else ND}", f"Why dropped/overturned: {_t(allc[7]) if 7 in allc else ND}"])
        hrefs.append(f"docket-{i}")
    s1 = {"id": "chart-lf-cases", "type": "bar", "horizontal": True, "labels": labels, "data": vals, "colors": cols, "fmt": "int",
          "tips": tips, "hrefs": hrefs, "max": len(LG.COLS)}
    # public opinion: catalog claims about each case, by group
    about = {i: [] for i in LG.ROWS}
    for c in cases:
        t = (c.get("claim", "") + " " + c.get("notes", "")).lower()
        if "colorado" in t:
            continue
        for i, k in KEYS.items():
            if re.search(k, t):
                about[i].append(c); break
    isv = lambda c: c.get("status") == "verified"
    ds = [{"label": f"{g} · {'Proven false/misleading' if v else 'Not yet verified (still out there)'}", "color": GCOL[g] + ("" if v else "80"),
           "data": [sum(1 for c in about[i] if UV.group(c.get("who", "")) == g and isv(c) == v) for i in LG.ROWS]} for g in GROUPS for v in (True, False)]
    s2 = {"id": "chart-lf-opinion", "type": "bar", "horizontal": True, "stacked": True, "labels": labels, "datasets": ds, "fmt": "int",
          "hrefs": [f"lfop-{i}" for i in LG.ROWS]}
    lists = []
    for i, (label, _, _) in LG.ROWS.items():
        items = about[i]
        if not items:
            body = f'<p class="lf-empty">{ND}: no catalog claim about this case yet.</p>'
        else:
            li = []
            for c in items:
                ver = c.get("status") == "verified"
                tag = '<span class="uv-nv" style="background:#fee2e2;color:#991b1b">Proven false/misleading</span>' if ver else '<span class="uv-nv">Not yet verified (still out there)</span>'
                li.append(f'<li>{tag} <b>{e(UV.group(c.get("who","")))}</b> · {e(c.get("who",""))}<br><span class="lf-said">They said:</span> “{e(c["claim"])}”'
                          f'<br><span class="lf-rec">The record:</span> ' + (f'{e(c.get("notes") or ND)} <a href="fake-news.html#case-{e(str(c["id"]))}">See the record →</a>' if ver else f'Not yet checked against the record. <a href="fake-news.html#case-{e(str(c["id"]))}">Case →</a>') + '</li>')
            body = f'<ul class="uv-list">{"".join(li)}</ul>'
        lists.append(f'<details class="sf-fold" id="lfop-{i}"><summary>{e(label)} — {len(items)} claim{"s" if len(items) != 1 else ""}</summary>{body}</details>')
    n = sum(len(v) for v in about.values())
    js = f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat({json.dumps([s1, s2], ensure_ascii=False)});</script>"
    return f"""<section class="lf-charts" id="lf-charts"><h2>The cases, charted</h2>
<div class="chart-card"><h3>Every court case: how it was handled</h3><p class=sub>Bar = facts our tracker documents (of {len(LG.COLS)}). Red = unusual, navy = usual, grey = {ND.lower()}. Hover for charges, outcome and why it was dropped; tap for the case.</p>
<div class="chart-wrap tall"><canvas id="chart-lf-cases" role="img" aria-label="Court cases"></canvas></div></div>
<div class="chart-card"><h3>How public opinion was shaped</h3><p class=sub>{n} claims in our catalog about these cases, by who pushed them. Solid = proven false/misleading (debunked); light = not yet verified (still out there). Tap a bar for their words vs the record.</p>
<div class="chart-wrap tall"><canvas id="chart-lf-opinion" role="img" aria-label="Claims about each case by group"></canvas></div></div>
<div class="lf-op-lists">{"".join(lists)}</div>{js}</section>"""
