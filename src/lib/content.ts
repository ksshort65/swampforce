import { LEDGER_POSTS } from "./ledgers";

export type Block =
 | { type: "p" | "h" | "q"; text: string }
 | { type: "ul"; items: string[] }
 | { type: "img"; src: string; alt: string };

export type Frame = { tag: string; they: string; tape: string; href?: string; ran?: string };
export type LawfareRow = {
  caption: string;
  /** The sentence sold to the public as a finding, not as an allegation. */
  sold: string;
  evidence: string;
  source: string;
  file: string;
  href: string;
  /** Name of the document the row opens. */
  doc?: string;
  /** Other records that belong on this case, not in a separate list. */
  docs?: { label: string; href: string }[];
};

export type EraRow = { who: string; years: string; line: string; href?: string };
export type EraTopic = { topic: string; rows: EraRow[] };

export type Post = {
 slug: string;
 title: string;
 dek: string;
 date: string;
 category: string;
 readMinutes: number;
 image: string;
 imageAlt: string;
 featured?: boolean;
 series?: string;
 part?: number;
 receipts?: { label: string; href: string }[];
 frames?: Frame[];
 /** Overrides the side-by-side intro when this ledger is not a Democratic frame. */
 frameDek?: string;
 frameLeft?: string;
 frameRight?: string;
 eras?: EraTopic[];
 lawfare?: LawfareRow[];
 video?: string;
 /** When true, this essay owns the grok.me share TITLE. The photo never changes. */
 shareLead?: boolean;
 /** Short lockup on the share card. Defaults to the essay title. */
 shareTitle?: string;
 body: Block[];
};

export const SITE = {
	name: "Swamp Force",
	domain: "swampforce.com",
	tagline:
		"Vote the facts. Not emotion. Not a hatred a party or a network manufactured. This journal uses documented government sources. No other opinion. No manufactured drama.",
	kicker: "Vote the file. Not the feeling.",
	closer:
		"Government sources only. Compare the action to the speech. That is the first step.",
	masthead:
		"The people are the employer. This journal prints the official record. No network. No manufactured drama.",
	xHandle: "SwampForce",
	email: "editor@swampforce.com",
	author: "Renee Stewart",
	copyright: "© 2026 Renee Stewart. All rights reserved.",
	mark: "Swamp Force™",
};
export const posts: Post[] = [
	{
		slug: "we-the-people",
		title: "We the People.",
		dek: "The Constitution does not open with Congress. It opens with the owner. The 535 are the hire. The hire has gone rogue.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/hero-capitol.jpg",
		imageAlt: "The Capitol — the people are the employer",
		featured: true,
		series: "The Republic",
		part: 0,
		receipts: [
			{ label: "The Preamble", href: "https://constitution.congress.gov/constitution/preamble/" },
			{ label: "Article I", href: "https://constitution.congress.gov/constitution/article-1/" },
			{ label: "Article V — how the charter is altered", href: "https://constitution.congress.gov/constitution/article-5/" },
			{ label: "First Amendment — petition", href: "https://constitution.congress.gov/constitution/amendment-1/" },
			{ label: "Ninth Amendment", href: "https://constitution.congress.gov/constitution/amendment-9/" },
			{ label: "Tenth Amendment", href: "https://constitution.congress.gov/constitution/amendment-10/" },
			{ label: "Article I, Section 5 — expel", href: "https://constitution.congress.gov/constitution/article-1/#article-1-section-5" },
			{ label: "Article II, Section 4 — impeachment", href: "https://constitution.congress.gov/constitution/article-2/#article-2-section-4" },
			{ label: "Fourteenth Amendment, Section 3", href: "https://constitution.congress.gov/constitution/amendment-14/#amendment-14-section-3" },
			{ label: "Article III, Section 3 — treason", href: "https://constitution.congress.gov/constitution/article-3/#article-3-section-3" },
			{ label: "5 U.S.C. § 3331 — the oath", href: "https://www.law.cornell.edu/uscode/text/5/3331" },
			{ label: "The Declaration of Independence", href: "https://www.archives.gov/founding-docs/declaration-transcript" },
			{ label: "CBO — last surplus, FY2001", href: "https://www.cbo.gov/data/budget-economic-data" },
			{ label: "Treasury — Debt to the Penny", href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny" },
		],
		body: [
			{
				type: "p",
				text: "The Constitution of the United States does not open with Congress, a president, a party, or a panel. It opens with three words. The [Preamble](https://constitution.congress.gov/constitution/preamble/): “We the People of the United States… do ordain and establish this Constitution for the United States of America.” The people made the government. The government did not make the people.",
			},
			{
				type: "q",
				text: "The people are the owner. Congress is the staff. The staff does not get to rewrite the first sentence.",
			},
			{
				type: "h",
				text: "The job is a list",
			},
			{
				type: "p",
				text: "[Article I](https://constitution.congress.gov/constitution/article-1/) is the job description. It lists what Congress may do. The purse, a declaration of war, and uniform rules of naturalization are on that list. What is not on the list stayed with the states and with the people. A member who talks as if the country is a possession is not reading the paper he swore to.",
			},
			{
				type: "p",
				text: "The oath is not a photograph. [5 U.S.C. § 3331](https://www.law.cornell.edu/uscode/text/5/3331) requires every member to swear to support and defend this Constitution “without any mental reservation or purpose of evasion.” Mental reservation is the legal name for crossing your fingers. An employee who takes that oath and then treats the people who pay him as a faction to be broken has left the job while keeping the paycheck.",
			},
			{
				type: "h",
				text: "How the hire goes rogue",
			},
			{
				type: "p",
				text: "Three hundred million people hired 535 clerks. Those clerks work part of the year on a full-year salary. They vote on bills they have not read. They have not closed a fiscal year on time as the appropriations calendar requires. The [Congressional Budget Office’s historical tables](https://www.cbo.gov/data/budget-economic-data) still show the last surplus in fiscal year 2001. The [Treasury’s Debt to the Penny](https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny) now prints more than forty trillion dollars. That is a staff that will not do the work it was hired to do.",
			},
			{
				type: "p",
				text: "A nation of this size cannot be overseen on a part-time floor. Oversight is the job. When oversight is skipped, fraud is the door the staff left open. Medicare, Medicaid, and Social Security are the largest lines on the card. Congress holds those lines. A chamber that will not pass twelve appropriations bills by October 1, year after year, is refusing the calendar it wrote for itself.",
			},
			{
				type: "h",
				text: "The daily product is a caption",
			},
			{
				type: "p",
				text: "Washington’s daily product is a caption. One word is swapped. Six seconds are cut from a speech. Kidnapped instead of arrested. Insurrection instead of a docket that never charged it. A republic cannot survive if half of it is taught to hate the other half as a substitute for a budget. Hatred does not require reading the bill. The file does: the statute, the inspector general, the Treasury table, the tape in full.",
			},
			{
				type: "h",
				text: "Alter or abolish",
			},
			{
				type: "p",
				text: "The [Declaration of Independence](https://www.archives.gov/founding-docs/declaration-transcript) is not a statute. It is the country’s statement of right. It names why governments exist, and what a people may do when a government stops doing that work. The National Archives prints the sentence in full:",
			},
			{
				type: "q",
				text: "That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, — That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness.",
			},
			{
				type: "p",
				text: "Destructive of these ends means a government that no longer secures life, liberty, and the pursuit of happiness, and no longer draws just power from consent. The Constitution is the form the people ordained so they would not need a second revolution every time the hire failed. The right sits in the Declaration. The machinery sits in the Constitution.",
			},
			{
				type: "h",
				text: "Alter the charter — Article V",
			},
			{
				type: "p",
				text: "[Article V](https://constitution.congress.gov/constitution/article-5/) is how the charter is altered. Two thirds of both Houses may propose an amendment. Or the legislatures of two thirds of the states may apply, and Congress “shall call a Convention for proposing Amendments.” Either proposal becomes part of the Constitution when three fourths of the states ratify. A term limit, a budget rule, or a narrower grant of power takes thirty-four state applications and thirty-eight ratifications. It does not take a street.",
			},
			{
				type: "h",
				text: "Remove the hire",
			},
			{
				type: "p",
				text: "[Article I, Section 2](https://constitution.congress.gov/constitution/article-1/#article-1-section-2) puts the whole House up every second year. That is the recall the Framers wrote for the chamber closest to the people. The [Seventeenth Amendment](https://constitution.congress.gov/constitution/amendment-17/) puts the Senate on a six-year clock, one third at a time. There is no federal recall of a sitting member between elections. The Constitution did not forget that tool. It refused it. The two-year House is the tool it chose instead. [Article I, Section 5](https://constitution.congress.gov/constitution/article-1/#article-1-section-5): each House may “punish its Members for disorderly Behaviour, and, with the Concurrence of two thirds, expel a Member.” [Article II, Section 4](https://constitution.congress.gov/constitution/article-2/#article-2-section-4): the President, Vice President, and all civil officers “shall be removed from Office on Impeachment for, and Conviction of, Treason, Bribery, or other high Crimes and Misdemeanors.” The [Fourteenth Amendment, Section 3](https://constitution.congress.gov/constitution/amendment-14/#amendment-14-section-3) bars from federal or state office any person who, having taken an oath to support the Constitution, engaged in insurrection or rebellion against it. Those are removals written in the charter. They run through a chamber, a trial, or a disqualification. They do not run through a crowd.",
			},
			{
				type: "h",
				text: "Petition",
			},
			{
				type: "p",
				text: "The [First Amendment](https://constitution.congress.gov/constitution/amendment-1/) forbids Congress from abridging “the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.” Peaceably is in the sentence. Petition is the legal name for a demand the hire has to receive. A million signatures on a term-limits petition that a chamber then ignores is not proof that the right is empty. It is proof that the hire is ignoring the right. The next election is how that file is closed.",
			},
			{
				type: "h",
				text: "What the people kept",
			},
			{
				type: "p",
				text: "The [Ninth Amendment](https://constitution.congress.gov/constitution/amendment-9/): “The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people.” The [Tenth Amendment](https://constitution.congress.gov/constitution/amendment-10/): “The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people.” Those two sentences are the remainder. They do not create a street procedure. They say the list in Article I is a list, not a blank check, and that rights the paper did not name were not thereby surrendered.",
			},
			{
				type: "h",
				text: "The line the charter drew",
			},
			{
				type: "p",
				text: "The Constitution does not authorize a private war on the government it created. [Article III, Section 3](https://constitution.congress.gov/constitution/article-3/#article-3-section-3) defines treason as levying war against the United States, or adhering to their enemies. [Article IV, Section 4](https://constitution.congress.gov/constitution/article-4/#article-4-section-4) requires the United States to guarantee every state a republican form of government and, on application, to protect a state against domestic violence. Assembly in the First Amendment is peaceable assembly. The Declaration named a right of a people. The Constitution turned that right into elections, expulsion, impeachment, petition, and Article V.",
			},
			{
				type: "q",
				text: "We the People own and operate this country. The 535 work here. Actions, not words. Alter the charter by Article V. Remove the hire by the vote, the expulsion, and the oath. That is how a country is taken back.",
			},
		],
	},
	{
		slug: "find-them",
		title: "Find them.",
		dek: "Three hundred thousand children are still a missing-persons file. This journal stands with them. Anyone blocking the search has chosen a side.",
		date: "2026-08-31",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/essay-find-them.jpg",
		imageAlt: "Child silhouettes behind a chain-link cage. They hid the children.",
		series: "The Border",
		part: 1,
		receipts: [],
		body: [
			{
				type: "p",
				text: "This journal treats missing children as a missing-persons file, not as a campaign costume. The [Department of Homeland Security stated in February 2026](https://www.dhs.gov/news/2026/02/24/making-america-safe-again-state-dhs-under-president-trump-and-secretary-noem) that the prior administration lost more than 450,000 unaccompanied children at the southwest border, and that a joint DHS and HHS effort had located 145,000 of them. The remainder is still a search. Anyone who tries to stop that search has chosen a side.",
			},
			{
				type: "q",
				text: "Find them. All of them. The search belongs to the agencies charged with the children, not to a protest line at the door.",
			},
			{
				type: "p",
				text: "The numbers have to be named as the government named them. The [DHS Office of Inspector General reported in August 2024 (OIG-24-46)](https://www.oig.dhs.gov/sites/default/files/assets/2024-08/OIG-24-46-Aug24.pdf) that ICE transferred more than 448,000 unaccompanied children to HHS from fiscal years 2019 through 2023, that more than 32,000 of those children failed to appear for immigration court, and that as of May 2024 ICE had not served a Notice to Appear on more than 291,000 of them. That is an accounting failure written by the government’s own inspector, not by a panel.",
			},
			{
				type: "p",
				text: "HHS publishes current counts of children still in Office of Refugee Resettlement care on its [unaccompanied children data page](https://www.hhs.gov/programs/social-services/unaccompanied-children/latest-uc-data-fy2024/index.html). Those monthly tables are the live inventory. They are not a complete map of every child already released to a sponsor. The inspector general’s file and the HHS tables have to be read together. One is the pipeline. The other is who is still in a bed tonight.",
			},
			{
				type: "h",
				text: "What the statutes already say",
			},
			{
				type: "p",
				text: "Sex trafficking of children is already a federal felony under [18 U.S.C. § 1591](https://www.law.cornell.edu/uscode/text/18/1591). Forced labor is already a federal felony under [18 U.S.C. § 1589](https://www.law.cornell.edu/uscode/text/18/1589). Bringing in and harboring certain aliens is already a federal felony under [8 U.S.C. § 1324](https://www.law.cornell.edu/uscode/text/8/1324). Homeland Security Investigations exists to knock on a door when a report sits in a drawer. If a public official demands that ICE be kept off that door, the official is not confused about the statute. The official is choosing that the report not be worked.",
			},
			{
				type: "p",
				text: "This page will not describe a child’s body to score a point. The file is ugly enough in nouns the Code already uses: debt bondage to a smuggler, labor that is not a summer job, sexual violence named as the crime it is. The remedy is the search, the warrant, the home visit, and the court date. The remedy is not a slogan.",
			},
			{
				type: "p",
				text: "It is a demand that every name in that file be found, and that every official who blocks the finding be removed from the work by the voters and by the law.",
			},
		],
	},
	{
		slug: "they-opened-the-border",
		title: "They opened the border.",
		dek: "Millions of encounters. Fentanyl in the morgue. Hotels on the taxpayer. The door was a policy. The policy was Democratic.",
		date: "2026-09-20",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/essay-defund-ice.jpg",
		imageAlt: "The border was a policy. The policy had a party.",
		featured: true,
		series: "The Border",
		part: 0,
		receipts: [],
		body: [
			{
				type: "p",
				text: "The southwest border is not a mystery. [U.S. Customs and Border Protection](https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters) publishes the encounters. U.S. Border Patrol’s count at the Mexico line, from CBP’s own fiscal-year tables as compiled by [Pew from that file](https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/): fiscal 2021, 1.66 million. Fiscal 2022, 2.21 million. Fiscal 2023, 2.05 million. Fiscal 2024, 1.53 million. That is more than seven million encounters in four fiscal years. Some people are counted more than once. The pile is still the pile. Fiscal 2025, after the Oval changed: 237,538. The lowest since 1970. A door that can close that fast was a door that had been held open.",
			},
			{
				type: "p",
				text: "The Rio Grande was not the only door. [CBP nationwide](https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics): 1.96 million in FY2021, 2.77 million in FY2022, 3.20 million in FY2023, 2.90 million in FY2024. That is 10.83 million encounters in four years — southwest land, the northern line, airports, seaports, Miami and every other sector CBP counts. [DHS OHSS](https://ohss.dhs.gov/khsm/cbp-encounters) splits it: 8.73 million on southwest land, about 2.10 million on the rest of the map. [House Homeland](https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/): more than half a million on the northern border in those four years; northern encounters in FY2024 were up more than 600 percent from FY2021. FY2025 nationwide fell to 691,906.",
			},
			{
				type: "img",
				src: "/images/chart-border-toll.jpg",
				alt: "What Americans still pay — encounters, hospitals, hotels, fentanyl, missing children, the criminal docket",
			},
			{
				type: "p",
				text: "Then they were moved. Texas [TDEM invoices](https://abc13.com/post/souther-border-texas-gov-greg-abbott-migrant-crisis-flights/14453558/): $124.6 million through January 10, 2024, to bus and fly more than 103,100 people to New York, Chicago, Denver, Washington, Philadelphia, Los Angeles. [New York City’s Comptroller](https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts) booked the rooms: $1.41 billion in FY2023, $3.70 billion in FY2024, $3.02 billion in FY2025 — $8.13 billion in one city. Chicago’s leaders put food and shelter at about $434 million from July 2022 to July 2024. Denver: $216 million to $340 million. [DHS OIG](https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf): FEMA awarded $1.4 billion in Shelter and Services and EFSP-H in FY2023–24, money transferred from CBP. Schools, emergency rooms, and hotel corridors were the community line. [8 U.S.C. § 1621](https://www.law.cornell.edu/uscode/text/8/1621) already said who may receive a state or local public benefit.",
			},
			{
				type: "q",
				text: "A door that falls shut in a year was a policy, not weather.",
			},
			{
				type: "p",
				text: "Who held the gavel when it opened: Democrats ran the White House from January 2021 to January 2025. They ran both the House and the Senate from January 2021 to January 2023. They ended Remain in Mexico. They ended the Title 42 public-health expulsion on May 11, 2023. They ran parole programs that turned a crossing into a status, a status into a Social Security number, and a number into a welfare check. [SSI is not Social Security](https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm). It is general revenue. SSA’s own spotlight lists parole, asylum, and refugee as doors into that check. [8 U.S.C. § 1611](https://www.law.cornell.edu/uscode/text/8/1611) already barred most federal benefits for aliens who are not qualified. Congress and the agencies built the exception, then called it compassion. [What the taxpayer bought](/dispatch/what-the-taxpayer-bought) is the rest of that stack: cash cards, phones, clothing, housing, property damage, and the homicide docket.",
			},
			{
				type: "p",
				text: "February 24, 2026. Joint session. The President asked every legislator to stand if they agreed with this sentence: the first duty of the American government is to protect American citizens, not illegal aliens. [C-SPAN recorded the ask](https://www.c-span.org/clip/joint-session-of-congress/user-clip-the-first-duty-of-the-american-government/5194380). Republicans stood. Democrats stayed seated. The [full address](https://www.c-span.org/program/joint-session-of-congress/2026-state-of-the-union-address/673636) is on the same tape. That is the party that opened the door, on camera, declining to say the people they work for come first.",
			},
			{
				type: "p",
				text: "The First Amendment protects [peaceable](https://constitution.congress.gov/constitution/amendment-1/) assembly. It does not protect doxxing an ICE officer, assaulting him, or smashing the building. [18 U.S.C. § 111](https://www.law.cornell.edu/uscode/text/18/111) is assault on a federal officer. [18 U.S.C. § 119](https://www.law.cornell.edu/uscode/text/18/119) is publishing his home address to threaten him. [18 U.S.C. § 1361](https://www.law.cornell.edu/uscode/text/18/1361) is government property. [DHS](https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults): 275 assaults on ICE officers from January 20 through December 31, 2025, against 19 in the same stretch of 2024. 66 vehicular attacks against 2. [DOJ](https://www.justice.gov/opa/pr/leader-antifa-cell-members-north-texas-sentenced-100-years-prison-terrorist-attack-ice): Prairieland Detention Center, July 4, 2025 — an Antifa cell sentenced for attacking the facility. [Minnesota](https://www.justice.gov/usao-mn/pr/15-members-direct-action-minnesota-minneapolis-based-direct-action-group-antifa-ties): 15 indicted for assaulting federal officers and destroying government property. Sanctuary rhetoric is in the DHS file. That is unrest. It is not a rally.",
			},
			{
				type: "h",
				text: "What every household paid",
			},
			{
				type: "p",
				text: "Fentanyl. [CDC / NCHS](https://www.cdc.gov/nchs/blog/posts/2026/03/most-common-drugs-in-u-s-overdose-deaths-2017-2023.html): fentanyl was the leading drug in overdose deaths every year from 2017 through 2023. Deaths involving fentanyl rose from 27,542 in 2017 to 73,944 in 2022. That is not a panel. That is a morgue table. Most of that powder is walked or driven across the same line CBP counts. Schools, first responders, and parents paid in funerals.",
			},
			{
				type: "p",
				text: "Children. [DHS](https://www.dhs.gov/news/2026/02/24/making-america-safe-again-state-dhs-under-president-trump-and-secretary-noem) stated that the prior administration lost more than 450,000 unaccompanied children at that border. A later search found 145,000. The rest is still a missing-persons file. [DHS OIG-24-46](https://www.oig.dhs.gov/sites/default/files/assets/2024-08/OIG-24-46-Aug24.pdf) already counted hundreds of thousands without a Notice to Appear. Sex trafficking of children is already [18 U.S.C. § 1591](https://www.law.cornell.edu/uscode/text/18/1591). The open door fed the crime.",
			},
			{
				type: "p",
				text: "Wages, rents, emergency rooms, and hotel bills. Cities put people in rooms the statute did not authorize. [8 U.S.C. § 1621](https://www.law.cornell.edu/uscode/text/8/1621) already said who may receive a state or local public benefit. Governors spent anyway. Schools added bodies without adding buildings. The American who waited in line, paid FICA, and followed the statute watched the line collapse. That is not xenophobia. That is a queue that stopped meaning anything.",
			},
			{
				type: "p",
				text: "This disaster has a party. Democrats held the Oval and, for two years, both chambers, while the encounters ran past two million a year. Republicans who voted to keep the door shut were not the authors of the parole memos. When the Oval changed, the number fell to a fifty-year low. [CBP](https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters) counted the door. [CDC](https://www.cdc.gov/nchs/blog/posts/2026/03/most-common-drugs-in-u-s-overdose-deaths-2017-2023.html) counted the morgue. The [inspector general](https://www.oig.dhs.gov/sites/default/files/assets/2024-08/OIG-24-46-Aug24.pdf) counted the children without a Notice to Appear. That is the record of a door, and of who held it open.",
			},
		],
	},
	{
		slug: "what-the-taxpayer-bought",
		title: "What the taxpayer bought",
		dek: "Cash cards. Phones. Clothing. Housing. Property smashed. Americans murdered. The federal grant listed the first four. ICE counted the last two.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chart-what-they-bought.jpg",
		imageAlt: "Cash cards, phones, clothing, housing, property damage, homicide — the taxpayer stack",
		series: "The Border",
		part: 0,
		receipts: [
			{ label: "FEMA SSP-A FY2024 NOFO — allowable costs", href: "https://www.fema.gov/sites/default/files/documents/fema_gpd_ssp-a-nofo_fy24.pdf" },
			{ label: "DHS OIG-26-04 — $1.4 billion SSP", href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf" },
			{ label: "NYC Mayor — debit-card transcript, Feb. 20, 2024", href: "https://www.nyc.gov/mayors-office/news/2024/02/transcript-mayor-adams-holds-in-person-media-availability-february-20" },
			{ label: "NYC Comptroller — asylum-seeker fiscal impacts", href: "https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts" },
			{ label: "ICE FY2024 Annual Report", href: "https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf" },
			{ label: "CBP — criminal noncitizen statistics FY2024", href: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics/criminal-noncitizen-statistics-fy2024" },
			{ label: "DOJ — Laken Riley murder investigation", href: "https://www.justice.gov/usao-mdga/pr/three-venezuelans-sentenced-prison-possessing-fake-green-cards" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-what-they-bought.jpg",
				alt: "Six boxes: cash cards, phones, clothing, housing, property, homicide",
			},
			{
				type: "p",
				text: "The grant listed the shopping list. [FEMA’s FY2024 Shelter and Services Program](https://www.fema.gov/sites/default/files/documents/fema_gpd_ssp-a-nofo_fy24.pdf) told applicants what the taxpayer would reimburse for people CBP had released: **shelter**, including hotel rooms at the GSA rate. **Clothing** — shirts, pants, outerwear, underwear, socks, shoes, backpacks, belts. **Cell phone plans** and internet, billed as facility utilities, capped at $10 a person a day overnight and $5 a day otherwise. Cots. Linens. Laundry. The [Inspector General](https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf) later found FEMA could not ensure the **$1.4 billion** in SSP and EFSP-H for fiscal 2023–24 was used as the law required. The list was never a rumor. It was Appendix A.",
			},
			{
				type: "p",
				text: "Cash cards are on the city’s own tape. On [February 20, 2024](https://www.nyc.gov/mayors-office/news/2024/02/transcript-mayor-adams-holds-in-person-media-availability-february-20), the Mayor of New York described a prepaid debit-card pilot for migrant families: 500 families to start, a contract that could reach **$53 million** at scale, the balance loaded for food and baby supplies. The [Comptroller](https://comptroller.nyc.gov/services/for-the-public/accounting-for-asylum-seeker-services/fiscal-impacts) already booked the rooms: **$8.13 billion** in three fiscal years for asylum-seeker services in one city. Housing was the hotel. The card was the grocery. Both were the taxpayer.",
			},
			{
				type: "p",
				text: "Then the rap sheet. [ICE’s FY2024 Annual Report](https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf): the 81,312 criminal noncitizens ERO arrested that year carried 516,050 charges and convictions. In that pile: **5,001 damage to property**. **2,894 homicides**. **18,579** sexual assault and sex offenses. Those are not 2,894 murders committed in 2024. They are the homicide charges and convictions already on the people ICE arrested — people who should not have been on an American street. [CBP](https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics/criminal-noncitizen-statistics-fy2024) homicide and manslaughter convictions among Border Patrol criminal-alien arrests: three, three, two, three in fiscal 2017–20. Then 60, 62, 29, 29 in fiscal 2021–24. The [Department of Justice](https://www.justice.gov/usao-mdga/pr/three-venezuelans-sentenced-prison-possessing-fake-green-cards) put Laken Hope Riley on the record: kidnapped and brutally murdered February 22, 2024, in Athens, Georgia, during a morning run. Jose Antonio Ibarra, who had entered illegally, was convicted of that murder and is serving life. The names and the docket are in [The hospital. Then the morgue.](/dispatch/the-hospital-and-the-morgue). The shopping list and the rap sheet are the same open door.",
			},
			{
				type: "q",
				text: "The grant paid for the phone and the hotel. ICE counted the smashed property and the homicide. The taxpayer paid for both.",
			},
		],
	},
	{
		slug: "the-hospital-and-the-morgue",
		title: "The hospital. Then the morgue.",
		dek: "Emergency rooms filled, then Americans died. The names of the accused are on ICE letterhead.",
		date: "2026-09-20",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/essay-defund-ice.jpg",
		imageAlt: "The hospital filled. Then the morgue.",
		featured: true,
		series: "The Border",
		part: 0,
		receipts: [],
		body: [
			{
				type: "p",
				text: "A hospital that takes Medicare already has to stabilize whoever walks in. That is [42 U.S.C. § 1395dd](https://www.law.cornell.edu/uscode/text/42/1395dd) — EMTALA. It does not ask for a Social Security number at the door. The American who paid the premiums waits behind the person CBP just released. The statute that was supposed to stop the bill is [8 U.S.C. § 1611](https://www.law.cornell.edu/uscode/text/8/1611). The workaround is emergency Medicaid.",
			},
			{
				type: "p",
				text: "[CBO, October 2, 2024](https://www.cbo.gov/publication/60805), answering House Budget: from fiscal 2017 through 2023, federal and state governments spent about $27 billion on emergency Medicaid for people ineligible for full Medicaid because of immigration status. The Biden years in that table are the spike. House Budget published the CBO run as more than [$16.2 billion](https://budget.house.gov/press-release/cbo-medicaid-spending-on-illegal-aliens-has-cost-taxpayers-over-162-billion-under-open-border-czar-harris) under that administration — up 124 percent from the same span under Trump. Fiscal 2021 alone: $7.05 billion. That is not a clinic visit. That is an ER that was already short of beds.",
			},
			{
				type: "q",
				text: "The American who paid FICA waited. The statute had already said who the check was for.",
			},
			{
				type: "h",
				text: "Then some of them killed people",
			},
			{
				type: "p",
				text: "Not a mood. Names. [DHS](https://www.dhs.gov/news/2026/01/29/dhs-celebrates-one-year-laken-riley-act): Laken Riley, a Georgia nursing student, was killed by Jose Antonio Ibarra, a Venezuelan illegal alien and Tren de Aragua member. CBP paroled him in September 2022. NYPD later arrested him for acting in a manner to injure a child. He was released. Then Laken was dead. Congress named a detention statute after her. In the first year of that Act, ICE arrested more than 21,400 illegal aliens with the crimes the Act lists.",
			},
			{
				type: "p",
				text: "Rachel Morin, a Maryland mother of five, 2023. [House Homeland](https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/): Victor Martinez-Hernandez, an illegal alien from El Salvador, entered during that surge, arrested June 17, 2024, for her murder. DHS later named Jocelyn Nungaray and Sheridan Gorman with Laken and Rachel on the same list of Americans killed after the door opened. The agency that counts the door put the dead on the record.",
			},
			{
				type: "p",
				text: "[ICE’s FY2024 Annual Report](https://www.ice.gov/doclib/eoy/iceAnnualReportFY2024.pdf): the 81,312 criminal noncitizens ERO arrested that year carried 516,050 charges and convictions. In that pile: 2,894 homicides. 5,001 damage to property. 18,579 sexual assault and sex offenses. 2,766 kidnappings. That is not “immigrants commit crime.” That is ICE counting the people it arrested who already had those charges or convictions — people who should not have been on a street in the first place.",
			},
			{
				type: "p",
				text: "[House Homeland](https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/), from ICE: as of July 21, 2024, nearly 650,000 criminal illegal aliens were on the non-detained docket. Free. [CBP](https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics/criminal-noncitizen-statistics-fy2024) homicide and manslaughter convictions among Border Patrol criminal-alien arrests: three, three, two, three in FY2017–20. Then 60, 62, 29, 29 in FY2021–24. The door and the rap sheet rose together.",
			},
			{
				type: "p",
				text: "Defund ICE is a vote to keep that docket on the street. [The hospital bill](https://www.cbo.gov/publication/60805) is already in CMS. The names are already on [ICE letterhead](https://www.ice.gov/news/releases/operation-angels-honor-14-day-nationwide-ice-operation-honor-laken-riley-results-more). The party that opened the door still wants the agency that picks the killers up taken off the payroll. That is the record. Not a feeling.",
			},
		],
	},
	{
		slug: "that-is-not-why-they-are-elected",
		title: "They forgot who they work for.",
		dek: "Congress is paid by the people. One leader said he wants to break the people's spirit.",
		date: "2026-09-17",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/capitol.jpg",
		imageAlt: "Empty House chamber. They do not represent the people.",
		featured: true,
		series: "The Republic",
		part: 1,
		receipts: [
			{ label: "Article I", href: "https://constitution.congress.gov/constitution/article-1/" },
			{ label: "5 U.S.C. § 3331 — the oath", href: "https://www.law.cornell.edu/uscode/text/5/3331" },
			{ label: "Fox News Radio — McCaul, July 12, 2026", href: "https://radio.foxnews.com/2026/07/12/from-washington-rep-michael-mccaul-on-two-decades-of-public-service-and-the-changing-face-of-congress/" },
			{ label: "C-SPAN — Jeffries news conference, April 22, 2026", href: "https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945" },
			{ label: "C-SPAN — “maximum warfare”", href: "https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623" },
			{ label: "C-SPAN — Jeffries, May 19, 2026", href: "https://www.c-span.org/program/public-affairs-event/house-minority-leader-jeffries-on-democracy/679567" },
			{ label: "C-SPAN — Schumer, March 4, 2020", href: "https://www.c-span.org/clip/us-senate/user-clip-youve-released-the-whirlwind-and-you-will-pay-the-price--sen-chuck-schumer/4944670" },
		],
		body: [
			{
				type: "p",
				text: "Members of the House are not hired to destroy the other party. They are hired to represent a district under [Article I of the Constitution](https://constitution.congress.gov/constitution/article-1/). The oath they take is [5 U.S.C. § 3331](https://www.law.cornell.edu/uscode/text/5/3331): support and defend this Constitution, without mental reservation. An employee who talks about the people who pay him as a spirit to be broken has left that oath.",
			},
			{
				type: "q",
				text: "An employee does not declare war on the people who pay him.",
			},
			{
				type: "p",
				text: "Representative Michael McCaul, leaving after twenty-two years as chairman of Homeland Security and of Foreign Affairs, said it on the way out. On July 12, 2026 he sat for [Fox News Radio’s From Washington](https://radio.foxnews.com/2026/07/12/from-washington-rep-michael-mccaul-on-two-decades-of-public-service-and-the-changing-face-of-congress/). The New York Times Magazine printed the sentences on September 16, 2026: “Internecine warfare is what has become vogue.” Then: “You’re elected not to get along with the other side and get good things done for the country. You’re elected to fight and kill the other side.” [The printed lines](https://www.nytimes.com/2026/09/16/magazine/congress-trump-midterms.html). That sentence is McCaul’s. It is not Article I. It is not the oath.",
			},
			{
				type: "p",
				text: "House Minority Leader Hakeem Jeffries said, on camera at a news conference carried in full by [C-SPAN on April 22, 2026](https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945), that “we are in an era of maximum warfare, everywhere, all the time.” The isolated sentence is [this C-SPAN clip](https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623). The next sentences in the same answer were about congressional maps. The whole file is the record. The words “maximum warfare” were still said, on camera, by an employee of the House, about tens of millions of Americans who vote.",
			},
			{
				type: "p",
				text: "On May 19, 2026, Jeffries sat for a [C-SPAN recording of the Center for American Progress IDEAS conference](https://www.c-span.org/program/public-affairs-event/house-minority-leader-jeffries-on-democracy/679567). In that room he said the goal was to “break them,” then: beat them electorally, “and then we have to break their spirit.” That is a second tape, a second room.",
			},
			{
				type: "p",
				text: "On March 4, 2020, Senate Minority Leader Chuck Schumer stood on the steps of the Supreme Court and said, of Justices Gorsuch and Kavanaugh, “you have released the whirlwind and you will pay the price” and “you won’t know what hit you.” [C-SPAN preserved the clip](https://www.c-span.org/clip/us-senate/user-clip-youve-released-the-whirlwind-and-you-will-pay-the-price--sen-chuck-schumer/4944670). Chief Justice Roberts issued a statement the same day.",
			},
		],
	},
	{
		slug: "clean-hands",
		title: "They keep their hands clean.",
		dek: "Careful words. A crowd takes the hint. Cities burn. Insurers counted a billion. The Member still has the chair.",
		date: "2026-09-16",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/essay-the-noise.jpg",
		imageAlt: "Empty chamber. The shrug is the policy.",
		featured: true,
		series: "The Republic",
		part: 2,
		receipts: [
			{ label: "Brandenburg v. Ohio", href: "https://supreme.justia.com/cases/federal/us/395/444/" },
			{ label: "First Amendment", href: "https://constitution.congress.gov/constitution/amendment-1/" },
			{ label: "Waters, June 23, 2018", href: "https://www.realclearpolitics.com/video/2018/06/26/maxine_waters_pelosi_and_schumer_dont_really_say_im_out_of_line.html" },
			{ label: "Pressley, February 9, 2020", href: "https://www.realclearpolitics.com/video/2020/02/09/ayanna_pressley_threatens_if_you_dont_see_the_light_then_we_will_bring_the_fire.html" },
			{ label: "Harris post, June 1, 2020", href: "https://x.com/KamalaHarris/status/1267555018128965643" },
			{ label: "Harris, CBS, June 17, 2020", href: "https://www.youtube.com/watch?v=NTg1ynIPGls" },
			{ label: "AP — Cynthia Johnson, December 8, 2020", href: "https://apnews.com/article/donald-trump-media-michigan-social-media-elections-553da610af99fee8c0119330dbac57d4" },
		],
		body: [
			{
				type: "p",
				text: "The method is not a memo that says “burn it.” The method is a sentence cut just short of [the Supreme Court's incitement test](https://supreme.justia.com/cases/federal/us/395/444/). That test: speech is punishable as incitement only if it is meant to cause imminent lawless action and is likely to cause it. So they do not say “torch the precinct at eight.” They say create a crowd. They should not let up. Bring the fire. People will do what they do. The crowd hears the rest. The Member keeps clean hands. The city pays.",
			},
			{
				type: "q",
				text: "They never light the match. They narrate the room until someone else does. Then they call it weather.",
			},
			{
				type: "h",
				text: "The wording",
			},
			{
				type: "p",
				text: "On June 23, 2018, Representative Maxine Waters told a Los Angeles rally: if anybody from that Cabinet is seen in a restaurant, a department store, or a gasoline station, “you get out and you create a crowd and you push back on them.” [The tape](https://www.realclearpolitics.com/video/2018/06/26/maxine_waters_pelosi_and_schumer_dont_really_say_im_out_of_line.html). She did not say assault. She said crowd.",
			},
			{
				type: "p",
				text: "On February 9, 2020, Representative Ayanna Pressley said: “If you don’t see the light, then we will bring the fire.” [The tape](https://www.realclearpolitics.com/video/2020/02/09/ayanna_pressley_threatens_if_you_dont_see_the_light_then_we_will_bring_the_fire.html). She did not name a block. She named a method.",
			},
			{
				type: "p",
				text: "On June 1, 2020, then-Senator Kamala Harris posted: “If you’re able to, chip in now to the @MNFreedomFund to help post bail for those protesting on the ground in Minnesota.” [Her post is still up.](https://x.com/KamalaHarris/status/1267555018128965643) Sixteen days later, on CBS, she said they are not going to stop before Election Day, not after, “they’re not going to let up, and they should not, and we should not.” [The Late Show posted the segment.](https://www.youtube.com/watch?v=NTg1ynIPGls) She named protest. Minneapolis had already seen a precinct burn. She did not say stop the arson. She said they should not let up. Then she pointed donors at a bail fund so the people in the street could return to the street.",
			},
			{
				type: "p",
				text: "On July 9, 2020, Speaker Nancy Pelosi was asked about a Columbus statue pulled down and thrown in Baltimore’s harbor. She said, “People will do what they do.”",
			},
			{
				type: "p",
				text: "On December 8, 2020, Michigan State Representative Cynthia Johnson of Detroit posted: “This is just a warning to you Trumpers. Be careful. Walk lightly. We ain’t playing with you. … And for those of you who are soldiers, you know how to do it. Do it right. Be in order. Make them pay.” [AP](https://apnews.com/article/donald-trump-media-michigan-social-media-elections-553da610af99fee8c0119330dbac57d4) · [MLive](https://www.mlive.com/public-interest/2020/12/michigan-lawmaker-who-faced-death-threats-punished-for-warning-trumpers-in-viral-video.html). She had been threatened with lynching. That is in the record. The next day she said “soldiers” meant soldiers of Christ. The first tape still says “you know how to do it.” The House stripped her committees. No prosecutor took that incitement test into court.",
			},
			{
				type: "h",
				text: "The bill",
			},
			{
				type: "p",
				text: "Property Claim Services has tracked insured civil-disorder losses since 1950. It classified May 26 through June 8, 2020 as a catastrophe, the first time a civil-disorder event was counted across more than twenty states. The Insurance Information Institute put the insured range at $1 billion to $2 billion. The prior record, the 1992 Los Angeles riots, was $775 million on the same books. City overtime, National Guard pay, and a shop with no policy are not in that number. Those land on the taxpayer.",
			},
			{
				type: "p",
				text: "The people who said create a crowd, bring the fire, they should not let up, people will do what they do, did not receive an invoice. They kept the chair. Speech or Debate in [Article I, Section 6](https://constitution.congress.gov/constitution/article-1/) covers words on the floor. The incitement test covers the rally and the talk show if no prosecutor can prove imminence. The arsonist, if caught, is a local case. The Member is a national brand. That is the split: rage is delegated. Liability is not.",
			},
			{
				type: "p",
				text: "The sentence is built to stop one word short of that test, so the member is not charged, while the arson and the assault remain crimes that prosecutors left unfiled. That decision did not create a right.",
			},
			{
				type: "h",
				text: "The cover",
			},
			{
				type: "p",
				text: "The First Amendment protects “the right of the people peaceably to assemble.” That word is in the [text](https://constitution.congress.gov/constitution/amendment-1/). It is not a mood. It is the condition. A march that stays on the sidewalk is the right. A police station on fire is a crime. A panel is not required to tell which one is on the screen.",
			},
			{
				type: "p",
				text: "On the night of May 28, 2020, the Minneapolis Third Precinct was abandoned and burned. CNN put a Kenosha fire on the screen under the caption “fiery but mostly peaceful protests.” If ninety-nine people walk and one person lights the precinct, the record is that a precinct burned. Peaceable assembly is the right in the First Amendment. A burning precinct is not assembly.",
			},
		],
	},
	{
		slug: "they-want-a-new-constitution",
		title: "They want a new Constitution.",
		dek: "A group running as Democrats wrote it down: replace this country. November 3 is the last easy stop.",
		date: "2026-09-18",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/constitution.jpg",
		imageAlt: "Empty House. Waiting is not the job.",
		featured: true,
		series: "The Republic",
		part: 5,
		receipts: [
			{
				label: "DSA — What is Democratic Socialism",
				href: "https://www.dsausa.org/about-us/what-is-democratic-socialism/",
			},
			{ label: "DSA program — Workers Deserve More", href: "https://program.dsausa.org/" },
			{
				label: "DSA program PDF, September 2, 2026",
				href: "https://program.dsausa.org/wp-content/uploads/2026/09/WDM-Program.pdf",
			},
			{
				label: "National Socialist German Workers’ Party — the 25 points, 1920",
				href: "https://avalon.law.yale.edu/imt/nsdappro.asp",
			},
		],
		body: [
			{
				type: "p",
				text: "The Democratic Socialists of America published a 2026 program that calls for drafting a new constitution and building a democratic socialist republic. That document is on their own site: the [DSA 2026 program PDF](https://program.dsausa.org/wp-content/uploads/2026/07/WDM-Program.pdf). A caucus inside that organization, [Red Star](https://redstarcaucus.org/zenith4-points-of-unity/), states that the aim is to abolish capitalism and ultimately to achieve communism. Those are their words. This journal does not need a reporter to translate them.",
			},
			{
				type: "p",
				text: "On their own page they state the belief in one line: working people should run both the economy and society democratically to meet human needs, not to make profits for a few. [What is Democratic Socialism](https://www.dsausa.org/about-us/what-is-democratic-socialism/). The program states the goal in their words: win the battle for democracy, draft a new constitution, and create a democratic socialist republic. [Workers Deserve More](https://program.dsausa.org/) · [PDF, September 2, 2026](https://program.dsausa.org/wp-content/uploads/2026/09/WDM-Program.pdf).",
			},
			{
				type: "p",
				text: "The National Socialist German Workers’ Party, 1920 program: nationalization of all trusts, abolition of income that does not arise from work, and a strong central authority over the state. [The 25 points](https://avalon.law.yale.edu/imt/nsdappro.asp).",
			},
			{
				type: "q",
				text: "They wrote a replacement country on a PDF. Members who swear this Constitution cannot pretend they did not read it.",
			},
			{
				type: "p",
				text: "Every Member swears, under [Article VI](https://constitution.congress.gov/constitution/article-6/) and [5 U.S.C. § 3331](https://www.law.cornell.edu/uscode/text/5/3331), to support this Constitution, without mental reservation. A faction that writes “new constitution” has announced a reservation. Federal law already bars a person from holding a federal position if that person advocates the overthrow of our constitutional form of government. See [5 U.S.C. § 7311](https://www.law.cornell.edu/uscode/text/5/7311). The [Communist Control Act, 50 U.S.C. § 841](https://www.law.cornell.edu/uscode/text/50/841), is still on the books. Pamphlets are not treason. Treason is [Article III, Section 3](https://constitution.congress.gov/constitution/article-3/) and [18 U.S.C. § 2381](https://www.law.cornell.edu/uscode/text/18/2381): levying war or adhering to enemies. That word stays intact. The oath stays on the page.",
			},
			{
				type: "p",
				text: "A seated Member cannot be bounced at the clerk because a district dislikes the platform. [Powell v. McCormack](https://supreme.justia.com/cases/federal/us/395/486/) and [U.S. Term Limits v. Thornton](https://supreme.justia.com/cases/federal/us/514/779/) closed that door. A Member of Congress cannot be recalled under current federal law. [Article I, Section 5](https://constitution.congress.gov/browse/essay/artI-S5-C2-2-1/ALDE_00013580/) leaves expulsion to a two-thirds vote of the House. [H.J.Res. 105 in the 104th Congress](https://www.congress.gov/bill/104th-congress/house-joint-resolution-105/text) would have given districts a recall. It died. [Article V](https://constitution.congress.gov/constitution/article-5/) is the remaining door: two-thirds of the state legislatures apply, and Congress shall call a convention. Until the states walk it, the lawful instruments are the purse, the Guarantee Clause in [Article IV, Section 4](https://constitution.congress.gov/browse/article-4/section-4/), and the next election.",
			},
			{
				type: "p",
				text: "Members of the House are hired to represent a district. The tape is the record of what they said instead.",
			},
		],
	},
	{
		slug: "the-docket",
		title: "How a dirty list goes to court.",
		dek: "Congress cannot be sued for being Congress. A dirty voter list into court in 90 days. Step by step.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "Empty House. The docket is the other election.",
		featured: true,
		series: "The Remedy",
		part: 3,
		receipts: [],
		body: [
			{
				type: "p",
				text: "Congress cannot be sued for being Congress. The Speech or Debate Clause in [Article I, Section 6](https://constitution.congress.gov/constitution/article-1/) and the standing rule in [Lujan v. Defenders of Wildlife](https://supreme.justia.com/cases/federal/us/504/555/) close that door. A dirty voter registration list into federal court. [52 U.S.C. § 20510](https://www.law.cornell.edu/uscode/text/52/20510) gives an aggrieved person a private right of action under the National Voter Registration Act. Written notice goes to the chief election official of the State. If the violation is not corrected in ninety days, the case may be filed in district court for an injunction. The court may award fees if the plaintiff prevails.",
			},
			{
				type: "q",
				text: "The tent does not need a palace. It needs a clean roll and a gavel. Clean the roll. Keep the gavel.",
			},
			{
				type: "p",
				text: "List maintenance is [52 U.S.C. § 20507](https://www.law.cornell.edu/uscode/text/52/20507). A noncitizen who votes in a federal election commits a crime under [18 U.S.C. § 611](https://www.law.cornell.edu/uscode/text/18/611). Unlawful voting is a deportable offense under [8 U.S.C. § 1227(a)(6)](https://www.law.cornell.edu/uscode/text/8/1227). Names go to the United States Attorney. The United States Attorney files. That is the lawful path. It is slow. It is real.",
			},
			{
				type: "p",
				text: "Bringing in and harboring certain aliens is [8 U.S.C. § 1324](https://www.law.cornell.edu/uscode/text/8/1324). Records of federal grants sit under the Freedom of Information Act, [5 U.S.C. § 552](https://www.law.cornell.edu/uscode/text/5/552). A class action that claims to vacate the House will be dismissed. [Powell v. McCormack](https://supreme.justia.com/cases/federal/us/395/486/) and [Luther v. Borden](https://supreme.justia.com/cases/federal/us/48/1/) already said why. Anyone selling that suit is selling a dismissal.",
			},
			{
				type: "p",
				text: "The next essay is who to call, with addresses, not a stranger on a video asking for the card.",
			},
		],
	},
	{
		slug: "call-these-first",
		title: "Who to call.",
		dek: "Real groups. Real addresses. Not a stranger on a video asking for money.",
		date: "2026-09-22",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The House. Call counsel. The docket is open.",
		featured: true,
		series: "The Remedy",
		part: 4,
		receipts: [],
		body: [
			{
				type: "p",
				text: "This journal is not a law firm. The first envelope is a ninety-day notice under [52 U.S.C. § 20510](https://www.law.cornell.edu/uscode/text/52/20510), sent to the chief election official of the State, not a class action against the House. A check mailed to a stranger on a video has left the docket.",
			},
			{
				type: "q",
				text: "The groups that already sue are the path. A clip is not a lawsuit.",
			},
			{
				type: "p",
				text: "For dirty voter rolls, start with counsel that already files National Voter Registration Act cases: [Judicial Watch](https://www.judicialwatch.org/), [America First Legal](https://aflegal.org/priority/election-integrity/), and the [Public Interest Legal Foundation](https://www.publicinterestlegal.org/). Those are their own sites. This journal does not vouch for a donation. It names who already knows how to write the ninety-day letter.",
			},
			{
				type: "p",
				text: "For sanctuary ordinances and public-benefit spending past [8 U.S.C. § 1621](https://www.law.cornell.edu/uscode/text/8/1621), the [Immigration Reform Law Institute](https://www.irli.org/) and [FAIR](https://www.fairus.org/) publish their own dockets. A state attorney general and the United States Attorney for the district are the public offices. Names of noncitizens who voted in a federal race go to the United States Attorney under [18 U.S.C. § 611](https://www.law.cornell.edu/uscode/text/18/611).",
			},
			{
				type: "p",
				text: "The envelope is a name, the statute, the records, and no manifesto. ",
			},
		],
	},
	{
		slug: "the-bill-they-sent",
		title: "They're spending taxpayer money on illegal immigrants.",
		dek: "Federal law already forbade using tax money to house illegal immigrants. Governors still paid for hotels, debit cards, and clothes.",
		date: "2026-09-20",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/essay-who-got-paid.jpg",
		imageAlt: "The bill. Taxpayers covering what the statute already barred.",
		featured: true,
		series: "The Remedy",
		part: 2,
		receipts: [],
		body: [
			{
				type: "p",
				text: "Federal law already said who may receive a public benefit. [8 U.S.C. § 1611](https://www.law.cornell.edu/uscode/text/8/1611) makes an alien who is not a qualified alien ineligible for federal public benefits, with narrow exceptions such as emergency medical care. [8 U.S.C. § 1621](https://www.law.cornell.edu/uscode/text/8/1621) does the same for state and local public benefits unless a state enacted an affirmative law after August 22, 1996. A hotel room, a prepaid card, a clothing stipend, and in-state tuition are not an emergency room. A governor who spends those items on people the statute bars is spending past supreme federal law.",
			},
			{
				type: "q",
				text: "Article VI is the same article as the oath. They swore it. Then they spent past it with taxpayer money.",
			},
			{
				type: "p",
				text: "[Article VI](https://constitution.congress.gov/constitution/article-6/) makes the Constitution and federal statutes the supreme law of the land. [Arizona v. United States](https://supreme.justia.com/cases/federal/us/567/387/) held that Congress occupies the field of immigration. A state need not loan its police to ICE. A state may not run a welcome mat federal law closed. [8 U.S.C. § 1373](https://www.law.cornell.edu/uscode/text/8/1373) forbids a gag on exchanging immigration-status information with federal officials. [8 U.S.C. § 1324](https://www.law.cornell.edu/uscode/text/8/1324) is harboring. That is a United States Attorney case, not a kitchen-table complaint against a sitting governor.",
			},
			{
				type: "p",
				text: "The [Department of Justice has filed complaints](https://www.justice.gov/opa/pr/department-justice-files-complaints-against-hawaii-dc-arkansas-and-utah-over-preferential) against jurisdictions that give illegal aliens in-state tuition. [HHS restored the 1996 welfare restrictions](https://www.hhs.gov/press-room/prwora-hhs-bans-illegal-aliens-accessing-taxpayer-funded-programs.html) on its own programs. Those dockets are the file. The statute does not supply a prison date. The ordinance and the contract go to the United States Attorney, who decides whether harboring is in the record.",
			},
			{
				type: "p",
				text: "The next lever is the legislature that can repeal the post-1996 statute, and the voter who hires that legislature.",
			},
		],
	},
	{
		slug: "they-let-them-walk",
		title: "They let criminals go free.",
		dek: "A cop is dead. The judge who let the man out is still on the bench. This is why the street feels like a siege.",
		date: "2026-09-19",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The chamber. They let them walk.",
		featured: true,
		series: "The Remedy",
		part: 1,
		receipts: [],
		body: [
			{
				type: "p",
				text: "Federal detention law is not a suggestion. [18 U.S.C. § 3142](https://www.law.cornell.edu/uscode/text/18/3142) directs a court to detain a defendant when no condition of release will reasonably assure the safety of any other person and the community. [8 U.S.C. § 1226(c)](https://www.law.cornell.edu/uscode/text/8/1226) says the Attorney General shall take into custody certain criminal aliens. When a court or a local statute sends a repeat felon home on an ankle monitor, the statute said shall and the robe said walk.",
			},
			{
				type: "q",
				text: "The statute said shall. The robe said walk. The public paid.",
			},
			{
				type: "p",
				text: "This journal will not recycle a local news item as if it were a federal finding. Name the charging document. Name the statute. If a judge released a defendant who then killed a police officer, the remedy is the record, the appellate court, impeachment or failure to retain under [Article I and Article II](https://constitution.congress.gov/browse/essay/artII-S4-4-5/ALDE_00013659/) where those tools apply, and the next election of the district attorney and the bench the state elects. It is not a crowd at the courthouse door.",
			},
			{
				type: "p",
				text: "The [United States Attorney for the District of Minnesota](https://www.justice.gov/usao-mn/pr/minneapolis-man-sentenced-more-28-years-prison-role-feeding-our-future-fraud-scheme) obtained a twenty-eight-year sentence in the Feeding Our Future fraud. That is a federal judgment. State sentencing grids are a different file. They stay on separate ledgers.",
			},
			{
				type: "p",
				text: "Oversight is a docket, a retention vote, and a legislature that can repeal cashless-bail experiments that the blood already tested.",
			},
		],
	},
	{
		slug: "who-got-paid",
		title: "Who got paid.",
		dek: "Up to $13 billion in one year. Cartels. Bought lanes. A bank indictment. The door was the product.",
		date: "2026-08-31",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/essay-who-got-paid.jpg",
		imageAlt: "Cash on a table. An unaccounted file. Who got paid.",
		series: "The Border",
		part: 2,
		receipts: [
			{ label: "DHS / House Homeland — smuggling up to $13B in 2021", href: "https://homeland.house.gov/2023/12/14/now-nobody-crosses-without-paying-senior-border-patrol-agents-describe-unprecedented-cartel-control-at-southwest-border/" },
			{ label: "Washington Post — smuggling $4–12B a year, Nov 2024", href: "https://www.washingtonpost.com/world/2024/11/01/migrant-smuggling-us-border-cartels/" },
			{ label: "House Homeland — 8.72M SWB encounters, 546,255 unaccompanied children since FY2021", href: "https://homeland.house.gov/2024/10/24/startling-stats-factsheet-fiscal-year-2024-ends-with-nearly-3-million-inadmissible-encounters-10-8-million-total-encounters-since-fy2021/" },
			{ label: "DOJ — CBP officer Garcia, Sinaloa lane, 9 years", href: "https://www.justice.gov/usao-sdca/pr/ex-cbp-officer-sentenced-opening-his-inspection-lane-cartel-drug-smugglers" },
			{ label: "DOJ — Cuellar indictment, Mexican bank and Azerbaijan, May 3, 2024", href: "https://www.justice.gov/archives/opa/pr/us-congressman-henry-cuellar-and-his-wife-charged-bribery-unlawful-foreign-influence-and" },
		],
		body: [
			{
				type: "p",
				text: "Somebody collected. That is the whole second file. A child does not walk a thousand miles on a vibe. A fee is paid, a route is sold, a sponsor is a customer, and a government that opens the door is the marketing department. DHS's own estimate, cited by House Homeland Security and by InSight Crime: human smuggling into the United States was generating as much as $13 billion a year by 2021 — Biden's first year. The Washington Post, November 2024: $4 billion to $12 billion a year as a top income stream. ILO's global trafficking number — about $150 billion worldwide — is a different ledger. Those numbers stay on different ledgers. The border product is the fee and the child as inventory."
			},
			{
				type: "q",
				text: "The customer was an open door. The seller was a cartel."
			},
			{
				type: "p",
				text: "CBP recorded 546,255 unaccompanied children at the southwest border since FY2021, on top of 8.72 million southwest encounters and about 2 million known gotaways. Somebody collected on every one of those bodies. Fentanyl rode the same lanes. That is not a metaphor. Former CBP officers in San Diego sold the shift: Jesse Clark Garcia, nine years, admitted since at least 2021 he fed the Sinaloa Cartel his duty schedule so cocaine, meth, and fentanyl could roll his lane. Diego Bonillo, 15 years. Leonard Darnell George, 23 years, bribes to pass drugs and people. The cartels did not need a senator in a movie. They needed a roster and a lane."
			},
			{
				type: "h",
				text: "Who is on the tape — and who is not"
			},
			{
				type: "p",
				text: "No Congressman is invented onto a Sinaloa payroll because a caption wants one. If there is no indictment, the page says so. April 2026: the United States indicted ten current and former Mexican officials — Morena party — for aiding Sinaloa trafficking. On this side of the river: Rep. Henry Cuellar (D-Texas) and his wife were indicted May 3, 2024, for about $600,000 in alleged bribes from Azerbaijan's state oil company and a Mexico City bank — not a named cartel, a bank and a foreign government. Two of his advisers pleaded guilty to laundering more than $200,000 of the Mexican-bank money. Trump later pardoned Cuellar. The pardon does not erase the charging document. It also does not turn the document into a Sinaloa membership card. That cut is not made. If a Republican took the same cash, his name goes on this page the same day.",
			},
			{
				type: "p",
				text: "The political tie that does not need a secret meeting is the term in office. The Democratic Party ran the border from 2021 to 2025. Encounters exploded. Cartel revenue exploded. 65,000 child-welfare reports sat in a drawer. Then the same party told the country to defund the only force that knocks on the sponsor's door. Who got paid: the cartel, the bought lane, the bank that needed a congressman, the contractor who processed the child like freight. Who got the child: too often, nobody who will say where she is. Part three is the tell — the vote to abolish the search. Part one is still the child. The child stays first. The math is the second file."
			},
			{
				type: "p",
				text: "The official record is the argument. Election Day is when the country can fire the people it hired.",
			},
		],
	},
	{
		slug: "defund-ice-is-the-tell",
		title: "Defund ICE is the tell.",
		dek: "The party that lost the children now wants the search abolished. That compass does not belong in office or on the ballot.",
		date: "2026-08-31",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/essay-defund-ice.jpg",
		imageAlt: "A blocked ICE doorway. Defund ICE is the tell.",
		series: "The Border",
		part: 3,
		receipts: [
			{ label: "Grassley — Democrats refused the whistleblower roundtable; opposed contractor and rule bills", href: "https://www.judiciary.senate.gov/press/rep/releases/new-hhs-data-confirms-biden-harris-admin-placed-tens-of-thousands-of-migrant-children-with-unvetted-sponsors-declined-recommended-home-studies" },
			{ label: "DHS — ICE and HSI locating children; backlog of ignored reports", href: "https://www.dhs.gov/news/2025/07/25/dhs-leads-efforts-to-rescue-child-victims-of-sex-and-labor-trafficking" },
			{ label: "18 U.S.C. 1591 — sex trafficking of children", href: "https://www.law.cornell.edu/uscode/text/18/1591" },
			{ label: "18 U.S.C. 1589 — forced labor", href: "https://www.law.cornell.edu/uscode/text/18/1589" },
		],
		body: [
			{
				type: "p",
				text: "Defund ICE is all the proof any American needs that this party is unfit to hold power. Not a vibe. A tell. The Democratic Party ran the border from 2021 to 2025, lost hundreds of thousands of children inside a federal program, and now treats the only federal force that does the door-to-door as the villain. A Democrat who will not speak against abolishing ICE, against clearing the driveway, against keeping HSI off the sponsor's porch, is a Democrat who has chosen the traffic over the child. That compass does not get a chair in this country. Out of the office. Off the next ballot. By the voters, the party that still has a spine, and the statute. Not a riot. A refusal."
			},
			{
				type: "q",
				text: "To want the search defunded is to approve the room the child is still in."
			},
			{
				type: "p",
				text: "They use Epstein survivors as a costume. Epstein is a real file — play it, every name. Using those survivors as a caption while the same party obstructs the locating of open-border children is not solidarity. It is theft of the room. Labor trafficking is trafficking. Sex trafficking is trafficking. A sponsor who is a gang cutout is trafficking. The 7,300 reports in the ignored pile are not a subplot. They are the plot. A politician who screams about a billionaire's island and then votes, marches, or mayors-orders ICE out of the search has named which children count."
			},
			{
				type: "h",
				text: "Blocking the search"
			},
			{
				type: "p",
				text: "When a mayor forbids cooperation, when a campus rings a building, when a member of Congress calls ICE the villain and the cartel the weather, they are not protecting a child. They are protecting the adult who has the child. If the knock is stopped, the report dies in the drawer. This journal will not pretend a protest sign is a warrant. 18 U.S.C. 1591 and 1589 already exist. Harboring and obstruction already exist. Where the statute fits a person who hid a child or sold a lane, use it. Where the person held a gavel and voted to starve the search, remove the gavel. Call the first a crime because it is. Call the second a firing because the people still own the chair."
			},
			{
				type: "p",
				text: "Democrats refused Grassley's whistleblower roundtable. They opposed his bills to cut off contractors who enabled sexual harm and to overturn a Biden rule that made the pipeline easier. They voted no on citizenship checks and yes on the abolish-ICE pose that made the search illegal in their cities. Indifference is not a personality. It is the policy. The hypocrisy is the policy with a camera on. This movement is not a jersey. It is a demand that the world find a compass, find the children, and treat anyone who blocks that effort as having taken the sponsor's side. Find them. Then fire the people who said not to look."
			},
		],
	},
	{
		slug: "the-noise",
		title: "The noise.",
		dek: "Congress talks for a living. The country still does not get a budget. Words without a ledger are the job they invented to keep the job.",
		date: "2026-09-02",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/essay-the-noise.jpg",
		imageAlt: "Empty House chamber. A dead microphone. The noise.",
		featured: true,
		shareLead: true,
		shareTitle: "THE NOISE.",
		series: "Congress",
		part: 1,
		receipts: [
			{ label: "Gallup — 10% approve Congress, 86% disapprove, April 2026", href: "https://news.gallup.com/poll/708722/disapproval-congress-ties-record-high.aspx" },
			{ label: "GovTrack — 118th among the least productive modern Congresses", href: "https://www.govtrack.us/congress/bills/statistics" },
			{ label: "CRS — last on-time budget since FY1997", href: "https://crsreports.congress.gov/product/pdf/R/R42388" },
		],
		body: [
			{ type: "p", text: "They do not fail at talking. That is the only muscle they kept. Hearings that are not hearings. Floor speeches that never become a vote. A Sunday show that names a villain and never names a line in a statute. Gallup, April 2026: ten percent approve of Congress. Eighty-six percent disapprove. That is not a branding problem. That is a shop that stopped delivering the thing it was hired to deliver." },
			{ type: "q", text: "If it will not fit on a slide with a dollar sign, it is not a plan. It is noise." },
			{ type: "p", text: "The 118th Congress sat among the least productive modern sessions. The 119th still owes twelve money bills by October 1 — a deadline they have not met on time since the Clinton years. They will say the other jersey did it. Both jerseys took the oath. Both jerseys took the $7.258 billion. The country still does not get a budget it can read." },
			{ type: "p", text: "This series is the hearing they will not schedule. Next: they sold the split so neighbor would fight neighbor instead of reading the annex. Then: full time or go home. Then: the whole bill — every page, every reconciliation print, posted before the gavel, or they do not get to vote. The mic is not the job." },
		],
	},
	{
		slug: "they-sold-the-split",
		title: "They sold the split.",
		dek: "Politicians and the panel have no policy, so they sell a neighbor to hate. Division is the product. The statute never makes the caption.",
		date: "2026-09-02",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/essay-they-sold-the-split.jpg",
		imageAlt: "Television wall versus a kitchen table. They sold the split.",
		series: "Congress",
		part: 2,
		receipts: [
			{ label: "MRC — 92% negative coverage, first 100 days of the 2025 term", href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage" },
			{ label: "the Supreme Court's incitement test — incitement", href: "https://www.oyez.org/cases/1968/492" },
		],
		body: [
			{ type: "p", text: "A country with a real argument argues over a bill. A country being managed argues over a jersey. The panel discovered that a six-second clip outruns a thousand-page stack. MRC logged 92 percent negative coverage of the 2025 term in the first hundred days on the big three. That is not weather. That is a business model: keep the temperature up so nobody asks where the money is." },
			{ type: "p", text: "Politicians learned the same trick because they have no policy that survives a spreadsheet. Medicare for all without a pay-for. A border they called compassion and ran as a cartel lane. A tax cut they will not score honestly either. When the arithmetic is ugly, they hand the country a villain who lives on the next street. The neighbor is cheaper than the ledger." },
			{ type: "q", text: "Stop selling the split. Debate the statute. The jersey is not the job." },
			{ type: "p", text: "This journal will not answer division with a street. The Supreme Court already draws the line on incitement. The rest of the poison is still speech — and still a firing offense for an employee who took an oath to the country, not to a network. Vow it on camera with the slides. Then go to work. " },
		],
	},
	{
		slug: "full-time-or-go-home",
		title: "Full time or go home.",
		dek: "The legislative branch will spend $7.258 billion this year for a floor that sits fewer days than a school year. They should work the hours or resign.",
		date: "2026-09-02",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/essay-full-time.jpg",
		imageAlt: "Capitol at dusk. Full time or go home.",
		series: "Congress",
		part: 3,
		receipts: [
			{ label: "FY2026 legislative branch — $7.258 billion — CRS / P.L. 119-37", href: "https://www.congress.gov/crs-product/R48612" },
			{ label: "Member pay — CRS RL30064", href: "https://www.congress.gov/crs-product/RL30064" },
			{ label: "Oath of office — 5 U.S.C. § 3331", href: "https://www.law.cornell.edu/uscode/text/5/3331" },
		],
		body: [
			{ type: "p", text: "The country pays the legislative branch $7.258 billion this year. Public Law 119-37. The House takes $2.083 billion. The Senate $1.467 billion. Capitol Police nearly $882 million. The Library, the Architect, GAO, CBO, the publishing office — the rest of the campus that never goes home. A member’s $174,500 is the decoy. The machine is the bill. The floor still sits fewer days than a school year." },
			{ type: "p", text: "No other job in this country pays that, plus a pension after five years, plus health coverage, plus a million-dollar office allowance, and then treats call time with donors as the real session. They lecture the country about essential workers from a chamber that keeps banker’s hours. Faithfully discharge the duties of the office is the oath they recited. 5 U.S.C. § 3331. Part-time is not faithful." },
			{ type: "q", text: "In session means in the building. Work the hours or resign." },
			{ type: "p", text: "House and Senate rules can require it on day one. A majority writes those rules. Article I, Section 5 already lets a chamber punish and expel. The ballot does the rest. This is not a street. It is an employee policy for people who already took the money. Full time or go home. " },
		],
	},
	{
		slug: "the-whole-bill",
		title: "The whole bill.",
		dek: "A budget the country can read. Every reconciliation print. The stack, not the clip. How the stack is forced.",
		date: "2026-09-02",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/essay-show-the-slides.jpg",
		imageAlt: "Empty studio. A screen that says Show the slides.",
		series: "Congress",
		part: 4,
		receipts: [
			{ label: "How a bill becomes law — Congress.gov", href: "https://www.congress.gov/help/learn-about-the-legislative-process" },
			{ label: "Congressional Budget Act of 1974 — CRS", href: "https://crsreports.congress.gov/product/pdf/R/R42388" },
			{ label: "CBO — how it scores legislation", href: "https://www.cbo.gov/about/products" },
			{ label: "Article I — the purse, the rules, punish and expel", href: "https://constitution.congress.gov/constitution/article-1/" },
			{ label: "Urban Institute — single-payer extra federal cost ~$34T / 10 years", href: "https://www.urban.org/urban-wire/dont-confuse-changes-federal-health-spending-national-health-spending" },
		],
		body: [
			{ type: "p", text: "They show a paragraph. They vote on a thousand pages. That is the whole cheat. A reconciliation bill is not a vibe. It is a stack that changes what the Treasury may pay. A budget is not a speech. It is twelve money bills the 1974 Budget Act already required by October 1 — a clock they have not beaten on time since FY1997. The American people cannot ‘approve’ a file they are not given." },
			{ type: "h", text: "What the people are owed" },
			{ type: "ul", items: [
				"The full text of every spending bill and every reconciliation bill, searchable, 72 hours before any vote.",
				"The CBO score and the Joint Committee on Taxation tables attached to that post — before the gavel, not after.",
				"No giant unread bill. No continuing resolution as the plan. No managers’ amendment after midnight.",
				"Same night, prime time, GOP / Democrats / DSA: a deck. Medicare for all names the money — Urban Institute already put extra federal cost near $32–34 trillion over ten years. If the number is different, show the arithmetic. GOP names, line by line, how it will not block the agenda the country voted. Anyone who will not show the slides agrees, on camera, to go home.",
			] },
			{ type: "h", text: "How it is forced" },
			{ type: "p", text: "There is no nationwide yes/no on a federal budget in this Constitution. Article I already gave the purse to Congress. The people’s approval is the election and the rules of the House. There is no new ministry of truth. The tools that already exist score the people who refuse them." },
			{ type: "ul", items: [
				"January 3, new Congress: a majority rewrites House rules. Ban waiving the 72-hour layover. Ban a money-bill vote without a posted CBO score. One subject per bill. That is a rules package, not a dream.",
				"Statute they already wrote: Congressional Budget Act of 1974. Twelve bills by October 1. Treat a miss as a firing offense in the next primary, not a weather report.",
				"Discharge petition if leadership sits on the print. Article I, Section 5: punish, censure, expel with two-thirds.",
				"The Whole File Pledge on this scorecard. Candidates sign it in public. We print who would not. November 3 is the approval.",
				"A constitutional amendment is required only for a national referendum on the budget itself. Until then, approval is removing the employee who hid the stack.",
			] },
			{ type: "q", text: "Post the stack. Show the slides. Full time or resign. That is the hearing." },
			{ type: "p", text: "This is not a street. It is not a new speech crime. It is the job they swore: well and faithfully discharge the duties of the office. They have been discharging a narrative. The country is 300 million people, not a panel." },
		],
	},
	{
		slug: "it-does-not-fit",
		title: "It does not fit.",
		dek: "Medicare for All is not a slogan. It is $32–34 trillion in extra federal spending in ten years — more than a full year of everything America produces — on a Treasury that already cannot close a $1.9 trillion hole.",
		date: "2026-09-04",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/essay-it-does-not-fit.jpg",
		imageAlt: "Empty budget room. A slide that reads $34T. It does not fit.",
		featured: true,
		series: "Congress",
		part: 5,
		receipts: [
			{ label: "CBO — FY2026: receipts $5.6T, outlays $7.4T, deficit $1.9T", href: "https://www.cbo.gov/publication/62207" },
			{ label: "CBO Outlook 2026–2036 — debt to 120% of GDP; interest $1.0T → $2.1T", href: "https://www.cbo.gov/publication/62050" },
			{ label: "Urban Institute — extra federal cost of single-payer ~$32–34T / 10 years", href: "https://www.urban.org/urban-wire/dont-confuse-changes-federal-health-spending-national-health-spending" },
			{ label: "Blahous / Mercatus — extra federal at least $32.6T / 10 years", href: "https://www.mercatus.org/economic-insights/expert-commentary/medicare-all-explaining-math" },
			{ label: "CRFB — $25–35T extra federal; $30T midpoint pay-fors", href: "https://www.crfb.org/papers/choices-financing-medicare-all" },
			{ label: "Bipartisan Policy Center — gross debt near $40T, August 2026", href: "https://bipartisanpolicy.org/report/deficit-tracker/" },
		],
		body: [
			{ type: "p", text: "They say the word and wait for the applause. Medicare for all. As if a chant were a score. Congress has never scored the bill. Think tanks have. The left-of-center Urban Institute already did the arithmetic they will not put on a slide: taking private insurance off the table and writing every hospital check from Washington adds about $32 trillion to $34 trillion in extra federal spending over ten years. Charles Blahous at Mercatus, using Sanders’s own bill, put the floor at $32.6 trillion even if every promised ‘saving’ comes true. The Committee for a Responsible Federal Budget put the range at $25 trillion to $35 trillion. Those are studies. Congress never sent a scored Medicare-for-all bill to the President. That is the record." },
			{ type: "q", text: "A plan that needs a second America to pay for it is not a plan. It is a demolition order with a smile." },
			{ type: "h", text: "What the country actually has" },
			{ type: "p", text: "CBO, March 2026. Fiscal year 2026: the Treasury takes in $5.6 trillion. It spends $7.4 trillion. The hole is $1.9 trillion — 5.8 percent of GDP — in a year they project unemployment under 5 percent. Debt held by the public is already 101 percent of GDP and heads to 120 percent by 2036. Net interest is $1.0 trillion this year and $2.1 trillion in 2036. Bipartisan Policy Center, August 2026: gross federal debt is in sight of $40 trillion. Medicare, the program they want to clone onto every American, already spent about $1.2 trillion in 2025 covering the old. That is the machine before they hand it the whole country." },
			{ type: "h", text: "The number, in English" },
			{ type: "ul", items: [
				"$34 trillion extra federal / 10 years is $3.4 trillion every year — on top of the $7.4 trillion they already cannot pay.",
				"$34 trillion is six years of every tax dollar CBO says the Treasury will collect in 2026 ($5.6T × 6 = $33.6T).",
				"$34 trillion is more than one full year of U.S. GDP (~$32 trillion). They are proposing to put a second entire economy through the IRS.",
				"The low Urban figure alone is in the neighborhood of the entire gross federal debt. They want to add a debt’s worth of new federal outlays in a decade while the first debt is still compounding.",
			] },
			{ type: "p", text: "The talking point is always the same: ‘we already spend it in premiums.’ Urban already netted the private dollars. The $32–34 trillion is the extra load on the federal books after that move. Households do not get a holiday. They get a tax. Employers do not get a holiday. They get a payroll line Washington writes. The hospital does not get a holiday. It gets a government price and a waiting list. The ‘savings’ are a transfer of pain, not a free lunch." },
			{ type: "h", text: "How they would have to take it" },
			{ type: "p", text: "CRFB asked the only adult question: if the midpoint is $30 trillion extra federal in ten years, what does the pay-for look like. One of these, or a stack of them:" },
			{ type: "ul", items: [
				"A 32 percent payroll tax — on top of Social Security and Medicare FICA already paid.",
				"A 25 percent income surtax.",
				"A 42 percent value-added tax, European-style, on what is bought.",
				"$7,500 per person, per year, as a mandatory public premium — a family of four writing a $30,000 check to Washington before a doctor is seen.",
				"Double every federal income-tax rate. All of them. Not ‘the rich.’ The whole table.",
				"Cut 80 percent of all non-health federal spending — Defense, veterans, borders, courts, interest. They will not. So they borrow.",
				"Or add 105 percent of GDP to the debt on top of the 101 percent already there. That is not a country. That is a junk credit with a flag.",
			] },
			{ type: "p", text: "CRFB was explicit: taxes on high earners and corporations alone cannot finance it. The slogan that ‘billionaires will pay’ is a caption. The bill lands on payrolls, prices, and the bond market. Anyone who will not pick a row from that list and put a dollar sign on a slide is not offering health care. They are offering insolvency and calling it compassion." },
			{ type: "h", text: "How it destroys the country" },
			{ type: "p", text: "Not with a speech. With arithmetic that is already in motion. Interest is the tell. CBO has net interest doubling in a decade under current law — before Medicare for All. Add $3 trillion-plus a year in new federal outlays and the Treasury is not ‘covering health care.’ It is bidding against every mortgage, every factory, every payroll in the market for dollars. Crowded capital is not a theory. It is how a reserve currency becomes a warning label. Hospitals that cannot hire because the reimbursement is a political number. Drugs that do not get made because the price is a press conference. A generation that inherits a 120-percent-of-GDP debt plus a new entitlement that cannot be unwound without a riot in the caption. That is destruction. Slow, official, and on letterhead." },
			{ type: "p", text: "Democrats who run on this without a CBO score, a Joint Committee on Taxation table, and a named pay-for are not confused. They are counting on the annex never being read. DSA puts it on the same poster as reparations and a jobs guarantee. Cato stacked that program at $71 trillion to $212 trillion in ten years. There are only ten years in the window. That is not a platform. That is a confession that the private economy is the target." },
			{ type: "q", text: "Show the slides. Name the tax. If it will not fit on a slide with a dollar sign, it is not a plan. It is a wrecking ball." },
			{ type: "p", text: "The Hearing’s demand does not change. Prime time. GOP, Democrats, DSA. Medicare for all names the money — Urban’s $32–34 trillion extra federal, or another number with the table attached, with the table attached. Anyone who will not, agrees on camera to go home. The country is 300 million people. It is not a slush fund for a slogan." },
		],
	},
	{
		slug: "the-check-they-will-not-write",
		title: "The check they will not write.",
		dek: "Reparations returns every election because it is a loyalty test that never has to clear a bank. The advocates’ own number is $10–16 trillion. The Treasury does not have it. The Constitution does not permit a race-line from the IRS.",
		date: "2026-09-04",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/essay-the-check.jpg",
		imageAlt: "A blank Treasury check. The check they will not write.",
		featured: true,
		series: "Congress",
		part: 6,
		receipts: [
			{ label: "Darity / Brookings — $10–12 trillion to close the wealth gap (2020)", href: "https://www.brookings.edu/articles/black-reparations-and-the-racial-wealth-gap/" },
			{ label: "CNBC — Darity: $800,000 per eligible household; HR 40 as the vehicle", href: "https://www.cnbc.com/2020/08/12/slavery-reparations-cost-us-government-10-to-12-trillion.html" },
			{ label: "Forbes, Juneteenth 2026 — Darity: $16 trillion is the floor", href: "https://www.forbes.com/sites/ali-jackson-jolley/2026/06/20/forbesblk-newsletter-this-juneteenth-economist-darity-says-freedom-has-a-16-trillion-price-tag/" },
			{ label: "Cato — DSA reparations line $13.5–28T on the $71–212T stack", href: "https://www.cato.org/blog/who-will-pay-democratic-socialisms-200-trillion-cost" },
			{ label: "H.R. 40, 119th Congress — study commission, 96 cosponsors, no score", href: "https://en.wikipedia.org/wiki/Commission_to_Study_and_Develop_Reparation_Proposals_for_African-Americans_Act" },
			{ label: "POLITICO — California task force: up to $1.2 million per person; Newsom would not write it", href: "https://www.politico.com/news/2023/05/10/slavery-reparations-california-newsom-00096211" },
			{ label: "AP — California budgeted $12 million for ‘reparations legislation,’ not payments", href: "https://apnews.com/article/california-reparations-budget-black-25a4e549c64fafde3f71f77c201b3030" },
			{ label: "CBO — FY2026 receipts $5.6T, deficit $1.9T", href: "https://www.cbo.gov/publication/62207" },
		],
		body: [
			{ type: "p", text: "It comes back every cycle for the same reason a bad check comes back: it never cleared. Reparations is the slogan shouted in a primary without putting a CBO score on a slide. H.R. 40 has been introduced since 1989. It does not pay anyone. It studies. John Conyers ran it for thirty years. Ayanna Pressley ran it again on January 3, 2025, with ninety-six cosponsors. In thirty-seven years the bill has never become a number the Treasury has to print. That is not a failure of the activists. That is the design. A commission is a halo. A check is a tax." },
			{ type: "q", text: "If they meant the money, they would have named the taxpayer. They named a feeling." },
			{ type: "h", text: "Why it always returns" },
			{ type: "p", text: "Because it is cheap as politics and impossible as math. In a Democratic primary it is a loyalty test: say the word or be called a denier of history. In a general election it is quietly dropped, because the country is not 13 percent of the electorate and does not write blank checks by race. Washington State Democrats put ‘implementation’ into a platform in June 2026 — after Juneteenth, on a weekend, in a room of delegates. That is the calendar. Not budget week. Not the Budget Committee. The weekend the cameras want a moral. California proved the rest. Gavin Newsom signed a task force, took the applause, and when the economists put $1.2 million per person on the table he would not write it. The 2024 budget set aside $12 million for ‘reparations legislation.’ Twelve million is a press release. It is not a program. The pattern is the product: commission, headline, no check." },
			{ type: "p", text: "A study cannot be opposed without the charge of opposing history. That is why they prefer H.R. 40 to a scored bill. A study has no Joint Committee on Taxation table. A study cannot be defeated on arithmetic. A study can be reintroduced forever." },
			{ type: "h", text: "The advocates’ own numbers" },
			{ type: "p", text: "William Darity is the economist they cite when they want a scholar instead of a chant. Brookings, 2020: $10 to $12 trillion in federal expenditures to close the Black–White wealth gap — about $800,000 per eligible household. By 2022 the same framework, on later Survey of Consumer Finances data, was being quoted near $14 trillion. Juneteenth 2026: Darity told Forbes the floor is $16 trillion — roughly $400,000 per person times about 40 million Black Americans descended from U.S. slavery. He said do not expect a comprehensive plan this decade. Translate that: the people who want the check know the bank is closed." },
			{ type: "ul", items: [
				"$16 trillion is almost three years of every federal tax dollar CBO says the Treasury will collect in 2026 ($5.6T).",
				"$16 trillion is half of one year of U.S. GDP (~$32T).",
				"Stack it on Urban’s Medicare for All extra-federal $32–34T and the stack is north of $48 trillion in one decade against $56 trillion of ten years of current receipts — before interest, before a jobs guarantee, before the DSA housing line.",
				"Cato’s read of the DSA platform puts reparations itself at $13.5 trillion to $28 trillion. High end is five years of the entire IRS.",
				"California’s unofficial working number hit about $800 billion for one state that never had chattel slavery in its statehood. Newsom still would not sign a payment bill.",
			] },
			{ type: "p", text: "An honest comparison exists, and they do not use it. The Civil Liberties Act of 1988 paid about $20,000 to living Japanese Americans who had been interned — a documented class, a finite roll, a bill of roughly $1.6 billion. That is how a republic pays a specific wrong to living people. A wealth-gap formula billed to people who were not born, drawn on people who did not own slaves, administered by race, is not that. It is a new spoils system with a museum caption." },
			{ type: "h", text: "Why it cannot be done" },
			{ type: "p", text: "The 14th Amendment equal-protection clause is not a vibe. A Treasury payment whose only ticket is race is the fact pattern already in court in Evanston, Illinois — a $25,000 housing program the Justice Department moved to halt in 2026 as unconstitutional. History can be taught. The IRS cannot be run as a racial trust without shredding the amendment that ended slavery as law. The living cannot be taxed for the dead by skin color in a country whose Constitution forbids titles of nobility and bills of attainder for a reason: punishment and reward do not travel in the blood." },
			{ type: "p", text: "Even if a court pretended otherwise, the money is not there. CBO: $5.6 trillion in, $7.4 trillion out, $1.9 trillion hole, debt in sight of $40 trillion. Confiscating the net worth of the 400 richest Americans — about $6.6 trillion in 2025, per Cato — does not cover Darity’s floor. It does not cover Cato’s low DSA reparations line. The check, if written, lands on payrolls, prices, and the bond market. That is every other Democrat slogan in this series. Billionaires are the caption. The middle is the account." },
			{ type: "q", text: "A wrong in 1865 is not paid by bankrupting 2026. History is a record. It is not a blank on the Treasury." },
			{ type: "p", text: "This journal will not deny slavery, Jim Crow, or redlining. The record is the record. The 13th, 14th, and 15th Amendments were the legal end of the slave power. The Civil Rights Act and the Voting Rights Act were the legal end of Jim Crow. A country can teach that without lighting a race line under the income tax. What it cannot do is add a $16 trillion racial outlay on top of a $34 trillion health outlay and call the sum justice. That is how the currency is destroyed, the courts, and the idea that the law is the same for the man in the next pew." },
			{ type: "p", text: "The Hearing’s demand is the same as it was for Medicare for All. Prime time. Name the pay-for. Name the eligible class without a racial test that dies in court. No pay-for, no slogan. The check was never on the table." },
		],
	},
	{
		slug: "a-barcode-is-not-a-lock",
		title: "A barcode is not a lock.",
		dek: "The same USPS they called sabotaged in August they called the courier of the most secure election in history in November. The extra security they now advertise is a sorting sticker. Make it make sense.",
		date: "2026-09-04",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/essay-barcode.jpg",
		imageAlt: "A mail ballot on a USPS box. A barcode is not a lock.",
		featured: true,
		series: "Congress",
		part: 1,
		receipts: [
			{ label: "CISA — Nov. 12, 2020: ‘the most secure in American history’", href: "https://www.securitymagazine.com/articles/93927-cisa-says-theres-no-evidence-of-election-fraud-2020-election-was-the-most-secure-in-american-history" },
			{ label: "Krebs / 60 Minutes — paper backups, not the mail truck", href: "https://rollcall.com/2020/11/30/trumps-former-cybersecurity-chief-calls-vote-fraud-claims-nonsense/" },
			{ label: "AP — NY AG James: USPS actions ‘made a mockery of the right to vote’", href: "https://apnews.com/article/elections-lawsuits-presidential-election-2020-postal-service-8cdda72ddd4e7e04c4dfe3b6a4380508" },
			{ label: "Washington Post — 150,000 ballots processed after Election Day 2020", href: "https://www.washingtonpost.com/business/2020/11/05/usps-late-ballots-election/" },
			{ label: "USPS — Intelligent Mail barcode is a routing/tracking identifier", href: "https://postalpro.usps.com/" },
			{ label: "USPS final rule Aug. 2026 — unique IMb + portal; return ballots not verified the same way", href: "https://www.biometricupdate.com/202608/usps-finalizes-mail-in-voter-ballot-rule-that-would-give-law-enforcement-voter-linked-data" },
			{ label: "POLITICO — Sept. 4, 2026: NC mail ballots going out; Democrats call the USPS rule illegal", href: "https://www.politico.com/news/2026/09/04/trump-mail-ballots-order-november-elections-01065234" },
		],
		body: [
			{ type: "p", text: "Write the two sentences on the same chalkboard. August 2020: Democrats told the country Louis DeJoy was dismantling the Postal Service so a ballot would die in a bin. Letitia James said the changes ‘made a mockery of the right to vote.’ They sued. They held hearings. They said the trucks were slow, the machines were gone, the overtime was cut, the election was in danger because the mail could not be trusted. November 12, 2020: CISA, the same federal security shop, declared the contest ‘the most secure in American history.’ Those two captions cannot both be adult. Either the post office was a crime scene or it was a vault. They used both, three months apart, on the same ballots." },
			{ type: "q", text: "A barcode tells a machine where a letter has been. It does not tell a republic who marked the oval." },
			{ type: "h", text: "What they actually certified" },
			{ type: "p", text: "Read Krebs on 60 Minutes, not the caption. The sentence about ‘most secure’ was about voting systems: paper backups so a hacked tally can be checked. Ninety-five percent of 2020 ballots had a paper record. That is a claim about machines. The panel translated it into a claim about the mail. Those are different rooms. A scanner in a county warehouse is not a letter that sat in a kitchen, a porch box, a carrier bag, a plant, and a regional facility with nobody watching the flap. CISA did not audit the kitchen. It issued a press release about the tabulator." },
			{ type: "p", text: "The Washington Post, November 5, 2020: the Postal Service processed about 150,000 ballots after Election Day. USPS later said 99.89 percent of ballots reached election officials within seven days. Both can be in the record. Neither is a chain of custody with a name on it. A percentage is not a witness." },
			{ type: "h", text: "What a barcode is" },
			{ type: "p", text: "The Intelligent Mail barcode — IMb — is sixty-five bars the Postal Service prints so a sorter knows which bin. It is the same family of mark that rides on a catalog and a utility bill. BallotTrax and the county software can ping when the envelope is scanned. That is tracking. Tracking is not identity. The envelope is supposed to carry a signature. Signatures are matched by a clerk under rules that vary by state, by county, by how tired the clerk is at 9 p.m. The barcode does not watch the kitchen table. It does not watch who filled the oval. It does not watch who licked the flap. It watches a piece of paper go through a camera in a plant." },
			{ type: "p", text: "August 2026: USPS finalized a rule that would enroll each mail voter in a federal portal with name, address, and two unique barcodes — outbound and return. Return ballots, the rule itself says, do not get the same acceptance check as the outbound stack. Democrats called it illegal, chaotic, too close to the midterms. North Carolina started mailing today anyway. The switch is the tell. In 2020 the barcode-and-mail pipeline was so sacred it made history. In 2026 the same pipeline, with more barcode, is a plot. The envelope did not change. The jersey on the White House did." },
			{ type: "h", text: "The hypocrisy, in English" },
			{ type: "ul", items: [
				"If USPS was too broken to deliver a ballot in August 2020, it was not the courier of the most secure election in November.",
				"If USPS was a fortress in November, the August sabotage story was a campaign.",
				"If a barcode is ‘added security,’ say what it secures. It secures the sort. It does not secure the voter.",
				"If Democrats now say USPS has no business touching a ballot except to carry it, they have conceded the 2020 caption: the post office was a truck, not a poll worker with an oath.",
			] },
			{ type: "p", text: "This journal will not invent a dumpster of ballots to win a paragraph. The tape is the tape. People voted by mail for decades before 2020 — mostly absentee, mostly with an excuse, mostly in numbers the plants could swallow. 2020 made the exception the system and then forbade asking how a letter becomes a vote. The honest design is in-person, with identification, or absentee with a reason and a chain a court can read. A sorting sticker on a pandemic envelope is not that. It is a caption that says ‘trust us’ in machine-readable ink." },
			{ type: "q", text: "A barcode tells a machine where a letter has been. It does not tell a republic who marked the oval." },
			{ type: "p", text: "The summer they said the mail was dying, and the November they said it had never been safer, are the same record." },
		],
	},
	{
		slug: "the-pool",
		title: "The pool",
		dek: "Friday they barred CNN, MS NOW, and Politico from the White House. The caption they sold is why the building is tired of the caption.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/essay-eagle.jpg",
		imageAlt: "Eagle over the Capitol",
		series: "The Tape",
		part: 1,
		receipts: [
			{ label: "CNN — pool assignment pulled, Sept. 20, 2026", href: "https://www.cnn.com/2026/09/20/media/cnn-trump-white-house-pool-ban" },
			{ label: "PBS / AP — badges deactivated, Sept. 19", href: "https://www.pbs.org/newshour/politics/ms-now-cnn-and-politico-say-their-journalists-were-denied-access-to-the-white-house-after-trump-ban" },
			{ label: "CNN v. Trump, 2018 — Acosta credentials", href: "https://www.courtlistener.com/docket/16116680/cable-news-network-inc-v-trump/" },
			{ label: "First Amendment", href: "https://constitution.congress.gov/constitution/amendment-1/" },
			{ label: "Manufactured outrage", href: "/dispatch/the-media-ledger" },
		],
		body: [
			{
				type: "p",
				text: "Friday, September 18, 2026, the Oval said CNN, MS NOW, and Politico were barred from the White House, effective immediately. Saturday morning the badges failed. Secret Service took them. Monday the television pool rotation — ABC, CBS, CNN, NBC, Fox, a decades-old share of one camera — dropped CNN from the Monday assignment. That is the event. The outlets named it a First Amendment test. The building named it fake news.",
			},
			{
				type: "p",
				text: "A credential is not a throne. [CNN v. Trump, 2018](https://www.courtlistener.com/docket/16116680/cable-news-network-inc-v-trump/) already said a White House pass is not a toy: process, not a tantrum. The [First Amendment](https://constitution.congress.gov/constitution/amendment-1/) still sits on the desk. A lawsuit is coming. Courts will say whether a pool seat is a right or a privilege the employee at 1600 can pull.",
			},
			{
				type: "p",
				text: "The other ledger is the tape. A six-second caption is how they steal an argument. “Mostly peaceful” with a precinct on fire. “Bloodbath” stripped of auto plants. “Fine people” stripped of the condemnation of Nazis in the same answer. [The media ledger](/dispatch/the-media-ledger) is that file. A press corps that sells the clip, then demands the pool as a birthright, is asking the country to fund the caption.",
			},
			{
				type: "q",
				text: "A pool seat is not a verdict, and a caption is not the recording. The tape still cuts in both directions.",
			},
			{
				type: "p",
				text: "This journal does not need a badge to play C-SPAN. The standard does not move because the door moved. If the clip was a lie, the clip is still a lie with a better seat. If the Oval overreached on a pass, the court will say so. Both can be true. Neither is a reason to stop the file.",
			},
		],
	},
	{
		slug: "sixty-percent",
		title: "The Iranian terrorist regime at 60 percent",
		dek: "IAEA: 440.9 kg of uranium enriched up to 60%. The only non-weapon state at that level. Forty-seven years of building the option. The named dead are on the record.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/chart-iran.jpg",
		imageAlt: "The Iranian terrorist regime at 60 percent enrichment, 1979–2026",
		series: "The Tape",
		part: 1,
		receipts: [
			{ label: "IAEA GOV/2026/50 — 440.9 kg up to 60%, as of 13 June 2025", href: "https://www.iaea.org/sites/default/files/gov2026-50.pdf" },
			{ label: "IAEA GOV/2026/8 — only NPT non-weapon state at 60%; inspectors locked out", href: "https://www.iaea.org/sites/default/files/gov2026-8.pdf" },
			{ label: "Grossi, 3 March 2025 — only non-weapon state enriching to 60%", href: "https://www.iaea.org/newscenter/statements/iaea-director-general-grossis-introductory-statement-to-the-board-of-governors-3-march-2025" },
			{ label: "IAEA — Iran file", href: "https://www.iaea.org/topics/iran" },
			{ label: "State Department — state sponsors of terrorism (Iran, 19 Jan 1984)", href: "https://www.state.gov/state-sponsors-of-terrorism/" },
			{ label: "Country Reports on Terrorism 2024 — Iran, leading state sponsor", href: "https://www.state.gov/reports/country-reports-on-terrorism-2024" },
			{ label: "White House, 2 March 2026 — the regime’s decades against Americans", href: "https://www.whitehouse.gov/articles/2026/03/the-iranian-regimes-decades-of-terrorism-against-american-citizens/" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-iran.jpg",
				alt: "The Iranian terrorist regime at 60 percent. Forty-seven years on the option.",
			},
			{
				type: "p",
				text: "Name the government. The **Iranian terrorist regime** — the Islamic Republic, on the State Department’s list of state sponsors of terrorism since [19 January 1984](https://www.state.gov/state-sponsors-of-terrorism/) — is the only non-nuclear-weapon state on earth enriching uranium to 60 percent. [IAEA GOV/2026/50](https://www.iaea.org/sites/default/files/gov2026-50.pdf), using Iran’s declarations and inspections through 12 June 2025, counted **440.9 kilograms** of uranium enriched **up to 60 percent U-235** as of 13 June 2025. A civilian reactor burns about 3 to 5 percent. The 2015 deal capped the regime at 3.67 percent. Weapons-grade is about 90 percent. The climb from 5 to 60 is the long one. The climb from 60 to 90 is the short one. There is no commercial grid that runs on 60 percent.",
			},
			{
				type: "p",
				text: "Director General Grossi, [3 March 2025](https://www.iaea.org/newscenter/statements/iaea-director-general-grossis-introductory-statement-to-the-board-of-governors-3-march-2025): Iran is the only non-nuclear-weapon state enriching to that level. [GOV/2026/8](https://www.iaea.org/sites/default/files/gov2026-8.pdf) said the same, and added that the Agency has not had access to verify the previously declared highly enriched uranium for months. After the June 2025 strikes the inspectors have not seen the material. That is a different sentence from the 440.9 kilograms. The 440.9 kilograms is the last verified count, on the page, before the door closed. Denying the 60 percent is denying the inspection that already happened.",
			},
			{
				type: "p",
				text: "House Democrats are posting the other sentence and leaving the number out. Hakeem Jeffries called it a reckless war of choice. On [March 4, 2026](https://www.congress.gov/119/crec/2026/03/04/172/41/CREC-2026-03-04-house.pdf), members said war of choice on the House floor. Chuck Schumer posted “100 days of Trump’s illegal war.” Ro Khanna called it immoral, illegal, and unstrategic. Whether Congress authorized the force is a real question under Article I. It is not a finding that the uranium was not there. The slogan works by omission. That half-truth is posted for power.",
			},
			{
				type: "p",
				text: "Forty-seven years is 1979 to 2026. The Islamic Republic inherited a civilian nuclear start and built a concealed one. Natanz was revealed in 2002. The Security Council began resolutions in 2006. Twenty percent enrichment arrived in 2010. The 2015 deal pulled the cap to 3.67 percent. The United States left the deal in 2018. Sixty percent production began in 2021. The IAEA has not confirmed a finished bomb. It has confirmed the option: a stock of highly enriched uranium no other non-weapon state holds, at a site the inspectors can no longer enter. That is the file. It is not a mood.",
			},
			{
				type: "img",
				src: "/images/chart-iran-dead.jpg",
				alt: "Named deaths by the Iranian terrorist regime and its proxies",
			},
			{
				type: "p",
				text: "The same regime has killed on its own letterhead and through proxies. There is no honest single worldwide body count, because a proxy war does not come with a receipt for every name. The named files are enough. Hezbollah’s truck bomb at the Beirut barracks, 23 October 1983: **241** U.S. Marines, sailors, and soldiers. The AMIA Jewish community center in Buenos Aires, 1994: **85** dead; Argentine courts and the United States attributed the attack to Hezbollah acting with Iran. Khobar Towers, 1996: **19** U.S. airmen. In Iraq, 2003–11, the Pentagon’s assessed number for U.S. personnel killed by Iran-backed militants is **603** — explosively formed penetrators and the rest of the IRGC toolkit; State’s deputy spokesman put that on the record in April 2019. On 7 October 2023 Hamas murdered about **1,200** people in Israel. The [2024 Country Reports on Terrorism](https://www.state.gov/reports/country-reports-on-terrorism-2024) said Iran’s long-standing money, training, and weapons enabled the attack; the Office of the Director of National Intelligence said Iranian leaders did not have foreknowledge. Both sentences stay. The [White House, 2 March 2026](https://www.whitehouse.gov/articles/2026/03/the-iranian-regimes-decades-of-terrorism-against-american-citizens/), counted **46** Americans among the Oct. 7 dead. Tower 22 in Jordan, January 2024: an Iran-backed militia killed **three** U.S. soldiers.",
			},
			{
				type: "p",
				text: "State’s 2024 terrorism report called Iran the leading state sponsor: Hezbollah, Hamas, the Houthis, and the Iran-aligned militias in Iraq and Syria, funded and armed by the Islamic Revolutionary Guard Corps–Qods Force. That is the network. The 60 percent stock is the option the network has been building for forty-seven years. A power plant does not need it. A bomb is one short step from it. The inspectors cannot see it now. The last number they were allowed to write down is still on the page.",
			},
			{
				type: "q",
				text: "The Iranian terrorist regime is at 60 percent. The IAEA counted it. The last step is the short one.",
			},
		],
	},
	{
		slug: "they-dont-debate-they-flag",
		title: "They don't debate. They flag.",
		dek: "When they cannot beat the tape, they smear the person holding it.",
		date: "2026-08-26",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/essay-eagle.jpg",
		imageAlt: "Angry eagle over the Capitol in the swamp",
		series: "The Tape",
		part: 3,
		body: [
			{
				type: "p",
				text: "This journal exists to play the tape. Today the tape is the platform. A man did not answer a claim. He walked the replies, fourteen times, and tagged this site with a child-sex smear — the kind of label designed to make advertisers, hosts, and ordinary readers run without reading a sentence."
			},
			{
				type: "p",
				text: "That accusation is false. There is no such content here. There never was. The Dispatch is a political journal: statutes, C-SPAN, the uncut record. We do not publish the thing he named. He named it anyway, on a loop, under a paying account, after a political argument."
			},
			{
				type: "q",
				text: "When they cannot beat the tape, they smear the person holding it."
			},
			{
				type: "p",
				text: "Reports were filed. The posts were still there. Support did not answer a customer who pays to be on the platform. That is the second story. The first is the smear. The second is a company that will not pull a sex-crime lie used as a political club. Fourteen copies is not a misunderstanding. It is a method: flood, flag, wait for the robot, wait for the human who never comes."
			},
			{
				type: "h",
				text: "What this has to do with the founding"
			},
			{
				type: "p",
				text: "A republic only works if people can argue in the open. The [First Amendment](https://constitution.congress.gov/constitution/amendment-1/) is not a vibe. It is the rule that speech answers speech — not a poison tag hoped a trust-and-safety queue will treat as gospel. Television already taught half the country that a six-second caption is a verdict. This is the same move on a reply thread: skip the Constitution, skip the clip, skip the statute. Attach the worst word in the language to a citizen and go to bed."
			},
			{
				type: "p",
				text: "Politicians talk for an hour and say nothing. This is the opposite: one word, fourteen times, meant to end the talking. Division is not an accident when the incentive is to make the other side untouchable. Hate is the shortcut around proof."
			},
			{
				type: "h",
				text: "What we will not do"
			},
			{
				type: "p",
				text: "We will not print his handle as a trophy. We will not return a smear. We will not beg a timeline that already rewarded him with our attention. Screenshots go in a folder. Reports stay filed. The work stays the work: the republic, the tape, the table. If X wants a paying customer to believe the product is a public square, it can take a sex-crime lie off a political journal in less than fourteen tries. Until then, this is the lead. Not because the word is ours. Because the method is the country we are trying to save — a country where proof is optional and a flag is enough."
			},
			{
				type: "q",
				text: "They work for us. The networks do not. The queue does not. The tape is the record anyway.",
			}
		]
	},
	{
		slug: "division-is-the-product",
		title: "How did we get here",
		dek: "Honest people kept the country standing while a political class learned to treat them as a tap. This is the story of that bargain, and of the man who broke it.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 7,
		image: "/images/essay-eagle.jpg",
		imageAlt: "Angry eagle over the Capitol in the swamp",
		featured: true,
		series: "The Tape",
		part: 2,
		receipts: [
			{
				label: "92% negative TV — MRC",
				href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage"
			},
			{
				label: "Media trust 28% — Gallup",
				href: "https://news.gallup.com/poll/695762/trust-media-new-low.aspx"
			},
			{
				label: "Butler attempt — FBI",
				href: "https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump"
			},
			{
				label: "Feeds pump anger — Science",
				href: "https://www.science.org/doi/10.1126/science.adu5584"
			},
			{
				label: "Arendt — The Origins of Totalitarianism",
				href: "https://archive.org/details/originsoftotalit0000aren"
			}
		],
	body: [
			{
				type: "p",
				text: "For a long time the arrangement felt ordinary. People went to work. People paid what was said to be owed. People assumed the people with titles were doing something that corresponded to the titles. The country still opened in the morning: trucks, clinics, classrooms, harvests. That is not a small thing. A nation is a set of habits more than it is a set of speeches, and the habits were being kept by people who did not live inside the political club."
			},
			{
				type: "p",
				text: "What changed, slowly enough that a busy person could miss it, is who the political club thought those people were. Bureaucrats and career politicians stopped seeing a principal and started seeing a tap. Money came in. Rules went out. When the rules failed, the explanation was always that the public had not been patient enough, or educated enough, or kind enough. The people who wrote the rules graded their own ethics, exempted themselves from the statutes they passed, and sat for interviews about how dangerous it was that anyone had noticed."
			},
			{
				type: "p",
				text: "Part of the trick was never teaching how the machine actually runs. Most Americans can name a party. Far fewer can say how a bill becomes a statute, who writes the regulation after the vote, or where the money is authorized versus spent. That ignorance is not a personality flaw. It was convenient. A six-second clip is easier than Article I. A caption is easier than a rider. For every law they advertised as best for the nation, there was often a quiet twin — a giant unread bill, a notwithstanding clause, an agency rewrite — that took back what the camera had just celebrated. The name of the bill made the news. The catch lived in the annex."
			},
			{
				type: "p",
				text: "When people did get angry, the response was not a debate. It was a label. This journal learned that the cheap way. We published a file. A stranger walked the replies, fourteen times, and hung a child-sex smear on the work. There is no such content here. There never was. Reports were filed through the platform's own tools. The posts stayed. Support did not answer a paying customer. A conspiracy is not required. A queue that never comes is enough, and a country too tired to check. The argument moves from what is on the recording to whether the person holding the recording deserves to be heard."
			},
			{
				type: "p",
				text: "That is the climate a former donor walked into. Donald Trump is not a saint, and this page will not pretend he is. Ugly lines that are on tape stay on this site: fight like hell; stand back and stand by; when the looting starts, the shooting starts. The political club loved him when he wrote the checks. They turned when he stopped being a donor and started closing the problems they lived on — then spent taxpayer money on hoax after hoax to bury him. He never wore the uniform. Then [July 13, 2024, in Butler, Pennsylvania](https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump), when a rifle tried to end the argument and he got up. Another attempt on a golf course. A family that still walks through threats. He is a man who put his body where the club would not put theirs, and then went back to the jobs they had called impossible: a border that actually closed, employees who discovered they could be fired, deals the consultants said were theater.",
			},
			{
				type: "p",
				text: "None of that required liking his manners. It required noticing that the people attacking him were not offering a better statute. They were offering a feeling. ABC, CBS, and NBC ran evaluative coverage of his 2025 term that the Media Research Center counted as 92 percent negative in the first hundred days https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage A conservative scorekeeper can be discounted. Then watch a week of those broadcasts. Gallup, in the same season, found trust in mass media at 28 percent, a record low https://news.gallup.com/poll/695762/trust-media-new-low.aspx Independent researchers showed that ranking a feed by likes and shares pumps anger at the other side https://www.science.org/doi/10.1126/science.adu5584 This is not a basement plot. It is a business. Outrage is cheap to make and expensive to unwind. A law takes twenty minutes to read. A clip takes six seconds. The person on a clock loses to the person on a cut."
			},
			{
				type: "p",
				text: "Who they are, if the word is going to mean anything: news desks that need a villain every night; elected employees who cannot pass a bill so they pass a monster; platforms paid when the feed stays mad; consultants who write the caption; flag accounts that will not watch the tape. If a name cannot be tied to a paycheck, a vote, or a share button, park it. Fog is how the real they hide. A foreign government that wants a loud, split America does not have to invent the split. It only has to boost it."
			},
			{
				type: "p",
				text: "Hannah Arendt saw the method before the present caption. In The Origins of Totalitarianism she wrote that the ideal subject is not the convinced partisan — it is the person for whom the distinction between fact and fiction, true and false, no longer exists. Love of Congress is not required. Inability to read a statute is. In Eichmann in Jerusalem she named the other half: evil as thoughtlessness, a career, a man who was only doing his job. The neighbor in the other jersey is not that. The functionary who files the unread pile is. Power, she argued, is people acting in concert. Isolation is how a republic is lost. The record is how concert comes back."
			},
			{
				type: "p",
				text: "Swamp Force exists because that arrangement is no longer tolerable, and because complaining on a feed is not the same as teaching. The statute, the table, and the tape stay here, including the parts that cut against the man we think is standing in the gap. The country still does not run without the people who clock in. The political club knows it. The work of this journal is to put the record in public — and to stand with the work he is actually doing while they try to bury him under a caption. The next pages are slower on purpose.",
			}
		]
	},
	{
		slug: "the-record-not-the-rally",
		title: "How to watch a president",
		dek: "Pause the clip. Name the job. Read down the names.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The House chamber — where the political class writes the mess",
		series: "The Tape",
		part: 7,
		receipts: [{
			label: "Border — Pew",
			href: "https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/"
		}, {
			label: "Laken Riley law",
			href: "https://www.congress.gov/bill/119th-congress/senate-bill/5"
		}],
		eras: [
			{
				topic: "The border",
				rows: [
					{
						who: "Clinton",
						years: "1993–2001",
						line: "A law on paper. Still about 1.6 million crossings a year."
					},
					{
						who: "Bush",
						years: "2001–2009",
						line: "More agents. A fence bill. The hole stayed."
					},
					{
						who: "Obama",
						years: "2009–2017",
						line: "Let families go. DACA by memo. The surge started."
					},
					{
						who: "Trump I",
						years: "2017–2021",
						line: "Remain in Mexico. The numbers fell."
					},
					{
						who: "Biden",
						years: "2021–2025",
						line: "Over 2 million a year. They were released into the country."
					},
					{
						who: "Now",
						years: "2025–",
						line: "Lowest crossings in 50 years. Laken Riley law. Catch-and-release stopped."
					}
				]
			},
			{
				topic: "The wars",
				rows: [
					{
						who: "Clinton",
						years: "1993–2001",
						line: "Bombed. Did not occupy. Did not finish."
					},
					{
						who: "Bush",
						years: "2001–2009",
						line: "Two wars. Iraq on a claim that was not true."
					},
					{
						who: "Obama",
						years: "2009–2017",
						line: "Killed bin Laden. Libya. ISIS grew in the hole."
					},
					{
						who: "Trump I",
						years: "2017–2021",
						line: "No new war. Killed Soleimani. Four Arab peace deals."
					},
					{
						who: "Biden",
						years: "2021–2025",
						line: "Kabul fell. Thirteen Americans dead at the airport."
					},
					{
						who: "Now",
						years: "2025–",
						line: "Maduro is in a New York jail. No new American war."
					}
				]
			},
			{
				topic: "The factories",
				rows: [
					{
						who: "Clinton",
						years: "1993–2001",
						line: "Opened the door to China. The plants started leaving."
					},
					{
						who: "Bush",
						years: "2001–2009",
						line: "China into the WTO. The hollowing sped up."
					},
					{
						who: "Obama",
						years: "2009–2017",
						line: "Talked green. The shale boom was private, not him."
					},
					{
						who: "Trump I",
						years: "2017–2021",
						line: "Taxed China. New Mexico-Canada deal. America sold energy."
					},
					{
						who: "Biden",
						years: "2021–2025",
						line: "Kept most of those China taxes. Paused gas exports."
					},
					{
						who: "Now",
						years: "2025–",
						line: "America first country to ship 100 million tons of LNG. Car climate rule torn up."
					}
				]
			}
		],
		body: [
			{
				type: "p",
				text: "The country was given a clip instead of a class. A network needs anger in six seconds. A teacher needs the sentence finished. This journal is the second thing."
			},
			{
				type: "p",
				text: "Here is the whole method. When a caption names a president, ask one question: what did he do on this one job? Not his personality. The job. The border is a job. War is a job. Factories are a job. Politicians talk about jobs. Builders close them or they don’t."
			},
			{
				type: "q",
				text: "Pause the clip. Name the job. Read down the names."
			},
			{
				type: "h",
				text: "We will do the border together"
			},
			{
				type: "p",
				text: "Clinton wrote a tough immigration law and still saw about 1.6 million crossings a year. Bush hired more agents and passed a fence bill. The hole stayed. Obama let families go and wrote DACA without Congress. Trump’s first term put people in Mexico to wait; numbers fell. Biden’s years: more than two million a year, and many were released into the country. This term: the lowest crossings in fifty years, and a new law that keeps criminal illegal immigrants locked up."
			},
			{
				type: "p",
				text: "That was a class. A party was not required. Six names and one job were. The boxes below are two more jobs — war, and the factories — written the same way. Last line first. That is today. Then read up. That is who opened the wound."
			},
			{
				type: "p",
				text: "If a friend only has six seconds, do not send them this whole page. Send them one sentence: Biden opened the border. This term shut it. Then send the link. That is teaching. A longer caption is still a caption."
			},
			{
				type: "p",
				text: "Check the border numbers here: https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/ The new detention law: https://www.congress.gov/bill/119th-congress/senate-bill/5"
			},
			{
				type: "q",
				text: "The official record is the argument. Election Day is when the country can fire the people it hired.",
			}
		]
	},
	{
		slug: "the-republic-not-the-caption",
		title: "The republic, not the caption",
		dek: "We the People, not a television panel and not a six-second clip.",
		date: "2026-08-26",
		category: "Dispatch",
		readMinutes: 2,
		image: "/images/constitution.jpg",
		imageAlt: "The written charter — not a caption",
		series: "The Republic",
		part: 3,
		receipts: [
			{ label: "The Constitution", href: "https://constitution.congress.gov/" },
			{ label: "Article I", href: "https://constitution.congress.gov/constitution/article-1/" },
			{ label: "Article II", href: "https://constitution.congress.gov/constitution/article-2/" },
			{ label: "Article III", href: "https://constitution.congress.gov/constitution/article-3/" },
		],
		body: [
			{
				type: "p",
				text: "The United States is a constitutional republic. The people are sovereign. The [Constitution](https://constitution.congress.gov/) is the operating manual. Congress, the President, and the courts are employees with listed powers in [Article I](https://constitution.congress.gov/constitution/article-1/), [Article II](https://constitution.congress.gov/constitution/article-2/), and [Article III](https://constitution.congress.gov/constitution/article-3/). They do not own the country. They work here."
			},
			{
				type: "q",
				text: "We the People, not a television panel and not a six-second clip.",
			},
			{
				type: "p",
				text: "A republic fails in two ordinary ways. Politicians talk for an hour and say nothing. Networks talk for six seconds and call it a verdict. If Article I is never seen, the argument is about a man. If the rest of the sentence is never seen, a country that is not on the tape is hated. A sentence not heard in full is not a fact."
			}
		]
	},
	{
		slug: "they-clipped-the-tape",
		title: "They clipped the tape",
		dek: "A cut sentence is how a country is taught a crime. Read the caption against the recording.",
		date: "2026-08-25",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chamber.jpg",
		imageAlt: "The House — where the record is supposed to live",
		series: "The Tape",
		part: 1,
	body: [
			{
				type: "p",
				text: "The chart is in one place, so it is not printed twice. [Manufactured outrage](/dispatch/the-media-ledger) holds the captions in three parts: a tape clipped short, his words changed, and an outright lie."
			},
			{
				type: "p",
				text: "A political argument in this country is now usually a fight about a sentence that has been removed from the paragraph it lived in. The method is stable enough to teach. A phrase is cut. A caption is written as if the phrase were the whole. The caption is repeated until it is the memory. Anyone who plays the rest of the recording is treated as a partisan, or worse. Liking Donald Trump is not required to see the pattern. Sitting still for the next sentence is."
			},
			{
				type: "p",
				text: "The one file is what ran, set next to what the recording still contains. The last lines stay, because a correction that runs in only one direction is not a correction.",
			},
			{
				type: "h",
				text: "What we will not wash"
			},
			{
				type: "p",
				text: "He said fight like hell on January 6. He said stand back and stand by to the Proud Boys. He tweeted when the looting starts, the shooting starts. Those are on tape. They sit next to the sentences that were buried. The country can survive an ugly sentence. It cannot survive a fake one.",
			},
			{
				type: "ul",
				items: [
					"[Vandalia rally — bloodbath, the auto plants](https://www.youtube.com/watch?v=f57dRZMS0PQ)",
					"[Hannity town hall — dictator on day one](https://www.youtube.com/watch?v=7lB3bfVg8Z8)",
					"[Charlottesville transcript — condemned totally](https://www.politico.com/story/2017/08/15/full-text-trump-comments-white-supremacists-alt-left-transcript-241662)",
					"[Schiff floor parody — C-SPAN](https://www.c-span.org/video/?c4820134/schiffs-parody)",
					"[January 6 speech — full text](https://www.npr.org/2021/02/10/966396848/read-trumps-jan-6-speech-a-key-part-of-impeachment-trial)",
					"[BBC splice versus the original](https://www.youtube.com/watch?v=TAV5-oun3uM)",
					"[Disinfectant briefing — White House archive](https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-vice-president-pence-members-coronavirus-task-force-press-briefing-31/)",
				],
			},
		]
	},
	{
		slug: "one-word",
		title: "One word",
		dek: "Twelve years of the same trick: change one word, teach the country the opposite crime, and put a president through hell for a caption that was never on the file.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 7,
		image: "/images/chart-one-word-ledger.jpg",
		imageAlt: "Twelve years of one-word swaps: the caption versus the file",
		series: "The Tape",
		part: 2,
		receipts: [
			{ label: "DOJ SDNY — Maduro charged, 26 March 2020", href: "https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current" },
			{ label: "State Department — Maduro captured, 3 January 2026", href: "https://www.state.gov/nicolas-maduro-moros" },
			{ label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
			{ label: "Horowitz IG — FISA", href: "https://oig.justice.gov/reports/2019/o1912.pdf" },
			{ label: "USAO-DC — January 6 charge tally", href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol" },
			{ label: "Trump v. Hawaii", href: "https://www.supremecourt.gov/opinions/17pdf/17-965_h315.pdf" },
			{ label: "Garland — school boards memo", href: "https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf" },
			{ label: "They clipped the tape", href: "/dispatch/they-clipped-the-tape" },
		],
		frames: [
			{
				tag: "Kidnapped",
				they: "The United States kidnapped the president of Venezuela.",
				tape: "SDNY indictment, 26 March 2020. Custody, 3 January 2026. Arraigned in Brooklyn.",
				href: "https://www.state.gov/nicolas-maduro-moros",
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
				tape: "A precinct burned. The word peaceful did the work the tape would not.",
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
				tape: "The chain-link facilities were photographed in 2014. The Flores settlement is 1997. The pictures were not a 2018 invention.",
			},
			{
				tag: "Domestic terrorists",
				they: "Parents at school boards are a domestic-terror problem.",
				tape: "NSBA asked the White House. Five days later the Attorney General ordered U.S. Attorneys and the FBI to coordinate.",
				href: "https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf",
			},
			{
				tag: "Russian disinfo",
				they: "The laptop is a Russian trick.",
				tape: "Fifty-one former intelligence officials signed a letter weeks before the 2020 vote. The House published the file.",
				href: "https://judiciary.house.gov/media/press-releases/new-judiciary-committee-website-highlights-activities-and-findings-select",
			},
			{
				tag: "Dictator",
				they: "He said he will be a dictator on day one.",
				tape: "Close the border. Drill. “After that, I’m not a dictator.”",
			},
			{
				tag: "Fine people",
				they: "He called neo-Nazis very fine people.",
				tape: "Same remarks: neo-Nazis and white nationalists “should be condemned totally.”",
			},
		],
		body: [
			{
				type: "img",
				src: "/images/chart-one-word-ledger.jpg",
				alt: "Twelve years of one-word swaps",
			},
			{
				type: "p",
				text: "Gaslighting is not a feeling. It is a method. A speaker replaces what happened with a word that cannot survive the file, then repeats the word until the file feels rude to mention. The listener is not argued with. The listener is trained to distrust the thing in front of their eyes. One word is enough. The rest of the sentence can stay true. The swapped word does all the work. For twelve years that method was used on a country and on a president. Maduro is the latest noun. It is not the first.",
			},
			{
				type: "img",
				src: "/images/chart-one-word.jpg",
				alt: "Kidnapped versus arrested",
			},
			{
				type: "p",
				text: "Kidnapped is the word that ran. Arrested is the file. [The Department of Justice](https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current) charged Nicolás Maduro Moros on **26 March 2020** in the Southern District of New York with narco-terrorism conspiracy under [21 U.S.C. § 960a](https://www.law.cornell.edu/uscode/text/21/960a). The indictment alleged an intent to flood the United States with cocaine. A warrant issued. For six years the defendant did not appear. [The State Department](https://www.state.gov/nicolas-maduro-moros): on **3 January 2026** he was placed in U.S. custody, taken to Brooklyn, and held to face those charges. He was arraigned. He pleaded not guilty. Kidnapping under [18 U.S.C. § 1201](https://www.law.cornell.edu/uscode/text/18/1201) is the unlawful seizure of a person. A named defendant walked into a courtroom is not a kidnapping victim. The swapped word made the United States the criminal and Maduro the victim. That is the entire trick.",
			},
			{
				type: "p",
				text: "The same trick ran for twelve years against the man the country hired, and against the people who hired him. **Collusion.** The [Durham report](https://www.justice.gov/storage/durhamreport.pdf) says the FBI opened a full investigation on raw, uncorroborated intelligence and did not have actual evidence of collusion in its holdings when the case began. Years of a Russia caption followed. The file did not. [Inspector General Horowitz](https://oig.justice.gov/reports/2019/o1912.pdf) found seventeen inaccuracies and omissions in the Carter Page FISA applications used to surveil a U.S. person tied to a presidential campaign. The caption was Russia. The applications were not scrupulously accurate.",
			},
			{
				type: "p",
				text: "**Muslim ban.** The instrument was Proclamation 9645. The Supreme Court upheld it in [Trump v. Hawaii](https://www.supremecourt.gov/opinions/17pdf/17-965_h315.pdf). Countries. Not a faith test. **Kids in cages.** The chain-link rooms were photographed in 2014. The Flores settlement is 1997. The pictures were not a 2018 invention. **Mostly peaceful.** A precinct burned. **Insurrection.** [USAO-DC](https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol): about 1,583 federally charged. Assault, trespass, civil disorder. About 18 under seditious conspiracy, [18 U.S.C. § 2384](https://www.law.cornell.edu/uscode/text/18/2384). Zero under the insurrection statute, [§ 2383](https://www.law.cornell.edu/uscode/text/18/2383). **Domestic terrorists.** Parents at school boards. The National School Boards Association asked the White House. Five days later the Attorney General [ordered](https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf) U.S. Attorneys and the FBI to coordinate. **Russian disinfo.** Fifty-one former intelligence officials signed a letter treating a laptop as a Russian trick weeks before the 2020 vote. The House published that file. [They clipped the tape](/dispatch/they-clipped-the-tape) on bloodbath, dictator, and fine people. Each time the swapped word taught a crime the recording did not contain.",
			},
			{
				type: "p",
				text: "Once the word sticks, process is the punishment. The House impeached twice. Then four criminal dockets ran at once against the same man. The public paid for the committee. Defense is not free. A presidency can be buried in process without a statute that matches the caption. Neighbors were taught that the people who hired him were a threat to the country. That is how a republic is divided without a shot: one word, repeated, until the person across the street is the enemy and the employee who ran the caption still has the gavel.",
			},
			{
				type: "q",
				text: "Twelve years. One method. Read the warrant. The caption is the gaslight.",
			},
		],
	},
	{
		slug: "the-hire-is-the-country",
		title: "Taxpayer-funded hoaxes",
		dek: "They used process as a weapon against an elected president and the people who hired him. Each caption had evidence. The official file later showed the evidence did not hold. Insurrection was never charged. The public paid the bill.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 8,
		image: "/images/chart-lawfare.jpg",
		imageAlt: "Lawfare against the hire: the caption, the evidence they used, the file that closed it",
		series: "The Tape",
		part: 3,
		receipts: [
			{ label: "July 25, 2019 call memorandum", href: "https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf" },
			{ label: "H.Res. 755 — first impeachment", href: "https://www.congress.gov/bill/116th-congress/house-resolution/755" },
			{ label: "H.Res. 24 — second impeachment", href: "https://www.congress.gov/bill/117th-congress/house-resolution/24" },
			{ label: "C-SPAN — January 6 speech", href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-rally-washington-dc" },
			{ label: "USAO-DC — January 6 tally", href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol" },
			{ label: "18 U.S.C. § 2383 — insurrection", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
			{ label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
			{ label: "H.Res. 630 — Congressional Record on Schiff’s collusion claims", href: "https://www.congress.gov/congressional-record/volume-165/issue-163/house-section/article/H8153-5" },
			{ label: "Horowitz IG — FISA", href: "https://oig.justice.gov/reports/2019/o1912.pdf" },
			{ label: "Barr remarks on the Mueller report", href: "https://www.justice.gov/archives/opa/speech/attorney-general-william-p-barr-delivers-remarks-release-report-investigation-russian" },
			{ label: "Article II — the president", href: "https://constitution.congress.gov/constitution/article-2/" },
		],
		lawfare: [
			{
				caption: "Russia collusion — Crossfire Hurricane",
				sold: "Sold as a finding: the campaign had coordinated with Moscow. “More than circumstantial” was said in the voice of a person who had seen the file. It ran for years as the fact of the presidency, not as an investigation.",
				evidence: "A full FBI investigation opened as if the campaign had coordinated with Moscow. Ranking members told the country there was more than circumstantial evidence. Networks ran that sentence for the entire first term.",
				source: "Crossfire Hurricane, July 2016. Steele dossier. FISA on Carter Page. Floor and camera claims that outran the file.",
				file: "Durham: neither law enforcement nor the Intelligence Community possessed any actual evidence of collusion in their holdings when Crossfire Hurricane opened. Mueller: the investigation did not establish a conspiracy. Horowitz: seventeen FISA inaccuracies and omissions. They ran it anyway. A neighbor was taught the other neighbor had hired a foreign asset. That is the split.",
				href: "https://www.justice.gov/storage/durhamreport.pdf",
				doc: "Durham report",
				docs: [
					{ label: "Horowitz IG — FISA", href: "https://oig.justice.gov/reports/2019/o1912.pdf" },
					{ label: "Mueller report, volume 1", href: "https://www.justice.gov/storage/report_volume1.pdf" },
					{ label: "Barr remarks on the Mueller report", href: "https://www.justice.gov/archives/opa/speech/attorney-general-william-p-barr-delivers-remarks-release-report-investigation-russian" },
					{ label: "H.Res. 630 — the collusion claim", href: "https://www.congress.gov/congressional-record/volume-165/issue-163/house-section/article/H8153-5" },
				],
			},
			{
				caption: "First impeachment — abuse of power",
				sold: "Sold as a finding: he committed a crime on the call. The article was reported as the fact. An impeachment article is a charge. It was not sold as a charge.",
				evidence: "A July 25, 2019 telephone call with Ukraine. The House said the President withheld aid to force an investigation of the Bidens. That call was treated as the crime.",
				source: "The White House released the unclassified call memorandum. H.Res. 755. Floor speeches that did not match the memo.",
				file: "The memo is public. The President asked about corruption involving the Bidens in a country receiving American aid. Looking into corruption in a foreign aid relationship is the job of the executive under Article II. The House called it an impeachable plot. The Senate acquitted on February 5, 2020. The country had already been split on a verdict the Senate did not return.",
				href: "https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf",
				doc: "July 25, 2019 call memorandum",
				docs: [
					{ label: "H.Res. 755 — first impeachment", href: "https://www.congress.gov/bill/116th-congress/house-resolution/755" },
				],
			},
			{
				caption: "Second impeachment — incitement of insurrection",
				sold: "Sold as a finding: he ordered an attack, and the day was an insurrection. The clip was the exhibit. The statute was not.",
				evidence: "A speech on January 6, 2021. Clips were run as if the President had ordered an attack on the Capitol. The House article named incitement of insurrection.",
				source: "H.Res. 24. Select-committee clips. Network packages built from minutes they kept.",
				file: "The C-SPAN recording of the speech includes the line to protest peacefully and patriotically. The U.S. Attorney for D.C. later published the tally: about 1,583 federally charged. Assault, trespass, civil disorder. About 18 charged with seditious conspiracy under 18 U.S.C. § 2384. Zero charged under 18 U.S.C. § 2383 — the insurrection statute. The Senate acquitted on February 13, 2021. Insurrection was sold as the fact. Insurrection was never the charge.",
				href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol",
				doc: "USAO-DC — January 6 tally",
				docs: [
					{ label: "H.Res. 24 — second impeachment", href: "https://www.congress.gov/bill/117th-congress/house-resolution/24" },
					{ label: "C-SPAN — January 6 speech", href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-rally-washington-dc" },
					{ label: "18 U.S.C. § 2383 — insurrection", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
				],
			},
			{
				caption: "Four criminal dockets at once",
				sold: "Sold as four findings at once, in an election year: documents, racketeering, election crime, and business-record felonies, each spoken as if the jury had already sat. A charge is not a verdict. It was not sold as a charge.",
				evidence: "New York. Florida. Georgia. The District of Columbia. Overlapping cases against the same hire while he stood for election again.",
				source: "State and federal prosecutors. A special counsel paid from appropriated funds. The public paid the committee. Defense is not free.",
				file: "Florida was dismissed as to him. Georgia was abandoned. The District of Columbia was dismissed without prejudice, which is not an acquittal. Manhattan is a records conviction, still on appeal, sentenced to no jail and no fine. The country was split on four verdicts. Three of the cases never reached one.",
				href: "https://www.courtlistener.com/docket/67656595/united-states-v-trump/",
				doc: "District of Columbia docket",
				docs: [
					{ label: "District of Columbia indictment", href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf" },
					{ label: "Order dismissing it — November 25, 2024", href: "https://www.courtlistener.com/docket/67656595/283/united-states-v-trump/" },
					{ label: "Florida — order dismissing the documents case", href: "https://www.courtlistener.com/docket/67490071/672/united-states-v-trump/" },
					{ label: "Manhattan indictment", href: "https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf" },
				],
			},
		],
		body: [
			{
				type: "p",
				text: "The people hire the president. Process used as punishment against that hire is process used against the vote. The cases are on the chart. Each row opens the record.",
			},
		],
	},
	{
		slug: "they-ran-it-anyway",
		title: "They ran it anyway",
		dek: "Crossfire Hurricane had no actual evidence of collusion when it opened. Politicians and networks ran it for the entire first term. That is how a president is poisoned and a nation is divided.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chart-they-ran-it.jpg",
		imageAlt: "Crossfire opened empty. Schiff ran more than circumstantial. Mueller did not establish. They kept running it.",
		series: "The Tape",
		part: 3,
		receipts: [
			{ label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
			{ label: "Barr remarks on the Mueller report", href: "https://www.justice.gov/archives/opa/speech/attorney-general-william-p-barr-delivers-remarks-release-report-investigation-russian" },
			{ label: "Horowitz IG — FISA", href: "https://oig.justice.gov/reports/2019/o1912.pdf" },
			{ label: "Congressional Record — H.Res. 630", href: "https://www.congress.gov/congressional-record/volume-165/issue-163/house-section/article/H8153-5" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-they-ran-it.jpg",
				alt: "Opened empty. Ran for years. Mueller closed the conspiracy. They ran it anyway.",
			},
			{
				type: "p",
				text: "The [Durham report](https://www.justice.gov/storage/durhamreport.pdf) is the file. Crossfire Hurricane opened as a full FBI investigation of a presidential campaign. Durham: neither U.S. law enforcement nor the Intelligence Community appears to have possessed any actual evidence of collusion in their holdings at the commencement of that investigation. Raw. Uncorroborated. A different standard than the one used when the other campaign was the subject. The Steele reporting was later used on a FISA targeting a U.S. person tied to the campaign. Durham: the investigators did not and could not corroborate the substantive allegations in that reporting. [Horowitz](https://oig.justice.gov/reports/2019/o1912.pdf): seventeen inaccuracies and omissions in those applications. That is what the government had. That is what the government did not have.",
			},
			{
				type: "p",
				text: "The country was told the opposite. On March 20, 2017 — months into the first term — the ranking Democrat on House Intelligence told the public the evidence of collusion was more than circumstantial. Networks put that sentence on a loop. Politicians who sat on the committee put it on the floor. The [Congressional Record](https://www.congress.gov/congressional-record/volume-165/issue-163/house-section/article/H8153-5), in H.Res. 630, later named those years: false accusations of collusion spread for more than two years; a March 2017 claim of more than circumstantial evidence. In April 2019 the Attorney General quoted Mueller: the investigation did not establish that members of the Trump Campaign conspired or coordinated with the Russian government. They ran it anyway. After the report. Through the first term. A hired president spent those years answering a caption the FBI did not have in the file when it opened the case. Neighbors were taught the people who hired him had hired a Kremlin asset. That is not journalism. That is not oversight. That is an information war run against an elected president and against the Americans who hired him. The ledger is [Taxpayer-funded hoaxes](/dispatch/the-hire-is-the-country).",
			},
			{
				type: "q",
				text: "The file was empty at the opening. They ran it for the whole first term. That is how a presidency is poisoned.",
			},
		],
	},
	{
		slug: "they-called-it-protest",
		title: "They called it protest",
		dek: "They hate the cleanup because it proves 2020 was not mostly peaceful. The monuments were vandalized. The murder rate was 6.6. The capital is being made a capital again.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chart-crime.jpg",
		imageAlt: "FBI murder rate by administration — 2020 spike, 2025 at 4.1",
		series: "The Tape",
		part: 4,
		receipts: [
			{ label: "Kamala Harris — Minnesota Freedom Fund, June 1, 2020", href: "https://x.com/KamalaHarris/status/1267555018128965643" },
			{ label: "EO 14252 — Making the District of Columbia Safe and Beautiful", href: "https://www.federalregister.gov/documents/2025/03/31/2025-05630/making-the-district-of-columbia-safe-and-beautiful" },
			{ label: "EO 14253 — Restoring Truth and Sanity to American History", href: "https://www.federalregister.gov/documents/2025/04/03/2025-05836/restoring-truth-and-sanity-to-american-history" },
			{ label: "EO 13933 — Protecting American Monuments (2020)", href: "https://www.federalregister.gov/documents/2020/06/30/2020-14231/protecting-american-monuments-memorials-and-statues-and-combating-recent-criminal-violence" },
			{ label: "FBI — 2025 crime statistics", href: "https://www.fbi.gov/news/press-releases/fbi-releases-2025-reported-crimes-in-the-nation-statistics" },
			{ label: "FBI — violent crime, historic drop", href: "https://www.fbi.gov/news/stories/violent-crime-falls-at-historic-rate-new-fbi-data-show" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-crime.jpg",
				alt: "FBI murder rate: 6.6 in 2020, 4.1 in 2025",
			},
			{
				type: "p",
				text: "They called it protest. The file is vandalism, encampments, and a murder spike. That is why the cleanup is hated. If 2020 was mostly peaceful, then restoring a statue is an insult. If 2020 was a crime wave with a caption, then [Executive Order 14252](https://www.federalregister.gov/documents/2025/03/31/2025-05630/making-the-district-of-columbia-safe-and-beautiful) is the capital doing its job: prevent crime, punish criminals, protect the monuments, take the graffiti off the marble, clear the encampments on National Park Service land. [EO 14253](https://www.federalregister.gov/documents/2025/04/03/2025-05836/restoring-truth-and-sanity-to-american-history) tells Interior to restore federal monuments that were damaged, defaced, or taken down. The 2020 order that first named that work, [EO 13933](https://www.federalregister.gov/documents/2020/06/30/2020-14231/protecting-american-monuments-memorials-and-statues-and-combating-recent-criminal-violence), was reinstated. A country that will not keep its own memorials will not keep its own law.",
			},
			{
				type: "p",
				text: "The [FBI](https://www.fbi.gov/news/press-releases/fbi-releases-2025-reported-crimes-in-the-nation-statistics) now puts the 2025 murder rate at **4.1** per 100,000 — tied with 1955 and 1956, the lowest since national estimates began. Murder down 18.1 percent. Violent crime down 9.3 percent, the largest year-to-year drop in that series. The 2020 bar on this chart is **6.6**, in a year they called peaceful while a precinct burned. The decline began before January 20, 2025. That sentence stays. So does this one: the Oval that spent 2020 explaining away the fire is not the Oval writing the order to restore the marble and enforce the capital.",
			},
			{
				type: "p",
				text: "The bail was the return ticket. On June 1, 2020, then-Senator Kamala Harris posted: “If you’re able to, chip in now to the @MNFreedomFund to help post bail for those protesting on the ground in Minnesota.” [The post is still up.](https://x.com/KamalaHarris/status/1267555018128965643) Sixteen days later she said they should not let up. Minneapolis had already seen a precinct burn. She did not say stop the arson. She pointed donors at a fund so the people in the street could return to the street. Maxine Waters: create a crowd. Ayanna Pressley: bring the fire. Nancy Pelosi: people will do what they do. The wording, the insured bill, and the clean hands are in [They keep their hands clean](/dispatch/clean-hands). This page is why they hate the cleanup. The caption was protest. The file was a crime wave with a bail fund on top.",
			},
			{
				type: "q",
				text: "They hate the cleanup because it proves the caption was the crime. The monuments were never the enemy.",
			},
		],
	},
	{
		slug: "they-work-for-us",
		title: "They work for us",
		dek: "Employees do not threaten the people who pay them.",
		date: "2026-08-24",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/capitol.jpg",
		imageAlt: "The Capitol at night — they work for us",
		series: "The Republic",
		part: 7,
		receipts: [
			{ label: "C-SPAN — maximum warfare", href: "https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623" },
			{ label: "C-SPAN — the full news conference", href: "https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945" },
			{ label: "Jeffries — the same line on YouTube", href: "https://www.youtube.com/watch?v=0IVD7gE7-kg" },
			{ label: "Jeffries on X", href: "https://x.com/hakeemjeffries/status/2046754383707148505" },
			{ label: "Fox News — break them", href: "https://www.foxnews.com/video/6396075535112" },
			{ label: "Schumer, March 4, 2020", href: "https://www.youtube.com/watch?v=yu-7L5W6Rew" },
			{ label: "Waters, June 2018", href: "https://www.youtube.com/watch?v=-1Fu3g1MGHY" },
			{ label: "Waters, April 2021", href: "https://www.youtube.com/watch?v=tnNBvN4ZXms" },
			{ label: "Harris, June 1, 2020", href: "https://x.com/KamalaHarris/status/1267555018128965643" },
			{ label: "Biden to Lester Holt", href: "https://www.nbcnews.com/video/biden-says-it-was-a-mistake-to-use-bullseye-in-remarks-about-trump-214895685978" },
		],
		body: [
			{
				type: "h",
				text: "Maximum warfare"
			},
			{
				type: "q",
				text: "We are in an era of maximum warfare, everywhere, all the time."
			},
			{
				type: "p",
				text: "April 22, 2026. House Minority Leader Hakeem Jeffries, at a news conference about Virginia maps. [C-SPAN, the sentence](https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623). [C-SPAN, the full conference](https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945)."
			},
			{
				type: "h",
				text: "Break them"
			},
			{
				type: "q",
				text: "Either MAGA extremists are going to break the country, or we’re going to break them, and our goal is to break them."
			},
			{
				type: "q",
				text: "We have to beat them electorally, and then we have to break their spirit, because of the extremism that’s being unleashed on the American people, that’s completely and totally unacceptable."
			},
			{
				type: "p",
				text: "May 19, 2026. A separate room. [Fox News has the speech](https://www.foxnews.com/video/6396075535112). He named an election in the second sentence. He still said the goal is to break them, then to break their spirit."
			},
			{
				type: "p",
				text: "Chuck Schumer, March 4, 2020, on the Supreme Court steps, to Justices Gorsuch and Kavanaugh: “You have released the whirlwind, and you will pay the price. You won’t know what hit you.” He later said he misspoke. [The tape](https://www.youtube.com/watch?v=yu-7L5W6Rew)."
			},
			{
				type: "p",
				text: "Maxine Waters, June 2018: “you get out and you create a crowd and you push back on them.” [The tape](https://www.youtube.com/watch?v=-1Fu3g1MGHY). April 2021: “We’ve got to get more confrontational.” [The tape](https://www.youtube.com/watch?v=tnNBvN4ZXms)."
			},
			{
				type: "p",
				text: "Kamala Harris, June 1, 2020: “chip in now to the @MNFreedomFund to help post bail for those protesting on the ground in Minnesota.” [The post](https://x.com/KamalaHarris/status/1267555018128965643)."
			},
			{
				type: "p",
				text: "Joe Biden, July 8, 2024, to donors, later on camera to Lester Holt: “time to put Trump in the bull’s-eye.” He later called the word a mistake. [NBC](https://www.nbcnews.com/video/biden-says-it-was-a-mistake-to-use-bullseye-in-remarks-about-trump-214895685978)."
			},
			{
				type: "q",
				text: "They work for us. They do not threaten us and expect us to pay them."
			}
		]
	},
	{
		slug: "they-hold-it-by-the-blade",
		title: "They hold it by the blade",
		dek: "They did not repeal the Constitution. They learned to use it as a weapon — the clause that shields them, never the duty that binds them.",
		date: "2026-08-30",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/constitution.jpg",
		imageAlt: "The written charter — not a caption",
		series: "The Republic",
		part: 4,
		receipts: [
			{
				label: "Article I — Speech or Debate, and the purse",
				href: "https://constitution.congress.gov/constitution/article-1/"
			},
			{
				label: "Hutchinson v. Proxmire",
				href: "https://www.oyez.org/cases/1978/78-680"
			},
			{
				label: "18 U.S.C. § 2383",
				href: "https://www.law.cornell.edu/uscode/text/18/2383"
			},
			{
				label: "Brandenburg v. Ohio",
				href: "https://supreme.justia.com/cases/federal/us/395/444/"
			},
			{
				label: "5 U.S.C. § 3331 — the oath",
				href: "https://www.law.cornell.edu/uscode/text/5/3331"
			}
		],
		body: [
			{
				type: "p",
				text: "They did not repeal Article I. They learned which clauses shield them, and they leave the duties on the table."
			},
			{
				type: "ul",
				items: [
					"[Speech or Debate, Article I, Section 6](https://constitution.congress.gov/constitution/article-1/), covers the floor. [Hutchinson v. Proxmire](https://www.oyez.org/cases/1978/78-680) said a press release is not the floor.",
					"The [First Amendment](https://constitution.congress.gov/constitution/amendment-1/) is the fence. [Brandenburg v. Ohio](https://supreme.justia.com/cases/federal/us/395/444/) is the line: imminent lawless action, and likely to produce it.",
					"Insurrection was the word. [18 U.S.C. § 2383](https://www.law.cornell.edu/uscode/text/18/2383) is the statute that was not filed.",
					"[Article I, Section 9](https://constitution.congress.gov/constitution/article-1/) says money is drawn only by law. The clause does not require them to read the law.",
					"The oath, [Article VI](https://constitution.congress.gov/constitution/article-6/) and [5 U.S.C. § 3331](https://www.law.cornell.edu/uscode/text/5/3331), is still recited. Twelve appropriations bills have not been passed on time since fiscal year 1997."
				]
			}
		]
	},
	{
		slug: "they-published-the-replacement",
		title: "They published the replacement",
		dek: "DSA’s 2026 program: a new constitution and a socialist republic. The criminal statutes require force. The charter is still the target.",
		date: "2026-08-24",
		category: "Constitution",
		readMinutes: 4,
		image: "/images/torn-charter.jpg",
		imageAlt: "Torn We the People over a faded flag",
		series: "The Republic",
		part: 6,
		receipts: [
			{ label: "18 U.S.C. § 2384", href: "https://www.law.cornell.edu/uscode/text/18/2384" },
			{ label: "18 U.S.C. § 2385", href: "https://www.law.cornell.edu/uscode/text/18/2385" },
			{ label: "DSA program — Workers Deserve More", href: "https://program.dsausa.org/" },
			{ label: "Article V", href: "https://constitution.congress.gov/constitution/article-5/" },
		],
		body: [
			{
				type: "p",
				text: "[18 U.S.C. § 2384](https://www.law.cornell.edu/uscode/text/18/2384), seditious conspiracy, is a felony when two or more people conspire to overthrow the United States by force, levy war against it, or by force hinder federal law. [18 U.S.C. § 2385](https://www.law.cornell.edu/uscode/text/18/2385), the Smith Act, reaches advocating overthrow by force or violence. Abstract politics is not the crime. Force is."
			},
			{
				type: "p",
				text: "In 2026 the Democratic Socialists of America published [Workers Deserve More](https://program.dsausa.org/). Their words: “draft a new constitution, and create a democratic socialist republic.” Abolish the Senate. Replace the President and the Supreme Court with an executive and judiciary chosen by and subordinate to Congress. Public ownership of the largest corporations and essential industries. Abolish ICE. Amnesty regardless of status. Complete victory, they write, requires “building a new society from the ground up.”"
			},
			{
				type: "p",
				text: "A prosecutor still has to prove an agreement to use force. The paper does not recite rifles. [Article V](https://constitution.congress.gov/constitution/article-5/) is how the Constitution is changed. A draft of a socialist republic is not Article V."
			}
		]
	},
	{
		slug: "the-recess-blockade",
		title: "The recess blockade",
		dek: "Pro forma gavels. Fake sessions. A president who cannot appoint. Article II, gutted on purpose.",
		date: "2026-08-23",
		category: "Constitution",
		readMinutes: 6,
		image: "/images/blog-peoples.jpg",
		imageAlt: "Eagle over a flooded Capitol",
		series: "Congress",
		part: 6,
		body: [
			{
				type: "p",
				text: "Clinton: 139 recess appointments. Bush: 171. Obama: 32 until the Court stripped the tactic. Trump first term: 0. Biden: 0 — the Senate was aligned. Trump now: 0, because someone still walks into an empty chamber every few days, bangs a gavel, and leaves."
			},
			{
				type: "p",
				text: "[NLRB v. Noel Canning (2014)](https://supreme.justia.com/cases/federal/us/573/12-1281/) said a valid recess lasts at least ten consecutive days, and the Senate decides when it is in session. Armed with that, a faction invented fake sessions — no business, one politician, a few seconds. Fiction with a gavel. It turns off [Article II, Section 2, Clause 3](https://constitution.congress.gov/constitution/article-2/) on purpose so a president the country just elected cannot staff the government."
			},
			{
				type: "p",
				text: "The Framers wrote the Recess Appointments Clause as a check against a Senate that would not act. Fake sessions are a check against the voters. That is the 2024 mandate dying in an empty room. Track the calendar. Count the days between gavels. The numbers are the argument."
			}
		]
	},
	{
		slug: "the-funnel",
		title: "The funnel",
		dek: "Taxpayer to agency to NGO. USAID. FEMA. The Endowment. There is no line item that says DNC. There is a pipe. Congress votes the water.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/chart-funnel.jpg",
		imageAlt: "The funnel: taxpayer to agency to NGO — USAID, FEMA, NED",
		series: "Congress",
		part: 4,
		receipts: [
			{ label: "ForeignAssistance.gov", href: "https://www.foreignassistance.gov/" },
			{ label: "USASpending — USAID", href: "https://www.usaspending.gov/agency/agency-for-international-development" },
			{ label: "USAID OIG", href: "https://oig.usaid.gov/" },
			{ label: "DHS OIG-26-04 — FEMA SSP $1.4 billion", href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf" },
			{ label: "FEC — public funding of presidential elections", href: "https://www.fec.gov/introduction-campaign-finance/understanding-ways-support-federal-candidates/presidential-elections/public-funding-presidential-elections/" },
			{ label: "2 CFR 200.450 — lobbying", href: "https://www.ecfr.gov/current/title-2/section-200.450" },
			{ label: "22 U.S.C. § 4411 — National Endowment for Democracy", href: "https://www.law.cornell.edu/uscode/text/22/4411" },
			{ label: "P.L. 118-47 — FY2024 SFOPS", href: "https://www.congress.gov/bill/118th-congress/house-bill/2882" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-funnel.jpg",
				alt: "Three pipes: USAID, FEMA NGOs, NED",
			},
			{
				type: "p",
				text: "The money does not leave the Treasury as a check to a party. It leaves as an appropriation. Congress votes it. An agency writes a grant. A nongovernmental organization cashes it. That is the funnel. [USASpending](https://www.usaspending.gov/agency/agency-for-international-development) is the ledger. [ForeignAssistance.gov](https://www.foreignassistance.gov/) is the map. In fiscal 2023 the United States disbursed about **$71.9 billion** in foreign aid. USAID moved about **$43.8 billion** of that — three of every five dollars. The implementers are contractors and NGOs. They are not the DNC and they are not the RNC. They are paid with the same taxes. The political work happens after the grant hits the letterhead.",
			},
			{
				type: "p",
				text: "[USAID’s Inspector General](https://oig.usaid.gov/) is the file on what happens inside the pipe. Cash assistance in the West Bank and Gaza: about **$36 million** in fiscal 2024 to four NGOs, with fraud risk USAID did not identify. Humanitarian awards in that theater: **$650 million**, eighteen awards, vetting that still left a diversion risk. The spring 2026 semiannual report: **$25.9 billion** audited, convictions, debarments, NGO officers sentenced for laundering grant money. That is not a panel. That is the auditor. At home the same shape: [DHS OIG-26-04](https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04/OIG-26-04-Apr26.pdf) — FEMA awarded nearly **$1.4 billion** in fiscal 2023–24 through the Emergency Food and Shelter Humanitarian program and the Shelter and Services Program to states, cities, and nonprofits. The Inspector General could not ensure the money was used as the law required. CBP transferred the pile. NGOs and local governments cashed it. [Who got paid](/dispatch/who-got-paid) is the border half of the same pipe.",
			},
			{
				type: "p",
				text: "Federal grant money is not supposed to buy a campaign. [2 CFR 200.450](https://www.ecfr.gov/current/title-2/section-200.450) forbids using the award to lobby. That is the rule. The ecosystem is the rest. [22 U.S.C. § 4411](https://www.law.cornell.edu/uscode/text/22/4411) created the National Endowment for Democracy. Congress funds it. Fiscal 2024 kept it at **$315 million**. The Endowment grants to institutes the parties already know: the National Democratic Institute and the International Republican Institute. That is taxpayer money into party-aligned shops. It is not a wire to a national committee. Say the difference. Keep the pipe. [The FEC](https://www.fec.gov/introduction-campaign-finance/understanding-ways-support-federal-candidates/presidential-elections/public-funding-presidential-elections/) still offers a **$3** checkoff on the 1040 for the Presidential Election Campaign Fund. That box is voluntary. It does not raise the tax. Public funding of nominating conventions ended in **2014**. Recent major-party nominees have not taken the general-election grant. Anyone who says “USAID funds the Democratic Party” is running a caption. Anyone who says the Treasury stops at the NGO door is running the other one. Congress votes the appropriation. The agency writes the grant. The NGO spends it. The parties live in the weather that money makes.",
			},
			{
				type: "q",
				text: "There is no line item that says DNC. There is a funnel. Congress opens it.",
			},
		],
	},
	{
		slug: "they-dont-write-the-bills",
		title: "They don’t write the bills",
		dek: "The lobbyist drafts. The activist supplies the caption. Congress votes the unread pile. America keeps the harm.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/chart-they-dont-write.jpg",
		imageAlt: "Lobby drafts. Congress votes. The country keeps the harm.",
		series: "Congress",
		part: 2,
		receipts: [
			{ label: "Article I, Section 1", href: "https://constitution.congress.gov/constitution/article-1/" },
			{ label: "2 U.S.C. § 1601 — Lobbying Disclosure Act findings", href: "https://www.law.cornell.edu/uscode/text/2/1601" },
			{ label: "Senate — LDA filings", href: "https://lda.senate.gov/system/public/" },
			{ label: "House — lobbying disclosure", href: "https://lobbyingdisclosure.house.gov/" },
			{ label: "P.L. 104-65 — Lobbying Disclosure Act of 1995", href: "https://www.congress.gov/104/plaws/publ65/PLAW-104publ65.pdf" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-they-dont-write.jpg",
				alt: "Three steps: lobby drafts, Congress votes, country keeps the harm",
			},
			{
				type: "p",
				text: "[Article I, Section 1](https://constitution.congress.gov/constitution/article-1/) vests all legislative powers herein granted in a Congress of the United States. That is the job they were hired to do: write the law. They do not. A paid lobbyist drafts the text. An activist writes the caption that makes the unread pile sound like a moral. The Member votes yes or no on a package nobody in the chamber has read, on the word of the people who wrote it and the people who will sell it on television. The country is then stuck with the harm. That is not petition. Petition is a citizen walking to the door. This is a second government that does not stand for election.",
			},
			{
				type: "p",
				text: "Congress already admitted the method. The [Lobbying Disclosure Act](https://www.law.cornell.edu/uscode/text/2/1601) — [P.L. 104-65](https://www.congress.gov/104/plaws/publ65/PLAW-104publ65.pdf) — opens with a finding: paid lobbyists influence federal officials in the conduct of government, and the public is entitled to know who they are. The [Senate](https://lda.senate.gov/system/public/) and the [House](https://lobbyingdisclosure.house.gov/) take the forms. A form is not a fence. It is a receipt for the second government. [Why the lobby should be illegal](/dispatch/why-the-lobby-should-be-illegal) is the argument. This page is the mechanism: draft, caption, vote, harm. The twelve appropriations bills that do not pass are how the unread pile is born. [The $7 billion machine](/dispatch/the-7-billion-machine) is what the hire costs while someone else writes the work. Both parties take the draft. Both parties take the vote. The people keep the statute.",
			},
			{
				type: "q",
				text: "They were hired to write the law. They vote the lobby’s draft. America is stuck with the harm.",
			},
		],
	},
	{
		slug: "paying-the-taliban",
		title: "Paying the Taliban",
		dek: "SIGAR: maybe 30 to 40 percent of donor funds reaches the population. A Senate that will not read the bill still votes the money. That is not leadership.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chart-paying-taliban.jpg",
		imageAlt: "SIGAR: U.S. aid after Kabul benefited the Taliban. Congress voted the unread pile.",
		series: "Congress",
		part: 3,
		receipts: [
			{ label: "SIGAR 24-22 — funds benefitting the Taliban", href: "https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-24-22-AR.pdf" },
			{ label: "SIGAR 25-16 — PIOs and diversion risk", href: "https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-25-16-AR.pdf" },
			{ label: "SIGAR 24-12 — UN cash shipments", href: "https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Inspection-Reports/SIGAR-24-12-IP.pdf" },
			{ label: "SIGAR — a broken aid system, August 2025", href: "https://www.govinfo.gov/content/pkg/GOVPUB-S-PURL-gpo248012/pdf/GOVPUB-S-PURL-gpo248012.pdf" },
			{ label: "Article I, Section 1", href: "https://constitution.congress.gov/constitution/article-1/" },
		],
		body: [
			{
				type: "img",
				src: "/images/chart-paying-taliban.jpg",
				alt: "Unread bill. Appropriation. Taliban tax.",
			},
			{
				type: "p",
				text: "Kabul fell in August 2021. The Senate kept voting money. The [Special Inspector General for Afghanistan Reconstruction](https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-24-22-AR.pdf) later put the result on paper. After the takeover the United States remained the largest donor. More than **$3.83 billion** in humanitarian and development assistance went into that country. [SIGAR 25-16](https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-25-16-AR.pdf): from August 2021 through September 2023, State and USAID funded 86 agreements with public international organizations, total project cost **$3.038 billion**. [SIGAR 24-12](https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Inspection-Reports/SIGAR-24-12-IP.pdf): the United Nations purchased and transported more than **$2.9 billion** in U.S. currency into Afghanistan to run the aid. SIGAR found those shipments stabilized an economy the Taliban ran — and benefited the Taliban.",
			},
			{
				type: "p",
				text: "[SIGAR 24-22](https://www.sigar.mil/Portals/147/Files/Reports/Audits-and-Inspections/Performance-Audits/SIGAR-24-22-AR.pdf), May 2024: thirty-eight implementing partners paid at least **$10.9 million** of U.S. taxpayer money to the Taliban-controlled government in taxes, utilities, fees, and customs. SIGAR said that figure is a fraction. The UN took about **$1.6 billion** in U.S. funding for Afghanistan in that window and did not report the taxes its subawardees paid. In August 2025 SIGAR called the delivery system [broken](https://www.govinfo.gov/content/pkg/GOVPUB-S-PURL-gpo248012/pdf/GOVPUB-S-PURL-gpo248012.pdf). An implementing partner estimated that after taxes, fees, bribery, and extortion, maybe **30 to 40 percent** of donor funds reaches the population. That is the humanitarian share SIGAR put on paper. The rest is the stair tax. The Taliban collect it. The caption was aid. The file is a tax on aid.",
			},
			{
				type: "p",
				text: "That money did not appear by weather. It appeared because Congress appropriated it. [Article I](https://constitution.congress.gov/constitution/article-1/) hired the Senate to write and read the law. A leader who will not read the bill still moves the pile. The lobby drafts. The activist captions it as humanitarian. The chamber votes a package nobody has read. Afghanistan is inside that package. The Taliban are on the other end of the pipe. [They don’t write the bills](/dispatch/they-dont-write-the-bills) is the method. This page is the destination. Calling that leadership is the caption. The file is a Senate that will not look at the statute it funds, while an inspector general counts the tax the enemy collected. That is corruption of the job they were hired to do.",
			},
			{
				type: "q",
				text: "A Senate that will not read the bill is not leading. It is paying. SIGAR named who collected.",
			},
		],
	},
	{
		slug: "fema-ran-two-jobs",
		title: "FEMA ran two jobs",
		dek: "North Carolina flood. Maui fire. Americans who paid the tax waited. The same agency awarded $1.4 billion for aliens.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chart-fema-two-jobs.jpg",
		imageAlt: "FEMA: Immediate Needs Funding for Americans. $1.4 billion for aliens. $425 million questioned.",
		series: "The Border",
		part: 0,
		receipts: [
			{ label: "FEMA — Immediate Needs Funding, Aug. 29, 2023", href: "https://content.govdelivery.com/attachments/USDHSFEMA/2023/08/29/file_attachments/2597953/FEMA%20Advisory%20FEMA%20Announces%20Implementation%20of%20Immediate%20Needs%20Funding%2020230829.pdf" },
			{ label: "CRS — Disaster Relief Fund, R47676", href: "https://www.congress.gov/crs-product/R47676" },
			{ label: "DHS OIG-26-04 — $425 million questioned", href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf" },
			{ label: "House Homeland — letter to Mayorkas, Oct. 11, 2024", href: "https://homeland.house.gov/wp-content/uploads/2024/10/2024-10-11-Green-et-al-to-Mayorkas-DHS-re-FEMA-Funding-Priorities.pdf" },
			{ label: "GAO-26-108154 — Helene survivors, the helpline", href: "https://www.gao.gov/products/gao-26-108154" },
			{ label: "GAO-25-106862 — Maui wildfire, FEMA assistance", href: "https://www.gao.gov/products/gao-25-106862" },
			{ label: "FEMA — Maui, one year later", href: "https://www.fema.gov/fact-sheet/one-year-later-maui-wildfire-recovery-continues-nearly-3-billion-federal-support" },
		],
		body: [
			{
				type: "p",
				text: "On August 29, 2023, [FEMA announced Immediate Needs Funding](https://content.govdelivery.com/attachments/USDHSFEMA/2023/08/29/file_attachments/2597953/FEMA%20Advisory%20FEMA%20Announces%20Implementation%20of%20Immediate%20Needs%20Funding%2020230829.pdf). The Disaster Relief Fund was “approaching exhaustion.” New Public Assistance that was not life-saving would pause. Hazard mitigation would pause. Americans waiting on long-term recovery after fire and hurricane would wait. [CRS](https://www.congress.gov/crs-product/R47676) later wrote that FEMA had to restrict obligations to preserve money for immediate response, and that the unobligated DRF balance that morning was **$3.4 billion**. That is the file on Americans.",
			},
			{
				type: "p",
				text: "The same agency ran a second job. [DHS OIG-26-04](https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf): Congress directed CBP to transfer **$1.45 billion** to FEMA for Shelter and Services — $800 million in fiscal 2023, $650 million in fiscal 2024. FEMA awarded nearly **$1.4 billion** in those two years for Emergency Food and Shelter-Humanitarian and SSP. Hotels. Clothing. Cell phone plans. The Inspector General could not ensure the money was used as the law required. FEMA did not review EFSP-H expenditures for allowable costs and eligible aliens — **$425 million in questioned costs**. Another **$16.5 million** questioned on SSP payment requests. The caption was humanitarian aid. The auditor could not show how much of that pile was humanitarian aid.",
			},
			{
				type: "p",
				text: "Western North Carolina, Hurricane Helene, late September 2024. The Secretary of Homeland Security told reporters FEMA did not have the funds to make it through the hurricane season. [House Homeland wrote him](https://homeland.house.gov/wp-content/uploads/2024/10/2024-10-11-Green-et-al-to-Mayorkas-DHS-re-FEMA-Funding-Priorities.pdf) on October 11: Americans in those mountains on one line, migrant shelter on the other. The Committee said it understood the Disaster Relief Fund and the Shelter and Services Program were not the same account. It asked why the Department requested large sums for the migrant grants while the disaster fund was short. [GAO](https://www.gao.gov/products/gao-26-108154) later: Helene survivors faced long wait times. Many could not reach a representative on the helpline. That is not a rumor. That is the auditor.",
			},
			{
				type: "p",
				text: "Maui, August 8, 2023. [GAO](https://www.gao.gov/products/gao-25-106862): more than 100 dead, nearly 10,000 displaced, more than 2,000 structures damaged or destroyed. FEMA’s own [one-year fact sheet](https://www.fema.gov/fact-sheet/one-year-later-maui-wildfire-recovery-continues-nearly-3-billion-federal-support): **$56.1 million** in Individual Assistance to **7,141 people**. Temporary housing was still being [extended into 2027](https://www.fema.gov/press-release/20260128/fema-extends-temporary-housing-assistance-maui-wildfire-survivors-february). The people who paid the tax waited in trailers and hotels. The same agency, those same two fiscal years, awarded nearly **$1.4 billion** for aliens — hotels, clothes, phones. The Inspector General still cannot certify $425 million of that pile.",
			},
			{
				type: "p",
				text: "Say the wire correctly. The Shelter and Services Program was not a check drawn on the Disaster Relief Fund. It was Customs and Border Protection money Congress moved to FEMA. The purse is still one purse. One cabinet. One season. North Carolina after the flood. Maui after the fire. Americans who paid the tax waited on a helpline. Aliens got hotels, clothes, and phones. The Inspector General still cannot certify $425 million of that pile. [What the taxpayer bought](/dispatch/what-the-taxpayer-bought) is the shopping list.",
			},
			{
				type: "q",
				text: "The flood and the fire waited. The migrant grant went out.",
			},
		],
	},
	{
		slug: "the-7-billion-machine",
		title: "The $7 billion machine",
		dek: "FY2026 legislative branch: $7.258 billion. Salary is the decoy. The perks are the bill.",
		date: "2026-08-22",
		category: "Dispatch",
		readMinutes: 7,
		series: "Congress",
		part: 1,
		image: "/images/capitol.jpg",
		imageAlt: "The Capitol — the $7 billion machine",
		receipts: [
			{
				label: "FY2026 legislative branch — $7.258 billion — CRS / P.L. 119-37",
				href: "https://www.congress.gov/crs-product/R48612"
			},
			{
				label: "Salaries and allowances — CRS RL30064",
				href: "https://www.congress.gov/crs-product/RL30064"
			},
			{
				label: "Members' Representational Allowance — CRS",
				href: "https://www.congress.gov/crs-product/R40962"
			},
			{
				label: "Treason — Art. III §3 / 18 U.S.C. § 2381",
				href: "https://www.law.cornell.edu/uscode/text/18/2381"
			},
			{
				label: "Oath of office — 5 U.S.C. § 3331",
				href: "https://www.law.cornell.edu/uscode/text/5/3331"
			},
			{
				label: "Article I §9 — appropriations by law",
				href: "https://constitution.congress.gov/constitution/article-1/"
			},
			{
				label: "27th Amendment — pay after an election",
				href: "https://constitution.congress.gov/constitution/amendment-27/"
			}
		],
		body: [
			{
				type: "p",
				text: "A member of Congress makes $174,500 a year. The Speaker makes $223,500. Majority and minority leaders make $193,400. CRS publishes the table https://www.congress.gov/crs-product/RL30064 That is not the bill the country is paying. That number is the decoy. The bill is $7.258 billion — Public Law 119-37, FY2026 — for a part-time floor sitting on a full-time payroll. https://www.congress.gov/crs-product/R48612"
			},
			{
				type: "h",
				text: "Where the $7.258 billion goes"
			},
			{
				type: "ul",
				items: [
					"House of Representatives: $2.083 billion. The Members' Representational Allowance alone ran about $1.85 million to $2.09 million per House office in 2025 — staff, travel, district rent. Eighteen full-time aides plus part-time is allowed. https://www.congress.gov/crs-product/R40962",
					"Senate: $1.467 billion. Office budgets scale with state population. The chamber that sits fewer days than a school year still draws a year-round payroll.",
					"U.S. Capitol Police: $852 million, plus $30 million in mutual-aid reimbursements in the same law.",
					"Library of Congress, including CRS: $852 million (CRS itself about $136 million). The research shop that writes the tables they hope go unread.",
					"Architect of the Capitol: $812 million. The buildings. The grounds. The campus that never goes home.",
					"Government Accountability Office: $812 million. The auditor of everyone except, in practice, the people who fund it.",
					"Government Publishing Office: $132 million. Congressional Budget Office: $75 million. Joint items: $25 million. A $522,000 line for widows and heirs of deceased members.",
					"On top of the salary: FEHB health coverage paid in part by taxpayers; a FERS pension that can start after five years and outlive the member; House and Senate gym and parking; an outside earned-income cap they wrote themselves ($33,285 in 2025)."
				]
			},
			{
				type: "h",
				text: "How it is used against the people who pay it"
			},
			{
				type: "ul",
				items: [
					"They write the second law never shown — riders, notwithstanding clauses, giant unread bills — then say the floor was too busy to read it.",
					"Call time is the real session. Donors get the hours. The statute gets the leftover. The country already paid $174,500 so they would not have to work the phones. They work the phones anyway.",
					"They set their own pay, their own pension, their own ethics office, then investigate themselves. The STOCK Act of 2012 was a press conference. The trades continued.",
					"District offices can sit quiet while the allowance still moves. The machine does not shrink when the member is in a hotel ballroom.",
					"When the people notice, the caption becomes the weapon. The $7.258 billion buys the building in which the caption is written."
				]
			},
			{
				type: "h",
				text: "Is it treason"
			},
			{
				type: "p",
				text: "No. Read the statute before anyone puts that word on a sign. Article III, Section 3: treason against the United States consists only in levying war against them, or in adhering to their enemies, giving them aid and comfort. [18 U.S.C. § 2381](https://www.law.cornell.edu/uscode/text/18/2381) is the same crime in the code. Conviction requires two witnesses to the same overt act, or a confession in open court. The Framers narrowed it on purpose so a faction could not hang a rival for a policy fight.",
			},
			{
				type: "p",
				text: "Self-dealing is not levying war. A part-time floor on a $7.258 billion payroll is not adhering to an enemy. A STOCK Act that does not bite is not aid and comfort. Calling it treason when the elements are not there is the same cheat they use when they say insurrection and file no § 2383 charge. This journal will not fake a capital crime to win an argument."
			},
			{
				type: "h",
				text: "The oath, and the Constitution"
			},
			{
				type: "p",
				text: "They did swear. Article VI binds every Senator and Representative by oath or affirmation to support this Constitution https://constitution.congress.gov/constitution/article-6/ The statute they recite is 5 U.S.C. § 3331: support and defend the Constitution against all enemies, foreign and domestic; bear true faith and allegiance; and well and faithfully discharge the duties of the office https://www.law.cornell.edu/uscode/text/5/3331 There is no separate felony titled 'oath violation.' The oath is the job description they put their hand on. 'Faithfully discharge the duties' is the line they are on."
			},
			{
				type: "p",
				text: "What the Constitution actually requires of the money: Article I, Section 9 — no money shall be drawn from the Treasury but in consequence of appropriations made by law https://constitution.congress.gov/constitution/article-1/ A continuing resolution and a giant unread bill are still appropriations made by law. Ugly is not the same as void. The 1974 Budget Act's twelve bills by October 1 is a statute, not a clause. They can break that statute for thirty years and still have 'passed a law.' That is the letter. The spirit of Article I is a legislature that debates spending in the open. They have not done that work. That is a failure of the duty they swore to discharge."
			},
			{
				type: "p",
				text: "The Framers already saw the perk problem. The 27th Amendment: no law varying the compensation of Senators and Representatives shall take effect until after an election of Representatives has intervened https://constitution.congress.gov/constitution/amendment-27/ They may still raise their own pay. They may not pocket it before the people get a vote. Self-dealing was the fear. Delay was the fence. They have learned to live inside the fence and still write their own pension, their own ethics office, and the twin law never shown."
			},
			{
				type: "p",
				text: "The constitutional remedies are the ones written down. Article I, Section 5: each House may punish its members and expel with two-thirds. The ballot. An amendment they do not get to grade. Not a street. Not a word reserved for war. What it is: employees who swore to faithfully discharge the duties, took $7.258 billion, and did not. That is how a government stops serving the people and starts serving the syndicate it has become."
			}
		]
	},
	{
		slug: "the-line-in-the-sand",
		title: "The line in the sand",
		dek: "The SAVE Act was the tell. Citizenship to vote. They killed it anyway.",
		date: "2026-08-21",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/blog-truth.jpg",
		imageAlt: "The Truth Rises Here",
		series: "Congress",
		part: 2,
		body: [
			{
				type: "p",
				text: "Swamp Force exists because a uniparty that will not require proof of citizenship to vote in a federal election is not confused. It is protecting a system. The Safeguard American Voter Eligibility Act — [H.R. 22](https://www.congress.gov/bill/119th-congress/house-bill/22), Senate companion [S. 128](https://www.congress.gov/bill/119th-congress/senate-bill/128) — is documentary proof of U.S. citizenship to register, and a purge of non-citizens from the rolls. It does not take the vote from a single citizen. Read the text on Congress.gov."
			},
			{
				type: "p",
				text: "They still killed it. [Pew, August 2025: 83%](https://www.pewresearch.org/politics/2025/08/13/views-of-the-2024-election-and-voting/) and [Gallup, October 2024: 84%](https://news.gallup.com/poll/651905/solid-majority-supports-voter-identification-laws.aspx) wanted voter ID. The machine did not. Until the rolls are secured, verified, and sealed, federal elections rest on a system that cannot be audited. That is the demand. Not a riot. A list, a statute, a roll."
			},
			{
				type: "p",
				text: "The split in this country is not Left vs. Right. It is the Syndicate vs. The public. 535 people do not outrank 300 million. They work here. They do not own it."
			}
		]
	},
	{
		slug: "the-uniparty-mirror",
		title: "The uniparty mirror",
		dek: "Cameras on: a fight. Cameras off: the same surveillance bill, the same blank check.",
		date: "2026-08-20",
		category: "Dispatch",
		readMinutes: 7,
		image: "/images/blog-house.jpg",
		imageAlt: "Citizens at the water, Get Out of Our House",
		series: "The Parties",
		part: 4,
		body: [
			{
				type: "p",
				text: "They need the country in a jersey. Red versus blue is how a cartel keeps the floor. Behind the cameras, the votes rhyme."
			},
			{
				type: "p",
				text: "Omnibus packages — thousand-page spending nobody debates as single bills — pass with enough members of both parties to keep the machine fed. Debt-ceiling increases have been a bipartisan ritual for a generation; the [Fiscal Responsibility Act of 2023](https://www.congress.gov/bill/118th-congress/house-bill/3746) was only the latest handshake. FISA Section 702, the warrantless-surveillance authority, was reauthorized April 20, 2024 as the [Reforming Intelligence and Securing America Act](https://www.congress.gov/bill/118th-congress/house-bill/7888). The Senate vote was 60–34. Both parties were in the 60. A warrant requirement for queries on Americans was rejected. The sunset is April 20, 2026 — they will try it again."
			},
			{
				type: "p",
				text: "That is not a sporting event. That is an insulated class protecting surveillance, debt, and lobbyist-written piles of law. When an outsider threatened the gravy train, the fake war got loud and the committees became weapons. A nation fighting itself never looks up to see who holds the whip. The roll calls are the whip. The whip is not a vibe.",
			}
		]
	},
	{
		slug: "how-the-house-was-captured",
		title: "How the House was captured",
		dek: "Not a movie syndicate. A paying club. Both parties kept the books.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/torn-charter.jpg",
		imageAlt: "A charter treated as a napkin",
		series: "The Parties",
		part: 1,
		receipts: [{
			label: "Lobbying disclosure — Senate",
			href: "https://www.senate.gov/legislative/Public_Disclosure/LDA_reports.htm"
		}, {
			label: "OpenSecrets — who pays",
			href: "https://www.opensecrets.org/federal-lobbying"
		}],
		body: [
			{
				type: "p",
				text: "A protection racket sells a shield and collects dues. Washington does a legal version. Taxes. Donor access. The employee writes a rule a donor wanted, then walks into the firm that asked for it. That is a revolving door. A career path. Not a filed racketeering case."
			},
			{
				type: "p",
				text: "This series is the map. Committees that never shrink. Thousand-page bills nobody reads. A “fight” on television and a handshake on the roll call. Both parties did this. If a lesson only names one jersey, it is a clip. We will name the jobs: leadership PACs, lobby shops, trade associations, the offices that write the draft and the firms that hire the drafter."
			},
			{
				type: "q",
				text: "A republic is principals and agents. A club is dues and protection."
			},
			{
				type: "p",
				text: "Lesson two is the money. Lesson three is the door. Not left versus right. The people who stay versus the people who work.",
			}
		]
	},
	{
		slug: "what-the-democratic-party-became",
		title: "What the Democrats became",
		dek: "A party of farmers and unions became a party of campuses, agencies, and clips.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/blog-house.jpg",
		imageAlt: "The House — a party’s long walk",
		series: "The Parties",
		part: 2,
		body: [
			{
				type: "p",
				text: "This is not a hate page. It is a history class. Jefferson’s party talked limited government. Jackson’s party talked the common man and still built a spoils machine. The 20th century added unions, the New Deal, and Jim Crow in the same tent. The 1960s split it: [civil-rights votes](https://www.congress.gov/bill/88th-congress/house-bill/7152) that were right, and a new class of staffers who never left campus."
			},
			{
				type: "p",
				text: "By the 2020s the brand was agencies, identity memos, and a newsroom that treated the party as weather. Working counties left. The clip stayed. Later lessons: the machines, the 1964–68 break, the donor shift, and what the 2024 loss actually was. We will give them the wins too — Social Security’s passage, the 1964 Act — or this is a caption with our flag on it."
			},
			{
				type: "q",
				text: "A party is a tool. When the tool stops serving the people who built it, name the date."
			}
		]
	},
	{
		slug: "what-the-republican-party-became",
		title: "What the GOP became",
		dek: "Lincoln’s party became a donor club that talks founding and funds the swamp.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/capitol.jpg",
		imageAlt: "The Capitol — another long walk",
		series: "The Parties",
		part: 3,
		body: [
			{
				type: "p",
				text: "Same rule. Not a hate page. A history class. Lincoln’s party ended slavery and occupied the South. Then it made a deal and left. The 20th century: tariffs, business, Nixon’s map, Reagan’s tax cuts and the debt that came with the talk. Read [Treasury’s debt to the penny](https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/). The donor class learned to say Founders and fund the same committees the other jersey funded."
			},
			{
				type: "p",
				text: "2016 was a revolt inside that club. Some of the club joined. Some of it called the voters names. Later lessons: the southern realignment, the never-ending war caucus, K Street Republicans, and why a majority still cannot close a border they campaign on. If we only whip one party we are a Super Bowl. We are a journal."
			},
			{
				type: "q",
				text: "A jersey is not a receipt. Read the roll call."
			}
		]
	},
	{
		slug: "why-the-lobby-should-be-illegal",
		title: "Why the lobby should be illegal",
		dek: "Paid influence is not speech. It is a second government the people did not hire.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The House chamber",
		series: "Congress",
		part: 5,
		receipts: [
			{ label: "Lobbying Disclosure Act — P.L. 104-65", href: "https://www.congress.gov/104/plaws/publ65/PLAW-104publ65.pdf" },
			{ label: "2 U.S.C. § 1601", href: "https://www.law.cornell.edu/uscode/text/2/1601" },
			{ label: "Senate LDA filings", href: "https://lda.senate.gov/system/public/" },
		],
		body: [
			{
				type: "p",
				text: "Citizens may walk to the Capitol and tell an employee what they think. That is petition. A firm that is paid to live inside the political club, draft the bill, and hire last year’s staffer is not petition. It is a second government. The first is on the ballot. The second is not."
			},
			{
				type: "p",
				text: "Why it is not banned: the First Amendment covers petition, and the Court has treated money as speech in campaigns. Why it still should be fenced: disclosure is not a fence. The Lobbying Disclosure Act of 1995 is a form. Forms do not stop the door from revolving. Later lessons: FARA (foreign money), the cooling-off period that is not cool, and a simple rule we will argue — if they write the law, they cannot sell it for a set number of years."
			},
			{
				type: "q",
				text: "The people hire Congress. The lobby hires Congress back."
			}
		]
	},
	{
		slug: "why-he-became-the-enemy",
		title: "Why they hate Trump",
		dek: "They loved the donor. They turned when he stopped writing checks and started closing the problems the political club lived on. Then came the hoaxes — on the taxpayer dime.",
		date: "2026-08-30",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/signs.jpg",
		imageAlt: "The people in the street — not the political club",
		series: "The Parties",
		part: 1,
		receipts: [
			{
				label: "92% negative TV — MRC",
				href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage"
			},
			{
				label: "EIA — U.S. oil record 13.8 mbpd",
				href: "https://www.eia.gov/outlooks/steo/"
			},
			{
				label: "Venezuela oil announcement — Aug 29",
				href: "https://www.aljazeera.com/news/2026/8/29/trump-announces-biggest-oil-deal-in-world-history-with-venezuela"
			},
			{
				label: "Durham report — DOJ",
				href: "https://www.justice.gov/storage/durhamreport.pdf"
			},
			{
				label: "Butler — FBI",
				href: "https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump"
			}
		],
	body: [
			{
				type: "p",
				text: "They do not hate him because he is a saint. This journal has already printed the ugly sentences that are on tape, and it will print them again when they belong. They loved him when he was a donor — a businessman writing checks to the political club. That man was useful. That man was invited. Then he stopped being a donor and became a pragmatist about to solve the problems the club had created and lived on. The invitations ended. The plots began. Taxpayer money went into hoax after hoax: a Russia file the Durham report later gutted https://www.justice.gov/storage/durhamreport.pdf two impeachments, overlapping cases that ate a campaign, a caption that never had to survive the recording. He was not supposed to get the job. Once he had it, they could not let the country conclude that the political club had never been magic."
			},
			{
				type: "p",
				text: "Hate, in this case, is a product. ABC, CBS, and NBC ran evaluative coverage of his 2025 term that the Media Research Center counted as 92 percent negative in the first hundred days https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage A newscast that never quite describes a statute still has a plot: he is the plot. Politicians who cannot pass a bill can always pass a monster. Platforms are paid when the feed stays mad. The people who cashed his checks when he was a donor did not become moralists overnight. They became a clientele whose business model was the problem he was trying to close. They are not primarily afraid of his manners. They are afraid of a public that stops needing them."
			},
			{
				type: "p",
				text: "He never wore the uniform. That is in the record. Then [July 13, 2024, in Butler, Pennsylvania](https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump), when a rifle tried to close the argument and he stood back up. Another attempt on a golf course. Children who still live inside that threat. Love of country is not a discharge paper. Sometimes it is a man who keeps showing up after the people with titles have explained that he should be gone.",
			},
			{
				type: "h",
				text: "What they are not talking about"
			},
			{
				type: "p",
				text: "A caption cannot hold a list. That is why they do not run one. Here is the work on paper, including the oil he just scored. Congress passed some of it. All alone is a slogan. The roll call and the energy tables are the file."
			},
			{
				type: "ul",
				items: [
					"Oil: On August 28–29, 2026 he announced a deal with Venezuela he called the biggest oil deal in world history — majority U.S. control of more than 65 billion barrels of proven reserves, he said, at no cost to the taxpayer, negotiated with Rubio, Hegseth, and Venezuela's interim president Delcy Rodríguez. [The announcement is here.](https://www.aljazeera.com/news/2026/8/29/trump-announces-biggest-oil-deal-in-world-history-with-venezuela) The structure, the fields, and the companies were not in the first paper. Venezuelan officials were described as preparing to sign. This journal will update when the contract is public. Until then it is a score he put on the board.",
					"Oil, the table they already have: EIA's August 2026 outlook has U.S. crude production at a record 13.8 million barrels a day this year — Lower 48, Gulf, Alaska all up versus 2025 — about 18 percent of expected world output. That is not a tweet. It is the government's own energy shop. https://www.eia.gov/outlooks/steo/",
					"The border as a border: southwest encounters at a fifty-year low this term; Remain in Mexico in the first; catch-and-release treated as finished rather than as policy.",
					"Laken Riley Act, Public Law 119-1 — signed January 29, 2025. Congress put its name on it. https://www.congress.gov/bill/119th-congress/senate-bill/5",
					"USMCA replaced NAFTA in the first term. The political club called it theater until it was the law.",
					"Abraham Accords: Arab states and Israel recognized each other without waiting for a final-status sermon. No new American war in that term.",
					"Three justices. The court is not a personality. It is a generation of cases.",
					"Qasem Soleimani, January 2020, Baghdad. A named Iranian commander paid a price the prior decade did not collect.",
					"Space Force. Recruiting treated as a mission this term rather than a branding problem.",
					"First term: energy exporter, not a lecture about scarcity. This term: the EIA record above, plus the Venezuela announcement they would rather argue as a vibe than as barrels."
				]
			},
			{
				type: "p",
				text: "If a network spent a week on those ten lines the way it spends a week on a clipped sentence, the hate would have to compete with a file. That is the point of the hate. The next pages are the cases, the UN and the Taliban in his own words, and the January 6 docket versus the word that never made the indictment. We will not wash fight like hell. We will not pretend a caption is a conviction. They hate him because the list exists."
			}
		]
	},
	{
		slug: "the-file-on-the-man",
		title: "The gauntlet",
		dek: "Overlapping cases, a rifle, and a newscast. The point was to make a revolt look like a fever.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/signs.jpg",
		imageAlt: "The people who still show up",
		series: "The Parties",
		part: 2,
		receipts: [
			{
				label: "MRC 92% negative",
				href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage"
			},
			{
				label: "Durham report",
				href: "https://www.justice.gov/storage/durhamreport.pdf"
			},
			{
				label: "Butler — FBI",
				href: "https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump"
			}
		],
	body: [
			{
				type: "p",
				text: "A caption is lying when it is not the same sentence as the recording. Bloodbath, in the full answer, was about car plants and a tariff, not a promise of civil war. Fine people, in the same remarks, included a total condemnation of neo-Nazis. Those examples are laid out in the clipped-tape lesson. The pattern is older than this presidency. Durham later described a Russia investigation that should not have been opened the way it was https://www.justice.gov/storage/durhamreport.pdf This site, for holding a camera, was tagged with a child-sex smear in fourteen replies. When they cannot beat the tape, they smear the person holding it. That is not a theory. It is a method we have already lived."
			},
			{
				type: "p",
				text: "Liking his mouth is not required. The ugly lines that are on tape stay on this site. The jobs that are on paper stay too: USMCA, three justices, the Abraham Accords, no new American war in the first term, Soleimani, Remain in Mexico, the Laken Riley Act, southwest encounters at a fifty-year low, recruiting treated as a mission. Congress passed some of that. All alone is a slogan. The roll call is the file. Standing with him, on this site, means standing with the work — not with a halo.",
			},
			{
				type: "p",
				text: "What they put him through was not one case. It was a calendar. Two impeachments. A special counsel. Civil and criminal matters in New York. Documents in Florida. Georgia. Gag orders. More than ninety felony counts, overlapping, eating the campaign. A rifle in Butler. Another on a golf course. Children under threat. Members of Congress talking about maximum warfare and breaking a spirit — language we have already logged, on their mics, aimed at the people who pay them. Delay was the point. Court was the venue. Television was the choir. The job of that machine was to make a revolt look like a fever so the political club could say the fever had passed."
			},
			{
				type: "p",
				text: "This is not a chant. The next two lessons are the docket. They are what he told other governments in public, and what the January 6 docket actually contains versus the word that ran all day on the air. Read them slowly. The gauntlet is not proof that he is always right. It is proof that the people who wanted him gone were willing to use every instrument except a better statute."
			}
		]
	},
	{
		slug: "what-he-told-them",
		title: "What he told them",
		dek: "Globalists at the UN. The Taliban on the lawn. Iran in public. Not a staffer’s memo.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/capitol.jpg",
		imageAlt: "The building that leaks",
		series: "The Parties",
		part: 3,
		receipts: [{
			label: "UN 2018 — reject globalism",
			href: "https://news.un.org/en/story/2018/09/1020472"
		}, {
			label: "UN 2019 — patriots, not globalists",
			href: "https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-74th-session-united-nations-general-assembly/"
		}],
	body: [
			{
				type: "p",
				text: "At the United Nations in 2018 he said, in the hall that exists to bless global arrangements, that America rejects the ideology of globalism and embraces the doctrine of patriotism https://news.un.org/en/story/2018/09/1020472 A year later he said the future does not belong to globalists; it belongs to patriots https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-74th-session-united-nations-general-assembly/ The tone can be disliked. The people in that room still heard a claim about where sovereignty sits: in nations, not in a committee above nations. That is the agenda they have been answering ever since, often by calling the speaker names instead of answering the claim."
			},
			{
				type: "p",
				text: "On March 3, 2020, he told reporters on the South Lawn that he had spoken to a Taliban leader, that the conversation was good, that they had agreed there should be no violence, and that we would see. The Taliban issued its own readout — not a White House transcript — in which he called them a tough people fighting for a homeland. The paper underneath is the [Doha agreement of February 29, 2020](https://www.state.gov/wp-content/uploads/2020/02/Agreement-for-Bringing-Peace-to-Afghanistan-02.29.20.pdf): a withdrawal calendar if they cut al-Qaeda. The lawn, their readout, and the deal are all part of the same day. Kabul in August 2021 was the next administration executing a calendar, and the political club used the fall as a clip against the call. A journal that only runs one of those facts is doing the same edit it complains about.",
			},
			{
				type: "p",
				text: "Iran is the other public conversation. In January 2020 Qasem Soleimani was killed in Baghdad by an American strike, the first time in a generation a named Iranian commander paid that price. Trump told Tehran, in public, that more would follow if they hit Americans. Later he said that if they assassinated him the response would be obliteration. That is not a staff memo. In the same years the uniformed force got Space Force, and in this term recruiting has been treated as a mission rather than a branding problem. He did not do any of it as a fairy tale of one man against the world. He did it against a leaky building, a hostile caption, and a party that wanted him housebroken. The point of putting the words here is so the other side can be heard — and why the caption tried to bury it."
			}
		]
	},
	{
		slug: "the-word-that-never-made-the-docket",
		title: "The word that never made the docket",
		dek: "The word ran all day on television. It never appeared on the indictment. Here is the docket, the bodycam, and the testimony that does not match.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The steps they captioned",
		series: "The Parties",
		part: 4,
		receipts: [
			{
				label: "18 U.S.C. § 2383 — unused",
				href: "https://www.law.cornell.edu/uscode/text/18/2383"
			},
			{
				label: "Ashli Babbitt — DOJ",
				href: "https://www.justice.gov/usao-dc/pr/department-justice-closes-investigation-death-ashli-babbitt"
			},
			{
				label: "StopHate catalog",
				href: "https://stophate.com/j6-documentaries"
			}
		],
	body: [
			{
				type: "p",
				text: "Search the federal docket for January 6 defendants charged under [18 U.S.C. § 2383](https://www.law.cornell.edu/uscode/text/18/2383), the Civil War-era statute titled rebellion or insurrection. They are not on that docket. The word still ran all day, every day, on television and from the House floor, as if the indictment had already been written. A caption does not need a grand jury. It only needs repetition. Some leaders of two groups were charged under a different statute — [seditious conspiracy, § 2384](https://www.law.cornell.edu/uscode/text/18/2384) — which is a real charge with a real trial record. Keep the two statutes separate. The swap is the trick: take the scarier word, the one that never made the paper, and teach a country a crime that was never filed.",
			},
			{
				type: "p",
				text: "StopHate and a stack of independent films catalog footage the networks would not run as a sequence https://stophate.com/j6-documentaries We do not treat a documentary as a verdict. We pull what the tape and the government file both show, because that is the method of this journal and because a swamp protects itself first by controlling the pictures."
			},
			{
				type: "p",
				text: "Ashli Babbitt, an Air Force veteran, was shot once while climbing through broken glass into the Speaker's Lobby. The video of that moment shows her unarmed. Lieutenant Michael Byrd fired. The Justice Department declined to charge him https://www.justice.gov/usao-dc/pr/department-justice-closes-investigation-death-ashli-babbitt Capitol Police later called the shot within policy. Byrd told NBC he thought he was defending the chamber and did not know whether she had a weapon. He may have been afraid. The shot may have been lawful. The clip and the later testimony are not the same sentence. They are not. That mismatch is why we exist."
			},
			{
				type: "p",
				text: "On the West Plaza, people in the crowd were hit with less-lethal munitions, chemical spray, and flash devices. Body-worn cameras released by the Justice Department also show officers being beaten, crushed in a tunnel, and doused. Both are on tape. A broadcast that only shows one of those facts is not a report. It is a side. Officer Brian Sicknick was first sold to the country as having been beaten to death with a fire extinguisher. The medical file later described strokes; two men were convicted of assaulting him with spray. The first caption did the political work. The correction did not travel."
			},
			{
				type: "p",
				text: "Trump's speech that day included the words peacefully and patriotically. Splices ran anyway. A building was still breached. A woman was still shot. A journal that only runs one of those facts is wearing a jersey. How we got here is not a secret council. It is a caste that fired on a crowd, charged a crowd, clipped a crowd, and then, in 2026, wrote bills to make sure even a pardon could not make a defendant whole. Exposure is the threat. The mute is the defense. The docket is still the docket, and insurrection is still the word they chose not to file."
			}
		]
	},
	{
		slug: "this-congress-cannot-police-itself",
		title: "This Congress cannot police itself",
		dek: "Replace them. Term-limit them. They do not get to write their own privileges. A citizen board that also goes home.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/we-the-people.jpg",
		imageAlt: "We the People — the only overseers who do not live there",
		series: "The Remedy",
		part: 5,
		receipts: [
			{
				label: "U.S. Term Limits v. Thornton",
				href: "https://www.oyez.org/cases/1994/93-1456"
			},
			{
				label: "Article V — how an amendment is made",
				href: "https://constitution.congress.gov/constitution/article-5/"
			},
			{
				label: "STOCK Act (2012)",
				href: "https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf"
			}
		],
		body: [
			{
				type: "p",
				text: "A suspect does not write the criminal code. Congress writes its pay, its pension, its ethics office, and the exceptions that keep the political club comfortable. Then it investigates itself. That is not oversight. That is a club with a gavel. The people who work for us have become a class that cannot be fired except in theory, every two or six years, by a map they drew and a pile of money they raised from the lobby named above."
			},
			{
				type: "p",
				text: "Term limits cannot be passed as a regular bill. The Supreme Court said so in 1995 — U.S. Term Limits v. Thornton. States may not add extra qualifications to get into Congress. So it takes an amendment. Article V: two-thirds of both houses, or two-thirds of the states call a convention; three-fourths of the states must say yes. There is no other lawful door. There is no extra-constitutional door. This journal does not preach one."
			},
			{
				type: "p",
				text: "What the amendment should do, in plain words. One: every seat turns over on a clock — House and Senate — no career. Two: they do not set their own pay, stock rules, or ethics. Those go to a citizen oversight board. The board is term-limited too. No one on it may run for Congress later. If the watchers can become the watched, that is another club. Three: the laws they pass bind them. No special healthcare, no special exemptions, no insider trades dressed as ‘timing.’ The STOCK Act of 2012 was a press conference. The trades continued."
			},
			{
				type: "q",
				text: "They work for us. They do not get to grade their own homework."
			},
			{
				type: "p",
				text: "Why replace this Congress, not tutor it: the people who would have to vote away their own privileges will not. That is the whole problem in one sentence. So the states must. Later lessons: the text of a draft amendment, how an Article V call works, and why a citizen board that never goes home would become the next swamp. The overseers go home too. Or it is nothing."
			}
		]
	},
	{
		slug: "not-a-part-time-job",
		title: "Not a part-time job",
		dek: "House: about 150 days a year. A third of those sessions under five minutes. No part-time job on earth pays like this. Full time, or the perks stop.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The chamber they are not in",
		series: "Congress",
		part: 4,
		receipts: [{
			label: "FY2026 legislative branch — $7.258 billion — CRS / P.L. 119-37",
			href: "https://www.congress.gov/crs-product/R48612"
		}, {
			label: "Congressional salary — CRS",
			href: "https://www.congress.gov/crs-product/RL30064"
		}, {
			label: "Days in session — Congress.gov",
			href: "https://www.congress.gov/days-in-session"
		}, {
			label: "USAFacts — how long a 'day' lasts",
			href: "https://usafacts.org/articles/congressional-time-in-session/"
		}],
		body: [
			{
				type: "p",
				text: "We pay the legislative branch $7.258 billion a year. That is Public Law 119-37, FY2026. CRS lays the table out https://www.congress.gov/crs-product/R48612 People hear $174,500 and think they are cheap. The salary is the decoy. The bill is seven billion dollars for a floor that sits far fewer days than a school year, and a fundraising calendar that never stops."
			},
			{
				type: "h",
				text: "The days"
			},
			{
				type: "ul",
				items: [
					"From 2001 to 2023 the House averaged about 150 days in session a year. The Senate averaged about 167. Ballotpedia, from the official calendars. https://ballotpedia.org/119th_Congress_legislative_calendar",
					"For 2025 the House was scheduled for 135 days. The Senate, 179. A full-time job in this country is about 260 weekdays, minus holidays. A school year is about 180 days. They sit less than the school.",
					"USAFacts, 2025: 30 percent of House sessions lasted less than five minutes. 18 percent of Senate sessions, the same. A typical House session ran about four hours — half a civilian workday. https://usafacts.org/articles/congressional-time-in-session/",
					"A 'day in session' can be a gavel and a prayer. Pro forma. The calendar still counts it. The donor circuit does not need a gavel."
				]
			},
			{
				type: "p",
				text: "No part-time job in America pays $174,500 plus a pension that outlives the seat, FEHB, a million-dollar office allowance, a gym, and $7.258 billion of machine around the chair. It must stop — or they work full time. If Congress is in session, they are in the building. Call time is not the job. The years they serve are years of work. While they hold the gavel it is the only job. No board. No book tour. No hotel ballroom as the main event. The country already paid them."
			},
			{
				type: "q",
				text: "Part-time Congress is full-time lobby. Full-time pay. Full-time work — or the perks end."
			},
			{
				type: "p",
				text: "Politics as a jersey will not pass that. The people who would vote away their own calendar will not. The next page is what we can do without becoming them."
			}
		]
	},
	{
		slug: "what-we-can-do",
		title: "What we can do",
		dek: "Politics will not fix a Congress that writes its own rules. A united people, peaceful, on the record — or it does not happen.",
		date: "2026-08-30",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/signs.jpg",
		imageAlt: "The people in the street — not the political club",
		series: "Congress",
		part: 7,
		receipts: [
			{
				label: "First Amendment — speech, press, assembly, petition",
				href: "https://constitution.congress.gov/constitution/amendment-1/"
			},
			{
				label: "Article I §5 — punish and expel",
				href: "https://constitution.congress.gov/constitution/article-1/"
			},
			{
				label: "Article V — amendments",
				href: "https://constitution.congress.gov/constitution/article-5/"
			}
		],
		body: [
			{
				type: "p",
				text: "The record is on the table. Forty trillion. Seven billion for a part-time floor. Five billion in lobbying. Two hundred dollars if they file the trade late. Tens of millions into local prosecutors. They divided a nation so the public would fight the neighbor and never look at Congress. Politics — the jersey, the panel, the clip — is not going to fix a Congress that writes its own ethics. The people who would vote away their own perks will not. That is the whole problem in one sentence."
			},
			{
				type: "p",
				text: "What is left is a united America that stops fighting itself. Arendt: power is people acting in concert. Isolation is how a republic is lost. The villain is not the other jersey. The villain is Congress. If we keep the fight they sold us, they keep the calendar."
			},
			{
				type: "h",
				text: "Peaceful. On the record. That is the law."
			},
			{
				type: "ul",
				items: [
					"The First Amendment is the tool they cannot take without eating the document: speech, press, peaceful assembly, petition for a redress of grievances. https://constitution.congress.gov/constitution/amendment-1/ A protest that stays peaceful is the republic working. A riot is their caption. We do not give them the caption.",
					"Demand prosecutions where the elements are actually on the paper — STOCK Act, bribery, false statements, the statutes that already exist — not a jersey hunt, not a word the Constitution reserved for war. A caption is not an indictment. We have already refused to fake treason. We will not fake a roundup either. Apply the law. In court. On the record.",
					"The midterms are the priority. November 3, 2026. Show up. Every American. Then we remove the swamp one seat at a time, as needed — primary, ballot, expulsion where the House will do it. DSA does not need a stronger foot in Congress. Two hundred eighty-two endorsed names is already a beachhead. Not a riot. A line.",
					"Demand the change they will not write: full-time work or the perks end; they do not set their own pay, pension, or ethics; twelve bills by October 1; an amendment with term limits and a citizen board that also goes home. Article V is the door. Article I, Section 5 is censure and expulsion.",
					"Show up with the file, not a costume. One number. One statute. One neighbor who used to be the enemy. That is how a nation is pulled back together.",
					"This journal does not call anyone into a street to break a window. It does not call anyone to lay hands on an employee. It names Congress, prints the tape, and names the lawful instruments. Concert, not a mob."
				]
			},
			{
				type: "h",
				text: "The thought about sitting down"
			},
			{
				type: "p",
				text: "The leverage is already known. The country does not open because a committee gavels. It opens because people clock in — trucks, power, harvests, clinics, classrooms. Congress needs those people more than those people need Congress. That is why a donor who stopped writing checks and started closing problems terrified them. A week where the people who actually run it sat down would be felt in the building. It would also be felt first in a neighbor's refrigerator, in a hospital shift, in a paycheck. The syndicate has a pantry. The people who clock in do not. They would name the dark week the word they already ran without filing the statute. We would have given them the picture."
			},
			{
				type: "p",
				text: "This journal does not call a national sit-down. It does not tell anyone to walk off a public job, ground an airplane, or starve a town to punish a committee. Concert is not a blackout. The fact still stands: they are trying to take a country they do not know how to run. Remind them at work by doing the work and withholding the consent — the vote, the primary, the peaceful petition, the file in a stranger's hand — not by turning out the lights on the people who never sat in the chamber. Power is acting in concert. A republic that sits down on itself is their caption. A republic that stands together and demands the prosecutions the statutes support, and the full-time job they already billed us for, is the hilt. Use that."
			},
			{
				type: "p",
				text: "If politics could have done it, the calendar would already look like a job. It does not. So the people who still clock in — the ones who kept the country opening while the club got comfortable — stand together, peaceful, and demand the prosecutions the statutes support and the change the oath required. Not against each other. Against Congress. That is how this continues. That is how it stops being a clip."
			}
		]
	},
	{
		slug: "the-debt-they-will-not-close",
		title: "The debt they will not close",
		dek: "They have not finished a budget on time since Clinton. Forty trillion. An unread pile is a door for fraud.",
		date: "2026-08-30",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/capitol.jpg",
		imageAlt: "The bill they will not read",
		series: "Congress",
		part: 2,
		receipts: [
			{
				label: "Debt to the Penny — Treasury",
				href: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"
			},
			{
				label: "Pew — appropriations on time only four times",
				href: "https://www.pewresearch.org/short-reads/2025/10/01/congress-has-long-struggled-to-pass-spending-bills-on-time/"
			},
			{
				label: "CRS — last on-time package FY1997",
				href: "https://www.congress.gov/crs-product/IN12324"
			}
		],
		body: [
			{
				type: "p",
				text: "The Treasury's daily table put total public debt outstanding over $40 trillion in August 2026. [Debt to the Penny](https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/) is the government's own meter. It cannot keep growing like this. Interest already eats the room that used to be for the things they campaign on. The people who write the checks are the same people who will not pass a budget."
			},
			{
				type: "p",
				text: "Under the Congressional Budget Act of 1974 they are supposed to adopt a budget resolution, then pass twelve regular appropriations bills before October 1. [Pew counted the years they actually did all of it on time: four.](https://www.pewresearch.org/short-reads/2025/10/01/congress-has-long-struggled-to-pass-spending-bills-on-time/) Fiscal 1977, 1989, 1995, and 1997. The last one was FY1997, signed the day before the year started, while Clinton was still in the building. [CRS says the same: FY1997 was the last time all regular appropriations were enacted by October 1.](https://www.congress.gov/crs-product/IN12324) Since then they have never passed more than five of the twelve on time. In most recent years they passed none. They live on continuing resolutions and giant unread bills."
			},
			{
				type: "h",
				text: "The unread pile is the door"
			},
			{
				type: "ul",
				items: [
					"A continuing resolution copies last year's funding, plus 'anomalies' — exceptions stuffed in by the people who already failed to write a bill. Nobody outside the room can audit an anomaly at 2 a.m.",
					"A giant unread bill is a thousand pages dropped hours before the vote. Members vote on a caption. The riders, the earmarks, the contractors, and the quiet increases live in the annex. That is the same trick, done with money.",
					"Emergency designations and 'disaster' titles skip the caps. Some disasters are real. The designation is also how a permanent program is hidden inside a one-time word.",
					"No line-item debate means no line-item blame. Fraud does not need a mastermind when the document is designed so that no one can be shown to have read it.",
					"The $7.258 billion legislative machine is Congress, which produces those piles. They cannot police the country's books because they will not finish their own."
				]
			},
			{
				type: "p",
				text: "This is not a claim that every continuing resolution is a criminal count. Fraud, in the code, still needs a lie, a scheme, and a specific hand. A giant unread bill is still an appropriation made by law. Article I, Section 9 is satisfied on paper. The oath is not. They swore to well and faithfully discharge the duties of the office. [5 U.S.C. § 3331](https://www.law.cornell.edu/uscode/text/5/3331) is that oath. Twelve bills by October 1 is the duty. They have not done it since fiscal year 1997. Forty trillion is on the meter. The unread pile is the door. This is how the country has been running. It cannot continue."
			}
		]
	},
	{
		slug: "what-they-are-protecting",
		title: "What they are protecting",
		dek: "Chemonics. The Chamber. K Street. Soros money in local races. $200 for a late trade. That is the business.",
		date: "2026-08-30",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/capitol.jpg",
		imageAlt: "The pipeline they will not shut",
		series: "Congress",
		part: 3,
		receipts: [
			{
				label: "Pew — U.S. foreign aid / USAID",
				href: "https://www.pewresearch.org/short-reads/2025/02/06/what-the-data-says-about-us-foreign-aid/"
			},
			{
				label: "OpenSecrets — lobbying 2024 record $4.4B",
				href: "https://www.opensecrets.org/news/2025/02/federal-lobbying-set-new-record-in-2024/"
			},
			{
				label: "STOCK Act — Public Law 112-105",
				href: "https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf"
			},
			{
				label: "Campaign Legal — $200 penalty, zero prosecutions",
				href: "https://campaignlegal.org/update/congressional-stock-trading-and-stock-act"
			},
			{
				label: "Devex — USAID top contractors FY2023",
				href: "https://www.devex.com/news/who-were-usaid-s-top-contractors-in-2023-107745"
			},
			{
				label: "CRS — where foreign-aid money goes",
				href: "https://www.congress.gov/crs-product/R48150"
			},
			{
				label: "Washington Post — Soros and DA races",
				href: "https://www.washingtonpost.com/politics/2025/12/03/george-soros-prosecutors-campaign-finance/"
			},
			{
				label: "Open Society — 2024 expenditures",
				href: "https://www.opensocietyfoundations.org/"
			}
		],
		body: [
			{
				type: "p",
				text: "The $7.258 billion legislative machine is not the prize. It is Congress that protects the prize. Show the USAID money, the lobbyist money, and the trades they will not ban, and the oath starts to look like a costume. They are not confused. They are standing in front of a business."
			},
			{
				type: "h",
				text: "Name the business"
			},
			{
				type: "ul",
				items: [
					"USAID contracts, FY2023: about $6.8 billion obligated. Three billion of that went to ten contractors. Chemonics, a D.C. for-profit, took the largest share — about 20 percent of the contract pile, more than $1 billion that year. Devex, from USASpending. https://www.devex.com/news/who-were-usaid-s-top-contractors-in-2023-107745",
					"CRS's table of implementers puts Chemonics in the same neighborhood as the big faith and nonprofit shops — billions across the decade, U.S. firms on the receiving end of 'foreign' aid. https://www.congress.gov/crs-product/R48150",
					"Federal lobbying: $4.4 billion in 2024, more than $5 billion in 2025. In 2025 the U.S. Chamber of Commerce led at $72.1 million. The National Association of Realtors had been first in 2024 at $86.4 million. Pharma and health products spent about $387 million in 2024 as an industry. OpenSecrets. https://www.opensecrets.org/news/2025/02/federal-lobbying-set-new-record-in-2024/",
					"The revolving door is the product line. LegiStorm counted 866 members and staff who left the Hill for K Street in 2025 — up 60 percent from 2024. One hundred twenty-five lobbyists walked the other way, into Congress. That is not civic virtue. That is inventory.",
					"The STOCK Act's $200 late fee is a cost of doing that business. Zero prosecutions. Disclosure without a bite is a receipt Congress is happy to file."
				]
			},
			{
				type: "h",
				text: "The NGOs, and the local races"
			},
			{
				type: "ul",
				items: [
					"Open Society Foundations, by their own count: $1.2 billion in expenditures in 2024, $24.2 billion over three decades. That is [private money](https://www.opensocietyfoundations.org/). It is not USAID. Keep the two piles separate.",
					"The Washington Post, December 2025: George Soros has spent tens of millions of dollars swinging dozens of district attorney races — local and state officers who decide who gets charged in a county. https://www.washingtonpost.com/politics/2025/12/03/george-soros-prosecutors-campaign-finance/",
					"Politico documented the strategy as early as 2016: elect the prosecutor, change the justice system without passing a statute. Democracy PAC and related vehicles moved nine-figure sums into political groups around the 2022 cycle.",
					"Taxpayer NGOs sit on the other rail. USAID's implementers — Chemonics and the rest — are paid from the unread pile. Private foundations pay for the DAs. Taxes fund the first. The country lives under the second. That is a country paying for its own demise: the foreign-aid contractor in D.C., the prosecutor in the county, the lobbyist in the hall, the $200 trade. Same business. Different letterhead."
				]
			},
			{
				type: "h",
				text: "The tap they fought to keep"
			},
			{
				type: "ul",
				items: [
					"In fiscal 2023 the United States disbursed $71.9 billion in foreign aid. USAID moved about $43.8 billion of that — three of every five dollars. Pew, from ForeignAssistance.gov. https://www.pewresearch.org/short-reads/2025/02/06/what-the-data-says-about-us-foreign-aid/",
					"When the second Trump term tried to fold USAID and cut the international-affairs budget hard, Congress — including a Republican House — blocked the deep cut and kept operating money in the pile. Rescissions took some. The pipeline stayed.",
					"That is not a sermon about every clinic. It is a fact about a tap: tens of billions moving through an unread appropriations stack, NGOs and contractors on the other end, and a legislature that will defund a border faster than it will defund itself."
				]
			},
			{
				type: "h",
				text: "The lobby"
			},
			{
				type: "ul",
				items: [
					"Federal lobbying hit a record $4.4 billion in 2024. OpenSecrets. https://www.opensecrets.org/news/2025/02/federal-lobbying-set-new-record-in-2024/",
					"In 2025 it crossed $5 billion. The people who write the twin law buy the hours. The salary was paid so those hours would belong to the country. They do not.",
					"The Lobbying Disclosure Act is a filing. It is not a wall. A $5 billion industry does not pay that to lose."
				]
			},
			{
				type: "h",
				text: "The trades"
			},
			{
				type: "ul",
				items: [
					"The STOCK Act of 2012 said members of Congress are not exempt from insider-trading law, and they must report trades on a short clock. Public Law 112-105. https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf",
					"The civil penalty for a late report is $200. Campaign Legal Center: no member of Congress has been prosecuted for insider trading under that act. https://campaignlegal.org/update/congressional-stock-trading-and-stock-act",
					"The 119th Congress introduced more than two dozen bills to limit or ban the trades. CRS counted them. Disclosure is still the remedy they prefer, because disclosure without a bite is a press conference. The trades continued."
				]
			},
			{
				type: "p",
				text: "Put the three next to the $7.258 billion Congress, the $40 trillion meter, and the oath they recited. They protect the tap, the lobby, and the ticker. They sold a jersey so the record would not be read. The villain is not the neighbor. The villain is Congress. That is not treason. That is not a caption. That is why a giant unread bill cannot continue. The record is how we pull it back together."
			}
		]
	},
	{
		slug: "a-caption-cannot-be-outlawed",
		title: "A caption cannot be outlawed",
		dek: "The rhetoric is the abuse. A hate law written by the same people would be the next clip.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/chamber.jpg",
		imageAlt: "The mic they will not share",
		series: "The Tape",
		part: 4,
		receipts: [
			{
				label: "the Supreme Court's incitement test — incitement",
				href: "https://www.oyez.org/cases/1968/492"
			},
			{
				label: "Article I, Section 5 — punish and expel",
				href: "https://constitution.congress.gov/constitution/article-1/"
			},
			{
				label: "MRC 92% negative",
				href: "https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage"
			}
		],
		body: [
			{
				type: "p",
				text: "The problem is real. Employees of the people get on a mic and talk like warlords. ‘Maximum warfare.’ ‘Get in their face.’ A six-second cut on the other side of the aisle. Networks run 92% negative and call it weather. That is emotion bait. It is how a nation is taught to hate its neighbor instead of firing its help. This journal exists because of that."
			},
			{
				type: "p",
				text: "The trap is an ‘immediate law’ against anger, hate, and division. Who writes the definitions? The same Congress. Who enforces them? The same desks that already flag a file as radioactive. The next majority will name this site ‘hate’ and the neighbor ‘division.’ We have already been called the worst word in the language for playing a tape. Hand them a statute and they will not use it on themselves."
			},
			{
				type: "p",
				text: "What the Constitution already allows, today, without a Ministry of Truth: the Supreme Court's incitement test — speech that is meant to cause imminent lawless action and likely to cause it is not protected. The rest is ugly and still legal. Article I, Section 5 — each house may punish its members and expel them with two-thirds. Censure. Strip a committee. Primary them. Vote them out. Those are employee tools. They are not a new speech felony for the press."
			},
			{
				type: "q",
				text: "The mic stays on the tape. The mute button stays off."
			},
			{
				type: "p",
				text: "What we will argue in this series, as law that does not eat the First Amendment: official House and Senate video must stay up uncut when a member quotes it. No taxpayer office may release a clip without the link to the full file. Ethics rules that treat ‘warfare against the people who pay them’ as a firing offense inside the chamber — censure and expulsion — not a DOJ beat. Media propaganda is beaten by the rest of the sentence, not by a license they would revoke. Later lessons: Waters, Schumer, Jeffries, the 2020 summer, and the lines we will not wash on our own side. Same standard. Or it is a jersey."
			}
		]
	},
	{
		slug: "the-floor-not-the-feed",
		title: "The floor, not the feed",
		dek: "Speech or Debate is a shield for the chamber. It is not a license for the rant. They write the emotion to stay inside the First Amendment.",
		date: "2026-08-30",
		category: "Dispatch",
		readMinutes: 5,
		image: "/images/chamber.jpg",
		imageAlt: "The mic they will not share",
		series: "The Tape",
		part: 5,
		receipts: [
			{
				label: "Article I §6 — Speech or Debate",
				href: "https://constitution.congress.gov/constitution/article-1/"
			},
			{
				label: "Hutchinson v. Proxmire (1979)",
				href: "https://www.oyez.org/cases/1978/78-680"
			},
			{
				label: "Gravel v. United States (1972)",
				href: "https://www.oyez.org/cases/1971/71-1017"
			},
			{
				label: "the Supreme Court's incitement test — incitement",
				href: "https://www.oyez.org/cases/1968/492"
			}
		],
		body: [
			{
				type: "p",
				text: "Members of Congress will wave ‘Speech or Debate’ as if the Constitution followed them onto a soundstage. It does not. Article I, Section 6: Senators and Representatives shall not be questioned in any other Place for any Speech or Debate in either House https://constitution.congress.gov/constitution/article-1/ The clause is a shield for the legislative act — the floor, the committee, the vote — so a majority cannot drag a member into court for doing the job inside the chamber. It is not a costume for a cable hit."
			},
			{
				type: "p",
				text: "The Supreme Court already drew the line. Hutchinson v. Proxmire (1979): Senator Proxmire's ‘Golden Fleece’ awards, issued in press releases and newsletters, were not Speech or Debate. Only what he said on the Senate floor was. Gravel v. United States (1972): the protection is for legislative acts, not for every errand a member runs in public. A tweet is not a vote. A Sunday show is not a committee. A rally is not either House. Those words can be questioned in another place. The clause does not follow the motorcade."
			},
			{
				type: "h",
				text: "What still covers the rant"
			},
			{
				type: "p",
				text: "The First Amendment does — the same one that covers the people. Political speech, even ugly speech, even speech that divides a nation, is protected unless it is a true threat or it meets the Supreme Court's incitement test: directed to inciting imminent lawless action, and likely to produce it https://www.oyez.org/cases/1968/492 Abstract advocacy is in. ‘Go do this tonight’ that is meant to happen and likely to happen is out. That is why the rants are written the way they are. Maximum warfare. Break their spirit. Get in their face. The temperature goes up. The verb stays just far enough from ‘imminent.’ Emotion is the product. The lawyer's job is to keep it inside the First Amendment. Speech or Debate is the decoy they hold up so it looks as if the Constitution blessed the performance. It did not."
			},
			{
				type: "p",
				text: "Floor speech is protected even when it is rotten. That is the clause working. The feed, the network, the staged outrage — those are ordinary political speech, judged like anyone else's. They divided a nation with that craft. The villain is not the neighbor who heard it. The villain is the employee who sold the fight and then pointed at a clause that does not apply. Censure, expulsion, the ballot: Article I, Section 5. Not a new mute button. Not a fake treason count. The tape, in full.",
			}
		]
	},
	{
		slug: "the-law-they-dont-mention",
		title: "The law they don't mention",
		dek: "Most people were left with a cartoon of how a bill becomes law. The real sequence is longer, and the catch is usually in the annex.",
		date: "2026-08-29",
		category: "Dispatch",
		readMinutes: 3,
		image: "/images/constitution.jpg",
		imageAlt: "The charter they legislate around",
		series: "The Tape",
		part: 6,
		receipts: [{
			label: "How a bill becomes law — Congress.gov",
			href: "https://www.congress.gov/help/learn-about-the-legislative-process"
		}, {
			label: "Omnibus / continuing resolutions — CRS",
			href: "https://crsreports.congress.gov/product/pdf/R/R42388"
		}],
	body: [
			{
				type: "p",
				text: "The most expensive ignorance in American life is not a missed election date. It is not knowing how a law actually becomes a thing that can hurt a citizen. Civics class left most people with a cartoon: a bill, a debate, a signature, a parade. The real sequence is longer and less photogenic. Congress has listed powers. A measure needs both houses and a presidential signature, or a veto override. After that, agencies write rules that have the force of law without another vote. Leadership packs several fights into one stack so a member cannot vote for the popular piece without swallowing the poison. The lobby often drafts both. Civics class called it Schoolhouse Rock. It is a second government in the footnotes."
			},
			{
				type: "p",
				text: "Watch the trick when it is working. They pass a statute that sounds like it is best for the nation. Then they pass, or bury, another that voids it. A thousand-page unread bill. A line that begins notwithstanding any other provision. A continuing resolution that funds the opposite of last month's speech. Exceptions written for themselves. Sunsets that never sunset. The camera covers the name of the bill. The void is in the annex nobody was going to read because they were at work, which is the point."
			},
			{
				type: "p",
				text: "This is not an insult aimed at people who were busy. It is a description of an incentive. A clip is easier than Article I. A caption is easier than a rider. If half the country can name a party and almost none can name who writes the regulation after the statute, the people who live in the political club will keep winning arguments that were never had. Swamp Force exists so that gap closes — not by calling anyone stupid, but by building a habit. When they cheer a bill, ask for the twin. The rider. The rule. The exemption. If they will not show it, they have already named who the statute was for."
			}
		]
	},
	{
		slug: "the-caption-was-not-the-charge",
		title: "The caption was not the charge",
		dek: "Insurrection on television. Not on 18 U.S.C. § 2383. A stacked committee. A tape the House held. Lawfare against parents and a former president. Durham already wrote the Russia file.",
		date: "2026-09-21",
		category: "Dispatch",
		readMinutes: 6,
		image: "/images/chamber.jpg",
		imageAlt: "The House chamber",
		series: "The Tape",
		receipts: [
			{ label: "Durham report", href: "https://www.justice.gov/storage/durhamreport.pdf" },
			{ label: "18 U.S.C. § 2383 — insurrection", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
			{ label: "18 U.S.C. § 2384 — seditious conspiracy", href: "https://www.law.cornell.edu/uscode/text/18/2384" },
			{ label: "USAO-DC — 48 months of January 6 cases", href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol" },
			{ label: "H.Res. 503 — the select committee", href: "https://www.congress.gov/bill/117th-congress/house-resolution/503" },
			{ label: "Attorney General memo — Oct. 4, 2021", href: "https://www.justice.gov/d9/press-releases/attachments/2021/10/04/ag_memo_1.pdf" },
			{ label: "Capitol Breach cases", href: "https://www.justice.gov/usao-dc/capitol-breach-cases" },
		],
		body: [
			{
				type: "p",
				text: "A caption can convict a country before a statute is ever read. Russia collusion ran for years. Special Counsel John Durham’s report is the file: the FBI opened Crossfire Hurricane on raw, unanalyzed, uncorroborated intelligence. It did not have actual evidence of collusion in its holdings when the case began. https://www.justice.gov/storage/durhamreport.pdf The caption did not wait for that sentence. It ran anyway. That is the method."
			},
			{
				type: "p",
				text: "Parents at a school-board microphone were the next caption. On September 29, 2021, the National School Boards Association asked the White House to treat threats around those meetings as possibly ‘the equivalent to a form of domestic terrorism.’ Five days later the Attorney General ordered every U.S. Attorney’s office and the FBI to coordinate. The Bureau opened an EDUOFFICIALS tag. NSBA later apologized for the language. The memo did not come off the table. A parent asking about a curriculum is not a combatant. Treating the microphone as a federal problem is lawfare against the people who hire the board."
			},
			{
				type: "p",
				text: "January 6 was sold as insurrection. 18 U.S.C. § 2383 is the insurrection statute. https://www.law.cornell.edu/uscode/text/18/2383 The U.S. Attorney for the District of Columbia published the tally after four years: about 1,583 people federally charged in connection with that day — assault, trespass, civil disorder, destruction, about eighteen charged with seditious conspiracy under a different statute, § 2384. https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol Zero charged under § 2383. Some of those cases were violent. The journal does not wash a cop being hit. It names the gap: the country was told insurrection, and the charging document did not say that word. A caption that the prosecutor will not sign is a product."
			},
			{
				type: "p",
				text: "The hearing that sold the caption was stacked. H.Res. 503 gave the Speaker the appointments. https://www.congress.gov/bill/117th-congress/house-resolution/503 Nancy Pelosi named Liz Cheney and Adam Kinzinger. She rejected the minority leader’s picks, Jim Jordan and Jim Banks. A select committee that chooses its own opposition is not an inquiry. It is a production. The Capitol cameras recorded thousands of hours. The committee showed clips. The House held the rest of the tape while the hearings ran. Later Speakers opened more of the archive. A body that holds the recording and plays the minutes it prefers is doing the same work as a six-second caption."
			},
			{
				type: "p",
				text: "The former president was put on four criminal dockets at once. The House had already impeached twice. https://www.congress.gov/bill/116th-congress/house-resolution/755 The public paid for the committee. Defense is not free. Voters watched a years-long prosecution of the man they had hired, and of neighbors who had shown up at a school board, while the people who wrote the caption kept the gavel. DHS stood up a Disinformation Governance Board in 2022 and told Congress it would combat a threat to the homeland. The department terminated the board and rescinded the charter on August 24, 2022. https://www.dhs.gov/archive/news/2022/08/24/following-hsac-recommendation-dhs-terminates-disinformation-governance-board A cabinet had named a board to police the information the public would receive. Inspector General Horowitz had already found seventeen inaccuracies and omissions in the FISA applications used to surveil a campaign adviser. https://oig.justice.gov/reports/2019/o1912.pdf This journal’s rule does not change: the statute, the charge sheet, the tape. If the caption and the count do not match, print the count. The information war is not a mood. It is a method — keep the temperature up, keep the file closed, keep the other ledger from being heard."
			}
		]
	},
	{
		slug: "a-war-on-americans",
		title: "A war was waged on Americans",
		dek: "Lawfare and lies were used to replace the American argument. The people own this country. That is not allowed.",
		date: "2026-09-22",
		category: "Dispatch",
		readMinutes: 4,
		featured: true,
		image: "/images/chart-oval-slogan.jpg",
		imageAlt: "The slogan versus the document — lawfare is not a debate",
		series: "The Tape",
		receipts: [],
		lawfare: [
			{
				caption: "The judge stayed on the case",
				sold: "Sold two ways, both as fact. One side: the judge was compromised and the verdict was fixed, because of his daughter’s firm. The other side: the conviction closed the question, a felon, full stop. Neither sentence was sold as an argument.",
				evidence: "The defense said Justice Juan M. Merchan had a conflict and had to step aside. His daughter worked at Authentic Campaigns, a Democratic consulting firm. He had made small political contributions in 2020.",
				source: "Recusal motions in People v. Trump, Indictment 71543-23. His own inquiry to the Advisory Committee on Judicial Ethics.",
				file: "Opinion 23-54, May 4, 2023, said his impartiality could not reasonably be questioned, and that he did not have to step aside or disclose the facts. The opinion assumed his daughter had no interest the case could substantially affect. The defense said that premise was wrong, because clients of the firm raised money off the prosecution. He denied recusal three times. Authentic told the House Judiciary Committee it had no Biden contract after 2020, none with Harris after 2019, and that its employees had not discussed the case with him. A 2026 grand jury subpoena to the firm is an examination. It is not a finding, and it is not a charge.",
				href: "https://www.nycourts.gov/ipjudicialethicsopinions/23-54.htm",
				doc: "Opinion 23-54 — the judge",
			},
			{
				caption: "Bragg · 34 counts",
				sold: "Sold as a finding: thirty-four felonies, election fraud, proved. After the verdict a second caption ran, also as fact: the judge told the jury the verdict did not have to be unanimous. The written charge does not say that.",
				evidence: "Thirty-four counts of falsifying business records in the first degree. A false entry is a misdemeanor unless the person also intended to commit another crime, or to hide one. The counts say “another crime.” They do not name it.",
				source: "Penal Law § 175.05 and § 175.10. The indictment. The May 12, 2023 answer to the bill of particulars. Justice Merchan’s written jury instructions, May 29, 2024, posted by the New York courts.",
				file: "The charge says the verdict on each count, guilty or not guilty, must be unanimous. It also says the People need not prove the other crime was in fact committed, only an intent to commit it or to hide it. The other crime he named for the jury was Election Law § 17-152. Then this sentence: although the jury must unanimously conclude he conspired to promote or prevent an election by unlawful means, “you need not be unanimous as to what those unlawful means were.” The three means he listed were a federal campaign-finance violation, falsifying other business records, or a tax violation, including a false return even if no tax was underpaid. He also told them they need not be unanimous on whether he did it himself or by acting in concert. One of the three means is another false business record. That is the same kind of entry, used as the means inside the conspiracy that turns the charged entries into felonies. The indictment counts still do not name the other crime. The court refused to dismiss. The appeal is not over. The sentence was an unconditional discharge: no jail, no fine.",
				href: "https://www.nycourts.gov/LegacyPDFS/press/PDFs/People%20v.%20DJT%20Jury%20Instructions%20and%20Charges%20FINAL%205-23-24.pdf",
				doc: "Jury instructions — pages 26, 28, 29, 31, and 49",
				docs: [
					{ label: "Indictment — pages 1–14 do not name the other crime", href: "https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf" },
					{ label: "Verdict sheet — May 30, 2024", href: "https://www.nycourts.gov/LegacyPDFS/press/PDFs/Trump-Verdict-Sheet.pdf" },
					{ label: "The court’s opinion on the other crime", href: "https://scholar.google.com/scholar_case?case=11345944588759050005" },
				],
			},
			{
				caption: "She was ordered to pay him",
				sold: "Sold as a finding: she beat him in court, and the only money in the story is the one he paid her to stay quiet. The fee order ran the other way, and then dropped out of the telling.",
				evidence: "Stephanie Clifford sued him for defamation over a tweet. A judge threw the case out and ordered her to pay his lawyers.",
				source: "Clifford v. Trump, Central District of California, Judge S. James Otero. The fee order is December 11, 2018. She was a witness in the later criminal case. She was not the plaintiff in it.",
				file: "Who paid her lawyers: a public CrowdJustice page. By June 2018 that page had taken in more than half a million dollars. The donations were mostly small, and the donors were not named in a judgment. Her lawyer, Michael Avenatti, said the fees were hers or that page, and that he had not looked at who gave. No court finding identifies a party committee as the source. The tweet called a sketch a con. On December 11, 2018, Judge Otero ordered her to pay $293,052.33 in fees, costs, and sanctions, and closed the case. Appeals raised what was owed. At the criminal trial in May 2024 she still had not paid, and she had said she would go to jail first. In October 2024 her lawyer said the judgments were settled for $627,500 and released. This file does not contain the clerk’s satisfaction. The order that she owed him is the court record. “Still owes” was true at the trial. It is not what her lawyer said five months later. The criminal case was the People’s. She was a witness in it. She was not the plaintiff.",
				href: "https://www.courtlistener.com/docket/7649164/stephanie-clifford-v-donald-j-trump/",
				doc: "Clifford v. Trump — the fee order",
				docs: [
					{ label: "Order — she pays $293,052.33 — December 11, 2018", href: "https://www.courtlistener.com/docket/7649164/46/stephanie-clifford-v-donald-j-trump/" },
				],
			},
			{
				caption: "Carroll — she filed the day the window opened",
				sold: "Sold as a finding: a rape conviction, a credible case with the evidence a criminal trial would require, and a governor who rewrote the clock by herself so this one plaintiff could sue. Also sold as a finished fact on both dollar amounts.",
				evidence: "The one-year window opened November 24, 2022. She filed the sexual-abuse case that day. A jury in 2023 awarded $5 million. A jury in 2024 awarded $83.3 million for the 2019 defamation. Neither is a criminal conviction.",
				source: "Carroll v. Trump. First complaint: New York County, Index No. 160694/2019, filed November 4, 2019, at 9:59 a.m. Second complaint: Southern District of New York, 1:22-cv-10016, filed November 24, 2022. Adult Survivors Act, S.66A, signed May 24, 2022. The lookback window ran from November 24, 2022, through November 24, 2023.",
				file: "The window opened November 24, 2022. She filed that day. It closed November 24, 2023. November 4, 2019, was a different suit, defamation over his 2019 denial, and that one did not need the new statute. Who paid the later case: Reid Hoffman, a major Democratic donor, has said he supported it. American Future Republic, a nonprofit he backs, helped pay the legal bills. A 2023 tax filing for that nonprofit has been described as about $7 million to her lawyers. That figure is the filing as reported. It is not a line in the verdict. In an October 2022 deposition she was asked if anyone else was paying her legal fees. She said no. Before the April 2023 trial, the defense said it had just learned of Hoffman. Her lawyer, Roberta Kaplan, told the judge that Carroll had only just remembered the nonprofit, and that Carroll had never met or communicated with anyone there. Hoffman’s adviser said the original grant to the firm was for a different case, and that in 2020 the firm asked to use it for this one. The Second Circuit rejected the claim that the deposition answer required a new trial. A 2026 bar complaint against Kaplan was rejected. A reported Justice Department look at the nonprofit is not a charge in this file. Kaplan’s wife, Rachel Lavine, is the Democratic State Committeewoman for Manhattan’s 66th Assembly District and a founder of the state party’s Progressive Caucus. Lavine’s own campaign materials list endorsements from Representative Jerry Nadler, then-Representative Carolyn Maloney, and State Senator Brad Hoylman. Hoylman, with Assemblymember Linda Rosenthal, sponsored the Adult Survivors Act. Governor Kathy Hochul signed it. On the day of the signature, May 24, 2022, Carroll publicly thanked Hochul. Joshua Matz, a lawyer on the Carroll filing, had been counsel to House Democrats on both impeachments of Trump. None of that is a court finding that a member of Congress wrote the bill for her. The bill does not name her. The overlap is the Manhattan Democratic circle around the lawyer, the sponsor, and the donor. The account is a dressing room at Bergdorf Goodman. There was no eyewitness in the room, no police report, and no physical evidence from the day. On the stand she could not fix the date. She said she believed a Thursday evening in the spring of 1996, and that the date was something she was constantly trying to pin down. She testified she did not scream, because she was in a panic. She testified that she called a friend, Lisa Birnbach, while still laughing, to ask if it was funny. Birnbach told her to go to the police. She did not. A second friend, Carol Martin, testified that Carroll told her a day or two later, and placed that talk somewhere between 1994 and 1996. Those two women were not in the room. They repeated what she told them. Other women’s accounts and the Access Hollywood tape were let in. The jury believed her on sexual abuse and on defamation. It did not find rape on the verdict form. “The testimony made no sense” is not what the jury found. The gaps are what the record contains. The Adult Survivors Act opened one year, for every expired adult claim in the state, not for one plaintiff. The legislature voted. The governor signed. She did not amend the statute alone, and the bill does not name Carroll. The $5 million judgment was affirmed, and on June 29, 2026 the Supreme Court declined to hear it. That appeal is over. The $83.3 million judgment was affirmed by the Second Circuit. As of that same day, a further petition in that case had not been decided. That is the case still open.",
				href: "https://www.courtlistener.com/docket/65895581/carroll-v-trump/",
				doc: "Carroll — filed November 24, 2022",
				docs: [
					{ label: "Adult Survivors Act — signed May 24, 2022", href: "https://www.governor.ny.gov/news/governor-hochul-signs-adult-survivors-act" },
					{ label: "S.66A — the bill the legislature passed", href: "https://www.nysenate.gov/legislation/bills/2021/S66A" },
					{ label: "Supreme Court — the $5 million petition", href: "https://www.scotusblog.com/2026/06/supreme-court-will-not-consider-5-million-verdict-against-trump/" },
				],
			},
			{
				caption: "Letitia James · civil fraud",
				sold: "Sold as a finding: he inflated Mar-a-Lago, the banks were cheated, and he owed about $464 million. It was a civil case. The money was thrown out.",
				evidence: "Letitia James. Civil fraud. Not a criminal charge. The statements priced Mar-a-Lago from $347 million to $739 million. The number set beside it was the county tax bill.",
				source: "People v. Trump, Index No. 452564/2022, Justice Arthur Engoron. People v. Trump, 2025 NY Slip Op 04756, Appellate Division, First Department, August 21, 2025.",
				file: "This is the Letitia James case. It is not the 34 counts. The statements of financial condition priced Mar-a-Lago between $347 million and $739 million. The figure placed next to that was Palm Beach County’s tax valuation, about $18 million to $27 million. The appeals court said neither the Attorney General nor the trial judge appraised the club at $18 million. They used the tax office’s number, a number the owner had accepted for a tax bill. A tax assessment is what the county uses to send the bill. It is not the price a buyer pays. Deutsche Bank made three of the loans. The loans were never put in default. Nicholas Haigh of the bank testified that getting the principal back does not answer whether the bank was paid for the risk. David Williams of the bank testified that the reported net worth was well above the bank’s minimum. The trial penalty was $363,894,816, plus interest, $464,576,230.62 in all. On August 21, 2025, the Appellate Division vacated every dollar of that disgorgement. One opinion in the case said there was no causal connection between the valuations and the money the judgment tried to take. The liability finding was left standing. It was never a criminal charge.",
				href: "https://www.nycourts.gov/reporter/3dseries/2025/2025_04756.htm",
				doc: "Appellate Division — August 21, 2025",
				docs: [
					{ label: "The opinion — 2025 NY Slip Op 04756", href: "https://www.nycourts.gov/reporter/3dseries/2025/2025_04756.htm" },
				],
			},
			{
				caption: "Florida — the documents case",
				sold: "Sold as a finding before a trial: he stole the country’s secrets. The indictment was the exhibit. A charge was spoken as the crime.",
				evidence: "A federal indictment over classified documents at Mar-a-Lago.",
				source: "United States v. Trump, No. 9:23-cr-80101, Southern District of Florida, Judge Aileen Cannon.",
				file: "She dismissed the case against him on July 15, 2024. The special counsel dropped the appeal as to him after the election. There is no jury verdict. The caption outlived the docket.",
				href: "https://www.courtlistener.com/docket/67490071/united-states-v-trump/",
				doc: "Florida docket — 9:23-cr-80101",
				docs: [
					{ label: "Order dismissing the indictment — July 15, 2024", href: "https://www.courtlistener.com/docket/67490071/672/united-states-v-trump/" },
				],
			},
			{
				caption: "The District of Columbia",
				sold: "Sold as a finding: insurrection, and a proved attempt to overturn an election. The word insurrection was not the statute on the indictment.",
				evidence: "Four federal counts over the 2020 election and January 6.",
				source: "United States v. Trump, No. 1:23-cr-00257, Judge Tanya Chutkan.",
				file: "The counts were conspiracy to defraud the United States, obstruction of an official proceeding, and conspiracy against rights. Not 18 U.S.C. § 2383. Dismissed without prejudice on November 25, 2024, because a sitting president is not prosecuted. Without prejudice is not a verdict of innocence. It is also not the conviction the country had already been told was a fact.",
				href: "https://www.courtlistener.com/docket/67656595/united-states-v-trump/",
				doc: "District of Columbia docket — 1:23-cr-00257",
				docs: [
					{ label: "Indictment", href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf" },
					{ label: "Order dismissing it without prejudice — November 25, 2024", href: "https://www.courtlistener.com/docket/67656595/283/united-states-v-trump/" },
				],
			},
			{
				caption: "Georgia — the case was abandoned",
				sold: "Sold as a finding: a criminal enterprise, racketeering, proved by the press conference. The indictment was treated as the conviction.",
				evidence: "A state racketeering indictment over the 2020 election.",
				source: "Fulton County Superior Court No. 23SC188947, Judge Scott McAfee.",
				file: "The Georgia Court of Appeals disqualified District Attorney Fani Willis and her office. Prosecutor Peter Skandalakis then moved to abandon the case. On November 26, 2025 the judge entered a nolle prosequi. He wrote there was no realistic prospect of trying a sitting president before January 20, 2029. The split was made at the announcement. The file ends with the case dropped.",
				href: "https://www.fultonclerk.org/",
				doc: "Fulton County — 23SC188947",
				docs: [
					{
						label: "Georgia Supreme Court — the disqualification, September 16, 2025",
						href: "https://www.gasupreme.us/wp-content/uploads/2025/09/s25c0587.pdf",
					},
				],
			},
			{
				caption: "The White House briefing — August 3, 2016",
				sold: "Sold as a finding, in both directions. One side: the FBI caught a Russian agent and the White House was only told. The other side: the White House ordered the frame. The paper is a briefing, not an order, and not a clean hands story.",
				evidence: "CIA Director John Brennan briefed President Obama, Vice President Biden, Director of National Intelligence Clapper, and FBI Director Comey, in the White House, on Russian election interference and on intelligence that the Clinton campaign had approved a plan to tie Trump to Russia.",
				source: "John Durham’s report. The CIA then sent a written referral to Comey and to Peter Strzok in September 2016.",
				file: "Durham records the August 3 briefing and the referral. The FBI had already opened Crossfire Hurricane as a full investigation. It did not open on the Clinton-plan intelligence the way it opened on the campaign. The same director who sat in that briefing later signed applications to the secret court. Horowitz found seventeen errors and omissions in the Carter Page warrants. One FBI lawyer, Kevin Clinesmith, altered a CIA email and pleaded guilty. A briefing is not a written order to indict. A briefing the warrant leaves out is not an independent investigation.",
				href: "https://www.justice.gov/storage/durhamreport.pdf",
				doc: "Durham report — the August 3 briefing",
			},
			{
				caption: "The Oval Office — January 5, 2017",
				sold: "Sold as a finding: the investigation of the incoming administration was walled off from the White House, done by the book, and about Russia. The memo of the meeting is about the incoming national security advisor.",
				evidence: "President Obama, Vice President Biden, FBI Director Comey, Deputy Attorney General Yates, and National Security Advisor Susan Rice, in the Oval Office, after an intelligence briefing.",
				source: "Rice’s email to herself on January 20, 2017, the morning the administration ended. She wrote it to the file.",
				file: "Obama said he was not asking about, initiating, or instructing anything from a law-enforcement perspective, and that it should be handled by the book. Comey said he was proceeding by the book, and then said he had concerns about Michael Flynn’s talks with the Russian ambassador and that sensitive Russia information might not be passed to Flynn. Comey said he had no indication Flynn had passed classified information. The White House, the FBI, and the Justice Department were in one room, on the incoming hire, fifteen days before the inauguration. The email is the file. It is not a transcript of a plot, and it is not a wall.",
				href: "https://en.wikisource.org/wiki/Susan_Rice_January_20%2C_2017_E-mail_to_Self",
				doc: "Rice email to herself — January 20, 2017",
				docs: [
					{ label: "Durham report — the January 5 meeting", href: "https://www.justice.gov/storage/durhamreport.pdf" },
				],
			},
			{
				caption: "One lawyer, three offices",
				sold: "Sold as a finding: the Justice Department dispatched a prosecutor to the Manhattan district attorney to bring the state case, on White House orders. Also sold the other way: the state case had nothing to do with Washington.",
				evidence: "Matthew Colangelo worked the Trump civil investigation at the New York attorney general’s office, then held the third-ranking post at the Department of Justice, then joined District Attorney Alvin Bragg’s office in December 2022, before the indictment.",
				source: "The public sequence of the jobs. He sat at the prosecution table in People v. Trump.",
				file: "The path connects the civil case, the Department, and the criminal case in one résumé. No judgment in the criminal case finds that the White House or the Department ordered him there. A job is not a dispatch order. It is also not a coincidence the paper has explained. The New York case is the state case. The lawyer who helped try it had just left the Department that was investigating the same man.",
				href: "https://www.nycourts.gov/LegacyPDFS/press/PDFs/People%20v.%20DJT%20Jury%20Instructions%20and%20Charges%20FINAL%205-23-24.pdf",
				doc: "The trial he sat — jury instructions",
			},
			{
				caption: "The Georgia invoices",
				sold: "Sold as a finding: the Biden White House ran the Fulton County case. Also sold as a finding: the state case was sealed off from Washington.",
				evidence: "Special prosecutor Nathan Wade billed Fulton County for a May 23, 2022 conference with White House counsel, and for a November 18, 2022 interview in Washington with the White House. The same invoices bill meetings with the January 6 committee.",
				source: "A House Judiciary Committee letter to Wade that recites those invoice lines from the prosecution’s billing.",
				file: "The invoices are a billing entry, not a transcript. They do not record what was said. They do record that the special prosecutor on the state election case charged the county for time with the White House and with the congressional committee, before the indictment. The case was later abandoned after the Georgia Court of Appeals disqualified Willis and her office over the relationship and the money, not over these meetings. A meeting on an invoice is not an order. A sealed-off state case does not bill the White House.",
				href: "https://www.congress.gov/118/meeting/house/117301/documents/HHRG-118-FD00-20240515-SD027-U27.pdf",
				doc: "House letter reciting the Wade invoices",
			},
			{
				caption: "One special counsel, both federal cases",
				sold: "Sold as a finding: the White House appointed Jack Smith. Also sold as a finding: the appointment put the cases outside politics.",
				evidence: "On November 18, 2022, Attorney General Merrick Garland appointed one special counsel for both investigations: the documents case and the election case. He said he did it because Trump had announced another campaign and the sitting president intended to be a candidate.",
				source: "Garland’s remarks and the appointment, Department of Justice, November 18, 2022.",
				file: "The order is the Attorney General’s. It does not recite a White House directive. Garland named the political calendar as the reason a special counsel was required. Judge Cannon later dismissed the documents case against Trump because the appointment was unlawful. The District of Columbia case was dismissed without prejudice after the election, on the government’s motion. Two federal cases, one prosecutor, appointed because both candidates were running. That is the paper. An order from the President is not on it.",
				href: "https://www.justice.gov/archives/opa/speech/attorney-general-merrick-b-garland-delivers-remarks-appointment-special-counsel",
				doc: "Garland — appointment of the special counsel",
				docs: [
					{ label: "Order No. 5559-2022", href: "https://www.justice.gov/d9/press-releases/attachments/2022/11/18/2022.11.18_order_5559-2022.pdf" },
				],
			},
			{
				caption: "The family subpoenas",
				sold: "Sold as a finding: the family was under constant subpoena because the crimes were endless. No one gave a count. The paper has one.",
				evidence: "Testimony subpoenas to four of them in one New York investigation. Separate subpoenas to the banks and the accountant for the family’s records. Not a summons every week.",
				source: "People v. Trump Organization, Index No. 451685/2020, Justice Engoron, February 17, 2022. Contempt affirmed, 2023 NY Slip Op 00825. Trump v. Mazars, July 9, 2020. Trump v. Vance, July 9, 2020.",
				file: "The testimony count is four people, one investigation. The New York Attorney General was asking whether asset values were misstated on financial statements, loan applications, and tax papers to get better loans, insurance, and tax treatment. Eric Trump had already sat. The February 17, 2022 order says he took the Fifth to more than 500 questions. On December 1, 2021 the office subpoenaed Donald J. Trump for documents and testimony, and Ivanka Trump and Donald Trump Jr. for testimony. They moved to quash. The court denied it. Donald had 14 days for the papers and 21 days to sit. Ivanka and Donald Jr. had 21 days to sit. In April 2022 the same judge held Donald in civil contempt for the document part and set the sanction at $10,000 a day until he complied. The appeals court affirmed that sanction. The investigation became the civil fraud case. On August 21, 2025 the money penalty was vacated. The liability finding was left standing. The House, in April 2019, issued four subpoenas. They were not handed to the children. Two went to Deutsche Bank, one to Capital One, one to Mazars, for the finances of the President, his children, and the businesses. On July 9, 2020 the Supreme Court did not enforce them and did not kill them. It sent them back. A congressional subpoena for a president’s papers is not an ordinary subpoena. This page does not have a later order that says every page was turned over. The Manhattan district attorney sent one grand jury subpoena to Mazars for tax returns and related records from 2011 on. On the same day the Supreme Court held that a sitting president is not immune from a state criminal subpoena. The point on that paper is a state criminal investigation of the records. Not in the count: the January 6 committee listed Ivanka Trump, Donald Trump Jr., and Jared Kushner as witnesses. This page does not have their subpoenas, so they are not numbered here. A news report of a later grand jury subpoena is not a filing on this page.",
				href: "https://www.nycourts.gov/Reporter/pdfs/2022/2022_30538.pdf",
				doc: "Engoron — February 17, 2022",
				docs: [
					{ label: "Contempt — $10,000 a day, affirmed", href: "https://www.nycourts.gov/reporter/3dseries/2023/2023_00825.htm" },
					{ label: "Trump v. Mazars — the House subpoenas", href: "https://supreme.justia.com/cases/federal/us/591/19-715/" },
					{ label: "Trump v. Vance — the grand jury subpoena", href: "https://supreme.justia.com/cases/federal/us/591/19-635/" },
				],
			},
			{
				caption: "The dark money",
				sold: "Sold two ways, both as fact. One side: the fight was spontaneous, just neighbors who woke up angry. The other side: one man bought the country. The ledger is neither.",
				evidence: "Taxpayer grants to private nonprofits, and private money whose names the public Form 990 does not have to print.",
				source: "ForeignAssistance.gov. USASpending. DHS Inspector General OIG-26-04. 22 U.S.C. § 4411. 2 C.F.R. § 200.450. 26 U.S.C. § 6104. Federal Election Commission individual receipts.",
				file: "The war had a caption. It also had a pipe. Congress votes an appropriation. An agency writes a grant. A private nonprofit cashes it. In fiscal 2023 the United States disbursed about $71.9 billion in foreign aid. The U.S. Agency for International Development moved about $43.8 billion of that. The Federal Emergency Management Agency awarded nearly $1.4 billion in fiscal 2023 and 2024 through shelter programs to states, cities, and nonprofits. The Inspector General could not ensure the money was used as the law required. Congress funds the National Endowment for Democracy at $315 million. That money goes out to party institutes, including the National Democratic Institute and the International Republican Institute. A federal grant is not supposed to buy a campaign. That limit is 2 C.F.R. § 200.450. The other pipe is private, and it is dark on purpose. 26 U.S.C. § 6104 lets most tax-exempt groups keep contributor names off the public Form 990. The IRS has the names. The country does not. Where the law requires a name, the name is printed. Federal Election Commission filings list George Soros on committees that back district attorneys. The political committee is public. The 501(c)(4) that can feed it does not have to name him. No charging document on this page says a named donor paid a person to set a fire. The darkness is what the statute allows. Americans paid into a pipe they cannot see, while the captions taught one neighbor that the other neighbor was the enemy.",
				href: "https://www.law.cornell.edu/uscode/text/26/6104",
				doc: "26 U.S.C. § 6104 — the names stay off the public form",
				docs: [
					{ label: "Foreign aid — fiscal 2023", href: "https://www.foreignassistance.gov/" },
					{ label: "USASpending — the aid agency", href: "https://www.usaspending.gov/agency/agency-for-international-development" },
					{ label: "FEMA shelter grants — the Inspector General", href: "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf" },
					{ label: "National Endowment for Democracy", href: "https://www.law.cornell.edu/uscode/text/22/4411" },
					{ label: "A grant may not buy a campaign", href: "https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-D/section-200.450" },
					{ label: "FEC — Soros receipts", href: "https://www.fec.gov/data/receipts/individual-contributions/?contributor_name=SOROS%2C%20GEORGE" },
				],
			},
		],
		body: [
			{
				type: "p",
				text: "The chart is the file. Each row is one case. The name is the case. The two lines are the part that does not match the caption. The link opens the court record: the jury instructions, the docket, or the opinion. The 34 counts are Alvin Bragg. They are not Letitia James. Her case is the civil fraud row. The last row is the money. Congress voted the grants. The public form does not have to name the private donors. That pipe is part of the same war.",
			},
		],
	},
	{
		slug: "the-statute-is-the-end",
		title: "The statute is how it ends",
		dek: "Assault, a published address, and a threat to a juror are already crimes. The funding file does not name a donor. The charge sheet names the people who did the act.",
		date: "2026-09-22",
		category: "Dispatch",
		readMinutes: 4,
		image: "/images/chart-lawfare.jpg",
		imageAlt: "The charge sheet, not the slogan",
		series: "The Remedy",
		receipts: [
			{ label: "DHS — assaults on ICE, 2025", href: "https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults" },
			{ label: "DOJ — Prairieland sentences", href: "https://www.justice.gov/opa/pr/leader-antifa-cell-members-north-texas-sentenced-100-years-prison-terrorist-attack-ice" },
			{ label: "18 U.S.C. § 111 — assault on a federal officer", href: "https://www.law.cornell.edu/uscode/text/18/111" },
			{ label: "18 U.S.C. § 119 — a federal officer’s address", href: "https://www.law.cornell.edu/uscode/text/18/119" },
			{ label: "18 U.S.C. § 1361 — government property", href: "https://www.law.cornell.edu/uscode/text/18/1361" },
			{ label: "18 U.S.C. § 1503 — a juror", href: "https://www.law.cornell.edu/uscode/text/18/1503" },
			{ label: "26 U.S.C. § 6104 — donor names", href: "https://www.law.cornell.edu/uscode/text/26/6104" },
		],
		body: [
			{
				type: "p",
				text: "Peaceable assembly is a right. The [First Amendment](https://constitution.congress.gov/constitution/amendment-1/) says so. A bottle, a published home address, a vehicle used as a weapon, and a threat to a juror are not assembly. They are already crimes. Ending them is a charge, not a second mob.",
			},
			{
				type: "p",
				text: "[DHS, January 8, 2026](https://www.dhs.gov/news/2026/01/08/radical-rhetoric-sanctuary-politicians-leads-unprecedented-1300-increase-assaults): from January 20 through December 31, 2025, the department recorded 275 assaults on ICE officers, against 19 in the same stretch of 2024. Vehicular attacks in a nearly identical window: 66, against 2. The department’s line for doxxing and harassment of those officers is 866-347-2423.",
			},
			{
				type: "p",
				text: "The statutes do not need a new slogan. [18 U.S.C. § 111](https://www.law.cornell.edu/uscode/text/18/111) is assault on a federal officer. [18 U.S.C. § 119](https://www.law.cornell.edu/uscode/text/18/119) is publishing a covered person’s home address so that another person can threaten or harm him. [18 U.S.C. § 1361](https://www.law.cornell.edu/uscode/text/18/1361) is government property. [18 U.S.C. § 1503](https://www.law.cornell.edu/uscode/text/18/1503) is influencing, intimidating, or impeding a juror. The ordinary maximum is 10 years. If the trial is a criminal case, the juror is a petit juror, and a class A or B felony was charged, the maximum is 20 years.",
			},
			{
				type: "p",
				text: "Prairieland is what the charge looks like when it is brought. On July 4, 2025, an attack at the Prairieland Detention Center in Texas wounded a local police officer. [The Justice Department, June 23, 2026](https://www.justice.gov/opa/pr/leader-antifa-cell-members-north-texas-sentenced-100-years-prison-terrorist-attack-ice): eight people sentenced for rioting, weapons, explosives, material support to terrorists, obstruction, and the attempted murder. Benjamin Hanil Song, convicted of the attempted murder, received 100 years. The eight sentences together were 450 years. The department called them an Antifa cell, and called the case the first such sentencing after a September 2025 executive order that designated the movement a domestic terrorist organization. The label is the government’s. The years are for the attack. An idea does not carry a rifle. A person does.",
			},
			{
				type: "p",
				text: "A juror is not a target, from either side. Section 1503 does not ask which party is angry. After the Fulton County indictment of Donald Trump in August 2023, the sheriff’s office said it was investigating threats and the posting of jurors’ personal information. This journal will not assign that file to a party without the charging document. New York sealed juror addresses in People v. Trump and in People v. Penny because the court found a risk of harassment. “They dox jurors” as a party caption, with no charge sheet, is the same alteration this journal refuses everywhere else.",
			},
			{
				type: "p",
				text: "Who paid for it. The Prairieland release does not name a donor who bought the weapons. [26 U.S.C. § 6104](https://www.law.cornell.edu/uscode/text/26/6104) keeps most contributor names off the public Form 990. Congress appropriates. An agency writes a grant. A nonprofit cashes it. The country often cannot see the name on the check. That darkness is not proof that a named person purchased the attack. It is proof the ledger is closed. A rumor treated as a conviction is a caption.",
			},
			{
				type: "p",
				text: "How it ends. Charge the person who did the act. Prairieland is the example. Use the statutes already in the code: § 111, § 119, § 1361, and § 1503. Report an officer’s published address to the department, not to a crowd. Congress holds the purse under Article I, Section 9. A grant with no public itemized ledger is a door. Close the grant, or open the ledger. The form does not name the donor. The donor is not invented. Then the ballot. A member who tells the country that the enforcement agency is the enemy, while assaults on its officers rise from 19 to 275 in a year, is not doing the oath in 5 U.S.C. § 3331. The answer to a mob is not a second mob.",
			},
		],
	},
	...LEDGER_POSTS,
];
export function getPost(slug: string) {
	return posts.find((p) => p.slug === slug);
}
/** Essay that owns the grok.me share card. Pin with shareLead, else newest by date. */
export function getShareLead() {
	const pinned = posts.find((p) => p.shareLead);
	if (pinned) return pinned;
	return [...posts].sort((a, b) => b.date.localeCompare(a.date))[0];
}
/** Newest first. This is a journal that publishes, not a syllabus. */
export function getLatest(n = 8) {
	return [...posts]
		.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
		.slice(0, n);
}
export const START_HERE = [
	"we-the-people",
	"a-war-on-americans",
	"they-opened-the-border",
	"find-them",
] as const;
export const LEAD_SERIES = "The Republic";
/** Duplicates and drafts. URLs still resolve. Not in the nav. */
export const HIDDEN = new Set([
	"they-work-for-us",
	"they-called-it-protest",
	"the-caption-was-not-the-charge",
	"the-word-that-never-made-the-docket",
	"not-a-part-time-job",
	"they-sold-the-split",
	"division-is-the-product",
	"the-republic-not-the-caption",
	"the-file-on-the-man",
	"what-he-told-them",
	"they-published-the-replacement",
	"the-uniparty-mirror",
	"a-caption-cannot-be-outlawed",
	"the-floor-not-the-feed",
	"the-law-they-dont-mention",
	"they-hold-it-by-the-blade",
	"the-record-not-the-rally",
	"what-they-are-protecting",
	"the-pool",
	"they-dont-debate-they-flag",
	"what-the-democratic-party-became",
	"what-the-republican-party-became",
	"how-the-house-was-captured",
	"why-he-became-the-enemy",
	"the-7-billion-machine",
	"why-the-lobby-should-be-illegal",
	"the-whole-bill",
	"the-funnel",
	"it-does-not-fit",
	"the-check-they-will-not-write",
	"what-we-can-do",
	"the-hospital-and-the-morgue",
	"who-got-paid",
	"the-docket",
	"call-these-first",
	"this-congress-cannot-police-itself",
]);
/** Reading order. Same on the header, Archive, and the home map. */
export const JOURNAL = [
	{
		name: "The Republic",
		dek: "They forgot who they work for.",
		slugs: [
			"we-the-people",
			"that-is-not-why-they-are-elected",
			"clean-hands",
			"they-want-a-new-constitution",
		],
	},
	{
		name: "The Tape",
		dek: "The cut sentence, the one word, and the file that does not match.",
		slugs: [
			"they-clipped-the-tape",
			"one-word",
			"they-ran-it-anyway",
			"the-hire-is-the-country",
			"a-war-on-americans",
			"sixty-percent",
		],
	},
	{
		name: "The Media",
		dek: "The caption they sold. The file that did not match.",
		slugs: ["the-media-ledger"],
	},
	{
		name: "Democrats",
		dek: "The lie, the gaslight, and the voter they named the enemy.",
		slugs: ["the-democrat-ledger"],
	},
	{
		name: "Republicans",
		dek: "The promise, the chant, and the statute that did not follow.",
		slugs: ["the-republican-ledger"],
	},
	{
		name: "Congress",
		dek: "The hire talks. The country does not get a budget, a bill they wrote, or a clean roll.",
		slugs: [
			"the-noise",
			"full-time-or-go-home",
			"they-dont-write-the-bills",
			"the-line-in-the-sand",
			"paying-the-taliban",
			"the-debt-they-will-not-close",
			"the-recess-blockade",
			"a-barcode-is-not-a-lock",
		],
	},
	{
		name: "The Border",
		dek: "The open door, the bill, and the missing children.",
		slugs: [
			"they-opened-the-border",
			"what-the-taxpayer-bought",
			"fema-ran-two-jobs",
			"find-them",
			"defund-ice-is-the-tell",
		],
	},
	{
		name: "The Remedy",
		dek: "The judges, and the tax money the governors spent.",
		slugs: ["they-let-them-walk", "the-bill-they-sent", "the-statute-is-the-end"],
	},
] as const;
export function leadSection() {
	return JOURNAL.find((s) => s.name === LEAD_SERIES) ?? JOURNAL[0];
}
export function journalSections() {
	return JOURNAL.filter((s) => s.name !== LEAD_SERIES);
}
export function postsInSeries(name: string) {
	const section = JOURNAL.find((s) => s.name === name);
	if (section) {
		return section.slugs.map((s) => getPost(s)).filter(Boolean) as typeof posts;
	}
	return posts.filter((p) => p.series === name).sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
}
export function nextInSeries(slug: string) {
	for (const section of JOURNAL) {
		const i = (section.slugs as readonly string[]).indexOf(slug);
		if (i >= 0 && i < section.slugs.length - 1) {
			return getPost(section.slugs[i + 1]);
		}
	}
	return undefined;
}
export function relatedPosts(slug: string, n = 3) {
	const p = getPost(slug);
	const rest = posts.filter((x) => x.slug !== slug);
	if (!p?.series) return rest.slice(0, n);
	const same = postsInSeries(p.series).filter((x) => x.slug !== slug);
	const others = rest.filter((x) => x.series !== p.series);
	return [...same, ...others].slice(0, n);
}
