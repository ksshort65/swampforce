#!/usr/bin/env python3
"""
sync_all.py: the single command to run after ANY data change.

    /workspace/.venv/bin/python /workspace/sync_all.py            # full rebuild + QA
    /workspace/.venv/bin/python /workspace/sync_all.py --skip-qa  # same, without the ~90 s browser QA

Source of truth: the two catalog CSVs in /workspace/term-split (one row per case). Everything else is rebuilt from
them, in dependency order:

  1. Catalog: validate both CSVs, bring each .xlsx in line with its CSV (values + hyperlinks, formatting kept),
     recompute the counts in page-header.txt, check the README counts, rebuild the two workspace zips.
  2. Brief: /workspace/brief/build_appendix.py and build_brief.py (PDF + HTML), then the three page thumbnails.
  3. Lawfare (only if /workspace/lawfare/build_tracker.py exists): regenerate into a temp dir, copy over only what
     changed, re-render the PDF + preview if the HTML changed, rebuild /workspace/lawfare-docket-tracker.zip if stale.
  4. Site: /workspace/site-from-checkpoint/build.py (pages, downloads copies, docs copies, data/cases.json).
     build.py also picks up /workspace/reverify/unsupported-final.csv when present.
  5. Site zip: /workspace/swampforce-from-checkpoint.zip (index.html at the root).
  6. QA: scripts/qa.py on the preview server (port 8931), overflow / console errors / broken links, screenshots.

Watch sections (trump-watch.html, movement-watch.html, record-2020.html) are built by step 4 from /workspace/trump-watch and
/workspace/movement-watch, /workspace/record-2020 plus the re-checked figures in site-from-checkpoint/watch-data/; see watch.py for how to add
more (accountability trackers and energy are listed there as planned and are never built until added).

It ends by printing the headline counts and exits non-zero, listing every problem, if any output's counts disagree
with the catalog or any copy is not byte-identical to its source.
"""
from __future__ import annotations

import csv, filecmp, html as html_mod, io, json, re, shutil, socket, subprocess, sys, tempfile, time, zipfile
from collections import Counter
from pathlib import Path

PY = "/workspace/.venv/bin/python"
W = Path("/workspace")
TS = W / "term-split"
BRIEF = W / "brief"
LAW = W / "lawfare"
SITE = W / "site-from-checkpoint"
OUT = SITE / "public_html"
UNSUP = W / "reverify" / "unsupported-final.csv"
SITE_ZIP = W / "swampforce-from-checkpoint.zip"
LAW_ZIP = W / "lawfare-docket-tracker.zip"
QA_PORT = 8931

TERMS = {  # term key -> (csv/xlsx stem, README file, workspace zip)
    "first": ("first-term-trump-admin-media-deception", "README-first-term.txt", W / "first-term-media-deception.zip"),
    "later": ("later-second-term-trump-admin-media-deception", "README-later.txt", W / "later-second-term-media-deception.zip"),
}
COLS = ["Claim", "Truth_Source_URL", "Who_Pushed_It", "Approximate_Duration", "Deception_Form", "Category_Tag", "Item_ID",
        "Notes", "Evidence_Level", "Primary_Source_URL", "Proof_Basis", "Correction_Visibility"]
EVIDENCE = {"Proven false", "Rated misleading"}
PROOF = {"Official record", "Original transcript/video", "Outlet's own correction", "Fact-check only"}
URL_RE = re.compile(r"https?://[^\s;,)]+")

ERRORS: list[str] = []
T0 = time.time()


def step(msg):
    print(f"\n=== [{time.time() - T0:6.1f}s] {msg}", flush=True)


def fail(msg):
    ERRORS.append(msg)
    print(f"  !! {msg}", flush=True)


def check(cond, msg):
    if not cond:
        fail(msg)
    return cond


def run(cmd, cwd=None):
    print("  $", " ".join(str(c) for c in cmd), flush=True)
    r = subprocess.run([str(c) for c in cmd], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout[-3000:], r.stderr[-3000:])
        raise SystemExit(f"\nFAILED (exit {r.returncode}): {' '.join(str(c) for c in cmd)}")
    return r.stdout


def same(a: Path, b: Path) -> bool:
    return a.exists() and b.exists() and filecmp.cmp(a, b, shallow=False)


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.replace("\u00ad", "")).strip()


# ───────────────────────── 1. catalog ─────────────────────────
def load_csv(path: Path):
    raw = path.read_bytes()
    if not raw.startswith(b"\xef\xbb\xbf"):
        raise SystemExit(f"{path}: missing UTF-8 BOM")
    rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"), newline="")))
    if not rows or list(rows[0].keys()) != COLS:
        raise SystemExit(f"{path}: header is not {COLS}")
    return rows


def validate_catalog(cat):
    seen = {}
    for term, rows in cat.items():
        for r in rows:
            iid = r["Item_ID"]
            where = f"{term} #{iid}"
            check(iid.isdigit(), f"catalog {where}: Item_ID is not a number")
            check(iid not in seen, f"catalog {where}: duplicate Item_ID (also in {seen.get(iid)})")
            seen[iid] = term
            check(r["Claim"].strip() != "", f"catalog {where}: empty Claim")
            check(r["Evidence_Level"] in EVIDENCE, f"catalog {where}: Evidence_Level {r['Evidence_Level']!r} not in {sorted(EVIDENCE)}")
            check(r["Proof_Basis"] in PROOF, f"catalog {where}: Proof_Basis {r['Proof_Basis']!r} not in {sorted(PROOF)}")
            check(r["Correction_Visibility"].strip() != "", f"catalog {where}: empty Correction_Visibility")
            for k in ("Truth_Source_URL", "Primary_Source_URL"):
                check(not r[k] or r[k].startswith("http"), f"catalog {where}: {k} is not a URL")


def catalog_counts(cat):
    rows = cat["first"] + cat["later"]
    ev = Counter(r["Evidence_Level"] for r in rows)
    pb = Counter(r["Proof_Basis"] for r in rows)
    cv = Counter(r["Correction_Visibility"] for r in rows)
    never = sum(v for k, v in cv.items() if k.startswith("Never corrected"))
    never_fc = sum(v for k, v in cv.items() if k.startswith("Never corrected") and "fact-check" in k.lower())
    # same buckets as build.py's `corr`
    buckets = Counter()
    for r in rows:
        c = r["Correction_Visibility"].lower()
        if c.startswith("never"): buckets["Never corrected by the pusher"] += 1
        elif "editor" in c: buckets["Editor's note"] += 1
        elif "legal" in c or "settle" in c: buckets["After legal threat / settlement"] += 1
        elif "on-air" in c or "on air" in c: buckets["On-air correction"] += 1
        elif c.startswith("appended"): buckets["Appended correction line"] += 1
        elif c: buckets["Not recorded"] += 1
    congress = json.loads((TS / "congress-count.json").read_text())["count"]
    return {
        "total": len(rows), "first": len(cat["first"]), "later": len(cat["later"]),
        "proven": ev["Proven false"], "misleading": ev["Rated misleading"],
        "official": pb["Official record"], "transcript": pb["Original transcript/video"],
        "outlet": pb["Outlet's own correction"], "factcheck": pb["Fact-check only"],
        "never": never, "never_fc": never_fc, "never_nofc": never - never_fc,
        "appended": cv["Appended correction line"], "editor": cv["Editor's note at bottom of article"],
        "legal": cv["Retraction after legal threat/settlement"], "onair": cv["On-air correction"], "unknown": cv["Unknown"],
        "buckets": dict(buckets), "congress": congress, "ids": sorted((r["Item_ID"] for r in rows), key=int),
    }


def sync_xlsx(rows, path: Path) -> bool:
    """Make the workbook's data rows equal the CSV (values + hyperlink rules), keeping the existing formatting."""
    import copy
    import openpyxl
    wb = openpyxl.load_workbook(path)
    ws = wb.active
    header = [ws.cell(1, c).value for c in range(1, len(COLS) + 1)]
    if header != COLS:
        raise SystemExit(f"{path}: header row {header} != {COLS}")
    link_font, plain_font = copy.copy(ws.cell(2, 2).font), copy.copy(ws.cell(2, 1).font)
    changed = False
    for i, r in enumerate(rows, start=2):
        new_row = i > ws.max_row
        ref = ws.max_row
        for c, name in enumerate(COLS, 1):
            cell = ws.cell(i, c)
            want = r[name]
            if new_row:
                src = ws.cell(ref, c)
                cell.alignment, cell.border, cell.number_format = copy.copy(src.alignment), copy.copy(src.border), src.number_format
                cell.font = copy.copy(plain_font)
            if ("" if cell.value is None else str(cell.value)) != want:
                cell.value = want or None
                changed = True
            if name in ("Truth_Source_URL", "Primary_Source_URL"):
                target = want or None
            elif name == "Notes":
                m = URL_RE.findall(want)
                target = m[0] if m else None
            else:
                target = None
            got = cell.hyperlink.target if cell.hyperlink else None
            if got != target:
                cell.hyperlink = target
                cell.font = copy.copy(link_font if target else plain_font)
                changed = True
    last = len(rows) + 1
    if ws.max_row > last:
        ws.delete_rows(last + 1, ws.max_row - last)
        changed = True
    ref = f"A1:{openpyxl.utils.get_column_letter(len(COLS))}{last}"
    if ws.auto_filter.ref != ref:
        ws.auto_filter.ref = ref
        changed = True
    if changed:
        wb.save(path)
    return changed


def xlsx_equals_csv(rows, path: Path) -> bool:
    import openpyxl
    ws = openpyxl.load_workbook(path, read_only=True).active
    got = [["" if v is None else str(v) for v in row] for row in ws.iter_rows(min_row=2, max_col=len(COLS), values_only=True)]
    return got == [[r[k] for k in COLS] for r in rows]


def update_page_header(k) -> bool:
    p = TS / "page-header.txt"
    text = p.read_text(encoding="utf-8")
    new, n1 = re.subn(
        r"In this site's (audit|review) of \d+ cases, \d+ were never corrected by the original pusher "
        r"\((?:fact-checked only|\d+ fact-checked only; \d+ with no fact-check on file)\); \d+ carried an appended correction line; "
        r"\d+ used an editor's note; \d+ followed a legal threat or settlement; and \d+ ran an on-air correction\.",
        lambda m: (f"In this site's {m.group(1)} of {k['total']} cases, {k['never']} were never corrected by the original pusher "
                   f"({k['never_fc']} fact-checked only; {k['never_nofc']} with no fact-check on file); {k['appended']} carried an "
                   f"appended correction line; {k['editor']} used an editor's note; {k['legal']} followed a legal threat or settlement; "
                   f"and {k['onair']} ran an on-air correction."), text)
    new, n2 = re.subn(r"In this record alone, \d+ cases were pushed", f"In this record alone, {k['congress']} cases were pushed", new)
    check(n1 == 1, "page-header.txt: correction-visibility sentence not found (exactly 1 expected)")
    check(n2 == 1, "page-header.txt: 'In this record alone, N cases were pushed' not found (exactly 1 expected)")
    if new != text:
        p.write_text(new, encoding="utf-8")
        return True
    return False


def term_zip_members(term):
    stem, readme, _ = TERMS[term]
    return {f"{stem}.xlsx": TS / f"{stem}.xlsx", f"{stem}.csv": TS / f"{stem}.csv",
            "README.txt": TS / readme, "page-header.txt": TS / "page-header.txt"}


def write_zip(zpath: Path, members: dict[str, Path]):
    tmp = zpath.with_suffix(".zip.tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for arc, src in members.items():
            z.write(src, arc)
    tmp.replace(zpath)


def zip_matches(zpath: Path, members: dict[str, Path], label: str, report=True) -> bool:
    problems = []
    if not zpath.exists():
        problems.append(f"{label}: {zpath} missing")
    else:
        with zipfile.ZipFile(zpath) as z:
            names = [n for n in z.namelist() if not n.endswith("/")]
            extra, missing = set(names) - set(members), set(members) - set(names)
            if extra: problems.append(f"{label}: unexpected members {sorted(extra)[:8]}")
            if missing: problems.append(f"{label}: missing members {sorted(missing)[:8]}")
            for n in set(names) & set(members):
                if z.read(n) != members[n].read_bytes():
                    problems.append(f"{label}: member {n} differs from {members[n]}")
    if report:
        for pr in problems:
            fail(pr)
    return not problems


# ───────────────────────── 3. lawfare ─────────────────────────
LAW_FILES = ["lawfare-docket-tracker.xlsx", "lawfare-docket-tracker.csv", "lawfare-rulings.csv", "lawfare-section.html", "README.txt"]


def xlsx_values(path: Path):
    import openpyxl
    wb = openpyxl.load_workbook(path, read_only=True)
    return {s: [list(r) for r in wb[s].iter_rows(values_only=True)] for s in wb.sheetnames}


def chrome_pdf(html: Path, pdf: Path):
    run(["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox", f"--print-to-pdf={pdf}", "--no-pdf-header-footer",
         f"file://{html.resolve()}"])


def lawfare_zip_members():
    m = {n: LAW / n for n in ["lawfare-docket-tracker.xlsx", "lawfare-docket-tracker.csv", "lawfare-rulings.csv",
                              "lawfare-section.html", "lawfare-tracker.pdf", "README.txt"]}
    m.update({f"sources/{p.name}": p for p in sorted((LAW / "sources").glob("*.pdf"))})
    m["assets/lawfare-tracker-page1.png"] = LAW / "assets" / "lawfare-tracker-page1.png"
    return m


def sync_lawfare():
    gen = LAW / "build_tracker.py"
    if not gen.exists():
        print("  (no /workspace/lawfare/build_tracker.py: lawfare outputs left as they are)")
        return
    with tempfile.TemporaryDirectory() as td:
        src = gen.read_text(encoding="utf-8")
        line = 'OUT = Path("/workspace/lawfare")'
        if src.count(line) != 1:
            raise SystemExit(f"{gen}: expected exactly one line `{line}` to redirect output")
        (Path(td) / "gen.py").write_text(src.replace(line, f'OUT = Path("{td}")'), encoding="utf-8")
        run([PY, "gen.py"], cwd=td)
        updated = []
        for n in LAW_FILES:
            new, cur = Path(td) / n, LAW / n
            if n.endswith(".xlsx"):
                differs = not cur.exists() or xlsx_values(new) != xlsx_values(cur)
            else:
                differs = not same(new, cur)
            if differs:
                shutil.copy2(new, cur)
                updated.append(n)
    print(f"  lawfare files updated: {updated or 'none (generator output matches)'}")
    section, printable = LAW / "lawfare-section.html", LAW / "lawfare-tracker-print.html"
    if not same(section, printable) or not (LAW / "lawfare-tracker.pdf").exists():
        shutil.copy2(section, printable)
        chrome_pdf(printable, LAW / "lawfare-tracker.pdf")
        prev = LAW / "assets" / "lawfare-tracker-page1"
        run(["pdftoppm", "-png", "-r", "150", "-f", "1", "-l", "1", "-singlefile", LAW / "lawfare-tracker.pdf", prev])
        shutil.copy2(prev.with_suffix(".png"), LAW / "assets" / "lawfare-tracker-page1-01.png")
        print("  lawfare PDF + preview re-rendered")
    members = lawfare_zip_members()
    if not zip_matches(LAW_ZIP, members, "lawfare zip", report=False):
        write_zip(LAW_ZIP, members)
        print(f"  rebuilt {LAW_ZIP}")


# ───────────────────────── 6. QA helpers ─────────────────────────
def ensure_preview_server():
    with socket.socket() as s:
        s.settimeout(1)
        if s.connect_ex(("127.0.0.1", QA_PORT)) == 0:
            return
    subprocess.Popen([sys.executable, "-m", "http.server", str(QA_PORT), "--bind", "127.0.0.1"], cwd=OUT,
                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    time.sleep(1.5)


# ───────────────────────── validation ─────────────────────────
def validate_outputs(k, cat):
    total, ids = k["total"], k["ids"]

    # catalog files themselves
    for term, rows in cat.items():
        stem = TERMS[term][0]
        check(xlsx_equals_csv(rows, TS / f"{stem}.xlsx"), f"{stem}.xlsx does not match {stem}.csv")
        readme = (TS / TERMS[term][1]).read_text(encoding="utf-8")
        m = re.search(r"documented list of (\d+) cases", readme)
        check(m and int(m.group(1)) == len(rows),
              f"{TERMS[term][1]} says {m.group(1) if m else '?'} cases but the {term} CSV has {len(rows)}: update its 'Source:' line")
        zip_matches(TERMS[term][2], term_zip_members(term), f"workspace zip {TERMS[term][2].name}")

    # brief PDF
    txt = norm(subprocess.run(["pdftotext", BRIEF / "swampforce-brief.pdf", "-"], capture_output=True, text=True).stdout)
    pages = int(re.search(r"Pages:\s+(\d+)", run(["pdfinfo", BRIEF / "swampforce-brief.pdf"])).group(1))
    check(pages == 2, f"brief PDF is {pages} pages, expected 2")
    want = [
        (rf"record of (\d+) cases \((\d+) from the first", (total, k["first"]), "summary total/first"),
        (rf"; (\d+) from after the first term", (k["later"],), "summary later"),
        (r"Proven false (\d+); Rated misleading (\d+)", (k["proven"], k["misleading"]), "evidence levels"),
        (r"Official record (\d+); Outlet’s own correction (\d+); Original transcript/video (\d+); Fact-check only (\d+)",
         (k["official"], k["outlet"], k["transcript"], k["factcheck"]), "proof basis"),
        (r"Never corrected (\d+) \(fact-checked only (\d+); no fact-check on file (\d+)\)", (k["never"], k["never_fc"], k["never_nofc"]), "never corrected"),
        (r"Appended correction (\d+); Editor’s note (\d+); Settlement/legal retraction (\d+); On-air (\d+); Unknown (\d+)",
         (k["appended"], k["editor"], k["legal"], k["onair"], k["unknown"]), "correction visibility"),
    ]
    for rx, exp, label in want:
        m = re.search(rx, txt)
        got = tuple(int(g) for g in m.groups()) if m else None
        check(got == exp, f"brief PDF {label}: {got} != catalog {exp}")

    # appendix PDF
    atxt = subprocess.run(["pdftotext", "-layout", BRIEF / "swampforce-evidence-appendix.pdf", "-"], capture_output=True, text=True).stdout
    m = re.search(r"· (\d+) cases ·", atxt)
    check(m and int(m.group(1)) == total, f"appendix header says {m.group(1) if m else '?'} cases, catalog has {total}")
    m1 = re.search(r"First Term \(2017–2021\) — (\d+) cases", atxt)
    check(m1 and int(m1.group(1)) == k["first"], f"appendix first-term section count {m1.group(1) if m1 else '?'} != {k['first']}")
    a_ids = re.findall(r"^\s*#(\d+)\s+(?:Proven false|Rated misleading)", atxt, re.M)
    check(sorted(a_ids, key=int) == ids, f"appendix lists {len(a_ids)} cases; catalog has {total} (ids differ: "
          f"{sorted(set(ids) ^ set(a_ids), key=int)[:10]})")

    # page-header.txt
    ph = (TS / "page-header.txt").read_text(encoding="utf-8")
    check(f"In this site's audit of {total} cases, {k['never']} were never corrected" in ph or
          f"In this site's review of {total} cases, {k['never']} were never corrected" in ph, "page-header.txt correction sentence is stale")

    # site: build summary + data
    bs = json.loads((SITE / "build-summary.json").read_text())
    st = bs["stats"]
    for key in ("total", "first", "later", "proven", "misleading", "official", "transcript", "outlet", "factcheck", "never"):
        check(st.get(key) == k[key], f"build-summary stats.{key} = {st.get(key)} but catalog = {k[key]}")
    check(bs.get("corr") == k["buckets"], f"build-summary corr {bs.get('corr')} != catalog {k['buckets']}")
    check(bs.get("never_split") == {"fact_checked_only": k["never_fc"], "no_fact_check": k["never_nofc"]}, "build-summary never_split mismatch")
    check(bs.get("congress") == k["congress"], f"build-summary congress {bs.get('congress')} != congress-count.json {k['congress']}")
    cj = json.loads((OUT / "data" / "cases.json").read_text(encoding="utf-8"))
    check(sorted((c["id"] for c in cj), key=int) == ids, f"data/cases.json has {len(cj)} cases; catalog has {total}")

    # site: page text
    pages_txt = {p.name: p.read_text(encoding="utf-8") for p in sorted(OUT.glob("*.html"))}
    allowed = {total, k["first"], k["later"]}
    for name, h in pages_txt.items():
        for m in re.finditer(r"\b(\d{3})(?:</b>)? (?:documented )?(?:cases|claims)\b", h):
            if re.search(r"\d[\d,]* of $", h[max(0, m.start() - 12):m.start()]):
                continue  # "346 of 469 cases": a fraction quoted from an outside record (e.g. a CDC cluster), not a catalog count
            check(int(m.group(1)) in allowed, f"{name}: '{m.group(0)}' does not match the catalog ({sorted(allowed)})")
        for m in re.finditer(r"In this site&#x27;s (?:audit|review) of (\d+) cases, (\d+) were never corrected by the original pusher "
                             r"\((\d+) fact-checked only; (\d+) with no fact-check on file\)", h):
            got = tuple(map(int, m.groups()))
            check(got == (total, k["never"], k["never_fc"], k["never_nofc"]), f"{name}: correction sentence {got} is stale")
    check(f"{k['never']} of {total} cases were never corrected" in pages_txt["index.html"], "index.html never-corrected line is stale")
    check(f"<b>{k['never']}</b> were never corrected" in pages_txt["brief.html"] and
          f"addressed {k['never_fc']} of them; the other {k['never_nofc']}" in pages_txt["brief.html"], "brief.html key finding is stale")
    check(f"<b>{k['congress']}</b> were pushed" in pages_txt["brief.html"], "brief.html Congress count is stale")
    check(f"First term ({k['first']} cases)" in pages_txt["downloads.html"] and f"2021 to present ({k['later']} cases)" in pages_txt["downloads.html"],
          "downloads.html term counts are stale")
    check(f">{k['congress']} cases</a>" in pages_txt["opinion.html"], "opinion.html Congress count is stale")

    # site: byte-identical copies
    for term in cat:
        stem = TERMS[term][0]
        for ext in ("csv", "xlsx"):
            check(same(TS / f"{stem}.{ext}", OUT / "downloads" / f"{stem}.{ext}"), f"downloads/{stem}.{ext} is not identical to term-split")
    dl_zips = {"first-term-media-deception.zip": "first", "later-second-term-media-deception.zip": "later"}
    for zn, term in dl_zips.items():
        stem = TERMS[term][0]
        zip_matches(OUT / "downloads" / zn, {f"{stem}.csv": TS / f"{stem}.csv", f"{stem}.xlsx": TS / f"{stem}.xlsx"}, f"downloads/{zn}")
    for n in ("swampforce-brief.pdf", "swampforce-evidence-appendix.pdf"):
        check(same(BRIEF / n, OUT / "docs" / n), f"docs/{n} is not identical to brief/{n}")
    check(same(BRIEF / "swampforce-evidence-appendix.html", OUT / "docs" / "evidence-appendix.html"),
          "docs/evidence-appendix.html is not identical to brief/swampforce-evidence-appendix.html")
    sb_want = (BRIEF / "swampforce-brief.html").read_text(encoding="utf-8").replace("<b>Evidence audit:</b>", "<b>Evidence review:</b>")
    check((OUT / "docs" / "staff-brief.html").read_text(encoding="utf-8") == sb_want,
          "docs/staff-brief.html is not the brief HTML (with 'Evidence audit' -> 'Evidence review')")

    # lawfare copies (build.py maps local source paths to public /lawfare-docs/ URLs in the CSV/XLSX downloads)
    if (LAW / "lawfare-docket-tracker.csv").exists():
        sys.path.insert(0, str(SITE))
        clean = __import__("build")._clean_paths
        check(same(LAW / "lawfare-tracker.pdf", OUT / "downloads" / "lawfare-tracker.pdf"), "downloads/lawfare-tracker.pdf is not identical to lawfare/")
        for n in ("lawfare-docket-tracker.csv", "lawfare-rulings.csv"):
            want_b = clean((LAW / n).read_text(encoding="utf-8-sig")).encode("utf-8-sig")
            check((OUT / "downloads" / n).read_bytes() == want_b, f"downloads/{n} is not lawfare/{n} (+ path cleanup)")
        with zipfile.ZipFile(LAW / "lawfare-docket-tracker.xlsx") as a, zipfile.ZipFile(OUT / "downloads" / "lawfare-docket-tracker.xlsx") as b:
            ok = a.namelist() == b.namelist() and all(
                b.read(n) == (clean(a.read(n).decode("utf-8")).encode("utf-8") if n.endswith(".xml") else a.read(n)) for n in a.namelist())
            check(ok, "downloads/lawfare-docket-tracker.xlsx is not lawfare/ xlsx (+ path cleanup)")
        for p in sorted((LAW / "sources").glob("*.pdf")):
            check(same(p, OUT / "lawfare-docs" / p.name), f"lawfare-docs/{p.name} is not identical to lawfare/sources/")
        check(same(LAW / "lawfare-section.html", LAW / "lawfare-tracker-print.html"), "lawfare-tracker-print.html is stale (PDF source)")
        zip_matches(LAW_ZIP, lawfare_zip_members(), "lawfare zip")

    # unsupported claims: present only when the source file has rows
    # (sources: reverify/unsupported-final.csv when present, plus site watch-data/unsupported-extra.csv)
    n_unsup = bs.get("unsupported", 0)
    if n_unsup:
        check((OUT / "unsupported.html").exists(), "unsupported.html missing although unsupported rows exist")
        with open(OUT / "downloads" / "unsupported-claims.csv", newline="", encoding="utf-8") as fh:
            dl = list(csv.DictReader(fh))
        check(len(dl) == n_unsup, f"downloads/unsupported-claims.csv has {len(dl)} rows; build reported {n_unsup}")
        srcs = [UNSUP, SITE / "watch-data" / "unsupported-extra.csv"]
        want = []
        for sp in srcs:
            if sp.exists():
                with open(sp, newline="", encoding="utf-8-sig") as fh:
                    want += [(r.get("Claim") or "").split("\n")[0].strip() for r in csv.DictReader(fh) if (r.get("Claim") or "").strip()]
        sys.path.insert(0, str(SITE))
        from build import decolo  # privacy rewording (Sep 25, 2026): the download carries the reworded claim
        want = [decolo(w) for w in want]
        got = {r["Claim"] for r in dl}
        missing = [w for w in want if w not in got]
        check(not missing, f"unsupported claims missing from the download: {missing[:3]}")
    else:
        check(not (OUT / "unsupported.html").exists(), "unsupported.html exists but there is no unsupported data")
        leaks = [n for n, h in pages_txt.items() if "unsupported.html" in h]
        check(not leaks, f"pages link to unsupported.html with no data: {leaks}")

    validate_watch(bs, pages_txt)

    # site zip = public_html exactly
    zip_matches(SITE_ZIP, site_zip_members(), "site zip")
    return n_unsup


def validate_watch(bs, pages_txt):
    """Watch sections (site-from-checkpoint/watch.py): built only when their inputs exist; checked against their sources."""
    def wcsv(p):
        with open(p, newline="", encoding="utf-8-sig") as f:
            return list(csv.DictReader(f))
    sys.path.insert(0, str(SITE))
    import importlib
    Wm = importlib.import_module("watch")
    ws = bs.get("watch", {})
    sitemap = (OUT / "sitemap.xml").read_text(encoding="utf-8")
    for sec in Wm.SECTIONS:
        h = pages_txt.get(sec.slug)
        if not sec.ready():
            check(h is None, f"{sec.slug} exists but its inputs are missing: {sec.missing()}")
            check(not any(sec.slug in t for t in pages_txt.values()), f"pages link to {sec.slug}, which was not built")
            continue
        check(h is not None, f"{sec.slug} missing although its inputs exist")
        if h is None:
            continue
        check(f"/{sec.slug}</loc>" in sitemap, f"{sec.slug} not in sitemap.xml")
        if getattr(sec, "in_menu", True):
            check(f'href="{sec.slug}"' in pages_txt["index.html"], f"{sec.slug} not linked from the nav/footer")
        else:
            check(any(f'href="{sec.slug}' in t for n, t in pages_txt.items() if n != sec.slug), f"{sec.slug} (sub-page) is not linked from any page")
        # every stamped card and table row carries a source link; reported lists are never stamped
        for card in re.findall(r'<article class="rec-card[^"]*".*?</article>', h, re.S):
            check('class="src"' in card, f"{sec.slug}: a record card has no source link")
        for box in re.findall(r'<aside class="rep-box".*?</aside>', h, re.S):
            check("vstamp" not in box, f"{sec.slug}: a Reported-only list contains a Verified stamp")
        if sec.builder.__module__ == "watch":
            for row in re.findall(r"<tbody>(.*?)</tbody>", h, re.S):
                for tr in re.findall(r"<tr>.*?</tr>", row, re.S):
                    check('class="src"' in tr, f"{sec.slug}: a table row has no source link")
        else:
            # watch2 pages: data tables cite their sources in the section, not on every row
            for secblk in re.findall(r'<section class="doc-section[^"]*" id="[^"]*">.*?</section>', h, re.S):
                if "<table" in secblk:
                    check('class="src"' in secblk or "downloads/" in secblk, f"{sec.slug}: a section with a data table has no source link")
    validate_watch2(pages_txt, ws)
    validate_site_apply(pages_txt, bs)
    st = ws.get("trump-watch.html", {})
    if (OUT / "trump-watch.html").exists():
        h = pages_txt["trump-watch.html"]
        fees = wcsv(SITE / "watch-data" / "trump-278e-foreign-fees.csv")
        lic = [f for f in fees if f["income_type"] == "License Fee"]
        total = round(sum(float(f["amount_usd"]) for f in lic), 2)
        check(abs(st.get("foreign_license_total", 0) - total) < 0.01, f"trump-watch foreign fee total {st.get('foreign_license_total')} != CSV {total}")
        check(f"${total:,.2f}" in h, f"trump-watch does not show the foreign fee total ${total:,.2f}")
        conf = wcsv(W / "trump-watch" / "conflicts.csv")
        both = [c for c in conf if c["confirmation_status"].lower().startswith("both sides confirmed") and c["action_primary_url"] and c["interest_primary_url"]]
        tb = re.search(r'<table class="watch-table conflicts">.*?<tbody>(.*?)</tbody>', h, re.S)
        n_rows = len(re.findall(r"<tr>", tb.group(1))) if tb else -1
        check(n_rows == len(both), f"trump-watch conflicts table has {n_rows} rows; conflicts.csv has {len(both)} confirmed on both sides")
        check(tb and tb.group(1).count("No official finding") == n_rows, "trump-watch: every conflicts row must show its status")
        vj = json.loads((SITE / "watch-data" / "watch-verified.json").read_text(encoding="utf-8"))
        check(f'>{vj["pardons"]["individual_grants"]}<' in h, "trump-watch clemency tile does not match watch-verified.json")
        check("not corruption" in h, "trump-watch: GAO findings must be labeled as budget-law findings, not corruption findings")
    if (OUT / "movement-watch.html").exists():
        h = pages_txt["movement-watch.html"]
        st = ws.get("movement-watch.html", {})
        viol = wcsv(W / "movement-watch" / "violence-2026.csv")
        off = [r for r in viol if r["official_source_url"]]
        tb = re.search(r'<table class="watch-table violence">.*?<tbody>(.*?)</tbody>', h, re.S)
        n_rows = len(re.findall(r"<tr>", tb.group(1))) if tb else -1
        check(n_rows == len(off) == st.get("violence_official"), f"movement-watch violence table {n_rows} rows; CSV has {len(off)} with an official record")
        minors = [m.group(1) for r in viol for fld in r.values() for m in re.finditer(r"([A-Z][a-zA-Z'\-]+(?: [A-Z][a-zA-Z'\-]+){1,3}) \((1[0-7]|[1-9])\)", fld or "")]
        for name in minors:
            check(name not in h, f"movement-watch names a minor: {name}")
        check("AIPAC boss call" not in h, "movement-watch: the Piker AIPAC claim must stay omitted")
        check("Rated misleading" in h and "wdet.org/2020/06/23" in h, "movement-watch: El-Sayed claim must be Rated misleading with the WDET source")
        check("Disputed" in h, "movement-watch: DSA Venezuela toll must be shown as Disputed")
    if (OUT / "record-2020.html").exists():
        h = pages_txt["record-2020.html"]
        R = W / "record-2020"
        draft = (R / "section-draft.md").read_text(encoding="utf-8")
        cands = {c["Item_ID"]: c for c in wcsv(R / "candidates.csv")}
        for cid, want in (("R2020-01", "Rated misleading"), ("R2020-02", "Rated misleading"), ("R2020-03", "Proven false")):
            blk = re.search(rf'<span class="frame-tag">{cid} .*?</article>', h, re.S)
            check(blk and want in blk.group(0), f"record-2020: {cid} must be a claim card rated {want}")
        check('id="r20-r2020-04"' in h and "unsup-tag" in h, "record-2020: R2020-04 must be shown as Unsupported")
        check("Timing caveat" in h, "record-2020: R2020-02 must carry its timing caveat")
        for cid in ("R2020-05", "R2020-06"):
            check(cid not in h and cands[cid]["Claim"].split("\n")[0][:60] not in h, f"record-2020: {cid} is on hold and must be omitted")
        bad = [r["source_url"] for r in wcsv(R / "sources.csv") if r["verified"].lower() != "yes" and r["source_url"] in h]
        check(not bad, f"record-2020 cites sources marked unverified: {bad}")
        for fig in ("41,655,560", "$2 billion" if "over $2 billion" in draft else "", "APPROXIMATELY $10,000,000"):
            check(not fig or fig in draft, f"record-2020: figure {fig} no longer in the draft")
        check("fentanyl intoxication" in h and "Homicide" in h and "We concur with the reported manner of death of homicide" in h,
              "record-2020: the Floyd panel must show the toxicology findings and the homicide ruling together")
        for term, (stem, _r, _z) in TERMS.items():
            check("R2020-" not in (TS / f"{stem}.csv").read_text(encoding="utf-8-sig"), f"{stem}.csv must not contain record-2020 candidates")
    for slug, info in bs.get("planned_sections", {}).items():
        check(not (OUT / slug).exists(), f"{slug} exists but planned sections must not be built yet")


def validate_site_apply(pages_txt, bs):
    """checkpoint-review/site-apply.json: cut rows never render; rows with an overlay show the corrected text, not the old text."""
    sa_path = W / "checkpoint-review" / "site-apply.json"
    if not sa_path.exists():
        return
    sa = json.loads(sa_path.read_text(encoding="utf-8"))
    ov = json.loads((SITE / "watch-data" / "site-apply-overlay.json").read_text(encoding="utf-8"))["rows"]
    st = bs.get("site_apply", {})
    check(st.get("entries") == len(sa["entries"]) == sa["counts"]["entries"], f"site-apply entries: build saw {st.get('entries')}, file has {len(sa['entries'])} (counts says {sa['counts']['entries']})")
    ids = {x["id"] for x in sa["entries"]}
    check(set(ov) <= ids, f"site-apply overlay rows not in site-apply.json: {sorted(set(ov) - ids)}")
    plain = html_mod.unescape(re.sub(r"<[^>]+>", " ", " ".join(pages_txt.values())))
    plain = re.sub(r"\s+", " ", plain)
    def frag(t):
        t = t.split("|", 1)[-1].split(":", 1)[-1] if "TRUTH:" in t else t
        return re.sub(r"\s+", " ", t).strip()[:70]
    by_id = {x["id"]: x for x in sa["entries"]}
    for i, o in ov.items():
        old = frag(by_id[i]["old_text"]); new = frag(o["Text"].split("Our view:")[0])
        kept = re.sub(r"\s+", " ", o["Text"])
        check(old == new or old in kept or old not in plain, f"site-apply {i}: old text still on the site: {old[:50]}")
        check(new in plain, f"site-apply {i}: corrected text not found on the site: {new[:50]}")
    for x in sa["entries"]:
        if "cut it" in (x.get("verdict") or ""):
            f = frag(x["old_text"])
            check(len(f) < 30 or f not in plain, f"site-apply {x['id']} is marked '{x['verdict']}' but its text is on the site: {f[:50]}")
    check("290" not in ids, "site-apply entry 290 should have been dropped (item now Verified)")


def validate_watch2(pages_txt, ws):
    """Checks for the watch2 pages (accountability, energy, voters, Floyd, censorship), trump-watch additions, opinion and balance."""
    allh = "\n".join(pages_txt.values())
    # salary: total shown equals the sum of confirmed rows
    if (OUT / "trump-watch.html").exists():
        h = pages_txt["trump-watch.html"]
        with open(SITE / "watch-data" / "salary-donations.csv", newline="", encoding="utf-8-sig") as fh:
            sal = list(csv.DictReader(fh))
        amt_col = next((c for c in sal[0] if "amount" in c.lower()), None) if sal else None
        stat_col = next((c for c in sal[0] if "status" in c.lower() or "confirm" in c.lower()), None) if sal else None
        if amt_col and stat_col:
            tot = round(sum(float(r[amt_col]) for r in sal if r[amt_col] and r[stat_col].lower().startswith(("confirmed", "primary", "yes"))), 2)
            check(f"${tot:,.2f}" in h, f"trump-watch salary total ${tot:,.2f} (sum of confirmed rows) not shown")
        mon = json.loads((SITE / "watch-data" / "monuments.json").read_text(encoding="utf-8"))
        quotes = [q.get("quote") for q in mon.get("schumer", []) if isinstance(q, dict)]
        check(len(quotes) == 7, f"monuments.json should hold 7 Schumer quotes, has {len(quotes)}")
        for q in quotes:
            if q:
                check(html_mod.escape(q[:60]) in h or q[:60] in h, f"trump-watch monuments quote missing: {q[:50]}")
    if (OUT / "accountability-fraud.html").exists():
        h = pages_txt["accountability-fraud.html"]
        txt = re.sub(r"<[^>]+>", "", h)
        check(not re.search(r"(?i)(grand total|total fraud)[^.]{0,40}\$\d", txt), "accountability-fraud: no numeric grand total may be shown")
        check("no single &quot;grand total&quot;" in h, "accountability-fraud: the no-grand-total explanation is missing")
    if (OUT / "accountability-omar.html").exists():
        check("Unresolved" in pages_txt["accountability-omar.html"], "accountability-omar: the verdict label must be Unresolved")
    if (OUT / "voters.html").exists():
        h = pages_txt["voters.html"]
        # Sep 24, 2026: the user supplied the letter image; only the redacted (name-blurred) copy may be shown.
        imgs = re.findall(r'<img[^>]*src="([^"]*(?:hickenlooper|letter)[^"]*)"', h, re.I)
        check(all(s.endswith("-redacted.jpg") for s in imgs), "voters: Hickenlooper letter image must be the redacted copy")  # letter held off the page for privacy (Sep 25, 2026)
        check(not (OUT / "images" / "voters" / "hickenlooper-save-act-letter-2026-03-20.jpg").exists(), "voters: unredacted letter image must not be published")
        check("Dear " not in h, "voters: the letter recipient's name must not appear")
        check((OUT / "downloads" / "population-voters.xlsx").exists(), "voters: workbook download missing")
    if (OUT / "unsupported.html").exists():
        check("dead people and noncitizens should vote" in pages_txt["unsupported.html"], "unsupported: the secretary-of-state claim must be listed")
    check("Brandon Mitchell" not in allh, "a page names juror 52")
    if (OUT / "censorship.html").exists():
        h = pages_txt["censorship.html"]
        check("f***ing serious" in h, "censorship: the Flaherty quote must appear masked (f***ing)")
    check(not re.search(r"(?i)\bfuck", allh), "unmasked profanity on a page")
    if (OUT / "record-2020-floyd.html").exists():
        check('href="record-2020-floyd.html"' in pages_txt.get("record-2020.html", ""), "record-2020 must link the Floyd deep page")
    op = pages_txt.get("opinion.html", "")
    check("the-same-evidence-for-everyone" in op and "a people that no longer can believe anything" in op, "opinion: the same-evidence entry and its Arendt quote must be present")
    check('id="balance"' in pages_txt.get("about.html", "") and (SITE / "balance-report.md").exists(), "methodology: balance block or balance-report.md missing")
    rq = SITE / "review-queue" / "censorship-candidates.csv"
    if rq.exists():
        with open(rq, newline="", encoding="utf-8") as fh:
            rows = list(csv.DictReader(fh))
        check(all(r["Status"] == "pending user review" for r in rows), "review queue rows must stay pending user review")
        check(not any(r["Claim"].split("\n")[0][:50] in pages_txt.get("fake-news.html", "") for r in rows), "review-queue candidates must not be in the live catalog")


def site_zip_members():
    return {p.relative_to(OUT).as_posix(): p for p in sorted(OUT.rglob("*")) if p.is_file()}


# ───────────────────────── main ─────────────────────────
def main():
    skip_qa = "--skip-qa" in sys.argv

    step("1. Catalog: validate CSVs, sync XLSX, page-header counts, workspace zips")
    cat = {t: load_csv(TS / f"{TERMS[t][0]}.csv") for t in TERMS}
    validate_catalog(cat)
    if ERRORS:
        raise SystemExit("\nCatalog is invalid; nothing was rebuilt:\n  - " + "\n  - ".join(ERRORS))
    k = catalog_counts(cat)
    for t, rows in cat.items():
        print(f"  {TERMS[t][0]}.xlsx:", "updated from CSV" if sync_xlsx(rows, TS / f"{TERMS[t][0]}.xlsx") else "already matches CSV")
    print("  page-header.txt:", "counts updated" if update_page_header(k) else "counts already current")
    for t in TERMS:
        write_zip(TERMS[t][2], term_zip_members(t))
        print(f"  rebuilt {TERMS[t][2]}")

    step("2. Brief + appendix (PDF + HTML) and thumbnails")
    run([PY, "build_appendix.py"], cwd=BRIEF)
    run([PY, "build_brief.py"], cwd=BRIEF)
    img = OUT / "images"
    for pdf, pg, name in [("swampforce-brief.pdf", 1, "brief-p1"), ("swampforce-brief.pdf", 2, "brief-p2"),
                          ("swampforce-evidence-appendix.pdf", 1, "appendix-p1")]:
        run(["pdftoppm", "-jpeg", "-jpegopt", "quality=88", "-scale-to-x", "700", "-scale-to-y", "905", "-f", pg, "-l", pg,
             "-singlefile", BRIEF / pdf, img / name])

    step("3. Lawfare tracker")
    sync_lawfare()

    step("4. Site build (pages, downloads, docs, data)")
    run([PY, "build.py"], cwd=SITE)

    step("5. Site zip")
    write_zip(SITE_ZIP, site_zip_members())
    print(f"  {SITE_ZIP}: {len(site_zip_members())} files")

    step("Validation: counts vs catalog, byte-identical copies")
    n_unsup = validate_outputs(k, cat)

    if skip_qa:
        step("6. QA skipped (--skip-qa)")
    else:
        step("6. QA (browser: overflow at 1280/390, console errors, broken links)")
        ensure_preview_server()
        run([PY, "scripts/qa.py"], cwd=SITE)
        rep = json.loads((SITE / "qa-report.json").read_text())
        for key in ("overflow", "console", "broken_local"):
            check(not rep.get(key), f"QA {key}: {len(rep.get(key, []))} issue(s), e.g. {rep.get(key, [])[:3]}")
        print(f"  QA: overflow {len(rep['overflow'])}, console {len(rep['console'])}, broken links {len(rep['broken_local'])}")

    step("Headline counts (from the catalog)")
    print(f"  Cases {k['total']}  (first term {k['first']} / 2021-present {k['later']})")
    print(f"  Proven false {k['proven']} · Rated misleading {k['misleading']}")
    print(f"  Proof: official record {k['official']} · transcript/video {k['transcript']} · outlet correction {k['outlet']} · fact-check only {k['factcheck']}")
    print(f"  Never corrected {k['never']} (fact-checked only {k['never_fc']}; no fact-check on file {k['never_nofc']}) · appended {k['appended']}"
          f" · editor's note {k['editor']} · legal/settlement {k['legal']} · on-air {k['onair']} · unknown {k['unknown']}")
    print(f"  Pushed by sitting members of Congress {k['congress']} · Unsupported claims listed {n_unsup}")
    bsum = json.loads((SITE / "build-summary.json").read_text())
    for slug, st in bsum.get("watch", {}).items():
        print(f"  Watch {slug}: " + ("SKIPPED (inputs missing)" if st.get("skipped") else ", ".join(f"{a} {b}" for a, b in st.items() if a != "omitted")))
    for slug, info in bsum.get("planned_sections", {}).items():
        print(f"  Planned {slug} (not built): {info['folder']} has {', '.join(info['entries']) or 'nothing yet'}")
    print(f"  Finished in {time.time() - T0:.0f}s")
    if ERRORS:
        print("\n" + "!" * 72 + f"\nSYNC FAILED: {len(ERRORS)} problem(s)\n" + "!" * 72)
        for e_ in ERRORS:
            print("  -", e_)
        sys.exit(1)
    print("\nSYNC OK: every output matches the catalog and every copy is byte-identical to its source.")


if __name__ == "__main__":
    main()
