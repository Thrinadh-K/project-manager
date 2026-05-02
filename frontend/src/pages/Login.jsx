import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: true });

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    const loggedIn = await login(form);
    navigate(loggedIn.role === 'Admin' ? '/' : '/tasks');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-slate-950">ProjectFlow</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage projects, tasks, and teams.</p>
        <div className="mt-8 space-y-4">
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label className="relative block">
            <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
            Remember me
          </label>
          <button className="btn-primary w-full">Login</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">New here? <Link className="font-semibold text-indigo-700" to="/signup">Create account</Link></p>
      </form>
    </div>
  );
};

export default Login;
