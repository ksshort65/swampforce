import type { Frame } from "@/lib/content";
import { InteractiveChart, KeptRead } from "@/components/interactive-chart";

function BloodbathDetail() {
  return (
    <>
      <p className="font-display text-sm font-bold tracking-[0.14em] text-red-800 uppercase">The claim</p>
      <ul className="mt-3 space-y-3 text-base leading-relaxed">
        <li>
          CNN, Kit Maher and Alayna Treene, March 16, 2024, 6:52 p.m. Eastern. This is the first timed headline. It said the bloodbath was if he loses the election.{" "}
          <a className="text-blue-800 underline" href="https://www.cnn.com/politics/live-news/2024-election-news-03-16-24" target="_blank" rel="noreferrer">CNN live file</a>
          . No minute-count of airtime was published.
        </li>
        <li>
          NBC News, Emma Barnett and Jillian Frankel, March 16, 2024, 9:37 p.m. Eastern. Headline: there will be a bloodbath if he loses the election. The headline is still that sentence.{" "}
          <a className="text-blue-800 underline" href="https://www.nbcnews.com/politics/donald-trump/trump-bloodbath-loses-election-2024-rcna143746" target="_blank" rel="noreferrer">NBC News</a>
        </li>
        <li>
          The New York Times, March 16, 2024. Headline: he predicts a blood bath if he loses. The cars are not in the headline.{" "}
          <a className="text-blue-800 underline" href="https://www.nytimes.com/2024/03/16/us/politics/trump-speech-ohio.html" target="_blank" rel="noreferrer">New York Times</a>
        </li>
        <li>
          James Singer, spokesman for the Biden-Harris campaign, the night of March 16, 2024. He called it a threat of political violence and said, “He wants another January 6.” That statement is printed in the NBC story above.
        </li>
        <li>
          Joe Biden, March 17, 2024. “It’s clear this guy wants another January 6.” His post sits on a clip that starts at the bloodbath line and leaves the cars out.{" "}
          <a className="text-blue-800 underline" href="https://x.com/JoeBiden/status/1769454648946049261" target="_blank" rel="noreferrer">Joe Biden, March 17, 2024</a>
        </li>
        <li>
          Joe Biden, July 15, 2024, 121 days later. “He talks about, there’ll be a bloodbath if he loses.”{" "}
          <a className="text-blue-800 underline" href="https://x.com/HQNewsNow/status/1812964082430980276" target="_blank" rel="noreferrer">The July 15 clip</a>
        </li>
      </ul>
      <p className="mt-6 font-display text-sm font-bold tracking-[0.14em] text-blue-900 uppercase">The truth</p>
      <p className="mt-3 text-base leading-relaxed">
        He said the word twice, both in the same stretch, on March 16, 2024, in Vandalia, Ohio. No second occasion was located. At 29:45 in the Roll Call recording: “Now, if I don’t get elected, it’s going to be a bloodbath for the whole — that’s going to be the least of it. It’s going to be a bloodbath for the country. That’ll be the least of it. But they’re not going to sell those cars.” The sentence before it is a 100 percent tariff on Chinese cars built in Mexico.
      </p>
      <ul className="mt-3 space-y-2 text-base leading-relaxed">
        <li>
          <a className="text-blue-800 underline" href="https://www.youtube.com/watch?v=f57dRZMS0PQ&t=1785s" target="_blank" rel="noreferrer">Roll Call recording — he starts at 29:45</a>
        </li>
        <li>
          <a className="text-blue-800 underline" href="https://www.c-span.org/clip/public-affairs-event/user-clip-trump-says-bloodbath/5110570" target="_blank" rel="noreferrer">C-SPAN clip — opens on the line</a>
        </li>
        <li>
          <a className="text-blue-800 underline" href="https://www.c-span.org/program/public-affairs-event/former-president-trump-campaigns-for-bernie-moreno/639757" target="_blank" rel="noreferrer">C-SPAN full program, 1 hour 35 minutes, March 16, 2024</a>
        </li>
      </ul>
    </>
  );
}
function fileLine(text: string) {
  const two = text.split(/(?<=\.)\s+/).slice(0, 2).join(" ");
  return two.length > 320 ? `${two.slice(0, 317)}…` : two;
}

const POLITICIANS = new Set([
  "War of choice",
  "Illegal war",
  "Russia collusion",
  "Schiff’s transcript",
  "Whips",
  "Bend the knee",
  "Laziest Congress",
  "ICE is terror",
  "The war raised the gallon",
  "Just a ballroom",
  "They made it necessary",
  "Sharp as a tack",
  "Seventeen agencies",
  "Shoot them in the legs",
  "Clear and present danger",
  "Domestic terrorists",
  "Lynching",
  "They should not let up",
  "Soldiers of Christ",
  "Most secure election",
  "Check your rolls",
]);

const JOURNALISTS = new Set([
  "Suckers and losers",
  "Russian bounties",
  "The crying girl",
  "Hydroxychloroquine kills",
  "Pee tape",
  "The dossier",
  "Covington",
  "He pays no taxes",
  "The laptop",
  "Nothing on the laptop",
]);

const CLIPPED = new Set([
  "Bloodbath",
  "Fine people",
  "Dictator",
  "Bleach",
  "The virus is a hoax",
  "Slow the testing",
  "All Mexicans are rapists",
  "Muslim ban",
  "Kids in cages",
  "Animals",
  "He never said peacefully",
  "Schiff’s transcript",
  "No condemnation",
  "Many sides",
  "Stand by",
  "Inject light",
  "Hang Mike Pence",
  "187 minutes",
  "We love you",
  "Suckers and losers",
  "Bible upside down",
  "Mostly peaceful",
]);

function bucket(tag: string) {
  if (CLIPPED.has(tag)) return "clipped";
  if (POLITICIANS.has(tag)) return "politician";
  if (JOURNALISTS.has(tag)) return "journalist";
  return "network";
}

function oneLine(text: string, max = 140) {
  const one = text.split(/(?<=\.)\s+/)[0] ?? text;
  return one.length > max ? `${one.slice(0, max - 1)}…` : one;
}

function TapeTable({ frames }: { frames: Frame[] }) {
  const groups = [
    { key: "clipped", title: "Tape cut short" },
    { key: "politician", title: "Politicians" },
    { key: "network", title: "Networks" },
    { key: "journalist", title: "Journalists" },
  ] as const;
  return (
    <section className="mt-8">
      <p className="mb-3 text-base leading-relaxed text-fg">
        One chart. The truth opens the official record, outside this journal.
      </p>
      <div className="overflow-x-auto rounded-md border border-neutral-800">
        <table className="w-full min-w-[64rem] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[28%] border-r border-white/10 bg-[#1c1917] px-3 py-3 font-display text-sm font-bold tracking-[0.12em] text-neutral-100 uppercase">
                Date and who
              </th>
              <th className="w-[32%] border-r border-white/10 bg-[#3a1214] px-3 py-3 font-display text-sm font-bold tracking-[0.12em] text-red-100 uppercase">
                The claim
              </th>
              <th className="bg-[#10233f] px-3 py-3 font-display text-sm font-bold tracking-[0.12em] text-blue-100 uppercase">
                The truth
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const rows = frames.filter((f) => bucket(f.tag) === group.key);
              if (!rows.length) return null;
              if (group.key === "clipped") {
                rows.sort((a, b) => (a.tag === "Bloodbath" ? -1 : b.tag === "Bloodbath" ? 1 : 0));
              }
              return (
                <GroupRows key={group.key} title={group.title} frames={rows} />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChartRow({ f }: { f: Frame }) {
  if (f.tag === "Only under Trump") {
    return (
      <tr className="border-t border-white/10">
        <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
          <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">Only under Trump</span>
          <span className="block">2018, 2009, 2013, 2023, and this month. The networks.</span>
        </td>
        <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
          <a href="https://www.cnn.com/2018/11/19/media/cnn-acosta-emergency-hearing" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            A revoked pass is an attack on a free press, and it only happens under Trump.
          </a>
        </td>
        <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">
          <a href="https://www.cnn.com/2018/11/19/media/cnn-acosta-emergency-hearing" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            November 7, 2018. Acosta’s pass was pulled, then returned on November 19 after CNN sued.
          </a>
          <a href="https://www.judicialwatch.org/documents-show-obama-white-house-attacked-excluded-fox-news-channel/" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            October 2009. Obama’s staff wrote “skip Fox.” The other networks refused to film until Fox was in.
          </a>
          <a href="https://www.latimes.com/nation/politics/politicsnow/la-pn-justice-department-journalist-investigations-20130712-story.html" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            May 2013. Obama’s Justice Department called a Fox reporter a possible co-conspirator to read his email.
          </a>
          <a href="https://www.politico.com/newsletters/west-wing-playbook/2023/08/02/simons-no-longer-got-a-hard-pass-00109526" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            2023. Under Biden, hard passes fell from 1,417 to 975. Day passes stayed. One applicant was denied.
          </a>
          <a href="https://www.nytimes.com/2026/09/23/business/media/fox-trump-press-pool-ban.html" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            This month. CNN, Politico, and MS NOW were barred. Fox refused to film until CNN was back.
          </a>
        </td>
      </tr>
    );
  }
  if (f.tag === "Check your rolls") {
    return (
      <tr className="border-t border-white/10">
        <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
          <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">Check your rolls</span>
          <span className="block">September 22, 2026. Kamala Harris. Detroit NAACP.</span>
        </td>
        <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
          <a href="https://townhall.com/news/amy-curtis/2026/09/23/kamala-harris-removing-ineligible-voters-is-cheating-n2683440" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            They are cheating by purging voter rolls. Check that you have not been purged.
          </a>
        </td>
        <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">
          <a href="https://www.law.cornell.edu/uscode/text/52/20507" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            Federal law requires the rolls to drop ineligible voters.
          </a>
          <a href="https://www.nj.gov/governor/news/2026/20260721a.shtml" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            New Jersey added about 6,600 people who had said they were not citizens.
          </a>
          <a href="https://thedailyrecord.com/2026/09/23/states-mistakenly-added-noncitizens-to-voter-rolls-errors/" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            A tally published this day put those mistaken additions above 30,000 since 2000. Not 30,000 added today.
          </a>
        </td>
      </tr>
    );
  }
  if (f.tag === "Lynching") {
    return (
      <tr className="border-t border-white/10">
        <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
          <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">Lynching</span>
          <span className="block">September 8, 2026. Ayanna Pressley and 59 House Democrats.</span>
        </td>
        <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
          <a href="https://admin-pressley.house.gov/2026/09/10/breaking-pressley-leads-nearly-60-lawmakers-demanding-investigation-into-black-people-found-hanging-invokes-legacy-of-lynching-in-america/" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            A national crisis of modern-day lynchings.
          </a>
        </td>
        <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">
          <a href="https://apnews.com/article/tasia-fortune-mississippi-hanging-arrest-4aa7ada8208008fea580369ede0eef37" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            Fortune was ruled a homicide. Police arrested a man associated with her.
          </a>
          <a href="https://www.clarionledger.com/story/news/2026/09/11/man-arrested-in-tasia-fortune-hanging-death-in-jackson-ms-jpd-police-chief-says/91284884007/" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            Reed was ruled a suicide. No foul play.
          </a>
        </td>
      </tr>
    );
  }
  if (f.tag === "Clear and present danger") {
    return (
      <tr className="border-t border-white/10">
        <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
          <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">Clear and present danger</span>
          <span className="block">December 15, 2019. January 13, 2021. Multiple politicians.</span>
          <a href="https://www.bbc.com/news/world-us-canada-50802150" target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
            Adam Schiff, December 15, 2019
          </a>
          <a href="https://www.c-span.org/clip/us-house-of-representatives/speaker-pelosi-d-ca-on-impeachment-of-president-trump/4937259" target="_blank" rel="noreferrer" className="mt-1 block underline decoration-white/40 underline-offset-2">
            Nancy Pelosi, January 13, 2021
          </a>
        </td>
        <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
          <a href="https://www.c-span.org/clip/us-house-of-representatives/speaker-pelosi-d-ca-on-impeachment-of-president-trump/4937259" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            He is a clear and present danger to the nation.
          </a>
        </td>
        <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">
          <a href="https://tile.loc.gov/storage-services/service/ll/usrep/usrep395/usrep395444/usrep395444.pdf" target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            A 1969 speech test. Not a license to break the law.
          </a>
        </td>
      </tr>
    );
  }
  const who = oneLine(f.ran || f.tag, 120);
  const claim = oneLine(f.they, 140);
  const truthText = oneLine(f.tape, 140);
  return (
    <tr className="border-t border-white/10">
      <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
        <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">{f.tag}</span>
        {f.href ? (
          <a href={f.href} target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            {who}
          </a>
        ) : (
          who
        )}
      </td>
      <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
        {claim}
      </td>
      <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">
        {f.href ? (
          <a href={f.href} target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            {truthText}
          </a>
        ) : (
          truthText
        )}
      </td>
    </tr>
  );
}
function GroupRows({ title, frames }: { title: string; frames: Frame[] }) {
  return (
    <>
      <tr className="border-t border-white/10">
        <td colSpan={3} className="bg-black px-3 py-2 font-display text-sm font-bold tracking-[0.14em] text-white uppercase">
          {title}
        </td>
      </tr>
      {frames.map((f) => (
        <ChartRow key={f.tag} f={f} />
      ))}
    </>
  );
}

export function NarrativeFrames({
  frames,
  dek = "The claim is the row. The short version is a few lines. The record opens the document.",
  heading = "The caption · the file",
  tapeTable = false,
  showClaim = false,
}: {
  frames: Frame[];
  dek?: string;
  left?: string;
  right?: string;
  heading?: string;
  tapeTable?: boolean;
  showClaim?: boolean;
}) {
  const iran = frames.find((f) => f.tag === "War of choice");
  const first = ["They made it necessary", "Just a ballroom"];
  const ordered = [
    ...first.map((tag) => frames.find((f) => f.tag === tag)).filter((f): f is Frame => Boolean(f)),
    ...frames.filter((f) => !first.includes(f.tag)),
  ];
  return (
    <>
      {iran ? (
        <figure className="mt-12 border-t border-border px-4 py-5">
          <img
            src="/images/chart-iran.jpg"
            alt="Uranium enrichment. Power-plant fuel is about 5 percent. The 2015 cap was 3.67 percent. Iran was at 60 percent. A bomb is about 90 percent."
            className="h-auto w-full rounded-md border border-border"
          />
          <figcaption className="mt-2 text-[12px] leading-relaxed text-muted">
            <a
              href="https://www.iaea.org/sites/default/files/gov2026-50.pdf"
              className="text-sage underline decoration-sage underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              IAEA GOV/2026/50
            </a>
            {" · 440.9 kilograms enriched up to 60 percent, as of June 13, 2025. The slogan under this chart leaves the bar out."}
          </figcaption>
        </figure>
      ) : null}
      {tapeTable ? (
        <TapeTable frames={ordered} />
      ) : (
      <InteractiveChart
        large
        title={heading}
        subtitle={dek}
        rightLabel={showClaim ? "The truth" : "The file"}
        rows={ordered.map((f) => ({
          id: f.tag,
          kicker: showClaim ? f.tag : undefined,
          name: showClaim ? f.they : f.tag,
          line: showClaim ? f.tape : fileLine(f.tape),
          href: showClaim ? undefined : f.href,
          proof: "The record",
          read: showClaim ? (
            f.tag === "Bloodbath" ? (
              <BloodbathDetail />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-[13px] font-semibold text-red-800">The claim</p>
                  <p className="mt-1 text-[15px] leading-relaxed">{f.they}</p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-blue-900">The truth</p>
                  <p className="mt-1 text-[15px] leading-relaxed">{f.tape}</p>
                  {f.href ? (
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-[15px] text-blue-800 underline"
                    >
                      The recording
                    </a>
                  ) : null}
                </div>
              </div>
            )
          ) : (
            <KeptRead
              said={f.they}
              note={f.ran ? `How long it ran: ${f.ran}` : undefined}
              record={f.tape}
              links={f.href ? [{ label: "The record", href: f.href }] : []}
            />
          ),
        }))}
      />
      )}
    </>
  );
}
