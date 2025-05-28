import express from 'express';
import { createPayment } from '../controllers/momoController.js';

const router = express.Router();

router.post('/momo-payment', createPayment);

export default router;
