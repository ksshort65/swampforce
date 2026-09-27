"""The Great American Betrayal section (Sep 26, 2026): betrayal.html + betrayal-brief.html.
Charts first, detail behind buttons. Sources: current site data, Grok Build site (dispatch/one-word, they-clipped-the-tape),
SuperGrok rounds 23-24 (supergrok-leads-2026-09-25.md) and the 24h result (supergrok-scotus-26A308-misleading-24h-2026-09-26.md).
Every X post below was opened via its public post page mirror on Sep 26, 2026 ~9:50 PM MT; view counts are those counters then."""
import json, re, html
e = html.escape
G = {}  # build.py globals, set by build.py

STATEMENT = "Until every claim is verified, SwampForce will not stop."
ORDER_PDF = "https://www.supremecourt.gov/opinions/25pdf/26a308_pok0.pdf"

# ---- studies: only those with a real link in either site's data ----
STUDIES = [
    ("Repetition makes a claim feel true (illusory truth effect)", "Nature Communications, 2026 · review of 182 studies", "https://www.nature.com/articles/s41467-026-70041-x"),
    ("Framing changes choices", "Tversky & Kahneman, Science, 1981", "https://gwern.net/doc/psychology/1981-tversky.pdf"),
    ("Ranking a feed by likes and shares pumps anger at the other side", "Science", "https://www.science.org/doi/10.1126/science.adu5584"),
    ("Trust in mass media at 28%, a record low", "Gallup", "https://news.gallup.com/poll/695762/trust-media-new-low.aspx"),
    ("Tone of coverage in Trump's first 100 days", "Shorenstein Center (Harvard), 2017", "https://shorensteincenter.org/news-coverage-donald-trumps-first-100-days/"),
    ("Topics of coverage in the first 100 days", "Pew Research Center, 2017", "https://www.pewresearch.org/journalism/2017/10/02/five-topics-accounted-for-two-thirds-of-coverage-in-first-100-days/"),
    ("Coverage of Biden's first 100 days", "Pew Research Center, 2021", "https://www.pewresearch.org/wp-content/uploads/sites/20/2021/04/PJ_2021.04.28_Biden-100-Days_FINAL.pdf"),
    ("TV news coverage of the second Trump administration", "Media Research Center (NewsBusters), 2025 · conservative scorekeeper", "https://newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage"),
]
ARENDT = [("The Origins of Totalitarianism", "origins"), ("Ideology and Terror (1953)", "ideology"), ("Truth and Politics (1967)", "truthpol"),
          ("Lying in Politics (1971)", "lying"), ("Interview with Roger Errera (1978)", "errera")]

# ---- Words compared (Grok Build: dispatch/they-clipped-the-tape + dispatch/one-word). case = fake-news.html case id ----
CLIPS = [
    ("Bloodbath", "If he loses it will be a bloodbath. He wants another January 6.", "Chinese car plants in Mexico. 100% tariff. “They’re not going to sell those cars.”", [("Vandalia rally video", "https://www.youtube.com/watch?v=f57dRZMS0PQ")], "54"),
    ("Dictator", "He said he will be a dictator on day one.", "Close the border. Drill, drill, drill. “After that, I’m not a dictator.”", [("Hannity town hall video", "https://www.youtube.com/watch?v=7lB3bfVg8Z8")], "32"),
    ("Fine people", "He called neo-Nazis very fine people.", "Same remarks: neo-Nazis and white nationalists “should be condemned totally.”", [("Full transcript", "https://www.politico.com/story/2017/08/15/full-text-trump-comments-white-supremacists-alt-left-transcript-241662")], "1"),
    ("Ukraine call", "Schiff read the shakedown: “make up dirt on my political opponent.”", "Those lines are not in the call memo. He later called it “part in parody.”", [("C-SPAN", "https://www.c-span.org/video/?c4820134/schiffs-parody")], "36"),
    ("Jan 6 speech", "Walk to the Capitol + fight like hell, as one order.", "“Peacefully and patriotically.” BBC joined two lines spoken 54 minutes apart.", [("Full speech text", "https://www.npr.org/2021/02/10/966396848/read-trumps-jan-6-speech-a-key-part-of-impeachment-trial"), ("BBC splice vs original", "https://www.youtube.com/watch?v=TAV5-oun3uM")], "58"),
    ("Bleach", "He told Americans to inject bleach / drink disinfectant.", "Asked doctors if UV/disinfectant research was “interesting to check.”", [("White House transcript", "https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-vice-president-pence-members-coronavirus-task-force-press-briefing-31/")], "12"),
]
SWAPS = [
    ("Kidnapped", "Arrested. Charged March 26, 2020 (SDNY, narco-terrorism); placed in U.S. custody January 3, 2026 and arraigned.", [("DOJ SDNY", "https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current"), ("State Department", "https://www.state.gov/nicolas-maduro-moros")], None),
    ("Collusion", "Durham: the FBI opened a full investigation without actual evidence of collusion. Inspector General: 17 errors and omissions in the Carter Page FISA applications.", [("Durham report", "https://www.justice.gov/storage/durhamreport.pdf"), ("Horowitz IG", "https://oig.justice.gov/reports/2019/o1912.pdf")], "11"),
    ("Muslim ban", "Proclamation 9645 covered countries, not a faith; upheld in Trump v. Hawaii.", [("Supreme Court opinion", "https://www.supremecourt.gov/opinions/17pdf/17-965_h315.pdf")], "222"),
    ("Insurrection", "No one charged under the insurrection statute, 18 U.S.C. § 2383.", [("USAO-DC charge tally", "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol"), ("18 U.S.C. § 2383", "https://www.law.cornell.edu/uscode/text/18/2383")], None),
    ("Domestic terrorists", "Parents at school boards: five days after the NSBA letter, the Attorney General ordered U.S. Attorneys and the FBI to coordinate.", [("AG memo", "https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf")], None),
]

# ---- SAVE ruling, DHS v. LWV (26A308), 24h from 11:40 AM ET Sep 25, 2026 ----
M = ["Calls SAVE “flawed” (the order makes no such finding)", "Says purges or removals start before the midterms", "States predicted harm as fact", "Leaves out the 90-day limit on removals"]
ORDER_WORDS = [
    "“Although the plaintiff organizations likely have standing, their claims likely lack merit.”",
    "No mass removals within 90 days of a federal election (NVRA): “that moratorium limits the potential impact of staying the District Court’s order in this case.”",
    "The order is a stay “pending the disposition of appeal”; it orders no removals and notes “individualized inquiries, which are permitted under federal law during this period.”",
    "Federal law bars, within 90 days of a federal election, “any program the purpose of which is to systematically remove the names of ineligible voters”; the Court: “that moratorium limits the potential impact.”",
]
GRP = ["Republican", "Democratic", "News outlets", "Advocacy & aligned groups", "Unconfirmed accounts"]
GCOL = {"Republican": "#dc2626", "Democratic": "#2563eb", "News outlets": "#a3a3a3", "Advocacy & aligned groups": "#8a8a8a", "Unconfirmed accounts": "#6b7280"}
X = "https://x.com/"
# who, group, time ET, window(1/2), views or None, words, methods(idx), url, status
SAVE = [
    ("Democracy Docket (X)", "Advocacy & aligned groups", "11:44 AM ET Sep 25", 1, 1054551, "🚨 BREAKING: In a major loss for voters, the Supreme Court ruled 6-3 to allow the Trump administration to initiate voter roll purges using a flawed database involving Americans' private data. The ruling will disproportionately impact naturalized citizens who've been wrongly flagged in the system.", [0, 1, 2], X + "DemocracyDocket/status/2103510843866423348", "v"),
    ("Marc Elias (Democratic lawyer, founder of Democracy Docket)", "Democratic", "11:48 AM ET Sep 25", 1, 587265, "🚨BREAKING: In a dangerous decision for voters, the Supreme Court authorized the Trump administration to overhaul a federal immigration database into a vast, centralized and deeply flawed database of personal information to initiate registration purges.", [0, 1], X + "marceelias/status/2103511976391606444", "v"),
    ("Eric Daugherty (@EricLDaugh, conservative commentator)", "Republican", "11:48 AM ET Sep 25", 1, 470923, "The Supreme Court 6-3 has GREENLIT the Trump administration's revamped SAVE citizenship verification database for states to PURGE the voter rolls of illegal voters during the 2026 midterms", [1], X + "EricLDaugh/status/2103512062458515770", "v"),
    ("NBC News (X)", "News outlets", "12:02 PM ET Sep 25", 1, 63948, "BREAKING: Trump administration can use expanded immigration database as it encourages states to purge voter rolls, Supreme Court rules.", [1], X + "NBCNews/status/2103515383617490977", "v"),
    ("Mother Jones (Ari Berman)", "News outlets", "1:01 PM ET Sep 25", 1, None, "“Supreme Court Allows Trump to Use Flawed Database to Vet Voter Citizenship” … “increasing the likelihood that eligible voters will be wrongly labeled as noncitizens due to faulty data and removed from the rolls.”", [0, 2], "https://www.motherjones.com/politics/2026/09/supreme-court-save-database/", "v"),
    ("Sen. Chuck Schumer (D-NY)", "Democratic", "1:48 PM ET Sep 25", 1, 151439, "The MAGA Supreme Court strikes again, putting its thumb on the scale for Trump’s election-rigging agenda. Elon Musk’s DOGE-overhauled SAVE database is ridden with errors. With this decision, thousands of American voters could be wrongly stripped from voter rolls and prevented from voting this election season.", [0, 1, 2], X + "SenSchumer/status/2103542232418550057", "v"),
    ("Attorney General Todd Blanche (@AGToddBlanche)", "Republican", "2:48 PM ET Sep 25", 1, 194384, "Huge victory for election integrity! The Supreme Court granted @TheJusticeDept’s stay in revamping the SAVE citizenship verification database, which will allow states to clear the voter rolls of illegal voters.", [1], X + "AGToddBlanche/status/2103557217748504767", "v"),
    ("Common Dreams", "News outlets", "3:17 PM ET Sep 25", 1, None, "“US Citizens ‘Could Lose Their Right to Vote’ After Supreme Court Gives Green Light to Trump’s Voter Purge Database”", [2], "https://www.commondreams.org/news/supreme-court-trump-voter-database", "v"),
    ("Rep. Ilhan Omar (D-MN)", "Democratic", "3:41 PM ET Sep 25", 1, 643834, "This is a blatant attempt to suppress the vote ahead of this year's midterm elections. Eligible voters will be disenfranchised by this flawed tool.", [0, 2], X + "Ilhan/status/2103570490518323329", "p"),
    ("Marc Elias (Texas post)", "Democratic", "4:23 PM ET Sep 25", 1, 25576, "The U.S. Supreme Court revived a flawed citizenship database that states like Texas have used to erroneously kick eligible voters off the rolls.", [0], X + "marceelias/status/2103581122085224570", "v"),
    ("The Wall Street Journal (X)", "News outlets", "4:27 PM ET Sep 25", 1, 49046, "The Supreme Court on Friday said the Trump administration could deploy a federal immigration database to check voters’ citizenship, allowing a tool the White House and some Republican-led states want to use to scrub their voter rolls.", [1], X + "WSJ/status/2103582128428462342", "v"),
    ("Scott Presler (@ScottPresler, conservative activist)", "Republican", "10:23 PM ET Sep 25", 1, 227440, "I’m asking county recorders & election officials to contact DHS for the free SAVE database … Then, you’ll have a list of ineligible voters prior to Election Day.", [1], X + "ScottPresler/status/2103671754551955916", "v"),
    ("Democracy Docket (Bluesky)", "Advocacy & aligned groups", "11:43 AM ET Sep 25", 1, None, "Same text as the Democracy Docket X post (a 12:05 PM repeat copy is counted once). Engagement: 1,571 likes, 990 reposts (read Sept 26, 2026).", [0, 1, 2], "https://bsky.app/profile/democracydocket.com/post/3mwe4esy4dt2i", "v"),
    ("Real America's Voice (YouTube, conservative outlet)", "News outlets", "4:26 PM ET Sep 25", 1, 1800, "Video title: “SCOTUS UNLOCKS VOTER ROLL PURGE, TRUMP LOCKS ARCTIC WITH XI | AMERICA'S VOICE LIVE”", [1], "https://www.youtube.com/watch?v=Hk6rFjtridE", "y"),
    ("NBC News (YouTube short)", "News outlets", "4:51 PM ET Sep 25", 1, 682, "Title: “SCOTUS allows use of database for possible voter purge.” In the clip (per SuperGrok): “the information in this database is quite inaccurate.”", [0, 1], "https://www.youtube.com/watch?v=d50bhF_eTIc", "y"),
    ("DNC Chair Ken Martin (Democratic National Committee)", "Democratic", "about 1:37 PM ET Sep 25", 1, None, "“Today’s Supreme Court ruling is an outright attack on the sacred right to vote, undermines critical privacy protections, and will lead to demands to purge eligible voters from the rolls.” The DNC release adds: “make last-ditch attempts to intimidate and purge eligible voters.”", [1, 2], "https://democrats.org/breaking-scotus-allows-trump-administration-to-access-sensitive-voter-data-opening-the-door-to-more-voter-intimidation-and-suppression/", "v"),
    ("Sen. Dick Durbin (D-IL), Senate Judiciary Democrats", "Democratic", "Sep 25", 1, None, "“an expansive and flawed database that states can use for potential voter purges” … “The Supreme Court just allowed the Trump Administration to weaponize an unreliable database against Americans’ fundamental right to vote …”", [0, 3], "https://www.judiciary.senate.gov/press/dem/releases/durbin-statement-on-supreme-court-allowing-trump-administration-to-proceed-with-flawed-voter-screening-database-ahead-of-midterms", "v"),
    ("Rep. John Larson (D-CT)", "Democratic", "about 4:18 PM ET Sep 25", 1, None, "Release: the ruling allows the Administration’s “SAVE” database, “which empowers states to use data collected from the Social Security Administration and Department of Homeland Security, to purge voters from the rolls.”", [1], "https://larson.house.gov/media-center/press-releases/larson-condemns-supreme-court-decision-allowing-use-trump-voter-purge", "v"),
    ("DHS General Counsel James Percival (Trump administration)", "Republican", "Sep 25", 1, None, "SAVE “may be used going forward.” “It’s remarkable that we had to file an emergency petition in the Supreme Court just so we can use government data to stop noncitizens from voting illegally.”", [3], "https://www.dhs.gov/news/2026/09/25/dhs-applauds-supreme-court-decision-permitting-citizenship-verification-voters", "v"),
    ("@CynicalPublius", "Unconfirmed accounts", "Sep 25 (first 12h)", 1, None, "Implied removals before the midterms (SuperGrok summary; exact words not supplied). SuperGrok view count 135,371, not confirmed.", [1], None, "n"),
    ("@Baoliaogeming64", "Unconfirmed accounts", "Sep 25 (first 12h)", 1, None, "Implied removals before the midterms (SuperGrok summary; exact words not supplied). SuperGrok view count 104,942, not confirmed.", [1], None, "n"),
    ("NAACP Legal Defense Fund (press release)", "Advocacy & aligned groups", "10:59 AM ET Sep 26", 2, None, "“allowing the Trump Administration to resume use of the flawed, expanded federal … SAVE database … serious risks of voter disenfranchisement just weeks before the 2026 Midterm elections.” “Allowing the mass challenge and removal of voters through this deeply flawed and error-prone system is a direct assault …”", [0, 2], "https://www.naacpldf.org/wp-content/uploads/DHS-v.-League-of-Women-Voters-Press-Release.pdf", "v"),
]
EXTRA = {"Democracy Docket (X)": [("Democracy Docket site article: “Supreme Court revives DHS use of flawed immigration database for voter purges”", "https://www.democracydocket.com/news-alerts/supreme-court-revives-dhs-use-of-flawed-immigration-database-for-voter-purges/")],
         "NAACP Legal Defense Fund (press release)": [("Release web page", "https://www.naacpldf.org/press-release/ldf-strongly-condemns-the-u-s-supreme-courts-decision-to-restore-trump-administrations-save-database/")]}
SAVE_ALSO = [("Elias Law Group client alert", "“The expanded SAVE system is a linchpin in the Trump Administration’s efforts to review and purge state voter rolls …”", "https://elias.law/client-alert/supreme-court-clears-way-for-expanded-save-system/")]
SAVE_ACCURATE = [("Norm Eisen (X, 1:07 PM ET, 430,592 views)", X + "NormEisen/status/2103531945024242136", "Only post in SuperGrok’s top 25 to note the 90-day NVRA bar: “we are in the 90 day statutory window when mass changes can't be made to voter lists!”"),
                 ("SCOTUSblog", "https://www.scotusblog.com/2026/09/supreme-court-clears-way-for-trump-administration-to-use-modified-voter-verification-database/", ""),
                 ("Votebeat", "https://www.votebeat.org/national/2026/09/25/supreme-court-ruling-save-system-trump-dhs-noncitizens-2026-election/", ""),
                 ("Ballotpedia", "https://news.ballotpedia.org/2026/09/25/u-s-supreme-court-allows-use-of-expanded-save-system-ahead-of-the-november-elections/", "Link from SuperGrok; page blocked our check."),
                 ("AP (via Boston Globe)", "https://www.bostonglobe.com/2026/09/25/nation/supreme-court-trump-save-database-noncitizen-voters/", "")]
SAVE_ACC_NAMES = "CNN, CBS, MoveOn (Bluesky), and the USCIS fact sheet (links not yet on file)"
SAVE_NONE = "Also searched with no statement found: RNC, NRCC, NRSC, DCCC, DSCC, White House, Heritage, ACLU, Brennan Center."
SAVE_NEUTRAL_NYV = "ABC (3.9M), @scotus_wire (1.36M), New York Times (859K), Fox News (358K), CNN (344K), AP (273K), Reuters (54K)"


def _a(label, url):
    return f'<a href="{e(url)}" target="_blank" rel="noopener">{e(label)} ↗</a>'


def _spec(spec):
    return f'<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec, ensure_ascii=False)}]);</script>'


def _fold(label, inner, cls="", sid=""):
    i = f' id="{sid}"' if sid else ""
    return f'<details class="sf-fold {cls}"{i}><summary class="btn sm sf-fold-btn"><span class="sf-closed">{label}</span><span class="sf-opened">Hide</span></summary>{inner}</details>'


TAP = '<p class="sf-tap-note">👆 Tap the chart to see the evidence behind it.</p>'


def canvas(cid, title, sub, spec, tall=False):
    return (f'<div class="chart-card"><h3>{e(title)}</h3><p class="sub">{sub}</p><div class="chart-wrap{" tall" if tall else ""}">'
            f'<canvas id="{cid}" role="img" aria-label="{e(title)}"></canvas></div></div>' + _spec(spec))


def save_block():
    views = [s[4] for s in SAVE if s[4]]
    tot = sum(views)
    gv = {g: sum(s[4] or 0 for s in SAVE if s[1] == g) for g in GRP}
    n1 = sum(1 for s in SAVE if s[3] == 1); n2 = len(SAVE) - n1
    ds = lambda w, alpha: {"label": "First 12 hours" if w == 1 else "Next 12 hours",
                           "data": [sum(1 for s in SAVE if s[1] == g and s[3] == w) for g in GRP], "color": [GCOL[g] + alpha for g in GRP]}
    gspec = {"id": "chart-save-group", "type": "bar", "labels": GRP, "stacked": True, "datasets": [ds(1, ""), ds(2, "88")], "fmt": "int",
             "hrefs": [f"save-g-{i}" for i in range(len(GRP))]}
    mspec = {"id": "chart-save-method", "type": "bar", "labels": ["“Flawed”", "Purges before midterms", "Harm as fact", "No 90-day limit"], "stacked": True, "horizontal": True, "fmt": "int",
             "datasets": [{"label": f"{'First' if w == 1 else 'Next'} 12 hours", "data": [sum(1 for s in SAVE if s[3] == w and k in s[6]) for k in range(4)], "color": "#f59e0b" + ("" if w == 1 else "88")} for w in (1, 2)],
             "hrefs": ["save-m-0", "save-m-1", "save-m-2", "save-m-3"]}
    vspec = {"id": "chart-save-views", "type": "bar", "labels": [g for g in GRP if gv[g]], "data": [gv[g] for g in GRP if gv[g]], "fmt": "int",
             "colors": [GCOL[g] for g in GRP if gv[g]], "hrefs": [f"save-g-{GRP.index(g)}" for g in GRP if gv[g]]}
    plat = lambda u: ("X" if not u or "x.com" in u else "Bluesky" if "bsky.app" in u else "YouTube" if "youtube.com" in u
                      else "Party/congressional websites" if re.search(r"democrats\.org|senate\.gov|house\.gov", u) else "Agency website" if ".gov/" in u else "News & advocacy websites")
    PL = ["X", "Bluesky", "YouTube", "News & advocacy websites", "Party/congressional websites", "Agency website", "Facebook", "Instagram", "TikTok", "Threads"]
    pspec = {"id": "chart-save-platform", "type": "bar", "labels": PL, "data": [sum(1 for s in SAVE if plat(s[7]) == p) for p in PL], "fmt": "int",
             "colors": ["#f59e0b"] * 6 + ["#6b7280"] * 4, "hrefs": ["save-items"] * len(PL)}
    ST = {"v": '<span class="badge proven">Verified: link opened, words match</span>',
          "p": '<span class="uv-nv">Link opened, words match · prediction: Not yet verified</span>',
          "n": '<span class="uv-nv">Not yet verified · no link</span>',
          "y": '<span class="badge proven">Verified: link opened, title matches</span> <span class="uv-nv">views from SuperGrok</span>'}

    def card(s):
        who, g, t, w, v, words, ms, url, st = s
        order = "".join(f'<p><b>{e(M[k])}:</b> {e(ORDER_WORDS[k])}</p>' for k in ms)
        chips = "".join(f'<span class="chip">{e(M[k])}</span>' for k in ms)
        meta = f'{e(t)} · ' + (f'{v:,} views' if v else "Views: not confirmed") + f' · {"first" if w == 1 else "next"} 12 hours'
        return (f'<article class="frame open altered-card" style="border-left:4px solid {GCOL[g]}"><div class="frame-head static"><span class="frame-tag">{e(who)} ({e(g)})</span>'
                f'<span class="frame-meta">{ST[st]}</span></div><div class="frame-body"><p class="muted" style="margin:0 0 6px">{meta}</p>'
                f'<div class="frame-cols"><div class="frame-col claim-side"><h3>Exact words</h3><p>{e(words)}</p></div>'
                f'<div class="frame-col truth-side"><h3>What the order says</h3>{order}</div></div>'
                f'<div class="chip-row">{chips}</div><div class="frame-foot">{_a("Open the post" if url and "x.com" in url else "Open the source", url) if url else "Link not supplied"}{"".join(" · " + _a(l, u) for l, u in EXTRA.get(who, []))} · {_a("Order (PDF)", ORDER_PDF)}</div></div></article>')
    groups = "".join(_fold(f'{e(g)}: {sum(1 for s in SAVE if s[1] == g)} items', "".join(card(s) for s in SAVE if s[1] == g), sid=f"save-g-{i}")
                     for i, g in enumerate(GRP) if any(s[1] == g for s in SAVE))
    methods = "".join(_fold(f'{e(M[k])}: {sum(1 for s in SAVE if k in s[6])}', "<ul class=\"uv-list\">" + "".join(
        f'<li><b>{e(s[0])}</b> · {e(s[2])} · <a href="#save-g-{GRP.index(s[1])}">See the words →</a></li>' for s in SAVE if k in s[6]) + "</ul>", sid=f"save-m-{k}") for k in range(4))
    also = "".join(f'<li><b>{e(w)}</b>: {e(q)} {_a("Source", u)}</li>' for w, q, u in SAVE_ALSO)
    acc = "".join(f'<li>{_a(n, u)}' + (f' {e(x)}' if x else "") + '</li>' for n, u, x in SAVE_ACCURATE)
    return f"""<section class="section-pad" id="uv-flawed">
 <p class="section-label">Social Media · The Great American Betrayal</p>
 <h2 class="section-title">The Social Media Weapon: the SAVE ruling (24 hours)</h2>
 <p class="section-dek">Supreme Court order 26A308, DHS v. League of Women Voters, Sept 25, 2026. Window: 11:40 AM ET Sept 25 to 11:40 AM ET Sept 26.</p>
 <div class="save-total" style="display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 16px;margin:8px 0 4px"><span style="font-size:clamp(2rem,6vw,3.4rem);font-weight:800;line-height:1">At least {tot:,} views</span><b style="font-size:1.1rem">Already shaping public opinion.</b></div>
 <p class="muted" style="margin:0 0 10px">Counts only where a view counter exists: {len(views) - 2} X posts read Sept 26, 2026, about 9:50 PM MT, plus 2 YouTube videos (2,482 views, as reported by SuperGrok). Other items’ views not confirmed. Not a complete count.</p>
 <div class="chart-grid">
  {canvas("chart-save-group", "Misleading items, by who posted", f"At least {len(SAVE)} items: {n1} in the first 12 hours, {n2} in the next 12. Tap a bar to read them.", gspec)}
  {canvas("chart-save-method", "By misleading method", "An item can use more than one method. Tap a bar for the list.", mspec)}
  {canvas("chart-save-platform", "By platform", "Facebook, Instagram, TikTok, Threads: none confirmed. Not a complete count.", pspec)}
  {canvas("chart-save-views", "Confirmed views, by who posted", "Tap a bar to read the posts.", vspec)}
 </div>
 <div class="chart-card"><h3>What the order actually says</h3><ul>
  <li><b>A stay, not a final ruling.</b> The June 22, 2026 district-court order “is stayed pending the disposition of appeal” and any petition for certiorari.</li>
  <li><b>No mass removals before the election.</b> Federal law bars, within 90 days of a federal election, “any program the purpose of which is to systematically remove the names of ineligible voters”; the Court: “that moratorium limits the potential impact.”</li>
  <li><b>Individual checks only.</b> The order notes “individualized inquiries, which are permitted under federal law during this period.” Justices Jackson, Sotomayor and Kagan dissented.</li>
 </ul><p>{_a("Read the order (Supreme Court PDF)", ORDER_PDF)}</p></div>
 <p class="notfull">Counts are a minimum (“at least”). A full census is not confirmed. Equal counts are not forced; the record decides.</p>
 <p class="period-note">Tonight’s SuperGrok pass said located Republican and center-right coverage mostly described the order as a stay limited by the 90-day rule. Last night’s top-25 pass found the same “removals before the midterms” implication from both sides; those posts are listed here.</p>
 <h3 class="strip-h" id="save-items">Every item, by who posted</h3>{groups}
 <h3 class="strip-h">By method</h3>{methods}
 <p class="muted">{e(SAVE_NONE)}</p>
 {_fold("Also located (not counted)", f'<ul class="uv-list">{also}</ul>')}
 {_fold("Described it accurately", f'<ul class="uv-list">{acc}</ul><p class="muted">Also accurate, not counted: {e(SAVE_ACC_NAMES)}.</p><p class="muted">Also rated neutral or accurate by SuperGrok, with its view counts; links and counts not yet verified: {e(SAVE_NEUTRAL_NYV)}.</p>')}
 {_fold("Our View", '<div class="opinion"><p class="opinion-label">Our View</p><p>No one is disputing it. No one is policing it. Voters can’t give informed consent when the information they get is wrong.</p></div>')}
 <div class="save-total" style="margin:14px 0 4px"><span style="font-size:clamp(1.6rem,4.5vw,2.6rem);font-weight:800;line-height:1.1">0 corrections. 0 Community Notes. 0 fact-checks.</span></div>
 <p class="muted" style="margin:0 0 6px">Checked across X, Bluesky, YouTube, Facebook, Instagram, TikTok and Threads: 0 fact-check labels, 0 corrections. PolitiFact, FactCheck.org, AP, Reuters, Snopes, Lead Stories and USA Today published nothing on how this ruling was described. Instagram posts found (CNN, Montana NAACP) were accurate. Not a complete count.</p>
 <p class="muted">Democracy Docket’s article carries only a general note, “This story has been updated with additional details throughout.” That is an update, not a correction.</p>
 {_fold("Older related fact-checks (context)", '<ul class="uv-list"><li>' + _a("FactCheck.org, March 2026: Flaws in Government Tool to ID Noncitizen Voters", "https://www.factcheck.org/2026/03/flaws-in-government-tool-to-id-noncitizen-voters/") + '</li><li>' + _a("PolitiFact, Feb. 20, 2026: Is the federal SAVE tool booting naturalized citizens from voter rolls?", "https://politifact.com/article/2026/feb/20/naturalized-citizens-save-database-florida/") + '</li></ul><p class="muted">Both predate the Sept 25 order.</p>')}
</section>""", {"total": tot, "items": len(SAVE), "first": n1, "next": n2, "groups": {g: sum(1 for s in SAVE if s[1] == g) for g in GRP}, "views_by_group": gv,
                  "social_verified": sum(1 for s in SAVE if s[7] and "x.com" in s[7] and s[8] == "v")}


def words_block(alt, altn_cards):
    rows = "".join(f'<tr><td data-l="Word"><b>{e(t)}</b></td><td data-l="What ran" class="claim-side">{e(a)}</td><td data-l="The tape">{e(b)}</td>'
                   f'<td data-l="Evidence">{" ".join(_a(l, u) for l, u in links)}' + (f' · <a href="fake-news.html#case-{c}">Case #{c} →</a>' if c else "") + '</td></tr>' for t, a, b, links, c in CLIPS)
    srows = "".join(f'<tr><td data-l="Word that ran"><b>{e(t)}</b></td><td data-l="The file">{e(f)}</td>'
                    f'<td data-l="Evidence">{" ".join(_a(l, u) for l, u in links)}' + (f' · <a href="fake-news.html#case-{c}">Case #{c} →</a>' if c else "") + '</td></tr>' for t, f, links, c in SWAPS)
    li = "".join(f'<li><span class="uv-nv">Not yet verified</span> {e(t)}' + (f' <span class="muted">· {e(p)}</span>' if p else "") + f' <span class="muted">· {e(g)}</span></li>' for g, t, p in alt)
    spec = {"id": "chart-words", "type": "bar", "horizontal": True, "fmt": "int",
            "labels": ["Altered, verified", "Clipped tape", "One-word swaps", "Altered, not yet verified"],
            "data": [altn_cards, len(CLIPS), len(SWAPS), len(alt)], "colors": ["#dc2626", "#f59e0b", "#f59e0b", "#6b7280"],
            "hrefs": ["words-altered", "words-clips", "words-swaps", "uv-altered"]}
    return spec, f"""<section class="section-pad" id="words-compared">
 <p class="section-label">Words compared</p>
 <h2 class="section-title">What they said vs. what was actually said</h2>
 {_fold(f"Clipped tape: {len(CLIPS)} cases", f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Clip</th><th>What ran</th><th>What the recording shows</th><th>Evidence</th></tr></thead><tbody>{rows}</tbody></table></div>', sid="words-clips")}
 {_fold(f"One-word swaps: {len(SWAPS)}", f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Word that ran</th><th>The file</th><th>Evidence</th></tr></thead><tbody>{srows}</tbody></table></div>', sid="words-swaps")}
 {_fold(f"Altered quotes, not yet verified: {len(alt)}", f'<ul class="uv-list">{li}</ul>', sid="uv-altered")}
</section>"""


def mechanics(secs):
    """Short cards; long text from page-header.txt behind a button. Each section used once."""
    sec = dict(secs)
    sci = [l[2:] for l in sec.get("THE SCIENCE BEHIND IT", "").splitlines() if l.startswith("- ")]
    meth = {l[2:].split(":", 1)[0]: l[2:] for l in sec.get("THE METHODS, AND THE RESEARCH THAT NAMED THEM", "").splitlines() if l.startswith("- ")}
    pick = lambda *keys: [meth.pop(k) for k in keys if k in meth]
    R = G["render_block"]
    cards = [
        ("Gaslighting", "Deny the record, then make people doubt what they saw.", None, "#uv-one-sided", "See one-sided checking", R(sec.get("GASLIGHTING", ""))),
        ("Repetition", "Say it again and again until it feels true.", STUDIES[0], "#chart-betrayal-blocks", "See the cases by year", "<ul>" + "".join(f"<li>{e(x)}</li>" for x in sci[:1] + pick("Illusory truth effect", "Anchoring / first impressions")) + "</ul>"),
        ("Framing", "Pick the slice of reality that leads to the conclusion you want.", STUDIES[1], "#words-swaps", "See one-word swaps", "<ul>" + "".join(f"<li>{e(x)}</li>" for x in sci[4:5] + pick("Framing", "Agenda-setting", "Priming", "Premature \"proven\" framing", "Policy-scope inflation")) + "</ul>"),
        ("Altered quotes & trimmed clips", "Cut the sentence so it says something the speaker did not.", None, "#words-compared", "See words compared", "<ul>" + "".join(f"<li>{e(x)}</li>" for x in pick("Contextomy / quoting out of context", "Paltering", "Omission / selective reporting", "False attribution of words or intent", "False photo or video attribution, cheap fakes, and deepfakes", "Fabrication and retracted invention")) + "</ul>"),
        ("One-sided fact-checking", "Check one side’s claims; leave the other side’s claims standing.", STUDIES[3], "#uv-one-sided", "See the gap", "<ul>" + "".join(f"<li>{e(x)}</li>" for x in pick("Confirmation bias", "Motivated reasoning")) + "</ul>"),
        ("How a word spreads", "One word, posted and reposted, reaches millions before any check.", STUDIES[2], "#uv-flawed", "See the Social Media Weapon", "<ul>" + "".join(f"<li>{e(x)}</li>" for x in sci[2:4] + pick("Moral-emotional contagion", "Misleading statistics")) + "</ul>"),
        ("Corrections never catch up", "The claim runs on the front page; the fix is buried or never comes.", None, "#chart-corr", "See how cases were corrected", R(sec.get("WHY YOU NEVER SAW THE CORRECTION", "")) + "<ul>" + "".join(f"<li>{e(x)}</li>" for x in sci[1:2] + pick("Continued influence effect")) + "</ul>"),
    ]
    rest = "<ul>" + "".join(f"<li>{e(x)}</li>" for x in meth.values()) + "</ul>" if meth else ""
    out = []
    for t, s, st, href, lbl, long in cards:
        study = f'<p class="study">Study: {_a(st[1], st[2])}</p>' if st else ""
        out.append(f'<div class="chart-card mech-card"><h3>{e(t)}</h3><p>{e(s)}</p>{study}<p><a href="{href}">{e(lbl)} →</a></p>{_fold("Read the research", long)}</div>')
    return ('<section class="section-pad" id="psych-warfare"><p class="section-label">Psychological warfare</p><h2 class="section-title">How it works</h2>'
            f'<div class="chart-grid">{"".join(out)}</div>' + (_fold("Other named methods", rest) if rest else "") + '</section>')


def studies_block():
    L = G["LAWSRC"]
    li = "".join(f'<li><b>{e(t)}</b> · {e(w)} · {_a("Study", u)}</li>' for t, w, u in STUDIES)
    ar = "".join(f'<li>Hannah Arendt, {e(t)} · {_a("Source", L[k])}</li>' for t, k in ARENDT)
    return (f'<section class="section-pad" id="studies"><p class="section-label">The studies</p><h2 class="section-title">Research cited in this section</h2>'
            f'<ul class="uv-list">{li}</ul>{_fold("Sources for the argument (Hannah Arendt)", f"<ul class=uv-list>{ar}</ul>")}'
            '<p class="muted">Other researchers named in the text below (for example Hasher 1977, Johnson & Seifert 1994, Vosoughi 2018) are listed without a link until one is on file.</p></section>')


def build(UV, UCASES):
    g = G; e_ = e
    secs = g["parse_header"]()
    used = {"THE SCIENCE BEHIND IT", "GASLIGHTING", "WHY YOU NEVER SAW THE CORRECTION", "THE METHODS, AND THE RESEARCH THAT NAMED THEM", "THE GREAT AMERICAN BETRAYAL",
            "HOW A NARRATIVE IS BUILT: THE PSYCHOLOGY BEHIND THE HEADLINES"}
    reads = []
    for raw, body in secs:
        if raw in used: continue
        nice = g["EXPL"].get(raw, raw.title())
        sid = re.sub(r"[^a-z0-9]+", "-", nice.lower()).strip("-")
        first = re.split(r"(?<=[.!?])\s", body.strip(), maxsplit=1)[0]
        op = '<span class="op-tag">Opinion: see Opinion page</span>' if "Our view:" in body else ""
        reads.append(f'<details class="read-card" id="{sid}"><summary><span class="rc-title">{e(nice)}</span>{op}'
                     f'<span class="rc-dek">{e(first[:200])}</span><span class="rc-cta">Read</span></summary>'
                     f'<div class="rc-body">{g["render_block"](body, pointer=True)}</div></details>')
    corr, ST = g["corr"], g["ST"]
    blocks, counts, sides = g["BETRAYAL_BLOCKS"], g["BETRAYAL_COUNTS"], g["BETRAYAL_SIDES"]
    save_html, sv = save_block()
    soc = [0] * len(blocks)
    if blocks and blocks[-1].startswith("2025"): soc[-1] = sv["social_verified"]
    ymap = {b: b[:4] for b in blocks}
    bspec = {"id": "chart-betrayal-blocks", "type": "bar", "labels": [b.replace("–20", "–") for b in blocks], "stacked": True, "fmt": "int",
             "datasets": [{"label": sd, "data": [counts[b][sd] for b in blocks], "color": "#8a8a8a"} for sd in sides] + [{"label": "Social media", "data": soc, "color": "#f59e0b"}],
             "hrefs": [f"block-{ymap[b]}" for b in blocks]}
    cspec = {"id": "chart-corr", "type": "doughnut", "labels": list(corr.keys()), "data": list(corr.values()),
             "colors": ["#b91c1c", "#0c2340", "#475569", "#92400e", "#166534", "#cbd5e1"], "hrefs": ["fake-news.html"] * len(corr)}
    # unverified by group (from the Not Yet Verified page)
    items = UV.nyv_items(UCASES)
    alt = UV.all_leads(UCASES)[2]
    nspec = {"id": "chart-nyv-betrayal", "type": "bar", "labels": list(UV.GROUPS), "data": [len(items[x]) for x in UV.GROUPS], "fmt": "int",
             "hrefs": [f"unverified.html#nyv-{UV.SLUG[x]}" for x in UV.GROUPS]}
    ntot = sum(len(v) for v in items.values())
    fake = g["BETRAYAL_FAKE"]
    altcards = [r for r in fake if r.get("Type") == "Altered quote"]
    wspec, words_html = words_block(alt, len(altcards))
    card = g["betrayal_card"]
    blk = []
    for b in blocks:
        frames = "".join(f'<div id="case-{e(r["Case_ID"].lower())}">{card(r)}</div>' for r in fake if r["Block"] == b and r.get("Type") != "Altered quote")
        c = counts[b]
        blk.append(_fold(f'{e(b)}: ' + " · ".join(f"{e(sd)} {c[sd]}" for sd in sides), frames or '<p class="muted">Only altered-quote cases in this period; see below.</p>', sid=f"block-{b[:4]}"))
    altc = "".join(f'<div id="case-{e(r["Case_ID"].lower())}">{card(r)}</div>' for r in altcards)
    nc = corr["Never corrected by the pusher"]
    media = UV.media_block(UCASES).replace('href="#uv-news"', 'href="unverified.html#nyv-news"').replace('href="#uv-leads-news"', 'href="unverified.html#nyv-news"')
    body = f"""
<section class="hero short" style="background-image:url('images/flag-wave.jpg')">
 <div class="hero-inner">
  <p class="hero-kicker">The narrative spine</p>
  <h1>The Great American Betrayal</h1>
  <p class="dek"><b>{e(STATEMENT)}</b></p>
  <p class="page-updated">Last updated: September 26, 2026 · By SwampForce Editor</p>
  <p><a class="btn big" href="betrayal-brief.html">For Lawmakers</a> <a class="btn ghost sm" href="#psych-warfare">How it works</a> <a class="btn ghost sm" href="#studies">The studies</a></p>
 </div>
</section>
<div class="wrap">
<section class="sf-charts-first" id="betrayal-charts">
<div class="chart-grid">
 {canvas("chart-betrayal-blocks", "Deceptions by period and by who pushed them", f"{len(fake)} verified cases, 2015–2026, plus {sv['social_verified']} verified social posts (SAVE ruling). Tap a bar for that period’s cases.", bspec, tall=True)}
 {canvas("chart-words", "Words compared: altered quotes, clips and swapped words", "Tap a bar for original vs altered.", wspec)}
 {canvas("chart-corr", "When a claim proved wrong, how was it corrected?", f"All {ST['total']} verified cases · {nc} never corrected by whoever pushed it. Tap for the cases.", cspec)}
 {canvas("chart-nyv-betrayal", "Not yet verified, but already shaping public opinion", f"{ntot} items still being checked, by who said them. Tap a bar for the list on Not Yet Verified.", nspec)}
</div>
<p class="fact-line"><a href="unverified.html">All {ntot} not-yet-verified items →</a></p>
</section>
{save_html}
<section class="section-pad" id="one-sided"><div class="chart-grid">{UV.onesided_block()}{UV.wapo_block()}</div>
{_fold("Media claims: how much is unverified", media)}</section>
{mechanics(secs)}
<section class="section-pad" id="betrayal-cases">
 <p class="section-label">The cases</p>
 <h2 class="section-title">{len(fake)} verified cases, 2015–2026</h2>
 <p class="section-dek">Each statement set against the official record. Tap a period.</p>
 {"".join(blk)}
 {_fold(f"Altered quotes on the record: {len(altcards)}", altc, sid="words-altered")}
 <p class="notfull">{e(g["BETRAYAL_NOTE"])}</p>
 <p><a href="fake-news.html">All {ST['total']} verified cases in Fake News Exposed →</a> · <a href="censorship.html">Censorship: the record →</a></p>
</section>
{words_html}
{studies_block()}
{g["why_swampforce_exists_box"]()}
{_fold("How we verify", g["betrayal_verify_box"]())}
<section class="section-pad"><p class="section-label">Read in full</p><div class="read-list">{"".join(reads)}</div>
<aside class="op-pointer big"><span class="op-tag">Opinion</span> The site owner's argument, “The Great American Betrayal,” is on the <a href="opinion.html#the-great-american-betrayal">Opinion page</a>.</aside>
{_fold("Our View", f'<aside class="pull-view"><p class="opinion-label">Our View</p><blockquote><p>{e(g["PEOPLE_VIEW"])}</p></blockquote></aside>')}</section>
</div>"""
    page = g["page"]
    bet = page("betrayal.html", "The Great American Betrayal · Swamp Force",
               "How deception works, the studies behind it, every documented case on charts, and what is still being checked.", body, charts=[{"id": "_none", "type": "bar", "labels": [], "data": []}], flush=True)
    return bet, brief(UV, UCASES, ntot, sv, len(fake), len(alt)), sv


def brief(UV, UCASES, ntot, sv, nfake, nalt):
    g = G; L = g["LAWSRC"]; corr = g["corr"]; ST = g["ST"]
    txt = dict(g["parse_header"]()).get("THE GREAT AMERICAN BETRAYAL", "")
    m = re.search(r"(\d+) cases were pushed by a sitting", txt)
    members = f"<li>{m.group(1)} cases in the record were pushed by a sitting Representative, Senator, Speaker or party leader.</li>" if m else ""
    hd = g["HOUSE_DISCIPLINE"]
    body = f"""<section class="band-hero slim"><div class="wrap"><p class="hero-kicker">For Lawmakers · The Great American Betrayal</p><h1>Betrayal brief</h1>
<p class="dek"><b>{e(STATEMENT)}</b></p></div></section>
<div class="wrap section-pad">
<h2 class="section-title">What’s documented</h2><ul>
<li>{nfake} deception cases, 2015–2026, each set against the official record (<a href="betrayal.html#betrayal-cases">cases</a>).</li>
<li>{corr["Never corrected by the pusher"]} of {ST["total"]} verified cases were never corrected by whoever pushed them (<a href="betrayal.html#chart-corr">chart</a>).</li>
{members}
<li>SAVE ruling (26A308): at least {sv["items"]} misleading items in 24 hours; at least {sv["total"]:,} confirmed views. The order stays a lower-court ruling and notes the 90-day bar on systematic removals (<a href="betrayal.html#uv-flawed">item</a>, {_a("order", ORDER_PDF)}).</li>
<li>The House has expelled {hd["expelled"]} members and censured {hd["censured"]} in its history ({_a("House Historian", L["discipline"])}).</li>
</ul>
<h2 class="section-title">What’s not yet verified</h2><ul>
<li>{ntot} items still being checked, by who said them (<a href="unverified.html">Not Yet Verified</a>).</li>
<li>{nalt} altered-quote leads (<a href="betrayal.html#uv-altered">list</a>).</li>
<li>View counts for items without a readable counter; corrections or Community Notes on the SAVE posts.</li>
</ul>
<div class="opinion"><p class="opinion-label">Our View · What we ask Congress to do</p><ul>
<li>Apply existing discipline to documented false statements by members, the same way for both parties.</li>
<li>Require corrections to run with the same placement and reach as the original claim.</li>
<li>Hold hearings on one-sided fact-checking and on feeds that reward outrage.</li>
<li>Fund and publish a public record of claims set against official records.</li>
</ul></div>
<p><a class="btn" href="betrayal.html">Back to The Great American Betrayal</a> <a class="btn ghost-dark sm" href="brief.html">Full staff brief</a></p>
</div>"""
    return g["page"]("betrayal-brief.html", "Betrayal brief for lawmakers · Swamp Force", "What is documented, what is not yet verified, and what we ask Congress to do.", body, flush=True)
