import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { NarrativeFrames } from "@/components/narrative-frames";
import { EraCompare } from "@/components/era-compare";
import { LawfareLedger, SloganChart } from "@/components/lawfare-ledger";
import { getPost, nextInSeries, SITE, FAKE_NEWS_SLUGS } from "@/lib/content";
import { nextChapter } from "@/lib/flow";
import { essayHead } from "@/lib/share-head";

export const Route = createFileRoute("/dispatch/$slug")({
  beforeLoad: ({ params }) => {
    if ((FAKE_NEWS_SLUGS as readonly string[]).includes(params.slug)) return;
    throw redirect({ to: "/" });
  },
  component: EssayPage,
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => (loaderData ? essayHead(loaderData) : {}),
});

function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)]+)\)|(https?:\/\/[^\s]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(<span key={`t${i}`}>{text.slice(last, m.index)}</span>);
    const href = m[2] || m[3];
    const label = m[1] || href;
    const external = href.startsWith("http");
    nodes.push(
      <a
        key={`a${i}`}
        href={href}
        className="text-sage underline decoration-sage underline-offset-2"
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {label}
      </a>,
    );
    last = m.index + m[0].length;
    i += 1;
  }
  if (last < text.length) nodes.push(<span key="end">{text.slice(last)}</span>);
  return <>{nodes}</>;
}

function EssayPage() {
  const post = Route.useLoaderData();
  const next = nextInSeries(post.slug);
  const door = nextChapter(post.slug);

  return (
    <main>
      <div className="relative min-h-[52vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-bg/20" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-3xl flex-col justify-end px-4 pb-10 sm:px-6">
          {(FAKE_NEWS_SLUGS as readonly string[]).includes(post.slug) &&
          post.slug !== "understanding-mechanics" ? (
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              Under construction
            </p>
          ) : null}
          <p className="mt-2 font-display text-xs font-semibold tracking-[0.16em] text-fg/80 uppercase">
            {post.series || post.category}
          </p>
          <h1 className={post.slug === "the-media-ledger"
            ? "mt-3 max-w-3xl font-serif text-2xl leading-snug font-semibold tracking-normal normal-case sm:text-3xl"
            : "mt-3 font-display leading-[0.92] font-bold tracking-wide uppercase text-[clamp(2rem,8vw,4.5rem)]"}>
            {post.slug === "the-media-ledger" ? post.dek : post.title}
          </h1>
        </div>
      </div>

      <article
        className={
          post.lawfare?.length || post.frames?.length
            ? "mx-auto max-w-6xl px-4 py-12 sm:px-6"
            : "mx-auto max-w-2xl px-4 py-12 sm:px-6"
        }
      >
        {post.slug === "the-media-ledger" ? null : (
          <p className="font-serif text-2xl leading-snug text-fg/90">{post.dek}</p>
        )}
        <p className="mt-3 font-display text-xs tracking-[0.16em] text-muted uppercase">
          {SITE.copyright}
        </p>
        {post.receipts?.length ? (
          <div className="mt-8 rounded-lg bg-surface p-4">
            <p className="font-display text-xs font-semibold tracking-[0.18em] text-sage uppercase">
              The file
            </p>
            <ul className="mt-3 space-y-2">
              {post.receipts.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sage underline decoration-sage underline-offset-2"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-10 space-y-8">
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
            if (block.type === "ul") {
              return (
                <ul
                  key={i}
                  className="list-disc space-y-4 pl-6 font-serif text-lg leading-8 text-fg/85"
                >
                  {block.items.map((item) => (
                    <li key={item.slice(0, 48)}>
                      <LinkedText text={item} />
                    </li>
                  ))}
                </ul>
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
            if (block.type === "img") {
              return (
                <figure key={i} className="sm:-mx-8">
                  <img
                    src={block.src}
                    alt={block.alt}
                    className="w-full rounded-md border border-border"
                  />
                </figure>
              );
            }
            return (
              <p key={i} className="font-serif text-lg leading-8 text-fg/85">
                <LinkedText text={block.text} />
              </p>
            );
          })}
        </div>
        {post.slug === "one-word" ? <SloganChart /> : null}
        {post.lawfare?.length ? <LawfareLedger rows={post.lawfare} /> : null}
        {post.eras?.length ? (
          <div className="sm:-mx-8 lg:-mx-24">
            <EraCompare topics={post.eras} />
          </div>
        ) : null}
        {post.frames?.length ? (
          <NarrativeFrames
            frames={post.frames}
            tapeTable={post.slug === "the-media-ledger"}
            showClaim={post.slug === "they-clipped-the-tape"}
          />
        ) : null}
        {post.video ? (
          <video
            className="mt-8 w-full rounded-lg bg-black"
            controls
            playsInline
            poster={post.image}
            src={post.video}
          />
        ) : null}
        {door ? (
          <Link
            to="/dispatch/$slug"
            params={{ slug: door.slug }}
            className="mt-12 flex items-center justify-between gap-4 rounded-lg bg-sage px-5 py-4 text-sage-fg no-underline"
          >
            <span>
              <span className="block font-display text-xs tracking-[0.18em] uppercase">
                Next door · {door.n}
              </span>
              <span className="mt-1 block font-display text-lg font-semibold tracking-wide uppercase">
                {door.title}
              </span>
            </span>
            <span className="font-display text-xs tracking-[0.16em] uppercase">
              Read →
            </span>
          </Link>
        ) : null}
        {next && next.slug !== door?.slug ? (
          <Link
            to="/dispatch/$slug"
            params={{ slug: next.slug }}
            className="mt-12 flex items-center justify-between gap-4 rounded-lg bg-surface px-5 py-4 text-fg no-underline"
          >
            <span>
              <span className="block font-display text-xs tracking-[0.18em] text-sage uppercase">
                Next in {post.series}
              </span>
              <span className="mt-1 block font-display text-lg font-semibold tracking-wide uppercase">
                {next.title}
              </span>
            </span>
            <span className="font-display text-xs tracking-[0.16em] text-muted uppercase">
              {next.readMinutes} min →
            </span>
          </Link>
        ) : null}
        <p className="mt-12 font-display text-xs tracking-[0.18em] text-muted uppercase">
          <Link to="/dispatch" className="text-sage no-underline">
            ← The Dispatch
          </Link>
        </p>
      </article>
    </main>
  );
}
