(function(){
var D=document,H=D.documentElement,it=function(){return H.lang==='it'};
var T={en:{l:'street names',s:'settings',n:'night',d:'day',t:'3d',r:'reset view',h:'drag to rotate · tilt'},it:{l:'nomi delle vie',s:'impostazioni',n:'notte',d:'giorno',t:'3d',r:'ripristina vista',h:'trascina per ruotare · inclinare'}};
function L(k){return T[it()?'it':'en'][k]}
function init(){
 var nb=D.querySelector('.night-btn');if(!nb||D.getElementById('lw-gear'))return;
 nb.classList.add('lw-nb-hidden');nb.setAttribute('tabindex','-1');nb.setAttribute('aria-hidden','true');
 var g=D.createElement('button');g.type='button';g.id='lw-gear';g.className='lw-btn night-btn lw-gear';g.setAttribute('aria-haspopup','true');g.setAttribute('aria-expanded','false');
 g.innerHTML='<svg viewBox="-12 -12 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle r="3.2"/><path d="M0-8.5v2.6M0 5.9v2.6M-8.5 0h2.6M5.9 0h2.6M-6 -6l1.85 1.85M4.15 4.15L6 6M-6 6l1.85-1.85M4.15-4.15L6-6"/><circle r="5.9"/></g></svg>';
 var p=D.createElement('div');p.id='lw-set';p.setAttribute('role','dialog');p.hidden=true;
 p.innerHTML='<button type="button" class="lw-row" data-k="night"><span class="lw-lab"></span><span class="lw-sw"><i></i></span></button><button type="button" class="lw-row" data-k="3d"><span class="lw-lab"></span><span class="lw-sw"><i></i></span></button><button type="button" class="lw-row" data-k="lab"><span class="lw-lab"></span><span class="lw-sw"><i></i></span></button><p class="lw-hint"></p>';
 var c=D.createElement('button');c.type='button';c.id='lw-compass';c.className='lw-btn night-btn';c.hidden=true;
 c.innerHTML='<svg viewBox="-12 -12 24 24" aria-hidden="true"><g class="nd"><path d="M0-8l3 8h-6z" fill="currentColor"/><path d="M0 8l3-8h-6z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></g></svg>';
 D.body.append(g,p,c);
 var rows=p.querySelectorAll('.lw-row');
 function sync(){var n=H.classList.contains('night'),t=H.classList.contains('lw3d');rows[0].querySelector('.lw-lab').textContent=L('n');rows[0].classList.toggle('on',n);rows[0].setAttribute('aria-pressed',n);rows[1].querySelector('.lw-lab').textContent=L('t');rows[1].classList.toggle('on',t);rows[1].setAttribute('aria-pressed',t);var lb=!H.classList.contains('lw-nolab');rows[2].querySelector('.lw-lab').textContent=L('l');rows[2].classList.toggle('on',lb);rows[2].setAttribute('aria-pressed',lb);p.querySelector('.lw-hint').textContent=L('h');p.querySelector('.lw-hint').hidden=!t;g.setAttribute('aria-label',L('s'));p.setAttribute('aria-label',L('s'));c.setAttribute('aria-label',L('r'));c.hidden=!t}
 new MutationObserver(sync).observe(H,{attributes:true,attributeFilter:['class','lang']});sync();
 function open(o){p.hidden=!o;g.setAttribute('aria-expanded',o);g.classList.toggle('on',o)}
 g.addEventListener('click',function(e){e.stopPropagation();open(p.hidden)});
 p.addEventListener('click',function(e){e.stopPropagation()});p.addEventListener('pointerdown',function(e){e.stopPropagation()});
 D.addEventListener('pointerdown',function(e){if(!p.hidden&&!p.contains(e.target)&&e.target!==g&&!g.contains(e.target))open(false)},true);
 D.addEventListener('keydown',function(e){if(e.key==='Escape')open(false)});
 rows[0].addEventListener('click',function(){nb.click()});
 rows[2].addEventListener('click',function(){var o=H.classList.toggle('lw-nolab');try{localStorage.setItem('lw-nolab',o?'1':'')}catch(e){}});try{if(localStorage.getItem('lw-nolab'))H.classList.add('lw-nolab')}catch(e){}
 rows[1].addEventListener('click',function(){set3d(!H.classList.contains('lw3d'))});
 // 3d
 var tilt=50,rot=0,S=1.75,raf=0,LAY='.site-shell>.map-raster,.site-shell>.lwm-inkr,.site-shell>.map-backdrop,.site-shell>canvas';
 var cT=0,cR=0,cS=1,panX=0,panY=0,cX=0,cY=0;
 function mstr(t,r,sc){var ox=innerWidth/2,oy=innerHeight*.62;return 'translate('+ox+'px,'+oy+'px) perspective('+Math.max(innerWidth,innerHeight)*0.9+'px) rotateX('+t+'deg) rotateZ('+r+'deg) scale('+sc+') translate('+(-ox+cX)+'px,'+(-oy+cY)+'px)'}
 function apply(){raf=0;var flat=cT<.05&&Math.abs(cR)<.05&&cS<1.001&&Math.abs(cX)<.05&&Math.abs(cY)<.05;
  var m=flat?'none':mstr(cT,cR,cS);D.querySelectorAll(LAY).forEach(function(e){e.style.transformOrigin='0 0';e.style.transform=m});
  c.querySelector('.nd').setAttribute('transform','rotate('+(-cR)+')');
  var M=flat?null:new DOMMatrix(m);
  var tw=D.getElementById('town');if(tw){tw.style.transform=''}
 D.querySelectorAll('#town .poi').forEach(function(poi){poi.style.transition=M?'none':'';poi.style.transform='';poi.style.translate='';var st=poi.querySelector('.lw-stem');if(!M){if(st)st.remove();return}
  var f=poi.querySelector('.foot'),b=f&&f.getBoundingClientRect(),x,y;if(b&&b.width){x=b.left+b.width/2;y=b.top+b.height/2}else{b=(poi.querySelector('.what')||poi.querySelector('.name')||poi).getBoundingClientRect();var b0=(poi.querySelector('.name')||poi).getBoundingClientRect();x=b0.left;y=b.bottom+4}var q=M.transformPoint(new DOMPoint(x,y,0,1));var bd=D.querySelector('.site-shell>.map-backdrop');
  if(bd){var an=poi.__anc;if(!an||!an.isConnected){var t0=bd.style.transform;bd.style.transform='none';var cm=bd.getScreenCTM();bd.style.transform=t0;if(cm){var u=new DOMPoint(x,y).matrixTransform(cm.inverse());an=D.createElementNS('http://www.w3.org/2000/svg','rect');an.setAttribute('class','lw-anc');an.setAttribute('x',u.x-.5);an.setAttribute('y',u.y-.5);an.setAttribute('width',1);an.setAttribute('height',1);an.setAttribute('fill','none');an.setAttribute('pointer-events','none');bd.appendChild(an);poi.__anc=an}}
   if(an){var ar=an.getBoundingClientRect();if(ar.width||ar.height||ar.left){q=new DOMPoint((ar.left+ar.right)/2,(ar.top+ar.bottom)/2,0,1);q.w=1;var qw=M.transformPoint(new DOMPoint(x,y,0,1)).w;poi.__qw=qw}}}
  var pc=poi.parentNode.getScreenCTM();if(!pc)return;var pi=pc.inverse(),sv=poi.ownerSVGElement;
  poi.__tgt=[q.x/q.w,q.y/q.w];var P=new DOMPoint(x,y).matrixTransform(pi),T=new DOMPoint(q.x/q.w,q.y/q.w).matrixTransform(pi),sc=Math.max(.55,Math.min(1.25,1.15/(poi.__qw||q.w))),lift=14;
  var A=poi.transform&&poi.transform.baseVal.consolidate();A=A?A.matrix:sv.createSVGMatrix();
  var R=new DOMMatrix().translate(T.x,T.y).scale(sc).translate(-P.x,-P.y-lift).multiply(DOMMatrix.fromMatrix(A));
  poi.style.transform='matrix('+[R.a,R.b,R.c,R.d,R.e,R.f].map(function(v){return v.toFixed(4)}).join(',')+')';
  var L=new DOMPoint(P.x,P.y).matrixTransform(DOMMatrix.fromMatrix(A).inverse()),fx=L.x,fy=L.y;
  if(!st){st=D.createElementNS('http://www.w3.org/2000/svg','line');st.setAttribute('class','lw-stem');st.setAttribute('stroke','currentColor');st.setAttribute('stroke-width','1');st.setAttribute('opacity','.5');poi.insertBefore(st,poi.firstChild)}
  st.setAttribute('x1',fx);st.setAttribute('x2',fx);st.setAttribute('y1',fy);st.setAttribute('y2',fy+lift)});
 }
 function req(){}
 window.__lw3d=function(){dirty=1};var dirty=1;
 function set3d(o){H.classList.toggle('lw3d',o);if(!o){rot=0;tilt=50;panX=panY=0}}
 (function lp(){var on=H.classList.contains('lw3d'),tT=on?tilt:0,tR=on?rot:0,tS=on?S:1,f=.14;
  var tX=on?panX:0,tY=on?panY:0,fp=g0&&g0.mode==='pan'?1:f;var d=Math.abs(tT-cT)+Math.abs(tR-cR)+Math.abs(tS-cS)*20+Math.abs(tX-cX)+Math.abs(tY-cY);
  if(d>.02){cT+=(tT-cT)*f;cR+=(tR-cR)*f;cS+=(tS-cS)*f;cX+=(tX-cX)*fp;cY+=(tY-cY)*fp;if(d<.1){cT=tT;cR=tR;cS=tS;cX=tX;cY=tY}apply()}else if(on||dirty)apply();dirty=0;requestAnimationFrame(lp)})();
 addEventListener('resize',function(){D.querySelectorAll('.lw-anc').forEach(function(a){a.remove()});D.querySelectorAll('#town .poi').forEach(function(p){p.__anc=null});dirty=1});
 // gestures: right-drag / shift-drag (mouse), two fingers (touch), compass drag
 var g0=null;
 function start(e,mode){g0={x:e.clientX,y:e.clientY,r:rot,t:tilt,px:panX,py:panY,mode:mode,moved:0};}
 function pan(dx,dy){var a=-cR*Math.PI/180,ct=Math.max(.3,Math.cos(cT*Math.PI/180)),y2=dy/ct,k=1/(cS||1);panX=g0.px+(dx*Math.cos(a)-y2*Math.sin(a))*k;panY=g0.py+(dx*Math.sin(a)+y2*Math.cos(a))*k}
 function move(dx,dy){rot=g0.r+dx*.2;tilt=Math.max(20,Math.min(65,g0.t+dy*.25));req()}
 addEventListener('contextmenu',function(e){if(H.classList.contains('lw3d')&&!e.target.closest('#lw-set,input,textarea,.overlay-layer'))e.preventDefault()});
 addEventListener('pointerdown',function(e){if(!H.classList.contains('lw3d')||e.pointerType!=='mouse')return;if(e.button===2||(e.button===0&&e.shiftKey)){start(e);e.stopPropagation();e.preventDefault()}else if(e.button===0&&!e.target.closest('#lw-set,#lw-gear,#lw-compass,.lw-btn,button,a,input,textarea,.overlay-layer,.poi,#lw-hero')){start(e,'pan');e.stopPropagation()}},true);
 addEventListener('pointermove',function(e){if(!g0||g0.touch)return;if(g0.mode==='pan')pan(e.clientX-g0.x,e.clientY-g0.y);else move(e.clientX-g0.x,e.clientY-g0.y);e.stopPropagation()},true);
 addEventListener('pointerup',function(e){if(g0&&!g0.touch){g0=null;e.stopPropagation()}},true);
 c.addEventListener('pointerdown',function(e){e.stopPropagation();start(e);c.setPointerCapture(e.pointerId)});
 c.addEventListener('pointermove',function(e){if(g0){g0.moved+=1;move(e.clientX-g0.x,e.clientY-g0.y)}});
 c.addEventListener('pointerup',function(e){var m=g0&&g0.moved>2;g0=null;if(!m){rot=0;tilt=50;panX=panY=0}});
 var t0=null;function tt(ts){var a=ts[0],b=ts[1];return{a:Math.atan2(b.clientY-a.clientY,b.clientX-a.clientX)*180/Math.PI,y:(a.clientY+b.clientY)/2}}
 var p1=null;addEventListener('touchstart',function(e){if(H.classList.contains('lw3d')&&e.touches.length===1&&!e.target.closest('.overlay-layer,.poi,button,a,input,#lw-set')){var t=e.touches[0];p1={x:t.clientX,y:t.clientY,px:panX,py:panY};e.stopPropagation()}else p1=null},{capture:true,passive:true});
 addEventListener('touchmove',function(e){if(p1&&e.touches.length===1){var t=e.touches[0];var sv=g0;g0={px:p1.px,py:p1.py};pan(t.clientX-p1.x,t.clientY-p1.y);g0=sv;e.stopPropagation();e.preventDefault()}else if(e.touches.length>1)p1=null},{capture:true,passive:false});
 addEventListener('touchstart',function(e){if(H.classList.contains('lw3d')&&e.touches.length===2&&!e.target.closest('.overlay-layer')){t0=tt(e.touches);t0.r=rot;t0.t=tilt;e.stopPropagation()}},{capture:true,passive:true});
 addEventListener('touchmove',function(e){if(t0&&e.touches.length===2){var n=tt(e.touches);rot=t0.r+(n.a-t0.a);tilt=Math.max(20,Math.min(65,t0.t+(n.y-t0.y)*.3));req();e.stopPropagation();e.preventDefault()}},{capture:true,passive:false});
 addEventListener('touchend',function(e){if(e.touches.length<2)t0=null},true);
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)});else setTimeout(init,0);
var k=setInterval(function(){if(D.getElementById('lw-gear'))clearInterval(k);else init()},300);
})();
