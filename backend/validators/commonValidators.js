import { body, param, query, validationResult } from 'express-validator';

export const objectIdParam = (name = 'id') => param(name).isMongoId().withMessage(`${name} must be a valid id`);

export const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
];

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  res.status(422);
  const error = new Error('Validation failed');
  error.errors = result.array();
  next(error);
};

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),
  body('role').isIn(['Admin', 'Member']).withMessage('Role must be Admin or Member')
];

export const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const projectValidators = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['Planning', 'Active', 'On Hold', 'Completed']),
  body('dueDate').isISO8601().toDate().withMessage('Valid due date is required'),
  body('members').optional().isArray(),
  body('members.*').optional().isMongoId()
];

export const taskValidators = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('assignedTo').isMongoId().withMessage('Assigned user is required'),
  body('project').isMongoId().withMessage('Project is required'),
  body('dueDate').isISO8601().toDate().withMessage('Valid due date is required')
];
