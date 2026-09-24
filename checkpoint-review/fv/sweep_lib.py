import json,csv,re
from urllib.parse import urlparse
PRIM=['congress.gov','bls.gov','cbp.gov','cbo.gov','gao.gov','ssa.gov','justice.gov','oig.dhs.gov','dhs.gov','ice.gov','whitehouse.gov','courtlistener.com','documentcloud.org','c-span.org','cdc.gov','sigar.mil','govinfo.gov','fema.gov','supremecourt.gov','kansascityfed.org','jct.gov','fec.gov','trumpwhitehouse.archives.gov','law.cornell.edu','supreme.justia.com','fiscaldata.treasury.gov','uscis.gov','dni.gov','intelligence.senate.gov','doioig.gov','permanent.fdlp.gov','nyc.gov','uscp.gov','fns.usda.gov','fbi.gov','state.gov','senate.gov','house.gov','presidency.ucsb.edu','debates.org','nycourts.gov','manhattanda.org','fda.gov','hhs.gov','oig.hhs.gov','archives.gov','federalregister.gov','uscourts.gov','treasury.gov','usda.gov','eia.gov','iaea.org','ny.gov','ca.gov','gpo.gov','defense.gov','ed.gov','energy.gov','nih.gov','census.gov','bea.gov','irs.gov','ftc.gov','fcc.gov','usps.com','usaspending.gov','foreignassistance.gov','usaid.gov','cisa.gov','oyez.org','sec.gov','war.gov','harfordcountystatesattorney.org','macpac.gov','ojp.gov','illinoiscourts.gov','history.house.gov','fultonclerk.org','ag.ny.gov']
POLIT=['homeland.house.gov','judiciary.house.gov','budget.house.gov','democrats-energycommerce.house.gov','oversight.house.gov','republicans-','democrats-']
def host(u):
    u=re.sub(r'^https?://web\.archive\.org/web/\d+\w*/','',u)
    return urlparse(u).netloc.lower()
def isprim(u):
    if not u: return False
    h=host(u)
    if any(p in h for p in POLIT): return False
    return any(h==p or h.endswith('.'+p) for p in PRIM)
def urls(s): return re.findall(r'https?://[^\s|,;]+',s or '')
def covered():
    cov=set()
    for f in ['verdicts_media.json','verdicts_ledger_resource.json','verdicts_respot.json','verdicts_late.json','verdicts_scorecard.json','verdicts_essays.json']:
        cov|=set(json.load(open(f)))
    return cov
