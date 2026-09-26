"""Pieces from the Grok Build site (GitHub ksshort65/swampforce, src/lib/restored-files.ts, scorecard.ts ROLL_1964 and
HEARING_ABSENCE, pump.ts RULES_FILE) that were not yet on this site. Added Sep 26, 2026.
Every figure below was opened on its official page on Sep 26, 2026 (or reused from checkpoint-review/verified-items.csv).
Sentences that could not be confirmed on the linked page were left out (see _project-state/gap-list-2026-09-26.md)."""
from watch import e, stamp, legend, toc, Section
import watch2 as W2

CG = "https://www.congress.gov/bill/"
BLS_JUN22 = "https://www.bls.gov/news.release/archives/cpi_07132022.htm"

LAWS = [  # (president, name, public law, signed, what the record says, url)
    ("Obama", "American Recovery and Reinvestment Act", "Public Law 111-5", "February 17, 2009", "The 2009 stimulus after the 2008 crash.", CG + "111th-congress/house-bill/1"),
    ("Obama", "Patient Protection and Affordable Care Act", "Public Law 111-148", "March 23, 2010", "The health-insurance law. The price of it is a separate record.", CG + "111th-congress/house-bill/3590"),
    ("Trump, first term", "Tax Cuts and Jobs Act", "Public Law 115-97", "December 22, 2017", "Cut the top corporate rate from 35% to a flat 21%, raised the standard deduction and raised the child tax credit from $1,000 to $2,000, per the Congress.gov summary. Most individual changes are temporary.", CG + "115th-congress/house-bill/1"),
    ("Trump, first term", "VA MISSION Act", "Public Law 115-182", "June 6, 2018", "Rewrote how veterans can get care at community (non-VA) facilities.", CG + "115th-congress/senate-bill/2372"),
    ("Trump, first term", "First Step Act", "Public Law 115-391", "December 21, 2018", "Changed federal sentencing and prison credits, including good-time credit of up to 54 days a year.", CG + "115th-congress/senate-bill/756"),
    ("Trump, first term", "United States-Mexico-Canada Agreement Implementation Act", "Public Law 116-113", "January 29, 2020", "Put the USMCA into law. It replaces the North American Free Trade Agreement.", CG + "116th-congress/house-bill/5430"),
    ("Trump, first term", "Families First Coronavirus Response Act", "Public Law 116-127", "March 18, 2020", "The first COVID-19 relief law.", CG + "116th-congress/house-bill/6201"),
    ("Trump, first term", "CARES Act", "Public Law 116-136", "March 27, 2020", "The 2020 economic impact payments and the Paycheck Protection Program. Congress wrote it; the president signed it.", CG + "116th-congress/house-bill/748"),
    ("Trump, first term", "Great American Outdoors Act", "Public Law 116-152", "August 4, 2020", "Made Land and Water Conservation Fund money permanent and created a fund for deferred maintenance on federal lands.", CG + "116th-congress/house-bill/1957"),
    ("Biden", "American Rescue Plan Act", "Public Law 117-2", "March 11, 2021", "The 2021 COVID relief law, including the third round of economic impact payments.", CG + "117th-congress/house-bill/1319"),
    ("Biden", "Infrastructure Investment and Jobs Act", "Public Law 117-58", "November 15, 2021", "The spending authority. Whether a named project got built is a later inspector-general record, not the signing.", CG + "117th-congress/house-bill/3684"),
    ("Biden", "Inflation Reduction Act", "Public Law 117-169", "August 16, 2022", "A tax and spending law. Prices had already peaked at a 9.1% yearly rise in June 2022, before it was signed; the name did not reset the index.", CG + "117th-congress/house-bill/5376"),
]


def laws_section(H):
    groups = {}
    for who, *rest in LAWS:
        groups.setdefault(who, []).append(rest)
    out = []
    for who, rows in groups.items():
        cards = "".join(
            f'<details class="jr-fact"><summary><span class="jr-fact-sum"><b>{e(n)}</b> · {e(pl)}</span><span class="jr-fact-type">Signed {e(d)}</span></summary>'
            f'<div class="jr-fact-body"><p>{e(t)}</p><p class="jr-card-src">{H.src_link(u, "Congress.gov: " + pl)}'
            f'{(" " + H.src_link(BLS_JUN22, "BLS, June 2022 CPI")) if "9.1%" in t else ""} {stamp()}</p></div></details>'
            for n, pl, d, t, u in rows)
        out.append(f'<h3 class="gg-who">{e(who)}</h3><div class="jr-facts">{cards}</div>')
    intro = ('<p>A slogan is not a law. These are the statutes each president signed that the Grok Build scorecard listed, '
             'with the public-law number and date from Congress.gov. Tap a law for what the official summary says it does.</p>'
             '<p class="law-note">The Abraham Accords are a signed declaration, not a statute. The State Department publishes the text: '
             + H.src_link("https://www.state.gov/the-abraham-accords", "State Department: Abraham Accords Declaration") + '</p>')
    return W2.section("pt-laws", "Signed into law, by president", intro + "".join(out))


def civil_rights_section(H):
    chart = {"id": "chart-1964", "type": "bar", "horizontal": True, "labels": ["Republicans: 138 yes, 34 no", "Democrats: 152 yes, 96 no"],
             "data": [80, 61], "max": 100, "colors": ["#a51d24", "#16325c"], "fmt": "pct"}
    inner = (H.chart_card("chart-1964", "Civil Rights Act of 1964: House passage vote, share voting yes", "February 10, 1964 · 290 yes, 130 no")
             + '<p>Not a Democratic trophy. Not a Republican trophy. The roll call: 8 in 10 House Republicans voted yes (138 to 34). '
               '6 in 10 House Democrats voted yes (152 to 96). The bill became law on July 2, 1964.</p>'
             + f'<p class="jr-card-src">{H.src_link("https://www.govtrack.us/congress/votes/88-1964/h128", "Roll call 128 by party (GovTrack)")} '
               f'{H.src_link("https://www.congress.gov/bill/88th-congress/house-bill/7152", "Congress.gov: H.R. 7152")} {stamp()}</p>')
    return W2.section("pt-1964", "1964: how they voted", inner), chart


def rail_section(H):
    PDF = "https://hsr.ca.gov/wp-content/uploads/2025/12/FA-Executive-Summary-Report-December-2025-v2-A11Y.pdf"
    FRA = "https://railroads.dot.gov/about-fra/communications/newsroom/press-releases/trumps-transportation-secretary-sean-p-duffy-4"
    tiles = [H.tile("$15.16B", "Spent through Oct 31, 2025", "California High-Speed Rail Authority, all sources", accent=True, src=H.src_link(PDF, "CHSRA Dec 2025 report")),
             H.tile("$36.75B", "Program baseline", "Accepted by the Authority's board Aug 28, 2025", src=H.src_link(PDF, "CHSRA")),
             H.tile("$6.82B", "Federal funds awarded", "Of that, $2.57B spent", src=H.src_link(PDF, "CHSRA")),
             H.tile("$4B + $175M", "Federal grants pulled", "FRA: $4B terminated (July 2025); 4 projects withdrawn Aug 26, 2025", src=H.src_link(FRA, "FRA"))]
    inner = (f'<div class="tile-grid">{"".join(tiles)}</div>'
             '<p>The line was sold as a train. The file is the money already gone. The Authority\'s own December 2025 report, with figures through October 31, 2025, '
             'puts spending at $15.161 billion. Federal money awarded was $6.819 billion and federal money spent was $2.572 billion; the rest of the spending is state money. '
             'A grant awarded is not a grant spent.</p>'
             '<p>The Federal Railroad Administration said on August 26, 2025, that roughly $15 billion had been spent, that it had terminated $4 billion in grant funding in July '
             'after a review found the Merced-to-Bakersfield line would not be finished by 2033, and that it was withdrawing four related projects totaling about $175 million, '
             'including the Le Grand overcrossing.</p>'
             + f'<p class="jr-card-src">{H.src_link(PDF, "CHSRA financial report, Dec 2025 (PDF)")} {H.src_link(FRA, "FRA press release, Aug 26, 2025")} {stamp()}</p>')
    return W2.section("pt-rail", "California high-speed rail: where the federal money went", inner)


def refinery_section(H):
    CRS = "https://www.congress.gov/crs-product/IF13251"
    inner = ('<p>Crude oil becomes gasoline at a refinery. As of January 1, 2025, the United States had 132 operable refineries with a combined crude distillation capacity of '
             '18.4 million barrels a day, per the Congressional Research Service. Where each cent of a gallon goes after that is on the '
             '<a href="gas-gap.html">Gas Price Gap</a> and <a href="energy.html">Energy</a> pages.</p>'
             + f'<p class="jr-card-src">{H.src_link(CRS, "CRS In Focus IF13251")} {stamp()}</p>')
    return W2.section("pt-refining", "Refining: the step between the oil price and the pump", inner)


def hearing_section(H):
    FAQ = "https://www.senate.gov/committees/committees_faq.htm"
    HS = "https://www.hsgac.senate.gov/hearings/exposing-fraud-in-america/"
    inner = ('<p>A hearing has no roll call. The Clerk prints "Not Voting" for a floor vote; no office prints one for a hearing, so a no-show can only be checked one hearing at a time. '
             'The Senate says committees post witness testimony on their websites, and that the webcast "shows the hearing in its entirety." The archived webcast goes on the committee\'s '
             'site and Congress.gov, and hearings may later be printed by the Government Publishing Office. There is no complete list, so this site will not invent a total.</p>'
             '<p><b>Example:</b> Senate Homeland Security, July 15, 2026, "Exposing Fraud in America." Chairman Rand Paul and Ranking Member Gary Peters both posted statements on the '
             'committee page. Whether members were present is a question for the webcast, not a post.</p>'
             + f'<p class="jr-card-src">{H.src_link(FAQ, "Senate: committee FAQ")} {H.src_link(HS, "HSGAC hearing page, Jul 15, 2026")} {stamp()}</p>')
    return W2.section("pt-hearing", "How to check a hearing no-show", inner)


def build_paper_trail(H):
    c64, chart = civil_rights_section(H)
    secs = [("pt-laws", "Signed into law"), ("pt-1964", "1964 vote"), ("pt-rail", "High-speed rail money"), ("pt-refining", "Refining"), ("pt-hearing", "Hearing no-shows")]
    body = (W2.head("The Record", "The Paper Trail", "Laws that were signed, money that was spent, and votes that were cast, each linked to the official record. "
                    "Carried over from the Grok Build scorecard and checked again against the linked page.")
            + legend() + toc(secs) + laws_section(H) + c64 + rail_section(H) + refinery_section(H) + hearing_section(H)
            + W2.reader_path([("scorecard.html", "Midterm Scorecard"), ("accountability.html", "Accountability trackers"), ("about.html", "Methodology")]))
    html_out = H.page("paper-trail.html", "The Paper Trail · Swamp Force", "Signed laws by president, the 1964 civil rights vote, California high-speed rail money, refining capacity and how to check a hearing no-show.",
                      body, charts=[chart], serious=True)
    return html_out, {"laws": len(LAWS), "sections": len(secs)}


SECTIONS_G = [Section("paper-trail.html", "The Paper Trail", "Signed laws, the 1964 vote, rail money", [__file__], build_paper_trail)]
