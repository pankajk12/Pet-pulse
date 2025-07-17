document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.onclick = () => {
    document.getElementById('grooming-details').classList.remove('hidden');
    document.querySelector('.services-grid-section').style.display='none';
    window.scrollTo(0,document.getElementById('grooming-details').offsetTop-50);
  }
});
document.querySelector('.grooming-details .back-btn').onclick = () => {
  document.getElementById('grooming-details').classList.add('hidden');
  document.querySelector('.services-grid-section').style.display='block';
};
[...document.querySelectorAll('.book-btn')].forEach(btn => {
  btn.onclick = () => {
    document.getElementById('booking-modal').style.display='flex';
    document.getElementById('modal-service').textContent = btn.closest('.service-card').querySelector('h3').textContent;
  }
});
document.querySelector('.close-btn').onclick = ()=> document.getElementById('booking-modal').style.display='none';
document.getElementById('booking-form').onsubmit = e => {
  e.preventDefault();
  document.getElementById('booking-modal').style.display='none';
  alert('Booking confirmed!');
};
// Simple pop-in reveal
window.addEventListener('scroll',()=>{
  document.querySelectorAll('.wow').forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight - 60)
      el.classList.add('shown');
  });
});