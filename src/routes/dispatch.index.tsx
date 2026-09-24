import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { homeHead } from "@/lib/share-head";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => homeHead(),
});

export function DispatchIndex() {
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
            <Button type="button">Lawfare</Button>
          </div>
        </div>
      </section>
    </main>
  );
}