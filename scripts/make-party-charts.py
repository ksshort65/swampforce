#!/usr/bin/env python3
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.ticker import MultipleLocator, FuncFormatter

bg = "#0b0b0b"
fg = "#ece8dc"
muted = "#a39e93"
gop_c = "#c53030"
dem_c = "#2b6cb0"
split_c = "#3d3d3d"
clinton_c = "#2c5282"
bush_c = "#9b2c2c"
obama_c = "#2c5282"
trump_c = "#e53e3e"
biden_c = "#3182ce"
hurt_c = "#9a8f82"
help_c = "#d8d0c0"


def oval_of(year):
    if year <= 2000:
        return "Clinton", clinton_c
    if year <= 2008:
        return "Bush", bush_c
    if year <= 2016:
        return "Obama", obama_c
    if year <= 2020:
        return "Trump", trump_c
    if year <= 2024:
        return "Biden", biden_c
    return "Trump", trump_c


def mark_ovals(ax, years, positions=None, y_frac=0.97):
    """Name the Oval on the chart."""
    if not years:
        return
    positions = list(years) if positions is None else list(positions)
    labels = [oval_of(y)[0] for y in years]
    i = 0
    n = len(years)
    while i < n:
        j = i
        while j < n and labels[j] == labels[i]:
            j += 1
        mid = (positions[i] + positions[j - 1]) / 2
        ax.text(
            mid,
            y_frac,
            labels[i].upper(),
            transform=ax.get_xaxis_transform(),
            ha="center",
            va="top",
            fontsize=10,
            fontweight="bold",
            color=fg,
            clip_on=False,
        )
        if j < n:
            edge = (positions[j - 1] + positions[j]) / 2
            ax.axvline(edge, color="#3a3a3a", lw=0.8, zorder=0)
        i = j


plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "text.color": fg,
        "axes.labelcolor": fg,
        "xtick.color": muted,
        "ytick.color": muted,
    }
)

rows = [
    (1993, 3.0, "dem"),
    (1994, 2.6, "dem"),
    (1995, 2.8, "gop"),
    (1996, 3.0, "gop"),
    (1997, 2.3, "gop"),
    (1998, 1.6, "gop"),
    (1999, 2.2, "gop"),
    (2000, 3.4, "gop"),
    (2001, 2.8, "split"),
    (2002, 1.6, "split"),
    (2003, 2.3, "gop"),
    (2004, 2.7, "gop"),
    (2005, 3.4, "gop"),
    (2006, 3.2, "gop"),
    (2007, 2.8, "dem"),
    (2008, 3.8, "dem"),
    (2009, -0.4, "dem"),
    (2010, 1.6, "dem"),
    (2011, 3.2, "split"),
    (2012, 2.1, "split"),
    (2013, 1.5, "split"),
    (2014, 1.6, "split"),
    (2015, 0.1, "gop"),
    (2016, 1.3, "gop"),
    (2017, 2.1, "gop"),
    (2018, 2.4, "gop"),
    (2019, 1.8, "split"),
    (2020, 1.2, "split"),
    (2021, 4.7, "dem"),
    (2022, 8.0, "dem"),
    (2023, 4.1, "split"),
    (2024, 2.9, "split"),
    (2025, 2.6, "gop"),
]
years = [r[0] for r in rows]
vals = [r[1] for r in rows]
cols = [{"gop": gop_c, "dem": dem_c, "split": split_c}[r[2]] for r in rows]

fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
bars = ax.bar(years, vals, color=cols, width=0.78, linewidth=0)
for y, v, b in zip(years, vals, bars):
    if y == 2022:
        b.set_edgecolor("#ffffff")
        b.set_linewidth(1.4)
        ax.annotate(
            "Democrats ran Congress\nBiden Oval  ·  June 2022\n9.1%  (BLS)",
            xy=(2022, 8.0),
            xytext=(2012.2, 7.15),
            fontsize=10,
            color=fg,
            fontweight="bold",
            arrowprops=dict(arrowstyle="->", color=fg, lw=1.1),
            ha="left",
        )
    if v >= 3.4 or y in (2021, 2022, 2023):
        ax.text(y, v + 0.18, f"{v:.1f}", ha="center", va="bottom", fontsize=8, color=fg, fontweight="bold")
ax.axhline(0, color="#5a564c", lw=0.8)
ax.set_ylabel("Actual Consumer Price Index that year  ·  percent", fontsize=12, color=muted)
ax.set_title("ACTUAL INFLATION  ·  WHO HELD CONGRESS", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "The Consumer Price Index is what it cost to live versus a year earlier. Bar color = who ran the House and the Senate.",
    transform=ax.transAxes,
    fontsize=11,
    color=muted,
    va="bottom",
)
ax.set_xlim(1992.3, 2025.7)
ax.set_ylim(-1.2, 10.4)
ax.yaxis.set_major_locator(MultipleLocator(1))
ax.set_xticks([1993, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2022, 2025])
mark_ovals(ax, years, y_frac=0.98)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.grid(axis="y", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.legend(
    handles=[
        mpatches.Patch(facecolor=gop_c, label="Republican majority, House and Senate"),
        mpatches.Patch(facecolor=dem_c, label="Democratic majority, House and Senate"),
        mpatches.Patch(facecolor=split_c, label="Split Congress"),
    ],
    loc="upper left",
    frameon=False,
    fontsize=10,
    labelcolor=fg,
)
ax.text(
    0.0,
    -0.12,
    "BLS Consumer Price Index, annual. Peak month 9.1 percent June 2022 — Democrats held both chambers. August 2026: 3.4 percent.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-inflation-party.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Open border — actual encounters, not an average
fy = list(range(2009, 2026))
enc = [
    540865, 447731, 327577, 356873, 414397, 479371, 331333, 408870,
    303916, 396579, 851508, 400651, 1659206, 2206436, 2045838, 1530523, 237538,
]
bcols = [oval_of(y)[1] for y in fy]
fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
xpos = list(range(len(fy)))
bars = ax.bar(xpos, [e / 1e6 for e in enc], color=bcols, width=0.72)
ax.set_xticks(xpos)
ax.set_xticklabels([str(y)[2:] for y in fy], fontsize=8)
for i, e in enumerate(enc):
    if e >= 1.1e6 or fy[i] in (2008, 2014, 2019, 2025):
        label = f"{e/1e6:.2f}" if e >= 1e6 else f"{e/1000:.0f}k"
        ax.text(i, e / 1e6 + 0.04, label, ha="center", va="bottom", fontsize=8, fontweight="bold", color=fg)
ax.set_ylabel("Southwest Border Patrol encounters  ·  millions", fontsize=12, color=muted)
ax.set_title("THE OPEN BORDER  ·  BY ADMINISTRATION", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "CBP southwest Border Patrol. Obama FY2009–16. Trump 1 FY2017–20. Biden FY2021–24. Trump 2 FY2025: 237,538 — lowest since 1970.",
    transform=ax.transAxes,
    fontsize=11,
    color=muted,
    va="bottom",
)
ax.set_ylim(0, 2.7)
mark_ovals(ax, fy, xpos, y_frac=0.97)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.legend(
    handles=[
        mpatches.Patch(facecolor=obama_c, label="Obama"),
        mpatches.Patch(facecolor=trump_c, label="Trump"),
        mpatches.Patch(facecolor=biden_c, label="Biden"),
    ],
    loc="upper left",
    frameon=False,
    fontsize=10,
    labelcolor=fg,
)
ax.text(
    0.0,
    -0.12,
    "Source: CBP / Pew from CBP. Fiscal year. One person can be counted more than once. CBO 2023 net $9.2B. House Budget/CBO: $16.2B emergency Medicaid under Biden.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-border.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Nationwide — every path CBP counts
fy_n = [2021, 2022, 2023, 2024, 2025]
nat = [1.956519, 2.766582, 3.201144, 2.901142, 0.691906]
sw = [1.734680, 2.378940, 2.475670, 2.135000, 0.237538]
other = [n - s for n, s in zip(nat, sw)]
fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
x = list(range(len(fy_n)))
w = 0.36
ax.bar([i - w / 2 for i in x], nat, width=w, color=[biden_c, biden_c, biden_c, biden_c, trump_c], label="Nationwide — every CBP door")
ax.bar([i + w / 2 for i in x], sw, width=w, color="#6a655c", label="Southwest land only")
for i, (n, o) in enumerate(zip(nat, other)):
    ax.text(i - w / 2, n + 0.06, f"{n:.2f}M", ha="center", va="bottom", fontsize=10, fontweight="bold", color=fg)
    ax.text(i + w / 2, sw[i] + 0.06, f"{sw[i]:.2f}M", ha="center", va="bottom", fontsize=9, color=muted)
ax.set_xticks(x)
ax.set_xticklabels(["FY2021", "FY2022", "FY2023", "FY2024", "FY2025"])
ax.set_ylabel("Encounters  ·  millions", fontsize=12, color=muted)
ax.set_title("EVERY PATH CBP COUNTS", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "Nationwide FY2021–24 = 10.83 million. FY2025, after the Oval changed: 0.69 million nationwide, 237,538 southwest Border Patrol.",
    transform=ax.transAxes,
    fontsize=11,
    color=muted,
    va="bottom",
)
ax.set_ylim(0, 3.7)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.legend(loc="upper left", frameon=False, fontsize=11, labelcolor=fg)
ax.text(
    0.0,
    -0.12,
    "Source: CBP enforcement statistics (nationwide). DHS OHSS southwest land. House Homeland: 10.8 million since FY2021; northern border >500,000 those four years.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-border-all.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Crime — FBI murder rate, actual years, not an average
# FBI UCR Summary of Reported Crimes in the Nation, 2025 (released Aug 2026)
murder_years = list(range(2009, 2026))
murder_rate = [
    5.0, 4.8,
    4.7, 4.7, 4.5, 4.4, 4.9, 5.4, 5.3, 5.0, 5.0, 6.6,
    6.5, 6.6, 6.0, 5.1, 4.1,
]
mcols = [oval_of(y)[1] for y in murder_years]

fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
xpos = list(range(len(murder_years)))
bars = ax.bar(xpos, murder_rate, color=mcols, width=0.72)
ax.set_xticks(xpos)
ax.set_xticklabels([str(y) for y in murder_years])
for i, (y, r) in enumerate(zip(murder_years, murder_rate)):
    ax.text(i, r + 0.12, f"{r:.1f}", ha="center", va="bottom", fontsize=11, fontweight="bold", color=fg)
    if y == 2020:
        ax.annotate(
            "Trump year. They called it peaceful.\nFBI: 6.6",
            xy=(11, 6.6),
            xytext=(2, 7.35),
            fontsize=11,
            color=fg,
            fontweight="bold",
            arrowprops=dict(arrowstyle="->", color=fg, lw=1.1),
            ha="left",
        )
ax.set_ylabel("Murder and nonnegligent manslaughter  ·  per 100,000", fontsize=12, color=muted)
ax.set_title("CRIME  ·  ACTUAL MURDER RATE  ·  BY ADMINISTRATION", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "FBI. Spike starts 2020 (Trump, cities, the fire). Stays high through Biden 2021–22. 2025 Trump: 4.1 — lowest in twenty years.",
    transform=ax.transAxes,
    fontsize=11,
    color=muted,
    va="bottom",
)
ax.set_ylim(0, 8.6)
mark_ovals(ax, murder_years, xpos, y_frac=0.97)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.legend(
    handles=[
        mpatches.Patch(facecolor=obama_c, label="Obama"),
        mpatches.Patch(facecolor=trump_c, label="Trump"),
        mpatches.Patch(facecolor=biden_c, label="Biden"),
    ],
    loc="upper right",
    frameon=False,
    fontsize=10,
    labelcolor=fg,
)
ax.text(
    0.0,
    -0.12,
    "Source: FBI UCR. 2009–2025. Violent crime rate 2025: 327.6 per 100,000 (down 9.3% from 2024).",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-crime.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# The bill that did not close — every negative they still pay
tiles = [
    ("10.83 MILLION", "Nationwide encounters\nFY2021–24  ·  CBP"),
    ("2.10 MILLION", "Northern line, airports,\nseaports, Miami  ·  the rest of the map"),
    ("237,538", "Southwest FY2025\nThe door could close. It had been held open."),
    ("$16.2 BILLION", "Emergency Medicaid\nBiden years  ·  CBO / CMS"),
    ("$8.13 BILLION", "New York City hotels\nFY2023–25 actuals  ·  Comptroller"),
    ("$9.2 BILLION", "States and cities, net, 2023\nOne year. Encounters ran four.  ·  CBO"),
    ("73,944", "Fentanyl deaths, 2022\nCDC / NCHS  ·  the peak year"),
    ("450,000", "Unaccompanied children in the file\n145,000 found  ·  DHS  ·  the rest still missing"),
    ("650,000", "Criminal aliens not detained, July 2024\nICE docket  ·  2,894 homicide on FY24 arrests"),
]
fig, axes = plt.subplots(3, 3, figsize=(16, 11), dpi=140, facecolor=bg)
fig.suptitle("WHAT AMERICANS STILL PAY", fontsize=24, fontweight="bold", color=fg, x=0.02, ha="left", y=0.98)
fig.text(
    0.02,
    0.935,
    "The door Democrats opened, 2021–25. The people, the bills, and the dead did not leave when the number fell.",
    fontsize=13,
    color=muted,
)
for ax, (num, cap) in zip(axes.ravel(), tiles):
    ax.set_facecolor("#141414")
    ax.set_xticks([])
    ax.set_yticks([])
    for s in ax.spines.values():
        s.set_color("#3a3a3a")
    ax.text(0.05, 0.62, num, transform=ax.transAxes, fontsize=22, fontweight="bold", color=biden_c, va="center")
    ax.text(0.05, 0.22, cap, transform=ax.transAxes, fontsize=11, color=fg, va="center", linespacing=1.35)
fig.text(
    0.02,
    0.02,
    "CBP nationwide + OHSS southwest. CBO 60805 and 61256. NYC Comptroller. CDC fentanyl 2022. DHS children. House Homeland / ICE non-detained docket and FY2024 Annual Report.",
    fontsize=9,
    color=muted,
)
fig.tight_layout(rect=(0, 0.05, 1, 0.92))
fig.savefig("/workspace/public/images/chart-border-toll.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Debt bars — easier than a pie
fig, ax = plt.subplots(figsize=(16, 7), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
labels = ["Republican\nmajority", "Democratic\nmajority", "Split\none chamber"]
vals = [10.96, 12.65, 16.48]
cols_d = [gop_c, biden_c, split_c]
y = [2, 1, 0]
ax.barh(y, vals, color=cols_d, height=0.62)
for yi, v in zip(y, vals):
    ax.text(v + 0.25, yi, f"${v:.2f}T", va="center", fontsize=16, fontweight="bold", color=fg)
ax.set_yticks(y)
ax.set_yticklabels(labels, fontsize=14, fontweight="bold")
ax.set_xlim(0, 20)
ax.set_xlabel("Trillion dollars added  ·  Treasury", fontsize=12, color=muted)
ax.set_title("WHO ADDED THE DEBT", fontsize=22, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.04,
    "$10.96 + $12.65 + $16.48 = $40.09 trillion. September 17, 2026. Both failed.",
    transform=ax.transAxes,
    fontsize=12,
    color=muted,
)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="x", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.text(
    0.0,
    -0.16,
    "Source: Treasury Historical Debt Outstanding + Debt to the Penny. Unified Congress = House and Senate same party.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-debt-bars.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

labs = ["Obama\nFY09–16", "Trump 1\nFY17–20", "Biden\nFY21–24", "Trump 2\nFY25–"]
enc = [3.31, 3.00, 10.83, 0.69]
cpi = [3.9, 2.9, 9.1, 4.2]
cols_o = [obama_c, trump_c, biden_c, trump_c]

fig, ax = plt.subplots(figsize=(16, 7.6), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.bar(labs, enc, color=cols_o, width=0.62)
ax.set_title("THE OVAL  ·  BORDER ENCOUNTERS", fontsize=20, fontweight="bold", color=fg, loc="left", pad=16)
ax.set_ylabel("Millions", color=muted, fontsize=12)
for i, v in enumerate(enc):
    ax.text(i, v + 0.15, f"{v:.2f}M", ha="center", fontsize=14, fontweight="bold", color=fg)
ax.set_ylim(0, 13)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.tick_params(colors=fg)
ax.yaxis.label.set_color(muted)
ax.text(
    0.0,
    -0.14,
    "An encounter is a person Customs and Border Protection met who was not making a lawful entry. Obama: southwest Border Patrol. Trump 1, Biden, Trump 2: nationwide.",
    transform=ax.transAxes,
    fontsize=10,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-oval-encounters.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 7.6), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.bar(labs, cpi, color=cols_o, width=0.62)
ax.set_title("THE OVAL  ·  HIGHEST PRICE SPIKE", fontsize=20, fontweight="bold", color=fg, loc="left", pad=16)
ax.set_ylabel("Percent higher than a year earlier", color=muted, fontsize=12)
for i, v in enumerate(cpi):
    ax.text(i, v + 0.15, f"{v:.1f}%", ha="center", fontsize=14, fontweight="bold", color=fg)
ax.set_ylim(0, 11)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.tick_params(colors=fg)
ax.yaxis.label.set_color(muted)
ax.text(
    0.0,
    -0.14,
    "Consumer Price Index — highest 12-month rise in that Oval. The higher grocery ticket does not reset. The next Oval inherits the floor.",
    transform=ax.transAxes,
    fontsize=10,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-oval-prices.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# One debt chart: the driver, fraud from no oversight, full-time pay for part-time hours
fig, ax = plt.subplots(figsize=(16, 12), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 10)
ax.set_ylim(0, 12)
ax.axis("off")
ax.text(0.2, 11.45, "THE DEBT  ·  NO OVERSIGHT", fontsize=26, fontweight="bold", color=fg)
ax.text(
    0.2,
    10.85,
    "A part-time floor cannot police 300 million people and trillion-dollar programs.\nGAO: $233–521 billion a year in fraud. The card is $40.09 trillion. Sept. 17, 2026.",
    fontsize=13,
    color=muted,
    va="top",
)
who = [("Republican majority", 10.96, gop_c), ("Democratic majority", 12.65, dem_c), ("Split", 16.48, split_c)]
y0 = 9.35
for i, (lab, v, c) in enumerate(who):
    y = y0 - i * 0.72
    ax.barh(y, v / 4.2, height=0.48, color=c, left=0.2)
    ax.text(0.2 + v / 4.2 + 0.15, y, f"{lab}  +${v:.2f}T", va="center", fontsize=14, fontweight="bold", color=fg)
ax.text(0.2, 7.0, "FULL-TIME PAY  ·  PART-TIME HOURS", fontsize=16, fontweight="bold", color=fg)
ax.text(
    0.2,
    6.55,
    "$174,000 salary  ·  pension  ·  federal health insurance  ·  a million-dollar office.\n2,080-hour pay for a body that sits about 150 days. No part-time job in America pays like that.\nSelf-governance of their own ethics failed. 2 U.S.C. § 1415 billed the country for their misconduct.",
    fontsize=12,
    color=fg,
    va="top",
)
ax.text(0.2, 4.85, "WHAT THEY VOTED THAT FED THE METER", fontsize=16, fontweight="bold", color=fg)
ax.text(0.2, 4.4, "REPUBLICANS", fontsize=13, fontweight="bold", color=gop_c)
ax.text(
    0.2,
    3.95,
    "Unpaid Medicare Part D. Tax cuts without a closed budget. Iraq. CARES.\nMajority 2015–19: still no October 1.",
    fontsize=12,
    color=fg,
    va="top",
)
ax.text(0.2, 2.95, "DEMOCRATS", fontsize=13, fontweight="bold", color=dem_c)
ax.text(
    0.2,
    2.5,
    "ARRA. ACA Medicaid expansion. Rescue Plan. Parole into benefits.\nMajority 2021–23: 9.1% prices and a record border while the meter ran.",
    fontsize=12,
    color=fg,
    va="top",
)
ax.text(0.2, 1.5, "BOTH", fontsize=13, fontweight="bold", color=muted)
ax.text(
    0.2,
    1.05,
    "Twelve appropriations by October 1 — they pass none. Last surplus: FY2001.\nLack of oversight is how fraud became a line on a $40 trillion card — and how grants leave without the names on the 990.",
    fontsize=12,
    color=fg,
    va="top",
)
ax.text(
    0.2,
    0.2,
    "Treasury Debt to the Penny  ·  CBO  ·  GAO  ·  CRS RL30064  ·  2 U.S.C. § 1415  ·  26 U.S.C. § 6104",
    fontsize=10,
    color=muted,
)
fig.savefig("/workspace/public/images/chart-debt-why.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Invasion / eligibility
fig, ax = plt.subplots(figsize=(16, 10), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis("off")
ax.text(0.2, 9.55, "THE INVASION BILL", fontsize=26, fontweight="bold", color=fg, va="top")
ax.text(
    0.2,
    8.95,
    "10.83 million nationwide encounters, FY2021–24. Democrats held the Oval and majority 2021–23.",
    fontsize=13,
    color=muted,
    va="top",
)
costs = [("$16.2B", "Emergency Medicaid  ·  Biden years  ·  CBO"), ("$9.2B", "States and cities, net, 2023  ·  CBO"), ("$8.13B", "NYC shelter actuals FY2023–25"), ("310,000", "Noncitizens on SSI  ·  SSA, Dec 2025")]
for i, (n, cap) in enumerate(costs):
    x = 0.3 + (i % 2) * 4.8
    y = 6.55 - (i // 2) * 1.85
    ax.add_patch(plt.Rectangle((x, y), 4.4, 1.6, facecolor="#141414", edgecolor="#3a3a3a"))
    ax.text(x + 0.25, y + 1.05, n, fontsize=22, fontweight="bold", color=biden_c, va="center")
    ax.text(x + 0.25, y + 0.42, cap, fontsize=12, color=fg, va="center")
ax.text(0.2, 3.7, "HOW THEY BECAME ELIGIBLE  ·  NOT A STATUTE THEY COULD PASS", fontsize=14, fontweight="bold", color=fg)
doors = "1  Cross.  2  Parole or asylum (CHNV and the rest — a memo).  3  An SSN.  4  8 U.S.C. § 1611 already barred most federal benefits.\nThey left the doors: parole, asylum, refugee (§ 1641). That is how an invasion becomes a welfare line."
ax.text(0.2, 3.15, doors, fontsize=13, color=fg, va="top")
ax.text(0.2, 1.7, "They ended Remain in Mexico. They ended Title 42. They did not pass amnesty. They ran it through the agencies.", fontsize=13, color=fg)
ax.text(0.2, 0.35, "CBP nationwide  ·  CBO 60805 and 61256  ·  NYC Comptroller  ·  SSA  ·  8 U.S.C. §§ 1611, 1641  ·  USCIS CHNV", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-aliens.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, axes = plt.subplots(2, 1, figsize=(16, 14), dpi=140, facecolor=bg, gridspec_kw={"height_ratios": [1.05, 1.2]})
ax = axes[0]
ax.set_facecolor(bg)
labels = [
    "Power plant fuel  ·  ~5%",
    "2015 deal cap  ·  3.67%",
    "Iranian terrorist regime  ·  IAEA 60%",
    "A bomb  ·  ~90%",
]
vals = [5, 3.67, 60, 90]
colors = [help_c, "#8a93a3", "#d8d0c0", hurt_c]
y = [3, 2, 1, 0]
ax.barh(y, vals, color=colors, height=0.62)
for yi, v, lab in zip(y, vals, labels):
    ax.text(v + 1.5, yi, f"{v:g}%", va="center", fontsize=16, fontweight="bold", color=fg)
ax.set_yticks(y)
ax.set_yticklabels(labels, fontsize=13, fontweight="bold")
ax.set_xlim(0, 118)
ax.set_xlabel("U-235 enrichment", fontsize=12, color=muted)
ax.set_title("THE IRANIAN TERRORIST REGIME  ·  60%", fontsize=22, fontweight="bold", color=fg, pad=14, loc="left")
ax.text(
    0.0,
    1.08,
    "IAEA, 13 June 2025: 440.9 kg of uranium enriched up to 60% U-235. The only non-weapon state at that level. A bomb is ~90%. The last step is the short one.",
    transform=ax.transAxes,
    fontsize=11,
    color=muted,
)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="x", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.tick_params(colors=fg)
ax.xaxis.label.set_color(muted)

ax = axes[1]
ax.set_facecolor(bg)
years = [1979, 1984, 2002, 2006, 2010, 2015, 2018, 2021, 2025]
caps = [
    "Islamic\nRepublic",
    "State\nsponsor",
    "Natanz\nrevealed",
    "UNSC\nresolution",
    "20%\nenrichment",
    "JCPOA\n3.67%",
    "U.S.\nwithdraws",
    "60%\nstarts",
    "440.9 kg\nthen locked out",
]
ax.plot(years, [1] * len(years), color="#5a564c", lw=2, zorder=1)
ax.scatter(years, [1] * len(years), s=90, color=biden_c, zorder=2)
for x, cap in zip(years, caps):
    ax.text(x, 1.08, cap, ha="center", va="bottom", fontsize=10, color=fg, fontweight="bold")
    ax.text(x, 0.88, str(x), ha="center", va="top", fontsize=11, color=muted)
ax.set_xlim(1976, 2028)
ax.set_ylim(0.7, 1.35)
ax.axis("off")
ax.set_title("47 YEARS  ·  1979–2026  ·  THE OPTION ON THE TABLE", fontsize=16, fontweight="bold", color=fg, loc="left", pad=8)
ax.text(
    0.0,
    -0.08,
    "IAEA GOV/2026/50  ·  IAEA GOV/2026/8  ·  State Department — state sponsor of terrorism, 19 Jan 1984. Inspectors have not seen the 60% stock since June 2025.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-iran.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Named deaths. Not a fake global total. The file that exists.
fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
dead = [
    ("Beirut barracks 1983\nHezbollah  ·  241 U.S.", 241),
    ("AMIA, Buenos Aires 1994\nHezbollah/Iran  ·  85", 85),
    ("Khobar Towers 1996\n19 U.S. airmen", 19),
    ("Iraq 2003–11\nPentagon: Iran-backed  ·  603 U.S.", 603),
    ("Oct. 7, 2023\nHamas, Iran-enabled  ·  ~1,200", 1200),
    ("Tower 22, 2024\nIran-backed militia  ·  3 U.S.", 3),
]
labs = [d[0] for d in dead]
vals = [d[1] for d in dead]
y = list(range(len(dead) - 1, -1, -1))
ax.barh(y, vals, color=biden_c, height=0.62)
for yi, v in zip(y, vals):
    ax.text(v + 18, yi, f"{v:,}", va="center", fontsize=14, fontweight="bold", color=fg)
ax.set_yticks(y)
ax.set_yticklabels(labs, fontsize=11)
ax.set_xlim(0, 1450)
ax.set_xlabel("Dead  ·  named attacks on the record", fontsize=12, color=muted)
ax.set_title("THE REGIME AND ITS PROXIES  ·  NAMED DEATHS", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.06,
    "There is no honest single worldwide body count. These are the named files. Pentagon, State, White House, Argentine court. Oct. 7: State said Iran enabled Hamas; ODNI said no evidence of foreknowledge.",
    transform=ax.transAxes,
    fontsize=11,
    color=muted,
)
for s in ax.spines.values():
    s.set_color("#3a3a3a")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="x", color="#2a2a2a", lw=0.7)
ax.set_axisbelow(True)
ax.tick_params(colors=fg)
ax.xaxis.label.set_color(muted)
ax.text(
    0.0,
    -0.14,
    "DoD: 603 U.S. in Iraq, 2019. Beirut: 241 U.S. Marines and sailors, 1983. AMIA: 85. Khobar: 19. White House 2026: 46 Americans on Oct. 7. Tower 22: 3. State CRT 2024: leading state sponsor.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-iran-dead.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()
print("wrote inflation, helped-hurt, border, crime, toll, debt-bars, oval, iran")

fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 9)
ax.axis("off")
ax.text(0.4, 8.4, "ONE WORD", fontsize=28, fontweight="bold", color=fg, va="top")
ax.text(0.4, 7.7, "Change the word. The country is taught the opposite crime.", fontsize=14, color=muted, va="top")
ax.add_patch(plt.Rectangle((0.4, 1.4), 7.2, 5.6, facecolor="#141414", edgecolor=gop_c, lw=2))
ax.add_patch(plt.Rectangle((8.4, 1.4), 7.2, 5.6, facecolor="#141414", edgecolor=dem_c, lw=2))
ax.text(4.0, 6.5, "THE CAPTION", fontsize=13, fontweight="bold", color=gop_c, ha="center")
ax.text(12.0, 6.5, "THE FILE", fontsize=13, fontweight="bold", color=dem_c, ha="center")
ax.text(4.0, 5.2, "KIDNAPPED", fontsize=32, fontweight="bold", color=gop_c, ha="center")
ax.text(12.0, 5.2, "ARRESTED", fontsize=32, fontweight="bold", color=dem_c, ha="center")
ax.text(4.0, 3.6, "The United States is the criminal.\nMaduro is the victim.\nThe warrant disappears.", fontsize=14, color=muted, ha="center")
ax.text(12.0, 3.6, "SDNY indictment, 26 March 2020.\nTaken into custody, 3 January 2026.\nArraigned in Brooklyn. The warrant\nhad been ignored for six years.", fontsize=14, color=fg, ha="center")
ax.text(0.4, 0.55, "DOJ SDNY  ·  State Department wanted poster  ·  CRS LSB11401  ·  21 U.S.C. § 960a", fontsize=11, color=muted)
fig.savefig("/workspace/public/images/chart-one-word.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 12), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 13)
ax.axis("off")
ax.text(0.4, 12.5, "ONE WORD  ·  TWELVE YEARS", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 11.9, "The caption taught a crime. The file did not contain it.", fontsize=13, color=muted, va="top")
ax.text(0.5, 11.25, "THE WORD THAT RAN", fontsize=11, fontweight="bold", color=gop_c)
ax.text(8.3, 11.25, "THE FILE", fontsize=11, fontweight="bold", color=dem_c)
rows = [
    ("Kidnapped", "Arrested. SDNY 26 Mar 2020. Custody 3 Jan 2026."),
    ("Collusion", "Durham: no actual evidence when the case opened."),
    ("Insurrection", "18 U.S.C. § 2383. Zero charged."),
    ("Mostly peaceful", "A precinct burned. Insurance paid."),
    ("Muslim ban", "Trump v. Hawaii. A proclamation, not a religion test."),
    ("Kids in cages", "The 2014 facilities. Flores, 1997. Not a 2018 invention."),
    ("Domestic terrorists", "Parents at school boards. NSBA letter. Garland memo."),
    ("Russian disinfo", "The laptop. Fifty-one names. Weeks before the vote."),
    ("Dictator", "Border and drill. “After that, I’m not a dictator.”"),
    ("Fine people", "Same answer: neo-Nazis “condemned totally.”"),
]
for i, (left, right) in enumerate(rows):
    y = 10.55 - i * 0.95
    ax.add_patch(plt.Rectangle((0.4, y - 0.7), 7.4, 0.85, facecolor="#141414", edgecolor="#3a3a3a"))
    ax.add_patch(plt.Rectangle((8.1, y - 0.7), 7.5, 0.85, facecolor="#141414", edgecolor="#3a3a3a"))
    ax.text(0.6, y - 0.28, left, fontsize=14, fontweight="bold", color=gop_c, va="center")
    ax.text(8.3, y - 0.28, right, fontsize=13, color=fg, va="center")
ax.text(0.4, 0.35, "DOJ  ·  Durham  ·  USAO-DC  ·  SCOTUS  ·  DHS  ·  State  ·  Congress.gov  ·  2014–2026", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-one-word-ledger.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Congress + Oval, helped and hurt, one page
fig = plt.figure(figsize=(16, 14), dpi=140, facecolor=bg)
fig.text(0.02, 0.97, "HELPED AND HURT", fontsize=22, fontweight="bold", color=fg, va="top")
fig.text(
    0.02,
    0.935,
    "The bill, not the speech. Majority control is the purse. The Oval spends what Congress votes. Four Ovals on the meters.",
    fontsize=12,
    color=muted,
    va="top",
)

def box(ax, title, help_lines, hurt_lines, title_c):
    ax.set_facecolor("#141414")
    ax.set_xticks([])
    ax.set_yticks([])
    for s in ax.spines.values():
        s.set_color("#3a3a3a")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.text(0.4, 9.3, title, fontsize=13, fontweight="bold", color=title_c, va="top")
    ax.text(0.4, 8.35, "HELPED", fontsize=11, fontweight="bold", color=help_c, va="top")
    y = 7.7
    for line in help_lines:
        ax.text(0.5, y, "▸  " + line, fontsize=10, color=fg, va="top")
        y -= 0.7
    ax.text(0.4, y - 0.15, "HURT", fontsize=11, fontweight="bold", color=hurt_c, va="top")
    y -= 0.75
    for line in hurt_lines:
        ax.text(0.5, y, "▸  " + line, fontsize=10, color=muted, va="top")
        y -= 0.7

gs = fig.add_gridspec(2, 4, left=0.03, right=0.97, top=0.90, bottom=0.06, hspace=0.18, wspace=0.08)
ax_g = fig.add_subplot(gs[0, :2])
ax_d = fig.add_subplot(gs[0, 2:])
box(
    ax_g,
    "CONGRESS  ·  REPUBLICAN MAJORITY",
    ["Welfare 1996 — work or the check stops", "Tax cut on savings 1997", "Tax cuts 2001, 2003, 2017"],
    ["Iraq — they voted yes", "Medicare Part D unpaid", "Never close October 1"],
    gop_c,
)
box(
    ax_d,
    "CONGRESS  ·  DEMOCRATIC MAJORITY",
    ["1993 tax raised the top rate", "CHIP reauthorized 2009", "Ledbetter Fair Pay 2009"],
    ["10.83M encounters FY21–24", "Helene and Maui waited; aliens got the grant", "OASI empty 2032 — 78% of the check", "Prices 9.1% June 2022"],
    dem_c,
)
ovals = [
    (
        "OBAMA  ·  DEM OVAL",
        ["CHIP  ·  Ledbetter", "No 9% spike in term two"],
        ["ARRA  ·  ACA taxes and mandate", "DACA memo, not a vote", "Prices peaked 3.9%  ·  3.31M SW BP"],
        obama_c,
    ),
    (
        "TRUMP 1  ·  GOP OVAL",
        ["Prices peaked 2.9%", "Gas peak $2.962", "Tax Cuts and Jobs Act 2017"],
        ["CARES  ·  both parties", "Murder rate 6.6 in 2020"],
        trump_c,
    ),
    (
        "BIDEN  ·  DEM OVAL",
        ["IIJA 2021  ·  CHIPS 2022"],
        ["Prices peaked 9.1% June 2022", "Gas $5.006  ·  June 13, 2022", "10.83 million nationwide"],
        biden_c,
    ),
    (
        "TRUMP 2  ·  GOP OVAL",
        ["FBI 2025 murder 4.1 — lowest since 1956", "EO 14252 — monuments, graffiti, DC"],
        ["Prices so far 4.2%  ·  May 2026", "Gas $4.50  ·  May 11, 2026"],
        trump_c,
    ),
]
for i, (title, h, u, c) in enumerate(ovals):
    ax = fig.add_subplot(gs[1, i])
    box(ax, title, h, u, c)

fig.text(
    0.03,
    0.02,
    "Congress.gov bills  ·  BLS CPI  ·  EIA weekly gasoline  ·  CBP  ·  Treasury. Split years are not majority control.",
    fontsize=9,
    color=muted,
)
fig.savefig("/workspace/public/images/chart-helped-hurt.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 10), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 11)
ax.axis("off")
ax.text(0.4, 10.5, "THE HIRE IS THE COUNTRY", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 9.85, "Going after the president the people hired is going after the people.", fontsize=14, color=muted, va="top")
steps = [
    ("2016–19", "Crossfire Hurricane", "Durham: opened with no actual evidence of collusion."),
    ("2017–19", "FISA on a campaign", "Horowitz: 17 inaccuracies and omissions."),
    ("2019", "Impeachment I", "H.Res. 755. The House. The public paid."),
    ("2020", "51 names", "Laptop called Russian disinfo weeks before the vote."),
    ("2021", "Impeachment II", "H.Res. 24. Then the dockets."),
    ("2021–22", "J6 caption", "Insurrection on television. Zero under 18 U.S.C. § 2383."),
    ("2023–24", "Four dockets", "NY, FL, GA, D.C. Process as the punishment."),
]
for i, (when, title, line) in enumerate(steps):
    y = 8.9 - i * 1.1
    ax.add_patch(plt.Rectangle((0.4, y - 0.85), 15.2, 1.0, facecolor="#141414", edgecolor="#3a3a3a"))
    ax.text(0.7, y - 0.35, when, fontsize=12, fontweight="bold", color=gop_c, va="center")
    ax.text(3.6, y - 0.18, title, fontsize=15, fontweight="bold", color=fg, va="center")
    ax.text(3.6, y - 0.55, line, fontsize=12, color=muted, va="center")
ax.text(0.4, 0.35, "Article II  ·  Durham  ·  Horowitz IG  ·  Congress.gov  ·  USAO-DC  ·  House Weaponization", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-lawfare.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 11.2), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 11.2)
ax.axis("off")
ax.text(0.4, 10.85, "THE FUNNEL", fontsize=26, fontweight="bold", color=fg, va="top")
ax.text(0.4, 10.15, "Taxpayer grant. Private nonprofit. Public 990 with the names cut out.\nAmerica funds a pipe it cannot see. That is a failure of oversight.", fontsize=13, color=muted, va="top")
cells = [
    (0.4, 4.85, "TAXPAYER GRANTS", "USAID $43.8B of $71.9B.\nFEMA shelter $1.4B.\nNED $315M to party-aligned shops.\nUSASpending is the ledger.", gop_c),
    (8.2, 4.85, "DONOR NAMES REDACTED", "26 U.S.C. § 6104.\nMost 501(c) public 990s hide\nSchedule B names. The IRS has them.\nThe country does not. That is the dark.", dem_c),
    (0.4, 0.7, "PROSECUTOR MONEY", "527s and FEC committees list\nlarge donors, including George Soros,\nto district-attorney races.\nThe 501(c)(4) feeder does not.", gop_c),
    (8.2, 0.7, "VOTER ROLLS", "52 U.S.C. § 20507 already requires\na reasonable purge of the dead\nand the moved. HAVA § 21083.\nCongress never tied the grant to it.", dem_c),
]
for x, y, title, body, c in cells:
    ax.add_patch(plt.Rectangle((x, y), 7.4, 3.7, facecolor="#141414", edgecolor=c, lw=2))
    ax.text(x + 3.7, y + 3.05, title, fontsize=16, fontweight="bold", color=c, ha="center", va="center")
    ax.text(x + 3.7, y + 1.4, body, fontsize=13, color=fg, ha="center", va="center")
ax.text(0.4, 0.18, "USASpending  ·  26 U.S.C. § 6104  ·  FEC  ·  IRS 527  ·  52 U.S.C. § 20507  ·  52 U.S.C. § 21083  ·  22 U.S.C. § 4411", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-funnel.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 10), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 10.2)
ax.axis("off")
ax.text(0.4, 9.7, "WHAT THE TAXPAYER BOUGHT", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 9.1, "The grant listed the first four. ICE counted the last two.", fontsize=14, color=muted, va="top")
bought = [
    (0.4, 5.0, "CASH CARDS", "NYC Mayor, Feb. 20, 2024:\nprepaid debit-card pilot.\n$53 million contract at scale.", dem_c),
    (5.6, 5.0, "PHONES", "FEMA SSP Appendix A:\ncell phone plans as utilities.\n$10 a person a day overnight.", gop_c),
    (10.8, 5.0, "CLOTHING", "SSP: shirts, pants, shoes,\nunderwear, backpacks, belts.\nOn the federal reimbursement list.", dem_c),
    (0.4, 0.7, "HOUSING", "SSP: hotel at the GSA rate.\nNYC Comptroller: $8.13 billion\nin three fiscal years.", gop_c),
    (5.6, 0.7, "PROPERTY", "ICE FY2024 arrests:\n5,001 damage-to-property\ncharges and convictions.", "#8a5a2b"),
    (10.8, 0.7, "HOMICIDE", "ICE FY2024: 2,894 homicide\ncharges/convictions on those arrested.\nLaken Riley: DOJ, life sentence.", "#c53030"),
]
for x, y, title, body, c in bought:
    ax.add_patch(plt.Rectangle((x, y), 4.8, 3.85, facecolor="#141414", edgecolor=c, lw=2))
    ax.text(x + 2.4, y + 3.25, title, fontsize=16, fontweight="bold", color=c, ha="center", va="center")
    ax.text(x + 2.4, y + 1.55, body, fontsize=13, color=fg, ha="center", va="center")
ax.text(0.4, 0.22, "FEMA SSP NOFO  ·  DHS OIG-26-04  ·  NYC Mayor transcript  ·  NYC Comptroller  ·  ICE FY2024  ·  DOJ MDGA", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-what-they-bought.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 7.5), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 7.2)
ax.axis("off")
ax.text(0.4, 6.7, "THEY DON’T WRITE THE BILLS", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 6.05, "Hired to write the law. They vote the lobby’s draft. The country keeps the harm.", fontsize=14, color=muted, va="top")
steps = [
    (0.4, "1. THE LOBBY DRAFTS", "Paid firms write the text.\nActivists write the caption.\nLDA is a form, not a fence.", gop_c),
    (5.6, "2. CONGRESS VOTES", "Article I gave them the pen.\nThey vote the unread pile.\nBoth parties take the draft.", dem_c),
    (10.8, "3. AMERICA KEEPS IT", "The statute sticks.\nThe harm is the country.\nThe hire still has the gavel.", "#d8d0c0"),
]
for x, title, body, c in steps:
    ax.add_patch(plt.Rectangle((x, 0.85), 4.8, 4.7, facecolor="#141414", edgecolor=c, lw=2))
    ax.text(x + 2.4, 4.85, title, fontsize=15, fontweight="bold", color=c, ha="center")
    ax.text(x + 2.4, 2.7, body, fontsize=14, color=fg, ha="center")
ax.text(0.4, 0.3, "Article I § 1  ·  2 U.S.C. § 1601  ·  P.L. 104-65  ·  Senate LDA  ·  House lobbying disclosure", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-they-dont-write.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 7.8), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 7.4)
ax.axis("off")
ax.text(0.4, 6.9, "PAYING THE TALIBAN", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 6.25, "A Senate that will not read the bill still votes the money. SIGAR named who collected.", fontsize=13, color=muted, va="top")
boxes = [
    (0.4, "UNREAD PILE", "Article I hired them to read it.\nSenate leadership moves the package.\nAfghanistan is inside it.", dem_c),
    (5.6, "THE PIPE", "$3.83B after Kabul.\n$3.038B to PIOs.\n$2.9B UN cash into the country.", gop_c),
    (10.8, "WHO COLLECTED", "SIGAR 24-22: $10.9M taxes — a fraction.\n30–40% reaches the population.\nThe rest is the stair tax.", "#c53030"),
]
for x, title, body, c in boxes:
    ax.add_patch(plt.Rectangle((x, 0.9), 4.8, 4.85, facecolor="#141414", edgecolor=c, lw=2))
    ax.text(x + 2.4, 5.05, title, fontsize=16, fontweight="bold", color=c, ha="center")
    ax.text(x + 2.4, 2.85, body, fontsize=14, color=fg, ha="center")
ax.text(0.4, 0.28, "SIGAR 24-22  ·  SIGAR 25-16  ·  SIGAR 24-12  ·  SIGAR August 2025  ·  Article I", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-paying-taliban.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 8.4), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 8.2)
ax.axis("off")
ax.text(0.4, 6.55, "FEMA RAN TWO JOBS", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 5.9, "North Carolina flood. Maui fire. Americans who paid the tax waited. Aliens got the $1.4 billion grant.", fontsize=13, color=muted, va="top")
jobs = [
    (0.4, "AMERICANS", "Helene: the Secretary said FEMA\ndid not have funds for the season.\nMaui: $56.1 million to 7,141 people.\nTemporary housing into 2027.", gop_c),
    (5.6, "ALIENS", "CBP to FEMA: $1.45 billion.\nAwards: $1.4 billion.\nHotels, clothes, phones.", dem_c),
    (10.8, "THE AUDITOR", "OIG-26-04: $425 million\nquestioned. FEMA could not\nshow it was humanitarian.", "#c53030"),
]
for x, title, body, c in jobs:
    ax.add_patch(plt.Rectangle((x, 0.7), 4.8, 4.55, facecolor="#141414", edgecolor=c, lw=2))
    ax.text(x + 2.4, 4.55, title, fontsize=16, fontweight="bold", color=c, ha="center")
    ax.text(x + 2.4, 2.5, body, fontsize=14, color=fg, ha="center")
ax.text(0.4, 0.3, "House Homeland Oct. 11, 2024  ·  GAO-26-108154  ·  GAO-25-106862  ·  FEMA Maui fact sheet  ·  DHS OIG-26-04", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-fema-two-jobs.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 8), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 7.6)
ax.axis("off")
ax.text(0.4, 7.1, "THEY RAN IT ANYWAY", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 6.45, "Crossfire opened with no actual evidence of collusion. They ran it for the whole first term.", fontsize=13, color=muted, va="top")
steps = [
    (0.4, "2016 — OPENED", "Durham: no actual evidence\nof collusion in the holdings.\nFull FBI case anyway.", dem_c),
    (5.6, "2017–19 — THE AIR", "“More than circumstantial.”\nNetworks. The committee.\nA presidency answering a caption.", "#c53030"),
    (10.8, "2019 — THE FILE", "Mueller: did not establish\na conspiracy. They kept\nrunning it anyway.", gop_c),
]
for x, title, body, c in steps:
    ax.add_patch(plt.Rectangle((x, 0.95), 4.8, 4.95, facecolor="#141414", edgecolor=c, lw=2))
    ax.text(x + 2.4, 5.2, title, fontsize=16, fontweight="bold", color=c, ha="center")
    ax.text(x + 2.4, 2.9, body, fontsize=14, color=fg, ha="center")
ax.text(0.4, 0.3, "Durham report  ·  Horowitz FISA  ·  Barr on Mueller  ·  Congressional Record H.Res. 630", fontsize=10, color=muted)
fig.savefig("/workspace/public/images/chart-they-ran-it.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()




