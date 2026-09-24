import sys,subprocess,json,urllib.parse
urls=[l.strip() for l in open(sys.argv[1]) if l.strip()]
for u in urls:
    res="NONE"
    for variant in [u, u.replace('/archives/opa/','/opa/')]:
        q="https://web.archive.org/cdx/search/cdx?url="+urllib.parse.quote(variant,safe='')+"&output=json&filter=statuscode:200&limit=-1"
        r=subprocess.run(["curl","-s","--max-time","120",q],capture_output=True,text=True)
        try:
            d=json.loads(r.stdout)
            if len(d)>1:
                ts=d[-1][1]; orig=d[-1][2]; res=f"https://web.archive.org/web/{ts}/{orig}"; break
        except Exception as e:
            res="ERR "+r.stdout[:80]
    print(u,"=>",res,flush=True)
