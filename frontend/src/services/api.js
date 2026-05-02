import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const assetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiUrl.replace(/\/api\/?$/, '')}${path}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('projectflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network error. Please try again.';
    if (error.response?.status === 401) {
      localStorage.removeItem('projectflow_token');
      localStorage.removeItem('projectflow_user');
      if (!window.location.pathname.includes('/login')) window.location.href = '/login';
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
