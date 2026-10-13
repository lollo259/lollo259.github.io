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
