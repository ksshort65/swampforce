import { createFileRoute, Link } from "@tanstack/react-router";
import { MidtermScorecard } from "@/components/midterm-scorecard";

export const Route = createFileRoute("/scorecard")({
  component: ScorecardPage,
  head: () => ({
    meta: [
      { title: "Congressional Scorecard — Swamp Force" },
      {
        name: "description",
        content:
          "Congress holds the purse. $40T. DSA is on the ballot. Show up Nov 3.",
      },
      {
        property: "og:url",
        content: "https://swampforce.grok.me/scorecard",
      },
      { property: "og:title", content: "Congressional Scorecard — Swamp Force" },
      {
        property: "og:description",
        content:
          "Congress holds the purse. $40T. DSA is on the ballot. Show up Nov 3.",
      },
      {
        property: "og:image",
        content: "https://swampforce.grok.me/og-scorecard.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Congressional Scorecard — Swamp Force" },
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
