import json
from rec import *
ST=json.load(open('/workspace/reverify/url-status.json'))
CHK={'politifact.com':'PolitiFact','factcheck.org':'FactCheck.org','snopes.com':'Snopes','apnews.com/article/fact-check':'AP Fact Check','apnews.com/hub/ap-fact-check':'AP Fact Check',
'reuters.com/fact-check':'Reuters Fact Check','reuters.com/article/fact-check':'Reuters Fact Check','washingtonpost.com/politics/2':'Washington Post Fact Checker','washingtonpost.com/politics/fact-checker':'Washington Post Fact Checker',
'usatoday.com/story/news/factcheck':'USA TODAY Fact Check','leadstories.com':'Lead Stories','checkyourfact.com':'Check Your Fact','factcheck.afp.com':'AFP Fact Check','fullfact.org':'Full Fact'}
def status(u):
    s=ST.get(u); 
    return s['out'].split()[0] if s else '?'
def ic(u):
    for k,v in CHK.items():
        if k in (u or ''): return v
    return None
from load import load
ROWS={r['Item_ID']:r for r in load()}
BAR={'AP Fact Check':{'29','80','229','236','237','5','8','34','49','51','58','61','63','64','68','70','145'},'Reuters Fact Check':{'59','106','248','67'},'Washington Post Fact Checker':{'7','30','60','72','129','244'}}
def auto_ic(iid,alt=None):
    r=ROWS[str(iid)]
    cands=[alt] if alt else []
    cands+= [r['Truth_Source_URL']]+[u for u in __import__('re').findall(r'https?://\S+',r['Notes']) ]
    for u in cands:
        if not u: continue
        u=u.rstrip(').,;')
        n=ic(u)
        if not n: continue
        if str(iid) in BAR.get(n,set()): continue
        if n=='Washington Post Fact Checker':
            import re; m=re.search(r'/(20\d\d)/(\d\d)/',u)
            if not m or (int(m.group(1)),int(m.group(2)))>(2025,7): continue
        s=status(u)
        if s in('200','?') or 'washingtonpost' in u: return n,u,s
    return None,None,None
def rp(iid,oc,method,url,note,level=None,basis=None,flag=None,loaded='200',icn=None,icu=None,noic=False):
    r=ROWS[str(iid)]
    n=u=None
    if not noic:
        if icn: n,u=icn,icu
        else: n,u,_=auto_ic(iid)
    if oc in(VC,V): oc = VC if n else V
    kw=dict(Outcome=oc,Verification_Method=method,Verification_Source_URL=url,Source_Loaded=loaded,Verification_Note=note,
        New_Evidence_Level=level or r['Evidence_Level'],New_Proof_Basis=basis or ('Official record' if method.startswith('Official') else method),
        Independent_Confirmation_Name=n or '',Independent_Confirmation_URL=u or '')
    if flag: kw['Flag']=flag
    rec(iid,**kw)
