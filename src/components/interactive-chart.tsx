import { useState, type ReactNode } from "react";

const NAMES: [RegExp, string][] = [
  [/18 U\.S\.C\. § 2383/g, "the insurrection law (18 U.S.C. § 2383)"],
  [/§ 2383/g, "the insurrection law"],
  [/18 U\.S\.C\. § 2384/g, "the seditious-conspiracy law (18 U.S.C. § 2384)"],
  [/26 U\.S\.C\. § 7213/g, "the law against leaking a tax return (26 U.S.C. § 7213)"],
  [/5 U\.S\.C\. § 3331/g, "the oath of office (5 U.S.C. § 3331)"],
  [/2 U\.S\.C\. § 1415/g, "the law that pays congressional misconduct settlements with tax money (2 U.S.C. § 1415)"],
  [/2 U\.S\.C\. § 1601/g, "the lobbying-disclosure law (2 U.S.C. § 1601)"],
  [/8 U\.S\.C\. § 1611/g, "the law that bars most non-citizens from federal benefits (8 U.S.C. § 1611)"],
  [/52 U\.S\.C\. § 20507/g, "the law that requires voter rolls to be kept clean (52 U.S.C. § 20507)"],
  [/22 U\.S\.C\. § 4411/g, "the law that created the National Endowment for Democracy (22 U.S.C. § 4411)"],
  [/26 U\.S\.C\. § 6104/g, "the tax rule that shows a nonprofit’s return and hides the donors (26 U.S.C. § 6104)"],
  [/Election Law § 17-152/g, "New York’s election-conspiracy law (Election Law § 17-152)"],
  [/Article IV, Section 4/g, "the Constitution’s promise of a republican form of government (Article IV, Section 4)"],
  [/Article I, Section 9/g, "the Constitution’s rule that Congress, not the president, spends the money (Article I, Section 9)"],
  [/Brandenburg v\. Ohio/g, "Brandenburg v. Ohio, the case that lets the government punish speech only when it is about to cause lawless action"],
  [/Federalist 10/g, "Federalist 10, Madison’s case for a republic instead of a pure democracy"],
];

export function named(text: string) {
  return NAMES.reduce((out, [re, plain]) => out.replace(re, plain), text);
}

export function points(text: string) {
  return named(text)
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 4);
}

export function ShortRead({
  said,
  record,
  links,
  note,
}: {
  said: string;
  record: string;
  links: { label: string; href: string }[];
  note?: string;
}) {
  const bits = points(record);
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] font-semibold text-red-800">What was said</p>
        <p className="mt-1 text-[15px] leading-relaxed text-neutral-900">{named(said)}</p>
      </div>
      {note ? <p className="text-[15px] leading-relaxed text-neutral-700">{named(note)}</p> : null}
      <div>
        <p className="text-[13px] font-semibold text-blue-900">The short version</p>
        <ul className="mt-2 space-y-2">
          {bits.map((bit) => (
            <li key={bit} className="text-[15px] leading-relaxed text-blue-950">
              {bit}
            </li>
          ))}
          {links.map((link) => (
            <li key={link.href + link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-[15px] leading-relaxed text-blue-800 underline decoration-blue-200 underline-offset-2"
              >
                {named(link.label)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export type ChartRow = {
  id: string;
  name: string;
  line?: string;
  href?: string;
  proof?: string;
  read: ReactNode;
};

export function InteractiveChart({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: ChartRow[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const note = subtitle?.startsWith("The claim is the row") ? null : subtitle;

  function choose(id: string) {
    setOpen((current) => (current === id ? null : id));
  }

  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-md border border-neutral-800 bg-[#140e0c] text-white">
        <div className="px-5 py-5">
          <p className="font-display text-2xl font-bold tracking-wide uppercase sm:text-3xl">{title}</p>
          {note ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-300">{note}</p> : null}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <p className="bg-[#3a1214] px-4 py-3 font-display text-[11px] font-bold tracking-[0.18em] text-red-100 uppercase">
            The claim
          </p>
          <p className="bg-[#10233f] px-4 py-3 font-display text-[11px] font-bold tracking-[0.18em] text-blue-100 uppercase">
            The file
          </p>
        </div>
        {rows.map((r) => {
          const on = open === r.id;
          return (
            <div key={r.id} className="border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => choose(r.id)}
                  className={`px-4 py-3 text-left text-[15px] font-semibold break-words text-red-50 ${on ? "bg-[#4a181c]" : "bg-[#2a1214]"}`}
                >
                  {r.name}
                </button>
                <button
                  type="button"
                  onClick={() => choose(r.id)}
                  className={`border-t border-white/10 px-4 py-3 text-left text-[14px] leading-relaxed break-words text-blue-50 sm:border-t-0 sm:border-l ${on ? "bg-[#163056]" : "bg-[#0e1c33]"}`}
                >
                  {r.line ?? r.proof ?? "The record"}
                </button>
              </div>
              {on ? (
                <div className="border-t border-neutral-200 bg-white px-5 py-4 text-black">
                  {r.read}
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-[13px] font-semibold text-blue-800 no-underline hover:underline"
                    >
                      {r.proof ?? "The record"}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function KeptRead({
  said,
  record,
  links,
  note,
}: {
  said: string;
  record: string;
  links: { label: string; href: string }[];
  note?: string;
}) {
  return (
    <div className="space-y-5">
      <ShortRead said={said} record={record} links={links} note={note} />
      <div>
        <p className="text-[13px] font-semibold text-blue-900">The file</p>
        <p className="mt-1 text-[15px] leading-relaxed text-neutral-900">{named(record)}</p>
      </div>
    </div>
  );
}

export function firstLine(text: string) {
  const cut = text.split(/(?<=\.)\s/)[0] ?? text;
  return cut.length > 120 ? `${cut.slice(0, 117)}…` : cut;
}
