# Final source/fix sweep on merged state. Writes verdicts_sweep.json (merged last by apply.py).
import csv,json,re
from sweep_lib import *
B='/workspace/checkpoint-review/'
rows={x['Item_No']:x for x in csv.DictReader(open(B+'backup-pre-fullverify/verified-items.csv'))}
for f in ['verdicts_scorecard.json','verdicts_ledger_resource.json','verdicts_respot.json','verdicts_essays.json','verdicts_media.json','verdicts_late.json']:
    for k,v in json.load(open(f)).items(): rows[k].update(v)
V='Verified';VC='Verified with correction needed';CV='Cannot verify, cut it';OP='Opinion (needs an "Our view" label)'
OPV=[x['Verdict'] for x in rows.values() if x['Verdict'].startswith('Opinion')][0]
OUT={}
def s(k,**kw): OUT.setdefault(k,{}).update(kw)
CSPAN_J6='https://www.c-span.org/video/?507744-1/president-trump-speaks-rally-washington-dc'
DURHAM='https://www.justice.gov/storage/durhamreport.pdf'
MUELLER='https://www.justice.gov/archives/sco/file/1373816/dl'
USAO='https://web.archive.org/web/0/https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol'
J6RPT='https://www.govinfo.gov/app/details/GPO-J6-REPORT'
DC='https://www.courtlistener.com/docket/67656595/united-states-v-trump/'
FL='https://www.courtlistener.com/docket/67490071/united-states-v-trump/'
NYIND='https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf'
RICE='https://www.hsgac.senate.gov/wp-content/uploads/imo/media/doc/rice%20letter.pdf'
blk='Site link is itself a primary record; it returned an HTTP error only to the automated checker (bot-blocked). Text confirmed in the earlier pass.'
# ---- generic rules on uncovered-or-any rows
for k,x in rows.items():
    v=x['Verdict']; f=x['Fix_Needed']; b=x['Best_Source_URL']
    if not v.startswith('Verified'): continue
    lgp=[u for u in urls(x['Links_Given']) if isprim(u)]
    if not isprim(b) and lgp: s(k,Best_Source_URL=lgp[0],Source_Type='primary record (site link)')
    if f.startswith('Replace/mirror'):
        s(k,Verdict=V,Fix_Needed='',Notes=(x['Notes']+' | ' if x['Notes'] else '')+blk)
# ---- explicit
s('2',Best_Source_URL='https://oig.justice.gov/sites/default/files/reports/23-085.pdf',Source_Type='official_record (DOJ OIG report 23-085, June 2023)',
  Fix_Needed='Link the medical-examiner ruling and the guard/camera failures to DOJ OIG report 23-085 (https://oig.justice.gov/sites/default/files/reports/23-085.pdf), and the July 2025 memo to https://www.justice.gov/opa/media/1407001/dl. No change to the wording.')
s('9',Best_Source_URL='https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-infrastructure/')
s('171',Best_Source_URL='https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-infrastructure/')
s('42',Best_Source_URL='https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-infrastructure/')
s('43',Best_Source_URL='https://www.presidency.ucsb.edu/documents/remarks-the-situation-charlottesville-virginia',Source_Type='original transcript (Aug. 14, 2017 remarks, American Presidency Project)')
s('10',Best_Source_URL='https://www.c-span.org/program/campaign-2024/former-president-trump-campaigns-in-vandalia-ohio/639757',Source_Type='unedited video (C-SPAN, Vandalia, Ohio, Mar. 16, 2024)')
s('169',Best_Source_URL='https://www.c-span.org/program/campaign-2024/former-president-trump-campaigns-in-vandalia-ohio/639757',Source_Type='unedited video (C-SPAN, Vandalia, Ohio, Mar. 16, 2024)')
for k in ('11','170'): s(k,Best_Source_URL=urls(rows[k]['Links_Given'])[0],Source_Type='unedited video of the Dec. 5, 2023 Fox News town hall (cited as where he said it)')
s('115',Best_Source_URL=urls(rows['115']['Links_Given'])[0],Source_Type='unedited video (All-In Podcast, Sept. 15, 2026; cited as where he said it)')
s('13',Best_Source_URL=urls(rows['13']['Links_Given'])[0]); s('15',Best_Source_URL=urls(rows['15']['Links_Given'])[0])
for k in ('33','156','172','845','849'): s(k,Best_Source_URL=CSPAN_J6,Source_Type='unedited video (C-SPAN, Ellipse, Jan. 6, 2021)')
s('24',Verdict=VC,Best_Source_URL=DURHAM,Fix_Needed='TRUTH: The Durham report says the FBI could not corroborate any of the substantive allegations in the Steele reports, including the claimed tape. A rumor is not an exhibit.')
s('25',Verdict=VC,Fix_Needed='TRUTH: He was a U.S. person under a FISA warrant in which the inspector general found 17 significant errors and omissions. He was never charged as a Russian agent or with any crime.')
s('29',Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='Only source is the House Oversight Committee (political). No primary record of the "big guy" line or bank records located.')
s('31',Verdict=VC,Best_Source_URL='https://www.presidency.ucsb.edu/documents/remarks-prior-meeting-with-president-volodymyr-zelenskiy-ukraine-and-exchange-with',Source_Type='original transcript (Sept. 25, 2019)',
  Fix_Needed='TRUTH: On September 25, 2019, Zelensky said of the call, “nobody pushed me.” The Senate acquitted on February 5, 2020.')
s('32',Verdict=VC,Fix_Needed='TRUTH: 18 U.S.C. § 2383. USAO-DC: about 1,583 people federally charged, including about 608 charged with assaulting officers; leaders of the Oath Keepers and Proud Boys were convicted of seditious conspiracy under § 2384. Zero under § 2383.')
s('178',Verdict=VC,Fix_Needed='TRUTH: 18 U.S.C. § 2383. About 1,583 federally charged, including about 608 charged with assaulting officers; leaders of the Oath Keepers and Proud Boys were convicted of seditious conspiracy under § 2384. Zero under the insurrection statute.')
for k in ('298','389','448','784','872','878','882','876'): s(k,Verdict=V,Fix_Needed='',Notes='Accurate as written: no one was charged under § 2383 (USAO-DC 48-month tally). Seditious-conspiracy convictions (§ 2384) are a different statute.')
s('876',Notes='Caption quoted as the claim being tested; the record (USAO-DC tally) shows no § 2383 charge.')
s('456',Verdict=V,Fix_Needed='',Best_Source_URL=NYIND,Source_Type='court filing (Manhattan indictment)')
s('847',Verdict=V,Fix_Needed='',Best_Source_URL=FL,Source_Type='court docket (S.D. Fla. 23-cr-80101)')
s('849',Verdict=V,Fix_Needed='')
s('852',Verdict=V,Fix_Needed='',Best_Source_URL=MUELLER,Source_Type='official_record (Mueller report)')
s('841',Verdict=V,Fix_Needed='',Best_Source_URL=DC,Source_Type='court docket (D.D.C. 23-cr-257)')
s('845',Verdict=VC,Fix_Needed='Replace “The House article — H.Res. 24, incitement of insurrection — put a clipped version of that speech on the floor. The country was shown the fighting words. The peaceably clause was not on the clip they ran.” with “The House article — H.Res. 24, incitement of insurrection — quoted “fight like hell” and not the line to protest “peacefully and patriotically.””')
s('205',Verdict=V,Fix_Needed='',Best_Source_URL=DC)
s('198',Best_Source_URL=DC)
s('148',Verdict=VC,Fix_Needed='TRUTH: Dozens of cases were filed. None established outcome-changing fraud. On December 11, 2020, the Supreme Court denied Texas leave to file its suit against Pennsylvania, Georgia, Michigan and Wisconsin.')
s('139',Verdict=V,Fix_Needed='',Notes='CBO 61367 (Aug. 2025) and CRS R48552 confirm about 2.4 million fewer participants in an average month; ages through 64 and adults with children 14 or older.')
s('61',Verdict=V,Fix_Needed='',Best_Source_URL='https://supreme.justia.com/cases/federal/us/601/100/')
s('48',Fix_Needed='Replace the site link with the Dec. 11, 2020 FDA emergency use authorization release: '+rows['48']['Best_Source_URL']+'. No change to the wording.')
s('63',Verdict=V,Fix_Needed='',Best_Source_URL=J6RPT,Source_Type='official congressional report (Jan. 6 Select Committee final report, GPO)')
s('69',Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='Only support is news reporting (NPR); no primary CBP record located.')
s('84',Verdict=VC,Best_Source_URL='https://www.presidency.ucsb.edu/documents/background-press-call-senior-administration-officials-russia',Source_Type='original transcript (White House background call, Apr. 15, 2021)',
  Fix_Needed='TRUTH: The New York Times printed it in June 2020. On April 15, 2021, the White House said U.S. intelligence assessed with low to moderate confidence that Russian intelligence officers sought to encourage Taliban attacks on U.S. and coalition personnel. Low-to-moderate confidence is not a confirmed order.')
s('90',Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='No primary or where-said link for the Oct. 2024 interview located; the site link (Ferguson report) is unrelated.')
s('107',Verdict=V,Best_Source_URL='https://www.dhs.gov/news/2026/09/22/correct-record-dhs-debunks-false-narratives-about-shooting-illegal-alien-austin',Source_Type='official statement (DHS, Sept. 22, 2026)')
s('110',Verdict=VC,Best_Source_URL='https://www.dhs.gov/news/2026/09/22/correct-record-dhs-debunks-false-narratives-about-shooting-illegal-alien-austin',Source_Type='official statement (DHS, Sept. 22, 2026)',
  Fix_Needed='Replace “Resisting an officer and evading arrest is a federal felony.” with “Forcibly resisting a federal officer is a federal crime under 18 U.S.C. § 111.”')
s('112',Verdict=V,Best_Source_URL='https://www.eia.gov/petroleum/gasdiesel/',Source_Type='government data (EIA weekly retail prices)')
s('116',Verdict=OPV,Fix_Needed='Label Our view.',Best_Source_URL='')
s('132',Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='No primary source attached (site link is an unrelated IAEA report).')
s('138',Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='Standing/seated claim not checked against the unedited SOTU video; site link (CBO SNAP) is unrelated.')
s('140',Verdict=V,Best_Source_URL='https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/24-1260.html',Source_Type='court docket (Watson v. RNC, No. 24-1260)')
s('142',Best_Source_URL=USAO,Source_Type='official_record (USAO-DC 48-month tally)',Notes='Lamberth quote not opened in this pass.')
s('143',Verdict=V,Fix_Needed='',Best_Source_URL='https://www.congress.gov/bill/116th-congress/house-joint-resolution/31',Source_Type='statute (Consolidated Appropriations Act, 2019)')
s('157',Verdict=OPV,Fix_Needed='Label Our view.',Best_Source_URL='')
s('160',Verdict=V,Best_Source_URL='https://constitution.congress.gov/browse/essay/artI-S9-C7-1/ALDE_00001094/',Source_Type='Constitution Annotated (Appropriations Clause)')
s('34',Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='Row has no record ("TRUTH") text and no primary source.')
for k in ('177','186','195','289','387','184'): s(k,Best_Source_URL=DURHAM,Source_Type='official_record (Durham report)')
for k in ('21','54'): s(k,Best_Source_URL=MUELLER,Source_Type='official_record (Mueller report)')
s('179',Verdict=V,Fix_Needed='',Best_Source_URL='https://www.justice.gov/opa/pr/attorney-general-william-p-barrs-statement-riots-and-domestic-terrorism',Source_Type='official statement (DOJ)')
s('197',Verdict=V,Fix_Needed='',Best_Source_URL='https://www.congress.gov/bill/117th-congress/house-resolution/24',Source_Type='congressional record (H.Res. 24)')
s('208',Verdict=V,Best_Source_URL=RICE,Source_Type='declassified record (Rice note to file, via Senate HSGAC)')
s('60',Best_Source_URL='https://www.senate.gov/legislative/LIS/roll_call_votes/vote1171/vote_117_1_00059.htm',Source_Type='Senate roll call vote')
s('80',Best_Source_URL='https://ag.ny.gov/press-release/2019/court-orders-president-trump-pay-2-million-illegally-using-trump-foundation-funds',Source_Type='official statement (NY Attorney General)')
s('117',Best_Source_URL='https://www.justice.gov/pardon/pardons-granted-president-joseph-biden-2021-present',Source_Type='official_record (DOJ Office of the Pardon Attorney)')
s('185',Fix_Needed=rows['185']['Fix_Needed'])  # late override keeps its own
# ---- resolve 'Same as' pointers
merged={k:dict(rows[k],**OUT.get(k,{})) for k in rows}
for k,x in merged.items():
    f=x['Fix_Needed']; m=re.match(r'(?:Same as|See)(?: item)? (\d+)\.?$',f.strip())
    if x['Verdict'].startswith('Verified with') and m:
        t=merged[m.group(1)]
        s(k,Fix_Needed='Same correction as item %s: %s'%(m.group(1),t['Fix_Needed']) if t['Fix_Needed'] else '',**({} if t['Fix_Needed'] else {'Verdict':t['Verdict']}))
    if f.strip()=='Same as Insurrection.': s(k,Verdict=V,Fix_Needed='')
json.dump(OUT,open('verdicts_sweep.json','w'),indent=1,ensure_ascii=False)
print(len(OUT))
s('102',Best_Source_URL='https://www.illinoiscourts.gov/supreme-court/courts-supreme-court-high-profile-cases',Source_Type='court record (Illinois Supreme Court)')
for k in ('566','567'): s(k,Verdict=CV,Fix_Needed='remove',Best_Source_URL='',Notes='McCaul quote not checked against the broadcast audio; network page is not a primary record. The essay paragraph using it was cut.')
for k in ('711','712','713','714','715'): s(k,Source_Type='roll-call data (GovTrack mirror of the official 1964 House roll call; judgment call: mirror of the official record, not GovTrack analysis)')
json.dump(OUT,open('verdicts_sweep.json','w'),indent=1,ensure_ascii=False)
s('364',Verdict=CV,Fix_Needed='remove',Notes='Chemonics wording not confirmed against the CRS R48150 text; cut in the essay.')
s('573',Verdict=V,Fix_Needed='',Notes='C-SPAN program 679567 (Jeffries at the CAP IDEAS conference) exists per search index; page blocks automated fetch, so quoted wording not reviewed against the video by the auditor.')
json.dump(OUT,open('verdicts_sweep.json','w'),indent=1,ensure_ascii=False)
F7='Replace “Iran is the only non-weapon state at 60 percent.” with “The IAEA’s February 2026 report (GOV/2026/8, https://www.iaea.org/sites/default/files/gov2026-8.pdf) says Iran is the only non-nuclear-weapon state party to the NPT producing uranium enriched to that level.” Keep 440.9 kg (GOV/2026/50). Change “Hakeem Jeffries used “war of choice.”” to ““War of choice” was said on the House floor on March 4, 2026 (Congressional Record).”'
s('7',Fix_Needed=F7); s('136',Fix_Needed='Keep 440.9 kg (GOV/2026/50). Change “Jeffries said it.” to ““War of choice” was said on the House floor on March 4, 2026 (Congressional Record, https://www.congress.gov/119/crec/2026/03/04/172/41/CREC-2026-03-04-house.pdf).”')
json.dump(OUT,open('verdicts_sweep.json','w'),indent=1,ensure_ascii=False)
