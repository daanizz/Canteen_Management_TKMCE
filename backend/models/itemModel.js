import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Not available", "Available"],
        default: "Available"
    },
    category: {
        type: String,
        required: true,
        enum: ["Meal", "Bread", "Snack", "Beverage"]
    },
    isVeg: {
        type: Boolean,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Item", itemSchema);