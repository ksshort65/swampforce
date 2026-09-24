import re,json,html,datetime,collections,os
rows=json.load(open('senate/index.json'))
tx=[];paper=[]
def d(s): return datetime.datetime.strptime(s.strip(),'%m/%d/%Y').date()
for r in rows:
    path=re.search(r'href="([^"]+)"',r[3]).group(1)
    name=re.sub(r'<[^>]+>','',r[2]).strip()
    filed=r[4]
    if '/ptr/' not in path:
        paper.append(dict(name=name,filed=filed,url='https://efdsearch.senate.gov'+path)); continue
    uid=path.split('/')[4]
    t=open(f'senate/ptr/{uid}.html').read()
    i=t.find('<tbody>'); j=t.find('</tbody>',i)
    body=t[i:j]
    for tr in re.findall(r'<tr>(.*?)</tr>',body,re.S):
        tds=[re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',x))).strip() for x in re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S)]
        if len(tds)<8: continue
        _,tdate,owner,ticker,asset,atype,ttype,amt=tds[:8]
        a=amt.replace(',','')
        m=re.match(r'\$(\d+)\s*-\s*\$(\d+)',a)
        if m: lo,hi=int(m.group(1)),int(m.group(2))
        elif 'Over' in a:
            lo=int(re.search(r'\$(\d+)',a).group(1))+1; hi=None
        else:
            m=re.search(r'\$(\d+)',a)
            lo=hi=int(m.group(1)) if m else None
        if lo is None: print('noamt',uid,amt); continue
        tx.append(dict(uid=uid,url='https://efdsearch.senate.gov'+path,member=name,filed=filed,tdate=tdate,owner=owner,ticker=ticker if ticker!='--' else '',asset=asset[:120],atype=atype,type=ttype,min=lo,max=hi))
for x in tx:
    try: x['days_tx_to_filed']=(d(x['filed'])-d(x['tdate'])).days
    except Exception: x['days_tx_to_filed']=None
json.dump(dict(tx=tx,paper=paper),open('senate_parsed.json','w'))
print(len(tx),'tx; paper',len(paper))
print(collections.Counter(x['type'] for x in tx))
print(collections.Counter(x['atype'] for x in tx).most_common(8))
