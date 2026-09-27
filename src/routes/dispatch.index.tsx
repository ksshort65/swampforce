import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeHead } from "@/lib/share-head";
import { getPost, START_HERE, JOURNAL } from "@/lib/content";
import { SCORE_TABS } from "@/lib/scorecard";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => homeHead(),
});

export function DispatchIndex() {
  const lead = getPost(START_HERE[0]);
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
            Midterm guide
          </p>
          <h1 className="mt-2 max-w-xl font-display leading-[0.95] font-bold tracking-wide uppercase text-[clamp(2.2rem,7vw,4.6rem)]">
            Vote the official record.
          </h1>
          <p className="mt-3 max-w-lg text-[clamp(0.95rem,2.2vw,1.25rem)] leading-snug text-fg/90">
            The midterms are a vote on the people in office and the people
            running to replace them. Judge them by the official record. Not
            by a speech. Not by a headline. The files here are government
            sources.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 pb-2">
            <Button asChild>
              <Link to="/dispatch/$slug" params={{ slug: "a-war-on-americans" }}>
                Lawfare
              </Link>
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
                The Republic
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

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The journal
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            The files
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Pick a file. Read it in order. The scorecard is the numbers.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNAL.map((section) => {
              const first = getPost(section.slugs[0]);
              return (
                <Link
                  key={section.name}
                  to="/dispatch/$slug"
                  params={{ slug: section.slugs[0] }}
                  className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
                >
                  <p className="font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">
                    {section.name}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold tracking-wide uppercase">
                    {first?.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {section.dek}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            In office · on the ballot
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            The record, before the vote
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            What the people in office did. What the people running are
            attached to. Republicans. Democrats. Split. The Oval. Charts
            or the bills. Government files only.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {SCORE_TABS.map((f) => (
              <div
                key={f.id}
                className="rounded-md border-2 border-sage bg-bg px-3 py-4 text-center"
              >
                <p className="font-display text-lg font-bold tracking-wide text-fg uppercase">
                  {f.k}
                </p>
                <p className="mt-1 text-sm text-muted">{f.v}</p>
                <div className="mt-3 grid grid-cols-1 gap-1">
                  <Link
                    to="/scorecard"
                    hash={`${f.id}-charts`}
                    className="flex min-h-11 items-center justify-center rounded-md border border-sage font-display text-xs font-bold tracking-wide text-fg uppercase no-underline hover:bg-ink"
                  >
                    Charts
                  </Link>
                  <Link
                    to="/scorecard"
                    hash={`${f.id}-read`}
                    className="flex min-h-11 items-center justify-center rounded-md border border-sage font-display text-xs font-bold tracking-wide text-fg uppercase no-underline hover:bg-ink"
                  >
                    Read
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
