import csv
def U(t,s): return f"https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title{t}-section{s}&num=0&edition=prelim"
CON={'I5':'https://constitution.congress.gov/browse/article-1/section-5/','I6':'https://constitution.congress.gov/browse/article-1/section-6/',
'I9':'https://constitution.congress.gov/browse/article-1/section-9/','II1':'https://constitution.congress.gov/browse/article-2/section-1/',
'II2':'https://constitution.congress.gov/browse/article-2/section-2/','V':'https://constitution.congress.gov/browse/article-5/',
'A1':'https://constitution.congress.gov/browse/amendment-1/','A14':'https://constitution.congress.gov/browse/amendment-14/','II':'https://constitution.congress.gov/browse/article-2/'}
STOCK='https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf'
TCJA='https://www.congress.gov/115/plaws/publ97/PLAW-115publ97.pdf'
OBBBA='https://www.congress.gov/bill/119th-congress/house-bill/1'
FA="First Amendment: media and political speech is protected; defamation is state tort law (NYT v. Sullivan actual-malice standard for public figures). No statute implicated by the claim itself."
R=[]
def add(scope,where,topic,cite,url,note,fa=''):
    R.append([scope,where,topic,cite,url,note,fa])
# ---- site sections
s='site_section'
add(s,'congress.html','Discipline/expulsion of members','U.S. Const. art. I, sec. 5, cl. 2',CON['I5'],'Each House may punish members for disorderly behavior and expel with two-thirds; this is the House/Senate internal remedy, separate from criminal law.')
add(s,'congress.html','Legislative immunity','U.S. Const. art. I, sec. 6, cl. 1 (Speech or Debate)',CON['I6'],'Protects legislative acts (floor speech, committee work) from being questioned elsewhere; does not cover bribery or purely political/campaign acts (U.S. v. Brewster).')
add(s,'congress.html','Power of the purse','U.S. Const. art. I, sec. 9, cl. 7 (Appropriations Clause)',CON['I9'],'No money drawn from the Treasury but by appropriation made by law; budget proposals are not spending law.')
add(s,'congress.html','Public debt limit','31 U.S.C. 3101',U(31,3101),'Statutory limit on federal debt; debt figures on the page relate to this ceiling.')
add(s,'congress.html','Member periodic transaction reports','5 U.S.C. 13105(l); STOCK Act, Pub. L. 112-105',U(5,13105),'Transactions over $1,000 must be reported within 30 days of notice and no later than 45 days after the transaction; late filing carries a $200 late-filing fee (5 U.S.C. 13106), not a criminal charge.')
add(s,'congress.html','Financial disclosure: who files / penalties','5 U.S.C. 13103; 5 U.S.C. 13106',U(5,13106),'Civil penalty for knowing and willful failure to file or false reporting; referral via Attorney General.')
add(s,'congress.html','Insider trading by members (charged cases)','15 U.S.C. 78j(b); 18 U.S.C. 371',U(15,'78j'),'Securities-fraud statute used in the Buyer conviction; Collins pleaded to conspiracy (18 U.S.C. 371) and false statements (18 U.S.C. 1001). STOCK Act sec. 4 confirms members owe a duty for insider-trading purposes.')
add(s,'congress.html','Campaign finance','52 U.S.C. 30101 et seq. (FECA); 52 U.S.C. 30114 (personal use)',U(52,30114),'Federal campaign finance law; FEC civil enforcement, DOJ criminal for knowing and willful violations.')
add(s,'congress.html','Bribery of public officials','18 U.S.C. 201',U(18,201),'Applies to members and staff; requires quid pro quo for an official act (McDonnell v. U.S. narrowed "official act").')
add(s,'congress.html','False statements to Congress / in filings','18 U.S.C. 1001',U(18,1001),'Knowingly false material statements in matters within the legislative branch (limited to administrative matters and investigations per 1001(c)).')
s2='site_section'
add(s2,'border.html','Improper entry','8 U.S.C. 1325',U(8,1325),'Misdemeanor for first improper entry; basis of many Title 8 apprehensions.')
add(s2,'border.html','Illegal reentry','8 U.S.C. 1326',U(8,1326),'Felony reentry after removal.')
add(s2,'border.html','Presidential entry suspension','8 U.S.C. 1182(f)',U(8,1182),'Authority upheld in Trump v. Hawaii (2018); also 1182(d)(5) parole authority.')
add(s2,'border.html','Expedited removal / inspection','8 U.S.C. 1225',U(8,1225),'Inspection of applicants for admission and expedited removal; credible-fear screening.')
add(s2,'border.html','Asylum','8 U.S.C. 1158',U(8,1158),'Any alien physically present or arriving may apply, subject to bars.')
add(s2,'border.html','Unaccompanied children','8 U.S.C. 1232',U(8,1232),'TVPRA custody/transfer rules for unaccompanied alien children (HHS custody within 72 hours).')
add(s2,'border.html','Title 42 expulsions (Mar 2020-May 2023)','42 U.S.C. 265',U(42,265),'Public-health authority used for expulsions; ended with the public health emergency May 11, 2023.')
s3='site_section'
add(s3,'lawfare.html','U.S. v. Trump (classified documents)','18 U.S.C. 793(e); 18 U.S.C. 1512(k); 18 U.S.C. 1519',U(18,793),'Charged counts (willful retention of national defense information; obstruction); case dismissed July 15, 2024 (Appointments Clause ruling); appeal later dropped.')
add(s3,'lawfare.html','Presidential records','44 U.S.C. 2201-2209 (Presidential Records Act)',U(44,2203),'Governs custody of presidential records; relevant background to the documents case; PRA itself has no criminal penalty.')
add(s3,'lawfare.html','U.S. v. Trump (D.D.C., Jan. 6)','18 U.S.C. 371; 18 U.S.C. 1512(c)(2), (k); 18 U.S.C. 241',U(18,241),'Four charged counts; case dismissed Nov 2024 after the election per DOJ policy; no verdict.')
add(s3,'lawfare.html','Fischer v. United States','18 U.S.C. 1512(c)(2)',U(18,1512),'Supreme Court (2024) limited 1512(c)(2) to impairing availability/integrity of records/documents/objects used in an official proceeding.')
add(s3,'lawfare.html','People v. Trump (Manhattan)','N.Y. Penal Law 175.10 (state); 52 U.S.C. 30116, 30118 cited as "unlawful means"',U(52,30116),'Conviction was under state law; federal FECA provisions were among the "unlawful means" theories under N.Y. Election Law 17-152. No federal charge was brought.')
add(s3,'lawfare.html','People v. Trump removal attempt','28 U.S.C. 1442',U(28,1442),'Federal-officer removal statute; removal of the Manhattan case was sought and litigated in federal court (denied in 2023).')
add(s3,'lawfare.html','Trump v. Anderson','U.S. Const. amend. XIV, sec. 3',CON['A14'],'Supreme Court (2024): states cannot enforce Section 3 against federal candidates; Congress enforces under Section 5.')
add(s3,'lawfare.html','Carroll v. Trump (Carroll I)','28 U.S.C. 2679 (Westfall Act)',U(28,2679),'DOJ initially sought to substitute the United States as defendant; in 2023 DOJ declined to continue certification, so no substitution occurred. Underlying claims are state-law defamation/battery.')
add(s3,'lawfare.html','Trump v. United States (immunity)','U.S. Const. art. II',CON['II'],'Absolute immunity for core constitutional acts, presumptive immunity for other official acts, none for unofficial acts (2024). Not a statute.')
s4='site_section'
add(s4,'january-6.html','Restricted building or grounds','18 U.S.C. 1752',U(18,1752),'Most common Jan. 6 charge, with 40 U.S.C. 5104(e).')
add(s4,'january-6.html','Capitol grounds offenses','40 U.S.C. 5104(e)',U(40,5104),'Misdemeanor parading/demonstrating/disorderly conduct in Capitol buildings.')
add(s4,'january-6.html','Assaulting officers','18 U.S.C. 111',U(18,111),'Charged against defendants who assaulted police on Jan. 6.')
add(s4,'january-6.html','Seditious conspiracy','18 U.S.C. 2384',U(18,2384),'Charged and convicted for some Oath Keepers and Proud Boys leaders; clemency (commutations/pardons) granted Jan 20, 2025.')
add(s4,'january-6.html','Insurrection (not charged)','18 U.S.C. 2383',U(18,2383),'Page records that no Jan. 6 defendant was charged under this section; do not describe any defendant as convicted of insurrection.')
add(s4,'january-6.html','Civil disorder','18 U.S.C. 231(a)(3)',U(18,231),'Obstructing officers during a civil disorder; frequently charged.')
add(s4,'january-6.html','Clemency','U.S. Const. art. II, sec. 2, cl. 1',CON['II2'],'Pardon power used Jan 20, 2025 for Jan. 6 defendants.')
s5='site_section'
add(s5,'remedy.html','Constitutional amendment process','U.S. Const. art. V',CON['V'],'Two-thirds of both Houses or convention; three-fourths of states ratify.')
add(s5,'remedy.html','Discipline and expulsion','U.S. Const. art. I, sec. 5',CON['I5'],'Internal congressional remedy.')
add(s5,'remedy.html','Insurrection statute','18 U.S.C. 2383',U(18,2383),'Discussed against the charging record (not charged).')
s6='site_section'
add(s6,'fake-news.html','Media claims catalog (252 cases)','U.S. Const. amend. I',CON['A1'],'Press and political speech is protected; errors in reporting generally implicate no federal statute. Defamation is state tort law.',FA)
add(s6,'fake-news.html','Platform liability','47 U.S.C. 230',U(47,230),'Online platforms are generally not treated as publisher of third-party content; relevant to social-media items only.')
add(s6,'fake-news.html','Broadcast licensing (context only)','47 U.S.C. 309(a)',U(47,309),'FCC licenses broadcasters under a public-interest standard; the FCC news-distortion policy applies only to broadcast licensees and is not a statute. Not applicable to cable, print or online outlets.')
s7='site_section'
add(s7,'trump-watch.html','President\'s public financial disclosure (OGE 278e)','5 U.S.C. 13103; 5 U.S.C. 13104',U(5,13104),'Requires annual disclosure of income, assets and liabilities in value ranges; figures reported on the form.')
add(s7,'trump-watch.html','Conflict-of-interest statute exemption','18 U.S.C. 208; 18 U.S.C. 202(c)',U(18,202),'18 U.S.C. 208 does not apply to the President or Vice President (202(c) excludes them from the definition used). Overlaps are not statutory violations on that basis.')
add(s7,'trump-watch.html','Emoluments','U.S. Const. art. I, sec. 9, cl. 8; art. II, sec. 1, cl. 7',CON['I9'],'Foreign and domestic emoluments clauses; prior suits dismissed as moot in 2021 with no merits ruling.')
add(s7,'trump-watch.html','Clemency list','U.S. Const. art. II, sec. 2, cl. 1',CON['II2'],'Pardon power is plenary for federal offenses; no statute governs grants.')
s8='site_section'
add(s8,'record-2020.html','George Floyd: federal civil-rights convictions','18 U.S.C. 242',U(18,242),'Deprivation of rights under color of law; basis of the federal Chauvin plea and the other officers\' convictions.')
add(s8,'record-2020.html','2020 unrest: federal arson prosecutions','18 U.S.C. 844(f), (i)',U(18,844),'Arson of federal property / property used in interstate commerce; DOJ cited ~80 arson or explosives cases.')
add(s8,'record-2020.html','Riot statute','18 U.S.C. 2101',U(18,2101),'Federal Anti-Riot Act; an available federal charge for 2020 unrest (check individual DOJ releases for which defendants were charged under it).')
add(s8,'record-2020.html','Insurrection Act (not invoked in 2020)','10 U.S.C. 251-255',U(10,252),'Authority to use armed forces domestically; the National Guard in Minneapolis operated under state authority.')
s9='site_section'
add(s9,'movement-watch.html','Threats against successors to the presidency','18 U.S.C. 871',U(18,871),'Cited on the page for a charged case.')
add(s9,'movement-watch.html','Attempted assassination of the President','18 U.S.C. 1751',U(18,1751),'Cited on the page for a charged case.')
add(s9,'movement-watch.html','Speech by commentators/organizations','U.S. Const. amend. I',CON['A1'],'Political speech, however heated, is protected unless it meets incitement (Brandenburg) or true-threat (Counterman v. Colorado) standards.',FA)
# ---- accountability files
a='accountability_file'
add(a,'omar.md','Naturalization fraud (alleged; no charge)','18 U.S.C. 1425',U(18,1425),'Would apply only to naturalization procured unlawfully; Omar naturalized in 2000, before the 2009 marriage. No charge or finding.')
add(a,'omar.md','Civil denaturalization','8 U.S.C. 1451',U(8,1451),'Revocation requires a court proceeding; no case filed.')
add(a,'omar.md','Immigration document/marriage fraud (alleged; no charge)','18 U.S.C. 1546; 8 U.S.C. 1325(c)',U(18,1546),'Marriage fraud statute 8 U.S.C. 1325(c) and document fraud 18 U.S.C. 1546; no charge or finding.')
add(a,'omar.md','False statements','18 U.S.C. 1001',U(18,1001),'Applies to knowingly false statements to federal agencies; no charge.')
add(a,'omar.md','Tax filing status (reported, CFB context)','26 U.S.C. 7206',U(26,7206),'False return statute; no IRS or DOJ finding exists regarding 2014-2015 joint returns.')
add(a,'minnesota-fraud.md','Feeding Our Future / HSS / EIDBI charges','18 U.S.C. 1343; 18 U.S.C. 1349',U(18,1343),'Wire fraud and conspiracy: primary charges in the Minnesota cases.')
add(a,'minnesota-fraud.md','Money laundering','18 U.S.C. 1956',U(18,1956),'Charged in Feeding Our Future cases including international transfers.')
add(a,'minnesota-fraud.md','Federal program bribery','18 U.S.C. 666',U(18,666),'Charged in some FOF cases (kickbacks).')
add(a,'minnesota-fraud.md','Material support to FTO (not charged)','18 U.S.C. 2339B',U(18,2339),'No Minnesota fraud defendant charged under this section; al-Shabaab funding remains Unresolved.')
add(a,'minnesota-fraud.md','Geographic Targeting Order','31 U.S.C. 5326',U(31,5326),'FinCEN authority for the Hennepin/Ramsey County money-transfer GTO.')
add(a,'trading.md','Periodic transaction reports','5 U.S.C. 13105(l); Pub. L. 112-105 (STOCK Act)',STOCK,'45-day reporting deadline; late filing is a disclosure violation, not insider trading.')
add(a,'fraud-tally.md','Improper payments reporting','31 U.S.C. 3351-3358 (PIIA)',U(31,3352),'Requires agencies to estimate improper payments; improper is not the same as fraudulent.')
add(a,'fraud-tally.md','False Claims Act','31 U.S.C. 3729-3733',U(31,3729),'Civil recoveries for fraud on the government; qui tam under 3730.')
add(a,'covid-border.md','National emergency','50 U.S.C. 1601 et seq. (National Emergencies Act)',U(50,1621),'Proclamation 9994 declared under NEA; terminated by Pub. L. 118-3.')
add(a,'covid-border.md','Public health emergency','42 U.S.C. 247d',U(42,'247d'),'HHS Secretary PHE declaration authority (Jan 31, 2020 - May 11, 2023).')
add(a,'covid-border.md','Title 42','42 U.S.C. 265',U(42,265),'Basis for border expulsions.')
# ---- catalog items (only where a statute genuinely relates)
c='catalog_item'
C=[
('F8','Flynn plea','18 U.S.C. 1001',U(18,1001),'Flynn pleaded guilty to false statements to the FBI (2017); DOJ later moved to dismiss; pardoned Nov 2020. The claim concerns testimony content, not the statute.'),
('F63','Flynn dismissal','18 U.S.C. 1001',U(18,1001),'Underlying charge was 1001; dismissal motion was under Fed. R. Crim. P. 48(a) (a rule, not a statute).'),
('F9','Cohen lies to Congress','18 U.S.C. 1001',U(18,1001),'Cohen pleaded guilty (S.D.N.Y., Nov 2018) to false statements to Congress; Special Counsel disputed the BuzzFeed report that Trump directed it.'),
('F10','Steele dossier / FISA','50 U.S.C. 1805',U(50,1805),'FISA orders on Carter Page; DOJ IG (Dec 2019) found 17 significant errors/omissions; FISA court later found two of four warrants not valid.'),
('F26','FBI process failures','50 U.S.C. 1805; 18 U.S.C. 1001',U(50,1805),'IG found significant FISA failures; FBI lawyer Clinesmith pleaded guilty to 18 U.S.C. 1001 (2020) for altering an email.'),
('F85','Horowitz "no bias" framing','50 U.S.C. 1805',U(50,1805),'IG found no documentary evidence of bias in opening the probe, but serious FISA process failures.'),
('F171','Manafort FISA wiretap','50 U.S.C. 1805',U(50,1805),'Claim concerns FISA surveillance authority; statute governs issuance of electronic surveillance orders.'),
('F49','Cohen "wiretap"','18 U.S.C. 3121-3127 (pen register); 18 U.S.C. 2518 (wiretap)',U(18,3121),'Correction: investigators used a pen register (records numbers, not content), a different legal authority from a Title III wiretap.'),
('F11','Collusion "more than circumstantial"','18 U.S.C. 371',U(18,371),'Special Counsel did not establish a conspiracy (371) between the campaign and the Russian government.'),
('F82','"Undoubtedly collusion"','18 U.S.C. 371',U(18,371),'"Collusion" is not a legal term; Special Counsel analyzed conspiracy and did not establish it.'),
('F25','Mueller "exonerated" / proved collusion','18 U.S.C. 1512; 18 U.S.C. 371',U(18,1512),'Report did not establish conspiracy; on obstruction it neither concluded a crime nor exonerated.'),
('F35','Mueller "would have indicted"','18 U.S.C. 1512',U(18,1512),'Mueller testified he did not reach a determination on whether a crime was committed (OLC policy); obstruction statutes were analyzed.'),
('F243','Russian lawyer meeting "donation"','52 U.S.C. 30121',U(52,30121),'Foreign-national contribution ban; Special Counsel analyzed the June 2016 meeting under this section and declined charges.'),
('F86','Sicknick death','18 U.S.C. 111',U(18,111),'D.C. Chief Medical Examiner found natural causes (strokes); Julian Khater pleaded guilty to assaulting officers with a dangerous weapon (chemical spray) under 18 U.S.C. 111; co-defendant Tanios pleaded to misdemeanors.'),
('F33','Supreme Court "ratified" Muslim shutdown','8 U.S.C. 1182(f)',U(8,1182),'Trump v. Hawaii upheld Proclamation 9645 under 1182(f); the proclamation covered nationals of listed countries, not all Muslims.'),
('F52','"Banned Muslims"','8 U.S.C. 1182(f)',U(8,1182),'Entry restrictions applied by nationality under 1182(f); not a religion-based ban on its face.'),
('L222','"Issued a Muslim ban"','8 U.S.C. 1182(f)',U(8,1182),'Same as F52.'),
('F109','Troops\' children citizenship','8 U.S.C. 1433; 8 U.S.C. 1401',U(8,1433),'USCIS policy concerned 1433 naturalization for children residing abroad; citizenship at birth under 1401 was unaffected.'),
('F229','International Entrepreneur Rule','8 U.S.C. 1182(d)(5)',U(8,1182),'Rule is an exercise of parole authority; claim concerned whether the rule was ended.'),
('F104','Military pensions for wall','10 U.S.C. 2808; 10 U.S.C. 284',U(10,2808),'Wall funds were drawn under military-construction and counterdrug authorities, not from pensions.'),
('F168','Bump stocks','26 U.S.C. 5845(b)',U(26,5845),'ATF 2018 rule classified bump stocks as machineguns under 5845(b); Supreme Court struck the rule in Garland v. Cargill (2024).'),
('F46','$845B Medicare "cut"','31 U.S.C. 1105',U(31,1105),'The President\'s budget is a proposal submitted under 1105; spending changes require legislation.'),
('F207','$845B Medicare cut','31 U.S.C. 1105',U(31,1105),'Same as F46.'),
('F91','CDC funding "cut"','31 U.S.C. 1105; U.S. Const. art. I, sec. 9, cl. 7',U(31,1105),'Proposed cuts were not enacted unless appropriated by Congress.'),
('L125','Budget cut SS/Medicare every year','31 U.S.C. 1105',U(31,1105),'Budget proposals are not law.'),
('L126','Trump "tried to cut" SS/Medicare in budgets','31 U.S.C. 1105',U(31,1105),'Budget proposals are not law.'),
('F113','Executive action on Social Security funding','26 U.S.C. 7508A',U(26,7508),'Aug 2020 payroll-tax deferral memorandum relied on 7508A; benefits are set by 42 U.S.C. 415 and unchanged by executive action.'),
('L44','Trump plans to cut Social Security benefits','42 U.S.C. 415',U(42,415),'Benefit computation is set by statute; changes require Congress.'),
('L98','SSA changes cutting benefits','42 U.S.C. 415',U(42,415),'Benefit levels set by statute; staffing changes do not alter the formula.'),
('L131','Drug price caps reversed','42 U.S.C. 1320f et seq.',U(42,'1320f'),'Medicare Drug Price Negotiation Program is statutory (Inflation Reduction Act); reversal would require legislation.'),
('F174','Preexisting conditions','42 U.S.C. 300gg-3',U(42,'300gg-3'),'ACA bar on preexisting-condition exclusions; the claim concerned proposed repeal.'),
('F194','$1.3T corporate tax break','26 U.S.C. 11(b); Pub. L. 115-97',U(26,11),'TCJA set the corporate rate at 21%.'),
('F195','Mandate repeal "boots" 13M','26 U.S.C. 5000A',U(26,'5000A'),'TCJA reduced the shared-responsibility payment to $0 from 2019; CBO projected coverage declines largely from people choosing not to buy.'),
('F196','Mandate repeal "takes" coverage','26 U.S.C. 5000A',U(26,'5000A'),'Same as F195.'),
('F197','Mandate repeal "knocks off" 13M','26 U.S.C. 5000A',U(26,'5000A'),'Same as F195.'),
('F198','Mandate repeal "sabotages" 13M','26 U.S.C. 5000A',U(26,'5000A'),'Same as F195.'),
('L214','83% to top 1% (no sunset caveat)','Pub. L. 115-97',TCJA,'Individual provisions of the TCJA expired after 2025 unless extended; distribution estimates depend on year.'),
('L220','83% to top 1% (Jeffries)','Pub. L. 115-97',TCJA,'Same as L214.'),
('L209','13.7M lose coverage (House bill)','Pub. L. 119-21 (enacted as the One Big Beautiful Bill Act)',OBBBA,'CBO coverage projections are estimates over a 10-year window, not immediate removals.'),
('L210','13.7M off coverage per CBO','Pub. L. 119-21',OBBBA,'Same as L209.'),
('L211','13.7M "uninsurable"','Pub. L. 119-21; 42 U.S.C. 300gg-3',OBBBA,'Law did not repeal the ACA preexisting-condition protections.'),
('L212','14M "ripped off" insurance','Pub. L. 119-21',OBBBA,'Same as L209.'),
('L100','15M "already thrown off"','Pub. L. 119-21',OBBBA,'Major Medicaid provisions (e.g., work requirements) have delayed effective dates; projections are not realized removals.'),
('L185','Overtime cut','29 U.S.C. 213(a)(1)',U(29,213),'Salary threshold for the FLSA white-collar exemption is set by DOL rule under 213(a)(1).'),
('L127','SCOTUS "immune from prosecution"','U.S. Const. art. II',CON['II'],'Trump v. United States: immunity for official acts only; none for unofficial acts. Not a statute.'),
('L134','Ending dual citizenship under Espionage Act','8 U.S.C. 1451; 18 U.S.C. 793',U(8,1451),'Denaturalization requires a court proceeding under 1451; the Espionage Act does not govern citizenship.'),
('L97','Deporting U.S. citizens','8 U.S.C. 1227',U(8,1227),'Removal grounds apply to aliens only; citizens cannot be removed under Title 8.'),
('L150','DOGE sent members to IRS for audit','26 U.S.C. 7217; 26 U.S.C. 6103',U(26,7217),'Executive-branch requests for specific audits are prohibited under 7217; no record found of any such referral.'),
('L154','Child support payer claims children','26 U.S.C. 152(e)',U(26,152),'Dependency rules for divorced/separated parents are in 152(e); no such law was enacted.'),
('L156','EO ending food stamps','7 U.S.C. 2011 et seq.',U(7,2011),'SNAP is authorized by statute; an executive order cannot end it.'),
('L157','EO public-housing two-year deadline','42 U.S.C. 1437 et seq.',U(42,1437),'Public housing is governed by statute and HUD rules; no such order found.'),
('L122','Schumer notified after Iran strikes','50 U.S.C. 1543',U(50,1543),'War Powers Resolution requires a report to Congress within 48 hours; advance notice to leaders is customary, not required by this section.'),
('L213','FEMA NC request denied','42 U.S.C. 5121 et seq. (Stafford Act)',U(42,5121),'Request concerned extension of federal cost share; underlying disaster assistance continued.'),
('F36','Schiff dramatized call','U.S. Const. art. I, sec. 6 (Speech or Debate)',CON['I6'],'Remarks at a committee hearing are legislative acts protected from questioning elsewhere; each House may discipline its own members under art. I, sec. 5.'),
('L252','Judge "ordered Trump" to restore press access','U.S. Const. amend. I',CON['A1'],'Press-access litigation is decided under the First Amendment; no statute governs White House press pools.',FA),
('L253','AP barred from White House','U.S. Const. amend. I',CON['A1'],'AP v. Budowich litigated under the First Amendment (viewpoint discrimination); no statute.',FA),
]
for x in C:
    add(c,*x) if len(x)==6 else add(c,x[0],x[1],x[2],x[3],x[4])
hdr=['scope','page_or_item','topic','citation','link','relevance_note','first_amendment_context']
with open('uscode-map.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(hdr); w.writerows(R)
print(len(R), 'rows;', len([r for r in R if r[0]=='catalog_item']),'catalog items')
