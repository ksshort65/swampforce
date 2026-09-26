"""NY civil fraud (People v. Trump, 452564/2022) charts merged into lawfare.html docket 1: 'Ordered vs now' and
'Mar-a-Lago: every value on record'. From supergrok-case-deep-NYfraud / supergrok-maralago-values (Sep 26, 2026), checked against
only the links in those files. Unconfirmed figures are labeled 'Not yet verified'; no record = 'Not documented' (never 0)."""
import json
TRIAL = "https://ag.ny.gov/sites/default/files/decisions/trump-decision.pdf"
APPDIV = "https://www.nycourts.gov/reporter/3dseries/2025/2025_04756.htm"
PAO = "https://pbcpao.gov/Property/RenderPrintSum?parcelId=50434335000020390"
DEED = "https://ag.ny.gov/sites/default/files/2023-10/px-01013-2002-deed-of-development-rights-mar-a-lago.pdf"
PX3041 = "https://ag.ny.gov/sites/default/files/2023-10/px-03041-defendants-response-to-plaintiffs-202.8-g-statement.pdf"
L = lambda u, t: f'<a href="{u}" target="_blank" rel="noopener">{t} ↗</a>'
NV = '<span class="uv-nv">Not yet verified</span>'
ML = [  # label, $M, color, tip, verified
 ("County market value 2011–21 ($18M–$27.6M)", 27.6, "#64748b", "Summary-judgment order figure; that order was not in our source links", False),
 ("2020 assessed value (Trump Org agreed)", 26.6, "#64748b", "Trump Org withdrew its appeal, “stating that it agreed with the $26.6 million determination” (trial decision)", True),
 ("Trump statements 2011–21 ($405M–$739M)", 739, "#b91c1c", "Trial decision: “the SFCs’ values for that decade range from $405 million to $739 million”", True),
 ("Defense expert Moens, 2011 (as a private home)", 655, "#7c3aed", "Defendants’ response, PX-3041", True),
 ("Defense expert Moens, 2021 (as a private home)", 1040, "#7c3aed", "Defendants’ response, PX-3041", True),
 ("Moens, 2021 with memberships", 1215, "#7c3aed", "Trial transcript page not linked in our source", False),
 ("County market value 2022", 31.0, "#475569", "Palm Beach County Property Appraiser", True),
 ("County market value 2024", 49.15, "#475569", "Palm Beach County Property Appraiser ($49,150,974)", True),
 ("County market value 2026", 65.38, "#475569", "Palm Beach County Property Appraiser ($65,379,922)", True),
]
def section():
    c1 = {"id": "chart-nyf-ordered", "type": "bar", "labels": ["Ordered (Feb 2024)", "Now (after Aug 21, 2025)"], "data": [464.58, 0],
          "fmt": "usdm", "colors": ["#b91c1c", "#0c2340"], "hrefs": ["nyf-more", "nyf-more"],
          "tips": [["$464,576,230.62 total, trial decision"], ["Disgorgement vacated in its entirety, Appellate Division"]]}
    c2 = {"id": "chart-nyf-mal", "type": "bar", "horizontal": True, "labels": [x[0] + ("" if x[4] else " · Not yet verified") for x in ML],
          "data": [x[1] for x in ML], "fmt": "usdm", "colors": [x[2] + ("" if x[4] else "66") for x in ML],
          "tips": [[x[3]] for x in ML], "hrefs": ["nyf-mal-more"] * len(ML)}
    js = f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat({json.dumps([c1, c2], ensure_ascii=False)});</script>"
    return f"""<div class="chart-card" id="nyf-ordered"><h3>Ordered vs now</h3><p class=sub>Civil case under Executive Law § 63(12), not criminal. The Appellate Division vacated the money award on Aug 21, 2025. {L(APPDIV, "App. Div.")}</p>
<div class="chart-wrap"><canvas id="chart-nyf-ordered" role="img" aria-label="Ordered versus now"></canvas></div></div>
<details class="sf-fold" id="nyf-more"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See the details</span><span class="sf-opened">Hide the details</span></summary>
<ul class="uv-list">
<li>Interest savings (AG expert): Doral $72,908,308; Old Post Office $53,423,209; Chicago $17,443,359; 40 Wall $24,265,291; total $168,040,168. Vacated.</li>
<li>Old Post Office sale profit $126,828,600: vacated. Ferry Point $60,000,000: vacated.</li>
<li>Also vacated: $4,013,024 each for Donald Trump Jr. and Eric Trump; sanctions on defense counsel. Liability, the monitor and the bans were otherwise affirmed. Court of Appeals: not documented.</li>
<li>Lender losses: the trial decision says “it is undisputed that defendants have made all required payments on time.”</li>
<li>Trump Tower triplex: valued as 30,000 sq ft; property records showed 10,996 sq ft (trial decision).</li></ul>
<p class="period-note">{L(TRIAL, "Trial decision (PDF)")} · {L(APPDIV, "Appellate Division, Aug 21, 2025")}</p></details>
<div class="chart-card" id="nyf-mal"><h3>Mar-a-Lago: every value on record</h3><p class=sub>County values it as a club (deed-restricted). The statements and the expert value it as a private home. Faded = Not yet verified. Tap a bar for the source.</p>
<div class="chart-wrap tall"><canvas id="chart-nyf-mal" role="img" aria-label="Mar-a-Lago values"></canvas></div></div>
<details class="sf-fold" id="nyf-mal-more"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See sources</span><span class="sf-opened">Hide sources</span></summary>
<ul class="uv-list"><li>Purchase prices: $5M (1985) and $12M (1995) {NV}.</li>
<li>Trump: “worth a billion dollars — or more” {NV} (news coverage only).</li>
<li>AG expert residential sale value: not documented. Trial decision: Mar-a-Lago values 2011–2021 were fraudulent; the Appellate Division ordered no new appraisal.</li></ul>
<p class="period-note">{L(TRIAL, "Trial decision")} · {L(PX3041, "PX-3041 (Moens values)")} · {L(PAO, "County appraiser")} · {L(DEED, "2002 deed")}</p></details>{js}"""
