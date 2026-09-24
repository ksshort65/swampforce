#!/usr/bin/env python3
"""fetch URL -> text cache; print status + snippets around phrases.
usage: fx.py URL [phrase ...]   (env W=200 context chars)"""
import sys,os,re,hashlib,subprocess,json,unicodedata
C='/workspace/reverify/evidence/cache'
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('\u2019',"'").replace('\u2018',"'").replace('\u201c','"').replace('\u201d','"').replace('\u2014','-').replace('\u2013','-').replace('\xa0',' ')
    return re.sub(r'\s+',' ',s)
def fetch(u,force=False):
    h=hashlib.sha1(u.encode()).hexdigest()[:16]
    tp=f'{C}/{h}.txt'; mp=f'{C}/{h}.json'
    if os.path.exists(tp) and not force:
        return json.load(open(mp)),open(tp).read()
    raw=f'{C}/{h}.raw'
    p=subprocess.run(['curl','-sSL','-A',UA,'--compressed','--max-time','90','-o',raw,'-w','%{http_code}|%{content_type}|%{url_effective}',u],capture_output=True,text=True)
    code,ctype,eff=(p.stdout.split('|')+['','',''])[:3]
    txt=''
    try:
        data=open(raw,'rb').read()
    except: data=b''
    if data[:4]==b'%PDF' or 'pdf' in ctype:
        q=subprocess.run(['pdftotext','-layout',raw,'-'],capture_output=True)
        txt=q.stdout.decode('utf8','ignore')
    else:
        html=data.decode('utf8','ignore')
        try:
            import trafilatura
            t=trafilatura.extract(html,include_comments=False,include_tables=True,favor_recall=True) or ''
        except Exception: t=''
        try:
            from bs4 import BeautifulSoup
            b=BeautifulSoup(html,'html.parser')
            for s in b(['script','style','noscript']): s.decompose()
            t2=b.get_text(' ')
        except Exception: t2=''
        txt=t+'\n=====FULLTEXT=====\n'+t2
    meta={'url':u,'code':code,'ctype':ctype,'effective':eff,'bytes':len(data),'err':p.stderr[:200]}
    open(tp,'w').write(txt); json.dump(meta,open(mp,'w'))
    try: os.remove(raw)
    except: pass
    return meta,txt
def snip(txt,ph,w=200):
    n=norm(txt); out=[]
    for m in re.finditer(re.escape(norm(ph)),n,re.I):
        out.append(n[max(0,m.start()-w):m.end()+w])
        if len(out)>=2: break
    return out
if __name__=='__main__':
    u=sys.argv[1]; force=os.environ.get('F')=='1'
    meta,txt=fetch(u,force)
    w=int(os.environ.get('W','200'))
    print(f"[{meta['code']}] {meta['bytes']}B {meta['ctype'][:30]} -> {meta['effective'][:120]} textlen={len(txt)}")
    for ph in sys.argv[2:]:
        s=snip(txt,ph,w)
        print(f"  <<{ph}>> hits={len(s)}")
        for x in s: print('    ...'+x+'...')
    if len(sys.argv)==2:
        print(norm(txt)[:int(os.environ.get('N','1500'))])
