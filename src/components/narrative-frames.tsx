import type { Frame } from "@/lib/content";

export function NarrativeFrames({ frames }: { frames: Frame[] }) {
  return (
    <section className="mt-12">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        Side by side
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">
        The caption · the file
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Left is the Democratic frame. Right is the uncut record. Read across.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg outline outline-border">
        <div className="hidden grid-cols-2 bg-surface sm:grid">
          <p className="border-r border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            What they ran
          </p>
          <p className="px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] text-sage uppercase">
            What the tape is
          </p>
        </div>
        {frames.map((f) => (
          <div
            key={f.tag}
            className="grid border-t border-border sm:grid-cols-2"
          >
            <div className="border-border px-4 py-5 sm:border-r">
              <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
                {f.tag} · caption
              </p>
              <p className="mt-2 text-base leading-relaxed text-fg/80">{f.they}</p>
            </div>
            <div className="bg-surface/50 px-4 py-5">
              <p className="font-display text-xs tracking-[0.16em] text-sage uppercase">
                {f.tag} · file
              </p>
              <p className="mt-2 text-base leading-relaxed text-fg">{f.tape}</p>
              {f.href ? (
                <p className="mt-3">
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-xs tracking-[0.14em] text-sage uppercase no-underline hover:underline"
                  >
                    The tape →
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
