// Show section based on ID
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.style.display = 'none');
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
}

// Navigate to home
function showHome() {
  showSection('home-section');
}

// Navigate to products
function showProducts() {
  showSection('products-section');
  displayProducts();
}

// Navigate to cart
function showCart() {
  showSection('cart-section');
  displayCart();
}

// Navigate to auth
function showAuth() {
  showSection('auth-section');
  // Reset forms
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('register-error').classList.remove('show');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  showHome();
  updateAuthUI();
  
  // Fetch products in background
  fetchProducts();
});
