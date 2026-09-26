import asyncio, json, re, sys
from pathlib import Path
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright
BASE = "http://127.0.0.1:8931/"
ROOT = Path("/workspace/site-from-checkpoint/public_html")
SHOTS = Path("/workspace/site-from-checkpoint/shots")
PAGES = [p.name for p in sorted(ROOT.glob("*.html"))]
SHOT = {"home": "index.html", "fake-news": "fake-news.html", "scorecard": "scorecard.html", "brief": "brief.html", "store": "store.html",
        "betrayal": "betrayal.html", "lawfare": "lawfare.html", "opinion": "opinion.html"}
if (ROOT / "unsupported.html").exists():  # built only when /workspace/reverify/unsupported-final.csv has rows
    SHOT["unsupported"] = "unsupported.html"
NEW = ("accountability", "accountability-fraud", "accountability-trading", "accountability-minnesota", "accountability-omar",
       "accountability-covid-border", "energy", "voters", "record-2020-floyd", "censorship", "about", "republicans", "democrats")
for _slug in ("trump-watch", "movement-watch", "record-2020") + NEW:  # Watch sections (watch.py) exist only when their inputs do
    if (ROOT / f"{_slug}.html").exists():
        SHOT[_slug] = f"{_slug}.html"
async def main(only_shots=False):
    SHOTS.mkdir(exist_ok=True)
    rep = {"overflow": [], "console": [], "broken_local": []}
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for w, h, tag in [(1280, 900, "desktop"), (390, 844, "mobile")]:
            ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=1 if w > 500 else 2)
            pg = await ctx.new_page()
            pg.on("console", lambda m, tag=tag: rep["console"].append(f"{tag} {m.type}: {m.text}") if m.type == "error" else None)
            pg.on("pageerror", lambda ex, tag=tag: rep["console"].append(f"{tag} pageerror: {ex}"))
            for p in PAGES:
                await pg.goto(BASE + p, wait_until="networkidle")
                await pg.wait_for_timeout(300)
                ov = await pg.evaluate("""() => { const d=document.documentElement; const over=d.scrollWidth - d.clientWidth;
                  const bad=[]; if (over>0) { document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect(); if(r.right>d.clientWidth+1 && getComputedStyle(el).position!=='fixed') bad.push(el.tagName+'.'+el.className.toString().slice(0,40));}); }
                  return {over, bad: bad.slice(0,6)}; }""")
                if ov["over"] > 0:
                    rep["overflow"].append({"w": w, "page": p, **ov})
            for name, p in SHOT.items():
                await pg.goto(BASE + p, wait_until="networkidle")
                await pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
                await pg.wait_for_timeout(1500)
                await pg.screenshot(path=str(SHOTS / f"{name}-{tag}.png"), full_page=False)
                if name in ("home", "scorecard", "fake-news", "trump-watch", "movement-watch", "record-2020", "opinion", "unsupported") + NEW:
                    await pg.screenshot(path=str(SHOTS / f"{name}-{tag}-full.png"), full_page=True)
            await ctx.close()
        await b.close()
    # local link check
    for f in ROOT.rglob("*.html"):
        if "docs" in f.parts: continue
        txt = f.read_text(encoding="utf-8", errors="ignore")
        for m in re.finditer(r'(?:href|src)="([^"]+)"', txt):
            u = m.group(1)
            if u.startswith(("http", "mailto:", "#", "data:")): continue
            path = u.split("#")[0].split("?")[0]
            if not path: continue
            tgt = (ROOT / path.lstrip("/")) if path.startswith("/") else (f.parent / path)
            if not tgt.exists(): rep["broken_local"].append(f"{f.name} -> {u}")
        # anchors
        for m in re.finditer(r'href="(?:([\w.-]+\.html))?#([\w-]+)"', txt):
            page_, anc = m.group(1) or f.name, m.group(2)
            t = (ROOT / page_)
            if t.exists() and f'id="{anc}"' not in t.read_text(encoding="utf-8", errors="ignore"):
                rep["broken_local"].append(f"{f.name} -> {page_}#{anc} (missing anchor)")
    rep["broken_local"] = sorted(set(rep["broken_local"]))
    print(json.dumps(rep, indent=1)[:6000])
    Path("/workspace/site-from-checkpoint/qa-report.json").write_text(json.dumps(rep, indent=1))
asyncio.run(main())
