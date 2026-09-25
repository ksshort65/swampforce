import asyncio
from playwright.async_api import async_playwright
PAGES=["journal.html","journal-find-them.html","journal-they-forgot-who-they-work-for.html","journal-they-work-for-us.html","article-v.html"]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w in (390,400,1280):
            pg=await b.new_page(viewport={"width":w,"height":860}, device_scale_factor=2 if w==400 else 1)
            for u in PAGES:
                await pg.goto("http://127.0.0.1:8944/"+u); await pg.wait_for_timeout(1500)
                ov=await pg.evaluate("""()=>{const d=document.documentElement;const o=d.scrollWidth-d.clientWidth;const bad=[];if(o>0){document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>d.clientWidth+1)bad.push(e.tagName+'.'+e.className+':'+(e.textContent||'').slice(0,40))})}return [o,bad.slice(0,5)]}""")
                if ov[0]>0: print(w,u,ov)
                if w==400 and u in ("journal-find-them.html","article-v.html"):
                    name="find-them-phone" if "find" in u else "article-v-phone"
                    await pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))"); await pg.wait_for_timeout(1500)
                    await pg.screenshot(path=f"/workspace/site-from-checkpoint/shots/{name}.png", full_page=True)
                    await pg.screenshot(path=f"/workspace/site-from-checkpoint/shots/{name}-top.png", full_page=False)
            await pg.close()
        await b.close()
asyncio.run(main())
print("ok")
