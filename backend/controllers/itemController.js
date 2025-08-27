import Item from '../models/itemModel.js';

// Get all items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get items by category
export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Item.find({ category });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};