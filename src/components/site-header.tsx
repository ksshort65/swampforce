import { Link } from "@tanstack/react-router";
import { SITE, FAKE_NEWS_SLUGS, getPost } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-border bg-bg">
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex min-h-11 shrink-0 items-center text-fg no-underline"
        >
          <span className="font-display text-xl font-bold tracking-[0.14em] uppercase sm:text-2xl">
            Swamp Force
          </span>
          <span className="ml-1 font-display text-[10px] font-semibold tracking-wide text-muted">
            ™
          </span>
        </Link>
        <p className="ml-auto min-w-0 max-w-[48%] text-right font-display text-[11px] font-semibold leading-snug tracking-[0.12em] text-sage uppercase sm:max-w-[55%] sm:text-xs sm:tracking-[0.14em]">
          {SITE.kicker}
        </p>
      </div>
      <div className="mx-auto flex max-w-6xl items-center overflow-visible px-4 py-1 sm:px-6">
        <nav className="flex flex-wrap items-center overflow-visible">
          {["Republic", "Under Construction", "Democrats", "Republicans", "Congress", "Border", "Remedy", "J6", "Scorecard", "Pump", "Foreword"].map(
            (label) =>
              label === "Under Construction" ? (
                <details key={label} className="relative">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase hover:text-sage [&::-webkit-details-marker]:hidden">
                    {label}
                  </summary>
                  <div className="absolute top-full left-0 z-50 mt-1 max-h-[70vh] w-72 overflow-y-auto rounded-md border border-border bg-bg p-1.5 shadow-lg">
                    {FAKE_NEWS_SLUGS.map((slug) => {
                      const post = getPost(slug);
                      if (!post) return null;
                      return (
                        <Link
                          key={slug}
                          to="/dispatch/$slug"
                          params={{ slug }}
                          className="block rounded-md px-3 py-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:bg-surface"
                        >
                          {post.title}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              ) : (
                <span
                  key={label}
                  className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase"
                >
                  {label}
                </span>
              ),
          )}
        </nav>
      </div>
    </header>
  );
}
