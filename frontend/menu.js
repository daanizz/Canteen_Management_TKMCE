// frontend/menu.js
// Global variables
let allItems = [];

// Function to increase quantity
function increaseQty(button) {
  const qtySpan = button.previousElementSibling;
  let currentQty = parseInt(qtySpan.textContent);
  qtySpan.textContent = currentQty + 1;
}

// Function to decrease quantity
function decreaseQty(button) {
  const qtySpan = button.nextElementSibling;
  let currentQty = parseInt(qtySpan.textContent);
  if (currentQty > 0) {
    qtySpan.textContent = currentQty - 1;
  }
}

// Function to add item to cart
function addToCart(button) {
  const menuItem = button.closest('.menu-item');
  const name = menuItem.querySelector('h3').textContent.trim();
  const priceText = menuItem.querySelector('p').textContent.trim();
  const price = parseFloat(priceText.replace('₹', ''));
  const quantity = parseInt(menuItem.querySelector('.qty-value').textContent);

  if (quantity === 0 || isNaN(quantity)) {
    alert("Please select a valid quantity before adding to cart.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  if (cart[name]) {
    cart[name].quantity += quantity;
  } else {
    cart[name] = { price, quantity };
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${quantity} × ${name} added to cart!`);
  
  // Reset quantity after adding to cart
  menuItem.querySelector('.qty-value').textContent = '0';
}

// Function to update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  let totalItems = 0;
  
  Object.values(cart).forEach(item => {
    totalItems += item.quantity;
  });
  
  document.getElementById('cart-count').textContent = totalItems;
}

// Function to fetch menu items from backend
async function fetchMenuItems() {
  try {
    console.log('Fetching menu items from /api/items...');
    const response = await fetch('/api/items');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const items = await response.json();
    console.log('Received items:', items);
    
    if (items && items.length > 0) {
      allItems = items;
      renderMenuItems(items);
    } else {
      console.warn('No items received from server');
      displayNoItemsMessage();
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
    displayErrorMessage();
  }
}

// Function to display error message
function displayErrorMessage() {
  const menuContainer = document.querySelector('.menu-container');
  menuContainer.innerHTML = `
    <div class="error-message">
      <h3>Unable to load menu</h3>
      <p>Please check your connection and try again</p>
      <button onclick="fetchMenuItems()">Retry</button>
    </div>
  `;
}

// Function to display no items message
function displayNoItemsMessage() {
  const menuContainer = document.querySelector('.menu-container');
  menuContainer.innerHTML = `
    <div class="no-items-message">
      <h3>No menu items available</h3>
      <p>Please check back later</p>
    </div>
  `;
}

// Function to render menu items
function renderMenuItems(items) {
  const menuContainer = document.querySelector('.menu-container');
  menuContainer.innerHTML = ''; // Clear existing content
  
  // Group items by category
  const itemsByCategory = {};
  items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });
  
  // Define category display names - CORRECTED MAPPING
  const categoryNames = {
    'Meal': 'Main Dishes',
    'Bread': 'Breads',
    'Snack': 'Snacks',        // Now shows as "Snacks"
    'Beverage': 'Beverages'   // Now shows as "Beverages"
  };
  
  // Process each category in a specific order for better layout
  const categoryOrder = ['Meal', 'Bread', 'Snack', 'Beverage'];
  
  categoryOrder.forEach(category => {
    if (itemsByCategory[category] && itemsByCategory[category].length > 0) {
      const displayName = categoryNames[category] || category;
      
      const section = document.createElement('div');
      section.className = 'menu-section';
      
      section.innerHTML = `
        <h2>${displayName}</h2>
        <div class="section-divider"></div>
        <div class="menu-items"></div>
      `;
      
      const menuItemsContainer = section.querySelector('.menu-items');
      
      // Add items for this category
      itemsByCategory[category].forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found'" />
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
          <div class="item-status ${item.status === 'Available' ? 'available' : 'not-available'}">
            ${item.status}
          </div>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="decreaseQty(this)">−</button>
            <span class="qty-value">0</span>
            <button class="qty-btn" onclick="increaseQty(this)">+</button>
          </div>
          <button class="add-to-cart" onclick="addToCart(this)" ${item.status !== 'Available' ? 'disabled' : ''}>
            ${item.status === 'Available' ? 'Add to Cart' : 'Not Available'}
          </button>
        `;
        
        menuItemsContainer.appendChild(menuItem);
      });
      
      menuContainer.appendChild(section);
    }
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, fetching menu items...');
  fetchMenuItems();
  updateCartCount();
});