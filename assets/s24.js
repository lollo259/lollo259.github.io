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
