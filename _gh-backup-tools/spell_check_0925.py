import re,html,glob,collections
from spellchecker import SpellChecker
sp=SpellChecker()
cnt=collections.Counter(); where={}
for f in glob.glob('/workspace/site-from-checkpoint/public_html/*.html'):
    t=open(f,encoding='utf-8').read()
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S); t=html.unescape(re.sub(r'<[^>]+>',' ',t))
    for w in re.findall(r"\b[a-z][a-z']{3,}\b",t):  # lowercase words only: skips names/acronyms
        w=w.strip("'")
        if w.endswith("'s"): w=w[:-2]
        cnt[w]+=1; where.setdefault(w,f.split('/')[-1])
unk=sp.unknown(list(cnt))
for w in sorted(unk,key=lambda w:cnt[w]):
    if cnt[w]<=2: print(w,cnt[w],where[w],sp.correction(w))
