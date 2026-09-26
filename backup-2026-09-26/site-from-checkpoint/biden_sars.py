"""'Biden family bank reports' (democrats.html). Built from /workspace/_project-state/supergrok-biden-SARs-2026-09-26.md;
each sentence checked Sep 26, 2026 against only the links in that file. Unconfirmed figures say 'Not yet verified'."""
import json, html
e = lambda s: html.escape(s, quote=True)
O1 = "https://oversight.house.gov/release/comer-probes-hunter-bidens-suspicious-foreign-business-transactions-flagged-by-u-s-banks/"
O2 = "https://oversight.house.gov/release/comer-blasts-the-treasury-department-for-refusing-to-provide-the-biden-familys-suspicious-activity-reports/"
HEAR = "https://www.congress.gov/event/118th-congress/house-event/116254/text"
O3 = "https://oversight.house.gov/release/icymi-comer-reveals-evidence-of-president-bidens-involvement-in-his-familys-business-schemes/"
O4 = "https://oversight.house.gov/release/comer-treasury-department-caves-provides-access-to-biden-family-their-associates-sars/"
IND = "https://www.justice.gov/d9/2023-09/23-cr-00061%20(Indictment).pdf"
PARD = "https://www.justice.gov/pardon/pardons-granted-president-joseph-biden-2021-2025"
NV = '<span class="uv-nv">Not yet verified</span>'
NVS = '<span class="uv-nv" style="background:#fef3c7;color:#92400e">Not yet verified, but already shaping public opinion</span>'

def _tile(n, l, sub=""):
    return (f'<div class="stat"><div class="num">{n}</div><div class="lbl">{l}</div>' + (f'<div class="sub">{sub}</div>' if sub else "") + "</div>")

def section():
    tiles = "".join([
        _tile("150+", "Bank reports, per House Oversight", NVS + f' Oversight’s number, first attributed to media reports; never confirmed by FinCEN. <a href="{O1}" target="_blank" rel="noopener">May 25, 2022 ↗</a>'),
        _tile("$24M+", "From foreign sources, per Oversight bank records", NVS),
        _tile("0", "Charges against Joe Biden", f'<a href="{PARD}" target="_blank" rel="noopener">DOJ record ↗</a>'),
        _tile("2", "Pardons: Hunter 12/1/2024; family 1/19/2025", f'<a href="{PARD}" target="_blank" rel="noopener">Pardon Attorney ↗</a>'),
    ])
    ev = [("May 2022", "Oversight: 150+ transactions flagged", "bs-src"), ("Mar 2023", "Treasury gives in camera access", "bs-src"),
          ("2023", "Hunter charged (Delaware; California)", "bs-src"), ("Dec 2024", "Hunter pardoned", "bs-src"), ("Jan 2025", "Family members pardoned", "bs-src")]
    spec = {"id": "chart-biden-sars", "type": "bar", "horizontal": True, "labels": [f"{d}: {t}" for d, t, _ in ev], "data": [1] * len(ev),
            "colors": ["#1e3a8a", "#1e3a8a", "#475569", "#7c3aed", "#7c3aed"], "fmt": "int", "max": 1, "hrefs": [h for _, _, h in ev]}
    return f"""<section class="doc-section" id="biden-bank-reports"><h2>Biden family bank reports</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:10px 0">{tiles}</div>
<div class="chart-card"><h3>Timeline</h3><p class=sub>Tap an event for its source.</p><div class="chart-wrap"><canvas id="chart-biden-sars" role="img" aria-label="Biden family bank reports timeline"></canvas></div></div>
<p class="period-note">FinCEN has never published an official count. Oversight first attributed the 150 figure to media reports. No report is documented as naming Joe Biden personally.</p>
{__import__("foreign_money").section()}
<details class="sf-fold" id="bs-src"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See sources</span><span class="sf-opened">Hide sources</span></summary><ul class="uv-list">
<li>May 25, 2022, House Oversight (then minority): “More than 150 international business transactions tied to Hunter or James Biden were flagged by U.S. banks in SARs filed with the U.S. Department of the Treasury.” The same release says “According to recent media reports…” <a href="{O1}" target="_blank" rel="noopener">Release ↗</a></li>
<li>Sep 3, 2022: “at least 150 suspicious activity reports.” <a href="{O2}" target="_blank" rel="noopener">Release ↗</a></li>
<li>House hearing: “according to six different banks in the suspicious activity reports.” Banks not named. <a href="{HEAR}" target="_blank" rel="noopener">Transcript ↗</a></li>
<li>Nov 17, 2022: accounts of Hunter and Joe Biden “commingled if not shared”; “red flags were raised by banks.” Not a report naming Joe Biden. <a href="{O3}" target="_blank" rel="noopener">Release ↗</a></li>
<li>Mar 14, 2023: Treasury provides the committee “in camera review” of the reports. <a href="{O4}" target="_blank" rel="noopener">Release ↗</a></li>
<li>Over $24M from foreign sources (Oversight bank memos): {NV}; no link in our source file.</li>
<li>Hunter Biden: Docket 1:23-cr-00061 (D. Del.) and 2:23-CR-00599 (C.D. Cal.), listed in his Dec 1, 2024 pardon. <a href="{PARD}" target="_blank" rel="noopener">Pardon Attorney ↗</a> · <a href="{IND}" target="_blank" rel="noopener">Indictment (PDF) ↗</a> ({NV}: the PDF did not load for us)</li>
<li>Jan 19, 2025: pardons for Francis W. Biden, James B. Biden, Sara Jones Biden, John T. Owens and Valerie Biden Owens. <a href="{PARD}" target="_blank" rel="noopener">Pardon Attorney ↗</a></li>
<li>Charges against Joe Biden: none in the DOJ records above. No House impeachment vote.</li></ul></details>
<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec, ensure_ascii=False)}]);</script></section>"""
