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

const CLIPPED = new Set([
  "Bloodbath",
  "Dictator",
  "Fine people",
  "The virus is a hoax",
  "All Mexicans are rapists",
  "Animals",
  "He never said peacefully",
  "Many sides",
  "No condemnation",
  "We love you",
  "187 minutes",
  "David Duke",
  "Another chance",
  "Just a ballroom",
  "They made it necessary",
  "Covington",
  "The escort clip",
]);

const CHANGED = new Set([
  "Bleach",
  "Inject light",
  "Slow the testing",
  "Muslim ban",
  "Schiff's transcript",
  "Hang Mike Pence",
  "Stand by",
  "Let them die",
  "He quoted Hitler",
  "National abortion ban",
  "Ban the pill",
  "Insurrection",
  "Impeached for treason",
  "Seventeen agencies",
  "Liable for rape",
  "Convicted of all of it",
  "No exoneration",
  "Ten crimes",
  "He confessed",
  "Flynn the agent",
  "Manafort colluded",
  "Stone and WikiLeaks",
  "Concentration camps",
  "Don't say gay",
  "Horse paste",
  "Zero inflation",
  "He fired the pandemic team",
  "Lost children",
  "ICE is terror",
  "Enemy within",
  "Liz Cheney",
]);

function bucket(tag: string) {
  if (CLIPPED.has(tag)) return "clip";
  if (CHANGED.has(tag)) return "changed";
  return "lie";
}

function firstLine(text: string) {
  const one = text.split(/(?<=\.)\s+/)[0] ?? text;
  return one.length > 220 ? `${one.slice(0, 217)}…` : one;
}

function TapeTable({ frames }: { frames: Frame[] }) {
  const groups = [
    { key: "clip", title: "Clipping a tape short" },
    { key: "changed", title: "Changing his words" },
    { key: "lie", title: "Outright lies" },
  ] as const;
  return (
    <section className="mt-8">
      <p className="mb-3 text-base leading-relaxed text-fg">
        One chart. Choose a block in the truth column and it opens the proof.
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

function GroupRows({ title, frames }: { title: string; frames: Frame[] }) {
  return (
    <>
      <tr className="border-t border-white/10">
        <td colSpan={3} className="bg-black px-3 py-2 font-display text-sm font-bold tracking-[0.14em] text-white uppercase">
          {title}
        </td>
      </tr>
      {frames.map((f) => {
        const who = firstLine(f.ran || f.tag);
        const claim = firstLine(f.they);
        const truth = f.href ? (
          <a href={f.href} target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-2">
            {fileLine(f.tape)}
          </a>
        ) : (
          fileLine(f.tape)
        );
        return (
          <tr key={f.tag} className="border-t border-white/10">
            <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
              <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">{f.tag}</span>
              {who}
            </td>
            <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
              {claim}
            </td>
            <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">{truth}</td>
          </tr>
        );
      })}
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
