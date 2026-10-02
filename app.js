const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.start-button');
const menuScreen = document.querySelector('.menu-screen');
const cards = document.querySelectorAll('.game-card');

cards.forEach((card, index) => card.style.setProperty('--card-index', index));

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  startScreen.classList.add('is-leaving');

  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
  window.setTimeout(() => {
    startScreen.hidden = true;
    menuScreen.hidden = false;
    menuScreen.querySelector('button').focus({ preventScroll: true });
  }, delay);
});
