import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True); ctx=await b.new_context(accept_downloads=True); pg=await ctx.new_page()
        reqs=[]
        pg.on("request", lambda r: reqs.append(r.url))
        await pg.goto("https://paymentaccuracy.gov/resources",wait_until="networkidle",timeout=60000)
        opts=await pg.eval_on_selector_all("option","els=>els.map(e=>e.value)")
        print(opts[:6])
        for v in [o for o in opts if o.endswith('-data')][:3]:
            await pg.select_option("select", v)
            try:
                async with pg.expect_download(timeout=30000) as di:
                    await pg.click("button.download-button")
                d=await di.value
                fn="src/pa/"+d.suggested_filename; await d.save_as(fn); print("saved",fn, d.url)
            except Exception as e: print("ERR",v,e)
        print([r for r in reqs if 'xlsx' in r or 'download' in r.lower()][:5])
        await b.close()
asyncio.run(main())
