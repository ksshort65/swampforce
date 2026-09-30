// Layer 3: entries with poor or missing source data, found automatically from
// the data as written. Nothing is added or guessed; each entry lists why it is here.
// "Status: Research" = the entry maps to Yellow (Needs Research) under the site-wide mapping.

import { statusOf } from "@/lib/verification";

export type Reason = "status-research" | "no-link" | "dead-link" | "unknown" | "see-linked" | "no-person";

export const REASONS: { key: Reason; name: string }[] = [
  { key: "status-research", name: "Status: Research" },
  { key: "no-link", name: "No source link" },
  { key: "dead-link", name: "Dead link" },
  { key: "unknown", name: "Says \u201cUnknown\u201d" },
  { key: "see-linked", name: "Says \u201cSee the linked record\u201d" },
  { key: "no-person", name: "No person named" },
];

export type Link = { label: string; href: string };
export type ResearchEntry = {
  id: string;
  where: string;
  whereKey: string;
  title: string;
  line?: string;
  links: Link[];
  reasons: Reason[];
  deadLinks: { href: string; why: string }[];
  topic?: string;
};

type AnyRec = Record<string, unknown>;

function strings(o: unknown, out: string[] = []): string[] {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
  else if (o && typeof o === "object") Object.values(o as AnyRec).forEach((x) => strings(x, out));
  return out;
}

const UNKNOWN = /\bUnknown\b/;
const SEE_LINKED = "See the linked record";
const NO_PERSON = new Set(["", "Not yet identified", "Not identified", "Unknown"]);

function check(
  base: Omit<ResearchEntry, "reasons" | "deadLinks">,
  text: string[],
  dead: Record<string, string>,
  person?: string | null,
  research?: boolean,
): ResearchEntry | null {
  const reasons: Reason[] = [];
  if (research) reasons.push("status-research");
  const links = base.links.filter((l) => l.href);
  if (!links.length) reasons.push("no-link");
  const deadLinks = links.filter((l) => dead[l.href]).map((l) => ({ href: l.href, why: dead[l.href] }));
  if (deadLinks.length) reasons.push("dead-link");
  if (text.some((s) => UNKNOWN.test(s))) reasons.push("unknown");
  if (text.some((s) => s.includes(SEE_LINKED))) reasons.push("see-linked");
  if (person !== undefined && NO_PERSON.has((person ?? "").trim())) reasons.push("no-person");
  return reasons.length ? { ...base, links, reasons, deadLinks } : null;
}

type TopicItem = {
  title: string;
  lines?: string[];
  more?: string[];
  label?: string;
  status?: string;
  sources?: Link[];
  dup?: unknown;
};

export function topicEntries(
  topic: { key: string; title: string; items: Record<string, TopicItem> },
  dead: Record<string, string>,
) {
  const out: ResearchEntry[] = [];
  for (const [id, it] of Object.entries(topic.items)) {
    if (it.dup) continue; // shown in its own topic
    const e = check(
      {
        id: `${topic.key}:${id}`,
        where: topic.title,
        whereKey: `topic:${topic.key}`,
        title: it.title,
        line: it.lines?.[0] ?? it.more?.[0],
        links: (it.sources ?? []).map((s) => ({ label: s.label, href: s.href })),
        topic: topic.key,
      },
      strings([it.title, it.lines, it.more, it.label]),
      dead,
      undefined,
      statusOf(it.label, it.status).status === "research",
    );
    if (e) out.push(e);
  }
  return out;
}

export function fakeNewsEntries(cases: AnyRec[], dead: Record<string, string>) {
  const out: ResearchEntry[] = [];
  for (const c of cases) {
    const { sources, ...rest } = c as AnyRec & { sources?: Link[] };
    const e = check(
      {
        id: `fake:${c.id}`,
        where: "Fake News cases",
        whereKey: "fake",
        title: `Case #${c.id} \u00b7 ${String(c.who ?? "")}`,
        line: typeof c.said === "string" ? c.said : undefined,
        links: (sources ?? []).map((s) => ({ label: s.label, href: s.href })),
      },
      strings(rest),
      dead,
      typeof c.person === "string" ? c.person : "",
      statusOf(typeof c.statusLabel === "string" ? c.statusLabel : undefined).status === "research",
    );
    if (e) out.push(e);
  }
  return out;
}

export function statementEntries(
  rows: AnyRec[],
  where: string,
  whereKey: string,
  personKey: string,
  titleOf: (r: AnyRec) => string,
  dead: Record<string, string>,
) {
  const out: ResearchEntry[] = [];
  for (const r of rows) {
    const { sources, ...rest } = r as AnyRec & { sources?: Link[] };
    const e = check(
      {
        id: `${whereKey}:${r.id}`,
        where,
        whereKey,
        title: titleOf(r),
        line: typeof r.said === "string" ? r.said : undefined,
        links: (sources ?? []).map((s) => ({ label: s.label, href: s.href })),
      },
      strings(rest),
      dead,
      typeof r[personKey] === "string" ? (r[personKey] as string) : "",
    );
    if (e) out.push(e);
  }
  return out;
}

const URL_RE = /https?:\/\/[^\s;,)]+/g;

export function lawfareEntries(cases: AnyRec[], dead: Record<string, string>) {
  const out: ResearchEntry[] = [];
  for (const c of cases) {
    const text = strings(c);
    const hrefs = [...new Set(text.flatMap((s) => s.match(URL_RE) ?? []))];
    const e = check(
      {
        id: `lawfare:${c.id}`,
        where: "Lawfare cases",
        whereKey: "lawfare",
        title: String(c.caseName ?? c.shortName ?? c.id),
        line: typeof c.shortStatus === "string" ? c.shortStatus : undefined,
        links: hrefs.map((h) => ({ label: h.replace(/^https?:\/\//, "").split("/")[0], href: h })),
      },
      text,
      dead,
    );
    if (e) out.push(e);
  }
  return out;
}
