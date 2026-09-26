import asyncio
from playwright.async_api import async_playwright
B = "http://127.0.0.1:8933/"; O = "/workspace/site-from-checkpoint/shots/"
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); m = await (await b.new_context(viewport={"width": 1366, "height": 900})).new_page()
        for pg, fn in [("index.html", "home-final.png"), ("unverified.html", "unverified-final.png"), ("lawfare.html#lf-charts", "lawfare-final.png")]:
            await m.goto(B + pg, wait_until="networkidle"); await m.wait_for_timeout(1800)
            await m.screenshot(path=O + fn)
        await m.goto(B + "scorecard.html#compare", wait_until="networkidle"); await m.wait_for_timeout(1500)
        el = m.locator("#mt-debt-all").first
        if await el.count():
            await el.scroll_into_view_if_needed(); await m.wait_for_timeout(1500)
        await m.screenshot(path=O + "midterm-final.png")
        await m.goto(B + "unverified.html#uv-media", wait_until="networkidle"); await m.wait_for_timeout(1500)
        await m.screenshot(path=O + "unverified-media-final.png")
        await m.goto(B + "lawfare.html#scrutiny", wait_until="networkidle"); await m.wait_for_timeout(1800)
        await m.screenshot(path=O + "lawfare-scrutiny-final.png")
        await m.goto(B + "unverified.html#uv-flawed", wait_until="networkidle"); await m.wait_for_timeout(1800)
        await m.screenshot(path=O + "unverified-flawed-final.png")
        await m.goto(B + "democrats.html#biden-bank-reports", wait_until="networkidle"); await m.wait_for_timeout(1800)
        await m.screenshot(path=O + "biden-bank-reports-final.png")
        await m.goto(B + "betrayal.html", wait_until="networkidle"); await m.wait_for_timeout(1200)
        el = m.locator("text=We are stripped of our ability").first
        if await el.count():
            await el.scroll_into_view_if_needed(); await m.evaluate("window.scrollBy(0, -120)"); await m.wait_for_timeout(800)
        await m.screenshot(path=O + "betrayal-informed-consent-final.png")
        await m.goto(B + "democrats.html#biden-foreign-by-country", wait_until="networkidle"); await m.wait_for_timeout(1800)
        await m.screenshot(path=O + "foreign-money-final.png")
        await m.goto(B + "lawfare.html#referrals", wait_until="networkidle"); await m.wait_for_timeout(1800)
        await m.screenshot(path=O + "referrals-final.png")
        await m.goto(B + "lawfare.html#impeachments", wait_until="networkidle"); await m.wait_for_timeout(1500)
        await m.screenshot(path=O + "impeachments-final.png")
        for pg, nm in [("lawfare.html#nyf-ordered", "nyfraud"), ("lawfare.html#nyf-mal", "maralago"), ("trump-watch.html#tw-salary", "trump-money"), ("accountability-trading.html", "trading-salary")]:
            await m.goto(B + pg, wait_until="networkidle"); await m.wait_for_timeout(1500)
            await m.screenshot(path=O + nm + "-final.png")
        await b.close()
asyncio.run(main())
