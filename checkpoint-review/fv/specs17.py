from specs14 import dropl
from specs1 import w
CISA='https://www.cisa.gov/news-events/news/joint-statement-elections-infrastructure-government-coordinating-council-election'
w('a-barcode-is-not-a-lock','Held',["The August 2026 'USPS final rule' (voter portal, two unique barcodes) cut: no such rule found in the Federal Register; the only sources were a trade site and Politico",
"'Most secure' line re-sourced to the Nov. 12, 2020 joint statement of the election infrastructure councils, published by CISA (not a CISA-only declaration); '95 percent paper record' replaced with the statement's own words",
"Letitia James quote, Washington Post 150,000 ballots and USPS 99.89% figures cut (press-only)","North Carolina 'started mailing today' cut (Politico only)"],
[["The extra security they now advertise is a sorting sticker. Make it make sense.","A sorting sticker is not security. Make it make sense."],
[" Letitia James said the changes ‘made a mockery of the right to vote.’ They sued."," They sued."],
["November 12, 2020: CISA, the same federal security shop, declared the contest ‘the most secure in American history.’","November 12, 2020: the federal-state election infrastructure councils, in a [statement CISA published]("+CISA+"), called the contest “the most secure in American history.”"],
["Read Krebs on 60 Minutes, not the caption. The sentence about ‘most secure’ was about voting systems: paper backups so a hacked tally can be checked. Ninety-five percent of 2020 ballots had a paper record. That is a claim about machines.","Read the statement, not the caption. The ‘most secure’ sentence sat next to a claim about voting systems: “All of the states with close results in the 2020 presidential race have paper records of each vote.” That is a claim about machines."],
["CISA did not audit the kitchen. It issued a press release about the tabulator.","CISA did not audit the kitchen. It published a statement about the tabulator."],
["In 2020 the barcode-and-mail pipeline was so sacred it made history. In 2026 the same pipeline, with more barcode, is a plot. The envelope did not change. The jersey on the White House did.","SKIP"]],
ourview=["Write the two sentences","### The hypocrisy","This journal will not invent","The summer they said","- If USPS","- If a barcode","- If Democrats"],
held_reason="The essay's 2026 half — a USPS 'final rule' creating a mail-voter portal with unique barcodes — could not be found in the Federal Register and is sourced only to a trade site and Politico, so it is cut. Without it the 'same pipeline, now a plot' contrast has no 2026 event. The 2020 half stands on the CISA-published statement. Editor decision required: supply the rule's Federal Register citation or rewrite around 2020 only.")
import json
f='essay_edits/a-barcode-is-not-a-lock.json'; d=json.load(open(f)); d['edits']=[e for e in d['edits'] if e[1]!='SKIP']; json.dump(d,open(f,'w'),indent=1,ensure_ascii=False)
dropl('a-barcode-is-not-a-lock',["The Washington Post, November 5, 2020","August 2026: USPS finalized","- USPS final rule","- CISA — Nov. 12","- Krebs / 60","- AP —","- Washington Post","- POLITICO"])
