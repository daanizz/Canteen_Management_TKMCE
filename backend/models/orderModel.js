// import mongoose from "mongoose";

// const orderModel = new mongoose.Schema({
//   orderNumber: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     unique: true,
//   },
//   items: [
//     {
//       item: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Item",
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       total: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   isPaid: {
//     type: Boolean,
//     // required: true,
//   },
//   paidAt: {
//     type: Date,
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: ["preparing", "ready", "pickedup", "cancelled"],
//     default: "preparing",
//   },
//   updatedAt: {
//     type: Date,
//   },
//   cancelReason: {
//     type: String,
//     enum: ["Admin cancel", "User cancel", "Time out"],
//   },
// });

// export default mongoose.model("Order", orderModel);

import mongoose from "mongoose";

const orderModel = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      required: true,
      // unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Removed unique
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
        quantity: {
          // fixed typo
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
        rating: {
          type: Number,
          min: 1,
          max: 5,
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
      type: Date,
    },
    pickedUpAt: {
      type: Date,
    },
    cancelAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
      enum: ["Admin cancel", "User cancel", "Time out"],
    },
  },
  {
    timestamps: true, // automatically add createdAt & updatedAt
  }
);

export default mongoose.model("Order", orderModel);
