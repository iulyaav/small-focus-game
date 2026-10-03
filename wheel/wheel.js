const wheel = document.querySelector('.colour-wheel');
const manualComponentCount = 24;
const automaticComponentCount = 24;
let componentCount = manualComponentCount;
// Palettes from https://coolors.co/palettes/popular
const palettes = [
  ['#143601', '#1a4301', '#245501', '#538d22', '#73a942', '#aad576'],
  ['#422680', '#341671', '#280659', '#660f56', '#ae2d68', '#f54952'],
  ['#ef476f', '#f78c6b', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
  ['#9f8be8', '#af99ff', '#caadff', '#ffc2e2', '#ffadc7', '#ff99b6'],
  ['#797d62', '#9b9b7a', '#f1dca7', '#ffcb69', '#d08c60', '#997b66'],
  ['#fd0363', '#cc095d', '#9c1057', '#6b1650', '#3b1d4a', '#0a2344'],
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'],
  ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'],
  ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'],
  ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'],
  ['#ccd5ae', '#e9edc9', '#fefae0', '#faedcd', '#d4a373'],
  ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4', '#caf0f8'],
  ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875'],
  ['#cb997e', '#ddbea9', '#ffe8d6', '#b7b7a4', '#a5a58d', '#6b705c'],
  ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'],
  ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'],
  ['#fec5bb', '#fcd5ce', '#fae1dd', '#f8edeb', '#e8e8e4', '#d8e2dc', '#ece4db', '#ffe5d9', '#ffd7ba', '#fec89a'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04', '#f48c06', '#faa307', '#ffba08'],
  ['#006d77', '#83c5be', '#edf6f9', '#ffddd2', '#e29578'],
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
  ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'],
  ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'],
];
let paletteIndex = Math.floor(Math.random() * palettes.length);
let nextColour = 0;
let colourDirection = 1;
let nextComponent = 0;
let lastComponent = null;
const components = [];
const autoToggle = document.querySelector('.auto-toggle');
let autoTimer = null;
let stepsUntilPair = 6 + Math.floor(Math.random() * 5);
const fadingComponents = [];

// Geometric outlined numerals with bevelled corners, drawn locally as SVG.
const numeralPaths = [
  'M8 3H26L32 9V51L26 57H8L2 51V9ZM11 12V48H23V12Z',
  'M5 13L16 3H24V48H31V57H4V48H15V16L11 20Z',
  'M2 9L8 3H26L32 9V25L11 43V48H32V57H2V39L23 21V12H11V20H2Z',
  'M2 3H26L32 9V24L26 30L32 36V51L26 57H2V48H23V35H10V25H23V12H2Z',
  'M19 3H30V57H21V36H2V27ZM21 16L11 27H21Z',
  'M2 3H32V12H11V25H26L32 31V51L26 57H2V48H23V34H2Z',
  'M8 3H31V12H11V25H26L32 31V51L26 57H8L2 51V9ZM11 34V48H23V34Z',
  'M2 3H32V12L16 57H6L22 12H2Z',
  'M8 3H26L32 9V24L26 30L32 36V51L26 57H8L2 51V36L8 30L2 24V9ZM11 12V25H23V12ZM11 35V48H23V35Z',
  'M8 3H26L32 9V51L26 57H3V48H23V35H8L2 29V9ZM11 12V26H23V12Z',
];
let completedSpins = 0;
const spinCounter = document.createElement('output');
spinCounter.className = 'spin-counter';
spinCounter.id = 'spin-counter';
spinCounter.hidden = true;
const scoreToggle = document.querySelector('.score-toggle');
scoreToggle.addEventListener('click', () => {
  const enabled = spinCounter.hidden;
  spinCounter.hidden = !enabled;
  counterAnimation?.cancel();
  scoreToggle.setAttribute('aria-pressed', String(enabled));
  scoreToggle.title = `Score: ${enabled ? 'on' : 'off'}`;
  scoreToggle.querySelector('.score-state').textContent = enabled ? 'on' : 'off';
});
let counterAnimation = null;

function renderSpinCounter(pop = false) {
  const digits = String(completedSpins);
  spinCounter.setAttribute('aria-label', `${completedSpins} completed spins`);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${digits.length * 40 - 6} 60`);
  svg.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < digits.length; index += 1) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', numeralPaths[Number(digits[index])]);
    path.setAttribute('transform', `translate(${index * 40} 0)`);
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(path);
  }
  spinCounter.replaceChildren(svg);
  if (pop && !spinCounter.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counterAnimation?.cancel();
    counterAnimation = spinCounter.animate([
      { transform: 'translate(-50%, -50%) scale(1)' },
      { transform: 'translate(-50%, -50%) scale(1.25)', offset: 0.3 },
      { transform: 'translate(-50%, -50%) scale(1)' },
    ], { duration: 420, easing: 'ease-out' });
  }
}
renderSpinCounter();

function fadeComponent(component) {
  if (!component.classList.contains('is-active')) return;
  component.classList.remove('is-active');
  component.classList.add('is-trailing');
  const existing = fadingComponents.indexOf(component);
  if (existing !== -1) fadingComponents.splice(existing, 1);
  fadingComponents.push(component);
  // Keep fast manual movement from lighting up the whole wheel.
  while (fadingComponents.length > 2) {
    fadingComponents.shift().classList.remove('is-trailing', 'is-companion');
  }
}

function activateComponent(hour) {
  if (hour !== nextComponent && hour !== lastComponent) return;
  const component = components[hour];
  clearActiveComponents();
  component.classList.remove('is-trailing', 'is-companion');
  component.classList.add('is-active');
  if (hour !== nextComponent) return;
  // Each new lap uses a different palette; revisiting the top keeps its colour.
  if (hour === 0 && lastComponent !== null) {
    completedSpins += 1;
    renderSpinCounter(true);
    const offset = 1 + Math.floor(Math.random() * (palettes.length - 1));
    paletteIndex = (paletteIndex + offset) % palettes.length;
    nextColour = 0;
    colourDirection = 1;
  }
  component.style.setProperty('--active-colour', palettes[paletteIndex][nextColour]);
  stepsUntilPair -= 1;
  if (stepsUntilPair === 0) {
    const neighbour = components[(hour + componentCount - 1) % componentCount];
    neighbour.classList.remove('is-trailing');
    neighbour.classList.add('is-companion');
    stepsUntilPair = 6 + Math.floor(Math.random() * 5);
  }
  advanceColour();
  lastComponent = hour;
  nextComponent = (nextComponent + 1) % componentCount;
}

function clearActiveComponents() {
  components.forEach(fadeComponent);
}

function advanceColour() {
  if (colourDirection === 1 && nextColour === palettes[paletteIndex].length - 1) {
    // Repeat the final colour once, then walk back through the palette.
    colourDirection = -1;
  } else if (colourDirection === -1 && nextColour === 0) {
    colourDirection = 1;
    nextColour = 1;
  } else {
    nextColour += colourDirection;
  }
}

// Touch uses broad angular sectors, including the gaps between visible rays.
let touchPointer = null;
let lastTouchRay = null;

function followTouch(event) {
  const bounds = wheel.getBoundingClientRect();
  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;
  const radius = Math.hypot(x, y) / bounds.width;
  if (radius < 0.13 || radius > 0.60) {
    clearActiveComponents();
    lastTouchRay = null;
    return;
  }
  const angle = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
  const hour = Math.round(angle * componentCount / (Math.PI * 2)) % componentCount;
  if (hour === lastTouchRay) return;
  if (lastTouchRay !== null) {
    const crossed = (hour - lastTouchRay + componentCount) % componentCount;
    // Fill in rays skipped between touch samples during a clockwise swipe.
    if (crossed <= componentCount / 2) {
      for (let step = 1; step <= crossed; step += 1) {
        activateComponent((lastTouchRay + step) % componentCount);
      }
    } else {
      activateComponent(hour);
    }
  } else {
    activateComponent(hour);
  }
  lastTouchRay = hour;
}

function endTouch() {
  if (touchPointer === null) return;
  const pointer = touchPointer;
  touchPointer = null;
  lastTouchRay = null;
  clearActiveComponents();
  if (wheel.hasPointerCapture(pointer)) wheel.releasePointerCapture(pointer);
}

wheel.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' || !event.isPrimary || autoTimer !== null) return;
  touchPointer = event.pointerId;
  lastTouchRay = null;
  wheel.setPointerCapture(touchPointer);
  followTouch(event);
});
wheel.addEventListener('pointermove', event => {
  if (event.pointerId === touchPointer) followTouch(event);
});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  wheel.addEventListener(type, event => {
    if (event.pointerId === touchPointer) endTouch();
  });
}

// A repeating long-short rhythm gives the sunburst sixfold symmetry.
const rayLengths = Array.from({ length: 24 }, (_, hour) => [37, 26, 33, 26][hour % 4]);

// Start at midnight and rebuild the starburst when switching modes.
function buildWheel(count) {
  endTouch();
  componentCount = count;
  nextComponent = 0;
  lastComponent = null;
  fadingComponents.length = 0;
  stepsUntilPair = 6 + Math.floor(Math.random() * 5);
  components.length = 0;
  wheel.replaceChildren(spinCounter);
  wheel.setAttribute('aria-label', `${count} rays of different lengths radiating from an open centre`);
  for (let hour = 0; hour < componentCount; hour += 1) {
    const angle = hour * Math.PI * 2 / componentCount - Math.PI / 2;
    const component = document.createElement('span');
    component.className = 'wheel-component';
    component.style.left = `${50 + Math.cos(angle) * 16}%`;
    component.style.top = `${50 + Math.sin(angle) * 16}%`;
    component.style.setProperty('--ray-angle', `${angle}rad`);
    component.style.width = `${rayLengths[hour]}%`;
    const ray = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ray.setAttribute('viewBox', '0 0 100 24');
    ray.setAttribute('preserveAspectRatio', 'none');
    ray.setAttribute('aria-hidden', 'true');
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    // Long rays have pointed tips; short rays have bevelled shoulders.
    shape.setAttribute('points', hour % 2 === 0
      ? '0,9 91,1 100,12 91,23 0,15'
      : '0,9 93,1 100,5 100,19 93,23 0,15');
    shape.setAttribute('vector-effect', 'non-scaling-stroke');
    ray.append(shape);
    component.append(ray);
    component.addEventListener('animationend', () => {
      component.classList.remove('is-trailing', 'is-companion');
    });
    component.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && autoTimer === null) activateComponent(hour);
    });
    component.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse' && autoTimer === null) fadeComponent(component);
    });
    components.push(component);
    wheel.append(component);
  }
}

buildWheel(manualComponentCount);

autoToggle.addEventListener('click', () => {
  const enabled = autoTimer === null;
  buildWheel(enabled ? automaticComponentCount : manualComponentCount);
  if (enabled) {
    autoTimer = window.setInterval(() => {
      clearActiveComponents();
      activateComponent(nextComponent);
    }, 500);
  } else {
    window.clearInterval(autoTimer);
    autoTimer = null;
  }
  autoToggle.setAttribute('aria-pressed', String(enabled));
  autoToggle.title = `Automatic Colourful spiral: ${enabled ? 'on' : 'off'}`;
  autoToggle.querySelector('.auto-state').textContent = enabled ? 'on' : 'off';
});
