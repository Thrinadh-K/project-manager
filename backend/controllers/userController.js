import User from '../models/User.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const search = req.query.search
    ? { $or: [{ name: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') }] }
    : {};
  const users = await User.find(search).select('-password').sort('name');
  res.json(users);
});

export const getTeamStats = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email avatar role').lean();
  const stats = await Promise.all(
    users.map(async (user) => {
      const [totalTasks, completedTasks, projects] = await Promise.all([
        Task.countDocuments({ assignedTo: user._id }),
        Task.countDocuments({ assignedTo: user._id, status: 'Completed' }),
        Project.countDocuments({ members: user._id })
      ]);
      return { ...user, totalTasks, completedTasks, projects };
    })
  );
  res.json(stats);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.file) user.avatar = `/uploads/avatars/${req.file.filename}`;
  if (req.body.currentPassword && req.body.newPassword) {
    if (!(await user.matchPassword(req.body.currentPassword))) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }
    user.password = req.body.newPassword;
  }
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
});

export const removeUser = asyncHandler(async (req, res) => {
  await Project.updateMany({}, { $pull: { members: req.params.id } });
  await Task.updateMany({ assignedTo: req.params.id }, { $set: { assignedTo: req.user._id } });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Member removed and tasks reassigned' });
});
