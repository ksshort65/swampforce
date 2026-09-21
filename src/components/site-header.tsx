import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";
import { SCORE_FILES } from "@/lib/scorecard";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <p className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-border bg-surface px-6 py-1.5 text-center font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {SITE.kicker}
      </p>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-2">
        <Link
          to="/"
          className="inline-flex min-h-11 shrink-0 items-center text-fg no-underline"
        >
          <span className="font-display text-base font-bold tracking-wide uppercase">
            Swamp Force
          </span>
          <span className="ml-1 font-display text-[10px] font-semibold tracking-wide text-muted">
            ™
          </span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center justify-end">
          <details className="relative">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase hover:text-sage">
              Scorecard
            </summary>
            <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-md border border-border bg-bg p-2 shadow-lg">
              {SCORE_FILES.map((f) => (
                <Link
                  key={f.id}
                  to="/scorecard"
                  hash={f.id}
                  className="block rounded-md px-3 py-3 text-fg no-underline hover:bg-surface"
                >
                  <span className="font-display text-sm font-bold tracking-wide uppercase">
                    {f.k}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{f.v}</span>
                </Link>
              ))}
            </div>
          </details>
          <Link
            to="/pump"
            className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
          >
            Pump
          </Link>
          <Link
            to="/foreword"
            className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
          >
            Foreword
          </Link>
          <Link
            to="/archive"
            className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
          >
            Archive
          </Link>
        </nav>
      </div>
    </header>
  );
}
