import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { useDatabase, type Database } from "@/lib/database";

function Waiting({ error, retry }: { error: string | null; retry: () => void }) {
  return (
    <main className="min-h-screen bg-[#070b12] px-6 pt-16 text-center text-white">
      {error ? (
        <div data-db-error>
          <p className="text-[16px] font-semibold">{error}</p>
          <p className="mt-2 text-[15px] text-white/80">Check the connection, then try again.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-full border border-white/35 bg-[#070b12]/75 px-5 py-2.5 text-[15px] font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : (
        <p className="text-[15px] text-white/80" data-db-loading>
          Loading…
        </p>
      )}
    </main>
  );
}

/** Renders its children only after data/database.json has loaded. */
export function DataGate({ children }: { children: (db: Database) => ReactNode }) {
  const { db, error, retry } = useDatabase();
  if (!db) return <Waiting error={error} retry={retry} />;
  return <>{children(db)}</>;
}

/**
 * Loads data/database.json first, then the page's code, so a page whose code reads the
 * data when it starts (The Great American Betrayal) always sees the full, current file.
 */
export function DataPage({ load }: { load: () => Promise<{ default: ComponentType }> }) {
  const { db, error, retry } = useDatabase();
  const [Page, setPage] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  useEffect(() => {
    if (!db || Page) return;
    let live = true;
    load().then(
      (m) => {
        if (live) setPage(() => m.default);
      },
      () => {
        if (live) setLoadError("This page could not be loaded.");
      },
    );
    return () => {
      live = false;
    };
  }, [db, Page, load, tries]);
  if (!db || !Page) return <Waiting error={error ?? loadError} retry={() => {
          setLoadError(null);
          setTries((n) => n + 1);
          retry();
        }} />;
  return <Page />;
}
