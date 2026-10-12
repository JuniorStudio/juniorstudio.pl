/* JuniorStudio v7 — scena 3D, tilt kart, kursor, skew marquee */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
/* pierścień 3D: auto-obrót, przeciąganie, tilt myszą, reakcja na scroll */
const stage=$('#heroStage'),ring=$('#ring3d');
if(stage&&ring){let ry=0,vel=.2,tx=-10,cx=-10,drag=false,moved=0,lx=0,vis=true,ls=scrollY;
const draw=()=>ring.style.transform=`rotateX(${cx}deg) rotateY(${ry}deg)`;
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(stage);
const loop=()=>{if(vis){if(!drag){ry+=vel;vel+=(.2-vel)*.035}cx+=(tx-cx)*.07;draw()}requestAnimationFrame(loop)};
if(!reduce)loop();else draw();
stage.addEventListener('pointerdown',e=>{drag=true;moved=0;lx=e.clientX});stage.addEventListener('burst',()=>vel+=18);
addEventListener('pointerup',()=>drag=false);
addEventListener('pointermove',e=>{if(drag){const d=e.clientX-lx;lx=e.clientX;moved+=Math.abs(d);ry+=d*.45;vel=d*.25}
if(fine){const r=stage.getBoundingClientRect();tx=-10+((e.clientY-r.top)/r.height-.5)*-16}},{passive:true});
addEventListener('scroll',()=>{vel+=(scrollY-ls)*.04;ls=scrollY},{passive:true});
$$('.ring-card',ring).forEach(c=>c.addEventListener('click',()=>{if(moved>6)return;const t=$(`.portfolio-item[data-image="${c.dataset.image}"]`);t&&t.click()}))}
/* tilt 3D kart usług i produktu */
if(fine&&!reduce)$$('.service-card,.product-card,.collab-card').forEach(el=>{
el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*6}deg) rotateY(${x*8}deg) translateY(-4px)`});
el.addEventListener('pointerleave',()=>el.style.transform='')});
/* skew marquee zależny od prędkości scrolla */
if(!reduce){let sk=0,last=scrollY;const m=$('.marquee-section');(function f(){const v=scrollY-last;last=scrollY;sk+=((Math.max(-8,Math.min(8,v*-.25)))-sk)*.12;m&&m.style.setProperty('--sk',sk.toFixed(2)+'deg');requestAnimationFrame(f)})()}
/* kursor-pierścień */
if(fine){const c=document.createElement('div');c.className='cur';document.body.appendChild(c);let x=0,y=0,px=0,py=0;
addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;c.classList.add('on');c.classList.toggle('big',!!e.target.closest('a,button,.portfolio-item,.slot,summary,.ring-card'))},{passive:true});
document.addEventListener('mouseleave',()=>c.classList.remove('on'));
(function f(){px+=(x-px)*.2;py+=(y-py)*.2;c.style.transform=`translate(${px}px,${py}px)`;requestAnimationFrame(f)})()}
})();
/* v8 — intro, 3D w podglądzie, sekcji "o mnie" i kontaktu */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches,root=document.documentElement,ld=$('#loader');
if(reduce||!ld){root.classList.add('intro-done');ld&&ld.remove()}
else{root.classList.add('js-intro');const num=$('#ldNum'),t0=performance.now(),word=$('.ld-word');
'JuniorStudio'.split('').forEach((ch,i)=>{const s=document.createElement('span');s.textContent=ch;s.style.setProperty('--d',i*55+'ms');if(i>5)s.className='acc';word.appendChild(s)});
let ended=false;const end=()=>{if(ended)return;ended=true;ld.classList.add('open');setTimeout(()=>root.classList.add('intro-done'),380);setTimeout(()=>ld.classList.add('done'),1000)};
ld.addEventListener('click',end);addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='Enter')end()});
(function tick(t){const p=Math.min(1,(t-t0)/1300);num.textContent=Math.round(100*(1-Math.pow(1-p,2)));if(p<1)return requestAnimationFrame(tick);ld.classList.add('logo');setTimeout(end,1900)})(t0)}
/* sześcian w hero: klik = rozkręcenie pierścienia */
const cube=$('.cube'),stage=$('#heroStage');if(cube)cube.addEventListener('click',e=>{e.stopPropagation();stage.dispatchEvent(new CustomEvent('burst'))});
if(!fine||reduce)return;
/* podgląd projektu: grafika pochyla się za kursorem */
const mw=$('.modal-image-wrap'),mi=$('#modalImg');
mw.addEventListener('pointermove',e=>{const r=mw.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;mi.style.transform=`rotateY(${x*9}deg) rotateX(${-y*7}deg) scale(1.035)`});
mw.addEventListener('pointerleave',()=>mi.style.transform='');
/* o mnie: warstwy 3D */
const av=$('.about-visual');if(av){const a=$('.about-avatar',av),cs=$$('.about-card',av);
av.addEventListener('pointermove',e=>{const r=av.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
a.style.transform=`rotate(-5deg) rotateX(${-y*22}deg) rotateY(${x*26}deg)`;cs.forEach((c,i)=>c.style.translate=`${x*(i?-40:40)}px ${y*(i?-30:30)}px`)});
av.addEventListener('pointerleave',()=>{a.style.transform='';cs.forEach(c=>c.style.translate='')})}
/* kontakt: nagłówek obraca się za kursorem */
const ct=$('.contact-cta'),h=$('.contact-inner h2');if(ct&&h)ct.addEventListener('pointermove',e=>{const r=ct.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;h.style.transform=`perspective(900px) rotateY(${x*14}deg) rotateX(${-y*10}deg)`});
})();

/* v9 — tło 4D (teserakt), paleta poleceń Ctrl+K, nawigacja kropkowa */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* PALETA POLECEŃ */
const link=h=>(document.querySelector(`a[href*="${h}"]`)||{}).href;
const items=[['Start','#home','fa-house'],['Portfolio','#portfolio','fa-images'],['Przed i po (suwak)','#przed-po','fa-left-right'],['Podgląd miniaturki','#podglad','fa-eye'],['Usługi','#uslugi','fa-layer-group'],['Cennik','#cennik','fa-tag'],['Konfigurator zamówienia','#konfigurator','fa-wand-magic-sparkles'],['O mnie','#o-mnie','fa-user'],['Współpraca','#wspolpraca','fa-handshake'],['FAQ','#faq','fa-circle-question'],['Kontakt','#kontakt','fa-envelope']]
.map(([l,h,i])=>({l,i,f:()=>{location.hash=h}}))
.concat([['Kopiuj nick Discord','fa-copy',()=>$('#copyDiscord').click()],['Otwórz Discord','fa-discord',()=>open(link('discord.gg'),'_blank','noopener')],['Behance','fa-behance',()=>open(link('behance.net'),'_blank','noopener')],['Sklep (Payhip)','fa-bag-shopping',()=>open(link('payhip.com/JuniorStudioo'),'_blank','noopener')],['Kanał YouTube','fa-youtube',()=>open(link('youtube.com/@JuniorStudio'),'_blank','noopener')]].map(([l,i,f])=>({l,i,f})))
.concat($$('.portfolio-item').map(it=>({l:'Projekt: '+it.dataset.title,i:'fa-image',f:()=>it.click()})));
const pal=document.createElement('div');pal.className='pal';pal.innerHTML='<div class="pal-box" role="dialog" aria-label="Szybka nawigacja"><input placeholder="Dokąd chcesz przejść?" aria-label="Szukaj"><ul></ul><div class="pal-hint"><span>↑↓ wybierz</span><span>Enter otwórz</span><span>Esc zamknij</span></div></div>';document.body.appendChild(pal);
const inp=$('input',pal),ul=$('ul',pal);let list=[],sel=0;
const show=()=>{const q=inp.value.toLowerCase();list=items.filter(x=>x.l.toLowerCase().includes(q));sel=Math.min(sel,Math.max(0,list.length-1));
ul.innerHTML=list.map((x,k)=>`<li class="${k===sel?'on':''}" data-k="${k}"><i class="fa-${/discord|behance|youtube/.test(x.i)?'brands':'solid'} ${x.i}"></i>${x.l}</li>`).join('')||'<li>Brak wyników</li>'};
const run=k=>{const x=list[k];if(!x)return;close();setTimeout(x.f,150)};
const openP=()=>{pal.classList.add('open');inp.value='';sel=0;show();setTimeout(()=>inp.focus(),50)},close=()=>pal.classList.remove('open');
inp.addEventListener('input',()=>{sel=0;show()});
ul.addEventListener('click',e=>{const li=e.target.closest('li[data-k]');li&&run(+li.dataset.k)});
pal.addEventListener('click',e=>{if(e.target===pal)close()});
addEventListener('keydown',e=>{const typing=/INPUT|TEXTAREA/.test(document.activeElement.tagName);
if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!typing)){e.preventDefault();pal.classList.contains('open')?close():openP();return}
if(!pal.classList.contains('open'))return;
if(e.key==='Escape')close();else if(e.key==='ArrowDown'){e.preventDefault();sel=(sel+1)%list.length;show()}else if(e.key==='ArrowUp'){e.preventDefault();sel=(sel-1+list.length)%list.length;show()}else if(e.key==='Enter')run(sel)});
const hb=document.createElement('button');hb.className='pal-btn';hb.setAttribute('aria-label','Szybka nawigacja (Ctrl+K)');hb.innerHTML='<i class="fa-solid fa-magnifying-glass"></i><span>Ctrl K</span>';
hb.addEventListener('click',openP);const ha=$('.header-actions');ha.insertBefore(hb,$('.header-cta',ha));
/* NAWIGACJA KROPKOWA */
const secs=[['#home','Start'],['#portfolio','Portfolio'],['#przed-po','Przed/Po'],['#podglad','Podgląd'],['#uslugi','Usługi'],['#cennik','Cennik'],['#konfigurator','Zamów'],['#o-mnie','O mnie'],['#faq','FAQ'],['#kontakt','Kontakt']];
const nav=document.createElement('nav');nav.className='dots';nav.setAttribute('aria-label','Sekcje');
nav.innerHTML=secs.map(([h,l])=>`<a href="${h}" data-l="${l}" aria-label="${l}"></a>`).join('');document.body.appendChild(nav);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('a',nav).forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -45% 0px'});
secs.forEach(([h])=>{const el=$(h);el&&io.observe(el)});
})();
