import { useState, type ReactNode } from "react";
import { CHARTS } from "@/lib/scorecard";

const EXTRA: Record<string, { label: string; href: string }[]> = {
  "/images/chart-iran.jpg": [
    { label: "IAEA GOV/2026/50", href: "https://www.iaea.org/sites/default/files/gov2026-50.pdf" },
    { label: "IAEA — Iran", href: "https://www.iaea.org/topics/iran" },
  ],
  "/images/chart-iran-dead.jpg": [
    { label: "State — sponsors of terrorism", href: "https://www.state.gov/state-sponsors-of-terrorism/" },
    { label: "Country Reports on Terrorism 2024", href: "https://www.state.gov/reports/country-reports-on-terrorism-2024" },
  ],
  "/images/chart-pump-flow.jpg": [
    { label: "EIA — the gallon", href: "https://www.eia.gov/petroleum/gasdiesel/" },
    { label: "OPEC", href: "https://www.opec.org/opec_web/en/about_us/25.htm" },
  ],
  "/images/chart-pump-admins.jpg": [
    { label: "Obama — EIA week of May 9, 2011", href: "https://www.eia.gov/petroleum/gasdiesel/" },
    { label: "Trump 1 — EIA week of May 21, 2018", href: "https://www.eia.gov/petroleum/gasdiesel/" },
    { label: "Biden — EIA week of June 13, 2022", href: "https://www.eia.gov/petroleum/gasdiesel/" },
    { label: "Trump 2 — EIA", href: "https://www.eia.gov/petroleum/gasdiesel/" },
  ],
};

export function OpenChart({
  title,
  src,
  alt,
  children,
}: {
  title: string;
  src: string;
  alt?: string;
  children?: ReactNode;
}) {
  const sources = EXTRA[src] ?? CHARTS.find((c) => c.src === src)?.sources ?? [];
  const [open, setOpen] = useState(false);
  const top = 18;
  const span = 70;
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-surface">
      <figcaption className="border-b border-border px-4 py-3 font-display text-sm font-bold tracking-wide text-fg uppercase">
        {title}
      </figcaption>
      <div className="relative">
        <img src={src} alt={alt ?? title} className="h-auto w-full" />
        {sources.map((s, i) => (
          <a
            key={s.href + s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            title={s.label}
            style={{ top: `${top + (span / sources.length) * i}%`, height: `${span / sources.length}%` }}
            className="group absolute inset-x-0 hover:bg-white/20"
          >
            <span className="pointer-events-none absolute top-1 right-2 hidden rounded bg-black/85 px-2 py-1 font-display text-[11px] font-semibold tracking-wide text-white uppercase group-hover:block">
              {s.label}
            </span>
          </a>
        ))}
      </div>
      {sources.length ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border px-4 py-3">
          {sources.map((s) => (
            <a
              key={s.href + s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-display text-[11px] font-bold tracking-[0.12em] text-sage uppercase underline decoration-sage underline-offset-2"
            >
              {s.label}
            </a>
          ))}
        </div>
      ) : null}
      {children ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full border-t border-border px-4 py-3 text-left font-display text-[11px] font-bold tracking-[0.14em] text-fg uppercase"
          >
            {open ? "Close" : "The short version"}
          </button>
          {open ? (
            <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted">{children}</div>
          ) : null}
        </>
      ) : null}
    </figure>
  );
}
