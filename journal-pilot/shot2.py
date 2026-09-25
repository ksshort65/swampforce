import asyncio, sys
from playwright.async_api import async_playwright
OUT="/workspace/site-from-checkpoint/shots/"
SHOTS={"index.html":"home","journal.html":"journal-hub","journal-find-them.html":"find-them","journal-fema-ran-two-jobs.html":"fema-ran-two-jobs","store.html":"store"}
CHECK=list(SHOTS)+["journal-the-pool.html","journal-they-work-for-us.html","journal-the-democrat-ledger.html","journal-sixty-percent.html"]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w in (320,390,1280):
            pg=await b.new_page(viewport={"width":w,"height":844}, device_scale_factor=2 if w==390 else 1)
            for u in CHECK:
                await pg.goto("http://127.0.0.1:8944/"+u); await pg.wait_for_timeout(900)
                ov=await pg.evaluate("""()=>{const d=document.documentElement;const o=d.scrollWidth-d.clientWidth;const bad=[];if(o>0){document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>d.clientWidth+1)bad.push(e.tagName+'.'+e.className+':'+(e.textContent||'').slice(0,40))})}return [o,bad.slice(0,5)]}""")
                if ov[0]>0: print("OVERFLOW",w,u,ov)
                if u in SHOTS and w in (390,1280):
                    await pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))"); await pg.wait_for_timeout(1200)
                    tag="phone" if w==390 else "desktop"
                    await pg.screenshot(path=f"{OUT}{SHOTS[u]}-{tag}-top.png", full_page=False)
                    if w==390 and u.startswith("journal-"): await pg.screenshot(path=f"{OUT}{SHOTS[u]}-phone-full.png", full_page=True)
                if u=="index.html" and w==320: await pg.screenshot(path=f"{OUT}home-320-top.png")
            await pg.close()
        await b.close()
asyncio.run(main()); print("ok")
