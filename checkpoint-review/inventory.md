# Checkpoint inventory — c60dc5d193afacfcc8afcab5b8d328ec5debcf2b
Commit: "10:01 PM MDT, September 23, 2026. Full site checkpoint." (author timestamp 2026-09-24T04:01:54Z = 10:01 PM MDT Sep 23)

## Content pages / data files (factual payload)

| Path | Role |
|------|------|
| `src/lib/ledgers.ts` | **Fake News** claim/truth table (`mediaFrames`, ~115 rows + MEDIA_RAN duration notes); **Democrats ledger** (`demFrames`, 27); **Republicans ledger** (`gopFrames`, 26); LEDGER_POSTS wrapping those into site posts |
| `src/lib/content.ts` | 62+ Dispatch essays (body blocks); Lawfare row tables on `the-hire-is-the-country` and `a-war-on-americans`; site metadata SITE/posts |
| `src/lib/scorecard.ts` | Midterm scorecard data: FAKE_NEWS, FRAMES, HOAXES, LEDGER eras, WAR/WARFARE essay text, border/debt/prices/charts stats |
| `src/lib/pump.ts` | “Pump” / sharing funnel copy |
| `src/lib/restored-files.ts` | Restored scorecard side files (suits, deals, COVID cell, etc.) |
| `src/components/lawfare-ledger.tsx` | Lawfare ledger UI + caption→line map |
| `src/components/midterm-scorecard.tsx` | Scorecard UI composing scorecard.ts tables/charts |
| `src/components/narrative-frames.tsx` | Narrative frame UI |
| `src/components/interactive-chart.tsx` | Chart/read toggle helpers |
| `src/components/era-compare.tsx` | Era comparison UI |
| `src/routes/*.tsx` | Routes: index, scorecard, archive, pump, dispatch, foreword, about, find-them, copyright |
| `ESSAYS.md` | Long-form essay dump (parallel to content.ts) |
| `REPEATS.md` | Notes on repeated claims |
| `public/sitemap.xml` | Published URL list (scorecard, archive, about, foreword, pump, ~55 dispatch HTML pages) |
| `UPLOAD-TO-NAMECHEAP/*.html` | Static export snapshot of main pages |

## Site structure worth keeping (non-content)

- Header nav: Dispatch / Scorecard / Archive / Pump / About / Foreword
- Claim | Truth two-column frames (they / tape)
- Lawfare ledger with caption / sold / evidence / file / source docs
- Midterm scorecard tabs (charts vs read) with Farm bars, Oval desks, debt/border modules
- InteractiveChart + KeptRead pattern
- Series grouping (Fake News Exposed, The Remedy, etc.)
- Share/OG image set (og-scorecard.jpg, x-article-*)

## Out of scope for fact audit

`.grok/` scaffolds, auth, multiplayer, package lock, images/binaries, DNS upload notes.
