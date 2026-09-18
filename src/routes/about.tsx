import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs tracking-[0.22em] text-sage uppercase">
        About
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-wide uppercase">
        This is a republic.
      </h1>
      <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed text-fg/85">
        <p>
          This is not opinion. This is how the country has been running, and
          it cannot continue. They divided a nation so neighbor would fight
          neighbor and never look at the shop. We the People are in an
          information war with our own government. It no longer serves the
          people. It serves the crime syndicate it has become. The villain is
          not the other jersey. The villain is the people who sold you the
          fight. The file is how we pull it back together.
        </p>
        <p>
          Hannah Arendt, <em>The Origins of Totalitarianism</em>: the ideal
          subject is not the convinced partisan. It is the person for whom
          fact and fiction, true and false, no longer come apart. They do not
          need you to love the shop. They need you unable to tell a statute
          from a caption. In <em>Eichmann in Jerusalem</em> she named the
          other half — evil as a career, a man who was only doing his job.
          The neighbor is not that. The functionary is. Power is people
          acting in concert. Isolation is how a republic is lost. The file is
          how it is pulled back together.
        </p>
        <p>
          Swamp Force is a journal of the file: the statute, the table, and
          the tape. It is not a party. It is not a PAC. It does not call
          anyone into the street.
        </p>
        <p>
          The political club already had this country — politicians,
          bureaucrats, special interests treating the people as a cash
          machine — long
          before any businessman filed papers. When a donor they loved looked
          like a pragmatist who might close the shop, they went into
          self-defense and attacked the whole country to keep the racket. That
          is how we got here. That is what we print.
        </p>
        <p>
          We will print the ugly lines that are on the recording. We will not
          print a caption as if it were a conviction. If a claim cannot survive
          the rest of the sentence, it does not belong here.
        </p>
        <p>
          The writing on this site is by {SITE.author}, published as{" "}
          {SITE.name}. {SITE.copyright} You may quote with credit and a link.
          You may not copy the work as your own.
        </p>
        <p>
          This journal was built with Grok, from xAI — as a tool. U.S.
          copyright requires a human author. Grok cannot hold the ©.{" "}
          {SITE.author} claims the selection, the arrangement, and the
          compilation. The tool does not own the oath.
        </p>
      </div>
      <p className="mt-10 font-display text-xs tracking-[0.16em] text-muted uppercase">
        <Link to="/how" className="text-sage no-underline">
          How we got here
        </Link>
        {" · "}
        <a href={`mailto:${SITE.email}`} className="text-sage no-underline">
          {SITE.email}
        </a>
      </p>
    </main>
  );
}
