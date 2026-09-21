#!/usr/bin/env python3
"""EIA pump charts. Numbers cited under the image on the page."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path("/workspace/public/images")
BG, FG, MUTED, SAGE, LINE = (
    (18, 18, 18),
    (245, 241, 234),
    (163, 158, 147),
    (232, 224, 208),
    (42, 42, 42),
)
BUSH = (155, 44, 44)
OBAMA = (44, 82, 130)
TRUMP = (229, 62, 62)
BIDEN = (49, 130, 206)
GAS = (232, 224, 208)
DIESEL = (140, 132, 118)
W, H = 1600, 900


def font(size, bold=False):
    name = "LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/liberation/{name}", size)


def canvas(h=H):
    im = Image.new("RGB", (W, h), BG)
    return im, ImageDraw.Draw(im)


def admins():
    im, d = canvas()
    d.text((64, 40), "SWAMP FORCE  ·  THE PUMP", font=font(22, True), fill=SAGE)
    d.text((64, 76), "Highest week. Not a four-year average.", font=font(36, True), fill=FG)
    d.text(
        (64, 128),
        "EIA weekly U.S. regular gasoline and on-highway diesel. Biden’s gasoline peak is $5.006.",
        font=font(22),
        fill=MUTED,
    )

    rows = [
        ("Bush", "July 2008", 4.114, 4.737),
        ("Obama", "May 2011 / Feb 2013", 3.965, 4.159),
        ("Trump 1", "May 2018 / Oct 2018", 2.962, 3.394),
        ("Biden", "June 13, 2022 / June 20, 2022", 5.006, 5.81),
    ]
    max_v = 6.285
    base_y = 780
    max_h = 520
    gap = 48
    group_w = 340
    bar_w = 128
    left = 80
    # axis
    d.line([(64, base_y), (1536, base_y)], fill=LINE, width=2)
    potus = [BUSH, OBAMA, TRUMP, BIDEN]
    for i, (who, when, gas, diesel) in enumerate(rows):
        x = left + i * (group_w + gap)
        gh = int(max_h * gas / max_v)
        dh = int(max_h * diesel / max_v)
        gx = x
        dx = x + bar_w + 16
        d.rectangle([gx, base_y - gh, gx + bar_w, base_y], fill=potus[i])
        d.rectangle([dx, base_y - dh, dx + bar_w, base_y], fill=tuple(max(0, c - 40) for c in potus[i]))
        label_c = (18, 18, 18) if potus[i][0] > 200 else FG
        d.text((gx + bar_w / 2, base_y - gh - 12), f"${gas:.2f}", font=font(22, True), fill=FG, anchor="ms")
        d.text((dx + bar_w / 2, base_y - dh - 12), f"${diesel:.2f}", font=font(22, True), fill=SAGE, anchor="ms")
        d.text((x + bar_w + 8, base_y + 16), who, font=font(24, True), fill=potus[i], anchor="mt")
        d.text((x + bar_w + 8, base_y + 48), when, font=font(18), fill=MUTED, anchor="mt")

    d.rectangle([64, 200, 88, 224], fill=BUSH)
    d.text((100, 198), "Bush", font=font(20, True), fill=FG)
    d.rectangle([220, 200, 244, 224], fill=OBAMA)
    d.text((256, 198), "Obama", font=font(20, True), fill=FG)
    d.rectangle([400, 200, 424, 224], fill=TRUMP)
    d.text((436, 198), "Trump 1", font=font(20, True), fill=FG)
    d.rectangle([600, 200, 624, 224], fill=BIDEN)
    d.text((636, 198), "Biden", font=font(20, True), fill=FG)
    d.text((64, 850), "Left bar gasoline, right bar diesel. Source: EIA weekly  ·  FRED GASREGW / GASDESW  ·  highest week in that Oval", font=font(18), fill=MUTED)
    im.save(OUT / "chart-pump-admins.jpg", "JPEG", quality=90)
    print("wrote chart-pump-admins.jpg")


def years():
    im, d = canvas()
    d.text((64, 36), "SWAMP FORCE  ·  THE PUMP", font=font(22, True), fill=SAGE)
    d.text((64, 72), "Highest week of each year.", font=font(40, True), fill=FG)
    d.text((64, 124), "EIA weekly U.S. regular gasoline. June 13, 2022: $5.006. Not a yearly mean.", font=font(22), fill=MUTED)

    data = [
        (2001, 1.737, "H"),
        (2002, 1.861, "H"),
        (2003, 2.084, "H"),
        (2004, 2.203, "H"),
        (2005, 3.157, "H"),
        (2006, 3.075, "H"),
        (2007, 3.271, "H"),
        (2008, 4.114, "H"),
        (2009, 2.694, "O"),
        (2010, 3.052, "O"),
        (2011, 3.965, "O"),
        (2012, 3.941, "O"),
        (2013, 3.784, "O"),
        (2014, 3.713, "O"),
        (2015, 2.835, "O"),
        (2016, 2.399, "O"),
        (2017, 2.685, "T"),
        (2018, 2.962, "T"),
        (2019, 2.897, "T"),
        (2020, 2.578, "T"),
        (2021, 3.410, "B"),
        (2022, 5.006, "B"),
        (2023, 3.878, "B"),
        (2024, 3.668, "B"),
        (2025, 3.243, "2"),
        (2026, 4.500, "2"),
    ]
    fill = {"H": BUSH, "O": OBAMA, "T": TRUMP, "B": BIDEN, "2": TRUMP}
    base_y = 760
    max_h = 500
    max_v = 5.006
    n = len(data)
    left = 64
    right = 1536
    slot = (right - left) / n
    bar_w = int(slot * 0.72)
    d.line([(left, base_y), (right, base_y)], fill=LINE, width=2)
    for i, (year, v, who) in enumerate(data):
        x = int(left + i * slot + (slot - bar_w) / 2)
        h = int(max_h * v / max_v)
        d.rectangle([x, base_y - h, x + bar_w, base_y], fill=fill[who])
        if year in (2008, 2011, 2018, 2022):
            d.text((x + bar_w / 2, base_y - h - 10), f"${v:.2f}", font=font(16, True), fill=FG, anchor="ms")
        label = "'26*" if year == 2026 else f"'{str(year)[2:]}"
        d.text((x + bar_w / 2, base_y + 12), label, font=font(16, True), fill=MUTED, anchor="mt")

    d.text((64, 170), "Bush", font=font(18, True), fill=BUSH)
    d.text((140, 170), "Obama", font=font(18, True), fill=OBAMA)
    d.text((240, 170), "Trump", font=font(18, True), fill=TRUMP)
    d.text((340, 170), "Biden", font=font(18, True), fill=BIDEN)
    d.text((64, 830), "Source: EIA weekly regular  ·  FRED GASREGW  ·  highest week of each year, including tax", font=font(18), fill=MUTED)
    im.save(OUT / "chart-pump-years.jpg", "JPEG", quality=90)
    print("wrote chart-pump-years.jpg")


def stack():
    im, d = canvas(h=820)
    d.text((64, 36), "SWAMP FORCE  ·  THE PUMP", font=font(22, True), fill=SAGE)
    d.text((64, 72), "What is in a gallon.", font=font(42, True), fill=FG)
    d.text(
        (64, 128),
        "EIA, May 2026. U.S. regular gasoline averaged $4.479. Four parts. Not a mood.",
        font=font(22),
        fill=MUTED,
    )
    rows = [
        ("Crude oil  ·  OPEC, OPEC+, the barrel", 51.9, "$2.33", (232, 224, 208)),
        ("Refining  ·  the plant", 21.7, "$0.97", (180, 172, 158)),
        ("Distribution  ·  pipe, truck, station", 14.8, "$0.66", (120, 114, 102)),
        ("Taxes  ·  federal + state", 11.5, "$0.52", (90, 86, 78)),
    ]
    x0, y0, full, bh, gap = 64, 220, 1470, 88, 28
    for i, (lab, pct, amt, col) in enumerate(rows):
        y = y0 + i * (bh + gap)
        w = int(full * pct / 100)
        d.rectangle([x0, y, x0 + full, y + bh], fill=(32, 32, 32))
        d.rectangle([x0, y, x0 + w, y + bh], fill=col)
        d.text((x0 + 16, y + 18), lab, font=font(22, True), fill=BG if i == 0 else FG)
        d.text((x0 + 16, y + 50), f"{pct:.1f}%   {amt}", font=font(20, True), fill=BG if i == 0 else SAGE)
    d.text(
        (64, 740),
        "Source: EIA Gasoline Pump Components History, May 2026  ·  eia.gov/petroleum/gasdiesel/gaspump_hist.php",
        font=font(18),
        fill=MUTED,
    )
    im.save(OUT / "chart-pump-stack.jpg", "JPEG", quality=90)
    print("wrote chart-pump-stack.jpg")


def flow():
    h = 1680
    im, d = canvas(h)
    d.text((64, 36), "SWAMP FORCE  ·  THE PUMP", font=font(22, True), fill=SAGE)
    d.text((64, 72), "How a gallon is built.", font=font(40, True), fill=FG)
    d.text(
        (64, 122),
        "EIA May 2026 U.S. regular  ·  $4.479 at the pump. OPEC sets barrels. Congress sets the tax. A state sets the blend.",
        font=font(20),
        fill=MUTED,
    )

    steps = [
        ("1  OPEC AND OPEC+", "Governments decide how many barrels leave the ground. Fewer barrels raise crude. More barrels lower it.", "Not a switch in the Oval."),
        ("2  CRUDE OIL", "West Texas Intermediate — a 42-gallon barrel of U.S. crude, traded in Cushing, Oklahoma.", "$2.33   ·   51.9% of the gallon"),
        ("3  SHIPPING", "Tanker, pipeline, then the terminal. Moving the barrel is not free.", "Inside EIA’s distribution line."),
        ("4  REFINING", "Black oil becomes gasoline. 132 operable U.S. plants. 18.4 million barrels a day of capacity.", "$0.97   ·   21.7%"),
        ("5  DISTRIBUTION", "Ethanol blend. Truck to the station. Rent and labor at the pump.", "$0.66   ·   14.8%"),
        ("6  FEDERAL TAX", "Gasoline 18.4 cents. Diesel 24.4 cents.", "Unchanged since October 1993."),
        ("7  STATE TAX", "EIA, January 1, 2026: 9.0 cents in Alaska to 70.9 cents in California. Average 33.5 cents.", "Same oil. Different legislatures."),
        ("8  RULES AND BLENDS", "Clean Air Act reformulated gasoline. California’s CARB recipe. Fewer plants can make it. It does not ship easily from the Gulf.", "Not an EIA dollar line. It still raises the gallon."),
        ("THE PUMP", "EIA Gasoline Pump Components History, May 2026.", "$4.479"),
    ]
    y = 180
    box_h = 128
    for i, (title, body, money) in enumerate(steps):
        fill = (38, 36, 32) if i < 8 else (232, 224, 208)
        tcol = FG if i < 8 else BG
        mcol = SAGE if i < 8 else (40, 36, 28)
        d.rounded_rectangle([64, y, 1536, y + box_h], radius=10, fill=fill)
        d.text((92, y + 16), title, font=font(24, True), fill=tcol)
        d.text((92, y + 52), body, font=font(18), fill=mcol)
        d.text((92, y + 86), money, font=font(20, True), fill=tcol)
        if i < len(steps) - 1:
            cy = y + box_h
            d.polygon([(800, cy + 4), (788, cy + 18), (812, cy + 18)], fill=SAGE)
        y += box_h + 22

    d.text(
        (64, h - 40),
        "Sources: EIA gaspump_hist.php  ·  EIA state motor-fuel taxes  ·  OPEC  ·  CRS IF13251 on U.S. refining",
        font=font(18),
        fill=MUTED,
    )
    im.save(OUT / "chart-pump-flow.jpg", "JPEG", quality=90)
    print("wrote chart-pump-flow.jpg")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    admins()
    years()
    stack()
    flow()
