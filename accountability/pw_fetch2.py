import sys, asyncio, re, hashlib
from playwright.async_api import async_playwright
async def main(outdir, urls):
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", viewport={"width":1280,"height":900})
        pg = await ctx.new_page()
        for u in urls:
            try:
                await pg.goto(u, wait_until="domcontentloaded", timeout=45000)
                for k in range(6):
                    await pg.wait_for_timeout(2500)
                    title = await pg.title()
                    if "Homepage" not in title: break
                t = await pg.inner_text("body")
                fn = f"{outdir}/pw_{hashlib.md5(u.encode()).hexdigest()[:10]}.txt"
                open(fn,"w").write(u+"\n"+title+"\n"+t)
                print("OK" if "Homepage" not in title else "BLOCKED", "|", title[:100], "|", fn, "|", u, flush=True)
            except Exception as e:
                print("ERR", u, e, flush=True)
        await b.close()
asyncio.run(main(sys.argv[1], sys.argv[2:]))
