const starField = document.querySelector('.star-field');

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

