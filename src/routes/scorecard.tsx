import { createFileRoute, Link } from "@tanstack/react-router";
import { MidtermScorecard } from "@/components/midterm-scorecard";

export const Route = createFileRoute("/scorecard")({
  component: ScorecardPage,
  head: () => ({
    meta: [
      { title: "Both parties failed — Congressional Scorecard — Swamp Force" },
      {
        name: "description",
        content: "The fire is Congress. The blame game is politics. Charts with sources.",
      },
      {
        property: "og:url",
        content: "https://swampforce.grok.me/scorecard",
      },
      { property: "og:title", content: "Both parties failed. They do not represent the American people." },
      {
        property: "og:description",
        content: "The fire is Congress. The blame game is politics.",
      },
      {
        property: "og:image",
        content: "https://swampforce.grok.me/og-scorecard.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Both parties failed. They do not represent the American people." },
      {
        name: "twitter:image",
        content: "https://swampforce.grok.me/og-scorecard.jpg",
      },
    ],
  }),
});

function ScorecardPage() {
  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <p className="font-display text-xs tracking-[0.18em] text-muted uppercase">
          <Link to="/dispatch" className="text-sage no-underline">
            ← Swamp Force
          </Link>
        </p>
      </div>
      <MidtermScorecard />
    </main>
  );
}
