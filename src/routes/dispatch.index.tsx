import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeHead } from "@/lib/share-head";
import { START_HERE, getPost } from "@/lib/content";
import { SCORE_TABS } from "@/lib/scorecard";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => homeHead(),
});

export function DispatchIndex() {
  const featured = getPost(START_HERE[0]);
  return (
    <main>
      <section className="relative min-h-[78vh] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/hero-capitol.jpg"
            alt="Eagle on the Capitol in the swamp"
            className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-6 pb-10 pt-8">
          <h1 className="max-w-xl font-display leading-[0.95] font-bold tracking-wide uppercase text-[clamp(2.2rem,7vw,4.6rem)]">
            Save the nation.
          </h1>
          <p className="mt-3 max-w-lg text-[clamp(0.95rem,2.2vw,1.25rem)] leading-snug text-fg/90">
            The midterm is a scorecard, not a mood. Vote on what they
            passed, what it cost, and what they broke. Both parties have
            failed. The official record is the ballot.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 pb-2">
            <Button asChild>
              <Link to="/scorecard">Congressional Scorecard</Link>
            </Button>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="border-b border-border bg-ink">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 md:grid-cols-2">
            <Link
              to="/dispatch/$slug"
              params={{ slug: featured.slug }}
              className="block text-fg no-underline"
            >
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="aspect-video w-full rounded-lg object-cover"
              />
            </Link>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {featured.dek}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/dispatch/$slug" params={{ slug: featured.slug }}>
                    {featured.title}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            Midterms
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            The scorecard
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Open GOP, Dem, Split, Oval, or Compare. Charts first. Read if you want the file.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SCORE_TABS.map((f) => (
              <Link
                key={f.id}
                to="/scorecard"
                hash={`${f.id}-charts`}
                className="min-h-16 rounded-md border-2 border-sage bg-bg px-3 py-4 text-fg no-underline hover:bg-ink"
              >
                <p className="font-display text-sm font-bold tracking-wide uppercase">
                  {f.k}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">{f.v}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 md:grid-cols-2">
          <Link to="/pump" className="block text-fg no-underline">
            <img
              src="/images/chart-pump-admins.jpg"
              alt="Highest EIA weekly gallon — four administrations"
              className="w-full rounded-lg border border-border"
            />
          </Link>
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
              The pump · EIA
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
              The gallon
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              The Energy Information Administration tracks the pump across
              four administrations. OPEC — the governments that export most
              of the world’s oil — decides how many barrels leave the
              ground. Congress does not pump a gallon.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/pump">
                  The pump
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The Clip
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            The pool.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            On Friday they barred CNN, MS NOW, and Politico from the White
            House. A six-second caption is still not the recording.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/dispatch/$slug" params={{ slug: "the-pool" }}>
                The pool
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The Clip
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            The caption was not the charge
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Insurrection on television. Not on 18 U.S.C. § 2383. The Speaker
            stacked the committee. The House held the tape. Durham already
            wrote the Russia file. Parents were a federal problem.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link
                to="/dispatch/$slug"
                params={{ slug: "the-caption-was-not-the-charge" }}
              >
                The caption was not the charge
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 md:grid-cols-2">
          <Link
            to="/dispatch/$slug"
            params={{ slug: "sixty-percent" }}
            className="block text-fg no-underline"
          >
            <img
              src="/images/chart-iran.jpg"
              alt="Enrichment: power plant, the 2015 deal, Iran at 60%, a bomb at 90%"
              className="w-full rounded-lg border border-border"
            />
          </Link>
          <div>
            <h2 className="font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
              Sixty percent.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              The IAEA counted 440.9 kilograms of uranium enriched up to 60
              percent. A civilian power plant runs at about 5 percent. A
              weapon needs about 90. The last step is the short one.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/dispatch/$slug" params={{ slug: "sixty-percent" }}>
                  Sixty percent
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            Find them.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                slug: "find-them",
                img: "/images/essay-find-them.jpg",
                t: "Find them.",
                d: "Hundreds of thousands of children are still a missing-persons file.",
              },
              {
                slug: "who-got-paid",
                img: "/images/essay-who-got-paid.jpg",
                t: "Who got paid.",
                d: "Who got paid off the open border.",
              },
              {
                slug: "defund-ice-is-the-tell",
                img: "/images/essay-defund-ice.jpg",
                t: "Defund ICE is the tell.",
                d: "The party that lost the children now wants the search abolished.",
              },
            ].map((p) => (
              <Link
                key={p.slug}
                to="/dispatch/$slug"
                params={{ slug: p.slug }}
                className="block text-fg no-underline"
              >
                <img
                  src={p.img}
                  alt=""
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <p className="mt-3 font-display text-xl font-semibold tracking-wide uppercase">
                  {p.t}
                </p>
                <p className="mt-1 text-sm text-muted">{p.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
