document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode Toggle
  const toggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    toggle.textContent = '🌙';
  }
  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    toggle.textContent = body.classList.contains('dark-mode') ? '🌙' : '☀️';
    localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  });

  // User Login State
  const userLogo = document.getElementById('user-logo');
  const loginLink = document.getElementById('login-link');
  if (localStorage.getItem('user')) {
    userLogo.classList.remove('hidden');
    loginLink.textContent = 'Logout';
    loginLink.href = '#';
    loginLink.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.reload();
    });
  }

  // Modal Handling
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      document.getElementById(modalId).style.display = 'flex';
    });
  });

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate').forEach(el => observer.observe(el));
});