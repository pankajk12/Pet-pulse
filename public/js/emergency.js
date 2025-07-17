document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.emergency-card');
  const detailSections = document.querySelectorAll('.detail-section');
  const form = document.getElementById('emergency-form');
  const callBtn = document.querySelector('.call-btn');

  // Show detailed section only for Emergency Care (index 3) on click
  cards.forEach(card => {
    if (card.getAttribute('data-index') === '3') {
      card.addEventListener('click', () => {
        detailSections.forEach(section => section.classList.add('hidden'));
        document.getElementById(`detail-${card.getAttribute('data-index')}`).classList.remove('hidden');
        document.querySelector('.emergency-grid').style.display = 'none';
      });
    }
  });

  // Back button functionality
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      detailSections.forEach(section => section.classList.add('hidden'));
      document.querySelector('.emergency-grid').style.display = 'grid';
      form.reset(); // Reset form on back
    });
  });

  // Simulate call action
  callBtn.addEventListener('click', () => {
    alert('Calling Emergency Hotline: +91-9876543210...');
    window.location.href = 'tel:+919876543210';
  });

  // Form submission handling
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.getElementById('location').value;
    const image = document.getElementById('image').files[0];
    const details = document.getElementById('details').value;
    const condition = document.getElementById('condition').value;

    if (location && image && details && condition) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const previewImage = e.target.result;
        alert(`Emergency Submitted!\nLocation: ${location}\nCondition: ${condition}\nDetails: ${details}\nImage Uploaded!`);
        form.reset();
      };
      reader.readAsDataURL(image);
    } else {
      alert('Please fill all fields and upload an image!');
    }
  });

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