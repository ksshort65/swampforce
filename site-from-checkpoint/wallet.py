"""Midterms page: "How did your rep vote? Your wallet." (added Sep 24, 2026).
One tap-to-expand card per wallet issue. Every amount is from the statute text (govinfo) or SSA/Colorado DOR;
every count is from the clerk.house.gov / senate.gov roll-call XML (party totals recounted from the member list).
Costs already on the scorecard (CBO $3.4T for the 2025 law, Part D, ARP, CARES, TCJA) are linked, not repeated.
Imported by build.py build_scorecard()."""
from __future__ import annotations
import html

e = html.escape
H = "https://clerk.house.gov/Votes/"
S = "https://www.senate.gov/legislative/LIS/roll_call_votes/"
GI = "https://www.govinfo.gov/content/pkg/"

# Votes: (chamber, date, total, [(party, yes, no)], url, button label, extra note)
V = {
 "obbb_h": ("House", "Jul 3, 2025", "218–214", [("R", 218, 2), ("D", 0, 212)], H + "2025190", "House roll call 190", ""),
 "obbb_s": ("Senate", "Jul 1, 2025", "51–50", [("R", 50, 3), ("D", 0, 45), ("Ind", 0, 2)], S + "vote1191/vote_119_1_00372.htm", "Senate vote 372", "50–50; the Vice President broke the tie (yes)."),
 "tcja_h": ("House", "Dec 20, 2017", "224–201", [("R", 224, 12), ("D", 0, 189)], H + "2017699", "House roll call 699", ""),
 "tcja_s": ("Senate", "Dec 20, 2017", "51–48", [("R", 51, 0), ("D", 0, 46), ("Ind", 0, 2)], S + "vote1151/vote_115_1_00323.htm", "Senate vote 323", ""),
 "arp_h": ("House", "Mar 10, 2021", "220–211", [("R", 0, 210), ("D", 220, 1)], H + "202172", "House roll call 72", ""),
 "arp_s": ("Senate", "Mar 6, 2021", "50–49", [("R", 0, 49), ("D", 48, 0), ("Ind", 2, 0)], S + "vote1171/vote_117_1_00110.htm", "Senate vote 110", ""),
 "cares_h": ("House", "Mar 27, 2020", "Voice vote", [], "https://www.congress.gov/bill/116th-congress/house-bill/748/all-actions", "House record (voice vote)", "Passed by voice vote. No names were recorded."),
 "cares_s": ("Senate", "Mar 25, 2020", "96–0", [("R", 49, 0), ("D", 45, 0), ("Ind", 2, 0)], S + "vote1162/vote_116_2_00080.htm", "Senate vote 80", ""),
 "ssfa_h": ("House", "Nov 12, 2024", "327–75", [("R", 136, 71), ("D", 191, 4)], H + "2024456", "House roll call 456", "1 Republican voted present. Two-thirds were needed."),
 "ssfa_s": ("Senate", "Dec 21, 2024", "76–20", [("R", 27, 20), ("D", 46, 0), ("Ind", 3, 0)], S + "vote1182/vote_118_2_00338.htm", "Senate vote 338", "60 were needed."),
 "ira_h": ("House", "Aug 12, 2022", "220–207", [("R", 0, 207), ("D", 220, 0)], H + "2022420", "House roll call 420", ""),
 "ira_s": ("Senate", "Aug 7, 2022", "51–50", [("R", 0, 50), ("D", 48, 0), ("Ind", 2, 0)], S + "vote1172/vote_117_2_00325.htm", "Senate vote 325", "50–50; the Vice President broke the tie (yes)."),
 "aca_h": ("House", "Mar 21, 2010", "219–212", [("R", 0, 178), ("D", 219, 34)], H + "2010165", "House roll call 165", ""),
 "aca_s": ("Senate", "Dec 24, 2009", "60–39", [("R", 0, 39), ("D", 58, 0), ("Ind", 2, 0)], S + "vote1111/vote_111_1_00396.htm", "Senate vote 396", ""),
 "ext_h": ("House", "Jan 8, 2026", "230–196", [("R", 17, 196), ("D", 213, 0)], H + "202611", "House roll call 11", "H.R. 1834, a three-year extension. The Senate has not voted on it."),
 "ext_s": ("Senate", "Dec 11, 2025", "51–48", [("R", 4, 48), ("D", 45, 0), ("Ind", 2, 0)], S + "vote1191/vote_119_1_00644.htm", "Senate vote 644", "A vote to start debate on a three-year extension (S. 3385). 60 were needed, so it failed."),
 "mw_h": ("House", "May 24, 2007", "348–73", [("R", 123, 72), ("D", 225, 1)], H + "2007424", "House roll call 424", "The House split the bill in two. This vote was on the part with the wage raise; war funding was voted on separately (roll call 425)."),
 "mw_s": ("Senate", "May 24, 2007", "80–14", [("R", 42, 3), ("D", 37, 10), ("Ind", 1, 1)], S + "vote1101/vote_110_1_00181.htm", "Senate vote 181", ""),
 "rtw_h": ("House", "Jul 18, 2019", "231–199", [("R", 3, 192), ("D", 228, 6), ("Ind", 0, 1)], H + "2019496", "House roll call 496", "The Senate never voted on this bill."),
 "rtw_s": ("Senate", "Mar 5, 2021", "42–58", [("R", 0, 50), ("D", 41, 7), ("Ind", 1, 1)], S + "vote1171/vote_117_1_00074.htm", "Senate vote 74", "The latest Senate floor vote on $15: a motion to waive budget rules for a $15 amendment to the 2021 rescue bill. 60 were needed."),
}
PKG = "A no vote was a vote on the whole bill, not only this part."
CTRL = {"R": ("Republican Congress", "gop"), "D": ("Democratic Congress", "dem"), "S": ("Split Congress", "split")}

# Each law: (name, control key, control detail, signed, wallet line, [vote keys], package?, [(button label, url)], scorecard pointer or None)
L = {
 "obbb": ("2025 law · P.L. 119-21", "R", "Republicans held both chambers", "Signed by President Trump, Jul 4, 2025"),
 "tcja": ("2017 tax law · P.L. 115-97", "R", "Republicans held both chambers", "Signed by President Trump, Dec 22, 2017"),
 "arp": ("2021 American Rescue Plan · P.L. 117-2", "D", "Democrats held both chambers", "Signed by President Biden, Mar 11, 2021"),
 "cares": ("2020 CARES Act · P.L. 116-136", "S", "Republican Senate, Democratic House", "Signed by President Trump, Mar 27, 2020"),
 "ssfa": ("Social Security Fairness Act · P.L. 118-273", "S", "Democratic Senate, Republican House", "Signed by President Biden, Jan 5, 2025"),
 "ira": ("2022 Inflation Reduction Act · P.L. 117-169", "D", "Democrats held both chambers", "Signed by President Biden, Aug 16, 2022"),
 "aca": ("2010 Affordable Care Act · P.L. 111-148", "D", "Democrats held both chambers", "Signed by President Obama, Mar 23, 2010"),
 "ext": ("2025–26 extension votes", "R", "Republicans held both chambers", "Not law"),
 "mw": ("2007 raise · P.L. 110-28", "D", "Democrats held both chambers; Republican president", "Signed by President Bush, May 25, 2007"),
 "rtw": ("2019 Raise the Wage Act · H.R. 582", "S", "Democratic House, Republican Senate", "Passed the House only"),
}
TXT = {k: GI + f"{p}/html/{p}.htm" for k, p in {"obbb": "PLAW-119publ21", "tcja": "PLAW-115publ97", "arp": "PLAW-117publ2", "cares": "PLAW-116publ136",
       "ssfa": "PLAW-118publ273", "ira": "PLAW-117publ169", "aca": "PLAW-111publ148", "mw": "PLAW-110publ28"}.items()}
TXT["rtw"] = GI + "BILLS-116hr582eh/html/BILLS-116hr582eh.htm"
TXT["ext"] = "https://www.congress.gov/bill/119th-congress/house-bill/1834/text"

CO_GUIDE = "https://tax.colorado.gov/sites/tax/files/documents/Individual_Income_Tax_Guide_January_2026.pdf"
CO_BILL = "https://leg.colorado.gov/bills/hb25-1296"

# card: (id, icon number, title, one-line teaser, [blocks]); block: (law key, wallet line, [vote keys] or ref, package?, extra buttons, pointer)
CARDS = [
 ("tips", "$25K", "Tips, overtime and the 65+ deduction", "2025 · federal income tax deductions, 2025–2028", [
   ("obbb", "Deduct up to $25,000 of tips and up to $12,500 of overtime pay ($25,000 married filing jointly). People 65 and older deduct an extra $6,000 each. "
            "Tax years 2025 through 2028. Tips and overtime shrink above $150,000 of income ($300,000 joint); the 65+ deduction shrinks above $75,000 ($150,000 joint). "
            "Overtime counts only the extra pay above your regular rate.",
    ["obbb_h", "obbb_s"], True, [("IRS: the 2025 law’s provisions", "https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions")],
    ("What the 2025 law costs (CBO) is in the Republicans room", "#gop")),
  ], "state"),
 ("ctc", "$2,200", "Child tax credit", "2017 · 2021 · 2025", [
   ("tcja", "Doubled it from $1,000 to $2,000 per child under 17, up to $1,400 of it paid even with no tax owed, plus $500 for other dependents. Full credit up to $200,000 of income ($400,000 joint). Set to end after 2025.",
    ["tcja_h", "tcja_s"], True, [], ("The 2017 law and its CBO cost are in the Republicans room", "#gop")),
   ("arp", "For 2021 only: $3,000 per child, $3,600 under age 6, 17-year-olds included, fully paid even with no tax owed. The extra shrank above $75,000 single, $112,500 head of household, $150,000 joint.",
    ["arp_h", "arp_s"], True, [], ("The 2021 law’s CBO cost is in the Democrats room", "#dem")),
   ("obbb", "$2,200 per child starting 2025, raised with inflation after that, no end date. A Social Security number is required for the child and at least one parent.",
    "same", True, [], None),
  ], None),
 ("std", "$24K", "The bigger standard deduction", "2017 · made permanent 2025", [
   ("tcja", "For 2018: $12,000 single, $24,000 married, $18,000 head of household, up from $6,350, $12,700 and $9,350 in 2017. The same law set the $4,050-per-person exemption to zero. Both were set to end after 2025.",
    ["tcja_h", "tcja_s"], True, [("IRS 2017 amounts (Rev. Proc. 2016-55)", "https://www.irs.gov/pub/irs-drop/rp-16-55.pdf")], ("The 2017 law and its CBO cost are in the Republicans room", "#gop")),
   ("obbb", "Made it permanent: $15,750 single, $31,500 married, $23,625 head of household for 2025, then raised with inflation.",
    "same", True, [], None),
  ], None),
 ("checks", "$1,400", "Stimulus checks", "2020 · 2021", [
   ("cares", "$1,200 per adult ($2,400 joint) plus $500 per child. Cut by 5% of income above $75,000 single, $112,500 head of household, $150,000 joint.",
    ["cares_h", "cares_s"], True, [], ("The CARES Act’s CBO cost is in the Split room", "#split")),
   ("arp", "$1,400 per person, including each dependent ($2,800 joint plus $1,400 per dependent). Phased out between $75,000 and $80,000 single, $150,000 and $160,000 joint.",
    ["arp_h", "arp_s"], True, [], ("The 2021 law’s CBO cost is in the Democrats room", "#dem")),
  ], None),
 ("ssfa", "3.1M", "Social Security Fairness Act", "Ended WEP and GPO · 2024, signed Jan 2025", [
   ("ssfa", "Ended two rules (WEP and GPO) that cut Social Security for people with a pension from work that did not pay Social Security tax, such as some teachers, police and firefighters. "
            "Applies to benefits from January 2024. SSA: over 3.1 million back payments, $17 billion, by Jul 7, 2025; some checks rose over $1,000 a month.",
    ["ssfa_h", "ssfa_s"], False, [("SSA: what the law does", "https://www.ssa.gov/benefits/retirement/social-security-fairness-act.html")], None),
  ], None),
 ("insulin", "$35", "Medicare insulin cap and drug-price negotiation", "2022", [
   ("ira", "Medicare drug plans cap insulin at $35 for a month’s supply from 2023 (insulin through a Medicare-covered pump from Jul 1, 2023). "
           "Medicare negotiates prices: the first 10 drugs, with negotiated prices starting in 2026.",
    ["ira_h", "ira_s"], True, [], ("The 2003 Part D drug benefit and its cost are in the Republicans room", "#gop")),
  ], None),
 ("aca", "8.5%", "ACA premium subsidies", "2010 · 2021–2025 · extension votes 2025–26", [
   ("aca", "Tax credits to help buy marketplace insurance for households at 100% to 400% of the poverty line.",
    ["aca_h", "aca_s"], True, [], ("The ACA is in the Democrats room", "#dem")),
   ("arp", "Bigger subsidies for 2021–2022: $0 benchmark premium up to 150% of poverty, and no one paid more than 8.5% of income for the benchmark plan, even above 400%. The 2022 Inflation Reduction Act extended this through 2025.",
    ["arp_h", "arp_s", "ira_h", "ira_s"], True, [], None),
   ("ext", "The bigger subsidies ended after 2025. The House passed a three-year extension; the Senate did not take it up.",
    ["ext_h", "ext_s"], False, [], None),
  ], None),
 ("wage", "$7.25", "Federal minimum wage", "Last raised 2007 · $15 bill 2019", [
   ("mw", "Raised in three steps: $5.85 on Jul 24, 2007, $6.55 on Jul 24, 2008 and $7.25 on Jul 24, 2009. It has not changed since.",
    ["mw_h", "mw_s"], True, [], None),
   ("rtw", "Would have raised it in steps to $15.00 an hour six years after taking effect, then tied it to wage growth.",
    ["rtw_h", "rtw_s"], False, [], None),
  ], None),
]


def _btn(url, label, cls="jr-srcbtn"):
    return f'<a class="{cls}" href="{e(url)}" target="_blank" rel="noopener"><span class="jr-srctype">{e(label)}</span><span class="jr-srcgo">Open \u2197</span></a>'


def _vote(k):
    ch, date, tot, parties, url, lbl, note = V[k]
    pp = "".join(f'<span class="wv-p wv-{p.lower()}">{p} {y}–{n}</span>' for p, y, n in parties)
    rep = "wv-rep" if ch == "House" and parties else "wv-sen"
    btxt = ("Check your rep: " if ch == "House" and parties else ("Check your senators: " if ch == "Senate" else "")) + lbl
    return (f'<div class="wv-vote"><div class="wv-vrow"><span class="wv-ch">{ch}</span><span class="wv-tot">{e(tot)}</span><span class="wv-date">{e(date)}</span></div>'
            f'<div class="wv-parties">{pp}</div>{f"<p class=wv-vnote>{e(note)}</p>" if note else ""}'
            f'<a class="wv-btn {rep}" href="{e(url)}" target="_blank" rel="noopener">{e(btxt)} \u2197</a></div>')


def _block(law, line, votes, pkg, extra, ptr):
    name, ck, cdet, signed = L[law]
    ctl, cls = CTRL[ck]
    if votes == "same":
        vv = (f'<p class="wv-same">Same votes as the tips card: House {V["obbb_h"][2]}, Senate {V["obbb_s"][2]}.</p>'
              f'<div class="wv-votes">{_vote("obbb_h")}{_vote("obbb_s")}</div>')
    else:
        vv = f'<div class="wv-votes">{"".join(_vote(k) for k in votes)}</div>'
    btns = _btn(TXT[law], "Law text" if law not in ("rtw", "ext") else "Bill text") + "".join(_btn(u, l) for l, u in extra)
    p = f'<a class="wv-ptr" href="{ptr[1]}">{e(ptr[0])} →</a>' if ptr else ""
    return (f'<div class="wv-law"><p class="wv-law-h"><b>{e(name)}</b></p>'
            f'<p class="wv-ctl"><span class="wv-tag wv-{cls}">{e(ctl)}</span> {e(cdet)}. {e(signed)}.</p>'
            f'<p class="wv-line">{e(line)}</p>{vv}{f"<p class=wv-pkg>{e(PKG)}</p>" if pkg else ""}'
            f'<div class="wv-src">{btns}</div>{p}</div>')


STATE = (
 '<div class="wv-state"><p class="wv-state-h">Federal only. Your state decides its own tax.</p>'
 '<p>These are deductions from federal income tax. Each state legislature decides whether its own income tax follows them.</p>'
 '<p><b>Colorado:</b> tips stay deductible on the state return. Overtime is added back and taxed by the state starting with tax year 2026 '
 '(HB25-1296, signed May 16, 2025; Colorado House 40–24, Senate 23–12).</p>'
 '<p class="wv-state-go">Check your state: your state legislature decides this.</p>'
 f'<div class="wv-src">{_btn(CO_BILL, "Colorado bill HB25-1296")}{_btn(CO_GUIDE, "Colorado Dept. of Revenue guide (PDF)")}</div></div>')


def _card(cid, num, title, teaser, blocks, extra):
    body = "".join(_block(*b) for b in blocks) + (STATE if extra == "state" else "")
    return (f'<details class="jr-fact wv-card" id="wallet-{cid}"><summary><span class="wv-num">{e(num)}</span>'
            f'<span class="wv-sum"><span class="jr-fact-sum">{e(title)}</span><span class="jr-fact-type">{e(teaser)}</span></span></summary>'
            f'<div class="jr-fact-body">{body}</div></details>')


FIND_HOUSE = "https://www.house.gov/representatives/find-your-representative"
FIND_SENATE = "https://www.senate.gov/senators/senators-contact.htm"
ELECTION_LAW = "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title2-section7&num=0&edition=prelim"


def section(stamp=""):
    cards = "".join(_card(*c) for c in CARDS)
    return f"""
<section class="wv" id="wallet" aria-label="How did your rep vote? Your wallet">
 <p class="hero-kicker">Your wallet</p>
 <h2 class="wv-h">How did your rep vote? Your wallet.</h2>
 <p class="wv-dek">Eight laws that changed what a household keeps. Tap a card. “Check your rep” opens the official roll call, with every member by name and state.</p>
 <div class="wv-top">
  <a class="wv-find" href="{FIND_HOUSE}" target="_blank" rel="noopener"><b>Find your House member</b><span>by ZIP code, house.gov ↗</span></a>
  <a class="wv-find" href="{FIND_SENATE}" target="_blank" rel="noopener"><b>Find your senators</b><span>senate.gov ↗</span></a>
 </div>
 <div class="wv-elect"><span class="wv-elect-d">Nov 3, 2026</span><span class="wv-elect-t">All 435 House seats are on the ballot. Go vote.</span>
  <span class="wv-elect-a"><a href="https://vote.gov/" target="_blank" rel="noopener">Register: vote.gov ↗</a> · <a href="{ELECTION_LAW}" target="_blank" rel="noopener">Election day law, 2 U.S.C. 7 ↗</a></span></div>
 <div class="jr-facts wv-cards">{cards}</div>
 <p class="period-note">How to read it: yes–no by party. Ind. = independents; in these Senate votes they caucused with Democrats. Counts are from the House Clerk and Senate roll-call records; amounts are from the law text. Congress control matches the scorecard rooms above. {stamp}</p>
</section>
"""
