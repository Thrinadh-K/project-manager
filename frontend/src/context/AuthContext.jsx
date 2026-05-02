import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('projectflow_user') || 'null'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('projectflow_token')));

  useEffect(() => {
    const loadMe = async () => {
      if (!localStorage.getItem('projectflow_token')) return setLoading(false);
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('projectflow_user', JSON.stringify(data.user));
      } finally {
        setLoading(false);
      }
    };
    loadMe();
  }, []);

  const authAction = async (path, payload) => {
    const { data } = await api.post(path, payload);
    localStorage.setItem('projectflow_token', data.token);
    localStorage.setItem('projectflow_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome, ${data.user.name}`);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('projectflow_token');
    localStorage.removeItem('projectflow_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login: (payload) => authAction('/auth/login', payload), register: (payload) => authAction('/auth/register', payload), logout, setUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
