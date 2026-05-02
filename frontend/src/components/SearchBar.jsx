import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search' }) => (
  <label className="relative block">
    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
    <input className="input pl-10" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </label>
);

export default SearchBar;
