"""Fix list item 1: rows with no correction AND no fact-check on file get Correction_Visibility "Never corrected"."""
import csv, io
from pathlib import Path
TS = Path("/workspace/term-split")
OLD, NEW = "Never corrected \u2014 fact-checked only", "Never corrected"
TARGET = {"first-term": {"9", "14", "15", "27", "66"}, "later-second-term": {"252", "253"}}
for base, ids in TARGET.items():
    p = TS / f"{base}-trump-admin-media-deception.csv"
    raw = p.read_bytes()
    rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"), newline="")))
    cols = list(rows[0].keys())
    def dump(rs):
        b = io.StringIO(newline=""); w = csv.DictWriter(b, fieldnames=cols, lineterminator="\r\n"); w.writeheader(); [w.writerow(r) for r in rs]
        return ("\ufeff" + b.getvalue()).encode("utf-8")
    assert dump(rows) == raw, "round-trip failed"
    hit = 0
    for r in rows:
        if r["Item_ID"] in ids:
            assert r["Correction_Visibility"] == OLD, (r["Item_ID"], r["Correction_Visibility"])
            r["Correction_Visibility"] = NEW; hit += 1
    assert hit == len(ids)
    p.write_bytes(dump(rows)); print(base, "relabeled", sorted(ids, key=int))
