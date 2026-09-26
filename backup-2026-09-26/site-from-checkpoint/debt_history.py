"""National debt history, 1790 to today (scorecard.html, Compare tab, right after 'How it is counted').
Data: Treasury Fiscal Data Historical Debt Outstanding (year-end, 1790-2025) + Debt to the Penny (latest record),
saved in midterm-data/ on Sep 26, 2026. Writes public_html/data/debt-history-1790-2026.csv. Every fact below was read
on the linked official page on Sep 26, 2026."""
import csv, json, math, html
from pathlib import Path
HERE = Path(__file__).parent
HIST = json.load(open(HERE / "midterm-data/debt_outstanding_api_2026-09-26.json"))["data"]
PENNY = json.load(open(HERE / "midterm-data/debt_to_penny_latest_2026-09-26.json"))["data"][0]
e = lambda s: html.escape(s, quote=False)
DS_HIST = "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/"
DS_PENNY = "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"
TD = "https://www.treasurydirect.gov/government/historical-debt-outstanding/"
AFG = "https://fiscaldata.treasury.gov/americas-finance-guide/national-debt/"
CBO = "https://www.cbo.gov/publication/62105"
CRS = "https://www.congress.gov/crs-product/IN12324"
CG = "https://www.congress.gov/bill/"
BY = {int(r["record_fiscal_year"]): (r["record_date"], float(r["debt_outstanding_amt"])) for r in HIST}
NOW_DATE, NOW = PENNY["record_date"], float(PENNY["tot_pub_debt_out_amt"])
NOW_TXT = "Sep 24, 2026" if NOW_DATE == "2026-09-24" else NOW_DATE
FIRST_Y, LAST_Y = min(BY), max(BY)

def money(v):
    if v >= 1e12: return f"${v/1e12:.2f} trillion"
    if v >= 1e9: return f"${v/1e9:.2f} billion"
    if v >= 1e6: return f"${v/1e6:.1f} million"
    return f"${v:,.0f}"

def val(y): return NOW if y == "now" else BY[y][1]
def lab(y): return NOW_TXT if y == "now" else str(y)

def write_csv(out_dir):
    d = Path(out_dir) / "data"; d.mkdir(parents=True, exist_ok=True)
    with open(d / "debt-history-1790-2026.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["record_date", "fiscal_year", "debt_outstanding_usd", "source"])
        for y in sorted(BY):
            w.writerow([BY[y][0], y, f"{BY[y][1]:.2f}", "Treasury Fiscal Data, Historical Debt Outstanding"])
        w.writerow([NOW_DATE, PENNY["record_fiscal_year"], PENNY["tot_pub_debt_out_amt"], "Treasury Fiscal Data, Debt to the Penny (total public debt outstanding)"])

# (title, start, end, sentence, [(label, url)])
ERAS = [
 ("The founding debt", 1790, 1812, "Congress took on the Revolutionary War debt. The Funding Act of 1790 swapped the old debts for new federal bonds. By 1811 the debt had been cut.", [("Funding Act of 1790 (Treasury history)", TD), ("Revolutionary War debt (Treasury)", AFG)]),
 ("War of 1812", 1812, 1816, "The war was paid for mainly with borrowed money.", [("Treasury history of the debt", TD)]),
 ("Paid off", 1816, 1835, "Land sales and budget cuts brought the debt to almost zero. By January 1835 all interest-bearing debt was paid off, the only time it has happened.", [("Treasury: debt briefly eliminated in 1835", AFG), ("Treasury history of the debt", TD)]),
 ("Civil War", 1860, 1866, "Debt grew more than 40 times over. The Legal Tender Act of 1862 authorized $150 million in notes and $500 million in bonds.", [("Legal Tender Act, 1862 (Treasury history)", TD), ("Civil War debt (Treasury)", AFG)]),
 ("World War I", 1916, 1919, "Congress authorized the first Liberty Loan of $5 billion.", [("Liberty Loan Act, 1917 (Treasury history)", TD)]),
 ("Depression and New Deal", 1930, 1940, "Hard times pushed deficits up as public works were funded. By 1933 the debt topped $22 billion. Savings Bonds went on sale in 1935.", [("Treasury history of the debt", TD)]),
 ("World War II", 1941, 1946, "About $211 billion of the war’s estimated $323 billion cost was borrowed. Debt held by the public peaked at 106% of the economy in 1946.", [("War financing (Treasury history)", TD), ("CBO: 106% of GDP in 1946", CBO)]),
 ("Postwar years", 1946, 1965, "Budgets ran surpluses from 1946 to 1949. Debt rose only modestly, and after inflation its real value fell.", [("Treasury history of the debt", TD)]),
 ("Great Society, Medicare, Vietnam", 1965, 1980, "Medicare and Medicaid became law on July 30, 1965. The Vietnam War and Great Society programs raised deficits. 1969 was the last surplus until 1998.", [("Medicare and Medicaid Act, 1965 (National Archives)", "https://www.archives.gov/milestone-documents/medicare-and-medicaid-act"), ("Treasury history of the debt", TD)]),
 ("1980s: tax cuts and defense buildup", 1981, 1990, "The Economic Recovery Tax Act of 1981 cut taxes. Borrowing paid for a military buildup. The debt more than tripled from 1980 to 1990.", [("Economic Recovery Tax Act of 1981 (H.R. 4242)", CG + "97th-congress/house-bill/4242"), ("Treasury history of the debt", TD)]),
 ("1990s: budget deals", 1990, 2001, "Congress passed budget reconciliation acts in 1990 and 1993. The budget went back into the black in 1998.", [("Omnibus Budget Reconciliation Act of 1990 (P.L. 101-508)", CG + "101st-congress/house-bill/5835"), ("Omnibus Budget Reconciliation Act of 1993 (P.L. 103-66)", CG + "103rd-congress/house-bill/2264"), ("Treasury: back in the black in 1998", TD)]),
 ("2001 to 2008: tax cuts, two wars, a drug benefit", 2001, 2008, "Congress passed tax cuts in 2001 and 2003, authorized force in Afghanistan (2001) and Iraq (2002), and added Medicare drug coverage (2003). Treasury lists the Afghanistan and Iraq wars among the big debt spikes.", [("EGTRRA 2001 (P.L. 107-16)", CG + "107th-congress/house-bill/1836"), ("JGTRRA 2003 (P.L. 108-27)", CG + "108th-congress/house-bill/2"), ("Use of force, 2001 (P.L. 107-40)", CG + "107th-congress/senate-joint-resolution/23"), ("Iraq resolution, 2002 (P.L. 107-243)", CG + "107th-congress/house-joint-resolution/114"), ("Medicare Part D, 2003 (P.L. 108-173)", CG + "108th-congress/house-bill/1"), ("Treasury: debt spikes", AFG)]),
 ("2008 crisis and recovery", 2008, 2016, "The 2008 bank rescue (TARP) and the 2009 Recovery Act passed during the Great Recession, one of the big debt spikes Treasury names.", [("Emergency Economic Stabilization Act, TARP (P.L. 110-343)", CG + "110th-congress/house-bill/1424"), ("American Recovery and Reinvestment Act (P.L. 111-5)", CG + "111th-congress/house-bill/1"), ("Treasury: debt spikes", AFG)]),
 ("2017 tax law", 2016, 2019, "The 2017 tax law (TCJA) lowered individual income tax rates. The 2025 reconciliation act made those lower rates permanent, per CBO.", [("Tax Cuts and Jobs Act (P.L. 115-97)", CG + "115th-congress/house-bill/1"), ("CBO on the 2017 and 2025 laws", CBO)]),
 ("COVID-19", 2019, 2021, "The CARES Act (2020) and the American Rescue Plan (2021) passed. Treasury says spending rose about 50% from FY2019 to FY2021.", [("CARES Act (P.L. 116-136)", CG + "116th-congress/house-bill/748"), ("American Rescue Plan Act (P.L. 117-2)", CG + "117th-congress/house-bill/1319"), ("Treasury: spending up about 50%", AFG)]),
 ("2022 to today: interest", 2021, "now", "Net interest rose from $970 billion in 2025 to over $1.0 trillion in 2026, CBO projects. CBO estimates the 2025 reconciliation act (P.L. 119-21) added $4.7 trillion to deficits over 2026–2035.", [("CBO Budget and Economic Outlook, Feb 2026", CBO), ("Debt to the Penny", DS_PENNY)]),
]

def svg_chart():
    W, H, L, R, T, B = 720, 300, 64, 12, 14, 30
    ys = sorted(BY); pts = [(int(BY[y][0][:4]) + int(BY[y][0][5:7]) / 12, BY[y][1]) for y in ys] + [(2026 + 8.8 / 12, NOW)]
    lo, hi = 4, 14  # log10 $10K .. $100T
    X = lambda t: L + (t - 1790) / (2027 - 1790) * (W - L - R)
    Y = lambda v: T + (hi - math.log10(max(v, 1e4))) / (hi - lo) * (H - T - B)
    grid = "".join(f'<line x1="{L}" x2="{W-R}" y1="{Y(10**k):.1f}" y2="{Y(10**k):.1f}" stroke="#e2e8f0"/><text x="{L-6}" y="{Y(10**k)+4:.1f}" text-anchor="end" font-size="11" fill="#64748b">{t}</text>'
                   for k, t in [(4, "$10K"), (6, "$1M"), (8, "$100M"), (10, "$10B"), (12, "$1T"), (14, "$100T")])
    xt = "".join(f'<line x1="{X(y):.1f}" x2="{X(y):.1f}" y1="{H-B}" y2="{H-B+4}" stroke="#94a3b8"/><text x="{X(y):.1f}" y="{H-8}" text-anchor="middle" font-size="11" fill="#64748b">{y}</text>' for y in range(1800, 2021, 40))
    path = "M" + " L".join(f"{X(t):.1f},{Y(v):.1f}" for t, v in pts)
    marks = [(1835, BY[1835][1], "1835: almost zero"), (1866, BY[1866][1], "Civil War"), (1919, BY[1919][1], "WWI"), (1946, BY[1946][1], "WWII"), (2026.7, NOW, f"{money(NOW)}")]
    mk = "".join(f'<circle cx="{X(t):.1f}" cy="{Y(v):.1f}" r="3.5" fill="#b91c1c"/><text x="{X(t)+(-6 if t>2000 else 6):.1f}" y="{Y(v)+(16 if t==1835 else -8):.1f}" font-size="11" font-weight="700" fill="#0c2340" text-anchor="{"end" if t>2000 else "start"}">{e(s)}</text>' for t, v, s in marks)
    return (f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="Total federal debt, {FIRST_Y} to {NOW_TXT}, log scale" style="display:block;max-width:100%;height:auto">'
            f'{grid}{xt}<line x1="{L}" x2="{W-R}" y1="{H-B}" y2="{H-B}" stroke="#94a3b8"/><path d="{path}" fill="none" stroke="#0c2340" stroke-width="2.2"/>{mk}</svg>')

def canvas_js():
    import json
    ys = sorted(BY)
    labels = [str(y) for y in ys] + [NOW_TXT]
    data = [round(BY[y][1] / 1e9, 3) for y in ys] + [round(NOW / 1e9, 3)]
    spec = {"id": "chart-debt-history", "type": "line", "labels": labels, "data": data, "fmt": "bn", "log": True,
            "hrefs": ["debt-eras"] * len(data)}
    return f"<script>window.SF_CHARTS=(window.SF_CHARTS||[]).concat([{json.dumps(spec)}]);</script>"

def section():
    rows = "".join(f'<tr><td>{e(t)}</td><td>{lab(a)}</td><td class="n">{money(val(a))}</td><td>{lab(b)}</td><td class="n">{money(val(b))}</td></tr>' for t, a, b, *_ in ERAS)
    eras = "".join(f'<div class="mt-era-row{" now" if b == "now" else ""}"><div class="mt-era-who"><b>{lab(a)}–{"now" if b == "now" else b}</b><span>{money(val(a))} → {money(val(b))}</span></div>'
                   f'<p><b>{e(t)}.</b> {e(s)} ' + " · ".join(f'<a href="{u}" target="_blank" rel="noopener">{e(l)} ↗</a>' for l, u in links) + "</p></div>" for t, a, b, s, links in ERAS)
    src = f'<a href="{DS_HIST}" target="_blank" rel="noopener">Treasury, Historical Debt Outstanding ↗</a> · <a href="{DS_PENNY}" target="_blank" rel="noopener">Treasury, Debt to the Penny ↗</a> · <a href="data/debt-history-1790-2026.csv">Download the data (CSV)</a>'
    return f"""
<h3 class="strip-h" id="debt-history">The national debt, {FIRST_Y} to today</h3>
<p class="strip-dek">235 years, both parties, many Congresses. The debt rose in wars and crises and fell in some years between them.</p>
<div class="chart-card"><h3>Total federal debt, {FIRST_Y} to {NOW_TXT}</h3><p class=sub>Dollars, not adjusted for inflation. Log scale: each line is 10 times the one below. Hover for any year; tap to open the eras.</p><div class="chart-wrap tall"><canvas id="chart-debt-history" role="img" aria-label="Total federal debt, {FIRST_Y} to {NOW_TXT}, log scale"></canvas></div></div>{canvas_js()}
<p class="period-note">Year-end totals {FIRST_Y}–{LAST_Y} from Treasury (the record date moved from January 1 to July 1, June 30 and then September 30 over time). Today’s figure: {money(NOW)} total public debt outstanding on {NOW_TXT}, Treasury Debt to the Penny. {src}</p>
<details class="mt-era"><summary>Debt at the start and end of each era</summary><div class="table-wrap"><table class="rank-table"><thead><tr><th>Era</th><th>Start</th><th class="n">Debt</th><th>End</th><th class="n">Debt</th></tr></thead><tbody>{rows}</tbody></table></div></details>
<details class="mt-era" id="debt-eras"><summary>What drove it, era by era</summary>{eras}</details>
<aside class="verify-box" style="padding:18px 20px"><h2 style="font-size:1.2rem;margin-bottom:10px">How Congress let it happen</h2>
<p>FY1997 was the last time all regular spending bills were enacted by the October 1 start of the fiscal year. Since then Congress has relied on stopgap bills (continuing resolutions) to keep the government funded past October 1. <a href="{CRS}" target="_blank" rel="noopener">CRS, Omnibus Appropriations ↗</a></p>
<p>From 1982 through FY2024, 36 omnibus spending packages were enacted, carrying 276 of the 525 possible regular spending bills. <a href="{CRS}" target="_blank" rel="noopener">CRS ↗</a></p>
<p>Funding lapsed and the government shut down in October and November 2025. <a href="{CBO}" target="_blank" rel="noopener">CBO, Feb 2026 ↗</a></p>
<p>Looking ahead, CBO says rising spending on Social Security and Medicare and rising net interest drive outlays up. By 2056 net interest (6.9% of GDP) would exceed Social Security (6.0%) and Medicare (5.5%). <a href="{CBO}" target="_blank" rel="noopener">CBO long-term outlook ↗</a></p></aside>
<aside class="jr-view"><p><span class="op-tag">Our view</span> <span class="jr-view-who">Opinion</span></p><p class="jr-view-txt">This debt was built over more than two centuries by both parties. Today's members didn't create all of it, but they are the ones who can stop adding to it.</p></aside>
<p class="period-note"><b>Check it yourself:</b> every year-end figure is on <a href="{DS_HIST}" target="_blank" rel="noopener">Treasury Fiscal Data, Historical Debt Outstanding ↗</a>, and today’s total is on <a href="{DS_PENNY}" target="_blank" rel="noopener">Debt to the Penny ↗</a>.</p>
"""
