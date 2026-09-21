import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/foreword")({
 component: ForewordPage,
 head: () => ({
  meta: [
   { title: `Foreword — ${SITE.name}` },
   {
    name: "description",
    content:
     "A journal of record. The laws and official files anyone can open. What was done, not a narrative.",
   },
  ],
 }),
});

function ForewordPage() {
 return (
  <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
   <h1 className="font-display text-4xl font-bold tracking-wide uppercase sm:text-5xl">
    Foreword
   </h1>
   <p className="mt-3 font-display text-sm tracking-[0.12em] text-muted uppercase">
    {SITE.author} · {SITE.name}
   </p>

   <div className="mt-10 space-y-6 text-lg leading-relaxed">
    <p>
     Swamp Force is a journal of record. I publish the laws and official
     files anyone can open. I provide what is on the record: the facts of
     actions taken by our representatives. I do not write a narrative.
    </p>
    <p>
     It is not what we say that defines us. It is what we do. Form your
     own opinions from the actions taken, not from the words spoken. This
     journal records what was done, not statements cut out of context.
    </p>
    <p>
     Unless I specifically mark a passage as my opinion, treat what is
     written here as the record. I am a fellow American, loyal to no
     party. If a number is wrong or a page breaks, write{" "}
     <a href={`mailto:${SITE.email}`} className="text-sage no-underline">
      {SITE.email}
     </a>
     . Any peaceful person who wants a correction, or a subject placed on
     the table, will get that work. I will research what the record
     requires.
    </p>
    <p>
     {SITE.author}
     <br />
     Editor
    </p>
   </div>

   <p className="mt-12 font-display text-xs font-semibold tracking-[0.16em] uppercase">
    <Link
     to="/dispatch/$slug"
     params={{ slug: "we-the-people" }}
     className="text-sage no-underline hover:text-fg"
    >
     We the People →
    </Link>
   </p>
  </main>
 );
}
