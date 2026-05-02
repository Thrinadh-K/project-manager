const colors = {
  Pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  Completed: 'bg-green-50 text-green-700 ring-green-200',
  High: 'bg-red-50 text-red-700 ring-red-200',
  Medium: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  Low: 'bg-slate-50 text-slate-700 ring-slate-200',
  Admin: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Member: 'bg-slate-50 text-slate-700 ring-slate-200'
};

const StatusBadge = ({ value }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${colors[value] || 'bg-slate-50 text-slate-700 ring-slate-200'}`}>
    {value}
  </span>
);

export default StatusBadge;
