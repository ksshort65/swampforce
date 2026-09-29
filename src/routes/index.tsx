import { createFileRoute, Link } from "@tanstack/react-router";
import topicsIndex from "../data/topics-index.json";

const TOPICS = topicsIndex as { key: string; title: string }[];

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="fixed inset-0 bg-[#070b12]">
      <img
        src="/images/hero-capitol.jpg"
        alt=""
        className="absolute inset-x-0 top-14 block h-[calc(100%-3.5rem)] w-full object-cover object-top"
      />
      <nav className="absolute inset-x-0 top-0 z-10 flex h-14 items-center bg-[#070b12] px-6">
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
      </nav>
      <nav
        aria-label="Topics"
        className="absolute top-14 bottom-0 left-0 z-10 flex max-w-[16rem] flex-col overflow-y-auto bg-[#070b12]/80 px-6 pb-6"
      >
        {TOPICS.map((topic) => (
          <Link
            key={topic.key}
            to="/topics"
            search={{ t: topic.key }}
            data-home-topic={topic.key}
            className="py-2 text-[15px] font-semibold tracking-wide text-white"
          >
            {topic.title}
          </Link>
        ))}
      </nav>
    </main>
  );
}
