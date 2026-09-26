#!/usr/bin/env python3
"""number_audit.py: extract displayed numbers from the built public_html pages, grouped by label/context, and flag
(1) the same label shown with different values, (2) the same chart id with different data on different pages,
(3) table/drop-down totals that don't equal the sum of their rows, (4) tile values that disagree with their chart slice,
(5) near-duplicate free-text contexts with different numbers (review list; noisy by design).
Usage: /workspace/.venv/bin/python scripts/number_audit.py [--json out.json]
"""
from __future__ import annotations
import json, re, sys
from collections import defaultdict
from decimal import Decimal
from pathlib import Path
from bs4 import BeautifulSoup

import os
PUB = Path(os.environ.get("PUB") or Path(__file__).resolve().parent.parent / "public_html")
NUM = re.compile(r"(?<![\w.])(?:\$)?\d[\d,]*(?:\.\d+)?(?:\s?(?:%|T\b|B\b|M\b|K\b| trillion| billion| million))?")


def norm_label(s):
    s = re.sub(r"\s+", " ", s or "").strip().lower()
    s = re.sub(r"[“”\"'’.,:;()·]", "", s)
    return s


def to_val(tok):
    """'$11.00T' -> 11e12 (Decimal), '9.57 trillion' -> ..., '62' -> 62, '3.4%' -> 3.4 (pct)"""
    t = tok.replace(",", "").replace("$", "").strip()
    mult = Decimal(1); unit = ""
    for suf, m in ((" trillion", 10**12), ("T", 10**12), (" billion", 10**9), ("B", 10**9), (" million", 10**6), ("M", 10**6), ("K", 10**3)):
        if t.endswith(suf):
            t = t[: -len(suf)].strip(); mult = Decimal(m); break
    if t.endswith("%"):
        t = t[:-1]; unit = "%"
    try:
        return Decimal(t) * mult, unit
    except Exception:
        return None, unit


def same(a, b):
    """equal within display rounding: compare at the coarser precision of the two"""
    (va, _), (vb, _) = to_val(a), to_val(b)
    if va is None or vb is None:
        return a == b
    if va == vb:
        return True
    big = max(abs(va), abs(vb))
    return big and abs(va - vb) / big < Decimal("0.0051")  # 11.00T vs 11T ok; 12.47 vs 9.57 not


def page_items(path):
    soup = BeautifulSoup(path.read_text(errors="ignore"), "lxml")
    for s in soup(["script", "style", "noscript"]):
        if s.name == "script" and "SF_CHARTS" in (s.string or ""):
            continue
        s.extract() if s.name != "script" else None
    items = []  # (kind, label, value, context)
    for t in soup.select(".stat, .stat-tile"):
        n = t.select_one(".num"); l = t.select_one(".lbl"); sub = t.select_one(".sub")
        if n and l:
            items.append(("tile", norm_label(l.get_text(" ")), n.get_text(" ").strip(), (sub.get_text(" ").strip() if sub else "")))
    for t in soup.select(".mt-debt"):
        items.append(("tile", norm_label(t.select_one(".mt-debt-lbl").get_text(" ")), t.select_one(".mt-debt-num").get_text().strip(), "mt-debt"))
    for t in soup.select(".mt-cmp"):
        items.append(("cmp", norm_label(t.strong.get_text()), t.select_one(".mt-cmp-debt").get_text().split("·")[0].strip(), "compare grid"))
    for t in soup.select(".mt-hb"):
        items.append(("homebar", norm_label(t.get_text(" ").replace(t.b.get_text(), "")), t.b.get_text().strip(), "home bar"))
    for t in soup.select(".mt-ptr"):
        items.append(("pointer", norm_label(t.select_one(".mt-ptr-lbl").get_text()), t.select_one(".mt-ptr-num").get_text().strip(), "pointer"))
    charts = []
    for s in soup.find_all("script"):
        m = re.search(r"window\.SF_CHARTS=(\[.*?\]);", s.string or "", re.S)
        if m:
            charts = json.loads(m.group(1))
    titles = {c["id"]: c.get("aria-label", "") for c in soup.find_all("canvas") if c.get("id")}
    # tables with a total row
    tables = []
    for tb in soup.find_all("table"):
        rows = [[td.get_text(" ").strip() for td in tr.find_all(["td", "th"])] for tr in tb.find_all("tr")]
        tables.append(rows)
    text = soup.get_text(" ")
    return items, charts, titles, tables, re.sub(r"\s+", " ", text)


CHECKED = []


def main():
    pages = sorted(PUB.glob("*.html"))
    by_label = defaultdict(list); by_chart = defaultdict(list); problems = []; ctx = defaultdict(set)
    for p in pages:
        items, charts, titles, tables, text = page_items(p)
        for kind, lab, val, c in items:
            by_label[lab].append((val, p.name, kind, c))
        for ch in charts:
            by_chart[ch["id"]].append((json.dumps(ch.get("data")), json.dumps(ch.get("labels")), p.name, titles.get(ch["id"], "")))
        # tile vs chart slice for the Congress debt doughnut
        chd = {c["id"]: c for c in charts}
        if "mt-debt-all" in chd:
            for lab, sl in zip(chd["mt-debt-all"]["labels"], chd["mt-debt-all"]["data"]):
                for kind, l2, val, c in items:
                    if kind in ("tile", "cmp", "homebar") and norm_label(lab).split()[0] in l2 and ("control" in l2 or "split" in l2) and "debt" in (l2 + c + "debt"):
                        v, _ = to_val(val)
                        if v is not None and abs(v / 10**12 - Decimal(str(sl))) > Decimal("0.005") and "$" in val and "T" in val:
                            problems.append(f"{p.name}: '{l2}' shows {val} but chart mt-debt-all slice '{lab}' = {sl}")
        # table total rows
        for rows in tables:
            for i, r in enumerate(rows):
                if r and re.match(r"(?i)^total", r[0]) and i > 1:
                    for col in range(1, len(r)):
                        tv, _ = to_val(re.split(r"\s*=\s*", r[col])[0]) if r[col] else (None, "")
                        if tv is None:
                            continue
                        vals = []
                        for rr in rows[1:i]:
                            j = col if len(rr) == len(r) else col + (len(rr) - len(r))
                            if 0 <= j < len(rr):
                                v, _ = to_val(rr[j]) if NUM.fullmatch(rr[j].strip() or "x") else (None, "")
                                if v is not None:
                                    vals.append(v)
                        if vals:
                            CHECKED.append((p.name, r[col], len(vals)))
                        if vals and abs(sum(vals) - tv) > max(Decimal("0.0001") * abs(tv), Decimal("0.05") * 10**9 if tv > 10**8 else Decimal("0.5")):
                            problems.append(f"{p.name}: table total {r[col]!r} != row sum {sum(vals)} (header {rows[0]})")
        # free text contexts: number + following 4 words
        for m in NUM.finditer(text):
            tok = m.group(0).strip()
            if re.fullmatch(r"\d{4}", tok) or re.fullmatch(r"\d{1,2}", tok):
                continue
            after = " ".join(re.findall(r"[A-Za-z]+", text[m.end(): m.end() + 60])[:4]).lower()
            if len(after.split()) >= 3:
                ctx[after].add((tok, p.name))
    report = {"label_conflicts": [], "chart_conflicts": [], "sum_problems": problems, "text_review": []}
    for lab, vs in sorted(by_label.items()):
        vals = [v for v, *_ in vs]
        if any(not same(vals[0], v) for v in vals[1:]):
            report["label_conflicts"].append({"label": lab, "values": sorted(set((v, pg, k) for v, pg, k, _ in vs))})
    for cid, vs in sorted(by_chart.items()):
        if len(set((d, l) for d, l, *_ in vs)) > 1:
            report["chart_conflicts"].append({"chart": cid, "variants": sorted(set(vs))})
    for after, s in sorted(ctx.items()):
        toks = {t for t, _ in s}
        if len(toks) > 1 and any(not same(a, b) for a in toks for b in toks):
            report["text_review"].append({"context": after, "values": sorted(s)})
    out = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None
    if out:
        Path(out).write_text(json.dumps(report, indent=1, default=str))
    print(f"pages {len(pages)} | label conflicts {len(report['label_conflicts'])} | chart conflicts {len(report['chart_conflicts'])} | "
          f"sum problems {len(problems)} (total rows checked {len(CHECKED)}) | text contexts to review {len(report['text_review'])}")
    for c in report["label_conflicts"]:
        print("LABEL", c["label"], "->", c["values"])
    for c in report["chart_conflicts"]:
        print("CHART", c["chart"], "->", c["variants"])
    for pr in problems:
        print("SUM", pr)
    return report


if __name__ == "__main__":
    main()
