#!/usr/bin/env python3
"""Parse trump-admin-false-claims-expanded-v2.md, classify by term, write xlsx/csv/zips."""
import re
import csv
import zipfile
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

SRC = Path("/workspace/trump-admin-false-claims-expanded-v2.md")
OUT = Path("/workspace/term-split")
COLUMNS = [
    "Claim",
    "Truth_Source_URL",
    "Who_Pushed_It",
    "Approximate_Duration",
    "Deception_Form",
    "Category_Tag",
    "Item_ID",
    "Notes",
]

# Explicit classifications: item_id -> ("first"|"later", reason_if_borderline_or_None)
# Prefer first for 2017–2020; Later for 2021+ instances; recirculations of bleach/Charlottesville in 2021+ -> Later
CLASSIFY = {
    1: ("first", None),  # Charlottesville Aug 2017 original framing
    2: ("first", None),  # Biden Feb 2020
    3: ("first", None),  # 2018 kids-in-cages photos
    4: ("first", None),  # Covington Jan 2019
    5: ("first", None),
    6: ("first", None),
    7: ("first", None),
    8: ("first", None),
    9: ("first", None),
    10: ("first", None),  # Steele Jan 2017 incoming-admin Russia
    11: ("first", None),
    12: ("first", None),  # Biden bleach July 2020 (original); #24 is 2024 recirculation
    13: ("first", None),
    14: ("first", "Event June 2020 (first term); IG report June 2021 — classified by event era"),
    15: ("first", None),  # Hunter laptop Oct 2020
    16: ("later", None),  # Stephanopoulos March 2024
    17: ("later", None),  # AP Gabbard March 2025 second term
    18: ("later", None),  # CNN mice March 2025
    19: ("later", None),  # Chicago ICE Jan 2025
    20: ("first", None),  # Smollett 2019
    21: ("first", None),
    22: ("first", None),
    23: ("first", None),  # USA TODAY Oct 2020 meme check (first-term era instance)
    24: ("later", "2024 campaign recirculation of bleach/Charlottesville — Later per instance rule"),
    25: ("first", None),  # Barr/Mueller 2019
    26: ("first", "Durham report is May 2023, but item documents absolute dismissals of Crossfire Hurricane/FISA failures from first-term Russia probe era; Durham is the correcting finding (parallel to Mueller on collusion)"),
    27: ("first", None),  # Lafayette terminology 2020
    28: ("first", None),
    29: ("first", None),
    30: ("first", None),
    31: ("later", None),  # bloodbath March 2024
    32: ("later", None),  # dictator day one 2023–24
    33: ("first", None),  # Ellison June 2018
    34: ("first", None),
    35: ("first", None),
    36: ("first", None),
    37: ("first", None),
    38: ("first", "Dec 2016–Jan 2017 Vermont grid — incoming-admin Russia climate (included per 2016–17 rule)"),
    39: ("first", "WaPo Millian ID stories 2017/2019; large portions removed Nov 2021 — classified by story era not correction date"),
    40: ("first", None),
    41: ("first", None),
    42: ("later", None),
    43: ("later", None),
    44: ("later", None),
    45: ("later", None),
    46: ("first", None),  # Biden Medicare $845B 2019
    47: ("later", None),
    48: ("later", None),
    49: ("first", None),
    50: ("first", None),
    51: ("first", None),
    52: ("first", None),
    53: ("later", None),  # Alligator Alcatraz 2025
    54: ("later", None),
    55: ("later", None),
    56: ("first", None),  # COVID hoax 2020
    57: ("first", "Tim Kaine Aug 2016 campaign claim — pre-inauguration; preferred first term (not 2021+ Later bucket)"),
    58: ("later", "BBC Panorama edit aired ahead of 2024 election; apology Nov 2025 — Later instance"),
    59: ("later", None),  # tariff pause Apr 2025
    60: ("first", "WaPo Georgia investigator story Jan 9, 2021 (still first term; Biden inaugurated Jan 20); correction Mar 2021"),
    61: ("first", None),
    62: ("first", None),
    63: ("first", None),
    64: ("first", None),
    65: ("first", None),
    66: ("first", None),
    67: ("first", None),
    68: ("first", None),
    69: ("first", None),
    70: ("first", None),
    71: ("first", None),
    72: ("first", "Cotton lab-leak WaPo piece Feb 2020 (COVID/first term); editor’s note June 2021 — classified by claim date"),
    73: ("later", None),  # CNN Loomer Sept 2024
    74: ("first", None),
    75: ("later", "60 Minutes Harris edits Oct 2024; Paramount settlement July 2025 — Later"),
    76: ("first", None),
    77: ("first", None),
    78: ("first", None),  # 17 intel agencies 2016–17 Russia
    79: ("first", None),
    80: ("first", None),
    81: ("first", None),
    82: ("first", None),
    83: ("first", None),
    84: ("first", None),
    85: ("first", None),  # Horowitz Dec 2019
}

# Duration heuristics keyed by item id — only when documentable from source text / public timeline
DURATION = {
    1: "years of campaign recirculation",
    2: "Not clearly documented",
    3: "~days until corrections/deletes (May 2018)",
    4: "weeks until fuller video; editor’s note ~6 weeks later (Mar 2019); settlements 2020",
    5: "days until retraction (June 2017)",
    6: "days until correction (Dec 2017)",
    7: "hours–days until Comey statement contradicted / CNN corrected (June 2017)",
    8: "hours (same-day/next-day correction; Ross suspended)",
    9: "hours–1 day until Mueller office disputed (Jan 2019)",
    10: "years of amplification until Mueller/Durham contradicted key claims",
    11: "months–years until Mueller report (Mar 2019)",
    12: "Not clearly documented",
    13: "Not clearly documented",
    14: "~1 year until Interior IG report (June 2021)",
    15: "months–years until authentication / platform walk-backs",
    16: "months until ABC settlement (~Dec 2024)",
    17: "hours–days until AP withdrew (March 2025)",
    18: "days until CNN updated fact-check (March 2025)",
    19: "hours–days until CPS/Secret Service clarification (Jan 2025)",
    20: "weeks–months until police staged finding; conviction later",
    21: "hours–days until NBC correction (June 2017)",
    22: "days until IJR retraction (2017)",
    23: "years of meme recirculation",
    24: "years of campaign recirculation",
    25: "Not clearly documented",
    26: "years until Durham report (May 2023)",
    27: "Not clearly documented",
    28: "hours–days until acknowledgment (2018)",
    29: "Not clearly documented",
    30: "days–weeks until National Review retraction (Jan 2019)",
    31: "days of headline cycle (March 2024)",
    32: "months of campaign recirculation (2023–2024)",
    33: "Not clearly documented",
    34: "hours (next-night retraction, Aug 2019)",
    35: "Not clearly documented",
    36: "Not clearly documented",
    37: "minutes–hours (same-day correction, Jan 2017)",
    38: "days until WaPo correction/follow-up (early Jan 2017)",
    39: "years until large portions removed (Nov 2021)",
    40: "days until NYT correction (Jan 2019)",
    41: "days until POLITICO editor’s note (April 2020)",
    42: "Not clearly documented",
    43: "Not clearly documented",
    44: "months of 2024 campaign recirculation",
    45: "months of 2024 campaign recirculation",
    46: "Not clearly documented",
    47: "months of 2024 campaign recirculation",
    48: "months of 2024 campaign recirculation",
    49: "hours (same-day correction, May 2018)",
    50: "hours–days until ABC/NBC corrections (Oct 2019)",
    51: "days until ABC apology (Oct 2019)",
    52: "months–years of shorthand (2017–2018+)",
    53: "Not clearly documented",
    54: "days of campaign cycle (March 2024)",
    55: "Not clearly documented",
    56: "weeks–months of 2020 ad/campaign recirculation",
    57: "Not clearly documented",
    58: "~1+ year until BBC apology (aired ~2024; apology Nov 2025)",
    59: "hours (same-day withdrawal, Apr 7, 2025)",
    60: "~2 months until audio-driven correction (Jan→Mar 2021)",
    61: "~1 year until ProPublica major correction (Feb 2017→Mar 2018)",
    62: "hours–1 day until Wallace apology (Aug 2019)",
    63: "days until Todd/NBC on-air apology (May 2020)",
    64: "hours (same-day delete/apology, Dec 2017)",
    65: "days of viral framing until context reporting (Jan 2017)",
    66: "months until Comey testimony contradicted (Feb→June 2017)",
    67: "days until Bloomberg/WSJ corrections (Dec 2017)",
    68: "days until TIME article-line correction / father statements (June 2018)",
    69: "months–~1 year until Relotius confession / Spiegel removal (2018 scandal)",
    70: "hours (same-briefing Birx correction + apology, Apr 2020)",
    71: "days until CBS removed clip / admitted error (Mar–Apr 2020)",
    72: "~16 months until WaPo editor’s note (Feb 2020→June 2021)",
    73: "days until on-air regrets (Sept 2024)",
    74: "days until NBC correction (Oct 2018)",
    75: "months until Paramount settlement (Oct 2024→July 2025)",
    76: "hours–days until fuller video / Duda rebuttal (July 2017)",
    77: "Not clearly documented",
    78: "months–years of shorthand (2016–2017+)",
    79: "months until Mueller contradicted Prague travel (report 2019)",
    80: "days until U.S./Mexico official pushback (Feb 2017)",
    81: "hours–days until Zeleny correction (Jan 2017)",
    82: "ongoing despite Mueller finding (from Mar 2019)",
    83: "days–weeks of viral “speech ban” framing (Dec 2017–Jan 2018)",
    84: "hours (same-day correct/delete, June 2017)",
    85: "Not clearly documented",
}

NOTES = {
    4: "CNN and WaPo settlements; terms largely confidential",
    9: "BuzzFeed stood by story; SCO said description “not accurate”",
    10: "BuzzFeed labeled dossier unverified at publication; amplification treated as validated",
    14: "IG did not find clearing done for photo-op; separate debates on irritants remain",
    16: "ABC settlement ~$15M to Trump library + fees; regret statement; no full liability admission required for inclusion",
    20: "IL Supreme Court 2024 procedural reversal on special prosecutor; staging finding remains basis",
    26: "Durham found process failures without proving broad criminal “deep state” conspiracy",
    39: "Post removed large portions after Danchenko indictment; editor’s notes added",
    66: "Times stood by reporting; Comey said story “in the main… not true”",
    68: "TIME corrected “carried away” line; defended symbolic cover use",
    75: "Settlement without admission of liability; ~$16M to Trump library + fees",
    79: "McClatchy largely stood by sources after Mueller; added editor’s notes",
    82: "Distinct from pre-Mueller item 11; post-Barr absolute “collusion” framing",
}


def clean_tag(raw: str) -> str:
    """Normalize Category_Tag to allowed taxonomy values."""
    allowed = {"false", "misleading", "misquote", "retracted/corrected", "inflammatory+false"}
    # Split on / and commas; take primary-ish joined uniquely preserving order of preference
    parts = re.split(r"\s*/\s*|\s*,\s*", raw.strip())
    cleaned = []
    for p in parts:
        p = p.strip().strip("`")
        # strip parentheticals
        p = re.sub(r"\s*\([^)]*\)\s*", "", p).strip()
        if not p:
            continue
        # map near-matches
        low = p.lower()
        if low in allowed:
            if low not in cleaned:
                cleaned.append(low)
        elif "retracted" in low or "corrected" in low:
            if "retracted/corrected" not in cleaned:
                cleaned.append("retracted/corrected")
        elif "inflammatory" in low:
            if "inflammatory+false" not in cleaned:
                cleaned.append("inflammatory+false")
        elif "misquote" in low:
            if "misquote" not in cleaned:
                cleaned.append("misquote")
        elif "misleading" in low:
            if "misleading" not in cleaned:
                cleaned.append("misleading")
        elif "false" in low:
            if "false" not in cleaned:
                cleaned.append("false")
    return " / ".join(cleaned) if cleaned else raw.strip().strip("`")


def pick_best_url(urls: list[str]) -> str:
    """Pick strongest single primary URL; among equal tier, prefer earlier Sources listing."""
    if not urls:
        return ""
    tiers = [
        (100, r"justice\.gov|oversight\.gov|supremecourt\.gov"),
        (90, r"factcheck\.org|politifact\.com|snopes\.com|apnews\.com"),
        (80, r"reuters\.com|propublica\.org"),
        (70, r"washingtonpost\.com|nytimes\.com|cnn\.com|abcnews\.com|nbcnews\.com|bbc\.com|npr\.org|cbsnews\.com|poynter\.org|politico\.com"),
        (40, r"."),
    ]
    best, best_score = urls[0], -1
    for idx, u in enumerate(urls):
        score = 40
        for s, pat in tiers:
            if re.search(pat, u, re.I):
                score = s
                break
        score = score * 1000 - idx  # document order tie-break
        if score > best_score:
            best_score, best = score, u
    return best


def parse_items(text: str) -> list[dict]:
    # Split on ## N. headers; skip non-item sections
    pattern = re.compile(r"^## (\d+)\.\s+(.+)$", re.M)
    matches = list(pattern.finditer(text))
    items = []
    for i, m in enumerate(matches):
        item_id = int(m.group(1))
        title = m.group(2).strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end]

        # Stop at methodology-ish if somehow included
        if item_id > 85:
            continue

        def field(name: str) -> str:
            fm = re.search(
                rf"-\s+\*\*{re.escape(name)}:\*\*\s*(.+?)(?=\n-\s+\*\*|\n## |\n---|\Z)",
                body,
                re.S,
            )
            if not fm:
                return ""
            return fm.group(1).strip()

        who = field("Who")
        claim = field("Claim")
        deception = field("Deception form")
        tag = field("Tag")

        # Sources: collect URLs under Sources section
        urls = []
        sm = re.search(r"-\s+\*\*Sources:\*\*\s*\n((?:\s+-\s+.+\n?)+)", body)
        if sm:
            for line in sm.group(1).splitlines():
                for u in re.findall(r"https?://[^\s\)\]]+", line):
                    u = u.rstrip(".,;")
                    urls.append(u)

        # Clean claim to one sentence if possible
        claim_clean = re.sub(r"\s+", " ", claim).strip()
        if claim_clean and not claim_clean.endswith((".", "?", "!")):
            claim_clean += "."

        # Who: semicolon-separated style
        who_clean = re.sub(r"\s+", " ", who).strip()
        # light normalize "and" lists already fine; keep as-is with semicolons where natural
        who_clean = who_clean.replace(" / ", "; ").replace("; ;", ";")

        deception_clean = deception.strip().strip("`")
        # Prefer primary form before dual slash for Deception_Form column — keep full as documented
        deception_clean = re.sub(r"\s+", " ", deception_clean)

        tag_clean = clean_tag(tag)

        items.append({
            "Item_ID": item_id,
            "title": title,
            "Claim": claim_clean,
            "Who_Pushed_It": who_clean,
            "Deception_Form": deception_clean,
            "Category_Tag": tag_clean,
            "urls": urls,
            "Truth_Source_URL": pick_best_url(urls),
            "Approximate_Duration": DURATION.get(item_id, "Not clearly documented"),
            "Notes": NOTES.get(item_id, ""),
        })
    return items


def style_workbook(wb: Workbook, rows: list[dict], sheet_title: str):
    ws = wb.active
    ws.title = sheet_title[:31]
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill("solid", fgColor="1F4E79")
    thin = Border(
        left=Side(style="thin", color="CCCCCC"),
        right=Side(style="thin", color="CCCCCC"),
        top=Side(style="thin", color="CCCCCC"),
        bottom=Side(style="thin", color="CCCCCC"),
    )
    wrap = Alignment(wrap_text=True, vertical="top")

    for col, name in enumerate(COLUMNS, 1):
        cell = ws.cell(1, col, name)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(wrap_text=True, vertical="center")

    for r_i, row in enumerate(rows, 2):
        for c_i, name in enumerate(COLUMNS, 1):
            val = row.get(name, "")
            cell = ws.cell(r_i, c_i, val)
            cell.alignment = wrap
            cell.border = thin
            if name == "Truth_Source_URL" and val:
                cell.hyperlink = val
                cell.font = Font(color="0563C1", underline="single")

    widths = {
        "A": 55,  # Claim
        "B": 55,  # URL
        "C": 40,  # Who
        "D": 40,  # Duration
        "E": 35,  # Deception
        "F": 28,  # Tag
        "G": 10,  # ID
        "H": 45,  # Notes
    }
    for col, w in widths.items():
        ws.column_dimensions[col].width = w
    ws.row_dimensions[1].height = 22
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:H{len(rows)+1}"


def write_csv(path: Path, rows: list[dict]):
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore")
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in COLUMNS})


def write_xlsx(path: Path, rows: list[dict], sheet_title: str):
    wb = Workbook()
    style_workbook(wb, rows, sheet_title)
    wb.save(path)


README_FIRST = """First-term Trump admin media deception spreadsheet
==================================================

Source: trump-admin-false-claims-expanded-v2.md (85-item documented list)
Scope: Claims primarily about Trump's first administration / events during 2017–Jan 2021
       (includes 2016–17 campaign-to-inauguration Russia stories about the incoming admin;
        Covington Jan 2019; COVID-era items).

Files:
  - first-term-trump-admin-media-deception.xlsx  (website-ready Excel)
  - first-term-trump-admin-media-deception.csv   (Google Sheets import)

Columns:
  1. Claim                 — short false/misleading claim (one sentence)
  2. Truth_Source_URL      — best single primary correction/fact-check/IG/settlement link
  3. Who_Pushed_It         — outlets / journalists / politicians
  4. Approximate_Duration  — how long widely pushed before correction (APPROXIMATE)
  5. Deception_Form        — taxonomy form from source (misquote, omitted context, etc.)
  6. Category_Tag          — false / misleading / misquote / retracted/corrected / inflammatory+false
  7. Item_ID               — original number from the markdown (traceability)
  8. Notes                 — optional caveat (e.g. settlement without admission)

IMPORTANT: Approximate_Duration values are approximate public timelines inferred from
the source text (same-day corrections, weeks until editor’s notes, years until Mueller/
Durham, etc.). Where the source did not clearly document duration, the cell is
"Not clearly documented". Do not treat durations as precise stopwatches.
"""

README_LATER = """Later / second-term era Trump admin media deception spreadsheet
===============================================================

Source: trump-admin-false-claims-expanded-v2.md (85-item documented list)
Scope: Claims from 2021–2024 about Trump as former president/candidate (falsehood about him
       generally), PLUS second-term 2025–2026 admin claims, PLUS 2024 campaign recirculations
       of bleach/Charlottesville-type characterizations when the INSTANCE is 2021+.

Files:
  - later-second-term-trump-admin-media-deception.xlsx
  - later-second-term-trump-admin-media-deception.csv

Columns:
  1. Claim                 — short false/misleading claim (one sentence)
  2. Truth_Source_URL      — best single primary correction/fact-check/IG/settlement link
  3. Who_Pushed_It         — outlets / journalists / politicians
  4. Approximate_Duration  — how long widely pushed before correction (APPROXIMATE)
  5. Deception_Form        — taxonomy form from source
  6. Category_Tag          — false / misleading / misquote / retracted/corrected / inflammatory+false
  7. Item_ID               — original number from the markdown (traceability)
  8. Notes                 — optional caveat (e.g. settlement without admission of liability)

IMPORTANT: Approximate_Duration values are approximate public timelines inferred from
the source text. Where duration was not clearly documentable, the cell is
"Not clearly documented". Do not invent or treat these as precise.
"""


def main():
    text = SRC.read_text(encoding="utf-8")
    items = parse_items(text)
    assert len(items) == 85, f"Expected 85 items, got {len(items)}: {[i['Item_ID'] for i in items]}"
    ids = {i["Item_ID"] for i in items}
    assert ids == set(range(1, 86)), f"Missing IDs: {set(range(1,86))-ids}"

    first, later = [], []
    borderline = []
    for it in items:
        term, reason = CLASSIFY[it["Item_ID"]]
        if reason:
            borderline.append((it["Item_ID"], term, reason, it["title"]))
        if term == "first":
            first.append(it)
        else:
            later.append(it)

    first.sort(key=lambda x: x["Item_ID"])
    later.sort(key=lambda x: x["Item_ID"])

    assert len(first) + len(later) == 85
    assert not (set(i["Item_ID"] for i in first) & set(i["Item_ID"] for i in later))

    OUT.mkdir(parents=True, exist_ok=True)
    first_xlsx = OUT / "first-term-trump-admin-media-deception.xlsx"
    first_csv = OUT / "first-term-trump-admin-media-deception.csv"
    later_xlsx = OUT / "later-second-term-trump-admin-media-deception.xlsx"
    later_csv = OUT / "later-second-term-trump-admin-media-deception.csv"

    write_xlsx(first_xlsx, first, "First Term 2017-2021")
    write_csv(first_csv, first)
    write_xlsx(later_xlsx, later, "Later Second Term Era")
    write_csv(later_csv, later)

    # READMEs for zips
    readme_first = OUT / "README-first-term.txt"
    readme_later = OUT / "README-later.txt"
    readme_first.write_text(README_FIRST, encoding="utf-8")
    readme_later.write_text(README_LATER, encoding="utf-8")

    # Zips at /workspace/
    zip1 = Path("/workspace/first-term-media-deception.zip")
    zip2 = Path("/workspace/later-second-term-media-deception.zip")
    with zipfile.ZipFile(zip1, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(first_xlsx, first_xlsx.name)
        z.write(first_csv, first_csv.name)
        z.write(readme_first, "README.txt")
    with zipfile.ZipFile(zip2, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(later_xlsx, later_xlsx.name)
        z.write(later_csv, later_csv.name)
        z.write(readme_later, "README.txt")

    unknown_dur = [i["Item_ID"] for i in items if i["Approximate_Duration"] == "Not clearly documented"]
    unknown_first = [i for i in unknown_dur if CLASSIFY[i][0] == "first"]
    unknown_later = [i for i in unknown_dur if CLASSIFY[i][0] == "later"]

    # classification summary
    lines = []
    lines.append("# Classification summary — term-split media deception spreadsheets\n")
    lines.append(f"**Source:** `{SRC}` (85 items)\n")
    lines.append(f"**Built:** 2026-09-24\n")
    lines.append("\n## Counts\n")
    lines.append(f"| Spreadsheet | Count | Item IDs |")
    lines.append(f"|-------------|-------|----------|")
    lines.append(f"| First term (2017–2021) | **{len(first)}** | {', '.join(str(i['Item_ID']) for i in first)} |")
    lines.append(f"| Later / second-term era | **{len(later)}** | {', '.join(str(i['Item_ID']) for i in later)} |")
    lines.append(f"| **Total** | **{len(first)+len(later)}** | 1–85 (none dropped) |")
    lines.append("\n## Column list (both spreadsheets)\n")
    for i, c in enumerate(COLUMNS, 1):
        lines.append(f"{i}. `{c}`")
    lines.append("\n## Output paths\n")
    lines.append(f"- `{first_xlsx}`")
    lines.append(f"- `{first_csv}`")
    lines.append(f"- `{later_xlsx}`")
    lines.append(f"- `{later_csv}`")
    lines.append(f"- `/workspace/first-term-media-deception.zip`")
    lines.append(f"- `/workspace/later-second-term-media-deception.zip`")
    lines.append("\n## Approximate_Duration unknown (`Not clearly documented`)\n")
    lines.append(f"- **Count:** {len(unknown_dur)} items")
    lines.append(f"- **First term:** {unknown_first}")
    lines.append(f"- **Later:** {unknown_later}")
    lines.append("\n## Borderline classification decisions\n")
    for iid, term, reason, title in borderline:
        lines.append(f"- **#{iid}** → **{term}** — {title}")
        lines.append(f"  - {reason}")
    lines.append("\n## Classification rules applied\n")
    lines.append("- **First term:** claims about first admin / events 2017–Jan 2021; 2016–17 incoming-admin Russia stories; Covington; COVID.")
    lines.append("- **Later:** 2021–2024 claims about Trump as former president/candidate; 2025–2026 second-term admin; 2024 recirculations (bleach, Charlottesville) when instance is 2021+.")
    lines.append("- Spanning items (e.g. Biden 2024 bleach) → Later.")
    lines.append("- When unsure: prefer first for 2017–2020 events; Later for 2021+.")
    lines.append("\n## Notes on URL picking\n")
    lines.append("Truth_Source_URL prefers (in order): justice.gov / oversight.gov / SCOTUS, then FactCheck/PolitiFact/Snopes/AP/Reuters, then major outlet corrections.")

    summary_path = OUT / "classification-summary.md"
    summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    # Also copy READMEs with expected names into term-split for clarity
    (OUT / "README-first-term.txt").write_text(README_FIRST, encoding="utf-8")

    print("FIRST", len(first), [i["Item_ID"] for i in first])
    print("LATER", len(later), [i["Item_ID"] for i in later])
    print("UNKNOWN_DUR", unknown_dur)
    print("BORDERLINE", len(borderline))
    print("WROTE", first_xlsx, later_xlsx, zip1, zip2, summary_path)


if __name__ == "__main__":
    main()
