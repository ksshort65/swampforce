# Short visual versions of the verified essays (journal.py renders them).
# card: ("n", big, label, fact#) number card, or ("q", quote, attribution, fact#) quote card. fact# = index into the essay's
#   linked-fact list (journal.py facts_of(); same order as /workspace/journal-pilot/digest/digest.txt). The source button uses that fact's first link.
# facts: [(fact#, one-line summary written from that verified sentence)]; the verified sentence itself opens on tap.
# view: (index of Our view paragraph, number of sentences) - owner's words, verbatim.
# icon: graphic next to a number card.  chart: (title, labels, values, fmt, fact#) where the essay has a series.
S = {}
S["we-the-people"] = dict(
    card=("n", "$40T+", "national debt on the Treasury's Debt to the Penny. The last budget surplus: fiscal 2001 (CBO).", 4), icon="money",
    facts=[(0, "The Constitution opens with \u201cWe the People,\u201d not with Congress."), (2, "Every member swears to support the Constitution \u201cwithout any mental reservation.\u201d"),
           (3, "CBO's historical tables show the last surplus in fiscal 2001.")],
    view=(1, 3))
S["they-opened-the-border"] = dict(
    card=("n", "8.72M", "southwest land border encounters, fiscal 2021\u20132024, counted by DHS's statistics office", 3), icon="people",
    facts=[(2, "CBP nationwide encounters: 1.96M, 2.77M, 3.20M, 2.90M in FY2021\u20132024."), (4, "New York City booked $8.13 billion for migrant shelter in three fiscal years."),
           (5, "FEMA awarded $1.4 billion in shelter money in FY2023\u201324, moved from CBP.")],
    chart=("CBP nationwide encounters (millions)", ["FY21", "FY22", "FY23", "FY24"], [1.96, 2.77, 3.20, 2.90], "m", 2),
    view=(1, 1))
S["what-the-taxpayer-bought"] = dict(
    card=("n", "$1.4B", "in FEMA shelter grants, FY2023\u201324. The Inspector General found FEMA could not ensure it was used as the law required.", 1), icon="money",
    facts=[(0, "FEMA's 2024 grant rules listed hotels, clothing and phone plans as reimbursable."), (3, "New York City: $8.13 billion for asylum-seeker services in three years."),
           (4, "ICE: 81,312 criminal noncitizens arrested in FY2024 carried 516,050 charges and convictions.")],
    view=(1, 3))
S["the-hospital-and-the-morgue"] = dict(
    card=("n", "$27B", "federal and state emergency Medicaid for people ineligible because of immigration status, FY2017\u20132023 (CBO)", 2), icon="money",
    facts=[(0, "EMTALA requires emergency rooms to treat anyone who comes in."), (6, "ICE: 81,312 criminal noncitizens arrested in FY2024 carried 516,050 charges and convictions."),
           (7, "About 647,600 noncitizens with convictions or pending charges were on ICE's non-detained docket (July 2024).")],
    view=(1, 2))
S["they-want-a-new-constitution"] = dict(
    card=("q", "abolish capitalism and ultimately to achieve communism", "Red Star caucus inside DSA, on its own site", 1),
    facts=[(0, "DSA posts its 2026 program as a PDF on its own site."), (5, "Every member swears to support this Constitution, without mental reservation."),
           (7, "The Communist Control Act, 50 U.S.C. \u00a7 841, is still on the books.")],
    view=(2, 2))
S["the-docket"] = dict(
    card=("n", "90 days", "the notice a voter must send the state before suing over a dirty voter roll under the NVRA", 2), icon="doc",
    facts=[(2, "52 U.S.C. \u00a7 20510 lets an aggrieved voter sue under the NVRA."), (3, "List maintenance is required by 52 U.S.C. \u00a7 20507."),
           (4, "A noncitizen voting in a federal election commits a crime (18 U.S.C. \u00a7 611).")],
    view=(1, 3))
S["call-these-first"] = dict(
    card=("n", "90 days", "notice to the state's chief election official comes first, not a class action against the House", 0), icon="doc",
    facts=[(0, "The first step is a 90-day NVRA notice to the state election chief."), (1, "Groups that already file voter-roll cases publish their own dockets."),
           (3, "Names of noncitizens who voted go to the U.S. Attorney (18 U.S.C. \u00a7 611).")],
    view=(1, 2))
S["the-bill-they-sent"] = dict(
    card=("q", "is not eligible for any Federal public benefit", "8 U.S.C. \u00a7 1611(a), on an alien who is not a qualified alien (narrow exceptions apply)", 0),
    facts=[(0, "Federal law bars most federal benefits for aliens who are not qualified."), (1, "States need their own post-1996 law to give state benefits (8 U.S.C. \u00a7 1621)."),
           (7, "DOJ has sued jurisdictions that give illegal aliens in-state tuition.")],
    view=(1, 2))
S["they-let-them-walk"] = dict(
    card=("q", "shall take into custody", "8 U.S.C. \u00a7 1226(c), on certain criminal aliens", 1),
    facts=[(0, "Federal law directs detention when no release condition protects the public."), (1, "The Attorney General \u201cshall take into custody\u201d certain criminal aliens."),
           (3, "Minnesota's U.S. Attorney won a 28-year sentence in the Feeding Our Future fraud.")],
    view=(1, 3))
S["who-got-paid"] = dict(
    card=("n", "8.72M", "southwest border encounters, fiscal 2021\u20132024 (DHS statistics office)", 0), icon="people",
    facts=[(3, "Apr 29, 2026: prosecutors charged Sinaloa's governor and nine officials with aiding the cartel."), (5, "A former CBP officer got 9 years for a Sinaloa smuggling lane."),
           (4, "Rep. Cuellar (D) was indicted in 2024; President Trump pardoned him Dec 2, 2025.")],
    view=(2, 2))
S["defund-ice-is-the-tell"] = dict(
    card=("n", "32,000+", "unaccompanied children who missed immigration court, FY2019\u20132023 (DHS Inspector General)", 1), icon="child",
    facts=[(1, "The Inspector General found ICE could not monitor every released child."), (2, "DHS says ICE and HSI are working to locate the children."),
           (3, "Child sex trafficking is a federal felony (18 U.S.C. \u00a7 1591).")],
    view=(2, 1))
S["the-noise"] = dict(
    card=("n", "1997", "the last time Congress passed every money bill on time, per the Congressional Research Service", 0), icon="capitol",
    facts=[(0, "The 119th Congress still owes twelve money bills by October 1."), (1, "CRS: no on-time budget since fiscal 1997.")],
    view=(2, 2))
S["they-sold-the-split"] = dict(
    card=("q", "Stop selling the split. Debate the statute.", "Our view", None),
    facts=[(0, "The Supreme Court's test for incitement: speech directed to imminent lawless action.")],
    view=(1, 3))
S["full-time-or-go-home"] = dict(
    card=("n", "$7.258B", "legislative branch spending, fiscal 2026 (CRS / Pub. L. 119-37)", 0), icon="money",
    facts=[(0, "The legislative branch gets $7.258 billion in fiscal 2026."), (1, "CRS tracks member pay and benefits."), (2, "Members swear to discharge the duties of the office.")],
    view=(2, 2))
S["the-whole-bill"] = dict(
    card=("q", "Post the stack. Show the slides.", "Our view", None),
    facts=[(0, "Congress.gov lays out how a bill becomes law."), (1, "The 1974 Budget Act sets the budget calendar."), (2, "CBO scores what bills cost.")],
    view=(1, 4))
S["the-pool"] = dict(
    card=("q", "A pool seat is not a verdict, and a caption is not the recording.", "Our view", None),
    facts=[(4, "CNN v. Trump (2018): a press pass needs process."), (5, "The First Amendment protects the press.")],
    view=(3, 2))
S["sixty-percent"] = dict(
    card=("n", "440.9 kg", "of uranium enriched up to 60% U-235, as of June 13, 2025 (IAEA GOV/2026/50)", 1), icon="doc",
    facts=[(0, "IAEA: the only non-nuclear-weapon state to make uranium enriched to 60%."), (2, "IAEA had no access to verify that uranium for more than eight months."),
           (4, "State's 2024 terrorism report names Iran's money, training and weapons.")],
    view=(2, 3))
S["they-dont-debate-they-flag"] = dict(
    card=("q", "When they cannot beat the tape, they smear the person holding it.", "Our view", None),
    facts=[(0, "The First Amendment protects political speech.")],
    view=(3, 3))
S["division-is-the-product"] = dict(
    card=("q", "Honest people kept the country standing while a political class learned to treat them as a tap.", "Our view", None),
    facts=[(0, "Hannah Arendt, The Origins of Totalitarianism (full text).")],
    view=(3, 3))
S["the-record-not-the-rally"] = dict(
    card=("q", "Pause the clip. Name the job. Read down the names.", "Our view", None),
    facts=[(0, "CBP publishes southwest border encounters."), (1, "CBP's Border Patrol history, FY1960\u20132019."), (2, "The Laken Riley Act on Congress.gov.")],
    view=(2, 3))
S["the-republic-not-the-caption"] = dict(
    card=("q", "We the People, not a television panel and not a six-second clip.", "Our view", None),
    facts=[(0, "The Constitution is the operating manual."), (1, "Congress, the President and the courts have listed powers in Articles I, II and III.")],
    view=(2, 3))
S["they-clipped-the-tape"] = dict(
    card=("q", "should be condemned totally", "President Trump on neo-Nazis and white nationalists, same Aug. 15, 2017 remarks (White House transcript)", 8),
    facts=[(6, "\u201cBloodbath\u201d: the full Vandalia speech was about Chinese car plants and tariffs."), (9, "Schiff's Ukraine-call \u201cread\u201d is not in the call memo; he called it parody."),
           (3, "The full January 6 speech is on C-SPAN.")],
    view=(3, 4))
S["one-word"] = dict(
    card=("n", "0", "people charged under the federal insurrection statute (18 U.S.C. \u00a7 2383) for January 6; about 1,583 were federally charged with other crimes", 6), icon="scale",
    facts=[(3, "Durham: the FBI opened a full investigation without actual evidence of collusion."), (4, "Inspector General: 17 inaccuracies and omissions in the Carter Page FISA applications."),
           (7, "Oath Keepers and Proud Boys leaders were convicted of seditious conspiracy.")],
    view=(3, 4))
S["the-hire-is-the-country"] = dict(
    card=("n", "0", "January 6 charges under the insurrection statute, 18 U.S.C. \u00a7 2383 (USAO-DC tally)", 8), icon="scale",
    facts=[(0, "The Durham report is the record on Crossfire Hurricane."), (5, "H.Res. 755: the first impeachment."), (6, "H.Res. 24: the second impeachment.")],
    view=(1, 3))
S["they-ran-it-anyway"] = dict(
    card=("n", "17", "inaccuracies and omissions the Justice Department Inspector General found in the Carter Page FISA applications", 1), icon="doc",
    facts=[(0, "The Durham report found no actual evidence of collusion when the case opened."), (5, "Attorney General Barr's remarks on the Mueller report."),
           (7, "H.Res. 630 (2019) put House Republicans' charge in the Congressional Record.")],
    view=(2, 3))
S["they-called-it-protest"] = dict(
    card=("n", "6.5 \u2192 4.1", "murders per 100,000: 2020 vs. 2025, FBI data. 2025 ties 1955\u201356 as the lowest on record.", 3), icon="chart",
    facts=[(4, "The FBI's 2020 murder rate was 6.5 per 100,000."), (3, "The FBI puts 2025 at 4.1, the lowest since national estimates began."),
           (7, "Executive Order 14253 orders damaged federal monuments restored.")],
    chart=("Murders per 100,000 (FBI)", ["2020", "2025"], [6.5, 4.1], "", 3),
    view=(3, 2))
S["they-hold-it-by-the-blade"] = dict(
    card=("q", "They did not repeal the Constitution. They learned to use it as a weapon", "Our view", None),
    facts=[(2, "Speech or Debate (Art. I \u00a7 6) protects the floor."), (3, "Hutchinson v. Proxmire: a press release is not the chamber."),
           (1, "The insurrection statute was not filed for January 6; seditious conspiracy was.")],
    view=(2, 3))
S["they-published-the-replacement"] = dict(
    card=("q", "Workers Deserve More", "the Democratic Socialists of America's 2026 program, on its own site", 2),
    facts=[(0, "Seditious conspiracy requires a conspiracy to use force (18 U.S.C. \u00a7 2384)."), (1, "The Smith Act reaches advocating overthrow by force or violence."), (2, "DSA published its 2026 program.")],
    view=(1, 2))
S["the-recess-blockade"] = dict(
    card=("n", "10 days", "a recess shorter than this is presumptively too short for recess appointments (NLRB v. Noel Canning, 2014)", 0), icon="capitol",
    facts=[(0, "Noel Canning: the Senate is in session when it says it is, if it can do business."), (1, "The Recess Appointments Clause is Article II, Section 2, Clause 3.")],
    view=(1, 3))
S["the-funnel"] = dict(
    card=("n", "$1.4B", "FEMA grants to states, cities and nonprofits for migrant shelter and services, fiscal 2023\u201324 (DHS OIG-26-04)", 5), icon="money",
    facts=[(3, "USAID IG: about $36 million in 2024 West Bank and Gaza cash aid, with unidentified fraud risks."), (4, "USAID IG: $650 million across 18 awards, with selective partner vetting."),
           (7, "Federal rules forbid using a grant to lobby (2 CFR 200.450).")],
    view=(2, 3))
S["they-dont-write-the-bills"] = dict(
    card=("q", "All legislative Powers herein granted shall be vested in a Congress of the United States", "Constitution, Article I, Section 1", 0),
    facts=[(1, "The Lobbying Disclosure Act says paid lobbyists influence federal officials."), (2, "The Senate and House collect lobbying disclosures."), (0, "Article I gives Congress, not lobbyists, the power to legislate.")],
    view=(2, 3))
S["paying-the-taliban"] = dict(
    card=("n", "$10.9M+", "of U.S. taxpayer money paid to the Taliban-controlled government in taxes, utilities, fees and customs (SIGAR 24-22)", 4), icon="money",
    facts=[(1, "The U.S. put $3.83 billion into Afghanistan after the takeover, about 36% of all aid."), (3, "The UN flew more than $2.9 billion in U.S. currency into Afghanistan."),
           (5, "In August 2025 SIGAR called the delivery system broken.")],
    view=(2, 3))
S["fema-ran-two-jobs"] = dict(
    card=("n", "$1.45B", "CBP money Congress directed to FEMA for migrant Shelter and Services, FY2023\u201324 (DHS OIG-26-04)", 2), icon="money",
    facts=[(1, "Aug 29, 2023: FEMA's disaster fund had $3.4 billion left and restricted spending (CRS)."), (3, "GAO: after Helene and Milton, many helpline calls went unanswered."),
           (5, "Maui: $56.1 million in Individual Assistance to 7,141 people (FEMA).")],
    view=(2, 2))
S["the-7-billion-machine"] = dict(
    card=("n", "$7.258B", "legislative branch spending, fiscal 2026 (CRS / Pub. L. 119-37)", 2), icon="money",
    facts=[(0, "The House alone: $2.083 billion; each office's allowance about $1.85\u20132.09 million."), (3, "CRS tracks member salaries and allowances."), (8, "The 27th Amendment delays pay raises until after an election.")],
    view=(2, 4))
S["the-uniparty-mirror"] = dict(
    card=("q", "Cameras on: a fight. Cameras off: the same surveillance bill, the same blank check.", "Our view", None),
    facts=[(0, "The Fiscal Responsibility Act of 2023 raised the debt ceiling with votes from both parties."), (1, "FISA Section 702 was reauthorized on April 20, 2024 (RISAA)."),
           (2, "A short 702 extension passed (S. 4465); a longer one failed in the House on June 11.")],
    view=(2, 3))
S["how-the-house-was-captured"] = dict(
    card=("q", "Not a movie syndicate. A paying club. Both parties kept the books.", "Our view", None),
    facts=[(0, "The Senate publishes lobbying disclosures.")],
    view=(3, 2))
S["what-the-democratic-party-became"] = dict(
    card=("q", "A party is a tool. When the tool stops serving the people who built it, name the date.", "Our view", None),
    facts=[(0, "The 1964 Civil Rights Act, on Congress.gov.")],
    view=(2, 3))
S["what-the-republican-party-became"] = dict(
    card=("q", "A jersey is not a receipt. Read the roll call.", "Our view", None),
    facts=[(0, "Treasury's Debt to the Penny shows the debt under every party.")],
    view=(2, 3))
S["why-the-lobby-should-be-illegal"] = dict(
    card=("q", "Paid influence is not speech. It is a second government the people did not hire.", "Our view", None),
    facts=[(0, "The Lobbying Disclosure Act of 1995, Pub. L. 104-65."), (1, "Its findings are in 2 U.S.C. \u00a7 1601."), (2, "Senate lobbying filings.")],
    view=(2, 3))
S["why-he-became-the-enemy"] = dict(
    card=("n", "237,538", "southwest Border Patrol apprehensions in fiscal 2025, the lowest since 1970 (CBP)", 1), icon="shield",
    facts=[(0, "EIA: U.S. crude production hit a record 13.83 million barrels a day in 2026."), (2, "The Laken Riley Act became Public Law 119-1 on January 29, 2025."), (4, "The Durham report.")],
    view=(3, 3))
S["the-file-on-the-man"] = dict(
    card=("q", "Overlapping cases, a rifle, and a newscast. The point was to make a revolt look like a fever.", "Our view", None),
    facts=[(0, "The Durham report on Crossfire Hurricane.")],
    view=(3, 4))
S["what-he-told-them"] = dict(
    card=("q", "Globalists at the UN. The Taliban on the lawn. Iran in public. Not a staffer\u2019s memo.", "Our view", None),
    facts=[(0, "The Doha agreement of February 29, 2020 set a withdrawal calendar tied to cutting off al-Qaeda."), (1, "His 2019 UN speech: patriots, not globalists (White House archive).")],
    view=(0, 1))
S["the-word-that-never-made-the-docket"] = dict(
    card=("n", "\u00a7 2383", "the federal insurrection statute. Search the January 6 docket: it was not charged.", 0), icon="scale",
    facts=[(1, "Some group leaders were charged with seditious conspiracy (\u00a7 2384), a separate crime."), (3, "DOJ's statement on the Ashli Babbitt shooting."), (0, "18 U.S.C. \u00a7 2383: rebellion or insurrection.")],
    view=(1, 3))
S["this-congress-cannot-police-itself"] = dict(
    card=("q", "They work for us. They do not get to grade their own homework.", "Our view", None),
    facts=[(0, "U.S. Term Limits v. Thornton (1995): states cannot term-limit Congress."), (1, "Article V: how the Constitution is amended."), (2, "The STOCK Act of 2012.")],
    view=(2, 3))
S["not-a-part-time-job"] = dict(
    card=("n", "$174,000", "base salary of a rank-and-file member of Congress (CRS)", 2), icon="money",
    facts=[(1, "Fiscal 2026 legislative branch: $7.258 billion."), (3, "Congress.gov publishes the days in session."), (2, "CRS tracks congressional pay.")],
    view=(2, 2))
S["what-we-can-do"] = dict(
    card=("q", "A protest that stays peaceful is the republic working. A riot is their caption.", "Our view", None),
    facts=[(1, "The First Amendment: speech, press, peaceful assembly, petition."), (2, "Article I, Section 5: each chamber can punish and expel members."), (3, "Article V: amendments.")],
    view=(2, 3))
S["the-debt-they-will-not-close"] = dict(
    card=("n", "FY1997", "the last year all regular appropriations were enacted on time, by October 1 (CRS)", 1), icon="money",
    facts=[(0, "Treasury's Debt to the Penny is the government's own meter."), (1, "CRS: FY1997 was the last on-time package."), (2, "5 U.S.C. \u00a7 3331 is the oath of office.")],
    view=(2, 2))
S["a-caption-cannot-be-outlawed"] = dict(
    card=("q", "The mic stays on the tape. The mute button stays off.", "Our view", None),
    facts=[(0, "Brandenburg v. Ohio is the Supreme Court's incitement test."), (1, "Article I, Section 5: Congress can punish its own members.")],
    view=(2, 3))
S["the-floor-not-the-feed"] = dict(
    card=("q", "Speech or Debate is a shield for the chamber. It is not a license for the rant.", "Our view", None),
    facts=[(0, "Article I, Section 6: the Speech or Debate Clause."), (1, "Hutchinson v. Proxmire (1979): newsletters and press releases are not protected."), (2, "Gravel v. United States (1972).")],
    view=(1, 3))
S["the-law-they-dont-mention"] = dict(
    card=("q", "The real sequence is longer, and the catch is usually in the annex.", "Our view", None),
    facts=[(0, "Congress.gov: how a bill becomes law."), (1, "CRS on omnibus bills and continuing resolutions.")],
    view=(2, 3))
S["the-caption-was-not-the-charge"] = dict(
    card=("n", "0", "January 6 defendants charged under the insurrection statute, 18 U.S.C. \u00a7 2383", 2), icon="scale",
    facts=[(3, "Seditious conspiracy (\u00a7 2384) was charged against some group leaders."), (5, "H.Res. 503 created the January 6 select committee."),
           (0, "The Attorney General's Oct. 4, 2021 school-board memo was rescinded on February 5, 2025.")],
    view=(2, 3))
S["a-war-on-americans"] = dict(
    card=("n", "34", "felony counts in the Manhattan case, People v. Trump (NY courts)", 1), icon="scale",
    facts=[(3, "The Adult Survivors Act was sponsored by State Sen. Hoylman and Assemblymember Rosenthal."), (4, "The $5 million Carroll judgment was affirmed; the Supreme Court declined review in 2026."),
           (9, "Georgia: the case was abandoned.")],
    view=(0, 1))
S["the-statute-is-the-end"] = dict(
    card=("n", "275 vs. 19", "assaults on ICE officers, Jan 20\u2013Dec 31, 2025 vs. the same stretch of 2024 (DHS)", 1), icon="shield",
    facts=[(2, "Assaulting a federal officer is a crime (18 U.S.C. \u00a7 111)."), (3, "Publishing an officer's home address to enable threats is a crime (18 U.S.C. \u00a7 119)."),
           (6, "June 23, 2026: eight people sentenced in the Prairieland attack (DOJ).")],
    chart=("Assaults on ICE officers, Jan 20\u2013Dec 31 (DHS)", ["2024", "2025"], [19, 275], "int", 1),
    view=(3, 3))
S["the-media-ledger"] = dict(
    card=("q", "no incriminating client list", "Justice Department and FBI memorandum, July 2025", 0),
    facts=[(8, "The medical examiner ruled Epstein's death a suicide; the DOJ/FBI review found no evidence of murder."), (1, "Brandenburg v. Ohio, 395 U.S. 444, is the incitement test."),
           (3, "Committee on House Administration: its notice of the January 6 tape releases.")],
    view=(2, 3))
S["the-democrat-ledger"] = dict(
    card=("n", "10.83M", "CBP nationwide encounters, FY2021\u201324, while officials said the border was secure", 1), icon="shield",
    facts=[(0, "\u201cI will not pardon my son.\u201d He pardoned him (DOJ pardon record)."), (3, "The Attorney General's Oct. 4, 2021 memo on school-board threats."),
           (4, "CPI-U inflation peaked at 9.1% in June 2022 (BLS).")],
    view=(3, 1))
S["the-republican-ledger"] = dict(
    card=("q", "A correction that only runs one direction is not a correction.", "Our view", None),
    facts=[(0, "\u201cI will release my tax returns.\u201d He did not; the 2020 leak was a crime, and the leaker was sentenced."), (1, "\u201cThe party of the balance sheet\u201d: the debt rose by trillions in the first term (Treasury).")],
    view=(1, 2))
S["the-line-in-the-sand"] = dict(
    card=("q", "535 people do not outrank 300 million. They work here. They do not own it.", "Our view", None),
    facts=[(0, "The SAVE Act (H.R. 22 / S. 128) would require documentary proof of citizenship to register.")],
    view=(2, 3))
