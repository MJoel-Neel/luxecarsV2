/* ============================================================
   LUXECARS — app.js
   All interactivity: cars data, cart, modals, forms, animations
   ============================================================ */

'use strict';

/* ── DATA ────────────────────────────────────────────────── */
const CARS = [
  {
    id: 1,
    brand: 'Lamborghini',
    name: 'Huracán EVO',
    category: 'sport',
    price: 280000,
    img: 'image/car1.jpg',
    badge: 'Nouveau',
    specs: { moteur: 'V10 5.2L', puissance: '640 ch', vitesse: '325 km/h', '0-100': '2.9 s' },
    desc: "Le Huracán EVO est l'incarnation de la philosophie Lamborghini : performances extrêmes enveloppées dans un design inoubliable. Son V10 atmosphérique signe des notes musicales inégalables."
  },
  {
    id: 2,
    brand: 'Ferrari',
    name: 'F8 Tributo',
    category: 'sport',
    price: 320000,
    img: 'image/car2.jpg',
    badge: 'Premium',
    specs: { moteur: 'V8 Turbo', puissance: '720 ch', vitesse: '340 km/h', '0-100': '2.9 s' },
    desc: "La F8 Tributo rend hommage aux moteurs V8 qui ont fait la légende de Ferrari. Un concentré de technologie de course adapté à la route, sublimé par des lignes Pininfarina au galbe parfait."
  },
  {
    id: 3,
    brand: 'Porsche',
    name: '911 GT3 RS',
    category: 'sport',
    price: 240000,
    img: 'image/car3.jpg',
    badge: 'Bestseller',
    specs: { moteur: 'Flat-6 4.0L', puissance: '525 ch', vitesse: '296 km/h', '0-100': '3.2 s' },
    desc: "La GT3 RS est l'ultime Porsche homologuée pour la route. Issue directement du programme GT de compétition, elle offre une connexion conducteur exceptionnelle sur route comme sur circuit."
  },
  {
    id: 4,
    brand: 'Bentley',
    name: 'Continental GT',
    category: 'berline',
    price: 230000,
    img: 'image/car4.jpg',
    badge: 'Luxe',
    specs: { moteur: 'W12 6.0L', puissance: '635 ch', vitesse: '333 km/h', '0-100': '3.6 s' },
    desc: "Le Continental GT allie puissance superlative et raffinement britannique à son paroxysme. Avec son W12 biturbo de 635 ch et son habitacle artisanal, il redéfinit la notion de Grand Tourisme."
  },
  {
    id: 5,
    brand: 'Rolls-Royce',
    name: 'Ghost Extended',
    category: 'berline',
    price: 420000,
    img: 'image/car5.jpg',
    badge: 'Exclusif',
    specs: { moteur: 'V12 6.75L', puissance: '571 ch', vitesse: '250 km/h', '0-100': '4.8 s' },
    desc: "La Ghost Extended redéfinit l'expression même du luxe automobile. Chaque millimètre carré de son habitacle est confectionné à la main par des artisans de Goodwood selon vos exigences les plus précises."
  },
  {
    id: 6,
    brand: 'Aston Martin',
    name: 'DBX 707',
    category: 'suv',
    price: 265000,
    img: 'image/car6.jpg',
    badge: 'SUV Sport',
    specs: { moteur: 'V8 Biturbo', puissance: '707 ch', vitesse: '310 km/h', '0-100': '3.3 s' },
    desc: "Le DBX 707 est le SUV le plus puissant jamais créé par Aston Martin. Il prouve qu'un SUV de luxe peut être aussi exaltant à conduire qu'un supercar, sans sacrifier le confort et l'espace."
  }
];

/* ── CART STATE ──────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('lc_cart') || '[]');

function saveCart() { localStorage.setItem('lc_cart', JSON.stringify(cart)); }

function getCartItem(id) { return cart.find(i => i.id === id); }

function addToCart(id, fromModal = false) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;
  const existing = getCartItem(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: car.id, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`${car.brand} ${car.name} ajouté au panier 🛒`);
  if (fromModal) closeModal('carModal');
}

function updateQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function checkout() {
  if (cart.length === 0) { showToast('Votre panier est vide.'); return; }
  showToast('Redirection vers le paiement sécurisé…');
  setTimeout(() => closeCart(), 1500);
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const car = CARS.find(c => c.id === item.id);
    return sum + (car ? car.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');
  const countEl   = document.getElementById('cartCount');

  // Count badge
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalQty;
  countEl.classList.toggle('visible', totalQty > 0);

  if (cart.length === 0) {
    emptyEl.style.display  = 'block';
    itemsEl.innerHTML      = '';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display  = 'none';
  footerEl.style.display = 'flex';
  totalEl.textContent    = fmtPrice(cartTotal());

  itemsEl.innerHTML = cart.map(item => {
    const car = CARS.find(c => c.id === item.id);
    if (!car) return '';
    return `
      <li class="cart-item">
        <div class="cart-item-img"><img src="${car.img}" alt="${car.name}" /></div>
        <div class="cart-item-info">
          <div class="cart-item-brand">${car.brand}</div>
          <div class="cart-item-name">${car.name}</div>
          <div class="cart-item-price">${fmtPrice(car.price)} / unité</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="updateQty(${car.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${car.id}, +1)">+</button>
            <small style="color:var(--gold);margin-left:8px;font-weight:700;">${fmtPrice(car.price * item.qty)}</small>
          </div>
        </div>
        <button class="cart-item-del" onclick="removeFromCart(${car.id})" title="Supprimer">✕</button>
      </li>`;
  }).join('');
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/* ── CARS GRID ───────────────────────────────────────────── */
function fmtPrice(p) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p);
}

function renderCars(filter = 'all') {
  const grid = document.getElementById('carsGrid');
  grid.innerHTML = CARS.map((car, i) => `
    <div class="car-card${filter !== 'all' && car.category !== filter ? ' hidden' : ''}"
         style="animation-delay:${i * .08}s"
         data-category="${car.category}"
         onclick="openCarModal(${car.id})">
      <div class="car-card-img">
        <img src="${car.img}" alt="${car.brand} ${car.name}" loading="lazy" />
        <span class="car-badge">${car.badge}</span>
      </div>
      <div class="car-card-body">
        <div class="car-brand">${car.brand}</div>
        <div class="car-name">${car.name}</div>
        <div class="car-specs">
          <span class="car-spec">${car.specs.puissance}</span>
          <span class="car-spec">${car.specs['0-100']}</span>
          <span class="car-spec">${car.specs.vitesse}</span>
        </div>
        <div class="car-footer">
          <div class="car-price">${fmtPrice(car.price)} <small>HT</small></div>
          <div class="car-actions" onclick="event.stopPropagation()">
            <button class="btn-view" onclick="openCarModal(${car.id})">Détails</button>
            <button class="btn-add-cart" onclick="addToCart(${car.id})">+ Panier</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.car-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── CAR MODAL ───────────────────────────────────────────── */
function openCarModal(id) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;

  const specsHtml = Object.entries(car.specs).map(([k, v]) => `
    <div class="spec-item">
      <div class="spec-label">${k}</div>
      <div class="spec-val">${v}</div>
    </div>`).join('');

  document.getElementById('carModalContent').innerHTML = `
    <img class="car-modal-img" src="${car.img}" alt="${car.name}" />
    <div class="car-modal-header">
      <div>
        <div class="car-modal-brand">${car.brand}</div>
        <div class="car-modal-title">${car.name}</div>
      </div>
      <div class="car-modal-price">${fmtPrice(car.price)}<small>Prix HT</small></div>
    </div>
    <div class="car-modal-specs">${specsHtml}</div>
    <p class="car-modal-desc">${car.desc}</p>
    <div class="car-modal-actions">
      <button class="btn-primary" onclick="addToCart(${car.id}, true)">Ajouter au Panier</button>
      <button class="btn-ghost" onclick="closeModal('carModal');openModal('contactModal')">Prendre RDV</button>
    </div>`;

  openModal('carModal');
}

/* ── MODALS ──────────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
// Close on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});
// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
    closeCart();
  }
});

/* ── AUTH TABS ───────────────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab' + cap(tab)).classList.add('active');
  document.getElementById('form' + cap(tab)).classList.add('active');
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ── FORM VALIDATION ─────────────────────────────────────── */
function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById('err-' + fieldId);
  if (field) field.classList.add('error');
  if (err)   err.textContent = msg;
}
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById('err-' + fieldId);
  if (field) field.classList.remove('error');
  if (err)   err.textContent = '';
}
function clearAllErrors(ids) { ids.forEach(id => clearError(id)); }

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email); }
function validatePhone(phone) { return /^[\+]?[\d\s\-\(\)]{8,15}$/.test(phone.trim()); }
function validatePassword(pw) { return pw.length >= 8; }
function validateName(name)   { return name.trim().length >= 2; }

// Login
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('lEmail').value;
  const pw    = document.getElementById('lPassword').value;
  let valid = true;
  clearAllErrors(['lEmail', 'lPassword']);

  if (!email)               { showError('lEmail', 'L\'email est requis.'); valid = false; }
  else if (!validateEmail(email)) { showError('lEmail', 'Format d\'email invalide.'); valid = false; }
  if (!pw)                  { showError('lPassword', 'Le mot de passe est requis.'); valid = false; }
  else if (!validatePassword(pw)) { showError('lPassword', 'Minimum 8 caractères.'); valid = false; }

  if (valid) {
    closeModal('loginModal');
    showToast('Bon retour ! Connexion réussie ✓');
    document.getElementById('loginBtn').textContent = 'Mon Compte';
  }
});

// Register
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const nom     = document.getElementById('rNom').value;
  const tel     = document.getElementById('rTel').value;
  const email   = document.getElementById('rEmail').value;
  const pw      = document.getElementById('rPassword').value;
  const confirm = document.getElementById('rConfirm').value;
  let valid = true;
  clearAllErrors(['rNom','rTel','rEmail','rPassword','rConfirm']);

  if (!validateName(nom))     { showError('rNom', 'Nom invalide (min. 2 caractères).'); valid = false; }
  if (!validatePhone(tel))    { showError('rTel', 'Numéro invalide.'); valid = false; }
  if (!validateEmail(email))  { showError('rEmail', 'Format d\'email invalide.'); valid = false; }
  if (!validatePassword(pw))  { showError('rPassword', 'Minimum 8 caractères requis.'); valid = false; }
  if (pw !== confirm)         { showError('rConfirm', 'Les mots de passe ne correspondent pas.'); valid = false; }

  if (valid) {
    closeModal('loginModal');
    showToast('Bienvenue dans la communauté LuxeCars ! 🎉');
    document.getElementById('loginBtn').textContent = 'Mon Compte';
  }
});

// Password strength
const pwInput = document.getElementById('rPassword');
if (pwInput) {
  pwInput.addEventListener('input', () => {
    const pw = pwInput.value;
    const bar = document.getElementById('pwBar');
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    const w = (score / 4) * 100;
    const c = score <= 1 ? '#c0392b' : score <= 2 ? '#e67e22' : score <= 3 ? '#f1c40f' : '#27ae60';
    bar.style.width = w + '%';
    bar.style.background = c;
  });
}

// Contact form
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const nom  = document.getElementById('cNom').value;
  const mail = document.getElementById('cEmail').value;
  const msg  = document.getElementById('cMessage').value;
  let valid = true;
  clearAllErrors(['cNom','cEmail','cMessage']);

  if (!validateName(nom))    { showError('cNom', 'Veuillez saisir votre nom.'); valid = false; }
  if (!validateEmail(mail))  { showError('cEmail', 'Email invalide.'); valid = false; }
  if (msg.trim().length < 10){ showError('cMessage', 'Message trop court (min. 10 caractères).'); valid = false; }

  if (valid) { showToast('Message envoyé ! Nous vous répondrons sous 24h ✓'); e.target.reset(); }
});

// RDV form
document.getElementById('rdvForm').addEventListener('submit', e => {
  e.preventDefault();
  const nom   = document.getElementById('rdvNom').value;
  const email = document.getElementById('rdvEmail').value;
  const date  = document.getElementById('rdvDate').value;
  let valid = true;
  clearAllErrors(['rdvNom','rdvEmail','rdvDate']);

  if (!validateName(nom))   { showError('rdvNom', 'Nom requis.'); valid = false; }
  if (!validateEmail(email)){ showError('rdvEmail', 'Email invalide.'); valid = false; }
  if (!date)                { showError('rdvDate', 'Veuillez choisir une date.'); valid = false; }
  else if (new Date(date) < new Date()) { showError('rdvDate', 'La date doit être dans le futur.'); valid = false; }

  if (valid) {
    closeModal('contactModal');
    showToast('Rendez-vous confirmé ! Un conseiller vous contactera ✓');
  }
});

// Live validation on blur
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) clearError(input.id);
  });
});

/* ── TOGGLE PASSWORD ─────────────────────────────────────── */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else                           { input.type = 'password'; btn.textContent = '👁'; }
}

/* ── FAQ ─────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── NAVBAR ──────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });

  // Close menu on nav click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  // Login btn
  document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
  document.getElementById('cartToggle').addEventListener('click', openCart);
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.feature-card, .faq-item, .ambitions-card, .contact-item, .footer-links, .about-text p'
  ).forEach(el => { el.classList.add('reveal'); obs.observe(el); });
}

/* ── SMOOTH SCROLL HELPER ────────────────────────────────── */
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── NEWSLETTER ──────────────────────────────────────────── */
function subscribeNewsletter() {
  const val = document.getElementById('nlEmail').value;
  if (!validateEmail(val)) { showToast('Veuillez saisir un email valide.'); return; }
  document.getElementById('nlEmail').value = '';
  showToast('Merci ! Vous êtes inscrit à notre newsletter ✓');
}

/* ── TOAST ───────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCars();
  renderCart();
  initFilters();
  initNavbar();
  initFAQ();
  initScrollReveal();
});
