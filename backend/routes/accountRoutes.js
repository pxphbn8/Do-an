import express from 'express';
import { createAccount, getAllAccounts } from '../controllers/accountController.js';
import { updateAccount,  requestPasswordReset, resetPassword, handleGoogleLogin, loginWithEmail, verifyEmail } from '../controllers/accountController.js';
const router = express.Router();

router.post('/tk', createAccount);
router.get('/tk', getAllAccounts);
router.get('/verify-email', verifyEmail);
router.post('/login', loginWithEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/google', handleGoogleLogin);

router.put('/accounts/:id', updateAccount);
export default router;

