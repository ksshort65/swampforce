import json,matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch
d=json.load(open('raw/diagram_edges.json'))
import csv,collections
co=sum(int(r['amount']) for r in csv.DictReader(open('money-flows.csv')) if r['funder_ein']=='202303252' and r['recipient']=='One Nation')
def panel(ax,cols,E,title,colorf):
    pos={}
    for ci,col in enumerate(cols):
        n=len(col)
        for i,name in enumerate(col): pos[name]=(ci*1.0, 1-(i+0.5)/n)
    mx=max(e[2] for e in E)
    for a,b,v in E:
        (x1,y1),(x2,y2)=pos[a],pos[b]
        w=0.8+10*v/mx
        ax.add_patch(FancyArrowPatch((x1+0.09,y1),(x2-0.09,y2),arrowstyle='-|>',mutation_scale=14,lw=w,color=colorf(a,b),alpha=0.55,connectionstyle='arc3,rad=0.0'))
        t=0.62 if x2-x1>1.5 else 0.5
        ax.text(x1+0.09+(x2-x1-0.18)*t,y1+(y2-y1)*t,f"${v/1e6:,.1f}M",fontsize=7.5,ha='center',va='center',bbox=dict(boxstyle='round,pad=0.15',fc='white',ec='none',alpha=0.85))
    for name,(x,y) in pos.items():
        ax.text(x,y,name,ha='center',va='center',fontsize=8.2,bbox=dict(boxstyle='round,pad=0.35',fc='#f7f3e8' if x==0 else ('#efe6f7' if x==1 else '#e6f0fa'),ec='#666'))
    ax.set_xlim(-0.25,len(cols)-0.75); ax.set_ylim(-0.02,1.02); ax.axis('off'); ax.set_title(title,fontsize=12)
GS='Goldman Sachs Philanthropy Fund\n(donor-advised fund; donor not named)'
A_cols=[[GS,"People's Support Foundation\n(private fdn, Chicago)",'Open Society Policy Center /\nOpen Society Action Fund (c4)','Foundation to Promote\nOpen Society (c3)','Tides Foundation\n(incl. donor-advised funds)'],
        ['Justice and Education Fund','United Community Fund','Common Counsel Foundation\n(fiscal sponsor of M4BL)'],
        ["The People's Forum",'Tricontinental','CodePink',"People's Welfare Association",'Indivisible Project','MoveOn.org Civic Action','Working Families Organization','Sixteen Thirty Fund','JVP Action','Movement 4 Black Lives Inc']]
nm={'Goldman Sachs Philanthropy Fund (GS DAF Philanthropy Fund for Wealth Mgmt)':GS,'Peoples Support Foundation':A_cols[0][1],'Open Society Policy Center':A_cols[0][2],'Foundation to Promote Open Society':A_cols[0][3],'Tides Foundation':A_cols[0][4],'Common Counsel Foundation':A_cols[1][2],'Jewish Voice for Peace Action':'JVP Action'}
EA=[(nm.get(a,a),nm.get(b,b),v) for a,b,v in d['A']]
sing={GS,A_cols[0][1],'Justice and Education Fund','United Community Fund'}
panel_colors=lambda a,b: '#b5651d' if a in sing else '#3b6e8f'
B_cols=[['Future Forward USA Action (c4)','Majority Forward (c4)','Sixteen Thirty Fund (c4)','George Soros (individual,\ndisclosed)','Marble Freedom Trust (c4)','American Action Network (c4)'],
        ['The Concord Fund (c4)','One Nation (c4)'],
        ['Future Forward PAC','Senate Majority PAC','Democratic-aligned super PACs\n(FF PAC, LCV VF, Priorities, etc.)','Democracy PAC / Democracy PAC II','Schwab Charitable Fund (DAF)','Rule of Law Trust','DonorsTrust','Senate Leadership Fund','Congressional Leadership Fund']]
bm={'Future Forward USA Action':'Future Forward USA Action (c4)','Majority Forward':'Majority Forward (c4)','Sixteen Thirty Fund':'Sixteen Thirty Fund (c4)','SOROS, GEORGE':B_cols[0][3],'Marble Freedom Trust':'Marble Freedom Trust (c4)','American Action Network':'American Action Network (c4)','The Concord Fund':'The Concord Fund (c4)','One Nation':'One Nation (c4)','Future Forward PAC':'Future Forward PAC','Senate Majority PAC':'Senate Majority PAC','Democratic-aligned\nsuper PACs':B_cols[2][2],'Democracy PAC / PAC II':'Democracy PAC / Democracy PAC II','Senate Leadership Fund':'Senate Leadership Fund','Congressional Leadership\nFund':'Congressional Leadership Fund','Schwab Charitable Fund':'Schwab Charitable Fund (DAF)','Rule of Law Trust':'Rule of Law Trust','DonorsTrust':'DonorsTrust'}
EB=[(bm[a],bm[b],v) for a,b,v in d['B'] if b!='Knights of Columbus Charitable Fund']
EB.append(('The Concord Fund (c4)','One Nation (c4)',co))
right={'Marble Freedom Trust (c4)','The Concord Fund (c4)','One Nation (c4)','American Action Network (c4)'}
fig,axes=plt.subplots(1,2,figsize=(26,14))
panel(axes[0],A_cols,EA,'A. Documented grants to groups that organized/promoted protests, and their funders\nIRS 990 Schedule I / 990-PF (2019-2024 filings; GS Philanthropy Fund 2017-2024) + OSF database ($15M M4BL grant, 2021)\nBrown = Singham-linked network (link to Singham is reported, not in the filings); blue = other funders',panel_colors)
panel(axes[1],B_cols,EB,'B. Largest documented dark-money flows, both parties\nFEC receipts 2019-2026 cycles (to super PACs) + Marble/Concord 990 Schedule I (FY2019-FY2025)\nBlue = Democratic-aligned, red = Republican-aligned; George Soros shown for comparison (a disclosed donor, not dark money)',lambda a,b: '#b22222' if a in right else '#1f5fa8')
fig.text(0.5,0.015,'Arrow width is proportional to amount. Amounts are sums of reported grants/contributions over the years shown, not budgets for any protest. A grant to an organization is not evidence it paid protesters. Details and links: money-flows.csv, sources.csv.',ha='center',fontsize=10.5)
plt.tight_layout(rect=[0,0.03,1,1]); plt.savefig('network.png',dpi=120)
