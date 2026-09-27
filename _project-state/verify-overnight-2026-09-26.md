# Overnight verification, 2026-09-26 (run ~1:45-2:30 AM MT). Only the links SuperGrok gave (or the homepage's own links) were opened. No site content changed, nothing deployed or posted.

## 1. Homepage numbers (public_html/index.html)
- 10.83M "CBP nationwide encounters, FY2021–24" — CONFIRMED. https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics, row "Total Enforcement Encounters": FY21 1,956,519 + FY22 2,766,582 + FY23 3,201,144 + FY24 2,901,142 = 10,825,387.
- 8.73M "at the southwest land border" — WRONG, should be 8.72M. CBP "Southwest Land Border Encounters" CSV https://www.cbp.gov/sites/default/files/2024-10/sbo-encounters-fy21-fy24.csv (linked from cbp.gov/document/stats/southwest-land-border-encounters), my sum: FY21 1,734,686 + FY22 2,378,944 + FY23 2,475,669 + FY24 2,135,005 = 8,724,304 (SuperGrok's 8,724,290 also rounds to 8.72M).
- $174,000 base salary, "leaders are paid more" — CONFIRMED. https://www.congress.gov/crs-product/RL30064: "The compensation for most Senators, Representatives, Delegates, and the Resident Commissioner from Puerto Rico is $174,000. The only exceptions include the Speaker of the House (salary of $223,500)…"; leaders $193,400.
- $7.258B legislative branch FY2026, P.L. 119-37 — CONFIRMED. https://www.congress.gov/crs-product/R48612: "Total legislative branch funding in P.L. 119-37 … is $7.258 billion (+7.6% including both divisions)"; table grand total $7,258,022 (thousands); enacted Nov 12, 2025. (SuperGrok's $7,258,196,000 / R43397/R49049 not checked; the homepage cites R48612, which I checked.)
- $40.09T national debt, Sep 17, 2026 — CONFIRMED. Treasury fiscaldata API debt_to_penny, record_date 2026-09-17, tot_pub_debt_out_amt = $40,093,343,468,150.50.
- Party split $11.00T R / $9.57T D / $15.37T split (Jan 3, 1993 to Sep 17, 2026) — CONFIRMED (arithmetic + spot checks). The 103rd–119th rows in midterm-data/debt_by_control.json add to 10,997.5 / 9,567.3 / 15,373.6 $B = 35,938.4 = 40,093.3 − 4,154.9. The API spot checks match: 2023-01-03 $31,351,186,121,029.94 and 2025-01-03 $36,164,146,727,045.82 (118th row 4,813.0 and 119th row 3,929.2). Note: the Jan 3, 1993 start is NOT a Debt to the Penny value (the daily series starts 4/1/1993). The site says so and uses a straight-line estimate between the FY1992 and FY1993 year-end totals.
- Round 4 §2 inauguration-day values (not on homepage; checked against the API) — CONFIRMED all 9: 1993-04-01 4,225,873,987,843.44; 1997-01-21 5,310,267,076,516.85; 2001-01-19 5,727,776,738,304.64; 2005-01-20 7,613,215,612,328.37; 2009-01-20 10,626,877,048,913.08; 2013-01-18 16,432,619,424,703.06; 2017-01-20 19,947,304,555,212.49; 2021-01-20 27,751,896,236,414.77; 2025-01-17 36,206,593,315,575.15. The pre-1993 fiscal-year values were not checked (different dataset, not on homepage).
- $233–521B fraud per year, GAO-24-105833 (FY2018–22) — NEEDS SUPERGROK. gao.gov returns 403 to both WebFetch and curl.
- FY1997 "Last year all 12 spending bills passed on time", CRS IN12324 — CONFIRMED (year), with a wording flag. https://www.congress.gov/crs-product/IN12324: "since FY1997, the last time all regular appropriations were enacted by the October 1 start of the fiscal year." Flag: CRS does not say "12". FY1997 had 13 regular bills (12 only since FY2008). Suggested wording: "all regular spending bills".
- FY2001 "Last budget surplus" (homepage links cbo.gov/data/budget-economic-data) — NEEDS SUPERGROK. SuperGrok gave no URL for OMB Table 1.1 or the Treasury figure, and the CBO page is a data index that would need digging.
- Not on the homepage, so not checked (in scope only if used elsewhere): 146,000/145,000 children, CBO 101%→120%→175%, GAO-25-107753 $162B, the April 15 budget target, days in session (the homepage gives no number, only a link), and Patel's 1,100.

## 2. SCOTUS PDFs (public_html/docs/scotus/). All downloaded from the given supremecourt.gov/opinions/ URLs (HTTP 200, application/pdf). Case name, docket and decision date on page 1 (slip opinions) or page 2 (preliminary prints) all match. Not wired into any page.
- Already present: 26a308-dhs-v-league-of-women-voters-2026-09-25.pdf
- 23-719-trump-v-anderson-2024-03-04.pdf — OK ("TRUMP v. ANDERSON et al., No. 23–719 … Decided March 4, 2024")
- 23-939-trump-v-united-states-2024-07-01.pdf — OK
- 19-465-chiafalo-v-washington-2020-07-06.pdf — OK
- 19-715-trump-v-mazars-2020-07-09.pdf — OK for Mazars (bundled with No. 19–760 Trump v. Deutsche Bank). PROBLEM: Vance (19-635) is NOT in this PDF. The opinion cites it separately as "Trump v. Vance, 591 U. S. 786". Vance needs its own PDF (NEEDS SUPERGROK).
- 20-366-trump-v-new-york-2020-12-18.pdf — OK
- 19-1257-brnovich-v-dnc-2021-07-01.pdf — OK (together with 19-1258)
- 21-1086-allen-v-milligan-2023-06-08.pdf — OK
- 21-1271-moore-v-harper-2023-06-27.pdf — OK
- 22-807-alexander-v-sc-naacp-2024-05-23.pdf — OK
- 23-5572-fischer-v-united-states-2024-06-28.pdf — OK
- 25-332-trump-v-slaughter-2026-06-29.pdf — OK
- 24-621-nrsc-v-fec-2026-06-30.pdf — OK (the holding has not been read yet, per the lead)

## 3. New case leads (rounds 12–17, 21–22, keep/strong only). None of these had an exact official URL for BOTH the speaker's words and the record, so under the credit-saving rule nothing was researched. All are HOLD – NEEDS SUPERGROK; the question for each is below.
- R12 Harris fracking (8/29/2024 vs 9/4/2019 town hall + 2020 VP debate) — HOLD, NEEDS SUPERGROK (no transcript URLs)
- R12 Trump "biggest tax cut in history" vs Treasury OTA WP 81 — HOLD, NEEDS SUPERGROK (no quote URL or OTA URL)
- R12 Trump "passed VA Choice" vs P.L. 113-146 (8/7/2014) — HOLD, NEEDS SUPERGROK (no dated Trump quote URL)
- R12+R14 Fox/Gingrich Seth Rich (May 2017) + Fox retraction — HOLD, NEEDS SUPERGROK (no retraction text or docket URL)
- R13 Spicer 1/21/2017 inauguration crowd — HOLD, NEEDS SUPERGROK (no WH transcript or WMATA URL)
- R13 Clinton 7/3/2016 "marked classified" vs Comey 7/5 and 7/7/2016 — HOLD, NEEDS SUPERGROK (no fbi.gov or hearing URLs)
- R13 Trump 1/10/2019 "never said… write out a check" vs 2015–16 quotes + CRS IN11675 — HOLD, NEEDS SUPERGROK
- R13 Trump Iraq "I was against" vs Stern 9/11/2002 — HOLD, NEEDS SUPERGROK (no debates.org or audio URL; Stern audio isn't a government source)
- R14 Rittenhouse race errors (Independent; Cooney/NatGeo) — HOLD, NEEDS SUPERGROK + needs an official record of the victims' race
- R14 Rittenhouse rifle "across state lines" (Reuters, WaPo corrections) — HOLD, NEEDS SUPERGROK
- R14 @WHO 1/14/2020 tweet vs Van Kerkhove briefing — HOLD, NEEDS SUPERGROK
- R14 Carlson Nov 2020 GA "dead voters" — HOLD, NEEDS SUPERGROK (no GA SoS/county record URL)
- R14 Greg Kelly/Newsmax 5/8/2023 wrong Allen TX photo — HOLD, NEEDS SUPERGROK
- R14 Joy Reid 11/9/2020 "538" vs certified 537 — HOLD, NEEDS SUPERGROK (she self-corrected; minor)
- R14 Trump 11/27/2016 popular vote "millions… voted illegally" vs FEC 2016 results — HOLD, NEEDS SUPERGROK
- R14 MSNBC AM Joy 12/1/2019 Spencer photo — HOLD, NEEDS SUPERGROK
- R14 CNN "fiery but mostly peaceful" Kenosha chyron — HOLD, NEEDS SUPERGROK (date/host unresolved)
- R15 Biden 2/8/2024 "I did not" share classified info vs Hur report — HOLD, NEEDS SUPERGROK (no justice.gov PDF URL)
- R16 Trump 12/9 and 12/17/2025 "worst inflation in history" vs BLS CPI — HOLD, NEEDS SUPERGROK
- R16 Leavitt May 2025 "does not add to the deficit" vs CBO OBBBA — HOLD, NEEDS SUPERGROK
- R16 Leavitt "$50 million condoms in Gaza" — HOLD, NEEDS SUPERGROK (needs an official State statement)
- R16 Noem Oct 2025 "no American citizens… detained" vs 38 in her letter — HOLD, NEEDS SUPERGROK
- R16 Leavitt Feb 2025 GAO $2.7T as a DOGE find — HOLD, NEEDS SUPERGROK (exact quote needed)
- R16 DOGE "Wall of Receipts" vs GAO review — HOLD, NEEDS SUPERGROK (GAO report number needed)
- R16 Fox/Fox Business 8/18/2026 gas $4.13 vs EIA — HOLD, NEEDS SUPERGROK
- R17 Acosta 11/13/2024 "popular vote victory that did not occur" — HOLD, NEEDS SUPERGROK
- R17 Musk 10/19/2024 Michigan "extra ballots" vs MI Bureau of Elections — HOLD, NEEDS SUPERGROK
- R21 Trump "thousands cheering in Jersey City" — HOLD, NEEDS SUPERGROK (needs city/police statement URL)
- R21 Trump "murder rate highest in 45 years" vs FBI CIUS — HOLD, NEEDS SUPERGROK
- R22 Comey letter framed as "reopened" (Chaffetz 10/28/2016) — HOLD, NEEDS SUPERGROK (X post, can't be checked reliably; FBI Vault letter URLs needed)
- Balance note (not a verdict): the keep list leans toward Trump/administration statements in R12/13/16/21 and toward media/Dem items in R14/15/17. Every item was held to the same standard, and no balance was forced.

## Questions for SuperGrok
1. GAO-24-105833: gao.gov blocks automated fetches. Please give the direct PDF URL and the exact sentence with "$233 billion to $521 billion" and "fiscal years 2018 through 2022".
2. FY2001 surplus: give the official URL (OMB Historical Table 1.1 xlsx or CBO historical budget data file) and the exact FY2001 surplus value shown there. Is FY2001 the last surplus year in that table?
3. Trump v. Vance, No. 19-635 (7/9/2020): give the supremecourt.gov slip-opinion PDF URL. It is not in 591us2r60_lkgm.pdf, which is Mazars + Deutsche Bank only.
4. Harris fracking: give the official or primary transcript URLs for the 9/4/2019 CNN town hall line, the 10/7/2020 VP debate (debates.org) and the 8/29/2024 CNN interview, with the exact sentences.
5. Trump "biggest tax cut in history": give a dated WH/govinfo transcript URL with the exact words, plus the Treasury OTA Working Paper 81 URL and the table/line ranking ERTA 1981.
6. Trump VA Choice: give a dated WH or govinfo transcript URL with the exact words, and the congress.gov URL for H.R. 3230 (113th)/P.L. 113-146.
7. Fox/Seth Rich: give the URL of Fox's 5/23/2017 retraction statement text, and the court docket number/URL for the Rich family settlement.
8. Spicer 1/21/2017: give an official WH statement transcript or video URL with the exact words, plus a WMATA ridership release URL with the 2009/2013/2017 numbers.
9. Clinton classified: give the fbi.gov URL for Comey's 7/5/2016 statement with the exact "marked classified" sentence, the 7/7/2016 House Oversight hearing transcript URL (govinfo) with the page, and a primary URL for the 7/3/2016 Meet the Press quote.
10. Trump Mexico check: give C-SPAN URLs with timestamps for the 6/16/2015, 3/4/2016 and 7/29/2016 quotes, the 1/10/2019 quote source, and the CRS IN11675 URL with the $16.4B sentence.
11. Trump Iraq: give the debates.org 9/26/2016 transcript URL with the exact line. Is there a primary audio source for the Stern 9/11/2002 exchange?
12. Rittenhouse race: is there any court or police record stating the race of Rosenbaum, Huber and Grosskreutz? Give the URL and the exact line, plus the URLs of the Independent and NatGeo originals/corrections.
13. Rittenhouse rifle: give the Reuters and WaPo correction URLs with the exact correction text, and the trial record for where the rifle was kept.
14. WHO 1/14/2020: give the tweet URL/archive and the WHO transcript URL for Van Kerkhove's same-day remark, with the exact words.
15. Carlson GA dead voters: give the Georgia SoS or county record URL showing the named voter was alive, and a primary clip or transcript of the walk-back with its date.
16. Greg Kelly/Newsmax Allen TX: give the Newsmax apology URL/date and the Allen PD or TX DPS release naming the shooter.
17. Joy Reid 538: give a primary clip or transcript URL and the FL certified 2000 margin source (FL DOS or FEC).
18. Trump 11/27/2016: give the tweet archive URL with exact text and the FEC "Federal Elections 2016" URL with the popular-vote totals.
19. MSNBC Spencer photo: give a primary clip or apology URL with its date.
20. CNN "fiery but mostly peaceful": give the exact date, host/reporter and a primary clip URL, plus a Kenosha official damage record URL.
21. Biden ghostwriter: give the justice.gov Hur report PDF URL and page number for "shared information, including some classified information… with his ghostwriter", and the WH transcript URL for his 2/8/2024 remarks.
22. Trump "worst inflation": give the WH transcript URLs for 12/9 and 12/17/2025 with the exact words, and the BLS URL for Jan 2025 CPI 12-month 3.0%.
23. Leavitt deficit: give the WH briefing transcript URL/date with "does not add to the deficit", and the CBO OBBBA cost estimate URL with the exact deficit figure.
24. Leavitt condoms: give the WH briefing transcript URL with the exact words, and an official State Dept statement URL addressing it.
25. Noem citizens: give the primary URL for her Oct 2025 statement, the letter admitting 38, and the 2026 Senate hearing transcript URL.
26. Leavitt GAO $2.7T: give the briefing transcript URL with the exact quote, and the GAO report URL for the $2.7T since FY2003.
27. DOGE receipts: give the GAO report number/URL and the exact sentence saying the claims are "incorrect or lack supporting evidence".
28. Fox gas 8/18/2026: give a primary clip or correction URL, and the EIA weekly price for the week a year earlier (series URL + value).
29. Acosta 11/13/2024: give a primary CNN transcript URL, and the FEC or NARA 2024 official results URLs.
30. Musk Michigan: give the post archive URL, and the MI Bureau of Elections document URL with 7,297,900 active / 8,226,745 total registrations and its date.
31. Jersey City: give the Jersey City mayor's statement URL (official or primary) and the Trump 11/21/2015 rally / 11/22 ABC transcript URL.
32. Murder rate: give primary URLs for the 10/29 and 10/30/2016 remarks, plus the FBI CIUS 2015 table URL (rate 4.9) and the historical rate source for 1970/1980.
33. Comey "reopened": give the FBI Vault URLs for the 10/28 and 11/6/2016 letters, and a verifiable archive of the Chaffetz 10/28/2016 post with its exact text. Also, which named network used "reopens" on air or in print (URL, date)?
