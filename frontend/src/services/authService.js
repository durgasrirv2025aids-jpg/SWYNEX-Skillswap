import api from './api';

const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post('/auth/login', data);
    const { data: payload } = res.data;
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify({
        studentId: payload.studentId,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
      }));
    }
    return res.data;
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;

