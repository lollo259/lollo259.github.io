/* The Orem — Exhibit Locker. Vanilla JS, no build step. */
(function(){
'use strict';
const $=s=>document.querySelector(s), app=$('#app');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let IDX=null, LINKRE=null, LINKMAP={};
const st={q:'',type:'',cat:'',cls:'',range:'',page:1};
const showAll=()=>localStorage.getItem('orem-explicit')==='show';
const revealed=new Set();
const PER=60;

function hash(s){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function photo(e,size,i,big){
  const inner=e.image?`<img class="fx-img" src="${esc(e.image)}" alt="${esc(e.name)}" loading="lazy">`
   :'';
  return `<div class="photo${e.image?' has-img':''}">${inner}<div class="mk" style="left:12px;top:12px">${i}</div>${big?'<div class="mk" style="right:80px;top:50px">'+i+'a</div>':''}<div class="pid">IMG_${4410+e.i}</div></div>`;
}
function nav(){
  return `<nav><a href="#/"><b>THE OREM — EXHIBIT LOCKER</b></a><span>Site-██ · Property &amp; Exhibits Unit</span>
  <span><a href="#/">Home</a> · <a href="#/index">Index</a> · <a href="#/simulations">Simulations</a> · <a href="#" id="xt">Explicit: ${showAll()?'shown':'gated'}</a></span></nav>`;}
function bindNav(){const x=$('#xt');if(x)x.onclick=ev=>{ev.preventDefault();localStorage.setItem('orem-explicit',showAll()?'gate':'show');route()}}
function filtered(){
  const toks=st.q.toLowerCase().split(/\s+/).filter(Boolean);
  return IDX.entries.filter(e=>{
    if(st.type&&e.type!==st.type)return false; if(st.cat&&e.category!==st.cat)return false;
    if(st.cls&&e.object_class!==st.cls)return false; if(st.range&&e.range!==st.range)return false;
    if(!toks.length)return true;
    const hay=(e.rem+' '+e.name+' '+e.aliases.join(' ')+' '+e.category+' '+e.type+' '+e.excerpt).toLowerCase();
    return toks.every(t=>hay.includes(t));});
}
const uniq=k=>[...new Set(IDX.entries.map(e=>e[k]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
function sel(id,label,vals,cur){return `<select id="${id}" aria-label="${label}"><option value="">${label}: all</option>${vals.map(v=>`<option${v===cur?' selected':''}>${esc(v)}</option>`).join('')}</select>`}
function controls(){
  return `<div class="ctl"><input id="q" type="search" placeholder="Search name, alias, REM number, text…" value="${esc(st.q)}" aria-label="Search">
  ${sel('ft','Type',uniq('type'),st.type)}${sel('fc','Category',uniq('category'),st.cat)}${sel('fo','Class',uniq('object_class'),st.cls)}${sel('fr','Range',uniq('range'),st.range)}
  <button class="btn" id="rs">Reset</button></div><div id="res"></div>`;}
function card(e){
  return `<a class="card" href="#/${e.slug}">${photo(e,120,e.i+1)}<div class="tag"><b class="mono">EXHIBIT ${e.i+1} · ${esc(e.rem)}</b>${e.explicit?'<span class="flag">CW</span>':''}<br>${esc(e.name.length>46?e.name.slice(0,44)+'…':e.name)}<br><span class="g">${esc(e.type)} · Class: ${esc(e.object_class.slice(0,30))}</span></div></a>`;}
function renderList(){
  const list=filtered(),pages=Math.max(1,Math.ceil(list.length/PER));st.page=Math.min(st.page,pages);
  const items=list.slice((st.page-1)*PER,st.page*PER);
  let pg='';if(pages>1){pg='<div class="pg">'+Array.from({length:pages},(_,i)=>i+1).map(p=>p===st.page?`<span class="on">${p}</span>`:`<a href="#" data-p="${p}">${p}</a>`).join('')+'</div>'}
  $('#res').innerHTML=`<div class="g mono" style="font-size:12px" id="cnt">${list.length} exhibit${list.length===1?'':'s'} match · page ${st.page}/${pages}</div>${pg}<div class="grid">${items.map(card).join('')}</div>${pg}`;
  $('#res').querySelectorAll('[data-p]').forEach(a=>a.onclick=ev=>{ev.preventDefault();st.page=+a.dataset.p;renderList();window.scrollTo(0,$('#res').offsetTop-20)});
}
function bindControls(){
  let t;$('#q').oninput=ev=>{clearTimeout(t);t=setTimeout(()=>{st.q=ev.target.value;st.page=1;renderList()},120)};
  [['ft','type'],['fc','cat'],['fo','cls'],['fr','range']].forEach(([id,k])=>$('#'+id).onchange=ev=>{st[k]=ev.target.value;st.page=1;renderList()});
  $('#rs').onclick=()=>{Object.assign(st,{q:'',type:'',cat:'',cls:'',range:'',page:1});route()};
  renderList();
}
function home(){
  const E=IDX.entries,c=f=>E.filter(f).length;
  app.innerHTML=`<div class="w">${nav()}<div class="hd"><h1>The Orem<span class="red">.</span></h1><div class="case"><span class="g">Case number</span><b>OR-2026-000417</b>Anomalous items, deities, beings and places catalogued by the Orem. Logged by Dr. Daedalus. Do not handle without clearance.</div></div>
  <div class="counts"><div><b>${E.length}</b>exhibits</div><div><b>${c(e=>e.type==='Character')}</b>characters</div><div><b>${c(e=>e.full)}</b>full dossiers</div><div><b>${c(e=>e.logs)}</b>with logs</div><div><b>${c(e=>e.interviews)}</b>with interviews</div><div><b>${c(e=>e.explicit)}</b>content-warned</div></div>
  ${controls()}<span class="foot">Index generated ${esc(IDX.generated)} · REM-XXX sorts last.</span></div>`;
  bindNav();bindControls();
}
function indexPage(){app.innerHTML=`<div class="w">${nav()}<h2 class="t" style="margin-top:28px">Exhibit index</h2>${controls()}</div>`;bindNav();bindControls();}
/* front matter + sections */
function parseMd(txt){
  const m=txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);const body=m?m[2]:txt;
  const secs=[];const re=/^## (.+)\r?\n<!-- type: ([^|>]+?)\s*(?:\|([^>]*?))?-->\r?\n/gm;let mm,last=null;
  while((mm=re.exec(body))){if(last)last.text=body.slice(last.end,mm.index).trim();last={title:mm[1],type:mm[2].trim(),meta:(mm[3]||'').trim(),end:re.lastIndex};secs.push(last)}
  if(last)last.text=body.slice(last.end).trim();
  if(!secs.length)secs.push({title:'Text',type:'description',meta:'',text:body.trim()});
  return secs;}
function buildLinks(){
  const names=[];IDX.entries.forEach(e=>{const base=e.name.replace(/\s*\(.*$/,'').replace(/^["“]|["”]$/g,'').trim();
   [base,...e.aliases].forEach(n=>{n=n.replace(/^["“]|["”]$/g,'').trim();if(n.length>=6&&!/^(The|Character|Unnamed)$/i.test(n)&&!LINKMAP[n.toLowerCase()]){LINKMAP[n.toLowerCase()]=e.slug;names.push(n)}})});
  names.sort((a,b)=>b.length-a.length);
  LINKRE=new RegExp('(^|[^\\w])('+names.map(n=>esc(n).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\w])','gi');
}
function inline(s,self,used){
  let h=esc(s);
  h=h.replace(/\[(REM-[A-Za-z0-9\-]+|O-REM)\]\(#\/([a-z0-9\-]+)\)/g,(a,t,sl)=>`<a class="xl mono" href="#/${sl}">${t}</a>`);
  h=h.replace(/\[([^\]]+)\]\(([a-z0-9\-]+\.html)\)/g,'<a href="$2">$1</a>');
  return h.replace(/\*\*([^*]+?)\*\*/g,'<b>$1</b>').replace(/\/\/([^/]+?)\/\//g,'<i>$1</i>');
}
const SPK=/^(?:&gt;\s*|>\s*)?\*{0,2}([A-Za-zÀ-ÿ0-9 .'’\-\[\]█<>&;]{1,48}?)\*{0,2}:\*{0,2}\s+(.+)$/;
function transcript(text,self,used){
  return '<div class="tr">'+text.split('\n').map(l=>{l=l.replace(/^>\s?/,'');
    if(!l.trim())return '';
    if(/^\**\s*(<|&lt;).*(>|&gt;)\s*\**$|^(LOG|REGISTRO)[ .]/i.test(l.trim()))return `<div class="st">${inline(l.replace(/\*\*/g,''),self,used)}</div>`;
    const m=l.match(SPK);
    if(m&&!/https?$/.test(m[1]))return `<div class="ln"><span class="sp">${inline(m[1],self,used)}</span><span>${inline(m[2],self,used)}</span></div>`;
    return `<div class="st" style="font-style:normal;color:#111">${inline(l,self,used)}</div>`;}).join('')+'</div>';
}
function section(s,self,used){
  const t=s.type,isT=(t==='log'||t==='interview')||/<Begin log>|&lt;Begin log|<Inizio registro>/i.test(s.text);
  const body=isT?transcript(s.text,self,used):s.text.split(/\n{1,}/).map(p=>`<p>${inline(p,self,used)}</p>`).join('');
  return `<div class="sec" data-type="${esc(t)}"><h3>${esc(s.title.replace(/\*\*/g,''))}</h3><div class="meta">${esc(t.toUpperCase())}${s.meta?' · '+esc(s.meta):''}</div>${body}</div>`;}
function renderSecs(secs,slug,used){
  const art=secs.filter(s=>s.type==='article');if(!art.length)return secs.map(s=>section(s,slug,used)).join('');
  const rest=secs.filter(s=>s.type!=='article');
  const A=art.map(s=>`<div class="sec art"><h3>${esc(s.title)}</h3>${s.text.split(/\n{1,}/).map(p=>/^- /.test(p)?`<p class="li">${inline(p.slice(2),slug,used)}</p>`:`<p>${inline(p,slug,used)}</p>`).join('')}</div>`).join('');
  return A+(rest.length?`<details class="srcx"><summary class="mono">SOURCE EXCERPTS (${rest.length})</summary>${rest.map(s=>section(s,slug,used)).join('')}</details>`:'');}
async function entry(slug){
  const rd=IDX.redirects&&IDX.redirects[slug];if(rd&&rd.to){location.replace('#/'+rd.to);return}
  if(rd){app.innerHTML=`<div class="w">${nav()}<h2 class="t">${esc(rd.rem)}: retired</h2><p>This number was removed from the catalogue and is not reused.</p><a href="#/index">Index</a></div>`;bindNav();return}
  const e=IDX.entries.find(x=>x.slug===slug);
  if(!e){app.innerHTML=`<div class="w">${nav()}<h2 class="t">No exhibit ${esc(slug)}</h2><a href="#/">Back</a></div>`;bindNav();return}
  app.innerHTML=`<div class="w">${nav()}<p class="mono g">Retrieving ${esc(e.rem)}…</p></div>`;
  let secs;try{const r=await fetch(`content/entries/${slug}.md`);if(!r.ok)throw new Error(r.status);secs=parseMd(await r.text())}catch(err){secs=[{title:'Error',type:'note',meta:'',text:'Could not load content file: '+err}]}
  const E=IDX.entries,prev=E[e.i-1],next=E[e.i+1],used=new Set();
  const gated=e.explicit&&!showAll()&&!revealed.has(slug);
  const ali=e.aliases.length?`<div class="g">a.k.a. ${esc(e.aliases.join(' · '))}</div>`:'';
  app.innerHTML=`<div class="w">${nav()}<div class="ent"><div class="side">${photo(e,300,e.i+1,true)}${e.image_caption?'<div class="cap mono">'+esc(e.image_caption)+'</div>':''}${e.image2?'<a class="img2" href="'+esc(e.image2)+'" target="_blank" rel="noopener"><img src="'+esc(e.image2)+'" alt="'+esc(e.name)+' (alternate version)" loading="lazy"><span class="mono">Alternate version</span></a>':''}${e.gallery?e.gallery.split('|').filter(Boolean).map(x=>{const [u,c]=x.split('::');return '<a class="img2" href="'+esc(u)+'" target="_blank" rel="noopener"><img src="'+esc(u)+'" alt="'+esc(c||e.name)+'" loading="lazy"><span class="mono">'+esc(c||'Image')+'</span></a>'}).join(''):''}
  <table style="margin-top:18px"><tr><th>Item #</th><td class="mono">${esc(e.rem)}</td></tr><tr><th>Name</th><td>${esc(e.name)}</td></tr><tr><th>Type</th><td>${esc(e.type)}</td></tr><tr><th>Category</th><td>${esc(e.category)}</td></tr><tr><th>Object class</th><td>${esc(e.object_class)}</td></tr>${e.catalogued_by?'<tr><th>Catalogued by</th><td>'+esc(e.catalogued_by)+'</td></tr>':''}<tr><th>Source</th><td>${esc(e.source)}</td></tr><tr><th>Content</th><td>${e.explicit?'<span class="flag">CONTENT WARNING</span>':'—'}</td></tr></table>
  <table style="margin-top:18px"><tr><th style="width:auto">#</th><th>Released by</th><th>Received by</th><th>Purpose</th></tr>
  <tr class="mono"><td>1</td><td>${esc(e.source)}</td><td>Dr. Daedalus</td><td>Transcription</td></tr><tr class="mono"><td>2</td><td>Dr. Daedalus</td><td>Site-██ archive</td><td>Cataloguing</td></tr><tr class="mono"><td>3</td><td>Site-██ archive</td><td>Exhibit locker</td><td>Display</td></tr></table>
  <div class="g mono" style="font-size:10px;margin-top:6px">Chain of custody</div></div>
  <div><div class="g mono" style="font-size:12px">EXHIBIT ${e.i+1} · ITEM # ${esc(e.rem)} · OBJECT CLASS: ${esc(e.object_class.toUpperCase())}</div><h2 class="t">${esc(e.name.replace(/\s*\(.*$/,'')||e.name)}</h2>${ali}
  <div id="body">${gated?`<div class="gate"><b>CONTENT WARNING</b><p>This exhibit contains sexually explicit or extreme material from the source text. The text is reproduced intact.</p><button id="rv">Reveal this exhibit</button> <button id="rva">Reveal all exhibits</button></div>`:renderSecs(secs,slug,used)}</div>
  <div class="pn">${prev?`<a href="#/${prev.slug}">← ${esc(prev.rem)} ${esc(prev.name.slice(0,30))}</a>`:'<span></span>'}<a href="#/index">Index</a>${next?`<a href="#/${next.slug}">${esc(next.rem)} ${esc(next.name.slice(0,30))} →</a>`:'<span></span>'}</div></div></div></div>`;
  bindNav();
  if(gated){$('#rv').onclick=()=>{revealed.add(slug);entry(slug)};$('#rva').onclick=()=>{localStorage.setItem('orem-explicit','show');entry(slug)}}
  window.scrollTo(0,0);document.title=`${e.rem} ${e.name.replace(/\s*\(.*$/,'')} — The Orem.`;
}

/* Simulations: data in content/simulations/tournament.json (editable via the editor). No outcomes are invented here. */
let SIM=null;
function remLink(sl){const e=IDX.entries.find(x=>x.slug===sl);return e?`<a class="xl mono" href="#/${sl}">${esc(e.rem)}</a> ${esc(e.name.replace(/\s*\(.*$/,''))}`:esc(sl)}
function slotTxt(x){return x&&x.startsWith('rem-')?remLink(x):`<span class="g">${esc(x||'TBD')}</span>`}
function resTxt(m){return m.result?`<b>${esc(m.result)}</b>`:m.winner?'<b class="mono">WINNER SELECTED</b>':'<span class="sim-p mono">PENDING SIMULATION</span>'}
function simBuild(T){
  const P=(T.participants||[]).filter(Boolean),N=P.length;let B=1;while(B*2<=N)B*=2;
  if(T.bracket_size&&T.bracket_size>=2&&T.bracket_size<=N&&!(T.bracket_size&(T.bracket_size-1)))B=T.bracket_size;
  const R=T.results||{},rounds=[];let field=P.slice(),pr=0;
  while(field.length>B){pr++;const need=Math.min(field.length-B,Math.floor(field.length/2));const byes=field.slice(0,field.length-2*need),pool=field.slice(field.length-2*need);
    const ms=[];for(let i=0;i<need;i++){const id=(pr>1?`P${pr}-`:'P-')+(i+1);ms.push({id,a:pool[2*i],b:pool[2*i+1]})}
    rounds.push({name:pr>1?`Preliminary round ${pr}`:'Preliminary round',short:pr>1?`Prelim ${pr}`:'Prelim',byes:byes.length,ms});field=[...byes,...ms.map(m=>'@'+m.id)]}
  let size=field.length;const nm=n=>n===2?'Final':n===4?'Semi-finals':n===8?'Quarter-finals':`Round of ${n}`,pre=n=>n===2?'F':n===4?'SF':n===8?'QF':`R${n}`;
  while(size>=2){const ms=[];for(let i=0;i<size/2;i++){const id=size===2?'F':`${pre(size)}-${i+1}`;ms.push({id,a:field[i],b:field[size-1-i]})}
    rounds.push({name:nm(size),short:size===2?'Final':size===4?'SF':size===8?'QF':String(size),ms});field=ms.map(m=>'@'+m.id);size/=2}
  const all={};rounds.forEach(r=>r.ms.forEach(m=>{all[m.id]=m;m.round=r;const x=R[m.id]||{};m.result=x.result||'';m.winner=x.winner||'';m.reasoning=x.reasoning||''}));
  const res=x=>{if(x&&x[0]==='@'){const m=all[x.slice(1)];return m&&m.winner?m.winner:'Winner '+x.slice(1)}return x};
  rounds.forEach(r=>r.ms.forEach(m=>{m.a=res(m.a);m.b=res(m.b)}));
  return {N,B,rounds,all};
}
/* remove results whose winner is no longer one of the match's fighters (after a change upstream) */
function simPrune(T){for(let k=0;k<40;k++){const X=simBuild(T);let ch=false;for(const id in (T.results||{})){const m=X.all[id],r=T.results[id];
  if(!m){delete T.results[id];ch=true;continue}
  if(r.winner&&r.winner!==m.a&&r.winner!==m.b){delete r.winner;ch=true}
  if(!r.winner&&!r.result&&!r.reasoning){delete T.results[id];ch=true}}if(!ch)return}}
const SS={tab:null,q:'',zoom:1,undo:[],dirty:false,open:null,msg:''};
const simEd=()=>true;
function simDraw(){const P=IDX.entries.filter(e=>e.type==='Character').map(e=>e.slug);for(let i=P.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[P[i],P[j]]=[P[j],P[i]]}SIM.participants=P;SIM.results={};SIM.bracket_size=0;SS.undo=[];SS.dirty=false;SS.tab=null;SS.open=null;SS.msg=''}
const nameOf=sl=>{const e=IDX.entries.find(x=>x.slug===sl);return e?(e.rem+' '+e.name):sl};
function simSnap(){SS.undo.push(JSON.stringify(SIM.results||{}));if(SS.undo.length>200)SS.undo.shift();SS.dirty=true}
function fighter(m,side,ed){const x=m[side],ok=x&&x.startsWith('rem-'),win=m.winner&&m.winner===x,lose=m.winner&&m.winner!==x;
  const lab=ok?(()=>{const e=IDX.entries.find(y=>y.slug===x);return e?`<span class="mono">${esc(e.rem)}</span> ${esc(e.name.replace(/\s*\(.*$/,''))}`:esc(x)})():`<span class="g">${esc(x||'TBD')}</span>`;
  return `<div class="sf${win?' win':''}${lose?' lose':''}">${ed&&ok&&m.a.startsWith('rem-')&&m.b.startsWith('rem-')?`<button class="pick" data-m="${esc(m.id)}" data-w="${esc(x)}" title="Pick as winner">${win?'★':'☆'}</button>`:''}${lab}${ok?` <a class="xl mono sfl" href="#/${x}" title="Open entry">↗</a>`:''}</div>`}
function simCard(m,ed){const op=SS.open===m.id;
  return `<div class="sc${m.winner?' done':''}" id="m-${esc(m.id)}"><div class="sch mono"><a href="#/simulations/match/${esc(m.id)}">${esc(m.id)}</a><span>${resTxt(m)}</span>${ed?`<button class="sm" data-open="${esc(m.id)}">${op?'close':'notes'}</button>`:''}</div>
  ${fighter(m,'a',ed)}${fighter(m,'b',ed)}
  ${ed&&op?`<div class="sce"><label class="mono">Result</label><input type="text" data-f="result" data-m="${esc(m.id)}" value="${esc(m.result)}" placeholder="e.g. Won by …"><label class="mono">Reasoning</label><textarea data-f="reasoning" data-m="${esc(m.id)}" rows="4">${esc(m.reasoning)}</textarea>${m.winner?`<button class="sm" data-clear="${esc(m.id)}">Clear winner</button>`:''}</div>`:''}</div>`}
function simRender(){
  const T=SIM,X=simBuild(T),ed=simEd();
  if(!SS.tab||!X.rounds.find(r=>r.name===SS.tab))SS.tab=X.rounds[0].name;
  const R=X.rounds.find(r=>r.name===SS.tab),q=SS.q.trim().toLowerCase();
  const ms=q?R.ms.filter(m=>[m.a,m.b].some(x=>(x+' '+nameOf(x)).toLowerCase().includes(q))):R.ms;
  const done=Object.values(X.all).filter(m=>m.winner).length,total=Object.keys(X.all).length;
  const tabs=X.rounds.map(r=>{const d=r.ms.filter(m=>m.winner).length;return `<button class="tab${r.name===SS.tab?' on':''}" data-tab="${esc(r.name)}">${esc(r.short)}<small>${d}/${r.ms.length}</small></button>`}).join('');
  let hits='';if(q){const found=[];X.rounds.forEach(r=>r.ms.forEach(m=>{if([m.a,m.b].some(x=>x.startsWith('rem-')&&(x+' '+nameOf(x)).toLowerCase().includes(q)))found.push(r.name)}));const u=[...new Set(found)];
    hits=`<div class="mono g" style="font-size:11px">Found in: ${u.length?u.map(n=>`<a href="#" data-tab="${esc(n)}">${esc(n)}</a>`).join(' · '):'no round'}</div>`}
  app.innerHTML=`<div class="w">${nav()}<h2 class="t" style="margin-top:28px">Simulations<span class="red">.</span></h2>
  <p>${esc(T.framing)}</p><h3 class="mono" style="margin-top:22px">${esc(T.title).toUpperCase()}</h3><p class="g">${esc(T.format)}</p>
  <p class="mono" style="font-size:12px">${X.N} participants · starting bracket ${X.B} · ${total} matches · ${done} decided</p>
  ${X.all.F&&X.all.F.winner?`<div class="sc done" style="margin:10px 0;font-size:16px">🏆 Champion of this simulation: ${remLink(X.all.F.winner)}</div>`:''}<div class="sbar"><button id="s-new">New draw</button><button id="s-undo"${SS.undo.length?'':' disabled'}>Undo</button>
   <input id="s-q" type="search" placeholder="Search fighter or REM number" value="${esc(SS.q)}"><button id="s-zo" title="Zoom out">−</button><span class="mono">${Math.round(SS.zoom*100)}%</span><button id="s-zi" title="Zoom in">+</button><span id="s-msg" class="mono">${esc(SS.msg)}</span></div>
  <div class="tabs">${tabs}</div>${hits}
  <div class="mono g" style="font-size:11px;margin:6px 0">${esc(R.name)} · ${R.ms.length} matches${R.byes?` · ${R.byes} fighters with byes`:''}${q?` · ${ms.length} shown`:''} · click ☆ to pick the winner; winners advance automatically</div>
  <div class="sgrid" style="font-size:${13*SS.zoom}px;grid-template-columns:repeat(auto-fill,minmax(${Math.round(260*SS.zoom)}px,1fr))">${ms.map(m=>simCard(m,ed)).join('')||'<p class="g">No matches.</p>'}</div>
  <p class="mono g" style="font-size:11px;margin-top:20px">Every result is simulated only. Each visit draws a new random bracket; picks stay in this browser tab and are not saved.</p></div>`;
  bindNav();simBind();
}
function simBind(){const A=app;
  A.querySelectorAll('[data-tab]').forEach(b=>b.onclick=e=>{e.preventDefault();SS.tab=b.dataset.tab;simRender()});
  const q=$('#s-q');q.oninput=()=>{SS.q=q.value;const p=q.selectionStart;simRender();const n=$('#s-q');n.focus();n.setSelectionRange(p,p)};
  $('#s-zi').onclick=()=>{SS.zoom=Math.min(1.8,+(SS.zoom+.1).toFixed(1));simRender()};$('#s-zo').onclick=()=>{SS.zoom=Math.max(.6,+(SS.zoom-.1).toFixed(1));simRender()};
  $('#s-new').onclick=()=>{if(!SS.undo.length||confirm('Start a new random draw? Current picks will be lost.')){simDraw();simRender()}};
  A.querySelectorAll('.pick').forEach(b=>b.onclick=()=>{const id=b.dataset.m,w=b.dataset.w;simSnap();SIM.results=SIM.results||{};const r=SIM.results[id]=SIM.results[id]||{};
    r.winner=r.winner===w?'':w;simPrune(SIM);SS.msg='';simRender()});
  A.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{SS.open=SS.open===b.dataset.open?null:b.dataset.open;simRender()});
  A.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>{simSnap();const r=SIM.results[b.dataset.clear];if(r)r.winner='';simPrune(SIM);simRender()});
  A.querySelectorAll('[data-f]').forEach(el=>{el.onfocus=()=>{el._snap=JSON.stringify(SIM.results||{})};el.onchange=()=>{SS.undo.push(el._snap||JSON.stringify(SIM.results||{}));SS.dirty=true;SIM.results=SIM.results||{};const r=SIM.results[el.dataset.m]=SIM.results[el.dataset.m]||{};r[el.dataset.f]=el.value.trim();simPrune(SIM);const s=$('#s-save');if(s){s.disabled=false;s.textContent='Save *'}const u=$('#s-undo');if(u)u.disabled=false}});
  const u=$('#s-undo');if(u)u.onclick=()=>{const p=SS.undo.pop();if(p!=null){SIM.results=JSON.parse(p);SS.dirty=true;simRender()}};
}

async function simPage(h){
  if(!SIM){app.innerHTML=`<div class="w">${nav()}<p class="mono g">Loading simulation records…</p></div>`;bindNav();
    try{SIM=await (await fetch('content/simulations/tournament.json',{cache:'no-cache'})).json();simDraw()}catch(e){app.innerHTML=`<div class="w">${nav()}<p>Simulation records unavailable.</p></div>`;bindNav();return}}
  const T=SIM,X=simBuild(T),mm=h.match(/^simulations\/match\/(.+)$/);
  if(mm){const m=X.all[mm[1]];document.title=`Simulation log ${mm[1]} — The Orem.`;
    app.innerHTML=`<div class="w">${nav()}<div class="g mono" style="margin-top:24px;font-size:12px">SIMULATION LOG · ${esc(T.title)} · MATCH ${esc(mm[1])}</div>
    ${m?`<h2 class="t">${esc(m.round.name)}</h2><table class="sim-t"><tr><th>Participant A</th><td>${slotTxt(m.a)}</td></tr><tr><th>Participant B</th><td>${slotTxt(m.b)}</td></tr>
    <tr><th>Result</th><td>${resTxt(m)}${m.winner?' · winner '+slotTxt(m.winner):''}</td></tr><tr><th>Reasoning</th><td>${m.reasoning?esc(m.reasoning).replace(/\n/g,'<br>'):'<span class="g">No reasoning recorded.</span>'}</td></tr></table>
    <p class="mono g" style="font-size:11px">Simulated only. This record is the output of the Orem's simulation device, not an event in the catalogue.</p>`:'<p>No such match.</p>'}
    <p><a href="#/simulations" id="s-back">← Back to the tournament</a></p></div>`;bindNav();if(m)SS.tab=m.round.name;window.scrollTo(0,0);return}
  document.title='Simulations — The Orem.';simRender();
}
function route(){
  const h=decodeURIComponent(location.hash.replace(/^#\/?/,''));
  if(!h){document.title='The Orem.';home()}else if(h.startsWith('index')){document.title='Index — The Orem.';indexPage()}else if(h==='simulations'||h.startsWith('simulations/')){simPage(h)}else entry(h);
}
fetch('data/index.json',{cache:'no-cache'}).then(r=>r.json()).then(j=>{IDX=j;window.OREM={get idx(){return IDX},route,current:()=>decodeURIComponent(location.hash.replace(/^#\/?/,''))};buildLinks();addEventListener('hashchange',()=>{route();window.dispatchEvent(new Event('orem:route'))});route();window.dispatchEvent(new Event('orem:route'))})
 .catch(err=>{app.innerHTML='<div class="w"><h1>The Orem.</h1><p>Could not load data/index.json ('+esc(err)+'). Serve the folder over HTTP (GitHub Pages or <code>python3 -m http.server</code>).</p></div>'});
})();
