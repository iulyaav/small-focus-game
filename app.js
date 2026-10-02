const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.start-button');
const menuScreen = document.querySelector('.menu-screen');
const backButton = document.querySelector('.back-button');
const cards = document.querySelectorAll('.game-card');
const trail = document.querySelector('.twinkle-trail');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const creditsDialog = document.querySelector('.credits-dialog');
document.querySelector('.credits-link').addEventListener('click', () => {
  creditsDialog.showModal();
});

let lastTwinkleTime = 0;
function leaveTwinkle(event) {
  if (reducedMotion.matches || event.pointerType !== 'mouse') return;
  const now = performance.now();
  if (now - lastTwinkleTime < 35) return;
  lastTwinkleTime = now;

  const twinkle = document.createElement('span');
  twinkle.className = 'twinkle';
  twinkle.style.left = `${event.clientX + (Math.random() - .5) * 12}px`;
  twinkle.style.top = `${event.clientY + (Math.random() - .5) * 12}px`;
  twinkle.style.setProperty('--size', `${4 + Math.random() * 6}px`);
  trail.append(twinkle);
  window.setTimeout(() => twinkle.remove(), 800);
}
if (window.location.hash === '#menu') {
  startScreen.hidden = true;
  menuScreen.hidden = false;
} else {
  window.addEventListener('pointermove', leaveTwinkle);
}

cards.forEach((card, index) => card.style.setProperty('--card-index', index));

function changeScreen(from, to, focusTarget) {
  if (from.classList.contains('is-leaving')) return;
  startButton.disabled = true;
  backButton.disabled = true;
  from.classList.add('is-leaving');
  const delay = reducedMotion.matches ? 0 : 400;
  window.setTimeout(() => {
    from.hidden = true;
    from.classList.remove('is-leaving');
    to.hidden = false;
    startButton.disabled = false;
    backButton.disabled = false;
    focusTarget.focus({ preventScroll: true });
  }, delay);
}

startButton.addEventListener('click', () => {
  window.history.replaceState(null, '', '#menu');
  window.removeEventListener('pointermove', leaveTwinkle);
  changeScreen(startScreen, menuScreen, backButton);
});

backButton.addEventListener('click', () => {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  changeScreen(menuScreen, startScreen, startButton);
  // Restore the mouse trail once the opening screen is visible again.
  const delay = reducedMotion.matches ? 0 : 400;
  window.setTimeout(() => {
    trail.replaceChildren();
    window.addEventListener('pointermove', leaveTwinkle);
  }, delay);
});
