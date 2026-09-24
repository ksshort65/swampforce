import { Fragment, useState, type ReactNode } from "react";
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

function oneLine(text: string, max = 140) {
  const one = text.split(/(?<=\.)\s+/)[0] ?? text;
  return one.length > max ? `${one.slice(0, max - 1)}…` : one;
}

function urlsIn(text: string) {
  const found = text.match(/https?:\/\/[^\s)]+/g) ?? [];
  return [...new Set(found.map((u) => u.replace(/[.,;]+$/, "")))];
}

function linkify(text: string): ReactNode[] {
  const re = /https?:\/\/[^\s)]+/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const href = m[0].replace(/[.,;]+$/, "");
    nodes.push(
      <a key={`${href}-${i++}`} href={href} target="_blank" rel="noreferrer" className="mt-2 block underline decoration-white/40 underline-offset-2">
        {href.replace(/^https?:\/\//, "")}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const EXTRA: Record<string, { label: string; href: string }[]> = {
  "Check your rolls": [
    { label: "Harris, Detroit, September 22, 2026", href: "https://townhall.com/news/amy-curtis/2026/09/23/kamala-harris-removing-ineligible-voters-is-cheating-n2683440" },
    { label: "The statute that requires the rolls to be cleaned", href: "https://www.law.cornell.edu/uscode/text/52/20507" },
    { label: "New Jersey, the noncitizen additions", href: "https://www.nj.gov/governor/news/2026/20260721a.shtml" },
    { label: "The cumulative tally, not 30,000 added that day", href: "https://thedailyrecord.com/2026/09/23/states-mistakenly-added-noncitizens-to-voter-rolls-errors/" },
  ],
  Lynching: [
    { label: "Pressley and 59 colleagues, September 8, 2026", href: "https://admin-pressley.house.gov/2026/09/10/breaking-pressley-leads-nearly-60-lawmakers-demanding-investigation-into-black-people-found-hanging-invokes-legacy-of-lynching-in-america/" },
    { label: "Fortune, ruled a homicide", href: "https://apnews.com/article/tasia-fortune-mississippi-hanging-arrest-4aa7ada8208008fea580369ede0eef37" },
    { label: "Reed, ruled a suicide", href: "https://www.clarionledger.com/story/news/2026/09/11/man-arrested-in-tasia-fortune-hanging-death-in-jackson-ms-jpd-police-chief-says/91284884007/" },
  ],
  "Clear and present danger": [
    { label: "Schiff, December 15, 2019", href: "https://www.bbc.com/news/world-us-canada-50802150" },
    { label: "Pelosi, January 13, 2021", href: "https://www.c-span.org/clip/us-house-of-representatives/speaker-pelosi-d-ca-on-impeachment-of-president-trump/4937259" },
    { label: "Brandenburg v. Ohio", href: "https://tile.loc.gov/storage-services/service/ll/usrep/usrep395/usrep395444/usrep395444.pdf" },
  ],
  "The press pass": [
    { label: "The complaint", href: "https://variety.com/wp-content/uploads/2026/09/CNN-MS-NOW-Politico-vs.-Trump-et-al.pdf" },
    { label: "The 14-day order", href: "https://www.courtlistener.com/docket/74823502/24/cable-news-network-inc-v-trump/" },
    { label: "Acosta, November 2018", href: "https://www.cnn.com/2018/11/19/media/cnn-acosta-emergency-hearing" },
    { label: "Obama staff, skip Fox, 2009", href: "https://www.judicialwatch.org/documents-show-obama-white-house-attacked-excluded-fox-news-channel/" },
    { label: "Rosen, 2013", href: "https://www.latimes.com/nation/politics/politicsnow/la-pn-justice-department-journalist-investigations-20130712-story.html" },
    { label: "Biden hard-pass count, 2023", href: "https://www.politico.com/newsletters/west-wing-playbook/2023/08/02/simons-no-longer-got-a-hard-pass-00109526" },
    { label: "This month’s pool ban", href: "https://www.nytimes.com/2026/09/23/business/media/fox-trump-press-pool-ban.html" },
    { label: "Obama, unimaginable, September 19, 2026", href: "https://www.independent.co.uk/news/world/americas/us-politics/obama-criticize-trump-media-ban-b3052936.html" },
    { label: "Garcia, Schumer, Raskin, Warren, Booker, Sanders", href: "https://oversightdemocrats.house.gov/news/press-releases/ranking-member-robert-garcia-demands-answers-after-trump-bans-free-press-from-white-house" },
  ],
};

type Cell = "who" | "claim" | "truth";
type Bullet = { text: string; href: string; group?: string };

const BALLROOM: Record<Cell, { head: string; items: Bullet[] }> = {
  who: {
    head: "The date and the name. Not the story.",
    items: [
      { text: "December 12, 2025 — National Trust for Historic Preservation. The lawsuit.", href: "https://storage.courtlistener.com/recap/gov.uscourts.dcd.287645/gov.uscourts.dcd.287645.1.0_4.pdf" },
      { text: "May 11, 2026 — Chuck Schumer. Dear colleague letter.", href: "https://www.democrats.senate.gov/newsroom/press-releases/in-dear-colleague-letter-leader-schumer-vows-senate-democrats-will-fight-ballroom-republicans-pushing-for-trumps-vanity-projects-and-rogue-ice-operation-instead-of-helping-families-facing-gop-affordability-crisis" },
      { text: "May 11, 2026 — Chuck Schumer. Senate floor.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-floor-remarks-denouncing-senate-republicans-reconciliation-bill-that-spends-1-billion-of-taxpayer-money-on-trumps-gilded-ballroom-without-addressing-the-rising-cost-of-living" },
      { text: "May 16, 2026 — Chuck Schumer.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-and-senate-democrats-blow-up-gops-first-attempt-to-make-taxpayers-fund-trumps-billion-dollar-ballroom" },
      { text: "June 23, 2026 — Patty Murray and Chris Murphy.", href: "https://www.murray.senate.gov/murray-murphy-urge-watchdog-to-investigate-trump-admins-use-of-taxpayer-dollars-for-trumps-ballroom/" },
      { text: "August 13, 2026 — Schumer, Merkley, Durbin, Whitehouse, Heinrich, Murray, Reed, and Peters.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-senator-jeff-merkley-and-top-senate-democrats-with-jurisdiction-over-trumps-gilded-ballroom-boondoggle-call-on-watchdog-to-conduct-a-full-audit-of-the-project" },
      { text: "September 23, 2026 — the design-is-the-threat caption. New York Magazine.", href: "https://nymag.com/intelligencer/article/trump-shoddy-ballroom-design-building-codes-safety-threat.html" },
      { text: "The networks. No office has published a count of every one. The negative coverage that can be opened has run from the July 31, 2025 announcement through September 23, 2026. Fourteen months. It has not stopped.", href: "https://www.whitehouse.gov/briefings-statements/2025/07/the-white-house-announces-white-house-ballroom-construction-to-begin/" },
      { text: "March 29, 2026 — New York Times.", href: "https://www.nytimes.com/interactive/2026/03/29/upshot/white-house-ballroom.html" },
      { text: "August 18, 2026 — New York Times.", href: "https://www.nytimes.com/2026/08/18/us/politics/trump-ballroom-construction.html" },
      { text: "August 31, 2026 — New York Times.", href: "https://www.nytimes.com/2026/08/31/us/politics/supreme-court-trump-ballroom.html" },
      { text: "January 1, 2026 — Washington Post.", href: "https://www.washingtonpost.com/politics/2025/12/31/trump-ballroom-timeline-reviews/" },
      { text: "September 5, 2026 — The Atlantic.", href: "https://www.theatlantic.com/culture/2026/09/trump-ballroom-arch-rush/688523/" },
    ],
  },
  claim: {
    head: "Fourteen months, from the July 31, 2025 announcement through September 23, 2026. Still running. No official page counts every network.",
    items: [
      { group: "They cut the fact out.", text: "A vanity ballroom. Let them eat cake. Americans do not need one. The security is not in the sentence. — Schumer, May 11, 2026.", href: "https://www.democrats.senate.gov/newsroom/press-releases/in-dear-colleague-letter-leader-schumer-vows-senate-democrats-will-fight-ballroom-republicans-pushing-for-trumps-vanity-projects-and-rogue-ice-operation-instead-of-helping-families-facing-gop-affordability-crisis" },
      { group: "They cut the fact out.", text: "A gilded palace. Americans do not want it and should not pay. The donor announcement is not in the sentence. — Schumer, May 16, 2026.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-and-senate-democrats-blow-up-gops-first-attempt-to-make-taxpayers-fund-trumps-billion-dollar-ballroom" },
      { group: "They cut the fact out.", text: "The construction is unlawful and should be stopped. The complaint leaves out the later order. The Court did not rule the project illegal. — National Trust, December 12, 2025.", href: "https://storage.courtlistener.com/recap/gov.uscourts.dcd.287645/gov.uscourts.dcd.287645.1.0_4.pdf" },
      { group: "They denied the file.", text: "It has nothing to do with security. It is ego. — Schumer, Senate floor, May 11, 2026.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-floor-remarks-denouncing-senate-republicans-reconciliation-bill-that-spends-1-billion-of-taxpayer-money-on-trumps-gilded-ballroom-without-addressing-the-rising-cost-of-living" },
      { group: "They denied the file.", text: "The private-funding claim is a lie. — Schumer, Merkley, and six other senators, August 13, 2026.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-senator-jeff-merkley-and-top-senate-democrats-with-jurisdiction-over-trumps-gilded-ballroom-boondoggle-call-on-watchdog-to-conduct-a-full-audit-of-the-project" },
      { group: "They stated a fact the record does not show.", text: "Taxpayers are being charged $1 billion for the ballroom. — Schumer, Senate floor, May 11, 2026.", href: "https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-floor-remarks-denouncing-senate-republicans-reconciliation-bill-that-spends-1-billion-of-taxpayer-money-on-trumps-gilded-ballroom-without-addressing-the-rising-cost-of-living" },
      { group: "They stated a fact the record does not show.", text: "Taxpayer money was diverted to build it. The letter asks for an investigation. It is not a finding. — Murray and Murphy, June 23, 2026.", href: "https://www.murray.senate.gov/murray-murphy-urge-watchdog-to-investigate-trump-admins-use-of-taxpayer-dollars-for-trumps-ballroom/" },
      { group: "They moved his word.", text: "The design is the national security threat. He said the building is the security. They put the word on the design. — September 23, 2026.", href: "https://nymag.com/intelligencer/article/trump-shoddy-ballroom-design-building-codes-safety-threat.html" },
    ],
  },
  truth: {
    head: "",
    items: [
      { text: "The ballroom is paid for by the president and private donors. The White House said so when construction was announced.", href: "https://www.whitehouse.gov/briefings-statements/2025/07/the-white-house-announces-white-house-ballroom-construction-to-begin/" },
      { text: "1902. Theodore Roosevelt built the West Wing and removed Jefferson’s greenhouses.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1909. William Howard Taft built the first Oval Office.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1927. Calvin Coolidge rebuilt the upper floors and the attic.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1934 and 1942. Franklin Roosevelt added a floor and a pool to the West Wing, moved the Oval Office, and built the East Wing.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1948 to 1952. Harry Truman gutted the interior, kept the outer walls, and rebuilt the house. The family lived at Blair House.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1962. John F. Kennedy built the modern Rose Garden.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1970 and 1973. Richard Nixon covered the indoor pool to make the press room, then added a bowling alley.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "1975. Gerald Ford built an outdoor pool. Private donations paid for it.", href: "https://www.whitehousehistory.org/a-pool-for-the-president" },
      { text: "2009. Barack Obama turned the tennis court into a basketball court and planted the kitchen garden.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "2020. Donald Trump built the tennis pavilion.", href: "https://www.whitehouse.gov/releases/2025/10/white-house-ballroom-proud-presidential-legacy/" },
      { text: "A complaint is not this campaign. The White House Historical Association notes objections to the East Wing, Truman’s rebuild, and Nixon’s press room. Those projects were finished. None of them is fourteen months of captions plus a lawsuit to stop a security build.", href: "https://www.whitehousehistory.org/an-ever-changing-white-house" },
      { text: "It is a security build. Two attempts to kill him are why a tent is not a plan. The layout is not for a caption. Publishing the layout is the breach.", href: "https://www.whitehouse.gov/about/" },
      { text: "July 13, 2024, Butler, Pennsylvania. Thomas Crooks fired. Corey Comperatore was killed.", href: "https://www.fbi.gov/news/press-releases/fbi-releases-photographs-in-connection-with-attempted-assassination-of-former-president-trump" },
      { text: "September 15, 2024, West Palm Beach. Ryan Wesley Routh waited with a rifle. A jury convicted him. On February 4, 2026, he was sentenced to life.", href: "https://www.justice.gov/opa/pr/ryan-wesley-routh-sentenced-life-prison-attempted-assassination-president-donald-j-trump-and" },
      { text: "The court allowed the work that is strictly necessary for the safety of the White House and the president. That order is Document 61.", href: "https://storage.courtlistener.com/recap/gov.uscourts.dcd.287645/gov.uscourts.dcd.287645.61.0.pdf" },
      { text: "The lawsuit to stop that work is the obstruction. Same method, twelve years running: a case, a caption, then the country is told the caption is the fact.", href: "https://www.courtlistener.com/docket/72028010/national-trust-for-historic-preservation-in-the-united-states-v-national/" },
      { text: "The building is still going up. On August 31, 2026, the Supreme Court allowed construction to continue, 5–4. It did not rule the project illegal. The administration told the Court the project was 65 percent complete on August 13. What Congress has left is the fight: the lawsuit, the audit demand, and the caption. That is the control.", href: "https://www.scotusblog.com/2026/08/supreme-court-allows-construction-on-white-house-ballroom-to-continue/" },
    ],
  },
};

function TapeTable({ frames }: { frames: Frame[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="mt-8">
      <p className="mb-3 text-base leading-relaxed text-fg">
        One chart. Open a column. The name is who said it. Every link leaves this journal for the official record.
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
            {frames.map((f) => {
              const ballroom = f.tag === "The ballroom";
              const cell = (name: Cell) => (ballroom ? `${f.tag}:${name}` : f.tag);
              const on = (name: Cell) => open === cell(name);
              const any = ballroom ? open?.startsWith(`${f.tag}:`) : open === f.tag;
              const claims = f.they.split("||").map((s) => s.trim()).filter(Boolean);
              const who = ballroom ? "Schumer, Merkley, Murray, Murphy. May 11 to September 23, 2026. Open for each date." : f.ran?.trim() || "The file names them.";
              const links = [
                ...(EXTRA[f.tag] ?? []),
                ...urlsIn(`${f.tape}\n${f.href ?? ""}`)
                  .filter((href) => !(EXTRA[f.tag] ?? []).some((item) => item.href === href))
                  .map((href) => ({ label: "The record", href })),
              ];
              const pick = ballroom && open?.startsWith(`${f.tag}:`) ? BALLROOM[open.slice(f.tag.length + 1) as Cell] : null;
              return (
                <Fragment key={f.tag}>
                  <tr className="border-t border-white/10">
                    <td className="border-r border-white/10 bg-[#161412] px-3 py-3 align-top text-sm leading-snug text-neutral-100">
                      <button type="button" onClick={() => setOpen(on("who") ? null : cell("who"))} className="text-left">
                        <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">{f.tag}</span>
                        <span className="block text-blue-300">{who}</span>
                      </button>
                    </td>
                    <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm font-semibold leading-snug text-red-50">
                      <button type="button" onClick={() => setOpen(on("claim") ? null : cell("claim"))} className="text-left text-blue-200">
                        {(ballroom ? ["Vanity. Cake. A palace. Taxpayers. A boondoggle. The design is the threat. The lawsuit."] : claims).map((claim) => (
                          <span key={claim} className="mb-2 block last:mb-0">{claim}</span>
                        ))}
                      </button>
                    </td>
                    <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug text-blue-50">
                      <button type="button" onClick={() => setOpen(on("truth") ? null : cell("truth"))} className="text-left text-blue-200">
                        {ballroom ? "Privately paid. Built for security after two attempts to kill him. Open the list." : oneLine(f.tape, 180)}
                      </button>
                    </td>
                  </tr>
                  {any && pick ? (
                    <tr className="border-t border-white/10">
                      <td colSpan={3} className="bg-white px-4 py-4 text-neutral-900">
                        {pick.head ? <p className="text-base font-semibold leading-relaxed">{pick.head}</p> : null}
                        <ul className={pick.head ? "mt-3 list-disc space-y-2 pl-5" : "list-disc space-y-2 pl-5"}>
                          {pick.items.map((item, i) => {
                            const showGroup = item.group && item.group !== pick.items[i - 1]?.group;
                            return (
                              <li key={item.href + item.text} className={showGroup ? "mt-4 list-none" : undefined}>
                                {showGroup ? <p className="mb-1 font-semibold text-neutral-900">{item.group}</p> : null}
                                <a href={item.href} target="_blank" rel="noreferrer" className="text-blue-700">
                                  {item.text}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                  {any && !pick ? (
                    <tr className="border-t border-white/10">
                      <td colSpan={3} className="bg-white px-4 py-4 text-neutral-900">
                        <p className="font-display text-sm font-bold tracking-[0.14em] text-red-800 uppercase">What they said</p>
                        <ul className="mt-2 space-y-2">
                          {claims.map((claim) => (
                            <li key={claim} className="text-base leading-relaxed">{claim}</li>
                          ))}
                        </ul>
                        <p className="mt-5 font-display text-sm font-bold tracking-[0.14em] text-blue-900 uppercase">The file</p>
                        <p className="mt-2 text-base leading-relaxed">{linkify(f.tape)}</p>
                        {f.tag === "Bloodbath" ? <div className="mt-4"><BloodbathDetail /></div> : null}
                        {links.length ? (
                          <>
                            <p className="mt-5 font-display text-sm font-bold tracking-[0.14em] text-blue-900 uppercase">The official record</p>
                            <ul className="mt-2 space-y-2">
                              {links.map((link) => (
                                <li key={link.href + link.label}>
                                  <a href={link.href} target="_blank" rel="noreferrer" className="text-base text-blue-700">
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
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
  const first = ["The ballroom", "The press pass", "The Iran war"];
  const ordered = [
    ...first.map((tag) => frames.find((f) => f.tag === tag)).filter((f): f is Frame => Boolean(f)),
    ...frames.filter((f) => !first.includes(f.tag)),
  ];
  return (
    <>
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
          kicker: f.they.includes("||") || showClaim ? f.tag : undefined,
          name: f.they.includes("||")
            ? f.they.split("||").map((s) => s.trim()).join(" · ")
            : showClaim
              ? f.they
              : f.tag,
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
