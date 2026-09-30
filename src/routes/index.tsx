import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import topicsIndex from "../data/topics-index.json";

const TOPICS = topicsIndex as { key: string; title: string; image?: string }[];

export const Route = createFileRoute("/")({ component: Home });

const TILE =
  "relative block aspect-square w-full overflow-hidden rounded-2xl border border-white/30 bg-[#0b1220] no-underline";

function TileTitle({ title }: { title: string }) {
  return (
    <span className="absolute inset-x-0 bottom-0 bg-[#070b12]/80 px-3 py-2 text-[15px] leading-snug font-semibold tracking-wide text-white">
      {title}
    </span>
  );
}

function Home() {
  return (
    <main className="fixed inset-0 bg-[#070b12]">
      <img
        src="/images/hero-capitol.jpg"
        alt=""
        className="absolute inset-0 block h-full w-full object-cover object-top"
      />
      {/* Layer 1: tiles only. Her three top links are now tiles, then her topics. */}
      <nav aria-label="Topics" className="absolute inset-0 z-10 overflow-y-auto px-4 pt-6 pb-10">
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <li>
            <Link to="/betrayal-status" data-home-betrayal data-tile className={TILE}>
              <TileImage src="/images/tile-home-betrayal.jpg" />
              <TileTitle title="The Great American Betrayal" />
            </Link>
          </li>
          <li>
            <Link to="/scorecard" data-home-scorecard data-tile className={TILE}>
              <TileImage src="/images/tile-home-scorecard.jpg" />
              <TileTitle title="ORIGINAL SCORECARD" />
            </Link>
          </li>
          <li>
            <Link to="/research" data-home-research data-tile className={TILE}>
              <TileImage src="/images/tile-home-research.jpg" />
              <TileTitle title="Requires Further Research" />
            </Link>
          </li>
          {TOPICS.map((topic) => (
            <li key={topic.key}>
              <Link
                to="/topics"
                search={{ t: topic.key }}
                data-home-topic={topic.key}
                data-tile
                className={TILE}
              >
                <TileImage src={topic.image} />
                <TileTitle title={topic.title} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

/** Her tile image. A missing image leaves the dark box with the title (no image is made up). */
function TileImage({ src }: { src?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [bad, setBad] = useState(!src);
  useEffect(() => {
    const img = ref.current;
    // The image may have failed before the page became interactive.
    if (img && img.complete && img.naturalWidth === 0) setBad(true);
  }, []);
  if (bad || !src) return <span data-tile-placeholder className="absolute inset-0 bg-[#0b1220]" />;
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      onError={() => setBad(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
