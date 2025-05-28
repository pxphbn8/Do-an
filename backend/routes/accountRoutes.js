import express from 'express';
import { createAccount, getAllAccounts } from '../controllers/accountController.js';
import { updateAccount,  requestPasswordReset, resetPassword, handleGoogleLogin } from '../controllers/accountController.js';
const router = express.Router();

router.post('/tk', createAccount);
router.get('/tk', getAllAccounts);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/auth/google', handleGoogleLogin);

router.put('/accounts/:id', updateAccount);
export default router;

