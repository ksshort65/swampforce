import { mkdirSync, copyFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { posts, SITE, START_HERE, getPost } from "../src/lib/content.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = "/tmp/swampforce-public_html";
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "images"), { recursive: true });
mkdirSync(join(out, "dispatch"), { recursive: true });

const needed = new Set([
  "logo.png",
  "hero-capitol.jpg",
  ...posts.map((p) => basename(p.image || "")),
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
header{position:sticky;top:0;background:rgba(11,11,11,.92);border-bottom:1px solid var(--line);z-index:5}
.ticker{text-align:center;font:600 11px/1.4 ui-sans-serif,system-ui;letter-spacing:.2em;text-transform:uppercase;color:var(--sage);padding:.5rem;border-bottom:1px solid var(--line)}
.bar{display:flex;justify-content:space-between;align-items:center;max-width:72rem;margin:0 auto;padding:.6rem 1rem}
.bar img{height:40px;background:#fff;padding:2px}
nav a{margin-left:1.4rem;font:600 13px ui-sans-serif,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#ddd;text-decoration:none}
select.essays{background:#0b0b0b;color:#ece8dc;border:1px solid #2a2a2a;padding:.4rem .5rem;font:600 12px ui-sans-serif,system-ui;text-transform:uppercase;max-width:16rem}
.hero{position:relative;min-height:90vh}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.4),transparent)}
.hero .copy{position:relative;max-width:72rem;margin:0 auto;min-height:90vh;display:flex;flex-direction:column;justify-content:flex-end;padding:2rem 1rem 3rem}
.kicker{font:600 11px ui-sans-serif,system-ui;letter-spacing:.28em;text-transform:uppercase;color:var(--sage)}
h1{font:700 clamp(2.2rem,7vw,4.6rem)/.95 ui-sans-serif,system-ui;letter-spacing:.04em;text-transform:uppercase;margin:.4rem 0}
.btn{display:inline-block;background:var(--sage);color:#121212;text-decoration:none;padding:.7rem 1rem;font:700 12px ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;margin-right:.6rem;margin-top:.8rem}
.btn.out{background:transparent;border:1px solid #ccc;color:#fff}
main.wrap, .wrap{max-width:44rem;margin:0 auto;padding:2rem 1rem 4rem}
.grid{display:grid;gap:1.2rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));max-width:72rem;margin:0 auto;padding:2rem 1rem}
.card{background:var(--surface);text-decoration:none;color:var(--fg);border-radius:8px;overflow:hidden}
.card h3{font:700 1.2rem ui-sans-serif,system-ui;text-transform:uppercase;padding:0 1rem}
.card p{padding:0 1rem 1rem;color:var(--muted)}
footer{border-top:1px solid var(--line);padding:2rem 1rem;color:var(--muted);font-size:.9rem}
footer .f{max-width:72rem;margin:0 auto;display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap}
q, blockquote{display:block;font-size:1.25rem;margin:1.2rem 0;color:#eee}
`;

function essaySelect() {
  const hide = new Set([
    ...START_HERE,
    "they-work-for-us",
    "they-published-the-replacement",
  ]);
  const start = START_HERE.map((slug) => {
    const p = getPost(slug);
    return p ? `<option value="/dispatch/${p.slug}.html">${esc(p.title)}</option>` : "";
  }).join("");
  const rest = posts
    .filter((p) => !hide.has(p.slug))
    .map((p) => `<option value="/dispatch/${p.slug}.html">${esc(p.title)}</option>`)
    .join("");
  return `<select class="essays" onchange="if(this.value)location.href=this.value">
    <option value="">Start here</option>
    <optgroup label="Start here">${start}</optgroup>
    <optgroup label="More">${rest}</optgroup>
  </select>`;
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
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
  <div class="ticker">Save the nation. Secure the elections. Congress works for us — or we send them home.</div>
  <div class="bar">
    <a href="/"><img src="/images/logo.png" alt="Swamp Force"/></a>
    <nav>
      ${essaySelect()}
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
      <a href="/scorecard.html">Congressional Scorecard</a><br/>
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

const indexBody = `
<section class="hero">
  <img class="bg" src="/images/hero-capitol.jpg" alt="Eagle on the Capitol in the swamp"/>
  <div class="shade"></div>
  <div class="copy">
    <p class="kicker">Join Swamp Force · Let them hear us now</p>
    <h1>Save the nation.</h1>
    <p>Save the nation. Secure the elections.<br/>Congress works for us — or we send them home.</p>
    <div>
      <a class="btn" href="/join.html">Join Swamp Force</a>
      <a class="btn out" href="/scorecard.html">Congressional Scorecard</a>
    </div>
  </div>
</section>
<section class="wrap">
  <p class="kicker">Start here</p>
  <h1>${esc(lead?.title || "They forgot who they work for.")}</h1>
  <p>Congress is paid by you. Some of them talk like they are at war with you. Open the first essay.</p>
  ${lead ? `<a class="card" href="/dispatch/${lead.slug}.html" style="display:block;margin-top:1.5rem;max-width:28rem">
    <img src="${esc(lead.image)}" alt=""/>
    <h3>${esc(lead.title)}</h3>
    <p>${esc(lead.dek)}</p>
  </a>` : ""}
</section>`;

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
<h1>Stand with Trump</h1>
<p>${esc(SITE.tagline)} Leave your name. Let them hear us now.</p>
<p><a class="btn" href="mailto:${SITE.email}?subject=${encodeURIComponent("Join Swamp Force")}">Join Swamp Force</a></p>
</main>`,
  }),
);

writeFileSync(
  join(out, "scorecard.html"),
  shell({
    title: "Congressional Scorecard — Swamp Force",
    desc: "Congress holds the purse. $40T. DSA is on the ballot. Show up Nov 3.",
    image: "/og.jpg",
    path: "/scorecard.html",
    body: `<main class="wrap">
<p class="kicker">Midterms</p>
<h1>Congressional Scorecard</h1>
<p>Congress holds the purse. $40T. DSA is on the ballot. Show up November 3.</p>
<p>The full interactive card stays on the live journal. The Dispatch below is the file.</p>
<p><a class="btn" href="/">Read the Dispatch</a></p>
</main>`,
  }),
);

for (const p of posts) {
  const blocks = p.body
    .map((b) => {
      if (b.type === "h") return `<h2>${esc(b.text)}</h2>`;
      if (b.type === "q") return `<blockquote>${esc(b.text)}</blockquote>`;
      if (b.type === "ul")
        return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
      return `<p>${esc(b.text)}</p>`;
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
  <p style="font-size:1.35rem">${esc(p.dek)}</p>
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
`,
);

console.log("wrote", out, "posts", posts.length);
