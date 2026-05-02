import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';

const initial = { name: '', description: '', status: 'Planning', dueDate: '', members: [] };

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);

  const load = () => api.get('/projects', { params: { search: query, page } }).then(({ data }) => setProjects(data));
  useEffect(() => { load(); }, [query, page]);
  useEffect(() => { api.get('/users').then(({ data }) => setUsers(data)); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (editing) await api.put(`/projects/${editing._id}`, form);
    else await api.post('/projects', form);
    toast.success(`Project ${editing ? 'updated' : 'created'}`);
    setModal(false);
    setEditing(null);
    setForm(initial);
    load();
  };

  const remove = async (project) => {
    if (!confirm(`Delete ${project.name}?`)) return;
    await api.delete(`/projects/${project._id}`);
    toast.success('Project deleted');
    load();
  };

  if (!projects) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Projects</h1><p className="text-sm text-slate-500">Create, assign, search, and track project progress.</p></div>
        {user.role === 'Admin' && <button className="btn-primary" onClick={() => setModal(true)}><Plus size={18} /> New Project</button>}
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search projects" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.items.map((project) => (
          <ProjectCard key={project._id} project={project} isAdmin={user.role === 'Admin'} onEdit={() => { setEditing(project); setForm({ ...project, dueDate: project.dueDate?.slice(0, 10), members: project.members?.map((m) => m._id) || [] }); setModal(true); }} onDelete={() => remove(project)} />
        ))}
      </div>
      <Pagination page={projects.page} pages={projects.pages} onPage={setPage} />
      <Modal open={modal} title={editing ? 'Edit Project' : 'Create Project'} onClose={() => setModal(false)}>
        <form onSubmit={submit} className="grid gap-4">
          <input className="input" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <textarea className="input min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Planning</option><option>Active</option><option>On Hold</option><option>Completed</option></select>
            <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
          <select className="input" multiple value={form.members} onChange={(e) => setForm({ ...form, members: [...e.target.selectedOptions].map((o) => o.value) })}>
            {users.map((member) => <option key={member._id} value={member._id}>{member.name} - {member.role}</option>)}
          </select>
          <button className="btn-primary">{editing ? 'Save Changes' : 'Create Project'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
