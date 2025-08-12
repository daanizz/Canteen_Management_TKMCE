// Enhanced version of your existing cart functions
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const cartContent = document.getElementById('cart-content');
  const grandTotalElem = document.getElementById('grand-total');
  const subtotalElem = document.getElementById('subtotal');
  const itemCountElem = document.getElementById('item-count');
  
  cartContent.innerHTML = '';

  let grandTotal = 0;
  let slNo = 1;
  const itemNames = Object.keys(cart);

  // Update item count
  itemCountElem.textContent = `${itemNames.length} ${itemNames.length === 1 ? 'item' : 'items'}`;

 if (itemNames.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p><b> Your cart is empty</p></b>
        
      </div>
    `;
    return;
  }

  // Create table
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Item</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="cart-items-body"></tbody>
  `;

  const tbody = table.querySelector('#cart-items-body');

  for (const itemName of itemNames) {
    const { price, quantity } = cart[itemName];
    const itemTotal = price * quantity;
    grandTotal += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${slNo++}</td>
      <td>${itemName}</td>
      <td>₹${price}</td>
      <td>
        <div class="quantity-control">
          <input type="number" class="quantity-input" 
                 min="1" value="${quantity}" 
                 onchange="updateQuantity('${itemName}', this.value)" />
        </div>
      </td>
      <td>₹${itemTotal}</td>
      <td>
        <button class="delete-btn" onclick="deleteItem('${itemName}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  }

  cartContent.appendChild(table);
  subtotalElem.textContent = `₹${grandTotal}`;
  grandTotalElem.textContent = `₹${grandTotal}`;
}

function updateQuantity(itemName, newQuantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  newQuantity = parseInt(newQuantity);

  if (newQuantity <= 0 || isNaN(newQuantity)) {
    delete cart[itemName];
  } else {
    cart[itemName].quantity = newQuantity;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart(); // refresh cart
}

function clearCart() {
  if (Object.keys(JSON.parse(localStorage.getItem('cart')) || {}).length === 0) {
    return;
  }
  
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart');
    loadCart();
  }
}

function deleteItem(itemName) {
  if (confirm('Remove this item from your cart?')) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[itemName];
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
}


// Initialize the cart when page loads
document.addEventListener('DOMContentLoaded', loadCart);

// Optional: Add animation when updating quantities
function animateUpdate(element) {
  element.style.transform = 'scale(1.1)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 200);
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('continue-shopping')) {
    window.location.href = 'menu.html';
  }
});

function continueOrdering() {
  // Save the cart (optional, localStorage already does this)
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  
  // Redirect to menu.html (cart is preserved)
  window.location.href = "menu.html";

}
// Function to handle the payment process
function proceedToPayment() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || Object.keys(cart).length === 0) {
        alert("Your cart is empty. Please add items before proceeding.");
        return;
    }

    // Retrieve existing order history or initialize a new one
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

    // Create a new order object with a timestamp
    const newOrder = {
        id: Date.now(), // Unique ID for the order
        date: new Date().toLocaleDateString(),
        items: cart,
        status: 'Paid'
    };

    // Calculate the total
    const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Enhanced confirmation
  if (confirm(`Proceed to pay ₹${total} for your order?`)) {
    alert("Payment successful! Redirecting to your order history...");

    // Add the new order to the history
    orderHistory.push(newOrder);

    // Save the updated history to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    // Clear the current cart
    localStorage.removeItem('cart');

    // Redirect to the order history page
    window.location.href = 'order_history.html';
  }

    
}
