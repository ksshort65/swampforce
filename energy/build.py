import pandas as pd, numpy as np, json, csv, os
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, matplotlib.dates as mdates
R='/workspace/energy/raw/'; O='/workspace/energy/'
def rd(f):
    df=pd.read_excel(R+f,sheet_name='Data 1',skiprows=2); df.columns=['date','v']; return df.dropna().reset_index(drop=True)
DNAV='https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s={s}&f={f}'
XLS='https://www.eia.gov/dnav/pet/hist_xls/{s}{f}.xls'
rows=[]
def add(sec,metric,period,val,unit,src,url,note=''):
    rows.append(dict(section=sec,metric=metric,period=period,value=val,unit=unit,source=src,source_url=url,notes=note))

# ---------- CPI
cpi=pd.read_csv(R+'fred_CPIAUCNS.csv'); cpi.columns=['date','cpi']; cpi['date']=pd.to_datetime(cpi.date)
C=lambda y,m: float(cpi[(cpi.date.dt.year==y)&(cpi.date.dt.month==m)].cpi.iloc[0])
cpi_jul08=C(2008,7); cpi_aug26=C(2026,8); cpi_may26=C(2026,5)
F_aug=cpi_aug26/cpi_jul08; F_may=cpi_may26/cpi_jul08
BLSURL='https://data.bls.gov/timeseries/CUUR0000SA0'; FREDURL='https://fred.stlouisfed.org/series/CPIAUCNS'
for p,v in [('2008-07',cpi_jul08),('2026-05',cpi_may26),('2026-08',cpi_aug26)]:
    add('Q1 inflation','CPI-U, U.S. city average, all items, NSA (1982-84=100)',p,v,'index','BLS CPI-U CUUR0000SA0 (via FRED CPIAUCNS; values match BLS API for 2026)',BLSURL+' ; '+FREDURL)
add('Q1 inflation','Inflation factor Jul 2008 -> Aug 2026','2008-07->2026-08',round(F_aug,4),'ratio','Computed from BLS CPI-U',BLSURL)
add('Q1 inflation','Inflation factor Jul 2008 -> May 2026','2008-07->2026-05',round(F_may,4),'ratio','Computed from BLS CPI-U',BLSURL)

# ---------- prices
gw=rd('EMM_EPMR_PTE_NUS_DPGw.xls'); gm=rd('EMM_EPMR_PTE_NUS_DPGm.xls')
wd=rd('RWTCd.xls'); bd=rd('RBRTEd.xls'); wm=rd('RWTCm.xls'); bm=rd('RBRTEm.xls')
cam=rd('EMM_EPMR_PTE_SCA_DPGm.xls'); caw=rd('EMM_EPMR_PTE_SCA_DPGw.xls')
gcm=rd('EER_EPMRU_PF4_RGC_DPGm.xls'); nym=rd('EER_EPMRU_PF4_Y35NY_DPGm.xls'); lam=rd('EER_EPMRR_PF4_Y05LA_DPGm.xls')
gcd=rd('EER_EPMRU_PF4_RGC_DPGd.xls')
def at(df,d): return float(df[df.date==pd.Timestamp(d)].v.iloc[0])
def mon(df,y,m): return float(df[(df.date.dt.year==y)&(df.date.dt.month==m)].v.iloc[0])
S='EIA'
facts={}
facts['gas_peak08']=at(gw,'2008-07-07'); facts['gas_latest']=float(gw.v.iloc[-1]); facts['gas_latest_date']=str(gw.date.iloc[-1].date())
facts['gas_jul08_m']=mon(gm,2008,7); facts['gas_aug26_m']=mon(gm,2026,8); facts['gas_may26_m']=mon(gm,2026,5)
facts['wti_peak']=at(wd,'2008-07-03'); facts['brent_peak']=at(bd,'2008-07-03')
facts['wti_latest']=float(wd.v.iloc[-1]); facts['brent_latest']=float(bd.v.iloc[-1]); facts['crude_latest_date']=str(wd.date.iloc[-1].date())
facts['wti_jul08_m']=mon(wm,2008,7); facts['brent_jul08_m']=mon(bm,2008,7); facts['wti_aug26_m']=mon(wm,2026,8); facts['brent_aug26_m']=mon(bm,2026,8)
facts['ca_jul08_m']=mon(cam,2008,7); facts['ca_latest']=float(caw.v.iloc[-1]); facts['ca_peak08_w']=float(caw[(caw.date>='2008-06-01')&(caw.date<='2008-07-31')].v.max())
u_gw=DNAV.format(s='EMM_EPMR_PTE_NUS_DPG',f='W'); u_gm=DNAV.format(s='EMM_EPMR_PTE_NUS_DPG',f='M')
u_wd=DNAV.format(s='RWTC',f='D'); u_bd=DNAV.format(s='RBRTE',f='D'); u_wm=DNAV.format(s='RWTC',f='M'); u_bm=DNAV.format(s='RBRTE',f='M')
add('Q1 prices','US regular gasoline retail, weekly (peak week 2008)','2008-07-07',facts['gas_peak08'],'$/gal',S+' EMM_EPMR_PTE_NUS_DPG',u_gw,'All-time 2008 weekly high')
add('Q1 prices','US regular gasoline retail, weekly (latest)',facts['gas_latest_date'],facts['gas_latest'],'$/gal',S+' EMM_EPMR_PTE_NUS_DPG',u_gw)
add('Q1 prices','US regular gasoline retail, monthly avg','2008-07',facts['gas_jul08_m'],'$/gal',S,u_gm)
add('Q1 prices','US regular gasoline retail, monthly avg','2026-05',facts['gas_may26_m'],'$/gal',S,u_gm,'Month of latest EIA pump-components breakdown')
add('Q1 prices','US regular gasoline retail, monthly avg','2026-08',facts['gas_aug26_m'],'$/gal',S,u_gm,'Latest full month')
add('Q1 prices','US regular gasoline all-time weekly high','2022-06-13',at(gw,'2022-06-13'),'$/gal',S,u_gw)
add('Q1 prices','WTI Cushing spot, daily (record)','2008-07-03',facts['wti_peak'],'$/bbl',S+' RWTC',u_wd)
add('Q1 prices','Brent spot, daily (record)','2008-07-03',facts['brent_peak'],'$/bbl',S+' RBRTE',u_bd)
add('Q1 prices','WTI Cushing spot, daily (latest)',facts['crude_latest_date'],facts['wti_latest'],'$/bbl',S,u_wd)
add('Q1 prices','Brent spot, daily (latest)',facts['crude_latest_date'],facts['brent_latest'],'$/bbl',S,u_bd)
for p,(a,b) in {'2008-07':(facts['wti_jul08_m'],facts['brent_jul08_m']),'2026-08':(facts['wti_aug26_m'],facts['brent_aug26_m'])}.items():
    add('Q1 prices','WTI spot, monthly avg',p,a,'$/bbl',S,u_wm); add('Q1 prices','Brent spot, monthly avg',p,b,'$/bbl',S,u_bm)
# real
for nm,v,f,lab in [('US gasoline weekly peak Jul 7 2008',facts['gas_peak08'],F_aug,'Aug-2026 $'),('US gasoline Jul 2008 monthly avg',facts['gas_jul08_m'],F_aug,'Aug-2026 $'),('WTI Jul 3 2008 record',facts['wti_peak'],F_aug,'Aug-2026 $'),('Brent Jul 3 2008 record',facts['brent_peak'],F_aug,'Aug-2026 $'),('WTI Jul 2008 monthly avg',facts['wti_jul08_m'],F_aug,'Aug-2026 $')]:
    add('Q1 inflation',nm+' in 2026 dollars','2008-07',round(v*f,3),'$ ('+lab+')','Computed: EIA price x BLS CPI-U ratio',u_gw if 'gasoline' in nm else u_wd)
# states weekly
stfiles={'California':'EMM_EPMR_PTE_SCA_DPGw','Texas':'EMM_EPMR_PTE_STX_DPGw','Florida':'EMM_EPMR_PTE_SFL_DPGw','New York':'EMM_EPMR_PTE_SNY_DPGw','Washington':'EMM_EPMR_PTE_SWA_DPGw','East Coast (PADD 1)':'EMM_EPMR_PTE_R10_DPGw','Midwest (PADD 2)':'EMM_EPMR_PTE_R20_DPGw','Gulf Coast (PADD 3)':'EMM_EPMR_PTE_R30_DPGw','Rocky Mountain (PADD 4)':'EMM_EPMR_PTE_R40_DPGw','West Coast (PADD 5)':'EMM_EPMR_PTE_R50_DPGw'}
state_tab=[]
for nm,s in stfiles.items():
    d=rd(s+'.xls'); j=d[(d.date>='2008-06-01')&(d.date<='2008-07-31')]; pk=j.loc[j.v.idxmax()]
    state_tab.append((nm,str(pk.date.date()),float(pk.v),round(float(pk.v)*F_aug,2),str(d.date.iloc[-1].date()),float(d.v.iloc[-1])))
    u=DNAV.format(s=s[:-1],f='W')
    add('Q1 prices',f'{nm} regular retail, weekly peak Jun-Jul 2008',str(pk.date.date()),float(pk.v),'$/gal',S,u)
    add('Q1 prices',f'{nm} regular retail, weekly latest',str(d.date.iloc[-1].date()),float(d.v.iloc[-1]),'$/gal',S,u)

# ---------- pump components
pc=pd.read_csv(R+'eia_gas_pump_components_history_raw.csv')
mm={'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'July':7,'Aug':8,'Sep':9,'Sept':9,'Oct':10,'Nov':11,'Dec':12}
pc['month']=pc.mon_yr.apply(lambda s: pd.Timestamp(2000+int(s.split('-')[1]), mm[s.split('-')[0]],1))
for c in ['refining','dist_marketing','taxes','crude']:
    pc[c+'_c']=pc.retail_usd_gal*pc[c+'_pct']  # cents
pc=pc.sort_values('month').reset_index(drop=True)
pc.to_csv(O+'data_eia_pump_components_monthly.csv',index=False)
PCURL='https://www.eia.gov/petroleum/gasdiesel/gaspump_hist.php'
j08=pc[pc.month=='2008-07-01'].iloc[0]; m26=pc[pc.month=='2026-05-01'].iloc[0]
comp={}
for c,lab in [('crude','Crude oil'),('refining','Refining costs & profits'),('dist_marketing','Distribution & marketing costs & profits'),('taxes','Taxes')]:
    a=j08[c+'_c']; b=m26[c+'_c']; ar=a*F_may
    comp[c]=(lab,j08[c+'_pct'],a,ar,m26[c+'_pct'],b)
    add('Q1 pump components',lab+' share','2008-07',j08[c+'_pct'],'% of retail',S+' Gasoline Pump Components History',PCURL)
    add('Q1 pump components',lab+' share','2026-05',m26[c+'_pct'],'% of retail',S+' Gasoline Pump Components History',PCURL)
    add('Q1 pump components',lab,'2008-07',round(a,1),'cents/gal','Computed: EIA share x EIA retail price',PCURL)
    add('Q1 pump components',lab+' (in May-2026 $)','2008-07',round(ar,1),'cents/gal (May-2026 $)','Computed with BLS CPI-U',PCURL)
    add('Q1 pump components',lab,'2026-05',round(b,1),'cents/gal','Computed: EIA share x EIA retail price',PCURL)
    add('Q1 pump components',lab+' change','2008-07->2026-05',round(b-a,1),'cents/gal nominal','Computed',PCURL)
# long-run averages of refining component
pc['year']=pc.month.dt.year
ann=pc.groupby('year')[['retail_usd_gal','refining_c','dist_marketing_c','taxes_c','crude_c','refining_pct']].mean().round(2)
ann.to_csv(O+'data_eia_pump_components_annual_avg.csv')
ref_avg_0019=pc[(pc.year>=2000)&(pc.year<=2019)].refining_c.mean()
dm_avg_0019=pc[(pc.year>=2000)&(pc.year<=2019)].dist_marketing_c.mean()
facts['ref_avg_2000_2019_c']=ref_avg_0019; facts['dm_avg_2000_2019_c']=dm_avg_0019
facts['ref_pct_rank_jul08']=int((pc.refining_pct<j08.refining_pct).sum()); facts['n_months']=len(pc)
add('Q1 pump components','Refining component, average 2000-2019 (nominal)','2000-2019',round(ref_avg_0019,1),'cents/gal','Computed from EIA pump components history',PCURL)

# ---------- crack spreads (computed)
def mmerge(a,b,name):
    x=a.merge(b,on='date',suffixes=('_g','_c')); x[name]=x.v_g-x.v_c/42; return x
cr=gcm.merge(bm,on='date',suffixes=('_gc','_b')).merge(wm.rename(columns={'v':'v_w'}),on='date').merge(nym.rename(columns={'v':'v_ny'}),on='date',how='left').merge(lam.rename(columns={'v':'v_la'}),on='date',how='left')
cr['gc_minus_brent']=cr.v_gc-cr.v_b/42; cr['gc_minus_wti']=cr.v_gc-cr.v_w/42; cr['ny_minus_brent']=cr.v_ny-cr.v_b/42; cr['la_minus_brent']=cr.v_la-cr.v_b/42
cr=cr.rename(columns={'v_gc':'gulf_coast_conv_gasoline_spot','v_b':'brent_spot','v_w':'wti_spot','v_ny':'nyh_conv_gasoline_spot','v_la':'la_rbob_spot'})
cr.to_csv(O+'data_gasoline_crack_spreads_monthly.csv',index=False)
cr['year']=cr.date.dt.year
crann=cr[cr.year>=2005].groupby('year')[['gc_minus_brent','gc_minus_wti','ny_minus_brent','la_minus_brent']].mean().round(3)
crann.to_csv(O+'data_gasoline_crack_spreads_annual.csv')
for y,r in crann.iterrows():
    add('Q1 crack spreads','Gulf Coast conventional gasoline spot minus Brent (annual avg)',str(y) + (' (Jan-Aug)' if y==2026 else ''),r.gc_minus_brent,'$/gal','Computed from EIA spot prices (EER_EPMRU_PF4_RGC_DPG, RBRTE)',DNAV.format(s='EER_EPMRU_PF4_RGC_DPG',f='M'))
for d in ['2008-07-15','2026-05-15','2026-08-15']:
    r=cr[cr.date==d].iloc[0]
    add('Q1 crack spreads','Gulf Coast gasoline minus Brent (monthly)',d[:7],round(r.gc_minus_brent,3),'$/gal','Computed from EIA spot prices',DNAV.format(s='EER_EPMRU_PF4_RGC_DPG',f='M'))
    add('Q1 crack spreads','LA RBOB minus Brent (monthly)',d[:7],round(r.la_minus_brent,3),'$/gal','Computed from EIA spot prices (EER_EPMRR_PF4_Y05LA_DPG)',DNAV.format(s='EER_EPMRR_PF4_Y05LA_DPG',f='M'))
# latest daily
dd=gcd.merge(bd,on='date',suffixes=('_g','_b')).merge(wd.rename(columns={'v':'v_w'}),on='date')
lt=dd.iloc[-1]; facts['gc_latest']=float(lt.v_g); facts['gc_latest_date']=str(lt.date.date()); facts['crack_latest_brent']=float(lt.v_g-lt.v_b/42); facts['crack_latest_wti']=float(lt.v_g-lt.v_w/42)
add('Q1 crack spreads','Gulf Coast gasoline spot minus Brent (daily latest)',facts['gc_latest_date'],round(facts['crack_latest_brent'],3),'$/gal','Computed from EIA daily spot prices',DNAV.format(s='EER_EPMRU_PF4_RGC_DPG',f='D'))
facts.update({k:float(cr[cr.date==d].iloc[0][c]) for k,d,c in [('crack_jul08','2008-07-15','gc_minus_brent'),('crack_may26','2026-05-15','gc_minus_brent'),('crack_aug26','2026-08-15','gc_minus_brent'),('crack_jul08_wti','2008-07-15','gc_minus_wti'),('crack_aug26_wti','2026-08-15','gc_minus_wti')]})

# ---------- refinery capacity & utilization & exports
cap=rd('MOCLEUS2m.xls'); util=rd('MOPUEUS2m.xls'); capa=rd('8_NA_8D0_NUS_5a.xls')
u_cap=DNAV.format(s='MOCLEUS2',f='M'); u_capa='https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=8_NA_8D0_NUS_5&f=A'
for d in ['2008-01-15','2008-07-15','2019-12-15','2020-01-15','2021-01-15','2022-01-15','2023-01-15','2024-01-15','2025-01-15','2026-01-15','2026-06-15']:
    add('Q1 refining capacity','US operable crude distillation capacity',d[:7],at(cap,d),'thousand b/cd',S+' MOCLEUS2',u_cap)
for d in ['2008-06-30','2020-06-30','2026-06-30']:
    add('Q1 refining capacity','US operable atmospheric distillation capacity as of Jan 1 (stream day)',d[:4],at(capa,d),'b/sd',S+' Refinery Capacity Report series 8_NA_8D0_NUS_5',u_capa)
facts['cap_jan08']=at(cap,'2008-01-15'); facts['cap_jan20']=at(cap,'2020-01-15'); facts['cap_jan26']=at(cap,'2026-01-15'); facts['cap_jun26']=at(cap,'2026-06-15')
for d in ['2008-07-15','2026-05-15','2026-06-15']:
    add('Q1 refining capacity','US refinery utilization of operable capacity',d[:7],at(util,d),'%',S+' MOPUEUS2',DNAV.format(s='MOPUEUS2',f='M'))
ge=rd('MGFEXUS2m.xls'); pe=rd('MTPEXUS2m.xls'); gea=rd('MGFEXUS2a.xls'); pea=rd('MTPEXUS2a.xls')
for y in [2008,2019,2020,2022,2024,2025]:
    add('Q1 exports','US exports of finished motor gasoline (annual)',str(y),float(gea[gea.date.dt.year==y].v.iloc[0]),'thousand b/d',S+' MGFEXUS2',DNAV.format(s='MGFEXUS2',f='A'))
    add('Q1 exports','US exports of finished petroleum products (annual)',str(y),float(pea[pea.date.dt.year==y].v.iloc[0]),'thousand b/d',S+' MTPEXUS2',DNAV.format(s='MTPEXUS2',f='A'))
for d in ['2008-07-15','2026-05-15','2026-06-15']:
    add('Q1 exports','US exports of finished motor gasoline (monthly)',d[:7],at(ge,d),'thousand b/d',S,DNAV.format(s='MGFEXUS2',f='M'))
facts['gasx_2008']=float(gea[gea.date.dt.year==2008].v.iloc[0]); facts['gasx_2025']=float(gea[gea.date.dt.year==2025].v.iloc[0])
facts['prodx_2008']=float(pea[pea.date.dt.year==2008].v.iloc[0]); facts['prodx_2025']=float(pea[pea.date.dt.year==2025].v.iloc[0])
gst=rd('WGTSTUS1w.xls'); facts['gas_stocks_latest']=float(gst.v.iloc[-1]); facts['gas_stocks_date']=str(gst.date.iloc[-1].date())
add('Q1 exports','US total gasoline stocks (weekly latest)',facts['gas_stocks_date'],facts['gas_stocks_latest'],'thousand bbl',S+' WGTSTUS1',DNAV.format(s='WGTSTUS1',f='W'),'Lowest for the comparable mid-September week in 2019-2026')

# ---------- refinery closures (EIA Refinery Capacity Report Table 11)
clos=[('Philadelphia Energy Solutions','Philadelphia, PA',335000,'shut 05/2020 (last operated 08/2019)','RCR 2021 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2021/table11.pdf'),
('Dakota Prairie Refining','Dickinson, ND',19000,'2020','RCR 2021 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2021/table11.pdf'),
('Shell Oil Products US','Convent, LA',211146,'shut 01/2021 (last operated 12/2020)','RCR 2021 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2021/table11.pdf'),
('Western Refining Southwest (Marathon)','Gallup, NM',27000,'2020','RCR 2021 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2021/table11.pdf'),
('HollyFrontier Cheyenne Refining','Cheyenne, WY',48000,'2020','RCR 2021 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2021/table11.pdf'),
('Tesoro Refining & Marketing (Marathon)','Martinez, CA',161000,'2020','RCR 2021 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2021/table11.pdf'),
('Phillips 66','Belle Chasse, LA',255600,'shut 12/2021','RCR 2022 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2022/table11.pdf'),
('Phillips 66','Rodeo, CA',58200,'shut 03/2024','RCR 2025 Table 11','https://www.eia.gov/petroleum/refinerycapacity/archive/2025/table11.pdf'),
('Houston Refining LP (LyondellBasell)','Houston, TX',263776,'02/2025','RCR 2026 Table 11','https://www.eia.gov/petroleum/refinerycapacity/table11.pdf'),
('Phillips 66','Los Angeles, CA',138700,'10/2025','RCR 2026 Table 11','https://www.eia.gov/petroleum/refinerycapacity/table11.pdf')]
for n,l,c,d,s,u in clos:
    add('Q1 refinery closures',f'{n} ({l}) shutdown, crude distillation capacity',d,c,'b/cd','EIA '+s,u)
add('Q1 refinery closures','Valero Benicia (CA) refinery - processing units fully idled','2026-04','n/a (EIA RCR 2026 lists it as operable as of Jan 1 2026)','','Valero Form 10-Q for Q2 2026 (filed 2026-07-30)','https://www.sec.gov/Archives/edgar/data/1035002/000162828026050937/')
facts['closures_total']=sum(c for *_,c,_,_,_ in [(a,b,c,d,e,f) for a,b,c,d,e,f in clos])

# ---------- refiner profits (SEC XBRL)
UAh={'User-Agent':'x'}
co={'Valero Energy':('0001035002','1035002'),'Marathon Petroleum':('0001510295','1510295'),'Phillips 66':('0001534701','1534701')}
prof=[]
for n,(cik,c2) in co.items():
    d=json.load(open(R+f'cf_{cik}.json'))['facts']['us-gaap']['NetIncomeLoss']['units']['USD']
    fr={u['frame']:u for u in d if 'frame' in u}
    for k in ['CY2008','CY2019','CY2020','CY2021','CY2022','CY2023','CY2024','CY2025','CY2025Q2','CY2026Q1','CY2026Q2']:
        if k in fr:
            u=fr[k]; url=f"https://www.sec.gov/Archives/edgar/data/{c2}/{u['accn'].replace('-','')}/"
            prof.append((n,k,u['val']/1e9,u['form'],u['accn'],url))
            add('Q1 refiner profits',f'{n} net income attributable to shareholders',k,round(u['val']/1e9,3),'$ billion',f"SEC {u['form']} XBRL (accession {u['accn']})",url)
pd.DataFrame(prof,columns=['company','period','net_income_bil','form','accession','filing_index_url']).to_csv(O+'data_refiner_net_income_sec.csv',index=False)
facts['q2_26_total']=sum(v for n,k,v,*_ in prof if k=='CY2026Q2'); facts['q2_25_total']=sum(v for n,k,v,*_ in prof if k=='CY2025Q2')

# ---------- taxes
add('Q1 taxes','Federal gasoline excise tax + LUST fee','2008 and 2026',18.4,'cents/gal','FHWA Highway Statistics 2008 Table MF-121T; EIA Federal and State Motor Fuels Taxes (July 2026)','https://www.fhwa.dot.gov/policyinformation/statistics/2008/mf121t.cfm','Unchanged since 1993')
add('Q1 taxes','Weighted average state gasoline excise tax','2008',20.481,'cents/gal','FHWA Highway Statistics 2008 Table MF-121T','https://www.fhwa.dot.gov/policyinformation/statistics/2008/mf121t.cfm','Excise only; excludes sales taxes')
add('Q1 taxes','Average state gasoline tax incl. other taxes & fees','2026-07',33.76,'cents/gal','EIA Federal and State Motor Fuels Taxes (July 2026, revised Aug 2026)','https://www.eia.gov/petroleum/marketing/monthly/xls/fueltaxes.xlsx')
add('Q1 taxes','Average state + federal gasoline tax','2026-07',52.16,'cents/gal','EIA fueltaxes.xlsx','https://www.eia.gov/petroleum/marketing/monthly/xls/fueltaxes.xlsx')
add('Q1 taxes','California state excise gasoline tax','2008',18.0,'cents/gal','FHWA MF-121T 2008 (plus sales tax applied to price)','https://www.fhwa.dot.gov/policyinformation/statistics/2008/mf121t.cfm')
add('Q1 taxes','California state gasoline tax (excise 63.4 + other 10.24)','2026-07',73.64,'cents/gal','EIA fueltaxes.xlsx','https://www.eia.gov/petroleum/marketing/monthly/xls/fueltaxes.xlsx')
add('Q1 California','CA Low Carbon Fuel Standard cost in gasoline price','2026',18,'cents/gal (approx)','California Energy Commission FAQ (updated Aug 26 2026)','https://www.energy.ca.gov/programs-and-topics/topics/petroleum-fuels-transition/faq-california-gas-prices-and-impacts-iran')
add('Q1 California','CA Cap-and-Invest cost in gasoline price','2026',23,'cents/gal (approx)','California Energy Commission FAQ','https://www.energy.ca.gov/programs-and-topics/topics/petroleum-fuels-transition/faq-california-gas-prices-and-impacts-iran')
add('Q1 California','CA branded minus unbranded gasoline price spread','2026',0.31,'$/gal','CEC Division of Petroleum Market Oversight, Market Update June 12 2026','https://www.energy.ca.gov/sites/default/files/2026-06/DPMO_California_Gasoline_Diesel_Market_Update_June_2026_ada.pdf','vs $0.06 rest of US')

OF=[('FTC post-Katrina gasoline investigation: no evidence of illegal market manipulation; 15 firms met statutory price-gouging definition but most explained by regional/market factors','2006-05',"FTC report, May 2006",'https://www.ftc.gov/news-events/news/press-releases/2006/05/ftc-releases-report-its-investigation-gasoline-price-manipulation-post-katrina-gasoline-price'),
('FTC Bureau of Economics: retail gasoline prices rise faster than they fall ("rockets and feathers") - asymmetric pass-through documented','2011-09','FTC BE report, Sep 2011','https://www.ftc.gov/reports/federal-trade-commission-bureau-economics-gasoline-price-changes-petroleum-industry-update'),
('CFTC: federal court consent order (Apr 19 2012) against Optiver for manipulation/attempted manipulation ("banging the close") of NYMEX crude, heating oil and NY Harbor gasoline futures in Mar 2007; $13M penalty + $1M disgorgement','2012-04-19','CFTC press release 6239-12','https://www.cftc.gov/PressRoom/PressReleases/6239-12'),
('California AG lawsuit (filed May 2020) alleged Vitol and SK Energy manipulated California gasoline spot-market prices after the Feb 2015 Torrance refinery explosion; resolved by $50M settlement Jul 10 2024 ($37.5M consumers, $12.5M civil penalty). Allegations settled, not adjudicated','2024-07-10','California Attorney General press release','https://oag.ca.gov/news/press-releases/attorney-general-bonta-announces-50-million-settlement-vitol-and-sk-part-ongoing'),
('DOJ Antitrust Division + FTC joint letter to state AGs (Jul 3 2026): says too much of crude price cut is being withheld from pump prices and both agencies are closely monitoring; urges state investigations. Not a finding of illegal conduct','2026-07-03','DOJ/FTC letter','https://www.justice.gov/atr/media/1450951/dl?inline='),
('California Energy Commission: no max gross refining margin or penalty set under SB X1-2; Aug 29 2025 resolution defers action at least 5 years - zero penalty findings','2025-08-29','CEC resolution TN 265835','https://efiling.energy.ca.gov/GetDocument.aspx?tn=265835'),
('CEC Division of Petroleum Market Oversight: Mar 19 2026 enforcement bulletin; ~20 high-priced stations contacted; investigation ongoing, no findings published','2026-06-12','CEC DPMO market update June 2026','https://www.energy.ca.gov/sites/default/files/2026-06/DPMO_California_Gasoline_Diesel_Market_Update_June_2026_ada.pdf')]
for t,d,src,u in OF: add('Q1 official findings',t,d,'','finding',src,u)
pd.DataFrame(rows).to_csv(O+'oil-vs-gas.csv',index=False)
json.dump({k:(float(v) if isinstance(v,(int,float,np.floating,np.integer)) else v) for k,v in facts.items()},open(O+'facts_q1.json','w'),indent=1)
json.dump({k:[comp[k][0]]+[float(x) for x in comp[k][1:]] for k in comp},open(O+'components_q1.json','w'),indent=1)
print(json.dumps(facts,indent=1,default=float)); print(comp); print(crann); print(state_tab); print(ann.loc[[2005,2008,2015,2019,2020,2022,2024,2025,2026]])

# ---------- charts
plt.rcParams.update({'font.size':10,'text.parse_math':False})
fig,ax=plt.subplots(figsize=(9,6.2))
labs=['July 2008\n(nominal)','July 2008\n(in May-2026 $, CPI-U)','May 2026\n(latest EIA breakdown)']
order=[('crude','#5b3a29'),('refining','#d62728'),('dist_marketing','#1f77b4'),('taxes','#7f7f7f')]
vals={'crude':[comp['crude'][2],comp['crude'][3],comp['crude'][5]]}
for k,_ in order: vals[k]=[comp[k][2],comp[k][3],comp[k][5]]
bottom=np.zeros(3)
for k,col in order:
    v=np.array(vals[k])/100; ax.bar(labs,v,bottom=bottom,color=col,label=comp[k][0],width=0.6,edgecolor='white')
    for i in range(3): ax.text(i,bottom[i]+v[i]/2,f'${v[i]:.2f}',ha='center',va='center',color='white',fontsize=9,fontweight='bold')
    bottom+=v
tops=[j08.retail_usd_gal,j08.retail_usd_gal*F_may,m26.retail_usd_gal]
for i in range(3): ax.text(i,bottom[i]+0.07,f'Retail ${tops[i]:.2f}',ha='center',fontweight='bold')
ax.set_ylabel('Dollars per gallon'); ax.set_ylim(0,max(bottom)+0.6)
ax.set_title('What we pay for in a gallon of U.S. regular gasoline:\nJuly 2008 vs May 2026 (EIA pump components)')
ax.legend(loc='upper right',fontsize=8.5,framealpha=0.9)
fig.text(0.01,0.01,'Source: EIA Gasoline Pump Components History (eia.gov/petroleum/gasdiesel/gaspump_hist.php); inflation: BLS CPI-U (May 2026/July 2008 = %.3f).\nEIA "refining" = spot gasoline minus refiner crude cost (costs + profits); "distribution & marketing" = retail minus the other three.\nSegments are EIA percentage shares x retail price; shares may not sum exactly to 100 because of rounding.'%F_may,fontsize=7)
plt.tight_layout(rect=(0,0.05,1,1)); plt.savefig(O+'charts/oil-vs-gas-components-2008-vs-2026.png',dpi=150); plt.close()

# line chart 2005-2026: weekly
gw2=gw[gw.date>='2005-01-01'].set_index('date').v
w_w=wd.set_index('date').v.resample('W-MON').mean(); b_w=bd.set_index('date').v.resample('W-MON').mean()
cp=cpi.set_index('date').cpi
real=gw2.copy(); mcp=cp.reindex(pd.date_range('2005-01-01','2026-09-30',freq='MS')).ffill()
real=pd.Series([v*cpi_aug26/float(mcp[pd.Timestamp(d.year,d.month,1)]) for d,v in gw2.items()],index=gw2.index)
fig,ax=plt.subplots(figsize=(11,6)); ax2=ax.twinx()
ax.plot(w_w[w_w.index>='2005-01-01'],color='#5b3a29',lw=1.1,label='WTI crude, $/bbl (left)')
ax.plot(b_w[b_w.index>='2005-01-01'],color='#e6a23c',lw=1.1,label='Brent crude, $/bbl (left)')
ax2.plot(gw2,color='#d62728',lw=1.6,label='U.S. regular gasoline retail, $/gal (right)')
ax2.plot(real,color='#d62728',lw=1,ls='--',alpha=0.6,label='Gasoline in Aug-2026 dollars (CPI-U), $/gal (right)')
ax.set_ylim(0,210); ax2.set_ylim(0,7)
ax.set_ylabel('Crude oil, dollars per barrel'); ax2.set_ylabel('Gasoline, dollars per gallon')
ax.annotate(f'Jul 2008: WTI ${facts["wti_peak"]:.0f}, gas ${facts["gas_peak08"]:.2f}',xy=(pd.Timestamp('2008-07-07'),143),xytext=(pd.Timestamp('2009-01-01'),200),arrowprops=dict(arrowstyle='->'),fontsize=8.5)
ax.annotate(f'Sep 2026: WTI ${facts["wti_latest"]:.0f}, Brent ${facts["brent_latest"]:.0f}, gas ${facts["gas_latest"]:.2f}',xy=(pd.Timestamp('2026-09-21'),facts['gas_latest']*30),xytext=(pd.Timestamp('2017-06-01'),185),arrowprops=dict(arrowstyle='->'),fontsize=8.5)
h1,l1=ax.get_legend_handles_labels(); h2,l2=ax2.get_legend_handles_labels(); ax.legend(h1+h2,l1+l2,loc='lower left',fontsize=8,ncol=2,framealpha=0.95)
ax.set_title('Crude oil vs. U.S. retail gasoline, weekly, Jan 2005 - Sep 2026 (axes scaled so $30/bbl = $1/gal)')
ax.grid(alpha=0.3); ax.xaxis.set_major_locator(mdates.YearLocator(2)); ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
fig.text(0.01,0.01,'Sources: EIA spot prices RWTC, RBRTE (daily, averaged weekly); EIA weekly retail gasoline EMM_EPMR_PTE_NUS_DPG; BLS CPI-U (via FRED CPIAUCNS). Latest: gas %s, crude %s.'%(facts['gas_latest_date'],facts['crude_latest_date']),fontsize=7)
plt.tight_layout(rect=(0,0.03,1,1)); plt.savefig(O+'charts/oil-vs-gas-crude-vs-retail-2005-2026.png',dpi=150); plt.close()

# crack chart
c2=cr[cr.date>='2005-01-01']
fig,ax=plt.subplots(figsize=(11,4.8))
ax.plot(c2.date,c2.gc_minus_brent,color='#d62728',lw=1.3,label='Gulf Coast conventional gasoline spot minus Brent')
ax.plot(c2.date,c2.la_minus_brent,color='#9467bd',lw=1,alpha=0.8,label='Los Angeles reformulated RBOB spot minus Brent')
ax.axhline(0,color='k',lw=0.6); ax.set_ylabel('Dollars per gallon'); ax.grid(alpha=0.3)
ax.set_title('Wholesale gasoline "crack spread" vs Brent crude, monthly, 2005 - Aug 2026 (computed from EIA spot prices)')
ax.legend(fontsize=8.5,loc='upper left'); ax.annotate('Jul 2008: ~$0.00',xy=(pd.Timestamp('2008-07-15'),facts['crack_jul08']),xytext=(pd.Timestamp('2009-06-01'),-0.4),arrowprops=dict(arrowstyle='->'),fontsize=8.5)
fig.text(0.01,0.01,'Sources: EIA EER_EPMRU_PF4_RGC_DPG, EER_EPMRR_PF4_Y05LA_DPG, RBRTE monthly. Crack = product $/gal minus crude $/bbl / 42. Gross margin, not profit.',fontsize=7)
plt.tight_layout(rect=(0,0.04,1,1)); plt.savefig(O+'charts/oil-vs-gas-gasoline-crack-spread-2005-2026.png',dpi=150); plt.close()
