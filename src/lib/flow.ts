export type Chapter = {
  n: string;
  title: string;
  dek: string;
  slug: string;
};

/** Each row is a door. Click goes to the essay. Never a dead panel. */
export const CHAPTERS: Chapter[] = [
  {
    n: "01",
    title: "They already had the country",
    dek: "Long before anyone filed papers, politicians, bureaucrats, and special interests treated three hundred million people as a cash machine. The country still opened because you went to work. That is how we got here — not a campaign.",
    slug: "division-is-the-product",
  },
  {
    n: "02",
    title: "The law they don't mention",
    dek: "Every advertised bill has a quiet twin: a rider, a rule, an exemption. The camera covers the name. The catch is in the annex. They never taught the machine on purpose.",
    slug: "the-law-they-dont-mention",
  },
  {
    n: "03",
    title: "They attacked the country first",
    dek: "Clips. Captions. A smear instead of a debate. Self-defense of a racket: keep the people fighting each other so nobody reads the statute. That started before he ever announced.",
    slug: "they-clipped-the-tape",
  },
  {
    n: "04",
    title: "Then the donor became a problem",
    dek: "They loved him when he wrote the checks. When he stopped being a donor and looked like a pragmatist who might close the shop, they went into self-defense — hoax after hoax, on your dime — and widened the attack onto the whole country.",
    slug: "why-he-became-the-enemy",
  },
  {
    n: "05",
    title: "The word that never made the docket",
    dek: "Insurrection, all day, on television. Zero charges under 18 U.S.C. § 2383. Search the docket. The caption did the political work the indictment would not.",
    slug: "the-word-that-never-made-the-docket",
  },
];

export function nextChapter(slug: string) {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  if (i < 0 || i === CHAPTERS.length - 1) return undefined;
  return CHAPTERS[i + 1];
}
