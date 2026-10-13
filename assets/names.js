(function(){
var M={"laurence who":["",""],"Lorenzo Ritacco":["Italian","italiano"],"Lárus Jósefsson":["Icelandic","islandese"],"Λαυρέντιος Ιωσήφ Ριτάκκος":["Greek","greco"],"Лаврентий Иосифович Ритакко":["Russian","russo"],"Лаврентије Јосифовић":["Serbian","serbo"],"Lorenzo Ritacco Bertin":["Italian, with the mother's surname","italiano, con il cognome della madre"],"Lourenço Bertin Ritacco":["Portuguese","portoghese"],"ሎሬንዞ ዮሴፍ ቀርሜሎስ":["Amharic","amarico"],"לורנצו בן יוסף וסילביה":["Hebrew","ebraico"],"Lorens ap Joseff":["Welsh","gallese"],"Labhrás Mac Seosaimh":["Irish","irlandese"],"Lorenzo bin Yusof":["Malay","malese"],"ச. லாரன்ஸ்":["Tamil","tamil"],"Иосифын Лоренцо":["Mongolian","mongolo"],"洛伦佐·里塔科":["Chinese","cinese"],"ロレンツォ・リタッコ":["Japanese","giapponese"],"Ritacco Lőrinc":["Hungarian","ungherese"],"Laurentius Ritaccius Foroiuliensis":["Latin","latino"],"Kofi Lorenzo Ritacco":["Akan (Ghana)","akan (Ghana)"]};
var css=`
.lw-streets ul{list-style:none!important;margin:18px 0 8px!important;padding:0!important;display:block!important;border-top:1px solid rgba(16,16,15,.12)}
.lw-streets li{margin:0!important;padding:0!important;display:block!important}
.lw-streets li button{all:unset;box-sizing:border-box;width:100%;display:grid!important;grid-template-columns:1fr auto;align-items:baseline;gap:14px;padding:11px 0 10px!important;border-bottom:1px solid rgba(16,16,15,.12)!important;cursor:pointer;font-family:"Helvetica Neue",Helvetica,Arial,"Noto Sans","Noto Sans Arabic","Noto Sans Hebrew","Noto Sans Ethiopic","Noto Sans Tamil","Noto Sans SC","Noto Sans JP",sans-serif!important;color:#10100f;transition:padding .25s ease,color .25s}
.lw-streets li button .nn{font-size:17px;font-weight:400;line-height:1.25;letter-spacing:-.015em;unicode-bidi:plaintext;text-align:start}
.lw-streets li button .nl{font-size:11px;font-weight:400;color:#8a8a8a;white-space:nowrap;text-transform:lowercase}
.lw-streets li button:hover,.lw-streets li button:focus-visible{padding-left:6px!important}
.lw-streets li button.on .nn{font-weight:700}.lw-streets li button.on .nl{color:#10100f}
.lw-streets li:first-child button .nn{font-weight:700}
html.night .lw-streets ul,html.night .lw-streets li button{border-color:rgba(255,255,255,.14)!important}html.night .lw-streets li button{color:#f2f2f0}
@media (max-width:640px){.lw-streets li button{grid-template-columns:1fr;gap:2px;padding:10px 0!important}.lw-streets li button .nn{font-size:16px}}
`;
var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
function it(){return document.documentElement.lang==='it'}
function run(){document.querySelectorAll('.lw-streets li button').forEach(function(b){var n=b.dataset.nm;if(!n){n=b.textContent.trim();b.dataset.nm=n}var want=it()?1:0;if(b.dataset.lg===String(want)&&b.querySelector('.nn'))return;var r=M[n],l=r?r[want]:'';b.textContent='';var a=document.createElement('span');a.className='nn';a.dir='auto';a.textContent=n;var c=document.createElement('span');c.className='nl';c.textContent=l;b.append(a,c);b.dataset.lg=want})}
setInterval(run,600);
})();
