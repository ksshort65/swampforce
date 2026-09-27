#!/usr/bin/env python3
"""Kitchen-table scorecard charts. Numbers are cited in the HTML under each image."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path("/workspace/public/images")
BG, FG, MUTED, SAGE, BAR, LINE = (
    (18, 18, 18),
    (245, 241, 234),
    (163, 158, 147),
    (232, 224, 208),
    (196, 184, 160),
    (42, 42, 42),
)
W, H = 1600, 900


def font(size, bold=False):
    name = "LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"
    path = Path("/usr/share/fonts/truetype/liberation") / name
    return ImageFont.truetype(str(path), size)


def canvas(h=H):
    im = Image.new("RGB", (W, h), BG)
    d = ImageDraw.Draw(im)
    return im, d


def kicker(d, text, y=40):
    d.text((64, y), "SWAMP FORCE  ·  THE RECORD", font=font(22, True), fill=SAGE)
    d.text((64, y + 36), text, font=font(42, True), fill=FG)


def cite(d, text, y):
    d.text((64, y), text, font=font(18), fill=MUTED)


def bar(d, x, y, w, h, pct, label, value):
    d.rectangle([x, y, x + w, y + h], fill=LINE)
    d.rectangle([x, y, x + int(w * pct / 100), y + h], fill=BAR)
    d.text((x, y - 36), label, font=font(22, True), fill=SAGE)
    d.text((x + w - 8, y - 40), value, font=font(28, True), fill=FG, anchor="ra")


def save(im, name):
    p = OUT / name
    im.save(p, "JPEG", quality=88)
    print("wrote", p)


def job():
    im, d = canvas()
    kicker(d, "Congress holds the money.")
    bar(d, 64, 180, 1472, 64, 100, "Gross federal debt", "$40 trillion")
    bar(d, 64, 310, 1472, 64, 18, "What they vote themselves  ·  FY2026", "$7.3 billion")
    bar(d, 64, 440, 1472, 64, 46, "House days in session, 2025  ·  school year is 180", "169 days")
    bar(d, 64, 570, 1472, 64, 70, "Years since a surplus", "25  ·  last FY 2001")
    cite(d, "Sources: Treasury Fiscal Data  ·  CRS R48612  ·  history.house.gov session dates  ·  CBO budget data", 780)
    save(im, "chart-job.jpg")


def roll1964():
    im, d = canvas()
    kicker(d, "1964 civil rights law — the roll call.")
    d.text((64, 140), "Not a trophy. House vote on H.R. 7152.", font=font(24), fill=MUTED)
    bar(d, 64, 240, 1472, 90, 80, "Republicans  ·  138 yes  ·  34 no", "80% yes")
    bar(d, 64, 420, 1472, 90, 61, "Democrats  ·  152 yes  ·  96 no", "61% yes")
    d.text((64, 580), "96 Democrats voted no.", font=font(32, True), fill=FG)
    cite(d, "Source: Congress.gov  ·  H.R. 7152, 88th Congress", 780)
    save(im, "chart-1964.jpg")


def failure():
    im, d = canvas(1000)
    kicker(d, "They do not close the books.")
    cells = [
        ("FY 2001", "Last surplus. 25 years of red ink."),
        ("$17 million", "Treasury settlement account, 1997–2017."),
        ("$233–521B / yr", "GAO estimate of federal fraud."),
        ("SS · Medicare\nMedicaid · interest", "CBO: that drives the debt."),
    ]
    for i, (v, lab) in enumerate(cells):
        x, y = 64 + (i % 2) * 760, 180 + (i // 2) * 320
        d.rectangle([x, y, x + 712, y + 280], outline=LINE, width=2)
        d.multiline_text((x + 32, y + 36), v, font=font(40, True), fill=FG, spacing=8)
        d.text((x + 32, y + 200), lab, font=font(22), fill=MUTED)
    cite(d, "Sources: CBO budget data  ·  2 U.S.C. § 1415  ·  GAO-26-108945  ·  CBO 61172", 920)
    save(im, "chart-failure.jpg")


def majority():
    im, d = canvas(1000)
    kicker(d, "Who ran the House and Senate.")
    d.text((64, 130), "The president cannot spend. Congress writes the checks.", font=font(24), fill=MUTED)
    cols = [
        ("Republicans ran both", "1995–2001  ·  2003–07\n2015–19  ·  2025–now", "Cut taxes. Iraq. Unpaid\ndrug benefit. Border down\nthis term. Debt still up."),
        ("Democrats ran both", "1993–95  ·  2007–11\n2021–23", "Raised taxes. ObamaCare.\n9.1% prices, 2022. Record\nborder. Debt still up."),
        ("They split", "Most other years\nNixon  ·  2011–15  ·  COVID", "Neither could spend alone.\nThey still spent. Nixon:\nR president, D Congress,\ndebt still rose."),
    ]
    for i, (t, when, did) in enumerate(cols):
        x = 48 + i * 514
        d.rectangle([x, 190, x + 490, 860], outline=LINE, width=2)
        d.text((x + 24, 220), t, font=font(26, True), fill=SAGE)
        d.multiline_text((x + 24, 280), when, font=font(20), fill=MUTED, spacing=6)
        d.multiline_text((x + 24, 430), did, font=font(24), fill=FG, spacing=10)
    cite(d, "Sources: Senate party division  ·  House History  ·  Treasury  ·  BLS CPI June 2022  ·  CBP", 920)
    save(im, "chart-majority.jpg")


def blame():
    im, d = canvas(1000)
    kicker(d, "The fire is Congress. The blame game is politics.")
    d.text((64, 130), "Blaming the firefighter for the fire is not the record.", font=font(24), fill=MUTED)
    d.rectangle([64, 200, 760, 860], outline=LINE, width=2)
    d.rectangle([840, 200, 1536, 860], outline=LINE, width=2)
    d.text((88, 230), "THE FIRE", font=font(22, True), fill=SAGE)
    d.text((864, 230), "THE BLAME GAME", font=font(22, True), fill=SAGE)
    left = [
        "Article I — the purse",
        "169 days in the House, 2025",
        "No surplus since FY 2001",
        "Clown-show hearings, no 12 bills",
        "Settlement account: $17 million",
        "SS / Medicare / Medicaid / interest",
        "Self-governing, self-excusing",
    ]
    right = [
        "Blame the president",
        "Blame ICE — the firefighter",
        "Blame the other party’s voters",
        "Blame a clip, a caption, a jersey",
        "Blame the messenger",
        "A hearing is not a budget",
        "Division is the product they sell",
    ]
    for i, line in enumerate(left):
        d.text((88, 300 + i * 70), line, font=font(26), fill=FG)
    for i, line in enumerate(right):
        d.text((864, 300 + i * 70), line, font=font(26), fill=MUTED)
    cite(d, "Sources: U.S. Const. art. I  ·  history.house.gov  ·  CBO  ·  2 U.S.C. § 1415  ·  5 U.S.C. § 3331", 920)
    save(im, "chart-blame.jpg")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    job()
    roll1964()
    failure()
    majority()
    blame()
