import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DispatchMenu } from "@/components/dispatch-menu";
import { homeHead } from "@/lib/share-head";

export const Route = createFileRoute("/dispatch/")({
  component: DispatchIndex,
  head: () => homeHead(),
});

export function DispatchIndex() {
  return (
    <main>
      <section className="relative h-svh w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-capitol.jpg"
            alt="Eagle on the Capitol in the swamp"
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-transparent" />
        </div>
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-4 py-[max(1rem,2svh)] sm:px-6">
          <p className="font-display text-sm font-bold tracking-[0.22em] text-fg uppercase">
            Swamp Force™
          </p>
          <div className="pb-[max(0.5rem,1svh)]">
            <p className="font-display text-[10px] font-semibold tracking-[0.28em] text-sage uppercase sm:text-xs">
              Join Swamp Force · Let them hear us now
            </p>
            <h1 className="mt-2 max-w-xl font-display leading-[0.95] font-bold tracking-wide uppercase text-[clamp(2.25rem,7vw,4.75rem)]">
              Save the nation.
            </h1>
            <p className="mt-3 max-w-md text-[clamp(0.95rem,2.2vw,1.25rem)] leading-snug text-fg/90">
              Save the nation. Secure the elections.
              <br />
              Congress works for us — or we send them home.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/join">
                  Join Swamp Force
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/scorecard">Congressional Scorecard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            Start here
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            They forgot who they work for.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Congress is paid by you. Some of them talk like they are at war
            with you. Open the first essay. Four minutes. Then vote like the
            country is on the ballot — because it is.
          </p>
          <div className="mt-8 max-w-xl">
            <DispatchMenu />
          </div>
          <Link
            to="/dispatch/$slug"
            params={{ slug: "that-is-not-why-they-are-elected" }}
            className="group mt-8 block max-w-md text-fg no-underline"
          >
            <img
              src="/images/essay-not-why.jpg"
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="mt-3 font-display text-xl font-semibold tracking-wide uppercase">
              They forgot who they work for.
            </p>
            <p className="mt-1 text-sm text-muted">
              He said break your spirit. On camera.
            </p>
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            {
              n: "$40T",
              t: "What America owes. They will not pass a real budget.",
              slug: "the-debt-they-will-not-close",
            },
            {
              n: "$5B",
              t: "Lobbyists paid last year to own the building you pay for.",
              slug: "what-they-are-protecting",
            },
            {
              n: "$7.3B",
              t: "What you pay Congress to work part-time and fight each other.",
              slug: "the-7-billion-machine",
            },
            {
              n: "$200",
              t: "The fine if they file a stock trade late. Nobody gets charged.",
              slug: "what-they-are-protecting",
            },
          ].map((c) => (
            <Link
              key={c.n + c.slug}
              to="/dispatch/$slug"
              params={{ slug: c.slug }}
              className="text-fg no-underline"
            >
              <p className="font-display text-4xl font-bold tracking-wide tabular-nums sm:text-5xl">
                {c.n}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.t}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The Search
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            Find them.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Three hundred thousand children still unaccounted for. Three
            essays: what they endure, who got paid, and why defund ICE is
            the tell.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                slug: "find-them",
                img: "/images/essay-find-them.jpg",
                t: "Find them.",
                d: "The missing-persons file.",
              },
              {
                slug: "who-got-paid",
                img: "/images/essay-who-got-paid.jpg",
                t: "Who got paid.",
                d: "Up to $13 billion in one year.",
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
                className="group block text-fg no-underline"
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

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The Hearing
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            Show the slides. Post the stack.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            GOP, Democrats, DSA. A budget the public can read. Full time or
            resign. Medicare for all and reparations do not fit in the
            country — the arithmetic is on the scorecard.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                slug: "the-noise",
                img: "/images/essay-the-noise.jpg",
                t: "The noise.",
                d: "Talk without a ledger.",
              },
              {
                slug: "they-sold-the-split",
                img: "/images/essay-they-sold-the-split.jpg",
                t: "They sold the split.",
                d: "Division is the product.",
              },
              {
                slug: "full-time-or-go-home",
                img: "/images/essay-full-time.jpg",
                t: "Full time or go home.",
                d: "$7.258B. Part-time floor.",
              },
              {
                slug: "the-whole-bill",
                img: "/images/essay-show-the-slides.jpg",
                t: "The whole bill.",
                d: "How you force the stack.",
              },
              {
                slug: "it-does-not-fit",
                img: "/images/essay-it-does-not-fit.jpg",
                t: "It does not fit.",
                d: "$34T extra federal. No second America.",
              },
              {
                slug: "the-check-they-will-not-write",
                img: "/images/essay-the-check.jpg",
                t: "The check they will not write.",
                d: "Reparations as a loyalty test. $16T floor.",
              },
            ].map((p) => (
              <Link
                key={p.slug}
                to="/dispatch/$slug"
                params={{ slug: p.slug }}
                className="group block text-fg no-underline"
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

      <section className="border-b border-border bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            The Ballot
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            A barcode is not a lock.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            The same USPS they called sabotaged they called the courier of the
            most secure election in history. Tracking is not identity.
          </p>
          <div className="mt-8 max-w-md">
            <Link
              to="/dispatch/$slug"
              params={{ slug: "a-barcode-is-not-a-lock" }}
              className="group block text-fg no-underline"
            >
              <img
                src="/images/essay-barcode.jpg"
                alt=""
                className="aspect-video w-full rounded-lg object-cover"
              />
              <p className="mt-3 font-display text-xl font-semibold tracking-wide uppercase">
                A barcode is not a lock.
              </p>
              <p className="mt-1 text-sm text-muted">A truck is not a precinct.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            Midterms
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
            If they get the gavel
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            GOP. Democrats. DSA — 282 names on the ballot. Congress holds the
            purse. $40T. Open the card.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/scorecard">
                Open the congressional scorecard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              First
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-wide uppercase">
              They used the country
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              You pay the legislative branch $7.258 billion a year — Public Law
              119-37, FY2026. They have not finished a budget on time since
              Clinton. The debt crossed $40 trillion. An unread omnibus is a
              door for fraud.
            </p>
            <Link
              to="/dispatch/$slug"
              params={{ slug: "the-7-billion-machine" }}
              className="mt-4 inline-block font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase no-underline hover:text-fg"
            >
              The $7 billion machine →
            </Link>
          </div>
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              Then
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-wide uppercase">
              Self-defense
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              They loved the donor. When the checks might stop, and a
              pragmatist might actually close the problems they lived on, they
              did not debate. They went after the whole country — clips,
              captions, hoaxes paid for with your money — so nobody would
              notice the racket.
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              Now
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-wide uppercase">
              Pull it together
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              The other jersey is not the enemy. The syndicate is: the unread
              bill, the $5 billion lobby, the $200 trade, the DA race you did
              not know was for sale. The file names them. Politics will not
              fix a shop that writes its own rules. A united people, peaceful,
              on the record — or it does not happen.
            </p>
            <Link
              to="/dispatch/$slug"
              params={{ slug: "what-we-can-do" }}
              className="mt-4 inline-block font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase no-underline hover:text-fg"
            >
              What we can do →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
