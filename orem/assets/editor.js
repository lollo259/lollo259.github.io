/* The Orem — in-site editor. Clearance = a password that decrypts clearance.json (an AES-GCM-encrypted
   fine-grained GitHub token) in the browser. No token is in this code; the decrypted token lives in sessionStorage only. */
(function(){
'use strict';
const CFG={api:(window.OREM_API||'https://api.github.com'),repo:'lollo259/lollo259.github.io',branch:'main',dir:'orem'};
const KEY='orem-clearance';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TYPES=['Character','Entity','Place','Object','Faction','Ritual','Other'];
const getTok=()=>sessionStorage.getItem(KEY)||'';
let CLR=undefined; // undefined=loading, null=not configured, object=configured
fetch('clearance.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{CLR=(j&&j.ct)?j:null;label()}).catch(()=>{CLR=null;label()});
function clearTok(){sessionStorage.removeItem(KEY);localStorage.removeItem(KEY)}
const b64e=s=>{const b=new TextEncoder().encode(s);let x='';for(let i=0;i<b.length;i+=0x8000)x+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(x)};
const b64d=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
async function gh(path,opt={}){
  const r=await fetch(`${CFG.api}${path}`,{...opt,headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+getTok(),'X-GitHub-Api-Version':'2022-11-28',...(opt.body?{'Content-Type':'application/json'}:{})}});
  if(r.status===404)return null;
  if(!r.ok){const t=await r.text();throw new Error(`GitHub ${r.status}: ${t.slice(0,200)}`)}
  return r.json();
}
const cpath=p=>`/repos/${CFG.repo}/contents/${CFG.dir}/${p}`;
async function getFile(p){const j=await gh(cpath(p)+`?ref=${CFG.branch}`);return j?{sha:j.sha,text:j.content?b64d(j.content):''}:null}
async function putFile(p,b64,sha,msg){return gh(cpath(p),{method:'PUT',body:JSON.stringify({message:msg,content:b64,branch:CFG.branch,...(sha?{sha}:{})})})}
async function verify(tok){ /* kept for setup page parity */
  const r=await fetch(`${CFG.api}/repos/${CFG.repo}`,{headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+tok}});
  if(!r.ok)return false;const j=await r.json();return !!(j.permissions&&(j.permissions.push||j.permissions.admin));
}
/* front matter */
function parseFM(txt){
  const m=txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);const d={};if(!m)return{data:d,body:txt};
  const L=m[1].split(/\r?\n/);let k=null;
  const sc=v=>{v=v.trim();if(v.startsWith('"'))try{return JSON.parse(v)}catch{return v.slice(1,-1)}if(v.startsWith("'"))return v.slice(1,-1).replace(/''/g,"'");if(v==='true')return true;if(v==='false')return false;if(v==='[]')return[];return v};
  for(const l of L){const a=l.match(/^([A-Za-z_]+):\s*(.*)$/);if(a){k=a[1];d[k]=a[2]===''?[]:sc(a[2]);continue}
    const it=l.match(/^\s+-\s+(.*)$/);if(it&&k){if(!Array.isArray(d[k]))d[k]=[];d[k].push(sc(it[1]))}}
  return {data:d,body:m[2]};
}
function toFM(d,body){
  const q=v=>JSON.stringify(v==null?'':String(v));
  const al=(d.aliases||[]).filter(Boolean);
  return ['---',`rem: ${q(d.rem)}`,`name: ${q(d.name)}`,al.length?'aliases:':'aliases: []',...al.map(a=>`  - ${q(a)}`),
   `type: ${q(d.type)}`,`category: ${q(d.category)}`,`object_class: ${q(d.object_class)}`,`source: ${q(d.source)}`,`source_id: ${q(d.source_id)}`,
   `explicit: ${d.explicit?'true':'false'}`,`notes: ${q(d.notes)}`,`image: ${q(d.image)}`,'---','',body.replace(/^\n+/,'')].join('\n');
}
const slugOf=rem=>String(rem).trim().toLowerCase().replace(/█/g,'redacted').replace(/[^a-z0-9-]/g,'');
/* UI */
const css=`.oe-btn{position:fixed;right:14px;bottom:14px;z-index:50;font:10px "IBM Plex Mono",Menlo,monospace;letter-spacing:.08em;background:#fff;border:1px solid #111;padding:6px 10px;cursor:pointer;opacity:.55}.oe-btn:hover{opacity:1;background:#ffd400}
.oe-ov{position:fixed;inset:0;background:rgba(255,255,255,.92);z-index:60;overflow:auto}.oe-p{max-width:980px;margin:30px auto;border:2px solid #111;background:#fff;padding:22px 26px;font-size:13px}
.oe-p h3{font:700 13px "IBM Plex Mono",Menlo,monospace;letter-spacing:.1em;margin:0 0 14px;border-bottom:1px solid #111;padding-bottom:8px}
.oe-p label{display:block;font:10px "IBM Plex Mono",Menlo,monospace;color:#666;margin-top:10px;text-transform:uppercase;letter-spacing:.06em}
.oe-p input[type=text],.oe-p input[type=password],.oe-p select,.oe-p textarea{width:100%;box-sizing:border-box;font:13px "IBM Plex Mono",Menlo,monospace;border:1px solid #111;padding:7px;border-radius:0;background:#fff}
.oe-p textarea{min-height:420px;font-size:12px;line-height:1.5}.oe-g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 14px}
.oe-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.oe-row button{font:12px monospace;border:1px solid #111;background:#fff;padding:7px 12px;cursor:pointer}.oe-row button.pri{background:#ffd400}
.oe-msg{font:12px monospace;margin-top:10px;white-space:pre-wrap}.oe-msg.err{color:#d90012}.oe-msg.ok{color:#0a6b2a}
@media(max-width:760px){.oe-g{grid-template-columns:1fr}}`;
document.head.insertAdjacentHTML('beforeend',`<style>${css}</style>`);
const btn=document.createElement('button');btn.className='oe-btn';btn.id='oe-btn';btn.type='button';document.body.appendChild(btn);
function label(){btn.textContent=getTok()?'EDIT':(CLR===null?'CLEARANCE NOT CONFIGURED':'REQUEST CLEARANCE')}
label();
function overlay(html){close();const o=document.createElement('div');o.className='oe-ov';o.id='oe-ov';o.innerHTML=`<div class="oe-p">${html}</div>`;document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o)close()});return o}
function close(){const o=$('#oe-ov');if(o)o.remove()}
function msg(t,cls){const m=$('#oe-msg');if(m){m.className='oe-msg '+(cls||'');m.textContent=t}}
function askCode(next){
  if(CLR===null){overlay(`<h3>CLEARANCE NOT CONFIGURED</h3><p>This locker has no clearance on file.</p><div class="oe-row"><button id="oe-x">Close</button></div>`);$('#oe-x').onclick=close;return}
  overlay(`<h3>REQUEST CLEARANCE</h3><p>Enter your clearance password.</p>
  <label for="oe-code">Password</label><input type="password" id="oe-code" autocomplete="current-password" spellcheck="false">
  <div class="oe-row"><button class="pri" id="oe-go">Verify</button><button id="oe-x">Cancel</button></div><div id="oe-msg" class="oe-msg"></div>`);
  $('#oe-x').onclick=close;
  const go=async()=>{const pw=$('#oe-code').value;if(!pw)return;msg('Verifying…');
    try{const tok=await window.OREM_CLEARANCE.decrypt(CLR,pw);if(!/^(github_pat_|ghp_)/.test(tok))throw 0;sessionStorage.setItem(KEY,tok)}
    catch{msg('Clearance denied.','err');return}
    $('#oe-code').value='';label();close();next&&next()};
  $('#oe-go').onclick=go;$('#oe-code').onkeydown=e=>{if(e.key==='Enter')go()};$('#oe-code').focus();
}
function form(d,body,isNew){
  return `<h3>${isNew?'NEW EXHIBIT':'EDIT EXHIBIT · '+esc(d.rem)}</h3>
  <div class="oe-g"><div><label>REM number</label><input type="text" id="f-rem" value="${esc(d.rem)}" ${isNew?'':'readonly'}></div>
  <div><label>Type</label><select id="f-type">${TYPES.map(t=>`<option${t===d.type?' selected':''}>${t}</option>`).join('')}</select></div>
  <div><label>Object class</label><input type="text" id="f-object_class" value="${esc(d.object_class)}"></div></div>
  <label>Name</label><input type="text" id="f-name" value="${esc(d.name)}">
  <label>Aliases (separate with ;)</label><input type="text" id="f-aliases" value="${esc((d.aliases||[]).join('; '))}">
  <div class="oe-g"><div><label>Category</label><input type="text" id="f-category" value="${esc(d.category)}"></div>
  <div><label>Source</label><input type="text" id="f-source" value="${esc(d.source)}"></div><div><label>Source ID</label><input type="text" id="f-source_id" value="${esc(d.source_id)}"></div></div>
  <div class="oe-g"><div><label>Image path</label><input type="text" id="f-image" value="${esc(d.image)}" placeholder="assets/img/rem-xxx.jpg"></div>
  <div><label>Upload image</label><input type="file" id="f-file" accept="image/*"></div>
  <div><label>Content warning</label><label style="text-transform:none;font-size:12px;color:#111"><input type="checkbox" id="f-explicit"${d.explicit?' checked':''}> explicit (gated)</label></div></div>
  <label>Notes</label><input type="text" id="f-notes" value="${esc(d.notes)}">
  <label>Body (markdown; keep "## Title" + "&lt;!-- type: … --&gt;" markers)</label><textarea id="f-body" spellcheck="false">${esc(body)}</textarea>
  <div class="oe-row"><button class="pri" id="oe-save">Save &amp; commit</button><button id="oe-x">Cancel</button><span style="flex:1"></span><button id="oe-new">+ New exhibit</button><button id="oe-out">Revoke clearance</button></div>
  <div id="oe-msg" class="oe-msg"></div>`;
}
function readForm(){const v=id=>$('#f-'+id).value;
  return {rem:v('rem').trim().toUpperCase(),name:v('name').trim(),aliases:v('aliases').split(';').map(s=>s.trim()).filter(Boolean),type:v('type'),category:v('category'),
   object_class:v('object_class'),source:v('source'),source_id:v('source_id'),explicit:$('#f-explicit').checked,notes:v('notes'),image:v('image').trim()}}
async function upload(slug){
  const f=$('#f-file').files[0];if(!f)return null;
  const ext=(f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');const rel=`assets/img/${slug}.${ext}`;
  const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(f)});
  const ex=await gh(cpath(rel)+`?ref=${CFG.branch}`);
  await putFile(rel,b64,ex&&ex.sha,`Upload image for ${slug.toUpperCase()}`);return rel;
}
async function openEditor(slug,isNew){
  if(!getTok())return askCode(()=>openEditor(slug,isNew));
  overlay(`<h3>RETRIEVING…</h3><div id="oe-msg" class="oe-msg"></div>`);
  let sha=null,d={rem:'',name:'',aliases:[],type:'Character',category:'',object_class:'',source:'',source_id:'',explicit:false,notes:'',image:''},body='## Catalogue record\n<!-- type: quote -->\n\n';
  if(!isNew){try{const f=await getFile(`content/entries/${slug}.md`);if(!f)throw new Error('File not found in repository: '+slug);sha=f.sha;const p=parseFM(f.text);d={...d,...p.data};body=p.body}
    catch(e){if(/40[13]/.test(e.message)){clearTok();label()}msg(String(e.message||e),'err');return}}
  overlay(form(d,body,isNew));
  $('#oe-x').onclick=close;$('#oe-new').onclick=()=>openEditor('',true);$('#oe-out').onclick=()=>{clearTok();label();close()};
  $('#oe-save').onclick=async()=>{
    const nd=readForm();if(!/^REM-[0-9A-Z█-]+$/.test(nd.rem)){msg('REM number must look like REM-123.','err');return}
    if(!nd.name){msg('Name is required.','err');return}
    const s=slugOf(nd.rem),path=`content/entries/${s}.md`;
    try{$('#oe-save').disabled=true;msg('Committing…');
      if(isNew){const ex=await getFile(path);if(ex){msg(`${nd.rem} already exists. Open it instead.`,'err');$('#oe-save').disabled=false;return}}
      const img=await upload(s);if(img){nd.image=img;$('#f-image').value=img}
      const txt=toFM(nd,$('#f-body').value);
      const r=await putFile(path,b64e(txt),isNew?null:sha,`${isNew?'Create':'Update'} ${nd.rem} via exhibit locker`);
      sha=r&&r.content&&r.content.sha||sha;isNew=false;$('#f-rem').readOnly=true;
      msg(`Saved: ${CFG.dir}/${path}\nCommit ${r&&r.commit?String(r.commit.sha).slice(0,7):''}. The index rebuilds automatically; the live page updates in ~1–2 minutes.`,'ok');
    }catch(e){if(/40[13]/.test(e.message)){clearTok();label()}msg('Save failed: '+(e.message||e),'err')}
    finally{$('#oe-save').disabled=false}};
}
btn.onclick=()=>{const cur=(window.OREM&&window.OREM.current())||'';
  const isEntry=cur&&cur!=='index'&&!cur.startsWith('index');
  if(!getTok())return askCode(()=>openEditor(isEntry?cur:'',!isEntry));
  openEditor(isEntry?cur:'',!isEntry)};
window.OREM_EDITOR={openEditor,askCode,_parseFM:parseFM,_toFM:toFM};
})();
