import json
S='essay_edits/'
def w(slug,status,fixes,edits,ourview=(),keep=(),quote_keep=(),held_reason='',dek_opinion=True):
    json.dump(dict(status=status,fixes=fixes,edits=edits,ourview=list(ourview),keep_links=list(keep),quote_keep=list(quote_keep),held_reason=held_reason,dek_opinion=dek_opinion),open(S+slug+'.json','w'),indent=1,ensure_ascii=False)
CF='Cleared with fixes'
w('the-noise',CF,["Gallup 10%/86% approval figures cut (private poll, not a primary record)","'Least productive' claim cut (GovTrack is not a primary record; no congress.gov count linked)","Budget-deadline claim tied to CRS: FY1997 was the last year all regular appropriations were enacted on time"],
[[" Gallup, April 2026: ten percent approve of Congress. Eighty-six percent disapprove. That is not a branding problem. That is a shop"," That is a shop"],
["The 118th Congress sat among the least productive modern sessions. The 119th still owes twelve money bills by October 1 — a deadline they have not met on time since the Clinton years.","The 119th still owes twelve money bills by October 1 — a deadline Congress has not met on time for every bill since fiscal 1997, per the [Congressional Research Service](https://www.congress.gov/crs-product/IN12324)."],
["- GovTrack — 118th among the least productive modern Congresses — https://www.govtrack.us/congress/bills/statistics\n",""]],
ourview=["They do not fail at talking","They will say the other jersey"])
w('they-sold-the-split',CF,["MRC '92 percent negative' figure cut (advocacy-group count, not a primary record)"],
[[" MRC logged 92 percent negative coverage of the 2025 term in the first hundred days on the big three. That is not weather. That is a business model:"," That is a business model:"]],
ourview=["A country with a real argument","Politicians learned the same trick","This journal will not answer"])
w('full-time-or-go-home',CF,["Member salary corrected to $174,000 (CRS RL30064), not $174,500","Pension and office allowance stated precisely (FERS vesting after five years; House office allowances roughly $1.85–$2.09 million in 2025)"],
[["A member’s $174,500 is the decoy.","A member’s $174,000 salary is the decoy."],
["plus a pension after five years, plus health coverage, plus a million-dollar office allowance,","plus a pension after five years of service, plus health coverage, plus an office allowance of roughly $1.85 million to $2.09 million per House office,"]],
ourview=["No other job in this country","House and Senate rules can require"])
w('the-recess-blockade',CF,["Noel Canning holding stated in the Court's words (a recess of fewer than ten days is presumptively too short); link moved to the slip opinion"],
[["said a valid recess lasts at least ten consecutive days, and the Senate decides when it is in session.","held that a recess of fewer than ten days is presumptively too short to trigger the Recess Appointments Clause, and that the Senate is in session when it says it is, if it keeps the ability to do business."],
["(https://supreme.justia.com/cases/federal/us/573/12-1281/)","(https://www.law.cornell.edu/supct/pdf/12-1281.pdf)"],
["Trump now: 0, because","Trump now: 0 as of this writing, because"]],
ourview=["The Framers wrote"])
w('the-line-in-the-sand',CF,["'They killed it' corrected: the SAVE Act passed the House April 10, 2025; the Senate has not taken it up","Pew 83% and Gallup 84% voter-ID figures cut (private polls; both links dead)"],
[["They still killed it. [Pew, August 2025: 83%](https://www.pewresearch.org/politics/2025/08/13/views-of-the-2024-election-and-voting/) and [Gallup, October 2024: 84%](https://news.gallup.com/poll/651905/solid-majority-supports-voter-identification-laws.aspx) wanted voter ID. The machine did not.","The House passed it on April 10, 2025. The Senate has not taken it up."],
["The SAVE Act was the tell. Citizenship to vote. They killed it anyway.","The SAVE Act was the tell. Citizenship to vote. The Senate still sits on it."]],
ourview=["Swamp Force exists because","The split in this country","Until the rolls"])
w('the-uniparty-mirror',CF,["FISA 702 sunset updated: the April 20, 2026 sunset passed; Congress extended it only to June 12, 2026 (S. 4465, P.L. 119-87); a further extension (H.R. 9238) failed in the House on June 11"],
[["The sunset is April 20, 2026 — they will try it again.","The sunset was April 20, 2026. Congress passed a short extension to June 12 ([S. 4465](https://www.congress.gov/bill/119th-congress/senate-bill/4465)); a further extension ([H.R. 9238](https://www.congress.gov/bill/119th-congress/house-bill/9238)) failed in the House on June 11. They will try it again."]],
ourview=["They need the country in a jersey","That is not a sporting event"])
