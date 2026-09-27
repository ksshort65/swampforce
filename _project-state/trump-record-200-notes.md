# Trump record dataset — notes (prepared 2026-09-26, ~2:30 PM MT)

File: /workspace/_project-state/trump-record-200.csv — 175 rows after merging the user's 200 items (all 200 item numbers are accounted for in Merged_From).

## Counts by label and term
| Term | Verified | White House claim | Source being added | Total |
|---|---|---|---|---|
| Trump 1 | 40 | 2 | 33 | 75 |
| Trump 2 | 33 | 15 | 52 | 100 |
| All | 73 | 17 | 85 | 175 |

By category: Border & immigration 28, Family & other 28, Military & foreign policy 28, Jobs & economy 21, Health & VA 18, Paycheck & taxes 17, Energy 13, Trade 12, Law & justice 10

## Label rules used
- Verified: a government primary record is attached (congress.gov bill page, GovInfo law text, Federal Register EO/proclamation/rule, Supreme Court, FBI CDE, BLS, State Dept). Federal Register URLs came from one API lookup per item; congress.gov/GovInfo/supremecourt.gov/FBI URLs returned HTTP 200 on a check. bls.gov and state.gov returned 403 to the script (bot blocking; both URLs were already used on the old site's Oval list).
- Verified means the ACTION (law/EO/rule signed) is documented. It does not verify outcome claims in the same line (e.g. EO 14297 is verified; the "drug deals" results are not).
- White House claim: results/pledges supported only by White House statements (investment totals, record jobs, catch-and-release ended, asylum rate, "eight wars settled", etc.).
- Source being added: no source attached yet. Many are real actions that just need one primary link (Warp Speed, Remain in Mexico, Soleimani, al-Baghdadi, Iran deal exit, INF, Paris, Phase One, Section 301, Iran strikes 2025). Nothing was invented to fill them.

## Merges
Warp Speed 101/102/189; Abraham Accords 116/193/194/195; Jerusalem 117+196 and Golan 118+196 (196 split across both); unemployment lows 12/13/165/166; tariffs split by action: 74+159 (2018 steel/aluminum), 160 (2025 aluminum/steel/copper 50%), 161 (2025 autos), 158 (Section 301) and 75 (reciprocal) kept separate; COVID relief 186/187/188; SALT 11; investment pledges 67+163; stock records 66+164; manufacturing jobs 16+162; fraud/improper payments 88+89; workforce cuts 87+99; generics 24+176; vaccine recs 53+54; conscience rules 55+169; women's sports 48+49; Opportunity Zones 46+167; wall 103+181; Iran deal/maximum pressure 119+197; public lands 179+180. Items 1–9 are kept (already on wallet cards) so the dataset is complete.

## Items that looked inaccurate or need rewording (labeled 'Source being added')
- #9 "No tax on Social Security (seniors)": P.L. 119-21 does not end tax on Social Security benefits; it adds a temporary extra $6,000 deduction for people 65+ (2025–2028), phased out above $75k/$150k. The site wallet card already says this correctly. Suggested wording is in the CSV row.
- #97 "Mail-in voting EO; SCOTUS allowed": the elections EO exists, but I found no record that the Supreme Court allowed it; parts were blocked in lower courts per my knowledge. Needs a court source before publishing.
- #123 "Maduro capture claim": left unsourced; confirm with a DOJ/DoD record before publishing.
- #7/#8 tips/overtime: accurate only as capped, temporary deductions (not "no tax"); CSV wording reflects the law.
- #12/13/165/166: Black, Hispanic, Asian lows were series lows at the time (2019); disability series only starts 2008 and was not checked, so it is covered under the general line only. Later Black unemployment went lower (2023), so avoid "record" without "at the time".
- #27: kept the Oval-list FBI figure (2025 murder rate ~4.1, tied 1955–56; violent crime -9.3%); the list's "historic low claim" wording was replaced with the FBI figure.
- #67/#163 investment pledges: announcements; BEA counted about $232B new FDI in 2025 (per the earlier SwampForce research in the Grok chat). Not a verified $11–19T.

## Where the inputs were found
- Input A (the 200 list): I do not have a ReadTranscript tool in this worker, so t270u could not be read directly. /workspace/_incoming-from-user/trump-200-list/ holds only README.md (notes, no list). The full 200-item household-first list is in /workspace/_project-state/SwampForce-Grok-chat-Aug24-to-Sep24.txt lines 16850–17053 (HUMAN message 2026-09-23T01:29Z, "Add this to the trumpet effect"). It matches every duplicate number in the README (101/102/189, 116/193–195, 117/118/196, 74/158–161, 12/13/165/166), so it is the same list. A copy of the same chat is also in agent attachment 6e8dc643....txt.
- Input B (the sourced 74 + 55 Oval list): NOT found as a 129-line list. Searched: local clone /workspace/_gh-main-readonly (all history), fresh mirrors of ksshort65/swampforce (main + backup-2026-09-24 + backup-2026-09-26), swampforce-site, swampforce-namecheap, royal-marble-aurora-pine, bold-crystal-silver-reef; grok-build-chat JSON; checkpoint-review; site-from-checkpoint scorecard.html (Trump 1 desk says "Under review"; Trump 2 desk has 3 figures). What exists: TRUMP_TERMS (4 plus + 3 minus per term), OVAL_RECORD (15 essay rows), and src/lib/restored-files.ts DEALS (USMCA, Abraham Accords) and AT_HOME (TCJA, First Step, VA MISSION, Great American Outdoors, Families First/CARES) in ksshort65/swampforce commit 31a3391. Those sources were reused. If the 74/55 list lives only in the parent transcript or another chat, it needs to be supplied and merged in.
