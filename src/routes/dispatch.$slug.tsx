import { createFileRoute, Link } from "@tanstack/react-router";
import { EssayBody, EssayText, essayDate, getEssay } from "@/lib/dispatch";
import { getPost } from "@/lib/content";

export const Route = createFileRoute("/dispatch/$slug")({
  component: EssayPage,
  head: ({ params }) => ({
    meta: [{ title: `${getEssay(params.slug)?.title ?? getPost(params.slug)?.title ?? "The Dispatch"} — Swamp Force` }],
  }),
});

/** An essay the Archive (copied from main) lists that is not in essays.json: shown from main's src/lib/content.ts as written. */
function MainPost({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) return <p className="text-center text-[15px] text-white/80">This essay is not in the Dispatch.</p>;
  return (
    <>
      <p className="text-xs font-semibold tracking-[0.22em] text-[#d4af37] uppercase">{post.series || post.category}</p>
      <h1 className="mt-2 text-[clamp(2rem,7vw,3.4rem)] leading-[0.95] font-bold tracking-wide uppercase">{post.title}</h1>
      <p className="mt-3 text-[13px] text-white/60">{essayDate(post.date)}</p>
      <p className="mt-6 text-[18px] leading-snug text-white/90">{post.dek}</p>
      {post.receipts?.length ? (
        <div className="mt-8 rounded-2xl border border-white/25 bg-[#070b12]/85 px-4 py-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d4af37] uppercase">The file</p>
          <ul className="mt-3 flex list-none flex-col gap-2 p-0">
            {post.receipts.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8 flex flex-col gap-5">
        {post.body.map((block, i) =>
          block.type === "h" ? (
            <h2 key={i} className="pt-4 text-[20px] font-bold leading-snug tracking-wide text-white">
              {block.text}
            </h2>
          ) : block.type === "q" ? (
            <blockquote key={i} className="m-0 border-l-2 border-[#d4af37] pl-5 text-[18px] leading-snug text-white/90">
              {block.text}
            </blockquote>
          ) : block.type === "ul" ? (
            <ul key={i} className="list-disc space-y-2 pl-6 text-[16px] leading-7 text-white/85">
              {block.items.map((item, at) => (
                <li key={at}>
                  <EssayText text={item} />
                </li>
              ))}
            </ul>
          ) : block.type === "img" ? (
            <img key={i} src={block.src} alt={block.alt} className="w-full rounded-md border border-white/25" />
          ) : (
            <p key={i} className="m-0 text-[16px] leading-7 text-white/85">
              <EssayText text={block.text} />
            </p>
          ),
        )}
      </div>
    </>
  );
}

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
          <MainPost slug={slug} />
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
