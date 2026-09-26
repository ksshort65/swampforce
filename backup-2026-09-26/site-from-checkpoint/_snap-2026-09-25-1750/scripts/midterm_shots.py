import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright
B = "http://127.0.0.1:8932/"; O = Path("/workspace/site-from-checkpoint/shots")
async def scrollall(m):
    h = await m.evaluate("document.body.scrollHeight")
    for y in range(0, h, 500):
        await m.evaluate(f"window.scrollTo(0,{y})"); await m.wait_for_timeout(120)
    await m.wait_for_timeout(1200); await m.evaluate("window.scrollTo(0,0)"); await m.wait_for_timeout(300)
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        m = await (await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)).new_page()
        errs = []
        m.on("console", lambda msg: errs.append(msg.text) if msg.type == "error" else None)
        await m.goto(B + "scorecard.html", wait_until="networkidle"); await m.wait_for_timeout(1200)
        await m.screenshot(path=str(O / "midterms-phone-top.png"))
        await scrollall(m); await m.screenshot(path=str(O / "midterms-phone-full.png"), full_page=True)
        for tab in ("dem", "split", "compare"):
            await m.click(f'button[data-tab="tab-{tab}"]'); await m.wait_for_timeout(900)
            await scrollall(m); await m.screenshot(path=str(O / f"midterms-phone-{tab}.png"), full_page=True)
        w = await m.evaluate("document.documentElement.scrollWidth")
        await m.goto(B + "index.html", wait_until="networkidle"); await m.wait_for_timeout(800)
        await m.evaluate("document.querySelector('.mt-home').scrollIntoView()")
        await m.screenshot(path=str(O / "home-midterms-band-phone.png"))
        print("scrollWidth", w, "console errors", errs)
        await b.close()
asyncio.run(main())
