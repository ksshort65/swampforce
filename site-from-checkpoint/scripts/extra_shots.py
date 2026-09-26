import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
B="http://127.0.0.1:8931/"; O=Path("/workspace/site-from-checkpoint/shots")
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        ctx=await b.new_context(viewport={"width":1280,"height":900})
        js=(Path("public_html/assets/store.js").read_text()).replace('var PRINTIFY_POPUP_URL = "";','var PRINTIFY_POPUP_URL = "https://example.com/";')
        pg=await ctx.new_page()
        await pg.route("**/assets/store.js", lambda r: r.fulfill(body=js, content_type="application/javascript"))
        await pg.goto(B+"store.html", wait_until="networkidle"); await pg.wait_for_timeout(800)
        await pg.screenshot(path=str(O/"review/store-live-test.png"), full_page=True)
        print("live visible:", await pg.is_visible("#store-live"), "placeholder:", await pg.is_visible("#store-placeholder"))
        m=await (await b.new_context(viewport={"width":390,"height":844}, device_scale_factor=2)).new_page()
        await m.goto(B+"index.html", wait_until="networkidle")
        t=await m.query_selector(".menu-toggle, #menu-toggle, button[aria-controls]")
        await t.click(); await m.wait_for_timeout(500)
        await m.screenshot(path=str(O/"home-mobile-menu-open.png"))
        await b.close()
asyncio.run(main())
