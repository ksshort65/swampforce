# Phase 1: scorecard_stat verdicts. Output: fv/verdicts_scorecard.json
import csv, re, json, urllib.parse
R = list(csv.DictReader(open('/workspace/checkpoint-review/backup-pre-fullverify/verified-items.csv')))
status = {}
for line in open('/workspace/checkpoint-review/fv/urlstatus.tsv'):
    u, r = line.rstrip('\n').split('\t'); status[u] = r.split('|')[0]
V, VC, FC, CC, OP = 'Verified', 'Verified with correction needed', 'False, cut it', 'Cannot verify, cut it', 'Opinion'
D = {}
def s(i, v, url='', st='', fix='', notes=''):
    D[str(i)] = dict(Verdict=v, Best_Source_URL=url, Source_Type=st, Fix_Needed=fix, Notes=notes)

# ---------- URL-only link items: rule-based ----------
PRIMARY = ['congress.gov','bls.gov','cbp.gov','cbo.gov','gao.gov','ssa.gov','justice.gov','oig.dhs.gov','dhs.gov','ice.gov',
 'whitehouse.gov','courtlistener.com','documentcloud.org','c-span.org','cdc.gov','sigar.mil','govinfo.gov','fema.gov','supremecourt.gov',
 'kansascityfed.org','jct.gov','fec.gov','content.govdelivery.com','trumpwhitehouse.archives.gov','law.cornell.edu','supreme.justia.com','constitution.congress.gov','fiscaldata.treasury.gov','uscis.gov']
CONFIRMED_BLOCKED = {  # 401/403 to the audit box, but content confirmed via WebFetch or Wayback copy this pass
 'https://www.cbo.gov/publication/60805':'Wayback 2026-06-07 + letter PDF opened',
 'https://www.cbo.gov/publication/61256':'Wayback 2026-05-20 opened',
 'https://www.cbo.gov/publication/62050':'Wayback 2026-09-20 opened (Director\u2019s Statement on the Budget and Economic Outlook 2026-2036)',
 'https://www.cbo.gov/publication/61172':'Wayback 2026-09-06 opened (Budget and Economic Outlook 2025-2035)',
 'https://www.cbo.gov/data/budget-economic-data':'Wayback 2026-09-07',
 'https://www.cbo.gov/topics/budget':'Wayback 2026-07-05',
 'https://www.gao.gov/products/gao-25-107753':'Wayback 2026-09-23 opened',
 'https://www.gao.gov/products/gao-25-107746':'Wayback 2026-09-24 opened',
 'https://www.gao.gov/products/gao-26-108945':'Wayback 2026-03-27 opened',
 'https://www.gao.gov/products/gao-25-106862':'Wayback 2026-07-21 + report PDF opened',
 'https://www.ssa.gov/oact/trsum/':'WebFetch opened (2026 Trustees summary)',
 'https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm':'WebFetch opened',
 'https://www.ssa.gov/ssi/':'Wayback 2026-09-12',
 'https://www.bls.gov/news.release/archives/cpi_07132022.htm':'BLS blocks bots; figure confirmed via BLS API series CUUR0000SA0',
 'https://www.bls.gov/news.release/archives/cpi_10192011.htm':'BLS blocks bots; figure confirmed via BLS API series CUUR0000SA0',
 'https://www.bls.gov/news.release/cpi.nr0.htm':'Wayback 2026-09-21',
 'https://www.bls.gov/cpi/':'Wayback 2026-09-24',
 'https://www.justice.gov/archives/sco/file/1373816/dl':'Wayback 2026-08-19',
 'https://www.justice.gov/storage/US_v_Trump-Nauta_23-80101.pdf':'Wayback 2026-09-09',
 'https://www.justice.gov/storage/Report-of-Special-Counsel-Smith-Volume-1-January-2025.pdf':'Wayback 2026-09-19',
 'https://www.justice.gov/sco-smith/media/1366521/dl':'Wayback 2025-01-24',
 'https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol':'Wayback 2025-01-24',
 'https://www.justice.gov/usao-dc/capitol-breach-cases':'Wayback 2025-05-27',
 'https://www.justice.gov/storage/durhamreport.pdf':'Wayback 2024-12-18; GPO mirror govinfo GOVPUB-J-PURL-gpo223123',
 'https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current':'Wayback 2026-05-26',
 'https://manhattanda.org/district-attorney-bragg-announces-34-count-felony-indictment-of-former-president-donald-j-trump/':'Wayback 2023-04-04 (court filing mirror)',
 'https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf':'Wayback 2026-02-17 (court filing mirror)',
 'https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-24-22-AR.pdf':'Wayback 2025-09-02',
 'https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-25-16-AR.pdf':'Wayback 2025-08-29',
 'https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623':'Wayback 2026-05-08 (C-SPAN user clip of unedited floor/presser video)',
 'https://www.c-span.org/clip/joint-session-of-congress/user-clip-the-first-duty-of-the-american-government/5194380':'WebFetch returned page title (clip exists); video not reviewed by auditor',
 'https://www.kansascityfed.org/agriculture/agfinance-updates/larger-operating-loans-boost-farm-lending-activity-in-2025/':'Wayback 2026-05-20 opened',
 'https://www.cdc.gov/nchs/blog/posts/2026/03/most-common-drugs-in-u-s-overdose-deaths-2017-2023.html':'NOT opened (403 + WebFetch timeout)',
}
REPLACE = {
 'https://oig.justice.gov/reports/2019/o1912.pdf': ('https://oig.justice.gov/sites/default/files/reports/120919-examination.pdf','Link is dead (HTTP 404). The Horowitz FISA report (Dec. 9, 2019) is report 20-012.'),
 'https://www.whitehouse.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf': ('https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf','Dead on whitehouse.gov (HTTP 404). Use the National Archives copy of the July 25, 2019 call memorandum.'),
 'https://guides.loc.gov/federalist-papers/text-10-17#s-lg-box-wrapper-25493273': ('https://guides.loc.gov/federalist-papers/text-1-10','LOC guide URL returns 404; use the current LOC Federalist Papers guide page for the cited paper.'),
 'https://www.cms.gov/medicare/payment/medicare-part-b': ('https://www.ssa.gov/oact/trsum/','CMS URL returns 404. The 2026 Part B premium ($202.90) is stated in the 2026 Trustees summary (SSA) and CMS 2026 premiums fact sheet.'),
}
NONPRIMARY = {
 'time.com': ('Journalism outlet. Replace with the unedited C-SPAN video of Clinton\u2019s Sept. 9, 2016 LGBT for Hillary Gala remarks.', 'https://www.c-span.org/'),
 'homeland.house.gov': ('Committee press/factsheet (politicians) is not an acceptable source for the number. Use CBP\u2019s own data page.', 'https://www.cbp.gov/newsroom/stats/nationwide-encounters'),
 'budget.house.gov': ('Committee press release (politicians). Cite the CBO letter itself.', 'https://www.cbo.gov/publication/60805'),
 'abc13.com': ('Local TV news. Needs a Texas Division of Emergency Management / Governor\u2019s office record of the busing totals; none opened.', ''),
 'www.pewresearch.org': ('Pew is a secondary analysis of CBP data. Cite CBP\u2019s Southwest land border encounters data directly.', 'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters'),
 'radio.foxnews.com': ('Network page. Acceptable only as the place the interview aired; the quote must be checked against the audio.', ''),
 'www.nytimes.com': ('Journalism (paywalled, 403). Cannot be the source of a fact or quote.', ''),
 'www.realclearpolitics.com': ('Journalism/aggregator video. Replace with unedited C-SPAN or original event video.', ''),
 'www.newsbusters.org': ('Media Research Center blog. Acceptable only as the place MRC published its own study; label as MRC\u2019s claim.', ''),
 'www.oyez.org': ('Oyez is a secondary host. Use the Supreme Court opinion.', 'https://www.law.cornell.edu/supct/pdf/12-1281.pdf'),
 'www.cato.org': ('Think-tank blog: acceptable only as the source of Cato\u2019s own estimate, labeled as an estimate.', ''),
}
def link_item(x):
    u = re.search(r'https?://\S+', x['Text']).group(0)
    host = urllib.parse.urlparse(u).netloc
    code = status.get(u, '?')
    if u in REPLACE:
        new, why = REPLACE[u]
        return s(x['Item_No'], VC, new, 'official_record', f'Replace link with {new}', why)
    for k, (why, alt) in NONPRIMARY.items():
        if host.endswith(k):
            return s(x['Item_No'], VC, alt, 'non_primary_link', f'Replace this link: {why}' + (f' Suggested: {alt}' if alt else ''), f'Link HTTP {code}. {why}')
    if any(host.endswith(p) for p in PRIMARY):
        note = f'Source link. HTTP {code} from audit box.'
        if code != '200':
            conf = CONFIRMED_BLOCKED.get(u)
            if conf and not conf.startswith('NOT'):
                note += f' Blocked to automated fetch; content confirmed: {conf}.'
            elif 'justice.gov' in host or 'c-span.org' in host or 'gao.gov' in host or 'fema.gov' in host or 'cato' in host:
                return s(x['Item_No'], VC, u, 'official_record', 'Link could not be opened by the auditor (bot-blocked, no archive copy found). Keep only after a human confirms it opens in a browser, or swap for an archived/GPO copy.', note + ' Not confirmed this pass.')
            elif conf and conf.startswith('NOT'):
                return s(x['Item_No'], VC, u, 'official_record', 'Link not opened (403/timeout). Confirm in a browser before publishing.', note + ' ' + conf)
        st = 'statute (LII mirror of U.S. Code)' if 'cornell' in host else ('court_opinion (Justia mirror)' if 'justia' in host else ('unedited_video' if 'c-span' in host else 'official_record'))
        return s(x['Item_No'], V, u, st, '', note + ' Correct primary document for the adjacent claim.')
    return s(x['Item_No'], VC, '', 'unknown', 'Unclassified link; review.', f'HTTP {code}')

for x in R:
    if x['Category']=='scorecard_stat' and x['Verdict']=='Unverified' and re.match(r'^[A-Z_0-9]+: https?://\S+$', x['Text']):
        link_item(x)

# ---------- Substantive scorecard items ----------
CBPNW='https://www.cbp.gov/newsroom/stats/nationwide-encounters'
CBPSW='https://www.cbp.gov/document/stats/us-border-patrol-fiscal-year-southwest-border-sector-apprehensions-fy-1960-fy-2019'
D2P='https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/'
HIST='https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/'
BLSCPI='https://data.bls.gov/timeseries/CUUR0000SA0'
BLSUR='https://data.bls.gov/timeseries/LNS14000000'
EIAG='https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=pet&s=emm_epmr_pte_nus_dpg&f=w'
EIAD='https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=pet&s=emd_epd2d_pte_nus_dpg&f=w'
SENPD='https://www.senate.gov/history/partydiv.htm'; HOUSEPD='https://history.house.gov/Institution/Party-Divisions/Party-Divisions/'
CBO60805='https://www.cbo.gov/publication/60805'; CBO61256='https://www.cbo.gov/publication/61256'
ICE24='https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf'; OIG='https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf'
TRS='https://www.ssa.gov/oact/trsum/'; GAOFR='https://www.gao.gov/products/gao-26-108945'
BIDEN_FY = ' FY2021 began Oct. 1, 2020, under Trump.'

s(214, VC, CBPNW, 'government_data', 'Keep the definition. Replace the last two sentences with: "Obama-era figures are Southwest Border Patrol apprehensions (CBP\u2019s long historical table); later figures are CBP nationwide encounters, which count more categories. The two are not directly comparable."', 'CBP nationwide encounters page defines encounters as Title 8 apprehensions, Title 8 inadmissibles and Title 42 expulsions. Mixing SW-BP apprehensions (Obama) with nationwide encounters (others) inflates the contrast; must be disclosed.')
s(406, V, 'https://www.kansascityfed.org/agriculture/agfinance-updates/larger-operating-loans-boost-farm-lending-activity-in-2025/', 'government_data (Federal Reserve Bank)', '', 'KC Fed Ag Finance Update, Jan. 30, 2026: average operating loan size in 2025 "30% larger than the prior year" (inflation-adjusted); Q4 2025 new operating loan volume "increased nearly 40%". Opened via Wayback 2026-05-20.')
s(408, V, 'https://www.congress.gov/crs-product/RL30064', 'official_record (CRS)', '', 'CRS RL30064: $174,000; Speaker $223,500; leaders/PPT $193,400; unchanged since 2009.')
s(410, V, 'https://www.congress.gov/crs-product/RL30631', 'official_record (CRS)', '', 'CRS RL30631: [$174,000 x .017 x 20] = $59,160 (FERS, members covered before Dec. 31, 2012); 619 retired members drawing pensions as of Oct. 1, 2022.')
s(419, V, 'https://www.uscourts.gov/sites/default/files/2025-01/bf_f2_1231.2024.pdf', 'court_statistics', '', 'U.S. Courts Table F-2, 12 months ending Dec. 31, 2024, footnote: chapter 12 = 216.')
s(420, V, 'https://www.uscourts.gov/sites/default/files/document/bf_f2_1231.2025.pdf', 'court_statistics', '', 'U.S. Courts Table F-2, 12 months ending Dec. 31, 2025, footnote: chapter 12 = 315.')
s(421, V, SENPD, 'official_record', '', 'Checked every Congress 1857-2026 against senate.gov party divisions and House History party divisions: GOP held both chambers in exactly these spans.')
s(422, VC, SENPD, 'official_record', 'Change "1875\u201381" to "1879\u201381". (1875\u201379: Democratic House, Republican Senate = split.)', 'senate.gov: 44th/45th Congress (1875-79) Senate majority Republican; House Democratic. Recomputed debt added under unified Democratic control: about $12.5T (site: $12.65T).')
s(423, FC, SENPD, 'official_record', 'Replace "Every other year since 1857 \u2014 one house each" with: "1859\u201361 \u00b7 1875\u201379 \u00b7 1883\u201389 \u00b7 1891\u201393 \u00b7 1911\u201313 \u00b7 1981\u201387 \u00b7 2001\u201303 \u00b7 2011\u201315 \u00b7 2019\u201321 \u00b7 2023\u201325"', 'Split control was not "every other year". Recomputed split-control debt added: about $16.6T (site $16.48T). Method: debt change over each Congress; Treasury annual historical debt (interpolated) before 1993, daily Debt to the Penny after.')
s(426, V, 'https://www.cbo.gov/data/budget-economic-data', 'government_data', '', 'CBO historical budget data: surpluses FY1998-FY2001; deficits every year since FY2002. Confirmed by Treasury debt series.')
s(427, VC, 'https://www.congress.gov/crs-product/IN12324', 'official_record (CRS)', 'Replace "Since then they have not passed more than five of the twelve on time, and in most recent years they passed none." with "Every year since, Congress has needed at least one continuing resolution, and most bills have been rolled into giant omnibus packages."', 'CRS IN12324 (Aug. 14, 2024) confirms FY1997 was the last year all regular bills were enacted by Oct. 1, and that CRs were needed every year since. The "not more than five" claim is not in the cited report.')
s(429, V, 'https://www.gao.gov/products/gao-25-107753', 'official_record (GAO)', '', 'GAO-25-107753: FY2024 $162B improper payments across 68 programs; about $135B (84%) overpayments; about $2.8T cumulative since FY2003.')
s(434, V, 'https://www.congress.gov/bill/111th-congress/house-bill/3590', 'official_record', '', 'H.R. 3590 (ACA) signed Mar. 23, 2010; included individual mandate and new taxes; 111th Congress had Democratic majorities in both chambers.')
s(438, V, BLSCPI, 'government_data', '', 'BLS CPI-U 12-month change, Feb 2013-Jan 2017: max 2.5% (Jan 2017), min -0.2% (Apr 2015).')
s(439, V, 'https://www.uscis.gov/humanitarian/consideration-of-deferred-action-for-childhood-arrivals-daca', 'official_record', '', 'DACA created by DHS memorandum June 15, 2012; not enacted by Congress.')
s(440, VC, CBPSW, 'government_data', 'Use: "Southwest Border Patrol apprehensions, FY2009\u2013FY2016: 3.31 million (FY2009 began Oct. 2008, under Bush). FY2014: 479,371, the year of the unaccompanied-child surge."', 'CBP table: FY2009 540,865; FY10 447,731; FY11 327,577; FY12 356,873; FY13 414,397; FY14 479,371; FY15 331,333; FY16 408,870; total 3,307,017. Fiscal-year trap flagged.')
s(443, VC, CBPSW, 'government_data', 'Same as item 440.', 'Duplicate data point of 440.')
s(442, V, SENPD, 'official_record', '', '114th Congress (2015-17): GOP House and Senate; Obama president. Debt 2015-01-03 to 2017-01-03 rose ~$1.85T (Debt to the Penny); no year closed with a surplus.')
s(445, V, BLSUR, 'government_data', '', 'BLS LNS14000000: Feb 2020 3.5%; last lower reading 3.4% in May 1969; Dec 1969 was 3.5%.')
s(446, V, BLSCPI, 'government_data', '', 'CPI-U 12-month peak Feb 2017-Jan 2021: 2.9% (June and July 2018). EIA weekly regular peak $2.962, week of May 28, 2018.')
s(451, V, 'https://www.fbi.gov/news/stories/violent-crime-falls-at-historic-rate-new-fbi-data-show', 'government_data', '', 'FBI: 2025 murder rate 4.1 per 100,000 \u2014 same as 1955 and 1956.')
s(452, VC, 'https://www.federalregister.gov/documents/2025/04/03/2025-05837/making-the-district-of-columbia-safe-and-beautiful', 'official_record', 'Use the order\u2019s title: "EO 14252, Making the District of Columbia Safe and Beautiful (Mar. 27, 2025)." Link the Federal Register, not whitehouse.gov home page.', 'EO 14252 exists (Mar. 27, 2025). Federal Register doc 2025-05837 (signed Mar. 27, 2025; published Apr. 3, 2025) confirmed via FR API; whitehouse.gov home page is not a source.')
s(455, VC, EIAG, 'government_data', 'Keep "$4.500 the week of May 11, 2026." Add the current week for fairness: "Week of Sept. 21, 2026: $4.478." Drop the unsourced blame list or label it Our view.', 'EIA weekly regular: 2026-05-11 $4.500 (term high to date); 2026-09-21 $4.478. "OPEC, tax, refining, shipping" is causal framing not applied to other presidents\u2019 peaks.')
s(460, VC, CBPNW, 'government_data', 'Cite CBP, not House Homeland: "CBP nationwide encounters FY2021\u2013FY2024: 10.83 million."', 'Number matches CBP nationwide encounters (verified earlier in audit). Source must be CBP.')
s(464, CC, '', '', 'Remove $434M, $216-340M and their captions unless the city budget records are found.', 'Cited Migration Policy Institute URL is dead (HTTP 404) and MPI is a think tank. No city primary record opened.')
s(465, CC, '', '', 'Remove.', 'See 464.')
s(466, CC, '', '', 'Remove.', 'See 464.')
s(467, CC, '', '', 'Remove.', 'See 464.')
s(468, V, OIG, 'official_record (DHS OIG)', '', 'OIG-26-04 (Apr. 22, 2026): FEMA awarded nearly $1.4B through EFSP-H and SSP in FY2023-24.')
s(469, V, OIG, 'official_record (DHS OIG)', '', 'OIG-26-04: EFSP-H and SSP, FY2023-24; appropriations directed CBP to transfer $1.45B to FEMA.')
s(471, CC, '', '', 'Remove $124.6M unless a TDEM/Texas government record is linked.', 'Only source is ABC13 (news).')
s(472, CC, '', '', 'Remove unless a TDEM record is linked.', 'Only source is ABC13 (news).')
s(474, V, CBO61256, 'official_record (CBO)', '', 'CBO 61256: direct net cost to state and local governments $9.2B in 2023 (spending +$19.3B, revenue +$10.1B).')
s(475, VC, CBO61256, 'official_record (CBO)', 'Use: "2023: $19.3B more state and local spending, $10.1B more revenue, net $9.2B (CBO)." Drop "Encounters ran four years" or say "CBO\u2019s estimate covers 2023 only."', 'CBO figure is for calendar 2023 only.')
s(477, VC, CBO60805, 'official_record (CBO)', 'Cite CBO directly and use: "$16.2B, federal + state emergency Medicaid for noncitizens ineligible for full Medicaid, FY2021\u2013FY2023 (CBO)."', 'CBO letter Table 1: FY2021 $7,050M + FY2022 $5,401M + FY2023 $3,775M = $16,226M.')
s(479, VC, CBO60805, 'official_record (CBO)', 'Same as 477.', 'Duplicate of 477.')
s(480, VC, CBO60805, 'official_record (CBO)', 'Replace with: "CBO to House Budget: FY2021\u2013FY2023, federal plus state, $16.2B, vs. $7.3B in FY2017\u2013FY2019. Covers noncitizens barred from full Medicaid, including some lawful immigrants still in the 5-year wait; CBO cannot say how much went to people here illegally. FY2021 began Oct. 2020, under Trump."', 'CBO: FY2017-19 = $7,252M; FY2021-23 = $16,226M (+124%). Misleading as written: FY2021 started under Trump, FY2017 under Obama; FMAP boost 2020-23; CBO explicitly cannot split illegal vs. lawful noncitizens.')
s(482, V, 'https://www.law.cornell.edu/uscode/text/42/1395dd', 'statute', '', 'EMTALA, 42 U.S.C. 1395dd.')
s(484, VC, ICE24, 'government_data', 'Cite ICE, not House Homeland. Use: "About 662,000 noncitizens on ICE\u2019s non-detained docket had criminal convictions or pending charges as of July 21, 2024 (ICE data provided to Congress)."', 'House Homeland factsheet repeats ICE data released to Rep. Tony Gonzales (Sept. 2024). Politician page is not acceptable as source; the underlying ICE letter must be linked.')
s(485, VC, '', '', 'Same as 484; link the ICE letter/data, not the committee.', 'See 484.')
s(487, VC, ICE24, 'government_data', 'Label must say what is counted: "Homicide charges or convictions among noncitizens ICE arrested in FY2024: 2,894 (charges and convictions, not people)."', 'ICE FY2024 Annual Report Figure 9: Homicide 1,619 convicted + 1,275 pending = 2,894.')
s(488, VC, ICE24, 'government_data', 'Same as 487.', 'See 487.')
s(490, V, 'https://www.dhs.gov/news/2026/01/29/dhs-celebrates-one-year-laken-riley-act', 'official_record', '', 'Laken Riley, Georgia, killed Feb. 22, 2024.')
s(491, VC, 'https://www.dhs.gov/news/2026/01/29/dhs-celebrates-one-year-laken-riley-act', 'official_record', 'Attribute the gang claim: "DHS says the killer, a Venezuelan national released at the border in September 2022 and later arrested by NYPD, is a Tren de Aragua member. He was convicted of her murder in Georgia in November 2024."', 'DHS release (Jan. 29, 2026) states Venezuela, TdA, released Sept 2022, prior NYPD arrest. TdA membership is a DHS assertion, not a court finding.')
s(493, VC, '', '', 'Replace House Homeland as source with the DOJ/court record in U.S./Harford County v. Martinez-Hernandez. Check arrest date: widely recorded as June 14, 2024 in Tulsa, not June 17.', 'Only source given is a committee factsheet (politicians).')
s(494, CC, '', '', 'Remove until the Harford County court record is linked; arrest date "June 17, 2024" not confirmed.', 'Committee factsheet only.')
s(495, VC, '', '', 'Do not present $2,590 as a monthly benefit "pile". Illegal immigrants are barred from SSI, SNAP, non-emergency Medicaid and HUD assistance (8 U.S.C. 1611). If kept: "Average monthly amounts for eligible recipients: SSI $739 (Aug. 2026), SNAP ~$190 per person, Medicaid ~$771 per enrollee, HUD ~$917 per assisted household. These are not paid as a package to one person."', 'Sum of four program averages (715+190+771+917=2,593) for different eligible populations. Misleading as a per-alien benefit.')
s(496, VC, 'https://www.ssa.gov/policy/docs/quickfacts/stat_snapshot/', 'government_data', 'Use "$739" (SSI average monthly payment, all recipients, Aug. 2026) unless the noncitizen-specific average is cited from SSA\u2019s SSI Annual Statistical Report.', 'SSA Monthly Statistical Snapshot Aug. 2026: SSI average $738.73. The $715 noncitizen average was not found.')
s(498, V, 'https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap', 'government_data', '', 'SNAP ~$190/person/month confirmed in earlier audit pass (FNS program data).')
s(500, VC, 'https://www.macpac.gov/publication/medicaid-benefit-spending-per-full-year-equivalent-fye-enrollee-by-state-and-eligibility-group/', 'official_record (MACPAC)', 'If $771/month is kept, label it "per enrollee (all enrollees), FY2023". Per full-benefit enrollee is $9,859/yr (~$822/month).', 'MACPAC: FY2023 $9,255 per enrollee (all); $9,859 per full-benefit enrollee.')
s(501, FC, 'https://www.macpac.gov/publication/medicaid-benefit-spending-per-full-year-equivalent-fye-enrollee-by-state-and-eligibility-group/', 'official_record (MACPAC)', 'Replace with: "MACPAC: $9,255 per enrollee, FY2023 ($9,859 per full-benefit enrollee). Emergency Medicaid for people barred by immigration status is separate."', '$9,255 is the all-enrollee figure, not the full-benefit figure.')
s(502, CC, '', '', 'Remove $917 unless a HUD table is linked showing it.', 'huduser.gov dataset page is generic; "HUD\u2019s own run on mixed families ~$11,000" not found.')
s(503, CC, '', '', 'Remove.', 'Not found in HUD source.')
s(504, V, 'https://www.ssa.gov/policy/docs/quickfacts/stat_snapshot/', 'government_data', '', 'SSA snapshot: average retired-worker benefit $2,087.52 (Aug. 2026); ~$2,086 in July 2026 (earlier pass).')
s(509, VC, 'https://www.law.cornell.edu/uscode/text/8/1611', 'statute', 'Clarify: "$0 in SSI for a worker above the income/resource limits \u2014 SSI is a needs-based program." Remove the implied comparison to the $2,590 sum.', 'SSI is means-tested; statement is true but paired with the misleading $2,590 sum (item 495).')
s(510, VC, '', '', 'Remove "that $2,590 pile" (see 495).', 'See 495.')
s(511, CC, '', '', 'Remove unless the specific MGMA survey (year, question, sample) is linked.', 'Link is mgma.com home page; no survey opened.')
s(516, V, BLSCPI, 'government_data', '', 'BLS CPI-U 12-month through Aug 2026 = 3.4%.')
s(517, V, 'https://fred.stlouisfed.org/series/CPIAUCSL', 'government_data (FRED mirror of BLS)', 'Prefer the BLS link; FRED graph URL timed out.', 'Same BLS series.')
s(518, V, SENPD, 'official_record', '', '103rd Congress 1993-95: Democratic House and Senate.')
s(519, V, 'https://www.congress.gov/bill/103rd-congress/house-bill/2264', 'official_record', '', 'OBRA 1993 raised the top individual rate to 39.6%.')
s(520, V, 'https://www.congress.gov/bill/103rd-congress/house-bill/2264', 'official_record', '', 'Title correct.')
s(522, V, SENPD, 'official_record', '', '104th-106th Congress 1995-2001: GOP House and Senate.')
s(523, V, 'https://www.congress.gov/bill/105th-congress/house-bill/2014', 'official_record', '', 'Taxpayer Relief Act of 1997 cut the top capital-gains rate (28% to 20%).')
s(524, OP, 'https://www.congress.gov/bill/104th-congress/house-bill/3734', 'official_record', 'Label "Our view" for "not a uniparty hymn".', 'PRWORA 1996 facts correct; last clause is opinion.')
s(525, VC, 'https://www.congress.gov/bill/104th-congress/house-bill/3734', 'official_record', 'Correct title: "Personal Responsibility and Work Opportunity Reconciliation Act of 1996".', 'Word "Reconciliation" missing.')
s(527, V, 'https://www.congress.gov/bill/105th-congress/house-bill/2014', 'official_record', '', '')
s(529, VC, SENPD, 'official_record', 'Label "2001\u201307" is not unified GOP control: Senate was Democratic June 2001\u2013Jan 2003. Use "2003\u201307" for unified GOP control.', 'senate.gov 107th Congress.')
s(530, V, D2P, 'government_data', '', 'Debt to the Penny: 2001-01-19 $5.728T; 2009-01-20 $10.627T; +$4.90T (inauguration to inauguration).')
s(531, OP, 'https://www.congress.gov/bill/107th-congress/house-bill/1836', 'official_record', 'Label "take-home pay rose" as Our view or cite a CBO/JCT distributional table.', 'Law cut rates; the pay claim is unsourced.')
s(532, V, 'https://www.congress.gov/bill/107th-congress/house-bill/1836', 'official_record', '', '')
s(534, V, 'https://www.congress.gov/bill/108th-congress/house-bill/2', 'official_record', '', '')
s(536, V, 'https://www.congress.gov/bill/108th-congress/house-bill/1', 'official_record', '', 'P.L. 108-173.')
s(538, V, SENPD, 'official_record', '', '110th-111th Congress 2007-11: Democratic House and Senate.')
s(539, VC, D2P, 'government_data', 'Use one number: "Obama term, inauguration to inauguration: +$9.32T (Treasury)."', 'Debt to the Penny: 2009-01-20 $10.627T; 2017-01-20 $19.947T = +$9.32T. The "$8\u20139.3T" range mixes methods.')
s(540, V, 'https://www.congress.gov/bill/110th-congress/house-bill/1424', 'official_record', '', 'P.L. 110-343.')
s(542, V, 'https://www.congress.gov/bill/111th-congress/house-bill/3590', 'official_record', '', '')
s(544, V, SENPD, 'official_record', '', '115th Congress 2017-19: GOP both chambers.')
s(545, V, 'https://www.jct.gov/publications/2017/jcx-67-17/', 'official_record (JCT)', '', 'JCX-67-17: conference agreement reduces revenue ~$1.456T over 2018-2027.')
s(547, V, SENPD, 'official_record', '', '116th Congress 2019-21: Democratic House, GOP Senate (split).')
s(548, V, D2P, 'government_data', '', 'Debt to the Penny: 2017-01-20 $19.947T; 2021-01-20 $27.752T = +$7.80T. CARES Act passed House by voice vote, Senate 96-0.')
s(549, VC, D2P, 'government_data', 'Use: "FY2020 (Oct. 2019\u2013Sept. 2020): debt rose $4.2T." Label the rest Our view.', 'Debt to the Penny: 2019-09-30 $22.719T; 2020-09-30 $26.945T = +$4.23T.')
s(550, V, 'https://www.congress.gov/bill/116th-congress/house-bill/748', 'official_record', '', 'P.L. 116-136.')
s(552, V, SENPD, 'official_record', '', '117th Congress 2021-23: Democratic House and Senate (50-50, VP tie-break).')
s(553, V, D2P, 'government_data', '', 'Debt to the Penny: 2021-01-20 $27.752T; 2025-01-17 $36.207T (2025-01-21 $36.218T) = +$8.45-8.47T.')
s(554, V, 'https://www.congress.gov/bill/117th-congress/house-bill/5376', 'official_record', '', 'IRA 2022 created a 15% corporate alternative minimum tax on book income (>$1B). Note link given is BLS; use congress.gov.')
s(558, V, 'https://www.congress.gov/bill/117th-congress/house-bill/5376', 'official_record', '', '')
s(560, V, SENPD, 'official_record', '', '119th Congress: GOP both chambers.')
s(561, V, D2P, 'government_data', '', 'Debt to the Penny: 2025-01-21 $36.218T; 2026-08-18 $40.047T = +$3.83T. (Sept. 17, 2026: $40.093T.)')
s(562, VC, 'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters', 'government_data', 'Source the low to CBP, not Pew: "Southwest Border Patrol apprehensions FY2025: 237,538, lowest since 1970 (CBP)." Label the rest Our view.', 'CBP FY2025 SW BP 237,538 verified earlier; Pew is secondary.')
s(563, V, D2P, 'government_data', '', 'Debt to the Penny 2026-08-18: $40,047,425,768,420 (~$40.05T).')
s(564, VC, 'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters', 'government_data', 'Replace Pew with CBP as the source.', 'Pew article loads (HTTP 200) but is a secondary analysis.')
s(566, VC, '', 'network', 'Keep only as the place the interview aired; the McCaul quote must be checked against the broadcast audio before use.', 'Fox News Radio page loads; audio not reviewed.')
s(568, CC, '', '', 'Remove unless the quote is found in a primary recording/transcript.', 'NYT Magazine (journalism, paywalled 403).')
s(570, VC, 'https://www.youtube.com/watch?v=Hy4uBHoav3Y', 'unedited_video (event host upload)', 'Keep as citation only after the quoted words are checked against the video timestamp.', 'Carnegie event video exists (link given); content not reviewed by auditor.')
s(571, VC, 'https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623', 'unedited_video', 'Add the exact quoted words and timestamp; confirm date Apr. 22, 2026 on the full C-SPAN program.', 'Clip page exists (Wayback 2026-05-08). Video not reviewed.')
s(573, VC, 'https://www.c-span.org/program/public-affairs-event/house-minority-leader-jeffries-on-democracy/679567', 'unedited_video', 'Confirm quote and date against video.', 'C-SPAN 403 to audit box; not reviewed.')
s(575, V, 'https://www.c-span.org/clip/us-senate/user-clip-youve-released-the-whirlwind-and-you-will-pay-the-price--sen-chuck-schumer/4944670', 'unedited_video', '', 'Schumer\u2019s Mar. 4, 2020 remarks outside the Supreme Court ("You have released the whirlwind and you will pay the price") are on C-SPAN; Chief Justice Roberts issued a rebuke the same day. Clip title matches.')
s(577, VC, '', '', 'Replace RealClearPolitics with unedited video (C-SPAN or the rally video) of Waters\u2019 June 23, 2018 Los Angeles remarks ("create a crowd and you push back on them").', 'RCP is an aggregator.')
s(580, V, 'https://supreme.justia.com/cases/federal/us/395/444/', 'court_opinion', '', 'Brandenburg v. Ohio, 395 U.S. 444 (1969).')
s(582, VC, 'https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage', 'advocacy_study', 'Label: "Media Research Center (a conservative media watchdog) study: 92% negative, ABC/CBS/NBC evening news, first 100 days."', 'MRC is the author of its own study; attribution required.')
s(584, V, 'https://www.law.cornell.edu/supct/pdf/12-1281.pdf', 'court_opinion', '', 'NLRB v. Noel Canning, 573 U.S. 513 (2014).')
for i in (586,587,588,589,590):
    s(i, CC, 'https://www.justfacts.com/nationaldebt.asp', 'think_tank', 'Remove the PARTY_SPEND module (all four figures).', 'Only source is Just Facts (private research group) tabulating roll calls; not a primary record and not reproducible from CBO/roll-call data in this pass.')
s(591, FC, D2P, 'government_data', 'Replace "+$21.1T" with "+$19.8T" and note: "Reagan and Bush 41 from Treasury year-end data; 1993 on, Treasury Debt to the Penny, inauguration to inauguration; Trump 2 through Aug. 18, 2026."', 'DEBT_BY_TERM mixes methods: GW Bush +$6.1T uses FY2001-FY2009 (credits Obama\u2019s first 8 months/stimulus to Bush); Obama +$8.0T starts at FY2009 end. Consistent inauguration-to-inauguration: Reagan ~+1.75T, Bush41 ~+1.49T, GW Bush +4.90T, Trump1 +7.80T, Trump2 +3.83T = +$19.8T.')
s(592, VC, D2P, 'government_data', 'Keep text; update total per 591.', '')
s(593, FC, D2P, 'government_data', 'Replace "+$18.0T" with "+$19.3T" (Clinton ~+1.56T, Obama +9.32T, Biden +8.46T).', 'Consistent method gives Democrats +$19.3T vs Republicans +$19.8T \u2014 nearly equal, not the 21.1 vs 18.0 gap shown.')
s(600, V, 'https://www.hsgac.senate.gov/hearings/exposing-fraud-in-america/', 'official_record', '', 'HSGAC hearing page dated July 15, 2026 lists hearing and statements; the entry itself says the empty-chair claim is not in the written record, which is accurate.')
s(601, VC, HIST, 'government_data', 'Clarify: "Debt added while Republicans held both chambers since 1995: about $11.0 trillion."', 'Recomputed: 1995-2001 +$0.93T; 2003-07 +$2.29T; 2015-19 +$3.85T; 2025-Sept 2026 +$3.93T = $11.0T. Last surplus FY2001.')
s(609, V, SENPD, 'official_record', '', 'See 442.')
s(613, VC, 'https://www.congress.gov/bill/111th-congress/senate-bill/181', 'official_record', 'Say: "Lilly Ledbetter Fair Pay Act \u2014 the first bill President Obama signed (Jan. 29, 2009)."', 'S.181 was not "the first bill of the 111th Congress"; it was the first bill Obama signed.')
s(617, V, 'https://www.judiciary.senate.gov/press/rep/releases/grassley-opens-senate-judiciary-hearing-on-ensuring-safety-and-fairness-for-female-athletes', 'official_record', '', 'Grassley opening (Sept. 23, 2026): "the Democrats are choosing to let their two witness seats go empty." Durbin release same day: will not ask questions, did not call Democratic witnesses.')
s(618, CC, 'https://www.c-span.org/clip/joint-session-of-congress/user-clip-the-first-duty-of-the-american-government/5194380', 'unedited_video', 'Keep only after a person watches the C-SPAN clip and confirms who stood; otherwise remove "Republicans stood. Democrats stayed seated."', 'Clip exists (title confirmed) but video not reviewed; standing behavior cannot be confirmed from a transcript.')
s(620, VC, '', '', 'Remove the Platner clause (he withdrew July 10, 2026 and is not the nominee) and the Hamawy trial clause (no primary court record found). Name-calling list ("Nazi, pedophile") needs a primary quote for each or removal.', 'See item 804.')
s(626, CC, 'https://www.cdc.gov/nchs/blog/posts/2026/03/most-common-drugs-in-u-s-overdose-deaths-2017-2023.html', 'government_data', 'Remove 73,944 unless the CDC/NCHS table is opened and the exact figure confirmed.', 'CDC page blocked (403) and WebFetch timed out; figure not confirmed this pass.')
s(628, VC, ICE24, 'government_data', 'Use: "ICE FY2024: the 81,312 criminal noncitizens ERO arrested carried 2,894 homicide, 18,579 sexual-assault/sex-offense and 5,001 property-damage charges or convictions (charges, not people)." Remove "Those people were on American streets."', 'ICE FY2024 Annual Report p.18 and Figure 9 confirm all three numbers; they count charges/convictions including pending charges.')
s(630, VC, CBO60805, 'official_record (CBO)', 'Use neutral wording from item 480: "$16.2B in FY2021\u2013FY2023 (FY2021 began under Trump)."', 'See 480.')
s(632, V, OIG, 'official_record (DHS OIG)', '', 'OIG-26-04: nearly $1.4B awarded; $425M questioned costs in EFSP-H (plus $16.5M in SSP). FEMA Immediate Needs Funding announced Aug. 29, 2023 (FEMA advisory).')
s(635, VC, 'https://www.gao.gov/products/gao-25-106862', 'official_record (GAO)', 'Keep "more than 100 dead" and "nearly 10,000 displaced" (GAO-25-106862). Remove "$56.1 million to 7,141 people" and "housing into 2027" unless the FEMA IA figures are cited from FEMA\u2019s disaster page (DR-4724).', 'GAO-25-106862 text: fires "claiming over 100 lives... displacing nearly 10,000 survivors". The $56.1M / 7,141 figures were not found in the GAO report.')
s(637, VC, 'https://www.dhs.gov/news/2026/02/24/making-america-safe-again-state-dhs-under-president-trump-and-secretary-noem', 'official_record', 'Use: "DHS says it has located 145,000 unaccompanied children and that more than 450,000 were lost track of under the prior administration." Remove "The rest is a missing-persons file."', 'DHS release confirms 145,000 and "more than 450,000". Whether the remainder are missing is not established by any record.')
s(639, VC, TRS, 'official_record', 'Keep the Trustees figures. Remove "Parole into a Social Security number put extra load on a fund" (no source).', '2026 Trustees: OASI depleted Q4 2032, 78% payable; OASDI Q3 2034, 83%.')
s(640, VC, 'https://www.ssa.gov/policy/docs/quickfacts/stat_snapshot/', 'government_data', 'Use "SSI average payment (all recipients): $739 a month (Aug. 2026)".', 'See 496.')
s(641, V, 'https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap', 'government_data', '', 'See 498.')
s(642, VC, 'https://www.macpac.gov/publication/medicaid-benefit-spending-per-full-year-equivalent-fye-enrollee-by-state-and-eligibility-group/', 'official_record', 'Say "about $771 a month per enrollee (all enrollees, FY2023)".', 'See 500.')
s(643, CC, '', '', 'Remove.', 'See 502.')
s(644, VC, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', 'Keep the statute point. Remove "America pays for its own opposition" or label Our view.', '26 U.S.C. 6104(b)/(d): contributor names not publicly disclosed for most 501(c) orgs (not 527s or private foundations).')
s(646, VC, 'https://www.fec.gov/data/receipts/individual-contributions/?contributor_name=SOROS%2C%20GEORGE', 'government_data', 'Keep "FEC and IRS 527 filings list large donors, including George Soros, to committees supporting district-attorney candidates." Remove "Crime is the American who lives in that county" or label Our view.', 'FEC search page loads; specific DA-race committees not enumerated here.')
s(648, VC, 'https://www.law.cornell.edu/uscode/text/52/20507', 'statute', 'Keep statute text ("reasonable effort to remove" deceased/moved). Remove "A refusal to purge is a refusal of the statute they swore" or label Our view; no named official is shown refusing.', '52 U.S.C. 20507(a)(4); HAVA 52 U.S.C. 21083(a)(2).')
s(650, VC, TRS, 'official_record', 'Keep "$202.90" (2026 Part B standard premium). Label "Medicare pays too little" as Our view.', '2026 Trustees summary: Part B standard premium $202.90.')
s(653, V, 'https://www.uscis.gov/humanitarian/consideration-of-deferred-action-for-childhood-arrivals-daca', 'official_record', '', 'See 439.')
s(654, VC, CBPSW, 'government_data', 'Add "(FY2009 began Oct. 2008, under Bush)".', 'See 440.')
s(666, VC, TRS, 'official_record', 'Keep Trustees figures and "$56 a month \u2014 $2,015 to $2,071" only if SSA COLA fact sheet is linked; remove "Markets historically paid 7\u20138%" and "implied return ~2% real" (no source) or cite SSA OACT.', 'Trustees figures confirmed. SSA COLA 2026 = 2.8% confirmed (ssa.gov/cola). $2,015/$2,071 fact-sheet PDF not opened.')
s(667, FC, 'https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm', 'official_record', 'Replace with: "SSI is paid from general revenue. People here illegally cannot get it (8 U.S.C. 1611). Some lawfully present noncitizens can \u2014 refugees and asylees for up to 7 years, green-card holders with 40 work quarters, some veterans. Parole alone does not make someone eligible. 319,391 noncitizens received SSI in December 2024 (SSA)."', 'SSA spotlight: parolees are "qualified aliens" but must ALSO meet a condition (40 quarters, military, pre-1996 residence, or 7-year refugee/asylee window). "Cross, get a status, get an SSN, get SSI" is false. SSA SSI Annual Statistical Report 2024: 319,391 noncitizen recipients (4.3%) in Dec 2024; 310,000 Dec 2025 not found.')
s(668, VC, 'https://www.gao.gov/products/gao-24-105833', 'official_record (GAO)', 'Say "GAO estimates $233\u2013521 billion a year lost to fraud (2018\u20132022 data)" \u2014 fraud only, not "fraud and improper payments" (improper payments are a separate $162B FY2024 figure). Keep COVID UI $100\u2013135B only with GAO-23-106696 link.', 'GAO-26-108945 and GAO-25-107746 restate $233-521B fraud estimate.')
s(672, VC, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', 'Keep statute facts. Remove or label Our view: "The cities still burned... bail and protest infrastructure... Secretaries of state still sit on dirty rolls... funding a pipe it cannot see."', 'Statutory claims accurate; remainder is unsourced characterization.')
s(674, OP, '', '', 'Label Our view.', 'Slogan.')
s(675, VC, 'https://www.cbo.gov/publication/61172', 'official_record (CBO)', 'Change "GAO: $233\u2013521 billion a year in fraud and improper payments" to "GAO: $233\u2013521 billion a year in fraud". Label the part-time/pipe sentences Our view.', 'See 668.')
s(678, VC, CBO60805, 'official_record', 'See 480.', 'See 480.')
s(680, V, CBO61256, 'official_record (CBO)', '', 'CBO 61256, 2023, net.')
s(681, V, CBO61256, 'official_record (CBO)', '', '$9.2B net, 2023.')
s(683, V, 'https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts', 'government_data', '', 'NYC Comptroller shelter actuals FY2023-25 verified earlier ($8.13B).')
s(685, VC, 'https://www.ssa.gov/policy/docs/statcomps/ssi_asr/2024/sect05.html', 'government_data', 'Replace with "319,391, Dec. 2024".', 'SSA SSI Annual Statistical Report 2024, noncitizens table.')
s(686, V, 'https://www.law.cornell.edu/uscode/text/8/1611', 'statute', '', '')
s(688, V, 'https://www.law.cornell.edu/uscode/text/8/1641', 'statute', '', '')
s(690, V, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', '', 'Accurate description of grant flow and 990 redaction.')
s(691, VC, 'https://www.foreignassistance.gov/', 'government_data', 'Keep OIG and statute facts. Change "That is taxpayer money into party-aligned shops" to "NED funds four core institutes, including party-affiliated NDI and IRI." Remove from "No charging document says..." to the end or label Our view. Foreign-aid totals ($71.9B / $43.8B) must be re-pulled from foreignassistance.gov before use.', 'OIG $1.4B and statutes confirmed; foreign-aid totals not opened this pass.')
s(692, CC, 'https://www.foreignassistance.gov/', 'government_data', 'Remove until foreignassistance.gov FY2023 disbursement totals are pulled.', 'USAspending page returned a JS shell; figure not confirmed.')
s(693, CC, '', '', 'Remove "The Inspector General audited $25.9 billion" (no report cited).', 'No OIG report linked.')
s(694, V, OIG, 'official_record', '', 'See 468.')
s(695, V, OIG, 'official_record', '', 'OIG title: "FEMA Cannot Ensure Humanitarian Funding for Aliens Complied..."')
s(697, CC, 'https://www.law.cornell.edu/uscode/text/22/4411', 'statute', 'Remove "$315 million" unless the FY2024 appropriation act line (P.L. 118-47) is linked; the statute link does not contain the amount.', 'Amount not in cited source.')
s(698, VC, 'https://www.law.cornell.edu/uscode/text/22/4411', 'statute', 'Say "NED\u2019s core grantees include NDI and IRI" and link NED\u2019s annual report.', 'Statute establishes NED; grants detail not in link.')
s(700, V, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', '', '')
s(701, V, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', '', '')
s(702, V, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', '', 'Schedule B filed with IRS; public copy redacts contributor names (most 501(c)).')
s(704, V, 'https://www.fec.gov/', 'government_data', '', '')
s(705, VC, 'https://www.fec.gov/data/receipts/individual-contributions/?contributor_name=SOROS%2C%20GEORGE', 'government_data', 'Keep; add a specific committee filing link.', '')
s(707, V, 'https://www.law.cornell.edu/uscode/text/52/20507', 'statute', '', '')
s(708, VC, 'https://www.law.cornell.edu/uscode/text/52/21083', 'statute', 'Remove "Congress never tied the election grant to a clean list" (HAVA requirements payments are conditioned on meeting 52 U.S.C. 21083) or rephrase to a specific grant program.', 'HAVA Title III requirements apply to states receiving requirements payments.')
s(711, V, 'https://www.govtrack.us/congress/votes/88-1964/h128', 'official_record (GovTrack from Voteview)', '', 'House passage Feb. 10, 1964: 290-130.')
s(712, V, 'https://www.govtrack.us/congress/votes/88-1964/h128', 'official_record', '', 'Republicans 138-34 (80%).')
s(713, VC, 'https://www.govtrack.us/congress/votes/88-1964/h128', 'official_record', 'Add "most of the 96 were Southern Democrats" for accuracy of context.', 'Democrats 152-96 (61%).')
s(714, V, 'https://www.govtrack.us/congress/votes/88-1964/h128', 'official_record', '', '138/172 = 80.2%.')
s(715, V, 'https://www.govtrack.us/congress/votes/88-1964/h128', 'official_record', '', '152/248 = 61.3%.')
s(718, V, 'https://www.govinfo.gov/content/pkg/GOVPUB-S-PURL-gpo248012/pdf/GOVPUB-S-PURL-gpo248012.pdf', 'official_record', '', 'SIGAR report on govinfo (HTTP 200).')
s(720, V, 'https://www.law.cornell.edu/uscode/text/2/1601', 'statute', '', 'Lobbying Disclosure Act findings.')
s(724, V, 'https://homeland.house.gov/wp-content/uploads/2024/10/2024-10-11-Green-et-al-to-Mayorkas-DHS-re-FEMA-Funding-Priorities.pdf', 'official_record (letter)', '', 'Letter dated Oct. 11, 2024 exists; cite only as "members wrote".')
s(729, V, ICE24, 'government_data', '', '')
s(731, V, 'https://www.law.cornell.edu/uscode/text/26/6104', 'statute', '', '')
s(734, V, 'https://www.law.cornell.edu/uscode/text/52/20507', 'statute', '', '')
s(736, V, 'https://www.law.cornell.edu/uscode/text/22/4411', 'statute', '', '')
s(738, V, 'https://www.congress.gov/congressional-record/volume-165/issue-163/house-section/article/H8153-5', 'official_record', '', 'Congressional Record link (HTTP 200).')
s(744, V, 'https://www.law.cornell.edu/uscode/text/18/1201', 'statute', '', '')
s(749, V, CBO61256, 'official_record', '', '')
s(753, V, ICE24, 'government_data', '', '')
s(754, V, 'https://www.fbi.gov/news/stories/violent-crime-falls-at-historic-rate-new-fbi-data-show', 'government_data', '', 'FBI 2025: violent crime rate down 9.3%.')
s(755, V, 'https://bjs.ojp.gov/document/ckle24.pdf', 'government_data', '', 'BJS link HTTP 200.')
s(757, V, 'https://www.congress.gov/crs-product/R48612', 'official_record', '', '')
s(759, V, 'https://www.cbo.gov/data/budget-economic-data', 'government_data', '', 'Last surplus FY2001.')
s(760, V, 'https://www.law.cornell.edu/uscode/text/5/3331', 'statute', '', '')
s(762, V, 'https://www.law.cornell.edu/uscode/text/2/1415', 'statute', '', '')
s(764, V, 'https://www.govtrack.us/congress/votes/88-1964/h128', 'official_record', '', '')
s(765, V, 'https://www.congress.gov/bill/88th-congress/house-bill/7152', 'official_record', '', '')
s(767, OP, D2P, 'government_data', 'Label Our view; "$40 trillion" is accurate ($40.09T Sept 17, 2026).', '')
s(769, V, CBO61256, 'official_record', '', ''); s(770, V, CBO60805, 'official_record', '', ''); s(771, V, 'https://www.law.cornell.edu/uscode/text/8/1611', 'statute', '', '')
s(775, V, 'https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf', 'court_filing', '', 'U.S. v. Trump, 1:23-cr-00257 (D.D.C.).')
s(780, V, 'https://www.congress.gov/bill/116th-congress/house-resolution/755', 'official_record', '', '')
s(786, V, SENPD, 'official_record', '', 'Unified GOP control: 1995-2001, 2003-07, 2015-19, 2025-.')
s(788, V, SENPD, 'official_record', '', 'Unified Democratic control since 1993: 1993-95, 2007-11, 2021-23.')
s(794, V, 'https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults', 'official_record', '', 'DHS: 275 assaults Jan 20-Dec 31, 2025 vs 19 same period 2024; 66 vehicular attacks vs 2.')
s(797, VC, SENPD, 'official_record', 'Replace "Most other years. Nixon. Bush 41. 2011\u201315. COVID. 2023\u201325." with "Split control since 1981: 1981\u201387, 2001\u201303, 2011\u201315, 2019\u201321, 2023\u201325. Nixon and Bush 41 were Republican presidents facing a Democratic Congress (not split chambers)."', 'Nixon (1969-74) and Bush 41 (1989-93) had Democratic majorities in BOTH chambers \u2014 that is unified Democratic Congress, not "one house each".')
s(798, V, 'https://www.cbo.gov/data/budget-economic-data', 'government_data', '', '')
s(799, VC, 'https://www.ocwr.gov/', 'official_record', 'Cite the Office of Compliance (now OCWR) Dec. 2017 release of awards/settlements 1997\u20132017 rather than the statute; confirm "$17 million" figure there.', 'Figure widely attributed to OOC data; OCWR release not opened this pass. Statute link does not contain the number.')
s(800, VC, '', '', 'Same as 799.', '')
s(802, VC, 'https://www.c-span.org/', 'unedited_video', 'Keep Clinton quote with C-SPAN video, not Time. For Biden, say: "Biden, Oct. 29, 2024: \u2018The only garbage I see floating out there is his supporters\u2019 \u2014 the White House transcript rendered it \u2018supporter\u2019s\u2019." Remove "Nazis. Pedophiles." unless each is sourced to a specific primary quote. Remove the stenographer detail (news-only).', 'Clinton Sept. 9, 2016 quote is on unedited video. Stenographer dispute is sourced only to news reporting.')
s(804, FC, 'https://www.nj.gov/state/elections/assets/pdf/election-results/2026/2026-official-primary-results-us-house.pdf', 'official_record', 'Remove Platner sentence (he withdrew from the race July 10, 2026; a new nominee was chosen July 25). Remove Hamawy trial sentence (only news reporting; no court record). Keep, attributed: "White House fact sheet (Jan. 2026): DOJ has charged 98 defendants in Minnesota fraud cases (Feeding Our Future and others); 64 convicted." Consider dropping the ethnicity count.', 'Maine: Platner won June 9 primary but withdrew July 10, 2026 (not the nominee as of Sept 2026). NJ official results confirm Hamawy is NJ-12 Democratic nominee; the 1995 testimony is supported only by news reports. WH fact sheet confirms 98/85/64.')
s(808, VC, GAOFR, 'official_record (GAO)', 'Label: "GAO estimate of annual fraud losses, 2018\u20132022 data."', 'GAO-26-108945: $233B-$521B annually, based on 2018-2022 data.')
for i,(amt,lab) in {811:('2,083','House'),812:('1,467','Senate'),813:('882','Capitol Police 852.35 + 30.0 mutual aid'),814:('852','LOC incl CRS'),815:('812','AOC 811.9 / GAO 811.9'),816:('132','GPO'),817:('75','CBO 74.75'),818:('143','Joint items 24.96 + OCWR 8.35 + COIL 6.0 + Stennis 0.43 + Sec.212 103.5 + widows 0.52 - 1.0 adj')}.items():
    s(i, V, 'https://www.congress.gov/crs-product/R48612', 'official_record (CRS)', '', f'CRS R48612 Table 5, FY2026 enacted (P.L. 119-37): {lab}. Total $7,258,022K.' + (' Note: Sec. 212 member-protection $103.5M was later repealed by P.L. 119-75 (Feb. 3, 2026).' if i==818 else ''))
s(828, V, D2P, 'government_data', '', ''); s(829, V, D2P, 'government_data', '', '2026-08-31: $40.176T; 2026-08-18 $40.047T.')
s(830, V, CBPSW, 'government_data', '', '')
s(831, VC, CBPSW, 'government_data', 'Add "(FY2009 began Oct. 2008, under Bush)". CPI peak Sept 2011 3.9% and EIA $3.965 (May 9, 2011) confirmed.', 'BLS CPI and EIA weekly regular confirmed.')
s(832, V, CBPNW, 'government_data', '', '')
s(833, V, EIAG, 'government_data', '', 'EIA 2018-05-28 $2.962; CPI peak 2.9% (Jun-Jul 2018).')
s(834, VC, CBPNW, 'government_data', 'Add: "FY2021 began Oct. 1, 2020, under Trump."', 'Fiscal-year trap.')
s(835, V, EIAG, 'government_data', '', 'EIA 2022-06-13 $5.006 (record); CPI 9.1% June 2022.')
s(836, V, CBPNW, 'government_data', '', '')
s(838, V, CBPNW, 'government_data', '', '')
s(848, VC, BLSUR, 'government_data', 'Keep facts. Replace "A door that falls that far in a year was a policy, not weather." with Our-view label. Add that FY2021 began under Trump. For balance, note Trump 2 gasoline peak $4.500 (May 11, 2026) and CPI peak 4.2% (May 2026).', 'All numbers confirmed (BLS, EIA, CBP). Framing asymmetric: site attributes Biden peaks to Biden but Trump-2 peaks to OPEC/tax/refining.')
s(850, VC, 'https://supreme.justia.com/cases/federal/us/395/444/', 'court_opinion', 'Keep the Schenck/Brandenburg legal history. Label the last two sentences Our view.', 'Schenck v. United States, 249 U.S. 47 (1919) (Holmes); Brandenburg standard correctly summarized.')
s(853, OP, '', '', 'Label Our view or specify which accusation and cite.', 'Unspecified.')
s(856, VC, 'https://www.justice.gov/criminal/criminal-vns/case/united-states-v-charles-littlejohn', 'official_record', 'Fix: "Hunter Biden was convicted on three felony gun counts (June 2024), pleaded guilty to nine tax counts (Sept. 2024) and was pardoned Dec. 1, 2024." Cite DOJ for Littlejohn (5 years, Jan. 29, 2024) and for Smirnov. "Millions from foreign sources" must link the Oversight Committee bank-records memo and be attributed to the committee majority. Label the last two sentences Our view.', 'Littlejohn sentenced to 5 years (DOJ, Jan 2024); 34 NY counts; two impeachment acquittals; Hunter Biden pardon Dec 1, 2024; Smirnov charged Feb 2024. "a gun count" is wrong (three).')
s(859, V, 'https://www.law.cornell.edu/uscode/text/5/3331', 'statute', '', '')
s(862, VC, GAOFR, 'official_record', 'Say "GAO \u2014 estimated fraud losses $233\u2013521B a year (2018\u20132022 data)".', '')
s(864, V, 'https://www.law.cornell.edu/uscode/text/8/1324', 'statute', '', ''); s(866, VC, 'https://www.law.cornell.edu/uscode/text/8/1373', 'statute', 'Describe accurately: "8 U.S.C. 1373 \u2014 bars laws restricting officials from sharing immigration-status information with ICE."', '')
s(868, V, 'https://www.law.cornell.edu/uscode/text/8/1611', 'statute', '', '')
s(870, VC, 'https://www.law.cornell.edu/uscode/text/2/1415', 'statute', 'Neutral label: "2 U.S.C. 1415 \u2014 Treasury account that pays awards and settlements under the Congressional Accountability Act (2018 reform requires members to reimburse harassment awards)."', 'Reform Act of 2018 (P.L. 115-397) made members personally liable for harassment awards.')
s(874, V, 'https://www.justice.gov/archives/opa/speech/attorney-general-william-p-barr-delivers-remarks-release-report-investigation-russian', 'official_record', '', 'Barr remarks Apr. 18, 2019 (justice.gov bot-blocked; well-documented DOJ record).')
s(875, VC, 'https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf', 'court_filing', 'Keep "four counts; no \u00a72383 insurrection count". Add that the case was dismissed without prejudice in Nov. 2024 after the election.', 'Indictment counts: 18 U.S.C. 371, 1512(k), 1512(c)(2), 241.')
s(880, V, 'https://www.justice.gov/storage/Report-of-Special-Counsel-Smith-Volume-1-January-2025.pdf', 'official_record', '', 'Vol. I dated Jan. 7, 2025; released Jan. 14, 2025.')
s(884, V, 'https://www.courtlistener.com/docket/67490070/united-states-v-trump/', 'court_filing', '', 'Dismissed July 15, 2024 (Judge Cannon).')
s(887, V, 'https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf', 'court_filing', '', '34 counts, falsifying business records (convicted May 30, 2024).')
s(889, V, 'https://manhattanda.org/district-attorney-bragg-announces-34-count-felony-indictment-of-former-president-donald-j-trump/', 'court_filing', '', '')
s(893, V, 'https://www.congress.gov/bill/116th-congress/house-resolution/755', 'official_record', '', '')
s(895, V, 'https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf', 'official_record', '', 'July 25, 2019 memorandum of call.')
s(671, OP, '', '', 'Label Our view: "The nonprofit pipe. Dark on the 990. Named on the PAC." is characterization, not a checkable figure.', 'Characterization. 26 U.S.C. 6104 governs 990 disclosure; donor names are not public on 990s for most 501(c)(4)s, but PAC donors are disclosed to FEC. Keep only if labeled.')

# --- tightened sourcing rule (steering #2) overrides ---
def ov(i, **kw):
    D[str(i)].update(kw)
ov(582, Verdict='Cannot verify, cut it', Source_Type='advocacy_study (not primary)', Best_Source_URL='',
   Fix_Needed='Remove the "92% negative" figure. MRC/NewsBusters is a media-advocacy outlet; its content study is not a primary record.',
   Notes='Tightened standard: media/advocacy outlets can only be cited as where a claim was made. No primary record exists for a media-tone percentage.')
for i in (622, 793, 805):
    ov(i, Verdict='Verified with correction needed', Source_Type='official_record (White House political messaging)',
       Fix_Needed='Keep this link only as the White House\u2019s own statement ("the White House says"). Any figures in the fact sheet (e.g., 98 charged / 85 of Somali descent / 64 convicted) must be attributed to the White House or sourced to DOJ court records.',
       Notes='Link loads (HTTP 200). A White House fact sheet is an official statement but also political messaging; under the tightened rule it cannot stand alone as the source for a fact.')
ov(724, Notes='Letter dated Oct. 11, 2024 exists (House Homeland Security Committee Republicans). Politicians\u2019 letter: cite only as "members wrote", never as proof of the facts asserted.')
ov(517, Best_Source_URL='https://data.bls.gov/timeseries/CUSR0000SA0', Source_Type='government_data', Fix_Needed='Replace the FRED link with the BLS series page https://data.bls.gov/timeseries/CUSR0000SA0.', Notes='FRED is a mirror of BLS CPI-U (seasonally adjusted, CUSR0000SA0); link the BLS original.')
ov(570, Notes='Carnegie Endowment\u2019s own upload of the event (unedited video; primary for what McCaul said). Quoted words not checked against the video by auditor.')

json.dump(D, open('/workspace/checkpoint-review/fv/verdicts_scorecard.json','w'), indent=1)
unv=[x['Item_No'] for x in R if x['Category']=='scorecard_stat' and x['Verdict']=='Unverified' and x['Item_No'] not in D]
print(len(D), 'missing:', unv)

# --- round-2 overrides (after ICE letter + Morin records) ---
import json as _j
ICEL='https://homeland.house.gov/wp-content/uploads/2024/09/24-01143-ICEs-Signed-Response-to-Representative-Tony-Gonzales.pdf'
ICEM='https://www.ice.gov/news/releases/hsi-baltimore-lends-vital-assist-local-partners-investigation-suspected-killer'
HSA='https://www.harfordcountystatesattorney.org/wp-content/uploads/2025/08/VMH-PR-Sentenicng-8-11-25.pdf'
ov(484, Verdict='Verified with correction needed', Best_Source_URL=ICEL, Source_Type='official_record (ICE signed letter to Congress, Sept. 25, 2024)',
   Fix_Needed='Keep "nearly 650,000" but cite ICE\u2019s signed letter, not the committee factsheet, and add context: "ICE: 647,572 noncitizens on the non-detained docket had criminal convictions (425,431) or pending charges (222,141) as of July 21, 2024. The docket spans decades of entries and administrations."',
   Notes='ICE letter to Rep. Gonzales (Sept. 25, 2024), table: non-detained convicted 425,431 + pending 222,141 = 647,572; total incl. detained 662,566. Committee is host only; document is ICE\u2019s.')
ov(485, Verdict='Verified with correction needed', Best_Source_URL=ICEL, Source_Type='official_record (ICE signed letter)',
   Fix_Needed='Change caption to: "ICE letter to Congress, non-detained docket, as of July 21, 2024. Convictions or pending charges. Not detained. Covers people who entered over decades."', Notes='See 484.')
ov(493, Verdict='Verified', Best_Source_URL=HSA, Source_Type='official_record (prosecutor)', Fix_Needed='Link the Harford County State\u2019s Attorney release instead of House Homeland.',
   Notes='Murder on Aug. 5, 2023, Bel Air, Maryland; jury conviction Apr. 2025; sentenced Aug. 11, 2025 to life without parole + life + 40 years.')
ov(494, Verdict='Verified with correction needed', Best_Source_URL=ICEM, Source_Type='official_record (ICE)',
   Fix_Needed='Replace with: "ICE: unlawfully present Salvadoran national, arrested in Tulsa June 14, 2024. Convicted of first-degree murder and rape; life without parole (Harford County, Aug. 11, 2025)." Drop "entered 2023" and "mother of five" unless a court record is linked; arrest date is June 14, not June 17.',
   Notes='ICE HSI release: apprehended June 14, 2024 by Tulsa PD (one line says June 15). Harford SA release confirms conviction and sentence. Entry date not stated in either primary record.')
for i,why in ((473,'Local TV news (ABC13) is the only source for the Texas busing totals; no Texas Division of Emergency Management record found.'),
              (569,'New York Times magazine piece (journalism, paywalled) is the only source given.'),
              (583,'MRC/NewsBusters media-advocacy study; no primary record for a media-tone percentage.'),
              (819,'Cato Institute blog estimate (think tank); not a primary record. The underlying cost estimate is Cato\u2019s own.')):
    ov(i, Verdict='Cannot verify, cut it', Best_Source_URL='', Source_Type='non_primary (removed)', Fix_Needed='Remove this link and the figure/claim it supports. '+why, Notes='Tightened standard: journalists/networks/think tanks/advocacy groups cannot be the source of a fact. '+why)
ov(577, Verdict='Cannot verify, cut it', Best_Source_URL='', Source_Type='non_primary (removed)', Fix_Needed='Replace RealClearPolitics with unedited original video of Waters\u2019 June 23, 2018 Los Angeles remarks. No C-SPAN or official upload was found in this pass; if none is linked, cut the quote.', Notes='RCP is an aggregator; no primary video located.')
ov(578, Verdict='Cannot verify, cut it', Best_Source_URL='', Source_Type='non_primary (removed)', Fix_Needed='Remove the RealClearPolitics link (aggregator). No unedited primary video found.', Notes='Tightened standard.')
_j.dump(D, open('/workspace/checkpoint-review/fv/verdicts_scorecard.json','w'), indent=1)

# --- round-3: SSA Dec 2025 snapshot confirmed via WebFetch ---
SNAP12='https://www.ssa.gov/policy/docs/quickfacts/stat_snapshot/2025-12.html'
ov(496, Verdict='Verified with correction needed', Best_Source_URL=SNAP12, Source_Type='government_data (SSA)', Fix_Needed='Keep $715 but label it "SSI average monthly payment, all recipients, Dec. 2025" (not a noncitizen-specific average).', Notes='SSA Monthly Statistical Snapshot Dec. 2025, Table 3: all recipients $714.53. Aug. 2026: $738.73.')
D['495']['Fix_Needed']=D['495']['Fix_Needed'].replace('SSI $739 (Aug. 2026)','SSI $715 (Dec. 2025, all recipients)')
ov(666, Fix_Needed='Keep Trustees figures. "$56 a month \u2014 $2,015 to $2,071" matches the retired-worker average before/after the 2.8% COLA (SSA snapshot Dec. 2025: $2,071.30); link the snapshot. Remove "Markets historically paid 7\u20138%" and "implied return ~2% real" (no primary source).', Notes='Trustees figures confirmed (2026 report). SSA snapshot Dec. 2025 retired-worker average $2,071.30; COLA 2.8%.')
_j.dump(D, open('/workspace/checkpoint-review/fv/verdicts_scorecard.json','w'), indent=1)
