"""Watch sections for the SwampForce site (data-driven; imported by build.py).

How a section works
-------------------
Each entry in SECTIONS is a Section(slug, title, menu_desc, requires, builder).
* `requires` lists the input files. The section is built only when every one exists;
  otherwise it is skipped and any old copy of its page is removed, so nothing half-done ships.
* `builder(H)` returns the page HTML. H holds the shared helpers from build.py
  (page, tile, chart_card, src_link, ico) so every section uses the same design.
* Active sections appear automatically in the "Watch" nav menu, the footer, the sitemap,
  build-summary.json and the QA screenshots.

Adding a section later ("2020: The Record", accountability trackers, energy)
---------------------------------------------------------------------------
1. Put the checked, derived data in site-from-checkpoint/watch-data/ (never write into the
   research folders; other agents own them).
2. Write build_<name>(H) below using the same helpers: tiles(), rec_card(), reported_box(),
   claim_card(), table rows with src links, stamp() only for items confirmed by a primary record.
3. Add a Section(...) line to SECTIONS. See PLANNED for the expected sources.
"""
import csv, html, json, re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Optional

ROOT = Path("/workspace")
SITE = ROOT / "site-from-checkpoint"
WD = SITE / "watch-data"
TW = ROOT / "trump-watch"
MW = ROOT / "movement-watch"
e = html.escape
CHECKED = "Sep 24, 2026"
# The movement log cites an OHCHR press release that does not mention Minab; the finding is in the Mission report itself.
UN_MINAB = "https://www.ohchr.org/sites/default/files/documents/hrbodies/hrcouncil/sessions-regular/session63/a-hrc-63-61-aev.pdf"


@dataclass
class Section:
    slug: str
    title: str
    menu_desc: str
    requires: list
    builder: Optional[Callable] = None
    stats: dict = field(default_factory=dict)
    in_menu: bool = True  # False = sub-page, linked from its hub instead of the Watch menu

    def missing(self):
        return [str(p) for p in self.requires if not Path(p).exists()]

    def ready(self):
        return self.builder is not None and not self.missing()


# ───────────────────────── shared pieces ─────────────────────────
def read_csv(p):
    with open(p, newline="", encoding="utf-8-sig") as f:
        return [{k.strip(): (v or "").strip() for k, v in r.items() if k} for r in csv.DictReader(f)]


def yes(r):
    return r.get("confirmed_by_primary", "").lower().startswith("y")


_MINOR = re.compile(r"([A-Z][a-zA-Z'\-]+(?: [A-Z][a-zA-Z'\-]+){1,3}) \((1[0-7]|[1-9])\)")


def redact_minors(s):
    """Never name a minor: 'First Last (17)' -> 'a 17-year-old'."""
    return _MINOR.sub(lambda m: f"a {m.group(2)}-year-old", s or "")


def clean_note(s):
    """Drop pointers to internal research files (baseline.md, *.csv) from notes."""
    parts = re.split(r"(?<=[.;])\s+", s or "")
    keep = [p for p in parts if not re.search(r"\b[\w-]+\.(csv|md)\b|baseline", p, re.I)]
    return " ".join(keep).strip()


def _sentences(s):
    """Split on '. ' and '; ' outside parentheses."""
    out, buf, depth = [], "", 0
    for i, ch in enumerate(s):
        buf += ch
        depth += (ch == "(") - (ch == ")")
        if depth <= 0 and ch in ".;" and (i + 1 == len(s) or s[i + 1] == " "):
            out.append(buf.strip()); buf = ""
    if buf.strip():
        out.append(buf.strip())
    return [x for x in out if x]


def split_notes(s):
    """Return (confirmed_note, [reported sentences]) so reported details never sit inside a stamped card."""
    parts = _sentences(clean_note(s))
    rep = [p for p in parts if re.search(r"\breported\b|\breportedly\b", p, re.I)]
    keep = " ".join(p for p in parts if p not in rep).strip()
    keep = keep[:1].upper() + keep[1:] if keep else ""
    return keep.rstrip(";") + ("" if not keep or keep.endswith((".", ")")) else "."), [p.rstrip(";.") + "." for p in rep]


def linkify(H, s):
    out, last = [], 0
    for m in re.finditer(r"https?://[^\s;,)]+", s):
        out.append(e(s[last:m.start()])); out.append(H.src_link(m.group(0).rstrip("."), "Link")); last = m.end()
    out.append(e(s[last:]))
    return "".join(out)


def usd(x, dec=0):
    return f"${x:,.{dec}f}"


def usd_short(x):
    if x >= 1e9:
        return f"${x / 1e9:.2f}B"
    if x >= 1e6:
        return f"${x / 1e6:.1f}M"
    return usd(x)


def fmt_date(d):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", d or "")
    if not m:
        return d
    mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][int(m.group(2)) - 1]
    return f"{mon} {int(m.group(3))}, {m.group(1)}"


def stamp(note=""):
    extra = f' <span class="vstamp-note">{e(note)}</span>' if note else ""
    return f'<span class="vstamp" title="Checked against a primary record on {CHECKED}">✓ Verified by SwampForce</span>{extra}'


def srcs(H, links):
    out = [H.src_link(u, lbl) for lbl, u in links if u]
    return " ".join(out)


def rec_card(H, *, date, title, body, links, note="", chips="", verified=True, anchor=""):
    idattr = f' id="{e(anchor)}"' if anchor else ""
    n = f'<p class="rec-note">{e(note)}</p>' if note else ""
    st = stamp() if verified else '<span class="rep-tag">Reported only</span>'
    return (f'<article class="rec-card{"" if verified else " muted"}"{idattr}><p class="rec-meta"><span class="rec-date">{e(date)}</span>{chips}</p>'
            f'<h3>{e(title)}</h3><p>{e(body)}</p>{n}<p class="rec-foot">{st} {srcs(H, links)}</p></article>')


def reported_box(H, items, title="Reported only: not confirmed by a primary record", intro=""):
    """items: (date, text, lead_url). Muted, no stamp, never counted as verified."""
    if not items:
        return ""
    def one(it):
        d, t, u = it[:3]
        lbl = it[3] if len(it) > 3 else "News lead"
        link = H.src_link(u, lbl) if u else '<span class="rep-nolink">No primary source located</span>'
        return f'<li><span class="rep-date">{e(d)}</span> {e(t)} {link}</li>'
    lis = "".join(one(it) for it in items)
    i = f"<p>{e(intro)}</p>" if intro else ""
    return (f'<aside class="rep-box" aria-label="Reported only"><p class="rep-h"><span class="rep-tag">Reported only</span> {e(title)}</p>{i}'
            f'<ul class="rep-list">{lis}</ul></aside>')


def claim_card(H, *, who, claim, claim_src, record, record_src, verdict_html, head, nuance=""):
    nu = f'<p class="meta-line"><b>Context</b> {e(nuance)}</p>' if nuance else ""
    return f"""<article class="frame open watch-claim"><div class="frame-head static"><span class="frame-tag">{e(head)}</span>
<span class="frame-meta">{verdict_html}</span></div>
<div class="frame-body"><div class="frame-cols"><div class="frame-col claim-side"><h3>What was said</h3><p>{e(claim)}</p><p class="meta-line"><b>Said by</b> {e(who)}</p><p class="meta-line">{claim_src}</p></div>
<div class="frame-col truth-side"><h3>What the record shows</h3><p>{e(record)}</p>{nu}<p class="meta-line">{record_src}</p></div></div></div></article>"""


def legend():
    return (f'<div class="watch-legend" role="note"><p>{stamp()} means SwampForce checked the item against a primary record '
            f'(government document, court filing, official results, or the person\'s or group\'s own words) on {CHECKED}.</p>'
            '<p><span class="rep-tag">Reported only</span> items rest on news reports alone. They are kept in separate grey lists, '
            'are not stamped, and are not counted in any figure on this page.</p></div>')


def toc(items):
    return '<nav class="watch-toc" aria-label="On this page">' + "".join(f'<a href="#{a}">{e(t)}</a>' for a, t in items) + "</nav>"


# ───────────────────────── Trump Accountability Watch ─────────────────────────
def load_trump():
    v = json.loads((WD / "watch-verified.json").read_text(encoding="utf-8"))
    fees = read_csv(WD / "trump-278e-foreign-fees.csv")
    lic = [f for f in fees if f["income_type"] == "License Fee"]
    mgmt = [f for f in fees if f["income_type"] != "License Fee"]
    log = read_csv(TW / "log.csv")
    conf = read_csv(TW / "conflicts.csv")
    return v, lic, mgmt, log, conf


def conflict_verified(c):
    return (c.get("confirmation_status", "").lower().startswith("both sides confirmed")
            and bool(c.get("action_primary_url")) and bool(c.get("interest_primary_url")))


def status_label(c):
    f = c.get("official_finding", "").strip().lower()
    return "No official finding" if (not f or f.startswith("no official finding")) else c["official_finding"]


LOG_OVERRIDE_TRUMP = {  # (date, event_type) -> tweaks; keeps the log-driven timeline strict
    ("2025-05-21", "foreign gift"): {"date": "2025 (May 21 date reported)"},
    ("2025-09-24", "ruling (IG firings)"): {"notes": ""},
}



# ───────────────────────── salary, court money, monuments (Trump Watch) ─────────────────────────
USC_SALARY = "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title3-section102&num=0&edition=prelim"
CONST_PAY = "https://constitution.congress.gov/browse/article-2/section-1/clause-7/"
NY_APPDIV = "lawfare-docs/ny-1st-dept-civil-fraud.pdf"
DOJ_FUND = "https://www.justice.gov/opa/pr/justice-department-announces-anti-weaponization-fund"


def load_salary():
    rows = read_csv(WD / "salary-donations.csv")
    conf = [r for r in rows if r["confirmed"] == "yes" and r["amount_stated"]]
    total = round(sum(float(r["amount_stated"]) for r in conf), 2)
    return rows, conf, total


def salary_section(H):
    rows, conf, total = load_salary()
    named = [r for r in rows if r["confirmed"] == "recipient only"]
    rep = [r for r in rows if r["confirmed"] == "no" and r["recipient"] != "Not announced"]
    none = [r for r in rows if r["recipient"] == "Not announced"]

    def amt(r):
        if r["confirmed"] == "yes":
            v = float(r["amount_stated"]); return usd(v, 2 if v % 1 else 0)
        return '<span class="muted-note">Not stated in the primary record</span>'
    trs = "".join(
        f'<tr><td data-l="Quarter"><b>{e(r["quarter"])}</b></td><td data-l="Recipient">{e(r["recipient"])}</td><td data-l="Purpose">{e(r["purpose"])}</td>'
        f'<td data-l="Amount (primary record)" class="num">{amt(r)}</td>'
        f'<td data-l="Source">{H.src_link(r["primary_url"], r["primary_label"])}<div class="cell-stamp">{stamp("amount" if r["confirmed"] == "yes" else "recipient")}</div></td></tr>'
        for r in rows if r["confirmed"] in ("yes", "recipient only"))
    rep_items = [(r["quarter"], f'{r["recipient"]}: {r["purpose"]}. ' + (f'Reported amount {usd(float(r["reported_amount"]))}. ' if r["reported_amount"] else "") + r["note"], r["reported_url"]) for r in rep]
    rep_items += [(r["quarter"], f'{r["recipient"]} (primary record names the recipient only): reported amount {usd(float(r["reported_amount"]))}.', r["reported_url"]) for r in named if r["reported_amount"]]
    rep_items += [(r["quarter"], "No announcement of a recipient was located.", "") for r in none]
    return rows, conf, total, named, rep, trs, rep_items


def court_money_rows(H, sal_total, n_conf):
    return [
        ("Presidential salary", f"$400,000 a year set by law; the Constitution requires it be paid.",
         f"Donated. {usd(sal_total, 2)} across {n_conf} quarters is confirmed by a primary record with the amount stated.",
         "Money he did not keep", f'{H.src_link(USC_SALARY, "3 U.S.C. 102")} {H.src_link(CONST_PAY, "Art. II, Sec. 1, Cl. 7")}'),
        ("NY civil fraud judgment (Engoron, Feb 16, 2024)", "Disgorgement of $363,894,816, with interest totaling $464,576,230.62.",
         "Vacated in full by the Appellate Division, First Dept., on Aug 21, 2025 (liability left in place). Court of Appeals review pending.",
         "Not owed under the current judgment", H.src_link(NY_APPDIV, "App. Div. decision (PDF)")),
        ("E. Jean Carroll judgments", "$5 million (2023) and $83.3 million (2024): $88.3 million.",
         "Both affirmed by the Second Circuit; rehearing en banc denied Apr 29, 2026. Supreme Court petition in Carroll I pending. Carroll II: Supreme Court denied review June 29, 2026; the court ordered the $5,000,000 plus $779,783 interest paid out of his $5,550,000 court deposit.",
         "Carroll II ordered paid from his deposit; Carroll I payment not in the record reviewed",
         f'{H.src_link("https://law.justia.com/cases/federal/appellate-courts/ca2/23-793/23-793-2024-12-30.html", "2d Cir. 23-793")} {H.src_link("https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_2_opn.pdf", "2d Cir. 24-644")} {H.src_link("https://storage.courtlistener.com/recap/gov.uscourts.nysd.590045/gov.uscourts.nysd.590045.234.0.pdf", "S.D.N.Y. order, June 30, 2026")} {H.src_link("https://www.supremecourt.gov/docket/docketfiles/html/public/26-141.html", "No. 26-141")}'),
        ("Trump Foundation (N.Y. Sup. Ct., 2019)", "$2,000,000 to charities, without interest.",
         "Damages for breach of fiduciary duty/waste; the foundation was dissolved.", "Ordered paid to charities",
         H.src_link("https://nycourts.gov/reporter/3dseries/2019/2019_29336.htm", "Decision")),
        ("Trump v. IRS settlement (DOJ, May 18, 2026)", "$1.776 billion Anti-Weaponization Fund from the Judgment Fund; $230M administrative claims withdrawn.",
         "DOJ states no money is paid to the President, his sons or the Trump Organization. The President can remove the fund's members.",
         "Not paid to him per DOJ", H.src_link(DOJ_FUND, "DOJ release")),
    ]


def monuments_section(H):
    m = json.loads((WD / "monuments.json").read_text(encoding="utf-8"))
    q = {x["date"]: x for x in m["schumer"]}
    pools = m["pool_contracts"]
    pool_total = round(sum(c["amount"] for c in pools), 2)
    SJC = "https://www.washingtonexaminer.com/wp-content/uploads/2026/05/reconciliation_-_senate_judiciary_committee_title.pdf"
    WH_BALL = "https://www.whitehouse.gov/briefings-statements/2025/07/the-white-house-announces-white-house-ballroom-construction-to-begin/"
    OMB = "https://openomb.org/file/11525117"
    GAO_LTR = "https://www.appropriations.senate.gov/imo/media/doc/260622_letter_to_gao_on_usss_funding_for_ballroompdf.pdf"
    NEH = "https://apportionment-public.max.gov/Spend%20Plans/FY2026%20NEH%20Spend%20Plan.pdf"
    ARCH = "https://parkplanning.nps.gov/document.cfm?documentID=151577"
    DOI17 = "https://www.doi.gov/pressreleases/president-trumps-salary-and-matching-funds-restore-antietam-national-battlefield"
    UCSB = "https://www.presidency.ucsb.edu/documents/tweets-august-14-2020"
    NPSFOIA = "https://www.nps.gov/aboutus/foia/upload/TrumpDonationRecords.pdf"

    def quote(d):
        x = q[d]
        return f'<blockquote class="mon-quote">"{e(x["quote"])}"<footer>Sen. Chuck Schumer, {fmt_date(d)} {H.src_link(x["url"], "Senate Democrats release")}</footer></blockquote>'
    prow = "".join(
        f'<tr><td data-l="Contract"><b>{e(c["piid"])}</b><br><span class="muted-note">{fmt_date(c["signed"])}</span></td><td data-l="Vendor / work">{e(c["vendor"])}<br><span class="muted-note">{e(c["desc"])}</span></td>'
        f'<td data-l="Amount" class="num">{usd(c["amount"], 2)}</td><td data-l="Competition">{e(c["competition"])}</td><td data-l="Paid from">{e(c["accounts"])}</td>'
        f'<td data-l="Source">{H.src_link(c["url"], "USAspending")}</td></tr>' for c in pools)
    rows = [
        ("White House ballroom (East Wing)", "White House complex; NPS, USSS and the Military Office are named as planning partners",
         f'Construction: pledged by "President Trump, and other patriot donors" (about $200M in the Jul 31, 2025 announcement). Security: USSS. {H.src_link(WH_BALL, "White House")} '
         f'In June 2026 OMB set aside $385.8M (construction/procurement) plus about $10.75M (operations) of existing Secret Service funds for "White House Security Measures". {H.src_link(OMB, "OMB apportionment")}'),
        ("Lincoln Memorial Reflecting Pool", "NPS (National Mall and Memorial Parks)",
         f'Federal contracts, {usd(pool_total, 2)} across the {len(pools)} awards listed below, paid from NPS visitor-fee receipts, the NPS construction appropriation, and $5,000,000 from the NPS donations account. ' + " ".join(H.src_link(c["url"], c["piid"]) for c in pools)),
        ("Triumphal Arch (Memorial Circle)", "NPS (George Washington Memorial Parkway)",
         f'NEH has reserved $2M of special-initiative funds and $13M of matching funds (a match must be raised) for the Arch. {H.src_link(NEH, "NEH FY2026 spend plan")} NPS review: {H.src_link(ARCH, "EA/FONSI")}'),
        ("National Garden of American Heroes (not named by Schumer in the records found)", "NEH and NEA (statue grants)",
         f'$34M ($17M NEH, $17M NEA) plus $40M appropriated to NEH in P.L. 119-21 for statues. {H.src_link(NEH, "NEH FY2026 spend plan")}'),
    ]
    fund_rows = "".join(f'<tr><td data-l="Project"><b>{e(a)}</b></td><td data-l="Managed by">{e(b)}</td><td data-l="Who pays (primary record)">{c}<div class="cell-stamp">{stamp()}</div></td></tr>' for a, b, c in rows)

    ball_claim = claim_card(H, who="Sen. Chuck Schumer (floor remarks)", head="Ballroom: who pays",
        claim=q["2026-05-12"]["quote"] + " / " + q["2026-05-20"]["quote"],
        claim_src=f'{H.src_link(q["2026-05-12"]["url"], "May 12, 2026")} {H.src_link(q["2026-05-20"]["url"], "May 20, 2026")}',
        record=('The $1 billion in the reconciliation text went to the Secret Service "for the purposes of security adjustments and upgrades", and it said: '
                '"None of the funds made available under this section may be used for non-security elements of the East Wing Modernization Project." The provision was dropped before passage. '
                'The White House says construction is paid for by the President and donors.'),
        record_src=f'{H.src_link(SJC, "Bill text, Sec. 1115")} {H.src_link(WH_BALL, "White House, Jul 31, 2025")}',
        nuance=('Taxpayer money is going into security around the project: in June 2026 OMB set aside about $396.6M of existing Secret Service funds for "White House Security Measures", '
                'and Senate appropriators asked GAO whether that use is lawful. No GAO decision was located. Whether any of it pays for ballroom construction is not shown in the record.'),
        verdict_html='<span class="badge misleading">Rated misleading</span>')
    ball_ctx = f'<p class="muted-note">GAO request: {H.src_link(GAO_LTR, "Senate Appropriations letter, Jun 22, 2026")} · OMB line: {H.src_link(OMB, "USSS PC&amp;I apportionment")}</p>'
    pool_claim = claim_card(H, who="Sen. Chuck Schumer (floor remarks)", head="Reflecting Pool: no-bid, taxpayer-paid",
        claim=q["2026-06-22"]["quote"] + " / " + q["2026-08-04"]["quote"],
        claim_src=f'{H.src_link(q["2026-06-22"]["url"], "Jun 22, 2026")} {H.src_link(q["2026-08-04"]["url"], "Aug 4, 2026")}',
        record=(f'The main painting contract ({usd(pools[0]["amount"], 2)}) and the nano-bubble treatment contract ({usd(pools[1]["amount"], 2)}) are listed as "not competed" with "only one source". '
                'They are paid from NPS federal accounts: visitor-fee receipts, the construction appropriation, and $5M from the NPS donations account.'),
        record_src=f'{H.src_link(pools[0]["url"], "USAspending 140P2026C0028")} {H.src_link(pools[1]["url"], "USAspending 140P2026C0031")}',
        nuance='$5M of the largest contract came from the NPS donations account; the donor is not identified. Later repair contracts were competed. The "personal pool guy" description rests on news reports and was not checked.',
        verdict_html='<span class="badge proven">Consistent with the record</span>')
    op = (f'<div class="mon-opinion"><p><span class="op-tag">Opinion</span> Calling the projects "vanity projects" is opinion and is not rated. The funding facts sit beside it in the table above.</p>'
          f'{quote("2025-10-23")}{quote("2026-06-01")}{quote("2026-08-06")}</div>')
    nps = (f'<h3 class="watch-h3">His salary and the National Park Service</h3><ul class="watch-list">'
           f'<li><b>2017 Q1: $78,333.32</b> to NPS (check dated Mar 28, 2017). Interior later directed it to Antietam National Battlefield: restoration of the Newcomer House and 5,000 feet of rail fencing, with partner pledges bringing the project to $263,545. '
           f'{H.src_link(NPSFOIA, "NPS records")} {H.src_link(DOI17, "Interior, Jul 5, 2017")} {stamp()}</li>'
           f'<li><b>2020 Q2: $100,000</b> to NPS "to help repair and restore our GREAT National Monuments" (the President\'s post with the check). How NPS used it was not found in a primary record. {H.src_link(UCSB, "Archived post")} {stamp("amount")}</li>'
           f'<li><b>2025–26:</b> no salary donation to NPS was found.</li></ul>')
    rep = reported_box(H, [
        ("2026", "Washington Post: the ballroom contractor estimated the cost above $600M, with more than half expected from government entities.", "https://abcnews.com/Politics/senators-warily-eye-transfer-397m-secret-service-amid/story?id=134005395"),
        ("2025-10-23", "White House released a list of 37 ballroom donors (no amounts).", "https://www.cnn.com/2025/10/23/politics/ballroom-donors-white-house-trump"),
        ("2026-05", "The $1B security provision was removed after the parliamentarian's ruling and was not in the bill signed in June.", "https://apnews.com/article/white-house-ballroom-funding-senate-parliamentarian-republicans-042dc61b41d1163e08ee095e7ffb2e48"),
        ("2026", "Reflecting Pool contractor described as the pool contractor for Trump properties.", ""),
    ], title="Funding details that rest on news reports")
    html_s = f"""<section class="doc-section" id="tw-monuments"><h2>Monuments: who pays</h2>
<p>Sen. Chuck Schumer has called the ballroom, the Reflecting Pool work and the planned arch "vanity projects". Here is who pays for each, from budget records, contract records and official statements, and which agency runs each site.</p>
<div class="table-wrap"><table class="watch-table"><thead><tr><th>Project</th><th>Managed by</th><th>Who pays (primary record)</th></tr></thead><tbody>{fund_rows}</tbody></table></div>
{ball_claim}{ball_ctx}{pool_claim}
<details class="watch-details"><summary>Reflecting Pool contracts ({len(pools)} awards, {usd(pool_total, 2)})</summary>
<div class="table-wrap"><table class="watch-table"><thead><tr><th>Contract</th><th>Vendor / work</th><th>Amount</th><th>Competition</th><th>Paid from</th><th>Source</th></tr></thead><tbody>{prow}</tbody></table></div>
<p class="muted-note">Sum of the listed awards, not a full project cost. {stamp()}</p></details>
{op}{nps}{rep}</section>"""
    return html_s, {"schumer_quotes": len(m["schumer"]), "pool_contracts": len(pools), "pool_total": pool_total}


def build_trump(H):
    v, lic, mgmt, log, conf = load_trump()
    oge = v["oge_278e"]
    OGE = oge["url"]
    lic_total = round(sum(float(f["amount_usd"]) for f in lic), 2)
    countries = {}
    for f in lic:
        countries[f["country"]] = countries.get(f["country"], 0) + float(f["amount_usd"])
    ctry = sorted(countries.items(), key=lambda kv: -kv[1])
    pard = v["pardons"]
    gao = v["gao_ica"]
    cv = [c for c in conf if conflict_verified(c)]
    cr = [c for c in conf if not conflict_verified(c)]
    n_findings = sum(1 for c in conf if status_label(c) != "No official finding")

    tiles = [H.tile(usd(l["amount"]), l["label"], f'Line {l["line"]}: {e(l["detail"])}', accent=(i == 0),
                    count=l["amount"], prefix="$", src=H.src_link(OGE, "2025 OGE 278e"))
             for i, l in enumerate(oge["crypto_lines"])]
    tiles.append(H.tile(usd_short(lic_total), "Foreign license fees",
                        f"{len(lic)} license-fee lines from {len(countries)} countries, as listed on the form (sum of the lines)",
                        count=round(lic_total / 1e6, 1), prefix="$", suffix="M", decimals=1, src=H.src_link(OGE, "2025 OGE 278e")))
    tiles.append(H.tile(str(pard["individual_grants"]), "Clemency grants listed",
                        f'{pard["pardons"]} pardons · {pard["commutations"]} commutations, plus {len(pard["proclamations"])} blanket proclamations. DOJ list updated {fmt_date(pard["page_updated"])}',
                        count=pard["individual_grants"], src=H.src_link(pard["url"], "DOJ Pardon Attorney")))
    tiles.append(H.tile(str(len(gao["violations"])), "GAO budget-law violation decisions",
                        "Impoundment Control Act, 2025. Budget-law findings, not corruption findings",
                        count=len(gao["violations"]), src=H.src_link(gao["index_url"], "GAO")))
    s_rows, s_conf, s_total, s_named, s_rep, s_trs, s_rep_items = salary_section(H)
    tiles.append(H.tile(usd(s_total, 2), "Salary donated per the record",
                        f"{len(s_conf)} quarters with the amount stated in a primary record; {len(s_named)} more name the recipient only",
                        count=s_total, prefix="$", decimals=2, src=H.src_link(USC_SALARY, "3 U.S.C. 102")))
    mon_html, mon_stats = monuments_section(H)
    cm = court_money_rows(H, s_total, len(s_conf))
    cm_rows = "".join(f'<tr><td data-l="Item"><b>{e(a)}</b></td><td data-l="Amount on paper">{e(b)}</td><td data-l="What the record shows">{e(c)}</td><td data-l="Kept or owed?"><span class="status-chip">{e(d)}</span></td><td data-l="Source">{f}<div class="cell-stamp">{stamp()}</div></td></tr>' for a, b, c, d, f in cm)
    tiles.append(H.tile(str(n_findings), "Official findings on tracked overlaps",
                        f"Of {len(conf)} overlaps tracked, none has a court, IG, OGE, OSC or GAO finding", count=n_findings))

    fee_rows = "".join(
        f'<tr><td data-l="Line">{e(f["line"])}</td><td data-l="Project">{e(f["entity"])}</td><td data-l="Location">{e(f["location"])}</td>'
        f'<td data-l="Licensee (as listed)">{e(f["licensee"])}{" <span class=muted-note>(" + e(f["note"]) + ")</span>" if f["note"] else ""}</td>'
        f'<td data-l="Amount" class="num">{usd(float(f["amount_usd"]), 2 if float(f["amount_usd"]) % 1 else 0)}</td>'
        f'<td data-l="Source">{H.src_link(OGE, "278e line " + f["line"])}</td></tr>'
        for f in sorted(lic, key=lambda x: int(x["line"])))
    mg = "; ".join(f'{f["entity"]} ({f["location"]}; {f["licensee"]}) {usd(float(f["amount_usd"]))}' for f in mgmt)

    def conf_row(c):
        return (f'<tr><td data-l="Official action"><b>{e(c["government_action"])}</b><br><span class="muted-note">{e(c["action_date"])}</span><br>{H.src_link(c["action_primary_url"], "Primary record")}</td>'
                f'<td data-l="Trump family financial interest">{e(c["trump_family_financial_interest"])}<br>{H.src_link(c["interest_primary_url"], "Primary record")}</td>'
                f'<td data-l="Status"><span class="status-chip">{e(status_label(c))}</span></td>'
                f'<td data-l="Record note">{linkify(H, split_notes(c["notes"])[0]) or "—"}<div class="cell-stamp">{stamp("both sides")}</div></td></tr>')

    conf_rep = []
    for c in cv:
        for x in split_notes(c["notes"])[1]:
            conf_rep.append((c["action_date"].split(" ")[0], f'{c["government_action"]}: {x}', ""))
    for c in cr:
        known = []
        if c.get("action_primary_url"):
            known.append(f'Official action on record: {c["government_action"]} ({c["action_date"]})')
        else:
            known.append(f'{c["government_action"]} ({c["action_date"]}): no primary record of the action located')
        conf_rep.append((c["action_date"].split(" ")[0], f'{known[0]}. Interest: {c["trump_family_financial_interest"]}. Status: {c["confirmation_status"]}. {status_label(c)}.',
                         c.get("action_primary_url") or c.get("interest_primary_url"),
                         "Record of the action" if c.get("action_primary_url") else "Trump 278e"))
    conf_rep_html = reported_box(H, conf_rep, title="Overlaps where the key link rests on news reports",
                                 intro="The official action is often on record, but the financial link that would make it an overlap is reported only. These rows are not stamped and are not in the table above.")

    gao_rows = "".join(
        f'<tr><td data-l="Decision"><b>{e(g["id"])}</b></td><td data-l="Date">{fmt_date(g["date"])}</td><td data-l="Funds">{e(g["subject"])}</td>'
        f'<td data-l="GAO finding">{e(g["finding"])}</td><td data-l="Source">{H.src_link(g["url"], "GAO decision")} {H.src_link(g.get("pdf"), "PDF")}</td></tr>'
        for g in gao["violations"])
    nov = "; ".join(f'{g["id"]} ({fmt_date(g["date"])}, {g["subject"]}): {g["finding"].lower()}' for g in gao["no_violation"])

    # log-driven timeline
    ver, rep = [], []
    for r in sorted(log, key=lambda r: r["date"][:10]):
        o = LOG_OVERRIDE_TRUMP.get((r["date"], r["event_type"]), {})
        d = o.get("date", r["date"])
        if yes(r) and r.get("primary_source_url"):
            keep, rsent = split_notes(o.get("notes", r["notes"]))
            rep += [(d, f'{r["summary"].rstrip(".")}: {x}', r.get("secondary_lead_url")) for x in rsent]
            ver.append(rec_card(H, date=fmt_date(d), title=f'{r["subject"]} · {r["event_type"]}', body=r["summary"],
                                note=keep,
                                links=[("Primary record", r["primary_source_url"]), ("Related", r.get("secondary_lead_url"))]))
        else:
            rep.append((d, r["summary"], r.get("secondary_lead_url") or r.get("primary_source_url")))

    def logrow(pred):
        return [r for r in log if pred(r)]
    pard_rows = logrow(lambda r: r["event_type"] == "pardon")
    pard_list = "".join(f'<li><b>{fmt_date(r["date"])}</b> {e(r["summary"])} {H.src_link(r["primary_source_url"], "DOJ list")}</li>' for r in pard_rows)
    pard_rep = [(r["date"], f'{r["summary"].rstrip(".")}: {clean_note(r["notes"])}', r.get("secondary_lead_url"), "FEC lead" if "fec.gov" in (r.get("secondary_lead_url") or "") else "News lead")
                for r in pard_rows if "reported" in r["notes"].lower()]
    procl = "; ".join(f'{p["label"]} ({fmt_date(p["date"])})' for p in pard["proclamations"])

    charts = [{"id": "chart-fees", "type": "bar", "horizontal": True, "labels": [k for k, _ in ctry],
               "data": [round(x, 2) for _, x in ctry], "colors": ["#16325c"], "fmt": "usd"},
              {"id": "chart-crypto", "type": "bar", "horizontal": True, "labels": [l.get("short", l["label"]) for l in oge["crypto_lines"]],
               "data": [l["amount"] for l in oge["crypto_lines"]], "colors": ["#0c2340", "#1e3a5f", "#14532d", "#57534e"], "fmt": "usd"}]

    body = f"""
<header class="doc-head watch-head"><p class="doc-kicker">Watch</p><h1>Trump Accountability Watch</h1>
<p class="doc-lede">What the primary record shows about President Trump's reported income, official actions that overlap with his family's financial interests, clemency, and findings by oversight bodies. Every item links to its source.</p>
<p class="watch-checked">Checked {CHECKED}. Figures are as stated in the filings; SwampForce does not estimate or add up amounts the filings do not.</p></header>
{legend()}
{toc([("tw-money", "Income"), ("tw-salary", "Salary & judgments"), ("tw-monuments", "Monuments"), ("tw-conflicts", "Overlaps"), ("tw-clemency", "Clemency"), ("tw-oversight", "Oversight findings"), ("tw-visitors", "Visitor logs"), ("tw-log", "Full log")])}
<section class="doc-section" id="tw-money"><h2>Income reported on the 2025 OGE Form 278e</h2>
<div class="tile-grid">{"".join(tiles)}</div>
<div class="fact-box"><p class="fact-tag">{stamp()}</p><p>The crypto figures are separate lines on the form and are <b>not added together</b>. {e(oge["crypto_other"])} {e(oge["crypto_holdings"])}</p>
<p>OGE received the report on {fmt_date(oge["received"])} after an extension. {H.src_link(OGE, "OGE Form 278e (PDF)")} {H.src_link(oge["notice_url"], "OGE notice")}</p></div>
<div class="chart-grid two">{H.chart_card("chart-crypto", "Crypto income lines (not summed)", "Dollars as stated on the 278e")}{H.chart_card("chart-fees", "Foreign license fees by country", f"{len(lic)} lines, {len(countries)} countries")}</div>
<details class="watch-details"><summary>All {len(lic)} foreign license-fee lines ({usd(lic_total, 2)})</summary>
<div class="table-wrap"><table class="watch-table"><thead><tr><th>Line</th><th>Project</th><th>Location</th><th>Licensee (as listed)</th><th>Amount</th><th>Source</th></tr></thead><tbody>{fee_rows}</tbody></table></div>
<p class="muted-note">Separate foreign management fees, not counted above: {e(mg)}. Source: {H.src_link(OGE, "2025 OGE 278e")}</p></details>
</section>

<section class="doc-section" id="tw-salary"><h2>Money: the salary and the court judgments</h2>
<div class="answer-box"><p class="answer-tag">Plain English</p>
<p>The law sets the President's pay at <b>$400,000 a year</b> {H.src_link(USC_SALARY, "3 U.S.C. 102")}, and the Constitution says the President "shall" be paid {H.src_link(CONST_PAY, "Art. II, Sec. 1, Cl. 7")}, so he cannot simply refuse it. Instead he gives it away. <b>Salary he donated is money he did not keep.</b></p>
<p>Primary records (White House briefings, agency records and his own post with the check) confirm <b>{usd(s_total, 2)}</b> donated across {len(s_conf)} first-term quarters where the amount is stated. Records for {len(s_named)} more quarters name the recipient but not the amount, so those are not counted. News reports cover most other quarters; they are listed in grey below and not counted.</p>
<p>The big court judgments are a different story: the $464.6M New York award was thrown out on appeal, the $88.3M Carroll judgments stand, and DOJ says the $1.776B IRS settlement fund pays nothing to him.</p></div>
<div class="table-wrap"><table class="watch-table"><thead><tr><th>Item</th><th>Amount on paper</th><th>What the record shows</th><th>Kept or owed?</th><th>Source</th></tr></thead><tbody>{cm_rows}</tbody></table></div>
<p class="muted-note">Disclosures list ranges only. No official total net worth, before or after office. Yearly FEC legal-fee totals: not documented; one subset is $8,223,596.48 reported as “legal fees” or “legal expenses” ({H.src_link("https://www.fec.gov/files/legal/murs/8260/8260_04.pdf", "FEC MUR 8260")}). New ventures: value totals not documented. Full case history: <a href="lawfare.html#docket-1">Lawfare docket tracker</a>.</p>
<h3 class="watch-h3">Salary donations confirmed by a primary record</h3>
<div class="table-wrap"><table class="watch-table"><thead><tr><th>Quarter</th><th>Recipient</th><th>Purpose</th><th>Amount (primary record)</th><th>Source</th></tr></thead><tbody>{s_trs}</tbody>
<tfoot><tr><td colspan="3"><b>Total with the amount stated in a primary record</b></td><td class="num"><b>{usd(s_total, 2)}</b></td><td></td></tr></tfoot></table></div>
{reported_box(H, s_rep_items, title="Salary donations reported in the news, and quarters with no announcement", intro="These are not counted in the total above. Second-term donations appear here because only news reports of his post were located.")}
</section>
{mon_html}
<section class="doc-section" id="tw-conflicts"><h2>Official actions and family financial interests</h2>
<p>Each row pairs an official action with a Trump family financial interest, and both sides are confirmed by a primary record. An overlap in time or subject is not a finding of wrongdoing. The status column shows whether any court, inspector general, OGE, OSC or GAO has ruled on it.</p>
<div class="table-wrap"><table class="watch-table conflicts"><thead><tr><th>Official action</th><th>Trump family financial interest</th><th>Status</th><th>Record note</th></tr></thead><tbody>{"".join(conf_row(c) for c in cv)}</tbody></table></div>
{conf_rep_html}
</section>

<section class="doc-section" id="tw-clemency"><h2>Clemency</h2>
<p>The DOJ Office of the Pardon Attorney lists <b>{pard["individual_grants"]}</b> individual grants since Jan 20, 2025: <b>{pard["pardons"]}</b> pardons and <b>{pard["commutations"]}</b> commutations (last grant {fmt_date(pard["last_grant"])}). Some grantees are companies. {e(pard["excluded"])} The list also includes {len(pard["proclamations"])} blanket proclamations that cover many more people: {e(procl)}. {H.src_link(pard["url"], "DOJ Pardon Attorney list")} {stamp()}</p>
<ul class="watch-list">{pard_list}</ul>
{reported_box(H, pard_rep, title="Donor or business ties to grantees that rest on news reports")}
</section>

<section class="doc-section" id="tw-oversight"><h2>Findings by oversight bodies</h2>
<h3 class="watch-h3">GAO: Impoundment Control Act decisions</h3>
<p>These are <b>budget-law violations</b>: GAO found that funds Congress appropriated were withheld unlawfully. They are not corruption or ethics findings.</p>
<div class="table-wrap"><table class="watch-table"><thead><tr><th>Decision</th><th>Date</th><th>Funds</th><th>GAO finding</th><th>Source</th></tr></thead><tbody>{gao_rows}</tbody></table></div>
<p class="muted-note">For completeness: {e(nov)}. {H.src_link(gao["no_violation"][0]["url"], "GAO decision")} · All decisions: {H.src_link(gao["index_url"], "GAO Impoundment Control Act index")} {stamp()}</p>

<h3 class="watch-h3">Inspectors general</h3>
<p>In <i>Storch v. Hegseth</i> (D.D.C.), the court ruled that the firing of 17 inspectors general was unlawful because the required notice to Congress was not given, but it did not order them reinstated. {H.src_link("https://storage.courtlistener.com/recap/gov.uscourts.dcd.277385/gov.uscourts.dcd.277385.54.0_2.pdf", "Court ruling (PDF)")} {stamp()}</p>

<h3 class="watch-h3">Hatch Act</h3>
<p>SwampForce found no Office of Special Counsel finding against a senior 2025–26 official as of {CHECKED}; OSC's latest enforcement release covers rank-and-file cases. {H.src_link("https://www.osc.gov/news/2026-02-26/osc-highlights-recent-hatch-act-enforcement-actions-to-protect-integrity-of-federal-workforce", "OSC, Feb 26, 2026")} For comparison, in 2021 OSC found that 13 senior first-term officials violated the Hatch Act. {H.src_link("https://www.osc.gov/news/2021-11-09/osc-issues-hatch-act-report-documenting-violations-by-13-senior-trump-administration-officials-including-at-the-2020-republican-national-convention", "OSC report, Nov 9, 2021")} {stamp()}</p>

<h3 class="watch-h3">Emoluments</h3>
<p>No court has ruled on the merits of an emoluments claim for 2025–26. The first-term cases ended without a merits ruling: on Jan 25, 2021 the Supreme Court ordered the suits brought by CREW (No. 20-330) and by the District of Columbia and Maryland (No. 20-331) dismissed as moot after the term ended. {H.src_link(v["emoluments"]["scotus_order_url"], "Supreme Court order list")} {H.src_link(v["emoluments"]["docket_url"], "Docket 20-330")} {stamp()}</p>
<p>The Air Force confirms it accepted a Qatari Boeing 747-8i for the VC-25B bridge program, and L3Harris reports delivering the modified aircraft in June 2026. {H.src_link("https://www.af.mil/News/Article-Display/Article/4474728/vc-25b-bridge-program-completes-flight-testing-prepares-for-summer-rollout/", "U.S. Air Force")} {H.src_link("https://www.l3harris.com/newsroom/press-release/2026/06/l3harris-delivers-vc-25b-aircraft-us-air-force", "L3Harris")} {stamp()} A reported plan to transfer the aircraft to a presidential library later is not confirmed by a primary record.</p>
</section>

<section class="doc-section" id="tw-visitors"><h2>White House visitor logs</h2>
<p><b>Not published.</b> The White House disclosures page lists ethics waivers, financial disclosures and transaction reports but no visitor logs, and the visitor-logs address returns "not found". {H.src_link("https://www.whitehouse.gov/disclosures/", "whitehouse.gov/disclosures")} {stamp("checked " + CHECKED)}</p>
<p>The Biden and Obama White Houses published logs voluntarily. {H.src_link("https://bidenwhitehouse.archives.gov/disclosures/visitor-logs/", "Biden archive")} {H.src_link("https://obamawhitehouse.archives.gov/briefing-room/disclosures/visitor-records", "Obama archive")}</p>
<p>In <i>Doyle v. DHS</i> (2d Cir., May 18, 2020), the court held that White House and Mar-a-Lago visitor logs held by the Secret Service "are not agency records subject to FOIA", so FOIA cannot compel their release. {H.src_link("https://law.justia.com/cases/federal/appellate-courts/ca2/18-2814/18-2814-2020-05-18.html", "Opinion")} {H.src_link("https://www.justice.gov/oip/doyle-v-dhs-no-18-2814-2020-wl-2516644-2d-cir-may-18-2020-lohier-j", "DOJ OIP summary")} {stamp()}</p>
</section>

<section class="doc-section" id="tw-log"><h2>Full log ({len(ver)} confirmed items)</h2>
<div class="rec-grid">{"".join(ver)}</div>
{reported_box(H, rep)}
</section>
<section class="reader-path"><p>How evidence is ranked: <a class="btn ghost-dark sm" href="about.html">Methodology</a> <a class="btn navy sm" href="movement-watch.html">Movement Watch</a></p></section>
"""
    stats = {"conflicts_verified": len(cv), "conflicts_reported": len(cr), "log_verified": len(ver), "log_reported": len(rep),
             "foreign_license_lines": len(lic), "foreign_license_countries": len(countries), "foreign_license_total": lic_total,
             "pardon_grants": pard["individual_grants"], "gao_violations": len(gao["violations"]), "tiles": len(tiles),
             "salary_confirmed_quarters": len(s_conf), "salary_total_primary": s_total, "salary_recipient_only": len(s_named), "salary_reported": len(s_rep), **mon_stats}
    html_out = H.page("trump-watch.html", "Trump Accountability Watch · Swamp Force",
                      "Primary-record tracker: President Trump's 2025 financial disclosure, official actions that overlap with family financial interests, clemency and oversight findings.",
                      body, charts=charts, serious=True)
    return html_out, stats


# ───────────────────────── Movement Watch ─────────────────────────
def key(r):
    return (r["date"], r["subject"], r["event_type"])


def build_movement(H):
    v = json.loads((WD / "watch-verified.json").read_text(encoding="utf-8"))
    log = read_csv(MW / "log.csv")
    viol = read_csv(MW / "violence-2026.csv")
    cands = read_csv(MW / "candidates.csv")
    fec = v["el_sayed_fec"]

    omitted = []
    by_subj = {"Abdul El-Sayed": ([], []), "Hasan Piker": ([], []), "DSA": ([], [])}
    special = {}
    for r in log:
        s = r["subject"]
        if s not in by_subj:
            continue
        et = r["event_type"]
        ver, rep = by_subj[s]
        summ, note, links = r["summary"], clean_note(r["notes"]), [("Primary record", r.get("primary_source_url")), ("Related", r.get("secondary_lead_url"))]
        if s == "Hasan Piker" and "AIPAC" in r["summary"]:
            omitted.append("log.csv: Piker 'AIPAC boss call was made' post (reported only; original post not located)")
            continue
        if et == "campaign finance":
            summ = (f"FEC candidate page (committees {', '.join(fec['committees'])}), coverage {fec['coverage'].replace(' to ', ' to ')}: "
                    f"total receipts {usd(fec['total_receipts'], 2)}; ending cash on hand {usd(fec['cash_on_hand'], 2)}.")
            note, links = "", [("FEC record", fec["url"])]
        if et == "election result" and s == "Abdul El-Sayed":
            summ = "Certified as the Democratic nominee for U.S. Senate in Michigan by the Board of State Canvassers."
            note = "The certification minutes do not list vote counts. Totals from results aggregators are listed separately below."
            links = [("Board of State Canvassers minutes (PDF)", r["primary_source_url"])]
            m = re.search(r"Won Democratic US Senate primary: (.*?)\.(?: Faces|$)", r["summary"])
            rep.append(("2026-08-04", "Primary vote totals as reported by results aggregators: " + (m.group(1) if m else r["summary"]) + ". The official state results page could not be reached to confirm.", ""))
        if et == "interview" and s == "Hasan Piker":
            special["axios"] = r
            rep.append((r["date"], "Quotes attributed to the Axios interview (wording relayed from coverage; not yet checked against the full video): " + r["summary"].split(":", 1)[-1].strip(), r.get("secondary_lead_url")))
            summ = "Sat for an Axios Show interview. The full video is the primary record."
            note = "Quotes attributed to this interview are listed separately below until they are checked against the video."
            links = [("Full video", r["primary_source_url"])]
        if et == "claim check":
            special["minab"] = r
            continue
        if s == "DSA" and et == "statement" and "one hundred" in r["summary"]:
            special["venezuela"] = r
            continue
        if yes(r) and r.get("primary_source_url"):
            note, rsent = split_notes(note)
            rep += [(r["date"], x, r.get("secondary_lead_url")) for x in rsent]
            ver.append(rec_card(H, date=fmt_date(r["date"]), title=et[:1].upper() + et[1:], body=summ, note=note, links=links))
        else:
            lead = r.get("secondary_lead_url") or r.get("primary_source_url")
            rep.append((r["date"], redact_minors(summ), lead))

    # candidate claims (site vocabulary: Rated misleading; the DSA toll is Disputed, not rated)
    cc = []
    for c in cands:
        rating = c["rating"].lower()
        if rating.startswith("misleading") and c.get("proof_url"):
            cc.append(("Abdul El-Sayed", claim_card(H, head="Defunding the police", who=c["subject"], claim=c["claim"],
                        claim_src="Relayed by " + H.src_link(c["claim_url"], "CNN KFile, Jul 7, 2026"),
                        record='In a June 23, 2020 WDET interview he said: "Defunding the police is disinvesting in the means of incarcerating someone or killing them on the streets and investing more in the means of educating and empowering and engaging communities." WDET reports that, asked about the term, he said it is "a sentiment he agrees with."',
                        record_src=H.src_link(c["proof_url"], "WDET, Jun 23, 2020") + " " + stamp(),
                        nuance='In the same interview he said "I didn\'t say \'defund the police\'" and that he prefers to call it "re-funding." Rated misleading, not false.',
                        verdict_html='<span class="badge misleading">Rated misleading</span>')))
        elif rating.startswith("unsupported"):
            omitted.append(f"candidates.csv: {c['subject']} AIPAC claim rated Unsupported. Not placed on the Unsupported page: the original post was not located, and that page lists only claims from the reverify review file")
        elif rating.startswith("disputed"):
            cc.append(("DSA", claim_card(H, head="Venezuela death toll", who="Democratic Socialists of America (national statement, Mar 25, 2026)", claim=c["claim"],
                        claim_src="Listed on " + H.src_link(c["claim_url"], "DSA statements index"),
                        record="Disputed. Official figures conflict, and no single primary record settles the number. SwampForce does not rate this figure.",
                        record_src='<span class="muted-note">Conflicting official figures are reported in news coverage; none located as a primary record.</span>',
                        verdict_html='<span class="chip disputed">Disputed</span>')))

    # violence table: official records only; motive only where officials stated one; minors never named
    def motive(t):
        return "Not stated in the official record" if re.search(r"per AP|reported|not confirmed|not located", t, re.I) or not t else t
    vo = [r for r in viol if r.get("official_source_url")]
    vr = [r for r in viol if not r.get("official_source_url")]

    def status(t):
        t = redact_minors(t)
        t = re.sub(r"(https?://\S+?)(\)|$)", lambda m: H.src_link(m.group(1), "Filing") + m.group(2), e(t))
        return t + (' <span class="rep-tag sm">Part reported</span>' if "reported" in t.lower() else "")
    vrows = "".join(
        f'<tr><td data-l="Date">{e(r["date"])}</td><td data-l="Location">{e(r["location"])}</td><td data-l="Incident">{e(redact_minors(r["incident"]))}</td>'
        f'<td data-l="Charges">{e(redact_minors(r["charges"]))}</td><td data-l="Motive stated by officials">{e(motive(r["stated_motive_per_official_record"]))}</td>'
        f'<td data-l="Status">{status(r["status"])}</td><td data-l="Official record">{H.src_link(r["official_source_url"], "Official record")}</td></tr>'
        for r in vo)
    vrep = reported_box(H, [(r["date"], f'{r["location"]}: {redact_minors(r["incident"])}', "") for r in vr],
                        title="Incidents with no official record located",
                        intro="Listed for completeness only. They are not in the table and not counted.")

    el_v, el_r = by_subj["Abdul El-Sayed"]
    hp_v, hp_r = by_subj["Hasan Piker"]
    ds_v, ds_r = by_subj["DSA"]
    minab = special.get("minab")
    minab_html = ""
    if minab:
        minab_html = claim_card(H, head="Strike on a school in Minab, Iran", who="Hasan Piker (Axios interview; wording relayed from coverage)",
                                claim="Piker cited a U.S. Tomahawk strike on a girls' school in Minab, Iran.", claim_src=H.src_link(special["axios"]["primary_source_url"], "Full interview video") if special.get("axios") else "",
                                record="The UN Independent International Fact-Finding Mission on Iran found reasonable grounds to believe that the Feb 28, 2026 strike on the Shajareh Tayyebeh Primary School in Minab was carried out by the United States. Weapons specialists it cites identified the munition as a Tomahawk. It cites credible independent information that 157 people were killed, including 123 children.",
                                record_src=H.src_link(UN_MINAB, "UN report A/HRC/63/61 (advance edited version, Sep 18, 2026)") + " " + stamp(),
                                verdict_html='<span class="badge proven">Consistent with the record</span>')
    wdm = "https://program.dsausa.org/wp-content/uploads/2026/07/WDM-Program.pdf"
    wdm_quotes = [("Healthcare", "Guarantee universal healthcare at no cost to individuals"),
                  ("Work week", "a 32 hour work week with full pay and benefits"),
                  ("Housing", "establish universal rent control"),
                  ("Policing", "redirect funding to public services as steps towards fully abolishing the police and prison system"),
                  ("Military", "Defund the Department of War. End all foreign wars and close overseas military bases."),
                  ("Israel", "End all military and economic aid to Israel."),
                  ("Immigration", "ABOLISH ICE. End ICE detention and deportations"),
                  ("Sanctions", "End economic warfare against countries whose governments act independently of the United States, such as Cuba, Venezuela, and Iran."),
                  ("Government", "Abolish the Electoral College. Replace the President and Supreme Court with an executive and judiciary chosen by and subordinate to Congress."),
                  ("Congress", "abolish the Senate"),
                  ("Economy", "Establish public ownership of the largest corporations and essential industries")]
    wdm_html = "".join(f'<li><b>{e(k)}:</b> "{e(q)}"</li>' for k, q in wdm_quotes)
    n_endorse = sum(len(re.findall(r"\(", r["summary"])) or 1 for r in log if r["subject"] == "DSA" and r["event_type"] == "national endorsement" and yes(r))

    tiles = [H.tile("Aug 24, 2026", "El-Sayed certified as nominee", "Michigan Board of State Canvassers, Democratic U.S. Senate primary",
                    src=H.src_link("https://www.michigan.gov/sos/-/media/Project/Websites/sos/BSC-Meeting-Minutes/2026/August-24-2026-BSC-draft-minutes.pdf", "BSC minutes")),
             H.tile(usd_short(fec["total_receipts"]), "El-Sayed campaign receipts", f"Through Jul 15, 2026 · cash on hand {usd_short(fec['cash_on_hand'])}",
                    count=round(fec["total_receipts"] / 1e6, 2), prefix="$", suffix="M", decimals=2, src=H.src_link(fec["url"], "FEC")),
             H.tile(str(n_endorse), "DSA national endorsements, 2026", "As listed on DSA's own electoral site", count=n_endorse,
                    src=H.src_link("https://electoral.dsausa.org/dsa-national-endorsement-criteria/", "DSA electoral site")),
             H.tile(str(len(vo)), "2026 political-violence incidents with an official record", "All ideologies · not exhaustive", accent=True, count=len(vo))]

    charts = []
    body = f"""
<header class="doc-head watch-head"><p class="doc-kicker">Watch</p><h1>Movement Watch</h1>
<p class="doc-lede">The primary record on three subjects in the 2026 news: Michigan Senate nominee Abdul El-Sayed, Los Angeles streamer Hasan Piker, and the Democratic Socialists of America. It also covers 2026 political violence across all ideologies, from official records only.</p>
<p class="watch-checked">Checked {CHECKED}. Positions are quoted in the subjects' own words. No labels are applied that the record does not support.</p></header>
{legend()}
{toc([("mw-elsayed", "Abdul El-Sayed"), ("mw-piker", "Hasan Piker"), ("mw-dsa", "DSA"), ("mw-claims", "Claims checked"), ("mw-violence", "Political violence 2026")])}
<div class="tile-grid">{"".join(tiles)}</div>

<section class="doc-section" id="mw-elsayed"><h2>Abdul El-Sayed</h2>
<p>El-Sayed is the certified Democratic nominee for U.S. Senate in Michigan. The positions below are quoted from his campaign site.</p>
<ul class="watch-list quotes">
<li>"I will fight to expand Medicare to cover all necessary healthcare, including vision, dental, and hearing, and extend it to every single American from cradle to grave without premiums, copays, or deductibles." {H.src_link("https://abdulforsenate.com/priority/medicare-for-all-the-path-to-a-healthier-america/", "Campaign site")}</li>
<li>"I support taxing capital gains over $1 million at the same rate as ordinary income and closing the stepped-up basis loophole" and "a billionaire tax on wealth over $1 billion." {H.src_link("https://abdulforsenate.com/priority/money-in-your-pocket/", "Campaign site")}</li>
<li>On ICE: "It must be abolished." On the filibuster: "I believe that it is antidemocratic and should be abolished." On Iran: "I oppose the illegal and unjustifiable war in Iran." {H.src_link("https://abdulforsenate.com/priority/money-out-of-politics/", "Campaign site")}</li>
</ul>
<p class="watch-sub"><b>DSA ties on the record:</b> DSA's own 2019 article reports he shared the stage with Rep. Rashida Tlaib at the Detroit DSA Douglass-Debs dinner (Oct 5, 2019). {H.src_link("https://www.dsausa.org/blog/chapter-and-verse-how-to-raise-funds-and-build-community/", "DSA, Dec 11, 2019")} {stamp()} SwampForce found no national DSA endorsement of him on DSA's electoral site. {H.src_link("https://electoral.dsausa.org/dsa-national-endorsement-criteria/", "DSA electoral site")} Other reported DSA appearances and his reported 2026 comments on DSA are listed under Reported only.</p>
<div class="rec-grid">{"".join(el_v)}</div>
{reported_box(H, el_r)}
</section>

<section class="doc-section" id="mw-piker"><h2>Hasan Piker</h2>
<p>Hasan Piker is the Los Angeles-based Twitch streamer known as HasanAbi. SwampForce has not confirmed that he is a formal DSA member and does not label him one.</p>
<div class="rec-grid">{"".join(hp_v)}</div>
{reported_box(H, hp_r)}
</section>

<section class="doc-section" id="mw-dsa"><h2>Democratic Socialists of America</h2>
<p>DSA's July 2026 national program, <i>Workers Deserve More</i>, in its own words: {H.src_link(wdm, "Program (PDF)")} {stamp()}</p>
<ul class="watch-list quotes">{wdm_html}</ul>
<div class="rec-grid">{"".join(ds_v)}</div>
{reported_box(H, ds_r)}
</section>

<section class="doc-section" id="mw-claims"><h2>Claims checked</h2>
<div class="frames">{"".join(h for _, h in cc)}{minab_html}</div>
</section>

<section class="doc-section" id="mw-violence"><h2>Political violence in 2026, all ideologies</h2>
<p>This table lists only incidents that have an official record: DOJ, Secret Service, FBI, a state attorney general, city police or a court filing. A motive is shown only where officials stated one. Minors are not named. <b>The list is not exhaustive</b>: DOJ files threat cases every month.</p>
<div class="table-wrap"><table class="watch-table violence"><thead><tr><th>Date</th><th>Location</th><th>Incident</th><th>Charges</th><th>Motive stated by officials</th><th>Status</th><th>Source</th></tr></thead><tbody>{vrows}</tbody></table></div>
<p class="watch-sub"><b>2026 developments in earlier cases:</b> all nine defendants in the July 2025 Prairieland ICE facility attack were convicted on Mar 13, 2026. {H.src_link("https://www.justice.gov/usao-ndtx/pr/antifa-cell-members-convicted-prairieland-ice-detention-center-shooting", "DOJ")} Forrest Pemberton was indicted over a planned 2024 attack targeting Jewish victims. {H.src_link("https://www.justice.gov/opa/pr/florida-man-indicted-attempted-mass-shooting-targeting-jewish-victims", "DOJ")}</p>
{vrep}
{reported_box(H, [("2026", "Vance Boelter (2025 killings of Minnesota legislator Melissa Hortman and her husband) received federal life sentences.", "")], title="Earlier-case developments reported only")}
</section>
<section class="reader-path"><p>How evidence is ranked: <a class="btn ghost-dark sm" href="about.html">Methodology</a> <a class="btn navy sm" href="trump-watch.html">Trump Accountability Watch</a></p></section>
"""
    stats = {"violence_official": len(vo), "violence_reported": len(vr), "claims_shown": len(cc) + (1 if minab_html else 0),
             "elsayed_verified": len(el_v), "elsayed_reported": len(el_r), "piker_verified": len(hp_v), "piker_reported": len(hp_r),
             "dsa_verified": len(ds_v), "dsa_reported": len(ds_r), "dsa_endorsements": n_endorse, "tiles": len(tiles), "omitted": omitted}
    html_out = H.page("movement-watch.html", "Movement Watch · Swamp Force",
                      "Primary-record tracker: Abdul El-Sayed, Hasan Piker, the Democratic Socialists of America, and 2026 political violence across all ideologies.",
                      body, charts=charts or None, serious=True)
    return html_out, stats




# ───────────────────────── 2020: The Record ─────────────────────────
R20 = ROOT / "record-2020"
R20_HEADINGS = {  # neutral page headings for the draft's section titles
    "2": "2. The 2020 unrest: deaths, damage and prosecutions",
    "5": "5. The official response",
}
R20_OMIT_CANDIDATES = {"R2020-05": "on hold: officials' exact wording not yet verified from the original video",
                       "R2020-06": "on hold: no named, primary-sourced person who made the claim"}
HCME = "https://content.govdelivery.com/attachments/MNHENNE/2020/06/01/file_attachments/1464238/2020-3700%20Floyd,%20George%20Perry%20Update%206.1.2020.pdf"
AUTOPSY = "http://web.archive.org/web/20200722232711/https://www.hennepin.us/-/media/hennepinus/residents/public-safety/documents/Autopsy_2020-3700_Floyd.pdf"
AFME = "https://mncourts.gov/_media/migration/high-profile-cases/27-cr-20-12949-tt/exhibit508252020.pdf"
EX4 = "https://mncourts.gov/_media/additionalassets/getattachment/media/stateofminnesotavtouthao/container-documents/content-documents/exhibit-4.pdf?lang=en-US"
THAO_V = "https://mncourts.gov/_media/migration/high-profile-cases/27-cr-20-12949-tt/tt-verdict.pdf"
COA = "https://mncourts.gov/_media/migration/high-profile-cases/27-cr-20-12646/opinion-published.pdf"
PLEA = "https://storage.courtlistener.com/recap/gov.uscourts.mnd.194493/gov.uscourts.mnd.194493.142.0_59.pdf"
FEDJ = "https://storage.courtlistener.com/recap/gov.uscourts.mnd.194493/gov.uscourts.mnd.194493.529.0.pdf"
SCOTUS_CH = "https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/23-416.html"
III = "https://www.iii.org/fact-statistic/facts-statistics-civil-disorders"
DOJ300 = "https://web.archive.org/web/20220118032009/https://www.justice.gov/opa/pr/over-300-people-facing-federal-charges-crimes-committed-during-nationwide-demonstrations"
MFF = "https://mnfreedomfund.org/wp-content/uploads/2024/07/2020-Form-990-Public-3.pdf"
ACLED = "https://acleddata.com/report/demonstrations-and-political-violence-america-new-data-summer-2020"
AAR = "https://kstp.com/wp-content/uploads/2022/03/2020-Civil-Unrest-After-Action-Review-Report.pdf"
MNSEN = "https://assets.senate.mn/committees/2019-2020/3102_Committee_on_Transportation_Finance_and_Policy/Review%20of%20Lawlessness%20and%20Government%20Responses%20to%20Minnesota%27s%202020%20Riots.pdf"
EO64 = "https://mn.gov/governor/assets/EO%2020-64%20Final_tcm1055-433855.pdf"
EO65 = "https://mn.gov/governor/assets/EO%2020-65%20Final_tcm1055-434635.pdf"
LEE = "https://storage.courtlistener.com/recap/gov.uscourts.mnd.189358/gov.uscourts.mnd.189358.67.0_2.pdf"
SEA_EO = "https://spdblotter.seattle.gov/wp-content/uploads/sites/11/2020/07/Executive-Order-2020-08_Directive-City-Depts_Cal-Anderson-Park-Area.pdf"
CNN_CPT = "https://transcripts.cnn.com/show/CPT/date/2020-06-11/segment/01"
CNN_ES = "https://transcripts.cnn.com/show/es/date/2020-08-25/segment/01"
TVARCH = "https://archive.org/details/CNNW_20200825_090000_Early_Start_With_Christine_Romans_and_Laura_Jarrett/start/358/end/418"
SER3 = "https://seattle.gov/documents/departments/oig/sentinel%20event%20review/wave3reportfinal.pdf"
OREGON = "https://storage.courtlistener.com/recap/gov.uscourts.ord.153632/gov.uscourts.ord.153632.23.0_4.pdf"


def _md_inline(H, s):
    s = re.sub(r"`[^`]*\.(?:md|csv)`", "the open-questions list", s)
    out, last = [], 0
    for m in re.finditer(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", s):
        out.append(_md_fmt(s[last:m.start()]))
        out.append(H.src_link(m.group(2), m.group(1)))
        last = m.end()
    out.append(_md_fmt(s[last:]))
    return "".join(out)


def _md_fmt(t):
    t = e(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", t)
    return t


def r20_sections(text):
    """Split the draft into {number: (title, [lines])} for '## n.' sections."""
    secs, cur = {}, None
    for line in text.splitlines():
        m = re.match(r"^## (\d+)\. (.+)$", line)
        if m:
            cur = m.group(1); secs[cur] = (m.group(2).strip(), []); continue
        if cur and not line.startswith("---") and not line.startswith("*Candidate entries"):
            secs[cur][1].append(line)
    return secs


def r20_render(H, lines, sec_no):
    """Markdown subset -> HTML. Every bullet in the draft carries its own primary-record link."""
    html_parts, in_ul, in_sub = [], False, False

    def close(level):
        nonlocal in_ul, in_sub
        if in_sub and level <= 1:
            html_parts.append("</ul></li>"); in_sub = False
        if in_ul and level == 0:
            html_parts.append("</ul>"); in_ul = False
    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            continue
        if re.search(r"open-questions\.md", line) and re.match(r"^- No single official|^\*Specific people", line.strip()):
            # keep the fact, drop the internal file pointer
            line = re.sub(r"\s*\(see `open-questions\.md`\)|\s*See `open-questions\.md`\.", "", line)
        m3 = re.match(r"^### ([\d.]+) (.+)$", line)
        if m3:
            close(0)
            num = m3.group(1)
            html_parts.append(f'<h3 class="watch-h3 r20-h3" id="r20-{num.replace(".", "-")}">{e(num)} {_md_fmt(m3.group(2))} {stamp()}</h3>')
            continue
        if line.startswith("  - "):
            if not in_sub:
                if html_parts and html_parts[-1].endswith("</li>"):
                    html_parts[-1] = html_parts[-1][:-5]
                html_parts.append('<ul class="watch-list sub">'); in_sub = True
            html_parts.append(f"<li>{_md_inline(H, line[4:])}</li>")
            continue
        if line.startswith("- "):
            close(1)
            if not in_ul:
                html_parts.append('<ul class="watch-list r20-list">'); in_ul = True
            html_parts.append(f"<li>{_md_inline(H, line[2:])}</li>")
            continue
        close(0)
        t = line.strip()
        if re.fullmatch(r"\*\*.+\*\*", t):
            html_parts.append(f'<p class="r20-sub"><b>{_md_inline(H, t[2:-2])}</b></p>')
        elif re.fullmatch(r"\*[^*].*[^*]\*(?:\s*\(\[.+\]\(.+\)\))?", t) or t.startswith("*"):
            html_parts.append(f'<p class="muted-note r20-note">{_md_inline(H, t.strip("*").replace("*", ""))}</p>')
        else:
            html_parts.append(f"<p>{_md_inline(H, t)}</p>")
    close(0)
    return "".join(html_parts)


def build_record2020(H):
    text = (R20 / "section-draft.md").read_text(encoding="utf-8")
    cands = read_csv(R20 / "candidates.csv")
    srcs_rows = read_csv(R20 / "sources.csv")
    unverified = {r["source_url"] for r in srcs_rows if r.get("verified", "").lower() != "yes"}
    used = set(re.findall(r"\]\((https?://[^)\s]+)\)", text))
    bad = used & unverified
    if bad:  # the draft must cite only verified sources
        raise SystemExit(f"record-2020 draft cites sources marked unverified: {sorted(bad)}")
    secs = r20_sections(text)
    omitted = [f"{cid}: {why}" for cid, why in R20_OMIT_CANDIDATES.items()]
    omitted += [f"sources.csv row not used (verified=no): {r['claim']}" for r in srcs_rows if r["source_url"] in unverified]

    def num(rx):
        m = re.search(rx, text)
        if not m:
            raise SystemExit(f"record-2020: figure not found in draft: {rx}")
        return m.group(1)
    insured = num(r"insured losses estimated at over \$(\d+ billion)")
    charged = num(r"\"more than (\d+) individuals in 29 states")
    arson = num(r"Approximately (\d+) individuals have been charged with offenses relating to arson")
    contrib = num(r"reports \$([\d,]+) in contributions")
    bail = num(r"APPROXIMATELY \$([\d,]+) IN CRIMINAL BAIL")
    bail_n = num(r"APPROXIMATELY (\d+) MINNESOTANS")
    expenses = num(r"total expenses of \$([\d,]+)")
    nbfn = num(r"a \$([\d,]+) grant to the National Bail Fund Network")
    imm = num(r"approximately \$([\d,]+) in immigration bonds")
    acled = num(r"\[i\]n more than (\d+%) of all demonstrations")
    revenue = num(r"\$([\d,]+) in total revenue")
    surplus = num(r"exceeded expenses by \$([\d,]+)")
    f = lambda s: float(s.replace(",", ""))

    tiles = [
        H.tile(f"${insured.replace(' billion', 'B')}+", "Insured losses, May 26–Jun 8, 2020", "Insurance-industry estimate (PCS/Verisk via Triple-I), \"subject to further evaluation\"", accent=True, src=H.src_link(III, "Triple-I")),
        H.tile(f"{charged}+", "People federally charged by Sep 24, 2020", "29 states and D.C., per DOJ", count=int(charged), suffix="+", src=H.src_link(DOJ300, "DOJ release (archived)")),
        H.tile(f"~{arson}", "Charged with arson or explosives offenses", "Subset of the federal cases, per DOJ", count=int(arson), prefix="~", src=H.src_link(DOJ300, "DOJ release (archived)")),
        H.tile(usd_short(f(contrib)), "Minnesota Freedom Fund 2020 contributions", f"Total expenses ${f(expenses) / 1e6:.2f}M (Form 990)", count=round(f(contrib) / 1e6, 1), prefix="$", suffix="M", decimals=1, src=H.src_link(MFF, "MFF Form 990")),
        H.tile(f"~${f(bail) / 1e6:g}M", "Criminal bail posted by MFF", f"For about {bail_n} Minnesotans in 2020. The filing does not say how much was protest-related", src=H.src_link(MFF, "MFF Form 990")),
        H.tile(f"{acled}+", "Demonstrations with no violence or destruction", "Research data (ACLED), May 26–Aug 22, 2020; see its limits below", src=H.src_link(ACLED, "ACLED")),
    ]
    charts = [{"id": "chart-mff", "type": "bar", "horizontal": True,
               "labels": ["Contributions", "Total expenses", "Criminal bail posted (approx.)", "Grant to National Bail Fund Network", "Immigration bonds (approx.)"],
               "data": [f(contrib), f(expenses), f(bail), f(nbfn), f(imm)], "colors": ["#16325c", "#57534e", "#14532d", "#1e3a5f", "#7c2d12"], "fmt": "usd"}]

    glance = f"""<div class="r20-glance">
<div class="r20-col"><h3>What the autopsy and toxicology found</h3><ul class="watch-list">
<li>Other significant conditions: "Arteriosclerotic and hypertensive heart disease; fentanyl intoxication; recent methamphetamine use." {H.src_link(HCME, "HCME")}</li>
<li>Severe multifocal arteriosclerotic heart disease; enlarged heart (540 g). "No life-threatening injuries identified"; no injury to the neck structures or larynx. {H.src_link(AUTOPSY, "Autopsy")}</li>
<li>Hospital blood: fentanyl 11 ng/mL; methamphetamine 19 ng/mL. {H.src_link(AUTOPSY, "Autopsy, toxicology")}</li>
<li>Prosecutor's memo of a May 31 call: Dr. Baker called the fentanyl level "pretty high"; the memo summarizes it as "a fatal level of fentanyl under normal circumstances" and records that he would have concluded overdose if Floyd had been found dead at home with no other contributing factors. {H.src_link(EX4, "Exhibit 4, State v. Thao")}</li>
</ul></div>
<div class="r20-col"><h3>Cause, manner and the courts</h3><ul class="watch-list">
<li>Cause: "Cardiopulmonary arrest complicating law enforcement subdual, restraint, and neck compression." Manner: "Homicide." {H.src_link(HCME, "HCME")}</li>
<li>Armed Forces Medical Examiner: "agrees with the autopsy findings and the cause of death certification"; "We concur with the reported manner of death of homicide." {H.src_link(AFME, "AFME consult")}</li>
<li>Chauvin: jury convicted on all three counts (Apr 20, 2021); 270 months; affirmed on appeal; U.S. Supreme Court denied review (Nov 20, 2023). {H.src_link(COA, "Minn. Ct. App.")} {H.src_link(SCOTUS_CH, "Docket 23-416")}</li>
<li>Federal plea: Chauvin admitted his force "impaired Mr. Floyd's ability to obtain and maintain sufficient oxygen to sustain Mr. Floyd's life." {H.src_link(PLEA, "Plea agreement")} Thao, Kueng and Lane were convicted federally. {H.src_link(THAO_V, "Thao verdict")}</li>
</ul></div></div>
<p class="muted-note">Both columns are part of the same record and are shown together on purpose. The medical examiner's release notes that "Manner of death is not a legal determination of culpability or intent." {H.src_link(HCME, "HCME")}</p>"""

    tl = [("May 25, 2020, 9:25 p.m.", "George Floyd is pronounced dead.", [("Autopsy", AUTOPSY)]),
          ("May 26", "Federal prosecutors later described \"mostly peaceful protests\" on May 26, followed by \"three nights of violence and destruction.\"", [("U.S. v. Lee memo", LEE)]),
          ("May 27, evening", "The Mayor makes a verbal and then a written request to the Governor for the National Guard. The city's review found the initial requests lacked the information the Guard required for approval.", [("City after-action review", AAR)]),
          ("May 28", "Further requests include the required information (city review). Governor Walz signs EO 20-64 declaring a peacetime emergency and directing the Guard to state active duty. The Senate majority report says the Guard was first mobilized that afternoon, \"18 hours after Mayor Frey requested assistance.\"", [("City review", AAR), ("EO 20-64", EO64), ("MN Senate report (partisan)", MNSEN)]),
          ("May 28", "Max It Pawn, 2726 East Lake Street, is set on fire (per a federal sentencing memorandum).", [("U.S. v. Lee memo", LEE)]),
          ("May 28, 9:55 or 10:15 p.m.", "Order to evacuate the Third Precinct. The Senate report's MPD timeline says 9:55 p.m. and \"2215 hours – PRECINCT 3 IS COMPROMISED\"; the city review says the evacuation was ordered at 10:15 p.m. and that rioters then took control and set fires.", [("City review", AAR), ("MN Senate report (partisan)", MNSEN)]),
          ("May 29–31", "EO 20-65 imposes a curfew in Minneapolis and Saint Paul from 8 p.m. Friday, May 29 to 6 a.m. Saturday, and again the following night.", [("EO 20-65", EO65)]),
          ("Jul 20, 2020", "The remains of Oscar Lee Stewart, 30, are found in the Max It Pawn rubble.", [("U.S. v. Lee memo", LEE)])]
    tl_html = "".join(f'<li><span class="tl-date">{e(d)}</span><p>{e(t)}</p><p class="rec-foot">{srcs(H, L)}</p></li>' for d, t, L in tl)

    def frame_card(head, said_h, said, said_src, rec_h, rec, rec_src, chip='<span class="chip ghost">Own words vs. the record</span>'):
        return (f'<article class="frame open watch-claim"><div class="frame-head static"><span class="frame-tag">{e(head)}</span><span class="frame-meta">{chip}</span></div>'
                f'<div class="frame-body"><div class="frame-cols"><div class="frame-col claim-side"><h3>{e(said_h)}</h3><p>{said}</p><p class="meta-line">{said_src}</p></div>'
                f'<div class="frame-col truth-side"><h3>{e(rec_h)}</h3><p>{rec}</p><p class="meta-line">{rec_src}</p></div></div></div></article>')
    framing = "".join([
        frame_card("Seattle protest zone, June 11, 2020", "Mayor Jenny Durkan on CNN", e('"more like a block party atmosphere. It\'s not an armed takeover"; "there is no threat right now to the public"; asked how long the zone would last: "I don\'t know. We could have the Summer of Love."'),
                   H.src_link(CNN_CPT, "CNN transcript"), "Her own Executive Order 2020-08 (June 30)",
                   e('Documents shootings on June 20, 22 and 29, "a 525%" increase in person-related crime from June 2–30 versus 2019, and "a pervasive presence of firearms." It also states that "much of the expression has been peaceful."'), H.src_link(SEA_EO, "Seattle EO 2020-08") + " " + stamp()),
        frame_card("Kenosha broadcast, August 25, 2020", "CNN on-screen caption", e('"FIERY BUT MOSTLY PEACEFUL PROTESTS AFTER POLICE SHOOTING", shown over burning structures.'), H.src_link(TVARCH, "Internet Archive TV capture"),
                   "The same segment's words", e('Correspondent Omar Jimenez: "one of multiple locations that have been burning in Kenosha", in "stark contrast" to daytime demonstrations that were "largely peaceful." Anchor Christine Romans: "At least three buildings were on fire in Kenosha overnight."'), H.src_link(CNN_ES, "CNN transcript") + " " + stamp()),
        frame_card("Minneapolis, May 26–28, 2020", "Federal prosecutors (U.S. v. Lee)", e('"mostly peaceful protests" on May 26, 2020, followed by "three nights of violence and destruction."'), H.src_link(LEE, "Sentencing memorandum"),
                   "Research data (ACLED), May 26–Aug 22", e('"In more than 93% of all demonstrations connected to the movement, demonstrators have not engaged in violence or destructive activity." Limits stated by ACLED: its violent category includes events where violence may have been started by police or others; it counts events, not their size or damage; the period ends before Kenosha.'), H.src_link(ACLED, "ACLED") + " " + stamp()),
    ])

    cc, unsup = [], []
    for c in cands:
        cid = c["Item_ID"]
        if cid in R20_OMIT_CANDIDATES or c.get("Candidate_Status", "").upper().startswith("HOLD"):
            continue
        began = c["Claim"].split("\n")[1] if "\n" in c["Claim"] else ""
        claim = c["Claim"].split("\n")[0]
        lvl = c["Evidence_Level"]
        notes = c["Notes"]
        if lvl == "Unsupported":
            unsup.append(f'<article class="unsup-card" id="r20-{e(cid.lower())}"><p class="unsup-meta"><span class="unsup-tag">Unsupported</span><span>{e(cid)}</span></p>'
                         f'<h2>{e(claim)}</h2><p class="unsup-who"><b>Said by</b> {e(c["Who_Pushed_It"])}</p>'
                         f'<p><b>Why it is unsupported</b> {e(notes)}</p><p class="unsup-src">{H.src_link(c["Truth_Source_URL"], "Seattle OIG Sentinel Event Review")} {stamp()}</p></article>')
            continue
        caveat = ""
        if cid == "R2020-02":
            m = re.search(r"CAVEAT:(.+?)Rate as misleading", notes, re.S)
            caveat = (m.group(1).strip() if m else "") + " The rating applies only to the \"no threat ... to the public\" and \"not an armed takeover\" remarks, not to the \"Summer of Love\" phrase."
            notes = notes.split("CAVEAT:")[0].strip()
        badge = '<span class="badge proven">Proven false</span>' if lvl == "Proven false" else '<span class="badge misleading">Rated misleading</span>'
        claim_src = H.src_link(c["Primary_Source_URL"], "Original transcript/video" if "archive.org" in c["Primary_Source_URL"] or "transcripts" in c["Primary_Source_URL"] else "Primary record")
        cc.append(claim_card(H, head=f'{cid} · {c["Who_Pushed_It"]}', who=c["Who_Pushed_It"], claim=claim,
                             claim_src=(f'<span class="muted-note">{e(began)}</span><br>' if began else "") + claim_src, record=notes, record_src=H.src_link(c["Truth_Source_URL"], "The record") + " " + stamp(),
                             nuance=("Timing caveat: " + caveat) if caveat else "", verdict_html=badge))

    not_supported = [
        ("An official national death toll for the 2020 unrest.", "No single official count was found in government records; press tallies are not used here.", MNSEN),
        ("That the certified cause of death was an overdose.", "The medical examiner listed fentanyl intoxication as an \"other significant condition\" and certified homicide; the Armed Forces Medical Examiner concurred. The record also shows Dr. Baker called the level \"pretty high\" and testified he would certify fentanyl toxicity if Floyd had been found alone at home with no other findings.", HCME),
        ("How much Minnesota Freedom Fund bail went to people arrested in the protests or riots.", "The 2020 Form 990 does not break this out.", MFF),
        ("That Kamala Harris herself donated to the Minnesota Freedom Fund.", "Her June 1, 2020 post asked others to donate; it does not say whether she did.", "https://twitter.com/KamalaHarris/status/1267555018128965643"),
        ("An audited figure for Minneapolis property damage.", "The Minnesota Senate report's \"over $500 million\" is sourced in the report to a newspaper.", MNSEN),
        ("That businesses in the CHOP were extorted.", "The Sentinel Event Review found no police reports of extortion. That does not prove none occurred.", SER3),
        ("Who ordered Seattle's East Precinct evacuated, and why.", "The city's review says this was unclear for more than a year.", SER3),
        ("A ruling on the merits of Oregon's suit over federal officers in Portland.", "The court ruled Oregon lacked standing, \"without reaching the merits.\"", OREGON),
        ("A single time for the Third Precinct evacuation order.", "The Senate report says 9:55 p.m.; the city review says 10:15 p.m.", AAR),
    ]
    ns_html = "".join(f'<li><b>{e(a)}</b> {e(b)} {H.src_link(u, "Record")}</li>' for a, b, u in not_supported)

    def sec(n, anchor, inner_before="", inner_after=""):
        title, lines = secs[n]
        title = R20_HEADINGS.get(n, f"{n}. {title}")
        return (f'<section class="doc-section" id="{anchor}"><h2>{e(title)}</h2>{inner_before}'
                f'{r20_render(H, lines, n)}{inner_after}</section>')

    body = f"""
<header class="doc-head watch-head"><p class="doc-kicker">Watch</p><h1>2020: The Record</h1>
<p class="doc-lede">The death of George Floyd, the unrest that followed, the bail funds, and the official response, taken from primary records: medical-examiner and court records, government orders and reviews, filings, and people's own words. Where a source is research data, industry data, a party's legal brief or a partisan legislative report, the page says so.</p>
<p class="watch-checked">Checked {CHECKED}. Items that could not be confirmed from a primary record are left out.</p></header>
{legend()}
{toc([("r20-floyd", "George Floyd: the full record"), ("r20-timeline", "Minneapolis timeline"), ("r20-unrest", "Unrest"), ("r20-bail", "Bail funds"), ("r20-framing", "\"Peaceful\" framing"), ("r20-claims", "Claims checked"), ("r20-response", "Response"), ("r20-notsupported", "What the record does not support")])}
<div class="tile-grid">{"".join(tiles)}</div>
<div class="chart-grid two">{H.chart_card("chart-mff", "Minnesota Freedom Fund, 2020 (Form 990)", "Dollars as reported; bail and bond figures are the filing's approximations")}
<div class="fact-box"><p class="fact-tag">{stamp()}</p><p>The Minnesota Freedom Fund reported ${revenue} in total revenue for 2020, exceeding its expenses by ${surplus}. Its filing reports approximately ${bail} in criminal bail for about {bail_n} Minnesotans, about ${imm} in immigration bonds, and a ${nbfn} grant to the National Bail Fund Network. It does not say how much bail went to people arrested in the protests or riots. {H.src_link(MFF, "MFF 2020 Form 990")}</p></div></div>

<section class="doc-section r20-floyd" id="r20-floyd"><h2>1. The death of George Floyd: the full record</h2>
{glance}
<p class="doc-actions"><a class="btn navy sm" href="record-2020-floyd.html">In depth: the court file, the "homicide" ruling, causation, ties and comparable cases</a></p>
<details class="watch-details" open><summary>The complete record, section by section</summary>{r20_render(H, secs["1"][1], "1")}</details>
</section>

<section class="doc-section" id="r20-timeline"><h2>Minneapolis, May 25 – July 20, 2020: Third Precinct and the National Guard</h2>
<p>The city-commissioned review and the Minnesota Senate majority's report give different accounts of the Guard request; both are shown.</p>
<ol class="r20-timeline">{tl_html}</ol></section>

{sec("2", "r20-unrest")}
{sec("3", "r20-bail")}
<section class="doc-section" id="r20-framing"><h2>4. The "peaceful" framing, in officials' and broadcasters' own words</h2>
<p>Each card sets the words beside the record from the same time. These cards are not ratings; ratings are under Claims checked.</p>
<div class="frames">{framing}</div></section>

<section class="doc-section" id="r20-claims"><h2>Claims checked</h2>
<p>These entries are shown on this page only. They are not part of the Trump-era case catalog.</p>
<div class="frames">{"".join(cc)}</div>
<div class="unsup-list">{"".join(unsup)}</div></section>

{sec("5", "r20-response")}

<section class="doc-section" id="r20-notsupported"><h2>What the record does not support</h2>
<aside class="r20-ns"><ul class="watch-list">{ns_html}</ul></aside></section>
<section class="reader-path"><p>How evidence is ranked: <a class="btn ghost-dark sm" href="about.html">Methodology</a> <a class="btn navy sm" href="trump-watch.html">Trump Accountability Watch</a> <a class="btn ghost-dark sm" href="movement-watch.html">Movement Watch</a></p></section>
"""
    stats = {"tiles": len(tiles), "claims_rated": len(cc), "unsupported_on_page": len(unsup), "timeline_items": len(tl),
             "framing_cards": 3, "not_supported_items": len(not_supported), "draft_sources_used": len(used),
             "omitted": omitted}
    html_out = H.page("record-2020.html", "2020: The Record · Swamp Force",
                      "The primary record on George Floyd's death, the 2020 unrest, bail funds and the official response.",
                      body, charts=charts, serious=True)
    return html_out, stats


# ───────────────────────── registry ─────────────────────────
SECTIONS = [
    Section("trump-watch.html", "Trump Accountability Watch", "Disclosures, overlaps, clemency, findings",
            [TW / "baseline.md", TW / "log.csv", TW / "conflicts.csv", WD / "trump-278e-foreign-fees.csv", WD / "watch-verified.json"], build_trump),
    Section("movement-watch.html", "Movement Watch", "El-Sayed, Piker, DSA, 2026 violence",
            [MW / "baseline.md", MW / "log.csv", MW / "violence-2026.csv", MW / "candidates.csv", WD / "watch-verified.json"], build_movement),
    Section("record-2020.html", "2020: The Record", "Floyd record, unrest, bail funds, response",
            [R20 / "section-draft.md", R20 / "sources.csv", R20 / "candidates.csv", R20 / "open-questions.md"], build_record2020),
]

# Planned sections: no builder yet, so they are never built. Add a builder + Section when the
# research folder has final, approved outputs. planned_status() reports what is there now.
PLANNED = []  # accountability and energy now have builders (watch2.py)


def planned_status():
    """Top-level entries only (hidden folders like .venv skipped); used for reporting, never for building."""
    out = {}
    for slug, title, d in PLANNED:
        items = sorted(p.name + ("/" if p.is_dir() else "") for p in d.iterdir() if not p.name.startswith(".")) if d.exists() else []
        out[slug] = {"title": title, "folder": str(d), "entries": items, "built": False}
    return out


def active():
    return [s for s in SECTIONS if s.ready()]


# Second wave of pages (accountability trackers, energy, voters, Floyd deep record, censorship)
from watch2 import SECTIONS2  # noqa: E402  (imported last: watch2 uses the helpers above)
SECTIONS += SECTIONS2

# Journal pilot (short visual essays + Article V page)
from journal import SECTIONS_J  # noqa: E402
SECTIONS += SECTIONS_J

# Grok Build gap pieces (Sep 26, 2026)
from grokgap import SECTIONS_G  # noqa: E402
SECTIONS += SECTIONS_G
