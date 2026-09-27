import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DECEPTION } from "../data/deception";
import newsEvidence from "../data/fake-news-evidence.json";

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

function Betrayal() {
  const [layer, setLayer] = useState<Layer>("root");
  const [method, setMethod] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [newsMethod, setNewsMethod] = useState<string | null>(null);
  const [newsCase, setNewsCase] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string | null>(null);
  const [outcome, setOutcome] = useState(false);
  const [aside, setAside] = useState<null | "standard" | "record">(null);
  const [deception, setDeception] = useState<string | null>(null);
  const [spot, setSpot] = useState<null | "cable" | "trump" | "podcasts" | "cspan">(null);
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
        {layer !== "fake" && layer !== "root" && layer !== "types" && layer !== "mechanics" && layer !== "evidence" && layer !== "bail" && (
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
        {layer === "fake" && (
          <div className="flex flex-col items-center px-6 pt-16">
            <button
              type="button"
              onClick={() => setLayer("root")}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              Fake News
            </button>
            <div className="mt-8 flex items-end justify-center gap-10">
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
                onClick={() => setLayer("types")}
                className="flex w-64 flex-col items-center gap-3 border-0 bg-transparent p-0"
              >
                <span className="text-center text-[16px] font-semibold leading-snug tracking-wide text-white">
                  Types of Deception
                </span>
                <img
                  src="/images/topic-types.jpg"
                  alt=""
                  className="h-44 w-full rounded-2xl border border-white/30 object-cover"
                />
              </button>
              <a
                href="/great-american-betrayal.html"
                className="flex h-44 w-64 items-center justify-center rounded-2xl border border-white/30 bg-[#070b12] p-0"
              >
                <span className="text-center text-[16px] font-semibold tracking-wide text-white">
                  bot copy
                </span>
              </a>
            </div>
          </div>
        )}
        {layer === "evidence" && (
          <div className="mx-auto flex max-w-xl flex-col items-center px-6 pt-10 pb-24">
            <button
              type="button"
              onClick={() => {
                setNewsMethod(null);
                setNewsCase(null);
                setNewsSource(null);
                setLayer("fake");
              }}
              className="border-0 bg-transparent p-0 text-center text-[16px] font-semibold tracking-wide text-white"
            >
              Fake News Evidence
            </button>
            <p className="mt-4 max-w-md text-center text-[13px] leading-snug text-white/75">
              {newsEvidence.line}
            </p>
            {newsSource ? (
              <SourcePage
                label={
                  newsEvidence.methods
                    .flatMap((item) => item.cases)
                    .flatMap((item) => item.sources)
                    .find((item) => item.href === newsSource)?.label ?? newsSource
                }
                href={newsSource}
              />
            ) : newsCase ? (
              <div className="mt-8 w-full border border-white/20 bg-[#070b12]/80 px-4 py-4 text-left">
                {newsEvidence.methods.flatMap((item) => item.cases).filter((item) => item.label === newsCase).map((item) => (
                  <div key={item.id}>
                    <p className="text-[16px] font-semibold text-white">What they said</p>
                    <p className="mt-2 text-[14px] leading-snug text-white/85">{item.said}</p>
                    <p className="mt-4 text-[16px] font-semibold text-white">What the record shows</p>
                    <p className="mt-2 text-[14px] leading-snug text-white/85">{item.record}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.sources.map((source) => (
                        <button
                          key={source.href}
                          type="button"
                          onClick={() => setNewsSource(source.href)}
                          className="w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-3 py-1 text-[12px] font-semibold text-white"
                        >
                          {source.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {newsMethod && (
                  <MethodDetail
                    item={{
                      name: newsMethod,
                      info: newsMethod,
                      evidence: (newsEvidence.methods.find((item) => item.name === newsMethod)?.cases ?? []).map((item) => ({
                        label: item.label,
                      })),
                    }}
                    onOpen={(label) => {
                      setNewsSource(null);
                      setNewsCase(label);
                    }}
                  />
                )}
                <div className="mt-8 grid w-full grid-cols-2 gap-x-8 gap-y-1">
                  {newsEvidence.methods.map((item) => (
                    <div key={item.name} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setNewsSource(null);
                          setNewsCase(null);
                          setNewsMethod(item.name);
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
              </>
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
        {layer === "types" && deception ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24">
            <button
              type="button"
              onClick={() => {
                if (spot) {
                  setSpot(null);
                  return;
                }
                setDeception(null);
              }}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              {spot === "cable" ? "Cable news" : spot === "trump" ? "Trump TV" : spot === "podcasts" ? "Podcasts" : spot === "cspan" ? "C-SPAN" : DECEPTION.find((item) => item.id === deception)?.title}
            </button>
            {spot === "trump" ? (
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
        ) : layer === "types" ? (
          <div className="flex flex-col items-center px-6 pt-16">
            <button
              type="button"
              onClick={() => {
                setDeception(null);
                setLayer("fake");
              }}
              className="border-0 bg-transparent p-0 text-[15px] font-semibold tracking-wide text-white"
            >
              {LAYERS[layer].title}
            </button>
            <div className="mt-10 flex max-w-5xl flex-wrap items-end justify-center gap-8">
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
        ) : null}
        <Link
          to="/"
          className="fixed top-5 left-14 z-20 rounded-full border border-white/35 bg-[#070b12]/80 px-3 py-1 text-[12px] leading-none font-semibold text-white"
        >
          Back
        </Link>
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
                  return;
                }
                if (layer === "mechanics" && method) {
                  setMethod(null);
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
                if (newsMethod) {
                  setNewsMethod(null);
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
