import pandas as pd, numpy as np, json
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, matplotlib.dates as mdates
R='/workspace/energy/raw/'; O='/workspace/energy/'
def rd(f):
    df=pd.read_excel(R+f,sheet_name='Data 1',skiprows=2); df.columns=['date','v']; return df.dropna().reset_index(drop=True)
DNAV='https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s={s}&f={f}'
wd=rd('RWTCd.xls'); bd=rd('RBRTEd.xls'); gw=rd('EMM_EPMR_PTE_NUS_DPGw.xls'); caw=rd('EMM_EPMR_PTE_SCA_DPGw.xls')
spr=rd('WCSSTUS1w.xls'); cx=rd('WCREXUS2w.xls'); px=rd('WRPEXUS2w.xls'); gx=rd('W_EPM0F_EEX_NUS-Z00_MBBLDw.xls')
rows=[]
def add(sec,metric,period,val,unit,src,url,note=''):
    rows.append(dict(section=sec,metric=metric,period=period,value=val,unit=unit,source=src,source_url=url,notes=note))
U={'b':DNAV.format(s='RBRTE',f='D'),'w':DNAV.format(s='RWTC',f='D'),'g':DNAV.format(s='EMM_EPMR_PTE_NUS_DPG',f='W'),'ca':DNAV.format(s='EMM_EPMR_PTE_SCA_DPG',f='W'),
   'spr':DNAV.format(s='WCSSTUS1',f='W'),'cx':DNAV.format(s='WCREXUS2',f='W'),'px':DNAV.format(s='WRPEXUS2',f='W'),'gx':DNAV.format(s='W_EPM0F_EEX_NUS-Z00_MBBLD',f='W')}
start=pd.Timestamp('2026-02-28')
F={}
def pt(df,d): return float(df[df.date==pd.Timestamp(d)].v.iloc[0])
F['brent_pre']=pt(bd,'2026-02-27'); F['wti_pre']=pt(wd,'2026-02-27'); F['gas_pre']=pt(gw,'2026-02-23'); F['ca_pre']=pt(caw,'2026-02-23')
F['brent_janfeb_avg']=bd[(bd.date>='2026-01-01')&(bd.date<start)].v.mean(); F['wti_janfeb_avg']=wd[(wd.date>='2026-01-01')&(wd.date<start)].v.mean()
a=bd[bd.date>=start]; F['brent_max']=float(a.v.max()); F['brent_max_date']=str(a.loc[a.v.idxmax()].date.date())
a=wd[wd.date>=start]; F['wti_max']=float(a.v.max()); F['wti_max_date']=str(a.loc[a.v.idxmax()].date.date())
a=gw[gw.date>=start]; F['gas_max']=float(a.v.max()); F['gas_max_date']=str(a.loc[a.v.idxmax()].date.date())
a=bd[bd.date>=start]; F['brent_min_since']=float(a.v.min()); F['brent_min_date']=str(a.loc[a.v.idxmin()].date.date())
a=gw[gw.date>=start]; F['gas_min_since']=float(a.v.min()); F['gas_min_date']=str(a.loc[a.v.idxmin()].date.date())
F['brent_latest']=float(bd.v.iloc[-1]); F['wti_latest']=float(wd.v.iloc[-1]); F['crude_date']=str(bd.date.iloc[-1].date())
F['gas_latest']=float(gw.v.iloc[-1]); F['gas_date']=str(gw.date.iloc[-1].date()); F['ca_latest']=float(caw.v.iloc[-1])
phases=[('Pre-war (Jan 1 - Feb 27, 2026)','2026-01-01','2026-02-27'),('War to blockade (Feb 28 - Apr 12)','2026-02-28','2026-04-12'),('Blockade of Iranian ports (Apr 13 - Jun 16)','2026-04-13','2026-06-16'),('MOU / ceasefire (Jun 17 - Jul 6)','2026-06-17','2026-07-06'),('Renewed strikes onward (Jul 7 - latest)','2026-07-07','2026-09-30')]
ph=[]
for n,s,e in phases:
    b=bd[(bd.date>=s)&(bd.date<=e)].v.mean(); w=wd[(wd.date>=s)&(wd.date<=e)].v.mean(); g=gw[(gw.date>=s)&(gw.date<=e)].v.mean()
    ph.append((n,round(b,2),round(w,2),round(g,3)))
    add('Iran prices','Brent spot average',n,round(b,2),'$/bbl','EIA RBRTE (computed avg)',U['b']); add('Iran prices','WTI spot average',n,round(w,2),'$/bbl','EIA RWTC (computed avg)',U['w']); add('Iran prices','US regular retail gasoline average',n,round(g,3),'$/gal','EIA weekly retail (computed avg)',U['g'])
for k,(m,p,u,un,src) in {'brent_pre':('Brent spot, last trading day before war','2026-02-27','b','$/bbl','EIA RBRTE'),'wti_pre':('WTI spot, last trading day before war','2026-02-27','w','$/bbl','EIA RWTC'),'gas_pre':('US regular retail, last weekly reading before war','2026-02-23','g','$/gal','EIA'),'ca_pre':('California regular retail, last weekly before war','2026-02-23','ca','$/gal','EIA'),
    'brent_max':('Brent spot, highest since war began',F['brent_max_date'],'b','$/bbl','EIA'),'wti_max':('WTI spot, highest since war began',F['wti_max_date'],'w','$/bbl','EIA'),'gas_max':('US regular retail, highest weekly since war began',F['gas_max_date'],'g','$/gal','EIA'),
    'brent_latest':('Brent spot, latest',F['crude_date'],'b','$/bbl','EIA'),'wti_latest':('WTI spot, latest',F['crude_date'],'w','$/bbl','EIA'),'gas_latest':('US regular retail, latest weekly',F['gas_date'],'g','$/gal','EIA'),'ca_latest':('California regular retail, latest weekly',F['gas_date'],'ca','$/gal','EIA')}.items():
    add('Iran prices',m,p,F[k],un,src,U[u])
# SPR & trade
F['spr_pre']=pt(spr,'2026-02-27'); F['spr_latest']=float(spr.v.iloc[-1]); F['spr_date']=str(spr.date.iloc[-1].date())
add('Iran US response','SPR crude stocks, week before war','2026-02-27',F['spr_pre'],'thousand bbl','EIA WCSSTUS1',U['spr'])
add('Iran US response','SPR crude stocks, latest',F['spr_date'],F['spr_latest'],'thousand bbl','EIA WCSSTUS1',U['spr'],'Lowest weekly level since Oct-Nov 1982')
add('Iran US response','SPR drawdown since war began','2026-02-27 -> '+F['spr_date'],F['spr_pre']-F['spr_latest'],'thousand bbl','Computed from EIA WCSSTUS1',U['spr'])
add('Iran US response','SPR release authorized (exchange) as part of IEA 400M-bbl collective action','2026-03-11',172,'million bbl','DOE statement, Secretary Chris Wright, Mar 11 2026','https://www.energy.gov/articles/united-states-release-172-million-barrels-oil-strategic-petroleum-reserve')
add('Iran US response','SPR exchange RFP, first tranche','2026-03-13',86,'million bbl','DOE, Mar 13 2026','https://www.energy.gov/articles/energy-department-initiates-strategic-petroleum-reserve-emergency-exchange-stabilize')
for nm,df,u in [('US crude oil exports',cx,'cx'),('US total petroleum product exports',px,'px'),('US motor gasoline exports',gx,'gx')]:
    pre=df[(df.date>='2025-12-01')&(df.date<start)].v.mean(); post=df[df.date>=start].v.mean()
    add('Iran US trade',nm+' avg, Dec 2025 - Feb 27 2026','pre-war',round(pre),'thousand b/d','EIA weekly (computed avg)',U[u]); add('Iran US trade',nm+' avg, Feb 28 2026 - latest','since war',round(post),'thousand b/d','EIA weekly (computed avg)',U[u])
    F[u+'_pre']=pre; F[u+'_post']=post
# Hormuz
TIE='https://www.eia.gov/todayinenergy/detail.php?id=65504'
add('Iran Hormuz','Oil flow through Strait of Hormuz','2024',20,'million b/d','EIA Today in Energy, Jun 16 2025',TIE,'~20% of global petroleum liquids consumption; >1/4 of seaborne oil trade')
add('Iran Hormuz','Share of Hormuz crude & condensate going to Asia','2024',84,'%','EIA Today in Energy, Jun 16 2025',TIE)
add('Iran Hormuz','Saudi/UAE pipeline capacity available to bypass Hormuz','2025 est.',2.6,'million b/d','EIA Today in Energy, Jun 16 2025',TIE)
add('Iran Hormuz','US crude & condensate imports via Hormuz','2024',0.5,'million b/d','EIA Today in Energy, Jun 16 2025',TIE,'~7% of US crude imports; 2% of US liquids consumption')
STEO='https://www.eia.gov/outlooks/steo/pdf/steo_full.pdf'
add('Iran Hormuz','Middle East crude production shut-ins (EIA est.)','Mar-Jun 2026 avg',9.435,'million b/d','EIA STEO Sep 2026 Table 1',STEO)
add('Iran Hormuz','Middle East crude production shut-ins (EIA est.)','Aug 2026',6.72,'million b/d','EIA STEO Sep 2026 Table 1',STEO)
add('Iran Hormuz','Middle East crude production shut-ins (EIA forecast)','4Q 2026',5.663,'million b/d','EIA STEO Sep 2026 Table 1',STEO)
IEA='https://www.iea.org/reports/oil-market-report-september-2026'
add('Iran Hormuz','Total oil exports from Gulf countries','Aug 2026',13,'million b/d (approx)','IEA Oil Market Report, Sep 9 2026',IEA,'"nearly half their pre-war level"')
add('Iran Hormuz','Global observed oil inventory draw since February','Feb-Aug 2026',507,'million bbl','IEA OMR Sep 2026',IEA)
# Iran production
add('Iran production','Iran crude oil production (EIA)','2025 avg',3.38,'million b/d','EIA STEO Sep 2026 Table 3c',STEO)
add('Iran production','Iran crude oil production (EIA)','1Q 2026',3.35,'million b/d','EIA STEO Sep 2026 Table 3c',STEO)
add('Iran production','Iran crude oil production (EIA)','2Q 2026',2.85,'million b/d','EIA STEO Sep 2026 Table 3c',STEO)
add('Iran production','Iran crude oil production, Feb 2026 (EIA)','2026-02',3.39,'million b/d','EIA STEO Sep 2026 Table 1',STEO)
add('Iran production','Iran shut-ins (EIA est.)','Mar-Jun 2026 avg / Jul / Aug',"0.455 / 0.200 / 1.000",'million b/d','EIA STEO Sep 2026 Table 1',STEO)
OP='https://www.opec.org/assets/assetdb/momr-august-2026.pdf'
for p,v in [('2025',3.263),('1Q 2026',3.142),('2Q 2026',2.532),('May 2026',2.278),('Jun 2026',2.451),('Jul 2026',2.478)]:
    add('Iran production','Iran crude oil production (OPEC secondary sources)',p,v,'million b/d','OPEC Monthly Oil Market Report, Aug 2026, Table 5-7',OP)
add('Iran production','Iran crude oil supply (IEA)','Jul 2026',2.72,'million b/d','IEA OMR Sep 2026',IEA)
add('Iran production','Iran crude oil supply (IEA)','Aug 2026',2.16,'million b/d','IEA OMR Sep 2026',IEA)
add('Iran production','Iran sustainable crude capacity (IEA)','2026',3.8,'million b/d','IEA OMR Sep 2026',IEA)
SHIP='https://www.eia.gov/international/content/analysis/special_topics/SHIP_Act/SHIP-Act.pdf'
for y,t,c,rev in [(2018,1976,609,51),(2019,651,315,11),(2020,343,287,5),(2021,808,658,19),(2022,923,757,38),(2023,1276,1124,43),(2024,1445,1384,49),(2025,1576,1567,48)]:
    add('Iran exports','Iran crude & condensate exports (Vortexa est., cited by EIA)',str(y),t,'thousand b/d','EIA SHIP Act report, Jun 2026, Table 2',SHIP)
    add('Iran exports','...of which to China (incl. unknown/SE Asia destinations EIA assesses as China-bound)',str(y),c,'thousand b/d','EIA SHIP Act report, Jun 2026, Table 3',SHIP)
    add('Iran exports','Iran crude export revenue, undiscounted (EIA est.)',str(y),rev,'$ billion','EIA SHIP Act report, Jun 2026, Table 1',SHIP)
TL=[('2026-02-28','U.S. (with Israel) begins strikes on Iranian missile sites, maritime mining capabilities, air defenses; objective includes free flow of commerce through Strait of Hormuz','War Powers Resolution letter, Mar 2 2026 (H. Doc. 119-139)','https://www.govinfo.gov/content/pkg/CDOC-119hdoc139/pdf/CDOC-119hdoc139.pdf'),
('2026-02-28','UN Secretary-General condemns strikes and Iranian attacks on Gulf states; notes reports Iran closing Hormuz','UN SG remarks SG/SM/23033','https://press.un.org/en/2026/sgsm23033.doc.htm'),
('2026-03-11','IEA members agree 400M bbl collective release; US commits 172M bbl SPR','DOE statement','https://www.energy.gov/articles/united-states-release-172-million-barrels-oil-strategic-petroleum-reserve'),
('2026-04-13','CENTCOM begins blockade of all maritime traffic entering/exiting Iranian ports, 10 a.m. ET (announced Apr 12)','CENTCOM release, Apr 12 2026 (mirrored by U.S. Mission China)','https://cn.usembassy.gov/u-s-to-blockade-ships-entering-or-exiting-iranian-ports/'),
('2026-06-17','U.S.-Iran ceasefire/MOU; conditions to reopen Hormuz (CEC timeline). White House Jun 19: MOU signed, reopens Hormuz','White House Jun 19 2026; California Energy Commission FAQ','https://www.whitehouse.gov/releases/2026/06/president-trumps-iran-agreement-is-america-first-in-action/'),
('2026-07-07','CENTCOM strikes ~80 targets (Jul 7) and ~90 targets (Jul 8) after Iran attacked 3 commercial vessels in Hormuz, "violating the ceasefire"','CENTCOM release, Jul 8 2026','https://www.centcom.mil/MEDIA/PUBLIC-RELEASES/Article/4538814/us-forces-complete-another-round-of-strikes-against-iran/'),
('2026-07-10','Treasury cites Iran resumption of attacks on shipping; names Mojtaba Khamenei as Iran leader','Treasury press release sb0558','https://home.treasury.gov/news/press-releases/sb0558'),
('2026-08-24','Treasury "Operation Economic Outcast": ~60 designations incl. shadow-fleet tankers carrying Iranian oil to China','Treasury press release sb0613','https://home.treasury.gov/news/press-releases/sb0613')]
for d,t,src,u in TL: add('Iran timeline',t,d,'','event',src,u)
pd.DataFrame(rows).to_csv(O+'iran-energy.csv',index=False)
json.dump({k:(float(v) if isinstance(v,(int,float,np.floating)) else v) for k,v in F.items()},open(O+'facts_iran.json','w'),indent=1)
print(json.dumps(F,indent=1,default=float)); print(ph)

# chart
plt.rcParams.update({'font.size':10,'text.parse_math':False})
s0=pd.Timestamp('2025-11-01')
b=bd[bd.date>=s0]; w=wd[wd.date>=s0]; g=gw[gw.date>=s0]
fig,ax=plt.subplots(figsize=(11.5,6.2)); ax2=ax.twinx()
ax.plot(b.date,b.v,color='#e6a23c',lw=1.4,label='Brent spot, $/bbl (left)'); ax.plot(w.date,w.v,color='#5b3a29',lw=1.4,label='WTI spot, $/bbl (left)')
ax2.plot(g.date,g.v,color='#d62728',lw=2,marker='o',ms=2.5,label='U.S. regular gasoline retail, $/gal (right)')
ax.set_ylim(40,150); ax2.set_ylim(40/30,150/30)
ev=[('2026-02-28','Feb 28: U.S.-Israeli strikes on Iran begin\n(War Powers letter; UN SG)', 'k','-'),('2026-03-11','Mar 11: IEA 400M bbl release;\nU.S. SPR 172M bbl (DOE)','#2ca02c','--'),('2026-04-13','Apr 13: U.S. blockade of\nIranian ports (CENTCOM; Pres. remarks)','#1f77b4','--'),('2026-06-17','Jun 17: U.S.-Iran MOU;\nHormuz to reopen (CEC; White House)','#9467bd','--'),('2026-07-07','Jul 7-8: U.S. strikes resume after Iran\nattacks 3 ships (CENTCOM)','#8c564b','--')]
pos=[(147,'right'),(60,'left'),(147,'left'),(60,'left'),(147,'left')]
for (d,t,c,ls),(y,ha) in zip(ev,pos):
    ax.axvline(pd.Timestamp(d),color=c,ls=ls,lw=1.3 if ls=='-' else 1)
    off=pd.Timedelta(days=-2) if ha=='right' else pd.Timedelta(days=2)
    ax.text(pd.Timestamp(d)+off,y,t,fontsize=7.3,va='top',ha=ha,color=c,bbox=dict(facecolor='white',alpha=0.85,edgecolor='none',pad=1))
ax.set_ylabel('Crude oil, dollars per barrel'); ax2.set_ylabel('Gasoline, dollars per gallon')
h1,l1=ax.get_legend_handles_labels(); h2,l2=ax2.get_legend_handles_labels(); ax.legend(h1+h2,l1+l2,loc='lower left',fontsize=8.5,framealpha=0.95)
ax.set_title('Oil and U.S. gasoline prices before and during the 2026 U.S.-Iran conflict (Nov 2025 - Sep 22, 2026)')
ax.grid(alpha=0.3); ax.xaxis.set_major_locator(mdates.MonthLocator()); ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\n%Y'))
fig.text(0.01,0.01,'Prices: EIA daily spot RBRTE, RWTC; EIA weekly retail EMM_EPMR_PTE_NUS_DPG (latest %s / %s). Axes scaled so $30/bbl = $1/gal. Event dates from the sources named in each label.'%(F['crude_date'],F['gas_date']),fontsize=7)
plt.tight_layout(rect=(0,0.03,1,1)); plt.savefig(O+'charts/iran-energy-prices-2026.png',dpi=150); plt.close()
