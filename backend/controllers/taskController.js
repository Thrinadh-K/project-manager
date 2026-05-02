import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { logActivity } from './activityController.js';
import { recalcProgress } from './projectController.js';

const canMutateTask = (task, user) =>
  user.role === 'Admin' || task.assignedTo.toString() === user._id.toString();

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const attachments = (req.files || []).map((file) => ({
    name: file.originalname,
    url: `/uploads/tasks/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size
  }));

  const task = await Task.create({ ...req.body, attachments, createdBy: req.user._id });
  if (!project.members.some((id) => id.toString() === req.body.assignedTo)) {
    project.members.push(req.body.assignedTo);
    await project.save();
  }
  await Promise.all([
    recalcProgress(project._id),
    logActivity({ type: 'Task', message: `Created task ${task.title}`, actor: req.user._id, project: project._id, task: task._id }),
    Notification.create({ user: task.assignedTo, type: 'Task', message: `You were assigned: ${task.title}`, link: `/tasks` })
  ]);
  res.status(201).json(await task.populate('assignedTo', 'name email avatar'));
});

export const getTasks = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 12;
  const skip = (page - 1) * limit;
  const filter = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };

  ['status', 'priority', 'project', 'assignedTo'].forEach((field) => {
    if (req.query[field]) filter[field] = req.query[field];
  });
  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.dueBefore) filter.dueDate = { ...(filter.dueDate || {}), $lte: new Date(req.query.dueBefore) };

  const sort = req.query.sort || 'dueDate';
  const [items, total] = await Promise.all([
    Task.find(filter).populate('assignedTo', 'name email avatar').populate('project', 'name progress').sort(sort).skip(skip).limit(limit),
    Task.countDocuments(filter)
  ]);
  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (!canMutateTask(task, req.user)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  if (req.user.role !== 'Admin') {
    req.body = { status: req.body.status };
  }
  Object.assign(task, req.body);
  await task.save();
  await Promise.all([
    recalcProgress(task.project),
    logActivity({ type: 'Task', message: `Updated task ${task.title}`, actor: req.user._id, project: task.project, task: task._id })
  ]);
  res.json(await task.populate('assignedTo', 'name email avatar'));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.deleteOne();
  await recalcProgress(task.project);
  res.json({ message: 'Task deleted' });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (!canMutateTask(task, req.user)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  task.status = req.body.status;
  await task.save();
  await Promise.all([
    recalcProgress(task.project),
    logActivity({ type: 'Status', message: `Moved ${task.title} to ${task.status}`, actor: req.user._id, project: task.project, task: task._id }),
    task.status === 'Completed'
      ? Notification.create({ user: task.createdBy, type: 'Task', message: `${task.title} was completed`, link: '/tasks' })
      : Promise.resolve()
  ]);
  res.json(await task.populate('assignedTo', 'name email avatar'));
});
