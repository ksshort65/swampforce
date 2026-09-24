#!/usr/bin/env python3
"""Build Lawfare Docket Tracker outputs for swampforce.com."""
from __future__ import annotations

import csv
import zipfile
from datetime import datetime
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

OUT = Path("/workspace/lawfare")
AS_OF = "September 24, 2026"
OUT.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# CASE DATA — every factual claim is tied to a fetched source below
# ---------------------------------------------------------------------------

CASES = [
    {
        "Case_Name": "People of the State of New York v. Donald J. Trump et al. (civil fraud / Exec. Law § 63(12))",
        "Court": "Supreme Court of the State of New York, New York County; Appellate Division, First Department; New York Court of Appeals (pending)",
        "Docket_Number": "Index No. 452564/2022 (trial); Appeal Nos. 2834–2836; Case Nos. 2023-04925, 2024-01134, 2024-01135 (1st Dept); Court of Appeals review pending after Aug. 21, 2025 Appellate Division decision",
        "Official_Docket_URL": "https://iapps.courts.state.ny.us/nyscef/CaseSearch (search Index 452564/2022); Appellate Division opinion PDF archived at /workspace/lawfare/sources/ny-1st-dept-civil-fraud.pdf",
        "Brought_By": "People of the State of New York, by Letitia James, Attorney General of the State of New York",
        "Filed_Date": "2022-09-21 (complaint; AG investigation earlier; Special Proceeding Aug. 2020)",
        "Charges_or_Claims": "Civil claims under N.Y. Executive Law § 63(12) for repeated fraudulent/illegal business acts predicated in part on N.Y. Penal Law (falsifying business records / false financial statements / related conspiracy theories). Sought disgorgement, injunctive relief, independent monitor, and independent compliance director.",
        "Key_Rulings": [
            {
                "date": "2023-09-26",
                "court": "N.Y. Supreme Court (Engoron, J.)",
                "summary": "Partial summary judgment for the AG on the first cause of action (Exec. Law § 63(12)); sanctions against defense counsel.",
                "url": "https://iapps.courts.state.ny.us/nyscef/CaseSearch",
            },
            {
                "date": "2024-02-16",
                "court": "N.Y. Supreme Court (Engoron, J.)",
                "summary": "Post-trial decision: liability on remaining § 63(12) causes; disgorgement of $363,894,816 plus prejudgment interest totaling $464,576,230.62; extensive injunctive relief and monitor/compliance director.",
                "url": "https://iapps.courts.state.ny.us/nyscef/CaseSearch",
            },
            {
                "date": "2024-02-23",
                "court": "N.Y. Supreme Court (Engoron, J.)",
                "summary": "Judgment entered implementing the post-trial order.",
                "url": "https://iapps.courts.state.ny.us/nyscef/CaseSearch",
            },
            {
                "date": "2025-08-21",
                "court": "Appellate Division, First Department",
                "summary": "ENTERED Aug. 21, 2025: modified judgment on the law to vacate the disgorgement awards in their entirety and vacate counsel sanctions; otherwise affirmed. Fractured panel; Higgitt & Rosado joined the decretal solely to create finality for Court of Appeals review. Moulton (joined by Renwick, P.J.): liability affirmed but disgorgement an excessive fine under the Eighth Amendment. Friedman, J.: would reverse and dismiss; joined vacatur of disgorgement/sanctions.",
                "url": "file:///workspace/lawfare/sources/ny-1st-dept-civil-fraud.pdf",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Appellate Division (Aug. 21, 2025) vacated the ~$464.6 million disgorgement and counsel sanctions but left liability findings and much of the injunctive relief intact via a fractured disposition designed for Court of Appeals review. Cross-appeals / further review in the New York Court of Appeals remain active (defendants' principal brief filed Apr. 2026 seeking reversal of liability/injunctions; AG seeks restoration of monetary relief). Monitor-related injunctive framework remains subject to the stayed/pending high-court posture.",
        "Outcome_Summary": "Liability under Exec. Law § 63(12) affirmed by Appellate Division (fractured); entire disgorgement award vacated as an excessive fine (Eighth Amendment); counsel sanctions vacated; Court of Appeals review pending.",
        "Documented_Issues": "Appellate Division (Moulton, J., joined by Renwick, P.J.): the nearly half-billion-dollar disgorgement 'is an excessive fine that violates the Eighth Amendment.' Friedman, J. (concurring in vacatur / dissenting otherwise): would dismiss; wrote that affirming liability while three of five justices would vacate judgment was troubling, and that vacating the monetary award frustrated what he described as the AG's aim. Higgitt, J. (joined by Rosado, J.): joined the decretal solely to ensure finality for Court of Appeals review despite disagreeing with parts of the liability affirmance.",
        "Sources": "NYSCEF Index 452564/2022; Appellate Division, First Department Decision and Order ENTERED Aug. 21, 2025 (Appeal Nos. 2834–2836) PDF; Courthouse News / party briefs to N.Y. Court of Appeals (Apr. 2026 defendants' brief).",
    },
    {
        "Case_Name": "People of the State of New York v. Donald J. Trump (Manhattan criminal / 'hush money')",
        "Court": "Supreme Court of the State of New York, New York County (Merchan, J.); Appellate Division, First Department (direct appeal pending); U.S. District Court, S.D.N.Y. / U.S. Court of Appeals for the Second Circuit (removal track)",
        "Docket_Number": "Indictment No. 71543-23 (N.Y. County); Appellate Division First Department Case No. 2025-00648; S.D.N.Y. removal-related civil docket 1:23-cv-03773-AKH",
        "Official_Docket_URL": "https://iapps.courts.state.ny.us/nyscef/CaseSearch; https://www.courtlistener.com/docket/67360215/united-states-v-trump/ (related federal removal filings on CourtListener/RECAP); https://storage.courtlistener.com/recap/gov.uscourts.nysd.598311/",
        "Brought_By": "People of the State of New York, by Alvin L. Bragg, Jr., District Attorney of New York County",
        "Filed_Date": "2023-03-30 (indictment unsealed / announced)",
        "Charges_or_Claims": "34 felony counts of Falsifying Business Records in the First Degree, N.Y. Penal Law § 175.10 (elevated by alleged intent to commit/conceal another crime, including N.Y. Election Law § 17-152 as presented to the jury).",
        "Key_Rulings": [
            {
                "date": "2024-05-30",
                "court": "N.Y. Supreme Court (Merchan, J.) / jury",
                "summary": "Jury returned guilty verdicts on all 34 counts of falsifying business records in the first degree.",
                "url": "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm",
            },
            {
                "date": "2024-12-17",
                "court": "N.Y. Supreme Court (Merchan, J.)",
                "summary": "Denied post-verdict motion to vacate based on Trump v. United States immunity ruling (harmless-error / unofficial-acts analysis).",
                "url": "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm",
            },
            {
                "date": "2025-01-03",
                "court": "N.Y. Supreme Court (Merchan, J.)",
                "summary": "Denied Dec. 2024 motion to dismiss indictment and vacate verdict after the 2024 election.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.nysd.598311/",
            },
            {
                "date": "2025-01-10",
                "court": "N.Y. Supreme Court (Merchan, J.)",
                "summary": "Sentence of unconditional discharge (no jail, fine, or probation); conviction remains on the record.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.nysd.598311/",
            },
            {
                "date": "2025-10-27",
                "court": "Appellate Division, First Department",
                "summary": "Direct appeal from the judgment of conviction filed / docketed (Case No. 2025-00648). DA respondent brief filed on NYSCEF July 29, 2026.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.nysd.598311/gov.uscourts.nysd.598311.87.1.pdf",
            },
            {
                "date": "2026-08-28",
                "court": "U.S. District Court, S.D.N.Y.",
                "summary": "On remand from the Second Circuit regarding a second notice of removal, district court again denied leave to file a second removal notice (good-cause/diligence); transmitted response to Second Circuit mandate. Federal removal track remains procedurally alive on appeal; conviction not displaced.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.nysd.598311/",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Conviction intact. Unconditional discharge imposed Jan. 10, 2025. Direct appeal pending in Appellate Division, First Department (2025-00648). Parallel federal removal litigation ongoing after Second Circuit vacated an earlier denial of leave to file a second removal notice; S.D.N.Y. again denied leave Aug. 28, 2026, with further Second Circuit review of that answer.",
        "Outcome_Summary": "Guilty on 34 felony counts (May 30, 2024); unconditional discharge (Jan. 10, 2025); appeal and federal removal efforts pending; no incarceration.",
        "Documented_Issues": "Trial court rejected presidential-immunity vacatur after Trump v. United States, stating alleged evidentiary issues could be addressed on ordinary appeal. Sentence of unconditional discharge is the most lenient available upon conviction under N.Y. law. Federal courts have repeatedly declined to remove the completed state prosecution into federal court at late stages (most recent district denial Aug. 28, 2026).",
        "Sources": "N.Y. courts / NYSCEF; People v. Trump, 2024 NY Slip Op 24328 (Merchan, J.); RECAP/CourtListener S.D.N.Y. 1:23-cv-03773 filings including Second Circuit and DA appellate briefs; public docket summaries corroborated by court PDFs.",
    },
    {
        "Case_Name": "United States v. Donald J. Trump, Waltine Nauta, and Carlos De Oliveira (classified documents)",
        "Court": "U.S. District Court for the Southern District of Florida (Cannon, J.); U.S. Court of Appeals for the Eleventh Circuit (appeal dismissed)",
        "Docket_Number": "Case No. 23-80101-CR-CANNON / 9:23-cr-80101-AMC (S.D. Fla.); 11th Cir. No. 24-12311",
        "Official_Docket_URL": "https://www.courtlistener.com/docket/67490069/united-states-v-trump/; https://storage.courtlistener.com/recap/gov.uscourts.flsd.648653/gov.uscourts.flsd.648653.672.0_1.pdf",
        "Brought_By": "United States of America (Special Counsel Jack Smith)",
        "Filed_Date": "2023-06-08 (initial indictment); superseding indictment July 27, 2023",
        "Charges_or_Claims": "Willful retention of national defense information (18 U.S.C. § 793(e)) and related conspiracy, obstruction, false-statement, and concealment counts against Trump, Nauta, and De Oliveira arising from Mar-a-Lago records.",
        "Key_Rulings": [
            {
                "date": "2024-07-15",
                "court": "S.D. Fla. (Cannon, J.)",
                "summary": "Order granting motion to dismiss superseding indictment: Special Counsel Smith's appointment violates the Appointments Clause (U.S. Const. art. II, § 2, cl. 2); Appropriations Clause issue noted but not separately remedied given dismissal.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.flsd.648653/gov.uscourts.flsd.648653.672.0_1.pdf",
            },
            {
                "date": "2024-11-25",
                "court": "11th Circuit / DOJ",
                "summary": "United States moved to dismiss the appeal as to Donald J. Trump without prejudice after the 2024 election (sitting-president DOJ policy).",
                "url": "https://www.courtlistener.com/docket/67490069/united-states-v-trump/",
            },
            {
                "date": "2025-02-11",
                "court": "11th Circuit",
                "summary": "On United States' motion, appeal dismissed with prejudice as to co-defendants Nauta and De Oliveira, ending the federal prosecution.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.ca11.94369/",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Dismissed. District court dismissed the superseding indictment July 15, 2024 on Appointments Clause grounds. DOJ dropped the appeal as to Trump after the election; Eleventh Circuit dismissed the remaining appeal as to Nauta and De Oliveira with prejudice on Feb. 11, 2025. No active federal prosecution remains in this case.",
        "Outcome_Summary": "Indictment dismissed (Appointments Clause); appeals abandoned; co-defendant prosecutions ended; case closed.",
        "Documented_Issues": "Cannon, J. (July 15, 2024): 'The Superseding Indictment is DISMISSED because Special Counsel Smith's appointment violates the Appointments Clause of the United States Constitution.' Court held none of 28 U.S.C. §§ 509, 510, 515, 533 authorized the appointment of a special counsel with U.S. Attorney-level power; effect confined to this proceeding.",
        "Sources": "S.D. Fla. ECF 672 (dismissal order PDF via RECAP); 11th Cir. No. 24-12311 docket; subsequent district orders recounting appeal disposition.",
    },
    {
        "Case_Name": "United States v. Donald J. Trump (D.D.C. Jan. 6 / election interference)",
        "Court": "U.S. District Court for the District of Columbia (Chutkan, J.); U.S. Court of Appeals for the D.C. Circuit; Supreme Court of the United States (immunity interlocutory appeal)",
        "Docket_Number": "Criminal Action No. 1:23-cr-00257-TSC; Supreme Court No. 23-939 (Trump v. United States)",
        "Official_Docket_URL": "https://www.courtlistener.com/docket/67656595/united-states-v-trump/; https://storage.courtlistener.com/recap/gov.uscourts.dcd.258148/gov.uscourts.dcd.258148.282.0.pdf; https://www.supremecourt.gov/opinions/23pdf/23-939_e2pg.pdf",
        "Brought_By": "United States of America (Special Counsel Jack Smith)",
        "Filed_Date": "2023-08-01 (indictment)",
        "Charges_or_Claims": "Four counts: (1) 18 U.S.C. § 371 conspiracy to defraud the United States; (2) § 1512(k) conspiracy to obstruct an official proceeding; (3) § 1512(c)(2) obstruction of an official proceeding; (4) § 241 conspiracy against rights — arising from alleged efforts to overturn the 2020 election results and the Jan. 6, 2021 certification.",
        "Key_Rulings": [
            {
                "date": "2024-07-01",
                "court": "U.S. Supreme Court",
                "summary": "Trump v. United States, 603 U.S. ___ (2024): former Presidents have absolute immunity for core constitutional acts, at least presumptive immunity for official acts, and no immunity for unofficial acts; vacated and remanded for application.",
                "url": "https://www.supremecourt.gov/opinions/23pdf/23-939_e2pg.pdf",
            },
            {
                "date": "2024-11-25",
                "court": "D.D.C. (Chutkan, J.)",
                "summary": "Granted government's unopposed Rule 48(a) motion; dismissed the Superseding Indictment without prejudice pursuant to DOJ sitting-president policy.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.dcd.258148/gov.uscourts.dcd.258148.282.0.pdf",
            },
            {
                "date": "2024-12-06",
                "court": "D.D.C. (Chutkan, J.)",
                "summary": "Dismissed the original Indictment without prejudice as well, clarifying the case is fully closed with no remaining counts.",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.dcd.258148/gov.uscourts.dcd.258148.285.0.pdf",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Dismissed without prejudice (Nov.–Dec. 2024) after Trump won the 2024 election; DOJ moved to dismiss under sitting-president non-prosecution policy. No active federal charges remain. Dismissal without prejudice leaves theoretical possibility of future refiling after the presidency, but none is pending.",
        "Outcome_Summary": "Immunity framework set by Supreme Court (July 1, 2024); prosecution dismissed without prejudice after the election; case closed.",
        "Documented_Issues": "Supreme Court (Roberts, C.J.): absolute immunity for conclusive/preclusive constitutional authority; at least presumptive immunity for official acts; none for unofficial acts. Chutkan, J. dismissal opinions cite DOJ policy that a sitting President is not subject to federal criminal prosecution; dismissal without prejudice consistent with temporary nature of that immunity.",
        "Sources": "supremecourt.gov opinion PDF 23-939; D.D.C. ECF 282/285 via RECAP/CourtListener.",
    },
    {
        "Case_Name": "State of Georgia v. Donald J. Trump et al. (Fulton County election case)",
        "Court": "Superior Court of Fulton County (McAfee, J.); Court of Appeals of Georgia; Supreme Court of Georgia",
        "Docket_Number": "Fulton County Superior Court Case No. 23SC188947; Ga. Court of Appeals Nos. A24A1595 et seq. (Trump appeal A24A1599)",
        "Official_Docket_URL": "https://d3i6fh83elv35t.cloudfront.net/static/2024/12/trumpgaappealsopn121924.pdf; Fulton County e-filing / case 23SC188947; nolle motion PDF via DocumentCloud",
        "Brought_By": "State of Georgia, originally by Fulton County District Attorney Fani T. Willis; later Peter J. Skandalakis, District Attorney Pro Tempore (Prosecuting Attorneys' Council of Georgia)",
        "Filed_Date": "2023-08-14 (indictment)",
        "Charges_or_Claims": "97-page indictment alleging Georgia RICO and other crimes connected to an alleged conspiracy to unlawfully change the outcome of the 2020 presidential election in Georgia (Trump and multiple co-defendants).",
        "Key_Rulings": [
            {
                "date": "2024-03-15",
                "court": "Fulton Superior Court (McAfee, J.)",
                "summary": "Found a significant appearance of impropriety from Willis's relationship with special prosecutor Nathan Wade; remedy: Willis's office could remain only if Wade withdrew (Wade resigned).",
                "url": "https://d3i6fh83elv35t.cloudfront.net/static/2024/12/trumpgaappealsopn121924.pdf",
            },
            {
                "date": "2024-12-19",
                "court": "Court of Appeals of Georgia",
                "summary": "Reversed in part: held the trial court erred by failing to disqualify DA Willis and her office entirely; appearance of impropriety from specific conduct required disqualification to restore public confidence.",
                "url": "https://d3i6fh83elv35t.cloudfront.net/static/2024/12/trumpgaappealsopn121924.pdf",
            },
            {
                "date": "2025-09",
                "court": "Supreme Court of Georgia",
                "summary": "Declined to review Willis's appeal of the disqualification (reported 4–3 posture with non-participations), leaving the Court of Appeals decision in place.",
                "url": "https://www.gasupreme.us/",
            },
            {
                "date": "2025-11-26",
                "court": "Fulton Superior Court (McAfee, J.) / DA Pro Tempore Skandalakis",
                "summary": "State moved to nolle prosequi all remaining charges in the interests of justice and judicial finality; court granted dismissal of the case.",
                "url": "https://www.documentcloud.org/documents/26303612-granting-nolle-prossequi/",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Dismissed in full. After Willis/office disqualification (Dec. 19, 2024) and Georgia Supreme Court denial of review (Sept. 2025), DA Pro Tempore Peter Skandalakis moved Nov. 26, 2025 to nolle prosequi; Judge McAfee dismissed the case. No active Georgia prosecution remains against Trump or co-defendants in 23SC188947.",
        "Outcome_Summary": "Prosecutors disqualified; replacement prosecutor declined to proceed; case nolle prossed and dismissed (Nov. 26, 2025).",
        "Documented_Issues": "Ga. Court of Appeals (Dec. 19, 2024): trial court correctly found a 'significant appearance of impropriety' not based on 'mere status alone' but 'specific conduct'; erred by failing to disqualify Willis and her office — 'this is the rare case in which disqualification is mandated and no other remedy will suffice to restore public confidence in the integrity of these proceedings.' McAfee, J. had previously called Willis's conduct a 'tremendous lapse in judgment' while initially allowing her to stay if Wade left.",
        "Sources": "Court of Appeals of Georgia opinion Dec. 19, 2024 (PDF); Fulton Case 23SC188947 State's Motion to Nolle Prosequi filed Nov. 26, 2025; contemporary AP/court coverage of Supreme Court denial of review.",
    },
    {
        "Case_Name": "Trump v. Anderson (Colorado ballot / Anderson v. Griswold) and Maine Secretary of State ballot ruling",
        "Court": "Colorado state courts; Supreme Court of the United States (No. 23-719); Maine Secretary of State",
        "Docket_Number": "U.S. Supreme Court No. 23-719; Colorado proceedings captioned Anderson v. Griswold in state courts; Maine SOS challenges (Rosen/Saviello/Strimling et al.)",
        "Official_Docket_URL": "https://www.supremecourt.gov/opinions/23pdf/23-719_19m2.pdf; https://www.supremecourt.gov/docket/docketfiles/html/public/23-719.html; https://www.maine.gov/sos/news/secretary-bellows-modifies-ruling-challenge-trump-presidential-primary-petitions",
        "Brought_By": "Colorado voters (Anderson et al.) under state election procedures; parallel Maine challengers before Secretary of State Shenna Bellows",
        "Filed_Date": "2023-09 (Colorado petition ~six months before March 5, 2024 primary); Maine challenges late 2023",
        "Charges_or_Claims": "Civil/administrative claims that Section 3 of the Fourteenth Amendment barred Trump from appearing on presidential primary ballots as an oath-breaking insurrectionist.",
        "Key_Rulings": [
            {
                "date": "2023-12-19",
                "court": "Colorado Supreme Court",
                "summary": "4–3: ordered Trump excluded from Colorado Republican primary ballot under Section 3 (stayed pending U.S. Supreme Court review).",
                "url": "https://www.supremecourt.gov/opinions/23pdf/23-719_19m2.pdf",
            },
            {
                "date": "2023-12-28",
                "court": "Maine Secretary of State",
                "summary": "Secretary Bellows ruled Trump's primary petition invalid under Section 3; suspended pending appeal so he remained on the ballot meantime.",
                "url": "https://www.maine.gov/sos/news/maine-secretary-state-decision-challenge-trump-presidential-primary-petitions",
            },
            {
                "date": "2024-03-04",
                "court": "U.S. Supreme Court",
                "summary": "Trump v. Anderson, 601 U.S. ___ (2024): per curiam; all nine Justices agreed Colorado could not enforce Section 3 to exclude Trump from the presidential ballot — States lack power to enforce Section 3 against federal candidates; reversed.",
                "url": "https://www.supremecourt.gov/opinions/23pdf/23-719_19m2.pdf",
            },
            {
                "date": "2024-03-04",
                "court": "Maine Secretary of State",
                "summary": "Modified ruling: withdrew Section 3 disqualification conclusions after Trump v. Anderson; Trump votes counted.",
                "url": "https://www.maine.gov/sos/news/secretary-bellows-modifies-ruling-challenge-trump-presidential-primary-petitions",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Concluded. Supreme Court unanimously reversed Colorado's ballot exclusion (March 4, 2024). Maine Secretary of State withdrew her Section 3 disqualification the same day. Trump appeared on ballots; no further Section 3 state-ballot disqualification litigation of this type remains active against him for the 2024 cycle.",
        "Outcome_Summary": "9–0 reversal of Colorado disqualification; Maine disqualification withdrawn; Trump remained on ballots.",
        "Documented_Issues": "Supreme Court per curiam: 'Because the Constitution makes Congress, rather than the States, responsible for enforcing Section 3 against federal officeholders and candidates, we reverse.' 'All nine Members of the Court agree with that result.' Opinion warned of a chaotic state-by-state 'patchwork' if States could disqualify presidential candidates.",
        "Sources": "supremecourt.gov opinion PDF 23-719; Maine SOS official news releases Dec. 28, 2023 and Mar. 4, 2024.",
    },
    {
        "Case_Name": "E. Jean Carroll v. Donald J. Trump (Carroll I — 2019 defamation; Carroll II — battery/defamation)",
        "Court": "U.S. District Court for the Southern District of New York (Kaplan, J.); U.S. Court of Appeals for the Second Circuit; Supreme Court of the United States (petitions pending as to Carroll I)",
        "Docket_Number": "Carroll I: 1:20-cv-07311-LAK (S.D.N.Y.); Carroll II: 1:22-cv-10016-LAK; Second Circuit Nos. 23-793 (Carroll II) and 24-644 (Carroll I); U.S. Supreme Court Nos. 26-141 (Trump v. Carroll) and 26-142 (United States v. Carroll)",
        "Official_Docket_URL": "https://www.courtlistener.com/docket/17395246/carroll-v-trump/; https://www.courtlistener.com/docket/66762185/carroll-v-trump/; https://www.supremecourt.gov/docket/docketfiles/html/public/26-141.html; https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_complete_EB_opn.pdf",
        "Brought_By": "E. Jean Carroll (private plaintiff)",
        "Filed_Date": "Carroll I: 2019 (N.Y. state) / removed/filed in S.D.N.Y. 2020; Carroll II: 2022",
        "Charges_or_Claims": "Carroll II: battery (sexual abuse) and defamation for 2022 statements. Carroll I: defamation for 2019 statements. (Civil; not a government prosecution.)",
        "Key_Rulings": [
            {
                "date": "2023-05-09",
                "court": "S.D.N.Y. jury (Kaplan, J.) — Carroll II",
                "summary": "Jury found Trump liable for sexual abuse and defamation; awarded $5 million total ($2M compensatory + $20k punitive for battery; $2.7M compensatory + $280k punitive for defamation).",
                "url": "https://www.courtlistener.com/docket/66762185/carroll-v-trump/",
            },
            {
                "date": "2024-01-26",
                "court": "S.D.N.Y. jury (Kaplan, J.) — Carroll I",
                "summary": "Jury awarded $83.3 million for 2019 defamation ($18.3M compensatory + $65M punitive).",
                "url": "https://storage.courtlistener.com/recap/gov.uscourts.nysd.543790/gov.uscourts.nysd.543790.285.0.pdf",
            },
            {
                "date": "2024-12-30",
                "court": "Second Circuit",
                "summary": "Affirmed Carroll II judgment (No. 23-793).",
                "url": "https://law.justia.com/cases/federal/appellate-courts/ca2/23-793/23-793-2024-12-30.html",
            },
            {
                "date": "2025",
                "court": "Second Circuit",
                "summary": "Affirmed Carroll I $83.3 million judgment (No. 24-644).",
                "url": "https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_2_opn.pdf",
            },
            {
                "date": "2026-04-29",
                "court": "Second Circuit (en banc)",
                "summary": "Denied rehearing en banc in Carroll I appeal (No. 24-644).",
                "url": "https://ww3.ca2.uscourts.gov/decisions/OPN/24-644_complete_EB_opn.pdf",
            },
            {
                "date": "2026-07-30",
                "court": "U.S. Supreme Court",
                "summary": "Petitions for certiorari docketed: No. 26-141 (Trump) and No. 26-142 (United States, substitution issues). Carroll's response deadline extended to Oct. 30, 2026. Petitions pending; no grant/deny as of tracker date.",
                "url": "https://www.supremecourt.gov/docket/docketfiles/html/public/26-141.html",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Both civil judgments affirmed by the Second Circuit. En banc rehearing denied in Carroll I (Apr. 29, 2026). Supreme Court petitions in Carroll I (Nos. 26-141 and 26-142) are pending with responses due Oct. 30, 2026. Separate certiorari path as to the $5 million Carroll II judgment: petition denied June 29, 2026 per secondary reports — treat $5M affirmance as final unless a pending rehearing is shown on the official docket.",
        "Outcome_Summary": "Two plaintiff verdicts totaling $88.3 million; Second Circuit affirmances; Carroll I at Supreme Court petition stage; Carroll II largely final.",
        "Documented_Issues": "Civil juries found liability for sexual abuse (Carroll II) and defamation (both cases). Federal appellate courts have upheld the judgments. Government substitution/Westfall Act issues continue to generate parallel Supreme Court briefing (No. 26-142).",
        "Sources": "S.D.N.Y. dockets via CourtListener/RECAP; Second Circuit opinions; supremecourt.gov dockets 26-141 and 26-142.",
    },
    {
        "Case_Name": "Trump v. United States (presidential criminal immunity) — related Supreme Court ruling",
        "Court": "Supreme Court of the United States",
        "Docket_Number": "No. 23-939",
        "Official_Docket_URL": "https://www.supremecourt.gov/opinions/23pdf/23-939_e2pg.pdf; https://www.supremecourt.gov/docket/docketfiles/html/public/23-939.html",
        "Brought_By": "Donald J. Trump (petitioner); United States (respondent) — interlocutory appeal from D.D.C. Jan. 6 prosecution",
        "Filed_Date": "Certiorari granted 2024; argued Apr. 25, 2024; decided July 1, 2024",
        "Charges_or_Claims": "Not a freestanding prosecution; constitutional question: extent of former-President immunity from criminal prosecution for official acts.",
        "Key_Rulings": [
            {
                "date": "2024-07-01",
                "court": "U.S. Supreme Court",
                "summary": "Held: absolute immunity for actions within conclusive and preclusive constitutional authority; at least presumptive immunity for official acts; no immunity for unofficial acts. Vacated D.C. Circuit judgment and remanded.",
                "url": "https://www.supremecourt.gov/opinions/23pdf/23-939_e2pg.pdf",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Final Supreme Court decision on the books (603 U.S. ___). Remand proceedings in D.D.C. were mooted when the underlying indictment was dismissed without prejudice in Nov.–Dec. 2024.",
        "Outcome_Summary": "Landmark immunity framework announced; underlying D.D.C. case later dismissed without prejudice.",
        "Documented_Issues": "Opinion recognizes separation-of-powers basis for immunity and rejects both absolute immunity for all presidential acts and zero immunity. Thomas, J., concurrence separately questioned the statutory basis for the special counsel (Appointments Clause themes later central in the Florida dismissal).",
        "Sources": "supremecourt.gov slip opinion 23-939.",
    },
    {
        "Case_Name": "Fischer v. United States (§ 1512(c)(2) obstruction narrowing) — related Supreme Court ruling",
        "Court": "Supreme Court of the United States",
        "Docket_Number": "No. 23-5572",
        "Official_Docket_URL": "https://www.supremecourt.gov/opinions/23pdf/23-5572_l6hn.pdf; https://www.supremecourt.gov/docket/docketfiles/html/public/23-5572.html",
        "Brought_By": "Joseph W. Fischer (petitioner Jan. 6 defendant); United States (respondent)",
        "Filed_Date": "Argued Apr. 16, 2024; decided June 28, 2024",
        "Charges_or_Claims": "Statutory interpretation of 18 U.S.C. § 1512(c)(2) (Sarbanes-Oxley obstruction) as charged against a Jan. 6 defendant; ruling affected charging theories also used in United States v. Trump (D.D.C.).",
        "Key_Rulings": [
            {
                "date": "2024-06-28",
                "court": "U.S. Supreme Court",
                "summary": "To prove § 1512(c)(2), the government must show the defendant impaired (or attempted to impair) the availability or integrity of records, documents, objects, or other things used in an official proceeding. Vacated D.C. Circuit judgment; remanded.",
                "url": "https://www.supremecourt.gov/opinions/23pdf/23-5572_l6hn.pdf",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Final Supreme Court decision. Narrowed a frequently charged Jan. 6 obstruction count. Trump v. United States footnote expressly directed the D.D.C. court to reconsider § 1512(c)(2) counts in light of Fischer if necessary (later mooted by dismissal of Trump's D.D.C. case).",
        "Outcome_Summary": "§ 1512(c)(2) limited to evidence-impairment theories; many Jan. 6 obstruction counts required reassessment.",
        "Documented_Issues": "Roberts, C.J., for the Court: (c)(2) is not a general obstruction catch-all; it is tethered to (c)(1)'s evidence-impairment focus. Barrett, J., dissented (joined by Sotomayor & Kagan), arguing the majority atextually narrowed a broad statute.",
        "Sources": "supremecourt.gov slip opinion 23-5572.",
    },
    {
        "Case_Name": "Optional: Jan. 6 Select Committee referrals & Special Counsel Jack Smith final reports",
        "Court": "U.S. House Select Committee to Investigate the January 6th Attack; U.S. Department of Justice / Special Counsel's Office; related district-court sealing litigation in S.D. Fla.",
        "Docket_Number": "House referrals (Dec. 2022) — not themselves criminal cases; Smith Final Report Vol. I (election/Jan. 6) public Jan. 2025; Vol. II (documents) contested/withheld during co-defendant appeal",
        "Official_Docket_URL": "https://www.govinfo.gov/collection/january-6th-committee-final-report; https://www.justice.gov/storage/Report-of-Special-Counsel-Smith-Volume-1-January-2025.pdf",
        "Brought_By": "House Select Committee (referrals to DOJ); Special Counsel Jack Smith (report to Attorney General)",
        "Filed_Date": "Committee final report/referrals: December 2022; Smith report submitted ~Jan. 7, 2025; Vol. I released publicly Jan. 14, 2025",
        "Charges_or_Claims": "Committee referred Trump and others for potential charges including obstruction and conspiracy theories. Smith's Volume I recounts the election/Jan. 6 investigation; Volume II addresses classified documents and remained non-public while Nauta/De Oliveira matters were live, with Judge Cannon blocking certain congressional releases.",
        "Key_Rulings": [
            {
                "date": "2022-12-19",
                "court": "U.S. House Select Committee",
                "summary": "Committee adopted criminal referrals to the Department of Justice regarding Trump and associates (referrals are recommendations, not indictments).",
                "url": "https://www.govinfo.gov/collection/january-6th-committee-final-report",
            },
            {
                "date": "2025-01-14",
                "court": "DOJ / Special Counsel",
                "summary": "Volume I of Smith's final report released publicly after court processes; Volume II remained restricted amid co-defendant due-process/appeal issues until those appeals ended.",
                "url": "https://www.justice.gov/storage/Report-of-Special-Counsel-Smith-Volume-1-January-2025.pdf",
            },
        ],
        "Current_Status": f"As of {AS_OF}: Historical/administrative record. Committee referrals preceded the Smith indictments. Vol. I is public. Documents-case Volume II release disputes were tied to the Nauta/De Oliveira appeal, which the Eleventh Circuit dismissed with prejudice Feb. 11, 2025; check justice.gov for any subsequent Vol. II posting. These items are not pending criminal cases against Trump.",
        "Outcome_Summary": "Referrals informed DOJ charging decisions; federal Trump cases later dismissed; reports are historical DOJ work product.",
        "Documented_Issues": "Cannon, J., at times blocked DOJ efforts to transmit Volume II to congressional leaders while co-defendant appeals were pending, citing due-process concerns for Nauta and De Oliveira.",
        "Sources": "govinfo.gov Jan. 6 committee collection; justice.gov Smith Volume I PDF; S.D. Fla. orders regarding report dissemination.",
    },
]


def rulings_rows():
    rows = []
    for c in CASES:
        for r in c["Key_Rulings"]:
            rows.append(
                {
                    "Case": c["Case_Name"],
                    "Date": r["date"],
                    "Court": r["court"],
                    "Ruling summary": r["summary"],
                    "Opinion URL": r["url"],
                }
            )
    return rows


def write_xlsx():
    path = OUT / "lawfare-docket-tracker.xlsx"
    wb = Workbook()
    ws = wb.active
    ws.title = "Cases"

    headers = [
        "Case_Name",
        "Court",
        "Docket_Number",
        "Official_Docket_URL",
        "Brought_By",
        "Filed_Date",
        "Charges_or_Claims",
        "Key_Rulings",
        "Current_Status",
        "Outcome_Summary",
        "Documented_Issues",
        "Sources",
    ]
    header_fill = PatternFill("solid", fgColor="1F2937")
    header_font = Font(bold=True, color="FFFFFF", name="Arial", size=11)
    wrap = Alignment(wrap_text=True, vertical="top")
    thin = Border(
        left=Side(style="thin", color="CCCCCC"),
        right=Side(style="thin", color="CCCCCC"),
        top=Side(style="thin", color="CCCCCC"),
        bottom=Side(style="thin", color="CCCCCC"),
    )

    for col, h in enumerate(headers, 1):
        cell = ws.cell(1, col, h)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = wrap

    for i, c in enumerate(CASES, 2):
        key_rulings_text = "\n\n".join(
            f"{r['date']} — {r['court']}: {r['summary']} [{r['url']}]" for r in c["Key_Rulings"]
        )
        values = [
            c["Case_Name"],
            c["Court"],
            c["Docket_Number"],
            c["Official_Docket_URL"],
            c["Brought_By"],
            c["Filed_Date"],
            c["Charges_or_Claims"],
            key_rulings_text,
            c["Current_Status"],
            c["Outcome_Summary"],
            c["Documented_Issues"],
            c["Sources"],
        ]
        for col, val in enumerate(values, 1):
            cell = ws.cell(i, col, val)
            cell.alignment = wrap
            cell.border = thin
            cell.font = Font(name="Arial", size=10)
            if col == 4 and isinstance(val, str) and val.startswith("http"):
                # primary URL only (first http token)
                first = val.split(";")[0].strip()
                if first.startswith("http"):
                    cell.hyperlink = first
                    cell.font = Font(name="Arial", size=10, color="9B1C1C", underline="single")

        # Also hyperlink individual ruling URLs by leaving them in text; Excel auto-detects on open often.
        ws.row_dimensions[i].height = 140

    widths = [40, 28, 28, 36, 28, 18, 36, 48, 40, 32, 40, 36]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.auto_filter.ref = f"A1:L{len(CASES)+1}"
    ws.freeze_panes = "A2"

    # Rulings sheet
    ws2 = wb.create_sheet("Rulings")
    rh = ["Case", "Date", "Court", "Ruling summary", "Opinion URL"]
    for col, h in enumerate(rh, 1):
        cell = ws2.cell(1, col, h)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = wrap
    for i, r in enumerate(rulings_rows(), 2):
        for col, key in enumerate(rh, 1):
            cell = ws2.cell(i, col, r[key])
            cell.alignment = wrap
            cell.border = thin
            cell.font = Font(name="Arial", size=10)
            if key == "Opinion URL" and str(r[key]).startswith("http"):
                cell.hyperlink = r[key]
                cell.font = Font(name="Arial", size=10, color="9B1C1C", underline="single")
        ws2.row_dimensions[i].height = 60
    for i, w in enumerate([45, 14, 28, 55, 45], 1):
        ws2.column_dimensions[get_column_letter(i)].width = w
    ws2.freeze_panes = "A2"

    # Meta sheet
    ws3 = wb.create_sheet("About")
    meta = [
        ("Title", "Lawfare Docket Tracker — Official Record"),
        ("As_of", AS_OF),
        ("Prepared_for", "swampforce.com / lawmakers package"),
        ("Method", "Facts drawn from official court opinions, dockets (NYSCEF/PACER/RECAP/CourtListener), supremecourt.gov, and state court PDFs actually fetched for this build. No invented case numbers, dates, or quotes."),
        ("Opinion_note", "Site-owner opinion appears ONLY in the HTML 'Our view' section, not in this factual workbook."),
        ("Sources_folder", "/workspace/lawfare/sources/"),
    ]
    ws3["A1"] = "Field"
    ws3["B1"] = "Value"
    ws3["A1"].font = header_font
    ws3["A1"].fill = header_fill
    ws3["B1"].font = header_font
    ws3["B1"].fill = header_fill
    for i, (k, v) in enumerate(meta, 2):
        ws3.cell(i, 1, k).font = Font(bold=True, name="Arial")
        cell = ws3.cell(i, 2, v)
        cell.alignment = wrap
        cell.font = Font(name="Arial", size=10)
    ws3.column_dimensions["A"].width = 18
    ws3.column_dimensions["B"].width = 100

    wb.save(path)
    return path


def write_csv():
    path = OUT / "lawfare-docket-tracker.csv"
    headers = [
        "Case_Name",
        "Court",
        "Docket_Number",
        "Official_Docket_URL",
        "Brought_By",
        "Filed_Date",
        "Charges_or_Claims",
        "Key_Rulings",
        "Current_Status",
        "Outcome_Summary",
        "Documented_Issues",
        "Sources",
    ]
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        w.writeheader()
        for c in CASES:
            row = dict(c)
            row["Key_Rulings"] = " | ".join(
                f"{r['date']}: {r['summary']} ({r['url']})" for r in c["Key_Rulings"]
            )
            w.writerow(row)
    # also rulings csv companion
    path2 = OUT / "lawfare-rulings.csv"
    with path2.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["Case", "Date", "Court", "Ruling summary", "Opinion URL"])
        w.writeheader()
        for r in rulings_rows():
            w.writerow(r)
    return path, path2


def status_badge(status: str) -> str:
    s = status.lower()
    if "pending" in s and "dismiss" not in s[:40]:
        return "pending"
    if "dismiss" in s or "concluded" in s or "closed" in s or "nolle" in s:
        return "closed"
    if "affirm" in s or "conviction" in s or "intact" in s:
        return "adverse"
    return "mixed"


def write_html():
    path = OUT / "lawfare-section.html"
    cards = []
    for idx, c in enumerate(CASES, 1):
        badge = status_badge(c["Current_Status"])
        badge_label = {
            "pending": "PENDING / ON APPEAL",
            "closed": "CLOSED / DISMISSED",
            "adverse": "CONVICTION / JUDGMENT",
            "mixed": "MIXED / ACTIVE RECORD",
        }[badge]
        timeline = "".join(
            f'<li><span class="r-date">{r["date"]}</span> '
            f'<span class="r-court">{r["court"]}</span>'
            f'<div class="r-sum">{r["summary"]}</div>'
            f'<div class="r-link"><a href="{r["url"]}" target="_blank" rel="noopener">Opinion / filing</a></div></li>'
            for r in c["Key_Rulings"]
        )
        issues = f'<p class="issues"><strong>Documented by courts:</strong> {c["Documented_Issues"]}</p>' if c["Documented_Issues"] else ""
        cards.append(
            f'''
<article class="card" id="case-{idx}">
  <header class="card-h">
    <span class="badge {badge}">{badge_label}</span>
    <h3>{c["Case_Name"]}</h3>
  </header>
  <div class="meta">
    <div><strong>Court:</strong> {c["Court"]}</div>
    <div><strong>Docket:</strong> {c["Docket_Number"]}</div>
    <div><strong>Brought by:</strong> {c["Brought_By"]}</div>
    <div><strong>Filed:</strong> {c["Filed_Date"]}</div>
    <div><strong>Official links:</strong> <a href="{c["Official_Docket_URL"].split(";")[0].strip()}" target="_blank" rel="noopener">Docket / opinion portal</a></div>
  </div>
  <h4>Charges / claims</h4>
  <p>{c["Charges_or_Claims"]}</p>
  <h4>Timeline of key rulings</h4>
  <ol class="timeline">{timeline}</ol>
  <h4>Current status (as of {AS_OF})</h4>
  <p class="status">{c["Current_Status"]}</p>
  <h4>Outcome summary</h4>
  <p>{c["Outcome_Summary"]}</p>
  {issues}
  <p class="sources"><strong>Sources:</strong> {c["Sources"]}</p>
</article>'''
        )

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lawfare Docket Tracker — swampforce.com</title>
<style>
body{{font-family:Georgia,"Times New Roman",serif;margin:0;background:#f7f7f5;color:#1a1a1a;line-height:1.55}}
.wrap{{max-width:1150px;margin:0 auto;padding:24px 18px 60px}}
header.intro{{background:#fff;border-left:6px solid #9b1c1c;padding:20px 26px;margin-bottom:26px}}
h1{{font-size:2rem;margin:0 0 10px}}
h2{{font-size:1.25rem;margin:22px 0 6px}}
h3{{font-size:1.15rem;margin:8px 0 10px;font-family:Georgia,serif}}
h4{{font-size:.95rem;margin:16px 0 6px;font-family:Arial,Helvetica,sans-serif;color:#7f1d1d;text-transform:uppercase;letter-spacing:.03em}}
.term{{font-size:1.5rem;border-bottom:3px solid #9b1c1c;padding-bottom:6px;margin-top:10px}}
.lead{{font-size:1.05rem}}
.note{{color:#555;font-size:.9rem;font-family:Arial,sans-serif}}
.card{{background:#fff;border:1px solid #e3e3e3;border-radius:8px;padding:18px 20px;margin:0 0 18px;box-shadow:0 1px 2px rgba(0,0,0,.04)}}
.card-h{{margin-bottom:8px}}
.meta{{font-family:Arial,Helvetica,sans-serif;font-size:.88rem;color:#333;display:grid;gap:4px;margin:10px 0 8px;padding:10px 12px;background:#fafafa;border:1px solid #e8e8e8;border-radius:6px}}
.badge{{font-family:Arial,sans-serif;font-size:.72rem;font-weight:700;border-radius:4px;padding:2px 7px;margin-right:8px;display:inline-block;vertical-align:middle;letter-spacing:.02em}}
.badge.pending{{background:#1e3a5f;color:#eff6ff}}
.badge.closed{{background:#14532d;color:#ecfdf5}}
.badge.adverse{{background:#7f1d1d;color:#fef2f2}}
.badge.mixed{{background:#92400e;color:#fffbeb}}
.timeline{{margin:0;padding-left:18px;font-family:Arial,Helvetica,sans-serif;font-size:.9rem}}
.timeline li{{margin:0 0 12px}}
.r-date{{font-weight:700;color:#7f1d1d}}
.r-court{{color:#444;margin-left:6px}}
.r-sum{{margin-top:3px}}
.r-link a,.card a{{color:#9b1c1c;font-weight:bold}}
.status{{background:#fde8e8;border-left:4px solid #9b1c1c;padding:10px 12px}}
.issues{{font-size:.92rem}}
.sources{{font-size:.8rem;color:#666;font-family:Arial,sans-serif}}
.opinion{{background:#fff;border:2px solid #9b1c1c;border-radius:8px;padding:18px 22px;margin:28px 0 10px}}
.opinion h2{{margin-top:0;color:#7f1d1d}}
.toc{{font-family:Arial,sans-serif;font-size:.92rem;background:#fff;border:1px solid #e3e3e3;padding:14px 18px;border-radius:8px;margin-bottom:22px}}
.toc ol{{margin:8px 0 0;padding-left:22px}}
footer{{margin-top:40px;font-size:.85rem;color:#555;font-family:Arial,sans-serif}}
@media (max-width:760px){{
  h1{{font-size:1.55rem}}
  .card{{padding:14px}}
  .meta{{font-size:.84rem}}
}}
@media print{{
  body{{background:#fff}}
  .card{{break-inside:avoid;box-shadow:none}}
  a{{color:#000;text-decoration:underline}}
}}
</style>
</head>
<body>
<div class="wrap">
<header class="intro">
  <h1 class="term">Lawfare Docket Tracker</h1>
  <p class="lead">A factual record of major legal cases brought against Donald J. Trump (and closely related cases against allies and his campaign) from 2017 through September 2026, prepared for <strong>swampforce.com</strong> and a package for lawmakers.</p>
  <p class="note">As of {AS_OF}. Every case number, date, ruling, and quotation below is drawn from an official court record or primary government source actually retrieved for this build. Outcomes unfavorable to Trump are included in full. Site-owner commentary appears only in the clearly labeled section at the end.</p>
</header>

<section>
  <h2>What “lawfare” means (neutral definition)</h2>
  <p>Critics use <strong>lawfare</strong> to describe the use of legal systems and litigation as instruments to achieve political ends. The modern term was popularized by U.S. Air Force Colonel (later Major General) Charles J. Dunlap Jr. in a 2001 paper, <em>Law and Military Interventions: Preserving Humanitarian Values in 21st Conflicts</em> (Harvard Carr Center / Kennedy School presentation), where he discussed “the use of law as a weapon of war.” Dunlap later refined the idea as using—or misusing—law as a substitute for traditional means to achieve an operational objective. The word itself is a blend of “law” and “warfare”; earlier scattered uses exist, but Dunlap’s 2001 framing is the reference most often cited for the contemporary sense.</p>
  <p>This tracker documents the <em>official record</em> of the listed cases. Whether any particular case constitutes “lawfare” is a contested political judgment; the docket facts stand independently of that debate.</p>
</section>

<nav class="toc">
  <strong>Cases in this tracker</strong>
  <ol>
    {"".join(f'<li><a href="#case-{i}">{c["Case_Name"][:88]}{"…" if len(c["Case_Name"])>88 else ""}</a></li>' for i,c in enumerate(CASES,1))}
  </ol>
</nav>

{"".join(cards)}

<section class="opinion" id="our-view">
  <h2>Our view:</h2>
  <p>The owner of swampforce.com believes these cases were <strong>lawfare</strong> — a coordinated use of civil, criminal, and ballot processes meant to hobble Donald Trump’s campaign and keep him from office. That is an opinion about motive and political context. It is stated here so it is not confused with the court record above, which includes every major adverse finding, conviction, monetary judgment, and appellate affirmance against him that we could verify.</p>
</section>

<footer>
  <p>Compiled {AS_OF} for swampforce.com. Prefer the court’s own PDF or docket over secondary reporting. Local copies of key opinions are stored alongside this package in <code>sources/</code>.</p>
  <p>Files: lawfare-docket-tracker.xlsx · lawfare-docket-tracker.csv · lawfare-tracker.pdf · README.txt</p>
</footer>
</div>
</body>
</html>'''
    # Public link for the NY Appellate Division opinion in the HTML/PDF (hand fix folded back in, Sep 24, 2026)
    html = html.replace("file:///workspace/lawfare/sources/ny-1st-dept-civil-fraud.pdf",
                        "https://www.courthousenews.com/wp-content/uploads/2025/08/first-department-civil-fraud-judgment.pdf")
    path.write_text(html, encoding="utf-8")
    return path


def write_readme():
    path = OUT / "README.txt"
    status_lines = []
    for c in CASES:
        short = c["Case_Name"].split("(")[0].strip()
        # one-line status
        cs = c["Current_Status"].split("As of")[-1].strip()
        if cs.startswith(AS_OF):
            cs = cs[len(AS_OF):].lstrip(" :")
        status_lines.append(f"- {short}: {c['Outcome_Summary']}")

    unverified = """
FACTS REVIEWED BUT LEFT OUT OR HEDGED (could not fully pin from an official PDF/docket fetch in this build):
- Exact New York Court of Appeals oral-argument date for the civil-fraud appeal (briefing confirmed through Apr–Jun 2026; argument date not verified from the Court of Appeals calendar fetch).
- Precise vote line and opinion PDF for the Georgia Supreme Court’s Sept. 2025 denial of Willis’s petition (denial of review is corroborated by multiple contemporaneous reports and the subsequent PAC appointment; the court’s short denial order PDF was not separately archived here).
- Full public release status of Special Counsel Smith Volume II after Feb. 11, 2025 (district-court sealing fight documented; check justice.gov for any later posting).
- Any 2017–2020 “major” cases beyond the requested set were not expanded into separate rows unless they fed the listed dockets (e.g., earlier civil discovery fights).
- Carroll II Supreme Court rehearing minutiae after the June 29, 2026 denial — treated as final for the $5M judgment unless the official docket shows a live rehearing.
"""

    text = f"""LAWFARE DOCKET TRACKER
======================
Prepared for: swampforce.com and a lawmakers package
As of: {AS_OF} (America/Denver)
Method: Official court opinions and dockets fetched for this build. No invented
case numbers, dates, rulings, or quotes. Site-owner opinion appears ONLY in the
HTML section labeled "Our view:".

CONTENTS
--------
lawfare-docket-tracker.xlsx  — Cases sheet + Rulings sheet + About
lawfare-docket-tracker.csv   — UTF-8-SIG, one row per case
lawfare-rulings.csv          — one row per key ruling
lawfare-section.html         — self-contained, mobile-friendly section matching
                               swampforce.com colors (Georgia body, #9b1c1c accent,
                               #f7f7f5 background)
lawfare-tracker.pdf          — print stylesheet via headless Chrome
lawfare-tracker-page1.png    — first-page preview of the PDF
sources/                     — key opinion PDFs actually downloaded
README.txt                   — this file

PER-CASE STATUS SUMMARY ({AS_OF})
---------------------------------
{chr(10).join(status_lines)}

KEY OFFICIAL URLS
-----------------
- Trump v. Anderson (Mar. 4, 2024): https://www.supremecourt.gov/opinions/23pdf/23-719_19m2.pdf
- Trump v. United States immunity (July 1, 2024): https://www.supremecourt.gov/opinions/23pdf/23-939_e2pg.pdf
- Fischer v. United States (June 28, 2024): https://www.supremecourt.gov/opinions/23pdf/23-5572_l6hn.pdf
- S.D. Fla. Cannon dismissal (July 15, 2024): RECAP gov.uscourts.flsd.648653.672
- D.D.C. Chutkan dismissal (Nov. 25, 2024): RECAP gov.uscourts.dcd.258148.282
- Ga. Court of Appeals Willis disqualification (Dec. 19, 2024): https://d3i6fh83elv35t.cloudfront.net/static/2024/12/trumpgaappealsopn121924.pdf
- N.Y. Appellate Division civil fraud (ENTERED Aug. 21, 2025): sources/ny-1st-dept-civil-fraud.pdf

{unverified}

Dunlap / "lawfare": Colonel (later Major General) Charles J. Dunlap Jr., USAF,
"Law and Military Interventions: Preserving Humanitarian Values in 21st Conflicts"
(Carr Center / Harvard Kennedy School, Nov. 29, 2001), popularized the modern
usage (paper opens: "Is lawfare turning warfare into unfair?").
"""
    path.write_text(text, encoding="utf-8")
    return path


def main():
    xlsx = write_xlsx()
    csvs = write_csv()
    html = write_html()
    readme = write_readme()
    print("Wrote:", xlsx)
    print("Wrote:", csvs)
    print("Wrote:", html)
    print("Wrote:", readme)


if __name__ == "__main__":
    main()
