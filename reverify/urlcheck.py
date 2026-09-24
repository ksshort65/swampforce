import json,re,subprocess,sys,concurrent.futures as cf
from load import load
rows=load()
urls=set()
for r in rows:
    for f in ['Truth_Source_URL','Primary_Source_URL','Notes']:
        for u in re.findall(r'https?://[^\s;,\'"<>]+',r[f]):
            urls.add(u.rstrip(').'))
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def chk(u):
    p=subprocess.run(['curl','-sSL','-A',UA,'--max-time','40','-o','/dev/null','-w','%{http_code} %{size_download} %{url_effective}',u],capture_output=True,text=True)
    return u,p.stdout.strip(),p.stderr.strip()[:200]
res={}
with cf.ThreadPoolExecutor(12) as ex:
    for u,o,e in ex.map(chk,sorted(urls)):
        res[u]={'out':o,'err':e}
json.dump(res,open('url-status.json','w'),indent=1)
print(len(res))
