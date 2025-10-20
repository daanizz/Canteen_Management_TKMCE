// --- Helper to get user-specific cart key ---
function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.email ? `cart_${user.email}` : "cart_guest";
}

// --- Load Cart ---
function loadCart() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || {};

  const cartContent = document.getElementById("cart-content");
  const grandTotalElem = document.getElementById("grand-total");
  const subtotalElem = document.getElementById("subtotal");
  const itemCountElem = document.getElementById("item-count");

  cartContent.innerHTML = "";

  const itemNames = Object.keys(cart);
  let grandTotal = 0;
  let slNo = 1;

  // Update item count
  itemCountElem.textContent = `${itemNames.length} ${
    itemNames.length === 1 ? "item" : "items"
  }`;

  if (itemNames.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p><b>Your cart is empty</b></p>
      </div>`;
    subtotalElem.textContent = "₹0";
    grandTotalElem.textContent = "₹0";
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
      </td>`;
    tbody.appendChild(row);
  }

  cartContent.appendChild(table);
  subtotalElem.textContent = `₹${grandTotal}`;
  grandTotalElem.textContent = `₹${grandTotal}`;

  // Update last activity tracking
  const activity = JSON.parse(localStorage.getItem("userActivity")) || {};
  activity.lastPage = "cart";
  activity.lastVisited = new Date().toISOString();
  localStorage.setItem("userActivity", JSON.stringify(activity));
}

// --- Update Quantity ---
function updateQuantity(itemName, newQuantity) {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || {};
  newQuantity = parseInt(newQuantity);

  if (newQuantity <= 0 || isNaN(newQuantity)) {
    delete cart[itemName];
  } else {
    cart[itemName].quantity = newQuantity;
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  loadCart();
}

// --- Delete Item ---
function deleteItem(itemName) {
  if (confirm("Remove this item from your cart?")) {
    const cartKey = getCartKey();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    delete cart[itemName];
    localStorage.setItem(cartKey, JSON.stringify(cart));
    loadCart();
  }
}

// --- Clear Cart ---
function clearCart() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || {};

  if (Object.keys(cart).length === 0) return;
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem(cartKey);
    loadCart();
  }
}

// --- Continue Ordering ---
function continueOrdering() {
  window.location.href = "menu.html";
}

// --- Proceed to Payment ---
async function proceedToPayment() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey));
  if (!cart || Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    // 1️⃣ Fetch all items from backend to map ObjectIds
    const allItems = await fetch("/api/items").then((res) => res.json());

    // 2️⃣ Convert cart to valid items array
    const itemsArray = Object.keys(cart)
      .map((name) => {
        const item = cart[name];
        const dbItem = allItems.find(
          (i) => i.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
        if (!dbItem) {
          console.warn(`Item "${name}" not found in backend.`);
          return null;
        }
        return {
          item: dbItem._id, // ✅ matches schema
          name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        };
      })
      .filter(Boolean); // remove unmatched

    if (itemsArray.length === 0) {
      alert("No valid items found. Please refresh and try again.");
      return;
    }

    const totalPrice = itemsArray.reduce((sum, i) => sum + i.total, 0);
    if (!confirm(`Proceed to pay ₹${totalPrice}?`)) return;

    // 3️⃣ Prepare order payload

    const user = JSON.parse(localStorage.getItem("user"));
    const customerId = user?._id || user?.id;

    const orderData = {
      orderNumber: Date.now(),
      customerId: customerId, // Replace with logged-in user's ID
      items: itemsArray,
      totalPrice,
      isPaid: true,
      status: "pending",
    };

    // 4️⃣ Send order
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to save order");
    }

    const savedOrder = await response.json();
    console.log("✅ Order saved:", savedOrder);

    // 5️⃣ Clear cart and redirect
    localStorage.removeItem(cartKey);
    loadCart();
    window.location.href = `payment.html?amount=${totalPrice}&orderId=${savedOrder._id}`;
  } catch (err) {
    console.error("❌ Failed to place order:", err);
    alert("Failed to place order: " + err.message);
  }
}

// --- Initialize on page load ---
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  document
    .querySelector(".proceed-btn")
    .addEventListener("click", proceedToPayment);
});
