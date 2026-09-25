# GitHub main inventory vs. current SwampForce site (Sep 24, 2026, ~11 PM MT)

Repo: ksshort65/swampforce, branch main (read-only clone /workspace/_gh-main-readonly). HEAD 48c68dd (Sep 24 12:10 PM MDT); baseline c60dc5d "Full site checkpoint" is in its history (436 files at c60dc5d, 438 at HEAD; 17 files changed after c60dc5d, all ledger/scorecard wording). The '497' count in the brief includes files not in main HEAD (likely .grok or backup branch); nothing was written to main.
Ignored: .grok/ skills, auth/, multiplayer/, db.ts, cart.ts, preview bridges, scripts/*.mjs build tooling, vite/tsconfig/package files.
Method: each data constant's source links were matched against every page in public_html (heuristic), then the midterm constants were checked by hand. Statuses: PRESENT / PARTIAL / MISSING / CUT (failed verification) / n/a.

## 1. Data constants (src/lib/scorecard.ts, restored-files.ts, pump.ts)
| File | Constant | Links | On site | Status |
|---|---|---:|---:|---|
| scorecard.ts | SCORE_UPDATED | 0 | 0 | n/a |
| scorecard.ts | SCORE_TABS | 0 | 0 | PRESENT (rooms) |
| scorecard.ts | SCORE_FILES | 0 | 0 | n/a alias |
| scorecard.ts | FARM | 7 | 3 | PRESENT: scorecard Compare "household ledger" (sc-farm); Chapter 12 filings MISSING |
| scorecard.ts | OVAL_DESKS | 0 | 0 | PRESENT: Oval room sub-tabs |
| scorecard.ts | DEBT_NOW | 1 | 1 | PRESENT |
| scorecard.ts | DEBT_TALLY | 1 | 1 | PRESENT (rebuilt, corrected): scorecard.html hero + Compare; recomputed $10.99T / $12.47T / $16.63T (GitHub $10.96/$12.65/$16.48 did not verify) |
| scorecard.ts | DEBT_MATH | 0 | 0 | PRESENT (corrected): Compare "How it is counted" |
| scorecard.ts | THE_LOSS | 5 | 3 | PARTIAL: interest on scorecard (CBO tiles); surplus FY2001 in journal-we-the-people; 12 bills in journal-the-debt-they-will-not-close; GAO $162B improper payments not re-added (accountability-fraud has improper-payment tier) |
| scorecard.ts | PURSE | 1 | 1 | PRESENT (hero dek, Article I link on existing pages) |
| scorecard.ts | OBAMA_TERMS | 9 | 7 | PARTIAL (7/9 source links on site) |
| scorecard.ts | LAWS | 11 | 8 | PARTIAL (8/11 source links on site) |
| scorecard.ts | HOAXES | 10 | 6 | PARTIAL (6/10 source links on site) |
| scorecard.ts | PAPERS | 16 | 9 | PARTIAL (9/16 source links on site) |
| scorecard.ts | WARFARE | 0 | 0 | CHECK (no links; text-only) |
| scorecard.ts | FAKE_NEWS | 5 | 2 | PARTIAL (2/5 source links on site) |
| scorecard.ts | FRAMES | 6 | 5 | PRESENT (links ≥80% on site) |
| scorecard.ts | OVAL | 0 | 0 | CHECK (no links; text-only) |
| scorecard.ts | OVAL_NOW | 1 | 1 | PRESENT (links ≥80% on site) |
| scorecard.ts | OVAL_LINKS | 7 | 6 | PRESENT (links ≥80% on site) |
| scorecard.ts | OVAL_RECORD | 10 | 7 | PARTIAL (7/10 source links on site) |
| scorecard.ts | TRUMP_TERMS | 13 | 9 | PARTIAL (9/13 source links on site) |
| scorecard.ts | ENCOUNTERS | 1 | 1 | PRESENT (Oval sc-enc-all, border.html) |
| scorecard.ts | CPI_PEAK | 1 | 1 | PRESENT: Oval sc-cpi chart |
| scorecard.ts | BORDER | 4 | 3 | PARTIAL (3/4 source links on site) |
| scorecard.ts | BORDER_MOVE | 6 | 2 | PARTIAL (2/6 source links on site) |
| scorecard.ts | BORDER_HARM | 5 | 4 | PRESENT elsewhere (journal-the-hospital-and-the-morgue, journal-fema-ran-two-jobs, journal-they-opened-the-border); scorecard Compare has pointer tiles only (no repeat) |
| scorecard.ts | BENEFITS | 4 | 1 | PARTIAL (1/4 source links on site) |
| scorecard.ts | WORKER | 4 | 1 | PARTIAL (1/4 source links on site) |
| scorecard.ts | PRICES | 4 | 1 | PARTIAL (1/4 source links on site) |
| scorecard.ts | LEDGER | 18 | 12 | PARTIAL (12/18 source links on site) |
| scorecard.ts | WAR | 13 | 8 | MISSING (8 rows "cut it" in audit; rest need rebuild) |
| scorecard.ts | PARTY_SPEND | 0 | 0 | CUT (Just Facts, not primary) |
| scorecard.ts | PARTY_SPEND_HREF | 1 | 0 | CUT (Just Facts) |
| scorecard.ts | DEBT_BY_OVAL | 0 | 0 | PRESENT (corrected) via DEBT_BY_TERM chart |
| scorecard.ts | TAX_MOVES | 6 | 5 | PRESENT (links ≥80% on site) |
| scorecard.ts | HEARING_ABSENCE | 2 | 0 | MISSING (Sep 23, 2026 Judiciary hearing; audit Verified but it is a single-day committee item; candidate) |
| scorecard.ts | RECORD | 50 | 29 | PRESENT (rebuilt): scorecard.html Republicans/Democrats/Split columns, Helped/Hurt; off-period items not moved (see below) |
| scorecard.ts | DRIVERS | 5 | 2 | PARTIAL (2/5 source links on site) |
| scorecard.ts | DEBT_WHY | 3 | 1 | PRESENT: Our view box (owner slogan) + links to existing fraud/salary/budget pages; party lines merged into Hurt lists |
| scorecard.ts | ALIENS | 8 | 5 | PARTIAL (5/8 source links on site) |
| scorecard.ts | FUNNEL | 7 | 6 | PRESENT (links ≥80% on site) |
| scorecard.ts | ROLL_1964 | 1 | 1 | PRESENT (links ≥80% on site) |
| scorecard.ts | CHARTS | 66 | 53 | PRESENT (links ≥80% on site) |
| scorecard.ts | COMPARE_WIDE | 0 | 0 | n/a UI |
| scorecard.ts | COMPARE_CHARTS | 2 | 1 | PARTIAL (1/2 source links on site) |
| scorecard.ts | TAB_CHARTS | 0 | 0 | n/a UI |
| scorecard.ts | OVAL_DESK_CHARTS | 0 | 0 | n/a UI |
| scorecard.ts | FILE_CHIPS | 1 | 0 | MISSING (0/1 source links on site) |
| scorecard.ts | MAJORITY | 9 | 7 | PRESENT (merged into the three columns; control years corrected: Dem 1879-81 not 1875-81; split spans listed) |
| scorecard.ts | FAILURE | 7 | 2 | PARTIAL (2/7 source links on site) |
| scorecard.ts | DEBT_BY_TERM | 0 | 0 | PRESENT (rebuilt, corrected): Oval room chart "Debt added by president" R $19.83T vs D $19.33T since 1981 (GitHub +$21.1T/+$18.0T and FDR..Truman rows did not verify / not rebuilt pre-1981) |
| scorecard.ts | LEG_BRANCH | 0 | 0 | MISSING (FY2026 leg-branch $7.258B, P.L. 119-37 / CRS R48612; audit Verified; candidate) |
| scorecard.ts | LEG_BRANCH_TOTAL | 0 | 0 | MISSING (with LEG_BRANCH) |
| scorecard.ts | IMPOSSIBLE | 3 | 0 | CUT (Urban/Cato/Brookings estimates are not primary records) |
| scorecard.ts | CAPACITY | 0 | 0 | PARTIAL (CBO receipts/outlays tiles on Republicans room) |
| scorecard.ts | SCORE_ROWS | 14 | 7 | PARTIAL (7/14 source links on site) |
| restored-files.ts | RAIL_FILE | 3 | 0 | MISSING (0/3 source links on site) |
| restored-files.ts | COVID_CELL | 2 | 0 | MISSING (0/2 source links on site) |
| restored-files.ts | SUITS | 14 | 8 | PARTIAL (8/14 source links on site) |
| restored-files.ts | DEALS | 2 | 0 | MISSING (0/2 source links on site) |
| restored-files.ts | AT_HOME | 5 | 1 | PARTIAL (1/5 source links on site) |
| restored-files.ts | OTHER_OVALS | 5 | 1 | PARTIAL (1/5 source links on site) |
| restored-files.ts | TERM_COMPARE | 3 | 3 | PRESENT (links ≥80% on site) |
| pump.ts | PUMP_UPDATED | 0 | 0 | CHECK (no links; text-only) |
| pump.ts | PUMP_SOURCES | 11 | 5 | PARTIAL (5/11 source links on site) |
| pump.ts | PUMP_CHARTS | 0 | 0 | CHECK (no links; text-only) |
| pump.ts | ADMINS | 0 | 0 | CHECK (no links; text-only) |
| pump.ts | MARKS | 3 | 1 | PARTIAL (1/3 source links on site) |
| pump.ts | GALLON_STACK | 1 | 1 | PRESENT (links ≥80% on site) |
| pump.ts | OPEC_FILE | 2 | 1 | PARTIAL (1/2 source links on site) |
| pump.ts | TAX_FILE | 4 | 3 | PARTIAL (3/4 source links on site) |
| pump.ts | RULES_FILE | 2 | 0 | MISSING (0/2 source links on site) |

## 2. Other GitHub content
| Item | Status |
|---|---|
| src/lib/content.ts: 62 Dispatch essays (+ ESSAYS.md) | PRESENT: 57 converted to journal-*.html; 5 HELD by earlier audit (clean-hands, it-does-not-fit, the-check-they-will-not-write, a-barcode-is-not-a-lock, what-they-are-protecting) |
| content.ts `eras` ("Three jobs", in the-record-not-the-rally) | PRESENT (rebuilt, verified): scorecard.html Compare > Three jobs; unverifiable lines cut (see held list) |
| src/lib/ledgers.ts mediaFrames (~115) | PRESENT via fake-news.html catalog (252 cases) after audit; 9 rows cut |
| ledgers.ts demFrames (27) / gopFrames (26) | PRESENT: democrats.html / republicans.html (audit cuts applied) |
| src/components/midterm-scorecard.tsx | PRESENT (rebuilt as static scorecard.html rooms). Sections: Four Ovals (Oval room), signed deals / statutes / papers / lawsuits / Oval desks (restored-files: PARTIAL, see table), WARFARE (MISSING, text only), FUNNEL (journal-the-funnel), RAIL_FILE and COVID_CELL (MISSING) |
| recovered-pre-collapse/midterm-scorecard.pre-collapse.tsx | Same data imports as current (RECORD etc. from lib); no extra Helped/Hurt rows found. content.pre-collapse.ts = older content.ts |
| recovered-pre-collapse/pump.partial.pre-collapse.tsx, src/routes/pump.tsx, pump.ts | PARTIAL: /pump.html redirects to scorecard; gas components live on energy.html + gas-gap.html (newer, verified) |
| src/components/era-compare.tsx | PRESENT (Three jobs) |
| src/components/lawfare-ledger.tsx | PRESENT: lawfare.html (10 dockets) |
| src/components/narrative-frames.tsx | PRESENT via fake-news.html |
| src/routes: about, foreword, find-them, archive, copyright, dispatch | PRESENT (about.html, foreword.html, journal-find-them.html, journal hub); archive -> index redirect; copyright page MISSING (footer © only) |
| public/images chart-harm-pie.jpg | REPLACED: numbers ($10.96/$12.65/$16.48T) did not verify; redrawn as Chart.js doughnut from recomputed Treasury data |
| public/images chart-helped-hurt.jpg | REPLACED: rebuilt as tappable HTML grid from verified rows (items moved/corrected, see report) |
| public/images: other 60 chart-*/essay-*/blog-* images | MISSING as images (by design: site redraws charts from verified data; many carry unverified numbers). Candidates to re-draw: chart-debt-bars (= harm-pie, done), chart-inflation-party, chart-border, chart-crime (murder rate already redrawn on site), chart-oval-* |
| public/og-scorecard.jpg, x-*.jpg, get-the-site.html | MISSING (social/share art; site uses new og.jpg) |
| UPLOAD-TO-NAMECHEAP/ (older static export, 60 dispatch pages) | SUPERSEDED by journal pages; /dispatch/*.html redirect |
| REPEATS.md | notes only |
| scripts/make-*-charts.py | reference only (chart data checked against primaries where reused) |

## 3. Priority list for the rest (not done this pass)
1. restored-files RAIL_FILE, COVID_CELL, DEALS, AT_HOME, OTHER_OVALS (0-1 links on site). 2. LEG_BRANCH (verified, $7.258B). 3. BENEFITS/WORKER/PRICES remainder. 4. BORDER_MOVE (7 rows cut in audit). 5. WAR/WARFARE. 6. HEARING_ABSENCE. 7. OBAMA_TERMS / TRUMP_TERMS remainder (Oval desks). 8. Chart images worth redrawing from verified data.
