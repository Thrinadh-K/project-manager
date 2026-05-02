import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Member' });

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6 || form.password !== form.confirmPassword) return;
    await register(form);
    navigate('/');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <form onSubmit={submit} className="card w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold">Create your ProjectFlow account</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input className="input sm:col-span-2" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input sm:col-span-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label className="relative block">
            <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </label>
          <input className="input" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <select className="input sm:col-span-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Member</option>
            <option>Admin</option>
          </select>
          <button className="btn-primary sm:col-span-2">Signup</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-indigo-700" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
