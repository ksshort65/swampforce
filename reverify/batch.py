import sys,json,os,concurrent.futures as cf
sys.path.insert(0,'/workspace/reverify')
from fx import fetch,snip
LOG='/workspace/reverify/evidence/verif-log.jsonl'
def run(specs,w=220,workers=8):
    def one(s):
        iid,u,phs=s
        try: meta,txt=fetch(u)
        except Exception as e: return iid,u,{'code':'ERR','err':str(e)},{},0
        hits={p:snip(txt,p,w) for p in phs}
        return iid,u,meta,hits,len(txt)
    with cf.ThreadPoolExecutor(workers) as ex:
        for iid,u,meta,hits,tl in ex.map(one,specs):
            print(f"\n## #{iid} [{meta.get('code')}] tl={tl} {u[:140]}")
            for p,s in hits.items():
                print(f"  <<{p}>> {len(s)}")
                for x in s[:1]: print('     '+x)
            with open(LOG,'a') as f: f.write(json.dumps({'id':iid,'url':u,'code':meta.get('code'),'textlen':tl,'hits':{p:s[:1] for p,s in hits.items()}})+'\n')
if __name__=='__main__':
    specs=json.load(open(sys.argv[1])); run(specs,int(os.environ.get('W','220')))
