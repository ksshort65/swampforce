import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.14em] uppercase">
            {SITE.mark}
          </p>
          <p className="mt-2 font-display text-xs tracking-[0.16em] text-muted uppercase">
            <Link to="/dispatch" className="text-sage no-underline hover:text-fg">
              Dispatch
            </Link>
            <span className="mx-2 text-border-strong">·</span>
            <Link to="/join" className="text-sage no-underline hover:text-fg">
              Join
            </Link>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Save the nation. Secure the elections.
            Congress works for us — or we send them home. No PAC.
          </p>
        </div>
        <div>
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
            Journal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/scorecard" className="text-fg no-underline hover:text-sage">
                Congressional Scorecard
              </Link>
            </li>
            <li>
              <Link to="/join" className="text-fg no-underline hover:text-sage">
                Join Swamp Force
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-fg no-underline hover:text-sage">
                About
              </Link>
            </li>
            <li>
              <Link to="/copyright" className="text-fg no-underline hover:text-sage">
                Copyright
              </Link>
            </li>
            <li>
              <a
                href={`https://x.com/${SITE.xHandle}`}
                className="text-fg no-underline hover:text-sage"
              >
                @{SITE.xHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-fg no-underline hover:text-sage">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 font-display text-xs tracking-[0.14em] text-muted uppercase sm:px-6">
          <span>
            {SITE.copyright}
          </span>
          <span>
            {SITE.mark} · {SITE.author}
          </span>
        </p>
      </div>
    </footer>
  );
}
