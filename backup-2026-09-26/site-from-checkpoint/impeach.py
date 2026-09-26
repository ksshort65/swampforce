"""'Trump's two impeachments' box (lawfare.html #impeachments). From /workspace/_project-state/supergrok-impeachments-2026-09-26.md
and owner-supplied C-SPAN links; checked Sep 26, 2026 against only those links. Unconfirmed items are labeled 'Not yet verified'."""
A = lambda u, t: f'<a class="btn sm" href="{u}" target="_blank" rel="noopener">{t} ↗</a>'
L = lambda u, t: f'<a href="{u}" target="_blank" rel="noopener">{t} ↗</a>'
NV = '<span class="uv-nv">Not yet verified</span>'
HR755 = "https://www.congress.gov/bill/116th-congress/house-resolution-755/text"
SEN20 = "https://www.congress.gov/116/crec/2020/02/05/CREC-2020-02-05-senate.pdf"
ESSAY = "https://constitution.congress.gov/browse/essay/artII-S4-4-9/ALDE_00000035/"
MEMO = "https://www.govinfo.gov/content/pkg/CDOC-117sdoc2/pdf/CDOC-117sdoc2.pdf"
CR21 = "https://www.govinfo.gov/content/pkg/CREC-2021-03-01/html/CREC-2021-03-01-pt1-PgS924-2.htm"
V1 = "https://www.c-span.org/clip/us-senate/user-clip-raskin---house-impeachment-video-evidence/4944581"
V3 = "https://www.c-span.org/video/?508916-4/impeachment-trial-day-4-senators-questions"
V4 = "https://www.c-span.org/video/?c4945671/attorney-president-trump-calls-impeachment-trial-divisive-unconstituional"
def section():
    return f"""<section class="lf-charts" id="impeachments"><h2>Trump’s two impeachments</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
<div class="chart-card"><h3>First (H.Res. 755, 2019–20)</h3>
<p>House, Dec 18, 2019: Article I 230–197, Article II 229–198 {NV}</p>
<p>Senate, Feb 5, 2020: acquitted, guilty 48 / not guilty 52 and guilty 47 / not guilty 53.</p>
<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">The call-memo lines</span><span class="sf-opened">Hide</span></summary>
<p class="period-note">July 25, 2019 call memo (a summary, not a verbatim transcript): “do us a favor though…” (CrowdStrike/server) and “There’s a lot of talk about Biden’s son…” {NV}</p></details></div>
<div class="chart-card"><h3>Second (Feb 2021)</h3>
<p>Defense memo: “Nearly twenty minutes into his speech, Mr. Trump said ‘I know that everyone here will soon be marching over to the Capitol building to peacefully and patriotically make your voices heard.’”</p>
<p class="period-note">Edited clip shown at trial. {NV} Official records do not list which clips were played or which words were cut.</p>
<p><strong>Watch the videos and compare.</strong></p>
<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
{A(V1, "Watch: House managers’ 13-minute video, Feb. 9, 2021")}
{A(MEMO, "Read: the line in his full speech, “…peacefully and patriotically make your voices heard.”")}
{A(V3, "Watch: Defense, Feb. 12, 2021: “When you get caught doctoring the evidence your case is over.”")}
{A(V4, "Watch: Defense “fight” montage of Democrats")}</div></div></div>
<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">See sources</span><span class="sf-opened">Hide sources</span></summary>
<p class="period-note">Confirmed Sep 26, 2026: Senate votes ({L(SEN20, "Cong. Record, Feb 5, 2020")}; {L(ESSAY, "Constitution Annotated")}); defense memo sentence ({L(MEMO, "S. Doc. 117-2")}); {L(CR21, "Cong. Record, Mar 1, 2021")}; the House managers’ clip and the “fight” montage pages load on C-SPAN. Not yet verified: House votes and call-memo lines ({L(HR755, "H.Res. 755")} did not load for our check); the Feb 12 day-4 C-SPAN page (blocked our check) and its quote; which words were cut from the clip.</p></details></section>"""
