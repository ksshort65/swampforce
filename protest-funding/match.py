import json,re,collections
T={'Indivisible':r'\bINDIVISIBLE\b','MoveOn':r'MOVE ?ON','Sunrise':r'SUNRISE MOVEMENT','Peoples Forum':r"PEOPLE'?S FORUM",'CodePink':r'CODE ?PINK','Jewish Voice for Peace':r'JEWISH VOICE FOR PEACE','Working Families':r'WORKING FAMILIES','M4BL':r'MOVEMENT (FOR|4) BLACK LIVES|M4BL','BLM':r'BLACK LIVES MATTER','Justice & Education Fund':r'JUSTICE AND EDUCATION FUND','Tricontinental':r'TRICONTINENTAL','Breakthrough':r'BREAKTHROUGH (BT|NEWS)','PSL/ANSWER':r'PARTY FOR SOCIALISM|ANSWER COALITION|ACT NOW TO STOP','Center for Popular Democracy':r'CENTER FOR POPULAR DEMOCRACY','Womens March':r"WOMEN'?S MARCH",'Color of Change':r'COLOR OF CHANGE','United We Dream':r'UNITED WE DREAM','Mijente':r'MIJENTE','Dream Defenders':r'DREAM DEFENDERS','Public Citizen':r'PUBLIC CITIZEN','50501':r'50501','Peoples Action':r"PEOPLE'?S ACTION",'Our Revolution':r'OUR REVOLUTION','Community Change':r'COMMUNITY CHANGE','Adalah':r'ADALAH','Palestine Legal':r'PALESTINE LEGAL','IfNotNow':r'IF ?NOT ?NOW','WESPAC':r'WESPAC','AMP/AJP':r'AJP EDUCATIONAL|AMERICAN MUSLIMS FOR PALESTINE','SJP':r'STUDENTS FOR JUSTICE IN PALESTINE','Third Act':r'THIRD ACT','Social Security Works':r'SOCIAL SECURITY WORKS','CHIRLA':r'COALITION FOR HUMANE IMMIGRANT','Union del Barrio':r'UNION DEL BARRIO','CAIR':r'COUNCIL ON AMERICAN.ISLAMIC','Common Counsel':r'COMMON COUNSEL','Blackbird':r'BLACKBIRD','Common Defense':r'COMMON DEFENSE','Democracy Forward':r'DEMOCRACY FORWARD','Movement Voter':r'MOVEMENT VOTER','DSA':r'DEMOCRATIC SOCIALISTS','Sixteen Thirty':r'SIXTEEN THIRTY|1630 FUND','New Venture Fund':r'NEW VENTURE FUND','Tides':r'\bTIDES\b','Peoples Welfare':r"PEOPLE'?S WELFARE",'United Community Fund':r'UNITED COMMUNITY FUND','Justice Democrats':r'JUSTICE DEMOCRATS','Home of the Brave':r'HOME OF THE BRAVE'}
names={}
def load():
    return [json.loads(l) for l in open('raw/grants.jsonl')]
if __name__=="__main__":
    rows=load()
    fn={}
    for r in rows: fn.setdefault(r['funder_ein'],None)
    agg=collections.defaultdict(lambda:[0,0,set()])
    for r in rows:
        for k,p in T.items():
            if re.search(p,r['name'].upper()):
                a=agg[(r['funder_ein'],k,r['period'][-4:])]; a[0]+=r['amount']; a[1]+=1; a[2].add(r['name'])
    for (f,k,y),(amt,n,nm) in sorted(agg.items()):
        print(f,k,y,f"{amt:,}",n,'|',"; ".join(sorted(nm))[:150])
