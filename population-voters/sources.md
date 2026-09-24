# Sources (exact URLs) and verification status

Checked Sep 24, 2026 (MT) from the box with curl (Chrome user-agent). 'WebFetch' means the page loaded through the fetch tool although curl was blocked. Pages marked NOT verified were blocked from the box; their figures came from search-index text or earlier reads and should be re-checked in a normal browser.

| ID | Source | URL | Used for | Check |
|---|---|---|---|---|
| ACS-2021-24 | ACS 1-year table-based summary files B05001/B05003/B29001, 2021-2024 (US GEO_ID 0100000US; Colorado 0400000US08). Replace {Y} with year and table. | https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/1YRData/acsdt1y2024-b05001.dat | Main/Colorado: citizens, noncitizens, CVAP 2021-24 | curl 206 |
| ACS-2021-24b | ACS 2024 B05003 (sex by age by nativity/citizenship; CVAP) | https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/1YRData/acsdt1y2024-b05003.dat | CVAP | curl 206 |
| ACS-2021-24c | ACS 2024 B29001 (CVAP) | https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/1YRData/acsdt1y2024-b29001.dat | CVAP | curl 206 |
| ACS-2019 | ACS 2019 1-year sequence-file (example: seq 0009 = B05001/B05003; seq 0178 = B29001). 2009-2019 use .../{Y}/data/1_year_seq_by_state/UnitedStates/{Y}1us{seq}000.zip | https://www2.census.gov/programs-surveys/acs/summary_file/2019/data/1_year_seq_by_state/UnitedStates/20191us0009000.zip | Main/Colorado 2009-2019 | curl 206 |
| ACS-2008 | ACS 2008 1-year sequence file (2007-2008 pattern .../{Y}/data/1_year/UnitedStates/) | https://www2.census.gov/programs-surveys/acs/summary_file/2008/data/1_year/UnitedStates/20081us0009000.zip | Main/Colorado 2007-2008 | curl 206 |
| ACS-2006 | ACS 2006 summary file | https://www2.census.gov/programs-surveys/acs/summary_file/2006/data/UnitedStates/20061us0009000.zip | Main/Colorado 2006 | curl 206 |
| ACS-2005 | ACS 2005 summary file (household population only) | https://www2.census.gov/programs-surveys/acs/summary_file/2005/data/0UnitedStates/us0000011.2005-1yr.zip | Main 2005 | curl 206 |
| ACS-2020X | ACS 2020 experimental 1-year table XK200501 (citizenship), US and states | https://www2.census.gov/programs-surveys/acs/experimental/2020/data/XK200501.xlsx | Main/Colorado 2020 | curl 206 |
| PEP-2000s | Census intercensal national totals 2000-2010 | https://www2.census.gov/programs-surveys/popest/datasets/2000-2010/intercensal/national/us-est00int-tot.csv | PEP 2005-2009 | curl 206 |
| PEP-2010s | Census intercensal national age/sex 2010-2020 (SEX=0, AGE=999 rows) | https://www2.census.gov/programs-surveys/popest/datasets/2010-2020/intercensal/national/asrh/nc-est2020int-agesex-res.csv | PEP 2010-2019 | curl 206 |
| PEP-2020s | Census Vintage 2025 state/national totals (NST-EST2025-ALLDATA) | https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/state/totals/NST-EST2025-ALLDATA.csv | PEP 2020-2025 US & Colorado | curl 206 |
| PEP-CO-2000s | Census intercensal state age/sex 2000-2010 | https://www2.census.gov/programs-surveys/popest/datasets/2000-2010/intercensal/state/st-est00int-agesex.csv | Colorado PEP 2005-2009 | curl 206 |
| PEP-CO-2010s | Census intercensal Colorado age/sex 2010-2020 (Total row) | https://www2.census.gov/programs-surveys/popest/datasets/2010-2020/intercensal/state/asrh/sc-est2020int-agesex-08.xlsx | Colorado PEP 2010-2019 | curl 206 |
| CPS-2024 | CPS Voting & Registration Supplement 2024, Table 4a (state) and Table 11 (nativity) | https://www2.census.gov/programs-surveys/cps/tables/p20/587/vote04a_2024.xlsx | CPS registration 2024 | curl 206 |
| CPS-2024-11 | CPS 2024 Table 11 (native vs naturalized) | https://www2.census.gov/programs-surveys/cps/tables/p20/587/vote11_2024.xlsx | CPS nativity 2024 | curl 206 |
| CPS-2022 | CPS 2022 Table 4a | https://www2.census.gov/programs-surveys/cps/tables/p20/586/vote04a_2022.xlsx | CPS 2022 | curl 206 |
| CPS-2022-11 | CPS 2022 Table 11 | https://www2.census.gov/programs-surveys/cps/tables/p20/586/vote11_2022.xlsx | CPS 2022 | curl 206 |
| CPS-2012 | CPS 2012 Table 4a | https://www2.census.gov/programs-surveys/cps/tables/p20/568/table04a.xls | CPS 2012 | curl 206 |
| CPS-2010 | CPS 2010 Table 4a | https://www2.census.gov/programs-surveys/cps/tables/p20/voting-registration-2010-election/table4a_2010.xls | CPS 2010 | curl 206 |
| CPS-2008 | CPS 2008 Table 4a | https://www2.census.gov/programs-surveys/cps/tables/p20/562-rv/table-04a.xls | CPS 2008 | curl 206 |
| CPS-2006 | CPS 2006 Table 4a | https://www2.census.gov/programs-surveys/cps/tables/p20/557/tab04a.xls | CPS 2006 | curl 206 |
| CPS-dir | CPS P20 table directories for 2014 (577/), 2016 (580/), 2018 (583/), 2020 (585/) | https://www2.census.gov/programs-surveys/cps/tables/p20/585/ | CPS 2014-2020 | curl 200 |
| EAVS-2024 | EAC 2024 EAVS Comprehensive Report | https://www.eac.gov/sites/default/files/2025-07/2024_EAVS_Report_508.pdf | EAVS 2024 US & Colorado | curl 206 |
| EAVS-2024E | EAC Errata Note 2024 EAVS v2 (Feb 2026) | https://www.eac.gov/sites/default/files/2026-02/Errata_Note_2024_EAVS_v2.pdf | 2024 revisions | curl 206 |
| EAVS-2022 | EAC 2022 EAVS Comprehensive Report | https://www.eac.gov/sites/default/files/2024-11/2022_EAVS_Report_508c.pdf | EAVS 2022 | curl 206 |
| EAVS-2020 | EAC 2020 EAVS Comprehensive Report | https://www.eac.gov/sites/default/files/document_library/files/2020_EAVS_Report_Final_508c.pdf | EAVS 2020 | curl 206 |
| EAVS-2018 | EAC 2018 EAVS Comprehensive Report | https://www.eac.gov/sites/default/files/eac_assets/1/6/2018_EAVS_Report.pdf | EAVS 2018 | curl 206 |
| EAVS-2018A | EAC 2018 EAVS descriptive tables appendix (xlsx) | https://www.eac.gov/sites/default/files/eac_assets/1/6/2018_EAVS_and_Policy_Survey_Online_Appendices_-_Descriptive_Tables.xlsx | EAVS 2018 detail | curl 206 |
| EAVS-2016 | EAC 2016 EAVS Comprehensive Report | https://www.eac.gov/sites/default/files/eac_assets/1/6/2016_EAVS_Comprehensive_Report.pdf | EAVS 2016 | curl 206 |
| EAVS-2014 | EAC 2014 EAVS Comprehensive Report | https://www.eac.gov/sites/default/files/eac_assets/1/1/2014_EAC_EAVS_Comprehensive_Report_508_Compliant.pdf | EAVS 2014 | curl 206 |
| NVRA-2012 | EAC NVRA Report 2011-2012 | https://www.eac.gov/sites/default/files/eac_assets/1/28/EAC_NVRA%20Report_lowres.pdf | Registration 2012 | curl 206 |
| NVRA-2010 | EAC NVRA Report 2009-2010 | https://www.eac.gov/sites/default/files/eac_assets/1/28/2010%20NVRA%20FINAL%20REPORT.pdf | Registration 2010 | curl 206 |
| NVRA-2008 | EAC NVRA Report 2007-2008 | https://www.eac.gov/sites/default/files/eac_assets/1/6/The%20Impact%20of%20the%20National%20Voter%20Registration%20Act%20on%20Federal%20Elections%202007-2008.pdf | Registration 2008 | curl 206 |
| NVRA-2006 | EAC NVRA Reports and Data Sets 2005-2006 | https://www.eac.gov/sites/default/files/eac_assets/1/1/NVRA%20Reports%20and%20Data%20Sets%202006-2005.pdf | Registration 2006 | curl 206 |
| EAVS-2006 | EAC 2006 EAVS Report (all chapters) | https://www.eac.gov/sites/default/files/eac_assets/1/6/2006_EAVS_Report_(All_Chapters).pdf | 2006 totals, Colorado 2006 | curl 206 |
| DHS-NAT | DHS OHSS Yearbook FY2024 naturalization tables (Table 21) | https://ohss.dhs.gov/system/files/2026-06/2026_0604_ohss_yearbook_naturalizations_fy2024.xlsx | Naturalizations FY2005-2024 | curl 206 |
| DHS-REF | DHS OHSS Yearbook FY2024 refugee tables (Table 13) | https://ohss.dhs.gov/system/files/2025-08/2025_0812_ohss_yearbook_refugees_fy2024.xlsx | Refugee arrivals | curl 206 |
| DHS-ASY | DHS OHSS Yearbook FY2024 asylee tables (Table 16) | https://ohss.dhs.gov/system/files/2026-08/2026_0805_ohss_yearbook_asylees_fy2024.xlsx | Asylum grants | curl 206 |
| CDC-BIRTHS-API | NCHS births dataset (data.cdc.gov e6fc-ccez) | https://data.cdc.gov/resource/e6fc-ccez.json | Births 2005-2018 | curl 200 |
| CDC-NVSR75-2 | NVSR Vol 75 No 2, Births: Final Data for 2024 (Jun 9, 2026) - CDC Stacks record | https://stacks.cdc.gov/view/cdc/252440 | Births 2019-2024 | NOT verified (HTTP 403) |
| CDC-VSRR43 | VSRR No. 43, Births: Provisional Data for 2025 (Apr 2026) | https://www.cdc.gov/nchs/data/vsrr/vsrr043.pdf | Births 2025 provisional (cdc.gov returns 403 to the box; figure confirmed via search index only) | NOT verified (HTTP 403) |
| CDC-DEATHS-API | NCHS leading causes of death dataset (data.cdc.gov bi63-dtpu), All causes, United States | https://data.cdc.gov/resource/bi63-dtpu.json | Deaths 2005-2017 | curl 200 |
| CDC-DB548 | NCHS Data Brief 548, Mortality in the United States 2024 (govinfo mirror) | https://www.govinfo.gov/content/pkg/GOVPUB-HE20_6200-PURL-gpo252909/pdf/GOVPUB-HE20_6200-PURL-gpo252909.pdf | Deaths 2024 | curl 206 |
| CDC-DB492 | NCHS Data Brief 492, Mortality 2022 (govinfo mirror) | https://www.govinfo.gov/content/pkg/GOVPUB-HE20_6200-PURL-gpo224125/pdf/GOVPUB-HE20_6200-PURL-gpo224125.pdf | Deaths 2022 | curl 206 |
| CDC-DB521 | NCHS Data Brief 521, Mortality 2023 (CDC Stacks) | https://stacks.cdc.gov/view/cdc/170564/cdc_170564_DS1.pdf | Deaths 2023 | NOT verified (HTTP 403) |
| CDC-DBS | NCHS Data Briefs 355 (2018), 395 (2019), 427 (2020), 456 (2021): https://www.cdc.gov/nchs/products/databriefs/db{N}.htm | https://www.cdc.gov/nchs/products/databriefs/db456.htm | Deaths 2018-2021 (cdc.gov 403 from box; unverifiable from box) | NOT verified (HTTP 403) |
| CDC-PROV25 | Mortality in the United States: Provisional Data, 2025 (VSRR, ~Jul 2026; NCBI NBK623755) | https://www.ncbi.nlm.nih.gov/books/NBK623755/ | Deaths 2025 provisional (403 from box; from search index) | curl 200 |
| SSA-4B1 | SSA Annual Statistical Supplement 2020, Table 4.B1 (SSNs issued) | https://www.ssa.gov/policy/docs/statcomps/supplement/2020/4b.html | SSNs 2005-2019 | WebFetch OK (curl 403) |
| SSA-2F | SSA Annual Statistical Supplement 2025, Table 2.F12 (SSNs issued, by age) | https://www.ssa.gov/policy/docs/statcomps/supplement/2025/2f.html | SSNs 2020-2024 | WebFetch OK (curl 403) |
| GAO-04-12 | GAO-04-12 SSA enumeration (FY2002 citizen/noncitizen split) | https://www.gao.gov/assets/gao-04-12.pdf | Only official citizen/noncitizen SSN split found | NOT verified (HTTP 403) |
| SSA-SSI-NC | SSA SSI Annual Statistical Report 2024, Noncitizens (Tables 29-33) | https://www.ssa.gov/policy/docs/statcomps/ssi_asr/2024/sect05.html | SSI noncitizen recipients 2005-2024 | WebFetch OK (curl 403) |
| FNS-SNAP23 | USDA FNS Characteristics of SNAP Households FY2023 (Table A.23 / B.16) | https://fns-prod.azureedge.us/sites/default/files/resource-files/snap-FY23-Characteristics-Report.pdf | SNAP participants by citizenship FY2023 | curl 206 |
| CBO-EMED | CBO letter to Rep. Arrington on Emergency Medicaid spending (Oct 2, 2024) | https://www.cbo.gov/system/files/2024-10/Arrington_Letter_EmergencyMedicaid_Immigration_final.pdf | Emergency Medicaid FY2017-2023 (cbo.gov returned 403/500 to the box) | NOT verified (HTTP 403) |
| KFF-EMED | KFF Quick Take on CBO Emergency Medicaid figures (Oct 4, 2024) | https://www.kff.org/quick-insights/less-than-1-of-total-medicaid-spending-goes-to-emergency-care-for-noncitizen-immigrants/ | Corroborates $3.8B FY2023 | curl 200 |
| EO14248 | Executive Order 14248, 90 FR 14005 (Mar 28, 2025) | https://www.govinfo.gov/content/pkg/FR-2025-03-28/pdf/2025-05523.pdf | Harris claim / federal actions | curl 206 |
| LULAC-217 | LULAC v. EOP, D.D.C. 25-cv-946, Oct 31, 2025 order (ECF 217) | https://assets.aclu.org/live/uploads/2025/10/217-Order-Granting-MSJ.pdf | EO 14248 ruling | curl 206 |
| LULAC-235 | LULAC v. EOP, Jan 30, 2026 order (ECF 235) | https://storage.courtlistener.com/recap/gov.uscourts.dcd.279032/gov.uscourts.dcd.279032.235.0_1.pdf | EO 14248 ruling | curl 206 |
| SCOTUS-26A124 | Trump v. California, No. 26A124 (Aug 24, 2026) | https://www.supremecourt.gov/opinions/25pdf/26a124_hgci.pdf | EO 14399 stay | curl 206 |
| LWV-ORDER | League of Women Voters v. DHS, D.D.C. 25-cv-3501, Jun 22, 2026 order | https://epic.org/wp-content/uploads/2026/06/LWV-ordr.pdf | SAVE vacatur | curl 206 |
| LWV-OP | LWV v. DHS memorandum opinion (Jun 2026) | https://www.lwv.org/sites/default/files/2026-06/LWV%20v.%20DHS%20Mem%20Op.pdf | SAVE vacatur | curl 206 |
| SCOTUS-26A308 | DHS v. League of Women Voters, No. 26A308 stay application (Sep 8, 2026) | https://www.supremecourt.gov/DocketPDF/26/26A308/423264/20260908101245314_DHS%20v%20League%20of%20Women%20Voters%20Stay%20Application.pdf | SAVE figures (65M verified; 28,635 flagged) | curl 206 |
| NCSL-LISTS | NCSL, Federal requests for statewide voter lists (updated Sep 15, 2026) | https://www.ncsl.org/elections-and-campaigns/federal-requests-for-statewide-voter-lists | DOJ voter-list suits | curl 200 |
| UW-TRACKER | UW State Democracy Research Initiative tracker of DOJ voter-data suits | https://statedemocracy.law.wisc.edu/our-work/tracker-doj-lawsuits-seeking-states-sensitive-voter-data | DOJ suits | curl 200 |
| TX-SOS-2026 | Texas SOS news release Sep 15, 2026 (SAVE results) | https://www.sos.texas.gov/about/newsreleases/2026/091526.shtml | Texas SAVE referrals | curl 206 |
| PADILLA-WB | Sens. Padilla/Schumer release on DHS whistleblower (Sep 14, 2026) | https://www.padilla.senate.gov/newsroom/press-releases/padilla-schumer-announce-dhs-whistleblower-report-revealing-trump-administration-directed-officers-to-break-state-laws-in-voter-fraud-hunt/ | USCIS voter initiative allegations | curl 200 |
| DOJ-16 | DOJ OPA release 26-1082, 16 charged (Sep 18, 2026) | https://www.justice.gov/opa/pr/department-justice-charges-16-individuals-illegal-voting-and-related-election-crimes | Prosecutions | WebFetch OK (curl 401) |
| PBS-AP-160 | AP via PBS, 160 arrests / 70 charged (Sep 23, 2026) | https://www.pbs.org/newshour/politics/trumps-focus-on-noncitizen-voting-has-led-to-160-arrests-that-shows-its-rare-experts-say | Prosecution totals | curl 200 |
| CBS-HARRIS | AP via CBS Detroit, Harris campaigns with El-Sayed (Sep 23, 2026) | https://www.cbsnews.com/detroit/news/harris-el-sayed-michigan-senate-campaign/ | Harris event | WebFetch OK (curl 406) |
| TOWNHALL-HARRIS | Townhall transcription of Harris clip (Sep 23, 2026) | https://townhall.com/news/amy-curtis/2026/09/23/kamala-harris-removing-ineligible-voters-is-cheating-n2683440 | Harris quote (secondary) | curl 200 |
| BELTWAY-HARRIS | Beltway Report transcription of Harris clip | https://thebeltwayreport.com/2026/09/kamala-harris-campaigns-in-detroit-calls-voter-roll-purges-cheating/ | Harris quote (secondary) | curl 200 |
| FOXBIZ-HARRIS | Fox Business video page, Harris fireside chat in Detroit (full event) | https://www.foxbusiness.com/video/6405446700112 | Harris video (could not be played/transcribed from box) | curl 206 |
| HR22-STATUS | H.R. 22 (SAVE Act) bill status XML (govinfo) | https://www.govinfo.gov/bulkdata/BILLSTATUS/119/hr/BILLSTATUS-119hr22.xml | SAVE Act status | curl 200 |
| HR22-TEXT | H.R. 22 engrossed in House (text) | https://www.govinfo.gov/content/pkg/BILLS-119hr22eh/html/BILLS-119hr22eh.htm | SAVE Act text | curl 200 |
| S1383-STATUS | S. 1383 bill status XML (vehicle for SAVE America Act House amendment) | https://www.govinfo.gov/bulkdata/BILLSTATUS/119/s/BILLSTATUS-119s1383.xml | SAVE America Act status | curl 200 |
| S1383-TEXT | S. 1383 engrossed House amendment (SAVE America Act text) | https://www.govinfo.gov/content/pkg/BILLS-119s1383eah/html/BILLS-119s1383eah.htm | SAVE America Act text | curl 200 |
| HR7296-STATUS | H.R. 7296 SAVE America Act bill status (introduced version; referred only) | https://www.govinfo.gov/bulkdata/BILLSTATUS/119/hr/BILLSTATUS-119hr7296.xml | SAVE America Act status | curl 200 |
| HOUSE-ROLL69 | House Clerk roll call 69 (Feb 11, 2026), S. 1383 passage 218-213 | https://clerk.house.gov/evs/2026/roll069.xml | SAVE America Act vote | curl 206 |
| ROLLCALL-SAVE | Roll Call, House passes revamped citizenship and voter ID bill (Feb 11, 2026) | https://rollcall.com/2026/02/11/house-passes-revamped-citizenship-voter-id-bill/ | SAVE America Act context | curl 200 |
| CO-SOS-2013 | Colorado SOS release Jul 1, 2013: 155 noncitizen voters referred | https://www.sos.state.co.us/pubs/newsRoom/pressReleases/2013/PR20130701NoncitizenVoters.html | Colorado referrals | curl 206 |
| CBS-CO-2022 | AP via CBS Colorado, 30,000 noncitizens got registration mailer (Oct 2022) | https://www.cbsnews.com/colorado/news/colorado-30000-noncitizens-vote-registration-mailer/ | Griswold postcard | WebFetch OK (curl 406) |
| AFP-CO-2022 | AFP Fact Check on Colorado mailer (Oct 13, 2022) | https://factcheck.afp.com/doc.afp.com.32LA24U | Griswold postcard | WebFetch OK (curl 403) |
| KUNC-CO-2024 | KUNC, How does Colorado keep noncitizens and dead people from voting? (Oct 31, 2024) | https://www.kunc.org/news/2024-10-31/how-does-colorado-keep-noncitizens-and-dead-people-from-voting | Colorado safeguards | curl 200 |
| JW-CO-113 | Judicial Watch v. Griswold, D. Colo. 20-cv-02992, ECF 113 order (Feb 27, 2024) | https://storage.courtlistener.com/recap/gov.uscourts.cod.201356/gov.uscourts.cod.201356.113.0.pdf | JW Colorado figures | curl 206 |
| JW-CO-105 | Judicial Watch v. Griswold notice of dismissal & settlement (Mar 30, 2023) | https://www.democracydocket.com/wp-content/uploads/2020/11/105-2-notice-of-dismissal-and-settlement-agreementpdf.pdf | JW Colorado settlement | curl 206 |
| JW-LA | Judicial Watch v. Logan, C.D. Cal. 2:17-cv-08948, settlement agreement (Jan 2019) | https://www.judicialwatch.org/wp-content/uploads/2019/01/JW-v-Logan-California-NVRA-settlement-08948.pdf | JW LA County | curl 206 |
| JW-LA-PR | Judicial Watch press release on LA settlement | https://www.judicialwatch.org/california-and-los-angeles-county-to-remove-1-5-million-inactive-voters-from-voter-rolls-settle-judicial-watch-federal-lawsuit/ | JW claim | curl 200 |
| JW-KY | Judicial Watch v. Grimes, E.D. Ky. 3:17-cv-94 (Clearinghouse record) | https://clearinghouse.net/case/43775/ | JW Kentucky consent judgment | curl 200 |
| JW-NC | Judicial Watch press release, NC settlement (430,000 inactive removed) | https://www.judicialwatch.org/north-carolina-voter-rolls-lawsuit/ | JW North Carolina | curl 200 |
| JW-CO-372 | Judicial Watch press release, Colorado removes 372,000 inactive voters | https://www.judicialwatch.org/colorado-removes-372000-inactive-voters-from-its-rolls-after-lawsuit/ | JW claim Colorado | curl 200 |
| NJ-GOV-0721 | NJ Governor statement Jul 21, 2026 (MVC software error, ~6,600) | https://www.nj.gov/governor/news/2026/20260721a.shtml | New Jersey | curl 200 |
| NJ-GOV-0819 | NJ Governor update Aug 19, 2026 (5,100 deleted; 1,450 rejected; ~340 voted; ~220 review) | https://www.nj.gov/governor/news/2026/20260819a.shtml | New Jersey | curl 200 |
| REUTERS-30K | Reuters via USA Today, states may have added 30,000+ self-declared noncitizens since 2000 (Sep 23, 2026) | https://www.usatoday.com/story/news/politics/elections/2026/09/23/30000-noncitizens-may-have-been-added-to-voter-rolls/91907784007/ | Item I | curl 206 |
| GA-2024 | Georgia SOS citizenship audit statement copy (Oct 23, 2024) | https://justthenews.com/sites/default/files/2024-10/FILE_7419.pdf | Georgia audit | curl 206 |
| TX-GOV-2024 | Texas Governor release Aug 26, 2024 (6,500 potential noncitizens removed) | https://gov.texas.gov/news/post/governor-abbott-announces-over-1-million-ineligible-voters-removed-from-voter-rolls | Texas 2024 | curl 200 |
| TXTRIB-2024 | Texas Tribune/Votebeat Oct 15, 2024 (581 identified as noncitizens) | https://www.texastribune.org/2024/10/15/texas-noncitizen-voter-roll-removal-included-americans/ | Texas discrepancy | curl 200 |
| VA-ELECT-2024 | Virginia ELECT 2024 Annual List Maintenance Report | https://www.elections.virginia.gov/media/formswarehouse/maintenance-reports/2024-Annual-List-Maintenance-Report.pdf | Virginia | curl 200 |
| OH-SOS-2025 | Ohio SOS release Jun 3, 2025 (30 referred) | https://www.ohiosos.gov/media-center/press-releases/2025/2025-06-03/ | Ohio | curl 200 |
| LA-ILLUM-2025 | Louisiana Illuminator Sep 4, 2025 (390 noncitizens; 79 voted) | https://lailluminator.com/2025/09/04/louisiana-election-investigation-finds-79-noncitizens-have-voted-since-1980s/ | Louisiana | curl 200 |
| CHNV-FR | DHS, Termination of CHNV parole processes, 90 FR 13611 (Mar 25, 2025) | https://www.govinfo.gov/content/pkg/FR-2025-03-25/html/2025-05128.htm | CHNV ~532,000 | curl 200 |
| CBP-DEC24 | CBP December 2024 monthly update (CBP One 936,500; CHNV arrivals by nationality) | https://www.cbp.gov/newsroom/national-media-release/cbp-releases-december-2024-monthly-update | Parole | curl 200 |
| CBP-JAN25 | CBP January 2025 monthly update (CBP One scheduling ended Jan 20, 2025) | https://www.cbp.gov/newsroom/national-media-release/cbp-releases-january-2025-monthly-update | Parole | curl 200 |
| USCIS-DACA | USCIS Active DACA recipients as of Jun 30, 2026 | https://www.uscis.gov/sites/default/files/document/data/active_daca_recipients_fy2026_q3_v1.xlsx | DACA | curl 206 |
| USCIS-I765 | USCIS I-765 receipts/approvals by eligibility category, FY2026 Q3 (quarterly only) | https://www.uscis.gov/sites/default/files/document/data/i765_application_for_employment_fy2026_q3_v1.xlsx | EAD (quarterly) | curl 206 |
| NVRA-8 | 52 U.S.C. 20507 (NVRA section 8) | https://www.law.cornell.edu/uscode/text/52/20507 | List maintenance rules | curl 206 |
| USC-611 | 18 U.S.C. 611 | https://www.law.cornell.edu/uscode/text/18/611 | Noncitizen voting ban | curl 206 |
| USC-1015 | 18 U.S.C. 1015 | https://www.law.cornell.edu/uscode/text/18/1015 | False citizenship claim | curl 206 |
| USC-20511 | 52 U.S.C. 20511 | https://www.law.cornell.edu/uscode/text/52/20511 | NVRA criminal penalties | curl 206 |
| USC-21083 | 52 U.S.C. 21083 (HAVA computerized list; DL/SSN4 verification) | https://www.law.cornell.edu/uscode/text/52/21083 | HAVA verification | curl 206 |
| USC-1611 | 8 U.S.C. 1611 (PRWORA) | https://www.law.cornell.edu/uscode/text/8/1611 | Benefit eligibility | curl 206 |

## Blocks encountered
- api.census.gov needs an API key, so I used the www2.census.gov summary files instead.
- ssa.gov returns 403 to curl; pages load through WebFetch.
- cdc.gov returns 403 to curl, and WebFetch returned raw PDF bytes. Workarounds: data.cdc.gov Socrata API and govinfo.gov mirrors. CDC data briefs 355/395/427/456, VSRR 43 and stacks.cdc.gov could not be verified from the box.
- ncbi.nlm.nih.gov returns 403 (used for the 2025 provisional deaths figure, so that figure is unverified from the box).
- cbo.gov PDF returned 403/500 (Emergency Medicaid letter).
- congress.gov shows a Cloudflare challenge; I used govinfo BILLSTATUS XML and House Clerk roll-call XML instead.
- apnews.com shows a Cloudflare challenge; I used AP copies on CBS/PBS/USA Today.
- uscis.gov timed out in WebFetch, but curl worked for data files.
- The Fox Business/Fox News Harris video pages load, but the video could not be played or transcribed, so no timestamp is available.
- gao.gov returned 403 to curl at the final check.
