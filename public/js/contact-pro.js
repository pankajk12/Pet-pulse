document.querySelectorAll('.wow').forEach(el=>el.classList.add('shown'));
document.getElementById('contact-form').onsubmit=e=>{
  e.preventDefault();
  alert('Thank you! Your message is submitted. We will get back soon.');
  document.getElementById('contact-form').reset();
};
document.querySelector('.location-btn').onclick = (e) => {
  e.preventDefault();
  window.open("https://www.google.com/maps/place/Hauz+Khas,+New+Delhi,+Delhi/", "_blank");
}