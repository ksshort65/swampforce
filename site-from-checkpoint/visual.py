"""Site-wide visual pass (Sep 26, 2026), applied to every generated page by build.py just before writing.
Only reorders and folds existing content; never deletes or rewords it.
  1. fold_lists: long lists (case ledgers, tables > 5 rows, lists > 5 items) go inside a collapsed <details class="sf-fold">
     whose summary is a site .btn ("See all N cases" / "Show the full list (N)").
Excluded: header, nav, footer, menus, the 'Why SwampForce exists' box, 'How we verify' boxes, anything already folded."""
from bs4 import BeautifulSoup, NavigableString
import re

SKIP_ANC_CLASSES = {"sf-nofold", "menu", "verify-box", "why-box", "why", "site-footer", "chart-card", "mt-rows", "nav-row", "tile-src", "store-embed"}
SKIP_TAGS = {"header", "nav", "footer", "select", "details", "summary", "svg", "form", "button", "script", "noscript", "head"}

def _skip(el):
    for a in el.parents:
        if a is None or a.name == "[document]":
            break
        if a.name in SKIP_TAGS:
            return True
        cls = set(a.get("class") or [])
        if cls & SKIP_ANC_CLASSES or any("verify" in c or "why" in c for c in cls):
            return True
        if (a.get("id") or "") in {"why", "how-we-verify", "site-nav"}:
            return True
    return False

def _kids(el, name=None, cls=None):
    out = []
    for c in el.children:
        if getattr(c, "name", None) and (name is None or c.name == name) and (cls is None or cls in (c.get("class") or [])):
            out.append(c)
    return out

def _offset(h, el):
    lines = h.split("\n")
    return sum(len(l) + 1 for l in lines[:el.sourceline - 1]) + el.sourcepos

def _end(h, start, tag):
    depth = 0
    for m in re.finditer(r"<(/?)%s\b[^>]*>" % tag, h[start:], flags=re.I):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return start + m.end()
    raise ValueError("unclosed " + tag)

def _wrap_html(label, inner):
    return ('<details class="sf-fold"><summary class="btn sm sf-fold-btn"><span class="sf-closed">' + label +
            '</span><span class="sf-opened">Hide the list</span></summary>' + inner + '</details>')

def fold_lists(soup, h):
    targets = []
    for el in soup.select(".ledger"):
        k = _kids(el, "article")
        if len(k) > 5 and not _skip(el):
            cases = sum(1 for x in k if "case" in (x.get("class") or []))
            targets.append((el, f"See all {len(k)} cases" if cases == len(k) else f"Show the full list ({len(k)})"))
    for el in soup.find_all("table"):
        body = el.find("tbody") or el
        rows = [r for r in body.find_all("tr", recursive=False)]
        if len(rows) > 5 and not _skip(el) and "sf-nofold" not in (el.get("class") or []) and not el.find_parent(class_="ledger"):
            host = el.parent if el.parent is not None and "table-wrap" in (el.parent.get("class") or []) else el
            targets.append((host, f"Show the full table ({len(rows)} rows)"))
    for el in soup.find_all(["ul", "ol"]):
        items = _kids(el, "li")
        if len(items) > 5 and not _skip(el) and not el.find_parent(["ul", "ol"]) and not el.find_parent(class_="ledger"):
            targets.append((el, f"Show the full list ({len(items)} items)"))
    spans, seen = [], set()
    for el, label in targets:
        if id(el) in seen:
            continue
        seen.add(id(el))
        a = _offset(h, el); assert h[a] == "<", (el.name, h[a:a+20])
        spans.append((a, _end(h, a, el.name), label))
    spans.sort()
    keep = []
    for sp in spans:  # drop spans nested inside an earlier one
        if keep and sp[0] < keep[-1][1]:
            continue
        keep.append(sp)
    for a, b, label in reversed(keep):
        h = h[:a] + _wrap_html(label, h[a:b]) + h[b:]
    return h, len(keep)

CHARTS_FIRST = True
READ_MORE = True
BLOCK_SEL = ".chart-grid, .tile-grid, .jr-charts, details#chart-drawer"

def charts_first(soup, h):
    """Move the page's existing chart/tile blocks to directly under the page title block (the child of <main>
    that holds the <h1>). Leaves an anchor where each block was; every card/tile then links back to it."""
    main = soup.find("main"); h1 = soup.find("h1")
    if not main or not h1:
        return h, 0
    top = h1
    while top.parent is not None and top.parent is not main:
        top = top.parent
    if top.parent is not main:
        return h, 0
    blocks = []
    for b in soup.select(BLOCK_SEL):
        if b.find_parent(class_=["chart-grid", "tile-grid", "jr-charts"]) or b.find_parent(id="chart-drawer"):
            continue
        if b.find_parent(class_=["tab-panel", "ledger", "frame", "verify-box"]) or b.find_parent(["header", "footer", "aside"]):
            continue
        if b.name != "details" and b.find_parent("details"):
            continue
        if b in top.descendants:
            continue
        blocks.append(b)
    if not blocks:
        return h, 0
    ins = _end(h, _offset(h, top), top.name)
    spans = sorted((_offset(h, b), _end(h, _offset(h, b), b.name)) for b in blocks)
    if spans[0][0] < ins:
        return h, 0
    moved = []
    for i, (a, b) in enumerate(reversed(spans)):
        k = len(spans) - i
        frag = h[a:b]
        tgt = f"sf-detail-{k}"
        frag = re.sub(r'<(div|article) class="(chart-card|stat)( [^"]*)?"', lambda m: f'<{m.group(1)} data-href="#{tgt}" class="{m.group(2)}{m.group(3) or ""} sf-link"', frag)
        moved.insert(0, frag)
        h = h[:a] + f'<span class="sf-anchor" id="{tgt}"></span>' + h[b:]
    wrap = "flush" in (main.get("class") or [])
    band = ('<section class="sf-charts-first">' + ('<div class="wrap">' if wrap else "") + "".join(moved) +
            '<p class="tap-hint">Tap a chart or tile for the details behind it.</p>' + ("</div>" if wrap else "") + "</section>")
    h = h[:ins] + band + h[ins:]
    return h, len(moved)

READ_SKIP = {"verify-box", "opinion", "jr-view", "frame", "law-card", "stat", "chart-card", "hero", "band-hero", "doc-head", "fr-view", "why", "status-box"}

def read_more(soup, h):
    """Runs of 4+ consecutive <p> siblings: first paragraph stays visible, the rest fold behind 'Read more'."""
    spans = []
    for par in soup.find_all(["div", "section", "article", "main"]):
        if par.find_parent(["header", "footer", "details", "aside", "nav"]) or par.name in ("header", "footer"):
            continue
        cls = set(par.get("class") or [])
        if cls & READ_SKIP or any("verify" in c or "why" in c for c in cls) or par.find_parent(class_=list(READ_SKIP)):
            continue
        run = []
        kids = [c for c in par.children if getattr(c, "name", None) or (isinstance(c, NavigableString) and c.strip())]
        for c in kids + [None]:
            if c is not None and getattr(c, "name", None) == "p" and not (set(c.get("class") or []) & {"opinion-label", "tap-hint", "page-updated", "byline"}):
                run.append(c); continue
            if len(run) >= 4:
                a = _offset(h, run[1]); b = _end(h, _offset(h, run[-1]), "p")
                spans.append((a, b))
            run = []
    spans.sort(); keep = []
    for sp in spans:
        if keep and sp[0] < keep[-1][1]:
            continue
        keep.append(sp)
    for a, b in reversed(keep):
        h = (h[:a] + '<details class="sf-fold sf-more"><summary class="btn sm ghost-dark sf-fold-btn"><span class="sf-closed">Read more</span><span class="sf-opened">Show less</span></summary>'
             + h[a:b] + "</details>" + h[b:])
    return h, len(keep)

def apply(name, h):
    if not h.lstrip().lower().startswith("<!doctype html") or "<main" not in h and "<body" not in h:
        return h
    soup = BeautifulSoup(h, "html.parser")
    h, n = fold_lists(soup, h)
    if CHARTS_FIRST and name not in ("scorecard.html", "betrayal.html", "betrayal-brief.html") and not name.startswith("journal-"):
        h2, m = charts_first(BeautifulSoup(h, "html.parser"), h)
        h = h2
    if READ_MORE:
        h, _ = read_more(BeautifulSoup(h, "html.parser"), h)
    return h
