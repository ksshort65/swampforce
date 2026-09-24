from specs1 import w,CF
w('clean-hands','Held',["Waters (RealClearPolitics), Pressley (RealClearPolitics), Harris's CBS remark (YouTube), Pelosi and Cynthia Johnson (AP/MLive) quotes cut: no unedited original video or official transcript located",
"Insured-loss 'bill' cut: PCS/Verisk and Insurance Information Institute figures are private industry estimates, not public records","Harris's own post kept, unlinked; the CNN on-screen caption kept as CNN's own broadcast"],
[["Careful words. A crowd takes the hint. Cities burn. Insurers counted a billion. The Member still has the chair.","Careful words. A crowd takes the hint. Cities burn. The Member still has the chair."],
["They say create a crowd. They should not let up. Bring the fire. People will do what they do. The crowd hears the rest.","They say the careful sentence. The crowd hears the rest."],
["[Her post is still up.](https://x.com/KamalaHarris/status/1267555018128965643) Sixteen days later, on CBS, she said they are not going to stop before Election Day, not after, “they’re not going to let up, and they should not, and we should not.” [The Late Show posted the segment.](https://www.youtube.com/watch?v=NTg1ynIPGls) She named protest. Minneapolis had already seen a precinct burn. She did not say stop the arson. She said they should not let up. Then she pointed","Her post is still up on her account. Minneapolis had already seen a precinct burn. She did not say stop the arson. She pointed"],
["The people who said create a crowd, bring the fire, they should not let up, people will do what they do, did not receive an invoice.","The people who chose the careful sentence did not receive an invoice."],
["The Member who said they should not let up, and the anchor","The Member who chose the careful sentence, and the anchor"],
["CNN put a Kenosha fire on the screen and a caption under it:","CNN’s own broadcast put a Kenosha fire on the screen and a caption under it:"]],
ourview=["The method is not a memo","This journal will not pretend","“Mostly peaceful” is how","The people who chose","The Member who chose"],
held_reason="The essay's core evidence — the Waters, Pressley, Pelosi and Cynthia Johnson quotes and the insured-loss 'bill' — rests on press clips, aggregator video and private industry estimates. Under the primary-source rule those are cut; the cleaned draft below keeps only Harris's own post, the Minneapolis precinct fire and CNN's own caption. An editor must decide whether the remaining argument stands, or supply unedited original video/official transcripts for the cut quotes.")
import json
d=json.load(open('essay_edits/clean-hands.json'))
t=open('essays/clean-hands.md').read()
for ln in t.split('\n'):
    if ln.startswith('On June 23, 2018') or ln.startswith('On February 9, 2020') or ln.startswith('On July 9, 2020') or ln.startswith('On December 8, 2020') or ln.startswith('Property Claim Services'):
        d['edits'].append([ln+'\n\n',''])
json.dump(d,open('essay_edits/clean-hands.json','w'),indent=1,ensure_ascii=False)
w('one-word',CF,["Maduro custody stated in the State Department's words (placed in U.S. custody on Jan. 3, 2026 'following a military operation in Caracas'; superseding indictment unsealed the same day); 'arraigned / pleaded not guilty' dropped (no docket entry reached)",
"'About 18 under seditious conspiracy' replaced with what the record supports","Kids-in-cages row restated: the chain-link processing center in McAllen opened in 2014",
"51-officials row: the letter is described directly; the House committee press release is unlinked (political source)","Horowitz link corrected"],
[["[The State Department](https://www.state.gov/nicolas-maduro-moros): on **3 January 2026** he was placed in U.S. custody, taken to Brooklyn, and held to face those charges. He was arraigned. He pleaded not guilty.","[The State Department](https://www.state.gov/nicolas-maduro-moros): on **3 January 2026** he “was placed in U.S. custody following a military operation in Caracas,” taken to the Metropolitan Detention Center in Brooklyn, and charged in a superseding indictment unsealed that day."],
["A named defendant walked into a courtroom is not a kidnapping victim.","Our view: a named defendant brought before a court on a six-year-old warrant is not a kidnapping victim."],
["About 18 under seditious conspiracy, [18 U.S.C. § 2384](https://www.law.cornell.edu/uscode/text/18/2384).","Oath Keepers and Proud Boys leaders convicted of seditious conspiracy, [18 U.S.C. § 2384](https://www.law.cornell.edu/uscode/text/18/2384)."],
["**Kids in cages.** The chain-link rooms were photographed in 2014.","**Kids in cages.** The chain-link processing center in McAllen opened in 2014."],
["Fifty-one former intelligence officials signed a letter treating a laptop as a Russian trick weeks before the 2020 vote. The House published that file.","Fifty-one former intelligence officials signed an October 19, 2020 letter saying the laptop story had the classic earmarks of a Russian information operation, weeks before the vote."],
["The file: SDNY indictment, 26 March 2020. Custody, 3 January 2026. Arraigned in Brooklyn.","The file: SDNY indictment, 26 March 2020. Custody after a military operation, 3 January 2026. Held in Brooklyn on a superseding indictment."],
["The file: The chain-link facilities were photographed in 2014.","The file: The chain-link processing center in McAllen opened in 2014."],
["The file: Fifty-one former intelligence officials signed a letter weeks before the 2020 vote. The House published the file.\n\nRecord: https://judiciary.house.gov/media/press-releases/new-judiciary-committee-website-highlights-activities-and-findings-select","The file: Fifty-one former intelligence officials signed an October 19, 2020 letter weeks before the vote."]],
ourview=["Once the word sticks","Gaslighting is not a feeling"])
