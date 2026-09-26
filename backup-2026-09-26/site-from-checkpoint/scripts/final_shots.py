import asyncio
from playwright.async_api import async_playwright
B = "http://127.0.0.1:8933/"; O = "/workspace/site-from-checkpoint/shots/"
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); m = await (await b.new_context(viewport={"width": 1366, "height": 900})).new_page()
        for pg, fn in [("index.html", "home-final.png"), ("unverified.html", "unverified-final.png"), ("lawfare.html#lf-charts", "lawfare-final.png")]:
            await m.goto(B + pg, wait_until="networkidle"); await m.wait_for_timeout(1800)
            await m.screenshot(path=O + fn)
        await b.close()
asyncio.run(main())
