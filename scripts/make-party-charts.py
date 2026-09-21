#!/usr/bin/env python3
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.ticker import MultipleLocator, FuncFormatter

bg = "#0b0b0b"
fg = "#ece8dc"
muted = "#a39e93"
gop_c = "#8a93a3"
dem_c = "#d8d0c0"
split_c = "#3d3d3d"
clinton_c = "#b7a78e"
bush_c = "#5c6574"
obama_c = "#cfc6b4"
trump_c = "#8a93a3"
biden_c = "#e8e0d0"
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
ax.set_ylabel("Actual CPI-U that year  ·  percent", fontsize=12, color=muted)
ax.set_title("ACTUAL INFLATION  ·  WHO HELD CONGRESS", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "Bar color = House and Senate same party that year. Names on top = Oval. 9.1% is Democrats in Congress, June 2022.",
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
        mpatches.Patch(facecolor=gop_c, label="Republicans ran both chambers"),
        mpatches.Patch(facecolor=dem_c, label="Democrats ran both chambers"),
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
    "Source: BLS CPI-U annual. Peak month 9.1% June 2022 — Democrats held both chambers (2021–23). Live table: August 2026 is 3.4%.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-inflation-party.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Policy success / failure — two columns, the bills
fig, axes = plt.subplots(1, 2, figsize=(16, 10), dpi=140, facecolor=bg)
fig.suptitle("POLICY  ·  SUCCESS AND FAILURE", fontsize=22, fontweight="bold", color=fg, x=0.02, ha="left")
fig.text(
    0.02,
    0.93,
    "The bill. Not the speech. Republicans left, Democrats right. Helped is the paycheck. Hurt is the tab.",
    fontsize=11,
    color=muted,
)

gop_help = [
    "Clinton/GOP 1996  Welfare — work or the check stops",
    "Clinton/GOP 1997  Tax cut on savings",
    "Bush 2001  Fatter paycheck",
    "Bush 2003  Fatter paycheck, round two",
    "Trump 2017  Tax cut again. Not a surplus.",
]
gop_hurt = [
    "Bush 2002  Iraq — they voted yes",
    "Bush 2003  Drug benefit. Unpaid.",
    "Trump 2020  COVID checks. Then the fraud.",
    "Every year  Budget never on time",
]
dem_help = [
    "1993  Raised the top tax. Cut that year's deficit.",
]
dem_hurt = [
    "Biden 2021–24  Opened the border",
    "Biden 2022  Prices 9.1%",
    "Bush/Obama 2008  Bank bailout",
    "Obama 2009  Stimulus",
    "Obama 2010  ObamaCare — taxes, a mandate",
    "Biden 2021  More spending after COVID",
    "Biden 2022  Corporate tax up",
    "Every year  Budget never on time",
]

def panel(ax, title, helped, hurt):
    ax.set_facecolor(bg)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis("off")
    ax.set_title(title, fontsize=16, fontweight="bold", color=fg, loc="left", pad=8)
    ax.text(0.2, 12.6, "HELPED", fontsize=12, fontweight="bold", color=help_c)
    y = 12.0
    for line in helped:
        ax.text(0.3, y, "▸  " + line, fontsize=11, color=fg, va="top")
        y -= 0.7
    ax.text(0.2, y - 0.2, "HURT", fontsize=12, fontweight="bold", color=hurt_c)
    y -= 0.9
    for line in hurt:
        ax.text(0.3, y, "▸  " + line, fontsize=11, color=muted, va="top")
        y -= 0.7

panel(axes[0], "REPUBLICANS RAN BOTH", gop_help, gop_hurt)
panel(axes[1], "DEMOCRATS RAN BOTH", dem_help, dem_hurt)
fig.text(
    0.02,
    0.03,
    "Congress.gov bills. BLS June 2022. CBP encounters FY2021–24. Split years are not in this chart — tap Split.",
    fontsize=9,
    color=muted,
)
fig.savefig("/workspace/public/images/chart-policy.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

# Open border — actual encounters, not an average
fy = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
enc = [303916, 396579, 851508, 400651, 1659206, 2206436, 2045838, 1530523, 237538]
bcols = [oval_of(y)[1] for y in fy]
fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
xpos = list(range(len(fy)))
bars = ax.bar(xpos, [e / 1e6 for e in enc], color=bcols, width=0.72)
ax.set_xticks(xpos)
ax.set_xticklabels([str(y) for y in fy])
for i, e in enumerate(enc):
    label = f"{e/1e6:.2f}M" if e >= 1e6 else f"{e/1000:.0f}K"
    ax.text(i, e / 1e6 + 0.05, label, ha="center", va="bottom", fontsize=10, fontweight="bold", color=fg)
ax.set_ylabel("Southwest Border Patrol encounters  ·  millions", fontsize=12, color=muted)
ax.set_title("THE OPEN BORDER  ·  BY ADMINISTRATION", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "CBP. FY2017–20 Trump. FY2021–24 Biden — 7.44 million. FY2025 Trump — 237,538.",
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
fy_n = [2021, 2022, 2023, 2024]
nat = [1.956519, 2.766582, 3.201144, 2.901142]
sw = [1.734680, 2.378940, 2.475670, 2.135000]
other = [n - s for n, s in zip(nat, sw)]
fig, ax = plt.subplots(figsize=(16, 9), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
x = list(range(len(fy_n)))
w = 0.36
ax.bar([i - w / 2 for i in x], nat, width=w, color=biden_c, label="Nationwide — every CBP door")
ax.bar([i + w / 2 for i in x], sw, width=w, color="#6a655c", label="Southwest land only")
for i, (n, o) in enumerate(zip(nat, other)):
    ax.text(i - w / 2, n + 0.06, f"{n:.2f}M", ha="center", va="bottom", fontsize=10, fontweight="bold", color=fg)
    ax.text(i + w / 2, sw[i] + 0.06, f"{sw[i]:.2f}M", ha="center", va="bottom", fontsize=9, color=muted)
ax.set_xticks(x)
ax.set_xticklabels(["FY2021", "FY2022", "FY2023", "FY2024"])
ax.set_ylabel("Encounters  ·  millions", fontsize=12, color=muted)
ax.set_title("EVERY PATH CBP COUNTS", fontsize=20, fontweight="bold", color=fg, pad=16, loc="left")
ax.text(
    0.0,
    1.02,
    "Nationwide FY2021–24 = 10.83 million. Southwest land = 8.73 million. Northern line, airports, seaports, Miami and the rest = 2.10 million.",
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
murder_years = list(range(2015, 2026))
murder_rate = [4.9, 5.4, 5.3, 5.0, 5.0, 6.6, 6.5, 6.6, 6.0, 5.1, 4.1]
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
            xy=(5, 6.6),
            xytext=(0.2, 7.35),
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
    "Source: FBI UCR Summary of Reported Crimes in the Nation, 2025. Violent crime rate 2025: 327.6 per 100,000 (down 9.3% from 2024).",
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
labels = ["Republicans\nran both", "Democrats\nran both", "Split\ngavel"]
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

fig, axes = plt.subplots(1, 2, figsize=(16, 7), dpi=140, facecolor=bg)
labs = ["Obama\nFY09–16", "Trump 1\nFY17–20", "Biden\nFY21–24", "Trump 2\nFY25"]
enc = [3.31, 3.00, 10.83, 0.69]
cpi = [3.9, 2.9, 9.1, 3.4]
cols_o = [biden_c, trump_c, biden_c, trump_c]
ax = axes[0]
ax.set_facecolor(bg)
ax.bar(labs, enc, color=cols_o, width=0.62)
ax.set_title("NATIONWIDE ENCOUNTERS", fontsize=16, fontweight="bold", color=fg, loc="left")
ax.set_ylabel("Millions", color=muted)
for i, v in enumerate(enc):
    ax.text(i, v + 0.15, f"{v:.2f}M", ha="center", fontsize=12, fontweight="bold", color=fg)
ax.set_ylim(0, 13)
ax = axes[1]
ax.set_facecolor(bg)
ax.bar(labs, cpi, color=cols_o, width=0.62)
ax.set_title("CPI PEAK, YEAR-OVER-YEAR", fontsize=16, fontweight="bold", color=fg, loc="left")
ax.set_ylabel("Percent", color=muted)
for i, v in enumerate(cpi):
    ax.text(i, v + 0.15, f"{v:.1f}%", ha="center", fontsize=12, fontweight="bold", color=fg)
ax.set_ylim(0, 11)
for ax in axes:
    for s in ax.spines.values():
        s.set_color("#3a3a3a")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(colors=fg)
    ax.yaxis.label.set_color(muted)
fig.suptitle("THE OVAL — SAME METERS", fontsize=22, fontweight="bold", color=fg, x=0.02, ha="left")
fig.text(
    0.02,
    0.02,
    "Obama: southwest Border Patrol FY2009–16 (3.31M). Later ovals: CBP nationwide. BLS CPI: Obama Sept 2011 3.9%; Trump 1 in-term 2.9%; Biden June 2022 9.1%; Trump 2 Aug 2026 3.4%. Gallon is on the pump page.",
    fontsize=9,
    color=muted,
)
fig.tight_layout(rect=(0, 0.06, 1, 0.92))
fig.savefig("/workspace/public/images/chart-oval.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()

fig, ax = plt.subplots(figsize=(16, 8), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
labels = [
    "Power plant fuel  ·  ~5%",
    "2015 deal cap  ·  3.67%",
    "Iran, IAEA  ·  60%",
    "A bomb  ·  ~90%",
]
vals = [5, 3.67, 60, 90]
colors = [help_c, gop_c, biden_c, hurt_c]
y = [3, 2, 1, 0]
ax.barh(y, vals, color=colors, height=0.62)
for yi, v, lab in zip(y, vals, labels):
    ax.text(v + 1.5, yi, f"{v:g}%", va="center", fontsize=16, fontweight="bold", color=fg)
ax.set_yticks(y)
ax.set_yticklabels(labels, fontsize=13, fontweight="bold")
ax.set_xlim(0, 110)
ax.set_xlabel("U-235 enrichment", fontsize=12, color=muted)
ax.set_title("60% IS NOT A POWER PLANT", fontsize=22, fontweight="bold", color=fg, pad=18, loc="left")
ax.text(
    0.0,
    1.06,
    "IAEA, 13 June 2025: 440.9 kg of uranium enriched up to 60% U-235. The only non-weapon state at that level. A bomb is ~90%. The last step is the short one.",
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
    -0.14,
    "Source: IAEA GOV/2026/50 and GOV/2025/50. Stockpile as of 13 June 2025, last day the Agency could still count it. After the strikes, inspectors have not seen the material.",
    transform=ax.transAxes,
    fontsize=9,
    color=muted,
)
fig.tight_layout()
fig.savefig("/workspace/public/images/chart-iran.jpg", dpi=140, facecolor=bg, bbox_inches="tight")
plt.close()
print("wrote inflation, policy, border, crime, toll, debt-bars, oval, iran")




