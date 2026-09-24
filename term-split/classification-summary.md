# Classification summary — term-split media deception spreadsheets

**Source:** `/workspace/trump-admin-false-claims-expanded-v2.md` (85 items)

**Built:** 2026-09-24


## Counts

| Spreadsheet | Count | Item IDs |
|-------------|-------|----------|
| First term (2017–2021) | **65** | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 33, 34, 35, 36, 37, 38, 39, 40, 41, 46, 49, 50, 51, 52, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85 |
| Later / second-term era | **20** | 16, 17, 18, 19, 24, 31, 32, 42, 43, 44, 45, 47, 48, 53, 54, 55, 58, 59, 73, 75 |
| **Total** | **85** | 1–85 (none dropped) |

## Column list (both spreadsheets)

1. `Claim`
2. `Truth_Source_URL`
3. `Who_Pushed_It`
4. `Approximate_Duration`
5. `Deception_Form`
6. `Category_Tag`
7. `Item_ID`
8. `Notes`

## Output paths

- `/workspace/term-split/first-term-trump-admin-media-deception.xlsx`
- `/workspace/term-split/first-term-trump-admin-media-deception.csv`
- `/workspace/term-split/later-second-term-trump-admin-media-deception.xlsx`
- `/workspace/term-split/later-second-term-trump-admin-media-deception.csv`
- `/workspace/first-term-media-deception.zip`
- `/workspace/later-second-term-media-deception.zip`

## Approximate_Duration unknown (`Not clearly documented`)

- **Count:** 17 items
- **First term:** [2, 12, 13, 25, 27, 29, 33, 35, 36, 46, 57, 77, 85]
- **Later:** [42, 43, 53, 55]

## Borderline classification decisions

- **#14** → **first** — Lafayette Square cleared so Trump could hold Bible photo-op
  - Event June 2020 (first term); IG report June 2021 — classified by event era
- **#24** → **later** — Biden 2024 debate / campaign recirculation of bleach and Charlottesville characterizations
  - 2024 campaign recirculation of bleach/Charlottesville — Later per instance rule
- **#26** → **first** — Durham findings vs “Spygate is a conspiracy theory” absolute dismissals
  - Durham report is May 2023, but item documents absolute dismissals of Crossfire Hurricane/FISA failures from first-term Russia probe era; Durham is the correcting finding (parallel to Mueller on collusion)
- **#38** → **first** — Washington Post: Russian hackers penetrated U.S. electric grid via Vermont utility
  - Dec 2016–Jan 2017 Vermont grid — incoming-admin Russia climate (included per 2016–17 rule)
- **#39** → **first** — Washington Post: Steele dossier key source identified as Sergei Millian (later removed)
  - WaPo Millian ID stories 2017/2019; large portions removed Nov 2021 — classified by story era not correction date
- **#57** → **first** — Tim Kaine: Trump said “all Mexicans are rapists”
  - Tim Kaine Aug 2016 campaign claim — pre-inauguration; preferred first term (not 2021+ Later bucket)
- **#58** → **later** — BBC Panorama: deceptive splice of Jan. 6 “fight like hell” speech
  - BBC Panorama edit aired ahead of 2024 election; apology Nov 2025 — Later instance
- **#60** → **first** — Washington Post: misquoted Trump on Georgia elections-investigator call
  - WaPo Georgia investigator story Jan 9, 2021 (still first term; Biden inaugurated Jan 20); correction Mar 2021
- **#72** → **first** — Washington Post: Cotton COVID lab-leak comments labeled “debunked conspiracy theory”
  - Cotton lab-leak WaPo piece Feb 2020 (COVID/first term); editor’s note June 2021 — classified by claim date
- **#75** → **later** — Paramount / CBS: $16M settlement over “60 Minutes” Harris interview editing
  - 60 Minutes Harris edits Oct 2024; Paramount settlement July 2025 — Later

## Classification rules applied

- **First term:** claims about first admin / events 2017–Jan 2021; 2016–17 incoming-admin Russia stories; Covington; COVID.
- **Later:** 2021–2024 claims about Trump as former president/candidate; 2025–2026 second-term admin; 2024 recirculations (bleach, Charlottesville) when instance is 2021+.
- Spanning items (e.g. Biden 2024 bleach) → Later.
- When unsure: prefer first for 2017–2020 events; Later for 2021+.

## Notes on URL picking

Truth_Source_URL prefers (in order): justice.gov / oversight.gov / SCOTUS, then FactCheck/PolitiFact/Snopes/AP/Reuters, then major outlet corrections.
