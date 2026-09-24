let currentProduct = null;
let selectedSize = 's';
let selectedAdditives = new Set();
let lastFocusedElement = null;

const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('#modal-img');
const modalTitle = document.querySelector('#card-description__title');
const modalDescription = document.querySelector('#card-description__text');
const modalSizesContainer = document.querySelector('.modal-sizes');
const modalAdditivesContainer = document.querySelector('.modal-additives');
const modalFinalPrice = document.querySelector('#final-price');
const modalCloseButton = document.querySelector('#close-button');

function calculateTotalPrice() {
  if (!currentProduct) return '0.00';

  const basePrice = parseFloat(currentProduct.price) || 0;
  const sizeAddPrice = parseFloat(currentProduct.sizes[selectedSize]?.['add-price']) || 0;

  let additivesPrice = 0;
  selectedAdditives.forEach((index) => {
    const addPrice = parseFloat(currentProduct.additives[index]?.['add-price']) || 0;
    additivesPrice += addPrice;
  });

  return (Math.round((basePrice + sizeAddPrice + additivesPrice) * 100) / 100).toFixed(2);
}

function updateModalPrice() {
  if (modalFinalPrice) {
    modalFinalPrice.textContent = `$${calculateTotalPrice()}`;
  }
}

function renderModalSizes(sizes) {
  if (!modalSizesContainer) return;
  const fragment = document.createDocumentFragment();

  Object.keys(sizes).forEach((key) => {
    const sizeData = sizes[key];
    const isDefault = key === selectedSize;
    const button = document.createElement('button');
    button.className = `menu-switch__item size-${key}${isDefault ? ' active' : ''}`;
    button.type = 'button';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(isDefault));
    button.dataset.size = key;
    button.dataset.addPrice = sizeData['add-price'];
    button.innerHTML = `
      <span class="item__image-container">${key.toUpperCase()}</span>
      <span class="item__title">${sizeData.size}</span>
    `;
    fragment.appendChild(button);
  });

  modalSizesContainer.replaceChildren(fragment);
}

function renderModalAdditives(additives) {
  if (!modalAdditivesContainer) return;
  const fragment = document.createDocumentFragment();

  additives.forEach((additive, index) => {
    const isSelected = selectedAdditives.has(index);
    const button = document.createElement('button');
    button.className = `menu-switch__item${isSelected ? ' active' : ''}`;
    button.type = 'button';
    button.setAttribute('role', 'checkbox');
    button.setAttribute('aria-checked', String(isSelected));
    button.dataset.index = String(index);
    button.dataset.addPrice = additive['add-price'];
    button.innerHTML = `
      <span class="item__image-container">${index + 1}</span>
      <span class="item__title">${additive.name}</span>
    `;
    fragment.appendChild(button);
  });

  modalAdditivesContainer.replaceChildren(fragment);
}

function openModal(product, item) {
  if (!overlay || !product) return;

  currentProduct = product;
  selectedSize = 's';
  selectedAdditives.clear();
  lastFocusedElement = document.activeElement;

  const cardImg = item?.querySelector('.menu-card__image');
  if (modalImg && cardImg) {
    modalImg.src = cardImg.src;
    modalImg.alt = product.name;
  }

  if (modalTitle) modalTitle.textContent = product.name;
  if (modalDescription) modalDescription.textContent = product.description;

  renderModalSizes(product.sizes);
  renderModalAdditives(product.additives);
  updateModalPrice();

  overlay.classList.remove('invisible');
  document.body.classList.add('lock-scroll');
  modalCloseButton?.focus();
}

function closeModal() {
  if (!overlay || overlay.classList.contains('invisible')) return;

  overlay.classList.add('invisible');
  document.body.classList.remove('lock-scroll');
  lastFocusedElement?.focus();
}

function initModal() {
  modalSizesContainer?.addEventListener('click', (e) => {
    const button = e.target.closest('.menu-switch__item');
    if (!button || button.classList.contains('active')) return;

    modalSizesContainer.querySelectorAll('.menu-switch__item').forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });

    selectedSize = button.dataset.size;
    updateModalPrice();
  });

  modalAdditivesContainer?.addEventListener('click', (e) => {
    const button = e.target.closest('.menu-switch__item');
    if (!button) return;

    const index = parseInt(button.dataset.index, 10);
    const isNowActive = !button.classList.contains('active');

    button.classList.toggle('active', isNowActive);
    button.setAttribute('aria-checked', String(isNowActive));

    if (isNowActive) {
      selectedAdditives.add(index);
    } else {
      selectedAdditives.delete(index);
    }

    updateModalPrice();
  });

  modalCloseButton?.addEventListener('click', closeModal);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('invisible')) {
      closeModal();
    }
  });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initModal)
  : initModal();
