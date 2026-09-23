# Swamp Force — chat record

Saved so a rollback cannot be the only copy of what was decided.
Do not delete site copy unless the owner uses a specific word that means delete.
Push to GitHub after every change.

Owner: Renee Stewart. Journal: Swamp Force. Repo: https://github.com/ksshort65/swampforce
Editor: editor@swampforce.com. Domain wanted: swampforce.com. Host fight: Namecheap, not a censored builder.

## The collapse

On September 23, 2026, uncommitted source was wiped with `git checkout` back to the September 21 commit. That was the collapse. Files recovered from the disk after that were committed. Some files were only fragments.

## What the page is supposed to do

The claim is the row. The short version opens a few lines, not a lecture. Each line links to the official record. The record opens the document. A statute is named first, then the number. The insurrection law, the oath, and New York’s election-conspiracy law follow that pattern. Same pattern on the lawfare chart, the slogan chart, the media chart, the pump, and the bill table.

## On the site now

- Cover is the midterm guide: vote the record, the lead, the files, the scorecard doors.
- Nav: Republic, Tape, Media, Democrats, Republicans, Congress, Border, Remedy, J6, Scorecard, Pump, Foreword.
- Essays and ledger posts are in `src/lib/content.ts` and `src/lib/ledgers.ts`.
- Lawfare chart, slogan chart, and media chart use the plain-language chart.
- Pump charts use the open chart and a short version.
- Bill rows name the law and say “The record.”
- Scorecard still shows Republicans, Democrats, Split, Oval, and Compare, plus hoaxes, border, benefits, and the bill lists.

## Still missing

These are not on the live page. They are not deleted from git if a copy was saved. They were not found as a complete file on disk.

1. Scorecard rooms that the pre-collapse page had, whose numbers were never found: signed deals, the at-home effect list, the lawsuit tiles, the term-by-term compare, the rail file, and the COVID-money-to-prisoners file. The page that displayed them is `recovered-pre-collapse/midterm-scorecard.pre-collapse.tsx`. The data objects `AT_HOME`, `RAIL`, `DEALS`, `SUITS`, `COVID_CELL`, `TERM_COMPARE`, `TERM_SIGNED`, and `EFFECT_FILES` are not in `src/lib/scorecard.ts`.
2. Data that is in `src/lib/scorecard.ts` but the live scorecard does not show: Oval desks (Four Ovals, Trump 1, Trump 2), `PAPERS`, `FAKE_NEWS`, `WARFARE`, and `FUNNEL`.
3. The J6 button goes to `/dispatch/the-media-ledger#j6`. No element has `id="j6"`, so the button opens the essay and does not land on a January 6 section.
4. Pump’s Charts and Read buttons go to `#charts` and `#read`. Those ids are not on the pump page.
5. Iran is not its own button. `sixty-percent` sits inside The Tape.
6. The pump page from before the collapse was only partly recovered. The cut-off copy is `recovered-pre-collapse/pump.partial.pre-collapse.tsx`. The live pump is the complete earlier page plus the short-version button.
7. This file is the chat record that could be written into the repo. The week of messages was not a file on disk, so it cannot be pasted back word for word.

## Snapshot

2:09 PM MDT, September 23, 2026. `main` matched GitHub before this note. No page was changed for this commit. The gap list above was still the gap list.


## Standing rule

Nothing on the site is erased unless the owner says the specific word. Every change is pushed to `main`.

