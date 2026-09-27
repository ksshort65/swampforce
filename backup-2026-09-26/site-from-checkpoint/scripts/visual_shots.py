import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
B = "http://127.0.0.1:8933/"; O = Path("/workspace/site-from-checkpoint/shots")
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        m = await (await b.new_context(viewport={"width": 1366, "height": 900})).new_page()
        errs = []; m.on("console", lambda msg: errs.append(msg.text) if msg.type == "error" else None)
        await m.goto(B + "scorecard.html#debt-eras", wait_until="networkidle"); await m.wait_for_timeout(1500)
        await m.evaluate("document.getElementById('debt-history').scrollIntoView()"); await m.wait_for_timeout(500)
        el = m.locator("#debt-history"); y0 = await el.evaluate("e=>e.getBoundingClientRect().top+scrollY")
        y1 = await m.evaluate("(()=>{var a=[...document.querySelectorAll('#tab-compare .period-note')].find(p=>p.textContent.includes('Check it yourself'));return a.getBoundingClientRect().bottom+scrollY})()")
        h = y1 - y0 + 20; mid = y0 + min(h, 2400)
        await m.screenshot(path=str(O / "debt-history.png"), full_page=True, clip={"x": 0, "y": y0 - 10, "width": 1366, "height": min(h, 2400)})
        if h > 2400:
            await m.screenshot(path=str(O / "debt-history-2.png"), full_page=True, clip={"x": 0, "y": mid - 10, "width": 1366, "height": h - 2400 + 20})
        for pg, name in (("index.html", "home-visual"), ("fake-news.html", "fake-news-visual"), ("lawfare.html", "lawfare-visual")):
            await m.goto(B + pg, wait_until="networkidle"); await m.wait_for_timeout(800)
            for yy in range(0, 4000, 400):
                await m.evaluate(f"window.scrollTo(0,{yy})"); await m.wait_for_timeout(150)
            await m.evaluate("window.scrollTo(0,0)"); await m.wait_for_timeout(1200)
            await m.screenshot(path=str(O / f"{name}.png"), full_page=False, clip={"x": 0, "y": 0, "width": 1366, "height": 1800}) if False else await m.screenshot(path=str(O / f"{name}.png"), clip={"x": 0, "y": 0, "width": 1366, "height": 1800}, full_page=True)
        mob = await (await b.new_context(viewport={"width": 390, "height": 844})).new_page()
        over = []
        for pg in ("index.html", "fake-news.html", "lawfare.html", "scorecard.html", "energy.html", "appendix.html"):
            await mob.goto(B + pg, wait_until="networkidle"); await mob.wait_for_timeout(500)
            w = await mob.evaluate("document.documentElement.scrollWidth")
            if w > 391: over.append((pg, w))
        print("console errors", errs, "mobile overflow", over)
        await b.close()
asyncio.run(main())
