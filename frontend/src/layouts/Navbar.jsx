import { Bell, Menu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { assetUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenu }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => setNotifications(data)).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <label className="relative hidden max-w-xl flex-1 md:block">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input className="input pl-10" placeholder="Search projects, tasks, members..." />
        </label>
        <div className="ml-auto flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
            <Bell size={20} />
            {notifications.some((item) => !item.read) && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {user?.avatar ? <img src={assetUrl(user.avatar)} alt={user.name} className="h-10 w-10 rounded-full object-cover" /> : user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
