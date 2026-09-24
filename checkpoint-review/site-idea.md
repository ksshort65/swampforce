# Checkpoint site information architecture (c60dc5d · 9/23/2026)

Faithful rebuild note. Source: `repo/src/lib/{content,scorecard,ledgers,pump}.ts` + header/scorecard/ledger components. Do not invent new rooms.

## Brand / masthead
- **Name:** Swamp Force™ (`SITE.name`) · domain swampforce.com
- **Kicker (header right):** “Vote the file. Not the feeling.”
- **Tagline / closer:** government-source journal; compare action to speech
- **Author / copyright:** Renee Stewart · © 2026

## Primary navigation (`site-header.tsx`)
Sticky header. Two bands: brand+kicker, then nav.

| Control | Target | Purpose |
|---------|--------|---------|
| **Swamp Force** mark | `/` | Home / cover |
| **JOURNAL section menus** | `/dispatch/$slug` | Dropdowns from `JOURNAL` in `content.ts` (multi-slug = `<details>` menu; single-slug = direct link). Labels strip leading “The ”. |
| **J6** | `/dispatch/the-media-ledger#j6` | Shortcut into media ledger Jan-6 hash |
| **Scorecard** | `/scorecard` | Midterm Congressional Scorecard (`MidtermScorecard`) |
| **Pump ▾** | `/pump#charts` · `/pump#read` | Charts vs Read (EIA/FRED gas funnel) |
| **Foreword** | `/foreword` | Site foreword |

`JOURNAL` series (nav order):
1. **The Republic** — employer/constitutional framing essays  
2. **Fake News Exposed** — media ledger + caption-vs-file essays (~16 slugs)  
3. **Democrats** → `the-democrat-ledger`  
4. **Republicans** → `the-republican-ledger`  
5. **Congress** — purse / recess / bill-writing essays  
6. **The Border** — encounters, FEMA, missing children, ICE  
7. **The Remedy** — judges, taxpayer bills, statute  

(~62 dispatch slugs total in `content.ts`.)

Inventory also lists Archive / About / Find-them / Copyright as routes in the full app; header at this checkpoint emphasizes Dispatch series + Scorecard + Pump + Foreword.

## Page purposes

| Page | Role | Data shape |
|------|------|------------|
| **Home** | Cover / entry | Points into journal + scorecard |
| **Dispatch `/dispatch/$slug`** | Long-form essays | `content.ts` post bodies; some embed Lawfare tables (`lawfare-ledger.tsx`) or narrative frames |
| **Media / Dem / GOP ledgers** | Claim \| Truth two-column frames | `ledgers.ts` → `MEDIA_LIES` / dem+gop frames wrapped as `LEDGER_POSTS` |
| **Scorecard `/scorecard`** | Living midterms card (`SCORE_UPDATED=2026-09-23`) | Large typed modules in `scorecard.ts` composed by `midterm-scorecard.tsx` |
| **Pump `/pump`** | Gas/price “pump” funnel | `pump.ts` (EIA weekly/annual + FRED); Charts vs Read hashes |
| **Foreword** | Editorial frame | Static copy |

## Scorecard rooms (keep these tabs)
`SCORE_TABS` / `ScoreRoom`:
1. **Republicans (gop)** — bills passed; debt added  
2. **Democrats (dem)** — bills passed; border opened  
3. **Split** — one chamber each; largest debt slice  
4. **The Oval** — four presidents; Trump 1 / Trump 2 sub-desks (`OVAL_DESKS`: four / trump1 / trump2)  
5. **Side by side (compare)** — helped vs hurt  

Oval desk sub-nav: Four Ovals · Trump 1 (FY2017–20) · Trump 2 (FY2025–).

## Scorecard data modules (rebuild checklist)
Numeric / ledger blocks in `scorecard.ts` (preserve names & cite hrefs):

**Money / Congress:** `DEBT_NOW`, `DEBT_TALLY`, `DEBT_MATH`, `DEBT_BY_OVAL`, `DEBT_BY_TERM`, `DEBT_WHY`, `THE_LOSS`, `PURSE`, `PARTY_SPEND`, `TAX_MOVES`, `CAPACITY`, `DRIVERS`, `RECORD`, `MAJORITY`, `FAILURE`, `LEG_BRANCH*`, `HEARING_ABSENCE`, `IMPOSSIBLE`

**Farm / worker / prices:** `FARM`, `PRICES`, `CPI_PEAK`, `BENEFITS`, `WORKER`, `FUNNEL`

**Border:** `ENCOUNTERS`, `BORDER`, `BORDER_MOVE`, `BORDER_HARM`, `ALIENS`

**Era / narrative tables:** `OBAMA_TERMS`, `TRUMP_TERMS`, `OVAL`, `OVAL_NOW`, `OVAL_LINKS`, `OVAL_RECORD`, `LAWS`, `HOAXES`, `PAPERS`, `WARFARE`, `FAKE_NEWS`, `FRAMES`, `WAR`, `LEDGER`, `CHARTS`, `COMPARE_*`, `TAB_CHARTS`, `OVAL_DESK_CHARTS`, `FILE_CHIPS`, `SCORE_ROWS`, `ROLL_1964`

UI patterns to keep:
- Claim \| Truth two-column frames (`narrative-frames.tsx`)
- Lawfare ledger: caption / sold / evidence / file / sources (`lawfare-ledger.tsx`)
- Charts vs Read toggle (`interactive-chart.tsx` + Pump hashes)
- Era compare (`era-compare.tsx`)
- Farm bars, Oval desks, debt/border modules on scorecard

## Content tone constraints (for rebuild fidelity)
- Short declarative lines; dollar and encounter figures tied to official hrefs on the same row when present.
- Majority control = Article I purse framing (not Oval-only blame).
- “Encounter” defined in `ENCOUNTERS` as CBP meeting a person not making a lawful entry.
- Do not silently drop cite `href`s when porting modules.

## Out of scope for IA (not content)
Auth, multiplayer, `.grok/` scaffolds, Namecheap upload notes, image binaries.
