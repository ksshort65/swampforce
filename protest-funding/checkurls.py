import csv,subprocess,json,concurrent.futures as cf,random,os,sys
rows=list(csv.DictReader(open('sources.csv')))
st=json.load(open('raw/urlstatus.json')) if os.path.exists('raw/urlstatus.json') else {}
todo=[r['url'] for r in rows if not r['id'].startswith(('auto','org'))]
auto=[r['url'] for r in rows if r['id'].startswith(('auto','org'))]
if 'all' in sys.argv: todo+=auto
else:
  random.seed(1); todo+=random.sample(auto,25)
todo=[u for u in todo if st.get(u) not in ('200',)]
def chk(u):
    r=subprocess.run(['curl','-sL','-m','40','-o','/dev/null','-w','%{http_code}','-A','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36',u],capture_output=True,text=True)
    return u,r.stdout
with cf.ThreadPoolExecutor(6) as ex:
    for u,c in ex.map(chk,todo): st[u]=c; print(c,u,flush=True)
json.dump(st,open('raw/urlstatus.json','w'),indent=0)
