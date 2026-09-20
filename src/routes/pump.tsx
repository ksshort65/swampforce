import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ADMINS,
  MARKS,
  PUMP_CHARTS,
  PUMP_SOURCES,
  PUMP_UPDATED,
} from "@/lib/pump";

export const Route = createFileRoute("/pump")({
  component: PumpPage,
  head: () => ({
    meta: [
      { title: "The pump — four administrations — Swamp Force" },
      {
        name: "description",
        content:
          "EIA weekly gasoline and diesel. Last four administrations. A president is not OPEC.",
      },
    ],
  }),
});

function PumpPage() {
  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            <Link to="/scorecard" className="text-sage no-underline">
              Scorecard
            </Link>
            {" · "}The pump · EIA · updated {PUMP_UPDATED}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
            The gallon, four Oval offices.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">
            A president is not OPEC. Crude is a world market. The pump is still
            what a paycheck meets. EIA weekly retail. No network. No caption.
            2026 is year-to-date.
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

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="font-display text-[11px] tracking-[0.16em] text-sage uppercase">
                  <th className="border-b border-border py-3 pr-4 font-semibold">
                    Administration
                  </th>
                  <th className="border-b border-border py-3 pr-4 font-semibold">
                    Gasoline
                  </th>
                  <th className="border-b border-border py-3 pr-4 font-semibold">
                    Diesel
                  </th>
                  <th className="border-b border-border py-3 font-semibold">
                    WTI crude
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
                    <td className="border-b border-border py-3 pr-4 font-display text-lg">
                      ${a.gas.toFixed(2)}
                    </td>
                    <td className="border-b border-border py-3 pr-4 font-display text-lg">
                      ${a.diesel.toFixed(2)}
                    </td>
                    <td className="border-b border-border py-3 font-display text-lg">
                      ${a.wti}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MARKS.map((m) => (
              <a
                key={m.k}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-border p-4 no-underline hover:border-sage"
              >
                <p className="font-display text-[11px] font-semibold tracking-[0.16em] text-sage uppercase">
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
            . Calendar years sit with the Oval that held most of the year. WTI
            is dollars per barrel. Pump prices include tax.
          </p>
        </div>
      </section>
    </main>
  );
}
