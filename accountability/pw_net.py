import sys,asyncio
from playwright.async_api import async_playwright
async def main(u):
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True); pg=await b.new_page()
        urls=[]
        pg.on("response", lambda r: urls.append((r.status,r.url)))
        await pg.goto(u,wait_until="networkidle",timeout=60000)
        await pg.wait_for_timeout(3000)
        txt=await pg.inner_text("body")
        print(txt[:3000])
        for s,x in urls:
            if 'paymentaccuracy' in x and not x.endswith(('.js','.css','.woff2','.svg','.png')): print(s,x)
        await b.close()
asyncio.run(main(sys.argv[1]))
