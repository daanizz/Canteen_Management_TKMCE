
import itemModel from "../models/itemModel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

// ✅ Add Item
export const addItem = async (req, res) => {
  try {
    const { name, price, category, isVeg, imageUrl } = req.body;
    if (!name || !price || !category || isVeg === undefined || !imageUrl) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingItem = await itemModel.findOne({ name: name.toLowerCase() });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists!" });
    }

    await itemModel.create({
      name: name.toLowerCase(),
      price,
      category,
      isVeg,
      imageUrl,
    });

    return res.status(200).json({ message: "Item added successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update Item Status
export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body;

    const item = await itemModel.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found!" });

    const updatedItem = await itemModel.findByIdAndUpdate(id, changes, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get one order
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ View all orders
export const viewAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ orders, message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ View all reviews
export const viewAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find();
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.status(200).json({ reviews, message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateAt = new Date();
    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { status: "Cancelled", updateAt },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res
      .status(200)
      .json({ message: "Order cancelled successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update order status (Ready / Completed)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateAt = new Date();
    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { status, updateAt },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
