import { createFileRoute, Link } from "@tanstack/react-router";

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
          to="/topics"
          className="ml-8 text-[15px] font-semibold tracking-wide text-white"
        >
          Topics
        </Link>
      </nav>
    </main>
  );
}
