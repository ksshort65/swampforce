import { createFileRoute, Link } from "@tanstack/react-router";
import { JOURNAL, posts, getPost } from "@/lib/content";

export const Route = createFileRoute("/archive")({
  component: ArchivePage,
  head: () => ({
    meta: [
      { title: "Archive — Swamp Force" },
      {
        name: "description",
        content: "The journal. Every dispatch.",
      },
    ],
  }),
});

function ArchivePage() {
  const listed = new Set<string>(JOURNAL.flatMap((s) => [...s.slugs]));
  const rest = posts.filter((p) => !listed.has(p.slug));
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        The journal
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-wide uppercase sm:text-5xl">
        Archive
      </h1>

      <section className="mt-12 border-t border-border pt-10">
        <Link to="/scorecard" className="block text-fg no-underline">
          <p className="font-display text-xl font-semibold tracking-wide uppercase">
            Congressional Scorecard
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            GOP. Dem. Split. Oval. Compare. Charts or the file.
          </p>
        </Link>
        <Link to="/pump" className="mt-6 block text-fg no-underline">
          <p className="font-display text-xl font-semibold tracking-wide uppercase">
            The pump
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Gas and diesel. Four administrations. EIA.
          </p>
        </Link>
      </section>

      {JOURNAL.map((section) => {
        const lessons = section.slugs.map((s) => getPost(s)).filter(Boolean);
        if (!lessons.length) return null;
        return (
          <section key={section.name} className="mt-12 border-t border-border pt-10">
            <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
              {section.name}
            </p>
            <ul className="mt-6 space-y-5">
              {lessons.map((p) => (
                <li key={p!.slug}>
                  <Link
                    to="/dispatch/$slug"
                    params={{ slug: p!.slug }}
                    className="text-fg no-underline"
                  >
                    <p className="font-display text-lg font-semibold tracking-wide uppercase">
                      {p!.title}
                    </p>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                      {p!.dek}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {rest.length ? (
        <section className="mt-12 border-t border-border pt-10">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
            More
          </p>
          <ul className="mt-6 space-y-5">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/dispatch/$slug"
                  params={{ slug: p.slug }}
                  className="text-fg no-underline"
                >
                  <p className="font-display text-lg font-semibold tracking-wide uppercase">
                    {p.title}
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                    {p.dek}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}