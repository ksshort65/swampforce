import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs tracking-[0.22em] text-sage uppercase">
        Contact
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-wide uppercase">
        Write the editor
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Proton. No party inbox. For the Dispatch, a correction, or the Inner
        Circle.
      </p>
      <Button asChild className="mt-8">
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </Button>
    </main>
  );
}
