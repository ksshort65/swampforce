"""'Foreign money by country' pair (democrats.html, inside Biden family bank reports). Same method both sides: House committee staff
records, amounts as the committee states them. Checked Sep 26, 2026 against only the links in
/workspace/_project-state/supergrok-foreign-money-2026-09-26.md. Unconfirmed = 'Not yet verified'."""
import json, html
e = lambda s: html.escape(s, quote=True)
TL = "https://oversight.house.gov/the-bidens-influence-peddling-timeline/"
M3 = "https://oversight.house.gov/release/comer-releases-third-bank-memo-detailing-payments-to-the-bidens-from-russia-kazakhstan-and-ukraine/"
M3PDF = "https://oversight.house.gov/wp-content/uploads/2023/08/Third-Bank-Records-Memorandum_Redacted.pdf"
CHN = "https://oversight.house.gov/release/comer-reveals-how-joe-biden-received-laundered-china-money/"
IMP = "https://judiciary.house.gov/media/press-releases/judiciary-oversight-and-ways-and-means-committees-release-report-impeachment"
MEXOM = "https://www.congress.gov/118/meeting/house/116415/documents/HHRG-118-GO00-20230928-SD033.pdf"
OWA = "https://oversight.house.gov/release/comer-releases-direct-monthly-payments-to-joe-biden-from-hunter-bidens-business-entity/"
WH1 = "https://www.congress.gov/118/meeting/house/116733/documents/HMKP-118-JU00-20240110-SD004.pdf"
WH2 = "https://www.congress.gov/118/meeting/house/116733/documents/HMKP-118-JU00-20240110-SD005.pdf"
GIFT = "https://oversightdemocrats.house.gov/sites/evo-subsites/democrats-oversight.house.gov/files/2023.03.17%20COA%20Democrats%20Foreign%20Gifts%20Interim%20Report%20FINAL.pdf"
PLEDGE = "https://oversight.house.gov/release/oversight-committee-requests-documents-trump-organizations-treatment-foreign-government-payments/"
EMOL = "https://constitution.congress.gov/browse/essay/artI-S9-C8-3/ALDE_00013206/"
NV = '<span class="uv-nv" style="background:#fef3c7;color:#92400e">Not yet verified, but already shaping public opinion</span>'
A = lambda u, t="Source": f'<a href="{u}" target="_blank" rel="noopener">{t} ↗</a>'
BIDEN = [("China", 8.0, "Over $8 million, CEFC and related entities. State Energy HK wired $3 million on Mar 1, 2017 (family got about $1,065,692); Northern International Capital sent $5 million to Hudson West III on Aug 8, 2017, and $400,000 went to Owasco the same day.", None, [TL, CHN]),
         ("Ukraine", 6.5, "Burisma. Committee total: $6.5 million.", None, [TL]),
         ("Russia", 3.5, "Yelena Baturina, $3.5 million to a shell company tied to Hunter Biden and Devon Archer, Feb 2014.", None, [M3, M3PDF]),
         ("Romania", 3.0, "Gabriel Popoviciu: over $3 million to a Biden associate’s account; about $1.038 million reached family accounts.", None, [TL]),
         ("Kazakhstan", 0.1423, "Kenes Rakishev, $142,300, April 2014.", None, [M3])]
TRUMP = [("China", 5572548), ("Saudi Arabia", 615422), ("Qatar", 465744), ("Kuwait", 303372), ("India", 282764), ("Malaysia", 248962), ("Afghanistan", 154750),
         ("Philippines", 74810), ("UAE", 65225), ("DR Congo", 25171), ("Kazakhstan", 23772), ("Thailand", 11340), ("Northern Cyprus", 8800), ("Mongolia", 8486),
         ("Lebanon", 7720), ("Albania", 6002), ("Kosovo", 4950), ("Latvia", 2739), ("Turkey", 1894), ("Hungary", 1011), ("Cyprus", 590)]
slug = lambda s: s.lower().replace(" ", "-").replace(".", "")

def section():
    sb = {"id": "chart-fm-biden", "type": "bar", "horizontal": True, "labels": [c for c, *_ in BIDEN], "data": [v for _, v, *_ in BIDEN], "fmt": "usdm_raw",
          "colors": ["#1e3a8a"], "hrefs": [f"fm-b-{slug(c)}" for c, *_ in BIDEN], "tips": [[f"${v:,.4g} million" if v >= 1 else "$142,300"] for _, v, *_ in BIDEN]}
    top = TRUMP[:5]
    st = {"id": "chart-fm-trump", "type": "bar", "horizontal": True, "labels": [c for c, _ in top], "data": [round(v / 1e6, 3) for _, v in top], "fmt": "usdm_raw",
          "colors": ["#a51d24"], "hrefs": [f"fm-t-{slug(c)}" for c, _ in top], "tips": [[f"${v:,}"] for _, v in top]}
    bl = "".join(f'<li id="fm-b-{slug(c)}"><b>{e(c)}</b>: {e(d)} ' + " · ".join(A(u) for u in us) + "</li>" for c, v, d, _, us in BIDEN)
    bl += f'<li id="fm-b-mexico-oman"><b>Mexico, Oman</b>: named by the committee; amounts not documented. {NV} {A(MEXOM)}</li>'
    tl = "".join(f'<li id="fm-t-{slug(c)}"><b>{e(c)}</b>: ${v:,}</li>' for c, v in TRUMP)
    js = f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat({json.dumps([sb, st], ensure_ascii=False)});</script>"
    return f"""<div id="biden-foreign-by-country"><h3 class="strip-h">Foreign money by country</h3>
<p class="period-note"><b>Committee staff records, not court or Treasury findings.</b> Same method for both: amounts as each House committee report states them. No Treasury or FinCEN master list exists for either.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px">
<div class="chart-card"><h3>Biden family and associates</h3><p class=sub>House Oversight majority. Big number: <b>over $24M</b> (2014–2019) {NV}. The committee timeline says over $20M; the impeachment report says over $27M. Tap a bar for details.</p><div class="chart-wrap"><canvas id="chart-fm-biden" role="img" aria-label="Biden family foreign money by country"></canvas></div></div>
<div class="chart-card"><h3>Trump businesses</h3><p class=sub>Oversight Democrats, “White House for Sale” (Jan 2024): <b>$7.8M from 20+ countries</b> during his presidency. Top 5 shown; tap a bar for details.</p><div class="chart-wrap"><canvas id="chart-fm-trump" role="img" aria-label="Trump businesses foreign money by country"></canvas></div><p class="period-note"><strong>Context:</strong> Trump owned international businesses before taking office. These are payments to hotels and towers he already owned, mostly room and event charges. The Biden payments went to family and associate companies with no prior foreign business (per House Oversight).</p><p class="period-note" style="margin-top:8px"><strong>He donated his salary:</strong> see <a href="trump-watch.html#tw-salary">Salary and court judgments</a> (one table, primary records). Foreign-government hotel profits given to Treasury: $151,470 (2017), $191,538 (2018), $10,577 (2020) <span class="uv-nv">Not yet verified</span> (news reports). <a href="https://oversight.house.gov/release/oversight-committee-requests-documents-trump-organizations-treatment-foreign-government-payments/" target="_blank" rel="noopener">Pledge letter ↗</a></p></div></div>
<div class="table-wrap"><table class="rank-table sf-nofold fm-cmp"><thead><tr><th></th><th>Who received it</th><th>Reached the principal?</th><th>Criminal outcome</th></tr></thead><tbody>
<tr><th scope=row>Biden</th><td>Family members and associates’ companies</td><td>$40,000 check to Joe Biden traced to China money, per the committee {A(CHN)}; direct foreign wire to Joe Biden: not documented</td><td>No charges against Joe Biden; Hunter Biden charged in 2023, pardoned Dec 1, 2024</td></tr>
<tr><th scope=row>Trump</th><td>Trump hotels and towers</td><td>Through companies he owned; direct payee: not documented</td><td>No criminal case; emoluments suits ended after he left office {A(EMOL)}</td></tr></tbody></table></div>
<details class="sf-fold" id="fm-src"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See sources</span><span class="sf-opened">Hide sources</span></summary>
<h4>Biden family, by country</h4><ul class="uv-list">{bl}</ul>
<p class="period-note">Impeachment inquiry report: “over $27 million from foreign individuals or entities” {A(IMP)}. Monthly payments from Owasco {A(OWA)}.</p>
<h4>Trump businesses, all 21 countries</h4><ul class="uv-list">{tl}</ul>
<p class="period-note">“at a minimum, $7.8 million in foreign payments from at least 20 countries during his presidency” {A(WH1, "Report")} · {A(WH2, "Report part 2")}. Unreported foreign gifts: more than 100, “over a quarter of a million dollars” {A(GIFT)}. Trump Organization pledge to donate foreign-government profits to Treasury {A(PLEDGE)}; Treasury receipts: not documented. Trump Hotel DC GSA estimate $3,787,485: Not yet verified.</p></details>{js}</div>"""
