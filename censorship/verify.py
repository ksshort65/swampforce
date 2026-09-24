import subprocess, json, csv, sys
sys.path.insert(0,'.')
from build_sources import S, TW
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
res={}
def curl(u):
    r=subprocess.run(['curl','-sL','-A',UA,'-m','45','-o','/dev/null','-w','%{http_code}',u],capture_output=True,text=True)
    return r.stdout.strip()
for k,(u,t,ty,d,m) in S.items():
    code=curl(u)
    res[k]=code
    print(k,code,m,flush=True)
for k,(user,tid,desc) in TW.items():
    r=subprocess.run(['curl','-s','-m','30',f'https://cdn.syndication.twimg.com/tweet-result?id={tid}&token=a'],capture_output=True,text=True)
    try:
        j=json.loads(r.stdout); ok=j['user']['screen_name'].lower()==user.lower(); res[k]=f"tweet-ok {j['created_at']}" if ok else 'tweet-mismatch'
    except Exception as e: res[k]='tweet-fail'
    print(k,res[k],flush=True)
json.dump(res,open('verify_results.json','w'),indent=1)
