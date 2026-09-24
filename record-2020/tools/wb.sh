#!/bin/bash
# usage: wb.sh URL -> prints closest wayback snapshot
u="$1"; curl -s --max-time 30 "https://archive.org/wayback/available?url=$(python3 -c 'import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=""))' "$u")" | python3 -c 'import json,sys;d=json.load(sys.stdin);s=d.get("archived_snapshots",{}).get("closest");print(s["url"] if s else "NONE")'
