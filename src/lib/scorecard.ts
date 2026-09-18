export type ScoreCol = "gop" | "dem" | "dsa";

export type ScoreRow = {
  topic: string;
  gop: string;
  dem: string;
  dsa: string;
  href?: string;
};

/** Living midterms card. Update the cells when a vote or a bill changes the file. */
export const SCORE_UPDATED = "2026-09-02";

/** Gross federal debt added by term. Treasury Debt to the Penny / OMB historical tables. Party control: Senate Historical Office; House History, Art & Archives. $40.03T as of Aug. 20, 2026. Congress — not the President — controls the purse. */
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
  { who: "Clinton (D) 1993–01", added: "+$1.46T", congress: "Dem both 93–95; GOP both 95–01" },
  { who: "GW Bush (R) 2001–09", added: "+$6.1T", congress: "Mixed; GOP both 03–07" },
  { who: "Obama (D) 2009–17", added: "+$8.0T", congress: "Dem both 09–11; GOP both 15–17" },
  { who: "Trump 1 (R) 2017–21", added: "+$7.8T", congress: "GOP both 17–19; split 19–21" },
  { who: "Biden (D) 2021–25", added: "+$8.5T", congress: "Dem both 21–23; split 23–25" },
  { who: "Trump 2 (R) 2025–", added: "+$3.8T (to Aug 2026)", congress: "GOP both" },
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
    gop: "The line that cut what you pay (TCJA) and, this term, actually closed the border. Ugly sentences on tape we already print. They still owe you twelve bills by October 1.",
    dem: "A party with a line on every federal race. DSA-endorsed names sit on that line in dozens of districts. The D is how they get in the door.",
    dsa: "Brookings: 282 endorsed candidates this cycle. Not a think tank. Names. Primaries already won and lost. If they hold a seat, the 2026 program is not a PDF. It is a vote.",
    href: "https://www.brookings.edu/articles/democratic-socialist-candidates-show-gains-but-limited-reach-in-2026/",
  },
  {
    topic: "Show the slides",
    gop: "Prime time. Every network that takes a public license. A deck: how you will not block the Trump agenda the country voted. Line by line. Dollar by dollar. Anyone who will not sign it agrees, on camera, to go home.",
    dem: "Same night. Same chair. Medicare for all, or whatever you renamed it: the slide that says where the money comes from. Urban Institute already put extra federal cost near $32–34 trillion over ten years. If your number is different, show the arithmetic. Slogans are not a budget.",
    dsa: "Your 2026 program is already a pamphlet. Put it on a slide with a pay-for. Cato’s high-end read of the stack does not fit in a $40T country. If that is unfair, bring a better table. Compassion without a ledger is a campaign, not a government.",
    href: "https://www.urban.org/urban-wire/dont-confuse-changes-federal-health-spending-national-health-spending",
  },
  {
    topic: "Full time or resign",
    gop: "You took $7.258 billion for FY2026 (P.L. 119-37). The floor sits fewer days than a school year. Call time is not the job. In session means in the building. No board, no book tour as the main event. Work the hours or leave the chair.",
    dem: "Same payroll. Same part-time gavel. You do not get to lecture the country about ‘essential workers’ from a chamber that keeps banker’s hours and a fundraiser’s calendar. Full time or resign.",
    dsa: "You want the state to run health, housing, and the largest firms. Then you of all people do not get a part-time legislature. Show up every weekday or take your name off the ballot.",
    href: "https://www.congress.gov/crs-product/R48612",
  },
  {
    topic: "Stop the split",
    gop: "Vow, on the same broadcast: no more neighbor-as-enemy copy. Debate the statute. Ugly sentences already on tape stay on the record. The jersey is not the job.",
    dem: "Same vow. MRC logged 92% negative coverage of the 2025 term in the first hundred days on the big three. You do not get to outsource the split to a chyron and call it journalism. Work for the country, not the clip.",
    dsa: "Same vow. ‘Abolish ICE’ as a chant is not a hearing. If you want the program, bring it in daylight, not as a purity test that turns a neighbor into a fascist for asking who pays.",
    href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage",
  },
  {
    topic: "The whole file",
    gop: "Twelve appropriations bills, on time. Full text, CBO score, and every table posted 72 hours before a vote. No omnibus. Every reconciliation print in full — not a one-pager the whip emails at 2 a.m. Waive the layover and you failed the job.",
    dem: "Same. You wrote the 1974 Budget Act and have not finished a budget on time since Clinton. The narrative is the clip. The file is the stack. Post the stack or leave the chair.",
    dsa: "Same. A replacement constitution does not get a secret annex. If the people cannot read the pay-for, it is not a mandate. It is a pamphlet.",
    href: "https://www.congress.gov/help/learn-about-the-legislative-process",
  },
  {
    topic: "Taxes",
    gop: "They cut the tax. TCJA, 2017. You kept more of the check. That is the one thing a working person can feel. JCT: the cut also punched about $1.5 trillion out of ten-year revenue. Honest: lower tax, bigger hole. Still the only column that lowered the rate.",
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
    dem: "They treat the document as a costume — Speech or Debate on a Sunday show, insurrection on a chyron, no § 2383.",
    dsa: "Draft a new constitution. Abolish the Senate. Subordinate the Court. A democratic socialist republic. Their words.",
    href: "https://www.dsausa.org/",
  },
  {
    topic: "What you will hear",
    gop: "A clip of an ugly sentence. We already print the ones on tape.",
    dem: "MRC: 92% negative coverage of the 2025 term in the first hundred days on ABC/CBS/NBC. Six seconds. A villain. Almost never a statute.",
    dsa: "Compassion as the caption. The program in the annex.",
    href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage",
  },
];
