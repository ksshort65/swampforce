import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/brand")({ component: BrandPage });

function BrandPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="font-display text-xs tracking-[0.18em] text-muted uppercase">
        <Link to="/dispatch" className="text-sage no-underline">
          ← Swamp Force
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-wide uppercase">
        X graphics
      </h1>
      <p className="mt-3 text-muted">
        Right-click the picture → Save image as. Or use Download.
      </p>
      <section className="mt-10">
        <p className="font-display text-xs tracking-[0.16em] text-sage uppercase">
          Banner · 1500×500
        </p>
        <img
          src="/x-banner.jpg"
          alt="Swamp Force X banner"
          className="mt-3 w-full outline outline-border"
        />
        <a
          href="/x-banner.jpg"
          download="swampforce-x-banner.jpg"
          className="mt-3 inline-block font-display text-sm font-semibold tracking-[0.16em] text-sage uppercase"
        >
          Download banner
        </a>
      </section>
      <section className="mt-12">
        <p className="font-display text-xs tracking-[0.16em] text-sage uppercase">
          Avatar · 400×400
        </p>
        <img
          src="/x-avatar.jpg"
          alt="Swamp Force X avatar"
          className="mt-3 size-40 outline outline-border"
        />
        <a
          href="/x-avatar.jpg"
          download="swampforce-x-avatar.jpg"
          className="mt-3 block font-display text-sm font-semibold tracking-[0.16em] text-sage uppercase"
        >
          Download avatar
        </a>
      </section>
    </main>
  );
}
