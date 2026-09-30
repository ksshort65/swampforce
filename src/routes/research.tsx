import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import topicsIndex from "../data/topics-index.json";
import linkCheck from "../data/link-check.json";
import {
  REASONS,
  fakeNewsEntries,
  lawfareEntries,
  statementEntries,
  topicEntries,
  type Reason,
  type ResearchEntry,
} from "@/lib/research";

export const Route = createFileRoute("/research")({ component: Research });

const INDEX = topicsIndex as { key: string; title: string }[];
const TOPIC_LOADERS = import.meta.glob("../data/topics/*.json", { import: "default" }) as Record<
  string,
  () => Promise<{ key: string; title: string; items: Record<string, never> }>
>;
const DEAD = (linkCheck as { dead: Record<string, string> }).dead;

async function loadAll(): Promise<ResearchEntry[]> {
  const [fake, statements, senate, lawfare, ...topics] = await Promise.all([
    import("../data/fake-news-cases.json").then((m) => m.default as unknown as Record<string, unknown>[]),
    import("../data/political-statements.json").then((m) => m.default as unknown as Record<string, unknown>[]),
    import("../data/senate-hearings.json").then((m) => m.default as unknown as Record<string, unknown>[]),
    import("../data/lawfare-cases.json").then(
      (m) => (m.default as unknown as { cases: Record<string, unknown>[] }).cases,
    ),
    ...INDEX.map((t) => {
      const load = TOPIC_LOADERS[`../data/topics/${t.key}.json`];
      return load ? load() : Promise.resolve(null);
    }),
  ]);
  const out: ResearchEntry[] = [];
  for (const t of topics) if (t) out.push(...topicEntries(t, DEAD));
  out.push(...fakeNewsEntries(fake, DEAD));
  out.push(...lawfareEntries(lawfare, DEAD));
  out.push(
    ...statementEntries(
      statements,
      "Political statements",
      "statements",
      "person",
      (r) => `${String(r.person ?? "")} \u00b7 ${String(r.network ?? "")}`,
      DEAD,
    ),
  );
  out.push(
    ...statementEntries(
      senate,
      "Senate hearings",
      "senate",
      "senator",
      (r) => `${String(r.senator ?? "")} \u00b7 ${String(r.hearing ?? "")}`,
      DEAD,
    ),
  );
  return out;
}

const PILL =
  "rounded-full border px-4 py-2 text-left text-[15px] font-semibold leading-snug text-white";

function Research() {
  const [all, setAll] = useState<ResearchEntry[] | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [where, setWhere] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    loadAll().then((e) => {
      if (live) setAll(e);
    });
    return () => {
      live = false;
    };
  }, []);
  const places = useMemo(() => {
    const m = new Map<string, { name: string; n: number }>();
    for (const e of all ?? []) {
      const p = m.get(e.whereKey) ?? { name: e.where, n: 0 };
      p.n += 1;
      m.set(e.whereKey, p);
    }
    return [...m.entries()];
  }, [all]);
  const byWhere = (all ?? []).filter((e) => !where || e.whereKey === where);
  const shown = byWhere.filter((e) => !reason || e.reasons.includes(reason));
  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <nav className="sticky top-0 z-20 flex min-h-14 items-center bg-[#070b12]/95 px-4 py-2">
        <Link to="/" data-back className="text-[15px] font-semibold tracking-wide text-white no-underline">
          ‹ Home
        </Link>
      </nav>
      <div className="mx-auto flex max-w-3xl flex-col px-5 pt-6 pb-24" data-research>
        <h1 className="text-center text-[18px] font-semibold tracking-wide text-white">
          Requires Further Research
        </h1>
        <p className="mt-1 text-center text-[15px] text-white/75">
          Entries with poor or missing source data, listed automatically from the records as written.
        </p>
        {!all ? (
          <p className="mt-10 text-center text-[15px] text-white/80">Loading…</p>
        ) : (
          <>
            <p className="mt-6 text-center text-[30px] font-bold" data-research-total={all.length}>
              {all.length}
            </p>
            <p className="text-center text-[15px] text-white/80">entries need more research</p>
            <p className="mt-6 text-[15px] font-semibold">Why</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                data-reason="all"
                aria-pressed={!reason}
                onClick={() => setReason(null)}
                className={`${PILL} ${!reason ? "border-[#e3b21f] bg-white/10" : "border-white/35 bg-[#070b12]/75"}`}
              >
                All · {byWhere.length}
              </button>
              {REASONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  data-reason={r.key}
                  aria-pressed={reason === r.key}
                  onClick={() => setReason(reason === r.key ? null : r.key)}
                  className={`${PILL} ${reason === r.key ? "border-[#e3b21f] bg-white/10" : "border-white/35 bg-[#070b12]/75"}`}
                >
                  {r.name} · {byWhere.filter((e) => e.reasons.includes(r.key)).length}
                </button>
              ))}
            </div>
            <p className="mt-5 text-[15px] font-semibold">Where</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                data-where="all"
                aria-pressed={!where}
                onClick={() => setWhere(null)}
                className={`${PILL} ${!where ? "border-[#e3b21f] bg-white/10" : "border-white/35 bg-[#070b12]/75"}`}
              >
                Everywhere · {all.length}
              </button>
              {places.map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  data-where={key}
                  aria-pressed={where === key}
                  onClick={() => setWhere(where === key ? null : key)}
                  className={`${PILL} ${where === key ? "border-[#e3b21f] bg-white/10" : "border-white/35 bg-[#070b12]/75"}`}
                >
                  {p.name} · {p.n}
                </button>
              ))}
            </div>
            <p className="mt-6 text-[15px] text-white/80" data-research-shown={shown.length}>
              Showing {shown.length}
            </p>
            <div className="mt-2 flex flex-col">
              {shown.map((e) => (
                <article key={e.id} data-research-entry={e.id} className="border-b border-white/15 py-4">
                  <p className="text-[14px] text-white/65">{e.where}</p>
                  <p className="mt-1 text-[16px] leading-snug font-semibold">{e.title}</p>
                  {e.line ? <p className="mt-2 text-[15px] leading-snug text-white/90">{e.line}</p> : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {e.reasons.map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-[#e3b21f]/70 px-3 py-1 text-[14px] text-[#f1d27a]"
                      >
                        {REASONS.find((x) => x.key === r)?.name}
                      </span>
                    ))}
                  </div>
                  {e.deadLinks.map((d) => (
                    <p key={d.href} className="mt-2 break-all text-[14px] text-white/75">
                      Dead: {d.href} · {d.why}
                    </p>
                  ))}
                  {e.links.length ? (
                    <div className="mt-2 flex flex-col gap-1">
                      {e.links.map((l, i) => (
                        <a
                          key={i}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-semibold break-all text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {e.topic ? (
                    <Link
                      to="/topics"
                      search={{ t: e.topic }}
                      className="mt-2 inline-block text-[15px] font-semibold text-white underline decoration-white/40 underline-offset-2"
                    >
                      Open the {e.where} tile
                    </Link>
                  ) : e.whereKey === "fake" || e.whereKey === "lawfare" ? (
                    <Link
                      to="/betrayal"
                      className="mt-2 inline-block text-[15px] font-semibold text-white underline decoration-white/40 underline-offset-2"
                    >
                      Open The Great American Betrayal
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
            <p className="mt-8 text-[14px] leading-snug text-white/65">
              Dead links: {(linkCheck as { note: string }).note} Checked {(linkCheck as { checked: string }).checked}.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
