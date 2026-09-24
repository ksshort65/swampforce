#!/usr/bin/env python3
"""Build swampforce policy brief PDF from term CSVs + page-header.txt."""
from __future__ import annotations
import csv, html, re, subprocess
from collections import Counter
from pathlib import Path

TS = Path("/workspace/term-split")
OUT = Path("/workspace/brief")
PDF = OUT / "swampforce-brief.pdf"
HTML_OUT = OUT / "swampforce-brief.html"

def load_rows():
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

def classify_pusher(who: str, tag: str) -> str:
    w = (who or "").strip()
    t = (tag or "").lower()
    if w.startswith("Viral/anonymous:") or "viral fake" in t:
        return "viral"
    news = bool(
        re.search(
            r"\b(News|Times|Post|CNN|MSNBC|NBC|ABC|CBS|NPR|Reuters|Associated Press|\bAP\b|"
            r"Guardian|Politico|Atlantic|Magazine|Network|Journalist|reporter|anchor|editor|"
            r"BuzzFeed|Yahoo|Slate|Vox|Mother Jones|National Review|Independent Journal|GQ|"
            r"Time magazine|NYT|WaPo|Washington Post|New York Times|Fox News|SNL|60 Minutes|"
            r"Meet the Press|World News|GMA|Good Morning|Spiegel|Der Spiegel)\b",
            w,
            re.I,
        )
    )
    pol = bool(
        re.search(
            r"\b(Rep\.|Sen\.|President|Vice President|\bVP\b|campaign|DNC|RNC|Harris|Biden|"
            r"Clinton|Obama|Schumer|Pelosi|Schiff|Nadler|Ellison|lawmaker|Democratic|Republican|"
            r"candidate|\bPAC\b|VoteVets|White House|AOC|Warren|Sanders|Buttigieg|Bloomberg|"
            r"McAuliffe|Jeffries|Swalwell|DeLauro|Wasserman|Trump administration)\b",
            w,
            re.I,
        )
    )
    if re.search(r"\b(media|outlet|network|headline|coverage|journalist|press)\b", w, re.I):
        news = True
    if re.search(r"\b(politician|campaign|Democrat|Republican)\b", w, re.I):
        pol = True
    if news and pol:
        return "both"
    if news:
        return "news"
    if pol:
        return "politician"
    return "other"

def form_cat(df: str) -> str:
    f = (df or "").lower().replace("\u201c", '"').replace("\u201d", '"')
    if "misquote" in f or "truncation" in f:
        return "Contextomy / misquote"
    if "policy-scope" in f:
        return "Policy-scope inflation"
    if "omitted context" in f or "omission" in f:
        return "Omission / selective reporting"
    if any(x in f for x in ("false photo", "false video", "photo attribution", "video attribution")):
        return "False photo/video / cheap fakes"
    if "fabrication" in f or "retracted invention" in f:
        return "Fabrication / retracted invention"
    if "false attribution" in f:
        return "False attribution of words/intent"
    if "premature" in f:
        return 'Premature "proven" framing'
    if "inflammatory" in f:
        return "Inflammatory false premise / framing"
    if "misleading statistic" in f or "false absolute" in f:
        return "Misleading statistics"
    if "framing" in f:
        return "Framing"
    return "Other"

def evidence_score(r: dict) -> float:
    blob = " ".join(
        [r["_claim"], r["_ended"], r.get("Notes") or "", r["Truth_Source_URL"], r["Category_Tag"], r["Who_Pushed_It"]]
    ).lower()
    s = 0.0
    if "settlement" in blob:
        s += 12
    if "durham" in blob:
        s += 11
    if "mueller" in blob and ("report" in blob or "office" in blob):
        s += 8
    if "retract" in blob or "regrets" in blob or "apology" in blob or "editor's note" in blob:
        s += 6
    if "retracted/corrected" in r["Category_Tag"]:
        s += 4
    if any(x in r["Who_Pushed_It"] for x in ("ABC", "CBS", "NBC", "CNN", "New York Times", "Washington Post", "MSNBC", "NPR", "Guardian")):
        s += 3
    if r["Who_Pushed_It"].startswith("Viral/anonymous:"):
        s -= 8
    if re.search(r"politifact|snopes|factcheck\.org|lead stories", r["Truth_Source_URL"], re.I):
        if "settlement" not in blob and "retract" not in blob and "durham" not in blob and "mueller" not in blob:
            s -= 3
    return s

PREFERRED_IDS = [16, 75, 10, 26, 8, 5, 51, 4, 9, 79, 39, 34, 63, 146]

def is_strong_eligible(r):
    ev = (r.get("Evidence_Level") or "").strip()
    proof = (r.get("Proof_Basis") or "").strip()
    return ev == "Proven false" and proof in ("Official record", "Outlet's own correction")

def strongest_cases(rows, n=12):
    eligible = [r for r in rows if is_strong_eligible(r)]
    pool = eligible if eligible else rows
    by_id = {int(r["Item_ID"]): r for r in pool}
    chosen = []
    for i in PREFERRED_IDS:
        if i in by_id and len(chosen) < n:
            chosen.append(by_id[i])
    if len(chosen) < n:
        ranked = sorted(pool, key=evidence_score, reverse=True)
        have = {int(r["Item_ID"]) for r in chosen}
        for r in ranked:
            iid = int(r["Item_ID"])
            if iid not in have:
                chosen.append(r)
                have.add(iid)
            if len(chosen) >= n:
                break
    terms = {r["_term"] for r in chosen}
    if "later" not in terms:
        for r in sorted(pool, key=evidence_score, reverse=True):
            if r["_term"] == "later" and int(r["Item_ID"]) not in {int(x["Item_ID"]) for x in chosen[:-1]}:
                chosen[-1] = r
                break
    return chosen

def short_disproof(r: dict) -> str:
    e = (r["_ended"] or "").strip()
    # Prefer all parenthetical notes joined; fall back to full ended line
    parts = re.findall(r"\(([^()]*(?:\([^()]*\)[^()]*)*)\)", e)
    if not parts:
        # simpler: take content after last " (" if present
        if "(" in e and e.endswith(")"):
            return e[e.find("(") + 1 : -1].strip()[:160]
        return e[:120]
    return "; ".join(p.strip() for p in parts)[:160]

def build_html(rows):
    first = sum(1 for r in rows if r["_term"] == "first")
    later = sum(1 for r in rows if r["_term"] == "later")
    total = len(rows)
    push = Counter(classify_pusher(r["Who_Pushed_It"], r["Category_Tag"]) for r in rows)
    forms = Counter(form_cat(r["Deception_Form"]) for r in rows)
    top_forms = forms.most_common(6)
    ev_counts = Counter((r.get("Evidence_Level") or "Unknown") for r in rows)
    proof_counts = Counter((r.get("Proof_Basis") or "Unknown") for r in rows)
    vis_counts = Counter((r.get("Correction_Visibility") or "Unknown") for r in rows)
    strong = strongest_cases(rows, 10)

    esc = html.escape
    form_rows = "".join(
        f"<tr><td>{esc(name)}</td><td class='num'>{count}</td></tr>" for name, count in top_forms
    )
    case_lis = []
    for r in strong:
        term_lab = "First term" if r["_term"] == "first" else "Later / second term"
        cl = r["_claim"]
        wh = r["Who_Pushed_It"]
        primary = (r.get("Primary_Source_URL") or "").strip()
        src_url = primary or r["Truth_Source_URL"].strip()
        src_lab = "Primary" if primary else "Source"
        case_lis.append(
            "<li><b>{}</b> &mdash; {} (<i>{}</i>). Disproved: {}. "
            '<a href="{}">{}</a></li>'.format(
                esc(cl[:140] + ("..." if len(cl) > 140 else "")),
                esc(wh[:90] + ("..." if len(wh) > 90 else "")),
                esc(term_lab),
                esc(short_disproof(r)[:120]),
                esc(src_url),
                esc(src_lab),
            )
        )

    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Documented Deception of American Voters - Policy Brief</title>
<style>
  @page {{ size: letter; margin: 0.5in 0.6in 0.5in 0.6in; }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 9pt; line-height: 1.32; color: #1a1a1a; margin: 0;
  }}
  h1 {{ font-size: 13.5pt; margin: 0 0 3px; color: #111; }}
  .meta {{ font-size: 8pt; color: #444; margin: 0 0 8px; }}
  h2 {{
    font-size: 9.5pt; margin: 9px 0 3px; padding-bottom: 1px;
    border-bottom: 1.5px solid #9b1c1c; color: #7f1d1d; text-transform: uppercase;
    letter-spacing: 0.03em;
  }}
  p {{ margin: 0 0 5px; }}
  .summary {{ background: #f7f7f5; border-left: 3px solid #9b1c1c; padding: 6px 9px; margin: 0 0 6px; }}
  .grid {{ display: flex; gap: 12px; margin: 2px 0 4px; }}
  .grid > div {{ flex: 1; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 8.2pt; margin: 1px 0 4px; }}
  th, td {{ text-align: left; padding: 1px 3px; border-bottom: 1px solid #e5e5e5; vertical-align: top; }}
  th {{ color: #555; font-weight: 600; }}
  td.num {{ text-align: right; width: 40px; font-variant-numeric: tabular-nums; }}
  ol.cases {{ margin: 1px 0 4px 1.05em; padding: 0; }}
  ol.cases li {{ margin: 0 0 3px; }}
  ol.cases a {{ color: #9b1c1c; }}
  p a, ul.props a {{ color: #9b1c1c; }}
  .opinion {{
    background: #fff8f8; border: 1px solid #f0d0d0; padding: 5px 8px; margin: 5px 0;
    font-size: 8.2pt;
  }}
  .opinion b.label {{ color: #7f1d1d; }}
  ul.props {{ margin: 1px 0 4px 1.05em; padding: 0; }}
  ul.props li {{ margin: 0 0 2px; }}
  footer {{
    margin-top: 8px; padding-top: 5px; border-top: 1px solid #ccc;
    font-size: 7.5pt; color: #555;
  }}
  .note {{ font-size: 7.4pt; color: #666; margin-top: 1px; }}
</style></head><body>
<h1>Documented Deception of American Voters: A Record and a Proposal</h1>
<p class="meta">September 2026 &nbsp;&middot;&nbsp; Prepared by swampforce.com &nbsp;&middot;&nbsp; Policy brief for lawmakers, staff, and legal groups</p>

<div class="summary">
<p><b>Summary.</b> This brief is based on a documented record of <b>{total} cases</b>
({first} from the first Trump term / 2017&ndash;January 2021 era;
{later} from after the first term and the second term).
A case is included only when the claim was later corrected, retracted, settled,
shown false by an official finding, or rated False / Mostly False / Pants on Fire
by a major fact-check. Full tables and sources: swampforce.com. Full evidence for every case, with links: see Evidence Appendix.</p>
</div>

<h2>Key numbers from the record</h2>
<div class="grid">
<div>
<table>
<tr><th>Who pushed it (exclusive categories)</th><th></th></tr>
<tr><td>News outlet / journalist</td><td class="num">{push['news']}</td></tr>
<tr><td>Politician / campaign</td><td class="num">{push['politician']}</td></tr>
<tr><td>Both news and politician named</td><td class="num">{push['both']}</td></tr>
<tr><td>Viral / anonymous social media</td><td class="num">{push['viral']}</td></tr>
<tr><td>Other / unclassified</td><td class="num">{push['other']}</td></tr>
<tr><td><b>Total</b></td><td class="num"><b>{total}</b></td></tr>
</table>
<p class="note">Viral rows are tagged when no named outlet, journalist, or politician was the primary pusher.</p>
</div>
<div>
<table>
<tr><th>Most common deception methods</th><th></th></tr>
{form_rows}
</table>
<p class="note">Normalized to the site glossary. Counts use one primary mapped category per case.</p>
</div>
</div>
<p style="margin:4px 0 2px"><b>Evidence audit:</b> Proven false {ev_counts.get('Proven false',0)}; Rated misleading {ev_counts.get('Rated misleading',0)}.
Proof basis &mdash; Official record {proof_counts.get('Official record',0)}; Outlet&rsquo;s own correction {proof_counts.get("Outlet's own correction",0)}; Original transcript/video {proof_counts.get('Original transcript/video',0)}; Fact-check only {proof_counts.get('Fact-check only',0)}.
Correction visibility &mdash; Never corrected {vis_counts.get('Never corrected — fact-checked only',0) + vis_counts.get('Never corrected',0)} (fact-checked only {vis_counts.get('Never corrected — fact-checked only',0)}; no fact-check on file {vis_counts.get('Never corrected',0)}); Appended correction {vis_counts.get('Appended correction line',0)}; Editor&rsquo;s note {vis_counts.get("Editor's note at bottom of article",0)}; Settlement/legal retraction {vis_counts.get('Retraction after legal threat/settlement',0)}; On-air {vis_counts.get('On-air correction',0)}; Unknown {vis_counts.get('Unknown',0)}.</p>

<h2>Strongest cases (hardest evidence)</h2>
<p>Limited to Proven false with Official record or Outlet&rsquo;s own correction. Mix of both terms:</p>
<ol class="cases">
{''.join(case_lis)}
</ol>

<h2>Why corrections don&rsquo;t fix it</h2>
<p>Psychology research shows why a buried correction rarely undoes the first blast.
The <b>continued influence effect</b> means people keep relying on retracted information
(Johnson &amp; Seifert, 1994; Lewandowsky et al., 2012). The <b>illusory truth effect</b>
means repetition makes claims feel true even after a correction
(Hasher, Goldstein &amp; Toppino, 1977). False news also spreads faster: an MIT study found
false stories were about 70% more likely to be retweeted and reached people roughly six times
faster (Vosoughi, Roy &amp; Aral, <i>Science</i>, 2018).</p>

<h2>Newsroom lean (verified surveys)</h2>
<p>Indiana University American Journalist survey (2022): about <b>36%</b> of U.S. journalists
identified as Democrats and <b>3.4%</b> as Republicans (~52% independents); Republicans were 7.1% in 2013.
Center for Public Integrity (2016): more than <b>96%</b> of itemized journalism-sector donations to
Clinton or Trump went to Clinton. Harvard Shorenstein Center / Patterson (2017): of clearly toned
coverage in Trump&rsquo;s first 100 days, <b>80%</b> was negative (~13-to-1 on CNN and NBC).</p>

<h2>Current law</h2>
<p>The First Amendment protects much false speech: <a href="https://tile.loc.gov/storage-services/service/ll/usrep/usrep567/usrep567709/usrep567709.pdf"><i>United States v. Alvarez</i></a> (2012) struck down the
Stolen Valor Act, and the plurality held that falsity alone does not strip speech of protection. A public official must prove
&ldquo;actual malice&rdquo; (knowing falsity or reckless disregard) to win damages over coverage of official conduct (<a href="https://tile.loc.gov/storage-services/service/ll/usrep/usrep376/usrep376254/usrep376254.pdf"><i>New York Times Co. v. Sullivan</i></a>, 1964). Narrower tools exist but are limited:
the FCC&rsquo;s <b>news distortion</b> policy applies only to over-the-air broadcast licensees and needs
extrinsic evidence of deliberate falsification; cable and digital outlets are outside it.
FEC disclosure can reach paid opposition research&mdash;the FEC fined the Clinton campaign and DNC
<b>$113,000</b> in 2022 for misreporting Steele-dossier payments as legal expenses. Civil defamation
still yields settlements (ABC/Stephanopoulos; Paramount/CBS in this record). Several states already
regulate election deepfakes (Texas SB 751 (2019); Minnesota Stat. &sect; 609.771 (2023)).</p>

<h2>Proposals for consideration</h2>
<p>Options within existing First Amendment doctrine&mdash;not viewpoint censorship. Priority is equal-prominence corrections: buried retractions are never seen.</p>
<ul class="props">
<li><b>1. Equal-prominence corrections (priority).</b> A correction must match the original&rsquo;s placement and reach&mdash;same air slot or segment; top of the same page, feed, or account online. Continued influence (Johnson &amp; Seifert, 1994) and faster false-news spread (Vosoughi et al., 2018) explain why buried notes fail. Build onto FCC news-distortion for broadcast; extend parallel rules to covered digital publishers without a fairness doctrine for opinion.</li>
<li><b>2. Accuracy standards for press credentials.</b> Publish viewpoint-neutral standards under which a White House or congressional press credential may be reviewed for a documented pattern of false reporting that was never corrected&mdash;applied equally to all outlets, with notice and a chance to respond. Case law already requires process: <i>Sherrill v. Knight</i> (D.C. Cir. 1977) held that denial of White House access needs a published standard plus notice, opportunity to rebut, and a written decision; <i>CNN v. Trump</i> (D.D.C. 2018) restored Jim Acosta&rsquo;s hard pass by TRO for lack of due process; <i>Karem v. Trump</i> (D.C. Cir. 2020) affirmed an injunction against a 30-day suspension for want of fair notice. In <i>AP v. Budowich</i> (2025), after the AP did not adopt &ldquo;Gulf of America,&rdquo; the White House excluded it from the press pool, the Oval Office, Air Force One and other limited-access events; its hard passes were never revoked (<a href="https://storage.courtlistener.com/recap/gov.uscourts.dcd.277682/gov.uscourts.dcd.277682.46.0_1.pdf">D.D.C. op., ECF 46</a>). The district court enjoined the exclusion, and the D.C. Circuit (June 2025) partially stayed that injunction (except as to the East Room). As of September 2026 the merits appeal remains pending after November 2025 argument. <i>Site view:</i> this list documents why such standards are needed.</li>
<li><b>3. Congress corrects its own record.</b> Under each house&rsquo;s rulemaking power (Art. I, &sect; 5), when a member&rsquo;s public statement is proven false, the member must formally correct it with the same prominence as the original, and a public registry records who corrected and who refused. This does not alter Speech or Debate immunity for legislative acts (Art. I, &sect; 6).</li>
<li><b>4. Stronger FEC disclosure for opposition research.</b> Clear labeling when campaign or party funds pay for research seeded to the press.</li>
<li><b>5. AI media transparency + public corrections registry.</b> Federal labeling for knowingly distributed deceptive synthetic election media (with news/parody carve-outs), plus a searchable nonpartisan registry of material political corrections, retractions, and settlements. Stay inside actual malice: knowing falsity or reckless disregard&mdash;not good-faith error.</li>
</ul>

<div class="opinion">
<p><b class="label">Site owner&rsquo;s view.</b> Hannah Arendt warned that when people can no longer tell fact from fiction, they lose the capacity to think, judge, and act as citizens
(Errera interview, <i>NYRB</i> 1978; <i>Origins of Totalitarianism</i>, 2nd ed., 1958).
Deliberate, large-scale deception of voters betrays informed consent in a self-governing republic. This record is offered as evidence for stronger accountability&mdash;not as a substitute for the Constitution.</p>
</div>

<footer>
Full evidence for every case, with links: see <b>Evidence Appendix</b> (swampforce-evidence-appendix.pdf).<br>Full case tables, sources, and methods glossary: <b>https://swampforce.com</b>.
Figures are computed from project CSVs and regenerate when the record grows. Not legal advice.
</footer>
</body></html>"""
    return page, {
        "total": total,
        "first": first,
        "later": later,
        "push": dict(push),
        "forms": top_forms,
        "ev": dict(ev_counts),
        "proof": dict(proof_counts),
        "vis": dict(vis_counts),
        "strong_ids": [int(r["Item_ID"]) for r in strong],
        "strong": strong,
    }

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = load_rows()
    page, stats = build_html(rows)
    HTML_OUT.write_text(page)
    cmd = [
        "google-chrome",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={PDF}",
        "--no-pdf-header-footer",
        f"file://{HTML_OUT.resolve()}",
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print("Wrote", PDF, "bytes", PDF.stat().st_size)
    print("STATS", {k: stats[k] for k in ("total", "first", "later", "push", "forms", "strong_ids")})
    for r in stats["strong"]:
        print(f"  ID {r['Item_ID']}: {r['_claim'][:70]}")
    return stats

if __name__ == "__main__":
    main()
