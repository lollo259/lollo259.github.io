(function(){
var D=document,H=D.documentElement,it=function(){return H.lang==='it'};
var T={en:{l:'street names',s:'settings',n:'night',d:'day',t:'3d',r:'reset view',h:'drag to rotate · tilt'},it:{l:'nomi delle vie',s:'impostazioni',n:'notte',d:'giorno',t:'3d',r:'ripristina vista',h:'trascina per ruotare · inclinare'}};
function L(k){return T[it()?'it':'en'][k]}
function init(){H.classList.remove('lw3d','lw3d-run','lw3d-anim');try{localStorage.removeItem('lw3d')}catch(e){}
 var nb=D.querySelector('.night-btn');if(!nb||D.getElementById('lw-gear'))return;
 nb.classList.add('lw-nb-hidden');nb.setAttribute('tabindex','-1');nb.setAttribute('aria-hidden','true');
 var g=D.createElement('button');g.type='button';g.id='lw-gear';g.className='lw-btn night-btn lw-gear';g.setAttribute('aria-haspopup','true');g.setAttribute('aria-expanded','false');
 g.innerHTML='<svg viewBox="-12 -12 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle r="3.2"/><path d="M0-8.5v2.6M0 5.9v2.6M-8.5 0h2.6M5.9 0h2.6M-6 -6l1.85 1.85M4.15 4.15L6 6M-6 6l1.85-1.85M4.15-4.15L6-6"/><circle r="5.9"/></g></svg>';
 var p=D.createElement('div');p.id='lw-set';p.setAttribute('role','dialog');p.hidden=true;
 p.innerHTML='<button type="button" class="lw-row" data-k="night"><span class="lw-lab"></span><span class="lw-sw"><i></i></span></button><button type="button" class="lw-row" data-k="lab"><span class="lw-lab"></span><span class="lw-sw"><i></i></span></button><p class="lw-hint"></p>';
 var c=D.createElement('button');c.type='button';c.id='lw-compass';c.className='lw-btn night-btn';c.hidden=true;
 c.innerHTML='<svg viewBox="-12 -12 24 24" aria-hidden="true"><g class="nd"><path d="M0-8l3 8h-6z" fill="currentColor"/><path d="M0 8l3-8h-6z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></g></svg>';
 D.body.append(g,p,c);
 var rows=p.querySelectorAll('.lw-row');
 function sync(){var n=H.classList.contains('night'),t=H.classList.contains('lw3d');rows[0].querySelector('.lw-lab').textContent=L('n');rows[0].classList.toggle('on',n);rows[0].setAttribute('aria-pressed',n);var lb=!H.classList.contains('lw-nolab');rows[1].querySelector('.lw-lab').textContent=L('l');rows[1].classList.toggle('on',lb);rows[1].setAttribute('aria-pressed',lb);p.querySelector('.lw-hint').textContent=L('h');p.querySelector('.lw-hint').hidden=!t;g.setAttribute('aria-label',L('s'));p.setAttribute('aria-label',L('s'));c.setAttribute('aria-label',L('r'));c.hidden=!t}
 new MutationObserver(sync).observe(H,{attributes:true,attributeFilter:['class','lang']});sync();
 function open(o){p.hidden=!o;g.setAttribute('aria-expanded',o);g.classList.toggle('on',o)}
 g.addEventListener('click',function(e){e.stopPropagation();open(p.hidden)});
 p.addEventListener('click',function(e){e.stopPropagation()});p.addEventListener('pointerdown',function(e){e.stopPropagation()});
 D.addEventListener('pointerdown',function(e){if(!p.hidden&&!p.contains(e.target)&&e.target!==g&&!g.contains(e.target))open(false)},true);
 D.addEventListener('keydown',function(e){if(e.key==='Escape')open(false)});
 rows[0].addEventListener('click',function(){nb.click()});
 rows[1].addEventListener('click',function(){var o=H.classList.toggle('lw-nolab');try{localStorage.setItem('lw-nolab',o?'1':'')}catch(e){}});try{if(localStorage.getItem('lw-nolab'))H.classList.add('lw-nolab')}catch(e){}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)});else setTimeout(init,0);
var k=setInterval(function(){if(D.getElementById('lw-gear'))clearInterval(k);else init()},300);
})();
