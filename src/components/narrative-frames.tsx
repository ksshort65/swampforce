import type { Frame } from "@/lib/content";
import { InteractiveChart, KeptRead } from "@/components/interactive-chart";

function fileLine(text: string) {
  const two = text.split(/(?<=\.)\s+/).slice(0, 2).join(" ");
  return two.length > 320 ? `${two.slice(0, 317)}…` : two;
}

function TapeTable({ frames }: { frames: Frame[] }) {
  return (
    <section className="mt-8">
      <p className="mb-3 text-base leading-relaxed text-fg">
        This table is interactive. Choose a block and it opens the proof.
      </p>
      <div className="overflow-x-auto rounded-md border border-neutral-800">
        <table className="w-full min-w-[48rem] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[34%] border-r border-white/10 bg-[#3a1214] px-4 py-3 font-display text-sm font-bold tracking-[0.14em] text-red-100 uppercase">
                What ran
              </th>
              <th className="bg-[#10233f] px-4 py-3 font-display text-sm font-bold tracking-[0.14em] text-blue-100 uppercase">
                The tape
              </th>
            </tr>
          </thead>
          <tbody>
            {frames.map((f) => {
              const proof = f.href ? (
                <a
                  href={f.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/40 underline-offset-2"
                >
                  {f.they}
                </a>
              ) : (
                f.they
              );
              const tape = f.href ? (
                <a
                  href={f.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/40 underline-offset-2"
                >
                  {f.tape}
                </a>
              ) : (
                f.tape
              );
              return (
                <tr key={f.tag} className="border-t border-white/10">
                  <td className="border-r border-white/10 bg-[#2a1214] px-4 py-4 align-top text-base font-semibold leading-snug text-red-50">
                    <span className="mb-2 block font-display text-[11px] font-bold tracking-[0.14em] text-red-200 uppercase">
                      {f.tag}
                    </span>
                    {proof}
                  </td>
                  <td className="bg-[#0e1c33] px-4 py-4 align-top text-base leading-relaxed text-blue-50">
                    {tape}
                  </td>
                </tr>
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
}: {
  frames: Frame[];
  dek?: string;
  left?: string;
  right?: string;
  heading?: string;
  tapeTable?: boolean;
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
        rows={ordered.map((f) => ({
          id: f.tag,
          name: f.tag,
          line: fileLine(f.tape),
          href: f.href,
          proof: "The record",
          read: (
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
