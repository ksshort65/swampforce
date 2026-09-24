#!/bin/bash
export PATH=$HOME/.deno/bin:$PATH
cd /workspace/newsmax-review
for id in $(cat "$1"); do
  if [ -f subs/$id.en-orig.vtt ]; then continue; fi
  python3 -m yt_dlp --skip-download --write-auto-subs --sub-langs "en-orig" --sub-format vtt -o "subs/%(id)s.%(ext)s" --write-info-json -q --no-warnings "https://www.youtube.com/watch?v=$id" 2>>raw/subs.err
  if [ -f subs/$id.en-orig.vtt ]; then echo "OK $id"; else echo "FAIL $id"; sleep 60; fi
  sleep 8
done
echo DONE
