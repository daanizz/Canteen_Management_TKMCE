import itemModel from "../models/itemModel.js";
import orderModel from "../models/orderModel.js";

export const addItem = async (req, res) => {
  try {
    const { name, price, category, isVeg, imageUrl } = req.body;

    // Validation
    if (!name || !price || !category || isVeg === undefined || !imageUrl) {
      return res.status(400).json({ message: "every field is necessary!" });
    }

    const itemName = name.toLowerCase();

    // Check duplicate
    const existingItem = await itemModel.findOne({ name: itemName });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "An item already exists with the same name!!" });
    }

    // Create new item
    await itemModel.create({
      name: itemName,
      price,
      category,
      isVeg,
      imageUrl,
    });

    return res
      .status(200)
      .json({ message: "The item has been added successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    const updates = {};

    const item = await itemModel.findById(id);
    if (!item) {
      return res
        .status(400)
        .json({ message: "Item doesn't exist, or missing" });
    }

    // Compare and add only changed fields
    if (changes.price !== undefined && item.price !== changes.price) {
      updates.price = changes.price;
    }
    if (changes.category !== undefined && item.category !== changes.category) {
      updates.category = changes.category;
    }
    if (changes.status !== undefined && item.category !== changes.category) {
      updates.status = changes.status;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ message: "No changes detected" });
    }

    const updatedItem = await itemModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ mese: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "No Order found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ messsage: error });
  }
};

// PUT /orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate transitions
    if (status === "preparing" && order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be approved" });
    }

    if (status === "ready" && order.status !== "preparing") {
      return res
        .status(400)
        .json({ message: "Only preparing orders can be marked ready" });
    }

    if (status === "pickedup" && order.status !== "ready") {
      return res
        .status(400)
        .json({ message: "Only ready orders can be picked up" });
    }

    if (status === "cancelled") {
      if (!reason) {
        return res.status(400).json({ message: "Cancel reason required" });
      }
      order.cancelReason = reason;
      order.cancelAt = new Date();
    }

    // Apply status + timestamps
    order.status = status;
    if (status === "ready") order.readyAt = new Date();
    if (status === "pickedup") order.pickedUpAt = new Date();

    await order.save();

    return res
      .status(200)
      .json({ message: `Order updated to ${status}`, order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
