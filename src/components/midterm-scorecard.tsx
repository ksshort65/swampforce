import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BORDER,
  BORDER_MOVE,
  BORDER_HARM,
  BENEFITS,
  WORKER,
  OVAL,
  OVAL_LINKS,
  OVAL_NOW,
  ENCOUNTERS,
  CPI_PEAK,
  ALIENS,
  DEBT_WHY,
  CHARTS,
  COMPARE_CHARTS,
  COMPARE_WIDE,
  DEBT_MATH,
  DEBT_NOW,
  DEBT_TALLY,
  DRIVERS,
  HOAXES,
  LAWS,
  MAJORITY,
  OBAMA_TERMS,
  PRICES,
  PURSE,
  RECORD,
  SCORE_TABS,
  TAB_CHARTS,
  SCORE_UPDATED,
} from "@/lib/scorecard";

type TabId = (typeof SCORE_TABS)[number]["id"];
type Mode = "charts" | "read";

function ChartStack({ tab }: { tab: TabId }) {
  return (
    <div className="space-y-8">
      {tab === "oval" ? (
        <>
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
            {ENCOUNTERS.k}
          </p>
          <p className="mt-3 text-base leading-relaxed">{ENCOUNTERS.v}</p>
          <a
            href={ENCOUNTERS.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
          >
            CBP — nationwide encounters →
          </a>
        </div>
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
            {CPI_PEAK.k}
          </p>
          <p className="mt-3 text-base leading-relaxed">{CPI_PEAK.v}</p>
          <a
            href={CPI_PEAK.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
          >
            BLS — Consumer Price Index →
          </a>
        </div>
        </>
      ) : null}
      {TAB_CHARTS[tab].map((c) => (
        <figure key={c.src}>
          <p className="mb-3 font-display text-sm font-semibold tracking-wide text-sage uppercase">
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
  );
}

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
    col.id === "gop" ? t.who.startsWith("Republican") : t.who.startsWith("Democratic"),
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
      <figure className="mt-6">
        <img
          src="/images/chart-policy.jpg"
          alt="Policy — success and failure"
          className="h-auto w-full rounded-md border border-border"
        />
      </figure>
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

function AliensFile() {
  return (
    <div className="space-y-6">
      <p className="font-display text-xl font-bold tracking-wide uppercase">{ALIENS.k}</p>
      <p className="text-base leading-relaxed">{ALIENS.v}</p>
      <figure>
        <img
          src="/images/chart-aliens.jpg"
          alt="The invasion bill — taxpayer cost and eligibility"
          className="h-auto w-full rounded-md border border-border"
        />
      </figure>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ALIENS.costs.map((c) => (
          <li key={c.href}>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="block min-h-24 rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
            >
              <p className="font-display text-2xl font-bold tracking-wide">{c.amt}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.k}</p>
            </a>
          </li>
        ))}
      </ul>
      <ul className="space-y-3">
        {ALIENS.doors.map((d) => (
          <li key={d.href}>
            <a
              href={d.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
            >
              <p className="font-display text-sm font-bold tracking-wide uppercase">{d.k}</p>
              <p className="mt-2 text-sm leading-relaxed">{d.v}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HoaxesFile() {
  return (
    <div className="mt-8 rounded-md border-2 border-sage bg-surface p-5">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
        Information war
      </p>
      <p className="mt-3 text-base leading-relaxed">
        They ran captions against the people and against a president. A
        charge sheet is a statute and a count. Durham. FISA that was not
        scrupulously accurate. School boards. A stacked select committee.
        Insurrection on television, not on 18 U.S.C. § 2383. A board at DHS
        to govern ‘disinformation.’ Two impeachments. Four dockets. The
        House held the tape.
      </p>
      <ul className="mt-5 space-y-5">
        {HOAXES.map((h) => (
          <li key={h.href}>
            <p className="font-display text-sm font-semibold tracking-wide uppercase">
              {h.k}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{h.v}</p>
            <a
              href={h.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
            >
              The file →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5">
        <Link
          to="/dispatch/$slug"
          params={{ slug: "the-caption-was-not-the-charge" }}
          className="font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
        >
          The essay →
        </Link>
      </p>
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
      <div className="rounded-md border border-border bg-surface p-5">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
          {ENCOUNTERS.k}
        </p>
        <p className="mt-3 text-base leading-relaxed">{ENCOUNTERS.v}</p>
        <a
          href={ENCOUNTERS.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
        >
          CBP — nationwide encounters →
        </a>
      </div>
      <div className="rounded-md border border-border bg-surface p-5">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
          {CPI_PEAK.k}
        </p>
        <p className="mt-3 text-base leading-relaxed">{CPI_PEAK.v}</p>
        <a
          href={CPI_PEAK.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
        >
          BLS — Consumer Price Index →
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVAL.map((row) => (
          <div key={row.who} className="rounded-md border border-border bg-surface p-5">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">
              {row.who}
            </p>
            <p className="mt-1 text-sm text-muted">{row.when}</p>
            <p className="mt-4 font-display text-3xl font-bold tracking-wide">{row.enc}</p>
            <p className="mt-1 text-sm text-muted">{row.note}</p>
            <p className="mt-4 font-display text-2xl font-bold tracking-wide">{row.cpi}</p>
            <p className="mt-1 text-sm text-muted">
              CPI peak — highest 12-month rise in prices that Oval (groceries, rent, fuel)
            </p>
            <p className="mt-4 font-display text-2xl font-bold tracking-wide">{row.gas}</p>
            <p className="mt-1 text-sm text-muted">highest EIA weekly gasoline</p>
          </div>
        ))}
      </div>
      <a
        href={OVAL_NOW.href}
        target="_blank"
        rel="noreferrer"
        className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
      >
        <p className="font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">
          {OVAL_NOW.who} · {OVAL_NOW.when}
        </p>
        <p className="mt-3 font-display text-2xl font-bold tracking-wide">{OVAL_NOW.enc}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{OVAL_NOW.note}</p>
      </a>
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
  const [tab, setTab] = useState<TabId | null>(null);
  const [mode, setMode] = useState<Mode>("charts");
  const gop = RECORD.find((r) => r.id === "gop");
  const dem = RECORD.find((r) => r.id === "dem");
  const split = DEBT_TALLY.find((t) => t.who.toLowerCase().includes("split"));

  useEffect(() => {
    const apply = () => {
      const raw = window.location.hash.replace("#", "");
      const [id, m] = raw.split("-") as [string, string | undefined];
      if (SCORE_TABS.some((f) => f.id === id)) {
        setTab(id as TabId);
        if (m === "read" || m === "charts") setMode(m);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const pickTab = (id: TabId) => {
    setTab(id);
    setMode("charts");
    window.history.replaceState(null, "", `#${id}-charts`);
  };
  const pickMode = (m: Mode) => {
    setMode(m);
    if (tab) window.history.replaceState(null, "", `#${tab}-${m}`);
  };

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
          {SCORE_TABS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => pickTab(f.id)}
              className={
                tab === f.id
                  ? "flex min-h-16 min-w-0 items-center justify-center rounded-md border-2 border-sage bg-sage px-1 py-4 text-center font-display text-[12px] font-bold leading-tight tracking-wide text-black uppercase sm:text-base"
                  : "flex min-h-16 min-w-0 items-center justify-center rounded-md border-2 border-sage bg-surface px-1 py-4 text-center font-display text-[12px] font-bold leading-tight tracking-wide text-fg uppercase hover:bg-ink sm:text-base"
              }
            >
              {f.k}
            </button>
          ))}
        </div>

        {tab ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(
              [
                ["charts", "Charts"],
                ["read", "Read"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => pickMode(id)}
                className={
                  mode === id
                    ? "flex min-h-14 items-center justify-center rounded-md border-2 border-sage bg-sage px-2 py-3 font-display text-sm font-bold tracking-wide text-black uppercase"
                    : "flex min-h-14 items-center justify-center rounded-md border-2 border-sage bg-surface px-2 py-3 font-display text-sm font-bold tracking-wide text-fg uppercase hover:bg-ink"
                }
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {tab && mode === "charts" ? (
          <div className="mt-10">
            <ChartStack tab={tab} />
          </div>
        ) : null}

        {tab === "gop" && mode === "read" && gop ? (
          <div className="mt-10">
            <PartyFile col={gop} />
          </div>
        ) : null}

        {tab === "dem" && mode === "read" && dem ? (
          <div className="mt-10">
            <PartyFile col={dem} />
            <div className="mt-8">
              <HoaxesFile />
            </div>
            <div className="mt-8">
              <AliensFile />
              <BorderFile />
              <BorderMove />
              <BorderHarm />
              <BenefitsStack />
              <WorkerFile />
            </div>
          </div>
        ) : null}

        {tab === "split" && mode === "read" ? (
          <div className="mt-10 space-y-6">
            {split ? (
              <>
                <p className="font-display text-xl font-bold tracking-wide uppercase">
                  Split
                </p>
                <p className="font-display text-3xl font-bold tracking-wide">
                  {split.added}
                </p>
                <p className="text-sm leading-relaxed text-muted">{split.when}</p>
              </>
            ) : null}
            <p className="text-sm leading-relaxed">
              {DEBT_NOW.asOf}: {DEBT_NOW.total}. {DEBT_MATH}
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
          </div>
        ) : null}

        {tab === "oval" && mode === "read" ? (
          <div className="mt-10">
            <OvalFile />
          </div>
        ) : null}

        {tab === "compare" && mode === "read" ? (
          <div className="mt-10 space-y-10">
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                {PURSE.k}
              </p>
              <p className="mt-3 text-base leading-relaxed">{PURSE.v}</p>
              <a
                href={PURSE.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
              >
                Article I →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {MAJORITY.map((m) => (
                <a
                  key={m.who}
                  href={m.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
                >
                  <p className="font-display text-sm font-bold tracking-wide uppercase">
                    {m.who}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{m.when}</p>
                  <p className="mt-3 text-sm leading-relaxed">{m.could}</p>
                  <p className="mt-2 text-sm leading-relaxed">{m.did}</p>
                </a>
              ))}
            </div>
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
                    <p className="mt-3 text-xs leading-relaxed text-muted">{row.when}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {DEBT_NOW.asOf}: {DEBT_NOW.total}. {DEBT_MATH}
            </p>
            <figure>
              <img
                src="/images/chart-debt-why.jpg"
                alt="The debt — the driver, and what each party voted"
                className="h-auto w-full rounded-md border border-border"
              />
            </figure>
            <p className="text-base leading-relaxed">{DEBT_WHY.v}</p>
            <p className="text-sm leading-relaxed">{DEBT_WHY.pay}</p>
            <p className="text-sm leading-relaxed">
              Republicans: {DEBT_WHY.gop}
            </p>
            <p className="text-sm leading-relaxed">
              Democrats: {DEBT_WHY.dem}
            </p>
            <p>
              <a
                href={DEBT_WHY.payHref}
                target="_blank"
                rel="noreferrer"
                className="font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
              >
                CRS — member pay →
              </a>
              {" · "}
              <a
                href={DEBT_WHY.ethicsHref}
                target="_blank"
                rel="noreferrer"
                className="font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
              >
                2 U.S.C. § 1415 →
              </a>
              {" · "}
              <a
                href={DEBT_WHY.href}
                target="_blank"
                rel="noreferrer"
                className="font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
              >
                GAO fraud →
              </a>
            </p>
            {OBAMA_TERMS.map((term) => (
              <div key={term.who} className="rounded-md border border-border bg-surface p-5">
                <p className="font-display text-xl font-bold tracking-wide uppercase">
                  {term.who}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{term.majority}</p>
                <p className="mt-6 font-display text-xs font-semibold tracking-[0.2em] uppercase">
                  Helped
                </p>
                <BillList rows={term.plus} tone="plus" />
                <p className="mt-8 font-display text-xs font-semibold tracking-[0.2em] uppercase">
                  Hurt
                </p>
                <BillList rows={term.minus} tone="minus" />
              </div>
            ))}
            {gop ? <PartyFile col={gop} /> : null}
            {dem ? <PartyFile col={dem} /> : null}
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LAWS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block min-h-11 rounded-md border border-border bg-surface px-4 py-3 font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:border-sage hover:text-fg"
                  >
                    {l.k} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
