import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';

const statuses = ['Pending', 'In Progress', 'Completed'];
const initial = { title: '', description: '', status: 'Pending', priority: 'Medium', assignedTo: '', project: '', dueDate: '' };

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState([]);

  const load = () => api.get('/tasks', { params: { search: query, ...filters, limit: 100 } }).then(({ data }) => setTasks(data.items));
  useEffect(() => { load(); }, [query, filters.status, filters.priority]);
  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data));
    api.get('/projects', { params: { limit: 100 } }).then(({ data }) => setProjects(data.items));
  }, []);

  const grouped = useMemo(() => Object.fromEntries(statuses.map((status) => [status, (tasks || []).filter((task) => task.status === status)])), [tasks]);

  const save = async (event) => {
    event.preventDefault();
    if (editing) {
      await api.put(`/tasks/${editing._id}`, form);
    } else {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append('attachments', file));
      await api.post('/tasks', payload);
    }
    toast.success(`Task ${editing ? 'updated' : 'created'}`);
    setModal(false);
    setEditing(null);
    setForm(initial);
    setFiles([]);
    load();
  };

  const updateStatus = async (task, status) => {
    await api.patch(`/tasks/${task._id}/status`, { status });
    setTasks((items) => items.map((item) => (item._id === task._id ? { ...item, status } : item)));
    toast.success('Task status updated');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const task = tasks.find((item) => item._id === result.draggableId);
    const status = result.destination.droppableId;
    if (task && task.status !== status) updateStatus(task, status);
  };

  const remove = async (task) => {
    if (!confirm(`Delete ${task.title}?`)) return;
    await api.delete(`/tasks/${task._id}`);
    toast.success('Task deleted');
    load();
  };

  if (!tasks) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Tasks</h1><p className="text-sm text-slate-500">Filter, assign, update, and move work through Kanban.</p></div>
        {user.role === 'Admin' && <button className="btn-primary" onClick={() => { setEditing(null); setForm(initial); setFiles([]); setModal(true); }}><Plus size={18} /> New Task</button>}
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <SearchBar value={query} onChange={setQuery} placeholder="Search tasks" />
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-5 lg:grid-cols-3">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <section ref={provided.innerRef} {...provided.droppableProps} className="min-h-96 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold">{status}</h2>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500">{grouped[status]?.length || 0}</span>
                  </div>
                  <div className="space-y-3">
                    {grouped[status].map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(drag) => (
                          <div ref={drag.innerRef} {...drag.draggableProps}>
                            <TaskCard task={task} dragHandleProps={drag.dragHandleProps} isAdmin={user.role === 'Admin'} onStatus={updateStatus} onEdit={(item) => { setEditing(item); setForm({ ...item, assignedTo: item.assignedTo?._id, project: item.project?._id, dueDate: item.dueDate?.slice(0, 10) }); setModal(true); }} onDelete={remove} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </section>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <Modal open={modal} title={editing ? 'Edit Task' : 'Create Task'} onClose={() => setModal(false)}>
        <form onSubmit={save} className="grid gap-4">
          <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required><option value="">Project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}</select>
            <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required><option value="">Assignee</option>{users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}</select>
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
            <input className="input sm:col-span-2" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            {!editing && <input className="input sm:col-span-2" type="file" multiple onChange={(e) => setFiles([...e.target.files])} />}
          </div>
          <button className="btn-primary">{editing ? 'Save Changes' : 'Create Task'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
