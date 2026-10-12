/* JuniorStudio v5 — extras: progress, counters, tilt, hotkeys, modal nav, order builder */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const bar=$('#progress'),upd=()=>{const h=document.documentElement;bar.style.width=(scrollY/Math.max(1,h.scrollHeight-innerHeight)*100)+'%'};
addEventListener('scroll',upd,{passive:true});upd();
/* missing images -> pixel placeholder */
$$('img:not(#modalImg)').forEach(i=>{const f=()=>i.classList.add('broken');i.addEventListener('error',f);if(i.complete&&i.currentSrc&&!i.naturalWidth)f()});
/* hero counters */
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduce)$$('.trust-item strong').forEach(el=>{const m=el.textContent.match(/^(\d+)(.*)$/);if(!m)return;const n=+m[1],t0=performance.now();
const step=t=>{const p=Math.min(1,(t-t0)/1100);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+m[2];if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)});
/* 3D tilt */
if(matchMedia('(pointer:fine)').matches&&!reduce)$$('.portfolio-item').forEach(el=>{
el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
el.style.transform=`perspective(800px) rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-4px)`});
el.addEventListener('pointerleave',()=>el.style.transform='')});
/* hotbar keys 1-4 */
const fb=$$('.filter-btn');fb.forEach((b,i)=>b.dataset.key=i+1);
const modal=$('#imageModal');
addEventListener('keydown',e=>{
if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
if(modal.classList.contains('open')){if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);return}
const b=fb[+e.key-1];if(b)b.click()});
/* modal prev/next */
let cur=null;$$('.portfolio-item').forEach(it=>it.addEventListener('click',()=>cur=it));
const go=d=>{const l=$$('.portfolio-item:not(.hidden)'),i=l.indexOf(cur);if(i<0)return;cur=l[(i+d+l.length)%l.length];cur.click()};
[['prev','fa-chevron-left',-1,'Poprzedni projekt'],['next','fa-chevron-right',1,'Następny projekt']].forEach(([c,ic,d,l])=>{
const b=document.createElement('button');b.className='modal-nav '+c;b.setAttribute('aria-label',l);b.innerHTML=`<i class="fa-solid ${ic}"></i>`;
b.addEventListener('click',e=>{e.stopPropagation();go(d)});modal.appendChild(b)});
})();
/* v6 — dodatkowe animacje */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const fine=matchMedia('(pointer:fine)').matches,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* spotlight pod kursorem */
$$('.service-card,.portfolio-item,.price-row').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',e.clientX-r.left+'px');el.style.setProperty('--my',e.clientY-r.top+'px')}));
/* kaskadowe pojawianie się kart */
['.services-grid','.portfolio-grid','.price-table','.process-grid','.pricing-perks','.calc-slots'].forEach(g=>$$(g+'>*').forEach((el,i)=>el.style.transitionDelay=Math.min(i,8)*70+'ms'));
if(fine&&!reduce){
/* magnetyczne przyciski */
$$('.btn-primary,.header-cta').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.18}px ${(e.clientY-r.top-r.height/2)*.28}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});
/* parallax hero */
const hv=$('.hero-visual'),hero=$('.hero');if(hv&&$('.visual-main',hv))hero.addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
$('.visual-main',hv).style.transform=`rotate(2deg) translate(${x*-16}px,${y*-12}px)`;$('.visual-back',hv).style.transform=`rotate(-8deg) translate(${-115+x*22}px,${65+y*16}px)`;
$$('.floating-chip',hv).forEach((c,i)=>c.style.translate=`${x*(i?26:-26)}px ${y*20}px`)})}
/* wróć na górę z pierścieniem postępu */
const t=document.createElement('button');t.className='to-top';t.setAttribute('aria-label','Wróć na górę');t.innerHTML='<i class="fa-solid fa-arrow-up"></i>';document.body.appendChild(t);
t.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
const f=()=>{const h=document.documentElement;t.style.setProperty('--p',scrollY/Math.max(1,h.scrollHeight-innerHeight)*100+'%');t.classList.toggle('show',scrollY>700)};addEventListener('scroll',f,{passive:true});f();
})();
