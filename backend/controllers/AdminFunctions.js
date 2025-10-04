import { response } from "express";
import itemModel from "../models/itemModel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

// additem
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

// updateItemStatus
export const updateItemStatus = async (req, res) => {
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
    if (
      changes.isRemoved !== undefined &&
      item.isRemoved !== changes.isRemoved
    ) {
      updates.isRemoved = changes.isRemoved;
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

// getOrderDetails
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

// viewAllOrders
export const viewAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No order found!!" });
    }
    return res.status(200).json({ items, message: "success" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// viewAllReviews
export const viewAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find();
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }
    return res.status(200).json({ reviews, message: "success" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const updateAt = new Date();
    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { cancelReason, updateAt, cancelReason },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Error in finding the order" });
    }

    return res.staus(200).json({ message: "order cancelled succesfully.." });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// ready,pickedup
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
    if (!updatedOrder) {
      return res.status(404).json({ message: "Error in finding the order" });
    }

    return res.staus(200).json({ message: "order" });
  } catch (error) {
    return res.staus(200).json({ message: error });
  }
};
