"""'Scrutiny compared: every president' (lawfare.html). Figures from /workspace/_project-state/supergrok-presidents-comparison-2026-09-26.md,
each checked Sep 26, 2026 against only the 9 links listed there. Unconfirmed figures are labeled 'Not yet verified'; no official count = 'Not documented' (never 0)."""
import json, html
e = lambda s: html.escape(s, quote=True)
HOUSE = "https://history.house.gov/Institution/Impeachment/Impeachment-List/"; USAGOV = "https://www.usa.gov/impeachment"
CRS_IF = "https://www.congress.gov/crs-product/IF11732"; CRS_RS = "https://www.congress.gov/crs_external_products/RS/PDF/RS20821/RS20821.8.pdf"
SHOR = "https://shorensteincenter.org/news-coverage-donald-trumps-first-100-days/"; MRC = "https://newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage"
PEW17 = "https://www.pewresearch.org/journalism/2017/10/02/five-topics-accounted-for-two-thirds-of-coverage-in-first-100-days/"
PEW21 = "https://www.pewresearch.org/wp-content/uploads/sites/20/2021/04/PJ_2021.04.28_Biden-100-Days_FINAL.pdf"
S3 = "https://constitution.congress.gov/browse/essay/amdt14-S3-2/ALDE_00000070/"
IMP = [("A. Johnson", 1), ("Clinton", 1), ("Trump", 2)]  # House list: complete official record; every other president 0
ASSN = [("Jackson", 1), ("Lincoln", 1), ("Garfield", 1), ("McKinley", 1), ("T. Roosevelt*", 1), ("F. Roosevelt*", 1), ("Truman", 1), ("Kennedy", 1),
        ("Ford", 2), ("Reagan", 1), ("Clinton", 1), ("G.W. Bush", 1), ("Obama", 1), ("Trump*", 1)]
NEG = [("Clinton", 60, "Shorenstein", True), ("G.W. Bush", 57, "Shorenstein", False), ("Obama", 41, "Shorenstein", False), ("Trump I", 80, "Shorenstein", True),
       ("Trump II", 92.2, "MRC", True), ("Biden", 32, "Pew", True)]
TABLE = [  # president, impeachments, counsel, assassination (CRS), first-100-days % negative
 ("Washington–Buchanan", "0", "Not documented", "Jackson 1 (1835)", "Not documented"),
 ("Lincoln", "0", "Not documented", "Killed 4/14/1865", "Not documented"),
 ("A. Johnson", "1 (Feb 24, 1868)", "Not documented", "Not listed", "Not documented"),
 ("Garfield", "0", "Not documented", "Killed 7/2/1881", "Not documented"),
 ("McKinley", "0", "Not documented", "Killed 9/6/1901", "Not documented"),
 ("T. Roosevelt", "0", "Not documented", "1, as candidate (10/14/1912)", "Not documented"),
 ("F. Roosevelt", "0", "Not documented", "1, as president-elect (2/15/1933)", "Not documented"),
 ("Truman", "0", "Not documented", "1 (11/1/1950, Blair House)", "Not documented"),
 ("Kennedy", "0", "Not documented", "Killed 11/22/1963", "Not documented"),
 ("Nixon", "0 (resigned before a House vote)", "Special prosecutors Cox, Jaworski", "Not listed", "Not documented"),
 ("Ford", "0", "Not documented", "2 (9/5 and 9/22/1975)", "Not documented"),
 ("Reagan", "0", "Iran-Contra counsel (administration)", "1 (3/30/1981)", "Not documented"),
 ("Clinton", "1 (Dec 19, 1998, H.Res. 611)", "Starr independent counsel", "1 (10/29/1994)", "60% (Shorenstein)"),
 ("G.W. Bush", "0", "Not documented", "1 (5/10/2005, Tbilisi)", "57% (Shorenstein) · Not yet verified"),
 ("Obama", "0", "Not documented", "1 (11/11/2011)", "41% (Shorenstein) · Not yet verified"),
 ("Trump", "2 (Dec 18, 2019, H.Res. 755; Jan 13, 2021, 232–197)", "Mueller; Smith", "Butler, PA 7/13/2024, as candidate (CRS note)", "Trump I 80% (Shorenstein); Trump II 92.2% (MRC)"),
 ("Biden", "0", "Hur special counsel", "Not listed", "32% (Pew)"),
]
def section():
    s1 = {"id": "chart-sc-imp", "type": "bar", "labels": [n for n, _ in IMP], "data": [v for _, v in IMP], "colors": ["#0c2340"], "fmt": "int", "hrefs": ["sc-table"] * 3}
    s2 = {"id": "chart-sc-assn", "type": "bar", "horizontal": True, "labels": [n for n, _ in ASSN], "data": [v for _, v in ASSN], "colors": ["#475569"], "fmt": "int", "hrefs": ["sc-table"] * len(ASSN)}
    s3 = {"id": "chart-sc-neg", "type": "bar", "labels": [f"{n} ({src})" for n, _, src, _ in NEG], "data": [v for _, v, _, _ in NEG], "fmt": "pct", "max": 100,
          "colors": [("#b91c1c" if src == "Shorenstein" else "#7c3aed" if src == "MRC" else "#1d4ed8") + ("" if ok else "66") for _, _, src, ok in NEG],
          "tips": [[f"Source: {src}", "Confirmed from the source" if ok else "Not yet verified: read from a figure, not the report text"] for _, _, src, ok in NEG], "hrefs": ["sc-table"] * len(NEG)}
    rows = "".join(f"<tr><th scope=row>{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(d)}</td><td>{e(f)}</td></tr>" for a, b, c, d, f in TABLE)
    js = f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat({json.dumps([s1, s2, s3], ensure_ascii=False)});</script>"
    return f"""<section class="lf-charts" id="scrutiny"><h2>Scrutiny compared: every president</h2>
<div class="chart-card"><h3>Impeachments by president</h3><p class=sub>House of Representatives official list. Every other president: 0. <a href="{HOUSE}" target="_blank" rel="noopener">House list ↗</a> · <a href="{USAGOV}" target="_blank" rel="noopener">USA.gov ↗</a></p><div class="chart-wrap"><canvas id="chart-sc-imp" role="img" aria-label="Impeachments by president"></canvas></div></div>
<div class="chart-card"><h3>Assassination attempts (CRS)</h3><p class=sub>Presidents in the CRS lists. *As candidate or president-elect. Presidents CRS does not list are not shown (not a zero). <a href="{CRS_IF}" target="_blank" rel="noopener">CRS IF11732 ↗</a> · <a href="{CRS_RS}" target="_blank" rel="noopener">CRS RS20821 ↗</a></p><div class="chart-wrap tall"><canvas id="chart-sc-assn" role="img" aria-label="Assassination attempts"></canvas></div></div>
<div class="chart-card"><h3>First 100 days: % negative coverage</h3><p class=sub>Three different studies, not one scale: Shorenstein (red), MRC (purple, broadcast evening news), Pew (blue). Faded = Not yet verified. <a href="{SHOR}" target="_blank" rel="noopener">Shorenstein ↗</a> · <a href="{MRC}" target="_blank" rel="noopener">MRC ↗</a> · <a href="{PEW21}" target="_blank" rel="noopener">Pew 2021 ↗</a></p><div class="chart-wrap"><canvas id="chart-sc-neg" role="img" aria-label="First 100 days negative coverage"></canvas></div></div>
<details class="sf-fold" id="sc-table"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See full table</span><span class="sf-opened">Hide the table</span></summary>
<div class="table-wrap"><table class="rank-table sf-nofold"><thead><tr><th>President</th><th>Impeachments</th><th>Special / independent counsel</th><th>Assassination attempts (CRS)</th><th>First 100 days, % negative</th></tr></thead><tbody>{rows}</tbody></table></div>
<p class="period-note">Criminal indictments: Trump, 4 cases filed after leaving office. Ballot removal: state Section 3 suits; <a href="{S3}" target="_blank" rel="noopener">Trump v. Anderson (2024) ↗</a> held states cannot enforce Section 3 against a presidential candidate. No official master count exists for lawsuits, congressional investigations or ballot challenges, so those are not documented here. Vote tallies other than Jan 13, 2021 (232–197) are Not yet verified; the House list confirms the dates. Pew’s 2017 Trump figures: Not yet verified (<a href="{PEW17}" target="_blank" rel="noopener">page checked ↗</a> gives topic-level shares only).</p></details></section>"""
