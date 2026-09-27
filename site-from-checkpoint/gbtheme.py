"""Grok Build look (Sep 26, 2026): Grok Build original CSS (black #0b0b0b, cream #ece8dc, sage #e8e0d0, Georgia,
uppercase sans headings, sticky black header, full-bleed eagle-on-Capitol hero, #141414 cards) applied over the
current site's markup. Writes assets/grokbuild.css (theme-mapped copy of style.css + Grok Build rules) and points
every page at it. Content is untouched."""
import re
from pathlib import Path
SITE = Path(__file__).parent; OUT = SITE / "public_html"
GB = open("/workspace/_gb-pkg/GrokBuild-original-site/upload-as-is/index.html").read() if Path("/workspace/_gb-pkg/GrokBuild-original-site/upload-as-is/index.html").exists() else ""
VARS = {"--navy": "#0b0b0b", "--navy-2": "#141414", "--navy-3": "#1c1c1c", "--navy-glow": "#2a2a2a", "--gold": "#e8e0d0",
        "--cream": "#0b0b0b", "--ivory": "#141414", "--ink": "#ece8dc", "--muted": "#a39e93", "--line": "#2a2a2a",
        "--proven": "#86efac", "--proven-bg": "#10231a", "--mislead": "#fcd34d", "--mislead-bg": "#241c0c", "--claim": "#fca5a5",
        "--claim-bg": "#2a1212", "--truth": "#86efac", "--truth-bg": "#10231a", "--opinion-bg": "#17140f", "--opinion-border": "#e8e0d0",
        "--radius": "8px", "--serif": "Georgia, serif", "--sans": "ui-sans-serif, system-ui, sans-serif"}
LIGHT = r"#fff\b|#ffffff\b|#fbfaf7|#f4f1ea|#f8fafc|#f1f5f9|#fafafa|#f9fafb|#faf6ef|#fdfcf9|\bwhite\b"
DARKTXT = r"#0f172a|#1e293b|#334155|#111827|#1f2937|#111\b|#222\b|#0c2340|#071528|#475569"
EXTRA = """
/* ---- Grok Build original rules (copied) ---- */
html,body,body.serious{background:#0b0b0b!important;color:#ece8dc;font-family:Georgia,serif}
body::before{display:none!important}
.main,body.serious .main{background:transparent!important}
.section-title,.section-label,.section-dek,h3,h4,p,li,td,th,dd,dt,figcaption,label,summary{color:inherit}
a{color:#e8e0d0}
.site-header{position:sticky;top:0;background:#0b0b0b!important;border-bottom:1px solid #2a2a2a;box-shadow:none}
.site-header .kicker{text-align:center;font:600 12px/1.4 ui-sans-serif,system-ui;letter-spacing:.2em;text-transform:uppercase;color:#e8e0d0}
.brand-word{font:700 16px ui-sans-serif,system-ui!important;letter-spacing:.08em;text-transform:uppercase;color:#ece8dc}
.nav-row{background:#0b0b0b!important;border-top:1px solid #2a2a2a}
.nav-row a,.nav-row summary{font:600 13px ui-sans-serif,system-ui!important;letter-spacing:.08em;text-transform:uppercase;color:#ddd!important;background:transparent!important;border-color:#2a2a2a!important;border-radius:0!important}
.nav-row .menu{background:#0b0b0b!important;border:1px solid #2a2a2a!important}
.btn{background:#e8e0d0!important;color:#121212!important;border-radius:0!important;font:700 12px ui-sans-serif,system-ui!important;letter-spacing:.14em;text-transform:uppercase;box-shadow:none!important;min-height:44px}
.btn.ghost,.btn.out{background:transparent!important;border:1px solid #ccc!important;color:#fff!important}
h1,h2,.section-title{font-family:ui-sans-serif,system-ui!important;text-transform:uppercase;letter-spacing:.04em;color:#ece8dc!important}
.kicker,.section-kicker,.hero-kicker,.eyebrow{font:600 11px ui-sans-serif,system-ui;letter-spacing:.28em;text-transform:uppercase;color:#e8e0d0!important}
.chart-card,.stat,.card,.jr-hub-card,.fr-block .tile,.case,.pull-view,.sf-fold,table{background:#141414!important;color:#ece8dc;border-color:#2a2a2a!important;box-shadow:none!important}
.stat .num{color:#e8e0d0!important}
th{background:#1c1c1c!important;color:#e8e0d0!important} td{border-color:#2a2a2a!important}
.site-footer{background:#0b0b0b!important;border-top:1px solid #2a2a2a;color:#a39e93}
/* hero: Grok Build markup */
.gb-hero{position:relative;min-height:78vh;overflow:hidden}
.gb-hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;max-width:none}
.gb-hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.4),transparent)}
.gb-hero .copy{position:relative;max-width:72rem;margin:0 auto;min-height:78vh;display:flex;flex-direction:column;justify-content:flex-end;padding:2rem 1.5rem 2.5rem;color:#ece8dc}
.gb-hero h1{font:700 clamp(2.2rem,7vw,4.6rem)/.95 ui-sans-serif,system-ui;letter-spacing:.04em;text-transform:uppercase;margin:.4rem 0}
.gb-hero .copy a.hero-down{color:#e8e0d0;margin-top:1rem;font:600 12px ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase}
.gb-grid{display:grid;gap:1.2rem;grid-template-columns:repeat(2,minmax(0,1fr));max-width:72rem;margin:0 auto;padding:2rem 1rem}
@media(min-width:800px){.gb-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}}
.gb-card{background:#141414;text-decoration:none;color:#ece8dc;border-radius:8px;overflow:hidden}
.gb-card img{width:100%;height:auto;display:block}
.home-fold{margin:14px 0}.home-fold>summary.btn{min-height:40px}.home-fold[open]>summary{margin-bottom:12px}
.store-line>summary.btn{background:transparent!important;color:#e8e0d0!important;border:1px solid #2a2a2a!important;font-size:11px!important}
/* homepage: nav over the eagle */
body:has(.gb-hero.top) .site-header,body:has(.gb-hero.top) .nav-row,body:has(.gb-hero.top) .sf-pills{background:transparent!important;border-color:transparent!important}
body:has(.gb-hero.top) .site-header{background:linear-gradient(rgba(0,0,0,.72),rgba(0,0,0,.35))!important}
.gb-hero.top{margin-top:calc(-1 * var(--hh,150px));min-height:0;aspect-ratio:1792/1528;max-height:none}
.gb-hero.top img.bg{object-position:70% 100%}
.gb-hero.top .copy{min-height:0;height:100%;box-sizing:border-box}
.sf-pills-in{max-height:none!important}
.home-tiles .gb-card img{aspect-ratio:16/10;object-fit:cover}
.gb-sub{padding:0 1rem 1rem;margin:0;font:13px/1.4 ui-sans-serif,system-ui;color:#a39e93}
.store-line{background:transparent!important;color:#e8e0d0!important;border:1px solid #2a2a2a!important;font-size:11px!important}
/* filter chips + selects: readable on black */
.chip.btnchip{background:#141414!important;color:#ece8dc!important;border:1px solid #8a857a!important}
.chip.btnchip:hover{border-color:#e8e0d0!important}
.chip.btnchip.active,.chip.btnchip[aria-pressed="true"]{background:#e8e0d0!important;color:#0b0b0b!important;border-color:#e8e0d0!important}
.chip-lbl{color:#c9c3b6!important}
select,input,textarea{background:#141414!important;color:#ece8dc!important;border:1px solid #8a857a!important}
select option{background:#141414;color:#ece8dc}
.muted,.sub,.small{color:#b5afa3}
.fr-k,.linkbtn,.flip-hint,p.control,.why-buy h3{color:#f87171!important}
.answer-tag{color:#e8e0d0!important}
.mt-hb.split,.mt-split,.mt-split .mt-debt,.split,.wv-split{background:#737373!important}
.gb-card h3{font:700 1.2rem ui-sans-serif,system-ui;text-transform:uppercase;padding:0 1rem;color:#ece8dc}
"""

def _rgb(c):
    c = c.strip()
    if c.startswith("#"):
        h = c[1:]; h = "".join(x * 2 for x in h) if len(h) == 3 else h
        return [int(h[i:i + 2], 16) for i in (0, 2, 4)] + [1.0] if len(h) == 6 else None
    n = re.findall(r"[\d.]+", c)
    return [float(x) for x in n[:3]] + [float(n[3]) if len(n) > 3 else 1.0] if len(n) >= 3 else None
def _lum(c):
    v = _rgb(c)
    return 0 if not v else (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255
def _alpha_low(c):
    v = _rgb(c); return bool(v) and v[3] < .5
def _dark(c):  # light panel -> Grok Build card (tinted panels keep a faint hue)
    v = _rgb(c)
    if v and v[3] < .5: return c
    if v and max(v[:3]) - min(v[:3]) > 25:  # tinted (amber/green/red notes)
        return "#%02x%02x%02x" % tuple(int(x * .16) for x in v[:3])
    return "#141414"

def _light(c):  # dark text -> readable on black (tinted colours keep their hue)
    v = _rgb(c)
    if v and max(v[:3]) - min(v[:3]) > 40:
        return "#%02x%02x%02x" % tuple(int(255 - (255 - x) * .4) for x in v[:3])
    return "#ece8dc"

def run():
    css = (OUT / "assets" / "style.css").read_text(encoding="utf-8")
    for k, v in VARS.items():
        css = re.sub(r"(\n\s*" + re.escape(k) + r"\s*:)[^;]*;", lambda m: m.group(1) + " " + v + ";", css, count=1)
    css = re.sub(r"(background(?:-color)?\s*:\s*)(" + LIGHT + ")", r"\1#141414", css)
    css = re.sub(r"((?<![-\w])background(?:-image)?\s*:)([^;}]*gradient[^;}]*)", lambda m: m.group(1) + re.sub(r"#[0-9a-fA-F]{3,6}\b|rgba?\([^)]*\)", lambda k: _dark(k.group(0)) if _lum(k.group(0)) > .72 else k.group(0), m.group(2)), css)
    css = re.sub(r"((?<![-\w])color\s*:\s*)var\(--(navy|navy-2|navy-3|navy-glow|cream|line)\)", r"\1var(--ink)", css)
    css = re.sub(r"((?<![-\w])color\s*:\s*)(" + DARKTXT + ")", r"\1#ece8dc", css)
    css = re.sub(r"((?<![-\w])background(?:-color)?\s*:\s*)(#[0-9a-fA-F]{3,6}\b|rgba?\([^)]*\))", lambda m: m.group(1) + (_dark(m.group(2)) if _lum(m.group(2)) > .72 else m.group(2)), css)
    css = re.sub(r"((?<![-\w])color\s*:\s*)(#[0-9a-fA-F]{3,6}\b|rgba?\([^)]*\))", lambda m: m.group(1) + (_light(m.group(2)) if _lum(m.group(2)) < .38 and not _alpha_low(m.group(2)) else m.group(2)), css)
    (OUT / "assets" / "grokbuild.css").write_text(css + EXTRA, encoding="utf-8")
    for f in OUT.rglob("*.html"):
        t = f.read_text(encoding="utf-8")
        n = re.sub(r"assets/style\.css(\?v=[\w]+)?\"", lambda m: 'assets/grokbuild.css' + (m.group(1) or "") + '"', t)
        n = n.replace('<meta name="theme-color" content="#071528">', '<meta name="theme-color" content="#0b0b0b">')
        if n != t:
            f.write_text(n, encoding="utf-8")
    js = OUT / "assets" / "app.js"
    j = js.read_text(encoding="utf-8").replace("Chart.defaults.color = '#334155';", "Chart.defaults.color = '#ece8dc'; Chart.defaults.borderColor = '#2a2a2a';")
    # Party colours on every chart (Karen, Sep 26, 2026): Republican red, Democratic blue, everything else neutral
    PARTY = """function sfPartyCol(l){l=String(l||'');if(/^(republican|gop)|\\(R-|\\bR-[A-Z]{2}\\)/i.test(l))return '#dc2626';if(/^democrat|\\(D-|\\bD-[A-Z]{2}\\)/i.test(l))return '#2563eb';if(/^social/i.test(l))return '#f59e0b';if(/^(split|mixed|independent|news outlet|media|campaign|social media)/i.test(l))return ({s:'#8a8a8a',m:'#8a8a8a',i:'#8a8a8a',n:'#a3a3a3',c:'#a855f7'})[l[0].toLowerCase()]||(/social/i.test(l)?'#f59e0b':'#a3a3a3');return null}
function sfParty(spec){try{if(spec.labels&&!spec.datasets){var cs=spec.labels.map(sfPartyCol);if(cs.some(Boolean)){var base=spec.colors||[];spec.colors=spec.labels.map(function(l,i){return cs[i]||base[i%Math.max(base.length,1)]||'#8a8a8a'})}}
(spec.datasets||[]).forEach(function(d){var c=sfPartyCol(String(d.label||'').split(' · ')[0]);if(c){var a=(d.color||'').length===9?(d.color||'').slice(7):'';d.color=c+a}})}catch(e){}}
"""
    j = re.sub(r"^function sfPartyCol.*?\n\(spec\.datasets[^\n]*\n", "", j, flags=re.S | re.M)
    if "sfParty(spec);" not in j:
        j = j.replace("window.SF_CHARTS.forEach(function (spec) {", "window.SF_CHARTS.forEach(function (spec) { sfParty(spec);", 1)
    j = PARTY + j
    js.write_text(j, encoding="utf-8")
