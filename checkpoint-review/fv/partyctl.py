import re,html,json
t=open('ev/senate_partydiv.html').read()
t=re.sub(r'<script.*?</script>','',t,flags=re.S)
txt=html.unescape(re.sub('<.*?>','\n',t)); txt=re.sub(r'\n\s*\n+','\n',txt)
sen={}
for m in re.finditer(r'(\d+)(?:st|nd|rd|th) Congress \((\d{4}).{1,4}?(\d{4})\)\s*\n(.*?)(?=-{20})',txt,flags=re.S):
    n=int(m.group(1)); body=m.group(4)
    mj=re.search(r'Majority Party[^:]*:\s*([A-Za-z]+)',body)
    sen.setdefault(n,(int(m.group(2)),mj.group(1) if mj else '?',body.strip()[:300]))
h=open('ev/house_partydiv.html').read(); h=re.sub(r'<script.*?</script>','',h,flags=re.S)
house={}; hdr=None
for r in re.findall(r'<tr.*?</tr>',h,flags=re.S):
    cells=[html.unescape(re.sub('<.*?>','',c)).strip() for c in re.findall(r'<t[dh].*?</t[dh]>',r,flags=re.S)]
    if cells and cells[0].startswith('Congress'): hdr=cells; continue
    m=re.match(r'(\d+)\w+ \((\d{4})',cells[0]) if cells else None
    if not m or not hdr: continue
    n=int(m.group(1))
    if 'Democrats' in hdr and 'Republicans' in hdr:
        d=int(re.sub(r'\D','',cells[hdr.index('Democrats')]) or 0); rp=int(re.sub(r'\D','',cells[hdr.index('Republicans')]) or 0)
        house[n]=(int(m.group(2)),'Democrats' if d>rp else 'Republicans',d,rp)
out={}
for n in range(35,120):
    s=sen.get(n); hh=house.get(n)
    out[n]={'start':hh[1-1] if hh else None,'house':hh[1] if hh else None,'senate':s[1] if s else None,'hs':hh[2:] if hh else None}
    print(n,hh,s[1] if s else None, (s[2].replace('\n',' | ')[:160] if s and n>=96 else ''))
json.dump(out,open('ev/partyctl.json','w'),indent=0)
