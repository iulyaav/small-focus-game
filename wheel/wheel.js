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

// Fixed lengths keep the starburst familiar while colours change each lap.
const rayLengths = [32, 21, 28, 16, 30, 23, 18, 32, 22, 27, 16, 29,
  23, 31, 18, 26, 32, 20, 28, 17, 25, 31, 19, 27];

// Start at midnight and rebuild the starburst when switching modes.
function buildWheel(count) {
  componentCount = count;
  nextComponent = 0;
  lastComponent = null;
  fadingComponents.length = 0;
  stepsUntilPair = 6 + Math.floor(Math.random() * 5);
  components.length = 0;
  wheel.replaceChildren();
  wheel.setAttribute('aria-label', `${count} rays of different lengths radiating from an open centre`);
  for (let hour = 0; hour < componentCount; hour += 1) {
    const angle = hour * Math.PI * 2 / componentCount - Math.PI / 2;
    const component = document.createElement('span');
    component.className = 'wheel-component';
    component.style.left = `${50 + Math.cos(angle) * 16}%`;
    component.style.top = `${50 + Math.sin(angle) * 16}%`;
    component.style.setProperty('--ray-angle', `${angle}rad`);
    component.style.width = `${rayLengths[hour] * 1.1}%`;
    const ray = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ray.setAttribute('viewBox', '0 0 100 24');
    ray.setAttribute('preserveAspectRatio', 'none');
    ray.setAttribute('aria-hidden', 'true');
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const outlines = [
      '0,10 48,7 91,1 100,5 96,23 53,17 0,14',
      '0,10 58,6 97,1 93,9 100,20 62,18 0,14',
      '0,10 43,8 94,1 100,16 90,23 47,16 0,14',
    ];
    shape.setAttribute('points', outlines[hour % outlines.length]);
    shape.setAttribute('vector-effect', 'non-scaling-stroke');
    ray.append(shape);
    component.append(ray);
    component.addEventListener('animationend', () => {
      component.classList.remove('is-trailing', 'is-companion');
    });
    component.addEventListener('pointerenter', () => {
      if (autoTimer === null) activateComponent(hour);
    });
    component.addEventListener('pointerleave', () => {
      if (autoTimer === null) fadeComponent(component);
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
  autoToggle.title = `Automatic wheel: ${enabled ? 'on' : 'off'}`;
  autoToggle.querySelector('.auto-state').textContent = enabled ? 'on' : 'off';
});
