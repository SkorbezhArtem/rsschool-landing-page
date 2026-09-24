function initBurger() {
  const toggle = document.getElementById('menu__toggle');
  const menu = document.querySelector('.menu');
  const menuBtn = document.querySelector('.menu__btn');
  const overlay = document.querySelector('.m-menu__overlay');

  if (!toggle || !menu) return;

  const setMenuState = (isOpen) => {
    toggle.checked = isOpen;
    document.body.classList.toggle('lock-scroll', isOpen);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = isOpen && scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
    menuBtn?.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('change', () => setMenuState(toggle.checked));

  document.addEventListener('click', (e) => {
    if (!toggle.checked) return;
    const isLink = menu.contains(e.target) && e.target.closest('a');
    const isOverlay = e.target === overlay;
    const isThemeToggle = e.target.closest('.theme-toggle');
    const isOutside = !menu.contains(e.target) && !menuBtn?.contains(e.target) && !isThemeToggle && e.target !== toggle;

    if (isLink || isOverlay || isOutside) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.checked) setMenuState(false);
  });

  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const handleBreakpoint = (e) => {
    if (!e.matches && toggle.checked) setMenuState(false);
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleBreakpoint);
  } else {
    mediaQuery.addListener(handleBreakpoint);
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initBurger)
  : initBurger();
