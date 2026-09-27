import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/copyright")({
  component: CopyrightPage,
});

function CopyrightPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs tracking-[0.22em] text-sage uppercase">
        Copyright
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-wide uppercase">
        The work is owned
      </h1>
      <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed text-fg/85">
        <p>{SITE.copyright}</p>
        <p>
          {SITE.mark} and The Dispatch™ are unregistered trademarks of{" "}
          {SITE.author}. The ™ mark is a common-law claim. It does not
          require a federal filing. The registered symbol ® is not used here
          and is not claimed. Trademark is not copyright. The name can be
          claimed even where a sentence cannot.
        </p>
        <p>
          U.S. copyright requires a human author. The Copyright Office said
          so in its January 2025 report. The D.C. Circuit said so in{" "}
          <em>Thaler v. Perlmutter</em>. The Supreme Court declined to hear
          that case in March 2026. Grok cannot be the author. We do not list
          it as one.
        </p>
        <p>
          What we claim: {SITE.author}'s human contribution — the
          selection, the arrangement, the headlines, the chapter path, the
          edits, the compilation that is The Dispatch. A prompt alone does
          not make a person the author of a machine's sentence. A
          publisher who directs, cuts, sequences, and stands behind the file
          does. That is the line the Office draws. If we register, we will
          disclose the tool, as the Office requires.
        </p>
        <p>
          What we do not claim: raw machine output as if it were a novel;
          statutes, Treasury tables, and other public records; Arendt's
          books; anyone else's tape. Facts are not owned. The journalism
          that sits around them is, to the extent a human put it there.
        </p>
        <p>
          Brief passages may be quoted with credit to {SITE.author} and a
          link. The compilation may not be scraped or republished as original.
        </p>
        <p>
          This journal was built with Grok, from xAI — as a tool. The file
          is still ours. The tool does not own the oath.
        </p>
        <p>
          Permission:{" "}
          <a href={`mailto:${SITE.email}`} className="text-sage">
            {SITE.email}
          </a>
        </p>
      </div>
      <p className="mt-10 font-display text-xs tracking-[0.16em] text-muted uppercase">
        <Link to="/about" className="text-sage no-underline">
          About
        </Link>
      </p>
    </main>
  );
}
