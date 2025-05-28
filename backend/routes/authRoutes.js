import express from 'express'; 
const router = express.Router();
import {registerAccount, getAccounts} from '../controllers/authController.js'; // Sử dụng import cho controller

router.post('/tk', registerAccount);
router.get('/tk', getAccounts);

export default router;