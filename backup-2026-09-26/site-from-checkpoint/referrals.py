"""'Referred to DOJ: who was held accountable?' (lawfare.html #referrals). From /workspace/_project-state/supergrok-referrals-2026-09-26.md,
checked Sep 26, 2026 against only the links in that file. Unconfirmed items are labeled 'Not yet verified'; no record = 'Not documented' (never 0)."""
import json, html
e = lambda s: html.escape(s, quote=True)
A = lambda u, t="Source": f'<a href="{u}" target="_blank" rel="noopener">{t} ↗</a>'
HR497 = "https://www.congress.gov/bill/116th-congress/house-resolution/497/all-info"
BAN = "https://www.justice.gov/usao-dc/pr/stephen-k-bannon-sentenced-four-months-prison-two-counts-contempt-congress"
NAV = "https://www.justice.gov/usao-dc/pr/ex-white-house-trade-advisor-peter-navarro-sentenced-four-months-prison-two-counts"
CRS = "https://www.congress.gov/crs-product/IF12907"; HR694 = "https://www.congress.gov/committee-report/119th-congress/house-report/694"
J6 = "https://www.govinfo.gov/content/pkg/GPO-J6-REPORT/pdf/GPO-J6-REPORT.pdf"
BREN = "https://judiciary.house.gov/media/press-releases/chairman-jordan-refers-john-brennan-doj-criminal-prosecution"
NV = '<span class="uv-nv">Not yet verified</span>'
# name, group, referred, outcome bucket, outcome text, links, verified?
ROWS = [
 ("William Barr", "Trump cabinet (Attorney General)", "House, Jul 17, 2019 (230–198), H.Res. 497", "No public action", "No prosecution", A(HR497), True),
 ("Wilbur Ross", "Trump cabinet (Commerce)", "House, Jul 17, 2019 (230–198), H.Res. 497", "No public action", "No prosecution", A(HR497), True),
 ("Steve Bannon", "Trump aide (former; private citizen)", "House, Oct 21, 2021", "Charged", "Charged, convicted; 4 months + $6,500", A(BAN, "DOJ"), False),
 ("Mark Meadows", "Trump aide (former chief of staff)", "House, Dec 14, 2021 (222–203)", "No public action", "Not charged", "", False),
 ("Peter Navarro", "Trump aide (former trade adviser)", "House, Apr 6, 2022", "Charged", "Charged, convicted; 4 months + $9,500", A(NAV, "DOJ"), False),
 ("Dan Scavino", "Trump aide (former deputy chief of staff)", "House, Apr 6, 2022", "No public action", "Not charged", "", False),
 ("Merrick Garland", "Biden cabinet (Attorney General)", "House, Jun 12, 2024 (216–207), Hur audio", "DOJ declined", "“DOJ declined to prosecute” (CRS)", A(CRS, "CRS IF12907"), True),
 ("Ralph de la Torre", "Private CEO (Steward Health Care)", "Senate, Sep 2024", "No public action", "Charges: not documented", A(CRS, "CRS IF12907"), True),
 ("Hector Roos", "House Ethics witness", "House, Sep 1, 2026", "Pending / not documented", "Outcome not documented", A(HR694, "H. Rept. 119-694"), False),
 ("Michael Joseph", "House Ethics witness", "House, Sep 1, 2026", "Pending / not documented", "Outcome not documented", "", False),
]
BUCKETS = ["Charged", "DOJ declined", "No public action", "Pending / not documented"]
def section():
    cnt = [sum(r[3] == b for r in ROWS) for b in BUCKETS]
    ch = {"id": "chart-rf", "type": "bar", "horizontal": True, "labels": BUCKETS, "data": cnt, "fmt": "int",
          "colors": ["#b91c1c", "#1d4ed8", "#64748b", "#94a3b8"], "hrefs": ["rf-list"] * 4,
          "tips": [[", ".join(r[0] for r in ROWS if r[3] == b)] for b in BUCKETS]}
    rows = "".join(f"<tr><th scope=row>{e(n)}</th><td>{e(g)}</td><td>{e(w)}</td><td><strong>{e(b)}</strong> · {o} {l}{'' if ok else ' ' + NV}</td></tr>"
                   for n, g, w, b, o, l, ok in ROWS)
    js = f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat({json.dumps([ch], ensure_ascii=False)});</script>"
    big = lambda n, t, extra="": f'<div class="stat"><div class="num">{n}</div><div class="lbl">{t}</div>' + (f'<div class="sub">{extra}</div>' if extra else "") + "</div>"
    return f"""<section class="lf-charts" id="referrals"><h2>Referred to DOJ: who was held accountable?</h2>
<p class=sub>Full-chamber contempt-of-Congress referrals (2 U.S.C. §§ 192, 194) since 2015. These are the only referrals that can be listed completely.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:10px 0">{big("10", "full-chamber contempt referrals since 2015")}{big("2", "charged, both Trump aides (Bannon, Navarro); both sentenced to 4 months", NV)}{big("0", "current or former cabinet officials charged (Barr, Ross, Garland)")}{big("Not charged", "Trump aides Meadows and Scavino", NV)}</div>
<div class="chart-card"><h3>Outcome of the 10 referrals</h3><p class=sub>Tap a bar to see the names.</p><div class="chart-wrap"><canvas id="chart-rf" role="img" aria-label="Contempt referral outcomes"></canvas></div></div>
<p class="period-note"><strong>Separate:</strong> referrals by committee letter (for example, Chairman Jordan’s Oct 21, 2025 referral of John Brennan {A(BREN)}; Jack Smith; Windom) have no official complete list, and their outcomes are not documented. Committee contempt reports on Hunter Biden and a report on Mark Zwonitzer never got a full House vote (CRS) {A(CRS)}. Jan 6 committee referrals (Dec 2022) {A(J6, "Report")}: Not yet verified here.</p>
<details class="sf-fold" id="rf-list"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See the list</span><span class="sf-opened">Hide the list</span></summary>
<div class="table-wrap"><table class="rank-table sf-nofold rf-table"><thead><tr><th>Person</th><th>Group</th><th>Referred</th><th>Outcome</th></tr></thead><tbody>{rows}</tbody></table></div>
<p class="period-note">Confirmed Sep 26, 2026: Barr and Ross vote (Congress.gov); Garland declination, de la Torre referral, Hunter Biden and Zwonitzer reports (CRS); Roos contempt report; Brennan letter. Not yet verified: Bannon and Navarro sentences (DOJ pages blocked our check), Meadows and Scavino (no link in our source), the Sep 1, 2026 House vote, and Michael Joseph.</p></details>{js}</section>"""
