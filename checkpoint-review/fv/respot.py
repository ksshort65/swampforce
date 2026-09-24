import json
D={}
def s(i,**kw): D[str(i)]=kw
TD='https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/'
for i in (215,756):
    s(i,Verdict='Verified with correction needed',Best_Source_URL=TD,Source_Type='government_data (Treasury)',Fix_Needed='Add the as-of date: "$40.09 trillion (Sept. 17, 2026)". Latest at audit: $40.074T on Sept. 23, 2026.',Notes='Re-spot-check 2026-09-24: Treasury Debt to the Penny API $40,093,343,468,150.50 on 2026-09-17; $40.074T on 2026-09-23.')
FR='https://www.federalregister.gov/documents/2025/11/19/2025-20251/medicare-program-medicare-part-b-monthly-actuarial-rates-premium-rates-and-annual-deductible'
for i in (507,508):
    s(i,Verdict='Verified with correction needed',Best_Source_URL=FR,Source_Type='official_record (Federal Register notice, CMS)',Fix_Needed='Replace the dead cms.gov link with the Federal Register notice (Nov. 19, 2025) or https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles.',Notes='Re-spot-check: 2026 standard Part B premium $202.90/month (CMS notice, 90 FR, Nov. 19, 2025).')
s(743,Verdict='Verified with correction needed',Best_Source_URL='https://www.justice.gov/opa/page/file/1261806/dl?inline=',Source_Type='court_filing (DOJ-hosted superseding indictment)',Fix_Needed='Replace the Washington Times-hosted PDF with DOJ\u2019s copy of the superseding indictment (S.D.N.Y. 11 Cr. 205), announced Mar. 26, 2020.',Notes='Re-spot-check: Maduro charged Mar. 26, 2020 (DOJ/DEA release). A newspaper host is not acceptable under the tightened rule.')
s(611,Verdict='Verified with correction needed',Best_Source_URL='https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/',Source_Type='government_data (Treasury)',Fix_Needed='Say "about $9.57 trillion". Note that 2007\u201309 had a Republican president (TARP was signed by President Bush, Oct. 2008). 9.1% (June 2022, BLS) is confirmed.',Notes='Recomputed: debt change over Congresses with Democratic majorities in both chambers since 1993 (103rd, 110th, 111th, 117th) = $0.643T + $1.951T + $3.370T + $3.603T = $9.567T (Treasury). Republican both-chamber periods since 1995 = $11.0T through Sept. 17, 2026 (site: $10.96T).')
s(454,Verdict='Verified',Best_Source_URL='https://data.bls.gov/timeseries/CUUR0000SA0',Source_Type='government_data (BLS)',Fix_Needed='',Notes='Re-spot-check via BLS API (CUUR0000SA0): 12-month CPI peak in Trump 2nd term 4.2% (May 2026); June 2022 9.1% remains higher.')
CBO='https://www.cbo.gov/publication/61882'
for i,n in ((424,'net interest $970B FY2025, $1,039B FY2026'),(820,'revenues FY2026 $5,596B'),(821,'revenues FY2026 $5,596B'),(822,'outlays FY2026 $7,449B'),(823,'outlays FY2026 $7,449B'),(824,'deficit FY2026 $1.9T (5.8% of GDP)'),(825,'deficit FY2026 $1.9T'),(826,'outlays 23.3% of GDP \u2192 GDP \u2248 $32.0T'),(827,'GDP \u2248 $32.0T')):
    s(i,Verdict='Verified',Best_Source_URL=CBO,Source_Type='official_record (CBO)',Fix_Needed='',Notes='Re-spot-check: CBO Budget and Economic Outlook 2026\u20132036 (Feb. 2026), Table 1-1: '+n+'. Read via Wayback copy of the PDF (cbo.gov blocks automated fetch).')
ERS='https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/farm-sector-income-forecast'
for i in (405,413,414,415,416,417,418):
    s(i,Verdict='Verified',Best_Source_URL=ERS,Source_Type='government_data (USDA ERS)',Fix_Needed='',Notes='Re-spot-check 2026-09-24: ERS forecast \u2014 expenses $471.6B (2025) \u2192 $492.8B (2026, +$21.2B); direct payments $27.9B \u2192 $47.4B (+$19.5B); net farm income $162.7B \u2192 $158.4B (\u2212$4.3B). Forecast figures; label as forecast.')
NYC='https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts/'
for i in (462,463,684):
    s(i,Verdict='Verified',Best_Source_URL=NYC,Source_Type='official_record (NYC Comptroller)',Fix_Needed='',Notes='Re-spot-check: $1.41B FY2023 + $3.70B FY2024 + $3.02B FY2025 = $8.13B (city fiscal years begin July 1).')
json.dump(D,open('/workspace/checkpoint-review/fv/verdicts_respot.json','w'),indent=1); print(len(D))
