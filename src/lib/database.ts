// The site's one data file: public/data/database.json (served at <base>/data/database.json).
// It is fetched at runtime with no caching, so an entry added there (by admin.html or by hand)
// shows on every tile, chart, list and the Research panel on the next page load, with no code change.

import { useEffect, useState } from "react";
import { STATUS_FIELD, statusOf, type Status } from "@/lib/verification";
import type { LawfareFile, NewsCase, PoliticalStatement, SenateHearing } from "@/lib/database-types";

export type { LawfareFile, NewsCase, PoliticalStatement, SenateHearing } from "@/lib/database-types";

export type DbSource = { label: string; href: string; local?: string; sectionLevel?: boolean };

export type DbLayers = {
  /** The tile (category) the entry belongs to. */
  tile?: string | null;
  /** Her topic charts: [chart id, bar index] or [chart id, "all"] for the chart's center list. */
  charts?: [string, number | "all"][];
  /** Her topic lists (section ids). */
  lists?: string[];
  /** Her stat boxes (index in the topic's stats). */
  stats?: number[];
};

export type DbEntry = {
  id: string;
  /** A topic key, "betrayal", or null/"" for none (then it is listed on Requires Further Research). */
  category: string | null;
  headline: string;
  sources: DbSource[];
  /** "Verified" (green), "Debunked" (red) or "Research" (yellow). */
  status: string;
  layers?: DbLayers;
  /** The rest of the original fields, kept as they were. */
  record?: Record<string, unknown>;
  /** Set on entries saved with admin.html (UTC date and time). */
  added?: string;
};

export type DbCategory = { key: string; title: string; page: string };

export type DbTopic = {
  key: string;
  title: string;
  intro: string;
  range: string;
  image?: string;
  pages?: string[];
  stats: { big: string; label: string; item: string }[];
  charts: Record<string, unknown>[];
  sections: Record<string, unknown>[];
  links: { label: string; topic?: string; app?: string; chart?: string }[];
  refs: Record<string, Record<string, unknown>>;
};

export type Database = {
  about: string[];
  statuses: string[];
  categories: DbCategory[];
  topics: Record<string, DbTopic>;
  tables: {
    lawfareCases: LawfareFile;
    politicalStatements: PoliticalStatement[];
    senateHearings: SenateHearing[];
  };
  entries: DbEntry[];
};

export const DATABASE_URL = `${import.meta.env.BASE_URL}data/database.json`;

// The site's own files that the data links to with a root address ("/old-site/...", "/lawfare-docs/...").
// When the site lives in a subfolder (/preview/), those addresses get the folder in front, as they did
// when the data was built into the code.
const LOCAL_FOLDERS = [
  "images",
  "old-site",
  "ethics-docs",
  "impeachment-docs",
  "lawfare-docs",
  "found-fake-news",
  "brand",
  "assets/vendor",
  "apple-touch-icon\\.png",
  "favicon-32\\.png",
  "hr7008-eh\\.pdf",
  "great-american-betrayal\\.html",
];

function withBase(text: string): string {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return text;
  const at = new RegExp(`(["'\`(])/(${LOCAL_FOLDERS.join("|")})(?=[/"'\`?#)\\\\])`, "g");
  return text.replace(at, `$1${base}$2`);
}

let loaded: Database | null = null;
let pending: Promise<Database> | null = null;

function check(db: unknown): Database {
  const d = db as Database;
  if (!d || !Array.isArray(d.entries) || !d.topics || !d.tables || !Array.isArray(d.categories)) {
    throw new Error("The data file is not in the expected format.");
  }
  return d;
}

/** Fetch the database once per page load (never from the browser cache). */
export function loadDatabase(): Promise<Database> {
  if (loaded) return Promise.resolve(loaded);
  if (!pending) {
    pending = fetch(DATABASE_URL, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`The data file could not be loaded (${r.status}).`);
        return r.text();
      })
      .then((text) => {
        loaded = check(JSON.parse(withBase(text)));
        return loaded;
      })
      .catch((err) => {
        pending = null;
        throw err;
      });
  }
  return pending;
}

/** The database after loadDatabase() has finished (used by code that runs only after it loaded). */
export function getDatabase(): Database {
  if (!loaded) throw new Error("The data file has not loaded yet.");
  return loaded;
}

export function useDatabase(): { db: Database | null; error: string | null; retry: () => void } {
  const [db, setDb] = useState<Database | null>(loaded);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (db) return;
    let live = true;
    loadDatabase().then(
      (d) => {
        if (live) setDb(d);
      },
      (e: unknown) => {
        if (live) setError(e instanceof Error ? e.message : "The data file could not be loaded.");
      },
    );
    return () => {
      live = false;
    };
  }, [db, attempt]);
  return {
    db,
    error,
    retry: () => {
      setError(null);
      setAttempt((n) => n + 1);
    },
  };
}

/** The status label written on the original record (topic "label", Fake News "statusLabel"). */
export function entryLabel(e: DbEntry): string | undefined {
  const r = e.record ?? {};
  if (typeof r.label === "string") return r.label;
  if (typeof r.statusLabel === "string") return r.statusLabel;
  return undefined;
}

/** Green / red / yellow: the entry's status field, or (if that is missing) the site-wide label mapping. */
export function entryStatus(e: DbEntry): Status {
  return STATUS_FIELD[e.status] ?? statusOf(entryLabel(e)).status;
}

export function hasTopic(e: DbEntry): boolean {
  return typeof e.category === "string" && e.category.trim() !== "";
}

export function entriesIn(db: Database, category: string): DbEntry[] {
  return db.entries.filter((e) => e.category === category);
}

/** A Fake News case with all of its original fields (entries added with admin.html have only a headline, link and status). */
export function isFullCase(e: DbEntry): boolean {
  return !!e.record && typeof e.record.who === "string";
}

/** The Fake News case as it was written (what was said is the entry's headline). */
export function toNewsCase(e: DbEntry): NewsCase {
  return { ...(e.record as Omit<NewsCase, "said" | "sources">), said: e.headline, sources: e.sources } as NewsCase;
}

/** Every Fake News case with its full original fields, for the charts on The Great American Betrayal page. */
export function newsCases(db: Database): NewsCase[] {
  return entriesIn(db, "betrayal").filter(isFullCase).map(toNewsCase);
}

/** "Sep 30, 2026, 6:45 PM" in the reader's own time zone. */
export function addedWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}
