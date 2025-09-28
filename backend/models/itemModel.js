import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Not available", "Available"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Snack", "Meal", "Beverages"],
    },
    isVeg: {
      type: Boolean,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", itemSchema);
