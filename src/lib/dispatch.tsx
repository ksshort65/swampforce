import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import essaysJson from "../data/essays.json";

// The Dispatch: the essays already in src/data/essays.json (65, as written). Nothing added.
export type Essay = { slug: string; title: string; series: string; date: string; body: string };

export const ESSAYS = essaysJson as Essay[];

export function getEssay(slug: string) {
  return ESSAYS.find((essay) => essay.slug === slug);
}

/** The series in the order they first appear in the file, each with its essays in file order. */
export function essaySeries() {
  const order: string[] = [];
  for (const essay of ESSAYS) if (!order.includes(essay.series)) order.push(essay.series);
  return order.map((name) => ({ name, essays: ESSAYS.filter((essay) => essay.series === name) }));
}

/** The first paragraph of the essay body is its standfirst. */
export function essayDek(essay: Essay) {
  return essay.body.split("\n\n")[0]?.trim() ?? "";
}

export function essayDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const LINK = "text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2";

/** Inline text: [label](url), bare https links, and **bold**. Links to /dispatch/<slug> stay inside the site. */
export function EssayText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)\s]+)\)|(https?:\/\/(?:[^\s()]|\([^\s()]*\))+)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[4]) {
      nodes.push(<strong key={`b${i}`}>{m[4]}</strong>);
    } else {
      const href = m[2] || m[3];
      const label = m[1] || href;
      const inside = href.match(/^\/dispatch\/([a-z0-9-]+)\/?$/);
      if (inside) {
        nodes.push(
          <Link key={`a${i}`} to="/dispatch/$slug" params={{ slug: inside[1] }} className={LINK}>
            {label}
          </Link>,
        );
      } else if (href === "/dispatch" || href === "/dispatch/") {
        nodes.push(
          <Link key={`a${i}`} to="/dispatch" className={LINK}>
            {label}
          </Link>,
        );
      } else {
        const external = !href.startsWith("/");
        nodes.push(
          <a key={`a${i}`} href={href} className={LINK} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
            {label}
          </a>,
        );
      }
    }
    last = m.index + m[0].length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

/** The essay body as written: paragraphs, ### headings, **bold** lines, "- " lists, "> " quotes. */
export function EssayBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        if (block.startsWith("#")) {
          return (
            <h2 key={index} className="pt-4 text-[20px] font-bold leading-snug tracking-wide text-white">
              <EssayText text={block.replace(/^#+\s*/, "")} />
            </h2>
          );
        }
        if (/^\*\*[^*]+\*\*$/.test(block)) {
          return (
            <h3 key={index} className="pt-2 text-[17px] font-semibold leading-snug text-[#d4af37]">
              {block.slice(2, -2)}
            </h3>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-[16px] leading-7 text-white/85">
              {block.split("\n").map((line, at) => (
                <li key={at}>
                  <EssayText text={line.replace(/^-\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.startsWith(">")) {
          return (
            <blockquote key={index} className="m-0 border-l-2 border-[#d4af37] pl-5 text-[18px] leading-snug text-white/90">
              <EssayText text={block.split("\n").map((line) => line.replace(/^>\s?/, "")).join(" ")} />
            </blockquote>
          );
        }
        return (
          <p key={index} className="m-0 text-[16px] leading-7 text-white/85">
            <EssayText text={block} />
          </p>
        );
      })}
    </div>
  );
}
