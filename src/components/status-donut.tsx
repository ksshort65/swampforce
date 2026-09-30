import { useState, type ReactNode } from "react";
import { STATUS_INFO, STATUS_ORDER, statusOf, type Status } from "@/lib/verification";

export type StatusEntry = { id: string; label?: string };

/**
 * Layer 2: a donut of verification status (Green Verified, Red Debunked,
 * Yellow Needs Research) with a color key under it. Tapping a slice or a key
 * line shows that slice's evidence cards directly under the chart.
 */
export function StatusDonut({
  title,
  line,
  entries,
  renderCards,
}: {
  title: string;
  line?: string;
  entries: StatusEntry[];
  renderCards: (ids: string[], status: Status) => ReactNode;
}) {
  const [pick, setPick] = useState<Status | null>(null);
  const groups: Record<Status, StatusEntry[]> = { verified: [], debunked: [], research: [] };
  for (const e of entries) groups[statusOf(e.label).status].push(e);
  const total = entries.length;
  const R = 70;
  const C = 2 * Math.PI * R;
  let at = 0;
  const toggle = (s: Status) => setPick((p) => (p === s ? null : s));
  const labelsIn = (s: Status) => {
    const m = new Map<string, number>();
    for (const e of groups[s]) {
      const l = statusOf(e.label).label;
      m.set(l, (m.get(l) ?? 0) + 1);
    }
    return [...m.entries()];
  };
  return (
    <section className="mt-6 w-full" data-status-donut={title} data-status-total={total}>
      <h2 className="text-center text-[18px] font-semibold tracking-wide text-white">{title}</h2>
      {line ? <p className="mt-1 text-center text-[15px] text-white/75">{line}</p> : null}
      <div className="mt-4 w-full rounded-2xl border border-[#d4af37] bg-[#070b12] px-4 py-4">
        <div className="relative mx-auto w-full max-w-[280px]">
          <svg viewBox="0 0 200 200" className="block h-auto w-full" role="img" aria-label={`${title}: verification status`}>
            <circle cx="100" cy="100" r={R} fill="none" stroke="#1b2330" strokeWidth="34" />
            {total
              ? STATUS_ORDER.map((s) => {
                  const n = groups[s].length;
                  if (!n) return null;
                  const len = (n / total) * C;
                  const off = at;
                  at += len;
                  const on = pick === s;
                  return (
                    <circle
                      key={s}
                      data-status-slice={s}
                      data-count={n}
                      cx="100"
                      cy="100"
                      r={R}
                      fill="none"
                      stroke={STATUS_INFO[s].color}
                      strokeWidth={on ? 40 : 34}
                      strokeDasharray={`${len} ${C - len}`}
                      strokeDashoffset={-off}
                      transform="rotate(-90 100 100)"
                      style={{ cursor: "pointer", opacity: pick && !on ? 0.45 : 1 }}
                      onClick={() => toggle(s)}
                    >
                      <title>{`${STATUS_INFO[s].name}: ${n}`}</title>
                    </circle>
                  );
                })
              : null}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[30px] leading-none font-bold text-white">{total}</span>
            <span className="mt-1 text-[14px] text-white/80">{total === 1 ? "entry" : "entries"}</span>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          {STATUS_ORDER.map((s) => (
            <li key={s}>
              <button
                type="button"
                data-status-key={s}
                aria-pressed={pick === s}
                onClick={() => toggle(s)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl border-0 px-2 py-2 text-left text-[15px] font-semibold text-white hover:bg-white/5 ${pick === s ? "bg-white/10" : "bg-transparent"}`}
              >
                <span className="inline-block h-4 w-4 shrink-0 rounded-sm" style={{ background: STATUS_INFO[s].color }} />
                <span>
                  {STATUS_INFO[s].name}
                  <span className="font-normal text-white/80"> · {groups[s].length}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {pick ? (
        <div className="mt-4 w-full" data-status-evidence={pick}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[16px] font-semibold text-white">
              <span className="mr-2 inline-block h-3 w-3 rounded-sm align-middle" style={{ background: STATUS_INFO[pick].color }} />
              {STATUS_INFO[pick].name} · {groups[pick].length}
            </p>
            <button
              type="button"
              data-status-close
              onClick={() => setPick(null)}
              className="rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-1.5 text-[15px] font-semibold text-white"
            >
              Close
            </button>
          </div>
          {groups[pick].length ? (
            <p className="mt-1 text-[14px] leading-snug text-white/70">
              Labels in this slice: {labelsIn(pick).map(([l, n]) => `${l} (${n})`).join(" · ")}
            </p>
          ) : null}
          {groups[pick].length ? (
            renderCards(
              groups[pick].map((e) => e.id),
              pick,
            )
          ) : (
            <p className="mt-3 text-[15px] text-white/80">No entries in this slice.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
