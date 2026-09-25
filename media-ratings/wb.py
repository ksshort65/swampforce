import sys,re,html,subprocess
u,out=sys.argv[1],sys.argv[2]
r=subprocess.run(['curl','-sL','-A','Mozilla/5.0',u],capture_output=True,text=True,errors='ignore')
t=re.sub(r'<script.*?</script>|<style.*?</style>','',r.stdout,flags=re.S)
t=re.sub('<[^>]+>','\n',t); t=html.unescape(t); t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
open(out,'w').write(t); print(out,len(t))
