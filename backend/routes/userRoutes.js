import {
  addRating,
  editRating,
  deleteRating,
} from "../controllers/UserFunctions.js";
import { Router } from "express";

const router = Router();

router.post("/addRating/:id", addRating);
router.post("/editRating/:id", editRating);
router.post("/deleteRating/:id", editRating);

export default router;
