import sys, asyncio
from playwright.async_api import async_playwright
async def main(urls, outdir):
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=False, args=["--disable-blink-features=AutomationControlled"])
        ctx = await b.new_context(user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
        pg = await ctx.new_page()
        for i,u in enumerate(urls):
            try:
                r = await pg.goto(u, wait_until="domcontentloaded", timeout=45000)
                await pg.wait_for_timeout(2500)
                t = await pg.inner_text("body")
                title = await pg.title()
                st = r.status if r else None
                fn = f"{outdir}/pw_{abs(hash(u))%10**8}.txt"
                open(fn,"w").write(u+"\n"+title+"\n"+t)
                print(st, title[:90], fn, u)
            except Exception as e:
                print("ERR", u, e)
        await b.close()
asyncio.run(main(sys.argv[2:], sys.argv[1]))
