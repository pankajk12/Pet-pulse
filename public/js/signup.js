document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const errorContainer = document.getElementById('error-container');
  
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous error messages
      if (errorContainer) {
        errorContainer.innerHTML = '';
        errorContainer.style.display = 'none';
      }
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      try {
        const response = await fetch('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword })
        });
        
        if (response.ok) {
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            const data = await response.json();
            window.location.href = '/login?message=' + encodeURIComponent('Account created successfully! Please log in.');
          }
        } else {
          const errorData = await response.json();
          if (errorContainer) {
            errorContainer.innerHTML = `<div class="alert alert-danger">${errorData.message || 'An error occurred during signup.'}</div>`;
            errorContainer.style.display = 'block';
          }
        }
      } catch (error) {
        console.error('Signup error:', error);
        if (errorContainer) {
          errorContainer.innerHTML = '<div class="alert alert-danger">Network error. Please try again later.</div>';
          errorContainer.style.display = 'block';
        }
      }
    });
  }
});
