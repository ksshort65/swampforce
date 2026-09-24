import subprocess,re,sys,urllib.parse,json
UA='Mozilla/5.0'
def ts(q,start='',end='',scope='all'):
    u='https://trumpstruth.org/search?'+urllib.parse.urlencode({'query':q,'start_date':start,'end_date':end,'removed':'include','scope':scope,'media':'all','per_page':'100','sort':'relevance'})
    h=subprocess.run(['curl','-sSL','-A',UA,u],capture_output=True,text=True).stdout
    t=re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',h))
    m=re.search(r'([\d,]+|No) results? for',t)
    return u,(m.group(0) if m else 'n/a'),t
if __name__=='__main__':
    q,s,e=sys.argv[1],sys.argv[2],sys.argv[3]; phr=sys.argv[4:] 
    u,c,t=ts(q,s,e)
    print(u);print(' count:',c)
    for p in phr:
        hits=[t[max(0,m.start()-150):m.end()+150] for m in re.finditer(re.escape(p),t,re.I)]
        print(f'  exact<<{p}>> in results:',len(hits)); [print('    ',h) for h in hits[:2]]
