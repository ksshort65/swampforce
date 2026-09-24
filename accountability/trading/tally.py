import json,collections,datetime,csv
H=json.load(open('house_parsed.json')); S=json.load(open('senate_parsed.json'))
def d(s): return datetime.datetime.strptime(s,'%m/%d/%Y').date()
rows=[]
for x in H['tx']:
    y=x['doc'][:0]
    yr=d(x['filed']).year
    rows.append(dict(chamber='House',member=x['member'],state=x['state'],filing_id=x['doc'],url=f"https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/{yr}/{x['doc']}.pdf",filed=x['filed'],tdate=x['tdate'],ndate=x['ndate'],owner=x['owner'],ticker=x['ticker'],asset=x['asset'],type=x['type'],min=x['min'],max=x['max'],status=x['status'],days=x['days_tx_to_filed']))
for x in S['tx']:
    rows.append(dict(chamber='Senate',member=x['member'],state='',filing_id=x['uid'],url=x['url'],filed=x['filed'],tdate=x['tdate'],ndate='',owner=x['owner'],ticker=x['ticker'],asset=x['asset'],type=x['type'],min=x['min'],max=x['max'],status='New',days=x['days_tx_to_filed']))
# fix House filing-year URL: House PDFs are stored by filing-index year, which equals filing year
ok=[]
for r in rows:
    try: td=d(r['tdate'])
    except: r['excluded']='bad date'; continue
    if r['status']!='New': r['excluded']='amended/deleted line'; continue
    if td<datetime.date(2025,1,1): r['excluded']='trade before 2025'; continue
    if td>datetime.date(2026,9,24): r['excluded']='date after today (likely typo)'; continue
    r['excluded']=''
    ok.append(r)
json.dump(rows,open('all_rows.json','w'))
print('rows',len(rows),'in-window',len(ok))
print(collections.Counter(r['excluded'] for r in rows))
def tot(rs):
    mn=sum(r['min'] for r in rs); mx=sum((r['max'] if r['max'] is not None else r['min']) for r in rs); ob=sum(1 for r in rs if r['max'] is None)
    return mn,mx,ob,len(rs)
for ch in ('House','Senate'):
    for yr in (2025,2026):
        rs=[r for r in ok if r['chamber']==ch and d(r['tdate']).year==yr]
        print(ch,yr,tot(rs))
    print(ch,'all',tot([r for r in ok if r['chamber']==ch]))
print('ALL',tot(ok))
m=collections.defaultdict(list)
for r in ok: m[(r['chamber'],r['member'])].append(r)
top=sorted(m.items(),key=lambda kv:-(sum(r['min'] for r in kv[1])))
print('\nTOP 25 by min')
for (ch,name),rs in top[:25]:
    mn,mx,ob,n=tot(rs); print(ch,name,n,mn,mx,ob)
print('members with trades',len(m))
