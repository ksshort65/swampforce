"""Debt added under each president (administration), Mar 4, 1857 to the as-of date. Treasury Historical Debt Outstanding
(fiscal-year-end, straight-line between year-ends before Apr 1993) + Debt to the Penny (daily, Apr 1993 on).
Andrew Johnson (National Union ticket, a Democrat) is counted as D. Writes midterm-data/debt_by_president_full.json."""
import json, datetime as dt, urllib.request
H = "/workspace/site-from-checkpoint/midterm-data/"
pts = sorted((dt.date.fromisoformat(x["record_date"]), float(x["debt_outstanding_amt"])) for x in json.load(open(H + "treasury_hist_debt.json"))["data"])
def interp(d):
    for (d0, v0), (d1, v1) in zip(pts, pts[1:]):
        if d0 <= d <= d1: return v0 + (v1 - v0) * ((d - d0).days / max(1, (d1 - d0).days))
B = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny"
def val(d):
    if d < dt.date(1993, 4, 1): return interp(d)
    j = json.load(urllib.request.urlopen(f"{B}?filter=record_date:lte:{d.isoformat()}&sort=-record_date&page%5Bsize%5D=1&fields=record_date,tot_pub_debt_out_amt", timeout=30))
    return float(j["data"][0]["tot_pub_debt_out_amt"])
D = dt.date
T = [("Buchanan", "D", D(1857,3,4)), ("Lincoln", "R", D(1861,3,4)), ("A. Johnson", "D", D(1865,4,15)), ("Grant", "R", D(1869,3,4)),
     ("Hayes", "R", D(1877,3,4)), ("Garfield", "R", D(1881,3,4)), ("Arthur", "R", D(1881,9,19)), ("Cleveland", "D", D(1885,3,4)),
     ("B. Harrison", "R", D(1889,3,4)), ("Cleveland", "D", D(1893,3,4)), ("McKinley", "R", D(1897,3,4)), ("T. Roosevelt", "R", D(1901,9,14)),
     ("Taft", "R", D(1909,3,4)), ("Wilson", "D", D(1913,3,4)), ("Harding", "R", D(1921,3,4)), ("Coolidge", "R", D(1923,8,2)),
     ("Hoover", "R", D(1929,3,4)), ("F. Roosevelt", "D", D(1933,3,4)), ("Truman", "D", D(1945,4,12)), ("Eisenhower", "R", D(1953,1,20)),
     ("Kennedy", "D", D(1961,1,20)), ("L. Johnson", "D", D(1963,11,22)), ("Nixon", "R", D(1969,1,20)), ("Ford", "R", D(1974,8,9)),
     ("Carter", "D", D(1977,1,20)), ("Reagan", "R", D(1981,1,20)), ("Bush 41", "R", D(1989,1,20)), ("Clinton", "D", D(1993,1,20)),
     ("Bush 43", "R", D(2001,1,20)), ("Obama", "D", D(2009,1,20)), ("Trump I", "R", D(2017,1,20)), ("Biden", "D", D(2021,1,20)),
     ("Trump II", "R", D(2025,1,20))]
END = D(2026, 9, 24)
rows = []
for i, (n, p, s) in enumerate(T):
    e = T[i + 1][2] if i + 1 < len(T) else END
    v0, v1 = val(s), val(e)
    rows.append({"who": n, "party": p, "start": s.isoformat(), "end": e.isoformat(), "inherited_B": round(v0 / 1e9, 1), "added_B": round((v1 - v0) / 1e9, 1)})
tot = {k: round(sum(r["added_B"] for r in rows if r["party"] == k) / 1000, 3) for k in ("R", "D")}
json.dump({"as_of": END.isoformat(), "start": "1857-03-04", "rows": rows, "totals_T": tot}, open(H + "debt_by_president_full.json", "w"), indent=1)
print(tot, round(sum(tot.values()), 3))
