import json,subprocess,sys
def q(name,codes):
    body={"filters":{"recipient_search_text":[name],"award_type_codes":codes,"time_period":[{"start_date":"2008-10-01","end_date":"2026-09-30"}]},
          "fields":["Award ID","Recipient Name","Award Amount","Awarding Agency","Start Date","Description","recipient_id","generated_internal_id","Recipient UEI"],"limit":100,"page":1,"sort":"Award Amount","order":"desc"}
    r=subprocess.run(["curl","-s","-X","POST","-H","Content-Type: application/json","https://api.usaspending.gov/api/v2/search/spending_by_award/","-d",json.dumps(body)],capture_output=True,text=True).stdout
    return json.loads(r)
names=sys.argv[1:]
G=["02","03","04","05"]; C=["A","B","C","D"]; L=["07","08"]; O=["06","10"]
for n in names:
    out={}
    for lab,codes in [("grants",G),("contracts",C),("loans",L),("other",O)]:
        try: out[lab]=q(n,codes).get('results',[])
        except Exception as e: out[lab]=str(e)
    json.dump(out,open(f"raw/usa/{n.replace(' ','_').replace('/','_')}.json","w"))
    for lab,rs in out.items():
        if isinstance(rs,list):
            tot=sum((x.get('Award Amount') or 0) for x in rs)
            rn=sorted(set(x['Recipient Name'] for x in rs))
            print(f"{n} | {lab} | n={len(rs)} | ${tot:,.0f} | {'; '.join(rn)[:200]}")
