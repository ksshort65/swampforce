

L.update({
    "doj_vid": ("Official video: DOJ/DHS/HHS press conference, Jun 11, 2026", "https://www.youtube.com/watch?v=A8vR-XESWHE&t=493s"),
    "doj_page": ("Justice Department video page", "https://www.justice.gov/opa/video/doj-dhs-hhs-hold-press-conference-efforts-safeguard-unaccompanied-alien-children"),
    "oig25": ("DHS Inspector General, OIG-25-21", "https://www.oig.dhs.gov/sites/default/files/assets/2025-03/OIG-25-21-Mar25.pdf"),
    "hhsoig": ("HHS Inspector General, OEI-07-21-00250", "https://oig.hhs.gov/reports/all/2024/gaps-in-sponsor-screening-and-followup-raise-safety-concerns-for-unaccompanied-children/"),
    "hhs23": ("HHS release, Jun 2, 2023", "https://www.hhs.gov/about/news/2023/06/02/in-newly-released-audit-report-hhs-announces-new-accountability-team-additional-efforts-protect-safety-well-being-unaccompanied-children.html"),
    "dhs_nov": ("DHS release, Nov 14, 2025", "https://www.dhs.gov/news/2025/11/14/ice-and-state-local-law-enforcement-287g-partners-launch-initiative-protect"),
    "dhs_jul": ("DHS release, Jul 25, 2025", "https://www.dhs.gov/news/2025/07/25/dhs-leads-efforts-rescue-child-victims-sex-and-labor-trafficking"),
    "rt": ("House Oversight roundtable page, Jun 30, 2026", "https://oversight.house.gov/roundtable/catch-and-release-lose-and-forget-addressing-the-crisis-of-unaccompanied-alien-children-part-ii/"),
    "rt_vid": ("Official roundtable video, at about 46:01", "https://www.youtube.com/watch?v=HT3O3njMTEI&t=2761s"),
    "rt_rel": ("House Oversight release, Jul 1, 2026", "https://oversight.house.gov/release/roundtable-wrap-up-biden-administration-turned-a-blind-eye-to-immigration-crisis/"),
    "p1": ("Part I hearing transcript, Jul 23, 2025", "https://docs.house.gov/meetings/GO/GO33/20250723/118526/HHRG-119-GO33-Transcript-20250723.pdf"),
    "hr7123": ("H.R. 7123 text (congress.gov)", "https://www.congress.gov/119/bills/hr7123/BILLS-119hr7123ih.htm"),
    "hr7123_info": ("H.R. 7123 all info", "https://www.congress.gov/bill/119th-congress/house-bill/7123/all-info"),
    "pressley": ("Rep. Pressley\u2019s official transcript, Jan 29, 2026", "https://pressley.house.gov/2026/01/29/watch-in-minneapolis-pressley-omar-condemn-ice-violence-renew-calls-to-abolish-rogue-agency/"),
})


def U(key):
    return L[key][1]


# ───────────────────────── (a) Find them ─────────────────────────
def build_find_them(H):
    slug, fname = "find-them", REDIRECTS["find-them"]
    txt = (EV / f"{slug}.md").read_text(encoding="utf-8")
    for must in ("448,000", "32,000", "291,000", "Find them. All of them."):
        assert must in txt, f"find-them: '{must}' no longer in the verified text"
    chart = H.chart_card("chart-uc", "What the Inspector General counted", "Unaccompanied children, FY2019\u20132023. \u201cNo court notice\u201d = no notice to appear served as of May 2024.") \
        + f'<p class="jr-chart-src">{src_btn(U("oig"), "DHS Inspector General report")}</p>'
    charts = [{"id": "chart-uc", "type": "bar", "horizontal": True,
               "labels": ["Handed to HHS", "No court notice", "Missed court"],
               "data": [448000, 291000, 32000], "colors": ["#16325c", "#b22234", "#7c2d12"], "fmt": "int"}]
    facts = [
        ("448,000+ children handed to HHS. ICE could not account for all who missed court.",
         "DHS\u2019s own Inspector General found ICE transferred more than 448,000 unaccompanied children to HHS in fiscal 2019\u20132023 and could not account for the location of all who were released and then failed to appear in court. More than 32,000 missed court. More than 291,000 had never been served a notice to appear as of May 2024.",
         U("oig"), "DHS Inspector General report"),
        ("31,322 addresses on file were blank, undeliverable or incomplete.",
         "A follow-up audit (March 2025) of the 448,820 children transferred found the addresses for 31,322 were blank, undeliverable, or missing an apartment number.",
         U("oig25"), "DHS Inspector General report"),
        ("HHS check-in calls were late, undocumented, or never reached the child.",
         f"HHS\u2019s Inspector General (2024): 22% of safety and well-being calls were not made on time, 18% were not documented, and 16% of case files lacked sponsor safety-check documentation. HHS\u2019s own 2023 review: in the cases checked, calls reached the child 66% of the time. {H.src_link(U('hhs23'), 'HHS release, 2023')}",
         U("hhsoig"), "HHS Inspector General report"),
        ("What \u201clocated\u201d means, and how the count grew.",
         f"DHS counts a child as located \u201cin-person, in the United States, through visits and door knocks.\u201d It reported 13,000 located in July 2025 {H.src_link(U('dhs_jul'), 'DHS, Jul 2025')} and 145,000 in February 2026 {H.src_link(U('dhs'), 'DHS, Feb 2026')}. On June 11, 2026 the Secretary said he could not yet release a breakdown of what happened to the children found.",
         U("dhs_nov"), "DHS release"),
        ("Jun 30, 2026: the House roundtable on these children had zero Democrats present.",
         f"House Oversight\u2019s Subcommittee on Federal Law Enforcement held a roundtable, \u201cCatch and Release, Lose and Forget\u2026 Part II,\u201d on June 30, 2026 {H.src_link(U('rt'), 'roundtable page')}. At about 46:01 on the official video, Chairman Clay Higgins (R-LA) said: \u201cthere are zero Democrats present.\u201d The committee\u2019s July 1 release says Democrats \u201cfailed to show up\u201d {H.src_link(U('rt_rel'), 'release')}. The record does not give their reason. At the formal Part I hearing on July 23, 2025, the transcript lists five Democrats present {H.src_link(U('p1'), 'transcript')}.",
         U("rt_vid"), "Official video (House Oversight)"),
        ("Two House Democrats, on the record: abolish ICE.",
         f"Rep. Shri Thanedar (D-MI) introduced H.R. 7123, the \u201cAbolish ICE Act,\u201d on January 15, 2026, with no cosponsors {H.src_link(U('hr7123_info'), 'all info')}. Rep. Ayanna Pressley (D-MA), at a January 28, 2026 press conference with Rep. Ilhan Omar (D-MN), per her official transcript: \u201cWe need to abolish ICE.\u201d {H.src_link(U('pressley'), 'Pressley transcript')} We found no Republican bill or statement calling to defund or abolish ICE.",
         U("hr7123"), "Congress.gov bill text"),
    ]
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Border", date="Aug 31, 2026", headline="Find them.",
        card={"kind": "number", "big": "146,000", "icon": icon("child"),
              "label": "children located so far, DHS Secretary Markwayne Mullin said at a June 11, 2026 DOJ, DHS and HHS press conference. \u201cWe still have nearly 300,000 missing.\u201d",
              "url": U("doj_vid"), "type": "Official video (DOJ)"},
        facts=facts, chart=chart, charts=charts,
        view=["Nobody in Congress will mention these children.",
              "ICE is the only one looking for them, and some want to defund it for enforcing laws Congress passed.",
              "Epstein is a closed matter people have known about since the 90s, while these missing children are ignored.",
              "Find them. All of them."],
        full=full_html(slug), related=[("border.html", "The Border"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


# ───────────────────────── (b) They forgot who they work for ─────────────────────────
def build_forgot(H):
    slug, fname = "that-is-not-why-they-are-elected", REDIRECTS["that-is-not-why-they-are-elected"]
    txt = (EV / f"{slug}.md").read_text(encoding="utf-8")
    assert "maximum warfare, everywhere, all the time" in txt and "break their spirit" in txt
    facts = [
        ("Members are hired to represent a district and swear an oath to the Constitution.",
         f"House members are hired to represent a district, and each swears to support and defend the Constitution. {H.src_link(U('oath'), '5 U.S.C. \u00a7 3331')}",
         U("art1"), "U.S. Constitution"),
        ("Apr 22, 2026: \u201cmaximum warfare, everywhere, all the time.\u201d",
         f"Answering about Virginia\u2019s redistricting fight, Leader Jeffries said: \u201cwe are in an era of maximum warfare, everywhere, all the time.\u201d The remark was about congressional maps. {H.src_link(U('cspan_clip'), 'C-SPAN clip')}",
         U("cspan_full"), "C-SPAN video"),
        ("The May 19 quote was about MAGA Republicans, and the ballot box.",
         "His May 19 words were about \u201cMAGA extremists,\u201d meaning MAGA Republicans, and in the same breath he named beating them at the ballot box.",
         U("hj_yt"), "Official video (Jeffries\u2019 YouTube)"),
        ("A retiring Republican, Rep. Michael McCaul, described the same mood.",
         "Describing Congress after 22 years, McCaul said it has become \u201cvery vogue and style to demonize the other side of the aisle,\u201d with \u201cinternecine warfare within our own party.\u201d He was describing Congress, not urging anyone to do anything. At about 4:53 and 5:32.",
         U("mccaul"), "Media interview (audio)"),
    ]
    mccaul_box = (
        '<details class="jr-full"><summary>About the McCaul quote</summary><div class="jr-full-body">'
        "<p>The New York Times Magazine (Sep 16, 2026) printed two other McCaul lines: \u201cInternecine warfare is what has become vogue\u201d and "
        "\u201cYou\u2019re elected to fight and kill the other side.\u201d We listened to the full Fox News Rundown exit interview (Jul 12, 2026). "
        "Neither line is in it. What he said there, about 4:53 into the episode: \u201cit\u2019s very vogue and style to demonize the other side of the aisle and not, you know, almost vilify them.\u201d "
        "About 5:32: \u201cyou see that more so today now is internecine warfare within our own party, very much in style and vogue to go after your fellow Republican colleagues.\u201d "
        "The Times lines are <span class=\"jr-note\">reported, not confirmed by primary record</span>, and are not used here. "
        f"Times are approximate: the podcast file carries ads that can shift them by a few seconds. {S(H, 'mccaul')}</p></div></details>")
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Republic", date="Sep 17, 2026", headline="They forgot who they work for.",
        card={"kind": "quote", "big": "Our goal is to break them. We will defeat them. We have to beat them electorally, and then we have to break their spirit.",
              "label": "House Democratic Leader Hakeem Jeffries, May 19, 2026, CAP IDEAS conference, speaking about MAGA Republicans (at 8:41)",
              "url": U("hj_yt"), "type": "Official video (Jeffries\u2019 YouTube)"},
        facts=facts,
        view=["An employee does not declare war on the people who pay him.", "Watch the tape."],
        full=full_html(slug, {"Chief Justice Roberts issued a statement": "Roberts statement not linked here: reported, not confirmed by primary record"}),
        after=mccaul_box, related=[("journal-they-work-for-us.html", "They work for us"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


# ───────────────────────── (c) They work for us + settlements ─────────────────────────
def build_work_for_us(H):
    slug, fname = "they-work-for-us", REDIRECTS["they-work-for-us"]
    ooc_total, ooc_n = 17240854, 264
    charts = [
        {"id": "chart-roll83", "type": "bar", "horizontal": True, "stacked": True, "labels": ["Republicans", "Democrats"], "fmt": "int",
         "datasets": [{"label": "Send it to the Ethics Committee (yea)", "data": [175, 182], "color": "#57534e"},
                      {"label": "Vote on release now (nay)", "data": [38, 27], "color": "#b22234"}]},
        {"id": "chart-roll233", "type": "bar", "horizontal": True, "stacked": True, "labels": ["Republicans", "Democrats", "Independent"], "fmt": "int",
         "datasets": [{"label": "Yea", "data": [209, 210, 1], "color": "#16325c"}, {"label": "Present", "data": [1, 0, 0], "color": "#b22234"}]}]
    chart = (f'<div class="jr-charts">{H.chart_card("chart-roll83", "Mar 4, 2026: send the release to committee?", "H.Res. 1100 (Mace) · 357 yea, 65 nay, 1 present · Roll Call 83")}'
             f'{H.chart_card("chart-roll233", "Jun 30, 2026: release the records?", "H.Res. 1399 (Massie) · 420 yea, 0 nay, 1 present · Roll Call 233")}</div>'
             f'<p class="jr-chart-src">{src_btn(U("roll83"), "House vote")} {src_btn(U("roll233"), "House vote")}</p>')
    facts = [
        ("The total covers every kind of workplace claim, not only harassment.",
         "That total covers every kind of workplace claim under 13 laws, from overtime and family leave to disability, discrimination and harassment. It was not broken down by claim, and a large share of cases came from legislative-branch offices other than the House and Senate.",
         U("ooc"), "Office of Compliance record"),
        ("Since 2018, members must personally repay harassment settlements.",
         "Since the 2018 CAA Reform Act (Public Law 115-397), members must personally repay harassment awards and settlements.",
         U("reform"), "Congress.gov"),
        ("Two House votes: 357\u201365 to send it to committee, then 420\u20130 to release.",
         f"On March 4, 2026, the House voted 357\u201365 to send a release resolution to committee. On June 30 it passed another, 420\u20130. {H.src_link(U('roll233'), 'Roll 233')}",
         U("roll83"), "House vote"),
        ("Aug 31: dollar totals released, member names withheld.",
         "The workplace-rights office released dollar totals but withheld the list of member names, citing the law\u2019s confidentiality rule.",
         U("ocwr1399"), "OCWR record"),
    ]
    rec = settlements_record(H)
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Republic", date="Aug 24, 2026", headline="They work for us",
        card={"kind": "number", "big": f"${ooc_total:,}",
              "label": f"paid from a Treasury account for {ooc_n} workplace awards and settlements in legislative-branch offices, fiscal 1997\u20132017",
              "url": U("ooc"), "type": "Office of Compliance record"},
        facts=facts, chart=chart, charts=charts,
        view=["It\u2019s still theft. Why should we pay for what they do wrong?", "They work for us. They do not threaten us and expect us to pay them."],
        full=full_html(slug, {"chip in now to the @MNFreedomFund": "Post not linked here: reported, not confirmed by primary record",
                              "told NBC\u2019s Lester Holt": "Interview not linked here: reported, not confirmed by primary record"}),
        after=rec, related=[("journal-they-forgot-who-they-work-for.html", "They forgot who they work for"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]
