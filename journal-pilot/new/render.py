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
    short = (f'<div class="jr-short" data-visible-words>'
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
