function initSlider() {
  const slider = document.querySelector('.favorite-slider');
  const prevBtn = document.querySelector('.main-slide__btn.arrow-left');
  const nextBtn = document.querySelector('.main-slide__btn.arrow-right');
  const paginationItems = document.querySelectorAll('.slider-pagination__item');

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.main-slide__card'));
  const total = slides.length;
  if (total === 0) return;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[total - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');

  slider.appendChild(firstClone);
  slider.insertBefore(lastClone, slides[0]);

  const state = {
    index: 1,
    isBusy: false,
    total
  };

  const getRealIndex = (idx) => (idx - 1 + state.total) % state.total;

  const render = (animate = true) => {
    slider.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    slider.style.transform = `translateX(-${state.index * 100}%)`;

    const realIndex = getRealIndex(state.index);
    paginationItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === realIndex);
    });
  };

  const moveTo = (targetIndex) => {
    if (state.isBusy) return;
    state.isBusy = true;
    state.index = targetIndex;
    render(true);
  };

  slider.addEventListener('transitionend', (e) => {
    if (e.target !== slider || e.propertyName !== 'transform') return;
    state.isBusy = false;

    if (state.index === state.total + 1) {
      state.index = 1;
      render(false);
    } else if (state.index === 0) {
      state.index = state.total;
      render(false);
    }
  });

  prevBtn?.addEventListener('click', () => moveTo(state.index - 1));
  nextBtn?.addEventListener('click', () => moveTo(state.index + 1));

  paginationItems.forEach((item, idx) => {
    item.addEventListener('click', () => moveTo(idx + 1));
  });

  document.addEventListener('keydown', (e) => {
    if (document.activeElement?.closest('.favorite-container__slider')) {
      if (e.key === 'ArrowLeft') moveTo(state.index - 1);
      if (e.key === 'ArrowRight') moveTo(state.index + 1);
    }
  });

  render(false);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initSlider)
  : initSlider();
