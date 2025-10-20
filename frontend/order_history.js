document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("order-history-container");
  console.log("🚀 DOM Content Loaded - Order History Page");

  // ✅ Get user data from localStorage
  const userData = localStorage.getItem("user");
  console.log("👤 User data from localStorage:", userData);

  if (!userData) {
    container.innerHTML = `<p>Please log in to view your orders.</p>`;
    return;
  }

  try {
    const user = JSON.parse(userData);
    console.log("🔍 Parsed user object:", user);

    const customerId = user.id || user._id;
    console.log("👤 Customer ID from user data:", customerId);

    if (!customerId) {
      container.innerHTML = `<p>Invalid user data. Please log in again.</p>`;
      return;
    }

    // ✅ Correct route with full URL
    const apiUrl = `http://localhost:4500/api/orders/customer/${customerId}`;
    console.log("🌐 Making API request to:", apiUrl);

    const response = await fetch(apiUrl);
    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch orders: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("📦 Full response data:", data);

    // ✅ Extract orders from the response object
    const orderHistory = data.orders;
    console.log(
      "📋 Number of orders found:",
      orderHistory ? orderHistory.length : 0
    );

    if (!orderHistory || orderHistory.length === 0) {
      container.innerHTML =
        '<div class="empty-history"><p>You have no past orders.</p></div>';
      return;
    }

    console.log("🎨 Rendering orders...");

    // ✅ Display orders
    orderHistory.forEach((order, index) => {
      console.log(`📝 Rendering order ${index + 1}:`, order.orderNumber);

      const orderCard = document.createElement("div");
      orderCard.className = "order-card";
      orderCard.innerHTML = `
        <h2>Order #${order.orderNumber}</h2>
        <p><strong>Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr>
      `;

      // ✅ Loop items
      order.items.forEach((item, itemIndex) => {
        console.log(
          `🛒 Order ${index + 1} - Item ${itemIndex + 1}:`,
          item.name
        );

        const itemElement = document.createElement("div");
        itemElement.className = "order-item";
        itemElement.innerHTML = `
          <span>${item.name} (x${item.quantity}) - ₹${item.total}</span>
          <div class="rating-stars" 
               data-item-id="${item._id}" 
               data-order-id="${order._id}">
            ${[1, 2, 3, 4, 5]
              .map(
                (v) =>
                  `<i class="${
                    v <= (item.rating || 0) ? "fas" : "far"
                  } fa-star star" data-value="${v}"></i>`
              )
              .join("")}
          </div>
        `;
        orderCard.appendChild(itemElement);
      });

      container.appendChild(orderCard);
    });

    console.log("✅ All orders rendered successfully");

    // ✅ Rating click handler
    container.addEventListener("click", async (event) => {
      const star = event.target.closest(".star");
      if (!star) return;

      const ratingValue = star.dataset.value;
      const starsContainer = star.closest(".rating-stars");
      const itemId = starsContainer.dataset.itemId;
      const orderId = starsContainer.dataset.orderId;

      await saveRating(orderId, itemId, ratingValue);

      // ⭐ Update star visuals
      const allStars = starsContainer.querySelectorAll(".star");
      allStars.forEach((s) => {
        if (s.dataset.value <= ratingValue) {
          s.classList.add("fas");
          s.classList.remove("far");
        } else {
          s.classList.add("far");
          s.classList.remove("fas");
        }
      });
    });
  } catch (error) {
    console.error("❌ Error loading orders:", error);
    container.innerHTML = `<p>Failed to load orders: ${error.message}</p>`;
  }
});

async function saveRating(orderId, itemId, rating) {
  try {
    const response = await fetch(
      `http://localhost:4500/api/orders/${orderId}/rate`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, rating: parseInt(rating) }),
      }
    );
    if (!response.ok) throw new Error("Failed to save rating");
    console.log("Rating saved:", await response.json());
  } catch (err) {
    console.error(err);
    alert("Failed to save rating. Please try again.");
  }
}
