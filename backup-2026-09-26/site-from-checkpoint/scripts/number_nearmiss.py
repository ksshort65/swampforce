#!/usr/bin/env python3
"""number_nearmiss.py: companion to number_audit.py. Finds the same figure told two ways across the built site:
money / percent / large counts whose values are close (within 15%) but not equal, with overlapping context words.
Prints candidate pairs for human review (rounding variants are listed separately from real conflicts)."""
import os, re, sys, json
from pathlib import Path
from bs4 import BeautifulSoup
from collections import defaultdict
PUB = Path(os.environ.get("PUB") or Path(__file__).resolve().parent.parent / "public_html")
TOK = re.compile(r"(?<![\w.$])(\$?)(\d[\d,]*(?:\.\d+)?)(\s?(?:%|percent|T\b|B\b|M\b| trillion| billion| million))?")
STOP = set("that this with from have were their they them what when which while would about after before under over into also than more most only each other such these those there where being been some said says your will just like dont does year years page open record source".split())
WIDE = float(os.environ.get("WIDE", "1.15")); MINSH = int(os.environ.get("MINSH", "4")); MINOV = float(os.environ.get("MINOV", "0.35")); CROSS = bool(os.environ.get("CROSS"))
MULT = {"t": 1e12, "trillion": 1e12, "b": 1e9, "billion": 1e9, "m": 1e6, "million": 1e6}


def toks(text, page):
    words = [(m.start(), m.group(0).lower()) for m in re.finditer(r"[A-Za-z]{4,}", text)]
    out = []
    for m in TOK.finditer(text):
        dollar, num, unit = m.group(1), m.group(2), (m.group(3) or "").strip().lower()
        raw = m.group(0).strip()
        try:
            v = float(num.replace(",", ""))
        except ValueError:
            continue
        if unit in ("%", "percent"):
            kind = "pct"
        elif unit in MULT:
            v *= MULT[unit]; kind = "usd" if dollar else "cnt"
        elif dollar:
            kind = "usd"
        elif "," in num and v >= 1000:
            kind = "cnt"
        else:
            continue
        if kind == "cnt" and 1900 <= v <= 2100:
            continue
        lo, hi = m.start() - 90, m.end() + 90
        kw = {w for p, w in words if lo <= p <= hi and w not in STOP}
        out.append((kind, v, raw, page, frozenset(kw), text[max(0, m.start() - 70): m.end() + 50].replace("\n", " ")))
    return out


def main():
    allt = []
    for p in sorted(PUB.glob("*.html")):
        soup = BeautifulSoup(p.read_text(errors="ignore"), "lxml")
        for s in soup(["script", "style", "noscript", "table"]):  # tables = long data lists, skip
            s.extract()
        allt += toks(re.sub(r"\s+", " ", soup.get_text(" ")), p.name)
    byk = defaultdict(list)
    for t in allt:
        byk[t[0]].append(t)
    seen = set(); res = []
    for kind, L in byk.items():
        L.sort(key=lambda t: t[1])
        for i, a in enumerate(L):
            for b in L[i + 1:]:
                if a[1] == 0 or b[1] > a[1] * WIDE:
                    break
                if b[1] == a[1]:
                    continue
                shared = a[4] & b[4]
                if len(shared) >= MINSH and len(shared) / max(1, min(len(a[4]), len(b[4]))) >= MINOV and (not CROSS or a[3] != b[3]):
                    key = (a[2], b[2], a[3], b[3])
                    if key in seen:
                        continue
                    seen.add(key)
                    rel = abs(b[1] - a[1]) / b[1]
                    res.append({"kind": kind, "a": a[2], "a_page": a[3], "b": b[2], "b_page": b[3], "rel_diff": round(rel, 4),
                                "shared": sorted(shared)[:12], "a_ctx": a[5], "b_ctx": b[5]})
    res.sort(key=lambda r: (r["a_page"], r["a"]))
    out = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None
    if out:
        Path(out).write_text(json.dumps(res, indent=1))
    print("tokens", len(allt), "candidate pairs", len(res))
    for r in res:
        print(f'{r["a"]:>14} [{r["a_page"]}]  vs  {r["b"]:>14} [{r["b_page"]}]  diff {r["rel_diff"]:.3%}\n    A: …{r["a_ctx"]}…\n    B: …{r["b_ctx"]}…')


if __name__ == "__main__":
    main()
