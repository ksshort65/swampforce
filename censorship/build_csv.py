import csv, json, sys
sys.path.insert(0,'.')
from build_sources import S, TW
V=json.load(open('verify_results.json'))
def U(k):
    if k in S: return S[k][0]
    u,i,_=TW[k]; return f"https://twitter.com/{u}/status/{i}"
def ver(k):
    code=V.get(k,'')
    if k in TW: return f"Post verified via X/Twitter syndication endpoint; author and timestamp match ({code.split(' ',1)[1]} UTC)" if code.startswith('tweet-ok') else 'unverified'
    m=S[k][4]
    if k=='hhs_kulldorff': return "curl 403 on re-check (earlier 200); content retrieved via WebFetch 2026-09-24"
    if m=='tweet': return 'Post verified via X/Twitter syndication endpoint (author/date match); twitter.com URL returns HTTP 200'
    if m=='curl': return f"HTTP {code} via curl 2026-09-24"
    if m=='webfetch': return f"curl {code} (host blocks automated fetch); full content retrieved via WebFetch 2026-09-24"
    if m=='search': return f"curl {code} (host blocks automated fetch); page existence confirmed via web search 2026-09-24; not content-verified by fetch"
    if m=='reported': return f"curl {code}; NEWS LEAD ONLY - reported, not confirmed by primary record"
    return code

# ---------- sources.csv ----------
with open('sources.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['source_key','url','title','source_type','date','primary_record','verification'])
    for k,(u,t,ty,d,m) in S.items():
        prim='no (lead only)' if m=='reported' or ty.startswith('News') or ty.startswith('Third-party') else 'yes'
        if k in ('hjc_wh','hjc_cisa'): prim='yes (congressional majority-staff report; its characterizations are the committee majority\'s, not findings of fact by a court)'
        if k=='raskin': prim='yes (minority letter; characterizations are the minority\'s)'
        if k=='wh_lableak': prim='yes (government statement; advocacy framing)'
        w.writerow([k,u,t,ty,d,prim,ver(k)])
    for k,(u,i,desc) in TW.items():
        w.writerow([k,U(k),desc,'Twitter Files post (journalist publishing internal Twitter documents/screenshots; screenshots are the primary record, the narration is the journalist\'s)',V[k].split(' ')[1][:10] if V[k].startswith('tweet-ok') else '','partly (screenshots)',ver(k)])

# ---------- timeline.csv ----------
T=[
('2019-12','FBI obtains Hunter Biden laptop (per court finding).','FBI','doughty_mem','Court record','yes','Doughty ruling pp.62-63 (PDF page = "Page X of 155").'),
('2020-04-16','Facebook publishes COVID-19 misinformation policy page (updated through 2021).','Facebook','fb_covid','Company record','yes',''),
('2020-07-26','Election Integrity Partnership (SIO, UW, DFRLab, Graphika) formed; idea came from SIO-funded student interns at CISA; formed "in consultation with CISA."','Stanford Internet Observatory / EIP','eip','Research org own report','yes','Long Fuse PDF p.20-21 ("Meeting with CISA to present EIP concept" July 9).'),
('2020-10-04','Great Barrington Declaration published (Kulldorff, Gupta, Bhattacharya).','Kulldorff, Bhattacharya, Gupta','gbd','Primary document','yes',''),
('2020-10-08','NIH Director Collins emails Fauci and Lane: "There needs to be a quick and devastating published take down of its premises."','Francis Collins (NIH)','collins','FOIA release','yes','Email asks for a published rebuttal; it does not ask platforms to remove content.'),
('2020-10-14','NY Post laptop story; Facebook sends it to fact-checkers and temporarily demotes it; Twitter blocks sharing of the link (reversed within ~24h per Gadde).','Facebook; Twitter','zletter','Company record / congressional testimony','yes','Also ov_hearing (Gadde, Roth testimony).'),
('2020-10-19','51 former intelligence officials: laptop emails have "all the classic earmarks of a Russian information operation" but "we do not have evidence of Russian involvement."','Former IC officials (private citizens)','ic51','Primary document','yes',''),
('2020-10-22','Candidate Biden cites the letter in debate: "50 former national intelligence folks who said that ... is a Russian plan."','Joe Biden (candidate)','debate1022','Primary transcript','yes',''),
('2020-10-24','Email "More to review from the Biden team" / reply "Handled" (published in Twitter Files #1; date per Feb 8, 2023 hearing record).','Biden campaign (not a government actor in 2020); Twitter','tf1_8','Twitter Files screenshot + congressional record','yes','Date per Rep. Balint in ov_hearing; campaign, not government.'),
('2020-11-05','Trump delivers White House remarks on the election (6:48 p.m. ET). MSNBC, NBC, ABC, CBS cut away or interrupt, citing false claims.','Donald Trump; broadcast networks','dcpd_1105','Official transcript; unedited video','partial','Speech: DCPD-202000836, C-SPAN, WH YouTube. Network cutaways: reported (AP), not confirmed by primary record here.'),
('2020-11-12','Twitter reports ~300,000 election tweets labeled Oct 27-Nov 11.','Twitter','npr_tw300k','News lead','no','Reported, not confirmed by primary record (Twitter blog blocks automated fetch).'),
('2020-12-17','Yoel Roth declaration to FEC on Twitter hack-and-leak briefings (discussed in court).','Twitter (Roth)','doughty_mem','Court record','yes','Doughty pp.62-63.'),
('2021-01-07','Facebook restricts Trump accounts indefinitely.','Facebook','ob_decision','Oversight body decision','yes',''),
('2021-01-08','Twitter permanently suspends @realDonaldTrump "due to the risk of further incitement of violence."','Twitter','tw_suspend_exh','Company record (court exhibit)','yes','Twitter Files #5 shows staff earlier concluded some tweets were not incitement (tf5_12).'),
('2021-01-12','YouTube suspends Trump channel.','YouTube','yt_settle','Court record (later settlement)','partial','Suspension date reported; settlement filing 2025-09-29 is primary.'),
('2021-01-21','Facebook refers Trump suspension to Oversight Board.','Facebook','fb_referral','Company record','yes',''),
('2021-02-06','White House Digital Director Rob Flaherty asks Twitter to remove parody account of Biden granddaughter: "Cannot stress the degree to which this needs to be resolved immediately." Removed within ~45 minutes.','Rob Flaherty (White House)','doughty_mem','Court record','yes','Doughty p.9. SCOTUS fn.4 cited impersonation request as an example the lower courts mischaracterized.'),
('2021-02-08','Facebook expands COVID removals, including claims COVID is man-made.','Facebook','fb_covid','Company record','yes','Flaherty emails Facebook questioning follow-through (hjc_wh p.14).'),
('2021-02-17','Twitter joins Virality Project and receives first weekly report (per TF#19).','Virality Project; Twitter','tf19','Twitter Files thread','partial','Journalist narration of internal documents.'),
('2021-03','Amazon internal email: bookstore policy change "impetus" is "criticism from the Biden Administration."','Amazon','hjc_wh','Congressional majority-staff report quoting subpoenaed documents','yes','hjc_wh p.3.'),
('2021-03-18','DeSantis roundtable with Atlas, Bhattacharya, Kulldorff, Gupta; YouTube removes it in April 2021 citing mask claims.','YouTube','doughty_mem','Court record (plaintiffs\' allegation) + news lead','partial','Doughty p.5 records it as an allegation; YouTube statement reported by NBC.'),
('2021-05-05','Oversight Board upholds Trump restriction but rejects "indeterminate and standardless penalty of indefinite suspension."','Oversight Board','ob_decision','Oversight body decision','yes',''),
('2021-05-14','First CDC "COVID BOLO" meeting with platforms (set up by CDC\'s Carol Crawford from May 10).','CDC','doughty_mem','Court record','yes','Doughty p.47.'),
('2021-05-26','Facebook: "we will no longer remove the claim that COVID-19 is man-made or manufactured."','Facebook','fb_covid','Company record','yes',''),
('2021-06-04','Facebook sets two-year Trump suspension.','Facebook','meta_2yr','Company record','yes',''),
('2021-07-14','Facebook internal email to Nick Clegg on why man-made claims were removed: "Because we were under pressure from the administration and others to do more ... We shouldn\'t have done it."','Facebook staff','hjc_wh','Company document reproduced in congressional report (Ex. 52)','yes','hjc_wh pp.13-14; the bracketed "[Biden]" in the report\'s summary is the committee\'s insertion.'),
('2021-07-15','Surgeon General advisory on health misinformation; joint Psaki/Murthy briefing: "We\'re flagging problematic posts for Facebook." Flaherty to Facebook: "Are you guys fucking serious?"','Vivek Murthy; Jen Psaki; Rob Flaherty','psaki15','Official transcript / court record','yes','Flaherty email: Doughty p.23. Advisory: sg_adv.'),
('2021-07-16','Psaki: "we\'re in regular touch with social media platforms." Biden: "They\'re killing people."','Jen Psaki; Joe Biden','psaki16','Official transcript / video','yes','Video: pbs_killing. Court: Doughty p.24.'),
('2021-07-19','Biden: "Facebook isn\'t killing people; these 12 people who are out there giving misinformation ... It\'s killing people."','Joe Biden','ucsb_0719','Official transcript','yes',''),
('2021-07-20','WH Communications Director Kate Bedingfield raises Section 230 / platform liability.','Kate Bedingfield','doughty_mem','Court record','yes','Doughty p.24.'),
('2021-07-28','FSMB board: physicians spreading COVID vaccine misinformation risk "suspension or revocation of their medical license."','Federation of State Medical Boards','fsmb','Professional body record','yes','Date per FSMB 2022 report.'),
('2021-08','ODNI assessment (info through Aug 2021): IC divided; 4 elements + NIC low-confidence natural; 1 element moderate-confidence lab.','ODNI/NIC','odni2021','Intelligence assessment','yes',''),
('2022-01-11','Maine board suspends Dr. Meryl Nass.','Maine Board of Licensure in Medicine','nass','Agency order (not retrieved)','no','Reported, not confirmed by primary record (order URL returned 403).'),
('2022','Virality Project final report: OSG and CDC ties; six platforms acted on tickets "in accordance with their policies"; 911 tickets.','Virality Project (SIO)','vp','Research org own report','yes','VP pp.11, 17-18, 34.'),
('2022-05-05','Missouri and Louisiana file Missouri v. Biden; individual plaintiffs join later.','State AGs; plaintiffs','doughty_mem','Court record','yes','Doughty p.133.'),
('2022-09-30','California AB 2098 signed (B&P Code §2270: COVID "misinformation" by physicians = unprofessional conduct), effective Jan 1, 2023.','California Legislature / Gov. Newsom','ab2098','Statute','yes',''),
('2022-11-19','Musk: "The people have spoken. Trump will be reinstated."','Elon Musk (Twitter owner)','musk_reinstate','Post','yes','Timestamp 2022-11-20 00:53 UTC.'),
('2022-12-02','Twitter Files #1 published (series runs to #19 on 2023-03-17).','Matt Taibbi et al.','tf1','Twitter Files','yes',''),
('2023-01-25','Høeg v. Newsom: PI against AB 2098 (§2270) on Fourteenth Amendment vagueness grounds. Same day Meta ends Trump suspension.','Judge William Shubb (E.D. Cal.); Meta','hoeg','Court record','yes','Meta: meta_reinstate.'),
('2023-02-08','House Oversight hearing with Baker, Gadde, Roth, Navaroli.','House Oversight Committee','ov_hearing','Congressional record','yes',''),
('2023-02-28','FBI Director Wray: FBI assesses origin "most likely a potential lab incident."','Christopher Wray','wray_rep','TV interview (lead)','no','Official\'s own words on Fox News; reported, not confirmed by FBI document.'),
('2023-03-09','Weaponization Subcommittee hearing with Taibbi and Shellenberger.','House Judiciary Weaponization Subcommittee','wz_hearing','Congressional record','yes',''),
('2023-06-26','House Judiciary majority-staff report "The Weaponization of CISA."','House Judiciary majority','hjc_cisa','Congressional majority-staff report','yes',''),
('2023-07-04','Judge Doughty grants preliminary injunction in part (Missouri v. Biden).','Judge Terry Doughty (W.D. La.)','doughty_mem','Court record','yes','Injunction: doughty_inj.'),
('2023-09-08','Fifth Circuit: White House & Surgeon General likely coerced and significantly encouraged; FBI likely coerced/encouraged; CDC significantly encouraged. Narrows injunction.','5th Cir.','ca5_sep','Court record','yes','pp.42, 54-58.'),
('2023-09-30','SB 815 signed, repealing §2270 effective Jan 1, 2024.','California Legislature / Gov. Newsom','sb815','Statute','yes',''),
('2023-10-03','Fifth Circuit on rehearing adds CISA ("likely significantly encouraged").','5th Cir.','ca5_oct','Court record','yes','pp.59-61, 74.'),
('2023-10','Supreme Court stays injunction and grants certiorari.','Supreme Court','scotus','Court record','yes','Stay/cert noted in opinion ("601 U.S. ___ (2023)"); exact order date (Oct 20, 2023) from docket, not re-verified here.'),
('2024-01','Washington Medical Commission restricts Dr. Ryan Cole\'s license (public statements and patient-care findings).','Washington Medical Commission','cole','Agency adjudication','yes',''),
('2024-05-01','House Judiciary majority-staff report "The Censorship-Industrial Complex."','House Judiciary majority','hjc_wh','Congressional majority-staff report','yes',''),
('2024-06-26','Murthy v. Missouri: plaintiffs lack standing; merits not reached; 6-3.','Supreme Court','scotus','Court record','yes',''),
('2024-08-26','Zuckerberg letter to Jordan. Fifth Circuit vacates injunction and remands.','Mark Zuckerberg; 5th Cir.','zletter','Company record / court record','yes','ca5_remand.'),
('2024-11-08','Doughty permits jurisdictional discovery on remand.','W.D. La.','doc404','Court record','yes',''),
('2025-01-07','Meta ends U.S. third-party fact-checking, moves to Community Notes.','Meta','meta2025','Company record','yes',''),
('2025-01-10','Zuckerberg on Joe Rogan #2255 describes Biden officials who would "scream at" and "curse" at Meta staff.','Mark Zuckerberg','rogan','Primary video','yes','Timestamps approximate.'),
('2025-01-20','EO 14149 "Restoring Freedom of Speech and Ending Federal Censorship."','President Trump','eo14149','Executive order','yes','EO\'s characterization of prior administration is the executive\'s own, not a court finding.'),
('2025-01-25','CIA: "low confidence" research-related origin more likely.','CIA','cia_rep','News lead','no','Agency statement reported by press; no cia.gov document located.'),
('2025-01-29','Meta agrees to pay ~$25M to settle Trump suspension suit.','Meta','meta_settle_rep','News lead','no','Reported, not confirmed by primary record.'),
('2025-03-25','Senate confirms Jay Bhattacharya as NIH Director, 53-47 (Roll Call #141).','U.S. Senate','senate141','Congressional record','yes',''),
('2025-04','White House launches lab-leak page.','White House','wh_lableak','Government statement','yes',''),
('2025-09-23','Alphabet letter: Biden officials "pressed" it on COVID content "that did not violate its policies"; offers reinstatement to terminated creators.','Alphabet/YouTube','alphabet','Company record','yes',''),
('2025-09-29','YouTube settles Trump suit for $24.5M; dismissal with prejudice.','YouTube/Alphabet','yt_settle','Court record','yes',''),
('2025-10-30','Raskin letter: 20 Alphabet employees testified to no coercion.','Rep. Jamie Raskin (minority)','raskin','Congressional letter (minority)','yes',''),
('2025-12-01','Kulldorff named chief science officer, HHS ASPE (previously chaired ACIP).','HHS','hhs_kulldorff','Government statement','yes',''),
('2026-03-25','Consent decree "SO ORDERED" by Judge Doughty: 10 years; binds Surgeon General, CDC, CISA; limited to plaintiffs\' content on 5 platforms; no admission of liability (¶17).','W.D. La.; DOJ; plaintiffs','consent','Court record','yes','doj_pr, ncla_pr.'),
]
with open('timeline.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['date','event','actor','primary_source_url','source_type','confirmed_by_primary_record','notes'])
    for d,e,a,k,ty,c,n in T: w.writerow([d,e,a,U(k),ty,c,n])

# ---------- people.csv ----------
P=[
('Rob Flaherty','White House Director of Digital Strategy (2021-22)','Pressed platforms on specific content and policies. Feb 6, 2021 email re granddaughter parody account ("Cannot stress the degree..."); Jul 15, 2021 email to Facebook ("Are you guys fucking serious? I want an answer on what happened here and I want it today").','doughty_mem','Court record (district findings pp.9, 23)','Preliminary findings; 5th Cir. found White House likely coerced/significantly encouraged; vacated on standing; SCOTUS fn.4 called many district findings "clearly erroneous." Not a final merits finding.'),
('Andy Slavitt','White House Senior Advisor, COVID response (2021)','Copied on Meta emails May-July 2021 about "expanded penalties" for COVID content; party to White House pressure described in the record.','doughty_mem','Court record (p.12)','Same status as above.'),
('Jen Psaki','White House Press Secretary','Jul 15, 2021: "We\'re flagging problematic posts for Facebook that spread disinformation." Jul 16: "we\'re in regular touch with social media platforms ... You all make decisions, just like the social media platforms make decisions."','psaki15','Official transcripts','Documented (own words).'),
('Vivek Murthy','U.S. Surgeon General','Jul 15, 2021 advisory urging platforms to "Prioritize early detection of misinformation \'super-spreaders\' and repeat offenders. Impose clear consequences for accounts that repeatedly violate platform policies." Surgeon General\'s office likely coerced/significantly encouraged per 5th Cir. (vacated). Bound by 2026 consent decree.','sg_adv','Government record; court record','Advisory documented; coercion finding preliminary and vacated.'),
('Joe Biden','President (2021-25); candidate in 2020','Jul 16, 2021: "They\'re killing people." Jul 19: "Facebook isn\'t killing people; these 12 people ... It\'s killing people." Oct 22, 2020 debate cited 51-official letter.','ucsb_0719','Official transcript; video','Documented (own words).'),
('Kate Bedingfield','White House Communications Director','Jul 20, 2021 raised platforms\' Section 230 liability.','doughty_mem','Court record (p.24)','Documented in court record.'),
('Carol Crawford','CDC, Division of Digital Media','Set up "COVID BOLO" meetings with platforms starting May 2021; enjoined by name in July 2023 injunction (vacated).','doughty_mem','Court record (p.47)','CDC found likely to have "significantly encouraged" (5th Cir.); vacated.'),
('Elvis Chan','FBI San Francisco, Assistant Special Agent in Charge','Hosted FBI-platform meetings; raised hack-and-leak concerns; denies urging policy changes but admits asking whether platforms changed hacked-materials policies.','doughty_mem','Court record (pp.62-63)','District court found FBI "significant encouragement" (p.107); FBI denies mentioning Hunter Biden. Roth testified government did not raise Hunter Biden.'),
('Laura Dehmlow','FBI Foreign Influence Task Force section chief','Declined to comment when Facebook asked about the laptop after Oct 14, 2020.','doughty_mem','Court record (pp.62-63)','Documented in court record.'),
('Brian Scully','CISA, Mis/Dis/Malinformation team lead','Described "switchboarding" — forwarding election officials\' flags to platforms, which decided under their own policies; stopped in 2022.','doughty_mem','Court record (p.68)','5th Cir. (Oct 3) found CISA likely significantly encouraged; vacated.'),
('Jen Easterly','CISA Director','Enjoined by name (2023, vacated). Quoted by House majority report on "cognitive infrastructure."','hjc_cisa','Congressional majority-staff report; court record','Report characterizations are the committee majority\'s.'),
('Francis Collins','NIH Director','Oct 8, 2020 email calling for "a quick and devastating published take down" of GBD premises.','collins','FOIA release','Documented. Email seeks a published rebuttal, not platform removal.'),
('Anthony Fauci','NIAID Director','Recipient of Collins email; per district record "does not specifically recall" communicating with platforms. 5th Cir. found NIAID not liable.','doughty_mem','Court record (p.53); ca5_sep pp.59-60','No adverse appellate finding.'),
('Mark Zuckerberg','Meta CEO','Aug 26, 2024 letter: officials "repeatedly pressured our teams for months to censor certain COVID-19 content, including humor and satire"; "it was our decision"; regrets demoting NY Post story after general FBI warning. Jan 2025 Rogan: officials would "scream at them and curse."','zletter','Company record; primary video','Own statements. Rogan claims of "threatening repercussions" not tied to a specific document.'),
('Nick Clegg','Meta President of Global Affairs','Asked staff (Jul 14, 2021) why man-made claims were removed; staff replied "under pressure from the administration and others."','hjc_wh','Company email in congressional report (Ex. 52)','Documented company email.'),
('Joel Kaplan','Meta Chief Global Affairs Officer','Jan 7, 2025 announcement ending third-party fact-checking.','meta2025','Company record','Documented.'),
('Yoel Roth','Twitter Head of Trust & Safety','Testified Twitter "made a mistake" on NY Post; government did not raise Hunter Biden in meetings "to the best of my recollection"; asked to add "stopthesteal"/"kraken" to deamplification lists (TF#4).','ov_hearing','Congressional record; Twitter Files','Sworn testimony.'),
('Vijaya Gadde','Twitter Chief Legal Officer','Testified "Twitter made a mistake" on NY Post and reversed within 24 hours.','ov_hearing','Congressional record','Sworn testimony.'),
('Jim Baker','Twitter Deputy General Counsel (former FBI GC)','Witness at Feb 8, 2023 hearing.','ov_hearing','Congressional record','Testimony.'),
('Anika Collier Navaroli','Former Twitter policy official (minority witness)','Testified the Trump White House asked Twitter to remove a Chrissy Teigen tweet.','ov_hearing','Congressional record','Testimony.'),
('Matt Taibbi','Journalist, Twitter Files','Published TF #1, 3, 6, 9, 11, 14-17, 19; testified Mar 9, 2023; wrote "there\'s no evidence - that I\'ve seen - of any government involvement in the laptop story."','tf1_22','Twitter Files; congressional record','Journalist; internal screenshots are the primary material.'),
('Michael Shellenberger','Journalist, Twitter Files','Published TF #4, #7; testified Mar 9, 2023.','wz_hearing','Twitter Files; congressional record','Journalist.'),
('Bari Weiss','Journalist, Twitter Files','TF #2 (Bhattacharya on "Trends Blacklist"), #5 (staff doubted incitement).','tf2_3','Twitter Files','Journalist; blacklist was Twitter\'s internal action, no government request shown in that thread.'),
('David Zweig','Journalist, Twitter Files','TF #10: "both the Trump and Biden administrations directly pressed Twitter executives"; Kulldorff tweet labeled "Misleading."','tf10_5','Twitter Files','Journalist.'),
('Lee Fang','Journalist, Twitter Files','TF #8: Twitter approved/protected U.S. military influence-operation accounts.','tf8_3','Twitter Files','Journalist.'),
('Jay Bhattacharya','Stanford physician-economist; plaintiff; GBD co-author','Placed on Twitter "Trends Blacklist" (TF#2); alleged removals incl. YouTube roundtable. Confirmed NIH Director Mar 25, 2025, 53-47; withdrew from case on joining government (per NCLA).','senate141','Congressional record; Twitter Files; court record','Confirmation documented.'),
('Martin Kulldorff','Harvard biostatistician; plaintiff; GBD co-author','Tweet labeled "Misleading" by Twitter (TF#10); alleged LinkedIn/YouTube actions. ACIP chair 2025; HHS ASPE chief science officer Dec 1, 2025.','hhs_kulldorff','Government statement; Twitter Files','Documented.'),
('Aaron Kheriaty','Psychiatrist; plaintiff','Alleged shadow-banning and removals (Doughty p.6). Party to 2026 settlement. UC Irvine dismissal over vaccine mandate: reported, not confirmed by primary record here.','doughty_mem','Court record; party statement','Allegations; settlement documented.'),
('Jill Hines','Health Freedom Louisiana; plaintiff','SCOTUS: made "the best showing" of standing but Facebook targeted her before most White House/CDC contacts.','scotus','Court record','Documented.'),
('Terry Doughty','U.S. District Judge, W.D. La.','Jul 4, 2023 PI ruling ("most massive attack against free speech in United States\' history" — conditioned on "If the allegations ... are true"); Mar 25, 2026 consent decree.','doughty_mem','Court record','Findings preliminary; vacated.'),
('Amy Coney Barrett','Supreme Court Justice','Majority opinion: no standing; "lack jurisdiction to reach the merits."','scotus','Court record','Holding.'),
('Samuel Alito','Supreme Court Justice','Dissent (with Thomas, Gorsuch): "blatantly unconstitutional ... If a coercive campaign is carried out with enough sophistication, it may get by."','scotus','Court record (dissent)','Dissent, not holding.'),
('William Shubb','U.S. District Judge, E.D. Cal.','Enjoined AB 2098 as to plaintiffs on vagueness grounds (Jan 25, 2023).','hoeg','Court record','PI; law later repealed.'),
('Renée DiResta / Elena Cryst','Stanford Internet Observatory (Virality Project authors)','VP report: OSG and CDC ties; platforms acted on tickets under their own policies.','vp','Research org own report','Documented.'),
('Alex Stamos','SIO Director','Quoted in TF#19/hearing describing EIP as filling gaps government "couldn\'t do" (video via third party).','wz_hearing','Congressional record (Taibbi testimony)','Characterization via witness; underlying video not verified here.'),
('Jim Jordan','Chairman, House Judiciary / Weaponization Subcommittee','Recipient of Zuckerberg and Alphabet letters; majority reports issued under his committee.','hjc_wh','Congressional records','Documented.'),
('Jamie Raskin','Ranking Member, House Judiciary','Oct 30, 2025 letter: "not a single one of Alphabet\'s employees testified about any coercion."','raskin','Congressional letter (minority)','Minority position.'),
('Elon Musk','Twitter/X owner','Made internal documents available to Twitter Files journalists; reinstated Trump (Nov 2022).','musk_reinstate','Post','Documented.'),
('Donald Trump','President (2017-21, 2025-)','Nov 5, 2020 remarks cut away by networks (reported). Suspended by Twitter, Facebook, YouTube Jan 2021. Signed EO 14149. Trump White House also sent removal requests to Twitter (TF#1, Navaroli).','dcpd_1105','Official transcript; company records','Documented.'),
]
with open('people.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['name','role','action_per_record','source_url','source_type','finding_status'])
    for r in P: w.writerow([r[0],r[1],r[2],U(r[3]),r[4],r[5]])

# ---------- candidates.csv ----------
C=[
('The Supreme Court cleared the Biden administration / found no censorship.','Common framing in commentary after June 26, 2024 (no single primary speaker selected)','2024-06-26','','Rated misleading','scotus','The Court decided only standing: "We therefore lack jurisdiction to reach the merits." It made no finding that pressure did not occur.'),
('The courts ruled the Biden administration\'s censorship unconstitutional.','Common framing in commentary','2023-2026','','Rated misleading','ca5_remand','The only such findings were preliminary ("likely") and were vacated in full on Aug 26, 2024; SCOTUS said many district findings "appear to be clearly erroneous" (fn.4). The 2026 consent decree says it is not an admission of liability (¶17). Alito\'s "blatantly unconstitutional" is a dissent.'),
('The Administration only "encouraged responsible actions"; companies made "independent choices."','White House statement responding to Zuckerberg letter (wording reported by PBS/AP; reported, not confirmed by primary record)','2024-08-26','pbs_zuck','Rated misleading','zletter','Meta (Zuckerberg letter) and Alphabet (Sep 23, 2025 letter ¶8) both state officials pressured/pressed them; court record documents Flaherty emails. But both companies also say final decisions were theirs, and Raskin reports Alphabet employees testified to no coercion. Pressure is documented; legal coercion is not finally adjudicated.'),
('The FBI (or government) told Twitter/Facebook to suppress the Hunter Biden laptop story.','Widespread claim','2022-2024','','Unsupported','ov_hearing','Roth (sworn): Hunter Biden was raised in meetings "but not by the government, to the best of my recollection." Taibbi (TF#1 post 22): "no evidence - that I\'ve seen - of any government involvement." Zuckerberg letter describes a general FBI warning about Burisma-related disinformation, not a directive on the story. Separately, the district court found the FBI\'s general hack-and-leak warnings and silence "demonstrative of significant encouragement" (p.107) - a preliminary, vacated finding.'),
('The Twitter Files show the Biden White House ordered takedowns before the 2020 election.','Widespread claim','2022-12','','Rated misleading','tf1_10','In Oct 2020 the "Biden team" was a campaign, not the government; TF#1 post 10 says requests from "both the Trump White House and the Biden campaign were received and honored." Government-pressure material in the Files concerns 2021 (TF#10) and agency contacts (TF#6, #9).'),
('The Hunter Biden laptop story was a "Russian plan"/Russian disinformation.','Joe Biden (candidate), citing letter of 51 former intelligence officials','2020-10-22','debate1022','Unsupported','ic51','The letter itself said "we do not have evidence of Russian involvement." Meta later wrote "It\'s since been made clear that the reporting was not Russian disinformation" (zletter). DOJ use of the laptop at Hunter Biden\'s 2024 trial is reported, not confirmed by primary record here.'),
('The COVID lab-leak hypothesis was debunked / a conspiracy theory (basis for Facebook removals Feb-May 2021).','Facebook policy (Feb 8, 2021 removals of "man-made" claims)','2021-02-08','fb_covid','Rated misleading','odni2021','Facebook itself stopped removing the claim on May 26, 2021. The 2021 ODNI assessment called both natural and lab-associated origins "plausible"; one element assessed lab origin with moderate confidence. FBI (Wray, TV interview) and CIA (Jan 2025, low confidence, reported) later leaned lab. The origin remains officially unresolved, so "proven lab leak" is also not supported.'),
('Francis Collins and Fauci had the Great Barrington Declaration censored off social media.','Common framing','2021-','','Unsupported','collins','The FOIA email asks for "a quick and devastating published take down of its premises" - a published rebuttal. It does not ask platforms to remove content. The Fifth Circuit found NIAID not liable (Sep 8, 2023, pp.59-60). Separate platform actions against the authors (e.g., Twitter "Trends Blacklist" on Bhattacharya, TF#2) are documented but not tied to Collins in the record reviewed.'),
('The Biden government made platforms take down anything saying vaccines might have side effects.','Mark Zuckerberg on Joe Rogan #2255 (~00:08:34, approx.)','2025-01-10','rogan','Unsupported','zletter','Zuckerberg said he "wasn\'t involved in those conversations directly" and cited no document. His own sworn/official letter is narrower ("certain COVID-19 content, including humor and satire"). The TF#19 Virality Project email ("true stories that could fuel hesitancy") is a Stanford project, not a government directive. Not rated false: no primary record either confirms or refutes the full claim.'),
('Doctors lost their licenses simply for disagreeing on COVID.','Common framing','2021-','','Unsupported','cole','The one full board order reviewed (Washington, Dr. Ryan Cole) restricted - not revoked - the license and relied on both public statements and deficient patient care. FSMB warned of possible discipline (Jul 2021). California\'s AB 2098 was enjoined before any documented enforcement and repealed. No primary record reviewed shows a revocation based on speech alone.'),
('Facebook/"platforms are killing people."','Joe Biden','2021-07-16','pbs_killing','Rated misleading (walked back by speaker)','ucsb_0719','Three days later Biden said: "Facebook isn\'t killing people; these 12 people who are out there giving misinformation ... It\'s killing people."'),
('Taibbi/Shellenberger: CISA and EIP were "essentially identical in the eyes of the company."','Matt Taibbi, testimony','2023-03-09','wz_hearing','Unsupported (as a general claim)','eip','The EIP\'s own report says 16% of tickets came from the Center for Internet Security (a nonprofit), and platforms acted on 35% of URLs shared. The report confirms CISA consultation at formation. Taibbi cites one "From CISA escalated by EIP" communication; one message does not establish identity of the organizations.'),
('White House only "flagged" posts; platforms decided.','Jen Psaki','2021-07-16','psaki16','Not rated - partly supported','doughty_mem','Consistent with Meta and Alphabet saying final decisions were theirs; but the court record also contains demands ("I want an answer ... today") and a Section 230 threat context (Bedingfield, p.24). Included for balance.'),
('Networks "censored" the President by cutting away from the Nov 5, 2020 address.','Common framing','2020-11-05','dcpd_1105','Not rated - context','ap_cutaway','The full speech was carried by C-SPAN and released by the White House (unedited video; official transcript). Network cutaways by private broadcasters are reported, not confirmed here by network video; no government actor is involved. Broadcast networks also declined to air Biden\'s Sep 1, 2022 speech live (reported).'),
]
with open('candidates.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['claim','who_said','date','claim_url','rating','proof_url','explanation'])
    for c in C: w.writerow([c[0],c[1],c[2],U(c[3]) if c[3] else '',c[4],U(c[5]),c[6]])
print('done', len(T), len(P), len(C))
