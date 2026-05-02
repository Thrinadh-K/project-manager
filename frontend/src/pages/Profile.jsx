import { Camera, Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { assetUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, currentPassword: '', newPassword: '' });
  const [avatar, setAvatar] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => value && payload.append(key, value));
    if (avatar) payload.append('avatar', avatar);
    const { data } = await api.put('/users/profile', payload);
    setUser(data);
    localStorage.setItem('projectflow_user', JSON.stringify(data));
    toast.success('Profile updated');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-sm text-slate-500">Update your profile details, avatar, and password.</p></div>
      <form onSubmit={submit} className="card p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {user.avatar ? <img src={assetUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" /> : user.name?.charAt(0)}
          </div>
          <label className="btn-secondary cursor-pointer"><Camera size={18} /> Upload Image<input className="hidden" type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0])} /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input className="input" type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} placeholder="Current password" />
          <input className="input" type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="New password" minLength={6} />
        </div>
        <button className="btn-primary mt-6"><Save size={18} /> Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
