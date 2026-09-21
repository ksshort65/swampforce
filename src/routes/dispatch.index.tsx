import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeHead } from "@/lib/share-head";
import { getLatest } from "@/lib/content";
import { SCORE_TABS } from "@/lib/scorecard";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => homeHead(),
});

function published(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DispatchIndex() {
  const latest = getLatest(8);
  const lead = latest[0];
  const rest = latest.slice(1);
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
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The journal · publishing
          </p>
          <h1 className="mt-2 max-w-xl font-display leading-[0.95] font-bold tracking-wide uppercase text-[clamp(2.2rem,7vw,4.6rem)]">
            We the People.
          </h1>
          <p className="mt-3 max-w-lg text-[clamp(0.95rem,2.2vw,1.25rem)] leading-snug text-fg/90">
            This country is not Congress’s. They are the hire. They have
            gone rogue. Do not vote on emotion, on manufactured hatred, or
            on a network’s words. Vote the facts. This journal uses
            documented government sources. No other opinion. No
            manufactured drama.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 pb-2">
            {lead ? (
              <Button asChild>
                <Link to="/dispatch/$slug" params={{ slug: lead.slug }}>
                  Latest dispatch
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/scorecard">Scorecard</Link>
            </Button>
          </div>
        </div>
      </section>

      {lead ? (
        <section className="border-b border-border bg-ink">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 md:grid-cols-2">
            <Link
              to="/dispatch/$slug"
              params={{ slug: lead.slug }}
              className="block text-fg no-underline"
            >
              <img
                src={lead.image}
                alt={lead.imageAlt}
                className="aspect-video w-full rounded-lg object-cover"
              />
            </Link>
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
                Just published · {published(lead.date)}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
                {lead.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {lead.dek}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/dispatch/$slug" params={{ slug: lead.slug }}>
                    {lead.title}
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
            The dispatch
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            Publishing now
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                to="/dispatch/$slug"
                params={{ slug: p.slug }}
                className="block text-fg no-underline"
              >
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <p className="mt-3 font-display text-[11px] tracking-[0.16em] text-muted uppercase">
                  {published(p.date)}
                </p>
                <p className="mt-1 font-display text-xl font-semibold tracking-wide uppercase">
                  {p.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.dek}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild>
              <Link to="/archive">
                The archive
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            Midterms
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            The scorecard
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Vote the facts. Every number is a government file.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {SCORE_TABS.map((f) => (
              <Link
                key={f.id}
                to="/scorecard"
                hash={`${f.id}-charts`}
                className="flex min-h-16 items-center justify-center rounded-md border-2 border-sage bg-bg px-3 py-4 text-center font-display text-sm font-bold tracking-wide text-fg uppercase no-underline hover:bg-ink"
              >
                {f.k}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
