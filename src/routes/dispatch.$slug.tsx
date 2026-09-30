import { createFileRoute, Link } from "@tanstack/react-router";
import { EssayBody, essayDate, getEssay } from "@/lib/dispatch";

export const Route = createFileRoute("/dispatch/$slug")({
  component: EssayPage,
  head: ({ params }) => ({ meta: [{ title: `${getEssay(params.slug)?.title ?? "The Dispatch"} — Swamp Force` }] }),
});

function EssayPage() {
  const { slug } = Route.useParams();
  const essay = getEssay(slug);
  return (
    <main className="min-h-screen bg-[#070b12] text-white" data-dispatch-page={slug}>
      <nav className="sticky top-0 z-20 flex min-h-14 items-center justify-between bg-[#070b12]/95 px-4 py-2">
        <Link to="/dispatch" data-back className="text-[15px] font-semibold tracking-wide text-white no-underline">
          ‹ The Dispatch
        </Link>
        <Link to="/" className="text-[15px] font-semibold tracking-wide text-white no-underline">
          Home
        </Link>
      </nav>
      <article className="mx-auto max-w-2xl px-5 pt-8 pb-24">
        {essay ? (
          <>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4af37] uppercase">{essay.series}</p>
            <h1 className="mt-2 text-[clamp(2rem,7vw,3.4rem)] leading-[0.95] font-bold tracking-wide uppercase">{essay.title}</h1>
            <p className="mt-3 text-[13px] text-white/60">{essayDate(essay.date)}</p>
            <div className="mt-8">
              <EssayBody body={essay.body} />
            </div>
          </>
        ) : (
          <p className="text-center text-[15px] text-white/80">This essay is not in the Dispatch.</p>
        )}
        <p className="mt-12">
          <Link to="/dispatch" className="text-[15px] font-semibold text-[#d4af37] no-underline">
            ← The Dispatch
          </Link>
        </p>
      </article>
    </main>
  );
}
