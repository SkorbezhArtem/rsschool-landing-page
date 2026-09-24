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

function renderModalSizes(sizes) {
  if (!modalSizesContainer) return;
  const fragment = document.createDocumentFragment();

  Object.keys(sizes).forEach((key, index) => {
    const sizeData = sizes[key];
    const button = document.createElement('button');
    button.className = `menu-switch__item size-${key}${index === 0 ? ' active' : ''}`;
    button.type = 'button';
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
    const button = document.createElement('button');
    button.className = 'menu-switch__item';
    button.type = 'button';
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

  lastFocusedElement = document.activeElement;

  const cardImg = item?.querySelector('.menu-card__image');
  if (modalImg && cardImg) {
    modalImg.src = cardImg.src;
    modalImg.alt = product.name;
  }

  if (modalTitle) modalTitle.textContent = product.name;
  if (modalDescription) modalDescription.textContent = product.description;
  if (modalFinalPrice) modalFinalPrice.textContent = `$${product.price}`;

  renderModalSizes(product.sizes);
  renderModalAdditives(product.additives);

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
