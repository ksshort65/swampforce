import json,subprocess,sys,urllib.parse,collections,time
def get(u):
    for i in range(6):
        r=subprocess.run(["curl","-s","-m","90",u],capture_output=True,text=True).stdout
        try:
            d=json.loads(r)
            if 'results' in d: return d
            w=d.get('detail','')
            time.sleep(20)
        except: time.sleep(10)
    return {}
out={}
for name in sys.argv[1:]:
    tot=collections.defaultdict(float); regs=set(); ex=[]
    for yr in range(2020,2027):
        u=f"https://lda.gov/api/v1/filings/?registrant_name={urllib.parse.quote(name)}&filing_year={yr}&page_size=25"
        while u:
            d=get(u); time.sleep(2)
            for f in d.get('results',[]):
                if not (f['filing_type'].startswith('Q') or f['filing_type'] in ('1T','2T','3T','4T','Q1Y')) : 
                    if f['filing_type'] not in ('Q1','Q2','Q3','Q4'): pass
                if f['filing_type'] in ('RR','RA','MM','1A','2A','3A','4A','1@','2@','3@','4@'): continue
                if f['registrant']['name']!=f['client']['name']: continue
                v=float(f.get('expenses') or 0)+float(f.get('income') or 0)
                tot[yr]+=v; regs.add(f['registrant']['name'])
                if not ex: ex.append(f['filing_document_url'])
            u=d.get('next')
    out[name]=dict(totals=dict(tot),registrants=sorted(regs),example=ex)
    print(name,'|',{k:round(v) for k,v in sorted(tot.items())},'|',round(sum(tot.values())),'|',sorted(regs),'|',ex,flush=True)
json.dump(out,open('raw/lda/lda2.json','w'),indent=1)
