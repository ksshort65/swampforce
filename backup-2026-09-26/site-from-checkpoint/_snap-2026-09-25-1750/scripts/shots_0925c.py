import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
B="http://127.0.0.1:8931/"; O=Path("/workspace/site-from-checkpoint/shots")
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        m=await (await b.new_context(viewport={"width":390,"height":844}, device_scale_factor=2)).new_page()
        await m.goto(B+"index.html", wait_until="networkidle"); await m.wait_for_timeout(1500)
        await m.screenshot(path=str(O/"0925c-home-390-top.png"))
        el=await m.query_selector("#front-blame")
        for y in range(0, 6000, 300):
            await m.evaluate(f"window.scrollTo(0,{y})"); await m.wait_for_timeout(120)
        await m.wait_for_timeout(2500)
        await m.add_style_tag(content="header,.mast,.site-head{position:static!important}")
        bb=await el.bounding_box(); sy=await m.evaluate("window.scrollY")
        await m.screenshot(path=str(O/"0925c-home-390-fakenews-block.png"), full_page=True, clip={"x":0,"y":bb["y"]+sy,"width":390,"height":min(bb["height"],1900)})
        print("390 scrollWidth", await m.evaluate("document.documentElement.scrollWidth"))
        d=await (await b.new_context(viewport={"width":1024,"height":640})).new_page()
        await d.goto(B+"index.html", wait_until="networkidle"); await d.wait_for_timeout(800)
        print("1024: hero h, band top", await d.evaluate("[document.querySelector('.hero').getBoundingClientRect().height, document.querySelector('#front').getBoundingClientRect().top, document.querySelector('.pull-view').getBoundingClientRect().top]"))
        await b.close()
asyncio.run(main())
