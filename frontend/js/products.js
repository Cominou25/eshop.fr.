const API_URL = 'http://localhost:5000/api';
let products = [];

// Fetch products from server
async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    products = data;
    displayProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Display sample products if server is down
    displaySampleProducts();
  }
}

// Display sample products for demo
function displaySampleProducts() {
  products = [
    {
      id: 1,
      name: 'Laptop Pro',
      description: 'Ordinateur portable haute performance',
      price: 1299.99,
      stock: 5,
      image: '💻'
    },
    {
      id: 2,
      name: 'Smartphone X',
      description: 'Téléphone intelligent dernière génération',
      price: 899.99,
      stock: 10,
      image: '📱'
    },
    {
      id: 3,
      name: 'Casque Audio',
      description: 'Casque sans fil avec bruit cancellation',
      price: 299.99,
      stock: 15,
      image: '🎧'
    },
    {
      id: 4,
      name: 'Montre Connectée',
      description: 'Montre intelligente avec suivi de santé',
      price: 399.99,
      stock: 8,
      image: '⌚'
    },
    {
      id: 5,
      name: 'Tablette',
      description: 'Tablette tactile 10 pouces',
      price: 599.99,
      stock: 12,
      image: '📱'
    },
    {
      id: 6,
      name: 'Caméra 4K',
      description: 'Caméra vidéo 4K professionnelle',
      price: 1499.99,
      stock: 3,
      image: '📷'
    }
  ];
  displayProducts();
}

// Display products on the page
function displayProducts() {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">${product.image || '📦'}</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description || ''}</div>
        <div class="product-price">${product.price.toFixed(2)} €</div>
        <div class="product-stock">Stock: ${product.stock} articles</div>
        <button class="btn btn-primary btn-small btn-add-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
          ${product.stock === 0 ? 'En rupture' : 'Ajouter au panier'}
        </button>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} a été ajouté au panier!`);
}

// Load products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);
