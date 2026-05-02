import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from '../controllers/taskController.js';
import { objectIdParam, paginationValidators, taskValidators, validate } from '../validators/commonValidators.js';

const router = express.Router();
router.use(protect);
router.route('/').get(paginationValidators, validate, getTasks).post(authorize('Admin'), upload.array('attachments', 5), taskValidators, validate, createTask);
router.route('/:id').put(objectIdParam(), validate, updateTask).delete(authorize('Admin'), objectIdParam(), validate, deleteTask);
router.patch('/:id/status', objectIdParam(), validate, updateTaskStatus);

export default router;
