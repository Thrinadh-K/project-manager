import { CalendarDays, GripVertical } from 'lucide-react';
import StatusBadge from './StatusBadge';

const TaskCard = ({ task, onStatus, onEdit, onDelete, isAdmin, dragHandleProps }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start gap-2">
      <span {...dragHandleProps} className="mt-1 cursor-grab text-slate-300">
        <GripVertical size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-950">{task.title}</h3>
          <StatusBadge value={task.priority} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{task.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>{task.assignedTo?.name}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select className="input max-w-40" value={task.status} onChange={(event) => onStatus?.(task, event.target.value)}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          {isAdmin && <button className="btn-secondary" onClick={() => onEdit?.(task)}>Edit</button>}
          {isAdmin && <button className="btn-secondary text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => onDelete?.(task)}>Delete</button>}
        </div>
      </div>
    </div>
  </div>
);

export default TaskCard;
