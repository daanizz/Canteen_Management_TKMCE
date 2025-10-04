import express from "express";
import Order from "../models/orderModel.js"; // your Order schema
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

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items array is required and cannot be empty" });
    }

    // Make sure each item has a valid ObjectId for `item`
    for (let i = 0; i < items.length; i++) {
      if (!items[i].item) {
        return res
          .status(400)
          .json({ message: `Item at index ${i} is missing 'item' ObjectId` });
      }
    }

    // Create a new order
    const newOrder = new Order({
      orderNumber,
      customerId,
      items,
      totalPrice,
      isPaid,
      status,
    });

    // Save to DB
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    res
      .status(500)
      .json({ message: "Failed to save order", error: error.message });
  }
});

// GET /api/orders/:customerId - fetch orders of a specific customer
router.get("/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
});

router.patch("/:orderId/rate", async (req, res) => {
  const { orderId } = req.params;
  const { itemId, rating } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item =
      order.items.id(itemId) ||
      order.items.find((i) => i.item.toString() === itemId);
    if (!item)
      return res.status(404).json({ message: "Item not found in order" });

    item.rating = rating; // set rating
    await order.save();

    res.json({ message: "Rating saved", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
