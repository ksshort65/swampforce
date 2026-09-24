while read kw; do f="raw/osf/$(echo $kw|tr ' /' '__').json"; python3 osf.py "$kw" > "$f"; echo "$kw $(jq length $f)"; done <<'L'
Indivisible
MoveOn
Sunrise Movement
People's Forum
CODEPINK
Code Pink
Jewish Voice for Peace
Working Families
Movement for Black Lives
Black Lives Matter
Center for Popular Democracy
Women's March
Color of Change
United We Dream
Mijente
Dream Defenders
Public Citizen
Tides
Sixteen Thirty
New Venture Fund
Palestine Legal
Adalah
IfNotNow
Democracy Forward
Community Change
People's Action
Our Revolution
Third Act
Social Security Works
Common Defense
American Civil Liberties Union
Black Voters Matter
Blackbird
Common Counsel
Human Rights Campaign
League of Conservation Voters
Planned Parenthood
Council on American-Islamic Relations
Movement Voter
Hopewell
Windward
North Fund
L
