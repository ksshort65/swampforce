# Congressional stock trading, 2025–2026: disclosed volume, late filings, and prosecutions

*Compiled Sep 24, 2026 (MT) from the official filings: House Clerk Periodic Transaction Reports (PTRs) and Senate eFD PTRs. Data: `trading.csv` (one row per member), `trading-transactions.csv` (one row per transaction, each linked to its official filing). Method: `trading-methods.md`. Aggregators (Capitol Trades, Quiver, Unusual Whales) were **not** used for any figure here. Every number comes from the official filings.*

> **Read this first.** Disclosures give **value ranges**, not exact amounts. They do **not** disclose profit, loss, or return. Nobody can compute a member's "profit" from these records. Any site that claims to do so is estimating from ranges and market prices. A trade disclosed late is a disclosure violation (a $200 late fee under House and Senate rules). It is **not** evidence of insider trading.

## 1. Disclosed trade volume, Jan 1, 2025 – Sep 24, 2026 (by transaction date)

Totals are the sums of the reported ranges: the **minimum** is the sum of range floors, the **maximum** is the sum of range ceilings.

| Scope | Transactions | Sum of range minimums | Sum of range maximums |
|---|---|---|---|
| House, 2025 | 7,780 | $218.3M | $795.0M* |
| House, 2026 YTD | 2,551 | $95.7M | $310.7M* |
| Senate, 2025 | 1,011 | $38.7M | $111.4M |
| Senate, 2026 YTD | 1,304 | $51.4M | $144.9M |
| **Both chambers, all assets** | **12,646** | **$404.1M** | **$1.362B*** |
| Both chambers, stocks and options only | 10,516 | $142.0M | $563.8M |

\*Ten House transactions used open-ended bands ("Spouse/DC Over $1,000,000" or "Over $50,000,000"). Their floor is counted and their ceiling is unknown, so the maximum is a lower bound. The all-assets figures include Treasury bills, money-market funds, municipal bonds, and one interest-rate-cap transaction. That is why the stock-and-option subset is also shown.

Coverage: 161 members with at least one electronically filed trade. **Excluded (scanned paper filings that cannot be machine-read):** 112 House PTRs from 17 members (e.g., Reps. Ro Khanna (20 filings), Hal Rogers (19), Michael McCaul (18), Tony Wied (13), Diana Harshbarger (11), Chuck Fleischmann (9)) and 30 Senate paper PTRs, all from Sen. Richard Blumenthal. The true totals are therefore **higher** than shown.

## 2. Top traders by disclosed volume (sum of range minimums, all assets)

| # | Member | Transactions | Min | Max | Example official filing |
|---|---|---|---|---|---|
| 1 | Rep. Jefferson Shreve (R-IN) | 634 | $86.0M | $389.8M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026770.pdf |
| 2 | Sen. David McCormick (R-PA) | 412 | $52.0M | $125.2M | https://efdsearch.senate.gov/search/view/ptr/257795ae-e1b2-411d-b562-8fe4c2a4f2a1/ |
| 3 | Rep. Scott Peters (D-CA) | 185 | $32.7M | $61.6M+ | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026774.pdf |
| 4 | Rep. Nancy Pelosi (D-CA) | 35 | $25.5M | $108.3M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026590.pdf |
| 5 | Rep. Darrell Issa (R-CA) | 1 | $25.0M | $50.0M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20030181.pdf (one sale of a UBS interest-rate cap, not a stock) |
| 6 | Rep. Gil Cisneros (D-CA) | 1,588 | $15.8M | $56.0M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026726.pdf |
| 7 | Rep. Suzan DelBene (D-WA) | 113 | $12.9M | $27.4M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026602.pdf |
| 8 | Rep. Cleo Fields (D-LA) | 233 | $12.6M | $33.1M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20027855.pdf |
| 9 | Rep. Josh Gottheimer (D-NJ) | 504 | $10.5M | $42.4M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026732.pdf |
| 10 | Rep. Kevin Hern (R-OK) | 95 | $9.5M | $32.6M | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20026794.pdf |

**Stocks and options only, top 5:** Pelosi $24.0M–$102.1M (31 transactions); Shreve $16.1M–$42.0M; Fields $11.7M–$31.1M; Gottheimer $10.5M–$41.9M; McCormick $9.9M–$31.7M.
**Most transactions:** Cisneros 1,588; Lisa McClain 1,375; Sen. Alan Armstrong 707; Rob Bresnahan 653; Shreve 634.
Many high-count filers use managed or advisor accounts. The filings often say so (e.g., "Filing Status" or "Description" notes). Volume by itself shows nothing about intent.

## 3. Filings made more than 45 days after the trade (STOCK Act)

**Rule:** A member must report a covered transaction "not later than 30 days after receiving notification" of it, "but in no case later than 45 days after such transaction." This is the STOCK Act, Pub. L. 112-105, §6 (https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf), codified at 5 U.S.C. 13105(l) (https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title5-section13105&num=0&edition=prelim).

**Face-of-filing result:** 2,795 transaction lines filed in 2025–2026 were reported more than 45 days after the transaction date shown on the filing. They come from **63 members**. The full list is in `trading.csv`, columns `transactions_filed_over_45_days`, `max_days_late`, and `late_filing_urls`.

Largest by number of late lines (each checked against the official filing):

| Member | Late lines | Longest lag (days) | Official filing |
|---|---|---|---|
| Sen. Alan Armstrong (R-OK) | 701 | 119 | https://efdsearch.senate.gov/search/view/ptr/fda235b3-bad7-4637-8fa1-053f354d929c/ (Armstrong was appointed and sworn in March 24, 2026: https://oklahoma.gov/governor/newsroom/newsroom/2026/governor-stitt-appoints-alan-armstrong-as-us-senator.html . All 701 late lines are dated Mar 24–31, 2026, his first week in office, and were filed Jul 21, 2026) |
| Rep. Lisa McClain (R-MI) | 545 | 520 | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20030891.pdf (filed Aug 13, 2025, with trades back to 2024) |
| Rep. Valerie Hoyle (D-OR) | 222 | 408 | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20032070.pdf |
| Rep. Julia Letlow (R-LA) | 211 | 447 | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2026/20030977.pdf |
| Rep. Sheri Biggs (R-SC) | 177 | 272 | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20032149.pdf |
| Sen. Tommy Tuberville (R-AL) | 177 | 880 | https://efdsearch.senate.gov/search/view/ptr/014817f0-9809-457f-8ac5-048948608e02/ (a batch filed Aug 5, 2026, covering 2024–2025 trades) |
| Sen. Markwayne Mullin (R-OK; now DHS Secretary) | 96 | 953 | https://efdsearch.senate.gov/search/view/ptr/06c4c944-4a89-4f96-8649-7400f210b84f/ |
| Rep. Ritchie Torres (D-NY) | 87 | 328 | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20030930.pdf |
| Rep. Julie Johnson (D-TX) | 77 | 455 | https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/20029064.pdf |
| Sen. Rick Scott (R-FL) | 50 | 552 | https://efdsearch.senate.gov/search/view/ptr/03e0a1db-2fe8-409f-ae3e-61ab61e14cae/ |

**Caveats (neutral):**
1. Some late lines may be dating errors on the form. One Shreve line shows a 3,698-day lag, which is almost certainly a typo.
2. Some may cover transactions from before the person was a covered official (new members and appointees).
3. Some may be voluntary disclosures of assets that are not covered.
4. The House and Senate Ethics Committees assess and waive the $200 fee privately. There is no public list of fees paid.

Label each case **"filed after the 45-day deadline on the face of the official filing."** Do not call it "a violation found" unless an Ethics Committee or court has said so.

## 4. Members of Congress actually charged with or convicted of insider trading (primary records)

| Person | Charge / court | Outcome | Primary source |
|---|---|---|---|
| **Rep. Christopher Collins (R-NY)** | S.D.N.Y. No. 18-cr-567. Conspiracy to commit securities fraud (tipped his son about Innate Immunotherapeutics' failed drug trial) and false statements to the FBI (**18 U.S.C. 1001**) | Pleaded guilty Oct 2019; sentenced Jan 17, 2020, to 26 months and a $200,000 fine; **pardoned** Dec 22, 2020 | https://www.justice.gov/usao-sdny/pr/former-congressman-christopher-collins-sentenced-insider-trading-scheme-and-lying ; DOJ pardon list: https://www.justice.gov/pardon/pardons-granted-president-donald-trump-2017-2021 (justice.gov blocks automated checks; confirmed via search index) |
| **Former Rep. Stephen Buyer (R-IN)** | S.D.N.Y. No. 22-cr-397. Four counts of securities fraud (Sprint/T-Mobile and Navigant/Guidehouse). Charged after he left Congress, for trades as a consultant | Jury conviction March 2023; sentenced to 22 months, $354,027.72 forfeiture, and a $10,000 fine; **pardoned** June 2026 | Gov't sentencing submission: https://storage.courtlistener.com/recap/gov.uscourts.nysd.583519/gov.uscourts.nysd.583519.131.0.pdf ; DOJ: https://www.justice.gov/usao-sdny/pr/former-congressman-sentenced-22-months-prison-insider-trading ; pardon: https://www.whitehouse.gov/presidential-actions/2026/06/granting-pardon-to-stephen-e-buyer/ |

**No sitting member was charged with insider trading in 2025–2026**, based on DOJ and SEC releases searched. **No one has ever been criminally prosecuted solely for late STOCK Act disclosure.** The statutory remedy is the ethics-committee late fee.

**Investigated, not charged (2020 pandemic-briefing trades).** Sen. Richard Burr (DOJ closed its inquiry in Jan 2021) and Sens. Kelly Loeffler, James Inhofe, and Dianne Feinstein (DOJ closed its inquiries in 2020). These closures were announced by the senators or their lawyers, and DOJ issued no public finding. Label: **reported, not confirmed by primary record**, and **no charge**.

## 5. Executive-branch trading controversies with IG or official findings

| Official | Finding | Source |
|---|---|---|
| Fed Chair Jerome Powell and former Vice Chair Richard Clarida | Fed OIG (July 2022; full report Jan 2024) found their trading **did not violate** applicable laws, rules, or policies. Clarida omitted some trades from disclosures, and a Powell family-trust adviser traded during an FOMC blackout without Powell's knowledge | https://oig.federalreserve.gov/releases/board-closing-trading-activity-jul2022.pdf ; https://oig.federalreserve.gov/releases/investigation-closing-board-trading.pdf |
| Former Dallas Fed President Robert Kaplan and former Boston Fed President Eric Rosengren | Fed OIG (2024) found **no violation** of laws or trading rules, but said their activity created appearance problems (Kaplan's incomplete disclosures; Rosengren's unreported trades) | https://oig.federalreserve.gov/releases/investigation-closing-reserve-bank-trading.pdf |
| Former Fed Governor Adriana Kugler (resigned Aug 2025) | Fed-released disclosure showed individual-stock trades and blackout-period trades that Fed ethics rules prohibit. Fed ethics officials referred the matter to the OIG. **No OIG report has been published.** Label: **Unresolved (no official finding)** on violations beyond what the Fed's own ethics notes say | Reported: https://www.cnbc.com/2025/11/15/fed-kugler-ethics-stock-trading.html |
| DEA Administrator Terry Cole | His OGE 278-T reportedly shows 2025 stock purchases disclosed 4–5 months late, with the late fee waived. **Reported, not confirmed by primary record** (the OGE filing is available on request from OGE) | https://www.notus.org/money/trump-drug-enforcement-administration-terry-cole-financial-disclosure |

## 6. Pardon context (neutral)
Both members ever convicted of insider trading, Collins (2020) and Buyer (2026), were later pardoned by President Trump. A pardon does not erase the court record of conviction.
