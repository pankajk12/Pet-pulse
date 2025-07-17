// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  let medicinesData = {};
  fetch('/data/medicines.csv')
    .then(res => res.text())
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: function(results) {
          results.data.forEach(row => {
            if(!medicinesData[row.animal]) medicinesData[row.animal] = [];
            medicinesData[row.animal].push({
              id: row.id, name: row.name, price: +row.price, originalPrice: +row.originalPrice,
              discount: row.discount, description: row.description, image: row.image
            });
          });
        }
      });
    });
  // Animal selection
  document.querySelectorAll('.animal-card').forEach(card => {
    card.addEventListener('click', () => {
      const animal = card.getAttribute('data-animal');
      document.querySelector('.animal-selection-section').classList.add('hidden');
      document.querySelector('.medicines-section').classList.remove('hidden');
      document.getElementById('selected-animal').textContent = animal.charAt(0).toUpperCase() + animal.slice(1);

      // Render medicines
      const medGrid = document.querySelector('.medicine-grid');
      medGrid.innerHTML = '';
      if(!medicinesData[animal]) {medGrid.textContent='No medicines.'; return;}
      medicinesData[animal].forEach(med => {
        const card = document.createElement('div');
        card.className = 'medicine-card wow';
        card.innerHTML = `
          <img src="${med.image}" alt="${med.name}">
          <h4>${med.name}</h4>
          <div class="price">₹${med.price}<span class="original-price">₹${med.originalPrice}</span><span class="discount">${med.discount}</span></div>
          <div class="description">${med.description}</div>
          <button class="btn add-to-cart" data-medicine-id="${med.id}">Add to Cart</button>
        `;
        medGrid.appendChild(card);
        // Pop-in animation
        setTimeout(()=>card.classList.add('shown'),100+Math.random()*200);
      });

      // Medicine modal open
      document.querySelectorAll('.medicine-card img, .medicine-card h4').forEach(el => {
        el.addEventListener('click', evt => {
          const med = medicinesData[animal].find(m => m.name === el.parentElement.querySelector('h4').textContent);
          openModal(med);
        });
      });
      // Add to cart
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', evt => {
          evt.stopPropagation();
          const medId = btn.getAttribute('data-medicine-id');
          const med = medicinesData[animal].find(m => m.id === medId);
          fetch('/cart/add', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              productId: med.id, name: med.name, price: med.price, quantity: 1
            })
          }).then(r=>r.json()).then(data=>{
            btn.textContent='✓ Added!';
            setTimeout(()=> btn.textContent='Add to Cart', 1400);
          });
        });
      });
    });
  });
  // Modal logic
  function openModal(med) {
    document.getElementById('modal-image').src = med.image;
    document.getElementById('modal-name').textContent = med.name;
    document.getElementById('modal-price').innerHTML = `₹${med.price} <span class="original-price">₹${med.originalPrice}</span>`;
    document.getElementById('modal-discount').textContent = med.discount;
    document.getElementById('modal-description').textContent = med.description;
    document.querySelector('.modal .add-to-cart').setAttribute('data-medicine-id', med.id);
    document.getElementById('medicine-modal').style.display='flex';
  }
  document.querySelector('.modal .close-btn').onclick = ()=> document.getElementById('medicine-modal').style.display='none';
  document.getElementById('back-to-animals').onclick = ()=> {
    document.querySelector('.animal-selection-section').classList.remove('hidden');
    document.querySelector('.medicines-section').classList.add('hidden');
  };
});