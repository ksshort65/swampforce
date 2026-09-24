import json,csv,sys
sys.path.insert(0,'/workspace/population-voters/build')
from data import *
from sources import S
from openpyxl import Workbook
from openpyxl.styles import Font,PatternFill,Alignment,Border,Side
from openpyxl.utils import get_column_letter
OUT='/workspace/population-voters/'
uc=json.load(open('/workspace/population-voters/build/urlcheck.json'))
WEBFETCH_OK={'SSA-4B1','SSA-2F','SSA-SSI-NC','DOJ-16','CBS-HARRIS','CBS-CO-2022','AFP-CO-2022'}
def vstat(k):
    c=uc.get(k,'?')
    if c in('200','206'): return f"Loads (curl HTTP {c}, Sep 24, 2026)"
    if k in WEBFETCH_OK: return f"Loads via WebFetch; curl from box returns HTTP {c} (bot block)"
    return f"NOT verified from box: HTTP {c} (site blocks the box); figure taken from search-index/text copy - re-check manually"
HDR=Font(bold=True,color="FFFFFF"); HFILL=PatternFill("solid",fgColor="1F4E78")
BIDEN=PatternFill("solid",fgColor="FFF2CC"); YOY=PatternFill("solid",fgColor="E2EFDA")
wb=Workbook()
def sheet(ws,headers,rows,widths=None,numfmt=None,yoy_cols=()):
    ws.append(headers)
    for c in range(1,len(headers)+1):
        cell=ws.cell(1,c); cell.font=HDR; cell.fill=HFILL; cell.alignment=Alignment(wrap_text=True,vertical='top')
    for r in rows: ws.append(r)
    ws.freeze_panes='B2'
    for i,h in enumerate(headers,1):
        ws.column_dimensions[get_column_letter(i)].width=(widths or {}).get(i, 16 if len(h)<30 else 22)
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            if isinstance(cell.value,int) and cell.column!=1: cell.number_format='#,##0'
            elif isinstance(cell.value,float): cell.number_format='0.0'
            if isinstance(cell.value,str) and len(cell.value)>40: cell.alignment=Alignment(wrap_text=True,vertical='top')
    for c in yoy_cols:
        for r in range(1,ws.max_row+1): ws.cell(r,c).fill=YOY if r>1 else HFILL
    ws.row_dimensions[1].height=60
v=lambda d,y,i=None:(d.get(y) if i is None else (d[y][i] if y in d and d[y][i] is not None else None))
def nr(x,reason): return x if x is not None else reason
# ---------------- MAIN ----------------
ws=wb.active; ws.title="Main annual"
H=["Year","PEP total resident population (July 1)","ACS total population","ACS US citizens (B05001)","ACS noncitizens (B05001)","ACS CVAP (citizens 18+, B29001/B05003)",
"YoY CHANGE: ACS citizens (number) [formula]","YoY CHANGE: ACS citizens (%) [formula]","ACS comparability note",
"EAVS registered voters, total (as published)","EAVS active","EAVS inactive","EAVS note","CPS citizens 18+ (thousands, even yrs)","CPS registered citizens (thousands)",
"CHANGE vs prior EAVS cycle: total registered [formula]","Registration change: documented reason",
"DHS persons naturalized (FY)","DHS naturalization applications filed (FY)","YoY CHANGE: persons naturalized [formula]","Naturalization change: reason",
"EAVS new valid registrations (exact)","CHANGE vs prior EAVS cycle: new valid [formula]","EAVS new valid (rounded narrative, where no exact figure)",
"EAVS removals total","Removed: moved","Removed: died","Removed: failure to respond to confirmation notice + 2 federal elections","Removed: felony","Removed: voter request","Removed: mental incompetence","Removed: duplicate","Removed: other","Removed: not categorized","EAVS removals note",
"CDC births","Births status","CDC deaths","Deaths status","SSA SSNs issued (thousands)","YoY CHANGE: SSNs issued (thousands) [formula]","SSNs issued: % under age 15","SSN citizen/noncitizen split & Enumeration at Birth","Notes / missing-data reasons"]
col={h:i+1 for i,h in enumerate(H)}
rows=[];csvrows=[]
NONCOMP={2006,2020,2021}
for idx,y in enumerate(YEARS):
    r=idx+2
    a=ACS.get(y,(None,)*4)
    e=EAVS.get(y)
    notes=[]
    if y not in ACS: notes.append("ACS: "+ACS_NOTE[2025])
    if y==2020: notes.append("ACS CVAP 2020: Not reported (no experimental CVAP table).")
    if y%2==1: notes.append("EAVS/CPS: Not reported (odd year; surveys are biennial for federal general elections).")
    if y==2025: notes.append("EAVS 2026 and CPS 2026 not yet collected; DHS FY2025 naturalizations and SSA 2025 SSNs not yet published.")
    L=lambda c: get_column_letter(col[c])
    def yoyf(c,step=1,pct=False):
        if idx-step<0: return None
        cur=f"{L(c)}{r}"; prv=f"{L(c)}{r-step}"
        if pct: return f'=IF(AND(ISNUMBER({cur}),ISNUMBER({prv})),({cur}-{prv})/{prv},"")'
        return f'=IF(AND(ISNUMBER({cur}),ISNUMBER({prv})),{cur}-{prv},"")'
    rem=REM.get(y)
    row=[y,PEP.get(y),a[0] if y in ACS else "Not reported",a[1] if y in ACS else "Not reported",a[2] if y in ACS else "Not reported",
         (a[3] if a[3] is not None else "Not reported") if y in ACS else "Not reported",
         (yoyf("ACS US citizens (B05001)") if y not in NONCOMP else "Not computed: not comparable"),(yoyf("ACS US citizens (B05001)",pct=True) if y not in NONCOMP else "Not computed: not comparable"),ACS_NOTE.get(y,""),
         e[0] if e else "Not reported", (e[1] if e and e[1] is not None else ("Not reported" if e else "Not reported")),(e[2] if e and e[2] is not None else "Not reported"), e[3] if e else "",
         CPS[y][0] if y in CPS else "Not reported", CPS[y][1] if y in CPS else "Not reported",
         yoyf("EAVS registered voters, total (as published)",2) if y%2==0 else None, REG_REASON.get(y,""),
         NAT[y][1] if y in NAT else "Not reported",NAT[y][0] if y in NAT else "Not reported",yoyf("DHS persons naturalized (FY)"),NAT_REASON.get(y,""),
         NEWVALID.get(y,"Not reported" if y%2==0 else "Not reported"),yoyf("EAVS new valid registrations (exact)",2) if y%2==0 else None,NEWVALID_NOTE.get(y,""),
         ]
    if rem: row+=[x if x is not None else "Not reported" for x in rem]
    else: row+=["Not reported"]*10
    row+=[REM_NOTE.get(y,""),BIRTHS.get(y),"PROVISIONAL (VSRR No. 43)" if y==2025 else "Final",DEATHS.get(y),"PROVISIONAL (VSRR provisional 2025)" if y==2025 else "Final",
          SSN.get(y,"Not reported"),yoyf("SSA SSNs issued (thousands)"),SSN_U15.get(y,"Not reported"),
          "Not reported: SSA statistical tables do not split SSNs by citizenship or show EAB counts; only official split found is GAO-04-12 for FY2002 (4.23M citizens / 1.34M noncitizens; ~89% of citizen SSNs via EAB).",
          " ".join(notes)]
    rows.append(row)
sheet(ws,H,rows,yoy_cols=[col[c] for c in H if c.startswith("YoY") or c.startswith("CHANGE")])
for r in range(2,ws.max_row+1): ws.cell(r,col["YoY CHANGE: ACS citizens (%) [formula]"]).number_format='0.00%'
# CSV with computed differences (same arithmetic as formulas)
def diff(d,y,step=1,i=None):
    a=d.get(y); b=d.get(y-step)
    if i is not None:
        a=a[i] if a else None; b=b[i] if b else None
    return (a-b) if isinstance(a,int) and isinstance(b,int) else ""
with open(OUT+'population-voters.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(H)
    for row in rows:
        y=row[0]; out=list(row)
        d=diff(ACS,y,1,1)
        if y in NONCOMP: out[col["YoY CHANGE: ACS citizens (number) [formula]"]-1]=out[col["YoY CHANGE: ACS citizens (%) [formula]"]-1]="Not computed: not comparable"
        else:
            out[col["YoY CHANGE: ACS citizens (number) [formula]"]-1]=d
            out[col["YoY CHANGE: ACS citizens (%) [formula]"]-1]=(f"{d/ACS[y-1][1]*100:.2f}%" if d!="" else "")
        out[col["CHANGE vs prior EAVS cycle: total registered [formula]"]-1]=diff({k:v[0] for k,v in EAVS.items()},y,2) if y%2==0 else ""
        out[col["YoY CHANGE: persons naturalized [formula]"]-1]=diff(NAT,y,1,1)
        out[col["CHANGE vs prior EAVS cycle: new valid [formula]"]-1]=diff(NEWVALID,y,2) if y%2==0 else ""
        out[col["YoY CHANGE: SSNs issued (thousands) [formula]"]-1]=diff(SSN,y,1)
        w.writerow(["" if x is None else x for x in out])
# ---------------- NOTES ----------------
ws=wb.create_sheet("Notes-Definitions")
notes=[("Rule","Raw published numbers only. The only arithmetic in this workbook is year-over-year / cycle-over-cycle differences (green columns, Excel formulas) and the one sum-only Biden-period row on the Humanitarian sheet that was specifically requested. Nothing is interpolated, imputed, adjusted, averaged or reconciled."),
("ACS citizens","ACS B05001 'U.S. citizen' = native-born + born in PR/Island Areas + born abroad to US parents + naturalized. Survey estimate with margin of error (not shown). 2005 excludes group quarters. 2020 figures are experimental and not comparable."),
("CVAP","Citizen voting-age population (citizens 18+), ACS B29001 (2009+) / B05003 (earlier). EAVS reports quote CVAP from ACS, sometimes a different vintage (see Discrepancies)."),
("PEP","Census Population Estimates Program July 1 resident population. Intercensal series for 2005-2019; Vintage 2025 for 2020-2025. PEP and ACS totals differ by design."),
("EAVS registered","Election Administration and Voting Survey (EAC), biennial; total = active + inactive as reported by states at close of registration for the November federal election. Some states report differently (e.g., North Dakota has no registration; 2014 some states active-only)."),
("Active/inactive","Inactive = registrants sent an NVRA 8(d)(2) confirmation notice who have not responded; they remain eligible to vote and cannot be removed until they fail to respond AND do not vote in two consecutive federal general elections (52 U.S.C. 20507(d))."),
("CPS registered","Census Current Population Survey November supplement: self-reported registration of citizens 18+, in thousands. Self-reports run higher than administrative data would imply; CPS and EAVS are not directly comparable."),
("Registration by citizenship type","No administrative count of registered voters by native-born vs naturalized status exists; voter files do not record how citizenship was acquired. The only breakdown is the CPS self-report (Registration by method sheet, CPS section)."),
("New valid registrations","EAVS count of applications that added a new registrant (excludes duplicates, updates, invalid/rejected). Category names changed across cycles; see Registration by method sheet for exact labels."),
("Removals","EAVS 'removed from voter lists' by reason. 'Failure to return confirmation notice' = NVRA 8(d)(1)(B) removal after notice and two federal general elections."),
("NVRA 90-day rule","52 U.S.C. 20507(c)(2)(A): states must complete any program to SYSTEMATICALLY remove ineligible voters no later than 90 days before a federal primary or general election (does not bar removals at the registrant's request, for death, criminal conviction or mental incapacity per state law, or individualized removals). Courts are split on whether systematic noncitizen removals fall under the 90-day rule (e.g., Arcia v. Florida SOS, 11th Cir. 2014; Beals v. VCIR, SCOTUS stay Oct 30, 2024; RNC v. Mi Familia Vota cert petition No. 25-1017 noted by DOJ in No. 26A308)."),
("NVRA notice-and-wait","52 U.S.C. 20507(d): a registrant may not be removed on grounds of change of residence unless they confirm in writing or fail to respond to a forwardable notice and do not vote/appear in the period through the second federal general election after the notice."),
("List-maintenance cost","Not reported: no official national figure for the cost of voter-list maintenance was found in EAC or GAO sources reviewed."),
("CDC births/deaths","NCHS final counts of registered births/deaths occurring in the US (residents and nonresidents per NCHS convention for the national total). 2025 values are PROVISIONAL and will change."),
("SSNs issued","SSA original SSNs issued (thousands), calendar year per SSA tables. SSA does not publish a citizen/noncitizen split or Enumeration-at-Birth counts in its annual statistical tables."),
("Naturalizations","DHS OHSS Yearbook Table 21, fiscal year (Oct 1-Sep 30). Persons naturalized, and N-400 applications filed."),
("Fiscal vs calendar","DHS, SSI (December counts), SNAP (FY) and humanitarian data are fiscal-year or point-in-time; ACS/PEP/CDC/SSA SSN are calendar-year. Columns are labeled."),
("Times","All times in America/Denver (MT) unless a source date is quoted as-is."),
("Labels","Fact-check labels follow SwampForce rules only: Proven false / Rated misleading / Unsupported / Accurate."),
]
sheet(ws,["Term","Definition / rule"],notes,widths={1:28,2:140})
# ---------------- SOURCES ----------------
ws=wb.create_sheet("Sources")
sheet(ws,["ID","Source / table","Exact URL","Used for","URL check (Sep 24, 2026)"],[(s[0],s[1],s[2],s[3],vstat(s[0])) for s in S],widths={1:16,2:60,3:80,4:40,5:50})
# ---------------- REG BY METHOD ----------------
ws=wb.create_sheet("Registration by method")
RM=[
("US",2024,"Transactions received (total)",103512313),("US",2024,"Mail/email/fax",8565489),("US",2024,"In person at election office",6209202),("US",2024,"Online",14424190),("US",2024,"Automatic voter registration (AVR)",26099956),("US",2024,"Motor vehicle offices (non-AVR)",31829586),("US",2024,"Public assistance offices",996390),("US",2024,"Disability services offices",65038),("US",2024,"Armed forces recruitment offices",50961),("US",2024,"Other state agencies",1869606),("US",2024,"Registration drives",2104177),("US",2024,"Polling places / same-day",2246241),("US",2024,"Other",7709087),("US",2024,"Not categorized",1342390),
("US",2022,"Applications received (total)",80764222),("US",2022,"Mail/email/fax",7340458),("US",2022,"In person",4566735),("US",2022,"Online",10822001),("US",2022,"Motor vehicle offices",44051378),("US",2022,"Public assistance",1113307),("US",2022,"Disability services",82698),("US",2022,"Armed forces",33554),("US",2022,"Other state agencies",1622543),("US",2022,"Registration drives",1200404),("US",2022,"Other",7585847),("US",2022,"Not categorized",2664163),
("US",2020,"Applications received (total)",103701513),("US",2020,"Mail/email/fax",13253501),("US",2020,"In person",8605537),("US",2020,"Online",27681700),("US",2020,"Motor vehicle offices",39705812),("US",2020,"Public assistance",1548664),("US",2020,"Disability services",129186),("US",2020,"Armed forces",67899),("US",2020,"Other state agencies",2264124),("US",2020,"Registration drives",1740471),("US",2020,"Other",7496129),("US",2020,"Not categorized",1208490),
("US",2018,"Applications received (total)",79854972),("US",2018,"Mail/email/fax",9050646),("US",2018,"In person",6996437),("US",2018,"Online",11253404),("US",2018,"Motor vehicle offices",35330384),("US",2018,"Public assistance",1626156),("US",2018,"Disability services",96107),("US",2018,"Armed forces",65737),("US",2018,"Other state agencies",1657593),("US",2018,"Registration drives",2215034),("US",2018,"Other",5133476),("US",2018,"Not categorized",6940105),
("US",2016,"Applications received (total)",77516596),("US",2016,"By mail",13407280),("US",2016,"In person",9424298),("US",2016,"Internet",13485127),("US",2016,"Motor vehicle offices (DMV)",25373246),("US",2016,"Public assistance",2042557),("US",2016,"Disability services",164733),("US",2016,"Armed forces",100184),("US",2016,"Other state agencies",1644701),("US",2016,"Registration drives",2604814),("US",2016,"Other",5270517),("US",2016,"Not categorized",3999139),
("US",2014,"Applications (rounded narrative)","~49.4 million"),("US",2014,"Motor vehicle (rounded)","~17.5 million"),("US",2014,"Mail (rounded)","~7.8 million"),("US",2014,"In person (rounded)","~5.5 million"),
("US",2012,"Forms (rounded narrative)",">62.5 million"),("US",2012,"Motor vehicle (rounded)","~20.3 million"),("US",2012,"Mail (rounded)","~14.6 million"),("US",2012,"In person (rounded)","~10.3 million"),("US",2012,"Internet",3329216),
("US",2010,"Forms (rounded)","~45.5 million"),("US",2010,"Motor vehicle (rounded)","~16.9 million"),("US",2010,"Mail (rounded)","9.5 million"),("US",2010,"In person (rounded)","6.6 million"),("US",2010,"Internet",768211),
("US",2008,"Forms (rounded)",">60.3 million"),("US",2008,"Motor vehicle (rounded)",">18.1 million"),("US",2008,"Mail (rounded)","17.4 million"),("US",2008,"In person (rounded)","9 million"),("US",2008,"Internet (rounded)","~700,000"),
("US",2006,"Applications (rounded)","36.3 million"),("US",2006,"Mail (rounded)","8.2 million"),("US",2006,"In person (rounded)","7.1 million"),("US",2006,"Motor vehicle (rounded)","~16.6 million"),
("Colorado",2024,"Transactions received (total)",3832931),("Colorado",2024,"Mail/email/fax",270637),("Colorado",2024,"In person",64193),("Colorado",2024,"Online",711329),("Colorado",2024,"Automatic voter registration (AVR)",2202812),("Colorado",2024,"Motor vehicle offices (non-AVR)",0),("Colorado",2024,"Public assistance",24511),("Colorado",2024,"Disability services",187),("Colorado",2024,"Armed forces",5),("Colorado",2024,"Other state agencies","-- (not reported by state)"),("Colorado",2024,"Registration drives",16112),("Colorado",2024,"Polling places / same-day",224672),("Colorado",2024,"Other",318473),("Colorado",2024,"Not categorized",0),
("Colorado",2022,"Applications (total)",3042434),("Colorado",2022,"Mail",248408),("Colorado",2022,"In person",39533),("Colorado",2022,"Online",468561),("Colorado",2022,"Motor vehicle",2171174),("Colorado",2022,"Public assistance",24508),("Colorado",2022,"Disability",316),("Colorado",2022,"Armed forces",13),("Colorado",2022,"Registration drives",37581),("Colorado",2022,"Other",52340),
("Colorado",2020,"Applications (total)",3195131),("Colorado",2020,"Mail",449231),("Colorado",2020,"In person",70691),("Colorado",2020,"Online",873530),("Colorado",2020,"Motor vehicle",1587291),("Colorado",2020,"Public assistance",38028),("Colorado",2020,"Disability",2108),("Colorado",2020,"Armed forces",37),("Colorado",2020,"Registration drives",86182),("Colorado",2020,"Other",88033),
("Colorado",2018,"Applications (total)",1434349),("Colorado",2018,"Mail",101488),("Colorado",2018,"In person",33453),("Colorado",2018,"Online",351629),("Colorado",2018,"Motor vehicle",782426),("Colorado",2018,"Public assistance",31576),("Colorado",2018,"Disability",181),("Colorado",2018,"Armed forces",28),("Colorado",2018,"Registration drives",89963),("Colorado",2018,"Other",43605),
("Colorado",2016,"Applications (total)",1580143),("Colorado",2016,"Mail",225180),("Colorado",2016,"In person",54442),("Colorado",2016,"Internet",548799),("Colorado",2016,"Motor vehicle",468901),("Colorado",2016,"Public assistance",33077),("Colorado",2016,"Disability",518),("Colorado",2016,"Armed forces",22),("Colorado",2016,"Other state agencies",0),("Colorado",2016,"Registration drives",199124),("Colorado",2016,"Other",50080),
("Colorado",2014,"Applications (total)",875547),("Colorado",2014,"Mail",143869),("Colorado",2014,"In person",93088),("Colorado",2014,"Internet",206786),
]
rows=[(g,y,c,val,"EAVS-%d"%y if y>=2014 else {2012:"NVRA-2012",2010:"NVRA-2010",2008:"NVRA-2008",2006:"NVRA-2006"}[y]) for g,y,c,val in RM]
rows.append(("","","","",""))
rows.append(("CPS: native-born vs naturalized citizens (thousands; self-reported)","","","",""))
rows.append(("Year","Native-born citizens 18+","Native-born registered","Naturalized citizens 18+","Naturalized registered"))
for y,t in CPS_NB.items(): rows.append((y,)+t)
rows.append(("Note","CPS Table 11 (Table 13 in 2006/2008). No administrative count of registrants by citizenship type exists.","","",""))
sheet(ws,["Geography","Election year","EAVS category (label as published that cycle)","Count (as published)","Source ID"],rows,widths={1:24,3:48,4:22})
# ---------------- BENEFITS ----------------
ws=wb.create_sheet("Noncitizens on benefits")
rows=[]
for y in range(2005,2025):
    t=SSI_NC[y]; rows.append(("SSI","Lawfully present/qualified noncitizens meeting PRWORA exceptions (eligible)",f"Dec {y}",t[0],t[1],t[2],t[3],"SSA-SSI-NC","Table 29. Noncitizen recipients total / % of all SSI / aged / blind & disabled."))
rows.append(("SSI","Colorado noncitizen recipients (eligible)","Dec 2024",2806,None,1625,1181,"SSA-SSI-NC","Table 31."))
rows+= [("SNAP","Refugees (incl. asylees, stay of deportation) - eligible","FY2023 avg month",434000,1.1,None,None,"FNS-SNAP23","Table A.23: 434 thousand participants (1.1% of participants). Weighted QC sample estimate."),
("SNAP","Other noncitizens (LPRs and other eligible noncitizens) - eligible","FY2023 avg month",1330000,3.3,None,None,"FNS-SNAP23","Table A.23: 1,330 thousand (3.3%)."),
("SNAP","Naturalized citizens (citizens, shown for context)","FY2023 avg month",2470000,6.2,None,None,"FNS-SNAP23","Table A.23."),
("SNAP","Citizen children living with noncitizen adults","FY2023 avg month",2488000,6.2,None,None,"FNS-SNAP23","Table A.23; noncitizen adults may be outside the SNAP household."),
("SNAP","Earlier fiscal years","FY2005-FY2022","Not compiled",None,None,None,"FNS characteristics reports","Not reported here: the same table exists in each annual FNS Characteristics report but was not extracted in this pass."),
("Emergency Medicaid","Emergency services for people otherwise Medicaid-eligible but lacking qualifying status (undocumented AND lawfully present within 5-year bar)","FY2023","$3.775 billion (federal $2.746B + state $1.029B)",None,None,None,"CBO-EMED; KFF-EMED","CBO (Form CMS-64). CBO PDF returned 403 to the box; figures from search index, corroborated by KFF ($3.8B, 0.4% of Medicaid). FY2017-2023 total $26.554B (CBO)."),
("Medicaid/CHIP","Noncitizen enrollees by status (national)","any","Not reported",None,None,None,"—","CMS does not publish a routine national count of Medicaid/CHIP enrollees by immigration status in the sources checked."),
("Improper payments","Payments to ineligible noncitizens specifically","any","Not reported",None,None,None,"GAO/PaymentAccuracy","No GAO, CBO or HHS-OIG estimate isolating improper payments to ineligible noncitizens was found; government-wide improper-payment estimates are not broken out by citizenship."),
("Law","PRWORA 8 U.S.C. 1611-1613","—","—",None,None,None,"USC-1611","1611: noncitizens who are not 'qualified aliens' are ineligible for federal public benefits (exceptions incl. emergency Medicaid). 1612: limits SSI/SNAP for qualified aliens (exceptions: refugees/asylees for set periods, LPRs with 40 quarters, veterans/military). 1613: 5-year bar on federal means-tested benefits for qualified aliens entering on/after Aug 22, 1996."),
]
sheet(ws,["Program","Population (eligible vs ineligible kept separate)","Period","Number / amount (as published)","% of all recipients","Aged (SSI)","Blind & disabled (SSI)","Source ID","Notes"],rows,widths={2:50,4:24,9:70})
# ---------------- ROLLS ----------------
ws=wb.create_sheet("Noncitizens on rolls")
R=[
("Colorado (SOS Gessler)","Jul 1, 2013","Registrants who showed green-card-equivalent at DMV and were flagged by DHS SAVE",None,None,155,"~3.5M (2012 EAVS: 3,651,091)","155 referred to 15 district attorneys. Arapahoe County DA later charged 4 (Denver Post, Nov 22, 2013); outcomes mixed.","CO-SOS-2013"),
("Georgia (SOS citizenship audit)","Oct 23, 2024","Noncitizens found on rolls",20,20,20,"~8.2 million","All 20 canceled and referred; 9 had voted; 156 need further review.","GA-2024"),
("Texas (Governor)","Aug 26, 2024","'Potential noncitizens' removed",None,6500,1930,"~18 million","Governor: over 6,500 removed; ~1,930 with voting history referred. Texas Tribune: only 581 identified as noncitizens; ~5,900 removed for not responding to notices (see Discrepancies).","TX-GOV-2024; TXTRIB-2024"),
("Texas (SOS, federal SAVE run)","Sep 15, 2026","Potential noncitizens flagged by SAVE out of 18M registrants",2724,"Not reported (county-level)",117,"~18 million","2,724 referred to county registrars; 578 later demonstrated citizenship (506 because passport data was added to SAVE after the run) - counties told to reinstate if removed; 117 referred to AG. 7 charged federally mid-Sep 2026 (AP).","TX-SOS-2026; PBS-AP-160"),
("Virginia (ELECT / EO 35)","Aug 7, 2024","Registrations canceled as noncitizens via DMV data, Jan 2022-Jul 2024",None,6303,None,"~6 million","Governor's figure. Reuters (Sep 2026): >4,500 self-identified noncitizens on rolls in 2025 per annual ELECT reports (includes some later citizens and people removed).","VA-ELECT-2024; REUTERS-30K"),
("Ohio (SOS)","Aug 2024","Noncitizen registrations referred",597,None,597,"~8 million","459 registered only, 138 voted. Earlier referrals: 148 (2022), 117 (2021), 354 (2019).","OH-SOS-2025 (and prior SOS releases)"),
("Ohio (SOS)","Jun 3, 2025","Noncitizen registrations referred",30,None,30,"~8 million","","OH-SOS-2025"),
("Ohio (SOS)","Oct 2025","Referred to US DOJ",1084,None,1084,"~8 million","Includes 167 alleged federal voters (secondary source; not verified from primary).","secondary"),
("Louisiana (SOS)","Sep 4, 2025","Suspected noncitizens via SAVE",390,None,None,"~2.9 million","79 had voted at some point since the 1980s.","LA-ILLUM-2025"),
("Iowa (SOS)","Oct 2024 -> 2025","Self-reported noncitizens (DOT) on rolls",277,None,None,"1.6M voted in 2024","Initial announcement >2,000; revised to 277; 35 cast counted ballots in 2024 (Reuters).","REUTERS-30K"),
("New Jersey (Governor)","Jul 21 & Aug 19, 2026","People who answered 'not a citizen' at MVC but were registered by a software error, Jun 2023-Jun 2024",6600,5100,"~1,450 to counties; ~220 voters referred for review","Not reported in release","~5,100 deleted; ~1,450 set to 'rejected' pending county review; ~340 newly registered via error voted; ~220 affected who voted had separate registrations/attestations and are under review.","NJ-GOV-0721; NJ-GOV-0819"),
("California (DMV)","2018","Noncitizens registered by DMV processing error",1500,None,None,"~19 million","'As many as 1,500' per media reports; state did not confirm to Reuters.","REUTERS-30K"),
("National: SAVE bulk checks (DHS)","May 2025-2026","Potential non-US citizens flagged on state lists (not confirmed)",28635,"Not reported","Not reported","65M+ verified, 26 states","Government figure in SCOTUS No. 26A308. DHS: a SAVE response changes no voter's status; only states cancel. SAVE modified system vacated Jun 22, 2026 (LWV v. DHS); stay denied (D.D.C. Jul 8; D.C. Cir. Sep 4); SCOTUS application pending.","SCOTUS-26A308; LWV-ORDER"),
("National: DOJ prosecutions","Jan 2025-Sep 2026","Defendants charged with unlawful voting/registration offenses",None,None,70,"211M+ active","DOJ: 70 charged. HSI: ~1,600 voter-fraud cases, 160 arrests (many for related offenses).","PBS-AP-160; DOJ-16"),
("National: Reuters compilation","2000-2026","Self-declared noncitizens added to rolls by state processing errors (12 states)",30000,None,None,"170M+ registered","'May have added more than 30,000'; number who voted not determined.","REUTERS-30K"),
]
sheet(ws,["Jurisdiction / office","Date","What was counted","Number found / flagged","Number removed","Number referred for prosecution","Roll size","Details","Source ID"],R,widths={1:28,3:40,8:80})
ws.append([]); ws.append(["NVRA 52 U.S.C. 20507","","Systematic removal programs must end 90 days before federal elections (20507(c)(2)(A)); change-of-address removals require notice and a two-federal-election wait (20507(d)). Removal for noncitizenship is not a listed NVRA ground; states rely on state law and 'never eligible' reasoning; courts split on whether the 90-day rule applies. List-maintenance cost: Not reported (no official national figure found)."])
# ---------------- COLORADO ----------------
ws=wb.create_sheet("Colorado")
H2=["Year","PEP population (July 1)","ACS total","ACS citizens","ACS noncitizens","ACS CVAP","YoY CHANGE: ACS citizens [formula]","CPS citizens 18+ (thous.)","CPS registered (thous.)","EAVS registered total","EAVS active","EAVS inactive","EAVS reg. source","CHANGE vs prior cycle: registered [formula]","EAVS new valid registrations","EAVS removals total","Removed: moved","Removed: died","Removed: failure to respond to confirmation","Removed: felony","Removed: voter request","Confirmation notices sent","Ballots/turnout total (EAVS)","In-person Election Day","In-person early","Mail ballots counted","Provisional","UOCAVA","Mail ballots transmitted","Mail ballots returned","Ballots note","Notes"]
rows=[]
for idx,y in enumerate(YEARS):
    r=idx+2; a=CO_ACS.get(y); e=CO_EAVS.get(y); rm=CO_REM.get(y); b=CO_BAL.get(y)
    f1=(f'=IF(AND(ISNUMBER(D{r}),ISNUMBER(D{r-1})),D{r}-D{r-1},"")' if idx>0 else None) if y not in (2020,2021) else "Not computed: not comparable"
    f2=f'=IF(AND(ISNUMBER(J{r}),ISNUMBER(J{r-2})),J{r}-J{r-2},"")' if idx>1 and y%2==0 else None
    nts=[]
    if y==2005: nts.append("ACS Colorado 2005: Not reported (not extracted; 2005 ACS household population only).")
    if y==2020: nts.append("ACS 2020 experimental XK200501; not comparable; no CVAP.")
    if y==2025: nts.append("ACS 2025 not released; 2025 was a coordinated (odd-year) election - EAVS does not cover it.")
    if y==2016: nts.append("2016 Colorado removals not captured in this pass.")
    if y==2013: nts.append("HB13-1303 (May 2013) made Colorado an all-mail-ballot state with voter service & polling centers and same-day registration; first statewide general under it: Nov 2013 (odd-year), first federal general: 2014.")
    row=[y,CO_PEP.get(y)]+([*a] if a else ["Not reported"]*4)
    if a and a[3] is None: row[5]="Not reported"
    row+=[f1,CO_CPS[y][1] if y in CO_CPS else "Not reported",CO_CPS[y][2] if y in CO_CPS else "Not reported"]
    row+=[e[0] if e else "Not reported",(e[1] if e and e[1] else "Not reported"),(e[2] if e and e[2] else "Not reported"),e[3] if e else "",f2,CO_NEWVALID.get(y,"Not reported")]
    row+= [(x if x is not None else "Not reported") for x in rm] if rm else ["Not reported"]*6
    row+=[CO_CONF.get(y,"Not reported")]
    row+= [(x if x is not None else "Not reported") for x in b[:8]]+[b[8]] if b else ["Not reported"]*8+[""]
    row+=[" ".join(nts)]
    rows.append(row)
sheet(ws,H2,rows,yoy_cols=[7,14])
# ---------------- DISCREPANCIES ----------------
ws=wb.create_sheet("Discrepancies")
D=[
("US registered voters 2024","EAVS 2024 total registered",234504358,"CPS Nov 2024 self-reported registered citizens",173854000,"Different concepts: EAVS counts records incl. inactive and people who moved/died but not yet removed; CPS is a household survey of self-reported registration (thousands)."),
("US registered voters 2022","EAVS 2022",226339980,"CPS 2022",161422000,"Same as above."),
("US registered voters 2020","EAVS 2020",228004364,"CPS 2020",168308000,"Same as above."),
("2018 registered total","2018 EAVS report",211665577,"2020 EAVS report prior-year value",211601918,"Revised/reporting difference between reports."),
("2016 registered total","2016 EAVS narrative",214109360,"2016 EAVS Table 3 / 2020 report",214109367,"Difference of 7."),
("2022 CVAP used by EAC","2022 EAVS report (ACS 2021)",239035960,"2024 EAVS report's 2022 value",241710190,"Different ACS vintage."),
("2006 registered total","2006 EAVS report TOTAL row",172805006,"2012 NVRA summary table (2006)",172251706,"NVRA 2005-06 narrative: '172.8 million'."),
("2008 registered total","EAC NVRA 2007-08 report",189844867,"EAVS 2008 summary text","more than 190 million",""),
("2010 registered total","EAC NVRA 2009-10 report",186874157,"2012 NVRA summary table (2010)",186282492,""),
("2012 registered total","2012 NVRA report text",194198928,"Same report summary table",193585443,""),
("2024 removals: deceased","2024 EAVS report",4482207,"Errata v2 (Feb 2026)",4576275,""),
("2024 removals: moved","2024 EAVS report",6504112,"Errata v2",6504140,""),
("2024 removals: felony","2024 EAVS report",293862,"Errata v2",296581,""),
("2024 removals: mental incompetence","2024 EAVS report",13382,"Errata v2",13354,""),
("2024 removals: not categorized","2024 EAVS report",1002042,"Errata v2",894413,""),
("2024 confirmation notices","2024 EAVS report",39670903,"Errata v2",38803086,""),
("Texas 2024 noncitizen removals","Gov. Abbott release (Aug 26, 2024)","over 6,500 'potential noncitizens' removed","Texas Tribune/Votebeat records (Oct 15, 2024)","581 identified as noncitizens; ~5,900 removed for not responding","Most removals were for non-response to notices, not confirmed noncitizenship."),
("Texas 2025-26 SAVE","SAVE flags",2724,"Later shown to be citizens",578,"506 because passport data was added to SAVE after the run."),
("SAVE national flags vs confirmed","DHS: potential noncitizens flagged",28635,"State-confirmed noncitizen removals nationally","Not reported","DHS says SAVE changes no voter's status; confirmation/removal is by states."),
("Iowa 2024","Initial state announcement",">2,000","Revised count",277,"35 counted ballots in 2024 (Reuters)."),
("Colorado JW case: 8(d)(1)(B) removals Nov 2020-Nov 2022","Discovery data (Secretary)",306303,"Settlement data (per JW motion, ECF 113)",101607,"Secretary said discovery figure erroneously included all removals. EAVS 2022 Colorado 'failure to respond to confirmation' removals = 161,607 (period: close of 2020 to close of 2022 registration)."),
("LA County JW settlement (2019)","Judicial Watch headline","'to remove 1.5 million inactive voters'","Settlement text","~1,565,000 registrations on inactive file; cancellation only for non-responders after NVRA notice and required elections","Settlement did not order immediate removal of all inactive registrations."),
("Colorado JW press claim","Judicial Watch","372,000 inactive voters removed since 2023 settlement","Colorado SOS / EAVS","EAVS 2024 Colorado removals total 389,334 (all reasons, 2022-24 cycle); 160,239 for failure to respond","Not directly comparable periods/categories."),
("North Carolina JW","Judicial Watch","'over 430,000 inactive names removed'","NC State Board figure","Not verified from primary record in this pass",""),
("Emergency Medicaid FY2023","CBO (per search index)","$3.775 billion","KFF summary of CBO","$3.8 billion","Rounding."),
("Refugee arrivals FY2024","DHS Yearbook",100060,"—","—","No conflicting official figure found."),
("ACS vs PEP population 2024","ACS total",340110990,"PEP July 1, 2024",340003797,"Different methods (survey vs demographic estimate)."),
]
sheet(ws,["Item","Source A","Value A","Source B","Value B","Explanation (no reconciliation performed)"],D,widths={1:36,2:34,3:26,4:34,5:34,6:70})
# ---------------- HUMANITARIAN ----------------
ws=wb.create_sheet("Humanitarian & work permits")
HH=["Fiscal year","Refugee arrivals","Asylum granted: total","Affirmative (USCIS)","Defensive (immigration court)","YoY CHANGE: refugee arrivals [formula]","YoY CHANGE: asylum total [formula]","SSNs issued, all (thousands, calendar yr)","Parole / TPS / DACA / EAD (annual)","Biden period?","Notes"]
rows=[]
for idx,y in enumerate(range(2005,2026)):
    r=idx+2
    biden = "Partial (Biden from Jan 20, 2021; Oct 1, 2020-Jan 19, 2021 under Trump)" if y==2021 else ("Yes" if y in(2022,2023,2024) else ("Partial (Biden Oct 1, 2024-Jan 19, 2025)" if y==2025 else ""))
    a=ASYLUM.get(y)
    rows.append([y,REFUGEES.get(y,"Not reported"),*(a if a else ["Not reported"]*3),
        f'=IF(AND(ISNUMBER(B{r}),ISNUMBER(B{r-1})),B{r}-B{r-1},"")' if idx else None,
        f'=IF(AND(ISNUMBER(C{r}),ISNUMBER(C{r-1})),C{r}-C{r-1},"")' if idx else None,
        SSN.get(y,"Not reported"),"Not reported as an annual official series in sources reachable from the box (see program rows below)",biden,
        "FY2025 DHS Yearbook tables not yet published." if y==2025 else ""])
sheet(ws,HH,rows,yoy_cols=[6,7])
for r in range(2,ws.max_row+1):
    if ws.cell(r,10).value: 
        for c in range(1,12): 
            if c not in(6,7): ws.cell(r,c).fill=BIDEN
n=ws.max_row
ws.append(["BIDEN-PERIOD SUM (FY2021-FY2024 only; sum-only row as requested)","=SUM(B18:B21)","=SUM(C18:C21)","=SUM(D18:D21)","=SUM(E18:E21)","","","","","FY2021 includes ~3.7 months under Trump; FY2025 (Oct 1, 2024-Jan 19, 2025 under Biden) excluded because FY2025 data are not published.",""])
for c in range(1,12): ws.cell(ws.max_row,c).font=Font(bold=True); ws.cell(ws.max_row,c).fill=BIDEN
ws.append([])
prog=[("Program / item","Figure (as published)","Period","Source ID","Legal authority / court rulings / notes"),
("CHNV parole (Cuba, Haiti, Nicaragua, Venezuela)","~532,000 granted parole","Oct 2022-Jan 22, 2025","CHNV-FR","INA 212(d)(5). DHS terminated CHNV Mar 25, 2025 (90 FR 13611). D. Mass. (Doe v. Noem) stayed termination Apr 14, 2025; SCOTUS stayed that order May 30, 2025 (No. 24A1079), allowing terminations. Earlier Texas v. DHS challenge to CHNV (S.D. Tex.) dismissed for lack of standing Mar 8, 2024 (not re-verified from box)."),
("CHNV arrivals granted parole, by nationality","Cubans 110,240; Haitians 211,040; Nicaraguans 93,070; Venezuelans 117,330","through Dec 2024","CBP-DEC24","CBP monthly update figures (not summed here)."),
("CBP One appointments","more than 936,500 scheduled appointments at ports of entry","Jan 2023-Dec 2024","CBP-DEC24","Scheduling function ended Jan 20, 2025 (CBP-JAN25). Processing at ports under INA 212(d)(5) parole or NTA; related 'Circumvention of Lawful Pathways' rule litigated (East Bay Sanctuary Covenant v. Biden) - not re-verified from box."),
("Operation Allies Welcome (Afghans)","Not reported","2021-2022","—","DHS OAW totals not retrieved from an official page reachable in this pass."),
("Uniting for Ukraine (U4U)","Not reported","2022-2025","—","Not retrieved."),
("Border parole (e.g., Parole+ATD at southwest border)","Not reported","FY2021-2025","—","Available in OHSS monthly enforcement/parole data; not extracted."),
("TPS","Not reported (annual)","FY2005-2025","—","INA 244. No single annual official population series retrieved; USCIS/CRS publish point-in-time estimates by country."),
("DACA active recipients","436,350 (rounded)","as of Jun 30, 2026","USCIS-DACA","Annual historical series not compiled; USCIS publishes point-in-time quarterly counts."),
("I-765 EAD approvals by category (c8 asylum applicant, c11 parole, a18/c19 TPS-related a12/c19, a3 refugee, c33 DACA)","Not reported (annual)","FY2005-2025","USCIS-I765","USCIS publishes quarterly (not annual) receipts/approvals by category; building annual totals would require summing quarters, which the rules prohibit. Current file covers Apr 1-Jun 30, 2026 only."),
("SSNs to noncitizens / Enumeration Beyond Entry","Not reported","—","SSA-2F","SSA publishes total SSNs issued and age shares only; no noncitizen or EBE counts. Age 20-49 share of SSNs issued: 30.5% (2023), 33.8% (2024) per Table 2.F12."),
("Amnesty / legalization","No general amnesty enacted since IRCA (1986)","—","—","Immigration Reform and Control Act of 1986 (Pub. L. 99-603) was the last broad legalization law. Parole, TPS and DACA are temporary, discretionary statuses that do not confer permanent status or citizenship."),
("Legal authorities","INA 207 (refugees), 208 (asylum), 212(d)(5) (parole), 244 (TPS)","—","—","DACA rests on a 2012 DHS memorandum/2022 rule; litigation (Texas v. United States) ongoing."),
]
for p in prog: ws.append(list(p))
wb.save(OUT+'population-voters.xlsx')
print("saved")
