import re,sys
t=open(sys.argv[1]).read()
cues=[]; cur=None
for blk in t.split('\n\n'):
    m=re.search(r'(\d\d:\d\d:\d\d)\.\d+ -->',blk)
    if not m: continue
    lines=[l for l in blk.split('\n')[1:] if l.strip() and '-->' not in l]
    txt=re.sub(r'<[^>]+>','',' '.join(lines)).strip()
    cues.append((m.group(1),txt))
# dedupe rolling captions: build words with timestamps
out=[];last=''
for ts,txt in cues:
    if txt and txt!=last and not last.endswith(txt):
        # remove overlap
        add=txt
        if last and txt.startswith(last): add=txt[len(last):]
        out.append((ts,add.strip())); last=txt
open(sys.argv[2],'w').write('\n'.join(f'{a} {b}' for a,b in out))
