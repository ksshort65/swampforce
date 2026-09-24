# Methods note: congressional trading tally

**Sources (official only)**
- House: the Clerk's annual financial-disclosure index files `2025FD.zip` and `2026FD.zip` (https://disclosures-clerk.house.gov/public_disc/financial-pdfs/2025FD.zip). We kept records with FilingType = "P" (Periodic Transaction Report): 515 in 2025 and 400 in 2026. Each PTR PDF was downloaded from `https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/{year}/{DocID}.pdf` on Sep 24, 2026.
- Senate: the eFD search at https://efdsearch.senate.gov (report type 11 = PTR, submitted on or after 01/01/2025), after accepting the site's public-use agreement. That returned 298 PTRs: 268 electronic (HTML transaction tables) and 30 paper/scanned. **Note:** direct Senate PTR links open only after a visitor accepts the eFD agreement on the site's home page.

**Parsing**
- House electronic PTRs (DocIDs beginning with "2") were converted with `pdftotext -layout`. Each transaction line was matched on: type (P, S, S (partial), E), transaction date, notification date, and amount band. **Check:** for every document, the number of parsed transactions equals the number of "Filing Status" lines. The six mismatches were exact-dollar entries such as "$224.00"; those are now counted at their exact value.
- House paper PTRs (DocIDs beginning with "8" or "9"; 112 filings from 17 members) are scanned images where amounts are marked by X's in columns. They were **excluded**. OCR could not recover the amounts reliably.
- Senate electronic PTRs were parsed from the HTML table (date, owner, ticker, asset, asset type, type, amount).
- Lines marked "Amended" (21) or "Deleted" (5) in House filings were excluded to avoid double counting.
- One line dated after Sep 24, 2026 was excluded as a likely typo.

**Tally window:** transaction date from Jan 1, 2025 through Sep 24, 2026. Trades from 2024 that were reported in 2025 filings (912 lines) are outside the volume tally, but they **are** counted in the late-filing check.

**Ranges:** the statutory bands are $1,001–15,000; 15,001–50,000; 50,001–100,000; 100,001–250,000; 250,001–500,000; 500,001–1M; 1,000,001–5M; 5,000,001–25M; 25,000,001–50M; and over 50M. "Spouse/DC Over $1,000,000" is open-ended. Minimum = sum of floors. Maximum = sum of ceilings, where open-ended bands contribute only their floor (so the maximum is a lower bound). **Profit is not disclosed anywhere.**

**Late test:** days from the transaction date to the filing date (House: the index FilingDate; Senate: the eFD submission date) greater than 45, per 5 U.S.C. 13105(l). This is a mechanical, face-of-filing test. It does not account for typos, pre-service transactions, or non-covered assets, and it is not an Ethics Committee finding.

**Aggregators:** Capitol Trades, Quiver Quantitative, and Unusual Whales were used only as leads. No aggregator figure appears in the outputs. Anyone reproducing this work can use `trading-transactions.csv`, where each row carries its official filing URL.

**Scripts (reproducible):** `trading/parse_house.py`, `trading/parse_senate.py`, `trading/tally.py`, `trading/outputs.py`. Raw files: `trading/house/pdf2025|2026`, `trading/senate/ptr/`.
