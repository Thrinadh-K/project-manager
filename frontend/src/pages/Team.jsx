import { Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';

const Team = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState(null);
  const [query, setQuery] = useState('');

  const load = () => api.get(user.role === 'Admin' ? '/users/stats' : '/users', { params: { search: query } }).then(({ data }) => setMembers(data));
  useEffect(() => { load(); }, [query, user.role]);

  const remove = async (member) => {
    if (!confirm(`Remove ${member.name}? Their tasks will be reassigned to you.`)) return;
    await api.delete(`/users/${member._id}`);
    toast.success('Member removed');
    load();
  };

  if (!members) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Team Members</h1><p className="text-sm text-slate-500">Invite by account creation, review member workload, and manage access.</p></div>
        <a className="btn-primary" href="/signup"><Users size={18} /> Invite Member</a>
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search team" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <div className="card p-5" key={member._id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">{member.name?.charAt(0)}</div>
                <div><p className="font-semibold">{member.name}</p><p className="text-sm text-slate-500">{member.email}</p></div>
              </div>
              <StatusBadge value={member.role} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xl font-bold">{member.projects ?? '-'}</p><p className="text-xs text-slate-500">Projects</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xl font-bold">{member.totalTasks ?? '-'}</p><p className="text-xs text-slate-500">Tasks</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xl font-bold">{member.completedTasks ?? '-'}</p><p className="text-xs text-slate-500">Done</p></div>
            </div>
            {user.role === 'Admin' && member._id !== user._id && <button className="btn-secondary mt-5 w-full text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => remove(member)}><Trash2 size={16} /> Remove</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
