// Emoji cycle for About hero
const aboutEmojis = ["🐕","🐈","🐿️","🐮","🐎","🦜","🐾","🐇"];
let emojiI=0; function cycleAboutEmoji() {
  const el=document.getElementById('about-animal-emoji');
  if(el){el.textContent = aboutEmojis[emojiI%aboutEmojis.length]; emojiI++;}
  setTimeout(cycleAboutEmoji,1400);
} cycleAboutEmoji();

// WOW Reveal animation
function revealOnScroll() {
  document.querySelectorAll(".wow").forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) el.classList.add("shown");
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// About Card Modal Popout
const aboutDetails = [
  {
    title: "Our Mission",
    img: "https://images.unsplash.com/photo-1600488984606-9c9f2cf9b667",
    text: "At PetSewa, our mission is to revolutionize pet care by offering top-notch services right at your doorstep. With a team of certified veterinarians and pet lovers, we focus on personalized care plans tailored to each pet's needs. Our affordable pricing ensures that every pet owner can access quality care, from routine check-ups to emergency treatments. We aim to educate pet owners about proper nutrition, exercise, and grooming, fostering a community where pets thrive. Since our inception in 2020, we’ve served over 10,000 pets, and we’re committed to growing this number with compassion and dedication."
  },
  {
    title: "Our Vision",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    text: "PetSewa envisions a world where every pet receives the love and care it deserves, with us at the forefront of this movement. Our goal is to expand our services across continents, setting new standards in animal welfare through innovative care techniques and sustainable practices. We plan to collaborate with global pet organizations to raise awareness about adoption and responsible pet ownership. By 2030, we aim to establish PetSewa as a household name, supported by a network of passionate professionals and a thriving online community of pet enthusiasts."
  },
  {
    title: "Our Team",
    img: "https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg",
    text: "Our team at PetSewa is the backbone of our success, comprising skilled individuals with a shared love for animals. Pankaj, our founder, brings over 15 years of veterinary experience, ensuring top-tier medical care. Shubham, the tech lead, drives our digital innovation, creating user-friendly platforms for pet owners. Pushpakar, the operations head, oversees seamless service delivery across regions. Together, they’ve built a culture of excellence, supported by a dedicated staff of trainers, groomers, and support personnel, all committed to making PetSewa a trusted name in pet care."
  },
  {
    title: "Fun Facts",
    img: "https://images.unsplash.com/photo-1450778869180-1a9d359ef1b6",
    text: "PetSewa’s journey is marked by impressive milestones that reflect our commitment to excellence. Since launching in 2020, we’ve cared for over 10,000 pets, from dogs and cats to exotic animals, earning a 95% customer satisfaction rate through consistent quality service. Our certification by the Pet Care Association validates our adherence to high industry standards, including hygiene, training, and ethical practices. We’ve also conducted over 500 free health camps, impacting underserved communities, and plan to double this effort by next year, showcasing our dedication to animal welfare."
  },
  {
    title: "Caring for Pets",
    img: "https://images.unsplash.com/photo-1600488984606-9c9f2cf9b667",
    text: "Our animal care services are designed to nurture every pet’s well-being with unmatched dedication. This image captures a moment of a veterinarian gently examining a dog, reflecting our hands-on approach. We use state-of-the-art tools and natural products to ensure safety and comfort during treatments. Our team conducts regular training to stay updated on the latest care techniques, from post-surgery recovery to behavioral therapy. With a focus on preventive care, we help pet owners avoid common health issues, making every visit a step toward a healthier pet life."
  },
  {
    title: "Ensuring Hygiene",
    img: "https://images.pexels.com/photos/4587999/pexels-photo-4587999.jpeg",
    text: "Hygiene is a cornerstone of pet health, and our bathing services exemplify this with love and expertise. This image shows a dog enjoying a gentle bath, a process we perform with eco-friendly shampoos and warm water to soothe their skin. Our groomers are trained to handle pets of all sizes and temperaments, ensuring a stress-free experience. We also offer nail trimming, ear cleaning, and fur brushing as part of our packages, all aimed at maintaining optimal hygiene. This service has delighted over 5,000 pet owners, boosting their pets’ confidence."
  }
];

document.querySelectorAll('.about-card').forEach(card=>{
  card.onclick = ()=>{
    const idx=Number(card.getAttribute('data-idx'))-1;
    if(idx<0 || idx>=aboutDetails.length)return;
    const modal=document.getElementById('about-detail-modal');
    const container=document.getElementById('detail-content');
    modal.classList.add('active');
    container.innerHTML = `
      <h2>${aboutDetails[idx].title}</h2>
      <img src="${aboutDetails[idx].img}" alt="${aboutDetails[idx].title} Image" class="detail-image"/>
      <p>${aboutDetails[idx].text}</p>
      <button class="close-detail alt-close-btn">Close</button>
    `;
  };
});
document.querySelectorAll('.close-detail, .alt-close-btn').forEach(btn=>{
  btn.onclick=()=>{
    document.getElementById('about-detail-modal').classList.remove('active');
  };
});
document.getElementById('about-detail-modal').onclick = (e) => {
  if (e.target.classList.contains('about-card-detail-modal')) {
    e.target.classList.remove('active');
  }
};

// Animal-background particles as in index
const canvas = document.getElementById('bg-animal-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 130;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  let particles = [];
  for(let i=0;i<34;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: 1.8 + Math.random()*2.4,
      dx: -0.41 + Math.random() * .82,
      dy: -0.13 + Math.random() * .11,
      c: `rgba(${190+Math.floor(Math.random()*60)},${255},${210+Math.floor(Math.random()*45)},.17)`
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