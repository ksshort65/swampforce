# U.S. Code map: notes

- **`uscode-map.csv`** has 122 rows:
  - 50 site-section rows covering congress, border, lawfare, january-6, remedy, fake-news, trump-watch, record-2020 and movement-watch.
  - 16 rows for the accountability files in this folder.
  - 56 catalog items where a statute genuinely relates to the *subject* of the claim. Examples: a charged count, the legal authority for a policy, or a statute that shows a claimed executive action is impossible without Congress.
- **`uscode-map-nostatute.csv`** lists the other 196 catalog items. No statute is attached to them, because a reporting error, a misquote or political rhetoric implicates no federal law. The First Amendment context is noted instead.
- **Links:**
  - U.S. Code links go to uscode.house.gov (prelim edition). Each one was validated on Sep 24, 2026 by confirming the page's `section-head` matches the cited section.
  - Constitutional provisions link to constitution.congress.gov.
  - Public laws link to congress.gov.
- **What a mapping means:** attaching a statute to a catalog item does **not** imply that anyone violated it. Where no charge or finding exists, the note says so.
- **Source files:** `/workspace/term-split/` and the site were read only, never modified.
