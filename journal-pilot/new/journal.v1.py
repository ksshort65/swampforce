"""Journal: short visual essays (pilot) + Article V page. Imported at the end of watch.py.

Sources (read only):
  /workspace/checkpoint-review/essays-verified/<slug>.md  (verified full text; used verbatim in 'Read the full essay')
  /workspace/site-from-checkpoint/journal-data/article-v-states.csv  (Article V table)
Short versions are written here from the verified text; every fact carries a primary-record link.
Owner's opinion appears only inside the labeled 'Our view' box, in the owner's words.
"""
import csv, re
from pathlib import Path
import watch as W
from watch import e, stamp, CHECKED, ROOT, SITE, Section

EV = ROOT / "checkpoint-review" / "essays-verified"
JD = SITE / "journal-data"

# old /dispatch/<slug>.html -> new page (build.py essay_redirects() applies these over the hub defaults)
REDIRECTS = {"find-them": "journal-find-them.html",
             "that-is-not-why-they-are-elected": "journal-they-forgot-who-they-work-for.html",
             "they-work-for-us": "journal-they-work-for-us.html"}

L = {  # primary-record links
    "oig": ("DHS Inspector General, OIG-24-46", "https://www.oig.dhs.gov/sites/default/files/assets/2024-08/OIG-24-46-Aug24.pdf"),
    "dhs": ("DHS statement, Feb 24, 2026", "https://www.dhs.gov/news/2026/02/24/making-america-safe-again-state-dhs-under-president-trump-and-secretary-noem"),
    "1591": ("18 U.S.C. § 1591", "https://www.law.cornell.edu/uscode/text/18/1591"),
    "1589": ("18 U.S.C. § 1589", "https://www.law.cornell.edu/uscode/text/18/1589"),
    "art1": ("Constitution, Article I", "https://constitution.congress.gov/constitution/article-1/"),
    "oath": ("5 U.S.C. § 3331", "https://www.law.cornell.edu/uscode/text/5/3331"),
    "cspan_full": ("C-SPAN full news conference, Apr 22, 2026", "https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945"),
    "cspan_clip": ("C-SPAN clip", "https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623"),
    "hj_yt": ("Jeffries' own YouTube, May 19, 2026, at 8:41", "https://www.youtube.com/watch?v=IUlRHoY-DlU&t=521s"),
    "mccaul": ("Fox News Rundown episode, Jul 12, 2026", "https://radio.foxnews.com/2026/07/12/from-washington-rep-michael-mccaul-on-two-decades-of-public-service-and-the-changing-face-of-congress/"),
    "ooc": ("Office of Compliance memo, Nov 16, 2017", "https://www.ocwr.gov/wp-content/uploads/2017/11/memo_awards_and_settlements_appropriations_20171116.pdf"),
    "ooc_page": ("OCWR: Awards and Settlements 1997-2017", "https://www.ocwr.gov/publications/reports/awards-and-settlements/awards-and-settlements-appropriation-1997-2017/"),
    "reform": ("CAA Reform Act, Pub. L. 115-397 (congress.gov)", "https://www.congress.gov/bill/115th-congress/senate-bill/3749"),
    "roll83": ("House Roll Call 83, Mar 4, 2026", "https://clerk.house.gov/Votes/202683"),
    "roll233": ("House Roll Call 233, Jun 30, 2026", "https://clerk.house.gov/Votes/2026233"),
    "hres1100": ("H.Res. 1100 (congress.gov)", "https://www.congress.gov/bill/119th-congress/house-resolution/1100/all-actions"),
    "hres1399": ("H.Res. 1399 (congress.gov)", "https://www.congress.gov/bill/119th-congress/house-resolution/1399/text"),
    "ocwr1399": ("OCWR response to H.Res. 1399, Aug 31, 2026", "https://www.ocwr.gov/wp-content/uploads/OCWR-Response-to-HR-1399-Remediated.pdf"),
    "ethics": ("House Ethics Committee statement, Jul 2, 2026", "https://ethics.house.gov/press-releases/statement-of-the-committee-on-ethics-regarding-sexual-misconduct-settlements/"),
    "senate_rules": ("Senate Rules Committee release of OOC Senate data", "https://www.rules.senate.gov/news/majority-news/senate-rules-and-appropriations-committees-release-ooc-harassment-settlement-data"),
    "art5": ("Constitution, Article V (constitution.congress.gov)", "https://constitution.congress.gov/constitution/article-5/"),
    "clerk_mem": ("House Clerk: Article V memorials", "https://clerk.house.gov/SelectedMemorial"),
    "cos": ("Convention of States Action (advocacy group) list", "https://conventionofstates.com/states-that-have-passed-the-convention-of-states-article-v-application/"),
}


def S(H, key, label=None):
    lbl, u = L[key]
    return H.src_link(u, label or lbl)


# ───────────────────────── verified full text → HTML ─────────────────────────
_LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")


def _inline(s):
    s = e(s, quote=False)
    s = _LINK.sub(lambda m: f'<a href="{m.group(2)}" target="_blank" rel="noopener">{m.group(1)}</a>', s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])_(.+?)_(?![\w*])", r"<em>\1</em>", s)
    return s.replace("<strong>Our view:</strong>", '<span class="op-tag">Our view</span>')


def body_lines(slug):
    """The verified essay body: status line, sourcing note, title and slug/series/date lines removed."""
    out = []
    for ln in (EV / f"{slug}.md").read_text(encoding="utf-8").splitlines():
        s = ln.strip()
        if not s or s.startswith(("Status:", "_Sourcing standard", "## ")) or re.match(r"- (Slug|Series|Date):", s):
            continue
        out.append(s)
    return out


def words(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return len(re.findall(r"[A-Za-z0-9$%’'.,§-]*[A-Za-z0-9]+[A-Za-z0-9$%’'.,§-]*", re.sub(r"[*_>#]", " ", text)))


def full_html(slug, notes=None):
    """notes: {substring: note} adds a grey 'reported, not confirmed' note after a paragraph that carries no link."""
    notes = notes or {}
    parts = []
    for s in body_lines(slug):
        extra = "".join(f' <span class="jr-note">[{e(n)}]</span>' for k, n in notes.items() if k in s)
        if s.startswith("### "):
            parts.append(f"<h3>{_inline(s[4:])}</h3>")
        elif s.startswith("> "):
            parts.append(f"<blockquote>{_inline(s[2:])}{extra}</blockquote>")
        else:
            parts.append(f"<p>{_inline(s)}{extra}</p>")
    return "\n".join(parts)


# ───────────────────────── the short visual format ─────────────────────────
def essay_page(H, *, slug, fname, series, date, headline, card, points, view, full, chart=None, charts=None, after="", related=()):
    """card: dict(kind='number'|'quote', big, label, src).  points: list of HTML sentences.  view: list of owner sentences."""
    if card["kind"] == "number":
        c = (f'<div class="jr-card"><div class="jr-big">{e(card["big"])}</div><p class="jr-card-lbl">{card["label"]}</p>'
             f'<p class="jr-card-src">{card["src"]} {stamp()}</p></div>')
    else:
        c = (f'<figure class="jr-card jr-quote"><blockquote>\u201c{e(card["big"])}\u201d</blockquote>'
             f'<figcaption class="jr-card-lbl">{card["label"]}</figcaption><p class="jr-card-src">{card["src"]} {stamp()}</p></figure>')
    pts = "".join(f"<li>{p}</li>" for p in points)
    v = " ".join(e(x) for x in view)
    ch = chart or ""
    rel = "".join(f'<a class="btn ghost-dark sm" href="{h}">{e(t)}</a> ' for h, t in related)
    short = (f'<div class="jr-short" data-visible-words>'
             f'<p class="jr-kicker">Journal · {e(series)} · {e(date)} · 30-second read</p>'
             f'<h1 class="jr-h1">{e(headline)}</h1>{c}<ul class="jr-points">{pts}</ul>{ch}'
             f'<aside class="jr-view"><p><span class="op-tag">Our view</span> <span class="jr-view-who">The owner, in the owner\u2019s words</span></p>'
             f'<p class="jr-view-txt">{v}</p></aside></div>')
    body = (f'<article class="jr-wrap">{short}'
            f'<details class="jr-full"><summary>Read the full essay</summary><div class="jr-full-body">'
            f'<p class="jr-full-note">The verified text, checked against primary records on {CHECKED}. Passages marked <span class="op-tag">Our view</span> are opinion.</p>'
            f'{full}</div></details>{after}'
            f'<p class="jr-rel"><a class="btn navy sm" href="journal.html">All journal essays</a> {rel}</p></article>')
    return H.page(fname, f"{headline} · Swamp Force Journal", re.sub("<[^>]+>", "", points[0])[:155], body, charts=charts, serious=True)


def visible_words(html_text):
    m = re.search(r'<div class="jr-short" data-visible-words>(.*?)</aside></div>', html_text, re.S)
    t = re.sub(r"<canvas[^>]*>.*?</canvas>", " ", m.group(1), flags=re.S)
    t = re.sub(r'<span class="vstamp".*?</span>', " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t).replace("↗", " ")
    import html as _h
    return words(_h.unescape(t))


STATS = {}


def _record(fname, slug, html_out):
    orig = "\n".join(body_lines(slug))
    STATS[fname] = {"slug": slug, "verified_words": words(orig), "visible_words": visible_words(html_out)}


# ───────────────────────── (a) Find them ─────────────────────────
def build_find_them(H):
    slug, fname = "find-them", REDIRECTS["find-them"]
    txt = (EV / f"{slug}.md").read_text(encoding="utf-8")
    for must in ("448,000", "32,000", "291,000", "145,000", "450,000", "Find them. All of them."):
        assert must in txt, f"find-them: '{must}' no longer in the verified text"
    chart = H.chart_card("chart-uc", "What the Inspector General counted", "Unaccompanied children, FY2019–2023. \"No court notice\" = no notice to appear served as of May 2024. DHS OIG-24-46.")
    charts = [{"id": "chart-uc", "type": "bar", "horizontal": True,
               "labels": ["Handed to HHS", "No court notice", "Missed court"],
               "data": [448000, 291000, 32000], "colors": ["#16325c", "#b45309", "#7c2d12"], "fmt": "int"}]
    points = [
        f"DHS\u2019s own Inspector General found ICE handed more than 448,000 children to HHS in 2019\u20132023 and could not account for the location of every child who was released and then missed court. {S(H, 'oig')}",
        f"More than 32,000 missed court. As of May 2024, more than 291,000 had never been served a notice to appear, so they had no court date at all. {S(H, 'oig', 'OIG-24-46')}",
        f"DHS said in February 2026 that the prior administration lost more than 450,000 children and that DHS and HHS have found 145,000. Those are DHS\u2019s own figures. {S(H, 'dhs')}",
        f"Child sex trafficking and forced labor are already federal felonies. {S(H, '1591')} {S(H, '1589')}",
    ]
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Border", date="Aug 31, 2026", headline="Find them.",
        card={"kind": "number", "big": "448,000+",
              "label": "unaccompanied children ICE handed to HHS, 2019\u20132023. The Inspector General found ICE could not account for all who were released and missed court.",
              "src": S(H, "oig")},
        points=points, chart=chart, charts=charts,
        view=["Find them. All of them.", "The search belongs to the agencies charged with the children, not to a protest line at the door.",
              "The remedy is the search, the warrant, the home visit, and the court date."],
        full=full_html(slug), related=[("border.html", "The Border"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


# ───────────────────────── (b) They forgot who they work for ─────────────────────────
def build_forgot(H):
    slug, fname = "that-is-not-why-they-are-elected", REDIRECTS["that-is-not-why-they-are-elected"]
    txt = (EV / f"{slug}.md").read_text(encoding="utf-8")
    assert "maximum warfare, everywhere, all the time" in txt and "break their spirit" in txt
    points = [
        f"House members are hired to represent a district, and each swears to support and defend the Constitution. {S(H, 'art1')} {S(H, 'oath')}",
        f"On April 22, 2026, answering about Virginia\u2019s redistricting fight, Leader Jeffries said: \u201cwe are in an era of maximum warfare, everywhere, all the time.\u201d The remark was about congressional maps. {S(H, 'cspan_full')} {S(H, 'cspan_clip')}",
        "His May 19 words above were about \u201cMAGA extremists,\u201d meaning MAGA Republicans, and in the same breath he named beating them at the ballot box.",
        f"Retiring Republican Rep. Michael McCaul, describing Congress after 22 years, said it has become \u201cvery vogue and style to demonize the other side of the aisle,\u201d with \u201cinternecine warfare within our own party.\u201d He was describing Congress, not urging anyone to do anything. {S(H, 'mccaul', 'Fox News Rundown, Jul 12, 2026, at about 4:53 and 5:32')}",
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
              "label": "House Democratic Leader Hakeem Jeffries, May 19, 2026, CAP IDEAS conference, speaking about MAGA Republicans",
              "src": S(H, "hj_yt")},
        points=points,
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
                      {"label": "Vote on release now (nay)", "data": [38, 27], "color": "#b45309"}]},
        {"id": "chart-roll233", "type": "bar", "horizontal": True, "stacked": True, "labels": ["Republicans", "Democrats", "Independent"], "fmt": "int",
         "datasets": [{"label": "Yea", "data": [209, 210, 1], "color": "#16325c"}, {"label": "Present", "data": [1, 0, 0], "color": "#b45309"}]}]
    chart = (f'<div class="jr-charts">{H.chart_card("chart-roll83", "Mar 4, 2026: send the release to committee?", "H.Res. 1100 (Mace) · 357 yea, 65 nay, 1 present · Roll Call 83")}'
             f'{H.chart_card("chart-roll233", "Jun 30, 2026: release the records?", "H.Res. 1399 (Massie) · 420 yea, 0 nay, 1 present · Roll Call 233")}</div>'
             f'<p class="jr-chart-src">{S(H, "roll83")} {S(H, "roll233")}</p>')
    points = [
        f"That total covers every kind of workplace claim under 13 laws, from overtime and family leave to disability, discrimination and harassment. It was not broken down by claim, and a large share of cases came from legislative-branch offices other than the House and Senate. {S(H, 'ooc')}",
        f"Since the 2018 CAA Reform Act, members must personally repay harassment awards and settlements. {S(H, 'reform')}",
        f"On March 4, 2026, the House voted 357\u201365 to send a release resolution to committee. On June 30 it passed another, 420\u20130. {S(H, 'roll83', 'Roll 83')} {S(H, 'roll233', 'Roll 233')}",
        f"On Aug. 31 the workplace-rights office released dollar totals but withheld the list of member names, citing the law\u2019s confidentiality rule. {S(H, 'ocwr1399')}",
    ]
    rec = settlements_record(H)
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Republic", date="Aug 24, 2026", headline="They work for us",
        card={"kind": "number", "big": f"${ooc_total:,}",
              "label": f"paid from a Treasury account for {ooc_n} workplace awards and settlements in legislative-branch offices, fiscal 1997\u20132017",
              "src": S(H, "ooc")},
        points=points, chart=chart, charts=charts,
        view=["It\u2019s still theft. Why should we pay for what they do wrong?", "They work for us. They do not threaten us and expect us to pay them."],
        full=full_html(slug, {"chip in now to the @MNFreedomFund": "Post not linked here: reported, not confirmed by primary record",
                              "told NBC\u2019s Lester Holt": "Interview not linked here: reported, not confirmed by primary record"}),
        after=rec, related=[("journal-they-forgot-who-they-work-for.html", "They forgot who they work for"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


def settlements_record(H):
    rows = [
        ("Members: settlements with no sexual-misconduct component", "$745,247.02"),
        ("House employees: settlements involving sexual misconduct", "$67,620.11"),
        ("House employees: settlements with no sexual-misconduct component", "$609,884.53"),
        ("32 House cases whose files were destroyed under a 2013\u20132018 retention policy (value known for 24)", "$166,120.08"),
        ("Members: names and amounts for sexual-harassment cases", "Withheld (CAA Section 416 confidentiality)"),
    ]
    tr = "".join(f'<tr><td data-l="Category">{e(a)}</td><td data-l="Amount">{e(b)}</td></tr>' for a, b in rows)
    timeline = [
        ("Mar 5, 2026", "Rep. Thomas Massie on \u201cCarl Higbie FRONTLINE\u201d the day after the 357\u201365 vote. Massie credits Rep. Nancy Mace for forcing the vote.", "https://www.youtube.com/watch?v=58Vlm4SA2B0"),
        ("May 26, 2026", "Rep. James Comer on \u201cCarl Higbie FRONTLINE\u201d: Higbie asks for the rest of the names from the \u201c$17 million\u201d fund.", "https://www.youtube.com/watch?v=kfJyqV3OEoQ"),
    ]
    tl = "".join(f'<li><span class="rep-date">{e(d)}</span> {e(t)} {H.src_link(u, "Newsmax video")}</li>' for d, t, u in timeline)
    return (
        '<details class="jr-full" id="settlements"><summary>The settlements record</summary><div class="jr-full-body">'
        f"<h3>What the $17.2 million is</h3><p>The Office of Compliance (renamed the Office of Congressional Workplace Rights in 2018) released the figure on Nov 16, 2017: "
        f"264 awards and settlements, $17,240,854, fiscal years 1997 through 2017, paid from its Treasury account. It says a large share came from legislative-branch offices other than the House or Senate, "
        f"and involved laws such as the overtime rules of the Fair Labor Standards Act, the Family and Medical Leave Act and the Americans with Disabilities Act. It is not a count of member sexual-misconduct cases. {S(H, 'ooc')} {S(H, 'ooc_page', 'OCWR page')}</p>"
        f"<h3>The 2018 law</h3><p>The Congressional Accountability Act of 1995 Reform Act (S. 3749) became Public Law 115-397 on Dec 21, 2018. Members must reimburse the Treasury for harassment awards and settlements, and those are referred to the Ethics Committee. {S(H, 'reform')}</p>"
        f"<h3>The votes</h3><p>Mar 4, 2026: on Rep. Nancy Mace\u2019s H.Res. 1100, the House voted 357\u201365 (1 present) to refer it to the Ethics Committee instead of adopting it. Republicans 175\u201338, Democrats 182\u201327. "
        f"{S(H, 'roll83')} {S(H, 'hres1100')}</p><p>Jun 30, 2026: Rep. Thomas Massie\u2019s H.Res. 1399 passed 420\u20130. Republicans 209 yea, 1 present (Mace); Democrats 210 yea; one independent yea. It directed the Ethics Committee and the OCWR to publish, within 60 days, the names of members in taxpayer-paid sexual-harassment cases and several dollar totals. {S(H, 'roll233')} {S(H, 'hres1399')}</p>"
        f"<h3>What came back</h3><p>The Ethics Committee said on Jul 2 that it does not handle settlements and has not been notified of any member sexual-misconduct award or settlement since the 2018 law. {S(H, 'ethics')} "
        f"The OCWR answered on Aug 31, 2026:</p><div class=\"table-wrap\"><table class=\"watch-table\"><thead><tr><th>Category (H.Res. 1399)</th><th>Amount</th></tr></thead><tbody>{tr}</tbody></table></div>"
        f"<p>{S(H, 'ocwr1399')}</p>"
        f'<h3>On the air (media, not proof)</h3><p>Newsmax host Carl Higbie pressed for the names on his show. His segments we found in Newsmax\u2019s own video uploads:</p><ul class="rep-list">{tl}</ul>'
        "<p class=\"jr-note\">No official or member in these records credits the coverage with the votes; the June vote came from Rep. Massie\u2019s privileged resolution.</p>"
        "</div></details>")


# ───────────────────────── Article V ─────────────────────────
ART5 = ("The Congress, whenever two thirds of both Houses shall deem it necessary, shall propose Amendments to this Constitution, or, on the Application of the Legislatures of two thirds of the several States, "
        "shall call a Convention for proposing Amendments, which, in either Case, shall be valid to all Intents and Purposes, as Part of this Constitution, when ratified by the Legislatures of three fourths of the several States, "
        "or by Conventions in three fourths thereof, as the one or the other Mode of Ratification may be proposed by the Congress; Provided that no Amendment which may be made prior to the Year One thousand eight hundred and eight "
        "shall in any Manner affect the first and fourth Clauses in the Ninth Section of the first Article; and that no State, without its Consent, shall be deprived of its equal Suffrage in the Senate.")


def av_rows():
    with open(JD / "article-v-states.csv", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_article_v(H):
    rows = av_rows()
    n_group = len(rows)
    n_rec = sum(1 for r in rows if r["record_url"])
    tr = "".join(
        f'<tr><td data-l="#">{i}</td><td data-l="State">{e(r["state"])}</td><td data-l="Passed (group\u2019s date)">{e(r["group_date"])}</td>'
        f'<td data-l="Official record">{H.src_link(r["record_url"], r["record_label"]) if r["record_url"] else "<span class=rep-nolink>Not yet linked to an official record</span>"}'
        f'{("<br><span class=jr-note>" + e(r["note"]) + "</span>") if r.get("note") else ""}</td></tr>'
        for i, r in enumerate(rows, 1))
    pct = round(100 * n_group / 34)
    chips = "".join(f'<span class="av-chip">{e(r["state"])}</span>' for r in rows) + "".join('<span class="av-chip empty"></span>' for _ in range(34 - n_group))
    body = (
        '<article class="jr-wrap av">'
        '<p class="jr-kicker">Journal · The Remedy · 30-second read</p><h1 class="jr-h1">Article V: the states\u2019 way to fix Congress</h1>'
        f'<figure class="jr-card jr-quote av-text"><blockquote>{e(ART5)}</blockquote><figcaption class="jr-card-lbl">U.S. Constitution, Article V</figcaption>'
        f'<p class="jr-card-src">{S(H, "art5")} {stamp()}</p></figure>'
        '<h2 class="jr-h2">How it works</h2><div class="av-steps">'
        '<div class="av-step"><div class="jr-big">34</div><p>state legislatures (two-thirds of 50) apply. Congress \u201cshall call\u201d a convention.</p></div>'
        '<div class="av-step"><div class="jr-big">38</div><p>states (three-fourths) must ratify any amendment it proposes, by legislature or state convention.</p></div></div>'
        f'<h2 class="jr-h2">Convention of States: where it stands</h2>'
        f'<div class="av-bar" role="img" aria-label="{n_group} of 34 states"><div class="av-fill" style="width:{pct}%"></div></div>'
        f'<p class="av-bar-lbl"><strong>{n_group} of 34</strong> states have passed the Convention of States resolution, <em>by the advocacy group\u2019s own count</em> {S(H, "cos")}. '
        f'We checked {n_rec} of {n_group} against an official record: the application as received by the U.S. House Clerk, or the state legislature\u2019s own text.</p>'
        f'<div class="av-chips">{chips}</div>'
        f'<details class="jr-full"><summary>The {n_group} states and their official records</summary><div class="jr-full-body">'
        '<p class="jr-note">Dates are the advocacy group\u2019s. \u201cOfficial record\u201d is the state\u2019s application as received by the U.S. House Clerk (or, where the Clerk\u2019s list has no copy, the state legislature\u2019s record), read by us for the Convention of States wording '
        '(\u201cimpose fiscal restraints \u2026 limit the power and jurisdiction of the federal government \u2026 limit the terms of office\u201d). Blank means we have not yet linked an official copy; the state stays in the group\u2019s count, not ours.</p>'
        f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>#</th><th>State</th><th>Passed (group\u2019s date)</th><th>Official record</th></tr></thead><tbody>{tr}</tbody></table></div>'
        f'<p>{S(H, "clerk_mem")} {S(H, "cos")}</p></div></details>'
        '<aside class="jr-view"><p><span class="op-tag">Our view</span> <span class="jr-view-who">The owner, in the owner\u2019s words</span></p>'
        '<p class="jr-view-txt">Members of Congress are bound by their oath and the Constitution to represent the people. Both parties took control from the people while ordinary Americans were busy caring for their families. '
        'We the people own and operate this country. Another election just puts more people in to do the same thing. An Article V convention of states is the only way to change Congress.</p></aside>'
        '<p class="jr-rel"><a class="btn navy sm" href="journal.html">All journal essays</a> <a class="btn ghost-dark sm" href="journal-they-forgot-who-they-work-for.html">They forgot who they work for</a> '
        '<a class="btn ghost-dark sm" href="remedy.html">The Remedy</a></p></article>')
    html_out = H.page("article-v.html", "Article V: the states\u2019 way to fix Congress · Swamp Force",
                      "Article V text, how a convention of states works (34 apply, 38 ratify), and which states have applied.", body, serious=True)
    return html_out, {"group_count": n_group, "linked_to_official_record": n_rec}


# ───────────────────────── Journal hub ─────────────────────────
HUB = [("journal-find-them.html", "Find them.", "The Border", "Aug 31, 2026", "448,000+ children handed to HHS. The Inspector General says ICE could not account for all who missed court."),
       ("journal-they-forgot-who-they-work-for.html", "They forgot who they work for.", "The Republic", "Sep 17, 2026", "\u201cMaximum warfare.\u201d \u201cBreak their spirit.\u201d The tape, in context."),
       ("journal-they-work-for-us.html", "They work for us", "The Republic", "Aug 24, 2026", "$17.2 million in workplace settlements, two House votes, and the names still withheld."),
       ("article-v.html", "Article V: the states\u2019 way to fix Congress", "The Remedy", "", "34 states apply, 38 ratify. Where the count stands.")]


def build_hub(H):
    cards = "".join(
        f'<a class="jr-hub-card" href="{h}"><p class="jr-kicker">{e(s)}{" · " + e(d) if d else ""} · 30 seconds</p><h2>{e(t)}</h2><p>{e(x)}</p><span class="jr-hub-go">Read \u2192</span></a>'
        for h, t, s, d, x in HUB)
    body = ('<div class="jr-wrap">'
            '<p class="jr-kicker">Swamp Force Journal</p><h1 class="jr-h1">The Journal</h1>'
            '<p class="jr-lede">Short essays you can read in 30 seconds. One number or quote, the record behind it, and the owner\u2019s view, labeled. The full verified essay is one tap away.</p>'
            f'<div class="jr-hub">{cards}</div>'
            '<p class="jr-note">Pilot: 3 essays in the new short format. The other verified essays will follow once the format is approved.</p>'
            '<p class="jr-rel"><a class="btn ghost-dark sm" href="foreword.html">The Republic</a> <a class="btn ghost-dark sm" href="about.html">Methodology</a></p></div>')
    return H.page("journal.html", "Journal · Swamp Force", "Short visual essays: one number, the primary record, and the owner's labeled view.", body, serious=True), {"essays": len(HUB) - 1}


_REQ = [EV / "find-them.md", EV / "that-is-not-why-they-are-elected.md", EV / "they-work-for-us.md"]
SECTIONS_J = [
    Section("journal.html", "Journal", "", _REQ, build_hub, in_menu=False),
    Section(REDIRECTS["find-them"], "Find them.", "", [EV / "find-them.md"], build_find_them, in_menu=False),
    Section(REDIRECTS["that-is-not-why-they-are-elected"], "They forgot who they work for.", "", [EV / "that-is-not-why-they-are-elected.md"], build_forgot, in_menu=False),
    Section(REDIRECTS["they-work-for-us"], "They work for us", "", [EV / "they-work-for-us.md"], build_work_for_us, in_menu=False),
    Section("article-v.html", "Article V", "", [JD / "article-v-states.csv"], build_article_v, in_menu=False),
]
