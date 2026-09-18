import { useNavigate } from "@tanstack/react-router";
import { COURSE, START_HERE, getPost, posts, postsInSeries } from "@/lib/content";

type SeriesName = (typeof COURSE)[number]["name"];

const SERIES_FIRST: SeriesName[] = [
  "The Republic",
  "The Correction",
  "The Search",
  "The Hearing",
  "The Ballot",
  "The Clip",
  "The Target",
  "The Job",
];

/** Older drafts that the Start-here essays replaced. Keep the files; hide the list. */
const HIDDEN = new Set([
  "they-work-for-us",
  "they-published-the-replacement",
]);

const START = new Set<string>(START_HERE);

export function DispatchMenu({
  compact = false,
  currentSlug,
}: {
  compact?: boolean;
  currentSlug?: string;
}) {
  const navigate = useNavigate();
  const named = new Set<string>(COURSE.map((s) => s.name));
  const rest = posts.filter(
    (p) =>
      !START.has(p.slug) &&
      !HIDDEN.has(p.slug) &&
      (!p.series || !named.has(p.series)),
  );

  function open(slug: string) {
    if (!slug) return;
    void navigate({ to: "/dispatch/$slug", params: { slug } });
  }

  return (
    <label className={compact ? "block min-w-44" : "block max-w-xl"}>
      {compact ? (
        <span className="sr-only">Open an essay</span>
      ) : (
        <span className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
          The Dispatch
        </span>
      )}
      <select
        value={currentSlug ?? ""}
        onChange={(e) => open(e.target.value)}
        className={
          compact
            ? "w-full cursor-pointer border border-border bg-bg px-2 py-1.5 font-display text-xs font-semibold tracking-[0.12em] text-fg uppercase"
            : "mt-2 w-full cursor-pointer border border-border bg-ink px-3 py-3 font-display text-sm font-semibold tracking-[0.08em] text-fg uppercase"
        }
      >
        <option value="" disabled={Boolean(currentSlug)}>
          {compact ? "Start here" : "Start here — pick one"}
        </option>
        <optgroup label="Start here">
          {START_HERE.map((slug) => {
            const p = getPost(slug);
            if (!p) return null;
            return (
              <option key={slug} value={slug}>
                {p.title}
              </option>
            );
          })}
        </optgroup>
        {SERIES_FIRST.map((name) => {
          const lessons = postsInSeries(name).filter(
            (p) => !START.has(p.slug) && !HIDDEN.has(p.slug),
          );
          if (!lessons.length) return null;
          return (
            <optgroup key={name} label={name}>
              {lessons.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </optgroup>
          );
        })}
        {rest.length ? (
          <optgroup label="Also">
            {rest.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
    </label>
  );
}