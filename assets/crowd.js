/* inspirations crowd: lives in the info section. desktop: map fades, crowd rises behind the info panel.
   phone: crowd as an image inside the info panel; tap opens full screen. shuffled on every load. */
(function(){
  var V=(new URLSearchParams(location.search).get('crowd')||'b').toLowerCase();
  if('abc'.indexOf(V)<0)V='b';
  var CFG={a:{rows:9,bw:1,minS:.38,overlap:.42},b:{rows:7,bw:0,minS:.42,overlap:.34},c:{rows:6,bw:0,minS:.5,overlap:.22,tiers:1}}[V];
  var people=null,built={};
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.random()*(i+1)|0,t=a[i];a[i]=a[j];a[j]=t}return a}
  function load(cb){if(people)return cb();fetch('inspirations/people.json?v=20261014a').then(function(r){return r.json()}).then(function(d){people=shuffle(d);cb()})}
  function css(){if(document.getElementById('crowd-css'))return;var s=document.createElement('style');s.id='crowd-css';s.textContent=
  '.crowd{position:absolute;inset:0;overflow:hidden;background:#fff;pointer-events:auto;opacity:0;transform:translateY(6%);transition:opacity .7s ease,transform .9s cubic-bezier(.2,.7,.2,1)}'+
  '.crowd.up{opacity:1;transform:none}.crowd .row{position:absolute;left:0;right:0;bottom:0;height:0}'+
  '.crowd img{position:absolute;bottom:0;height:auto;user-select:none;-webkit-user-drag:none;transition:filter .3s,transform .3s;transform-origin:50% 100%;cursor:default}'+
  '.crowd.bw img{filter:grayscale(1) contrast(1.05)}.crowd.bw img.on{filter:none}'+
  '.crowd img.on{transform:scale(1.08);z-index:999!important}'+
  '.crowd .tag{position:absolute;z-index:1000;pointer-events:none;font:400 12px/1.2 Helvetica,Arial,sans-serif;color:#202124;background:#fff;padding:2px 6px;border-radius:3px;white-space:nowrap;text-transform:lowercase;opacity:0;transition:opacity .2s}'+
  '.crowd .tag.on{opacity:1}'+
  '.crowd.tiers .row{animation:crowd-drift 40s ease-in-out infinite alternate}.crowd.tiers .row:nth-child(even){animation-direction:alternate-reverse}'+
  '@keyframes crowd-drift{from{transform:translateX(-2%)}to{transform:translateX(2%)}}'+
  '@media (prefers-reduced-motion:reduce){.crowd,.crowd img{transition:none}.crowd.tiers .row{animation:none}}'+
  '#crowd-desk{z-index:0}#help-overlay>#help-panel{position:relative;z-index:1}'+
  '#crowd-thumb{position:relative;display:block;width:100%;height:190px;margin:0 0 8px;border:0;padding:0;border-radius:10px;overflow:hidden;background:#fff;cursor:pointer}'+
  '#crowd-thumb .crowd{pointer-events:none}'+
  '#crowd-full{position:fixed;inset:0;z-index:2147483000;background:#fff;display:none}#crowd-full.open{display:block}'+
  '#crowd-close{position:absolute;top:calc(12px + env(safe-area-inset-top));right:14px;z-index:1001;border:0;background:#fff;padding:6px 10px;border-radius:14px;font:400 14px Helvetica,Arial,sans-serif;color:#202124;text-transform:lowercase;box-shadow:0 1px 3px rgba(60,64,67,.3)}';
  document.head.appendChild(s)}
  function build(host,opts){
    opts=opts||{};var W=host.clientWidth,H=host.clientHeight;
    var c=document.createElement('div');c.className='crowd'+(CFG.bw?' bw':'')+(CFG.tiers?' tiers':'');
    var tag=document.createElement('div');tag.className='tag';
    var R=CFG.rows,list=people.slice(),idx=0;
    var frontH=Math.min(H*(CFG.tiers?.36:.42),opts.small?H*.6:340);
    // more people in back rows: weights by 1/scale
    var sc=[],wsum=0;for(var r=0;r<R;r++){var s=CFG.minS+(1-CFG.minS)*r/(R-1);sc.push(s);wsum+=1/s}
    for(var r=0;r<R;r++){
      var s=sc[r],h=frontH*s,w=h*.95;
      var n=Math.max(2,Math.round(list.length*(1/s)/wsum));if(r==R-1)n=list.length-idx;
      var row=document.createElement('div');row.className='row';
      var t=r/(R-1);
      var base=CFG.tiers? H*(1-(1-t)*.82)-4 : H*(1-Math.pow(1-t,1.25)*.62)+h*.12;
      row.style.top=base+'px';row.style.zIndex=r+1;
      var step=Math.max(w*(1-CFG.overlap),(W+w)/Math.max(n,1));
      var cnt=Math.min(n,Math.ceil((W+w)/(w*(1-CFG.overlap)))+1);
      step=(W+w*.6)/cnt;
      for(var k=0;k<n;k++,idx++){
        var p=list[idx];if(!p)break;
        var im=new Image();im.decoding='async';im.loading=opts.eager?'eager':'lazy';im.alt='';im.dataset.n=p.n;
        im.src='inspirations/'+p.f;
        var jitter=(Math.random()-.5)*step*.35,lift=(Math.random()-.5)*h*.06;
        var x=-w*.3+(k%cnt)*step+jitter+((k/cnt|0)%2?step/2:0);
        var hh=h*(.92+Math.random()*.14);
        im.style.cssText='height:'+hh+'px;left:'+x+'px;bottom:'+lift+'px;z-index:'+(k%3);
        if(!CFG.bw&&!CFG.tiers){var d=1-t;im.style.filter='saturate('+(1-d*.45)+') brightness('+(1+d*.12)+')'}
        row.appendChild(im);
        if(k>=cnt*2-1&&idx<list.length-1&&r<R-1){} // overflow wraps into same row (staggered)
      }
      c.appendChild(row);
    }
    c.appendChild(tag);
    if(!opts.small){
      var cur=null;
      function on(im,ev){if(cur)cur.classList.remove('on');cur=im;if(!im){tag.classList.remove('on');return}
        im.classList.add('on');tag.textContent=im.dataset.n;var b=im.getBoundingClientRect(),cb=c.getBoundingClientRect();
        tag.style.left=Math.max(4,Math.min(cb.width-tag.offsetWidth-4,b.left-cb.left+b.width/2-tag.offsetWidth/2))+'px';
        tag.style.top=Math.max(4,b.top-cb.top-22)+'px';tag.classList.add('on')}
      c.addEventListener('mouseover',function(e){if(e.target.tagName=='IMG')on(e.target)});
      c.addEventListener('mouseleave',function(){on(null)});
      c.addEventListener('click',function(e){e.stopPropagation();on(e.target.tagName=='IMG'&&e.target!==cur?e.target:null)});
    }
    host.appendChild(c);requestAnimationFrame(function(){requestAnimationFrame(function(){c.classList.add('up')})});
    return c;
  }
  var mq=matchMedia('(max-width: 700px)');
  function openDesk(){var ov=document.getElementById('help-overlay');if(!ov)return;
    var h=document.getElementById('crowd-desk');
    if(!h){h=document.createElement('div');h.id='crowd-desk';h.className='crowd-host';h.style.cssText='position:fixed;inset:0';ov.insertBefore(h,ov.firstChild);build(h)}
    else{var c=h.firstChild;c.classList.remove('up');void c.offsetWidth;c.classList.add('up')}
    h.style.display='block'}
  function closeDesk(){var h=document.getElementById('crowd-desk');if(h&&h.firstChild)h.firstChild.classList.remove('up')}
  function openMobile(){var p=document.getElementById('help-panel');if(!p||document.getElementById('crowd-thumb'))return;
    var b=document.createElement('button');b.id='crowd-thumb';b.type='button';b.setAttribute('aria-label','inspirations');
    var hdr=p.querySelector('.menu-topline');hdr&&hdr.nextSibling?p.insertBefore(b,hdr.nextSibling):p.insertBefore(b,p.firstChild);
    build(b,{small:1});
    b.addEventListener('click',function(e){e.stopPropagation();var f=document.getElementById('crowd-full');
      if(!f){f=document.createElement('div');f.id='crowd-full';var x=document.createElement('button');x.id='crowd-close';x.type='button';x.textContent='close';
        x.addEventListener('click',function(ev){ev.stopPropagation();f.classList.remove('open')});document.body.appendChild(f);f.classList.add('open');f.appendChild(x);
        build(f,{eager:1}).addEventListener('click',function(ev){if(ev.target.tagName!='IMG')f.classList.remove('open')})}
      else f.classList.add('open')})}
  function sync(){var ov=document.getElementById('help-overlay');if(!ov)return;var open=ov.classList.contains('is-open');
    css();if(!open){closeDesk();var f=document.getElementById('crowd-full');f&&f.classList.remove('open');return}
    load(function(){mq.matches?openMobile():openDesk()})}
  function init(){var ov=document.getElementById('help-overlay');if(!ov)return;
    new MutationObserver(sync).observe(ov,{attributes:true,attributeFilter:['class']});sync()}
  document.readyState=='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
