import asyncio
from playwright.async_api import async_playwright
B="http://127.0.0.1:8933/"; O="/workspace/site-from-checkpoint/shots/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        m=await b.new_page(viewport={"width":1024,"height":800}); m.on("pageerror", lambda e: errs.append(str(e)))
        await m.goto(B+"index.html",wait_until="networkidle"); await m.wait_for_timeout(1500)
        c=m.locator("#chart-debt-home").locator("xpath=ancestor::div[contains(@class,'chart-card')]"); await c.scroll_into_view_if_needed(); await m.wait_for_timeout(1200)
        await c.screenshot(path=O+"debt-history-home-final.png")
        await m.goto(B+"scorecard.html#compare",wait_until="networkidle"); await m.wait_for_timeout(1500)
        c=m.locator("#chart-debt-history").locator("xpath=ancestor::div[contains(@class,'chart-card')]"); await c.scroll_into_view_if_needed(); await m.wait_for_timeout(1200)
        await c.screenshot(path=O+"debt-history-scorecard-final.png")
        c=m.locator("#mt-debt-all").locator("xpath=ancestor::div[contains(@class,'chart-card')]"); await c.scroll_into_view_if_needed(); await m.wait_for_timeout(1200)
        await c.screenshot(path=O+"debt-by-congress-1857-final.png")
        print("errors", errs); await b.close()
asyncio.run(main())
