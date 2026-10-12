/* JuniorStudio — suwak przed / po.
   Opcjonalnie dodaj bg:'#222' (kolor podkładki pod scenę z przezroczystym tłem).
   Dla każdej pracy wrzuć obok index.html plik z czystą sceną (pole "before"). Brak pliku = oznaczona wersja demo. */
(()=>{const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const PAIRS=[
 {title:'Manhunt 2',before:'manhunt2-przed.png',after:'manhunt2.png'},
 {title:'Wojna',before:'wojna-przed.png',after:'wojna.png'},
 {title:'Statek',before:'statek-przed.png',after:'statek.png'},
 {title:'Opening',before:'opening-przed.png',after:'opening.png'}];
const root=$('#ba'),frame=$('#baFrame');if(!root||!frame)return;
const imgA=$('.ba-after',frame),imgB=$('.ba-before img',frame),layerB=$('.ba-before',frame),demoTag=$('.ba-demo',frame),err=$('.ba-err',frame),tabs=$('#baTabs');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let pos=50,drag=false,raf=0,token=0,seen=false,cur=0;
const clamp=v=>Math.max(0,Math.min(100,v));
const setPos=v=>{pos=clamp(v);const r=Math.round(pos);frame.style.setProperty('--p',pos+'%');frame.setAttribute('aria-valuenow',r);
 frame.setAttribute('aria-valuetext','Czysta scena '+r+'%, gotowa grafika '+(100-r)+'%')};
const stop=()=>{cancelAnimationFrame(raf);raf=0};
const touch=()=>{stop();root.classList.add('touched')};
/* animacja pozycji (zwraca obietnicę; przerywana dotknięciem użytkownika) */
const animTo=(to,ms)=>new Promise(res=>{stop();const from=pos,t0=performance.now();
 const step=t=>{const p=Math.min(1,(t-t0)/ms),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;setPos(from+(to-from)*e);
  if(p<1)raf=requestAnimationFrame(step);else{raf=0;res(true)}};raf=requestAnimationFrame(step)});
const sweep=async()=>{if(reduce){setPos(50);return}await animTo(100,450);if(!raf&&pos!==100)return;await animTo(0,1700);await animTo(50,800)};
/* ładowanie pary obrazów */
const load=i=>{cur=i;const my=++token,pr=PAIRS[i];layerB.style.setProperty('--ba-bg',pr.bg||'#15151d');
 $$('button',tabs).forEach((b,k)=>b.setAttribute('aria-selected',k===i));
 frame.classList.add('loading');err.hidden=true;demoTag.hidden=true;layerB.classList.remove('demo');
 const a=new Image();
 a.onload=()=>{if(my!==token)return;imgA.src=pr.after;imgA.alt='Gotowa grafika: '+pr.title;frame.style.aspectRatio=a.naturalWidth+' / '+a.naturalHeight;
  const b=new Image();
  b.onload=()=>{if(my!==token)return;imgB.src=pr.before;imgB.alt='Czysta scena z Cinema 4D: '+pr.title;frame.classList.remove('loading')};
  b.onerror=()=>{if(my!==token)return;imgB.src=pr.after;imgB.alt='Wersja demo bez tekstur';layerB.classList.add('demo');
   demoTag.textContent='Wersja demo — dodaj plik '+pr.before+' obok strony, aby pokazać prawdziwą scenę z C4D';demoTag.hidden=false;frame.classList.remove('loading')};
  b.src=pr.before};
 a.onerror=()=>{if(my!==token)return;frame.classList.remove('loading');err.textContent='Nie znaleziono pliku '+pr.after;err.hidden=false};
 a.src=pr.after};
tabs.innerHTML=PAIRS.map((p,i)=>`<button type="button" role="tab" aria-selected="false">${p.title}</button>`).join('');
$$('button',tabs).forEach((b,i)=>b.addEventListener('click',()=>{if(i===cur)return;load(i);setPos(100);if(seen)sweep()}));
/* sterowanie: mysz, dotyk, pióro */
const fromEv=e=>{const r=frame.getBoundingClientRect();return(e.clientX-r.left)/r.width*100};
let pend=null;
frame.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;touch();frame.focus({preventScroll:true});
 if(e.pointerType==='touch'){pend={id:e.pointerId,x:e.clientX,y:e.clientY};return}/* dotyk: poczekaj, czy to przewijanie strony, czy przeciąganie */
 drag=true;frame.classList.add('drag');try{frame.setPointerCapture(e.pointerId)}catch{}setPos(fromEv(e));if(e.pointerType==='mouse')e.preventDefault()});
frame.addEventListener('pointermove',e=>{
 if(pend&&e.pointerId===pend.id){const dx=e.clientX-pend.x,dy=e.clientY-pend.y;
  if(Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)){pend=null;drag=true;frame.classList.add('drag');try{frame.setPointerCapture(e.pointerId)}catch{}setPos(fromEv(e))}
  else if(Math.abs(dy)>8)pend=null;
  return}
 if(drag)setPos(fromEv(e))});
const end=e=>{if(pend&&e.pointerId===pend.id){if(e.type==='pointerup')setPos(fromEv(e));pend=null;return}/* stuknięcie = skok */
 if(!drag)return;drag=false;frame.classList.remove('drag');try{frame.releasePointerCapture(e.pointerId)}catch{}};
frame.addEventListener('pointerup',end);frame.addEventListener('pointercancel',end);frame.addEventListener('lostpointercapture',end);
frame.addEventListener('keydown',e=>{const k=e.key,m={ArrowLeft:-2,ArrowDown:-2,ArrowRight:2,ArrowUp:2,PageDown:-10,PageUp:10};
 if(k in m){e.preventDefault();touch();setPos(pos+m[k])}else if(k==='Home'){e.preventDefault();touch();setPos(0)}else if(k==='End'){e.preventDefault();touch();setPos(100)}});
frame.addEventListener('dragstart',e=>e.preventDefault());
/* przyciski */
$('#baPlay').addEventListener('click',()=>{root.classList.add('touched');sweep()});
$('#baOrder').addEventListener('click',()=>{window.JSBrief&&window.JSBrief.add('thumb');location.hash='#konfigurator'});
/* start: surowa scena zakrywa wszystko, po wejściu w kadr rozsuwa się do połowy */
setPos(100);load(0);
new IntersectionObserver((es,io)=>{if(es[0].isIntersecting){io.disconnect();seen=true;if(!root.classList.contains('touched'))setTimeout(()=>{if(!root.classList.contains('touched'))sweep()},350)}},{threshold:.55}).observe(frame);
})();
