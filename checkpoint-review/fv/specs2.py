from specs1 import w,CF
CBPH='https://www.cbp.gov/document/stats/us-border-patrol-fiscal-year-southwest-border-sector-apprehensions-fy-1960-fy-2019'
CBPSW='https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters'
w('call-these-first',CF,["Links to the named legal groups kept as directory links to their own sites (they source no facts); the journal does not vouch for them"],[],
keep=['https://www.judicialwatch.org/','https://aflegal.org/priority/election-integrity/','https://www.publicinterestlegal.org/','https://www.irli.org/','https://www.fairus.org/'])
w('the-docket','Cleared as-is',[],[])
w('they-let-them-walk',CF,["Dek cut to opinion: 'A cop is dead. The judge who let the man out is still on the bench' named no case and no record (the essay itself says it will not recycle a local news item)"],
[["A cop is dead. The judge who let the man out is still on the bench. This is why the street feels like a siege.","When a court sends a dangerous defendant home, the statute already said otherwise. This is why the street feels like a siege."]],
ourview=["Oversight is a docket"])
w('the-bill-they-sent',CF,["Dek corrected: federal law restricts public benefits for people here illegally but does not flatly forbid tax-funded shelter; 8 U.S.C. 1611(b)(1)(D) and 1621(b)(4) exempt short-term shelter and other aid necessary to protect life or safety, and Congress itself funded FEMA's Shelter and Services Program",
"Arizona v. United States described accurately (federal law occupies the field of alien registration), not 'the field of immigration'",
"In-state tuition tied to its own statute, 8 U.S.C. 1623; the legal conclusion is labelled Our view"],
[["Federal law already forbade using tax money to house illegal immigrants. Governors still paid for hotels, debit cards, and clothes.","Federal law already limits public benefits for illegal immigrants. Governors still paid for hotels, debit cards, and clothes."],
["with narrow exceptions such as emergency medical care.","with narrow exceptions such as emergency medical care and short-term shelter or other aid the Attorney General deems necessary to protect life or safety."],
["A hotel room, a prepaid card, a clothing stipend, and in-state tuition are not an emergency room. A governor who spends those items on people the statute bars is spending past supreme federal law.","In-state tuition has its own bar in [8 U.S.C. § 1623](https://www.law.cornell.edu/uscode/text/8/1623). Our view: a prepaid card, a clothing stipend, and months in a hotel are not an emergency room, and a governor who spends them on people the statute bars, without the state law the statute requires, is spending past supreme federal law."],
["held that Congress occupies the field of immigration.","held that federal law occupies the field of alien registration and preempted three of the four Arizona provisions at issue."]],
ourview=["The next lever"])
w('the-record-not-the-rally',CF,["Clinton-era figure corrected: roughly 1 million to 1.6 million Border Patrol southwest apprehensions a year (FY1993–2000), not 'about 1.6 million a year'",
"Biden-era figure corrected: more than two million in fiscal 2022 and 2023 (1.66 million in 2021, 1.53 million in 2024), not 'more than two million a year'",
"Pew links replaced with CBP's own tables"],
[["still saw about 1.6 million crossings a year.","still saw roughly 1 million to 1.6 million Border Patrol apprehensions a year at the southwest border."],
["Biden’s years: more than two million a year, and many were released into the country.","Biden’s years: more than two million in fiscal 2022 and again in 2023, and many were released into the country."],
["Check the border numbers here: https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/ The new detention law:","Check the border numbers here: "+CBPSW+" and, for 1960–2019, "+CBPH+" The new detention law:"],
["- Border — Pew — https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/","- Border — CBP — "+CBPSW+"\n- Border, FY1960–2019 — CBP — "+CBPH]],
ourview=["If a friend only has six seconds","That was a class."])
w('the-republic-not-the-caption','Cleared as-is',[],[],ourview=["A republic fails"])
