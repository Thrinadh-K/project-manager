import Activity from '../models/Activity.js';

export const logActivity = (data) => Activity.create(data).catch(() => null);
