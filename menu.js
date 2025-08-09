function increaseQty(button) {
  const qtySpan = button.previousElementSibling;
  let currentQty = parseInt(qtySpan.textContent);
  qtySpan.textContent = currentQty + 1;
}

function decreaseQty(button) {
  const qtySpan = button.nextElementSibling;
  let currentQty = parseInt(qtySpan.textContent);
  if (currentQty > 0) {
    qtySpan.textContent = currentQty - 1;
  }
}


function increaseQty(button) {
  const qtySpan = button.previousElementSibling;
  let currentQty = parseInt(qtySpan.textContent);
  qtySpan.textContent = currentQty + 1;
}

function decreaseQty(button) {
  const qtySpan = button.nextElementSibling;
  let currentQty = parseInt(qtySpan.textContent);
  if (currentQty > 0) {
    qtySpan.textContent = currentQty - 1;
  }
}

function addToCart(button) {
  const menuItem = button.closest('.menu-item');

  const name = menuItem.querySelector('h3').textContent.trim();
  const priceText = menuItem.querySelector('p').textContent.trim(); // "₹120"
  const price = parseFloat(priceText.replace('₹', ''));
  const quantity = parseInt(menuItem.querySelector('.qty-value').textContent);

  if (quantity === 0 || isNaN(quantity)) {
    alert("Please select a valid quantity before adding to cart.");
    return;
  }

  // Use object instead of array
  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  if (cart[name]) {
    cart[name].quantity += quantity;
  } else {
    cart[name] = { price, quantity };
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${quantity} × ${name} added to cart!`);
}
