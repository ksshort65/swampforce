#!/usr/bin/env python3
"""Writes incoming/manifest.js from the incoming/ folders (used when the site is opened without PHP)."""
import json, os, re, urllib.parse
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'incoming')
out = {}
for sec in ('betrayal', 'scorecard'):
    d = os.path.join(root, sec)
    for chart in sorted(os.listdir(d)):
        cd = os.path.join(d, chart)
        if not os.path.isdir(cd): continue
        items = []
        for f in sorted(os.listdir(cd)):
            if not re.search(r'\.(jpe?g|png|webp|gif)$', f, re.I): continue
            url = None
            up = os.path.join(cd, f + '.url')
            if os.path.isfile(up):
                first = open(up, encoding='utf-8', errors='ignore').readline().strip()
                if re.match(r'https?://', first, re.I): url = first
            items.append({'img': f'incoming/{sec}/{chart}/' + urllib.parse.quote(f), 'url': url})
        out[f'{sec}/{chart}'] = items
open(os.path.join(root, 'manifest.js'), 'w').write('window.SF_INCOMING=' + json.dumps(out) + ';\n')
print('manifest written:', sum(len(v) for v in out.values()), 'images')
