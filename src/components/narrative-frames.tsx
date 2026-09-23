import type { Frame } from "@/lib/content";

export function NarrativeFrames({
  frames,
  dek = "Left is the Democratic frame. Right is the uncut record. Read across.",
  left = "What they ran",
  right = "What the tape is",
  heading = "The caption · the file",
}: {
  frames: Frame[];
  dek?: string;
  left?: string;
  right?: string;
  heading?: string;
}) {
  const fake = heading === "Manufactured outrage" || heading === "Fake news";
  return (
    <section className="mt-12">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        {fake ? "The chart" : "Side by side"}
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">
        {heading}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        {dek}
      </p>

      <div className="mt-8 overflow-hidden rounded-lg outline outline-border">
        <div className={fake ? "hidden bg-surface lg:grid lg:grid-cols-[14rem_1fr_8rem]" : "hidden grid-cols-2 bg-surface sm:grid"}>
          <p className="border-r border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            {left}
          </p>
          <p className="border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] text-sage uppercase lg:border-r">
            {right}
          </p>
          {fake ? (
            <p className="px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] text-sage uppercase">
              Proof
            </p>
          ) : null}
        </div>
        {frames.map((f) => (
          <div key={f.tag}>
            {f.tag === "War of choice" ? (
              <figure className="border-t border-border px-4 py-5">
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
          <div
            className={
              fake
                ? "grid border-t border-border lg:grid-cols-[14rem_1fr_8rem]"
                : "grid border-t border-border sm:grid-cols-2"
            }
          >
            <div className="border-border px-4 py-5 lg:border-r">
              <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
                {f.tag}
              </p>
              {f.ran ? (
                <p className="mt-2 text-sm leading-relaxed text-fg">How long it ran: {f.ran}</p>
              ) : null}
              <p className="mt-2 text-base leading-relaxed text-fg/80">{f.they}</p>
            </div>
            <div className="bg-surface/50 px-4 py-5 lg:border-r lg:border-border">
              <p className="font-display text-xs tracking-[0.16em] text-sage uppercase lg:hidden">
                The file
              </p>
              <p className="mt-2 text-base leading-relaxed text-fg lg:mt-0">{f.tape}</p>
              {f.href && !fake ? (
                <p className="mt-3">
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-xs tracking-[0.14em] text-sage uppercase no-underline hover:underline"
                  >
                    Proof →
                  </a>
                </p>
              ) : null}
            </div>
            {fake ? (
              <div className="px-4 py-5">
                {f.href ? (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-[0.14em] text-sage uppercase no-underline hover:underline"
                  >
                    Proof →
                  </a>
                ) : (
                  <p className="text-sm leading-relaxed text-muted">The sentence is the file.</p>
                )}
              </div>
            ) : null}
          </div>
          </div>
        ))}
      </div>
    </section>
  );
}
