import type { Frame } from "@/lib/content";
import { InteractiveChart, ShortRead } from "@/components/interactive-chart";

export function NarrativeFrames({
  frames,
  dek = "The claim is the row. The short version is a few lines. The record opens the document.",
  heading = "The caption · the file",
}: {
  frames: Frame[];
  dek?: string;
  left?: string;
  right?: string;
  heading?: string;
}) {
  const iran = frames.find((f) => f.tag === "War of choice");
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
              className="text-sage no-underline hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              IAEA GOV/2026/50
            </a>
            {" · 440.9 kilograms enriched up to 60 percent, as of June 13, 2025. The slogan under this chart leaves the bar out."}
          </figcaption>
        </figure>
      ) : null}
      <InteractiveChart
        title={heading}
        subtitle={dek}
        rows={frames.map((f) => ({
          id: f.tag,
          name: f.tag,
          href: f.href,
          proof: "The record",
          read: (
            <ShortRead
              said={f.they}
              note={f.ran ? `How long it ran: ${f.ran}` : undefined}
              record={f.tape}
              links={f.href ? [{ label: "The record", href: f.href }] : []}
            />
          ),
        }))}
      />
    </>
  );
}
