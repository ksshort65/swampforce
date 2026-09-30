import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import topicsIndex from "../data/topics-index.json";

const TOPICS = topicsIndex as { key: string; title: string; image?: string }[];

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="fixed inset-0 bg-[#070b12]">
      <img
        src="/images/hero-capitol.jpg"
        alt=""
        className="absolute inset-x-0 top-14 block h-[calc(100%-3.5rem)] w-full object-cover object-top"
      />
      <nav className="absolute inset-x-0 top-0 z-10 flex h-14 items-center overflow-x-auto bg-[#070b12] px-6 whitespace-nowrap">
        <Link
          to="/betrayal"
          className="text-[15px] font-semibold tracking-wide text-white"
        >
          The Great American Betrayal
        </Link>
        <Link
          to="/scorecard"
          className="ml-6 text-[15px] font-semibold tracking-wide text-white"
        >
          ORIGINAL SCORECARD
        </Link>
        <Link
          to="/research"
          data-home-research
          className="ml-6 text-[15px] font-semibold tracking-wide text-[#e3b21f]"
        >
          Requires Further Research
        </Link>
      </nav>
      {/* Layer 1: her topics as a grid of square Topic Tiles over the hero image. */}
      <nav
        aria-label="Topics"
        className="absolute inset-x-0 top-14 bottom-0 z-10 overflow-y-auto px-4 pt-6 pb-10"
      >
        <div className="mx-auto mb-4 flex max-w-5xl justify-center">
          <Link
            to="/research"
            data-home-research-tile
            className="rounded-full border border-[#e3b21f] bg-[#070b12]/90 px-5 py-2.5 text-[15px] font-semibold text-white no-underline"
          >
            Requires Further Research
          </Link>
        </div>
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {TOPICS.map((topic) => (
            <li key={topic.key}>
              <Link
                to="/topics"
                search={{ t: topic.key }}
                data-home-topic={topic.key}
                data-tile
                className="relative block aspect-square w-full overflow-hidden rounded-2xl border border-white/30 bg-[#0b1220] no-underline"
              >
                <TileImage src={topic.image} />
                <span className="absolute inset-x-0 bottom-0 bg-[#070b12]/80 px-3 py-2 text-[15px] leading-snug font-semibold tracking-wide text-white">
                  {topic.title}
                </span>
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
