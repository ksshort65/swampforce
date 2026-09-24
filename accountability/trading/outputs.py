import json,collections,datetime,csv,re
R=json.load(open('all_rows.json'))
def d(s): return datetime.datetime.strptime(s,'%m/%d/%Y').date()
for r in R:
    r['asset']=re.sub(r'\s*\$[\d,]+(\s*-\s*\$[\d,]+)?\s*$','',r['asset']).strip()
    a=r['asset']
    if r['chamber']=='House':
        m=re.search(r'\[([A-Z]{2})\]',a); code=m.group(1) if m else ''
        r['asset_class']={'ST':'stock','OP':'option','GS':'government security','CS':'corporate security/bond','MF':'mutual fund','EF':'ETF','OT':'other','RS':'restricted stock','PS':'stock (non-public)','CT':'crypto','AB':'asset-backed','OL':'LLC/other','HN':'hedge fund','PE':'private equity'}.get(code,'other/unspecified' if not code else code)
    else:
        r['asset_class']={'Stock':'stock','Stock Option':'option','Municipal Security':'municipal security','Corporate Bond':'corporate security/bond','Cryptocurrency':'crypto','Non-Public Stock':'stock (non-public)'}.get(r.get('atype',''),'other') if 'atype' in r else ''
ok=[r for r in R if r['excluded']=='']
# senate asset type is missing from all_rows; reload from senate_parsed
S=json.load(open('senate_parsed.json'))['tx']
key=lambda x:(x['uid'] if 'uid' in x else x['filing_id'],x['tdate'],x['asset'][:40],x['type'],x['min'])
at={ (x['uid'],x['tdate'],x['asset'][:40],x['type'],x['min']):x['atype'] for x in S}
for r in R:
    if r['chamber']=='Senate':
        t=at.get((r['filing_id'],r['tdate'],r['asset'][:40],r['type'],r['min']),'')
        r['asset_class']={'Stock':'stock','Stock Option':'option','Municipal Security':'municipal security','Corporate Bond':'corporate security/bond','Cryptocurrency':'crypto','Non-Public Stock':'stock (non-public)'}.get(t,'other')
def tot(rs):
    return sum(r['min'] for r in rs), sum((r['max'] if r['max'] is not None else r['min']) for r in rs), sum(1 for r in rs if r['max'] is None), len(rs)
late=[r for r in R if r['status']=='New' and r['days'] is not None and r['days']>45 and r['excluded'] in ('','trade before 2025')]
# per-transaction file
with open('../trading-transactions.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['chamber','member','state_district','filing_id','official_filing_url','date_filed','transaction_date','notification_date','owner','ticker','asset','asset_class','type','amount_min_usd','amount_max_usd','days_transaction_to_filing','over_45_days','included_in_2025_2026_tally','exclusion_reason'])
    for r in R:
        w.writerow([r['chamber'],r['member'],r['state'],r['filing_id'],r['url'],r['filed'],r['tdate'],r['ndate'],r['owner'],r['ticker'],r['asset'],r['asset_class'],r['type'],r['min'],'' if r['max'] is None else r['max'],r['days'],'Y' if (r['days'] or 0)>45 else '', 'Y' if r['excluded']=='' else 'N', r['excluded']])
m=collections.defaultdict(list)
for r in ok: m[(r['chamber'],r['member'])].append(r)
lm=collections.defaultdict(list)
for r in late: lm[(r['chamber'],r['member'])].append(r)
keys=set(m)|set(lm)
out=[]
for k in keys:
    rs=m.get(k,[]); mn,mx,ob,n=tot(rs)
    st=[r for r in rs if r['asset_class'] in ('stock','option','restricted stock','stock (non-public)')]
    smn,smx,sob,sn=tot(st)
    L=lm.get(k,[])
    out.append(dict(chamber=k[0],member=k[1],transactions_2025_2026=n,sum_range_min_usd=mn,sum_range_max_usd=mx,open_ended_bands=ob,stock_option_transactions=sn,stock_option_min_usd=smn,stock_option_max_usd=smx,transactions_filed_over_45_days=len(L),max_days_late=max([r['days'] for r in L]) if L else '',late_filing_urls=' '.join(sorted(set(r['url'] for r in L))[:5]),sample_filing_url=(rs[0]['url'] if rs else (L[0]['url'] if L else ''))))
out.sort(key=lambda x:-x['sum_range_min_usd'])
with open('../trading.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
summ={}
for ch in ('House','Senate','Both'):
    for yr in (2025,2026,'all'):
        rs=[r for r in ok if (ch=='Both' or r['chamber']==ch) and (yr=='all' or d(r['tdate']).year==yr)]
        summ[f'{ch}_{yr}']=tot(rs)
        st=[r for r in rs if r['asset_class'] in ('stock','option','restricted stock','stock (non-public)')]
        summ[f'{ch}_{yr}_stockopt']=tot(st)
summ['late_tx']=len(late); summ['late_members']=len(lm)
summ['members_trading']=len(m)
summ['asset_class_counts']=collections.Counter(r['asset_class'] for r in ok).most_common()
json.dump(summ,open('summary.json','w'),indent=1)
print(json.dumps(summ,indent=1))
print(out[:12])
