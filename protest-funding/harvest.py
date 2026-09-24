import pp,json,sys,re
eins=sys.argv[1:]
with open(__import__('os').environ.get('OUT','raw/grants.jsonl'),'a') as f:
  for ein in eins:
    try:
      n=0
      for oid in pp.filings(ein):
        sc,per=pp.schedules(oid,ein)
        if not per: continue
        yr=int(per[1][-4:])
        if yr<int(__import__("os").environ.get("MINYR","2019")): continue
        for s in sc:
          if s in ('IRS990ScheduleI','IRS990PF'):
            for g in pp.grants(oid,s):
              g.update(oid=oid,form=per[0],period=per[1],sched=s,funder_ein=ein); f.write(json.dumps(g)+'\n'); n+=1
      f.flush(); print(ein,n,flush=True)
    except Exception as e: print(ein,'ERR',e,flush=True)
