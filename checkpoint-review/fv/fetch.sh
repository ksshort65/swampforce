#!/bin/bash
# usage: fetch.sh name url
n=$1; u=$2; mkdir -p ev/raw
code=$(curl -sL -m 60 -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36" -H "Accept-Language: en-US" -o ev/raw/$n -w "%{http_code}|%{content_type}|%{url_effective}" "$u")
ct=$(head -c 4 ev/raw/$n 2>/dev/null | grep -q "%PDF" && echo application/pdf || echo html)
if [[ "$ct" == "application/pdf" ]]; then pdftotext -layout ev/raw/$n ev/$n.txt 2>/dev/null; else python3 -c "
import re,html,sys
t=open('ev/raw/$n',errors='ignore').read()
t=re.sub(r'(?is)<(script|style|noscript).*?</\1>','',t)
t=re.sub(r'(?s)<[^>]+>','\n',t); t=html.unescape(t); t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
open('ev/$n.txt','w').write(t)"; fi
echo "$n|$code|$ct|$(wc -c < ev/$n.txt 2>/dev/null)"
