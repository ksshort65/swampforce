export const PROOF = ["Proven false", "Rated misleading", "Still being checked"] as const
export const WHEN = ["First term", "2021–present"] as const
export const KIND = [
  "Official record",
  "Transcript or video",
  "Outlet's own correction",
  "Primary document",
] as const

export type DeceptionRow = {
  id: string
  what: string
  proof: (typeof PROOF)[number]
  when?: (typeof WHEN)[number]
  kind?: (typeof KIND)[number]
  source: string
  href?: string
}

export type Card = { name: string; image: string }

export const DECEPTION: {
  id: string
  title: string
  image: string
  categories: Card[]
  stations?: Card[]
  rows: DeceptionRow[]
}[] = [
  {
    id: "network",
    title: "Network deception",
    image: "/images/deception-network.jpg",
    categories: [
      { name: "ABC", image: "/images/net-abc.jpg" },
      { name: "CBS", image: "/images/net-cbs.jpg" },
      { name: "NBC", image: "/images/net-nbc.jpg" },
      { name: "Fox", image: "/images/net-fox.jpg" },
      { name: "Cable news", image: "/images/net-cable.jpg" },
      { name: "Trump TV", image: "/images/net-trumptv.jpg" },
      { name: "Podcasts", image: "/images/net-podcasts.jpg" },
      { name: "C-SPAN", image: "/images/net-cspan.jpg" },
    ],
    stations: [
      { name: "CNN", image: "/images/net-cnn.jpg" },
      { name: "MS NOW", image: "/images/net-msnow.jpg" },
    ],
    rows: [],
  },
  {
    id: "journalists",
    title: "Journalists",
    image: "/images/deception-journalists.jpg",
    categories: [
      { name: "Anchors", image: "/images/cat-anchors.jpg" },
      { name: "Correspondents", image: "/images/cat-correspondents.jpg" },
    ],
    rows: [],
  },
  {
    id: "politicians",
    title: "Politicians deceptions",
    image: "/images/deception-politicians.jpg",
    categories: [
      { name: "Democrats", image: "/images/cat-democrats.jpg" },
      { name: "Republicans", image: "/images/cat-republicans.jpg" },
      { name: "Public trust", image: "/images/topic-senate-record.jpg" },
    ],
    rows: [],
  },
  {
    id: "social",
    title: "Social media warfare",
    image: "/images/deception-social.jpg",
    categories: [
      { name: "Facebook", image: "/images/cat-facebook.jpg" },
      { name: "Instagram", image: "/images/cat-instagram.jpg" },
      { name: "TikTok", image: "/images/cat-tiktok.jpg" },
      { name: "X", image: "/images/cat-twitter.jpg" },
      { name: "Threads", image: "/images/cat-threads.jpg" },
      { name: "Truth Social", image: "/images/cat-truth.jpg" },
      { name: "YouTube", image: "/images/cat-youtube.jpg" },
      { name: "Rumble", image: "/images/cat-rumble.jpg" },
    ],
    rows: [],
  },
  {
    id: "checkers",
    title: "Fact-checkers",
    image: "/images/deception-checkers.jpg",
    categories: [{ name: "PolitiFact", image: "/images/cat-politifact.jpg" }],
    rows: [],
  },
]
