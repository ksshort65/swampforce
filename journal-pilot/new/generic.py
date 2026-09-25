

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
        if k == "q" and fi is not None:
            assert big.lower()[:40] in re.sub(r"\s+", " ", facts_raw[fi]).lower().replace("\u2019", "'").replace("'", "'") or big.lower()[:25] in facts_raw[fi].lower(), (slug, big)
        facts = []
        for i, summ in sp["facts"]:
            sent, u = fact_parts(facts_raw[i])
            assert u, (slug, i)
            facts.append((summ, sent, u, None))
        vi, vn = sp["view"]
        view = _sentences(d["views"][vi], vn)
        chart, charts, graphic = "", None, ""
        if sp.get("chart"):
            title, labels, vals, fmt, cfi = sp["chart"]
            cid = f"chart-{slug}"[:60]
            chart = H.chart_card(cid, title, "") + f'<p class="jr-chart-src">{src_btn(fact_parts(facts_raw[cfi])[1])}</p>'
            charts = [{"id": cid, "type": "bar", "labels": labels, "data": vals, "colors": ["#16325c", "#b22234", "#8a9bb5", "#7c2d12"][:len(vals)], **({"fmt": fmt} if fmt else {})}]
        elif k == "n":
            card["icon"] = icon(sp.get("icon", "doc"))
        html_out = essay_page(H, slug=slug, fname=fname, series=d["series"], date=_date(d["date"]), headline=d["title"],
                              card=card, facts=facts, view=view, full=full_html(slug), chart=chart, charts=charts, graphic=graphic,
                              related=[("journal.html#" + _sid(d["series"]), "More in " + d["series"])])
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
