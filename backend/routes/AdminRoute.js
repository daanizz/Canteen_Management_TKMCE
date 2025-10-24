import {
  addItem,
  updateItemStatus,
  getOrderDetails,
  viewAllReviews,
  viewAllOrders,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/AdminFunctions.js";
import { Router } from "express";
import multer from "multer";
import path, { dirname }from "path";   // Import 'dirname'
import { fileURLToPath } from "url"; // Import 'fileURLToPath'
import Item from "../models/itemModel.js";

// --- ES Module fix for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// --- End of fix ---

const router = Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  // This path assumes 'AdminRoute.js' is in a 'routes' folder,
  // which is in the 'backend' folder.
  // Adjust the '..' parts if your file structure is different.
  // The goal is to get to 'frontend/pictures'
  destination: (req, file, cb) => {
    // This path now works correctly
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'pictures'));
  },
  // This creates a unique filename
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// === UPDATED /addItem ROUTE ===
// We add 'upload.single("image")' as middleware.
// It runs before 'addItem'. 'image' MUST match the FormData key.
router.post("/addItem", upload.single("image"), addItem);

// --- Other Routes ---
router.put("/updateItem/:id", updateItemStatus);
router.get("/orderdetails/:id", getOrderDetails);
router.get("/getOrders", viewAllOrders);
router.get("/getReviews", viewAllReviews);
router.put("/cancelOrder/:id", cancelOrder);
router.put("/updateOrderStatus/:id", updateOrderStatus);

export default router;

// PUT /api/admin/items/:id/status
// Updates the availability status of a single menu item
router.put("/items/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expects { "status": "Available" } or { "status": "Not available" }

    if (!["Available", "Not available"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const item = await Item.findById(id); // 'Item' is your Mongoose model

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    item.status = status;
    await item.save();

    res.json({ message: "Status updated successfully", item });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Server error updating status." });
  }
});

// You also need a route to GET all items for the admin page
// GET /api/items (You probably already have this for menu.js)
// Just ensure it's accessible to the admin page.