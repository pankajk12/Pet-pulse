document.addEventListener('DOMContentLoaded', () => {
  // Emergency Form
  const emergencyForm = document.getElementById('emergency-form');
  if (emergencyForm) {
    emergencyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('emergency-type').value;
      const details = document.getElementById('emergency-details').value;
      const image = document.getElementById('emergency-image').files[0];
      if (type && details) {
        alert(`Emergency submitted!\nType: ${type}\nDetails: ${details}${image ? '\nImage uploaded' : ''}`);
        emergencyForm.reset();
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('location-status').textContent = 'Location not shared';
      } else {
        alert('Please fill all required fields.');
      }
    });

    document.getElementById('emergency-image').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          document.getElementById('image-preview').innerHTML = `<img src="${reader.result}" alt="Preview" />`;
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('share-location').addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            document.getElementById('location-status').textContent = `Location shared: ${position.coords.latitude}, ${position.coords.longitude}`;
          },
          () => {
            document.getElementById('location-status').textContent = 'Unable to access location';
          }
        );
      } else {
        document.getElementById('location-status').textContent = 'Geolocation not supported';
      }
    });
  }

  // Grooming Form
  const groomingForm = document.getElementById('grooming-form');
  if (groomingForm) {
    groomingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('grooming-date').value;
      const time = document.getElementById('grooming-time').value;
      const package = document.querySelector('input[name="package"]:checked').value;
      if (date && time && package) {
        alert(`Grooming booked for ${date} at ${time}! Package: ${package}`);
        groomingForm.reset();
        document.getElementById('grooming-modal').style.display = 'none';
      } else {
        alert('Please fill all required fields.');
      }
    });
  }

  // Modal Handling
  document.querySelectorAll('.open-modal').forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal');
      document.getElementById(modalId).style.display = 'flex';
    });
  });

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Service Card Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
  });

  // Random Animated Animals
  const animals = ['dog', 'cat', 'cow', 'buffalo', 'goat'];
  function createAnimal() {
    const animalType = animals[Math.floor(Math.random() * animals.length)];
    const animal = document.createElement('div');
    animal.classList.add('animal', animalType);
    animal.style.top = `${Math.random() * 80 + 10}vh`;
    document.getElementById('animated-animals').appendChild(animal);
    setTimeout(() => animal.remove(), 8000);
  }

  setInterval(createAnimal, 3000 + Math.random() * 2000);
});