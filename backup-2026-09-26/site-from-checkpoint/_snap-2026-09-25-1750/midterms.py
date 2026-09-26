"""Midterm scorecard: Helped / Hurt by who controlled Congress (rebuilt from GitHub main src/lib/scorecard.ts
RECORD, DEBT_TALLY, MAJORITY, DEBT_WHY and src/components/era-compare.tsx, each line re-checked against a primary record
on Sep 24, 2026). Imported by build.py build_scorecard(). Facts that already live elsewhere on the site are linked, not repeated."""
from __future__ import annotations
import html, json
from pathlib import Path

e = html.escape
HERE = Path(__file__).parent
DEBT = json.load(open(HERE / "midterm-data" / "debt_by_control.json"))
TREAS_HIST = "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/"
TREAS_PENNY = "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"
PARTYDIV = "https://www.senate.gov/history/partydiv.htm"
HOUSEDIV = "https://history.house.gov/Institution/Party-Divisions/Party-Divisions/"
CHECKED = "Sep 24, 2026"

# Debt added while each arrangement held Congress (sum of each Congress's change; Treasury). Rebuilt by scripts/debt_by_control.py
T = DEBT["totals_T"]  # {'R':10.993,'D':12.469,'S':16.631} all Congresses 1857 (35th) to Sep 17, 2026
MODERN = {"R": 0.0, "D": 0.0, "S": 0.0}
for _n, a, _b, k, v in DEBT["rows"]:
    if a >= 1993:
        MODERN[k] += v / 1000.0  # billions -> trillions
YEARS = {"R": 6 + 4 + 4 + 1.71, "D": 2 + 4 + 2, "S": 2 + 4 + 2 + 2}  # since Jan 1993, through Sep 17, 2026
PERIODS = {
    "R": "1995–2001 · 2003–07 · 2015–19 · 2025–now",
    "D": "1993–95 · 2007–11 · 2021–23",
    "S": "2001–03 · 2011–15 · 2019–21 · 2023–25",
}
BIGGEST = max(DEBT["rows"], key=lambda r: r[4])  # (116, 2019, 2021, 'S', 5818.5)

# (headline, chip, detail sentence, url, source type)
COLS = {
 "R": {
  "help": [
   ("Welfare: work, or the check stops", "H.R. 3734 · 1996", "Replaced AFDC with TANF block grants, with work requirements and a five-year federal time limit. Public Law 104-193.", "https://www.congress.gov/bill/104th-congress/house-bill/3734", "Congress.gov bill"),
   ("Tax cut on savings, $500 child credit", "H.R. 2014 · 1997", "Taxpayer Relief Act: top capital-gains rate from 28% to 20%, a $500-per-child credit and the Roth IRA. Public Law 105-34.", "https://www.congress.gov/bill/105th-congress/house-bill/2014", "Congress.gov bill"),
   ("Tax cut, round two", "H.R. 2 · 2003", "Dividends and capital gains taxed at 15%; the 2001 rate cuts sped up. Public Law 108-27.", "https://www.congress.gov/bill/108th-congress/house-bill/2", "Congress.gov bill"),
   ("Tax Cuts and Jobs Act", "H.R. 1 · 2017", "Corporate rate from 35% to 21%, lower rates for most individual brackets, standard deduction nearly doubled. Public Law 115-97.", "https://www.congress.gov/bill/115th-congress/house-bill/1", "Congress.gov bill"),
  ],
  "hurt": [
   ("Drug benefit with no way to pay for it", "H.R. 1 · Medicare Part D · 2003", "CBO’s official score: $395 billion over ten years. The Medicare actuary later scored it at $534 billion. The House passed the final bill 220–215. Public Law 108-173.", "https://www.govinfo.gov/content/pkg/CRPT-108hrpt754/html/CRPT-108hrpt754-pt2.htm", "House report (CBO score)"),
   ("The 2017 tax law added to the deficit", "CBO · April 2018", "CBO: about $1.9 trillion added to deficits over 2018–2028, after economic growth and interest are counted.", "https://www.cbo.gov/publication/53787", "CBO report"),
   ("The 2025 law adds $3.4 trillion", "H.R. 1 · Public Law 119-21 · 2025", "CBO: deficits up $3.4 trillion over 2025–2034 ($4.1 trillion with interest). Spending cut $1.1 trillion; revenue cut $4.5 trillion.", "https://www.cbo.gov/publication/61570", "CBO cost estimate"),
  ],
 },
 "D": {
  "help": [
   ("Top tax rate raised to 39.6%", "H.R. 2264 · 1993", "Omnibus Budget Reconciliation Act: new 36% and 39.6% income-tax brackets. Public Law 103-66.", "https://www.congress.gov/bill/103rd-congress/house-bill/2264", "Congress.gov bill"),
   ("Lilly Ledbetter Fair Pay Act", "S. 181 · 2009", "Each paycheck restarts the clock to file a pay-discrimination claim. The first bill President Obama signed, Jan 29, 2009. Public Law 111-2.", "https://www.congress.gov/bill/111th-congress/senate-bill/181", "Congress.gov bill"),
   ("Children’s health coverage renewed", "H.R. 2 · CHIPRA · 2009", "Reauthorized and expanded the Children’s Health Insurance Program. Signed Feb 4, 2009. Public Law 111-3.", "https://www.congress.gov/bill/111th-congress/house-bill/2", "Congress.gov bill"),
   ("Affordable Care Act coverage", "H.R. 3590 · 2010", "Subsidized insurance exchanges, a Medicaid expansion and coverage for pre-existing conditions. Signed Mar 23, 2010. Public Law 111-148.", "https://www.congress.gov/bill/111th-congress/house-bill/3590", "Congress.gov bill"),
  ],
  "hurt": [
   ("Stimulus after the crash", "H.R. 1 · 2009", "CBO: $787 billion added to deficits over 2009–2019. Public Law 111-5.", "https://www.cbo.gov/publication/41762", "CBO cost estimate"),
   ("American Rescue Plan", "H.R. 1319 · 2021", "CBO: $1.86 trillion added to deficits over 2021–2031 (bill as passed). Public Law 117-2.", "https://www.cbo.gov/publication/57056", "CBO cost estimate"),
   ("Prices hit 9.1%", "BLS CPI · June 2022", "The 12-month rise in consumer prices reached 9.1% in June 2022, the largest since November 1981.", "https://www.bls.gov/news.release/archives/cpi_07132022.htm", "BLS release"),
   ("Border encounters climbed", "CBP · FY2021–22", "CBP nationwide encounters: 1.96 million in FY2021 and 2.77 million in FY2022. FY2021 began Oct 2020, under the prior administration.", "https://www.cbp.gov/newsroom/stats/nationwide-encounters", "CBP data"),
  ],
 },
 "S": {
  "help": [
   ("Social Security rescue", "H.R. 1900 · 1983", "Raised the full retirement age from 65 to 67 in steps and taxed part of benefits for higher earners. Public Law 98-21.", "https://www.congress.gov/bill/98th-congress/house-bill/1900", "Congress.gov bill"),
   ("Tax Reform Act", "H.R. 3838 · 1986", "Top individual rate from 50% to 28%, with many deductions closed. Public Law 99-514.", "https://www.congress.gov/bill/99th-congress/house-bill/3838", "Congress.gov bill"),
   ("Tax cut, round one", "H.R. 1836 · 2001", "Lower income-tax rates and a child credit rising to $1,000. It passed the Senate May 26, 2001; the Senate changed hands June 6. Public Law 107-16.", "https://www.congress.gov/bill/107th-congress/house-bill/1836", "Congress.gov bill"),
   ("Fiscal Responsibility Act", "H.R. 3746 · 2023", "CBO: projected deficits cut about $1.5 trillion over 2023–2033, mostly through spending caps. Public Law 118-5.", "https://www.cbo.gov/system/files/2023-05/hr3746_Letter_McCarthy.pdf", "CBO letter"),
  ],
  "hurt": [
   ("Iraq war authorization", "H.J.Res. 114 · 2002", "House 296–133 (R 215–6, D 81–126). Senate 77–23 (R 48–1, D 29–21). The Senate Intelligence Committee later found most key judgments of the Oct 2002 weapons estimate “either overstated, or were not supported by, the underlying intelligence reporting.”", "https://www.intelligence.senate.gov/sites/default/files/publications/108301.pdf", "Senate Intelligence report"),
   ("CARES Act", "H.R. 748 · 2020", "CBO: about $1.7 trillion added to deficits over 2020–2030 (relief checks, PPP loans, jobless aid). Public Law 116-136.", "https://www.cbo.gov/publication/56334", "CBO cost estimate"),
   ("Most debt added in one Congress", "Treasury · 2019–21", "$5.82 trillion added during the 116th Congress (Republican Senate, Democratic House). SwampForce sum of Treasury’s daily Debt to the Penny.", TREAS_PENNY, "Treasury data"),
  ],
 },
}
ROLL = [("House vote, Iraq (Roll 455)", "https://clerk.house.gov/Votes/2002455"),
        ("Senate vote, Iraq (No. 237)", "https://www.senate.gov/legislative/LIS/roll_call_votes/vote1072/vote_107_2_00237.htm")]

NAME = {"R": "Republican control", "D": "Democratic control", "S": "Split Congress"}
CLS = {"R": "gop", "D": "dem", "S": "split"}


def _src_btn(url, label):
    return (f'<a class="jr-srcbtn" href="{e(url)}" target="_blank" rel="noopener"><span class="jr-srctype">{e(label)}</span>'
            f'<span class="jr-srcgo">Open the record \u2197</span></a>')


def _item(h, chip, sent, url, typ, kind):
    mark = "▲" if kind == "help" else "▼"
    return (f'<details class="jr-fact mt-item mt-{kind}"><summary><span class="jr-fact-sum"><b class="mt-mark">{mark}</b> {e(h)}</span>'
            f'<span class="jr-fact-type">{e(chip)}</span></summary><div class="jr-fact-body"><p>{e(sent)}</p>{_src_btn(url, typ)}</div></details>')


def column(k, stamp):
    c = COLS[k]
    help_ = "".join(_item(*x, "help") for x in c["help"])
    hurt = "".join(_item(*x, "hurt") for x in c["hurt"])
    extra = ""
    if k == "S":
        extra = '<p class="period-note">Roll calls: ' + " · ".join(f'<a href="{u}" target="_blank" rel="noopener">{e(l)} ↗</a>' for l, u in ROLL) + "</p>"
    return (f'<div class="mt-col mt-{CLS[k]}">'
            f'<div class="mt-debt"><div class="mt-debt-num">${MODERN[k]:.2f}T</div><div class="mt-debt-lbl">Debt added while {e(NAME[k].lower())} ran Congress, 1993 to now</div>'
            f'<div class="mt-debt-sub">{e(PERIODS[k])} · {YEARS[k]:.1f} years · about ${MODERN[k] / YEARS[k]:.2f}T a year. {stamp}</div></div>'
            f'<h3 class="mt-h mt-h-help">Helped <span>{len(c["help"])}</span></h3><div class="jr-facts">{help_}</div>'
            f'<h3 class="mt-h mt-h-hurt">Hurt <span>{len(c["hurt"])}</span></h3><div class="jr-facts">{hurt}</div>{extra}</div>')


def compare_grid():
    """The helped/hurt chart, rebuilt as tappable HTML from the verified rows (replaces chart-helped-hurt.jpg)."""
    cells = ""
    for k in ("R", "D", "S"):
        c = COLS[k]
        cells += (f'<a class="mt-cmp mt-{CLS[k]}" href="#{CLS[k]}"><strong>{e(NAME[k])}</strong>'
                  f'<span class="mt-cmp-debt">${MODERN[k]:.2f}T · {YEARS[k]:.0f} yrs</span>'
                  f'<span class="mt-cmp-row"><b class="mt-up">▲ {len(c["help"])}</b> {e(" · ".join(x[0] for x in c["help"]))}</span>'
                  f'<span class="mt-cmp-row"><b class="mt-down">▼ {len(c["hurt"])}</b> {e(" · ".join(x[0] for x in c["hurt"]))}</span></a>')
    return f'<div class="mt-cmp-grid">{cells}</div>'


def charts():
    return [
        {"id": "mt-debt-all", "type": "doughnut", "labels": ["Republican control", "Democratic control", "Split Congress"],
         "data": [round(T["R"], 2), round(T["D"], 2), round(T["S"], 2)], "colors": ["#a51d24", "#1e3a8a", "#64748b"], "fmt": "t"},
        {"id": "mt-debt-rate", "type": "bar", "labels": ["Republican", "Democratic", "Split"],
         "data": [round(MODERN[k] / YEARS[k], 2) for k in ("R", "D", "S")], "colors": ["#a51d24", "#1e3a8a", "#64748b"], "fmt": "t"},
        {"id": "mt-mfg", "type": "bar", "labels": [r[0] for r in MFG], "data": [r[1] for r in MFG], "colors": ["#0c2340"], "fmt": "int"},
    ]


# Manufacturing jobs, change in thousands, January of inauguration year to January of the next (BLS CES3000000001, SA).
# Clinton 16,790->17,105; Bush 17,105->12,552; Obama 12,552->12,334; Trump I 12,334->12,142; Biden 12,142->12,673; Trump II 12,673->12,638 (Aug 2026, preliminary)
MFG = [("Clinton", 315), ("Bush", -4553), ("Obama", -218), ("Trump I", -192), ("Biden", 531), ("Trump II*", -35)]
BLS_MFG = "https://data.bls.gov/timeseries/CES3000000001"
CBP_HIST = "https://www.cbp.gov/document/stats/us-border-patrol-fiscal-year-southwest-border-sector-apprehensions-fy-1960-fy-2019"

# "Three jobs" (era-compare.tsx). Each line re-checked; lines already told elsewhere on the site link there instead of repeating.
ERAS = [
 ("The border", [
   ("Clinton", "FY1993–2000", "11.04 million southwest Border Patrol apprehensions, about 1.38 million a year. 1996 immigration law (IIRAIRA) passed.", CBP_HIST),
   ("Bush", "FY2001–08", "8.02 million apprehensions, about 1.0 million a year. Secure Fence Act, 2006.", "https://www.congress.gov/bill/109th-congress/house-bill/6061"),
   ("Obama", "FY2009–16", "3.31 million apprehensions, about 413,000 a year. DACA, 2012: a memo, not a statute.", CBP_HIST),
   ("Trump I", "FY2017–19", "1.55 million apprehensions, about 517,000 a year. FY2020 is counted differently (Title 42 expulsions).", CBP_HIST),
   ("Biden", "FY2021–24", "10.83 million nationwide encounters (a wider count). Year by year on The Border.", "border.html"),
   ("Now", "FY2025", "237,538 southwest Border Patrol encounters, lowest since 1970. Laken Riley Act, Jan 2025.", "border.html"),
 ]),
 ("The wars", [
   ("Bush", "2001–09", "Iraq authorized on weapons claims the Senate Intelligence Committee later found overstated or unsupported.", "https://www.intelligence.senate.gov/sites/default/files/publications/108301.pdf"),
   ("Obama", "2009–17", "Osama bin Laden killed in a U.S. operation, May 1, 2011.", "https://obamawhitehouse.archives.gov/blog/2011/05/02/osama-bin-laden-dead"),
   ("Trump I", "2017–21", "Soleimani strike and the Abraham Accords: the record is in the journal.", "journal-why-he-became-the-enemy.html"),
   ("Biden", "2021–25", "Kabul fell, August 2021: the record is in the journal.", "journal-paying-the-taliban.html"),
   ("Now", "2025–", "Maduro in U.S. custody on the 2020 indictment: the record is in the journal.", "journal-one-word.html"),
 ]),
 ("The factories", [
   ("Clinton", "1993–2001", "Manufacturing jobs +315,000. NAFTA (1993) and permanent normal trade with China (2000) passed.", "https://www.congress.gov/bill/106th-congress/house-bill/4444"),
   ("Bush", "2001–09", "Manufacturing jobs −4.55 million. China joined the WTO, Dec 2001.", "https://www.wto.org/english/news_e/news01_e/wto_ministerial_china_dec01_e.htm"),
   ("Obama", "2009–17", "Manufacturing jobs −218,000 (start was mid-recession).", BLS_MFG),
   ("Trump I", "2017–21", "Manufacturing jobs −192,000 (COVID in 2020).", BLS_MFG),
   ("Biden", "2021–25", "Manufacturing jobs +531,000.", BLS_MFG),
   ("Now", "2025–", "Manufacturing jobs −35,000 through Aug 2026 (preliminary).", BLS_MFG),
 ]),
]


def eras_html():
    out = ""
    for topic, rows in ERAS:
        rr = ""
        for i, (who, yrs, line, url) in enumerate(rows):
            ext = url.startswith("http")
            a = f'<a href="{e(url)}"{" target=_blank rel=noopener" if ext else ""}>{e(line)}{" ↗" if ext else " →"}</a>'
            rr += f'<div class="mt-era-row{" now" if i == len(rows) - 1 else ""}"><div class="mt-era-who"><b>{e(who)}</b><span>{e(yrs)}</span></div><p>{a}</p></div>'
        out += f'<details class="mt-era"{" open" if topic == "The border" else ""}><summary>{e(topic)}</summary>{rr}</details>'
    return out


# Border harm: every figure below already has its full record on the site; these tiles point there instead of repeating it.
BORDER_POINTERS = [
    ("$16.2B", "Emergency Medicaid, FY2021–23 (CBO)", "journal-the-hospital-and-the-morgue.html"),
    ("647,572", "On ICE’s non-detained docket with convictions or charges, Jul 2024", "journal-the-hospital-and-the-morgue.html"),
    ("$1.4B", "FEMA shelter awards; the Inspector General questioned $425M", "journal-fema-ran-two-jobs.html"),
    ("$8.13B", "New York City asylum-seeker spending, FY2023–25", "journal-they-opened-the-border.html"),
]


def border_html():
    return "".join(f'<a class="mt-ptr" href="{h}"><span class="mt-ptr-num">{e(n)}</span><span class="mt-ptr-lbl">{e(l)}</span><span class="mt-ptr-go">Full record →</span></a>'
                   for n, l, h in BORDER_POINTERS)


SHARED = [  # both parties; told in full elsewhere
    ("Twelve spending bills on time: last done for FY1997", "journal-the-debt-they-will-not-close.html"),
    ("Last surplus: FY2001", "journal-we-the-people.html"),
    ("GAO: $233–521 billion a year lost to fraud", "accountability-fraud.html"),
    ("$174,000 salary, a part-time floor", "journal-not-a-part-time-job.html"),
]

OUR_VIEW = ["No oversight. A $40 trillion card. Full-time pay for a part-time floor.",
            "A Republican president with a Democratic Congress is not an excuse. The $40 trillion is both of them."]

# Debt added by president, inauguration to inauguration (Treasury). Rebuilt by scripts/debt_by_president.py.
PRES = json.load(open(HERE / "midterm-data" / "debt_by_president.json"))["rows"]


def pres_chart():
    return {"id": "mt-pres", "type": "bar", "labels": [r["who"] + ("*" if r["who"] == "Trump II" else "") for r in PRES],
            "data": [r["added_T"] for r in PRES], "colors": ["#a51d24" if r["party"] == "R" else "#1e3a8a" for r in PRES], "fmt": "t"}


def pres_note():
    r = round(sum(x["added_T"] for x in PRES if x["party"] == "R"), 2)
    d = round(sum(x["added_T"] for x in PRES if x["party"] == "D"), 2)
    return (f"Since 1981: Republican presidents ${r:.2f}T, Democratic presidents ${d:.2f}T. Inauguration day to inauguration day; "
            "*Trump II through Sep 17, 2026. Before April 1993, straight-line between Treasury year-end figures.")
