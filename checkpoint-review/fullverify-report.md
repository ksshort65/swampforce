# swampforce.com: full verification report

Finished Sept 24, 2026, 3:50 PM MT. Scope: every fact and number Grok Build wrote into the site. That is 896 catalogued items (`verified-items.csv` / `.xlsx`) plus 65 essays (`essays-verified/`).

## The sourcing standard used (tightened, steering #2)
- **Best_Source_URL** is always a primary record: an official record, government data, a court filing, an original transcript, or unedited video.
- **Journalists, networks, politicians and social media** appear only as the place a claim was made. They are never the source for a fact.
- **Fact-checkers** can appear only as secondary confirmation, and only from `/workspace/reverify/factchecker-vetting.csv`:
  - AFP is approved.
  - PolitiFact, FactCheck.org, Snopes, AP, Reuters, WaPo, USA TODAY, Lead Stories, Check Your Fact and Full Fact are approved with caution.
  - The Dispatch, VERIFY, CNN and PBS are rejected. No fact-checker was used as a Best_Source_URL.
- **A fact backed only by news** was marked "Cannot verify, cut it".
- **Judgment calls. Please confirm these:**
  - **Treated as non-primary and cut:** think tanks and advocacy groups (Urban, CRFB, Cato, Mercatus, Brookings, MRC, OpenSecrets, LegiStorm, USAFacts, Ballotpedia, CLC, Devex), private polls (Pew, Gallup), industry loss estimates (PCS/Verisk, III), academic studies (Science), and GovTrack's own analysis.
  - **1964 roll call:** the House total (290–130, Feb. 10, 1964) is now cited to the official Congressional Record, vol. 110, pt. 2, p. 2804 (item 711). The Record lists names without party, so the GovTrack copy is kept only for the party split (items 712–715), per your fallback rule.
  - **Committee press releases are political:** they are attributed, not linked.
  - **Signed or official documents hosted on committee sites are kept:** ICE's signed letter to Rep. Gonzales, the declassified Rice note on hsgac.senate.gov, and GPO-published committee reports.
  - **White House pages** are used only as "the White House says".

## Totals (CSV after this pass)
| Verdict | Items |
|---|---|
| Verified | 482 |
| Verified with correction needed (exact fix in Fix_Needed) | 206 |
| Opinion (needs an "Our view" label) | 111 |
| Cannot verify, cut it | 90 |
| False, cut it | 7 |
| **Total** | **896** |

**By category:**

| Category | Verified | VwC | Opinion | Cut (unverifiable) | False |
|---|---|---|---|---|---|
| scorecard_stat | 342 | 112 | 6 | 30 | 6 |
| essay_fact | 46 | 54 | 42 | 44 | 1 |
| media_claim_vs_record | 69 | 27 | 34 | 11 | 0 |
| republican_statement | 8 | 1 | 17 | 0 | 0 |
| democrat_statement | 5 | 6 | 12 | 4 | 0 |
| lawfare_case | 12 | 6 | 0 | 1 | 0 |

### This pass's final sweep
1. **Source links on the 188 items the earlier pass never reached** (mostly the media, Democratic and Republican ledgers and some scorecard rows). Their Best_Source_URL values included junk scrapes: a cookielaw.org consent script, a Substack post, HuffPost corrections, iMediaEthics, Poynter, rev.com, and a BLS series attached to January 6.
   - Each was replaced with the primary record from the site's own link, or with a primary record found this pass. Examples: Durham report vs Mueller report now matched to the right claims, the J6 Committee report, the Senate roll call, H.Res. 24, H.J.Res. 31, the DOJ OIG Epstein report 23-085, the CBO SNAP letter, and the DHS Sept. 22, 2026 statement.
   - Every Verified or VwC row now has a primary Best_Source_URL. The only other links left are unedited videos cited as where someone said something (YouTube and C-SPAN), the DSA program (DSA's own platform), and DoD, MACPAC, BJS and prosecutor pages.
2. **Vague Fix_Needed entries replaced with exact wording.**
   - "Replace/mirror site href (HTTP 4xx)": the site link was itself a primary record that only blocked the automated checker, so those rows became Verified.
   - "Zero §2383 ≠ zero felonies": rows accurate as written became Verified. Rows 32 and 178 get exact added wording (about 1,583 charged, about 608 charged with assaulting officers, Oath Keepers and Proud Boys leaders convicted of seditious conspiracy under § 2384).
   - "Same as item N": now points to item N's exact fix.
   - "Confirm…": each was resolved to Verified or cut.
3. **Newly cut** (news-only, no primary record, or no record text):
   - 29 ("10 percent for the big guy": only House Oversight)
   - 34, 69 (Time cover toddler), 90 ("enemy from within": no primary link)
   - 132, 138 (SOTU seating not checked against video)
   - 364 (Chemonics)
   - 566–567 (McCaul Fox radio quote)
4. **New corrections:**
   - **31:** Zelensky said "nobody pushed me" (Sept. 25, 2019 transcript). "Felt no pressure" were Trump's words.
   - **84:** Russia bounties. The White House said on Apr. 15, 2021 the intelligence was assessed with "low to moderate confidence".
   - **110:** "evading arrest is a federal felony" becomes 18 U.S.C. § 111 (forcibly resisting a federal officer).
   - **845:** H.Res. 24 quoted "fight like hell" and not "peacefully and patriotically". The claim about "the clip they ran" is dropped.
   - **148:** cite the Dec. 11, 2020 Texas v. Pennsylvania order.
   - **7 / 136:** the IAEA GOV/2026/8 citation added for "only non-weapon state at 60%"; Jeffries' authorship of "war of choice" softened to "said on the House floor, Mar. 4, 2026".

## False or misleading numbers, with corrections
| Where | Site says | Record says | Source |
|---|---|---|---|
| DEBT_BY_OVAL (591/593) | R +$21.1T vs D +$18.0T | Measured the same way (inauguration to inauguration), **R +$19.8T vs D +$19.3T** | Treasury Debt to the Penny / historical debt |
| DEBT_TALLY (423) | Split control "every other year since 1857" | False. The split Congresses were 1859–61, 1875–79, 1883–89, 1891–93, 1911–13, 1981–87, 2001–03, 2011–15, 2019–21, 2023–25. The Democratic list wrongly includes 1875–79. Recomputed: R ≈ $11.0T, D ≈ $12.5T, split ≈ $16.6T | Treasury |
| MAJORITY (797) | Nixon and Bush 41 counted as "split" | Wrong classification | House/Senate party divisions |
| DRIVERS (667) | Parole → SSN → SSI | False. Parole alone does not qualify anyone for SSI | SSA SSI spotlight, 8 U.S.C. 1611/1612 |
| BENEFITS (501) | $9,255 "per full-benefit enrollee" | $9,255 is the all-enrollee figure; full-benefit is $9,859 (FY2023) | MACPAC |
| BENEFITS stack | "$2,590" stack | Misleading. Use SSI's average of $715 (all recipients, Dec. 2025) | SSA snapshot |
| BORDER_HARM / CBO | "$16.2B in the Biden years, +124%" | Misleading framing (from a House Budget press release). CBO table: FY2021 $7.05B; FY2017–23 total $26.554B | CBO |
| Essay defund-ice (231) | "Lost hundreds of thousands of children" | False. OIG-24-46: ICE could not monitor 32,000+ unaccompanied children who failed to appear | DHS OIG |
| FUNNEL / aid total (370, 691) | $71.9B FY2023 disbursed (USAID $43.8B) | **$80.5B** disbursed in FY2023. The USAID share was cut | ForeignAssistance.gov |
| FAILURE (804) | Platner is "Democratic nominee" | He withdrew July 10, 2026 | Maine SoS |
| Member salary (5 places) | $174,500 | **$174,000**; outside-income cap $33,855 (2026) | CRS RL30064 |
| Pump page | Gas $4.157 / diesel $5.967 (Sept. 7) | Gas **$4.478**, diesel **$6.529** (record) for the week of Sept. 21, 2026 | EIA weekly |
| Pump page | State gas tax 33.5¢ | **33.3¢** (Jan. 1, 2026) | EIA motor-fuel taxes |
| Pump page | 132 refineries / 18.4M b/d | **130 / 18.16M b/d** (Jan. 1, 2026) | EIA Refinery Capacity Report |
| Pump page | OPEC+ formed "in 2022"; UAE in OPEC | OPEC+ dates from **Dec. 10, 2016**. The UAE left OPEC and OPEC+ on May 1, 2026 | OPEC communiqué; UAE government (WAM) |
| Sicknick (341) | Spray assaults on officers | Only Julian Khater pleaded guilty to assaulting officers with spray | DOJ |
| 2020 murder rate (185) | 6.6 | 6.5 per 100,000 (21,570) | FBI data, BJS HVUS 2023 App. Table 2 |

**Confirmed, no change needed:**
- CBO Feb 2026: $5.596T / $7.449T / $1.853T (5.8% of GDP); debt 100.6% rising to 120.2% of GDP.
- Debt first passed $40T on Aug. 18, 2026.
- FBI 2025 murder rate: 4.1.
- DHS assaults: 275 vs 19.
- Prairieland: 8 sentenced; 100 years for one; 450 years combined.
- IAEA: 440.9 kg of uranium enriched up to 60%.
- EIA: 13.83M b/d.
- OIG-26-04: $1.45B, $425M, $16.5M.
- CBP: 10.83M encounters FY2021–24; FY2025 691,906.
- BLS: CPI 9.1% (June 2022).
- Trump-2 gasoline peak: $4.500 (May 11, 2026).
- Carroll: cert denied June 29, 2026; rehearing denied Aug. 17, 2026.

## Essays (65)
- **Cleared as-is: 10**
  - the-docket, the-republic-not-the-caption, they-dont-debate-they-flag, they-published-the-replacement, they-dont-write-the-bills, what-the-democratic-party-became, what-the-republican-party-became, why-the-lobby-should-be-illegal, this-congress-cannot-police-itself, the-law-they-dont-mention.
- **Cleared with fixes: 50.** Each file's first line lists the fixes. This includes the three ledgers:
  - **Media ledger:** 8 rows cut (93 remain).
  - **Democrat ledger:** 4 rows cut.
  - **Republican ledger:** the tax-return line was corrected.
  - **a-war-on-americans:** press-only funding and "circle" material cut; Carroll's Supreme Court status updated from the docket; the Georgia dismissal reasoning attributed to Skandalakis's motion.
- **Held: 5.** Each has a cleaned draft; an editor needs to decide.
  - clean-hands: the quotes and loss figures are press or industry only.
  - what-they-are-protecting: the money evidence is from news outlets and aggregators.
  - it-does-not-fit: the central number is a think-tank estimate.
  - the-check-they-will-not-write: the money case is think-tank and press figures.
  - a-barcode-is-not-a-lock: the Aug. 2026 USPS "final rule" is not in the Federal Register. The 2020 half stands on the Nov. 12, 2020 statement CISA published ("most secure in American history"; paper records in all close states). The "95%" figure is cut.
- Full list: `essays-verified/INDEX.md`.

## Modules that can leave "Under review"
- **Clean, can leave now:** FARM, CAPACITY/CBO, LEG_BRANCH, TAX_MOVES, PRICES/CPI, CHARTS (after 11 link fixes), PAPERS, LAWS, OVAL/OVAL_NOW, ALIENS, OBAMA_TERMS, TRUMP_TERMS, THE_LOSS, NYC material.
- **Can leave after applying site-apply.json:**
  - DEBT_BY_OVAL, DEBT_TALLY, MAJORITY, BENEFITS, DRIVERS, WORKER
  - FUNNEL (aid total)
  - Pump (PUMP-1…10)
  - salary lines (SALARY-1…8)
  - EO, OIG-26-04 and Oyez links (LINK-1…9)
  - BORDER_HARM/BORDER_MOVE (CBO framing, committee links)
  - RECORD, FAILURE (Platner)
- **Should stay down or be rebuilt:**
  - PARTY_SPEND: all 5 items cut.
  - WAR: 8 cut; the McCaul and Waters material has no primary record.
  - IMPOSSIBLE: 1 item, cut.

## Files
- `verified-items.csv` / `verified-items.xlsx`: updated in place (backup in `backup-pre-fullverify/`).
- `site-apply.json`: 331 entries (after the Sept. 24 follow-up):
  - every VwC, False and Cannot-verify row (the new text is the exact Fix_Needed wording, or "remove");
  - PUMP-1…10, SALARY-1…8 and LINK-1…9;
  - plus the list of 111 items that need an "Our view" label.
- `essays-verified/<slug>.md` (65) and `essays-verified/INDEX.md`.
- Pipeline: `fv/` (generators, then `sweep.py`, then `apply.py`; essays via `ledger_specs.py` / `specs*.py`, then `build_essays.py`).

## Follow-up (Sept. 24, 2026, MT)
- **"Said. Not invented." restored (item 401; the-media-ledger):** every quote now has a primary link. Restored: the looting post (Wayback capture of the tweet), Access Hollywood (tape wording as quoted in the Second Circuit's Carroll v. Trump opinion, plus his "locker room talk" apology in the Oct. 9, 2016 debate transcript), the Dec. 3, 2022 "termination" post and the Nov. 11, 2023 "vermin" post (Wayback captures of Truth Social's own records), and the Woodward line (March 19, 2020 recording, The Trump Tapes). Exact wording is in item 401's Notes.
- **2020 murder rate (item 185):** 6.5 per 100,000 (21,570), from the BJS table of FBI data. they-called-it-protest was updated; the chart label (6.6) must change to 6.5.
- **Lamberth (item 142):** "These videos are decidedly not exculpatory" is confirmed in U.S. v. Chansley, Mem. Op. (D.D.C. July 20, 2023), p. 17.
- **Jeffries (items 290, 291, 571, 573, 135):** wording checked against captions of his own YouTube upload and CAP's livestream (CAP conference) and ABC's unedited feed (Apr. 22 conference). Both quotes match. "Named an election in the second sentence" was corrected: "electorally" comes about ten seconds later.

## Still unsettled
1. **C-SPAN pages still block automated fetches.** C-SPAN timestamps were not checked, and the Claremont speech's own timestamp was not checked. The quote now rests on his same-day post. The Jeffries wording comes from YouTube auto-captions, not a human transcript.
2. **2020 murder rate:** the current (revised) FBI Crime Data Explorer figure could not be queried (API rate-limited). 6.5 is the FBI-sourced figure in the BJS table.
3. **Woodward audio:** the wording matches the tape as aired by CBS and the published transcripts. The audiobook itself was not played.
4. **The 5 Held essays** stay out of launch.
5. **call-these-first** keeps directory links to legal-aid groups (a directory, not evidence).
