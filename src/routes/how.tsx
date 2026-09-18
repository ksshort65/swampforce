import { createFileRoute, Link } from "@tanstack/react-router";
import { HowPath } from "@/components/how-path";

export const Route = createFileRoute("/how")({ component: HowPage });

function HowPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        How we got here
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-wide uppercase sm:text-6xl">
        How we got here
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        They already had the country. A donor they liked started looking like
        a man who might take the machine apart. They went after all of us
        first. Five chapters. Read them in order.
      </p>
      <div className="mt-12">
        <HowPath />
      </div>
      <p className="mt-14 font-display text-xs tracking-[0.18em] text-muted uppercase">
        <Link to="/dispatch" className="text-sage no-underline">
          ← The Dispatch
        </Link>
      </p>
    </main>
  );
}
