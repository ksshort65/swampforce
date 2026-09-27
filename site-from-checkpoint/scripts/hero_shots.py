import asyncio
from playwright.async_api import async_playwright
B="http://127.0.0.1:8933/"; O="/workspace/site-from-checkpoint/shots/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w,h in [(1024,640),(1280,800),(1440,900),(390,844)]:
            m=await b.new_page(viewport={"width":w,"height":h})
            await m.goto(B+"index.html",wait_until="networkidle"); await m.wait_for_timeout(800)
            if w==1024: await m.screenshot(path=O+"home-top-1024-final.png")
            await m.locator("section.hero").screenshot(path=O+f"hero-{w}-final.png")
            await m.close()
        await b.close()
asyncio.run(main())
