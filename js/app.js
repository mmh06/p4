$(document).foundation()
// Select the button and the container element
const button = document.getElementById('reverse-btn');
const container = document.getElementById('edlist');

// Toggle the class on button click
button.addEventListener('click', () => {
  container.classList.toggle('reversed-order');
});

 const button2 = document.getElementById('reverse-work');
 const container2 = document.getElementById('wlist');

// Toggle the class on button click
button2.addEventListener('click', () => {
  container2.classList.toggle('reversed-order');
});