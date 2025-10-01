// routes/itemRoutes.js
import express from 'express';
import { getItems, getItemsByCategory } from '../controllers/itemController.js';

const router = express.Router();

router.get('/', getItems);
router.get('/category/:category', getItemsByCategory);

export default router;