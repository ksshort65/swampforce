#!/usr/bin/env python3
"""Oval file versus caption — charts for the scorecard."""
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

bg = "#0b0b0b"
fg = "#ece8dc"
muted = "#a39e93"
gop_c = "#c53030"
dem_c = "#2b6cb0"
trump_c = "#e53e3e"
biden_c = "#3182ce"
obama_c = "#2c5282"
box = "#141414"
line = "#3a3a3a"

plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "text.color": fg,
        "axes.labelcolor": fg,
        "xtick.color": muted,
        "ytick.color": muted,
    }
)


def save(fig, name):
    fig.savefig(f"/workspace/public/images/{name}", dpi=140, facecolor=bg, bbox_inches="tight")
    plt.close()
    print("wrote", name)


fig, ax = plt.subplots(figsize=(16, 13), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 14)
ax.axis("off")
ax.text(0.4, 13.5, "THE OVAL  ·  CAPTION VERSUS TAPE", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 12.9, "A six-second clip is how they steal the sentence.", fontsize=13, color=muted, va="top")
ax.text(0.5, 12.25, "WHAT THEY RAN", fontsize=11, fontweight="bold", color=gop_c)
ax.text(8.3, 12.25, "WHAT THE TAPE IS", fontsize=11, fontweight="bold", color=dem_c)
rows = [
    ("Collusion", "Mueller Vol. I: did not establish conspiracy."),
    ("Insurrection", "18 U.S.C. § 2383. Smith did not charge it. USAO-DC: zero."),
    ("Bloodbath", "Auto plants, Mexico, a 100% tariff. The car industry."),
    ("Dictator on day one", "Border and drill. “After that, I’m not a dictator.”"),
    ("Fine people", "Same answer: neo-Nazis “condemned totally.”"),
    ("Ukraine quid pro quo", "The call memo is the phone. Schiff’s reading is parody."),
    ("Jan. 6 Ellipse", "“Peacefully and patriotically.” Also: “Fight like hell.”"),
    ("Impeachment Two", "H.Res. 24. House ran the fighting words. Left the peaceably clause off the clip."),
    ("Drink bleach", "A question to doctors. Not an order to drink Clorox."),
    ("Animals", "An MS-13 roundtable. The gang was the subject."),
    ("Suckers / losers", "No tape. Anonymous. Denied by people present."),
]
for i, (left, right) in enumerate(rows):
    y = 11.55 - i * 0.95
    ax.add_patch(plt.Rectangle((0.4, y - 0.7), 7.4, 0.85, facecolor=box, edgecolor=line))
    ax.add_patch(plt.Rectangle((8.1, y - 0.7), 7.5, 0.85, facecolor=box, edgecolor=line))
    ax.text(0.6, y - 0.28, left, fontsize=14, fontweight="bold", color=gop_c, va="center")
    ax.text(8.3, y - 0.28, right, fontsize=13, color=fg, va="center")
ax.text(
    0.4,
    0.35,
    "Mueller  ·  23-cr-257  ·  USAO-DC  ·  call memo Sept. 2019  ·  C-SPAN Ellipse  ·  H.Res. 24  ·  the recording cuts both ways",
    fontsize=10,
    color=muted,
)
save(fig, "chart-oval-caption.jpg")

fig, ax = plt.subplots(figsize=(16, 10.5), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 11)
ax.axis("off")
ax.text(0.4, 10.5, "THE OVAL  ·  THE CASES", fontsize=24, fontweight="bold", color=fg, va="top")
ax.text(0.4, 9.9, "Caption versus count. Always.", fontsize=13, color=muted, va="top")
cases = [
    ("Russia / collusion", "No conspiracy charge", "Mueller: did not establish."),
    ("Jan. 6 “insurrection”", "Not 18 U.S.C. § 2383", "Charged: § 371, § 1512, § 241."),
    ("Florida documents", "Dismissed", "23-cr-80101. Appointments Clause."),
    ("Georgia RICO", "Dismissed", "The docket closed."),
    ("Impeachment I", "House yes  ·  Senate no", "The call memo is the phone."),
    ("Impeachment II", "House yes  ·  Senate no", "Clipped Ellipse. Peaceably clause off the clip. Not § 2383."),
    ("Manhattan 34 counts", "Jury guilty  ·  on appeal", "Falsifying records. Hush payment."),
]
for i, (name, status, note) in enumerate(cases):
    y = 8.95 - i * 1.1
    ax.add_patch(plt.Rectangle((0.4, y - 0.9), 15.2, 1.0, facecolor=box, edgecolor=line))
    ax.text(0.7, y - 0.4, name, fontsize=15, fontweight="bold", color=fg, va="center")
    ax.text(7.4, y - 0.22, status, fontsize=14, fontweight="bold", color=trump_c, va="center")
    ax.text(7.4, y - 0.58, note, fontsize=12, color=muted, va="center")
ax.text(
    0.4,
    0.35,
    "Mueller Vol. I  ·  DOJ 23-cr-257  ·  S.D. Fla. 23-cr-80101  ·  N.Y. 71543-23  ·  Congress.gov H.Res. 755 and H.Res. 24",
    fontsize=10,
    color=muted,
)
save(fig, "chart-oval-cases.jpg")

fig, ax = plt.subplots(figsize=(16, 7.6), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
labs = ["Obama\nFY09–16", "Trump 1\nFY17–20", "Biden\nFY21–24", "Trump 2\nFY25–"]
gas = [3.965, 2.962, 5.006, 4.500]
cols = [obama_c, trump_c, biden_c, trump_c]
ax.bar(labs, gas, color=cols, width=0.62)
ax.set_title("THE OVAL  ·  HIGHEST WEEKLY GASOLINE", fontsize=20, fontweight="bold", color=fg, loc="left", pad=16)
ax.set_ylabel("Dollars per gallon  ·  EIA weekly regular", color=muted, fontsize=12)
for i, v in enumerate(gas):
    ax.text(i, v + 0.08, f"${v:.3f}", ha="center", fontsize=14, fontweight="bold", color=fg)
ax.set_ylim(0, 6.2)
for s in ax.spines.values():
    s.set_color(line)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.tick_params(colors=fg)
ax.axhline(5.006, color=biden_c, lw=0.8, ls="--", alpha=0.7)
ax.text(3.45, 5.12, "Biden peak", fontsize=10, color=biden_c, ha="right")
ax.text(
    0.0,
    -0.14,
    "EIA weekly U.S. regular. Highest week in that Oval. OPEC, tax, refining, and shipping sit in the gallon. The peak does not reset.",
    transform=ax.transAxes,
    fontsize=10,
    color=muted,
)
fig.tight_layout()
save(fig, "chart-oval-gallon.jpg")

fig, ax = plt.subplots(figsize=(16, 14.6), dpi=140, facecolor=bg)
ax.set_facecolor(bg)
ax.set_xlim(0, 16)
ax.set_ylim(0, 15.6)
ax.axis("off")
ax.text(0.4, 15.15, "THE OVAL  ·  THE SLOGAN VERSUS THE DOCUMENT", fontsize=22, fontweight="bold", color=fg, va="top")
ax.text(0.4, 14.5, "Repeating it does not make it a warrant.", fontsize=14, color=muted, va="top")
rows = [
    ("Clear and present danger", "Sold as: he is the danger, so break\nthe law to stop him. Brandenburg limits\nthe state. It is not a warrant."),
    ("Threat to democracy", "No charging document. Mueller: no conspiracy.\nSmith did not charge § 2383. USAO-DC: zero."),
    ("The USA is a democracy", "Article IV, § 4: Republican Form of Government.\nFederalist 10. Majority bound by law."),
    ("So we may break the law", "That was the use of the slogan. FISA errors,\na clipped tape, four dockets. The oath forbids it."),
    ("Most corrupt president", "Not a statute. 34 false-record counts.\nBiden: foreign millions, Burisma, a pardon.\nRepublicans would not read that file out loud."),
    ("False accusation\nrepeated 12 years", "Proof they were smearing only.\nMueller: no conspiracy. Durham: none in the file\nwhen the case opened. The tax leak was a felony."),
]
for i, (left, right) in enumerate(rows):
    y = 13.55 - i * 2.05
    smear = i == len(rows) - 1
    ax.add_patch(plt.Rectangle((0.4, y - 1.7), 7.4, 1.9, facecolor=box, edgecolor=gop_c, lw=1.5))
    ax.add_patch(
        plt.Rectangle(
            (8.1, y - 1.7),
            7.5,
            1.9,
            facecolor=dem_c if smear else box,
            edgecolor=dem_c,
            lw=1.5,
        )
    )
    ax.text(4.1, y - 0.75, left, fontsize=15, fontweight="bold", color=gop_c, ha="center", va="center")
    ax.text(
        11.85,
        y - 0.75,
        right,
        fontsize=12,
        fontweight="bold" if smear else "normal",
        color="#ffffff" if smear else fg,
        ha="center",
        va="center",
    )
ax.text(
    0.4,
    0.22,
    "Brandenburg  ·  Art. IV, § 4  ·  Mueller Vol. I  ·  Durham  ·  § 2383  ·  26 U.S.C. § 7213  ·  House Oversight bank records",
    fontsize=10,
    color=muted,
)
save(fig, "chart-oval-slogan.jpg")

