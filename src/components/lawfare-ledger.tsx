import type { LawfareRow } from "@/lib/content";
import { InteractiveChart, KeptRead } from "@/components/interactive-chart";

const LINE: Record<string, string> = {
  "The judge stayed on the case":
    "Justice Merchan stayed on the 34-count case. His daughter’s firm is Democratic. The ethics opinion said he did not have to step aside.",
  "Bragg · 34 counts":
    "Not Letitia James. The indictment is 16 pages. Pages 1 through 14 are the 34 counts. Each count says another crime and does not name it. Page 16 is the true bill: falsifying business records, Penal Law § 175.10, and nothing else. The instructions are 55 pages. Page 49: the verdict on each count must be unanimous. Page 26: the jury need not agree whether he did it himself or with another. Page 28: the People need not prove the other crime was committed. Page 29: that other crime is Election Law § 17-152. Page 31: the jury need not agree which unlawful means.",
  "She was ordered to pay him":
    "Stormy Daniels was ordered to pay his lawyers in the 2018 defamation case. She was a witness in the later criminal case, not the plaintiff.",
  "Carroll — she filed the day the window opened":
    "She filed the sexual-abuse case the day the one-year window opened. The verdict form said sexual abuse, not rape. The $83 million case is defamation, and that appeal is the one still open.",
  "Letitia James · civil fraud":
    "This is Letitia James. Civil, not the 34 counts. Mar-a-Lago on the statements was $347 million to $739 million. The comparison was the county tax bill, about $18 million to $27 million. A tax assessment is not a sale. The Deutsche Bank loans were never in default. The bank’s witness said getting the principal back is not the same as being paid for the risk. The $464 million penalty was vacated on August 21, 2025.",
  "Florida — the documents case":
    "No trial and no conviction. Judge Cannon dismissed the documents case. The government dropped what remained.",
  "The District of Columbia":
    "The indictment did not charge insurrection, 18 U.S.C. § 2383. The case was dismissed. There is no verdict.",
  "Georgia — the case was abandoned":
    "The district attorney was removed. What remained was abandoned. There is no Georgia conviction.",
  "The White House briefing — August 3, 2016":
    "Brennan briefed Obama, Biden, and Comey on a Clinton plan to tie Trump to Russia. Durham records the briefing. It is not a written order to indict.",
  "The Oval Office — January 5, 2017":
    "On January 20, 2017, Susan Rice emailed herself about the January 5 Oval Office meeting on Michael Flynn. Obama, Biden, Comey, and the Justice Department were in that room. The email is this case. It is not a separate item.",
  "One lawyer, three offices":
    "Matthew Colangelo went from Letitia James’s office to the Justice Department to Bragg’s office. A résumé is not a dispatch order.",
  "The Georgia invoices":
    "The special prosecutor billed the county for time with the White House. A billing line is not a transcript. The case was later dropped.",
  "One special counsel, both federal cases":
    "Garland appointed one prosecutor for both federal cases and named the campaign calendar as the reason.",
  "The family subpoenas":
    "Four of them were ordered to sit in one New York investigation about property values. Eric had already taken the Fifth more than 500 times. Donald was fined $10,000 a day for the documents. The House and the Manhattan grand jury subpoenaed the banks and the accountant, not the children in person. A witness list is not a subpoena.",
  "Russia collusion — Crossfire Hurricane":
    "Sold as a finding for years. Durham: no actual evidence of collusion in the holdings when the investigation opened. Mueller did not establish a conspiracy.",
  "First impeachment — abuse of power":
    "A July 25, 2019 call about Biden-family dealings in Ukraine. The memo is public. The Senate acquitted.",
  "Second impeachment — incitement of insurrection":
    "The Ellipse tape includes “peacefully and patriotically.” Zero defendants were charged under the insurrection statute. The Senate acquitted.",
  "Four criminal dockets at once":
    "Florida was dismissed. Georgia was abandoned. Washington was dismissed. Manhattan is the records case, still on appeal. Three never reached a verdict.",
};

const COVER: Record<string, string> = {
  "The judge stayed on the case":
    "Issue: his daughter’s firm is Democratic. He was asked to step aside. He stayed.",
  "Bragg · 34 counts":
    "Issue: indictment pages 1–14 say another crime and do not name it. Instructions pages 26, 28, 29, 31, and 49.",
  "She was ordered to pay him":
    "Issue: the caption said she beat him. The 2018 order said she owed his lawyers.",
  "Carroll — she filed the day the window opened":
    "Issue: she filed the day the window opened. The verdict form said sexual abuse, not rape.",
  "Letitia James · civil fraud":
    "Issue: this is not the 34 counts. It is civil. The money penalty was thrown out.",
  "Florida — the documents case":
    "Issue: the indictment was sold as the crime. There was no trial and no conviction.",
  "The District of Columbia":
    "Issue: the indictment does not charge insurrection, 18 U.S.C. § 2383. There is no verdict.",
  "Georgia — the case was abandoned":
    "Issue: the press conference was sold as a conviction. The case was abandoned.",
  "The White House briefing — August 3, 2016":
    "Issue: a briefing was sold as an order to indict. Durham records a briefing, not an order.",
  "The Oval Office — January 5, 2017":
    "Issue: the wall was the caption. Rice’s January 20 email is about Flynn.",
  "One lawyer, three offices":
    "Issue: one lawyer went from James, to the Justice Department, to Bragg. No order explains it.",
  "The Georgia invoices":
    "Issue: the state prosecutor billed the county for time with the White House.",
  "One special counsel, both federal cases":
    "Issue: one prosecutor, both federal cases, appointed because both men were running.",
  "The family subpoenas":
    "Issue: the family was said to be under constant subpoena. The paper has four testimony orders in one case, plus subpoenas to the banks and the accountant.",
  "Russia collusion — Crossfire Hurricane":
    "Issue: it was sold as a finding. Durham: no actual evidence of collusion when it opened.",
  "First impeachment — abuse of power":
    "Issue: the call was sold as a crime. The memo is public. The Senate acquitted.",
  "Second impeachment — incitement of insurrection":
    "Issue: the article said insurrection. The statute was not charged. The Senate acquitted.",
  "Four criminal dockets at once":
    "Issue: four cases were sold as four verdicts. Three never reached one.",
};

function Split({
  name,
  note,
  ran,
  file,
  links,
}: {
  name: string;
  note?: string;
  ran: string;
  file: string;
  links: { label: string; href: string }[];
}) {
  return (
    <details className="border-t border-border">
      <summary className="cursor-pointer list-none bg-surface px-4 py-4 [&::-webkit-details-marker]:hidden">
        <p className="font-display text-sm font-bold tracking-wide text-fg uppercase">{name}</p>
        {note ? (
          <p className="mt-1 font-display text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
            {note}
          </p>
        ) : null}
      </summary>
      <div className="grid md:grid-cols-2">
        <div className="bg-[#3a1214] px-4 py-4">
          <p className="font-display text-[11px] font-semibold tracking-[0.16em] text-red-200 uppercase">
            What they ran
          </p>
          <p className="mt-2 text-sm leading-relaxed text-red-50">{ran}</p>
        </div>
        <div className="bg-[#10233f] px-4 py-4">
          <p className="font-display text-[11px] font-semibold tracking-[0.16em] text-blue-200 uppercase">
            The file
          </p>
          <p className="mt-2 text-sm leading-relaxed text-blue-50">{file}</p>
          <div className="mt-3 flex flex-col gap-2">
            {links.map((d) => (
              <a
                key={d.href + d.label}
                href={d.href}
                target="_blank"
                rel="noreferrer"
                className="font-display text-[11px] font-semibold tracking-[0.14em] text-blue-200 uppercase no-underline hover:text-white"
              >
                {d.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

function Head({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid md:grid-cols-2">
        <p className="bg-[#3a1214] px-4 py-3 font-display text-xs font-bold tracking-[0.18em] text-red-100 uppercase">
          {title} · what they ran
        </p>
        <p className="bg-[#10233f] px-4 py-3 font-display text-xs font-bold tracking-[0.18em] text-blue-100 uppercase">
          The file
        </p>
      </div>
    </div>
  );
}

export function LawfareLedger({ rows }: { rows: LawfareRow[] }) {
  return (
    <InteractiveChart
      title="Lawfare"
      subtitle="The claim is the row. The short version is a few lines. The record opens the document."
      rows={rows.map((r) => ({
        id: r.caption,
        name: r.caption,
        href: r.href,
        proof: "The record",
        read: (
          <KeptRead
            said={r.sold}
            note={COVER[r.caption]}
            record={LINE[r.caption] ?? r.file}
            links={[
              { label: r.doc ?? "Open the court record", href: r.href },
              ...(r.docs ?? []),
            ]}
          />
        ),
      }))}
    />
  );
}

const SLOGAN = [
  {
    name: "Clear and present danger",
    ran: "He is a clear and present danger. Ordinary law is too slow. Break it to stop him.",
    file: "The phrase is a speech test. Brandenburg v. Ohio replaced Schenck. The state may punish speech only if it is meant to produce imminent lawless action and is likely to. It limits the government. It is not a license to break the law.",
    href: "https://supreme.justia.com/cases/federal/us/395/444/",
    doc: "Brandenburg v. Ohio",
  },
  {
    name: "Threat to democracy",
    ran: "He is a threat to democracy. The republic must be saved from the voters.",
    file: "Mueller did not establish a Russia conspiracy. Jack Smith did not charge 18 U.S.C. § 2383. The U.S. Attorney for D.C. charged zero people under the insurrection statute. Two impeachments: the House yes, the Senate no.",
    href: "https://www.justice.gov/storage/US_v_Trump_23_cr_257.pdf",
    doc: "District of Columbia indictment — no § 2383",
  },
  {
    name: "The United States is a republic",
    ran: "Our democracy. The slogan is used as if the country were a show of hands.",
    file: "Article IV, Section 4 guarantees every state a republican form of government. Federalist 10: they built a republic, not a pure democracy, because a pure democracy has no cure for faction.",
    href: "https://constitution.congress.gov/constitution/article-4/",
    doc: "Article IV, Section 4",
  },
  {
    name: "False accusation, repeated 12 years",
    ran: "Russia. Insurrection. Pedophile. Nazi. Pays no taxes. The most corrupt president ever. Said as a finding.",
    file: "Durham: no actual evidence of collusion in the holdings when the case opened. The tax returns were stolen. Charles Littlejohn pleaded guilty under 26 U.S.C. § 7213. The forms show income tax paid. A smear repeated is still a smear.",
    href: "https://www.justice.gov/storage/durhamreport.pdf",
    doc: "Durham report",
  },
  {
    name: "34 counts · the instructions",
    ran: "Thirty-four felonies. Election fraud. Proved. The jury did not have to agree.",
    file: "The counts do not name the other crime. Indictment pages 1 through 14 say another crime and stop. Page 16 is the true bill: falsifying business records only. Page 49 of the instructions: the verdict on each count must be unanimous. Page 26: they need not agree whether he acted alone. Page 28: they need not prove the other crime happened. Page 29: that crime is Election Law § 17-152. Page 31: they need not agree which unlawful means.",
    href: "https://www.manhattanda.org/wp-content/uploads/2023/04/Donald-J.-Trump-Indictment.pdf",
    doc: "Indictment — pages 1–14 and 16",
    more: [
      {
        label: "Jury instructions — pages 26, 28, 29, 31, and 49",
        href: "https://www.nycourts.gov/LegacyPDFS/press/PDFs/People%20v.%20DJT%20Jury%20Instructions%20and%20Charges%20FINAL%205-23-24.pdf",
      },
    ],
  },
  {
    name: "The slogan did not legalize the shortcut",
    ran: "He is an extinction event, so the warrant, the tape, and the indictment do not have to be clean.",
    file: "Horowitz found seventeen errors in the Carter Page warrants. The call memo is not Schiff’s floor reading. H.Res. 24 was built on a cut of the Ellipse. None of that becomes lawful because someone said threat to democracy.",
    href: "https://oig.justice.gov/reports/2019/o1912.pdf",
    doc: "Horowitz — the FISA",
  },
];

export function SloganChart() {
  return (
    <InteractiveChart
      title="The slogan versus the document"
      subtitle="The claim is the row. The short version is a few lines. The record opens the document."
      rows={SLOGAN.map((r) => ({
        id: r.name,
        name: r.name,
        href: r.href,
        proof: "The record",
        read: (
          <KeptRead
            said={r.ran}
            record={r.file}
            links={[
              { label: r.doc, href: r.href },
              ...("more" in r && r.more ? r.more : []),
            ]}
          />
        ),
      }))}
    />
  );
}
