import api, { normalizeApiResponse } from './api';

const studentService = {
  getMyProfile: async () => {
    const res = await api.get('/students/me');
    return normalizeApiResponse(res);
  },

  updateMyProfile: async (data) => {
    const res = await api.put('/students/me', data);
    return normalizeApiResponse(res);
  },

  getMySkills: async (type = null) => {
    const params = type ? { type } : {};
    const res = await api.get('/students/me/skills', { params });
    return normalizeApiResponse(res);
  },

  getMyConnections: async () => {
    const res = await api.get('/students/me/connections');
    return normalizeApiResponse(res);
  },

  getStudentById: async (id) => {
    const res = await api.get(`/students/${id}`);
    return normalizeApiResponse(res);
  },

  searchStudents: async (keyword = '', department = '', college = '', page = 0, size = 10) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (department) params.department = department;
    if (college) params.college = college;
    const res = await api.get('/students', { params });
    return normalizeApiResponse(res);
  },
};

export default studentService;

