import json,subprocess,csv
E={'814944067':('Indivisible Project','501(c)(4)','No Kings lead organizer'),'822355901':('Indivisible Civics Inc','501(c)(3)','Indivisible affiliate'),
'61553389':('MoveOn.org Civic Action','501(c)(4)','No Kings partner'),'831327936':('MoveOn Education Fund','501(c)(3)','MoveOn affiliate'),
'464773036':('Sunrise Movement Education Fund','501(c)(3)','climate protests'),'821232167':('Sunrise Movement','501(c)(4)','climate protests'),
'611844780':("The People's Forum Inc",'501(c)(3)','Gaza/antiwar protests; Singham-network grantee'),'262823386':('CodePink Women for Peace','501(c)(3)','antiwar/Gaza protests'),
'841816752':('Jewish Voice for Peace Action','501(c)(4)','Gaza protests'),'475178715':('IfNotNow Education Fund','501(c)(3)','Gaza protests'),
'824862489':('Black Lives Matter Global Network Foundation','501(c)(3)','2020 BLM'),'884261393':('Movement 4 Black Lives Inc','501(c)(3)','2020 BLM (M4BL)'),
'204994004':('Working Families Organization Inc','501(c)(4)','No Kings partner (Working Families Power listed)'),'133109557':('Democratic Socialists of America Inc','501(c)(4)','protest participant'),
'271365284':('AJP Educational Foundation (American Muslims for Palestine)','501(c)(3)','campus/Gaza'),'133109400':('WESPAC Foundation','501(c)(3)','reported fiscal sponsor of National SJP'),
'334530176':('50501 DC Inc','501(c)(4)','50501 affiliate'),'413816755':('NH 50501','501(c)(4)','50501 affiliate'),'880776955':('Third Act Initiative','501(c)(4)','No Kings partner'),
'237104508':('Public Citizen Inc','501(c)(4)','No Kings partner'),'453813436':('Center for Popular Democracy','501(c)(3)','protest organizing'),'462216565':('United We Dream Network','501(c)(3)','No Kings partner'),
'954421521':('Coalition for Humane Immigrant Rights (CHIRLA)','501(c)(3)','LA 2025 (named in Hawley letter)'),'814571869':("Women's March Inc",'501(c)(4)','protest organizing'),
'824975378':('Justice and Education Fund Inc','501(c)(3)','Singham-network funder'),'821202926':('Peoples Support Foundation Limited','private foundation','Singham-network funder'),'371913339':('United Community Fund','501(c)(4)','Singham-network funder'),
'822882135':('Tricontinental Ltd','501(c)(3)','Singham-network grantee'),'845071181':('Breakthrough BT Media Inc','501(c)(3)','Singham-network grantee'),'834705654':("People's Welfare Association",'501(c)(4)','Singham-network grantee'),
'311774905':('Goldman Sachs Philanthropy Fund (GS DAF Philanthropy Fund for Wealth Mgmt)','501(c)(3) DAF sponsor','pass-through'),
'264486735':('Sixteen Thirty Fund','501(c)(4)','Arabella-administered dark money (left)'),'205806345':('New Venture Fund','501(c)(3)','Arabella-administered fiscal sponsor'),'473681860':('Hopewell Fund','501(c)(3)','Arabella-administered'),'473522162':('Windward Fund','501(c)(3)','Arabella-administered'),'834011547':('North Fund','501(c)(4)','Arabella-administered dark money (left)'),
'510198509':('Tides Foundation','501(c)(3)','fiscal sponsor/DAF'),'943213100':('Tides Center','501(c)(3)','fiscal sponsor'),
'263753801':('Foundation to Promote Open Society','501(c)(3)','Soros/OSF'),'137029285':('Open Society Institute','501(c)(3)','Soros/OSF'),'522028955':('Open Society Policy Center / Open Society Action Fund','501(c)(4)','Soros/OSF'),
'943214166':('Common Counsel Foundation','501(c)(3)','fiscal sponsor (M4BL)'),'133191113':('NEO Philanthropy','501(c)(3)','fiscal sponsor'),
'850784793':('Marble Freedom Trust','501(c)(4) trust','Leonard Leo-linked dark money (right)'),'202303252':('The Concord Fund (Judicial Crisis Network)','501(c)(4)','dark money (right)'),'831047727':('Rule of Law Trust','501(c)(4)','dark money (right)'),
'271937961':('One Nation','501(c)(4)','dark money (right)'),'270730508':('American Action Network','501(c)(4)','dark money (right)'),'833690373':('Majority Forward','501(c)(4)','dark money (left)'),'824170762':('Future Forward USA Action','501(c)(4)','dark money (left)'),'473803487':('45Committee','501(c)(4)','dark money (right)')}
rows=[]
for ein,(nm,typ,role) in E.items():
    d=json.loads(subprocess.run(["curl","-s",f"https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json"],capture_output=True,text=True).stdout or '{}')
    fw=d.get('filings_with_data',[])
    fwo=d.get('filings_without_data',[])
    rev={f['tax_prd_yr']:f.get('totrevenue') for f in fw}
    latest=fw[0] if fw else {}
    pdf=latest.get('pdf_url') or ''
    rows.append(dict(ein=ein,name=nm,type=typ,role=role,latest_tax_year=latest.get('tax_prd_yr',''),latest_revenue=latest.get('totrevenue',''),rev_2020=rev.get(2020,''),rev_2021=rev.get(2021,''),rev_2022=rev.get(2022,''),rev_2023=rev.get(2023,''),rev_2024=rev.get(2024,''),
       latest_expenses=latest.get('totfuncexpns',''),newer_filings_without_parsed_data=';'.join(str(f.get('tax_prd_yr')) for f in fwo[:3]),propublica_url=f"https://projects.propublica.org/nonprofits/organizations/{ein}",latest_filing_pdf=pdf))
json.dump(rows,open('raw/orgs_rows.json','w'),indent=1)
for r in rows: print(r['ein'],r['name'][:40],r['latest_tax_year'],r['latest_revenue'],r['rev_2020'],r['rev_2024'],r['newer_filings_without_parsed_data'])
