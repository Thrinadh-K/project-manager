import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, FolderKanban, ListChecks } from 'lucide-react';
import api from '../services/api';
import { useApi } from '../hooks/useApi';
import Loader from '../components/Loader';
import DashboardCard from '../components/DashboardCard';

const colors = ['#4f46e5', '#2563eb', '#22c55e', '#eab308'];

const Dashboard = () => {
  const { data, loading } = useApi(() => api.get('/dashboard'), []);
  if (loading) return <Loader />;

  const statusData = data.charts.byStatus.map((item) => ({ name: item._id, value: item.count }));
  const priorityData = data.charts.byPriority.map((item) => ({ name: item._id, value: item.count }));
  const productivity = data.charts.productivity.map((item) => ({ date: item._id.slice(5), completed: item.completed }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="text-sm text-slate-500">Project health, work volume, deadlines, and recent activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard icon={FolderKanban} label="Projects" value={data.cards.totalProjects} />
        <DashboardCard icon={ListChecks} label="Tasks" value={data.cards.totalTasks} tone="blue" />
        <DashboardCard icon={CheckCircle2} label="Completed" value={data.cards.completedTasks} tone="green" />
        <DashboardCard icon={Clock} label="Pending" value={data.cards.pendingTasks} tone="yellow" />
        <DashboardCard icon={AlertTriangle} label="Overdue" value={data.cards.overdueTasks} tone="red" />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-5 xl:col-span-2">
          <h2 className="font-semibold">Team Productivity</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={productivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">Task Status</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={96} label>
                  {statusData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-5">
          <h2 className="font-semibold">Priority Mix</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">Upcoming Deadlines</h2>
          <div className="mt-4 space-y-3">
            {data.upcomingDeadlines.map((task) => (
              <div key={task._id} className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-slate-500">{task.project?.name} - {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {data.activities.map((item) => (
              <div key={item._id} className="border-l-2 border-indigo-200 pl-3">
                <p className="text-sm font-medium">{item.message}</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
