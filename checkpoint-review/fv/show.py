import csv,sys
rows=list(csv.DictReader(open('/workspace/checkpoint-review/verified-items.csv')))
for slug in sys.argv[1:]:
    print(open('essays/'+slug+'.md').read())
    for r in rows:
        if slug in (r['Page']+' '+r['Source_File']):
            print('  ITEM',r['Item_No'],r['Verdict'],'|',r['Text'][:90],'|FIX:',r['Fix_Needed'][:300],'|SRC:',r['Best_Source_URL'][:100])
    print('=========')
