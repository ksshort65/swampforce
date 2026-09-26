"""Journal: short visual essays (pilot) + Article V page. Imported at the end of watch.py.

Sources (read only):
  /workspace/checkpoint-review/essays-verified/<slug>.md  (verified full text; used verbatim in 'Read the full essay')
  /workspace/site-from-checkpoint/journal-data/article-v-states.csv  (Article V table)
Short versions are written here from the verified text; every fact carries a primary-record link.
Owner's opinion appears only inside the labeled 'Our view' box, in the owner's words.
"""
import csv, re
from pathlib import Path
import watch as W
from watch import e, stamp, CHECKED, ROOT, SITE, Section

EV = ROOT / "checkpoint-review" / "essays-verified"
JD = SITE / "journal-data"

# old /dispatch/<slug>.html -> new page (build.py essay_redirects() applies these over the hub defaults)
REDIRECTS = {"find-them": "journal-find-them.html",
             "that-is-not-why-they-are-elected": "journal-they-forgot-who-they-work-for.html",
             "they-work-for-us": "journal-they-work-for-us.html"}

L = {  # primary-record links
    "oig": ("DHS Inspector General, OIG-24-46", "https://www.oig.dhs.gov/sites/default/files/assets/2024-08/OIG-24-46-Aug24.pdf"),
    "dhs": ("DHS statement, Feb 24, 2026", "https://www.dhs.gov/news/2026/02/24/making-america-safe-again-state-dhs-under-president-trump-and-secretary-noem"),
    "1591": ("18 U.S.C. § 1591", "https://www.law.cornell.edu/uscode/text/18/1591"),
    "1589": ("18 U.S.C. § 1589", "https://www.law.cornell.edu/uscode/text/18/1589"),
    "art1": ("Constitution, Article I", "https://constitution.congress.gov/constitution/article-1/"),
    "oath": ("5 U.S.C. § 3331", "https://www.law.cornell.edu/uscode/text/5/3331"),
    "cspan_full": ("C-SPAN full news conference, Apr 22, 2026", "https://www.c-span.org/program/news-conference/house-democrats-hold-news-conference-on-virginia-redistricting-vote/677945"),
    "cspan_clip": ("C-SPAN clip", "https://www.c-span.org/clip/news-conference/user-clip-jeffries-maximum-warfare/5199623"),
    "hj_yt": ("Jeffries' own YouTube, May 19, 2026, at 8:41", "https://www.youtube.com/watch?v=IUlRHoY-DlU&t=521s"),
    "mccaul": ("Fox News Rundown episode, Jul 12, 2026", "https://radio.foxnews.com/2026/07/12/from-washington-rep-michael-mccaul-on-two-decades-of-public-service-and-the-changing-face-of-congress/"),
    "ooc": ("Office of Compliance memo, Nov 16, 2017", "https://www.ocwr.gov/wp-content/uploads/2017/11/memo_awards_and_settlements_appropriations_20171116.pdf"),
    "ooc_page": ("OCWR: Awards and Settlements 1997-2017", "https://www.ocwr.gov/publications/reports/awards-and-settlements/awards-and-settlements-appropriation-1997-2017/"),
    "reform": ("CAA Reform Act, Pub. L. 115-397 (congress.gov)", "https://www.congress.gov/bill/115th-congress/senate-bill/3749"),
    "roll83": ("House Roll Call 83, Mar 4, 2026", "https://clerk.house.gov/Votes/202683"),
    "roll233": ("House Roll Call 233, Jun 30, 2026", "https://clerk.house.gov/Votes/2026233"),
    "hres1100": ("H.Res. 1100 (congress.gov)", "https://www.congress.gov/bill/119th-congress/house-resolution/1100/all-actions"),
    "hres1399": ("H.Res. 1399 (congress.gov)", "https://www.congress.gov/bill/119th-congress/house-resolution/1399/text"),
    "ocwr1399": ("OCWR response to H.Res. 1399, Aug 31, 2026", "https://www.ocwr.gov/wp-content/uploads/OCWR-Response-to-HR-1399-Remediated.pdf"),
    "ethics": ("House Ethics Committee statement, Jul 2, 2026", "https://ethics.house.gov/press-releases/statement-of-the-committee-on-ethics-regarding-sexual-misconduct-settlements/"),
    "senate_rules": ("Senate Rules Committee release of OOC Senate data", "https://www.rules.senate.gov/news/majority-news/senate-rules-and-appropriations-committees-release-ooc-harassment-settlement-data"),
    "art5": ("Constitution, Article V (constitution.congress.gov)", "https://constitution.congress.gov/constitution/article-5/"),
    "clerk_mem": ("House Clerk: Article V memorials", "https://clerk.house.gov/SelectedMemorial"),
    "cos": ("Convention of States Action (advocacy group) list", "https://conventionofstates.com/states-that-have-passed-the-convention-of-states-article-v-application/"),
}


def S(H, key, label=None):
    lbl, u = L[key]
    return H.src_link(u, label or lbl)


# ───────────────────────── verified full text → HTML ─────────────────────────
_LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")


_BARE = re.compile(r"https?://[^\s<>()\]]+[^\s<>()\].,;:]")


def _dom(u):
    return re.sub(r"^https?://(www\.)?([^/]+).*", r"\2", u)


def _inline(s):
    """Markdown links, bare URLs ('Record: url', '- label — url') all become real links."""
    keep = []
    def _hold(html_):
        keep.append(html_); return f"\x00{len(keep)-1}\x00"
    s = _LINK.sub(lambda m: _hold(f'<a href="{e(m.group(2))}" target="_blank" rel="noopener">{e(m.group(1), quote=False)}</a>'), s)
    s = re.sub(r"\[([^\]]+)\]\(/dispatch/([\w-]+)\)", lambda m: _hold(f'<a href="{REDIRECTS[m.group(2)]}">{e(m.group(1), quote=False)}</a>' if m.group(2) in REDIRECTS else e(m.group(1), quote=False)), s)
    s = _BARE.sub(lambda m: _hold(f'<a class="src" href="{e(m.group(0))}" target="_blank" rel="noopener">{e(_dom(m.group(0)))} ↗</a>'), s)
    s = e(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])_(.+?)_(?![\w*])", r"<em>\1</em>", s)
    s = re.sub("\x00(\\d+)\x00", lambda m: keep[int(m.group(1))], s)
    return s.replace("<strong>Our view:</strong>", '<span class="op-tag">Our view</span>')


# checkpoint-review/site-apply.json: rows marked "cut it" (and rows whose old text was corrected elsewhere) never render here
def _sa_frags():
    import json as _j
    p = ROOT / "checkpoint-review" / "site-apply.json"
    if not p.exists():
        return []
    sa = _j.loads(p.read_text(encoding="utf-8"))
    try:
        ovr = _j.loads((SITE / "watch-data" / "site-apply-overlay.json").read_text(encoding="utf-8"))["rows"]
    except Exception:
        ovr = {}
    ov = set()
    for i, o in ovr.items():  # an overlay whose corrected text still contains the old words is not a removal
        old_t = next((x["old_text"] for x in sa["entries"] if x["id"] == i), "")
        old_t = old_t.split("|", 1)[-1].split(":", 1)[-1] if "TRUTH:" in old_t else old_t
        if re.sub(r"\s+", " ", old_t).strip()[:70] not in re.sub(r"\s+", " ", o["Text"]):
            ov.add(i)
    out = []
    for x in sa["entries"]:
        if "cut it" in (x.get("verdict") or "") or x["id"] in ov:
            tx = x["old_text"]
            tx = tx.split("|", 1)[-1].split(":", 1)[-1] if "TRUTH:" in tx else tx
            f = re.sub(r"\s+", " ", tx).strip()[:70]
            if len(f) >= 30:
                out.append((x["id"], f, re.sub(r"\s+", " ", tx).strip()))
    return out


SA_FRAGS = _sa_frags()
SA_DROPPED = []  # (page slug, site-apply id, first words) for the report


def _plain(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"\*\*|__|(?<![\w*])_|_(?![\w*])", "", s)
    return re.sub(r"\s+", " ", s).strip()


def sa_hit(text):
    p = _plain(text)
    for i, f, full in SA_FRAGS:
        if f in p or (len(p) >= 30 and p[:60] in f):
            return i
    return None


def sa_inside(sentence):
    """A short sentence that sits inside a site-apply cut/corrected passage."""
    p = _plain(sentence)
    for i, f, full in SA_FRAGS:
        if len(p) >= 12 and p in full:
            return i
    return None


def body_lines(slug):
    """The verified essay body: status line, sourcing note, title and slug/series/date lines removed."""
    out = []
    for ln in (EV / f"{slug}.md").read_text(encoding="utf-8").splitlines():
        s = ln.strip()
        if not s or s.startswith(("Status:", "_Sourcing standard", "## ")) or re.match(r"- (Slug|Series|Date):", s):
            continue
        out.append(s)
    return out


def words(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return len(re.findall(r"[A-Za-z0-9$%’'.,§-]*[A-Za-z0-9]+[A-Za-z0-9$%’'.,§-]*", re.sub(r"[*_>#]", " ", text)))


def full_html(slug, notes=None):
    """notes: {substring: note} adds a grey 'reported, not confirmed' note after a paragraph that carries no link."""
    notes = notes or {}
    parts = []
    for s in body_lines(slug):
        hit = sa_hit(s)
        if hit:
            SA_DROPPED.append((slug, hit, _plain(s)[:60]))
            continue
        extra = "".join(f' <span class="jr-note">[{e(n)}]</span>' for k, n in notes.items() if k in s)
        if s.startswith("### "):
            parts.append(f"<h3>{_inline(s[4:])}</h3>")
        elif s.startswith("> "):
            parts.append(f"<blockquote>{_inline(s[2:])}{extra}</blockquote>")
        else:
            parts.append(f"<p>{_inline(s)}{extra}</p>")
    return "\n".join(parts)



# ───────────────────────── source types ─────────────────────────
_TYPES = [  # (substring of url, label) first match wins
    ("oig.dhs.gov", "DHS Inspector General report"), ("oig.hhs.gov", "HHS Inspector General report"),
    ("oig.justice.gov", "DOJ Inspector General report"), ("oig.usaid.gov", "USAID Inspector General report"),
    ("sigar.mil", "Inspector General report (SIGAR)"), ("GOVPUB-S-PURL", "Inspector General report (SIGAR)"),
    ("justice.gov/opa/video", "Official video"), ("durhamreport", "DOJ report"), ("justice.gov/pardon", "DOJ pardon record"),
    ("justice.gov/usao", "U.S. Attorney record"), ("justice.gov", "Justice Department record"),
    ("dhs.gov", "DHS release"), ("hhs.gov", "HHS release"),
    ("constitution.congress.gov", "U.S. Constitution"), ("crs-product", "CRS report"), ("crsreports", "CRS report"),
    ("congressional-record", "Congressional Record"), ("/plaws/", "Public law"), ("congress.gov/bill", "Congress.gov"),
    ("congress.gov/1", "Congress.gov"), ("congress.gov", "Congress.gov"),
    ("law.cornell.edu/uscode", "U.S. Code"), ("law.cornell.edu/supct", "Supreme Court opinion"), ("supreme.justia.com", "Supreme Court opinion"),
    ("supremecourt.gov/opinions", "Supreme Court opinion"), ("supremecourt.gov", "Supreme Court docket"), ("law.justia.com/cases", "Court opinion"),
    ("clerk.house.gov/Votes", "House vote"), ("clerk.house.gov", "House Clerk record"), ("oversight.house.gov/roundtable", "House Oversight record"),
    ("oversight.house.gov", "House Oversight release"), ("docs.house.gov", "House hearing transcript"), ("ethics.house.gov", "House Ethics statement"),
    ("cha.house.gov", "House committee release"), ("lobbyingdisclosure.house.gov", "House disclosure"), ("house.gov", "Member\u2019s official site"),
    ("senate.gov", "Senate record"), ("cbp.gov", "CBP data"), ("fbi.gov", "FBI data"), ("bjs.ojp.gov", "BJS data"), ("bls.gov", "BLS data"),
    ("eia.gov", "EIA data"), ("fiscaldata.treasury.gov", "Treasury data"), ("usaspending.gov", "USASpending"), ("foreignassistance.gov", "Foreign aid data"),
    ("federalregister.gov", "Executive order"), ("whitehouse", "White House record"), ("state.gov", "State Department"), ("iaea.org", "IAEA report"),
    ("ecfr.gov", "Federal regulation"), ("fec.gov", "FEC"), ("fema.gov", "FEMA release"), ("govdelivery.com", "FEMA release"), ("gao.gov", "GAO report"),
    ("c-span.org", "C-SPAN video"), ("courtlistener.com", "Court filing"), ("nycourts.gov", "Court record"), ("courts.state.ny.us", "Court record"),
    ("nysenate.gov", "NY Senate bill"), ("fultonclerk.org", "Court clerk"), ("ocwr.gov", "OCWR record"), ("web.archive.org", "Archived copy"),
    ("archive.org", "Book (archive.org)"), ("debates.org", "Debate transcript"), ("dsausa.org", "DSA\u2019s own site"), ("bbc.co.uk", "BBC statement"),
    ("govinfo.gov", "Government record"), ("simonandschuster.com", "Publisher (audio)"),
]


def src_type(url):
    for k, v in _TYPES:
        if k in url:
            return v
    return W.domain(url) if hasattr(W, "domain") else re.sub(r"^https?://(www\.)?([^/]+).*", r"\2", url)


def src_btn(url, label=None):
    return (f'<a class="jr-srcbtn" href="{e(url)}" target="_blank" rel="noopener"><span class="jr-srctype">{e(label or src_type(url))}</span>'
            f'<span class="jr-srcgo">Open the record \u2197</span></a>')


# ───────────────────────── icons ─────────────────────────
_IC = {
    "money": '<circle cx="32" cy="32" r="22"/><path d="M40 24c-2-3-5-4-8-4-5 0-8 3-8 6 0 8 16 4 16 12 0 3-3 6-8 6-4 0-7-1-9-4M32 16v32"/>',
    "people": '<circle cx="22" cy="22" r="7"/><circle cx="42" cy="22" r="7"/><path d="M8 50c0-9 6-15 14-15s14 6 14 15M28 50c0-9 6-15 14-15s14 6 14 15"/>',
    "child": '<circle cx="32" cy="18" r="8"/><path d="M20 54V38c0-7 5-11 12-11s12 4 12 11v16M26 54V42M38 54V42"/>',
    "doc": '<path d="M18 8h20l10 10v38H18z"/><path d="M38 8v10h10M24 30h18M24 38h18M24 46h12"/>',
    "capitol": '<path d="M10 54h44M14 54V34h36v20M20 34v20M28 34v20M36 34v20M44 34v20M12 34h40l-20-12z"/><path d="M32 22V10M28 12h8"/>',
    "scale": '<path d="M32 10v44M20 54h24M12 20h40M12 20l-6 16h12zM52 20l-6 16h12zM6 36a6 4 0 0 0 12 0M46 36a6 4 0 0 0 12 0"/>',
    "shield": '<path d="M32 8l20 8v14c0 12-8 22-20 26C20 52 12 42 12 30V16z"/><path d="M24 32l6 6 12-12"/>',
    "chart": '<path d="M10 54h44M16 54V34M28 54V24M40 54V40M52 54V16"/>',
}


def icon(name):
    return (f'<svg class="jr-icon" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" '
            f'stroke-linecap="round" stroke-linejoin="round">{_IC.get(name, _IC["doc"])}</svg>')


LISTEN = ('<div class="jr-listen" hidden><span class="jr-listen-lbl">Listen</span>'
          '<button type="button" class="jr-lbtn" data-say="play" aria-label="Play the short version aloud">\u25b6 Play</button>'
          '<button type="button" class="jr-lbtn" data-say="pause" aria-label="Pause">\u275a\u275a Pause</button>'
          '<button type="button" class="jr-lbtn" data-say="stop" aria-label="Stop">\u25a0 Stop</button></div>')


# ───────────────────────── the short visual format (v2) ─────────────────────────
# Sep 26, 2026: cover pictures from the Grok Build site (src/lib/content.ts image per essay). Pictures only; chart images
# and pictures that carry a number or claim (essay-find-them, essay-it-does-not-fit, essay-who-got-paid) are not used.
COVERS = {'a-caption-cannot-be-outlawed': 'images/chamber.jpg', 'call-these-first': 'images/chamber.jpg', 'defund-ice-is-the-tell': 'images/journal/essay-defund-ice.jpg', 'division-is-the-product': 'images/journal/essay-eagle.jpg', 'full-time-or-go-home': 'images/journal/essay-full-time.jpg', 'how-the-house-was-captured': 'images/journal/torn-charter.jpg', 'not-a-part-time-job': 'images/chamber.jpg', 'the-7-billion-machine': 'images/capitol.jpg', 'the-caption-was-not-the-charge': 'images/chamber.jpg', 'the-debt-they-will-not-close': 'images/capitol.jpg', 'the-docket': 'images/chamber.jpg', 'the-file-on-the-man': 'images/journal/signs.jpg', 'the-floor-not-the-feed': 'images/chamber.jpg', 'the-hospital-and-the-morgue': 'images/journal/essay-defund-ice.jpg', 'the-law-they-dont-mention': 'images/journal/constitution.jpg', 'the-line-in-the-sand': 'images/journal/blog-truth.jpg', 'the-noise': 'images/journal/essay-the-noise.jpg', 'the-pool': 'images/journal/essay-eagle.jpg', 'the-recess-blockade': 'images/journal/blog-peoples.jpg', 'the-record-not-the-rally': 'images/chamber.jpg', 'the-republic-not-the-caption': 'images/journal/constitution.jpg', 'the-uniparty-mirror': 'images/journal/blog-house.jpg', 'the-whole-bill': 'images/journal/essay-show-the-slides.jpg', 'the-word-that-never-made-the-docket': 'images/chamber.jpg', 'they-clipped-the-tape': 'images/chamber.jpg', 'they-dont-debate-they-flag': 'images/journal/essay-eagle.jpg', 'they-forgot-who-they-work-for': 'images/capitol.jpg', 'they-hold-it-by-the-blade': 'images/journal/constitution.jpg', 'they-let-them-walk': 'images/chamber.jpg', 'they-opened-the-border': 'images/journal/essay-defund-ice.jpg', 'they-published-the-replacement': 'images/journal/torn-charter.jpg', 'they-sold-the-split': 'images/journal/essay-they-sold-the-split.jpg', 'they-want-a-new-constitution': 'images/journal/constitution.jpg', 'they-work-for-us': 'images/capitol.jpg', 'this-congress-cannot-police-itself': 'images/journal/we-the-people.jpg', 'we-the-people': 'images/journal/hero-capitol.jpg', 'what-he-told-them': 'images/capitol.jpg', 'what-the-democratic-party-became': 'images/journal/blog-house.jpg', 'what-the-republican-party-became': 'images/capitol.jpg', 'what-we-can-do': 'images/journal/signs.jpg', 'why-he-became-the-enemy': 'images/journal/signs.jpg', 'why-the-lobby-should-be-illegal': 'images/chamber.jpg'}


def essay_page(H, *, slug, fname, series, date, headline, card, facts, view, full, chart="", charts=None, graphic="", after="", related=()):
    """card: dict(kind='number'|'quote', big, label, url, type).  facts: [(summary, sentence_html, url, type)].
    view: list of owner sentences.  Every fact card opens its primary record in a new tab."""
    btn = src_btn(card["url"], card.get("type")) if card.get("url") else ""
    if card["kind"] == "number":
        c = (f'<div class="jr-card{" jr-card-ic" if card.get("icon") else ""}">{card.get("icon", "")}<div class="jr-big">{e(card["big"])}</div><p class="jr-card-lbl">{e(card["label"])}</p>'
             f'<p class="jr-card-src">{btn} {stamp() if btn else ""}</p></div>')
    else:
        is_view = not card.get("url")
        c = (f'<figure class="jr-card jr-quote{" jr-quote-view" if is_view else ""}"><blockquote>\u201c{e(card["big"])}\u201d</blockquote>'
             f'<figcaption class="jr-card-lbl">{"<span class=op-tag>Our view</span> " if is_view else ""}{e(card["label"]) if not is_view else "The owner, in the owner\u2019s words"}</figcaption>'
             f'{("<p class=jr-card-src>" + btn + " " + stamp() + "</p>") if btn else ""}</figure>')
    fc = "".join(
        f'<details class="jr-fact"><summary><span class="jr-fact-sum">{e(s)}</span><span class="jr-fact-type">{e(t or src_type(u))}</span></summary>'
        f'<div class="jr-fact-body"><p>{sent}</p>{src_btn(u, t)}</div></details>'
        for s, sent, u, t in facts)
    v = " ".join(e(x) for x in view)
    rel = "".join(f'<a class="btn ghost-dark sm" href="{h}">{e(t)}</a> ' for h, t in related)
    short = ((f'<figure class="jr-cover"><img src="{COVERS[slug]}" alt="" loading="eager" decoding="async"></figure>' if slug in COVERS else '') + f'<div class="jr-short" data-visible-words>'
             f'<p class="jr-kicker">Journal · {e(series)} · {e(date)} · 30-second read</p>'
             f'<h1 class="jr-h1">{e(headline)}</h1>{LISTEN}{c}{graphic}{chart}'
             f'<p class="jr-facts-h">The record <span>Tap a card for the detail. Each one opens the source.</span></p><div class="jr-facts">{fc}</div>'
             f'<aside class="jr-view"><p><span class="op-tag">Our view</span> <span class="jr-view-who">The owner, in the owner\u2019s words</span></p>'
             f'<p class="jr-view-txt">{v}</p></aside></div>')
    body = (f'<article class="jr-wrap">{short}'
            f'<details class="jr-full"><summary>Read the full essay</summary><div class="jr-full-body">'
            f'<p class="jr-full-note">The verified text, checked against primary records on {CHECKED}. Passages marked <span class="op-tag">Our view</span> are opinion.</p>'
            f'{full}</div></details>{after}'
            f'<p class="jr-rel"><a class="btn navy sm" href="journal.html">All journal essays</a> {rel}</p></article>')
    import html as _h
    _pl = re.sub(r"\s+", " ", _h.unescape(re.sub(r"<[^>]+>", " ", body)))
    bad = [(i, f) for i, f, _ in SA_FRAGS if f in _pl]
    assert not bad, (slug, bad)
    desc = (card["big"] + " \u2014 " + card["label"]) if card["kind"] == "number" else card["big"]
    return H.page(fname, f"{headline} · Swamp Force Journal", desc[:155], body, charts=charts, serious=True)


def visible_words(html_text):
    """Words a reader sees before tapping anything: collapsed fact bodies are not counted."""
    m = re.search(r'<div class="jr-short" data-visible-words>(.*?)</aside></div>', html_text, re.S)
    t = m.group(1)
    t = re.sub(r'<div class="jr-fact-body">.*?</div></details>', " ", t, flags=re.S)
    t = re.sub(r'<div class="jr-listen".*?</div>', " ", t, flags=re.S)
    t = re.sub(r"<canvas[^>]*>.*?</canvas>", " ", t, flags=re.S)
    t = re.sub(r'<span class="vstamp".*?</span>', " ", t, flags=re.S)
    t = re.sub(r'<span class="jr-srcgo">.*?</span>', " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t).replace("↗", " ")
    import html as _h
    return words(_h.unescape(t))


# ───────────────────────── the short visual format ─────────────────────────
STATS = {}


def _record(fname, slug, html_out):
    orig = "\n".join(body_lines(slug))
    STATS[fname] = {"slug": slug, "verified_words": words(orig), "visible_words": visible_words(html_out)}


def settlements_record(H):
    rows = [
        ("Members: settlements with no sexual-misconduct component", "$745,247.02"),
        ("House employees: settlements involving sexual misconduct", "$67,620.11"),
        ("House employees: settlements with no sexual-misconduct component", "$609,884.53"),
        ("32 House cases whose files were destroyed under a 2013\u20132018 retention policy (value known for 24)", "$166,120.08"),
        ("Members: names and amounts for sexual-harassment cases", "Withheld (CAA Section 416 confidentiality)"),
    ]
    tr = "".join(f'<tr><td data-l="Category">{e(a)}</td><td data-l="Amount">{e(b)}</td></tr>' for a, b in rows)
    timeline = [
        ("Mar 5, 2026", "Rep. Thomas Massie on \u201cCarl Higbie FRONTLINE\u201d the day after the 357\u201365 vote. Massie credits Rep. Nancy Mace for forcing the vote.", "https://www.youtube.com/watch?v=58Vlm4SA2B0"),
        ("May 26, 2026", "Rep. James Comer on \u201cCarl Higbie FRONTLINE\u201d: Higbie asks for the rest of the names from the \u201c$17 million\u201d fund.", "https://www.youtube.com/watch?v=kfJyqV3OEoQ"),
    ]
    tl = "".join(f'<li><span class="rep-date">{e(d)}</span> {e(t)} {H.src_link(u, "Newsmax video")}</li>' for d, t, u in timeline)
    return (
        '<details class="jr-full" id="settlements"><summary>The settlements record</summary><div class="jr-full-body">'
        f"<h3>What the $17.2 million is</h3><p>The Office of Compliance (renamed the Office of Congressional Workplace Rights in 2018) released the figure on Nov 16, 2017: "
        f"264 awards and settlements, $17,240,854, fiscal years 1997 through 2017, paid from its Treasury account. It says a large share came from legislative-branch offices other than the House or Senate, "
        f"and involved laws such as the overtime rules of the Fair Labor Standards Act, the Family and Medical Leave Act and the Americans with Disabilities Act. It is not a count of member sexual-misconduct cases. {S(H, 'ooc')} {S(H, 'ooc_page', 'OCWR page')}</p>"
        f"<h3>The 2018 law</h3><p>The Congressional Accountability Act of 1995 Reform Act (S. 3749) became Public Law 115-397 on Dec 21, 2018. Members must reimburse the Treasury for harassment awards and settlements, and those are referred to the Ethics Committee. {S(H, 'reform')}</p>"
        f"<h3>The votes</h3><p>Mar 4, 2026: on Rep. Nancy Mace\u2019s H.Res. 1100, the House voted 357\u201365 (1 present) to refer it to the Ethics Committee instead of adopting it. Republicans 175\u201338, Democrats 182\u201327. "
        f"{S(H, 'roll83')} {S(H, 'hres1100')}</p><p>Jun 30, 2026: Rep. Thomas Massie\u2019s H.Res. 1399 passed 420\u20130. Republicans 209 yea, 1 present (Mace); Democrats 210 yea; one independent yea. It directed the Ethics Committee and the OCWR to publish, within 60 days, the names of members in taxpayer-paid sexual-harassment cases and several dollar totals. {S(H, 'roll233')} {S(H, 'hres1399')}</p>"
        f"<h3>What came back</h3><p>The Ethics Committee said on Jul 2 that it does not handle settlements and has not been notified of any member sexual-misconduct award or settlement since the 2018 law. {S(H, 'ethics')} "
        f"The OCWR answered on Aug 31, 2026:</p><div class=\"table-wrap\"><table class=\"watch-table\"><thead><tr><th>Category (H.Res. 1399)</th><th>Amount</th></tr></thead><tbody>{tr}</tbody></table></div>"
        f"<p>{S(H, 'ocwr1399')}</p>"
        f'<h3>On the air (media, not proof)</h3><p>Newsmax host Carl Higbie pressed for the names on his show. His segments we found in Newsmax\u2019s own video uploads:</p><ul class="rep-list">{tl}</ul>'
        "<p class=\"jr-note\">No official or member in these records credits the coverage with the votes; the June vote came from Rep. Massie\u2019s privileged resolution.</p>"
        "</div></details>")


# ───────────────────────── Article V ─────────────────────────
ART5 = ("The Congress, whenever two thirds of both Houses shall deem it necessary, shall propose Amendments to this Constitution, or, on the Application of the Legislatures of two thirds of the several States, "
        "shall call a Convention for proposing Amendments, which, in either Case, shall be valid to all Intents and Purposes, as Part of this Constitution, when ratified by the Legislatures of three fourths of the several States, "
        "or by Conventions in three fourths thereof, as the one or the other Mode of Ratification may be proposed by the Congress; Provided that no Amendment which may be made prior to the Year One thousand eight hundred and eight "
        "shall in any Manner affect the first and fourth Clauses in the Ninth Section of the first Article; and that no State, without its Consent, shall be deprived of its equal Suffrage in the Senate.")


def av_rows():
    with open(JD / "article-v-states.csv", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_article_v(H):
    rows = av_rows()
    n_group = len(rows)
    n_rec = sum(1 for r in rows if r["record_url"])
    tr = "".join(
        f'<tr><td data-l="#">{i}</td><td data-l="State">{e(r["state"])}</td><td data-l="Passed (group\u2019s date)">{e(r["group_date"])}</td>'
        f'<td data-l="Official record">{H.src_link(r["record_url"], r["record_label"]) if r["record_url"] else "<span class=rep-nolink>Not yet linked to an official record</span>"}'
        f'{("<br><span class=jr-note>" + e(r["note"]) + "</span>") if r.get("note") else ""}</td></tr>'
        for i, r in enumerate(rows, 1))
    pct = round(100 * n_group / 34)
    chips = "".join(f'<span class="av-chip">{e(r["state"])}</span>' for r in rows) + "".join('<span class="av-chip empty"></span>' for _ in range(34 - n_group))
    body = (
        '<article class="jr-wrap av">'
        '<p class="jr-kicker">Journal · The Remedy · 30-second read</p><h1 class="jr-h1">Article V: the states\u2019 way to fix Congress</h1>'
        f'<figure class="jr-card jr-quote av-text"><blockquote>{e(ART5)}</blockquote><figcaption class="jr-card-lbl">U.S. Constitution, Article V</figcaption>'
        f'<p class="jr-card-src">{S(H, "art5")} {stamp()}</p></figure>'
        '<h2 class="jr-h2">How it works</h2><div class="av-steps">'
        '<div class="av-step"><div class="jr-big">34</div><p>state legislatures (two-thirds of 50) apply. Congress \u201cshall call\u201d a convention.</p></div>'
        '<div class="av-step"><div class="jr-big">38</div><p>states (three-fourths) must ratify any amendment it proposes, by legislature or state convention.</p></div></div>'
        f'<h2 class="jr-h2">Convention of States: where it stands</h2>'
        f'<div class="av-bar" role="img" aria-label="{n_group} of 34 states"><div class="av-fill" style="width:{pct}%"></div></div>'
        f'<p class="av-bar-lbl"><strong>{n_group} of 34</strong> states have passed the Convention of States resolution, <em>by the advocacy group\u2019s own count</em> {S(H, "cos")}. '
        f'We checked {n_rec} of {n_group} against an official record: the application as received by the U.S. House Clerk, or the state legislature\u2019s own text.</p>'
        f'<div class="av-chips">{chips}</div>'
        f'<details class="jr-full"><summary>The {n_group} states and their official records</summary><div class="jr-full-body">'
        '<p class="jr-note">Dates are the advocacy group\u2019s. \u201cOfficial record\u201d is the state\u2019s application as received by the U.S. House Clerk (or, where the Clerk\u2019s list has no copy, the state legislature\u2019s record), read by us for the Convention of States wording '
        '(\u201cimpose fiscal restraints \u2026 limit the power and jurisdiction of the federal government \u2026 limit the terms of office\u201d). Blank means we have not yet linked an official copy; the state stays in the group\u2019s count, not ours.</p>'
        f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>#</th><th>State</th><th>Passed (group\u2019s date)</th><th>Official record</th></tr></thead><tbody>{tr}</tbody></table></div>'
        f'<p>{S(H, "clerk_mem")} {S(H, "cos")}</p></div></details>'
        '<aside class="jr-view"><p><span class="op-tag">Our view</span> <span class="jr-view-who">The owner, in the owner\u2019s words</span></p>'
        '<p class="jr-view-txt">Members of Congress are bound by their oath and the Constitution to represent the people. Both parties took control from the people while ordinary Americans were busy caring for their families. '
        'We the people own and operate this country. Another election just puts more people in to do the same thing. An Article V convention of states is the only way to change Congress.</p></aside>'
        '<p class="jr-rel"><a class="btn navy sm" href="journal.html">All journal essays</a> <a class="btn ghost-dark sm" href="journal-they-forgot-who-they-work-for.html">They forgot who they work for</a> '
        '<a class="btn ghost-dark sm" href="remedy.html">The Remedy</a></p></article>')
    html_out = H.page("article-v.html", "Article V: the states\u2019 way to fix Congress · Swamp Force",
                      "Article V text, how a convention of states works (34 apply, 38 ratify), and which states have applied.", body, serious=True)
    return html_out, {"group_count": n_group, "linked_to_official_record": n_rec}




# ───────────────────────── the 57 converted essays ─────────────────────────
import json as _json, importlib.util as _ilu
_URL = re.compile(r"https?://[^\s)>\]]+")


def _spec():
    sp = _ilu.spec_from_file_location("essays_spec", JD / "essays_spec.py")
    m = _ilu.module_from_spec(sp); sp.loader.exec_module(m)
    return m.S


FACTS = {x["slug"]: x for x in _json.loads((JD / "essay-facts.json").read_text(encoding="utf-8"))}
SPEC = _spec()
for _s in FACTS:
    REDIRECTS[_s] = f"journal-{_s}.html"


def _lite(s):
    s = e(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    return s.replace("<strong>Our view:</strong>", '<span class="op-tag">Our view</span>')


def fact_parts(raw):
    """digest fact -> (verified sentence html, first url). The sentence is the verified text itself, links reduced to their words."""
    urls = _URL.findall(raw)
    t = re.sub(r"^\[(in-view|src|rec)\]\s*", "", raw)
    kind = re.match(r"^\[(in-view|src|rec)\]", raw)
    kind = kind.group(1) if kind else ""
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r"\1", t)
    t = re.sub(r"\[([^\]]+)\]\((/[^)\s]+)\)", r"\1", t)
    if kind == "rec":
        cells = [c.strip() for c in t.split("|")]
        cells = [c for c in cells if c and not _URL.fullmatch(c)]
        head, rest = (cells[0], cells[1:]) if cells else ("", [])
        html_ = f"<strong>{e(head)}.</strong> " + " ".join(_lite(_URL.sub("", c)) for c in rest)
    else:
        t = _URL.sub("", t)
        t = re.sub(r"^-\s*", "", t)
        t = re.sub(r"\s*[\u2014-]\s*$", "", t.strip())
        html_ = _lite(t.strip())
    return html_.strip(), (urls[0] if urls else "")


def _sentences(text, n):
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = _URL.sub("", re.sub(r"^-\s*", "", text)).replace("**Our view:**", "").strip()
    text = re.sub(r"^Our view:\s*", "", text)
    text = text[:1].upper() + text[1:]
    parts = re.split(r"(?<=[.!?\u201d])\s+(?=[A-Z\u201c\"'0-9])", text)
    return [p.strip() for p in parts[:n] if p.strip()]


def _digits(s):
    return re.findall(r"\d[\d,.]*", s)


CARD_WARN = []


def build_generic(slug):
    def _b(H):
        d, sp = FACTS[slug], SPEC[slug]
        fname = REDIRECTS[slug]
        facts_raw = d["facts"]
        k, big, label, fi = sp["card"]
        url = fact_parts(facts_raw[fi])[1] if fi is not None else ""
        if k == "n":
            src_txt = re.sub(r"[,\s]", "", facts_raw[fi])
            miss = [x for x in _digits(big) if re.sub(r"[,]", "", x).rstrip(".") not in src_txt]
            if miss:
                CARD_WARN.append((slug, big, miss))
        card = {"kind": "number" if k == "n" else "quote", "big": big, "label": label, "url": url}
        if k == "q":
            norm = lambda x: re.sub(r"\s+", " ", x.replace("\u2019", "'").replace("\u2018", "'")).lower()
            if norm(big) not in norm((EV / f"{slug}.md").read_text(encoding="utf-8")):
                CARD_WARN.append((slug, "quote not verbatim", big))
        facts = []
        for i, summ in sp["facts"]:
            sent, u = fact_parts(facts_raw[i])
            assert u, (slug, i)
            assert not sa_hit(re.sub("<[^>]+>", "", sent)) and not sa_inside(re.sub("<[^>]+>", "", sent)), ("site-apply cut text in fact", slug, i)
            facts.append((summ, sent, u, None))
        vi, vn = sp["view"]
        view = [x for x in _sentences(d["views"][vi], vn) if not sa_inside(x)]
        pool = [x for x in _sentences(d["views"][vi], 99)[vn:]]
        for j, vt in enumerate(d["views"]):
            if j != vi:
                pool += _sentences(vt, 99)
        seen = set(view)
        # only plain opinion sentences: no figures, quotations or attributed statements (those need a record link)
        pool = [x for x in pool if not (x in seen or seen.add(x)) and len(x) > 3 and not sa_inside(x)
                and not re.search(r"\d|[\u201c\u201d\"]|\b(said|says|posted|told|wrote|tweeted|called)\b", x)]
        chart, charts, graphic = "", None, ""
        if sp.get("chart"):
            title, labels, vals, fmt, cfi = sp["chart"]
            cid = f"chart-{slug}"[:60]
            chart = H.chart_card(cid, title, "") + f'<p class="jr-chart-src">{src_btn(fact_parts(facts_raw[cfi])[1])}</p>'
            charts = [{"id": cid, "type": "bar", "labels": labels, "data": vals, "colors": ["#16325c", "#b22234", "#8a9bb5", "#7c2d12"][:len(vals)], **({"fmt": fmt} if fmt else {})}]
        elif k == "n":
            card["icon"] = icon(sp.get("icon", "doc"))
        full = full_html(slug)
        def _render(v):
            return essay_page(H, slug=slug, fname=fname, series=d["series"], date=_date(d["date"]), headline=d["title"],
                              card=card, facts=facts, view=v, full=full, chart=chart, charts=charts, graphic=graphic,
                              related=[("journal.html#" + _sid(d["series"]), "More in " + d["series"])])
        html_out = _render(view)
        # short essays: add more of the owner's own sentences (still inside the labeled Our view box) toward ~120 visible words
        while visible_words(html_out) < 120 and pool:
            nxt = pool.pop(0)
            trial = _render(view + [nxt])
            if visible_words(trial) > 180:
                break
            view, html_out = view + [nxt], trial
        _record(fname, slug, html_out)
        return html_out, STATS[fname]
    return _b


def _date(iso):
    import datetime as _dt
    try:
        return _dt.date.fromisoformat(iso).strftime("%b %-d, %Y")
    except Exception:
        return iso


def _sid(series):
    return "s-" + re.sub(r"[^a-z]+", "-", series.lower()).strip("-")


L.update({
    "doj_vid": ("Official video: DOJ/DHS/HHS press conference, Jun 11, 2026", "https://www.youtube.com/watch?v=A8vR-XESWHE&t=493s"),
    "doj_page": ("Justice Department video page", "https://www.justice.gov/opa/video/doj-dhs-hhs-hold-press-conference-efforts-safeguard-unaccompanied-alien-children"),
    "oig25": ("DHS Inspector General, OIG-25-21", "https://www.oig.dhs.gov/sites/default/files/assets/2025-03/OIG-25-21-Mar25.pdf"),
    "hhsoig": ("HHS Inspector General, OEI-07-21-00250", "https://oig.hhs.gov/reports/all/2024/gaps-in-sponsor-screening-and-followup-raise-safety-concerns-for-unaccompanied-children/"),
    "hhs23": ("HHS release, Jun 2, 2023", "https://www.hhs.gov/about/news/2023/06/02/in-newly-released-audit-report-hhs-announces-new-accountability-team-additional-efforts-protect-safety-well-being-unaccompanied-children.html"),
    "dhs_nov": ("DHS release, Nov 14, 2025", "https://www.dhs.gov/news/2025/11/14/ice-and-state-local-law-enforcement-287g-partners-launch-initiative-protect"),
    "dhs_jul": ("DHS release, Jul 25, 2025", "https://www.dhs.gov/news/2025/07/25/dhs-leads-efforts-rescue-child-victims-sex-and-labor-trafficking"),
    "rt": ("House Oversight roundtable page, Jun 30, 2026", "https://oversight.house.gov/roundtable/catch-and-release-lose-and-forget-addressing-the-crisis-of-unaccompanied-alien-children-part-ii/"),
    "rt_vid": ("Official roundtable video, at about 46:01", "https://www.youtube.com/watch?v=HT3O3njMTEI&t=2761s"),
    "rt_rel": ("House Oversight release, Jul 1, 2026", "https://oversight.house.gov/release/roundtable-wrap-up-biden-administration-turned-a-blind-eye-to-immigration-crisis/"),
    "p1": ("Part I hearing transcript, Jul 23, 2025", "https://docs.house.gov/meetings/GO/GO33/20250723/118526/HHRG-119-GO33-Transcript-20250723.pdf"),
    "hr7123": ("H.R. 7123 text (congress.gov)", "https://www.congress.gov/119/bills/hr7123/BILLS-119hr7123ih.htm"),
    "hr7123_info": ("H.R. 7123 all info", "https://www.congress.gov/bill/119th-congress/house-bill/7123/all-info"),
    "pressley": ("Rep. Pressley\u2019s official transcript, Jan 29, 2026", "https://pressley.house.gov/2026/01/29/watch-in-minneapolis-pressley-omar-condemn-ice-violence-renew-calls-to-abolish-rogue-agency/"),
})


def U(key):
    return L[key][1]


# ───────────────────────── (a) Find them ─────────────────────────
def build_find_them(H):
    slug, fname = "find-them", REDIRECTS["find-them"]
    txt = (EV / f"{slug}.md").read_text(encoding="utf-8")
    for must in ("448,000", "32,000", "291,000", "Find them. All of them."):
        assert must in txt, f"find-them: '{must}' no longer in the verified text"
    chart = H.chart_card("chart-uc", "What the Inspector General counted", "Unaccompanied children, FY2019\u20132023. \u201cNo court notice\u201d = no notice to appear served as of May 2024.") \
        + f'<p class="jr-chart-src">{src_btn(U("oig"), "DHS Inspector General report")}</p>'
    charts = [{"id": "chart-uc", "type": "bar", "horizontal": True,
               "labels": ["Handed to HHS", "No court notice", "Missed court"],
               "data": [448000, 291000, 32000], "colors": ["#16325c", "#b22234", "#7c2d12"], "fmt": "int"}]
    facts = [
        ("448,000+ children handed to HHS. ICE could not account for all who missed court.",
         "DHS\u2019s own Inspector General found ICE transferred more than 448,000 unaccompanied children to HHS in fiscal 2019\u20132023 and could not account for the location of all who were released and then failed to appear in court. More than 32,000 missed court. More than 291,000 had never been served a notice to appear as of May 2024.",
         U("oig"), "DHS Inspector General report"),
        ("31,322 addresses on file were blank, undeliverable or incomplete.",
         "A follow-up audit (March 2025) of the 448,820 children transferred found the addresses for 31,322 were blank, undeliverable, or missing an apartment number.",
         U("oig25"), "DHS Inspector General report"),
        ("HHS check-in calls were late, undocumented, or never reached the child.",
         f"HHS\u2019s Inspector General (2024): 22% of safety and well-being calls were not made on time, 18% were not documented, and 16% of case files lacked sponsor safety-check documentation. HHS\u2019s own 2023 review: in the cases checked, calls reached the child 66% of the time. {H.src_link(U('hhs23'), 'HHS release, 2023')}",
         U("hhsoig"), "HHS Inspector General report"),
        ("What \u201clocated\u201d means, and how the count grew.",
         f"DHS counts a child as located \u201cin-person, in the United States, through visits and door knocks.\u201d It reported 13,000 located in July 2025 {H.src_link(U('dhs_jul'), 'DHS, Jul 2025')} and 145,000 in February 2026 {H.src_link(U('dhs'), 'DHS, Feb 2026')}. On June 11, 2026 the Secretary said he could not yet release a breakdown of what happened to the children found.",
         U("dhs_nov"), "DHS release"),
        ("Jun 30, 2026: the House roundtable on these children had zero Democrats present.",
         f"House Oversight\u2019s Subcommittee on Federal Law Enforcement held a roundtable, \u201cCatch and Release, Lose and Forget\u2026 Part II,\u201d on June 30, 2026 {H.src_link(U('rt'), 'roundtable page')}. At about 46:01 on the official video, Chairman Clay Higgins (R-LA) said: \u201cthere are zero Democrats present.\u201d The committee\u2019s July 1 release says Democrats \u201cfailed to show up\u201d {H.src_link(U('rt_rel'), 'release')}. The record does not give their reason. At the formal Part I hearing on July 23, 2025, the transcript lists five Democrats present {H.src_link(U('p1'), 'transcript')}.",
         U("rt_vid"), "Official video (House Oversight)"),
        ("Two House Democrats, on the record: abolish ICE.",
         f"Rep. Shri Thanedar (D-MI) introduced H.R. 7123, the \u201cAbolish ICE Act,\u201d on January 15, 2026, with no cosponsors {H.src_link(U('hr7123_info'), 'all info')}. Rep. Ayanna Pressley (D-MA), at a January 28, 2026 press conference with Rep. Ilhan Omar (D-MN), per her official transcript: \u201cWe need to abolish ICE.\u201d {H.src_link(U('pressley'), 'Pressley transcript')} We found no Republican bill or statement calling to defund or abolish ICE.",
         U("hr7123"), "Congress.gov bill text"),
    ]
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Border", date="Aug 31, 2026", headline="Find them.",
        card={"kind": "number", "big": "146,000", "icon": icon("child"),
              "label": "children located so far, DHS Secretary Markwayne Mullin said at a June 11, 2026 DOJ, DHS and HHS press conference. \u201cWe still have nearly 300,000 missing.\u201d",
              "url": U("doj_vid"), "type": "Official video (DOJ)"},
        facts=facts, chart=chart, charts=charts,
        view=["Nobody in Congress will mention these children.",
              "ICE is the only one looking for them, and some want to defund it for enforcing laws Congress passed.",
              "Epstein is a closed matter people have known about since the 90s, while these missing children are ignored.",
              "Find them. All of them."],
        full=full_html(slug), related=[("border.html", "The Border"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


# ───────────────────────── (b) They forgot who they work for ─────────────────────────
def build_forgot(H):
    slug, fname = "that-is-not-why-they-are-elected", REDIRECTS["that-is-not-why-they-are-elected"]
    txt = (EV / f"{slug}.md").read_text(encoding="utf-8")
    assert "maximum warfare, everywhere, all the time" in txt and "break their spirit" in txt
    facts = [
        ("Members are hired to represent a district and swear an oath to the Constitution.",
         f"House members are hired to represent a district, and each swears to support and defend the Constitution. {H.src_link(U('oath'), '5 U.S.C. \u00a7 3331')}",
         U("art1"), "U.S. Constitution"),
        ("Apr 22, 2026: \u201cmaximum warfare, everywhere, all the time.\u201d",
         f"Answering about Virginia\u2019s redistricting fight, Leader Jeffries said: \u201cwe are in an era of maximum warfare, everywhere, all the time.\u201d The remark was about congressional maps. {H.src_link(U('cspan_clip'), 'C-SPAN clip')}",
         U("cspan_full"), "C-SPAN video"),
        ("The May 19 quote was about MAGA Republicans, and the ballot box.",
         "His May 19 words were about \u201cMAGA extremists,\u201d meaning MAGA Republicans, and in the same breath he named beating them at the ballot box.",
         U("hj_yt"), "Official video (Jeffries\u2019 YouTube)"),
        ("A retiring Republican, Rep. Michael McCaul, described the same mood.",
         "Describing Congress after 22 years, McCaul said it has become \u201cvery vogue and style to demonize the other side of the aisle,\u201d with \u201cinternecine warfare within our own party.\u201d He was describing Congress, not urging anyone to do anything. At about 4:53 and 5:32.",
         U("mccaul"), "Media interview (audio)"),
    ]
    mccaul_box = (
        '<details class="jr-full"><summary>About the McCaul quote</summary><div class="jr-full-body">'
        "<p>The New York Times Magazine (Sep 16, 2026) printed two other McCaul lines: \u201cInternecine warfare is what has become vogue\u201d and "
        "\u201cYou\u2019re elected to fight and kill the other side.\u201d We listened to the full Fox News Rundown exit interview (Jul 12, 2026). "
        "Neither line is in it. What he said there, about 4:53 into the episode: \u201cit\u2019s very vogue and style to demonize the other side of the aisle and not, you know, almost vilify them.\u201d "
        "About 5:32: \u201cyou see that more so today now is internecine warfare within our own party, very much in style and vogue to go after your fellow Republican colleagues.\u201d "
        "The Times lines are <span class=\"jr-note\">reported, not confirmed by primary record</span>, and are not used here. "
        f"Times are approximate: the podcast file carries ads that can shift them by a few seconds. {S(H, 'mccaul')}</p></div></details>")
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Republic", date="Sep 17, 2026", headline="They forgot who they work for.",
        card={"kind": "quote", "big": "Our goal is to break them. We will defeat them. We have to beat them electorally, and then we have to break their spirit.",
              "label": "House Democratic Leader Hakeem Jeffries, May 19, 2026, CAP IDEAS conference, speaking about MAGA Republicans (at 8:41)",
              "url": U("hj_yt"), "type": "Official video (Jeffries\u2019 YouTube)"},
        facts=facts,
        view=["An employee does not declare war on the people who pay him.", "Watch the tape."],
        full=full_html(slug, {"Chief Justice Roberts issued a statement": "Roberts statement not linked here: reported, not confirmed by primary record"}),
        after=mccaul_box, related=[("journal-they-work-for-us.html", "They work for us"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


# ───────────────────────── (c) They work for us + settlements ─────────────────────────
def build_work_for_us(H):
    slug, fname = "they-work-for-us", REDIRECTS["they-work-for-us"]
    ooc_total, ooc_n = 17240854, 264
    charts = [
        {"id": "chart-roll83", "type": "bar", "horizontal": True, "stacked": True, "labels": ["Republicans", "Democrats"], "fmt": "int",
         "datasets": [{"label": "Send it to the Ethics Committee (yea)", "data": [175, 182], "color": "#57534e"},
                      {"label": "Vote on release now (nay)", "data": [38, 27], "color": "#b22234"}]},
        {"id": "chart-roll233", "type": "bar", "horizontal": True, "stacked": True, "labels": ["Republicans", "Democrats", "Independent"], "fmt": "int",
         "datasets": [{"label": "Yea", "data": [209, 210, 1], "color": "#16325c"}, {"label": "Present", "data": [1, 0, 0], "color": "#b22234"}]}]
    chart = (f'<div class="jr-charts">{H.chart_card("chart-roll83", "Mar 4, 2026: send the release to committee?", "H.Res. 1100 (Mace) · 357 yea, 65 nay, 1 present · Roll Call 83")}'
             f'{H.chart_card("chart-roll233", "Jun 30, 2026: release the records?", "H.Res. 1399 (Massie) · 420 yea, 0 nay, 1 present · Roll Call 233")}</div>'
             f'<p class="jr-chart-src">{src_btn(U("roll83"), "House vote")} {src_btn(U("roll233"), "House vote")}</p>')
    facts = [
        ("The total covers every kind of workplace claim, not only harassment.",
         "That total covers every kind of workplace claim under 13 laws, from overtime and family leave to disability, discrimination and harassment. It was not broken down by claim, and a large share of cases came from legislative-branch offices other than the House and Senate.",
         U("ooc"), "Office of Compliance record"),
        ("Since 2018, members must personally repay harassment settlements.",
         "Since the 2018 CAA Reform Act (Public Law 115-397), members must personally repay harassment awards and settlements.",
         U("reform"), "Congress.gov"),
        ("Two House votes: 357\u201365 to send it to committee, then 420\u20130 to release.",
         f"On March 4, 2026, the House voted 357\u201365 to send a release resolution to committee. On June 30 it passed another, 420\u20130. {H.src_link(U('roll233'), 'Roll 233')}",
         U("roll83"), "House vote"),
        ("Aug 31: dollar totals released, member names withheld.",
         "The workplace-rights office released dollar totals but withheld the list of member names, citing the law\u2019s confidentiality rule.",
         U("ocwr1399"), "OCWR record"),
    ]
    rec = settlements_record(H)
    html_out = essay_page(
        H, slug=slug, fname=fname, series="The Republic", date="Aug 24, 2026", headline="They work for us",
        card={"kind": "number", "big": f"${ooc_total:,}",
              "label": f"paid from a Treasury account for {ooc_n} workplace awards and settlements in legislative-branch offices, fiscal 1997\u20132017",
              "url": U("ooc"), "type": "Office of Compliance record"},
        facts=facts, chart=chart, charts=charts,
        view=["It\u2019s still theft. Why should we pay for what they do wrong?", "They work for us. They do not threaten us and expect us to pay them."],
        full=full_html(slug, {"chip in now to the @MNFreedomFund": "Post not linked here: reported, not confirmed by primary record",
                              "told NBC\u2019s Lester Holt": "Interview not linked here: reported, not confirmed by primary record"}),
        after=rec, related=[("journal-they-forgot-who-they-work-for.html", "They forgot who they work for"), ("article-v.html", "Article V")])
    _record(fname, slug, html_out)
    return html_out, STATS[fname]


# ───────────────────────── Journal hub ─────────────────────────
SERIES_ORDER = ["The Border", "The Republic", "Congress", "The Parties", "Democrats", "Republicans", "The Tape", "The Media", "The Remedy"]
HUB = [("journal-find-them.html", "Find them.", "The Border", "Aug 31, 2026", "146,000 children located so far. The Inspector General says ICE could not account for all who missed court."),
       ("journal-they-forgot-who-they-work-for.html", "They forgot who they work for.", "The Republic", "Sep 17, 2026", "\u201cMaximum warfare.\u201d \u201cBreak their spirit.\u201d The tape, in context."),
       ("journal-they-work-for-us.html", "They work for us", "The Republic", "Aug 24, 2026", "$17.2 million in workplace settlements, two House votes, and the names still withheld."),
       ("article-v.html", "Article V: the states\u2019 way to fix Congress", "The Remedy", "", "34 states apply, 38 ratify. Where the count stands.")]


def hub_entries():
    out = list(HUB)
    for slug, d in FACTS.items():
        k, big, label, _ = SPEC[slug]["card"]
        blurb = f"{big} \u2014 {label}" if k == "n" else f"\u201c{big}\u201d"
        out.append((REDIRECTS[slug], d["title"], d["series"], _date(d["date"]), blurb))
    return out


def build_hub(H):
    groups = {}
    for ent in hub_entries():
        groups.setdefault(ent[2], []).append(ent)
    order = [s for s in SERIES_ORDER if s in groups] + [s for s in groups if s not in SERIES_ORDER]
    secs = []
    for s in order:
        cards = "".join(
            f'<a class="jr-hub-card" href="{h}"><p class="jr-kicker">{e(d) + " · " if d else ""}30 seconds</p><h3>{e(t)}</h3><p>{e(x)}</p><span class="jr-hub-go">Read \u2192</span></a>'
            for h, t, _, d, x in groups[s])
        secs.append(f'<section class="jr-hub-sec" id="{_sid(s)}"><h2 class="jr-h2">{e(s)} <span>{len(groups[s])}</span></h2><div class="jr-hub">{cards}</div></section>')
    jump = "".join(f'<a class="av-chip" href="#{_sid(s)}">{e(s)}</a>' for s in order)
    n = len(hub_entries()) - 1
    body = ('<div class="jr-wrap jr-hubwrap">'
            f'{hero_html("journal")}'
            '<p class="jr-kicker">Swamp Force Journal</p><h1 class="jr-h1">The Journal</h1>'
            f'<p class="jr-lede">{n} short essays you can read in 30 seconds. One number or quote, the record behind it, and the owner\u2019s view, labeled. Tap any fact to open its source. The full verified essay is one tap away.</p>'
            f'<nav class="av-chips jr-jump" aria-label="Series">{jump}</nav>'
            f'{"".join(secs)}'
            '<p class="jr-rel"><a class="btn ghost-dark sm" href="foreword.html">The Republic</a> <a class="btn ghost-dark sm" href="about.html">Methodology</a></p></div>')
    return H.page("journal.html", "Journal · Swamp Force", "Short visual essays: one number, the primary record, and the owner's labeled view.", body, serious=True), {"essays": n}


def hero_html(where):
    """Owner's eagle lockup as the hub hero, on a navy banner (web copies in assets/brand/)."""
    return ('<div class="sf-banner"><picture><source srcset="assets/brand/lockup-light.webp" type="image/webp">'
            '<img src="assets/brand/lockup-light.png" alt="SwampForce" width="1100" height="583" decoding="async" fetchpriority="high"></picture></div>') if where else ""


_REQ = [EV / "find-them.md", EV / "that-is-not-why-they-are-elected.md", EV / "they-work-for-us.md", JD / "essays_spec.py", JD / "essay-facts.json"]
SECTIONS_J = [
    Section("journal.html", "Journal", "", _REQ, build_hub, in_menu=False),
    Section(REDIRECTS["find-them"], "Find them.", "", [EV / "find-them.md"], build_find_them, in_menu=False),
    Section(REDIRECTS["that-is-not-why-they-are-elected"], "They forgot who they work for.", "", [EV / "that-is-not-why-they-are-elected.md"], build_forgot, in_menu=False),
    Section(REDIRECTS["they-work-for-us"], "They work for us", "", [EV / "they-work-for-us.md"], build_work_for_us, in_menu=False),
    Section("article-v.html", "Article V", "", [JD / "article-v-states.csv"], build_article_v, in_menu=False),
] + [Section(REDIRECTS[s], FACTS[s]["title"], "", [EV / f"{s}.md", JD / "essays_spec.py"], build_generic(s), in_menu=False) for s in FACTS]
