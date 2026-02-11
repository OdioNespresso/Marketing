const CART_KEY = 'easy_culinary_cart';

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function showAlert(text = 'Producto añadido al carrito') {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert';
  alertBox.textContent = text;

  document.body.appendChild(alertBox);

  setTimeout(() => alertBox.classList.add('show'), 10);
  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => alertBox.remove(), 300);
  }, 2000);
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ ...product, cantidad: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showAlert();
}

function decreaseItem(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.cantidad -= 1;

  if (item.cantidad <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
    showAlert('Producto eliminado');
  }

  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

function increaseItem(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.cantidad += 1;

  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = total;
}

function renderCartPage() {
  const container = document.querySelector('#cart-items');
  const totalSpan = document.querySelector('#cart-total');

  if (!container || !totalSpan) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="texto-centro" style="opacity:0.7;">Tu carrito está vacío.</p>';
    totalSpan.textContent = '0 €';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-info">
        <strong>${item.nombre}</strong><br>
        <span>Precio: ${item.precio} €</span>
      </div>

      <div class="cart-qty">
        <button class="btn-small qty-btn" onclick="decreaseItem('${item.id}')">−</button>
        <span class="qty-num">${item.cantidad}</span>
        <button class="btn-small qty-btn" onclick="increaseItem('${item.id}')">+</button>
      </div>

      <div class="cart-subtotal">
        Subtotal: ${subtotal} €
      </div>
    `;
    container.appendChild(div);
  });

  totalSpan.textContent = total + ' €';
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-add-cart]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        precio: parseFloat(btn.dataset.precio)
      };
      addToCart(product);
    });
  });

  updateCartCount();
  renderCartPage();
});
