import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

const LINKS = [
  { to: "/scorecard" as const, label: "Scorecard" },
  { to: "/pump" as const, label: "Pump" },
  { to: "/foreword" as const, label: "Foreword" },
  { to: "/archive" as const, label: "Archive" },
  { to: "/shop" as const, label: "Merch" },
  { to: "/join" as const, label: "Join" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <p className="border-b border-border bg-surface px-3 py-1.5 text-center font-display text-[10px] font-semibold tracking-[0.14em] text-sage uppercase sm:text-xs sm:tracking-[0.2em]">
        {SITE.tagline}
      </p>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center text-fg no-underline"
        >
          <span className="font-display text-sm font-bold tracking-[0.18em] uppercase sm:text-base">
            Swamp Force
          </span>
          <span className="ml-1 font-display text-[10px] font-semibold tracking-wide text-muted">
            ™
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="inline-flex min-h-11 items-center px-3 font-display text-sm font-semibold tracking-[0.14em] text-fg uppercase no-underline hover:text-sage"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
