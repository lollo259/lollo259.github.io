(()=>{"use strict";
const gl=document.getElementById('gl').getContext('webgl',{antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
const cv=document.getElementById('c'),cx=cv.getContext('2d');
let W=0,H=0,DPR=1,S=1,OX=0,OY=0; // stage 1600x900 cover-fit

function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
 for(const c of [cv,gl.canvas]){c.width=W*DPR|0;c.height=H*DPR|0}
 const glS=Math.min(1,1400/W)*DPR; gl.canvas.width=W*glS|0; gl.canvas.height=H*glS|0;
 S=Math.min(Math.max(W/1600,H/900),H/760);if(W<H)S=Math.min(W/1000,H/900);OX=(W-1600*S)/2;OY=(H-900*S)/2;}
addEventListener('resize',resize);resize();
const HOR=560; // horizon y in stage units
// ---------- objects ----------
const O=[
 {id:'moon',name:'i · moon',x:1250,y:210,r:95,snd:0},
 {id:'flower',name:'ii · flower',x:800,y:420,r:120,snd:1},
 {id:'mono',name:'iii · monolith',x:330,y:400,r:110,snd:2},
 {id:'orbs',name:'iv · orbs',x:560,y:250,r:90,snd:3},
 {id:'staff',name:'v · staff',x:1080,y:470,r:100,snd:4},
 {id:'arch',name:'vi · door',x:1420,y:440,r:95,snd:5},
 {id:'rays',name:'vii · rays',x:150,y:220,r:85,snd:6}];
for(const o of O){o.hov=0;o.on=false;o.lv=0;o.pulse=0;o.e=0;o.fft=null}
// ---------- audio ----------
let A=null,master,mAn,mData,comp;const buf={},loading={};
const trackUrl=i=>i===0?'a/t0.m4a':'a/a'+i+'.m4a',sliceUrl=i=>'a/s'+i+'.m4a';
function load(u){if(buf[u])return Promise.resolve(buf[u]);if(loading[u])return loading[u];
 return loading[u]=fetch(u).then(r=>r.arrayBuffer()).then(b=>new Promise((ok,no)=>A.decodeAudioData(b,ok,no))).then(d=>buf[u]=d)}
function initAudio(){A=new (window.AudioContext||window.webkitAudioContext)();
 comp=A.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
 master=A.createGain();master.gain.value=.9;mAn=A.createAnalyser();mAn.fftSize=1024;mAn.smoothingTimeConstant=.78;
 mData=new Uint8Array(mAn.frequencyBinCount);master.connect(comp);comp.connect(mAn);mAn.connect(A.destination);
 const conv=A.createConvolver(),len=A.sampleRate*3.2,ir=A.createBuffer(2,len,A.sampleRate);
 for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
 conv.buffer=ir;const wet=A.createGain();wet.gain.value=.32;conv.connect(wet);wet.connect(master);A.rev=conv;
 for(const o of O){o.g=A.createGain();o.an=A.createAnalyser();o.an.fftSize=256;o.an.smoothingTimeConstant=.7;o.fft=new Uint8Array(128);
  o.g.connect(o.an);o.an.connect(master);o.g.connect(A.rev)}
 O.forEach(o=>load(sliceUrl(o.snd)).catch(()=>{}));
 if(A.state==='suspended')A.resume();
 // silent unlock for iOS
 const b=A.createBuffer(1,1,22050),s=A.createBufferSource();s.buffer=b;s.connect(A.destination);s.start(0);}
function shot(o){if(!A)return;const now=A.currentTime;if(o.lastShot&&now-o.lastShot<1.2)return;o.lastShot=now;
 load(sliceUrl(o.snd)).then(b=>{const s=A.createBufferSource(),g=A.createGain();s.buffer=b;s.playbackRate.value=o.on?1:.5+Math.random()*.0+ .5;
  g.gain.value=o.on?.35:.7;s.connect(g);g.connect(o.g);s.start();o.pulse=1}).catch(()=>{})}
function toggle(o){if(!A)return;o.pulse=1;burst(o);ripple(o.x,o.y);
 if(o.on){o.on=false;const t=A.currentTime;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+1.6);
  const s=o.src;setTimeout(()=>{try{s&&s.stop()}catch(e){}},1700);o.src=null;return}
 o.on=true;o.wait=true;
 load(trackUrl(o.snd)).then(b=>{if(!o.on)return;o.wait=false;const s=A.createBufferSource();s.buffer=b;s.loop=true;
  const t=A.currentTime;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(0,t);o.g.gain.linearRampToValueAtTime(.85,t+1.2);
  s.connect(o.g);s.start(t,0);o.src=s}).catch(()=>{o.on=false;o.wait=false})}
// ---------- interaction ----------
const ptr={x:-1e4,y:-1e4,sx:800,sy:450};let hovered=null,started=false;
const toStage=(x,y)=>[(x-OX)/S,(y-OY)/S];
function pick(sx,sy){let best=null,bd=1e9;for(const o of O){const d=Math.hypot(sx-o.x,sy-o.y)/o.r;if(d<1&&d<bd){bd=d;best=o}}return best}
cv.addEventListener('pointermove',e=>{if(!started)return;const[sx,sy]=toStage(e.clientX,e.clientY);ptr.x=sx;ptr.y=sy;
 const h=pick(sx,sy);if(e.pointerType==='mouse'&&h&&h!==hovered)shot(h);hovered=h;cv.style.cursor=h?'pointer':'default'});
cv.addEventListener('pointerleave',()=>{hovered=null;ptr.x=-1e4});
cv.addEventListener('pointerdown',e=>{if(!started)return;const[sx,sy]=toStage(e.clientX,e.clientY);ptr.x=sx;ptr.y=sy;const h=pick(sx,sy);
 if(h){if(e.pointerType!=='mouse')shot(h);toggle(h)}else{ripple(sx,sy);burstAt(sx,sy,40)}});
const ent=document.getElementById('enter');
function enter(){if(started)return;started=true;initAudio();ent.classList.add('out');document.getElementById('hint').classList.add('on');
 setTimeout(()=>document.getElementById('hint').classList.remove('on'),9000);
 setTimeout(()=>{const f=O[1];toggle(f)},900);}
ent.addEventListener('click',enter);ent.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')enter()});
addEventListener('keydown',e=>{const n=+e.key;if(started&&n>=1&&n<=7)toggle(O[n-1])});
window.__ds={O,toggle,enter,get A(){return A},get out(){return mAn}};
// ---------- particles ----------
const P=[];const NP=innerWidth<800?900:1800;
for(let i=0;i<NP;i++)P.push({x:Math.random()*1600,y:Math.random()*900,vx:0,vy:0,s:Math.random(),home:null});
function burstAt(x,y,n){for(let i=0;i<n;i++){const p=P[Math.random()*P.length|0];const a=Math.random()*6.283,v=2+Math.random()*7;p.x=x;p.y=y;p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v}}
function burst(o){burstAt(o.x,o.y,120)}
const RP=[];function ripple(x,y){RP.push({x,y,t:0});if(RP.length>6)RP.shift()}
// ---------- GL shader: sky, fog, water ----------
const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
const fs=`precision highp float;uniform vec2 R;uniform float T,B,M,Hh,L,HOR;uniform vec4 st;uniform vec3 rp[6];uniform vec3 lt[7];
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
vec2 stg(vec2 fc){vec2 q=vec2(fc.x,R.y-fc.y)/R*st.zw;return (q-st.xy)/st.z*st.z;} 
void main(){vec2 fc=gl_FragCoord.xy;vec2 s=(vec2(fc.x,R.y-fc.y)/R*vec2(st.z,st.w)-st.xy);
 // s now in stage px
 float y=s.y;bool water=y>HOR;vec2 q=s;
 if(water){float d=y-HOR;q.y=HOR-d;q.x+=sin(d*.09-T*1.6)*(2.+d*.02)*(1.+B*2.);
  for(int i=0;i<6;i++){vec3 r=rp[i];float dd=length((s-r.xy)*vec2(1.,3.2));float w=r.z*30.;q.y+=sin(dd*.07-r.z*14.)*exp(-abs(dd-w*30.)*.01)*14.*(1.-r.z/3.)*step(r.z,3.);}}
 vec2 u=q/900.;float t=T*.03;
 float f=fb(u*2.2+vec2(t,-t*.5)+fb(u*3.-t)*(.8+B));
 float sky=.03+.10*smoothstep(HOR,0.,q.y)*0.+.16*exp(-pow((q.y-HOR)/120.,2.));
 float c=sky+f*f*(.16+.35*L)+Hh*.03;
 // stars
 vec2 g=floor(q/3.);float sr=h(g);c+=step(.9975,sr)*(.5+.5*sin(T*2.+sr*90.))*(.6+Hh*2.)*smoothstep(HOR,HOR-200.,q.y);
 // object lights
 for(int i=0;i<7;i++){vec3 o=lt[i];float dd=length(q-o.xy);c+=o.z*.35*exp(-dd*.006)+o.z*.25*exp(-dd*.03);}
 // horizon line
 c+=exp(-abs(y-HOR)*.6)*(.25+M*.8);
 if(water){c*=.55*exp(-(y-HOR)*.0015);c+=.04*fb(s*vec2(.01,.08)+T*.2)*(1.+B);}
 c+=(h(fc+T)-.5)*.045; // grain
 float v=length((s-vec2(800,450))/vec2(1000,700));c*=1.-v*v*.9;
 gl_FragColor=vec4(vec3(c),1);}`;
function sh(t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(x));return x}
const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pg);gl.useProgram(pg);
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const pl=gl.getAttribLocation(pg,'p');gl.enableVertexAttribArray(pl);gl.vertexAttribPointer(pl,2,gl.FLOAT,false,0,0);
const U={};['R','T','B','M','Hh','L','HOR','st','rp','lt'].forEach(k=>U[k]=gl.getUniformLocation(pg,k));
// ---------- draw ----------
let B=0,M=0,Hh=0,L=0,t0=performance.now();
function band(a,lo,hi){let s=0;for(let i=lo;i<hi;i++)s+=a[i];return s/(hi-lo)/255}
const MAN=!!window.__dsManual;
function frame(now,TT){const T=TT!==undefined?TT:(now-t0)/1000;
 if(A||MAN){if(!MAN)mAn.getByteFrequencyData(mData);B+=(band(mData,1,8)-B)*.3;M+=(band(mData,8,60)-M)*.3;Hh+=(band(mData,60,250)-Hh)*.3;L=B*.5+M*.35+Hh*.4;
  for(const o of O){if(!MAN)o.an.getByteFrequencyData(o.fft);const v=band(o.fft,0,64);o.lv+=(v-o.lv)*.35}}
 for(const o of O){o.hov+=((hovered===o?1:0)-o.hov)*.12;o.e+=((o.on?1:0)-o.e)*.04;o.pulse*=.94}
 for(const r of RP)r.t+=.016;
 // GL
 gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
 gl.uniform2f(U.R,gl.canvas.width,gl.canvas.height);gl.uniform1f(U.T,T);gl.uniform1f(U.B,B);gl.uniform1f(U.M,M);gl.uniform1f(U.Hh,Hh);gl.uniform1f(U.L,L);gl.uniform1f(U.HOR,HOR);
 gl.uniform4f(U.st,OX/S,OY/S,W/S,H/S);
 const rp=new Float32Array(18);RP.forEach((r,i)=>{rp[i*3]=r.x;rp[i*3+1]=r.y;rp[i*3+2]=r.t});for(let i=RP.length;i<6;i++)rp[i*3+2]=9;gl.uniform3fv(U.rp,rp);
 const lt=new Float32Array(21);O.forEach((o,i)=>{lt[i*3]=o.x;lt[i*3+1]=o.y;lt[i*3+2]=o.e*(.3+o.lv*1.4)+o.hov*.15+o.pulse*.4});gl.uniform3fv(U.lt,lt);
 gl.drawArrays(gl.TRIANGLES,0,3);
 // 2D
 cx.setTransform(DPR,0,0,DPR,0,0);cx.clearRect(0,0,W,H);cx.setTransform(DPR*S,0,0,DPR*S,DPR*OX,DPR*OY);
 cx.globalCompositeOperation='lighter';
 drawParticles(T);for(const o of O)drawObj(o,T,true);
 cx.save();cx.translate(0,2*HOR);cx.scale(1,-1);cx.globalAlpha=.22;for(const o of O)if(o.y<HOR+40)drawObj(o,T,false);cx.restore();cx.globalAlpha=1;
 drawWave(T);
 cx.globalCompositeOperation='source-over';labels();
 if(MAN&&ptr.x>-1e3){cx.setTransform(DPR*S,0,0,DPR*S,DPR*OX,DPR*OY);cx.strokeStyle='#fff';ring(ptr.x,ptr.y,9,.7,1.2);cx.globalAlpha=1}
 if(!MAN)requestAnimationFrame(frame)}
function drawParticles(T){cx.fillStyle='#fff';const act=O.filter(o=>o.on);
 for(const p of P){let ax=Math.sin(p.y*.006+T*.3+p.s*6)*.03,ay=Math.cos(p.x*.005+T*.25)*.02-.01*(p.s);
  for(const o of act){const dx=o.x-p.x,dy=o.y-p.y,d=Math.hypot(dx,dy)+30;const k=(p.s<.35?1:0)*(.6+o.lv*3)/d;
   ax+=dx/d*k*.8-dy/d*k*1.6;ay+=dy/d*k*.8+dx/d*k*1.6}
  const dx=p.x-ptr.x,dy=p.y-ptr.y,d2=dx*dx+dy*dy;if(d2<14400){const k=(1-d2/14400)*.6;ax+=dx/120*k;ay+=dy/120*k}
  p.vx=(p.vx+ax)*.965;p.vy=(p.vy+ay)*.965;p.x+=p.vx*(1+B*2);p.y+=p.vy*(1+B*2);
  if(p.x<-20)p.x=1620;if(p.x>1620)p.x=-20;if(p.y<-20)p.y=920;if(p.y>920)p.y=-20;
  const a=(.15+p.s*.45)*(p.y>HOR?.35:1)*(.6+L*1.5),sz=.6+p.s*1.4+Hh*2*p.s;cx.globalAlpha=Math.min(1,a);cx.fillRect(p.x,p.y,sz,sz)}
 cx.globalAlpha=1}
function drawWave(T){if(!A&&!MAN)return;cx.strokeStyle='rgba(255,255,255,.28)';cx.lineWidth=1;cx.beginPath();
 for(let i=0;i<=200;i++){const x=i*8,k=mData[(i*2+2)%200]/255;const y=HOR+Math.sin(i*.4+T*3)*k*10*(1+B*3);i?cx.lineTo(x,y):cx.moveTo(x,y)}cx.stroke()}
function ring(x,y,r,a,w){cx.globalAlpha=a;cx.lineWidth=w;cx.beginPath();cx.arc(x,y,Math.max(.1,r),0,6.2832);cx.stroke()}
function drawObj(o,T,front){const e=o.e,lv=o.lv,h=o.hov,p=o.pulse,k=1+lv*.5+p*.15+h*.05,f=o.fft;cx.strokeStyle='#fff';cx.fillStyle='#fff';
 const base=.35+h*.3+e*.4;cx.save();cx.translate(o.x,o.y);
 switch(o.id){
 case 'moon':{const r=58*k;ring(0,0,r,base,1.4);cx.globalAlpha=.08+e*.25+lv*.4;cx.beginPath();cx.arc(0,0,r,0,6.28);cx.fill();
  for(let i=1;i<6;i++)ring(0,0,r+i*16+Math.sin(T*.8+i)*4+(f?f[i*6]/255:0)*30*e,(.22-i*.035)*(base+.3),1);
  cx.globalAlpha=.6*base;cx.beginPath();cx.arc(-r*.35,0,r*.95,-1.2,1.2);cx.stroke();break}
 case 'flower':{const sz=70*k;cx.lineWidth=1.2;for(let g=2;g>=0;g--){cx.globalAlpha=(g?.08*(e+lv*2+h):.55+e*.35+h*.2);const s=1+g*.06*(1+lv*3);for(let q=0;q<6;q++){cx.save();cx.rotate(q*1.047+Math.sin(T*.4)*.05);cx.beginPath();cx.ellipse(0,-sz*s*.55,sz*s*.2,sz*s*.55,0,0,6.283);cx.stroke();cx.restore()}}cx.globalAlpha=.5+e*.4;cx.beginPath();cx.arc(0,0,3+lv*4,0,6.283);cx.fill()
  if(f&&front){cx.globalAlpha=.5*(e+.2);cx.lineWidth=1;cx.beginPath();for(let j=0;j<64;j++){const a=j/64*6.283+T*.1,r=120+f[j]/255*90*(e+.3);const x=Math.cos(a)*r,y=Math.sin(a)*r;j?cx.lineTo(x,y):cx.moveTo(x,y)}cx.closePath();cx.stroke()}break}
 case 'mono':{const hh=230*(1+lv*.12),ww=56;cx.globalAlpha=.06+e*.12+lv*.3;cx.fillRect(-ww/2,-hh/2,ww,hh);cx.globalAlpha=base;cx.lineWidth=1.3;cx.strokeRect(-ww/2,-hh/2,ww,hh);
  if(f)for(let j=0;j<30;j++){const v=f[j*2]/255;cx.globalAlpha=v*(.3+e*.7);const y=-hh/2+j*hh/30;cx.fillRect(-ww/2-v*60*e,y,ww+v*120*e,1)}break}
 case 'orbs':{for(let j=0;j<9;j++){const a=j/9*6.283+T*(.2+j*.03),rr=30+j*7+(f?f[j*5]/255*40*e:0);const x=Math.cos(a)*rr,y=Math.sin(a*1.3)*rr*.6,r=4+(f?f[j*7]/255*14:0)*(e+.2)+h*2;
   cx.globalAlpha=base*.8;cx.beginPath();cx.arc(x,y,r,0,6.28);cx.fill();ring(x,y,r+6+p*20,.25*base,1)}break}
 case 'staff':{const w=170;cx.lineWidth=1;for(let l=0;l<5;l++){cx.globalAlpha=base*.8;cx.beginPath();for(let j=0;j<=60;j++){const x=-w/2+j*w/60,v=f?f[(j+l*9)%120]/255:0;
   const y=(l-2)*13+Math.sin(j*.3+T*2+l)*v*18*(e+.15);j?cx.lineTo(x,y):cx.moveTo(x,y)}cx.stroke()}
  cx.globalAlpha=base*.9;cx.fillRect(-w/2,-30,1.5,60);cx.fillRect(w/2,-30,1.5,60);break}
 case 'arch':{const w=80,hh=150;const path=()=>{cx.beginPath();cx.moveTo(-w/2,hh/2);cx.lineTo(-w/2,-hh/2+w/2);cx.arc(0,-hh/2+w/2,w/2,Math.PI,0);cx.lineTo(w/2,hh/2)};
  cx.globalAlpha=.05+e*.4*(.4+lv*2)+h*.08;path();cx.closePath();cx.fill();cx.lineWidth=1.3;cx.globalAlpha=base;path();cx.stroke();
  for(let j=1;j<4;j++){const s=1+j*.18*(1+lv*2)*(e+.2);cx.globalAlpha=.15/j*(base+.3);cx.save();cx.scale(s,s);path();cx.stroke();cx.restore()}break}
 case 'rays':{cx.lineWidth=1;for(let j=0;j<48;j++){const a=j/48*6.283+T*.05,v=f?f[j]/255:0,r0=16,r1=40+v*90*(e+.25)+h*10;cx.globalAlpha=base*(.3+v);
   cx.beginPath();cx.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);cx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);cx.stroke()}ring(0,0,8+lv*10,base,1.5);break}}
 if(front&&p>.02){cx.globalAlpha=p*.5;ring(0,0,o.r*(2.2-p*1.2),p*.5,1)}
 cx.restore()}
function labels(){cx.font='300 13px "Helvetica Neue",Helvetica,Arial,sans-serif';cx.textAlign='center';
 for(const o of O){const a=Math.max(o.hov,o.e*.6);if(a<.02&&!o.wait)continue;cx.globalAlpha=o.wait?.4+.3*Math.sin(performance.now()/150):a*.8;cx.fillStyle='#fff';
  const ly=o.id==='mono'?o.y+150:o.y+o.r+30;cx.fillText(o.name.toUpperCase().split('').join('\u200A'),o.x,ly);
  if(o.on&&!o.wait){cx.globalAlpha=a*.45;cx.font='300 10px "Helvetica Neue",Helvetica,Arial,sans-serif';cx.fillText('playing · tap to fade',o.x,ly+16);cx.font='300 13px "Helvetica Neue",Helvetica,Arial,sans-serif'}}
 cx.globalAlpha=1}
if(MAN){mData=new Uint8Array(512);for(const o of O)o.fft=new Uint8Array(128);started=true;
 window.__ds.step=(T,m,objs,st)=>{mData.set(m);objs.forEach((f,i)=>O[i].fft.set(f));ptr.x=st.px;ptr.y=st.py;hovered=st.hov>=0?O[st.hov]:null;
  O.forEach((o,i)=>{o.on=st.on[i]});(st.ev||[]).forEach(e=>{if(e[0]=='click'){const o=O[e[1]];o.pulse=1;burst(o);ripple(o.x,o.y)}else if(e[0]=='rip'){ripple(e[1],e[2]);burstAt(e[1],e[2],40)}else if(e[0]=='shot'){O[e[1]].pulse=1}});
  frame(0,T-1/60);frame(0,T)};}
else requestAnimationFrame(frame);
window.whoPause=()=>{if(A&&A.state==='running')A.suspend()};document.addEventListener('pointerdown',()=>{if(A&&A.state==='suspended')A.resume()});
})();
