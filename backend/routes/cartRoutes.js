import express from 'express';
import { getCart, updateCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.put('/', authenticateToken, updateCart);

export default router;
