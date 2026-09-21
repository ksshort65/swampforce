import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ADMINS,
  GALLON_STACK,
  MARKS,
  OPEC_FILE,
  PUMP_CHARTS,
  PUMP_SOURCES,
  PUMP_UPDATED,
  RULES_FILE,
  TAX_FILE,
} from "@/lib/pump";

export const Route = createFileRoute("/pump")({
  component: PumpPage,
  head: () => ({
    meta: [
      { title: "The pump — four administrations — Swamp Force" },
      {
        name: "description",
        content:
          "What is in a gallon: crude, OPEC and OPEC+, refining, shipping, federal and state tax. EIA.",
      },
    ],
  }),
});

function PumpPage() {
  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            <Link to="/scorecard" className="text-sage no-underline">
              Scorecard
            </Link>
            {" · "}The pump · EIA · updated {PUMP_UPDATED}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
            The gallon
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed">
            EIA splits the retail gallon into four parts: crude oil, refining,
            distribution and marketing, and taxes. The table below is the
            highest EIA weekly print in that Oval — not a four-year average.
            A four-year average is how $5.006 disappears. Week of June 13,
            2022, under Biden: U.S. regular gasoline $5.006 a gallon. Diesel
            that same month: $5.810. WTI is West Texas Intermediate, the U.S.
            price of a 42-gallon barrel of crude, traded in Cushing, Oklahoma.
          </p>

          <div className="mt-12 space-y-16">
            {PUMP_CHARTS.map((c) => (
              <figure key={c.src}>
                <img
                  src={c.src}
                  alt={c.title}
                  className="w-full rounded-md border border-border"
                />
              </figure>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {GALLON_STACK.items.map((row) => (
              <a
                key={row.k}
                href={GALLON_STACK.href}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
              >
                <p className="font-display text-xs font-semibold leading-snug tracking-wide text-sage uppercase">
                  {row.k} · {GALLON_STACK.asOf}
                </p>
                <p className="mt-2 font-display text-3xl font-bold tracking-wide">
                  {row.amt}
                </p>
                <p className="mt-1 text-sm text-muted">{row.pct} of {GALLON_STACK.retail}</p>
                <p className="mt-3 text-sm leading-relaxed">{row.note}</p>
              </a>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold tracking-wide uppercase">
              {OPEC_FILE.k}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed">{OPEC_FILE.v}</p>
            <p className="mt-4 font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase">
              <a
                href={OPEC_FILE.opec}
                target="_blank"
                rel="noreferrer"
                className="text-sage no-underline hover:text-fg"
              >
                OPEC — who sits at the table →
              </a>
              {" · "}
              <a
                href={OPEC_FILE.href}
                target="_blank"
                rel="noreferrer"
                className="text-sage no-underline hover:text-fg"
              >
                EIA STEO — OPEC+ production →
              </a>
            </p>
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold tracking-wide uppercase">
              {TAX_FILE.k}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed">{TAX_FILE.v}</p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="font-display text-[11px] tracking-[0.16em] text-sage uppercase">
                    <th className="border-b border-border py-3 pr-4 font-semibold">Tax</th>
                    <th className="border-b border-border py-3 pr-4 font-semibold">Cents per gallon</th>
                    <th className="border-b border-border py-3 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {TAX_FILE.rows.map((r) => (
                    <tr key={r.k}>
                      <td className="border-b border-border py-3 pr-4">{r.k}</td>
                      <td className="border-b border-border py-3 pr-4 font-display text-lg">{r.amt}</td>
                      <td className="border-b border-border py-3 text-muted">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed">{TAX_FILE.find}</p>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={TAX_FILE.table}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center font-display text-sm font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
                >
                  EIA — Federal and State Motor Fuel Taxes (spreadsheet) →
                </a>
              </li>
              <li>
                <a
                  href={TAX_FILE.page}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center font-display text-sm font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
                >
                  EIA — Gasoline and Diesel Fuel Update →
                </a>
              </li>
              <li>
                <a
                  href={TAX_FILE.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center font-display text-sm font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
                >
                  EIA — state motor-fuel taxes, January 2026 →
                </a>
              </li>
              <li>
                <a
                  href={TAX_FILE.fhwa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center font-display text-sm font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
                >
                  FHWA Highway Statistics — motor fuel (Table MF-121T) →
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold tracking-wide uppercase">
              {RULES_FILE.k}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed">{RULES_FILE.v}</p>
            <p className="mt-4 font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase">
              <a
                href={RULES_FILE.eia}
                target="_blank"
                rel="noreferrer"
                className="text-sage no-underline hover:text-fg"
              >
                EIA — factors affecting gasoline prices →
              </a>
              {" · "}
              <a
                href={RULES_FILE.href}
                target="_blank"
                rel="noreferrer"
                className="text-sage no-underline hover:text-fg"
              >
                CRS — gasoline prices →
              </a>
            </p>
          </div>

          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="font-display text-[11px] tracking-[0.16em] text-sage uppercase">
                  <th className="border-b border-border py-3 pr-4 font-semibold">
                    Administration
                  </th>
                  <th className="border-b border-border py-3 pr-4 font-semibold">
                    Peak gasoline
                  </th>
                  <th className="border-b border-border py-3 pr-4 font-semibold">
                    Peak diesel
                  </th>
                  <th className="border-b border-border py-3 font-semibold">
                    Peak WTI, $ per barrel
                  </th>
                </tr>
              </thead>
              <tbody>
                {ADMINS.map((a) => (
                  <tr key={a.who}>
                    <td className="border-b border-border py-3 pr-4">
                      {a.who}
                      <span className="ml-2 text-muted">{a.when}</span>
                    </td>
                    <td className="border-b border-border py-3 pr-4">
                      <span className="font-display text-lg">${a.gas.toFixed(2)}</span>
                      <span className="mt-1 block text-xs text-muted">{a.gasWhen}</span>
                    </td>
                    <td className="border-b border-border py-3 pr-4">
                      <span className="font-display text-lg">${a.diesel.toFixed(2)}</span>
                      <span className="mt-1 block text-xs text-muted">{a.dieselWhen}</span>
                    </td>
                    <td className="border-b border-border py-3">
                      <span className="font-display text-lg">${a.wti.toFixed(2)}</span>
                      <span className="mt-1 block text-xs text-muted">{a.wtiWhen}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MARKS.map((m) => (
              <a
                key={m.k}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-border p-4 no-underline hover:border-sage"
              >
                <p className="font-display text-[11px] font-semibold leading-snug tracking-wide text-sage uppercase">
                  {m.k}
                </p>
                <p className="mt-2 text-sm leading-snug">{m.v}</p>
              </a>
            ))}
          </div>

          <p className="mt-10 text-[12px] leading-relaxed text-muted">
            Sources:{" "}
            {PUMP_SOURCES.map((s, i) => (
              <span key={s.href}>
                {i > 0 ? " · " : null}
                <a
                  href={s.href}
                  className="text-sage no-underline hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              </span>
            ))}
            . Calendar years sit with the Oval that held most of the year.
            WTI is West Texas Intermediate: dollars for one 42-gallon barrel of
            U.S. crude oil, before it is gasoline. Pump prices include tax.
          </p>
        </div>
      </section>
    </main>
  );
}
