/* JuniorStudio — podgląd miniaturki jak na YouTube */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const root=$('#yt');if(!root)return;
const stage=$('#ytStage'),msg=$('#ytMsg'),info=$('#ytInfo'),pick=$('#ytPick'),drop=$('#ytDrop'),file=$('#ytFile');
const S={src:'',title:'Jak zbudowałem największy bunker w Minecrafcie?',chan:'TwójKanał',views:'124 tys. wyświetleń',dur:'12:34'};
/* --- szablony kart (tekst wstawiany przez textContent, więc bez ryzyka HTML) --- */
const mine=c=>`<div class="ytc ${c} mine"><div class="ytc-th"><img alt="Twoja miniaturka w podglądzie" draggable="false"><span class="ytc-dur" data-b="dur"></span><span class="yt-safe" aria-hidden="true"></span></div><div class="ytc-meta"><span class="ytc-av" data-b="ini"></span><div class="ytc-tx"><h4 data-b="title"></h4><p data-b="chan"></p><p data-b="views"></p></div></div></div>`;
const sk=(c,h)=>`<div class="ytc ${c} sk" aria-hidden="true"><div class="ytc-th" style="--h:${h}"></div><div class="ytc-meta"><span class="ytc-av"></span><div class="ytc-tx"><i class="sk-l w90"></i><i class="sk-l w60"></i></div></div></div>`;
const VIEWS=[['home','Strona główna',`<div class="yt-home">${sk('',200)}${mine('')}${sk('',30)}${sk('',120)}${sk('',260)}${sk('',80)}</div>`],
['phone','Telefon',`<div class="yt-phone"><span class="yt-notch"></span>${mine('full')}${sk('full',210)}</div>`],
['side','Pasek boczny',`<div class="yt-side">${sk('row',20)}${mine('row')}${sk('row',140)}${sk('row',300)}</div>`],
['search','Wyniki wyszukiwania',`<div class="yt-search">${sk('wide',60)}${mine('wide')}${sk('wide',200)}</div>`]];
const tabs=$('#ytTabs');
tabs.innerHTML=VIEWS.map(([k,l],i)=>`<button type="button" role="tab" id="ytt-${k}" aria-controls="ytp-${k}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${l}</button>`).join('');
$('#ytPanels').innerHTML=VIEWS.map(([k,,h],i)=>`<div class="yt-panel" role="tabpanel" id="ytp-${k}" aria-labelledby="ytt-${k}"${i?' hidden':''}>${h}</div>`).join('');
const tabBtns=$$('button',tabs),show=i=>tabBtns.forEach((b,j)=>{const on=i===j;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;$('#ytp-'+VIEWS[j][0]).hidden=!on});
tabBtns.forEach((b,i)=>{b.addEventListener('click',()=>show(i));b.addEventListener('keydown',e=>{
 if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();const n=(i+(e.key==='ArrowRight'?1:-1)+tabBtns.length)%tabBtns.length;show(n);tabBtns[n].focus()})});
/* --- aktualizacja podglądu --- */
const upd=()=>{
 const t={title:S.title.trim()||'Tytuł filmu',chan:S.chan.trim()||'Kanał',views:S.views.trim(),dur:S.dur.trim(),ini:(S.chan.trim().charAt(0)||'K').toUpperCase()};
 $$('[data-b]',stage).forEach(e=>e.textContent=t[e.dataset.b]);
 if(S.src)$$('.mine img',stage).forEach(i=>{if(i.getAttribute('src')!==S.src)i.src=S.src})};
const ratio=(w,h)=>{const r=w/h,ok=Math.abs(r-16/9)<.02;info.className='yt-info '+(ok?'ok':'warn');
 info.textContent=`${w}×${h}px · `+(ok?'proporcje 16:9 ✓':`proporcje ${r.toFixed(2)}:1 — YouTube pokaże kadr 16:9, brzegi mogą zostać ucięte`)+(w<1280?' · zalecane min. 1280×720':'')};
let objUrl='';
const setSrc=(src,isObj,onDone)=>{const im=new Image();
 im.onload=()=>{if(objUrl&&objUrl!==src)URL.revokeObjectURL(objUrl);objUrl=isObj?src:'';S.src=src;upd();ratio(im.naturalWidth,im.naturalHeight);msg.textContent='';onDone&&onDone(true)};
 im.onerror=()=>{if(isObj)URL.revokeObjectURL(src);if(onDone)onDone(false);else msg.textContent='Nie udało się wczytać tego pliku. Użyj PNG, JPG lub WEBP.'};
 im.src=src};
const load=f=>{if(!f)return;
 if(!/^image\//.test(f.type)){msg.textContent='To nie jest obraz. Wybierz plik PNG, JPG lub WEBP.';return}
 if(f.size>15*1024*1024){msg.textContent='Plik jest za duży (limit 15 MB).';return}
 $$('button',pick).forEach(b=>b.classList.remove('on'));setSrc(URL.createObjectURL(f),true)};
/* wgrywanie: klik, klawiatura, przeciągnięcie, Ctrl+V */
drop.addEventListener('click',()=>file.click());
drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();file.click()}});
file.addEventListener('change',()=>{load(file.files[0]);file.value=''});
['dragenter','dragover'].forEach(n=>drop.addEventListener(n,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(n=>drop.addEventListener(n,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>load(e.dataTransfer.files[0]));
let vis=false;new IntersectionObserver(e=>vis=e[0].isIntersecting,{threshold:.15}).observe($('#podglad'));
addEventListener('paste',e=>{if(!vis||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
 const it=[...(e.clipboardData?e.clipboardData.items:[])].find(i=>i.type.startsWith('image/'));if(it){e.preventDefault();load(it.getAsFile())}});
/* wybór mojej pracy */
const works=$$('.portfolio-item[data-category="minecraft"],.portfolio-item[data-category="cs2"]');
works.forEach(it=>{const b=document.createElement('button'),im=new Image();b.type='button';b.title=it.dataset.title;b.setAttribute('aria-label','Użyj pracy: '+it.dataset.title);
 im.alt='';im.src=it.dataset.image;im.addEventListener('error',()=>b.remove());b.appendChild(im);
 b.addEventListener('click',()=>setSrc(it.dataset.image,false,ok=>{if(ok)$$('button',pick).forEach(x=>x.classList.toggle('on',x===b));else msg.textContent='Nie znaleziono pliku tej pracy.'}));pick.appendChild(b)});
/* obraz startowy: pierwsza praca, której plik istnieje */
const tryDefault=i=>{if(i>=works.length)return;setSrc(works[i].dataset.image,false,ok=>{if(!ok)tryDefault(i+1);else{const b=$$('button',pick).find(x=>x.title===works[i].dataset.title);b&&b.classList.add('on')}})};
upd();tryDefault(0);
/* pola tekstowe */
[['ytTitle','title'],['ytChan','chan'],['ytViews','views'],['ytDur','dur']].forEach(([id,k])=>{const el=$('#'+id);el.value=S[k];el.addEventListener('input',()=>{S[k]=el.value;upd()})});
/* motyw, strefa znacznika czasu, test zmrużonych oczu */
$$('input[name=ytTheme]').forEach(r=>r.addEventListener('change',()=>{stage.dataset.theme=r.value}));
$('#ytSafe').addEventListener('change',e=>stage.classList.toggle('show-safe',e.target.checked));
const sq=$('#ytSq'),sqo=$('#ytSqOut');sq.addEventListener('input',()=>{stage.style.setProperty('--sq',sq.value+'px');sqo.textContent=sq.value==='0'?'wyłączony':sq.value+' px'});
/* przejście do konfiguratora z wpisanym tytułem */
$('#ytOrder').addEventListener('click',()=>{const d=$('#fDesc');
 if(d&&!d.value.trim()){d.value='Tytuł filmu: '+(S.title.trim()||'(podam później)');d.dispatchEvent(new Event('input',{bubbles:true}))}
 window.JSBrief&&window.JSBrief.add('thumb');location.hash='#konfigurator'});
})();
