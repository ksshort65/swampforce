import sys,re,html,subprocess
u=sys.argv[1]
h=subprocess.run(['timeout','90','google-chrome','--headless=new','--no-sandbox','--disable-gpu','--virtual-time-budget=25000','--dump-dom',u],capture_output=True).stdout.decode('utf-8','ignore')
if len(sys.argv)>2: open(sys.argv[2],'w').write(h)
links=re.findall(r'href="(/Download/[^"]+)"',h)
t=re.sub(r'(?is)<(script|style).*?</\1>',' ',h);t=re.sub('<[^>]+>',' ',t);t=html.unescape(re.sub(r'\s+',' ',t))
i=t.find('Back to Search');print(t[i:i+3500] if i>=0 else t[:3500]);print(sorted(set(links))[:20])
