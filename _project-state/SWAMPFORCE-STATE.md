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
