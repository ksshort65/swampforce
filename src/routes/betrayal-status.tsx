import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusDonut } from "@/components/status-donut";
import { DataGate } from "@/components/data-gate";
import { EntryCard } from "@/components/entry-card";
import {
  entriesIn,
  entryLabel,
  isFullCase,
  toNewsCase,
  type Database,
  type DbEntry,
  type NewsCase,
} from "@/lib/database";

export const Route = createFileRoute("/betrayal-status")({ component: BetrayalStatus });

type Case = NewsCase;

// Layer 2 for The Great American Betrayal tile: the Fake News cases by verification status.
function BetrayalStatus() {
  return <DataGate>{(db) => <BetrayalStatusPage db={db} />}</DataGate>;
}

function BetrayalStatusPage({ db }: { db: Database }) {
  // Every entry whose category is "betrayal" in data/database.json, counted live.
  const entries = entriesIn(db, "betrayal");
  const byId: Record<string, DbEntry> = Object.fromEntries(entries.map((e) => [e.id, e]));
  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <nav className="sticky top-0 z-20 flex min-h-14 items-center bg-[#070b12]/95 px-4 py-2">
        <Link to="/" data-back className="text-[15px] font-semibold tracking-wide text-white no-underline">
          ‹ Home
        </Link>
        <Link
          to="/betrayal"
          data-open-betrayal
          className="ml-auto shrink-0 pl-4 text-[15px] font-semibold tracking-wide text-white no-underline"
        >
          Open The Great American Betrayal
        </Link>
      </nav>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-6 pb-24">
        <h1 className="text-center text-[18px] font-semibold tracking-wide text-white">
          The Great American Betrayal
        </h1>
        <p className="mt-1 text-center text-[15px] text-white/75">Fake News cases · {entries.length}</p>
        <StatusDonut
          title="The Great American Betrayal: Verification Status"
          line="Tap a slice or a key line to see its evidence"
          entries={entries.map((e) => ({ id: e.id, label: entryLabel(e), status: e.status }))}
          renderCards={(ids) => (
            <div className="mt-4 flex w-full flex-col text-left">
              {ids.map((id) => {
                const e = byId[id];
                if (!e) return null;
                return isFullCase(e) ? <CaseCard key={id} c={toNewsCase(e)} /> : <EntryCard key={id} e={e} />;
              })}
            </div>
          )}
        />
        <Link
          to="/betrayal"
          className="mt-8 rounded-full border border-white/35 bg-[#070b12]/75 px-5 py-2.5 text-[15px] font-semibold text-white no-underline"
        >
          Open The Great American Betrayal
        </Link>
      </div>
    </main>
  );
}

function CaseCard({ c }: { c: Case }) {
  return (
    <article data-item={c.id} className="border-b border-white/15 py-4 text-left">
      <p className="text-[16px] leading-snug font-semibold text-white">
        Case #{c.id} · {c.who}
      </p>
      <p className="mt-1 text-[15px] text-white/70">
        {c.statusLabel} · {c.began}
      </p>
      <p className="mt-2 text-[15px] leading-snug text-white">What was said: {c.said}</p>
      <p className="mt-2 text-[15px] leading-snug text-white/85">The record: {c.record}</p>
      <p className="mt-2 text-[15px] text-white/70">Correction: {c.correction}</p>
      <div className="mt-2 flex flex-col gap-1">
        {c.sources.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-semibold break-all text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
          >
            {s.label}
          </a>
        ))}
      </div>
    </article>
  );
}
