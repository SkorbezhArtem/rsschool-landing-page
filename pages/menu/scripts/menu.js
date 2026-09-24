let products = [];
let currentCategory = 'coffee';

const cardsList = document.querySelector('.menu-cards__list');
const switchContainer = document.querySelector('.menu-container__switch');

function createCardElement(product, indexWithinCategory, globalIndex) {
  const template = document.createElement('template');
  template.innerHTML = `
    <li class="menu-cards__item" data-id="${globalIndex}">
      <article class="menu-card" tabindex="0" role="button" aria-label="${product.name}, price $${product.price}">
        <div class="menu-card__image-container">
          <img class="menu-card__image" src="../../assets/images/menu/cards/${product.category}-${indexWithinCategory + 1}.jpg" alt="${product.name}" loading="lazy">
        </div>
        <div class="menu-card__description">
          <h3 class="card-description__title">${product.name}</h3>
          <p class="card-description__text">${product.description}</p>
          <span class="card-description__price">$${product.price}</span>
        </div>
      </article>
    </li>
  `.trim();
  return template.content.firstElementChild;
}

function renderCards(category = 'coffee') {
  if (!cardsList) return;

  const fragment = document.createDocumentFragment();
  let indexWithinCategory = 0;

  products.forEach((product, globalIndex) => {
    if (product.category === category) {
      fragment.appendChild(createCardElement(product, indexWithinCategory, globalIndex));
      indexWithinCategory++;
    }
  });

  cardsList.replaceChildren(fragment);
}

function initCategorySwitch() {
  if (!switchContainer) return;

  switchContainer.querySelectorAll('.menu-switch__item').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
  });

  switchContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.menu-switch__item');
    if (!button || button.classList.contains('active')) return;

    const category = button.dataset.category;
    if (!category || category === currentCategory) return;

    switchContainer.querySelectorAll('.menu-switch__item').forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    currentCategory = category;
    renderCards(currentCategory);
  });
}

async function loadProducts() {
  try {
    const res = await fetch('../../data/products.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    products = await res.json();
    renderCards(currentCategory);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

function initMenu() {
  initCategorySwitch();
  loadProducts();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initMenu)
  : initMenu();
