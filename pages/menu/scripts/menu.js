const MOBILE_BREAKPOINT = 768;
const INITIAL_MOBILE_LIMIT = 4;

let products = [];
let currentCategory = 'coffee';
let isExpanded = false;

const cardsList = document.querySelector('.menu-cards__list');
const switchContainer = document.querySelector('.menu-container__switch');
const loadContainer = document.querySelector('.load-container');
const loadButton = document.querySelector('.load-arrow');

function getCategoryProducts(category) {
  const result = [];
  products.forEach((product, globalIndex) => {
    if (product.category === category) {
      result.push({ product, globalIndex });
    }
  });
  return result;
}

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

function updateLoadMoreButton(categoryItemsCount) {
  if (!loadContainer) return;
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const shouldShow = isMobile && !isExpanded && categoryItemsCount > INITIAL_MOBILE_LIMIT;
  loadContainer.classList.toggle('invisible', !shouldShow);
}

function renderCards(category = currentCategory) {
  if (!cardsList) return;

  const categoryItems = getCategoryProducts(category);
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const itemsToRender = (isMobile && !isExpanded)
    ? categoryItems.slice(0, INITIAL_MOBILE_LIMIT)
    : categoryItems;

  const fragment = document.createDocumentFragment();
  itemsToRender.forEach(({ product, globalIndex }, indexWithinCategory) => {
    fragment.appendChild(createCardElement(product, indexWithinCategory, globalIndex));
  });

  cardsList.replaceChildren(fragment);
  updateLoadMoreButton(categoryItems.length);
}

function initLoadMore() {
  if (!loadButton) return;

  loadButton.addEventListener('click', () => {
    isExpanded = true;
    const categoryItems = getCategoryProducts(currentCategory);
    const remainingItems = categoryItems.slice(INITIAL_MOBILE_LIMIT);

    const fragment = document.createDocumentFragment();
    remainingItems.forEach(({ product, globalIndex }, offset) => {
      fragment.appendChild(createCardElement(product, INITIAL_MOBILE_LIMIT + offset, globalIndex));
    });

    cardsList.appendChild(fragment);
    updateLoadMoreButton(categoryItems.length);
  });
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
    isExpanded = false;
    renderCards(currentCategory);
  });
}

function handleCardActivation(item) {
  const product = products[item.dataset.id];
  if (product && typeof openModal === 'function') {
    openModal(product, item);
  }
}

function initCardsInteraction() {
  cardsList?.addEventListener('click', (e) => {
    const item = e.target.closest('.menu-cards__item');
    if (item) handleCardActivation(item);
  });

  cardsList?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('.menu-cards__item');
    if (!item) return;
    e.preventDefault();
    handleCardActivation(item);
  });
}

function initResizeListener() {
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  mediaQuery.addEventListener('change', () => {
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
  initLoadMore();
  initCardsInteraction();
  initResizeListener();
  loadProducts();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initMenu)
  : initMenu();
