(function(){
// cinema "now showing" listing. Facts only from each video's YouTube title/description and career-cv/bio.txt. Unknown fields omitted.
var F={
'3YE9aU7XUyk':{y:2026,g:['chamber music · piano trio','musica da camera · trio con pianoforte'],c:[['m','Laurence Who'],['p','Trio Ives — Tijana Drinic (violin), Emanuele F. Ruzzier (cello), Lorenzo Ritacco (piano)','Trio Ives — Tijana Drinic (violino), Emanuele F. Ruzzier (violoncello), Lorenzo Ritacco (pianoforte)']]},
'HXEsSv-3IqI':{y:2023,g:['song','canzone'],c:[['p','Carmen Vicente (soprano), Sofia De Martis (violin), Lorenzo Ritacco (piano)','Carmen Vicente (soprano), Sofia De Martis (violino), Lorenzo Ritacco (pianoforte)'],['r','Lorenzo Bosich'],['v','Giornata del Ricordo 2023, Trieste']]},
'ZGuGFpS7wQ0':{y:2024,g:['wrestling entrance · MIDI','entrata di wrestling · MIDI'],c:[['m','Lorenzo Ritacco — The Crow\u2019s Farewell (2024), for strings and bass drum','Lorenzo Ritacco — The Crow\u2019s Farewell (2024), per archi e grancassa'],['k','All Elite Wrestling']]},
'GrEhUBpnNxM':{y:2024,g:['short film','cortometraggio'],c:[['d','Lorenzo Bosich'],['m','Carter Pann — Circumnavigator, mvt. 3'],['p','En Blanc Et Noir piano duo — Matteo Di Bella, Lorenzo Ritacco','duo pianistico En Blanc Et Noir — Matteo Di Bella, Lorenzo Ritacco']]},
'NCwKG-BC6_o':{y:2019,g:['piano solo · improvisation','pianoforte solo · improvvisazione'],c:[['m','Laurence Who']]}
};
var LB={m:['music','musica'],p:['performers','interpreti'],d:['director','regia'],r:['recording','registrazione'],v:['occasion','occasione'],k:['video clips','filmati']};
var css=`
#youtube-panel #video-grid.video-grid{display:block!important;grid-template-columns:none!important;list-style:none!important;margin:0 20px 10px!important;padding:0!important;border-top:1.5px solid #10100f}
#youtube-panel .video-grid li{display:block!important;margin:0!important;padding:0!important;border-bottom:1px solid rgba(16,16,15,.16)}
#youtube-panel .video-grid .video-card{all:unset;box-sizing:border-box;width:100%;display:grid!important;grid-template-columns:96px 1fr;column-gap:16px;align-items:start;padding:16px 0;cursor:pointer;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-variant-numeric:tabular-nums;color:#10100f;transition:padding .25s}
#youtube-panel .video-card:hover,#youtube-panel .video-card:focus-visible{padding-left:6px}
#youtube-panel .video-card img{grid-column:1;grid-row:1/9;width:96px!important;height:auto!important;aspect-ratio:16/9!important;object-fit:cover;border-radius:2px!important;margin:2px 0 0!important;filter:grayscale(1);transition:filter .3s}
#youtube-panel .video-card:hover img,#youtube-panel .video-card.is-playing img{filter:none}
#youtube-panel .video-card>span{grid-column:2}
#youtube-panel .video-card .pg{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#10100f;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#youtube-panel .video-card .pg b{font-weight:500;border:1px solid currentColor;border-radius:99px;padding:1px 7px;letter-spacing:.08em}
#youtube-panel .video-card .pg i{font-style:normal;color:#8a8a8a}
#youtube-panel .video-card .video-title{order:0;font-size:16px!important;font-weight:700!important;line-height:1.2!important;letter-spacing:-.02em;margin:6px 0 6px!important;color:inherit!important;text-transform:none!important}
#youtube-panel .video-card .video-dur{display:none!important}
#youtube-panel .video-card .pc{font-size:11.5px;line-height:1.4;color:#3a3a38;margin-top:1px}
#youtube-panel .video-card .pc em{font-style:normal;font-variant:small-caps;text-transform:lowercase;letter-spacing:.06em;color:#8a8a8a;margin-right:6px;font-size:12px}
#youtube-panel .video-card .pst:empty{display:none}
#youtube-panel .video-card.is-playing .video-title::before{content:"▶ "}
#youtube-panel .lw-prog{margin:4px 20px 8px;display:flex;justify-content:space-between;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#10100f;font-weight:500}
#youtube-panel .lw-prog span{color:#8a8a8a;font-weight:400}
html.night #youtube-panel .video-grid{border-top-color:#f2f2f0}html.night #youtube-panel .video-grid li{border-color:rgba(255,255,255,.16)}
html.night #youtube-panel .video-card,html.night #youtube-panel .video-card .pg,html.night #youtube-panel .lw-prog{color:#f2f2f0!important}html.night #youtube-panel .video-card .pc{color:#cfcfcc}
@media (max-width:640px){#youtube-panel #video-grid.video-grid{margin:0 16px 10px!important}#youtube-panel .video-grid .video-card{grid-template-columns:84px 1fr;column-gap:12px}#youtube-panel .video-card img{width:84px!important}}
`;
var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
function dur(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function run(){var g=document.getElementById('video-grid');if(!g||!g.children.length)return;var it=document.documentElement.lang==='it'?1:0;
 var p=document.getElementById('youtube-panel');if(p&&!p.querySelector('.lw-prog')){var h=document.createElement('div');h.className='lw-prog';g.before(h)}
 var h2=p&&p.querySelector('.lw-prog');if(h2){var t=(it?'in programmazione':'now showing')+'<span>'+g.children.length+(it?' titoli':' titles')+'</span>';if(h2.innerHTML!==t)h2.innerHTML=t}
 [].forEach.call(g.querySelectorAll('.video-card'),function(b){if(b.dataset.pl===String(it))return;var m=((b.querySelector('img')||{}).src||'').match(/thumbs\/([\w-]+)\./),id=m&&m[1],f=F[id];if(!f)return;
  b.querySelectorAll('.pg,.pc,.pst').forEach(function(e){e.remove()});var d=(b.querySelector('.video-dur')||{}).textContent||'';
  var g1=document.createElement('span');g1.className='pg';g1.innerHTML='<b></b><i></i>';g1.querySelector('b').textContent=f.g[it];g1.querySelector('i').textContent=[f.y,d].filter(Boolean).join(' · ');
  var tt=b.querySelector('.video-title');b.insertBefore(g1,tt);var after=tt;
  f.c.forEach(function(c){var s=document.createElement('span');s.className='pc';var e=document.createElement('em');e.textContent=LB[c[0]][it];s.append(e,document.createTextNode(c[it+1]||c[1]));after.after(s);after=s});
  var sh=document.createElement('span');sh.className='pst';sh.setAttribute('data-showtimes','');after.after(sh);b.dataset.pl=it})}
setInterval(run,500);
})();
