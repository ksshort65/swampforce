import re, csv, os, datetime, collections, json
BANDS={1001:15000,15001:50000,50001:100000,100001:250000,250001:500000,500001:1000000,1000001:5000000,5000001:25000000,25000001:50000000}
idx={}
for y in (2025,2026):
    for r in csv.DictReader(open(f'house/fd{y}/{y}FD.txt',encoding='utf-8-sig'),delimiter='\t'):
        if r['FilingType']!='P': continue
        idx[r['DocID'].strip()]=dict(year=y,name=(r['Prefix']+' '+r['First']+' '+r['Last']+' '+r['Suffix']).strip(),last=r['Last'],first=r['First'],state=r['StateDst'],filed=r['FilingDate'])
pat=re.compile(r'(?P<type>\bP\b|\bS \(partial\)|\bS\b|\bE\b)\s+(?P<td>\d{2}/\d{2}/\d{4})\s*(?P<nd>\d{2}/\d{2}/\d{4})\s+(?P<amt>Spouse/DC Over|\$[\d,]+|Over)')
tx=[]; paper=[]; parsed_docs=0; zero_docs=[]
for doc,m in idx.items():
    if not doc.startswith('2'):
        paper.append((doc,m)); continue
    fn=f"house/txt{m['year']}/{doc}.txt"
    t=open(fn,errors='ignore').read()
    lines=t.split('\n')
    n=0
    for i,line in enumerate(lines):
        for mm in pat.finditer(line):
            # status: look ahead a few lines for 'F S :' status
            status='New'
            for k in range(i+1,min(i+5,len(lines))):
                s=re.search(r'F\s+S\s+:\s*(\w+)',lines[k])
                if s: status=s.group(1); break
            pre=line[:mm.start()].strip()
            nxt=lines[i+1].strip() if i+1<len(lines) else ''
            asset=pre
            if nxt and not nxt.startswith('F ') and not re.search(r'\d{2}/\d{2}/\d{4}',nxt): asset=pre+' '+re.sub(r'\s{2,}.*$','',nxt)
            owner=''
            om=re.match(r'^(SP|JT|DC)\s+(.*)$',asset)
            if om: owner,asset=om.group(1),om.group(2)
            a=mm.group('amt')
            if a.startswith('Spouse'):
                lo,hi=1000001,None
            elif a=='Over':
                lo,hi=50000001,None
            else:
                lo=int(a.replace('$','').replace(',',''))
                hi=BANDS.get(lo)
                if hi is None:
                    hi=lo  # exact dollar amount reported instead of a band
            tk=re.search(r'\(([A-Z][A-Z0-9.\-]{0,6})\)',asset)
            tx.append(dict(doc=doc,member=m['name'],last=m['last'],state=m['state'],filed=m['filed'],type=mm.group('type'),tdate=mm.group('td'),ndate=mm.group('nd'),min=lo,max=hi,owner=owner,asset=asset[:120],ticker=tk.group(1) if tk else '',status=status))
            n+=1
    if n==0: zero_docs.append(doc)
    parsed_docs+=1
def d(s): return datetime.datetime.strptime(s,'%m/%d/%Y').date()
for x in tx:
    x['days_tx_to_filed']=(d(x['filed'])-d(x['tdate'])).days
    x['days_notif_to_filed']=(d(x['filed'])-d(x['ndate'])).days
json.dump(dict(tx=tx,paper=[(p,m) for p,m in paper],zero=zero_docs),open('house_parsed.json','w'),default=str)
print('docs parsed',parsed_docs,'paper',len(paper),'zero-tx docs',len(zero_docs),'tx',len(tx))
print(collections.Counter(x['status'] for x in tx))
print(collections.Counter(x['type'] for x in tx))
