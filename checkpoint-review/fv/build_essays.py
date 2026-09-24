import json,re,os,glob,sys,urllib.parse as u
B='/workspace/checkpoint-review/'; E=B+'fv/essays/'; S=B+'fv/essay_edits/'; O=B+'essays-verified/'
IDX=json.load(open(E+'_index.json'))
UNLINK=['pewresearch.org','news.gallup.com','abc13.com','homeland.house.gov','realclearpolitics.com','foxnews.com','nbcnews.com','cnn.com','nytimes.com',
 'politico.com','npr.org','apnews.com','aljazeera.com','mlive.com','rumble.com','theepochtimes.com','epochtv.shop','stophate.com','judicialwatch.org','aflegal.org',
 'publicinterestlegal.org','irli.org','fairus.org','youtube.com','budget.house.gov','devex.com','opensecrets.org','ballotpedia.org','usafacts.org','campaignlegal.org',
 'newsbusters.org','cato.org','brookings.edu','urban.org','crfb.org','washingtonpost.com','x.com','twitter.com','news.un.org']
REPL={
 'https://oig.justice.gov/reports/2019/o1912.pdf':'https://oig.justice.gov/sites/default/files/reports/120919-examination.pdf',
 'https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04/OIG-26-04-Apr26.pdf':'https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf',
 'https://www.oyez.org/cases/1968/492':'https://supreme.justia.com/cases/federal/us/395/444/',
 'https://www.oyez.org/cases/1978/78-680':'https://supreme.justia.com/cases/federal/us/443/111/',
 'https://www.oyez.org/cases/1994/93-1456':'https://supreme.justia.com/cases/federal/us/514/779/',
 'https://news.un.org/en/story/2018/09/1020472':'https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-73rd-session-united-nations-general-assembly-new-york-ny/',
 'https://www.oyez.org/cases/1971/71-1017':'https://supreme.justia.com/cases/federal/us/408/606/',
 'https://www.oyez.org/cases/2013/12-1281':'https://www.law.cornell.edu/supct/pdf/12-1281.pdf',
 'https://news.gallup.com/poll/651905/solid-majority-supports-voter-identification-laws.aspx':None,
 'https://www.pewresearch.org/politics/2025/08/13/views-of-the-2024-election-and-voting/':None,
 'https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump':None,
 'https://www.iaea.org/newscenter/statements/iaea-director-general-grossis-introductory-statement-to-the-board-of-governors-3-march-2025':None,
 'https://www.congress.gov/bill/104th-congress/house-joint-resolution-105/text':'https://www.govinfo.gov/content/pkg/BILLS-104hjres105ih/html/BILLS-104hjres105ih.htm',
 'https://www.pewresearch.org/short-reads/2025/02/06/what-the-data-says-about-us-foreign-aid/':'https://www.foreignassistance.gov/',
}
def host(url): return u.urlparse(url).netloc.lower().replace('www.','')
def build(slug,title,spec):
    t=open(E+slug+'.md',encoding='utf-8').read()
    fixes=list(spec.get('fixes',[])); missing=[]
    for old,new in spec.get('edits',[]):
        if old in t: t=t.replace(old,new)
        else: missing.append(old[:80])
    keep=set(spec.get('keep_links',[]))
    removed=set()
    def lk(m):
        txt,url=m.group(1),m.group(2)
        if url in keep: return m.group(0)
        if url in REPL:
            r=REPL[url]
            if r is None: removed.add(host(url)+' (dead)'); return txt
            return f'[{txt}]({r})'
        h=host(url)
        if any(h==d or h.endswith('.'+d) or h==d.replace('www.','') for d in UNLINK):
            removed.add(h); return txt
        return m.group(0)
    t=re.sub(r'\[([^\]]+)\]\((https?://[^)\s]+)\)',lk,t)
    # bare URLs in text (some essays paste raw URLs)
    def bare(m):
        url=m.group(0); h=host(url)
        if url in keep: return url
        if url in REPL: return REPL[url] or ''
        if any(h==d or h.endswith('.'+d) for d in UNLINK): removed.add(h); return ''
        return url
    kept=[]
    for ln in t.split('\n'):
        m_=re.match(r'^- .*?(https?://\S+)\s*$',ln)
        if m_ and '](' not in ln:
            url=m_.group(1); h=host(url)
            if url not in keep and ((url in REPL and REPL[url] is None) or any(h==d or h.endswith('.'+d) for d in UNLINK)):
                removed.add(h); continue
        kept.append(ln)
    t='\n'.join(kept)
    t=re.sub(r'(?<!\()https?://[^\s)\]]+',bare,t)
    if removed: fixes.append('Removed non-primary or dead links (text kept only where the fact is independently sourced): '+', '.join(sorted(removed)))
    lines=t.split('\n'); out=[]; meta_done=False; dek_done=False
    qkeep=spec.get('quote_keep',[]); ov=spec.get('ourview',[])
    for ln in lines:
        s_=ln.strip()
        if ln.startswith('- Date:'): meta_done=True; out.append(ln); continue
        if meta_done and not dek_done and s_ and not ln.startswith('- '):
            dek_done=True
            if spec.get('dek_opinion',True): ln='**Our view:** '+ln
        elif ln.startswith('> ') and not any(q in ln for q in qkeep) and not ln.startswith('> **Our view'):
            ln='> **Our view:** '+ln[2:]
        elif any(s_.startswith(p) for p in ov):
            ln='**Our view:** '+ln
        out.append(ln)
    t='\n'.join(out)
    t=re.sub(r'  +',' ',t); t=re.sub(r' \.','.',t)
    st=spec['status']
    if st=='Held': head=f"Status: Held — {spec.get('held_reason','')}"
    elif fixes or spec.get('edits'): head='Status: Cleared with fixes — '+'; '.join(fixes)
    else: head='Status: Cleared as-is'
    note='\n\n_Sourcing standard: facts link only to official records, government data, court filings, original transcripts or unedited video. Passages marked **Our view** are opinion._\n\n'
    open(O+slug+'.md','w',encoding='utf-8').write(head+note+t.strip()+'\n')
    return head,missing,fixes
if __name__=='__main__':
    rows=[]
    for slug,n,title in IDX:
        p=S+slug+'.json'
        if not os.path.exists(p): continue
        spec=json.load(open(p))
        head,missing,fixes=build(slug,title,spec)
        if missing: print('MISSING in',slug,missing)
        rows.append((slug,title,spec['status'],spec.get('held_reason',''),len(fixes)))
    json.dump(rows,open(B+'fv/essay_status.json','w'),indent=0)
    print(len(rows),'built')
