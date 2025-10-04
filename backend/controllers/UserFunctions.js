import reviewModel from "../models/reviewModel.js";

export const addRating = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { userId, rating } = req.body;
    if (!userId || !rating) {
      return res.status(400).json({ message: "Missing details!!" });
    }
    const newRating = await reviewModel.create({
      itemId,
      userId,
      rating,
    });
    return res.status(200).json({ message: "Review Added" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const editRating = async (req, res) => {
  try {
    const { id } = req.params;
    const newRating = req.body;
    const existingRating = await reviewModel.findById(id);
    if (!rating) {
      return res.status(404).json({ message: "No Rating found!!" });
    }
    if (newRating === existingRating.rating) {
      return res.status(400).json({ message: "No change!!" });
    }
    const updatedRating = await reviewModel.findByIdAndUpdate(
      id,
      { rating: newRating },
      { new: true }
    );
    return res.status(200).json({ updatedRating, message: "Rating updated" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await reviewModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(200).json({ message: "" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
