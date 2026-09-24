import re,sys,glob,os
def conv(path, chunk=20):
    lines=open(path,encoding='utf-8').read().split('\n')
    out=[];cur_t=None;seen=[]
    words=[];bucket_start=None
    res=[]
    t=None
    for i,l in enumerate(lines):
        m=re.match(r'(\d+):(\d+):(\d+)\.\d+ -->',l)
        if m:
            t=int(m[1])*3600+int(m[2])*60+int(m[3]);continue
        if t is None or not l.strip() or '<c>' in l: 
            # lines with <c> tags are the progressive ones; skip, take plain lines
            continue
        txt=re.sub(r'<[^>]+>','',l).strip()
        if seen and txt==seen[-1]: continue
        seen.append(txt)
        if bucket_start is None: bucket_start=t
        if t-bucket_start>=chunk and words:
            res.append((bucket_start,' '.join(words)));words=[];bucket_start=t
        words.append(txt)
    if words: res.append((bucket_start,' '.join(words)))
    return '\n'.join(f'[{s//60:02d}:{s%60:02d}] {w}' for s,w in res)
if __name__=='__main__':
    for p in sys.argv[1:]:
        o=p.replace('.en-orig.vtt','.txt')
        open(o,'w').write(conv(p))
