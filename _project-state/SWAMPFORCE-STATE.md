# SwampForce project state (saved 2026-09-24 4:18 PM MT) — READ THIS FIRST after any crash
User: KSS, Colorado (America/Denver). Site: swampforce.com (Namecheap cPanel premium324.web-hosting.com:2083, user swamhzws). Assistant is "in control" of research/builds; NEVER sends messages to anyone; NOTHING goes live until the user reviews ALL data (no partial launch).

## Standing rules (user's words: "we never lie"; "words are noise without evidence"; "no bias on this site"; "same rules apply to all")
- Proof = primary records only (official records, court filings, gov data, original transcripts/unedited video, statute text, outlet's own correction). Never proof: journalists, networks (incl. Newsmax/Fox/CNN), politicians, social media, think tanks, advocacy groups, polls, academic studies. Those = "where claim was made" or grey "Reported, not confirmed by primary record".
- "Verified by SwampForce" stamp only for primary-checked items.
- Labels: Proven false / Rated misleading / Unsupported (own section, never called lies) / Accurate; trackers: Proven / Disproven / Unresolved (no official finding). Opinion shows: Supported by the record / Partly supported / Not supported / Value judgment.
- User's opinions ONLY on Opinion page (nonprofit donor disclosure, ban lobbyists, Soros, republic-not-democracy, "damage is universal from everyone holding a microphone" + Arendt, "we the people own the nation / consent of the governed").
- US Code cited only where it applies; never imply a crime without charge/finding. Raw numbers only; discrepancies side by side.
- Both parties held to same standard; GOP pursued as hard as Dems.

## Site build
- Source: /workspace/site-from-checkpoint/ (build.py, watch.py, watch2.py, balance.py) -> public_html/; zip /workspace/swampforce-from-checkpoint.zip
- Rebuild+QA: /workspace/.venv/bin/python /workspace/sync_all.py (--skip-qa optional)
- Pages built: 33 pages incl. trump-watch, movement-watch, record-2020, accountability (6), energy, voters, record-2020-floyd, censorship, unsupported. Catalog 252 cases.
- Builder queue FINISHED Sep 24, 2026 ~6:00 PM MT (lawfare-money/salary + monuments/Schumer in trump-watch; site-apply.json applied (97 cut rows excluded, 9 rendered rows corrected via watch-data/site-apply-overlay.json); murder-rate chart redrawn 6.5; accountability hub + 5 trackers; energy; voters; record-2020-floyd; censorship (14 candidates in site-from-checkpoint/review-queue/censorship-candidates.csv, not in catalog); Opinion microphone/Arendt entry; balance report (balance-report.md + about.html#balance)). Awaiting user review.
- Deploy blockers: user's Printify Pop-Up URL (assets/store.js PRINTIFY_POPUP_URL), user signs into cPanel, user review of everything.

## Finished research folders (all delivered to user)
/workspace/accountability/ (Omar Unresolved; MN fraud; congressional trading; fraud tally; COVID/border; uscode-map)
/workspace/energy/ (gas vs 2008: refining +84c; Iran)
/workspace/population-voters/ (population-voters.xlsx; Harris "purging" Rated misleading; Griswold quote Unsupported; Hickenlooper letter 7/7 Accurate — never publish letter image or recipient name)
/workspace/record-2020/ and floyd-deep/ (homicide ruling supported; Chauvin federal plea admission)
/workspace/censorship/ (pressure documented; no merits ruling)
/workspace/checkpoint-review/ (896 items verified; essays; quotes restored)
/workspace/movement-watch/, /workspace/trump-watch/

## In progress
- /workspace/reverify/ (vet fact-checkers, re-verify catalog, Unsupported candidates -> unsupported-final.csv)
- /workspace/protest-funding/ (Form 990s, Soros/OSF, Arabella, Singham, Leonard Leo, grants, lobbying)
- /workspace/campaign-math/ (Medicare for All, reparations, GOP+Dem promises; phase 2 gop-accountability/)
- /workspace/newsmax-review/ (Higbie + Schmitt segments; opinion premises graded)
- /workspace/media-ratings/ (TO START: J6 "worst since 1812" + insurrection charges; media outlet chart from own archives 2015-now, incl. The View and opinion hosts; raw counts, separate columns, no composite score)

## Routines
- SwampForce daily news and deception log check: weekdays 8:29 AM MT
- SwampForce running tallies update: Mondays 8:57 AM MT

## Recent answers given
- Biden "we the government": he actually said (Apr 28, 2021) "'We the People' are the government — you and I." Christie 2012 said "doesn't start by saying 'We the government'"; LBJ 1964 Reno said "'we, the Government'". Offered Opinion-page pairing (awaiting user yes).
- Offered AI-assisted methodology line (no answer yet). 7 checkpoint candidates to review with user (/workspace/checkpoint-review/candidates-ready.md).

## Update 5:50 PM MT 9/24
- Credits ran out ~4:20-5:46; all background work died. Relaunched: site builder queue, campaign-math+newsmax, J6+media chart, and GitHub backup+protest funding+reverify (gh logged in as ksshort65; backup branch backup-2026-09-24).
- User asked to preview on Namecheap: uploading noindex copy (/workspace/preview-0547/sfnew-preview.zip, built from /workspace/preview-sfnew) to public_html/sfnew/ ONLY. Root site untouched. Old sfnew contents (if any) moved to public_html/sfnew-old-0549.
- Shareable bot template "Evidence-First Fact Checker" staged (unpublished) with getting-started skill.
- Agent renamed "Jackson".
- 2026-09-24 19:55 User sent files: other-chat spreadsheet (identical + new 'Official-data limits' tab, merged into population-voters.xlsx; its figures like DOJ/AP 70 charged/~160 arrests and SAVE 28,635 flagged not yet primary-verified), refugee/shelter funding PDF (other chat, ~approximations, needs verification), JCPOA text, Hickenlooper SAVE Act letter 3/20/2026 (for Voters page letter image). Dental form and Stripe code: not used, not copied. Files in /workspace/_incoming-from-user.
- 2026-09-24 19:56 Also received: inflation-by-president.xlsx (BLS CPI math checked OK; 'Key point' text is interpretive, keep neutral or Opinion page) and iran-enrichment-iaea-timeline.pptx (IAEA figures, need source links before site). In /workspace/_incoming-from-user.

## Update 8:10 PM MT 9/24: Gas Price Gap Tracker (done, not deployed)
- Folder /workspace/energy/gap-tracker/: gas-gap-tracker.xlsx (12 tabs; raw values as reported, [formula] columns only; Sources + "Unexplained - Red flags" tabs), gap-report.md, charts/ (3 PNG), gap_build.py (rebuild from energy/raw, no downloads), update.py (weekly EIA+CFTC append-only; run with /workspace/energy/.venv/bin/python), parse_refcap.py, redflags.json, facts.json.
- Findings: today $4.478 = crude 246.5c + refining 142.3c + taxes 52.2c + distribution 6.8c. ~79% normal/documented, 56c war-shortage premium (cause documented, size unmeasured), 40.5c Brent-WTI gap above 2025 level (no primary-record explanation found). Record Gulf gasoline-WTI crack $1.549 (wk Aug 28 2026). Jun-Jul 2026: wholesale fell 11c vs WTI -55c/gal; retail -53c. VLO+MPC+PSX 2022-25 payouts $79.6B = 97% of net income. RBOB managed-money net long highest since 2012. Colorado: Suncor 100% of CO capacity, CO now 22c below US. Top-5 refiners 52.1% of US capacity; PADD 4 72%. FEC refiner/trade PACs 84-91% to GOP each cycle 2020-26; OpenSecrets industry 81-88% GOP. No 2026 finding of illegality anywhere.
- Site: new page gas-gap.html (Watch menu; linked from energy.html), workbook copied to downloads/gas-gap-tracker.xlsx. X post (@TrumpNews / "Jonathan Gregory", Sep 23) added to watch-data/unsupported-extra.csv -> unsupported.html (now 2 claims). sync_all OK: 34 pages, broken links 0, overflow 0, console 0. Screenshot shots/gas-gap-desktop.png. Not deployed.

## 2026-09-24 ~8:40 PM MT: user-sent files integrated (letter, CPI by term, IAEA timeline, JCPOA link, refugee/parole funding)
- voters.html: Hickenlooper SAVE Act letter (Mar 20, 2026) now shown as a name-blurred image (images/voters/hickenlooper-save-act-letter-2026-03-20-redacted.jpg; source watch-data/hickenlooper-letter-2026-03-20-redacted.jpg, NOT backed up to GitHub). New `hick_letter()` in watch2.py replaces the letter-factcheck.md box: 6 Accurate, 1 Rated misleading ("protections in place to prevent them"). H.R. 22 GPO text, 18 U.S.C. 611/1015, GA 2024 audit (20), DOJ 26-1082 (16 charged), SCOTUS 26A308 (28,635 SAVE flags) linked.
- voters.html: DOJ/AP "70 charged" and HSI "160 arrests" removed (no primary record); DOJ row now shows the Sep 18, 2026 release (16). 28,635 tile now links the U.S. stay application. Workbook download = population-voters/population-voters.xlsx (has Official-data limits tab).
- sync_all.py check changed: letter image allowed only as the -redacted.jpg copy; unredacted file must not exist in public_html.
- energy.html: new sections en-cpi (CPI-U by presidential term, CPI_ROWS in watch2.py; Trump II partial, 19 months) and ir-iaea (19 IAEA-sourced rows, JCPOA official text link 2009-2017.state.gov/.../245317.pdf, 2231, 2018 NSPM; JPA 2014, GOV/2024/61 figures and snapback as reported). "Key point" interpretive paragraph from the inflation workbook dropped (not moved to Opinion).
- accountability-covid-border.html: new section cb-funding (10 rows, exact figures: ACF CJs, GAO-26-107815, DHS OIG-26-04, State FY25 report, CBO 60165, NYC Comptroller). Unverified figures from the AI-written PDF not published.
- sync_all: pass, 0 broken links. Screenshot shots/voters-letter.png.

## 2026-09-24 ~9:10 PM MT: Journal pilot (short visual essays) + Article V page (done, not deployed; awaiting owner approval of format)
- New module site-from-checkpoint/journal.py (imported at end of watch.py; Sections with in_menu=False). Nav: "Journal essays" added at top of the Journal menu + footer "Read" column. build.py essay_redirects() now applies journal.REDIRECTS.
- Pages (34 -> 39): journal.html (hub), journal-find-them.html, journal-they-forgot-who-they-work-for.html, journal-they-work-for-us.html, article-v.html. CSS block "Journal pilot" appended to public_html/assets/style.css.
- Format: kicker, bold headline (owner's words), big number/quote card with source + stamp, 4 short linked sentences, Chart.js chart when there is a strong number, labeled "Our view" box, collapsed "Read the full essay" (verified text verbatim from checkpoint-review/essays-verified; unlinked facts get grey "reported, not confirmed" notes).
- Words (verified body -> visible): find-them 464 -> 221; that-is-not-why-they-are-elected 347 -> 228; they-work-for-us 542 -> 253.
- Redirects: /dispatch/find-them.html, /dispatch/that-is-not-why-they-are-elected.html, /dispatch/they-work-for-us.html -> new pages.
- McCaul: Fox News Rundown ep (megaphone FOXM9499614134) downloaded + transcribed locally (faster-whisper base.en, key part re-checked with small.en; /workspace/journal-pilot/mccaul-transcript.txt). NYT lines "Internecine warfare is what has become vogue" and "elected to fight and kill the other side" are NOT in the episode. Actual words used instead: ~4:53 "very vogue and style to demonize the other side of the aisle"; ~5:32 "internecine warfare within our own party ... go after your fellow Republican colleagues". NYT lines are marked reported-only on the page.
- Settlements (on they-work-for-us): OOC memo Nov 16, 2017: 264 awards/settlements, $17,240,854, FY1997-2017, all CAA claim types. CAA Reform Act S.3749 = P.L. 115-397 (Dec 21, 2018). Votes: Roll 83 (Mar 4, 2026, refer Mace H.Res.1100 to Ethics, 357-65-1; R 175-38-1, D 182-27) and Roll 233 (Jun 30, 2026, Massie H.Res.1399, 420-0-1 present Mace; R 209, D 210, I 1). OCWR Aug 31, 2026 response: totals $745,247.02 / $67,620.11 / $609,884.53, 32 destroyed files ($166,120.08 for 24); member names withheld (CAA s.416). Ethics Jul 2, 2026 statement. Higbie: 2 FRONTLINE segments on Newsmax's own YouTube (Mar 5 Massie, May 26 Comer); no causation claimed.
- Article V: 20 states per Convention of States Action (advocacy count, labeled); all 20 linked to an official record (17 House Clerk memorial PDFs read by OCR in /workspace/journal-pilot/memorials; AR SJR3 2019, MS SCR596 2019 (no term limits), KS SCR1604 2026 from state records).
- sync_all: SYNC OK, 39 pages, overflow 0, console 0, broken links 0. Screenshots shots/find-them-phone.png, shots/article-v-phone.png (+ -top.png). Research folder /workspace/journal-pilot/.

## 2026-09-24 ~10:10 PM MT: Journal: all cleared essays converted, interactive format, Listen button, brand kit (done, not deployed)
- journal.py v2 renderer: kicker/headline, Listen bar (browser speechSynthesis; play/pause/stop, hidden if unsupported; JS in assets/app.js), big number card (icon) or quote card, source-type button ("DHS Inspector General report", "House vote", "U.S. Code", "Official video (DOJ)", ...; map `_TYPES` by URL), optional chart, tap-to-expand fact cards (<details>, verified sentence + source button, opens new tab), labeled Our view box, collapsed full verified essay. CSS block "Journal v2" + "Brand" appended to assets/style.css.
- 57 cleared essays converted to journal-<slug>.html (spec: site-from-checkpoint/journal-data/essays_spec.py; facts: journal-data/essay-facts.json from journal-pilot/digest.py). Held 5 not converted: clean-hands, it-does-not-fit, the-check-they-will-not-write, a-barcode-is-not-a-lock, what-they-are-protecting. All 60 are on the hub, grouped by series; /dispatch/<slug>.html now redirects to the new pages. Visible words about 120-140 (short essays are topped up only with the owner's plain opinion sentences from Our view; no figures or quotes). 2 are under 120: what-he-told-them 104, a-war-on-americans 107. Find them is 219.
- full_html now links bare URLs, "Record: url" and "- label - url" lines, and /dispatch/ links. Paragraphs matching checkpoint-review/site-apply.json rows marked "cut it" (or corrected via overlay) are dropped from the rendered full text: who-got-paid 228, defund-ice-is-the-tell 231, the-noise 234, they-sold-the-split 236, the-whole-bill 242, division-is-the-product 218, one-word 178, the-democrat-ledger 122 and 135.
- Find them reworked: card 146,000 located (DOJ/DHS/HHS press conference Jun 11, 2026, official DOJ video ~8:13, Mullin; "nearly 300,000 missing"). Fact cards: OIG-24-46, OIG-25-21 (31,322 addresses), HHS OIG OEI-07-21-00250 + HHS 2023 (66%), DHS "located" definition (13,000 Jul 2025, 145,000 Feb 2026), House Oversight roundtable Jun 30, 2026 (Higgins ~46:01 "zero Democrats present"; Part I 2025 had 5 Democrats), H.R. 7123 Thanedar + Pressley transcript; no Republican defund/abolish statement found. "~149,000" not in any primary record; 148,000 (Mullin X, Aug 3) reported only, not used.
- Brand: /workspace/brand/ (README.md, src/brand.py, brand2.py, brush.py). Site: header = eagle + SWAMPFORCE in Anton (real text, assets/fonts/anton-sub.woff); eagle head at 560px and below; old flag mark at 330px and below. Homepage and journal hub hero = lockup. Footer and Shop = new stamp. og.jpg = stamp on navy 1200x630. favicon-32.png + apple-touch-icon.png from the eagle head (favicon.svg kept, unused). --red is now #a51d24.
- sync_all: SYNC OK, overflow 0, console 0, broken links 0.
- Backup: branch backup-2026-09-24, commit c46bd53 (brand/ now included; swampforce-stamp-color-4500.png is 5.2 MB, so it is over the 5 MB limit and was left out. Rebuild it with brand/src/brand.py).

## 2026-09-24 ~11:45 PM MT: GitHub inventory + Midterm Scorecard rebuilt (done, not deployed)
- Inventory of GitHub main (read-only clone /workspace/_gh-main-readonly; HEAD 48c68dd, baseline c60dc5d in history): /workspace/_project-state/github-inventory.md. Held list and decisions: /workspace/_project-state/midterms-held.md.
- scorecard.html is now THE midterm page (consolidated; no second page). /midterms.html 301 redirects there. Nav label "Midterms"; homepage hero CTA + band "Who ran Congress. What it cost." Rooms: Republicans | Democrats | Split | Compare | The Oval.
- New module site-from-checkpoint/midterms.py (columns, compare grid, Three jobs, border pointers, charts). Data: midterm-data/debt_by_control.json (scripts/debt_by_control.py, Treasury history + Debt to the Penny, partyctl.json from senate.gov/house history) and debt_by_president.json (scripts/debt_by_president.py). CSS block "Midterm scorecard" appended to assets/style.css. Screenshot script scripts/midterm_shots.py.
- Debt added by control (1857 to Sep 17, 2026): R $10.99T, D $12.47T, Split $16.63T (GitHub's 10.96/12.65/16.48 did not verify). Since 1993: R $11.00T/15.7 yrs, D $9.57T/8 yrs, Split $15.37T/10 yrs. Presidents since 1981: R $19.83T, D $19.33T.
- Helped/Hurt: GOP 4/3, Dem 4/4, Split 4/3 (Iraq AUMF moved to Split; see held file). Charts harm-pie and helped-hurt replaced by Chart.js doughnut + HTML grid from verified data. New charts: debt per year of control, manufacturing jobs by president (BLS CES3000000001), debt by president.
- No-duplication: removed scorecard's duplicate charts sc-enc-dem, sc-sw, sc-nyc (still on border.html) and duplicate hero tiles; border harm = pointer tiles to the journal essays; budget/surplus/fraud/salary = links.
- sync_all: SYNC OK, overflow 0, console 0, broken links 0. Shots: shots/midterms-phone-top.png, -full.png, -dem/-split/-compare.png, home-midterms-band-phone.png.

## 2026-09-24 ~11:45 PM MT: Midterms "How did your rep vote? Your wallet" + state fuel-tax section (done, not deployed)
- New module site-from-checkpoint/wallet.py, called from build.py build_scorecard() (section id="wallet" after the rooms; hero link "#wallet"). CSS block "Wallet votes" appended to public_html/assets/style.css. Research files: /workspace/wallet-votes/ (roll-call XML, statute HTML, tally.py).
- 8 tap-to-expand cards (tips/overtime/65+, child tax credit, standard deduction, stimulus checks, Social Security Fairness Act, Medicare insulin $35 + negotiation, ACA subsidies, minimum wage). Amounts from statute text (govinfo) / SSA; party counts recounted from clerk.house.gov and senate.gov XML. House "Check your rep" + Senate buttons, package note, control label matching the scorecard rooms; costs linked to #gop/#dem/#split (no repeat of CBO $3.4T / Part D).
- Top line: house.gov find-your-rep, senate.gov contacts, Nov 3, 2026 (2 U.S.C. 7; all 435 seats), vote.gov.
- Colorado note on tips card: HB25-1296 (signed May 16, 2025; CO House repass 40-24, Senate 23-12) adds back the federal OVERTIME deduction from tax year 2026; DOR guide (Jan 2026): no addback for tips. Owner's belief "CO taxes tips" corrected. Not a special-session bill (Aug 2025 special session bills were QBI/FDDEI/etc.). SB26-056 (limit addback to 2026) lost. 65+ deduction treatment in CO not checked (held).
- Held/notes: CARES House passed by voice vote (no names; button opens congress.gov actions). Dec 2020 $600 checks not included. Senate never voted on H.R. 582 (shown: 2021 Sanders $15 waiver vote 74, 42-58). Senate has not voted on H.R. 1834 (ACA extension).
- gas-gap.html: new section gg-state "What your state adds to every gallon": verified sortable table (watch-data/fuel-tax-2026-07.json from EIA fueltaxes.xlsx July 2026 revised; IL from IL DOR), owner's 4 charts (watch-data/fuel-tax-charts/, tap to enlarge, credited), corrections box. Sortable-table JS appended to public_html/assets/app.js. Check files: /workspace/fuel-tax-check/.
- Fuel-tax corrections vs owner charts: Utah gas 38.55 (chart 32.6), Vermont gas 31.26 (34.9), Nevada gas 23.81 (24.8, county 1c added), Indiana gas 64.5 statutory (63.1) but excise+use tax suspended through Oct 5 2026 (only 1c fee collected), Puerto Rico: no federal excise; barrel taxes are taxes (gas 52.9, diesel 26.0). Illinois: chart right (48.3/55.8 frozen by P.A. 104-0468), EIA shows unfrozen 49.6/57.1. All 52 rows present both fuels; all else within 0.1c of EIA. Pretax estimates (CA/WA/OR) not verified.
- Shots: shots/wallet-votes-phone-top.png, wallet-votes-phone-card-tips.png, gas-gap-state-taxes-phone.png. Preview zip /workspace/swampforce-preview-2026-09-24c.zip. Backup branch backup-2026-09-24 (see hash in report).
