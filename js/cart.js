/* Cart handling script for Oxi website
 * Stores cart items in localStorage and provides helper functions
 */

const CART_KEY = 'oxi_cart';

// Retrieve cart from localStorage or initialize empty array
function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// Add product to cart
function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  alert('Added to cart!');
}

// Remove product from cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

// Update quantity of an item
function updateQuantity(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
  }
  saveCart(cart);
  renderCart();
}

// Calculate total price
function calculateTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Update cart count shown in header
function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (!countEl) return;
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;
}

// Render cart items on cart page
function renderCart() {
  const container = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    if (summaryEl) summaryEl.innerHTML = '';
    return;
  }
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="display:flex;align-items:center;">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-name">${item.name}<br><small>$${item.price.toFixed(2)}</small></div>
      </div>
      <div class="cart-item-qty">
        <input type="number" min="1" value="${item.qty}" onchange="updateQuantity('${item.id}', parseInt(this.value))">
      </div>
      <div>$${(item.price * item.qty).toFixed(2)}</div>
      <button class="btn" onclick="removeFromCart('${item.id}')">Remove</button>
    `;
    container.appendChild(row);
  });
  if (summaryEl) {
    summaryEl.innerHTML = `Total: $${calculateTotal().toFixed(2)}`;
  }
}

// Fake payment processing on checkout
function placeOrder(event) {
  event.preventDefault();
  // In a real implementation, integrate with payment gateway.
  // Here we just simulate success.
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  window.location.href = 'thankyou.html';
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
