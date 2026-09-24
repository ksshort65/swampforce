import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { SITE, NAV_MENUS, getPost } from "@/lib/content";

function NavMenu({ label, slugs }: { label: string; slugs: readonly string[] }) {
  const ref = useRef<HTMLDetailsElement>(null);

  function close() {
    if (ref.current) ref.current.open = false;
  }

  useEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const el: HTMLDetailsElement = menu;

    function onDoc(e: MouseEvent) {
      if (!el.open) return;
      if (!el.contains(e.target as Node)) el.open = false;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") el.open = false;
    }
    function onScroll() {
      if (el.open) el.open = false;
    }

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (label === "J6" && slugs[0]) {
    const slug = slugs[0];
    return (
      <Link
        to="/dispatch/$slug"
        params={{ slug }}
        className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase no-underline hover:text-sage"
      >
        {label}
      </Link>
    );
  }
  if (!slugs.length) {
    return (
      <span className="inline-flex min-h-11 shrink-0 items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase">
        {label}
      </span>
    );
  }

  return (
    <details ref={ref} className="relative">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center px-2.5 font-display text-sm font-semibold tracking-wide text-fg uppercase hover:text-sage [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <div
        className="absolute top-full left-0 z-50 mt-1 max-h-[70vh] w-72 overflow-y-auto rounded-md border border-border bg-bg p-1.5 shadow-lg"
        onClick={close}
      >
        {slugs.map((slug) => {
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
          {NAV_MENUS.map((menu) => (
            <NavMenu key={menu.label} label={menu.label} slugs={menu.slugs} />
          ))}
        </nav>
      </div>
    </header>
  );
}