import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright
B="http://127.0.0.1:8931/"; O=Path("/workspace/site-from-checkpoint/shots/review"); O.mkdir(parents=True, exist_ok=True)
JOBS=[("index.html",".lawmaker-band","home-lawmaker"),("index.html",".chart-grid","home-charts"),("index.html",".merch-band","home-merch"),
("index.html",".spine","home-spine"),("fake-news.html","#filters","fn-filters"),("scorecard.html","#tab-dem","sc-dem"),
("store.html","main","store-main"),("brief.html","main","brief-main"),("betrayal.html",".chart-grid","betrayal-charts"),("lawfare.html",".doc-grid","lawfare")]
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); pg=await (await b.new_context(viewport={"width":1280,"height":900})).new_page()
        for url,sel,name in JOBS:
            await pg.goto(B+url, wait_until="networkidle")
            await pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
            if name=="sc-dem": await pg.click('button[data-tab="tab-dem"]')
            if name=="fn-filters":
                await pg.click('#case-1 .frame-head') if await pg.query_selector('#case-1') else None
            await pg.wait_for_timeout(1300)
            el=await pg.query_selector(sel)
            await el.screenshot(path=str(O/f"{name}.png"))
        # fake news with an open card
        await pg.goto(B+"fake-news.html#filters", wait_until="networkidle"); await pg.wait_for_timeout(800)
        first=await pg.query_selector('.frame.case .frame-head'); await first.click(); await pg.wait_for_timeout(500)
        card=await pg.query_selector('.frame.case.open'); await card.screenshot(path=str(O/"fn-card-open.png"))
        await b.close()
asyncio.run(main())
