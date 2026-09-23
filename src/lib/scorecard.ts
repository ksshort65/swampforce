export type ScoreCol = "gop" | "dem" | "dsa";

export type ScoreRow = {
  topic: string;
  gop: string;
  dem: string;
  dsa: string;
  href?: string;
};

/** Living midterms card. Update the cells when a vote or a Treasury table changes the file. */
export const SCORE_UPDATED = "2026-09-23";

/** Cover and Scorecard. Five rooms of the Congressional Scorecard. */
export type ScoreRoom = "gop" | "dem" | "split" | "oval" | "compare";
export const SCORE_TABS: { id: ScoreRoom; k: string; v: string }[] = [
  { id: "gop", k: "Republicans", v: "Bills they passed. Debt they added." },
  { id: "dem", k: "Democrats", v: "Bills they passed. The border they opened." },
  { id: "split", k: "Split", v: "One chamber each. Largest slice of the debt." },
  { id: "oval", k: "The Oval", v: "Four presidents. Trump 1 and Trump 2." },
  { id: "compare", k: "Side by side", v: "Helped and hurt on one page." },
];
/** @deprecated use SCORE_TABS */
export const SCORE_FILES = SCORE_TABS;

/**
 * Farmers. First file in the wealth ledger.
 * 2026 dollars are the figures USDA printed on September 3, 2026.
 * 2025 dollars are that figure plus or minus the change USDA printed in the same sentence.
 * Chapter 12 counts are U.S. Courts Table F-2, 12 months ending December 31.
 */
export const FARM = {
  asOf: "September 3, 2026",
  incomeHref:
    "https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/farm-sector-income-forecast",
  rows: [
    {
      k: "What it cost to farm",
      y2025: 471.6,
      y2026: 492.8,
      note: "Production expenses, including the operator’s dwelling. Fertilizer, fuel, and livestock purchases are the increase.",
    },
    {
      k: "The government check",
      y2025: 27.9,
      y2026: 47.4,
      note: "Direct farm payments. USDA says the increase is commodity payments plus supplemental and ad hoc aid Congress authorized. Crop insurance indemnities are not in this number.",
    },
    {
      k: "What was left",
      y2025: 162.7,
      y2026: 158.4,
      note: "Net farm income. The check got $19.5 billion bigger. The bill got $21.2 billion bigger. Income still fell $4.3 billion.",
    },
  ],
  filings: {
    y2024: 216,
    y2025: 315,
    href2024: "https://www.uscourts.gov/sites/default/files/2025-01/bf_f2_1231.2024.pdf",
    href2025: "https://www.uscourts.gov/sites/default/files/document/bf_f2_1231.2025.pdf",
  },
  loans: {
    k: "The operating loan got 30 percent larger in 2025, after inflation. The fourth-quarter volume of new operating loans was up nearly 40 percent. Kansas City Fed, from the National Survey of Terms of Lending to Farmers.",
    href: "https://www.kansascityfed.org/agriculture/agfinance-updates/larger-operating-loans-boost-farm-lending-activity-in-2025/",
  },
  hire: [
    {
      k: "The salary",
      v: "Most members are paid $174,000. The Speaker is paid $223,500. The leaders are paid $193,400. Those rates have not moved since 2009. They are paid out of the Treasury, under a statute Congress passes.",
      href: "https://www.congress.gov/crs-product/RL30064",
    },
    {
      k: "The pension",
      v: "A member on the older congressional formula, twenty years at $174,000, draws about $59,160 a year. Members who entered after 2012 accrue less. As of October 1, 2022, 619 retired members were still drawing a pension tied to that service.",
      href: "https://www.congress.gov/crs-product/RL30631",
    },
    {
      k: "The trade",
      v: "The STOCK Act did not ban a member from trading stocks. It ordered the member to disclose the trade. The report is public. The gain is the member’s.",
      href: "https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf",
    },
  ],
};

export type OvalDesk = "four" | "trump1" | "trump2";
export const OVAL_DESKS: { id: OvalDesk; k: string; v: string }[] = [
  { id: "four", k: "Four Ovals", v: "Encounters and prices by president." },
  { id: "trump1", k: "Trump 1", v: "FY2017–20. Caption versus tape." },
  { id: "trump2", k: "Trump 2", v: "FY2025–. The door. The slogan." },
];


/** Treasury Debt to the Penny. Unified Congress = House and Senate same party. Adds to the current total. */
export const DEBT_NOW = {
  asOf: "September 17, 2026",
  total: "$40.09 trillion",
  href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/",
};

export const DEBT_TALLY: {
  who: string;
  when: string;
  added: string;
  href: string;
}[] = [
  {
    who: "Republican majority — House and Senate",
    when: "1861–75 · 1881–83 · 1889–91 · 1895–1911 · 1919–31 · 1947–49 · 1953–55 · 1995–2001 · 2003–07 · 2015–19 · 2025–now",
    added: "+$10.96 trillion",
    href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
  },
  {
    who: "Democratic majority — House and Senate",
    when: "1857–59 · 1875–81 · 1893–95 · 1913–19 · 1933–47 · 1949–53 · 1955–81 · 1987–95 · 2007–11 · 2021–23",
    added: "+$12.65 trillion",
    href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
  },
  {
    who: "Split — one chamber each",
    when: "Every other year since 1857 — one house each",
    added: "+$16.48 trillion",
    href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
  },
];

export const DEBT_MATH =
  "$10.96 + $12.65 + $16.48 = $40.09. Before 1857 the two parties did not yet run the modern Congress. The debt then was $29 million.";

/** Article I. Majority control is the purse. */
export const PURSE = {
  k: "Congress holds the purse. Majority control is the test.",
  v: "Article I gives Congress the power of the purse. The Oval spends what Congress votes. Majority control means one party holds the House and the Senate at the same time. Then that party can pass a spending bill without the other. Helped and hurt on this page are the bills they passed and the prices, the border, and the debt that followed. A speech is not a record.",
  href: "https://constitution.congress.gov/constitution/article-1/",
};

/** Obama’s two terms. The purse moved. The journal keeps both. */
export const OBAMA_TERMS: {
  who: string;
  majority: string;
  plus: { k: string; bill: string; href: string }[];
  minus: { k: string; bill: string; href: string }[];
}[] = [
  {
    who: "Obama, first term · 2009–13",
    majority:
      "Democratic majority, House and Senate, January 2009–January 2011. Then a Republican House. Split.",
    plus: [
      {
        k: "Lilly Ledbetter Fair Pay Act.",
        bill: "S. 181 · 2009",
        href: "https://www.congress.gov/bill/111th-congress/senate-bill/181",
      },
      {
        k: "CHIP reauthorized.",
        bill: "H.R. 2 · 2009",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/2",
      },
    ],
    minus: [
      {
        k: "Stimulus after the crash. The meter jumped.",
        bill: "H.R. 1 · ARRA · 2009",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/1",
      },
      {
        k: "ObamaCare: new taxes and a mandate, Democratic majority, 2010.",
        bill: "H.R. 3590 · 2010",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/3590",
      },
      {
        k: "CPI 3.9%, September 2011. Split Congress. Obama Oval.",
        bill: "BLS CPI · September 2011",
        href: "https://www.bls.gov/news.release/archives/cpi_10192011.htm",
      },
    ],
  },
  {
    who: "Obama, second term · 2013–17",
    majority:
      "Split until January 2015. Republican majority, House and Senate, 2015–17. The Oval was still Obama. The purse was not.",
    plus: [
      {
        k: "CPI stayed low after 2011. No 9% spike in this term.",
        bill: "BLS CPI",
        href: "https://www.bls.gov/cpi/",
      },
    ],
    minus: [
      {
        k: "DACA, June 15, 2012, carried through the second term. A memo. Not a vote.",
        bill: "DHS / USCIS",
        href: "https://www.uscis.gov/humanitarian/consideration-of-deferred-action-for-childhood-arrivals-daca",
      },
      {
        k: "Southwest Border Patrol, eight fiscal years: 3.31 million. FY2014 unaccompanied-child spike sat in this Oval.",
        bill: "CBP · FY1960–2019",
        href: "https://www.cbp.gov/document/stats/us-border-patrol-fiscal-year-southwest-border-sector-apprehensions-fy-1960-fy-2019",
      },
      {
        k: "Republican majority 2015–17 did not close October 1. Debt still climbed on a Republican purse and a Democratic Oval.",
        bill: "Treasury",
        href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
      },
    ],
  },
];


/** Official statute and table. Always on the page. Not a caption. */
export const LAWS: { k: string; href: string }[] = [
  { k: "Article IV — republican form of government", href: "https://constitution.congress.gov/constitution/article-4/" },
  { k: "Article VI — supremacy", href: "https://constitution.congress.gov/constitution/article-6/" },
  { k: "The oath — 5 U.S.C. § 3331", href: "https://www.law.cornell.edu/uscode/text/5/3331" },
  { k: "Budget Act — twelve bills by October 1", href: "https://www.congress.gov/bill/93rd-congress/house-bill/7130" },
  { k: "GAO — fraud $233–521B a year", href: "https://www.gao.gov/products/gao-25-107746" },
  { k: "Treasury — debt to the penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
  { k: "8 U.S.C. § 1324 — harboring", href: "https://www.law.cornell.edu/uscode/text/8/1324" },
  { k: "8 U.S.C. § 1373 — no gag on ICE", href: "https://www.law.cornell.edu/uscode/text/8/1373" },
  { k: "8 U.S.C. § 1611 — federal benefits", href: "https://www.law.cornell.edu/uscode/text/8/1611" },
  { k: "2 U.S.C. § 1415 — they billed you for their misconduct", href: "https://www.law.cornell.edu/uscode/text/2/1415" },
  { k: "18 U.S.C. § 2383 — insurrection", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
];

/** The caption, then the charge sheet. Official files. */
export const HOAXES: { k: string; v: string; href: string }[] = [
  {
    k: "Taxpayer-funded hoaxes",
    v: "Caption, evidence they used, where it came from, what the official file later showed. Russia: Durham said no actual evidence of collusion when the case opened. Mueller did not establish a conspiracy. First impeachment: a phone call about corruption in a country receiving aid — the executive’s job. Senate acquitted. Second impeachment: a speech they clipped. Zero charged under 18 U.S.C. § 2383. The public paid.",
    href: "https://www.justice.gov/storage/durhamreport.pdf",
  },
  {
    k: "They called it protest",
    v: "EO 14252 restores monuments, takes graffiti off the marble, and enforces the capital. FBI 2025: murder 4.1, tied with 1955–56. The 2020 caption was mostly peaceful. The 2020 bar was 6.6. The cleanup is hated because it is a verdict on that caption.",
    href: "https://www.federalregister.gov/documents/2025/03/31/2025-05630/making-the-district-of-columbia-safe-and-beautiful",
  },
  {
    k: "Crossfire Hurricane",
    v: "Durham: no actual evidence of collusion in the holdings when the FBI opened a full investigation. Ranking members told the country it was more than circumstantial. Networks ran that sentence for the entire first term. Mueller did not establish a conspiracy. They ran it anyway. That is how you poison a presidency and divide a nation.",
    href: "https://www.justice.gov/storage/durhamreport.pdf",
  },
  {
    k: "Parents as a federal problem",
    v: "The National School Boards Association, September 29, 2021, asked the White House to treat threats around school boards as possibly ‘the equivalent to a form of domestic terrorism.’ Five days later the Attorney General ordered U.S. Attorneys and the FBI to coordinate. The FBI opened an EDUOFFICIALS tag. NSBA later apologized for the language. The memo stayed.",
    href: "https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf",
  },
  {
    k: "The J6 panel was stacked",
    v: "H.Res. 503 gave the Speaker the appointments. She named Liz Cheney and Adam Kinzinger. She rejected the minority leader’s picks, Jim Jordan and Jim Banks. A select committee that chooses its own opposition is not a jury. It is a production.",
    href: "https://www.congress.gov/bill/117th-congress/house-resolution/503",
  },
  {
    k: "The charge was not insurrection",
    v: "The country was told insurrection. 18 U.S.C. § 2383 is the insurrection statute. The U.S. Attorney for D.C. published the tally: about 1,583 federally charged. Assault, trespass, civil disorder, about 18 charged with seditious conspiracy under § 2384. Zero charged under § 2383. The caption did work the statute did not.",
    href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol",
  },
  {
    k: "The tape sat in the House",
    v: "The Capitol’s cameras recorded thousands of hours. The select committee showed clips. The full archive was not put in the public’s hands while the hearings ran. Later Speakers opened more of it. A hearing that holds the tape and plays the minutes it prefers is the same method as a six-second caption.",
    href: "https://www.congress.gov/committee/house-administration/hsha00",
  },
  {
    k: "A board to govern ‘disinformation’",
    v: "DHS stood up a Disinformation Governance Board in 2022. The Secretary told Congress it would combat a threat to homeland security. The department terminated the board and rescinded its charter on August 24, 2022. A cabinet department had named a board to police the information the public would receive.",
    href: "https://www.dhs.gov/archive/news/2022/08/24/following-hsac-recommendation-dhs-terminates-disinformation-governance-board",
  },
  {
    k: "The FISA file was not scrupulously accurate",
    v: "Inspector General Horowitz: seventeen inaccuracies and omissions across the Carter Page FISA applications used to surveil a U.S. person tied to a presidential campaign. The caption was Russia. The applications were not scrupulously accurate.",
    href: "https://oig.justice.gov/reports/2019/o1912.pdf",
  },
  {
    k: "Two impeachments. Four dockets. Taxpayer-funded.",
    v: "First: a July 25, 2019 call the White House released. He asked about corruption involving the Bidens. The House called it abuse of power. The Senate acquitted February 5, 2020. Second: a January 6 speech. C-SPAN recorded peacefully and patriotically on the same tape as fight like hell. The House put a clipped version on the floor. H.Res. 24 named insurrection. USAO-DC: zero under § 2383. Senate acquitted February 13, 2021. Then four criminal dockets at once, a special counsel on appropriated funds. Process as punishment against the hire is process against the people who hired him.",
    href: "https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf",
  },
  {
    k: "The House record on the machine",
    v: "H.Res. 12 created the Select Subcommittee on the Weaponization of the Federal Government. The committee published that the executive had pressured platforms and that fifty-one former intelligence officials had signed a letter treating the Hunter Biden laptop as a Russian trick weeks before the 2020 vote. Read the House file. A panel is not a court. It is the other ledger.",
    href: "https://judiciary.house.gov/media/press-releases/new-judiciary-committee-website-highlights-activities-and-findings-select",
  },
];

/** The paper, not the caption. What each docket charged. What it did not. */
export const PAPERS: {
  k: string;
  caption: string;
  paper: string;
  href: string;
  extra?: { label: string; href: string }[];
}[] = [
  {
    k: "Mueller — no conspiracy",
    caption: "The campaign colluded with Russia.",
    paper: "The Special Counsel’s report: the investigation did not establish that members of the Trump Campaign conspired or coordinated with the Russian government. No indictment of Donald J. Trump. Volume I, charging decisions: the evidence was not sufficient to charge a broader conspiracy.",
    href: "https://www.justice.gov/archives/sco-mueller",
    extra: [
      { label: "Barr remarks on the report — April 18, 2019", href: "https://www.justice.gov/archives/opa/speech/attorney-general-william-p-barr-delivers-remarks-release-report-investigation-russian" },
      { label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
    ],
  },
  {
    k: "D.C. 23-cr-257 — four counts. Not insurrection.",
    caption: "January 6 was insurrection. He should be charged under 18 U.S.C. § 2383.",
    paper: "Superseding indictment, United States District Court for the District of Columbia, United States v. Donald J. Trump, 23-cr-257 (TSC). Count 1: 18 U.S.C. § 371, conspiracy to defraud the United States. Count 2: § 1512(k), conspiracy to obstruct an official proceeding. Count 3: §§ 1512(c)(2), 2, obstruction. Count 4: § 241, conspiracy against rights. Section 2383 is not on the paper. Special Counsel Smith’s Volume I, January 7, 2025, explains the charging decision not to use the insurrection statute. Judge Chutkan dismissed the indictment without prejudice after the 2024 election, on the government’s motion.",
    href: "https://www.justice.gov/sco-smith/media/1366521/dl",
    extra: [
      { label: "18 U.S.C. § 2383 — the statute that is not on the indictment", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
      { label: "Smith Volume I — January 7, 2025", href: "https://www.justice.gov/storage/Report-of-Special-Counsel-Smith-Volume-1-January-2025.pdf" },
    ],
  },
  {
    k: "USAO-DC — 1,583 people. Zero under § 2383.",
    caption: "The country was told insurrection. The hearings used the word.",
    paper: "U.S. Attorney for the District of Columbia, 48-month tally: approximately 1,583 federally charged. Assault, trespass, civil disorder, destruction of property. About 18 charged with seditious conspiracy under 18 U.S.C. § 2384. Zero charged under the insurrection statute, § 2383. The charging documents are on the Capitol Breach resource page.",
    href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol",
    extra: [
      { label: "Capitol breach cases — the public papers", href: "https://www.justice.gov/usao-dc/capitol-breach-cases" },
    ],
  },
  {
    k: "Florida 23-cr-80101 — documents. Dismissed.",
    caption: "He stole nuclear secrets. Espionage.",
    paper: "Southern District of Florida, United States v. Trump, Nauta, and De Oliveira, 9:23-cr-80101. The indictment charged retention of national-defense information and obstruction related to boxes at Mar-a-Lago. It did not charge insurrection. Judge Aileen Cannon dismissed the indictment on July 15, 2024, holding the special counsel’s appointment unlawful. The government later dropped the remainder.",
    href: "https://www.justice.gov/storage/US_v_Trump-Nauta_23-80101.pdf",
    extra: [
      { label: "Cannon order — CourtListener docket", href: "https://www.courtlistener.com/docket/67490070/united-states-v-trump/" },
    ],
  },
  {
    k: "New York 71543-23 — thirty-four records counts",
    caption: "The most serious crimes. Election interference as a felony theory.",
    paper: "Supreme Court of the State of New York, County of New York, The People of the State of New York v. Donald J. Trump, Indictment No. 71543-23. Thirty-four counts of falsifying business records in the first degree, New York Penal Law § 175.10. Invoices, vouchers, and checks. Not 18 U.S.C. § 2383. Not a federal conspiracy with Russia. The verdict sheet names each count as falsifying business records.",
    href: "https://www.documentcloud.org/documents/23741570-new-york-v-trump-indictment/",
    extra: [
      { label: "Statement of facts — IND-71543-23", href: "https://www.documentcloud.org/documents/23741594-donald-j-trump-sof/" },
    ],
  },
  {
    k: "Fulton County — Georgia RICO. Not federal insurrection.",
    caption: "He stole Georgia. RICO as if it were January 6.",
    paper: "Fulton County Superior Court, The State of Georgia v. Donald John Trump et al., indictment filed August 14, 2023. Trump is named on thirteen counts including O.C.G.A. § 16-14-4(c), Georgia RICO, solicitation of a public officer to violate an oath, conspiracy to commit forgery and false statements. It is a state paper. It does not charge 18 U.S.C. § 2383. The court dismissed the case November 26, 2025.",
    href: "https://storage.courtlistener.com/recap/gov.uscourts.gand.319434/gov.uscourts.gand.319434.1.1.pdf",
  },
  {
    k: "Two impeachments — articles, not a criminal indictment",
    caption: "Impeached for insurrection. Removed.",
    paper: "H.Res. 755, 116th Congress: abuse of power and obstruction of Congress, the July 25, 2019 call. Senate acquitted February 5, 2020. H.Res. 24, 117th Congress: incitement of insurrection. That is a House article. It is not a grand-jury indictment under § 2383. Senate acquitted February 13, 2021. The criminal docket that followed still did not charge § 2383.",
    href: "https://www.congress.gov/bill/117th-congress/house-resolution/24",
    extra: [
      { label: "H.Res. 755 — first impeachment", href: "https://www.congress.gov/bill/116th-congress/house-resolution/755" },
      { label: "July 25, 2019 call memorandum", href: "https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf" },
    ],
  },
];

/** Read — method, not a mood. Caption versus the rest of the sentence. */
export const WARFARE = {
  k: "Psychological warfare and gaslighting",
  war: "Psychological warfare here is not a battlefield. It is an information operation run on a country. A caption is written. Six seconds are cut from a speech. One word is swapped. The country is then taught to hate the neighbor and to distrust the thing in front of its own eyes. The file is still there. The method is to make the file feel rude to mention. The target is the American argument.",
  gas: "Gaslighting is the method inside that operation. A speaker replaces what happened with a word that cannot survive the file, then repeats the word until the listener treats the file as the lie. The rest of the sentence can stay true. The swapped word does all the work. Kidnapped instead of arrested. Insurrection instead of a docket that never charged it. Mostly peaceful under a precinct on fire. The listener is not argued with. The listener is trained.",
  clip: "They stop the statement short. They play six seconds. They do not play the rest of the answer. A hearing that holds thousands of hours and plays the minutes it prefers is the same method as a six-second package. BBC stuck two January 6 lines fifty-four minutes apart. Bloodbath was auto plants in Mexico and a tariff. Dictator was close the border, drill, then “after that, I’m not a dictator.” Fine people condemned neo-Nazis in the same remarks. Play the whole tape or it is not journalism. It is a frame.",
  frame: "Narrative framing is the one-word swap. Change the noun, teach the opposite crime. The United States becomes the kidnapper. A campaign becomes a Russian agent. A riot becomes a protest. A warrant becomes a snatch. Read across: left is what ran. Right is what the recording and the statute still contain.",
};

export const FAKE_NEWS: {
  tag: string;
  they: string;
  tape: string;
  href?: string;
}[] = [
  {
    tag: "Bloodbath",
    they: "If he loses it will be a bloodbath. He wants another January 6.",
    tape: "Chinese car plants in Mexico. A 100 percent tariff. “They’re not going to sell those cars.”",
    href: "https://www.youtube.com/watch?v=f57dRZMS0PQ",
  },
  {
    tag: "Dictator",
    they: "He said he will be a dictator on day one.",
    tape: "Close the border. Drill, drill, drill. “After that, I’m not a dictator.”",
    href: "https://www.youtube.com/watch?v=7lB3bfVg8Z8",
  },
  {
    tag: "Fine people",
    they: "He called neo-Nazis very fine people.",
    tape: "Same remarks: neo-Nazis and white nationalists “should be condemned totally.”",
    href: "https://www.politico.com/story/2017/08/15/full-text-trump-comments-white-supremacists-alt-left-transcript-241662",
  },
  {
    tag: "January 6 speech",
    they: "Walk to the Capitol and fight like hell, as one order.",
    tape: "“Peacefully and patriotically.” The BBC splice stuck two lines fifty-four minutes apart.",
    href: "https://www.npr.org/2021/02/10/966396848/read-trumps-jan-6-speech-a-key-part-of-impeachment-trial",
  },
  {
    tag: "Bleach",
    they: "He told Americans to inject bleach.",
    tape: "He asked doctors if ultraviolet light and disinfectant research was “interesting to check.”",
    href: "https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-vice-president-pence-members-coronavirus-task-force-press-briefing-31/",
  },
  {
    tag: "Animals",
    they: "He called immigrants animals.",
    tape: "The roundtable was MS-13. Outlets that widened it had to walk it back.",
  },
  {
    tag: "Suckers / losers",
    they: "He called veterans suckers and losers.",
    tape: "No recording. The Atlantic, anonymous. This journal does not invent audio.",
  },
];

export const FRAMES: {
  tag: string;
  they: string;
  tape: string;
  href?: string;
}[] = [
  {
    tag: "Kidnapped",
    they: "The United States kidnapped the president of Venezuela.",
    tape: "Southern District of New York indictment, March 26, 2020. Custody January 3, 2026. Arraigned in Brooklyn. A warrant executed is not a kidnapping.",
    href: "https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current",
  },
  {
    tag: "Collusion",
    they: "The campaign colluded with Russia.",
    tape: "Durham: the FBI opened a full investigation on raw, uncorroborated intelligence. It did not have actual evidence of collusion in its holdings when the case began.",
    href: "https://www.justice.gov/storage/durhamreport.pdf",
  },
  {
    tag: "Insurrection",
    they: "January 6 was insurrection.",
    tape: "18 U.S.C. § 2383. About 1,583 federally charged. Zero under the insurrection statute.",
    href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol",
  },
  {
    tag: "Mostly peaceful",
    they: "Mostly peaceful protests.",
    tape: "A precinct burned. The word peaceful did the work the picture would not.",
  },
  {
    tag: "Muslim ban",
    they: "He banned Muslims.",
    tape: "Proclamation 9645. The Supreme Court upheld it in Trump v. Hawaii. Countries, not a faith test.",
    href: "https://www.supremecourt.gov/opinions/17pdf/17-965_h315.pdf",
  },
  {
    tag: "Kids in cages",
    they: "He put children in cages.",
    tape: "The chain-link rooms were photographed in 2014. The Flores settlement is 1997. The pictures were not a 2018 invention.",
  },
  {
    tag: "Domestic terrorists",
    they: "Parents at school boards are a domestic-terror problem.",
    tape: "The National School Boards Association asked the White House. Five days later the Attorney General ordered U.S. Attorneys and the FBI to coordinate.",
    href: "https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf",
  },
  {
    tag: "Russian disinfo",
    they: "The laptop is a Russian trick.",
    tape: "Fifty-one former intelligence officials signed a letter weeks before the 2020 vote. The House published the file.",
    href: "https://judiciary.house.gov/media/press-releases/new-judiciary-committee-website-highlights-activities-and-findings-select",
  },
];

/** Oval — nationwide CBP, BLS CPI peak, EIA gallon. */
export const OVAL = [
  {
    who: "Obama",
    when: "FY2009–16",
    enc: "3.31 million",
    encN: 3.31,
    cpi: "3.9%",
    cpiN: 3.9,
    gas: "$3.965 peak",
    note: "Southwest Border Patrol apprehensions, FY2009–16. CBP’s nationwide combined dashboard was not published for those years. CPI peak September 2011. EIA weekly regular: highest week $3.965 (May 9, 2011).",
  },
  {
    who: "Trump 1",
    when: "FY2017–20",
    enc: "3.00 million",
    encN: 3.0,
    cpi: "2.9%",
    cpiN: 2.9,
    gas: "$2.96 peak",
    note: "Nationwide encounters. CPI peak in the term. EIA weekly regular: highest week $2.962 (May 28, 2018).",
  },
  {
    who: "Biden",
    when: "FY2021–24",
    enc: "10.83 million",
    encN: 10.83,
    cpi: "9.1%",
    cpiN: 9.1,
    gas: "$5.006 peak",
    note: "Nationwide encounters. CPI June 2022. EIA weekly regular: $5.006 the week of June 13, 2022.",
  },
  {
    who: "Trump 2",
    when: "FY2025–",
    enc: "0.69 million",
    encN: 0.69,
    cpi: "4.2%",
    cpiN: 4.2,
    gas: "$4.50 peak",
    note: "FY2025 nationwide 691,906. Southwest Border Patrol 237,538 — lowest since 1970. FBI 2025 murder rate 4.1, tied with 1955–56. EO 14252: restore monuments, remove graffiti, enforce the capital. CPI peak so far: 4.2% in May 2026. EIA weekly regular: $4.500 the week of May 11, 2026. The fiscal year started under Biden; the Oval changed January 20.",
  },
] as const;

/** This term, not the four-Oval compare. */
export const OVAL_NOW = {
  who: "This term",
  when: "FY2025",
  enc: "0.69 million nationwide",
  note: "After the Oval changed. Southwest Border Patrol 237,538 — lowest since 1970. FBI 2025: murder 4.1. EO 14252 restores monuments and the capital.",
  href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters",
};

export const OVAL_LINKS = [
  { label: "CBP — nationwide encounters", href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters" },
  { label: "CBP — southwest Border Patrol FY1960–2019", href: "https://www.cbp.gov/document/stats/us-border-patrol-fiscal-year-southwest-border-sector-apprehensions-fy-1960-fy-2019" },
  { label: "BLS — CPI July 2008, 5.6%", href: "https://www.bls.gov/news.release/archives/cpi_08142008.htm" },
  { label: "BLS — CPI September 2011, 3.9%", href: "https://www.bls.gov/news.release/archives/cpi_10192011.htm" },
  { label: "CBP — enforcement statistics", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
  { label: "BLS — CPI", href: "https://www.bls.gov/cpi/" },
  { label: "EIA — the gallon", href: "https://www.eia.gov/petroleum/gasdiesel/" },
];

/** The Oval file versus the caption. Tape, statute, charging document. Not a panel. */
export const OVAL_RECORD: {
  k: string;
  v: string;
  href: string;
  desks: OvalDesk[];
}[] = [
  {
    k: "The method",
    v: "The narrative is a caption. The record is a tape, a statute, a charging document, and a table from CBP, BLS, EIA, and Treasury. If those two disagree, the caption is the lie. If they agree, the caption was unnecessary. A six-second clip is how a republic’s argument gets stolen.",
    href: "https://www.justice.gov/archives/sco/file/1373816/dl",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "Collusion",
    v: "Mueller, Volume I: the investigation did not establish that members of the Trump campaign conspired or coordinated with the Russian government in its election interference. Russia ran two operations. The campaign expected to benefit from stolen material. That is not a conspiracy charge. No American was indicted for conspiring with the Kremlin on the election. Networks treated collusion as settled fact for three years. The special counsel’s own sentence is the record.",
    href: "https://www.justice.gov/archives/sco/file/1373816/dl",
    desks: ["four", "trump1"],
  },
  {
    k: "Insurrection",
    v: "Jack Smith charged United States v. Trump, 23-cr-257, with four counts: 18 U.S.C. § 371, § 1512(k), § 1512(c)(2), and § 241. He did not charge 18 U.S.C. § 2383. His report said the office found no case charging insurrection for acting inside the government to keep power, and did not develop direct evidence of intent to cause the full scope of the violence. The U.S. Attorney for the District of Columbia charged more than a thousand rioters. Zero under § 2383. The House impeached. The Senate did not convict. The word did the political work the statute was not asked to do.",
    href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf",
    desks: ["four", "trump1"],
  },
  {
    k: "The clips",
    v: "Bloodbath was auto plants, Mexico, a 100 percent tariff — the car industry. Dictator on day one was border and drill: after that, I’m not a dictator. Fine people: neo-Nazis and white nationalists condemned totally, in the same answer. Ukraine: the call memo is the phone; Schiff’s floor reading was parody and is not in the memo. The Ellipse: peacefully and patriotically sits on the same C-SPAN tape as fight like hell. Impeachment Two put the fighting words on the House floor and left the peaceably clause off the clip. Bleach: a question to doctors about a line of research, not an instruction to drink Clorox. Animals: an MS-13 roundtable. Suckers and losers: no tape, anonymous sourcing, denied on the record by people present.",
    href: "https://www.whitehouse.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "Impeachment Two — the cut tape",
    v: "January 6, 2021. C-SPAN recorded the Ellipse in full. The speech includes the line to protest peacefully and patriotically. It also includes fight like hell. Both are on the same recording. The House article — H.Res. 24, incitement of insurrection — put a clipped version of that speech on the floor. The country was shown the fighting words. The peaceably clause was not on the clip they ran. 18 U.S.C. § 2383 is the insurrection statute. The U.S. Attorney for D.C. later charged more than a thousand people. Zero under § 2383. Jack Smith did not charge Trump under § 2383 either. The Senate acquitted February 13, 2021. Insurrection was the caption. The uncut tape was never the exhibit they wanted the country to sit through.",
    href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-save-america-rally",
    desks: ["four", "trump1"],
  },
  {
    k: "The cases",
    v: "Florida documents, 23-cr-80101: Judge Cannon dismissed on the Appointments Clause; the government later dropped the rest. Georgia RICO: dismissed. Impeachment One was a phone about investigating Biden-family influence in Ukraine. Impeachment Two was a clipped Ellipse speech, not § 2383. Manhattan: a jury convicted on 34 counts of falsifying business records tied to a hush payment. That conviction is real. The novel “other crime” predicate is why it is on appeal. Caption versus count. Always.",
    href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "The numbers they memory-holed",
    v: "Unemployment 3.5 percent in February 2020, before the virus — lowest since 1969. Abraham Accords. Operation Warp Speed. Remain in Mexico. 2017 tax cuts. No new war. EIA weekly regular gasoline peaked at $5.006 the week of June 13, 2022. BLS: Consumer Price Index 9.1 percent year-over-year, June 2022. That peak sits on Biden’s watch. Inflation does not reset when the Oval changes. The next president inherits the price level. CBP nationwide encounters: 10.83 million in FY2021–24. FY2025, after the Oval changed: 691,906. A door that falls that far in a year was a policy, not weather.",
    href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "What the tape still carries",
    v: "Fight like hell — Ellipse, January 6. Stand back and stand by — to the Proud Boys, debate stage, 2020. When the looting starts, the shooting starts. No context restores those three. He said them. The Ellipse speech also said peacefully and patriotically. Both are on the tape. The House ran one and not the other. People died on January 6. Officers were assaulted. The building was breached. Hours passed before he told them to leave. That is not a tourist visit. It is also not § 2383 as charged. The national debt rose on his first watch. A New York jury found 34 false records. A journal that only corrects in one direction is doing the same clipping.",
    href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-save-america-rally",
    desks: ["four", "trump1"],
  },
  {
    k: "Clear and present danger",
    v: "The phrase was used as permission: he is the danger, so the law may be broken to stop him. That is not what it means. Holmes wrote it in Schenck v. United States (1919). Brandenburg v. Ohio (1969) replaced it: the government may punish speech only if it is intended to produce imminent lawless action and likely to produce it. It is a limit on the state. It is not a finding that a president may be FISA’d sloppily, impeached on a clipped tape, or indicted on a theory timed to an election. Repeating the words on television does not suspend the Constitution.",
    href: "https://supreme.justia.com/cases/federal/us/395/444/",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "Threat to democracy",
    v: "No charging document found that. Mueller did not establish a Russia conspiracy. Jack Smith did not charge 18 U.S.C. § 2383. The U.S. Attorney for D.C. charged more than a thousand people for January 6 and charged zero under the insurrection statute. Two impeachments: House yes, Senate no. The caption did political work the statutes would not. A threat to a party’s hold on the administrative state is not the same thing as a threat to the country.",
    href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "The United States is a republic",
    v: "Article IV, Section 4: the United States shall guarantee to every State a Republican Form of Government. Madison, Federalist 10: they built a republic, not a pure democracy, because a pure democracy has no cure for faction. Enumerated powers. Elections. Courts. A Bill of Rights that binds the majority. Our democracy as a slogan is how you skip the parts of the document that slow you down. A republic is supposed to slow you down.",
    href: "https://constitution.congress.gov/constitution/article-4/",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "False accusation, repeated 12 years",
    v: "The row is the accusation: Russia, insurrection, threat to democracy, pedophile, Nazi, pays no taxes, most corrupt president ever — said for twelve years as if it were a finding. The blue cell is the proof they were smearing only. Mueller Volume I: the investigation did not establish a conspiracy. Durham: neither the FBI nor the Intelligence Community had actual evidence of collusion in their holdings when Crossfire Hurricane opened. Jack Smith did not charge 18 U.S.C. § 2383. USAO-DC charged zero under that statute. The tax returns were stolen. Charles Littlejohn pleaded guilty under 26 U.S.C. § 7213 and was sentenced to five years. The forms show income tax paid. A smear repeated is still a smear.",
    href: "https://www.justice.gov/storage/durhamreport.pdf",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "The slogan did not legalize the shortcut",
    v: "If the opponent is an extinction event, then ordinary process is called too slow, the warrant’s footnotes do not matter, the uncut tape is called context, and a novel felony predicate is called accountability. That is the state of exception: violate the rules to save the rules. The Constitution does not contain that clause. The oath is to the Constitution, not to democracy as a feeling. Horowitz’s seventeen FISA inaccuracies, Durham’s opening predicate, Schiff’s parody that is not in the call memo, H.Res. 24 built on a cut of the Ellipse, fifty-one names on a laptop letter weeks before a vote — those are the file of what the slogan bought. Not one of those acts becomes lawful because a senator said threat to democracy on a Sunday show.",
    href: "https://oig.justice.gov/reports/2019/o1912.pdf",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "Most corrupt president",
    v: "The caption was that Donald Trump is the most corrupt president in American history. It was repeated as a finding. It is not a statute, and it is not a verdict. His criminal conviction is 34 New York counts of falsifying business records. Two impeachments ended in acquittal. The tax returns the country was shown in 2020 were stolen by an IRS contractor who was sentenced to five years under 26 U.S.C. § 7213. Those forms show federal income tax paid in 2015 through 2019. The comparison the caption would not sit next to: House Oversight bank records of millions from foreign sources to Biden family members and associates; Hunter Biden on the Burisma board while his father was vice president; a May 13, 2017 message, “10 percent for the big guy”; a denial that he discussed the business, which the messages do not match. Hunter was convicted on a gun count, pleaded guilty to tax counts, and was pardoned December 1, 2024. Joe Biden was not convicted of bribery. One FBI source who later alleged a cash bribe was charged with lying. That charge does not erase the bank records. Republicans opened an impeachment inquiry and did not make the country sit with this file the way the other side made the country sit with a caption. A party that will not read the exhibits is not a defense.",
    href: "https://oversight.house.gov/",
    desks: ["four", "trump1", "trump2"],
  },
  {
    k: "A war was waged on Americans",
    v: "The people own this country. Lawfare is not a debate. Paid Steele into a FISA. Fifty-one names on a laptop letter. Four dockets in an election year. Fifth Amendment due process is a fair machine, not a campaign. 18 U.S.C. § 2383 was not charged. CPI-U +21.4 percent. That effort was to undermine how Americans think.",
    href: "/dispatch/a-war-on-americans",
    desks: ["four", "trump1", "trump2"],
  },
];

export function ovalRecordFor(desk: OvalDesk) {
  return OVAL_RECORD.filter((row) => row.desks.includes(desk));
}

export const TRUMP_TERMS: {
  id: OvalDesk;
  who: string;
  majority: string;
  plus: { k: string; bill: string; href: string }[];
  minus: { k: string; bill: string; href: string }[];
}[] = [
  {
    id: "trump1",
    who: "Trump, first term · 2017–21",
    majority:
      "Republican majority, House and Senate, 2017–19. Then a Democratic House. Split. The Oval does not hold the purse.",
    plus: [
      {
        k: "Tax Cuts and Jobs Act.",
        bill: "H.R. 1 · 2017",
        href: "https://www.congress.gov/bill/115th-congress/house-bill/1",
      },
      {
        k: "Unemployment 3.5 percent, February 2020, before the virus. Lowest since 1969.",
        bill: "BLS",
        href: "https://www.bls.gov/charts/employment-situation/civilian-unemployment-rate.htm",
      },
      {
        k: "CPI peak in the term: 2.9 percent. EIA weekly regular peak: $2.962, May 28, 2018.",
        bill: "BLS · EIA",
        href: "https://www.eia.gov/petroleum/gasdiesel/",
      },
      {
        k: "Abraham Accords. Remain in Mexico. Operation Warp Speed. No new war.",
        bill: "State · CBP MPP · HHS",
        href: "https://www.state.gov/the-abraham-accords/",
      },
    ],
    minus: [
      {
        k: "CARES. Both parties. The meter jumped.",
        bill: "H.R. 748 · 2020",
        href: "https://www.congress.gov/bill/116th-congress/house-bill/748",
      },
      {
        k: "Debt still rose on this watch. Congress holds the purse. The Oval signed the bills.",
        bill: "Treasury",
        href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
      },
      {
        k: "January 6. Fight like hell is on the tape. Peacefully and patriotically is on the same tape. The building was breached. Zero charged under 18 U.S.C. § 2383.",
        bill: "C-SPAN · USAO-DC",
        href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-save-america-rally",
      },
    ],
  },
  {
    id: "trump2",
    who: "Trump, second term · 2025–",
    majority:
      "Republican majority, House and Senate, 2025–now. The door is a policy. The slogan that named him a threat to democracy did not stop the term.",
    plus: [
      {
        k: "FY2025 nationwide encounters: 691,906. Southwest Border Patrol: 237,538 — lowest since 1970.",
        bill: "CBP",
        href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics",
      },
      {
        k: "FBI 2025 murder rate 4.1, tied with 1955–56.",
        bill: "FBI UCR",
        href: "https://cde.ucr.cjis.gov/",
      },
      {
        k: "EO 14252: restore monuments, remove graffiti, enforce the capital.",
        bill: "White House",
        href: "https://www.whitehouse.gov/",
      },
      {
        k: "Florida documents dismissed. Georgia RICO dismissed. The government dropped the rest.",
        bill: "S.D. Fla. 23-cr-80101",
        href: "https://storage.courtlistener.com/recap/gov.uscourts.flsd.651411/gov.uscourts.flsd.651411.672.0.pdf",
      },
    ],
    minus: [
      {
        k: "CPI peak so far: 4.2 percent, May 2026. The 9.1 percent floor from June 2022 did not reset.",
        bill: "BLS CPI",
        href: "https://www.bls.gov/cpi/",
      },
      {
        k: "EIA weekly regular: $4.500 the week of May 11, 2026. OPEC, tax, refining, shipping.",
        bill: "EIA",
        href: "https://www.eia.gov/petroleum/gasdiesel/",
      },
      {
        k: "Manhattan 34 counts: a jury convicted. On appeal. Falsifying records. Not § 2383.",
        bill: "N.Y. 71543-23",
        href: "https://www.nycourts.gov/",
      },
    ],
  },
];

/** What the Oval number is. CBP’s own count. */
export const ENCOUNTERS = {
  k: "What an encounter is",
  line: "An encounter is a person CBP met who was not making a lawful entry.",
  v: "Customs and Border Protection counts an encounter when its officers meet a person who is not making a lawful entry. That is Border Patrol between the ports of entry, and officers at land ports, airports, and seaports. It is people stopped, turned back, expelled, or processed. It is not a visa. It is not a gotaway — those are the people CBP did not meet. Nationwide means every door CBP counts, not only the southwest river. Obama uses southwest Border Patrol, the long official table. Trump 1, Biden, and Trump 2 use CBP nationwide when that dashboard exists.",
  href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters",
};

/** What CPI peak means. BLS. Not a mood. */
export const CPI_PEAK = {
  k: "Consumer Price Index",
  line: "The Consumer Price Index is how much more groceries, rent, and fuel cost than a year earlier. That higher bill does not reset. The next Oval inherits it.",
  v: "The Consumer Price Index is the Bureau of Labor Statistics measure of a basket of what people actually buy — groceries, rent, fuel, the doctor’s office — and how much more that basket costs than a year earlier. The peak is the highest of those 12-month readings in that Oval. It is not a four-year average. Biden’s 9.1 percent is June 2022. Obama’s 3.9 percent is September 2011. Trump 1: 2.9 percent. Trump 2 so far: 4.2 percent in May 2026. A 9.1 percent year is not a one-year tax that expires. Groceries, rent, and fuel stay at the new price. When a later reading is 3 percent, the cart is still 9 percent more expensive than it was two years earlier, plus 3 percent more on top of that. Inflation does not reset when the Oval changes. The next president inherits the higher floor. Biden’s 9.1 percent in June 2022 is still in the ticket when a later Oval prints 4.2 percent.",
  href: "https://www.bls.gov/cpi/",
};

/** Open border — Democratic watch. CBO, CBP, CDC, DHS. Not a panel. */
export const BORDER = {
  k: "They opened the border",
  v: "CBP nationwide, FY2021–24: 10.83 million encounters. That is every door CBP counts — southwest land, the northern line, airports, seaports, Miami and the other sectors. Southwest land alone: 8.73 million. The rest of the map: about 2.10 million. House Homeland: more than half a million on the northern border in those four years. FY2025 nationwide, after the Oval changed: 691,906. Southwest Border Patrol FY2025: 237,538 — lowest since 1970. CDC: fentanyl deaths peaked at 73,944 in 2022. DHS: more than 450,000 unaccompanied children in the prior file.",
  essay: "/dispatch/they-opened-the-border",
  links: [
    { label: "CBP — nationwide encounters", href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters" },
    { label: "CBP — enforcement statistics", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
    { label: "CBP — southwest land", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
    { label: "House Homeland — 10.8 million", href: "https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/" },
  ],
};

/** Flights, buses, hotel bills. The door did not stop at the river. */
export const BORDER_MOVE = {
  k: "Then a plane. Then a bus. Then a hotel.",
  v: "After the encounter, people were moved into cities. The cities bought rooms. Schools and emergency rooms took the overflow. That is the community bill.",
  items: [
    {
      k: "New York City shelter — actuals",
      amt: "$8.13 billion",
      note: "Comptroller: $1.41B FY2023, $3.70B FY2024, $3.02B FY2025.",
      href: "https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts",
    },
    {
      k: "Chicago",
      amt: "$434 million",
      note: "City estimate, food and shelter, July 2022–July 2024.",
      href: "https://www.migrationpolicy.org/article/us-cities-migrant-arrivals-new-normal",
    },
    {
      k: "Denver",
      amt: "$216–340 million",
      note: "Food, education, housing, December 2022–May 2024.",
      href: "https://www.migrationpolicy.org/article/us-cities-migrant-arrivals-new-normal",
    },
    {
      k: "FEMA Shelter and Services",
      amt: "$1.4 billion",
      note: "DHS OIG: EFSP-H and SSP awards, FY2023–24. CBP money, FEMA-run.",
      href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf",
    },
    {
      k: "Texas buses and flights",
      amt: "$124.6 million",
      note: "TDEM invoices through January 10, 2024. More than 103,100 people to NYC, Chicago, Denver, D.C., Philadelphia, L.A.",
      href: "https://abc13.com/post/souther-border-texas-gov-greg-abbott-migrant-crisis-flights/14453558/",
    },
    {
      k: "CBO — one year, states and cities",
      amt: "Net $9.2 billion",
      note: "2023: $19.3B to serve, $10.1B back in tax. Encounters ran four years.",
      href: "https://www.cbo.gov/publication/61256",
    },
    {
      k: "Emergency Medicaid",
      amt: "$16.2 billion",
      note: "House Budget published the CBO run, Biden years.",
      href: "https://budget.house.gov/press-release/cbo-medicaid-spending-on-illegal-aliens-has-cost-taxpayers-over-162-billion-under-open-border-czar-harris",
    },
  ],
};

/** Hospitals and homicides. CBO, EMTALA, CBP, ICE, named dead. */
export const BORDER_HARM = {
  k: "The hospital. Then the morgue.",
  v: "EMTALA already said a hospital has to treat whoever walks in. Emergency Medicaid paid the bill for people the statute otherwise barred. Then some of the people CBP released killed Americans. Those names are on ICE and DHS letterhead.",
  items: [
    {
      k: "Emergency Medicaid",
      amt: "$16.2 billion",
      note: "CBO to House Budget, Biden years. Federal plus state. Up 124% from the same span under Trump.",
      href: "https://www.cbo.gov/publication/60805",
    },
    {
      k: "The law that fills the ER",
      amt: "42 U.S.C. § 1395dd",
      note: "A hospital that takes Medicare has to stabilize an emergency. The wait is the American who paid the premiums.",
      href: "https://www.law.cornell.edu/uscode/text/42/1395dd",
    },
    {
      k: "Criminal aliens on the street",
      amt: "650,000",
      note: "House Homeland, ICE non-detained docket, July 21, 2024. Convictions or charges. Not detained.",
      href: "https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/",
    },
    {
      k: "Homicide on ICE’s FY2024 arrests",
      amt: "2,894",
      note: "ICE ERO Annual Report: homicide charges or convictions among the criminal noncitizens ERO arrested that year.",
      href: "https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf",
    },
    {
      k: "Laken Riley",
      amt: "Georgia, 2024",
      note: "Nursing student. DHS: killed by a Venezuelan illegal alien, Tren de Aragua, paroled in September 2022, released again after a New York arrest.",
      href: "https://www.dhs.gov/news/2026/01/29/dhs-celebrates-one-year-laken-riley-act",
    },
    {
      k: "Rachel Morin",
      amt: "Maryland, 2023",
      note: "Mother of five. House Homeland: illegal alien from El Salvador, entered 2023, arrested June 17, 2024.",
      href: "https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/",
    },
  ],
  essay: "/dispatch/the-hospital-and-the-morgue",
};

/** Same formula as a citizen. Qualified aliens (parole, asylum, refugee) can collect. Illegal aliens still illegal cannot. Averages are the program averages — SSA, USDA, MACPAC, HUD. */
export const BENEFITS = {
  k: "The monthly stack",
  v: "Agencies do not print a bigger check because the person is not a citizen. They print the same check. Qualified aliens can collect it. That is the door.",
  stack: "$2,590",
  items: [
    {
      k: "SSI",
      amt: "$715",
      note: "Average check, December 2025. Cap for one person in 2026: $994.",
      href: "https://www.ssa.gov/policy/docs/statcomps/ssi_asr/",
    },
    {
      k: "SNAP",
      amt: "$190",
      note: "Average per person, FY2026. Household average: $352.",
      href: "https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap",
    },
    {
      k: "Medicaid",
      amt: "$771",
      note: "MACPAC: $9,255 a year per full-benefit enrollee, FY2023. Emergency Medicaid for illegal aliens is extra, not this monthly line.",
      href: "https://www.macpac.gov/publication/medicaid-benefit-spending-per-full-year-equivalent-fye-enrollee-by-state-and-eligibility-group/",
    },
    {
      k: "Housing",
      amt: "$917",
      note: "HUD’s own run on mixed families: about $11,000 a year in housing assistance.",
      href: "https://www.huduser.gov/portal/datasets/assthsg.html",
    },
  ],
};

/** The worker who paid FICA. Not the welfare stack. */
export const WORKER = {
  k: "What the worker gets",
  v: "A citizen who worked is not handed SSI, SNAP, Medicaid, and a housing check in one pile. That pile is welfare. The earned check is Social Security. Medicare is insurance, not rent. The wait for a doctor is the product of what Medicare pays.",
  items: [
    {
      k: "Social Security — earned",
      amt: "$2,086",
      note: "Average retired-worker check, July 2026. Paid with FICA. Not SSI.",
      href: "https://www.congress.gov/crs-product/R42035",
    },
    {
      k: "Medicare Part B — taken out",
      amt: "−$202.90",
      note: "Standard monthly premium, 2026. Deducted from the earned check. CMS.",
      href: "https://www.cms.gov/medicare/payment/medicare-part-b",
    },
    {
      k: "SSI / SNAP / HUD stack",
      amt: "$0",
      note: "Over the line, the worker does not get that $2,590 pile. SSI is need, not a career.",
      href: "https://www.ssa.gov/ssi/",
    },
    {
      k: "The wait",
      amt: "Months",
      note: "MGMA: 80% of groups say Medicare pays below the cost of the visit. Doctors leave. The patient waits.",
      href: "https://www.mgma.com/",
    },
  ],
};

export const PRICES = {
  k: "Prices — Democrats held the gavel",
  v: "9.1 percent in June 2022. Democratic majority in the House and the Senate. That is the peak. The live table did not stop there. BLS, August 2026: 3.4 percent over the year. The grocery ticket is still their watch.",
  links: [
    { label: "BLS — 9.1% in June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
    { label: "BLS — live CPI, August 2026 (3.4%)", href: "https://www.bls.gov/news.release/cpi.nr0.htm" },
    { label: "BLS — 12-month chart, through August 2026", href: "https://www.bls.gov/charts/consumer-price-index/" },
    { label: "FRED — 12-month CPI through August 2026", href: "https://fred.stlouisfed.org/graph/?id=CPIAUCSL&units=pc1" },
  ],
};


export type Cite = { label: string; href: string };

/** Kitchen-table ledger. Majority is who held the gavel — Article I, not the Oval. */
export type LedgerRow = {
  era: string;
  majority: string;
  debt: string;
  taxes: string;
  people: string;
  sources: Cite[];
};

export const LEDGER: LedgerRow[] = [
  {
    era: "1993–95",
    majority: "Dem both",
    debt: "Deficit still high, then turning",
    taxes: "Omnibus 1993 raised top rates",
    people: "Take-home cut at the top. Recovery after a recession they did not start.",
    sources: [
      { label: "H.R. 2264 — Omnibus Budget Reconciliation Act of 1993", href: "https://www.congress.gov/bill/103rd-congress/house-bill/2264" },
      { label: "Senate party division", href: "https://www.senate.gov/history/partydiv.htm" },
    ],
  },
  {
    era: "1995–01",
    majority: "GOP both (Clinton Oval)",
    debt: "Late-90s surplus — last time the meter ran backward",
    taxes: "No giant new income-tax hike. 1997 cut capital-gains rate",
    people: "Welfare reform 1996. Work requirement. Paychecks and a surplus. Split government, not a uniparty hymn.",
    sources: [
      { label: "H.R. 3734 — Personal Responsibility and Work Opportunity Act of 1996", href: "https://www.congress.gov/bill/104th-congress/house-bill/3734" },
      { label: "Taxpayer Relief Act of 1997", href: "https://www.congress.gov/bill/105th-congress/house-bill/2014" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
    ],
  },
  {
    era: "2001–07",
    majority: "GOP both most years (Bush Oval)",
    debt: "+$4.9T across the Bush years (Treasury)",
    taxes: "EGTRRA 2001 / JGTRRA 2003 — take-home pay rose",
    people: "A tax cut that showed up on payday. Then two wars and Medicare Part D on the card. Help on payday. Hurt on the meter and in the field.",
    sources: [
      { label: "H.R. 1836 — EGTRRA 2001", href: "https://www.congress.gov/bill/107th-congress/house-bill/1836" },
      { label: "H.R. 2 — JGTRRA 2003", href: "https://www.congress.gov/bill/108th-congress/house-bill/2" },
      { label: "P.L. 108-173 — Medicare Prescription Drug, Improvement, and Modernization Act", href: "https://www.congress.gov/bill/108th-congress/house-bill/1" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
    ],
  },
  {
    era: "2007–11",
    majority: "Dem both",
    debt: "TARP + stimulus. Obama term later +$8–9.3T inauguration-to-inauguration",
    taxes: "ACA taxes and mandates",
    people: "Crash they inherited. Bailouts. ACA: coverage for some, premiums and a mandate for others. Jobs came back slow.",
    sources: [
      { label: "P.L. 110-343 — Emergency Economic Stabilization Act (TARP)", href: "https://www.congress.gov/bill/110th-congress/house-bill/1424" },
      { label: "H.R. 3590 — Patient Protection and Affordable Care Act", href: "https://www.congress.gov/bill/111th-congress/house-bill/3590" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
    ],
  },
  {
    era: "2017–19",
    majority: "GOP both (Trump 1)",
    debt: "Debt still up. Tax cut is not a surplus",
    taxes: "TCJA 2017 — lower rates, bigger hole (~$1.5T / 10 yrs, JCT)",
    people: "Fatter paycheck. Pre-COVID jobs and wages. Honest: they cut the tax and did not close October 1.",
    sources: [
      { label: "H.R. 1 — Tax Cuts and Jobs Act", href: "https://www.congress.gov/bill/115th-congress/house-bill/1" },
      { label: "Joint Committee on Taxation", href: "https://www.jct.gov/" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
    ],
  },
  {
    era: "2019–21",
    majority: "Split (COVID)",
    debt: "Trump 1 full term +$7.8T — a large share in the plague year, both parties voted the relief",
    taxes: "No new peacetime rate fight. Relief checks",
    people: "Lockdowns, closed shops, then checks. Both jerseys spent. Neither gets a pass for the $4T+ plague year.",
    sources: [
      { label: "P.L. 116-136 — CARES Act", href: "https://www.congress.gov/bill/116th-congress/house-bill/748" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
      { label: "CRFB — Trump and Biden debt growth", href: "https://www.crfb.org/blogs/trump-and-biden-debt-growth" },
    ],
  },
  {
    era: "2021–23",
    majority: "Dem both (Biden Oval)",
    debt: "Biden term +$8.4–8.5T. $27.8T to ~$36.2T",
    taxes: "IRA 15% corporate minimum. Direction is up",
    people: "CPI peak 9.1% June 2022. Groceries, rent, fuel. Record southwest-border encounters FY22–24. Cities paid hotels. Hurt.",
    sources: [
      { label: "BLS CPI — June 2022, 9.1%", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
      { label: "H.R. 5376 — Inflation Reduction Act", href: "https://www.congress.gov/bill/117th-congress/house-bill/5376" },
      { label: "CBP — Southwest land border encounters", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
    ],
  },
  {
    era: "2025–26",
    majority: "GOP both (Trump 2)",
    debt: "+$3.8T already ($36.2T Jan 2025 → $40.0T Aug 2026)",
    taxes: "Fighting to extend TCJA. Not a surplus",
    people: "Border encounters at a 50-year low (Pew). That is a win that can be named. The meter is still climbing. Close October 1 or it is the same failure in a different jersey.",
    sources: [
      { label: "Treasury — Debt to the Penny (~$40.05T Aug. 18, 2026)", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
      { label: "Pew — encounters at a 50-year low", href: "https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/" },
      { label: "CBP — Southwest land border encounters", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
    ],
  },
];

export type WarRow = {
  topic: string;
  gop: string;
  dem: string;
  sources: Cite[];
};

export const WAR: WarRow[] = [
  {
    topic: "Warfare talk",
    gop: "McCaul, leaving after 22 years: ‘You’re elected to fight and kill the other side.’ NYT Magazine, Sept. 16, 2026. An employee does not declare war on the people who pay him.",
    dem: "Jeffries on C-SPAN: maximum warfare, then break them / break their spirit. Schumer: whirlwind. Waters: create a crowd. Same rule.",
    sources: [
      { label: "Fox News Radio — McCaul exit interview, From Washington, July 12, 2026", href: "https://radio.foxnews.com/2026/07/12/from-washington-rep-michael-mccaul-on-two-decades-of-public-service-and-the-changing-face-of-congress/" },
      { label: "NYT Magazine — McCaul: ‘fight and kill the other side,’ Sept. 16, 2026", href: "https://www.nytimes.com/2026/09/16/magazine/congress-trump-midterms.html" },
      { label: "Carnegie Endowment — A Conversation With Congressman Michael McCaul, May 21, 2026", href: "https://www.youtube.com/watch?v=Hy4uBHoav3Y" },
      { label: "C-SPAN — Jeffries, ‘maximum warfare,’ Apr. 22, 2026", href: "https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623" },
      { label: "C-SPAN — Jeffries, CAP IDEAS conference, May 19, 2026", href: "https://www.c-span.org/program/public-affairs-event/house-minority-leader-jeffries-on-democracy/679567" },
      { label: "C-SPAN — Schumer, Supreme Court steps, Mar. 4, 2020", href: "https://www.c-span.org/clip/us-senate/user-clip-youve-released-the-whirlwind-and-you-will-pay-the-price--sen-chuck-schumer/4944670" },
      { label: "RealClearPolitics video — Waters, June 2018, ‘create a crowd’", href: "https://www.realclearpolitics.com/video/2018/06/26/maxine_waters_pelosi_and_schumer_dont_really_say_im_out_of_line.html" },
      { label: "C-SPAN — full House Democrat news conference (unedited)", href: "https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945" },
    ],
  },
  {
    topic: "Smears are not a statute",
    gop: "A clip is not a budget. Ugly sentences on tape stay here — including yours. Govern or go home.",
    dem: "When they cannot beat the file they make it radioactive. Fourteen replies. A lie. Reports filed, posts stayed. Noise does not appropriate a dollar. It has to stop.",
    sources: [
      { label: "Amendment I — Congress shall make no law… abridging the freedom of speech", href: "https://constitution.congress.gov/constitution/amendment-1/" },
      { label: "Brandenburg v. Ohio, 395 U.S. 444 (1969)", href: "https://supreme.justia.com/cases/federal/us/395/444/" },
    ],
  },
  {
    topic: "Who gets to hear",
    gop: "No state television. Ugly sentences still print. Censorship of the recording teaches a country a crime that was never filed.",
    dem: "MRC: 92% negative on ABC/CBS/NBC, first hundred days of 2025. A caption that says mostly peaceful while a precinct burns is not journalism. It is harm.",
    sources: [
      { label: "MRC / NewsBusters — 92% negative, first 100 days of 2025 term", href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage" },
      { label: "Amendment I", href: "https://constitution.congress.gov/constitution/amendment-1/" },
    ],
  },
  {
    topic: "Fake recesses",
    gop: "Used empty-room gavels on Obama. A Senate that freezes Article II is obstruction.",
    dem: "Used it on Bush and Trump. A fake session is a fake session. Noel Canning: ten days or it is not a recess. Neither party.",
    sources: [
      { label: "NLRB v. Noel Canning, 573 U.S. 513 (2014)", href: "https://www.oyez.org/cases/2013/12-1281" },
      { label: "Article II, Section 2 — Recess Appointments Clause", href: "https://constitution.congress.gov/constitution/article-2/" },
    ],
  },
];

/** What they voted to spend. Just Facts tabulation of roll calls, 2009–2022. */
export const PARTY_SPEND: { who: string; amount: string; note: string }[] = [
  { who: "House Democrats", amount: "$19.9T", note: "net voted to raise spending, 2009–2022" },
  { who: "Senate Democrats", amount: "$14.0T", note: "net voted to raise spending, 2009–2022" },
  { who: "Senate Republicans", amount: "$5.7T", note: "net voted to raise spending, 2009–2022" },
  { who: "House Republicans", amount: "$1.6T", note: "net voted to raise spending, 2009–2022" },
];
export const PARTY_SPEND_HREF = "https://www.justfacts.com/nationaldebt.asp";

/** Gross debt added while that party held the Oval, 1981–Aug 2026, from DEBT_BY_TERM. The purse is still Congress. */
export const DEBT_BY_OVAL = [
  { who: "Republican Oval, 1981–2026", amount: "+$21.1T", note: "Reagan + GHW Bush + GW Bush + Trump 1 + Trump 2 to Aug 2026. Congress was often the other party." },
  { who: "Democratic Oval, 1993–2025", amount: "+$18.0T", note: "Clinton + Obama + Biden. Congress was often the other party." },
];

export const TAX_MOVES: {
  year: string;
  bill: string;
  gavel: string;
  direction: "Cut" | "Hike";
  size: string;
  href: string;
}[] = [
  {
    year: "1993",
    bill: "Top tax raised",
    gavel: "Democrats ran Congress",
    direction: "Hike",
    size: "Raised top individual rate to 39.6%. CBO: the package cut the deficit; the tax title was a hike.",
    href: "https://www.congress.gov/bill/103rd-congress/house-bill/2264",
  },
  {
    year: "2001",
    bill: "Tax cut",
    gavel: "Republicans ran Congress",
    direction: "Cut",
    size: "JCT: on the order of $1.3T over 10 years (static).",
    href: "https://www.congress.gov/bill/107th-congress/house-bill/1836",
  },
  {
    year: "2003",
    bill: "Tax cut",
    gavel: "Republicans ran Congress",
    direction: "Cut",
    size: "Accelerated the 2001 cuts. More take-home, more hole.",
    href: "https://www.congress.gov/bill/108th-congress/house-bill/2",
  },
  {
    year: "2010 / 2013",
    bill: "ObamaCare taxes",
    gavel: "Democrats ran it, then they split",
    direction: "Hike",
    size: "ACA: new taxes and a mandate. ATRA: made most Bush cuts permanent and restored a 39.6% top rate on high earners.",
    href: "https://www.congress.gov/bill/111th-congress/house-bill/3590",
  },
  {
    year: "2017",
    bill: "Tax cut",
    gavel: "Republicans ran Congress",
    direction: "Cut",
    size: "JCT JCX-67-17: about −$1.5T over 10 years (conventional).",
    href: "https://www.jct.gov/publications/2017/jcx-67-17/",
  },
  {
    year: "2022",
    bill: "Corporate tax raised",
    gavel: "Democrats ran Congress",
    direction: "Hike",
    size: "Direction is up on the corporate side. CBO scored the Act as a net deficit reducer because of other titles. The tax title is still a hike.",
    href: "https://www.congress.gov/bill/117th-congress/house-bill/5376",
  },
];

export const RECORD: {
  id: string;
  party: string;
  control: string;
  debt: string;
  plus: { k: string; bill: string; href: string }[];
  minus: { k: string; bill: string; href: string }[];
}[] = [
  {
    id: "gop",
    party: "Republicans",
    control: "Majority control of the House and the Senate: 1995–2001 · 2003–07 · 2015–19 · 2025–now. That is the purse. They could pass a spending bill without Democrats.",
    debt: "Added about $10.96 trillion on those watches since 1995. Last surplus: late 1990s.",
    plus: [
      {
        k: "Welfare — work, or the check stops",
        bill: "H.R. 3734 · 1996",
        href: "https://www.congress.gov/bill/104th-congress/house-bill/3734",
      },
      {
        k: "Tax cut on savings",
        bill: "H.R. 2014 · 1997",
        href: "https://www.congress.gov/bill/105th-congress/house-bill/2014",
      },
      {
        k: "Fatter paycheck",
        bill: "H.R. 1836 · 2001",
        href: "https://www.congress.gov/bill/107th-congress/house-bill/1836",
      },
      {
        k: "Fatter paycheck, round two",
        bill: "H.R. 2 · 2003",
        href: "https://www.congress.gov/bill/108th-congress/house-bill/2",
      },
      {
        k: "Fatter paycheck again. Not a surplus.",
        bill: "H.R. 1 · Tax Cuts and Jobs Act · 2017",
        href: "https://www.congress.gov/bill/115th-congress/house-bill/1",
      },
    ],
    minus: [
      {
        k: "Iraq war — they voted yes",
        bill: "H.J.Res. 114 · 2002",
        href: "https://www.congress.gov/bill/107th-congress/house-joint-resolution/114",
      },
      {
        k: "Drug benefit. They did not pay for it.",
        bill: "H.R. 1 · Medicare Part D · 2003",
        href: "https://www.congress.gov/bill/108th-congress/house-bill/1",
      },
      {
        k: "Republican majority 2015–17, Obama still in the Oval. Debt still climbed. They did not close October 1.",
        bill: "Treasury · Historical Debt Outstanding",
        href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
      },
      {
        k: "They never finish the budget on time",
        bill: "H.R. 7130 · Budget Act · 1974",
        href: "https://www.congress.gov/bill/93rd-congress/house-bill/7130",
      },
    ],
  },
  {
    id: "dem",
    party: "Democrats",
    control: "Majority control of the House and the Senate: 1993–95 · 2007–11 · 2021–23. That is the purse. They could pass a spending bill without Republicans. Obama’s first two years sit in 2007–11. His last six years were split, then a Republican majority.",
    debt: "Added about $9.59 trillion on those watches since 1993. TARP. Stimulus. 9.1% prices in 2022.",
    plus: [
      {
        k: "Raised the top tax. Cut the deficit that year.",
        bill: "H.R. 2264 · 1993",
        href: "https://www.congress.gov/bill/103rd-congress/house-bill/2264",
      },
      {
        k: "Lilly Ledbetter Fair Pay Act — first bill of the 111th Congress.",
        bill: "S. 181 · 2009",
        href: "https://www.congress.gov/bill/111th-congress/senate-bill/181",
      },
      {
        k: "CHIP — children’s coverage reauthorized.",
        bill: "H.R. 2 · CHIPRA · 2009",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/2",
      },
      {
        k: "ObamaCare: some people got a card. That is the help. The tax and the mandate sit under Hurt.",
        bill: "H.R. 3590 · 2010",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/3590",
      },
    ],
    minus: [
      {
        k: "September 23, 2026. Senate Judiciary hearing, Standing Up for Women in Sports. The minority called no witnesses. Chairman Grassley said the two Democratic witness seats were empty. Ranking Member Durbin gave an opening statement, then said he would not ask questions and would not treat the hearing as a responsible use of the committee. The committee page does not publish a roll of which other Democrats sat in the room, so a headcount from a post is not the record. A paycheck is not stopped for leaving a hearing. The hearing: https://www.judiciary.senate.gov/committee-activity/hearings/standing-up-for-women-in-sports-ensuring-opportunity-fairness-and-safety-for-female-athletes. Grassley’s opening: https://www.judiciary.senate.gov/press/rep/releases/grassley-opens-senate-judiciary-hearing-on-ensuring-safety-and-fairness-for-female-athletes.",
        bill: "Durbin’s statement · September 23, 2026",
        href: "https://www.durbin.senate.gov/newsroom/press-releases/durbin-denounces-judiciary-committee-republicans-hearing-on-transgender-athletes",
      },
      {
        k: "Same morning, different room. Homeland Security’s own notice called the 10 a.m. meeting a business meeting, not a hearing. Calling that one a skipped hearing uses the wrong word.",
        bill: "HSGAC business meeting · September 23, 2026",
        href: "https://www.hsgac.senate.gov/hearings/business-meeting-45/",
      },
      {
        k: "February 24, 2026. Joint session. The President asked the chamber to stand if they agreed: the first duty of the American government is to protect American citizens, not illegal aliens. Republicans stood. Democrats stayed seated.",
        bill: "C-SPAN · 2026 State of the Union",
        href: "https://www.c-span.org/clip/joint-session-of-congress/user-clip-the-first-duty-of-the-american-government/5194380",
      },
      {
        k: "They named the voter Nazi, pedophile, deplorable, garbage — then ran a Senate nominee with a Totenkopf on his chest and a House nominee who testified for Omar Abdel Rahman, 93 Cr. 181 (S.D.N.Y.). They did not police their own.",
        bill: "TIME · Clinton, Sept. 9, 2016 · United States v. Rahman",
        href: "https://time.com/4486502/hillary-clinton-basket-of-deplorables-transcript/",
      },
      {
        k: "Minnesota. Democratic governor. DOJ charged 98 in Feeding Our Future and related Medicaid and housing fraud. 85 of Somali descent. 64 convicted. The auditor was not the party.",
        bill: "DOJ National Fraud Enforcement · White House fact sheet, Jan. 8, 2026",
        href: "https://www.whitehouse.gov/fact-sheets/2026/01/fact-sheet-president-donald-j-trump-establishes-new-department-of-justice-division-for-national-fraud-enforcement/",
      },
      {
        k: "Peaceable assembly is the right. Doxxing an ICE officer, assaulting him, and smashing the building is not. 18 U.S.C. § 111, § 119, § 1361. DHS: 275 assaults on ICE officers Jan. 20–Dec. 31, 2025, against 19 in the same stretch of 2024. 66 vehicular attacks against 2. Prairieland Detention Center, July 4, 2025: DOJ sentenced an Antifa cell for attacking the facility. Minnesota: 15 indicted for assaulting federal officers and destroying government property. Sanctuary rhetoric is not a defense.",
        bill: "DHS · Jan. 8, 2026 · 18 U.S.C. § 111",
        href: "https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults",
      },
      {
        k: "They opened the border. 10.83 million nationwide encounters, FY2021–24. Americans paid the hotels, the ER wait, and the morgue.",
        bill: "CBP nationwide · CBO 61256",
        href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters",
      },
      {
        k: "Fentanyl deaths peaked at 73,944 in 2022. The poison used a door they held open.",
        bill: "CDC NCHS · 2017–2023",
        href: "https://www.cdc.gov/nchs/blog/posts/2026/03/most-common-drugs-in-u-s-overdose-deaths-2017-2023.html",
      },
      {
        k: "ICE FY2024: 2,894 homicide charges or convictions on the criminal noncitizens ERO arrested. Sexual assault and sex offenses: 18,579. Damage to property: 5,001. Those people were on American streets.",
        bill: "ICE ERO Annual Report FY2024",
        href: "https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf",
      },
      {
        k: "Hospitals. EMTALA forces the ER. Emergency Medicaid: $16.2 billion in the Biden years. The American who paid the premiums waits.",
        bill: "CBO 60805 · 42 U.S.C. § 1395dd",
        href: "https://www.cbo.gov/publication/60805",
      },
      {
        k: "FEMA put Americans on Immediate Needs Funding. The same agency awarded $1.4 billion for aliens. The Inspector General questioned $425 million of that pile.",
        bill: "DHS OIG-26-04",
        href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf",
      },
      {
        k: "Hurricane Helene. Western North Carolina. The Secretary said FEMA did not have the funds to make it through the season. House Homeland: Americans in the mountains while FEMA ran migrant shelter grants. GAO: survivors could not get through on the helpline.",
        bill: "House Homeland · Oct. 11, 2024 · GAO-26-108154",
        href: "https://homeland.house.gov/wp-content/uploads/2024/10/2024-10-11-Green-et-al-to-Mayorkas-DHS-re-FEMA-Funding-Priorities.pdf",
      },
      {
        k: "Maui fire. More than 100 dead. Nearly 10,000 displaced. FEMA Individual Assistance after a year: $56.1 million to 7,141 people. Temporary housing still running into 2027. The same agency awarded $1.4 billion for aliens — hotels, clothes, phones. The people who paid the tax waited.",
        bill: "GAO-25-106862 · FEMA Maui fact sheet",
        href: "https://www.gao.gov/products/gao-25-106862",
      },
      {
        k: "DHS: more than 450,000 unaccompanied children in the prior file. A later search found 145,000. The rest is a missing-persons file.",
        bill: "DHS · OIG-24-46",
        href: "https://www.dhs.gov/news/2026/02/24/making-america-safe-again-state-dhs-under-president-trump-and-secretary-noem",
      },
      {
        k: "Social Security is overstrained. The 2026 Trustees Report: the retirement fund (OASI) is depleted in the fourth quarter of 2032. After that, 78 percent of the scheduled check. Combined OASDI: third quarter of 2034, then 83 percent. People who paid in their whole lives do not get the benefit they were promised. Congress spent the surplus. Parole into a Social Security number put extra load on a fund already going dry.",
        bill: "2026 OASDI Trustees Report",
        href: "https://www.ssa.gov/oact/trsum/",
      },
      {
        k: "SSI to qualified aliens — $715 average a month",
        bill: "SSA · Dec 2025 · $994 cap in 2026",
        href: "https://www.ssa.gov/policy/docs/statcomps/ssi_asr/",
      },
      {
        k: "SNAP — $190 a person a month",
        bill: "USDA FNS · FY2026",
        href: "https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap",
      },
      {
        k: "Medicaid — about $771 a month per full-benefit enrollee",
        bill: "MACPAC · FY2023",
        href: "https://www.macpac.gov/publication/medicaid-benefit-spending-per-full-year-equivalent-fye-enrollee-by-state-and-eligibility-group/",
      },
      {
        k: "Housing help — about $917 a month",
        bill: "HUD · mixed-family HAP",
        href: "https://www.huduser.gov/portal/datasets/assthsg.html",
      },
      {
        k: "Congress funds the nonprofit pipe and does not require the names. 26 U.S.C. § 6104: for most 501(c) groups, donor names are redacted from the public Form 990. Taxpayer grants still go out on USASpending. America pays for its own opposition and cannot see who else paid.",
        bill: "26 U.S.C. § 6104 · USASpending",
        href: "https://www.law.cornell.edu/uscode/text/26/6104",
      },
      {
        k: "Prosecutor races. Independent-expenditure and 527 filings name large donors, including George Soros, to committees that back district attorneys who then publish non-prosecution policies. The PAC is public. The 501(c)(4) that feeds it is not. Crime is the American who lives in that county.",
        bill: "FEC receipts · IRS 527 disclosure",
        href: "https://www.fec.gov/data/receipts/individual-contributions/?contributor_name=SOROS%2C%20GEORGE",
      },
      {
        k: "Secretaries of state. 52 U.S.C. § 20507 and HAVA § 21083 already require a reasonable effort to take the dead and the moved off the roll. Congress never tied election grants to a clean list. A refusal to purge is a refusal of the statute they swore.",
        bill: "52 U.S.C. § 20507 · 52 U.S.C. § 21083",
        href: "https://www.law.cornell.edu/uscode/text/52/20507",
      },
      {
        k: "The worker waits for a doctor. Medicare pays too little. Part B still takes $202.90.",
        bill: "CMS Part B 2026 · MGMA",
        href: "https://www.cms.gov/medicare/payment/medicare-part-b",
      },
      {
        k: "Bank bailout",
        bill: "H.R. 1424 · TARP · 2008",
        href: "https://www.congress.gov/bill/110th-congress/house-bill/1424",
      },
      {
        k: "Stimulus after the crash",
        bill: "H.R. 1 · 2009",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/1",
      },
      {
        k: "ObamaCare — new taxes, a mandate",
        bill: "H.R. 3590 · 2010",
        href: "https://www.congress.gov/bill/111th-congress/house-bill/3590",
      },
      {
        k: "DACA, June 15, 2012. A memo. Not a statute. Congress did not pass it.",
        bill: "DHS memo · 2012",
        href: "https://www.uscis.gov/humanitarian/consideration-of-deferred-action-for-childhood-arrivals-daca",
      },
      {
        k: "Obama’s two terms, southwest Border Patrol: 3.31 million apprehensions, FY2009–16.",
        bill: "CBP · FY1960–2019 table",
        href: "https://www.cbp.gov/document/stats/us-border-patrol-fiscal-year-southwest-border-sector-apprehensions-fy-1960-fy-2019",
      },
      {
        k: "CPI 3.9%, September 2011. Obama Oval. Republican House. Split Congress. Still the grocery ticket.",
        bill: "BLS CPI · September 2011",
        href: "https://www.bls.gov/news.release/archives/cpi_10192011.htm",
      },
      {
        k: "More spending after COVID",
        bill: "H.R. 1319 · Rescue Plan · 2021",
        href: "https://www.congress.gov/bill/117th-congress/house-bill/1319",
      },
      {
        k: "Corporate tax went up",
        bill: "H.R. 5376 · 2022",
        href: "https://www.congress.gov/bill/117th-congress/house-bill/5376",
      },
      {
        k: "Prices hit 9.1%. Groceries. Rent. Fuel.",
        bill: "BLS CPI · June 2022",
        href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm",
      },
      {
        k: "They never finish the budget on time either",
        bill: "H.R. 7130 · Budget Act · 1974",
        href: "https://www.congress.gov/bill/93rd-congress/house-bill/7130",
      },
      {
        k: "January 6 — the caption was insurrection. The charge sheet was not.",
        bill: "18 U.S.C. § 2383 · USAO-DC tally",
        href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol",
      },
      {
        k: "The Speaker stacked the J6 committee. Jordan and Banks were rejected.",
        bill: "H.Res. 503 · 117th Congress",
        href: "https://www.congress.gov/bill/117th-congress/house-resolution/503",
      },
      {
        k: "They impeached twice. Then four criminal dockets.",
        bill: "H.Res. 755 · 116th Congress",
        href: "https://www.congress.gov/bill/116th-congress/house-resolution/755",
      },
      {
        k: "DHS named a board to govern disinformation.",
        bill: "DHS · terminated Aug. 24, 2022",
        href: "https://www.dhs.gov/archive/news/2022/08/24/following-hsac-recommendation-dhs-terminates-disinformation-governance-board",
      },
    ],
  },
];

/** Why the meter runs. Both parties. They hold the purse. */
export const DRIVERS: { k: string; v: string; href: string }[] = [
  {
    k: "Medicare, Medicaid, Social Security",
    v: "These three, plus interest, are the biggest lines on the card. Social Security is not a nest egg. The 2026 Trustees Report: the retirement fund (OASI) is depleted in the fourth quarter of 2032. After that, 78 percent of the scheduled check. Combined OASDI: third quarter of 2034, then 83 percent. People who paid in their whole working lives may not get the benefit they were promised. The 2026 raise for the average retired worker is $56 a month — $2,015 to $2,071. SSA’s implied return for later cohorts is about 2% real. Markets historically paid 7–8%. Congress spent the surplus. The check is a transfer.",
    href: "https://www.ssa.gov/oact/trsum/",
  },
  {
    k: "SSI is the welfare check. Not Social Security.",
    v: "SSI is paid from general revenue. Nobody ‘paid in.’ Illegal aliens cannot collect it while they are still illegal (8 U.S.C. § 1611). Congress left a door: parole, asylum, refugee. Cross, get a status, get an SSN, get SSI. SSA’s own spotlight lists those categories. About 310,000 noncitizens were on SSI in December 2025. That is the giveaway. Retirees fight over a $56 COLA on the other program.",
    href: "https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm",
  },
  {
    k: "No lock. Fraud walks.",
    v: "GAO: $233–521 billion a year in fraud and improper payments. COVID unemployment: $100–135 billion. They hold the purse. They got loud when the auditor turned on the light.",
    href: "https://www.gao.gov/products/gao-25-107746",
  },
  {
    k: "Part-time. Unread bills. Back-room pages.",
    v: "Twelve money bills by October 1. They do not pass them. Lobbyists write the stack. A handshake in the hallway becomes law. That is not oversight. That is how waste hides.",
    href: "https://www.congress.gov/bill/93rd-congress/house-bill/7130",
  },
  {
    k: "The nonprofit pipe. Dark on the 990. Named on the PAC.",
    v: "Taxpayer money leaves as a grant. A private nonprofit cashes it. 26 U.S.C. § 6104 lets most 501(c) groups keep donor names off the public Form 990. 527s and FEC committees do list large donors — including George Soros on prosecutor-race filings. The 501(c)(4) feeder does not. No charging document says a named donor paid a rioter to set a fire. The cities still burned in 2020. Tax-exempt groups still ran bail and protest infrastructure. Congress still does not require the names or an itemized street ledger. Secretaries of state still sit on dirty rolls while 52 U.S.C. § 20507 already requires a reasonable purge. America is funding a pipe it cannot see.",
    href: "https://www.law.cornell.edu/uscode/text/26/6104",
  },
];

/** CBO’s long-term file. One chart. Who added, and why the meter runs. */
export const DEBT_WHY = {
  k: "No oversight. A $40 trillion card. Full-time pay for a part-time floor.",
  v: "CBO’s long-term outlook: the meter is Medicare, Medicaid, Social Security, and net interest. Wars and tax bills are real. They are not the largest line. Both parties voted the expansions. Neither locked the door. Neither passes twelve appropriations by October 1. GAO: $233–521 billion a year in fraud and improper payments. The same Congress votes grants to private nonprofits and does not require the public 990 to name the donors. That is what a part-time schedule does to a country of more than 300 million people. Lack of oversight is how fraud became a line on a $40.09 trillion card, and how America funds a political pipe it cannot see.",
  href: "https://www.gao.gov/products/gao-25-107746",
  gop: "Unpaid Medicare Part D. Tax cuts without a closed budget. Iraq. CARES. Majority 2015–19: still no October 1.",
  dem: "ARRA. ACA Medicaid expansion. Rescue Plan. Parole into benefits. Majority 2021–23: 9.1% prices and a record border while the meter ran. The 2026 Trustees Report: OASI empty Q4 2032, then 78% of the scheduled Social Security check.",
  pay: "A rank-and-file member is paid $174,000 a year — CRS RL30064 — plus a pension, Federal Employees Health Benefits, and a million-dollar office allowance. That is 2,080-hour, full-time pay. The House sits on the order of 150 legislative days. No part-time job in America pays like that. Self-governance of their own ethics has failed: 2 U.S.C. § 1415 billed the country for congressional misconduct. Full time, or the perks stop.",
  payHref: "https://www.congress.gov/crs-product/RL30064",
  ethicsHref: "https://www.law.cornell.edu/uscode/text/2/1415",
};

/** The invasion bill. Official costs. The doors Democrats opened. */
export const ALIENS = {
  k: "The invasion bill — who paid, who became eligible",
  v: "10.83 million nationwide encounters, FY2021–24. Democrats held the Oval. They held majority control of the House and the Senate 2021–23. They ended Remain in Mexico. They ended Title 42. They ran parole — Cubans, Haitians, Nicaraguans, Venezuelans, and the rest — that turned a crossing into a status, a status into a Social Security number, and a number into a check. 8 U.S.C. § 1611 already barred most federal benefits for aliens who are not qualified. They built the exception. That is how an invasion becomes a welfare line.",
  href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters",
  costs: [
    {
      k: "Emergency Medicaid, Biden years",
      amt: "$16.2 billion",
      href: "https://www.cbo.gov/publication/60805",
    },
    {
      k: "CBO — states and cities, 2023, net",
      amt: "$9.2 billion",
      href: "https://www.cbo.gov/publication/61256",
    },
    {
      k: "NYC shelter actuals FY2023–25",
      amt: "$8.13 billion",
      href: "https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts",
    },
    {
      k: "SSI — noncitizens SSA lists as eligible",
      amt: "About 310,000, Dec. 2025",
      href: "https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm",
    },
  ],
  doors: [
    {
      k: "Parole",
      v: "CHNV and the rest. A memo. Not an amnesty statute they could not pass.",
      href: "https://www.uscis.gov/CHNV",
    },
    {
      k: "Asylum, then release",
      v: "A claim at the river. Then a court date. Then a city.",
      href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters",
    },
    {
      k: "8 U.S.C. § 1611",
      v: "The bar on federal benefits. Then the doors they left open.",
      href: "https://www.law.cornell.edu/uscode/text/8/1611",
    },
    {
      k: "8 U.S.C. § 1641",
      v: "Who counts as a qualified alien — parole, asylum, refugee.",
      href: "https://www.law.cornell.edu/uscode/text/8/1641",
    },
  ],
};

/** Tax money to an agency to a private nonprofit. Congress votes the water. */
export const FUNNEL = {
  k: "The funnel",
  line: "Tax money leaves as an appropriation. An agency writes a grant. A private nonprofit cashes it. The public 990 does not have to name the other donors.",
  v: "The money does not leave the Treasury as a check to a party. It leaves as an appropriation. Congress votes it. An agency writes a grant. A private nonprofit cashes it. In fiscal 2023 the United States disbursed about $71.9 billion in foreign aid. The U.S. Agency for International Development moved about $43.8 billion of that. The Federal Emergency Management Agency awarded nearly $1.4 billion in fiscal 2023–24 through shelter programs to states, cities, and nonprofits. The Inspector General could not ensure the money was used as the law required. Congress funds the National Endowment for Democracy at $315 million. That is taxpayer money into party-aligned shops. Federal grant money is not supposed to buy a campaign (2 CFR 200.450). Separate from the grant is the 501(c)(4). 26 U.S.C. § 6104: for most tax-exempt groups, contributor names are redacted from the public Form 990. The IRS has the names. The country does not. 527s and FEC committees do list large donors — including George Soros on prosecutor-race filings. The PAC is public. The 501(c)(4) feeder is not. No charging document says a named donor paid a rioter to set a fire. 2020 still burned. Tax-exempt groups still ran bail and protest infrastructure. Congress still does not require the names or an itemized street ledger. Secretaries of state still sit on dirty rolls while 52 U.S.C. § 20507 already requires a reasonable effort to take the dead and the moved off the list. America is funding a pipe it cannot see. That is a failure of oversight.",
  href: "https://www.foreignassistance.gov/",
  pipes: [
    {
      k: "U.S. Agency for International Development",
      amt: "$43.8 billion of $71.9 billion",
      note: "Foreign aid, fiscal 2023. The Inspector General audited $25.9 billion.",
      href: "https://www.usaspending.gov/agency/agency-for-international-development",
    },
    {
      k: "Federal Emergency Management Agency",
      amt: "$1.4 billion",
      note: "Shelter programs, fiscal 2023–24. Inspector General: cannot ensure the law was followed.",
      href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf",
    },
    {
      k: "National Endowment for Democracy",
      amt: "$315 million",
      note: "Fiscal 2024. Grants to the National Democratic Institute and the International Republican Institute.",
      href: "https://www.law.cornell.edu/uscode/text/22/4411",
    },
    {
      k: "Public 990 — donor names redacted",
      amt: "26 U.S.C. § 6104",
      note: "Most 501(c) groups. The IRS has the Schedule B. The public copy does not. That is the dark.",
      href: "https://www.law.cornell.edu/uscode/text/26/6104",
    },
    {
      k: "Prosecutor races — the PAC is named",
      amt: "FEC · IRS 527",
      note: "Large donors, including George Soros, appear on disclosed committees that back district attorneys. The 501(c)(4) feeder does not have to name them.",
      href: "https://www.fec.gov/data/receipts/individual-contributions/?contributor_name=SOROS%2C%20GEORGE",
    },
    {
      k: "Voter rolls — the statute already exists",
      amt: "52 U.S.C. § 20507",
      note: "A reasonable effort to remove the dead and the moved. HAVA § 21083. Congress never tied the election grant to a clean list.",
      href: "https://www.law.cornell.edu/uscode/text/52/20507",
    },
  ],
};

/** House roll call on H.R. 7152, Civil Rights Act of 1964. Not a party trophy. */
export const ROLL_1964 = {
  href: "https://www.congress.gov/bill/88th-congress/house-bill/7152",
  title: "1964 civil rights law — how they voted",
  dek: "Not a Democratic trophy. Not a Republican trophy. The roll call.",
  rows: [
    { who: "Republicans", line: "8 in 10 said yes  ·  138 to 34", pct: 80 },
    { who: "Democrats", line: "6 in 10 said yes  ·  152 to 96  ·  96 Democrats voted no", pct: 61 },
  ],
};

export const CHARTS: {
  src: string;
  title: string;
  sources: { label: string; href: string }[];
}[] = [
  {
    src: "/images/chart-paying-taliban.jpg",
    title: "Paying the Taliban",
    sources: [
      { label: "SIGAR 24-22", href: "https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-24-22-AR.pdf" },
      { label: "SIGAR 25-16", href: "https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-25-16-AR.pdf" },
      { label: "SIGAR August 2025", href: "https://www.govinfo.gov/content/pkg/GOVPUB-S-PURL-gpo248012/pdf/GOVPUB-S-PURL-gpo248012.pdf" },
    ],
  },
  {
    src: "/images/chart-they-dont-write.jpg",
    title: "They don’t write the bills",
    sources: [
      { label: "Article I", href: "https://constitution.congress.gov/constitution/article-1/" },
      { label: "2 U.S.C. § 1601", href: "https://www.law.cornell.edu/uscode/text/2/1601" },
      { label: "Senate LDA", href: "https://lda.senate.gov/system/public/" },
    ],
  },
  {
    src: "/images/chart-fema-two-jobs.jpg",
    title: "FEMA ran two jobs",
    sources: [
      { label: "FEMA INF advisory", href: "https://content.govdelivery.com/attachments/USDHSFEMA/2023/08/29/file_attachments/2597953/FEMA%20Advisory%20FEMA%20Announces%20Implementation%20of%20Immediate%20Needs%20Funding%2020230829.pdf" },
      { label: "DHS OIG-26-04", href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf" },
      { label: "House Homeland — Oct. 11, 2024", href: "https://homeland.house.gov/wp-content/uploads/2024/10/2024-10-11-Green-et-al-to-Mayorkas-DHS-re-FEMA-Funding-Priorities.pdf" },
      { label: "GAO — Helene helpline", href: "https://www.gao.gov/products/gao-26-108154" },
      { label: "GAO — Maui wildfire", href: "https://www.gao.gov/products/gao-25-106862" },
    ],
  },
  {
    src: "/images/chart-what-they-bought.jpg",
    title: "What the taxpayer bought",
    sources: [
      { label: "FEMA SSP NOFO", href: "https://www.fema.gov/sites/default/files/documents/fema_gpd_ssp-a-nofo_fy24.pdf" },
      { label: "ICE FY2024 Annual Report", href: "https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf" },
      { label: "NYC Comptroller", href: "https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts" },
      { label: "DOJ — Laken Riley", href: "https://www.justice.gov/usao-mdga/pr/three-venezuelans-sentenced-prison-possessing-fake-green-cards" },
    ],
  },
  {
    src: "/images/chart-funnel.jpg",
    title: "The funnel — taxpayer to nonprofit, donor names redacted, prosecutor money, voter rolls",
    sources: [
      { label: "ForeignAssistance.gov", href: "https://www.foreignassistance.gov/" },
      { label: "USASpending — U.S. Agency for International Development", href: "https://www.usaspending.gov/agency/agency-for-international-development" },
      { label: "26 U.S.C. § 6104 — public 990, donor names redacted", href: "https://www.law.cornell.edu/uscode/text/26/6104" },
      { label: "FEC — Soros individual receipts", href: "https://www.fec.gov/data/receipts/individual-contributions/?contributor_name=SOROS%2C%20GEORGE" },
      { label: "52 U.S.C. § 20507 — voter list maintenance", href: "https://www.law.cornell.edu/uscode/text/52/20507" },
      { label: "22 U.S.C. § 4411 — National Endowment for Democracy", href: "https://www.law.cornell.edu/uscode/text/22/4411" },
    ],
  },
  {
    src: "/images/chart-they-ran-it.jpg",
    title: "They ran it anyway — Crossfire Hurricane",
    sources: [
      { label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
      { label: "Barr on Mueller", href: "https://www.justice.gov/archives/opa/speech/attorney-general-william-p-barr-delivers-remarks-release-report-investigation-russian" },
      { label: "Congressional Record H.Res. 630", href: "https://www.congress.gov/congressional-record/volume-165/issue-163/house-section/article/H8153-5" },
    ],
  },
  {
    src: "/images/chart-lawfare.jpg",
    title: "Taxpayer-funded hoaxes — caption, evidence, file",
    sources: [
      { label: "Article II", href: "https://constitution.congress.gov/constitution/article-2/" },
      { label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
      { label: "Horowitz IG — FISA", href: "https://oig.justice.gov/reports/2019/o1912.pdf" },
      { label: "USAO-DC — January 6 tally", href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol" },
    ],
  },
  {
    src: "/images/chart-one-word-ledger.jpg",
    title: "The fake news list — caption versus the file",
    sources: [
      { label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
      { label: "USAO-DC — January 6 tally", href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol" },
      { label: "DOJ SDNY — Maduro charged", href: "https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current" },
      { label: "Trump v. Hawaii", href: "https://www.supremecourt.gov/opinions/17pdf/17-965_h315.pdf" },
    ],
  },
  {
    src: "/images/chart-one-word.jpg",
    title: "One word — kidnapped versus arrested",
    sources: [
      { label: "DOJ SDNY — Maduro charged, 26 March 2020", href: "https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current" },
      { label: "State Department — Maduro captured", href: "https://www.state.gov/nicolas-maduro-moros" },
      { label: "18 U.S.C. § 1201", href: "https://www.law.cornell.edu/uscode/text/18/1201" },
    ],
  },
  {
    src: "/images/chart-helped-hurt.jpg",
    title: "Helped and hurt",
    sources: [
      { label: "Congress.gov", href: "https://www.congress.gov/" },
      { label: "BLS — Consumer Price Index", href: "https://www.bls.gov/cpi/" },
      { label: "EIA — the gallon", href: "https://www.eia.gov/petroleum/gasdiesel/" },
      { label: "CBP nationwide", href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters" },
    ],
  },
  {
    src: "/images/chart-inflation-party.jpg",
    title: "Actual inflation — Consumer Price Index, who held Congress",
    sources: [
      { label: "BLS — Consumer Price Index", href: "https://www.bls.gov/cpi/" },
      { label: "9.1% — June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
      { label: "BLS live — August 2026, 3.4%", href: "https://www.bls.gov/news.release/cpi.nr0.htm" },
      { label: "FRED — 12-month CPI", href: "https://fred.stlouisfed.org/graph/?id=CPIAUCSL&units=pc1" },
    ],
  },
  {
    src: "/images/chart-border.jpg",
    title: "The open border — by administration",
    sources: [
      { label: "CBP — southwest encounters", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
      { label: "CBO — 2023 state and local cost", href: "https://www.cbo.gov/publication/61256" },
    ],
  },
  {
    src: "/images/chart-border-all.jpg",
    title: "Every path CBP counts",
    sources: [
      { label: "CBP — nationwide", href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters" },
      { label: "CBP — enforcement statistics", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
      { label: "DHS OHSS", href: "https://ohss.dhs.gov/khsm/cbp-encounters" },
    ],
  },
  {
    src: "/images/chart-border-toll.jpg",
    title: "What Americans still pay",
    sources: [
      { label: "CBP nationwide", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
      { label: "CBO emergency Medicaid", href: "https://www.cbo.gov/publication/60805" },
      { label: "NYC Comptroller", href: "https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts" },
      { label: "CDC fentanyl", href: "https://www.cdc.gov/nchs/blog/posts/2026/03/most-common-drugs-in-u-s-overdose-deaths-2017-2023.html" },
      { label: "ICE FY2024", href: "https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf" },
    ],
  },
  {
    src: "/images/chart-crime.jpg",
    title: "Crime — murder rate by administration",
    sources: [
      { label: "FBI — violent crime 2025", href: "https://www.fbi.gov/news/stories/violent-crime-falls-at-historic-rate-new-fbi-data-show" },
      { label: "BJS — Crime Known to Law Enforcement, 2024", href: "https://bjs.ojp.gov/document/ckle24.pdf" },
    ],
  },
  {
    src: "/images/chart-harm-pie.jpg",
    title: "The debt they added — $40.09 trillion",
    sources: [
      { label: "Treasury — debt to the penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
      { label: "Historical debt outstanding", href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/" },
    ],
  },
  {
    src: "/images/chart-job.jpg",
    title: "Congress holds the money",
    sources: [
      { label: "Treasury — debt to the penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
      { label: "CRS R48612", href: "https://www.congress.gov/crs-product/R48612" },
      { label: "CBO — last surplus FY 2001", href: "https://www.cbo.gov/data/budget-economic-data" },
    ],
  },
  {
    src: "/images/chart-blame.jpg",
    title: "The fire is Congress. The blame game is politics.",
    sources: [
      { label: "Article I", href: "https://constitution.congress.gov/constitution/article-1/" },
      { label: "5 U.S.C. § 3331", href: "https://www.law.cornell.edu/uscode/text/5/3331" },
      { label: "2 U.S.C. § 1415", href: "https://www.law.cornell.edu/uscode/text/2/1415" },
      { label: "CBO", href: "https://www.cbo.gov/data/budget-economic-data" },
    ],
  },
  {
    src: "/images/chart-1964.jpg",
    title: "1964 civil rights law — the roll call",
    sources: [
      { label: "H.R. 7152, 88th Congress", href: "https://www.congress.gov/bill/88th-congress/house-bill/7152" },
    ],
  },
  {
    src: "/images/chart-debt-bars.jpg",
    title: "Who added the debt",
    sources: [
      { label: "Treasury — debt to the penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
      { label: "Historical debt outstanding", href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/" },
    ],
  },
  {
    src: "/images/chart-debt-why.jpg",
    title: "The debt — no oversight, $40 trillion, full-time pay for part-time hours",
    sources: [
      { label: "CBO — budget", href: "https://www.cbo.gov/topics/budget" },
      { label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
      { label: "GAO fraud", href: "https://www.gao.gov/products/gao-25-107746" },
    ],
  },
  {
    src: "/images/chart-aliens.jpg",
    title: "The invasion bill — taxpayer cost and the eligibility doors",
    sources: [
      { label: "CBP nationwide", href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters" },
      { label: "CBO 61256", href: "https://www.cbo.gov/publication/61256" },
      { label: "CBO 60805", href: "https://www.cbo.gov/publication/60805" },
      { label: "8 U.S.C. § 1611", href: "https://www.law.cornell.edu/uscode/text/8/1611" },
    ],
  },
  {
    src: "/images/chart-oval-encounters.jpg",
    title: "The Oval — border encounters",
    sources: [
      { label: "CBP — nationwide encounters", href: "https://www.cbp.gov/newsroom/stats/nationwide-encounters" },
      { label: "CBP — enforcement statistics", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
    ],
  },
  {
    src: "/images/chart-oval-prices.jpg",
    title: "The Oval — highest price spike",
    sources: [
      { label: "BLS — Consumer Price Index", href: "https://www.bls.gov/cpi/" },
      { label: "9.1 percent — June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
    ],
  },
  {
    src: "/images/chart-oval-caption.jpg",
    title: "The Oval — caption versus tape",
    sources: [
      { label: "Mueller report", href: "https://www.justice.gov/archives/sco/file/1373816/dl" },
      { label: "23-cr-257", href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf" },
      { label: "Call memo", href: "https://www.whitehouse.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf" },
      { label: "C-SPAN — Ellipse", href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-save-america-rally" },
      { label: "H.Res. 24", href: "https://www.congress.gov/bill/117th-congress/house-resolution/24" },
    ],
  },
  {
    src: "/images/chart-oval-cases.jpg",
    title: "The Oval — the cases",
    sources: [
      { label: "Mueller report", href: "https://www.justice.gov/archives/sco/file/1373816/dl" },
      { label: "23-cr-257", href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf" },
      { label: "H.Res. 755", href: "https://www.congress.gov/bill/116th-congress/house-resolution/755" },
      { label: "H.Res. 24", href: "https://www.congress.gov/bill/117th-congress/house-resolution/24" },
    ],
  },
  {
    src: "/images/chart-oval-gallon.jpg",
    title: "The Oval — highest weekly gasoline",
    sources: [
      { label: "EIA — weekly regular", href: "https://www.eia.gov/petroleum/gasdiesel/" },
    ],
  },
  {
    src: "/images/chart-oval-slogan.jpg",
    title: "The Oval — the slogan versus the document",
    sources: [
      { label: "Brandenburg v. Ohio", href: "https://supreme.justia.com/cases/federal/us/395/444/" },
      { label: "Article IV, Section 4", href: "https://constitution.congress.gov/constitution/article-4/" },
      { label: "Federalist 10", href: "https://guides.loc.gov/federalist-papers/text-10-17#s-lg-box-wrapper-25493273" },
      { label: "18 U.S.C. § 2383", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
    ],
  },
];

const COMPARE_SRC = [
  "/images/chart-helped-hurt.jpg",
  "/images/chart-inflation-party.jpg",
  "/images/chart-debt-why.jpg",
  "/images/chart-oval-encounters.jpg",
  "/images/chart-oval-prices.jpg",
  "/images/chart-oval-gallon.jpg",
  "/images/chart-oval-caption.jpg",
  "/images/chart-oval-cases.jpg",
  "/images/chart-pump-admins.jpg",
  "/images/chart-crime.jpg",
  "/images/chart-border.jpg",
  "/images/chart-aliens.jpg",
  "/images/chart-what-they-bought.jpg",
  "/images/chart-fema-two-jobs.jpg",
  "/images/chart-funnel.jpg",
  "/images/chart-they-dont-write.jpg",
  "/images/chart-paying-taliban.jpg",
  "/images/chart-lawfare.jpg",
  "/images/chart-they-ran-it.jpg",
  "/images/chart-one-word-ledger.jpg",
  "/images/chart-one-word.jpg",
  "/images/chart-blame.jpg",
  "/images/chart-pump-years.jpg",
  "/images/chart-pump-flow.jpg",
];

export const COMPARE_WIDE = new Set([
  "/images/chart-helped-hurt.jpg",
  "/images/chart-lawfare.jpg",
  "/images/chart-one-word-ledger.jpg",
  "/images/chart-one-word.jpg",
  "/images/chart-funnel.jpg",
  "/images/chart-what-they-bought.jpg",
  "/images/chart-oval-encounters.jpg",
  "/images/chart-oval-prices.jpg",
  "/images/chart-oval-gallon.jpg",
  "/images/chart-oval-caption.jpg",
  "/images/chart-oval-cases.jpg",
  "/images/chart-debt-why.jpg",
  "/images/chart-aliens.jpg",
  "/images/chart-inflation-party.jpg",
  "/images/chart-border.jpg",
  "/images/chart-crime.jpg",
  "/images/chart-pump-admins.jpg",
  "/images/chart-pump-years.jpg",
  "/images/chart-pump-flow.jpg",
]);

export const COMPARE_CHARTS = COMPARE_SRC.map((src) => {
  const hit = CHARTS.find((c) => c.src === src);
  return (
    hit ?? {
      src,
      title: src.includes("pump-flow")
        ? "How a gallon is built — OPEC to the pump"
        : src.includes("pump-admins")
        ? "The gallon — four administrations"
        : "Highest week of each year, 2001–2026",
      sources: [
        { label: "EIA", href: "https://www.eia.gov/petroleum/gasdiesel/" },
        { label: "FRED GASREGW", href: "https://fred.stlouisfed.org/series/GASREGW" },
      ],
    }
  );
});

function chartsFor(...srcs: string[]) {
  return srcs
    .map((src) => CHARTS.find((c) => c.src === src) ?? COMPARE_CHARTS.find((c) => c.src === src))
    .filter((c): c is (typeof CHARTS)[number] => Boolean(c));
}

export const TAB_CHARTS: Record<ScoreRoom, ReturnType<typeof chartsFor>> = {
  gop: chartsFor(
    "/images/chart-debt-bars.jpg",
    "/images/chart-1964.jpg",
    "/images/chart-inflation-party.jpg",
    "/images/chart-they-dont-write.jpg",
    "/images/chart-blame.jpg",
  ),
  dem: chartsFor(
    "/images/chart-border.jpg",
    "/images/chart-aliens.jpg",
    "/images/chart-what-they-bought.jpg",
    "/images/chart-fema-two-jobs.jpg",
    "/images/chart-funnel.jpg",
    "/images/chart-paying-taliban.jpg",
    "/images/chart-lawfare.jpg",
    "/images/chart-they-ran-it.jpg",
  ),
  split: chartsFor(
    "/images/chart-harm-pie.jpg",
    "/images/chart-job.jpg",
    "/images/chart-debt-why.jpg",
    "/images/chart-blame.jpg",
  ),
  oval: chartsFor(
    "/images/chart-oval-encounters.jpg",
    "/images/chart-oval-prices.jpg",
    "/images/chart-oval-gallon.jpg",
    "/images/chart-oval-caption.jpg",
    "/images/chart-oval-cases.jpg",
    "/images/chart-oval-slogan.jpg",
    "/images/chart-pump-admins.jpg",
    "/images/chart-crime.jpg",
  ),
  compare: chartsFor(
    "/images/chart-helped-hurt.jpg",
    "/images/chart-inflation-party.jpg",
    "/images/chart-debt-bars.jpg",
    "/images/chart-oval-encounters.jpg",
    "/images/chart-oval-prices.jpg",
    "/images/chart-border.jpg",
  ),
};

export const OVAL_DESK_CHARTS: Record<OvalDesk, ReturnType<typeof chartsFor>> = {
  four: TAB_CHARTS.oval,
  trump1: chartsFor(
    "/images/chart-oval-caption.jpg",
    "/images/chart-oval-cases.jpg",
    "/images/chart-oval-slogan.jpg",
    "/images/chart-oval-encounters.jpg",
    "/images/chart-oval-prices.jpg",
    "/images/chart-oval-gallon.jpg",
    "/images/chart-lawfare.jpg",
  ),
  trump2: chartsFor(
    "/images/chart-oval-encounters.jpg",
    "/images/chart-oval-prices.jpg",
    "/images/chart-oval-gallon.jpg",
    "/images/chart-crime.jpg",
    "/images/chart-oval-slogan.jpg",
    "/images/chart-oval-cases.jpg",
  ),
};

export const FILE_CHIPS: {
  k: string;
  v: string;
  href: string;
  hot?: boolean;
}[] = [
  {
    k: "GAO fraud — the auditor",
    v: "$233–521 billion a year. COVID unemployment: $100–135 billion. Hundreds of billions walked. Convictions in the thousands. Unread bills. No lock. That is the door.",
    href: "https://www.gao.gov/products/gao-25-107746",
    hot: true,
  },
  {
    k: "Lawfare — not allowed",
    v: "The people own this country. A caption, a warrant, and a stacked docket were used to replace the American argument. That effort is on the record. It is not a debate.",
    href: "/dispatch/a-war-on-americans",
    hot: true,
  },
  {
    k: "Republicans",
    v: "What they passed that helped. What they passed that hurt. Every named bill, on this page.",
    href: "#gop-file",
  },
  {
    k: "Democrats",
    v: "What they passed that helped. What they passed that hurt. Every named bill, on this page.",
    href: "#dem-file",
  },
];

/** Who ran the House and the Senate. That is the purse. */
export const MAJORITY: {
  who: string;
  when: string;
  could: string;
  did: string;
  href: string;
  extra?: { label: string; href: string }[];
}[] = [
  {
    who: "Republican majority — House and Senate",
    when: "1995–2001 · 2003–07 · 2015–19 · 2025–now",
    could: "They could pass a spending bill without Democrats.",
    did: "Tax cuts. Iraq. Unpaid drug benefit. Border down this term. Debt still up.",
    href: "https://www.congress.gov/bill/115th-congress/house-bill/1",
    extra: [
      { label: "CBP border numbers", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
      { label: "Treasury debt", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/" },
    ],
  },
  {
    who: "Democratic majority — House and Senate",
    when: "1993–95 · 2007–11 · 2021–23",
    could: "They could pass a spending bill without Republicans.",
    did: "Raised taxes. Passed ObamaCare. Prices hit 9.1% in 2022. Record border: 10.83 million nationwide encounters FY2021–24. Fentanyl, ER waits, hotels, homicides. Social Security retirement fund depletes Q4 2032 — then 78% of the check. The debt still went up. February 24, 2026: asked to stand if the first duty is American citizens, not illegal aliens, they stayed seated.",
    href: "https://www.congress.gov/bill/111th-congress/house-bill/3590",
    extra: [
      { label: "BLS — 9.1% prices, June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
      { label: "CBP border numbers", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
      { label: "Clinton — basket of deplorables", href: "https://time.com/4486502/hillary-clinton-basket-of-deplorables-transcript/" },
      { label: "DOJ — Minnesota fraud pile", href: "https://www.whitehouse.gov/fact-sheets/2026/01/fact-sheet-president-donald-j-trump-establishes-new-department-of-justice-division-for-national-fraud-enforcement/" },
      { label: "DHS — ICE assaults 2025", href: "https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults" },
      { label: "DOJ — Prairieland ICE attack", href: "https://www.justice.gov/opa/pr/leader-antifa-cell-members-north-texas-sentenced-100-years-prison-terrorist-attack-ice" },
    ],
  },
  {
    who: "They split — one house each",
    when: "Most other years. Nixon. Bush 41. 2011–15. COVID. 2023–25.",
    could: "Neither party could spend alone. They still spent.",
    did: "A Republican president with a Democratic Congress is not an excuse. Nixon: Republican in the White House, Democrats ran Congress, the debt still rose. The $40 trillion is both of them.",
    href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/",
  },
];

/** The job they will not do. Government sources only. */
export const FAILURE: {
  value: string;
  label: string;
  href: string;
}[] = [
  {
    value: "FY 2001",
    label: "Last time the books balanced. Twenty-five years of red ink since. That is the fraud door.",
    href: "https://www.cbo.gov/data/budget-economic-data",
  },
  {
    value: "$17 million",
    label: "Treasury account for workplace settlements, 1997–2017. Not all members. Not all sex. Still taxpayer funds.",
    href: "https://www.law.cornell.edu/uscode/text/2/1415",
  },
  {
    value: "Deplorables · garbage",
    label: "Clinton, Sept. 9, 2016: half of Trump’s supporters a “basket of deplorables,” some “irredeemable.” Biden, Oct. 29, 2024: White House stenographers wrote “his supporters” as the garbage. The press office inserted an apostrophe. Nazis. Pedophiles. The smear is the method. The voter is the target.",
    href: "https://time.com/4486502/hillary-clinton-basket-of-deplorables-transcript/",
  },
  {
    value: "They did not police their own",
    label: "Maine Senate, 2026: Graham Platner, Democratic nominee, a Totenkopf — SS death’s-head — on his chest. He covered it after it became public. New Jersey-12: Adam Hamawy, Democratic nominee, took the stand as a defense witness for Omar Abdel Rahman, the Blind Sheikh, United States v. Rahman, 93 Cr. 181 (S.D.N.Y.), the 1993 World Trade Center bombing case. Minnesota: DOJ charged 98 in Feeding Our Future and related Medicaid and housing fraud; 85 of Somali descent; 64 convicted. The labels went to the American. The file went to the party.",
    href: "https://www.whitehouse.gov/fact-sheets/2026/01/fact-sheet-president-donald-j-trump-establishes-new-department-of-justice-division-for-national-fraud-enforcement/",
  },
  {
    value: "Not peaceable assembly",
    label: "The First Amendment protects peaceable assembly. It does not protect doxxing an ICE officer, assaulting him, or smashing the building. 18 U.S.C. § 111 is assault on a federal officer. 18 U.S.C. § 119 is publishing his home address to threaten him. 18 U.S.C. § 1361 is government property. DHS: 275 ICE assaults Jan. 20–Dec. 31, 2025, against 19 in 2024. 66 vehicular attacks against 2. DOJ: Prairieland Detention Center, July 4, 2025 — Antifa cell sentenced for attacking the facility. Direct Action Minnesota: 15 indicted for assaulting federal officers and destroying government property. Sanctuary politicians’ rhetoric is in the DHS file. That is unrest. It is not a rally.",
    href: "https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults",
  },
  {
    value: "$233–521 billion",
    label: "GAO’s yearly estimate of federal fraud. An estimate, not a courtroom. No budget on time is an open door. USAID and NGO grants sit in that door. That is not a filed money-laundering case.",
    href: "https://www.gao.gov/products/gao-26-108945",
  },
  {
    value: "SS + Medicare + Medicaid + interest",
    label: "CBO: that is what drives the debt. Congress writes those programs. Improper payments are their miss, not an accident.",
    href: "https://www.cbo.gov/publication/61172",
  },
];

export const DEBT_BY_TERM: {
  who: string;
  added: string;
  congress: string;
}[] = [
  { who: "FDR (D) 1933–45", added: "+$237B", congress: "Dem both (entire term)" },
  { who: "Truman (D) 1945–53", added: "+$7B", congress: "Dem most; GOP both 1947–49" },
  { who: "Eisenhower (R) 1953–61", added: "+$25B", congress: "Split. GOP both 53–55; Dem both 55–61" },
  { who: "JFK / LBJ (D) 1961–69", added: "+$63B", congress: "Dem both (entire)" },
  { who: "Nixon / Ford (R) 1969–77", added: "+$345B", congress: "Dem both (entire)" },
  { who: "Carter (D) 1977–81", added: "+$295B", congress: "Dem both" },
  { who: "Reagan (R) 1981–89", added: "+$1.86T", congress: "Split most; Dem both 87–89" },
  { who: "GHW Bush (R) 1989–93", added: "+$1.49T", congress: "Dem both" },
  { who: "Clinton (D) 1993–01", added: "+$1.46T", congress: "Democrats ran Congress 93–95. Republicans ran it 95–01" },
  { who: "GW Bush (R) 2001–09", added: "+$6.1T", congress: "Republicans ran Congress 03–07. Mixed the rest" },
  { who: "Obama (D) 2009–17", added: "+$8.0T", congress: "Democrats ran Congress 09–11. Republicans ran it 15–17" },
  { who: "Trump 1 (R) 2017–21", added: "+$7.8T", congress: "Republicans ran Congress 17–19. Split 19–21" },
  { who: "Biden (D) 2021–25", added: "+$8.5T", congress: "Democrats ran Congress 21–23. Split 23–25" },
  { who: "Trump 2 (R) 2025–", added: "+$3.8T (to Aug 2026)", congress: "Republicans ran Congress" },
];

/** FY2026 legislative branch, P.L. 119-37 / CRS R48612. $7.258B total. */
export const LEG_BRANCH: { label: string; amount: string; billions: number }[] = [
  { label: "House of Representatives", amount: "$2.083B", billions: 2.083 },
  { label: "Senate", amount: "$1.467B", billions: 1.467 },
  { label: "Capitol Police + mutual aid", amount: "$882M", billions: 0.882 },
  { label: "Library of Congress (incl. CRS)", amount: "$852M", billions: 0.852 },
  { label: "Architect of the Capitol", amount: "$812M", billions: 0.812 },
  { label: "GAO", amount: "$812M", billions: 0.812 },
  { label: "GPO", amount: "$132M", billions: 0.132 },
  { label: "CBO", amount: "$75M", billions: 0.075 },
  { label: "Joint items & other", amount: "$143M", billions: 0.143 },
];

export const LEG_BRANCH_TOTAL = 7.258;

/** What the pamphlet costs vs the country. Sources on each row. */
export const IMPOSSIBLE: {
  item: string;
  low: string;
  high: string;
  vsRevenue: string;
  vsGdp: string;
  href: string;
}[] = [
  {
    item: "Medicare for All — extra federal (10 years)",
    low: "$32–34T (Urban Institute)",
    high: "$40–75T (Cato, M4A-style)",
    vsRevenue: "6–13 years of every federal tax dollar at CBO’s 2026 receipts ($5.6T)",
    vsGdp: "More than one full year of U.S. GDP (~$32T) on the low Urban extra-federal figure alone",
    href: "https://www.urban.org/urban-wire/dont-confuse-changes-federal-health-spending-national-health-spending",
  },
  {
    item: "Reparations",
    low: "$10–12T (Darity / Brookings); $16T on 2022 SCF (Darity 2026)",
    high: "$13.5–28T (Cato on the DSA stack)",
    vsRevenue: "2–5 years of every federal tax dollar",
    vsGdp: "A third to nearly a full year of the entire economy — on top of Medicare for All, not instead of it",
    href: "https://www.brookings.edu/articles/black-reparations-and-the-racial-wealth-gap/",
  },
  {
    item: "Federal jobs guarantee (DSA)",
    low: "$4.4T / 10 years (Cato low)",
    high: "$60.4T / 10 years (Cato high)",
    vsRevenue: "0.8–11 years of every federal tax dollar",
    vsGdp: "A fourth line on a meter that is already past $40T",
    href: "https://www.cato.org/blog/who-will-pay-democratic-socialisms-200-trillion-cost",
  },
  {
    item: "DSA program stacked (10 years)",
    low: "$71T new federal spending (Cato)",
    high: "$212T (Cato high)",
    vsRevenue: "13–38 years of every federal tax dollar. There are only 10 years in the window.",
    vsGdp: "Cato: government share of GDP in a range that does not leave a private economy standing",
    href: "https://www.cato.org/blog/who-will-pay-democratic-socialisms-200-trillion-cost",
  },
];

export const CAPACITY = [
  { k: "Federal receipts, FY2026 (CBO)", v: "$5.6T" },
  { k: "Federal outlays, FY2026 (CBO)", v: "$7.4T" },
  { k: "Deficit, FY2026 (CBO)", v: "$1.9T" },
  { k: "U.S. GDP (CBO: outlays 23.3% of GDP)", v: "~$32T" },
  { k: "Gross federal debt (Treasury, Aug 2026)", v: "$40.0T" },
];

export const SCORE_ROWS: ScoreRow[] = [
  {
    topic: "On the ballot",
    gop: "The line that cut the tax (TCJA) and, this term, actually closed the border. Ugly sentences on tape we already print. They still owe twelve bills by October 1.",
    dem: "A party with a line on every federal race. DSA-endorsed names sit on that line in dozens of districts. The D is how they get in the door.",
    dsa: "Brookings: 282 endorsed candidates this cycle. Not a think tank. Names. Primaries already won and lost. If they hold a seat, the 2026 program is not a PDF. It is a vote.",
    href: "https://www.brookings.edu/articles/democratic-socialist-candidates-show-gains-but-limited-reach-in-2026/",
  },
  {
    topic: "Show the slides",
    gop: "Prime time. Every network that takes a public license. A deck: how the agenda will not be blocked the Trump agenda the country voted. Line by line. Dollar by dollar. Anyone who will not sign it agrees, on camera, to go home.",
    dem: "Same night. Same chair. Medicare for all, or whatever it was renamed: the slide that says where the money comes from. Urban Institute already put extra federal cost near $32–34 trillion over ten years. If the number is different, show the arithmetic. Slogans are not a budget.",
    dsa: "The 2026 program is already a pamphlet. Put it on a slide with a pay-for. Cato’s high-end read of the stack does not fit in a $40T country. If that is unfair, bring a better table. Compassion without a ledger is a campaign, not a government.",
    href: "https://www.urban.org/urban-wire/dont-confuse-changes-federal-health-spending-national-health-spending",
  },
  {
    topic: "Full time or resign",
    gop: "Congress took $7.258 billion for FY2026 (P.L. 119-37). The floor sits fewer days than a school year. Call time is not the job. In session means in the building. No board, no book tour as the main event. Work the hours or leave the chair.",
    dem: "Same payroll. Same part-time gavel. There is no lecture to the country about ‘essential workers’ from a chamber that keeps banker’s hours and a fundraiser’s calendar. Full time or resign.",
    dsa: "The platform wants the state to run health, housing, and the largest firms. Then a part-time legislature is not the instrument. Show up every weekday or take the name off the ballot.",
    href: "https://www.congress.gov/crs-product/R48612",
  },
  {
    topic: "Stop the split",
    gop: "Vow, on the same broadcast: no more neighbor-as-enemy copy. Debate the statute. Ugly sentences already on tape stay on the record. The jersey is not the job.",
    dem: "Same vow. MRC logged 92% negative coverage of the 2025 term in the first hundred days on the big three. The split cannot be outsourced the split to a caption and call it journalism. Work for the country, not the clip.",
    dsa: "Same vow. ‘Abolish ICE’ as a chant is not a hearing. If the program is the ask, bring it in daylight, not as a purity test that turns a neighbor into a fascist for asking who pays.",
    href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage",
  },
  {
    topic: "Warfare talk",
    gop: "McCaul, leaving after 22 years: the job became ‘fight and kill the other side.’ That is a Republican chairman’s obituary for the House, not a riot order. Ugly sentences already on tape stay on the record. Same rule as the other column: an employee does not declare war on the people who pay him.",
    dem: "Jeffries, on C-SPAN: ‘maximum warfare, everywhere, all the time,’ then ‘break them’ and ‘break their spirit.’ Schumer, Court steps, 2020: ‘you have released the whirlwind and you will pay the price.’ Waters, 2018: if they are seen in a restaurant, ‘create a crowd’ and ‘push back on them.’ Those are employees. The spirit they named belongs to the electorate.",
    dsa: "Class-enemy talk as a program. Same rule. A pamphlet is not a license to mark neighbors as the other side to be broken.",
    href: "https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623",
  },
  {
    topic: "Recess blockade",
    gop: "No party gets this cheat. GOP Senate used empty-room gavels to freeze Obama’s fill-the-job appointments. A Senate that bangs a gavel in an empty room so a president cannot staff the government is obstruction. Article II, Section 2 is not optional when the Oval is friendly. NLRB v. Noel Canning: a real break is at least ten days. An empty room with a gavel is not a break.",
    dem: "Same cheat, other jersey. Democratic Senate used fake sessions against Bush and against Trump. Dislike of a president is not a special rule. A fake session is a fake session. It turns off the Recess Appointments Clause on purpose. Score it as obstruction of the administration the country hired — whoever sits in the chair.",
    dsa: "The platform wants to abolish the Senate. Recess theater is a smaller crime next to that. Still: no faction gets a secret veto by gavel. Either the Senate is in session or it is not.",
    href: "https://www.oyez.org/cases/2013/12-1281",
  },
  {
    topic: "What they got right",
    gop: "TCJA, 2017: take-home pay rose. This term: southwest-border encounters at a 50-year low (Pew). That is the file. The ugly sentences stay on this card too, so it is not a smear sheet.",
    dem: "Social Security’s passage and the 1964 Civil Rights Act are on this party’s ledger. This journal said it would print the wins. This Congress does not get those trophies for a caption. Credit the statute that still stands. Do not pretend 2020 was peace.",
    dsa: "They publish the program. That is more honest than a six-second caption. Honesty about wanting a new constitution is not a virtue that pays for the constitution. It is still the file.",
    href: "https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/",
  },
  {
    topic: "Smears are not a statute",
    gop: "A clip is not a budget. Flagging a citizen is not a hearing. Ugly sentences already on tape stay on this card — including yours. What has to stop is using a smear instead of a bill. Govern or go home.",
    dem: "When they cannot beat the file they make the file radioactive. Fourteen replies. A child-sex lie. Reports filed, posts stayed. That is not opposition. That is not oversight. It is noise, and noise does not appropriate a dollar or locate a child. It has to stop. Bring a statute or leave the microphone.",
    dsa: "A purity test is not a law. Calling a neighbor a fascist for asking who pays is not a program. The 2026 pamphlet is the file. The smear is the dodge.",
    href: "https://constitution.congress.gov/constitution/amendment-1/",
  },
  {
    topic: "Who gets to hear",
    gop: "There is no state television. The same rule applies: play the uncut tape. If a network buries an ugly sentence, we still print it. If a network buries theirs, we print that too. Censorship of the recording is how a country is taught a crime that was never filed.",
    dem: "MRC: 92% negative coverage of the 2025 term in the first hundred days on ABC/CBS/NBC. That is not a free press doing its job. That is a filter on what the people are allowed to hear. A caption that says ‘mostly peaceful’ while a precinct burns is not journalism. It is harm. The people own the argument. A panel does not.",
    dsa: "Deplatform as policy. If the other ledger cannot be heard, the pamphlet wins by silence. That is not democracy. That is an editor with a government-sized thumb.",
    href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage",
  },
  {
    topic: "The whole file",
    gop: "Twelve money bills, on time. Full text, CBO score, and every table posted 72 hours before a vote. No giant unread bill. Every reconciliation print in full — not a one-pager the whip emails at 2 a.m. Waive the layover and the job failed.",
    dem: "Same. Congress wrote the 1974 Budget Act and have not finished a budget on time since Clinton. The narrative is the clip. The file is the stack. Post the stack or leave the chair.",
    dsa: "Same. A replacement constitution does not get a secret annex. If the people cannot read the pay-for, it is not a mandate. It is a pamphlet.",
    href: "https://www.congress.gov/help/learn-about-the-legislative-process",
  },
  {
    topic: "Taxes",
    gop: "They cut the tax. TCJA, 2017. Take-home pay rose. That is the one thing a working person can feel. JCT: the cut also punched about $1.5 trillion out of ten-year revenue. Honest: lower tax, bigger hole. Still the only column that lowered the rate.",
    dem: "They campaign to raise the top rates and to let pieces of TCJA die. The Inflation Reduction Act added a 15% corporate minimum. The direction is up.",
    dsa: "Workers Deserve More: public ownership of the largest firms. That is not a rate. That is taking the company.",
    href: "https://www.jct.gov/",
  },
  {
    topic: "Debt — $40T on the meter",
    gop: "Treasury: $40 trillion, August 2026. Just Facts, votes 2009–2022: the average House Republican voted to raise spending $1.6 trillion. Senate Republicans $5.7 trillion. They cut the tax. They still failed October 1. They did not vote like the other column.",
    dem: "Same $40T. Just Facts: average House Democrat voted to raise spending $19.9 trillion (2009–2022). Senate Democrats $14.0 trillion. The term table below is Treasury/OMB with who held both chambers. Nixon/Ford: Republican Oval, Democratic Congress, +$345B. GHW Bush: same pattern, +$1.49T. The purse is Congress.",
    dsa: "Cato on their program: Medicare-for-all-style $40–75 trillion over ten years on a $40 trillion meter. Reparations, jobs guarantee, free housing. High end toward $200 trillion. Not remotely possible.",
    href: "https://www.justfacts.com/nationaldebt.asp",
  },
  {
    topic: "What they promise",
    gop: "Extend the tax cut. Keep the border closed. No replacement constitution.",
    dem: "Raise the top rates. Let pieces of TCJA expire. The clip will not mention the $40T.",
    dsa: "Medicare for all, free at the point of service. Reparations. Abolish ICE. New constitution. Cato: the bill does not fit in the country. https://www.cato.org/blog/who-will-pay-democratic-socialisms-200-trillion-cost",
    href: "https://www.cato.org/blog/who-will-pay-democratic-socialisms-200-trillion-cost",
  },
  {
    topic: "The economy",
    gop: "Capitalism with a tax cut. Trucks still roll. That is how a country eats.",
    dem: "Capitalism with more of the state in the annex. Still not public ownership of the firm.",
    dsa: "Public ownership of the largest firms. That is not a tweak. That is the end of the system that stocks the store. Capitalism is not a vibe. It is the only machine that has fed this many people. Their pamphlet does not.",
    href: "https://program.dsausa.org/",
  },
  {
    topic: "Border",
    gop: "This term: encounters at a 50-year low. Pew. Remain in Mexico, wall, detention. That is the file, not a feeling.",
    dem: "FY2022–2024: record encounters. Parole programs. Catch-and-release as practice. Cities paid the hotel bill. That is a policy, not a weather event.",
    dsa: "Abolish ICE. Amnesty regardless of status. Their 2026 program. Printed.",
    href: "https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/",
  },
  {
    topic: "The charter",
    gop: "No published plan to throw out Article I. They still hide the twin law in the annex.",
    dem: "They treat the document as a costume — Speech or Debate on a Sunday show, insurrection on a caption, no § 2383.",
    dsa: "Draft a new constitution. Abolish the Senate. Subordinate the Court. A democratic socialist republic. Their words.",
    href: "https://www.dsausa.org/",
  },
  {
    topic: "What the country will hear",
    gop: "A clip of an ugly sentence. We already print the ones on tape.",
    dem: "MRC: 92% negative coverage of the 2025 term in the first hundred days on ABC/CBS/NBC. Six seconds. A villain. Almost never a statute.",
    dsa: "Compassion as the caption. The program in the annex.",
    href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage",
  },
];
