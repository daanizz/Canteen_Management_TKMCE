// import express from "express";
// import Order from "../models/orderModel.js"; // your Order schema
// const router = express.Router();

// // POST /api/orders
// router.post("/", async (req, res) => {
//   try {
//     const { orderNumber, customerId, items, totalPrice, isPaid, status } =
//       req.body;

//     // Validate required fields
//     if (
//       !orderNumber ||
//       !customerId ||
//       !items ||
//       !totalPrice ||
//       isPaid === undefined
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Validate items array
//     if (!Array.isArray(items) || items.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Items array is required and cannot be empty" });
//     }

//     // Make sure each item has a valid ObjectId for `item`
//     for (let i = 0; i < items.length; i++) {
//       if (!items[i].item) {
//         return res
//           .status(400)
//           .json({ message: `Item at index ${i} is missing 'item' ObjectId` });
//       }
//     }

//     // Create a new order
//     const newOrder = new Order({
//       orderNumber,
//       customerId,
//       items,
//       totalPrice,
//       isPaid,
//       status,
//     });

//     // Save to DB
//     const savedOrder = await newOrder.save();

//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error("Error saving order:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to save order", error: error.message });
//   }
// });

// // GET /api/orders/:customerId - fetch orders of a specific customer
// router.get("/:customerId", async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch orders", error: error.message });
//   }
// });

// router.patch("/:orderId/rate", async (req, res) => {
//   const { orderId } = req.params;
//   const { itemId, rating } = req.body;

//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const item =
//       order.items.id(itemId) ||
//       order.items.find((i) => i.item.toString() === itemId);
//     if (!item)
//       return res.status(404).json({ message: "Item not found in order" });

//     item.rating = rating; // set rating
//     await order.save();

//     res.json({ message: "Rating saved", item });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// export default router;

// import express from "express";
// import Order from "../models/orderModel.js";

// const router = express.Router();

// // POST /api/orders
// router.post("/", async (req, res) => {
//   try {
//     const { orderNumber, customerId, items, totalPrice, isPaid, status } =
//       req.body;

//     // Validate required fields
//     if (
//       !orderNumber ||
//       !customerId ||
//       !items ||
//       !totalPrice ||
//       isPaid === undefined
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Create a new order
//     const newOrder = new Order({
//       orderNumber,
//       customerId,
//       items,
//       totalPrice,
//       isPaid,
//       status,
//       paidAt: isPaid ? new Date() : null,
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error("Error saving order:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to save order", error: error.message });
//   }
// });

// // GET /api/orders/customer/:customerId
// // In your orderRoute.js - Update the GET route
// router.get("/customer/:customerId", async (req, res) => {
//   try {
//     const { customerId } = req.params;

//     console.log("Fetching orders for customer:", customerId); // Add logging

//     const orders = await Order.find({ customerId }) // Make sure this matches your schema
//       .sort({ createdAt: -1 });

//     console.log("Found orders:", orders.length); // Add logging
//     res.status(200).json({ orders: orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch orders", error: error.message });
//   }
// });

// // PATCH /api/orders/:orderId/status
// router.patch("/:orderId/status", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.status = status;

//     // Update timestamps based on status
//     if (status === "ready") order.readyAt = new Date();
//     if (status === "pickedup") order.pickedUpAt = new Date();
//     if (status === "cancelled") order.cancelAt = new Date();

//     await order.save();
//     res.json(order);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update order", error: error.message });
//   }
// });

// export default router;

import express from "express";
import Order from "../models/orderModel.js";

const router = express.Router();

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { orderNumber, customerId, items, totalPrice, isPaid, status } =
      req.body;

    // Validate required fields
    if (
      !orderNumber ||
      !customerId ||
      !items ||
      !totalPrice ||
      isPaid === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new order
    const newOrder = new Order({
      orderNumber,
      customerId,
      items,
      totalPrice,
      isPaid,
      status,
      paidAt: isPaid ? new Date() : null,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    res
      .status(500)
      .json({ message: "Failed to save order", error: error.message });
  }
});

// GET /api/orders/customer/:customerId
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    console.log("🎯 ORDER HISTORY API HIT - Customer ID:", customerId);

    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });

    console.log("✅ Found orders:", orders.length);
    res.status(200).json({ orders: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
});

// PATCH /api/orders/:orderId/rate - ADD THIS ROUTE
router.patch("/:orderId/rate", async (req, res) => {
  const { orderId } = req.params;
  const { itemId, rating } = req.body;

  try {
    console.log(
      `📝 Rating update - Order: ${orderId}, Item: ${itemId}, Rating: ${rating}`
    );

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Find the item in the order
    const item = order.items.id(itemId);
    if (!item)
      return res.status(404).json({ message: "Item not found in order" });

    // Update the rating
    item.rating = rating;
    await order.save();

    console.log("✅ Rating saved successfully");
    res.json({ message: "Rating saved", item });
  } catch (err) {
    console.error("❌ Error saving rating:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/orders/:orderId/status
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    // Update timestamps based on status
    if (status === "ready") order.readyAt = new Date();
    if (status === "pickedup") order.pickedUpAt = new Date();
    if (status === "cancelled") order.cancelAt = new Date();

    await order.save();
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
});

export default router;
