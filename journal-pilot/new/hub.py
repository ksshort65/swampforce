

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
    """Owner's eagle art as the hero (web copies in assets/brand/)."""
    return ('<div class="sf-hero-eagle"><picture><source srcset="assets/brand/eagle-hero.webp" type="image/webp">'
            '<img src="assets/brand/eagle-hero.png" alt="Swamp Force eagle" width="600" height="693" loading="eager" decoding="async"></picture></div>') if where else ""


_REQ = [EV / "find-them.md", EV / "that-is-not-why-they-are-elected.md", EV / "they-work-for-us.md", JD / "essays_spec.py", JD / "essay-facts.json"]
SECTIONS_J = [
    Section("journal.html", "Journal", "", _REQ, build_hub, in_menu=False),
    Section(REDIRECTS["find-them"], "Find them.", "", [EV / "find-them.md"], build_find_them, in_menu=False),
    Section(REDIRECTS["that-is-not-why-they-are-elected"], "They forgot who they work for.", "", [EV / "that-is-not-why-they-are-elected.md"], build_forgot, in_menu=False),
    Section(REDIRECTS["they-work-for-us"], "They work for us", "", [EV / "they-work-for-us.md"], build_work_for_us, in_menu=False),
    Section("article-v.html", "Article V", "", [JD / "article-v-states.csv"], build_article_v, in_menu=False),
] + [Section(REDIRECTS[s], FACTS[s]["title"], "", [EV / f"{s}.md", JD / "essays_spec.py"], build_generic(s), in_menu=False) for s in FACTS]
