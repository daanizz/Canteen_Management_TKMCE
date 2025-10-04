import {
  addItem,
  updateItemStatus,
  getOrderDetails,
  viewAllReviews,
  viewAllOrders,
} from "../controllers/AdminFunctions.js";
import { Router } from "express";

const router = Router();

router.post("/addItem", addItem);
router.post("/updateItem/:id", updateItemStatus);
router.get("/orderdetails/:id", getOrderDetails);
router.post("/getOrders", viewAllOrders);
router.get("/getReviews", viewAllReviews);

export default router;
