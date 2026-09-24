import { Fragment, useEffect, useState, type ReactNode } from "react";
import { frameId } from "@/lib/ledgers";
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
  "Fine people": [
    { label: "The transcript", href: "https://www.politico.com/story/2017/08/15/full-text-trump-comments-white-supremacists-alt-left-transcript-241662" },
  ],
  Bloodbath: [
    { label: "The uncut recording", href: "https://www.c-span.org/clip/public-affairs-event/user-clip-trump-says-bloodbath/5110570" },
    { label: "The rally, at 29:45", href: "https://www.youtube.com/watch?v=f57dRZMS0PQ&t=1785s" },
    { label: "CNN, March 16, 2024, the first headline", href: "https://www.cnn.com/politics/live-news/2024-election-news-03-16-24" },
    { label: "NBC News, March 16, 2024", href: "https://www.nbcnews.com/politics/donald-trump/trump-bloodbath-loses-election-2024-rcna143746" },
    { label: "The New York Times, March 16, 2024", href: "https://www.nytimes.com/2024/03/16/us/politics/trump-speech-ohio.html" },
    { label: "Joe Biden, March 17, 2024", href: "https://x.com/JoeBiden/status/1769454648946049261" },
    { label: "Joe Biden, July 15, 2024", href: "https://x.com/HQNewsNow/status/1812964082430980276" },
  ],
  "Schiff’s transcript": [
    { label: "The floor parody", href: "https://www.c-span.org/video/?c4820134/schiffs-parody" },
    { label: "The call memorandum", href: "https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf" },
  ],
  "He never said peacefully": [
    { label: "The Ellipse, full", href: "https://www.c-span.org/video/?507744-1/president-trump-speaks-save-america-rally" },
    { label: "The BBC splice set against the original", href: "https://www.youtube.com/watch?v=TAV5-oun3uM" },
    { label: "The speech text", href: "https://www.npr.org/2021/02/10/966396848/read-trumps-jan-6-speech-a-key-part-of-impeachment-trial" },
  ],
  Kidnapped: [
    { label: "The indictment", href: "https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-narco-terrorism-charges-against-nicolas-maduro-current" },
    { label: "State Department, custody", href: "https://www.state.gov/nicolas-maduro-moros" },
  ],
  Insurrection: [
    { label: "The charge tally", href: "https://www.justice.gov/usao-dc/48-months-jan-6-attack-us-capitol" },
    { label: "H.Res. 24", href: "https://www.congress.gov/bill/117th-congress/house-resolution/24" },
    { label: "18 U.S.C. § 2383", href: "https://www.law.cornell.edu/uscode/text/18/2383" },
  ],
  "The escort clip": [
    { label: "The House CCTV channel", href: "https://rumble.com/c/CHASubcommitteeOnOversightRepublicanMajority" },
    { label: "The committee’s release notice", href: "https://cha.house.gov/2024/3/chairman-loudermilk-releases-additional-january-6-2021-uscp-cctv-footage" },
  ],
  "Russia collusion": [
    { label: "Durham", href: "https://www.justice.gov/storage/durhamreport.pdf" },
    { label: "Horowitz, the FISA", href: "https://oig.justice.gov/reports/2019/o1912.pdf" },
    { label: "Mueller, volume 1", href: "https://www.justice.gov/storage/report_volume1.pdf" },
  ],
  "The first impeachment": [
    { label: "The call memorandum", href: "https://trumpwhitehouse.archives.gov/wp-content/uploads/2019/09/Unclassified09.2019.pdf" },
    { label: "H.Res. 755", href: "https://www.congress.gov/bill/116th-congress/house-resolution/755" },
  ],
  "Four dockets": [
    { label: "District of Columbia docket", href: "https://www.courtlistener.com/docket/67656595/united-states-v-trump/" },
    { label: "The indictment", href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf" },
    { label: "The dismissal", href: "https://www.courtlistener.com/docket/67656595/283/united-states-v-trump/" },
    { label: "Florida, dismissed", href: "https://www.courtlistener.com/docket/67490071/672/united-states-v-trump/" },
    { label: "Manhattan indictment", href: "https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf" },
  ],
  "The ballroom": [
    { label: "Schumer, May 11, 2026 — Americans do not need a ballroom", href: "https://www.nydailynews.com/2026/05/11/schumer-battle-trump-white-house-ballroom/" },
    { label: "Schumer, May 12, 2026 — we do not need a damn ballroom", href: "https://www.nbcnews.com/politics/congress/republicans-1-billion-price-tag-trump-white-house-ballroom-project-rcna344721" },
    { label: "Murray, May 6, 2026 — not a golden ballroom", href: "https://www.nydailynews.com/2026/05/06/schumer-democrats-protest-billion-proposal-ballroom-security/" },
    { label: "Jeffries, October 23, 2025 — the ballroom is the priority", href: "https://www.politifact.com/factchecks/2025/oct/24/hakeem-jeffries/democrats-leavitt-priority-ballroom-white-house/" },
    { label: "CNN, July 31, 2025 — a gilded entertaining room", href: "https://www.cnn.com/2025/07/31/politics/white-house-ballroom-construction" },
    { label: "New York Magazine, June 1, 2026 — a fancy party venue", href: "https://nymag.com/intelligencer/article/trump-drone-port-white-house-ballroom-villain-lair.html" },
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
      { group: "They called it a party.", text: "Americans do not need a ballroom. They need relief. Let them eat cake. — Chuck Schumer, letter to Senate Democrats, May 11, 2026. The words “party room” are not in this letter. The ballroom is the thing he said they do not need.", href: "https://www.nydailynews.com/2026/05/11/schumer-battle-trump-white-house-ballroom/" },
      { group: "They called it a party.", text: "We do not need a damn ballroom. — Chuck Schumer, to reporters, May 12, 2026.", href: "https://www.nbcnews.com/politics/congress/republicans-1-billion-price-tag-trump-white-house-ballroom-project-rcna344721" },
      { group: "They called it a party.", text: "Hardworking families want lower costs, not a golden ballroom. — Patty Murray, May 6, 2026.", href: "https://www.nydailynews.com/2026/05/06/schumer-democrats-protest-billion-proposal-ballroom-security/" },
      { group: "They called it a party.", text: "The ballroom is the president’s main priority. — Hakeem Jeffries, October 23, 2025, on a five-second clip. PolitiFact said the question was about White House construction, not the country’s priorities.", href: "https://www.politifact.com/factchecks/2025/oct/24/hakeem-jeffries/democrats-leavitt-priority-ballroom-white-house/" },
      { group: "They called it a party.", text: "An event space that expands the entertaining capacity and resembles the gilded rooms of his private clubs. — CNN, July 31, 2025.", href: "https://www.cnn.com/2025/07/31/politics/white-house-ballroom-construction" },
      { group: "They called it a party.", text: "A fancy party venue, with people partying under a military base. — New York Magazine, June 1, 2026. The piece says “party venue.” It does not say “party room.”", href: "https://nymag.com/intelligencer/article/trump-drone-port-white-house-ballroom-villain-lair.html" },
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

const METHOD: Record<string, string> = {
  Bloodbath: "One word",
  Dictator: "One word",
  Bleach: "One word",
  "Inject light": "One word",
  "The virus is a hoax": "One word",
  "All Mexicans are rapists": "One word",
  Animals: "One word",
  Kidnapped: "One word",
  "Muslim ban": "One word",
  "Bible upside down": "One word",
  "Seventeen agencies": "One word",
  Insurrection: "One word",
  Sicknick: "One word",
  "David Duke": "One word",
  "187 minutes": "One word",
  "Never called the Guard": "One word",
  "Five officers": "One word",
  "He invented separation": "One word",
  "Concentration camps": "One word",
  "Not one mile": "One word",
  "Liable for rape": "One word",
  "Convicted of all of it": "One word",
  "Hands up": "One word",
  "Fine people": "Clipped the tape",
  "He never said peacefully": "Clipped the tape",
  "Schiff’s transcript": "Clipped the tape",
  "We love you": "Clipped the tape",
  "No condemnation": "Clipped the tape",
  "Many sides": "Clipped the tape",
  "The escort clip": "Clipped the tape",
  "The ballroom": "Cut the fact out",
  "The Iran war": "Cut the fact out",
  "Kids in cages": "Cut the fact out",
  "The laptop": "Cut the fact out",
  "Nothing on the laptop": "Cut the fact out",
  "Zelensky confirmed the crime": "Cut the fact out",
  "Project 2025": "Cut the fact out",
  "The press pass": "Cut the fact out",
  "Check your rolls": "Cut the fact out",
  "Most secure election": "Cut the fact out",
  "The slogan, not the children": "Cut the fact out",
  "Only their party": "Cut the fact out",
  "Clear and present danger": "Cut the fact out",
  "Russia collusion": "A fact the file does not show",
  "The client list": "A fact the file does not show",
  "Murdered in the cell": "A fact the file does not show",
  Lynching: "A fact the file does not show",
  "Mostly peaceful": "A fact the file does not show",
  "Four dockets": "A fact the file does not show",
  "The first impeachment": "A fact the file does not show",
  "Nuclear secrets": "A fact the file does not show",
  "Pee tape": "A fact the file does not show",
  "Suckers and losers": "A fact the file does not show",
  "Russian bounties": "A fact the file does not show",
  "Hydroxychloroquine kills": "A fact the file does not show",
  Whips: "A fact the file does not show",
  "Stand by": "He said it",
  "When the looting starts": "He said it",
  "He said the rest": "He said it",
  "He quoted Hitler": "He said it",
  "Liz Cheney": "He said it",
  "Find 11,780": "He said it",
  "Soldiers of Christ": "He said it",
  "The border is secure": "A fact the file does not show",
  Antifa: "A fact the file does not show",
  "You will not get it": "A fact the file does not show",
  Garbage: "One word",
  "Jim Crow": "One word",
  "Proven stolen": "A fact the file does not show",
  "2,000 Mules": "A fact the file does not show",
  "A tour": "One word",
  "No one was armed": "A fact the file does not show",
  "Antifa did it": "A fact the file does not show",
  "The weapons": "A fact the file does not show",
  "I never spoke to him": "Cut the fact out",
  "No pardon": "A fact the file does not show",
  "No one is above the law": "A fact the file does not show",
  "If you like your plan": "A fact the file does not show",
  "Benghazi": "Cut the fact out",
  "Transitory": "A fact the file does not show",
  "Inflation Reduction": "One word",
  "Defund": "A fact the file does not show",
  "SNAP was slashed for billionaires": "Cut the fact out",
  "The Court found election interference": "A fact the file does not show",
  "Diesel is $6.52": "Cut the fact out",
  "Mexico pays": "A fact the file does not show",
  "Repeal": "A fact the file does not show",
  "The returns": "A fact the file does not show",
  "Balance it": "A fact the file does not show",
  "Pence can flip it": "A fact the file does not show",
  "Perfect call": "Cut the fact out",
  "We read the bills": "A fact the file does not show",
  "Term limits": "A fact the file does not show",
  "The 34 counts": "A fact the file does not show",
  "Infrastructure week": "A fact the file does not show",
  "No new taxes": "A fact the file does not show",
  "Mission accomplished": "A fact the file does not show",
  "Death panels": "One word",
  "Deficits don’t matter": "A fact the file does not show",
  "They should not let up": "Cut the fact out",
  "Domestic terrorists": "One word",
  "Slow the testing": "He said it",
  "The ban was struck down": "One word",
  "Bible photo op": "Cut the fact out",
  "The dossier": "Cut the fact out",
  "Page was a spy": "One word",
  "Alfa Bank": "Cut the fact out",
  "National abortion ban": "One word",
  "Lab leak": "One word",
  "Let them die": "Cut the fact out",
  "No vaccine": "Cut the fact out",
  "No exoneration": "Cut the fact out",
  "Ten crimes": "Cut the fact out",
  "He confessed": "Cut the fact out",
  "Russian agent": "Cut the fact out",
  "Republicans paid Steele": "Cut the fact out",
  "Don Jr. indicted": "Cut the fact out",
  "Flynn the agent": "Cut the fact out",
  "Manafort colluded": "Cut the fact out",
  "Stone and WikiLeaks": "Cut the fact out",
  "Impeached for treason": "One word",
  "Removed": "One word",
  "The Senate convicted": "One word",
  "Already disqualified": "One word",
  "Hang Mike Pence": "A fact the file does not show",
  "He grabbed the wheel": "A fact the file does not show",
  "The crying girl": "Cut the fact out",
  "Lost children": "One word",
  "Tear gas": "Cut the fact out",
  "He burned the church": "Cut the fact out",
  "Trump University": "Cut the fact out",
  "The foundation": "Cut the fact out",
  "He pays no taxes": "Cut the fact out",
  "Most corrupt ever": "Cut the fact out",
  "He fired the pandemic team": "Cut the fact out",
  "Shoot them in the legs": "A fact the file does not show",
  "Ban the pill": "One word",
  "Enemy within": "A fact the file does not show",
  "Covington": "Cut the fact out",
  "Rittenhouse": "Cut the fact out",
  "Horse paste": "One word",
  "Sharp as a tack": "One word",
  "Don’t say gay": "One word",
  "The noose": "Cut the fact out",
  "Zero inflation": "One word",
  "Vaccinated don’t carry": "One word",
  "She was in the chamber": "Cut the fact out",
  "Kavanaugh": "Cut the fact out",
  "Smollett": "Cut the fact out",
  "Bend the knee": "Cut the fact out",
  "Laziest Congress": "One word",
  "ICE is terror": "One word",
  "Left the bullet in": "Cut the fact out",
  "Valid work permit": "Cut the fact out",
  "No pain medicine": "Cut the fact out",
  "A random stop": "Cut the fact out",
  "He was not fleeing": "Cut the fact out",
  "ICE out of Austin": "Cut the fact out",
  "The war raised the gallon": "Cut the fact out",
  "Another chance": "Cut the fact out",
};


const METHODS = ["All", "One word", "Clipped the tape", "Cut the fact out", "A fact the file does not show", "He said it"];

function methodOf(tag: string) {
  return METHOD[tag] ?? "Not sorted yet";
}

const MONTH_NUM: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function latestDate(text: string) {
  let best = 0;
  const full = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?,\s*(\d{4})/gi;
  for (const m of text.matchAll(full)) {
    const month = MONTH_NUM[m[1].toLowerCase()];
    const day = Number(m[3] ?? m[2]);
    const year = Number(m[4]);
    const t = Date.UTC(year, month, day);
    if (t > best) best = t;
  }
  const monthYear = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi;
  for (const m of text.matchAll(monthYear)) {
    const t = Date.UTC(Number(m[2]), MONTH_NUM[m[1].toLowerCase()], 1);
    if (t > best) best = t;
  }
  return best;
}

function claimTime(f: Frame) {
  const fromWho = latestDate(f.ran ?? "");
  if (fromWho) return fromWho;
  return latestDate(`${f.they}\n${f.tape}`);
}

function proofName(href: string) {
  const h = href.toLowerCase();
  if (h.includes("cnn.com")) return "CNN";
  if (h.includes("nbcnews.com")) return "NBC News";
  if (h.includes("nytimes.com")) return "New York Times";
  if (h.includes("washingtonpost.com")) return "Washington Post";
  if (h.includes("politico.com")) return "Politico";
  if (h.includes("bbc.com") || h.includes("bbc.co.uk")) return "BBC";
  if (h.includes("npr.org")) return "NPR";
  if (h.includes("apnews.com")) return "Associated Press";
  if (h.includes("reuters.com")) return "Reuters";
  if (h.includes("x.com") || h.includes("twitter.com")) return "The post";
  if (h.includes("youtube.com") || h.includes("youtu.be") || h.includes("c-span.org") || h.includes("rumble.com")) return "The recording";
  if (h.includes("law.cornell.edu") || h.includes("/uscode/")) return "United States Code";
  if (h.includes("congress.gov")) return "The bill";
  if (h.includes("supremecourt.gov") || h.includes("courtlistener.com") || h.includes("scotusblog.com")) return "The court record";
  if (h.includes("gao.gov")) return "GAO";
  if (h.includes("oig.") || h.includes("doioig") || h.includes("inspector")) return "Inspector general";
  if (h.includes("treasury") || h.includes("fiscaldata")) return "Treasury";
  if (h.includes("bls.gov")) return "Bureau of Labor Statistics";
  if (h.includes("eia.gov")) return "The fuel table";
  if (h.includes("iaea.org")) return "IAEA";
  if (h.includes("cbo.gov")) return "Congressional Budget Office";
  if (h.includes("justice.gov")) return "Justice Department";
  if (h.includes("fbi.gov")) return "FBI";
  if (h.includes("cisa.gov")) return "CISA";
  if (h.includes("whitehousehistory.org")) return "White House Historical Association";
  if (h.includes("documentcloud.org")) return "The memorandum";
  if (h.includes("whitehouse")) return "The White House record";
  if (h.includes("cbp.gov")) return "Customs and Border Protection";
  if (h.includes("dhs.gov")) return "Homeland Security";
  if (h.includes("state.gov")) return "State Department";
  if (h.includes("federalregister.gov")) return "The Federal Register";
  return "The official file";
}

function youtubeId(href: string) {
  try {
    const url = new URL(href);
    if (url.hostname.includes("youtu.be")) return url.pathname.replace(/^\//, "").split("/")[0] || null;
    if (url.hostname.includes("youtube.com")) return url.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

function speakerNames(f: Frame, includeTape = false) {
  const blob = `${f.ran ?? ""}\n${f.they}\n${includeTape ? f.tape : ""}\n${(EXTRA[f.tag] ?? []).map((item) => item.label).join("\n")}`;
  const found = blob.match(/\b(CNN|NBC|MSNBC|MS NOW|ABC|CBS|Fox News|BBC|New York Times|New York Magazine|Washington Post|Politico|The Atlantic|Associated Press|Schumer|Pelosi|Biden|Harris|Jeffries|Merkley|Murray|Murphy|Pressley|Waters|Obama|Schiff|Khanna|Garcia|Raskin|Warren|Booker|Sanders|McGovern|Mullin|Johnson|Bush|Cheney|Yellen|Palin)\b/gi) ?? [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const raw of found) {
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(raw);
  }
  return names;
}

function claimLine(f: Frame) {
  return f.they.split("||").map((part) => part.trim()).filter(Boolean).join(" ");
}

function cleanBits(text: string) {
  return text.replace(/https?:\/\/[^\s)]+/g, "").replace(/\s{2,}/g, " ").replace(/\s+([.,])/g, "$1").trim();
}

function claimStatements(they: string) {
  return they.split("||").flatMap((part) => cleanBits(part).split(/(?<=\.)\s+/)).map((line) => line.trim()).filter((line) => line.length > 2);
}

function truthStatements(tape: string) {
  return cleanBits(tape).split(/(?<=\.)\s+/).map((line) => line.trim()).filter((line) => line.length > 2);
}

function isOfficial(href: string) {
  return /gov\/|cornell\.edu|iaea\.org|congress\.gov|courtlistener|supremecourt|justia\.com|documentcloud|whitehouse|c-span\.org|youtube\.com|youtu\.be|rumble\.com|federalregister|loc\.gov|oig\.|gao\.gov|bls\.gov|eia\.gov|cbo\.gov|whitehousehistory\.org/i.test(href);
}

function rowLinks(f: Frame) {
  const named = EXTRA[f.tag] ?? [];
  const seen = new Set(named.map((item) => item.href));
  const more = urlsIn(`${f.they}\n${f.tape}\n${f.href ?? ""}`)
    .filter((href) => !seen.has(href))
    .map((href) => ({ label: proofName(href), href }));
  return [...named, ...more];
}

function TapeTable({ frames, filters = true }: { frames: Frame[]; filters?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [method, setMethod] = useState("All");
  const shown = frames
    .filter((f) => !filters || method === "All" || methodOf(f.tag) === method)
    .map((f, i) => ({ f, i, t: claimTime(f) }))
    .sort((a, b) => (filters ? b.t - a.t || a.i - b.i : a.i - b.i))
    .map((row) => row.f);
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const match = frames.find((frame) => frameId(frame.tag) === id);
    if (!match) return;
    setOpen(`${match.tag}:claim`);
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [frames]);
  return (
    <section className="mt-8">
      <p className="mb-3 text-base leading-relaxed text-fg">
        The left is the claim and the names. Open it for each statement and the link that shows they said it. The right is Documented Evidence of False Claims. Open it for the facts and the named source.
      </p>
      {filters ? (
      <div className="mb-4 flex flex-wrap gap-2">
        {METHODS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => { setMethod(name); setOpen(null); }}
            className={method === name
              ? "rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white"
              : "rounded-full border border-neutral-700 px-3 py-2 text-sm font-semibold text-blue-700"}
          >
            {name}
          </button>
        ))}
      </div>
      ) : null}
      <div className="overflow-x-auto rounded-md border border-neutral-800">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr>
              <th className="w-1/2 border-r border-white/10 bg-[#3a1214] px-3 py-3 font-display text-sm font-bold tracking-[0.12em] text-red-100 uppercase">
                The claim
              </th>
              <th className="bg-[#10233f] px-3 py-3 font-display text-sm font-bold tracking-[0.08em] text-blue-100 uppercase">
                Documented Evidence of False Claims
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((f) => {
              const ballroom = f.tag === "The ballroom";
              const bloodbath = f.tag === "Bloodbath";
              const cell = (name: Cell) => `${f.tag}:${name}`;
              const on = (name: Cell) => open === cell(name);
              const col = open?.startsWith(`${f.tag}:`) ? (open.slice(f.tag.length + 1) as Cell) : null;
              const links = rowLinks(f);
              const said = links.filter((link) => !isOfficial(link.href));
              const proof = links.filter((link) => isOfficial(link.href));
              const claimItems = ballroom
                ? [...BALLROOM.claim.items, ...BALLROOM.who.items]
                : null;
              const truthItems = ballroom ? BALLROOM.truth.items : null;
              return (
                <Fragment key={f.tag}>
                  <tr id={frameId(f.tag)} className="scroll-mt-28 border-t border-white/10">
                    <td className="border-r border-white/10 bg-[#2a1214] px-3 py-3 align-top text-sm leading-snug text-red-50">
                      <button type="button" onClick={() => setOpen(on("claim") ? null : cell("claim"))} className="text-left">
                        <span className="mb-1 block font-display text-[11px] font-bold tracking-[0.12em] text-neutral-300 uppercase">{f.tag}</span>
                        <span className="mb-1 block font-semibold text-red-50">{claimLine(f)}</span>
                        <span className="block text-blue-200">{speakerNames(f, !filters).join(", ") || "No named speaker is on this row"}</span>
                      </button>
                    </td>
                    <td className="bg-[#0e1c33] px-3 py-3 align-top text-sm leading-snug">
                      <button type="button" onClick={() => setOpen(on("truth") ? null : cell("truth"))} className="text-left font-semibold text-blue-200">
                        Truth (Proof)
                      </button>
                    </td>
                  </tr>
                  {col === "claim" ? (
                    <tr className="border-t border-white/10">
                      <td colSpan={2} className="bg-white px-4 py-4 text-neutral-900">
                        <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed">
                          {bloodbath ? (
                            <>
                              <li>CNN, Kit Maher and Alayna Treene, March 16, 2024, 6:52 p.m. Eastern. The first timed headline said the bloodbath was if he loses the election. <a className="text-blue-700" href="https://www.cnn.com/politics/live-news/2024-election-news-03-16-24" target="_blank" rel="noreferrer">CNN</a></li>
                              <li>NBC News, Emma Barnett and Jillian Frankel, March 16, 2024, 9:37 p.m. Eastern. The headline is still that he said there will be a bloodbath if he loses. <a className="text-blue-700" href="https://www.nbcnews.com/politics/donald-trump/trump-bloodbath-loses-election-2024-rcna143746" target="_blank" rel="noreferrer">NBC News</a></li>
                              <li>The New York Times, March 16, 2024. The headline said he predicts a blood bath if he loses. The cars are not in the headline. <a className="text-blue-700" href="https://www.nytimes.com/2024/03/16/us/politics/trump-speech-ohio.html" target="_blank" rel="noreferrer">New York Times</a></li>
                              <li>James Singer, Biden-Harris campaign, the night of March 16, 2024. He called it a threat of political violence. That statement is in the NBC story above.</li>
                              <li>Joe Biden, March 17, 2024. “It’s clear this guy wants another January 6.” <a className="text-blue-700" href="https://x.com/JoeBiden/status/1769454648946049261" target="_blank" rel="noreferrer">Joe Biden, March 17, 2024</a></li>
                              <li>Joe Biden, July 15, 2024, 121 days later. “He talks about, there’ll be a bloodbath if he loses.” <a className="text-blue-700" href="https://x.com/HQNewsNow/status/1812964082430980276" target="_blank" rel="noreferrer">Joe Biden, July 15, 2024</a></li>
                            </>
                          ) : claimItems ? claimItems.map((item, i) => {
                            const showGroup = item.group && item.group !== claimItems[i - 1]?.group;
                            return (
                              <li key={item.href + item.text}>
                                {showGroup ? <span className="mb-1 block font-semibold">{item.group}</span> : null}
                                {item.text}{" "}
                                <a href={item.href} target="_blank" rel="noreferrer" className="text-blue-700">{proofName(item.href)}</a>
                              </li>
                            );
                          }) : (
                            <>
                              {claimStatements(f.they).map((line) => <li key={line}>{line}</li>)}
                              {f.ran ? <li>How long it ran: {f.ran}</li> : null}
                              {said.map((link) => (
                                <li key={link.href + link.label}>
                                  <a href={link.href} target="_blank" rel="noreferrer" className="text-blue-700">{link.label}</a>
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                  {col === "truth" ? (
                    <tr className="border-t border-white/10">
                      <td colSpan={2} className="bg-white px-4 py-4 text-neutral-900">
                        <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed">
                          {bloodbath ? (
                            <>
                              <li>He said the word twice, in the same stretch, on March 16, 2024, in Vandalia, Ohio. No second occasion was located.</li>
                              <li>At 29:45: “Now, if I don’t get elected, it’s going to be a bloodbath for the whole — that’s going to be the least of it. It’s going to be a bloodbath for the country. That’ll be the least of it. But they’re not going to sell those cars.”</li>
                              <li>The sentence before it is a 100 percent tariff on Chinese cars built in Mexico.</li>
                              <li><a className="text-blue-700" href="https://www.youtube.com/watch?v=f57dRZMS0PQ&t=1785s" target="_blank" rel="noreferrer">Roll Call recording — he starts at 29:45</a></li>
                              <li><a className="text-blue-700" href="https://www.c-span.org/clip/public-affairs-event/user-clip-trump-says-bloodbath/5110570" target="_blank" rel="noreferrer">C-SPAN clip — opens on the line</a></li>
                              <li><a className="text-blue-700" href="https://www.c-span.org/program/public-affairs-event/former-president-trump-campaigns-for-bernie-moreno/639757" target="_blank" rel="noreferrer">C-SPAN full program, March 16, 2024</a></li>
                            </>
                          ) : truthItems ? truthItems.map((item) => (
                            <li key={item.href + item.text}>
                              {item.text}{" "}
                              <a href={item.href} target="_blank" rel="noreferrer" className="text-blue-700">{proofName(item.href)}</a>
                            </li>
                          )) : (
                            <>
                              {truthStatements(f.tape).map((line) => <li key={line}>{line}</li>)}
                              {proof.map((link) => (
                                <li key={link.href + link.label}>
                                  <a href={link.href} target="_blank" rel="noreferrer" className="text-blue-700">{link.label}</a>
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                        {(bloodbath ? ["f57dRZMS0PQ"] : proof.map((link) => youtubeId(link.href)).filter((id): id is string => Boolean(id)).slice(0, 1)).map((id) => (
                          <iframe
                            key={id}
                            className="mt-4 aspect-video w-full max-w-xl rounded-md bg-black"
                            src={`https://www.youtube-nocookie.com/embed/${id}`}
                            title="The recording"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ))}
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
  filters = true,
  showClaim = false,
}: {
  frames: Frame[];
  dek?: string;
  left?: string;
  right?: string;
  heading?: string;
  tapeTable?: boolean;
  filters?: boolean;
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
        <TapeTable frames={ordered} filters={filters} />
      ) : (
      <InteractiveChart
        large
        title={heading}
        subtitle={dek}
        rightLabel={showClaim ? "The truth" : "The file"}
        rows={ordered.map((f) => ({
          id: frameId(f.tag),
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
