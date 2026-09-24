# Swamp Force: site inventory (September 24, 2026)

Build: `cd /workspace/site-from-checkpoint && /workspace/.venv/bin/python build.py`
Output: `public_html/`, a static site with no server code. Zip: `/workspace/swampforce-from-checkpoint.zip`.

## Pages (18)
| Page | Audience | What it is |
|---|---|---|
| index.html | Public + staff | Hero, stat tiles, merch band, lawmaker band, charts, Betrayal spine, rooms |
| fake-news.html | Public | 250 cases as claim/record cards. Search, chips, method filter, chart-click filters, deep links (#case-ID). Shop CTA after the list |
| scorecard.html | Public | Rooms: Republicans, Democrats, Split, The Oval, Side by side. Verified figures only, as tiles and charts. Shop CTA after the rooms |
| betrayal.html | Public | The Great American Betrayal (page-header text). Opinion labeled, with charts |
| democrats.html / republicans.html | Public | Congress-pushed cases, 14 and 11 rows |
| january-6.html | Public | J6 cases from the record |
| lawfare.html | Staff (serious) | 10 dockets with court PDFs in lawfare-docs/ |
| brief.html | Staff (serious) | Two-page staff brief: PDF/HTML/print, proof ranking, citation form |
| appendix.html | Staff (serious) | All 250 cases sorted by proof rank |
| about.html | Staff (serious) | Methodology |
| downloads.html | Staff (serious) | CSV, XLSX, PDF, ZIP |
| store.html | Public | "Wear the file." Printify embed/deep link or "The shop opens soon" with a notify mailto |
| foreword.html, congress.html, border.html, remedy.html | Public | Journal hubs (The Republic, Congress, The Border, The Remedy). Each has content, and none is empty |
| 404.html | All | Uses absolute paths |

The serious pages (lawfare, brief, appendix, about, downloads) have no shop band or sales copy. They keep only the header Shop button and the footer Store link.

## Store placements
- Red Shop button in the header on every page, desktop and mobile.
- Merch band on home after the stat tiles.
- Slim CTA after the case list (Fake News) and after the rooms (Scorecard).
- Footer shop band on every public page except the serious pages and store.html itself.
- The store URL is one constant: `PRINTIFY_POPUP_URL` in `assets/store.js`. When it is empty, the page shows "The shop opens soon" with a notify mailto to editor@swampforce.com. When it holds an https URL, the page shows an "Open the full store" button, the iframe, and header Shop buttons that deep-link to the store.
- No products, product images or prices are invented. The only image is the Swamp Force logo.

## Data sources (read only; not modified)
- `/workspace/term-split/first-term-trump-admin-media-deception.csv` and `later-second-term-...csv`: the 250 cases.
  - Verdicts: 178 proven false, 72 misleading.
  - Proof rank: official record 65, transcript/video 27, outlet correction 64, fact-check 94.
  - Corrections: never corrected by the pusher 157, appended correction 64, editor's note 8, legal/settlement 5, on-air 2, not recorded 14.
  - Terms: first 142, later 108. Congress-pushed: 48.
- `/workspace/term-split/page-header.txt`: The Great American Betrayal text.
- `/workspace/checkpoint-review/verified-items.csv`: scorecard figures. Only items whose notes confirm the figure are used, and each shows its source link.
- `/workspace/lawfare/`: docket tracker, rulings CSV and court PDFs.
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

## Journal essays held back
The 65 dispatch essays in ESSAYS.md are not published. Most of their figures are not in the verified set, and publishing them would break the evidence-only rule. Their old URLs (`/dispatch/*.html`) now 301 to the matching hub, 65 rules in `.htaccess`. Other redirects: explainer → betrayal, pump → scorecard, pending → index, republic → foreword. An essay can be restored once its figures are verified.

## QA (scripts/qa.py, Playwright/Chromium)
- 0 horizontal overflow at 1280 and 390 on all 18 pages.
- 0 console errors.
- 0 broken local links or anchors.
- Shots in `shots/`, plus `home-mobile-menu-open.png` and review crops in `shots/review/`, including a live-store test with a sample URL.
