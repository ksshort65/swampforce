import { Link } from "@tanstack/react-router";
import { CHARTS, FILE_CHIPS, RECORD, SCORE_UPDATED, TAX_MOVES } from "@/lib/scorecard";

export function MidtermScorecard() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
          Congressional scorecard · updated {SCORE_UPDATED}
        </p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
          <Link to="/scorecard" className="text-fg no-underline hover:text-sage">
            Both parties failed. They do not represent the American people.
          </Link>
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed">
          No balanced budget since Clinton. The twelve money bills do not
          pass. That open book is the fraud door. The fire is Congress.
          Blaming the firefighter is politics, not the record. Independent. No
          PAC.{" "}
          <Link to="/pump" className="text-sage">
            The pump — four administrations, EIA gallons.
          </Link>
        </p>

        <div className="mt-12 space-y-16">
          {CHARTS.map((c) => (
            <figure key={c.src}>
              <img
                src={c.src}
                alt={c.title}
                className="w-full rounded-md border border-border"
              />
              <figcaption className="mt-3 text-[12px] leading-relaxed text-muted">
                Sources:{" "}
                {c.sources.map((s, i) => (
                  <span key={s.href}>
                    {i > 0 ? " · " : null}
                    <a
                      href={s.href}
                      className="text-sage no-underline hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.label}
                    </a>
                  </span>
                ))}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FILE_CHIPS.map((c) => (
            <a
              key={c.k}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className={
                c.hot
                  ? "block rounded-md border-2 border-sage bg-surface p-6 no-underline sm:col-span-2 lg:col-span-4 hover:bg-ink"
                  : "block rounded-md border border-border p-4 no-underline hover:border-sage"
              }
            >
              <p
                className={
                  c.hot
                    ? "font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase"
                    : "font-display text-[11px] font-semibold tracking-[0.16em] text-sage uppercase"
                }
              >
                {c.k}
              </p>
              <p
                className={
                  c.hot
                    ? "mt-3 max-w-3xl text-lg leading-relaxed sm:text-xl"
                    : "mt-2 text-sm leading-snug"
                }
              >
                {c.v}
              </p>
            </a>
          ))}
        </div>

        <h3 className="mt-16 font-display text-2xl font-bold tracking-wide uppercase">
          The bills
        </h3>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {RECORD.map((col) => (
            <div key={col.party}>
              <p className="font-display text-sm font-bold tracking-[0.18em] text-sage uppercase">
                {col.party}
              </p>
              <p className="mt-5 font-display text-[11px] font-semibold tracking-[0.2em] uppercase">
                Helped
              </p>
              <ul className="mt-3 space-y-3">
                {col.plus.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-fg no-underline hover:border-sage"
                    >
                      {p.item}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-display text-[11px] font-semibold tracking-[0.2em] uppercase">
                Hurt
              </p>
              <ul className="mt-3 space-y-3">
                {col.minus.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-md border border-border px-4 py-3 text-sm font-medium text-fg no-underline hover:border-sage"
                    >
                      {p.item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-16 font-display text-2xl font-bold tracking-wide uppercase">
          Tax bills
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TAX_MOVES.map((r) => (
            <a
              key={r.year + r.bill}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-md border border-border p-4 no-underline hover:border-sage"
            >
              <p className="font-display text-[11px] font-semibold tracking-[0.16em] text-sage uppercase">
                {r.year} · {r.direction} · {r.gavel}
              </p>
              <p className="mt-2 font-display text-lg font-bold tracking-wide uppercase">
                {r.bill}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <h3 className="font-display text-2xl font-bold tracking-wide uppercase">
            Foreword
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            A letter from the editor. Why this journal exists.
          </p>
          <Link
            to="/foreword"
            className="mt-4 inline-block font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase no-underline hover:text-fg"
          >
            Read the Foreword →
          </Link>
        </div>
      </div>
    </section>
  );
}
