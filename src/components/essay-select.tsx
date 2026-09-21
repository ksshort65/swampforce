import { START_HERE, getPost, posts } from "@/lib/content";

export function EssaySelect() {
  const startSet = new Set<string>(START_HERE);
  const start = START_HERE.map((slug) => getPost(slug)).filter(Boolean);
  const more = posts.filter((p) => !startSet.has(p.slug));
  return (
    <select
      defaultValue=""
      aria-label="The journal"
      className="min-h-11 min-w-[12rem] flex-1 border border-sage bg-bg px-3 font-display text-sm font-semibold tracking-[0.14em] text-sage uppercase sm:flex-none"
      onChange={(e) => {
        const slug = e.target.value;
        if (!slug) return;
        window.location.assign(`/dispatch/${slug}`);
      }}
    >
      <option value="">The journal</option>
      <optgroup label="Dispatch">
        {start.map((p) => (
          <option key={p!.slug} value={p!.slug}>
            {p!.title}
          </option>
        ))}
      </optgroup>
      <optgroup label="More">
        {more.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.title}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
