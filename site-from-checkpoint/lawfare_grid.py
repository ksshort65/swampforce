"""Lawfare 'at a glance' grid (top of lawfare.html). Built only from /workspace/lawfare/lawfare-docket-tracker.csv
(Documented_Issues, Charges_or_Claims, Outcome_Summary, Sources) and lawfare-rulings.csv (Opinion URL). No new research.
A cell is filled only when those CSVs support it; otherwise it reads 'Not yet documented'.
'Unusual' = the CSV documents at least one specific departure found or noted by a court. 'Usual' = the CSV documents
appellate courts upholding the result with no departure noted."""
import html
from pathlib import Path
e = lambda s: html.escape(s, quote=True)
COLS = ["Handled the usual way?", "Charges changed or unspecified", "Jury instructions", "Political ties of prosecutor/judge", "Funding / donations", "Outcome",
        "Court documents", "Why dropped, dismissed or overturned", "Documented White House / DOJ ties or meetings"]
SC_IMM = "lawfare-docs/trump-v-united-states-immunity.pdf"
# docket index (1-based, CSV order) -> short label, badge, {column: (note, url)}
ROWS = {
 1: ("NY civil fraud (Exec. Law § 63(12))", "Unusual", {0: ("Appeals court: $464.6M award an excessive fine", "lawfare-docs/ny-1st-dept-civil-fraud.pdf"),
     5: ("Liability upheld; money award vacated; appeal pending", "lawfare-docs/ny-1st-dept-civil-fraud.pdf")}),
 2: ("Manhattan criminal case (34 counts)", None, {1: ("Felony upgrade tied to another alleged crime", "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm"),
     2: ("Election Law § 17-152 presented to jury", "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm"),
     5: ("Guilty; unconditional discharge; appeal pending", "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm")}),
 3: ("Classified documents (S.D. Fla.)", "Unusual", {0: ("Dismissed: special counsel appointment unconstitutional", "lawfare-docs/cannon-dismissal.pdf"),
     5: ("Dismissed; appeals dropped; case closed", "lawfare-docs/cannon-dismissal.pdf")}),
 4: ("Jan. 6 federal case (D.D.C.)", "Unusual", {0: ("Supreme Court narrowed obstruction charge (Fischer)", "lawfare-docs/fischer-v-united-states.pdf"),
     1: ("§ 1512(c)(2) counts sent back for review", SC_IMM),
     5: ("Dismissed without prejudice after 2024 election", "lawfare-docs/chutkan-dismissal.pdf")}),
 5: ("Georgia election case (Fulton County)", "Unusual", {0: ("Appeals court ordered DA disqualified", "lawfare-docs/ga-coa-willis.pdf"),
     5: ("Nolle prossed and dismissed, Nov. 26, 2025", "lawfare-docs/ga-nolle-pros.pdf")}),
 6: ("State ballot cases (Section 3)", "Unusual", {0: ("Supreme Court 9–0: states cannot enforce Section 3", "lawfare-docs/trump-v-anderson.pdf"),
     5: ("Reversed 9–0; stayed on ballots", "lawfare-docs/trump-v-anderson.pdf")}),
 7: ("E. Jean Carroll civil cases", "Usual", {0: ("Second Circuit affirmed both judgments", "https://law.justia.com/cases/federal/appellate-courts/ca2/23-793/23-793-2024-12-30.html"),
     5: ("$88.3M verdicts affirmed; petitions pending", "https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_2_opn.pdf")}),
 8: ("Trump v. United States (immunity ruling)", None, {5: ("Immunity framework set, July 1, 2024", SC_IMM)}),
 9: ("Fischer v. United States (obstruction ruling)", None, {5: ("§ 1512(c)(2) limited to evidence impairment", "lawfare-docs/fischer-v-united-states.pdf")}),
 10: ("Jan. 6 Committee referrals and Smith reports", None, {5: ("Referrals made; federal cases later dismissed", "https://www.govinfo.gov/collection/january-6th-committee-final-report")}),
}
EXTRA = {
 1: {6: [("Appellate Division decision (PDF)", "lawfare-docs/ny-1st-dept-civil-fraud.pdf"), ("NYSCEF docket search", "https://iapps.courts.state.ny.us/nyscef/CaseSearch")], 7: ("Award vacated as excessive fine (8th Am.)", "lawfare-docs/ny-1st-dept-civil-fraud.pdf")},
 2: {6: [("Decision, 2024 NY Slip Op 24328", "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm"), ("Federal removal docket (RECAP)", "https://storage.courtlistener.com/recap/gov.uscourts.nysd.598311/")], 7: ("Not dropped: conviction intact, appeal pending", "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm")},
 3: {6: [("Dismissal order, ECF 672 (PDF)", "lawfare-docs/cannon-dismissal.pdf"), ("11th Cir. appeal docket", "https://www.courtlistener.com/docket/67490069/united-states-v-trump/")], 7: ("Special counsel appointment violated Appointments Clause", "lawfare-docs/cannon-dismissal.pdf")},
 4: {6: [("Dismissal orders (PDF)", "lawfare-docs/chutkan-dismissal.pdf"), ("Supreme Court immunity opinion (PDF)", SC_IMM)], 7: ("DOJ policy: sitting President not prosecuted", "lawfare-docs/chutkan-dismissal.pdf")},
 5: {6: [("Ga. Court of Appeals opinion (PDF)", "lawfare-docs/ga-coa-willis.pdf"), ("Nolle prosequi (PDF)", "lawfare-docs/ga-nolle-pros.pdf")], 7: ("DA disqualified; successor declined to proceed", "lawfare-docs/ga-nolle-pros.pdf")},
 6: {6: [("Trump v. Anderson opinion (PDF)", "lawfare-docs/trump-v-anderson.pdf"), ("Maine modified ruling (PDF)", "lawfare-docs/maine-bellows-modified.pdf")], 7: ("Congress, not states, enforces Section 3", "lawfare-docs/trump-v-anderson.pdf")},
 7: {6: [("Carroll I verdict (PDF)", "https://storage.courtlistener.com/recap/gov.uscourts.nysd.543790/gov.uscourts.nysd.543790.285.0.pdf"), ("2d Cir. Carroll II affirmance", "https://law.justia.com/cases/federal/appellate-courts/ca2/23-793/23-793-2024-12-30.html"), ("2d Cir. Carroll I opinion (PDF)", "https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_2_opn.pdf")], 7: ("Not overturned: affirmed on appeal", "https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_2_opn.pdf")},
 8: {6: [("Slip opinion 23-939 (PDF)", SC_IMM)], 7: ("Remand mooted when D.D.C. case dismissed", "lawfare-docs/chutkan-dismissal.pdf")},
 9: {6: [("Slip opinion 23-5572 (PDF)", "lawfare-docs/fischer-v-united-states.pdf")]},
 10: {6: [("Jan. 6 Committee collection (govinfo)", "https://www.govinfo.gov/collection/january-6th-committee-final-report"), ("Smith report, Volume I (PDF)", "https://www.justice.gov/storage/Report-of-Special-Counsel-Smith-Volume-1-January-2025.pdf")]},
}
for _i, _x in EXTRA.items():
    ROWS[_i][2].update(_x)
BADGE = {"Usual": "lf-usual", "Unusual": "lf-unusual", None: "lf-nd"}

def section(n_dockets):
    assert n_dockets == len(ROWS)
    head = "".join(f"<th>{e(c)}</th>" for c in ["Case"] + COLS)
    body = []
    for i, (label, badge, cells) in ROWS.items():
        tds = []
        for k in range(len(COLS)):
            if k == 0:
                b = f'<span class="lf-badge {BADGE[badge]}">{e(badge or "Not yet documented")}</span>'
                note = cells.get(0)
                tds.append(f"<td>{b}" + (f'<br><a href="{e(note[1])}" target="_blank" rel="noopener">{e(note[0])} ↗</a>' if note else "") + "</td>")
            elif k in cells and isinstance(cells[k], list):
                tds.append("<td>" + "<br>".join(f'<a href="{e(u)}" target="_blank" rel="noopener">{e(t)} ↗</a>' for t, u in cells[k]) + "</td>")
            elif k in cells:
                tds.append(f'<td><a href="{e(cells[k][1])}" target="_blank" rel="noopener">{e(cells[k][0])} ↗</a></td>')
            else:
                tds.append('<td class="lf-empty">Not yet documented</td>')
        body.append(f'<tr data-href="#docket-{i}" class="sf-link"><th scope="row"><a href="#docket-{i}">{e(label)}</a></th>{"".join(tds)}</tr>')
    return f"""<section class="lf-glance" id="at-a-glance"><h2>The cases at a glance</h2>
<p class="strip-dek">One row per case. A cell is filled only when the court record in our tracker supports it; grey means not yet documented. “Unusual” means a court found or noted a specific departure, cited in the cell. Tap a row for the full case record.</p>
<div class="table-wrap"><table class="rank-table lf-grid sf-nofold"><thead><tr>{head}</tr></thead><tbody>{"".join(body)}</tbody></table></div>
<p class="tap-hint">Sources: the court PDFs and opinions listed in each case’s record below.</p></section>"""

def gaps_md(path):
    out = ["# Lawfare grid: open questions for research (paste-ready)", "",
           "Each question matches one grey 'Not yet documented' cell on swampforce.com/lawfare.html#at-a-glance. Ask for official sources only (court dockets, opinions, filings, FEC/state disclosure records), with links.", ""]
    for i, (label, badge, cells) in ROWS.items():
        qs = []
        if badge is None:
            qs.append(f"For {label}, did any court find or note a specific departure from normal practice (e.g., an appellate ruling, a novel legal theory, an unspecified predicate crime)? List official sources with links.")
        topics = {1: "whether the charges were changed, amended or left unspecified (for example, an unnamed predicate crime)",
                  2: "any dispute over the jury instructions (or confirm there was no jury)",
                  3: "documented political ties (party, campaign, donations, public statements) of the prosecutor(s) and judge(s)",
                  4: "documented funding or donations connected to the prosecutor, the office, or the plaintiffs",
                  5: "the final outcome and current status",
                  6: "the charging document (indictment or complaint) and the key rulings",
                  7: "why the case or charges were dropped, dismissed or overturned (or confirm they were not)",
                  8: "any documented White House or DOJ ties or meetings with the prosecutor's office (official visitor logs, DOJ records, court findings)"}
        for k, t in topics.items():
            if k not in cells:
                qs.append(f"For {label}, list official sources on {t}, with links.")
        if 6 in cells:
            qs.append(f"For {label}, give the official link to the indictment or complaint itself (our record links rulings, not the charging document).")
        if i in (2, 4, 5):
            qs.append(f"For {label}, does the court record note an unspecified or uncharged underlying crime in the charges? Cite the ruling or transcript page, with a link.")
        if qs:
            out.append(f"## {i}. {label}"); out += [f"- {q}" for q in qs]; out.append("")
    Path(path).write_text("\n".join(out), encoding="utf-8")

def fill_report():
    filled = sum(len(c) for _, _, c in ROWS.values()); total = len(ROWS) * len(COLS)
    return filled, total
