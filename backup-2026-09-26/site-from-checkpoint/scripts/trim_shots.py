import asyncio
from playwright.async_api import async_playwright
B = "http://127.0.0.1:8933/"; O = "/workspace/site-from-checkpoint/shots/"
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); m = await (await b.new_context(viewport={"width": 1366, "height": 900})).new_page()
        await m.goto(B + "index.html", wait_until="networkidle"); await m.wait_for_timeout(1200)
        await m.screenshot(path=O + "home-trimmed.png")
        await m.evaluate("window.scrollTo(0, 450)"); await m.wait_for_timeout(600); await m.screenshot(path=O + "home-bg.png")
        await m.goto(B + "betrayal.html", wait_until="networkidle"); await m.wait_for_timeout(1200)
        await m.locator("#how-we-verify").screenshot(path=O + "verify-bullets.png")
        for pg, sel, fn in [("lawfare.html", "#lf-charts", "charts-lawfare.png"), ("scorecard.html#compare", "#chart-debt-history", "charts-debt-history.png"),
                            ("unverified.html", ".uv-card", "charts-unverified.png"), ("trump-watch.html", ".ac-card", "charts-auto-section.png")]:
            await m.goto(B + pg, wait_until="networkidle"); await m.wait_for_timeout(1500)
            el = m.locator(sel).first
            if await el.count():
                await el.scroll_into_view_if_needed(); await m.wait_for_timeout(1200)
                t = el if sel != "#chart-debt-history" else m.locator(sel).locator("xpath=ancestor::div[contains(@class,'chart-card')][1]")
                await t.screenshot(path=O + fn)
        await b.close()
asyncio.run(main())
