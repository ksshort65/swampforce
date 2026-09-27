import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/about")({
 component: AboutPage,
 head: () => ({
  meta: [
   { title: `About — ${SITE.name}` },
   {
    name: "description",
    content:
          "This journal prints the record. The country is the employer.",
   },
  ],
 }),
});

function AboutPage() {
 return (
  <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
   <p className="font-display text-xs tracking-[0.22em] text-sage uppercase">
    Masthead
   </p>
   <h1 className="mt-2 font-display text-5xl font-bold tracking-wide uppercase">
    About
   </h1>
   <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed text-fg/85">
    <p>
     {SITE.masthead}
    </p>
    <p>
     {SITE.tagline}
    </p>
    <p>
     Written by {SITE.author}. If a claim cannot survive the rest of the
     sentence, it does not belong here.
    </p>
    <p>
     {SITE.copyright} Quote with credit and a link. Do not copy the work
     as original. Built with Grok as a tool. The © is {SITE.author}’s.
    </p>
   </div>
   <p className="mt-10 font-display text-xs tracking-[0.16em] text-muted uppercase">
    <a href={`mailto:${SITE.email}`} className="text-sage no-underline">
     {SITE.email}
    </a>
   </p>
  </main>
 );
}
