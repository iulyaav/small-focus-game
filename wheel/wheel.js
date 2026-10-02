const wheel = document.querySelector('.colour-wheel');
const componentCount = 12;
const palettes = [
  ['#143601', '#1a4301', '#245501', '#538d22', '#73a942', '#aad576'],
  ['#422680', '#341671', '#280659', '#660f56', '#ae2d68', '#f54952'],
];
let paletteIndex = 0;
let nextColour = 0;
let colourDirection = 1;
let nextComponent = 0;
let lastComponent = null;

function advanceColour() {
  if (colourDirection === 1 && nextColour === palettes[paletteIndex].length - 1) {
    // Either restart or repeat the endpoint before stepping backwards.
    if (Math.random() < .5) {
      nextColour = 0;
    } else {
      colourDirection = -1;
    }
  } else if (colourDirection === -1 && nextColour === 0) {
    colourDirection = 1;
    nextColour = 1;
  } else {
    nextColour += colourDirection;
  }
}

// Start at twelve o'clock and space the rectangles evenly around the ring.
for (let hour = 0; hour < componentCount; hour += 1) {
  const angle = hour * Math.PI * 2 / componentCount - Math.PI / 2;
  const component = document.createElement('span');
  component.className = 'wheel-component';
  component.style.left = `${50 + Math.cos(angle) * 43}%`;
  component.style.top = `${50 + Math.sin(angle) * 43}%`;
  component.addEventListener('pointerenter', () => {
    if (hour !== nextComponent && hour !== lastComponent) return;
    component.classList.add('is-active');
    if (hour === nextComponent) {
      // Only a new lap can change palettes; revisiting the top keeps its colour.
      if (hour === 0 && lastComponent !== null && Math.random() < .5) {
        paletteIndex = (paletteIndex + 1) % palettes.length;
        nextColour = 0;
        colourDirection = 1;
      }
      component.style.setProperty('--active-colour', palettes[paletteIndex][nextColour]);
      advanceColour();
      lastComponent = hour;
      nextComponent = (nextComponent + 1) % componentCount;
    }
  });
  component.addEventListener('pointerleave', () => {
    component.classList.remove('is-active');
  });
  wheel.append(component);
}
