import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DECEPTION } from "../data/deception";
import newsEvidence from "../data/fake-news-evidence.json";
import factCheckerVetting from "../data/fact-checker-vetting.json";
import fakeNewsCases from "../data/fake-news-cases.json";
import lawfareCases from "../data/lawfare-cases.json";

export const Route = createFileRoute("/betrayal")({ component: Betrayal });

type Layer = "root" | "fake" | "mechanics" | "types" | "evidence" | "lawfare" | "trials" | "impeach" | "citizen" | "bail" | "scrutiny" | "attempts" | "first100";

const LAYERS: Record<Exclude<Layer, "root">, { back: Layer; title: string; buttons: string[] }> = {
  fake: {
    back: "root",
    title: "Fake News",
    buttons: ["Types of deception", "Charts"],
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
    evidence: [{ label: "McCombs and Shaw, 1972" }],
  },
  {
    name: "Framing",
    info: "The slice of reality that is highlighted leads the audience to a preferred conclusion, even when the words shown are technically accurate.",
    evidence: [
      {
        label: "Tversky and Kahneman, Science, 1981",
        href: "https://gwern.net/doc/psychology/1981-tversky.pdf",
      },
      { label: "Entman, 1993" },
    ],
  },
  {
    name: "Priming",
    info: "Once an issue is on the mental agenda, people use it as the yardstick for leaders and opponents.",
    evidence: [{ label: "Iyengar and Kinder, News That Matters, 1987" }],
  },
  {
    name: "Illusory truth",
    info: "A statement heard again and again starts to feel true, even when people already know better.",
    evidence: [
      {
        label: "Nature Communications, 2026, review of 182 studies",
        href: "https://www.nature.com/articles/s41467-026-70041-x",
      },
      { label: "Hasher, Goldstein and Toppino, 1977" },
    ],
  },
  {
    name: "Anchoring",
    info: "Early numbers and the first story pull later judgments toward them.",
    evidence: [{ label: "Tversky and Kahneman, 1974" }],
  },
  {
    name: "Contextomy",
    info: "Cutting the words so the remainder means something the speaker did not say. The shortened quote sticks after the full context is restored.",
    evidence: [{ label: "McGlone, 2005" }],
  },
  {
    name: "Paltering",
    info: "Misleading with statements that are technically true. People often prefer this to an outright lie. The target still feels deceived.",
    evidence: [{ label: "Rogers, Zeckhauser, Gino, Norton and Schweitzer, 2017" }],
  },
  {
    name: "Omission",
    info: "Leaving out the fact that would change the meaning.",
    evidence: [{ label: "Rogers and colleagues, 2017" }],
  },
  {
    name: "Gaslighting",
    info: "Deny the documented record, then make people doubt what they saw. The correction is quiet, late, or treated as if the original claim never happened.",
    evidence: [{ label: "Sweet, American Sociological Review, 2019" }],
  },
  {
    name: "Confirmation bias",
    info: "People seek and overweight information that fits what they already believe. Same-leaning newsrooms under-check the stories that match.",
    evidence: [{ label: "Nickerson, 1998" }],
  },
  {
    name: "Motivated reasoning",
    info: "Wanting a side to win or lose steers what counts as convincing. A correction from the other side bounces off.",
    evidence: [{ label: "Kunda, 1990" }],
  },
  {
    name: "Continued influence",
    info: "People keep relying on retracted information after it has been corrected. The first blast outruns the fix.",
    evidence: [{ label: "Johnson and Seifert, 1994" }],
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
    labels: ["Proven false", "Rated misleading"],
    data: [69, 60],
    colors: ["#166534", "#b45309"],
    key: "evidence",
    values: ["Proven false", "Rated misleading"],
    bullets: [
      "Tap to filter",
      "129 news claims we verified as false or misleading. 108 never corrected.",
      "94 of the 129 verified cases were also confirmed by an approved fact-checker.",
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
  onNever,
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
            legend: { display: false },
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
            <button
              type="button"
              onClick={onNever}
              className="pointer-events-auto flex flex-col items-center border-0 bg-transparent p-0"
            >
              <span className="text-[28px] font-bold text-white">108</span>
              <span className="text-[15px] font-semibold text-white underline decoration-[#d4af37] underline-offset-4">Never corrected</span>
            </button>
          </div>
        ) : null}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {spec.labels.map((label, index) => (
          <li key={label}>
            {spec.id === "chart-methods" ? (
              <button
                type="button"
                onClick={() => onPick(index)}
                className="flex min-h-11 items-center gap-2 border-0 bg-transparent p-0 text-left text-[15px] font-semibold text-white"
              >
                <span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: spec.colors[index % spec.colors.length] }} />
                {label} · {spec.data[index]}
              </button>
            ) : (
              <span className="flex items-center gap-2 text-[15px] text-white">
                <span className="inline-block h-3 w-3" style={{ background: spec.colors[index % spec.colors.length] }} />
                {label}
              </span>
            )}
          </li>
        ))}
        {spec.id === "chart-evidence" ? (
          <li className="text-[15px] text-white">
            <button
              type="button"
              onClick={onNever}
              className="border-0 bg-transparent p-0 text-[15px] text-white underline decoration-[#d4af37] underline-offset-4"
            >
              108 Never corrected · 49 false / 59 misleading
            </button>
          </li>
        ) : null}
      </ul>
      <ul className="mt-2 list-disc pl-5 text-[15px] leading-snug text-white/80">
        {spec.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
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
      <canvas ref={canvasRef} aria-label={title} />
    </div>
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

function NewsCaseList({ rows, onCase }: { rows: NewsCaseRow[]; onCase: (id: string) => void }) {
  return (
    <div className="mt-6 flex w-full flex-col gap-2">
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => onCase(row.id)}
          className="w-full rounded-3xl border border-white/35 bg-[#070b12]/75 px-4 py-2 text-left text-[15px] font-semibold leading-snug text-white"
        >
          {row.who} · {row.began}
          <span className="mt-1 block font-normal text-white/80">{row.statusLabel}</span>
        </button>
      ))}
    </div>
  );
}

function NewsCaseDetail({ row, onSource }: { row: NewsCaseRow; onSource: (href: string) => void }) {
  return (
    <div className="w-full">
      <NewsHeading title={`Case #${row.id}`} line={`${row.period} · ${row.began}`} />
      <div className="mt-6 w-full rounded-2xl border border-white/20 bg-[#070b12]/85 px-5 py-5 text-left">
        <span className="inline-block rounded-full border border-[#d4af37] px-3 py-1 text-[15px] font-semibold text-[#d4af37]">
          {row.statusLabel}
        </span>
        <p className="mt-4 text-[16px] font-semibold text-white">Who</p>
        <p className="mt-1 text-[15px] leading-snug text-white/85">{row.who}</p>
        <p className="mt-4 text-[16px] font-semibold text-white">Date</p>
        <p className="mt-1 text-[15px] leading-snug text-white/85">
          Began {row.began} · Ended {row.ended}
        </p>
        <p className="mt-4 text-[16px] font-semibold text-white">What they said</p>
        <p className="mt-1 text-[15px] leading-snug text-white/85">{row.said}</p>
        <p className="mt-4 text-[16px] font-semibold text-white">What the record shows</p>
        <p className="mt-1 whitespace-pre-line text-[15px] leading-snug text-white/85">{row.record}</p>
        {row.correction ? (
          <>
            <p className="mt-4 text-[16px] font-semibold text-white">Correction</p>
            <p className="mt-1 text-[15px] leading-snug text-white/85">{row.correction}</p>
          </>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {row.sources.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => onSource(item.href)}
              className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1.5 text-[15px] font-semibold text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
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
}) {
  const height = type === "doughnut" ? 300 : horizontal ? Math.max(200, labels.length * 46 + 50) : 300;
  const lines = keys ?? labels.map((label, index) => ({ label: `${label} · ${data[index]}`, color: colors[index] ?? colors[0], index }));
  return (
    <section className="w-full">
      <p className="mt-2 text-center text-[15px] text-white/75">{line}</p>
      <div className={NEWS_CARD}>
        <div className="relative w-full" style={{ height }}>
          <LawChart title={title} labels={labels} data={data} colors={colors} type={type} horizontal={horizontal} onPick={onPick} />
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
      </div>
      {bullets.length ? (
        <ul className="mt-4 list-disc pl-5 text-left text-[15px] leading-snug text-white/80">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
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
          <li>Only the 260 cases on this page are counted and sourced.</li>
        </ul>
      ) : null}
    </div>
  );
}

function NewsPeriodLayers({
  path,
  onPath,
  onCase,
}: {
  path: string[];
  onPath: (path: string[]) => void;
  onCase: (id: string) => void;
}) {
  const period = path[0] != null ? NEWS_PERIODS.find((item) => item.key === path[0]) : undefined;
  const dim = path[1] != null ? NEWS_DIMS.find((item) => item.key === path[1]) : undefined;
  const value = path[2];
  const subValue = path[3];
  const periodRows = period ? NEWS_CASES.filter((row) => row.period === period.key) : NEWS_CASES;
  const groupRows = dim && value != null ? periodRows.filter((row) => dim.get(row) === value) : periodRows;
  const valueRows = dim && dim.sub && subValue != null ? groupRows.filter((row) => dim.sub?.(row) === subValue) : groupRows;

  if (period && dim && value != null && (!dim.sub || subValue != null)) {
    return (
      <div className="w-full">
        <NewsHeading
          title={subValue ?? value}
          line={`${period.key} · ${subValue != null ? value : dim.title} · ${newsCasesLine(valueRows.length)}`}
        />
        <NewsCaseList rows={valueRows} onCase={onCase} />
      </div>
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
  onCase,
}: {
  which: string | null;
  onWhich: (which: string) => void;
  onCase: (id: string) => void;
}) {
  if (which === "false" || which === "misleading") {
    const rows = which === "false" ? NEWS_NEVER_FALSE : NEWS_NEVER_MISLEADING;
    return (
      <div className="w-full">
        <NewsHeading
          title={`Never corrected · ${which === "false" ? "False" : "Misleading"} (${rows.length})`}
          line={`Verified cases · ${newsCasesLine(rows.length)}`}
        />
        <NewsCaseList rows={rows} onCase={onCase} />
      </div>
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
      <NewsCaseList rows={NEWS_NEVER} onCase={onCase} />
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
    "views": "156,874",
    "said": "The MAGA Supreme Court strikes again ... thousands of American voters could be wrongly stripped from voter rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/SenSchumer/status/2103542232418550057"
      }
    ],
    "viewCount": 156874
  },
  {
    "id": "save-row-2",
    "who": "Ilhan Omar",
    "group": "Democratic",
    "where": "X",
    "when": "3:41 PM",
    "views": "675,404",
    "said": "This is a blatant attempt to suppress the vote ... Eligible voters will be disenfranchised by this flawed tool.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/Ilhan/status/2103570490518323329"
      }
    ],
    "viewCount": 675404
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
    "views": "22,224 (18,793 + 3,431)",
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
    "viewCount": 22224
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
    "views": "1,069,121",
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
    "viewCount": 1069121,
    "lean": "Leans Democratic"
  },
  {
    "id": "save-row-7",
    "who": "Marc Elias",
    "group": "Social media",
    "where": "X",
    "when": "11:48 AM",
    "views": "611,144",
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
    "viewCount": 611144,
    "lean": "Leans Democratic"
  },
  {
    "id": "save-row-8",
    "who": "AG Todd Blanche",
    "group": "Republican/Trump administration",
    "where": "X",
    "when": "2:48 PM",
    "views": "198,581",
    "said": "Huge victory for election integrity! ... [the stay] will allow states to clear the voter rolls of illegal voters.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/AGToddBlanche/status/2103557217748504767"
      }
    ],
    "viewCount": 198581
  },
  {
    "id": "save-row-9",
    "who": "DHS (James Percival)",
    "group": "Republican/Trump administration",
    "where": "dhs.gov + X",
    "when": "Sept 25; X 12:26 PM",
    "views": "310,523",
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
    "viewCount": 310523
  },
  {
    "id": "save-row-10",
    "who": "NBC News",
    "group": "News",
    "where": "X + YouTube",
    "when": "Sept 25; YouTube 4:51 PM",
    "views": "64,278",
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
    "viewCount": 64278
  },
  {
    "id": "save-row-11",
    "who": "Wall Street Journal",
    "group": "News",
    "where": "X",
    "when": "Sept 25",
    "views": "49,754",
    "said": "The Court ... could deploy a federal immigration database to check voters' citizenship.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/WSJ/status/2103582128428462342"
      }
    ],
    "viewCount": 49754
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
    "views": "1,800",
    "said": "SCOTUS UNLOCKS VOTER ROLL PURGE.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://www.youtube.com/watch?v=Hk6rFjtridE"
      }
    ],
    "viewCount": 1800
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
    "views": "1,362,243",
    "said": "All illegal voters need to be REMOVED from the voter rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/libsoftiktok/status/2103523106434285971"
      }
    ],
    "viewCount": 1362243,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-19",
    "who": "Eric Daugherty",
    "group": "Social media",
    "where": "X",
    "when": "11:48 AM",
    "views": "476,667",
    "said": "GREENLIT ... PURGE the voter rolls of illegal voters during the 2026 midterms.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/EricLDaugh/status/2103512062458515770"
      }
    ],
    "viewCount": 476667,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-20",
    "who": "CynicalPublius",
    "group": "Social media",
    "where": "X",
    "when": "Sept 25, 3:10 PM",
    "views": "213,129",
    "said": "TRANSLATION… Trump is eliminating illegal alien, non-citizens from the voter rolls and SCOTUS affirmed this effort.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/CynicalPublius/status/2103562729416171789"
      }
    ],
    "viewCount": 213129,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-21",
    "who": "Baoliaogeming64",
    "group": "Social media",
    "where": "X",
    "when": "Sept 25, 12:13 PM",
    "views": "178,183",
    "said": "Chinese-language post (2,362 likes, 481 reposts); in English: The Supreme Court, by a 6-3 absolute advantage, officially gave the green light! Approved the Trump administration's fully upgraded SAVE citizenship-verification database! This means every state in the country finally has an imperial sword and can freely and drastically clean illegal voters from the voter rolls!",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/Baoliaogeming64/status/2103518355567100142"
      }
    ],
    "viewCount": 178183,
    "lean": "Not yet identified",
    "leanNote": "X About page: based in United States; joined Dec 2020; verified since Dec 2022; 1 username change (Jul 2021); connected via US App Store."
  },
  {
    "id": "save-row-22",
    "who": "Scott Presler",
    "group": "Social media",
    "where": "X",
    "when": "10:23 PM",
    "views": "327,657 (post 1: 263,910; post 2: 63,747)",
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
    "viewCount": 327657,
    "lean": "Leans Republican"
  },
  {
    "id": "save-row-23",
    "who": "derekjonhsonn",
    "group": "Social media",
    "where": "X",
    "when": "Sept 26, 7:21 PM",
    "views": "532",
    "said": "DOGE-enhanced federal SAVE database ... is GREENLIT ... Clean the rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/derekjonhsonn/status/2103988486260892098"
      }
    ],
    "viewCount": 532,
    "lean": "Leans Republican",
    "leanNote": "Self-describes as pro-Trump/MAGA. Not yet verified."
  },
  {
    "id": "save-row-24",
    "who": "MelG_Gibson",
    "group": "Social media",
    "where": "X",
    "when": "Sept 26, 7:57 PM",
    "views": "574",
    "said": "SAVE Database to purge illegal aliens from voter rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/MelG_Gibson/status/2103997295867916796"
      }
    ],
    "viewCount": 574,
    "lean": "Leans Republican",
    "leanNote": "Self-describes as pro-Trump/MAGA. Not yet verified."
  },
  {
    "id": "save-row-25",
    "who": "Josh Howerton (commentaryhower)",
    "group": "Social media",
    "where": "X",
    "when": "Sept 26, 7:58 PM",
    "views": "278",
    "said": "The 6–3 is the green light. Drive it. Purge the rolls.",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/commentaryhower/status/2103997664874332287"
      }
    ],
    "viewCount": 278,
    "lean": "Not yet identified"
  },
  {
    "id": "save-row-26",
    "who": "@AsFoundX",
    "group": "Social media",
    "where": "X",
    "when": "Sept 27, 2026, 10:29 AM ET",
    "views": "11,989",
    "said": "SUPREME COURT GREENLIGHTS DOGE VOTER ROLL CLEANUP… approved the DOGE-enhanced SAVE database… designed to purge",
    "links": [
      {
        "label": "source ↗",
        "href": "https://x.com/AsFoundX/status/2104216742008418370"
      }
    ],
    "viewCount": 11989,
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
}: {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  type: "bar" | "doughnut";
  horizontal: boolean;
  onPick: (index: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const key = JSON.stringify([title, labels, data, colors, type, horizontal]);
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
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: type === "bar" && horizontal ? "y" : "x",
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
  YouTube: { note: "Case text or source says it ran on YouTube", match: (row) => newsClass(row).platforms.includes("YouTube") },
  Rumble: { note: "Case text or source says it ran on Rumble", match: (row) => newsClass(row).platforms.includes("Rumble") },
  Twitter: { note: "Case text or source says it ran on X (Twitter)", match: (row) => newsClass(row).platforms.includes("X/Twitter") },
};

function newsClass(row: NewsCaseRow): { role: string; platforms: string[] } {
  const found = (row as { classification?: { role: string; platforms: string[] } }).classification;
  return found ?? { role: "Not classified", platforms: [] };
}
const CARD_DIM = NEWS_DIMS[0];

function CardLayers({
  card,
  slice,
  onSlice,
  onCase,
}: {
  card: string;
  slice: string | null;
  onSlice: (value: string) => void;
  onCase: (id: string) => void;
}) {
  const spec = CARD_CASES[card];
  const rows = spec ? NEWS_CASES.filter(spec.match) : [];
  if (slice) {
    const list = slice === "all" ? rows : rows.filter((row) => CARD_DIM.get(row) === slice);
    return (
      <div className="w-full">
        <NewsHeading title={slice === "all" ? `${card} · all cases` : slice} line={`${card} · ${newsCasesLine(list.length)}`} />
        <NewsCaseList rows={list} onCase={onCase} />
      </div>
    );
  }
  const groups = newsCountBy(rows, CARD_DIM);
  return (
    <div className="w-full">
      <p className="mt-6 text-center text-[18px] font-semibold tracking-wide text-white">{card}: Verdict / status</p>
      {rows.length === 0 ? (
        <ChartSlot line="Jan 1, 2015 – Sept 27, 2026" />
      ) : (
        <LayerChart
          title={`${card}: Verdict / status`}
          line={`Jan 1, 2015 – Sept 27, 2026 · ${newsCasesLine(rows.length)}`}
          labels={groups.map((item) => item.label)}
          data={groups.map((item) => item.count)}
          colors={groups.map((item) => CARD_DIM.colors[item.label] ?? CARD_DIM.fallback)}
          type="doughnut"
          horizontal={false}
          bullets={spec?.note ? [spec.note] : []}
          center={{ big: String(rows.length), small: rows.length === 1 ? "Case" : "Cases", onOpen: () => onSlice("all") }}
          onPick={(index) => onSlice(groups[index].label)}
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
          <button key={row.id} type="button" onClick={() => onCase(row.id)} className={LAYER_ROW}>
            {row.shortName}
            <span className="mt-1 block font-normal text-white/80">{row.shortStatus}</span>
          </button>
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
  const open = parts[2] === "list";
  const spec = EVIDENCE_CHARTS.find((item) => item.id === "chart-methods");
  if (!spec) return null;
  const value = spec.values[index];
  const label = spec.labels[index];
  const cases = newsEvidence.methods.flatMap((item) => item.cases).filter((item) => item.method === value);
  const image = METHOD_TILE[value] ?? "/images/pill-methods.jpg";
  if (open) {
    return (
      <div className="mt-6 flex w-full flex-col gap-4 text-left">
        <p className="text-center text-[16px] font-semibold text-white">{label} · {cases.length}</p>
        {cases.map((item) => {
          const line = methodStatus(item.id);
          return (
            <article key={item.id} className="rounded-2xl border border-white/25 bg-[#070b12]/85 px-4 py-4">
              <p className="text-[16px] font-semibold text-white">{line.status}</p>
              <p className="mt-2 text-[15px] leading-snug text-white">{line.retracted}</p>
              <p className="mt-2 text-[15px] leading-snug text-white">Method of retraction: {line.how}</p>
              <p className="mt-2 text-[15px] leading-snug text-white">Audience: {line.audience}</p>
              <p className="mt-2 text-[15px] leading-snug text-white">How long it was repeated: {line.duration}</p>
              <p className="mt-2 text-[15px] leading-snug text-white">By whom: {item.who}</p>
              <p className="mt-2 text-[15px] leading-snug text-white/85">{item.said}</p>
              <div className="mt-3 flex flex-col gap-2">
                {item.sources.map((source) => (
                  <button key={source.href} type="button" onClick={() => onSource(source.href)} className={NEWS_DOOR + " text-left"}>
                    {source.label}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3">
        <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">{label}</span>
        <img src={image} alt="" className="h-52 w-52 rounded-2xl border border-white/30 object-cover" />
      </div>
      <div className="mt-8 flex justify-center">
        <button type="button" onClick={() => onMethod(`chart-methods:${index}:list`)} className={NEWS_DOOR}>
          All {cases.length} cases
        </button>
      </div>
    </div>
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
  onCase,
}: {
  method: string;
  onMethod: (next: string) => void;
  onCase: (id: string) => void;
}) {
  const parts = method.split(":");
  const index = Number(parts[1]);
  const period = parts.length > 2 ? parts.slice(2).join(":") : null;
  const { spec, value, cases } = proofSlice(index);
  const label = spec?.labels[index] ?? "Strength of proof";
  const rows = cases.map((item) => ({ item, file: NEWS_CASES.find((row) => row.id === item.id) }));
  if (period) {
    const picked = rows.filter((row) => (row.file?.period ?? "Date unknown") === period);
    return (
      <div className="w-full">
        <p className="text-center text-[16px] font-semibold text-white">{period} · {picked.length}</p>
        <LayerTiles
          square
          tiles={picked.map(({ item }) => ({
            key: item.id,
            label: item.label,
            image: PROOF_TILE[value ?? ""] ?? "/images/tile-strength-of-proof.jpg",
            onOpen: () => onCase(item.id),
          }))}
        />
      </div>
    );
  }
  const groups = NEWS_PERIODS.map((item) => ({
    key: item.key,
    count: rows.filter((row) => (row.file?.period ?? "Date unknown") === item.key).length,
  })).filter((item) => item.count > 0);
  return (
    <div className="w-full">
      <p className="text-center text-[16px] font-semibold text-white">{label} · {cases.length}</p>
      <LayerTiles
        square
        tiles={groups.map((item) => ({
          key: item.key,
          label: item.key,
          image: PERIOD_TILE[item.key] ?? "/images/pill-time.jpg",
          onOpen: () => onMethod(`chart-proof:${index}:${item.key}`),
        }))}
      />
    </div>
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

function Betrayal() {
  const [layer, setLayer] = useState<Layer>("root");
  const [method, setMethod] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [newsMethod, setNewsMethod] = useState<string | null>(null);
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
  const [spot, setSpot] = useState<null | "cable" | "trump" | "podcasts" | "cspan">(null);
  const [checkerPick, setCheckerPick] = useState<string | null>(null);
  const [checkerName, setCheckerName] = useState<string | null>(null);
  const [checkerHref, setCheckerHref] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);
  const [cardSlice, setCardSlice] = useState<string | null>(null);
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
    if (cardHref) {
      setCardHref(null);
      return true;
    }
    if (cardCase) {
      setCardCase(null);
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
    if (newsMethod && newsMethod.startsWith("chart-term:")) {
      const path = newsPath(newsMethod.slice("chart-term:".length));
      setNewsMethod(path.length > 1 ? `chart-term:${JSON.stringify(path.slice(0, -1))}` : "chart-term");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-methods:")) {
      const parts = newsMethod.split(":");
      setNewsMethod(parts.length > 2 ? `chart-methods:${parts[1]}` : "chart-methods");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-proof:")) {
      const parts = newsMethod.split(":");
      setNewsMethod(parts.length > 2 ? parts.slice(0, 2).join(":") : "chart-proof");
      return;
    }
    if (newsMethod && newsMethod.startsWith("chart-evidence:never")) {
      setNewsMethod(newsMethod === "chart-evidence:never" ? "chart-evidence" : "chart-evidence:never");
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
          {layer !== "root" && (
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
          <div className="flex items-start justify-center gap-10 px-6 pt-16">
            {(
              [
                ["Fake News", "/images/topic-fake-news.jpg", "fake"],
                ["Lawfare", "/images/topic-lawfare.jpg", "lawfare"],
              ] as const
            ).map(([label, src, next]) => (
              <button
                key={label}
                type="button"
                onClick={() => setLayer(next)}
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-[18px] font-semibold tracking-wide text-white">{label}</span>
                <img
                  src={src}
                  alt=""
                  className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                />
              </button>
            ))}
          </div>
        )}
        {layer === "fake" && !saveOn && !deception && !estimatesOn && (
          <div className="flex flex-col items-center px-6 pt-16">
            <button
              type="button"
              onClick={() => setLayer("root")}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              Fake News
            </button>
            <div className="mt-8 flex flex-wrap items-end justify-center gap-10">
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
                <img
                  src="/images/topic-fake-news.jpg"
                  alt=""
                  className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                />
              </button>
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
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                  Social Media Weapon
                </span>
                <img
                  src="/images/topic-save.jpg"
                  alt=""
                  className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => setEstimatesOn(true)}
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                  Estimates
                </span>
                <img
                  src="/images/topic-estimates.jpg"
                  alt=""
                  className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                />
              </button>
              {DECEPTION.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSpot(null);
                    setCheckerPick(null);
                    setCheckerName(null);
                    setCheckerHref(null);
                    setCard(null);
                    setCardSlice(null);
                    setCardCase(null);
                    setCardHref(null);
                    setDeception(item.id);
                  }}
                  className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
                >
                  <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                    {item.title}
                  </span>
                  <img
                    src={item.image}
                    alt=""
                    className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                  />
                </button>
              ))}
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
            <ul className="mt-8 w-full list-disc rounded-2xl border border-white/20 bg-[#070b12]/85 py-4 pr-5 pl-9 text-left text-[15px] leading-snug text-white/85">
              <li className="font-semibold text-white">Estimated scale — not verified</li>
              <li>Numbers this large cannot possibly be verified by the SwampForce Editor alone. These are outside estimates, not counts.</li>
              <li>Millions of negative items about Trump in every two-year block since 2015.</li>
              <li>Peak years: 2016–17 and 2020–21.</li>
              <li>Most misleading copies spread on social media and memes (estimated 60–80%).</li>
              <li>A few hundred false storylines, reused again and again.</li>
              <li>Only the 260 cases on this page are counted and sourced.</li>
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
                      {row.group}
                      {row.lean ? ` · ${row.lean}` : ""} · {row.where} · {row.when} · {row.views}
                      {row.viewCount ? " views" : ""}
                    </p>
                    {row.leanNote && <p className="mt-1 text-[15px] text-white/75">{row.leanNote}</p>}
                    <p className="mt-4 text-[16px] font-semibold text-white">What they said</p>
                    <p className="mt-2 text-[15px] leading-snug text-white/85">{row.said}</p>
                    {row.record && (
                      <>
                        <p className="mt-4 text-[16px] font-semibold text-white">What the record shows</p>
                        <p className="mt-2 text-[15px] leading-snug text-white/85">{row.record}</p>
                      </>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {row.links.map((link) => (
                        <button
                          key={link.href}
                          type="button"
                          onClick={() => setSaveHref(link.href)}
                          className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
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
                          {row.lean === "Leans Republican" && row.leanNote ? " · Lean not yet verified" : ""}
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
                  <p className="text-[28px] font-bold text-white"><span className="block text-[16px] font-semibold">At least</span>5,727,760<span className="mt-1 block text-[16px] font-semibold">views</span></p>
                  <p className="text-[28px] font-bold text-white">0<span className="mt-1 block text-[16px] font-semibold">fact-checks</span></p>
                  <p className="text-[16px] font-semibold text-white">Already shaping public opinion.</p>
                </div>
                <p className="text-[15px] text-white/80">as of Sept. 27, 2026, 1:06 PM MT</p>
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
              {newsMethod === "chart-proof" && !newsCase && !newsSource
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
            ) : newsMethod && (newsMethod === "chart-term" || newsMethod.startsWith("chart-term:")) ? (
              <NewsPeriodLayers
                path={newsMethod === "chart-term" ? [] : newsPath(newsMethod.slice("chart-term:".length))}
                onPath={(path) => setNewsMethod(`chart-term:${JSON.stringify(path)}`)}
                onCase={(id) => {
                  setNewsSource(null);
                  setNewsCase(id);
                }}
              />
            ) : newsMethod && newsMethod.startsWith("chart-evidence:never") ? (
              <NewsNeverList
                which={newsMethod === "chart-evidence:never" ? null : newsMethod.slice("chart-evidence:never:".length)}
                onWhich={(which) => setNewsMethod(`chart-evidence:never:${which}`)}
                onCase={(id) => {
                  setNewsSource(null);
                  setNewsCase(id);
                }}
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
                onCase={(id) => {
                  setNewsSource(null);
                  setNewsCase(id);
                }}
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
                    <>
                      <p className="text-center text-[16px] font-semibold text-white">
                        {spec ? `${spec.labels[index]} · ${spec.data[index]}` : ""}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cases.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setNewsSource(null);
                              setNewsCase(item.id);
                            }}
                            className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[15px] font-semibold text-white"
                          >
                            {item.who} · {item.date}
                          </button>
                        ))}
                      </div>
                    </>
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
              <div className="mt-8 flex max-w-5xl flex-wrap items-end justify-center gap-8">
                {EVIDENCE_CHARTS.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      setNewsSource(null);
                      setNewsCase(null);
                      setNewsMethod(spec.id);
                    }}
                    className="flex w-52 flex-col items-center gap-3 border-0 bg-transparent p-0"
                  >
                    <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                      {spec.title}
                    </span>
                    <img
                      src={PILL_GRAPHIC[spec.id]}
                      alt=""
                      className="h-52 w-52 rounded-2xl border border-white/30 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                <button
                  type="button"
                  onClick={() => setAside("standard")}
                  className="mt-8 w-full rounded-full border-2 border-[#d4af37] bg-[#070b12]/80 px-6 py-4 text-[18px] font-bold text-white"
                >
                  What you can do to hold fake news to its standard
                </button>
                <button
                  type="button"
                  onClick={() => setAside("record")}
                  className="mt-3 w-full rounded-full border border-white/40 bg-[#070b12]/80 px-6 py-3 text-[16px] font-semibold text-white"
                >
                  The record and the law
                </button>
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
                if (checkerBack() || cardBack()) return;
                if (spot) {
                  setSpot(null);
                  return;
                }
                setDeception(null);
                setLayer("fake");
              }}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              {card ? card : spot === "cable" ? "Cable news" : spot === "trump" ? "Trump TV" : spot === "podcasts" ? "Podcasts" : spot === "cspan" ? "C-SPAN" : DECEPTION.find((item) => item.id === deception)?.title}
            </button>
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
              <CardLayers card={card} slice={cardSlice} onSlice={setCardSlice} onCase={setCardCase} />
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
                        .map((link) => (
                          <a
                            key={link.href}
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
            ) : (
            <div className="mt-8 flex max-w-5xl flex-wrap items-end justify-center gap-6">
              {(spot === "cable"
                ? (DECEPTION.find((item) => item.id === deception)?.stations ?? [])
                : (DECEPTION.find((item) => item.id === deception)?.categories ?? [])
              ).map((card) => (
                <button
                  key={card.name}
                  type="button"
                  onClick={() => {
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
            )}
          </div>
        ) : null}
        <div className="fixed top-5 left-5 z-20 flex flex-col items-center gap-2">
          {layer === "root" ? (
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
                if (spot) {
                  setSpot(null);
                  return;
                }
                if (deception) {
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
