import re,html,subprocess,sys,json,os
UA=["-A","Mozilla/5.0"]
def get(u):
    return subprocess.run(["curl","-sL","--compressed"]+UA+[u],capture_output=True).stdout.decode('utf-8','ignore')
def filings(ein):
    s=get(f"https://projects.propublica.org/nonprofits/organizations/{ein}")
    open(f"raw/pporg_{ein}.html","w").write(s)
    ids=re.findall(r'/nonprofits/organizations/%s/(\d+)/full'%ein,s)
    return list(dict.fromkeys(ids))
def schedules(oid,ein):
    s=get(f"https://projects.propublica.org/nonprofits/organizations/{ein}/{oid}/full")
    per=re.search(r'Full text of (\S+) filing for fiscal year ending ([A-Za-z.]+ \d{4})',s)
    return re.findall(r"full_text/%s/(\w+)'"%oid,s), (per.groups() if per else None)
def text(oid,sched):
    s=get(f"https://projects.propublica.org/nonprofits/full_text/{oid}/{sched}")
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S)
    t=re.sub(r'<[^>]+>','|',t); t=html.unescape(t); t=re.sub(r'[ \t\r\n]+',' ',t); t=re.sub(r'(\|\s*)+','|',t)
    return t
if __name__=="__main__":
    ein=sys.argv[1]
    for oid in filings(ein):
        sc,per=schedules(oid,ein)
        print(oid,per,sc)

def grants(oid,sched):
    s=get(f"https://projects.propublica.org/nonprofits/full_text/{oid}/{sched}")
    spans=re.findall(r'<span[^>]*id="(/AppData[^"]+)"[^>]*>(.*?)</span>',s,re.S)
    rows={}
    grp='RecipientTable' if 'ScheduleI' in sched else 'GrantOrContributionPdDurYrGrp'
    for pid,val in spans:
        m=re.search(grp+r'\[(\d+)\]/(.*)',pid)
        if not m: continue
        k=int(m.group(1)); field=re.sub(r'\[\d+\]','',m.group(2))
        v=html.unescape(re.sub(r'<[^>]+>','',val)).strip()
        r=rows.setdefault(k,{})
        r.setdefault(field,v)
    out=[]
    for k,r in sorted(rows.items()):
        name=' '.join(v for f,v in r.items() if 'BusinessNameLine' in f or f.endswith('PersonNm')) 
        amt=r.get('CashGrantAmt') or r.get('Amt') or ''
        purpose=r.get('PurposeOfGrantTxt') or r.get('GrantOrContributionPurposeTxt') or ''
        out.append(dict(name=name,ein=r.get('RecipientEIN',''),amount=int(re.sub(r'[^\d]','',amt) or 0),purpose=purpose,irc=r.get('IRCSectionDesc',''),city=r.get('USAddress/CityNm','')))
    return out
def all_grants(ein,maxf=6):
    res=[]
    for oid in filings(ein)[:maxf*2]:
        sc,per=schedules(oid,ein)
        for s in sc:
            if s in ('IRS990ScheduleI','IRS990PF'):
                for g in grants(oid,s):
                    g.update(oid=oid,form=per[0] if per else '',period=per[1] if per else '',sched=s,funder_ein=ein); res.append(g)
    return res

def part1(oid,sched='IRS990'):
    s=get(f"https://projects.propublica.org/nonprofits/full_text/{oid}/{sched}")
    d={}
    for pid,val in re.findall(r'<span[^>]*id="(/AppData[^"]+)"[^>]*>(.*?)</span>',s,re.S):
        k=re.sub(r'\[\d+\]','',pid).split('/')[-1]
        if k in ('CYTotalRevenueAmt','CYContributionsGrantsAmt','CYGrantsAndSimilarPaidAmt','CYTotalExpensesAmt','TotalRevenueAmt','TotalContributionsAmt','ContriRcvdRevAndExpnssAmt','TotalRevAndExpnssAmt','ContributionsGiftsGrantsEtcAmt','TotalExpensesRevAndExpnssAmt') and k not in d:
            d[k]=re.sub(r'<[^>]+>','',val).strip()
    return d
def latest_990(ein,n=3):
    out=[]
    for oid in filings(ein):
        sc,per=schedules(oid,ein)
        if per and per[0] in ('990','990PF','990EZ'):
            sched={'990':'IRS990','990PF':'IRS990PF','990EZ':'IRS990EZ'}[per[0]]
            out.append((oid,per,part1(oid,sched)))
            if len(out)>=n: break
    return out
