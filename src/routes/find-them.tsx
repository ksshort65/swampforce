import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPost, SITE } from "@/lib/content";
import { essayHead } from "@/lib/share-head";

export const Route = createFileRoute("/find-them")({
  component: FindThem,
  loader: () => {
    const post = getPost("find-them");
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => (loaderData ? essayHead(loaderData, "/find-them") : {}),
});

function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("http") ? (
          <a
            key={i}
            href={part}
            className="break-all text-sage"
            target="_blank"
            rel="noreferrer"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function FindThem() {
  const post = Route.useLoaderData();

  return (
    <main>
      <div className="relative min-h-[70vh] w-full overflow-hidden bg-black">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
          A missing-persons file · {post.date}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.92] font-bold tracking-wide uppercase sm:text-7xl">
          {post.title}
        </h1>
        <p className="mt-6 font-serif text-2xl leading-snug text-fg/90">
          {post.dek}
        </p>
        <p className="mt-3 font-display text-xs tracking-[0.16em] text-muted uppercase">
          {SITE.author} · {SITE.copyright}
        </p>
        {post.receipts?.length ? (
          <div className="mt-8 rounded-lg bg-surface p-4">
            <p className="font-display text-xs font-semibold tracking-[0.18em] text-sage uppercase">
              Receipts
            </p>
            <ul className="mt-3 space-y-2">
              {post.receipts.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sage underline-offset-2 hover:underline"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-10 space-y-6">
          {post.body.map((block, i) => {
            if (block.type === "h") {
              return (
                <h2
                  key={i}
                  className="pt-4 font-display text-2xl font-semibold tracking-wide uppercase"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "q") {
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-sage pl-5 font-serif text-xl leading-snug text-fg/90"
                >
                  {block.text}
                </blockquote>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="list-disc space-y-2 pl-6 font-serif text-lg text-fg/85">
                  {block.items.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "img") {
              return (
                <figure key={i}>
                  <img src={block.src} alt={block.alt} className="w-full rounded-md border border-border" />
                </figure>
              );
            }
            return (
              <p key={i} className="font-serif text-lg leading-relaxed text-fg/85">
                <LinkedText text={block.text} />
              </p>
            );
          })}
        </div>
        <p className="mt-14 font-display text-xs tracking-[0.18em] text-muted uppercase">
          ICE owns the search. Until they are found.
        </p>
      </article>
    </main>
  );
}
