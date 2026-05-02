import { CalendarDays, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onEdit, onDelete, isAdmin }) => (
  <div className="card p-5 transition hover:-translate-y-1 hover:border-indigo-200">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Link to={`/projects/${project._id}`} className="text-lg font-semibold text-slate-950 hover:text-indigo-700">
          {project.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{project.description}</p>
      </div>
      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{project.status}</span>
    </div>
    <div className="mt-5">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-500">Progress</span>
        <span className="font-semibold">{project.progress || 0}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${project.progress || 0}%` }} />
      </div>
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2">
        <Users size={16} /> {project.members?.length || 0} members
      </span>
      <span className="inline-flex items-center gap-2">
        <CalendarDays size={16} /> {new Date(project.dueDate).toLocaleDateString()}
      </span>
    </div>
    {isAdmin && (
      <div className="mt-5 flex gap-2">
        <button className="btn-secondary flex-1" onClick={onEdit}>Edit</button>
        <button className="btn-secondary flex-1 text-red-600 hover:border-red-200 hover:text-red-700" onClick={onDelete}>Delete</button>
      </div>
    )}
  </div>
);

export default ProjectCard;
