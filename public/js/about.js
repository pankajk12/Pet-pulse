document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.about-card');
  const detailSections = document.querySelectorAll('.detail-section');

  // Show detailed section on card click
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      detailSections.forEach(section => section.classList.add('hidden'));
      document.getElementById(`detail-${index}`).classList.remove('hidden');

      // Hide grid
      document.querySelector('.about-grid').style.display = 'none';
    });
  });

  // Back button functionality (restore original grid)
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      detailSections.forEach(section => section.classList.add('hidden'));
      document.querySelector('.about-grid').style.display = 'grid';

      // No cards hidden, all show up
      cards.forEach(card => card.classList.remove('hidden'));
    });
  });

  // Animate cards on scroll
  function animateCards() {
    const visibleCards = document.querySelectorAll('.about-card:not(.hidden)');
    visibleCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (cardTop < windowHeight - 100) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }

  // Initial load
  animateCards();

  // Scroll event
  window.addEventListener('scroll', animateCards);

  // Responsive grid adjustment
  function adjustGrid() {
    const grid = document.querySelector('.about-grid');
    const width = window.innerWidth;
    if (width < 768) {
      grid.style.gridTemplateColumns = '1fr';
    } else {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    }
  }

  // Initial adjustment and resize
  adjustGrid();
  window.addEventListener('resize', adjustGrid);
});