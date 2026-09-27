# SuperGrok fact-check verification: 2021–2024 block

Checked 2026-09-26, 12:39 PM MT. Only the supplied links and direct official links found on those pages were opened. No site files were edited.

## Duplicate scan

Command used first (excluding `public_html`, `shots`, and `_snap*`):

```sh
rg -i -n -g '!**/public_html/**' -g '!**/shots/**' -g '!**/_snap*' \
  -e '1\.7 trillion' -e '9% when I came' -e 'first time in 10 years' \
  -e 'debt in half' -e '18 million' -e 'dead voters' \
  -e 'Two people that were dead' -e 'border czar' -e 'transitory' \
  /workspace/site-from-checkpoint
```

Matches outside excluded paths:
- `midterms.py:126`: “about $1.7 trillion added to deficits” (CARES Act/CBO; unrelated to Biden’s claim) — not a duplicate of case 1.
- `journal-data/essay-facts.json:1334`: “Inflation is transitory...” — duplicate of case 3.
- No matches for the other requested strings.

## Results

| Case | Verdict | Exact quote as found | Official sentence/number | Working URLs | Dup status |
|---|---|---|---|---|---|
| 1. Biden, 1/26/2023 deficit/debt | **VERIFIED-MISLEADING** | “As a result, the last two years — my administration — we cut the deficit by $1.7 trillion, the largest reduction in debt in American history” | Treasury: “During FY 2022, the deficit fell by $1.4 trillion—the largest one-year decrease in the Federal deficit in American history.” Treasury also says: “Total Federal borrowing from the public increased by $2.0 trillion during FY 2022 to $24.3 trillion.” The deficit reduction is real, but “reduction in debt” is contradicted by the rise in borrowing/debt. | White House archive: https://bidenwhitehouse.archives.gov/briefing-room/speeches-remarks/2023/01/26/remarks-by-president-biden-on-economic-progress-since-taking-office/ ; Treasury: https://home.treasury.gov/news/press-releases/jy1043 | One unrelated `$1.7 trillion` hit (CARES Act); no exact duplicate. |
| 2. Biden, Nov. 2022 Social Security/debt | **VERIFIED-FALSE** | “And on my watch, for the first time in 10 years, seniors are getting an increase in their Social Security checks.” Also: “We cut the federal debt in half.” | SSA COLA history: 2012 1.7%; 2013 1.5%; 2014 1.7%; 2015 0.0%; 2016 0.3%; 2017 2.0%; 2018 2.8%; 2019 1.6%; 2020 1.3%; 2021 5.9%. Thus increases occurred repeatedly within the claimed decade. Treasury says borrowing from the public increased $2.0 trillion to $24.3 trillion in FY2022, not debt cut in half. | CNN: https://www.cnn.com/2022/11/05/politics/fact-check-biden-midterms-2022 ; SSA: https://www.ssa.gov/oact/cola/colaseries.html ; Treasury: https://home.treasury.gov/news/press-releases/jy1043 | No requested-string match. |
| 3. “Transitory” inflation | **HOLD** — forecast; per rule, no verdict on forecasts. | “Inflation is transitory.” (The supplied case gives no statement URL.) | N/A for a forecast verdict. Context only: BLS says, “Over the 12 months ended June 2022, the Consumer Price Index for All Urban Consumers increased 9.1 percent.” That later outcome does not itself adjudicate a forecast. | BLS context: https://www.bls.gov/opub/ted/2022/consumer-prices-up-9-1-percent-over-the-year-ended-june-2022-largest-increase-in-40-years.htm | Exact duplicate in `journal-data/essay-facts.json:1334`. |
| 4. Trump/Raffensperger, Georgia dead voters | **HOLD** — no government/agency/court record was found on the supplied AP page. | “The actual number were two,” Raffensperger told the president. “Two. Two people that were dead that voted. So that’s wrong.” | N/A: AP supplies the account, but the page exposes no Georgia SOS or Jan. 6 committee government link to serve as the required official record. | AP: https://apnews.com/article/capitol-riot-trump-election-lies-explainer-816a43ed964e6d35f03b0930e6e56c82 | No requested-string match. |
| 5. Biden, “9% when I came to office” | **VERIFIED-FALSE** | “It was 9% when I came to office, 9%.” | BLS: January 2021 CPI-U year-over-year inflation was **1.4%**; June 2022 was **9.1%**. The 9.1% record says that was the largest 12-month increase since November 1981. | FactCheck: https://www.factcheck.org/2024/05/factchecking-biden-on-inflation-other-claims/ ; BLS Jan. 2021/Oct. 2022 table: https://www.bls.gov/opub/ted/2022/consumer-prices-up-7-7-percent-over-year-ended-october-2022.htm ; BLS June 2022: https://www.bls.gov/opub/ted/2022/consumer-prices-up-9-1-percent-over-the-year-ended-june-2022-largest-increase-in-40-years.htm | No requested-string match. |
| 6. Biden, “inject bleach” / Trump never created jobs | **HOLD** — judgment-heavy; no clean official record on the supplied page establishes both claims as framed. | “He’s never succeeded in creating jobs and I have never failed.” Biden’s wording: Trump “would tell people, inject bleach.” | N/A for a clean official adjudication under the allowed links. The fact-check page records Trump’s actual wording about disinfectant and injection as different from “inject bleach,” but this case remains HOLD per rule. | FactCheck: https://www.factcheck.org/2024/05/factchecking-biden-on-inflation-other-claims/ | No requested-string match. |
| 7. Biden, “18 million” to “under 1.6 million” | **VERIFIED-MISLEADING** | “Two years ago this week, 18 million people were out of work ... Now the — that number is under 1.6 million, near the lowest level in decades.” | The official unemployed counts cited from BLS are about **10.2 million in January 2021** and **5.7 million in December 2022**. The 18M/under-1.6M comparison was UI-benefit recipients, not total unemployed; BLS/DOL distinction: UI information “cannot be used as a source for complete information on the number of unemployed.” | FactCheck: https://www.factcheck.org/2023/01/bidens-misleading-unemployment-statistic/ ; BLS link present on that page (Table A-15): https://www.bls.gov/news.release/empsit.t15.htm | No requested-string match. |
| 8. Trump, “20% mail ballots fraudulent” in Pennsylvania | **HOLD** — no statement link supplied, and no official record can be checked under the link restriction. | N/A (no supplied statement link). | N/A. | No source link supplied. | No requested-string match. |
| 9. Trump ad, “border czar” / “over 10 million” | **HOLD** — mixed claim and category mismatch; CBP records encounters, not unique people remaining in the country. | “This is America’s border czar and she’s failed us.” The ad graphic says “over 10 million illegal border crossings”; narrator says “under Harris, over 10 million illegally here.” | CBP: “Encounter data includes U.S. Border Patrol Title 8 apprehensions, Office of Field Operations Title 8 inadmissibles, and all Title 42 expulsions...” The linked FY2021–FY2024 AOR CSV sums to **10,825,387 encounters**, but that is not a count of unique people or proof that all remained. No verdict assigned under the requested mixed-claim rule. | FactCheck: https://www.factcheck.org/2024/08/trump-tv-ad-repeats-false-border-czar-illegal-immigration-claims/ ; CBP: https://www.cbp.gov/document/stats/nationwide-encounters ; direct CBP CSV found on that page: https://www.cbp.gov/sites/default/files/2024-10/nationwide-encounters-fy21-fy24-aor.csv | No requested-string match. |

## Notes

- The supplied White House URL returned 404; the explicitly permitted same-path Biden White House archive URL worked.
- The AP page was readable via the exact URL, but no official Georgia SOS or govinfo link was present on that page; case 4 therefore remains HOLD.
- No files under `/workspace/site-from-checkpoint` were edited.
