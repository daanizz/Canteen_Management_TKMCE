import {
  addItem,
  updateStatus,
  getOrderDetails,
} from "../controllers/AdminFunctions.js";
import { Router } from "express";

const router = Router();

router.post("/addItem", addItem);
router.post("/updateItem/:id", updateStatus);
router.get("/orderdetails/:id", getOrderDetails);

export default router;
