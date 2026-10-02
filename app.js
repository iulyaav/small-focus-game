const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.start-button');
const menuScreen = document.querySelector('.menu-screen');
const backButton = document.querySelector('.back-button');
const cards = document.querySelectorAll('.game-card');
const starField = document.querySelector('.star-field');
const trail = document.querySelector('.twinkle-trail');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Vary each star's position and rhythm so the sky never blinks in unison.
for (let index = 0; index < 65; index += 1) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty('--size', `${1 + Math.random() * 2}px`);
  star.style.setProperty('--duration', `${3 + Math.random() * 5}s`);
  star.style.setProperty('--delay', `${-Math.random() * 8}s`);
  starField.append(star);
}

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
window.addEventListener('pointermove', leaveTwinkle);

cards.forEach((card, index) => card.style.setProperty('--card-index', index));

function changeScreen(from, to, focusTarget) {
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
  window.removeEventListener('pointermove', leaveTwinkle);
  changeScreen(startScreen, menuScreen, backButton);
});

backButton.addEventListener('click', () => {
  changeScreen(menuScreen, startScreen, startButton);
  // Restore the mouse trail once the opening screen is visible again.
  const delay = reducedMotion.matches ? 0 : 400;
  window.setTimeout(() => {
    trail.replaceChildren();
    window.addEventListener('pointermove', leaveTwinkle);
  }, delay);
});
