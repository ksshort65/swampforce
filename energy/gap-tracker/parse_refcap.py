import re,json,collections
P={1:"CT ME MA NH RI VT DE DC MD NJ NY PA FL GA NC SC VA WV".split(),2:"IL IN IA KS KY MI MN MO NE ND SD OH OK TN WI".split(),3:"AL AR LA MS NM TX".split(),4:"CO ID MT UT WY".split(),5:"AK AZ CA HI NV OR WA".split()}
ST={'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Delaware':'DE','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nevada':'NV','New Jersey':'NJ','New Mexico':'NM','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Pennsylvania':'PA','Tennessee':'TN','Texas':'TX','Utah':'UT','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY','Virgin Islands':'VI','Oregon':'OR','Nebraska':'NE','North Carolina':'NC','South Carolina':'SC','Virginia':'VA','New York':'NY'}
padd={s:p for p,l in P.items() for s in l}
corp=None; rows=[]
for ln in open('/workspace/energy/raw/t5r.txt'):
    ln=ln.strip()
    m=re.match(r"^(.+?), ([A-Za-z ]+) ([\d,]+)$",ln)
    if m and m.group(2) in ST:
        rows.append((corp,m.group(1),ST[m.group(2)],int(m.group(3).replace(',','')))); continue
    m=re.match(r"^([A-Z0-9][A-Z0-9 &.,'/()-]+?)(?: ([\d,]{5,}))?$",ln)
    if m and not ln.startswith('CORPORATION') and len(m.group(1))>3 and m.group(1)==m.group(1).upper() and not m.group(1).startswith('U.S'):
        corp=m.group(1).strip()
tot=sum(r[3] for r in rows); print('rows',len(rows),'sum',tot,'(EIA U.S. Total 18,160,493)')
out={'national':{},'padd':{}}
bycorp=collections.Counter()
for c,l,s,v in rows: bycorp[c]+=v
out['national']={'total':tot,'top':bycorp.most_common(10)}
for p in [1,2,3,4,5]:
    cc=collections.Counter(); t=0
    for c,l,s,v in rows:
        if padd.get(s)==p: cc[c]+=v; t+=v
    out['padd'][p]={'total':t,'top':cc.most_common(6),'refineries':[(c,l,s,v) for c,l,s,v in rows if padd.get(s)==p]}
json.dump(out,open('/workspace/energy/gap-tracker/refcap_concentration.json','w'),indent=1)
print(bycorp.most_common(6)); 
for p in out['padd']: d=out['padd'][p]; print(p,d['total'],d['top'][:5], sum(v for _,v in d['top'][:5])/d['total'])
print(out['padd'][4]['refineries'])
