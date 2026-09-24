import csv
def load():
    rows=[]
    for t,f in [('first','snapshot/first-term-trump-admin-media-deception.csv'),('later','snapshot/later-second-term-trump-admin-media-deception.csv')]:
        for r in csv.DictReader(open(f,encoding='utf-8-sig')):
            r['_term']=t; rows.append(r)
    return rows
