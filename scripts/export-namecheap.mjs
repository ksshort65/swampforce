import { mkdirSync, copyFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { posts, SITE, START_HERE, JOURNAL, getPost } from "../src/lib/content.ts";
import { ALIENS, ATM, AT_HOME, BORDER, BORDER_MOVE, BORDER_HARM, BENEFITS, COVID_CELL, WORKER, CPI_PEAK, DEALS, DEBT_MATH, DEBT_NOW, DEBT_TALLY, DEBT_WHY, DRIVERS, EFFECT_FILES, ENCOUNTERS, FAILURE, FILE_CHIPS, FUNNEL, HOAXES, LAWS, MAJORITY, OBAMA_TERMS, OVAL, OVAL_DESKS, OVAL_LINKS, OVAL_NOW, OVAL_RECORD, PAPERS, PRICES, PURSE, RAIL, RECORD, SCORE_TABS, SCORE_UPDATED, TAB_CHARTS, TERM_COMPARE, TERM_SIGNED, TRUMP_TERMS, WARFARE } from "../src/lib/scorecard.ts";
import { ADMINS, GALLON_STACK, MARKS, OPEC_FILE, PUMP_CHARTS, PUMP_SOURCES, PUMP_UPDATED, RULES_FILE, TAX_FILE } from "../src/lib/pump.ts";

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
 "chart-inflation-party.jpg",
 "chart-inflation-avg.jpg",
 "chart-helped-hurt.jpg",
 "chart-border.jpg",
 "chart-border-all.jpg",
 "chart-border-toll.jpg",
 "chart-debt-bars.jpg",
 "chart-debt-why.jpg",
 "chart-aliens.jpg",
 "chart-crime.jpg",
 "chart-iran.jpg",
 "chart-iran-dead.jpg",
 "chart-one-word.jpg",
 "chart-one-word-ledger.jpg",
 "chart-lawfare.jpg",
 "chart-funnel.jpg",
 "chart-what-they-bought.jpg",
 "chart-they-dont-write.jpg",
 "chart-paying-taliban.jpg",
 "chart-fema-two-jobs.jpg",
 "chart-they-ran-it.jpg",
 "chart-oval-encounters.jpg",
 "chart-oval-prices.jpg",
 "chart-oval-gallon.jpg",
 "chart-oval-caption.jpg",
 "chart-oval-cases.jpg",
 "chart-oval-slogan.jpg",
 "chart-harm-pie.jpg",
 "chart-pump-admins.jpg",
 "chart-pump-years.jpg",
 "chart-pump-stack.jpg",
 "chart-pump-flow.jpg",
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
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);font-family:Georgia,serif;overflow-x:hidden}
a{color:var(--sage)}
img{max-width:100%;height:auto;display:block}
header{position:sticky;top:0;background:#0b0b0b;border-bottom:1px solid var(--line);z-index:50}
.ticker{display:flex;align-items:center;gap:1rem;padding:.55rem 1.5rem;border-bottom:1px solid var(--line);background:var(--paper,transparent)}
.ticker .mark{font:700 22px/1 ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;color:var(--fg);text-decoration:none}
.ticker .line{margin-left:auto;max-width:55%;font:600 12px/1.35 ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;color:var(--sage);text-align:right}
.bar{display:flex;align-items:center;flex-wrap:wrap;gap:.75rem;max-width:72rem;margin:0 auto;padding:.35rem 1.5rem}
nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;margin-left:auto}
nav a,details.score summary,details.archive summary{margin:0;padding:.75rem .55rem;font:600 14px ui-sans-serif,system-ui;letter-spacing:.08em;text-transform:uppercase;color:#ddd;text-decoration:none;min-height:44px;display:inline-flex;align-items:center;flex-shrink:0;cursor:pointer;list-style:none}
details.score,details.archive{position:relative}
details.score .drop,details.archive .drop{position:absolute;top:100%;left:auto;right:0;background:#0b0b0b;border:1px solid #2a2a2a;width:min(17rem,calc(100vw - 1.5rem));padding:.4rem;z-index:80;max-height:70vh;overflow-x:hidden;overflow-y:auto}
details.archive .drop{min-width:20rem}
details.score .drop a,details.archive .drop a{display:block;padding:.75rem .8rem;min-height:auto}
details.archive .drop .series{padding:.6rem .8rem .2rem;font:600 11px ui-sans-serif,system-ui;letter-spacing:.16em;text-transform:uppercase;color:var(--sage)}
select.essays{background:#0b0b0b;color:#e8e0d0;border:1px solid #e8e0d0;padding:.7rem .8rem;font:600 13px ui-sans-serif,system-ui;text-transform:uppercase;min-width:12rem;min-height:44px}
.hero{position:relative;min-height:78vh}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;max-width:none}
.hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.4),transparent)}
.hero .copy{position:relative;max-width:72rem;margin:0 auto;min-height:78vh;display:flex;flex-direction:column;justify-content:flex-end;padding:2rem 1.5rem 2.5rem}
.kicker{font:600 11px ui-sans-serif,system-ui;letter-spacing:.28em;text-transform:uppercase;color:var(--sage)}
h1{font:700 clamp(2.2rem,7vw,4.6rem)/.95 ui-sans-serif,system-ui;letter-spacing:.04em;text-transform:uppercase;margin:.4rem 0}
.btn{display:inline-flex;align-items:center;justify-content:center;background:var(--sage);color:#121212;text-decoration:none;padding:.85rem 1rem;font:700 12px ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;margin:.5rem .5rem 0 0;min-height:44px}
.btn.out{background:transparent;border:1px solid #ccc;color:#fff}
.panel{display:none;margin-top:1.6rem}
.panel:target{display:block}
.featured{display:grid;gap:2rem;grid-template-columns:1fr;align-items:center;max-width:72rem;margin:0 auto;padding:3rem 1.5rem 1rem}
@media(min-width:800px){.featured{grid-template-columns:1.15fr .85fr}}
.featured img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px}
.featured h2{font:700 clamp(1.8rem,4vw,3rem)/1.05 ui-sans-serif,system-ui;text-transform:uppercase;letter-spacing:.04em;margin:.4rem 0}
.menu-row{max-width:72rem;margin:0 auto;padding:0 1rem 3rem}
.wrap p, main.wrap p{font-size:1.2rem;line-height:2;margin:0 0 1.65em;letter-spacing:.015em;word-spacing:.04em}
.dek{font-size:1.32rem;line-height:1.7;margin:0 0 2.2em;color:#ddd}
.wrap ul{font-size:1.12rem;line-height:1.85;margin:0 0 2em 1.3em;padding:0}
.wrap li{margin:0 0 1em}
q, blockquote{display:block;font-size:1.35rem;line-height:1.55;margin:1.7rem 0;color:#eee}
.grid{display:grid;gap:1.2rem;grid-template-columns:repeat(2,minmax(0,1fr));max-width:72rem;margin:0 auto;padding:2rem 1rem}
@media(min-width:800px){.grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}}
.card{background:var(--surface);text-decoration:none;color:var(--fg);border-radius:8px;overflow:hidden}
.card h3{font:700 1.2rem ui-sans-serif,system-ui;text-transform:uppercase;padding:0 1rem}
.card p{padding:0 1rem 1rem;color:var(--muted)}
footer{border-top:1px solid var(--line);padding:2rem 1rem;color:var(--muted);font-size:.9rem}
footer .f{max-width:72rem;margin:0 auto;display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap}
.btns{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.5rem;margin:1.5rem 0}
.btns .btn{margin:0;width:100%;text-align:center;font-size:12px;letter-spacing:.04em;padding:.9rem .2rem;line-height:1.15}
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

function workerHtml() {
  return `<p class="kicker">${esc(WORKER.k)}</p>
<p>${esc(WORKER.v)}</p>
<ul>${WORKER.items.map((b) => `<li><a href="${b.href}"><strong>${esc(b.k)} · ${esc(b.amt)}</strong><br/>${esc(b.note)}</a></li>`).join("")}</ul>`;
}

function benefitsHtml() {
  return `<p class="kicker">${esc(BENEFITS.k)}</p>
<p style="font-size:1.8rem;font-weight:800">${esc(BENEFITS.stack)} a month</p>
<p>${esc(BENEFITS.v)}</p>
<ul>${BENEFITS.items.map((b) => `<li><a href="${b.href}"><strong>${esc(b.k)} · ${esc(b.amt)}</strong><br/>${esc(b.note)}</a></li>`).join("")}</ul>`;
}

function warfareHtml() {
  return `<h2>${esc(WARFARE.k)}</h2>
<p class="kicker">Psychological warfare</p>
<p>${esc(WARFARE.war)}</p>
<p class="kicker">Gaslighting</p>
<p>${esc(WARFARE.gas)}</p>
<p class="kicker">They stop the statement short</p>
<p>${esc(WARFARE.clip)}</p>
<p class="kicker">Narrative framing</p>
<p>${esc(WARFARE.frame)}</p>
<p><a href="/dispatch/the-media-ledger.html">The media ledger →</a> · <a href="/dispatch/the-democrat-ledger.html">The Democrat ledger →</a></p>
<p class="kicker">The paperwork</p>
<p>Open the indictment. The caption is not a count. Insurrection is 18 U.S.C. § 2383. If the word is not on the paper, it is not the charge.</p>
${PAPERS.map((p) => `<p><strong>${esc(p.k)}</strong><br/><em>What they ran.</em> ${esc(p.caption)}<br/>${esc(p.paper)}<br/><a href="${p.href}">The paper →</a>${p.extra ? p.extra.map((e) => ` · <a href="${e.href}">${esc(e.label)} →</a>`).join("") : ""}</p>`).join("")}
${HOAXES.map((h) => `<p><strong>${esc(h.k)}</strong><br/>${esc(h.v)}<br/><a href="${h.href}">The file →</a></p>`).join("")}
<p><a href="/dispatch/the-hire-is-the-country.html">The essay →</a></p>`;
}

function borderHtml() {
  return `<p class="kicker">${esc(BORDER.k)}</p>
<p>${esc(BORDER.v)}</p>
<ul>${BORDER.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}
<li><a href="/dispatch/they-opened-the-border.html">The essay</a></li></ul>`;
}

function borderMoveHtml() {
  return `<p class="kicker">${esc(BORDER_MOVE.k)}</p>
<p>${esc(BORDER_MOVE.v)}</p>
<ul>${BORDER_MOVE.items.map((b) => `<li><a href="${b.href}"><strong>${esc(b.k)} · ${esc(b.amt)}</strong><br/>${esc(b.note)}</a></li>`).join("")}</ul>`;
}

function borderHarmHtml() {
  return `<p class="kicker">${esc(BORDER_HARM.k)}</p>
<p>${esc(BORDER_HARM.v)}</p>
<ul>${BORDER_HARM.items.map((b) => `<li><a href="${b.href}"><strong>${esc(b.k)} · ${esc(b.amt)}</strong><br/>${esc(b.note)}</a></li>`).join("")}
<li><a href="/dispatch/the-hospital-and-the-morgue.html">The essay</a></li></ul>`;
}

function chartsHtml(room) {
  return (TAB_CHARTS[room] || [])
    .map(
      (c) =>
        `<figure><img src="${c.src}" alt="${esc(c.title)}"/><figcaption style="color:#a39e93;font-size:.85rem">${c.sources.map((s) => `<a href="${s.href}">${esc(s.label)}</a>`).join(" · ")}</figcaption></figure>`,
    )
    .join("");
}

function partyHtml(col) {
  const tally = DEBT_TALLY.find((t) =>
    col.id === "gop" ? t.who.startsWith("Republican") : t.who.startsWith("Democratic"),
  );
  return `<h2>${esc(col.party)}</h2>
${tally ? `<p style="font-size:1.8rem;font-weight:800">${esc(tally.added)}</p>` : ""}
<p>${esc(col.control)}</p>
<p>${esc(col.debt)}</p>
<p class="kicker">Helped</p>
<ul>${col.plus.map((p) => `<li><a href="${p.href}"><strong>${esc(p.k)}</strong><br/>${esc(p.bill)}</a></li>`).join("")}</ul>
<p class="kicker">Hurt</p>
<ul>${col.minus.map((p) => `<li><a href="${p.href}"><strong>${esc(p.k)}</strong><br/>${esc(p.bill)}</a></li>`).join("")}</ul>`;
}

function debtPlatesHtml() {
  return `<div class="grid">${DEBT_TALLY.map((row) => {
    const n = Number(row.added.replace(/[^0-9.]/g, ""));
    const pct = Math.round((n / 40.09) * 100);
    return `<a class="card" href="${row.href}" style="padding:1.2rem"><p class="kicker">${esc(row.who)}</p><h3>${esc(row.added)}</h3><div style="height:10px;background:#141414;margin-top:.8rem"><div style="height:10px;width:${pct}%;background:#e8e0d0"></div></div><p>${pct}% of the $40.09T</p><p>${esc(row.when)}</p></a>`;
  }).join("")}</div>`;
}

function majorityHtml(prefix) {
  const rows = prefix ? MAJORITY.filter((m) => m.who.startsWith(prefix)) : MAJORITY;
  return `<div class="grid">${rows.map((m) => `<a class="card" href="${m.href}" style="padding:1.2rem"><h3>${esc(m.who)}</h3><p>${esc(m.when)}</p><p>${esc(m.could)}</p><p>${esc(m.did)}</p></a>`).join("")}</div>`;
}

function scoreNav() {
  return `<p class="btns">${SCORE_TABS.map((f) => `<a class="btn" href="/scorecard.html#${f.id}">${esc(f.k)}</a>`).join("")}</p>`;
}

function scoreFile(room) {
  const gop = RECORD.find((r) => r.id === "gop");
  const dem = RECORD.find((r) => r.id === "dem");
  if (room === "gop" && gop) return partyHtml(gop) + majorityHtml("Republican");
  if (room === "dem" && dem) {
    return (
      partyHtml(dem) +
      majorityHtml("Democratic") +
      `<h2>${esc(ALIENS.k)}</h2><p>${esc(ALIENS.v)}</p><h3>Where the money came from</h3>` +
      ALIENS.from.map((row) => `<p><a href="${row.href}"><strong>${esc(row.k)} — ${esc(row.amt)}</strong></a> ${esc(row.v)}</p>`).join("") +
      `<h3>${esc(ALIENS.law.k)}</h3><p>${esc(ALIENS.law.v)}</p>` +
      ALIENS.law.rows.map((row) => `<p><a href="${row.href}"><strong>${esc(row.k)} — ${esc(row.amt)}</strong></a> ${esc(row.v)}</p>`).join("") +
      `<p>${esc(ALIENS.law.why)} <a href="${ALIENS.law.whyHref}">8 U.S.C. § 1158</a></p>` +
      `<h2>${esc(RAIL.k)}</h2><p>${esc(RAIL.v)}</p>` +
      RAIL.rows.map((row) => `<p><a href="${row.href}"><strong>${esc(row.k)} — ${esc(row.amt)}</strong></a> ${esc(row.v)}</p>`).join("") +
      `<p>${esc(RAIL.end)} <a href="${RAIL.endHref}">FRA compliance review</a></p>` +
      borderHtml() +
      borderMoveHtml() +
      borderHarmHtml() +
      benefitsHtml() +
      workerHtml() +
      `<h2>${esc(FUNNEL.k)}</h2><p>${esc(FUNNEL.v)}</p><div class="grid">${FUNNEL.pipes.map((p) => `<a class="card" href="${p.href}" style="padding:1.2rem"><h3>${esc(p.k)}</h3><p style="font-size:1.4rem;font-weight:800">${esc(p.amt)}</p><p>${esc(p.note)}</p></a>`).join("")}</div>` +
      warfareHtml()
    );
  }
  if (room === "split") {
    return `<p class="kicker">${esc(PURSE.k)}</p><p>${esc(PURSE.v)}</p><p><a href="${PURSE.href}">Article I →</a></p>` +
      debtPlatesHtml() +
      majorityHtml() +
      `<div class="grid">${FAILURE.map((d) => `<a class="card" href="${d.href}" style="padding:1.2rem"><h3>${esc(d.value)}</h3><p>${esc(d.label)}</p></a>`).join("")}</div>` +
      `<div class="grid">${DRIVERS.map((d) => `<a class="card" href="${d.href}" style="padding:1.2rem"><h3>${esc(d.k)}</h3><p>${esc(d.v)}</p></a>`).join("")}</div>` +
      `<p>${esc(DEBT_NOW.asOf)}: ${esc(DEBT_NOW.total)}. ${esc(DEBT_MATH)}</p>` +
      `<h2>${esc(ATM.k)}</h2><p>${esc(ATM.v)}</p>` +
      ATM.boxes.map((box) => `<p><a href="${box.href}"><strong>${esc(box.k)} — ${esc(box.amt)}</strong></a> ${esc(box.v)}</p>`).join("") +
      `<p>${esc(ATM.clock)} <a href="${ATM.clockHref}">Resume of Congressional Activity</a></p>` +
      `<p>${esc(ATM.law)} <a href="${ATM.lawHref}">31 U.S.C. § 1301</a></p>` +
      `<h2>${esc(COVID_CELL.k)}</h2><p>${esc(COVID_CELL.v)}</p>` +
      COVID_CELL.rows.map((row) => `<p><a href="${row.href}"><strong>${esc(row.k)} — ${esc(row.amt)}</strong></a> ${esc(row.v)}</p>`).join("") +
      `<p>${esc(COVID_CELL.end)} <a href="${COVID_CELL.endHref}">Labor inspector general</a></p>` +
      `<p>${esc(DEBT_WHY.v)}</p>`;
  }
  if (room === "oval") {
    const termHtml = (term) =>
      `<h2>${esc(term.who)}</h2><p>${esc(term.majority)}</p><p class="kicker">Helped</p><ul>${term.plus.map((p) => `<li><a href="${p.href}"><strong>${esc(p.k)}</strong><br/>${esc(p.bill)}</a></li>`).join("")}</ul><p class="kicker">Hurt</p><ul>${term.minus.map((p) => `<li><a href="${p.href}"><strong>${esc(p.k)}</strong><br/>${esc(p.bill)}</a></li>`).join("")}</ul>`;
    return `<h2>Signed today · ${esc(DEALS[0].grade)}</h2><p><a href="${DEALS[0].href}"><strong>${esc(DEALS[0].k)}</strong></a> ${esc(DEALS[0].v)}</p>` +
      `<h2>Helped or hurt · the signed deals</h2><p>These are agreements he signed. A border, a war, or a tariff. Not every agency memorandum in Treaties in Force.</p>` +
      DEALS.map((d) => `<p><a href="${d.href}"><strong>${esc(d.grade)} — ${esc(d.when)} — ${esc(d.k)}</strong></a> ${esc(d.v)}</p>`).join("") +
      `<h2>${esc(AT_HOME.k)}</h2><p>${esc(AT_HOME.v)}</p>` +
      AT_HOME.groups.map((g) => `<h3>${esc(g.k)}</h3><ol>${g.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>`).join("") +
      EFFECT_FILES.map((f) => `<h2>${esc(f.k)}</h2><p>${esc(f.v)}</p><ol>${f.items.map((item) => `<li><a href="${item.href}">${esc(item.k)}</a></li>`).join("")}</ol>`).join("") +
      `<h2>${esc(TERM_COMPARE.k)}</h2><p>${esc(TERM_COMPARE.v)}</p><p><a href="${TERM_COMPARE.href}">BLS unemployment rate</a></p>` +
      TERM_COMPARE.rows.map((row) => `<p><strong>${esc(row.k)}</strong> — Obama ${esc(row.obama)} (${row.gO}) · Trump ${esc(row.trump)} (${row.gT}) · Biden ${esc(row.biden)} (${row.gB}). ${esc(row.note)} ${esc(row.congress)}</p>`).join("") +
      TERM_SIGNED.map((col) => `<h2>${esc(col.who)} · ${esc(col.when)}</h2>` + col.items.map((item) => `<p><a href="${item.href}"><strong>${esc(item.grade)} — ${esc(item.k)}</strong></a> ${esc(item.v)}</p>`).join("")).join("") +
      `<p class="btns">${OVAL_DESKS.map((d) => `<a class="btn" href="#${d.id}">${esc(d.k)}</a>`).join("")}</p>
<p class="kicker">Border encounters</p><p>${esc(ENCOUNTERS.v)}</p><p><a href="${ENCOUNTERS.href}">CBP — nationwide encounters →</a></p>
<div class="grid">${OVAL.map((row) => `<div class="card" style="padding:1.2rem"><p class="kicker">${esc(row.who)}</p><p>${esc(row.when)}</p><h3>${esc(row.enc)}</h3><p>${esc(row.note)}</p></div>`).join("")}</div>
<p class="kicker">Highest price spike</p><p>${esc(CPI_PEAK.v)}</p><p><a href="${CPI_PEAK.href}">BLS — Consumer Price Index →</a></p>
<div class="grid">${OVAL.map((row) => `<div class="card" style="padding:1.2rem"><p class="kicker">${esc(row.who)}</p><p>${esc(row.when)}</p><h3>${esc(row.cpi)}</h3><p>highest 12-month rise</p><h3>${esc(row.gas)}</h3><p>highest EIA weekly gasoline</p></div>`).join("")}</div>
<p><a href="${OVAL_NOW.href}"><strong>${esc(OVAL_NOW.who)}</strong> · ${esc(OVAL_NOW.when)} · ${esc(OVAL_NOW.enc)}. ${esc(OVAL_NOW.note)}</a></p>
<h2 id="four">The file versus the caption</h2>
${OVAL_RECORD.map((row) => `<a class="card" href="${row.href}" style="padding:1.2rem;display:block"><h3>${esc(row.k)}</h3><p>${esc(row.v)}</p></a>`).join("")}
<p>${OVAL_LINKS.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join(" · ")} · <a href="/pump.html">The pump</a></p>
<div id="trump1">${TRUMP_TERMS.map((t) => `<div id="${t.id}">${termHtml(t)}</div>`).join("")}</div>
${OBAMA_TERMS.map(termHtml).join("")}`;
  }
  return (gop ? partyHtml(gop) : "") + (dem ? partyHtml(dem) : "") + debtPlatesHtml() + warfareHtml() +
    `<div class="grid">${LAWS.map((l) => `<a class="card" href="${l.href}" style="padding:1rem"><h3 style="padding:0">${esc(l.k)}</h3></a>`).join("")}</div>`;
}

function priceLinksHtml() {
 return `<p class="kicker">${esc(PRICES.k)}</p>
<p>${esc(PRICES.v)}</p>
<ul>${PRICES.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}</ul>`;
}

function essaySelectHtml() {
 const startSet = new Set(START_HERE);
 const start = START_HERE.map((s) => getPost(s)).filter(Boolean);
 const more = posts.filter((p) => !startSet.has(p.slug));
 const opt = (p) =>
  `<option value="/dispatch/${p.slug}.html">${esc(p.title)}</option>`;
 return `<select class="essays" onchange="if(this.value)location.href=this.value">
  <option value="">The journal</option>
  <optgroup label="Dispatch">${start.map(opt).join("")}</optgroup>
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
 <div class="ticker"><a class="mark" href="/">Swamp Force™</a><span class="line">${esc(SITE.kicker)}</span></div>
 <div class="bar">
  <nav>
   ${JOURNAL.map((section) => {
     const label = section.name.replace(/^The /, "");
     if (section.slugs.length === 1) {
       const p = getPost(section.slugs[0]);
       return p ? `<a href="/dispatch/${p.slug}.html">${esc(label)}</a>` : "";
     }
     return `<details class="archive"><summary>${esc(label)}</summary><div class="drop">${section.slugs.map((slug) => {
       const p = getPost(slug);
       return p ? `<a href="/dispatch/${p.slug}.html">${esc(p.title)}</a>` : "";
     }).join("")}</div></details>`;
   }).join("")}
   <details class="score">
    <summary>Scorecard</summary>
    <div class="drop">${SCORE_TABS.map((f) => `<p class="kicker">${esc(f.k)}</p><a href="/scorecard.html#${f.id}-charts">Charts</a><a href="/scorecard.html#${f.id}-read">Read</a>`).join("")}<p class="kicker">Trump 1</p><a href="/scorecard.html#oval-trump1-charts">Charts</a><a href="/scorecard.html#oval-trump1-read">Read</a><p class="kicker">Trump 2</p><a href="/scorecard.html#oval-trump2-charts">Charts</a><a href="/scorecard.html#oval-trump2-read">Read</a></div>
   </details>
   <details class="score">
    <summary>Pump</summary>
    <div class="drop"><a href="/pump.html#charts">Charts</a><a href="/pump.html#read">Read</a></div>
   </details>
   <a href="/foreword.html">Foreword</a>
  </nav>
 </div>
</header>
${body}
<footer>
 <div class="f">
  <div>
   <strong>${esc(SITE.mark)}</strong>
   <p>${esc(SITE.tagline)}</p>
   <p>${esc(SITE.closer)}</p>
  </div>
  <div>
   <a href="/scorecard.html">Scorecard</a><br/>
   <a href="/pump.html">Pump</a><br/>
   <a href="/foreword.html">Foreword</a><br/>
   <a href="/archive.html">Archive</a><br/>
   <a href="https://x.com/SwampForce">@SwampForce</a><br/>
   <a href="mailto:${SITE.email}">${SITE.email}</a>
  </div>
 </div>
 <p style="max-width:72rem;margin:1rem auto 0">${esc(SITE.copyright)}</p>
</footer>
</body></html>`;
}

const lead = getPost("we-the-people");

const indexBody = `
<section class="hero">
 <img class="bg" src="/images/hero-capitol.jpg" alt="Eagle on the Capitol in the swamp"/>
 <div class="shade"></div>
 <div class="copy">
  <p class="kicker">The journal</p>
  <h1>We the People.</h1>
  <p>The Constitution does not open with Congress. It opens with the owner. The 535 are the hire. The hire has gone rogue. Vote the file. Not the feeling.</p>
  <div>
   <a class="btn out" href="/scorecard.html">Scorecard</a>
  </div>
 </div>
</section>
<section class="featured">
 ${lead ? `<a href="/dispatch/${lead.slug}.html"><img src="${esc(lead.image)}" alt="${esc(lead.imageAlt)}"/></a>
 <div>
  <p class="kicker">The Republic</p>
  <h2>${esc(lead.title)}</h2>
  <p>${esc(lead.dek)}</p>
  <a class="btn" href="/dispatch/${lead.slug}.html">${esc(lead.title)}</a>
 </div>` : ""}
</section>
<section class="pad">
 <p class="kicker">The journal</p>
 <h2>Six series</h2>
 <p>Pick a file. Read it in order. The scorecard is the numbers.</p>
 <div class="grid">${JOURNAL.map((section) => {
   const first = getPost(section.slugs[0]);
   return `<a class="card" href="/dispatch/${section.slugs[0]}.html" style="padding:1.2rem"><p class="kicker">${esc(section.name)}</p><h3>${esc(first?.title || section.name)}</h3><p>${esc(section.dek)}</p></a>`;
 }).join("")}</div>
</section>
<section class="pad">
 <p class="kicker">Midterms</p>
 <h2>Congressional scorecard</h2>
 <p>Republicans. Democrats. Split. The Oval. Side by side. Pictures or the bills.</p>
 <div class="grid" style="padding-left:0;padding-right:0">${SCORE_TABS.map((f) => `<a class="card" href="/scorecard.html#${f.id}" style="padding:1.1rem"><h3 style="padding:0">${esc(f.k)}</h3><p style="padding:0">${esc(f.v)}</p></a>`).join("")}</div>
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
 join(out, "about.html"),
 shell({
  title: "About — Swamp Force",
  desc: "This journal prints the record. The country is the employer.",
  image: "/og.jpg",
  path: "/about.html",
  body: `<main class="wrap">
<p class="kicker">Masthead</p>
<h1>About</h1>
<p>${esc(SITE.masthead)}</p>
<p>Written by ${esc(SITE.author)}. If a claim cannot survive the rest of the sentence, it does not belong here.</p>
<p>${esc(SITE.copyright)} Quote with credit and a link. Do not copy the work as original. Built with Grok as a tool. The © is ${esc(SITE.author)}’s.</p>
<p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
</main>`,
 }),
);

writeFileSync(
 join(out, "foreword.html"),
 shell({
  title: "Foreword — Swamp Force",
  desc: "A letter from the editor. Why this journal exists.",
  image: "/og.jpg",
  path: "/foreword.html",
  body: `<main class="wrap" style="max-width:42rem">
<p class="kicker">From the editor</p>
<h1>Foreword</h1>
<p class="kicker">${esc(SITE.author)} · ${esc(SITE.name)}</p>
<p>Swamp Force is a journal of record. I publish the laws and official files anyone can open. I provide what is on the record: the facts of actions taken by our representatives. I do not write a narrative.</p>
<p>It is not what we say that defines us. It is what we do. Form your own opinions from the actions taken, not from the words spoken. This journal records what was done, not statements cut out of context.</p>
<p>Unless I specifically mark a passage as my opinion, treat what is written here as the record. I am a fellow American, loyal to no party. If a number is wrong or a page breaks, write <a href="mailto:${SITE.email}">${SITE.email}</a>. Any peaceful person who wants a correction, or a subject placed on the table, will get that work. I will research what the record requires.</p>
<p>${esc(SITE.author)}<br/>Editor</p>
<p><a href="/dispatch/that-is-not-why-they-are-elected.html">That is not why they are elected →</a></p>
</main>`,
 }),
);

writeFileSync(
 join(out, "scorecard.html"),
 shell({
  title: "Congressional Scorecard — Swamp Force",
  desc: "Republicans. Democrats. Split. The Oval. Side by side. Pictures or the bills. Government files only.",
  image: "/og.jpg",
  path: "/scorecard.html",
  body: `<main class="wrap" style="max-width:72rem">
<p class="kicker">Congressional scorecard · updated ${esc(SCORE_UPDATED)}</p>
<h1>Both parties have failed the American people.</h1>
<p>Congress holds the purse. Majority control is the test. Open a party. Pictures first, or the bills. Every number is a government file.</p>
${FILE_CHIPS[0] ? `<p><a class="btn" href="${FILE_CHIPS[0].href}">${esc(FILE_CHIPS[0].k)}</a></p><p>${esc(FILE_CHIPS[0].v)}</p>` : ""}
${scoreNav()}
${SCORE_TABS.map((f) => `<div class="panel" id="${f.id}">
<p class="kicker">${esc(f.k)} · pictures</p>
${scoreNav()}
<p class="btns" style="grid-template-columns:1fr 1fr"><a class="btn" href="#${f.id}">Pictures</a><a class="btn out" href="#${f.id}-file">The bills</a></p>
${chartsHtml(f.id)}
</div>
<div class="panel" id="${f.id}-file">
<p class="kicker">${esc(f.k)} · the bills</p>
${scoreNav()}
<p class="btns" style="grid-template-columns:1fr 1fr"><a class="btn out" href="#${f.id}">Pictures</a><a class="btn" href="#${f.id}-file">The bills</a></p>
${scoreFile(f.id)}
</div>`).join("")}
</main>`,
 }),
);

writeFileSync(
 join(out, "pump.html"),
 shell({
  title: "The pump — four administrations — Swamp Force",
  desc: "EIA weekly gasoline and diesel. Last four administrations.",
  image: "/images/chart-pump-admins.jpg",
  path: "/pump.html",
  body: `<main class="wrap" style="max-width:52rem">
<p class="kicker">The pump · EIA · updated ${esc(PUMP_UPDATED)}</p>
<h1>The gallon</h1>
<p>EIA splits the retail gallon into four parts: crude oil, refining, distribution and marketing, and taxes. WTI is West Texas Intermediate, the U.S. price of a 42-gallon barrel of crude, traded in Cushing, Oklahoma. OPEC and OPEC+ set how many barrels leave the ground. The refinery, the pipeline, the truck, the federal tax, the state tax, and in some states a unique blend, finish the number on the pump.</p>
${PUMP_CHARTS.map((c) => `<figure><img src="${c.src}" alt="${esc(c.title)}"/></figure>`).join("")}
<div class="grid">${GALLON_STACK.items.map((row) => `<a class="card" href="${GALLON_STACK.href}" style="padding:1.2rem"><p class="kicker">${esc(row.k)}</p><h3>${esc(row.amt)}</h3><p>${esc(row.pct)} of ${esc(GALLON_STACK.retail)}. ${esc(row.note)}</p></a>`).join("")}</div>
<h2>${esc(OPEC_FILE.k)}</h2>
<p>${esc(OPEC_FILE.v)}</p>
<p><a href="${OPEC_FILE.opec}">OPEC — who sits at the table</a> · <a href="${OPEC_FILE.href}">EIA STEO — OPEC+ production</a></p>
<h2>${esc(TAX_FILE.k)}</h2>
<p>${esc(TAX_FILE.v)}</p>
<table style="width:100%;border-collapse:collapse;font-size:1.05rem">
<thead><tr><th style="text-align:left;border-bottom:1px solid var(--line);padding:.6rem 0">Tax</th><th style="text-align:left;border-bottom:1px solid var(--line)">Cents per gallon</th><th style="text-align:left;border-bottom:1px solid var(--line)">Note</th></tr></thead>
<tbody>
${TAX_FILE.rows.map((r) => `<tr><td style="border-bottom:1px solid var(--line);padding:.7rem 0">${esc(r.k)}</td><td style="border-bottom:1px solid var(--line)">${esc(r.amt)}</td><td style="border-bottom:1px solid var(--line);color:var(--muted)">${esc(r.note)}</td></tr>`).join("")}
</tbody>
</table>
<p><a href="${TAX_FILE.href}">EIA — state motor-fuel taxes, January 2026</a></p>
<p>${esc(TAX_FILE.find)}</p>
<p><a href="${TAX_FILE.table}">EIA — Federal and State Motor Fuel Taxes (spreadsheet) →</a><br/>
<a href="${TAX_FILE.page}">EIA — Gasoline and Diesel Fuel Update →</a><br/>
<a href="${TAX_FILE.fhwa}">FHWA Highway Statistics — motor fuel (Table MF-121T) →</a></p>
<h2>${esc(RULES_FILE.k)}</h2>
<p>${esc(RULES_FILE.v)}</p>
<p><a href="${RULES_FILE.eia}">EIA — factors affecting gasoline prices</a> · <a href="${RULES_FILE.href}">CRS — gasoline prices</a></p>
<table style="width:100%;border-collapse:collapse;font-size:1.05rem">
<thead><tr><th style="text-align:left;border-bottom:1px solid var(--line);padding:.6rem 0">Administration</th><th style="text-align:left;border-bottom:1px solid var(--line)">Peak gasoline</th><th style="text-align:left;border-bottom:1px solid var(--line)">Peak diesel</th><th style="text-align:left;border-bottom:1px solid var(--line)">Peak WTI, $ per barrel</th></tr></thead>
<tbody>
${ADMINS.map((a) => `<tr><td style="border-bottom:1px solid var(--line);padding:.7rem 0">${esc(a.who)} <span style="color:var(--muted)">${esc(a.when)}</span></td><td style="border-bottom:1px solid var(--line)">$${a.gas.toFixed(2)}<br/><span style="color:var(--muted);font-size:.8rem">${esc(a.gasWhen)}</span></td><td style="border-bottom:1px solid var(--line)">$${a.diesel.toFixed(2)}<br/><span style="color:var(--muted);font-size:.8rem">${esc(a.dieselWhen)}</span></td><td style="border-bottom:1px solid var(--line)">$${a.wti.toFixed(2)}<br/><span style="color:var(--muted);font-size:.8rem">${esc(a.wtiWhen)}</span></td></tr>`).join("")}
</tbody>
</table>
<p>${MARKS.map((m) => `<a href="${m.href}"><strong>${esc(m.k)}</strong> — ${esc(m.v)}</a>`).join("<br/>")}</p>
<p style="color:var(--muted);font-size:.9rem">Sources: ${PUMP_SOURCES.map((s) => `<a href="${s.href}">${esc(s.label)}</a>`).join(" · ")}. Calendar years sit with the Oval that held most of the year. WTI is West Texas Intermediate: dollars for one 42-gallon barrel of U.S. crude oil, before it is gasoline. Pump prices include tax.</p>
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
<p><a href="/scorecard.html"><strong>Congressional Scorecard</strong></a><br/><span style="color:#a39e93">Both parties failed. They do not represent the American people.</span></p>
<p><a href="/pump.html"><strong>The pump</strong></a><br/><span style="color:#a39e93">Gas and diesel. Four administrations. EIA.</span></p>
`;
for (const section of JOURNAL) {
 const lessons = section.slugs.map((s) => getPost(s)).filter((p) => p && !HIDDEN.has(p.slug));
 if (!lessons.length) continue;
 archiveInner += `<p class="kicker">${esc(section.name)}</p>
${archiveList(lessons)}`;
}
{
 const listed = new Set(JOURNAL.flatMap((s) => [...s.slugs]));
 const rest = posts.filter((p) => !listed.has(p.slug) && !HIDDEN.has(p.slug));
 if (rest.length) {
  archiveInner += `<p class="kicker">More</p>
${archiveList(rest)}`;
 }
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
 ${
  p.lawfare?.length
   ? `<h2>Sold as fact · the file</h2>` +
     p.lawfare
      .map(
       (r) =>
        `<h3>${esc(r.caption)}</h3><p><strong>Sold as fact.</strong> ${esc(r.sold)}</p><p><strong>Evidence they used.</strong> ${esc(r.evidence)}</p><p><strong>Where it came from.</strong> ${esc(r.source)}</p><p><strong>What the file showed.</strong> ${esc(r.file)}</p><p><a href="${esc(r.href)}">Open the official file</a></p>`,
      )
      .join("")
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
CNAME protonmail._domainkey   (Proton)
CNAME protonmail2._domainkey  (Proton)
CNAME protonmail3._domainkey  (Proton)
TXT  @  protonmail-verification=e191278b0d9b7c1de03b3a0b4462d9a775d4698f
TXT  @  v=spf1 include:_spf.protonmail.ch ~all
TXT  _dmarc  v=DMARC1; p=quarantine

KEEP if Fourthwall merch still uses support.swampforce.com
----------------------------------------------------------
CNAME em-fw.support
CNAME s1._domainkey.support
CNAME s2._domainkey.support
CNAME zendesk3.support
CNAME zendesk4.support
TXT  _dmarc.support
TXT  support
TXT  zendeskverification.support

DELETE / REPLACE
----------------
A @ 34.117.223.165   <- old EasyWP. This is why you got "We'll be back soon".
CNAME www -> swampforce.com.  <- replace after hosting is on

ADD after Namecheap hosting is active
-------------------------------------
Namecheap email / hosting dashboard will show the new A record IP
for public_html. Put that IP on:

 A   @   (new hosting IP)   TTL 5 min
 CNAME www  swampforce.com.

Do not add Unmasked URL Redirect to grok.me. That was the SSL mess.

When swampforce.com loads this journal, set the X bio website to
https://swampforce.com — X will then use og.jpg in this zip, not Grok's flag card.
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
 "https://swampforce.com/scorecard.html",
 "https://swampforce.com/archive.html",
 "https://swampforce.com/about.html",
 "https://swampforce.com/foreword.html",
 "https://swampforce.com/pump.html",
 ...posts.map((p) => `https://swampforce.com/dispatch/${p.slug}.html`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => ` <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")}
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
