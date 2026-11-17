// Data Menu Kedai Kopi
const menuData = [
  {
    id: 1,
    name: "Espresso Tubruk Klasik",
    category: "panas",
    price: 18000,
    emoji: "☕",
    desc: "Ekstraksi kopi robusta Jawa Timur pekat dengan aroma karamel alami."
  },
  {
    id: 2,
    name: "Caffe Latte Hangat",
    category: "panas",
    price: 25000,
    emoji: "🥛",
    desc: "Perpaduan espresso arabika dan susu segar steamed bertekstur lembut."
  },
  {
    id: 3,
    name: "Es Kopi Susu Senja",
    category: "dingin",
    price: 22000,
    emoji: "🧊",
    desc: "Menu favorit dengan gula aren organik, espresso, dan susu creamy."
  },
  {
    id: 4,
    name: "Cold Brew Citrus",
    category: "dingin",
    price: 26000,
    emoji: "🍊",
    desc: "Kopi seduh dingin 12 jam dengan sentuhan segar irisan jeruk sunkist."
  },
  {
    id: 5,
    name: "Matcha Uji Latte",
    category: "non-kopi",
    price: 28000,
    emoji: "🍵",
    desc: "Bubuk teh hijau Jepang autentik berpadu dengan susu segar."
  },
  {
    id: 6,
    name: "Cokelat Klasik Belgia",
    category: "non-kopi",
    price: 25000,
    emoji: "🍫",
    desc: "Minuman cokelat pekat dengan rasa manis yang seimbang."
  },
  {
    id: 7,
    name: "Butter Croissant",
    category: "pastry",
    price: 20000,
    emoji: "🥐",
    desc: "Pastry renyah berlapis mentega Prancis, dipanggang segar setiap pagi."
  },
  {
    id: 8,
    name: "Cinnamon Roll",
    category: "pastry",
    price: 23000,
    emoji: "🥨",
    desc: "Roti gulung kayu manis hangat dengan lapisan krim keju lembut."
  }
];

let cart = [];

// Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

// Render Daftar Menu
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderMenu(category = 'all') {
  menuGrid.innerHTML = '';
  const filtered = category === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === category);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div>
        <div class="menu-emoji">${item.emoji}</div>
        <span class="menu-category">${item.category}</span>
        <h3>${item.name}</h3>
        <p class="menu-desc">${item.desc}</p>
      </div>
      <div class="menu-footer">
        <span class="price">${formatRupiah(item.price)}</span>
        <button class="add-btn" onclick="addToCart(${item.id})">+ Tambah</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Filter Kategori Event
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.category);
  });
});

// Logika Keranjang Belanja
window.addToCart = function(id) {
  const product = menuData.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
};

window.changeQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
};

function updateCartUI() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('subtotal-price');
  const taxEl = document.getElementById('tax-price');
  const totalEl = document.getElementById('total-price');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalQty;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
    subtotalEl.textContent = 'Rp 0';
    taxEl.textContent = 'Rp 0';
    totalEl.textContent = 'Rp 0';
    return;
  }

  cartItemsEl.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div style="font-size: 0.85rem; color: #6e5d52;">${formatRupiah(item.price)}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  subtotalEl.textContent = formatRupiah(subtotal);
  taxEl.textContent = formatRupiah(tax);
  totalEl.textContent = formatRupiah(total);
}

// Buka & Tutup Drawer Keranjang
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');

document.getElementById('cart-btn').addEventListener('click', () => {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
});

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

document.getElementById('close-cart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Simulasi Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Silakan pilih menu terlebih dahulu.');
    return;
  }
  const orderNumber = Math.floor(100 + Math.random() * 900);
  alert(`Terima kasih! Pesanan #${orderNumber} sedang disiapkan oleh barista kami.`);
  cart = [];
  updateCartUI();
  closeCart();
});

// Inisialisasi Tampilan Awal
renderMenu();
