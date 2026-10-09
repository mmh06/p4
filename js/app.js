$(document).foundation()
// Select the button and the container element
const button = document.getElementById('reverse-btn');
const container = document.getElementById('education');

// Toggle the class on button click
button.addEventListener('click', () => {
  container.classList.toggle('reversed-order');
});