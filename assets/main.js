(function(){
var d=document,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
// mobile menu
var mb=$('.menu-btn'),nav=$('#nav');
if(mb&&nav)mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
// lazy players (YouTube nocookie / Vimeo dnt)
$$('[data-embed]').forEach(function(b){b.addEventListener('click',function(){
  var f=d.createElement('iframe'),p=b.getAttribute('data-embed'),id=b.getAttribute('data-id');
  f.src=p==='vimeo'?'https://player.vimeo.com/video/'+id+'?autoplay=1&dnt=1':'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
  f.title=b.getAttribute('aria-label')||'Video player';
  f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
  b.parentNode.replaceChild(f,b);
});});
// share
$$('[data-share]').forEach(function(b){b.addEventListener('click',function(){
  var u=location.href.split('#')[0],t=d.title;
  if(navigator.share){navigator.share({title:t,url:u}).catch(function(){});return}
  if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){b.textContent='Link copied'})}
});});
// reading progress
var pr=$('.progress'),art=$('.prose');
if(pr&&art){var tick=false;window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){var r=art.getBoundingClientRect(),h=r.height-innerHeight;pr.style.width=Math.max(0,Math.min(100,(-r.top/(h>0?h:1))*100))+'%';tick=false})},{passive:true})}
// library filters
var lib=$('#lib');
if(lib){var cards=$$('.card',lib),q=$('#q'),st=$('#f-state'),ty=$('#f-type'),cnt=$('#count'),kind='all',segs=$$('.seg button'),es=$('#lib-empty');
  var P=new URLSearchParams(location.search);if(P.get('type')){kind=P.get('type')}if(P.get('q'))q.value=P.get('q');
  function run(){var s=q.value.trim().toLowerCase(),a=st.value,b=ty.value,n=0;
    cards.forEach(function(c){var ok=(kind==='all'||c.dataset.kind===kind)&&(!a||c.dataset.state===a)&&(!b||c.dataset.cat===b)&&(!s||c.dataset.search.indexOf(s)>-1);c.hidden=!ok;if(ok)n++});
    segs.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.k===kind)});
    cnt.textContent=n+(n===1?' case file':' case files');es.hidden=n>0}
  segs.forEach(function(x){x.addEventListener('click',function(){kind=x.dataset.k;run()})});
  [q,st,ty].forEach(function(e){e.addEventListener('input',run)});run()}
// tabs (know your rights)
$$('[role=tablist]').forEach(function(tl){var tabs=$$('[role=tab]',tl);
  function sel(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;d.getElementById(x.getAttribute('aria-controls')).hidden=!on})}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t);history.replaceState(null,'','#'+t.id.replace('tab-',''))});
    t.addEventListener('keydown',function(e){var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(k){var n=tabs[(i+k+tabs.length)%tabs.length];n.focus();sel(n)}})});
  var h=location.hash.slice(1),m=h&&d.getElementById('tab-'+h);if(m)sel(m)});
// FOIA generator
var fg=$('#foia');
if(fg){var out=$('#letter'),laws=JSON.parse($('#laws').textContent);
  function v(n){var e=fg.elements[n];return e?e.value.trim():''}
  function build(){var s=v('state'),law=laws[s]||(s?s+"'s public records law":"[your state's public records law]");
    var today=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    var L=[today,'',(v('agency')||'[Agency name]'),'Attn: Records Custodian / FOIA Officer',(v('agencyaddr')||'[Agency address or email]'),'',
    'Re: Public records request for body-worn camera footage','',
    'Dear Records Custodian,','',
    'Under '+law+', I request copies of the following records:','',
    '1. All body-worn camera and in-car (dashcam) video and audio recorded by officers of '+(v('agency')||'your agency')+' in connection with the incident described below.',
    '2. The incident or case report associated with this incident, to the extent it is releasable.','',
    'Incident details:',
    '- Date: '+(v('date')||'[date]')+(v('time')?' (approximately '+v('time')+')':''),
    '- Location: '+(v('location')||'[address, intersection or business name]')+(s?', '+s:''),
    v('number')?'- Incident/report number: '+v('number'):'',
    v('officers')?'- Officers or units involved (if known): '+v('officers'):'',
    v('details')?'- Description: '+v('details'):'','',
    'I would prefer to receive the records electronically (download link or email) in their native digital format.',
    fg.elements.waiver.checked?'I request a waiver or reduction of fees because disclosure of these records is in the public interest and is not primarily for commercial purposes.':'If fees will exceed $'+(v('fees')||'25')+', please contact me before fulfilling the request.',
    'If any portion of this request is denied or redacted, please cite the specific exemption that applies and release all reasonably segregable portions.','',
    'Thank you for your time. I look forward to your response within the time allowed by law.','',
    'Sincerely,',(v('name')||'[Your name]'),(v('email')||'[Email]'),v('addr')];
    out.value=L.filter(function(x,i,a){return x!==''||a[i-1]!==''}).join('\n')}
  fg.addEventListener('input',build);build();
  $('#copy').addEventListener('click',function(){out.select();(navigator.clipboard?navigator.clipboard.writeText(out.value):Promise.resolve(d.execCommand('copy'))).then(function(){$('#copy').textContent='Copied'})});
  $('#dl').addEventListener('click',function(){var a=d.createElement('a');a.href=URL.createObjectURL(new Blob([out.value],{type:'text/plain'}));a.download='public-records-request.txt';a.click()})}
// facebook page plugin, loaded on click only
var fb=$('#fb-load');
if(fb)fb.addEventListener('click',function(){var box=$('#fb-box'),w=Math.min(500,box.clientWidth||340);
  box.innerHTML='<iframe title="The Chest Mount on Facebook" src="https://www.facebook.com/plugins/page.php?href='+encodeURIComponent('https://www.facebook.com/TheChestMountBodycam')+'&tabs=timeline&width='+w+'&height=500&small_header=true&hide_cover=false&show_facepile=false" width="'+w+'" height="500" style="border:0;overflow:hidden;max-width:100%" loading="lazy" allow="encrypted-media"></iframe>'});
var y=$('#yr');if(y)y.textContent=new Date().getFullYear();
})();
