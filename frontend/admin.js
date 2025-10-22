const API_URL = "http://localhost:4500/api/admin"; // Adjust if backend hosted elsewhere

document.addEventListener("DOMContentLoaded", fetchOrders);

async function fetchOrders() {
  try {
    const response = await fetch(`${API_URL}/getOrders`);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      document.getElementById(
        "orders-grid"
      ).innerHTML = `<p class="text-danger">${data.message}</p>`;
      return;
    }

    renderOrders(data.orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

function renderOrders(orders) {
  const ordersGrid = document.getElementById("orders-grid");
  const pickupGrid = document.getElementById("pickup-grid");
  const completedGrid = document.getElementById("completed-grid"); // 1. Get new grid

  ordersGrid.innerHTML = "";
  pickupGrid.innerHTML = "";
  completedGrid.innerHTML = ""; // 2. Clear new grid

  orders.forEach((order) => {
    const orderHTML = `
      <div class="col-lg-4 col-md-6 mb-4 order-container" data-id="${
        order._id
      }">
        <div class="card order-card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            Order ID #${order._id.slice(-4)}
            <span class="badge ${getBadgeClass(order.status)}">${
      order.status
    }</span>
          </div>
          <div class="card-body">
            <h5 class="card-title mb-3"><i class="fas fa-list-check me-2"></i>Items Ordered</h5>
            <ul class="list-group list-group-flush mb-3">
              ${order.items
                .map(
                  (item) => `
                <li class="list-group-item d-flex justify-content-between">
                  <span>${item.name}</span><span>x ${item.quantity}</span>
                </li>`
                )
                .join("")}
            </ul>
            <p class="text-end total-price mt-3">Total: ₹${order.totalPrice}</p>
          </div>
          <div class="card-footer d-grid gap-2 d-sm-flex justify-content-end">
            ${renderButtons(order.status)}
          </div>
        </div>
      </div>`;

    // 3. Update sorting logic
    if (order.status === "Ready") {
      pickupGrid.innerHTML += orderHTML;
    } else if (order.status === "Completed") {
      completedGrid.innerHTML += orderHTML;
    } else if (
      order.status === "New" ||
      order.status === "Priority" ||
      order.status === "preparing" // Includes fix from previous step
    ) {
      ordersGrid.innerHTML += orderHTML;
    }
    // Cancelled orders will not be shown
  });
}

function getBadgeClass(status) {
  switch (status) {
    case "Ready":
      return "bg-success";
    case "Priority":
      return "bg-warning text-dark";
    case "Cancelled":
      return "bg-danger";
    case "Completed": // 4. Add new case
      return "bg-secondary";
    case "preparing": // Handle 'preparing' status
      return "bg-info text-dark";
    default:
      return "bg-primary";
  }
}

function renderButtons(status) {
  if (status === "Ready") {
    return `<button class="btn btn-primary w-100" onclick="completeOrder(this)">
              <i class="fas fa-clipboard-check me-2"></i>Complete Order
            </button>`;
  }
  // This logic already correctly shows no buttons for "Completed"
  if (status === "Cancelled" || status === "Completed") return "";

  // This button logic works for "New", "Priority", and "preparing"
  return `
    <button class="btn btn-success" onclick="markReady(this)">
      <i class="fas fa-check-circle me-2"></i>Ready to Pickup
    </button>
    <button class="btn btn-danger" onclick="cancelOrder(this)">
      <i class="fas fa-times-circle me-2"></i>Cancel
    </button>`;
}

// === Actions (No changes needed below) ===
async function markReady(button) {
  const id = button.closest(".order-container").dataset.id;
  await updateOrderStatus(id, "Ready");
}

async function cancelOrder(button) {
  const id = button.closest(".order-container").dataset.id;
  await updateOrderStatus(id, "Cancelled");
}

async function completeOrder(button) {
  const id = button.closest(".order-container").dataset.id;
  await updateOrderStatus(id, "Completed");
}

async function updateOrderStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/updateOrderStatus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (response.ok) {
      fetchOrders(); // Refresh orders
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Update failed:", error);
  }
}