import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { createProject, deleteProject, getProject, getProjects, updateMembers, updateProject } from '../controllers/projectController.js';
import { objectIdParam, paginationValidators, projectValidators, validate } from '../validators/commonValidators.js';

const router = express.Router();
router.use(protect);
router.route('/').get(paginationValidators, validate, getProjects).post(authorize('Admin'), projectValidators, validate, createProject);
router.route('/:id').get(objectIdParam(), validate, getProject).put(authorize('Admin'), objectIdParam(), validate, updateProject).delete(authorize('Admin'), objectIdParam(), validate, deleteProject);
router.put('/:id/members', authorize('Admin'), objectIdParam(), validate, updateMembers);

export default router;
