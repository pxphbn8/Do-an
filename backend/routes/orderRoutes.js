import express from 'express';
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:orderId', getOrderById);
router.get('/', getAllOrders);
router.patch('/:id', updateOrderStatus);

export default router;
