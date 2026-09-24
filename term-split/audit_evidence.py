#!/usr/bin/env python3
"""Parallel evidence audit for all term-split rows."""
from __future__ import annotations
import csv, json, re, time, concurrent.futures
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from collections import Counter

TS = Path("/workspace/term-split")
OUT = TS / "audit-results.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

def load_all():
    rows = []
    for term, fn in [
        ("first", "first-term-trump-admin-media-deception.csv"),
        ("later", "later-second-term-trump-admin-media-deception.csv"),
    ]:
        with open(TS / fn, encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                claim = r["Claim"]
                began = ended = ""
                m = re.search(r"\n\s*Began:\s*(.*?)\s*\|\s*Ended:\s*(.*)$", claim, re.S)
                if m:
                    began, ended = m.group(1).strip(), m.group(2).strip()
                    claim = claim[: m.start()].strip()
                rows.append({**r, "_term": term, "_claim": claim, "_began": began, "_ended": ended})
    return rows

def fetch(url: str, timeout: int = 18) -> dict:
    url = (url or "").strip()
    out = {"url": url, "ok": False, "status": None, "final_url": url, "text": "", "error": None}
    if not url:
        out["error"] = "empty"
        return out
    try:
        req = Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml"})
        with urlopen(req, timeout=timeout) as resp:
            out["status"] = getattr(resp, "status", 200)
            out["final_url"] = resp.geturl()
            raw = resp.read(500_000)
            out["text"] = raw.decode("utf-8", errors="ignore")
            out["ok"] = True
    except HTTPError as e:
        out["status"] = e.code
        out["error"] = f"HTTP {e.code}"
        try:
            out["text"] = e.read(200_000).decode("utf-8", errors="ignore")
        except Exception:
            pass
    except Exception as e:
        out["error"] = str(e)[:200]
    return out

def classify_evidence_level(r: dict, page_text: str) -> str:
    tag = (r.get("Category_Tag") or "").lower()
    ended = (r.get("_ended") or "").lower()
    notes = (r.get("Notes") or "").lower()
    blob = " ".join([tag, ended, notes, page_text[:8000].lower()])
    url = (r.get("Truth_Source_URL") or "").lower()

    proven_signals = [
        r"\bpants on fire\b", r"\bpants-on-fire\b", r"\bfour pinocchio", r"\b4 pinocchio",
        r"\bmostly false\b", r"\brated false\b", r"\bwe rate .+ false\b", r"\brating:\s*false\b",
        r"\bfalse\b.*\brating\b", r"\bretract", r"\bapology\b", r"\bregrets the error\b",
        r"\bsettlement\b", r"\bsettled\b", r"\bdurham\b", r"\bmueller report\b",
        r"\binspector general\b", r"\bfec\b.*\bfine\b", r"\bcourt\b.*\brul",
    ]
    # Category tag shortcuts
    if "pants" in tag or tag.startswith("false") or "retracted" in tag:
        # viral fake; false → Proven false unless only "misleading"
        if tag.startswith("misleading") and "false" not in tag.split(";")[0]:
            pass
        else:
            if "misleading" == tag.split(";")[0].strip() or tag.startswith("misleading /") and "false" not in tag:
                return "Rated misleading"
            return "Proven false"
    if any(re.search(p, blob) for p in proven_signals):
        # Avoid Half True / Mostly True counting as proven
        if re.search(r"\bhalf true\b|\bmostly true\b|\bthree pinocchio|\b2 pinocchio|\btwo pinocchio", blob) and not re.search(
            r"\bfalse\b|\bpants|\bfour pinocchio|\bretract|\bsettlement", blob
        ):
            return "Rated misleading"
        return "Proven false"

    misleading_signals = [
        r"\bmisleading\b", r"\bmissing context\b", r"\bomitted context\b", r"\bhalf true\b",
        r"\bthree pinocchio", r"\blacks context\b", r"\bstretches\b", r"\bexaggerat",
    ]
    if "misleading" in tag or any(re.search(p, blob) for p in misleading_signals):
        return "Rated misleading"
    # FactCheck.org often uses "misleading" without False rating
    if "factcheck.org" in url:
        if re.search(r"\bfalse\b", blob):
            return "Proven false"
        return "Rated misleading"
    # Default: if Category_Tag says false
    if "false" in tag:
        return "Proven false"
    return "Rated misleading"

def classify_proof_basis(r: dict, page_text: str, primary_url: str) -> str:
    ended = (r.get("_ended") or "").lower()
    notes = (r.get("Notes") or "").lower()
    url = (primary_url or r.get("Truth_Source_URL") or "").lower()
    blob = " ".join([ended, notes, page_text[:6000].lower(), url])

    official = any(
        x in url
        for x in (
            "justice.gov", "fbi.gov", "fec.gov", "gao.gov", "cbo.gov", "bls.gov", "cms.gov",
            "whitehouse.gov", "federalregister.gov", "supremecourt.gov", "courtlistener",
            "govinfo.gov", "archives.gov", "irs.gov", "treasury.gov", "state.gov",
            "senate.gov", "house.gov", "congress.gov", "ssa.gov",
        )
    ) or any(
        k in blob
        for k in (
            "durham report", "mueller report", "inspector general", "fec fine", "settlement",
            "consent decree", "court ruled", "district court", "supreme court",
        )
    )
    # Settlement reported by major outlet still counts as official-record report of settlement
    if "settlement" in ended or "settlement" in notes:
        return "Official record"
    if official and any(k in blob for k in ("durham", "mueller", "settlement", "fec", "court", "ig report", "inspector")):
        return "Official record"
    if any(x in url for x in ("justice.gov", "fec.gov", "federalregister.gov", "whitehouse.gov", "govinfo.gov")):
        return "Official record"

    outlet_corr = any(
        k in blob
        for k in (
            "retract", "editor's note", "editors note", "correction:", "we regret", "regrets the error",
            "apology", "we were wrong", "updated to correct", "this post has been", "article has been corrected",
        )
    ) or ("correction" in ended or "retract" in ended or "apology" in ended or "editor" in ended)
    if outlet_corr and any(
        d in (r.get("Who_Pushed_It") or "").lower()
        or d in url
        for d in ("cnn", "nyt", "nytimes", "washingtonpost", "wapo", "abc", "nbc", "cbs", "msnbc", "reuters", "apnews", "guardian", "npr", "fox", "politico", "time.com", "spiegel")
    ):
        return "Outlet's own correction"
    if outlet_corr and re.search(r"correction|retract|apology|editor", ended):
        return "Outlet's own correction"

    # Transcript/video primary
    if any(x in url for x in ("youtube.com", "c-span.org", "archive.org")) and "fact" not in url:
        return "Original transcript/video"

    return "Fact-check only"

def classify_visibility(r: dict, page_text: str, proof: str) -> str:
    ended = (r.get("_ended") or "").lower()
    notes = (r.get("Notes") or "").lower()
    blob = " ".join([ended, notes, page_text[:8000].lower()])
    who = (r.get("Who_Pushed_It") or "").lower()

    if "settlement" in blob:
        return "Retraction after legal threat/settlement"
    if re.search(r"\bdeleted\b.*\btweet|\btweet deleted|deleted the tweet|removed the post", blob):
        return "Tweet deleted"
    if re.search(r"\bdeleted\b.*\barticle|article (was )?deleted|taken down|removed the article|scrubbed", blob):
        return "Article deleted"
    if re.search(r"on-air|on air correction|broadcast correction|apologized on (air|his|her) show", blob):
        return "On-air correction"
    if re.search(r"editor.?s note|editors'? note", blob):
        return "Editor's note at bottom of article"
    if re.search(r"silent edit|quietly updated|updated without|no notice|without noting", blob):
        return "Silent edit, no notice"
    if re.search(r"appended|correction appended|correction at the (bottom|end)|updated:\s|correction:", blob):
        return "Appended correction line"
    if re.search(r"retract", blob) and "settlement" not in blob:
        if "on-air" in blob or "broadcast" in blob:
            return "On-air correction"
        return "Appended correction line"
    if proof == "Fact-check only":
        # No outlet correction language in ended
        if not re.search(r"correct|retract|apology|editor|settlement|deleted", ended):
            return "Never corrected — fact-checked only"
    if re.search(r"correct|retract|apology|editor", ended):
        return "Appended correction line"
    if proof == "Fact-check only":
        return "Never corrected — fact-checked only"
    return "Unknown"

def find_primary_url(r: dict, page_text: str) -> str:
    """Prefer official / transcript / outlet correction URL from page links or known fields."""
    text = page_text or ""
    notes = r.get("Notes") or ""
    # Extract http links from notes Also:
    urls = re.findall(r"https?://[^\s\)\]\"'<>]+", notes + " " + text[:50000])
    # Clean trailing punctuation
    urls = [u.rstrip(".,;:)") for u in urls]

    def score(u: str) -> int:
        ul = u.lower()
        s = 0
        if any(d in ul for d in ("justice.gov", "fec.gov", "federalregister.gov", "whitehouse.gov", "govinfo.gov", "supremecourt.gov", "courtlistener", "gao.gov", "cbo.gov", "bls.gov", "cms.gov")):
            s += 100
        if any(d in ul for d in ("durham", "mueller", "oig.", "inspector")):
            s += 80
        if "settlement" in ul or "consent" in ul:
            s += 70
        if any(d in ul for d in ("c-span.org", "youtube.com/watch")):
            s += 50
        # Outlet correction pages
        if any(d in ul for d in ("corrections", "retraction", "editor-note", "editors-note")):
            s += 40
        if any(d in ul for d in ("washingtonpost.com", "nytimes.com", "cnn.com", "abcnews", "nbcnews", "cbsnews")):
            s += 10
        # Deprioritize fact-checkers as primary
        if any(d in ul for d in ("politifact.com", "snopes.com", "factcheck.org", "leadstories.com")):
            s -= 20
        return s

    if urls:
        best = max(urls, key=score)
        if score(best) >= 40:
            return best
        # If truth source itself is an outlet correction page, use it
    truth = (r.get("Truth_Source_URL") or "").strip()
    tl = truth.lower()
    ended = (r.get("_ended") or "").lower()
    if any(k in ended for k in ("settlement", "retract", "apology", "editor", "correct")) and any(
        d in tl for d in ("washingtonpost", "nytimes", "cnn.com", "abc", "nbc", "cbs", "msnbc", "reuters", "apnews", "guardian", "spiegel")
    ):
        return truth
    if any(d in tl for d in ("justice.gov", "fec.gov", "federalregister.gov", "whitehouse.gov", "govinfo.gov")):
        return truth
    # Prefer Extra Also: official links
    for u in urls:
        if score(u) >= 50:
            return u
    return ""  # blank if none primary

def judge_row(r: dict, fetch_result: dict) -> dict:
    text = fetch_result.get("text") or ""
    ok = fetch_result.get("ok")
    status = fetch_result.get("status")
    dead = (not ok) or (status in (404, 410)) or (fetch_result.get("error") or "").startswith("HTTP 404")

    evidence = classify_evidence_level(r, text)
    primary = find_primary_url(r, text)
    proof = classify_proof_basis(r, text, primary)
    # If we have no primary and proof is Fact-check only, keep blank primary
    if proof == "Fact-check only" and not primary:
        primary = ""
    # If primary points to fact-check, blank it unless it's the only source supporting outlet correction wording
    if primary and any(d in primary.lower() for d in ("politifact.com", "snopes.com", "factcheck.org", "leadstories.com", "usatoday.com/story/news/factcheck")):
        # Only keep if no better — leave blank per preference for primary evidence
        if proof != "Outlet's own correction":
            primary = ""
            proof = "Fact-check only"

    vis = classify_visibility(r, text, proof)

    # Remove if no evidence of false/misleading at all
    remove = False
    remove_reason = ""
    tag = (r.get("Category_Tag") or "").lower()
    ended = (r.get("_ended") or "")
    if evidence not in ("Proven false", "Rated misleading"):
        remove = True
        remove_reason = "Could not classify as false or misleading"
    # If dead link AND no Extra_Sources and weak ended — flag for replacement attempt
    replacement = None
    if dead:
        # try archive.org
        orig = r["Truth_Source_URL"].strip()
        replacement = f"https://web.archive.org/web/0/{orig}"

    return {
        "Item_ID": int(r["Item_ID"]),
        "_term": r["_term"],
        "Evidence_Level": evidence,
        "Primary_Source_URL": primary,
        "Proof_Basis": proof,
        "Correction_Visibility": vis,
        "truth_fetch_ok": ok,
        "truth_status": status,
        "truth_error": fetch_result.get("error"),
        "dead": dead,
        "replacement_candidate": replacement,
        "remove": remove,
        "remove_reason": remove_reason,
        "claim": r["_claim"][:120],
        "truth_url": r["Truth_Source_URL"],
    }

def main():
    rows = load_all()
    print(f"Auditing {len(rows)} rows...")
    urls = [r["Truth_Source_URL"].strip() for r in rows]
    # unique fetch cache
    unique = list(dict.fromkeys(urls))
    print(f"Unique URLs: {len(unique)}")
    cache = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        futs = {ex.submit(fetch, u): u for u in unique}
        done = 0
        for fut in concurrent.futures.as_completed(futs):
            u = futs[fut]
            cache[u] = fut.result()
            done += 1
            if done % 25 == 0:
                print(f"  fetched {done}/{len(unique)}")
    print("Fetches done. Judging...")
    results = []
    for r in rows:
        fr = cache.get(r["Truth_Source_URL"].strip(), {"ok": False, "error": "missing", "text": ""})
        results.append(judge_row(r, fr))
    OUT.write_text(json.dumps(results, indent=1))
    print("Wrote", OUT)
    print("Evidence_Level", Counter(x["Evidence_Level"] for x in results))
    print("Proof_Basis", Counter(x["Proof_Basis"] for x in results))
    print("Visibility", Counter(x["Correction_Visibility"] for x in results))
    print("dead", sum(1 for x in results if x["dead"]))
    print("remove", [x for x in results if x["remove"]])
    return results

if __name__ == "__main__":
    main()
