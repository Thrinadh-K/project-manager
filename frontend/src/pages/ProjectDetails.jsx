import { Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useApi } from '../hooks/useApi';
import Loader from '../components/Loader';
import TaskCard from '../components/TaskCard';

const ProjectDetails = () => {
  const { id } = useParams();
  const { data, loading, reload } = useApi(() => api.get(`/projects/${id}`), [id]);

  const updateStatus = async (task, status) => {
    await api.patch(`/tasks/${task._id}/status`, { status });
    reload();
  };

  if (loading) return <Loader />;
  const { project, tasks, activities } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">{project.description}</p>
        </div>
        <Link to="/tasks" className="btn-primary"><Plus size={18} /> Add Task</Link>
      </div>
      <section className="card p-5">
        <div className="flex justify-between text-sm"><span>Progress</span><strong>{project.progress}%</strong></div>
        <div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-indigo-600" style={{ width: `${project.progress}%` }} /></div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-3">
          <h2 className="font-semibold">All Tasks</h2>
          {tasks.map((task) => <TaskCard key={task._id} task={task} onStatus={updateStatus} />)}
        </section>
        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="font-semibold">Team Members</h2>
            <div className="mt-4 space-y-3">{project.members.map((member) => <div key={member._id} className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">{member.name?.charAt(0)}</div><div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-slate-500">{member.email}</p></div></div>)}</div>
          </section>
          <section className="card p-5">
            <h2 className="font-semibold">Activity Timeline</h2>
            <div className="mt-4 space-y-3">{activities.map((item) => <div key={item._id} className="border-l-2 border-indigo-200 pl-3"><p className="text-sm">{item.message}</p><p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p></div>)}</div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetails;
