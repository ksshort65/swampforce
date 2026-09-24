import json,sys,datetime
F='/workspace/reverify/results.jsonl'
def rec(iid,**kw):
    kw['Item_ID']=str(iid); kw['_ts']=datetime.datetime.now().isoformat(timespec='seconds')
    open(F,'a').write(json.dumps(kw,ensure_ascii=False)+'\n')
# Outcome codes
VC='Verified by SwampForce + independently confirmed'
V='Verified by SwampForce (no approved checker covered it)'
W='Could not verify against a primary source, move to the watch list'
R='Evidence contradicts the case, remove'
U='Reclassify as Unsupported'
