import sys,asyncio,re,hashlib,os,json,subprocess
from playwright.async_api import async_playwright
OUT='/workspace/media-ratings/src'; LOG='/workspace/media-ratings/logs/url-verify.jsonl'
def slug(u): return re.sub(r'[^a-zA-Z0-9]+','_',u)[8:80]+'_'+hashlib.md5(u.encode()).hexdigest()[:6]
async def main(urls):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--disable-blink-features=AutomationControlled'])
        ctx=await b.new_context(user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36')
        for u in urls:
            pg=await ctx.new_page(); rec={'url':u}
            try:
                if u.lower().endswith('.pdf') or '/dl?' in u or 'download' in u:
                    fn=f"{OUT}/{slug(u)}.pdf"
                    r=subprocess.run(['curl','-sL','-A','Mozilla/5.0','-o',fn,'-w','%{http_code}',u],capture_output=True,text=True,timeout=90)
                    rec['status']=r.stdout; subprocess.run(['pdftotext','-layout',fn,fn[:-4]+'.txt'])
                    t=open(fn[:-4]+'.txt',errors='ignore').read() if os.path.exists(fn[:-4]+'.txt') else ''
                else:
                    r=await pg.goto(u,timeout=45000,wait_until='domcontentloaded')
                    await pg.wait_for_timeout(3000)
                    t=await pg.inner_text('body'); rec['status']=r.status if r else 'NA'; rec['final']=pg.url
                    rec['title']=await pg.title()
                    open(f"{OUT}/{slug(u)}.txt",'w').write(t)
                rec['len']=len(t); rec['file']=slug(u)
            except Exception as e:
                rec['status']='ERROR'; rec['err']=str(e)[:200]
            print(json.dumps(rec)); open(LOG,'a').write(json.dumps(rec)+'\n')
            await pg.close()
        await b.close()
asyncio.run(main(sys.argv[1:]))
