/* --- s16.js --- */
try{
(function(){var K='lw-night',mem=null,D=document.documentElement;
function get(){try{var v=localStorage.getItem(K);if(v!==null)return v}catch(e){}return mem}
function set(v){mem=v;try{localStorage.setItem(K,v)}catch(e){}}
var mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
function want(){var p=get();return p!==null?p==='1':!!(mq&&mq.matches)}
function btn(){return document.querySelector('.night-btn')}
function sync(){var b=btn();if(!b)return setTimeout(sync,150);if(D.classList.contains('night')!==want()){b.__lwAuto=1;b.click();b.__lwAuto=0;}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.night-btn');if(b&&!b.__lwAuto&&e.isTrusted)setTimeout(function(){set(D.classList.contains('night')?'1':'0')},0)},true);
mq&&(mq.addEventListener?mq.addEventListener('change',sync):mq.addListener(sync));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();})();
}catch(e){console.error("[s16]",e)}
/* --- s17.js --- */
try{
(function(){var D=document.documentElement,m=document.querySelector('meta[name="color-scheme"]');if(!m)return;function u(){m.content=D.classList.contains("night")?"only dark":"only light"}u();new MutationObserver(u).observe(D,{attributes:true,attributeFilter:["class"]})})();
}catch(e){console.error("[s17]",e)}
/* perf: remaining UI modules run in separate tasks so they never block input for long */
(function(Q){var i=0;(function n(){if(i<Q.length){Q[i++]();setTimeout(n,0)}})()})([
function(){
/* --- s14.js --- */
try{
(function(){var D=document,it=function(){return D.documentElement.lang==='it'};
function box(){var p=D.getElementById('help-panel');if(!p)return;var b=p.querySelector('.lw-foot');if(!b){b=D.createElement('footer');b.className='lw-foot';}
b.innerHTML='<ul class="lw-soc"><li><a href="https://www.youtube.com/@laurencewho" target="_blank" rel="noopener me">youtube ↗</a></li><li><a href="https://www.instagram.com/laurencewhoooooooooooooooooooo/" target="_blank" rel="noopener me">instagram ↗</a></li></ul>'+
'<p>'+(it()?'privacy: questo sito non usa cookie né sistemi di tracciamento. i video youtube e le anteprime google drive incorporati possono impostare i propri cookie.':'privacy: this site uses no cookies and no tracking. embedded youtube videos and google drive previews may set their own cookies.')+'</p>'+
'<p class="lw-cr">'+(it()?'prodotto da laurence who':'produced by laurence who')+'</p>';
if(b.parentNode!==p||p.lastElementChild!==b)p.appendChild(b);}
box();var o=D.getElementById('help-overlay');o&&new MutationObserver(function(){setTimeout(box,0)}).observe(o,{attributes:true,attributeFilter:['class']});
new MutationObserver(box).observe(D.documentElement,{attributes:true,attributeFilter:['lang']});})();
}catch(e){console.error("[s14]",e)}
},
function(){
/* --- s15.js --- */
try{
(function(){
/* Formspree: replace FORMSPREE_ID with the real form id (e.g. "xyzabcd") to switch from mailto to direct sending */
var ID='meaekrdk',D=document;if(!ID||ID==='FORMSPREE_ID')return;
var f=D.getElementById('contact-form');if(!f)return;
var it=function(){return D.documentElement.lang==='it'},st=D.getElementById('contact-status');
f.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();
 var q=function(s){return f.querySelector(s)},nm=q('[aria-label=name],[name=name]'),sb=q('[aria-label=subject],[name=subject]'),ms=q('textarea');
 if(!ms||!ms.value.trim()){ms&&ms.classList.add('is-invalid');st&&(st.textContent=it()?'scrivi un messaggio.':'please write a message.');return;}
 var btn=f.querySelector('[type=submit],button:not([type=button])');btn&&(btn.disabled=true);st&&(st.textContent=it()?'invio…':'sending…');
 fetch('https://formspree.io/f/'+ID,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({name:nm?nm.value:'',_subject:sb?sb.value:'',subject:sb?sb.value:'',message:ms.value})})
 .then(function(r){if(!r.ok)throw 0;f.reset();st&&(st.textContent=it()?'grazie, messaggio inviato.':'thank you, message sent.');})
 .catch(function(){st&&(st.innerHTML=it()?'invio non riuscito. scrivi a <a href="mailto:laurence@laurencewho.com">laurence@laurencewho.com</a>.':'sending failed. write to <a href="mailto:laurence@laurencewho.com">laurence@laurencewho.com</a>.');})
 .then(function(){btn&&(btn.disabled=false);});},true);})();
}catch(e){console.error("[s15]",e)}
},
function(){
/* --- s18.js --- */
try{
(function(){
var T={en:{title:'Per strada',by:'by laurence who',desc:'A simple, yet emotional song on the foibe massacres. The title describes the music \u201con the street\u201d, the emptiness of those same streets once covered by people, and their echoes. Birds keep singing over the horrific scenery.',ev:'Giornata del Ricordo 2023 (Trieste, IT)',perf:'performers',p:['soprano 1 \u2013 singer one','soprano 2 \u2013 Carmen Vicente','violin \u2013 Sofia De Martis','piano \u2013 Lorenzo Ritacco','recording \u2013 Lorenzo Bosich'],more:'more',gal:'open the gallery \u2192',now:'now playing',play:'Play',pause:'Pause',rs:'Restart from the beginning',info:'About this music'},
it:{title:'Per strada',by:'di laurence who',desc:'Un brano semplice ma intenso sui massacri delle foibe. Il titolo descrive la musica \u201cper strada\u201d, il vuoto di quelle stesse strade un tempo piene di persone, e i loro echi. Gli uccelli continuano a cantare sopra lo scenario orribile.',ev:'Giornata del Ricordo 2023 (Trieste, IT)',perf:'interpreti',p:['soprano 1 \u2013 singer one','soprano 2 \u2013 Carmen Vicente','violino \u2013 Sofia De Martis','pianoforte \u2013 Lorenzo Ritacco','registrazione \u2013 Lorenzo Bosich'],more:'altro',gal:'apri la galleria \u2192',now:'in ascolto',play:'Riproduci',pause:'Pausa',rs:'Ricomincia dall\u2019inizio',info:'Informazioni sulla musica'}};
var L=function(){return T[document.documentElement.lang==='it'?'it':'en']};
var st=document.createElement('style');st.textContent=
'.lw-mp{position:fixed;right:68px;bottom:calc(var(--vis-gap,0px) + 20px);margin-bottom:env(safe-area-inset-bottom,0px);z-index:70;height:44px;display:flex;align-items:center;gap:2px;padding:0 6px;border:1px solid #000;border-radius:22px;background:#fff;color:#000;font-family:Helvetica,Arial,sans-serif;opacity:0;pointer-events:none;transition:opacity .8s ease}'+
'.lw-mp.on{opacity:1;pointer-events:auto}body.lw-hero-on .lw-mp,.lw-mp.off{opacity:0!important;pointer-events:none!important;visibility:hidden}'+
'.lw-mp button{all:unset;cursor:pointer;width:32px;height:32px;display:grid;place-items:center;border-radius:50%;-webkit-tap-highlight-color:transparent}'+
'.lw-mp button:focus-visible{outline:2px solid currentColor}.lw-mp svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}'+
'.lw-mp .ti{width:auto;padding:0 6px 0 8px;height:32px;border-radius:16px;font:400 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.01em;white-space:nowrap}.lw-mp .sk{position:relative;width:104px;height:32px;display:flex;flex-direction:column;justify-content:center;margin:0 2px}.lw-mp .tm{font:300 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.02em;opacity:.6;text-align:center;margin-top:-3px;font-variant-numeric:tabular-nums}.lw-mp input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;margin:0;background:transparent;cursor:pointer;touch-action:none;--p:0%}.lw-mp input[type=range]::-webkit-slider-runnable-track{height:1px;background:linear-gradient(currentColor,currentColor) 0/var(--p) 100% no-repeat,rgba(127,127,127,.4)}.lw-mp input[type=range]::-moz-range-track{height:1px;background:rgba(127,127,127,.4)}.lw-mp input[type=range]::-moz-range-progress{height:1px;background:currentColor}.lw-mp input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:9px;height:9px;border-radius:50%;background:currentColor;margin-top:-4px;border:0}.lw-mp input[type=range]::-moz-range-thumb{width:9px;height:9px;border-radius:50%;background:currentColor;border:0}.lw-mp input[type=range]:focus-visible{outline:1px solid currentColor;outline-offset:2px}'+
'.lw-mpc{position:fixed;right:16px;bottom:84px;margin-bottom:env(safe-area-inset-bottom,0px);z-index:71;width:min(272px,calc(100vw - 32px));box-sizing:border-box;padding:12px 14px;background:#fff;color:#000;border:1px solid #000;border-radius:12px;font:300 12px/1.4 Helvetica,"Helvetica Neue",Arial,sans-serif}'+'.lw-mpc[hidden]{display:none}.lw-mpc .k{font-size:10.5px;opacity:.55}.lw-mpc h2{margin:2px 0 0;font-size:15px;font-weight:500;letter-spacing:-.01em}.lw-mpc .by{opacity:.6;margin-bottom:6px}'+'.lw-mpc .d{margin:0 0 6px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.lw-mpc.x .d{display:block;-webkit-line-clamp:unset}.lw-mpc .mo{all:unset;cursor:pointer;opacity:.6;font-size:11px;text-decoration:underline;text-underline-offset:2px}.lw-mpc.x .mo{display:none}'+'.lw-mpc .pf{margin:6px 0 8px;font-size:11px;opacity:.75}.lw-mpc .g{all:unset;cursor:pointer;font-weight:500;font-size:12px;border-bottom:1px solid currentColor}'+'html.night .lw-mp,html.night .lw-mpc{background:#000;color:#fff;border-color:#fff}';
document.head.appendChild(st);
var a=document.createElement('audio');a.preload='none';a.setAttribute('playsinline','');
a.innerHTML='<source src="music.m4a" type="audio/mp4"><source src="music.mp3" type="audio/mpeg">';document.body.appendChild(a);
var P='<svg viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>',Z='<svg viewBox="0 0 16 16"><path d="M5.5 3.5v9M10.5 3.5v9"/></svg>';
var m=document.createElement('div');m.className='lw-mp';m.setAttribute('role','group');
m.innerHTML='<button type="button" class="pp"></button><div class="sk"><input type="range" min="0" max="1000" value="0" step="1"><div class="tm">0:00 / 0:00</div></div><button type="button" class="rs"><svg viewBox="0 0 16 16"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3"/><path d="M3.5 2.5v2.8h2.8"/></svg></button>';
document.body.appendChild(m);
var c=document.createElement('div');c.className='lw-mpc';c.hidden=true;c.setAttribute('role','dialog');document.body.appendChild(c);
var rg=m.querySelector('input'),tm=m.querySelector('.tm'),drag=false;var pp=m.querySelector('.pp'),wv=document.createElement('button'),rs=m.querySelector('.rs');wv.type='button';wv.className='ti';wv.textContent='per strada';wv.setAttribute('aria-expanded','false');m.insertBefore(wv,pp);
function txt(){var t=L();pp.innerHTML=a.paused?P:Z;pp.setAttribute('aria-label',a.paused?t.play:t.pause);rs.setAttribute('aria-label',t.rs);rg.setAttribute('aria-label',document.documentElement.lang==='it'?'posizione nel brano':'position in song');wv.setAttribute('aria-label',t.info);m.setAttribute('aria-label',t.now+': '+t.title);
c.innerHTML='<div class="k">'+t.now+'</div><h2>'+t.title+'</h2><div class="by">'+t.by+'</div><p class="d">'+t.desc+'</p><button type="button" class="mo">'+t.more+'</button><div class="pf">'+t.ev+'<br>'+t.p.join(' \u00b7 ')+'</div><button type="button" class="g">'+t.gal+'</button>';c.querySelector('.mo').onclick=function(e){e.stopPropagation();c.classList.add('x')};c.querySelector('.g').onclick=function(e){e.stopPropagation();c.hidden=true;wv.setAttribute('aria-expanded','false');openGallery()};}
function openGallery(){var g=[].slice.call(document.querySelectorAll('.poi.main')).find(function(x){return /^galler/i.test(x.getAttribute('aria-label')||'')});if(g)g.dispatchEvent(new MouseEvent('click',{bubbles:true}))}
function place(){var b=document.querySelector('.night-btn');if(!b)return;var r=b.getBoundingClientRect();if(!r.height)return;var h=Math.round(r.height);m.style.height=h+'px';m.style.boxSizing='border-box';m.style.borderRadius=h/2+'px';m.style.bottom='auto';m.style.top=r.top+'px';m.style.right=(innerWidth-r.left+8)+'px';m.style.marginBottom='0';c.style.bottom='auto';c.style.top='auto';c.style.right=(innerWidth-r.right)+'px';c.style.bottom=(innerHeight-r.top+10)+'px';c.style.marginBottom='0'}
addEventListener('resize',place);window.visualViewport&&visualViewport.addEventListener('resize',place);setInterval(place,1000);
function vis(){var o=document.querySelector('[id$="-overlay"].is-open,.overlay-layer.is-open,#cv-overlay.is-open,#timeline-overlay.is-open');m.classList.toggle('off',!!o);if(o&&!c.hidden){c.hidden=true}}
new MutationObserver(vis).observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
function f(x){x=Math.max(0,Math.floor(x||0));return Math.floor(x/60)+':'+('0'+x%60).slice(-2)}
function upd(){var d=a.duration||304.56;if(!drag){rg.value=Math.round(a.currentTime/d*1000)}rg.style.setProperty('--p',(rg.value/10)+'%');tm.textContent=f(drag?rg.value/1000*d:a.currentTime)+' / '+f(d)}
a.addEventListener('timeupdate',upd);a.addEventListener('loadedmetadata',upd);a.addEventListener('seeked',upd);
rg.addEventListener('pointerdown',function(e){e.stopPropagation();drag=true});rg.addEventListener('click',function(e){e.stopPropagation()});
var cmt;rg.addEventListener('input',function(){drag=true;upd();clearTimeout(cmt);cmt=setTimeout(commit,150)});rg.addEventListener('pointerup',function(){clearTimeout(cmt);commit()});
rg.addEventListener('change',function(){clearTimeout(cmt);commit()});function commit(){if(!drag)return;var d=a.duration||304.56;if(!started){started=true;graph();m.classList.add('on')}if(ctx&&ctx.state==='suspended')ctx.resume();try{a.currentTime=rg.value/1000*d}catch(e){}if(a.paused){a.play();fade(1,300)}drag=false;upd()}
var ctx,gain;
function fade(to,ms){if(gain){var n=ctx.currentTime;gain.gain.cancelScheduledValues(n);gain.gain.setValueAtTime(gain.gain.value,n);gain.gain.linearRampToValueAtTime(to,n+ms/1000)}}
function graph(){if(ctx)return;try{var AC=window.AudioContext||window.webkitAudioContext;ctx=new AC();var s=ctx.createMediaElementSource(a);gain=ctx.createGain();gain.gain.value=0;s.connect(gain);gain.connect(ctx.destination)}catch(e){ctx=null;gain=null}}
var started=false;
function start(){if(started)return;started=true;graph();if(ctx&&ctx.state==='suspended')ctx.resume();
var seek=function(){try{a.currentTime=148}catch(e){}};seek();a.addEventListener('loadedmetadata',function f(){a.removeEventListener('loadedmetadata',f);if(a.currentTime<140)seek()});
var pr=a.play();if(pr&&pr.catch)pr.catch(function(){});fade(1,2000);m.classList.add('on');place();txt()}
var ex=document.getElementById('lw-explore');if(ex)ex.addEventListener('click',start);
pp.onclick=function(e){e.stopPropagation();if(!started){start();return}if(ctx&&ctx.state==='suspended')ctx.resume();if(a.paused){a.play();fade(1,400)}else a.pause()};
rs.onclick=function(e){e.stopPropagation();if(!started){started=true;graph();m.classList.add('on')}if(ctx&&ctx.state==='suspended')ctx.resume();a.currentTime=0;if(a.paused)a.play();fade(1,300)};
wv.onclick=function(e){e.stopPropagation();c.classList.remove('x');c.hidden=!c.hidden;place();wv.setAttribute('aria-expanded',String(!c.hidden))};
c.addEventListener('click',function(e){e.stopPropagation()});c.addEventListener('pointerdown',function(e){e.stopPropagation()});m.addEventListener('pointerdown',function(e){e.stopPropagation()});
document.addEventListener('click',function(){if(!c.hidden){c.hidden=true;wv.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!c.hidden){c.hidden=true}});
a.addEventListener('play',txt);a.addEventListener('pause',txt);a.addEventListener('ended',txt);
new MutationObserver(txt).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});txt();

})();

}catch(e){console.error("[s18]",e)}
},
function(){
/* --- s19.js --- */
try{
(function(){var p=document.getElementById('help-panel'),b=document.getElementById('lw-back');if(!p||!b)return;
var st=document.createElement('style');st.textContent='#lw-back{display:none!important}'+
'.lw-ih{all:unset;display:block;box-sizing:border-box;position:relative;width:calc(100% - 32px);margin:14px 16px 10px;aspect-ratio:16/11;border-radius:12px;overflow:hidden;background:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent;border:1px solid rgba(0,0,0,.12)}'+
'.lw-ih:focus-visible{outline:2px solid currentColor;outline-offset:2px}'+
'.lw-ih i{position:absolute;inset:0;background-repeat:no-repeat;background-size:auto 100%;background-position:78% bottom}'+
'.lw-ih .b{background-image:url(hero-bg.webp);z-index:1}.lw-ih .f{background-image:url(hero-person.webp);z-index:3}'+
'.lw-ih span{position:absolute;z-index:2;left:7%;top:9%;right:7%;font:700 clamp(18px,6.4vw,30px)/.98 Helvetica,"Helvetica Neue",Arial,sans-serif;letter-spacing:-.045em;color:#000;text-align:left}'+
'html.night .lw-ih{background:#333;border-color:rgba(255,255,255,.16)}html.night .lw-ih i{filter:brightness(.24) contrast(1.15)}html.night .lw-ih span{color:#fff}';
document.head.appendChild(st);
var e=document.createElement('button');e.type='button';e.className='lw-ih';e.innerHTML='<i class="b"></i><span></span><i class="f"></i>';
var t=e.querySelector('span');function tx(){var it=document.documentElement.lang==='it';t.innerHTML=(it?'produttore creativo multidisciplinare':'multidisciplinary creative producer')+'<br>laurence who';e.setAttribute('aria-label',it?'torna all\u2019inizio':'back to the start')}
tx();new MutationObserver(tx).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
function top(){var h=p.querySelector(':scope>.place-head');if(h){if(h.nextElementSibling!==e)p.insertBefore(e,h.nextSibling)}else if(p.firstElementChild!==e)p.insertBefore(e,p.firstChild)}top();var ov=document.getElementById('help-overlay');ov&&new MutationObserver(top).observe(ov,{attributes:true,attributeFilter:['class']});new MutationObserver(top).observe(p,{childList:true});
e.addEventListener('click',function(ev){ev.stopPropagation();var c=document.getElementById('help-close');c&&c.click();setTimeout(function(){b.click()},120)});
})();

}catch(e){console.error("[s19]",e)}
},
function(){
/* --- s20.js --- */
try{
(function(){var st=document.createElement('style');st.textContent=
'@keyframes lwpIn{from{opacity:0;transform:translate3d(var(--lwdx,0),var(--lwdy,18px),0)}to{opacity:1;transform:none}}@keyframes lwpOut{from{opacity:1;transform:none}to{opacity:0;transform:translate3d(var(--lwdx,0),var(--lwdy,18px),0)}}@keyframes lwvOut{from{opacity:1}to{opacity:0}}'+
'.overlay-layer.is-open .overlay-panel,.timeline-overlay.is-open .timeline-panel{animation:lwpIn 300ms cubic-bezier(.2,.7,.2,1) both}'+
'.overlay-layer.lw-closing,.timeline-overlay.lw-closing{display:flex!important;pointer-events:none;animation:lwvOut 260ms ease both}'+
'.lw-closing .overlay-panel,.lw-closing .timeline-panel{animation:lwpOut 260ms cubic-bezier(.4,0,.6,1) both}'+
'@media (min-width:641px){:root{--lwdx:-18px;--lwdy:0px}}'+
'@media (prefers-reduced-motion:reduce){.overlay-layer.is-open .overlay-panel,.timeline-overlay.is-open .timeline-panel,.lw-closing .overlay-panel,.lw-closing .timeline-panel,.overlay-layer.lw-closing,.timeline-overlay.lw-closing{animation:none!important}.lw-closing{display:none!important}}';
document.head.appendChild(st);
[].forEach.call(document.querySelectorAll('.overlay-layer,.timeline-overlay'),function(o){var was=o.classList.contains('is-open'),t;
new MutationObserver(function(){var now=o.classList.contains('is-open');if(was&&!now&&!o.classList.contains('lw-closing')){o.classList.add('lw-closing');clearTimeout(t);t=setTimeout(function(){o.classList.remove('lw-closing')},270)}if(now&&o.classList.contains('lw-closing')){clearTimeout(t);o.classList.remove('lw-closing')}was=now}).observe(o,{attributes:true,attributeFilter:['class']});});})();

}catch(e){console.error("[s20]",e)}
},
function(){
/* --- s21.js --- */
try{
(function(){
var VB='0 0 559 956',D='M162.0 21.0C163.8 26.1 169.0 42.5 172.6 51.5C176.1 60.5 179.2 67.1 183.4 75.0C187.6 83.0 192.4 91.5 197.8 99.3C203.1 107.1 208.4 114.0 215.5 121.9C222.7 129.8 233.6 140.4 240.9 146.7C248.2 153.1 252.9 156.3 259.4 160.1C265.8 163.8 272.2 166.4 279.6 169.1C287.0 171.9 296.4 174.5 303.6 176.4C310.8 178.3 316.4 179.4 323.0 180.6C329.7 181.8 331.2 182.7 343.5 183.8C355.7 184.8 382.3 186.7 396.5 187.0C410.8 187.3 418.0 186.9 429.0 185.7C440.0 184.5 453.8 181.6 462.6 179.8C471.3 178.0 475.3 176.8 481.6 175.0C487.8 173.1 494.4 170.9 500.0 168.7C505.5 166.4 510.5 163.9 515.0 161.6C519.5 159.2 523.3 157.1 527.0 154.4C530.8 151.7 534.8 148.4 537.7 145.4C540.5 142.4 542.6 139.3 544.2 136.5C545.7 133.8 546.6 131.5 547.0 129.0C547.5 126.5 547.5 123.9 547.0 121.5C546.6 119.1 545.6 116.8 544.2 114.8C542.8 112.8 540.7 110.9 538.4 109.5C536.2 108.0 534.0 107.0 531.0 106.0C527.9 105.1 524.2 104.3 519.9 103.8C515.6 103.3 510.6 103.0 505.2 103.0C499.8 103.0 492.4 103.5 487.6 104.0C482.8 104.5 481.0 104.8 476.5 106.0C472.0 107.2 468.7 107.8 460.6 111.2C452.5 114.6 440.6 119.7 427.9 126.5C415.2 133.3 395.6 145.0 384.5 151.9C373.3 158.8 374.0 158.5 361.0 167.8C348.1 177.0 322.2 196.9 306.8 207.4C291.3 217.9 278.6 225.0 268.4 230.7C258.3 236.5 253.5 238.4 245.8 241.9C238.1 245.4 230.4 248.7 222.0 251.9C213.6 255.1 203.2 258.5 195.6 260.9C188.1 263.2 183.6 264.4 176.7 265.9C169.7 267.4 162.5 268.8 153.9 269.9C145.3 271.1 133.2 272.3 124.9 273.0C116.6 273.6 110.9 273.8 104.1 273.7C97.2 273.5 92.7 273.4 83.8 272.1C74.9 270.7 60.5 268.0 50.6 265.4C40.6 262.9 29.7 259.0 24.1 256.9C18.6 254.8 18.9 254.0 17.2 252.7C15.6 251.4 14.9 250.4 14.2 249.2C13.4 247.9 12.9 246.6 12.6 245.2C12.4 243.8 12.2 242.7 12.9 240.8C13.5 239.0 14.4 236.5 16.4 234.2C18.4 231.9 21.4 229.4 24.9 227.2C28.4 224.9 32.5 222.7 37.2 220.6C41.8 218.5 46.0 216.5 52.7 214.6C59.4 212.7 67.0 210.5 77.4 209.2C87.9 207.9 104.8 207.1 115.5 207.0C126.3 206.9 134.1 207.9 141.8 208.8C149.4 209.8 155.4 211.2 161.4 212.5C167.5 213.8 171.0 214.5 178.1 216.9C185.3 219.3 197.4 223.8 204.3 226.7C211.1 229.6 214.6 231.8 219.1 234.3C223.6 236.8 227.3 239.1 231.3 241.8C235.2 244.4 238.8 247.0 243.0 250.4C247.2 253.8 252.0 258.2 256.3 262.3C260.5 266.4 265.2 271.6 268.4 275.2C271.6 278.9 273.4 281.2 275.5 284.3C277.6 287.4 279.7 291.1 281.2 293.9C282.7 296.8 283.6 299.0 284.5 301.6C285.4 304.2 286.0 306.5 286.5 309.7C287.0 313.0 287.6 316.4 287.5 321.2C287.4 326.0 286.6 334.4 285.9 338.6C285.1 342.8 284.3 344.0 283.1 346.5C281.9 349.0 281.5 350.4 278.8 353.6C276.0 356.8 270.6 362.4 266.7 365.9C262.8 369.5 259.3 372.1 255.4 374.9C251.6 377.7 247.3 380.6 243.7 382.7C240.1 384.9 239.4 385.6 233.7 387.7C228.1 389.8 215.7 393.7 209.9 395.2C204.0 396.8 202.0 396.7 198.7 397.0C195.4 397.2 193.0 397.3 190.3 396.9C187.6 396.6 184.9 395.8 182.5 394.7C180.1 393.6 177.7 392.1 175.7 390.3C173.7 388.5 172.1 386.2 170.7 383.9C169.4 381.5 168.5 380.2 167.4 376.2C166.2 372.1 165.0 366.6 163.9 359.6C162.8 352.5 161.6 344.5 161.0 333.8C160.3 323.0 160.0 305.1 160.0 295.2C160.0 285.3 160.4 281.3 161.0 274.5C161.5 267.6 161.6 263.1 163.1 254.1C164.6 245.1 167.1 231.1 169.9 220.6C172.8 210.2 176.3 200.3 180.2 191.3C184.1 182.3 188.5 174.2 193.2 166.6C197.9 159.1 204.0 151.1 208.1 145.8C212.3 140.6 215.1 138.2 218.3 135.2C221.5 132.2 224.2 130.0 227.2 127.7C230.3 125.4 233.1 123.5 236.7 121.4C240.4 119.3 245.3 116.8 249.1 115.2C253.0 113.6 256.1 112.5 259.7 111.6C263.3 110.7 267.5 110.1 270.7 109.9C274.0 109.7 276.4 109.9 279.1 110.3C281.8 110.8 284.6 111.5 287.1 112.5C289.7 113.5 291.8 114.4 294.6 116.2C297.3 118.0 300.2 119.9 303.6 123.3C307.0 126.6 311.9 132.1 315.0 136.2C318.1 140.4 320.2 144.0 322.3 148.2C324.3 152.4 325.7 155.2 327.3 161.2C328.9 167.2 331.1 177.9 332.1 184.2C333.0 190.4 333.2 193.5 333.2 198.9C333.3 204.2 333.0 209.1 332.3 216.3C331.6 223.4 330.3 233.0 328.9 241.9C327.5 250.8 326.1 259.2 323.8 269.8C321.5 280.3 317.4 296.1 315.0 305.1C312.5 314.1 312.1 315.2 309.0 323.6C305.9 332.0 300.9 345.1 296.4 355.5C291.9 365.9 286.3 377.7 282.1 386.0C278.0 394.4 275.3 399.2 271.4 405.6C267.5 412.0 262.8 419.1 258.8 424.4C254.8 429.7 251.4 433.4 247.2 437.4C243.0 441.4 238.1 445.4 233.8 448.3C229.5 451.3 225.4 453.6 221.6 455.1C217.8 456.6 214.1 457.3 211.1 457.4C208.1 457.5 206.2 457.2 203.5 455.9C200.8 454.7 197.8 453.3 194.8 449.9C191.9 446.6 189.3 443.0 185.8 435.9C182.4 428.9 176.9 414.1 174.1 407.7C171.3 401.3 173.9 404.0 169.0 397.6C164.1 391.1 150.1 375.9 144.9 369.1C139.6 362.4 139.8 361.2 137.5 357.2C135.3 353.1 133.3 348.9 131.4 344.7C129.5 340.5 128.1 337.1 126.4 331.8C124.7 326.5 122.6 318.8 121.2 312.9C119.8 307.0 119.0 302.4 118.1 296.2C117.2 290.1 116.3 285.8 115.8 276.0C115.4 266.2 115.1 247.6 115.4 237.3C115.6 226.9 116.3 222.1 117.3 213.9C118.3 205.7 119.7 196.5 121.3 188.0C122.8 179.6 125.0 169.6 126.5 163.2C128.0 156.8 128.6 155.0 130.3 149.8C132.1 144.5 134.3 137.9 137.1 131.6C139.9 125.2 143.1 119.0 147.1 111.7C151.2 104.4 156.6 95.2 161.5 87.7C166.4 80.2 171.4 73.1 176.5 66.6C181.6 60.1 187.1 54.0 192.3 48.7C197.5 43.4 202.3 39.1 207.6 35.0C212.9 30.9 218.4 27.3 224.1 24.1C229.8 20.9 235.7 18.3 241.8 16.0C247.8 13.7 255.4 11.3 260.3 10.2C265.3 9.0 267.3 8.9 271.4 9.2C275.5 9.4 281.0 10.4 284.9 11.7C288.8 13.0 291.4 14.4 294.8 16.9C298.1 19.3 302.1 22.9 305.2 26.4C308.3 29.9 310.9 34.0 313.2 38.0C315.5 42.0 317.3 46.3 319.1 50.6C320.8 54.9 322.2 59.3 323.6 63.7C324.9 68.2 325.9 71.2 327.2 77.2C328.5 83.2 330.1 91.5 331.2 99.6C332.3 107.6 333.5 117.6 334.1 125.4C334.7 133.1 335.0 139.6 335.0 146.0C335.0 152.4 334.7 158.4 334.1 163.9C333.5 169.3 332.7 173.2 331.4 178.5C330.2 183.8 328.3 190.6 326.7 195.7C325.0 200.9 323.4 205.3 321.7 209.2C320.0 213.1 318.8 215.6 316.6 219.2C314.4 222.8 311.5 227.1 308.5 230.8C305.5 234.6 302.6 237.9 298.8 241.6C295.0 245.3 292.6 248.3 285.6 253.0C278.7 257.7 262.2 266.5 257.1 269.8C252.0 273.2 255.3 272.0 254.8 273.1C254.4 274.3 254.0 275.2 254.4 276.9C254.7 278.5 254.0 279.2 256.8 283.2C259.7 287.2 266.8 294.8 271.3 301.0C275.8 307.2 278.4 310.9 283.7 320.2C289.0 329.5 298.4 346.7 303.1 356.8C307.7 366.8 309.5 373.8 311.5 380.6C313.5 387.3 314.2 391.5 315.0 397.1C315.9 402.7 316.3 406.6 316.7 414.4C317.2 422.2 317.6 432.6 317.7 444.0C317.7 455.3 316.6 465.8 317.0 482.4C317.5 499.1 319.1 529.1 320.5 544.0C321.8 559.0 323.1 563.9 325.1 572.1C327.0 580.3 329.2 586.4 332.1 593.2C335.0 600.0 338.7 607.0 342.5 612.9C346.3 618.8 350.5 623.6 355.1 628.5C359.8 633.4 360.6 634.1 370.3 642.1C379.9 650.1 402.4 667.4 413.0 676.5C423.7 685.7 429.4 692.0 434.1 696.9C438.8 701.8 438.8 702.5 441.2 706.0C443.6 709.5 446.7 714.2 448.6 717.9C450.6 721.6 451.8 724.6 453.1 728.1C454.3 731.6 455.2 734.2 456.1 738.8C457.0 743.4 458.1 749.6 458.4 755.8C458.7 762.0 458.5 769.0 457.8 776.1C457.1 783.3 455.9 789.8 454.2 798.6C452.4 807.4 449.8 819.3 447.4 828.8C445.0 838.3 442.7 846.3 439.7 855.6C436.8 864.9 436.1 869.1 429.8 884.5C423.5 899.9 406.6 937.4 402.0 948.0';
var st=document.createElement('style');st.textContent=
'.lw-fz{position:fixed;inset:0;z-index:40;display:grid;place-items:center;pointer-events:none;opacity:0;color:#000}'+
'html.night .lw-fz{color:#fff}.lw-fz.on{pointer-events:auto;cursor:zoom-in}'+
'.lw-fz svg{height:min(70vh,120vw);width:auto;overflow:visible}'+
'.lw-fz path{fill:none;stroke:currentColor;stroke-width:6.26;stroke-linecap:round;stroke-linejoin:round}'+
'.lw-fz .hint{position:absolute;bottom:calc(28px + env(safe-area-inset-bottom,0px));left:0;right:0;text-align:center;font:300 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.04em;opacity:.55}'+
'html.lw-fzing #town,html.lw-fzing .map-layer,html.lw-fzing .map-raster,html.lw-fzing .map-backdrop,html.lw-fzon #town,html.lw-fzon .map-layer,html.lw-fzon .map-raster,html.lw-fzon .map-backdrop{transition:none!important}'+
'html.lw-fz-anim #town,html.lw-fz-anim .map-layer,html.lw-fz-anim .map-raster,html.lw-fz-anim .map-backdrop{transition:transform 600ms cubic-bezier(.2,.7,.2,1),opacity 600ms ease!important}';
document.head.appendChild(st);
var w=document.createElement('div');w.className='lw-fz';w.setAttribute('aria-hidden','true');
w.innerHTML='<svg viewBox="'+VB+'"><path d="'+D+'"/></svg><div class="hint"></div>';document.body.appendChild(w);
var P=w.querySelector('path'),H=w.querySelector('.hint'),L=P.getTotalLength?P.getTotalLength():20000;P.style.strokeDasharray=L+' '+L;P.style.strokeDashoffset=L;
var z=0,anim=null,els=null;function E(){if(!els||!els.length||!els[0].isConnected)els=[].slice.call(document.querySelectorAll('#town,.map-layer,.map-raster,.map-backdrop,.lw-search,.lw-mp'))}
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
function hint(){H.textContent=document.documentElement.lang==='it'?'tocca per tornare alla mappa':'tap to return to the map'}hint();
function apply(){E();document.documentElement.classList.toggle('lw-fzon',z>0.001);var s=1-0.45*z,o=Math.max(0,1-z*1.6);for(var i=0;i<els.length;i++){var e=els[i];if(e.classList.contains('lw-search')||e.classList.contains('lw-mp')){e.style.setProperty('opacity',String(o<0.05?0:o),'important');e.style.pointerEvents=z>0.2?'none':''}else{e.style.scale=s;e.style.setProperty('opacity',String(o),'important')}}
var d=Math.min(1,Math.max(0,(z-0.22)/0.74));P.style.strokeDashoffset=L*(1-d);w.style.opacity=Math.min(1,z*2.5);H.style.opacity=z>0.95?.55:0;w.classList.toggle('on',z>0.95)}
function to(t,ms){cancelAnimationFrame(anim);els=null;var a=z,T0=performance.now();ms=rm?1:ms;(function f(T){var k=Math.min(1,(T-T0)/ms);k=t===1?0.5-0.5*Math.cos(Math.PI*k):1-Math.pow(1-k,3);z=a+(t-a)*k;apply();if(k<1)anim=requestAnimationFrame(f);else{document.documentElement.classList.remove('lw-fzing');if(t===0){E();els.forEach(function(e){e.style.scale='';e.style.removeProperty('opacity');e.style.pointerEvents=''})}}})(T0)}
function busy(){var h=document.getElementById('lw-hero');return (h&&!h.hidden)||document.querySelector('[id$="-overlay"].is-open,.overlay-layer.is-open')}
function settle(){to(z>0.45?1:0,z>0.45?2200*(1-z)+400:350)}
/* touch pinch */
var d0=0,z0=0;
addEventListener('touchstart',function(e){if(e.touches.length===2&&!busy()){var a=e.touches[0],b=e.touches[1];d0=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);z0=z;window.__lwPinch=1;cancelAnimationFrame(anim);els=null;document.documentElement.classList.add('lw-fzing')}},{passive:true});
addEventListener('touchmove',function(e){if(!d0||e.touches.length<2)return;if(e.cancelable)e.preventDefault();var a=e.touches[0],b=e.touches[1],r=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/d0;z=Math.min(1,Math.max(0,z0+(1-r)*1.6));apply()},{passive:false});
function tend(e){if(d0&&(!e.touches||e.touches.length<2)){d0=0;setTimeout(function(){window.__lwPinch=0},50);settle()}}addEventListener('touchend',tend,{passive:true});addEventListener('touchcancel',tend,{passive:true});
/* iOS Safari: block native page zoom so the pinch drives the flower */
['gesturestart','gesturechange','gestureend'].forEach(function(t){addEventListener(t,function(e){if(!busy()&&e.cancelable)e.preventDefault()},{passive:false})});
/* trackpad pinch / ctrl+wheel, and keyboard */
var wt;addEventListener('wheel',function(e){if(!e.ctrlKey||busy())return;e.preventDefault();e.stopImmediatePropagation();cancelAnimationFrame(anim);document.documentElement.classList.add('lw-fzing');z=Math.min(1,Math.max(0,z+e.deltaY*0.01));apply();clearTimeout(wt);wt=setTimeout(settle,180)},{passive:false,capture:true});
addEventListener('keydown',function(e){if(busy()||/input|textarea/i.test((e.target||{}).tagName||''))return;if(e.key==='-'||e.key==='_')to(1,2600);if((e.key==='+'||e.key==='='||e.key==='Escape')&&z>0)to(0,500)});
w.addEventListener('click',function(e){e.stopPropagation();to(0,600)});
new MutationObserver(hint).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.__lwFlower=to;
})();
}catch(e){console.error("[s21]",e)}
},
function(){
/* --- s22.js --- */
try{
(function(){var st=document.createElement('style');st.textContent='.lw-pl{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:0 24px 14px;padding:12px 2px;border-top:1px solid rgba(127,127,127,.3);border-bottom:1px solid rgba(127,127,127,.3);color:inherit!important;text-decoration:none!important;font:500 15px/1.2 Helvetica,"Helvetica Neue",Arial,sans-serif;letter-spacing:-.01em;-webkit-tap-highlight-color:transparent}.lw-pl small{font-weight:300;font-size:12px;opacity:.55}.lw-pl:focus-visible{outline:2px solid currentColor;outline-offset:2px}';document.head.appendChild(st);
var it=function(){return document.documentElement.lang==='it'};
function mk(panelId,href,en,it_,suben,subit){var p=document.getElementById(panelId);if(!p)return;var a=document.createElement('a');a.className='lw-pl';a.href=href;p.appendChild(a);
function tx(){a.innerHTML=(it()?it_:en)+' <small>'+(it()?subit:suben)+' →</small>'}tx();
function top(){var after=p.querySelector(':scope>.lw-ih')||p.querySelector(':scope>.place-head');var want=after?after.nextElementSibling:p.firstElementChild;if(want!==a)p.insertBefore(a,after?after.nextSibling:p.firstChild)}top();
new MutationObserver(function(){top()}).observe(p,{childList:true});new MutationObserver(tx).observe(document.documentElement,{attributes:true,attributeFilter:['lang']})}
mk('help-panel','/press/','press kit','cartella stampa','cv, bio, photo, logo','cv, bio, foto, logo');})();

}catch(e){console.error("[s22]",e)}
},
function(){
/* --- s23.js --- */
try{
(function(){var p=document.getElementById('youtube-panel');if(!p)return;var st=document.createElement('style');
st.textContent='#youtube-panel .place-what,#youtube-panel .place-cat,#youtube-panel .youtube-body,#youtube-panel .youtube-foot{display:none!important}.lw-sh{display:block;margin:14px 24px 22px;color:inherit!important;text-decoration:none!important;-webkit-tap-highlight-color:transparent}.lw-sh picture,.lw-sh img{display:block;width:100%;height:auto;aspect-ratio:16/9;border-radius:12px;background:#111;object-fit:cover}.lw-sh span{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px;font:500 15px/1.2 Helvetica,"Helvetica Neue",Arial,sans-serif;letter-spacing:-.01em}.lw-sh small{font-weight:300;font-size:12px;opacity:.55}.lw-sh:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:12px}';document.head.appendChild(st);
var a=document.createElement('a');a.className='lw-sh';a.href='/shorts/';
a.innerHTML='<picture><source srcset="assets/shorts-thumb.webp" type="image/webp"><img src="assets/shorts-thumb.jpg" width="960" height="540" alt="" loading="lazy" decoding="async"></picture><span>shorts <small></small></span>';
var sm=a.querySelector('small');function tx(){var it=document.documentElement.lang==='it';sm.textContent=(it?'tutti i video':'all videos')+' →';a.setAttribute('aria-label',it?'shorts — tutti i video':'shorts — all videos')}tx();
new MutationObserver(tx).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
function top(){var h=p.querySelector(':scope>.menu-topline');var want=h?h.nextElementSibling:p.firstElementChild;if(want!==a)p.insertBefore(a,h?h.nextSibling:p.firstChild)}top();new MutationObserver(top).observe(p,{childList:true});
var ex=document.getElementById('youtube-channel-link');if(ex)ex.remove()})();

}catch(e){console.error("[s23]",e)}
},
function(){
/* --- s24.js --- */
try{
(function(){/* "A Life" as a calm scroll story: each year rises in as it scrolls into view (transform/opacity only) */
var P=document.getElementById('timeline-panel'),O=document.getElementById('timeline-overlay');if(!P||!O||!('IntersectionObserver' in window))return;
var items=[].slice.call(P.querySelectorAll('.timeline-item'));if(!items.length)return;
var RM=matchMedia('(prefers-reduced-motion: reduce)');
var st=document.createElement('style');st.textContent=
'#timeline-panel.lw-story .timeline-item{opacity:0;transform:translate3d(0,18px,0);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1);transition-delay:var(--lwd,0ms)}'+
'#timeline-panel.lw-story .timeline-item .timeline-description::after{transform:scaleY(0);transform-origin:top;transition:transform .9s cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--lwd,0ms) + 250ms)}'+
'#timeline-panel.lw-story .timeline-item.lw-in{opacity:1;transform:none}'+
'#timeline-panel.lw-story .timeline-item.lw-in .timeline-description::after{transform:none}'+
'@media (prefers-reduced-motion:reduce){#timeline-panel.lw-story .timeline-item,#timeline-panel.lw-story .timeline-item .timeline-description::after{opacity:1!important;transform:none!important;transition:none!important}}';
document.head.appendChild(st);
var io=null,queue=[],t=null;
function flush(){t=null;queue.sort(function(a,b){return items.indexOf(a)-items.indexOf(b)}).forEach(function(el,i){el.style.setProperty('--lwd',(i*110)+'ms');el.classList.add('lw-in')});queue=[]}
function start(){if(RM.matches){P.classList.remove('lw-story');return}
 P.classList.add('lw-story');items.forEach(function(el){el.classList.remove('lw-in');el.style.removeProperty('--lwd')});
 if(io)io.disconnect();
 io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);queue.push(e.target)}});if(queue.length&&!t)t=requestAnimationFrame(flush)},{root:P,rootMargin:'0px 0px -12% 0px',threshold:0.35});
 items.forEach(function(el){io.observe(el)})}
function isOpen(){return O.classList.contains('is-open')}
var was=false;new MutationObserver(function(){var o=isOpen();if(o&&!was)start();was=o}).observe(O,{attributes:true,attributeFilter:['class']});
if(isOpen()){was=true;start()}
})();

}catch(e){console.error("[s24]",e)}
}
]);
