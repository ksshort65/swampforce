import csv, json, html, re, zipfile, os
from pathlib import Path
TS='/workspace/term-split'; OUT='/workspace/website'
def load(base):
    rows=[]
    for r in csv.DictReader(open(f'{TS}/{base}.csv',encoding='utf-8-sig')):
        claim=r['Claim']; began=ended=''
        m=re.search(r'\n\s*Began:\s*(.*?)\s*\|\s*Ended:\s*(.*)$',claim,re.S)
        if m: began,ended=m.group(1).strip(),m.group(2).strip(); claim=claim[:m.start()].strip()
        rows.append({'id':r['Item_ID'],'claim':claim,'began':began,'ended':ended,'truth_url':r['Truth_Source_URL'].strip(),
            'who':r['Who_Pushed_It'],'duration':r['Approximate_Duration'],'deception':r['Deception_Form'].replace('"',''),'tag':r['Category_Tag'],'notes':r['Notes'],'evidence':r.get('Evidence_Level') or '','primary':(r.get('Primary_Source_URL') or '').strip(),'proof':r.get('Proof_Basis') or '','corrvis':r.get('Correction_Visibility') or ''})
    return rows
terms=[('first','First Term (2017–2021)','first-term-trump-admin-media-deception'),('later','After the First Term and Second Term (2021–Present)','later-second-term-trump-admin-media-deception')]
data={k:load(b) for k,_,b in terms}
header=open(f'{TS}/page-header.txt').read().strip().split('\n\n')
e=html.escape

def domain(url):
    if not url: return ''
    m=re.search(r'https?://(?:www\.)?([^/]+)', url.strip())
    return m.group(1).lower() if m else ''

def primary_link_label(proof):
    mapping = {
        "Official record": "Official record",
        "Original transcript/video": "Transcript/video",
        "Outlet's own correction": "Outlet correction",
        "Fact-check only": "Second fact-check",
    }
    return mapping.get((proof or '').strip(), 'Primary record')

def link_label(label, url):
    d=domain(url)
    text=f'{label} ({d})' if d else label
    return f'<a href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(text)}</a>'
def notes_html(notes):
    if not notes: return ''
    out=[]; pos=0
    for m in re.finditer(r'https?://[^\s\)\]<>"\']+', notes):
        out.append(e(notes[pos:m.start()]))
        raw=m.group(0)
        url=raw.rstrip('.,;:')
        trail=raw[len(url):]
        d=domain(url) or 'link'
        out.append(f'<a href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(d)}</a>{e(trail)}')
        pos=m.end()
    out.append(e(notes[pos:]))
    return '<div class="note">'+''.join(out)+'</div>'
SMALL={'a','an','and','the','of','for','it','to','in','on','behind','so','is'}
TITLES={'HOW A NARRATIVE IS BUILT: THE PSYCHOLOGY BEHIND THE HEADLINES':'How a Narrative Is Built: The Psychology Behind the Headlines','WHAT PSYCHOLOGICAL WARFARE IS':'What Psychological Warfare Is','THE SCIENCE BEHIND IT':'The Science Behind It','WHY YOU NEVER SAW THE CORRECTION':'Why You Never Saw the Correction','GASLIGHTING':'Gaslighting','THE METHODS, AND THE RESEARCH THAT NAMED THEM':'The Methods, and the Research That Named Them','WHY POLITICIANS AND NETWORKS DO IT':'Why Politicians and Networks Do It','WHO PAID FOR IT, AND WHY':'Who Paid for It, and Why','WHY THE HOSTILITY RUNS SO DEEP':'Why the Hostility Runs So Deep','WHEN NEWS BECAME OPINION':'When News Became Opinion',"WHO'S IN THE NEWSROOM":"Who's in the Newsroom",'THE GREAT AMERICAN BETRAYAL':'The Great American Betrayal','WHY IT MATTERS':'Why It Matters'}
def tc(t): return TITLES.get(t.strip(), t.strip().capitalize())
def header_html():
    out=[]; title=header[0].strip(); glossary=False
    out.append(f'<h1>{e(tc(title))}</h1>')
    for block in header[1:]:
        lines=block.strip().split('\n')
        if lines[0].isupper() and len(lines)>1:
            heading=lines[0].strip(); glossary=(heading=='THE METHODS, AND THE RESEARCH THAT NAMED THEM')
            out.append(f'<h2>{e(tc(heading))}</h2>'); lines=lines[1:]
        if not lines:
            continue
        # Lead-in paragraph(s) before bullets in a section
        bullets=[l for l in lines if l.startswith('- ')]
        prose=[l for l in lines if not l.startswith('- ')]
        if prose:
            out.append(f'<p>{e(" ".join(prose))}</p>')
        if bullets:
            if glossary:
                items=[]
                for l in bullets:
                    body=l[2:]
                    if ': ' in body:
                        term, rest=body.split(': ', 1)
                        items.append(f'<div class="g-item"><dt>{e(term)}</dt><dd>{e(rest)}</dd></div>')
                    else:
                        items.append(f'<div class="g-item"><dd>{e(body)}</dd></div>')
                out.append('<dl class="glossary">'+''.join(items)+'</dl>')
            else:
                out.append('<ul>'+''.join(f'<li>{e(l[2:])}</li>' for l in bullets)+'</ul>')
    return '\n'.join(out)
def table(key,label):
    rows=data[key]; trs=[]
    for r in rows:
        dates=f'<div class="dates"><b>Began:</b> {e(r["began"])} &nbsp;|&nbsp; <b>Ended:</b> {e(r["ended"])}</div>' if r['began'] else ''
        note=notes_html(r['notes']) if r.get('notes') else ''
        badge=('proven' if r.get('evidence')=='Proven false' else 'misleading') if r.get('evidence') else ''
        badge_html=f'<span class="badge {badge}">{e(r["evidence"])}</span>' if r.get('evidence') else ''
        primary=(' · '+link_label(primary_link_label(r.get('proof')), r['primary'])) if r.get('primary') else ''
        corr=f'<div class="corr">{e(r["corrvis"])}</div>' if r.get('corrvis') else ''
        truth=link_label('See the record', r['truth_url']) if r.get('truth_url') else ''
        trs.append(f'<tr data-evidence="{e(r.get("evidence") or "")}"><td class="claim">{badge_html}{e(r["claim"])}{dates}{note}{corr}</td><td>{e(r["who"])}</td><td>{e(r["duration"])}</td><td><span class="tag">{e(r["deception"])}</span></td><td>{truth}{primary}</td></tr>')
    return f'''<section id="{key}"><h2 class="term">{e(label)} <span class="count">{len(rows)} cases</span></h2>
<table class="cases"><thead><tr><th>The Claim</th><th>Who Pushed It</th><th>How Long It Ran</th><th>Type of Deception</th><th>The Truth</th></tr></thead><tbody>
{''.join(trs)}</tbody></table></section>'''
total=sum(len(v) for v in data.values())
page=f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>How a Narrative Is Built</title><style>
body{{font-family:Georgia,"Times New Roman",serif;margin:0;background:#f7f7f5;color:#1a1a1a;line-height:1.55}}
.wrap{{max-width:1150px;margin:0 auto;padding:24px 18px 60px}}
header.intro{{background:#fff;border-left:6px solid #9b1c1c;padding:20px 26px;margin-bottom:26px}}
h1{{font-size:2rem;margin:0 0 10px}} h2{{font-size:1.25rem;margin:22px 0 6px}}
.term{{font-size:1.5rem;border-bottom:3px solid #9b1c1c;padding-bottom:6px;margin-top:38px}}
.count{{font-size:.9rem;color:#666;font-weight:normal}}
.controls{{position:sticky;top:0;background:#f7f7f5;padding:10px 0;z-index:2;display:flex;gap:10px;flex-wrap:wrap;align-items:center}}
.controls input{{flex:1;min-width:220px;padding:10px 12px;font-size:1rem;border:1px solid #bbb;border-radius:6px}}
.controls a{{color:#9b1c1c;font-family:Arial,sans-serif;font-size:.95rem}}
table.cases{{width:100%;border-collapse:collapse;background:#fff;font-family:Arial,Helvetica,sans-serif;font-size:.92rem}}
.cases th{{background:#1f2937;color:#fff;text-align:left;padding:10px;position:sticky;top:58px}}
.cases td{{border-bottom:1px solid #e3e3e3;padding:10px;vertical-align:top}}
.cases tr:nth-child(even) td{{background:#fafafa}}
td.claim{{width:38%;font-weight:600}} .dates{{font-weight:normal;color:#444;font-size:.85rem;margin-top:6px}}
.note{{font-weight:normal;color:#777;font-size:.8rem;font-style:italic;margin-top:4px}}
.tag{{background:#fde8e8;color:#7f1d1d;border-radius:4px;padding:2px 6px;font-size:.8rem;display:inline-block}}
.cases a{{color:#9b1c1c;font-weight:bold}}
footer{{margin-top:40px;font-size:.85rem;color:#555;font-family:Arial,sans-serif}}
@media (max-width:760px){{
 .cases thead{{display:none}} .cases tr{{display:block;margin-bottom:14px;border:1px solid #ddd}}
 .cases td{{display:block;width:auto!important;border:none;padding:6px 12px}}
 .cases td:nth-child(2)::before{{content:"Who pushed it: ";font-weight:bold}}
 .cases td:nth-child(3)::before{{content:"How long it ran: ";font-weight:bold}}
 .cases td:nth-child(4)::before{{content:"Type: ";font-weight:bold}}
}}

.glossary{{margin:10px 0 6px;padding:0}}
.glossary .g-item{{margin:0 0 12px;padding:10px 12px;background:#fafafa;border:1px solid #e8e8e8;border-radius:6px}}
.glossary dt{{font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:.95rem;color:#7f1d1d;margin:0 0 4px}}
.glossary dd{{margin:0;font-size:.92rem;color:#222}}
@media (max-width:760px){{
 .glossary .g-item{{padding:10px}}
 .glossary dt{{font-size:.9rem}}
}}

.badge{{font-family:Arial,sans-serif;font-size:.72rem;font-weight:700;border-radius:4px;padding:2px 7px;margin-right:8px;display:inline-block;vertical-align:middle;letter-spacing:.02em}}
.badge.proven{{background:#14532d;color:#ecfdf5}}
.badge.misleading{{background:#92400e;color:#fffbeb}}
.corr{{font-weight:normal;color:#555;font-size:.78rem;margin-top:5px;font-family:Arial,sans-serif}}
.controls label{{font-family:Arial,sans-serif;font-size:.9rem;color:#333;display:flex;align-items:center;gap:4px}}
</style></head><body><div class="wrap">
<header class="intro">{header_html()}</header>
<div class="controls"><input id="q" type="search" placeholder="Search {total} documented cases (a name, outlet, or topic)…"><label><input type="radio" name="ev" value="all" checked> All</label><label><input type="radio" name="ev" value="Proven false"> Proven false</label><label><input type="radio" name="ev" value="Rated misleading"> Rated misleading</label><a href="#first">First term</a><a href="#later">Second term</a></div>
{table('first',terms[0][1])}
{table('later',terms[1][1])}
<footer>Each case links to the correction, retraction, settlement, official finding, or fact-check that set the record straight. Dates come from those sources. "Not clearly documented" means the sources don't show a clear date.</footer>
</div><script>
function applyFilters(){{var q=document.getElementById('q').value.toLowerCase();var ev=(document.querySelector('input[name=ev]:checked')||{{}}).value||'all';
document.querySelectorAll('section').forEach(function(s){{var n=0;s.querySelectorAll('tbody tr').forEach(function(tr){{var hit=tr.textContent.toLowerCase().indexOf(q)>-1;var e=tr.getAttribute('data-evidence')||'';if(ev!=='all'&&e!==ev)hit=false;tr.style.display=hit?'':'none';if(hit)n++;}});
s.querySelector('.count').textContent=n+' cases';}});}}
document.getElementById('q').addEventListener('input',applyFilters);
document.querySelectorAll('input[name=ev]').forEach(function(r){{r.addEventListener('change',applyFilters);}});
</script></body></html>'''
open(f'{OUT}/index.html','w').write(page)
for k,_,base in terms:
    json.dump(data[k],open(f'{OUT}/{k}-term-cases.json','w'),ensure_ascii=False,indent=1)
    with open(f'{OUT}/{k}-term-cases.csv','w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=['id','claim','began','ended','who','duration','deception','tag','truth_url','notes','evidence','primary','proof','corrvis']); w.writeheader(); w.writerows(data[k])
open(f'{OUT}/README.txt','w').write(f'''Website package for "How a Narrative Is Built" ({total} documented cases)

index.html          Complete, self-contained page: header text plus both tables, with search and phone layout. No outside files needed. Upload this if Grok Build accepts an HTML page.
first-term-cases.json / later-term-cases.json   Same data as structured records, if Grok Build wants to build the tables from data.
first-term-cases.csv  / later-term-cases.csv    Same data as spreadsheets, if it imports tables from CSV.
page-header.txt     The header text by itself.

Fields: id, claim, began, ended, who (who pushed it), duration (how long it ran), deception (type of deception), tag, truth_url (link to the record), notes.
''')
import shutil; shutil.copy(f'{TS}/page-header.txt',f'{OUT}/page-header.txt')
with zipfile.ZipFile('/workspace/website-package.zip','w',zipfile.ZIP_DEFLATED) as z:
    for fn in ['index.html','first-term-cases.json','later-term-cases.json','first-term-cases.csv','later-term-cases.csv','page-header.txt','README.txt']:
        z.write(f'{OUT}/{fn}',fn)
    brief=Path('/workspace/brief')
    for pdf in ['swampforce-brief.pdf','swampforce-evidence-appendix.pdf']:
        p=brief/pdf
        if p.exists():
            z.write(p, f'brief/{pdf}')
print({k:len(v) for k,v in data.items()}, 'no-dates', sum(1 for v in data.values() for r in v if not r['began']))
