import asyncio, subprocess, time, socket
from pathlib import Path
from playwright.async_api import async_playwright
PUB = Path("/workspace/site-from-checkpoint/public_html"); O = Path("/workspace/site-from-checkpoint/shots")
PORT = 8937
async def main():
    srv = subprocess.Popen(["python3", "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=PUB, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await pw.chromium.launch()
            m = await (await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)).new_page()
            await m.goto(f"http://127.0.0.1:{PORT}/scorecard.html", wait_until="networkidle")
            await m.add_style_tag(content="header,.mast,.site-head,.sticky-tabs{position:static!important}")
            out = []
            for tab, cls in (("gop", "R"), ("dem", "D"), ("split", "S")):
                await m.click(f'button[data-tab="tab-{tab}"]'); await m.wait_for_timeout(300)
                await m.evaluate(f"document.querySelector('#tab-{tab} .mt-rows').open = true")
                for y in range(0, 4000, 400):
                    await m.evaluate(f"window.scrollTo(0,{y})"); await m.wait_for_timeout(60)
                await m.wait_for_timeout(1800)  # count-up animations finish
                hero = await m.evaluate("(()=>{const r=document.querySelector('.stat-rail').getBoundingClientRect();return [r.top+scrollY,r.height]})()")
                rows = await m.evaluate(f"(()=>{{const r=document.querySelector('#tab-{tab} .mt-rows').getBoundingClientRect();return [r.top+scrollY,r.height]}})()")
                tiles = await m.evaluate("[...document.querySelectorAll('.stat-rail .num')].map(n=>n.textContent)")
                col = await m.evaluate(f"[document.querySelector('#tab-{tab} .mt-debt-num').textContent, document.querySelector('#tab-{tab} .mt-rows summary').textContent, document.querySelector('#tab-{tab} .mt-rows tfoot').textContent]")
                out.append((tab, tiles, col))
                p1 = O / f"0925d-congress-debt-390-tiles.png"
                p2 = O / f"0925d-congress-debt-390-{tab}-dropdown-open.png"
                if tab == "gop":
                    await m.screenshot(path=str(p1), full_page=True, clip={"x": 0, "y": hero[0] - 170, "width": 390, "height": hero[1] + 230})
                    await m.screenshot(path=str(O / "0925d-congress-debt-390-gop-tiles-and-dropdown.png"), full_page=True,
                                       clip={"x": 0, "y": hero[0] - 170, "width": 390, "height": rows[0] + rows[1] - hero[0] + 190})
                await m.screenshot(path=str(p2), full_page=True, clip={"x": 0, "y": rows[0] - 190, "width": 390, "height": rows[1] + 210})
            for o in out: print(o)
            print("scrollWidth", await m.evaluate("document.documentElement.scrollWidth"))
            await b.close()
    finally:
        srv.terminate()
asyncio.run(main())
