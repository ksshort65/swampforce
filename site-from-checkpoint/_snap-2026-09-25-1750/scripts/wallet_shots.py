"""390px screenshots: wallet-votes section on scorecard.html and the state fuel-tax section on gas-gap.html."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
B = "http://127.0.0.1:8933/"; O = Path("/workspace/site-from-checkpoint/shots")
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        m = await (await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)).new_page()
        errs = []
        m.on("console", lambda msg: errs.append(msg.text) if msg.type == "error" else None)
        await m.goto(B + "scorecard.html", wait_until="networkidle"); await m.wait_for_timeout(1000)
        await m.evaluate("window.scrollTo(0, document.getElementById('wallet').getBoundingClientRect().top + scrollY - 84)"); await m.wait_for_timeout(600)
        await m.screenshot(path=str(O / "wallet-votes-phone-top.png"))
        await m.click("#wallet-tips > summary"); await m.mouse.move(2, 400); await m.wait_for_timeout(500)
        await m.locator("#wallet-tips").screenshot(path=str(O / "wallet-votes-phone-card-tips.png"))
        w1 = await m.evaluate("document.documentElement.scrollWidth")
        await m.goto(B + "gas-gap.html", wait_until="networkidle"); await m.wait_for_timeout(800)
        await m.evaluate("document.getElementById('gg-state').scrollIntoView()"); await m.wait_for_timeout(600)
        await m.locator("#gg-state").screenshot(path=str(O / "gas-gap-state-taxes-phone.png"))
        w2 = await m.evaluate("document.documentElement.scrollWidth")
        print("scrollWidth", w1, w2, "console errors", errs)
        await b.close()
asyncio.run(main())
