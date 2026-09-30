import { createFileRoute, Link } from "@tanstack/react-router";
import { ESSAYS, essayDate, essayDek, essaySeries } from "@/lib/dispatch";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => ({ meta: [{ title: "The Dispatch — Swamp Force" }] }),
});

const DOOR =
  "rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-2 text-[15px] font-semibold leading-snug text-white no-underline";

function DispatchIndex() {
  return (
    <main className="min-h-screen bg-[#070b12] text-white" data-dispatch>
      <nav className="sticky top-0 z-20 flex min-h-14 items-center bg-[#070b12]/95 px-4 py-2">
        <Link to="/" data-back className="text-[15px] font-semibold tracking-wide text-white no-underline">
          ‹ Home
        </Link>
      </nav>
      <section className="relative w-full overflow-hidden">
        <img
          src="/images/hero-capitol.jpg"
          alt="Eagle on the Capitol in the swamp"
          className="absolute inset-0 h-full w-full max-w-none object-cover object-[center_12%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-end px-5 pt-8 pb-10">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4af37] uppercase">Midterm guide</p>
          <h1 className="mt-2 max-w-xl text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.95] font-bold tracking-wide uppercase">
            Vote the official record.
          </h1>
          <p className="mt-3 max-w-lg text-[clamp(0.95rem,2.2vw,1.25rem)] leading-snug text-white/90">
            The midterms are a vote on the people in office and the people running to replace them. Judge them by
            the official record. Not by a speech. Not by a headline. The files here are government sources.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/scorecard" className={DOOR}>
              Scorecard
            </Link>
            <Link to="/dispatch/$slug" params={{ slug: "the-media-ledger" }} className={DOOR}>
              Fake News
            </Link>
            <Link to="/dispatch/$slug" params={{ slug: "the-democrat-ledger" }} className={DOOR}>
              Democrats
            </Link>
            <Link to="/dispatch/$slug" params={{ slug: "they-opened-the-border" }} className={DOOR}>
              Border
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-5 pt-10 pb-24">
        <h2 className="text-center text-[18px] font-semibold tracking-wide text-white">The Dispatch</h2>
        <p className="mt-1 text-center text-[15px] text-white/75">{ESSAYS.length} essays</p>
        {essaySeries().map((series) => (
          <section key={series.name} className="mt-10" data-dispatch-series={series.name}>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4af37] uppercase">
              {series.name} · {series.essays.length}
            </p>
            <ul className="mt-4 flex list-none flex-col gap-3 p-0">
              {series.essays.map((essay) => (
                <li key={essay.slug}>
                  <Link
                    to="/dispatch/$slug"
                    params={{ slug: essay.slug }}
                    data-dispatch-essay={essay.slug}
                    className="block rounded-2xl border border-white/25 bg-[#070b12]/85 px-4 py-3 text-left text-white no-underline"
                  >
                    <span className="block text-[17px] font-semibold leading-snug">{essay.title}</span>
                    <span className="mt-1 block text-[13px] text-white/60">{essayDate(essay.date)}</span>
                    <span className="mt-1 block text-[15px] leading-snug text-white/80">{essayDek(essay)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
