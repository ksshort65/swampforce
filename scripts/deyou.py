#!/usr/bin/env python3
"""Rewrite second-person address outside quotes, URLs, and markdown links."""
import re
from pathlib import Path

FILES = [
    Path("/workspace/src/lib/content.ts"),
    Path("/workspace/src/lib/scorecard.ts"),
    Path("/workspace/src/lib/flow.ts"),
    Path("/workspace/src/routes/dispatch.index.tsx"),
    Path("/workspace/src/routes/about.tsx"),
    Path("/workspace/src/routes/join.tsx"),
    Path("/workspace/src/routes/dispatch.$slug.tsx"),
    Path("/workspace/src/routes/copyright.tsx"),
]

# Longest first.
REPL = [
    (r"\bYou should NOT make any changes\b", "KEEP"),  # skip via skip files
    (r"Congress is paid by you\b", "Congress is paid by the people"),
    (r"break your spirit", "break the people's spirit"),
    (r"They do not represent you\b", "They do not represent the people"),
    (r"You cannot bounce a seated Member", "A seated Member cannot be bounced"),
    (r"You cannot recall a Member", "A Member of Congress cannot be recalled"),
    (r"You cannot sue Congress", "Congress cannot be sued"),
    (r"You can force a dirty", "A dirty"),
    (r"You can sue\. This is how\.", "How a dirty list goes to court."),
    (r"You cannot sue Congress for being Congress\. You can force a dirty voter list into court in 90 days\. Step by step\.", "Congress cannot be sued for being Congress. A dirty voter list can go to court in 90 days. Step by step."),
    (r"They're spending your taxes", "They're spending taxpayer money"),
    (r"your taxes on illegal", "taxpayer money on illegal"),
    (r"Your governor did it anyway", "Governors did it anyway"),
    (r"You cannot outlaw a caption", "A caption cannot be outlawed"),
    (r"You should not have to wait\.", "Waiting is not the job."),
    (r"Empty House\. You should not have to wait\.", "Empty House. Waiting is not the job."),
    (r"Not a stranger on a video asking for your (card|money)", r"Not a stranger on a video asking for a \1"),
    (r"This journal is not your lawyer", "This journal is not a law firm"),
    (r"the chief election official of your State", "the chief election official of the State"),
    (r"If you mail a check to a stranger on a video, you have left the docket", "A check mailed to a stranger on a video has left the docket"),
    (r"Your state attorney general", "A state attorney general"),
    (r"the United States Attorney for your district", "the United States Attorney for the district"),
    (r"The envelope is your name", "The envelope is a name"),
    (r"not a request that you send this journal money", "not a request for money to this journal"),
    (r"spent past it with your check", "spent past it with taxpayer money"),
    (r"not a complaint you file against a sitting governor from your kitchen table", "not a kitchen-table complaint against a sitting governor"),
    (r"the statute does not give you", "the statute does not give"),
    (r"the bench your state lets you hire", "the bench the state elects"),
    (r"has told you which children count", "has named which children count"),
    (r"If you stop the knock", "If the knock is stopped"),
    (r"who told you not to look", "who said not to look"),
    (r"They will tell you the other jersey did it", "They will say the other jersey did it"),
    (r"so you would fight your neighbor", "so neighbor would fight neighbor"),
    (r"they sell you a neighbor", "they sell a neighbor"),
    (r"they hand you a villain who lives on your street", "they hand the country a villain who lives on the next street"),
    (r"You pay the legislative branch", "The country pays the legislative branch"),
    (r"people who already took your money", "people who already took the money"),
    (r"Here is how you force it", "How the stack is forced"),
    (r"They show you a paragraph", "They show a paragraph"),
    (r"What you are owed", "What the people are owed"),
    (r"If your number is different", "If the number is different"),
    (r"How you make it happen", "How it is forced"),
    (r"You do not wait for a new ministry of truth\. You use the tools that already exist and you score the people who refuse them", "There is no new ministry of truth. The tools that already exist score the people who refuse them"),
    (r"only if you want a national referendum", "only for a national referendum"),
    (r"you approve by removing", "approval is removing"),
    (r"FICA you already pay", "FICA already paid"),
    (r"on what you buy", "on what is bought"),
    (r"counting on you never reading", "counting on the annex never being read"),
    (r"or your number if you have one", "or another number with the table attached"),
    (r"the slogan you can shout", "the slogan shouted"),
    (r"You cannot campaign against a study without being told you oppose the history", "A study cannot be opposed without the charge of opposing history"),
    (r"and you are north of", "and the stack is north of"),
    (r"You can study history\. You cannot run the IRS", "History can be taught. The IRS cannot be run"),
    (r"That is how you destroy the currency", "That is how the currency is destroyed"),
    (r"If you cannot, you do not get to run on the word", "No pay-for, no slogan"),
    (r"so your ballot would die", "so a ballot would die"),
    (r"can ping you when the envelope", "can ping when the envelope"),
    (r"then forbade you to ask", "then forbade asking"),
    (r"the rule that you answer speech with speech — not with a poison tag you hope", "the rule that speech answers speech — not a poison tag hoped"),
    (r"You went to work\. You paid what they said was owed\. You assumed", "People went to work. People paid what was said to be owed. People assumed"),
    (r"print that if you need to", "print that if the record needs it"),
    (r"None of that required you to like his manners\. It required you to notice", "None of that required liking his manners. It required noticing"),
    (r"You may discount a conservative scorekeeper\. Then watch a week of those broadcasts yourself", "A conservative scorekeeper can be discounted. Then watch a week of those broadcasts"),
    (r"platforms paid when you stay mad", "platforms paid when the feed stays mad"),
    (r"They do not need you to love the shop\. They need you unable to read a statute", "Love of the shop is not required. Inability to read a statute is"),
    (r"Isolation is how you lose a republic", "Isolation is how a republic is lost"),
    (r"to make sure you know it too", "to put the record in public"),
    (r"You are not stupid\. You were given a clip instead of a class\. A network needs you mad in six seconds\. A teacher needs you to finish the sentence", "The country was given a clip instead of a class. A network needs anger in six seconds. A teacher needs the sentence finished"),
    (r"You just took a class\. You did not need a party for it\. You needed six names and one job", "That was a class. A party was not required. Six names and one job were"),
    (r"If you never see Article I, you will argue about a man\. If you never see the rest of the sentence, you will hate a country that isn’t on the tape", "If Article I is never seen, the argument is about a man. If the rest of the sentence is never seen, a country that is not on the tape is hated"),
    (r"We do not ask you to trust a vibe", "This journal does not ask for trust in a vibe"),
    (r"don’t share a sentence you have not heard in full", "do not share a sentence not heard in full"),
    (r"You do not need a party to do this\. You need the charter and the file", "A party is not required. The charter and the file are"),
    (r"You do not have to like Donald Trump to see the pattern\. You only have to be willing to sit still for the next sentence", "Liking Donald Trump is not required to see the pattern. Sitting still for the next sentence is"),
    (r"We are not asking you to become a fan\. We are asking you to hear the rest of the answer", "This journal is not recruiting fans. Hear the rest of the answer"),
    (r"so you think the employee is untouchable", "so the employee looks untouchable"),
    (r"a statute they would write for you if you used the same heat", "a statute they would write for a citizen who used the same heat"),
    (r"they need you unable to tell the charter from the clip", "they need the public unable to tell the charter from the clip"),
    (r"You do not need a bomb", "A bomb is not required"),
    (r"That is not the bill you are paying", "That is not the bill the country is paying"),
    (r"the tables they hope you never read", "the tables they hope go unread"),
    (r"health coverage paid in part by you", "health coverage paid in part by taxpayers"),
    (r"the second law you are never shown", "the second law the public is never shown"),
    (r"then tell you the floor was too busy", "then say the floor was too busy"),
    (r"the twin law you never see", "the twin law the public never sees"),
    (r"They need you in a jersey", "They need the country in a jersey"),
    (r"Start here so you know what you are looking at", "Start here. What is on the page"),
    (r"The first one you vote on\. The second one you do not", "The first is on the ballot. The second is not"),
    (r"if you write the law, you cannot sell it", "if they write the law, they cannot sell it"),
    (r"hoaxes — on your dime", "hoaxes — on the taxpayer dime"),
    (r"A newscast that never quite describes a statute still has a plot", "KEEP"),
    (r"You already paid them", "The country already paid them"),
    (r"You already know the leverage", "The leverage is already known"),
    (r"It does not tell you to walk off", "It does not tell anyone to walk off"),
    (r"It would also be felt first in your neighbor's refrigerator", "It would also be felt first in a neighbor's refrigerator"),
    (r"tells you the lawful instruments", "names the lawful instruments"),
    (r"That is how you pull a nation back together", "That is how a nation is pulled back together"),
    (r"How you hide a permanent program", "How a permanent program is hidden"),
    (r"who decide who gets charged in your county", "who decide who gets charged in a county"),
    (r"You fund the first with taxes\. You live under the second\. That is paying for your own demise", "Taxes fund the first. The public lives under the second. That is a country paying for its own demise"),
    (r"You already paid the salary so those hours would belong to you\. They do not", "The salary was paid so those hours would belong to the public. They do not"),
    (r"They sold you a jersey so you would not look", "They sold a jersey so the file would not be read"),
    (r"the next majority will name this site ‘hate’ and your neighbor ‘division.’", "the next majority will name this site ‘hate’ and a neighbor ‘division.’"),
    (r"Leave your name", "Leave a name"),
    (r"Open your mail", "Open the mail"),
    (r"The rest stay closed until you open one", "The rest stay closed until one is opened"),
    (r"the building you pay for", "the building the country pays for"),
    (r"What you pay Congress", "What the country pays Congress"),
    (r"How you force the stack", "How the stack is forced"),
    (r"You pay the legislative branch \$7.258 billion a year", "The country pays the legislative branch $7.258 billion a year"),
    (r"hoaxes paid for with your money", "hoaxes paid for with taxpayer money"),
    (r"the DA race you did", "the DA race"),
    (r"sold you the", "sold the country the"),
    (r"need you to love the shop\. They need you unable", "need love of the shop. They need the public unable"),
    (r"You may quote with credit and a link\.\s+You may not copy the work as your own", "Quote with credit and a link. Do not copy the work as original"),
    (r"You may quote brief passages", "Brief passages may be quoted"),
    (r"You may not scrape or republish the compilation as your own", "The compilation may not be scraped or republished as original"),
    (r"you kept more of the check", "take-home pay rose"),
    (r"Tax cut you could feel", "A tax cut that showed up on payday"),
    (r"That is a win you can name", "That is a win that can be named"),
    (r"We still print your ugly sentence", "Ugly sentences still print"),
    (r"If you hold the Senate now and still freeze Article II, that is your obstruction", "A Senate that freezes Article II is obstruction"),
    (r"The line that cut what you pay", "The line that cut the tax"),
    (r"They still owe you twelve bills", "They still owe twelve bills"),
    (r"how you will not block", "how the agenda will not be blocked"),
    (r"or whatever you renamed it", "or whatever it was renamed"),
    (r"Your 2026 program is already a pamphlet", "The 2026 program is already a pamphlet"),
    (r"You took \$7.258 billion", "Congress took $7.258 billion"),
    (r"You do not get to lecture", "There is no lecture from"),
    (r"You want the state to run", "The platform wants the state to run"),
    (r"Then you of all people do not get", "Then a part-time legislature is not the instrument"),
    (r"You do not get to outsource", "The split cannot be outsourced"),
    (r"If you want the program", "If the program is the ask"),
    (r"if you see them in a restaurant", "if they are seen in a restaurant"),
    (r"If you hold the Senate now and still bang a gavel", "A Senate that bangs a gavel in an empty room"),
    (r"that is your obstruction", "that is obstruction"),
    (r"when you like the Oval", "when the Oval is friendly"),
    (r"You do not get a special rule because you dislike the president", "Dislike of a president is not a special rule"),
    (r"You want to abolish the Senate", "The platform wants to abolish the Senate"),
    (r"You do not get a state television\. You get the same rule", "There is no state television. The same rule applies"),
    (r"If a network buries your ugly sentence", "If a network buries an ugly sentence"),
    (r"Waive the layover and you failed the job", "Waive the layover and the job failed"),
    (r"You wrote the 1974 Budget Act", "Congress wrote the 1974 Budget Act"),
    (r"You kept more of the check", "Take-home pay rose"),
    (r"What you will hear", "What the country will hear"),
    (r"on your dime", "on the taxpayer dime"),
    (r"because you went to work", "because people went to work"),
    (r"People will do what they do\. You know how to do it\. The crowd hears the rest", "People will do what they do. The crowd hears the rest"),
    (r"voting against the rule got you punished", "voting against the rule was punished"),
    (r"You do not need a panel to tell your own eyes which one you are watching", "A panel is not required to tell which one is on the screen"),
    (r"The caption told you not to believe the picture", "The caption said not to believe the picture"),
    (r"asks you to distrust the evidence of your senses", "asks the public to distrust the evidence of the senses"),
    (r"“Mostly peaceful” is how you hide the arson", "“Mostly peaceful” is how the arson is hidden"),
    (r"You send written notice", "Written notice goes"),
    (r"you may file in district court", "the case may be filed in district court"),
    (r"if you prevail", "if the plaintiff prevails"),
    (r"You send names to the United States Attorney", "Names go to the United States Attorney"),
]


def protect_split(text: str):
    """Keep quoted speech, URLs, markdown links untouched."""
    pattern = re.compile(
        r'(https?://[^\s)\]"\']+|`[^`]+`|\[[^\]]*\]\([^)]+\)|'
        r"“[^”]*”|\"[^\"]*\"|‘[^’]*’)"
    )
    parts = pattern.split(text)
    out = []
    for p in parts:
        if pattern.fullmatch(p) or p.startswith("http"):
            out.append(p)
            continue
        s = p
        for a, b in REPL:
            if b == "KEEP":
                continue
            s = re.sub(a, b, s)
        # leftover second person — blunt
        s = re.sub(r"\byour\b", "the", s)
        s = re.sub(r"\bYour\b", "The", s)
        s = re.sub(r"\byou're\b", "a person is", s, flags=re.I)
        s = re.sub(r"\bYou\b", "The public", s)
        s = re.sub(r"\byou\b", "the public", s)
        out.append(s)
    return "".join(out)


def main():
    for path in FILES:
        raw = path.read_text()
        new = protect_split(raw)
        if new != raw:
            path.write_text(new)
            print("updated", path)
        else:
            print("same", path)


if __name__ == "__main__":
    main()
