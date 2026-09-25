import sys, re, xml.etree.ElementTree as ET, subprocess, collections, os
UA="Mozilla/5.0"
def get(url, fn):
    if not os.path.exists(fn) or os.path.getsize(fn)<500:
        subprocess.run(["curl","-sL","-A",UA,"-o",fn,url])
    return open(fn,encoding="utf-8",errors="replace").read()
def house(year, n):
    t=get(f"https://clerk.house.gov/evs/{year}/roll{n:03d}.xml", f"h{year}-{n}.xml")
    r=ET.fromstring(t.encode()); m=r.find("vote-metadata")
    out=[f"HOUSE {year} roll {n}: {m.findtext('legis-num')} | {m.findtext('vote-question')} | {m.findtext('vote-desc')} | {m.findtext('action-date')} | {m.findtext('vote-result')}"]
    for p in m.findall("vote-totals/totals-by-party"):
        out.append(f"  {p.findtext('party')}: yea {p.findtext('yea-total')} nay {p.findtext('nay-total')} present {p.findtext('present-total')} nv {p.findtext('not-voting-total')}")
    tt=m.find("vote-totals/totals-by-vote")
    out.append(f"  TOTAL: yea {tt.findtext('yea-total')} nay {tt.findtext('nay-total')} present {tt.findtext('present-total')} nv {tt.findtext('not-voting-total')}")
    print("\n".join(out))
def senate(cong, sess, n):
    t=get(f"https://www.senate.gov/legislative/LIS/roll_call_votes/vote{cong}{sess}/vote_{cong}_{sess}_{n:05d}.xml", f"s{cong}-{sess}-{n}.xml")
    r=ET.fromstring(t.encode())
    print(f"SENATE {cong}-{sess} vote {n}: {r.findtext('vote_date')} | {r.findtext('vote_question_text')} | {r.findtext('vote_title')} | {r.findtext('vote_result_text')}")
    c=collections.Counter((m.findtext('party'), m.findtext('vote_cast')) for m in r.findall('members/member'))
    print("  ", dict(sorted(c.items())))
for a in sys.argv[1:]:
    p=a.split(":")
    try:
        if p[0]=="h": house(int(p[1]),int(p[2]))
        else: senate(int(p[1]),int(p[2]),int(p[3]))
    except Exception as ex: print("ERR",a,ex)
