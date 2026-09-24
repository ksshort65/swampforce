import json,re,csv,collections,glob
rows=json.load(open('raw/grants_dedup.json')); FN=json.load(open('raw/funder_names.json'))
PP="https://projects.propublica.org/nonprofits/organizations/{ein}/{oid}/full"
# canonical recipients of interest
R=[('Indivisible Project',r'^INDIVISIBLE PROJECT'),('Indivisible Civics',r'^INDIVISIBLE CIVICS'),('Indivisible Action (PAC)',r'^INDIVISIBLE ACTION$'),
('MoveOn.org Civic Action',r'^MOVE ?ON ?(\.)?ORG CIVIC|^MOVEON CIVIC'),('MoveOn Education Fund',r'^MOVEON EDUCATION'),('MoveOn.org Political Action',r'MOVEONORG POLITICAL'),
('Sunrise Movement Education Fund',r'^SUNRISE MOVEMENT EDUCATION'),('Sunrise Movement',r'^SUNRISE MOVEMENT$'),
("The People's Forum",r"^(THE )?PEOPLE'?S FORUM"),('CodePink',r'^CODE ?PINK'),('Tricontinental',r'TRICONTINENTAL'),('Breakthrough BT Media',r'^BREAK ?THROUGH (BT )?MEDIA'),
('Jewish Voice for Peace Action',r'^JEWISH VOICE FOR PEACE ACTION'),('Jewish Voice for Peace (c3)',r'^(A )?JEWISH VOICE FOR PEACE( INC)?$'),('IfNotNow',r'^IF ?NOT ?NOW'),
('Movement 4 Black Lives Inc',r'MOVEMENT (4|FOR) BLACK LIVES'),('BLM Global Network Foundation',r'^BLACK LIVES MATTER FOUNDATION INC$|BLACK LIVES MATTER GLOBAL'),
('Working Families Organization',r'^WORKING FAMILIES ORGANIZATION'),('Center for Popular Democracy (+Action)',r'^(THE )?CENTER FOR POPULAR DEMOCRACY'),
('Common Counsel Foundation',r'^COMMON COUNSEL FOUNDATION'),('Sixteen Thirty Fund',r'^(THE )?SIXTEEN THIRTY FUND'),("People's Welfare Association",r"^PEOPLE'?S WELFARE"),
('United Community Fund',r'^UNITED COMMUNITY FUND$'),('Justice and Education Fund',r'^JUSTICE AND EDUCATION FUND'),("People's Dispatch",r"^PEOPLE'?S DISPATCH"),
('WESPAC Foundation',r'^WESPAC'),('United We Dream (+Action)',r'^UNITED WE DREAM'),('CHIRLA',r'^COALITION FOR HUMANE IMMIGRANT RIGHTS'),("Women's March (various entities)",r"^WOMEN'?S MARCH"),
('Public Citizen',r'^PUBLIC CITIZEN( INC| FOUNDATION)?( INC)?$'),('Mijente',r'^MIJENTE'),('Rule of Law Trust',r'^RULE OF LAW TRUST'),('The Concord Fund',r'^(THE )?CONCORD FUND'),('DonorsTrust',r'^DONORS ?TRUST'),
('Schwab Charitable Fund',r'^SCHWAB CHARITABLE'),('One Nation',r'^ONE NATION'),('Judicial Crisis Network',r'^JUDICIAL CRISIS NETWORK'),('Republican Attorneys General Assn',r'^REPUBLICAN ATTORNEYS? GENERALS? ASSO'),
('Susan B Anthony List',r'^SUSAN B ANTHONY'),('Protect Women Ohio Action',r'^PROTECT WOMEN OHIO'),('Heritage Action for America',r'^HERITAGE ACTION'),('Republican Governors Association',r'^REPUBLICAN GOVERNORS'),
('Progress Unity Fund',r'^PROGRESS UNITY FUND'),('ETINA',r'^ETINA$'),('Knights of Columbus Charitable Fund',r'^KNIGHTS OF COLUMBUS'),('Fidelity Charitable',r'^FIDELITY CHARITABLE')]
KEEP_FUNDERS=set(FN)
EXCL={'814853056','873253485','620262315'}  # One Nation Life, One Nation One Project, KofC Council 544
agg=collections.defaultdict(lambda:{'amt':0,'purp':collections.Counter(),'oid':None,'n':0})
for r in rows:
    nm=r['name'].upper().strip()
    for canon,p in R:
        if re.search(p,nm):
            if re.sub(r'\D','',r.get('ein') or '') in EXCL: break  # different org with similar name
            if canon=='Sixteen Thirty Fund' and r['funder_ein']=='264486735': break
            if canon in ('Schwab Charitable Fund','Knights of Columbus Charitable Fund','DonorsTrust','Fidelity Charitable') and r['funder_ein'] not in ('850784793','831047727','202303252'): break
            k=(r['funder_ein'],canon,r['period'][-4:],r['period'])
            a=agg[k]; a['amt']+=r['amount']; a['purp'][r['purpose'][:120]]+=1; a['oid']=r['oid']; a['n']+=1; a['sched']=r['sched']
            break
out=[]
for (fe,canon,yr,per),a in agg.items():
    if a['amt']<=0: continue
    out.append(dict(funder=FN[fe],funder_ein=fe,recipient=canon,amount=a['amt'],year=yr,period_end=per,purpose='; '.join(p for p,_ in a['purp'].most_common(3)),
        source_type='IRS Form 990 '+('Schedule I' if 'ScheduleI' in a['sched'] else '990-PF Part XV')+' (via ProPublica e-file render)',
        source_url=PP.format(ein=fe,oid=a['oid']),status='documented (grantor filing)',note=('Grants by a donor-advised-fund sponsor; underlying donor not named in filing' if fe in ('311774905','113813663','237825575','261997839','510198509') else '')))
# OSF database (grants not on 990 of years pulled, or for reference)
osf=[]
seen=set()
for f in glob.glob('raw/osf/*.json'):
    try: d=json.load(open(f))
    except: continue
    for x in d:
        if x['id'] in seen: continue
        seen.add(x['id'])
        g=x['grantee']
        if re.search(r'^Indivisible Project|^MoveOn|Jewish Voice for Peace|^Common Counsel Foundation$|^Working Families Organization|^Tides Advocacy$|^NEO Philanthropy',g) and (('Indivisible' in x['desc']) or not g.startswith('Tides')) :
            if g.startswith('NEO') and 'Black Lives' not in x['desc']: continue
            if g.startswith('Common Counsel') and 'Black Lives' not in x['desc']: continue
            osf.append(dict(funder=x['funder']+' (Open Society Foundations)',funder_ein='',recipient=g,amount=int(re.sub(r'[^\d]','',x['amount'])),year=x['year'],period_end='',purpose=x['desc'][:200],
               source_type='Open Society Foundations awarded-grants database (grant '+x['id']+'; term '+x['term']+')',source_url=x['url'],status='documented (funder database)',note='May duplicate the same grant shown on OSF entity 990 Schedule I rows'))
out+=osf
# FEC
fec=[
('SOROS, GEORGE','Democracy PAC II (C00786624)',175000000,'2021-2022 cycle','Individual contributions to super PAC','https://www.fec.gov/data/committee/C00786624/'),
('SOROS, GEORGE','Democracy PAC (C00693382)',5820000,'2019-2020 cycle','Individual contributions to super PAC','https://www.fec.gov/data/committee/C00693382/'),
('SOROS, GEORGE','Harris Victory Fund (C00744946)',1803000,'2023-2024 cycle','Contributions to joint fundraising committee','https://www.fec.gov/data/committee/C00744946/'),
('SOROS, GEORGE','ColorOfChange PAC (C00428557)',1000000,'2021-2022 cycle','Individual contributions to PAC','https://www.fec.gov/data/committee/C00428557/'),
('Sixteen Thirty Fund','Future Forward PAC (C00669259)',8915274,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00669259/'),
('Sixteen Thirty Fund','Victory 2020 (C00747246)',7700000,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00747246/'),
('Sixteen Thirty Fund','LCV Victory Fund (C00486845)',6787500,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00486845/'),
('Sixteen Thirty Fund','Priorities USA Action (C00495861)',4500000,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00495861/'),
('Sixteen Thirty Fund','Your Community PAC (C00886614)',6730363,'2023-2024 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00886614/'),
('Future Forward USA Action','Future Forward PAC (C00669259)',266445349,'2023-2024 cycle','501(c)(4) contribution to affiliated super PAC','https://www.fec.gov/data/committee/C00669259/'),
('Future Forward USA Action','Future Forward PAC (C00669259)',61224428,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00669259/'),
('Future Forward USA Action','Future Forward PAC (C00669259)',16357722,'2021-2022 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00669259/'),
('Future Forward USA Action','Future Forward PAC (C00669259)',495764,'2025-2026 cycle (to date of FEC bulk file)','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00669259/'),
('Majority Forward','Senate Majority PAC (C00484642)',51320000,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00484642/'),
('Majority Forward','Senate Majority PAC (C00484642)',61000000,'2025-2026 cycle (to date of FEC bulk file)','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00484642/'),
('American Action Network','Congressional Leadership Fund (C00504530)',29968273,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00504530/'),
('American Action Network','Congressional Leadership Fund (C00504530)',44266262,'2025-2026 cycle (to date of FEC bulk file)','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00504530/'),
('One Nation','Senate Leadership Fund (C00571703)',22465000,'2019-2020 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00571703/'),
('Majority Forward','Senate Majority PAC (C00484642)',81750000,'2023-2024 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00484642/'),
('Majority Forward','Senate Majority PAC (C00484642)',72348000,'2021-2022 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00484642/'),
('One Nation','Senate Leadership Fund (C00571703)',74975000,'2021-2022 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00571703/'),
('One Nation','Senate Leadership Fund (C00571703)',35580000,'2023-2024 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00571703/'),
('One Nation','Senate Leadership Fund (C00571703)',70740000,'2025-2026 cycle (to date of FEC bulk file)','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00571703/'),
('American Action Network','Congressional Leadership Fund (C00504530)',50677593,'2021-2022 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00504530/'),
('American Action Network','Congressional Leadership Fund (C00504530)',43035000,'2023-2024 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00504530/'),
('The Concord Fund','Truth and Courage PAC (C00796045)',2500000,'2023-2024 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00796045/'),
('Indivisible Project','Indivisible Action (C00678839)',2816709,'2019-2020 cycle','501(c)(4) contribution to affiliated PAC','https://www.fec.gov/data/committee/C00678839/'),
('Indivisible Project','Indivisible Action (C00678839)',2500000,'2023-2024 cycle','501(c)(4) contribution to affiliated PAC','https://www.fec.gov/data/committee/C00678839/'),
('Working Families Organization','Working Families Party PAC (C00606962)',2080000,'2023-2024 cycle','501(c)(4) contribution to affiliated PAC','https://www.fec.gov/data/committee/C00606962/'),
('Sunrise Movement','Sunrise PAC (C00674697)',280000,'2025-2026 cycle (to date)','501(c)(4) contribution to affiliated PAC','https://www.fec.gov/data/committee/C00674697/'),
('North Fund','Your Community PAC (C00886614)',5700000,'2023-2024 cycle','501(c)(4) contribution to super PAC','https://www.fec.gov/data/committee/C00886614/'),
('Open Society Policy Center','Durham For All (C90019753)',100000,'2019-2020 cycle','501(c)(4) contribution','https://www.fec.gov/data/committee/C90019753/'),
]
for f,rcp,a,yr,p,u in fec:
    out.append(dict(funder=f,funder_ein='',recipient=rcp,amount=a,year=yr,period_end='',purpose=p,source_type='FEC itemized receipts (bulk file indiv, Schedule A), summed by cycle',source_url=u,status='documented (FEC filing)',note='Totals computed from FEC bulk data file https://www.fec.gov/data/browse-data/?tab=bulk-data ; memo entries excluded'))
tax=[('Department of Homeland Security (USCIS)','CHIRLA',450000,'FY2024 (start 2023-10-01)','Citizenship and Integration Grant Program: citizenship instruction and naturalization services','https://www.usaspending.gov/award/ASST_NON_23CICET00327_070'),
('Department of Homeland Security (USCIS)','CHIRLA',250000,'FY2023 (start 2022-10-01)','Citizenship and Integration Grant Program','https://www.usaspending.gov/award/ASST_NON_22CICET00277_070'),
('Department of Homeland Security (USCIS)','CHIRLA',250000,'FY2022 (start 2021-10-01)','Citizenship and Integration Grant Program','https://www.usaspending.gov/award/ASST_NON_21CICET00204_070'),
('Small Business Administration','American Muslims for Palestine',10000,'2020','Economic Injury Disaster Loan (EIDL) advance grant (COVID program)','https://www.usaspending.gov/award/ASST_NON_EIDLGT:3303369636_073'),
('U.S. Agency for International Development','Tides Center',24695784,'2016 award','Civil Society Innovation Initiative - fiscal agent (international)','https://www.usaspending.gov/award/ASST_NON_AIDOAAA1600007_072')]
for f,rcp,a,yr,p,u in tax:
    out.append(dict(funder=f,funder_ein='',recipient=rcp,amount=a,year=yr,period_end='',purpose=p,source_type='USASpending.gov federal award record',source_url=u,status='documented (federal award)',note='Federal grant for stated program; no record found that funds paid for protests'))
out.append(dict(funder='Donald J. Trump for President, Inc. (C00580100)',funder_ein='',recipient='Gotham Government Relations and Communications',amount=12000,year='2015',period_end='2015-10-08',purpose='"EVENT CONSULTING" (as reported to FEC)',source_type='FEC operating expenditure (Schedule B, 2015 year-end report)',source_url='https://www.fec.gov/data/committee/C00580100/',status='documented payment; purpose (paid extras at June 2015 announcement) is reported, not confirmed by primary record',note='FEC bulk file oppexp16; image 201601319005280481'))
cols=['funder','funder_ein','recipient','amount','year','period_end','purpose','source_type','source_url','status','note']
out.sort(key=lambda x:(x['source_type'][:3],x['funder'],x['recipient'],str(x['year'])))
with open('money-flows.csv','w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=cols); w.writeheader(); [w.writerow(o) for o in out]
print(len(out))
json.dump(out,open('raw/flows.json','w'))
