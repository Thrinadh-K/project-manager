import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { getTeamStats, getUsers, removeUser, updateProfile } from '../controllers/userController.js';
import { objectIdParam, validate } from '../validators/commonValidators.js';

const router = express.Router();
router.use(protect);
router.get('/', getUsers);
router.get('/stats', authorize('Admin'), getTeamStats);
router.put('/profile', upload.single('avatar'), updateProfile);
router.delete('/:id', authorize('Admin'), objectIdParam(), validate, removeUser);

export default router;
