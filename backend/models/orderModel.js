import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
  orderNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      qunatity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
  },
  paidAt: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "preparing", "ready", "pickedup", "cancelled"],
    default: "pending",
  },
  readyAt: {
    type: date,
  },
  pickedUpAt: {
    type: date,
  },
  cancelAt: {
    type: date,
  },
  cancelReason: {
    type: String,
    enum: ["Admin cancel", "User cancel", "Time out"],
  },
});
