import json,collections,matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt, networkx as nx
flows=json.load(open('raw/flows.json'))
S=collections.defaultdict(int)
for f in flows:
    if f['source_type'].startswith('IRS'): S[(f['funder'],f['recipient'])]+=f['amount']
def s(a,b): return S.get((a,b),0)
short={'Goldman Sachs Philanthropy Fund (GS DAF Philanthropy Fund for Wealth Mgmt)':'Goldman Sachs\nPhilanthropy Fund (DAF)','Peoples Support Foundation':"People's Support\nFoundation",'Justice and Education Fund':'Justice & Education\nFund','United Community Fund':'United Community\nFund',"The People's Forum":"The People's\nForum",'Open Society Policy Center':'Open Society Policy Ctr /\nOS Action Fund','Foundation to Promote Open Society':'Foundation to Promote\nOpen Society','Common Counsel Foundation':'Common Counsel\nFoundation','Movement 4 Black Lives Inc':'Movement 4\nBlack Lives','Working Families Organization':'Working Families\nOrganization','Tides Foundation':'Tides\nFoundation','Indivisible Project':'Indivisible\nProject','MoveOn.org Civic Action':'MoveOn Civic\nAction','Sixteen Thirty Fund':'Sixteen Thirty\nFund','CodePink':'CodePink','Tricontinental':'Tricontinental',"People's Welfare Association":"People's Welfare\nAssociation",'Jewish Voice for Peace Action':'JVP Action'}
A=[('Goldman Sachs Philanthropy Fund (GS DAF Philanthropy Fund for Wealth Mgmt)',"The People's Forum"),('Goldman Sachs Philanthropy Fund (GS DAF Philanthropy Fund for Wealth Mgmt)','Tricontinental'),('Goldman Sachs Philanthropy Fund (GS DAF Philanthropy Fund for Wealth Mgmt)','CodePink'),
('Peoples Support Foundation',"The People's Forum"),('Peoples Support Foundation','Justice and Education Fund'),('Peoples Support Foundation','United Community Fund'),('Peoples Support Foundation',"People's Welfare Association"),('Justice and Education Fund','United Community Fund'),('Justice and Education Fund',"People's Welfare Association"),('United Community Fund',"The People's Forum"),('Justice and Education Fund','CodePink'),
('Open Society Policy Center','Indivisible Project'),('Open Society Policy Center','MoveOn.org Civic Action'),('Open Society Policy Center','Working Families Organization'),('Open Society Policy Center','Sixteen Thirty Fund'),('Open Society Policy Center','Jewish Voice for Peace Action'),
('Common Counsel Foundation','Movement 4 Black Lives Inc'),('Tides Foundation','Working Families Organization'),('Tides Foundation','Indivisible Project'),('Tides Foundation','MoveOn.org Civic Action')]
EA=[(a,b,s(a,b)) for a,b in A if s(a,b)>0]
EA.append(('Foundation to Promote Open Society','Common Counsel Foundation',15000000))  # OSF DB grant OR2020-76047 for M4BL
B=[('Future Forward USA Action','Future Forward PAC'),('Majority Forward','Senate Majority PAC'),('Sixteen Thirty Fund','Democratic-aligned\nsuper PACs'),('SOROS, GEORGE','Democracy PAC / PAC II'),
   ('One Nation','Senate Leadership Fund'),('American Action Network','Congressional Leadership\nFund')]
fec=collections.defaultdict(float)
import csv
for r in csv.DictReader(open('/workspace/fecbulk/fec_agg.csv')):
    c=r['contributor']; n=r['cmte_name']; a=float(r['total'])
    if c=='FUTURE FORWARD USA ACTION' and r['cmte_id']=='C00669259': fec[('Future Forward USA Action','Future Forward PAC')]+=a
    if c=='MAJORITY FORWARD' and r['cmte_id']=='C00484642': fec[('Majority Forward','Senate Majority PAC')]+=a
    if c=='SIXTEEN THIRTY FUND': fec[('Sixteen Thirty Fund','Democratic-aligned\nsuper PACs')]+=a
    if c=='SOROS, GEORGE' and r['cmte_id'] in ('C00786624','C00693382'): fec[('SOROS, GEORGE','Democracy PAC / PAC II')]+=a
    if c=='ONE NATION' and r['cmte_id']=='C00571703': fec[('One Nation','Senate Leadership Fund')]+=a
    if c.startswith('AMERICAN ACTION NETWORK') and r['cmte_id']=='C00504530': fec[('American Action Network','Congressional Leadership\nFund')]+=a
EB=[(a,b,fec[(a,b)]) for a,b in B]
m=collections.defaultdict(int)
for f in flows:
    if f['source_type'].startswith('IRS') and f['funder'] in ('Marble Freedom Trust','The Concord Fund (Judicial Crisis Network)','The Concord Fund'):
        m[(f['funder'],f['recipient'])]+=f['amount']
for (a,b),v in sorted(m.items(),key=lambda x:-x[1])[:5]: EB.append((a,b,v))
json.dump({'A':EA,'B':EB},open('raw/diagram_edges.json','w'),indent=1)
fig,axes=plt.subplots(1,2,figsize=(24,13))
def draw(ax,E,title,col):
    G=nx.DiGraph()
    for a,b,v in E: G.add_edge(short.get(a,a.replace('SOROS, GEORGE','George Soros')),short.get(b,b),w=v)
    srcs={short.get(a,a.replace('SOROS, GEORGE','George Soros')) for a,b,v in E}; dst={short.get(b,b) for a,b,v in E}
    pos=nx.spring_layout(G,k=1.6,seed=7,iterations=300)
    mx=max(v for a,b,v in E)
    widths=[1+9*G[u][v]['w']/mx for u,v in G.edges()]
    nx.draw_networkx_edges(G,pos,ax=ax,width=widths,edge_color=col,alpha=0.6,arrows=True,arrowsize=18,connectionstyle='arc3,rad=0.08',node_size=2600)
    nc=['#f2d7a6' if n in srcs and n not in dst else ('#cfe3f5' if n not in srcs else '#e3d0f0') for n in G.nodes()]
    nx.draw_networkx_nodes(G,pos,ax=ax,node_color=nc,node_size=2600,edgecolors='#555')
    nx.draw_networkx_labels(G,pos,ax=ax,font_size=8)
    el={(u,v):f"${G[u][v]['w']/1e6:,.1f}M" for u,v in G.edges()}
    nx.draw_networkx_edge_labels(G,pos,edge_labels=el,ax=ax,font_size=7.5,label_pos=0.45)
    ax.set_title(title,fontsize=13); ax.axis('off')
draw(axes[0],EA,'A. Documented grants to protest-organizing groups and their funders\n(IRS Form 990 Schedule I / 990-PF, 2019-2024 filings; GS Philanthropy Fund 2017-2024; OSF DB for $15M M4BL grant)','#b5651d')
draw(axes[1],EB,'B. Largest documented dark-money flows, both sides\n(FEC receipts 2019-2026 cycles; Marble/Concord 990 Schedule I FY2019-2025)','#2c5f8a')
fig.text(0.5,0.02,'Arrow width ~ amount. Amounts are sums of reported grants/contributions across the years shown; they are not budgets for any specific protest. Gold = original funder, purple = pass-through, blue = recipient. Sources: money-flows.csv / sources.csv.',ha='center',fontsize=10)
plt.tight_layout(rect=[0,0.04,1,1]); plt.savefig('network.png',dpi=130); print(EA); print(EB)
