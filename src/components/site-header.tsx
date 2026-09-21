import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

const LINKS = [
  { to: "/scorecard" as const, label: "Scorecard" },
  { to: "/pump" as const, label: "Pump" },
  { to: "/foreword" as const, label: "Foreword" },
  { to: "/archive" as const, label: "Archive" },
];

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
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
