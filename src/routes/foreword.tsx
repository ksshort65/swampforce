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
          "A letter from the editor. Why this journal exists. Independent. No PAC.",
      },
    ],
  }),
});

function ForewordPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
        From the editor
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-wide uppercase sm:text-5xl">
        Foreword
      </h1>
      <p className="mt-3 font-display text-sm tracking-[0.12em] text-muted uppercase">
        {SITE.author} · {SITE.name}
      </p>

      <div className="mt-10 space-y-6 text-lg leading-relaxed">
        <p>
          Swamp Force is a journal of the record. The statute. The table. The
          tape. A caption is not a conviction. If a claim cannot survive the
          rest of the sentence, it does not belong here.
        </p>
        <p>
          Congress holds the purse. Both parties failed that job. They have
          not balanced a budget since the Clinton years. They do not pass the
          twelve money bills. That open book is how waste walks out the door.
          The neighbor is not the enemy. The building is.
        </p>
        <p>
          Sovereignty sits with the people. Representatives are employees
          holding a list of enumerated powers. Everything not on that list
          stayed home. A news banner cannot amend it. A two-minute panel does
          not hold office.
        </p>
        <p>
          Independent. No party. No PAC. Not a call to violence. The legal
          firing date is Election Day. The file is so that date is not wasted
          on a jersey.
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
          params={{ slug: "that-is-not-why-they-are-elected" }}
          className="text-sage no-underline hover:text-fg"
        >
          The lead story →
        </Link>
      </p>
    </main>
  );
}
