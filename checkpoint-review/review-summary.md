# Checkpoint content audit summary (updated)

**Source commit:** `c60dc5d193afacfcc8afcab5b8d328ec5debcf2b`  
**Updated:** 2026-09-24 ~2:20 PM MDT — scorecard numeric spot-check + IA/candidates deliverables  
**Workdir:** `/workspace/checkpoint-review/`

## Outputs
| File | Role |
|------|------|
| `inventory.md` | Content inventory |
| `items.csv` | All extracted items (896); `Newly_Added` |
| `verified-items.csv` / `.xlsx` | Verdicts + `Newly_Added` (blue highlight in xlsx) |
| `catalog-candidates.csv` | 7 catalog-ready drafts (**catalog not edited**) |
| `candidates-ready.md` | URL recheck + wording notes for the 7 candidates |
| `site-idea.md` | Information architecture for faithful rebuild |
| `review-summary.md` | This file |
| `evidence/spotcheck/` | Treasury/CBP/USDA/NYC pulls from this pass |
| `evidence/mirrors/retry-results.json` | 401/403 retry log (prior) |
| `evidence/iaea-gov2025-50.pdf`, `iaea-gov2026-8.pdf`, `maduro-wt.pdf` | Opened primaries |

## Counts
| Bucket | N |
|--------|--:|
| Total items | 896 |
| Newly added (extraction pass) | 669 |
| Prior items (updated in place) | 227 |
| Catalog duplicates | 136 |
| Internal CP duplicates | 20 |

### Verdicts — all (after this scorecard spot-check)
| Verdict | N |
|---------|--:|
| Unverified | 599 |
| Verified | 158 |
| Verified with correction needed | 78 |
| Opinion | 61 |

*(Prior mid-day counts: Unverified 649 · Verified 110 · VwC 76 · Opinion 61.)*

## This pass (scorecard numerics + ship blockers)
1. **Scorecard spot-check vs official sources** — **~48 rows newly Verified**, **2 Verified with correction needed**, **0 hard fails**. Figures checked:
   - **Treasury** Debt to the Penny: **$40.09T** on 2026-09-17 (API).
   - **USDA ERS** (Sep 3, 2026): NFI **$158.4B**, expenses **$492.8B** / **$471.6B**, gov payments **$47.4B** / **$27.9B**, −**$4.3B** / +**$21.2B** / +**$19.5B**.
   - **BLS CPI**: June 2022 **9.1%**; Aug 2026 **3.4%**; Sep 2011 **3.9%**.
   - **CBP**: FY2021–24 encounters **10.83M**; FY2025 **691,906**; SW BP **237,538**.
   - **NYC Comptroller**: asylum shelter **$1.41B + $3.70B + $3.02B = $8.13B**.
   - **CBO** Outlook FY2026: receipts **$5.6T**, outlays **$7.4T**, deficit **$1.9T**, GDP **~$32T**; net interest **$970B / $1.039T**.
   - **SSA / CMS / FNS**: retired-worker **~$2,086** (Jul 2026); Part B **$202.90**; SSI avg **~$715** / FBR **$994**; SNAP **~$190 / ~$352**.
2. **`candidates-ready.md`** — all 7 candidates URL-checked; 4 primaries HTTP 200; Jan 6 DOJ 401 (use local/archive mirror); NYT Epstein 403 (use alternate); Maduro prefer WT PDF.
3. **`site-idea.md`** — nav, JOURNAL series, scorecard rooms/modules, data shapes for rebuild.
4. **Not touched:** term-split catalogs, `site/`, `site-v2/`, Namecheap.

## Catalog candidates (7)
Whips · Kids-in-cages photo misattribution · Jan 6 §2383 · Carter Page “spy” · FISA/dossier “scrupulously accurate” · Maduro “kidnapped” · Epstein murdered vs ME suicide.  
See `candidates-ready.md`. Item_ID blank. Term-split untouched.

## Remains (non-blocking for tonight’s rebuild)
- Hundreds of scorecard stats still Unverified (CHARTS/RECORD/LEDGER narrative cells, party debt tallies $10.96/$12.65/$16.48T, Chapter 12 farm filings, city migrant bills beyond NYC, etc.).
- CBO href `62050` on THE_LOSS may be wrong pub id (Outlook is 61882/62105) — flagged in CAPACITY notes.
- Epstein July 2025 memo still unopened (Cloudflare).
- Full Durham PDF body text.
