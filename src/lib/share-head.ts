import { SITE, type Post } from "@/lib/content";

const ORIGIN = "https://swampforce.grok.me";

function abs(path: string) {
  return path.startsWith("http") ? path : `${ORIGIN}${path}`;
}

export function essayHead(post: Post, path?: string) {
  const title = `${post.title} — ${SITE.name}`;
  const url = abs(path ?? `/dispatch/${post.slug}`);
  const image = abs(post.image);
  return {
    meta: [
      { title },
      { name: "description", content: post.dek },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: post.dek },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: post.dek },
      { name: "twitter:image", content: image },
    ],
  };
}

export function homeHead() {
  const title = `${SITE.name}`;
  const desc =
    "Save the nation. Secure the elections. Congress works for us — or we send them home.";
  const image = abs("/images/hero-capitol.jpg");
  return {
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${ORIGIN}/` },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: image },
    ],
  };
}
