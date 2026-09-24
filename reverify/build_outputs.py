import json,csv,collections
from load import load
from rec import VC,V,W,R,U
import csv as _c
CUR={}
for _f in ['first-term-trump-admin-media-deception.csv','later-second-term-trump-admin-media-deception.csv']:
    for _r in _c.DictReader(open('/workspace/term-split/'+_f,encoding='utf-8-sig')): CUR[_r['Item_ID']]=_r
rows=load()
for _r in rows:
    if _r['Item_ID'] in CUR: _r['Correction_Visibility']=CUR[_r['Item_ID']]['Correction_Visibility']
ORIG=[k for k in rows[0].keys() if k!='_term']
res={}
for l in open('results.jsonl'):
    d=json.loads(l); res[d['Item_ID']]=d
vet=json.load(open('vetting-outcomes.json'))
ok_chk={k for k,v in vet.items() if v.startswith('Approved')}
BAR={'AP Fact Check':{'29','80','229','236','237','5','8','34','49','51','58','61','63','64','68','70','145'},'Reuters Fact Check':{'59','106','248','67'},'Washington Post Fact Checker':{'7','30','60','72','129','244'}}
out=[];problems=[]
for r in rows:
    i=r['Item_ID']; d=res.get(i)
    if not d:
        d=dict(Outcome=W,Verification_Method='Not reached',Verification_Note='Not reached in this pass.',New_Evidence_Level='Watch list',New_Proof_Basis='Unverified')
    icn=d.get('Independent_Confirmation_Name','') or ''
    if icn and (icn not in ok_chk or i in BAR.get(icn,set())): problems.append((i,icn)); icn=''; d['Independent_Confirmation_URL']=''
    oc=d['Outcome']
    if oc in(VC,V): oc = VC if icn else V
    lvl=d.get('New_Evidence_Level') or r['Evidence_Level']
    if oc==W: lvl='Watch list (unverified)'
    if oc==R: lvl='Removed'
    label={VC:'Verified by SwampForce'+(f' | Independently confirmed by {icn}' if icn else ''),V:'Verified by SwampForce',U:'Unsupported (separate section; never labeled a lie)',W:'',R:''}[oc]
    flag=d.get('Flag','') or ''
    weaker = bool(oc in(U,R) or 'eaker' in flag or 'Downgraded' in flag or 'Reclassified' in flag or (lvl!=r['Evidence_Level'] and oc in(VC,V)))
    o={k:r[k] for k in ORIG}
    o.update(Term=r['_term'],Outcome=oc,Adjusted_Evidence_Level=lvl,Adjusted_Proof_Basis={'Official transcript':'Original transcript/video'}.get(d.get('New_Proof_Basis',''),d.get('New_Proof_Basis','')),Verification_Method=d.get('Verification_Method',''),
      Verification_Source_URL=d.get('Verification_Source_URL',''),Source_Loaded=d.get('Source_Loaded',''),Verification_Note=d.get('Verification_Note',''),
      Independent_Confirmation_Name=icn,Independent_Confirmation_URL=d.get('Independent_Confirmation_URL','') if icn else '',Site_Label=label,
      Watchlist_Category=d.get('W_Category',''),Flag=flag,Evidence_Weaker_Than_Catalog=('Yes' if weaker else ''),Verified_At='2026-09-24 (MT)')
    out.append(o)
out.sort(key=lambda x:int(x['Item_ID']))
cols=list(out[0].keys())
def wr(fn,rs):
    with open(fn,'w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=cols); w.writeheader(); w.writerows(rs)
wr('cases-reverified.csv',out)
wr('watchlist-moves.csv',[o for o in out if o['Outcome']==W])
wr('removals.csv',[o for o in out if o['Outcome']==R])
json.dump(dict(problems=problems),open('build-check.json','w'))
print('rows',len(out),'problems',problems)
c=collections.Counter(o['Outcome'] for o in out); print(c)
