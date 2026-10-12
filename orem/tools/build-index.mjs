#!/usr/bin/env node
// Regenerates data/index.json from content/entries/*.md. No dependencies.
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'content','entries');
function scalar(v){v=v.trim(); if(v==='')return ''; if(v.startsWith('"'))try{return JSON.parse(v)}catch{return v.slice(1,-1)}
 if(v.startsWith("'"))return v.slice(1,-1).replace(/''/g,"'"); if(v==='true')return true; if(v==='false')return false;
 if(v==='[]')return []; if(v.startsWith('['))return v.slice(1,-1).split(',').map(s=>scalar(s)).filter(s=>s!=='');return v}
export function parseFront(txt){
 const m=txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/); if(!m) return {data:{},body:txt};
 const L=m[1].split(/\r?\n/),data={};let i=0;
 while(i<L.length){const l=L[i];const k=l.match(/^([A-Za-z_0-9]+):\s*(.*)$/);if(!k){i++;continue}
  const key=k[1],v=k[2];
  if(v===''||v==='|'||v==='>'||v==='|-'||v==='>-'){const items=[],block=[];i++;
   while(i<L.length&&(/^\s+/.test(L[i])||L[i]==='')){const s=L[i].trim();if(s.startsWith('- '))items.push(scalar(s.slice(2)));else block.push(s);i++}
   data[key]=items.length?items:(v.startsWith('>')?block.join(' '):block.join('\n')).trim();continue}
  data[key]=scalar(v);i++}
 return {data,body:m[2]}}
function order(rem){if(/^O-REM$/i.test(rem))return [-1,''];if(/XXX/.test(rem))return [1e6,''];const m=rem.match(/REM-(\d+)(?:-(.*))?/);return m?[+m[1],m[2]||'']:[9e5,rem]}
function range(n){if(n<0)return 'O-REM';if(n>=1e6)return 'XXX';if(n<100)return '000–099';if(n<1000)return `${Math.floor(n/100)}00s`;return '1000+'}
const out=[];const redirects={};
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md'))){
 const {data:d,body}=parseFront(fs.readFileSync(path.join(dir,f),'utf8'));
 if(d.removed){redirects[f.replace(/\.md$/,'')]={to:'',removed:true,rem:d.rem,name:d.name};continue}
 if(d.merged_into){redirects[f.replace(/\.md$/,'')]={to:String(d.merged_into).toLowerCase(),rem:d.rem,name:d.name};continue}
 const types=[...body.matchAll(/<!-- type: ([a-z ]+?)\s*(\||-->)/g)].map(x=>x[1]);
 const art=body.split('<!-- type: article -->')[1];const quote=((art!==undefined?art:body.split('<!-- type: quote -->')[1])||'').split('\n## ')[0].trim();
 const [n,sub]=order(String(d.rem||''));
 out.push({slug:f.replace(/\.md$/,''),rem:d.rem,name:d.name,aliases:d.aliases||[],type:d.type||'Other',category:d.category||'',
  object_class:d.object_class||'',source:d.source||'',explicit:!!d.explicit,image:d.image||'',image2:d.image2||'',image_caption:d.image_caption||'',gallery:d.gallery||'',catalogued_by:d.catalogued_by||'',range:range(n),n,sub,
  full:types.some(t=>!['quote','note'].includes(t)),logs:types.includes('log')||/<Begin log>|▶ LOG|Inizio registro/i.test(body),
  interviews:types.includes('interview'),excerpt:quote.replace(/\[([^\]]+)\]\(#\/[^)]+\)/g,'$1').slice(0,260)});}
out.sort((a,b)=>a.n-b.n||String(a.sub).localeCompare(String(b.sub),'en',{numeric:true}));
out.forEach((e,i)=>{e.i=i;delete e.n;delete e.sub});
fs.mkdirSync(path.join(root,'data'),{recursive:true});
fs.writeFileSync(path.join(root,'data','index.json'),JSON.stringify({generated:new Date().toISOString(),count:out.length,redirects,entries:out}));
console.log(`index.json: ${out.length} entries, ${Object.keys(redirects).length} merged redirects`);
