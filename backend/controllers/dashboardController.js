import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const projectFilter = req.user.role === 'Admin' ? {} : { members: req.user._id };
  const taskFilter = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };
  const now = new Date();

  const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks, projects, activities, tasks] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: 'Completed' }),
    Task.countDocuments({ ...taskFilter, status: { $ne: 'Completed' } }),
    Task.countDocuments({ ...taskFilter, status: { $ne: 'Completed' }, dueDate: { $lt: now } }),
    Project.find(projectFilter).populate('members', 'name avatar').sort('-updatedAt').limit(6),
    Activity.find(req.user.role === 'Admin' ? {} : { actor: req.user._id }).populate('actor', 'name avatar').sort('-createdAt').limit(10),
    Task.find(taskFilter).populate('assignedTo', 'name avatar').populate('project', 'name').sort('dueDate').limit(10)
  ]);

  const byStatus = await Task.aggregate([{ $match: taskFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
  const byPriority = await Task.aggregate([{ $match: taskFilter }, { $group: { _id: '$priority', count: { $sum: 1 } } }]);
  const productivity = await Task.aggregate([
    { $match: { ...taskFilter, status: 'Completed' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, completed: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 14 }
  ]);

  res.json({
    cards: {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
    },
    projects,
    activities,
    upcomingDeadlines: tasks.filter((task) => task.status !== 'Completed'),
    charts: { byStatus, byPriority, productivity }
  });
});
