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

# ---- SAVE ruling, DHS v. LWV (26A308), Sept 25–27, 2026 ----
ORDER_WORDS = [
    "A stay, not a final ruling: the June 22, 2026 district-court order is stayed pending appeal and any timely petition for certiorari.",
    "Federal law bars, within 90 days of a federal election, any program whose purpose is to systematically remove the names of ineligible voters.",
    "The Court wrote: “To be sure, that moratorium limits the potential impact of staying the District Court's order.” The order notes individualized inquiries are permitted; it orders no removals.",
]
GRP = ["Democratic", "Republican/Trump administration", "News", "Advocacy", "Social media"]
GCOL = {"Democratic": "#2563eb", "Republican/Trump administration": "#dc2626", "News": "#a3a3a3", "Advocacy": "#0f766e", "Social media": "#f59e0b"}
X = "https://x.com/"
# who, group, where, when ET, views or None, short quote, links (zero or more)
SAVE = [
    ("Chuck Schumer", "Democratic", "X", "1:48 PM", 151430, "The MAGA Supreme Court strikes again ... thousands of American voters could be wrongly stripped from voter rolls.", [(X + "SenSchumer/status/2103542232418550057",)]),
    ("Ilhan Omar", "Democratic", "X", "3:41 PM", 644202, "This is a blatant attempt to suppress the vote ... Eligible voters will be disenfranchised by this flawed tool.", [(X + "Ilhan/status/2103570490518323329",)]),
    ("DNC chair Ken Martin", "Democratic", "democrats.org", "1:37 PM", None, "The ruling ... will lead to demands to purge eligible voters from the rolls.", [("https://democrats.org/breaking-scotus-allows-trump-administration-to-access-sensitive-voter-data-opening-the-door-to-more-voter-intimidation-and-suppression/",)]),
    ("Sen. Dick Durbin", "Democratic", "Senate Judiciary site + X", "Sept 25", 22009, "An expansive and flawed database that states can use for potential voter purges ... weaponize an unreliable database.", [("https://www.judiciary.senate.gov/press/dem/releases/durbin-statement-on-supreme-court-allowing-trump-administration-to-proceed-with-flawed-voter-screening-database-ahead-of-midterms",), ("https://x.com/JudiciaryDems/status/2103593191014334481",), ("https://x.com/JudiciaryDems/status/2103595404793417737",)]),
    ("Rep. John Larson", "Democratic", "house.gov", "4:18 PM", None, "The ruling allows the SAVE database ... to purge voters from the rolls.", [("http://larson.house.gov/media-center/press-releases/larson-condemns-supreme-court-decision-allowing-use-trump-voter-purge",)]),
    ("Democracy Docket", "Democratic", "X (also Bluesky, website)", "11:44 AM", 1164353, "The Supreme Court ruled 6-3 to allow ... voter roll purges using a flawed database. Bluesky copy: 1,571 likes, 990 reposts.", [(X + "DemocracyDocket/status/2103510843866423348",), ("https://bsky.app/profile/democracydocket.com/post/3mwe4esy4dt2i",), ("https://www.democracydocket.com/news-alerts/supreme-court-revives-dhs-use-of-flawed-immigration-database-for-voter-purges/",)]),
    ("Marc Elias", "Democratic", "X", "11:48 AM", 588092, "The Supreme Court authorized the Trump administration ... to initiate registration purges.", [(X + "marcelias/status/2103511976391606444",), ("https://elias.law/client-alert/supreme-court-clears-way-for-expanded-save-system/",)]),
    ("AG Todd Blanche", "Republican/Trump administration", "X", "2:48 PM", 194544, "Huge victory for election integrity! ... [the stay] will allow states to clear the voter rolls of illegal voters.", [(X + "AGToddBlanche/status/2103557217748504767",)]),
    ("DHS (James Percival)", "Republican/Trump administration", "dhs.gov + X", "Sept 25; X 12:26 PM", 307861, "SAVE may be used going forward ... to stop noncitizens from voting illegally.", [("https://www.dhs.gov/news/2026/09/25/dhs-applauds-supreme-court-decision-permitting-citizenship-verification-voters",), ("https://x.com/DHSGenCounsel/status/2103521437407719881",)]),
    ("NBC News", "News", "X + YouTube", "Sept 25; YouTube 4:51 PM", 64641, "The information in this database is quite inaccurate.", [(X + "NBCNews/status/2103515383617490977",), ("https://www.youtube.com/watch?v=d50bhF_eTIc",)]),
    ("Wall Street Journal", "News", "X", "Sept 25", 49063, "The Court ... could deploy a federal immigration database to check voters' citizenship.", [(X + "WSJ/status/2103582128428462342",)]),
    ("Reuters", "News", "reuters.com headline + reprints", "11:34 AM", None, "Headline: Supreme Court restores Trump's mass voter verification system.", [("https://www.reuters.com/world/supreme-court-restores-trumps-mass-voter-verification-system-2026-09-25/",), ("https://www.cnbc.com/2026/09/25/supreme-court-restores-trumps-mass-voter-verification-system.html",), ("https://www.livemint.com/news/us-news/trumps-voter-verification-system-returns-what-changed-after-supreme-court-ruling-11790365501392.html",)]),
    ("Mother Jones", "News", "website", "Sept 25", None, "Supreme Court Allows Trump to Use Flawed Database to Vet Voter Citizenship.", [("https://www.motherjones.com/politics/2026/09/supreme-court-save-database/",)]),
    ("Common Dreams", "News", "website", "Sept 25", None, "US Citizens Could Lose Their Right to Vote after the Court gives a green light to Trump's voter purge database.", [("https://www.commondreams.org/news/supreme-court-trump-voter-database",)]),
    ("Real America's Voice", "News", "YouTube", "4:26 PM", 1800, "SCOTUS UNLOCKS VOTER ROLL PURGE.", [("https://www.youtube.com/watch?v=Hk6rFjtridE",)]),
    ("NAACP Legal Defense Fund", "Advocacy", "naacpldf.org", "Sept 26, 10:59 AM", None, "Allowing the mass challenge and removal of voters through this deeply flawed and error-prone system is a direct assault.", [("https://www.naacpldf.org/press-release/ldf-strongly-condemns-the-u-s-supreme-courts-decision-to-restore-trump-administrations-save-database/",)]),
    ("League of Women Voters & EPIC (plaintiffs)", "Advocacy", "statement quoted by NPR", "Sept 25", None, "The ruling puts millions of Americans at risk of being unlawfully targeted ... weeks before the midterm elections.", [("https://www.npr.org/2026/09/25/nx-s1-5976804/supreme-court-trump-save-noncitizen-voting",)]),
    ("Libs of TikTok", "Social media", "X", "12:32 PM", 1287764, "All illegal voters need to be REMOVED from the voter rolls.", [(X + "libsoftiktok/status/2103523106434285971",)]),
    ("Eric Daugherty", "Social media", "X", "11:48 AM", 471006, "GREENLIT ... PURGE the voter rolls of illegal voters during the 2026 midterms.", [(X + "EricLDaugh/status/2103512062458515770",)]),
    ("CynicalPublius", "Social media", "X", "Sept 25, 3:10 PM", 206132, "TRANSLATION… Trump is eliminating illegal alien, non-citizens from the voter rolls and SCOTUS affirmed this effort.", [(X + "CynicalPublius/status/2103562729416171789",)]),
    ("Baoliaogeming64", "Social media", "X", "Sept 25", None, "Exact quote not supplied in the report.", []),
    ("Scott Presler", "Social media", "X", "10:23 PM", 290657, "I'm asking county recorders and election officials to contact DHS for the free SAVE database ...", [(X + "ScottPresler/status/2103671754551955916",), (X + "ScottPresler/status/2103680373335175174",)]),
    ("derekjonhsonn", "Social media", "X", "Sept 26, 7:21 PM", 507, "DOGE-enhanced federal SAVE database ... is GREENLIT ... Clean the rolls.", [(X + "derekjonhsonn/status/2103988486260892098",)]),
    ("MelG_Gibson", "Social media", "X", "Sept 26, 7:57 PM", 179, "SAVE Database to purge illegal aliens from voter rolls.", [(X + "MelG_Gibson/status/2103997295867916796",)]),
    ("Josh Howerton", "Social media", "X", "Sept 26, 7:58 PM", 253, "The 6–3 is the green light. Drive it. Purge the rolls.", [(X + "commentaryhower/status/2103997664874332287",)]),
]


def _a(label, url):
    return f'<a href="{e(url)}" target="_blank" rel="noopener">{e(label)} ↗</a>'


def _spec(spec):
    return f'<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec, ensure_ascii=False)}]);</script>'


def _fold(label, inner, cls="", sid=""):
    i = f' id="{sid}"' if sid else ""
    return f'<details class="sf-fold {cls}"{i}><summary class="btn sm sf-fold-btn"><span class="sf-closed">{label}</span><span class="sf-opened">Hide</span></summary>{inner}</details>'


TAP = '<p class="sf-tap-note">👆 Tap the chart to see the evidence behind it.</p>'


def canvas(cid, title, sub, spec, tall=False):
    klass = " tall" if tall else ""
    return (f'<div class="chart-card"><h3>{e(title)}</h3><p class="sub">{sub}</p><div class="chart-wrap{klass}">'
            f'<canvas id="{cid}" role="img" aria-label="{e(title)}"></canvas></div></div>' + _spec(spec))


def save_block():
    views = [s[4] for s in SAVE if s[4] is not None]
    tot = sum(views)
    # The table's five editorial groups intentionally total 7 / 2 / 6 / 2 / 8.
    gv = {g: sum(1 for s in SAVE if s[1] == g) for g in GRP}
    sorted_rows = sorted(enumerate(SAVE, 1), key=lambda x: (x[1][4] is None, -(x[1][4] or 0)))
    labels = [f"{s[0]} — {s[4]:,} views" if s[4] is not None else f"{s[0]} — views pending" for _, s in sorted_rows]
    colors = [GCOL[s[1]] for _, s in sorted_rows]
    hrefs = [f"save-row-{i}" for i, _ in sorted_rows]
    vspec = {"id": "chart-save-sources", "type": "bar", "horizontal": True, "labels": labels,
             "data": [s[4] or 0 for _, s in sorted_rows], "fmt": "int", "colors": colors, "hrefs": hrefs}
    gspec = {"id": "chart-save-group", "type": "bar", "labels": GRP, "data": [gv[g] for g in GRP], "fmt": "int",
             "colors": [GCOL[g] for g in GRP], "hrefs": [f"save-group-{i}" for i in range(len(GRP))]}
    def links(ls):
        return " · ".join(_a("source" if i == 0 else f"source {i+1}", u[0]) for i, u in enumerate(ls)) if ls else '<span class="muted">link not provided</span>'
    rows = []
    for i, (who, group, where, when, views_n, quote, ls) in enumerate(SAVE, 1):
        rows.append(f'<tr id="save-row-{i}"><td data-l="#" class="num">{i}</td><td data-l="Who"><b>{e(who)}</b></td><td data-l="Group">{e(group)}</td><td data-l="Where">{e(where)}</td><td data-l="When (ET)">{e(when)}</td><td data-l="Views" class="num">{f"{views_n:,}" if views_n is not None else "views pending"}</td><td data-l="Fact-checks (0)" class="num">0</td><td data-l="What they said">{e(quote)}</td><td data-l="Link">{links(ls)}</td></tr>')
    table = '<div class="table-wrap save-table-wrap sf-nofold"><table class="watch-table"><thead><tr><th>#</th><th>Who</th><th>Group</th><th>Where</th><th>When (ET)</th><th>Views</th><th>Fact-checks (0)</th><th>What they said</th><th>Link</th></tr></thead><tbody>' + ''.join(rows) + '</tbody><tfoot><tr><td colspan="5"><b>Total shown views</b></td><td class="num"><b>{:,}</b></td><td class="num"><b>0</b></td><td colspan="2"></td></tr></tfoot></table></div>'.format(tot)
    order = '<div class="chart-card"><h3>What the order actually says</h3><ul>' + ''.join(f'<li>{e(x)}</li>' for x in ORDER_WORDS) + f'</ul><p>{_a("Read the order (Supreme Court PDF)", ORDER_PDF)}</p></div>'
    return f'''<section class="section-pad" id="uv-flawed">
 <p class="section-label">Social Media · The Great American Betrayal</p>
 <h2 class="section-title">The Social Media Weapon: the SAVE ruling (Sept. 25–27)</h2>
 <p class="section-dek">This is what is dividing us.</p>
 <p class="muted">Supreme Court order 26A308, DHS v. League of Women Voters. Dates and times are ET.</p>
 <div class="save-total" style="display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 24px;margin:8px 0 4px"><span style="font-size:clamp(1.7rem,4.5vw,2.8rem);font-weight:800;line-height:1">25 people and organizations</span><span style="font-size:clamp(1.7rem,4.5vw,2.8rem);font-weight:800;line-height:1">{tot:,} views</span><span style="font-size:clamp(1.7rem,4.5vw,2.8rem);font-weight:800;line-height:1">0 fact-checks</span><b style="font-size:1.1rem">Already shaping public opinion.</b></div>
 <p class="muted" style="margin:0 0 10px">The real reach is much higher. Views on the social media posts sharing the press releases are being added.</p>
 <p class="muted">Not searched: Facebook, Instagram, Threads, TikTok, most TV and radio, podcasts and newsletters could not be searched, so the real reach is higher.</p>
 <div class="chart-grid">{canvas("chart-save-sources", "All 25 sources, sorted by views", "Bars with no count are listed at the bottom as views pending; colors identify the group.", vspec, tall=True)}{canvas("chart-save-group", "By group", "Democratic 7 · Republican 2 · News 6 · Advocacy 2 · Social media 8.", gspec)}</div>
 <h3 class="strip-h" id="save-items">Full list</h3>
 {table}
 {order}
 <div class="save-total" style="margin:14px 0 4px"><span style="font-size:clamp(1.6rem,4.5vw,2.6rem);font-weight:800;line-height:1.1">0 fact-checks</span></div>
 <p class="muted">Checked: PolitiFact, FactCheck.org, AP, Reuters, Snopes, Lead Stories, USA Today, and X Community Notes.</p>
 </section>''', {"total": tot, "items": len(SAVE), "first": 25, "next": 0, "groups": gv, "views_by_group": {g: sum(s[4] or 0 for s in SAVE if s[1] == g) for g in GRP}, "social_verified": sum(1 for s in SAVE if s[1] == "Social media" and s[6])}

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
