/* --- s1.js --- */
try{
["localStorage","sessionStorage"].forEach((function(e){try{var t=window[e];t.setItem("__t","1"),t.removeItem("__t")}catch(t){try{Object.defineProperty(window,e,{value:(n={},{getItem:function(e){return e in n?n[e]:null},setItem:function(e,t){n[e]=String(t)},removeItem:function(e){delete n[e]},clear:function(){n={}},key:function(e){return Object.keys(n)[e]||null},get length(){return Object.keys(n).length}}),configurable:!0})}catch(e){}}var n})),window.addEventListener("error",(function(e){window.console&&console.warn("lw: script error ignored",e.message)}));
}catch(e){console.error("[s1]",e)}
/* --- s0.js --- */
try{
(function(){var els=null,last=[0,0];function q(){els=[].slice.call(document.querySelectorAll('#town,.map-backdrop,.map-layer,.map-raster'))}
window.__lwPan=function(x,y,k){if(!els||!els.length||!els[0].isConnected)q();last=[x,y];var t='translate3d('+x+'px,'+y+'px,0)';for(var i=0;i<els.length;i++)els[i].style.transform=t;
if(!document.documentElement.classList.contains('dragging')){var o=document.documentElement.style;o.setProperty('--px',x+'px');o.setProperty('--py',y+'px');o.setProperty('--mx',(x/k).toFixed(1)+'px');o.setProperty('--my',(y/k).toFixed(1)+'px')}};
new MutationObserver(function(){if(!document.documentElement.classList.contains('dragging')&&els){var o=document.documentElement.style;o.setProperty('--px',last[0]+'px');o.setProperty('--py',last[1]+'px')}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});})();

}catch(e){console.error("[s0]",e)}
/* --- s6.js --- */
try{
!function(){const e=document.getElementById("lw-hero");if(!e)return;/* perf: the photos are already preloaded and referenced inline; only swap to the JPEG if the WebP fails */const i=new Image;i.onerror=()=>e.style.setProperty("--lw-hero-bg",'url("hero-bg.jpg")'),i.src="hero-bg.webp"}();

}catch(e){console.error("[s6]",e)}
/* --- flower.js --- */
try{
/* laurence who — homepage motion (live: LWM=3, LWF=c) + previews (window.LWM = 1 phone, 2 depth, 3 flower, 4 type) */
(function(){
var OPT=window.LWM||1,FLOWER='M162.0 21.0C163.8 26.1 169.0 42.5 172.6 51.5C176.1 60.5 179.2 67.1 183.4 75.0C187.6 83.0 192.4 91.5 197.8 99.3C203.1 107.1 208.4 114.0 215.5 121.9C222.7 129.8 233.6 140.4 240.9 146.7C248.2 153.1 252.9 156.3 259.4 160.1C265.8 163.8 272.2 166.4 279.6 169.1C287.0 171.9 296.4 174.5 303.6 176.4C310.8 178.3 316.4 179.4 323.0 180.6C329.7 181.8 331.2 182.7 343.5 183.8C355.7 184.8 382.3 186.7 396.5 187.0C410.8 187.3 418.0 186.9 429.0 185.7C440.0 184.5 453.8 181.6 462.6 179.8C471.3 178.0 475.3 176.8 481.6 175.0C487.8 173.1 494.4 170.9 500.0 168.7C505.5 166.4 510.5 163.9 515.0 161.6C519.5 159.2 523.3 157.1 527.0 154.4C530.8 151.7 534.8 148.4 537.7 145.4C540.5 142.4 542.6 139.3 544.2 136.5C545.7 133.8 546.6 131.5 547.0 129.0C547.5 126.5 547.5 123.9 547.0 121.5C546.6 119.1 545.6 116.8 544.2 114.8C542.8 112.8 540.7 110.9 538.4 109.5C536.2 108.0 534.0 107.0 531.0 106.0C527.9 105.1 524.2 104.3 519.9 103.8C515.6 103.3 510.6 103.0 505.2 103.0C499.8 103.0 492.4 103.5 487.6 104.0C482.8 104.5 481.0 104.8 476.5 106.0C472.0 107.2 468.7 107.8 460.6 111.2C452.5 114.6 440.6 119.7 427.9 126.5C415.2 133.3 395.6 145.0 384.5 151.9C373.3 158.8 374.0 158.5 361.0 167.8C348.1 177.0 322.2 196.9 306.8 207.4C291.3 217.9 278.6 225.0 268.4 230.7C258.3 236.5 253.5 238.4 245.8 241.9C238.1 245.4 230.4 248.7 222.0 251.9C213.6 255.1 203.2 258.5 195.6 260.9C188.1 263.2 183.6 264.4 176.7 265.9C169.7 267.4 162.5 268.8 153.9 269.9C145.3 271.1 133.2 272.3 124.9 273.0C116.6 273.6 110.9 273.8 104.1 273.7C97.2 273.5 92.7 273.4 83.8 272.1C74.9 270.7 60.5 268.0 50.6 265.4C40.6 262.9 29.7 259.0 24.1 256.9C18.6 254.8 18.9 254.0 17.2 252.7C15.6 251.4 14.9 250.4 14.2 249.2C13.4 247.9 12.9 246.6 12.6 245.2C12.4 243.8 12.2 242.7 12.9 240.8C13.5 239.0 14.4 236.5 16.4 234.2C18.4 231.9 21.4 229.4 24.9 227.2C28.4 224.9 32.5 222.7 37.2 220.6C41.8 218.5 46.0 216.5 52.7 214.6C59.4 212.7 67.0 210.5 77.4 209.2C87.9 207.9 104.8 207.1 115.5 207.0C126.3 206.9 134.1 207.9 141.8 208.8C149.4 209.8 155.4 211.2 161.4 212.5C167.5 213.8 171.0 214.5 178.1 216.9C185.3 219.3 197.4 223.8 204.3 226.7C211.1 229.6 214.6 231.8 219.1 234.3C223.6 236.8 227.3 239.1 231.3 241.8C235.2 244.4 238.8 247.0 243.0 250.4C247.2 253.8 252.0 258.2 256.3 262.3C260.5 266.4 265.2 271.6 268.4 275.2C271.6 278.9 273.4 281.2 275.5 284.3C277.6 287.4 279.7 291.1 281.2 293.9C282.7 296.8 283.6 299.0 284.5 301.6C285.4 304.2 286.0 306.5 286.5 309.7C287.0 313.0 287.6 316.4 287.5 321.2C287.4 326.0 286.6 334.4 285.9 338.6C285.1 342.8 284.3 344.0 283.1 346.5C281.9 349.0 281.5 350.4 278.8 353.6C276.0 356.8 270.6 362.4 266.7 365.9C262.8 369.5 259.3 372.1 255.4 374.9C251.6 377.7 247.3 380.6 243.7 382.7C240.1 384.9 239.4 385.6 233.7 387.7C228.1 389.8 215.7 393.7 209.9 395.2C204.0 396.8 202.0 396.7 198.7 397.0C195.4 397.2 193.0 397.3 190.3 396.9C187.6 396.6 184.9 395.8 182.5 394.7C180.1 393.6 177.7 392.1 175.7 390.3C173.7 388.5 172.1 386.2 170.7 383.9C169.4 381.5 168.5 380.2 167.4 376.2C166.2 372.1 165.0 366.6 163.9 359.6C162.8 352.5 161.6 344.5 161.0 333.8C160.3 323.0 160.0 305.1 160.0 295.2C160.0 285.3 160.4 281.3 161.0 274.5C161.5 267.6 161.6 263.1 163.1 254.1C164.6 245.1 167.1 231.1 169.9 220.6C172.8 210.2 176.3 200.3 180.2 191.3C184.1 182.3 188.5 174.2 193.2 166.6C197.9 159.1 204.0 151.1 208.1 145.8C212.3 140.6 215.1 138.2 218.3 135.2C221.5 132.2 224.2 130.0 227.2 127.7C230.3 125.4 233.1 123.5 236.7 121.4C240.4 119.3 245.3 116.8 249.1 115.2C253.0 113.6 256.1 112.5 259.7 111.6C263.3 110.7 267.5 110.1 270.7 109.9C274.0 109.7 276.4 109.9 279.1 110.3C281.8 110.8 284.6 111.5 287.1 112.5C289.7 113.5 291.8 114.4 294.6 116.2C297.3 118.0 300.2 119.9 303.6 123.3C307.0 126.6 311.9 132.1 315.0 136.2C318.1 140.4 320.2 144.0 322.3 148.2C324.3 152.4 325.7 155.2 327.3 161.2C328.9 167.2 331.1 177.9 332.1 184.2C333.0 190.4 333.2 193.5 333.2 198.9C333.3 204.2 333.0 209.1 332.3 216.3C331.6 223.4 330.3 233.0 328.9 241.9C327.5 250.8 326.1 259.2 323.8 269.8C321.5 280.3 317.4 296.1 315.0 305.1C312.5 314.1 312.1 315.2 309.0 323.6C305.9 332.0 300.9 345.1 296.4 355.5C291.9 365.9 286.3 377.7 282.1 386.0C278.0 394.4 275.3 399.2 271.4 405.6C267.5 412.0 262.8 419.1 258.8 424.4C254.8 429.7 251.4 433.4 247.2 437.4C243.0 441.4 238.1 445.4 233.8 448.3C229.5 451.3 225.4 453.6 221.6 455.1C217.8 456.6 214.1 457.3 211.1 457.4C208.1 457.5 206.2 457.2 203.5 455.9C200.8 454.7 197.8 453.3 194.8 449.9C191.9 446.6 189.3 443.0 185.8 435.9C182.4 428.9 176.9 414.1 174.1 407.7C171.3 401.3 173.9 404.0 169.0 397.6C164.1 391.1 150.1 375.9 144.9 369.1C139.6 362.4 139.8 361.2 137.5 357.2C135.3 353.1 133.3 348.9 131.4 344.7C129.5 340.5 128.1 337.1 126.4 331.8C124.7 326.5 122.6 318.8 121.2 312.9C119.8 307.0 119.0 302.4 118.1 296.2C117.2 290.1 116.3 285.8 115.8 276.0C115.4 266.2 115.1 247.6 115.4 237.3C115.6 226.9 116.3 222.1 117.3 213.9C118.3 205.7 119.7 196.5 121.3 188.0C122.8 179.6 125.0 169.6 126.5 163.2C128.0 156.8 128.6 155.0 130.3 149.8C132.1 144.5 134.3 137.9 137.1 131.6C139.9 125.2 143.1 119.0 147.1 111.7C151.2 104.4 156.6 95.2 161.5 87.7C166.4 80.2 171.4 73.1 176.5 66.6C181.6 60.1 187.1 54.0 192.3 48.7C197.5 43.4 202.3 39.1 207.6 35.0C212.9 30.9 218.4 27.3 224.1 24.1C229.8 20.9 235.7 18.3 241.8 16.0C247.8 13.7 255.4 11.3 260.3 10.2C265.3 9.0 267.3 8.9 271.4 9.2C275.5 9.4 281.0 10.4 284.9 11.7C288.8 13.0 291.4 14.4 294.8 16.9C298.1 19.3 302.1 22.9 305.2 26.4C308.3 29.9 310.9 34.0 313.2 38.0C315.5 42.0 317.3 46.3 319.1 50.6C320.8 54.9 322.2 59.3 323.6 63.7C324.9 68.2 325.9 71.2 327.2 77.2C328.5 83.2 330.1 91.5 331.2 99.6C332.3 107.6 333.5 117.6 334.1 125.4C334.7 133.1 335.0 139.6 335.0 146.0C335.0 152.4 334.7 158.4 334.1 163.9C333.5 169.3 332.7 173.2 331.4 178.5C330.2 183.8 328.3 190.6 326.7 195.7C325.0 200.9 323.4 205.3 321.7 209.2C320.0 213.1 318.8 215.6 316.6 219.2C314.4 222.8 311.5 227.1 308.5 230.8C305.5 234.6 302.6 237.9 298.8 241.6C295.0 245.3 292.6 248.3 285.6 253.0C278.7 257.7 262.2 266.5 257.1 269.8C252.0 273.2 255.3 272.0 254.8 273.1C254.4 274.3 254.0 275.2 254.4 276.9C254.7 278.5 254.0 279.2 256.8 283.2C259.7 287.2 266.8 294.8 271.3 301.0C275.8 307.2 278.4 310.9 283.7 320.2C289.0 329.5 298.4 346.7 303.1 356.8C307.7 366.8 309.5 373.8 311.5 380.6C313.5 387.3 314.2 391.5 315.0 397.1C315.9 402.7 316.3 406.6 316.7 414.4C317.2 422.2 317.6 432.6 317.7 444.0C317.7 455.3 316.6 465.8 317.0 482.4C317.5 499.1 319.1 529.1 320.5 544.0C321.8 559.0 323.1 563.9 325.1 572.1C327.0 580.3 329.2 586.4 332.1 593.2C335.0 600.0 338.7 607.0 342.5 612.9C346.3 618.8 350.5 623.6 355.1 628.5C359.8 633.4 360.6 634.1 370.3 642.1C379.9 650.1 402.4 667.4 413.0 676.5C423.7 685.7 429.4 692.0 434.1 696.9C438.8 701.8 438.8 702.5 441.2 706.0C443.6 709.5 446.7 714.2 448.6 717.9C450.6 721.6 451.8 724.6 453.1 728.1C454.3 731.6 455.2 734.2 456.1 738.8C457.0 743.4 458.1 749.6 458.4 755.8C458.7 762.0 458.5 769.0 457.8 776.1C457.1 783.3 455.9 789.8 454.2 798.6C452.4 807.4 449.8 819.3 447.4 828.8C445.0 838.3 442.7 846.3 439.7 855.6C436.8 864.9 436.1 869.1 429.8 884.5C423.5 899.9 406.6 937.4 402.0 948.0';
var h=document.getElementById('lw-hero'),ex=document.getElementById('lw-explore');if(!h||!ex||!h.animate)return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var EO='cubic-bezier(.22,1,.36,1)',EIO='cubic-bezier(.65,0,.35,1)',ES='cubic-bezier(.76,0,.24,1)',EI='cubic-bezier(.55,0,.75,.2)';
var bg=h.querySelector('.lw-bg'),fg=h.querySelector('.lw-fg'),tx=h.querySelector('.tx'),act=h.querySelector('.act');
function A(el,k,o){return el.animate(k,o)}
/* intro ~2.3s: slow push-in, figure settles, name rises behind it */
(function(){var D=document.documentElement;function rel(){D.classList.add('lw-hero-in')}
 var introDone;window.__lwIntro=new Promise(function(r){introDone=function(p){Promise.resolve(p).then(r)}});setTimeout(function(){introDone()},6000);
 if(h.hidden){rel();introDone();return}
 function run(){if(RM){A(h,[{opacity:0},{opacity:1}],{duration:400});rel();introDone();return}
 var o={easing:EO,fill:'backwards'};
 /* perf: opacity/transform only (compositor), started after the photos are decoded */
 var ab=A(bg,[{transform:'scale(1.14)',opacity:0},{transform:'scale(1)',opacity:1}],Object.assign({duration:2200},o));introDone(ab.finished.catch(function(){}));
 A(fg,[{transform:'scale(1.1) translateY(2%)',opacity:0},{transform:'none',opacity:1}],Object.assign({duration:2000,delay:150},o));
 A(tx,[{transform:'translateY(.5em)',opacity:0},{transform:'none',opacity:1}],Object.assign({duration:1500,delay:450},o));
 [].forEach.call(act.children,function(b,i){A(b,[{transform:'translateY(12px)',opacity:0},{transform:'none',opacity:1}],Object.assign({duration:1000,delay:1250+i*140},o))});
 rel()}
 function dec(u){var i=new Image();i.src=u;return i.decode?i.decode().catch(function(){}):Promise.resolve()}
 var started=false;function go1(){if(started)return;started=true;requestAnimationFrame(function(){requestAnimationFrame(run)})}
 Promise.all([dec('hero-bg.webp'),dec('hero-person.webp')]).then(go1,go1);setTimeout(go1,2500);
})();
var running=false;
ex.addEventListener('click',function(){
 if(running)return;running=true;window.__ensureCitymap&&window.__ensureCitymap();
 var shell=document.querySelector('.site-shell'),W=innerWidth,H=innerHeight,port=H>=W,anims=[],extra=[],done=false;
 var layer=document.createElement('div');layer.className='lwm-layer';layer.innerHTML='<div class="lwm-bd"></div><div class="lwm-skip">tap to skip</div>';document.body.appendChild(layer);
 var bd=layer.firstChild;
 h.style.setProperty('display','block','important');h.style.setProperty('pointer-events','none','important');h.style.setProperty('transition','none','important');document.body.classList.add('lwm-run');
 setTimeout(function(){if(!done)h.classList.remove('gone')},0);
 if(shell){shell.style.position='relative';shell.style.zIndex=(OPT>=3?'10002':'9995');shell.style.transformOrigin='50% 50%';shell.style.willChange='transform';shell.style.height=H+'px';shell.style.overflow='hidden';shell.style.pointerEvents='none'}
 function cleanup(){if(done)return;done=true;anims.forEach(function(a){try{a.cancel()}catch(e){}});extra.forEach(function(e){e.remove()});
  h.classList.add('gone');['display','pointer-events','transition'].forEach(function(p){h.style.removeProperty(p)});document.body.classList.remove('lwm-run');
  if(shell)['position','z-index','transform-origin','will-change','height','overflow','pointer-events','clip-path'].forEach(function(p){shell.style.removeProperty(p)});
  var l=layer;l.style.pointerEvents='none';bd.style.display='none';A(l,[{opacity:1},{opacity:0}],{duration:300,easing:'ease-out'}).onfinish=function(){l.remove()};
  running=false;removeEventListener('pointerdown',skip,true);requestAnimationFrame(function(){window.__lwHeroFit&&!h.hidden&&window.__lwHeroFit()})}
 function skip(e){if(e.target&&e.target.closest&&e.target.closest('#lw-explore'))return;e.preventDefault();e.stopPropagation();var sw=function(ev){ev.stopPropagation();ev.preventDefault();removeEventListener('click',sw,true)};addEventListener('click',sw,true);setTimeout(function(){removeEventListener('click',sw,true)},600);cleanup()}
 setTimeout(function(){addEventListener('pointerdown',skip,true)},50);
 if(RM){var a=A(h,[{opacity:1},{opacity:0}],{duration:500,fill:'forwards'});anims.push(a);a.onfinish=cleanup;return}
 function go(el,k,o){if(el===h||el===bg||el===fg||(el&&el.classList&&el.classList.contains('site-shell')))k=k.map(function(f){if(!('filter' in f))return f;var c=Object.assign({},f);delete c.filter;return c});var a=el.animate(k,Object.assign({fill:'both'},o));anims.push(a);return a}
 var T,fin;
 /* buttons always bow out first */
 go(act,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(8px)'}],{duration:500,delay:OPT==1?1500:0,easing:EO});
 if(OPT==1){ /* refined phone: shrink into a real minimal phone, slow orbit, screen wakes to the map, glide inside */
  T=4600;var s=port?.6:.5,rad=Math.round(44/s),b=Math.round(11/s);
  var fr=document.createElement('div');fr.className='lwm-frame'+(port?'':' land');fr.innerHTML='<i class="lwm-isl"></i><i class="lwm-btn"></i>';fr.style.setProperty('--b',b+'px');fr.style.setProperty('--r',rad+'px');layer.appendChild(fr);
  var sh=document.createElement('div');sh.className='lwm-sh';layer.insertBefore(sh,fr);
  var P='perspective(2600px) ',f='rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
  var t1=port?'rotateX(10deg) rotateY(-16deg) rotateZ(2deg)':'rotateX(12deg) rotateY(-12deg) rotateZ(-2deg)',t2=port?'rotateX(6deg) rotateY(14deg) rotateZ(-1.5deg)':'rotateX(8deg) rotateY(12deg) rotateZ(1.5deg)';
  var K=[{offset:0,transform:P+f+' scale(1)',easing:EIO},{offset:.3,transform:P+t1+' scale('+s+')',easing:'cubic-bezier(.45,0,.55,1)'},{offset:.62,transform:P+t2+' scale('+(s*1.01)+')',easing:ES},{offset:1,transform:P+f+' scale(1)'}],o={duration:T};
  [h,shell,fr].forEach(function(el){el&&go(el,K,o)});
  var R=[{borderRadius:'0px'},{borderRadius:rad+'px',offset:.28},{borderRadius:rad+'px',offset:.85},{borderRadius:'0px'}];[h,shell].forEach(function(el){el&&go(el,R,o)});
  go(fr,[{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.8},{opacity:0}],o);
  go(sh,[{opacity:0,transform:'translateY(0) scale(.9)'},{opacity:1,transform:'translateY(4%) scale('+s+')',offset:.3},{opacity:1,transform:'translateY(4%) scale('+s+')',offset:.62},{opacity:0,transform:'translateY(0) scale(1)'}],Object.assign({easing:EIO},o));
  go(bd,[{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.88},{opacity:0}],o);
  /* the phone presses its own enter: a clean press, no ripple */
  go(act,[{opacity:0},{opacity:1}],{duration:500,delay:900,easing:EO});go(act,[{opacity:1},{opacity:0}],{duration:400,delay:2300,easing:EO});
  go(ex,[{transform:'scale(1)'},{transform:'scale(.92)',offset:.4},{transform:'scale(1)'}],{duration:420,delay:1700,easing:'ease-in-out',fill:'none'});
  go(h,[{opacity:1},{opacity:1,offset:.42},{opacity:0,offset:.56},{opacity:0}],o);
  if(shell)go(shell,[{filter:'brightness(1.08) blur(4px)'},{filter:'brightness(1.08) blur(4px)',offset:.42},{filter:'brightness(1) blur(0px)',offset:.58},{filter:'none'}],o);
  fin=anims[anims.length-1];
 } else if(OPT==2){ /* depth: the photo splits into planes, camera flies past the figure into the map */
  T=4400;var o={duration:T};
  go(bg,[{transform:'scale(1)',filter:'blur(0px)',offset:0,easing:EIO},{transform:'scale(1.06) translateX(-1.5%)',filter:'blur(1px)',offset:.32,easing:EI},{transform:'scale(1.9) translateX(-6%)',filter:'blur(14px)',opacity:.0,offset:.82},{transform:'scale(1.9) translateX(-6%)',opacity:0}],o);
  go(tx,[{transform:'none',opacity:1,offset:0,easing:EIO},{transform:'scale(.94) translateX(2%)',opacity:1,filter:'blur(0px)',offset:.32,easing:EI},{transform:'scale(1.5) translateX(-4%)',opacity:0,filter:'blur(10px)',offset:.78},{opacity:0}],o);
  fg.style.transformOrigin='72% 70%';
  go(fg,[{transform:'scale(1)',offset:0,easing:EIO},{transform:'scale(1.14) translateX(-2%)',offset:.32,easing:EI},{transform:'scale(4.2) translateX(-14%)',opacity:1,filter:'blur(0px)',offset:.7},{transform:'scale(5.5) translateX(-18%)',opacity:0,filter:'blur(18px)',offset:.84},{opacity:0}],o);
  go(h,[{opacity:1},{opacity:1,offset:.5},{opacity:0,offset:.86},{opacity:0}],o);
  if(shell)go(shell,[{transform:'scale(1.45)',filter:'blur(12px)',offset:0},{transform:'scale(1.45)',filter:'blur(12px)',offset:.45,easing:EO},{transform:'scale(1)',filter:'blur(0px)',offset:1}],o);
  fin=anims[anims.length-1];
 } else if(OPT==3){ /* the flower draws itself (identical to option 3), then one of three new passages into the map */
  var D0=2576,TR=2000,VF=window.LWF||'a';T=D0+TR+250;var o={duration:4600};
  var fw=document.createElement('div');fw.className='lwm-fl';var sz=Math.min(W*.5,H*.42),sw=sz*559/956;
  fw.innerHTML='<svg viewBox="0 0 559 956" style="height:'+sz+'px;width:'+sw+'px"><path d="'+FLOWER+'" fill="none" stroke="currentColor" stroke-width="'+(3.2*956/sz)+'" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg>';
  fw.style.zIndex='10003';document.body.appendChild(fw);extra.push(fw);var pa=fw.querySelector('path');
  go(bd,[{opacity:0},{opacity:0,offset:.06},{opacity:1,offset:.22},{opacity:1}],o);
  go(h,[{transform:'scale(1)',filter:'blur(0px)',opacity:1,easing:EIO},{transform:'scale(.96)',filter:'blur(8px)',opacity:0,offset:.24},{opacity:0}],o);
  go(pa,[{strokeDashoffset:1},{strokeDashoffset:1,offset:.12,easing:'cubic-bezier(.45,0,.25,1)'},{strokeDashoffset:0,offset:.56},{strokeDashoffset:0}],o);
  /* map pieces */
  var cm=document.getElementById('citymap'),town=document.getElementById('town'),mp=cm?[].slice.call(cm.querySelectorAll('path')):[],fills=cm?[].slice.call(cm.querySelectorAll('rect,polygon')):[];
  mp=mp.filter(function(p){return (p.getAttribute('d')||'').length>0});
  var ink=null;if(cm){ink=document.createElementNS('http://www.w3.org/2000/svg','g');ink.setAttribute('class','lwm-ink');var sd={};
   mp.forEach(function(p){var d=p.getAttribute('d');if(sd[d])return;sd[d]=1;var q=document.createElementNS('http://www.w3.org/2000/svg','path');q.setAttribute('d',d);q.setAttribute('fill','none');q.setAttribute('stroke','currentColor');q.setAttribute('stroke-width',(parseFloat(p.getAttribute('stroke-width'))<2?'.7':'1.3'));q.setAttribute('vector-effect','non-scaling-stroke');q.setAttribute('stroke-linecap','round');ink.appendChild(q)});
   var rs0=shell?shell.querySelector('.map-raster:not(.night-raster)')||shell.querySelector('.map-raster'):null;if(rs0){var ov=document.createElementNS('http://www.w3.org/2000/svg','svg');ov.setAttribute('class','lwm-inkr');ov.setAttribute('viewBox','0 0 2400 1600');ov.setAttribute('preserveAspectRatio','none');ov.setAttribute('aria-hidden','true');var mm=document.getElementById('mapmove'),tf=mm&&mm.getAttribute('transform');if(tf)ink.setAttribute('transform',tf);ov.appendChild(ink);var lastR=document.querySelectorAll('.map-raster');lastR[lastR.length-1].after(ov);extra.push(ov)}else{cm.parentNode.appendChild(ink);extra.push(ink)}mp=[].slice.call(ink.childNodes)}
  mp.forEach(function(p){p.setAttribute('pathLength','1');p.style.strokeDasharray='1 1'});
  extra.push({remove:function(){mp.forEach(function(p){p.removeAttribute('pathLength');p.style.removeProperty('stroke-dasharray');p.style.removeProperty('stroke-dashoffset')})}});
  var DS='cubic-bezier(.5,0,.2,1)';var cmap=cm;
  function drawMap(d0,dur,stag){var seen={},i=0;mp.forEach(function(p){var k=p.getAttribute('d').length,j=(k in seen)?seen[k]:(seen[k]=i++);go(p,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:dur,delay:d0+j*stag,easing:DS})})}
  function fadeFills(d0,dur){fills.forEach(function(f){go(f,[{opacity:0},{opacity:1}],{duration:dur,delay:d0,easing:'ease-in-out'})})}
  var rs=shell?shell.querySelector('.map-raster'):null;function raster(d0,dur){rs&&go(rs,[{opacity:0},{opacity:1}],{duration:dur,delay:d0,easing:'ease-in-out'})}
  function pins(d0){if(ink){ink.style.transition='opacity .7s ease-in-out';ink.style.opacity='.55';var tid=setTimeout(function(){ink.style.opacity='0'},d0-300);extra.push({remove:function(){clearTimeout(tid)}})}town&&go(town,[{opacity:0},{opacity:0}],{duration:1,delay:0})}
  var ox=W/2-sw/2,oy=H/2-sz/2,k=sz/956,sx=ox+402*k,sy=oy+948*k;
  if(VF=='a'){ /* the stem keeps drawing and becomes a street; the camera follows it while the map draws in around the line */
   var ln=document.createElementNS('http://www.w3.org/2000/svg','svg');ln.setAttribute('class','lwm-ln');ln.setAttribute('width',W);ln.setAttribute('height',H*2.2);
   var ex2=sx+W*.08,ey=H*2.1;ln.innerHTML='<path d="M'+sx+' '+sy+'C'+(sx-W*.04)+' '+(sy+H*.35)+' '+(sx+W*.18)+' '+(sy+H*.7)+' '+ex2+' '+ey+'" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>';
   document.body.appendChild(ln);extra.push(ln);var lp=ln.querySelector('path');
   go(lp,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:TR*.9,delay:D0-120,easing:'cubic-bezier(.4,0,.3,1)'});
   var cam=[{transform:'translateY(0)'},{transform:'translateY('+(-H*.95)+'px)'}],co={duration:TR,delay:D0+80,easing:'cubic-bezier(.55,0,.25,1)'};
   go(fw,[{transform:'translate(-50%,-50%)'},{transform:'translate(-50%,calc(-50% - '+(H*.95)+'px))'}],co);go(ln,cam,co);
   go(ln,[{opacity:1},{opacity:1,offset:.6},{opacity:0}],{duration:TR,delay:D0+250,easing:'ease-in-out'});
   go(fw,[{opacity:1},{opacity:0}],{duration:900,delay:D0+700,easing:'ease-in-out'});
   if(shell){go(shell,[{transform:'translateY('+(H*.55)+'px) scale(1.12)',opacity:0},{transform:'translateY('+(H*.3)+'px) scale(1.08)',opacity:1,offset:.25},{transform:'none',opacity:1}],{duration:TR+150,delay:D0+80,easing:'cubic-bezier(.45,0,.2,1)'})}
   drawMap(D0+250,1300,70);fadeFills(D0+900,1100);raster(D0+1450,650);pins(D0+1600);
  } else if(VF=='b'){ /* the flower shrinks and settles onto the map as a place; the camera pulls back to reveal the map */
   var tg=null,bdst=1e9;[].forEach.call(document.querySelectorAll('#town g[aria-label]'),function(g){var q=g.getBoundingClientRect();if(!q.width||q.left<12||q.right>W-12)return;var dd=Math.hypot(q.left+q.width/2-W/2,q.top+q.height/2-H/2);if(dd<bdst){bdst=dd;tg=g}});var r=tg?tg.getBoundingClientRect():null,px=r&&r.width?r.left+Math.min(18,r.width/2):W*.4,py=r&&r.height?r.top+r.height/2:H*.45;
   var fs=Math.max(22/sz,.04),dx=px-W/2,dy=py-H/2;
   go(fw,[{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(-50%,-50%) translate('+dx+'px,'+dy+'px) scale('+fs+')',opacity:1,offset:.82},{transform:'translate(-50%,-50%) translate('+dx+'px,'+dy+'px) scale('+fs+')',opacity:0}],{duration:TR,delay:D0+60,easing:'cubic-bezier(.6,0,.15,1)'});
   if(shell){shell.style.transformOrigin=px+'px '+py+'px';go(shell,[{transform:'scale(5)',opacity:0,filter:'blur(8px)'},{transform:'scale(4)',opacity:1,filter:'blur(3px)',offset:.25},{transform:'scale(1)',opacity:1,filter:'blur(0px)'}],{duration:TR,delay:D0+60,easing:'cubic-bezier(.6,0,.15,1)'})}
   ink&&(ink.style.display='none');town&&go(town,[{opacity:0},{opacity:0}],{duration:1});
  } else { /* the petals unfold and dissolve into the streets: the stroke opens, thins and breaks into the map's lines */
   go(fw,[{transform:'translate(-50%,-50%) scale(1) rotate(0deg)',opacity:1,filter:'blur(0px)'},{transform:'translate(-50%,-50%) scale(2.2) rotate(-6deg)',opacity:.85,filter:'blur(0px)',offset:.45},{transform:'translate(-50%,-50%) scale(4.5) rotate(-10deg)',opacity:0,filter:'blur(3px)'}],{duration:TR,delay:D0+40,easing:'cubic-bezier(.45,0,.3,1)'});
   var sw0=3.2*956/sz,dead=false;extra.push({remove:function(){dead=true}});var t0=performance.now()+D0+40-(performance.now()-performance.now());var st0=performance.now();
   (function fr(){if(dead)return;var t=(performance.now()-st0-(D0+40))/TR;if(t>0){t=Math.min(1,t);var e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;var gap=.03*e,dash=1-(1-.006)*Math.min(1,e*1.6);pa.style.strokeDasharray=e<.02?'1 1':(dash+' '+(gap+.001));pa.style.strokeWidth=(sw0*(1-.7*e))+'px';}if(t<1)requestAnimationFrame(fr)})();
   if(shell){go(shell,[{transform:'scale(1.35) rotate(4deg)',opacity:0},{transform:'scale(1.18) rotate(2deg)',opacity:1,offset:.3},{transform:'none',opacity:1}],{duration:TR+100,delay:D0+60,easing:'cubic-bezier(.45,0,.2,1)'})}
   drawMap(D0+150,1400,40);fadeFills(D0+800,1200);raster(D0+1450,650);pins(D0+1600);
  }
  bd&&0;fin=go(layer,[{opacity:1},{opacity:1}],{duration:T});
 } else { /* type: the name grows until the counter of the last o becomes a window into the map */
  T=4400;var o={duration:T};var p=tx.querySelector('.lw-h1'),tn=p.lastChild,txt=tn.nodeValue,k=txt.lastIndexOf('o');
  var sp=document.createElement('span');sp.textContent='o';var bl=document.createElement('i');bl.style.cssText='display:inline-block;width:0;height:0';
  var rest=tn.splitText(k);rest.nodeValue=rest.nodeValue.slice(1);p.insertBefore(sp,rest);p.insertBefore(bl,rest);
  var r=sp.getBoundingClientRect(),fs=parseFloat(getComputedStyle(p).fontSize),base=bl.getBoundingClientRect().top;
  var cx=r.left+r.width/2,cy=base-fs*.265,r0=fs*.1,tr=tx.getBoundingClientRect();
  extra.push({remove:function(){sp.remove();bl.remove();tn.nodeValue=txt;rest.remove()}});
  var S=Math.hypot(Math.max(cx,W-cx),Math.max(cy,H-cy))/r0*1.08;
  tx.style.transformOrigin=(cx-tr.left)+'px '+(cy-tr.top)+'px';
  go(fg,[{opacity:1,transform:'none',filter:'blur(0px)'},{opacity:0,transform:'scale(1.04)',filter:'blur(6px)',offset:.3},{opacity:0}],Object.assign({easing:EIO},o));
  go(bg,[{opacity:1,filter:'blur(0px)'},{opacity:0,filter:'blur(8px)',offset:.32},{opacity:0}],Object.assign({easing:EIO},o));
  var ZK=function(a,b){return[{offset:0,v:a},{offset:.28,v:a},{offset:.4,v:a*1.6},{offset:1,v:b}]};
  go(tx,[{transform:'scale(1)',offset:0},{transform:'scale(1)',offset:.3,easing:'cubic-bezier(.6,0,.2,1)'},{transform:'scale('+S+')',offset:1}],o);
  if(shell){go(shell,[{clipPath:'circle('+r0+'px at '+cx+'px '+cy+'px)',opacity:0},{clipPath:'circle('+r0+'px at '+cx+'px '+cy+'px)',opacity:1,offset:.3,easing:'cubic-bezier(.6,0,.2,1)'},{clipPath:'circle('+(r0*S)+'px at '+cx+'px '+cy+'px)',opacity:1}],o)}
  fin=anims[anims.length-1];
 }
 fin.onfinish=cleanup;
},true);
var st=document.createElement('style');st.textContent=
'.lwm-layer{position:fixed;inset:0;z-index:9990;pointer-events:auto}'+
'.lwm-bd{position:fixed;inset:0;z-index:9990;background:radial-gradient(120% 90% at 50% 38%,#f6f6f4 0%,#dcdcd8 100%)}html.night .lwm-bd{background:radial-gradient(120% 90% at 50% 38%,#1a1a1a 0%,#000 100%)}'+
'.lwm-sh{position:fixed;inset:6% 10%;z-index:9991;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.28),rgba(0,0,0,0));filter:blur(30px);pointer-events:none}'+
'.lwm-frame{position:fixed;inset:0;z-index:10000;pointer-events:none;border-radius:var(--r);box-shadow:0 0 0 var(--b) #111,0 0 0 calc(var(--b) + 1.5px) #6b6b6b,inset 0 0 0 1px rgba(255,255,255,.06);will-change:transform,opacity}'+
'.lwm-isl{position:absolute;left:50%;top:calc(var(--b)*1.2);width:calc(var(--b)*7.5);height:calc(var(--b)*2.1);margin-left:calc(var(--b)*-3.75);border-radius:99px;background:#111}'+
'.lwm-btn{position:absolute;right:calc(var(--b)*-1 - 4px);top:22%;width:4px;height:9%;border-radius:2px;background:#555}'+
'.lwm-frame.land .lwm-isl{top:50%;left:calc(var(--b)*1.2);margin:0;width:calc(var(--b)*2.1);height:calc(var(--b)*7.5);margin-top:calc(var(--b)*-3.75)}.lwm-frame.land .lwm-btn{display:none}'+
'.lwm-fl{position:fixed;left:50%;top:50%;z-index:10001;color:#111;pointer-events:none}html.night .lwm-fl{color:#eee}.lwm-fl svg{display:block;width:auto;overflow:visible}'+
'.lwm-inkr{position:fixed;left:50%;top:50%;width:max(100vw,150vh);height:max(66.6667vw,100vh);margin-left:calc(max(100vw,150vh)/-2);margin-top:calc(max(66.6667vw,100vh)/-2);z-index:-1;pointer-events:none;overflow:visible;transform:translate(var(--px,0px),var(--py,0px));transition:transform 550ms cubic-bezier(.3,0,.2,1)}@supports (height:100dvh){.lwm-inkr{width:max(100vw,150dvh);height:max(66.6667vw,100dvh);margin-left:calc(max(100vw,150dvh)/-2);margin-top:calc(max(66.6667vw,100dvh)/-2)}}html.dragging .lwm-inkr{transition:none}'+
'.lwm-ink{color:#111;opacity:.55}html.night .lwm-ink{color:#eee}.lwm-ln{position:fixed;left:0;top:0;z-index:10003;color:#111;pointer-events:none;overflow:visible}html.night .lwm-ln{color:#eee}'+
'.lwm-skip{position:fixed;left:0;right:0;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:10003;text-align:center;font:400 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.04em;color:#888;cursor:pointer}'+
'body.lwm-run .lw-search,body.lwm-run .lw-mp,body.lwm-run .night-btn,body.lwm-run #lw-wordmark{opacity:0!important}'+
'#lw-hero,.site-shell{backface-visibility:hidden;-webkit-backface-visibility:hidden}';
document.head.appendChild(st);
})();

}catch(e){console.error("[flower]",e)}
/* --- s7.js --- */
try{
!function(){const e=document.getElementById("lw-hero"),t=document.body,n=document.getElementById("lang-toggle"),o=document.getElementById("lw-ita"),r=()=>"it"===document.documentElement.lang,c=()=>{o.textContent=r()?"Eng":"Ita"};c(),new MutationObserver(c).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),o.onclick=()=>{n&&n.click(),setTimeout(c,50)};const l=()=>{e.classList.add("gone"),t.classList.remove("lw-hero-on"),setTimeout((()=>e.hidden=!0),700)};document.getElementById("lw-explore").onclick=l,e.addEventListener("keydown",(e=>{"Enter"===e.key&&l()})),document.addEventListener("keydown",(t=>{"Enter"!==t.key||e.hidden||e.classList.contains("gone")||t.target!==document.body||l()})),document.getElementById("lw-wordmark").onclick=n=>{n.preventDefault(),e.hidden=!1,t.classList.add("lw-hero-on"),requestAnimationFrame((()=>e.classList.remove("gone")))};const a=()=>{const e=document.querySelector(".lw-search");if(!e)return setTimeout(a,100);if(e.querySelector(".lw-enter"))return;const t=e.querySelector("input"),n=document.createElement("button");n.type="button",n.className="lw-enter";const o=()=>{t.placeholder=r()?"esplora laurence who":"explore laurence who",n.setAttribute("aria-label",r()?"cerca":"search")};n.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',o(),new MutationObserver(o).observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),new MutationObserver((()=>{const e=r()?"esplora laurence who":"explore laurence who";t.placeholder!==e&&o()})).observe(t,{attributes:!0,attributeFilter:["placeholder"]}),n.onclick=()=>{t.value.trim()?t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0})):t.focus()},e.querySelector(".clr").after(n)};a()}();
}catch(e){console.error("[s7]",e)}
/* --- s8.js --- */
try{
!function(){const t=[99999,99999,99999,1977,1945,1929,1906,1887,1872,1860,1852,1847,1844,1841,1840,1840,1840,1841,1830,1826,1814,1799,1790,1783,1776,1772,1758,1748,1750,1750,1746,1739,1734,1727,1720,1714,1709,1703,1697,1692,1685,1680,1674,1669,1664,1646,1641,1638,1634,1634],e=1079,n=document.getElementById("lw-hero");if(!n)return;const o=n.querySelector(".lw-h1"),i=[n.querySelector(".lw-bg"),n.querySelector(".lw-fg")];function r(){if(n.hidden)return;const _t=n.style.transition;n.style.transition='none';n.style.transform='none';try{r0()}finally{n.style.transform='';void n.offsetWidth;n.style.transition=_t}}function r0(){const HH=Math.max(innerHeight,Math.ceil(n.getBoundingClientRect().height))+2;const r=n.querySelector(".tx"),h=n.querySelector(".act");if(innerWidth<=700){const t=innerWidth,n=HH,l=1634,c=2265,s=229,a=1965,u=o.getBoundingClientRect().height,d=u/3,g=Math.round(Math.min(100,Math.max(70,.1*n))),y=g+u-.28*d;let f=Math.max(.98*t/(c-l),(n-y)/(e-s));const m=f*e,p=y-s*f,x=t/2-a*f;return i.forEach((t=>{t.style.backgroundSize=`auto ${m}px`,t.style.backgroundPosition=`${x}px ${p}px`})),r.style.top=g+"px",h.style.top=p+545*f+"px",void(h.style.bottom="auto")}r.style.top="",h.style.top="",h.style.bottom="";const l=o.firstChild,c=document.createRange(),s=l.textContent;c.setStart(l,s.length-1),c.setEnd(l,s.length);const a=c.getBoundingClientRect(),u=a.left+.35*a.width,d=innerWidth,g=HH;let y=g;for(let n=0;n<30;n++){const n=y/e,o=g-y;let i=1e9;for(let e=a.top+.25*a.height;e<=a.bottom-.15*a.height;e+=4){const r=(e-o)/n,h=Math.round((r-200)/10);h>=0&&h<t.length&&(i=Math.min(i,t[h]))}i>9e4&&(i=1840);if(u-i*n+2492*n>=d)break;y*=1.04}const f=y/e,m=g-y;let p=1e9;for(let e=a.top+.25*a.height;e<=a.bottom-.15*a.height;e+=4){const n=Math.round(((e-m)/f-200)/10);n>=0&&n<t.length&&(p=Math.min(p,t[n]))}p>9e4&&(p=1840);const x=u-p*f;i.forEach((t=>{t.style.backgroundSize=`auto ${y}px`,t.style.backgroundPosition=`${x}px ${m}px`}))}window.__lwHeroFit=r,r(),window.visualViewport&&visualViewport.addEventListener("resize",()=>requestAnimationFrame(r)),addEventListener("pageshow",()=>requestAnimationFrame(r)),addEventListener("resize",r),document.fonts&&document.fonts.ready.then(r)}();
}catch(e){console.error("[s8]",e)}
/* --- s9.js --- */
try{
!function(){const e=navigator.userAgent,t=/Safari\//.test(e)&&!/Chrome|Chromium|CriOS|FxiOS|Edg|Android/.test(e),n=/iP(hone|ad|od)/.test(e)||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1,r=()=>"it"===document.documentElement.lang;let o=0;window.__lwPV=function(e){const i=document.getElementById("lw-pvfb"),a=document.getElementById("preview-frame");if(!i)return!0;const s="https://drive.google.com/file/d/"+e+"/view";i.innerHTML='<img alt="" referrerpolicy="no-referrer" loading="eager" src="https://lh3.googleusercontent.com/d/'+e+'=w900"><a href="'+s+'" target="_blank" rel="noopener">'+(r()?"apri il pdf ↗":"open the pdf ↗")+"</a><p>"+(r()?"si apre in una nuova scheda":"opens in a new tab")+"</p>";const l=i.querySelector("img");if(l.onerror=()=>{l.remove()},clearTimeout(o),t||n){i.classList.add("on");try{a.removeAttribute("src"),a.style.visibility="hidden"}catch(e){}return!1}i.classList.remove("on"),a.style.visibility="";let c=!1;const d=()=>{c=!0,a.removeEventListener("load",d)};return a.addEventListener("load",d),o=setTimeout((()=>{c||(i.classList.add("on"),a.style.visibility="hidden")}),9e3),!0},document.addEventListener("click",(e=>{const t=e.target.closest&&e.target.closest("a[href]");if(!t)return;const n=t.getAttribute("href");/^https?:/.test(n)&&"_blank"!==t.target&&!t.href.startsWith(location.origin)&&(t.target="_blank",t.rel="noopener")}),!0)}();
}catch(e){console.error("[s9]",e)}
/* --- s12.js --- */
try{
(function(){var b=document.getElementById('lw-back'),h=document.getElementById('lw-hero');if(!b||!h)return;b.onclick=function(){h.hidden=false;document.body.classList.add('lw-hero-on');window.__lwHeroFit&&window.__lwHeroFit();requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.remove('gone');});});};
var it=function(){return document.documentElement.lang==='it'};new MutationObserver(function(){var l=it()?'torna all’inizio':'back to the start';b.setAttribute('aria-label',l);b.title=l;}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
/* a11y: map labels reachable by keyboard */
function k(){document.querySelectorAll('#town .poi.main').forEach(function(g){if(g.hasAttribute('tabindex'))return;g.setAttribute('tabindex','0');g.setAttribute('role','button');var n=g.querySelector('.name:not(.lw-halo)');n&&g.setAttribute('aria-label',n.textContent);g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});});
var hb=document.querySelector('#lw-hero .lw-bg'),hf=document.querySelector('#lw-hero .lw-fg');hb&&hb.setAttribute('role','img');hb&&hb.setAttribute('aria-label','Laurence Who in a hat, black and white, above a blurred crowd');hf&&hf.setAttribute('aria-hidden','true');
var s=document.querySelector('.lw-search input');s&&!s.getAttribute('aria-label')&&s.setAttribute('aria-label',s.placeholder);
document.querySelectorAll('img:not([alt])').forEach(function(i){i.alt='';});document.querySelectorAll('button:not([aria-label])').forEach(function(x){if(!x.textContent.trim()&&x.title)x.setAttribute('aria-label',x.title);});}
k();setTimeout(k,1500);setTimeout(k,4000);})();
}catch(e){console.error("[s12]",e)}
/* --- s13.js --- */
try{
(function(){var h=document.getElementById('lw-hero');if(!h)return;var t=h.querySelector('.lw-h1'),x=document.getElementById('lw-explore');
function s(){var it=document.documentElement.lang==='it';if(t&&t.firstChild)t.firstChild.textContent=it?'produttore creativo multidisciplinare':'multidisciplinary creative producer';if(x&&x.firstChild)x.firstChild.textContent=it?'entra ':'enter ';x&&x.setAttribute('lang',it?'it':'en');
if(!h.hidden&&window.__lwHeroFit)requestAnimationFrame(window.__lwHeroFit);}
s();new MutationObserver(s).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});})();
}catch(e){console.error("[s13]",e)}
