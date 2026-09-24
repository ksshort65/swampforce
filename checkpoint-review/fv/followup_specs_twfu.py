# Follow-up (Sept 24, 2026): re-applied after specs7.py writes they-work-for-us.json
import json
YT='https://www.youtube.com/watch?v=0IVD7gE7-kg'
CAPYT='https://www.youtube.com/watch?v=IUlRHoY-DlU&t=521s'
p='essay_edits/they-work-for-us.json'
d=json.load(open(p,encoding='utf-8'))
if not any('seconds later' in e[1] for e in d['edits']):
    d['fixes'][0]="Clip 2 re-sourced from Fox News to C-SPAN's full program of the May 19, 2026 CAP IDEAS speech plus the speech video on Jeffries's own YouTube channel; wording checked against the captions of his channel's upload (8:41) and CAP's full livestream (1:51:27): matches"
    d['fixes'][1]="Jeffries X link removed (social media); his own YouTube channel kept as where he said/posted it: the Apr. 22, 2026 video titled 'Democrats have checkmated the MAGA power grab 🔥 Maximum warfare, everywhere, all the time.'; the spoken 'maximum warfare' line checked against the unedited Apr. 22 news-conference feed (ABC News livestream, 25:55): matches"
    d['fixes']+=["'He named electoral defeat in the second sentence' corrected: 'beat them electorally' comes about ten seconds later, after 'We will defeat them.'","Jeffries quotes un-labeled as Our view (his words, now checked against video)"]
    for e in d['edits']:
        if e[0].startswith("He said it at a news conference about maps. He posted it."):
            e[1]="He said it at a news conference about maps. He put it in the title of a [video on his own YouTube channel]("+YT+"). C-SPAN kept the raw."
        if e[0].startswith("Fox News has the video of that speech"):
            e[1]=e[1]+"\n\nHis own channel posted the conversation: [Leader Jeffries at the 2026 CAP IDEAS Conference]("+CAPYT+")"
    d['edits'].append(["He named electoral defeat in the second sentence.","He named electoral defeat seconds later: “We will defeat them. We have to beat them electorally.”"])
    d['keep_links']=sorted(set(d.get('keep_links',[])+[YT,CAPYT]))
    d['quote_keep']=sorted(set(d.get('quote_keep',[])+["We are in an era of maximum warfare","Either MAGA extremists are going to break the country","We have to beat them electorally, and then"]))
    json.dump(d,open(p,'w',encoding='utf-8'),indent=1,ensure_ascii=False)
