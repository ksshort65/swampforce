import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DECEPTION } from "../data/deception";
import newsEvidence from "../data/fake-news-evidence.json";
import factCheckerVetting from "../data/fact-checker-vetting.json";
import fakeNewsCases from "../data/fake-news-cases.json";
import lawfareCases from "../data/lawfare-cases.json";

export const Route = createFileRoute("/betrayal")({ component: Betrayal });

type Layer = "root" | "fake" | "mechanics" | "types" | "evidence" | "lawfare" | "trials" | "impeach" | "citizen" | "bail";

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
    buttons: ["First, 2019", "Second, 2021"],
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
};

const NEXT: Record<string, Layer> = {
  "Fake News": "fake",
  "Types of deception": "types",
  Lawfare: "lawfare",
  "Trump Trials": "trials",
  Impeachments: "impeach",
  "US Citizen Lawfare": "citizen",
  "Politicians' bail funds": "bail",
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
      "omitted context",
      "misquote / truncation",
      "fabrication / false attribution",
      "premature “proven” framing",
      "retracted invention",
      "policy-scope inflation",
      "false attribution of words/intent / omitted context",
      "retracted invention / misquote / truncation",
    ],
    data: [14, 8, 8, 5, 5, 5, 4, 2],
    colors: ["#b91c1c"],
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
          <li key={label} className="flex items-center gap-2 text-[15px] text-white">
            <span className="inline-block h-3 w-3" style={{ background: spec.colors[index % spec.colors.length] }} />
            {label}
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
        <div className="mx-auto mt-8 grid w-full max-w-xl grid-cols-1 gap-3">
          {NEWS_DIMS.map((item) => (
            <button key={item.key} type="button" onClick={() => onPath([period.key, item.key])} className={NEWS_DOOR}>
              {item.title}
            </button>
          ))}
        </div>
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

function LawfareScreen({
  pick,
  caseId,
  href,
  onPick,
  onCase,
  onSource,
}: {
  pick: string | null;
  caseId: string | null;
  href: string | null;
  onPick: (value: string) => void;
  onCase: (value: string) => void;
  onSource: (value: string) => void;
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
        <div className="mt-4 flex flex-wrap gap-2">
          {(chart.sources ?? []).map((source) => (
            <button key={source.href} type="button" onClick={() => onSource(source.href)} className={NEWS_DOOR + " w-fit"}>
              {source.label}
            </button>
          ))}
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
          <button key={row.id} type="button" onClick={() => onCase(row.id)} className={NEWS_DOOR + " text-left"}>
            {row.who} · {row.began}
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
            <button type="button" onClick={() => onCase(row.name)} className={NEWS_DOOR + " text-left"}>
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
            <button key={row.name} type="button" onClick={() => onCase(row.name)} className={NEWS_DOOR + " text-left"}>
              {row.name} · {row.group} · {row.outcome}
            </button>
          ))}
        </div>
      );
    }
    const ids = chart.caseIds[index] ?? [];
    const rows = ids.map((id) => file.cases.find((item) => item.id === id)).filter((item): item is (typeof file.cases)[number] => !!item);
    return (
      <div className="mt-8 flex w-full flex-col gap-3">
        <p className="text-center text-[16px] font-semibold text-white">{chart.labels[index]} · {rows.length}</p>
        {rows.length === 0 ? <p className="text-center text-[15px] text-white/80">Not on record.</p> : null}
        {rows.map((row) => (
          <button key={row.id} type="button" onClick={() => onCase(row.id)} className={NEWS_DOOR + " text-left"}>
            {row.caseName} · {row.court} · {row.statusLabel}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-6 flex w-full flex-col gap-8">
      {file.charts.map((item) => (
        <section key={item.id}>
          <h2 className="text-center text-[16px] font-semibold text-white">{item.title}</h2>
          <p className="mt-1 text-center text-[15px] text-white/80">{file.asOf}</p>
          <div className={item.type === "doughnut" ? "relative mt-4 h-72" : item.horizontal ? "relative mt-4 h-[640px]" : "relative mt-4 h-72"}>
            <LawChart
              title={item.title}
              labels={item.labels}
              data={item.data}
              colors={item.colors}
              type={item.type === "doughnut" ? "doughnut" : "bar"}
              horizontal={item.horizontal}
              onPick={(bar) => onPick(`${item.id}:${bar}`)}
            />
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {(item.keys ?? item.labels.map((label, bar) => ({ label: `${label} · ${item.data[bar]}`, color: item.colors[bar] ?? item.colors[0] }))).map((key) => (
              <li key={key.label} className="flex items-center gap-2 text-[15px] text-white">
                <span className="inline-block h-3 w-3 shrink-0" style={{ background: key.color }} />
                {key.label}
              </li>
            ))}
          </ul>
          <ul className="mt-2 list-disc pl-5 text-[15px] leading-snug text-white/80">
            {item.bullets.slice(0, 3).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}
      <button type="button" onClick={() => onPick("deception")} className={NEWS_DOOR}>
        Deception about Lawfare (6)
      </button>
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
        {layer !== "fake" && layer !== "root" && layer !== "types" && layer !== "mechanics" && layer !== "evidence" && layer !== "bail" && !lawOn && (
        <nav
          aria-label="Betrayal"
          className="relative flex min-h-14 items-center justify-center bg-[#070b12]/90 px-6 py-2"
        >
          {layer !== "root" && (
          <button
            type="button"
            onClick={() => setLayer(LAYERS[layer].back)}
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
                  if (label === "Lawfare Evidence") {
                    setLawPick(null);
                    setLawCase(null);
                    setLawHref(null);
                    setLawOn(true);
                    return;
                  }
                  setLawOn(false);
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
              {newsMethod && !newsMethod.includes(":") && !newsCase && !newsSource
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
        {layer === "lawfare" && lawOn && (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <LawfareScreen
              pick={lawPick}
              caseId={lawCase}
              href={lawHref}
              onPick={setLawPick}
              onCase={setLawCase}
              onSource={setLawHref}
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
        {(layer === "fake" || layer === "types") && deception ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => {
                if (spot) {
                  setSpot(null);
                  return;
                }
                setDeception(null);
                setLayer("fake");
              }}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              {spot === "cable" ? "Cable news" : spot === "trump" ? "Trump TV" : spot === "podcasts" ? "Podcasts" : spot === "cspan" ? "C-SPAN" : DECEPTION.find((item) => item.id === deception)?.title}
            </button>
            {deception === "checkers" ? (
              <div className="mt-8 w-full text-left">
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
                if (layer === "lawfare" && lawOn) {
                  if (lawHref) {
                    setLawHref(null);
                    return;
                  }
                  if (lawCase) {
                    setLawCase(null);
                    return;
                  }
                  if (lawPick) {
                    setLawPick(null);
                    return;
                  }
                  setLawOn(false);
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
