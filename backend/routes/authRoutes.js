import express from 'express';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loginValidators, registerValidators, validate } from '../validators/commonValidators.js';

const router = express.Router();
router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);
router.get('/me', protect, me);

export default router;
