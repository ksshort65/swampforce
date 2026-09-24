import sys,asyncio
from playwright.async_api import async_playwright
async def main(urls):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--disable-blink-features=AutomationControlled'])
        ctx=await b.new_context(user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36')
        for u in urls:
            pg=await ctx.new_page()
            try:
                r=await pg.goto(u,timeout=45000,wait_until='domcontentloaded')
                await pg.wait_for_timeout(2500)
                t=await pg.inner_text('body')
                print(f"@@URL {u} STATUS {r.status if r else 'NA'} LEN {len(t)}")
                if len(sys.argv)>0: open('/tmp/pw_last.txt','a').write(f"\n@@URL {u}\n"+t)
            except Exception as e:
                print(f"@@URL {u} ERROR {e}")
            await pg.close()
        await b.close()
asyncio.run(main(sys.argv[1:]))
