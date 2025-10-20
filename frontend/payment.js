document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const amount = params.get("amount");
  const orderId = params.get("orderId");

  const container = document.getElementById("payment-box");

  if (!amount || !orderId) {
    container.innerHTML = "<p>Invalid payment request.</p>";
    return;
  }

  const upiId = "nezilshah@okicici";
  const payeeName = "TKM Canteen";
  const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`;

  container.innerHTML = `
    <div class="payment-info">
      <p><b>Pay ₹${amount}</b></p>
      <p>Scan the QR code or click the button below</p>
    </div>
    <div id="qr-code" class="qr-box"></div>
    <div class="payment-buttons">
      <a href="${upiLink}" class="pay-btn">
        <i class="fas fa-mobile-alt"></i> Pay with UPI App
      </a>
      <button id="finish-btn" class="paid-btn">
        <i class="fas fa-check"></i> I've Completed Payment
      </button>
      <a href="menu.html" class="cncl-btn">
        <i class="fas fa-times"></i> Cancel Order
      </a>
    </div>
  `;

  // Generate QR code
  new QRCode(document.getElementById("qr-code"), {
    text: upiLink,
    width: 200,
    height: 200,
  });

  // Handle payment completion
  document
    .getElementById("finish-btn")
    .addEventListener("click", async function () {
      try {
        // Update order status to paid - use full URL
        const response = await fetch(
          `http://localhost:4500/api/orders/${orderId}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "preparing" }),
          }
        );

        if (!response.ok) throw new Error("Failed to update order status");

        // Store in order history
        const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder"));
        if (pendingOrder) {
          const orderHistory =
            JSON.parse(localStorage.getItem("orderHistory")) || [];
          orderHistory.push({
            ...pendingOrder,
            isPaid: true,
            paidAt: new Date().toISOString(),
          });
          localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
          sessionStorage.removeItem("pendingOrder");
        }

        // Clear cart
        localStorage.removeItem("cart");

        // Redirect to order confirmation
        window.location.href = `order_history.html?orderId=${orderId}`;
      } catch (error) {
        console.error("Error completing payment:", error);
        alert(
          "There was an issue completing your payment. Please contact support."
        );
      }
    });
});
