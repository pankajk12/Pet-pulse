// Define a placeholder image URL for missing/invalid medicine images
const PLACEHOLDER_IMG = "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png";

document.addEventListener('DOMContentLoaded', () => {
  // Store medicines data by animal type
  let medicinesData = {};

  // Fetch CSV data using PapaParse library
  fetch('/data/medicines.csv')
    .then(response => {
      if (!response.ok) throw new Error('CSV file not found');
      return response.text();
    })
    .then(csvText => {
      // Parse CSV with PapaParse
      Papa.parse(csvText, {
        header: true, 
        skipEmptyLines: true,
        complete: function (results) {
          // Group data by animal type
          results.data.forEach(row => {
            const animal = row.animal;
            if (!medicinesData[animal]) {
              medicinesData[animal] = [];
            }
            medicinesData[animal].push({
              id: row.id,
              name: row.name,
              price: parseInt(row.price),
              originalPrice: parseInt(row.originalPrice),
              discount: row.discount,
              description: row.description,
              image: row.image
            });
          });

          // Initialize animal cards functionality
          setupAnimalCards();
        },
        error: function (error) {
          console.error('PapaParse error:', error);
          alert('Error parsing CSV file.');
        }
      });
    })
    .catch(error => {
      console.error('Error fetching CSV:', error);
      alert('Medicines data could not be loaded. Please try again.');
    });

  // Setup animal cards and medicine display functionality
  function setupAnimalCards() {
    // Handle click or keyboard navigation on animal cards
    document.querySelectorAll('.animal-card').forEach(card => {
      card.addEventListener('click', () => showAnimalMedicines(card));
      card.addEventListener('keydown', e => { 
        if (e.key === 'Enter') showAnimalMedicines(card); 
      });
    });

    // Back button functionality
    document.getElementById('back-to-animals').addEventListener('click', showAnimals);

    // Modal close functionality
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal();
      }
    });
  }

  // Show medicines for selected animal
  function showAnimalMedicines(card) {
    const animal = card.getAttribute('data-animal');
    document.getElementById('animal-selection').classList.add('hidden');
    document.getElementById('medicines').classList.remove('hidden');
    document.getElementById('selected-animal').textContent = animal.charAt(0).toUpperCase() + animal.slice(1);

    // Populate medicines grid
    const medicineGrid = document.querySelector('.medicine-grid');
    medicineGrid.innerHTML = '';
    
    // Handle case where no medicines exist for this animal
    if (!medicinesData[animal] || medicinesData[animal].length === 0) {
      medicineGrid.innerHTML = '<p class="no-medicines">No medicines available for this animal.</p>';
      return;
    }
    
    // Create medicine cards
    medicinesData[animal].forEach(med => {
      const card = document.createElement('div');
      card.classList.add('medicine-card');
      card.tabIndex = 0; // Make focusable for accessibility
      card.innerHTML = `
        <img src="${med.image || PLACEHOLDER_IMG}" alt="${med.name}" onerror="this.src='${PLACEHOLDER_IMG}';" />
        <div class="content">
          <h3>${med.name}</h3>
          <p class="price">₹${med.price}</p>
          <p class="original-price">₹${med.originalPrice}</p>
          <p class="discount">${med.discount}</p>
          <button class="cta-button add-to-cart" data-medicine-id="${med.id}">Add to Cart</button>
        </div>
      `;
      medicineGrid.appendChild(card);
    });

    // Add event listeners to medicine cards for modal and cart
    setupMedicineCardListeners(animal);
  }

  // Show animal selection screen
  function showAnimals() {
    document.getElementById('animal-selection').classList.remove('hidden');
    document.getElementById('medicines').classList.add('hidden');
  }

  // Setup event listeners for medicine cards
  function setupMedicineCardListeners(animal) {
    // Medicine card click for modal
    document.querySelectorAll('.medicine-card').forEach(card => {
      // Open modal on click (except for add to cart button)
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) return;
        const medId = card.querySelector('.add-to-cart').getAttribute('data-medicine-id');
        openModal(animal, medId);
      });
      
      // Keyboard accessibility for modal
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const medId = card.querySelector('.add-to-cart').getAttribute('data-medicine-id');
          openModal(animal, medId);
        }
      });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal from opening
        const medId = btn.getAttribute('data-medicine-id');
        const med = medicinesData[animal].find(m => m.id === medId);
        addToCart(med);
      });
    });
  }

  // Open medicine detail modal
  function openModal(animal, medId) {
    const med = medicinesData[animal].find(m => m.id === medId);
    if (!med) return;
    
    const modalImg = document.getElementById('modal-image');
    modalImg.src = med.image || PLACEHOLDER_IMG;
    modalImg.onerror = function() { this.src = PLACEHOLDER_IMG; };
    document.getElementById('modal-name').textContent = med.name;
    document.getElementById('modal-price').textContent = `Price: ₹${med.price}`;
    document.getElementById('modal-discount').textContent = `Discount: ${med.discount}`;
    document.getElementById('modal-description').textContent = med.description;
    
    const addToCartBtn = document.getElementById('medicine-modal').querySelector('.add-to-cart');
    addToCartBtn.setAttribute('data-medicine-id', medId);
    
    // Add to cart from modal
    addToCartBtn.onclick = function() {
      addToCart(med);
    };
    
    document.getElementById('medicine-modal').style.display = 'flex';
  }

  // Close medicine detail modal
  function closeModal() {
    document.getElementById('medicine-modal').style.display = 'none';
  }

  // Add medicine to cart
  function addToCart(med) {
    fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: med.id,
        name: med.name,
        price: med.price,
        quantity: 1
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`${med.name} added to cart!`);
          // You could update a cart counter in the navbar here if needed
        } else {
          alert('Login required or error adding to cart!');
        }
      })
      .catch(() => {
        alert('Failed to add to cart. Please try again.');
      });
  }
});
