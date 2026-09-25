"""SwampForce oil series (Sep 25, 2026). 6 phone cards, 1080x1350. All figures verified (see VERIFIED.md)."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
OUT = Path(__file__).parent / "png"; OUT.mkdir(exist_ok=True)
W, H = 1080, 1350
NAVY, RED, CREAM, GOLD, INK, MUTED, WHITE = "#0B1F4A", "#A61E22", "#F2EDE3", "#C9A227", "#0F172A", "#4B5563", "#FFFFFF"
LIGHT = "#E4DCCB"
ANTON = "/workspace/brand/src/Anton-Regular.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANSB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
LOCKUP = Image.open("/workspace/brand/swampforce-lockup-light-4500.png").convert("RGBA")
def F(p, s): return ImageFont.truetype(p, s)

def base(n, total=6):
    im = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 120], fill=NAVY); d.rectangle([0, 120, W, 128], fill=RED)
    lk = LOCKUP.copy(); lk.thumbnail((360, 96)); im.paste(lk, (36, (120 - lk.height) // 2), lk)
    t = f"{n} of {total}"; f = F(SANSB, 30); d.text((W - 40 - d.textlength(t, font=f), 44), t, font=f, fill=GOLD)
    return im, d

def footer(d, src):
    d.rectangle([0, H - 130, W, H], fill=NAVY)
    y = H - 120; f = F(SANS, 22)
    for line in wrap(d, " ".join(src), f, W - 72):
        d.text((36, y), line, font=f, fill="#D8DEE9"); y += 28
    t = "swampforce.com"; f = F(SANSB, 24); d.text((W - 36 - d.textlength(t, font=f), H - 40), t, font=f, fill=GOLD)

def center(d, y, text, font, fill):
    d.text(((W - d.textlength(text, font=font)) / 2, y), text, font=font, fill=fill)

def wrap(d, text, font, maxw):
    out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: out.append(cur); cur = w
    out.append(cur); return out

def para(d, x, y, text, font, fill, maxw, gap=1.25):
    for ln in wrap(d, text, font, maxw):
        d.text((x, y), ln, font=font, fill=fill); y += int(font.size * gap)
    return y

# ---------- simple icons (drawn, no clip art) ----------
def ic_well(d, x, y, s, c=NAVY):  # oil derrick
    d.polygon([(x + s*.5, y), (x + s*.15, y + s), (x + s*.28, y + s), (x + s*.5, y + s*.2), (x + s*.72, y + s), (x + s*.85, y + s)], fill=c)
    for k in (.45, .7): d.line([(x + s*(.5 - k*.35), y + s*k), (x + s*(.5 + k*.35), y + s*k)], fill=c, width=max(3, int(s*.05)))
    d.ellipse([x + s*.40, y + s*.72, x + s*.60, y + s*.92], fill=INK)
def ic_refinery(d, x, y, s, c=NAVY):
    d.rectangle([x, y + s*.55, x + s, y + s], fill=c)
    for i, h in enumerate((.1, .25, .05)):
        d.rectangle([x + s*(.1 + i*.3), y + s*h, x + s*(.22 + i*.3), y + s*.55], fill=c)
    d.ellipse([x + s*.6, y + s*.35, x + s*.95, y + s*.7], fill=c)
    for i in range(4): d.rectangle([x + s*(.08 + i*.24), y + s*.7, x + s*(.2 + i*.24), y + s*.82], fill=CREAM)
def ic_truck(d, x, y, s, c=NAVY):
    d.rounded_rectangle([x, y + s*.25, x + s*.66, y + s*.75], radius=int(s*.2), fill=c)
    d.polygon([(x + s*.68, y + s*.35), (x + s*.88, y + s*.35), (x + s, y + s*.55), (x + s, y + s*.75), (x + s*.68, y + s*.75)], fill=c)
    d.polygon([(x + s*.74, y + s*.41), (x + s*.86, y + s*.41), (x + s*.94, y + s*.55), (x + s*.74, y + s*.55)], fill=CREAM)
    for cx in (.18, .5, .84): d.ellipse([x + s*(cx - .1), y + s*.68, x + s*(cx + .1), y + s*.88], fill=INK)
def ic_ship(d, x, y, s, c=NAVY):
    d.polygon([(x, y + s*.55), (x + s, y + s*.55), (x + s*.85, y + s*.85), (x + s*.12, y + s*.85)], fill=c)
    d.rectangle([x + s*.62, y + s*.25, x + s*.82, y + s*.55], fill=c)
    d.rectangle([x + s*.68, y + s*.08, x + s*.76, y + s*.25], fill=RED)
    for i in range(3): d.ellipse([x + s*(.12 + i*.15), y + s*.38, x + s*(.25 + i*.15), y + s*.55], fill=c)
    d.line([(x - s*.05, y + s*.95), (x + s*1.05, y + s*.95)], fill="#2B6CB0", width=max(3, int(s*.05)))
def ic_tax(d, x, y, s, c=NAVY):  # building with columns (government)
    d.polygon([(x + s*.5, y), (x, y + s*.28), (x + s, y + s*.28)], fill=c)
    for i in range(4): d.rectangle([x + s*(.1 + i*.23), y + s*.33, x + s*(.2 + i*.23), y + s*.85], fill=c)
    d.rectangle([x, y + s*.88, x + s, y + s], fill=c)
def ic_pump(d, x, y, s, c=RED):
    d.rounded_rectangle([x + s*.12, y, x + s*.62, y + s], radius=int(s*.06), fill=c)
    d.rectangle([x + s*.2, y + s*.1, x + s*.54, y + s*.35], fill=CREAM)
    d.rectangle([x + s*.05, y + s*.92, x + s*.7, y + s], fill=c)
    d.line([(x + s*.62, y + s*.2), (x + s*.85, y + s*.3), (x + s*.85, y + s*.75), (x + s*.95, y + s*.8)], fill=c, width=max(4, int(s*.07)))
def ic_house(d, x, y, s, c=NAVY):  # White House-ish: dome + columns
    d.rectangle([x, y + s*.45, x + s, y + s], fill=c)
    d.pieslice([x + s*.3, y + s*.15, x + s*.7, y + s*.75], 180, 360, fill=c)
    d.rectangle([x + s*.47, y + s*.02, x + s*.53, y + s*.18], fill=c)
    for i in range(5): d.rectangle([x + s*(.08 + i*.18), y + s*.55, x + s*(.16 + i*.18), y + s*.92], fill=CREAM)
def arrow_down(d, cx, y, h=40, c=RED):
    d.rectangle([cx - 7, y, cx + 7, y + h - 18], fill=c); d.polygon([(cx - 22, y + h - 20), (cx + 22, y + h - 20), (cx, y + h)], fill=c)

# ---------- 1. cover ----------
def card1():
    im, d = base(1)
    ic_house(d, 415, 170, 250, NAVY)
    d.line([(390, 160), (690, 435)], fill=RED, width=24); d.line([(690, 160), (390, 435)], fill=RED, width=24)
    y = 455
    for ln, sz, col in [("NO PRESIDENT", 112, NAVY), ("SETS YOUR", 112, NAVY), ("GAS PRICE", 112, RED)]:
        f = F(ANTON, sz); center(d, y, ln, f, col); y = d.textbbox((0, y), ln, font=f)[3] + 12
    center(d, y + 14, "Not this one. Not the last one.", F(SANSB, 40), INK)
    center(d, y + 64, "Not the next one. Either party.", F(SANSB, 40), INK)
    d.rounded_rectangle([60, 1090, W - 60, 1200], radius=18, fill=WHITE, outline=LIGHT, width=3)
    center(d, 1103, "Small print: a president's policies can nudge", F(SANS, 30), MUTED)
    center(d, 1145, "supply a little. The world market sets the price.", F(SANS, 30), MUTED)
    footer(d, ["Sources: EIA, Factors affecting gasoline prices (crude = world supply and demand);",
               "OPEC press release Sep 6, 2026; AAA Sep 25, 2026. Full list on swampforce.com/gas-gap.html"])
    im.save(OUT / "oil-1-no-president-sets-gas-price.png", optimize=True)

# ---------- 2. well to tank with dollars (EIA May 2026) ----------
def card2():
    im, d = base(2)
    center(d, 150, "WHERE YOUR $4.48 GOES", F(ANTON, 92), NAVY)
    center(d, 268, "One gallon of regular, U.S. average, May 2026", F(SANS, 34), MUTED)
    steps = [(ic_well, "The oil", "from the well", "$2.32", NAVY),
             (ic_refinery, "The refinery", "turns oil into gas", "$0.97", NAVY),
             (ic_truck, "Pipe, truck, station", "gets it to you", "$0.66", NAVY),
             (ic_tax, "Taxes", "federal + state", "$0.52", RED)]
    y = 325
    for i, (ic, a, b, amt, col) in enumerate(steps):
        d.rounded_rectangle([50, y, W - 50, y + 150], radius=20, fill=WHITE, outline=LIGHT, width=3)
        ic(d, 80, y + 25, 100, col)
        d.text((215, y + 26), a, font=F(SANSB, 46), fill=INK); d.text((215, y + 88), b, font=F(SANS, 34), fill=MUTED)
        f = F(ANTON, 96); d.text((W - 80 - d.textlength(amt, font=f), y + 8), amt, font=f, fill=col)
        y += 150
        if i < 3: arrow_down(d, 130, y + 2, 34)
        y += 38
    ic_pump(d, 80, y + 5, 110)
    d.text((215, y + 18), "At the pump", font=F(SANSB, 50), fill=RED)
    f = F(ANTON, 118); d.text((W - 80 - d.textlength("$4.48", font=f), y - 8), "$4.48", font=f, fill=RED)
    d.text((215, y + 80), "Today (Sep 25): $4.49 (AAA)", font=F(SANS, 32), fill=MUTED)
    footer(d, ["Source: EIA Gasoline Pump Components History, May 2026 ($4.479; shares 51.9/21.7/14.8/11.5%).",
               "Parts are rounded, so they add to $4.47. Today: AAA national average, Sep 25, 2026."])
    im.save(OUT / "oil-2-where-your-gallon-goes.png", optimize=True)

# ---------- 3. who decides how much oil is pumped ----------
def card3():
    im, d = base(3)
    center(d, 150, "WHO DECIDES HOW", F(ANTON, 88), NAVY)
    center(d, 250, "MUCH OIL IS PUMPED?", F(ANTON, 88), NAVY)
    # USA box
    d.rounded_rectangle([50, 370, W - 50, 590], radius=20, fill=NAVY)
    d.text((80, 385), "#1", font=F(ANTON, 150), fill=GOLD)
    d.text((270, 392), "The U.S. pumps the", font=F(SANSB, 44), fill=WHITE)
    d.text((270, 444), "most oil in the world.", font=F(SANSB, 44), fill=WHITE)
    d.text((270, 500), "About 1 in 5 barrels. Private", font=F(SANS, 34), fill=GOLD)
    d.text((270, 542), "companies decide how much.", font=F(SANS, 34), fill=GOLD)
    # OPEC+ caps
    d.text((60, 615), "7 OPEC+ countries set limits", font=F(SANSB, 44), fill=RED)
    d.text((60, 670), "October 2026, million barrels a day", font=F(SANS, 32), fill=MUTED)
    caps = [("Saudi Arabia", 10.478), ("Russia", 9.949), ("Iraq", 4.431), ("Kuwait", 2.676), ("Kazakhstan", 1.628), ("Algeria", 1.007), ("Oman", 0.841)]
    y = 720; fx = F(SANSB, 34); maxw = 520
    for name, v in caps:
        d.text((60, y + 4), name, font=fx, fill=INK)
        bw = int(maxw * v / 10.478); d.rounded_rectangle([330, y, 330 + bw, y + 44], radius=8, fill=RED)
        d.text((340 + bw, y + 4), f"{v:.1f}", font=fx, fill=INK)
        y += 56
    para(d, 60, y + 12, "The UAE quit OPEC on May 1, 2026. OPEC+ meets again Oct 4. All of it is sold on one world market.", F(SANS, 32), INK, W - 120)
    footer(d, ["Sources: OPEC press release Sep 6, 2026 (Oct. table); UAE news agency WAM, Apr 28, 2026;",
               "EIA FAQ: top oil producers (U.S. 22% of world oil, 2023)."])
    im.save(OUT / "oil-3-who-decides-how-much-oil.png", optimize=True)

# ---------- 4. getting it to you ----------
def card4():
    im, d = base(4)
    center(d, 150, "GETTING IT TO YOU", F(ANTON, 96), NAVY)
    icons = [(ic_well, "Well"), (ic_ship, "Ship / pipe"), (ic_refinery, "Refinery"), (ic_truck, "Truck"), (ic_pump, "Pump")]
    x = 40
    for i, (ic, lab) in enumerate(icons):
        ic(d, x + 22, 300, 150, RED if ic is ic_pump else NAVY)
        f = F(SANSB, 26); d.text((x + 97 - d.textlength(lab, font=f) / 2, 470), lab, font=f, fill=INK)
        if i < 4: d.polygon([(x + 190, 360), (x + 190, 400), (x + 210, 380)], fill=RED)
        x += 200
    d.rounded_rectangle([50, 540, W - 50, 800], radius=20, fill=WHITE, outline=LIGHT, width=3)
    d.text((80, 555), "1 barrel = 42 gallons", font=F(SANSB, 46), fill=NAVY)
    d.text((80, 625), "$82.25", font=F(ANTON, 110), fill=RED)
    d.text((400, 640), "a barrel (July 2026)", font=F(SANS, 34), fill=INK)
    d.text((400, 690), "÷ 42 = about $1.96 of", font=F(SANSB, 34), fill=INK)
    d.text((400, 735), "oil in each gallon", font=F(SANSB, 34), fill=INK)
    y = 830
    for t in ["Oil is bought and sold worldwide. A war or a closed shipping lane far away can raise it for everyone.",
              "U.S. law: fuel shipped between two U.S. ports must go on American ships (the Jones Act)."]:
        d.ellipse([62, y + 12, 82, y + 32], fill=RED); y = para(d, 100, y, t, F(SANS, 36), INK, W - 160) + 18
    footer(d, ["Sources: EIA refiner acquisition cost of crude, composite, July 2026 ($82.25/barrel);",
               "EIA Factors affecting gasoline prices; 46 U.S.C. 55102 (Jones Act)."])
    im.save(OUT / "oil-4-getting-it-to-you.png", optimize=True)

# ---------- 5. tax by state ----------
def card5():
    im, d = base(5)
    center(d, 150, "TAX CHANGES BY STATE", F(ANTON, 92), NAVY)
    center(d, 262, "Cents per gallon of gas, federal + state", F(SANS, 34), MUTED)
    rows = [("California", 92.04, ""), ("Illinois", 88.8, ""), ("Washington", 78.57, ""), ("Colorado", 48.58, ""),
            ("Texas", 38.4, ""), ("Alaska", 27.35, ""), ("Indiana*", 19.4, "")]
    y = 325; maxw = 540
    for name, v, _ in rows:
        d.text((50, y + 10), name, font=F(SANSB, 38), fill=INK)
        bw = int(maxw * v / 92.04); col = RED if v > 60 else NAVY
        d.rounded_rectangle([335, y, 335 + bw, y + 64], radius=10, fill=col)
        d.text((350 + bw, y + 4), f"{v:.0f}¢", font=F(ANTON, 54), fill=col)
        y += 84
    d.text((50, y + 2), "*Indiana: 83¢ by law, paused through Oct 5, 2026.", font=F(SANS, 30), fill=MUTED)
    y += 60
    d.rounded_rectangle([50, y, W - 50, y + 175], radius=20, fill=WHITE, outline=LIGHT, width=3)
    d.text((80, y + 15), "Tax on a 15-gallon fill-up", font=F(SANSB, 38), fill=NAVY)
    d.text((80, y + 75), "California about $13.80", font=F(SANSB, 36), fill=RED)
    d.text((80, y + 122), "Texas about $5.76  ·  Alaska about $4.10", font=F(SANSB, 36), fill=NAVY)
    center(d, y + 190, "Every state: swampforce.com/gas-gap.html", F(SANSB, 32), RED)
    footer(d, ["Source: EIA state motor fuel taxes, July 1, 2026 (Illinois per IL Dept. of Revenue);",
               "federal 18.4¢ (26 U.S.C. 4081). Indiana: IN Dept. of Revenue / executive order."])
    im.save(OUT / "oil-5-tax-changes-by-state.png", optimize=True)

# ---------- 6. remember this ----------
def card6():
    im, d = base(6)
    center(d, 150, "REMEMBER THIS", F(ANTON, 110), NAVY)
    items = [("1", "The world market sets the price of oil. Oil is most of your gallon."),
             ("2", "Oil companies and OPEC+ countries decide how much oil is pumped."),
             ("3", "Your state sets its own gas tax. That is one reason prices differ."),
             ("4", "No president, from either party, sets the price.")]
    y = 300
    for n, t in items:
        col = RED if n == "4" else NAVY
        d.ellipse([60, y, 150, y + 90], fill=col); center_x = 105
        f = F(ANTON, 60); d.text((center_x - d.textlength(n, font=f) / 2, y + 5), n, font=f, fill=WHITE)
        yy = para(d, 180, y + 6, t, F(SANSB, 42), INK, W - 240)
        y = max(y + 110, yy + 30)
    d.rounded_rectangle([50, y + 10, W - 50, y + 230], radius=20, fill=WHITE, outline=GOLD, width=4)
    d.text((80, y + 28), "The small print", font=F(SANSB, 36), fill=NAVY)
    para(d, 80, y + 80, "A president can nudge supply a little: selling emergency reserve oil, sanctions, drilling leases, shipping waivers. That is a nudge, not a price.", F(SANS, 32), INK, W - 160)
    footer(d, ["Sources: EIA Factors affecting gasoline prices; OPEC Sep 6, 2026; EIA fuel taxes July 2026;",
               "42 U.S.C. 6241 (reserve oil sales); 46 U.S.C. 501 (Jones Act waivers)."])
    im.save(OUT / "oil-6-remember-this.png", optimize=True)

for c in (card1, card2, card3, card4, card5, card6): c()
print("ok", sorted(p.name for p in OUT.glob("*.png")))
