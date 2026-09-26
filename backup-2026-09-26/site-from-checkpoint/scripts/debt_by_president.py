import json, datetime as dt, urllib.request
H = "/workspace/site-from-checkpoint/midterm-data/"
hist = json.load(open(H + "treasury_hist_debt.json"))["data"]
pts = sorted((dt.date.fromisoformat(x["record_date"]), float(x["debt_outstanding_amt"])) for x in hist)
def interp(d):
    for (d0, v0), (d1, v1) in zip(pts, pts[1:]):
        if d0 <= d <= d1: return v0 + (v1 - v0) * ((d - d0).days / max(1, (d1 - d0).days))
B = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny"
def daily(d):
    j = json.load(urllib.request.urlopen(f"{B}?filter=record_date:lte:{d.isoformat()}&sort=-record_date&page%5Bsize%5D=1&fields=record_date,tot_pub_debt_out_amt", timeout=30))
    return float(j["data"][0]["tot_pub_debt_out_amt"]), j["data"][0]["record_date"]
def val(d):
    return (daily(d)[0], "daily") if d >= dt.date(1993, 4, 1) else (interp(d), "interpolated")
TERMS = [("Reagan", "R", 1981), ("Bush 41", "R", 1989), ("Clinton", "D", 1993), ("Bush 43", "R", 2001), ("Obama", "D", 2009),
         ("Trump I", "R", 2017), ("Biden", "D", 2021), ("Trump II", "R", 2025)]
END = dt.date(2026, 9, 17)
rows = []
for i, (n, p, y) in enumerate(TERMS):
    s = dt.date(y, 1, 20); e = dt.date(TERMS[i + 1][2], 1, 20) if i + 1 < len(TERMS) else END
    v0, m0 = val(s); v1, m1 = val(e)
    rows.append({"who": n, "party": p, "start": s.isoformat(), "end": e.isoformat(), "added_T": round((v1 - v0) / 1e12, 2), "method": f"{m0}->{m1}"})
json.dump({"as_of": END.isoformat(), "rows": rows}, open(H + "debt_by_president.json", "w"), indent=1)
for r in rows: print(r)
print("R", round(sum(r["added_T"] for r in rows if r["party"] == "R"), 2), "D", round(sum(r["added_T"] for r in rows if r["party"] == "D"), 2))
