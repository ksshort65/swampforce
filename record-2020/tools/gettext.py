import sys,re,html,subprocess
url=sys.argv[1]; n=int(sys.argv[2]) if len(sys.argv)>2 else 4000
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
r=subprocess.run(["curl","-s","-L","--max-time","40","-A",UA,"-w","\n__CODE__%{http_code} %{content_type}",url],capture_output=True)
raw=r.stdout.decode('utf-8','ignore'); body,_,code=raw.rpartition("\n__CODE__")
print("HTTP",code)
t=re.sub(r'(?is)<(script|style|noscript).*?</\1>','',body)
t=re.sub(r'<[^>]+>',' ',t); t=re.sub(r'\s+',' ',html.unescape(t))
kw=sys.argv[3] if len(sys.argv)>3 else None
if kw:
    for m in re.finditer(kw,t,re.I):
        print('...',t[max(0,m.start()-400):m.end()+600],'...\n')
else: print(t[:n])
