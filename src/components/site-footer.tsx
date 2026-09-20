import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-8 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-8">
        <div>
          <p className="font-display text-base font-bold tracking-[0.14em] text-fg uppercase">
            {SITE.mark}
          </p>
          <p className="mt-2 max-w-xs">{SITE.tagline} No PAC.</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-3">
          <Link
            to="/scorecard"
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            Scorecard
          </Link>
          <Link
            to="/pump"
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            Pump
          </Link>
          <Link
            to="/foreword"
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            Foreword
          </Link>
          <Link
            to="/archive"
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            Archive
          </Link>
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            Merch
          </Link>
          <Link
            to="/join"
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            Join
          </Link>
          <a
            href={`https://x.com/${SITE.xHandle}`}
            className="inline-flex min-h-11 items-center text-sage no-underline hover:text-fg"
          >
            @{SITE.xHandle}
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-4 max-w-6xl">
        {SITE.copyright} · {SITE.author}
      </p>
    </footer>
  );
}
