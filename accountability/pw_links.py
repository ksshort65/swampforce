import sys,asyncio
from playwright.async_api import async_playwright
async def main(u):
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True); pg=await b.new_page()
        await pg.goto(u,wait_until="networkidle",timeout=60000)
        links=await pg.eval_on_selector_all("a","els=>els.map(e=>[e.innerText.trim().slice(0,60),e.href])")
        for t,h in links:
            print(t,"|",h)
        await b.close()
asyncio.run(main(sys.argv[1]))
