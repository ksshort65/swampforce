import re,json
from pathlib import Path
EV=Path('/workspace/checkpoint-review/essays-verified')
idx=(EV/'INDEX.md').read_text()
rows=re.findall(r'^\| (\d+) \| \[([^\]]+)\]\([^)]+\) \| (.*?) \| (Cleared with fixes|Cleared as-is|Held) \|',idx,re.M)
skip={'find-them','that-is-not-why-they-are-elected','they-work-for-us'}
out=[];D=[]
for n,slug,title,st in rows:
    if st=='Held' or slug in skip: continue
    t=(EV/f'{slug}.md').read_text()
    series=re.search(r'- Series: (.+)',t).group(1).strip(); date=re.search(r'- Date: (.+)',t).group(1).strip()
    body=[l.strip() for l in t.splitlines() if l.strip() and not l.startswith(('Status:','_Sourcing','## ','- Slug','- Series','- Date'))]
    views=[];facts=[];ctx={}
    for l in body:
        if re.fullmatch(r'\*\*[^*]+\*\*',l): ctx={'row':l.strip('*')}; continue
        if l.startswith(('They ran:','The file:')): ctx[l[:8]]=l; continue
        if l.startswith('Record: '):
            facts.append('[rec] '+ctx.get('row','')+' | '+ctx.get('They ran',' ')+' | '+ctx.get('The file',' ')+' | '+l[8:]); continue
        if 'Our view' in l[:20] or l.startswith('> **Our view'):
            v=re.sub(r'^>?\s*\*\*Our view:\*\*\s*','',l); views.append(v)
            for s in re.split(r'(?<=[.!?”"])\s+(?=[A-Z“"\[])',v):
                if '](' in s: facts.append('[in-view] '+s)
            continue
        if l.startswith('###'): continue
        if l.startswith('- ') and 'http' in l and '](' not in l:
            facts.append('[src] '+l[2:]); continue
        for s in re.split(r'(?<=[.!?”"])\s+(?=[A-Z“"\[])',l):
            if '](' in s: facts.append(s)
    D.append(dict(n=int(n),slug=slug,title=title,series=series,date=date,views=views,facts=facts))
json.dump(D,open('/workspace/journal-pilot/digest/digest.json','w'),indent=0,ensure_ascii=False)
# compact text dump
with open('/workspace/journal-pilot/digest/digest.txt','w') as f:
    for d in D:
        f.write(f"\n#### {d['n']} {d['slug']} | {d['title']} | {d['series']} | {d['date']}\n")
        for i,v in enumerate(d['views'][:4]): f.write(f"V{i}: {v[:260]}\n")
        for i,s in enumerate(d['facts'][:10]):
            s2=re.sub(r'\]\((https?://[^)]+)\)',lambda m:']<'+re.sub(r'^https?://(www\.)?','',m.group(1))[:40]+'>',s)
            s2=re.sub(r'(?<![<(])https?://(www\.)?(\S{0,40})\S*',r'<\2>',s2)
            f.write(f"F{i}: {s2[:330]}\n")
print(len(D)); import collections; print(collections.Counter(len(d['facts'])==0 for d in D))
