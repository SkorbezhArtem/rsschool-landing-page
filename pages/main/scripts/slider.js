function initSlider() {
  const slider = document.querySelector('.favorite-slider');
  const sliderContainer = document.querySelector('.favorite-container__slider');
  const prevBtn = document.querySelector('.main-slide__btn.arrow-left');
  const nextBtn = document.querySelector('.main-slide__btn.arrow-right');
  const paginationItems = Array.from(document.querySelectorAll('.slider-pagination__item'));

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

  const lines = paginationItems.map((item) => item.querySelector('.line'));

  const DURATION = 5000;
  const state = {
    index: 1,
    isBusy: false,
    total,
    elapsed: 0,
    isPaused: false
  };

  const getRealIndex = (idx) => (idx - 1 + state.total) % state.total;

  const render = (animate = true) => {
    slider.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    slider.style.transform = `translateX(-${state.index * 100}%)`;

    const realIndex = getRealIndex(state.index);
    paginationItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === realIndex);
      if (idx !== realIndex && lines[idx]) {
        lines[idx].style.width = '0%';
      }
    });
  };

  const resetProgress = () => {
    state.elapsed = 0;
    lines.forEach((line) => {
      if (line) line.style.width = '0%';
    });
  };

  const moveTo = (targetIndex) => {
    if (state.isBusy) return;
    state.isBusy = true;
    state.index = targetIndex;
    resetProgress();
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

  sliderContainer?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveTo(state.index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveTo(state.index + 1);
    }
  });

  let lastTime = performance.now();
  function tick(now) {
    const delta = now - lastTime;
    lastTime = now;

    if (!state.isPaused && !state.isBusy) {
      state.elapsed += delta;
      const realIndex = getRealIndex(state.index);
      const activeLine = lines[realIndex];

      if (activeLine) {
        const progress = Math.min((state.elapsed / DURATION) * 100, 100);
        activeLine.style.width = `${progress}%`;
      }

      if (state.elapsed >= DURATION) {
        moveTo(state.index + 1);
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const pauseArea = sliderContainer || slider;

  pauseArea.addEventListener('mouseenter', () => {
    state.isPaused = true;
  });

  pauseArea.addEventListener('mouseleave', () => {
    state.isPaused = false;
    lastTime = performance.now();
  });

  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  pauseArea.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.main-slide__btn')) return;
    try {
      pauseArea.setPointerCapture(e.pointerId);
    } catch (_) {}
    state.isPaused = true;
    startX = e.clientX;
    startY = e.clientY;
    isSwiping = true;
  });

  pauseArea.addEventListener('pointerup', (e) => {
    if (!isSwiping) return;
    isSwiping = false;

    if (pauseArea.hasPointerCapture && pauseArea.hasPointerCapture(e.pointerId)) {
      try {
        pauseArea.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        moveTo(state.index + 1);
      } else {
        moveTo(state.index - 1);
      }
    }

    state.isPaused = false;
    lastTime = performance.now();
  });

  pauseArea.addEventListener('pointercancel', (e) => {
    if (pauseArea.hasPointerCapture && pauseArea.hasPointerCapture(e.pointerId)) {
      try {
        pauseArea.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    isSwiping = false;
    state.isPaused = false;
    lastTime = performance.now();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      state.isPaused = true;
    } else {
      state.isPaused = false;
      lastTime = performance.now();
    }
  });

  render(false);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initSlider)
  : initSlider();
