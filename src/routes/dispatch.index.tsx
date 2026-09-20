import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeHead } from "@/lib/share-head";
import { START_HERE, getPost } from "@/lib/content";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => homeHead(),
});

export function DispatchIndex() {
  const featured = getPost(START_HERE[0]);
  return (
    <main>
      <section className="relative min-h-[78dvh] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/hero-capitol.jpg"
            alt="Eagle on the Capitol in the swamp"
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[78dvh] max-w-6xl flex-col justify-end px-4 pb-10 pt-8 sm:px-6">
          <p className="font-display text-[10px] font-semibold tracking-[0.28em] text-sage uppercase sm:text-xs">
            Join Swamp Force · Let them hear us now
          </p>
          <h1 className="mt-2 max-w-xl font-display leading-[0.95] font-bold tracking-wide uppercase text-[clamp(2.2rem,7vw,4.6rem)]">
            Save the nation.
          </h1>
          <p className="mt-3 max-w-md text-[clamp(0.95rem,2.2vw,1.25rem)] leading-snug text-fg/90">
            They work for us. The midterms are how we remind them.
            <br />
            Congress works for us — or we send them home.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 pb-2">
            <Button asChild>
              <Link to="/join">Join Swamp Force</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/scorecard">Congressional Scorecard</Link>
            </Button>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="border-b border-border bg-ink">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
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
              <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
                The lead · Featured dispatch
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {featured.dek}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/dispatch/$slug" params={{ slug: featured.slug }}>
                    Read the lead
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
            Congressional Scorecard
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Both parties failed. Charts. Sources. Not a speech.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/scorecard">
                Open the scorecard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The Search
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            Find them.
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                slug: "find-them",
                img: "/images/essay-find-them.jpg",
                t: "Find them.",
                d: "The kids they lost.",
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
                d: "Out of office. Off the ballot.",
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
