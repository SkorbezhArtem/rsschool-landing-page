const THEME_STORAGE_KEY = 'coffee-house-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const toggleBtns = document.querySelectorAll('.theme-toggle');
  toggleBtns.forEach((btn) => {
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
}

function initTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
  setTheme(currentTheme);

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

const initialTheme = getPreferredTheme();
document.documentElement.setAttribute('data-theme', initialTheme);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

window.getPreferredTheme = getPreferredTheme;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;
