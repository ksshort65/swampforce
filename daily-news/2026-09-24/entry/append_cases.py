"""Append the 3 approved Sep 24, 2026 candidates (merged into 2 cases) to the later-second-term catalog."""
import csv, io, re, copy
from pathlib import Path
import openpyxl
from openpyxl.styles import Font

TS = Path("/workspace/term-split")
BASE = "later-second-term-trump-admin-media-deception"
TRO = "https://storage.courtlistener.com/recap/gov.uscourts.dcd.296754/gov.uscourts.dcd.296754.24.0.pdf"
AP46 = "https://storage.courtlistener.com/recap/gov.uscourts.dcd.277682/gov.uscourts.dcd.277682.46.0_1.pdf"
TIME = "https://time.com/article/2026/09/24/judge-overturns-trump-white-house-media-ban-temporary-order-appeal/"
ABCAU = "https://www.abc.net.au/news/2026-09-24/us-judge-reverses-donald-trump-media-ban-cnn-politico-ms-now/107192236"
ABCUS = "https://abcnews.com/US/judge-orders-white-house-restore-press-passes-cnn/story?id=136709442"
GPB = "https://www.gpb.org/news/2026/09/23/major-news-outlets-banned-by-trump-will-have-their-day-in-court"
DOCKET = "https://www.courtlistener.com/docket/74823502/cable-news-network-inc-v-trump/"

NEW = [
    {
        "Claim": ("TIME and ABC News (Australia) reported that a federal judge \u201cordered President Donald Trump\u201d to restore "
                  "CNN, MS NOW and Politico\u2019s White House press access.\n"
                  "Began: Sep 24, 2026 (TIME article; ABC News Australia headline and summary) | "
                  "Ended: No ending date (live, uncorrected as of Sep 24, 2026)"),
        "Truth_Source_URL": TRO,
        "Who_Pushed_It": "TIME (Callum Sutherland and Olivia-Anne Cleary); ABC News Australia (Rudi Maxwell with wires; headline and summary)",
        "Approximate_Duration": "same day (live, uncorrected as of Sep 24, 2026)",
        "Deception_Form": "misquote / truncation",
        "Category_Tag": "false",
        "Item_ID": "252",
        "Notes": ("The order expressly leaves the President out. The substance (the administration was ordered to restore the passes) "
                  "is accurate; the error is naming Trump as the person ordered. Low severity, but the order's text contradicts it. "
                  "ABC News (US) reported it correctly (\u201cexcluding President Donald Trump\u201d). One case per claim: TIME and ABC News "
                  "Australia repeat the same error, so they share this row. ABC Australia's story is marked Reuters/ABC; Reuters' own "
                  "wording was not verified, so Reuters is not named. No correction or fact-check found as of Sep 24, 2026. "
                  f"Claim as published: {TIME} ; {ABCAU} Also: {ABCUS} ; {DOCKET}\n"
                  "Primary record: TRO, CNN v. Trump, No. 1:26-cv-03287-TJK (D.D.C. Sep 24, 2026), ECF 24 \u00b62: \u201cDefendants "
                  "(except for President Trump) and their agents, representatives, and all persons or entities acting in concert with them "
                  "shall immediately return, reinstate, and restore the White House \u2018hard pass\u2019 press credentials\u2026\u201d"),
        "Evidence_Level": "Proven false",
        "Primary_Source_URL": TRO,
        "Proof_Basis": "Official record",
        "Correction_Visibility": "Never corrected \u2014 fact-checked only",
    },
    {
        "Claim": ("NPR said Trump \u201cbarred the Associated Press from the White House\u201d in 2025 over the Gulf of America dispute, "
                  "presenting it as a precedent for the 2026 ban on CNN, MS NOW and Politico.\n"
                  "Began: Sep 23, 2026 (NPR, syndicated by GPB) | Ended: No ending date (live, uncorrected as of Sep 24, 2026)"),
        "Truth_Source_URL": AP46,
        "Who_Pushed_It": "NPR (David Folkenflik; syndicated by GPB)",
        "Approximate_Duration": "1+ day (live, uncorrected as of Sep 24, 2026)",
        "Deception_Form": "omitted context",
        "Category_Tag": "misleading / missing context",
        "Item_ID": "253",
        "Notes": ("In 2025 the AP was kept out of the press pool, the Oval Office, Air Force One and many East Room events, but it kept "
                  "its hard passes and general access to the White House press facilities. The 2026 action revoked hard passes and "
                  "blocked the whole complex, so the comparison makes the 2025 restriction look like the 2026 ban. Rated misleading, "
                  "not false, because \u201cbarred\u201d is accurate for specific events. No correction or fact-check found as of "
                  f"Sep 24, 2026. Claim as published: {GPB}\n"
                  "Primary record: AP v. Budowich, No. 1:25-cv-00532-TNM (D.D.C. Apr. 8, 2025), ECF 46 at 9: \u201cThe parties agree "
                  "that no AP employee's hard pass has been revoked\u201d; at 12: \u201cboth parties agreed that the AP's hard pass status "
                  "had been unchanged.\u201d"),
        "Evidence_Level": "Rated misleading",
        "Primary_Source_URL": AP46,
        "Proof_Basis": "Official record",
        "Correction_Visibility": "Never corrected \u2014 fact-checked only",
    },
]

# ---- CSV (UTF-8 BOM, CRLF, QUOTE_MINIMAL, same header) ----
p = TS / f"{BASE}.csv"
raw = p.read_bytes()
assert raw.startswith(b"\xef\xbb\xbf")
rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"), newline="")))
cols = list(rows[0].keys())
ids = {r["Item_ID"] for r in rows}
assert not ({n["Item_ID"] for n in NEW} & ids), "id collision"
first_ids = {r["Item_ID"] for r in csv.DictReader(open(TS / "first-term-trump-admin-media-deception.csv", encoding="utf-8-sig"))}
assert not ({n["Item_ID"] for n in NEW} & first_ids)
assert max(int(i) for i in ids | first_ids) == 251
for n in NEW:
    assert list(n.keys()) == cols, (list(n.keys()), cols)
buf = io.StringIO(newline="")
w = csv.DictWriter(buf, fieldnames=cols, lineterminator="\r\n")
w.writeheader()
for r in rows + NEW:
    w.writerow(r)
out = buf.getvalue()
# sanity: rewriting the original rows alone must reproduce the original file byte for byte
chk = io.StringIO(newline=""); w2 = csv.DictWriter(chk, fieldnames=cols, lineterminator="\r\n"); w2.writeheader(); [w2.writerow(r) for r in rows]
assert ("\ufeff" + chk.getvalue()).encode("utf-8") == raw, "CSV writer would not round-trip the existing file"
p.write_bytes(("\ufeff" + out).encode("utf-8"))

# ---- XLSX: copy last data row's styles, same hyperlink rules (B, J = URLs; H = first URL in Notes) ----
x = TS / f"{BASE}.xlsx"
wb = openpyxl.load_workbook(x)
ws = wb.active
last = ws.max_row
assert ws.cell(last, 7).value == rows[-1]["Item_ID"]
link_font = copy.copy(ws.cell(last, 2).font)
plain_font = copy.copy(ws.cell(last, 1).font)
for k, n in enumerate(NEW, 1):
    r = last + k
    for c, name in enumerate(cols, 1):
        src = ws.cell(last, c)
        cell = ws.cell(r, c, n[name])
        cell.alignment = copy.copy(src.alignment)
        cell.border = copy.copy(src.border)
        cell.number_format = src.number_format
        cell.font = copy.copy(plain_font)
        target = None
        if name in ("Truth_Source_URL", "Primary_Source_URL") and n[name]:
            target = n[name]
        if name == "Notes":
            m = re.findall(r"https?://[^\s;,)]+", n[name])
            target = m[0] if m else None
        if target:
            cell.hyperlink = target
            cell.font = copy.copy(link_font)
ws.auto_filter.ref = f"A1:L{ws.max_row}"
wb.save(x)
print("CSV rows", len(rows) + len(NEW), "XLSX data rows", ws.max_row - 1)
