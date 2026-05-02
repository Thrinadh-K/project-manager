import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:flex">
      {open && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="min-w-0 flex-1">
        <Navbar onMenu={() => setOpen(true)} />
        <div className="mx-auto max-w-7xl p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
