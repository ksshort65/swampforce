import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/content";
import { formatUsd } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="group block text-fg no-underline"
      >
        <div className="relative overflow-hidden rounded-lg bg-surface">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
              {product.tag}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold tracking-wide uppercase">
              {product.name}
            </h3>
          </div>
          <p className="font-display text-lg font-semibold tabular-nums">
            {formatUsd(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
