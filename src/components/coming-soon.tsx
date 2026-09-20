import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-xs tracking-[0.22em] text-sage uppercase">
        Coming soon
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-wide uppercase">
        {title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {title === "Shop"
          ? "The store is not open yet. Print-on-demand merch comes next. The journal is live."
          : "The Dispatch is live. This page is still being built."}
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Read the Dispatch</Link>
      </Button>
    </main>
  );
}
