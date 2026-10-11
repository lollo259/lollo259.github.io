/* laurence who — live motion preview (hero intro + enter→phone→map) */
(function(){
var h=document.getElementById('lw-hero'),ex=document.getElementById('lw-explore');if(!h||!ex||!h.animate)return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var E1='cubic-bezier(.16,1,.3,1)',E2='cubic-bezier(.65,0,.35,1)',E3='cubic-bezier(.7,0,.84,0)';
var bg=h.querySelector('.lw-bg'),fg=h.querySelector('.lw-fg'),tx=h.querySelector('.tx'),act=h.querySelector('.act');
/* 1) intro */
function intro(){if(h.hidden)return;
 if(RM){h.animate([{opacity:0},{opacity:1}],{duration:300});return}
 var o={easing:E1,fill:'backwards'};
 bg.animate([{transform:'scale(1.12)',opacity:0,filter:'blur(6px)'},{transform:'scale(1)',opacity:1,filter:'blur(0)'}],Object.assign({duration:1300},o));
 fg.animate([{transform:'scale(1.2) translateY(3%)',opacity:0},{transform:'scale(1)',opacity:1}],Object.assign({duration:1250,delay:60},o));
 tx.animate([{transform:'translateY(.6em) scale(.96)',opacity:0,clipPath:'inset(0 0 100% 0)'},{transform:'none',opacity:1,clipPath:'inset(0 0 0% 0)'}],Object.assign({duration:900,delay:200},o));
 [].forEach.call(act.children,function(b,i){b.animate([{transform:'translateY(14px)',opacity:0},{transform:'none',opacity:1}],Object.assign({duration:700,delay:650+i*90},o))});
}
intro();
/* 2) enter → phone → map */
var running=false,anims=[],layer,cleanup;
function pr(){return getComputedStyle(document.documentElement).getPropertyValue('--x')}
ex.addEventListener('click',function(){
 if(running||h.classList.contains('gone')&&h.hidden)return;running=true;
 /* original handlers (fade + music) run right after this one, same gesture */
 var night=document.documentElement.classList.contains('night');
 var shell=document.querySelector('.site-shell');
 var W=innerWidth,H=innerHeight,port=H>=W;
 /* phone screen = viewport scaled by s */
 var s=port?Math.min(.62,(H*.7)/H):Math.min(.5,(H*.62)/H*Math.min(1,W/H));
 if(!port)s=Math.min(.52,(H*.62)/H);
 var rad=Math.round(46/s);
 layer=document.createElement('div');layer.className='lwm-layer';
 layer.innerHTML='<div class="lwm-bd"></div><div class="lwm-frame"><i class="lwm-isl"></i></div><div class="lwm-skip">tap to skip</div>';
 document.body.appendChild(layer);var bd=layer.firstChild,fr=layer.children[1],sk=layer.children[2];
 fr.style.setProperty('--b',Math.round(13/s)+'px');fr.style.setProperty('--r',rad+'px');
 if(!port)fr.classList.add('land');
 /* keep hero visible over the original fade during the sequence */
 h.style.setProperty('display','block','important');h.style.setProperty('pointer-events','none','important');h.style.setProperty('transition','none','important');document.body.classList.add('lwm-run');setTimeout(function(){if(!done)h.classList.remove('gone')},0);
 if(shell){shell.style.position='relative';shell.style.zIndex='9995';shell.style.transformOrigin='50% 50%';shell.style.willChange='transform';shell.style.height=H+'px';shell.style.overflow='hidden';shell.style.pointerEvents='none'}
 var done=false;
 cleanup=function(){if(done)return;done=true;anims.forEach(function(a){try{a.cancel()}catch(e){}});anims=[];
  h.classList.add('gone');['display','pointer-events','transition','border-radius'].forEach(function(p){h.style.removeProperty(p)});document.body.classList.remove('lwm-run');
  if(shell){['position','z-index','transform-origin','will-change','height','overflow','pointer-events','border-radius'].forEach(function(p){shell.style.removeProperty(p)})}
  if(layer){var l=layer;layer=null;l.animate([{opacity:1},{opacity:0}],{duration:280,easing:'ease-out'}).onfinish=function(){l.remove()};l.style.pointerEvents='none'}
  running=false;removeEventListener('pointerdown',skip,true);
  requestAnimationFrame(function(){window.__lwHeroFit&&!h.hidden&&window.__lwHeroFit()});
 };
 function skip(e){if(e.target&&e.target.closest&&e.target.closest('#lw-explore'))return;e.preventDefault();e.stopPropagation();var sw=function(ev){ev.stopPropagation();ev.preventDefault();removeEventListener('click',sw,true)};addEventListener('click',sw,true);setTimeout(function(){removeEventListener('click',sw,true)},600);cleanup()}
 setTimeout(function(){addEventListener('pointerdown',skip,true)},50);
 sk.addEventListener('click',cleanup);
 if(RM){h.style.removeProperty('transition');var a=h.animate([{opacity:1},{opacity:0}],{duration:450,fill:'forwards'});anims.push(a);a.onfinish=cleanup;return}
 var T=2700,P='perspective(2200px) ';
 var tilt=port?'rotateX(14deg) rotateY(-18deg) rotateZ(4deg)':'rotateX(16deg) rotateY(-14deg) rotateZ(-3deg)';
 var flat='rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
 /* camera keyframes shared by hero, map and frame */
 var K=[
  {offset:0,transform:P+flat+' scale(1)',easing:E2},
  {offset:.30,transform:P+tilt+' scale('+s+')',easing:'ease-in-out'},
  {offset:.40,transform:P+tilt+' scale('+(s*.985)+')',easing:'ease-in-out'},
  {offset:.58,transform:P+'rotateX(4deg) rotateY(-5deg) rotateZ(1deg) scale('+(s*1.02)+')',easing:E3},
  {offset:1,transform:P+flat+' scale(1)'}];
 var o={duration:T,fill:'forwards'};
 [h,shell].forEach(function(el){if(el)anims.push(el.animate(K,o))});
 anims.push(fr.animate(K,o));
 anims.push(fr.animate([{opacity:0},{opacity:1,offset:.18},{opacity:1,offset:.78},{opacity:0}],o));
 /* rounded screen */
 var R=[{borderRadius:'0px'},{borderRadius:rad+'px',offset:.3},{borderRadius:rad+'px',offset:.82},{borderRadius:'0px'}];
 [h,shell].forEach(function(el){if(el)anims.push(el.animate(R,o))});
 anims.push(bd.animate([{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.9},{opacity:0}],o));
 /* the phone taps its own enter: ripple + press */
 var r=ex.getBoundingClientRect(),hr=h.getBoundingClientRect();
 var rp=document.createElement('i');rp.className='lwm-rip';rp.style.left=(r.left+r.width/2)+'px';rp.style.top=(r.top+r.height/2)+'px';h.appendChild(rp);
 anims.push(rp.animate([{transform:'translate(-50%,-50%) scale(0)',opacity:0},{transform:'translate(-50%,-50%) scale(.2)',opacity:.9,offset:.01},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:700,delay:T*.33,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'}));
 anims.push(ex.animate([{transform:'scale(1)'},{transform:'scale(.9)',offset:.35},{transform:'scale(1)'}],{duration:380,delay:T*.33,easing:'ease-out'}));
 /* screen: hero → map */
 anims.push(h.animate([{opacity:1},{opacity:1,offset:.44},{opacity:0,offset:.6},{opacity:0}],o));
 var fin=anims[0];fin.onfinish=function(){setTimeout(function(){rp.remove()},0);cleanup()};
 var oc=cleanup;cleanup=function(){rp.remove();oc()};
},true);
var st=document.createElement('style');st.textContent=
'.lwm-layer{position:fixed;inset:0;z-index:9990;pointer-events:auto}'+
'.lwm-bd{position:fixed;inset:0;z-index:9990;background:radial-gradient(120% 90% at 50% 40%,#f4f4f2 0%,#d9d9d6 100%)}'+
'html.night .lwm-bd{background:radial-gradient(120% 90% at 50% 40%,#1b1b1b 0%,#000 100%)}'+
'.lwm-frame{position:fixed;inset:0;z-index:10000;pointer-events:none;border-radius:var(--r);box-shadow:0 0 0 var(--b) #0d0d0d,0 0 0 calc(var(--b) + 2px) #3a3a3a,0 calc(var(--b)*4) calc(var(--b)*8) rgba(0,0,0,.35);will-change:transform,opacity}'+
'html.night .lwm-frame{box-shadow:0 0 0 var(--b) #1c1c1c,0 0 0 calc(var(--b) + 2px) #5a5a5a,0 calc(var(--b)*4) calc(var(--b)*8) rgba(0,0,0,.6)}html.night .lwm-isl{background:#000!important}'+
'.lwm-isl{position:absolute;left:50%;top:calc(var(--b)*1.1);width:calc(var(--b)*8);height:calc(var(--b)*2.2);margin-left:calc(var(--b)*-4);border-radius:99px;background:#0d0d0d}'+
'.lwm-frame.land .lwm-isl{top:50%;left:calc(var(--b)*1.1);margin:0;width:calc(var(--b)*2.2);height:calc(var(--b)*8);margin-top:calc(var(--b)*-4)}'+
'.lwm-rip{position:fixed;z-index:6;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(0,0,0,.35) 0%,rgba(0,0,0,.18) 40%,rgba(0,0,0,0) 70%);pointer-events:none}'+
'html.night .lwm-rip{background:radial-gradient(circle,rgba(255,255,255,.45) 0%,rgba(255,255,255,.2) 40%,rgba(255,255,255,0) 70%)}'+
'.lwm-skip{position:fixed;left:0;right:0;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:10001;text-align:center;font:400 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.04em;color:#777;cursor:pointer}'+
'body.lwm-run .lw-search,body.lwm-run .lw-mp,body.lwm-run .night-btn,body.lwm-run #lw-wordmark{opacity:0!important}'+
'#lw-hero,.site-shell{backface-visibility:hidden;-webkit-backface-visibility:hidden}';
document.head.appendChild(st);
})();
