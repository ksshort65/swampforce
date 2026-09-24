import sys,re,html,subprocess
u=sys.argv[1]; pats=sys.argv[2:]
t=subprocess.run(["curl","-sL","-A","Mozilla/5.0","--max-time","40",u],capture_output=True).stdout.decode("utf-8","ignore")
t=re.sub(r'(?is)<(script|style).*?</\1>',' ',t); t=re.sub('<[^>]+>',' ',t); t=html.unescape(re.sub(r'\s+',' ',t))
for p in pats:
    for m in list(re.finditer(p,t))[:3]:
        print("…"+t[max(0,m.start()-250):m.end()+350]+"…\n")
