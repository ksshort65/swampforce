import csv,re,json
from urllib.parse import urlparse
from sweep_lib import isprim
from specs1 import w
R=list(csv.DictReader(open('../verified-items.csv')))
claims={}
for x in R:
    m=re.match(r'CLAIM: (.*?) \| TRUTH: ?(.*)$',x['Text'],re.S)
    if m and x['Source_File']=='src/lib/ledgers.ts': claims.setdefault(m.group(1).strip(),[]).append(x)
IAEA8='https://www.iaea.org/sites/default/files/gov2026-8.pdf'
CSPAN='https://www.c-span.org/video/?507744-1/president-trump-speaks-rally-washington-dc'
J6='https://www.govinfo.gov/app/details/GPO-J6-REPORT'
LOOT='https://web.archive.org/web/20200531015829/https://mobile.twitter.com/realDonaldTrump/status/1266231100780744704'
AH='https://law.justia.com/cases/federal/appellate-courts/ca2/23-793/23-793-2024-12-30.html'
DEB2='https://www.debates.org/voter-education/debate-transcripts/october-9-2016-debate-transcript/'
TS22='https://web.archive.org/web/20221204195550/https://truthsocial.com/api/v1/statuses/109449803240069864'
VERM='https://web.archive.org/web/20250525174651/https://truthsocial.com/api/v1/statuses/111393315342651569'
WOOD='https://www.simonandschuster.com/p/the-trump-tapes'
MEMO='https://www.justice.gov/opa/media/1407001/dl'
# manual per-item file-paragraph rewrites (old substring -> new) and record overrides
MAN={
'1':([(' In February 2025 the Attorney General said the list was on her desk. The department later said she meant the file.','')],MEMO,['The caption sold a document']),
'2':([],'https://oig.justice.gov/sites/default/files/reports/23-085.pdf',[]),
'3':([],None,[]),
'7':([('Iran is the only non-weapon state at 60 percent.','The IAEA’s February 2026 report (GOV/2026/8) says Iran is the only non-nuclear-weapon state party to the NPT producing uranium enriched to that level.')],'https://www.iaea.org/sites/default/files/gov2026-50.pdf',[]),
'8':([(' Denying the enrichment is denying an inspection that already happened.',' **Our view:** Denying the enrichment is denying an inspection that already happened.')],None,[]),
'14':([('No order cutting tests was issued to the department. The order was added.','No written order to reduce testing has been produced. The order was added.')],None,[]),
'27':([('Custody was January 3, 2026. He was arraigned in Brooklyn.','The State Department says he was taken into custody on January 3, 2026, following a military operation in Caracas.')],None,[]),
'48':([],'https://www.fda.gov/news-events/press-announcements/fda-takes-key-action-fight-against-covid-19-issuing-emergency-use-authorization-first-covid-19',[]),
'53':([('A Republican donor started opposition research. The Clinton campaign','The Clinton campaign')],None,[]),
'62':([('The crowd chanted it. His public sentence that afternoon was that Pence “didn’t have the courage.”','Rioters chanted “Hang Mike Pence.” At 2:24 p.m. he posted that Pence “didn’t have the courage.”')],J6,[]),
'64':([],J6,[]),
'67':([('That sentence is his, and it is ugly.','That sentence is his. **Our view:** it is ugly.')],None,[]),
'71':([('Zero tolerance, May 2018, formalized prosecutions of adults who crossed. Separations happened before that policy.','Zero tolerance was announced April 6, 2018; DHS began referring all adult crossers for prosecution in May 2018. The HHS inspector general found that separations happened before that policy.')],None,[]),
'99':([('That sentence was said in 2021, including by the CDC director. Later infections in vaccinated people showed it was false when it was said.','That sentence was said in 2021, including by the CDC director on MSNBC on March 29, 2021. CDC data published July 30, 2021 showed vaccinated people could be infected and carry similar viral loads.')],None,[]),
'117':([],'https://www.justice.gov/pardon/pardons-granted-president-joseph-biden-2021-present',[]),
'119':([('A secure border does not print that number.','FY2021 began October 1, 2020, under the prior administration. A secure border does not print that number.')],None,[]),
'120':([('The file: An idea does not throw a frozen bottle, publish an officer’s address, or fire on a detention center. On July 4','The file: **Our view:** An idea does not throw a frozen bottle, publish an officer’s address, or fire on a detention center. On July 4')],None,[]),
'121':([('The apology did not pull the memo.','**Our view:** The apology did not pull the memo.')],None,[]),
'122':([('The promise did not survive the statute. PolitiFact','**Our view:** The promise did not survive the statute. PolitiFact')],None,[]),
}
def blocks(t):
    parts=re.split(r'\n(?=\*\*[^*\n]+\*\*\n\nThey ran:)',t)
    return parts
def gen(slug,status,extra_fixes,extra_edits,intro_ov,held=''):
    t=open(f'essays/{slug}.md').read()
    edits=list(extra_edits); ov=list(intro_ov); cut=[]; fixn=0; relinked=0; oplab=0
    for b in blocks(t)[1:]:
        m=re.match(r'\*\*(.+?)\*\*\n\nThey ran: (.+?)\n',b)
        x=claims[m.group(2).strip()][0]; k=x['Item_No']; v=x['Verdict']; body=b.rstrip('\n')
        new=body
        if v.startswith('Cannot') or v.startswith('False'):
            edits.append([body+'\n','']); cut.append(m.group(1)); continue
        man=MAN.get(k)
        fm=re.search(r'^The file: (.*)$',new,re.M)
        if v.startswith('Verified with') and x['Fix_Needed'].startswith('TRUTH:') and not man:
            new=new.replace(fm.group(0),'The file: '+x['Fix_Needed'][len('TRUTH:'):].strip()); fixn+=1
        if man:
            for o,n in man[0]:
                assert o in new,(k,o); new=new.replace(o,n)
            if man[0]: fixn+=1
        if v.startswith('Opinion'):
            new=re.sub(r'^The file: ',"The file: **Our view:** ",new,flags=re.M); oplab+=1
        # record line
        rm=re.search(r'^Record: (\S+)$',new,re.M)
        rec=(man[1] if man and man[1] else None) or (x['Best_Source_URL'] if isprim(x['Best_Source_URL']) and urlparse(x['Best_Source_URL']).path not in ('','/') else None)
        if rm:
            u=rm.group(1)
            good=isprim(u) and urlparse(u).path not in ('','/')
            if man and man[1]: new=new.replace(rm.group(0),'Record: '+man[1]); relinked+=1
            elif not good:
                new=new.replace(rm.group(0)+'\n\n','').replace(rm.group(0),'Record: '+rec if rec else '')
                relinked+=1
        elif man and man[1]:
            new=new.replace(fm.group(0) if fm else '', (fm.group(0) if fm else '')+'\n\nRecord: '+man[1]) if fm else new
        if new!=body: edits.append([body,new])
    fixes=list(extra_fixes)
    if cut: fixes.insert(0,'Rows cut (no primary record under the tightened standard): '+', '.join(cut))
    if fixn: fixes.append(f'{fixn} rows corrected to the audited wording (see CSV Fix_Needed)')
    if relinked: fixes.append(f'{relinked} record links replaced with primary records or removed')
    if oplab: fixes.append(f'{oplab} rows labeled Our view')
    return edits,ov,fixes,len(blocks(t))-1-len(cut)
# ---------- media
t=open('essays/the-media-ledger.md').read()
e,ov,fx,n=gen('the-media-ledger','',[],[],[])
intro=[
 ['This file holds 101 captions. 20 are a cut tape or the wrong picture. 72 are a word that was added, widened, or swapped until the sentence became a crime, a finding, or an order the recording does not contain. 9 are the unequal standard in plain sight:','This file holds %d captions. Some are a cut tape or the wrong picture. Most are a word that was added, widened, or swapped until the sentence became a crime, a finding, or an order the recording does not contain. A few are the unequal standard in plain sight:'%n],
 ['These 101 lines are the breach','These %d lines are the breach'%n],['These 101 are the captions in this file.','These %d are the captions in this file.'%n],
 [' In February 2025 the Attorney General said the list was on her desk. The department’s July 2025 memorandum said there was no incriminating client list.',' The department’s [July 2025 memorandum]('+MEMO+') said there was no incriminating client list.'],
 ['The victims were then used as a slogan,','**Our view:** The victims were then used as a slogan,'],
 [' [www.stophate.com](https://www.stophate.com) is a private site. It is not the House archive.',''],
 ['That channel is [CHA Subcommittee on Oversight](https://rumble.com/c/CHASubcommitteeOnOversightRepublicanMajority). ',''],
 ['These are not in the lie column, because he said them. “Fight like hell.” “Stand back and stand by.” “When the looting starts, the shooting starts.” The Access Hollywood tape. “I just want to find 11,780 votes.” The December 2022 post about terminating rules, regulations, and articles, “even those found in the Constitution.” “Poisoning the blood.” “Vermin.” He told Bob Woodward he wanted to downplay the virus.',
  'These are not in the lie column, because he said them. [“Fight like hell.”]('+CSPAN+') [“Stand back and stand by.”](https://www.debates.org/voter-education/debate-transcripts/september-29-2020-debate-transcript/) [“When the looting starts, the shooting starts.”]('+LOOT+') The [Access Hollywood tape]('+AH+'), which he called [“locker room talk. I’m not proud of it.”]('+DEB2+') [“I just want to find 11,780 votes.”]('+J6+') The [December 2022 post]('+TS22+'): a fraud that size “allows for the termination of all rules, regulations, and articles, even those found in the Constitution.” [“Poisoning the blood.”](https://www.c-span.org/clip/campaign-2024/donald-trump-on-illegal-immigrants-poisoning-the-blood-of-our-country/5098439) [“Vermin.”]('+VERM+') He told Bob Woodward on tape, March 19, 2020, [“I wanted to always play it down.”]('+WOOD+')'],
]
w('the-media-ledger','Cleared with fixes',fx+['Caption count updated to %d after cuts; the 20/72/9 split dropped because it no longer matches'%n,'Epstein: the Feb. 2025 "on her desk" remark cut (news-only); memo linked to the DOJ copy; slogan sentences labeled Our view','Hours section: Rumble and StopHate links cut; committee notice kept as the record of its own releases','"Said. Not invented.": every quote now carries a primary link. Restored: looting post (Wayback capture of the tweet), Access Hollywood (tape wording as quoted in the Second Circuit\'s Carroll v. Trump opinion, plus his own "locker room talk" apology in the Oct. 9, 2016 debate transcript), Dec. 3, 2022 post (Wayback capture of the Truth Social record), "vermin" (his Nov. 11, 2023 Truth Social post, Wayback capture; same words in the Claremont, N.H. speech that day), Woodward line (the March 19, 2020 recording, published in The Trump Tapes)'],
  intro+e,keep=[LOOT,'https://mobile.twitter.com/realDonaldTrump/status/1266231100780744704'],ourview=['Psychological warfare, on this page','The correction is long.','The slogans were not descriptions.','That is why the list below is long.','A promise to release the tapes'])
# ---------- democrat
e,ov,fx,n=gen('the-democrat-ledger','',[],[],[])
w('the-democrat-ledger','Cleared with fixes',fx,e,ourview=['A party is allowed to oppose','The betrayal is specific.'])
# ---------- republican
e,ov,fx,n=gen('the-republican-ledger','',[],[],[])
rep_intro=[['The taxes were not released.','The returns were not released by him (the House Ways and Means Committee released six years of them in December 2022).'],
 ['A party that will not say those sentences is asking for the same trust it says the other side forfeited.','**Our view:** A party that will not say those sentences is asking for the same trust it says the other side forfeited.']]
w('the-republican-ledger','Cleared with fixes',fx+['Intro: tax-return sentence corrected (Ways and Means released six years in Dec. 2022); closing line labeled Our view'],rep_intro+e,ourview=['The same standard cuts this way.','Older betrayals stay'])
print('ok')
# post-edits (kept here so a re-run reproduces them)
for slug,old,new in [('the-media-ledger','Record: https://www.documentcloud.org/documents/25993306-doj-epstein-july-2025-memo','Record: https://www.justice.gov/opa/media/1407001/dl'),
 ('the-media-ledger','The file: Hakeem Jeffries used “war of choice.” Members repeated it on the House floor on March 4, 2026.','The file: “War of choice” was said on the House floor on March 4, 2026.'),
 ('the-democrat-ledger','The file: Jeffries said it. The House floor said it on March 4, 2026.','The file: The House floor heard it on March 4, 2026.')]:
    f=f'essay_edits/{slug}.json'; d=json.load(open(f)); d['edits'].append([old,new]); json.dump(d,open(f,'w'),indent=1,ensure_ascii=False)
