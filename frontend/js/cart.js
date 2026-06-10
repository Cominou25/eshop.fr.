// Display cart items
function displayCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
    cartTotalSpan.textContent = '0.00';
    return;
  }

  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toFixed(2)} €</div>
      </div>
      <div class="cart-item-quantity">
        <button onclick="decreaseQuantity(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
      <div>Sous-total: ${itemTotal.toFixed(2)} €</div>
      <button class="btn-remove" onclick="removeFromCart(${index})">Supprimer</button>
    `;
    cartItemsDiv.appendChild(cartItem);
  });

  cartTotalSpan.textContent = total.toFixed(2);
}

// Increase quantity
function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart[index]) {
    cart[index].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
  }
}

// Decrease quantity
function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
  }
}

// Remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

// Checkout
function checkout() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Veuillez vous connecter pour procéder au paiement');
    showAuth();
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) {
    alert('Votre panier est vide');
    return;
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // For demo, just show a success message
  alert(`Commande confirmée!\nTotal: ${total.toFixed(2)} €\n\nMerci pour votre achat!`);

  // Clear cart
  localStorage.removeItem('cart');
  displayCart();
  showHome();
}
