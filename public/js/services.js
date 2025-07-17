(function () {
  // Helper for section show/hide
  function showGroomingDetails() {
    const servicesSection = document.getElementById('services');
    const groomingSection = document.getElementById('grooming-details');
    if (servicesSection) servicesSection.classList.add('hidden');
    if (groomingSection) {
      groomingSection.classList.remove('hidden');
      groomingSection.classList.add('active');
      // accessibility improvement: focus main heading
      groomingSection.querySelector('h2')?.focus();
    }
  }
  
  function hideGroomingDetails() {
    const servicesSection = document.getElementById('services');
    const groomingSection = document.getElementById('grooming-details');
    if (servicesSection) servicesSection.classList.remove('hidden');
    if (groomingSection) {
      groomingSection.classList.remove('active');
      groomingSection.classList.add('hidden');
      // refocus the card
      document.querySelector('[data-service="grooming"] .expand-btn')?.focus();
    }
  }
  
  // Expose functions globally
  window.showGroomingDetails = showGroomingDetails;
  window.hideGroomingDetails = hideGroomingDetails;

  document.addEventListener('DOMContentLoaded', function () {
    // Animate cards on load
    const allCards = document.querySelectorAll('.service-card, .sub-card');
    allCards.forEach((card, index) => {
      card.style.setProperty('--order', index);
      if (card.classList.contains('sub-card')) {
        card.style.setProperty('--sub-order', index % 5);
      }
    });

    // Modal mechanics
    const bookingModal = document.getElementById('booking-modal');
    const bookingForm = document.getElementById('booking-form');
    const modalServiceText = document.getElementById('modal-service');

    // Open modal on any .book-btn click, pull service name
    document.querySelectorAll('.book-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceCard = btn.closest('.service-card, .sub-card');
        if (!serviceCard) return;
        
        const service = serviceCard.getAttribute('data-service') || 'Service';
        modalServiceText.textContent = service.charAt(0).toUpperCase() + service.slice(1) + 
          (service.toLowerCase().includes("consult") ? "" : " Service");
        
        bookingModal.style.display = 'flex';
        // Move focus for accessibility
        setTimeout(() => document.querySelector('#booking-form input')?.focus(), 200);
      });
    });

    // Booking form submission
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        
        if (date && time) {
          alert(`Booking confirmed for ${date} at ${time}!\nThank you for choosing PetSewa.`);
          bookingForm.reset();
          bookingModal.style.display = 'none';
        } else {
          alert('Please select both date and time.');
        }
      });
    }

    // Close modal (X button)
    document.querySelector('.close-btn')?.addEventListener('click', () => {
      bookingModal.style.display = 'none';
    });

    // Close modal if clicked outside content
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });

    // Escape key closes modals/sections
    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        // Close booking modal
        if (bookingModal?.style.display === 'flex') {
          bookingModal.style.display = 'none';
        }
        // Hide grooming details section if active
        if (document.getElementById('grooming-details')?.classList.contains('active')) {
          hideGroomingDetails();
        }
      }
    });
  });
})();
