/* SwampForce shell: oval buttons, one chart per button, filters, Back and Forward. No evidence rows loaded yet. */
(function(){
var FRAMES=[["chart-methods","Top methods"],["chart-evidence","Verdict"],["chart-words","Words compared"],["chart-betrayal-blocks","By period"]];
var S={
 betrayal:{title:"The Great American Betrayal",row:"great-american-betrayal.html",bg:true,
  filters:[["Verdict",["Proven false","Rated misleading","Still being checked"]],["Proof",["Official record","Transcript or video","Outlet\u2019s own correction","Primary document"]],["Period",["First term","2021\u2013present"]]],
  charts:[
   {id:"omitted-context",label:"Omitted context",images:["images/chart-one-word.jpg"]},
   {id:"misquote",label:"Misquote / truncation",images:["images/chart-one-word-ledger.jpg"]},
   {id:"fabrication",label:"Fabrication / false attribution",frames:true},
   {id:"false-photo",label:"False photo or video",frames:true},
   {id:"premature-proven",label:"Premature \u201cproven\u201d framing",frames:true},
   {id:"retracted",label:"Retracted invention",frames:true},
   {id:"policy-inflation",label:"Policy-scope inflation",frames:true},
   {id:"lawfare",label:"Lawfare",lead:"images/chart-lawfare.jpg",cases:["New York civil fraud","Manhattan criminal","Classified documents","January 6 in Washington","Georgia","The ballot case","Carroll","Immunity","Fischer","The committee referrals"]}
  ]},
 scorecard:{title:"Scorecard",row:"scorecard-charts.html",bg:false,
  filters:[["Show",["Verified","Still being added","White House claim","Helped","Hurt"]]],
  charts:[
   {id:"republicans",label:"Republicans",images:["images/chart-job.jpg","images/chart-policy.jpg","images/chart-1964.jpg"]},
   {id:"democrats",label:"Democrats",images:["images/chart-border.jpg","images/chart-border-all.jpg","images/chart-border-toll.jpg","images/chart-aliens.jpg","images/chart-failure.jpg","images/chart-fema-two-jobs.jpg"]},
   {id:"split",label:"Split",images:["images/chart-debt-bars.jpg","images/chart-debt-why.jpg","images/chart-majority.jpg","images/chart-harm-pie.jpg"]},
   {id:"oval",label:"The Oval",images:["images/chart-oval.jpg","images/chart-oval-encounters.jpg","images/chart-oval-prices.jpg","images/chart-oval-gallon.jpg","images/chart-oval-cases.jpg","images/chart-inflation-party.jpg"]},
   {id:"side-by-side",label:"Side by side",images:["images/chart-helped-hurt.jpg","images/chart-blame.jpg"]}
  ]}
};
function el(t,a,h){var e=document.createElement(t);if(a)for(var k in a){if(k==="text")e.textContent=a[k];else e.setAttribute(k,a[k]);}if(h)h.forEach(function(c){e.appendChild(c)});return e;}
function nameOf(p){return p.split("/").pop().replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ");}
function oval(href,label,img){var o=el("span",{"class":"oval"+(img?"":" text")});if(img)o.style.backgroundImage="url('"+img+"')";else o.textContent=label;
 var a=el("a",{"class":"oval-btn",href:href,"aria-label":label},[o]);if(img)a.appendChild(el("span",{text:label}));return a;}

function loadIncoming(cb){
 var done=false;function fin(d){if(done)return;done=true;cb(d||{});}
 if(location.protocol.indexOf("http")===0){
  fetch("incoming/list.php",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json();}).then(fin).catch(function(){fin(window.SF_INCOMING);});
 } else fin(window.SF_INCOMING);
}

function rowPage(key){
 var s=S[key],root=document.getElementById("app");
 var nav=el("div",{"class":"nav"},[el("a",{href:"index.html",text:"\u2190 Back"}),el("span")]);
 var row=el("div",{"class":"row"});
 s.charts.forEach(function(c){row.appendChild(oval("chart.html?s="+key+"&c="+c.id,c.label,c.lead||(c.images&&c.images[0])||null));});
 root.appendChild(nav);root.appendChild(el("h1",{text:s.title}));root.appendChild(row);
}

function chartPage(){
 var q=new URLSearchParams(location.search),key=q.get("s"),s=S[key];if(!s){location.replace("index.html");return;}
 var c=s.charts.filter(function(x){return x.id===q.get("c");})[0];if(!c){location.replace(s.row);return;}
 if(s.bg)document.body.classList.add("flag-bg");
 document.title=c.label+" \u2014 SwampForce";
 loadIncoming(function(inc){
  var parts=[];
  (c.images||[]).forEach(function(src){parts.push({kind:"img",src:src,label:nameOf(src),tags:[]});});
  (c.cases||[]).forEach(function(n){parts.push({kind:"case",label:n,tags:[]});});
  (inc[key+"/"+c.id]||[]).forEach(function(it){parts.push({kind:"img",src:it.img,url:it.url||null,label:nameOf(it.img),tags:it.tags||[]});});
  var fkey="sf-f-"+key+"-"+c.id,active={};try{active=JSON.parse(sessionStorage.getItem(fkey)||"{}");}catch(e){}
  function visible(){return parts.filter(function(p){for(var g in active){if(active[g].length&&!active[g].some(function(v){return p.tags.indexOf(v)>=0;}))return false;}return true;});}
  function render(){
   var root=document.getElementById("app");root.innerHTML="";
   var m=location.hash.match(/^#part-(\d+)$/),vis=visible();
   var idx=m?parseInt(m[1],10):-1;if(idx>=vis.length)idx=-1;
   var back=el("button",{type:"button",text:"\u2190 Back"}),fwd=el("button",{type:"button",text:"Forward \u2192"});
   back.onclick=function(){if(idx<0)location.href=s.row;else location.hash="";};
   if(idx+1>=vis.length)fwd.disabled=true;fwd.onclick=function(){location.hash="part-"+(idx+1);};
   root.appendChild(el("div",{"class":"nav"},[back,fwd]));
   root.appendChild(el("h1",{text:c.label}));
   if(idx>=0){
    var p=vis[idx],box=el("div",{"class":"one"});
    if(p.kind==="img"){box.appendChild(el("img",{src:p.src,alt:p.label}));if(p.url)box.appendChild(el("a",{"class":"proof",href:p.url,target:"_blank",rel:"noopener",text:"Proof \u2197"}));}
    else{box.appendChild(el("h1",{text:p.label}));box.appendChild(el("p",{"class":"empty",text:"Evidence rows not loaded yet."}));}
    root.appendChild(box);return;
   }
   var fw=el("div",{"class":"filters"});
   s.filters.forEach(function(f){var g=el("div",{"class":"fgroup"},[el("span",{text:f[0]})]);
    f[1].forEach(function(v){var on=(active[f[0]]||[]).indexOf(v)>=0,b=el("button",{type:"button","class":"pill"+(on?" on":""),"aria-pressed":on?"true":"false",text:v});
     b.onclick=function(){var a=active[f[0]]=active[f[0]]||[],i=a.indexOf(v);if(i>=0)a.splice(i,1);else a.push(v);sessionStorage.setItem(fkey,JSON.stringify(active));render();};g.appendChild(b);});
    fw.appendChild(g);});
   var clr=el("button",{type:"button","class":"pill",text:"Clear filters"});clr.onclick=function(){active={};sessionStorage.removeItem(fkey);render();};
   fw.appendChild(el("div",{"class":"fgroup"},[clr]));root.appendChild(fw);
   if(c.lead)root.appendChild(el("img",{"class":"lead-img",src:c.lead,alt:c.label}));
   var grid=el("div",{"class":"parts"});
   if(c.frames)FRAMES.forEach(function(f){grid.appendChild(el("div",{"class":"part frame","data-chart":f[0]},[el("div",{"class":"cap",text:f[1]}),el("div",{"class":"cap",text:"Rows not loaded yet"})]));});
   vis.forEach(function(p,i){var b=el("button",{type:"button","class":"part"});
    if(p.kind==="img")b.appendChild(el("img",{src:p.src,alt:p.label,loading:"lazy"}));
    if(p.kind!=="img")b.appendChild(el("div",{"class":"cap",text:p.label}));b.onclick=function(){location.hash="part-"+i;};grid.appendChild(b);});
   root.appendChild(grid);
   if(!vis.length&&parts.length)root.appendChild(el("p",{"class":"empty",text:"Nothing tagged with this filter yet."}));
  }
  window.addEventListener("hashchange",render);render();
 });
}
window.SFShell={row:rowPage,chart:chartPage};
})();
