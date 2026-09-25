"""Second wave of Watch pages (imported at the end of watch.py).

Accountability hub + 5 trackers, Energy, Voters & Population, Floyd deep record, Censorship record.
Source research folders are read only. Research markdown is rendered through MD below, which
  * strips pointers to internal files and research-tool notes (curl, blocked hosts, "the box"),
  * moves anything marked reported / NEWS LEAD / not verified into grey Reported-only boxes,
  * turns markdown links and bare URLs into source links.
"""
import re, shutil
from pathlib import Path
import watch as W
from watch import e, stamp, reported_box, claim_card, legend, toc, read_csv, fmt_date, usd, CHECKED, ROOT, SITE, WD, Section

ACC = ROOT / "accountability"
EN = ROOT / "energy"
PV = ROOT / "population-voters"
FD = ROOT / "record-2020" / "floyd-deep"
CEN = ROOT / "censorship"
OUT = SITE / "public_html"

# ───────────────────────── markdown → HTML ─────────────────────────
_URL = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)|(https?://[^\s<>|\"`]+)")
_BAD = re.compile(r"`[^`]*`|\b[\w./-]+\.(?:csv|md|py|xlsx|json|txt)\b|\bthe box\b|research box|\bcurl\b|WebFetch|search[- ]index|search summary|"
                  r"headless|automated (?:fetch|check|request|access)|block(?:s|ed)? (?:automated|the fetch)|rate-limit|HTTP \d{3}|Akamai|"
                  r"fetch tool|syndication endpoint|could not (?:play|open|extract)|in this pass|Do not publish|do not publish|Recommended wording|"
                  r"Suggested (?:on-page )?wording|the user|user's|swampforce\.com|SwampForce label|as the user|research file|Do not do this", re.I)
_REP = re.compile(r"reported, not confirmed|NEWS LEAD|not verified|\bReported only\b|\((?:reported|as reported)[^)]*\)|"
                  r"^\**Reported\b|^\**Reported[:.]|\*\*Reported\*\*|lead only|\(a lead|leads?, not|\breported/alleged\b|Reported quotations|"
                  r"Wording is reported|Reported\. We have|a lead only", re.I)
_FP = [(r"\bMy reading:", "Our reading:"), (r"\bmy calculation\b", "our calculation"), (r"\bmy averages\b", "averages"), (r"\bI have no\b", "We have no"),
       (r"\bI found no\b", "We found no"), (r"\bI did not\b", "we did not"), (r"\bI could not\b", "we could not"), (r"\bI cited\b", "we cite"),
       (r"\bI searched\b", "we searched"), (r"\bI reviewed\b", "we reviewed"), (r"\bthe IEA page I opened\b", "the IEA page reviewed"),
       (r"\bI could find\b", "we could find"), (r"\bthat I could not extract\b", "that could not be extracted"),
       (r"Label it \*\*Unresolved \(no official finding\)\*\* and keep it out of any running total", "It is labeled **Unresolved (no official finding)** and kept out of every running total"),
       (r"Other states' orders can be added from their official archives; this file includes only", "This page includes only"),
       (r"Describe individual defendants, not an ethnic group, and never attribute a crime to people who have not been charged\.", "This page describes individual defendants, not an ethnic group, and attributes no crime to anyone who has not been charged.")]


def _sent(s):
    return W._sentences(s)


def _strip_bad(s):
    # remove parentheticals that carry research-tool notes, then drop whole sentences that still do
    for _ in range(2):
        s = re.sub(r"\s*\((?:[^()]*)\)", lambda m: "" if _BAD.search(m.group(0)) else m.group(0), s)
    parts = _sent(s)
    keep = [p for p in parts if not _BAD.search(p)]
    return " ".join(keep).strip()


class MD:
    def __init__(self, H, filemap=None, drop_rx=None):
        self.H = H
        self.filemap = filemap or {}
        self.drop_rx = drop_rx  # extra text patterns to remove (e.g. a juror's name)

    def _protect(self, s):
        links = []
        def keep(m):
            if m.group(2):
                url, lbl = m.group(2), m.group(1)
            else:
                url, lbl = m.group(3), None
                trail = ""
                while url and url[-1] in ".,;:":
                    trail = url[-1] + trail; url = url[:-1]
                if url.endswith(")") and url.count("(") < url.count(")"):
                    url = url[:-1]; trail = ")" + trail
                links.append((url, lbl)); return f"\x00{len(links) - 1}\x00{trail}"
            links.append((url, lbl)); return f"\x00{len(links) - 1}\x00"
        s = _URL.sub(keep, s)
        # court-file names -> links when we know the URL; otherwise they are dropped by _strip_bad/pdf rule
        def fm(m):
            fn = m.group(1)
            if fn in self.filemap:
                links.append((self.filemap[fn], "Court file")); return f"\x00{len(links) - 1}\x00"
            return ""
        s = re.sub(r"(?<![/\w\x00])([\w.-]+\.pdf)\b", fm, s)
        return s, links

    def clean(self, s):
        if self.drop_rx:
            s = self.drop_rx(s)
        for a, b in _FP:
            s = re.sub(a, b, s)
        s = re.sub(r"\bSource:\s*(?:and\s*)?[.;]?\s*$", "", s)
        return _strip_bad(s)

    def inline(self, s):
        s, links = self._protect(s)
        s = self.clean(s)
        s = re.sub(r"\(\s*\)", "", s)
        s = re.sub(r"\s+([.,;])", r"\1", s).strip()
        t = e(s)
        t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
        t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", t)
        t = t.replace("\\*", "*")
        def back(m):
            url, lbl = links[int(m.group(1))]
            return self.H.src_link(url, lbl)
        return re.sub(r"\x00(\d+)\x00", back, t)

    def plain(self, s):
        """(plain text, first url, label) for Reported-only boxes."""
        s, links = self._protect(s)
        s = self.clean(s) if not self.drop_rx else self.clean(s)
        first = next((u for u, _ in links), "")
        lbl = next((l for u, l in links if l), None)
        s = re.sub(r"\x00(\d+)\x00", lambda m: (links[int(m.group(1))][1] or ""), s)
        s = re.sub(r"\*\*|(?<!\w)\*|\*(?!\w)|`", "", s)
        s = re.sub(r"\(\s*[;,]?\s*\)", "", s)
        s = re.sub(r"\s+([.,;:])", r"\1", s)
        s = re.sub(r":\s*\.", ".", s)
        s = re.sub(r"\s{2,}", " ", s).strip(" :;")
        return s, first, (lbl or "Lead")

    # ── block parsing ──
    @staticmethod
    def sections(text, level=2):
        """[(title, lines)] split at headings of the given level; text before the first is title ''."""
        out, cur = [("", [])], None
        pre = "#" * level + " "
        for line in text.splitlines():
            if line.startswith(pre):
                out.append((line[len(pre):].strip(), [])); continue
            out[-1][1].append(line)
        return out

    def render(self, lines, *, rep_sink=None, h3="h3", stamp_h3=False, route=True):
        """Render a markdown block. Items marked reported go to rep_sink (list) when route=True."""
        html_parts, i, n = [], 0, len(lines)
        rep_sink = rep_sink if rep_sink is not None else []
        while i < n:
            line = lines[i].rstrip()
            s = line.strip()
            if (not s or re.fullmatch(r"-{3,}|\*{3,}", s) or s.startswith("![")
                    or re.match(r"^\*{0,2}(Recommended wording|Do not publish|Access note|Suggested|URL verification|Label each case|If a single sentence)", s.lstrip("*_ "))
                    or re.match(r"^\*URL verification", s)):
                i += 1; continue
            m = re.match(r"^(#{3,4}) (.+)$", s)
            if m:
                title = m.group(2)
                if route and re.search(r"reporting or advocacy|Alleged in reporting|Open items|not verified|^Reported|what exists only in", title, re.I):
                    j = i + 1
                    while j < n and not re.match(r"^#{2,4} ", lines[j]):
                        j += 1
                    for it in self._items(lines[i + 1:j]):
                        rep_sink.append(it)
                    i = j; continue
                tag = h3 if len(m.group(1)) == 3 else "h4"
                html_parts.append(f'<{tag} class="watch-h3">{self.inline(title)}{" " + stamp() if stamp_h3 else ""}</{tag}>')
                i += 1; continue
            if s.startswith("|"):
                j = i
                while j < n and lines[j].strip().startswith("|"):
                    j += 1
                html_parts.append(self._table(lines[i:j], rep_sink if route else None))
                i = j; continue
            if s.startswith(">"):
                j = i; buf = []
                while j < n and lines[j].strip().startswith(">"):
                    buf.append(lines[j].strip()[1:].strip()); j += 1
                inner = " ".join(buf)
                if route and _REP.search(inner):
                    rep_sink.append(self.plain(inner))
                else:
                    html_parts.append(f'<blockquote class="watch-quote">{self.inline(inner)}</blockquote>')
                i = j; continue
            if re.match(r"^\s*(?:[-*]|\d+\.)\s+", line):
                j = i
                while j < n and (re.match(r"^\s*(?:[-*]|\d+\.)\s+", lines[j]) or (lines[j].startswith("  ") and lines[j].strip())):
                    j += 1
                html_parts.append(self._list(lines[i:j], rep_sink if route else None))
                i = j; continue
            # paragraph (single line in these files)
            if route and re.match(r"^\**Reported, not confirmed", s):
                # a label line introducing reported bullets: the list that follows goes to the box
                j = i + 1
                while j < n and not lines[j].strip():
                    j += 1
                k = j
                while k < n and (re.match(r"^\s*(?:[-*]|\d+\.)\s+", lines[k]) or (lines[k].startswith("  ") and lines[k].strip())):
                    k += 1
                for it in self._items(lines[j:k]):
                    rep_sink.append(it)
                i = k; continue
            if route and _REP.search(s) and len(s) < 700 and not s.startswith("**Verdict"):
                rep_sink.append(self.plain(s))
                i += 1; continue
            txt = self.inline(s)
            if txt:
                cls = ' class="muted-note"' if s.startswith("*") and s.endswith("*") and not s.startswith("**") else ""
                html_parts.append(f"<p{cls}>{txt}</p>")
            i += 1
        return "".join(html_parts)

    def _items(self, lines):
        """Flatten list lines / paragraphs into Reported-box tuples."""
        out = []
        for it in self._tree(lines):
            txt = it["text"] + ("" if not it["kids"] else " " + " ".join(k["text"] for k in it["kids"]))
            p = self.plain(txt)
            if p[0]:
                out.append(p)
        return out

    @staticmethod
    def _tree(lines):
        root, stack = [], []
        for raw in lines:
            if not raw.strip():
                continue
            m = re.match(r"^(\s*)(?:[-*]|\d+\.)\s+(.*)$", raw)
            if m:
                lvl = len(m.group(1).replace("\t", "  ")) // 2
                node = {"text": m.group(2).strip(), "kids": [], "lvl": lvl}
                while stack and stack[-1]["lvl"] >= lvl:
                    stack.pop()
                (stack[-1]["kids"] if stack else root).append(node)
                stack.append(node)
            elif stack:
                stack[-1]["text"] += " " + raw.strip()
            else:
                root.append({"text": raw.strip(), "kids": [], "lvl": 0})
        return root

    def _list(self, lines, rep_sink):
        ordered = bool(re.match(r"^\s*\d+\.", lines[0]))
        def rend(nodes, depth=0):
            lis = []
            for nd in nodes:
                full = nd["text"] + " " + " ".join(k["text"] for k in nd["kids"])
                if rep_sink is not None and _REP.search(nd["text"]):
                    rep_sink.append(self.plain(full)); continue
                kids = rend(nd["kids"], depth + 1) if nd["kids"] else ""
                t = self.inline(nd["text"])
                if not t and not kids:
                    continue
                lis.append(f"<li>{t}{kids}</li>")
            if not lis:
                return ""
            tag = "ol" if (ordered and depth == 0) else "ul"
            return f'<{tag} class="watch-list{" sub" if depth else ""}">{"".join(lis)}</{tag}>'
        return rend(self._tree(lines))

    def _table(self, lines, rep_sink):
        rows = [[c.strip() for c in re.split(r"(?<!\\)\|", l.strip().strip("|"))] for l in lines]
        rows = [r for r in rows if not all(re.fullmatch(r":?-{2,}:?", c) for c in r if c)]
        if not rows:
            return ""
        head, body = rows[0], rows[1:]
        hl = [re.sub(r"\*", "", h) for h in head]
        trs = []
        for r in body:
            if rep_sink is not None and any(_REP.search(c) for c in r):
                txt = " · ".join(f"{hl[k]}: {c}" if k and k < len(hl) and hl[k] else c for k, c in enumerate(r) if c and c != "—")
                rep_sink.append(self.plain(txt)); continue
            tds = "".join(f'<td data-l="{e(hl[k] if k < len(hl) else "")}">{self.inline(c)}</td>' for k, c in enumerate(r))
            trs.append(f"<tr>{tds}</tr>")
        ths = "".join(f"<th>{self.inline(h)}</th>" for h in head)
        return f'<div class="table-wrap"><table class="watch-table"><thead><tr>{ths}</tr></thead><tbody>{"".join(trs)}</tbody></table></div>'


def rep_box(H, items, title="Reported only: not confirmed by a primary record", intro=""):
    seen, out = set(), []
    for t, u, lbl in items:
        if not t or t in seen:
            continue
        seen.add(t)
        out.append(("", t, u, lbl if u else "Lead"))
    return reported_box(H, out, title=title, intro=intro)


def src_line(H, links):
    """A 'Sources:' line of primary-record links for a section whose table cites no per-row link."""
    return '<p class="law-note">Sources: ' + " · ".join(H.src_link(u, l) for l, u in links) + '</p>'


def section(anchor, title, inner, primary=True):
    st = f" {stamp()}" if primary else ""
    return f'<section class="doc-section" id="{anchor}"><h2>{e(title)}{st}</h2>{inner}</section>'


def head(kicker, title, lede, extra=""):
    return (f'<header class="doc-head watch-head"><p class="doc-kicker">{e(kicker)}</p><h1>{e(title)}</h1>'
            f'<p class="doc-lede">{lede}</p><p class="watch-checked">Checked {CHECKED}. Items that rest on news reports alone are in grey Reported-only boxes and are not counted.</p>{extra}</header>')


USCODE = None


def law_chips(H, key, extra=()):
    global USCODE
    if USCODE is None:
        USCODE = read_csv(ACC / "uscode-map.csv")
    rows = [r for r in USCODE if r["scope"] == "accountability_file" and r["page_or_item"] == key] + list(extra)
    if not rows:
        return ""
    chips = "".join(f'<a class="law-chip" href="{e(r["link"])}" target="_blank" rel="noopener" title="{e(r["relevance_note"])}">{e(r["citation"])}</a>' for r in rows)
    notes = "".join(f'<li><b>{e(r["citation"])}</b>: {e(r["topic"])}. {e(r["relevance_note"])}</li>' for r in rows)
    return (f'<div class="law-box"><p class="law-note"><b>Statutes that govern this topic.</b> A statute listed here explains the legal framework. '
            f'It does not mean anyone violated it; where no charge or finding exists, the note says so.</p><p>{chips}</p>'
            f'<ul class="watch-list law-list">{notes}</ul></div>')


def sub_nav(cur):
    items = [("accountability.html", "Hub"), ("accountability-fraud.html", "Waste, fraud & abuse"), ("accountability-trading.html", "Congressional trading"),
             ("accountability-minnesota.html", "Minnesota fraud"), ("accountability-omar.html", "Omar allegation"), ("accountability-covid-border.html", "COVID & the border")]
    return '<nav class="watch-toc acc-nav" aria-label="Accountability trackers">' + "".join(
        f'<a href="{h}"{" aria-current=page class=cur" if h == cur else ""}>{e(t)}</a>' for h, t in items) + "</nav>"


def num_md(text, rx, cast=str):
    m = re.search(rx, text)
    if not m:
        raise SystemExit(f"watch2: figure not found: {rx}")
    return cast(m.group(1).replace(",", ""))


def reader_path(links):
    return '<section class="reader-path"><p>' + " ".join(f'<a class="btn {"navy" if i == 0 else "ghost-dark"} sm" href="{h}">{e(t)}</a>' for i, (h, t) in enumerate(links)) + "</p></section>"


# ───────────────────────── Accountability ─────────────────────────
def _acc_page(H, slug, title, desc, lede, body, charts=None):
    return H.page(slug, f"{title} · Swamp Force", desc, head("Accountability", title, lede, sub_nav(slug)) + legend() + body
                  + reader_path([("accountability.html", "All accountability trackers"), ("about.html", "Methodology")]), charts=charts, serious=True)


def build_acc_fraud(H):
    text = (ACC / "fraud-tally.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    # charts come from the page's own tables
    t1 = "\n".join(next(l for t, l in MD.sections(text) if t.startswith("1. Improper")))
    pairs = []
    for a, b, c, d in re.findall(r"^\| (\d{4}) \| ([\d.]+) \| (\d{4}) \| ([\d.]+) \|", t1, re.M):
        pairs += [(int(a), float(b)), (int(c), float(d))]
    pairs.sort()
    agency = re.findall(r"([A-Z][A-Za-z]+(?: \(Defense\))?) ([\d.]+)", re.search(r"### FY2025 by agency.*?\n(.+)", text).group(1))
    fy25 = dict(pairs)[2025]
    charts = [{"id": "chart-ip", "type": "bar", "labels": [f"FY{y}" for y, _ in pairs], "data": [v * 1e9 for _, v in pairs], "colors": ["#16325c"] * len(pairs), "fmt": "usd"},
              {"id": "chart-ip-agency", "type": "bar", "horizontal": True, "labels": [a for a, _ in agency], "data": [float(v) * 1e9 for _, v in agency], "colors": ["#7c2d12"] * len(agency), "fmt": "usd"}]
    tiles = [H.tile(f"${fy25:.0f}B", "Improper payments, FY2025", "Agency estimates across 64 programs; not all fraud", accent=True, src=H.src_link("https://www.gao.gov/products/gao-26-108694", "GAO-26-108694")),
             H.tile("$233–521B", "GAO fraud estimate, per year", "Statistical estimate (FY2018–22 data)", src=H.src_link("https://www.gao.gov/products/gao-24-105833", "GAO-24-105833")),
             H.tile("$6.8B+", "False Claims Act recoveries, FY2025", "DOJ settlements and judgments (record)", src=H.src_link("https://www.justice.gov/opa/pr/false-claims-act-settlements-and-judgments-exceed-68b-fiscal-year-2025", "DOJ")),
             H.tile("$20.58B", "IG investigative recoveries, FY2025", "CIGIE annual report; overlaps DOJ figures", src=H.src_link("https://www.ignet.gov/sites/default/files/files/CIGIE%202025%20Annual%20Report%20to%20the%20President_FINAL.pdf", "CIGIE")),
             H.tile("$16.8B", "DOGE contract savings on its own method", "vs. $215B claimed; GAO could not verify most", src=H.src_link("https://files.gao.gov/reports/GAO-26-108615/index.html", "GAO-26-108615"))]
    parts = []
    for t, lines in MD.sections(text):
        if not t:
            continue
        r = md.render(lines, rep_sink=rep)
        if t.startswith("1. Improper"):
            r = (f'<div class="chart-grid two">{H.chart_card("chart-ip", "Improper payments by fiscal year", "Improper + unknown, as reported by agencies (paymentaccuracy.gov dataset)")}'
                 f'{H.chart_card("chart-ip-agency", "FY2025 improper payments by agency", "Improper + unknown")}</div>') + r
        anchor = "fr-" + re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")[:28]
        title = "Why there is no single \"grand total\" of fraud" if t.startswith("Read this first") else t
        if t.startswith("Read this first"):
            r += src_line(H, [("GAO-26-108694 (improper payments)", "https://www.gao.gov/products/gao-26-108694"), ("GAO-24-105833 (fraud estimate)", "https://www.gao.gov/products/gao-24-105833"),
                              ("SBA OIG 23-09 (PPP/EIDL)", "https://www.oversight.gov/sites/default/files/documents/reports/2023-06/SBA-OIG-Report-23-09.pdf"), ("GAO-23-106696 (UI fraud)", "https://www.gao.gov/products/gao-23-106696"),
                              ("DOJ FCA FY2025", "https://www.justice.gov/opa/pr/false-claims-act-settlements-and-judgments-exceed-68b-fiscal-year-2025"),
                              ("CIGIE FY2025", "https://www.ignet.gov/sites/default/files/files/CIGIE%202025%20Annual%20Report%20to%20the%20President_FINAL.pdf"), ("GAO-26-108615 (DOGE)", "https://files.gao.gov/reports/GAO-26-108615/index.html")])
        parts.append(section(anchor, title, r, primary=not t.startswith("Read this first")))
    body = (f'<div class="tile-grid">{"".join(tiles)}</div>' + "".join(parts) + law_chips(H, "fraud-tally.md") + rep_box(H, rep))
    html_out = _acc_page(H, "accountability-fraud.html", "Waste, Fraud & Abuse: the running tally",
                         "Improper payments, GAO's fraud estimate, inspector-general and DOJ recoveries, pandemic fraud and the GAO audit of DOGE's savings claims.",
                         "Government-wide improper payments, estimated fraud, enforcement recoveries and savings claims, from OMB, GAO, CIGIE, DOJ and SBA OIG records. The categories measure different things and overlap, so this page keeps a separate total for each tier and never adds them together.",
                         body, charts)
    return html_out, {"fy_points": len(pairs), "fy2025_billion": fy25, "agencies": len(agency), "reported": len(rep), "grand_total": False}


def build_acc_trading(H):
    text = (ACC / "trading.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    n_tx = num_md(text, r"\*\*Both chambers, all assets\*\* \| \*\*([\d,]+)\*\*", int)
    late = num_md(text, r"\*\*Face-of-filing result:\*\* ([\d,]+) transaction lines", int)
    members = num_md(text, r"They come from \*\*(\d+) members\*\*", int)
    top = re.findall(r"^\| (\d+) \| (?:Rep\.|Sen\.) ([^|(]+)\([^)]*\) \| ([\d,]+) \| \$([\d.]+)M", text, re.M)
    charts = [{"id": "chart-trade-top", "type": "bar", "horizontal": True, "labels": [n.strip() for _, n, _, _ in top],
               "data": [float(v) * 1e6 for *_, v in top], "colors": ["#16325c"] * len(top), "fmt": "usd"}]
    tiles = [H.tile(f"{n_tx:,}", "Disclosed trades, Jan 2025 – Sep 24, 2026", "House and Senate periodic transaction reports", accent=True, count=n_tx),
             H.tile("$404.1M–$1.362B+", "Disclosed value range", "Sum of range floors to ceilings; profits are not disclosed"),
             H.tile(f"{late:,}", "Trade lines filed after 45 days", f"From {members} members, on the face of the filing", count=late),
             H.tile("2", "Members ever convicted of insider trading", "Collins (pardoned 2020), Buyer (pardoned 2026)")]
    answer = ('<div class="answer-box"><p><b>Two things these records cannot show.</b> Disclosures list value ranges, not amounts, and they never report profit or loss, '
              'so no one can compute a member\'s trading profit from them. A trade filed after the 45-day deadline is a disclosure violation that carries a $200 late fee; '
              'it is not evidence of insider trading. Each late line below is described only as "filed after the 45-day deadline on the face of the official filing."</p></div>')
    parts = []
    for t, lines in MD.sections(text):
        if not t:
            continue
        r = md.render(lines, rep_sink=rep)
        if t.startswith("2. Top"):
            r = H.chart_card("chart-trade-top", "Top 10 by disclosed volume", "Sum of range minimums, all assets (dollars)") + r
        if t.startswith("1."):
            r += src_line(H, [("House Clerk periodic transaction reports", "https://disclosures-clerk.house.gov/FinancialDisclosure"), ("Senate eFD", "https://efdsearch.senate.gov/search/")])
        parts.append(section("tr-" + t.split(".")[0], t, r))
    extra = [{"citation": "Pub. L. 112-105 (STOCK Act)", "topic": "STOCK Act of 2012", "link": "https://www.congress.gov/112/plaws/publ105/PLAW-112publ105.pdf",
              "relevance_note": "Applied the disclosure law's periodic-transaction reporting to members of Congress."},
             {"citation": "5 U.S.C. 13105(l)", "topic": "Periodic transaction reports (45-day deadline)", "link": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title5-section13105&num=0&edition=prelim",
              "relevance_note": "Sets the 30/45-day reporting deadline. A late filing is a disclosure violation, not insider trading."},
             {"citation": "5 U.S.C. 13106", "topic": "Failure to file or filing false reports", "link": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title5-section13106&num=0&edition=prelim",
              "relevance_note": "Civil penalty for knowing and willful failure to file; no member has been found in violation in the records reviewed."}]
    body = answer + f'<div class="tile-grid">{"".join(tiles)}</div>' + "".join(parts) + law_chips(H, "none", extra) + rep_box(H, rep)
    html_out = _acc_page(H, "accountability-trading.html", "Congressional Stock Trading, 2025–2026",
                         "Disclosed trade volume, top traders, late filings and prosecutions, from official House and Senate filings.",
                         "Every figure comes from the official House Clerk and Senate eFD periodic transaction reports, each linked to its filing. Commercial aggregators were not used.",
                         body, charts)
    return html_out, {"transactions": n_tx, "late_lines": late, "late_members": members, "top": len(top), "reported": len(rep)}


def build_acc_minnesota(H):
    text = (ACC / "minnesota-fraud.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    charged = num_md(text, r"\*\*Federal subtotal\*\* \| \*\*(\d+)\*\*", int)
    conv = num_md(text, r"\| \*\*(\d+) per DOJ statements\*\*", int)
    prog = [("Feeding Our Future", 79, 70), ("Housing Stabilization", 21, 4), ("EIDBI (autism Medicaid)", 4, 1), ("Individualized Home Supports", 2, 0), ("Integrated Community Supports", 1, 0), ("Child care", 1, 0)]
    for name, c, v in prog[:3]:
        if not re.search(rf"\*\*{c}\*\*", text):
            raise SystemExit(f"minnesota: count {c} for {name} not in source")
    charts = [{"id": "chart-mn", "type": "bar", "horizontal": True, "labels": [p[0] for p in prog],
               "datasets": [{"label": "Charged", "data": [p[1] for p in prog], "color": "#16325c"}, {"label": "Convicted (per DOJ)", "data": [p[2] for p in prog], "color": "#14532d"}]}]
    tiles = [H.tile(str(charged), "Charged in federal court (D. Minn.)", "Program-fraud waves, 2022–2026", accent=True, count=charged),
             H.tile(str(conv), "Convicted, per DOJ statements", "Proven as to these defendants", count=conv),
             H.tile("≈$375M", "Alleged in federal cases", "DOJ figures; an indictment is an allegation"),
             H.tile("Unresolved", "The $9B estimate", "A prosecutor's estimate; no court or audit adopted it; excluded from totals")]
    parts = []
    for t, lines in MD.sections(text):
        if not t:
            continue
        r = md.render(lines, rep_sink=rep)
        if t.startswith("1. Running"):
            r = H.chart_card("chart-mn", "Charged vs. convicted, by program", "Federal cases, D. Minn., per DOJ") + r
        parts.append(section("mn-" + t.split(".")[0], t, r))
    body = f'<div class="tile-grid">{"".join(tiles)}</div>' + "".join(parts) + law_chips(H, "minnesota-fraud.md") + rep_box(H, rep)
    html_out = _acc_page(H, "accountability-minnesota.html", "Minnesota Program Fraud: Charges and the \"Money to Somalia\" Question",
                         "Federal charges and convictions in Minnesota program-fraud cases, 2022–2026, and what the record shows about money sent abroad.",
                         "Federal charges, convictions and alleged amounts from DOJ releases and court filings. An indictment is an allegation; defendants are presumed innocent unless convicted.",
                         body, charts)
    return html_out, {"charged": charged, "convicted": conv, "reported": len(rep), "nine_billion": "Unresolved"}


def build_acc_omar(H):
    text = (ACC / "omar.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    secs = MD.sections(text)
    summary = next(l for t, l in secs if t.startswith("7."))
    quote = " ".join(x.strip()[1:].strip() for x in summary if x.strip().startswith(">"))
    status = re.search(r"\*\*Status: Unresolved \(no official finding\)\.\*\* (.+)", quote).group(1)
    verdict = ('<div class="answer-box"><p><span class="chip unresolved">Unresolved (no official finding)</span></p>'
               f'<p><b>Claim:</b> Rep. Ilhan Omar married her brother in 2009 to commit immigration fraud.</p><p>{md.inline(status)}</p></div>')
    parts = []
    for t, lines in secs:
        if not t or t.startswith(("7.", "URL check", "The claim")):
            continue
        if t.startswith("Verdict"):
            lines = [l for l in lines if not l.startswith("**Do not publish")]
            parts.append(section("om-verdict", "Why the status is Unresolved", md.render(lines, rep_sink=rep), primary=False)); continue
        if t.startswith("6."):
            continue  # statutes shown as context chips below
        if t.startswith(("2.", "5.")):
            for it in md._items(lines):
                rep.append(it)
            continue
        parts.append(section("om-" + t.split(".")[0], t, md.render(lines, rep_sink=rep), primary=t.startswith(("1.", "4."))))
    note = ('<p class="muted-note">Rep. Omar has denied the allegation. Her statements are quoted in the grey box below as reported by news outlets. '
            'Timeline note from the record: she says she naturalized in 2000, before the 2009 marriage, so that marriage could not have been a basis for her own naturalization.</p>')
    body = verdict + "".join(parts) + note + law_chips(H, "omar.md") + rep_box(H, rep, title="Reported only: her statements and claims made in news reports or advocacy")
    html_out = _acc_page(H, "accountability-omar.html", "Rep. Ilhan Omar: the 2009 Marriage Allegation",
                         "What the primary record shows about the allegation against Rep. Ilhan Omar: status Unresolved (no official finding).",
                         "No court, prosecutor, agency or ethics body has found that the allegation is true, and none has cleared it. This page separates what the record documents from what exists only in reporting.",
                         body)
    return html_out, {"label": "Unresolved (no official finding)", "reported": len(rep)}


def refugee_funding_section(H):
    L = H.src_link
    CJ23 = "https://acf.gov/sites/default/files/documents/olab/fy-2023-congressional-justification.pdf"
    CJ24 = "https://acf.gov/sites/default/files/documents/olab/fy-2024-congressional-justification.pdf"
    CJ25 = "https://acf.gov/sites/default/files/documents/olab/fy-2025-congressional-justification.pdf"
    OIG = "https://www.oig.dhs.gov/sites/default/files/assets/2026-04/OIG-26-04-Apr26.pdf"
    rows = [
        ("HHS Office of Refugee Resettlement (Refugee & Entrant Assistance), budget authority", "FY2021", "$2,221,731,150 final appropriation, plus $1,913,483,405 FY2021 supplemental", L(CJ23, "ACF FY2023 Congressional Justification, p. 40")),
        ("", "FY2022", "$8,925,214,000 final", L(CJ24, "ACF FY2024 Congressional Justification, p. 43")),
        ("", "FY2023", "$10,608,154,000 final", L(CJ25, "ACF FY2025 Congressional Justification, p. 45")),
        ("", "FY2024", "$6,427,214,000 (continuing-resolution level shown in the FY2025 request)", L(CJ25, "ACF FY2025 Congressional Justification, p. 45")),
        ("HHS Ukraine supplemental appropriations", "FY2022\u201324", "$3.78 billion; about 259,000 Ukrainians paroled, about 135,000 of whom received ORR assistance", L("https://www.gao.gov/products/gao-26-107815", "GAO-26-107815")),
        ("FEMA shelter grants for released noncitizens (EFSP-H and the Shelter and Services Program)", "FY2023\u201324", "Nearly $1.4 billion awarded (as of Sep 30, 2024): $425 million to the National Board for EFSP-H (FY2023) and about $1 billion to 84 non-federal entities under SSP", L(OIG, "DHS OIG-26-04, Apr 22, 2026")),
        ("", "Audit result", "The OIG questioned $425 million in EFSP-H costs and $16.5 million in SSP costs and found FEMA did not verify against duplicate funding. DHS terminated the SSP awards. Questioned costs are an audit finding, not a finding of fraud.", L(OIG, "DHS OIG-26-04")),
        ("State Department refugee processing and resettlement funding", "FY2024 / FY2025", "$2.8 billion (FY2024); $5.1 billion estimated (FY2025)", L("https://www.state.gov/wp-content/uploads/2024/10/Report-Proposed-Refugee-Admissions-for-FY25.pdf", "Report to Congress on Proposed Refugee Admissions for FY2025")),
        ("CBO projection: 2021\u20132026 immigration surge (8.7 million people)", "2024\u20132034", "Adds $1.2 trillion in revenues and $0.3 trillion in outlays (mandatory spending and interest); net deficit reduction $0.9 trillion. A projection, not an accounting of spending.", L("https://www.cbo.gov/publication/60165", "CBO, July 2024")),
        ("New York City shelter for asylum seekers", "FY2024", "Hotel Association of NYC contract averaged $156 per room per night; emergency hotel shelter including services averaged $332 per day", L("https://comptroller.nyc.gov/reports/comparing-per-diem-hotel-and-service-costs-for-shelter-for-asylum-seekers/", "NYC Comptroller")),
    ]
    trs = "".join(f'<tr><td data-l="Program">{e(a)}</td><td data-l="Period">{e(b)}</td><td data-l="Amount (as published)">{e(c)}</td><td data-l="Primary source">{d}</td></tr>' for a, b, c, d in rows)
    inner = ('<p>Amounts exactly as published by the agency or office named. Figures come from different programs, levels of government and fiscal years and are not added together. ORR budget authority covers all ORR programs (refugees, unaccompanied children, Cuban/Haitian entrants, Afghan and Ukrainian parolees), not parole alone.</p>'
             f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Program</th><th>Period</th><th>Amount (as published)</th><th>Primary source</th></tr></thead><tbody>{trs}</tbody></table></div>')
    return section("cb-funding", "Taxpayer funding: refugees, parole and shelter", inner), len(rows)



def build_acc_covid(H):
    text = (ACC / "covid-border.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    months = re.findall(r"^\| ([A-Z][a-z]{2} \d{4}) \| ([\d,]+) \| ([\d,]+) \| ([\d,]+) \|", text, re.M)
    fy = dict(re.findall(r"FY(\d{4}) ([\d,]{7,})", text.split("**Fiscal-year totals")[1].split("\n")[0]))
    t42 = num_md(text, r"([\d,]+) in total \(FY2020", int)
    i = lambda s: int(s.replace(",", ""))
    charts = [{"id": "chart-cbp", "type": "bar", "labels": [m[0] for m in months],
               "datasets": [{"label": "Title 8", "data": [i(m[2]) for m in months], "color": "#16325c"}, {"label": "Title 42 expulsions", "data": [i(m[3]) for m in months], "color": "#b45309"}]}]
    tiles = [H.tile(f"{i(fy['2020']):,}", "Southwest border encounters, FY2020", "CBP; encounters are events, not people", count=i(fy["2020"])),
             H.tile(f"{i(fy['2021']):,}", "FY2021", "", count=i(fy["2021"])),
             H.tile(f"{i(fy['2022']):,}", "FY2022", "", count=i(fy["2022"])),
             H.tile(f"{i(fy['2023']):,}", "FY2023", "", count=i(fy["2023"])),
             H.tile(f"{t42:,}", "Title 42 expulsions, Mar 2020 – May 2023", "Repeat attempts counted each time", accent=True, count=t42)]
    parts = []
    for t, lines in MD.sections(text):
        if not t:
            continue
        if t.startswith("2."):
            # the monthly table is shown as the chart; keep totals and caveats
            keep = [l for l in lines if not re.match(r"^\| ", l)]
            r = H.chart_card("chart-cbp", "Southwest land border encounters by month, Jan 2020 – Dec 2022", "CBP; Title 8 (apprehensions + inadmissibles) and Title 42 expulsions", tall=True) + md.render(keep, rep_sink=rep)
        else:
            r = md.render(lines, rep_sink=rep)
        parts.append(section("cb-" + t.split(".")[0], t, r))
    fund_html, n_fund = refugee_funding_section(H)
    body = f'<div class="tile-grid">{"".join(tiles)}</div>' + "".join(parts) + fund_html + law_chips(H, "covid-border.md") + rep_box(H, rep)
    html_out = _acc_page(H, "accountability-covid-border.html", "COVID-19 and the Border: Orders, Title 42 and the Record",
                         "COVID-era orders, CBP encounters and Title 42 expulsions, official COVID-origin assessments and claim checks.",
                         "Federal and state orders, CBP encounter data, official origin assessments and COVID-era claims checked against later official records.",
                         body, charts)
    return html_out, {"months": len(months), "title42_total": t42, "reported": len(rep), "funding_rows": n_fund}


def build_acc_hub(H):
    cards = [("accountability-fraud.html", "Waste, Fraud & Abuse", "Improper payments ($186B in FY2025), GAO's $233–521B fraud estimate, IG and DOJ recoveries, pandemic fraud, and GAO's audit of DOGE's savings claims. No grand total, and the page explains why."),
             ("accountability-trading.html", "Congressional Stock Trading", "12,646 disclosed trades in 2025–26 from official filings, top traders, 2,795 late-filed lines, and the only two members ever convicted of insider trading."),
             ("accountability-minnesota.html", "Minnesota Program Fraud", "108 federal defendants, 75 convicted per DOJ, about $375M alleged. Money abroad: Proven (Kenya). Somalia and al-Shabaab: Unresolved."),
             ("accountability-omar.html", "Rep. Omar: the 2009 Marriage Allegation", "Status: Unresolved (no official finding). What the 2019 campaign-finance order documents, and what exists only in reporting."),
             ("accountability-covid-border.html", "COVID-19 and the Border", "Orders and court rulings, CBP encounters and Title 42 expulsions by month, official origin assessments, and COVID-era claims checked.")]
    grid = "".join(f'<a class="card acc-card" href="{h}"><div class="card-body"><h3>{e(t)}</h3><p>{e(d)}</p><div class="chip-row"><span class="chip">Open tracker</span></div></div></a>' for h, t, d in cards)
    body = (head("Accountability", "Accountability Trackers", "Five running trackers built from primary records: government audits and datasets, court filings, official disclosures and official statements.", sub_nav("accountability.html"))
            + legend() + f'<div class="cards acc-cards">{grid}</div>'
            + '<div class="answer-box"><p><b>How to read the numbers.</b> Improper payments, fraud estimates, enforcement recoveries and savings claims measure different things and overlap, so they are never added into one "fraud total." Amounts in criminal cases are the prosecutors\' alleged figures unless a conviction covers them. Where a claim has no official finding either way, the label is Unresolved (no official finding).</p></div>'
            + reader_path([("trump-watch.html", "Trump Accountability Watch"), ("energy.html", "Energy"), ("voters.html", "Voters & Population")]))
    return H.page("accountability.html", "Accountability Trackers · Swamp Force", "Running accountability trackers built from primary records.", body, serious=True), {"trackers": len(cards)}


# ───────────────────────── registry (appended to watch.SECTIONS) ─────────────────────────
def _acc(name):
    return ACC / name


SECTIONS2 = [
    Section("accountability.html", "Accountability trackers", "Fraud tally, trading, Minnesota, Omar, COVID & border",
            [_acc("fraud-tally.md"), _acc("trading.md"), _acc("minnesota-fraud.md"), _acc("omar.md"), _acc("covid-border.md"), _acc("uscode-map.csv")], build_acc_hub),
    Section("accountability-fraud.html", "Waste, Fraud & Abuse", "", [_acc("fraud-tally.md"), _acc("uscode-map.csv")], build_acc_fraud, in_menu=False),
    Section("accountability-trading.html", "Congressional Trading", "", [_acc("trading.md"), _acc("uscode-map.csv")], build_acc_trading, in_menu=False),
    Section("accountability-minnesota.html", "Minnesota Fraud", "", [_acc("minnesota-fraud.md"), _acc("uscode-map.csv")], build_acc_minnesota, in_menu=False),
    Section("accountability-omar.html", "Omar Allegation", "", [_acc("omar.md"), _acc("uscode-map.csv")], build_acc_omar, in_menu=False),
    Section("accountability-covid-border.html", "COVID & the Border", "", [_acc("covid-border.md"), _acc("uscode-map.csv")], build_acc_covid, in_menu=False),
]


# ───────────────────────── Energy ─────────────────────────
def _copy_img(src, dst_name, width=1200):
    from PIL import Image
    d = OUT / "images" / "energy"; d.mkdir(parents=True, exist_ok=True)
    out = d / dst_name
    if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src)
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(out, optimize=True)
    return f"images/energy/{dst_name}"


def _fig(src, alt, cap):
    return f'<figure class="watch-fig"><img src="{src}" alt="{e(alt)}" loading="lazy" width="1200"><figcaption>{cap}</figcaption></figure>'


IAEA = "https://www.iaea.org/sites/default/files/documents/{}.pdf"
JCPOA_TEXT = "https://2009-2017.state.gov/documents/organization/245317.pdf"
CPI_ROWS = [  # BLS CPI-U, U.S. city average, all items, not seasonally adjusted (CUUR0000SA0), January of inauguration year
    ("George W. Bush", "Jan 2001 \u2013 Jan 2009 (8 yrs)", 175.100, 211.143, 8.0, "R 2001\u201307; D 2007\u201309", "50\u201350 in 2001 (control changed twice), D 2001\u201303, R 2003\u201307, D 2007\u201309"),
    ("Barack Obama", "Jan 2009 \u2013 Jan 2017 (8 yrs)", 211.143, 242.839, 8.0, "D 2009\u201311; R 2011\u201317", "D 2009\u201315; R 2015\u201317"),
    ("Donald Trump (1st term)", "Jan 2017 \u2013 Jan 2021 (4 yrs)", 242.839, 261.582, 4.0, "R 2017\u201319; D 2019\u201321", "R 2017\u201321"),
    ("Joe Biden", "Jan 2021 \u2013 Jan 2025 (4 yrs)", 261.582, 317.671, 4.0, "D 2021\u201323; R 2023\u201325", "D 2021\u201325 (50\u201350 with VP tiebreak 2021\u201323)"),
    ("Donald Trump (2nd term, partial)*", "Jan 2025 \u2013 Aug 2026 (19 mo)", 317.671, 334.980, 19 / 12, "R 2025\u2013", "R 2025\u2013"),
]


def inflation_section(H):
    rows, labels, vals = [], [], []
    for who, term, a, b, yrs, house, senate in CPI_ROWS:
        cum = b / a - 1; ann = (b / a) ** (1 / yrs) - 1
        labels.append(who.replace(" (2nd term, partial)*", " II*").replace(" (1st term)", " I")); vals.append(round(cum * 100, 1))
        rows.append(f'<tr><td data-l="President">{e(who)}</td><td data-l="Term">{e(term)}</td><td data-l="CPI-U start \u2192 end">{a:.3f} \u2192 {b:.3f}</td>'
                    f'<td data-l="Cumulative">{cum * 100:.1f}%</td><td data-l="Average annual">{ann * 100:.1f}%</td><td data-l="House">{e(house)}</td><td data-l="Senate">{e(senate)}</td></tr>')
    chart = {"id": "chart-cpi-pres", "type": "bar", "labels": labels, "data": vals, "colors": ["#16325c"] * 4 + ["#b45309"], "fmt": "pct"}
    tbl = ('<div class="table-wrap"><table class="watch-table"><thead><tr><th>President</th><th>Term measured</th><th>CPI-U start \u2192 end</th><th>Cumulative change</th><th>Average annual</th><th>House majority</th><th>Senate majority</th></tr></thead>'
           f'<tbody>{"".join(rows)}</tbody></table></div>')
    inner = ('<p>Consumer prices (CPI-U, all items, U.S. city average, not seasonally adjusted) from each inauguration month to the next. Only the price index is shown; no cause is assigned to any president or Congress.</p>'
             + H.chart_card("chart-cpi-pres", "Cumulative CPI-U change by presidential term (%)", "Inauguration month to next inauguration month; last bar is a partial term")
             + tbl
             + '<p class="muted-note">* Partial term: January 2025 to August 2026, the latest month published. Its cumulative figure is not comparable with completed four- and eight-year terms; its average annual rate is annualized from 19 months. '
               'Average annual = compound rate over the term. Majorities are by Congress; the 2001 Senate was split 50\u201350 and changed control in January and June 2001.</p>'
             + src_line(H, [("BLS CPI-U series CUUR0000SA0", "https://data.bls.gov/timeseries/CUUR0000SA0"), ("Senate party division", "https://www.senate.gov/history/partydiv.htm"),
                            ("House party divisions", "https://history.house.gov/Institution/Party-Divisions/Party-Divisions/")]))
    return section("en-cpi", "Consumer prices by presidential term", inner), chart


def iaea_section(H):
    I = lambda d, lbl=None: H.src_link(IAEA.format(d), lbl or d.upper().replace("GOVINF", "GOV/INF/").replace("GOV-INF-", "GOV/INF/").replace("GOV", "GOV/").replace("//", "/").replace("-", "/"))
    rows = [
        ("Feb 2007", "Natanz Fuel Enrichment Plant put into operation.", "", I("gov2010-10", "GOV/2010/10")),
        ("21 Sep 2009", "Iran informs the IAEA of a new enrichment plant near Qom (Fordow).", "", I("gov2009-74", "GOV/2009/74")),
        ("22 Nov 2009", "Inventory verification: 21,140 kg natural UF6 fed since Feb 2007; 1,808 kg low-enriched UF6 produced.", "Up to 3.47%", I("gov2010-10", "GOV/2010/10")),
        ("9\u201310 Feb 2010", "Feeding of low-enriched UF6 begins at the Natanz pilot plant to produce UF6 enriched up to 20%; inspectors arriving 10 Feb are told feeding began the previous evening.", "Up to 20%", I("gov2010-10", "GOV/2010/10")),
        ("May 2013", "Total produced since 2007: 8,960 kg UF6 up to 5% and 324 kg UF6 up to 20%.", "Up to 5% / 20%", I("gov2013-27", "GOV/2013/27")),
        ("16 Jan 2016", "JCPOA Implementation Day: IAEA verifies Iran is not enriching above 3.67% and holds no more than 300 kg UF6 enriched up to 3.67% (equal to 202.8 kg of uranium).", "\u2264 3.67%", I("gov-inf-2016-1", "GOV/INF/2016/1") + " " + I("gov2018-47", "GOV/2018/47 (conversion)")),
        ("Nov 2018", "Stockpile 149.4 kg uranium, under the cap.", "\u2264 3.67%", I("gov2018-47", "GOV/2018/47")),
        ("May 2019", "Stockpile 174.1 kg uranium, under the cap.", "\u2264 3.67%", I("gov2019-21", "GOV/2019/21")),
        ("1 Jul 2019", "IAEA verifies the stockpile at 205.0 kg uranium, exceeding the 202.8 kg JCPOA limit.", "\u2264 3.67%", I("govinf2019-8", "GOV/INF/2019/8")),
        ("8 Jul 2019", "IAEA verifies enrichment above 3.67%; Iran states about 4.5%.", "~4.5% (Iran\u2019s figure)", I("govinf2019-9", "GOV/INF/2019/9")),
        ("4 Jan 2021", "Enrichment up to 20% resumes.", "Up to 20%", I("gov2021-39", "GOV/2021/39")),
        ("23 Feb 2021", "Iran stops implementing its JCPOA commitments altogether, including the Additional Protocol; many IAEA verification and monitoring activities end.", "", I("gov2021-10", "GOV/2021/10") + " " + I("gov2025-50", "GOV/2025/50 \u00b66")),
        ("17 Apr 2021", "Production of UF6 enriched up to 60% begins at the Natanz pilot plant (Iran declared 55.3% for the first product).", "Up to 60%", I("govinf2021-28", "GOV/INF/2021/28")),
        ("30 Aug 2021", "Total enriched stockpile 2,441.3 kg, including 10.0 kg up to 60%.", "Up to 60%", I("gov2021-39", "GOV/2021/39")),
        ("Jun 2022", "Iran removes all IAEA JCPOA-related surveillance and monitoring equipment; the IAEA says continuity of knowledge on centrifuges, heavy water and ore concentrate cannot be restored.", "", I("gov2025-50", "GOV/2025/50 \u00b67")),
        ("13 May 2023", "Total enriched stockpile 4,744.5 kg, including 114.1 kg up to 60%.", "Up to 60%", I("gov2023-24", "GOV/2023/24")),
        ("12 Jun 2025", "IAEA Board of Governors resolution finds Iran in non-compliance with its safeguards obligations.", "", I("gov2025-38", "GOV/2025/38")),
        ("13 Jun 2025", "IAEA estimate: total enriched stockpile 9,874.9 kg, including 440.9 kg up to 60% (432.9 kg of it verified). Military attacks on Iranian nuclear facilities took place 13\u201324 June.", "Up to 60%", I("gov2025-50", "GOV/2025/50")),
        ("Since 13 Jun 2025", "No IAEA access to any safeguarded nuclear facility in Iran except the Bushehr power plant; inspectors withdrawn by end of June; Iran\u2019s law suspending cooperation enacted 2 Jul 2025.", "", I("gov2025-50", "GOV/2025/50")),
    ]
    trs = "".join(f'<tr><td data-l="Date">{e(d)}</td><td data-l="What the IAEA recorded">{e(t)}</td><td data-l="Enrichment level">{e(lv) or "\u2014"}</td><td data-l="IAEA report">{src}</td></tr>' for d, t, lv, src in rows)
    rep = [("Joint Plan of Action (interim deal) took effect 20 Jan 2014; the IAEA report on it (GOV/INF/2014/1) could not be retrieved from iaea.org.", "", "Lead"),
           ("Oct 26, 2024: stockpile of 6,604.4 kg including 182.3 kg up to 60%, per a confidential IAEA report (GOV/2024/61) as reported by CNN; the report is not posted on iaea.org.", "https://www.cnn.com/2024/11/19/middleeast/iran-nuclear-enrichment-intl-latam", "CNN"),
           ("Reimposition of UN sanctions (\u201csnapback\u201d) in September 2025 is disputed between the parties; not confirmed here from a primary UN record.", "", "Lead")]
    inner = ('<p>Dates, enrichment levels, stockpile amounts and inspector access as recorded in IAEA Director General reports to the Board of Governors. Amounts are in kg of uranium unless stated as UF6 (uranium hexafluoride). '
             f'The 2015 nuclear deal: {H.src_link(JCPOA_TEXT, "Joint Comprehensive Plan of Action, official text (State Department archive)")}. '
             f'The United States ceased participation on 8 May 2018 ({H.src_link("https://trumpwhitehouse.archives.gov/presidential-actions/ceasing-u-s-participation-jcpoa-taking-additional-action-counter-irans-malign-influence-deny-iran-paths-nuclear-weapon/", "presidential memorandum")}). '
             f'UN Security Council Resolution 2231 endorsed the deal and set Termination Day ten years after Adoption Day (18 Oct 2025) ({H.src_link("https://undocs.org/S/RES/2231(2015)", "S/RES/2231 (2015)")}).</p>'
             f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Date</th><th>What the IAEA recorded</th><th>Enrichment level (U-235)</th><th>IAEA report</th></tr></thead><tbody>{trs}</tbody></table></div>'
             + rep_box(H, rep, title="Reported, not confirmed by primary record: Iran enrichment items"))
    return section("ir-iaea", "Iran enrichment: IAEA timeline, 2007\u20132025", inner), len(rows)



def build_energy(H):
    og = (EN / "oil-vs-gas.md").read_text(encoding="utf-8")
    ir = (EN / "iran-energy.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    imgs = {k: _copy_img(EN / "charts" / f"{k}.png", f"{k}.png") for k in
            ["oil-vs-gas-components-2008-vs-2026", "oil-vs-gas-crude-vs-retail-2005-2026", "oil-vs-gas-gasoline-crack-spread-2005-2026", "iran-energy-prices-2026"]}
    now = num_md(og, r"regular gasoline was \*\*\$([\d.]+)/gal\*\* on \*\*Sep 21, 2026\*\*", float)
    peak = num_md(og, r"The July 2008 peak was \*\*\$([\d.]+)\*\*", float)
    real = num_md(og, r"equals about \*\*\$([\d.]+) in 2026 dollars\*\*", float)
    comp = re.findall(r"^\| (Crude oil|Refining costs & profits|Distribution & marketing[^|]*|Taxes) \| [\d.]+¢ \| [\d.]+¢ \| \*\*([−+][\d.]+)¢\*\* \|", og, re.M)
    if len(comp) != 4:
        raise SystemExit("energy: components table not parsed")
    val = lambda s: float(s.replace("−", "-"))
    refining = next(val(v) for k, v in comp if k.startswith("Refining"))
    q2 = re.search(r"\*\*Three combined\*\* \|.*?\*\*([\d.]+)\*\* \| [\d.]+ \| \*\*([\d.]+)\*\* \|", og)
    q2_25, q2_26 = float(q2.group(1)), float(q2.group(2))
    spr = num_md(ir, r"SPR stocks, Sep 18, 2026 \| \*\*([\d.]+)M bbl\*\*", float)
    caveat = re.search(r"^Caveat: the crude slice.+$", og, re.M).group(0)
    charts = [{"id": "chart-comp", "type": "bar", "labels": ["Crude oil", "Refining costs & profits", "Distribution & marketing", "Taxes"],
               "data": [val(v) for _, v in comp], "colors": ["#57534e", "#b91c1c", "#1e3a5f", "#7c2d12"]}]
    tiles = [H.tile(f"${now:.3f}", "U.S. regular gasoline, Sep 21, 2026", f"July 2008 peak: ${peak:.3f} (nominal)", src=H.src_link("https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EMM_EPMR_PTE_NUS_DPG&f=W", "EIA")),
             H.tile(f"≈${real:.2f}", "The 2008 peak in 2026 dollars", "BLS CPI-U; gas is about 29% cheaper after inflation", src=H.src_link("https://data.bls.gov/timeseries/CUUR0000SA0", "BLS")),
             H.tile(f"+{refining:.1f}¢", "Refiners' share per gallon, Jul 2008 → May 2026", "Crude share fell 75.4¢; refining grew more than that", accent=True, src=H.src_link("https://www.eia.gov/petroleum/gasdiesel/gaspump_hist.php", "EIA pump components")),
             H.tile(f"${q2_26:.1f}B", "Valero + Marathon + Phillips 66 net income, Q2 2026", f"vs ${q2_25:.1f}B in Q2 2025 (SEC 10-Qs)", src=H.src_link("https://www.sec.gov/Archives/edgar/data/1035002/000162828026050937/", "SEC")),
             H.tile(f"{spr:.1f}M bbl", "Strategic Petroleum Reserve, Sep 18, 2026", "Lowest since late 1982", src=H.src_link("https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=WCSSTUS1&f=W", "EIA"))]
    # section 1: the plain-English answer, split at its bold numbered points
    pe = next(l for t, l in MD.sections(og) if t.startswith("Plain-English"))
    blocks, cur = [], None
    for line in pe:
        m = re.match(r"^\*\*(\d)\. (.+?)\*\*(.*)$", line) or (re.match(r"^\*\*(Bottom line)\*\*()(.*)$", line))
        if m:
            cur = [m.group(1), m.group(2) if m.group(1)[0].isdigit() else "", [m.group(3)]]; blocks.append(cur); continue
        if cur:
            cur[2].append(line)
    titles = {"1": "Nominal vs. real: is gas really more expensive?", "2": "Where the extra money per gallon went", "3": "Why the refining slice is so large now: five structural causes",
              "4": "Refiner profits (SEC filings)", "5": "\"Rockets and feathers\"", "6": "Documented wrongdoing: official findings only", "Bottom line": "Bottom line"}
    s1 = []
    for no, t, lines in blocks:
        inner = md.render([l for l in lines if l.strip()], rep_sink=rep)
        if no == "2":
            inner = H.chart_card("chart-comp", "Change per gallon, July 2008 → May 2026 (cents)", "EIA gasoline pump components; refining is the largest change") + inner + f'<p class="muted-note">{md.inline(caveat)}</p>'
            inner += _fig(imgs["oil-vs-gas-components-2008-vs-2026"], "Stacked bars of the pump-price components, July 2008 vs May 2026", "EIA pump components, July 2008 (nominal and 2026 dollars) vs May 2026.")
        if no == "3":
            inner += _fig(imgs["oil-vs-gas-gasoline-crack-spread-2005-2026"], "Gasoline crack spread 2005–2026", "Gulf Coast gasoline minus Brent, computed from EIA daily spot prices.")
        if no == "1":
            inner += _fig(imgs["oil-vs-gas-crude-vs-retail-2005-2026"], "Crude oil vs retail gasoline 2005–2026", "EIA crude and retail gasoline prices, 2005–2026.")
        if no == "6":
            s1.append(f'<div class="wrong-box"><h3 class="watch-h3">{e(titles[no])} {stamp()}</h3>{inner}<p class="law-note">Kept separate from the structural causes above. A settlement is not a finding of wrongdoing; the Vitol/SK case settled without proof at trial.</p></div>')
            continue
        s1.append(f'<h3 class="watch-h3">{e(titles.get(no, t))}</h3>{inner}')
    data = next(l for t, l in MD.sections(og) if t.startswith("Data tables"))
    s1.append(src_line(H, [("EIA pump components", "https://www.eia.gov/petroleum/gasdiesel/gaspump_hist.php"), ("EIA method", "https://www.eia.gov/petroleum/gasdiesel/pump_methodology.php"),
                           ("EIA weekly retail price", "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EMM_EPMR_PTE_NUS_DPG&f=W"), ("BLS CPI-U", "https://data.bls.gov/timeseries/CUUR0000SA0"),
                           ("EIA refinery capacity", "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=8_NA_8D0_NUS_5&f=A")]))
    s1_html = section("en-gas", "Oil at $145 in 2008, gas at $4.11: why gas costs more today with crude much lower", "".join(s1))
    data_html = section("en-data", "Data tables and sources", f'<details class="watch-details"><summary>Prices, components, crack spreads, capacity, profits, taxes, exports and official investigations</summary>{md.render(data, rep_sink=rep)}</details>')
    s2 = []
    for t, lines in MD.sections(ir):
        if not t or t == "Files":
            continue
        s2.append(section("ir-" + (t.split(".")[0] if t[0].isdigit() else "summary"), ("Iran and fuel prices: " if not t[0].isdigit() else "") + (t if t[0].isdigit() else "plain-English summary"),
                          (_fig(imgs["iran-energy-prices-2026"], "Oil and gasoline prices, Nov 2025 – Sep 2026", "Brent, WTI and U.S. gasoline with the war start (Feb 28, 2026) and key events marked. EIA data.") if not t[0].isdigit() else "") + md.render(lines, rep_sink=rep)))
    cpi_html, cpi_chart = inflation_section(H); charts.append(cpi_chart)
    iaea_html, n_iaea = iaea_section(H)
    body = (head("Watch", "Energy: Gas Prices, Refiners and the Iran War",
                 "Why gas costs more than at the 2008 peak even with cheaper crude, where each dollar at the pump goes, and how the 2026 U.S.–Iran conflict moved prices, from EIA, BLS, SEC, Treasury, DOE and regulator records.")
            + legend() + toc([("en-gas", "Gas vs. oil"), ("en-data", "Data tables"), ("en-cpi", "CPI by term"), ("ir-summary", "Iran summary"), ("ir-1", "Timeline"), ("ir-2", "Prices"), ("ir-3", "Hormuz"), ("ir-7", "SPR"), ("ir-iaea", "IAEA enrichment")])
            + f'<div class="tile-grid">{"".join(tiles)}</div>' + s1_html + data_html + cpi_html + "".join(s2) + iaea_html + rep_box(H, rep)
            + reader_path([("gas-gap.html", "Gas Price Gap Tracker"), ("accountability.html", "Accountability trackers"), ("about.html", "Methodology")]))
    html_out = H.page("energy.html", "Energy: Gas Prices, Refiners and the Iran War · Swamp Force",
                      "Gas vs. oil prices since 2008, pump-price components, refiner profits, official findings, and the 2026 U.S.–Iran conflict's effect on fuel.", body, charts=charts, serious=True)
    return html_out, {"gas_now": now, "peak_2008": peak, "peak_real_2026": real, "refining_change_cents": refining, "refiner_q2_2026_b": q2_26, "spr_mbbl": spr, "images": len(imgs), "reported": len(rep), "iaea_rows": n_iaea, "cpi_rows": len(CPI_ROWS)}

SECTIONS2.append(Section("energy.html", "Energy", "Gas vs. oil, refiners, the Iran war", [EN / "oil-vs-gas.md", EN / "iran-energy.md", EN / "charts"], build_energy))


# ───────────────────────── Voters & Population ─────────────────────────
PENDING = '<span class="chip pending">Pending source check</span>'


def _xl():
    import openpyxl
    wb = openpyxl.load_workbook(PV / "population-voters.xlsx", data_only=True)
    def rows(name):
        ws = wb[name]; it = ws.iter_rows(values_only=True); hdr = [str(h) if h is not None else "" for h in next(it)]
        return hdr, [list(r) for r in it]
    return rows


def _n(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def _fmt(v):
    if isinstance(v, str):
        v = v.replace("CBO (per search index)", "CBO, as summarized by KFF (pending source check)")
    if isinstance(v, bool) or v is None:
        return "—"
    if isinstance(v, float) and not v.is_integer():
        return f"{v:,.1f}"
    if isinstance(v, (int, float)):
        return f"{int(v):,}"
    return str(v)


SCOTUS_SAVE = "https://www.supremecourt.gov/DocketPDF/26/26A308/423264/20260908101245314_DHS%20v%20League%20of%20Women%20Voters%20Stay%20Application.pdf"
DOJ_16 = "https://www.justice.gov/opa/pr/department-justice-charges-16-individuals-illegal-voting-and-related-election-crimes"
GA_AUDIT = "https://justthenews.com/sites/default/files/2024-10/FILE_7419.pdf"
HR22_TEXT = "https://www.congress.gov/bill/119th-congress/house-bill/22/text"
HR22_GPO = "https://www.govinfo.gov/content/pkg/BILLS-119hr22eh/html/BILLS-119hr22eh.htm"
USC611 = "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section611&num=0&edition=prelim"
USC1015 = "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section1015&num=0&edition=prelim"
NJ_0721 = "https://www.nj.gov/governor/news/2026/20260721a.shtml"
HICK_VERDICTS = {}


def hick_letter(H):
    """Sen. Hickenlooper constituent letter (Mar 20, 2026): redacted image + statement-by-statement check."""
    from PIL import Image
    src = WD / "hickenlooper-letter-2026-03-20-redacted.jpg"
    d = OUT / "images" / "voters"; d.mkdir(parents=True, exist_ok=True)
    out = d / "hickenlooper-save-act-letter-2026-03-20-redacted.jpg"
    if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src).convert("RGB")
        im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
        im.save(out, quality=85, optimize=True)
    L = H.src_link
    acc = '<span class="chip green">Accurate</span>'
    mis = '<span class="badge misleading">Rated misleading</span>'
    uns = '<span class="chip unresolved">Unsupported</span>'
    rows = [
        ("\u201cThe SAVE Act would require states to obtain proof of U.S. citizenship when individuals register to vote in a federal election.\u201d", acc, "Accurate",
         "H.R. 22 amends the NVRA: \u201cthe State shall not accept and process an application to register to vote in an election for Federal office unless the applicant presents documentary proof of United States citizenship with the application.\u201d It applies to new applications.",
         L(HR22_TEXT, "H.R. 22 text (congress.gov)") + " " + L(HR22_GPO, "engrossed text (GPO)")),
        ("\u201cIt would also require states to remove non-citizens from existing voter rolls.\u201d", acc, "Accurate",
         "New NVRA \u00a78(k): \u201cA State shall remove an individual who is not a citizen of the United States from the official list of eligible voters \u2026 at any time upon receipt of documentation or verified information that a registrant is not a United States citizen.\u201d",
         L(HR22_GPO, "H.R. 22 engrossed text")),
        ("\u201cState-issued driver\u2019s licenses wouldn\u2019t be sufficient for eligible voters to prove their citizenship.\u201d", acc, "Accurate",
         "The accepted documents include a REAL ID\u2013compliant ID \u201cthat indicates the applicant is a citizen of the United States,\u201d or a government photo ID \u201cshowing that the applicant\u2019s place of birth was in the United States.\u201d Any other government photo ID counts \u201conly if presented together with\u201d a birth certificate, naturalization certificate or similar record. A standard license that shows neither citizenship nor birthplace is therefore not enough by itself.",
         L(HR22_GPO, "H.R. 22 engrossed text")),
        ("\u201cThe bill would not give states any additional funding to implement these new restrictions.\u201d", acc, "Accurate",
         "The engrossed text contains no appropriation or authorization of appropriations. The only money provision bars federal agencies from charging states a fee for verification responses.",
         L(HR22_GPO, "H.R. 22 engrossed text")),
        ("\u201cNoncitizens voting in federal elections is already illegal and punishable under existing law.\u201d", acc, "Accurate",
         "18 U.S.C. 611 makes it unlawful for an alien to vote in a federal election (fine, up to 1 year). 18 U.S.C. 1015(f) punishes a false claim of citizenship to register or vote (fine, up to 5 years). Both have a narrow exception for a person raised in the U.S. by citizen parents who reasonably believed he or she was a citizen.",
         L(USC611, "18 U.S.C. 611") + " " + L(USC1015, "18 U.S.C. 1015")),
        ("\u201cIt\u2019s also incredibly rare for a noncitizen to even attempt to vote in U.S. elections.\u201d", acc, "Accurate",
         "Official counts are small next to rolls of millions. Georgia\u2019s 2024 citizenship audit \u201cconclusively\u201d found 20 noncitizens on its rolls, with 156 more needing review. DOJ announced charges against 16 people on Sep 18, 2026 (charges are accusations, not findings). DHS SAVE runs flagged 28,635 <i>potential</i> noncitizens among 65M+ records checked; flags are not confirmations. Limits: attempts cannot be measured directly, and no official national count exists.",
         L(GA_AUDIT, "Georgia SOS statement (copy)") + " " + L(DOJ_16, "DOJ 26-1082") + " " + L(SCOTUS_SAVE, "U.S. filing, No. 26A308")),
        ("\u201cEven if they did attempt to, we have protections in place to prevent them.\u201d", mis, "Rated misleading",
         "Protections exist: the federal registration form requires an attestation, signed under penalty of perjury, that the applicant meets each eligibility requirement including citizenship, and HAVA requires states to match a driver\u2019s license number or the last 4 SSN digits. But official records show they have not prevented every case: New Jersey says a Motor Vehicle Commission software error registered about 6,600 people who said they were not citizens, and about 340 of them voted; Georgia found 20 noncitizens already on its rolls.",
         L("https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title52-section20508&num=0&edition=prelim", "52 U.S.C. 20508") + " " + L("https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title52-section21083&num=0&edition=prelim", "52 U.S.C. 21083") + " " + L(NJ_0721, "NJ Governor, Jul 21, 2026") + " " + L(GA_AUDIT, "Georgia SOS statement (copy)")),
    ]
    HICK_VERDICTS.clear()
    for q, _, v, _, _ in rows:
        HICK_VERDICTS[q[1:40]] = v
    trs = "".join(f'<tr><td data-l="Statement">{e(q)}</td><td data-l="Label" style="white-space:nowrap">{b}</td><td data-l="What the record shows">{r} {s}</td></tr>' for q, b, _, r, s in rows)
    n_acc = sum(1 for r in rows if r[2] == "Accurate")
    html_ = (f'<div class="fact-box hick-box" id="hick-letter"><p class="fact-tag">{stamp()}</p>'
             f'<p><b>Sen. John Hickenlooper constituent letter on the SAVE Act (March 20, 2026).</b> {n_acc} of {len(rows)} factual statements Accurate; 1 Rated misleading. '
             'The bill checked is H.R. 22 (119th Congress), passed by the House Apr 10, 2025 and not enacted. The recipient\u2019s name is blurred.</p>'
             '<div class="hick-grid" style="display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:1.25rem;align-items:start">'
             '<figure class="watch-fig" style="margin:0"><a href="images/voters/hickenlooper-save-act-letter-2026-03-20-redacted.jpg">'
             '<img src="images/voters/hickenlooper-save-act-letter-2026-03-20-redacted.jpg" alt="Letter from Sen. John Hickenlooper dated March 20, 2026 about the SAVE Act; recipient name blurred" loading="lazy" width="900" style="width:100%;height:auto;border:1px solid #d6d3d1"></a>'
             '<figcaption>The letter as received (recipient name blurred). Click to enlarge.</figcaption></figure>'
             f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Statement in the letter</th><th>Label</th><th>What the record shows</th></tr></thead><tbody>{trs}</tbody></table></div>'
             '</div><style>@media(max-width:760px){.hick-grid{grid-template-columns:1fr!important}}</style></div>')
    return html_, n_acc



def build_voters(H):
    rows = _xl()
    mh, main = rows("Main annual")
    col = {h: i for i, h in enumerate(mh)}
    def series(name, years=None, scale=1):
        out = []
        for r in main:
            y = r[0]
            if not isinstance(y, int) or (years and y not in years):
                continue
            v = _n(r[col[name]])
            out.append((y, v * scale if v is not None else None))
        return out
    acs_c = [(y, v) for y, v in series("ACS US citizens (B05001)") if v and y not in (2005, 2020)]
    acs_n = dict(series("ACS noncitizens (B05001)"))
    eavs = [(y, v) for y, v in series("EAVS registered voters, total (as published)") if v]
    cps = dict(series("CPS registered citizens (thousands)", scale=1000))
    rem = [(y, v) for y, v in series("EAVS removals total") if v]
    newv = dict(series("EAVS new valid registrations (exact)"))
    nat = [(y, v) for y, v in series("DHS persons naturalized (FY)") if v]
    births = [(y, v) for y, v in series("CDC births") if v]
    deaths = dict(series("CDC deaths"))
    last = next(r for r in main if r[0] == 2024)
    charts = [
        {"id": "chart-cit", "type": "bar", "labels": [str(y) for y, _ in acs_c],
         "datasets": [{"label": "U.S. citizens", "data": [v for _, v in acs_c], "color": "#16325c"}, {"label": "Noncitizens", "data": [acs_n[y] for y, _ in acs_c], "color": "#b45309"}]},
        {"id": "chart-reg", "type": "bar", "labels": [str(y) for y, _ in eavs if cps.get(y)],
         "datasets": [{"label": "EAVS registrations (state records, incl. inactive)", "data": [v for y, v in eavs if cps.get(y)], "color": "#16325c"},
                      {"label": "CPS self-reported registered citizens", "data": [cps[y] for y, _ in eavs if cps.get(y)], "color": "#57534e"}]},
        {"id": "chart-rem", "type": "bar", "labels": [str(y) for y, _ in rem],
         "datasets": [{"label": "Removed from rolls", "data": [v for _, v in rem], "color": "#7c2d12"}, {"label": "New valid registrations", "data": [newv.get(y) for y, _ in rem], "color": "#14532d"}]},
        {"id": "chart-nat", "type": "bar", "labels": [f"FY{y}" for y, _ in nat], "data": [v for _, v in nat], "colors": ["#1e3a5f"] * len(nat)},
        {"id": "chart-bd", "type": "bar", "labels": [str(y) for y, _ in births],
         "datasets": [{"label": "Births", "data": [v for _, v in births], "color": "#0f766e"}, {"label": "Deaths", "data": [deaths.get(y) for y, _ in births], "color": "#57534e"}]},
    ]
    ch, co = rows("Colorado")
    cc = {h: i for i, h in enumerate(ch)}
    co_reg = [(r[0], r[cc["EAVS registered total"]]) for r in co if isinstance(r[0], int) and _n(r[cc["EAVS registered total"]])]
    charts.append({"id": "chart-co", "type": "bar", "labels": [str(y) for y, _ in co_reg], "data": [v for _, v in co_reg], "colors": ["#16325c"] * len(co_reg)})
    tiles = [H.tile(f"{last[col['ACS US citizens (B05001)']] / 1e6:.1f}M", "U.S. citizens, 2024 (ACS)", f"Noncitizens: {last[col['ACS noncitizens (B05001)']] / 1e6:.1f}M", src=H.src_link("https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/1YRData/acsdt1y2024-b05001.dat", "Census ACS")),
             H.tile(f"{last[col['EAVS registered voters, total (as published)']] / 1e6:.1f}M", "Registrations on state rolls, 2024", "EAVS; includes inactive records", src=H.src_link("https://www.eac.gov/sites/default/files/2025-07/2024_EAVS_Report_508.pdf", "EAC EAVS 2024")),
             H.tile(f"{last[col['EAVS removals total']] / 1e6:.1f}M", "Removed from rolls, 2022–24 cycle", "Mostly moves, deaths and unanswered notices", src=H.src_link("https://www.eac.gov/sites/default/files/2025-07/2024_EAVS_Report_508.pdf", "EAC")),
             H.tile(f"{last[col['DHS persons naturalized (FY)']]:,}", "Persons naturalized, FY2024", "DHS Yearbook", src=H.src_link("https://ohss.dhs.gov/system/files/2026-06/2026_0604_ohss_yearbook_naturalizations_fy2024.xlsx", "DHS OHSS")),
             H.tile("28,635", "Potential noncitizens flagged by DHS SAVE", "Government figure in a court filing; 65M+ voters checked in 26 states; flags are not confirmations", accent=True, src=H.src_link(SCOTUS_SAVE, "U.S. stay application, No. 26A308"))]
    # raw table
    keep = [("Year", "Year"), ("PEP total resident population (July 1)", "PEP population"), ("ACS US citizens (B05001)", "ACS citizens"), ("ACS noncitizens (B05001)", "ACS noncitizens"),
            ("ACS CVAP (citizens 18+, B29001/B05003)", "CVAP"), ("EAVS registered voters, total (as published)", "EAVS registered"), ("CPS registered citizens (thousands)", "CPS registered (thous.)"),
            ("DHS persons naturalized (FY)", "Naturalized (FY)"), ("EAVS removals total", "EAVS removals"), ("SSA SSNs issued (thousands)", "SSNs issued (thous.)"),
            ("CDC births", "Births*"), ("CDC deaths", "Deaths*")]
    thr = "".join(f"<th>{e(lbl)}</th>" for _, lbl in keep)
    trs = "".join("<tr>" + "".join(f'<td data-l="{e(lbl)}">{e(str(r[0]) if k == "Year" else _fmt(r[col[k]]))}</td>' for k, lbl in keep) + "</tr>" for r in main if isinstance(r[0], int))
    raw = (f'<details class="watch-details"><summary>Raw published numbers, 2005–2025 (one row per year)</summary><div class="table-wrap"><table class="watch-table"><thead><tr>{thr}</tr></thead><tbody>{trs}</tbody></table></div>'
           f'<p class="muted-note">"Not reported" means the source has no figure for that year. The 2005 ACS covers households only and the 2020 ACS figures are experimental; neither is comparable with other years. '
           f'* Births and deaths: {PENDING} the CDC/NCHS pages behind these figures could not be re-checked on {CHECKED}, so they carry no verification stamp.</p></details>')
    dh, disc = rows("Discrepancies")
    drows = "".join("<tr>" + "".join(f'<td data-l="{e(dh[k])}">{e(_fmt(v))}</td>' for k, v in enumerate(r[:6])) + "</tr>" for r in disc if r[0])
    disc_html = f'<div class="table-wrap"><table class="watch-table"><thead><tr>{"".join(f"<th>{e(h)}</th>" for h in dh[:6])}</tr></thead><tbody>{drows}</tbody></table></div>'
    rh, rolls = rows("Noncitizens on rolls")
    # DOJ/AP cumulative totals (70 charged, ~160 arrests) are not in a primary record: replace with the DOJ release itself.
    rolls = [list(r) for r in rolls]
    for r in rolls:
        if str(r[0]).startswith("National: DOJ prosecutions"):
            r[1:9] = ["Sep 18, 2026", "Individuals charged in one DOJ announcement (voting by an alien, false citizenship claims to register or vote, related offenses)", "", "", "16", "211M+ active",
                      "DOJ release 26-1082. Charges are accusations; defendants are presumed innocent. No cumulative DOJ total was found in a primary record.", "DOJ-16"]
    rrows = "".join("<tr>" + "".join(f'<td data-l="{e(rh[k])}">{e(_fmt(v))}</td>' for k, v in enumerate(r[:8])) + "</tr>" for r in rolls if r[0] and r[1] and "secondary" not in str(r[8] or ""))
    rolls_html = f'<div class="table-wrap"><table class="watch-table"><thead><tr>{"".join(f"<th>{e(h)}</th>" for h in rh[:8])}</tr></thead><tbody>{rrows}</tbody></table></div>'
    rep = []
    sec_rolls = [r for r in rolls if r[0] and "secondary" in str(r[8] or "")]
    for r in sec_rolls:
        rep.append((f"{r[0]}, {r[1]}: {r[2]}, {_fmt(r[3])}. {r[7] or ''}".strip(), "", "Lead"))
    fnd = (PV / "findings.md").read_text(encoding="utf-8")
    fs = dict(MD.sections(fnd))
    md = MD(H)
    def fsec(name, pending=False):
        lines = [l for l in fs[name] if "DOJ charged 70" not in l and "HSI reported 160" not in l]
        if name.startswith("Noncitizens and benefits"):
            lines = [l.replace("**Emergency Medicaid, FY2023.**", "**Emergency Medicaid, FY2023.** \u27e6P\u27e7") for l in lines]
        h = md.render(lines, rep_sink=rep).replace("\u27e6P\u27e7", PENDING).replace("summarized by KFF; It", "summarized by KFF. It")
        return h
    findings = "".join(f'<h3 class="watch-h3">{e(n)} {PENDING if n.startswith("Births") else stamp()}</h3>{fsec(n)}' for n in
                       ["Population and citizenship", "Voter registration", "Naturalization", "Births, deaths, SSNs", "Noncitizens and benefits (eligible and ineligible kept separate)"])
    hum = fsec("Humanitarian status (Biden period, Jan 20, 2021–Jan 20, 2025)")
    colo = fsec("Colorado")
    jw = fsec("Item K: Judicial Watch voter-roll cases (court records vs claims)")
    nj = ('<div class="fact-box"><p class="fact-tag">' + stamp() + '</p><p><b>New Jersey Motor Vehicle Commission error.</b> A software error registered about 6,600 people who told the MVC they were not citizens (June 2023 – June 2024). '
          'About 5,100 registrations were deleted and about 1,450 set aside for county review; about 340 of those registered through the error voted, and about 220 more are under review. '
          + H.src_link("https://www.nj.gov/governor/news/2026/20260721a.shtml", "NJ Governor, Jul 21, 2026") + " " + H.src_link("https://www.nj.gov/governor/news/2026/20260819a.shtml", "NJ Governor, Aug 19, 2026") + "</p></div>")
    # claims
    hr = (PV / "harris-rolls-claim.md").read_text(encoding="utf-8")
    hsecs = dict(MD.sections(hr))
    harris_quote = re.search(r'^> "(.+)"$', hr, re.M).group(1)
    rep_quote = [("Harris, Detroit NAACP forum, Sep 22, 2026, as transcribed by Townhall and The Beltway Report (two secondary transcriptions of a clip; the unedited video was not transcribed): \u201c" + harris_quote + "\u201d",
                  "https://townhall.com/news/amy-curtis/2026/09/23/kamala-harris-removing-ineligible-voters-is-cheating-n2683440", "Townhall transcription"),
                 ("Same passage, second transcription.", "https://thebeltwayreport.com/2026/09/kamala-harris-campaigns-in-detroit-calls-voter-roll-purges-cheating/", "Beltway Report transcription")]
    harris_card = claim_card(H, head="Kamala Harris · voter rolls", who="Kamala Harris (Detroit NAACP forum, Sep 22, 2026; she said \"they,\" not Trump)",
                             claim="Trump is purging the voter rolls (the claim as it circulated; her transcribed words were \"They are cheating by purging voter rolls\").",
                             claim_src='<span class="muted-note">Quote: see the grey box below (secondary transcriptions).</span>',
                             record="No federal agency has removed anyone from a state roll; states keep the rolls under the NVRA. The administration has pressed states through two executive orders, DOJ suits for voter lists (22+ dismissed), and DHS SAVE bulk checks (vacated in June 2026; stay pending). Some states cancelled registrations using SAVE data; in Texas, 578 of 2,724 people flagged were later shown to be citizens and ordered reinstated if removed.",
                             record_src=H.src_link("https://www.govinfo.gov/content/pkg/FR-2025-03-28/pdf/2025-05523.pdf", "EO 14248") + " " + stamp(),
                             nuance="Her advice to check registration status is not a factual claim and is not rated.", verdict_html='<span class="badge misleading">Rated misleading</span>')
    reuters_card = claim_card(H, head="\"30,000 illegal aliens registered\" (TV report, about Sep 23, 2026)", who="A television report (segment not identified)",
                              claim="30,000 illegal aliens are registered to vote.", claim_src='<span class="muted-note">The specific broadcast was not identified.</span>',
                              record="The figure traces to a Reuters investigation (Sep 23, 2026): states \"may have added more than 30,000 self-declared noncitizens\" to rolls since 2000, across 12 states, because of DMV software glitches and clerical errors. It does not say they were in the country illegally (the group includes lawful permanent residents), and Reuters could not determine how many voted. Primary records it relied on include New Jersey (about 6,600) and Iowa (277; 35 ballots).",
                              record_src=H.src_link("https://www.usatoday.com/story/news/politics/elections/2026/09/23/30000-noncitizens-may-have-been-added-to-voter-rolls/91907784007/", "Reuters via USA Today") + " " + H.src_link("https://www.nj.gov/governor/news/2026/20260721a.shtml", "NJ Governor"),
                              nuance="Cumulative over 26 years in 12 states, any immigration status, and nothing about voting.", verdict_html='<span class="badge misleading">Rated misleading</span>')
    gris = ('<div class="answer-box"><p><b>Colorado Secretary of State Jena Griswold.</b> A television statement that she said dead people and noncitizens "should vote" is <span class="chip unresolved">Unsupported</span>: no record of her saying it was found, and her documented statements describe removing deceased voters with state health and SSA death data and rejecting noncitizen registrations. The claim is listed on <a href="unsupported.html">Unsupported claims</a>.</p>'
            '<p><b>The 2022 postcards (as reported by AP and AFP from the Secretary of State\'s statements).</b> On Sep 27, 2022 her office mailed ERIC-required registration-information postcards (not forms or ballots) to about 30,000 noncitizens; a later count was 31,093. The cause was a Department of Revenue list that lacked the formatting needed to screen out noncitizen license holders. The office said the online system rejects noncitizen licenses and SSNs and that it knew of no recipient who registered. '
            + H.src_link("https://www.cbsnews.com/colorado/news/colorado-30000-noncitizens-vote-registration-mailer/", "AP via CBS Colorado") + " " + H.src_link("https://factcheck.afp.com/doc.afp.com.32LA24U", "AFP Fact Check") + "</p></div>")
    hick, n_acc = hick_letter(H)
    # download
    dl = OUT / "downloads"; dl.mkdir(exist_ok=True)
    shutil.copy2(PV / "population-voters.xlsx", dl / "population-voters.xlsx")
    body = (head("Watch", "Voters & Population: the Raw Numbers",
                 "U.S. population and citizenship, voter registration and removals, naturalization, noncitizens on the rolls, and Biden-period humanitarian programs, as published by Census, EAC, DHS, SSA and state officials. Only year-over-year differences are computed; nothing is adjusted or reconciled.",
                 f'<div class="doc-actions"><a class="btn navy sm" href="downloads/population-voters.xlsx">{H.ico("down")} Workbook (Excel)</a></div>')
            + legend() + toc([("pv-charts", "Charts"), ("pv-findings", "Findings"), ("pv-rolls", "Noncitizens on rolls"), ("pv-disc", "Discrepancies"), ("pv-hum", "Humanitarian"), ("pv-claims", "Claims checked"), ("pv-co", "Colorado")])
            + f'<div class="tile-grid">{"".join(tiles)}</div>'
            + section("pv-charts", "The numbers in charts", '<div class="chart-grid two">'
                      + H.chart_card("chart-cit", "U.S. citizens and noncitizens (ACS)", "2006–2024; 2005 and 2020 omitted as not comparable")
                      + H.chart_card("chart-reg", "Registrations: state records vs. self-reports", "EAVS counts records incl. inactive; CPS is a survey")
                      + H.chart_card("chart-rem", "Removals and new valid registrations (EAVS)", "By federal election cycle")
                      + H.chart_card("chart-nat", "Persons naturalized (DHS)", "Fiscal years")
                      + H.chart_card("chart-bd", "Births and deaths (CDC/NCHS)", "Pending source check: not stamped; 2025 provisional")
                      + H.chart_card("chart-co", "Colorado registrations (EAVS)", "Total incl. inactive")
                      + "</div>" + raw + src_line(H, PV_SRC))
            + section("pv-findings", "Findings in brief", findings, primary=False)
            + section("pv-rolls", "Noncitizens on voter rolls: official counts", '<p>Official counts are small next to rolls of millions. Flags are not confirmations, and many noncitizen registrations came from government processing errors.</p>' + rolls_html
                      + src_line(H, [("DHS SAVE figure: U.S. stay application, No. 26A308", SCOTUS_SAVE), ("DOJ release 26-1082, Sep 18, 2026", DOJ_16), ("Georgia SOS 2024 citizenship audit statement (copy)", GA_AUDIT), ("Ohio SOS, Jun 3, 2025", "https://www.ohiosos.gov/media-center/press-releases/2025/2025-06-03/")]) + nj)
            + section("pv-disc", "Where official numbers disagree", '<p>Shown side by side; no reconciliation is attempted.</p>' + disc_html + src_line(H, PV_SRC[:1] + PV_SRC[4:6] + [("Census population estimates (Vintage 2025)", "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/state/totals/NST-EST2025-ALLDATA.csv")]))
            + section("pv-hum", "Humanitarian and parole programs, Biden period", hum)
            + section("pv-claims", "Claims checked", f'<div class="frames">{harris_card}{reuters_card}</div>{gris}{hick}'
                      + rep_box(H, rep_quote, title="Reported, not confirmed by primary record: the Harris quote", intro="Transcriptions of a clip by two outlets; no official transcript or unedited video transcript was located."), primary=False)
            + section("pv-jw", "Judicial Watch voter-roll cases: court records vs. claims", jw)
            + section("pv-co", "Colorado", colo)
            + rep_box(H, rep)
            + reader_path([("unsupported.html", "Unsupported claims"), ("accountability.html", "Accountability trackers"), ("about.html", "Methodology")]))
    html_out = H.page("voters.html", "Voters & Population: the Raw Numbers · Swamp Force",
                      "Population, citizenship, voter registration and removals, naturalization and noncitizens on the rolls, from Census, EAC, DHS, SSA and state records.", body, charts=charts, serious=True)
    return html_out, {"charts": len(charts), "raw_rows": trs.count("<tr>"), "discrepancies": drows.count("<tr>"), "rolls_rows": rrows.count("<tr>"),
                      "hickenlooper_claims_accurate": n_acc, "hickenlooper_verdicts": HICK_VERDICTS, "harris": "Rated misleading", "reuters_30k": "Rated misleading", "griswold": "Unsupported", "reported": len(rep) + len(rep_quote)}


SECTIONS2.append(Section("voters.html", "Voters & Population", "Citizenship, registration, removals, claims", [PV / "population-voters.xlsx", PV / "findings.md", PV / "harris-rolls-claim.md", PV / "letter-factcheck.md"], build_voters))


# ───────────────────────── Floyd deep page ─────────────────────────
_JUROR = re.compile(r"Brandon\s+Mitchell", re.I)


def _floyd_drop(s):
    s = re.sub(r"\s*\(identified by news as [^()]*\)", "", s)
    s = re.sub(r"\(publicly self-identified; news names [^()]*\)", "", s)
    s = _JUROR.sub("Juror 52", s)
    return s


PV_SRC = [("Census ACS summary files", "https://www2.census.gov/programs-surveys/acs/summary_file/"),
          ("Census CPS voting tables", "https://www2.census.gov/programs-surveys/cps/tables/p20/"),
          ("EAC EAVS 2024", "https://www.eac.gov/sites/default/files/2025-07/2024_EAVS_Report_508.pdf"),
          ("SSA statistical supplement", "https://www.ssa.gov/policy/docs/statcomps/supplement/2025/2f.html"),
          ("DHS naturalizations FY2024", "https://ohss.dhs.gov/system/files/2026-06/2026_0604_ohss_yearbook_naturalizations_fy2024.xlsx"),
          ("DHS refugees FY2024", "https://ohss.dhs.gov/system/files/2025-08/2025_0812_ohss_yearbook_refugees_fy2024.xlsx"),
          ("All sources, with check status (workbook)", "downloads/population-voters.xlsx")]


def build_floyd(H):
    srcs = read_csv(FD / "sources.csv")
    fmap = {u["url"].split("/")[-1].split("?")[0]: u["url"] for u in srcs if u["url"] and u["verified"].startswith("yes")}
    def S(key):
        return next(u["url"] for u in srcs if key.lower() in u["claim"].lower() and u["url"])
    raw = (FD / "floyd-deep.md").read_text(encoding="utf-8")
    raw = _floyd_drop(raw)
    raw = re.sub(r" \*News reports quote Judge Cahill.*?retrieved\.\*", "", raw)
    keep = [l for l in raw.splitlines() if not re.search(r"Identity not confirmed|name link|Juror 52 / |contributors\.$|Juror 52's name", l)]
    raw = "\n".join(keep)
    assert not _JUROR.search(raw)
    rep = [("News reports quote Judge Cahill as calling the timing of the $27 million settlement \"unfortunate\"; the court transcript of that colloquy was not retrieved.", "", "Lead")]
    md = MD(H, filemap=fmap, drop_rx=_floyd_drop)
    top = dict(MD.sections(raw, 2))
    partA = top["Part A. Plain-English findings"]
    items, cur = {}, None
    for l in partA:
        m = re.match(r"^(\d+)\. ", l)
        if m:
            cur = int(m.group(1)); items[cur] = [l]
        elif cur and not l.startswith("###"):
            items[cur].append(l)
        elif l.startswith("###"):
            cur = None
    def A(n):
        ls = items[n][:]
        ls[0] = re.sub(r"^\d+\. ", "- ", ls[0])
        return md.render([x[1:] if x.startswith("   ") else x for x in ls], rep_sink=rep)
    b = dict(MD.sections("\n".join(top["Part B. Detail with citations"]), 3))
    b1 = dict(MD.sections("\n".join(b["1. The court file"]), 4))
    def B(name):
        return md.render(b[name], rep_sink=rep)
    plea = "The defendant admits that his willful use of unreasonable force resulted in Mr. Floyd's bodily injury and death because his actions impaired Mr. Floyd's ability to obtain and maintain sufficient oxygen to sustain Mr. Floyd's life."
    assert plea in raw
    # court-file table
    cf = [("Charges", "May 29, 2020", "Complaint: third-degree murder and second-degree manslaughter", S("Original complaint")),
          ("Charges", "June 3, 2020", "Amended complaint adds second-degree unintentional (felony) murder", S("Amended complaint")),
          ("Pretrial", "Oct. 21, 2020", "Third-degree murder dismissed; causation law set out (\"pre-existing medical conditions cannot defeat causation\")", S("Order on probable cause")),
          ("Pretrial", "Nov. 4, 2020", "County Attorney Freeman and three assistants barred from acting as trial advocates (advocate-witness rule)", S("HCAO advocate-witness")),
          ("Pretrial", "Mar. 11, 2021", "Third-degree murder reinstated after Court of Appeals order (order itself not retrieved)", ""),
          ("Trial", "Apr. 19, 2021", "Jury instructions: \"substantial causal factor\"; superseding cause must be the sole cause", S("Jury instructions")),
          ("Verdict", "Apr. 20, 2021", "Guilty on all three counts", S("Verdict forms")),
          ("Sentence", "June 25, 2021", "270 months on Count I (presumptive 150); Counts II–III unadjudicated", S("Sentencing order")),
          ("Post-trial", "June 2021", "New trial and juror hearing denied; no prosecutorial misconduct found", S("Order denying new trial")),
          ("Federal plea", "Dec. 15, 2021", "Guilty plea to willfully depriving Floyd of his constitutional rights, admitting causation", S("Federal plea agreement")),
          ("Federal sentence", "July 7, 2022", "252 months, adjusted to 245 for time served, concurrent with the state sentence", S("Federal judgment")),
          ("Appeal", "Apr. 17, 2023", "Court of Appeals, A21-1228: affirmed on every issue", S("Court of Appeals opinion")),
          ("Review", "July 18, 2023", "Minnesota Supreme Court denied review", S("MN Supreme Court denial")),
          ("Review", "Nov. 20, 2023", "U.S. Supreme Court denied certiorari (No. 23-416)", S("SCOTUS docket"))]
    cf_rows = "".join(f'<tr><td data-l="Stage">{e(a)}</td><td data-l="Date">{e(d)}</td><td data-l="Result">{e(r)}</td><td data-l="Record">{H.src_link(u, "Court record") if u else "<span class=muted-note>Not retrieved</span>"}</td></tr>' for a, d, r, u in cf)
    cf_tbl = f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Stage</th><th>Date</th><th>Result</th><th>Record</th></tr></thead><tbody>{cf_rows}</tbody></table></div>'
    b1_html = "".join(f'<h4 class="watch-h3">{e(t)}</h4>{md.render(ls, rep_sink=rep)}' for t, ls in list(b1.items())[1:] if t[:3] in ("1.1", "1.2", "1.3", "1.4", "1.5", "1.6"))
    # ties
    ties = read_csv(FD / "ties.csv")
    t_rows, n_ties = [], 0
    for t in ties:
        cls = t["classification"].lower()
        if "not attributed" in cls:
            continue
        person = "Juror 52" if t["person"].startswith("Juror 52") else t["person"]
        if cls.startswith("unverified"):
            rep.append((f"{person}: {t['tie_type']}. {t['detail']}", "", "Lead")); continue
        note = t["note"]
        note = "" if re.search(r"NEWS LEAD|name|Do not attribute|anonymous", note, re.I) else note
        note = re.sub(r"https?://\S+", "", note).strip(" :")
        link = H.src_link(t["source_url"], "Record") if t["source_url"].startswith("http") else ""
        n_ties += 1
        t_rows.append(f'<tr><td data-l="Person">{e(person)}</td><td data-l="Role">{e(t["role"])}</td><td data-l="Tie">{e(t["tie_type"])}</td><td data-l="Detail">{e(_floyd_drop(t["detail"]))}{" " + link if link else ""}</td><td data-l="Court finding">{e(t["classification"])}{("<br><span class=muted-note>" + e(note) + "</span>") if note else ""}</td></tr>')
    ties_tbl = f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Person</th><th>Role</th><th>Tie</th><th>Detail</th><th>Classification</th></tr></thead><tbody>{"".join(t_rows)}</tbody></table></div>'
    # conflicts
    cfl = (FD / "conflicts.md").read_text(encoding="utf-8").replace("listed in `ties.csv`", "listed in the ties table above")
    cfl_lines = [l for l in cfl.splitlines() if l.startswith("- ")]
    assert len(cfl_lines) == 4
    conflicts = md.render(cfl_lines, rep_sink=rep)
    # comparables
    comp = read_csv(FD / "comparables.csv")
    cols = [("decedent", "Decedent"), ("place", "Place"), ("date", "Date"), ("restraint", "Restraint"), ("manner_of_death_ruling", "Manner ruling"),
            ("cause_of_death_wording", "Cause wording"), ("drugs_or_disease", "Drugs or disease"), ("legal_outcome", "Legal outcome")]
    c_rows = []
    for c in comp:
        tds = []
        for k, lbl in cols:
            v = c[k]
            if "NEWS LEAD" in v:
                clean_v = re.sub(r"\s*\[NEWS LEAD[^\]]*\]", "", v).strip()
                rep.append((f"{c['decedent']}, {lbl.lower()}: {clean_v}", "", "Lead"))
                parts = [p for p in re.split(r"(?<=[.;)])\s+", v) if "NEWS LEAD" not in p]
                v = " ".join(parts).strip() or "Reported only (see grey box)"
                if "NEWS LEAD" in v:
                    v = "Reported only (see grey box)"
            tds.append(f'<td data-l="{e(lbl)}">{e(v)}</td>')
        links = " ".join(H.src_link(u.strip(), "Record") for u in c["primary_source_url"].split(";") if u.strip().startswith("http"))
        tds.append(f'<td data-l="Primary record">{links}</td>')
        c_rows.append("<tr>" + "".join(tds) + "</tr>")
    comp_tbl = f'<div class="table-wrap"><table class="watch-table"><thead><tr>{"".join(f"<th>{e(l)}</th>" for _, l in cols)}<th>Primary record</th></tr></thead><tbody>{"".join(c_rows)}</tbody></table></div>'
    pattern = [l for l in b["5. Comparable restraint deaths (full table in `comparables.csv`)"] if not l.startswith("|")]
    # open items
    oi = [l for l in raw.split("### Open items")[1].splitlines()[1:] if l.startswith("- ")]
    for it in md._items(oi):
        if not re.search(r"blocked", it[0]):
            rep.append(it)
    _cr = lambda R: [(re.sub(r"\s*\[[^\]]*NEWS LEAD[^\]]*\]:?", "", t).replace("**", "").replace("NEWS LEAD ONLY; ", "").strip(), u, l) for t, u, l in R]
    tiles = [H.tile("270", "Months: state sentence", "Presumptive was 150 months", src=H.src_link(S("Sentencing order"), "Sentencing order")),
             H.tile("245", "Months: federal sentence", "252 adjusted for time served; concurrent", src=H.src_link(S("Federal judgment"), "Judgment")),
             H.tile("3 of 3", "Appeal levels that let the conviction stand", "COA affirmed; MN Supreme Court and SCOTUS denied review", src=H.src_link(S("SCOTUS docket"), "No. 23-416")),
             H.tile("3", "Documented conflict or impropriety items", "One ruling, one rebuke, one appellate acknowledgment", accent=True),
             H.tile("56.17%", "Voted No on 2021 Question 2", "80,506 No to 62,813 Yes", src=H.src_link(S("2021 Question 2"), "City results"))]
    body = (head("2020 Record", "George Floyd: the Court Record in Depth",
                 "What the \"homicide\" ruling means, the evidence behind the doubt and how the courts handled it, the body-camera timeline, every step of the court file, the people involved and their documented ties, and comparable restraint deaths. Primary records only; nothing here states or suggests anyone's motive.",
                 '<div class="doc-actions"><a class="btn ghost-dark sm" href="record-2020.html#r20-floyd">Back to the 2020 Record</a></div>')
            + legend() + toc([("fd-homicide", "\"Homicide\""), ("fd-doubt", "The case for doubt"), ("fd-timeline", "Timeline"), ("fd-court", "Court file"), ("fd-ties", "Ties"), ("fd-conflicts", "Conflicts"), ("fd-pressure", "Outside pressure"), ("fd-comparables", "Comparable deaths"), ("fd-officials", "2020 officials")])
            + f'<div class="tile-grid">{"".join(tiles)}</div>'
            + section("fd-homicide", "What \"manner of death: homicide\" means", A(1) + A(2) + '<h3 class="watch-h3">The sources</h3>' + B("2. What \"manner of death: homicide\" means"))
            + section("fd-doubt", "The case for doubt, and how the courts handled it", A(3) + f'<blockquote class="watch-quote">\u201c{e(plea)}\u201d <span class="muted-note">Chauvin federal plea agreement, Doc. 142</span> {H.src_link(S("Federal plea agreement"), "Plea agreement")}</blockquote>'
                      + '<h3 class="watch-h3">Cause-of-death testimony</h3>' + md.render(b1["1.7 Cause-of-death testimony (transcript cites as given in the Thao verdict findings, which drew on the Chauvin and federal trial transcripts)"], rep_sink=rep))
            + section("fd-timeline", "Body-camera timeline, May 25, 2020 (p.m.)", '<p class="muted-note">As found by the court in the Thao verdict from body-worn camera video.</p>' + md.render(b1["1.8 Timeline (Thao verdict findings from body-cam video; times p.m., May 25, 2020)"], rep_sink=rep) + src_line(H, [("State v. Thao verdict and memorandum opinion (May 1, 2023)", S("Thao verdict"))]))
            + section("fd-court", "The court file", cf_tbl + f'<details class="watch-details"><summary>Charges, rulings, instructions, verdict, appeals and the federal case in detail</summary>{b1_html}</details>')
            + section("fd-ties", "People and their documented ties", A(6) + ties_tbl + '<p class="muted-note">Ties are listed as facts. None was the subject of a recusal motion or court finding in the records reviewed. Unconfirmed contributor identities are not listed.</p>')
            + section("fd-conflicts", "Documented conflicts or improprieties: the complete list", conflicts)
            + section("fd-pressure", "Outside pressure and how the courts responded", A(5) + '<h3 class="watch-h3">Detail</h3>' + B("4. Outside pressure and court responses"))
            + section("fd-comparables", "Comparable restraint deaths", comp_tbl + md.render(pattern, rep_sink=rep))
            + section("fd-officials", "Officials' documented 2020 actions", B("6. Officials' documented 2020 actions"))
            + rep_box(H, _cr(rep))
            + reader_path([("record-2020.html", "The 2020 Record"), ("about.html", "Methodology")]))
    html_out = H.page("record-2020-floyd.html", "George Floyd: the Court Record in Depth · Swamp Force",
                      "The Chauvin court file, what the homicide ruling means, the evidence on causation both ways, documented ties and comparable restraint deaths, from primary records.", body, serious=True)
    assert not _JUROR.search(html_out)
    return html_out, {"court_file_rows": len(cf), "ties_rows": n_ties, "conflicts": 3, "comparables": len(comp), "reported": len(rep)}


SECTIONS2.append(Section("record-2020-floyd.html", "George Floyd: the court record", "In depth", [FD / "floyd-deep.md", FD / "ties.csv", FD / "comparables.csv", FD / "conflicts.md", FD / "sources.csv"], build_floyd, in_menu=False))


# ───────────────────────── Censorship: the record ─────────────────────────
def _mask(s):
    return re.sub(r"\bfuck(ing|ed|s)?\b", lambda m: "f***" + (m.group(1) or ""), s, flags=re.I)


def build_censorship(H):
    SRC = {r["source_key"]: r for r in read_csv(CEN / "sources.csv")}
    def L(key, label=None):
        r = SRC[key]
        return H.src_link(r["url"], label or re.sub(r"\s*\(.*$", "", r["title"])[:60])
    md_raw = _mask((CEN / "censorship.md").read_text(encoding="utf-8"))
    flah = "Are you guys f***ing serious? I want an answer on what happened here and I want it today."
    assert flah in md_raw, "Flaherty quote changed"
    def card(title, quote, body, links, stamp_it=True):
        q = f'<blockquote class="watch-quote">\u201c{e(quote)}\u201d</blockquote>' if quote else ""
        return (f'<article class="cen-card"><h3 class="watch-h3">{e(title)}{" " + stamp() if stamp_it else ""}</h3>{q}<p>{body}</p>'
                f'<p class="cen-src">{" ".join(links)}</p></article>')
    documented = "".join([
        card("White House digital director Rob Flaherty to Twitter, Feb 6, 2021", "Cannot stress the degree to which this needs to be resolved immediately.",
             "About a parody account of President Biden's granddaughter; Twitter suspended it within about 45 minutes (district court ruling, p. 9). The Supreme Court later noted (fn. 4) that this impersonation request was mischaracterized as a censorship request.",
             [L("doughty_mem", "W.D. La. ruling, ECF 293"), L("scotus", "Murthy v. Missouri")]),
        card("Rob Flaherty to Facebook, Jul 15, 2021", flah,
             "Quoted in the district court's findings (p. 23). The profanity is shown with letters masked; the court record prints the word in full.",
             [L("doughty_mem", "W.D. La. ruling, p. 23")]),
        card("Press Secretary Jen Psaki, Jul 15–16, 2021", "We're flagging problematic posts for Facebook \u2026 there's about 12 people who are producing 65 percent of anti-vaccine misinformation.",
             "The next day: \u201cwe're in regular touch with social media platforms \u2026 You all make decisions, just like the social media platforms make decisions,\u201d and \u201cYou shouldn't be banned from one platform and not others.\u201d",
             [L("psaki15", "Briefing transcript, Jul 15"), L("psaki16", "Briefing transcript, Jul 16")]),
        card("Surgeon General's advisory, Jul 15, 2021", "Impose clear consequences for accounts that repeatedly violate platform policies.",
             "It also urged platforms to \u201cprioritize early detection of misinformation \u2018super-spreaders\u2019 and repeat offenders.\u201d Its definition of misinformation covers a true anecdote that is \u201chighly misleading,\u201d and it warns against \u201cconflating controversial or unorthodox claims with misinformation.\u201d",
             [L("sg_adv", "Surgeon General advisory")]),
        card("President Biden, Jul 16 and 19, 2021", "They're killing people.",
             "Three days later: \u201cFacebook isn't killing people; these 12 people who are out there giving misinformation\u2014anyone listening to it is getting hurt by it. It's killing people.\u201d",
             [L("pbs_killing", "PBS raw video"), L("ucsb_0719", "Official transcript, Jul 19")]),
        card("CDC \"COVID BOLO\" meetings with platforms, from May 14, 2021", "",
             "CDC's Carol Crawford set up \u201cBe On the Lookout\u201d meetings with platforms; Census Bureau staff helped prepare the slides (district court ruling, p. 47). The Fifth Circuit found CDC \u201cnot plainly coercive\u201d but \u201clikely significantly encouraged\u201d platform decisions (vacated later).",
             [L("doughty_mem", "W.D. La. ruling, p. 47"), L("ca5_sep", "5th Cir., Sep 8, 2023")]),
        card("CISA \"switchboarding\"", "",
             "CISA forwarded election officials' flags to platforms, which decided under their own policies; the practice stopped in 2022 (district court ruling, p. 68, citing CISA's Brian Scully). The House Judiciary majority staff calls it censorship; that is the committee majority's characterization.",
             [L("doughty_mem", "W.D. La. ruling, p. 68"), L("hjc_cisa", "House Judiciary majority-staff report")]),
        card("Mark Zuckerberg to Chairman Jordan, Aug 26, 2024", "In 2021, senior officials from the Biden Administration, including the White House, repeatedly pressured our teams for months to censor certain COVID-19 content, including humor and satire, and expressed a lot of frustration with our teams when we didn't agree.",
             "Also: \u201cI believe the government pressure was wrong\u201d and \u201cUltimately, it was our decision whether or not to take content down, and we own our decisions.\u201d On the laptop story he describes a general FBI warning, not one naming the Post story, and says \u201cin retrospect, we shouldn't have demoted the story.\u201d",
             [L("zletter", "Signed letter")]),
        card("Alphabet (YouTube) to Chairman Jordan, Sep 23, 2025", "pressed the Company regarding certain user-generated content \u2026 that did not violate its policies.",
             "\u00b610: \u201cIt is unacceptable and wrong when any government \u2026 attempts to dictate how the Company moderates content.\u201d \u00b623: creators terminated under its COVID and election policies will be offered a way back. Counterpoint on the record: Ranking Member Raskin's Oct 30, 2025 letter says \u201cnot a single one of Alphabet's employees testified about any coercion.\u201d Both companies say the final decisions were their own.",
             [L("alphabet", "Alphabet letter"), L("raskin", "Raskin letter (minority)")]),
        card("Facebook staff to Nick Clegg, Jul 14, 2021: \"under pressure\"", "Because we were under pressure from the administration and others to do more \u2026 We shouldn't have done it.",
             "The answer to why Facebook had removed claims that COVID was man-made. Subpoenaed company email, reproduced in the House Judiciary majority report (pp. 13\u201314, Ex. 52). Facebook's own policy page shows it removed \u201cman-made\u201d claims from Feb 8, 2021 and stopped on May 26, 2021. Official intelligence assessments of COVID's origin remain split; the 2021 ODNI assessment calls both origins \u201cplausible.\u201d",
             [L("hjc_wh", "House Judiciary report"), L("hjc_wh_app", "Appendix of documents"), L("fb_covid", "Facebook policy page"), L("odni2021", "ODNI 2021")]),
        card("Stanford-led Election Integrity Partnership and Virality Project", "35% of the URLs we shared with Facebook, Instagram, Twitter, TikTok, and YouTube were either labeled, removed, or soft blocked.",
             "The EIP was formed \u201cin consultation with CISA\u201d (639 in-scope tickets; 72% about delegitimizing the election; 16% filed by the nonprofit Center for Internet Security). The Virality Project (911 tickets) reports \u201cstrong ties\u201d with the Surgeon General's office and CDC, says the Surgeon General's office \u201cincorporated VP's research and perspectives,\u201d and says platforms acted \u201cin accordance with their policies.\u201d A Virality Project email told Twitter that \u201ctrue stories that could fuel hesitancy\u201d should be treated as \u201cStandard Vaccine Misinformation on Your Platform\u201d (Twitter Files #19 screenshot).",
             [L("eip", "EIP, The Long Fuse"), L("vp", "Virality Project report"), L("tf19_14", "Twitter Files #19 screenshot")]),
        card("Trump account suspensions, in the companies' own words", "",
             "Twitter (Jan 8, 2021) cited \u201cthe risk of further incitement of violence\u201d; Twitter Files #5 shows staff had earlier written \u201cI think we'd have a hard time saying this is incitement.\u201d The Oversight Board (May 5, 2021) upheld Facebook's restriction but called an indefinite suspension \u201cindeterminate and standardless\u201d; Facebook set two years (Jun 4, 2021) and reinstated him Jan 25, 2023. YouTube settled his suit for $24.5M (ECF 178, Sep 29, 2025).",
             [L("tw_suspend_exh", "Twitter post (court exhibit)"), L("tf5_12", "Twitter Files #5"), L("ob_decision", "Oversight Board"), L("meta_reinstate", "Meta reinstatement"), L("yt_settle", "YouTube settlement, ECF 178")]),
    ])
    courts_rows = [
        ("W.D. La. (Judge Doughty)", "Jul 4, 2023", "Preliminary injunction granted in part. Plaintiffs \u201clikely\u201d to succeed. The \u201cmost massive attack against free speech\u201d line opens with \u201cIf the allegations made by Plaintiffs are true.\u201d", "Preliminary; later vacated", [L("doughty_mem", "Ruling, ECF 293"), L("doughty_inj", "Injunction, ECF 294")]),
        ("Fifth Circuit", "Sep 8 and Oct 3, 2023", "White House, Surgeon General, FBI, CDC and (on rehearing) CISA \u201clikely coerced or significantly encouraged\u201d platform decisions. NIAID and the State Department not liable.", "Preliminary; later vacated", [L("ca5_sep", "Sep 8 opinion"), L("ca5_oct", "Oct 3 opinion")]),
        ("U.S. Supreme Court (Barrett, 6\u20133)", "Jun 26, 2024", "Reversed on standing only: \u201cWe therefore lack jurisdiction to reach the merits.\u201d Footnote 4: many district findings \u201cunfortunately appear to be clearly erroneous.\u201d Alito's dissent (with Thomas and Gorsuch) called the conduct \u201cblatantly unconstitutional\u201d; a dissent is not a holding.", "Final on standing; no merits ruling", [L("scotus", "Murthy v. Missouri")]),
        ("Fifth Circuit on remand", "Aug 26, 2024", "Injunction vacated entirely; case remanded.", "Everything preliminary wiped", [L("ca5_remand", "Remand order")]),
        ("W.D. La.", "Nov 8, 2024", "Jurisdictional discovery allowed.", "Procedural", [L("doc404", "ECF 404")]),
        ("W.D. La. consent decree", "Mar 25, 2026", "SO ORDERED: for 10 years the Surgeon General, CDC and CISA may not threaten \u201cadverse legal, regulatory, or economic government sanction\u201d to get the plaintiffs' protected speech removed from Facebook, Instagram, X, LinkedIn or YouTube. Officials may still call posts \u201cinaccurate, wrong.\u201d \u00b617: not an admission of liability.", "Settlement; not a finding", [L("consent", "Consent decree, ECF 478"), L("ncla_pr", "NCLA statement (plaintiffs' counsel)")]),
    ]
    ct = "".join(f'<tr><td data-l="Court">{e(c)}</td><td data-l="Date">{e(d)}</td><td data-l="What it held">{e(h)}</td><td data-l="Status">{e(s)}</td><td data-l="Record">{" ".join(l)}</td></tr>' for c, d, h, s, l in courts_rows)
    courts = (f'<div class="table-wrap"><table class="watch-table"><thead><tr><th>Court</th><th>Date</th><th>What it held</th><th>Status</th><th>Record</th></tr></thead><tbody>{ct}</tbody></table></div>'
              '<div class="answer-box"><p class="answer-tag">Bottom line</p><p>No court has issued a final ruling that any official violated the First Amendment in this matter. The case ended in a limited consent decree that expressly is not an admission of liability.</p></div>')
    beliefs = [
        ("The FBI or the government ordered the laptop story suppressed.",
         "Yoel Roth testified under oath that Hunter Biden was raised in FBI meetings \u201cbut not by the government, to the best of my recollection.\u201d Matt Taibbi wrote: \u201cno evidence - that I've seen - of any government involvement in the laptop story.\u201d What is documented: general FBI hack-and-leak warnings and the FBI declining to comment when asked. The district court called that \u201csignificant encouragement\u201d (p. 107); the finding was preliminary and later vacated.",
         [L("ov_hearing", "House Oversight hearing"), L("tf1_22", "Twitter Files #1"), L("doughty_mem", "W.D. La. ruling")]),
        ("The Twitter Files show the Biden White House ordering takedowns in 2020.",
         "In 2020 the \u201cBiden team\u201d was a campaign. Twitter Files #1: requests from \u201cboth the Trump White House and the Biden campaign were received and honored.\u201d The \u201cHandled\u201d email was dated Oct 24, 2020, after the laptop decision.",
         [L("tf1_10", "Twitter Files #1")]),
        ("The Supreme Court cleared the administration and found no censorship.",
         "The Court decided standing only: \u201cWe therefore lack jurisdiction to reach the merits.\u201d It made no finding that pressure did not occur.",
         [L("scotus", "Murthy v. Missouri")]),
        ("The courts ruled the administration's actions unconstitutional.",
         "The district and Fifth Circuit findings were preliminary (\u201clikely\u201d) and were vacated on Aug 26, 2024. The 2026 consent decree is not an admission of liability.",
         [L("ca5_remand", "Fifth Circuit remand"), L("consent", "Consent decree")]),
        ("Francis Collins and Anthony Fauci got the Great Barrington Declaration censored.",
         "Collins's FOIA-released email asks for \u201ca quick and devastating published take down of its premises,\u201d which means a published rebuttal, not removal. The Fifth Circuit found NIAID not liable.",
         [L("collins", "Collins email (FOIA)"), L("ca5_sep", "5th Cir., pp. 59\u201360")]),
        ("Doctors lost their licenses just for speaking.",
         "Washington's order on Dr. Ryan Cole restricted his license, citing both his statements and deficient care for four patients. California's AB 2098 was enjoined on vagueness grounds, then repealed by SB 815; no enforcement was found. The FSMB warned in 2021 that spreading vaccine misinformation risked discipline. No primary record reviewed shows a revocation for speech alone.",
         [L("cole", "Cole final order"), L("hoeg", "H\u00f8eg v. Newsom"), L("sb815", "SB 815"), L("fsmb", "FSMB")]),
        ("Networks censored the President on Nov 5, 2020.",
         "The full address was carried unedited by C-SPAN and the White House, and the official transcript exists. Any cutaways were decisions by private broadcasters; no government actor was involved.",
         [L("dcpd_1105", "Official transcript"), L("cspan_1105", "C-SPAN unedited video")]),
        ("The Hunter Biden laptop story was Russian disinformation.",
         "Candidate Biden cited a letter from 51 former intelligence officials, which said the emails had \u201call the classic earmarks of a Russian information operation\u201d; the letter itself says \u201cwe do not have evidence of Russian involvement.\u201d. Zuckerberg later wrote that \u201cthe reporting was not Russian disinformation.\u201d",
         [L("debate1022", "Debate transcript"), L("ic51", "The 51-signer letter"), L("zletter", "Zuckerberg letter")]),
    ]
    ic51_txt = (CEN / "src" / "ic51.txt").read_text(encoding="utf-8", errors="ignore") if (CEN / "src" / "ic51.txt").exists() else ""
    if "we do not have evidence of Russian involvement" not in re.sub(r"\s+", " ", ic51_txt).lower() and "do not have evidence" not in ic51_txt.lower():
        beliefs[-1] = (beliefs[-1][0], beliefs[-1][1].replace("; the letter itself says \u201cwe do not have evidence of Russian involvement.\u201d", ""), beliefs[-1][2])
    bel = "".join(f'<article class="cen-belief"><p class="cen-belief-q"><span class="chip unresolved">Not supported by the record</span> {e(q)}</p><p>{e(r)}</p><p class="cen-src">{" ".join(l)}</p></article>' for q, r, l in beliefs)
    physicians = (
        '<ul class="watch-list">'
        f'<li><b>Dr. Jay Bhattacharya</b> (co-author of the Great Barrington Declaration): Twitter placed him on a \u201cTrends Blacklist\u201d (Twitter Files #2; the screenshots show no government request behind it). Confirmed NIH Director on Mar 25, 2025, 53\u201347. {L("tf2_3", "Twitter Files #2")} {L("senate141", "Senate roll call #141")} {stamp()}</li>'
        f'<li><b>Dr. Martin Kulldorff</b>: a tweet labeled \u201cMisleading\u201d by Twitter (Twitter Files #10). Chaired the CDC vaccine advisory committee (ACIP) in 2025; named chief science officer at HHS ASPE on Dec 1, 2025. Per plaintiffs\' counsel, he and Bhattacharya withdrew from the case on joining government. {L("tf10_20", "Twitter Files #10")} {L("hhs_kulldorff", "HHS release")} {stamp()}</li>'
        f'<li><b>Dr. Aaron Kheriaty</b>: a party to the 2026 settlement. {L("ncla_pr", "NCLA statement")} His employment history is reported only (see the grey box).</li>'
        f'<li><b>The Great Barrington Declaration</b> (Oct 4, 2020) and the YouTube removal of a Mar 18, 2021 roundtable with Gov. DeSantis are recorded as plaintiffs\' allegations in the district ruling (p. 5). {L("gbd", "Declaration")}</li></ul>')
    alleged = (
        '<div class="fact-box"><p class="fact-tag">Characterizations, not findings</p><ul class="watch-list">'
        f'<li>House Judiciary <b>majority-staff</b> reports use words such as \u201cunconstitutional\u201d and \u201ccolluded\u201d; these are the committee majority\'s conclusions. {L("hjc_wh", "Majority report")}</li>'
        f'<li>Executive Order 14149 (Jan 20, 2025) says the prior administration \u201ctrampled free speech rights\u201d; that is the executive\'s characterization, not a court finding. {L("eo14149", "EO 14149")}</li>'
        f'<li>At the Mar 9, 2023 Weaponization hearing, Taibbi named requests from the FBI, DHS, HHS, DOD, GEC and CIA; these are witness claims in a congressional record. {L("wz_hearing", "Hearing record")}</li></ul></div>')
    # timeline
    tl = read_csv(CEN / "timeline.csv")
    rows_html, years = [], {}
    for t in tl:
        conf = t["confirmed_by_primary_record"].strip().lower()
        yr = t["date"][:4]
        years.setdefault(yr, {"yes": 0, "partial": 0, "no": 0})[conf if conf in ("yes", "partial", "no") else "no"] += 1
        ev = e(_mask(t["event"]))
        if conf == "yes":
            src = H.src_link(t["primary_source_url"], t["source_type"][:40]) if t["primary_source_url"].startswith("http") else ""
            rows_html.append(f'<li class="cen-tl-item"><span class="cen-tl-date">{e(t["date"])}</span><p>{ev} {src} <span class="cen-ok" title="Confirmed by primary record">\u2713</span></p></li>')
        else:
            lbl = "Partly confirmed" if conf == "partial" else "Reported only"
            rows_html.append(f'<li class="cen-tl-item grey"><span class="cen-tl-date">{e(t["date"])}</span><p><span class="unsup-tag">{lbl}</span> {ev}</p></li>')
    ylabels = sorted(years)
    charts = [{"id": "chart-cen-tl", "type": "bar", "labels": ylabels, "stacked": True,
               "datasets": [{"label": "Confirmed by primary record", "data": [years[y]["yes"] for y in ylabels], "color": "#16325c"},
                            {"label": "Partly confirmed", "data": [years[y]["partial"] for y in ylabels], "color": "#a8a29e"},
                            {"label": "Reported only", "data": [years[y]["no"] for y in ylabels], "color": "#d6d3d1"}]}]
    n_yes = sum(v["yes"] for v in years.values()); n_part = sum(v["partial"] for v in years.values()); n_no = sum(v["no"] for v in years.values())
    timeline = (H.chart_card("chart-cen-tl", "Timeline events by year", f"{len(tl)} events: {n_yes} confirmed, {n_part} partly confirmed, {n_no} reported only")
                + f'<ol class="cen-tl">{"".join(rows_html)}</ol>')
    rep = [
        ("Zuckerberg on the Joe Rogan Experience #2255 (Jan 10, 2025), his own assertions, not tied to a document: officials were \u201cthreatening repercussions\u201d; the government wanted \u201canything that says that vaccines might have side effects\u201d taken down; officials \u201cwould call up our team and scream at them and curse.\u201d He also said he \u201cwasn't involved in those conversations directly.\u201d His letter says the decisions were Meta's own.", SRC["rogan"]["url"], "Original video"),
        ("Meta agreed to pay about $25 million to settle Mr. Trump's suspension suit (Jan 2025); no settlement filing was retrieved.", SRC["meta_settle_rep"]["url"], "Reuters"),
        ("Maine's medical board suspended Dr. Meryl Nass (Jan 2022); the order itself was not retrieved.", "", "Lead"),
        ("FBI Director Wray said on Fox News (Feb 28, 2023) the origin was \u201cmost likely a potential lab incident\u201d; no FBI document was located.", SRC["wray_rep"]["url"], "Fox News"),
        ("CIA (Jan 2025): low confidence that a research-related origin is more likely; no CIA document was found.", SRC["cia_rep"]["url"], "Reuters"),
        ("Department of Energy: low-confidence lab-origin assessment; no DOE document was found.", "", "Lead"),
        ("Nov 5, 2020: MSNBC, NBC, ABC and CBS cut away from or interrupted Mr. Trump's address; unedited network air-checks were not located.", SRC["ap_cutaway"]["url"], "AP"),
        ("Twitter said it labeled about 300,000 election tweets between Oct 27 and Nov 11, 2020.", SRC["npr_tw300k"]["url"], "NPR"),
        ("ABC, CBS and NBC did not carry President Biden's Sep 1, 2022 \u201cSoul of the Nation\u201d speech live.", SRC["wapo_biden0901"]["url"], "Washington Post"),
        ("Dr. Aaron Kheriaty's dismissal by UC Irvine over the vaccine mandate, and his later suit.", "", "Lead"),
        ("YouTube's statement that the DeSantis roundtable claims \u201ccontradict the consensus of local and global health authorities.\u201d", SRC["nbc_desantis"]["url"], "NBC News"),
    ]
    tiles = [H.tile("6\u20133", "Supreme Court: decided on standing only", "\u201cWe therefore lack jurisdiction to reach the merits\u201d", src=L("scotus", "Opinion")),
             H.tile("5", "Entities found \u201clikely\u201d to have coerced or encouraged", "Fifth Circuit, 2023; preliminary and later vacated", src=L("ca5_oct", "5th Cir.")),
             H.tile("35%", "Of URLs the EIP shared that platforms acted on", "Labeled, removed or soft-blocked", src=L("eip", "EIP report")),
             H.tile("10", "Years: consent decree term", "SG, CDC, CISA; \u00b617 not an admission", src=L("consent", "ECF 478")),
             H.tile("0", "Final merits rulings that officials violated the First Amendment", "In Murthy v. Missouri", accent=True)]
    body = (head("Watch", "Censorship: the Record",
                 "What government officials did about Americans' speech on social media, as shown by court records, official transcripts, company letters and subpoenaed documents; what the courts actually held; and what is popularly believed but not supported by the record.")
            + legend() + toc([("cen-documented", "Documented"), ("cen-courts", "Courts"), ("cen-asserted", "Asserted"), ("cen-beliefs", "Not supported"), ("cen-physicians", "Physician plaintiffs"), ("cen-timeline", "Timeline")])
            + f'<div class="tile-grid">{"".join(tiles)}</div>'
            + section("cen-documented", "Documented by primary records", f'<div class="cen-grid">{documented}</div>', primary=False)
            + section("cen-courts", "What the courts actually held", courts)
            + section("cen-asserted", "Alleged or asserted, not established by a primary record", alleged + '<p>Zuckerberg\'s Rogan remarks are listed in the grey box below: they are his own assertions and are not tied to a document.</p>', primary=False)
            + section("cen-beliefs", "Popularly believed but not supported by the record", '<p>Each belief is shown with what the primary record does and does not show.</p>' + f'<div class="cen-beliefs">{bel}</div>', primary=False)
            + section("cen-physicians", "What happened to the physician plaintiffs", physicians, primary=False)
            + section("cen-timeline", "Timeline, 2019\u20132026", timeline, primary=False)
            + rep_box(H, rep)
            + reader_path([("unsupported.html", "Unsupported claims"), ("about.html", "Methodology")]))
    html_out = H.page("censorship.html", "Censorship: the Record · Swamp Force",
                      "Government pressure on social-media platforms, from court records, transcripts and company letters: what is documented, what the courts held, and what the record does not support.", body, charts=charts, serious=True)
    assert "fucking" not in html_out.lower()
    return html_out, {"documented_cards": documented.count("cen-card"), "court_rows": len(courts_rows), "beliefs": len(beliefs),
                      "timeline_events": len(tl), "timeline_confirmed": n_yes, "timeline_partial": n_part, "timeline_reported": n_no, "reported": len(rep)}


SECTIONS2.append(Section("censorship.html", "Censorship", "Platforms, pressure, courts", [CEN / "censorship.md", CEN / "timeline.csv", CEN / "sources.csv"], build_censorship))


# ───────────────────────── Gas Price Gap Tracker ─────────────────────────
GG = EN / "gap-tracker"


# ── What your state adds to every gallon (owner's fuel-tax charts + verified table), added Sep 24, 2026 ──
FT_SRC = [("EIA state motor fuel taxes, Jul 2026 (XLSX)", "https://www.eia.gov/petroleum/marketing/monthly/xls/fueltaxes.xlsx"),
          ("U.S. Code: federal rates, 26 U.S.C. 4081", "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section4081&num=0&edition=prelim"),
          ("U.S. Code: “United States” = states + DC, 26 U.S.C. 7701(a)(9)", "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section7701&num=0&edition=prelim"),
          ("Illinois Dept. of Revenue bulletin FY 2026-23-A", "https://tax.illinois.gov/research/publications/bulletins/fy-2026-23.html"),
          ("Indiana Dept. of Revenue: gas tax suspension", "https://www.in.gov/dor/i-am-a/business-corp/gasoline-use-tax/"),
          ("Indiana executive order, Sep 3, 2026", "https://iar.iga.in.gov/register/20260916-IR-GOV260349EOA"),
          ("FHWA state tax rates (MF-121T)", "https://www.fhwa.dot.gov/policyinformation/statistics/2024/mf121t.cfm")]
FT_FIXES = [
    ("Utah gas", "38.55¢ state (37.9¢ excise + 0.65¢ fee), 56.95¢ with federal. The chart shows 32.6¢ / 51.0¢."),
    ("Vermont gas", "31.26¢ state, 49.66¢ with federal. The chart shows 34.9¢ / 53.3¢."),
    ("Nevada gas", "23.81¢ state, 42.21¢ with federal. The chart shows 24.8¢ / 43.2¢; it appears to add the 1¢ county tax, and local taxes are left out for every other state."),
    ("Indiana gas", "The July 1 statutory total is 64.5¢ (37.0¢ excise + 26.5¢ gasoline use tax + 1.0¢ fee); the chart shows 63.1¢. Both taxes are suspended by executive order through Oct 5, 2026, so only the 1.0¢ fee is collected now (19.4¢ with federal)."),
    ("Puerto Rico", "No federal fuel excise applies there. Its per-barrel petroleum taxes are taxes, not pretax programs: 36.9¢ gas, 22.0¢ diesel. State totals: 52.9¢ gas, 26.0¢ diesel. The chart adds 18.4¢ / 24.4¢ federal and lists the barrel tax as “~22¢ pretax” for both."),
    ("Illinois (chart was right)", "The chart’s 48.3¢ gas / 55.8¢ diesel is correct: Illinois froze the rate for Jul 1–Dec 31, 2026. EIA’s table shows the unfrozen 49.6¢ / 57.1¢."),
]


def fuel_tax_section(H):
    import json as _j
    _here = Path(__file__).parent
    d = _j.load(open(_here / "watch-data" / "fuel-tax-2026-07.json"))
    cdir = _here / "watch-data" / "fuel-tax-charts"
    figs = ""
    for k, cap in [("gas-1of2", "Gas, 1 of 2"), ("gas-2of2", "Gas, 2 of 2"), ("diesel-1of2", "Diesel, 1 of 2"), ("diesel-2of2", "Diesel, 2 of 2")]:
        src = _copy_img(cdir / f"{k}.jpg", f"fuel-tax-{k}.jpg", width=2000)
        figs += (f'<figure class="ft-fig"><a href="{src}" target="_blank" rel="noopener" aria-label="Enlarge: {e(cap)}">'
                 f'<img src="{src}" alt="The owner’s chart: state fuel taxes, {e(cap)}" loading="lazy" width="2000" height="1020"></a>'
                 f'<figcaption>{e(cap)} · tap to enlarge</figcaption></figure>')
    fix = {"Utah": "g", "Vermont": "g", "Nevada": "g", "Indiana": "g", "Puerto Rico": "gd", "Illinois": ""}
    trs = ""
    for r in d["rows"]:
        f = fix.get(r["state"])
        mk = ' <sup class="ft-mk">*</sup>' if r["note"] else ""
        gcls = ' class="ft-fixed"' if f and "g" in f else ""
        dcls = ' class="ft-fixed"' if f and "d" in f else ""
        trs += (f'<tr><th scope="row">{e(r["state"])}{mk}</th><td data-v="{r["gas_state"]}">{r["gas_state"]:.1f}</td><td{gcls} data-v="{r["gas_total"]}"><b>{r["gas_total"]:.1f}</b></td>'
                f'<td data-v="{r["dsl_state"]}">{r["dsl_state"]:.1f}</td><td{dcls} data-v="{r["dsl_total"]}"><b>{r["dsl_total"]:.1f}</b></td></tr>')
    notes = "".join(f'<li><b>{e(r["state"])}:</b> {e(r["note"])}</li>' for r in d["rows"] if r["note"])
    fixes = "".join(f'<li><b>{e(a)}:</b> {e(b)}</li>' for a, b in FT_FIXES)
    btns = "".join(f'<a class="jr-srcbtn" href="{e(u)}" target="_blank" rel="noopener"><span class="jr-srctype">{e(l)}</span><span class="jr-srcgo">Open ↗</span></a>' for l, u in FT_SRC)
    inner = (f'<p>Every gallon carries the federal tax, <b>18.4¢ on gas and 24.4¢ on diesel</b> (18.3¢ / 24.3¢ excise plus a 0.1¢ tank-cleanup fee), plus what your state adds. '
             f'State totals are taxes and fees of general application as of July 1, 2026, including sales tax where a state charges it per gallon. <b>Do not add sales tax again.</b> '
             f'County and city taxes and gross-receipts taxes are not included, so some drivers pay more.</p>'
             f'<p class="ft-hint">Cents per gallon. Tap a column to sort. Red = corrected from the owner’s chart. Source: {H.src_link(FT_SRC[0][1], "EIA")} · {H.src_link(FT_SRC[3][1], "Illinois DOR")}</p>'
             f'<div class="table-wrap ft-wrap"><table class="ft-table sortable"><thead><tr><th scope="col" data-sort="t">State</th><th scope="col" data-sort="n">Gas: state</th><th scope="col" data-sort="n">Gas + federal</th>'
             f'<th scope="col" data-sort="n">Diesel: state</th><th scope="col" data-sort="n">Diesel + federal</th></tr></thead><tbody>{trs}</tbody></table></div>'
             f'<ul class="ft-notes">{notes}</ul>'
             f'<details class="jr-fact ft-changed"><summary><span class="jr-fact-sum">What changed from the owner’s charts (5 corrections, 1 confirmed)</span><span class="jr-fact-type">Checked against EIA and state revenue records</span></summary>'
             f'<div class="jr-fact-body"><ul>{fixes}</ul><p>All 50 states, DC and Puerto Rico are on both charts, with no repeats. Every other total matches EIA within 0.1¢. '
             f'Some column splits differ from the official table (for example, Connecticut’s 25¢ gas and 49.9¢ diesel are all excise in EIA’s table, and Hawaii’s total leaves out county taxes); the totals are right.</p></div></details>'
             f'<h3 class="strip-h">The owner’s charts</h3>'
             f'<p class="strip-dek">Made by the owner. Her sources: Tax Foundation / EIA July 2026, IRS/FHWA, California CDTFA, Puerto Rico Hacienda, CEC / Washington / Oregon. '
             f'The pretax program estimates (California ~42¢, Washington ~17¢, Oregon ~9¢) are hers and were not checked against a primary record. Corrections are in the table above.</p>'
             f'<div class="ft-figs">{figs}</div>'
             f'<div class="wv-src">{btns}</div>')
    return section("gg-state", "What your state adds to every gallon", inner)


def build_gas_gap(H):
    txt = (GG / "gap-report.md").read_text(encoding="utf-8")
    md = MD(H); rep = []
    imgs = {k: _copy_img(GG / "charts" / f"{k}.png", f"{k}.png") for k in
            ["gap-pump-wholesale-crude-2005-2026", "gap-cents-per-gallon-breakdown-2005-2026", "gap-refiner-profits-vs-margin"]}
    dl = OUT / "downloads"; dl.mkdir(exist_ok=True)
    shutil.copyfile(GG / "gas-gap-tracker.xlsx", dl / "gas-gap-tracker.xlsx")
    retail = num_md(txt, r"U\.S\. regular was \*\*\$([\d.]+)/gal\*\* on Sep 21, 2026", float)
    ref = num_md(txt, r"\| Refining \(Gulf wholesale − WTI\) \| −?[\d.]+¢ \| ([\d.]+)¢", float)
    bw = num_md(txt, r"\*\*Brent–WTI gap above normal\*\* \(\$[\d.]+/bbl vs \$[\d.]+ in 2025\) \| \*\*([\d.]+)\*\*", float)
    war = num_md(txt, r"\*\*War shortage premium\*\*[^|]*\| \*\*([\d.]+)\*\*", float)
    co = num_md(txt, r"Colorado regular was \*\*\$([\d.]+)\*\*", float)
    tiles = [H.tile(f"${retail:.3f}", "U.S. regular, Sep 21, 2026", "July 2008 peak: $4.114", src=H.src_link("https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EMM_EPMR_PTE_NUS_DPG&f=W", "EIA")),
             H.tile(f"{ref:.0f}¢", "Refining slice per gallon today", "Gulf wholesale minus WTI; −2¢ in July 2008", accent=True, src=H.src_link("https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EER_EPMRU_PF4_RGC_DPG&f=W", "EIA")),
             H.tile(f"{war:.0f}¢", "War-shortage premium", "Cause documented (IEA); size not measured by any agency", src=H.src_link("https://www.iea.org/reports/oil-market-report-september-2026", "IEA")),
             H.tile(f"{bw:.1f}¢", "Not explained by a primary record", "Brent–WTI gap above its 2025 level", src=H.src_link("https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RBRTE&f=W", "EIA")),
             H.tile(f"${co:.3f}", "Colorado regular, Sep 21, 2026", "22¢ below U.S.; Suncor is the state's only refinery", src=H.src_link("https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EMM_EPMR_PTE_SCO_DPG&f=W", "EIA"))]
    figs = {"1": _fig(imgs["gap-pump-wholesale-crude-2005-2026"], "Pump vs wholesale vs crude, weekly 2005–2026", "U.S. retail, Gulf Coast wholesale gasoline, WTI and Brent per gallon. EIA weekly data.")
                 + _fig(imgs["gap-cents-per-gallon-breakdown-2005-2026"], "Cents-per-gallon breakdown, monthly 2005–2026", "EIA gasoline pump components (share × retail price), Jan 2005 – May 2026."),
            "2": _fig(imgs["gap-refiner-profits-vs-margin"], "Refiner profits vs refining margin", "Combined net income of five U.S. refiners (SEC) vs the Gulf Coast gasoline–WTI spread (EIA). 2026 is January–June only.")}
    anchors = {"1": "Where the money goes", "2": "Red flags", "3": "Ownership & Colorado", "4": "Investigations", "5": "Political money", "6": "Viral claim", "state": "State taxes"}
    parts = []
    intro = next(l for t, l in MD.sections(txt) if t == "")
    for t, lines in MD.sections(txt):
        if not t or t == "Files" or not t[0].isdigit():
            continue
        no = t.split(".")[0]
        inner = md.render(lines, rep_sink=rep) + figs.get(no, "")
        if no == "6":
            inner = f'<div class="wrong-box">{inner}</div>'
        parts.append(section(f"gg-{no}", t.split(". ", 1)[1], inner))
    body = (head("Watch", "Gas Price Gap Tracker",
                 "Why pump prices stay high while crude is far cheaper than in 2008: each cent of a gallon traced to EIA, SEC, CFTC and FEC records, with the data points that do not fit the documented explanations.")
            + legend() + toc([(f"gg-{k}", v) for k, v in anchors.items()])
            + f'<div class="tile-grid">{"".join(tiles)}</div>'
            + f'<div class="answer-box"><p><b>How to read this page.</b> A red flag is a number that does not fit the documented explanations. It is not a finding of wrongdoing, and no crime is implied without a charge or finding. '
              f'Raw data for every figure: <a href="downloads/gas-gap-tracker.xlsx">Gas Price Gap workbook (XLSX)</a>. Background: <a href="energy.html">Energy: gas vs. 2008 and the Iran war</a>.</p></div>'
            + "".join(parts) + fuel_tax_section(H) + rep_box(H, rep)
            + reader_path([("energy.html", "Energy"), ("unsupported.html", "Unsupported claims"), ("about.html", "Methodology")]))
    html_out = H.page("gas-gap.html", "Gas Price Gap Tracker · Swamp Force",
                      "Where each cent of a gallon goes, what the records explain, and what they do not: EIA, SEC, CFTC and FEC data.", body, serious=True)
    return html_out, {"retail": retail, "refining_c": ref, "unexplained_c": bw, "war_premium_c": war, "colorado": co, "images": len(imgs), "reported": len(rep)}


SECTIONS2.append(Section("gas-gap.html", "Gas Price Gap", "Where each cent of a gallon goes", [GG / "gap-report.md", GG / "gas-gap-tracker.xlsx", GG / "charts"], build_gas_gap))
