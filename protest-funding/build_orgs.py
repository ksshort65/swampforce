import json,csv,collections,re
orgs=json.load(open('raw/orgs_rows.json')); p1=json.load(open('raw/part1.json')); flows=json.load(open('raw/flows.json'))
M={'814944067':'Indivisible Project','822355901':'Indivisible Civics','61553389':'MoveOn.org Civic Action','831327936':'MoveOn Education Fund','464773036':'Sunrise Movement Education Fund','821232167':'Sunrise Movement',
'611844780':"The People's Forum",'262823386':'CodePink','841816752':'Jewish Voice for Peace Action','475178715':'IfNotNow','884261393':'Movement 4 Black Lives Inc','824862489':'BLM Global Network Foundation',
'204994004':'Working Families Organization','453813436':'Center for Popular Democracy (+Action)','943214166':'Common Counsel Foundation','264486735':'Sixteen Thirty Fund','834705654':"People's Welfare Association",
'371913339':'United Community Fund','824975378':'Justice and Education Fund','133109400':'WESPAC Foundation','462216565':'United We Dream (+Action)','954421521':'CHIRLA',"814571869":"Women's March (various entities)",'237104508':'Public Citizen',
'822882135':'Tricontinental','845071181':'Breakthrough BT Media','831047727':'Rule of Law Trust','202303252':'The Concord Fund','271937961':'One Nation'}
SPONSOR={'884261393':'Formerly a fiscally sponsored project of Common Counsel Foundation (OSF grant OR2020-76047 describes M4BL as "a project of the Grantee"); Common Counsel 2024 Schedule I shows $15,817,927 "fund closeout" to Movement 4 Black Lives Inc.',
'814944067':'2017: OSF grant OR2017-37439 went to Tides Advocacy "to provide organizational support to The Indivisible Project" (fiscal sponsorship period). Own 501(c)(4) since.',
'133109400':'Reported (not confirmed by primary record here) to be fiscal sponsor of National Students for Justice in Palestine.',
'824862489':'Previously fiscally sponsored (Thousand Currents, then Tides Center) - reported; Tides Center 2020 Schedule I shows $10,000 to "Black Lives Matter Global Network Project".',
'264486735':'Administered by Arabella Advisors (per its own filings list Arabella as manager - reported); hosts many projects (e.g., Demand Progress, Governing for Impact Action Fund per OSF grant descriptions).'}
rows=[]
for o in orgs:
    e=o['ein']; canon=M.get(e)
    tg=''
    if canon:
        c=collections.defaultdict(int)
        for f in flows:
            if f['recipient'] in (canon,) and 'IRS' in f['source_type']: c[f['funder']]+=f['amount']
        tg='; '.join(f"{k}: ${v:,.0f}" for k,v in sorted(c.items(),key=lambda x:-x[1])[:6])
    rev24=''; per24=''
    if e in p1 and p1[e]:
        oid,per,d=p1[e][0]; rev24=d.get('CYTotalRevenueAmt') or d.get('TotalRevAndExpnssAmt') or ''; per24=per[1]
    rows.append(dict(ein=e,name=o['name'],tax_status=o['type'],role_in_story=o['role'],latest_filing_period=per24 or o['latest_tax_year'],latest_total_revenue=rev24.replace(',','') if rev24 else o['latest_revenue'],
        revenue_2020=o['rev_2020'],revenue_2021=o['rev_2021'],revenue_2022=o['rev_2022'],revenue_2023=o['rev_2023'],
        top_disclosed_grantors_from_grantor_990s=tg,fiscal_sponsor_notes=SPONSOR.get(e,''),propublica_url=o['propublica_url']))
extra=[dict(ein='n/a',name='50501 (national movement)',tax_status='no national 990 located',role_in_story='No Kings co-organizer',latest_filing_period='',latest_total_revenue='',revenue_2020='',revenue_2021='',revenue_2022='',revenue_2023='',top_disclosed_grantors_from_grantor_990s='none found in grantor filings searched',fiscal_sponsor_notes='Local entities with EINs exist (50501 DC Inc 33-4530176; NH 50501 41-3816755) but no Form 990 data was available.',propublica_url='https://projects.propublica.org/nonprofits/organizations/334530176'),
dict(ein='n/a',name='ANSWER Coalition / Party for Socialism and Liberation',tax_status='no 501(c) filing located (PSL is a political party)',role_in_story='Gaza/antiwar marches',latest_filing_period='',latest_total_revenue='',revenue_2020='',revenue_2021='',revenue_2022='',revenue_2023='',top_disclosed_grantors_from_grantor_990s='none found in grantor filings searched',fiscal_sponsor_notes='Named in Sen. Hawley June 11, 2025 letters (congressional record, Republican senator).',propublica_url=''),
dict(ein='n/a',name='Students for Justice in Palestine (national)',tax_status='no national 990 located',role_in_story='2024 campus encampments',latest_filing_period='',latest_total_revenue='',revenue_2020='',revenue_2021='',revenue_2022='',revenue_2023='',top_disclosed_grantors_from_grantor_990s='none found',fiscal_sponsor_notes='Reported fiscal sponsor: WESPAC Foundation (see its row). Campus chapters are student groups.',propublica_url='')]
rows+=extra
with open('orgs.csv','w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=list(rows[0].keys())); w.writeheader(); [w.writerow(r) for r in rows]
print(len(rows))
