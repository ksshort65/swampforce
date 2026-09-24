# Swamp Force: site inventory (September 24, 2026)

**After any data change, run the single command `/workspace/.venv/bin/python /workspace/sync_all.py`.** It rebuilds everything in order from the catalog CSVs (term-split XLSX and zips, brief and appendix PDF/HTML and thumbnails, lawfare tracker, site, site zip), runs QA, prints the headline counts, and exits non-zero if any output disagrees with the catalog or any copy is not byte-identical to its source. Use `--skip-qa` for a fast run.
Site pages only: `cd /workspace/site-from-checkpoint && /workspace/.venv/bin/python build.py`
Output: `public_html/`, a static site with no server code. Zip: `/workspace/swampforce-from-checkpoint.zip`.

## Pages (22: 19 core + 3 Watch)
| Page | Audience | What it is |
|---|---|---|
| index.html | Public + staff | Hero, stat tiles, merch band, lawmaker band, charts, Betrayal spine, rooms |
| fake-news.html | Public | 252 cases as claim/record cards. Search, chips, method filter, chart-click filters, deep links (#case-ID). Shop CTA after the list |
| scorecard.html | Public | Rooms: Republicans, Democrats, Split, The Oval, Side by side. Verified figures only, as tiles and charts. Shop CTA after the rooms |
| betrayal.html | Public | The Great American Betrayal (page-header text). Opinion labeled, with charts |
| democrats.html / republicans.html | Public | Congress-pushed cases, 14 and 11 rows |
| january-6.html | Public | J6 cases from the record |
| lawfare.html | Staff (serious) | 10 dockets with court PDFs in lawfare-docs/ |
| brief.html | Staff (serious) | Two-page staff brief: PDF/HTML/print, proof ranking, citation form |
| appendix.html | Staff (serious) | All 252 cases sorted by proof rank |
| about.html | Staff (serious) | Methodology |
| downloads.html | Staff (serious) | CSV, XLSX, PDF, ZIP |
| store.html | Public | "Wear the file." Printify embed/deep link or "The shop opens soon" with a notify mailto |
| foreword.html, congress.html, border.html, remedy.html | Public | Journal hubs (The Republic, Congress, The Border, The Remedy). Each has content, and none is empty |
| opinion.html | Public | OPINION page (top-level nav item "Opinion"). Banner: "Opinion. The facts cited here are sourced to the record; the conclusions are the author's." Posts come from `OPINION_POSTS` in build.py (title, date, body, sources), rendered as cards, newest first. Every factual sentence links to the catalog or an official source. No shop band |
| 404.html | All | Uses absolute paths |
| trump-watch.html | Public (serious) | **Watch: Trump Accountability Watch.** Built by `watch.py` from /workspace/trump-watch (log.csv, conflicts.csv, baseline.md) plus re-checked figures in `watch-data/` (278e foreign license-fee lines, pardon counts, GAO decisions). Tiles, 2 charts, overlaps table (both sides primary-confirmed; status "No official finding"), grey "Reported only" lists, clemency, GAO (labeled budget-law findings), IG ruling, Hatch Act, emoluments, visitor logs, full log |
| movement-watch.html | Public (serious) | **Watch: Movement Watch.** From /workspace/movement-watch. El-Sayed, Hasan Piker (Los Angeles streamer), DSA program in its own words, claims checked (El-Sayed Rated misleading via WDET; DSA Venezuela toll Disputed; Piker Minab claim vs UN report), 2026 political violence table (official records only; minors never named). Piker AIPAC claim omitted |
| record-2020.html | Public (serious) | **Watch: 2020: The Record.** From /workspace/record-2020 (section-draft.md rendered in full; only sources marked verified). Tiles, MFF chart, Floyd full-record panel (toxicology and heart findings beside the homicide ruling, AFME concurrence, convictions, appeals, federal plea), Minneapolis timeline, "peaceful" framing cards, R2020-01/02/03 claim cards, R2020-04 as Unsupported (this page only), "What the record does not support". R2020-05/06 omitted (on hold). Not in the catalog CSVs |
| unsupported.html | Public | **Built only when `/workspace/reverify/unsupported-final.csv` exists and has rows.** Then it lists each unsupported claim (ID, claim, who pushed it, why, source links), and links appear in the Evidence menu, footer, Fake News, Methodology and Downloads (`downloads/unsupported-claims.csv`, a byte-identical copy). While the file is absent there is no page, link or placeholder. Columns are matched loosely: Item_ID, Claim, Who_Pushed_It, Reason / Verification_Note, Verification_Source_URL / Source_URL, Checked |

The serious pages (lawfare, brief, appendix, about, downloads, opinion) have no shop band or sales copy. They keep only the header Shop button and the footer Store link.

## Store placements
- Red Shop button in the header on every page, desktop and mobile.
- Merch band on home after the stat tiles.
- Slim CTA after the case list (Fake News) and after the rooms (Scorecard).
- Footer shop band on every public page except the serious pages and store.html itself.
- The store URL is one constant: `PRINTIFY_POPUP_URL` in `assets/store.js`. When it is empty, the page shows "The shop opens soon" with a notify mailto to editor@swampforce.com. When it holds an https URL, the page shows an "Open the full store" button, the iframe, and header Shop buttons that deep-link to the store.
- No products, product images or prices are invented. The only image is the Swamp Force logo.

## Data sources (the catalog CSVs are the source of truth; sync_all.py derives everything else)
- `/workspace/term-split/first-term-trump-admin-media-deception.csv` and `later-second-term-...csv`: the 252 cases (#252 and #253 added Sep 24, 2026).
  - Verdicts: 179 proven false, 73 misleading.
  - Proof rank: official record 67, transcript/video 27, outlet correction 64, fact-check 94.
  - Corrections: never corrected by the pusher 159 (152 "Never corrected — fact-checked only"; 7 "Never corrected", meaning no fact-check on file: #9, #14, #15, #27, #66, #252, #253), appended correction 64, editor's note 8, legal/settlement 5, on-air 2, not recorded 14.
  - Terms: first 142, later 110. Congress-pushed: 48.
- `/workspace/term-split/page-header.txt`: The Great American Betrayal text. Its correction-visibility sentence and Congress count are recomputed from the catalog (by sync_all.py in the file, and by build.py on the site).
- `/workspace/checkpoint-review/verified-items.csv`: scorecard figures. Only items whose notes confirm the figure are used, and each shows its source link.
- `/workspace/lawfare/`: docket tracker, rulings CSV and court PDFs. `build_tracker.py` is the generator (it now reproduces the hand-corrected HTML/README exactly); sync_all.py regenerates into a temp dir and copies only what changed.
- `/workspace/brief/`: staff brief and evidence appendix (PDF + HTML).
- site-v2 loaders were reused through `v2data.py`, a copy. site-v2 itself was not changed.

## Scorecard figures shown
- **Republicans room** (unified control since January 2025). CBO FY2026 projections: receipts $5.6T, outlays $7.4T, deficit $1.9T, net interest $1.039T (FY2025: $970B).
- **Democrats room** (White House January 2021 to January 2025; Congress 2021–23; GOP House from 2023):
  - CPI 9.1% for June 2022 (BLS).
  - CBP encounters of 10.83M over FY2021–24: 1,956,519 / 2,766,582 / 3,201,144 / 2,901,142. Southwest 8.73M, other 2.10M. The page notes that FY2021 began under the prior administration.
  - NYC asylum-seeker spending of $8.13B: 1.41 / 3.70 / 3.02 (NYC Comptroller).
- **Split room:** CPI 3.9% for September 2011.
- **The Oval:**
  - CPI readings chart.
  - FY2025 encounters 691,906.
  - Southwest Border Patrol 237,538, the lowest since 1970.
  - CPI 3.4% for August 2026 (latest reading, not a peak).
  - Verified caption-vs-transcript frames (items 169–174, 177, 180, 181, 183, 192).
- **Side by side:**
  - Debt $40.09T as of September 17, 2026.
  - USDA ERS farm income, 2025 vs 2026.
  - Average Social Security $2,086.
  - Part B $202.90.
  - SSI $715 / $994.
  - SNAP $190 / $352.

## Marked "Under review" (shown as a badge, no number)
- Bills passed by each party.
- Debt added by each party.
- Trump first-term desk in The Oval.

## Left out as unconfirmed
- $9.59T.
- CPI 4.2%.
- Murder rate 4.1.
- Defense $885B.
- DHS 275 assaults.
- The old "Pump" page, whose EIA/FRED figures were unverified.
- Old explainer, pending and republic pages. These were internal or placeholder content.

## Law and history lines (restored Sep 24, 2026, each linked to a primary source)
Used on opinion.html (The Great American Betrayal, with a full source list), congress.html (fact box) and brief.html (The law in brief). Sources are in `LAWSRC` in build.py:
- Arendt: The Origins of Totalitarianism, 2nd enlarged ed. 1958 (the passage is from "Ideology and Terror," Review of Politics, 1953; it is not in the 1951 first edition); "Truth and Politics," The New Yorker, 1967; "Lying in Politics," NYRB, 1971; Errera interview, NYRB, 1978.
- United States v. Alvarez (2012), New York Times Co. v. Sullivan (1964), Gravel v. United States (1972), Hutchinson v. Proxmire (1979): U.S. Reports PDFs at the Library of Congress. Wording now matches the holdings: Sullivan is about public officials, not public figures; Hutchinson covers newsletters and a press release, not press conferences.
- House discipline: the House Historian's list (6 expulsions, 29 censures, as of Sep 24, 2026; `HOUSE_DISCIPLINE` in build.py); H. Res. 521 (GovInfo) and Clerk roll call 283 (213–209, 6 present) for the 2023 Schiff censure.

## Journal essays held back
The 65 dispatch essays in ESSAYS.md are not published. Most of their figures are not in the verified set, and publishing them would break the evidence-only rule. Their old URLs (`/dispatch/*.html`) now 301 to the matching hub, 65 rules in `.htaccess`. Other redirects: explainer → betrayal, pump → scorecard, pending → index, republic → foreword. An essay can be restored once its figures are verified.

## QA (scripts/qa.py, Playwright/Chromium)
- 0 horizontal overflow at 1280 and 390 on all pages (22 after the Watch sections; rerun Sep 24, 2026 by sync_all.py after the fix list: correction labels, AP wording, restored sourced lines). unsupported.html was also checked with a test file (no overflow at 1280/390) and then removed, since the real file does not exist yet.
- 0 console errors.
- 0 broken local links or anchors.
- Shots in `shots/`, plus `home-mobile-menu-open.png` and review crops in `shots/review/`, including a live-store test with a sample URL.


## Watch sections (watch.py)
- Registry: `SECTIONS` in `site-from-checkpoint/watch.py`. A section builds only when all its input files exist; otherwise its page and links are removed. Active sections appear in the "Watch" nav menu, the footer Watch column, the sitemap, build-summary.json (`watch`) and QA screenshots.
- Verified derived data lives in `site-from-checkpoint/watch-data/` (the research folders are read-only inputs owned by other agents).
- Planned, not built: accountability trackers (/workspace/accountability) and energy (/workspace/energy), listed in `PLANNED`. To add one: write `build_<name>(H)` with the same helpers (tiles, rec_card, reported_box, claim_card, stamp) and add a `Section(...)`.
- sync_all.py validates: pages exist only when inputs exist; sitemap/nav links; every card and table row has a source link; no Verified stamp inside a Reported-only list; foreign-fee total and conflicts rows recomputed from the sources; violence rows = official-record rows; no minor named; AIPAC claim omitted; record-2020 ratings, on-hold omissions, no unverified sources, and no R2020 rows in the catalog CSVs.
