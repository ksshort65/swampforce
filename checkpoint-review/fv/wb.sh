u="$1"; e=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$u")
r=$(curl -s -m 40 "http://archive.org/wayback/available?url=$e" | python3 -c 'import json,sys
try:
 d=json.load(sys.stdin);s=d.get("archived_snapshots",{}).get("closest",{});print(s.get("status"),s.get("url"),s.get("timestamp"))
except Exception as ex: print("ERR")')
echo "$u	$r"
