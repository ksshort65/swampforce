import { mkdirSync, copyFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { posts, SITE, START_HERE, JOURNAL, getPost } from "../src/lib/content.ts";
import { CHARTS, FILE_CHIPS, RECORD, SCORE_UPDATED, TAX_MOVES } from "../src/lib/scorecard.ts";
import { ADMINS, MARKS, PUMP_CHARTS, PUMP_SOURCES, PUMP_UPDATED } from "../src/lib/pump.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = "/tmp/swampforce-public_html";
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "images"), { recursive: true });
mkdirSync(join(out, "dispatch"), { recursive: true });

const needed = new Set([
  "logo.png",
  "hero-capitol.jpg",
  ...posts.map((p) => basename(p.image || "")),
  "chart-job.jpg",
  "chart-blame.jpg",
  "chart-1964.jpg",
  "chart-pump-admins.jpg",
  "chart-pump-years.jpg",
]);
for (const name of needed) {
  const src = join(root, "public/images", name);
  if (name && existsSync(src)) copyFileSync(src, join(out, "images", name));
}
copyFileSync(join(root, "public/og.jpg"), join(out, "og.jpg"));
copyFileSync(join(root, "public/favicon.svg"), join(out, "favicon.svg"));
copyFileSync(join(root, "public/favicon-32.png"), join(out, "favicon-32.png"));

const css = `
:root { --bg:#0b0b0b; --fg:#ece8dc; --muted:#a39e93; --sage:#e8e0d0; --line:#2a2a2a; --surface:#141414; }
*{box-sizing:border-box} html,body{margin:0;background:var(--bg);color:var(--fg);font-family:Georgia,serif}
a{color:var(--sage)} img{max-width:100%;display:block}
header{position:sticky;top:0;background:#0b0b0b;border-bottom:1px solid var(--line);z-index:50}
.ticker{text-align:center;font:600 11px/1.4 ui-sans-serif,system-ui;letter-spacing:.2em;text-transform:uppercase;color:var(--sage);padding:.5rem;border-bottom:1px solid var(--line)}
.bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;max-width:72rem;margin:0 auto;padding:.6rem 1rem;gap:.6rem}
.mark{font:700 14px ui-sans-serif,system-ui;letter-spacing:.18em;text-transform:uppercase;color:var(--fg);text-decoration:none;min-height:44px;display:inline-flex;align-items:center}
nav{display:flex;flex-wrap:wrap;align-items:center;gap:.15rem}
nav a{margin:0;padding:.75rem .7rem;font:600 13px ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;color:#ddd;text-decoration:none;min-height:44px;display:inline-flex;align-items:center}
select.essays{background:#0b0b0b;color:#e8e0d0;border:1px solid #e8e0d0;padding:.7rem .8rem;font:600 13px ui-sans-serif,system-ui;text-transform:uppercase;min-width:12rem;min-height:44px}
.hero{position:relative;min-height:90vh}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.4),transparent)}
.hero .copy{position:relative;max-width:72rem;margin:0 auto;min-height:90vh;display:flex;flex-direction:column;justify-content:flex-end;padding:2rem 1rem 3rem}
.kicker{font:600 11px ui-sans-serif,system-ui;letter-spacing:.28em;text-transform:uppercase;color:var(--sage)}
h1{font:700 clamp(2.2rem,7vw,4.6rem)/.95 ui-sans-serif,system-ui;letter-spacing:.04em;text-transform:uppercase;margin:.4rem 0}
.btn{display:inline-block;background:var(--sage);color:#121212;text-decoration:none;padding:.7rem 1rem;font:700 12px ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;margin-right:.6rem;margin-top:.8rem}
.btn.out{background:transparent;border:1px solid #ccc;color:#fff}
.featured{display:grid;gap:2rem;max-width:72rem;margin:0 auto;padding:3rem 1rem 1rem}
@media(min-width:800px){.featured{grid-template-columns:1.15fr .85fr;align-items:center}}
.featured img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px}
.featured h2{font:700 clamp(1.8rem,4vw,3rem)/1.05 ui-sans-serif,system-ui;text-transform:uppercase;letter-spacing:.04em;margin:.4rem 0}
.menu-row{max-width:72rem;margin:0 auto;padding:0 1rem 3rem}
.wrap p, main.wrap p{font-size:1.2rem;line-height:2;margin:0 0 1.65em;letter-spacing:.015em;word-spacing:.04em}
.dek{font-size:1.32rem;line-height:1.7;margin:0 0 2.2em;color:#ddd}
.wrap ul{font-size:1.12rem;line-height:1.85;margin:0 0 2em 1.3em;padding:0}
.wrap li{margin:0 0 1em}
q, blockquote{display:block;font-size:1.35rem;line-height:1.55;margin:1.7rem 0;color:#eee}
.grid{display:grid;gap:1.2rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));max-width:72rem;margin:0 auto;padding:2rem 1rem}
.card{background:var(--surface);text-decoration:none;color:var(--fg);border-radius:8px;overflow:hidden}
.card h3{font:700 1.2rem ui-sans-serif,system-ui;text-transform:uppercase;padding:0 1rem}
.card p{padding:0 1rem 1rem;color:var(--muted)}
footer{border-top:1px solid var(--line);padding:2rem 1rem;color:var(--muted);font-size:.9rem}
footer .f{max-width:72rem;margin:0 auto;display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap}
`;

function esc(s = "") {
  return String(s)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function linkify(raw = "") {
  const re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(raw))) {
    out += esc(raw.slice(last, m.index));
    out += `<a href="${esc(m[2])}" target="_blank" rel="noreferrer">${esc(m[1])}</a>`;
    last = m.index + m[0].length;
  }
  out += esc(raw.slice(last));
  return out;
}

function essaySelectHtml() {
  const startSet = new Set(START_HERE);
  const start = START_HERE.map((s) => getPost(s)).filter(Boolean);
  const more = posts.filter((p) => !startSet.has(p.slug));
  const opt = (p) =>
    `<option value="/dispatch/${p.slug}.html">${esc(p.title)}</option>`;
  return `<select class="essays" onchange="if(this.value)location.href=this.value">
    <option value="">Start here</option>
    <optgroup label="Start here">${start.map(opt).join("")}</optgroup>
    <optgroup label="More">${more.map(opt).join("")}</optgroup>
  </select>`;
}

function shell({ title, desc, image, path, body }) {
  const url = `https://swampforce.com${path}`;
  const img = `https://swampforce.com${image || "/og.jpg"}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${esc(url)}"/>
<link rel="icon" href="/favicon-32.png"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="${esc(url)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${esc(img)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:image" content="${esc(img)}"/>
<meta name="twitter:site" content="@SwampForce"/>
<style>${css}</style>
</head>
<body>
<header>
  <div class="ticker">${esc(SITE.tagline)}</div>
  <div class="bar">
    <a class="mark" href="/">Swamp Force™</a>
    <nav>
      <a href="/scorecard.html">Scorecard</a>
      <a href="/pump.html">Pump</a>
      <a href="/foreword.html">Foreword</a>
      <a href="/archive.html">Archive</a>
      <a href="/shop.html">Merch</a>
      <a href="/join.html">Join</a>
    </nav>
  </div>
</header>
${body}
<footer>
  <div class="f">
    <div>
      <strong>${esc(SITE.mark)}</strong>
      <p>${esc(SITE.tagline)} No PAC.</p>
    </div>
    <div>
      <a href="/scorecard.html">Scorecard</a><br/>
      <a href="/pump.html">Pump</a><br/>
      <a href="/foreword.html">Foreword</a><br/>
      <a href="/archive.html">Archive</a><br/>
      <a href="/shop.html">Merch</a><br/>
      <a href="/join.html">Join Swamp Force</a><br/>
      <a href="https://x.com/SwampForce">@SwampForce</a><br/>
      <a href="mailto:${SITE.email}">${SITE.email}</a>
    </div>
  </div>
  <p style="max-width:72rem;margin:1rem auto 0">${esc(SITE.copyright)} · ${esc(SITE.author)}</p>
</footer>
</body></html>`;
}

const lead = getPost("that-is-not-why-they-are-elected");
const start = START_HERE.map((s) => getPost(s)).filter(Boolean);

const indexBody = `
<section class="hero">
  <img class="bg" src="/images/hero-capitol.jpg" alt="Eagle on the Capitol in the swamp"/>
  <div class="shade"></div>
  <div class="copy">
    <p class="kicker">Join Swamp Force · Let them hear us now</p>
    <h1>Save the nation.</h1>
    <p>They work for us. The midterms are how we remind them.<br/>Congress works for us — or we send them home.</p>
    <div>
      <a class="btn" href="/join.html">Join Swamp Force</a>
      <a class="btn out" href="/scorecard.html">Congressional Scorecard</a>
    </div>
  </div>
</section>
<section class="featured">
  ${lead ? `<a href="/dispatch/${lead.slug}.html"><img src="${esc(lead.image)}" alt="${esc(lead.imageAlt)}"/></a>
  <div>
    <p class="kicker">The lead · Featured dispatch</p>
    <h2>${esc(lead.title)}</h2>
    <p>${esc(lead.dek)}</p>
    <a class="btn" href="/dispatch/${lead.slug}.html">Read the lead</a>
  </div>` : ""}
</section>
<section class="pad">
  <p class="kicker">Midterms</p>
  <h2>Congressional Scorecard</h2>
  <p>Both parties failed. Charts. Sources. Not a speech.</p>
  <a class="btn" href="/scorecard.html">Open the scorecard</a>
</section>
<section class="band pad">
  <p class="kicker">The Search</p>
  <h2>Find them.</h2>
  <div class="grid">
    <a class="card" href="/dispatch/find-them.html"><img src="/images/essay-find-them.jpg" alt=""/><h3>Find them.</h3></a>
    <a class="card" href="/dispatch/who-got-paid.html"><img src="/images/essay-who-got-paid.jpg" alt=""/><h3>Who got paid.</h3></a>
    <a class="card" href="/dispatch/defund-ice-is-the-tell.html"><img src="/images/essay-defund-ice.jpg" alt=""/><h3>Defund ICE is the tell.</h3></a>
  </div>
</section>
`;

writeFileSync(
  join(out, "index.html"),
  shell({
    title: "Swamp Force",
    desc: SITE.tagline,
    image: "/og.jpg",
    path: "/",
    body: indexBody,
  }),
);

writeFileSync(
  join(out, "join.html"),
  shell({
    title: "Join Swamp Force",
    desc: SITE.kicker,
    image: "/og.jpg",
    path: "/join.html",
    body: `<main class="wrap">
<p class="kicker">Join Swamp Force</p>
<h1>Join the list</h1>
<p>${esc(SITE.tagline)} Leave a name. Let them hear us now.</p>
<p><a class="btn" href="mailto:${SITE.email}?subject=${encodeURIComponent("Join Swamp Force")}">Join Swamp Force</a></p>
</main>`,
  }),
);

writeFileSync(
  join(out, "shop.html"),
  shell({
    title: "Merch — Swamp Force",
    desc: "The store. Print-on-demand merch.",
    image: "/og.jpg",
    path: "/shop.html",
    body: `<main class="wrap" style="text-align:center;max-width:36rem">
<p class="kicker">Coming soon</p>
<h1>Merch</h1>
<p>The store is not open yet. Drop the Namecheap shop here in place of this file when it is ready. The journal is live.</p>
<p><a class="btn" href="/">Read the Dispatch</a></p>
</main>`,
  }),
);

writeFileSync(
  shell({
    title: "About — Swamp Force",
    desc: "Independent. No party. No PAC. The statute, the table, and the tape.",
    image: "/og.jpg",
    path: "/about.html",
    body: `<main class="wrap">
<p class="kicker">Masthead</p>
<h1>About</h1>
<p>${esc(SITE.name)} is a journal of the record: the statute, the table, and the tape. Independent. No party. No PAC. Not a call to violence.</p>
<p>Written by ${esc(SITE.author)}. A caption is not a conviction. If a claim cannot survive the rest of the sentence, it does not belong here.</p>
<p>${esc(SITE.copyright)} Quote with credit and a link. Do not copy the work as original. Built with Grok as a tool. The © is ${esc(SITE.author)}’s.</p>
<p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
</main>`,
  }),
);

writeFileSync(
  join(out, "forward.html"),
  shell({
    title: "Foreword — Swamp Force",
    desc: "A letter from the editor. Why this journal exists. Independent. No PAC.",
    image: "/og.jpg",
    path: "/foreword.html",
    body: `<main class="wrap" style="max-width:42rem">
<p class="kicker">From the editor</p>
<h1>Foreword</h1>
<p class="kicker">${esc(SITE.author)} · ${esc(SITE.name)}</p>
<p>Swamp Force is a journal of the record. The statute. The table. The tape. A caption is not a conviction. If a claim cannot survive the rest of the sentence, it does not belong here.</p>
<p>Congress holds the purse. Both parties failed that job. They have not balanced a budget since the Clinton years. They do not pass the twelve money bills. That open book is how waste walks out the door. The neighbor is not the enemy. The building is.</p>
<p>Sovereignty sits with the people. Representatives are employees holding a list of enumerated powers. Everything not on that list stayed home. A news banner cannot amend it. A two-minute panel does not hold office.</p>
<p>Independent. No party. No PAC. Not a call to violence. The legal firing date is Election Day. The file is so that date is not wasted on a jersey.</p>
<p>${esc(SITE.author)}<br/>Editor</p>
<p><a href="/dispatch/that-is-not-why-they-are-elected.html">The lead story →</a></p>
</main>`,
  }),
);

writeFileSync(
  join(out, "scorecard.html"),
  shell({
    title: "The record — Congressional Scorecard — Swamp Force",
    desc: "The fire is Congress. The blame game is politics. Charts with sources.",
    image: "/og.jpg",
    path: "/scorecard.html",
    body: `<main class="wrap" style="max-width:52rem">
<p class="kicker">Congressional scorecard · updated ${esc(SCORE_UPDATED)}</p>
<h1>Both parties failed. They do not represent the American people.</h1>
<p>No balanced budget since Clinton. The twelve money bills do not pass. That open book is the fraud door. The fire is Congress. Blaming the firefighter is politics, not the record. <a href="/pump.html">The pump — four administrations, EIA gallons.</a></p>
${CHARTS.map((c) => `<figure><img src="${c.src}" alt="${esc(c.title)}"/><figcaption style="color:#a39e93;font-size:.85rem">Sources: ${c.sources.map((s) => `<a href="${s.href}">${esc(s.label)}</a>`).join(" · ")}</figcaption></figure>`).join("")}
<p>${FILE_CHIPS.map((c) =>
  c.hot
    ? `<a href="${c.href}" style="display:block;border:2px solid var(--sage);padding:1.25rem 1.4rem;margin:1.5rem 0;text-decoration:none;color:var(--fg)"><strong style="letter-spacing:.16em;text-transform:uppercase">${esc(c.k)}</strong><br/>${esc(c.v)}</a>`
    : `<a href="${c.href}"><strong>${esc(c.k)}</strong> — ${esc(c.v)}</a>`,
).join("<br/>")}</p>
<h2>The bills</h2>
${RECORD.map((col) => `<h3>${esc(col.party)}</h3>
<p>Helped</p><ul>${col.plus.map((p) => `<li><a href="${p.href}">${esc(p.item)}</a></li>`).join("")}</ul>
<p>Hurt</p><ul>${col.minus.map((p) => `<li><a href="${p.href}">${esc(p.item)}</a></li>`).join("")}</ul>`).join("")}
<h2>Tax bills</h2>
<ul>${TAX_MOVES.map((r) => `<li><a href="${r.href}">${esc(r.year)} · ${esc(r.direction)} · ${esc(r.bill)}</a></li>`).join("")}</ul>
<h2>Foreword</h2>
<p>A letter from the editor. Why this journal exists.</p>
<p><a class="btn" href="/foreword.html">Read the Foreword</a></p>
</main>`,
  }),
);

writeFileSync(
  join(out, "pump.html"),
  shell({
    title: "The pump — four administrations — Swamp Force",
    desc: "EIA weekly gasoline and diesel. Last four administrations. A president is not OPEC.",
    image: "/images/chart-pump-admins.jpg",
    path: "/pump.html",
    body: `<main class="wrap" style="max-width:52rem">
<p class="kicker">The pump · EIA · updated ${esc(PUMP_UPDATED)}</p>
<h1>The gallon, four Oval offices.</h1>
<p>A president is not OPEC. Crude is a world market. The pump is still what a paycheck meets. EIA weekly retail. No network. No caption. 2026 is year-to-date.</p>
${PUMP_CHARTS.map((c) => `<figure><img src="${c.src}" alt="${esc(c.title)}"/></figure>`).join("")}
<table style="width:100%;border-collapse:collapse;font-size:1.05rem">
<thead><tr><th style="text-align:left;border-bottom:1px solid var(--line);padding:.6rem 0">Administration</th><th style="text-align:left;border-bottom:1px solid var(--line)">Gasoline</th><th style="text-align:left;border-bottom:1px solid var(--line)">Diesel</th><th style="text-align:left;border-bottom:1px solid var(--line)">WTI</th></tr></thead>
<tbody>
${ADMINS.map((a) => `<tr><td style="border-bottom:1px solid var(--line);padding:.7rem 0">${esc(a.who)} <span style="color:var(--muted)">${esc(a.when)}</span></td><td style="border-bottom:1px solid var(--line)">$${a.gas.toFixed(2)}</td><td style="border-bottom:1px solid var(--line)">$${a.diesel.toFixed(2)}</td><td style="border-bottom:1px solid var(--line)">$${a.wti}</td></tr>`).join("")}
</tbody>
</table>
<p>${MARKS.map((m) => `<a href="${m.href}"><strong>${esc(m.k)}</strong> — ${esc(m.v)}</a>`).join("<br/>")}</p>
<p style="color:var(--muted);font-size:.9rem">Sources: ${PUMP_SOURCES.map((s) => `<a href="${s.href}">${esc(s.label)}</a>`).join(" · ")}. Calendar years sit with the Oval that held most of the year. WTI is dollars per barrel. Pump prices include tax.</p>
</main>`,
  }),
);

const HIDDEN = new Set(["they-work-for-us", "they-published-the-replacement"]);
function archiveList(list) {
  return `<ul>${list
    .map(
      (p) =>
        `<li style="margin:0 0 1.2em"><a href="/dispatch/${p.slug}.html">${esc(p.title)}</a><br/><span style="color:#a39e93">${esc(p.dek)}</span></li>`,
    )
    .join("")}</ul>`;
}
let archiveInner = `<main class="wrap" style="max-width:42rem">
<p class="kicker">The journal</p>
<h1>Archive</h1>
<p>Read in this order. The lead first. Then the rest of the file.</p>
<p class="kicker">Standalone</p>
<p><a href="/scorecard.html"><strong>Congressional Scorecard</strong></a><br/><span style="color:#a39e93">Both parties failed. They do not represent the American people.</span></p>
<p><a href="/pump.html"><strong>The pump</strong></a><br/><span style="color:#a39e93">Gas and diesel. Four administrations. EIA.</span></p>
`;
for (const section of JOURNAL) {
  const lessons = section.slugs.map((s) => getPost(s)).filter((p) => p && !HIDDEN.has(p.slug));
  if (!lessons.length) continue;
  archiveInner += `<p class="kicker">${esc(section.name)}</p>
<p>${esc(section.dek)}</p>
${archiveList(lessons)}`;
}
archiveInner += `</main>`;
writeFileSync(
  join(out, "archive.html"),
  shell({
    title: "Archive — Swamp Force",
    desc: "The journal. Every dispatch, by series.",
    image: "/og.jpg",
    path: "/archive.html",
    body: archiveInner,
  }),
);

for (const p of posts) {
  const blocks = p.body
    .map((b) => {
      if (b.type === "h") return `<h2>${esc(b.text)}</h2>`;
      if (b.type === "q") return `<blockquote>${linkify(b.text)}</blockquote>`;
      if (b.type === "img")
        return `<figure><img src="${b.src}" alt="${esc(b.alt)}"/></figure>`;
      if (b.type === "ul")
        return `<ul>${b.items.map((i) => `<li>${linkify(i)}</li>`).join("")}</ul>`;
      const parts = String(b.text).split(/(?<=\.)\s+(?=[A-Z“"])/);
      if (parts.length > 1) {
        return parts.map((s) => `<p>${linkify(s)}</p>`).join("\n");
      }
      return `<p>${linkify(b.text)}</p>`;
    })
    .join("\n");
  const html = shell({
    title: `${p.title} — Swamp Force`,
    desc: p.dek,
    image: p.image,
    path: `/dispatch/${p.slug}.html`,
    body: `<div class="hero" style="min-height:52vh">
  <img class="bg" src="${esc(p.image)}" alt="${esc(p.imageAlt)}"/>
  <div class="shade"></div>
  <div class="copy" style="min-height:52vh">
    <p class="kicker">${esc(p.series || p.category)}</p>
    <h1>${esc(p.title)}</h1>
  </div>
</div>
<main class="wrap">
  <p class="dek">${esc(p.dek)}</p>
  ${
    p.receipts?.length
      ? `<p class="kicker">The file</p><ul>${p.receipts
          .map((r) => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`)
          .join("")}</ul>`
      : ""
  }
  ${blocks}
</main>`,
  });
  writeFileSync(join(out, "dispatch", `${p.slug}.html`), html);
}

writeFileSync(
  join(root, "NAMECHEAP-UPLOAD.txt"),
  `NAMECHEAP upload
================
1. Hosting List -> your hosting -> File Manager -> public_html
2. Upload swampforce.zip
3. Extract. index.html must sit INSIDE public_html (not in a subfolder).
4. DNS — see NAMECHEAP-DNS.txt (do not upload that file).

Keep Proton and Fourthwall rows. Only change @ and www.
`,
);

writeFileSync(
  join(root, "NAMECHEAP-DNS.txt"),
  `SWAMP FORCE — Namecheap Advanced DNS (from your screenshot)

KEEP — do not remove
--------------------
CNAME  protonmail._domainkey     (Proton)
CNAME  protonmail2._domainkey    (Proton)
CNAME  protonmail3._domainkey    (Proton)
TXT    @   protonmail-verification=e191278b0d9b7c1de03b3a0b4462d9a775d4698f
TXT    @   v=spf1 include:_spf.protonmail.ch ~all
TXT    _dmarc   v=DMARC1; p=quarantine

KEEP if Fourthwall merch still uses support.swampforce.com
----------------------------------------------------------
CNAME  em-fw.support
CNAME  s1._domainkey.support
CNAME  s2._domainkey.support
CNAME  zendesk3.support
CNAME  zendesk4.support
TXT    _dmarc.support
TXT    support
TXT    zendeskverification.support

DELETE / REPLACE
----------------
A  @  34.117.223.165     <- old EasyWP. This is why you got "We'll be back soon".
CNAME  www -> swampforce.com.   <- replace after hosting is on

ADD after Namecheap hosting is active
-------------------------------------
Namecheap email / hosting dashboard will show the new A record IP
for public_html. Put that IP on:

  A      @      (new hosting IP)     TTL 5 min
  CNAME  www    swampforce.com.

Do not add Unmasked URL Redirect to grok.me. That was the SSL mess.

When swampforce.com loads this journal, set the X bio website to
https://swampforce.com  — X will then use og.jpg in this zip, not Grok's flag card.
`,
);

writeFileSync(
  join(out, ".htaccess"),
  `DirectoryIndex index.html
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
`,
);

writeFileSync(
  join(out, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: https://swampforce.com/sitemap.xml
`,
);

const sitemapUrls = [
  "https://swampforce.com/",
  "https://swampforce.com/shop.html",
  "https://swampforce.com/join.html",
  "https://swampforce.com/scorecard.html",
  "https://swampforce.com/archive.html",
  "https://swampforce.com/about.html",
  "https://swampforce.com/foreword.html",
  "https://swampforce.com/pump.html",
  ...posts.map((p) => `https://swampforce.com/dispatch/${p.slug}.html`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(out, "sitemap.xml"), sitemap);
writeFileSync(join(root, "public/sitemap.xml"), sitemap);

const zip = join(root, "artifacts", "swampforce.zip");
mkdirSync(join(root, "artifacts"), { recursive: true });
rmSync(zip, { force: true });
const py = `
import zipfile, os
root = ${JSON.stringify(out)}
zpath = ${JSON.stringify(zip)}
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, _, files in os.walk(root):
        for f in files:
            if f == ".DS_Store":
                continue
            full = os.path.join(dirpath, f)
            z.write(full, os.path.relpath(full, root))
print("zip", zpath, os.path.getsize(zpath))
`;
const r = spawnSync("python3", ["-c", py], { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stdout, r.stderr);
  process.exit(1);
}
console.log("wrote", out, "posts", posts.length);
console.log(r.stdout.trim());
