// Verification status for the Layer 2 donut charts.
// Green = Verified, Red = Debunked (proven false / fact-checked false),
// Yellow = Needs Research (not yet verified / still being checked).
// Statuses come only from labels already written in the data. A label that
// does not clearly fit one of the three is put in Yellow and marked `clear: false`
// so it is listed as a question for Karen.

export type Status = "verified" | "debunked" | "research";

export const STATUS_ORDER: Status[] = ["verified", "debunked", "research"];

export const STATUS_INFO: Record<Status, { name: string; color: string; line: string }> = {
  verified: { name: "Verified", color: "#22a045", line: "Green" },
  debunked: { name: "Debunked", color: "#d23a2e", line: "Red" },
  research: { name: "Needs Research", color: "#e3b21f", line: "Yellow" },
};

/** No status label written on the entry. */
export const NO_LABEL = "(no status label)";

/** Every status label found in the Topic tiles' data, and where it goes. */
export const LABEL_MAP: Record<string, { status: Status; clear: boolean }> = {
  "Verified by SwampForce": { status: "verified", clear: true },
  "Verified (official record)": { status: "verified", clear: true },
  "Proven false": { status: "debunked", clear: true },
  "Not yet verified": { status: "research", clear: true },
  "Not yet verified (Source being added)": { status: "research", clear: true },
  "Not yet verified (Reported only)": { status: "research", clear: true },
  "Not yet verified (White House claim)": { status: "research", clear: true },
  "Not yet verified (Part reported)": { status: "research", clear: true },
  // Karen's rules (Sep 30, 2026):
  "On the record": { status: "verified", clear: true },
  "Consistent with the record": { status: "verified", clear: true },
  "Rated misleading": { status: "debunked", clear: true },
  Opinion: { status: "research", clear: true },
  "Our view": { status: "research", clear: true },
  // The Great American Betrayal (Fake News cases, statusLabel):
  "Verified \u00b7 Proven false": { status: "debunked", clear: true },
  "Verified \u00b7 Rated misleading": { status: "debunked", clear: true },
  "Fact-checked \u00b7 Not yet verified": { status: "research", clear: true },
  // No label at all (every such Topic entry now also carries status "Research").
  [NO_LABEL]: { status: "research", clear: true },
};

/** The explicit `status` field written on an entry ("Verified", "Debunked" or "Research"). */
export const STATUS_FIELD: Record<string, Status> = {
  Verified: "verified",
  Debunked: "debunked",
  Research: "research",
};

export function statusOf(
  label: string | undefined,
  status?: string,
): { status: Status; clear: boolean; label: string } {
  // An explicit status field on the entry wins over its label.
  if (status && STATUS_FIELD[status]) {
    return { status: STATUS_FIELD[status], clear: true, label: label && label.trim() ? label : `Status: ${status}` };
  }
  const key = label && label.trim() ? label : NO_LABEL;
  const hit = LABEL_MAP[key];
  // A label not in the map is not guessed at: Yellow, and it is a question.
  return hit ? { ...hit, label: key } : { status: "research", clear: false, label: key };
}

/** Whole-number percentages that always add up to exactly 100 (largest remainder). */
export function percents(counts: number[]): number[] {
  const total = counts.reduce((a, b) => a + b, 0);
  if (!total) return counts.map(() => 0);
  const raw = counts.map((c) => (c * 100) / total);
  const out = raw.map(Math.floor);
  let left = 100 - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    if (counts[i] > 0) {
      out[i] += 1;
      left -= 1;
    }
  }
  return out;
}
