document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("order-history-container");

  // Replace with actual logged-in customerId
  const customerId = "651f9c2e9f1b2a0012345678";

  try {
    const response = await fetch(`/api/orders/${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    const orderHistory = await response.json();

    if (!orderHistory || orderHistory.length === 0) {
      container.innerHTML =
        '<div class="empty-history"><p>You have no past orders.</p></div>';
      return;
    }

    orderHistory.forEach((order) => {
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

      // Loop over items in each order
      order.items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "order-item";
        itemElement.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <div class="rating-stars" 
                         id="rating-${order._id}-${item._id}" 
                         data-item-id="${item._id}" 
                         data-order-id="${order._id}">
                        <i class="far fa-star star" data-value="1"></i>
                        <i class="far fa-star star" data-value="2"></i>
                        <i class="far fa-star star" data-value="3"></i>
                        <i class="far fa-star star" data-value="4"></i>
                        <i class="far fa-star star" data-value="5"></i>
                    </div>
                `;
        orderCard.appendChild(itemElement);

        // Load rating from DB
        if (item.rating) {
          const starsContainer = itemElement.querySelector(".rating-stars");
          const allStars = starsContainer.querySelectorAll(".star");
          allStars.forEach((s) => {
            if (parseInt(s.dataset.value) <= item.rating) {
              s.classList.add("rated");
              s.classList.remove("far");
              s.classList.add("fas");
            }
          });
        }
      });

      container.appendChild(orderCard);
    });

    // Add event listeners for rating stars
    container.addEventListener("click", (event) => {
      const star = event.target.closest(".star");
      if (!star) return;

      const ratingValue = star.dataset.value;
      const starsContainer = star.closest(".rating-stars");
      const itemId = starsContainer.dataset.itemId; // use correct data attribute
      const orderId = starsContainer.dataset.orderId;

      saveRating(orderId, itemId, ratingValue);

      const allStars = starsContainer.querySelectorAll(".star");
      allStars.forEach((s) => {
        if (s.dataset.value <= ratingValue) {
          s.classList.add("rated");
          s.classList.remove("far");
          s.classList.add("fas");
        } else {
          s.classList.remove("rated");
          s.classList.add("far");
          s.classList.remove("fas");
        }
      });
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    container.innerHTML =
      '<div class="empty-history"><p>Failed to load orders.</p></div>';
  }
});

async function saveRating(orderId, itemId, rating) {
  try {
    const response = await fetch(`/api/orders/${orderId}/rate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, rating: parseInt(rating) }),
    });

    if (!response.ok) throw new Error("Failed to save rating");

    const data = await response.json();
    console.log("Rating saved:", data);
  } catch (err) {
    console.error(err);
    alert("Failed to save rating. Please try again.");
  }
}
