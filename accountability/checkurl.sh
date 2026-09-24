#!/bin/bash
# usage: checkurl.sh url...  -> prints status code and url
for u in "$@"; do
  code=$(curl -s -o /dev/null -L --max-time 25 -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36" -w "%{http_code}" "$u")
  echo "$code $u"
done
