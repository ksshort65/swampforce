import json,subprocess,sys,urllib.parse,collections,time
def get(u):
    for i in range(3):
        r=subprocess.run(["curl","-s","-m","90",u],capture_output=True,text=True).stdout
        try: return json.loads(r)
        except: time.sleep(3)
    return {}
out={}
for name in sys.argv[1:]:
    tot=collections.defaultdict(float); regs=set(); clients=set(); n=0
    for yr in range(2020,2027):
        u=f"https://lda.gov/api/v1/filings/?client_name={urllib.parse.quote(name)}&filing_year={yr}&page_size=25"
        while u:
            d=get(u)
            for f in d.get('results',[]):
                if f['filing_type'] in ('RR','RA') : continue
                v=float(f.get('income') or 0)+float(f.get('expenses') or 0)
                tot[yr]+=v; n+=1; regs.add(f['registrant']['name']); clients.add(f['client']['name'])
            u=d.get('next')
    out[name]=dict(totals=dict(tot),n=n,registrants=sorted(regs)[:8],clients=sorted(clients))
    print(name,'|',{k:round(v) for k,v in tot.items()},'|',sum(tot.values()),'|',sorted(clients)[:5],flush=True)
json.dump(out,open('raw/lda/lda_'+str(int(time.time()))+'.json','w'))
