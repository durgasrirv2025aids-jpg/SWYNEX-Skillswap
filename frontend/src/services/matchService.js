import api, { normalizeApiResponse } from './api';

const matchService = {
  getMatches: async () => {
    const res = await api.get('/matches');
    return normalizeApiResponse(res);
  },

  searchMatches: async (skill = '', college = '', department = '') => {
    const params = {};
    const normalizeFilter = (value) => (
      typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
    );
    const normalizedSkill = normalizeFilter(skill);
    const normalizedCollege = normalizeFilter(college);
    const normalizedDepartment = normalizeFilter(department);
    if (normalizedSkill) params.skill = normalizedSkill;
    if (normalizedCollege) params.college = normalizedCollege;
    if (normalizedDepartment) params.department = normalizedDepartment;
    const res = await api.get('/matches/search', { params });
    return normalizeApiResponse(res);
  },

  getMatchDetails: async (studentId) => {
    const res = await api.get(`/matches/${studentId}`);
    return normalizeApiResponse(res);
  },
};

export default matchService;

