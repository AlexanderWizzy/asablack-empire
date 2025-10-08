// script.js - Final polished interactivity with validation + toasts

document.addEventListener('DOMContentLoaded', () => {
  /* ----------------- Elements ----------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const imageModal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const contactForm = document.getElementById('contact-form');
  const yearEl = document.getElementById('year');
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  /* ----------------- Helpers ----------------- */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function setError(input, message) {
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('error-message')) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      input.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.textContent = message;
    input.classList.add('invalid');
  }

  function clearError(input) {
    let errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains('error-message')) {
      errorEl.textContent = '';
    }
    input.classList.remove('invalid');
  }

  /* ----------------- Set year ----------------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------- Mobile nav toggle ----------------- */
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('active');
  });

  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------------- Theme toggle ----------------- */
  const savedTheme = localStorage.getItem('materialStoreTheme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    if (themeToggle) themeToggle.textContent = '🌙';
  }

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('materialStoreTheme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });

  /* ----------------- Product details toggle ----------------- */
  const productCards = Array.from(document.querySelectorAll('.product'));
  productCards.forEach(card => {
    const details = document.createElement('div');
    details.className = 'product-details';
    const name = card.dataset.name || '';
    const price = card.dataset.price || card.querySelector('.price')?.textContent || '';
    const sku = card.dataset.sku || '';
    const desc = card.dataset.desc || 'High-quality material, perfect for many uses.';
    details.innerHTML = `
      <p><strong>${name}</strong> — ${desc}</p>
      <p><strong>SKU:</strong> ${sku} <span style="margin-left:1rem; font-weight:700; color:var(--accent)">${price}</span></p>
    `;
    details.style.maxHeight = '0';
    details.style.overflow = 'hidden';
    details.style.transition = 'max-height 320ms ease, padding 320ms ease';
    details.style.padding = '0';
    card.appendChild(details);

    card.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'img' || e.target.classList.contains('buy-btn')) return;
      const isOpen = details.style.maxHeight && details.style.maxHeight !== '0px';
      details.style.maxHeight = isOpen ? '0' : details.scrollHeight + 20 + 'px';
      details.style.padding = isOpen ? '0' : '0.6rem 0';
    });

    const buyBtn = card.querySelector('.buy-btn');
    buyBtn?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const isOpen = details.style.maxHeight && details.style.maxHeight !== '0px';
      details.style.maxHeight = isOpen ? '0' : details.scrollHeight + 20 + 'px';
      details.style.padding = isOpen ? '0' : '0.6rem 0';
    });
  });

  // Get modal
const modal = document.getElementById("productModal");
const closeBtn = document.querySelector(".close");

// Attach click event to each button
document.querySelectorAll(".details-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    const product = this.parentElement;

    // Fill modal with product data
    document.getElementById("modalName").textContent = product.dataset.name;
    document.getElementById("modalPrice").textContent = product.dataset.price;
    document.getElementById("modalDesc").textContent = product.dataset.desc;
    document.getElementById("modalImage").src = product.querySelector("img").src;

    // Show modal
    modal.style.display = "block";
  });
});

// Close modal
closeBtn.onclick = () => modal.style.display = "none";

// Close modal when clicking outside
window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

  /* ----------------- Contact form validation + toast ----------------- */
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const message = contactForm.querySelector('[name="message"]');

    let valid = true;
    if (!name.value.trim()) {
      setError(name, 'Name is required.');
      valid = false;
    } else clearError(name);

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, 'Valid email is required.');
      valid = false;
    } else clearError(email);

    if (!message.value.trim()) {
      setError(message, 'Message cannot be empty.');
      valid = false;
    } else clearError(message);

    if (!valid) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    showToast(`Thanks ${name.value}! (Demo) Your message was recorded.`, 'success');
    contactForm.reset();
  });

  /* ----------------- Smooth scroll ----------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------- Reveal on scroll ----------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
});
// script.js - Final polished interactivity with validation + toasts

const imageInput = document.getElementById("imageInput");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDesc = document.getElementById("productDesc");
const uploadBtn = document.getElementById("uploadBtn");
const gallery = document.getElementById("gallery");

uploadBtn.addEventListener("click", () => {
  const file = imageInput.files[0];
  const name = productName.value.trim();
  const price = productPrice.value.trim();
  const desc = productDesc.value.trim();

  if (!file || !name || !price || !desc) {
    alert("Please fill all fields and upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${e.target.result}" alt="${name}">
      <h3>${name}</h3>
      <p class="price">${price}</p>
      <p class="desc">${desc}</p>
      <button class="delete-btn">&times;</button>
    `;

    gallery.appendChild(productCard);

    // delete button function
    productCard.querySelector(".delete-btn").addEventListener("click", () => {
      productCard.remove();
    });
  };
  reader.readAsDataURL(file);

  // clear inputs
  imageInput.value = "";
  productName.value = "";
  productPrice.value = "";
  productDesc.value = "";
});
