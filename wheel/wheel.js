const wheel = document.querySelector('.colour-wheel');

// Start at twelve o'clock and space the rectangles evenly around the ring.
for (let hour = 0; hour < 12; hour += 1) {
  const angle = hour * Math.PI / 6 - Math.PI / 2;
  const component = document.createElement('span');
  component.className = 'wheel-component';
  component.style.left = `${50 + Math.cos(angle) * 43}%`;
  component.style.top = `${50 + Math.sin(angle) * 43}%`;
  wheel.append(component);
}
