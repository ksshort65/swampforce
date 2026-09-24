import json
from specs1 import w,CF
def dropl(slug,prefixes):
    f='essay_edits/'+slug+'.json'; d=json.load(open(f)); t=open('essays/'+slug+'.md').read()
    for ln in t.split('\n'):
        if any(ln.startswith(p) for p in prefixes):
            d['edits'].append([ln+'\n',''])
    json.dump(d,open(f,'w'),indent=1,ensure_ascii=False)
EIA='https://www.eia.gov/outlooks/steo/'
w('why-he-became-the-enemy',CF,["MRC '92 percent negative' cut","Venezuela 'biggest oil deal' bullet cut (only source was Al Jazeera; no White House transcript or contract)","EIA figure updated to the September 2026 STEO: 13.83 million b/d in 2026, a record, about 18.5% of world output",
"Border bullet stated as CBP data (FY2025 southwest Border Patrol apprehensions 237,538, lowest since 1970)","'Children who still live inside that threat' cut (no record named); dead FBI link removed","'Ten lines' changed to 'those lines' after the cuts"],
[["Hate, in this case, is a product. ABC, CBS, and NBC ran evaluative coverage of his 2025 term that the Media Research Center counted as 92 percent negative in the first hundred days https://www.newsbusters.org/blogs/nb/rich-noyes/2025/04/28/tv-news-assaults-2nd-trump-admin-92-negative-coverage A newscast","Hate, in this case, is a product. A newscast"],
[" Children who still live inside that threat.",""],
["Here is the work on paper, including the oil he just scored.","Here is the work on paper."],
["- Oil, the table they already have: EIA's August 2026 outlook has U.S. crude production at a record 13.8 million barrels a day this year — Lower 48, Gulf, Alaska all up versus 2025 — about 18 percent of expected world output.","- Oil: [EIA’s September 2026 outlook]("+EIA+") has U.S. crude production at a record 13.83 million barrels a day this year, up from 13.66 million in 2025, about 18.5 percent of expected world output."],
[" That is not a tweet. It is the government's own energy shop. https://www.eia.gov/outlooks/steo/"," That is not a tweet. It is the government’s own energy shop."],
["- The border as a border: southwest encounters at a fifty-year low this term;","- The border as a border: [CBP](https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters) counted 237,538 southwest Border Patrol apprehensions in fiscal 2025, the lowest since 1970;"],
["- First term: energy exporter, not a lecture about scarcity. This term: the EIA record above, plus the Venezuela announcement they would rather argue as a vibe than as barrels.","- First term: energy exporter, not a lecture about scarcity. This term: the EIA record above."],
["If a network spent a week on those ten lines","If a network spent a week on those lines"],
["No new American war in that term.","No new American war in that term (our view)."],
["- EIA — U.S. oil record 13.8 mbpd — https://www.eia.gov/outlooks/steo/","- EIA — U.S. oil record 13.83 mbpd — https://www.eia.gov/outlooks/steo/"]],
ourview=["They do not hate him","Hate, in this case","He never wore","If a network spent"])
dropl('why-he-became-the-enemy',["- Oil: On August 28"])
FA='https://www.foreignassistance.gov/'
w('what-they-are-protecting','Held',["USAID contractor figures (Devex), lobbying totals and rankings (OpenSecrets), revolving-door counts (LegiStorm), Soros district-attorney spending (Washington Post, Politico) and the 'zero prosecutions' claim (Campaign Legal Center) cut",
"Foreign-aid total corrected to about $80.5 billion disbursed in FY2023 (ForeignAssistance.gov); USAID share cut","Open Society figures attributed to OSF's own count","CRS R48150 Chemonics sentence and the 'two dozen bills' count cut (not confirmed against the CRS text)","'Congress blocked the deep cut' bullet reduced to the Rescissions Act fact"],
[["Chemonics. The Chamber. K Street. Soros money in local races. $200 for a late trade. That is the business.","USAID money. K Street. Private money in local races. $200 for a late trade. That is the business."],
["- Open Society Foundations, by their own count: $1.2 billion in expenditures in 2024, $24.2 billion over three decades.","- Open Society Foundations says it spent $1.2 billion in 2024 and $24.2 billion over three decades."],
["- In fiscal 2023 the United States disbursed $71.9 billion in foreign aid. USAID moved about $43.8 billion of that — three of every five dollars. Pew, from ForeignAssistance.gov. https://www.pewresearch.org/short-reads/2025/02/06/what-the-data-says-about-us-foreign-aid/","- In fiscal 2023 the United States disbursed about $80.5 billion in foreign assistance, by ForeignAssistance.gov’s current data. "+FA],
["- When the second Trump term tried to fold USAID and cut the international-affairs budget hard, Congress — including a Republican House — blocked the deep cut and kept operating money in the pile. Rescissions took some. The pipeline stayed.","- When the second Trump term moved to fold USAID, Congress rescinded part of the foreign-aid money in the [Rescissions Act of 2025](https://www.congress.gov/bill/119th-congress/house-bill/4). Our view: the pipeline stayed."],
["- The civil penalty for a late report is $200. Campaign Legal Center: no member of Congress has been prosecuted for insider trading under that act. https://campaignlegal.org/update/congressional-stock-trading-and-stock-act","- The penalty for a late report is $200."],
["- The 119th Congress introduced more than two dozen bills to limit or ban the trades. CRS counted them. Disclosure is still the remedy they prefer,","- Bills to limit or ban the trades keep being introduced. Disclosure is still the remedy they prefer,"],
["- The STOCK Act's $200 late fee is a cost of doing that business. Zero prosecutions. Disclosure","- The STOCK Act's $200 late fee is a cost of doing that business. Disclosure"],
["- Taxpayer NGOs sit on the other rail. USAID's implementers — Chemonics and the rest — are paid","- Taxpayer NGOs sit on the other rail. USAID's implementers are paid"],
["Private foundations pay for the DAs.","Private foundations pay for local races."],
["- In 2025 it crossed $5 billion. The people who write the twin law buy the hours.","- The people who write the twin law buy the hours."],
["A $5 billion industry does not pay that to lose.","A billion-dollar industry does not pay that to lose."]],
ourview=["The $7.258 billion legislative machine","- That is not a sermon","- The Lobbying Disclosure Act","Put the three next to"],
held_reason="Most of the 'business' the essay names — USAID contractor shares, lobbying totals, revolving-door counts, Soros spending on DA races — is sourced only to news outlets and private aggregators (Devex, OpenSecrets, LegiStorm, Washington Post, Politico, Campaign Legal Center). Those are cut; what is left (STOCK Act, OSF's own figures, the foreign-aid total) may not carry the argument. Restore figures only from USAspending.gov queries and Senate LDA filings.")
dropl('what-they-are-protecting',["- USAID contracts, FY2023","- CRS's table of implementers","- Federal lobbying: $4.4 billion","- The revolving door is the product","- The Washington Post, December 2025","- Politico documented","- Federal lobbying hit a record"])
