export type ScoreCol = "gop" | "dem" | "dsa";

export type ScoreRow = {
  topic: string;
  gop: string;
  dem: string;
  dsa: string;
  href?: string;
};

/** Living midterms card. Update the cells when a vote or a Treasury table changes the file. */
export const SCORE_UPDATED = "2026-09-20";

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
    who: "Republicans ran both",
    when: "1861–75 · 1881–83 · 1889–91 · 1895–1911 · 1919–31 · 1947–49 · 1953–55 · 1995–2001 · 2003–07 · 2015–19 · 2025–now",
    added: "+$10.96 trillion",
    href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
  },
  {
    who: "Democrats ran both",
    when: "1857–59 · 1875–81 · 1893–95 · 1913–19 · 1933–47 · 1949–53 · 1955–81 · 1987–95 · 2007–11 · 2021–23",
    added: "+$12.65 trillion",
    href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
  },
  {
    who: "They split the gavel",
    when: "Every other year since 1857 — one house each",
    added: "+$16.48 trillion",
    href: "https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/",
  },
];

export const DEBT_MATH =
  "$10.96 + $12.65 + $16.48 = $40.09. Before 1857 the two parties did not yet run the modern Congress. The debt then was $29 million.";

/** Oval — nationwide CBP, BLS CPI peak, EIA gallon. */
export const OVAL = [
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
    when: "FY2025",
    enc: "0.69 million",
    encN: 0.69,
    cpi: "3.4%",
    cpiN: 3.4,
    gas: "$4.50 peak",
    note: "Nationwide FY2025. CPI year-over-year August 2026. EIA weekly regular: highest week $4.500 (May 11, 2026).",
  },
] as const;

export const OVAL_LINKS = [
  { label: "CBP — enforcement statistics", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
  { label: "BLS — CPI", href: "https://www.bls.gov/cpi/" },
  { label: "EIA — the gallon", href: "https://www.eia.gov/petroleum/gasdiesel/" },
  { label: "FRED UNRATE", href: "https://fred.stlouisfed.org/series/UNRATE" },
];

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
  v: "9.1 percent in June 2022. Democrats ran both chambers. That is the peak. The live table did not stop there. BLS, August 2026: 3.4 percent over the year. The grocery ticket is still their watch.",
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
    control: "Ran both the House and the Senate: 1995–2001 · 2003–07 · 2015–19 · 2025–now",
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
        k: "COVID checks. Both parties. Then the fraud.",
        bill: "H.R. 748 · CARES Act · 2020",
        href: "https://www.congress.gov/bill/116th-congress/house-bill/748",
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
    control: "Ran both the House and the Senate: 1993–95 · 2007–11 · 2021–23",
    debt: "Added about $9.59 trillion on those watches since 1993. TARP. Stimulus. 9.1% prices in 2022.",
    plus: [
      {
        k: "Raised the top tax. Cut the deficit that year.",
        bill: "H.R. 2264 · 1993",
        href: "https://www.congress.gov/bill/103rd-congress/house-bill/2264",
      },
    ],
    minus: [
      {
        k: "They opened the border. Seven million encounters. The bill is still due.",
        bill: "CBP · CBO 2023 · FY2021–24",
        href: "https://www.cbo.gov/publication/61256",
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
    ],
  },
];

/** Why the meter runs. Both parties. They hold the purse. */
export const DRIVERS: { k: string; v: string; href: string }[] = [
  {
    k: "Medicare, Medicaid, Social Security",
    v: "These three, plus interest, are the biggest lines on the card. Social Security is not a nest egg. The 2026 raise for the average retired worker is $56 a month — $2,015 to $2,071 (SSA). SSA’s own implied return for later cohorts is about 2% real. Markets historically paid 7–8%. Congress spent the surplus. The check is a transfer. They are angry the auditor turned on the light.",
    href: "https://www.ssa.gov/news/en/cola/factsheets/2026.html",
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
];

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
    src: "/images/chart-inflation-party.jpg",
    title: "Actual inflation — who held Congress",
    sources: [
      { label: "BLS CPI-U", href: "https://www.bls.gov/cpi/" },
      { label: "9.1% — June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
      { label: "BLS live — August 2026, 3.4%", href: "https://www.bls.gov/news.release/cpi.nr0.htm" },
      { label: "FRED — 12-month CPI", href: "https://fred.stlouisfed.org/graph/?id=CPIAUCSL&units=pc1" },
    ],
  },
  {
    src: "/images/chart-policy.jpg",
    title: "Policy — success and failure",
    sources: [
      { label: "Congress.gov", href: "https://www.congress.gov/" },
      { label: "BLS — June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
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
    src: "/images/chart-oval.jpg",
    title: "The Oval — encounters and the CPI peak",
    sources: [
      { label: "CBP — enforcement statistics", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
      { label: "BLS — CPI", href: "https://www.bls.gov/cpi/" },
      { label: "EIA — the gallon", href: "https://www.eia.gov/petroleum/gasdiesel/" },
    ],
  },
];

const COMPARE_SRC = [
  "/images/chart-oval.jpg",
  "/images/chart-border-toll.jpg",
  "/images/chart-debt-bars.jpg",
  "/images/chart-inflation-party.jpg",
  "/images/chart-border-all.jpg",
  "/images/chart-border.jpg",
  "/images/chart-crime.jpg",
  "/images/chart-policy.jpg",
  "/images/chart-harm-pie.jpg",
  "/images/chart-pump-admins.jpg",
  "/images/chart-pump-years.jpg",
];

export const COMPARE_WIDE = new Set([
  "/images/chart-oval.jpg",
  "/images/chart-border-toll.jpg",
  "/images/chart-inflation-party.jpg",
  "/images/chart-policy.jpg",
  "/images/chart-pump-years.jpg",
]);

export const COMPARE_CHARTS = COMPARE_SRC.map((src) => {
  const hit = CHARTS.find((c) => c.src === src);
  return (
    hit ?? {
      src,
      title: src.includes("pump-admins")
        ? "The gallon — four administrations"
        : "Regular gasoline by year",
      sources: [
        { label: "EIA", href: "https://www.eia.gov/petroleum/gasdiesel/" },
        { label: "FRED GASREGW", href: "https://fred.stlouisfed.org/series/GASREGW" },
      ],
    }
  );
});

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
    k: "Republicans",
    v: "What they passed that helped. What they passed that hurt. Every named bill, on this page.",
    href: "#gop",
  },
  {
    k: "Democrats",
    v: "What they passed that helped. What they passed that hurt. Every named bill, on this page.",
    href: "#dem",
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
    who: "Republicans ran both",
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
    who: "Democrats ran both",
    when: "1993–95 · 2007–11 · 2021–23",
    could: "They could pass a spending bill without Republicans.",
    did: "Raised taxes. Passed ObamaCare. Prices hit 9.1% in 2022. Record border crossings. The debt still went up.",
    href: "https://www.congress.gov/bill/111th-congress/house-bill/3590",
    extra: [
      { label: "BLS — 9.1% prices, June 2022", href: "https://www.bls.gov/news.release/archives/cpi_07132022.htm" },
      { label: "CBP border numbers", href: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
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
