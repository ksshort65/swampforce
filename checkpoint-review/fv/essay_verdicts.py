import json
V='Verified'; VC='Verified with correction needed'; CV='Cannot verify, cut it'; FC='False, cut it'; OP='Opinion'
D={}
def s(i,v,url='',st='',fix='',notes=''):
    D[str(i)]=dict(Verdict=v,Best_Source_URL=url,Source_Type=st,Fix_Needed=fix,Notes=notes)
R48612='https://www.congress.gov/crs-product/R48612'; RL30064='https://www.congress.gov/crs-product/RL30064'
CBO='https://www.cbo.gov/publication/61882'; IN12324='https://www.congress.gov/crs-product/IN12324'
TD='https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/'
A1='https://constitution.congress.gov/constitution/article-1/'; A5='https://constitution.congress.gov/constitution/article-5/'
AM1='https://constitution.congress.gov/constitution/amendment-1/'
BRAND='https://supreme.justia.com/cases/federal/us/395/444/'
HUTCH='https://supreme.justia.com/cases/federal/us/443/111/'
DSA='https://program.dsausa.org/'
FA='https://www.foreignassistance.gov/'
STOCK='https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf'
NT='https://www.courtlistener.com/docket/72028010/national-trust-for-historic-preservation-in-the-united-states-v-national/'
THINK='Think-tank/advocacy estimate; not an official record, government data, court filing, transcript or unedited video (tightened standard).'
NEWS='Supported only by news reporting (tightened standard).'
POLL='Private poll; not on the list of acceptable primary types (official record, government data, court filing, transcript, unedited video).'
# a-barcode-is-not-a-lock
s(275,VC,'','official_record (to be linked)','Link the NY Attorney General\u2019s Aug. 2020 press release/complaint (New York v. Trump, S.D.N.Y. 2020) as where the quote was made; otherwise cut the quote. Keep the framing only as Our view.','Lawsuit exists (NY-led multistate suit vs. USPS, Aug. 2020); quote not opened from a primary copy.')
D['275']['Verdict']=CV; D['275']['Fix_Needed']='Remove the Letitia James quote unless the AG\u2019s own release/complaint is linked; the chalkboard framing may stay as Our view.'
s(276,CV,'','','Remove "Ninety-five percent of 2020 ballots had a paper record" and the 60 Minutes paraphrase unless CISA\u2019s Nov. 12, 2020 joint statement is linked and quoted directly.','No primary copy opened in this pass; 60 Minutes is a network.')
s(277,CV,'','',"Remove both figures (150,000 ballots; 99.89 percent). "+NEWS,'WaPo is the stated source; no USPS/USPS-OIG record opened.')
s(278,CV,'','','Remove. No August 2026 USPS rule on mail-voter enrollment/barcodes was found in the Federal Register (FR API search, 2026).','Extraordinary claim with no primary record found.')
s(279,OP,'','','Label Our view.',''); s(280,OP,'','','Label Our view.',''); s(281,OP,'','','Label Our view.','General statements; no figure.')
# a-caption-cannot-be-outlawed
s(378,VC,'','','Cut "Networks run 92% negative" (MRC study; not primary). Quotes "Maximum warfare" (Jeffries, C-SPAN Apr. 22, 2026) and "Get in their face" (Waters, 2018) must link unedited video or be cut. Rest is Our view.','')
s(379,OP,'','','Label Our view.',''); s(380,V,BRAND,'court_opinion','','Brandenburg v. Ohio incitement test accurately stated; Article I, Sec. 5 discipline power accurate.')
s(381,OP,'','','Label Our view (policy proposals).','')
# defund-ice-is-the-tell
s(231,FC,'','','Remove "lost hundreds of thousands of children inside a federal program." DHS OIG (OIG-24-46, Aug. 2024) reported ICE could not monitor the location of 32,000+ unaccompanied children who failed to appear in court and that 291,000+ had not been served NTAs; that is not "lost" in a federal program. The rest is Our view.','Misstates the OIG findings.')
s(232,OP,'','','Label Our view.','')
s(233,OP,'','','Label Our view.','')
# division-is-the-product
s(218,CV,'','','Remove the MRC 92% figure. '+THINK,'')
s(284,OP,'','','Label Our view.',''); s(285,OP,'','','Label Our view.','')
s(286,V,'','book (primary text): Hannah Arendt, The Origins of Totalitarianism (1951), ch. 13','','Accurate paraphrase: "The ideal subject of totalitarian rule is ... people for whom the distinction between fact and fiction ... no longer exist[s]."')
# full-time-or-go-home
s(239,VC,R48612,'official_record (CRS)','Fix member salary to $174,000 (CRS RL30064) where the paragraph says $174,500.','P.L. 119-37: total $7.258B; House $2.083B; Senate $1.467B; Capitol Police $852M + $30M mutual aid = ~$882M.')
s(240,VC,RL30064,'official_record (CRS)','Say "a pension after five years of service (FERS)" and "an office allowance of roughly $1.85\u2013$2.09 million per House office (2025)". Label the call-time and lecture sentences Our view.','')
# it-does-not-fit
s(245,VC,'','','Cut the Urban Institute estimate (think tank). Replace "Congress has never scored the bill" with "CBO has not scored a specific Medicare for All bill."',THINK)
s(246,VC,CBO,'official_record (CBO)','Change "CBO, March 2026" to "CBO, February 2026". Keep $5.6T in, $7.4T out, $1.9T deficit (5.8% of GDP), debt held by the public 101% of GDP rising to 120% by 2036.','CBO Outlook 2026\u20132036 Table 1-1: revenues $5,596B; outlays $7,449B; deficit $1,853B; debt held by public 100.6% (2026) \u2192 120.2% (2036).')
for i in (247,248,249): s(i,CV,'','','Remove: the arithmetic rests on the Urban Institute $34T estimate, which cannot stand as a source. ($5.6T \u00d7 6 = $33.6T and GDP \u2248 $32T are correct CBO-based figures.)',THINK)
s(250,CV,'','','Remove (Urban Institute estimate).',THINK)
for i in (251,252,253,254,255,256,257): s(i,CV,'','','Remove the CRFB pay-for table.',THINK)
s(258,V,CBO,'official_record (CBO)','Label the second half Our view.','CBO: net interest $1,039B (2026) \u2192 $2,144B (2036), i.e., roughly doubles.')
s(259,VC,DSA,'primary_document (DSA platform)','Cut the Cato stack (think tank). DSA\u2019s own program may be cited for what DSA proposes. Label the "not confused" sentences Our view.','')
s(260,VC,'','','Remove the Urban $32\u201334T figure; keep the demand as Our view.','')
# not-a-part-time-job
s(345,V,R48612,'official_record (CRS)','','$7.258B, P.L. 119-37; member salary $174,000 (CRS RL30064).')
D['345']['Verdict']=VC; D['345']['Fix_Needed']='Member salary is $174,000, not $174,500 (CRS RL30064).'
s(346,CV,'','','Remove (Ballotpedia is not a primary source). Replace, if desired, with congress.gov "Days in Session" calendars.','Secondary compilation.')
s(347,CV,'','','Remove unless linked to the official House/Senate calendars on congress.gov.','Not opened from a primary calendar.')
s(348,CV,'','','Remove (USAFacts compilation).','Secondary compilation.')
s(349,VC,RL30064,'official_record (CRS)','Use $174,000 (not $174,500). Label "It must stop" as Our view.','')
# one-word
s(288,VC,'https://www.congress.gov/bill/116th-congress/house-resolution/755','official_record','Keep "impeached twice" and "four criminal cases"; label the rest Our view.','Impeachments: H.Res. 755 (2019), H.Res. 24 (2021).')
# the-7-billion-machine
s(307,VC,'https://www.congress.gov/crs-product/R40962','official_record (CRS)','Keep House $2.083B (R48612). Confirm the 2025 MRA range in CRS R40962 before publishing; 18 permanent + 4 additional staff is the House rule.','')
s(308,VC,R48612,'official_record (CRS)','Keep $1.467B. Label "sits fewer days than a school year" Our view or cite calendars.','')
s(309,V,R48612,'official_record (CRS)','','Capitol Police $852.35M + $30.0M mutual aid (Div. A).')
s(310,V,R48612,'official_record (CRS)','','LOC incl. CRS ~$852M; CRS $136.1M (FY2025 level continued in FY2026).')
s(311,V,R48612,'official_record (CRS)','','AOC $811.9M.'); s(312,V,R48612,'official_record (CRS)','Label "auditor of everyone except..." Our view.','GAO $811.9M.')
s(313,V,R48612,'official_record (CRS)','','GPO $132M; CBO $74.75M; Joint Items $24.96M; $522,000 widows/heirs (Div. A).')
s(314,VC,RL30064,'official_record (CRS)','Fix the outside earned-income cap: "$33,855 (2026)". $33,285 was the 2024 limit.','CRS RL30064: 2026 limit $33,855 (15% of Executive Schedule level II).')
s(315,VC,RL30064,'official_record (CRS)','Fix salary: $174,000 (not $174,500). Label the rest Our view.','CRS RL30064: $174,000.'); s(316,VC,STOCK,'statute','Keep "STOCK Act of 2012 (P.L. 112-105)". Label "was a press conference. The trades continued." Our view.','')
s(317,OP,'','','Label Our view.','')
# the-caption-was-not-the-charge
s(388,VC,'https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf','official_record (DOJ)','Keep the NSBA quote only with a primary copy of the Sept. 29, 2021 letter; the AG memo (Oct. 4, 2021) is primary.','')
s(390,VC,'https://www.congress.gov/bill/117th-congress/house-resolution/503','official_record','Label "stacked" as Our view.','H.Res. 503 Sec. 2; Pelosi rejected Jordan and Banks (July 21, 2021).')
s(391,VC,'https://www.congress.gov/bill/116th-congress/house-resolution/755','official_record','Keep facts; label the rest Our view.','')
# the-check-they-will-not-write
s(261,VC,'https://www.congress.gov/bill/118th-congress/house-bill/40','official_record','Say "A reparations study bill has been introduced in every Congress since 1989 (first by Rep. John Conyers)." It studies; it does not pay.','Bill number H.R. 40 was not used in 1989.')
s(262,OP,'','','Label Our view.','')
s(263,CV,'','','Remove the Darity/Brookings figures.',THINK)
for i in (264,265,266,267): s(i,CV,'','','Remove (rests on think-tank estimates: Darity, Urban, Cato).',THINK)
s(268,CV,'','','Remove the $800 billion figure and the Newsom sentence unless the California Reparations Task Force report and a bill record are linked.',NEWS)
s(269,VC,'https://www.congress.gov/bill/100th-congress/house-bill/442','statute','Keep "$20,000 to each eligible surviving internee (Civil Liberties Act of 1988, P.L. 100-383)". Drop "roughly $1.6 billion" unless DOJ\u2019s Office of Redress Administration total is linked.','')
s(270,CV,'','','Remove the Evanston/DOJ 2026 sentence: no DOJ filing located.','')
s(271,VC,CBO,'official_record (CBO)','Keep the CBO figures and "debt near $40 trillion" (Treasury). Remove the Cato $6.6T Forbes-400 figure.','')
s(272,OP,'','','Label Our view.',''); s(273,V,'https://constitution.congress.gov/constitution/amendment-14/','constitution','','13th/14th/15th Amendments; Civil Rights Act 1964; Voting Rights Act 1965.')
s(274,OP,'','','Label Our view.','')
# the-debt-they-will-not-close
s(358,V,TD,'government_data (Treasury)','','Debt to the Penny first exceeded $40T on Aug. 18, 2026 ($40.047T).')
s(359,VC,IN12324,'official_record (CRS)','Replace Pew with CRS. Keep "FY1997 was the last year all regular appropriations were enacted by Oct. 1." Keep the four-year list (FY1977, 1989, 1995, 1997) only if a CRS table is linked.','CRS IN12324 confirms FY1997.')
s(360,OP,'','','Label Our view.',''); s(361,V,'https://www.law.cornell.edu/uscode/text/5/3331','statute','','Accurate statement of the law.')
# the-file-on-the-man
s(337,VC,'https://www.fbi.gov/','official_record','Keep "two impeachments, four criminal cases, 91 felony counts". The Butler shooting (July 13, 2024) should link an FBI record.','')
s(338,OP,'','','Label Our view.','')
# the-floor-not-the-feed
s(382,V,A1,'constitution','','Art. I, Sec. 6, cl. 1.')
s(383,V,HUTCH,'court_opinion','','Hutchinson v. Proxmire, 443 U.S. 111 (1979); Gravel v. United States, 408 U.S. 606 (1972).')
s(384,VC,BRAND,'court_opinion','Replace the Oyez link with the opinion (Justia/supremecourt.gov).','')
# the-law-they-dont-mention
s(385,OP,'','','Label Our view.',''); s(386,OP,'','','Label Our view.','')
# the-line-in-the-sand
s(318,VC,'https://www.congress.gov/bill/119th-congress/house-bill/22','official_record','Say "The SAVE Act (H.R. 22) passed the House April 10, 2025; the Senate has not taken it up." Label "uniparty ... protecting a system" Our view.','congress.gov: latest action Apr. 10, 2025, received in the Senate.')
s(319,CV,'','','Remove the Pew 83% and Gallup 84% figures (both links 404).',POLL)
s(320,OP,'','','Label Our view.','')
# the-noise
s(234,CV,'','','Remove "Gallup, April 2026: ten percent approve".',POLL)
s(235,VC,IN12324,'official_record (CRS)','Keep "not met on time since FY1997". Remove "least productive" unless a congress.gov count of public laws is linked. Label the jersey sentences Our view.','')
# the-recess-blockade
s(304,V,'https://www.congress.gov/crs-product/RS21308','official_record (CRS)','','CRS RS21308: Clinton 139; G.W. Bush 171; Obama 32 (as of Feb. 1, 2015).')
s(305,VC,'https://www.law.cornell.edu/supct/pdf/12-1281.pdf','court_opinion','Say "a recess of fewer than ten days is presumptively too short" (the Court\u2019s wording). Label "Fiction with a gavel" Our view.','NLRB v. Noel Canning, 573 U.S. 513 (2014).')
s(306,OP,'','','Label Our view.','')
# the-republic-not-the-caption
s(287,V,'https://constitution.congress.gov/','constitution','','Articles I\u2013III.')
# the-uniparty-mirror
s(321,V,'https://www.congress.gov/bill/118th-congress/house-bill/3746','official_record','Label "keep the machine fed" Our view.','Fiscal Responsibility Act of 2023, P.L. 118-5.')
# the-whole-bill
s(241,VC,'https://www.congress.gov/bill/93rd-congress/house-bill/7130','statute','Say "the 1974 Budget Act set Oct. 1 as the fiscal year start and a timetable for appropriations; there are now twelve regular bills." The Act does not itself name twelve bills.','')
s(242,CV,'','','Remove the Urban $32\u201334T figure.',THINK)
s(243,VC,'https://www.congress.gov/bill/93rd-congress/house-bill/7130','statute','Same as 241.',''); s(244,V,'https://www.law.cornell.edu/uscode/text/5/3331','statute','Label the last sentences Our view.','')
# they-dont-debate-they-flag
s(282,OP,'','','Label Our view (response to an accusation).',''); s(283,OP,AM1,'','Label Our view.','')
# they-hold-it-by-the-blade
s(296,V,HUTCH,'court_opinion','Replace the Oyez link with the opinion.','')
s(297,V,BRAND,'court_opinion','',''); s(299,V,A1,'constitution','','Art. I, Sec. 9, cl. 7.')
s(300,V,IN12324,'official_record (CRS)','','FY1997 last on-time year.')
# they-published-the-replacement
s(301,V,'https://www.law.cornell.edu/uscode/text/18/2384','statute','','18 U.S.C. 2384 and 2385 accurately summarized.')
s(302,V,DSA,'primary_document (DSA platform)','','Live program page (program.dsausa.org, read 2026-09-24) says: "to win the battle for democracy, draft a new constitution, and create a democratic socialist republic"; also "abolish the Senate" and "Replace the President and Supreme Court with an executive and judiciary chosen by and subordinate to Congress."')
s(303,V,A5,'constitution','','')
# they-sold-the-split
s(236,CV,'','','Remove the MRC 92% figure.',THINK); s(237,OP,'','','Label Our view.',''); s(238,OP,BRAND,'','Label Our view.','')
# they-work-for-us
s(290,VC,'https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623','unedited_video','Keep with C-SPAN link (unedited). Quote not reviewed against video by auditor; confirm timestamp.','')
s(291,CV,'','','Remove: the only link is a Fox News video (network). Restore only with unedited video or an official transcript.','')
s(292,VC,'https://www.c-span.org/clip/us-senate/user-clip-youve-released-the-whirlwind-and-you-will-pay-the-price--sen-chuck-schumer/4944670','unedited_video','Replace the YouTube link with the C-SPAN clip; "He later said he misspoke" \u2192 cite the Congressional Record, Mar. 5, 2020.','Remarks were at a rally outside the Court, Mar. 4, 2020.')
s(293,CV,'','','Remove unless the unedited original video (not an anonymous YouTube upload) is linked for each quote.','Provenance of YouTube uploads not established.')
s(294,VC,'https://x.com/KamalaHarris/status/1267555018128965643','social_media (where the statement was made)','Keep only as "Harris posted" with the post linked; the post is the record of her own words, not proof of anything else.','')
s(295,VC,'https://www.nbcnews.com/video/biden-says-it-was-a-mistake-to-use-bullseye-in-remarks-about-trump-214895685978','network (where the statement was made)','Keep as "Biden told NBC\u2019s Lester Holt (July 15, 2024)"; the donor-call quote needs a primary transcript or should be cut.','Interview aired July 15, 2024.')
# this-congress-cannot-police-itself
s(342,OP,'','','Label Our view.',''); s(343,V,'https://supreme.justia.com/cases/federal/us/514/779/','court_opinion','','U.S. Term Limits v. Thornton, 514 U.S. 779 (1995); Article V accurately described.')
s(344,OP,'','','Label Our view (proposal).','')
# what-he-told-them
s(339,V,'https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-73rd-session-united-nations-general-assembly-new-york-ny/','original_transcript','','Sept. 25, 2018 UNGA: "We reject the ideology of globalism, and we embrace the doctrine of patriotism."')
s(340,VC,'https://www.war.gov/News/Releases/Release/Article/2049534/statement-by-the-department-of-defense/','official_record (DoD)','Keep Jan. 3, 2020 strike (DoD statement). "First time in a generation" is Our view. Link his public warnings to the original posts as where they were made.','')
# what-the-democratic/republican-party-became
s(322,VC,'https://www.congress.gov/bill/88th-congress/house-bill/7152','official_record','History summary; label characterizations Our view.',''); s(323,OP,'','','Label Our view.','')
s(324,VC,TD,'government_data','History summary; label characterizations Our view.',''); s(325,OP,'','','Label Our view.','')
# what-they-are-protecting
s(362,OP,'','','Label Our view.','')
s(363,CV,'','','Remove the Devex figures (news). Restore only with USASpending.gov queries linked.',NEWS)
s(364,VC,'https://www.congress.gov/crs-product/R48150','official_record (CRS)','Confirm the Chemonics wording against CRS R48150 before publishing; otherwise cut.','')
s(365,CV,'','','Remove the OpenSecrets lobbying figures (secondary compilation). Restore only with Senate LDA data.','Secondary compilation.')
s(366,CV,'','','Remove LegiStorm counts (secondary compilation).','')
s(367,VC,'https://www.opensocietyfoundations.org/','organization\u2019s own disclosure','Attribute: "Open Society Foundations says it spent..." Link the OSF expenditures page, not the home page.','')
s(368,CV,'','','Remove (Washington Post).',NEWS); s(369,CV,'','','Remove (Politico).',NEWS)
s(370,VC,FA,'government_data','Replace the Pew link with ForeignAssistance.gov: FY2023 disbursements $71.9B; USAID ~$43.8B.','')
s(371,OP,'','','Label Our view.',''); s(372,CV,'','','Remove (OpenSecrets).','Secondary compilation.'); s(373,CV,'','','Remove the "$5 billion" figure.','Secondary compilation.')
s(374,OP,'','','Label Our view.','')
s(375,V,STOCK,'statute','','STOCK Act, P.L. 112-105 (2012).')
s(376,VC,STOCK,'statute','Keep the $200 late-filing fee. Remove the Campaign Legal Center claim (advocacy group).','')
s(377,OP,'','','Label Our view.','')
# what-we-can-do
s(350,VC,'','','Remove "Five billion in lobbying" and "Tens of millions into local prosecutors" (cut elsewhere). Keep $40T (Treasury), $7.258B (CRS), $200 (STOCK Act). Rest Our view.','')
s(351,V,AM1,'constitution','Label the second half Our view.',''); s(352,OP,'','','Label Our view.','')
s(353,VC,'','','Keep "Nov. 3, 2026". Remove "Two hundred eighty-two endorsements" unless DSA\u2019s own endorsement list is linked. Rest Our view.','')
for i in (354,355,356,357): s(i,OP,'','','Label Our view.','')
# who-got-paid
s(228,CV,'','','Remove the "DHS estimate cited by House Homeland" (committee page is political; the DHS document itself is not linked).','')
s(229,VC,'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters','government_data (CBP)','Link CBP data for the UAC and southwest encounter totals with an as-of date; remove "about 2 million known gotaways" unless a CBP/DHS record is linked. Label "Somebody collected on every one" Our view.','Figures not re-pulled from CBP in this pass.')
D['229']['Verdict']=CV; D['229']['Fix_Needed']='Remove 546,255 / 8.72 million / 2 million unless the CBP data pages are linked with as-of dates (not re-pulled in this pass).'
s(230,VC,'','','Remove "65,000 child-welfare reports sat in a drawer" (no primary record). Add that FY2021 began Oct. 2020 under Trump. Rest Our view.','')
# why-he-became-the-enemy
s(327,OP,'','','Label Our view.',''); s(328,CV,'','','Remove the MRC 92% figure.',THINK)
s(329,CV,'','','Remove the Venezuela "biggest oil deal" paragraph unless a White House transcript is linked, and then only as "he said".','Al Jazeera is the only source.')
s(330,VC,'https://www.eia.gov/outlooks/steo/','government_data (EIA)','Update: "EIA\u2019s September 2026 STEO: U.S. crude output 13.83 million b/d in 2026, a record (13.66 in 2025), about 18.5% of world output while Middle East output is shut in."','STEO Sept 2026 Table 3d: US 13.83; world 74.78.')
s(331,VC,'https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics','government_data (CBP)','Say "Southwest Border Patrol apprehensions in FY2025 were the lowest since 1970 (237,538)." Label the rest Our view.','')
s(332,V,'https://www.congress.gov/bill/119th-congress/senate-bill/5','official_record','','P.L. 119-1, signed Jan. 29, 2025.')
s(333,V,'https://www.supremecourt.gov/about/biographies.aspx','official_record','','Gorsuch (2017), Kavanaugh (2018), Barrett (2020).')
s(334,V,'https://www.war.gov/News/Releases/Release/Article/2049534/statement-by-the-department-of-defense/','official_record (DoD)','Label "paid a price the prior decade did not collect" Our view.','Strike Jan. 3, 2020 (Baghdad local time).')
s(335,OP,'','','Label Our view.','')
# why-the-lobby-should-be-illegal
s(326,VC,'https://www.law.cornell.edu/uscode/text/2/1601','statute','Keep the LDA (1995) and petition-clause facts; label the argument Our view.','')
# ledger essays
s(392,VC,NT,'court_filing','Keep the docket facts; label "the caption flipped" Our view.','')
s(393,VC,NT,'court_filing','Quote the Mar. 31, 2026 memorandum opinion directly; the docket confirms the opinion exists but its text was not opened.','')
s(394,V,NT,'court_filing','','Complaint Dec. 12, 2025 (Doc. 1); Judge Leon memorandum opinion Mar. 31, 2026; cross appeals Apr. 2026.')
s(395,VC,'','','Link Schumer\u2019s May 11, 2026 post as where the words were made; label "The omission is the lie" Our view.','')
D['395']['Verdict']=OP
s(396,OP,'','','Editorial note; label Our view.',''); s(397,OP,'','','Label Our view.','')
s(398,VC,'https://www.justice.gov/usao-sdny/pr/ghislaine-maxwell-sentenced-20-years-prison-conspiring-jeffrey-epstein-sexually-abuse','official_record (DOJ)','Keep: 2008 Florida guilty plea; 2019 SDNY indictment; Maxwell sentenced to 20 years (June 28, 2022). Label the rest Our view.','')
s(399,V,BRAND,'court_opinion','','Schenck v. United States, 249 U.S. 47 (1919); Brandenburg (1969).')
s(400,VC,'https://cha.house.gov/','official_record (House committee)','Keep the Nov. 2023 release facts attributed to the Speaker/committee; replace the Rumble link with the committee\u2019s own page.','')
s(401,VC,'','','Keep quotes only with a primary link each (tape/transcript/his own post as where said).','')
s(403,OP,'','','Label Our view.','')
s(404,VC,'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1151/vote_115_1_00179.htm','official_record','Keep facts (repeal failed 49\u201351 on July 28, 2017; 34 counts). "The taxes were not released": note the House Ways and Means Committee released six years of returns in Dec. 2022. Label the last sentence Our view.','')
s(219,VC,RL30064,'official_record (CRS)','Fix: "A member of Congress makes $174,000 a year." Speaker $223,500 and leaders $193,400 are correct.','Re-check 2026-09-24: CRS RL30064 says $174,000 for most members (frozen since 2009). $174,500 is wrong; earlier Verified verdict reversed.')
json.dump(D,open('/workspace/checkpoint-review/fv/verdicts_essays.json','w'),indent=1)
import csv
R=list(csv.DictReader(open('/workspace/checkpoint-review/backup-pre-fullverify/verified-items.csv')))
miss=[r['Item_No'] for r in R if r['Category']=='essay_fact' and r['Verdict']=='Unverified' and r['Item_No'] not in D]
print(len(D),'missing',miss)
