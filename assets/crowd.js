/* inspirations crowd: lives in the info section. desktop: map fades, crowd rises behind the info panel.
   phone: crowd as an image inside the info panel; tap opens full screen. shuffled on every load. */
(function(){
  var V=(new URLSearchParams(location.search).get('crowd')||'b').toLowerCase();
  if('abc'.indexOf(V)<0)V='b';
  var CFG={a:{rows:9,bw:1,minS:.38,overlap:.42},b:{rows:7,bw:0,minS:.42,overlap:.34},c:{rows:6,bw:0,minS:.5,overlap:.22,tiers:1}}[V];
  var people=null,built={};
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.random()*(i+1)|0,t=a[i];a[i]=a[j];a[j]=t}return a}
  function load(cb){if(people)return cb();fetch('inspirations/people.json?v=20261014b').then(function(r){return r.json()}).then(function(d){people=shuffle(d);cb()})}
  function css(){if(document.getElementById('crowd-css'))return;var s=document.createElement('style');s.id='crowd-css';s.textContent=
  '.crowd{position:absolute;inset:0;overflow:hidden;background:#fff;pointer-events:auto;opacity:0;transform:translateY(6%);transition:opacity .7s ease,transform .9s cubic-bezier(.2,.7,.2,1)}'+
  '.crowd.up{opacity:1;transform:none}.crowd .row{position:absolute;left:0;right:0;bottom:0;height:0}'+
  '.crowd img{position:absolute;bottom:0;height:auto;user-select:none;-webkit-user-drag:none;transition:filter .3s,transform .3s;transform-origin:50% 100%;cursor:default}'+
  '.crowd img.on{filter:none!important}'+
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
    var R=CFG.rows,list=people.slice();
    var frontH=Math.min(H*(CFG.tiers?.40:.46),opts.small?H*.62:380);
    var sc=[],cap=[],tot=0;
    for(var r=0;r<R;r++){var t=r/(R-1),s=CFG.minS+(1-CFG.minS)*Math.pow(t,1.4);sc.push(s);
      var w=frontH*s*.8;cap.push(Math.ceil((W+w)/(w*(1-CFG.overlap))));tot+=cap[r]}
    // scale capacities to the number of people
    var k=list.length/tot;cap=cap.map(function(c){return Math.max(2,Math.round(c*k))});
    var good=shuffle(list.filter(function(p){return (p.q||0)>=.75})),mid=shuffle(list.filter(function(p){var q=p.q||0;return q>=.4&&q<.75})),bad=shuffle(list.filter(function(p){return (p.q||0)<.4}));
    var rowsP=[];for(var r=0;r<R;r++)rowsP.push([]);
    var frontRows=Math.max(1,Math.round(R*.3)),backRows=Math.max(1,Math.round(R*.45));
    // front rows: only clean cutouts
    for(var r=R-1;r>=R-frontRows;r--)while(rowsP[r].length<cap[r]&&good.length)rowsP[r].push(good.pop());
    // weird cuts: back rows only
    for(var r=0;r<backRows&&bad.length;r++)while(rowsP[r].length<cap[r]&&bad.length)rowsP[r].push(bad.pop());
    var rest=shuffle(good.concat(mid));
    for(var r=0;r<R-frontRows;r++)while(rowsP[r].length<cap[r]&&rest.length)rowsP[r].push(rest.pop());
    var ri=0;while(bad.length){rowsP[ri%backRows].push(bad.pop());ri++}
    ri=0;while(rest.length){rowsP[ri%(R-frontRows)].push(rest.pop());ri++}
    for(var r=0;r<R;r++){
      var s=sc[r],h=frontH*s,w=h*.8,t=r/(R-1),d=1-t,ps=shuffle(rowsP[r]),n=ps.length;
      var row=document.createElement('div');row.className='row';
      // rows packed so each row covers the lower half of the row behind it
      var base=CFG.tiers? H*(.30+.70*Math.pow(t,1.15))+h*.25 : H*(.40+.60*Math.pow(t,1.3))+h*.30;
      row.style.top=base+'px';row.style.zIndex=r+1;
      var step=(W+w*.4)/Math.max(n,1);
      var f=CFG.bw?'grayscale(1) ':'';
      if(d>.05)f+='blur('+(d*d*2.2).toFixed(2)+'px) brightness('+(1+d*.22).toFixed(2)+') contrast('+(1-d*.3).toFixed(2)+') saturate('+(1-d*.55).toFixed(2)+')';
      for(var j=0;j<n;j++){
        var p=ps[j],im=new Image();im.decoding='async';im.loading=opts.eager?'eager':'lazy';im.alt='';im.dataset.n=p.n;
        im.src='inspirations/'+p.f;
        var x=-w*.2+j*step+(Math.random()-.5)*step*.3;
        var lift=(Math.random()-.5)*h*.05-((p.q||0)<.4?h*.12:0); // weird cuts sit lower, behind the next row
        im.style.cssText='height:'+h+'px;width:'+w+'px;left:'+x+'px;bottom:'+lift+'px;z-index:'+(j%2)+(f?';filter:'+f:'');
        row.appendChild(im);
      }
      c.appendChild(row);
    }
    // soft white fade at the very bottom so no crop line shows
    var fade=document.createElement('div');fade.style.cssText='position:absolute;left:0;right:0;bottom:0;height:7%;z-index:'+(R+2)+';pointer-events:none;background:linear-gradient(rgba(255,255,255,0),#fff)';c.appendChild(fade);
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
