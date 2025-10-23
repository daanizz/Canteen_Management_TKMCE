// Inside ../controllers/AdminFunctions.js

// ... other imports
import itemModel from "../models/itemModel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

// ✅ Add Item (UPDATED FOR FILE UPLOAD)
// ✅ Add Item (UPDATED TO INCLUDE itemId)
// ✅ Add Item (UPDATED TO USE A NUMBER FOR itemId)
export const addItem = async (req, res) => {
  try {
    // 1. Text data is in req.body
    const { name, price, category, isVeg } = req.body;

    // 2. The file's info is in req.file (from multer)
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // 3. This is the path to save in the database
    const imageUrl = `pictures/${req.file.filename}`;

    // 4. Basic validation (checking text fields)
    if (!name || !price || !category || isVeg === undefined) {
      return res.status(400).json({ message: "All text fields are required!" });
    }

    // 5. Your existing item check
    const existingItem = await itemModel.findOne({ name: name.toLowerCase() });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists!" });
    }

    // --- FIX: Generate a unique Number ---
    // Using Date.now() is a simple way to get a unique number
    const itemId = Date.now(); 
    // --- End of fix ---

    // 6. Create new item
    await itemModel.create({
      itemId: itemId, // <-- Provide the required Number
      name: name.toLowerCase(),
      price,
      category,
      isVeg: isVeg === 'true', // FormData sends booleans as strings
      imageUrl: imageUrl, // Use the new path from the uploaded file
    });

    return res.status(200).json({ message: "Item added successfully!" });
  } catch (error) {
    // Log the full error for better debugging
    console.error("Error in addItem:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ... your other controller functions (updateItemStatus, etc.) ...
// (No changes needed to the functions below)

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
      return res.status(4).json({ message: "No reviews found" });
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
