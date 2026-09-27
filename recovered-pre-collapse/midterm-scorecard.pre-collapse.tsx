import {
  BORDER,
  BORDER_MOVE,
  BORDER_HARM,
  BENEFITS,
  WORKER,
  OVAL,
  OVAL_DESKS,
  OVAL_DESK_CHARTS,
  OVAL_LINKS,
  OVAL_NOW,
  ovalRecordFor,
  TRUMP_TERMS,
  ENCOUNTERS,
  CPI_PEAK,
  ALIENS,
  RAIL,
  DEBT_WHY,
  ATM,
  COVID_CELL,
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
  TERM_COMPARE,
  TERM_SIGNED,
  DEALS,
  AT_HOME,
  EFFECT_FILES,
  SUITS,
  type OvalDesk,
} from "@/lib/scorecard";

type TabId = (typeof SCORE_TABS)[number]["id"];
type Mode = "charts" | "read";

function MediaLieChart() {
  return (
    <figure>
      <p className="mb-3 font-display text-sm font-semibold tracking-wide text-sage uppercase">
        Media lies · {MEDIA_TALLY.n} captions · {MEDIA_TALLY.tape} cut tapes · {MEDIA_TALLY.word} altered words · {MEDIA_TALLY.standard} unequal standards
      </p>
      <p className="mb-4 max-w-3xl text-base leading-relaxed">{MEDIA_LEAD}</p>
      <div className="overflow-hidden rounded-md border border-border">
        <div className="hidden bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
          <p className="border-r border-border px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] uppercase">
            What they ran
          </p>
          <p className="px-4 py-3 font-display text-xs font-semibold tracking-[0.18em] text-sage uppercase">
            The file
          </p>
        </div>
        {MEDIA_LIES.map((row) => (
          <div key={row.tag} className="grid border-t border-border lg:grid-cols-[16rem_1fr]">
            <div className="border-border px-4 py-4 lg:border-r">
              <p className="font-display text-sm font-bold tracking-wide uppercase">{row.tag}</p>
              <p className="mt-2 text-sm leading-relaxed">{row.they}</p>
              {row.ran ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">{row.ran}</p>
              ) : null}
            </div>
            <div className="bg-surface/40 px-4 py-4">
              <p className="text-sm leading-relaxed">{row.tape}</p>
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-[0.14em] text-sage uppercase no-underline hover:underline"
                >
                  Proof →
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function ChartStack({ tab, desk }: { tab: TabId; desk?: OvalDesk }) {
  const charts = tab === "oval" && desk ? OVAL_DESK_CHARTS[desk] : TAB_CHARTS[tab];
  return (
    <div className="space-y-8">
      {tab === "compare" ? <MediaLieChart /> : null}
      {charts.map((c) => (
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
                : "block min-h-14 rounded-md border border-[#c53030]/50 bg-surface px-4 py-4 text-fg no-underline hover:border-[#c53030]"
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
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-display text-xs font-semibold tracking-[0.2em] uppercase">
            Helped
          </p>
          <BillList rows={col.plus} tone="plus" />
        </div>
        <div>
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-[#c53030] uppercase">
            Hurt
          </p>
          <BillList rows={col.minus} tone="minus" />
        </div>
      </div>
    </div>
  );
}

function AliensFile() {
  return (
    <div className="space-y-6">
      <p className="font-display text-xl font-bold tracking-wide uppercase">{ALIENS.k}</p>
      <p className="text-base leading-relaxed">{ALIENS.v}</p>
      <div>
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
          Where the money came from
        </p>
        <ul className="mt-3 space-y-3">
          {ALIENS.from.map((row) => (
            <li key={row.k}>
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
              >
                <p className="font-display text-sm font-bold tracking-wide uppercase">
                  {row.k}
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-wide">{row.amt}</p>
                <p className="mt-2 text-sm leading-relaxed">{row.v}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
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
      <div>
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
          {ALIENS.law.k}
        </p>
        <p className="mt-3 text-base leading-relaxed">{ALIENS.law.v}</p>
        <ul className="mt-4 space-y-3">
          {ALIENS.law.rows.map((row) => (
            <li key={row.k}>
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
              >
                <p className="font-display text-sm font-bold tracking-wide uppercase">{row.k}</p>
                <p className="mt-2 font-display text-2xl font-bold tracking-wide">{row.amt}</p>
                <p className="mt-2 text-sm leading-relaxed">{row.v}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-relaxed">{ALIENS.law.why}</p>
        <a
          href={ALIENS.law.whyHref}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
        >
          8 U.S.C. § 1158 →
        </a>
      </div>
    </div>
  );
}

function RailFile() {
  return (
    <div className="mt-8 space-y-4">
      <p className="font-display text-xl font-bold tracking-wide uppercase">{RAIL.k}</p>
      <p className="text-base leading-relaxed">{RAIL.v}</p>
      <ul className="space-y-3">
        {RAIL.rows.map((row) => (
          <li key={row.k}>
            <a
              href={row.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
            >
              <p className="font-display text-sm font-bold tracking-wide uppercase">{row.k}</p>
              <p className="mt-2 font-display text-2xl font-bold tracking-wide">{row.amt}</p>
              <p className="mt-2 text-sm leading-relaxed">{row.v}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-base leading-relaxed">{RAIL.end}</p>
      <a
        href={RAIL.endHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
      >
        FRA compliance review, June 4, 2025 →
      </a>
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
        They ran captions against the people and against a president they
        did not hire. Each caption had evidence. The official file later
        showed the evidence did not hold. The public paid for the
        investigation, the committee, and the special counsel. That is a
        taxpayer-funded assault on an elected president and on the
        Americans who hired him.
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
          params={{ slug: "the-hire-is-the-country" }}
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

function OvalFile({ desk, cardsOnly = false }: { desk: OvalDesk; cardsOnly?: boolean }) {
  const meters =
    desk === "trump1"
      ? OVAL.filter((row) => row.who === "Trump 1")
      : desk === "trump2"
        ? OVAL.filter((row) => row.who === "Trump 2")
        : OVAL;
  const record = ovalRecordFor(desk);
  const trumpTerms =
    desk === "four" ? TRUMP_TERMS : TRUMP_TERMS.filter((t) => t.id === desk);
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
      <div className={`grid gap-4 sm:grid-cols-2 ${desk === "four" ? "lg:grid-cols-4" : ""}`}>
        {meters.map((row) => (
          <div key={row.who} className="rounded-md border border-border bg-surface p-5">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">
              {row.who}
            </p>
            <p className="mt-1 text-sm text-muted">{row.when}</p>
            <p className="mt-4 font-display text-3xl font-bold tracking-wide">{row.enc}</p>
            <p className="mt-1 text-sm text-muted">{row.note}</p>
            <p className="mt-4 font-display text-2xl font-bold tracking-wide">{row.cpi}</p>
            <p className="mt-1 text-sm text-muted">highest 12-month rise</p>
            <p className="mt-4 font-display text-2xl font-bold tracking-wide">{row.gas}</p>
            <p className="mt-1 text-sm text-muted">highest EIA weekly gasoline</p>
          </div>
        ))}
      </div>
      {desk !== "trump1" ? (
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
      ) : null}
      {cardsOnly ? null : (
        <>
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              The file versus the caption
            </p>
            <div className="mt-4 space-y-4">
              {record.map((row) => (
                <a
                  key={row.k}
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-border bg-surface p-5 text-fg no-underline hover:border-sage"
                >
                  <p className="font-display text-lg font-bold tracking-wide uppercase">{row.k}</p>
                  <p className="mt-3 text-sm leading-relaxed">{row.v}</p>
                </a>
              ))}
            </div>
          </div>
          {trumpTerms.map((term) => (
            <div key={term.who} className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xl font-bold tracking-wide uppercase">{term.who}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{term.majority}</p>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div>
                  <p className="font-display text-xs font-semibold tracking-[0.2em] uppercase">
                    Helped
                  </p>
                  <BillList rows={term.plus} tone="plus" />
                </div>
                <div>
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-[#c53030] uppercase">
                    Hurt
                  </p>
                  <BillList rows={term.minus} tone="minus" />
                </div>
              </div>
            </div>
          ))}
          {desk === "four"
            ? OBAMA_TERMS.map((term) => (
                <div key={term.who} className="rounded-md border border-border bg-surface p-5">
                  <p className="font-display text-xl font-bold tracking-wide uppercase">
                    {term.who}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{term.majority}</p>
                  <div className="mt-6 grid gap-8 md:grid-cols-2">
                    <div>
                      <p className="font-display text-xs font-semibold tracking-[0.2em] uppercase">
                        Helped
                      </p>
                      <BillList rows={term.plus} tone="plus" />
                    </div>
                    <div>
                      <p className="font-display text-xs font-semibold tracking-[0.2em] text-[#c53030] uppercase">
                        Hurt
                      </p>
                      <BillList rows={term.minus} tone="minus" />
                    </div>
                  </div>
                </div>
              ))
            : null}
        </>
      )}
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
  const [desk, setDesk] = useState<OvalDesk>("four");
  const gop = RECORD.find((r) => r.id === "gop");
  const dem = RECORD.find((r) => r.id === "dem");
  const split = DEBT_TALLY.find((t) => t.who.toLowerCase().includes("split"));

  useEffect(() => {
    const apply = () => {
      const raw = window.location.hash.replace("#", "");
      const parts = raw.split("-");
      if (parts[0] === "oval" && (parts[1] === "trump1" || parts[1] === "trump2")) {
        setTab("oval");
        setDesk(parts[1]);
        setMode(parts[2] === "read" ? "read" : "charts");
        return;
      }
      const [id, m] = parts as [string, string | undefined];
      if (SCORE_TABS.some((f) => f.id === id)) {
        setTab(id as TabId);
        if (id === "oval" && parts[1] !== "trump1" && parts[1] !== "trump2") setDesk("four");
        if (m === "read" || m === "charts") setMode(m);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const ovalHash = (nextDesk: OvalDesk, nextMode: Mode) =>
    nextDesk === "four" ? `oval-${nextMode}` : `oval-${nextDesk}-${nextMode}`;

  const openRoom = (id: TabId, m: Mode) => {
    const nextDesk = id === "oval" ? desk : "four";
    if (id !== "oval") setDesk("four");
    setTab(id);
    setMode(m);
    window.history.replaceState(
      null,
      "",
      id === "oval" ? `#${ovalHash(nextDesk, m)}` : `#${id}-${m}`,
    );
  };

  const openDesk = (d: OvalDesk, m: Mode) => {
    setDesk(d);
    setTab("oval");
    setMode(m);
    window.history.replaceState(null, "", `#${ovalHash(d, m)}`);
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
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Do not vote on emotion. Do not vote on a hatred a party or a
          network manufactured. Vote the facts. Every number on this
          page is a government file.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {SCORE_TABS.map((f) => (
            <div
              key={f.id}
              className={
                tab === f.id
                  ? "rounded-md border-2 border-sage bg-surface p-2"
                  : "rounded-md border-2 border-border bg-surface p-2"
              }
            >
              <p className="px-1 py-2 text-center font-display text-sm font-bold tracking-wide text-fg uppercase sm:text-base">
                {f.k}
              </p>
              <div className="grid grid-cols-1 gap-1">
                {(
                  [
                    ["charts", "Charts"],
                    ["read", "Read"],
                  ] as const
                ).map(([id, label]) => {
                  const on = tab === f.id && mode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openRoom(f.id, id)}
                      className={
                        on
                          ? "flex min-h-11 items-center justify-center rounded-md border-2 border-sage bg-sage px-2 font-display text-xs font-bold tracking-wide text-black uppercase"
                          : "flex min-h-11 items-center justify-center rounded-md border-2 border-sage bg-bg px-2 font-display text-xs font-bold tracking-wide text-fg uppercase hover:bg-ink"
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {tab === "oval" ? (
          <a
            href={DEALS[0].href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 block rounded-md border-2 border-sage bg-surface p-5 text-fg no-underline"
          >
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              Signed today · {DEALS[0].grade}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-wide uppercase sm:text-3xl">
              {DEALS[0].k}
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-relaxed">{DEALS[0].v}</p>
          </a>
        ) : null}

        {tab === "oval" ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {OVAL_DESKS.map((d) => (
              <div
                key={d.id}
                className={
                  desk === d.id
                    ? "rounded-md border-2 border-sage bg-surface p-2"
                    : "rounded-md border-2 border-border bg-surface p-2"
                }
              >
                <p className="px-1 py-2 text-center font-display text-sm font-bold tracking-wide uppercase">
                  {d.k}
                </p>
                <p className="px-1 pb-2 text-center text-[11px] text-muted">{d.v}</p>
                <div className="grid grid-cols-1 gap-1">
                  {(
                    [
                      ["charts", "Charts"],
                      ["read", "Read"],
                    ] as const
                  ).map(([id, label]) => {
                    const on = desk === d.id && mode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => openDesk(d.id, id)}
                        className={
                          on
                            ? "flex min-h-11 items-center justify-center rounded-md border-2 border-sage bg-sage px-2 font-display text-xs font-bold tracking-wide text-black uppercase"
                            : "flex min-h-11 items-center justify-center rounded-md border-2 border-sage bg-bg px-2 font-display text-xs font-bold tracking-wide text-fg uppercase hover:bg-ink"
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab && mode === "charts" ? (
          <div className="mt-10">
            <ChartStack tab={tab} desk={tab === "oval" ? desk : undefined} />
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
              <RailFile />
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
          <div className="mt-10 space-y-8">
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                The lawsuits
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">
                The caption outran the file
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed">
                Red is the odd part: an indictment that does not name the other crime, a jury not required to agree on the means, a claim with no witness in the room, a judge who took the act off the table, a penalty thrown out that people still repeat. The rest is the file.
              </p>
              <div className="mt-6 space-y-4">
                {SUITS.map((row) => (
                  <a
                    key={row.k}
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border border-border bg-bg p-4 text-fg no-underline hover:border-sage"
                  >
                    <p className="font-display text-sm font-bold tracking-wide uppercase">{row.k}</p>
                    <p className="mt-3 text-sm leading-relaxed">{row.sold}</p>
                    <p className="mt-3 text-sm leading-relaxed font-semibold text-[#c53030]">{row.red}</p>
                    <p className="mt-3 text-sm leading-relaxed">{row.file}</p>
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                Helped or hurt · the signed deals
              </p>
              <p className="mt-3 text-base leading-relaxed">
                These are agreements he signed. A border, a war, or a tariff. Not every agency memorandum in Treaties in Force. Five helped. Four helped, and it cost. Three is mixed. Two hurt. One would be the worst. The grade is what the paper did, not what a caption said it did.
              </p>
              <div className="mt-6 space-y-3">
                {DEALS.filter((d) => desk === "four" || (desk === "trump1" ? d.term === "1" : d.term === "2")).map((d) => (
                  <a
                    key={d.when + d.k}
                    href={d.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border border-border bg-bg p-4 text-fg no-underline hover:border-sage"
                  >
                    <p className="font-display text-xs font-semibold tracking-[0.16em] text-sage uppercase">{d.when}</p>
                    <p className="mt-2 font-display text-sm font-bold tracking-wide uppercase">{d.grade}</p>
                    <p className="mt-2 font-display text-lg font-bold tracking-wide uppercase">{d.k}</p>
                    <p className="mt-2 text-sm leading-relaxed">{d.v}</p>
                  </a>
                ))}
              </div>
            </div>
            <div className="grid items-start gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                {AT_HOME.k}
              </p>
              <p className="mt-3 text-base leading-relaxed">{AT_HOME.v}</p>
              <div className="mt-6 space-y-3">
                {(() => {
                  let n = 0;
                  return AT_HOME.groups.map((group) => (
                    <details key={group.k} className="rounded-md border border-border bg-bg">
                      <summary className="cursor-pointer list-none px-4 py-4 font-display text-sm font-bold tracking-wide uppercase">
                        {group.k}
                        <span className="mt-1 block text-xs font-semibold tracking-[0.14em] text-sage">
                          {group.items.length} lines
                        </span>
                      </summary>
                      <ol className="space-y-3 border-t border-border px-4 py-4">
                        {group.items.map((item) => {
                          n += 1;
                          const line = n;
                          return (
                            <li key={line} className="text-sm leading-relaxed">
                              <span className="font-display font-bold tracking-wide">{line}. </span>
                              {item}
                            </li>
                          );
                        })}
                      </ol>
                    </details>
                  ));
                })()}
              </div>
            </div>
            <div className="space-y-4">
              {EFFECT_FILES.map((file) => (
                <div key={file.who} className="rounded-md border border-border bg-surface p-5">
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                    {file.k}
                  </p>
                  <p className="mt-3 text-base leading-relaxed">{file.v}</p>
                  <ol className="mt-6 space-y-3">
                    {file.items.map((item, i) => (
                      <li key={item.k} className="text-sm leading-relaxed">
                        <a href={item.href} target="_blank" rel="noreferrer" className="text-fg no-underline hover:text-sage">
                          <span className="font-display font-bold tracking-wide">{i + 1}. </span>
                          {item.k}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                {TERM_COMPARE.k}
              </p>
              <p className="mt-3 text-base leading-relaxed">{TERM_COMPARE.v}</p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border font-display text-xs tracking-wide uppercase">
                      <th className="py-3 pr-4 font-semibold">Measure</th>
                      <th className="py-3 pr-4 font-semibold">Obama</th>
                      <th className="py-3 pr-4 font-semibold">Trump, first term</th>
                      <th className="py-3 font-semibold">Biden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TERM_COMPARE.rows.map((row) => (
                      <tr key={row.k} className="border-b border-border align-top">
                        <td className="py-4 pr-4">
                          <p className="font-display text-sm font-bold tracking-wide uppercase">{row.k}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted">{row.note}</p>
                          <p className="mt-2 text-sm leading-relaxed">{row.congress}</p>
                        </td>
                        <td className="py-4 pr-4 font-display text-xl font-bold">
                          {row.obama}
                          <span className="mt-2 block text-sm font-semibold tracking-wide uppercase">{row.gO} · {["", "Hurt most", "Hurt", "Mixed", "Helped, and it cost", "Helped"][row.gO]}</span>
                        </td>
                        <td className="py-4 pr-4 font-display text-xl font-bold">
                          {row.trump}
                          <span className="mt-2 block text-sm font-semibold tracking-wide uppercase">{row.gT} · {["", "Hurt most", "Hurt", "Mixed", "Helped, and it cost", "Helped"][row.gT]}</span>
                        </td>
                        <td className="py-4 font-display text-xl font-bold">
                          {row.biden}
                          <span className="mt-2 block text-sm font-semibold tracking-wide uppercase">{row.gB} · {["", "Hurt most", "Hurt", "Mixed", "Helped, and it cost", "Helped"][row.gB]}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a
                href={TERM_COMPARE.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
              >
                Article I →
              </a>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {TERM_SIGNED.map((col) => (
                <div key={col.who} className="rounded-md border border-border bg-surface p-5">
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                    The record · {col.when}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">{col.who}</h3>
                  <div className="mt-4 space-y-3">
                    {col.items.map((item) => (
                      <a
                        key={item.k}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-md border border-border bg-bg p-4 text-fg no-underline hover:border-sage"
                      >
                        <p className="font-display text-sm font-bold tracking-wide uppercase">{item.grade}</p>
                        <p className="mt-2 font-display text-sm font-bold tracking-wide uppercase">{item.k}</p>
                        <p className="mt-2 text-sm leading-relaxed">{item.v}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <OvalFile desk={desk} />
          </div>
        ) : null}

        {tab === "compare" && mode === "read" ? (
          <div className="mt-10 space-y-10">
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
                Side by side
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase">
                Helped · Hurt
              </h3>
            </div>
            {gop ? <PartyFile col={gop} /> : null}
            {dem ? <PartyFile col={dem} /> : null}
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
            <OvalFile desk="four" cardsOnly />
            <AliensFile />
            <HoaxesFile />
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
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xl font-bold tracking-wide uppercase">{ATM.k}</p>
              <p className="mt-3 text-base leading-relaxed">{ATM.v}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {ATM.boxes.map((box) => (
                  <a
                    key={box.k}
                    href={box.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border border-border bg-bg p-5 text-fg no-underline hover:border-sage"
                  >
                    <p className="font-display text-xs font-semibold tracking-wide text-sage uppercase">
                      {box.k}
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold tracking-wide">{box.amt}</p>
                    <p className="mt-3 text-sm leading-relaxed">{box.v}</p>
                  </a>
                ))}
              </div>
              <p className="mt-6 text-base leading-relaxed">{ATM.clock}</p>
              <p className="mt-3 text-base leading-relaxed">{ATM.law}</p>
              <p className="mt-3">
                <a
                  href={ATM.clockHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
                >
                  Resume of Congressional Activity →
                </a>
                {" · "}
                <a
                  href={ATM.lawHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
                >
                  31 U.S.C. § 1301 →
                </a>
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <p className="font-display text-xl font-bold tracking-wide uppercase">{COVID_CELL.k}</p>
              <p className="mt-3 text-base leading-relaxed">{COVID_CELL.v}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {COVID_CELL.rows.map((row) => (
                  <a
                    key={row.k}
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border border-border bg-bg p-5 text-fg no-underline hover:border-sage"
                  >
                    <p className="font-display text-xs font-semibold tracking-wide text-sage uppercase">
                      {row.k}
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold tracking-wide">{row.amt}</p>
                    <p className="mt-3 text-sm leading-relaxed">{row.v}</p>
                  </a>
                ))}
              </div>
              <p className="mt-6 text-base leading-relaxed">{COVID_CELL.end}</p>
              <a
                href={COVID_CELL.endHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-wide text-sage uppercase no-underline hover:text-fg"
              >
                Labor inspector general →
              </a>
            </div>
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
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div>
                    <p className="font-display text-xs font-semibold tracking-[0.2em] uppercase">
                      Helped
                    </p>
                    <BillList rows={term.plus} tone="plus" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-semibold tracking-[0.2em] text-[#c53030] uppercase">
                      Hurt
                    </p>
                    <BillList rows={term.minus} tone="minus" />
                  </div>
                </div>
              </div>
            ))}
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
