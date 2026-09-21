import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BORDER,
  BORDER_MOVE,
  BORDER_HARM,
  BENEFITS,
  WORKER,
  OVAL,
  OVAL_LINKS,
  CHARTS,
  COMPARE_CHARTS,
  COMPARE_WIDE,
  DEBT_MATH,
  DEBT_NOW,
  DEBT_TALLY,
  DRIVERS,
  PRICES,
  RECORD,
  SCORE_UPDATED,
} from "@/lib/scorecard";

type Tab = "gop" | "dem" | "split" | "oval" | "compare" | null;

function BillList({
  rows,
  tone,
}: {
  rows: { k: string; bill: string; href: string }[];
  tone: "plus" | "minus";
}) {
  return (
    <ul className="mt-3 space-y-3">
      {rows.map((p) => (
        <li key={p.href + p.k}>
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className={
              tone === "plus"
                ? "block min-h-14 rounded-md border border-border bg-surface px-4 py-4 text-fg no-underline hover:border-sage"
                : "block min-h-14 rounded-md border border-border px-4 py-4 text-fg no-underline hover:border-sage"
            }
          >
            <p className="text-base font-medium leading-snug">{p.k}</p>
            <p className="mt-1 font-display text-[11px] tracking-[0.12em] text-sage uppercase">
              {p.bill} →
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}

function PartyFile({ col }: { col: (typeof RECORD)[number] }) {
  const tally = DEBT_TALLY.find((t) =>
    col.id === "gop" ? t.who.startsWith("Republicans") : t.who.startsWith("Democrats"),
  );
  return (
    <div>
      <p className="font-display text-xl font-bold tracking-[0.18em] text-sage uppercase">
        {col.party}
      </p>
      {tally ? (
        <p className="mt-3 font-display text-3xl font-bold tracking-wide">
          {tally.added}
        </p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-muted">{col.control}</p>
      <p className="mt-2 text-sm leading-relaxed">{col.debt}</p>
      {col.id === "dem" ? <BorderFile /> : null}
      {col.id === "dem" ? <BorderMove /> : null}
      {col.id === "dem" ? <BorderHarm /> : null}
      {col.id === "dem" ? (
        <figure className="mt-5">
          <img
            src="/images/chart-border.jpg"
            alt="The open border — by administration"
            className="h-auto w-full rounded-md border border-border"
          />
        </figure>
      ) : null}
      {col.id === "dem" ? (
        <figure className="mt-5">
          <img
            src="/images/chart-border-all.jpg"
            alt="Nationwide encounters — every path CBP counts"
            className="h-auto w-full rounded-md border border-border"
          />
        </figure>
      ) : null}
      {col.id === "dem" ? (
        <figure className="mt-5">
          <img
            src="/images/chart-border-toll.jpg"
            alt="What Americans still pay — the open border bill"
            className="h-auto w-full rounded-md border border-border"
          />
        </figure>
      ) : null}
      {col.id === "dem" ? <BenefitsStack /> : null}
      {col.id === "dem" ? <WorkerFile /> : null}
      {col.id === "dem" ? <PriceLinks /> : null}
      {col.id === "dem" ? (
        <figure className="mt-5">
          <img
            src="/images/chart-inflation-party.jpg"
            alt="Actual inflation each year"
            className="h-auto w-full rounded-md border border-border"
          />
        </figure>
      ) : null}
      <p className="mt-6 font-display text-xs font-semibold tracking-[0.2em] uppercase">
        Helped
      </p>
      <BillList rows={col.plus} tone="plus" />
      <p className="mt-8 font-display text-xs font-semibold tracking-[0.2em] uppercase">
        Hurt
      </p>
      <BillList rows={col.minus} tone="minus" />
    </div>
  );
}

function BorderFile() {
  return (
    <div className="mt-5 rounded-md border-2 border-sage bg-surface p-5">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {BORDER.k}
      </p>
      <p className="mt-3 text-base leading-relaxed">{BORDER.v}</p>
      <ul className="mt-4 space-y-2">
        {BORDER.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase no-underline hover:text-fg"
            >
              {l.label} →
            </a>
          </li>
        ))}
        <li>
          <Link
            to="/dispatch/$slug"
            params={{ slug: "they-opened-the-border" }}
            className="font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase no-underline hover:text-fg"
          >
            The essay →
          </Link>
        </li>
      </ul>
    </div>
  );
}

function BorderMove() {
  return (
    <div className="mt-5 rounded-md border border-border bg-surface p-5">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {BORDER_MOVE.k}
      </p>
      <p className="mt-3 text-base leading-relaxed">{BORDER_MOVE.v}</p>
      <ul className="mt-4 space-y-3">
        {BORDER_MOVE.items.map((b) => (
          <li key={b.k}>
            <a
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className="text-fg no-underline"
            >
              <p className="font-display text-sm font-semibold tracking-wide uppercase">
                {b.k} · {b.amt}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BorderHarm() {
  return (
    <div className="mt-5 rounded-md border-2 border-sage bg-surface p-5">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {BORDER_HARM.k}
      </p>
      <p className="mt-3 text-base leading-relaxed">{BORDER_HARM.v}</p>
      <ul className="mt-4 space-y-3">
        {BORDER_HARM.items.map((b) => (
          <li key={b.k}>
            <a
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className="text-fg no-underline"
            >
              <p className="font-display text-sm font-semibold tracking-wide uppercase">
                {b.k} · {b.amt}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.note}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <Link
          to="/dispatch/$slug"
          params={{ slug: "the-hospital-and-the-morgue" }}
          className="font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase no-underline hover:text-fg"
        >
          The essay →
        </Link>
      </p>
    </div>
  );
}

function BenefitsStack() {
  return (
    <div className="mt-5 rounded-md border-2 border-sage bg-surface p-5">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {BENEFITS.k}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tracking-wide">
        {BENEFITS.stack} a month
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{BENEFITS.v}</p>
      <ul className="mt-4 space-y-3">
        {BENEFITS.items.map((b) => (
          <li key={b.k}>
            <a
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className="block text-fg no-underline hover:text-sage"
            >
              <p className="font-display text-lg font-bold tracking-wide uppercase">
                {b.k} · {b.amt}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkerFile() {
  return (
    <div className="mt-5 rounded-md border border-border bg-surface p-5">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {WORKER.k}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{WORKER.v}</p>
      <ul className="mt-4 space-y-3">
        {WORKER.items.map((b) => (
          <li key={b.k}>
            <a
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className="block text-fg no-underline hover:text-sage"
            >
              <p className="font-display text-lg font-bold tracking-wide uppercase">
                {b.k} · {b.amt}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OvalFile() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {OVAL.map((row) => (
          <div key={row.who} className="rounded-md border border-border bg-surface p-5">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">
              {row.who}
            </p>
            <p className="mt-1 text-sm text-muted">{row.when}</p>
            <p className="mt-4 font-display text-3xl font-bold tracking-wide">{row.enc}</p>
            <p className="mt-1 text-sm text-muted">nationwide encounters</p>
            <p className="mt-4 font-display text-2xl font-bold tracking-wide">{row.cpi}</p>
            <p className="mt-1 text-sm text-muted">CPI peak, year-over-year</p>
            <p className="mt-4 font-display text-2xl font-bold tracking-wide">{row.gas}</p>
            <p className="mt-1 text-sm text-muted">highest EIA weekly gasoline</p>
          </div>
        ))}
      </div>
      <figure>
        <img
          src="/images/chart-oval.jpg"
          alt="The Oval — encounters and the CPI peak"
          className="h-auto w-full rounded-md border border-border"
        />
      </figure>
      <figure>
        <img
          src="/images/chart-pump-admins.jpg"
          alt="The gallon — four administrations"
          className="h-auto w-full rounded-md border border-border"
        />
      </figure>
      <figure>
        <img
          src="/images/chart-crime.jpg"
          alt="Murder rate by administration"
          className="h-auto w-full rounded-md border border-border"
        />
      </figure>
      <ul className="space-y-2">
        {OVAL_LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase no-underline hover:text-fg"
            >
              {l.label} →
            </a>
          </li>
        ))}
        <li>
          <Link
            to="/pump"
            className="font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase no-underline hover:text-fg"
          >
            The pump →
          </Link>
        </li>
      </ul>
    </div>
  );
}

function PriceLinks() {
  return (
    <div className="mt-5 rounded-md border border-border bg-surface p-4">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        {PRICES.k}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{PRICES.v}</p>
      <ul className="mt-3 space-y-2">
        {PRICES.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase no-underline hover:text-fg"
            >
              {l.label} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MidtermScorecard() {
  const [tab, setTab] = useState<Tab>(null);
  const gop = RECORD.find((r) => r.id === "gop");
  const dem = RECORD.find((r) => r.id === "dem");
  const split = DEBT_TALLY.find((t) => t.who.includes("split"));

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
          Congressional scorecard · {SCORE_UPDATED}
        </p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-wide uppercase sm:text-5xl">
          Both parties have failed the American people.
        </h2>

        <div className="mt-8 grid grid-cols-5 gap-2">
          {(
            [
              ["gop", "Republicans"],
              ["dem", "Democrats"],
              ["split", "Split"],
              ["oval", "Oval"],
              ["compare", "Compare"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={
                tab === id
                  ? "flex min-h-16 min-w-0 items-center justify-center rounded-md border-2 border-sage bg-sage px-1 py-4 text-center font-display text-[12px] font-bold leading-tight tracking-wide text-black uppercase sm:text-base"
                  : "flex min-h-16 min-w-0 items-center justify-center rounded-md border-2 border-sage bg-surface px-1 py-4 text-center font-display text-[12px] font-bold leading-tight tracking-wide text-fg uppercase hover:bg-ink sm:text-base"
              }
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "gop" && gop ? (
          <div className="mt-10">
            <PartyFile col={gop} />
          </div>
        ) : null}

        {tab === "dem" && dem ? (
          <div className="mt-10">
            <PartyFile col={dem} />
          </div>
        ) : null}

        {tab === "oval" ? (
          <div className="mt-10">
            <OvalFile />
          </div>
        ) : null}

        {tab === "compare" ? (
          <div className="mt-10 space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {DEBT_TALLY.map((row) => {
                const n = Number(row.added.replace(/[^0-9.]/g, ""));
                const pct = Math.round((n / 40.09) * 100);
                return (
                  <div
                    key={row.who}
                    className="rounded-md border border-border bg-surface p-5"
                  >
                    <p className="font-display text-xs font-semibold leading-snug tracking-wide text-sage uppercase">
                      {row.who}
                    </p>
                    <p className="mt-2 font-display text-4xl font-bold tracking-wide">
                      {row.added}
                    </p>
                    <div className="mt-4 h-3 w-full rounded-sm bg-ink">
                      <div
                        className="h-3 rounded-sm bg-sage"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-2 font-display text-xs tracking-[0.12em] text-muted uppercase">
                      {pct}% of the $40.09T
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {DEBT_NOW.asOf}: {DEBT_NOW.total}. {DEBT_MATH}
            </p>
            <div className="grid gap-8 lg:grid-cols-2">
              {COMPARE_CHARTS.map((c) => (
                <figure
                  key={c.src}
                  className={COMPARE_WIDE.has(c.src) ? "lg:col-span-2" : undefined}
                >
                  <p className="mb-3 font-display text-sm font-semibold tracking-[0.16em] text-sage uppercase">
                    {c.title}
                  </p>
                  <img
                    src={c.src}
                    alt={c.title}
                    className="h-auto w-full rounded-md border border-border"
                  />
                  <figcaption className="mt-2 text-[12px] leading-relaxed text-muted">
                    {c.sources.map((s, i) => (
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
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "split" ? (
          <div className="mt-10 space-y-8">
            <p className="font-display text-xl font-bold tracking-[0.18em] text-sage uppercase">
              Split
            </p>
            {split ? (
              <>
                <p className="font-display text-3xl font-bold tracking-wide">
                  {split.added}
                </p>
                <p className="text-sm leading-relaxed text-muted">{split.when}</p>
              </>
            ) : null}
            <p className="text-sm leading-relaxed">
              {DEBT_NOW.asOf}: {DEBT_NOW.total}. {DEBT_MATH}
            </p>
            <PriceLinks />
            <p className="font-display text-xs font-semibold tracking-[0.2em] uppercase">
              Why the meter runs — both of them
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {DRIVERS.map((d) => (
                <a
                  key={d.k}
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block min-h-28 rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
                >
                  <p className="font-display text-lg font-bold tracking-wide uppercase">
                    {d.k}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d.v}</p>
                </a>
              ))}
            </div>
            {CHARTS.map((c) => (
              <figure key={c.src}>
                <img
                  src={c.src}
                  alt={c.title}
                  className="h-auto w-full rounded-md border border-border"
                />
                <figcaption className="mt-3 text-[12px] leading-relaxed text-muted">
                  {c.sources.map((s, i) => (
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
                </figcaption>
              </figure>
            ))}
            <p>
              <Link
                to="/pump"
                className="font-display text-sm font-semibold tracking-[0.14em] text-sage uppercase no-underline hover:text-fg"
              >
                Gas and diesel →
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
