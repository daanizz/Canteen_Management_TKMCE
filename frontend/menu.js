// --- User Greeting & Auth Check ---
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "login.html";
    return;
  }

  // Greet user
  document.getElementById("welcomeUser").textContent = `👋 Welcome, ${
    user.name || user.email
  }`;

  // Track last activity
  const activity = JSON.parse(localStorage.getItem("userActivity")) || {};
  activity.lastPage = "menu";
  activity.lastVisited = new Date().toISOString();
  localStorage.setItem("userActivity", JSON.stringify(activity));

  fetchMenuItems();
  updateCartCount();
});

// --- Logout ---
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem(getCartKey());
  localStorage.removeItem("userActivity");
  window.location.href = "login.html";
}

// --- Helpers ---
function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.email ? `cart_${user.email}` : "cart_guest";
}

// --- Quantity controls ---
function increaseQty(button) {
  const qtySpan = button.previousElementSibling;
  qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
}

function decreaseQty(button) {
  const qtySpan = button.nextElementSibling;
  const newQty = parseInt(qtySpan.textContent) - 1;
  if (newQty >= 0) qtySpan.textContent = newQty;
}

// --- Add to Cart ---
function addToCart(button) {
  const menuItem = button.closest(".menu-item");
  const name = menuItem.querySelector("h3").textContent.trim();
  const price = parseFloat(
    menuItem.querySelector("p").textContent.replace("₹", "")
  );
  const quantity = parseInt(menuItem.querySelector(".qty-value").textContent);

  if (!quantity) {
    alert("Select quantity before adding.");
    return;
  }

  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || {};

  cart[name] = cart[name]
    ? { ...cart[name], quantity: cart[name].quantity + quantity }
    : { price, quantity };

  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
  alert(`${quantity} × ${name} added to cart!`);
  menuItem.querySelector(".qty-value").textContent = "0";
}

// --- Update Cart Count ---
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(getCartKey())) || {};
  const total = Object.values(cart).reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById("cart-count").textContent = total;
}

// --- Fetch Menu ---
async function fetchMenuItems() {
  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error("Failed to fetch menu");
    const items = await res.json();
    renderMenuItems(items);
  } catch (err) {
    console.error(err);
    document.querySelector(
      ".menu-container"
    ).innerHTML = `<p>⚠️ Could not load menu.</p>`;
  }
}

// --- Render Menu ---
function renderMenuItems(items) {
  const menuContainer = document.querySelector(".menu-container");
  menuContainer.innerHTML = "";

  const categories = [...new Set(items.map((i) => i.category))];
  categories.forEach((cat) => {
    const section = document.createElement("div");
    section.className = "menu-section";
    section.innerHTML = `<h2>${cat}</h2><div class="menu-items"></div>`;
    const container = section.querySelector(".menu-items");

    items
      .filter((i) => i.category === cat)
      .forEach((item) => {
        container.innerHTML += `
        <div class="menu-item">
          <img src="${
            item.imageUrl || "https://via.placeholder.com/150"
          }" alt="${item.name}" />
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
          <div class="quantity-controls">
            <button onclick="decreaseQty(this)">−</button>
            <span class="qty-value">0</span>
            <button onclick="increaseQty(this)">+</button>
          </div>
          <button onclick="addToCart(this)">Add to Cart</button>
        </div>`;
      });

    menuContainer.appendChild(section);
  });
}
