import mongoose from "mongoose";

const ratingModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5],
  },
});

export default mongoose.model("Rating", ratingModel);
