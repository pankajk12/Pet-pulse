document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const cards = document.querySelectorAll('.contact-card');

  // Form submission handling
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const subject = form.querySelector('#subject').value;
      const message = form.querySelector('#message').value;

      if (name && email && subject && message) {
        alert(`Thank you, ${name}! Your message has been sent.\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`);
        form.reset();
      } else {
        alert('Please fill all fields!');
      }
    });
  }

  // Card animation on hover
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)';
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});