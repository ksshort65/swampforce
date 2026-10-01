import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DECEPTION } from "../data/deception";
import newsEvidence from "../data/fake-news-evidence.json";
import factCheckerVetting from "../data/fact-checker-vetting.json";
import fakeNewsCases from "../data/fake-news-cases.json";
import senateHearings from "../data/senate-hearings.json";
import politicalStatements from "../data/political-statements.json";
import lawfareCases from "../data/lawfare-cases.json";
import houseEthicsMatters from "../data/house-ethics-matters.json";
import donutRecords from "../data/betrayal-donut-records.json";

export const Route = createFileRoute("/betrayal")({ component: Betrayal });

type Layer = "root" | "fake" | "fcc" | "press" | "codes" | "cable" | "mechanics" | "types" | "evidence" | "lawfare" | "trials" | "impeach" | "citizen" | "bail" | "scrutiny" | "attempts" | "first100";

const LAYERS: Record<Exclude<Layer, "root">, { back: Layer; title: string; buttons: string[] }> = {
  fake: {
    back: "root",
    title: "Fake News",
    buttons: ["Types of deception", "Charts"],
  },
  fcc: {
    back: "fake",
    title: "FCC rules",
    buttons: [],
  },
  press: {
    back: "fake",
    title: "Journalist code of ethics",
    buttons: [],
  },
  codes: {
    back: "fake",
    title: "Ethics codes",
    buttons: [],
  },
  cable: {
    back: "fake",
    title: "Cable news",
    buttons: [],
  },
  types: {
    back: "fake",
    title: "Types of Deception",
    buttons: [
      "Network deception",
      "Journalists",
      "Politicians deceptions",
      "Social media warfare",
      "Fact-checkers",
    ],
  },
  mechanics: {
    back: "fake",
    title: "Understanding the Mechanics of Fake News",
    buttons: [],
  },
  evidence: {
    back: "fake",
    title: "Fake News Evidence",
    buttons: [],
  },
  lawfare: {
    back: "root",
    title: "Lawfare",
    buttons: [
      "Trump Trials",
      "Impeachments",
      "US Citizen Lawfare",
      "Politicians' bail funds",
      "Scrutiny compared",
      "Assassination attempts",
      "First 100 days",
      "Lawfare Evidence",
      "House",
      "Senate",
    ],
  },
  trials: {
    back: "lawfare",
    title: "Trump Trials",
    buttons: [
      "NY civil fraud",
      "Manhattan criminal",
      "Classified documents",
      "Jan. 6 federal",
      "Georgia",
      "State ballot cases",
      "Carroll",
      "Immunity",
    ],
  },
  impeach: {
    back: "lawfare",
    title: "Impeachments",
    buttons: ["First, 2019", "Second, 2021", "Clinton, 1998"],
  },
  citizen: {
    back: "lawfare",
    title: "US Citizen Lawfare",
    buttons: ["Fischer", "Committee referrals"],
  },
  bail: {
    back: "lawfare",
    title: "Politicians' bail funds",
    buttons: [],
  },
  scrutiny: { back: "lawfare", title: "Scrutiny compared", buttons: [] },
  attempts: { back: "lawfare", title: "Assassination attempts", buttons: [] },
  first100: { back: "lawfare", title: "First 100 days", buttons: [] },
};

const NEXT: Record<string, Layer> = {
  "Fake News": "fake",
  "Types of deception": "types",
  Lawfare: "lawfare",
  "Trump Trials": "trials",
  Impeachments: "impeach",
  "US Citizen Lawfare": "citizen",
  "Politicians' bail funds": "bail",
  "Scrutiny compared": "scrutiny",
  "Assassination attempts": "attempts",
  "First 100 days": "first100",
};

const METHODS: {
  name: string;
  info: string;
  evidence: { label: string; href?: string }[];
}[] = [
  {
    name: "Agenda-setting",
    info: "News does not just tell people what to think. It tells them what to think about. Issue emphasis in the press matched what voters called important.",
    evidence: [{ label: "McCombs and Shaw, 1972", href: "https://doi.org/10.1086/267990" }],
  },
  {
    name: "Framing",
    info: "The slice of reality that is highlighted leads the audience to a preferred conclusion, even when the words shown are technically accurate.",
    evidence: [
      {
        label: "Tversky and Kahneman, Science, 1981",
        href: "https://gwern.net/doc/psychology/1981-tversky.pdf",
      },
      { label: "Entman, 1993", href: "https://doi.org/10.1111/j.1460-2466.1993.tb01304.x" },
    ],
  },
  {
    name: "Priming",
    info: "Once an issue is on the mental agenda, people use it as the yardstick for leaders and opponents.",
    evidence: [{ label: "Iyengar and Kinder, News That Matters, 1987", href: "https://psycnet.apa.org/record/1987-98488-000" }],
  },
  {
    name: "Illusory truth",
    info: "A statement heard again and again starts to feel true, even when people already know better.",
    evidence: [
      {
        label: "Nature Communications, 2026, review of 182 studies",
        href: "https://www.nature.com/articles/s41467-026-70041-x",
      },
      { label: "Hasher, Goldstein and Toppino, 1977", href: "https://doi.org/10.1016/S0022-5371(77)80012-1" },
    ],
  },
  {
    name: "Anchoring",
    info: "Early numbers pull later judgments toward them.",
    evidence: [{ label: "Tversky and Kahneman, 1974", href: "https://doi.org/10.1126/science.185.4157.1124" }],
  },
  {
    name: "Contextomy",
    info: "Cutting the words so the remainder means something the speaker did not say. The shortened quote sticks after the full context is restored.",
    evidence: [{ label: "McGlone, 2005", href: "https://doi.org/10.1111/j.1460-2466.2005.tb02675.x" }],
  },
  {
    name: "Paltering",
    info: "Misleading with statements that are technically true. In a negotiation study, people often preferred this to an outright lie, and the target still felt deceived. The study did not test a news report.",
    evidence: [{ label: "Rogers, Zeckhauser, Gino, Norton and Schweitzer, 2017", href: "https://doi.org/10.1037/pspi0000081" }],
  },
  {
    name: "Omission",
    info: "Leaving out the fact that would change the meaning.",
    evidence: [
      { label: "Rogers and colleagues, 2017", href: "https://doi.org/10.1037/pspi0000081" },
      { label: "The architecture of misleading, 2025", href: "https://doi.org/10.5565/rev/analisi.3884" },
    ],
  },
  {
    name: "Gaslighting",
    info: "Political gaslighting leads citizens to doubt the sources of their own evidence.",
    evidence: [{ label: "Beerbohm and Davis, American Journal of Political Science, 2021", href: "https://doi.org/10.1111/ajps.12678" }],
  },
  {
    name: "Confirmation bias",
    info: "People seek and overweight information that fits what they already believe. Journalists’ own beliefs correlated with their news decisions.",
    evidence: [
      { label: "Nickerson, 1998", href: "https://doi.org/10.1037/1089-2680.2.2.175" },
      { label: "Patterson and Donsbach, 1996", href: "https://doi.org/10.1080/10584609.1996.9963131" },
    ],
  },
  {
    name: "Motivated reasoning",
    info: "Wanting a side to win or lose steers what counts as convincing. Corrections frequently fail for the group that already holds the belief, and sometimes make it stronger.",
    evidence: [
      { label: "Kunda, 1990", href: "https://doi.org/10.1037/0033-2909.108.3.480" },
      { label: "Nyhan and Reifler, 2010", href: "https://doi.org/10.1007/s11109-010-9112-2" },
    ],
  },
  {
    name: "Continued influence",
    info: "People keep relying on retracted information after it has been corrected. The first blast outruns the fix.",
    evidence: [{ label: "Johnson and Seifert, 1994", href: "https://doi.org/10.1037/0278-7393.20.6.1420" }],
  },
];

const TOPICS: {
  topic: string;
  voluntary?: boolean;
  items: { line: string; sources: { label: string; href: string; note?: string }[] }[];
}[] = [
  {
    topic: "Riots and assembly",
    items: [
      {
        line: "Violent riots",
        sources: [
          {
            label: "Major Cities Chiefs, 2020 protests and civil unrest",
            href: "https://majorcitieschiefs.com/wp-content/uploads/2021/01/MCCA-Report-on-the-2020-Protest-and-Civil-Unrest.pdf",
            note: "Major Cities Chiefs Association, October 2020. About 8,700 protests in 68 major cities and counties in the United States and Canada, May 25 to July 31, 2020. 574 protests, 7 percent, involved violence. The report says the overwhelming majority were peaceful or nonviolent civil disobedience.",
          },
        ],
      },
      {
        line: "Protesters attacking law enforcement",
        sources: [
          {
            label: "Major Cities Chiefs, officers injured",
            href: "https://majorcitieschiefs.com/wp-content/uploads/2021/01/MCCA-Report-on-the-2020-Protest-and-Civil-Unrest.pdf",
            note: "The same report says more than 2,000 officers were injured, and about 72 percent of major-city agencies had officers harmed.",
          },
        ],
      },
      {
        line: "The right is only to assemble peacefully",
        sources: [
          {
            label: "First Amendment, peaceably to assemble",
            href: "https://constitution.congress.gov/constitution/amendment-1/",
          },
        ],
      },
    ],
  },
  {
    topic: "The vote",
    items: [
      {
        line: "The right of citizens of the United States to vote shall not be denied or abridged on account of race, on account of sex, for failure to pay a poll tax, or, at eighteen or older, on account of age.",
        sources: [
          {
            label: "15th Amendment",
            href: "https://constitution.congress.gov/constitution/amendment-15/",
            note: "The right of citizens of the United States to vote shall not be denied or abridged on account of race.",
          },
          {
            label: "19th Amendment",
            href: "https://constitution.congress.gov/constitution/amendment-19/",
            note: "The right of citizens of the United States to vote shall not be denied or abridged on account of sex.",
          },
          {
            label: "24th Amendment",
            href: "https://constitution.congress.gov/constitution/amendment-24/",
            note: "The right of citizens of the United States to vote shall not be denied or abridged by reason of failure to pay a poll tax.",
          },
          {
            label: "26th Amendment",
            href: "https://constitution.congress.gov/constitution/amendment-26/",
            note: "The right of citizens of the United States, who are eighteen years of age or older, to vote shall not be denied or abridged on account of age.",
          },
        ],
      },
      {
        line: "Diluting the weight of a citizen’s vote, in unequal legislative districts, denies the right as effectively as prohibiting it.",
        sources: [
          {
            label: "Reynolds v. Sims",
            href: "https://www.law.cornell.edu/supremecourt/text/377/533",
            note: "The Court held that diluting the weight of a citizen’s vote, in a case about unequal legislative districts, denies the right as effectively as prohibiting it. The case did not decide an ineligible voter.",
          },
        ],
      },
      {
        line: "A noncitizen voting for federal office",
        sources: [
          {
            label: "18 U.S.C. § 611",
            href: "https://www.law.cornell.edu/uscode/text/18/611",
            note: "Voting by an alien. It is a federal crime for an alien to vote for President, Vice President, Senator, or Representative. The penalty is a fine, up to one year in prison, or both.",
          },
        ],
      },
      {
        line: "A false claim of citizenship to register or vote",
        sources: [
          {
            label: "18 U.S.C. § 1015",
            href: "https://www.law.cornell.edu/uscode/text/18/1015",
            note: "A false claim of citizenship in order to register to vote, or to vote, is a crime. The penalty is a fine, up to five years in prison, or both.",
          },
        ],
      },
      {
        line: "Knowingly submitting a false registration",
        sources: [
          {
            label: "52 U.S.C. § 20511",
            href: "https://www.law.cornell.edu/uscode/text/52/20511",
            note: "A person, including an election official, commits a crime by knowingly and willfully submitting or procuring a voter registration application the person knows is materially false. The same section covers a ballot the person knows is materially false. The penalty is a fine, up to five years in prison, or both. The statute requires knowledge. It does not make an unknowing mistake a crime.",
          },
        ],
      },
      {
        line: "Encouraging a false registration or illegal vote",
        sources: [
          {
            label: "52 U.S.C. § 10307",
            href: "https://www.law.cornell.edu/uscode/text/52/10307",
            note: "Knowingly giving false information in order to register, or conspiring to encourage false registration or illegal voting, is a crime. The penalty is a fine of up to $10,000, up to five years in prison, or both.",
          },
        ],
      },
      {
        line: "Aiding that crime",
        sources: [
          {
            label: "18 U.S.C. § 2",
            href: "https://www.law.cornell.edu/uscode/text/18/2",
            note: "Whoever aids, abets, counsels, commands, induces, or procures a federal crime, including a false registration, is punishable as a principal.",
          },
        ],
      },
    ],
  },
  {
    topic: "Oath and duty",
    items: [
      {
        line: "The oath to faithfully discharge the office",
        sources: [
          {
            label: "5 U.S.C. § 3331",
            href: "https://www.law.cornell.edu/uscode/text/5/3331",
            note: "The oath requires the officer to faithfully discharge the duties of the office.",
          },
        ],
      },
      {
        line: "The oath of Senators and Representatives",
        sources: [
          {
            label: "5 U.S.C. § 3331, Congress",
            href: "https://www.law.cornell.edu/uscode/text/5/3331",
            note: "Article VI requires Senators and Representatives to swear to support the Constitution. The Senate states that the words they recite are the oath in 5 U.S.C. § 3331. That statute excepts the President.",
          },
        ],
      },
      {
        line: "The presidential oath",
        sources: [
          {
            label: "Article II",
            href: "https://constitution.congress.gov/browse/article-2/section-1/",
            note: "The President swears to faithfully execute the office and to preserve, protect, and defend the Constitution.",
          },
        ],
      },
      {
        line: "The duty to represent We the People",
        sources: [
          {
            label: "Article I, duties of Congress",
            href: "https://constitution.congress.gov/browse/article-1/section-1/",
            note: "All legislative powers granted by the Constitution are vested in Congress, a Senate and a House of Representatives.",
          },
          {
            label: "Preamble, We the People",
            href: "https://constitution.congress.gov/constitution/preamble/",
          },
          {
            label: "Article VI",
            href: "https://constitution.congress.gov/browse/article-6/",
            note: "Senators and Representatives shall be bound by oath or affirmation to support this Constitution.",
          },
        ],
      },
    ],
  },
  {
    topic: "Civil rights",
    items: [
      {
        line: "The First Amendment",
        sources: [
          {
            label: "First Amendment",
            href: "https://constitution.congress.gov/constitution/amendment-1/",
          },
        ],
      },
    ],
  },
  {
    topic: "Broadcast stations",
    items: [
      {
        line: "Deliberate distortion of a broadcast news report",
        sources: [
          {
            label: "FCC news distortion policy",
            href: "https://www.fcc.gov/broadcast-news-distortion",
            note: "The FCC policy covers over-the-air broadcast stations only. It reaches deliberate distortion of a significant event. Cable news networks, newspapers, and social media are outside that rule. The FCC does not police ordinary error or opinion.",
          },
        ],
      },
    ],
  },
  {
    topic: "Media and journalist codes of ethics",
    voluntary: true,
    items: [
      {
        line: "Society of Professional Journalists",
        sources: [
          {
            label: "Society of Professional Journalists Code of Ethics",
            href: "https://www.spj.org/spj-code-of-ethics/",
            note: "The Society of Professional Journalists says seek truth and report it, and that deliberate distortion is never permissible. It is voluntary.",
          },
        ],
      },
      {
        line: "Radio Television Digital News Association",
        sources: [
          {
            label: "Radio Television Digital News Association Code of Ethics",
            href: "https://www.rtdna.org/ethics",
            note: "The Radio Television Digital News Association says journalism’s obligation is to the public, and that it exists so people can make more informed decisions. It is voluntary, not a criminal statute.",
          },
        ],
      },
      {
        line: "A network’s own standard",
        sources: [
          {
            label: "CBS News publishing principles",
            href: "https://www.cbsnews.com/news/cbs-news-publishing-principles/",
            note: "CBS News states a mission to help Americans understand events, and a corrections policy when a report is wrong. It is voluntary.",
          },
        ],
      },
    ],
  },
];

const RESULTS = TOPICS.flatMap((group) => group.items);

const EFFECTS: { line: string; label: string; href: string; note: string }[] = [
  {
    line: "A claim heard again and again starts to feel true, even when a person already knows better.",
    label: "Nature Communications, 2026",
    href: "https://www.nature.com/articles/s41467-026-70041-x",
    note: "A review of studies on the illusory truth effect. Repetition shapes belief. This paper does not measure riots, elections, or an oath.",
  },
  {
    line: "The slice of the story that is shown changes the conclusion people reach.",
    label: "Tversky and Kahneman, Science, 1981",
    href: "https://gwern.net/doc/psychology/1981-tversky.pdf",
    note: "Framing changes choices. This paper is a decision study. It is not a finding about a later riot or election.",
  },
  {
    line: "A feed ranked by likes and shares pumps anger at the other side.",
    label: "Science",
    href: "https://www.science.org/doi/10.1126/science.adu5584",
    note: "This study is about ranking a feed. It finds more anger at the other side. It does not find that a news caption caused a riot.",
  },
  {
    line: "Trust in newspapers, television, and radio to report fully, accurately, and fairly was measured at 28 percent, a new low.",
    label: "Gallup",
    href: "https://news.gallup.com/poll/695762/trust-media-new-low.aspx",
    note: "Gallup measured trust. It did not measure a Nation in chaotic distress, and it did not name a cause.",
  },
];

const JOURNAL_RULES: {
  name: string;
  info: string;
  evidence: { label: string; href?: string; note: string }[];
}[] = [
  {
    name: "SPJ code",
    info: "Voluntary. The reason: the Society says the code is not a set of rules and is not legally enforceable. No rule number. No page number. Revised September 6, 2014. Integrity, under Seek Truth and Report It: verify before releasing it. Deceptive reporting, same heading: never deliberately distort facts or context, including visual information. Corrections, under Be Accountable and Transparent: correct a mistake promptly and prominently.",
    evidence: [
      {
        label: "SPJ Code of Ethics, 2014",
        href: "https://www.spj.org/spj-code-of-ethics/",
        note: "Voluntary. The reason: no rule number and no page number. Revised September 6, 2014. The code says it is not legally enforceable. Integrity is under Seek Truth and Report It. Deceptive reporting is the line that begins Never deliberately distort facts or context.",
      },
      {
        label: "SPJ, why it does not enforce it",
        href: "https://www.spj.org/ethics-frequently-asked-questions/",
        note: "Voluntary. The reason: the Society says the code is voluntary, and it has no way to investigate a complaint or discipline a journalist.",
      },
      {
        label: "SPJ, do journalists have to follow it",
        href: "https://www.spj.org/journalism-ethics-faq/",
        note: "Voluntary. The reason: the Society says ethics codes are not legally binding and are not required in order to produce journalism.",
      },
    ],
  },
  {
    name: "RTDNA code",
    info: "Does not say it is voluntary. The reason: the code says it does not dictate the decision, and it does not say it is legally enforceable. No rule number. Adopted June 11, 2015. Integrity, bookmark page 1: truth and accuracy above all. That page does not contain the deception line. Deceptive reporting is on the web page only: deception in newsgathering conflicts with the commitment to truth, and staging can fool the audience.",
    evidence: [
      {
        label: "RTDNA Code of Ethics, 2015",
        href: "https://www.rtdna.org/ethics",
        note: "Does not say it is voluntary. The reason: no rule number and no page number. Adopted June 11, 2015. The deception and staging lines are on this page. The one-page bookmark does not contain them.",
      },
    ],
  },
  {
    name: "U.S. Code",
    info: "No accuracy statute. The reason: no section of the U.S. Code requires the press to be accurate, honest, or to correct a false report. The First Amendment is the right, and it is not a Code section. 42 U.S.C. § 2000aa limits a newsroom search. It does not require the news to be true. There is no federal shield law. Branzburg v. Hayes, 408 U.S. 665 (1972), held that a reporter may not refuse a grand jury on First Amendment grounds. Reuters, August 4, 2026, is rated misleading. The reason: it stated 75 of 93 and did not publish the cases.",
    evidence: [
      {
        label: "First Amendment",
        href: "https://constitution.congress.gov/constitution/amendment-1/",
        note: "Not an accuracy rule. The reason: this is the Constitution, not the U.S. Code. It bars a law that abridges freedom of the press. It does not require a news report to be true.",
      },
      {
        label: "42 U.S.C. § 2000aa",
        href: "https://www.law.cornell.edu/uscode/text/42/2000aa",
        note: "Not an accuracy rule. The reason: it limits a criminal search of a journalist's work product. It does not require the news to be true.",
      },
      {
        label: "Reuters, August 4, 2026",
        href: "https://www.reuters.com/legal/government/trump-vowed-bring-free-speech-back-judges-75-cases-ruled-that-he-has-stifled-it-2026-08-04/",
        note: "Rated misleading. The reason: Reuters stated a precise total, 75 of 93, and did not publish the cases. A count with no list cannot be checked. The search was in Westlaw, and Thomson Reuters owns both Westlaw and Reuters. Two named rulings are real. They do not prove the other 73, and they do not prove the total. Some of the 75 were preliminary. In appeals of 15 of the 75, a higher court paused or overturned the ruling. The headline reads as 75 established violations. That is stronger than the article.",
      },
      {
        label: "Perkins Coie, May 2, 2025",
        href: "https://www.jurist.org/news/2025/05/us-judge-rules-trump-order-against-law-firm-perkins-coie-unconstitutional/",
        note: "Real ruling. The reason: Judge Beryl Howell found the Perkins Coie order violated the First Amendment. One ruling does not prove the other 73, and it does not prove the total of 75.",
      },
      {
        label: "Judge Young, September 30, 2025",
        href: "https://www.nytimes.com/2025/09/30/us/politics/student-speech-palestinians-ruling.html",
        note: "Real ruling. The reason: Judge William G. Young ruled that targeting noncitizen students and faculty for pro-Palestinian advocacy violated the First Amendment. One ruling does not prove the total of 75.",
      },
    ],
  },
];

const CODE_RULES: {
  name: string;
  info: string;
  evidence: { label: string; href?: string; note: string }[];
}[] = [
  {
    name: "NPR handbook",
    info: "Binds NPR only. The reason: the handbook says it binds NPR editorial staff. It does not bind another network. No rule number. No page number. Integrity is the section titled Accuracy: a fact must be correct and in context. Deceptive reporting is the section titled Honesty: edit and present information without deception.",
    evidence: [
      {
        label: "NPR Ethics Handbook",
        href: "https://www.npr.org/ethics",
        note: "Binds NPR only. The reason: no rule number and no page number. Integrity is the section titled Accuracy. Deceptive reporting is the section titled Honesty. It does not bind another network.",
      },
    ],
  },
  {
    name: "CBS News",
    info: "Company rules, not a national code. The reason: the page does not say the rules are voluntary, and it does not state a ban on deceptive reporting. No rule number. No page number. Updated July 24, 2025. Integrity: fair, unbiased, fact-based reporting. A correction of an online story is an editor's note at the bottom.",
    evidence: [
      {
        label: "CBS News publishing principles",
        href: "https://www.cbsnews.com/news/cbs-news-publishing-principles/",
        note: "Company rules. The reason: no rule number and no page number. Updated July 24, 2025. The page does not state a ban on deceptive reporting. A correction online is an editor's note at the bottom.",
      },
    ],
  },
  {
    name: "ABC News",
    info: "Company policy. The reason: Disney requires ABC News employees to follow it, and the full standards book is not public. No rule number. Integrity is on page 1 of the May 23, 2025 brief. The brief does not state a rule against distorting a report. Corrections are on page 2.",
    evidence: [
      {
        label: "Disney journalistic integrity, 2025",
        href: "https://impact.disney.com/app/uploads/2025/05/Journalistic-Integrity-Topic-Brief.pdf",
        note: "Company policy. The reason: no rule number. Integrity is on page 1. Corrections are on page 2. This brief does not state a rule against distorting a report. The full standards book is not public.",
      },
    ],
  },
  {
    name: "No public code",
    info: "No code found. The reason: no public handbook was found for NBC News or for podcasts as an industry, so integrity and deceptive reporting are not stated. A journalistic podcast is pointed back to the SPJ code, which is voluntary.",
    evidence: [
      {
        label: "What was searched",
        note: "No code found. The reason: no public handbook was found for NBC News or for podcasts as an industry. A journalistic podcast is pointed back to the SPJ code, which is voluntary.",
      },
    ],
  },
];

const FCC_RULES: {
  name: string;
  info: string;
  evidence: { label: string; href?: string; note: string }[];
}[] = [
  {
    name: "News distortion",
    info: "Not a federal crime. The reason: the policy has no rule number in the Code of Federal Regulations. It covers a licensed station only. A violation requires deliberate distortion of a significant event, plus outside evidence of intent. A mistake or an editing dispute is not a violation. FCC page, July 18, 2024. No page number.",
    evidence: [
      {
        label: "FCC news distortion policy",
        href: "https://www.fcc.gov/broadcast-news-distortion",
        note: "Not a federal crime. The reason: the July 18, 2024 page requires deliberate distortion plus outside evidence of intent. A mistake or an editing dispute is not a violation. Cable is outside the policy.",
      },
      {
        label: "Serafyn v. FCC, 1998",
        href: "https://law.resource.org/pub/us/case/reporter/F3/149/149.F3d.1213.95-1608.95-1440.95-1385.html",
        note: "Not a federal crime by disagreement. The reason: 149 F.3d 1213 (D.C. Cir. 1998) requires the distortion to be deliberate. Disagreeing with the report is not enough.",
      },
    ],
  },
  {
    name: "Broadcast hoax",
    info: "A numbered rule. The reason: 47 CFR § 73.1217 forbids a known false report of a crime or a catastrophe only when serious public harm is foreseeable and happens at once. A clear notice that the program is fiction is presumed not to pose that harm. The rule page has no page number.",
    evidence: [
      {
        label: "47 CFR § 73.1217",
        href: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-73/subpart-H/section-73.1217",
        note: "A numbered rule. The reason: all three parts of 47 CFR § 73.1217 are required. A clear notice that the program is fiction is presumed not to pose that harm.",
      },
      {
        label: "Los Angeles Times, 1991",
        href: "https://www.latimes.com/archives/la-xpm-1991-05-20-ca-1596-story.html",
        note: "The Times reported a $25,000 fine against a St. Louis station for a fake nuclear warning, and an FCC investigation of KROQ-FM for a phony murder confession. Those events led to the rule.",
      },
    ],
  },
  {
    name: "No censorship",
    info: "Does not require the truth. The reason: 47 U.S.C. § 326 bars the FCC from censoring a broadcast. It does not require a news report to be true. It covers a licensed station, not cable, a podcast, or a website. No page number.",
    evidence: [
      {
        label: "47 U.S.C. § 326",
        href: "https://www.law.cornell.edu/uscode/text/47/326",
        note: "Does not require the truth. The reason: the statute says the FCC shall not censor a broadcast. It does not require a news report to be true.",
      },
    ],
  },
  {
    name: "Equal time",
    info: "Not an accuracy rule. The reason: 47 U.S.C. § 315 gives other candidates equal opportunity if a licensed station lets one candidate use the station. A bona fide newscast is exempt. It does not require the news to be true. No page number.",
    evidence: [
      {
        label: "47 U.S.C. § 315",
        href: "https://www.law.cornell.edu/uscode/text/47/315",
        note: "Not an accuracy rule. The reason: the duty is equal opportunity for candidates. It is not a rule that the news must be true.",
      },
    ],
  },
  {
    name: "Who paid",
    info: "A disclosure rule. The reason: 47 U.S.C. § 317 requires a station to announce who paid for a paid broadcast. It does not require the news to be accurate. No page number.",
    evidence: [
      {
        label: "47 U.S.C. § 317",
        href: "https://www.law.cornell.edu/uscode/text/47/317",
        note: "A disclosure rule. The reason: the station must announce who paid. The statute does not forbid a false news report.",
      },
    ],
  },
  {
    name: "Public stations",
    info: "Not an accuracy rule. The reason: 47 U.S.C. § 399 says a noncommercial educational station may not support or oppose a candidate. The ban on editorializing was removed in 1988. It does not require the news to be true. No page number.",
    evidence: [
      {
        label: "47 U.S.C. § 399",
        href: "https://www.law.cornell.edu/uscode/text/47/399",
        note: "Not an accuracy rule. The reason: the statute is one sentence. A noncommercial educational station may not support or oppose a candidate. It does not require the news to be true.",
      },
    ],
  },
  {
    name: "Fairness Doctrine",
    info: "Not a current rule. The reason: the FCC stopped enforcing the duty to offer contrasting views in 1987, and the D.C. Circuit left that decision in place in 1989.",
    evidence: [
      {
        label: "Syracuse Peace Council v. FCC, 1989",
        href: "https://www.courtlistener.com/opinion/7909169/syracuse-peace-council-v-federal-communications-commission/",
        note: "Not a current rule. The reason: 867 F.2d 654 (D.C. Cir. 1989) left in place the FCC decision to stop enforcing the Fairness Doctrine.",
      },
    ],
  },
];

const CABLE_RULES: {
  name: string;
  info: string;
  evidence: { label: string; href?: string; note: string }[];
}[] = [
  {
    name: "Outside the FCC",
    info: "Not covered. The reason: a cable channel is not a licensed station, so 47 U.S.C. § 326, 47 U.S.C. § 315, and the news-distortion policy do not apply. No U.S. Code section requires a cable report to be true.",
    evidence: [
      {
        label: "FCC news distortion policy",
        href: "https://www.fcc.gov/broadcast-news-distortion",
        note: "Not covered. The reason: the July 18, 2024 page says cable news networks are outside the news-distortion policy.",
      },
      {
        label: "47 U.S.C. § 326",
        href: "https://www.law.cornell.edu/uscode/text/47/326",
        note: "The no-censorship statute applies to radio communication by a licensed station. It does not cover a cable channel, and it does not require the news to be true.",
      },
      {
        label: "47 U.S.C. § 315",
        href: "https://www.law.cornell.edu/uscode/text/47/315",
        note: "Equal opportunity for candidates applies to a licensed station. It does not apply to cable news.",
      },
    ],
  },
  {
    name: "CNN",
    info: "No code found. The reason: no public CNN standards handbook was found, so integrity and deceptive reporting are not stated. No rule number. No page number.",
    evidence: [
      {
        label: "CNN search",
        note: "No code found. The reason: no public CNN standards handbook was found. A training course is not a published news code.",
      },
    ],
  },
  {
    name: "Fox News",
    info: "No public news code. The reason: the Fox Corporation report, page 43, commits to accuracy and checking facts, and it does not publish a Fox News code or a rule against deceptive reporting. No rule number on that page.",
    evidence: [
      {
        label: "Fox Corporation report, 2026",
        href: "https://media.investor.foxcorporation.com/wp-content/uploads/2026/08/25180911/CSR_Aug-25_2026.pdf",
        note: "No public news code. The reason: page 43 has no rule number. It commits to accuracy and checking facts. It does not state a rule against deceptive reporting, and it does not publish a Fox News code.",
      },
    ],
  },
  {
    name: "MS NOW",
    info: "No code found. The reason: no public standards handbook was found, so integrity and deceptive reporting are not stated. No rule number. No page number.",
    evidence: [
      {
        label: "MS NOW search",
        note: "No code found. The reason: no public standards handbook was found for MS NOW.",
      },
    ],
  },
  {
    name: "NewsNation",
    info: "Follows another code. The reason: Nexstar, page 9, says the company follows the RTDNA code. The report has no rule number and no deception rule of its own. The RTDNA deception line is on the RTDNA web page, which has no rule number and no page number.",
    evidence: [
      {
        label: "Nexstar report, 2026",
        href: "https://www.nexstar.tv/wp-content/uploads/2026/05/NXST-2025-Governance-and-Sustainability-Report-5.28.26.pdf",
        note: "Follows another code. The reason: page 9 has no rule number. Nexstar says its journalists follow the RTDNA code. The report does not state its own rule against deceptive reporting.",
      },
      {
        label: "RTDNA Code of Ethics, 2015",
        href: "https://www.rtdna.org/ethics",
        note: "Adopted June 11, 2015. It does not say the code is voluntary. It says the code does not dictate the decision.",
      },
    ],
  },
];

const JOURNAL_ENDS: { line: string; label: string; href?: string; note: string }[] = [
  {
    line: "The journalist code that says it is voluntary cannot be enforced on a journalist.",
    label: "SPJ, the code is voluntary",
    href: "https://www.spj.org/ethics-frequently-asked-questions/",
    note: "The Society of Professional Journalists says its code is voluntary and that it does not investigate complaints.",
  },
  {
    line: "No U.S. Code section requires a news report to be true.",
    label: "First Amendment",
    href: "https://constitution.congress.gov/constitution/amendment-1/",
    note: "The right is in the Constitution, not the Code. 42 U.S.C. § 2000aa limits a newsroom search. It does not require accuracy. There is no federal shield law.",
  },
];

const CODE_ENDS: { line: string; label: string; href?: string; note: string }[] = [
  {
    line: "A company handbook binds that company's staff. It does not bind another network.",
    label: "NPR, who the handbook binds",
    href: "https://www.npr.org/ethics",
    note: "NPR binds its own editorial staff. CBS and ABC publish their own rules. NBC News has no public code. The profession's code is on the journalist chart.",
  },
];

const FCC_ENDS: { line: string; label: string; href?: string; note: string }[] = [
  {
    line: "A misleading caption or a clipped quote is not, by itself, an FCC violation, and it is not a federal crime.",
    label: "FCC page, July 18, 2024",
    href: "https://www.fcc.gov/broadcast-news-distortion",
    note: "The policy requires deliberate distortion of a significant event, and outside evidence of that intent. Cable, a podcast, and a website are outside it.",
  },
];

const CABLE_ENDS: { line: string; label: string; href?: string; note: string }[] = [
  {
    line: "Cable news is outside the FCC news-distortion rule.",
    label: "FCC page on cable",
    href: "https://www.fcc.gov/broadcast-news-distortion",
    note: "The policy applies to a licensed over-the-air station. It does not apply to a cable news channel.",
  },
  {
    line: "No public ethics code was found for CNN, Fox News, or MS NOW.",
    label: "What was not found",
    note: "No public standards handbook was found for those three. A company report is not a news code.",
  },
];

function openRuleChart(layer: "fcc" | "press" | "codes" | "cable") {
  if (layer === "fcc") {
    return {
      title: "FCC rules",
      intro: "This chart is only the FCC rules. It is not a journalist code.",
      items: FCC_RULES,
      ends: FCC_ENDS,
      endTitle: "What the FCC does not reach",
    };
  }
  if (layer === "press") {
    return {
      title: "Journalist code of ethics",
      intro: "This chart is only the profession's codes. It is not a network handbook and it is not an FCC rule.",
      items: JOURNAL_RULES,
      ends: JOURNAL_ENDS,
      endTitle: "What the journalist code does not do",
    };
  }
  if (layer === "codes") {
    return {
      title: "Ethics codes",
      intro: "This chart is company rules. The profession's code is on the journalist chart.",
      items: CODE_RULES,
      ends: CODE_ENDS,
      endTitle: "What a company code does not reach",
    };
  }
  return {
    title: "Cable news",
    intro: "This chart is only cable news. Cable is outside the FCC news-distortion rule.",
    items: CABLE_RULES,
    ends: CABLE_ENDS,
    endTitle: "What cable news is not under",
  };
}

function NoteText({ text }: { text: string }) {
  const phrase = "It is voluntary";
  const at = text.indexOf(phrase);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <strong className="underline">{phrase}</strong>
      {text.slice(at + phrase.length)}
    </>
  );
}

function SourcePage({ label, href, note }: { label: string; href?: string; note?: string }) {
  return (
    <div className="mt-8 w-full border border-white/20 bg-[#070b12]/80 px-4 py-4 text-left">
      <p className="text-[16px] font-semibold text-white">{label}</p>
      <p className="mt-2 text-[14px] leading-snug text-white/80">
        <NoteText text={note ?? "This is the source cited for that result. It is one record, not the whole file."} />
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[14px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
        >
          Open the source
        </a>
      ) : (
        <p className="mt-4 text-[14px] text-white/70">A public link for this study is not on file yet.</p>
      )}
    </div>
  );
}

function MethodDetail({
  item,
  onOpen,
}: {
  item: { name: string; info: string; evidence: { label: string; href?: string }[] };
  onOpen: (label: string) => void;
}) {
  return (
    <div className="mt-8 w-full border border-white/20 bg-[#070b12]/80 px-4 py-4 text-left">
      <p className="text-[16px] font-semibold text-white">{item.name}</p>
      <p className="mt-2 text-[14px] leading-snug text-white/85">{item.info}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.evidence.map((piece) => (
          <button
            key={piece.label}
            type="button"
            onClick={() => onOpen(piece.label)}
            className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[12px] font-semibold text-white"
          >
            {piece.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const NEWS_MARKS: Record<string, { evidence: string; proof: string; term: string }> = {
  "1": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "2": { evidence: "Proven false", proof: "Official record", term: "first" },
  "9": { evidence: "Proven false", proof: "Official record", term: "first" },
  "10": { evidence: "Proven false", proof: "Official record", term: "first" },
  "11": { evidence: "Proven false", proof: "Official record", term: "first" },
  "12": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "13": { evidence: "Rated misleading", proof: "Original transcript/video", term: "first" },
  "14": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "15": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "16": { evidence: "Proven false", proof: "Official record", term: "later" },
  "17": { evidence: "Proven false", proof: "Outlet's own correction", term: "later" },
  "18": { evidence: "Proven false", proof: "Outlet's own correction", term: "later" },
  "20": { evidence: "Proven false", proof: "Official record", term: "first" },
  "23": { evidence: "Rated misleading", proof: "Original transcript/video", term: "first" },
  "24": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "25": { evidence: "Proven false", proof: "Official record", term: "first" },
  "26": { evidence: "Proven false", proof: "Official record", term: "first" },
  "27": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "31": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "32": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "33": { evidence: "Proven false", proof: "Official record", term: "first" },
  "35": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "36": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "41": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "42": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "43": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "44": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "45": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "46": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "47": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "48": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "50": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "52": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "54": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "55": { evidence: "Rated misleading", proof: "Primary document or record search", term: "later" },
  "56": { evidence: "Rated misleading", proof: "Original transcript/video", term: "first" },
  "57": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "60": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "66": { evidence: "Proven false", proof: "Official record", term: "first" },
  "69": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "72": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "78": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "79": { evidence: "Proven false", proof: "Official record", term: "first" },
  "82": { evidence: "Proven false", proof: "Official record", term: "first" },
  "84": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "85": { evidence: "Proven false", proof: "Official record", term: "first" },
  "86": { evidence: "Proven false", proof: "Official record", term: "first" },
  "90": { evidence: "Proven false", proof: "Official record", term: "first" },
  "93": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "94": { evidence: "Rated misleading", proof: "Original transcript/video", term: "first" },
  "99": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "101": { evidence: "Proven false", proof: "Outlet's own correction", term: "later" },
  "105": { evidence: "Proven false", proof: "Official record", term: "first" },
  "111": { evidence: "Proven false", proof: "Official record", term: "first" },
  "112": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "113": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "114": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "118": { evidence: "Proven false", proof: "Outlet's own correction", term: "later" },
  "119": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "125": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "126": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "127": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "128": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "130": { evidence: "Proven false", proof: "Original transcript/video", term: "later" },
  "131": { evidence: "Proven false", proof: "Official record", term: "later" },
  "134": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "139": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "140": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "141": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "142": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "146": { evidence: "Proven false", proof: "Outlet's own correction", term: "later" },
  "154": { evidence: "Proven false", proof: "Official record", term: "later" },
  "155": { evidence: "Proven false", proof: "Official record", term: "later" },
  "156": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "157": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "166": { evidence: "Proven false", proof: "Official record", term: "first" },
  "168": { evidence: "Proven false", proof: "Official record", term: "first" },
  "169": { evidence: "Proven false", proof: "Official record", term: "first" },
  "172": { evidence: "Proven false", proof: "Original transcript/video", term: "first" },
  "173": { evidence: "Proven false", proof: "Official record", term: "first" },
  "177": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "180": { evidence: "Proven false", proof: "Official record", term: "later" },
  "183": { evidence: "Proven false", proof: "Official record", term: "later" },
  "184": { evidence: "Proven false", proof: "Outlet's own correction", term: "later" },
  "185": { evidence: "Proven false", proof: "Official record", term: "later" },
  "189": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "191": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "192": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "194": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "199": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "200": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "201": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "202": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "203": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "204": { evidence: "Proven false", proof: "Official record", term: "first" },
  "205": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "206": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "207": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "209": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "210": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "211": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "212": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "214": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "215": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "216": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "217": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "218": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "219": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "220": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "221": { evidence: "Rated misleading", proof: "Original transcript/video", term: "later" },
  "222": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "223": { evidence: "Proven false", proof: "Primary document or record search", term: "later" },
  "225": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "226": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "229": { evidence: "Proven false", proof: "Outlet's own correction", term: "first" },
  "233": { evidence: "Proven false", proof: "Official record", term: "first" },
  "252": { evidence: "Proven false", proof: "Official record", term: "later" },
  "253": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "254": { evidence: "Proven false", proof: "Official record", term: "first" },
  "255": { evidence: "Proven false", proof: "Official record", term: "first" },
  "256": { evidence: "Proven false", proof: "Official record", term: "first" },
  "257": { evidence: "Proven false", proof: "Official record", term: "first" },
  "258": { evidence: "Rated misleading", proof: "Official record", term: "first" },
  "259": { evidence: "Proven false", proof: "Official record", term: "first" },
  "260": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "261": { evidence: "Proven false", proof: "Official record", term: "later" },
  "262": { evidence: "Proven false", proof: "Official record", term: "later" },
  "263": { evidence: "Rated misleading", proof: "Official record", term: "later" },
  "264": { evidence: "Rated misleading", proof: "Official record", term: "later" },
};

const ADDED_MISLEADING = [
  {
    who: "Reuters, August 4, 2026",
    date: "August 4, 2026",
    method: "Premature proven framing",
    group: "Print/Web news",
    outlet: "Reuters",
    said: "Judges in 75 cases ruled that the administration stifled the First Amendment. The count was 75 of 93.",
    record: "Rated misleading. The reason: Reuters stated a precise total and did not publish the cases. A count with no list cannot be checked.",
    sources: [
      { label: "Reuters, August 4, 2026", href: "https://www.reuters.com/legal/government/trump-vowed-bring-free-speech-back-judges-75-cases-ruled-that-he-has-stifled-it-2026-08-04/" },
      { label: "Perkins Coie, May 2, 2025", href: "https://www.jurist.org/news/2025/05/us-judge-rules-trump-order-against-law-firm-perkins-coie-unconstitutional/" },
      { label: "Judge Young, September 30, 2025", href: "https://www.nytimes.com/2025/09/30/us/politics/student-speech-palestinians-ruling.html" },
    ],
  },
];

const DECEPTION_BUCKETS: [string, RegExp][] = [
  ["False photo or video", /photo|video/i],
  ["Premature proven framing", /premature/i],
  ["Retracted invention", /retract/i],
  ["Policy-scope inflation", /policy-scope|inflat/i],
  ["Misquote / truncation", /misquote|truncat/i],
  ["Omitted context", /omitted context|omission|cherry-pick/i],
  ["Fabrication / false attribution", /fabricat|false attribution|false claim|false denial/i],
];

function deceptionBucket(method: string) {
  for (const [name, test] of DECEPTION_BUCKETS) {
    if (test.test(method)) return name;
  }
  const named: [string, RegExp][] = [
    ["Omitted context", /omit|erases across-the-board/i],
    ["Misquote / truncation", /deceptive edit|inverted interview|joke\/qualified/i],
    ["Premature proven framing", /speculation as|treated as fact|unverified meeting/i],
    ["Wrong number", /statistic|wrong number|arithmetic|deficit \/ debt|apples-to-oranges|rounds up|counting phrases|JCT|wage crash|BLS|capital gains|tax rates study|conflates total deficit|bill score|baseline/i],
    ["Policy-scope inflation", /framed as|treated as|presented as|labeled as|attributed|false description|false historical|outdated position|pay-for|giveaway|ransacking|solely to the bill|expiry-year|job-loss|debt increase|Muslim ban|exaggeration|court settlement|locked exclusive|disenrollment|forced loss|forced removal|FEMA|distributional|overstated/i],
    ["Fabrication / false attribution", /falsehood|misattributed|taking credit|false premise|misidentification|biographical|conflating|false visit|resignation|chronology|identity\/event|firing|date error|inverted initiator|nonexistent word|false process|embellished|r[eé]sum[eé]|wrong title/i],
  ];
  for (const [name, test] of named) {
    if (test.test(method)) return name;
  }
  return "Other";
}

function verdictFile(value: "Proven false" | "Rated misleading" | "Still being checked") {
  const rows = fakeNewsCases.filter((row) => row.evidence === value).map((row) => ({
    who: row.who,
    date: row.began,
    method: deceptionBucket(row.method),
    group: row.networkGroup,
    outlet: row.networkName,
    said: row.said,
    record: row.record,
    sources: row.sources,
  }));
  if (value === "Rated misleading") rows.push(...ADDED_MISLEADING);
  return rows;
}

const SPEAKER_GROUPS: [string, string][] = [
  ["Politicians", "Politicians/Officials"],
  ["Journalists", "Print/Web news"],
  ["Broadcast networks", "MSM Networks"],
  ["Cable news", "Cable Networks"],
  ["Social media", "Social Media"],
  ["Public broadcasting", "Public Broadcasting"],
  ["Advocacy", "Advocacy groups"],
  ["Not yet identified", "Not yet identified"],
];

const VERDICT_DATA = [
  verdictFile("Proven false").length,
  verdictFile("Rated misleading").length,
  verdictFile("Still being checked").length,
] as const;

const EVIDENCE_CHARTS = [
  {
    id: "chart-term",
    title: "Time Period",
    type: "bar",
    horizontal: false,
    labels: ["First term (2017–21)", "2021 – present"],
    data: [65, 64],
    colors: ["#0c2340", "#b91c1c"],
    key: "term",
    values: ["first", "later"],
    bullets: ["First term", "2021 – present", "Among the 129 verified cases · tap to filter"],
  },
  {
    id: "chart-methods",
    title: "Methods of Deception",
    type: "bar",
    horizontal: true,
    labels: [
      "Omitted context",
      "Misquote / truncation",
      "Fabrication / false attribution",
      "Premature “proven” framing",
      "Retracted invention",
      "Policy-scope inflation",
      "False attribution of words or intent",
      "Retracted invention / misquote / truncation",
    ],
    data: [14, 8, 8, 5, 5, 5, 4, 2],
    colors: ["#b91c1c", "#1d4ed8", "#b45309", "#7c3aed", "#0f766e", "#ca8a04", "#be185d", "#3f6212"],
    key: "method",
    values: [
      "omitted context",
      "misquote / truncation",
      "fabrication / false attribution",
      "premature “proven” framing",
      "retracted invention",
      "policy-scope inflation",
      "false attribution of words/intent / omitted context",
      "retracted invention / misquote / truncation",
    ],
    bullets: [
      "Among the 129 verified cases · tap to filter",
      "The charts: tap a bar to filter",
      "Tap a chart or tile for the details behind it.",
    ],
  },
  {
    id: "chart-proof",
    title: "Strength of proof",
    type: "bar",
    horizontal: true,
    labels: ["Official record", "Transcript / video", "Outlet's own correction", "Primary document / record search"],
    data: [79, 25, 13, 12],
    colors: ["#14532d", "#1e3a5f", "#7c2d12", "#57534e"],
    key: "proof",
    values: ["Official record", "Original transcript/video", "Outlet's own correction", "Primary document or record search"],
    bullets: ["Tap a bar to filter", "Original transcript/video", "Outlet's own correction"],
  },
  {
    id: "chart-evidence",
    title: "Verdict",
    type: "doughnut",
    horizontal: false,
    labels: ["Proven false", "Rated misleading", "Unverified"],
    data: VERDICT_DATA,
    colors: ["#166534", "#b45309", "#57534e"],
    key: "evidence",
    values: ["Proven false", "Rated misleading", "Still being checked"],
    bullets: [
      "The slices count every case.",
      `${VERDICT_DATA[0]} proven false. ${VERDICT_DATA[1]} rated misleading. ${VERDICT_DATA[2]} unverified.`,
      "Tap a slice, then who said it. Cable news is listed by the network.",
    ],
  },
] as const;

const PILL_GRAPHIC: Record<string, string> = {
  "chart-term": "/images/pill-time.jpg",
  "chart-methods": "/images/pill-methods.jpg",
  "chart-proof": "/images/pill-proof.jpg",
  "chart-evidence": "/images/pill-verdict.jpg",
};

function loadChartJs() {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as Window & { Chart?: unknown };
  if (w.Chart) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const found = document.querySelector('script[src="/assets/vendor/chart.umd.min.js"]');
    if (found) {
      found.addEventListener("load", () => resolve(), { once: true });
      if ((window as Window & { Chart?: unknown }).Chart) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "/assets/vendor/chart.umd.min.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function EvidenceChart({
  spec,
  onPick,
}: {
  spec: (typeof EVIDENCE_CHARTS)[number];
  onPick: (index: number) => void;
  onNever?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  useEffect(() => {
    let dead = false;
    loadChartJs().then(() => {
      if (dead || !canvasRef.current) return;
      const Chart = (window as unknown as { Chart: new (el: HTMLCanvasElement, cfg: object) => { destroy: () => void } }).Chart;
      const horiz = spec.horizontal;
      const bg = spec.data.map((_, index) => spec.colors[index % spec.colors.length]);
      chartRef.current?.destroy();
      chartRef.current = new Chart(canvasRef.current, {
        type: spec.type,
        data: {
          labels: [...spec.labels],
          datasets: [
            {
              data: [...spec.data],
              backgroundColor: bg,
              borderWidth: spec.type === "doughnut" ? 2 : 0,
              borderColor: "#fff",
              borderRadius: spec.type === "bar" ? 6 : 0,
              maxBarThickness: 44,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 900, easing: "easeOutQuart" },
          cutout: spec.type === "doughnut" ? "62%" : undefined,
          indexAxis: spec.type === "bar" && horiz ? "y" : "x",
          plugins: {
            legend: {
              display: spec.type === "doughnut",
              position: "right",
              labels: { color: "#e8e0d0", font: { size: 15 }, boxWidth: 14 },
              onClick: (_event: unknown, item: { index: number }) => pickRef.current(item.index),
            },
            tooltip: { callbacks: { label: (ctx: { label?: string; parsed: number | { x: number; y: number } }) => {
              const value = typeof ctx.parsed === "object" ? (horiz ? ctx.parsed.x : ctx.parsed.y) : ctx.parsed;
              return `${ctx.label ?? ""}: ${value}`;
            } } },
          },
          scales: spec.type === "doughnut" ? undefined : {
            x: horiz
              ? { beginAtZero: true, grid: { color: "rgba(15,23,42,.06)" }, ticks: { color: "#e8e0d0" } }
              : { grid: { display: false }, ticks: { color: "#e8e0d0", autoSkip: false } },
            y: horiz
              ? { grid: { display: false }, ticks: { color: "#e8e0d0", autoSkip: false } }
              : { beginAtZero: true, grid: { color: "rgba(15,23,42,.06)" }, ticks: { color: "#e8e0d0" } },
          },
          onClick: (_event: unknown, elements: { index: number }[]) => {
            if (elements.length) pickRef.current(elements[0].index);
          },
        },
      });
    });
    return () => {
      dead = true;
      chartRef.current?.destroy();
    };
  }, [spec]);
  return (
    <figure className="w-full">
      <div className={spec.id === "chart-methods" ? "relative h-80" : spec.horizontal ? "relative h-56" : "relative h-64"}>
        <canvas ref={canvasRef} aria-label={spec.title} />
        {spec.id === "chart-evidence" ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-white">{spec.data.reduce((sum, value) => sum + value, 0)}</span>
            <span className="text-[15px] font-semibold text-white">cases</span>
          </div>
        ) : null}
      </div>
    </figure>
  );
}

type NewsCaseRow = (typeof fakeNewsCases)[number];

const NEWS_CASES: NewsCaseRow[] = fakeNewsCases;

const NEWS_PERIODS = [
  { key: "2015–16", range: "Jan 1, 2015 – Dec 31, 2016" },
  { key: "2017–18", range: "Jan 1, 2017 – Dec 31, 2018" },
  { key: "2019–20", range: "Jan 1, 2019 – Dec 31, 2020" },
  { key: "2021–22", range: "Jan 1, 2021 – Dec 31, 2022" },
  { key: "2023–24", range: "Jan 1, 2023 – Dec 31, 2024" },
  { key: "2025–26", range: "Jan 1, 2025 – Sept 27, 2026" },
  { key: "Date unknown", range: "No date on file" },
];

const NEWS_NYI = "Not yet identified";

const NEWS_DIMS: {
  key: string;
  title: string;
  order?: string[];
  colors: Record<string, string>;
  fallback: string;
  get: (row: NewsCaseRow) => string;
  sub?: (row: NewsCaseRow) => string;
  subTitle?: string;
}[] = [
  {
    key: "status",
    title: "Verdict / status",
    order: ["Verified · Proven false", "Verified · Rated misleading", "Fact-checked", "Not yet verified"],
    colors: {
      "Verified · Proven false": "#166534",
      "Verified · Rated misleading": "#b45309",
      "Fact-checked": "#1e3a5f",
      "Not yet verified": "#57534e",
    },
    fallback: "#57534e",
    get: (row) => (row.status === "Verified" ? row.statusLabel : row.status),
  },
  {
    key: "proof",
    title: "Strength of proof",
    order: ["Official record", "Original transcript/video", "Outlet's own correction", "Primary document or record search", "Not yet rated"],
    colors: {
      "Official record": "#14532d",
      "Original transcript/video": "#1e3a5f",
      "Outlet's own correction": "#7c2d12",
      "Primary document or record search": "#78716c",
      "Not yet rated": "#3f3f46",
    },
    fallback: "#3f3f46",
    get: (row) => NEWS_MARKS[row.id]?.proof ?? "Not yet rated",
  },
  {
    key: "network",
    title: "By network/outlet",
    order: [
      "Cable Networks",
      "MSM Networks",
      "Public Broadcasting",
      "Podcasts",
      "Social Media",
      "Print/Web news",
      "Politicians/Officials",
      "Advocacy groups",
      NEWS_NYI,
    ],
    colors: {
      "Cable Networks": "#b91c1c",
      "MSM Networks": "#1d4ed8",
      "Public Broadcasting": "#0f766e",
      Podcasts: "#7c3aed",
      "Social Media": "#f59e0b",
      "Print/Web news": "#a3a3a3",
      "Politicians/Officials": "#7c2d12",
      "Advocacy groups": "#14532d",
      [NEWS_NYI]: "#57534e",
    },
    fallback: "#57534e",
    get: (row) => row.networkGroup,
    sub: (row) => row.networkName,
    subTitle: "Outlets and names",
  },
  {
    key: "party",
    title: "By political party",
    order: ["Republican", "Democratic", "News outlets", "Campaigns", "Social media", "Advocacy groups", NEWS_NYI],
    colors: {
      Republican: "#b91c1c",
      Democratic: "#1d4ed8",
      "News outlets": "#a3a3a3",
      Campaigns: "#7c3aed",
      "Social media": "#f59e0b",
      "Advocacy groups": "#0f766e",
      [NEWS_NYI]: "#57534e",
    },
    fallback: "#57534e",
    get: (row) => row.party,
  },
  {
    key: "person",
    title: "By journalist/person",
    colors: { [NEWS_NYI]: "#57534e" },
    fallback: "#7c2d12",
    get: (row) => row.person,
  },
];

function newsCountBy(rows: NewsCaseRow[], dim: (typeof NEWS_DIMS)[number], useSub = false) {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const value = useSub && dim.sub ? dim.sub(row) : dim.get(row);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  const entries = [...counts.entries()].map(([label, count]) => ({ label, count }));
  if (dim.order && !useSub) {
    const order = dim.order;
    return entries.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  }
  return entries.sort((a, b) => {
    if (a.label === NEWS_NYI) return 1;
    if (b.label === NEWS_NYI) return -1;
    return b.count - a.count || a.label.localeCompare(b.label);
  });
}

function newsPath(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function PeriodChart({
  title,
  labels,
  data,
  colors,
  horizontal,
  onPick,
}: {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  horizontal: boolean;
  onPick: (index: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const key = JSON.stringify([title, labels, data, colors, horizontal]);
  useEffect(() => {
    let dead = false;
    loadChartJs().then(() => {
      if (dead || !canvasRef.current) return;
      const Chart = (window as unknown as { Chart: new (el: HTMLCanvasElement, cfg: object) => { destroy: () => void } }).Chart;
      chartRef.current?.destroy();
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [{ data, backgroundColor: colors, borderWidth: 0, borderRadius: 6, maxBarThickness: 44 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 700, easing: "easeOutQuart" },
          indexAxis: horizontal ? "y" : "x",
          plugins: {
            legend: { display: false },
            tooltip: { titleFont: { size: 15 }, bodyFont: { size: 15 } },
          },
          scales: {
            x: horizontal
              ? { beginAtZero: true, grid: { color: "rgba(255,255,255,.08)" }, ticks: { color: "#e8e0d0", precision: 0, font: { size: 15 } } }
              : { grid: { display: false }, ticks: { color: "#e8e0d0", autoSkip: false, font: { size: 15 } } },
            y: horizontal
              ? { grid: { display: false }, ticks: { color: "#e8e0d0", autoSkip: false, font: { size: 15 } } }
              : { beginAtZero: true, grid: { color: "rgba(255,255,255,.08)" }, ticks: { color: "#e8e0d0", precision: 0, font: { size: 15 } } },
          },
          onClick: (_event: unknown, elements: { index: number }[]) => {
            if (elements.length) pickRef.current(elements[0].index);
          },
        },
      });
    });
    return () => {
      dead = true;
      chartRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <div className="relative w-full" style={{ height: horizontal ? Math.max(240, labels.length * 38 + 60) : 320 }}>
      <canvas
        ref={canvasRef}
        aria-label={title}
        onClick={(event) => {
          const canvas = canvasRef.current;
          const Chart = (window as unknown as { Chart?: { getChart: (el: HTMLCanvasElement) => PeriodChartApi | undefined } }).Chart;
          const chart = canvas && Chart ? Chart.getChart(canvas) : undefined;
          if (!canvas || !chart) return;
          const box = canvas.getBoundingClientRect();
          const x = event.clientX - box.left;
          const y = event.clientY - box.top;
          const onLabel = horizontal ? x < chart.chartArea.left : y > chart.chartArea.bottom;
          if (!onLabel) return;
          const at = Math.round(horizontal ? chart.scales.y.getValueForPixel(y) : chart.scales.x.getValueForPixel(x));
          if (at >= 0 && at < labels.length) pickRef.current(at);
        }}
      />
    </div>
  );
}

type PeriodChartApi = {
  chartArea: { left: number; bottom: number };
  scales: Record<string, { getValueForPixel: (px: number) => number }>;
};

function PeriodKeys({ labels, data, colors, onPick }: { labels: string[]; data: number[]; colors: string[]; onPick: (index: number) => void }) {
  return (
    <ul className="mt-4 flex flex-col gap-1">
      {labels.map((label, index) => (
        <li key={label}>
          <button
            type="button"
            onClick={() => onPick(index)}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl border-0 bg-transparent px-2 py-2 text-left text-[15px] font-semibold text-white hover:bg-white/5"
          >
            <span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: colors[index] ?? colors[0] }} />
            {label} · {data[index]}
          </button>
        </li>
      ))}
    </ul>
  );
}

function NewsHeading({ title, line }: { title: string; line: string }) {
  return (
    <>
      <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{title}</p>
      <p className="mt-1 text-center text-[15px] text-white/75">{line}</p>
    </>
  );
}

function newsCasesLine(count: number) {
  return `${count} ${count === 1 ? "case" : "cases"}`;
}

const NEWS_DOOR =
  "w-full rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-2 text-[15px] font-semibold leading-snug text-white";
const NEWS_CARD = "mt-6 w-full rounded-2xl border border-[#d4af37] bg-[#070b12] px-4 py-4";

function NewsCaseList({ rows, onSource }: { rows: NewsCaseRow[]; onSource: (href: string) => void }) {
  return (
    <div className="mt-6 flex w-full flex-col gap-4 text-left">
      {rows.map((row) => (
        <OrganizedNews key={row.id} row={row} onSource={onSource} />
      ))}
    </div>
  );
}

function claimClip(sources: { label: string; href: string }[]) {
  const video = sources.find((item) => /youtube\.com|youtu\.be|c-span\.org|rumble\.com|vimeo\.com/i.test(item.href));
  if (video) return { title: "Video of it being said", source: video };
  const publication = sources.find((item) => (
    /abcnews\.com|cbsnews\.com|nbcnews\.com|cnn\.com\/20|washingtonpost\.com|nytimes\.com|politico\.com|apnews\.com|cnbc\.com|npr\.org|theguardian\.com|axios\.com|usatoday\.com|newsweek\.com|foxnews\.com|msnbc\.com|thehill\.com|buzzfeednews\.com|reuters\.com|x\.com|twitter\.com|instagram\.com|tiktok\.com|facebook\.com|truthsocial\.com/i.test(item.href)
    && !/fact-check|factcheck|politifact|\/legal\//i.test(item.href)
  ));
  if (publication) return { title: "The publication", source: publication };
  const transcript = sources.find((item) => /rev\.com|transcript/i.test(item.href));
  if (transcript) return { title: "Transcript of what was said. No video is on this record.", source: transcript };
  return null;
}

function ClaimSaid({
  sources,
  onSource,
}: {
  sources: { label: string; href: string }[];
  onSource: (href: string) => void;
}) {
  const clip = claimClip(sources);
  if (!clip) {
    return (
      <p className="mt-4 text-[15px] font-semibold leading-snug text-white">
        No video of this claim is on this record. The publication of the claim is not on this record.
      </p>
    );
  }
  return (
    <div className="mt-4">
      <p className="text-[16px] font-semibold text-white">{clip.title}</p>
      <button type="button" onClick={() => onSource(clip.source.href)} className={NEWS_DOOR + " mt-2 text-left"}>
        {clip.title}
      </button>
    </div>
  );
}

function NewsCaseDetail({ row, onSource }: { row: NewsCaseRow; onSource: (href: string) => void }) {
  return (
    <div className="w-full">
      <NewsHeading title={`Case #${row.id}`} line={`${row.period} · ${row.began}`} />
      <div className="mt-6">
        <OrganizedNews row={row} onSource={onSource} />
      </div>
    </div>
  );
}

const LAYER_TILE = "flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0";
const LAYER_TILE_IMG = "h-44 w-full rounded-2xl border border-white/30 object-cover";

function LayerTileImage({ src, label, square }: { src: string; label: string; square?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, [src]);
  if (missing) {
    return (
      <span aria-hidden="true" className={(square ? "h-52 w-52" : "h-44 w-full") + " flex items-center justify-center rounded-2xl border border-white/30 bg-[#0b1220] px-5 text-center text-[16px] font-semibold leading-snug tracking-wide text-white/85"}>
        {label}
      </span>
    );
  }
  return <img ref={ref} src={src} alt="" onError={() => setMissing(true)} className={square ? "h-52 w-52 rounded-2xl border border-white/30 object-cover" : LAYER_TILE_IMG} />;
}

function LayerTiles({ tiles, square }: { tiles: { key: string; label: string; image: string; onOpen: () => void }[]; square?: boolean }) {
  return (
    <div className="mt-8 flex w-full flex-wrap items-end justify-center gap-10">
      {tiles.map((tile) => (
        <button key={tile.key} type="button" onClick={tile.onOpen} className={square ? "flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0" : LAYER_TILE}>
          <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">{tile.label}</span>
          <LayerTileImage src={tile.image} label={tile.label} square={square} />
        </button>
      ))}
    </div>
  );
}

function LayerChart({
  title,
  line,
  labels,
  data,
  colors,
  type,
  horizontal,
  keys,
  bullets,
  center,
  onPick,
  namesOnChart,
  colorKey,
}: {
  title: string;
  line: string;
  labels: string[];
  data: number[];
  colors: string[];
  type: "bar" | "doughnut";
  horizontal: boolean;
  keys?: { label: string; color: string; index: number }[];
  bullets: string[];
  center?: { big: string; small: string; onOpen: () => void };
  onPick: (index: number) => void;
  namesOnChart?: boolean;
  colorKey?: boolean;
}) {
  const named = colorKey ? false : Boolean(namesOnChart) || (type === "doughnut" && labels.length <= 8);
  const showKey = Boolean(colorKey) || (type === "doughnut" && !named);
  const height = named ? 460 : type === "doughnut" ? 300 : horizontal ? Math.max(200, labels.length * 46 + 50) : 300;
  const lines = keys ?? labels.map((label, index) => ({ label: `${label} · ${data[index]}`, color: colors[index] ?? colors[0], index }));
  return (
    <section className="w-full">
      <p className="mt-2 text-center text-[15px] text-white/75">{line}</p>
      <div className={NEWS_CARD}>
        <div className="relative w-full" style={{ height }}>
          <LawChart title={title} labels={labels} data={data} colors={colors} type={type} horizontal={horizontal} onPick={onPick} namesOnChart={named} />
          {center ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={center.onOpen}
                className="pointer-events-auto flex flex-col items-center rounded-full border-0 bg-transparent px-4 py-3"
              >
                <span className="text-[30px] leading-none font-bold text-white">{center.big}</span>
                <span className="mt-1 text-[15px] font-semibold text-white underline decoration-[#d4af37] underline-offset-4">{center.small}</span>
              </button>
            </div>
          ) : null}
        </div>
        {showKey ? (
        <ul className="mt-4 flex flex-col gap-1">
          {lines.map((key) => (
            <li key={key.label}>
              <button
                type="button"
                onClick={() => onPick(key.index)}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl border-0 bg-transparent px-2 py-2 text-left text-[15px] font-semibold text-white hover:bg-white/5"
              >
                <span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: key.color }} />
                {key.label}
              </button>
            </li>
          ))}
        </ul>
        ) : null}
      </div>
    </section>
  );
}

const LAYER_ROW =
  "w-full rounded-3xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] font-semibold leading-snug text-white";

const NEWS_DIM_TILES: Record<string, string> = {
  status: "/images/tile-verdict-status.jpg",
  proof: "/images/tile-strength-of-proof.jpg",
  network: "/images/tile-by-network.jpg",
  party: "/images/tile-by-party.jpg",
  person: "/images/tile-by-journalist.jpg",
};

function NewsScaleNote() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto mt-6 flex w-full max-w-xl flex-col items-center">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-1.5 text-[15px] font-semibold text-white"
      >
        Estimated scale (not verified)
      </button>
      {open ? (
        <ul className="mt-4 w-full list-disc rounded-2xl border border-white/20 bg-[#070b12]/85 py-4 pr-5 pl-9 text-left text-[15px] leading-snug text-white/85">
          <li className="font-semibold text-white">Estimated scale — not verified</li>
          <li>Numbers this large cannot possibly be verified by the SwampForce Editor alone. These are outside estimates, not counts.</li>
          <li>Millions of negative items about Trump in every two-year block since 2015.</li>
          <li>Peak years: 2016–17 and 2020–21.</li>
          <li>Most misleading copies spread on social media and memes (estimated 60–80%).</li>
          <li>A few hundred false storylines, reused again and again.</li>
          <li>Only the {allOneRows().length} cases on this chart are counted and sourced.</li>
        </ul>
      ) : null}
    </div>
  );
}

function NewsPeriodLayers({
  path,
  onPath,
  onSource,
}: {
  path: string[];
  onPath: (path: string[]) => void;
  onSource: (href: string) => void;
}) {
  const period = path[0] != null ? NEWS_PERIODS.find((item) => item.key === path[0]) : undefined;
  const dim = path[1] != null ? NEWS_DIMS.find((item) => item.key === path[1]) : undefined;
  const value = path[2];
  const subValue = path[3];
  const periodRows = period ? NEWS_CASES.filter((row) => row.period === period.key) : NEWS_CASES;
  const groupRows = dim && value != null ? periodRows.filter((row) => dim.get(row) === value) : periodRows;
  const valueRows = dim && dim.sub && subValue != null ? groupRows.filter((row) => dim.sub?.(row) === subValue) : groupRows;

  if (period && dim && value != null && (!dim.sub || subValue != null)) {
    const base = dim.sub ? 4 : 3;
    return (
      <SamePath
        title={subValue ?? value}
        rows={valueRows.map(speakFromCase)}
        groupName={path[base] ?? ""}
        outletName={path[base + 1] ?? ""}
        onGroup={(name) => onPath([...path.slice(0, base), name])}
        onOutlet={(name) => onPath([...path.slice(0, base), "Cable news", name])}
        onSource={onSource}
      />
    );
  }
  if (period && dim) {
    const names = value != null;
    const groups = newsCountBy(names ? groupRows : periodRows, dim, names);
    const open = (label: string) => onPath(names ? [period.key, dim.key, value, label] : [period.key, dim.key, label]);
    const colors = groups.map((item) =>
      names ? (item.label === NEWS_NYI ? "#57534e" : (dim.colors[value] ?? dim.fallback)) : (dim.colors[item.label] ?? dim.fallback),
    );
    return (
      <div className="w-full">
        <NewsHeading
          title={names ? value : dim.title}
          line={`${period.key} · ${names ? `${dim.title} · ` : ""}${newsCasesLine(names ? groupRows.length : periodRows.length)}`}
        />
        <div className={NEWS_CARD}>
          <PeriodChart
            title={`${period.key} ${dim.title} ${value ?? ""}`}
            labels={groups.map((item) => item.label)}
            data={groups.map((item) => item.count)}
            colors={colors}
            horizontal
            onPick={(index) => open(groups[index].label)}
          />
          <PeriodKeys
            labels={groups.map((item) => item.label)}
            data={groups.map((item) => item.count)}
            colors={colors}
            onPick={(index) => open(groups[index].label)}
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-2">
          {groups.map((item) => (
            <button key={item.label} type="button" onClick={() => open(item.label)} className={`${NEWS_DOOR} text-left`}>
              {item.label} · {item.count}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (period) {
    return (
      <div className="w-full">
        <NewsHeading title={period.key} line={`${period.range} · ${newsCasesLine(periodRows.length)}`} />
        <LayerTiles
          tiles={NEWS_DIMS.map((item) => ({
            key: item.key,
            label: item.title,
            image: NEWS_DIM_TILES[item.key],
            onOpen: () => onPath([period.key, item.key]),
          }))}
        />
      </div>
    );
  }
  const periods = NEWS_PERIODS.map((item) => ({
    ...item,
    count: NEWS_CASES.filter((row) => row.period === item.key).length,
  })).filter((item) => item.count > 0 || item.key !== "Date unknown");
  return (
    <div className="w-full">
      <NewsHeading
        title="Cases by time period"
        line={`Jan 1, 2015 – Sept 27, 2026 · ${newsCasesLine(NEWS_CASES.length)} (verified, fact-checked, not yet verified)`}
      />
      <div className={NEWS_CARD}>
        <PeriodChart
          title="Cases by time period"
          labels={periods.map((item) => item.key)}
          data={periods.map((item) => item.count)}
          colors={periods.map(() => "#d4af37")}
          horizontal={false}
          onPick={(index) => onPath([periods[index].key])}
        />
        <PeriodKeys
          labels={periods.map((item) => item.key)}
          data={periods.map((item) => item.count)}
          colors={periods.map(() => "#d4af37")}
          onPick={(index) => onPath([periods[index].key])}
        />
      </div>
      <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-2 gap-3">
        {periods.map((item) => (
          <button key={item.key} type="button" onClick={() => onPath([item.key])} className={NEWS_DOOR}>
            {item.key} · {item.count}
          </button>
        ))}
      </div>
      <NewsScaleNote />
    </div>
  );
}

const NEWS_NEVER = NEWS_CASES.filter((row) => row.status === "Verified" && row.correction.startsWith("Never corrected"));
const NEWS_NEVER_FALSE = NEWS_NEVER.filter((row) => row.evidence === "Proven false");
const NEWS_NEVER_MISLEADING = NEWS_NEVER.filter((row) => row.evidence === "Rated misleading");

function NewsNeverList({
  which,
  onWhich,
  onSource,
}: {
  which: string | null;
  onWhich: (which: string) => void;
  onSource: (href: string) => void;
}) {
  if (which === "false" || which === "misleading" || which?.startsWith("false|") || which?.startsWith("misleading|")) {
    const [kind, groupName = "", outletName = ""] = (which ?? "").split("|");
    const picked = kind === "false" ? NEWS_NEVER_FALSE : NEWS_NEVER_MISLEADING;
    return (
      <SamePath
        title={`Never corrected · ${kind === "false" ? "False" : "Misleading"}`}
        rows={picked.map(speakFromCase)}
        groupName={groupName}
        outletName={outletName}
        onGroup={(name) => onWhich(`${kind}|${name}`)}
        onOutlet={(name) => onWhich(`${kind}|Cable news|${name}`)}
        onSource={onSource}
      />
    );
  }
  return (
    <div className="w-full">
      <NewsHeading
        title={`Never corrected · ${NEWS_NEVER.length}`}
        line={`Verified cases never corrected by whoever pushed them · ${NEWS_NEVER_FALSE.length} false / ${NEWS_NEVER_MISLEADING.length} misleading`}
      />
      <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-2 gap-3">
        <button type="button" onClick={() => onWhich("false")} className={NEWS_DOOR}>
          False ({NEWS_NEVER_FALSE.length})
        </button>
        <button type="button" onClick={() => onWhich("misleading")} className={NEWS_DOOR}>
          Misleading ({NEWS_NEVER_MISLEADING.length})
        </button>
      </div>
    </div>
  );
}

const SAVE_ROWS: { id: string; who: string; group: string; where: string; when: string; views: string; viewCount: number; lean?: string; leanNote?: string; record?: string; said: string; links: { label: string; href: string }[] }[] = [
  {
    "id": "save-row-1",
    "who": "Chuck Schumer",
    "group": "Democratic",
    "where": "X",
    "when": "1:48 PM",
    "views": "160,876",
    "said": "The MAGA Supreme Court strikes again ... thousands of American voters could be wrongly stripped from voter rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/SenSchumer/status/2103542232418550057"
      }
    ],
    "viewCount": 160876
  },
  {
    "id": "save-row-2",
    "who": "Ilhan Omar",
    "group": "Democratic",
    "where": "X",
    "when": "3:41 PM",
    "views": "687,316",
    "said": "This is a blatant attempt to suppress the vote ... Eligible voters will be disenfranchised by this flawed tool.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/Ilhan/status/2103570490518323329"
      }
    ],
    "viewCount": 687316
  },
  {
    "id": "save-row-3",
    "who": "DNC chair Ken Martin",
    "group": "Democratic",
    "where": "democrats.org",
    "when": "1:37 PM",
    "views": "views not published",
    "said": "The ruling ... will lead to demands to purge eligible voters from the rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://democrats.org/breaking-scotus-allows-trump-administration-to-access-sensitive-voter-data-opening-the-door-to-more-voter-intimidation-and-suppression/"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-4",
    "who": "Sen. Dick Durbin",
    "group": "Democratic",
    "where": "Senate Judiciary site + X",
    "when": "Sept 25",
    "views": "22,515 (19,008 + 3,507)",
    "said": "An expansive and flawed database that states can use for potential voter purges ... weaponize an unreliable database.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.judiciary.senate.gov/press/dem/releases/durbin-statement-on-supreme-court-allowing-trump-administration-to-proceed-with-flawed-voter-screening-database-ahead-of-midterms"
      },
      {
        "label": "source 2 ↗",
        "href": "https://x.com/JudiciaryDems/status/2103593191014334481"
      },
      {
        "label": "source 3 ↗",
        "href": "https://x.com/JudiciaryDems/status/2103595404793417737"
      }
    ],
    "viewCount": 22515
  },
  {
    "id": "save-row-5",
    "who": "Rep. John Larson",
    "group": "Democratic",
    "where": "house.gov",
    "when": "4:18 PM",
    "views": "views not published",
    "said": "The ruling allows the SAVE database ... to purge voters from the rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "http://larson.house.gov/media-center/press-releases/larson-condemns-supreme-court-decision-allowing-use-trump-voter-purge"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-6",
    "who": "Democracy Docket",
    "group": "Social media",
    "where": "X (also Bluesky, website)",
    "when": "11:44 AM",
    "views": "1,078,666",
    "said": "The Supreme Court ruled 6-3 to allow ... voter roll purges using a flawed database. Bluesky copy: 1,571 likes, 990 reposts.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/DemocracyDocket/status/2103510843866423348"
      },
      {
        "label": "source 2 ↗",
        "href": "https://bsky.app/profile/democracydocket.com/post/3mwe4esy4dt2i"
      },
      {
        "label": "source 3 ↗",
        "href": "https://www.democracydocket.com/news-alerts/supreme-court-revives-dhs-use-of-flawed-immigration-database-for-voter-purges/"
      }
    ],
    "viewCount": 1078666,
    "lean": "Leans Democratic"
  },
  {
    "id": "save-row-7",
    "who": "Marc Elias",
    "group": "Social media",
    "where": "X",
    "when": "11:48 AM",
    "views": "620,822",
    "said": "The Supreme Court authorized the Trump administration ... to initiate registration purges.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/marcelias/status/2103511976391606444"
      },
      {
        "label": "source 2 ↗",
        "href": "https://elias.law/client-alert/supreme-court-clears-way-for-expanded-save-system/"
      }
    ],
    "viewCount": 620822,
    "lean": "Leans Democratic"
  },
  {
    "id": "save-row-8",
    "who": "AG Todd Blanche",
    "group": "Republican/Trump administration",
    "where": "X",
    "when": "2:48 PM",
    "views": "203,188",
    "said": "Huge victory for election integrity! ... [the stay] will allow states to clear the voter rolls of illegal voters.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/AGToddBlanche/status/2103557217748504767"
      }
    ],
    "viewCount": 203188
  },
  {
    "id": "save-row-9",
    "who": "DHS (James Percival)",
    "group": "Republican/Trump administration",
    "where": "dhs.gov + X",
    "when": "Sept 25; X 12:26 PM",
    "views": "318,429",
    "said": "SAVE may be used going forward ... to stop noncitizens from voting illegally.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.dhs.gov/news/2026/09/25/dhs-applauds-supreme-court-decision-permitting-citizenship-verification-voters"
      },
      {
        "label": "source 2 ↗",
        "href": "https://x.com/DHSGenCounsel/status/2103521437407719881"
      }
    ],
    "viewCount": 318429
  },
  {
    "id": "save-row-10",
    "who": "NBC News",
    "group": "News",
    "where": "X + YouTube",
    "when": "Sept 25; YouTube 4:51 PM",
    "views": "64,662",
    "said": "The information in this database is quite inaccurate.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/NBCNews/status/2103515383617490977"
      },
      {
        "label": "source 2 ↗",
        "href": "https://www.youtube.com/watch?v=d50bhF_eTIc"
      }
    ],
    "viewCount": 64662
  },
  {
    "id": "save-row-11",
    "who": "Wall Street Journal",
    "group": "News",
    "where": "X",
    "when": "Sept 25",
    "views": "50,883",
    "said": "The Court ... could deploy a federal immigration database to check voters' citizenship.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/WSJ/status/2103582128428462342"
      }
    ],
    "viewCount": 50883
  },
  {
    "id": "save-row-12",
    "who": "Reuters",
    "group": "News",
    "where": "reuters.com headline + reprints",
    "when": "11:34 AM",
    "views": "views not published",
    "said": "Headline: Supreme Court restores Trump's mass voter verification system.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.reuters.com/world/supreme-court-restores-trumps-mass-voter-verification-system-2026-09-25/"
      },
      {
        "label": "source 2 ↗",
        "href": "https://www.cnbc.com/2026/09/25/supreme-court-restores-trumps-mass-voter-verification-system.html"
      },
      {
        "label": "source 3 ↗",
        "href": "https://www.livemint.com/news/us-news/trumps-voter-verification-system-returns-what-changed-after-supreme-court-ruling-11790365501392.html"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-13",
    "who": "Mother Jones",
    "group": "News",
    "where": "website",
    "when": "Sept 25",
    "views": "views not published",
    "said": "Supreme Court Allows Trump to Use Flawed Database to Vet Voter Citizenship.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.motherjones.com/politics/2026/09/supreme-court-save-database/"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-14",
    "who": "Common Dreams",
    "group": "News",
    "where": "website",
    "when": "Sept 25",
    "views": "views not published",
    "said": "US Citizens Could Lose Their Right to Vote after the Court gives a green light to Trump's voter purge database.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.commondreams.org/news/supreme-court-trump-voter-database"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-15",
    "who": "Real America's Voice",
    "group": "News",
    "where": "YouTube",
    "when": "4:26 PM",
    "views": "2,078",
    "said": "SCOTUS UNLOCKS VOTER ROLL PURGE.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.youtube.com/watch?v=Hk6rFjtridE"
      }
    ],
    "viewCount": 2078
  },
  {
    "id": "save-row-16",
    "who": "NAACP Legal Defense Fund",
    "group": "Advocacy",
    "where": "naacpldf.org",
    "when": "Sept 26, 10:59 AM",
    "views": "views not published",
    "said": "Allowing the mass challenge and removal of voters through this deeply flawed and error-prone system is a direct assault.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.naacpldf.org/press-release/ldf-strongly-condemns-the-u-s-supreme-courts-decision-to-restore-trump-administrations-save-database/"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-17",
    "who": "League of Women Voters & EPIC (plaintiffs)",
    "group": "Advocacy",
    "where": "statement quoted by NPR",
    "when": "Sept 25",
    "views": "views not published",
    "said": "The ruling puts millions of Americans at risk of being unlawfully targeted ... weeks before the midterm elections.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.npr.org/2026/09/25/nx-s1-5976804/supreme-court-trump-save-noncitizen-voting"
      }
    ],
    "viewCount": 0
  },
  {
    "id": "save-row-18",
    "who": "Libs of TikTok",
    "group": "Social media",
    "where": "X",
    "when": "12:32 PM",
    "views": "1,370,076",
    "said": "All illegal voters need to be REMOVED from the voter rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/libsoftiktok/status/2103523106434285971"
      }
    ],
    "viewCount": 1370076,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-19",
    "who": "Eric Daugherty",
    "group": "Social media",
    "where": "X",
    "when": "11:48 AM",
    "views": "482,237",
    "said": "GREENLIT ... PURGE the voter rolls of illegal voters during the 2026 midterms.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/EricLDaugh/status/2103512062458515770"
      }
    ],
    "viewCount": 482237,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-20",
    "who": "CynicalPublius",
    "group": "Social media",
    "where": "X",
    "when": "Sept 25, 3:10 PM",
    "views": "215,689",
    "said": "TRANSLATION… Trump is eliminating illegal alien, non-citizens from the voter rolls and SCOTUS affirmed this effort.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/CynicalPublius/status/2103562729416171789"
      }
    ],
    "viewCount": 215689,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-21",
    "who": "Baoliaogeming64",
    "group": "Social media",
    "where": "X",
    "when": "Sept 25, 12:13 PM",
    "views": "185,386",
    "said": "Chinese-language post (2,362 likes, 481 reposts); in English: The Supreme Court, by a 6-3 absolute advantage, officially gave the green light! Approved the Trump administration's fully upgraded SAVE citizenship-verification database! This means every state in the country finally has an imperial sword and can freely and drastically clean illegal voters from the voter rolls!",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/Baoliaogeming64/status/2103518355567100142"
      }
    ],
    "viewCount": 185386,
    "lean": "Not yet identified",
    "leanNote": "X About page: based in United States; joined Dec 2020; verified since Dec 2022; 1 username change (Jul 2021); connected via US App Store."
  },
  {
    "id": "save-row-22",
    "who": "Scott Presler",
    "group": "Social media",
    "where": "X",
    "when": "10:23 PM",
    "views": "355,118 (post 1: 290,875; post 2: 64,243)",
    "said": "I'm asking county recorders and election officials to contact DHS for the free SAVE database ...",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/ScottPresler/status/2103671754551955916"
      },
      {
        "label": "source 2 ↗",
        "href": "https://x.com/ScottPresler/status/2103680373335175174"
      }
    ],
    "viewCount": 355118,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-23",
    "who": "derekjonhsonn",
    "group": "Social media",
    "where": "X",
    "when": "Sept 26, 7:21 PM",
    "views": "548",
    "said": "DOGE-enhanced federal SAVE database ... is GREENLIT ... Clean the rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/derekjonhsonn/status/2103988486260892098"
      }
    ],
    "viewCount": 548,
    "lean": "Leans Republican",
    "leanNote": "Self-describes as pro-Trump/MAGA. Not yet verified."
  },
  {
    "id": "save-row-24",
    "who": "MelG_Gibson",
    "group": "Social media",
    "where": "X",
    "when": "Sept 26, 7:57 PM",
    "views": "756",
    "said": "SAVE Database to purge illegal aliens from voter rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/MelG_Gibson/status/2103997295867916796"
      }
    ],
    "viewCount": 756,
    "lean": "Leans Republican",
    "leanNote": "Self-describes as pro-Trump/MAGA. Not yet verified."
  },
  {
    "id": "save-row-25",
    "who": "Josh Howerton (commentaryhower)",
    "group": "Social media",
    "where": "X",
    "when": "Sept 26, 7:58 PM",
    "views": "293",
    "said": "The 6–3 is the green light. Drive it. Purge the rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/commentaryhower/status/2103997664874332287"
      }
    ],
    "viewCount": 293,
    "lean": "Not yet identified"
  },
  {
    "id": "save-row-26",
    "who": "@AsFoundX",
    "group": "Social media",
    "where": "X",
    "when": "Sept 27, 2026, 10:29 AM ET",
    "views": "33,102",
    "said": "SUPREME COURT GREENLIGHTS DOGE VOTER ROLL CLEANUP… approved the DOGE-enhanced SAVE database… designed to purge",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/AsFoundX/status/2104216742008418370"
      }
    ],
    "viewCount": 33102,
    "lean": "Not yet identified",
    "record": "Order only stays the lower-court ruling pending appeal; approves no cleanup."
  }
];

const SAVE_GROUP_LABELS = ["Democratic","Republican/Trump administration","News","Advocacy","Social media"];
const SAVE_GROUP_COLORS = ["#2563eb","#dc2626","#a3a3a3","#0f766e","#f59e0b"];
const SAVE_SOCIAL_INDEX = SAVE_GROUP_LABELS.indexOf("Social media");
const SAVE_BY_VIEWS = [...SAVE_ROWS].sort((a, b) => b.viewCount - a.viewCount);
const SAVE_SOURCE_IDS = SAVE_BY_VIEWS.map((row) => row.id);
const SAVE_SOURCE_LABELS = SAVE_BY_VIEWS.map(
  (row) => `${row.who} — ${row.viewCount ? `${row.viewCount.toLocaleString("en-US")} views` : "views not published"}`,
);
const SAVE_SOURCE_DATA = SAVE_BY_VIEWS.map((row) => row.viewCount);
const SAVE_SOURCE_COLORS = SAVE_BY_VIEWS.map((row) => SAVE_GROUP_COLORS[SAVE_GROUP_LABELS.indexOf(row.group)] ?? "#a3a3a3");
const SAVE_GROUP_DATA = SAVE_GROUP_LABELS.map((group) => SAVE_ROWS.filter((row) => row.group === group).length);
const SAVE_LEAN_LABELS = ["Leans Democratic","Leans Republican","Not yet identified"];
const SAVE_LEAN_COLORS = ["#2563eb","#dc2626","#a3a3a3"];
const SAVE_LEAN_DATA = SAVE_LEAN_LABELS.map(
  (lean) => SAVE_ROWS.filter((row) => row.group === "Social media" && row.lean === lean).length,
);
const SAVE_LEAN_KEYS = SAVE_LEAN_LABELS.map((label, index) => ({ label, color: SAVE_LEAN_COLORS[index] }));
const SAVE_KEYS = [
  { label: "Democratic", color: "#2563eb" },
  { label: "Republican/Trump administration", color: "#dc2626" },
  { label: "News", color: "#a3a3a3" },
  { label: "Advocacy", color: "#0f766e" },
  { label: "Social media", color: "#f59e0b" },
];

function SaveChart({
  title,
  labels,
  data,
  colors,
  horizontal,
  tall,
  keys,
  onPick,
}: {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  horizontal: boolean;
  tall: boolean;
  keys: { label: string; color: string }[];
  onPick: (index: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  useEffect(() => {
    let dead = false;
    loadChartJs().then(() => {
      if (dead || !canvasRef.current) return;
      const Chart = (window as unknown as { Chart: new (el: HTMLCanvasElement, cfg: object) => { destroy: () => void } }).Chart;
      const bg = data.map((_, index) => colors[index % colors.length]);
      chartRef.current?.destroy();
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [{ data, backgroundColor: bg, borderWidth: 0, borderRadius: 6, maxBarThickness: 28 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: horizontal ? "y" : "x",
          plugins: { legend: { display: false }, tooltip: { titleFont: { size: 15 }, bodyFont: { size: 15 } } },
          scales: {
            x: horizontal
              ? { beginAtZero: true, ticks: { color: "#e8e0d0", font: { size: 15 } } }
              : { grid: { display: false }, ticks: { color: "#e8e0d0", autoSkip: false, font: { size: 15 } } },
            y: horizontal
              ? { grid: { display: false }, ticks: { color: "#e8e0d0", autoSkip: false, font: { size: 15 } } }
              : { beginAtZero: true, ticks: { color: "#e8e0d0", font: { size: 15 } } },
          },
          onClick: (_event: unknown, elements: { index: number }[]) => {
            if (elements.length) pickRef.current(elements[0].index);
          },
        },
      });
    });
    return () => {
      dead = true;
      chartRef.current?.destroy();
    };
  }, [title, labels, data, colors, horizontal]);
  return (
    <figure className="w-full rounded-2xl border border-[#d4af37] bg-[#070b12] px-4 py-4">
      <p className="text-center text-[16px] font-semibold text-white">{title}</p>
      <div className={tall ? "relative mt-4 h-[720px]" : "relative mt-4 h-64"}>
        <canvas ref={canvasRef} aria-label={title} />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {keys.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[15px] text-white">
            <span className="inline-block h-3 w-3" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function LawChart({
  title,
  labels,
  data,
  colors,
  type,
  horizontal,
  onPick,
  namesOnChart,
}: {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  type: "bar" | "doughnut";
  horizontal: boolean;
  onPick: (index: number) => void;
  namesOnChart?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const key = JSON.stringify([title, labels, data, colors, type, horizontal, namesOnChart]);
  useEffect(() => {
    let dead = false;
    loadChartJs().then(() => {
      if (dead || !canvasRef.current) return;
      const Chart = (window as unknown as { Chart: new (el: HTMLCanvasElement, cfg: object) => { destroy: () => void } }).Chart;
      chartRef.current?.destroy();
      chartRef.current = new Chart(canvasRef.current, {
        type,
        data: {
          labels,
          datasets: [{ data, backgroundColor: colors, borderWidth: 0, borderRadius: type === "bar" ? 6 : 0, maxBarThickness: 28 }],
        },
        plugins: namesOnChart && labels.length <= 12 ? [{
          id: "sliceNames",
          afterDatasetsDraw(chart: { ctx: CanvasRenderingContext2D; getDatasetMeta: (i: number) => { data: { startAngle: number; endAngle: number; outerRadius: number; x: number; y: number }[] } }) {
            const { ctx } = chart;
            const wrap = (name: string) => {
              const words = name.split(" ");
              const out: string[] = [];
              let line = "";
              for (const word of words) {
                const next = line ? `${line} ${word}` : word;
                if (next.length > 16 && line) {
                  out.push(line);
                  line = word;
                } else line = next;
              }
              if (line) out.push(line);
              return out;
            };
            chart.getDatasetMeta(0).data.forEach((arc, index) => {
              const name = labels[index];
              if (!name) return;
              const mid = (arc.startAngle + arc.endAngle) / 2;
              const cos = Math.cos(mid);
              const sin = Math.sin(mid);
              const lines = [...wrap(name), String(data[index])];
              ctx.save();
              ctx.fillStyle = "#ffffff";
              ctx.font = "600 14px sans-serif";
              ctx.textBaseline = "middle";
              ctx.textAlign = Math.abs(cos) < 0.3 ? "center" : cos > 0 ? "left" : "right";
              const x = arc.x + cos * (arc.outerRadius + 12);
              const y = arc.y + sin * (arc.outerRadius + 12);
              lines.forEach((text, line) => {
                ctx.fillText(text, x, y + (line - (lines.length - 1) / 2) * 16);
              });
              ctx.restore();
            });
          },
        }] : [],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: type === "bar" && horizontal ? "y" : "x",
          layout: namesOnChart ? { padding: { top: 64, right: 150, bottom: 64, left: 150 } } : undefined,
          interaction: type === "bar" ? { mode: "index", intersect: false, axis: horizontal ? "y" : "x" } : undefined,
          plugins: { legend: { display: false } },
          scales: type === "doughnut" ? {} : {
            x: horizontal
              ? { beginAtZero: true, ticks: { color: "#e8e0d0", font: { size: 15 } } }
              : { grid: { display: false }, ticks: { color: "#e8e0d0", font: { size: 15 } } },
            y: horizontal
              ? { grid: { display: false }, ticks: { color: "#e8e0d0", font: { size: 15 } } }
              : { beginAtZero: true, ticks: { color: "#e8e0d0", font: { size: 15 } } },
          },
          onClick: (_event: unknown, elements: { index: number }[]) => {
            if (elements.length) pickRef.current(elements[0].index);
          },
        },
      });
    });
    return () => {
      dead = true;
      chartRef.current?.destroy();
    };
  }, [key]);
  return <canvas ref={canvasRef} aria-label={title} />;
}

function lawLocal(href: string) {
  const mark = "/lawfare-docs/";
  const at = href.indexOf(mark);
  return at >= 0 ? href.slice(at) : href;
}

const LAW_HOME: Record<string, string> = {
  "Trump Trials": "/images/topic-trials.jpg",
  Impeachments: "/images/topic-impeach.jpg",
  "US Citizen Lawfare": "/images/topic-citizen.jpg",
  "Politicians' bail funds": "/images/topic-bail.jpg",
  "Scrutiny compared": "/images/topic-scrutiny.jpg",
  "Assassination attempts": "/images/topic-attempts.jpg",
  "First 100 days": "/images/topic-first100.jpg",
  "Lawfare Evidence": "/images/topic-law-evidence.jpg",
  House: "/images/topic-house-ethics.jpg",
  Senate: "/images/topic-senate-ethics.jpg",
};

const HOUSE_CODE_PAGES = ["01", "02", "03"].map((page) => `/ethics-docs/house-pages/page-${page}.jpg`);
const SENATE_CODE_PAGES = Array.from({ length: 63 }, (_, index) => `/ethics-docs/senate-pages/page-${String(index + 1).padStart(2, "0")}.jpg`);

function EthicsGroupChart({
  title,
  labels,
  series,
}: {
  title: string;
  labels: string[];
  series: { label: string; color: string; data: number[] }[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const key = JSON.stringify([title, labels, series]);
  useEffect(() => {
    let dead = false;
    loadChartJs().then(() => {
      if (dead || !canvasRef.current) return;
      const Chart = (window as unknown as { Chart: new (el: HTMLCanvasElement, cfg: object) => { destroy: () => void } }).Chart;
      chartRef.current?.destroy();
      const wide = labels.length > 4;
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: series.map((item) => ({
            label: item.label,
            data: item.data,
            backgroundColor: item.color,
            borderWidth: 0,
            borderRadius: 6,
            maxBarThickness: 22,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: wide ? "y" : "x",
          plugins: { legend: { display: false }, tooltip: { titleFont: { size: 15 }, bodyFont: { size: 15 } } },
          scales: {
            x: wide
              ? { beginAtZero: true, ticks: { color: "#e8e0d0", font: { size: 15 } } }
              : { grid: { display: false }, ticks: { color: "#e8e0d0", font: { size: 15 } } },
            y: wide
              ? { grid: { display: false }, ticks: { color: "#e8e0d0", font: { size: 15 } } }
              : { beginAtZero: true, ticks: { color: "#e8e0d0", font: { size: 15 } } },
          },
        },
      });
    });
    return () => {
      dead = true;
      chartRef.current?.destroy();
    };
  }, [key]);
  return (
    <figure className="mt-4 w-full rounded-2xl border border-[#d4af37] bg-[#070b12] px-4 py-4">
      <p className="text-center text-[16px] font-semibold text-white">{title}</p>
      <div className={labels.length > 4 ? "relative mt-4 h-[420px]" : "relative mt-4 h-80"}>
        <canvas ref={canvasRef} aria-label={title} />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {series.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[15px] text-white">
            <span className="inline-block h-3 w-3" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function EthicsSummary({ which }: { which: "house" | "senate" }) {
  const link = (href: string, label: string) => (
    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={NEWS_DOOR + " text-left"}>
      {label}
    </a>
  );
  if (which === "senate") {
    return (
      <div className="mt-6 w-full text-left">
        <p className="text-[16px] font-semibold text-white">The rules</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>Rule 34. Public financial disclosure. The Ethics in Government Act’s disclosure title is a Senate rule.</li>
          <li>Rule 35. No gift unless the rule allows it. A gift under $50 may be accepted, and gifts from one source must stay under $100 in a year. A gift from a registered lobbyist, a foreign agent, or an entity that retains one is not allowed under that exception.</li>
          <li>Rule 36. Outside earned income. The Ethics in Government Act limit is a Senate rule.</li>
          <li>Rule 37. No pay that comes from improperly using a Senate position. No paid outside work that conflicts with official duties. Officers and employees report that work when it starts and each May 15.</li>
          <li>Rule 38. No unofficial office account.</li>
          <li>Rule 39. A Senator whose term is ending may not take government funds for foreign travel after the stated cutoff unless the Senate or the President authorizes it.</li>
          <li>Rule 40. Franking, and Senate radio and television studios.</li>
          <li>Rule 41. An officer or employee may not receive, solicit, hold, or distribute funds for a federal campaign. A Senator may designate three assistants and must file that designation.</li>
          <li>Rule 42. No refusal to hire, firing, or discrimination in Senate employment because of race, color, religion, sex, national origin, age, or physical handicap.</li>
          <li>Rule 43. A Senator may ask an executive or independent agency for information, status, a meeting, a judgment, or reconsideration.</li>
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          {link("/ethics-docs/senate-code-of-official-conduct.pdf", "Senate Code of Official Conduct, in this file")}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 w-full text-left">
      <p className="text-[16px] font-semibold text-white">The rules</p>
      <p className="mt-2 text-[15px] leading-snug text-white/85">
        House Rule XXIII is the Code of Official Conduct. These are the main lines. The full text is on the Code of Official Conduct tile.
      </p>
      <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
        <li>Behave in a way that reflects creditably on the House, and follow the spirit and the letter of the rules.</li>
        <li>No pay that comes from improperly using a House position. No gifts or honoraria except where Rule XXV allows them.</li>
        <li>Campaign money stays separate from personal money and is not converted to personal use.</li>
        <li>No employee who is not doing the work, and no relative on the payroll, with a narrow exception for jobs that began before the 113th Congress.</li>
        <li>No employment discrimination, including sexual harassment. No sexual relationship with a supervised House employee. Spouses are excepted.</li>
        <li>After a qualifying conviction, refrain from committee business and from voting. After a qualifying felony charge, resign committees and step aside from party leadership.</li>
        <li>No private flight paid with personal, official, or campaign funds except the listed exceptions. No earmark traded for a vote. An earmark request must certify that the Member and spouse have no financial interest in it.</li>
        <li>No service as an officer or director of a public company. No retaliation for truthful information given to the ethics offices or to law enforcement. No willful public naming of a protected whistleblower except as the rule allows.</li>
      </ul>
      <div className="mt-4 flex flex-col gap-2">
        {link("/ethics-docs/house-rules-119.pdf#page=42", "House Rule XXIII, in this file")}
      </div>
    </div>
  );
}

function EthicsRecord({ which }: { which: "house" | "senate" }) {
  const link = (href: string, label: string) => (
    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={NEWS_DOOR + " text-left"}>
      {label}
    </a>
  );
  if (which === "senate") {
    return (
      <div className="mt-6 w-full text-left">
        <p className="text-[15px] leading-snug text-white/85">
          These are the Select Committee on Ethics annual reports required by the Honest Leadership and Open Government Act. The reports give counts. They do not name the person, and they do not attach the complaint or the investigation file.
        </p>
        <EthicsGroupChart
          title="Senate ethics allegations, 2023–2025"
          labels={["2023", "2024", "2025"]}
          series={[
            { label: "Alleged violations received", color: "#d4af37", data: [145, 158, 181] },
            { label: "Dismissed: no jurisdiction, or no violation even if true", color: "#8a8175", data: [112, 142, 150] },
            { label: "Dismissed: not enough facts", color: "#c4b48a", data: [20, 7, 10] },
            { label: "Preliminary inquiry", color: "#e8e0d0", data: [19, 15, 27] },
            { label: "Adjudicatory review", color: "#2563eb", data: [0, 1, 0] },
            { label: "Letter of admonition", color: "#0f766e", data: [1, 1, 0] },
            { label: "Disciplinary sanction", color: "#dc2626", data: [0, 0, 0] },
          ]}
        />
        <p className="mt-6 text-[16px] font-semibold text-white">2023 report, printed January 31, 2024</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>145 alleged violations received. Six more were carried in from earlier years.</li>
          <li>112 dismissed for lack of jurisdiction, or because no Senate rule would be violated even if the allegation were true.</li>
          <li>20 dismissed because the complaint did not state facts of a material violation.</li>
          <li>19 preliminary inquiries. That number includes the 6 matters carried in.</li>
          <li>0 adjudicatory reviews. That is the stage at which the committee tries a charge.</li>
          <li>12 of the inquiries were then dismissed for lack of substantial merit, or as inadvertent, technical, or de minimis.</li>
          <li>1 letter of admonition. The report does not name the person and does not include the letter.</li>
          <li>0 disciplinary sanctions.</li>
        </ul>
        <p className="mt-6 text-[16px] font-semibold text-white">2024 report, printed January 28, 2025</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>158 alleged violations received. Six more were carried in.</li>
          <li>142 dismissed for lack of jurisdiction, or because no rule would be violated even if true.</li>
          <li>7 dismissed for lack of facts.</li>
          <li>15 preliminary inquiries, including the 6 carried in.</li>
          <li>1 adjudicatory review.</li>
          <li>8 inquiries dismissed for lack of substantial merit, or as inadvertent, technical, or de minimis.</li>
          <li>1 letter of admonition. The report does not name the person and does not include the letter.</li>
          <li>0 disciplinary sanctions.</li>
        </ul>
        <p className="mt-6 text-[16px] font-semibold text-white">2025 report, printed January 31, 2026</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>181 alleged violations received. Five more were carried in.</li>
          <li>150 dismissed for lack of jurisdiction, or because no rule would be violated even if true.</li>
          <li>10 dismissed for lack of facts.</li>
          <li>27 preliminary inquiries, including the 5 carried in.</li>
          <li>0 adjudicatory reviews.</li>
          <li>18 inquiries dismissed for lack of substantial merit, or as inadvertent, technical, or de minimis.</li>
          <li>0 letters of admonition.</li>
          <li>0 disciplinary sanctions.</li>
        </ul>
        <p className="mt-6 text-[16px] font-semibold text-white">What is not in the public record</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>There is no outside office for the Senate comparable to the House Office of Congressional Conduct. Six Senators receive the complaints.</li>
          <li>The statute requires numbers. It does not require names, the complaint, or the investigative file.</li>
          <li>The committee has not published an investigation document for these allegations. The annual reports are the official public record of them.</li>
        </ul>
        <p className="mt-6 text-[16px] font-semibold text-white">Official documents</p>
        <div className="mt-3 flex flex-col gap-2">
          {link("https://www.congress.gov/118/crec/2024/01/31/170/18/CREC-2024-01-31-pt1-PgS306-4.pdf", "Congressional Record, January 31, 2024, the 2023 report")}
          {link("https://www.congress.gov/119/crec/2025/01/28/171/18/CREC-2025-01-28-senate.pdf", "Congressional Record, January 28, 2025, the 2024 report")}
          {link("https://www.ethics.senate.gov/public/index.cfm?a=files.serve&File_id=65D869B2-5C90-4C08-B49E-6689611DA08D", "Select Committee on Ethics, 2025 annual report")}
          {link("https://www.congress.gov/congressional-record/volume-172/issue-21/senate-section/article/S374-1", "Congressional Record, January 31, 2026, the 2025 report")}
          {link("https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title2-section4723&num=0&edition=prelim", "2 U.S.C. § 4723, the annual-report statute")}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 w-full text-left">
      <p className="text-[15px] leading-snug text-white/85">
        The House does not publish a complaints-received total in the Senate’s categories. These figures are from the Committee on Ethics Summary of Activities for the 118th Congress, adopted January 2, 2025, and from the Office of Congressional Ethics Fourth Quarter 2024 report. A citizen letter is not an opened investigation.
      </p>
      <EthicsGroupChart
        title="House Committee on Ethics, 118th Congress"
        labels={["Matters open", "Newly opened", "Carried in", "Outside referrals", "Subcommittees", "Public resolutions", "Confidential resolutions", "Reports to the House"]}
        series={[{ label: "118th Congress", color: "#d4af37", data: [41, 29, 12, 15, 3, 9, 12, 5] }]}
      />
      <EthicsGroupChart
        title="Office of Congressional Ethics, 118th Congress"
        labels={["Reviews begun", "Sent on for further review", "Stopped in the first phase", "Dismissed after a second review"]}
        series={[{ label: "118th Congress", color: "#c4b48a", data: [23, 9, 8, 6] }]}
      />
      <ul className="mt-6 list-disc pl-5 text-[15px] leading-snug text-white/85">
        <li>41 investigative matters were open in the Congress: 12 carried in from the 117th, and 29 begun in the 118th.</li>
        <li>The outside office referred 15 matters: 9 for further review and 6 with a recommendation to dismiss every allegation. None was sent as a tie.</li>
        <li>The committee impaneled 3 investigative subcommittees: George Santos, Sheila Cherfilus-McCormick, and Henry Cuellar. It held 19 subcommittee meetings, authorized 108 subpoenas, and reviewed over 1,469,945 pages.</li>
        <li>It filed 5 reports with the House, about 1,688 pages. It publicly addressed 20 matters and resolved 12 more. Nine matters were still pending on January 2, 2025.</li>
        <li>12 resolutions were confidential. Most investigations under Committee Rule 18(a) stay confidential. The committee generally announces a case only when it votes to impanel a subcommittee.</li>
        <li>The committee did not seek a House sanction in any matter in the 118th Congress. Since 2008 it has recommended one censure, recommended three reprimands, and issued 16 reprovals. It says an admonishment is not a formal sanction.</li>
        <li>Sending substantial evidence of a crime to federal or state authorities takes the approval of the House or a two-thirds vote of the committee.</li>
        <li>From February 2009 through the 118th Congress, the outside office began 258 investigations: 111 referred for further review, 139 terminated or dismissed, 1 unresolved, and 7 lost because the office lost jurisdiction. It received about 29,751 communications in the 118th Congress and about 88,010 since 2009. Those totals include requests for information.</li>
      </ul>
      <p className="mt-6 text-[16px] font-semibold text-white">The 20 matters the committee publicly addressed</p>
      <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
        <li>Sanford Bishop Jr. Dismissed on December 30, 2024.</li>
        <li>Jamaal Bowman. The House censured him on December 7, 2023. The committee then said further review would be moot and took no further action. That censure was a House vote, not a committee sanction.</li>
        <li>Sheila Cherfilus-McCormick. The investigative subcommittee had not finished when the Congress ended.</li>
        <li>Henry Cuellar. The investigative subcommittee had not finished when the Congress ended.</li>
        <li>Matt Gaetz. The committee found he did not violate federal sex-trafficking laws. It did find sexual misconduct, illegal drug use, a House gift-rule violation, special favors, and an attempt to obstruct the investigation. He resigned on November 14, 2024. The committee filed a report with dissenting views on December 23, 2024.</li>
        <li>Bill Huizenga. The committee voted that a sanction was not merited, sent a private letter, and on June 5, 2024 filed a report taking no further action.</li>
        <li>Wesley Hunt. Dismissed on December 30, 2024.</li>
        <li>Ronny Jackson. Dismissed on December 30, 2024.</li>
        <li>Mike Kelly. Not completed when the Congress ended.</li>
        <li>Doug Lamborn. He did not seek reelection. The committee lost jurisdiction on January 3, 2025.</li>
        <li>Michael McCaul. The committee voted not to impanel a subcommittee. On December 23, 2024 it filed a report taking no further action.</li>
        <li>Cory Mills. Not completed when the Congress ended.</li>
        <li>Alex Mooney. Dismissed on December 30, 2024.</li>
        <li>Troy Nehls. Not completed when the Congress ended.</li>
        <li>Alexandria Ocasio-Cortez. Not completed when the Congress ended.</li>
        <li>Andy Ogles. Not completed when the Congress ended. The committee said it would continue under Rule 18(a).</li>
        <li>George Santos. On November 16, 2023 the committee adopted the subcommittee report and referred substantial evidence of potential federal crimes to the Department of Justice. It did not seek a House sanction. The House later expelled him by its own vote.</li>
        <li>Adam Schiff. The House directed an investigation. The committee did not reach consensus on the investigative steps.</li>
        <li>Victoria Spartz. The committee voted not to impanel a subcommittee. On November 12, 2024 it filed a report taking no further action. That report is H. Rept. 118-731.</li>
        <li>A referral from the January 6 select committee. The committee did not reach consensus on the investigative steps.</li>
      </ul>
      <p className="mt-6 text-[16px] font-semibold text-white">Official documents</p>
      <p className="mt-2 text-[15px] leading-snug text-white/85">
        The Summary of Activities is the committee’s own account of all 20 public matters. The 12 confidential resolutions are not published. The outside office does not publish reviews it stops in the first phase, or dismissals the committee accepts.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {link("https://ethics.house.gov/wp-content/uploads/2025/01/Committee-Report.pdf", "Committee on Ethics, Summary of Activities, 118th Congress, January 2, 2025")}
        {link("https://www.congress.gov/committee-report/118th-congress/house-report/973", "H. Rept. 118-973, the same summary on Congress.gov")}
        {link("https://ethics.house.gov/committee-reports/matter-allegations-relating-representative-george-santos-0/", "Committee report, George Santos, November 16, 2023")}
        {link("https://www.congress.gov/committee-report/118th-congress/house-report/274", "H. Rept. 118-274, George Santos")}
        {link("https://ethics.house.gov/committee-reports/in-the-matter-of-allegations-relating-to-representative-victoria-spartz/", "Committee report, Victoria Spartz, H. Rept. 118-731, November 12, 2024")}
        {link("https://conduct.house.gov/sites/evo-subsites/oce.house.gov/files/evo-media-document/oce-fourth-quarter-2024-report_vf.pdf", "Office of Congressional Ethics, Fourth Quarter 2024 report")}
        {link("https://conduct.house.gov/docs/investigations", "Office of Congressional Conduct, public investigations index")}
      </div>
    </div>
  );
}

const LAW_TILES: Record<string, string> = {
  status: "/images/tile-case-status.jpg",
  period: "/images/tile-cases-by-period.jpg",
  who: "/images/tile-who-brought.jpg",
  court: "/images/tile-which-courts.jpg",
  impeach: "/images/tile-impeachments.jpg",
  referrals: "/images/tile-doj-referrals.jpg",
  deception: "/images/tile-lawfare-deception.jpg",
};

function LawfareScreen({
  pick,
  caseId,
  href,
  onPick,
  onCase,
  onSource,
  onBack,
}: {
  pick: string | null;
  caseId: string | null;
  href: string | null;
  onPick: (value: string) => void;
  onCase: (value: string) => void;
  onSource: (value: string) => void;
  onBack: () => void;
}) {
  const chart = pick && !pick.includes(":") && !caseId && !href ? lawfareCases.charts.find((item) => item.id === pick) : undefined;
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="border-0 bg-transparent p-0 text-center text-[18px] font-semibold tracking-wide text-white"
      >
        {chart ? chart.title : "Lawfare Evidence"}
      </button>
      {!pick && !caseId && !href ? <TileDonut spec={DONUTS.lawEvidence} /> : null}
      <LawfareLayer pick={pick} caseId={caseId} href={href} onPick={onPick} onCase={onCase} onSource={onSource} />
    </>
  );
}

function LawfareLayer({
  pick,
  caseId,
  href,
  onPick,
  onCase,
  onSource,
  onImpeach,
}: {
  pick: string | null;
  caseId: string | null;
  href: string | null;
  onPick: (value: string) => void;
  onCase: (value: string) => void;
  onSource: (value: string) => void;
  onImpeach?: (file: "2019" | "2021" | "clinton") => void;
}) {
  const file = lawfareCases;
  const chart = pick ? file.charts.find((item) => item.id === pick.split(":")[0]) : undefined;
  const index = pick && pick.includes(":") ? Number(pick.split(":")[1]) : -1;
  if (href) {
    return (
      <SourcePage
        label={href}
        href={lawLocal(href)}
      />
    );
  }
  if (caseId && pick === "deception") {
    const row = fakeNewsCases.find((item) => item.id === caseId);
    if (!row) return <p className="mt-8 text-[15px] text-white">Not on record.</p>;
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[16px] font-semibold text-white">{row.who}</p>
        <p className="mt-2 text-[15px] text-white/85">{row.began}</p>
        <p className="mt-4 text-[16px] font-semibold text-white">What they said</p>
        <p className="mt-2 text-[15px] leading-snug text-white/85">{row.said}</p>
        <p className="mt-4 text-[16px] font-semibold text-white">What the record shows</p>
        <p className="mt-2 text-[15px] leading-snug text-white/85">{row.record}</p>
        <ClaimSaid sources={row.sources} onSource={onSource} />
        <div className="mt-4 flex flex-wrap gap-2">
          {row.sources.map((source) => (
            <button key={source.href} type="button" onClick={() => onSource(source.href)} className={NEWS_DOOR + " w-fit"}>
              {source.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (caseId && chart?.id === "impeach") {
    const row = chart.rows?.find((item) => item.name === caseId);
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[16px] font-semibold text-white">{row?.name ?? "Not on record."}</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>Impeachments: {row?.note ?? "Not on record."}</li>
        </ul>
        <div className="mt-6 flex flex-wrap items-end justify-center gap-8">
          {row?.name === "Trump" ? (
            <>
              {(
                [
                  ["First impeachment, 2019", "/images/tile-impeach-2019.jpg", () => onImpeach?.("2019")],
                  ["Second impeachment, 2021", "/images/tile-impeach-2021.jpg", () => onImpeach?.("2021")],
                  ["House list of impeachments", "/images/tile-impeach-list.jpg", () => onSource("https://history.house.gov/Institution/Impeachment/Impeachment-List/")],
                  ["How federal impeachment works", "/images/tile-impeach-works.jpg", () => onSource("https://www.usa.gov/impeachment")],
                ] as const
              ).map(([label, src, open]) => (
                <button key={label} type="button" onClick={open} className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0">
                  <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">{label}</span>
                  <img src={src} alt="" className="h-52 w-52 rounded-2xl border border-white/30 object-cover" />
                </button>
              ))}
            </>
          ) : (
            <>
              {(chart.sources ?? []).map((source) => (
                <button key={source.href} type="button" onClick={() => onSource(source.href)} className={NEWS_DOOR + " w-fit"}>
                  {source.label}
                </button>
              ))}
              {row?.name === "Clinton" ? (
                <button type="button" onClick={() => onImpeach?.("clinton")} className={NEWS_DOOR + " w-fit"}>Clinton record</button>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  }
  if (caseId && chart?.id === "referrals") {
    const row = Object.values(chart.rowsByLabel ?? {}).flat().find((item) => item.name === caseId);
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[16px] font-semibold text-white">{row?.name ?? "Not on record."}</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>Group: {row?.group ?? "Not on record."}</li>
          <li>Referred: {row?.referred ?? "Not on record."}</li>
          <li>Outcome: {row?.outcome ?? "Not on record."}</li>
          <li>{row?.detail ?? "Not on record."}</li>
          {row && "flag" in row && row.flag ? <li>{row.flag}</li> : null}
        </ul>
        {row?.href && row.href !== "Not on record" ? (
          <button type="button" onClick={() => onSource(row.href)} className={NEWS_DOOR + " mt-4 w-fit"}>
            Open the source
          </button>
        ) : (
          <p className="mt-4 text-[15px] text-white/80">Not on record.</p>
        )}
      </div>
    );
  }
  if (caseId) {
    const row = file.cases.find((item) => item.id === caseId);
    if (!row) return <p className="mt-8 text-[15px] text-white">Not on record.</p>;
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[16px] font-semibold text-white">{row.caseName}</p>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>Court: {row.court}</li>
          <li>Docket: {row.docketNumber}</li>
          <li>Who brought it: {row.broughtBy}</li>
          <li>Filed: {row.filedDate}</li>
          <li>Charges: {row.charges}</li>
          <li>Current status: {row.currentStatus}</li>
          <li>Outcome: {row.outcome}</li>
        </ul>
        <p className="mt-4 text-[16px] font-semibold text-white">Key rulings</p>
        <ul className="mt-2 list-disc pl-5 text-[15px] leading-snug text-white/85">
          {row.rulings.length ? row.rulings.map((item) => (
            <li key={item.date + item.summary}>{item.date} · {item.court} · {item.summary}</li>
          )) : <li>{row.keyRulings}</li>}
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          {row.links.map((link) => (
            <button key={link.href} type="button" onClick={() => onSource(link.href)} className={NEWS_DOOR + " text-left"}>
              {link.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (pick === "deception") {
    const rows = file.deceptionIds
      .map((id) => fakeNewsCases.find((item) => item.id === id))
      .filter((item): item is (typeof fakeNewsCases)[number] => !!item);
    return (
      <div className="mt-8 flex w-full flex-col gap-3">
        <p className="text-center text-[16px] font-semibold text-white">Deception about Lawfare · {rows.length}</p>
        {rows.map((row) => (
          <button key={row.id} type="button" onClick={() => onCase(row.id)} className={LAYER_ROW}>
            {row.who} · {row.began}
            <span className="mt-1 block font-normal text-white/80">{row.statusLabel}</span>
          </button>
        ))}
      </div>
    );
  }
  if (chart && index >= 0) {
    if (chart.id === "impeach") {
      const row = chart.rows?.[index];
      return (
        <div className="mt-8 flex w-full flex-col gap-3">
          <p className="text-center text-[16px] font-semibold text-white">{chart.labels[index]} · {chart.data[index]}</p>
          {row ? (
            <button type="button" onClick={() => onCase(row.name)} className={LAYER_ROW}>
              {row.name} · {row.note}
            </button>
          ) : <p className="text-[15px] text-white">Not on record.</p>}
        </div>
      );
    }
    if (chart.id === "referrals") {
      const label = chart.labels[index];
      const rows = (chart.rowsByLabel as Record<string, { name: string; group: string; outcome: string }[]>)[label] ?? [];
      return (
        <div className="mt-8 flex w-full flex-col gap-3">
          <p className="text-center text-[16px] font-semibold text-white">{label} · {chart.data[index]}</p>
          {rows.map((row) => (
            <button key={row.name} type="button" onClick={() => onCase(row.name)} className={LAYER_ROW}>
              {row.name}
              <span className="mt-1 block font-normal text-white/80">{row.group} · {row.outcome}</span>
            </button>
          ))}
        </div>
      );
    }
  }
  if (chart && pick && pick.includes(":")) {
    const all = pick.endsWith(":all");
    const ids = all ? file.cases.map((item) => item.id) : (chart.caseIds[index] ?? []);
    const rows = ids.map((id) => file.cases.find((item) => item.id === id)).filter((item): item is (typeof file.cases)[number] => !!item);
    return (
      <div className="mt-8 flex w-full flex-col gap-3">
        <p className="text-center text-[16px] font-semibold text-white">{all ? "All cases" : chart.labels[index]} · {rows.length}</p>
        {rows.length === 0 ? <p className="text-center text-[15px] text-white/80">Not on record.</p> : null}
        {rows.map((row) => (
          <button key={row.id} type="button" onClick={() => onCase(row.id)} className={LAYER_ROW}>
            {row.shortName}
            <span className="mt-1 block font-normal text-white/80">{row.shortStatus}</span>
          </button>
        ))}
      </div>
    );
  }
  if (chart) {
    return (
      <LayerChart
        title={chart.title}
        line={file.asOf}
        labels={chart.labels}
        data={chart.data}
        colors={chart.labels.map((_, bar) => chart.colors[bar] ?? chart.colors[0])}
        type={chart.type === "doughnut" ? "doughnut" : "bar"}
        horizontal={chart.horizontal}
        bullets={chart.bullets.slice(0, 3)}
        center={chart.id === "status" ? { big: String(file.cases.length), small: "Cases", onOpen: () => onPick("status:all") } : undefined}
        onPick={(bar) => onPick(`${chart.id}:${bar}`)}
      />
    );
  }
  return (
    <LayerTiles
      tiles={[
        ...file.charts.map((item) => ({
          key: item.id,
          label: item.title,
          image: LAW_TILES[item.id] ?? `/images/tile-${item.id}.jpg`,
          onOpen: () => onPick(item.id),
        })),
        { key: "deception", label: "Deception about Lawfare", image: LAW_TILES.deception, onOpen: () => onPick("deception") },
      ]}
      square
    />
  );
}

const CHECKER_TABLE = ((factCheckerVetting as unknown as { table?: string[][] }[]).find((section) => section.table)?.table ?? []).map(
  (row) => ({ name: row[0], owner: row[1], ifcn: row[2], outcome: row[3], confirms: row[4] }),
);
const CHECKER_GROUPS = ["Approved", "Approved with caution", "Rejected"];
const CHECKER_COLORS = ["#16a34a", "#f59e0b", "#dc2626"];
const CHECKER_TILES = ["/images/tile-approved.jpg", "/images/tile-approved-caution.jpg", "/images/tile-rejected.jpg"];
const CHECKER_DATA = CHECKER_GROUPS.map((group) => CHECKER_TABLE.filter((row) => row.outcome === group).length);
const CHECKER_MARK = / ?(link|source \d+) ↗/g;

function checkerDetail(name: string) {
  const row = CHECKER_TABLE.find((item) => item.name === name);
  const section = factCheckerVetting.find((item) => row && item.title === `${row.name} ${row.outcome}`);
  const bullets: string[] = [];
  const links: { label: string; href: string }[] = [];
  let next = 0;
  (section?.paras ?? []).forEach((para) => {
    const topic = para.includes(":") ? para.slice(0, para.indexOf(":")) : "Source";
    for (const found of para.matchAll(CHECKER_MARK)) {
      const link = section?.links[next];
      next += 1;
      if (link) links.push({ label: found[1] === "link" ? topic : `${topic} · ${found[1]}`, href: link.href });
    }
    const text = para.replace(CHECKER_MARK, "").trim();
    if (text) bullets.push(text);
  });
  (section?.links ?? []).slice(next).forEach((link) => links.push(link));
  const seen = new Set<string>();
  return {
    row,
    bullets,
    links: links.filter((link) => {
      const key = link.label + link.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  };
}

function caseBlob(row: NewsCaseRow) {
  return `${row.who} ${row.said} ${row.record} ${row.sources.map((item) => item.href).join(" ")}`;
}

const CARD_CASES: Record<string, { note?: string; match: (row: NewsCaseRow) => boolean }> = {
  Democrats: { match: (row) => row.party === "Democratic" },
  Republicans: { match: (row) => row.party === "Republican" },
  ABC: { match: (row) => row.networkName === "ABC News" },
  CBS: { match: (row) => row.networkName === "CBS News" },
  NBC: { match: (row) => row.networkName === "NBC News" },
  Fox: { match: (row) => row.networkName.includes("Fox") },
  CNN: { match: (row) => row.networkName === "CNN" },
  "MS NOW": { note: "Listed as MSNBC in our case file", match: (row) => row.networkName === "MSNBC" || row.networkName === "MS NOW" },
  Anchors: { note: "Named anchor or host in the case text", match: (row) => newsClass(row).role === "Anchor" },
  Correspondents: { note: "Named correspondent or reporter in the case text", match: (row) => newsClass(row).role === "Correspondent / reporter" },
  Facebook: { note: "The case text names Facebook", match: (row) => /facebook/i.test(caseBlob(row)) },
  Instagram: { note: "The case text names Instagram", match: (row) => /instagram/i.test(caseBlob(row)) },
  TikTok: { note: "The case text names TikTok", match: (row) => /tiktok/i.test(caseBlob(row)) },
  X: { note: "The case text names X or Twitter", match: (row) => /twitter|(?:^|[^a-z])x(?:[^a-z]|$)|x\.com/i.test(caseBlob(row)) },
  Threads: { note: "The case text names Threads", match: (row) => /threads/i.test(caseBlob(row)) },
  "Truth Social": { note: "The case text names Truth Social", match: (row) => /truth social/i.test(caseBlob(row)) },
  YouTube: { note: "The case text names YouTube", match: (row) => /youtube|youtu\.be/i.test(caseBlob(row)) },
  Rumble: { note: "The case text names Rumble", match: (row) => /rumble/i.test(caseBlob(row)) },
};

function newsClass(row: NewsCaseRow): { role: string; platforms: string[] } {
  const found = (row as { classification?: { role: string; platforms: string[] } }).classification;
  return found ?? { role: "Not classified", platforms: [] };
}
const CARD_DIM = NEWS_DIMS[0];

function savePostsFor(card: string) {
  if (card === "X") {
    return SAVE_ROWS.filter((row) => row.where.includes("X")).map((row) => ({
      who: row.who,
      views: row.views,
      said: row.said,
      href: row.links[0]?.href,
      group: row.group,
    }));
  }
  if (card === "YouTube") {
    return [
      { who: "NBC News", views: "4,146", said: "SCOTUS allows use of database for possible voter purge.", href: "https://www.youtube.com/watch?v=d50bhF_eTIc", group: "News" },
      { who: "Real America's Voice", views: "2,078", said: "SCOTUS UNLOCKS VOTER ROLL PURGE.", href: "https://www.youtube.com/watch?v=Hk6rFjtridE", group: "News" },
    ];
  }
  return [];
}

function PersonCharts({
  rows,
  slice,
  onSlice,
  onSource,
}: {
  rows: NewsCaseRow[];
  slice: string | null;
  onSlice: (value: string) => void;
  onSource: (href: string) => void;
}) {
  const partyColor: Record<string, string> = {
    Democratic: "#1d4ed8",
    Republican: "#b91c1c",
    "News outlets": "#a16207",
    "Social media": "#6d28d9",
    Campaigns: "#0f766e",
    "Advocacy groups": "#14532d",
    "Not yet identified": "#52525b",
  };
  if (slice?.startsWith("party|") || slice?.startsWith("method|")) {
    const [kind, name, person] = slice.split("|");
    const matched = rows.filter((row) => (kind === "party" ? row.party : bucketOf(row.method)) === name);
    if (!person) {
      const map = new Map<string, number>();
      matched.forEach((row) => {
        const who = row.person && row.person !== "Not yet identified" ? row.person : "Not yet identified";
        map.set(who, (map.get(who) ?? 0) + 1);
      });
      const people = [...map.entries()].sort((a, b) => b[1] - a[1]);
      return (
        <div className="mt-6 flex w-full flex-col gap-2">
          <p className="text-center text-[18px] font-semibold text-white">{name} · {matched.length}</p>
          <p className="text-center text-[15px] text-white/80">By person.</p>
          {people.map(([who, count]) => (
            <button key={who} type="button" onClick={() => onSlice(`${kind}|${name}|${who}`)} className="w-full rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] font-semibold text-white">
              {who} · {count}
            </button>
          ))}
        </div>
      );
    }
    const list = matched.filter((row) => (row.person && row.person !== "Not yet identified" ? row.person : "Not yet identified") === person);
    return (
      <div className="mt-6 flex w-full flex-col gap-2">
        <p className="text-center text-[18px] font-semibold text-white">{person} · {list.length}</p>
        {list.map((row) => (
          <button key={row.id} type="button" onClick={() => row.sources[0] && onSource(row.sources[0].href)} className="w-full rounded-2xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] leading-snug text-white">
            <span className="block font-semibold">{row.person}</span>
            <span className="block">{row.network}</span>
            <span className="block">Method of deception: {row.method}</span>
            <span className="block">{row.said}</span>
          </button>
        ))}
      </div>
    );
  }
  const partyMap = new Map<string, number>();
  const methodMap = new Map<string, number>();
  rows.forEach((row) => {
    partyMap.set(row.party, (partyMap.get(row.party) ?? 0) + 1);
    const method = bucketOf(row.method);
    methodMap.set(method, (methodMap.get(method) ?? 0) + 1);
  });
  const parties = [...partyMap.entries()].sort((a, b) => b[1] - a[1]);
  const methods = [...methodMap.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <div className="mt-6 flex w-full flex-col gap-8">
      <LayerChart
        title="By political party"
        line="Tap a color. The people are behind it."
        labels={parties.map(([label]) => label)}
        data={parties.map(([, count]) => count)}
        colors={parties.map(([label]) => partyColor[label] ?? "#334155")}
        keys={parties.map(([label, count], index) => ({ label: `${label} · ${count}`, color: partyColor[label] ?? "#334155", index }))}
        type="doughnut"
        horizontal={false}
        bullets={[]}
        colorKey
        onPick={(index) => onSlice(`party|${parties[index][0]}`)}
      />
      <LayerChart
        title="By method of deception"
        line="Tap a color. The people are behind it."
        labels={methods.map(([label]) => label)}
        data={methods.map(([, count]) => count)}
        colors={methods.map(([label]) => BUCKET_COLOR[label] ?? "#334155")}
        keys={methods.map(([label, count], index) => ({ label: `Method of deception: ${label} · ${count}`, color: BUCKET_COLOR[label] ?? "#334155", index }))}
        type="doughnut"
        horizontal={false}
        bullets={[]}
        colorKey
        onPick={(index) => onSlice(`method|${methods[index][0]}`)}
      />
    </div>
  );
}

function CardLayers({
  card,
  slice,
  onSlice,
  onSource,
}: {
  card: string;
  slice: string | null;
  onSlice: (value: string) => void;
  onSource: (href: string) => void;
}) {
  const spec = CARD_CASES[card];
  const rows = spec ? NEWS_CASES.filter(spec.match) : [];
  const savePosts = savePostsFor(card);
  if (slice?.startsWith("party|") || slice?.startsWith("method|")) {
    return <PersonCharts rows={rows} slice={slice} onSlice={onSlice} onSource={onSource} />;
  }
  if (slice?.startsWith("save:")) {
    const group = slice.slice(5);
    const posts = savePosts.filter((post) => post.group === group);
    return (
      <div className="mt-6 flex w-full flex-col gap-2">
        <p className="text-center text-[18px] font-semibold text-white">{card} · {group}</p>
        <p className="text-center text-[15px] leading-snug text-white/80">This list is only {group}. The view count was read on the post.</p>
        {posts.map((post) => (
          <button
            key={post.who + post.said}
            type="button"
            onClick={() => post.href && onSource(post.href)}
            className="w-full rounded-3xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] font-semibold leading-snug text-white"
          >
            {post.who} · {post.views} views
            <span className="mt-1 block font-normal">{post.said}</span>
          </button>
        ))}
      </div>
    );
  }
  if (slice) {
    const [status, groupName = "", outletName = ""] = slice.split("|");
    const list = status === "all" ? rows : rows.filter((row) => CARD_DIM.get(row) === status);
    return (
      <SamePath
        title={status === "all" ? `${card} · all cases` : `${card} · ${status}`}
        rows={list.map(speakFromCase)}
        groupName={groupName}
        outletName={outletName}
        onGroup={(name) => onSlice(`${status}|${name}`)}
        onOutlet={(name) => onSlice(`${status}|Cable news|${name}`)}
        onSource={onSource}
      />
    );
  }
  const groups = newsCountBy(rows, CARD_DIM);
  const saveGroups = SAVE_GROUP_LABELS.map((label) => ({
    label,
    count: savePosts.filter((post) => post.group === label).length,
  })).filter((item) => item.count > 0);
  for (const item of saveGroups) groups.push({ label: item.label, count: item.count });
  return (
    <div className="w-full">
      <PersonCharts rows={rows} slice={null} onSlice={onSlice} onSource={onSource} />
      <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{card}: Verdict / status</p>
      {groups.length === 0 ? (
        <ChartSlot line="Jan 1, 2015 – Sept 27, 2026" />
      ) : (
        <LayerChart
          title={`${card}: Verdict / status`}
          line={`Jan 1, 2015 – Sept 27, 2026 · ${newsCasesLine(rows.length + savePosts.length)}`}
          labels={groups.map((item) => item.label)}
          data={groups.map((item) => item.count)}
          colors={groups.map((item) => CARD_DIM.colors[item.label] ?? SAVE_GROUP_COLORS[SAVE_GROUP_LABELS.indexOf(item.label)] ?? CARD_DIM.fallback)}
          type="doughnut"
          horizontal={false}
          bullets={[]}
          center={{ big: String(rows.length + savePosts.length), small: "On the chart", onOpen: () => onSlice("all") }}
          onPick={(index) => onSlice(saveGroups.some((item) => item.label === groups[index].label) ? `save:${groups[index].label}` : groups[index].label)}
        />
      )}
    </div>
  );
}

function ChartSlot({ line }: { line: string }) {
  return (
    <section className="w-full">
      <p className="mt-2 text-center text-[15px] text-white/75">{line}</p>
      <div className={NEWS_CARD + " flex min-h-[200px] items-center justify-center"}>
        <p className="text-center text-[16px] font-semibold text-white/80">Evidence coming soon</p>
      </div>
    </section>
  );
}

const LAW_TOPICS: Partial<Record<Layer, { chart: string; group?: string; fixed?: string }>> = {
  trials: { chart: "Trump Trials: How Each Stands Now", group: "Trump Trials" },
  impeach: { chart: "Impeachments by President", fixed: "impeach" },
  citizen: { chart: "US Citizen Lawfare: How Each Stands Now", group: "US Citizen Lawfare" },
  bail: { chart: "Politicians' Bail Funds", group: "Politicians' bail funds" },
  scrutiny: { chart: "Scrutiny Compared", group: "Scrutiny compared" },
  attempts: { chart: "Assassination Attempts", group: "Assassination attempts" },
  first100: { chart: "First 100 Days", group: "First 100 days" },
};

const LAW_SUB: Record<string, { pick: string | null; caseId: string | null }> = {
  "NY civil fraud": { pick: null, caseId: "lw-1" },
  "Manhattan criminal": { pick: null, caseId: "lw-2" },
  "Classified documents": { pick: null, caseId: "lw-3" },
  "Jan. 6 federal": { pick: null, caseId: "lw-4" },
  Georgia: { pick: null, caseId: "lw-5" },
  "State ballot cases": { pick: null, caseId: "lw-6" },
  Carroll: { pick: null, caseId: "lw-7" },
  Immunity: { pick: null, caseId: "lw-8" },
  "First, 2019": { pick: "impeach:trump", caseId: "Trump" },
  "Second, 2021": { pick: "impeach:trump", caseId: "Trump" },
  Fischer: { pick: null, caseId: "lw-9" },
  "Committee referrals": { pick: "referrals", caseId: null },
};

const LAW_STATUS_COLORS = ["#1e3a5f", "#d4af37", "#b45309", "#b91c1c", "#166534", "#57534e", "#0f766e", "#7c3aed"];

function lawPickFix(pick: string | null) {
  if (pick === "impeach:trump") {
    const chart = lawfareCases.charts.find((item) => item.id === "impeach");
    return `impeach:${chart ? chart.labels.indexOf("Trump") : -1}`;
  }
  return pick;
}

function LawTopic({
  layer,
  pick,
  caseId,
  href,
  onPick,
  onCase,
  onSource,
  onImpeach,
}: {
  layer: Layer;
  pick: string | null;
  caseId: string | null;
  href: string | null;
  onPick: (value: string) => void;
  onCase: (value: string) => void;
  onSource: (value: string) => void;
  onImpeach?: (file: "2019" | "2021" | "clinton") => void;
}) {
  const topic = LAW_TOPICS[layer];
  if (!topic) return null;
  const file = lawfareCases;
  const fixedPick = lawPickFix(pick);
  const shared = pick && (pick.startsWith("impeach") || pick.startsWith("referrals"));
  if (href || caseId || shared || topic.fixed) {
    const base = fixedPick ?? topic.fixed ?? null;
    const chart = base && !base.includes(":") && !caseId && !href ? file.charts.find((item) => item.id === base) : undefined;
    return (
      <div className="w-full">
        {chart ? <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{chart.title}</p> : null}
        <LawfareLayer pick={base} caseId={caseId} href={href} onPick={onPick} onCase={onCase} onSource={onSource} onImpeach={onImpeach} />
      </div>
    );
  }
  const rows = file.cases.filter((item) => item.group === topic.group);
  if (pick) {
    const label = pick.slice(2);
    const list = label === "all" ? rows : rows.filter((item) => item.shortStatus === label);
    return (
      <div className="mt-6 flex w-full flex-col gap-3">
        <p className="text-center text-[18px] font-semibold text-white">{label === "all" ? `${topic.chart.split(":")[0]} · all cases` : label} · {list.length}</p>
        {list.map((row) => (
          <article key={row.id} className="border-b border-white/15 py-4 text-left">
            <button type="button" onClick={() => onCase(row.id)} className="border-0 bg-transparent p-0 text-left text-[16px] font-semibold leading-snug text-white">
              {row.shortName}
            </button>
            <p className="mt-1 text-[15px] text-white/70">{row.filedDate}{row.broughtBy ? ` · ${row.broughtBy}` : ""}</p>
            <p className="mt-2 text-[15px] leading-snug text-white">{row.shortStatus}</p>
            {row.links[0] ? (
              <button type="button" onClick={() => onSource(row.links[0].href)} className="mt-2 border-0 bg-transparent p-0 text-left text-[15px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2">
                {row.links[0].label}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    );
  }
  const labels = [...new Set(rows.map((item) => item.shortStatus))];
  return (
    <div className="w-full">
      <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{topic.chart}</p>
      {rows.length === 0 ? (
        <ChartSlot line={file.asOf} />
      ) : (
        <LayerChart
          title={topic.chart}
          line={file.asOf}
          labels={labels}
          data={labels.map((label) => rows.filter((item) => item.shortStatus === label).length)}
          colors={labels.map((_, index) => LAW_STATUS_COLORS[index % LAW_STATUS_COLORS.length])}
          type="doughnut"
          horizontal={false}
          bullets={[]}
          center={{ big: String(rows.length), small: rows.length === 1 ? "Case" : "Cases", onOpen: () => onPick("g:all") }}
          onPick={(index) => onPick(`g:${labels[index]}`)}
        />
      )}
    </div>
  );
}

function ImpeachRecord({
  file,
  onOpen,
}: {
  file: "2019" | "2021" | "clinton" | "public";
  onOpen: (next: "2019" | "2021" | "clinton" | "public") => void;
}) {
  const link = (href: string, label: string) => (
    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={NEWS_DOOR + " text-left"}>
      {label}
    </a>
  );
  const viewer = (href: string, label: string) => (
    <div className="mt-4 w-full">
      <p className="text-[15px] font-semibold text-white">{label}</p>
      <iframe title={label} src={href} className="mt-2 h-[70vh] w-full rounded-xl border border-white/25 bg-white" />
    </div>
  );
  if (file === "public") {
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[15px] leading-snug text-white/85">
          The public does not vote on House rules. Article I, Section 5 says each House determines the rules of its proceedings. A rule against deceiving the public is not in the Code of Official Conduct. These are the lawful ways to press for one.
        </p>
        <ul className="mt-4 list-disc pl-5 text-[15px] leading-snug text-white/85">
          <li>Vote. Representatives are chosen every second year. Article I, Section 2. The House adopts its rules at the opening of each Congress. The members who win that election cast the vote.</li>
          <li>Ask your representative, in writing, to offer that rule, and to certify a sworn ethics complaint. A person who is not a member cannot force the Ethics Committee to open a case alone. Committee Rule 15 says information from a non-member may be transmitted only if a member certifies in writing that the member believes it is submitted in good faith and warrants the committee’s review.</li>
          <li>The same procedures say the committee shall not accept, and shall return, a complaint filed within 60 days before an election in which the person named is a candidate.</li>
          <li>Expulsion of a member takes the concurrence of two-thirds. Article I, Section 5.</li>
          <li>A duty the Constitution does not impose can be added only by amendment. Article V.</li>
          <li>A lawsuit over words spoken in an impeachment trial is barred by the Speech or Debate Clause. Article I, Section 6: for any speech or debate in either House, members shall not be questioned in any other place.</li>
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          {link("https://constitution.congress.gov/browse/article-1/section-5/", "Article I, Section 5")}
          {link("https://constitution.congress.gov/browse/article-1/section-2/", "Article I, Section 2")}
          {link("https://constitution.congress.gov/browse/article-1/section-6/", "Article I, Section 6")}
          {link("https://constitution.congress.gov/browse/article-5/", "Article V")}
          {link("https://ethics.house.gov/file-a-complaint/", "House Ethics: how to submit information")}
          {link("https://ethics.house.gov/manual/committee-procedures/", "Committee procedures, including Rule 15")}
        </div>
      </div>
    );
  }
  const rules = (
    <>
      <p className="mt-6 text-[16px] font-semibold text-white">Oath, ethics, and the criminal code</p>
      <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
        <li>No United States Code was located that a court has held was violated when House managers played a shortened video in the 2021 trial. No judgment finding a crime was located. This page does not invent one.</li>
        <li>18 U.S.C. § 1001(c) says the false-statement law, inside the legislative branch, applies only to administrative matters, or to an investigation or review conducted under the authority of a committee, subcommittee, commission, or office of Congress. A floor presentation in an impeachment trial is not those two things on the face of the statute.</li>
        <li>Article I, Section 6 says that for any speech or debate in either House, members shall not be questioned in any other place. That clause is why a criminal case over these words was not found. It is not itself a code that says the edit was lawful.</li>
        <li>Article VI requires Senators and Representatives to bind themselves by oath or affirmation to support the Constitution. The words administered are the oath in 5 U.S.C. § 3331: support and defend the Constitution, bear true faith and allegiance to it, and well and faithfully discharge the duties of the office. Those words do not say “do not deceive the public.”</li>
        <li>House Rule XXIII, clause 1, says a member, delegate, resident commissioner, officer, or employee of the House shall behave at all times in a manner that shall reflect creditably on the House. It does not say a member may not deceive the public.</li>
        <li>The Code of Ethics for Government Service is H. Con. Res. 175, 85th Congress, passed July 11, 1958. The House Ethics Committee prints it as a concurrent resolution, not a criminal statute. Item 2 says uphold the Constitution, laws, and regulations and never be a party to their evasion. Item 9 says expose corruption wherever discovered. Item 10 says: “Uphold these principles, ever conscious that public office is a public trust.” No sentence on that page says members must not deceive the public.</li>
        <li>No House rule was located that makes members fiduciaries who must not deceive the American people who pay them. There is no House code of ethics that says members may not deceive the American people who pay them.</li>
      </ul>
      <div className="mt-4 flex flex-col gap-2">
        {link("https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section1001&num=0&edition=prelim", "18 U.S.C. § 1001")}
        {link("https://constitution.congress.gov/browse/article-1/section-6/", "Speech or Debate, Article I, Section 6")}
        {link("https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title5-section3331&num=0&edition=prelim", "Oath, 5 U.S.C. § 3331")}
        {link("https://constitution.congress.gov/browse/article-6/", "Oath, Article VI")}
        {link("https://ethics.house.gov/wp-content/uploads/2025/03/Committee-Rules-for-the-119th-Congress.pdf", "House Rule XXIII, in the 119th Congress rules")}
        {link("https://ethics.house.gov/manual/code-of-ethics-for-government-service-2/", "Code of Ethics for Government Service")}
      </div>
      <button type="button" onClick={() => onOpen("public")} className={NEWS_DOOR + " mt-4 text-left"}>
        How the public can require an ethics rule
      </button>
    </>
  );
  if (file === "2019") {
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[15px] leading-snug text-white/85">
          First impeachment of Donald J. Trump. The House adopted H. Res. 755 on December 18, 2019. Article I is abuse of power. Article II is obstruction of Congress. The Senate trial ran in January and February 2020. The words below are the official articles. The Senate’s compiled trial record is S. Doc. 116-18. The edited January 6 tape is not part of this impeachment. It is in the Second, 2021 file.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {link("/impeachment-docs/hres-755.pdf", "H. Res. 755, the articles, in this file")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-116sdoc18/pdf/CDOC-116sdoc18-vol1.pdf", "S. Doc. 116-18, Volume I, Senate trial record")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-116sdoc18/pdf/CDOC-116sdoc18-vol2.pdf", "S. Doc. 116-18, Volume II")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-116sdoc18/pdf/CDOC-116sdoc18-vol3.pdf", "S. Doc. 116-18, Volume III")}
          {link("https://www.govinfo.gov/content/pkg/CRPT-116hrpt335/pdf/CRPT-116hrpt335.pdf", "H. Rept. 116-335, House Intelligence inquiry report")}
          {link("https://www.govinfo.gov/collection/impeachment-related-publications", "GovInfo impeachment collection, hearing record")}
          {link("https://www.c-span.org/congress/?chamber=house&date=2019-11-13", "C-SPAN, House, November 13, 2019")}
          {link("https://www.c-span.org/congress/?chamber=house&date=2019-11-19", "C-SPAN, House, November 19, 2019")}
          {link("https://www.c-span.org/congress/?chamber=house&date=2019-11-20", "C-SPAN, House, November 20, 2019")}
          {link("https://www.c-span.org/congress/?chamber=house&date=2019-12-18", "C-SPAN, House vote, December 18, 2019")}
          {link("https://www.c-span.org/congress/?chamber=senate&date=2020-01-22", "C-SPAN, Senate trial, January 22, 2020")}
        </div>
        {viewer("/impeachment-docs/hres-755.pdf", "H. Res. 755")}
        {rules}
      </div>
    );
  }
  if (file === "clinton") {
    return (
      <div className="mt-8 w-full text-left">
        <p className="text-[15px] leading-snug text-white/85">
          Impeachment of William Jefferson Clinton. The House adopted H. Res. 611 on December 19, 1998. Article I concerns grand-jury testimony. Article II concerns obstruction of justice. The Senate tried the articles in January and February 1999 and did not convict. Conviction takes two-thirds. Article I, Section 3. The official transcript is Senate Document 106-4, four volumes. The January 6 tape is not part of this trial.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {link("/impeachment-docs/hres-611.pdf", "H. Res. 611, the articles, in this file")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-106sdoc4/pdf/CDOC-106sdoc4-vol1.pdf", "S. Doc. 106-4, Volume I, preliminary proceedings")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-106sdoc4/pdf/CDOC-106sdoc4-vol2.pdf", "S. Doc. 106-4, Volume II, floor trial proceedings")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-106sdoc4/pdf/CDOC-106sdoc4-vol3.pdf", "S. Doc. 106-4, Volume III, depositions and affidavits")}
          {link("https://www.govinfo.gov/content/pkg/CDOC-106sdoc4/pdf/CDOC-106sdoc4-vol4.pdf", "S. Doc. 106-4, Volume IV, statements of senators")}
          {link("https://www.c-span.org/congress/?chamber=senate&date=1999-01-14", "C-SPAN, Senate, January 14, 1999")}
          {link("https://www.c-span.org/congress/?chamber=senate&date=1999-02-12", "C-SPAN, Senate, February 12, 1999")}
        </div>
        {viewer("/impeachment-docs/hres-611.pdf", "H. Res. 611")}
        {rules}
      </div>
    );
  }
  return (
    <div className="mt-8 w-full text-left">
      <p className="text-[15px] leading-snug text-white/85">
        Second impeachment of Donald J. Trump. The House adopted H. Res. 24 on January 13, 2021. One article: incitement of insurrection. The Senate trial ran February 9 to 13, 2021. The Senate did not convict. The daily Congressional Record is the official transcript of what was said, and of the videos the Record chose to print. Those five days are in this file.
      </p>
      <p className="mt-4 text-[16px] font-semibold text-white">The tapes</p>
      <p className="mt-2 text-[15px] leading-snug text-white/85">
        A minute-and-second start time is not printed in the Congressional Record. What is printed is the place in the day’s debate, and the words of the video.
      </p>
      <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
        <li>February 9, 2021. Congressional Record, Senate, pages S590 to S591. Lead manager Jamie Raskin said, “I will show you.” The Record then prints “(Video footage of 1–6–2021.)” The printed footage includes: “When we fight, we fight like hell. And if you don’t fight like hell, you’re not going to have a country anymore.” The word “peacefully” does not appear in that day’s Senate Record.</li>
        <li>H. Res. 24 quotes “if you don’t fight like hell you’re not going to have a country anymore.” The article does not contain the word “peacefully.”</li>
        <li>C-SPAN’s page for a clip of that February 9 video lists the length as 13 minutes, 3 seconds. C-SPAN says the clip, title, and description were not created by C-SPAN. That figure is the length of the clip. It is not a clock time in the Senate day.</li>
        <li>February 12, 2021. Congressional Record, Senate, page S671. Mr. Counsel David Schoen played a video. The Record prints “(Text of video presentations.)” and then the remarks, including: “I know that everyone here will soon be marching over to the Capitol Building to peacefully and patriotically make your voices heard.” He said they showed the walk to the Capitol and cut off what followed: to cheer on members, “peacefully and patriotically.” He said, “so they edited it down.”</li>
        <li>Earlier that day, Mr. Counsel Michael van der Veen said the January 6 remarks “explicitly encouraged those in attendance to exercise their rights ‘peacefully and patriotically.’”</li>
        <li>The Record does not print one uninterrupted play of the entire Ellipse speech. It prints the passage the February 9 transcript left out, and counsel saying the managers edited it down. A frame time for the first second of that defense tape was not located.</li>
      </ul>
      <div className="mt-4 flex flex-col gap-2">
        {link("/impeachment-docs/hres-24.pdf", "H. Res. 24, the article, in this file")}
        {link("/impeachment-docs/crec-2021-02-09-senate.pdf", "Congressional Record, February 9, 2021, the managers’ video")}
        {link("/impeachment-docs/crec-2021-02-10-senate.pdf", "Congressional Record, February 10, 2021")}
        {link("/impeachment-docs/crec-2021-02-11-senate.pdf", "Congressional Record, February 11, 2021")}
        {link("/impeachment-docs/crec-2021-02-12-senate.pdf", "Congressional Record, February 12, 2021, the defense tape")}
        {link("/impeachment-docs/crec-2021-02-13-senate.pdf", "Congressional Record, February 13, 2021")}
        {link("https://www.govinfo.gov/app/details/CDOC-117sdoc2", "S. Doc. 117-2, trial briefs and papers")}
        {link("https://www.c-span.org/program/us-senate/senate-impeachment-trial-day-1-impeachment-managers-constitutionality-arguments/589005", "C-SPAN, February 9, 2021, full Senate day")}
        {link("https://www.c-span.org/clip/us-senate/user-clip-raskin---house-impeachment-video-evidence/4944581", "C-SPAN user clip of the managers’ video, 13 minutes 3 seconds")}
        {link("https://www.c-span.org/congress/?chamber=senate&date=2021-02-12", "C-SPAN, February 12, 2021, defense")}
        {link("https://www.c-span.org/video/?c4945671/attorney-president-trump-calls-impeachment-trial-divisive-unconstituional", "C-SPAN clip, van der Veen and Schoen, February 12")}
      </div>
      {viewer("/impeachment-docs/crec-2021-02-09-senate.pdf", "February 9, 2021, Senate Record")}
      {viewer("/impeachment-docs/crec-2021-02-12-senate.pdf", "February 12, 2021, Senate Record")}
      {rules}
    </div>
  );
}

const METHOD_TILE: Record<string, string> = {
  "omitted context": "/images/tile-method-omitted.jpg",
  "misquote / truncation": "/images/tile-method-misquote.jpg",
  "fabrication / false attribution": "/images/tile-method-fabrication.jpg",
  "premature “proven” framing": "/images/tile-method-premature.jpg",
  "retracted invention": "/images/tile-method-retracted.jpg",
  "policy-scope inflation": "/images/tile-method-policy.jpg",
  "false attribution of words/intent / omitted context": "/images/tile-method-intent.jpg",
  "retracted invention / misquote / truncation": "/images/tile-method-mixed.jpg",
};

function methodStatus(id: string) {
  const file = NEWS_CASES.find((row) => row.id === id);
  const correction = (file?.correction ?? "").trim();
  const never = correction.toLowerCase().startsWith("never");
  const unknown = !correction || correction === "Unknown";
  const where = correction === "Editor's note at bottom of article"
    ? "An editor's note at the bottom of the article."
    : correction === "Appended correction line"
      ? "A correction line added to the story."
      : correction === "On-air correction"
        ? "Said on the air."
        : correction === "Retraction after legal threat/settlement"
          ? "After a legal threat or a settlement."
          : correction;
  return {
    file,
    status: file?.evidence === "Proven false" ? "Proven false" : file?.evidence === "Rated misleading" ? "Rated misleading" : (file?.evidence ?? "Not on record"),
    retracted: never ? "Not retracted." : unknown ? "Retraction: not on record." : "Retracted.",
    how: never ? "None. It was not retracted." : unknown ? "Not on record." : where,
    audience: never
      ? "Not retracted, so there is no retraction audience to compare with the claim."
      : unknown
        ? "Whether any retraction reached the same audience as the claim is not on this record."
        : "The record does not show that this retraction reached the same audience as the claim.",
    duration: file ? `${file.duration}. Began ${file.began}. Ended ${file.ended}.` : "Not on record.",
  };
}

function OrganizedCase({
  who,
  said,
  status,
  retracted,
  how,
  audience,
  duration,
  record,
  sources,
  onSource,
}: {
  who: string;
  said: string;
  status: string;
  retracted: string;
  how: string;
  audience: string;
  duration: string;
  record?: string;
  sources: { label: string; href: string }[];
  onSource: (href: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/25 bg-[#070b12]/85 px-4 py-4">
      <p className="text-[16px] font-semibold text-white">{status}</p>
      <p className="mt-2 text-[15px] leading-snug text-white">{retracted}</p>
      <p className="mt-2 text-[15px] leading-snug text-white">Method of retraction: {how}</p>
      <p className="mt-2 text-[15px] leading-snug text-white">Audience: {audience}</p>
      <p className="mt-2 text-[15px] leading-snug text-white">How long it was repeated: {duration}</p>
      <p className="mt-2 text-[15px] leading-snug text-white">By whom: {who}</p>
      <p className="mt-2 text-[15px] leading-snug text-white/85">{said}</p>
      {record ? (
        <>
          <p className="mt-4 text-[16px] font-semibold text-white">What the record shows</p>
          <p className="mt-1 whitespace-pre-line text-[15px] leading-snug text-white/85">{record}</p>
        </>
      ) : null}
      <ClaimSaid sources={sources} onSource={onSource} />
      <div className="mt-3 flex flex-col gap-2">
        {sources.map((source) => (
          <button key={source.href} type="button" onClick={() => onSource(source.href)} className={NEWS_DOOR + " text-left"}>
            {source.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function OrganizedNews({ row, onSource }: { row: NewsCaseRow; onSource: (href: string) => void }) {
  const line = methodStatus(row.id);
  return (
    <OrganizedCase
      who={row.who}
      said={row.said}
      status={line.status}
      retracted={line.retracted}
      how={line.how}
      audience={line.audience}
      duration={line.duration}
      record={row.record}
      sources={row.sources}
      onSource={onSource}
    />
  );
}

function shortLine(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const at = clean.indexOf(". ");
  if (at >= 40 && at <= 220) return clean.slice(0, at + 1);
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
}

function SamePath({
  title,
  rows,
  groupName,
  outletName,
  onGroup,
  onOutlet,
  onSource,
}: {
  title: string;
  rows: { who: string; date: string; group: string; outlet: string; said: string; record: string; sources: { label: string; href: string }[] }[];
  groupName: string;
  outletName: string;
  onGroup: (name: string) => void;
  onOutlet: (name: string) => void;
  onSource: (href: string) => void;
}) {
  if (!groupName) {
    const groups = SPEAKER_GROUPS
      .map(([label, key]) => ({ name: label, count: rows.filter((row) => row.group === key).length }))
      .filter((item) => item.count > 0);
    return (
      <div className="mt-8 w-full">
        <p className="text-center text-[18px] font-semibold text-white">{title} · {rows.length}</p>
        <div className="mt-6 flex flex-col gap-2">
          {groups.map((item) => (
            <button key={item.name} type="button" onClick={() => onGroup(item.name)} className={NEWS_DOOR + " text-left"}>
              {item.name} · {item.count}
            </button>
          ))}
        </div>
      </div>
    );
  }
  const groupKey = SPEAKER_GROUPS.find(([label]) => label === groupName)?.[1] ?? "";
  const inGroup = rows.filter((row) => row.group === groupKey);
  if (groupName === "Cable news" && !outletName) {
    const outlets = [...new Set(inGroup.map((row) => row.outlet))].sort();
    return (
      <div className="mt-8 w-full">
        <p className="text-center text-[18px] font-semibold text-white">{title} · Cable news · {inGroup.length}</p>
        <p className="mt-3 text-center text-[15px] leading-snug text-white/80">On this record the cable outlets are CNN, MSNBC, and CNBC. Fox News, MS NOW, and NewsNation have no case in this file.</p>
        <div className="mt-6 flex flex-col gap-2">
          {outlets.map((name) => (
            <button key={name} type="button" onClick={() => onOutlet(name)} className={NEWS_DOOR + " text-left"}>
              {name} · {inGroup.filter((row) => row.outlet === name).length}
            </button>
          ))}
        </div>
      </div>
    );
  }
  const list = outletName ? inGroup.filter((row) => row.outlet === outletName) : inGroup;
  return (
    <div className="mt-8 w-full text-left">
      <p className="text-center text-[18px] font-semibold text-white">{title} · {outletName || groupName} · {list.length}</p>
      {groupName === "Social media" ? (
        <p className="mt-3 text-center text-[15px] leading-snug text-white/80">A view count is listed only when a source states it.</p>
      ) : null}
      {list.map((row, item) => (
        <article key={`${row.who}-${item}`} className="border-b border-white/15 py-4">
          <p className="text-[16px] font-semibold leading-snug text-white">{row.who}</p>
          <p className="mt-1 text-[15px] text-white/70">
            {row.date}{row.outlet && row.outlet !== "Not yet identified" ? ` · ${row.outlet}` : ""}
          </p>
          <p className="mt-2 text-[15px] leading-snug text-white">{shortLine(row.record || row.said)}</p>
          {groupName === "Social media" ? (
            <>
              <p className="mt-2 text-[15px] leading-snug text-white">
                {row.who.startsWith("Tristan Snell") ? "Likes: 94,799 on the January 21, 2025 X post, as shown on the post." : "Likes: not on this record."}
              </p>
              <p className="mt-1 text-[15px] leading-snug text-white">
                {row.who.startsWith("Brian Tyler Cohen")
                  ? "Views: PolitiFact, April 24, 2025, said the April 12, 2025 X post reached 6.6 million X accounts, according to X’s metrics."
                  : row.who.startsWith("Tristan Snell")
                    ? "Views: the post page that was opened did not show a view count."
                    : "Views: not on this record."}
              </p>
            </>
          ) : null}
          {row.sources[0] ? (
            <button type="button" onClick={() => onSource(row.sources[0].href)} className="mt-2 border-0 bg-transparent p-0 text-left text-[15px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2">
              {row.sources[0].label}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function speakFromCase(row: NewsCaseRow) {
  return {
    who: row.who,
    date: row.began,
    group: row.networkGroup,
    outlet: row.networkName,
    said: row.said,
    record: row.record,
    sources: row.sources,
    evidence: row.evidence,
  };
}

const TILE_CASE: Record<string, (row: NewsCaseRow) => boolean> = {
  network: (row) => row.networkGroup === "Cable Networks" || row.networkGroup === "MSM Networks",
  journalists: (row) => row.networkGroup === "Print/Web news" || row.networkGroup === "Public Broadcasting",
  politicians: (row) => row.networkGroup === "Politicians/Officials",
  social: (row) => row.networkGroup === "Social Media",
};

const ONE_BUCKETS = [
  "Omitted context",
  "Misquote / truncation",
  "Fabrication / false attribution",
  "False photo or video",
  "Premature proven framing",
  "Retracted invention",
  "Policy-scope inflation",
  "Wrong number",
  "Other",
];

const ONE_COLORS = ["#b91c1c", "#1d4ed8", "#b45309", "#0f766e", "#7c3aed", "#ca8a04", "#be185d", "#57534e", "#a8a29e"];

type NewsFilter = { verdict: string; time: string; proof: string; bars: "method" | "topic" | "person" | "mechanic"; topic: string };

const TOPIC_OF: Record<string, string> = {
  "Politicians/Officials": "Politicians deceptions",
  "Cable Networks": "Network deception",
  "MSM Networks": "Network deception",
  "Print/Web news": "Journalists",
  "Public Broadcasting": "Journalists",
  "Social Media": "Social media warfare",
  "Advocacy groups": "Advocacy",
  "Not yet identified": "Not yet identified",
};

const TOPIC_ORDER = [
  "Network deception",
  "Journalists",
  "Politicians deceptions",
  "Social media warfare",
  "Advocacy",
  "Not yet identified",
];

const MECHANIC_TESTS: [string, RegExp][] = [
  ["Gaslighting", /gaslight/i],
  ["Contextomy", /contextomy|misquote|truncat/i],
  ["Omission", /omitted context|omission|cherry-pick/i],
  ["Paltering", /palter/i],
  ["Framing", /\bframing\b/i],
  ["Priming", /priming/i],
  ["Anchoring", /anchoring/i],
  ["Illusory truth", /illusory truth/i],
  ["Agenda-setting", /agenda-setting|agenda setting/i],
  ["Confirmation bias", /confirmation bias/i],
  ["Motivated reasoning", /motivated reasoning/i],
  ["Continued influence", /continued influence/i],
];

function caseMechanic(method: string) {
  for (const [name, test] of MECHANIC_TESTS) {
    if (test.test(method)) return name;
  }
  return "Not one of the listed studies";
}

function allOneRows() {
  const file = NEWS_CASES.map((row) => ({
    ...speakFromCase(row),
    bucket: deceptionBucket(row.method),
    period: row.period,
    proof: NEWS_MARKS[row.id]?.proof ?? "Not yet rated",
    topic: TOPIC_OF[row.networkGroup] ?? "Not yet identified",
    person: row.person || "Not yet identified",
    mechanic: caseMechanic(row.method),
  }));
  const added = ADDED_MISLEADING.map((row) => ({
    who: row.who,
    date: row.date,
    group: row.group,
    outlet: row.outlet,
    said: row.said,
    record: row.record,
    sources: row.sources,
    evidence: "Rated misleading",
    bucket: deceptionBucket(row.method),
    period: "2025–26",
    proof: "Not yet rated",
    topic: TOPIC_OF[row.group] ?? "Not yet identified",
    person: "Reuters",
    mechanic: caseMechanic(row.method),
  }));
  return [...file, ...added];
}

function filteredOne(filter: NewsFilter) {
  return allOneRows().filter((row) => {
    const verdict = filter.verdict === "Unverified" ? "Still being checked" : filter.verdict;
    return (filter.verdict === "All" || row.evidence === verdict)
      && (filter.time === "All" || row.period === filter.time)
      && (filter.proof === "All" || row.proof === filter.proof)
      && (filter.topic === "All" || row.topic === filter.topic);
  });
}

function FilterRow({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: string[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <div className="mt-4 w-full">
      <p className="text-center text-[15px] font-semibold text-white">{label}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={`rounded-full border px-3 py-1 text-[15px] font-semibold ${value === option ? "border-[#d4af37] bg-[#070b12] text-[#d4af37]" : "border-white/35 bg-[#070b12]/70 text-white"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function PolitiFactScorecard() {
  return (
    <div className="mt-8 w-full text-left text-[15px] leading-snug text-white">
      <p className="text-[18px] font-semibold">PolitiFact Facebook scorecard</p>
      <p className="mt-4">4,008 rated False.</p>
      <p className="mt-2">1,439 Pants on Fire.</p>
      <p className="mt-2">5,447 posts.</p>
      <p className="mt-4">These posts were rated false and they were on Facebook, so people saw them. That is the test. A false post that reached people shaped public opinion, so it is on this chart.</p>
      <a href="https://www.politifact.com/facebook-fact-checks/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2">Open the scorecard</a>
    </div>
  );
}
function OneChart({
  filter,
  onFilter,
}: {
  filter: NewsFilter;
  onFilter: (next: NewsFilter) => void;
}) {
  const [pick, setPick] = useState<string | null>(null);
  const openRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (pick) openRef.current?.scrollIntoView({ block: "start" });
  }, [pick]);
  const filterKey = JSON.stringify(filter);
  useEffect(() => {
    setPick(null);
  }, [filterKey]);
  const rows = filteredOne(filter);
  const whole = allOneRows().length;
  const labelOf = (row: (typeof rows)[number]) =>
    filter.bars === "topic" ? row.topic : filter.bars === "person" ? row.person : filter.bars === "mechanic" ? row.mechanic : row.bucket;
  const order = filter.bars === "method"
    ? ONE_BUCKETS
    : filter.bars === "topic"
      ? TOPIC_ORDER
      : filter.bars === "mechanic"
        ? [...METHODS.map((item) => item.name), "Not one of the listed studies"]
        : [...new Set(rows.map(labelOf))].sort((a, b) => rows.filter((row) => labelOf(row) === b).length - rows.filter((row) => labelOf(row) === a).length);
  const bars = order
    .map((label, index) => ({ label, count: rows.filter((row) => labelOf(row) === label).length, color: ONE_COLORS[index % ONE_COLORS.length] }))
    .filter((item) => item.count > 0);
  const scorecard = filter.bars === "method" && filter.verdict === "All" && filter.time === "All" && filter.proof === "All" && filter.topic === "All";
  const shown = scorecard ? [...bars, { label: "PolitiFact Facebook scorecard", count: 5447, color: "#e11d48" }] : bars;
  const total = rows.length + (scorecard ? 5447 : 0);
  const toggle = (label: string) => setPick(pick === label ? null : label);
  const picked = pick === "all" ? rows : pick ? rows.filter((row) => labelOf(row) === pick) : [];
  const pickedCount = pick === "all" ? total : shown.find((item) => item.label === pick)?.count ?? 0;
  const title = filter.bars === "topic"
    ? "Fake News Evidence by Topic"
    : filter.bars === "person"
      ? "Fake News Evidence by Person"
      : filter.bars === "mechanic"
        ? "Fake News Evidence by Mechanics Method"
        : "Fake News Evidence by Deception Method";
  return (
    <div className="mt-6 w-full">
      <p className="text-center text-[18px] font-semibold tracking-wide text-white">{title}</p>
      <LayerChart
        title={title}
        line={scorecard ? `${rows.length} written cases · 5,447 Facebook posts rated false` : filter.topic === "All" ? `${rows.length} cases on this chart · tap a slice` : `${rows.length} of ${whole} cases · ${filter.topic} · tap a slice`}
        labels={shown.map((item) => item.label)}
        data={shown.map((item) => item.count)}
        colors={shown.map((item) => item.color)}
        type="doughnut"
        horizontal={false}
        center={{ big: String(total), small: "On the chart", onOpen: () => toggle("all") }}
        bullets={scorecard ? ["A false post that reached people is on this chart. That is the test: did it shape public opinion.", "5,447 Facebook posts were rated false: 4,008 False and 1,439 Pants on Fire. Tap that slice for the source."] : ["Every case is in this chart once.", "Topics, persons, deception types, and the mechanics list are cuts of the same cases."]}
        onPick={(index) => toggle(shown[index].label)}
        colorKey
      />
      {pick ? (
        <section ref={openRef} data-one-evidence={pick} className="mt-6 w-full scroll-mt-16 text-left">
          <button type="button" data-one-close onClick={() => setPick(null)} className={NEWS_DOOR + " w-fit"}>
            Close
          </button>
          <h2 className="mt-4 text-center text-[20px] font-bold leading-snug text-white">
            {pick === "all" ? `${title}: all ${total}` : `${title} · ${pick}: ${pickedCount}`}
          </h2>
          {pick === "PolitiFact Facebook scorecard" || (pick === "all" && scorecard) ? <PolitiFactScorecard /> : null}
          <div className="mt-6 flex flex-col gap-3">
            {picked.map((row, index) => (
              <article key={`${row.who}-${row.date}-${index}`} data-one-item className="w-full [overflow-wrap:anywhere] rounded-2xl border border-white/35 bg-[#070b12]/85 px-4 py-3 text-[15px] leading-snug text-white">
                <p className="font-semibold">{row.who}</p>
                <p className="mt-1 text-white/70">
                  {row.date}{row.outlet && row.outlet !== "Not yet identified" ? ` · ${row.outlet}` : ""} · {row.evidence}
                </p>
                <p className="mt-1 text-white/85">{shortLine(row.record || row.said)}</p>
                {row.sources.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {row.sources.map((source, at) => (
                      <a
                        key={`${source.href}-${at}`}
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                      >
                        {source.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-white/60">No source link on file</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <FilterRow
        label="Bars"
        options={["Deception method", "Topic", "Person", "Mechanics"]}
        value={filter.bars === "topic" ? "Topic" : filter.bars === "person" ? "Person" : filter.bars === "mechanic" ? "Mechanics" : "Deception method"}
        onPick={(value) => onFilter({ ...filter, bars: value === "Topic" ? "topic" : value === "Person" ? "person" : value === "Mechanics" ? "mechanic" : "method" })}
      />
      {filter.topic !== "All" ? (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => onFilter({ ...filter, topic: "All" })} className={NEWS_DOOR + " w-fit"}>
            All Fake News · {whole}
          </button>
        </div>
      ) : null}
      <FilterRow
        label="Verdict"
        options={["All", "Proven false", "Rated misleading", "Unverified"]}
        value={filter.verdict}
        onPick={(verdict) => onFilter({ ...filter, verdict })}
      />
      <FilterRow
        label="Time"
        options={["All", ...NEWS_PERIODS.map((item) => item.key).filter((key) => allOneRows().some((row) => row.period === key))]}
        value={filter.time}
        onPick={(time) => onFilter({ ...filter, time })}
      />
      <FilterRow
        label="Strength of proof"
        options={["All", "Official record", "Original transcript/video", "Outlet's own correction", "Primary document or record search", "Not yet rated"]}
        value={filter.proof}
        onPick={(proof) => onFilter({ ...filter, proof })}
      />
    </div>
  );
}
function TileVerdict({
  title,
  rows,
  path,
  onPath,
  onSource,
}: {
  title: string;
  rows: ReturnType<typeof speakFromCase>[];
  path: string[];
  onPath: (path: string[]) => void;
  onSource: (href: string) => void;
}) {
  const [verdict, groupName = "", outletName = ""] = path;
  if (!verdict) {
    const slices = [
      ["Proven false", rows.filter((row) => row.evidence === "Proven false").length, "#166534"],
      ["Rated misleading", rows.filter((row) => row.evidence === "Rated misleading").length, "#b45309"],
      ["Unverified", rows.filter((row) => row.evidence === "Still being checked").length, "#57534e"],
    ].filter((item) => item[1] !== 0);
    return (
      <LayerChart
        title={title}
        line={`${rows.length} cases · tap a slice`}
        labels={slices.map((item) => String(item[0]))}
        data={slices.map((item) => Number(item[1]))}
        colors={slices.map((item) => String(item[2]))}
        type="doughnut"
        horizontal={false}
        bullets={["The number is the cases in this tile."]}
        center={{ big: String(rows.length), small: "cases", onOpen: () => onPath(["All"]) }}
        onPick={(index) => onPath([String(slices[index][0])])}
      />
    );
  }
  const slice = verdict === "All"
    ? rows
    : rows.filter((row) => row.evidence === (verdict === "Unverified" ? "Still being checked" : verdict));
  return (
    <SamePath
      title={`${title} · ${verdict}`}
      rows={slice}
      groupName={groupName}
      outletName={outletName}
      onGroup={(name) => onPath([verdict, name])}
      onOutlet={(name) => onPath([verdict, "Cable news", name])}
      onSource={onSource}
    />
  );
}
function VerdictOpen({
  method,
  onMethod,
  onSource,
}: {
  method: string;
  onMethod: (next: string) => void;
  onSource: (href: string) => void;
}) {
  const parts = method.split(":");
  const index = Number(parts[1]);
  const spec = EVIDENCE_CHARTS.find((item) => item.id === "chart-evidence");
  if (!spec) return null;
  const value = spec.values[index] as "Proven false" | "Rated misleading" | "Still being checked";
  const rows = verdictFile(value);
  return (
    <SamePath
      title={spec.labels[index]}
      rows={rows}
      groupName={parts[2] ?? ""}
      outletName={parts.slice(3).join(":")}
      onGroup={(name) => onMethod(`chart-evidence:${index}:${name}`)}
      onOutlet={(name) => onMethod(`chart-evidence:${index}:Cable news:${name}`)}
      onSource={onSource}
    />
  );
}

function MethodLayers({
  method,
  onMethod,
  onSource,
}: {
  method: string;
  onMethod: (next: string) => void;
  onSource: (href: string) => void;
}) {
  const parts = method.split(":");
  const index = Number(parts[1]);
  const spec = EVIDENCE_CHARTS.find((item) => item.id === "chart-methods");
  if (!spec) return null;
  const value = spec.values[index];
  const label = spec.labels[index];
  const rows = newsEvidence.methods
    .flatMap((item) => item.cases)
    .filter((item) => item.method === value)
    .map((item) => NEWS_CASES.find((row) => row.id === item.id))
    .filter((row): row is NewsCaseRow => !!row)
    .map(speakFromCase);
  return (
    <SamePath
      title={label}
      rows={rows}
      groupName={parts[2] ?? ""}
      outletName={parts.slice(3).join(":")}
      onGroup={(name) => onMethod(`chart-methods:${index}:${name}`)}
      onOutlet={(name) => onMethod(`chart-methods:${index}:Cable news:${name}`)}
      onSource={onSource}
    />
  );
}

const PERIOD_TILE: Record<string, string> = {
  "2015–16": "/images/tile-period-2015.jpg",
  "2017–18": "/images/tile-period-2017.jpg",
  "2019–20": "/images/tile-period-2019.jpg",
  "2021–22": "/images/tile-period-2021.jpg",
  "2023–24": "/images/tile-period-2023.jpg",
  "2025–26": "/images/tile-period-2025.jpg",
};

const PROOF_TILE: Record<string, string> = {
  "Official record": "/images/tile-proof-record.jpg",
  "Original transcript/video": "/images/tile-proof-transcript.jpg",
  "Outlet's own correction": "/images/tile-proof-correction.jpg",
  "Primary document or record search": "/images/tile-proof-primary.jpg",
};

function proofSlice(index: number) {
  const spec = EVIDENCE_CHARTS.find((item) => item.id === "chart-proof");
  const value = spec?.values[index];
  const cases = newsEvidence.methods.flatMap((item) => item.cases).filter((item) => value != null && NEWS_MARKS[item.id]?.proof === value);
  return { spec, value, cases };
}

function ProofLayers({
  method,
  onMethod,
  onSource,
}: {
  method: string;
  onMethod: (next: string) => void;
  onSource: (href: string) => void;
}) {
  const parts = method.split(":");
  const index = Number(parts[1]);
  const { spec, cases } = proofSlice(index);
  const label = spec?.labels[index] ?? "Strength of proof";
  const rows = cases
    .map((item) => NEWS_CASES.find((row) => row.id === item.id))
    .filter((row): row is NewsCaseRow => !!row)
    .map(speakFromCase);
  return (
    <SamePath
      title={label}
      rows={rows}
      groupName={parts[2] ?? ""}
      outletName={parts.slice(3).join(":")}
      onGroup={(name) => onMethod(`chart-proof:${index}:${name}`)}
      onOutlet={(name) => onMethod(`chart-proof:${index}:Cable news:${name}`)}
      onSource={onSource}
    />
  );
}

function ProofCase({ id, onSource }: { id: string; onSource: (href: string) => void }) {
  const item = newsEvidence.methods.flatMap((entry) => entry.cases).find((entry) => entry.id === id);
  const file = NEWS_CASES.find((row) => row.id === id);
  if (!item) return <p className="mt-8 text-[15px] text-white">Not on record.</p>;
  const correction = (file?.correction ?? "").trim();
  const never = correction.toLowerCase().startsWith("never");
  const unknown = !correction || correction === "Unknown";
  const retracted = !never && !unknown;
  const status = file?.evidence === "Proven false"
    ? "False"
    : file?.evidence === "Rated misleading"
      ? "Rated misleading"
      : (file?.evidence ?? "Not on record");
  const where = correction === "Editor's note at bottom of article"
    ? "An editor's note at the bottom of the article."
    : correction === "Appended correction line"
      ? "A correction line added to the story."
      : correction === "On-air correction"
        ? "Said on the air."
        : correction === "Retraction after legal threat/settlement"
          ? "After a legal threat or a settlement."
          : correction;
  const accountability = /legal|settlement/i.test(correction)
    ? "A retraction after a legal threat or settlement is on this record. No criminal finding is on this record."
    : never
      ? "No accountability."
      : retracted
        ? "No accountability beyond the correction on this record."
        : "Accountability is not on this record.";
  return (
    <div className="mt-8 w-full text-left">
      <div className="rounded-2xl border border-[#d4af37] bg-[#070b12] px-5 py-4">
        <p className="text-[18px] font-bold tracking-wide text-white">{status}</p>
        <p className="mt-2 text-[16px] font-semibold text-white">
          {never ? "Not retracted." : unknown ? "Retraction: not on record." : "Retracted."}
        </p>
        {retracted ? (
          <>
            <p className="mt-2 text-[16px] leading-snug text-white">Where: {where}</p>
            <p className="mt-2 text-[16px] leading-snug text-white">Who made it: {item.who}</p>
            <p className="mt-2 text-[16px] leading-snug text-white">The record does not show that this retraction reached as large an audience as the claim.</p>
          </>
        ) : null}
        <p className="mt-2 text-[16px] font-semibold text-white">{accountability}</p>
      </div>
      <p className="mt-6 text-[16px] font-semibold text-white">{item.who}</p>
      <p className="mt-2 text-[15px] text-white/85">{item.date}</p>
      <p className="mt-4 text-[16px] font-semibold text-white">Who said it</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">{item.who}</p>
      <p className="mt-4 text-[16px] font-semibold text-white">What they said</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">{item.said}</p>
      <p className="mt-4 text-[16px] font-semibold text-white">What the document states</p>
      <p className="mt-1 whitespace-pre-line text-[15px] leading-snug text-white/85">{item.record}</p>
      <p className="mt-4 text-[16px] font-semibold text-white">Times stated</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">Not on record.</p>
      <p className="mt-4 text-[16px] font-semibold text-white">Duration of the claim</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">
        {file ? `${file.duration}. Began ${file.began}. Ended ${file.ended}.` : item.date}
      </p>
      <p className="mt-4 text-[16px] font-semibold text-white">What the record does to the claim</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">
        {file?.evidence ?? "Not on record."} The document text above is the check. This page does not add a finding the record does not state.
      </p>
      <p className="mt-4 text-[16px] font-semibold text-white">Accountability</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">{accountability}</p>
      <p className="mt-4 text-[16px] font-semibold text-white">How the retraction was made</p>
      <p className="mt-1 text-[15px] leading-snug text-white/85">
        {never ? "No retraction is on this record." : unknown ? "How any retraction was made is not on this record." : where}
      </p>
      <ClaimSaid sources={item.sources} onSource={onSource} />
      <div className="mt-4 flex flex-wrap gap-2">
        {item.sources.map((source) => (
          <button
            key={source.href}
            type="button"
            onClick={() => onSource(source.href)}
            className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
          >
            {source.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FrontMaster({ onOpen }: { onOpen: (group: string) => void }) {
  const dim = NEWS_DIMS.find((item) => item.key === "network")!;
  const groups = newsCountBy(NEWS_CASES, dim);
  return (
    <LayerChart
      title="Fake News"
      line=""
      labels={groups.map((item) => item.label)}
      data={groups.map((item) => item.count)}
      colors={groups.map((item) => dim.colors[item.label] ?? dim.fallback)}
      type="doughnut"
      horizontal={false}
      bullets={[]}
      colorKey
      center={{ big: String(NEWS_CASES.length), small: "Cases", onOpen: () => undefined }}
      onPick={(index) => onOpen(groups[index].label)}
    />
  );
}

function FrontOutlets({ group, onOpen }: { group: string; onOpen: (name: string) => void }) {
  const rows = NEWS_CASES.filter((row) => row.networkGroup === group);
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.networkName, (counts.get(row.networkName) ?? 0) + 1));
  const names = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return (
    <LayerChart
      title={group}
      line={`${group}. ${rows.length} cases. Tap a name.`}
      labels={names.map(([label]) => label)}
      data={names.map(([, count]) => count)}
      colors={names.map((_, index) => ["#1e3a5f", "#7c2d12", "#14532d", "#b91c1c", "#0f766e", "#7c3aed", "#f59e0b", "#a3a3a3"][index % 8])}
      type="doughnut"
      horizontal={false}
      bullets={[]}
      colorKey
      center={{ big: String(rows.length), small: "Cases", onOpen: () => undefined }}
      onPick={(index) => onOpen(names[index][0])}
    />
  );
}

function FrontTyped({ group, onOpen }: { group: string; onOpen: (id: string) => void }) {
  const rows = NEWS_CASES.filter((row) => row.networkGroup === group);
  const methods = new Map<string, NewsCaseRow[]>();
  rows.forEach((row) => {
    const list = methods.get(row.method) ?? [];
    list.push(row);
    methods.set(row.method, list);
  });
  const ordered = [...methods.entries()].sort((a, b) => b[1].length - a[1].length);
  return (
    <div className="mt-6 flex w-full flex-col gap-6">
      <p className="text-center text-[22px] font-bold text-white">Fake News · Evidence type: {group}</p>
      <p className="text-center text-[16px] text-white/85">{rows.length} cases. Each group below is the method of deception.</p>
      {ordered.map(([method, list]) => (
        <div key={method}>
          <p className="text-center text-[18px] font-semibold text-white">Method of deception: {method} · {list.length}</p>
          <div className="mt-2 flex flex-col gap-2">
            {list.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => onOpen(row.id)}
                className="w-full rounded-2xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] leading-snug text-white"
              >
                <span className="block font-semibold">{row.networkName}</span>
                <span className="mt-1 block">{row.who} · {row.began}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FrontList({ group, name, onOpen }: { group: string; name: string; onOpen: (id: string) => void }) {
  const rows = NEWS_CASES.filter((row) => row.networkGroup === group && row.networkName === name);
  const methods = new Map<string, number>();
  rows.forEach((row) => methods.set(row.method, (methods.get(row.method) ?? 0) + 1));
  const methodLine = [...methods.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => `${label} · ${count}`).join(" · ");
  return (
    <div className="mt-6 flex w-full flex-col gap-2">
      <p className="text-center text-[18px] font-semibold text-white">{name}</p>
      <p className="text-center text-[16px] font-semibold text-white">{group} · {rows.length}</p>
      <p className="text-center text-[15px] leading-snug text-white/85">Method of deception: {methodLine || "Not on record"}</p>
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => onOpen(row.id)}
          className="w-full rounded-2xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] leading-snug text-white"
        >
          <span className="block font-semibold">Method of deception: {row.method}</span>
          <span className="mt-1 block">{row.who} · {row.began}</span>
        </button>
      ))}
    </div>
  );
}

const AIRINGS: Record<string, { speaker: string; outlet: string; when: string; duration: string; views: string; likes: string; href: string }[]> = {
  "25": [{ speaker: "Adam Schiff", outlet: "CNN", when: "Feb. 17, 2019", duration: "8 minutes 35 seconds", views: "Not published", likes: "Not published", href: "https://www.cnn.com/videos/politics/2019/02/17/sotu-schiff-full.cnn" }],
  "26": [{ speaker: "James Comey", outlet: "The Washington Post", when: "Dec. 9, 2019", duration: "One op-ed", views: "Not published", likes: "Not published", href: "https://www.washingtonpost.com/opinions/james-comey-the-truth-is-finally-out-the-fbi-fulfilled-its-mission/2019/12/09/614df00c-1aad-11ea-8d58-5ac3600967a1_story.html" }],
  "52": [{ speaker: "Keith Ellison", outlet: "CBS", when: "Jan. 29, 2017", duration: "One interview", views: "Not published", likes: "Not published", href: "https://www.cbsnews.com/news/democratic-congressman-blasts-president-trumps-religiously-based-ban/" }],
  "85": [{ speaker: "Marshall Cohen", outlet: "CNN", when: "Dec. 11, 2019", duration: "One article", views: "Not published", likes: "Not published", href: "https://www.cnn.com/2019/12/11/politics/justice-department-inspector-general-senate-hearing" }],
};

function FrontCase({ id, onSource }: { id: string; onSource: (href: string) => void }) {
  const row = NEWS_CASES.find((item) => item.id === id);
  if (!row) return null;
  const airings = AIRINGS[id] ?? [{
    speaker: row.person,
    outlet: row.networkName,
    when: row.began,
    duration: row.duration,
    views: "Not published",
    likes: "Not published",
    href: row.sources[0]?.href ?? "",
  }];
  return (
    <div className="mt-8 w-full text-left text-[15px] leading-snug">
      <p className="text-center text-[18px] font-semibold text-white">Method of deception: {row.method}</p>
      <p className="mt-1 text-center text-white/75">{row.who}</p>
      <p className="mt-1 text-center text-white/75">{row.began} · {row.evidence}</p>
      <p className="mt-4 text-white/85">One claim. Each airing counts once against the speaker and once against the outlet. A repeat is a new airing. Views and likes are entered only when they were read on that post.</p>
      {airings.map((airing) => (
        <button
          key={airing.href + airing.when}
          type="button"
          onClick={() => airing.href && onSource(airing.href)}
          className="mt-3 w-full rounded-3xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] leading-snug text-white"
        >
          <span className="block font-semibold">{airing.speaker} · {airing.outlet}</span>
          <span className="mt-1 block">{airing.when} · {airing.duration}</span>
          <span className="mt-1 block">Views {airing.views} · Likes {airing.likes}</span>
        </button>
      ))}
      <p className="mt-4 font-semibold">What they said</p>
      <p className="mt-1 text-white/85">{row.said}</p>
      <p className="mt-4 font-semibold">What the record shows</p>
      <p className="mt-1 text-white/85">{row.record}</p>
      <div className="mt-4 flex flex-col gap-2">
        {row.sources.map((source) => (
          <button
            key={source.href}
            type="button"
            onClick={() => onSource(source.href)}
            className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
          >
            {source.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const OFFICES = ["Senators", "House", "POTUS", "Cabinet", "Networks", "Journalists", "Influencers", "Foreign nations", "Viral posts", "Late night", "The View", "Bill Maher", "Former or candidates", "Trump and family", "FBI, DOJ, AG", "Fact-checkers", "No deceptive statement"];
const OFF_THE_PAGE = new Set(["sh-not-2383", "sh-committee", "sh-cruz-absent", "sh-smith-doubt"]);
const NEWS_GROUPS = new Set(["Print/Web news", "MSM Networks", "Cable Networks", "Public Broadcasting"]);
const FOREIGN_COUNTRY: Record<string, string> = {
  BBC: "United Kingdom",
  "The Guardian": "United Kingdom",
  "The Telegraph (UK)": "United Kingdom",
  Reuters: "United Kingdom",
  "Der Spiegel": "Germany",
  AFP: "France",
};

function onTheMicrophone(row: (typeof senateHearings)[number]) {
  return !OFF_THE_PAGE.has(row.id);
}

function outletCases() {
  return fakeNewsCases.filter((row) => NEWS_GROUPS.has(row.networkGroup) && !FOREIGN_COUNTRY[row.network]);
}

function foreignCases() {
  return fakeNewsCases.filter((row) => FOREIGN_COUNTRY[row.network]);
}

function influencerCases() {
  return fakeNewsCases.filter((row) => row.networkGroup === "Social Media");
}

function journalistCases() {
  const officials = new Set(
    fakeNewsCases.filter((row) => row.networkGroup === "Politicians/Officials").map((row) => row.person),
  );
  return fakeNewsCases.filter(
    (row) =>
      NEWS_GROUPS.has(row.networkGroup) &&
      row.person &&
      row.person !== "Not yet identified" &&
      !officials.has(row.person),
  );
}

const OFFICIAL_VIRAL = new Set(["259", "89", "95", "144", "181"]);

function viralCases() {
  return fakeNewsCases.filter((row) => /viral/i.test(`${row.who} ${row.said}`));
}

function trumpCases() {
  const family = /trump|melania|ivanka|barron|jared kushner|tiffany trump/i;
  return fakeNewsCases.filter(
    (row) => !["254", "255", "259"].includes(row.id) && family.test(`${row.said} ${row.who}`),
  );
}

function justiceCases() {
  return fakeNewsCases.filter((row) => ["26", "264"].includes(row.id));
}

function formerCases() {
  return fakeNewsCases.filter((row) => {
    if (row.person === "Not yet identified") return false;
    const blob = `${row.who} ${row.party}`;
    if (row.party === "Campaigns") return true;
    if (/former president|former vermont|gubernatorial candidate/i.test(blob)) return true;
    return /campaign/i.test(row.who) && row.networkGroup === "Politicians/Officials";
  });
}

const BUCKET_COLOR: Record<string, string> = {
  "Omitted context": "#1d4ed8",
  "Misquote / truncation": "#b91c1c",
  Fabrication: "#7c2d12",
  "False photo or video": "#6d28d9",
  "Premature proven framing": "#a16207",
  "Retracted invention": "#0f766e",
  "Policy-scope inflation": "#14532d",
  Inflammatory: "#9f1239",
  Other: "#334155",
  "No deceptive statement": "#a3a3a3",
};

function bucketOf(method: string) {
  const text = method.toLowerCase();
  if (/no deceptive/.test(text)) return "No deceptive statement";
  if (/photo|video/.test(text)) return "False photo or video";
  if (/retract/.test(text)) return "Retracted invention";
  if (/misquote|truncat|contextomy/.test(text)) return "Misquote / truncation";
  if (/proven|premature/.test(text)) return "Premature proven framing";
  if (/policy|scope inflation/.test(text)) return "Policy-scope inflation";
  if (/inflam|grandstand/.test(text)) return "Inflammatory";
  if (/fabricat|false attribution|falsehood|attribution/.test(text)) return "Fabrication";
  if (/omit|context/.test(text)) return "Omitted context";
  return "Other";
}

const HOUSE_MEMBERS = new Set([
  "Nancy Pelosi",
  "Alexandria Ocasio-Cortez",
  "Hakeem Jeffries",
  "Jerrold Nadler",
  "Maxine Waters",
  "Eric Swalwell",
  "Diana DeGette",
  "Debbie Wasserman Schultz",
  "Adam Schiff",
]);

function toNewsRow(row: (typeof fakeNewsCases)[number] | (typeof politicalStatements)[number]) {
  return {
    id: row.id,
    person: "person" in row && row.person && row.person !== "Not yet identified" ? row.person : "Not yet identified",
    network: row.network,
    views: "views" in row && row.views ? row.views : "Not on record",
    likes: "likes" in row && row.likes ? row.likes : "Not on record",
    method: row.method,
    duration: row.duration,
    bucket: bucketOf(row.method),
  };
}

function categoryRows(method: string) {
  if (method === "Senators") {
    const kept = senateHearings.filter(onTheMicrophone);
    const also = senateHearings.filter((row) => OFF_THE_PAGE.has(row.id));
    return [...kept, ...also].map((row) => ({
      id: row.id,
      person: row.senator,
      network: row.hearing,
      views: row.views,
      likes: row.likes,
      method: row.method,
      duration: row.duration,
      bucket: bucketOf(row.method),
    }));
  }
  if (method === "House") {
    return [
      ...fakeNewsCases.filter((row) => HOUSE_MEMBERS.has(row.person)).map(toNewsRow),
      ...politicalStatements.filter((row) => row.office === "House").map(toNewsRow),
    ];
  }
  if (method === "POTUS") {
    return [
      ...fakeNewsCases.filter((row) => row.person === "Joe Biden" || row.person === "Donald Trump").map(toNewsRow),
      ...politicalStatements.filter((row) => row.office === "POTUS").map(toNewsRow),
    ];
  }
  if (method === "Cabinet") {
    return fakeNewsCases.filter((row) => row.person === "Pete Buttigieg").map(toNewsRow);
  }
  if (method === "No deceptive statement") {
    return politicalStatements.filter((row) => row.office === "No deceptive statement").map(toNewsRow);
  }
  const source =
    method === "Networks"
      ? outletCases()
      : method === "Journalists"
        ? journalistCases()
        : method === "Influencers"
          ? influencerCases()
          : method === "Foreign nations"
            ? foreignCases()
            : method === "Viral posts"
              ? viralCases()
              : method === "Former or candidates"
                ? formerCases()
                : method === "Trump and family"
                  ? trumpCases()
                  : method === "FBI, DOJ, AG"
                    ? justiceCases()
                    : [];
  const extra = method === "Former or candidates" ? politicalStatements.filter((row) => row.office === "Former or candidates") : [];
  return [...source.map(toNewsRow), ...extra.map(toNewsRow)];
}

function repeatCount(rows: ReturnType<typeof categoryRows>, person: string) {
  if (person === "Not yet identified") return "Not one person";
  return String(rows.filter((row) => row.person === person).length);
}

function SenateChart({ onOpen }: { onOpen: (method: string) => void }) {
  const shown = [
    categoryRows("Senators").length,
    categoryRows("House").length,
    categoryRows("POTUS").length,
    categoryRows("Cabinet").length,
    outletCases().length,
    journalistCases().length,
    influencerCases().length,
    foreignCases().length,
    viralCases().length,
    0,
    0,
    0,
    formerCases().length,
    trumpCases().length,
    justiceCases().length,
    16,
    politicalStatements.filter((row) => row.office === "No deceptive statement").length,
  ];
  const colors = ["#7c2d12", "#1e3a5f", "#14532d", "#b91c1c", "#1d4ed8", "#a16207", "#6d28d9", "#0f766e", "#9f1239", "#c2410c", "#be185d", "#7f1d1d", "#365314", "#991b1b", "#1e293b", "#166534", "#a3a3a3"];
  return (
    <LayerChart
      title="Public trust"
      line="These statements are here because they shaped public opinion. The speaker held a microphone from a position of public trust. A fact-checker is not required for that."
      labels={OFFICES}
      data={shown}
      colors={colors}
      type="doughnut"
      horizontal={false}
      bullets={[]}
      center={{ big: String(shown.reduce((sum, count) => sum + count, 0)), small: "Counted", onOpen: () => undefined }}
      onPick={(index) => onOpen(OFFICES[index])}
    />
  );
}

function CategoryChart({ method, onOpen }: { method: string; onOpen: (bucket: string) => void }) {
  if (method === "Fact-checkers") {
    return (
      <LayerChart
        title="Fact-checkers"
        line="Who checks them: Swamp Force, same 7 tests, Sep. 24, 2026. Approved is the only pass. Caution means use only after our own research. Rejected means do not use."
        labels={CHECKER_GROUPS}
        data={CHECKER_DATA}
        colors={CHECKER_COLORS}
        keys={CHECKER_GROUPS.map((label, index) => ({ label: `${label} · ${CHECKER_DATA[index]}`, color: CHECKER_COLORS[index], index }))}
        type="doughnut"
        horizontal={false}
        bullets={[]}
        colorKey
        center={{ big: "16", small: "Tested", onOpen: () => undefined }}
        onPick={(index) => onOpen(CHECKER_GROUPS[index])}
      />
    );
  }
  const rows = categoryRows(method);
  const order = Object.keys(BUCKET_COLOR);
  const labels = order.filter((label) => rows.some((row) => row.bucket === label));
  const data = labels.map((label) => rows.filter((row) => row.bucket === label).length);
  if (!labels.length) {
    return <p className="mt-8 text-center text-[15px] text-white/80">None yet. A name is added only after a full check of the public record.</p>;
  }
  return (
    <LayerChart
      title={method}
      line="Tap a color. The evidence is behind the chart."
      labels={labels}
      data={data}
      colors={labels.map((label) => BUCKET_COLOR[label])}
      keys={labels.map((label, index) => ({ label: `${label === "No deceptive statement" ? "No deceptive statement" : `Method of deception: ${label}`} · ${data[index]}`, color: BUCKET_COLOR[label], index }))}
      type="doughnut"
      horizontal={false}
      bullets={[]}
      colorKey
      center={{ big: String(rows.length), small: "On record", onOpen: () => undefined }}
      onPick={(index) => onOpen(labels[index])}
    />
  );
}

function EvidenceList({ method, bucket, onOpen }: { method: string; bucket: string; onOpen: (id: string) => void }) {
  if (method === "Fact-checkers") {
    const rows = CHECKER_TABLE.filter((row) => row.outcome === bucket);
    return (
      <div className="mt-6 flex w-full flex-col gap-2">
        <p className="text-center text-[18px] font-semibold text-white">{bucket} · {rows.length}</p>
        <p className="text-center text-[15px] text-white/80">A fact-checker is never the proof. Where one was used, we checked the original record ourselves.</p>
        {rows.map((row) => (
          <button
            key={row.name}
            type="button"
            onClick={() => onOpen(`fc:${row.name}`)}
            className="w-full rounded-2xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] leading-snug text-white"
          >
            <span className="block font-semibold">{row.name}</span>
            <span className="block">{row.owner}</span>
            <span className="block">Reliable: {row.outcome}</span>
            <span className="block">{row.ifcn}</span>
            <span className="block">Our own research: required. Confirms {row.confirms} of our cases, and only as a second look.</span>
          </button>
        ))}
      </div>
    );
  }
  const all = categoryRows(method);
  const rows = all.filter((row) => row.bucket === bucket);
  return (
    <div className="mt-6 flex w-full flex-col gap-2">
      <p className="text-center text-[18px] font-semibold text-white">{bucket === "No deceptive statement" ? `No deceptive statement · ${rows.length}` : `Method of deception: ${bucket} · ${rows.length}`}</p>
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => onOpen(row.id)}
          className="w-full rounded-2xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] leading-snug text-white"
        >
          <span className="block font-semibold">{row.person}</span>
          <span className="block">{row.network}</span>
          <span className="block">Views {row.views} · Likes {row.likes}</span>
          <span className="block font-semibold">Shaped public opinion. Said from a position of public trust.</span>
          <span className="block font-semibold">{row.method === "No deceptive statement" ? "No deceptive statement" : `Method of deception: ${row.method}`}</span>
          <span className="block">Duration {row.duration} · Repeated {repeatCount(all, row.person)}</span>
          {method === "Viral posts" ? (
            <span className="block">{OFFICIAL_VIRAL.has(row.id) ? "Leads to a public official" : "Does not lead to a public official"}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function PoliticalCase({ id, onSource }: { id: string; onSource: (href: string) => void }) {
  const row = politicalStatements.find((item) => item.id === id);
  if (!row) return null;
  return (
    <div className="mt-8 w-full text-left text-[15px] leading-snug">
      <p className="text-center text-[18px] font-semibold text-white">{row.person}</p>
      <p className="mt-1 text-center text-white/75">{row.network} · {row.began}</p>
      <p className="mt-3 text-white/85">Shaped public opinion. Said from a position of public trust.</p>
      <p className="mt-4 font-semibold">Method of deception: {row.method}</p>
      <p className="mt-4 font-semibold">What they said</p>
      <p className="mt-1 text-white/85">{row.said}</p>
      <p className="mt-4 font-semibold">What the record shows</p>
      <p className="mt-1 text-white/85">{row.record}</p>
      <div className="mt-4 flex flex-col gap-2">
        {row.sources.map((source) => (
          <button key={source.href} type="button" onClick={() => onSource(source.href)} className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white">
            {source.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckerPage({ name }: { name: string }) {
  const row = CHECKER_TABLE.find((item) => item.name === name);
  const section = factCheckerVetting.find((item) => row && item.title.startsWith(name));
  return (
    <div className="mt-8 w-full text-left text-[15px] leading-snug">
      <p className="text-center text-[18px] font-semibold text-white">{name}</p>
      <p className="mt-3 text-white/85">Reliable: {row?.outcome ?? "Not on record"}. A fact-checker is never the proof. Where this one was used, the original record was checked first.</p>
      {(section?.paras ?? []).map((paragraph) => (
        <p key={paragraph} className="mt-3 text-white/85">{paragraph.replace(CHECKER_MARK, "")}</p>
      ))}
    </div>
  );
}

function NewsCase({ id, onSource }: { id: string; onSource: (href: string) => void }) {
  const row = fakeNewsCases.find((item) => item.id === id);
  if (!row) return null;
  return (
    <div className="mt-8 w-full text-left text-[15px] leading-snug">
      <p className="text-center text-[18px] font-semibold text-white">{row.who}</p>
      <p className="mt-1 text-center text-white/75">{row.network} · {row.began}</p>
      <p className="mt-3 text-white/85">Shaped public opinion. Said from a position of public trust.</p>
      <p className="mt-4 font-semibold">What they said</p>
      <p className="mt-1 text-white/85">{row.said}</p>
      <p className="mt-4 font-semibold">What the record shows</p>
      <p className="mt-1 text-white/85">{row.record}</p>
      <div className="mt-4 flex flex-col gap-2">
        {row.sources.map((source) => (
          <button
            key={source.href}
            type="button"
            onClick={() => onSource(source.href)}
            className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
          >
            {source.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SenateCase({ id, onSource }: { id: string; onSource: (href: string) => void }) {
  const row = senateHearings.find((item) => item.id === id);
  if (!row) return null;
  return (
    <div className="mt-8 w-full text-left text-[15px] leading-snug">
      <p className="text-center text-[18px] font-semibold text-white">{row.senator}</p>
      <p className="mt-1 text-center text-white/75">{row.hearing}</p>
      <p className="mt-3 text-white/85">Shaped public opinion. Said from a position of public trust.</p>
      <p className="mt-1 text-center text-white/75">{row.date} · {row.method}</p>
      <p className="mt-3 text-white/85">{row.where}</p>
      <p className="mt-3">Duration {row.duration} · Views {row.views} · Likes {row.likes}</p>
      <p className="mt-4 font-semibold">What they said</p>
      <p className="mt-1 text-white/85">{row.said}</p>
      <p className="mt-4 font-semibold">What the record shows</p>
      <p className="mt-1 text-white/85">{row.record}</p>
      <div className="mt-4 flex flex-col gap-2">
        {row.sources.map((source) => (
          <button
            key={source.href}
            type="button"
            onClick={() => onSource(source.href)}
            className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
          >
            {source.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Tile donuts: added for each tile. Numbers are counted from the evidence listed under the tile. ----
type DonutItem = { key: string; title: string; lines: string[]; sources: { label: string; href: string }[] };
type DonutGroup = { label: string; color: string; items: DonutItem[]; value?: number };
type DonutSpec = { id: string; title: string; unit: string; groups: DonutGroup[]; empty?: string };

const donutCount = (group: DonutGroup) => group.value ?? group.items.length;

const DONUT_ORDER = [
  "Republican politicians",
  "Democratic politicians",
  "Networks",
  "Journalists",
  "Social media",
  "Campaigns",
  "Advocacy groups",
  "Not yet grouped: Democratic politician on a network",
  "Not yet identified",
];

const DONUT_COLORS: Record<string, string> = {
  "Republican politicians": "#dc2626",
  "Democratic politicians": "#2563eb",
  Networks: "#a3a3a3",
  Journalists: "#0f766e",
  "Social media": "#f59e0b",
  Campaigns: "#7c3aed",
  "Advocacy groups": "#be185d",
  "Not yet grouped: Democratic politician on a network": "#7c2d12",
  "Not yet identified": "#57534e",
};

const DONUT_OTHER_COLORS = ["#d4af37", "#0f766e", "#7c3aed", "#1e3a5f", "#b45309", "#be185d", "#14532d", "#78716c"];

function donutNewsGroup(row: NewsCaseRow) {
  if (row.networkGroup === "Politicians/Officials") {
    if (row.party === "Republican") return "Republican politicians";
    if (row.party === "Democratic") return "Democratic politicians";
    return row.party;
  }
  if (row.networkGroup === "Cable Networks" || row.networkGroup === "MSM Networks") {
    return row.party === "Democratic" ? "Not yet grouped: Democratic politician on a network" : "Networks";
  }
  if (row.networkGroup === "Print/Web news" || row.networkGroup === "Public Broadcasting") return "Journalists";
  if (row.networkGroup === "Social Media") return "Social media";
  if (row.networkGroup === "Advocacy groups") return "Advocacy groups";
  return NEWS_NYI;
}

function donutNewsItem(row: NewsCaseRow): DonutItem {
  return {
    key: `case-${row.id}`,
    title: row.who,
    lines: [
      `Case ${row.id} · ${row.began}`,
      `Where: ${row.networkName}`,
      `What was said: ${row.said}`,
      `The record: ${row.record}`,
      `Correction: ${row.correction}`,
      `Status: ${row.statusLabel}`,
    ],
    sources: row.sources,
  };
}

function donutGroups(pairs: { group: string; item: DonutItem }[], order: string[], colors: Record<string, string>) {
  const labels = [...order, ...[...new Set(pairs.map((pair) => pair.group))].filter((label) => !order.includes(label))];
  let other = 0;
  return labels
    .map((label) => ({
      label,
      color: colors[label] ?? DONUT_OTHER_COLORS[other++ % DONUT_OTHER_COLORS.length],
      items: pairs.filter((pair) => pair.group === label).map((pair) => pair.item),
    }))
    .filter((group) => group.items.length > 0);
}

function donutNews(id: string, title: string, rows: NewsCaseRow[]): DonutSpec {
  return {
    id,
    title,
    unit: "fake news cases",
    groups: donutGroups(rows.map((row) => ({ group: donutNewsGroup(row), item: donutNewsItem(row) })), DONUT_ORDER, DONUT_COLORS),
  };
}

function donutCardRows(deceptionId: string) {
  const entry = DECEPTION.find((item) => item.id === deceptionId);
  const names = [...(entry?.categories ?? []), ...(entry?.stations ?? [])].map((card) => card.name).filter((name) => CARD_CASES[name]);
  return NEWS_CASES.filter((row) => names.some((name) => CARD_CASES[name].match(row)));
}

type LawCaseRow = (typeof lawfareCases.cases)[number];

function donutLawGroup(row: LawCaseRow) {
  const who = lawfareCases.charts.find((chart) => chart.id === "who");
  const index = who ? who.caseIds.findIndex((ids) => ids.includes(row.id)) : -1;
  const label = who && index >= 0 ? who.labels[index] : NEWS_NYI;
  if (label.includes("(D)")) return "Democratic politicians";
  if (label.includes("(R)")) return "Republican politicians";
  return label;
}

function donutLawItem(row: LawCaseRow): DonutItem {
  return {
    key: row.id,
    title: row.caseName,
    lines: [
      `Brought by: ${row.broughtBy}`,
      `Court: ${row.court}`,
      `Filed: ${row.filedDate}`,
      `Status now: ${row.currentStatus}`,
    ],
    sources: row.links.filter((link) => link.href.startsWith("http")).map((link) => ({ label: link.label, href: lawLocal(link.href) })),
  };
}

function donutLaw(id: string, title: string, rows: LawCaseRow[], news: NewsCaseRow[] = []): DonutSpec {
  const pairs = [
    ...rows.map((row) => ({ group: donutLawGroup(row), item: donutLawItem(row) })),
    ...news.map((row) => ({ group: donutNewsGroup(row), item: donutNewsItem(row) })),
  ];
  return {
    id,
    title,
    unit: news.length ? "court cases and deception cases" : "court cases",
    groups: donutGroups(pairs, DONUT_ORDER, DONUT_COLORS),
  };
}

const HOUSE_SUMMARY_HREF = "https://ethics.house.gov/wp-content/uploads/2025/01/Committee-Report.pdf";

function donutHouse(): DonutSpec {
  const pairs = houseEthicsMatters.matters.map((matter, index) => ({
    group: matter.party === "Republican" ? "Republican politicians" : matter.party === "Democratic" ? "Democratic politicians" : "Jan. 6 select committee referral (no Member named)",
    item: {
      key: `house-${index}`,
      title: matter.name ? `Rep. ${matter.name} (${matter.party})` : "January 6 select committee referral",
      lines: [matter.line],
      sources: [
        { label: "Committee on Ethics, Summary of Activities, 118th Congress", href: HOUSE_SUMMARY_HREF },
        ...(matter.bioguide
          ? [{ label: `Biographical Directory of Congress: ${matter.name}`, href: `https://bioguide.congress.gov/search/bio/${matter.bioguide}` }]
          : []),
      ],
    },
  }));
  return { id: "house", title: "House", unit: "House Ethics matters", groups: donutGroups(pairs, DONUT_ORDER, DONUT_COLORS) };
}

const SAVE_COLOR_OF: Record<string, string> = Object.fromEntries(SAVE_GROUP_LABELS.map((label, index) => [label, SAVE_GROUP_COLORS[index]]));

function donutSave(): DonutSpec {
  const pairs = SAVE_ROWS.map((row) => ({
    group: row.group,
    item: {
      key: row.id,
      title: row.who,
      lines: [
        `Where: ${row.where}`,
        `When: ${row.when}`,
        `Views: ${row.views}`,
        `What was said: ${row.said}`,
        ...(row.record ? [`The record: ${row.record}`] : []),
      ],
      sources: row.links,
    },
  }));
  return { id: "save", title: "Social Media Weapon", unit: "posts", groups: donutGroups(pairs, SAVE_GROUP_LABELS, SAVE_COLOR_OF) };
}


function donutPiece(piece: { label: string; href?: string; note?: string }, key: string, extra: string[] = []): DonutItem {
  return {
    key,
    title: piece.label,
    lines: [...extra, ...(piece.note ? [piece.note] : [])],
    sources: piece.href ? [{ label: piece.label, href: piece.href }] : [],
  };
}

function donutFlow(
  id: string,
  title: string,
  items: { name: string; info: string; evidence: { label: string; href?: string; note?: string }[] }[],
  endTitle: string,
  ends: { line: string; label: string; href?: string; note?: string }[],
): DonutSpec {
  const groups: DonutGroup[] = items.map((item, index) => ({
    label: item.name,
    color: DONUT_OTHER_COLORS[index % DONUT_OTHER_COLORS.length],
    items: item.evidence.map((piece, at) => donutPiece(piece, `${id}-${index}-${at}`, [item.info])),
  }));
  groups.push({
    label: endTitle,
    color: "#a3a3a3",
    items: ends.map((piece, at) => donutPiece(piece, `${id}-end-${at}`, [piece.line])),
  });
  return { id, title, unit: "pieces of evidence", groups: groups.filter((group) => group.items.length > 0) };
}

function donutMechanics(): DonutSpec {
  const spec = donutFlow("mechanics", "Understanding the Mechanics of Fake News", METHODS.map((item) => ({ ...item, evidence: item.evidence })), "Outcome", EFFECTS);
  const topics: DonutGroup[] = TOPICS.map((group, index) => ({
    label: group.topic,
    color: ["#14532d", "#7c2d12", "#1e3a5f", "#be185d", "#57534e", "#ca8a04"][index % 6],
    items: group.items.flatMap((item, at) => item.sources.map((piece, k) => donutPiece(piece, `mechanics-topic-${index}-${at}-${k}`, [item.line]))),
  }));
  return { ...spec, groups: [...spec.groups, ...topics.filter((group) => group.items.length > 0)] };
}

function donutCheckers(): DonutSpec {
  return {
    id: "checkers",
    title: "Fact-checkers",
    unit: "fact-checkers tested",
    groups: CHECKER_GROUPS.map((label, index) => ({
      label,
      color: CHECKER_COLORS[index],
      items: CHECKER_TABLE.filter((row) => row.outcome === label).map((row) => ({
        key: `checker-${row.name}`,
        title: row.name,
        lines: [`Owner / lean: ${row.owner}`, `IFCN status (Sep 24, 2026): ${row.ifcn}`, `Outcome: ${row.outcome}`, `Cases it confirms: ${row.confirms}`],
        sources: checkerDetail(row.name).links.filter((link) => link.href.startsWith("http")),
      })),
    })).filter((group) => group.items.length > 0),
  };
}

function donutImpeach(): DonutSpec {
  const order = LAYERS.impeach.buttons;
  return {
    id: "impeach",
    title: "Impeachments",
    unit: "impeachment records",
    groups: order
      .map((label, index) => {
        const record = donutRecords.impeachments.find((item) => item.label === label);
        return {
          label,
          color: ["#b91c1c", "#7c2d12", "#1e3a5f"][index % 3],
          items: record ? [{ key: `impeach-${index}`, title: label, lines: [record.line], sources: record.links }] : [],
        };
      })
      .filter((group) => group.items.length > 0),
  };
}

function donutSenate(): DonutSpec {
  return {
    id: "senate",
    title: "Senate",
    unit: "alleged violations received",
    groups: donutRecords.senate.map((report, index) => ({
      label: report.label,
      color: ["#d4af37", "#c4b48a", "#8a8175"][index % 3],
      value: report.received,
      items: [{ key: `senate-${index}`, title: `Select Committee on Ethics, ${report.label}`, lines: report.lines, sources: report.links }],
    })),
  };
}

const donutEmpty = (id: string, title: string): DonutSpec => ({ id, title, unit: "pieces of evidence", groups: [], empty: "Evidence coming soon" });

const LAW_DECEPTION_ROWS = lawfareCases.deceptionIds
  .map((id) => NEWS_CASES.find((row) => row.id === id))
  .filter((row): row is NewsCaseRow => !!row);

const DONUTS: Record<string, DonutSpec> = {
  fake: donutNews("fake", "Fake News", NEWS_CASES),
  evidence: donutNews("evidence", "Fake News Evidence", NEWS_CASES),
  save: donutSave(),
  network: donutNews("network", "Network deception", donutCardRows("network")),
  journalists: donutNews("journalists", "Journalists", donutCardRows("journalists")),
  politicians: donutNews("politicians", "Politicians deceptions", donutCardRows("politicians")),
  social: donutNews("social", "Social media warfare", donutCardRows("social")),
  lawfare: donutLaw("lawfare", "Lawfare", lawfareCases.cases),
  trials: donutLaw("trials", "Trump Trials", lawfareCases.cases.filter((row) => row.group === "Trump Trials")),
  citizen: donutLaw("citizen", "US Citizen Lawfare", lawfareCases.cases.filter((row) => row.group === "US Citizen Lawfare")),
  lawEvidence: donutLaw("lawEvidence", "Lawfare Evidence", lawfareCases.cases, LAW_DECEPTION_ROWS),
  house: donutHouse(),
  mechanics: donutMechanics(),
  fcc: donutFlow("fcc", "FCC rules", FCC_RULES, openRuleChart("fcc").endTitle, FCC_ENDS),
  press: donutFlow("press", "Journalist code of ethics", JOURNAL_RULES, openRuleChart("press").endTitle, JOURNAL_ENDS),
  codes: donutFlow("codes", "Ethics codes", CODE_RULES, openRuleChart("codes").endTitle, CODE_ENDS),
  cable: donutFlow("cable", "Cable news", CABLE_RULES, openRuleChart("cable").endTitle, CABLE_ENDS),
  estimates: donutEmpty("estimates", "Estimates"),
  checkers: donutCheckers(),
  impeach: donutImpeach(),
  bail: donutEmpty("bail", "Politicians' bail funds"),
  scrutiny: donutEmpty("scrutiny", "Scrutiny compared"),
  attempts: donutEmpty("attempts", "Assassination attempts"),
  first100: donutEmpty("first100", "First 100 days"),
  senate: donutSenate(),
};

function TileDonut({ spec }: { spec?: DonutSpec }) {
  const [pick, setPick] = useState<string | null>(null);
  const openRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (pick) openRef.current?.scrollIntoView({ block: "start" });
  }, [pick]);
  if (!spec) return null;
  const groups = spec.groups;
  const total = groups.reduce((sum, group) => sum + donutCount(group), 0);
  if (spec.empty && total === 0) {
    return (
      <div className="w-full" data-donut={spec.id} data-donut-total={0}>
        <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{spec.title}</p>
        <p className="mt-2 text-center text-[15px] text-white/75">0 {spec.unit}</p>
        <div className={NEWS_CARD}>
          <div className="relative mx-auto flex h-[260px] w-[260px] items-center justify-center rounded-full border-[44px] border-white/15">
            <span className="flex flex-col items-center">
              <span className="text-[30px] leading-none font-bold text-white">0</span>
              <span className="mt-1 text-center text-[15px] font-semibold text-white/80">{spec.empty}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  const shown = pick === "all" ? groups : groups.filter((group) => group.label === pick);
  return (
    <div className="w-full" data-donut={spec.id} data-donut-total={total}>
      <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{spec.title}</p>
      <LayerChart
        title={spec.title}
        line={`${total} ${spec.unit} · tap a slice or key line`}
        labels={groups.map((group) => group.label)}
        data={groups.map((group) => donutCount(group))}
        colors={groups.map((group) => group.color)}
        type="doughnut"
        horizontal={false}
        bullets={[]}
        center={{ big: String(total), small: "All", onOpen: () => setPick("all") }}
        onPick={(index) => setPick(groups[index].label)}
        colorKey
      />
      {pick ? (
        <section ref={openRef} data-donut-evidence={pick} data-donut-valued={shown.some((group) => group.value !== undefined) ? "1" : "0"} className="mt-6 w-full scroll-mt-16 text-left">
          <button type="button" data-donut-back onClick={() => setPick(null)} className={NEWS_DOOR + " w-fit"}>
            Back
          </button>
          <h2 className="mt-4 text-center text-[20px] font-bold leading-snug text-white">
            {pick === "all" ? `${spec.title}: all ${total} ${spec.unit}` : `${spec.title} · ${pick}: ${shown[0] ? donutCount(shown[0]) : 0} ${spec.unit}`}
          </h2>
          {shown.map((group) => (
            <div key={group.label} className="mt-6">
              <p className="flex items-center gap-2 text-[17px] font-semibold text-white">
                <span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: group.color }} />
                {group.label} · {donutCount(group)}
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {group.items.map((item) => (
                  <article key={item.key} data-donut-item={item.key} className="w-full rounded-2xl border border-white/35 bg-[#070b12]/85 px-4 py-3 text-[15px] leading-snug text-white">
                    <p className="font-semibold">{item.title}</p>
                    {item.lines.map((line, index) => (
                      <p key={index} className="mt-1 text-white/85">
                        {line}
                      </p>
                    ))}
                    {item.sources.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.sources.map((source, index) => (
                          <a
                            key={`${source.href}-${index}`}
                            href={source.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                          >
                            {source.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-white/60">No source link on file</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function Betrayal() {
  const [layer, setLayer] = useState<Layer>("root");
  const [frontGroup, setFrontGroup] = useState<string | null>(null);
  const [frontName, setFrontName] = useState<string | null>(null);
  const [frontCase, setFrontCase] = useState<string | null>(null);
  const [frontHref, setFrontHref] = useState<string | null>(null);
  const [frontCode, setFrontCode] = useState<null | "menu" | "press" | "congress">(null);
  const [senateOn, setSenateOn] = useState(false);
  const [senateMethod, setSenateMethod] = useState<string | null>(null);
  const [senateId, setSenateId] = useState<string | null>(null);
  const [senateCase, setSenateCase] = useState<string | null>(null);
  const [senateSlice, setSenateSlice] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [ruleName, setRuleName] = useState<string | null>(null);
  const [ruleSource, setRuleSource] = useState<string | null>(null);
  const [ruleEnd, setRuleEnd] = useState(false);
  const [newsMethod, setNewsMethod] = useState<string | null>(null);
  const [newsFilter, setNewsFilter] = useState<NewsFilter>({ verdict: "All", time: "All", proof: "All", bars: "method", topic: "All" });
  const [newsCase, setNewsCase] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string | null>(null);
  const [saveOn, setSaveOn] = useState(false);
  const [estimatesOn, setEstimatesOn] = useState(false);
  const [saveRuling, setSaveRuling] = useState(false);
  const [saveBar, setSaveBar] = useState<string | null>(null);
  const [saveSource, setSaveSource] = useState<string | null>(null);
  const [saveHref, setSaveHref] = useState<string | null>(null);
  const [lawOn, setLawOn] = useState(false);
  const [lawPick, setLawPick] = useState<string | null>(null);
  const [lawCase, setLawCase] = useState<string | null>(null);
  const [lawHref, setLawHref] = useState<string | null>(null);
  const [outcome, setOutcome] = useState(false);
  const [aside, setAside] = useState<null | "standard" | "record">(null);
  const [deception, setDeception] = useState<string | null>(null);
  const [tilePath, setTilePath] = useState<string[]>([]);
  const [spot, setSpot] = useState<null | "cable" | "trump" | "podcasts" | "cspan">(null);
  const [checkerPick, setCheckerPick] = useState<string | null>(null);
  const [checkerName, setCheckerName] = useState<string | null>(null);
  const [checkerHref, setCheckerHref] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);
  const [cardSlice, setCardSlice] = useState<string | null>(null);
  const [topicSlice, setTopicSlice] = useState<string | null>(null);
  const [cardCase, setCardCase] = useState<string | null>(null);
  const [cardHref, setCardHref] = useState<string | null>(null);
  const [topicPick, setTopicPick] = useState<string | null>(null);
  const [topicCase, setTopicCase] = useState<string | null>(null);
  const [topicHref, setTopicHref] = useState<string | null>(null);
  const [impeachFile, setImpeachFile] = useState<null | "2019" | "2021" | "clinton" | "public">(null);
  const [impeachFrom, setImpeachFrom] = useState<null | "2019" | "2021" | "clinton">(null);
  const [ethicsDoc, setEthicsDoc] = useState<null | "house-menu" | "senate-menu" | "house" | "senate" | "house-summary" | "senate-summary" | "house-record" | "senate-record">(null);
  const topicBack = () => {
    if (topicHref) {
      setTopicHref(null);
      return true;
    }
    if (topicCase) {
      setTopicCase(null);
      return true;
    }
    if (topicPick) {
      const base = topicPick.split(":")[0];
      setTopicPick(base === "referrals" && topicPick.includes(":") ? base : null);
      return true;
    }
    return false;
  };
  const cardBack = () => {
    if (topicSlice) {
      const parts = topicSlice.split("|");
      setTopicSlice(parts.length > 2 ? parts.slice(0, 2).join("|") : null);
      return true;
    }
    if (cardHref) {
      setCardHref(null);
      return true;
    }
    if (cardCase) {
      setCardCase(null);
      return true;
    }
    if (cardSlice?.includes("|")) {
      const parts = cardSlice.split("|");
      setCardSlice(parts.slice(0, -1).join("|"));
      return true;
    }
    if (cardSlice) {
      setCardSlice(null);
      return true;
    }
    if (card) {
      setCard(null);
      return true;
    }
    return false;
  };
  const checkerBack = () => {
    if (checkerHref) {
      setCheckerHref(null);
      return true;
    }
    if (checkerName) {
      setCheckerName(null);
      return true;
    }
    if (checkerPick) {
      setCheckerPick(null);
      return true;
    }
    return false;
  };
  const newsBack = () => {
    if (newsSource) {
      setNewsSource(null);
      return;
    }
    if (newsCase) {
      setNewsCase(null);
      return;
    }
    if (newsMethod && newsMethod.startsWith("one:")) {
      const parts = newsMethod.slice(4).split(":");
      setNewsMethod(parts.length > 1 ? `one:${parts.slice(0, -1).join(":")}` : null);
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-term:")) {
      const path = newsPath(newsMethod.slice("chart-term:".length));
      setNewsMethod(path.length > 1 ? `chart-term:${JSON.stringify(path.slice(0, -1))}` : "chart-term");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-methods:")) {
      const parts = newsMethod.split(":");
      setNewsMethod(parts.length > 2 ? parts.slice(0, -1).join(":") : "chart-methods");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-proof:")) {
      const parts = newsMethod.split(":");
      setNewsMethod(parts.length > 2 ? parts.slice(0, -1).join(":") : "chart-proof");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-evidence:") && !newsMethod.startsWith("chart-evidence:never")) {
      const parts = newsMethod.split(":");
      setNewsMethod(parts.length > 2 ? parts.slice(0, -1).join(":") : "chart-evidence");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-evidence:never")) {
      if (newsMethod === "chart-evidence:never") {
        setNewsMethod("chart-evidence");
        return;
      }
      const rest = newsMethod.slice("chart-evidence:never:".length);
      const parts = rest.split("|");
      setNewsMethod(parts.length > 1 ? `chart-evidence:never:${parts.slice(0, -1).join("|")}` : "chart-evidence:never");
      return;
    }
    if (newsMethod && newsMethod.includes(":")) {
      const parts = newsMethod.split(":");
      setNewsMethod(parts.length > 2 ? parts.slice(0, -1).join(":") : parts[0]);
      return;
    }
    if (newsMethod) {
      setNewsMethod(null);
      return;
    }
    setLayer("fake");
  };
  const lawBack = () => {
    if (lawHref) {
      setLawHref(null);
      return;
    }
    if (lawCase) {
      setLawCase(null);
      return;
    }
    if (lawPick && lawPick.includes(":")) {
      setLawPick(lawPick.slice(0, lawPick.indexOf(":")));
      return;
    }
    if (lawPick) {
      setLawPick(null);
      return;
    }
    setLawOn(false);
  };
  const newsMine = !!newsMethod && (newsMethod.startsWith("chart-term") || newsMethod.startsWith("chart-evidence:never"));
  const buttons = layer === "root" ? ["Fake News", "Lawfare"] : LAYERS[layer].buttons;

  return (
    <main className="fixed inset-0 overflow-auto bg-[#070b12] text-white">
      <img
        src="/images/flag-distress-tattered.jpg"
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover object-bottom opacity-25"
      />
      <div className="pointer-events-none fixed inset-0 bg-[#070b12]/70" />
      <div className="relative z-10">
        {layer !== "fake" && layer !== "root" && layer !== "types" && layer !== "mechanics" && layer !== "evidence" && layer !== "bail" && layer !== "lawfare" && !lawOn && (
        <nav
          aria-label="Betrayal"
          className="relative flex min-h-14 items-center justify-center bg-[#070b12]/90 px-6 py-2"
        >
          {/* layer is never "root" inside this nav (checked above), so the button always shows, as before. */}
          {(
          <button
            type="button"
            onClick={() => {
              if (topicBack()) return;
              setLayer(LAYERS[layer].back);
            }}
              className="absolute left-6 border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              {LAYERS[layer].title}
            </button>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {buttons.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (label === "First, 2019" || label === "Second, 2021" || label === "Clinton, 1998") {
                    setImpeachFrom(null);
                    setImpeachFile(label === "First, 2019" ? "2019" : label === "Second, 2021" ? "2021" : "clinton");
                    setLayer("impeach");
                    return;
                  }
                  if (label === "Lawfare Evidence") {
                    setLawPick(null);
                    setLawCase(null);
                    setLawHref(null);
                    setLawOn(true);
                    return;
                  }
                  setLawOn(false);
                  const sub = LAW_SUB[label];
                  if (sub) {
                    setTopicHref(null);
                    setTopicPick(sub.pick);
                    setTopicCase(sub.caseId);
                    return;
                  }
                  setTopicPick(null);
                  setTopicCase(null);
                  setTopicHref(null);
                  const next = NEXT[label];
                  if (next) setLayer(next);
                }}
                className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[12px] leading-none font-semibold text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
        )}
        {layer === "root" && (
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-10 pb-24">
            {!frontHref && !frontCode && !frontCase && !frontName && !frontGroup && (
              <button
                type="button"
                onClick={() => {
                  setSource(null);
                  setMethod(null);
                  setLayer("mechanics");
                }}
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                  Understanding the Mechanics of Fake News
                </span>
                <img src="/images/topic-mechanics.jpg" alt="" className="h-44 w-full rounded-2xl border border-white/30 object-cover" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (frontHref) { setFrontHref(null); return; }
                if (frontCase) { setFrontCase(null); return; }
                if (frontName) { setFrontName(null); return; }
                if (frontGroup) { setFrontGroup(null); return; }
                if (frontCode === "press" || frontCode === "congress") { setFrontCode("menu"); return; }
                if (frontCode) { setFrontCode(null); return; }
              }}
              className="border-0 bg-transparent p-0 text-center text-[28px] font-bold tracking-wide text-white"
            >
              Fake News
            </button>
            <p className="mt-1 text-center text-[15px] text-white/70">The Great American Betrayal</p>
            <p className="mt-4 max-w-md text-center text-[15px] leading-snug text-white/75">
              {frontCode ? "The codes are documents, not cases. Tap a part." : "This chart is Fake News. It is not Lawfare. A case is counted once, by where it was said."}
            </p>
            {frontHref ? (
              <SourcePage label="Open the source" href={frontHref} />
            ) : frontCode === "press" ? (
              <div className="mt-8 w-full text-left text-[15px] leading-snug">
                <p className="text-center text-[18px] font-semibold">Press codes</p>
                <p className="mt-4">The Society of Professional Journalists code and the Radio Television Digital News Association code are voluntary. They are not a law.</p>
                <p className="mt-3">The FCC news-distortion policy covers a licensed over-the-air station. It does not cover cable, a newspaper, or a social media post. 47 U.S.C. § 326 bars the FCC from censoring a broadcast. It does not require a news report to be true.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button type="button" onClick={() => setFrontHref("https://www.spj.org/spj-code-of-ethics/")} className="w-fit rounded-full border border-white/35 px-3 py-1 text-left font-semibold">SPJ Code of Ethics</button>
                  <button type="button" onClick={() => setFrontHref("https://www.rtdna.org/ethics")} className="w-fit rounded-full border border-white/35 px-3 py-1 text-left font-semibold">RTDNA Code of Ethics</button>
                  <button type="button" onClick={() => setFrontHref("https://www.fcc.gov/broadcast-news-distortion")} className="w-fit rounded-full border border-white/35 px-3 py-1 text-left font-semibold">FCC news distortion policy</button>
                  <button type="button" onClick={() => setFrontHref("https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title47-section326&num=0&edition=prelim")} className="w-fit rounded-full border border-white/35 px-3 py-1 text-left font-semibold">47 U.S.C. § 326</button>
                </div>
              </div>
            ) : frontCode === "congress" ? (
              <div className="mt-8 w-full text-left text-[15px] leading-snug">
                <p className="text-center text-[18px] font-semibold">Congressional conduct</p>
                <p className="mt-4">House Rule XXIII is the Code of Official Conduct. The Senate Code of Official Conduct is in the Senate rules. Neither code states a rule that a member must not deceive the public.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button type="button" onClick={() => setFrontHref("/ethics-docs/house-rules-119.pdf")} className="w-fit rounded-full border border-white/35 px-3 py-1 text-left font-semibold">House Code of Official Conduct</button>
                  <button type="button" onClick={() => setFrontHref("/ethics-docs/senate-code-of-official-conduct.pdf")} className="w-fit rounded-full border border-white/35 px-3 py-1 text-left font-semibold">Senate Code of Official Conduct</button>
                </div>
              </div>
            ) : frontCode === "menu" ? (
              <LayerChart
                title="The codes"
                line="Two parts. Tap one."
                labels={["Press codes", "Congressional conduct"]}
                data={[2, 2]}
                colors={["#1e3a5f", "#7c2d12"]}
                type="doughnut"
                horizontal={false}
                bullets={[]}
                center={{ big: "2", small: "Parts", onOpen: () => undefined }}
                onPick={(index) => setFrontCode(index === 0 ? "press" : "congress")}
              />
            ) : frontCase ? (
              <FrontCase id={frontCase} onSource={setFrontHref} />
            ) : frontName && frontGroup ? (
              <FrontList group={frontGroup} name={frontName} onOpen={setFrontCase} />
            ) : frontGroup ? (
              <FrontTyped group={frontGroup} onOpen={setFrontCase} />
            ) : (
              <>
              <FrontMaster onOpen={setFrontGroup} />
              <div className="mt-8 flex w-full max-w-5xl flex-wrap items-end justify-center gap-6">
                {DECEPTION.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSpot(null);
                      setTilePath([]);
                      setCheckerPick(null);
                      setCheckerName(null);
                      setCheckerHref(null);
                      setCard(null);
                      setCardSlice(null);
                      setCardCase(null);
                      setCardHref(null);
                      setDeception(item.id);
                      setLayer("fake");
                    }}
                    className="flex w-40 flex-col items-center gap-2 border-0 bg-transparent p-0"
                  >
                    <span className="text-center text-[15px] font-semibold text-white">{item.title}</span>
                    <img src={item.image} alt="" className="h-28 w-full rounded-2xl border border-white/30 object-cover" />
                  </button>
                ))}
              </div>
              <div className="mt-10 flex gap-6">
                <button type="button" onClick={() => setLayer("lawfare")} className="border-0 bg-transparent p-0 text-[15px] font-semibold text-white/70 underline decoration-white/30 underline-offset-4">Lawfare is a separate section</button>
                <button type="button" onClick={() => setFrontCode("menu")} className="border-0 bg-transparent p-0 text-[15px] font-semibold text-white/70 underline decoration-white/30 underline-offset-4">The codes</button>
              </div>
              <p className="mt-10 max-w-3xl text-center text-[16px] leading-snug text-white">
                The American people across the political spectrum have been betrayed by everyone holding a microphone. None are required to uphold a code of conduct and none are held accountable for deceptive forms of speech and outright lies. This behavior has stripped informed consent from we the people. It is called psychological warfare. No one is checking the fact checkers who are the same people, publications and networks that circulated the deceptive speech. So the fact checkers are not to be trusted either.
              </p>
              <p className="mt-4 text-center text-[13px] font-semibold tracking-wide text-[#d4af37]">From the editor</p>
              </>
            )}
          </div>
        )}
        {layer === "fake" && !saveOn && !deception && !estimatesOn && (
          <div className="flex flex-col items-center px-6 pt-16">
            <button
              type="button"
              onClick={() => setLayer("root")}
              className="border-0 bg-transparent p-0 text-center text-[36px] font-bold tracking-wide text-white"
            >
              The Fake News Betrayal
            </button>
            <div className="w-full max-w-xl">
              <TileDonut spec={DONUTS.fake} />
            </div>
            <div className="mt-8 flex w-full max-w-6xl flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  setSource(null);
                  setMethod(null);
                  setLayer("mechanics");
                }}
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                  Understanding the Mechanics of Fake News
                </span>
                <img
                  src="/images/topic-mechanics.jpg"
                  alt=""
                  className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                />
              </button>
              <span className="text-[22px] leading-none text-[#d4af37]" aria-hidden="true">↓</span>
              <button
                type="button"
                onClick={() => {
                  setNewsMethod(null);
                  setNewsCase(null);
                  setNewsSource(null);
                  setLayer("evidence");
                }}
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                  Fake News Evidence
                </span>
                <img src="/images/topic-fake-news.jpg" alt="" className="h-44 w-full rounded-2xl border border-white/30 object-cover" />
              </button>
              <span className="text-[22px] leading-none text-[#d4af37]" aria-hidden="true">↓</span>
              <div className="flex flex-wrap items-end justify-center gap-8">
                {(
                  [
                    ["FCC rules", "/images/topic-charts.jpg", "fcc"],
                    ["Journalist code of ethics", "/images/deception-journalists.jpg", "press"],
                    ["Ethics codes", "/images/topic-ethics.jpg", "codes"],
                    ["Cable news", "/images/net-cable.jpg", "cable"],
                  ] as const
                ).map(([label, src, next]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setRuleName(null);
                      setRuleSource(null);
                      setRuleEnd(false);
                      setLayer(next);
                    }}
                    className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                  >
                    <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">{label}</span>
                    <img src={src} alt="" className="h-36 w-full rounded-2xl border border-white/30 object-cover" />
                  </button>
                ))}
              </div>
              <span className="text-[22px] leading-none text-[#d4af37]" aria-hidden="true">↓</span>
              <div className="flex flex-wrap items-end justify-center gap-8">
                <button
                  type="button"
                  onClick={() => {
                    setNewsMethod(null);
                    setNewsCase(null);
                    setNewsSource(null);
                    setSaveBar(null);
                    setSaveSource(null);
                    setSaveHref(null);
                    setSaveRuling(false);
                    setSaveOn(true);
                  }}
                  className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                >
                  <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                    Social Media Weapon
                  </span>
                  <img src="/images/topic-save.jpg" alt="" className="h-36 w-full rounded-2xl border border-white/30 object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => setEstimatesOn(true)}
                  className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                >
                  <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                    Estimates
                  </span>
                  <img src="/images/topic-estimates.jpg" alt="" className="h-36 w-full rounded-2xl border border-white/30 object-cover" />
                </button>
              </div>
              <span className="text-[22px] leading-none text-[#d4af37]" aria-hidden="true">↓</span>
              <div className="flex flex-wrap items-end justify-center gap-8">
                {DECEPTION.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSpot(null);
                      setTilePath([]);
                      setCheckerPick(null);
                      setCheckerName(null);
                      setCheckerHref(null);
                      setCard(null);
                      setCardSlice(null);
                      setCardCase(null);
                      setCardHref(null);
                      setDeception(item.id);
                    }}
                    className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                  >
                    <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                      {item.title}
                    </span>
                    <img src={item.image} alt="" className="h-36 w-full rounded-2xl border border-white/30 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {layer === "fake" && estimatesOn && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => setEstimatesOn(false)}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              Estimates
            </button>
            <TileDonut spec={DONUTS.estimates} />
            <ul className="mt-8 w-full list-disc rounded-2xl border border-white/20 bg-[#070b12]/85 py-4 pr-5 pl-9 text-left text-[15px] leading-snug text-white/85">
              <li className="font-semibold text-white">Estimated scale — not verified</li>
              <li>Numbers this large cannot possibly be verified by the SwampForce Editor alone. These are outside estimates, not counts.</li>
              <li>Millions of negative items about Trump in every two-year block since 2015.</li>
              <li>Peak years: 2016–17 and 2020–21.</li>
              <li>Most misleading copies spread on social media and memes (estimated 60–80%).</li>
              <li>A few hundred false storylines, reused again and again.</li>
              <li>Only the {allOneRows().length} cases on this chart are counted and sourced.</li>
            </ul>
          </div>
        )}
        {layer === "fake" && saveOn && !saveRuling && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => setSaveOn(false)}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              Social Media Weapon
            </button>
            <TileDonut spec={DONUTS.save} />
            <button
              type="button"
              onClick={() => {
                setSaveBar(null);
                setSaveSource(null);
                setSaveHref(null);
                setSaveRuling(true);
              }}
              className="mt-8 flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
            >
              <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                SCOTUS SAVE RULING 24 HOUR TRACKING
              </span>
              <img
                src="/images/topic-scotus-save.jpg"
                alt=""
                className="h-44 w-full rounded-2xl border border-white/30 object-cover"
              />
            </button>
          </div>
        )}
        {layer === "fake" && saveOn && saveRuling && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => {
                if (saveHref) {
                  setSaveHref(null);
                  return;
                }
                if (saveSource) {
                  setSaveSource(null);
                  return;
                }
                if (saveBar && saveBar.startsWith("lean:")) {
                  setSaveBar(`group:${SAVE_SOCIAL_INDEX}`);
                  return;
                }
                if (saveBar) {
                  setSaveBar(null);
                  return;
                }
                setSaveRuling(false);
              }}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              The Social Media Weapon: The SAVE Ruling
            </button>
            {saveHref ? (
              <div className="mt-8 w-full">
                <SourcePage
                  label={
                    SAVE_ROWS.flatMap((row) => row.links).find((link) => link.href === saveHref)?.label ?? saveHref
                  }
                  href={saveHref}
                />
              </div>
            ) : saveSource ? (
              <div className="mt-8 w-full">
                {SAVE_ROWS.filter((row) => row.id === saveSource).map((row) => (
                  <div key={row.id} className="w-full text-left">
                    <p className="text-[16px] font-semibold text-white">{row.who}</p>
                    <p className="mt-1 text-[15px] text-white/75">
                      {row.group}{row.lean ? ` · ${row.lean}` : ""} · {row.where} · {row.when} · {row.views} views
                    </p>
                    <p className="mt-2 text-[15px] leading-snug text-white">{row.said}</p>
                    {row.record ? <p className="mt-2 text-[15px] leading-snug text-white/85">{row.record}</p> : null}
                    {row.links[0] ? (
                      <button type="button" onClick={() => setSaveHref(row.links[0].href)} className="mt-2 border-0 bg-transparent p-0 text-left text-[15px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2">
                        {row.links[0].label}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : saveBar ? (
              <div className="mt-8 flex w-full flex-col gap-3">
                {(() => {
                  const [kind, indexText] = saveBar.split(":");
                  const index = Number(indexText);
                  if (kind === "group" && index === SAVE_SOCIAL_INDEX) {
                    return (
                      <>
                        <p className="text-center text-[16px] font-semibold text-white">
                          Social media · {SAVE_GROUP_DATA[index]}
                        </p>
                        <SaveChart
                          title="Social media by party lean"
                          labels={SAVE_LEAN_LABELS}
                          data={SAVE_LEAN_DATA}
                          colors={SAVE_LEAN_COLORS}
                          horizontal={false}
                          tall={false}
                          keys={SAVE_LEAN_KEYS}
                          onPick={(pick) => setSaveBar(`lean:${pick}`)}
                        />
                        {SAVE_LEAN_LABELS.map((label, pick) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setSaveBar(`lean:${pick}`)}
                            className="w-full rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-2 text-[15px] font-semibold text-white"
                          >
                            {label} · {SAVE_LEAN_DATA[pick]}
                          </button>
                        ))}
                      </>
                    );
                  }
                  const rows = kind === "sources"
                    ? SAVE_ROWS.filter((row) => row.id === SAVE_SOURCE_IDS[index])
                    : kind === "lean"
                      ? SAVE_ROWS.filter((row) => row.group === "Social media" && row.lean === SAVE_LEAN_LABELS[index])
                      : SAVE_ROWS.filter((row) => row.group === SAVE_GROUP_LABELS[index]);
                  const heading = kind === "sources"
                    ? SAVE_SOURCE_LABELS[index]
                    : kind === "lean"
                      ? `Social media · ${SAVE_LEAN_LABELS[index]} · ${SAVE_LEAN_DATA[index]}`
                      : `${SAVE_GROUP_LABELS[index]} · ${SAVE_GROUP_DATA[index]}`;
                  return (
                    <>
                      <p className="text-center text-[16px] font-semibold text-white">{heading}</p>
                      {rows.map((row) => (
                        <button
                          key={row.id}
                          type="button"
                          onClick={() => setSaveSource(row.id)}
                          className="w-full rounded-3xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] font-semibold leading-snug text-white"
                        >
                          {row.who} · {row.when} · {row.views}
                          {row.lean === "Leans Republican" && row.leanNote ? " · Party lean not checked" : ""}
                          <span className="mt-1 block font-normal">{row.said}</span>
                        </button>
                      ))}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="mt-8 flex w-full flex-col items-center gap-8">
                <div className="grid w-full grid-cols-2 gap-6 text-center">
                  <p className="text-[28px] font-bold text-white">{SAVE_ROWS.length}<span className="mt-1 block text-[16px] font-semibold">people and organizations</span></p>
                  <p className="text-[28px] font-bold text-white"><span className="block text-[16px] font-semibold">At least</span>5,852,640<span className="mt-1 block text-[16px] font-semibold">views</span></p>
                  <p className="text-[28px] font-bold text-white">0<span className="mt-1 block text-[16px] font-semibold">fact-checks</span></p>
                  <p className="text-[16px] font-semibold text-white">Already shaping public opinion.</p>
                </div>
                <p className="text-center text-[18px] font-semibold text-white">50 hours.</p>
                <p className="max-w-xl text-center text-[15px] leading-snug text-white/85">
                  The order was reported Sept. 25, 2026, at 12:59 PM ET. These view counts were read again Sept. 29, 2026, at 3:15 AM MT. That is 88 hours. The chart total is 5,852,640. Fact-checks on the posts: 0.
                </p>
                <p className="max-w-xl text-center text-[15px] leading-snug text-white/85">
                  The comments called the order a purge or a green light to clean the rolls. The order paused a lower-court block on the SAVE database. It did not approve a purge.
                </p>
                <p className="text-[15px] text-white/80">as of Sept. 29, 2026, 3:15 AM MT</p>
                <SaveChart
                  title={`All ${SAVE_ROWS.length} sources, sorted by views`}
                  labels={SAVE_SOURCE_LABELS}
                  data={SAVE_SOURCE_DATA}
                  colors={SAVE_SOURCE_COLORS}
                  horizontal
                  tall
                  keys={SAVE_KEYS}
                  onPick={(index) => setSaveBar(`sources:${index}`)}
                />
                <SaveChart
                  title="By group"
                  labels={SAVE_GROUP_LABELS}
                  data={SAVE_GROUP_DATA}
                  colors={SAVE_GROUP_COLORS}
                  horizontal={false}
                  tall={false}
                  keys={SAVE_KEYS}
                  onPick={(index) => setSaveBar(`group:${index}`)}
                />
              </div>
            )}
          </div>
        )}
        {layer === "evidence" && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            {(newsMethod || newsCase || newsSource) && (
            <button
              type="button"
              onClick={newsBack}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              {newsMethod?.startsWith("one:")
                ? newsMethod.slice(4).split(":")[0]
                : newsMethod === "chart-proof" && !newsCase && !newsSource
                ? "Strength of proof"
                : newsMethod?.startsWith("chart-proof:") && !newsCase && !newsSource
                  ? newsMethod.split(":").length > 2
                    ? newsMethod.split(":").slice(2).join(":")
                    : (EVIDENCE_CHARTS.find((item) => item.id === "chart-proof")?.labels[Number(newsMethod.split(":")[1])] ?? "Strength of proof")
                : newsMethod?.startsWith("chart-methods:") && !newsCase && !newsSource
                  ? (EVIDENCE_CHARTS.find((item) => item.id === "chart-methods")?.labels[Number(newsMethod.split(":")[1])] ?? "Methods of Deception")
                  : newsMethod && !newsMethod.includes(":") && !newsCase && !newsSource
                    ? EVIDENCE_CHARTS.find((item) => item.id === newsMethod)?.title
                    : "Fake News Evidence"}
            </button>
            )}
            {!newsMethod && !newsCase && !newsSource ? <TileDonut spec={DONUTS.evidence} /> : null}
            {newsSource ? (
              <div className="mt-8 w-full">
                <SourcePage
                  label={
                    newsEvidence.methods
                      .flatMap((item) => item.cases)
                      .flatMap((item) => item.sources)
                      .find((item) => item.href === newsSource)?.label ??
                    NEWS_CASES.flatMap((item) => item.sources).find((item) => item.href === newsSource)?.label ??
                    newsSource
                  }
                  href={newsSource}
                />
              </div>
            ) : newsCase && newsMethod?.startsWith("chart-proof") ? (
              <ProofCase id={newsCase} onSource={setNewsSource} />
            ) : newsCase && newsMine ? (
              <div className="w-full">
                {NEWS_CASES.filter((row) => row.id === newsCase).map((row) => (
                  <NewsCaseDetail key={row.id} row={row} onSource={setNewsSource} />
                ))}
              </div>
            ) : newsCase ? (
              <div className="mt-8 w-full text-left">
                {newsEvidence.methods.flatMap((item) => item.cases).filter((item) => item.id === newsCase).map((item) => (
                  <div key={item.id}>
                    <p className="text-[16px] font-semibold text-white">{item.who}</p>
                    <p className="mt-2 text-[15px] text-white/85">{item.date}</p>
                    <p className="mt-4 text-[16px] font-semibold text-white">What they said</p>
                    <p className="mt-2 text-[15px] leading-snug text-white/85">{item.said}</p>
                    <p className="mt-4 text-[16px] font-semibold text-white">What the record shows</p>
                    <p className="mt-2 text-[15px] leading-snug text-white/85">{item.record}</p>
                    <ClaimSaid sources={item.sources} onSource={setNewsSource} />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.sources.map((source) => (
                        <button
                          key={source.href}
                          type="button"
                          onClick={() => setNewsSource(source.href)}
                          className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
                        >
                          {source.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : newsMethod === "one:PolitiFact Facebook scorecard" ? (
              <PolitiFactScorecard />
            ) : newsMethod && newsMethod.startsWith("one:") ? (
              <SamePath
                title={`${newsMethod.slice(4).split(":")[0]}${newsFilter.verdict !== "All" || newsFilter.time !== "All" || newsFilter.proof !== "All" ? ` · ${[newsFilter.verdict, newsFilter.time, newsFilter.proof].filter((item) => item !== "All").join(" · ")}` : ""}`}
                rows={filteredOne(newsFilter).filter((row) => {
                  const key = newsFilter.bars === "topic" ? row.topic : newsFilter.bars === "person" ? row.person : newsFilter.bars === "mechanic" ? row.mechanic : row.bucket;
                  return key === newsMethod.slice(4).split(":")[0];
                })}
                groupName={newsMethod.slice(4).split(":").slice(1)[0] ?? ""}
                outletName={newsMethod.slice(4).split(":").slice(2).join(":")}
                onGroup={(name) => setNewsMethod(`one:${newsMethod.slice(4).split(":")[0]}:${name}`)}
                onOutlet={(name) => setNewsMethod(`one:${newsMethod.slice(4).split(":")[0]}:Cable news:${name}`)}
                onSource={setNewsSource}
              />
            ) : newsMethod && (newsMethod === "chart-term" || newsMethod.startsWith("chart-term:")) ? (
              <NewsPeriodLayers
                path={newsMethod === "chart-term" ? [] : newsPath(newsMethod.slice("chart-term:".length))}
                onPath={(path) => setNewsMethod(`chart-term:${JSON.stringify(path)}`)}
                onSource={setNewsSource}
              />
            ) : newsMethod && newsMethod.startsWith("chart-evidence:never") ? (
              <NewsNeverList
                which={newsMethod === "chart-evidence:never" ? null : newsMethod.slice("chart-evidence:never:".length)}
                onWhich={(which) => setNewsMethod(`chart-evidence:never:${which}`)}
                onSource={setNewsSource}
              />
            ) : newsMethod && newsMethod.startsWith("chart-methods:") ? (
              <MethodLayers
                method={newsMethod}
                onMethod={(next) => {
                  setNewsSource(null);
                  setNewsCase(null);
                  setNewsMethod(next);
                }}
                onSource={(href) => {
                  setNewsCase(null);
                  setNewsSource(href);
                }}
              />
            ) : newsMethod && newsMethod.startsWith("chart-proof:") ? (
              <ProofLayers
                method={newsMethod}
                onMethod={(next) => {
                  setNewsSource(null);
                  setNewsCase(null);
                  setNewsMethod(next);
                }}
                onSource={setNewsSource}
              />
            ) : newsMethod && newsMethod.startsWith("chart-evidence:") && !newsMethod.startsWith("chart-evidence:never") ? (
              <VerdictOpen
                method={newsMethod}
                onMethod={(next) => {
                  setNewsSource(null);
                  setNewsCase(null);
                  setNewsMethod(next);
                }}
                onSource={setNewsSource}
              />
            ) : newsMethod && newsMethod.includes(":") ? (
              <div className="mt-8 w-full">
                {(() => {
                  const chartId = newsMethod.slice(0, newsMethod.indexOf(":"));
                  const index = Number(newsMethod.slice(newsMethod.indexOf(":") + 1));
                  const spec = EVIDENCE_CHARTS.find((item) => item.id === chartId);
                  const value = spec?.values[index];
                  const cases = newsEvidence.methods.flatMap((item) => item.cases).filter((item) => {
                    const mark = NEWS_MARKS[item.id];
                    if (!spec || value == null || !mark) return false;
                    if (spec.key === "evidence") return mark.evidence === value;
                    if (spec.key === "proof") return mark.proof === value;
                    if (spec.key === "term") return mark.term === value;
                    return item.method === value;
                  });
                  return (
                    <SamePath
                      title={spec ? spec.labels[index] : ""}
                      rows={cases
                        .map((item) => NEWS_CASES.find((row) => row.id === item.id))
                        .filter((row): row is NewsCaseRow => !!row)
                        .map(speakFromCase)}
                      groupName=""
                      outletName=""
                      onGroup={(name) => setNewsMethod(`${chartId}:${index}:${name}`)}
                      onOutlet={(name) => setNewsMethod(`${chartId}:${index}:Cable news:${name}`)}
                      onSource={setNewsSource}
                    />
                  );
                })()}
              </div>
            ) : newsMethod ? (
              <div className="mt-8 w-full">
                {EVIDENCE_CHARTS.filter((item) => item.id === newsMethod).map((spec) => (
                  <div key={spec.id} className="w-full rounded-2xl border border-[#d4af37] bg-[#070b12] px-4 py-4">
                    <EvidenceChart
                      spec={spec}
                      onPick={(index) => {
                        setNewsSource(null);
                        setNewsCase(null);
                        setNewsMethod(`${spec.id}:${index}`);
                      }}
                      onNever={() => {
                        setNewsSource(null);
                        setNewsCase(null);
                        setNewsMethod("chart-evidence:never");
                      }}
                    />
                    {spec.id === "chart-methods" ? (
                      <LayerTiles
                        square
                        tiles={spec.labels.map((label, index) => ({
                          key: spec.values[index],
                          label,
                          image: METHOD_TILE[spec.values[index]] ?? "/images/pill-methods.jpg",
                          onOpen: () => {
                            setNewsSource(null);
                            setNewsCase(null);
                            setNewsMethod(`${spec.id}:${index}`);
                          },
                        }))}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full">
                <button
                  type="button"
                  onClick={newsBack}
                  className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
                >
                  Fake News Evidence
                </button>
                <OneChart
                  filter={newsFilter}
                  onFilter={setNewsFilter}
                />
              </div>
            )}
          </div>
        )}
        {(layer === "fcc" || layer === "press" || layer === "codes" || layer === "cable") && (
          <div className={`mx-auto flex flex-col items-center px-6 pt-10 pb-24 ${ruleEnd ? "max-w-3xl" : "max-w-xl"}`}>
            {(() => {
              const chart = openRuleChart(layer);
              return (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setRuleName(null);
                      setRuleSource(null);
                      setRuleEnd(false);
                      setLayer("fake");
                    }}
                    className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
                  >
                    {chart.title}
                  </button>
                  <p className="mt-4 max-w-md text-center text-[15px] leading-snug text-white/75">{chart.intro}</p>
                  {!ruleName && !ruleSource && !ruleEnd ? <TileDonut spec={DONUTS[layer]} /> : null}
                  {ruleSource ? (
                    <SourcePage
                      label={ruleSource}
                      href={
                        chart.items.flatMap((item) => item.evidence).find((piece) => piece.label === ruleSource)?.href ??
                        chart.ends.find((piece) => piece.label === ruleSource)?.href
                      }
                      note={
                        chart.items.flatMap((item) => item.evidence).find((piece) => piece.label === ruleSource)?.note ??
                        chart.ends.find((piece) => piece.label === ruleSource)?.note
                      }
                    />
                  ) : ruleEnd ? (
                    <div className="mt-8 w-full border border-white/20 bg-[#070b12]/85 px-6 py-8 text-left">
                      <p className="text-center text-[28px] font-bold tracking-wide text-[#d4af37]">{chart.endTitle}</p>
                      <ul className="mt-6 flex flex-col gap-5">
                        {chart.ends.map((item) => (
                          <li key={item.label}>
                            <p className="text-[16px] font-semibold leading-snug text-white">{item.line}</p>
                            <button
                              type="button"
                              onClick={() => setRuleSource(item.label)}
                              className="mt-2 w-fit rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[15px] font-semibold text-white"
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <>
                      {ruleName && (
                        <MethodDetail item={chart.items.find((item) => item.name === ruleName)!} onOpen={setRuleSource} />
                      )}
                      <div className="mt-8 grid w-full grid-cols-2 gap-x-8 gap-y-1">
                        {chart.items.map((item) => (
                          <div key={item.name} className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => {
                                setRuleSource(null);
                                setRuleName(item.name);
                              }}
                              className="w-full rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1.5 text-[15px] font-semibold text-white"
                            >
                              {item.name}
                            </button>
                            <span className="text-[18px] leading-none text-[#d4af37]" aria-hidden="true">
                              ↓
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRuleName(null);
                          setRuleSource(null);
                          setRuleEnd(true);
                        }}
                        className="relative mt-2 w-full rounded-2xl border-2 border-[#d4af37] bg-[#070b12]/90 px-5 py-8"
                      >
                        <span className="relative text-[22px] font-bold tracking-wide text-[#d4af37]">{chart.endTitle}</span>
                      </button>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        )}
        {layer === "mechanics" && (
          <div className={`mx-auto flex flex-col items-center px-6 pt-10 pb-24 ${outcome ? "max-w-3xl" : "max-w-xl"}`}>
            <button
              type="button"
              onClick={() => {
                setMethod(null);
                setSource(null);
                setOutcome(false);
                setAside(null);
                setLayer("fake");
              }}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              Understanding the Mechanics of Fake News
            </button>
            <p className="mt-4 max-w-md text-center text-[13px] leading-snug text-white/75">
              This flowchart is interactive. Each button opens the evidence and the facts this site has
              discovered. It is only a fraction of the information.
            </p>
            {!source && !outcome && !aside && !method ? <TileDonut spec={DONUTS.mechanics} /> : null}
            {source ? (
              <SourcePage
                label={source}
                href={
                  METHODS.flatMap((item) => item.evidence).find((piece) => piece.label === source)?.href ??
                  RESULTS.flatMap((item) => item.sources).find((piece) => piece.label === source)?.href ??
                  EFFECTS.find((piece) => piece.label === source)?.href
                }
                note={
                  RESULTS.flatMap((item) => item.sources).find((piece) => piece.label === source)?.note ??
                  EFFECTS.find((piece) => piece.label === source)?.note
                }
              />
            ) : outcome && !aside ? (
              <div className="mt-8 w-full border border-white/20 bg-[#070b12]/85 px-6 py-8 text-left">
                <p className="text-center text-[28px] font-bold tracking-wide text-[#d4af37]">Outcome</p>
                <p className="mt-4 text-[15px] leading-snug text-white/85">
                  These studies measured a repeated claim, a frame, anger at the other side, and trust in the
                  press. They did not measure informed consent, a riot, a lost vote, or a broken oath.
                </p>
                <ul className="mt-6 flex flex-col gap-5">
                  {EFFECTS.map((item) => (
                    <li key={item.label}>
                      <p className="text-[16px] font-semibold leading-snug text-white">{item.line}</p>
                      <button
                        type="button"
                        onClick={() => setSource(item.label)}
                        className="mt-2 w-fit rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : outcome ? (
              <div className="mt-8 w-full border-2 border-[#d4af37] bg-[#070b12]/90 px-6 py-8 text-left">
                <div>
                  <p className="text-center text-[28px] font-bold tracking-wide text-[#d4af37]">
                    {aside === "standard"
                      ? "What you can do to hold fake news to its standard"
                      : "The record and the law"}
                  </p>
                  <p className="mt-3 text-[14px] leading-snug text-white/80">
                    {aside === "standard"
                      ? "This page is only the public step. The codes are voluntary. They are not a crime, and this site does not claim the public can rewrite them."
                      : "These are statutes, oaths, and records of events. They are not a study that found fake news to be the cause."}
                  </p>
                  <div className="mt-8 flex flex-col gap-8">
                    {TOPICS.filter((group) =>
                      aside === "standard" ? group.voluntary : !group.voluntary,
                    ).map((group) => (
                      <section key={group.topic}>
                        <p className="text-[13px] font-semibold tracking-wide text-[#d4af37]">{group.topic}</p>
                        {group.voluntary && (
                          <p className="mt-2 text-[16px] text-white">
                            <strong className="underline">These codes are voluntary.</strong>
                          </p>
                        )}
                        <ul className="mt-3 flex flex-col gap-4">
                          {group.items.map((item) => (
                            <li key={item.line}>
                              <p className="text-[16px] font-semibold leading-snug text-white">{item.line}</p>
                              {item.sources.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {item.sources.map((piece) => (
                                    <button
                                      key={piece.label}
                                      type="button"
                                      onClick={() => setSource(piece.label)}
                                      className="w-fit rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                                    >
                                      {piece.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                        {group.topic === "Riots and assembly" && (
                          <div className="mt-5">
                            <p className="text-[16px] font-semibold text-white">Example of gaslighting</p>
                            <p className="mt-1 text-[14px] leading-snug text-white/80">
                              Kenosha, August 25, 2020. CNN’s on-screen words were “Fiery but mostly peaceful
                              protests after police shooting” while a building burned behind correspondent Omar
                              Jimenez. This site does not host that broadcast.
                            </p>
                            <a
                              href="https://leadstories.com/hoax-alert/2020/08/fact-check-cnn-did-use-the-chyron-fiery-but-mostly-peaceful-protests-after-police-shooting.html"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-[13px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
                            >
                              Lead Stories confirmed the caption
                            </a>
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                  {aside === "standard" && (
                  <section className="mt-10 border-t border-white/20 pt-6">
                    <p className="text-[13px] font-semibold tracking-wide text-[#d4af37]">What we can do</p>
                    <p className="mt-2 text-[14px] leading-snug text-white/80">
                      Where a line is not itself a crime, the public steps are these.
                    </p>
                    <ul className="mt-4 flex flex-col gap-4">
                      <li>
                        <p className="text-[16px] font-semibold text-white">Keep the record</p>
                        <p className="mt-1 text-[14px] leading-snug text-white/80">
                          Save the clip, the caption, and the original document. Share those, not the feeling.
                        </p>
                      </li>
                      <li>
                        <p className="text-[16px] font-semibold text-white">A journalist code is not a law</p>
                        <p className="mt-1 text-[14px] leading-snug text-white/80">
                          The Society of Professional Journalists code and the Radio Television Digital News
                          Association code are not crimes. <strong className="underline">They are voluntary.</strong>{" "}
                          A network’s own standard is voluntary too. The public cannot prosecute a broken code.
                          The step is to ask that outlet to follow the code it published, and to keep the record
                          if it does not.
                        </p>
                      </li>
                      <li>
                        <p className="text-[16px] font-semibold text-white">An over-the-air station only</p>
                        <p className="mt-1 text-[14px] leading-snug text-white/80">
                          A deliberate distortion complaint needs the station’s call sign, the date, the time,
                          and a recording. Cable is outside that rule.
                        </p>
                        <a
                          href="https://consumercomplaints.fcc.gov/hc/en-us"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-[13px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
                        >
                          FCC complaint
                        </a>
                      </li>
                    </ul>
                  </section>
                  )}
                  {aside === "record" && (
                  <section className="mt-10 border-t border-white/20 pt-6">
                    <p className="text-[13px] font-semibold tracking-wide text-[#d4af37]">What the public can do</p>
                    <ul className="mt-4 flex flex-col gap-4">
                      <li>
                        <p className="text-[16px] font-semibold text-white">A suspected illegal vote or registration</p>
                        <p className="mt-1 text-[14px] leading-snug text-white/80">
                          Report it to your state election office or the FBI. Do not confront the person.
                        </p>
                        <a
                          href="https://tips.fbi.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-[13px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
                        >
                          FBI tips
                        </a>
                      </li>
                      <li>
                        <p className="text-[16px] font-semibold text-white">The oath</p>
                        <p className="mt-1 text-[14px] leading-snug text-white/80">
                          Write your representative and your senators. The remedy is the office and the
                          election, not a crowd.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3">
                          <a
                            href="https://www.house.gov/representatives/find-your-representative"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
                          >
                            Find your representative
                          </a>
                          <a
                            href="https://www.senate.gov/senators/senators-contact.htm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
                          >
                            Contact your senators
                          </a>
                        </div>
                      </li>
                      <li>
                        <p className="text-[16px] font-semibold text-white">Assemble peaceably, then vote</p>
                        <p className="mt-1 text-[14px] leading-snug text-white/80">
                          Violence is not a remedy. The vote is.
                        </p>
                      </li>
                    </ul>
                  </section>
                  )}
                </div>
              </div>
            ) : (
              <>
            {method && (
              <MethodDetail
                item={METHODS.find((item) => item.name === method)!}
                onOpen={setSource}
              />
            )}
            <div className="mt-8 grid w-full grid-cols-2 gap-x-8 gap-y-1">
              {METHODS.map((item) => (
                <div key={item.name} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSource(null);
                      setMethod(item.name);
                    }}
                    className="w-full rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1.5 text-[13px] font-semibold text-white"
                  >
                    {item.name}
                  </button>
                  <span className="text-[18px] leading-none text-[#d4af37]" aria-hidden="true">
                    ↓
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setMethod(null);
                setSource(null);
                setOutcome(true);
              }}
              className="relative mt-2 w-full rounded-2xl border-2 border-[#d4af37] bg-[#070b12]/90 px-5 py-8"
            >
              <span className="relative text-[22px] font-bold tracking-wide text-[#d4af37]">Outcome</span>
            </button>
              </>
            )}
          </div>
        )}
        {layer === "lawfare" && !lawOn && !ethicsDoc && (
          <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => setLayer("root")}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              Lawfare
            </button>
            <div className="w-full max-w-xl">
              <TileDonut spec={DONUTS.lawfare} />
            </div>
            <div className="mt-8 flex max-w-5xl flex-wrap items-end justify-center gap-8">
              {LAYERS.lawfare.buttons.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "House") {
                      setEthicsDoc("house-menu");
                      return;
                    }
                    if (label === "Senate") {
                      setEthicsDoc("senate-menu");
                      return;
                    }
                    if (label === "Lawfare Evidence") {
                      setLawPick(null);
                      setLawCase(null);
                      setLawHref(null);
                      setLawOn(true);
                      return;
                    }
                    setLawOn(false);
                    setTopicPick(null);
                    setTopicCase(null);
                    setTopicHref(null);
                    setImpeachFile(null);
                    const next = NEXT[label];
                    if (next) setLayer(next);
                  }}
                  className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                >
                  <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">{label}</span>
                  <img src={LAW_HOME[label]} alt="" className="h-52 w-52 rounded-2xl border border-white/30 object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
        {layer === "lawfare" && !lawOn && ethicsDoc && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => {
                if (ethicsDoc === "house-menu" || ethicsDoc === "senate-menu") setEthicsDoc(null);
                else if (ethicsDoc === "house" || ethicsDoc === "house-summary" || ethicsDoc === "house-record") setEthicsDoc("house-menu");
                else setEthicsDoc("senate-menu");
              }}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              {ethicsDoc === "house-menu"
                ? "House"
                : ethicsDoc === "senate-menu"
                  ? "Senate"
                  : ethicsDoc === "house" || ethicsDoc === "senate"
                    ? "Code of Official Conduct"
                    : ethicsDoc === "house-record" || ethicsDoc === "senate-record"
                      ? "Record of ethics complaints"
                      : "Summary"}
            </button>
            {ethicsDoc === "house-menu" ? <TileDonut spec={DONUTS.house} /> : ethicsDoc === "senate-menu" ? <TileDonut spec={DONUTS.senate} /> : null}
            {ethicsDoc === "house-menu" || ethicsDoc === "senate-menu" ? (
              <div className="mt-8 flex flex-wrap items-end justify-center gap-8">
                {(ethicsDoc === "house-menu"
                  ? [
                      ["house", "Code of Official Conduct", "/images/topic-house-code.jpg"],
                      ["house-summary", "Summary", "/images/topic-house-summary.jpg"],
                      ["house-record", "Record of ethics complaints", "/images/topic-house-record.jpg"],
                    ]
                  : [
                      ["senate", "Code of Official Conduct", "/images/topic-senate-code.jpg"],
                      ["senate-summary", "Summary", "/images/topic-senate-summary.jpg"],
                      ["senate-record", "Record of ethics complaints", "/images/topic-senate-record.jpg"],
                    ]
                ).map(([key, label, src]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEthicsDoc(key as "house" | "senate" | "house-summary" | "senate-summary" | "house-record" | "senate-record")}
                    className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                  >
                    <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">{label}</span>
                    <img src={src} alt="" className="h-52 w-52 rounded-2xl border border-white/30 object-cover" />
                  </button>
                ))}
              </div>
            ) : ethicsDoc === "house-summary" || ethicsDoc === "senate-summary" ? (
              <EthicsSummary which={ethicsDoc === "house-summary" ? "house" : "senate"} />
            ) : ethicsDoc === "house-record" || ethicsDoc === "senate-record" ? (
              <EthicsRecord which={ethicsDoc === "house-record" ? "house" : "senate"} />
            ) : (
              <div className="mt-6 w-full text-left">
                <p className="text-[15px] leading-snug text-white/85">
                  {ethicsDoc === "house"
                    ? "Rule XXIII, the Code of Official Conduct, from the Rules of the House of Representatives, 119th Congress. Clerk of the House, January 16, 2025. These are the official pages. Rule XXIII begins on the first page."
                    : "The Senate Code of Official Conduct, Rules 34 through 43 of the Standing Rules of the Senate. Select Committee on Ethics, October 2021. These are the official pages."}
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  {(ethicsDoc === "house" ? HOUSE_CODE_PAGES : SENATE_CODE_PAGES).map((src) => (
                    <img key={src} src={src} alt="" className="w-full rounded-xl border border-white/25 bg-white" />
                  ))}
                </div>
                <a
                  href={ethicsDoc === "house" ? "https://rules.house.gov/sites/evo-subsites/republicans-rules.house.gov/files/documents/houserules119thupdated.pdf" : "https://www.ethics.senate.gov/public/index.cfm/senate-code-of-official-conduct"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={NEWS_DOOR + " mt-4 inline-block w-fit"}
                >
                  Open the official source
                </a>
              </div>
            )}
          </div>
        )}
        {layer === "lawfare" && lawOn && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <LawfareScreen
              pick={lawPick}
              caseId={lawCase}
              href={lawHref}
              onPick={setLawPick}
              onCase={setLawCase}
              onSource={setLawHref}
              onBack={lawBack}
            />
          </div>
        )}
        {layer === "bail" && (
          <div className="flex flex-col items-center px-6 pt-16">
            <button
              type="button"
              onClick={() => setLayer("lawfare")}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              Politicians' bail funds for violent rioters
            </button>
          </div>
        )}
        {LAW_TOPICS[layer] && !lawOn && !impeachFile && (
          <div className={layer === "bail" ? "mx-auto flex max-w-3xl flex-col items-center px-6 pb-24" : "mx-auto flex max-w-3xl flex-col items-center px-6 pt-6 pb-24"}>
            {(layer === "trials" || layer === "citizen" || layer === "impeach" || layer === "bail" || layer === "scrutiny" || layer === "attempts" || layer === "first100") && !topicPick && !topicCase && !topicHref ? <TileDonut spec={DONUTS[layer]} /> : null}
            <LawTopic
              layer={layer}
              pick={topicPick}
              caseId={topicCase}
              href={topicHref}
              onPick={setTopicPick}
              onCase={setTopicCase}
              onSource={setTopicHref}
              onImpeach={(file) => {
                setImpeachFrom(null);
                setImpeachFile(file);
              }}
            />
          </div>
        )}
        {layer === "impeach" && impeachFile && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => {
                if (impeachFile === "public") setImpeachFile(impeachFrom);
                else setImpeachFile(null);
              }}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              {impeachFile === "2019" ? "First, 2019" : impeachFile === "2021" ? "Second, 2021" : impeachFile === "clinton" ? "Clinton, 1998" : "How the public can require an ethics rule"}
            </button>
            <ImpeachRecord
              file={impeachFile}
              onOpen={(next) => {
                if (impeachFile === "2019" || impeachFile === "2021" || impeachFile === "clinton") setImpeachFrom(impeachFile);
                setImpeachFile(next);
              }}
            />
          </div>
        )}
        {(layer === "fake" || layer === "types") && deception ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => {
                if (deception === "politicians" && senateOn && frontHref) {
                  setFrontHref(null);
                  return;
                }
                if (senateCase) {
                  setSenateCase(null);
                  return;
                }
                if (senateSlice) {
                  setSenateSlice(null);
                  return;
                }
                if (senateId) {
                  setSenateId(null);
                  return;
                }
                if (senateMethod) {
                  setSenateMethod(null);
                  return;
                }
                if (senateOn) {
                  setSenateOn(false);
                  return;
                }
                if (checkerBack() || cardBack()) return;
                if (tilePath.length) {
                  setTilePath(tilePath.slice(0, -1));
                  return;
                }
                if (spot) {
                  setSpot(null);
                  return;
                }
                setTilePath([]);
                setDeception(null);
                setLayer("fake");
              }}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              {senateOn ? "Public trust" : card ? card : spot === "cable" ? "Cable news" : spot === "trump" ? "Trump TV" : spot === "podcasts" ? "Podcasts" : spot === "cspan" ? "C-SPAN" : DECEPTION.find((item) => item.id === deception)?.title}
            </button>
            {!card && !spot && !checkerPick && !checkerName && !checkerHref && !senateOn && !senateCase && !senateMethod && !topicSlice ? (
              <div className="w-full max-w-xl">
                <TileDonut spec={DONUTS[deception]} />
              </div>
            ) : null}
            {card && cardHref ? (
              <div className="w-full">
                <SourcePage label={NEWS_CASES.flatMap((row) => row.sources).find((item) => item.href === cardHref)?.label ?? cardHref} href={cardHref} />
              </div>
            ) : card && cardCase ? (
              <div className="w-full">
                {NEWS_CASES.filter((row) => row.id === cardCase).map((row) => (
                  <NewsCaseDetail key={row.id} row={row} onSource={setCardHref} />
                ))}
              </div>
            ) : card ? (
              <>
              <CardLayers card={card} slice={cardSlice} onSlice={setCardSlice} onSource={setCardHref} />
              {card === "Facebook" ? (
                <div className="mt-4 max-w-xl text-left text-[15px] leading-snug text-white">
                  <p>These are the Facebook cases written up on this site.</p>
                  <p className="mt-2">PolitiFact rated 4,008 Facebook posts False and 1,439 Pants on Fire. Those posts reached people, so they are on the main chart. The test is whether it shaped public opinion.</p>
                  <a href="https://www.politifact.com/facebook-fact-checks/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2">PolitiFact Facebook fact-checks</a>
                </div>
              ) : null}
              </>
            ) : deception === "checkers" && checkerHref ? (
              <div className="w-full">
                <SourcePage
                  label={checkerName ? (checkerDetail(checkerName).links.find((link) => link.href === checkerHref)?.label ?? checkerHref) : checkerHref}
                  href={checkerHref}
                />
              </div>
            ) : deception === "checkers" && checkerName ? (
              (() => {
                const detail = checkerDetail(checkerName);
                const color = CHECKER_COLORS[CHECKER_GROUPS.indexOf(detail.row?.outcome ?? "")] ?? "#a3a3a3";
                return (
                  <div className="mt-8 w-full rounded-2xl border border-white/20 bg-[#070b12]/85 px-5 py-5 text-left">
                    <span className="inline-block rounded-full border-2 px-4 py-1.5 text-[18px] font-bold" style={{ borderColor: color, color }}>
                      {detail.row?.outcome ?? "Not on record"}
                    </span>
                    <p className="mt-4 text-[20px] font-semibold text-white">{checkerName}</p>
                    <ul className="mt-3 list-disc pl-5 text-[15px] leading-snug text-white/85">
                      {detail.bullets.length ? detail.bullets.map((line) => <li key={line} className="mt-2">{line}</li>) : <li>Not on record</li>}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {detail.links.map((link) => (
                        <button
                          key={link.label + link.href}
                          type="button"
                          onClick={() => setCheckerHref(link.href)}
                          className="min-h-11 w-fit rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-4 py-2 text-[15px] font-semibold text-white"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : deception === "checkers" && checkerPick ? (
              (() => {
                const rows = checkerPick === "all" ? CHECKER_TABLE : CHECKER_TABLE.filter((row) => row.outcome === checkerPick);
                return (
                  <div className="mt-8 flex w-full flex-col gap-3">
                    <p className="text-center text-[18px] font-semibold text-white">
                      {checkerPick === "all" ? "All fact-checkers tested" : checkerPick} · {rows.length}
                    </p>
                    {rows.map((row) => (
                      <button key={row.name} type="button" onClick={() => setCheckerName(row.name)} className={LAYER_ROW}>
                        <span className="flex items-center gap-2">
                          <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: CHECKER_COLORS[CHECKER_GROUPS.indexOf(row.outcome)] }} />
                          {row.name}
                        </span>
                        <span className="mt-1 block font-normal text-white/80">{row.owner}</span>
                        <span className="mt-1 block font-normal text-[#d4af37]">Confirms {row.confirms} of our cases</span>
                      </button>
                    ))}
                  </div>
                );
              })()
            ) : deception === "checkers" ? (
              <div className="mt-8 w-full text-left">
                <p className="text-center text-[18px] font-semibold tracking-wide text-white">Who Is Fact-Checking the Fact-Checkers?</p>
                <LayerChart
                  title="Who Is Fact-Checking the Fact-Checkers?"
                  line="16 fact-checkers, same 7 tests · Evidence as of Sep. 24, 2026"
                  labels={CHECKER_GROUPS}
                  data={CHECKER_DATA}
                  colors={CHECKER_COLORS}
                  type="doughnut"
                  horizontal={false}
                  bullets={["A fact-checker is never our proof, only a second confirmation.", "Same 7 tests for every checker, left and right."]}
                  center={{ big: String(CHECKER_TABLE.length), small: "Tested", onOpen: () => setCheckerPick("all") }}
                  onPick={(index) => setCheckerPick(CHECKER_GROUPS[index])}
                />
                <LayerTiles
                  tiles={CHECKER_GROUPS.map((group, index) => ({
                    key: group,
                    label: group,
                    image: CHECKER_TILES[index],
                    onOpen: () => setCheckerPick(group),
                  }))}
                />
                {factCheckerVetting.map((section) => (
                  <section key={section.title} className="mt-8">
                    <h2 className="text-[16px] font-semibold text-white">{section.title}</h2>
                    {section.paras.map((paragraph) => (
                      <p key={paragraph} className="mt-3 text-[15px] leading-snug text-white/85">
                        {paragraph}
                      </p>
                    ))}
                    {"table" in section && section.table ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full border-collapse text-left text-[15px] text-white/85">
                          <thead>
                            <tr>
                              {["Fact-checker", "Owner / lean", "IFCN status (Sep 24, 2026)", "Outcome", "Cases it confirms"].map((heading) => (
                                <th key={heading} className="border-b border-white/25 px-2 py-2 font-semibold text-white">
                                  {heading}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.map((row) => (
                              <tr key={row[0]}>
                                {row.map((cell) => (
                                  <td key={cell} className="border-b border-white/10 px-2 py-2 align-top">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {section.links
                        .filter((link) => link.href.startsWith("http"))
                        .map((link, linkIndex) => (
                          <a
                            key={`${link.href}-${linkIndex}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[15px] font-semibold text-white"
                          >
                            {link.label}
                          </a>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : spot === "trump" ? (
              <div className="mt-8 max-w-xl text-left">
                <p className="text-[16px] font-semibold text-white">TRUMP TV: The Essentials Station</p>
                <p className="mt-3 text-[15px] leading-snug text-white/85">
                  It is not a cable channel, and it is not C-SPAN. The White House launched it on September
                  21, 2026 as a 24/7 livestream on the White House YouTube page. It is also on the White
                  House phone app. The White House calls it the administration’s greatest hits. That is a
                  selection. C-SPAN is the uncut public-affairs record.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="https://www.usatoday.com/story/news/politics/2026/09/22/trump-tv-cnn-msnow-politico-media-ban/91885602007/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                  >
                    USA Today
                  </a>
                  <a
                    href="https://nymag.com/intelligencer/article/trump-tv-is-finally-here-and-no-one-is-watching.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                  >
                    New York Magazine
                  </a>
                </div>
              </div>
            ) : spot === "cspan" ? (
              <div className="mt-8 max-w-xl text-left">
                <p className="text-[16px] font-semibold text-white">The recording</p>
                <p className="mt-3 text-[15px] leading-snug text-white/85">
                  C-SPAN carries the uncut public-affairs record. The bot uses it as the tape, not as a
                  network that ran the shortened claim.
                </p>
                <a
                  href="https://www.c-span.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full border border-[#d4af37]/70 bg-[#070b12]/80 px-3 py-1.5 text-[13px] font-semibold text-white"
                >
                  C-SPAN
                </a>
              </div>
            ) : spot === "podcasts" ? (
              <p className="mt-8 text-center text-[15px] text-white/75">No podcast list is on file yet.</p>
            ) : deception === "politicians" && senateOn && frontHref ? (
              <SourcePage label="Open the source" href={frontHref} />
            ) : deception === "politicians" && senateCase && senateCase.startsWith("ps-") ? (
              <PoliticalCase id={senateCase} onSource={setFrontHref} />
            ) : deception === "politicians" && senateCase && senateCase.startsWith("sh-") ? (
              <SenateCase id={senateCase} onSource={setFrontHref} />
            ) : deception === "politicians" && senateCase && senateCase.startsWith("fc:") ? (
              <CheckerPage name={senateCase.slice(3)} />
            ) : deception === "politicians" && senateCase ? (
              <NewsCase id={senateCase} onSource={setFrontHref} />
            ) : deception === "politicians" && senateSlice && senateMethod ? (
              <EvidenceList method={senateMethod} bucket={senateSlice} onOpen={setSenateCase} />
            ) : deception === "politicians" && senateMethod ? (
              <CategoryChart method={senateMethod} onOpen={setSenateSlice} />
            ) : deception === "politicians" && senateOn ? (
              <SenateChart onOpen={setSenateMethod} />
            ) : topicSlice && TILE_CASE[deception] ? (
              <PersonCharts rows={NEWS_CASES.filter(TILE_CASE[deception])} slice={topicSlice} onSlice={setTopicSlice} onSource={setCardHref} />
            ) : (
            <div className="mt-8 w-full">
              {TILE_CASE[deception] ? (
                <PersonCharts rows={NEWS_CASES.filter(TILE_CASE[deception])} slice={null} onSlice={setTopicSlice} onSource={setCardHref} />
              ) : null}
              <div className="mt-8 flex max-w-5xl flex-wrap items-end justify-center gap-6">
              {(spot === "cable"
                ? (DECEPTION.find((item) => item.id === deception)?.stations ?? [])
                : (DECEPTION.find((item) => item.id === deception)?.categories ?? [])
              ).map((card) => (
                <button
                  key={card.name}
                  type="button"
                  onClick={() => {
                    if (card.name === "Public trust") {
                      setSenateMethod(null);
                      setSenateId(null);
                      setSenateCase(null);
                      setSenateSlice(null);
                      setFrontHref(null);
                      setSenateOn(true);
                      return;
                    }
                    if (card.name === "Cable news") setSpot("cable");
                    if (card.name === "Trump TV") setSpot("trump");
                    if (card.name === "Podcasts") setSpot("podcasts");
                    if (card.name === "C-SPAN") setSpot("cspan");
                    if (CARD_CASES[card.name]) {
                      setCardSlice(null);
                      setCardCase(null);
                      setCardHref(null);
                      setCard(card.name);
                    }
                  }}
                  className="flex w-44 flex-col items-center gap-2 border-0 bg-transparent p-0"
                >
                  <span className="text-center text-[15px] font-semibold tracking-wide text-white">{card.name}</span>
                  <img src={card.image} alt="" className="h-28 w-full rounded-2xl border border-white/30 object-cover" />
                </button>
              ))}
              </div>
            </div>
            )}
          </div>
        ) : null}
        <div className="fixed top-5 left-5 z-20 flex flex-col items-center gap-2">
          {layer === "root" || (layer === "lawfare" && !lawOn && ethicsDoc) ? (
            <Link
              to="/"
              aria-label="Back"
              className="rounded-full border border-white/35 bg-[#070b12]/80 px-3 py-1 text-[12px] leading-none font-semibold text-white"
            >
              ←
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Back"
              onClick={() => {
                if (impeachFile) {
                  if (impeachFile === "public") setImpeachFile(impeachFrom);
                  else setImpeachFile(null);
                  return;
                }
                if (layer === "lawfare" && lawOn) {
                  lawBack();
                  return;
                }
                if (layer === "fcc" || layer === "press" || layer === "codes" || layer === "cable") {
                  if (ruleSource) {
                    setRuleSource(null);
                    return;
                  }
                  if (ruleEnd) {
                    setRuleEnd(false);
                    return;
                  }
                  if (ruleName) {
                    setRuleName(null);
                    return;
                  }
                  setLayer("fake");
                  return;
                }
                if (source) {
                  setSource(null);
                  return;
                }
                if (aside) {
                  setAside(null);
                  return;
                }
                if (outcome) {
                  setOutcome(false);
                  return;
                }
                if (checkerBack() || cardBack()) return;
                if (tilePath.length) {
                  setTilePath(tilePath.slice(0, -1));
                  return;
                }
                if (spot) {
                  setSpot(null);
                  return;
                }
                if (deception === "politicians" && senateOn && frontHref) {
                  setFrontHref(null);
                  return;
                }
                if (senateCase) {
                  setSenateCase(null);
                  return;
                }
                if (senateSlice) {
                  setSenateSlice(null);
                  return;
                }
                if (senateId) {
                  setSenateId(null);
                  return;
                }
                if (senateMethod) {
                  setSenateMethod(null);
                  return;
                }
                if (senateOn) {
                  setSenateOn(false);
                  return;
                }
                if (deception) {
                  setTilePath([]);
                  setDeception(null);
                  setLayer("fake");
                  return;
                }
                if (layer === "mechanics" && method) {
                  setMethod(null);
                  return;
                }
                if (layer === "evidence") {
                  newsBack();
                  return;
                }
                if (newsSource) {
                  setNewsSource(null);
                  return;
                }
                if (newsCase) {
                  setNewsCase(null);
                  return;
                }
                if (newsMethod && newsMethod.includes(":")) {
                  setNewsMethod(newsMethod.slice(0, newsMethod.indexOf(":")));
                  return;
                }
                if (newsMethod) {
                  setNewsMethod(null);
                  return;
                }
                if (saveHref) {
                  setSaveHref(null);
                  return;
                }
                if (saveSource) {
                  setSaveSource(null);
                  return;
                }
                if (saveBar && saveBar.startsWith("lean:")) {
                  setSaveBar(`group:${SAVE_SOCIAL_INDEX}`);
                  return;
                }
                if (saveBar) {
                  setSaveBar(null);
                  return;
                }
                if (saveRuling) {
                  setSaveRuling(false);
                  return;
                }
                if (saveOn) {
                  setSaveOn(false);
                  return;
                }
                if (estimatesOn) {
                  setEstimatesOn(false);
                  return;
                }
                if (topicBack()) return;
                setLayer(LAYERS[layer].back);
              }}
              className="rounded-full border border-white/35 bg-[#070b12]/80 px-3 py-1 text-[12px] leading-none font-semibold text-white"
            >
              ←
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
