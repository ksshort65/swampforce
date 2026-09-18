import { Link } from "@tanstack/react-router";
import { DispatchMenu } from "@/components/dispatch-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur-md">
      <p className="border-b border-border bg-surface py-1.5 text-center font-display text-[10px] font-semibold tracking-[0.2em] text-sage uppercase sm:text-xs">
        Save the nation. Secure the elections. Congress works for us — or we
        send them home.
      </p>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6">
        <Link to="/" className="flex items-center gap-1.5 text-fg no-underline">
          <img
            src="/images/logo.png"
            alt="Swamp Force"
            className="h-9 w-auto bg-white object-contain p-0.5 sm:h-11"
          />
          <span className="font-display text-[10px] font-semibold tracking-wide text-muted">
            ™
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          <div className="hidden min-w-52 sm:block">
            <DispatchMenu compact />
          </div>
          <Link
            to="/"
            className="font-display text-sm font-semibold tracking-[0.16em] text-fg/80 uppercase no-underline hover:text-sage"
          >
            Dispatch
          </Link>
          <Link
            to="/join"
            className="font-display text-sm font-semibold tracking-[0.16em] text-fg/80 uppercase no-underline hover:text-sage"
          >
            Join
          </Link>
        </nav>
      </div>
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <DispatchMenu compact />
      </div>
    </header>
  );
}
