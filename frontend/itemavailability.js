// Make sure your backend is running on this port
const ADMIN_API_URL = "http://localhost:4500/api/admin";
const ITEMS_API_URL = "http://localhost:4500/api/items"; // Assuming this is your public items route

document.addEventListener("DOMContentLoaded", () => {
    fetchItems();
});

async function fetchItems() {
    const grid = document.getElementById("item-grid");
    const loadingMsg = document.getElementById("loading-message");
    try {
        // Fetch from the same endpoint as your menu.js
        const response = await fetch(ITEMS_API_URL); 
        if (!response.ok) {
            throw new Error("Failed to fetch items.");
        }
        const items = await response.json();
        
        if (items.length === 0) {
            loadingMsg.textContent = "No menu items found.";
            return;
        }

        renderItems(items);
        loadingMsg.style.display = 'none'; // Hide loading message

    } catch (error) {
        console.error("Error fetching items:", error);
        loadingMsg.innerHTML = `<p class="text-danger">Could not load items: ${error.message}</p>`;
    }
}

function renderItems(items) {
    const grid = document.getElementById("item-grid");
    grid.innerHTML = ""; // Clear grid

    items.forEach(item => {
        const isAvailable = item.status === "Available";
        const cardClass = isAvailable ? "" : "not-available";
        const imageSrc = item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:4500/${item.imageUrl}`; // Adjust base URL if needed

        const cardHTML = `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card item-card h-100 ${cardClass}" id="card-${item._id}">
                <img src="${imageSrc}" class="card-img-top" alt="${item.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <p class="card-text text-muted">₹${item.price}</p>
                    
                    <div class="form-check form-switch fs-5 mt-auto">
                        <input class="form-check-input" type="checkbox" role="switch" 
                               id="switch-${item._id}" 
                               data-id="${item._id}" 
                               ${isAvailable ? "checked" : ""}>
                        <label class="form-check-label fw-medium" for="switch-${item._id}" id="label-${item._id}">
                            ${isAvailable ? "\tAvailable" : " Not Available"}
                        </label>
                    </div>
                </div>
            </div>
        </div>
        `;
        grid.innerHTML += cardHTML;
    });

    // Add event listeners AFTER rendering all cards
    addToggleListeners();
}

function addToggleListeners() {
    const switches = document.querySelectorAll('.form-check-input[type="checkbox"]');
    switches.forEach(switchEl => {
        switchEl.addEventListener('change', handleStatusToggle);
    });
}

async function handleStatusToggle(event) {
    const switchEl = event.target;
    const id = switchEl.dataset.id;
    const newStatus = switchEl.checked ? "Available" : "Not available";
    
    // Optimistically update UI
    const card = document.getElementById(`card-${id}`);
    const label = document.getElementById(`label-${id}`);
    label.textContent = newStatus;
    if (newStatus === "Available") {
        card.classList.remove("not-available");
    } else {
        card.classList.add("not-available");
    }

    // Call API to update backend
    try {
        const response = await fetch(`${ADMIN_API_URL}/items/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // Add Authorization header if your admin routes are protected
                // "Authorization": `Bearer ${localStorage.getItem("adminToken")}` 
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error("Failed to update status.");
        }
        
        const data = await response.json();
        console.log("Status updated:", data.item);

    } catch (error) {
        console.error("Error updating status:", error);
        // Revert UI on failure
        switchEl.checked = !switchEl.checked; // Flip switch back
        const oldStatus = switchEl.checked ? "Available" : "Not available";
        label.textContent = oldStatus;
         if (oldStatus === "Available") {
            card.classList.remove("not-available");
        } else {
            card.classList.add("not-available");
        }
        alert("Failed to update status. Please try again.");
    }
}