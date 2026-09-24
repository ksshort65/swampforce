import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SITE, getPost, JOURNAL } from "@/lib/content";

function navLabel(name: string) {
  return name.replace(/^The /, "");
}

function NavDetails({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  function close() {
    if (ref.current) ref.current.open = false;
  }

  useEffect(() => {
    const current = ref.current;
    if (!current) return;
    const menu: HTMLDetailsElement = current;

    function onDoc(e: MouseEvent) {
      if (!menu.open) return;
      if (!menu.contains(e.target as Node)) menu.open = false;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") menu.open = false;
    }
    function onScroll() {
      if (menu.open) menu.open = false;
    }
    function onToggle() {
      if (!menu.open) return;
      document.querySelectorAll("header details").forEach((other) => {
        if (other !== menu) (other as HTMLDetailsElement).open = false;
      });
    }

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    menu.addEventListener("toggle", onToggle);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      menu.removeEventListener("toggle", onToggle);
    };
  }, []);

  return (
    <details ref={ref} className="relative">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase hover:text-sage [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <div
        className="absolute top-full left-0 z-50 mt-1 max-h-[70vh] w-72 overflow-y-auto rounded-md border border-border bg-bg p-1.5 shadow-lg"
        onClick={close}
      >
        {children}
      </div>
    </details>
  );
}

function Item({
  to,
  hash,
  params,
  title,
  dek,
}: {
  to: string;
  hash?: string;
  params?: { slug: string };
  title: string;
  dek?: string;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      params={params}
      className="block rounded-md px-3 py-2.5 text-fg no-underline hover:bg-surface"
    >
      <span className="block font-display text-sm font-semibold leading-snug tracking-wide uppercase">
        {title}
      </span>
      {dek ? <span className="mt-0.5 block text-xs leading-snug text-muted">{dek}</span> : null}
    </Link>
  );
}

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
          {JOURNAL.map((section) =>
            section.slugs.length === 1 ? (
              <Link
                key={section.name}
                to="/dispatch/$slug"
                params={{ slug: section.slugs[0] }}
                className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
              >
                {navLabel(section.name)}
              </Link>
            ) : (
              <NavDetails key={section.name} label={navLabel(section.name)}>
                {section.slugs.map((slug) => {
                  const p = getPost(slug);
                  if (!p) return null;
                  return (
                    <Item
                      key={slug}
                      to="/dispatch/$slug"
                      params={{ slug }}
                      title={p.title}
                    />
                  );
                })}
              </NavDetails>
            ),
          )}
          <Link
            to="/dispatch/$slug"
            params={{ slug: "the-media-ledger" }}
            hash="j6"
            className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
          >
            J6
          </Link>
          <Link
            to="/scorecard"
            className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
          >
            Scorecard
          </Link>
          <NavDetails label="Pump">
            <div className="grid grid-cols-2 gap-1 p-2">
              <Link
                to="/pump"
                hash="charts"
                className="flex min-h-10 items-center justify-center rounded-md border border-border px-2 font-display text-xs font-semibold tracking-wide text-fg uppercase no-underline hover:border-sage"
              >
                Charts
              </Link>
              <Link
                to="/pump"
                hash="read"
                className="flex min-h-10 items-center justify-center rounded-md border border-border px-2 font-display text-xs font-semibold tracking-wide text-fg uppercase no-underline hover:border-sage"
              >
                Read
              </Link>
            </div>
          </NavDetails>
          <Link
            to="/foreword"
            className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
          >
            Foreword
          </Link>
        </nav>
      </div>
    </header>
  );
}
