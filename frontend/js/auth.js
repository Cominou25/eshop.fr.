const API_URL = 'http://localhost:5000/api';

// Toggle between login and register forms
function toggleAuthForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
  registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

// Register function
async function register() {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const errorDiv = document.getElementById('register-error');

  errorDiv.classList.remove('show');

  if (!username || !email || !password || !confirmPassword) {
    showError('register-error', 'Tous les champs sont obligatoires');
    return;
  }

  if (password !== confirmPassword) {
    showError('register-error', 'Les mots de passe ne correspondent pas');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      showError('register-error', data.message || 'Erreur lors de l\'inscription');
      return;
    }

    // Save token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Update UI
    updateAuthUI();
    showHome();

    // Clear form
    document.getElementById('register-username').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
  } catch (error) {
    showError('register-error', 'Erreur de connexion au serveur');
    console.error('Register error:', error);
  }
}

// Login function
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');

  errorDiv.classList.remove('show');

  if (!email || !password) {
    showError('login-error', 'Email et mot de passe sont obligatoires');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showError('login-error', data.message || 'Erreur de connexion');
      return;
    }

    // Save token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Update UI
    updateAuthUI();
    showHome();

    // Clear form
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
  } catch (error) {
    showError('login-error', 'Erreur de connexion au serveur');
    console.error('Login error:', error);
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  updateAuthUI();
  showHome();
}

// Update UI based on auth status
function updateAuthUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authLink = document.getElementById('auth-link');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');

  if (token && user.username) {
    authLink.style.display = 'none';
    userMenu.style.display = 'flex';
    userName.textContent = `Bienvenue, ${user.username}`;
  } else {
    authLink.style.display = 'block';
    userMenu.style.display = 'none';
  }
}

// Show error message
function showError(elementId, message) {
  const errorDiv = document.getElementById(elementId);
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
}

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);
