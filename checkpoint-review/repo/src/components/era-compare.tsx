import type { EraTopic } from "@/lib/content";

export function EraCompare({ topics }: { topics: EraTopic[] }) {
  return (
    <section className="mt-10">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        The homework
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">
        Three jobs
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Read the last line first. That is today. Then read up to see who opened it.
      </p>

      <div className="mt-8 space-y-8">
        {topics.map((t) => (
          <div key={t.topic} className="overflow-hidden rounded-lg outline outline-border">
            <p className="bg-surface px-4 py-3 font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              {t.topic}
            </p>
            {t.rows.map((r, i) => {
              const now = i === t.rows.length - 1;
              return (
                <div
                  key={r.who}
                  className={`grid border-t border-border sm:grid-cols-[8.5rem_1fr] ${now ? "bg-sage/12" : ""}`}
                >
                  <div className="px-4 py-3 sm:border-r sm:border-border">
                    <p className="font-display text-sm font-semibold tracking-wide uppercase">
                      {r.who}
                    </p>
                    <p className="font-display text-[11px] tracking-[0.12em] text-muted uppercase">
                      {r.years}
                    </p>
                  </div>
                  <p
                    className={`px-4 py-3 text-[15px] leading-snug ${now ? "font-medium text-fg" : "text-fg/75"}`}
                  >
                    {r.href ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sage underline decoration-sage underline-offset-2"
                      >
                        {r.line}
                      </a>
                    ) : (
                      r.line
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
