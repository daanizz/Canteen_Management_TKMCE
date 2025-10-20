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

const router = Router();

router.post("/addItem", addItem);
router.put("/updateItem/:id", updateItemStatus);
router.get("/orderdetails/:id", getOrderDetails);
router.get("/getOrders", viewAllOrders);
router.get("/getReviews", viewAllReviews);
router.put("/cancelOrder/:id", cancelOrder);
router.put("/updateOrderStatus/:id", updateOrderStatus);

export default router;
