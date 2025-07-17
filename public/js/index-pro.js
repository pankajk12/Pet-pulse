// ANIMAL EMOJI CYCLE IN HERO
const animalEmojis = ["🐶","🐱","🐮","🐰","🐎","🐐","🐔","🦜"];
let i=0;
function cycleHeroAnimal() {
  const el = document.getElementById('hero-animal-emoji');
  if (!el) return;
  el.textContent = animalEmojis[i % animalEmojis.length];
  i++;
  setTimeout(cycleHeroAnimal, 1650);
}
cycleHeroAnimal();

// SERVICE CARDS SLIDER
const container = document.querySelector('.service-cards-container');
let scrollAmount = 0;
const scrollStep = 340;
const maxScroll = () => (container.scrollWidth - container.clientWidth);

document.querySelector('.prev-btn').onclick = () => {
  scrollAmount = Math.max(0, scrollAmount - scrollStep);
  container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
};
document.querySelector('.next-btn').onclick = () => {
  scrollAmount = Math.min(maxScroll(), scrollAmount + scrollStep);
  container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
};

// DRAG SIMPLE
let isDown = false, dragX;
container.addEventListener('mousedown', e => { isDown=true; dragX=e.pageX-container.scrollLeft; container.classList.add('dragging'); });
container.addEventListener('mouseup',()=>{isDown=false;container.classList.remove('dragging');});
container.addEventListener('mouseleave',()=>{isDown=false;container.classList.remove('dragging');});
container.addEventListener('mousemove',e=>{
  if(!isDown)return;
  e.preventDefault();
  container.scrollLeft = e.pageX - dragX;
});

// Animated Animals in Hero (SVG walkers)
function animatedAnimalsInit() {
  const el = document.getElementById("animated-animals");
  if (!el) return;
  el.innerHTML = "";
  let animals = [
    {svg:'<svg width="48"height="30"><ellipse cx="24" cy="24" rx="20" ry="16" fill="#baffd6"/><ellipse cx="36" cy="26" rx="6" ry="3" fill="#ffecb7"/><ellipse cx="24" cy="36" rx="15" ry="7" fill="#cfc" /></svg>', speed:1.2},
    {svg:'<svg width="30"height="30"><ellipse cx="14" cy="14" rx="12" ry="9" fill="#a9e4fa"/><ellipse cx="22" cy="22" rx="4" ry="2" fill="#ffe"/><ellipse cx="14" cy="28" rx="10" ry="3" fill="#c9e6e9" /></svg>', speed:2.1},
    {svg:'<svg width="35"height="16"><ellipse cx="17" cy="8" rx="16" ry="7" fill="#efe"/><ellipse cx="22" cy="14" rx="5" ry="2" fill="#cac"/><ellipse cx="9" cy="11" rx="7" ry="2" fill="#aaa" /></svg>', speed:1.8}
  ];
  animals.forEach((a,j)=>{
    let span = document.createElement("span");
    span.className = "animal-svg";
    span.innerHTML = a.svg;
    el.appendChild(span);
    let base = 50 + j*80, spd = a.speed + 0.8*Math.random();
    let pct = Math.random();
    function move() {
      pct += 0.008*spd;
      if (pct>1) pct=0;
      span.style.left = (base + pct*window.innerWidth*0.7)%window.innerWidth + "px";
      span.style.bottom = "2px";
      span.style.position="absolute";
      span.style.transition=".22s linear";
      requestAnimationFrame(move);
    }
    move();
  });
}
animatedAnimalsInit();

// PARTICLE BACKGROUND
const canvas = document.getElementById('bg-particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 160;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let particles = [];
  for(let i=0;i<44;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: 1.6 + Math.random()*2.8,
      dx: -0.45 + Math.random() * .9,
      dy: -0.19 + Math.random() * .16,
      c: `rgba(${190+Math.floor(Math.random()*60)},${255},${210+Math.floor(Math.random()*45)},.28)`
    });
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
      ctx.fillStyle = p.c;
      ctx.shadowColor = "#baffee";
      ctx.shadowBlur = 10;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if(p.x<0)p.x=canvas.width;
      if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height;
      if(p.y>canvas.height)p.y=0;
    });
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }
  draw();
}

// WOW simple reveal animation 
function revealOnScroll() {
  document.querySelectorAll(".wow").forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) {
      el.classList.add("shown");
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);