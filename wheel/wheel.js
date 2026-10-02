const wheel = document.querySelector('.colour-wheel');
const componentCount = 12;
let nextComponent = 0;
let lastComponent = null;

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
      lastComponent = hour;
      nextComponent = (nextComponent + 1) % componentCount;
    }
  });
  component.addEventListener('pointerleave', () => {
    component.classList.remove('is-active');
  });
  wheel.append(component);
}
