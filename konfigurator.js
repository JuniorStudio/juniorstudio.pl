/* JuniorStudio — konfigurator zamówień v2 + rozszerzenia portfolio i podglądu */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const calc=$('#calc');if(!calc)return;
const DISC='https://discord.gg/aqat2wQGV',KEY='js_brief_v2';
const slots=$$('.slot',calc),info=Object.fromEntries(slots.map(e=>[e.dataset.k,{p:+e.dataset.price,n:e.dataset.name,el:e}]));
const q={thumb:0,avatar:0,banner:0,pack:0};
const F={nick:$('#fNick'),ref:$('#fRef'),date:$('#fDate'),relax:$('#fRelax'),desc:$('#fDesc')};
const out=$('#calcOut'),tot=$('#calcTotal'),lines=$('#calcLines'),hint=$('#calcHint'),prog=$('#calcProg'),pl=$('#calcProgLabel'),toast=$('#toast');
F.date.min=new Date().toISOString().slice(0,10);
const say=t=>{$('span',toast).textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)};
const game=()=>($('input[name=game]:checked',calc)||{}).value||'';
const styles=()=>$$('input[name=style]:checked',calc).map(i=>i.value);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({q,game:game(),styles:styles(),nick:F.nick.value,ref:F.ref.value,date:F.date.value,relax:F.relax.checked,desc:F.desc.value}))}catch{}};
const render=()=>{
 hint.textContent='';
 const m=Math.min(q.avatar,q.banner);if(m>0){q.pack+=m;q.avatar-=m;q.banner-=m;hint.textContent='Profilowe + baner połączyłem w pakiet — ta sama cena, jedna paczka.'}
 let sum=0,from=false;const rows=[],txt=[];
 for(const k in q){const n=q[k],x=info[k];x.el.classList.toggle('on',n>0);$('output',x.el).textContent=n;
  if(n>0){const price=x.p*n;sum+=price;if(k!=='pack')from=true;const lab=x.n+(n>1?` ×${n}`:'');rows.push(`<li><span>${lab}</span><b>${k==='pack'?'':'od '}${price} zł</b></li>`);txt.push(`• ${lab} (${k==='pack'?'':'od '}${price} zł)`)}}
 lines.innerHTML=rows.join('')||'<li class="empty">Nic jeszcze nie wybrano</li>';
 tot.textContent=sum?`${from?'od ':''}${sum} zł`:'—';
 const when=F.date.value?F.date.value:(F.relax.checked?'bez pośpiechu':'');
 const body=[];if(txt.length){body.push('Cześć! Chcę zamówić:',...txt,'');
  if(game())body.push('Gra / motyw: '+game());if(styles().length)body.push('Styl: '+styles().join(', '));
  if(F.nick.value.trim())body.push('Kanał / nick: '+F.nick.value.trim());if(when)body.push('Termin: '+when);
  if(F.ref.value.trim())body.push('Referencje: '+F.ref.value.trim());if(F.desc.value.trim())body.push('Opis: '+F.desc.value.trim());
  body.push('','Szacunkowa cena: '+tot.textContent)}
 out.value=body.join('\n');
 const pct=(txt.length?40:0)+(F.nick.value.trim()?15:0)+(F.desc.value.trim().length>10?25:0)+(when?20:0);
 prog.style.width=pct+'%';pl.textContent=`Brief: ${pct}%`+(pct===100?' — gotowe do wysłania':'');save()};
calc.addEventListener('click',e=>{
 const body=e.target.closest('.slot-body'),qb=e.target.closest('.qty button');
 if(body){const k=body.parentNode.dataset.k;q[k]=q[k]?0:1;render()}
 else if(qb){const k=qb.closest('.slot').dataset.k;q[k]=Math.max(0,Math.min(9,q[k]+ +qb.dataset.d));render()}});
calc.addEventListener('input',render);
$('#calcCopy').addEventListener('click',async()=>{if(!out.value)return say('Wybierz przynajmniej jedną usługę');
 try{await navigator.clipboard.writeText(out.value);say('Wiadomość skopiowana — wklej ją na Discordzie')}catch{out.select();say('Zaznacz i skopiuj wiadomość ręcznie')}
 open(DISC,'_blank','noopener')});
$('#calcDl').addEventListener('click',()=>{if(!out.value)return say('Najpierw wybierz usługę');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([out.value],{type:'text/plain;charset=utf-8'}));a.download='brief-juniorstudio.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);say('Brief pobrany')});
$('#calcReset').addEventListener('click',()=>{for(const k in q)q[k]=0;calc.querySelectorAll('input[type=text],input[type=date],textarea:not(#calcOut)').forEach(i=>i.value='');
 F.relax.checked=false;$$('input[name=style]',calc).forEach(i=>i.checked=false);$('input[name=game][value=Minecraft]',calc).checked=true;render();say('Wyczyszczono konfigurator')});
/* przywracanie szkicu */
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d){Object.assign(q,d.q);F.nick.value=d.nick||'';F.ref.value=d.ref||'';F.date.value=d.date||'';F.relax.checked=!!d.relax;F.desc.value=d.desc||'';
 const g=$(`input[name=game][value="${d.game}"]`,calc);g&&(g.checked=true);$$('input[name=style]',calc).forEach(i=>i.checked=(d.styles||[]).includes(i.value))}}catch{}
render();
window.JSBrief={add(k){if(info[k]){q[k]=Math.max(1,q[k]);render()}}};
/* PORTFOLIO: wyszukiwarka + losowy projekt */
const fl=$('.portfolio-filters'),grid=$('.portfolio-grid'),items=$$('.portfolio-item');
if(fl&&grid){const box=document.createElement('div');box.className='p-tools';
 box.innerHTML='<label class="p-search"><i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Szukaj projektu…" aria-label="Szukaj projektu"></label><button type="button" class="filter-btn" id="pRandom"><i class="fa-solid fa-shuffle"></i> Losowy</button>';
 fl.appendChild(box);const si=$('input',box),empty=document.createElement('p');empty.className='p-empty';grid.after(empty);
 const apply=()=>{const v=si.value.trim().toLowerCase();items.forEach(it=>it.classList.toggle('nosearch',!!v&&!(it.dataset.title+' '+it.dataset.desc).toLowerCase().includes(v)));
  const n=items.filter(it=>!it.classList.contains('hidden')&&!it.classList.contains('nosearch')).length;empty.textContent=n?'':`Brak projektów dla „${si.value}”. Spróbuj innej frazy lub zmień kategorię.`};
 si.addEventListener('input',apply);$$('.filter-btn[data-filter]').forEach(b=>b.addEventListener('click',()=>setTimeout(apply,0)));
 $('#pRandom').addEventListener('click',()=>{const v=items.filter(it=>!it.classList.contains('hidden')&&!it.classList.contains('nosearch'));v.length&&v[Math.floor(Math.random()*v.length)].click()})}
/* PODGLĄD: licznik + „Zamów podobny projekt” */
const mt=$('#modalTitle'),mi=$('.modal-info'),foot=$('.modal-foot');
if(mt&&mi&&foot){const cnt=document.createElement('span');cnt.className='modal-count';mi.insertBefore(cnt,$('h3',mi));
 const ord=document.createElement('button');ord.type='button';ord.className='modal-order';ord.innerHTML='<i class="fa-solid fa-wand-magic-sparkles"></i> Zamów podobny projekt';foot.insertBefore(ord,foot.lastElementChild);
 const cur=()=>items.find(it=>it.dataset.title===mt.textContent);
 new MutationObserver(()=>{const v=items.filter(it=>!it.classList.contains('hidden')&&!it.classList.contains('nosearch')),i=v.indexOf(cur());cnt.textContent=i>=0?`${i+1} / ${v.length}`:''}).observe(mt,{childList:true,characterData:true,subtree:true});
 ord.addEventListener('click',()=>{const it=cur();$('#modalClose').click();setTimeout(()=>{location.hash='#konfigurator';JSBrief.add(it&&it.dataset.category==='awatary'?'avatar':'thumb')},250)})}
})();
