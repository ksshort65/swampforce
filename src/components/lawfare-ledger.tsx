import type { LawfareRow } from "@/lib/content";

export function LawfareLedger({ rows }: { rows: LawfareRow[] }) {
  return (
    <section className="mt-12">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        The ledger
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">
        Caption · evidence · source · file
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        What they ran. What they used. Where it came from. What the official
        file later showed. Read across.
      </p>
      <div className="mt-8 overflow-x-auto rounded-lg outline outline-border">
        <div className="hidden min-w-[64rem] grid-cols-4 bg-surface lg:grid">
          <p className="border-r border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Caption
          </p>
          <p className="border-r border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Evidence they used
          </p>
          <p className="border-r border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Where it came from
          </p>
          <p className="px-4 py-3 font-display text-xs font-semibold tracking-[0.14em] text-sage uppercase">
            What the file showed
          </p>
        </div>
        {rows.map((r) => (
          <div
            key={r.caption}
            className="grid border-t border-border lg:min-w-[64rem] lg:grid-cols-4"
          >
            <div className="border-border px-4 py-5 lg:border-r">
              <p className="font-display text-xs tracking-[0.16em] text-muted uppercase lg:hidden">
                Caption
              </p>
              <p className="mt-1 font-display text-base font-semibold tracking-wide uppercase lg:mt-0">
                {r.caption}
              </p>
            </div>
            <div className="border-border px-4 py-5 lg:border-r">
              <p className="font-display text-xs tracking-[0.16em] text-muted uppercase lg:hidden">
                Evidence they used
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg/80 lg:mt-0">
                {r.evidence}
              </p>
            </div>
            <div className="border-border px-4 py-5 lg:border-r">
              <p className="font-display text-xs tracking-[0.16em] text-muted uppercase lg:hidden">
                Where it came from
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg/80 lg:mt-0">
                {r.source}
              </p>
            </div>
            <div className="bg-surface/50 px-4 py-5">
              <p className="font-display text-xs tracking-[0.16em] text-sage uppercase lg:hidden">
                What the file showed
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg lg:mt-0">
                {r.file}
              </p>
              <p className="mt-3">
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-xs tracking-[0.14em] text-sage uppercase no-underline hover:underline"
                >
                  The file →
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
