import json,datetime as dt,urllib.request
pc={int(k):v for k,v in json.load(open('/workspace/site-from-checkpoint/midterm-data/partyctl.json')).items()}
pc[65]['house']='Democrats'; pc[72]['house']='Democrats'  # organized by Dems (Clark 1917, Garner 1931)
hist=json.load(open('/workspace/site-from-checkpoint/midterm-data/treasury_hist_debt.json'))['data']
pts=sorted((dt.date.fromisoformat(x['record_date']),float(x['debt_outstanding_amt'])) for x in hist)
def interp(d):
    for (d0,v0),(d1,v1) in zip(pts,pts[1:]):
        if d0<=d<=d1: return v0+(v1-v0)*((d-d0).days/max(1,(d1-d0).days))
    return None
# daily for 1993+
B="https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny"
def daily(d):
    url=f"{B}?filter=record_date:lte:{d.isoformat()}&sort=-record_date&page%5Bsize%5D=1&fields=record_date,tot_pub_debt_out_amt"
    j=json.load(urllib.request.urlopen(url,timeout=30)); r=j['data'][0]; return float(r['tot_pub_debt_out_amt']),r['record_date']
def start(n):
    y=1789+2*(n-1)
    return dt.date(y,3,4) if n<=73 else dt.date(y,1,3)
tot={'R':0,'D':0,'S':0}; rows=[]
END=dt.date(2026,9,17)
for n in range(35,120):
    s=start(n); e=start(n+1) if n<119 else END
    def val(d):
        if d>=dt.date(1993,4,1): return daily(d)[0]
        return interp(d)
    v0=val(s); v1=val(e)
    h=pc[n]['house']; se=pc[n]['senate']
    if n==107: k='S'
    elif h==se=='Republicans': k='R'
    elif h==se=='Democrats': k='D'
    else: k='S'
    tot[k]+=v1-v0; rows.append((n,s.year,e.year,k,round((v1-v0)/1e9,1)))
import json as J; J.dump({"as_of":"2026-09-17","rows":rows,"totals_T":{k:round(v/1e12,3) for k,v in tot.items()}},open("/workspace/site-from-checkpoint/midterm-data/debt_by_control.json","w"),indent=0)
print({k:round(v/1e12,3) for k,v in tot.items()}, 'sum',round(sum(tot.values())/1e12,3))
print('1993-01-20 interp',interp(dt.date(1993,1,20))/1e12, '1981-01-20',interp(dt.date(1981,1,20))/1e12,'1989-01-20',interp(dt.date(1989,1,20))/1e12,'1977-01-20',interp(dt.date(1977,1,20))/1e12)
