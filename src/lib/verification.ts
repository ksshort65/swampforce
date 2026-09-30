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
  // Not clearly one of the three: Yellow, and listed as a question.
  "Rated misleading": { status: "research", clear: false },
  "On the record": { status: "research", clear: false },
  "Consistent with the record": { status: "research", clear: false },
  Opinion: { status: "research", clear: false },
  "Our view": { status: "research", clear: false },
  [NO_LABEL]: { status: "research", clear: false },
};

export function statusOf(label: string | undefined): { status: Status; clear: boolean; label: string } {
  const key = label && label.trim() ? label : NO_LABEL;
  const hit = LABEL_MAP[key];
  // A label not in the map is not guessed at: Yellow, and it is a question.
  return hit ? { ...hit, label: key } : { status: "research", clear: false, label: key };
}
