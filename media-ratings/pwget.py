import sys,asyncio
from playwright.async_api import async_playwright
async def main(u,out):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--disable-blink-features=AutomationControlled'])
        ctx=await b.new_context(user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',accept_downloads=True)
        pg=await ctx.new_page()
        try:
            await pg.goto('/'.join(u.split('/')[:3]),timeout=45000); await pg.wait_for_timeout(3000)
        except Exception as e: print('home err',e)
        r=await ctx.request.get(u,timeout=60000)
        body=await r.body(); open(out,'wb').write(body); print(r.status,len(body),body[:8])
        await b.close()
asyncio.run(main(sys.argv[1],sys.argv[2]))
