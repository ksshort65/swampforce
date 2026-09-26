"""Balance check: counts every rated item on the site by the side of the speaker and by rating label.

Raw counts only. Rules:
- Catalog (Fake News Exposed): each case is assigned to the FIRST entity named in its "Who pushed it" field
  (earliest match wins). A second table counts cases that name a Democrat or a Republican anywhere in that field.
- Party affiliation follows the person's official affiliation when the claim was made. Party-aligned strategists,
  PACs, advocacy groups and commentators who hold no party office count as Independent / other.
  Sen. Bernie Sanders is counted as Independent (his official affiliation).
- Trackers and watches: every item on those pages that carries a rating label and is a claim made by someone.
  Record facts labeled "Proven" (for example, the Omar page's numbered findings) are not speaker claims and are
  not counted. Scorecard figures are data points, not rated claims, and are not counted.
"""
import re
from collections import Counter, defaultdict

D_RX = (r"Joe Biden|President Joe Biden|Biden campaign|Biden HQ|Biden-Harris|Biden/Harris|Harris/Biden|Harris-Walz|Kamala Harris|"
        r"Tim Walz|Chuck Schumer|Nancy Pelosi|TeamPelosi|Adam Schiff|Jerrold Nadler|Keith Ellison|Tim Kaine|Hillary Clinton|Eric Swalwell|"
        r"Daniel Goldman|Pramila Jayapal|Hakeem Jeffries|House Democratic Caucus|Ron Klain|@WhiteHouse under Biden|Juli[aá]n Castro|"
        r"Tammy Baldwin|Maxine Waters|Kirsten Gillibrand|Pete Buttigieg|Bob Casey|Cory Booker|Howard Dean|Dick Durbin|Elizabeth Warren|"
        r"Sherrod Brown|Diana DeGette|Ocasio-Cortez|Blunt Rochester|Barack Obama|Sara Rodriguez|Democratic National Committee|"
        r"Democratic lawmakers|House Homeland Security Committee Democrats|Senate Democrats|other Democrats|Democratic Convention speakers|"
        r"Democratic campaign|Antonio Villaraigosa|Mike Bloomberg|JB Pritzker|Wasserman Schultz|Rosa DeLauro|Abdul El-Sayed|Mark Kelly|"
        r"Leon Panetta|Terry McAuliffe|Wyden|John Larson|Jenny Durkan|Melvin Carter|Joe Biden \(")
R_RX = r"White House \(\u201cno tear gas\u201d\)|Donald Trump|\bTrump (?:said|administration)|JD Vance|Republican (?:official|lawmaker)|DOGE"
I_RX = (r"Bernie Sanders|51 former intelligence officials|Jon Favreau|Chicago Public Schools|Social Security Works|Protect Our Care|"
        r"Adam Parkhomenko|James Carville|Tristan Snell|Brian Tyler Cohen|Priorities USA|VoteVets|Seattle Police Department|"
        r"Democratic Socialists of America|Hasan Piker")
VIRAL_RX = r"^Viral|^Instagram/social posts|^Viral social|memes recirculating"
GENERIC_RX = (r"Widespread media|Cable news|Multiple cable|Multiple outlets|Media and politicians|Politicians/networks|"
              r"Politicians, activists|many other politicians|other outlets")
OUTLETS = [
    (r"\bCNBC\b|Kevin Breuninger|John Harwood", "CNBC"), (r"MSNBC|Lawrence O.Donnell|Nicolle Wallace", "MSNBC"),
    (r"\bCNN\b|Jeff Zeleny|Pamela Brown", "CNN"), (r"\bNBC\b|Meet the Press|Chuck Todd|Ken Dilanian", "NBC News"),
    (r"ABC News Australia", "ABC News Australia"), (r"\bABC\b|Stephanopoulos|Brian Ross", "ABC News"),
    (r"\bCBS\b|60 Minutes", "CBS News"), (r"Washington Post|Dave Weigel|Josh Rogin|Paulina Firozi", "The Washington Post"),
    (r"New York Times|NYT Magazine|Jonathan Weisman|Jake Silverstein|Jan Rosen", "The New York Times"),
    (r"Associated Press|\bAP\b", "Associated Press"), (r"Reuters", "Reuters"), (r"BuzzFeed", "BuzzFeed News"),
    (r"POLITICO|Politico", "Politico"), (r"\bTIME\b|Zeke Miller", "TIME"), (r"Newsweek", "Newsweek"), (r"\bNPR\b", "NPR"),
    (r"Bloomberg News", "Bloomberg News"), (r"Wall Street Journal", "The Wall Street Journal"), (r"McClatchy", "McClatchy"),
    (r"ProPublica", "ProPublica"), (r"Der Spiegel", "Der Spiegel"), (r"\bBBC\b", "BBC"), (r"Yahoo News|Hunter Walker", "Yahoo News"),
    (r"The Intercept", "The Intercept"), (r"National Review", "National Review"), (r"Independent Journal Review", "Independent Journal Review"),
    (r"Morning Call", "The Morning Call"), (r"Arizona Republic", "The Arizona Republic"), (r"Daily Beast", "The Daily Beast"),
    (r"WIRED", "WIRED"), (r"Telegraph", "The Telegraph (UK)"), (r"Axios", "Axios"), (r"Slate", "Slate"), (r"New York Post", "New York Post"),
    (r"USA Today", "USA Today"), (r"HarperCollins", "HarperCollins UK"), (r"The Guardian", "The Guardian"), (r"U\.S\. Sun", "The U.S. Sun"),
    (r"San Francisco Chronicle", "San Francisco Chronicle"), (r"El Chig\u00fcire Bipolar", "El Chig\u00fcire Bipolar"), (r"City Journal", "City Journal"),
]


def classify(who):
    """(bucket, detail) for the first entity named."""
    cands = []
    for rx, bucket in ((D_RX, "Democrat"), (R_RX, "Republican"), (I_RX, "Independent / other"), (VIRAL_RX, "Anonymous / viral social posts"),
                       (GENERIC_RX, "Media: multiple or unnamed outlets")):
        m = re.search(rx, who)
        if m:
            cands.append((m.start(), bucket, m.group(0)))
    for rx, name in OUTLETS:
        m = re.search(rx, who)
        if m:
            cands.append((m.start(), "Media outlet", name))
    if not cands:
        return "Unattributed / not classified", who[:60]
    cands.sort(key=lambda t: t[0])
    _, bucket, detail = cands[0]
    return bucket, detail


# Trackers and watches: every rated speaker claim on those pages (page, item, speaker, bucket, detail, rating)
TW_ITEMS = [
    ("Trump Watch", "Ballroom: who pays", "Sen. Chuck Schumer", "Democrat", "", "Rated misleading"),
    ("Trump Watch", "Reflecting Pool: no-bid, taxpayer-paid", "Sen. Chuck Schumer", "Democrat", "", "Consistent with the record"),
    ("Movement Watch", "Defunding the police", "Abdul El-Sayed", "Democrat", "", "Rated misleading"),
    ("Movement Watch", "Venezuela death toll", "Democratic Socialists of America", "Independent / other", "", "Disputed"),
    ("Movement Watch", "Minab school strike", "Hasan Piker", "Independent / other", "", "Consistent with the record"),
    ("2020 Record", "R2020-01", "CNN", "Media outlet", "CNN", "Rated misleading"),
    ("2020 Record", "R2020-02", "Seattle Mayor Jenny Durkan", "Democrat", "", "Rated misleading"),
    ("2020 Record", "R2020-03", "Seattle Police Department", "Independent / other", "", "Proven false"),
    ("2020 Record", "R2020-04", "Seattle Police Department", "Independent / other", "", "Unsupported"),
    ("Voters & Population", "Harris: \"purging voter rolls\"", "Kamala Harris", "Democrat", "", "Rated misleading"),
    ("Voters & Population", "\"30,000 illegal aliens registered\"", "Television report (not identified)", "Media: multiple or unnamed outlets", "", "Rated misleading"),
    ("Voters & Population / Unsupported", "Griswold said dead people and noncitizens should vote", "Television statement (speaker not identified)", "Unattributed / not classified", "", "Unsupported"),
] + [("Voters & Population", f"Hickenlooper SAVE Act letter, claim {i}", "Sen. John Hickenlooper", "Democrat", "", "Accurate") for i in range(1, 8)] + [
    ("Censorship", "FBI or government ordered laptop story suppressed", "Widespread claim (no single speaker)", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Twitter Files show Biden White House ordering 2020 takedowns", "Widespread claim", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Supreme Court cleared the administration", "Common framing in commentary", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Courts ruled the actions unconstitutional", "Common framing in commentary", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Collins and Fauci got the GBD censored", "Common framing", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Doctors lost licenses just for speaking", "Common framing", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Networks censored the President (Nov 5, 2020)", "Common framing", "Unattributed / not classified", "", "Not supported by the record"),
    ("Censorship", "Laptop story was Russian disinformation", "Joe Biden (candidate), citing the 51-signer letter", "Democrat", "", "Not supported by the record"),
    ("Accountability: fraud", "DOGE's $215B savings figure", "DOGE (Trump administration)", "Republican", "", "Disproven as stated"),
    ("Accountability: fraud", "\"Improper payments = fraud\"", "Common framing", "Unattributed / not classified", "", "Disproven"),
    ("Accountability: COVID", "Trump, Feb 26, 2020: 15 cases \"down to close to zero\"", "Donald Trump", "Republican", "", "Disproven"),
    ("Accountability: COVID", "Hydroxychloroquine promoted as a COVID treatment", "Trump administration", "Republican", "", "Disproven"),
    ("Accountability: COVID", "New York's official nursing-home death counts", "New York State (Cuomo administration)", "Democrat", "", "Proven (undercount)"),
    ("Accountability: COVID", "Six-foot distancing presented as science-based", "Federal health agencies (CDC)", "Independent / other", "", "Congressional record (majority finding)"),
    ("Accountability: COVID", "Fauci: NIH did not fund gain-of-function research in Wuhan", "Dr. Anthony Fauci (career official)", "Independent / other", "", "Unresolved"),
    ("Accountability: COVID", "Biden: \"you're not going to get COVID if you have these vaccinations\"", "Joe Biden", "Democrat", "", "Disproven"),
    ("Accountability: COVID", "Federal pressure on platforms to remove COVID content", "Biden administration", "Democrat", "", "Unresolved"),
    ("Accountability: COVID", "Eviction moratorium / OSHA mandate authority", "Biden administration agencies", "Democrat", "", "Proven (exceeded authority)"),
    ("Accountability: COVID", "\"COVID came from a lab leak\"", "White House and House majority (2025)", "Republican", "", "Unresolved"),
    ("Accountability: Minnesota", "Fraud proceeds were sent abroad", "Not attributed on the page", "Unattributed / not classified", "", "Proven"),
    ("Accountability: Minnesota", "Proceeds were sent to Somalia specifically", "Not attributed on the page", "Unattributed / not classified", "", "Unresolved"),
    ("Accountability: Minnesota", "Proceeds funded al-Shabaab", "City Journal (anonymous sourcing)", "Media outlet", "City Journal", "Unresolved"),
    ("Accountability: Minnesota", "\"Billions\" stolen in Minnesota", "Not attributed on the page", "Unattributed / not classified", "", "Unresolved"),
    ("Accountability: Omar", "The 2009 marriage / immigration-fraud allegation", "2016 blog allegation; 2026 federal officials say it is under investigation", "Unattributed / not classified", "", "Unresolved"),
]

ORDER = ["Republican", "Democrat", "Mixed (both sides named)", "Independent / other", "Media outlet", "Media: multiple or unnamed outlets", "Anonymous / viral social posts", "Unattributed / not classified"]


# Cases whose pusher field names both sides for the two halves of one claim.
OVERRIDE = {"27": ("Mixed (both sides named)", "White House (\"no tear gas\") and media (\"CS tear gas\")")}


def compute(cases, party_rows):
    """party_rows: [(side, n)] for the party ledgers."""
    cat = []
    for c in cases:
        b, d = OVERRIDE.get(c["id"]) or classify(c["who"])
        cat.append((c["id"], b, d, c["evidence"], c["who"]))
    anyD = sum(1 for c in cases if re.search(D_RX, c["who"]))
    anyR = sum(1 for c in cases if re.search(R_RX, c["who"]))
    rows = [("Catalog (Fake News Exposed)", b, d, r) for _, b, d, r, _ in cat]
    for side, n in party_rows:
        rows += [("Party ledgers", side, "", "Claim set against the record (no label)")] * n
    rows += [(p, b, d, r) for p, _, _, b, d, r in TW_ITEMS]
    return {"catalog": cat, "anyD": anyD, "anyR": anyR, "rows": rows}


def tables(res):
    rows = res["rows"]
    by_area_side = defaultdict(Counter)
    for area, b, d, r in rows:
        grp = "Catalog" if area.startswith("Catalog") else ("Party ledgers" if area == "Party ledgers" else "Trackers & watches")
        by_area_side[grp][b] += 1
        by_area_side["All"][b] += 1
    outlets = Counter(d for _, b, d, _ in rows if b == "Media outlet")
    labels = defaultdict(Counter)
    for area, b, d, r in rows:
        labels[b][r] += 1
    return by_area_side, outlets, labels


def report_md(res, checked):
    by, outlets, labels = tables(res)
    groups = ["Catalog", "Party ledgers", "Trackers & watches", "All"]
    L = [f"# How balanced is this site? Raw counts (checked {checked})", "", __doc__.strip(), "",
         "## Rated items by side of the speaker", "", "| Side | " + " | ".join(groups) + " |", "|---|" + "---|" * len(groups)]
    for s in ORDER:
        L.append(f"| {s} | " + " | ".join(str(by[g][s]) for g in groups) + " |")
    L.append("| **Total** | " + " | ".join(f"**{sum(by[g].values())}**" for g in groups) + " |")
    L += ["", f"Catalog cases that name a Democrat anywhere in the pusher field: {res['anyD']}. Cases that name a Republican anywhere: {res['anyR']}.",
          "The catalog's inclusion rule covers only claims about President Trump or his administration that are unfavorable to him or them (Methodology, section 1).", "",
          "## Media outlets by name (all areas)", "", "| Outlet | Items |", "|---|---|"]
    L += [f"| {o} | {n} |" for o, n in sorted(outlets.items(), key=lambda t: (-t[1], t[0]))]
    L += ["", "## Rating labels by side", "", "| Side | Label | Items |", "|---|---|---|"]
    for s in ORDER:
        for lab, n in sorted(labels[s].items(), key=lambda t: (-t[1], t[0])):
            L.append(f"| {s} | {lab} | {n} |")
    L += ["", "## Trackers and watches: every counted item", "", "| Page | Item | Speaker | Side | Label |", "|---|---|---|---|---|"]
    L += [f"| {p} | {i} | {sp} | {b}{(': ' + d) if d else ''} | {r} |" for p, i, sp, b, d, r in TW_ITEMS]
    L += ["", "## Catalog: assignment of each case", "", "| Case | Side | First entity named | Label |", "|---|---|---|---|"]
    L += [f"| {i} | {b} | {d} | {r} |" for i, b, d, r, _ in res["catalog"]]
    return "\n".join(L) + "\n"


def about_block(res, e):
    by, outlets, labels = tables(res)
    groups = ["Catalog", "Party ledgers", "Trackers & watches", "All"]
    th = "".join(f"<th>{e(g)}</th>" for g in groups)
    trs = "".join(f'<tr><td data-l="Side">{e(s)}</td>' + "".join(f'<td data-l="{e(g)}">{by[g][s]}</td>' for g in groups) + "</tr>" for s in ORDER)
    trs += '<tr class="tot"><td data-l="Side"><b>Total</b></td>' + "".join(f'<td data-l="{e(g)}"><b>{sum(by[g].values())}</b></td>' for g in groups) + "</tr>"
    top = ", ".join(f"{e(o)} {n}" for o, n in sorted(outlets.items(), key=lambda t: (-t[1], t[0])))
    lab_rows = "".join(f'<tr><td data-l="Side">{e(s)}</td><td data-l="Labels">' + "; ".join(f"{e(l)} {n}" for l, n in sorted(labels[s].items(), key=lambda t: (-t[1], t[0]))) + "</td></tr>" for s in ORDER if labels[s])
    return (f'<section class="doc-section" id="balance"><h2>8. How balanced is this site?</h2>'
            '<p>Every rated item on the site, counted by the side of the person or outlet that made the claim. Raw counts only. A catalog case is assigned to the first entity named in its "Who pushed it" field; party follows official affiliation; strategists, PACs, advocacy groups and commentators without party office count as Independent / other. Scorecard figures are data points, not rated claims, and are not counted.</p>'
            f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Side</th>{th}</tr></thead><tbody>{trs}</tbody></table></div>'
            f'<p>Catalog cases that name a Democrat anywhere in the pusher field: <b>{res["anyD"]}</b>; a Republican: <b>{res["anyR"]}</b>. The catalog covers only claims about President Trump or his administration that are unfavorable to him or them (section 1).</p>'
            f'<p><b>Media outlets by name:</b> {top}.</p>'
            f'<details class="watch-details"><summary>Rating labels by side</summary><div class="table-wrap"><table class="watch-table"><thead><tr><th>Side</th><th>Labels</th></tr></thead><tbody>{lab_rows}</tbody></table></div></details></section>')
