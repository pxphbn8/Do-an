import express from 'express';
import { getCart, updateCart, addProductToCart, removeProductFromCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.put('/', authenticateToken, updateCart);
router.post('/add', authenticateToken, addProductToCart);
router.delete('/remove/:productId', authenticateToken, removeProductFromCart);

export default router;
