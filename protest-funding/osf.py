import re,html,sys,json,subprocess,urllib.parse
def fetch(kw,page=None):
    u="https://www.opensocietyfoundations.org/grants/past?filter_keyword="+urllib.parse.quote_plus(kw)
    if page: u+="&page=%d"%page
    s=subprocess.run(["curl","-sL","-A","Mozilla/5.0",u],capture_output=True,text=True).stdout
    out=[]
    for m in re.finditer(r'<div class="a-grantsDatabase" id="([^"]+)".*?</button>',s,re.S):
        b=m.group(0)
        g=lambda lab: (re.search(r'__label">'+lab+r'</span>\s*<p class="a-grantsDatabase__text">(.*?)</p>',b,re.S) or [None,""])[1]
        t=re.search(r'__title">.*?</span>\s*(.*?)\s*</h2>',b,re.S).group(1)
        vals=re.findall(r'__value[^"]*">([^<]*)<',b)
        out.append(dict(id=m.group(1),grantee=html.unescape(t.strip()),year=vals[0],amount=vals[1],desc=html.unescape(g("Description").strip()),term=g("Term").strip(),region=re.sub(r'\s+',' ',re.sub('<br/>',';',g("Region"))).strip(),funder=html.unescape(g("Funder").strip()),url=u.split('&page')[0]+"&grant_id="+m.group(1)))
    return out,u
if __name__=="__main__":
    kw=sys.argv[1]
    allr=[];seen=set()
    for p in [None,2,3,4,5,6]:
        r,u=fetch(kw,p)
        new=[x for x in r if x['id'] not in seen]
        if not new: break
        for x in new: seen.add(x['id']); allr.append(x)
    print(json.dumps(allr))
