// Enhanced version of your existing cart functions
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const cartContent = document.getElementById("cart-content");
  const grandTotalElem = document.getElementById("grand-total");
  const subtotalElem = document.getElementById("subtotal");
  const itemCountElem = document.getElementById("item-count");

  cartContent.innerHTML = "";

  let grandTotal = 0;
  let slNo = 1;
  const itemNames = Object.keys(cart);

  // Update item count
  itemCountElem.textContent = `${itemNames.length} ${
    itemNames.length === 1 ? "item" : "items"
  }`;

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
  const table = document.createElement("table");
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

  const tbody = table.querySelector("#cart-items-body");

  for (const itemName of itemNames) {
    const { price, quantity } = cart[itemName];
    const itemTotal = price * quantity;
    grandTotal += itemTotal;

    const row = document.createElement("tr");
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
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  newQuantity = parseInt(newQuantity);

  if (newQuantity <= 0 || isNaN(newQuantity)) {
    delete cart[itemName];
  } else {
    cart[itemName].quantity = newQuantity;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(); // refresh cart
}

function clearCart() {
  if (
    Object.keys(JSON.parse(localStorage.getItem("cart")) || {}).length === 0
  ) {
    return;
  }

  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("cart");
    loadCart();
  }
}

function deleteItem(itemName) {
  if (confirm("Remove this item from your cart?")) {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    delete cart[itemName];
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

// Initialize the cart when page loads
document.addEventListener("DOMContentLoaded", loadCart);

// Optional: Add animation when updating quantities
function animateUpdate(element) {
  element.style.transform = "scale(1.1)";
  setTimeout(() => {
    element.style.transform = "scale(1)";
  }, 200);
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("continue-shopping")) {
    window.location.href = "menu.html";
  }
});

function continueOrdering() {
  // Save the cart (optional, localStorage already does this)
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  // Redirect to menu.html (cart is preserved)
  window.location.href = "menu.html";
}

// Declare allItems globally so other functions can use it
let allItems = [];

async function loadAllItems() {
  try {
    const res = await fetch("/api/items");
    allItems = await res.json();
    console.log("All items loaded:", allItems);
  } catch (err) {
    console.error("Failed to load menu items:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  loadAllItems(); // load menu items
});

// Function to handle the payment process
async function proceedToPayment() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart || Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (!allItems || allItems.length === 0) {
    alert("Menu items not loaded yet.");
    return;
  }

  const itemsArray = Object.keys(cart)
    .map((name) => {
      const item = cart[name];
      const dbItem = allItems.find((i) => i.name === name);

      if (!dbItem) {
        console.error("Item not found in DB:", name);
        return null; // skip items not found
      }

      return {
        item: dbItem._id, // ✅ must be a valid ObjectId
        name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      };
    })
    .filter((i) => i !== null); // remove nulls

  const totalPrice = itemsArray.reduce((sum, item) => sum + item.total, 0);

  if (!confirm(`Proceed to pay ₹${totalPrice}?`)) return;

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: Date.now(),
        customerId: "68deb45bdac6a8d2a4c7cb40", // dummy user ID
        items: itemsArray,
        totalPrice,
        isPaid: true,
        status: "pending",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save order");
    }

    const data = await response.json();
    console.log("Order saved:", data);

    // Clear cart after saving
    localStorage.removeItem("cart");
    loadCart();

    // Redirect to payment confirmation
    window.location.href = `payment.html?amount=${totalPrice}`;
  } catch (err) {
    console.error("Error saving order:", err);
    alert("Failed to place order: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".proceed-btn")
    .addEventListener("click", proceedToPayment);
});
