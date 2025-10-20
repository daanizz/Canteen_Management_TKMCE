// // import mongoose from "mongoose";

// // const orderModel = new mongoose.Schema({
// //   orderNumber: {
// //     type: Number,
// //     required: true,
// //     unique: true,
// //   },
// //   customerId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     required: true,
// //     unique: true,
// //   },
// //   items: [
// //     {
// //       item: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "Item",
// //         required: true,
// //       },
// //       name: {
// //         type: String,
// //         required: true,
// //       },
// //       quantity: {
// //         type: Number,
// //         required: true,
// //         min: 1,
// //       },
// //       price: {
// //         type: Number,
// //         required: true,
// //       },
// //       total: {
// //         type: Number,
// //         required: true,
// //       },
// //     },
// //   ],
// //   totalPrice: {
// //     type: Number,
// //     required: true,
// //   },
// //   isPaid: {
// //     type: Boolean,
// //     // required: true,
// //   },
// //   paidAt: {
// //     type: Date,
// //   },
// //   status: {
// //     type: String,
// //     required: true,
// //     enum: ["preparing", "ready", "pickedup", "cancelled"],
// //     default: "preparing",
// //   },
// //   updatedAt: {
// //     type: Date,
// //   },
// //   cancelReason: {
// //     type: String,
// //     enum: ["Admin cancel", "User cancel", "Time out"],
// //   },
// // });

// // export default mongoose.model("Order", orderModel);

// import mongoose from "mongoose";

// // const orderModel = new mongoose.Schema(
// //   {
// //     orderNumber: {
// //       type: Number,
// //       required: true,
// //       // unique: true,
// //     },
// //     customerId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       required: true,
// //       // Removed unique
// //     },
// //     items: [
// //       {
// //         item: {
// //           type: mongoose.Schema.Types.ObjectId,
// //           ref: "Item",
// //           required: true,
// //         },
// //         name: {
// //           type: String,
// //           required: true,
// //         },
// //         quantity: {
// //           // fixed typo
// //           type: Number,
// //           required: true,
// //           min: 1,
// //         },
// //         price: {
// //           type: Number,
// //           required: true,
// //         },
// //         total: {
// //           type: Number,
// //           required: true,
// //         },
// //         rating: {
// //           type: Number,
// //           min: 1,
// //           max: 5,
// //         },
// //       },
// //     ],
// //     totalPrice: {
// //       type: Number,
// //       required: true,
// //     },
// //     isPaid: {
// //       type: Boolean,
// //       required: true,
// //     },
// //     paidAt: {
// //       type: Date,
// //     },
// //     status: {
// //       type: String,
// //       required: true,
// //       enum: ["pending", "preparing", "ready", "pickedup", "cancelled"],
// //       default: "pending",
// //     },
// //     readyAt: {
// //       type: Date,
// //     },
// //     pickedUpAt: {
// //       type: Date,
// //     },
// //     cancelAt: {
// //       type: Date,
// //     },
// //     cancelReason: {
// //       type: String,
// //       enum: ["Admin cancel", "User cancel", "Time out"],
// //     },
// //   },
// //   {
// //     timestamps: true, // automatically add createdAt & updatedAt
// //   }
// // );

// // export default mongoose.model("Order", orderModel);
// // const mongoose = require("mongoose");

// // const orderSchema = new mongoose.Schema({
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   items: [
// //     {
// //       name: String,
// //       quantity: Number,
// //       price: Number,
// //     },
// //   ],
// //   totalPrice: Number,
// //   status: { type: String, default: "New" }, // New, Ready, Completed, Cancelled
// //   createdAt: { type: Date, default: Date.now },
// //   updateAt: { type: Date },
// // });

// // export default mongoose.model("Order", orderSchema);

// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   items: [
//     {
//       name: { type: String, required: true },
//       quantity: { type: Number, required: true, min: 1 },
//       price: { type: Number, required: true, min: 0 },
//     },
//   ],
//   totalPrice: { type: Number, required: true, min: 0 },
//   status: {
//     type: String,
//     enum: ["New", "Ready", "Completed", "Cancelled"],
//     default: "New",
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date }, // fixed typo: "updateAt" → "updatedAt"
// });

// // Optional: update `updatedAt` automatically before saving
// orderSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    status: {
      type: String,
      required: true,
      enum: ["pending", "preparing", "ready", "pickedup", "cancelled"],
      default: "pending",
    },
    paidAt: {
      type: Date,
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
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
