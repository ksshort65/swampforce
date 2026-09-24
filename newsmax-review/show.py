import json,sys,os,subprocess
sys.path.insert(0,'.')
from vtt2txt import conv
for id in sys.argv[1:]:
    if not os.path.exists(f"subs/{id}.info.json"): print("MISSING",id); continue
    j=json.load(open(f'subs/{id}.info.json'))
    print(f"=== {id} | {j['upload_date']} | views {j.get('view_count')} | {j['duration']}s\nTITLE: {j['title']}\nDESC: {j['description'].split('Watch NEWSMAX')[0].strip()}")
    p=f'subs/{id}.en-orig.vtt'
    if os.path.exists(p): print(conv(p,30))
    print()
