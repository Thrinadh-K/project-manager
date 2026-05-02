import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { logActivity } from './activityController.js';

const canAccessProject = (project, user) =>
  user.role === 'Admin' || project.members.some((id) => id.toString() === user._id.toString());

const recalcProgress = async (projectId) => {
  const [total, completed] = await Promise.all([
    Task.countDocuments({ project: projectId }),
    Task.countDocuments({ project: projectId, status: 'Completed' })
  ]);
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const update = { progress };
  if (progress === 100) update.status = 'Completed';
  await Project.findByIdAndUpdate(projectId, update);
  return progress;
};

export const createProject = asyncHandler(async (req, res) => {
  const members = Array.from(new Set([req.user._id.toString(), ...(req.body.members || [])]));
  const project = await Project.create({ ...req.body, members, createdBy: req.user._id });
  await logActivity({ type: 'Project', message: `Created project ${project.name}`, actor: req.user._id, project: project._id });
  res.status(201).json(project);
});

export const getProjects = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  const skip = (page - 1) * limit;
  const filter = req.user.role === 'Admin' ? {} : { members: req.user._id };
  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Project.find(filter).populate('members', 'name email avatar role').populate('createdBy', 'name email').sort('-createdAt').skip(skip).limit(limit),
    Project.countDocuments(filter)
  ]);
  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name email avatar role').populate('createdBy', 'name email');
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (!canAccessProject(project, req.user)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  const [tasks, activities] = await Promise.all([
    Task.find({ project: project._id }).populate('assignedTo', 'name email avatar').sort('dueDate'),
    (await import('../models/Activity.js')).default.find({ project: project._id }).populate('actor', 'name avatar').sort('-createdAt').limit(20)
  ]);
  res.json({ project, tasks, activities });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  Object.assign(project, req.body);
  await project.save();
  await logActivity({ type: 'Project', message: `Updated project ${project.name}`, actor: req.user._id, project: project._id });
  await Notification.insertMany(project.members.map((user) => ({ user, type: 'Project', message: `${project.name} was updated`, link: `/projects/${project._id}` })));
  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: 'Project deleted' });
});

export const updateMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  project.members = Array.from(new Set([project.createdBy.toString(), ...(req.body.members || [])]));
  await project.save();
  await logActivity({ type: 'Team', message: `Updated members for ${project.name}`, actor: req.user._id, project: project._id });
  res.json(await project.populate('members', 'name email avatar role'));
});

export { recalcProgress };
