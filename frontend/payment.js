// Get amount from query string
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");

    if (!amount) {
      document.getElementById("payment-box").innerHTML = "<p>Invalid payment request.</p>";
    } else {
      const upiId = "nezilshah@okicici";  // your UPI ID
      const payeeName = "TKM Canteen";       // your name / business
      const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`;

      const container = document.getElementById("payment-box");
      container.innerHTML = `
        <p><b>Pay ₹${amount} using UPI</b></p>
        <div id="qr-code" class="qr-box"></div>
        <br>
        <a href="${upiLink}" class="pay-btn">Pay with UPI App</a>
        <a href="#" id="finish-btn" class="paid-btn">Finshed Payment</a>
        <a href="menu.html" class="cncl-btn">Cancel Order</a>
      `;

      // Generate QR in the div
      new QRCode(document.getElementById("qr-code"), {
        text: upiLink,
        width: 250,
        height: 250
      });
    }
    document.getElementById("finish-btn").addEventListener("click", function () {
  // Get pending order
  const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder"));
  
  if (pendingOrder) {
    // Load existing order history
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    
    // Push new order into history
    orderHistory.push(pendingOrder);

    // Save back to localStorage
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    // Clear pending order
    sessionStorage.removeItem("pendingOrder");
  }

  // Redirect to order history page
  window.location.href = "order_history.html";
});
