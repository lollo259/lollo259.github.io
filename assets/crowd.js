/* inspirations crowd (pen line drawings, handwritten labels): lives in the info section. desktop: map fades, crowd rises behind the info panel.
   phone: crowd as an image inside the info panel; tap opens full screen. shuffled on every load. */
(function(){
  var LBL='b',LINES=1;
  var CFG={rows:8,minS:.36,overlap:.38};

  var people=null,built={};
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.random()*(i+1)|0,t=a[i];a[i]=a[j];a[j]=t}return a}
  function load(cb){if(people)return cb();fetch('inspirations/people.json?v=20261014d').then(function(r){return r.json()}).then(function(d){people=shuffle(d);cb()})}
  function css(){if(document.getElementById('crowd-css'))return;var s=document.createElement('style');s.id='crowd-css';s.textContent=
  '@font-face{font-family:"reenie";src:url(assets/fonts/reenie-beanie.woff2) format("woff2");font-display:swap}'+'.crowd .lbl{position:absolute;z-index:5;pointer-events:none;white-space:nowrap;font-family:reenie,cursive!important;color:#555;text-transform:lowercase;line-height:1;transform-origin:0 50%;transition:opacity .2s,color .2s}.crowd .lbl.on{opacity:1!important;color:#000}.crowd .lead{border:0!important;background:none!important;box-shadow:none!important;position:absolute;z-index:5;overflow:visible;pointer-events:none}.crowd .lead path{fill:none;stroke:#777;stroke-width:.8;stroke-linecap:round}'+'.crowd .pcard{position:absolute;z-index:1001;display:none;gap:10px;align-items:flex-start;padding:10px;background:#fff;border:1px solid #e6e6e6;border-radius:12px;font:400 12px/1.35 Helvetica Neue,Helvetica,Arial,sans-serif;color:#202124;text-transform:none}.crowd .pcard.on{display:flex}.crowd .pcard img{position:static;flex:0 0 56px;width:56px!important;height:56px!important;object-fit:cover;border-radius:6px;filter:grayscale(1)!important;transform:none!important}.crowd .pcard b{display:block;font-weight:700;text-transform:lowercase;margin-bottom:3px}.crowd .pcard p{margin:0 0 6px;color:#555}.crowd .pcard a{color:#000;text-transform:lowercase;text-decoration:underline;text-underline-offset:2px}'+'.crowd{position:absolute;inset:0;overflow:hidden;background:#fff;pointer-events:auto;opacity:0;transform:translateY(6%);transition:opacity .7s ease,transform .9s cubic-bezier(.2,.7,.2,1)}'+
  '.crowd.up{opacity:1;transform:none}.crowd .row{position:absolute;left:0;right:0;bottom:0;height:0}'+
  '.crowd img{position:absolute;bottom:0;height:auto;user-select:none;-webkit-user-drag:none;transition:filter .3s,transform .3s;transform-origin:50% 100%;cursor:default}'+
  '.crowd img.on{filter:none!important}'+
  '.crowd img.on{transform:scale(1.08);z-index:999!important}'+
  '.crowd .tag{position:absolute;z-index:1000;pointer-events:none;font:400 12px/1.2 Helvetica,Arial,sans-serif;color:#202124;background:#fff;padding:2px 6px;border-radius:3px;white-space:nowrap;text-transform:lowercase;opacity:0;transition:opacity .2s}'+
  '.crowd .tag.on{opacity:1}'+
  '@media (prefers-reduced-motion:reduce){.crowd,.crowd img{transition:none}}'+
  '#crowd-desk{z-index:0}#help-overlay>#help-panel{position:relative;z-index:1}'+
  '#crowd-thumb{position:relative;display:block;flex:0 0 auto;order:0;touch-action:pan-y;width:100%;height:190px;margin:0 0 8px;border:0;padding:0;border-radius:10px;overflow:hidden;background:#fff;cursor:pointer}'+
  '#crowd-thumb .crowd{pointer-events:none}'+
  '#crowd-full{position:fixed;inset:0;z-index:2147483000;background:#fff;display:none}#crowd-full.open{display:block}'+
  '#crowd-close{position:absolute;top:calc(12px + env(safe-area-inset-top));right:14px;z-index:1001;border:0;background:#fff;padding:6px 10px;border-radius:14px;font:400 14px Helvetica,Arial,sans-serif;color:#202124;text-transform:lowercase;box-shadow:0 1px 3px rgba(60,64,67,.3)}';
  document.head.appendChild(s)}
  function build(host,opts){
    opts=opts||{};var W=host.clientWidth||(opts.small?Math.min(innerWidth,408):innerWidth),H=host.clientHeight||(opts.small?190:innerHeight);
    var c=document.createElement('div');c.className='crowd';
    var tag=document.createElement('div');tag.className='tag';
    var R=CFG.rows,list=people.slice();
    var frontH=Math.min(H*.46,opts.small?H*.62:380);
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
    var items=[];
    for(var r=0;r<R;r++){
      var s=sc[r],h=frontH*s,w=h*.8,t=r/(R-1),d=1-t,ps=shuffle(rowsP[r]),n=ps.length;
      var row=document.createElement('div');row.className='row';
      // rows packed so each row covers the lower half of the row behind it
      var base=H*(.40+.60*Math.pow(t,1.3))+h*.30;
      row.style.top=base+'px';row.style.zIndex=r+1;
      var step=(W+w*.4)/Math.max(n,1);
      var f='';
      if(LINES)f=d>.05?'brightness('+(1+d*1.1).toFixed(2)+')':'contrast(1.3)';
      for(var j=0;j<n;j++){
        var p=ps[j],im=new Image();im.decoding='async';im.alt='';im._p=p;im.dataset.n=p.n;
        im.dataset.src='inspirations/'+p.f;
        var x=-w*.2+j*step+(Math.random()-.5)*step*.3;
        var lift=(Math.random()-.5)*h*.05-((p.q||0)<.4?h*.12:0); // weird cuts sit lower, behind the next row
        im.style.cssText='height:'+h+'px;width:'+w+'px;left:'+x+'px;bottom:'+lift+'px;z-index:'+(j%2)+(f?';filter:'+f:'');
        row.appendChild(im);items.push({im:im,row:row,x:x,w:w,h:h,lift:lift,r:r,t:t,base:base});
      }
      c.appendChild(row);
    }
    items.slice().sort(function(a,b){return b.r-a.r}).forEach(function(it){try{it.im.fetchPriority='low'}catch(e){}it.im.src=it.im.dataset.src});
    if(opts.small){ // phone in-panel picture: one flat canvas (cheap to scroll, no layer explosion)
      var dpr=Math.min(2,devicePixelRatio||1),cv=document.createElement('canvas');cv.width=W*dpr;cv.height=H*dpr;cv.style.cssText='position:absolute;left:0;top:0;width:'+W+'px;height:'+H+'px';
      var g=cv.getContext('2d'),hasF='filter' in g,left=items.length;
      var paint=function(){g.clearRect(0,0,cv.width,cv.height);items.slice().sort(function(a,b){return a.r-b.r}).forEach(function(it){var im=it.im;if(!im.complete||!im.naturalWidth)return;
        var d=1-it.t;if(hasF)g.filter=d>.05?'brightness('+(1+d*1.1).toFixed(2)+')':'contrast(1.3)';else g.globalAlpha=1-d*.5;
        g.drawImage(im,it.x*dpr,(it.base-it.lift-it.h-H*.2)*dpr,it.w*dpr,it.h*dpr)});};
      items.forEach(function(it){it.im.addEventListener('load',function(){if(--left<=0||left%25==0)paint()});it.im.addEventListener('error',function(){--left})});
      [].slice.call(c.querySelectorAll('.row')).forEach(function(r){r.remove()});c.appendChild(cv);paint();
    }
    if(LBL&&!opts.small)labels(items,W,H);
    // soft white fade at the very bottom so no crop line shows
    var fade=document.createElement('div');fade.style.cssText='position:absolute;left:0;right:0;bottom:0;height:7%;z-index:'+(R+2)+';pointer-events:none;background:linear-gradient(rgba(255,255,255,0),#fff)';c.appendChild(fade);
    c.appendChild(tag);
    if(!opts.small){
      var cur=null;
      function on(im,ev){if(cur){cur.classList.remove('on');cur._lbl&&cur._lbl.classList.remove('on')}cur=im;if(!im){tag.classList.remove('on');hideCard();return}
        im.classList.add('on');if(LBL){if(cur._lbl)cur._lbl.classList.add('on');card(im);return}tag.textContent=im.dataset.n;var b=im.getBoundingClientRect(),cb=c.getBoundingClientRect();
        tag.style.left=Math.max(4,Math.min(cb.width-tag.offsetWidth-4,b.left-cb.left+b.width/2-tag.offsetWidth/2))+'px';
        tag.style.top=Math.max(4,b.top-cb.top-22)+'px';tag.classList.add('on')}
      var pc=document.createElement('div');pc.className='pcard';c.appendChild(pc);var hideT;
      pc.addEventListener('mouseenter',function(){clearTimeout(hideT)});pc.addEventListener('mouseleave',function(e){if(!pc.contains(e.relatedTarget))on(null)});
      pc.addEventListener('click',function(e){e.stopPropagation()});
      function esc(t){return String(t||'').replace(/[&<>"]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]})}
      function hideCard(){clearTimeout(hideT);hideT=setTimeout(function(){pc.classList.remove('on')},180)}
      function card(im){clearTimeout(hideT);var p=im._p||{};
        var wiki=/wikipedia\.org/.test(p.w||'');
        pc.innerHTML=(p.t?'<img src="inspirations/'+esc(p.t)+'" alt="">':'')+'<div class="pc-t"><b>'+esc(p.n)+'</b>'+(p.d?'<p>'+esc(p.d)+'</p>':'')+(p.w?'<a href="'+esc(p.w)+'" target="_blank" rel="noopener">'+(wiki?'wikipedia':'website')+' →</a>':'')+'</div>';
        var b=im.getBoundingClientRect(),cb=c.getBoundingClientRect(),cw=Math.min(300,cb.width-16);pc.style.width=cw+'px';
        var x=b.left-cb.left+b.width/2-cw/2;x=Math.max(8,Math.min(cb.width-cw-8,x));
        pc.classList.add('on');var ch=pc.offsetHeight,y=b.top-cb.top-ch-6;if(y<8)y=Math.min(cb.height-ch-8,b.top-cb.top+b.height*.45);
        pc.style.left=x+'px';pc.style.top=y+'px'}
      c.addEventListener('mouseover',function(e){if(e.target.tagName=='IMG'&&e.target.closest('.row'))on(e.target)});
      c.addEventListener('mouseleave',function(e){if(!pc.contains(e.relatedTarget))on(null)});
      c.addEventListener('click',function(e){e.stopPropagation();on(e.target.tagName=='IMG'&&e.target.closest('.row')&&e.target!==cur?e.target:null)});
    }
    host.appendChild(c);if(!opts.hidden)requestAnimationFrame(function(){requestAnimationFrame(function(){c.classList.add('up')})});
    return c;
  }
  function labels(items,W,H){
    var run=function(){
    var ctx=document.createElement('canvas').getContext('2d'),boxes=[],faces=[],NS='http://www.w3.org/2000/svg';
    items.forEach(function(it){var top=it.base-it.lift-it.h;faces.push({r:it.r,b:[it.x+it.w*.28,top+it.h*.08,it.x+it.w*.72,top+it.h*.42]})});
    function ov(a,b){return !(a[2]<=b[0]||a[0]>=b[2]||a[3]<=b[1]||a[1]>=b[3])}
    var rows=items.reduce(function(m,i){return Math.max(m,i.r)},0)+1,minR=Math.ceil(rows*.6);
    items.filter(function(it){return it.r>=minR}).sort(function(a,b){return b.r-a.r||a.x-b.x}).forEach(function(it){
      var t=it.t,fs=11+10*Math.pow(t,1.2),op=.45+.55*Math.pow(t,1.6),txt=it.im.dataset.n;
      ctx.font=fs+'px reenie';var tw=ctx.measureText(txt).width,th=fs*.95;
      var top=-it.lift-it.h,cx=it.x+it.w*.5;
      var cands=[[cx-tw/2,top-th*.2],[cx-tw*.15,top-th*.5],[cx-tw*.85,top-th*.5],[cx-tw/2,top-th*1.1]];
      for(var k=0;k<cands.length;k++){
        var x=cands[k][0],y=cands[k][1],gy=it.base+y,box=[x-3,gy-2,x+tw+3,gy+th+2];
        if(box[0]<2||box[2]>W-2||box[1]<4)continue;
        if(boxes.some(function(b){return ov(box,b)}))continue;
        if(faces.some(function(f){return f.r>=it.r&&ov(box,f.b)}))continue;
        boxes.push(box);
        var rot=(Math.random()-.5)*4,l=document.createElement('span');l.className='lbl';l.textContent=txt;
        l.style.cssText='left:'+x+'px;top:'+y+'px;font-size:'+fs.toFixed(1)+'px;opacity:'+op.toFixed(2)+';transform:rotate('+rot.toFixed(1)+'deg)';
        it.row.appendChild(l);it.im._lbl=l;
        if(k>0&&Math.random()<.6){var sv=document.createElementNS(NS,'svg'),L=Math.max(6,top+it.h*.06-(y+th));sv.setAttribute('class','lead');
          var lx=Math.min(Math.max(cx,x+6),x+tw-6);
          sv.style.cssText='left:'+(lx-7)+'px;top:'+(y+th*.95)+'px;width:14px;height:'+L+'px;opacity:'+op.toFixed(2);
          var p=document.createElementNS(NS,'path');p.setAttribute('d','M7 0 C 4 '+(L*.35)+', 10 '+(L*.6)+', 7 '+(L-1));sv.appendChild(p);it.row.appendChild(sv)}
        break;
      }
    });};
    (document.fonts&&document.fonts.load)?document.fonts.load('16px reenie').then(run,run):run();
  }
  var mq=matchMedia('(max-width: 700px)');
  function prebuildDesk(){var ov=document.getElementById('help-overlay');if(!ov||document.getElementById('crowd-desk'))return;var h=document.createElement('div');h.id='crowd-desk';h.className='lw-btn';h.style.cssText='position:fixed;inset:0';ov.insertBefore(h,ov.firstChild);build(h,{hidden:1})}
  function openDesk(){var ov=document.getElementById('help-overlay');if(!ov)return;
    var h=document.getElementById('crowd-desk');
    if(!h){h=document.createElement('div');h.id='crowd-desk';h.className='lw-btn crowd-host';h.style.cssText='position:fixed;inset:0';ov.insertBefore(h,ov.firstChild);build(h)}
    else{var c=h.firstChild;c.classList.remove('up');void c.offsetWidth;c.classList.add('up')}
    h.style.display='block'}
  function closeDesk(){var h=document.getElementById('crowd-desk');if(h&&h.firstChild)h.firstChild.classList.remove('up')}
  function openMobile(){var p=document.getElementById('help-panel');if(!p||document.getElementById('crowd-thumb'))return;
    var b=document.createElement('button');b.id='crowd-thumb';b.type='button';b.setAttribute('aria-label','inspirations');
    var hdr=p.querySelector('.menu-topline');hdr&&hdr.nextSibling?p.insertBefore(b,hdr.nextSibling):p.insertBefore(b,p.firstChild);
    build(b,{small:1});
    var sx=0,sy=0,st=0;b.addEventListener('pointerdown',function(e){sx=e.clientX;sy=e.clientY;st=Date.now()});
    b.addEventListener('click',function(e){e.stopPropagation();if(st&&(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10||Date.now()-st>600))return;var f=document.getElementById('crowd-full');
      if(!f){f=document.createElement('div');f.id='crowd-full';f.className='lw-btn';['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend'].forEach(function(t){f.addEventListener(t,function(ev){ev.stopPropagation()})});var x=document.createElement('button');x.id='crowd-close';x.type='button';x.textContent='close';
        x.addEventListener('click',function(ev){ev.stopPropagation();f.classList.remove('open')});document.body.appendChild(f);f.classList.add('open');f.appendChild(x);
        build(f,{eager:1}).addEventListener('click',function(ev){if(ev.target.tagName!='IMG')f.classList.remove('open')})}
      else f.classList.add('open')})}
  function sync(){var ov=document.getElementById('help-overlay');if(!ov)return;var open=ov.classList.contains('is-open');
    css();if(!open){closeDesk();var f=document.getElementById('crowd-full');f&&f.classList.remove('open');return}
    load(function(){mq.matches?openMobile():openDesk()})}
  function init(){var ov=document.getElementById('help-overlay');if(!ov)return;
    new MutationObserver(sync).observe(ov,{attributes:true,attributeFilter:['class']});sync();
    var pre=function(){var go=function(){css();load(function(){mq.matches?openMobile():prebuildDesk()})};window.requestIdleCallback?requestIdleCallback(go,{timeout:4000}):setTimeout(go,1500)};
    document.readyState=='complete'?pre():addEventListener('load',pre,{once:true})}
  document.readyState=='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
