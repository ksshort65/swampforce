import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CHAPTERS } from "@/lib/flow";

export function HowPath() {
  return (
    <ol className="space-y-4">
      {CHAPTERS.map((c) => (
        <li key={c.slug}>
          <Link
            to="/dispatch/$slug"
            params={{ slug: c.slug }}
            className="group flex gap-5 rounded-lg bg-surface p-5 text-fg no-underline outline-offset-2 hover:outline hover:outline-sage sm:p-7"
          >
            <span className="font-display text-sm font-bold tracking-wide text-sage sm:text-base">
              {c.n}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-3">
                <span className="font-display text-xl font-bold tracking-wide uppercase sm:text-2xl">
                  {c.title}
                </span>
                <ArrowRight className="mt-1 size-5 shrink-0 text-sage opacity-70 group-hover:opacity-100" />
              </span>
              <span className="mt-2 block text-base leading-relaxed text-muted">
                {c.dek}
              </span>
              <span className="mt-3 block font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">
                Read this
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
